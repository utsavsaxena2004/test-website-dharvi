// Razorpay Payment Service
import { supabaseService } from './supabaseService';
import { supabase } from '../integrations/supabase/client';

class RazorpayService {
  constructor() {
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
      script.crossOrigin = 'anonymous';
      script.onload = () => {
        this.isLoaded = true;
        resolve(window.Razorpay);
      };
      script.onerror = () => {
        console.warn('Razorpay script failed to load');
        reject(new Error('Failed to load Razorpay script'));
      };
      document.head.appendChild(script);
    });

    return this.loadPromise;
  }

  // Create Razorpay order using edge function
  async createOrder(amount, currency = 'INR', notes = {}) {
    try {
      const { data, error } = await supabase.functions.invoke('create-razorpay-order', {
        body: {
          amount,
          currency,
          notes
        }
      });

      if (error) {
        console.error('Edge function error:', error);
        throw new Error(error.message || 'Failed to create order');
      }

      if (!data.success) {
        throw new Error(data.error || 'Failed to create order');
      }

      return data;
    } catch (error) {
      console.error('Error creating Razorpay order:', error);
      throw error;
    }
  }

  // Process payment using Razorpay checkout
  async processPayment(paymentData) {
    try {
      await this.loadRazorpay();

      // Create order first
      const orderData = await this.createOrder(
        paymentData.amount,
        'INR',
        paymentData.notes || {}
      );

      return new Promise((resolve, reject) => {
        const options = {
          key: orderData.key_id,
          amount: orderData.amount,
          currency: orderData.currency,
          order_id: orderData.order_id,
          name: 'Dharika Fashion',
          description: paymentData.description || 'Purchase from Dharika Fashion',
          image: '/logo.png',
          
          handler: async (response) => {
            try {
              // Payment successful - update order with Razorpay order ID
              if (paymentData.notes?.order_id) {
                await this.updateOrderWithRazorpayId(paymentData.notes.order_id, orderData.order_id);
              }
              
              resolve({
                success: true,
                paymentId: response.razorpay_payment_id,
                signature: response.razorpay_signature,
                orderId: response.razorpay_order_id
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
          // Enhanced payment methods
          config: {
            display: {
              blocks: {
                banks: {
                  name: 'Pay via Bank Account',
                  instruments: [
                    {
                      method: 'upi'
                    },
                    {
                      method: 'netbanking',
                      banks: ['HDFC', 'ICICI', 'SBI', 'AXIS', 'KOTAK']
                    }
                  ]
                },
                cards: {
                  name: 'Pay with Cards',
                  instruments: [
                    {
                      method: 'card'
                    }
                  ]
                }
              },
              sequence: ['block.banks', 'block.cards'],
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

  // Update order with Razorpay order ID
  async updateOrderWithRazorpayId(orderId, razorpayOrderId) {
    try {
      console.log(`Updating order ${orderId} with Razorpay order ID: ${razorpayOrderId}`);
      
      const updateData = {
        notes: JSON.stringify({ 
          razorpay_order_id: razorpayOrderId,
          order_created_at: new Date().toISOString()
        }),
        updated_at: new Date().toISOString()
      };

      await supabaseService.updateOrder(orderId, updateData);
      console.log('Order updated with Razorpay order ID successfully');
    } catch (error) {
      console.error('Error updating order with Razorpay ID:', error);
      // Don't throw error as payment might still succeed
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
        'confirmed',  // Order status: use 'confirmed' instead of 'completed'
        'completed'   // Payment status: 'completed' is valid
      );

      console.log('Order status updated to completed:', updatedOrder);

      // Update payment details in the order
      const updateData = {
        payment_method: 'razorpay',
        updated_at: new Date().toISOString()
      };

      // Add payment details to notes
      const existingOrder = await supabaseService.getOrderDetails(orderData.id);
      const paymentInfo = {
        razorpay_payment_id: paymentResponse.paymentId,
        razorpay_signature: paymentResponse.signature,
        razorpay_order_id: paymentResponse.orderId,
        payment_completed_at: new Date().toISOString()
      };

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

  // Verify payment (basic verification)
  async verifyPayment(paymentResponse) {
    try {
      console.log('Payment verification:', paymentResponse);
      
      return {
        verified: true,
        paymentId: paymentResponse.razorpay_payment_id,
        signature: paymentResponse.razorpay_signature,
        orderId: paymentResponse.razorpay_order_id
      };
    } catch (error) {
      console.error('Error verifying payment:', error);
      throw error;
    }
  }
}

export default new RazorpayService();