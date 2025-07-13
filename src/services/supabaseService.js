import { supabase } from '@/integrations/supabase/client';

// Products Service
export const productsService = {
  async getAll(filters = {}) {
    let query = supabase
      .from('products')
      .select(`
        *,
        categories (
          id,
          name,
          slug
        )
      `)
      .eq('is_active', true)
      .order('created_at', { ascending: false });

    if (filters.category_id) {
      query = query.eq('category_id', filters.category_id);
    }
    
    if (filters.featured) {
      query = query.eq('featured', true);
    }

    const { data, error } = await query;
    if (error) throw error;
    return data;
  },

  async getById(id) {
    const { data, error } = await supabase
      .from('products')
      .select(`
        *,
        categories (
          id,
          name,
          slug
        )
      `)
      .eq('id', id)
      .eq('is_active', true)
      .single();
    
    if (error) throw error;
    return data;
  },

  async create(product) {
    const { data, error } = await supabase
      .from('products')
      .insert(product)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  async update(id, updates) {
    const { data, error } = await supabase
      .from('products')
      .update(updates)
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  async delete(id) {
    const { error } = await supabase
      .from('products')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
  }
};

// Categories Service
export const categoriesService = {
  async getAll() {
    const { data, error } = await supabase
      .from('categories')
      .select('*')
      .eq('is_active', true)
      .order('sort_order', { ascending: true });
    
    if (error) throw error;
    return data;
  },

  async create(category) {
    const { data, error } = await supabase
      .from('categories')
      .insert(category)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  async update(id, updates) {
    const { data, error } = await supabase
      .from('categories')
      .update(updates)
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  async delete(id) {
    const { error } = await supabase
      .from('categories')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
  }
};

// Cart Service
export const cartService = {
  async getCart(userId) {
    const { data, error } = await supabase
      .from('cart_items')
      .select(`
        *,
        products (
          id,
          name,
          price,
          image_urls
        )
      `)
      .eq('user_id', userId);
    
    if (error) throw error;
    return data;
  },

  async addItem(userId, productId, quantity = 1, size = null, color = null) {
    // Check if item already exists
    const { data: existing } = await supabase
      .from('cart_items')
      .select('*')
      .eq('user_id', userId)
      .eq('product_id', productId)
      .eq('size', size)
      .eq('color', color)
      .maybeSingle();

    if (existing) {
      // Update quantity
      const { data, error } = await supabase
        .from('cart_items')
        .update({ quantity: existing.quantity + quantity })
        .eq('id', existing.id)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    } else {
      // Create new item
      const { data, error } = await supabase
        .from('cart_items')
        .insert({
          user_id: userId,
          product_id: productId,
          quantity,
          size,
          color
        })
        .select()
        .single();
      
      if (error) throw error;
      return data;
    }
  },

  async updateQuantity(itemId, quantity) {
    const { data, error } = await supabase
      .from('cart_items')
      .update({ quantity })
      .eq('id', itemId)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  async removeItem(itemId) {
    const { error } = await supabase
      .from('cart_items')
      .delete()
      .eq('id', itemId);
    
    if (error) throw error;
  },

  async clearCart(userId) {
    const { error } = await supabase
      .from('cart_items')
      .delete()
      .eq('user_id', userId);
    
    if (error) throw error;
  }
};

// Orders Service
export const ordersService = {
  async getAll() {
    const { data, error } = await supabase
      .from('orders')
      .select(`
        *,
        profiles (
          full_name,
          phone
        ),
        order_items (
          *,
          products (
            name,
            image_urls
          )
        )
      `)
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data;
  },

  async getUserOrders(userId) {
    const { data, error } = await supabase
      .from('orders')
      .select(`
        *,
        order_items (
          *,
          products (
            name,
            image_urls
          )
        )
      `)
      .eq('user_id', userId)
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data;
  },

  async create(order, orderItems) {
    const { data: orderData, error: orderError } = await supabase
      .from('orders')
      .insert(order)
      .select()
      .single();
    
    if (orderError) throw orderError;

    const itemsWithOrderId = orderItems.map(item => ({
      ...item,
      order_id: orderData.id
    }));

    const { data: itemsData, error: itemsError } = await supabase
      .from('order_items')
      .insert(itemsWithOrderId)
      .select();
    
    if (itemsError) throw itemsError;

    return { order: orderData, items: itemsData };
  },

  async updateStatus(orderId, status) {
    const { data, error } = await supabase
      .from('orders')
      .update({ status })
      .eq('id', orderId)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  }
};

// Wishlist Service
export const wishlistService = {
  async getWishlist(userId) {
    const { data, error } = await supabase
      .from('wishlist_items')
      .select(`
        *,
        products (
          id,
          name,
          price,
          image_urls
        )
      `)
      .eq('user_id', userId);
    
    if (error) throw error;
    return data;
  },

  async addItem(userId, productId) {
    const { data, error } = await supabase
      .from('wishlist_items')
      .insert({
        user_id: userId,
        product_id: productId
      })
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  async removeItem(userId, productId) {
    const { error } = await supabase
      .from('wishlist_items')
      .delete()
      .eq('user_id', userId)
      .eq('product_id', productId);
    
    if (error) throw error;
  }
};

// Site Settings Service
export const siteSettingsService = {
  async getSettings() {
    const { data, error } = await supabase
      .from('site_settings')
      .select('*')
      .limit(1)
      .maybeSingle();
    
    if (error) throw error;
    return data;
  },

  async updateSettings(settings) {
    const { data, error } = await supabase
      .from('site_settings')
      .upsert(settings)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  }
};