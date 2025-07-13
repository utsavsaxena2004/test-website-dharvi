import api from './api';

class CartService {
  // Get user's cart
  async getCart() {
    try {
      const response = await api.get('/cart');
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  }

  // Add item to cart
  async addToCart(productId, quantity = 1, variant = null) {
    try {
      const response = await api.post('/cart/items', {
        productId,
        quantity,
        variant
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  }

  // Update cart item quantity
  async updateCartItem(itemId, quantity) {
    try {
      const response = await api.put(`/cart/items/${itemId}`, { quantity });
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  }

  // Remove item from cart
  async removeFromCart(itemId) {
    try {
      const response = await api.delete(`/cart/items/${itemId}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  }

  // Clear entire cart
  async clearCart() {
    try {
      const response = await api.delete('/cart');
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  }

  // Apply coupon code
  async applyCoupon(couponCode) {
    try {
      const response = await api.post('/cart/coupon', { code: couponCode });
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  }

  // Remove coupon
  async removeCoupon() {
    try {
      const response = await api.delete('/cart/coupon');
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  }

  // Get cart summary (totals, discounts, etc.)
  async getCartSummary() {
    try {
      const response = await api.get('/cart/summary');
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  }
}

export default new CartService(); 