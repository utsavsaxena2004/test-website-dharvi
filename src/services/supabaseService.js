import { supabase } from '@/integrations/supabase/client';

// Products Service
export const productsService = {
  async getAll(filters = {}) {
    let query = supabase
      .from('products')
      .select(`
        *,
        categories!products_category_id_fkey (
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
    return data || [];
  },

  async getById(id) {
    const { data, error } = await supabase
      .from('products')
      .select(`
        *,
        categories!products_category_id_fkey (
          id,
          name,
          slug
        )
      `)
      .eq('id', id)
      .eq('is_active', true)
      .single();
    
    if (error) {
      if (error.code === 'PGRST116') { // No rows returned
        throw new Error('Product not found');
      }
      throw error;
    }
    return data;
  },

  async create(product) {
    // Generate slug from name if not provided
    if (!product.slug && product.name) {
      let baseSlug = product.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
      product.slug = baseSlug;
      
      // Check if slug already exists and make it unique
      let counter = 1;
      while (true) {
        const { data: existing } = await supabase
          .from('products')
          .select('id')
          .eq('slug', product.slug)
          .maybeSingle();
        
        if (!existing) break;
        product.slug = `${baseSlug}-${counter}`;
        counter++;
      }
    }
    
    const { data, error } = await supabase
      .from('products')
      .insert(product)
      .select()
      .single();
    
    if (error) {
      if (error.code === '23505') { // Unique constraint violation
        throw new Error('A product with this name or slug already exists');
      }
      throw error;
    }
    return data;
  },

  async update(id, updates) {
    // Generate slug from name if name is being updated and slug is not provided
    if (updates.name && !updates.slug) {
      let baseSlug = updates.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
      updates.slug = baseSlug;
      
      // Check if slug already exists (excluding current record) and make it unique
      let counter = 1;
      while (true) {
        const { data: existing } = await supabase
          .from('products')
          .select('id')
          .eq('slug', updates.slug)
          .neq('id', id)
          .maybeSingle();
        
        if (!existing) break;
        updates.slug = `${baseSlug}-${counter}`;
        counter++;
      }
    }
    
    const { data, error } = await supabase
      .from('products')
      .update(updates)
      .eq('id', id)
      .select()
      .single();
    
    if (error) {
      if (error.code === '23505') { // Unique constraint violation
        throw new Error('A product with this name or slug already exists');
      }
      throw error;
    }
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
    return data || [];
  },

  async create(category) {
    // Generate slug from name if not provided
    if (!category.slug && category.name) {
      let baseSlug = category.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
      category.slug = baseSlug;
      
      // Check if slug already exists and make it unique
      let counter = 1;
      while (true) {
        const { data: existing } = await supabase
          .from('categories')
          .select('id')
          .eq('slug', category.slug)
          .maybeSingle();
        
        if (!existing) break;
        category.slug = `${baseSlug}-${counter}`;
        counter++;
      }
    }
    
    const { data, error } = await supabase
      .from('categories')
      .insert(category)
      .select()
      .single();
    
    if (error) {
      if (error.code === '23505') { // Unique constraint violation
        throw new Error('A category with this name or slug already exists');
      }
      throw error;
    }
    return data;
  },

  async update(id, updates) {
    // Generate slug from name if name is being updated and slug is not provided
    if (updates.name && !updates.slug) {
      let baseSlug = updates.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
      updates.slug = baseSlug;
      
      // Check if slug already exists (excluding current record) and make it unique
      let counter = 1;
      while (true) {
        const { data: existing } = await supabase
          .from('categories')
          .select('id')
          .eq('slug', updates.slug)
          .neq('id', id)
          .maybeSingle();
        
        if (!existing) break;
        updates.slug = `${baseSlug}-${counter}`;
        counter++;
      }
    }
    
    const { data, error } = await supabase
      .from('categories')
      .update(updates)
      .eq('id', id)
      .select()
      .single();
    
    if (error) {
      if (error.code === '23505') { // Unique constraint violation
        throw new Error('A category with this name or slug already exists');
      }
      throw error;
    }
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
        products!cart_items_product_id_fkey (
          id,
          name,
          price,
          image_urls
        )
      `)
      .eq('user_id', userId);
    
    if (error) throw error;
    return data || [];
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
    try {
    const { data, error } = await supabase
      .from('orders')
        .select('*')
      .order('created_at', { ascending: false });
    
      if (error) {
        // Handle common RLS permission errors
        if (error.code === '42501' || error.message.includes('permission denied')) {
          console.warn('Permission denied for orders access');
          return [];
        }
        throw error;
      }
      return data || [];
    } catch (error) {
      console.error('Error fetching orders:', error);
      return [];
    }
  },

  async getUserOrders(userId) {
    try {
    const { data, error } = await supabase
      .from('orders')
        .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });
    
      if (error) {
        // Handle common RLS permission errors
        if (error.code === '42501' || error.message.includes('permission denied')) {
          console.warn('Permission denied for user orders access');
          return [];
        }
        throw error;
      }
      return data || [];
    } catch (error) {
      console.error('Error fetching user orders:', error);
      return [];
    }
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
        products!wishlist_items_product_id_fkey (
          id,
          name,
          price,
          image_urls
        )
      `)
      .eq('user_id', userId);
    
    if (error) throw error;
    return data || [];
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
    
    // Map database columns to expected format
    if (data) {
      return {
        site_title: data.site_name || 'Dharika Fashion',
        site_description: data.site_description || 'Premium ethnic wear collection',
        contact_email: data.contact_email || '',
        contact_phone: data.contact_phone || '',
        // Check if JSONB columns exist, otherwise use defaults
        promotional_messages: data.promotional_messages || [
          { id: 1, text: "🎁 Welcome to our store! Explore our latest collection" },
          { id: 2, text: "🚚 Free shipping on all orders above ₹2999" },
          { id: 3, text: "⚡ New arrivals every week - Stay updated!" }
        ],
        hero_content: data.hero_content || [
          {
            id: 1,
            title: "Royal Heritage Collection",
            subtitle: "Timeless Tradition",
            description: "Discover our exquisite collection of handcrafted ethnic wear",
            image: "/hero-image.jpg",
            primaryCta: "Explore Collection",
            secondaryCta: "View Lookbook"
          }
        ],
        footer_content: data.footer_content || {
          company: "Dharika Fashion",
          description: "Premium ethnic wear collection",
          address: data.address || "123 Fashion Street, Mumbai, India",
          phone: data.contact_phone || "+91 98765 43210",
          email: data.contact_email || "info@dharikafashion.com"
        },
        social_media: {
          facebook: data.social_facebook || "",
          instagram: data.social_instagram || "",
          whatsapp: data.social_whatsapp || ""
        }
      };
    }
    
    // Return defaults if no data
    return {
      site_title: 'Dharika Fashion',
      site_description: 'Premium ethnic wear collection',
      contact_email: '',
      contact_phone: '',
      promotional_messages: [
        { id: 1, text: "🎁 Welcome to our store! Explore our latest collection" },
        { id: 2, text: "🚚 Free shipping on all orders above ₹2999" },
        { id: 3, text: "⚡ New arrivals every week - Stay updated!" }
      ],
      hero_content: [
        {
          id: 1,
          title: "Royal Heritage Collection",
          subtitle: "Timeless Tradition",
          description: "Discover our exquisite collection of handcrafted ethnic wear",
          image: "/hero-image.jpg",
          primaryCta: "Explore Collection",
          secondaryCta: "View Lookbook"
        }
      ],
      footer_content: {
        company: "Dharika Fashion",
        description: "Premium ethnic wear collection",
        address: "123 Fashion Street, Mumbai, India",
        phone: "+91 98765 43210",
        email: "info@dharikafashion.com"
      },
      social_media: {
        facebook: "",
        instagram: "",
        whatsapp: ""
      }
    };
  },

  async updateSettings(settings) {
    try {
      // First, check if we have any existing settings
      const { data: existingData } = await supabase
        .from('site_settings')
        .select('id')
        .limit(1)
        .maybeSingle();

      // Parse social media from JSON string if provided
      let socialMedia = {};
      if (settings.social_media) {
        try {
          socialMedia = typeof settings.social_media === 'string' 
            ? JSON.parse(settings.social_media)
            : settings.social_media;
        } catch (e) {
          console.warn('Failed to parse social media JSON:', e);
          socialMedia = {};
        }
      }

      // Base settings that always work
      const baseSettings = {
        site_name: settings.site_title || 'Dharika Fashion',
        site_description: settings.site_description || 'Premium ethnic wear collection',
        contact_email: settings.contact_email || '',
        contact_phone: settings.contact_phone || '',
        social_facebook: socialMedia.facebook || '',
        social_instagram: socialMedia.instagram || '',
        social_whatsapp: socialMedia.whatsapp || ''
      };

      // Try to add JSONB fields if they exist in the schema
      const processedSettings = { ...baseSettings };
      
      // Only add JSONB fields if they are provided and we can parse them
      if (settings.promotional_messages) {
        try {
          processedSettings.promotional_messages = typeof settings.promotional_messages === 'string' 
            ? JSON.parse(settings.promotional_messages)
            : settings.promotional_messages;
        } catch (e) {
          console.warn('Failed to parse promotional messages:', e);
        }
      }

      if (settings.hero_content) {
        try {
          processedSettings.hero_content = typeof settings.hero_content === 'string'
            ? JSON.parse(settings.hero_content)
            : settings.hero_content;
        } catch (e) {
          console.warn('Failed to parse hero content:', e);
        }
      }

      if (settings.footer_content) {
        try {
          processedSettings.footer_content = typeof settings.footer_content === 'string'
            ? JSON.parse(settings.footer_content)
            : settings.footer_content;
        } catch (e) {
          console.warn('Failed to parse footer content:', e);
        }
      }

      let result;
      if (existingData) {
        // Update existing record
        const { data, error } = await supabase
          .from('site_settings')
          .update(processedSettings)
          .eq('id', existingData.id)
          .select()
          .single();
        
        if (error) throw error;
        result = data;
      } else {
        // Insert new record
    const { data, error } = await supabase
      .from('site_settings')
          .insert(processedSettings)
      .select()
      .single();
    
    if (error) throw error;
        result = data;
      }

      return result;
    } catch (error) {
      console.error('Error updating settings:', error);
      throw error;
    }
  },

  async getPromotionalMessages() {
    try {
      const settings = await this.getSettings();
      return settings.promotional_messages || [];
    } catch (error) {
      console.error('Error fetching promotional messages:', error);
      return [];
    }
  },

  async updatePromotionalMessages(messages) {
    try {
      const settings = await this.getSettings();
      const updatedSettings = {
        ...settings,
        promotional_messages: messages
      };
      return await this.updateSettings(updatedSettings);
    } catch (error) {
      console.error('Error updating promotional messages:', error);
      throw error;
    }
  },

  async getHeroContent() {
    try {
      const settings = await this.getSettings();
      return settings.hero_content || [];
    } catch (error) {
      console.error('Error fetching hero content:', error);
      return [];
    }
  },

  async updateHeroContent(content) {
    try {
      const settings = await this.getSettings();
      const updatedSettings = {
        ...settings,
        hero_content: content
      };
      return await this.updateSettings(updatedSettings);
    } catch (error) {
      console.error('Error updating hero content:', error);
      throw error;
    }
  },

  async getFooterContent() {
    try {
      const settings = await this.getSettings();
      return settings.footer_content || {};
    } catch (error) {
      console.error('Error fetching footer content:', error);
      return {};
    }
  },

  async updateFooterContent(content) {
    try {
      const settings = await this.getSettings();
      const updatedSettings = {
        ...settings,
        footer_content: content
      };
      return await this.updateSettings(updatedSettings);
    } catch (error) {
      console.error('Error updating footer content:', error);
      throw error;
    }
  }
};

// Default export that combines all services
const supabaseService = {
  // Product methods
  getProducts: (filters) => productsService.getAll(filters),
  getFeaturedProducts: () => productsService.getAll({ featured: true }),
  getProductById: (id) => productsService.getById(id),
  createProduct: (product) => productsService.create(product),
  updateProduct: (id, updates) => productsService.update(id, updates),
  deleteProduct: (id) => productsService.delete(id),

  // Category methods
  getCategories: () => categoriesService.getAll(),
  createCategory: (category) => categoriesService.create(category),
  updateCategory: (id, updates) => categoriesService.update(id, updates),
  deleteCategory: (id) => categoriesService.delete(id),

  // Cart methods
  getCart: (userId) => cartService.getCart(userId),
  addToCart: (userId, productId, quantity, size, color) => cartService.addItem(userId, productId, quantity, size, color),
  updateCartQuantity: (itemId, quantity) => cartService.updateQuantity(itemId, quantity),
  removeFromCart: (itemId) => cartService.removeItem(itemId),
  clearCart: (userId) => cartService.clearCart(userId),

  // Order methods
  getOrders: () => ordersService.getAll(),
  getUserOrders: (userId) => ordersService.getUserOrders(userId),
  createOrder: (order, orderItems) => ordersService.create(order, orderItems),
  updateOrderStatus: (orderId, status) => ordersService.updateStatus(orderId, status),

  // Wishlist methods
  getWishlist: (userId) => wishlistService.getWishlist(userId),
  addToWishlist: (userId, productId) => wishlistService.addItem(userId, productId),
  removeFromWishlist: (userId, productId) => wishlistService.removeItem(userId, productId),

  // Site settings methods
  getSettings: () => siteSettingsService.getSettings(),
  updateSettings: (settings) => siteSettingsService.updateSettings(settings),
  getPromotionalMessages: () => siteSettingsService.getPromotionalMessages(),
  updatePromotionalMessages: (messages) => siteSettingsService.updatePromotionalMessages(messages),
  getHeroContent: () => siteSettingsService.getHeroContent(),
  updateHeroContent: (content) => siteSettingsService.updateHeroContent(content),
  getFooterContent: () => siteSettingsService.getFooterContent(),
  updateFooterContent: (content) => siteSettingsService.updateFooterContent(content),
};

export default supabaseService;
export { supabaseService };
