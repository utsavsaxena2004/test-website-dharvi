import { motion } from 'framer-motion';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useCart } from '../contexts/CartContext';
import { useWishlist } from '../contexts/WishlistContext';
import { EyeIcon, HeartIcon, ShoppingCartIcon } from '@heroicons/react/24/outline';
import { HeartIcon as HeartSolidIcon } from '@heroicons/react/24/solid';
import AuthPopup from './AuthPopup';

const CuratedProductCard = ({ 
  product, 
  onQuickView,
  onProductClick,
  className = ""
}) => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const { addToCart } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();
  const [isAuthPopupOpen, setIsAuthPopupOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isWishlistLoading, setIsWishlistLoading] = useState(false);
  
  const handleQuickView = (event) => {
    event.stopPropagation();
    if (onQuickView) {
      onQuickView(product);
    }
  };

  const handleAddToCart = async (event) => {
    event.stopPropagation();
    
    if (!isAuthenticated) {
      setIsAuthPopupOpen(true);
      return;
    }

    if (product.stock_quantity === 0) {
      return;
    }

    try {
      setIsLoading(true);
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
    } finally {
      setIsLoading(false);
    }
  };

  const handleWishlistToggle = async (event) => {
    event.stopPropagation();
    
    if (!isAuthenticated) {
      setIsAuthPopupOpen(true);
      return;
    }

    try {
      setIsWishlistLoading(true);
      await toggleWishlist(product);
    } catch (error) {
      console.error('Error toggling wishlist:', error);
    } finally {
      setIsWishlistLoading(false);
    }
  };

  const handleCardClick = () => {
    if (onProductClick) {
      onProductClick(product);
    }
  };

  const isProductInWishlist = isInWishlist(product.id);
  const isOutOfStock = product.stock_quantity === 0;
  const isFeatured = product.featured || product.tag === 'featured';

  return (
    <>
      <motion.div
        whileHover={{ y: -5 }}
        className={`group relative overflow-hidden bg-white rounded-lg shadow-sm hover:shadow-lg transition-all duration-300 cursor-pointer ${className}`}
        onClick={handleCardClick}
      >
        {/* Product Image */}
        <div className="relative aspect-[4/3] sm:aspect-[3/4] overflow-hidden">
          <motion.img
            src={product.image_urls?.[0] || product.image || '/placeholder-image.jpg'}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            whileHover={{ scale: 1.05 }}
          />
          
          {/* Overlay */}
          <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          
          {/* Badges - Left side stack */}
          <div className="absolute top-2 sm:top-3 left-2 sm:left-3 flex flex-col gap-1 z-10">
            {isFeatured && (
              <span className="bg-[#6f0e06] text-white text-xs px-1.5 sm:px-2 py-0.5 sm:py-1 rounded font-medium">
                Featured
              </span>
            )}
          </div>
          
          {/* Badges - Right side stack */}
          <div className="absolute top-2 sm:top-3 right-2 sm:right-3 flex flex-col gap-1 z-10">
            {isOutOfStock && (
              <span className="bg-gray-500 text-white text-xs px-1.5 sm:px-2 py-0.5 sm:py-1 rounded font-medium">
                Out of Stock
              </span>
            )}
          </div>
          
          {/* Quick View Button */}
          <div className="absolute inset-x-0 bottom-4 flex justify-center opacity-0 group-hover:opacity-100 transform translate-y-4 group-hover:translate-y-0 transition-all duration-300">
            <motion.button
              onClick={handleQuickView}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-white text-gray-800 px-4 py-2 rounded-full text-sm font-medium shadow-lg hover:bg-gray-50 transition-colors duration-200 flex items-center gap-2"
            >
              <EyeIcon className="w-4 h-4" />
              Quick View
            </motion.button>
          </div>
        </div>
        
        {/* Product Info */}
        <div className="p-2 sm:p-3 md:p-4">
          {/* Product Name */}
          <h3 className="font-medium text-gray-900 text-xs sm:text-sm mb-1 line-clamp-2 group-hover:text-[#6f0e06] transition-colors duration-200">
            {product.name}
          </h3>
          
          {/* Description */}
          {product.description && (
            <p className="text-xs text-gray-500 mb-1 sm:mb-2 line-clamp-1">
              {product.description}
            </p>
          )}
          
          {/* Price */}
          <div className="flex items-center justify-between mb-2 sm:mb-3">
            <div className="flex flex-col sm:flex-row sm:items-center sm:gap-2">
              <span className="text-sm sm:text-lg font-bold text-[#6f0e06]">
                ₹{product.price ? Number(product.price).toLocaleString('en-IN') : '0'}
              </span>
              {product.original_price && product.original_price > product.price && (
                <span className="text-xs text-gray-400 line-through">
                  ₹{Number(product.original_price).toLocaleString('en-IN')}
                </span>
              )}
            </div>
          </div>
          
          {/* Colors and Sizes */}
          <div className="flex items-center justify-between text-xs text-gray-500 mb-2 sm:mb-3">
            <div className="flex items-center gap-1">
              <span>Colors:</span>
              <span className="font-medium">{product.colors?.length || 1}</span>
            </div>
            <div className="flex items-center gap-1">
              <span>Sizes:</span>
              <span className="font-medium">{product.sizes?.length || 'One Size'}</span>
            </div>
          </div>
          
          {/* Action Buttons */}
          <div className="flex items-center gap-1 sm:gap-2">
            {/* Add to Cart Button */}
            <motion.button
              onClick={handleAddToCart}
              disabled={isOutOfStock || isLoading}
              whileHover={!isOutOfStock ? { scale: 1.02 } : {}}
              whileTap={!isOutOfStock ? { scale: 0.98 } : {}}
              className={`flex-1 py-1.5 sm:py-2 text-xs font-medium rounded transition-colors duration-200 flex items-center justify-center gap-1 ${
                isOutOfStock 
                  ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
                  : isLoading
                  ? 'bg-gray-200 text-gray-500 cursor-wait'
                  : 'bg-[#6f0e06] text-white hover:bg-[#5a0b05]'
              }`}
            >
              {isLoading ? (
                <>
                  <svg className="w-3 h-3 animate-spin" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  <span className="hidden sm:inline">Adding...</span>
                  <span className="sm:hidden">Add...</span>
                </>
              ) : isOutOfStock ? (
                <span className="text-xs">Out of Stock</span>
              ) : (
                <>
                  <ShoppingCartIcon className="w-3 h-3" />
                  <span className="hidden sm:inline">Add to Cart</span>
                  <span className="sm:hidden">Add</span>
                </>
              )}
            </motion.button>
            
            {/* Wishlist Button */}
            <motion.button
              onClick={handleWishlistToggle}
              disabled={isWishlistLoading}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className={`p-1.5 sm:p-2 rounded transition-colors duration-200 ${
                isWishlistLoading 
                  ? 'text-gray-400 cursor-wait' 
                  : isProductInWishlist 
                  ? 'text-red-500 hover:text-red-600' 
                  : 'text-gray-400 hover:text-red-500'
              }`}
            >
              {isWishlistLoading ? (
                <svg className="w-3 h-3 sm:w-4 sm:h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              ) : isProductInWishlist ? (
                <HeartSolidIcon className="w-3 h-3 sm:w-4 sm:h-4" />
              ) : (
                <HeartIcon className="w-3 h-3 sm:w-4 sm:h-4" />
              )}
            </motion.button>
          </div>
        </div>
      </motion.div>

      {/* Auth Popup */}
      <AuthPopup
        isOpen={isAuthPopupOpen}
        onClose={() => setIsAuthPopupOpen(false)}
        onSuccess={() => setIsAuthPopupOpen(false)}
      />
    </>
  );
};

export default CuratedProductCard;