import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';
import { supabaseService } from '../services/supabaseService';

const CartContext = createContext();

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { user, isAuthenticated } = useAuth();

  // Fetch cart items when user changes
  useEffect(() => {
    if (isAuthenticated && user) {
      fetchCartItems();
    } else {
      setCartItems([]);
    }
  }, [isAuthenticated, user]);

  const fetchCartItems = async () => {
    if (!user) return;
    
    try {
      setLoading(true);
      setError(null);
      const items = await supabaseService.getCart(user.id);
      setCartItems(items);
    } catch (err) {
      console.error('Error fetching cart items:', err);
      setError('Failed to load cart items');
    } finally {
      setLoading(false);
    }
  };

  const addToCart = async (product, quantity = 1, size = null, color = null) => {
    if (!isAuthenticated) {
      throw new Error('Please login to add items to cart');
    }

    try {
      setLoading(true);
      setError(null);
      
      // Create cart item object with correct format for supabaseService
      const cartItem = {
        user_id: user.id,
        product_id: product.id,
        quantity,
        size,
        color
      };
      
      await supabaseService.addToCart(cartItem);
      
      // Refresh cart items
      await fetchCartItems();
      
      return true;
    } catch (err) {
      console.error('Error adding to cart:', err);
      setError('Failed to add item to cart');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const updateQuantity = async (itemId, quantity) => {
    if (!isAuthenticated) return;

    try {
      setLoading(true);
      setError(null);
      
      await supabaseService.updateCartQuantity(itemId, quantity);
      
      // Refresh cart items
      await fetchCartItems();
    } catch (err) {
      console.error('Error updating quantity:', err);
      setError('Failed to update quantity');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const removeFromCart = async (itemId) => {
    if (!isAuthenticated) return;

    try {
      setLoading(true);
      setError(null);
      
      await supabaseService.removeFromCart(itemId);
      
      // Refresh cart items
      await fetchCartItems();
    } catch (err) {
      console.error('Error removing from cart:', err);
      setError('Failed to remove item from cart');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const clearCart = async () => {
    if (!isAuthenticated) return;

    try {
      setLoading(true);
      setError(null);
      
      await supabaseService.clearCart(user.id);
      setCartItems([]);
    } catch (err) {
      console.error('Error clearing cart:', err);
      setError('Failed to clear cart');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Calculate cart totals
  const getCartSummary = () => {
    const itemCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);
    const subtotal = cartItems.reduce((sum, item) => {
      const price = item.products?.price || 0;
      return sum + (price * item.quantity);
    }, 0);

    return {
      itemCount,
      subtotal,
      total: subtotal, // Add tax/shipping calculation here if needed
      items: cartItems
    };
  };

  const value = {
    cartItems,
    loading,
    error,
    addToCart,
    updateQuantity,
    removeFromCart,
    clearCart,
    refreshCart: fetchCartItems,
    cartSummary: getCartSummary(),
    isAuthenticated
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
}; 