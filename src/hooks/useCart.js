import { useState, useEffect } from 'react';
import { cartService } from '../services';
import { useAuth } from '../contexts/AuthContext';

export const useCart = () => {
  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { isAuthenticated } = useAuth();

  // Fetch cart data
  const fetchCart = async () => {
    if (!isAuthenticated) {
      setCart(null);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const cartData = await cartService.getCart();
      setCart(cartData);
    } catch (err) {
      console.error('Error fetching cart:', err);
      setError(err.message || 'Failed to load cart');
    } finally {
      setLoading(false);
    }
  };

  // Add item to cart
  const addToCart = async (productId, quantity = 1, variant = null) => {
    try {
      setLoading(true);
      setError(null);
      const updatedCart = await cartService.addToCart(productId, quantity, variant);
      setCart(updatedCart);
      return updatedCart;
    } catch (err) {
      console.error('Error adding to cart:', err);
      setError(err.message || 'Failed to add item to cart');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Update cart item quantity
  const updateCartItem = async (itemId, quantity) => {
    try {
      setLoading(true);
      setError(null);
      const updatedCart = await cartService.updateCartItem(itemId, quantity);
      setCart(updatedCart);
      return updatedCart;
    } catch (err) {
      console.error('Error updating cart item:', err);
      setError(err.message || 'Failed to update cart item');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Remove item from cart
  const removeFromCart = async (itemId) => {
    try {
      setLoading(true);
      setError(null);
      const updatedCart = await cartService.removeFromCart(itemId);
      setCart(updatedCart);
      return updatedCart;
    } catch (err) {
      console.error('Error removing from cart:', err);
      setError(err.message || 'Failed to remove item from cart');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Clear entire cart
  const clearCart = async () => {
    try {
      setLoading(true);
      setError(null);
      await cartService.clearCart();
      setCart(null);
    } catch (err) {
      console.error('Error clearing cart:', err);
      setError(err.message || 'Failed to clear cart');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Apply coupon
  const applyCoupon = async (couponCode) => {
    try {
      setLoading(true);
      setError(null);
      const updatedCart = await cartService.applyCoupon(couponCode);
      setCart(updatedCart);
      return updatedCart;
    } catch (err) {
      console.error('Error applying coupon:', err);
      setError(err.message || 'Failed to apply coupon');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Get cart summary (computed values)
  const getCartSummary = () => {
    if (!cart || !cart.items) return null;

    const subtotal = cart.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const itemCount = cart.items.reduce((sum, item) => sum + item.quantity, 0);

    return {
      itemCount,
      subtotal,
      discount: cart.discount || 0,
      total: cart.total || subtotal,
      items: cart.items
    };
  };

  // Load cart when user authentication changes
  useEffect(() => {
    fetchCart();
  }, [isAuthenticated]);

  return {
    cart,
    loading,
    error,
    addToCart,
    updateCartItem,
    removeFromCart,
    clearCart,
    applyCoupon,
    refreshCart: fetchCart,
    cartSummary: getCartSummary()
  };
}; 