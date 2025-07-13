import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../contexts/AuthContext';
import { useCart } from '../contexts/CartContext';

const SharedWishlist = () => {
  const [searchParams] = useSearchParams();
  const [sharedWishlist, setSharedWishlist] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { isAuthenticated } = useAuth();
  const { addToCart } = useCart();

  const token = searchParams.get('token');
  const mode = searchParams.get('mode') || 'public';
  const itemCount = parseInt(searchParams.get('items')) || 0;
  const totalValue = parseInt(searchParams.get('value')) || 0;

  useEffect(() => {
    if (!token) {
      setError('Invalid share link');
      setLoading(false);
      return;
    }

    const fetchSharedWishlist = async () => {
      try {
        setLoading(true);
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        const mockWishlist = {
          id: token.split('_')[0],
          items: [
            {
              id: '1',
              products: {
                id: 'p1',
                name: 'Royal Banarasi Silk Saree',
                price: 12999,
                image_urls: ['https://images.unsplash.com/photo-1610189031585-fd499562e6c5?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'],
                description: 'Exquisite handwoven Banarasi silk saree',
                category_name: 'Sarees'
              }
            }
          ]
        };

        setSharedWishlist(mockWishlist);
      } catch (err) {
        setError('Failed to load shared wishlist');
      } finally {
        setLoading(false);
      }
    };

    fetchSharedWishlist();
  }, [token]);

  const handleAddToCart = async (product) => {
    try {
      await addToCart(product, 1);
    } catch (error) {
      console.error('Error adding to cart:', error);
    }
  };

  const formatPrice = (price) => {
    if (typeof price === 'number') {
      return `₹${price.toLocaleString('en-IN')}`;
    }
    return price || '₹0';
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-pink-50 to-white flex items-center justify-center">
        <motion.div className="text-center">
          <motion.div
            className="w-16 h-16 border-4 border-pink-500 border-t-transparent rounded-full mx-auto mb-4"
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          />
          <h2 className="text-xl font-serif text-gray-900 mb-2">Loading Wishlist</h2>
        </motion.div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-pink-50 to-white flex items-center justify-center">
        <div className="text-center max-w-md mx-auto px-4">
          <h2 className="text-2xl font-serif text-gray-900 mb-4">Oops! Something went wrong</h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <Link to="/" className="px-6 py-3 bg-pink-600 text-white rounded-lg hover:bg-pink-700 transition-colors">
            Back to Home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-pink-50 to-white">
      <div className="bg-white shadow-sm border-b border-gray-100">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link to="/" className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-pink-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">D</span>
              </div>
              <span className="font-serif text-xl text-gray-900">Dharika Fashion</span>
            </Link>
            
            {!isAuthenticated && (
              <Link to="/auth" className="px-4 py-2 bg-pink-600 text-white rounded-lg text-sm hover:bg-pink-700 transition-colors">
                Sign In
              </Link>
            )}
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <motion.div className="text-center mb-8">
          <h1 className="text-4xl font-serif text-gray-900 mb-2">Shared Wishlist</h1>
          <p className="text-gray-600 mb-4">{itemCount} items • {formatPrice(totalValue)} total value</p>
        </motion.div>

        <div className="max-w-4xl mx-auto">
          {sharedWishlist?.items && sharedWishlist.items.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {sharedWishlist.items.map((item, index) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300"
                >
                  <div className="aspect-[4/3] overflow-hidden">
                    <img
                      src={item.products?.image_urls?.[0] || '/placeholder-image.jpg'}
                      alt={item.products?.name}
                      className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                  
                  <div className="p-4">
                    <h3 className="font-medium text-gray-900 mb-2">{item.products?.name}</h3>
                    <p className="text-sm text-gray-600 mb-2">{item.products?.category_name}</p>
                    <div className="flex items-center justify-between">
                      <span className="text-lg font-semibold text-pink-600">
                        {formatPrice(item.products?.price)}
                      </span>
                      <button
                        onClick={() => handleAddToCart(item.products)}
                        className="px-4 py-2 bg-pink-600 text-white rounded-lg text-sm hover:bg-pink-700 transition-colors"
                      >
                        Add to Cart
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <h3 className="text-xl font-serif text-gray-900 mb-2">No items in this wishlist</h3>
              <p className="text-gray-600">This wishlist is currently empty.</p>
            </div>
          )}
        </div>

        <motion.div className="text-center mt-12">
          <div className="bg-white rounded-xl shadow-md p-8 max-w-2xl mx-auto">
            <h3 className="text-2xl font-serif text-gray-900 mb-4">Love what you see?</h3>
            <p className="text-gray-600 mb-6">Create your own wishlist and discover amazing ethnic wear</p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/" className="px-6 py-3 bg-pink-600 text-white rounded-lg hover:bg-pink-700 transition-colors">
                Explore Collections
              </Link>
              
              {!isAuthenticated && (
                <Link to="/auth" className="px-6 py-3 border border-pink-600 text-pink-600 rounded-lg hover:bg-pink-50 transition-colors">
                  Create Your Wishlist
                </Link>
              )}
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default SharedWishlist; 