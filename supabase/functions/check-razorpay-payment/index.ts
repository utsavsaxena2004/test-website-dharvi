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
    console.log("Checking Razorpay payment status...");
    const { orderId, razorpayOrderId } = await req.json();
    console.log("Order details:", { orderId, razorpayOrderId });

    // Get Razorpay credentials from environment
    const razorpayKeyId = Deno.env.get("RAZORPAY_KEY_ID");
    const razorpayKeySecret = Deno.env.get("RAZORPAY_KEY_SECRET");

    console.log("Key ID available:", !!razorpayKeyId);
    console.log("Key Secret available:", !!razorpayKeySecret);

    if (!razorpayKeyId || !razorpayKeySecret) {
      throw new Error("Razorpay credentials not configured");
    }

    // Fetch payment details from Razorpay
    const auth = btoa(`${razorpayKeyId}:${razorpayKeySecret}`);
    
    const response = await fetch(`https://api.razorpay.com/v1/orders/${razorpayOrderId}`, {
      method: "GET",
      headers: {
        "Authorization": `Basic ${auth}`,
        "Content-Type": "application/json",
      },
    });

    console.log("Razorpay API response status:", response.status);

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Razorpay API error:", errorText);
      throw new Error(`Razorpay API error: ${response.status} - ${errorText}`);
    }

    const razorpayOrder = await response.json();
    console.log("Razorpay order details:", razorpayOrder);

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

    console.log("Mapped status:", { paymentStatus, orderStatus });

    // Update order in Supabase using service role
    const supabase = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
      { auth: { persistSession: false } }
    );

    const { data: updateData, error: updateError } = await supabase
      .from('orders')
      .update({
        payment_status: paymentStatus,
        status: orderStatus,
        updated_at: new Date().toISOString()
      })
      .eq('id', orderId)
      .select()
      .single();

    if (updateError) {
      console.error("Error updating order:", updateError);
      throw updateError;
    }

    console.log("Order updated successfully:", updateData);

    return new Response(
      JSON.stringify({
        success: true,
        order: updateData,
        razorpayStatus: razorpayOrder.status,
        paymentStatus,
        orderStatus
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      },
    );

  } catch (error) {
    console.error("Error checking payment status:", error);
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