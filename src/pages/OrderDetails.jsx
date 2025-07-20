import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../contexts/AuthContext';
import { supabaseService } from '../services/supabaseService';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  ShoppingBag, 
  Calendar, 
  CreditCard, 
  Truck, 
  ArrowLeft,
  Package,
  MapPin,
  Phone,
  Mail,
  Copy,
  Check
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const OrderDetails = () => {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  const { toast } = useToast();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    fetchOrderDetails();
  }, [isAuthenticated, orderId, user, navigate]);

  const fetchOrderDetails = async () => {
    try {
      setLoading(true);
      setError(null);
      
      if (user && orderId) {
        const orderDetails = await supabaseService.getOrderDetails(orderId);
        if (orderDetails.user_id !== user.id) {
          setError('Order not found or access denied');
          return;
        }
        setOrder(orderDetails);
      }
    } catch (err) {
      console.error('Error fetching order details:', err);
      setError('Failed to load order details');
    } finally {
      setLoading(false);
    }
  };

  const formatPrice = (price) => {
    return `₹${price?.toLocaleString('en-IN') || 0}`;
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'confirmed':
        return 'bg-blue-100 text-blue-800';
      case 'processing':
        return 'bg-purple-100 text-purple-800';
      case 'shipped':
        return 'bg-indigo-100 text-indigo-800';
      case 'delivered':
        return 'bg-green-100 text-green-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getPaymentStatusColor = (status) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'failed':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const copyOrderId = async () => {
    try {
      await navigator.clipboard.writeText(order.id);
      setCopied(true);
      toast({
        title: "Copied!",
        description: "Order ID copied to clipboard",
      });
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      toast({
        title: "Failed to copy",
        description: "Please copy the order ID manually",
        variant: "destructive"
      });
    }
  };

  if (!isAuthenticated) {
    return null;
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-rose-50 via-white to-pink-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#6f0e06]"></div>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-rose-50 via-white to-pink-50">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="text-center py-12">
            <div className="text-red-600 mb-4">
              <Package className="w-12 h-12 mx-auto mb-2" />
              <p>{error || 'Order not found'}</p>
            </div>
            <Button onClick={() => navigate('/orders')} className="bg-[#6f0e06] hover:bg-[#9a1549] text-white">
              Back to Orders
            </Button>
          </div>
        </div>
      </div>
    );
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
                onClick={() => navigate('/orders')}
                className="text-gray-600 hover:text-[#6f0e06]"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Orders
              </Button>
              <div className="h-6 w-px bg-gray-300" />
              <h1 className="text-2xl font-serif text-gray-900">Order Details</h1>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="space-y-6"
        >
          {/* Order Summary Card */}
          <Card className="border-rose-200 bg-white/70 backdrop-blur-sm">
            <CardHeader className="bg-gradient-to-r from-[#6f0e06] to-[#9a1549] text-white rounded-t-lg">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center">
                    <Package className="w-5 h-5 mr-2" />
                    Order #{order.id.slice(0, 8)}
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={copyOrderId}
                      className="ml-2 text-white hover:bg-white/20 p-1 h-auto"
                    >
                      {copied ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                    </Button>
                  </CardTitle>
                  <CardDescription className="text-white/90">
                    Placed on {formatDate(order.created_at)}
                  </CardDescription>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold">{formatPrice(order.total_amount)}</div>
                  {order.discount_amount > 0 && (
                    <div className="text-sm opacity-90">
                      Save {formatPrice(order.discount_amount)} with {order.coupon_code}
                    </div>
                  )}
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {/* Order Status */}
                <div className="space-y-2">
                  <div className="flex items-center text-sm text-gray-600">
                    <Truck className="w-4 h-4 mr-1" />
                    Order Status
                  </div>
                  <Badge className={getStatusColor(order.status)}>
                    {order.status || 'pending'}
                  </Badge>
                </div>

                {/* Payment Status */}
                <div className="space-y-2">
                  <div className="flex items-center text-sm text-gray-600">
                    <CreditCard className="w-4 h-4 mr-1" />
                    Payment Status
                  </div>
                  <Badge className={getPaymentStatusColor(order.payment_status)}>
                    {order.payment_status || 'pending'}
                  </Badge>
                </div>

                {/* Payment Method */}
                <div className="space-y-2">
                  <div className="flex items-center text-sm text-gray-600">
                    <CreditCard className="w-4 h-4 mr-1" />
                    Payment Method
                  </div>
                  <div className="text-sm font-medium text-gray-900 capitalize">
                    {order.payment_method || 'Not specified'}
                  </div>
                </div>

                {/* Order Date */}
                <div className="space-y-2">
                  <div className="flex items-center text-sm text-gray-600">
                    <Calendar className="w-4 h-4 mr-1" />
                    Order Date
                  </div>
                  <div className="text-sm font-medium text-gray-900">
                    {formatDate(order.created_at)}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Order Items */}
            <Card className="border-rose-200 bg-white/70 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <ShoppingBag className="w-5 h-5 mr-2" />
                  Order Items
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {order.order_items?.map((item, index) => (
                    <div key={index} className="flex items-start space-x-4 p-4 border border-gray-200 rounded-lg">
                      {item.products?.image_urls?.[0] && (
                        <img
                          src={item.products.image_urls[0]}
                          alt={item.products.name}
                          className="w-16 h-16 object-cover rounded-md"
                        />
                      )}
                      <div className="flex-1">
                        <h4 className="font-medium text-gray-900">{item.products?.name}</h4>
                        <div className="text-sm text-gray-600 mt-1">
                          <p>Quantity: {item.quantity}</p>
                          {item.size && <p>Size: {item.size}</p>}
                          {item.color && <p>Color: {item.color}</p>}
                        </div>
                        <div className="text-lg font-semibold text-[#6f0e06] mt-2">
                          {formatPrice(item.price)}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Shipping Information */}
            <Card className="border-rose-200 bg-white/70 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <MapPin className="w-5 h-5 mr-2" />
                  Shipping Information
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">Delivery Address</h4>
                    <div className="text-sm text-gray-600 space-y-1">
                      <p>{order.shipping_address_line1}</p>
                      {order.shipping_address_line2 && <p>{order.shipping_address_line2}</p>}
                      <p>{order.shipping_city}, {order.shipping_state} {order.shipping_postal_code}</p>
                      {order.shipping_country && <p>{order.shipping_country}</p>}
                    </div>
                  </div>
                  
                  {order.shipping_phone && (
                    <div>
                      <h4 className="font-medium text-gray-900 mb-2">Contact Information</h4>
                      <div className="flex items-center text-sm text-gray-600">
                        <Phone className="w-4 h-4 mr-2" />
                        {order.shipping_phone}
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Order Summary */}
          <Card className="border-rose-200 bg-white/70 backdrop-blur-sm">
            <CardHeader>
              <CardTitle>Order Summary</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span>Subtotal</span>
                  <span>{formatPrice((order.total_amount || 0) + (order.discount_amount || 0) - (order.shipping_amount || 0))}</span>
                </div>
                
                {order.discount_amount > 0 && (
                  <div className="flex justify-between text-sm text-green-600">
                    <span>Discount ({order.coupon_code})</span>
                    <span>-{formatPrice(order.discount_amount)}</span>
                  </div>
                )}
                
                <div className="flex justify-between text-sm">
                  <span>Shipping</span>
                  <span>{order.shipping_amount > 0 ? formatPrice(order.shipping_amount) : 'Free'}</span>
                </div>
                
                {order.tax_amount > 0 && (
                  <div className="flex justify-between text-sm">
                    <span>Tax</span>
                    <span>{formatPrice(order.tax_amount)}</span>
                  </div>
                )}
                
                <div className="border-t pt-3">
                  <div className="flex justify-between text-lg font-semibold">
                    <span>Total</span>
                    <span className="text-[#6f0e06]">{formatPrice(order.total_amount)}</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Order Notes */}
          {order.notes && (
            <Card className="border-rose-200 bg-white/70 backdrop-blur-sm">
              <CardHeader>
                <CardTitle>Order Notes</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-sm text-gray-600 break-words whitespace-pre-wrap">
                  {order.notes}
                </div>
              </CardContent>
            </Card>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default OrderDetails;