import { motion } from 'framer-motion';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useCart } from '../contexts/CartContext';
import { useWishlist } from '../contexts/WishlistContext';
import AuthPopup from './AuthPopup';

const ProductCard = ({ 
  product, 
  onQuickView, 
  onAddToCart, 
  className = "",
  showQuickView = true,
  showAddToCart = true 
}) => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const { addToCart } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();
  const [isAuthPopupOpen, setIsAuthPopupOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isWishlistLoading, setIsWishlistLoading] = useState(false);
  
  const handleQuickView = () => {
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
      
      const wasAdded = await toggleWishlist(product);
      
      // Show success notification
      const notification = document.createElement('div');
      notification.className = `fixed top-4 right-4 text-white px-6 py-3 rounded-lg shadow-lg z-50 transition-all duration-300 ${
        wasAdded ? 'bg-pink-500' : 'bg-gray-500'
      }`;
      notification.innerHTML = `
        <div class="flex items-center">
          <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"></path>
          </svg>
          ${wasAdded ? 'Added to wishlist!' : 'Removed from wishlist!'}
        </div>
      `;
      document.body.appendChild(notification);
      
      setTimeout(() => {
        notification.remove();
      }, 3000);
      
    } catch (error) {
      console.error('Error toggling wishlist:', error);
      
      // Show error notification
      const notification = document.createElement('div');
      notification.className = 'fixed top-4 right-4 bg-red-500 text-white px-6 py-3 rounded-lg shadow-lg z-50 transition-all duration-300';
      notification.innerHTML = `
        <div class="flex items-center">
          <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
          </svg>
          Failed to update wishlist. Please try again.
        </div>
      `;
      document.body.appendChild(notification);
      
      setTimeout(() => {
        notification.remove();
      }, 3000);
    } finally {
      setIsWishlistLoading(false);
    }
  };

  const handleAuthSuccess = async () => {
    setIsAuthPopupOpen(false);
    // Try adding to cart again after successful login
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
      console.error('Error adding to cart after login:', error);
    }
  };

  const handleCardClick = () => {
    // Open quick view modal instead of navigating
    if (onQuickView) {
      onQuickView(product);
    }
  };

  const isProductInWishlist = isInWishlist(product.id);

  return (
    <>
      <motion.div
        whileHover={{ y: -10 }}
        className={`group relative overflow-hidden bg-white rounded-lg shadow-sm hover:shadow-xl transition-all duration-300 cursor-pointer ${className}`}
        onClick={handleCardClick}
      >
        {/* Product image and overlay */}
        <div className="relative h-80 overflow-hidden">
          <motion.div
            whileHover={{ scale: 1.1 }}
            transition={{ duration: 0.6 }}
            className="h-full"
            onClick={handleCardClick}
          >
            <img
              src={product.image_urls?.[0] || product.image || '/placeholder-image.jpg'}
              alt={product.name}
              className="w-full h-full object-cover"
            />
          </motion.div>
          
          {/* Gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          
          {/* Decorative border that appears on hover */}
          <div className="absolute inset-0 border border-white/30 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          
          {/* Corner accents */}
          <div className="absolute top-3 left-3 w-6 h-6 border-t border-l border-white/50 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
          <div className="absolute top-3 right-3 w-6 h-6 border-t border-r border-white/50 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
          <div className="absolute bottom-3 left-3 w-6 h-6 border-b border-l border-white/50 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
          <div className="absolute bottom-3 right-3 w-6 h-6 border-b border-r border-white/50 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
          
          {/* Quick action button */}
          {showQuickView && (
            <div className="absolute bottom-4 left-0 right-0 flex justify-center opacity-0 transform translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300">
              <motion.button 
                onClick={(e) => {
                  e.stopPropagation();
                  handleQuickView();
                }}
                whileHover={{ scale: 1.05 }} 
                whileTap={{ scale: 0.95 }}
                className="bg-white text-[#ba1a5d] py-2 px-4 rounded-full text-sm font-medium shadow-lg hover:bg-[#ba1a5d] hover:text-white transition-colors duration-300 flex items-center space-x-1"
              >
                <span>Quick View</span>
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
              </motion.button>
            </div>
          )}
          
          {/* Badges */}
          {product.featured && (
            <div className="absolute top-3 left-3 bg-[#ba1a5d] text-white text-xs px-2 py-1 rounded font-medium z-10">
              Featured
            </div>
          )}
          
          {product.badge && (
            <div className="absolute top-3 left-3 bg-[#ba1a5d] text-white text-xs px-2 py-1 rounded font-medium z-10">
              {product.badge}
            </div>
          )}
          
          {product.discount && (
            <div className="absolute top-3 right-3 bg-amber-500 text-white text-xs px-2 py-1 rounded font-medium z-10">
              {product.discount}
            </div>
          )}

          {product.stock_quantity < 10 && product.stock_quantity > 0 && (
            <div className="absolute top-3 right-3 bg-red-500 text-white text-xs px-2 py-1 rounded font-medium z-10">
              Low Stock
            </div>
          )}

          {product.stock_quantity === 0 && (
            <div className="absolute top-3 right-3 bg-gray-500 text-white text-xs px-2 py-1 rounded font-medium z-10">
              Out of Stock
            </div>
          )}
        </div>
        
        {/* Product info */}
        <div className="p-4">
          <div className="flex justify-between items-center mb-1">
            <h3 className="text-lg font-serif text-gray-900 group-hover:text-[#ba1a5d] transition-colors duration-300 line-clamp-1">
              {product.name}
            </h3>
            <motion.button
              whileHover={{ scale: 1.2 }}
              whileTap={{ scale: 0.9 }}
              onClick={handleWishlistToggle}
              disabled={isWishlistLoading}
              className={`transition-colors duration-300 ${
                isWishlistLoading 
                  ? 'text-gray-400 cursor-wait' 
                  : isProductInWishlist 
                  ? 'text-red-500 hover:text-red-600' 
                  : 'text-gray-400 hover:text-[#ba1a5d]'
              }`}
            >
              {isWishlistLoading ? (
                <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              ) : (
                <svg className="w-5 h-5" fill={isProductInWishlist ? "currentColor" : "none"} stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"></path>
                </svg>
              )}
            </motion.button>
          </div>
          
          {/* Price */}
          <div className="flex items-center space-x-2 mb-2">
            <span className="text-xl font-bold text-[#ba1a5d]">
              ₹{product.price ? product.price.toLocaleString('en-IN') : '0'}
            </span>
            {product.original_price && product.original_price > product.price && (
              <>
                <span className="text-sm text-gray-500 line-through">
                  ₹{product.original_price.toLocaleString('en-IN')}
                </span>
                <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full font-medium">
                  {Math.round(((product.original_price - product.price) / product.original_price) * 100)}% OFF
                </span>
              </>
            )}
          </div>

          {/* Colors */}
          {product.colors && product.colors.length > 0 && (
            <div className="flex items-center space-x-2 mt-2">
              <span className="text-xs text-gray-500">Colors:</span>
              <div className="flex space-x-1">
                {product.colors.slice(0, 4).map((color, index) => (
                  <div
                    key={index}
                    className="w-4 h-4 rounded-full border border-gray-300"
                    style={{ backgroundColor: color.toLowerCase() }}
                  />
                ))}
                {product.colors.length > 4 && (
                  <span className="text-xs text-gray-500">+{product.colors.length - 4}</span>
                )}
              </div>
            </div>
          )}

          {/* Sizes */}
          {product.sizes && product.sizes.length > 0 && (
            <div className="flex items-center space-x-2 mt-2">
              <span className="text-xs text-gray-500">Sizes:</span>
              <div className="flex space-x-1">
                {product.sizes.slice(0, 3).map((size, index) => (
                  <span
                    key={index}
                    className="px-2 py-1 text-xs bg-gray-100 text-gray-700 rounded"
                  >
                    {size}
                  </span>
                ))}
                {product.sizes.length > 3 && (
                  <span className="text-xs text-gray-500">+{product.sizes.length - 3}</span>
                )}
              </div>
            </div>
          )}
          
          {/* Subtle divider */}
          <div className="w-full h-px bg-gray-100 my-3"></div>
          
          {/* Add to cart button */}
          {showAddToCart && (
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleAddToCart}
              disabled={product.stock_quantity === 0 || isLoading}
              className={`w-full py-2 mt-1 text-sm font-medium rounded transition-colors duration-300 flex items-center justify-center space-x-1 ${
                product.stock_quantity === 0 
                  ? 'text-gray-400 bg-gray-100 cursor-not-allowed' 
                  : isLoading
                  ? 'text-gray-600 bg-gray-200 cursor-wait'
                  : 'text-gray-600 hover:text-[#ba1a5d] bg-gray-50 hover:bg-gray-100'
              }`}
            >
              {isLoading ? (
                <>
                  <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  <span>Adding...</span>
                </>
              ) : (
                <>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"></path>
                  </svg>
                  <span>{product.stock_quantity === 0 ? 'Out of Stock' : 'Add to Cart'}</span>
                </>
              )}
            </motion.button>
          )}
        </div>
      </motion.div>

      {/* Auth Popup */}
      <AuthPopup
        isOpen={isAuthPopupOpen}
        onClose={() => setIsAuthPopupOpen(false)}
        onSuccess={handleAuthSuccess}
      />
    </>
  );
};

export default ProductCard; 