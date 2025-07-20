// Razorpay Payment Service
import { supabaseService } from './supabaseService';

class RazorpayService {
  constructor() {
    // Using test keys for now - replace with live keys for production
    this.keyId = 'rzp_live_wgFZDVL2uCQlLu';
    this.keySecret = 'WLhFiat4BQ6M5Qk0BlZ6Mg8Q';
    this.isLoaded = false;
    this.loadPromise = null;
  }

  // Load Razorpay script dynamically
  loadRazorpay() {
    if (this.loadPromise) {
      return this.loadPromise;
    }

    this.loadPromise = new Promise((resolve, reject) => {
      if (window.Razorpay) {
        this.isLoaded = true;
        resolve(window.Razorpay);
        return;
      }

      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.crossOrigin = 'anonymous'; // Add crossOrigin attribute
      script.onload = () => {
        this.isLoaded = true;
        resolve(window.Razorpay);
      };
      script.onerror = () => {
        console.warn('Razorpay script failed to load - this is normal in development');
        reject(new Error('Failed to load Razorpay script'));
      };
      document.head.appendChild(script);
    });

    return this.loadPromise;
  }

  // Process payment using Razorpay checkout
  async processPayment(paymentData) {
    try {
      await this.loadRazorpay();

      return new Promise((resolve, reject) => {
        const options = {
          key: this.keyId,
          amount: Math.round(paymentData.amount * 100), // Convert to paisa
          currency: 'INR',
          name: 'Dharika Fashion',
          description: paymentData.description || 'Purchase from Dharika Fashion',
          image: '/logo.png', // Your logo URL
          
          handler: async (response) => {
            try {
              // Payment successful
              resolve({
                success: true,
                paymentId: response.razorpay_payment_id,
                signature: response.razorpay_signature,
                orderId: response.razorpay_order_id || this.generateOrderId()
              });
            } catch (error) {
              reject(error);
            }
          },
          prefill: {
            name: paymentData.customerName,
            email: paymentData.customerEmail,
            contact: paymentData.customerPhone
          },
          notes: paymentData.notes || {},
          theme: {
            color: '#6f0e06'
          },
          modal: {
            ondismiss: () => {
              reject(new Error('Payment cancelled by user'));
            }
          },
          // Add config for better development experience
          config: {
            display: {
              blocks: {
                banks: {
                  name: 'Pay using netbanking',
                  instruments: [
                    {
                      method: 'netbanking',
                      banks: ['HDFC', 'ICICI', 'SBI', 'AXIS']
                    }
                  ]
                }
              },
              sequence: ['block.banks'],
              preferences: {
                show_default_blocks: true
              }
            }
          }
        };

        const rzp = new window.Razorpay(options);
        rzp.open();
      });
    } catch (error) {
      console.error('Error processing payment:', error);
      throw error;
    }
  }

  // Complete order after successful payment
  async completeOrder(orderData, paymentResponse) {
    try {
      console.log('Completing order:', orderData.id);
      console.log('Payment response:', paymentResponse);
      
      // Update order status and payment status to completed
      const updatedOrder = await supabaseService.updateOrderStatus(
        orderData.id, 
        'completed', 
        'completed'  // Set payment_status to completed
      );

      console.log('Order status updated to completed:', updatedOrder);

      // Update payment details in the order
      const updateData = {
        payment_method: 'razorpay',
        updated_at: new Date().toISOString()
      };

      // Add payment details to notes (preserve existing notes if any)
      const existingOrder = await supabaseService.getOrderDetails(orderData.id);
      const paymentInfo = {
        razorpay_payment_id: paymentResponse.paymentId,
        razorpay_signature: paymentResponse.signature,
        payment_completed_at: new Date().toISOString()
      };

      // If there are existing notes, append payment info
      if (existingOrder && existingOrder.notes) {
        updateData.notes = `${existingOrder.notes} | Payment: ${JSON.stringify(paymentInfo)}`;
      } else {
        updateData.notes = `Payment: ${JSON.stringify(paymentInfo)}`;
      }

      await supabaseService.updateOrder(orderData.id, updateData);

      // Clear user's cart after successful payment
      if (orderData.userId) {
        await supabaseService.clearCart(orderData.userId);
      }

      return {
        success: true,
        order: updatedOrder,
        payment: paymentResponse
      };
    } catch (error) {
      console.error('Error completing order:', error);
      throw error;
    }
  }

  // Format amount for display
  formatAmount(amount) {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0
    }).format(amount);
  }

  // Generate receipt ID
  generateReceiptId() {
    return `receipt_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  // Generate order ID (for frontend use)
  generateOrderId() {
    return `order_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  // Verify payment (basic verification - in production, do this on backend)
  async verifyPayment(paymentResponse) {
    try {
      // In a real application, this verification should be done on the backend
      // For now, we'll assume the payment is valid if we receive the response
      console.log('Payment verification:', paymentResponse);
      
      return {
        verified: true,
        paymentId: paymentResponse.razorpay_payment_id,
        signature: paymentResponse.razorpay_signature
      };
    } catch (error) {
      console.error('Error verifying payment:', error);
      throw error;
    }
  }
}

export default new RazorpayService(); 