import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
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
  Eye
} from 'lucide-react';

const Orders = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    fetchOrders();
  }, [isAuthenticated, user, navigate]);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      setError(null);
      
      if (user) {
        const userOrders = await supabaseService.getUserOrders(user.id);
        setOrders(userOrders);
      }
    } catch (err) {
      console.error('Error fetching orders:', err);
      setError('Failed to load orders');
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
      day: 'numeric'
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

  if (!isAuthenticated) {
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
                onClick={() => navigate('/')}
                className="text-gray-600 hover:text-[#ba1a5d]"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Home
              </Button>
              <div className="h-6 w-px bg-gray-300" />
              <h1 className="text-2xl font-serif text-gray-900">My Orders</h1>
            </div>
            <div className="flex items-center space-x-2 text-sm text-gray-600">
              <ShoppingBag className="w-4 h-4" />
              <span>{orders.length} Orders</span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#ba1a5d]"></div>
          </div>
        ) : error ? (
          <div className="text-center py-12">
            <div className="text-red-600 mb-4">
              <Package className="w-12 h-12 mx-auto mb-2" />
              <p>{error}</p>
            </div>
            <Button onClick={fetchOrders} className="bg-[#ba1a5d] hover:bg-[#9a1549] text-white">
              Try Again
            </Button>
          </div>
        ) : orders.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-gray-500 mb-4">
              <ShoppingBag className="w-12 h-12 mx-auto mb-2" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No Orders Yet</h3>
              <p>You haven't placed any orders yet. Start shopping to see your orders here.</p>
            </div>
            <Button onClick={() => navigate('/')} className="bg-[#ba1a5d] hover:bg-[#9a1549] text-white">
              Start Shopping
            </Button>
          </div>
        ) : (
          <div className="space-y-6">
            {orders.map((order) => (
              <motion.div
                key={order.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                <Card className="border-rose-200 bg-white/70 backdrop-blur-sm">
                  <CardHeader className="bg-gradient-to-r from-[#ba1a5d] to-[#9a1549] text-white rounded-t-lg">
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle className="flex items-center">
                          <Package className="w-5 h-5 mr-2" />
                          Order #{order.id.slice(0, 8)}
                        </CardTitle>
                        <CardDescription className="text-white/90">
                          Placed on {formatDate(order.created_at)}
                        </CardDescription>
                      </div>
                      <div className="text-right">
                        <div className="text-2xl font-bold">{formatPrice(order.total_amount)}</div>
                        <div className="text-sm opacity-90">
                          {order.shipping_amount > 0 && `+${formatPrice(order.shipping_amount)} shipping`}
                        </div>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="p-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
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

                    {/* Shipping Address */}
                    {order.shipping_address_line1 && (
                      <div className="bg-gray-50 rounded-lg p-4 mb-4">
                        <h4 className="font-medium text-gray-900 mb-2">Shipping Address</h4>
                        <div className="text-sm text-gray-600">
                          <p>{order.shipping_address_line1}</p>
                          {order.shipping_address_line2 && <p>{order.shipping_address_line2}</p>}
                          <p>
                            {order.shipping_city}, {order.shipping_state} {order.shipping_postal_code}
                          </p>
                          {order.shipping_country && <p>{order.shipping_country}</p>}
                          {order.shipping_phone && <p>Phone: {order.shipping_phone}</p>}
                        </div>
                      </div>
                    )}

                    {/* Order Notes */}
                    {order.notes && (
                      <div className="bg-blue-50 rounded-lg p-4 mb-4">
                        <h4 className="font-medium text-blue-900 mb-2">Order Notes</h4>
                        <p className="text-sm text-blue-700">{order.notes}</p>
                      </div>
                    )}

                    {/* Actions */}
                    <div className="flex justify-end space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        className="border-rose-200 hover:bg-rose-50"
                      >
                        <Eye className="w-4 h-4 mr-2" />
                        View Details
                      </Button>
                      {order.status === 'delivered' && (
                        <Button
                          variant="outline"
                          size="sm"
                          className="border-rose-200 hover:bg-rose-50"
                        >
                          Reorder
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Orders; 