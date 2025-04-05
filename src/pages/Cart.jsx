import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

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

const CartPage = () => {
  const [scrollY, setScrollY] = useState(0);
  const [animationCompleted, setAnimationCompleted] = useState(false);

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

  return (
    <div className="relative min-h-screen bg-gradient-to-b from-gray-50 to-white overflow-hidden">
      {/* Luxury background patterns */}
      <div className="fixed inset-0 pointer-events-none">
        <LuxuryPattern />
        
        <motion.div 
          className="absolute top-0 -left-40 w-80 h-80 bg-pink-50 rounded-full mix-blend-multiply filter blur-3xl opacity-30"
          animate={{ 
            x: [0, 50, 0], 
            y: [0, 30, 0],
            scale: [1, 1.1, 1] 
          }}
          transition={{ duration: 20, repeat: Infinity, repeatType: "reverse" }}
        />
        
        <motion.div 
          className="absolute bottom-0 -right-40 w-80 h-80 bg-amber-50 rounded-full mix-blend-multiply filter blur-3xl opacity-30"
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
                Your Curated Collection
              </motion.h1>
              
              <motion.div 
                className="absolute -bottom-4 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-amber-500 to-transparent"
                initial={{ scaleX: 0, opacity: 0 }}
                animate={{ scaleX: 1, opacity: 1 }}
                transition={{ duration: 1.2, delay: 0.8 }}
              />
              
              <motion.div 
                className="absolute -bottom-4 left-1/2 -translate-x-1/2 w-2 h-2 rounded-full bg-amber-500"
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
              Exquisite pieces, carefully selected for unparalleled elegance. Each item tells a story of craftsmanship and heritage.
            </motion.p>
          </motion.header>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
            {/* Left column - Cart items */}
            <div className="lg:col-span-2 space-y-8">
              {/* Card with flowing animation */}
              <motion.div 
                className="relative bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100"
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.5 }}
              >
                <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-pink-400 via-amber-400 to-pink-400" />
                
                <div className="p-8">
                  <div className="flex items-center justify-between mb-8">
                    <h2 className="text-2xl font-serif text-gray-800">Shopping Bag</h2>
                    <span className="text-sm text-gray-400 font-light">0 Items</span>
                  </div>
                  
                  <div className="grid grid-cols-12 text-sm font-medium text-gray-500 pb-4 border-b border-gray-100">
                    <div className="col-span-6">Product</div>
                    <div className="col-span-2 text-center">Price</div>
                    <div className="col-span-2 text-center">Quantity</div>
                    <div className="col-span-2 text-right">Total</div>
                  </div>
                  
                  <div className="py-20 flex flex-col items-center justify-center">
                    <motion.div 
                      className="relative mb-6"
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.8, delay: 1 }}
                    >
                      <div className="absolute inset-0 rounded-full bg-gradient-to-r from-pink-100 to-amber-100 animate-pulse" />
                      
                      <motion.div 
                        className="relative z-10 p-8 flex items-center justify-center"
                        animate={{ rotate: [0, 10, 0, -10, 0] }}
                        transition={{ duration: 10, repeat: Infinity, repeatType: "reverse" }}
                      >
                        <svg className="w-20 h-20 text-amber-600" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M16 11V7C16 4.79086 14.2091 3 12 3C9.79086 3 8 4.79086 8 7V11M5 9H19L20 21H4L5 9Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                      </motion.div>
                      
                      <motion.div 
                        className="absolute top-0 left-0 w-full h-full border-4 border-dashed border-amber-200 rounded-full"
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
                      Your Collection Awaits
                    </motion.h3>
                    
                    <motion.p 
                      className="text-gray-500 mb-10 max-w-md text-center font-light"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.8, delay: 1.4 }}
                    >
                      Your bag is empty. Transform it into a treasure trove of timeless elegance by exploring our collections.
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
                        className="inline-flex items-center px-10 py-4 bg-gradient-to-r from-amber-500 to-pink-500 text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-300 group"
                      >
                        <span className="font-medium">Discover Collections</span>
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
                </div>
              </motion.div>
              
              {/* Recently viewed section with horizontal scroll */}
              <motion.div 
                className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-100 p-8"
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.7 }}
              >
                <h3 className="text-xl font-serif text-gray-800 mb-6">Recently Viewed</h3>
                
                <div className="flex space-x-6 overflow-x-auto pb-4 scrollbar-hide">
                  {[1, 2, 3, 4].map((item) => (
                    <motion.div 
                      key={item}
                      className="flex-shrink-0 w-48 group"
                      whileHover={{ y: -5 }}
                    >
                      <div className="relative rounded-lg overflow-hidden mb-3 bg-gray-100">
                        <div className="aspect-w-2 aspect-h-3 bg-gray-200">
                          <div className="absolute inset-0 bg-gradient-to-br from-amber-100/40 to-pink-100/40" />
                        </div>
                        <div className="absolute inset-0 flex items-center justify-center text-amber-600 opacity-0 group-hover:opacity-100 transition-opacity">
                          <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                          </svg>
                        </div>
                      </div>
                      <h4 className="text-gray-800 font-medium">Elegant Piece {item}</h4>
                      <p className="text-amber-600 font-light">₹ 12,999</p>
                    </motion.div>
                  ))}
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
                    className="inline-flex items-center text-amber-600 font-medium group"
                  >
                    <svg className="w-4 h-4 mr-2 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path>
                    </svg>
                    Continue Exploring
                  </motion.button>
                </Link>
              </motion.div>
            </div>
            
            {/* Right column - Order details */}
            <div className="space-y-8">
              <motion.div 
                className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-100 relative"
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.6 }}
              >
                <div className="absolute top-0 right-0 w-32 h-32 -mr-16 -mt-16 bg-gradient-to-br from-amber-100 to-pink-100 rounded-full opacity-60" />
                <div className="absolute bottom-0 left-0 w-24 h-24 -ml-12 -mb-12 bg-gradient-to-tr from-amber-100 to-pink-100 rounded-full opacity-60" />
                
                <div className="p-8 relative">
                  <h3 className="text-2xl font-serif text-gray-800 mb-6">Order Summary</h3>
                  
                  <div className="space-y-4 mb-8">
                    {/* Luxury divider */}
                    <div className="flex items-center space-x-4 mb-8">
                      <div className="flex-grow h-px bg-gradient-to-r from-transparent via-gray-200 to-transparent" />
                      <div className="w-2 h-2 rounded-full bg-amber-500" />
                      <div className="flex-grow h-px bg-gradient-to-r from-gray-200 via-gray-200 to-transparent" />
                    </div>
                    
                    <div className="flex justify-between text-gray-600">
                      <span>Subtotal</span>
                      <span className="font-medium text-gray-800">₹ 0</span>
                    </div>
                    
                    <div className="flex justify-between text-gray-600">
                      <span>Shipping</span>
                      <span className="text-green-600">Free</span>
                    </div>
                    
                    <div className="flex justify-between text-gray-600">
                      <span>Tax</span>
                      <span className="font-medium text-gray-800">₹ 0</span>
                    </div>
                    
                    <div className="pt-4 mt-4 border-t border-dashed border-gray-200">
                      <div className="flex justify-between">
                        <span className="text-lg text-gray-800">Total</span>
                        <motion.span 
                          className="text-xl font-serif text-amber-600"
                          initial={{ scale: 1 }}
                          whileHover={{ scale: 1.05 }}
                        >
                          ₹ 0
                        </motion.span>
                      </div>
                    </div>
                  </div>
                  
                  <motion.button
                    disabled
                    className="w-full py-4 bg-gradient-to-r from-gray-300 to-gray-400 text-white rounded-full font-medium relative overflow-hidden cursor-not-allowed"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <span className="relative z-10">Complete Purchase</span>
                  </motion.button>
                  
                  <div className="flex justify-center mt-4">
                    <div className="flex items-center text-gray-500 text-sm">
                      <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                      </svg>
                      Secure Checkout
                    </div>
                  </div>
                </div>
              </motion.div>
              
              {/* Promo code input with animation */}
              <motion.div 
                className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-100 p-8"
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.7 }}
              >
                <h3 className="text-xl font-serif text-gray-800 mb-4">Apply Promo Code</h3>
                
                <div className="relative">
                  <input 
                    type="text" 
                    placeholder="Enter code" 
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500/30 focus:border-amber-500 transition-colors"
                  />
                  
                  <button className="absolute right-2 top-1/2 transform -translate-y-1/2 px-4 py-1.5 bg-gray-100 text-gray-600 rounded-md text-sm hover:bg-gray-200 transition-colors">
                    Apply
                  </button>
                </div>
                
                <div className="mt-4 text-sm text-gray-500">
                  Use code <span className="text-amber-600 font-medium">WELCOME15</span> for 15% off your first order
                </div>
              </motion.div>
              
              {/* Satisfaction guarantee with parallax effect */}
              <motion.div 
                className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-100 p-8"
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.8 }}
                style={{
                  backgroundImage: 'url("data:image/svg+xml,%3Csvg width=\'20\' height=\'20\' viewBox=\'0 0 20 20\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'%23f3f4f6\' fill-opacity=\'0.6\' fill-rule=\'evenodd\'%3E%3Ccircle cx=\'3\' cy=\'3\' r=\'1\'/%3E%3C/g%3E%3C/svg%3E")',
                  backgroundPosition: `0px ${scrollY * 0.05}px`
                }}
              >
                <div className="flex items-start space-x-4 relative">
                  <div className="flex-shrink-0 p-2 bg-amber-50 rounded-full">
                    <svg className="w-10 h-10 text-amber-600" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                  </div>
                  
                  <div>
                    <h3 className="text-xl font-serif text-gray-800 mb-2">Satisfaction Guaranteed</h3>
                    <p className="text-gray-600 text-sm">
                      Experience unparalleled luxury with our 7-day satisfaction guarantee. Our artisans perfect each piece to exceed your expectations.
                    </p>
                    
                    <motion.div 
                      className="mt-4 text-amber-600 font-medium text-sm cursor-pointer"
                      whileHover={{ x: 3 }}
                    >
                      Learn more about our guarantee →
                    </motion.div>
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
          className="absolute top-1/3 left-10 w-2 h-2 rounded-full bg-amber-500"
          animate={{ 
            scale: [1, 1.5, 1],
            opacity: [0.5, 1, 0.5]
          }}
          transition={{ duration: 4, repeat: Infinity }}
        />
        
        <motion.div 
          className="absolute top-2/3 right-10 w-3 h-3 rounded-full bg-pink-500"
          animate={{ 
            scale: [1, 1.8, 1],
            opacity: [0.3, 0.8, 0.3]
          }}
          transition={{ duration: 5, repeat: Infinity, delay: 1 }}
        />
        
        <motion.div 
          className="absolute bottom-20 left-1/2 w-2 h-2 rounded-full bg-amber-500"
          animate={{ 
            scale: [1, 2, 1],
            opacity: [0.4, 0.9, 0.4]
          }}
          transition={{ duration: 6, repeat: Infinity, delay: 2 }}
        />
      </div>
    </div>
  );
};

export default CartPage; 