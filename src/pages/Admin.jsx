import React, { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, Package, Users, ShoppingCart, Settings, ArrowLeft } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { supabaseService } from '../services/supabaseService';
import { useToast } from '../hooks/use-toast';
import { useAuth } from '../contexts/AuthContext';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const Admin = () => {
  const { user } = useAuth();
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [orders, setOrders] = useState([]);
  const [settings, setSettings] = useState({});
  const [loading, setLoading] = useState(true);
  const [showProductForm, setShowProductForm] = useState(false);
  const [showCategoryForm, setShowCategoryForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [editingCategory, setEditingCategory] = useState(null);
  const { toast } = useToast();

  const loadData = async () => {
    try {
      setLoading(true);
      
      // Load products, categories, and settings
      const [productsData, categoriesData, settingsData] = await Promise.all([
        supabaseService.getProducts(),
        supabaseService.getCategories(),
        supabaseService.getSettings()
      ]);
      
      setProducts(productsData);
      setCategories(categoriesData);
      setSettings(settingsData);
      
      // Try to load orders separately with error handling
      try {
        const ordersData = await supabaseService.getOrders();
        setOrders(ordersData);
      } catch (ordersError) {
        console.warn('Failed to load orders:', ordersError);
        setOrders([]); // Set empty array if orders fail to load
      }
      
    } catch (error) {
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
    loadData();
  }, []);

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
        toast({ title: "Category deleted successfully" });
        loadData();
      } catch (error) {
        toast({
          title: "Error deleting category",
          description: error.message,
          variant: "destructive"
        });
      }
    }
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
        }
        
        onSave();
        onClose();
        loadData();
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
              
              <Input
                placeholder="Image URLs (comma separated)"
                value={Array.isArray(formData.image_urls) ? formData.image_urls.join(', ') : formData.image_urls}
                onChange={(e) => setFormData({...formData, image_urls: e.target.value})}
                className="border-rose-200 focus:border-[#ba1a5d]"
              />
              
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
      sort_order: 0
    });

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
                <Input
                  placeholder="Image URL"
                  value={formData.image_url}
                  onChange={(e) => setFormData({...formData, image_url: e.target.value})}
                  className="border-rose-200 focus:border-[#ba1a5d]"
                />
                
                <Input
                  type="number"
                  placeholder="Sort Order"
                  value={formData.sort_order}
                  onChange={(e) => setFormData({...formData, sort_order: e.target.value})}
                  className="border-rose-200 focus:border-[#ba1a5d]"
                />
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
        <Tabs defaultValue="products" className="w-full">
          <TabsList className="grid w-full grid-cols-4 bg-white border border-rose-200 rounded-xl p-1 shadow-sm">
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
            <div>
              <h2 className="text-2xl font-serif text-gray-900">Orders Management</h2>
              <p className="text-gray-600 mt-1">View and manage customer orders</p>
            </div>
            
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
                  <motion.div
                    key={order.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                  >
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
                              variant={order.status === 'completed' ? 'default' : 'secondary'}
                              className={order.status === 'completed' ? 'bg-green-500' : ''}
                            >
                              {order.status}
                            </Badge>
                          </div>
                        </div>
                        <div className="text-sm space-y-1">
                          <p><strong>Payment Status:</strong> {order.payment_status}</p>
                          <p><strong>Shipping:</strong> {order.shipping_address_line1}</p>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))
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