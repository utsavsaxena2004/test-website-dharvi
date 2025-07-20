import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import { AnimatedCounter } from './WishlistAnimation';

const WishlistStats = ({ items }) => {
  const [totalSaved, setTotalSaved] = useState(0);
  const [averagePrice, setAveragePrice] = useState(0);
  const [mostPopularCategory, setMostPopularCategory] = useState('');
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Calculate stats when items change
    if (items.length > 0) {
      // Calculate total potential savings
      const potentialSavings = items.reduce((total, item) => {
        // Extract the original price without currency and commas
        const price = parseInt(item.price.replace(/[^\d]/g, ''));
        // Assume 10% discount if no explicit discount mentioned
        const discount = item.discount ? 
          parseInt(item.discount.replace(/[^\d]/g, '')) : 10;
        
        return total + (price * discount / 100);
      }, 0);
      setTotalSaved(potentialSavings);

      // Calculate average price
      const totalPrice = items.reduce((total, item) => {
        return total + parseInt(item.price.replace(/[^\d]/g, ''));
      }, 0);
      setAveragePrice(Math.round(totalPrice / items.length));

      // Find most popular category
      const categories = {};
      items.forEach(item => {
        categories[item.category] = (categories[item.category] || 0) + 1;
      });
      
      let maxCount = 0;
      let popular = '';
      Object.entries(categories).forEach(([category, count]) => {
        if (count > maxCount) {
          maxCount = count;
          popular = category;
        }
      });
      setMostPopularCategory(popular);
    }

    // Set visible after a delay for animation
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 500);

    return () => clearTimeout(timer);
  }, [items]);

  if (!isVisible || items.length === 0) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ 
        duration: 0.7,
        type: "spring",
        stiffness: 100
      }}
      className="mb-8 p-6 bg-white/80 backdrop-blur-sm rounded-xl shadow-sm relative overflow-hidden"
    >
      {/* Decorative background */}
      <div className="absolute inset-0 z-0 opacity-5">
        <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
          <path
            d="M0,0 L100,0 L100,100 L0,100 Z"
            fill="url(#statsGradient)"
          />
          <defs>
            <linearGradient id="statsGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#6f0e06" />
              <stop offset="50%" stopColor="#f472b6" />
              <stop offset="100%" stopColor="#6f0e06" />
            </linearGradient>
          </defs>
        </svg>
      </div>

      <div className="relative z-10">
        <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-[#6f0e06]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
          </svg>
          Your Wishlist Insights
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <motion.div 
            whileHover={{ y: -5 }}
            className="bg-gradient-to-br from-pink-50 to-white p-4 rounded-lg shadow-sm"
          >
            <p className="text-sm text-gray-600 mb-1">Potential Savings</p>
            <p className="text-2xl font-medium text-[#6f0e06]">
              ₹ <AnimatedCounter end={totalSaved} />
            </p>
            <p className="text-xs text-gray-500 mt-1">Based on current discounts</p>
          </motion.div>

          <motion.div 
            whileHover={{ y: -5 }}
            className="bg-gradient-to-br from-pink-50 to-white p-4 rounded-lg shadow-sm"
          >
            <p className="text-sm text-gray-600 mb-1">Average Item Price</p>
            <p className="text-2xl font-medium text-[#6f0e06]">
              ₹ <AnimatedCounter end={averagePrice} />
            </p>
            <p className="text-xs text-gray-500 mt-1">Across your collection</p>
          </motion.div>

          <motion.div 
            whileHover={{ y: -5 }}
            className="bg-gradient-to-br from-pink-50 to-white p-4 rounded-lg shadow-sm"
          >
            <p className="text-sm text-gray-600 mb-1">Favorite Category</p>
            <p className="text-2xl font-medium text-[#6f0e06]">{mostPopularCategory}</p>
            <p className="text-xs text-gray-500 mt-1">Your most loved style</p>
          </motion.div>
        </div>
        
        <div className="mt-4 text-xs text-gray-500 text-right">
          <span>Based on {items.length} items in your wishlist</span>
        </div>
      </div>
    </motion.div>
  );
};

export default WishlistStats; 