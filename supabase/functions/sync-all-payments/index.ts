import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    console.log("Syncing all pending payments with Razorpay...");

    // Get Razorpay credentials from environment
    const razorpayKeyId = Deno.env.get("RAZORPAY_KEY_ID");
    const razorpayKeySecret = Deno.env.get("RAZORPAY_KEY_SECRET");

    if (!razorpayKeyId || !razorpayKeySecret) {
      throw new Error("Razorpay credentials not configured");
    }

    const auth = btoa(`${razorpayKeyId}:${razorpayKeySecret}`);

    // Initialize Supabase client using service role
    const supabase = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
      { auth: { persistSession: false } }
    );

    // Get all pending orders that have Razorpay order IDs in notes
    const { data: pendingOrders, error: fetchError } = await supabase
      .from('orders')
      .select('*')
      .eq('payment_status', 'pending')
      .not('notes', 'is', null);

    if (fetchError) {
      console.error("Error fetching pending orders:", fetchError);
      throw fetchError;
    }

    console.log(`Found ${pendingOrders?.length || 0} pending orders`);

    const results = [];

    for (const order of pendingOrders || []) {
      try {
        // Extract Razorpay order ID from notes
        let razorpayOrderId = null;
        
        if (order.notes) {
          // Try to parse notes as JSON to get razorpay_order_id
          try {
            const notesData = JSON.parse(order.notes);
            razorpayOrderId = notesData.razorpay_order_id;
          } catch {
            // If not JSON, check if it contains order ID pattern
            const orderIdMatch = order.notes.match(/order_[A-Za-z0-9]+/);
            if (orderIdMatch) {
              razorpayOrderId = orderIdMatch[0];
            }
          }
        }

        if (!razorpayOrderId) {
          console.log(`No Razorpay order ID found for order ${order.id}`);
          continue;
        }

        console.log(`Checking Razorpay order: ${razorpayOrderId} for order: ${order.id}`);

        // Fetch payment details from Razorpay
        const response = await fetch(`https://api.razorpay.com/v1/orders/${razorpayOrderId}`, {
          method: "GET",
          headers: {
            "Authorization": `Basic ${auth}`,
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) {
          console.error(`Razorpay API error for order ${razorpayOrderId}: ${response.status}`);
          continue;
        }

        const razorpayOrder = await response.json();
        console.log(`Razorpay order ${razorpayOrderId} status:`, razorpayOrder.status);

        // Map Razorpay status to our payment status
        let paymentStatus = 'pending';
        let orderStatus = 'pending';
        
        if (razorpayOrder.status === 'paid') {
          paymentStatus = 'completed';
          orderStatus = 'confirmed';
        } else if (razorpayOrder.status === 'created' || razorpayOrder.status === 'attempted') {
          paymentStatus = 'pending';
          orderStatus = 'pending';
        } else {
          paymentStatus = 'failed';
          orderStatus = 'cancelled';
        }

        // Update order status if it changed
        if (paymentStatus !== order.payment_status) {
          const { error: updateError } = await supabase
            .from('orders')
            .update({
              payment_status: paymentStatus,
              status: orderStatus,
              updated_at: new Date().toISOString()
            })
            .eq('id', order.id);

          if (updateError) {
            console.error(`Error updating order ${order.id}:`, updateError);
          } else {
            console.log(`Updated order ${order.id}: ${order.payment_status} -> ${paymentStatus}`);
            results.push({
              orderId: order.id,
              razorpayOrderId,
              oldStatus: order.payment_status,
              newStatus: paymentStatus,
              updated: true
            });
          }
        } else {
          results.push({
            orderId: order.id,
            razorpayOrderId,
            status: paymentStatus,
            updated: false
          });
        }

      } catch (error) {
        console.error(`Error processing order ${order.id}:`, error);
        results.push({
          orderId: order.id,
          error: error.message,
          updated: false
        });
      }
    }

    console.log("Sync completed. Results:", results);

    return new Response(
      JSON.stringify({
        success: true,
        message: `Processed ${pendingOrders?.length || 0} orders`,
        results,
        updatedCount: results.filter(r => r.updated).length
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      },
    );

  } catch (error) {
    console.error("Error syncing payments:", error);
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: error.message 
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 500,
      },
    );
  }
});