import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../contexts/AuthContext';
import { useWishlist } from '../contexts/WishlistContext';
import { useCart } from '../contexts/CartContext';
import WishlistShare from '../components/WishlistShare';

const LuxuryPattern = () => (
  <svg className="absolute inset-0 w-full h-full opacity-[0.02] pointer-events-none" viewBox="0 0 100 100">
    <pattern id="luxury-pattern" patternUnits="userSpaceOnUse" width="20" height="20">
      <path d="M10,0 L20,10 L10,20 L0,10 Z" fill="currentColor" />
    </pattern>
    <rect width="100%" height="100%" fill="url(#luxury-pattern)" />
  </svg>
);

const GoldenAccent = ({ className }) => (
  <svg className={`${className} text-amber-500`} viewBox="0 0 100 100">
    <defs>
      <linearGradient id="goldGradient" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#f59e0b" />
        <stop offset="40%" stopColor="#d1b464" />
        <stop offset="60%" stopColor="#f5d586" />
        <stop offset="100%" stopColor="#b47d1f" />
      </linearGradient>
    </defs>
    <path d="M0,50 C25,25 75,25 100,50 C75,75 25,75 0,50 Z" fill="url(#goldGradient)" />
    </svg>
);

const WishlistPage = () => {
  const [scrollY, setScrollY] = useState(0);
  const [animationCompleted, setAnimationCompleted] = useState(false);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const { isAuthenticated } = useAuth();
  const { wishlistItems, loading, removeFromWishlist, wishlistSummary } = useWishlist();
  const { addToCart } = useCart();

  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };

    window.addEventListener('scroll', handleScroll);
    
    // Trigger entrance animation completion
    const timer = setTimeout(() => {
      setAnimationCompleted(true);
    }, 2000);

    return () => {
      window.removeEventListener('scroll', handleScroll);
      clearTimeout(timer);
    };
  }, []);

  const formatPrice = (price) => {
    if (typeof price === 'number') {
      return `₹${price.toLocaleString('en-IN')}`;
    }
    return price || '₹0';
  };

  const handleRemoveItem = async (productId) => {
    try {
      await removeFromWishlist(productId);
      
      // Show success notification
      const notification = document.createElement('div');
      notification.className = 'fixed top-4 right-4 bg-gray-500 text-white px-6 py-3 rounded-lg shadow-lg z-50 transition-all duration-300';
      notification.innerHTML = `
        <div class="flex items-center">
          <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"></path>
          </svg>
          Removed from wishlist!
        </div>
      `;
      document.body.appendChild(notification);
      
      setTimeout(() => {
        notification.remove();
      }, 3000);
    } catch (error) {
      console.error('Error removing item:', error);
    }
  };

  const handleAddToCart = async (product) => {
    try {
      await addToCart(product, 1);
      
      // Show success notification
      const notification = document.createElement('div');
      notification.className = 'fixed top-4 right-4 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg z-50 transition-all duration-300';
      notification.innerHTML = `
        <div class="flex items-center">
          <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
          </svg>
          Added to cart successfully!
        </div>
      `;
      document.body.appendChild(notification);
      
      setTimeout(() => {
        notification.remove();
      }, 3000);
    } catch (error) {
      console.error('Error adding to cart:', error);
      
      // Show error notification
      const notification = document.createElement('div');
      notification.className = 'fixed top-4 right-4 bg-red-500 text-white px-6 py-3 rounded-lg shadow-lg z-50 transition-all duration-300';
      notification.innerHTML = `
        <div class="flex items-center">
          <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
          </svg>
          Failed to add to cart. Please try again.
        </div>
      `;
      document.body.appendChild(notification);
      
      setTimeout(() => {
        notification.remove();
      }, 3000);
    }
  };

  const openShareModal = () => {
    setIsShareModalOpen(true);
  };

  const closeShareModal = () => {
    setIsShareModalOpen(false);
  };

  return (
    <div className="relative min-h-screen bg-gradient-to-b from-pink-50 to-white overflow-hidden">
      {/* Luxury background patterns */}
      <div className="fixed inset-0 pointer-events-none">
        <LuxuryPattern />
        
        <motion.div 
          className="absolute top-0 -left-40 w-80 h-80 bg-pink-100 rounded-full mix-blend-multiply filter blur-3xl opacity-30"
          animate={{ 
            x: [0, 50, 0], 
            y: [0, 30, 0],
            scale: [1, 1.1, 1] 
          }}
          transition={{ duration: 20, repeat: Infinity, repeatType: "reverse" }}
        />
        
        <motion.div 
          className="absolute bottom-0 -right-40 w-80 h-80 bg-red-100 rounded-full mix-blend-multiply filter blur-3xl opacity-30"
          animate={{ 
            x: [0, -30, 0], 
            y: [0, 50, 0],
            scale: [1, 1.2, 1] 
          }}
          transition={{ duration: 25, repeat: Infinity, repeatType: "reverse", delay: 5 }}
        />
      </div>
      
      {/* Main content */}
      <div className="relative pt-24 pb-20 px-4 z-10">
        {/* Elegant gold accents */}
        <div className="absolute top-0 left-0 right-0 h-32 overflow-hidden pointer-events-none">
          <GoldenAccent className="absolute -top-24 left-1/2 -translate-x-1/2 w-full max-w-6xl" />
        </div>
        
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="absolute top-0 left-0 right-0 h-40 bg-gradient-to-b from-white to-transparent pointer-events-none"
        />

        <div className="container mx-auto max-w-6xl">
          {/* Luxury header */}
          <motion.header 
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="text-center mb-16"
          >
            <div className="relative inline-block">
              <motion.h1 
                className="text-5xl sm:text-6xl md:text-7xl font-serif text-gray-900 tracking-tight"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.3 }}
              >
            Your Wishlist
              </motion.h1>
              
              <motion.div 
                className="absolute -bottom-4 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-pink-500 to-transparent"
                initial={{ scaleX: 0, opacity: 0 }}
                animate={{ scaleX: 1, opacity: 1 }}
                transition={{ duration: 1.2, delay: 0.8 }}
              />
              
            <motion.div 
                className="absolute -bottom-4 left-1/2 -translate-x-1/2 w-2 h-2 rounded-full bg-pink-500"
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.6, delay: 1.5 }}
              />
            </div>
            
          <motion.p 
              className="mt-6 text-gray-600 max-w-2xl mx-auto font-light"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 1 }}
          >
              Your carefully curated collection of desires. Each piece represents a moment of inspiration, waiting to become part of your story.
          </motion.p>
          </motion.header>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
            {/* Left column - Wishlist items */}
            <div className="lg:col-span-2 space-y-8">
              {/* Wishlist items card */}
        <motion.div 
                className="relative bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100"
                initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.5 }}
              >
                <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-pink-400 via-red-400 to-pink-400" />
                
                <div className="p-8">
                  <div className="flex items-center justify-between mb-8">
                    <h2 className="text-2xl font-serif text-gray-800">Saved Items</h2>
                    <div className="flex items-center space-x-4">
                      <span className="text-sm text-gray-400 font-light">
                        {wishlistSummary.itemCount} {wishlistSummary.itemCount === 1 ? 'Item' : 'Items'}
                      </span>
                    </div>
          </div>
          
                  {!isAuthenticated ? (
                    // Not logged in state
                    <div className="py-20 flex flex-col items-center justify-center">
                      <motion.div 
                        className="relative mb-6"
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.8, delay: 1 }}
                      >
                        <div className="p-8 flex items-center justify-center">
                          <svg className="w-20 h-20 text-pink-600" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M16 7C16 9.20914 14.2091 11 12 11C9.79086 11 8 9.20914 8 7C8 4.79086 9.79086 3 12 3C14.2091 3 16 4.79086 16 7Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                            <path d="M12 14C8.13401 14 5 17.134 5 21H19C19 17.134 15.866 14 12 14Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
          </div>
        </motion.div>
        
                      <motion.h3 
                        className="text-3xl font-serif text-gray-800 mb-4"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.8, delay: 1.2 }}
                      >
                        Please Sign In
                      </motion.h3>
                      
                      <motion.p 
                        className="text-gray-500 mb-10 max-w-md text-center font-light"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.8, delay: 1.4 }}
                      >
                        Sign in to your account to view your wishlist and save your favorite items.
                      </motion.p>
                      
            <motion.div
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.98 }}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.8, delay: 1.6 }}
                      >
                        <Link 
                          to="/auth" 
                          className="inline-flex items-center px-10 py-4 bg-gradient-to-r from-pink-500 to-red-500 text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-300 group"
                        >
                          <span className="font-medium">Sign In</span>
                          <motion.svg 
                            className="w-5 h-5 ml-2" 
                            animate={{ x: [0, 5, 0] }}
                            transition={{ duration: 1.5, repeat: Infinity, repeatType: "reverse" }}
                            fill="none" 
                            stroke="currentColor" 
                            viewBox="0 0 24 24"
                          >
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path>
                          </motion.svg>
                        </Link>
                      </motion.div>
                    </div>
                  ) : wishlistItems.length === 0 ? (
                    // Empty wishlist state
                    <div className="py-20 flex flex-col items-center justify-center">
                      <motion.div 
                        className="relative mb-6"
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.8, delay: 1 }}
                      >
                        <div className="absolute inset-0 rounded-full bg-gradient-to-r from-pink-100 to-red-100 animate-pulse" />
                        
                        <motion.div 
                          className="relative z-10 p-8 flex items-center justify-center"
                          animate={{ rotate: [0, 10, 0, -10, 0] }}
                          transition={{ duration: 10, repeat: Infinity, repeatType: "reverse" }}
                        >
                          <svg className="w-20 h-20 text-pink-600" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                          </svg>
                        </motion.div>
                        
                        <motion.div 
                          className="absolute top-0 left-0 w-full h-full border-4 border-dashed border-pink-200 rounded-full"
                          animate={{ rotate: 360 }}
                          transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
                        />
                      </motion.div>
                      
                      <motion.h3 
                        className="text-3xl font-serif text-gray-800 mb-4"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.8, delay: 1.2 }}
                      >
                        Your Wishlist is Empty
                      </motion.h3>
                      
                      <motion.p 
                        className="text-gray-500 mb-10 max-w-md text-center font-light"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.8, delay: 1.4 }}
                      >
                        Start building your dream collection by adding items you love to your wishlist.
                      </motion.p>
                      
                      <motion.div
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.98 }}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.8, delay: 1.6 }}
                      >
                        <Link 
                          to="/" 
                          className="inline-flex items-center px-10 py-4 bg-gradient-to-r from-pink-500 to-red-500 text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-300 group"
                        >
                          <span className="font-medium">Explore Collections</span>
                          <motion.svg 
                            className="w-5 h-5 ml-2" 
                            animate={{ x: [0, 5, 0] }}
                            transition={{ duration: 1.5, repeat: Infinity, repeatType: "reverse" }}
                            fill="none" 
                            stroke="currentColor" 
                            viewBox="0 0 24 24"
                          >
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path>
                          </motion.svg>
                        </Link>
                      </motion.div>
                    </div>
                  ) : (
                    // Wishlist items
                    <div className="space-y-6">
                      <div className="grid grid-cols-12 text-sm font-medium text-gray-500 pb-4 border-b border-gray-100">
                        <div className="col-span-6">Product</div>
                        <div className="col-span-2 text-center">Price</div>
                        <div className="col-span-2 text-center">Actions</div>
                        <div className="col-span-2 text-right">Remove</div>
                  </div>
                  
                      <AnimatePresence>
                        {wishlistItems.map((item) => (
                          <motion.div
                            key={item.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            className="grid grid-cols-12 items-center py-4 border-b border-gray-100"
                          >
                            {/* Product Info */}
                            <div className="col-span-6 flex items-center space-x-4">
                              <div className="w-20 h-20 bg-gray-100 rounded-lg overflow-hidden">
                                <img
                                  src={item.products?.image_urls?.[0] || item.products?.image || '/placeholder-image.jpg'}
                                  alt={item.products?.name}
                                  className="w-full h-full object-cover"
                                />
                              </div>
                              <div>
                                <h3 className="font-medium text-gray-900">{item.products?.name}</h3>
                                <div className="text-sm text-gray-500 space-y-1">
                                  {item.products?.category_name && <p>Category: {item.products.category_name}</p>}
                                  {item.products?.description && (
                                    <p className="line-clamp-2">{item.products.description}</p>
                                  )}
                                </div>
                      </div>
                    </div>
                    
                            {/* Price */}
                            <div className="col-span-2 text-center">
                              <span className="font-medium text-gray-900">
                                {formatPrice(item.products?.price)}
                              </span>
                    </div>
                    
                            {/* Actions */}
                            <div className="col-span-2 text-center">
                      <button
                                onClick={() => handleAddToCart(item.products)}
                                className="px-4 py-2 bg-[#ba1a5d] text-white rounded-md hover:bg-[#9a1549] transition-colors duration-300 text-sm"
                              >
                                Add to Cart
                      </button>
                            </div>
                      
                            {/* Remove */}
                            <div className="col-span-2 text-right">
                      <button
                                onClick={() => handleRemoveItem(item.product_id)}
                                className="text-red-500 hover:text-red-700 p-2 rounded-full hover:bg-red-50 transition-colors duration-300"
                              >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                </svg>
                      </button>
                            </div>
                          </motion.div>
                        ))}
                      </AnimatePresence>
                    </div>
                  )}
                  </div>
              </motion.div>
              
              {/* Back to shopping */}
              <motion.div
                className="mt-6 text-center md:text-left"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.8, delay: 0.9 }}
              >
                <Link to="/">
                  <motion.button
                    whileHover={{ x: -4 }}
                    className="inline-flex items-center text-pink-600 font-medium group"
                  >
                    <svg className="w-4 h-4 mr-2 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path>
                  </svg>
                    Continue Exploring
                  </motion.button>
                </Link>
              </motion.div>
            </div>
            
            {/* Right column - Wishlist summary */}
            <div className="space-y-8">
            <motion.div
                className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-100 relative"
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.6 }}
              >
                <div className="absolute top-0 right-0 w-32 h-32 -mr-16 -mt-16 bg-gradient-to-br from-pink-100 to-red-100 rounded-full opacity-60" />
                <div className="absolute bottom-0 left-0 w-24 h-24 -ml-12 -mb-12 bg-gradient-to-tr from-pink-100 to-red-100 rounded-full opacity-60" />
                
                <div className="p-8 relative">
                  <h3 className="text-2xl font-serif text-gray-800 mb-6">Wishlist Summary</h3>
                  
                  <div className="space-y-4 mb-8">
                    <div className="flex items-center space-x-4 mb-8">
                      <div className="flex-grow h-px bg-gradient-to-r from-transparent via-gray-200 to-transparent" />
                      <div className="w-2 h-2 rounded-full bg-pink-500" />
                      <div className="flex-grow h-px bg-gradient-to-r from-gray-200 via-gray-200 to-transparent" />
                    </div>
                    
                    <div className="flex justify-between text-gray-600">
                      <span>Total Items</span>
                      <span className="font-medium text-gray-800">{wishlistSummary.itemCount}</span>
                    </div>
                    
                    <div className="flex justify-between text-gray-600">
                      <span>Total Value</span>
                      <span className="font-medium text-gray-800">{formatPrice(wishlistSummary.totalValue)}</span>
                    </div>
                    
                    <div className="pt-4 mt-4 border-t border-dashed border-gray-200">
                      <div className="flex justify-between">
                        <span className="text-lg text-gray-800">Your Collection</span>
                        <motion.span 
                          className="text-xl font-serif text-pink-600"
                          initial={{ scale: 1 }}
                          whileHover={{ scale: 1.05 }}
                        >
                          {wishlistSummary.itemCount} {wishlistSummary.itemCount === 1 ? 'Item' : 'Items'}
                        </motion.span>
                      </div>
                    </div>
                    </div>
                    
                  <motion.button
                    onClick={!isAuthenticated || wishlistItems.length === 0 ? undefined : openShareModal}
                    disabled={!isAuthenticated || wishlistItems.length === 0}
                    className={`w-full py-4 rounded-full font-medium relative overflow-hidden transition-all duration-300 ${
                      !isAuthenticated || wishlistItems.length === 0
                        ? 'bg-gradient-to-r from-gray-300 to-gray-400 text-white cursor-not-allowed'
                        : 'bg-gradient-to-r from-pink-500 to-red-500 text-white hover:from-pink-600 hover:to-red-600'
                    }`}
                    whileHover={!isAuthenticated || wishlistItems.length === 0 ? {} : { scale: 1.02 }}
                    whileTap={!isAuthenticated || wishlistItems.length === 0 ? {} : { scale: 0.98 }}
                  >
                    <span className="relative z-10 flex items-center justify-center">
                      {!isAuthenticated ? 'Sign In to Save Items' : wishlistItems.length === 0 ? 'Add Items to Wishlist' : (
                        <>
                          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z" />
                          </svg>
                          Share Wishlist
                        </>
                      )}
                    </span>
                  </motion.button>
                  
                  <div className="flex justify-center mt-4">
                    <div className="flex items-center text-gray-500 text-sm">
                      <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                      </svg>
                      Save for Later
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Floating decoration elements */}
      <div className="fixed inset-0 pointer-events-none">
        <motion.div 
          className="absolute top-1/3 left-10 w-2 h-2 rounded-full bg-pink-500"
          animate={{ 
            scale: [1, 1.5, 1],
            opacity: [0.5, 1, 0.5]
          }}
          transition={{ duration: 4, repeat: Infinity }}
        />
        
        <motion.div 
          className="absolute top-2/3 right-10 w-3 h-3 rounded-full bg-red-500"
          animate={{ 
            scale: [1, 1.8, 1],
            opacity: [0.3, 0.8, 0.3]
          }}
          transition={{ duration: 5, repeat: Infinity, delay: 1 }}
        />
        
        <motion.div 
          className="absolute bottom-20 left-1/2 w-2 h-2 rounded-full bg-pink-500"
          animate={{ 
            scale: [1, 2, 1],
            opacity: [0.4, 0.9, 0.4]
          }}
          transition={{ duration: 6, repeat: Infinity, delay: 2 }}
        />
      </div>

      {/* Wishlist Share Modal */}
      <AnimatePresence>
        {isShareModalOpen && (
          <div onClick={closeShareModal}>
            <WishlistShare 
              isOpen={isShareModalOpen}
              onClose={closeShareModal}
              position="fixed"
            />
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default WishlistPage; 