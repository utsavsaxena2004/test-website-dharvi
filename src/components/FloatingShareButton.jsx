import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useWishlist } from '../contexts/WishlistContext';
import { useAuth } from '../contexts/AuthContext';
import WishlistShare from './WishlistShare';

const FloatingShareButton = ({ position = 'bottom-right' }) => {
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const { wishlistItems, wishlistSummary } = useWishlist();
  const { isAuthenticated } = useAuth();

  // Don't show if user is not authenticated or has no wishlist items
  if (!isAuthenticated || wishlistItems.length === 0) {
    return null;
  }

  const openShareModal = () => {
    setIsShareModalOpen(true);
  };

  const closeShareModal = () => {
    setIsShareModalOpen(false);
  };

  const getPositionClasses = () => {
    switch (position) {
      case 'bottom-left':
        return 'bottom-6 left-6';
      case 'bottom-right':
        return 'bottom-6 right-6';
      case 'top-right':
        return 'top-6 right-6';
      case 'top-left':
        return 'top-6 left-6';
      default:
        return 'bottom-6 right-6';
    }
  };

  return (
    <>
      <motion.div
        className={`fixed ${getPositionClasses()} z-40`}
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ 
          type: "spring", 
          stiffness: 200, 
          damping: 20,
          delay: 1 
        }}
      >
        <motion.button
          onClick={openShareModal}
          className="relative group bg-gradient-to-r from-[#6f0e06] to-[#9a1549] text-white p-4 rounded-full shadow-lg hover:shadow-xl transition-all duration-300"
          whileHover={{ 
            scale: 1.1,
            boxShadow: "0 20px 25px -5px rgba(186, 26, 93, 0.3), 0 10px 10px -5px rgba(186, 26, 93, 0.2)"
          }}
          whileTap={{ scale: 0.95 }}
        >
          {/* Animated background pulse */}
          <motion.div
            className="absolute inset-0 rounded-full bg-[#6f0e06]"
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.7, 0.3, 0.7]
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
          
          {/* Share icon */}
          <svg 
            className="w-6 h-6 relative z-10" 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={2} 
              d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z" 
            />
          </svg>
          
          {/* Tooltip */}
          <motion.div
            className="absolute bottom-full right-0 mb-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
            initial={{ y: 10, opacity: 0 }}
            animate={{ y: 0, opacity: 0 }}
            whileHover={{ opacity: 1 }}
          >
            <div className="bg-gray-900 text-white text-sm px-3 py-2 rounded-lg whitespace-nowrap">
              Share your wishlist ({wishlistSummary.itemCount} items)
              <div className="absolute top-full right-3 w-0 h-0 border-l-4 border-r-4 border-t-4 border-l-transparent border-r-transparent border-t-gray-900"></div>
            </div>
          </motion.div>
          
          {/* Item count badge */}
          {wishlistSummary.itemCount > 0 && (
            <motion.div
              className="absolute -top-2 -right-2 bg-white text-[#6f0e06] text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center border-2 border-[#6f0e06]"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 1.2, type: "spring", stiffness: 200 }}
            >
              {wishlistSummary.itemCount > 99 ? '99+' : wishlistSummary.itemCount}
            </motion.div>
          )}
        </motion.button>
      </motion.div>

      {/* Share Modal */}
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
    </>
  );
};

export default FloatingShareButton; 