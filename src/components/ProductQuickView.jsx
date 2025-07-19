import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useCart } from '../contexts/CartContext';
import { useWishlist } from '../contexts/WishlistContext';
import AuthPopup from './AuthPopup';

const ProductQuickView = ({ product, isOpen, onClose }) => {
  const [selectedColor, setSelectedColor] = useState('');
  const [selectedSize, setSelectedSize] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [activeTab, setActiveTab] = useState('description');
  const [isAuthPopupOpen, setIsAuthPopupOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isWishlistLoading, setIsWishlistLoading] = useState(false);
  const modalRef = useRef(null);
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const { addToCart } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();
  
  // Get product images - handle both single image and image_urls array
  const getProductImages = () => {
    if (!product) return [];
    
    if (product.image_urls && Array.isArray(product.image_urls)) {
      return product.image_urls;
    } else if (product.image) {
      return [product.image];
    }
    return [];
  };

  const images = getProductImages();
  
  // Get available sizes - use product sizes or default ones
  const getAvailableSizes = () => {
    if (product?.sizes && Array.isArray(product.sizes)) {
      return product.sizes;
    }
    return ['XS', 'S', 'M', 'L', 'XL', 'XXL']; // Default sizes
  };

  const availableSizes = getAvailableSizes();
  
  // Get stock information
  const getStockInfo = () => {
    if (product?.stock_quantity !== undefined) {
      return product.stock_quantity;
    }
    return 12; // Default stock
  };

  const stockLeft = getStockInfo();
  
  // Get product description
  const getDescription = () => {
    if (product?.description) {
      return product.description;
    }
    return "Meticulously crafted with premium fabrics and elegant detailing. This piece exemplifies timeless design with a contemporary twist, perfect for both casual and formal occasions.";
  };

  const description = getDescription();
  
  // Get product specifications
  const getSpecifications = () => {
    const specs = [];
    
    if (product?.material) {
      specs.push({ name: "Material", value: product.material });
    }
    if (product?.care_instructions) {
      specs.push({ name: "Care", value: product.care_instructions });
    }
    if (product?.style) {
      specs.push({ name: "Style", value: product.style });
    }
    if (product?.occasion) {
      specs.push({ name: "Occasion", value: product.occasion });
    }
    if (product?.category_name) {
      specs.push({ name: "Category", value: product.category_name });
    }
    
    // Default specifications if none provided
    if (specs.length === 0) {
      specs.push(
        { name: "Material", value: "Premium Fabric" },
        { name: "Care", value: "Dry Clean Only" },
        { name: "Style", value: "Traditional with Modern Twist" },
        { name: "Occasion", value: "Casual, Festive" }
      );
    }
    
    return specs;
  };

  const specifications = getSpecifications();
  
  // Format price
  const formatPrice = (price) => {
    if (typeof price === 'number') {
      return `₹${price.toLocaleString('en-IN')}`;
    }
    return price || 'Price not available';
  };

  // Get rating information
  const getRating = () => {
    if (product?.rating) {
      return {
        value: product.rating,
        count: product.review_count || 0
      };
    }
    return {
      value: 4.5, // Default rating
      count: 24   // Default review count
    };
  };

  const rating = getRating();
  
  // Handle quantity changes
  const decreaseQuantity = () => {
    if (quantity > 1) setQuantity(quantity - 1);
  };
  
  const increaseQuantity = () => {
    if (quantity < stockLeft) setQuantity(quantity + 1);
  };
  
  // Reset state when product changes
  useEffect(() => {
    if (product) {
      setSelectedColor(product.colors?.[0] || '');
      setSelectedSize(availableSizes[0] || '');
      setQuantity(1);
      setCurrentImageIndex(0);
      setActiveTab('description');
    }
  }, [product]);
  
  // Close on escape key
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape') onClose();
    };
    
    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
    }
    
    return () => {
      document.removeEventListener('keydown', handleEscape);
    };
  }, [isOpen, onClose]);
  
  // Function to add to cart
  const handleAddToCart = async () => {
    if (!product) return;
    
    if (!isAuthenticated) {
      setIsAuthPopupOpen(true);
      return;
    }
    
    try {
      setIsLoading(true);
      
      await addToCart(product, quantity, selectedSize, selectedColor);
      
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
      
      onClose();
      
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

  // Function to toggle wishlist
  const handleWishlistToggle = async () => {
    if (!product) return;
    
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

  // Function to handle Buy Now
  const handleBuyNow = async () => {
    if (!product) return;
    
    if (!isAuthenticated) {
      setIsAuthPopupOpen(true);
      return;
    }
    
    try {
      setIsLoading(true);
      
      // Add to cart first
      await addToCart(product, quantity, selectedSize, selectedColor);
      
      // Close modal and navigate to checkout
      onClose();
      navigate('/checkout');
      
    } catch (error) {
      console.error('Error with buy now:', error);
      
      // Show error notification
      const notification = document.createElement('div');
      notification.className = 'fixed top-4 right-4 bg-red-500 text-white px-6 py-3 rounded-lg shadow-lg z-50 transition-all duration-300';
      notification.innerHTML = `
        <div class="flex items-center">
          <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
          </svg>
          Failed to process. Please try again.
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

  const handleAuthSuccess = async () => {
    setIsAuthPopupOpen(false);
    // Try adding to cart again after successful login
    await handleAddToCart();
  };
  
  if (!product || !isOpen) return null;
  
  const isProductInWishlist = isInWishlist(product.id);
  
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.9, y: 50, opacity: 0 }}
            animate={{ scale: 1, y: 0, opacity: 1 }}
            exit={{ scale: 0.9, y: 50, opacity: 0 }}
            transition={{ 
              type: "spring", 
              damping: 25, 
              stiffness: 300 
            }}
            className="relative bg-white rounded-lg shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Decorative elements */}
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#ba1a5d] via-purple-500 to-amber-500"></div>
            <div className="absolute top-1 right-1 w-3 h-3 bg-amber-400 rounded-full opacity-70"></div>
            <div className="absolute top-1 right-6 w-2 h-2 bg-[#ba1a5d] rounded-full opacity-70"></div>
            
            {/* Close button */}
            <motion.button 
              whileHover={{ rotate: 90, scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={onClose}
              className="absolute top-4 right-4 z-10 text-gray-500 hover:text-gray-800 transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </motion.button>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6">
              {/* Product Images Section */}
              <div className="space-y-4">
                {/* Main image container */}
                <motion.div 
                  whileHover={{ 
                    rotateY: 5, 
                    rotateX: -5,
                    scale: 1.02,
                    transition: { duration: 0.3 }
                  }}
                  className="aspect-square overflow-hidden rounded-lg border border-gray-200 relative"
                >
                  {/* Main image */}
                  <AnimatePresence mode="wait">
                    <motion.img 
                      key={currentImageIndex}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.5 }}
                      src={images[currentImageIndex] || '/placeholder-image.jpg'} 
                      alt={product.name} 
                      className="w-full h-full object-cover"
                    />
                  </AnimatePresence>
                  
                  {/* Hover overlay */}
                  <motion.div 
                    initial={{ opacity: 0 }} 
                    whileHover={{ 
                      opacity: 1,
                      background: 'linear-gradient(45deg, rgba(186, 26, 93, 0.1) 0%, rgba(245, 158, 11, 0.1) 100%)'
                    }}
                    className="absolute inset-0 z-10"
                  />
                  
                  {/* Badge */}
                  {product.badge && (
                    <motion.div
                      initial={{ x: -20, opacity: 0 }}
                      animate={{ x: 0, opacity: 1 }}
                      transition={{ delay: 0.3 }}
                      className="absolute top-3 left-3 bg-[#ba1a5d] text-white text-xs px-2 py-1 rounded font-medium z-20"
                    >
                      {product.badge}
                    </motion.div>
                  )}
                  
                  {/* Discount tag */}
                  {product.discount && (
                    <motion.div
                      initial={{ x: 20, opacity: 0 }}
                      animate={{ x: 0, opacity: 1 }}
                      transition={{ delay: 0.4 }}
                      className="absolute top-3 right-3 bg-amber-500 text-white text-xs px-2 py-1 rounded font-medium z-20"
                    >
                      {product.discount}
                    </motion.div>
                  )}
                </motion.div>
                
                {/* Thumbnail gallery */}
                {images.length > 1 && (
                  <div className="flex space-x-2">
                    {images.map((image, index) => (
                      <motion.button
                        key={index}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 + (index * 0.1) }}
                        onClick={() => setCurrentImageIndex(index)}
                        className={`w-16 h-16 rounded-md overflow-hidden border-2 transition-all ${
                          index === currentImageIndex 
                            ? 'border-[#ba1a5d] shadow-md' 
                            : 'border-gray-200 hover:border-[#ba1a5d]/50'
                        }`}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <img src={image} alt={`Thumbnail ${index + 1}`} className="w-full h-full object-cover" />
                      </motion.button>
                    ))}
                  </div>
                )}

                {/* Product Tags */}
                {product.tags && product.tags.length > 0 && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.5 }}
                    className="flex flex-wrap gap-2 pt-2"
                  >
                    {product.tags.map((tag, index) => (
                      <motion.span 
                        key={index} 
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.5 + (index * 0.1) }}
                        className="text-xs bg-gray-100 text-gray-800 px-2 py-1 rounded"
                        whileHover={{ 
                          scale: 1.05, 
                          backgroundColor: "#FEF3F2",
                          color: "#ba1a5d" 
                        }}
                      >
                        {tag}
                      </motion.span>
                    ))}
                  </motion.div>
                )}
              </div>
              
              {/* Product Details Section */}
              <div className="space-y-4">
                {/* Header */}
                <div className="flex justify-between items-start">
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2, duration: 0.5 }}
                  >
                    <motion.h2 
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.3 }}
                      className="text-2xl font-serif text-gray-900"
                    >
                      {product.name}
                    </motion.h2>
                    <motion.p 
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.4 }}
                      className="text-[#ba1a5d] font-medium text-lg mt-1"
                    >
                      {formatPrice(product.price)}
                    </motion.p>
                  </motion.div>
                  
                  {/* Wishlist button */}
                  <motion.button
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.5, type: "spring" }}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleWishlistToggle}
                    disabled={isWishlistLoading}
                    className={`p-2 rounded-full transition-colors duration-300 ${
                      isWishlistLoading 
                        ? 'text-gray-400 cursor-wait' 
                        : isProductInWishlist 
                        ? 'text-red-500 hover:text-red-600' 
                        : 'text-gray-400 hover:text-gray-600'
                    }`}
                  >
                    {isWishlistLoading ? (
                      <svg className="w-6 h-6 animate-spin" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                    ) : (
                      <motion.svg 
                        className="w-6 h-6" 
                        fill={isProductInWishlist ? "currentColor" : "none"} 
                        stroke="currentColor" 
                        viewBox="0 0 24 24"
                        animate={isProductInWishlist ? 
                          { scale: [1, 1.3, 1], transition: { duration: 0.5 } } : 
                          { scale: 1 }
                        }
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"></path>
                      </motion.svg>
                    )}
                  </motion.button>
                </div>
                
                {/* Rating */}
                {/* Dont add This Back */}
                {/* <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.5 }}
                  className="flex items-center space-x-1"
                >
                  {[1, 2, 3, 4, 5].map((star, index) => (
                    <motion.svg 
                      key={star} 
                      className={`w-4 h-4 ${index < Math.floor(rating.value) ? 'text-amber-400' : 'text-gray-300'}`}
                      fill="currentColor" 
                      viewBox="0 0 20 20"
                      initial={{ opacity: 0, scale: 0 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.5 + (index * 0.1) }}
                    >
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
                    </motion.svg>
                  ))}
                  <motion.span 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1 }}
                    className="text-gray-500 text-sm"
                  >
                    ({rating.count} reviews)
                  </motion.span>
                </motion.div> */}
                
                {/* Tabbed content */}
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6 }}
                  className="mt-4"
                >
                  <div className="flex border-b border-gray-200 mb-4">
                    <motion.button
                      whileHover={{ backgroundColor: "#f3f4f6" }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => setActiveTab('description')}
                      className={`px-4 py-2 text-sm font-medium ${
                        activeTab === 'description' 
                          ? 'text-[#ba1a5d] border-b-2 border-[#ba1a5d]' 
                          : 'text-gray-600 hover:text-gray-900'
                      }`}
                    >
                      Description
                    </motion.button>
                    <motion.button
                      whileHover={{ backgroundColor: "#f3f4f6" }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => setActiveTab('specifications')}
                      className={`px-4 py-2 text-sm font-medium ${
                        activeTab === 'specifications' 
                          ? 'text-[#ba1a5d] border-b-2 border-[#ba1a5d]' 
                          : 'text-gray-600 hover:text-gray-900'
                      }`}
                    >
                      Specifications
                    </motion.button>
                  </div>
                  
                  <AnimatePresence mode="wait">
                    {activeTab === 'description' ? (
                      <motion.div
                        key="description"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.2 }}
                      >
                        <p className="text-gray-600 text-sm break-words overflow-wrap-anywhere">{description}</p>
                      </motion.div>
                    ) : (
                      <motion.div
                        key="specifications"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.2 }}
                        className="space-y-2"
                      >
                        {specifications.map((spec, index) => (
                          <div key={index} className="flex border-b border-gray-100 pb-2 text-sm">
                            <span className="font-medium text-gray-700 w-1/3">{spec.name}:</span>
                            <span className="text-gray-600 w-2/3 break-words overflow-wrap-anywhere">{spec.value}</span>
                          </div>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
                
                {/* Stock indicator */}
                <motion.div 
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.7 }}
                  className="flex items-center mt-4"
                >
                  <motion.span 
                    animate={{ 
                      scale: stockLeft > 0 ? [1, 1.2, 1] : 1,
                      transition: { 
                        repeat: stockLeft > 0 ? Infinity : 0,
                        repeatDelay: 5
                      }
                    }}
                    className={`inline-block w-3 h-3 rounded-full mr-2 ${
                      stockLeft > 5 ? 'bg-green-500' : 
                      stockLeft > 0 ? 'bg-amber-500' : 
                      'bg-red-500'
                    }`}
                  ></motion.span>
                  <span className="text-sm text-gray-700">
                    {stockLeft > 5 ? 'In Stock' : stockLeft > 0 ? `Only ${stockLeft} left` : 'Out of Stock'}
                  </span>
                </motion.div>
                
                {/* Color Selection */}
                {product.colors && product.colors.length > 0 && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.8 }}
                  >
                    <h3 className="text-sm font-medium text-gray-900 mb-2 mt-4">Colors</h3>
                    <div className="flex space-x-2">
                      {product.colors.map((color, i) => (
                        <motion.button
                          key={i}
                          initial={{ opacity: 0, scale: 0 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ 
                            delay: 0.8 + (i * 0.1),
                            type: "spring",
                            stiffness: 300,
                            damping: 15
                          }}
                          whileHover={{ 
                            scale: 1.2,
                            boxShadow: "0 0 0 2px rgba(255,255,255,1), 0 0 0 4px " + color
                          }}
                          whileTap={{ scale: 0.9 }}
                          onClick={() => setSelectedColor(color)}
                          className={`w-8 h-8 rounded-full border-2 transition-all ${
                            selectedColor === color 
                              ? 'border-gray-900 ring-2 ring-[#ba1a5d]/30' 
                              : 'border-gray-300 hover:border-gray-400'
                          }`}
                          style={{ backgroundColor: color }}
                          aria-label={`Select color ${i + 1}`}
                        >
                          {selectedColor === color && (
                            <motion.div
                              initial={{ scale: 0 }}
                              animate={{ scale: 1 }}
                              className="flex items-center justify-center h-full"
                            >
                              <svg className="w-4 h-4 text-white" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                              </svg>
                            </motion.div>
                          )}
                        </motion.button>
                      ))}
                    </div>
                  </motion.div>
                )}
                
                {/* Size Selection */}
                {availableSizes.length > 0 && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.9 }}
                  >
                    <div className="flex justify-between items-center mb-2 mt-4">
                      <h3 className="text-sm font-medium text-gray-900">Size</h3>
                      <motion.button 
                        whileHover={{ scale: 1.05, color: "#ba1a5d" }}
                        whileTap={{ scale: 0.95 }}
                        className="text-xs text-[#ba1a5d] hover:text-[#9a1549]"
                      >
                        Size Guide
                      </motion.button>
                    </div>
                    <div className="grid grid-cols-6 gap-2">
                      {availableSizes.map((size, index) => (
                        <motion.button
                          key={size}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.9 + (index * 0.05) }}
                          whileHover={{ y: -4 }}
                          whileTap={{ y: 0 }}
                          onClick={() => setSelectedSize(size)}
                          className={`py-2 text-sm font-medium rounded border transition-all ${
                            selectedSize === size
                              ? 'bg-[#ba1a5d] text-white border-[#ba1a5d]'
                              : 'bg-white text-gray-900 border-gray-300 hover:border-[#ba1a5d]/50'
                          }`}
                        >
                          {size}
                        </motion.button>
                      ))}
                    </div>
                  </motion.div>
                )}
                
                {/* Quantity Selector */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1 }}
                  className="mt-4"
                >
                  <h3 className="text-sm font-medium text-gray-900 mb-2">Quantity</h3>
                  <div className="flex items-center border border-gray-300 rounded-md w-max overflow-hidden">
                    <motion.button 
                      onClick={decreaseQuantity}
                      disabled={quantity <= 1}
                      whileHover={quantity > 1 ? { backgroundColor: "#FEF3F2" } : {}}
                      whileTap={quantity > 1 ? { scale: 0.9 } : {}}
                      className={`px-3 py-1 ${
                        quantity <= 1 
                          ? 'text-gray-300 cursor-not-allowed' 
                          : 'text-gray-600 hover:text-[#ba1a5d]'
                      }`}
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 12H4" />
                      </svg>
                    </motion.button>
                    
                    <motion.div
                      key={quantity}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="relative"
                    >
                      <span className="px-4 py-1 text-gray-900 border-x border-gray-300 block">
                        {quantity}
                      </span>
                    </motion.div>
                    
                    <motion.button 
                      onClick={increaseQuantity}
                      disabled={quantity >= stockLeft}
                      whileHover={quantity < stockLeft ? { backgroundColor: "#FEF3F2" } : {}}
                      whileTap={quantity < stockLeft ? { scale: 0.9 } : {}}
                      className={`px-3 py-1 ${
                        quantity >= stockLeft 
                          ? 'text-gray-300 cursor-not-allowed' 
                          : 'text-gray-600 hover:text-[#ba1a5d]'
                      }`}
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
                      </svg>
                    </motion.button>
                  </div>
                </motion.div>
                
                {/* Action Buttons */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1.1 }}
                  className="space-y-3 pt-6"
                >
                  <motion.button
                    whileHover={{ 
                      scale: 1.02,
                      boxShadow: "0 10px 15px -3px rgba(186, 26, 93, 0.3), 0 4px 6px -4px rgba(186, 26, 93, 0.3)"
                    }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleAddToCart}
                    disabled={stockLeft === 0 || isLoading}
                    className={`relative w-full py-3 rounded-md shadow overflow-hidden group ${
                      stockLeft === 0 || isLoading
                        ? 'bg-gray-400 cursor-not-allowed' 
                        : 'bg-gradient-to-r from-[#ba1a5d] to-[#9a1549] hover:from-[#9a1549] hover:to-[#7a1139]'
                    } text-white`}
                  >
                    <div className="flex items-center justify-center">
                      {isLoading ? (
                        <>
                          <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          <span>Adding to Cart...</span>
                        </>
                      ) : (
                        <>
                          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"></path>
                          </svg>
                          <span>{stockLeft === 0 ? 'Out of Stock' : 'Add to Cart'}</span>
                        </>
                      )}
                    </div>
                  </motion.button>
                  
                  <motion.button
                    whileHover={{ 
                      scale: 1.02,
                      boxShadow: "0 10px 15px -3px rgba(245, 158, 11, 0.2), 0 4px 6px -4px rgba(245, 158, 11, 0.2)"
                    }}
                    whileTap={{ scale: 0.98 }}
                    disabled={stockLeft === 0}
                    onClick={handleBuyNow}
                    className={`w-full py-3 rounded-md shadow transition-colors relative overflow-hidden ${
                      stockLeft === 0 
                        ? 'bg-gray-400 cursor-not-allowed' 
                        : 'bg-amber-500 hover:bg-amber-600'
                    } text-white`}
                  >
                    <div className="flex items-center justify-center">
                      <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"></path>
                      </svg>
                      <span>{stockLeft === 0 ? 'Unavailable' : 'Buy Now'}</span>
                    </div>
                  </motion.button>
                </motion.div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
      
      {/* Auth Popup */}
      <AuthPopup
        isOpen={isAuthPopupOpen}
        onClose={() => setIsAuthPopupOpen(false)}
        onSuccess={handleAuthSuccess}
      />
    </AnimatePresence>
  );
};

export default ProductQuickView; 