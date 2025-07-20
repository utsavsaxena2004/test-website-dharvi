import { supabase } from '@/integrations/supabase/client';

class CouponService {
  // Create a new coupon
  async createCoupon(couponData) {
    try {
      const { data, error } = await supabase
        .from('coupons')
        .insert([couponData])
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error creating coupon:', error);
      throw error;
    }
  }

  // Get all coupons (admin)
  async getAllCoupons() {
    try {
      const { data, error } = await supabase
        .from('coupons')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error fetching coupons:', error);
      throw error;
    }
  }

  // Get active coupons (public)
  async getActiveCoupons() {
    try {
      const { data, error } = await supabase
        .from('coupons')
        .select('*')
        .eq('is_active', true)
        .or('valid_until.is.null,valid_until.gt.' + new Date().toISOString())
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error fetching active coupons:', error);
      throw error;
    }
  }

  // Update coupon
  async updateCoupon(id, updates) {
    try {
      const { data, error } = await supabase
        .from('coupons')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error updating coupon:', error);
      throw error;
    }
  }

  // Delete coupon
  async deleteCoupon(id) {
    try {
      const { error } = await supabase
        .from('coupons')
        .delete()
        .eq('id', id);

      if (error) throw error;
      return true;
    } catch (error) {
      console.error('Error deleting coupon:', error);
      throw error;
    }
  }

  // Validate coupon code
  async validateCoupon(couponCode, orderAmount) {
    try {
      const { data, error } = await supabase
        .rpc('validate_coupon', {
          coupon_code_input: couponCode,
          order_amount: orderAmount
        });

      if (error) throw error;
      return data[0]; // Returns first result
    } catch (error) {
      console.error('Error validating coupon:', error);
      throw error;
    }
  }

  // Get coupon analytics
  async getCouponAnalytics(couponId) {
    try {
      // Get coupon details
      const { data: coupon, error: couponError } = await supabase
        .from('coupons')
        .select('*')
        .eq('id', couponId)
        .single();

      if (couponError) throw couponError;

      // Get orders using this coupon
      const { data: orders, error: ordersError } = await supabase
        .from('orders')
        .select('id, total_amount, discount_amount, created_at, status')
        .eq('coupon_id', couponId);

      if (ordersError) throw ordersError;

      // Calculate analytics
      const totalOrders = orders.length;
      const totalRevenue = orders.reduce((sum, order) => sum + parseFloat(order.total_amount || 0), 0);
      const totalDiscount = orders.reduce((sum, order) => sum + parseFloat(order.discount_amount || 0), 0);
      const completedOrders = orders.filter(order => order.status === 'completed').length;

      return {
        coupon,
        orders,
        analytics: {
          totalOrders,
          completedOrders,
          totalRevenue,
          totalDiscount,
          averageOrderValue: totalOrders > 0 ? totalRevenue / totalOrders : 0,
          conversionRate: totalOrders > 0 ? (completedOrders / totalOrders) * 100 : 0
        }
      };
    } catch (error) {
      console.error('Error fetching coupon analytics:', error);
      throw error;
    }
  }

  // Get all coupons analytics summary
  async getAllCouponsAnalytics() {
    try {
      const { data: coupons, error } = await supabase
        .from('coupons')
        .select(`
          *,
          orders:orders(count)
        `);

      if (error) throw error;

      // Get detailed analytics for each coupon
      const analytics = await Promise.all(
        coupons.map(async (coupon) => {
          const couponAnalytics = await this.getCouponAnalytics(coupon.id);
          return {
            ...coupon,
            ...couponAnalytics.analytics
          };
        })
      );

      return analytics;
    } catch (error) {
      console.error('Error fetching all coupons analytics:', error);
      throw error;
    }
  }
}

export default new CouponService();