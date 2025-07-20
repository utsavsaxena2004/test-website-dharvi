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
    console.log("Creating Razorpay order...");
    const { amount, currency = "INR", notes = {} } = await req.json();
    console.log("Order details:", { amount, currency, notes });

    // Validate minimum amount (Razorpay minimum is ₹1)
    if (!amount || amount < 1) {
      throw new Error("Amount must be at least ₹1 for Razorpay payments");
    }

    // Get Razorpay credentials from environment
    const razorpayKeyId = Deno.env.get("RAZORPAY_KEY_ID");
    const razorpayKeySecret = Deno.env.get("RAZORPAY_KEY_SECRET");

    console.log("Key ID available:", !!razorpayKeyId);
    console.log("Key Secret available:", !!razorpayKeySecret);

    if (!razorpayKeyId || !razorpayKeySecret) {
      throw new Error("Razorpay credentials not configured");
    }

    // Create Razorpay order
    const orderData = {
      amount: Math.round(amount * 100), // Convert to paisa
      currency,
      receipt: `receipt_${Date.now()}`,
      notes,
      payment_capture: 1
    };

    console.log("Creating order with data:", orderData);

    const auth = btoa(`${razorpayKeyId}:${razorpayKeySecret}`);
    
    const response = await fetch("https://api.razorpay.com/v1/orders", {
      method: "POST",
      headers: {
        "Authorization": `Basic ${auth}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(orderData),
    });

    console.log("Razorpay API response status:", response.status);

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Razorpay API error:", errorText);
      throw new Error(`Razorpay API error: ${response.status} - ${errorText}`);
    }

    const order = await response.json();
    console.log("Order created successfully:", order.id);

    return new Response(
      JSON.stringify({
        success: true,
        order_id: order.id,
        amount: order.amount,
        currency: order.currency,
        key_id: razorpayKeyId,
        receipt: order.receipt
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      }
    );
  } catch (error) {
    console.error("Error creating Razorpay order:", error);
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: error.message 
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 500,
      }
    );
  }
});