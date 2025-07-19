
import { supabase } from '../integrations/supabase/client';

class SupabaseService {
  // Categories
  async getCategories() {
    console.log('Fetching categories...');
    const { data, error } = await supabase
      .from('categories')
      .select('*')
      .eq('is_active', true)
      .order('sort_order', { ascending: true });
    
    if (error) {
      console.error('Error fetching categories:', error);
      throw error;
    }
    
    console.log('Categories fetched:', data);
    return data || [];
  }

  async createCategory(categoryData) {
    console.log('Creating category:', categoryData);
    const { data, error } = await supabase
      .from('categories')
      .insert([categoryData])
      .select()
      .single();
    
    if (error) {
      console.error('Error creating category:', error);
      throw error;
    }
    
    console.log('Category created:', data);
    return data;
  }

  async updateCategory(id, categoryData) {
    console.log('Updating category:', id, categoryData);
    const { data, error } = await supabase
      .from('categories')
      .update(categoryData)
      .eq('id', id)
      .select()
      .single();
    
    if (error) {
      console.error('Error updating category:', error);
      throw error;
    }
    
    console.log('Category updated:', data);
    return data;
  }

  async deleteCategory(id) {
    console.log('Deleting category:', id);
    const { error } = await supabase
      .from('categories')
      .delete()
      .eq('id', id);
    
    if (error) {
      console.error('Error deleting category:', error);
      throw error;
    }
    
    console.log('Category deleted');
  }

  // Products
  async getProducts(filters = {}) {
    console.log('Fetching products with filters:', filters);
    
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
      .eq('is_active', true);

    // Apply filters
    if (filters.category_id) {
      query = query.eq('category_id', filters.category_id);
    }
    
    if (filters.featured) {
      query = query.eq('featured', true);
    }
    
    if (filters.search) {
      query = query.or(`name.ilike.%${filters.search}%,description.ilike.%${filters.search}%`);
    }
    
    const { data, error } = await query.order('created_at', { ascending: false });
    
    if (error) {
      console.error('Error fetching products:', error);
      throw error;
    }
    
    console.log('Products fetched:', data);
    return data || [];
  }

  async getProductById(id) {
    console.log('Fetching product by ID:', id);
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
      .single();
    
    if (error) {
      console.error('Error fetching product:', error);
      throw error;
    }
    
    console.log('Product fetched:', data);
    return data;
  }

  async createProduct(productData) {
    console.log('Creating product:', productData);
    
    // Ensure arrays are properly formatted
    const formattedData = {
      ...productData,
      image_urls: Array.isArray(productData.image_urls) ? productData.image_urls : [],
      colors: Array.isArray(productData.colors) ? productData.colors : [],
      sizes: Array.isArray(productData.sizes) ? productData.sizes : []
    };
    
    const { data, error } = await supabase
      .from('products')
      .insert([formattedData])
      .select(`
        *,
        categories!products_category_id_fkey (
          id,
          name,
          slug
        )
      `)
      .single();
    
    if (error) {
      console.error('Error creating product:', error);
      throw error;
    }
    
    console.log('Product created:', data);
    return data;
  }

  async updateProduct(id, productData) {
    console.log('Updating product:', id, productData);
    
    // Ensure arrays are properly formatted
    const formattedData = {
      ...productData,
      image_urls: Array.isArray(productData.image_urls) ? productData.image_urls : [],
      colors: Array.isArray(productData.colors) ? productData.colors : [],
      sizes: Array.isArray(productData.sizes) ? productData.sizes : []
    };
    
    const { data, error } = await supabase
      .from('products')
      .update(formattedData)
      .eq('id', id)
      .select(`
        *,
        categories!products_category_id_fkey (
          id,
          name,
          slug
        )
      `)
      .single();
    
    if (error) {
      console.error('Error updating product:', error);
      throw error;
    }
    
    console.log('Product updated:', data);
    return data;
  }

  async deleteProduct(id) {
    console.log('Deleting product:', id);
    const { error } = await supabase
      .from('products')
      .delete()
      .eq('id', id);
    
    if (error) {
      console.error('Error deleting product:', error);
      throw error;
    }
    
    console.log('Product deleted');
  }

  // Cart items
  async getCartItems(userId) {
    console.log('Fetching cart items for user:', userId);
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
    
    if (error) {
      console.error('Error fetching cart items:', error);
      throw error;
    }
    
    console.log('Cart items fetched:', data);
    return data || [];
  }

  // Add alias for compatibility
  async getCart(userId) {
    return this.getCartItems(userId);
  }

  async addToCart(cartItem) {
    console.log('Adding to cart:', cartItem);
    const { data, error } = await supabase
      .from('cart_items')
      .insert([cartItem])
      .select(`
        *,
        products (
          id,
          name,
          price,
          image_urls
        )
      `)
      .single();
    
    if (error) {
      console.error('Error adding to cart:', error);
      throw error;
    }
    
    console.log('Added to cart:', data);
    return data;
  }

  async updateCartItem(id, updates) {
    console.log('Updating cart item:', id, updates);
    const { data, error } = await supabase
      .from('cart_items')
      .update(updates)
      .eq('id', id)
      .select(`
        *,
        products (
          id,
          name,
          price,
          image_urls
        )
      `)
      .single();
    
    if (error) {
      console.error('Error updating cart item:', error);
      throw error;
    }
    
    console.log('Cart item updated:', data);
    return data;
  }

  async removeFromCart(id) {
    console.log('Removing from cart:', id);
    const { error } = await supabase
      .from('cart_items')
      .delete()
      .eq('id', id);
    
    if (error) {
      console.error('Error removing from cart:', error);
      throw error;
    }
    
    console.log('Removed from cart');
  }

  // Wishlist items
  async getWishlistItems(userId) {
    console.log('Fetching wishlist items for user:', userId);
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
    
    if (error) {
      console.error('Error fetching wishlist items:', error);
      throw error;
    }
    
    console.log('Wishlist items fetched:', data);
    return data || [];
  }

  async addToWishlist(wishlistItem) {
    console.log('Adding to wishlist:', wishlistItem);
    const { data, error } = await supabase
      .from('wishlist_items')
      .insert([wishlistItem])
      .select(`
        *,
        products (
          id,
          name,
          price,
          image_urls
        )
      `)
      .single();
    
    if (error) {
      console.error('Error adding to wishlist:', error);
      throw error;
    }
    
    console.log('Added to wishlist:', data);
    return data;
  }

  async removeFromWishlist(id) {
    console.log('Removing from wishlist:', id);
    const { error } = await supabase
      .from('wishlist_items')
      .delete()
      .eq('id', id);
    
    if (error) {
      console.error('Error removing from wishlist:', error);
      throw error;
    }
    
    console.log('Removed from wishlist');
  }

  // Orders
  async getOrders(userId = null) {
    console.log('Fetching orders for user:', userId);
    
    let query = supabase
      .from('orders')
      .select(`
        *,
        order_items (
          *,
          products (
            id,
            name,
            image_urls
          )
        )
      `);
    
    if (userId) {
      query = query.eq('user_id', userId);
    }
    
    const { data, error } = await query.order('created_at', { ascending: false });
    
    if (error) {
      console.error('Error fetching orders:', error);
      throw error;
    }
    
    console.log('Orders fetched:', data);
    return data || [];
  }

  async createOrder(orderData) {
    console.log('Creating order:', orderData);
    const { data, error } = await supabase
      .from('orders')
      .insert([orderData])
      .select()
      .single();
    
    if (error) {
      console.error('Error creating order:', error);
      throw error;
    }
    
    console.log('Order created:', data);
    return data;
  }

  async updateOrderStatus(orderId, status) {
    console.log('Updating order status:', orderId, status);
    const { data, error } = await supabase
      .from('orders')
      .update({ status })
      .eq('id', orderId)
      .select()
      .single();
    
    if (error) {
      console.error('Error updating order status:', error);
      throw error;
    }
    
    console.log('Order status updated:', data);
    return data;
  }

  // Custom designs
  async getCustomDesigns(userId = null) {
    console.log('Fetching custom designs for user:', userId);
    
    let query = supabase
      .from('custom_designs')
      .select('*');
    
    if (userId) {
      query = query.eq('user_id', userId);
    }
    
    const { data, error } = await query.order('created_at', { ascending: false });
    
    if (error) {
      console.error('Error fetching custom designs:', error);
      throw error;
    }
    
    console.log('Custom designs fetched:', data);
    return data || [];
  }

  // Add alias for compatibility
  async getCustomRequests(userId = null) {
    return this.getCustomDesigns(userId);
  }

  async createCustomDesign(designData) {
    console.log('Creating custom design:', designData);
    const { data, error } = await supabase
      .from('custom_designs')
      .insert([designData])
      .select()
      .single();
    
    if (error) {
      console.error('Error creating custom design:', error);
      throw error;
    }
    
    console.log('Custom design created:', data);
    return data;
  }

  async updateCustomDesignStatus(id, status) {
    console.log('Updating custom design status:', id, status);
    const { data, error } = await supabase
      .from('custom_designs')
      .update({ status })
      .eq('id', id)
      .select()
      .single();
    
    if (error) {
      console.error('Error updating custom design status:', error);
      throw error;
    }
    
    console.log('Custom design status updated:', data);
    return data;
  }

  // Site settings
  async getSiteSettings() {
    console.log('Fetching site settings...');
    const { data, error } = await supabase
      .from('site_settings')
      .select('*')
      .limit(1)
      .single();
    
    if (error) {
      console.error('Error fetching site settings:', error);
      // Return default settings if none exist
      return {
        site_title: 'Dharika',
        site_description: 'Premium Indian Traditional Wear',
        contact_email: 'info@dharika.com',
        contact_phone: '+91 9876543210',
        promotional_messages: [
          { id: 1, text: '🎁 Welcome to our store! Explore our latest collections' },
          { id: 2, text: '🚚 Free shipping on all orders above ₹1999' },
          { id: 3, text: '⚡ Ethnic Fits For Your 9AM to 9PM!' }
        ],
        hero_content: [
          {
            id: 1,
            title: 'Royal Heritage Collection',
            subtitle: 'Timeless Tradition',
            description: 'Discover our exquisite collection of handcrafted ethnic wear',
            primaryCta: 'Explore Collection',
            secondaryCta: 'View Lookbook',
            image: '/hero-image.jpg'
          }
        ],
        footer_content: {
          company: 'Dharika',
          description: 'Blending ethnic wear into daily lives',
          email: 'info@dharikafashion.com',
          address: 'Near Ops Vidya Mandir, Ambala, Haryana, India'
        },
        social_media: {
          facebook: 'https://facebook.com/dharikafashion',
          instagram: 'https://instagram.com/dharikafashion',
          whatsapp: 'https://wa.me/919876543210'
        }
      };
    }
    
    console.log('Site settings fetched:', data);
    return data;
  }

  // Add alias for compatibility
  async getSettings() {
    return this.getSiteSettings();
  }

  async updateSiteSettings(settingsData) {
    console.log('Updating site settings:', settingsData);
    
    // First check if settings exist
    const { data: existing } = await supabase
      .from('site_settings')
      .select('*')
      .limit(1)
      .single();
    
    if (existing) {
      // Update existing settings
      const { data, error } = await supabase
        .from('site_settings')
        .update(settingsData)
        .eq('id', existing.id)
        .select()
        .single();
      
      if (error) {
        console.error('Error updating site settings:', error);
        throw error;
      }
      
      console.log('Site settings updated:', data);
      return data;
    } else {
      // Create new settings
      const { data, error } = await supabase
        .from('site_settings')
        .insert([settingsData])
        .select()
        .single();
      
      if (error) {
        console.error('Error creating site settings:', error);
        throw error;
      }
      
      console.log('Site settings created:', data);
      return data;
    }
  }

  // File upload
  async uploadFile(file, bucket = 'images', folder = '') {
    console.log('Uploading file:', file.name, 'to bucket:', bucket);
    
    const fileExt = file.name.split('.').pop();
    const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;
    const filePath = folder ? `${folder}/${fileName}` : fileName;
    
    const { data, error } = await supabase.storage
      .from(bucket)
      .upload(filePath, file);
    
    if (error) {
      console.error('Error uploading file:', error);
      throw error;
    }
    
    // Get public URL
    const { data: { publicUrl } } = supabase.storage
      .from(bucket)
      .getPublicUrl(filePath);
    
    console.log('File uploaded successfully:', publicUrl);
    return publicUrl;
  }

  async deleteFile(filePath, bucket = 'images') {
    console.log('Deleting file:', filePath, 'from bucket:', bucket);
    
    const { error } = await supabase.storage
      .from(bucket)
      .remove([filePath]);
    
    if (error) {
      console.error('Error deleting file:', error);
      throw error;
    }
    
    console.log('File deleted successfully');
  }
}

export const supabaseService = new SupabaseService();
export default supabaseService;
