import React, { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, Package, Users, ShoppingCart, Settings, ArrowLeft, Image, Clock, Eye, X, Phone, Mail, MapPin, User, Truck } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { supabaseService } from '../services/supabaseService';
import { useToast } from '../hooks/use-toast.jsx';
import { useAuth } from '../contexts/AuthContext';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import statePersistence from '../utils/statePersistence';
import { sendOrderStatusUpdateEmail } from '../services/emailService';
import ImageUpload from '../components/ImageUpload';

const Admin = () => {
  const { user } = useAuth();
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [orders, setOrders] = useState([]);
  const [customRequests, setCustomRequests] = useState([]);
  const [settings, setSettings] = useState({});
  const [loading, setLoading] = useState(true);
  const [showProductForm, setShowProductForm] = useState(false);
  const [showCategoryForm, setShowCategoryForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [editingCategory, setEditingCategory] = useState(null);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showOrderModal, setShowOrderModal] = useState(false);
  const [activeTab, setActiveTab] = useState('products');
  const { toast } = useToast();

  // Load admin state from persistence
  useEffect(() => {
    const savedTab = statePersistence.loadAdminTab();
    if (savedTab) {
      setActiveTab(savedTab);
    }
  }, []);

  // Save active tab to persistence
  useEffect(() => {
    statePersistence.saveAdminTab(activeTab);
  }, [activeTab]);

  const loadData = async () => {
    try {
      setLoading(true);
      
      console.log('Loading admin data...');
      
      // Load products, categories, settings, and custom requests
      const [productsData, categoriesData, settingsData, customRequestsData] = await Promise.all([
        supabaseService.getProducts({ includeInactive: true }),
        supabaseService.getCategories(true),
        supabaseService.getSettings(),
        supabaseService.getCustomRequests()
      ]);
      
      console.log('Loaded products:', productsData);
      console.log('Loaded categories:', categoriesData);
      console.log('Loaded settings:', settingsData);
      console.log('Loaded custom requests:', customRequestsData);
      
      setProducts(productsData);
      setCategories(categoriesData);
      setSettings(settingsData);
      setCustomRequests(customRequestsData);
      
      // Try to load orders separately with error handling
      try {
        const ordersData = await supabaseService.getOrders();
        console.log('Loaded orders:', ordersData);
        setOrders(ordersData);
      } catch (ordersError) {
        console.warn('Failed to load orders:', ordersError);
        setOrders([]); // Set empty array if orders fail to load
      }
      
    } catch (error) {
      console.error('Error loading admin data:', error);
      toast({
        title: "Error loading data",
        description: error.message,
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    console.log('Admin component mounted, user:', user);
    console.log('User email:', user?.email);
    console.log('Is admin:', user?.email === 'saiyamkumar2007@gmail.com');
    
    if (user?.email === 'saiyamkumar2007@gmail.com') {
      loadData();
    }
  }, [user]);

  // Check if user is admin
  if (!user || user.email !== 'saiyamkumar2007@gmail.com') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-rose-50 via-white to-pink-50 flex items-center justify-center">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center p-8 bg-white rounded-2xl shadow-xl border border-rose-100"
        >
          <div className="w-16 h-16 bg-rose-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Settings className="w-8 h-8 text-rose-600" />
          </div>
          <h2 className="text-2xl font-serif text-gray-900 mb-4">Access Restricted</h2>
          <p className="text-gray-600 mb-6">Only authorized administrators can access this panel.</p>
          <Link to="/">
            <Button className="bg-[#ba1a5d] hover:bg-[#9a1549] text-white">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Home
            </Button>
          </Link>
        </motion.div>
      </div>
    );
  }

  const handleEditProduct = (product) => {
    setEditingProduct(product);
    setShowProductForm(true);
  };

  const handleDeleteProduct = async (id) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        await supabaseService.deleteProduct(id);
        toast({ title: "Product deleted successfully" });
        loadData();
      } catch (error) {
        toast({
          title: "Error deleting product",
          description: error.message,
          variant: "destructive"
        });
      }
    }
  };

  const handleEditCategory = (category) => {
    setEditingCategory(category);
    setShowCategoryForm(true);
  };

  const handleDeleteCategory = async (id) => {
    if (window.confirm('Are you sure you want to delete this category?')) {
      try {
        await supabaseService.deleteCategory(id);
        setCategories(categories.filter(cat => cat.id !== id));
        toast({
          title: "Category deleted successfully",
          description: "The category has been removed from your store.",
        });
      } catch (error) {
        toast({
          title: "Error deleting category",
          description: error.message,
          variant: "destructive"
        });
      }
    }
  };

  const handleUpdateCustomRequestStatus = async (requestId, newStatus) => {
    try {
      await supabaseService.updateCustomRequestStatus(requestId, newStatus);
      setCustomRequests(customRequests.map(req => 
        req.id === requestId ? { ...req, status: newStatus } : req
      ));
      toast({
        title: "Status updated successfully",
        description: `Custom request status changed to ${newStatus}`,
      });
    } catch (error) {
      toast({
        title: "Error updating status",
        description: error.message,
        variant: "destructive"
      });
    }
  };

  const handleDeleteCustomRequest = async (requestId) => {
    if (window.confirm('Are you sure you want to delete this custom request?')) {
      try {
        await supabaseService.deleteCustomRequest(requestId);
        setCustomRequests(customRequests.filter(req => req.id !== requestId));
        toast({
          title: "Custom request deleted successfully",
          description: "The custom request has been removed.",
        });
      } catch (error) {
        toast({
          title: "Error deleting custom request",
          description: error.message,
          variant: "destructive"
        });
      }
    }
  };

  const handleUpdateOrderStatus = async (orderId, newStatus) => {
    try {
      await supabaseService.updateOrderStatus(orderId, newStatus);
      setOrders(orders.map(order => 
        order.id === orderId ? { ...order, status: newStatus } : order
      ));
      
      // Update selectedOrder if it's the same order
      if (selectedOrder && selectedOrder.id === orderId) {
        setSelectedOrder({ ...selectedOrder, status: newStatus });
      }
      
      toast({
        title: "Order status updated",
        description: `Order status changed to ${newStatus}`,
      });

      // Send status update email
      try {
        const orderDetails = await supabaseService.getOrderDetails(orderId);
        if (orderDetails && orderDetails.notes) {
          // Parse customer info from notes
          let customerInfo;
          try {
            const notesMatch = orderDetails.notes.match(/Customer: (.+), Email: (.+)/);
            if (notesMatch) {
              customerInfo = {
                name: notesMatch[1],
                email: notesMatch[2]
              };
            } else {
              // Try parsing as JSON if it's stored that way
              customerInfo = JSON.parse(orderDetails.notes);
            }
          } catch (parseError) {
            console.warn('Could not parse customer info from notes:', parseError);
            return; // Skip email if we can't get customer info
          }

          const emailData = {
            orderId: orderId,
            customerInfo: customerInfo,
            orderDetails: {
              total_amount: orderDetails.total_amount,
              payment_method: orderDetails.payment_method || 'Razorpay'
            }
          };

          const emailResult = await sendOrderStatusUpdateEmail(emailData, newStatus);
          if (emailResult.success) {
            console.log('Order status update email sent successfully');
          } else {
            console.warn('Failed to send status update email:', emailResult.error);
          }
        }
      } catch (emailError) {
        console.error('Error sending status update email:', emailError);
      }
    } catch (error) {
      toast({
        title: "Error updating order status",
        description: error.message,
        variant: "destructive"
      });
    }
  };

  const handleViewOrderDetails = (order) => {
    setSelectedOrder(order);
    setShowOrderModal(true);
  };

  const OrderDetailsModal = ({ order, isOpen, onClose }) => {
    const [orderDetails, setOrderDetails] = useState(null);
    const [loadingDetails, setLoadingDetails] = useState(true);
    const [customerInfo, setCustomerInfo] = useState(null);

    useEffect(() => {
      if (order && isOpen) {
        fetchOrderDetails();
        parseCustomerInfo();
      }
    }, [order, isOpen]);

    const fetchOrderDetails = async () => {
      try {
        setLoadingDetails(true);
        const details = await supabaseService.getOrderDetails(order.id);
        setOrderDetails(details);
      } catch (err) {
        console.error("Error fetching order details:", err);
        toast({
          title: "Error loading order details",
          description: err.message,
          variant: "destructive"
        });
      } finally {
        setLoadingDetails(false);
      }
    };

    const parseCustomerInfo = () => {
      // Parse customer info from notes field
      let customerData = {};
      try {
        if (order.notes) {
          // Extract customer name and email from notes string
          const nameMatch = order.notes.match(/Customer:\s*([^,]+)/);
          const emailMatch = order.notes.match(/Email:\s*([^,\s]+)/);
          
          if (nameMatch) customerData.name = nameMatch[1].trim();
          if (emailMatch) customerData.email = emailMatch[1].trim();
        }
      } catch (e) {
        console.warn('Error parsing customer info:', e);
      }
      
      setCustomerInfo(customerData);
    };

    const getStatusOptions = () => {
      return [
        { value: 'pending', label: 'Pending', color: 'bg-yellow-500' },
        { value: 'confirmed', label: 'Confirmed', color: 'bg-blue-500' },
        { value: 'processing', label: 'Processing', color: 'bg-purple-500' },
        { value: 'shipped', label: 'Shipped', color: 'bg-indigo-500' },
        { value: 'delivered', label: 'Delivered', color: 'bg-green-500' },
        { value: 'cancelled', label: 'Cancelled', color: 'bg-red-500' }
      ];
    };

    const getCurrentStatusColor = (status) => {
      const statusOption = getStatusOptions().find(option => option.value === status);
      return statusOption ? statusOption.color : 'bg-gray-500';
    };

    if (!isOpen || !order) return null;

    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
        <div className="relative bg-white rounded-lg shadow-2xl max-w-6xl w-full max-h-[90vh] overflow-auto">
          {/* Header */}
          <div className="bg-gradient-to-r from-[#ba1a5d] to-[#9a1549] text-white p-6 rounded-t-lg">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-serif">Order Details</h2>
                <p className="text-white/90">Order #{order.id.slice(0, 8)}</p>
              </div>
              <button
                onClick={onClose}
                className="text-white hover:text-gray-200 transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
          </div>

          <div className="p-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Left Column - Order Info */}
              <div className="space-y-6">
                {/* Order Summary */}
                <div className="bg-gray-50 rounded-lg p-4">
                  <h3 className="font-semibold text-gray-900 mb-4 flex items-center">
                    <Package className="w-5 h-5 mr-2" />
                    Order Summary
                  </h3>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Order ID:</span>
                      <span className="font-medium">#{order.id.slice(0, 8)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Order Date:</span>
                      <span className="font-medium">{new Date(order.created_at).toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Total Amount:</span>
                      <span className="font-bold text-[#ba1a5d] text-lg">₹{order.total_amount?.toLocaleString('en-IN')}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Payment Method:</span>
                      <span className="font-medium capitalize">{order.payment_method || 'Not specified'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Payment Status:</span>
                      <span className={`px-2 py-1 rounded text-sm font-medium ${
                        order.payment_status === 'completed' ? 'bg-green-100 text-green-800' :
                        order.payment_status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {order.payment_status || 'pending'}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Customer Information */}
                <div className="bg-blue-50 rounded-lg p-4">
                  <h3 className="font-semibold text-gray-900 mb-4 flex items-center">
                    <User className="w-5 h-5 mr-2" />
                    Customer Information
                  </h3>
                  <div className="space-y-3">
                    {customerInfo?.name && (
                      <div className="flex items-center">
                        <User className="w-4 h-4 mr-2 text-gray-600" />
                        <span className="text-gray-600 w-20">Name:</span>
                        <span className="font-medium">{customerInfo.name}</span>
                      </div>
                    )}
                    {customerInfo?.email && (
                      <div className="flex items-center">
                        <Mail className="w-4 h-4 mr-2 text-gray-600" />
                        <span className="text-gray-600 w-20">Email:</span>
                        <span className="font-medium">{customerInfo.email}</span>
                      </div>
                    )}
                    {order.shipping_phone && (
                      <div className="flex items-center">
                        <Phone className="w-4 h-4 mr-2 text-gray-600" />
                        <span className="text-gray-600 w-20">Phone:</span>
                        <span className="font-medium">{order.shipping_phone}</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Shipping Address */}
                <div className="bg-green-50 rounded-lg p-4">
                  <h3 className="font-semibold text-gray-900 mb-4 flex items-center">
                    <MapPin className="w-5 h-5 mr-2" />
                    Shipping Address
                  </h3>
                  <div className="text-gray-700 space-y-1">
                    {customerInfo?.name && (
                      <p className="font-medium">{customerInfo.name}</p>
                    )}
                    <p>{order.shipping_address_line1}</p>
                    {order.shipping_address_line2 && (
                      <p>{order.shipping_address_line2}</p>
                    )}
                    <p>
                      {order.shipping_city}, {order.shipping_state} {order.shipping_postal_code}
                    </p>
                    {order.shipping_country && (
                      <p>{order.shipping_country}</p>
                    )}
                    {order.shipping_phone && (
                      <p className="flex items-center mt-2">
                        <Phone className="w-4 h-4 mr-1" />
                        {order.shipping_phone}
                      </p>
                    )}
                  </div>
                </div>

                {/* Order Status Management */}
                <div className="bg-orange-50 rounded-lg p-4">
                  <h3 className="font-semibold text-gray-900 mb-4 flex items-center">
                    <Truck className="w-5 h-5 mr-2" />
                    Order Status
                  </h3>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600">Current Status:</span>
                      <span className={`px-3 py-1 rounded-full text-sm font-medium text-white ${getCurrentStatusColor(order.status)}`}>
                        {order.status || 'pending'}
                      </span>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Update Status:
                      </label>
                      <select
                        value={order.status || 'pending'}
                        onChange={(e) => handleUpdateOrderStatus(order.id, e.target.value)}
                        className="w-full p-2 border border-gray-300 rounded-md focus:border-[#ba1a5d] focus:outline-none"
                      >
                        {getStatusOptions().map((option) => (
                          <option key={option.value} value={option.value}>
                            {option.label}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Column - Order Items */}
              <div className="space-y-6">
                <div className="bg-purple-50 rounded-lg p-4">
                  <h3 className="font-semibold text-gray-900 mb-4 flex items-center">
                    <ShoppingCart className="w-5 h-5 mr-2" />
                    Order Items
                  </h3>
                  
                  {loadingDetails ? (
                    <div className="text-center py-8">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#ba1a5d] mx-auto"></div>
                      <p className="text-gray-600 mt-2">Loading items...</p>
                    </div>
                  ) : orderDetails && orderDetails.length > 0 ? (
                    <div className="space-y-4">
                      {orderDetails.map((item) => (
                        <div key={item.id} className="flex items-center space-x-4 p-3 bg-white rounded-lg border border-gray-200">
                          <div className="w-16 h-16 bg-gray-200 rounded-lg overflow-hidden flex-shrink-0">
                            <img 
                              src={item.image_url} 
                              alt={item.name}
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <div className="flex-1">
                            <h4 className="font-medium text-gray-900">{item.name}</h4>
                            <div className="text-sm text-gray-600 space-y-1">
                              {item.color && <p>Color: {item.color}</p>}
                              {item.size && <p>Size: {item.size}</p>}
                              <p>Quantity: {item.quantity}</p>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="font-bold text-[#ba1a5d]">₹{item.price?.toLocaleString('en-IN')}</p>
                            <p className="text-sm text-gray-600">per item</p>
                          </div>
                        </div>
                      ))}
                      
                      {/* Order Total */}
                      <div className="border-t border-gray-200 pt-4">
                        <div className="flex justify-between items-center">
                          <span className="text-lg font-semibold text-gray-900">Total:</span>
                          <span className="text-xl font-bold text-[#ba1a5d]">
                            ₹{order.total_amount?.toLocaleString('en-IN')}
                          </span>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-8 text-gray-600">
                      No items found for this order.
                    </div>
                  )}
                </div>

                {/* Order Notes */}
                {order.notes && (
                  <div className="bg-gray-50 rounded-lg p-4">
                    <h3 className="font-semibold text-gray-900 mb-2">Order Notes</h3>
                    <p className="text-gray-700 text-sm">{order.notes}</p>
                  </div>
                )}
              </div>
            </div>

            {/* Footer Actions */}
            <div className="mt-8 pt-6 border-t border-gray-200 flex justify-end space-x-3">
              <Button
                variant="outline"
                onClick={onClose}
                className="border-rose-200 hover:bg-rose-50"
              >
                Close
              </Button>
              <Button
                onClick={() => {
                  // You can add print functionality here
                  window.print();
                }}
                className="bg-[#ba1a5d] hover:bg-[#9a1549] text-white"
              >
                Print Order
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const ProductForm = ({ product, onClose, onSave }) => {
    const [formData, setFormData] = useState(product || {
      name: '',
      description: '',
      price: '',
      category_id: '',
      colors: [],
      sizes: [],
      image_urls: [],
      featured: false,
      stock_quantity: 0,
      material: '',
      care_instructions: ''
    });

    // Load saved form data on mount if not editing existing product
    useEffect(() => {
      if (!product) {
        const savedData = statePersistence.loadAdminProductForm();
        if (savedData) {
          setFormData(prev => ({ ...prev, ...savedData }));
        }
      }
    }, [product]);

    // Save form data as user types (but not when editing existing product)
    useEffect(() => {
      if (!product) {
        const hasData = Object.values(formData).some(value => 
          value && (typeof value === 'string' ? value.trim() : value)
        );
        if (hasData) {
          statePersistence.saveAdminProductForm(formData);
        }
      }
    }, [formData, product]);

    const handleSubmit = async (e) => {
      e.preventDefault();
      try {
        const productData = {
          ...formData,
          price: parseFloat(formData.price),
          stock_quantity: parseInt(formData.stock_quantity),
          colors: typeof formData.colors === 'string' ? formData.colors.split(',').map(c => c.trim()) : formData.colors,
          sizes: typeof formData.sizes === 'string' ? formData.sizes.split(',').map(s => s.trim()) : formData.sizes,
          image_urls: typeof formData.image_urls === 'string' ? formData.image_urls.split(',').map(u => u.trim()) : formData.image_urls
        };

        if (product) {
          await supabaseService.updateProduct(product.id, productData);
          toast({ title: "Product updated successfully" });
        } else {
          await supabaseService.createProduct(productData);
          toast({ title: "Product created successfully" });
          // Clear saved form data on successful creation
          statePersistence.clearAdminProductForm();
        }
        
        onSave();
        onClose();
      } catch (error) {
        toast({
          title: "Error saving product",
          description: error.message,
          variant: "destructive"
        });
      }
    };

    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-6"
      >
        <Card className="border-rose-200 bg-white/70 backdrop-blur-sm">
          <CardHeader className="bg-gradient-to-r from-[#ba1a5d] to-[#9a1549] text-white rounded-t-lg">
            <CardTitle className="font-serif">{product ? 'Edit Product' : 'Add New Product'}</CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  placeholder="Product Name"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  required
                  className="border-rose-200 focus:border-[#ba1a5d]"
                />
                <Input
                  type="number"
                  step="0.01"
                  placeholder="Price"
                  value={formData.price}
                  onChange={(e) => setFormData({...formData, price: e.target.value})}
                  required
                  className="border-rose-200 focus:border-[#ba1a5d]"
                />
              </div>
              
              <Textarea
                placeholder="Description"
                value={formData.description}
                onChange={(e) => setFormData({...formData, description: e.target.value})}
                className="border-rose-200 focus:border-[#ba1a5d]"
              />
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <select
                  className="w-full p-3 border border-rose-200 rounded-md focus:border-[#ba1a5d] focus:outline-none"
                  value={formData.category_id}
                  onChange={(e) => setFormData({...formData, category_id: e.target.value})}
                  required
                >
                  <option value="">Select Category</option>
                  {categories.map(cat => (
                    <option key={cat.id} value={cat.id}>{cat.name}</option>
                  ))}
                </select>
                
                <Input
                  type="number"
                  placeholder="Stock Quantity"
                  value={formData.stock_quantity}
                  onChange={(e) => setFormData({...formData, stock_quantity: e.target.value})}
                  className="border-rose-200 focus:border-[#ba1a5d]"
                />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  placeholder="Colors (comma separated)"
                  value={Array.isArray(formData.colors) ? formData.colors.join(', ') : formData.colors}
                  onChange={(e) => setFormData({...formData, colors: e.target.value})}
                  className="border-rose-200 focus:border-[#ba1a5d]"
                />
                
                <Input
                  placeholder="Sizes (comma separated)"
                  value={Array.isArray(formData.sizes) ? formData.sizes.join(', ') : formData.sizes}
                  onChange={(e) => setFormData({...formData, sizes: e.target.value})}
                  className="border-rose-200 focus:border-[#ba1a5d]"
                />
              </div>
              
              {/* Product Images Upload */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Product Images</label>
                <ImageUpload
                  value={formData.image_urls}
                  onChange={(urls) => setFormData({...formData, image_urls: urls})}
                  multiple={true}
                  maxFiles={8}
                  label="Upload Product Images"
                />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  placeholder="Material"
                  value={formData.material}
                  onChange={(e) => setFormData({...formData, material: e.target.value})}
                  className="border-rose-200 focus:border-[#ba1a5d]"
                />
                
                <Input
                  placeholder="Care Instructions"
                  value={formData.care_instructions}
                  onChange={(e) => setFormData({...formData, care_instructions: e.target.value})}
                  className="border-rose-200 focus:border-[#ba1a5d]"
                />
              </div>
              
              <label className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.featured}
                  onChange={(e) => setFormData({...formData, featured: e.target.checked})}
                  className="rounded border-rose-200 text-[#ba1a5d] focus:ring-[#ba1a5d]"
                />
                <span className="text-gray-700">Featured Product</span>
              </label>
              
              <div className="flex space-x-2 pt-4">
                <Button 
                  type="submit" 
                  className="bg-[#ba1a5d] hover:bg-[#9a1549] text-white"
                >
                  Save Product
                </Button>
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={onClose}
                  className="border-rose-200 hover:bg-rose-50"
                >
                  Cancel
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </motion.div>
    );
  };

  const CategoryForm = ({ category, onClose, onSave }) => {
    const [formData, setFormData] = useState(category || {
      name: '',
      slug: '',
      description: '',
      image_url: '',
      sort_order: 0,
      design_template: 'elegant'
    });

    // Load saved form data on mount if not editing existing category
    useEffect(() => {
      if (!category) {
        const savedData = statePersistence.loadAdminCategoryForm();
        if (savedData) {
          setFormData(prev => ({ ...prev, ...savedData }));
        }
      }
    }, [category]);

    // Save form data as user types (but not when editing existing category)
    useEffect(() => {
      if (!category) {
        const hasData = Object.values(formData).some(value => 
          value && (typeof value === 'string' ? value.trim() : value)
        );
        if (hasData) {
          statePersistence.saveAdminCategoryForm(formData);
        }
      }
    }, [formData, category]);

    // Design template options
    const designTemplates = [
      { value: 'elegant', label: 'Elegant Geometric', description: 'Clean geometric patterns with emerald accents' },
      { value: 'royal', label: 'Royal Mandala', description: 'Ornate mandala patterns with purple/pink theme' },
      { value: 'traditional', label: 'Traditional Paisley', description: 'Classic paisley and lotus patterns with rose theme' },
      { value: 'contemporary', label: 'Contemporary Floral', description: 'Modern floral patterns with blue theme' }
    ];

    const handleSubmit = async (e) => {
      e.preventDefault();
      try {
        const categoryData = {
          ...formData,
          sort_order: parseInt(formData.sort_order)
        };

        if (category) {
          await supabaseService.updateCategory(category.id, categoryData);
          toast({ title: "Category updated successfully" });
        } else {
          await supabaseService.createCategory(categoryData);
          toast({ title: "Category created successfully" });
          // Clear saved form data on successful creation
          statePersistence.clearAdminCategoryForm();
        }
        
        onSave();
        onClose();
        loadData();
      } catch (error) {
        toast({
          title: "Error saving category",
          description: error.message,
          variant: "destructive"
        });
      }
    };

    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-6"
      >
        <Card className="border-rose-200 bg-white/70 backdrop-blur-sm">
          <CardHeader className="bg-gradient-to-r from-[#ba1a5d] to-[#9a1549] text-white rounded-t-lg">
            <CardTitle className="font-serif">{category ? 'Edit Category' : 'Add New Category'}</CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  placeholder="Category Name"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  required
                  className="border-rose-200 focus:border-[#ba1a5d]"
                />
                <Input
                  placeholder="Slug"
                  value={formData.slug}
                  onChange={(e) => setFormData({...formData, slug: e.target.value})}
                  required
                  className="border-rose-200 focus:border-[#ba1a5d]"
                />
              </div>
              
              <Textarea
                placeholder="Description"
                value={formData.description}
                onChange={(e) => setFormData({...formData, description: e.target.value})}
                className="border-rose-200 focus:border-[#ba1a5d]"
              />
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Category Image Upload */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">Category Image</label>
                  <ImageUpload
                    value={formData.image_url}
                    onChange={(url) => setFormData({...formData, image_url: url})}
                    multiple={false}
                    label="Upload Category Image"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">Sort Order</label>
                  <Input
                    type="number"
                    placeholder="Sort Order"
                    value={formData.sort_order}
                    onChange={(e) => setFormData({...formData, sort_order: e.target.value})}
                    className="border-rose-200 focus:border-[#ba1a5d]"
                  />
                </div>
              </div>

              {/* Design Template Selection */}
              <div className="space-y-3">
                <label className="text-sm font-medium text-gray-700">
                  Homepage Design Template
                </label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {designTemplates.map((template) => (
                    <div
                      key={template.value}
                      className={`relative p-4 border-2 rounded-lg cursor-pointer transition-all duration-200 ${
                        formData.design_template === template.value
                          ? 'border-[#ba1a5d] bg-rose-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                      onClick={() => setFormData({...formData, design_template: template.value})}
                    >
                      <div className="flex items-start space-x-3">
                        <div className="flex-shrink-0 mt-1">
                          <div className={`w-4 h-4 rounded-full border-2 ${
                            formData.design_template === template.value
                              ? 'border-[#ba1a5d] bg-[#ba1a5d]'
                              : 'border-gray-300'
                          }`}>
                            {formData.design_template === template.value && (
                              <div className="w-full h-full rounded-full bg-white scale-50"></div>
                            )}
                          </div>
                        </div>
                        <div className="flex-1">
                          <h4 className="font-medium text-gray-900">{template.label}</h4>
                          <p className="text-sm text-gray-600 mt-1">{template.description}</p>
                        </div>
                      </div>
                      
                      {/* Visual Preview */}
                      <div className="mt-3 h-8 rounded overflow-hidden bg-gradient-to-r opacity-60">
                        {template.value === 'elegant' && (
                          <div className="h-full bg-gradient-to-r from-emerald-100 to-teal-100 flex items-center justify-center">
                            <div className="w-4 h-4 border border-emerald-400 opacity-50"></div>
                          </div>
                        )}
                        {template.value === 'royal' && (
                          <div className="h-full bg-gradient-to-r from-purple-100 to-pink-100 flex items-center justify-center">
                            <div className="w-4 h-4 rounded-full border border-purple-400 opacity-50"></div>
                          </div>
                        )}
                        {template.value === 'traditional' && (
                          <div className="h-full bg-gradient-to-r from-rose-100 to-orange-100 flex items-center justify-center">
                            <div className="w-3 h-4 bg-rose-300 opacity-50 rounded-full transform rotate-45"></div>
                          </div>
                        )}
                        {template.value === 'contemporary' && (
                          <div className="h-full bg-gradient-to-r from-blue-100 to-indigo-100 flex items-center justify-center">
                            <div className="w-4 h-4 bg-blue-300 opacity-50 rounded-sm transform rotate-45"></div>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
                <p className="text-xs text-gray-500">
                  Choose the design template that will be used when this category is displayed on the homepage.
                </p>
              </div>
              
              <div className="flex space-x-2 pt-4">
                <Button 
                  type="submit" 
                  className="bg-[#ba1a5d] hover:bg-[#9a1549] text-white"
                >
                  Save Category
                </Button>
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={onClose}
                  className="border-rose-200 hover:bg-rose-50"
                >
                  Cancel
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </motion.div>
    );
  };

  const SettingsForm = () => {
    const [formData, setFormData] = useState({
      promotional_messages: '',
      hero_content: '',
      footer_content: '',
      site_title: '',
      site_description: '',
      contact_email: '',
      contact_phone: '',
      social_media: ''
    });
    const [saving, setSaving] = useState(false);

    useEffect(() => {
      // Initialize form with existing settings
      if (settings) {
        setFormData({
          promotional_messages: settings.promotional_messages ? 
            (typeof settings.promotional_messages === 'string' ? 
              settings.promotional_messages : 
              JSON.stringify(settings.promotional_messages, null, 2)) : 
            JSON.stringify([
              { id: 1, text: "🎁 Welcome to our store! Explore our latest collection" },
              { id: 2, text: "🚚 Free shipping on all orders above ₹2999" },
              { id: 3, text: "⚡ New arrivals every week - Stay updated!" }
            ], null, 2),
          hero_content: settings.hero_content ? 
            (typeof settings.hero_content === 'string' ? 
              settings.hero_content : 
              JSON.stringify(settings.hero_content, null, 2)) : 
            JSON.stringify([
              {
                id: 1,
                title: "Royal Heritage Collection",
                subtitle: "Timeless Tradition",
                description: "Discover our exquisite collection of handcrafted ethnic wear",
                image: "/hero-image.jpg",
                primaryCta: "Explore Collection",
                secondaryCta: "View Lookbook"
              }
            ], null, 2),
          footer_content: settings.footer_content ? 
            (typeof settings.footer_content === 'string' ? 
              settings.footer_content : 
              JSON.stringify(settings.footer_content, null, 2)) : 
            JSON.stringify({
              company: "Dharika Fashion",
              description: "Premium ethnic wear collection",
              address: "123 Fashion Street, Mumbai, India",
              phone: "+91 98765 43210",
              email: "info@dharikafashion.com"
            }, null, 2),
          site_title: settings.site_title || 'Dharika Fashion',
          site_description: settings.site_description || 'Premium ethnic wear collection',
          contact_email: settings.contact_email || '',
          contact_phone: settings.contact_phone || '',
          social_media: settings.social_media ? 
            (typeof settings.social_media === 'string' ? 
              settings.social_media : 
              JSON.stringify(settings.social_media, null, 2)) : 
            JSON.stringify({
              facebook: "https://facebook.com/dharikafashion",
              instagram: "https://instagram.com/dharikafashion",
              whatsapp: "https://wa.me/919876543210"
            }, null, 2)
        });
      }
    }, [settings]);

    const handleSubmit = async (e) => {
      e.preventDefault();
      try {
        setSaving(true);
        
        // Prepare settings data - now all fields are supported
        const settingsData = {
          site_title: formData.site_title,
          site_description: formData.site_description,
          contact_email: formData.contact_email,
          contact_phone: formData.contact_phone,
          social_media: formData.social_media,
          promotional_messages: formData.promotional_messages,
          hero_content: formData.hero_content,
          footer_content: formData.footer_content
        };

        await supabaseService.updateSettings(settingsData);
        
        toast({
          title: "Settings updated successfully",
          description: "All settings have been saved successfully!"
        });
        
        // Reload the page to reflect changes
        setTimeout(() => {
          window.location.reload();
        }, 1000);
        
      } catch (error) {
        toast({
          title: "Error saving settings",
          description: error.message,
          variant: "destructive"
        });
      } finally {
        setSaving(false);
      }
    };

    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-6"
      >
        <Card className="border-rose-200 bg-white/70 backdrop-blur-sm">
          <CardHeader className="bg-gradient-to-r from-[#ba1a5d] to-[#9a1549] text-white rounded-t-lg">
            <CardTitle className="font-serif">Site Settings</CardTitle>
            <CardDescription className="text-white/90">
              Manage your website's dynamic content and settings
            </CardDescription>
          </CardHeader>
          <CardContent className="p-6">
            {/* Success Notice */}
            <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
              <div className="flex items-start">
                <svg className="w-5 h-5 text-green-600 mt-0.5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
                <div>
                  <h4 className="text-sm font-medium text-green-800">Database Schema Updated</h4>
                  <p className="text-sm text-green-700 mt-1">
                    All features are now fully functional! You can edit promotional messages, hero content, and footer content.
                  </p>
                </div>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Basic Settings */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Site Title ✅
                  </label>
                  <Input
                    value={formData.site_title}
                    onChange={(e) => setFormData({...formData, site_title: e.target.value})}
                    className="border-rose-200 focus:border-[#ba1a5d]"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Site Description ✅
                  </label>
                  <Input
                    value={formData.site_description}
                    onChange={(e) => setFormData({...formData, site_description: e.target.value})}
                    className="border-rose-200 focus:border-[#ba1a5d]"
                  />
                </div>
              </div>

              {/* Contact Information */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Contact Email ✅
                  </label>
                  <Input
                    type="email"
                    value={formData.contact_email}
                    onChange={(e) => setFormData({...formData, contact_email: e.target.value})}
                    className="border-rose-200 focus:border-[#ba1a5d]"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Contact Phone ✅
                  </label>
                  <Input
                    value={formData.contact_phone}
                    onChange={(e) => setFormData({...formData, contact_phone: e.target.value})}
                    className="border-rose-200 focus:border-[#ba1a5d]"
                  />
                </div>
              </div>

              {/* Social Media Links */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Social Media Links (JSON format) ✅
                </label>
                <Textarea
                  value={formData.social_media}
                  onChange={(e) => setFormData({...formData, social_media: e.target.value})}
                  placeholder='{"facebook": "url", "instagram": "url", "whatsapp": "url"}'
                  className="border-rose-200 focus:border-[#ba1a5d] h-24 font-mono text-sm"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Format: Object with social media URLs (facebook, instagram, whatsapp)
                </p>
              </div>

              {/* Promotional Messages - Now fully functional */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Promotional Messages (JSON format) ✅
                </label>
                <Textarea
                  value={formData.promotional_messages}
                  onChange={(e) => setFormData({...formData, promotional_messages: e.target.value})}
                  placeholder='[{"id": 1, "text": "🎁 Welcome message"}]'
                  className="border-rose-200 focus:border-[#ba1a5d] h-32 font-mono text-sm"
                />
                <p className="text-xs text-green-600 mt-1">
                  ✅ This field is now fully functional! Changes will be reflected on the website.
                </p>
              </div>

              {/* Hero Content - Now fully functional */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Hero Content (JSON format) ✅
                </label>
                <Textarea
                  value={formData.hero_content}
                  onChange={(e) => setFormData({...formData, hero_content: e.target.value})}
                  placeholder='[{"title": "Hero Title", "subtitle": "Hero Subtitle", "image": "image-url"}]'
                  className="border-rose-200 focus:border-[#ba1a5d] h-32 font-mono text-sm"
                />
                <p className="text-xs text-green-600 mt-1">
                  ✅ This field is now fully functional! Changes will be reflected on the website.
                </p>
              </div>

              {/* Footer Content - Now fully functional */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Footer Content (JSON format) ✅
                </label>
                <Textarea
                  value={formData.footer_content}
                  onChange={(e) => setFormData({...formData, footer_content: e.target.value})}
                  placeholder='{"company": "Company Name", "description": "Company description"}'
                  className="border-rose-200 focus:border-[#ba1a5d] h-24 font-mono text-sm"
                />
                <p className="text-xs text-green-600 mt-1">
                  ✅ This field is now fully functional! Changes will be reflected on the website.
                </p>
              </div>

              <div className="flex space-x-2 pt-4">
                <Button 
                  type="submit" 
                  disabled={saving}
                  className="bg-[#ba1a5d] hover:bg-[#9a1549] text-white"
                >
                  {saving ? 'Saving...' : 'Save All Settings'}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </motion.div>
    );
  };

  const OrderDetailCard = ({ order }) => {
    return (
      <Card className="border-rose-100 bg-white/70 backdrop-blur-sm">
        <CardContent className="p-6">
          <div className="flex justify-between items-start mb-4">
            <div>
              <h3 className="font-serif text-lg">Order #{order.id.slice(0, 8)}</h3>
              <p className="text-sm text-gray-600">
                {new Date(order.created_at).toLocaleDateString()}
              </p>
            </div>
            <div className="text-right">
              <p className="font-bold text-[#ba1a5d]">₹{order.total_amount?.toLocaleString('en-IN')}</p>
              <Badge 
                variant={order.status === 'completed' || order.status === 'delivered' ? 'default' : 'secondary'}
                className={order.status === 'completed' || order.status === 'delivered' ? 'bg-green-500' : ''}
              >
                {order.status || 'pending'}
              </Badge>
            </div>
          </div>
          
          <div className="text-sm space-y-1 mb-4">
            <p><strong>Payment Status:</strong> {order.payment_status || 'pending'}</p>
            <p><strong>Shipping:</strong> {order.shipping_address_line1}</p>
            <p><strong>Phone:</strong> {order.shipping_phone || 'Not provided'}</p>
          </div>

          <div className="flex justify-end">
            <Button
              onClick={() => handleViewOrderDetails(order)}
              size="sm"
              className="bg-[#ba1a5d] hover:bg-[#9a1549] text-white"
            >
              <Eye className="w-4 h-4 mr-2" />
              View Details
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-rose-50 via-white to-pink-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#ba1a5d] mx-auto mb-4"></div>
          <p className="text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  // Debug section - temporary
  const debugInfo = (
    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
      <h3 className="font-semibold text-yellow-800 mb-2">Admin Panel Status</h3>
      <div className="text-sm text-yellow-700 space-y-1">
        <p>Products loaded: {products.length}</p>
        <p>Categories loaded: {categories.length}</p>
        <p>Custom requests loaded: {customRequests.length}</p>
        <p>User email: {user?.email}</p>
        <p>Is admin: {user?.email === 'saiyamkumar2007@gmail.com' ? 'Yes' : 'No'}</p>
        
        {(products.length === 0 || categories.length === 0) && (
          <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded">
            <p className="text-red-800 font-medium">⚠️ Permission Issue Detected</p>
            <p className="text-red-700 text-xs mt-1">
              Empty data suggests RLS permission issues. Please run the fix script.
            </p>
          </div>
        )}
        
        <button 
          onClick={loadData} 
          className="mt-2 px-3 py-1 bg-yellow-600 text-white rounded text-sm hover:bg-yellow-700"
        >
          Reload Data
        </button>
      </div>
    </div>
  );

  // Permission fix instructions
  const permissionFixInstructions = (
    <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-6">
      <h3 className="font-semibold text-blue-800 mb-3">🔧 Fix Required: Database Permissions</h3>
      <div className="text-sm text-blue-700 space-y-3">
        <p>
          The admin panel is experiencing permission issues due to Row Level Security (RLS) policies. 
          To fix this, you need to run a SQL script in your Supabase dashboard.
        </p>
        
        <div className="bg-white border border-blue-200 rounded p-3">
          <h4 className="font-medium text-blue-800 mb-2">Steps to fix:</h4>
          <ol className="list-decimal list-inside space-y-1 text-xs">
            <li>Go to your Supabase Dashboard</li>
            <li>Navigate to SQL Editor</li>
            <li>Open the file: <code className="bg-gray-100 px-1 rounded">fix-admin-permissions.sql</code></li>
            <li>Run the script to update RLS policies</li>
            <li>Refresh this page</li>
          </ol>
        </div>
        
        <p className="text-xs text-blue-600">
          ℹ️ This script will create proper admin permissions for your email: {user?.email}
        </p>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-50 via-white to-pink-50">
      {/* Decorative header background */}
      <div className="relative bg-gradient-to-r from-[#ba1a5d] to-[#9a1549] py-16 mb-8">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="absolute inset-0 bg-[url('/patterns/paisley.svg')] opacity-10"></div>
        <div className="relative max-w-7xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center text-white"
          >
            <h1 className="text-4xl font-serif font-light mb-2">Admin Dashboard</h1>
            <div className="w-24 h-[1px] bg-white/50 mx-auto mb-4"></div>
            <p className="text-white/90">Manage your store's products, categories, and orders</p>
          </motion.div>
        </div>
      </div>
      
      <div className="max-w-7xl mx-auto px-6 pb-12">
        {(products.length === 0 || categories.length === 0) && (
          <>
            {debugInfo}
            {permissionFixInstructions}
          </>
        )}
        
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-5 bg-white border border-rose-200 rounded-xl p-1 shadow-sm">
            <TabsTrigger 
              value="products" 
              className="flex items-center gap-2 data-[state=active]:bg-[#ba1a5d] data-[state=active]:text-white rounded-lg transition-all duration-300"
            >
              <Package className="w-4 h-4" />
              Products
            </TabsTrigger>
            <TabsTrigger 
              value="categories" 
              className="flex items-center gap-2 data-[state=active]:bg-[#ba1a5d] data-[state=active]:text-white rounded-lg transition-all duration-300"
            >
              <Users className="w-4 h-4" />
              Categories
            </TabsTrigger>
            <TabsTrigger 
              value="orders" 
              className="flex items-center gap-2 data-[state=active]:bg-[#ba1a5d] data-[state=active]:text-white rounded-lg transition-all duration-300"
            >
              <ShoppingCart className="w-4 h-4" />
              Orders
            </TabsTrigger>
            <TabsTrigger 
              value="custom-requests" 
              className="flex items-center gap-2 data-[state=active]:bg-[#ba1a5d] data-[state=active]:text-white rounded-lg transition-all duration-300"
            >
              <Image className="w-4 h-4" />
              Custom Requests
            </TabsTrigger>
            <TabsTrigger 
              value="settings" 
              className="flex items-center gap-2 data-[state=active]:bg-[#ba1a5d] data-[state=active]:text-white rounded-lg transition-all duration-300"
            >
              <Settings className="w-4 h-4" />
              Settings
            </TabsTrigger>
          </TabsList>

          <TabsContent value="products" className="space-y-6 mt-8">
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-2xl font-serif text-gray-900">Products Management</h2>
                <p className="text-gray-600 mt-1">Manage your product catalog</p>
              </div>
              <Button 
                onClick={() => setShowProductForm(true)}
                className="flex items-center gap-2 bg-[#ba1a5d] hover:bg-[#9a1549] text-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
              >
                <Plus className="w-4 h-4" />
                Add Product
              </Button>
            </div>

            {showProductForm && (
              <ProductForm
                product={editingProduct}
                onClose={() => {
                  setShowProductForm(false);
                  setEditingProduct(null);
                }}
                onSave={() => {
                  setEditingProduct(null);
                }}
              />
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {products.map((product) => (
                <motion.div
                  key={product.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <Card className="hover:shadow-xl transition-all duration-300 border-rose-100 bg-white/70 backdrop-blur-sm">
                    <CardHeader>
                      <div className="flex justify-between items-start">
                        <div>
                          <CardTitle className="text-lg text-gray-900 font-serif">{product.name}</CardTitle>
                          <CardDescription className="text-[#ba1a5d] font-medium">₹{product.price?.toLocaleString('en-IN')}</CardDescription>
                        </div>
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleEditProduct(product)}
                            className="border-rose-200 hover:bg-rose-50"
                          >
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() => handleDeleteProduct(product.id)}
                            className="bg-red-500 hover:bg-red-600"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      {product.image_urls?.[0] && (
                        <div className="relative overflow-hidden rounded-xl mb-4">
                          <img 
                            src={product.image_urls[0]} 
                            alt={product.name}
                            className="w-full h-48 object-cover transition-transform duration-300 hover:scale-105"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
                        </div>
                      )}
                      <p className="text-sm text-gray-600 mb-4 line-clamp-2">{product.description}</p>
                      <div className="flex items-center justify-between">
                        <Badge 
                          variant={product.featured ? "default" : "secondary"}
                          className={product.featured ? "bg-[#ba1a5d] hover:bg-[#9a1549]" : ""}
                        >
                          {product.featured ? "Featured" : "Regular"}
                        </Badge>
                        <Badge 
                          variant={product.is_active ? "default" : "destructive"}
                          className={product.is_active ? "bg-green-500 hover:bg-green-600" : ""}
                        >
                          {product.is_active ? "Active" : "Inactive"}
                        </Badge>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="categories" className="space-y-6 mt-8">
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-2xl font-serif text-gray-900">Categories Management</h2>
                <p className="text-gray-600 mt-1">Organize your product categories</p>
              </div>
              <Button 
                onClick={() => setShowCategoryForm(true)}
                className="flex items-center gap-2 bg-[#ba1a5d] hover:bg-[#9a1549] text-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
              >
                <Plus className="w-4 h-4" />
                Add Category
              </Button>
            </div>

            {showCategoryForm && (
              <CategoryForm
                category={editingCategory}
                onClose={() => {
                  setShowCategoryForm(false);
                  setEditingCategory(null);
                }}
                onSave={() => {
                  setEditingCategory(null);
                }}
              />
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {categories.map((category) => (
                <motion.div
                  key={category.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <Card className="hover:shadow-xl transition-all duration-300 border-rose-100 bg-white/70 backdrop-blur-sm">
                    <CardHeader>
                      <div className="flex justify-between items-start">
                        <div>
                          <CardTitle className="text-lg text-gray-900 font-serif">{category.name}</CardTitle>
                          <CardDescription className="text-gray-600">/{category.slug}</CardDescription>
                        </div>
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleEditCategory(category)}
                            className="border-rose-200 hover:bg-rose-50"
                          >
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() => handleDeleteCategory(category.id)}
                            className="bg-red-500 hover:bg-red-600"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      {category.image_url && (
                        <div className="relative overflow-hidden rounded-xl mb-4">
                          <img 
                            src={category.image_url} 
                            alt={category.name}
                            className="w-full h-32 object-cover transition-transform duration-300 hover:scale-105"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
                        </div>
                      )}
                      <p className="text-sm text-gray-600">{category.description}</p>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="orders" className="space-y-6 mt-8">
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-2xl font-serif text-gray-900">Orders Management</h2>
                <p className="text-gray-600 mt-1">View and manage customer orders with detailed analytics</p>
              </div>
            </div>
            
            {/* Order Analytics Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card className="border-rose-100 bg-white/70 backdrop-blur-sm">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Total Orders</p>
                      <p className="text-2xl font-bold text-gray-900">{orders.length}</p>
                    </div>
                    <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                      <ShoppingCart className="w-6 h-6 text-blue-600" />
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card className="border-rose-100 bg-white/70 backdrop-blur-sm">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Total Revenue</p>
                      <p className="text-2xl font-bold text-gray-900">
                        ₹{orders.reduce((sum, order) => sum + (order.total_amount || 0), 0).toLocaleString('en-IN')}
                      </p>
                    </div>
                    <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                      <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"></path>
                      </svg>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card className="border-rose-100 bg-white/70 backdrop-blur-sm">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Pending Orders</p>
                      <p className="text-2xl font-bold text-gray-900">
                        {orders.filter(order => order.status === 'pending').length}
                      </p>
                    </div>
                    <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center">
                      <Clock className="w-6 h-6 text-yellow-600" />
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card className="border-rose-100 bg-white/70 backdrop-blur-sm">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Completed Orders</p>
                      <p className="text-2xl font-bold text-gray-900">
                        {orders.filter(order => order.status === 'completed' || order.status === 'delivered').length}
                      </p>
                    </div>
                    <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                      <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                      </svg>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Detailed Orders List */}
            <div className="space-y-4">
              {orders.length === 0 ? (
                <Card className="border-rose-100 bg-white/70 backdrop-blur-sm">
                  <CardContent className="flex items-center justify-center py-12">
                    <div className="text-center">
                      <ShoppingCart className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                      <h3 className="text-lg font-medium text-gray-900 mb-2">No orders yet</h3>
                      <p className="text-gray-600">Orders will appear here once customers start purchasing.</p>
                    </div>
                  </CardContent>
                </Card>
              ) : (
                orders.map((order) => (
                  <OrderDetailCard key={order.id} order={order} />
                ))
              )}
            </div>
          </TabsContent>

          {/* Order Details Modal */}
          <OrderDetailsModal
            order={selectedOrder}
            isOpen={showOrderModal}
            onClose={() => {
              setShowOrderModal(false);
              setSelectedOrder(null);
            }}
          />

          <TabsContent value="custom-requests" className="space-y-6 mt-8">
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-2xl font-serif text-gray-900">Custom Requests</h2>
                <p className="text-gray-600 mt-1">View and manage customer custom design requests</p>
              </div>
            </div>

            <div className="space-y-4">
              {customRequests.length === 0 ? (
                <Card className="border-rose-100 bg-white/70 backdrop-blur-sm">
                  <CardContent className="flex items-center justify-center py-12">
                    <div className="text-center">
                      <Image className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                      <h3 className="text-lg font-medium text-gray-900 mb-2">No custom requests yet</h3>
                      <p className="text-gray-600">Custom design requests will appear here when customers submit them.</p>
                    </div>
                  </CardContent>
                </Card>
              ) : (
                customRequests.map((request) => {
                  // Parse special instructions if it's a JSON string
                  let specialInstructions = {};
                  try {
                    specialInstructions = request.special_instructions ? JSON.parse(request.special_instructions) : {};
                  } catch (e) {
                    specialInstructions = {};
                  }

                  return (
                    <motion.div
                      key={request.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      <Card className="border-rose-100 bg-white/70 backdrop-blur-sm">
                        <CardHeader>
                          <div className="flex justify-between items-start">
                            <div>
                              <CardTitle className="text-lg text-gray-900 font-serif">
                                {specialInstructions.full_name || 'Custom Request'}
                              </CardTitle>
                              <CardDescription className="text-gray-600">
                                {specialInstructions.email || request.contact_phone}
                              </CardDescription>
                              <div className="flex items-center gap-2 mt-2">
                                <Badge 
                                  variant={request.status === 'pending' ? 'secondary' : 
                                          request.status === 'completed' ? 'default' : 'outline'}
                                  className={
                                    request.status === 'pending' ? 'bg-yellow-500 hover:bg-yellow-600 text-white' :
                                    request.status === 'completed' ? 'bg-green-500 hover:bg-green-600' :
                                    request.status === 'in_progress' ? 'bg-blue-500 hover:bg-blue-600 text-white' :
                                    'bg-gray-500 hover:bg-gray-600 text-white'
                                  }
                                >
                                  {request.status}
                                </Badge>
                                <span className="text-sm text-gray-500">
                                  {new Date(request.created_at).toLocaleDateString()}
                                </span>
                              </div>
                            </div>
                            <div className="flex gap-2">
                              <select
                                value={request.status}
                                onChange={(e) => handleUpdateCustomRequestStatus(request.id, e.target.value)}
                                className="text-sm border border-gray-300 rounded px-2 py-1"
                              >
                                <option value="pending">Pending</option>
                                <option value="in_progress">In Progress</option>
                                <option value="completed">Completed</option>
                                <option value="cancelled">Cancelled</option>
                              </select>
                              <Button
                                size="sm"
                                variant="destructive"
                                onClick={() => handleDeleteCustomRequest(request.id)}
                                className="bg-red-500 hover:bg-red-600"
                              >
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </div>
                          </div>
                        </CardHeader>
                        <CardContent>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Left side - Image */}
                            <div>
                              {request.reference_images && request.reference_images.length > 0 && (
                                <div className="space-y-2">
                                  <h4 className="font-medium text-gray-900">Reference Image:</h4>
                                  <div className="relative overflow-hidden rounded-lg border border-gray-200">
                                    <img 
                                      src={request.reference_images[0]} 
                                      alt="Custom design reference"
                                      className="w-full h-48 object-cover"
                                    />
                                  </div>
                                </div>
                              )}
                            </div>

                            {/* Right side - Details */}
                            <div className="space-y-4">
                              <div>
                                <h4 className="font-medium text-gray-900 mb-2">Request Details:</h4>
                                <div className="space-y-2 text-sm">
                                  <p><strong>Occasion:</strong> {specialInstructions.occasion || 'Not specified'}</p>
                                  <p><strong>Budget:</strong> {specialInstructions.budget_range || 'Not specified'}</p>
                                  <p><strong>Delivery Days:</strong> {specialInstructions.delivery_days || 'Not specified'}</p>
                                  <p><strong>Phone:</strong> {specialInstructions.phone || request.contact_phone || 'Not provided'}</p>
                                </div>
                              </div>

                              {request.preferred_colors && (
                                <div>
                                  <h4 className="font-medium text-gray-900 mb-1">Preferred Colors:</h4>
                                  <p className="text-sm text-gray-600">{request.preferred_colors}</p>
                                </div>
                              )}

                              {request.size_requirements && (
                                <div>
                                  <h4 className="font-medium text-gray-900 mb-1">Size Requirements:</h4>
                                  <p className="text-sm text-gray-600">{request.size_requirements}</p>
                                </div>
                              )}

                              {request.description && (
                                <div>
                                  <h4 className="font-medium text-gray-900 mb-1">Description:</h4>
                                  <p className="text-sm text-gray-600">{request.description}</p>
                                </div>
                              )}

                              {request.deadline && (
                                <div>
                                  <h4 className="font-medium text-gray-900 mb-1">Deadline:</h4>
                                  <p className="text-sm text-gray-600 flex items-center">
                                    <Clock className="w-4 h-4 mr-1" />
                                    {new Date(request.deadline).toLocaleDateString()}
                                  </p>
                                </div>
                              )}
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  );
                })
              )}
            </div>
          </TabsContent>

          <TabsContent value="settings" className="space-y-6 mt-8">
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-2xl font-serif text-gray-900">Site Settings</h2>
                <p className="text-gray-600 mt-1">Manage your website's dynamic content and configuration</p>
              </div>
            </div>

            <SettingsForm />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Admin;