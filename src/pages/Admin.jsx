import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Navigate } from 'react-router-dom';
import { productsService, categoriesService, ordersService, siteSettingsService } from '../services/supabaseService';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Textarea } from '../components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Plus, Edit, Trash2, Package, ShoppingCart, Settings, Users } from 'lucide-react';
import { useToast } from '../hooks/use-toast';

const Admin = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  
  // State for different sections
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [orders, setOrders] = useState([]);
  const [siteSettings, setSiteSettings] = useState({});
  
  // Form states
  const [showProductForm, setShowProductForm] = useState(false);
  const [showCategoryForm, setShowCategoryForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [editingCategory, setEditingCategory] = useState(null);

  // Check if user is admin (for now, any authenticated user is admin)
  if (!user) {
    return <Navigate to="/auth" replace />;
  }

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [productsData, categoriesData, ordersData, settingsData] = await Promise.all([
        productsService.getAll(),
        categoriesService.getAll(),
        ordersService.getAll(),
        siteSettingsService.getSettings()
      ]);
      
      setProducts(productsData);
      setCategories(categoriesData);
      setOrders(ordersData);
      setSiteSettings(settingsData || {});
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
      stock_quantity: 0
    });

    const handleSubmit = async (e) => {
      e.preventDefault();
      try {
        const productData = {
          ...formData,
          price: parseFloat(formData.price),
          stock_quantity: parseInt(formData.stock_quantity),
          colors: Array.isArray(formData.colors) ? formData.colors : formData.colors.split(',').map(c => c.trim()),
          sizes: Array.isArray(formData.sizes) ? formData.sizes : formData.sizes.split(',').map(s => s.trim()),
          image_urls: Array.isArray(formData.image_urls) ? formData.image_urls : formData.image_urls.split(',').map(u => u.trim())
        };

        if (product) {
          await productsService.update(product.id, productData);
          toast({ title: "Product updated successfully" });
        } else {
          await productsService.create(productData);
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
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>{product ? 'Edit Product' : 'Add New Product'}</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              placeholder="Product Name"
              value={formData.name}
              onChange={(e) => setFormData({...formData, name: e.target.value})}
              required
            />
            <Textarea
              placeholder="Description"
              value={formData.description}
              onChange={(e) => setFormData({...formData, description: e.target.value})}
            />
            <Input
              type="number"
              step="0.01"
              placeholder="Price"
              value={formData.price}
              onChange={(e) => setFormData({...formData, price: e.target.value})}
              required
            />
            <select
              className="w-full p-2 border rounded-md"
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
              placeholder="Colors (comma separated)"
              value={Array.isArray(formData.colors) ? formData.colors.join(', ') : formData.colors}
              onChange={(e) => setFormData({...formData, colors: e.target.value})}
            />
            <Input
              placeholder="Sizes (comma separated)"
              value={Array.isArray(formData.sizes) ? formData.sizes.join(', ') : formData.sizes}
              onChange={(e) => setFormData({...formData, sizes: e.target.value})}
            />
            <Input
              placeholder="Image URLs (comma separated)"
              value={Array.isArray(formData.image_urls) ? formData.image_urls.join(', ') : formData.image_urls}
              onChange={(e) => setFormData({...formData, image_urls: e.target.value})}
            />
            <Input
              type="number"
              placeholder="Stock Quantity"
              value={formData.stock_quantity}
              onChange={(e) => setFormData({...formData, stock_quantity: e.target.value})}
            />
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={formData.featured}
                onChange={(e) => setFormData({...formData, featured: e.target.checked})}
              />
              <span>Featured Product</span>
            </label>
            <div className="flex space-x-2">
              <Button type="submit">Save</Button>
              <Button type="button" variant="outline" onClick={onClose}>Cancel</Button>
            </div>
          </form>
        </CardContent>
      </Card>
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
          await categoriesService.update(category.id, categoryData);
          toast({ title: "Category updated successfully" });
        } else {
          await categoriesService.create(categoryData);
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
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>{category ? 'Edit Category' : 'Add New Category'}</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              placeholder="Category Name"
              value={formData.name}
              onChange={(e) => setFormData({...formData, name: e.target.value})}
              required
            />
            <Input
              placeholder="Slug"
              value={formData.slug}
              onChange={(e) => setFormData({...formData, slug: e.target.value})}
              required
            />
            <Textarea
              placeholder="Description"
              value={formData.description}
              onChange={(e) => setFormData({...formData, description: e.target.value})}
            />
            <Input
              placeholder="Image URL"
              value={formData.image_url}
              onChange={(e) => setFormData({...formData, image_url: e.target.value})}
            />
            <Input
              type="number"
              placeholder="Sort Order"
              value={formData.sort_order}
              onChange={(e) => setFormData({...formData, sort_order: e.target.value})}
            />
            <div className="flex space-x-2">
              <Button type="submit">Save</Button>
              <Button type="button" variant="outline" onClick={onClose}>Cancel</Button>
            </div>
          </form>
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground">Admin Dashboard</h1>
          <p className="text-muted-foreground">Manage your store</p>
        </div>

        <Tabs defaultValue="products" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="products" className="flex items-center space-x-2">
              <Package className="w-4 h-4" />
              <span>Products</span>
            </TabsTrigger>
            <TabsTrigger value="categories" className="flex items-center space-x-2">
              <Users className="w-4 h-4" />
              <span>Categories</span>
            </TabsTrigger>
            <TabsTrigger value="orders" className="flex items-center space-x-2">
              <ShoppingCart className="w-4 h-4" />
              <span>Orders</span>
            </TabsTrigger>
            <TabsTrigger value="settings" className="flex items-center space-x-2">
              <Settings className="w-4 h-4" />
              <span>Settings</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="products" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-semibold">Products</h2>
              <Button onClick={() => setShowProductForm(!showProductForm)}>
                <Plus className="w-4 h-4 mr-2" />
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

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {products.map(product => (
                <Card key={product.id}>
                  <CardContent className="p-4">
                    <div className="aspect-square bg-muted rounded-lg mb-4 flex items-center justify-center">
                      {product.image_urls?.[0] ? (
                        <img 
                          src={product.image_urls[0]} 
                          alt={product.name}
                          className="w-full h-full object-cover rounded-lg"
                        />
                      ) : (
                        <Package className="w-12 h-12 text-muted-foreground" />
                      )}
                    </div>
                    <h3 className="font-semibold truncate">{product.name}</h3>
                    <p className="text-primary font-bold">₹{product.price}</p>
                    <div className="flex justify-between items-center mt-2">
                      <Badge variant={product.featured ? "default" : "secondary"}>
                        {product.featured ? "Featured" : "Regular"}
                      </Badge>
                      <div className="flex space-x-1">
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => {
                            setEditingProduct(product);
                            setShowProductForm(true);
                          }}
                        >
                          <Edit className="w-3 h-3" />
                        </Button>
                        <Button 
                          size="sm" 
                          variant="destructive"
                          onClick={async () => {
                            if (confirm('Delete this product?')) {
                              await productsService.delete(product.id);
                              loadData();
                              toast({ title: "Product deleted" });
                            }
                          }}
                        >
                          <Trash2 className="w-3 h-3" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="categories" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-semibold">Categories</h2>
              <Button onClick={() => setShowCategoryForm(!showCategoryForm)}>
                <Plus className="w-4 h-4 mr-2" />
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

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {categories.map(category => (
                <Card key={category.id}>
                  <CardContent className="p-4">
                    <h3 className="font-semibold">{category.name}</h3>
                    <p className="text-sm text-muted-foreground">{category.slug}</p>
                    <p className="text-sm mt-2">{category.description}</p>
                    <div className="flex justify-end space-x-1 mt-4">
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => {
                          setEditingCategory(category);
                          setShowCategoryForm(true);
                        }}
                      >
                        <Edit className="w-3 h-3" />
                      </Button>
                      <Button 
                        size="sm" 
                        variant="destructive"
                        onClick={async () => {
                          if (confirm('Delete this category?')) {
                            await categoriesService.delete(category.id);
                            loadData();
                            toast({ title: "Category deleted" });
                          }
                        }}
                      >
                        <Trash2 className="w-3 h-3" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="orders" className="space-y-6">
            <h2 className="text-2xl font-semibold">Orders</h2>
            <div className="space-y-4">
              {orders.map(order => (
                <Card key={order.id}>
                  <CardContent className="p-4">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="font-semibold">Order #{order.id.slice(0, 8)}</h3>
                        <p className="text-sm text-muted-foreground">
                          {new Date(order.created_at).toLocaleDateString()}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-bold">₹{order.total_amount}</p>
                        <Badge variant={order.status === 'completed' ? 'default' : 'secondary'}>
                          {order.status}
                        </Badge>
                      </div>
                    </div>
                    <div className="text-sm">
                      <p><strong>Customer:</strong> {order.profiles?.full_name || 'N/A'}</p>
                      <p><strong>Items:</strong> {order.order_items?.length || 0}</p>
                      <p><strong>Payment:</strong> {order.payment_status}</p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="settings" className="space-y-6">
            <h2 className="text-2xl font-semibold">Site Settings</h2>
            <Card>
              <CardContent className="p-6">
                <p className="text-muted-foreground">Site settings management coming soon...</p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Admin;