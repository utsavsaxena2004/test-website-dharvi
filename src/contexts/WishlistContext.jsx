import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';
import { supabaseService } from '../services/supabaseService';

const WishlistContext = createContext();

export const useWishlist = () => {
  const context = useContext(WishlistContext);
  if (!context) {
    throw new Error('useWishlist must be used within a WishlistProvider');
  }
  return context;
};

export const WishlistProvider = ({ children }) => {
  const [wishlistItems, setWishlistItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { user, isAuthenticated } = useAuth();

  // Fetch wishlist items when user changes
  useEffect(() => {
    if (isAuthenticated && user) {
      fetchWishlistItems();
    } else {
      setWishlistItems([]);
    }
  }, [isAuthenticated, user]);

  const fetchWishlistItems = async () => {
    if (!user) return;
    
    try {
      setLoading(true);
      setError(null);
      const items = await supabaseService.getWishlist(user.id);
      setWishlistItems(items);
    } catch (err) {
      console.error('Error fetching wishlist items:', err);
      setError('Failed to load wishlist items');
    } finally {
      setLoading(false);
    }
  };

  const addToWishlist = async (product) => {
    if (!isAuthenticated) {
      throw new Error('Please login to add items to wishlist');
    }

    try {
      setLoading(true);
      setError(null);
      
      await supabaseService.addToWishlist(user.id, product.id);
      
      // Refresh wishlist items
      await fetchWishlistItems();
      
      return true;
    } catch (err) {
      console.error('Error adding to wishlist:', err);
      setError('Failed to add item to wishlist');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const removeFromWishlist = async (productId) => {
    if (!isAuthenticated) return;

    try {
      setLoading(true);
      setError(null);
      
      await supabaseService.removeFromWishlist(user.id, productId);
      
      // Refresh wishlist items
      await fetchWishlistItems();
    } catch (err) {
      console.error('Error removing from wishlist:', err);
      setError('Failed to remove item from wishlist');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const isInWishlist = (productId) => {
    return wishlistItems.some(item => item.product_id === productId);
  };

  const toggleWishlist = async (product) => {
    if (!isAuthenticated) {
      throw new Error('Please login to manage wishlist');
    }

    const inWishlist = isInWishlist(product.id);
    
    if (inWishlist) {
      await removeFromWishlist(product.id);
      return false;
    } else {
      await addToWishlist(product);
      return true;
    }
  };

  // Calculate wishlist summary
  const getWishlistSummary = () => {
    const itemCount = wishlistItems.length;
    const totalValue = wishlistItems.reduce((sum, item) => {
      const price = item.products?.price || 0;
      return sum + price;
    }, 0);

    return {
      itemCount,
      totalValue,
      items: wishlistItems
    };
  };

  const value = {
    wishlistItems,
    loading,
    error,
    addToWishlist,
    removeFromWishlist,
    isInWishlist,
    toggleWishlist,
    refreshWishlist: fetchWishlistItems,
    wishlistSummary: getWishlistSummary(),
    isAuthenticated
  };

  return (
    <WishlistContext.Provider value={value}>
      {children}
    </WishlistContext.Provider>
  );
}; 