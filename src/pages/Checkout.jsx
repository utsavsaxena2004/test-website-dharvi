import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useCart } from '../contexts/CartContext';
import { supabaseService } from '../services/supabaseService';
import razorpayService from '../services/razorpayService';
import { sendOrderConfirmationEmail } from '../services/emailService';
import { useToast } from '../hooks/use-toast.jsx';
import statePersistence from '../utils/statePersistence';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  ShoppingCart, 
  CreditCard, 
  Truck, 
  MapPin, 
  Phone, 
  Mail, 
  User,
  ArrowLeft,
  Shield,
  Check,
  AlertCircle,
  Clock,
  Eye
} from 'lucide-react';

const Checkout = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  const { cartItems, cartSummary, clearCart } = useCart();
  const { toast } = useToast();
  
  const [loading, setLoading] = useState(false);
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [orderDetails, setOrderDetails] = useState(null);
  const [step, setStep] = useState(1); // 1: Shipping, 2: Payment, 3: Success
  const [checkoutCompleted, setCheckoutCompleted] = useState(false);
  
  const [shippingData, setShippingData] = useState({
    full_name: '',
    email: '',
    phone: '',
    address_line1: '',
    address_line2: '',
    city: '',
    state: '',
    postal_code: '',
    country: 'India'
  });

  const [paymentMethod, setPaymentMethod] = useState('razorpay');

  // Redirect if not authenticated or cart is empty (but not if checkout is completed)
  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    
    // Don't redirect if checkout is completed or order is placed (success screen)
    if (checkoutCompleted || orderPlaced || step === 3) {
      return;
    }
    
    if (!cartItems || cartItems.length === 0) {
      navigate('/cart');
      return;
    }
  }, [isAuthenticated, cartItems, navigate, checkoutCompleted, orderPlaced, step]);

  // Prevent any unintended redirects when showing success screen
  useEffect(() => {
    if (step === 3 && orderPlaced && checkoutCompleted) {
      // Ensure we stay on checkout page for success screen
      console.log('✅ Showing success screen - preventing redirects');
    }
  }, [step, orderPlaced, checkoutCompleted]);

  // Load saved form data and step on component mount
  useEffect(() => {
    const savedFormData = statePersistence.loadCheckoutForm();
    const savedStep = statePersistence.loadCheckoutStep();
    
    if (savedFormData) {
      setShippingData(prev => ({
        ...prev,
        ...savedFormData
      }));
    }
    
    // Only load saved step if checkout is not completed and order is not placed
    if (savedStep && savedStep >= 1 && savedStep <= 3 && !checkoutCompleted && !orderPlaced) {
      setStep(savedStep);
    }
  }, []);

  // Pre-fill user data (but don't override saved data)
  useEffect(() => {
    if (user) {
      setShippingData(prev => ({
        ...prev,
        // Only set if field is empty (preserve saved data)
        full_name: prev.full_name || user.user_metadata?.full_name || '',
        email: prev.email || user.email || '',
        phone: prev.phone || user.user_metadata?.phone || ''
      }));
    }
  }, [user]);

  // Save form data whenever it changes
  useEffect(() => {
    // Don't save if all fields are empty (initial state)
    const hasData = Object.values(shippingData).some(value => value && value.trim());
    if (hasData) {
      statePersistence.saveCheckoutForm(shippingData);
    }
  }, [shippingData]);

  // Save step whenever it changes
  useEffect(() => {
    statePersistence.saveCheckoutStep(step);
  }, [step]);

  const handleShippingChange = (e) => {
    setShippingData({
      ...shippingData,
      [e.target.name]: e.target.value
    });
  };

  const validateShippingForm = () => {
    const required = ['full_name', 'email', 'phone', 'address_line1', 'city', 'state', 'postal_code'];
    const missing = required.filter(field => !shippingData[field]?.trim());
    
    if (missing.length > 0) {
      toast({
        title: "Missing Information",
        description: `Please fill in: ${missing.join(', ').replace(/_/g, ' ')}`,
        variant: "destructive"
      });
      return false;
    }
    
    return true;
  };

  const handleContinueToPayment = () => {
    if (validateShippingForm()) {
      setStep(2);
    }
  };

  const createOrder = async () => {
    try {
      // Prepare order items
      // Prepare order items from cart items
      console.log('Cart items before creating order:', cartItems);
      const orderItems = cartItems.map(item => {
        console.log('Processing cart item:', item);
        return {
          product_id: item.product_id || item.master_product_id,
          quantity: item.quantity,
          price: item.products?.price || item.master_products?.price || 0,
          size: item.size,
          color: item.color
        };
      });
      console.log('Prepared order items:', orderItems);

      // Create order in database
      console.log('Current user:', user);
      console.log('User ID:', user?.id);
      console.log('Is authenticated:', isAuthenticated);
      
      if (!user || !user.id) {
        throw new Error('User is not authenticated or user ID is missing');
      }
      
      const orderData = {
        user_id: user.id,
        total_amount: cartSummary.total,
        shipping_amount: 0, // Free shipping
        tax_amount: 0,
        payment_method: paymentMethod,
        payment_status: 'pending',
        status: 'pending',
        shipping_address_line1: shippingData.address_line1,
        shipping_address_line2: shippingData.address_line2,
        shipping_city: shippingData.city,
        shipping_state: shippingData.state,
        shipping_postal_code: shippingData.postal_code,
        shipping_country: shippingData.country,
        shipping_phone: shippingData.phone,
        notes: `Customer: ${shippingData.full_name}, Email: ${shippingData.email}`
      };
      
      console.log('Order data to be created:', orderData);

      const order = await supabaseService.createOrder(orderData, orderItems);
      return order;
    } catch (error) {
      console.error('Error creating order:', error);
      throw error;
    }
  };

  const handlePayment = async () => {
    try {
      setLoading(true);

      // Create order in database first
      const order = await createOrder();
      
      // Process payment with Razorpay
      const paymentData = {
        amount: cartSummary.total,
        customerName: shippingData.full_name,
        customerEmail: shippingData.email,
        customerPhone: shippingData.phone,
        description: `Order #${order.id.slice(0, 8)} - Dharika Fashion`,
        notes: {
          order_id: order.id,
          items_count: cartItems.length
        }
      };

      const paymentResult = await razorpayService.processPayment(paymentData);

      if (paymentResult.success) {
        // Complete the order
        await razorpayService.completeOrder(
          { id: order.id, userId: user.id },
          paymentResult
        );

        // Send order confirmation email
        try {
          const emailData = {
            orderId: order.id,
            customerInfo: {
              name: shippingData.full_name,
              email: shippingData.email
            },
            orderDetails: {
              total_amount: cartSummary.total,
              payment_method: 'Razorpay',
              shipping_name: shippingData.full_name,
              shipping_address: shippingData.address_line1,
              shipping_city: shippingData.city,
              shipping_state: shippingData.state,
              shipping_pincode: shippingData.postal_code,
              shipping_country: shippingData.country,
              shipping_phone: shippingData.phone
            },
            items: cartItems.map(item => ({
              name: item.products?.name || 'Product',
              image_url: item.products?.image_urls?.[0] || '',
              color: item.color,
              size: item.size,
              quantity: item.quantity,
              price: item.products?.price || 0
            }))
          };
          
          const emailResult = await sendOrderConfirmationEmail(emailData);
          if (emailResult.success) {
            console.log('Order confirmation email sent successfully');
          } else {
            console.warn('Failed to send order confirmation email:', emailResult.error);
          }
        } catch (emailError) {
          console.error('Error sending order confirmation email:', emailError);
        }

        // Clear saved checkout data on successful payment
        statePersistence.clearCheckoutForm();
        statePersistence.clearCheckoutStep();

        // Set completion states first, before clearing cart
        setStep(3);
        setOrderPlaced(true);
        setCheckoutCompleted(true);
        setOrderDetails({ ...order, payment: paymentResult });

        // Clear cart after setting success states
        await clearCart();

        toast({
          title: "Payment Successful!",
          description: "Your order has been placed successfully.",
        });
      }
    } catch (error) {
      console.error('Payment error:', error);
      toast({
        title: "Payment Failed",
        description: error.message || "There was an error processing your payment. Please try again.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const formatPrice = (price) => {
    return `₹${price?.toLocaleString('en-IN') || 0}`;
  };

  // Don't render if not authenticated, but allow rendering if checkout is completed
  if (!isAuthenticated) {
    return null; // Will redirect
  }
  
  // Don't render if cart is empty UNLESS checkout is completed (showing success screen)
  if ((!cartItems || cartItems.length === 0) && !checkoutCompleted && !orderPlaced && step !== 3) {
    return null; // Will redirect
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-50 via-white to-pink-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-rose-100">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button
                variant="ghost"
                onClick={() => navigate('/cart')}
                className="text-gray-600 hover:text-[#6f0e06]"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Cart
              </Button>
              <div className="h-6 w-px bg-gray-300" />
              <h1 className="text-2xl font-serif text-gray-900">Checkout</h1>
            </div>
            <div className="flex items-center space-x-2 text-sm text-gray-600">
              <Shield className="w-4 h-4" />
              <span>Secure Checkout</span>
            </div>
          </div>
        </div>
      </div>

      {/* Progress Steps */}
      <div className="max-w-7xl mx-auto px-6 py-6">
        <div className="flex items-center justify-center space-x-8 mb-8">
          {[
            { number: 1, title: 'Shipping', icon: Truck },
            { number: 2, title: 'Payment', icon: CreditCard },
            { number: 3, title: 'Success', icon: Check }
          ].map((stepItem, index) => (
            <div key={stepItem.number} className="flex items-center">
              <div className={`flex items-center justify-center w-10 h-10 rounded-full border-2 ${
                step >= stepItem.number
                  ? 'bg-[#6f0e06] border-[#6f0e06] text-white'
                  : 'border-gray-300 text-gray-400'
              }`}>
                {step > stepItem.number ? (
                  <Check className="w-5 h-5" />
                ) : (
                  <stepItem.icon className="w-5 h-5" />
                )}
              </div>
              <span className={`ml-2 text-sm font-medium ${
                step >= stepItem.number ? 'text-[#6f0e06]' : 'text-gray-400'
              }`}>
                {stepItem.title}
              </span>
              {index < 2 && (
                <div className={`w-16 h-px mx-4 ${
                  step > stepItem.number ? 'bg-[#6f0e06]' : 'bg-gray-300'
                }`} />
              )}
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {step === 1 && (
              <div className="animate-fade-in">
                <Card className="border-rose-200 bg-white/70 backdrop-blur-sm">
                  <CardHeader className="bg-gradient-to-r from-[#6f0e06] to-[#9a1549] text-white rounded-t-lg">
                    <CardTitle className="flex items-center">
                      <MapPin className="w-5 h-5 mr-2" />
                      Shipping Information
                    </CardTitle>
                    <CardDescription className="text-white/90">
                      Enter your delivery address details
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="p-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          <User className="w-4 h-4 inline mr-1" />
                          Full Name *
                        </label>
                        <Input
                          name="full_name"
                          value={shippingData.full_name}
                          onChange={handleShippingChange}
                          placeholder="Enter your full name"
                          required
                          className="border-rose-200 focus:border-[#6f0e06]"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          <Mail className="w-4 h-4 inline mr-1" />
                          Email Address *
                        </label>
                        <Input
                          name="email"
                          type="email"
                          value={shippingData.email}
                          onChange={handleShippingChange}
                          placeholder="Enter your email"
                          required
                          className="border-rose-200 focus:border-[#6f0e06]"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          <Phone className="w-4 h-4 inline mr-1" />
                          Phone Number *
                        </label>
                        <Input
                          name="phone"
                          value={shippingData.phone}
                          onChange={handleShippingChange}
                          placeholder="Enter your phone number"
                          required
                          className="border-rose-200 focus:border-[#6f0e06]"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Postal Code *
                        </label>
                        <Input
                          name="postal_code"
                          value={shippingData.postal_code}
                          onChange={handleShippingChange}
                          placeholder="Enter postal code"
                          required
                          className="border-rose-200 focus:border-[#6f0e06]"
                        />
                      </div>
                      <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Address Line 1 *
                        </label>
                        <Input
                          name="address_line1"
                          value={shippingData.address_line1}
                          onChange={handleShippingChange}
                          placeholder="Street address, apartment, suite, etc."
                          required
                          className="border-rose-200 focus:border-[#6f0e06]"
                        />
                      </div>
                      <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Address Line 2
                        </label>
                        <Input
                          name="address_line2"
                          value={shippingData.address_line2}
                          onChange={handleShippingChange}
                          placeholder="Apartment, suite, etc. (optional)"
                          className="border-rose-200 focus:border-[#6f0e06]"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          City *
                        </label>
                        <Input
                          name="city"
                          value={shippingData.city}
                          onChange={handleShippingChange}
                          placeholder="Enter city"
                          required
                          className="border-rose-200 focus:border-[#6f0e06]"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          State *
                        </label>
                        <Input
                          name="state"
                          value={shippingData.state}
                          onChange={handleShippingChange}
                          placeholder="Enter state"
                          required
                          className="border-rose-200 focus:border-[#6f0e06]"
                        />
                      </div>
                    </div>
                    
                    <div className="mt-6 flex justify-end">
                      <Button
                        onClick={handleContinueToPayment}
                        className="bg-[#6f0e06] hover:bg-[#9a1549] text-white px-8 py-3"
                      >
                        Continue to Payment
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}

            {step === 2 && (
              <div className="animate-fade-in">
                <Card className="border-rose-200 bg-white/70 backdrop-blur-sm">
                  <CardHeader className="bg-gradient-to-r from-[#6f0e06] to-[#9a1549] text-white rounded-t-lg">
                    <CardTitle className="flex items-center">
                      <CreditCard className="w-5 h-5 mr-2" />
                      Payment Method
                    </CardTitle>
                    <CardDescription className="text-white/90">
                      Choose your preferred payment method
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="p-6">
                    <div className="space-y-4">
                      <div className="border border-rose-200 rounded-lg p-4 bg-gradient-to-r from-rose-50 to-pink-50">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-3">
                            <div className="w-12 h-8 bg-[#6f0e06] rounded flex items-center justify-center">
                              <span className="text-white text-xs font-bold">RZP</span>
                            </div>
                            <div>
                              <h3 className="font-medium text-gray-900">Razorpay</h3>
                              <p className="text-sm text-gray-600">UPI, Cards, Net Banking, Wallets</p>
                            </div>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Badge variant="secondary" className="bg-green-100 text-green-800">
                              Secure
                            </Badge>
                            <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                              Instant
                            </Badge>
                          </div>
                        </div>
                      </div>

                      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                        <div className="flex items-start space-x-3">
                          <AlertCircle className="w-5 h-5 text-blue-600 mt-0.5" />
                          <div>
                            <h4 className="font-medium text-blue-900">Secure Payment</h4>
                            <p className="text-sm text-blue-700 mt-1">
                              Your payment information is encrypted and secure. We support all major payment methods including UPI, debit/credit cards, and net banking.
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="mt-6 flex justify-between">
                      <Button
                        variant="outline"
                        onClick={() => setStep(1)}
                        className="border-rose-200 hover:bg-rose-50"
                      >
                        Back to Shipping
                      </Button>
                      <Button
                        onClick={handlePayment}
                        disabled={loading}
                        className="bg-[#6f0e06] hover:bg-[#9a1549] text-white px-8 py-3"
                      >
                        {loading ? 'Processing...' : `Pay ${formatPrice(cartSummary.total)}`}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}

            {step === 3 && orderPlaced && (
              <div className="animate-fade-in space-y-6">
                {/* Main Success Card */}
                <Card className="border-green-200 bg-white/70 backdrop-blur-sm overflow-hidden">
                  <div className="bg-gradient-to-r from-green-500 to-emerald-600 px-8 py-6 text-white">
                    <div className="flex items-center justify-center space-x-3">
                      <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center">
                        <Check className="w-8 h-8 text-white" />
                      </div>
                      <div className="text-center">
                        <h2 className="text-2xl font-serif">Thank You!</h2>
                        <p className="text-white/90 mt-1">Your order has been confirmed</p>
                      </div>
                    </div>
                  </div>
                  
                  <CardContent className="p-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      {/* Order Information */}
                      <div className="space-y-4">
                        <div>
                          <h3 className="font-semibold text-gray-900 mb-3">Order Details</h3>
                          <div className="space-y-2 text-sm">
                            <div className="flex justify-between">
                              <span className="text-gray-600">Order ID:</span>
                              <span className="font-medium">#{orderDetails?.id?.slice(0, 8)}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-600">Payment ID:</span>
                              <span className="font-medium font-mono text-xs">{orderDetails?.payment?.paymentId}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-600">Amount Paid:</span>
                              <span className="font-medium text-green-600">{formatPrice(cartSummary.total)}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-600">Payment Method:</span>
                              <span className="font-medium">Razorpay</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-600">Order Date:</span>
                              <span className="font-medium">{new Date().toLocaleDateString()}</span>
                            </div>
                          </div>
                        </div>

                        {/* Shipping Information */}
                        <div className="pt-4 border-t border-gray-200">
                          <h3 className="font-semibold text-gray-900 mb-3">Shipping Address</h3>
                          <div className="text-sm text-gray-600 space-y-1">
                            <p className="font-medium text-gray-900">{shippingData.full_name}</p>
                            <p>{shippingData.address_line1}</p>
                            {shippingData.address_line2 && <p>{shippingData.address_line2}</p>}
                            <p>{shippingData.city}, {shippingData.state} {shippingData.postal_code}</p>
                            <p>{shippingData.country}</p>
                            <p className="pt-2">📞 {shippingData.phone}</p>
                            <p>📧 {shippingData.email}</p>
                          </div>
                        </div>
                      </div>

                      {/* Delivery Information & Next Steps */}
                      <div className="space-y-4">
                        <div>
                          <h3 className="font-semibold text-gray-900 mb-3">Delivery Information</h3>
                          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                            <div className="flex items-center space-x-3">
                              <Truck className="w-5 h-5 text-blue-600" />
                              <div>
                                <p className="font-medium text-blue-900">Estimated Delivery</p>
                                <p className="text-sm text-blue-700">
                                  {new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toLocaleDateString()} - {new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toLocaleDateString()}
                                </p>
                                <p className="text-xs text-blue-600 mt-1">5-7 business days</p>
                              </div>
                            </div>
                          </div>
                        </div>

                        <div>
                          <h3 className="font-semibold text-gray-900 mb-3">What's Next?</h3>
                          <div className="space-y-3">
                            <div className="flex items-start space-x-3">
                              <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                                <Check className="w-3 h-3 text-green-600" />
                              </div>
                              <div>
                                <p className="text-sm font-medium text-gray-900">Order Confirmation</p>
                                <p className="text-xs text-gray-600">You'll receive an email confirmation shortly</p>
                              </div>
                            </div>
                            <div className="flex items-start space-x-3">
                              <div className="w-6 h-6 bg-yellow-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                                <Clock className="w-3 h-3 text-yellow-600" />
                              </div>
                              <div>
                                <p className="text-sm font-medium text-gray-900">Processing</p>
                                <p className="text-xs text-gray-600">We'll start preparing your order within 24 hours</p>
                              </div>
                            </div>
                            <div className="flex items-start space-x-3">
                              <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                                <Truck className="w-3 h-3 text-blue-600" />
                              </div>
                              <div>
                                <p className="text-sm font-medium text-gray-900">Shipping Updates</p>
                                <p className="text-xs text-gray-600">Track your order in the Orders section</p>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Order Items Summary */}
                    <div className="mt-8 pt-6 border-t border-gray-200">
                      <h3 className="font-semibold text-gray-900 mb-4">Items Ordered ({cartItems.length})</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {cartItems.map((item) => (
                          <div key={item.id} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                            <div className="w-16 h-16 bg-gray-200 rounded-lg flex items-center justify-center overflow-hidden">
                              {item.products?.image_urls?.[0] ? (
                                <img 
                                  src={item.products.image_urls[0]} 
                                  alt={item.products.name}
                                  className="w-full h-full object-cover"
                                />
                              ) : (
                                <div className="w-full h-full bg-gray-300 rounded-lg" />
                              )}
                            </div>
                            <div className="flex-1">
                              <h4 className="font-medium text-gray-900 text-sm">{item.products?.name}</h4>
                              <div className="text-xs text-gray-600 space-y-1">
                                <p>Quantity: {item.quantity}</p>
                                {item.size && <p>Size: {item.size}</p>}
                                {item.color && <p>Color: {item.color}</p>}
                              </div>
                              <p className="text-sm font-medium text-[#6f0e06] mt-1">
                                {formatPrice(item.products?.price * item.quantity)}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                    
                    {/* Action Buttons */}
                    <div className="flex flex-col sm:flex-row gap-4 mt-8 pt-6 border-t border-gray-200">
                      <Button
                        onClick={() => navigate('/orders')}
                        className="flex-1 bg-[#6f0e06] hover:bg-[#9a1549] text-white py-3"
                      >
                        <Eye className="w-4 h-4 mr-2" />
                        Track Your Order
                      </Button>
                      <Button
                        onClick={() => navigate('/')}
                        variant="outline"
                        className="flex-1 border-rose-200 hover:bg-rose-50 py-3"
                      >
                        Continue Shopping
                      </Button>
                    </div>

                    {/* Support Information */}
                    <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                      <div className="flex items-center space-x-2 mb-2">
                        <Phone className="w-4 h-4 text-gray-600" />
                        <span className="text-sm font-medium text-gray-900">Need Help?</span>
                      </div>
                      <p className="text-xs text-gray-600">
                        Contact our customer support at <span className="font-medium">support@dharikafashion.com</span> or 
                        call <span className="font-medium">+91 98765 43210</span> for any questions about your order.
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}
          </div>

          {/* Order Summary Sidebar */}
          <div className="lg:col-span-1">
            <Card className="border-rose-200 bg-white/70 backdrop-blur-sm sticky top-6">
              <CardHeader className="bg-gradient-to-r from-[#6f0e06] to-[#9a1549] text-white rounded-t-lg">
                <CardTitle className="flex items-center">
                  <ShoppingCart className="w-5 h-5 mr-2" />
                  Order Summary
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="space-y-4">
                  {cartItems.map((item) => (
                    <div key={item.id} className="flex items-center space-x-3 pb-3 border-b border-gray-100">
                      <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
                        {item.products?.image_urls?.[0] ? (
                          <img 
                            src={item.products.image_urls[0]} 
                            alt={item.products.name}
                            className="w-full h-full object-cover rounded-lg"
                          />
                        ) : (
                          <div className="w-full h-full bg-gray-200 rounded-lg" />
                        )}
                      </div>
                      <div className="flex-1">
                        <h4 className="font-medium text-gray-900 text-sm">{item.products?.name}</h4>
                        <p className="text-xs text-gray-600">
                          Qty: {item.quantity}
                          {item.size && ` • Size: ${item.size}`}
                          {item.color && ` • Color: ${item.color}`}
                        </p>
                      </div>
                      <div className="text-sm font-medium text-gray-900">
                        {formatPrice(item.products?.price * item.quantity)}
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-6 space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Subtotal</span>
                    <span className="font-medium">{formatPrice(cartSummary.subtotal)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Shipping</span>
                    <span className="font-medium text-green-600">Free</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Tax</span>
                    <span className="font-medium">₹0</span>
                  </div>
                  <div className="pt-2 border-t border-gray-200">
                    <div className="flex justify-between">
                      <span className="font-medium text-gray-900">Total</span>
                      <span className="font-bold text-lg text-[#6f0e06]">
                        {formatPrice(cartSummary.total)}
                      </span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout; 