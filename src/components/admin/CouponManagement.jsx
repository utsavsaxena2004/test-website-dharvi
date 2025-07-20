import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { 
  Plus, 
  Edit2, 
  Trash2, 
  Tag, 
  Users, 
  TrendingUp, 
  Calendar,
  Percent,
  IndianRupee,
  Eye,
  BarChart3
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import couponService from '@/services/couponService';

const CouponManagement = () => {
  const [coupons, setCoupons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [editingCoupon, setEditingCoupon] = useState(null);
  const [selectedCoupon, setSelectedCoupon] = useState(null);
  const [analytics, setAnalytics] = useState(null);
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    code: '',
    name: '',
    description: '',
    discount_type: 'percentage',
    discount_value: '',
    minimum_order_amount: '',
    maximum_discount: '',
    usage_limit: '',
    valid_until: ''
  });

  useEffect(() => {
    fetchCoupons();
  }, []);

  const fetchCoupons = async () => {
    try {
      setLoading(true);
      const data = await couponService.getAllCoupons();
      setCoupons(data);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch coupons",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      code: '',
      name: '',
      description: '',
      discount_type: 'percentage',
      discount_value: '',
      minimum_order_amount: '',
      maximum_discount: '',
      usage_limit: '',
      valid_until: ''
    });
    setShowCreateForm(false);
    setEditingCoupon(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const couponData = {
        ...formData,
        code: formData.code.toUpperCase(),
        discount_value: parseFloat(formData.discount_value),
        minimum_order_amount: formData.minimum_order_amount ? parseFloat(formData.minimum_order_amount) : 0,
        maximum_discount: formData.maximum_discount ? parseFloat(formData.maximum_discount) : null,
        usage_limit: formData.usage_limit ? parseInt(formData.usage_limit) : null,
        valid_until: formData.valid_until ? new Date(formData.valid_until).toISOString() : null
      };

      if (editingCoupon) {
        await couponService.updateCoupon(editingCoupon.id, couponData);
        toast({
          title: "Success",
          description: "Coupon updated successfully"
        });
      } else {
        await couponService.createCoupon(couponData);
        toast({
          title: "Success",
          description: "Coupon created successfully"
        });
      }

      resetForm();
      fetchCoupons();
    } catch (error) {
      toast({
        title: "Error",
        description: error.message || "Failed to save coupon",
        variant: "destructive"
      });
    }
  };

  const handleEdit = (coupon) => {
    setFormData({
      code: coupon.code,
      name: coupon.name,
      description: coupon.description || '',
      discount_type: coupon.discount_type,
      discount_value: coupon.discount_value.toString(),
      minimum_order_amount: coupon.minimum_order_amount?.toString() || '',
      maximum_discount: coupon.maximum_discount?.toString() || '',
      usage_limit: coupon.usage_limit?.toString() || '',
      valid_until: coupon.valid_until ? new Date(coupon.valid_until).toISOString().split('T')[0] : ''
    });
    setEditingCoupon(coupon);
    setShowCreateForm(true);
  };

  const handleDelete = async (couponId) => {
    if (!confirm('Are you sure you want to delete this coupon?')) return;

    try {
      await couponService.deleteCoupon(couponId);
      toast({
        title: "Success",
        description: "Coupon deleted successfully"
      });
      fetchCoupons();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete coupon",
        variant: "destructive"
      });
    }
  };

  const handleToggleStatus = async (coupon) => {
    try {
      await couponService.updateCoupon(coupon.id, { is_active: !coupon.is_active });
      toast({
        title: "Success",
        description: `Coupon ${coupon.is_active ? 'deactivated' : 'activated'} successfully`
      });
      fetchCoupons();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update coupon status",
        variant: "destructive"
      });
    }
  };

  const viewAnalytics = async (coupon) => {
    try {
      const data = await couponService.getCouponAnalytics(coupon.id);
      setAnalytics(data);
      setSelectedCoupon(coupon);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch analytics",
        variant: "destructive"
      });
    }
  };

  const formatCurrency = (amount) => `₹${parseFloat(amount || 0).toFixed(2)}`;

  const getDiscountDisplay = (coupon) => {
    if (coupon.discount_type === 'percentage') {
      return `${coupon.discount_value}%`;
    }
    return formatCurrency(coupon.discount_value);
  };

  if (selectedCoupon && analytics) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-foreground">Coupon Analytics</h2>
            <p className="text-muted-foreground">Detailed insights for {selectedCoupon.code}</p>
          </div>
          <Button onClick={() => { setSelectedCoupon(null); setAnalytics(null); }}>
            Back to Coupons
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-primary/10 rounded-lg">
                  <Users className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Total Orders</p>
                  <p className="text-2xl font-bold text-foreground">{analytics.analytics.totalOrders}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-success/10 rounded-lg">
                  <TrendingUp className="h-5 w-5 text-success" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Total Revenue</p>
                  <p className="text-2xl font-bold text-foreground">{formatCurrency(analytics.analytics.totalRevenue)}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-destructive/10 rounded-lg">
                  <Tag className="h-5 w-5 text-destructive" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Total Discount</p>
                  <p className="text-2xl font-bold text-foreground">{formatCurrency(analytics.analytics.totalDiscount)}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-accent/10 rounded-lg">
                  <BarChart3 className="h-5 w-5 text-accent" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Avg Order Value</p>
                  <p className="text-2xl font-bold text-foreground">{formatCurrency(analytics.analytics.averageOrderValue)}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Recent Orders Using This Coupon</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {analytics.orders.length === 0 ? (
                <p className="text-muted-foreground text-center py-8">No orders found for this coupon</p>
              ) : (
                analytics.orders.map((order) => (
                  <div key={order.id} className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                    <div>
                      <p className="font-medium">Order #{order.id.slice(0, 8)}</p>
                      <p className="text-sm text-muted-foreground">
                        {new Date(order.created_at).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium">{formatCurrency(order.total_amount)}</p>
                      <p className="text-sm text-success">-{formatCurrency(order.discount_amount)} discount</p>
                    </div>
                    <Badge variant={order.status === 'confirmed' ? 'default' : 'secondary'}>
                      {order.status}
                    </Badge>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-foreground">Coupon Management</h2>
          <p className="text-muted-foreground">Create and manage discount coupons</p>
        </div>
        <Button onClick={() => setShowCreateForm(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Create Coupon
        </Button>
      </div>

      {showCreateForm && (
        <Card>
          <CardHeader>
            <CardTitle>{editingCoupon ? 'Edit Coupon' : 'Create New Coupon'}</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-foreground">Coupon Code *</label>
                  <Input
                    value={formData.code}
                    onChange={(e) => setFormData({ ...formData, code: e.target.value.toUpperCase() })}
                    placeholder="e.g., SAVE20"
                    required
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-foreground">Coupon Name *</label>
                  <Input
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="e.g., 20% Off Summer Sale"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="text-sm font-medium text-foreground">Description</label>
                <Textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Optional description"
                  rows={2}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="text-sm font-medium text-foreground">Discount Type *</label>
                  <select
                    value={formData.discount_type}
                    onChange={(e) => setFormData({ ...formData, discount_type: e.target.value })}
                    className="w-full p-2 border rounded-md bg-background"
                    required
                  >
                    <option value="percentage">Percentage</option>
                    <option value="fixed">Fixed Amount</option>
                  </select>
                </div>
                <div>
                  <label className="text-sm font-medium text-foreground">
                    Discount Value * {formData.discount_type === 'percentage' ? '(%)' : '(₹)'}
                  </label>
                  <Input
                    type="number"
                    step="0.01"
                    min="0"
                    value={formData.discount_value}
                    onChange={(e) => setFormData({ ...formData, discount_value: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-foreground">Max Discount (₹)</label>
                  <Input
                    type="number"
                    step="0.01"
                    min="0"
                    value={formData.maximum_discount}
                    onChange={(e) => setFormData({ ...formData, maximum_discount: e.target.value })}
                    placeholder="Optional"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="text-sm font-medium text-foreground">Min Order Amount (₹)</label>
                  <Input
                    type="number"
                    step="0.01"
                    min="0"
                    value={formData.minimum_order_amount}
                    onChange={(e) => setFormData({ ...formData, minimum_order_amount: e.target.value })}
                    placeholder="0"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-foreground">Usage Limit</label>
                  <Input
                    type="number"
                    min="1"
                    value={formData.usage_limit}
                    onChange={(e) => setFormData({ ...formData, usage_limit: e.target.value })}
                    placeholder="Unlimited"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-foreground">Valid Until</label>
                  <Input
                    type="date"
                    value={formData.valid_until}
                    onChange={(e) => setFormData({ ...formData, valid_until: e.target.value })}
                  />
                </div>
              </div>

              <div className="flex gap-3 pt-4">
                <Button type="submit">
                  {editingCoupon ? 'Update Coupon' : 'Create Coupon'}
                </Button>
                <Button type="button" variant="outline" onClick={resetForm}>
                  Cancel
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      <div className="grid gap-4">
        {loading ? (
          <Card>
            <CardContent className="p-8 text-center">
              <p className="text-muted-foreground">Loading coupons...</p>
            </CardContent>
          </Card>
        ) : coupons.length === 0 ? (
          <Card>
            <CardContent className="p-8 text-center">
              <Tag className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
              <p className="text-muted-foreground">No coupons created yet</p>
            </CardContent>
          </Card>
        ) : (
          coupons.map((coupon) => (
            <Card key={coupon.id}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-lg font-semibold text-foreground">{coupon.code}</h3>
                      <Badge variant={coupon.is_active ? 'default' : 'secondary'}>
                        {coupon.is_active ? 'Active' : 'Inactive'}
                      </Badge>
                      <div className="flex items-center gap-1 text-sm text-muted-foreground">
                        {coupon.discount_type === 'percentage' ? (
                          <Percent className="h-4 w-4" />
                        ) : (
                          <IndianRupee className="h-4 w-4" />
                        )}
                        {getDiscountDisplay(coupon)}
                      </div>
                    </div>
                    <p className="text-foreground font-medium">{coupon.name}</p>
                    {coupon.description && (
                      <p className="text-sm text-muted-foreground">{coupon.description}</p>
                    )}
                    <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
                      <span>Used: {coupon.used_count}/{coupon.usage_limit || '∞'}</span>
                      {coupon.minimum_order_amount > 0 && (
                        <span>Min: {formatCurrency(coupon.minimum_order_amount)}</span>
                      )}
                      {coupon.valid_until && (
                        <span>
                          <Calendar className="h-4 w-4 inline mr-1" />
                          {new Date(coupon.valid_until).toLocaleDateString()}
                        </span>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2 ml-4">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => viewAnalytics(coupon)}
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleEdit(coupon)}
                    >
                      <Edit2 className="h-4 w-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleToggleStatus(coupon)}
                    >
                      {coupon.is_active ? 'Deactivate' : 'Activate'}
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleDelete(coupon.id)}
                      className="text-destructive hover:text-destructive"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
};

export default CouponManagement;