// Supabase Edge Function Email Service
const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Edge Function URL
const EDGE_FUNCTION_URL = `${SUPABASE_URL}/functions/v1/send-email-`;

export const sendOrderConfirmationEmail = async (orderData) => {
  try {
    const { orderId, customerInfo, orderDetails, items = [] } = orderData;
    
    // Check if Edge Function is available
    if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
      console.log('📧 Email service not configured - logging email attempt:');
      console.log('✅ Order confirmation would be sent to:', customerInfo.email);
      console.log('📋 Order details:', {
        orderId,
        customerName: customerInfo.name,
        totalAmount: orderDetails.total_amount,
        itemCount: items.length
      });
      
      return { 
        success: true, 
        messageId: `dev-${Date.now()}`,
        message: 'Email logged successfully (Edge Function not configured)'
      };
    }
    
    // Prepare data for Edge Function
    const emailData = {
      type: 'order_confirmation',
      to_email: customerInfo.email,
      to_name: customerInfo.name || customerInfo.email,
      order_id: orderId,
      order_data: {
        total_amount: `₹${orderDetails.total_amount?.toLocaleString('en-IN')}`,
        payment_method: orderDetails.payment_method,
        shipping_name: orderDetails.shipping_name,
        shipping_address: orderDetails.shipping_address,
        shipping_city: orderDetails.shipping_city,
        shipping_state: orderDetails.shipping_state,
        shipping_pincode: orderDetails.shipping_pincode,
        shipping_country: orderDetails.shipping_country,
        shipping_phone: orderDetails.shipping_phone,
        items: items.map(item => ({
          name: item.name,
          color: item.color,
          size: item.size,
          quantity: item.quantity,
          price: item.price
        }))
      }
    };

    // Call Edge Function
    const response = await fetch(EDGE_FUNCTION_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
      },
      body: JSON.stringify(emailData),
    });

    if (!response.ok) {
      // If Edge Function is not available, fall back to logging
      if (response.status === 404) {
        console.log('📧 Edge Function not deployed - logging email attempt:');
        console.log('✅ Order confirmation would be sent to:', customerInfo.email);
        console.log('📋 Order details:', {
          orderId,
          customerName: customerInfo.name,
          totalAmount: orderDetails.total_amount,
          itemCount: items.length
        });
        
        return { 
          success: true, 
          messageId: `fallback-${Date.now()}`,
          message: 'Email logged successfully (Edge Function not available)'
        };
      }
      
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    const result = await response.json();

    if (result.success) {
      console.log('✅ Order confirmation email sent successfully:', result.messageId);
      return { 
        success: true, 
        messageId: result.messageId,
        message: 'Order confirmation email sent successfully'
      };
    } else {
      throw new Error(result.error || 'Failed to send email');
    }

  } catch (error) {
    console.warn('Email service error (non-critical):', error.message);
    
    // Return success for fallback logging to not break the checkout flow
    const { orderId, customerInfo } = orderData;
    console.log('📧 Email service unavailable - logging email attempt:');
    console.log('✅ Order confirmation would be sent to:', customerInfo.email);
    console.log('📋 Order ID:', orderId);
    
    return { 
      success: true, 
      messageId: `error-fallback-${Date.now()}`,
      message: 'Email logged successfully (service unavailable)'
    };
  }
};

export const sendOrderStatusUpdateEmail = async (orderData, newStatus) => {
  try {
    const { orderId, customerInfo, orderDetails } = orderData;

    // Check if Edge Function is available
    if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
      console.log('📧 Email service not configured - logging status update:');
      console.log('✅ Status update would be sent to:', customerInfo.email);
      console.log('📋 Status update:', { orderId, newStatus });
      
      return { 
        success: true, 
        messageId: `dev-status-${Date.now()}`,
        message: 'Status update logged successfully (Edge Function not configured)'
      };
    }

    // Prepare data for Edge Function
    const emailData = {
      type: 'status_update',
      to_email: customerInfo.email,
      to_name: customerInfo.name || customerInfo.email,
      order_id: orderId,
      new_status: newStatus,
      order_data: {
        total_amount: `₹${orderDetails.total_amount?.toLocaleString('en-IN')}`,
      }
    };

    // Call Edge Function
    const response = await fetch(EDGE_FUNCTION_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
      },
      body: JSON.stringify(emailData),
    });

    if (!response.ok) {
      // If Edge Function is not available, fall back to logging
      if (response.status === 404) {
        console.log('📧 Edge Function not deployed - logging status update:');
        console.log('✅ Status update would be sent to:', customerInfo.email);
        console.log('📋 Status update:', { orderId, newStatus });
        
        return { 
          success: true, 
          messageId: `fallback-status-${Date.now()}`,
          message: 'Status update logged successfully (Edge Function not available)'
        };
      }
      
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    const result = await response.json();

    if (result.success) {
      console.log('✅ Status update email sent successfully:', result.messageId);
      return { 
        success: true, 
        messageId: result.messageId,
        message: 'Status update email sent successfully'
      };
    } else {
      throw new Error(result.error || 'Failed to send email');
    }

  } catch (error) {
    console.warn('Email service error (non-critical):', error.message);
    
    // Return success for fallback logging to not break the admin flow
    const { orderId, customerInfo } = orderData;
    console.log('📧 Email service unavailable - logging status update:');
    console.log('✅ Status update would be sent to:', customerInfo.email);
    console.log('📋 Order ID:', orderId, 'New Status:', newStatus);
    
    return { 
      success: true, 
      messageId: `error-fallback-status-${Date.now()}`,
      message: 'Status update logged successfully (service unavailable)'
    };
  }
};

export default { 
  sendOrderConfirmationEmail, 
  sendOrderStatusUpdateEmail
}; 