import { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';

// Import our new components
import { 
  ColorfulOrbs, 
  PaislayPattern, 
  WishlistDecorativeBorder, 
  TiltCard,
  ShimmerButton
} from '../components/WishlistAnimation';
import WishlistStats from '../components/WishlistStats';
import WishlistShare from '../components/WishlistShare';
import WishlistConfetti from '../components/WishlistConfetti';

const wishlistItems = [
  {
    id: 1,
    name: 'Banarasi Silk Saree',
    price: '₹ 12,499',
    image: 'https://images.unsplash.com/photo-1610189031585-fd499562e6c5?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&q=80',
    category: 'Sarees',
    dateAdded: '2023-08-15',
    inStock: true,
    colors: ['#b91c1c', '#fecaca', '#7f1d1d', '#fef2f2'],
  },
  {
    id: 2,
    name: 'Royal Velvet Lehenga',
    price: '₹ 24,999',
    image: 'https://images.unsplash.com/photo-1601571115502-83ca3095735b?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8TGVoZW5nYXxlbnwwfDB8MHx8fDA%3D',
    category: 'Lehengas',
    dateAdded: '2023-07-29',
    inStock: true,
    colors: ['#b91c1c', '#fecaca', '#7f1d1d', '#fef2f2'],
  },
  {
    id: 3,
    name: 'Pastel Anarkali Suit',
    price: '₹ 9,999',
    image: 'https://images.unsplash.com/photo-1560706834-c8b400a49f3b?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    category: 'Suits',
    dateAdded: '2023-09-05',
    inStock: true,
    colors: ['#4f46e5', '#c7d2fe', '#312e81', '#eef2ff'],
  },
  {
    id: 4,
    name: 'Printed Cotton Kurti',
    price: '₹ 2,499',
    image: 'https://images.unsplash.com/photo-1614093302619-2bb5d6b33aac?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    category: 'Kurtis',
    dateAdded: '2023-08-22',
    inStock: false,
    colors: ['#059669', '#a7f3d0', '#065f46', '#ecfdf5'],
  },
  {
    id: 5,
    name: 'Maharani Signature Saree',
    price: '₹ 75,999',
    image: 'https://images.unsplash.com/photo-1659293554631-d7a38642c5e3?q=80&w=2972&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    category: 'Sarees',
    dateAdded: '2023-09-15',
    inStock: true,
    colors: ['#2563eb', '#bfdbfe', '#1e3a8a', '#eff6ff'],
  }
];

// Decorative SVG components
const HeartPattern = () => (
  <svg width="120" height="120" viewBox="0 0 120 120" className="absolute text-[#ba1a5d] opacity-5">
    <path d="M60,20 C55,10 40,0 25,0 C5,0 0,20 0,30 C0,60 25,80 60,100 C95,80 120,60 120,30 C120,20 115,0 95,0 C80,0 65,10 60,20 Z" fill="currentColor" />
  </svg>
);

const FloatingHeart = ({ delay, scale, x, y }) => (
  <motion.div
    className="absolute text-[#ba1a5d] opacity-20"
    initial={{ scale: 0 }}
    animate={{ 
      y: [y, y - 40, y],
      scale: scale,
      opacity: [0.2, 0.3, 0.2]
    }}
    transition={{ 
      duration: 5, 
      repeat: Infinity, 
      delay: delay,
      ease: "easeInOut" 
    }}
    style={{ left: `${x}%`, top: `${y}px` }}
  >
    <svg width="30" height="30" viewBox="0 0 120 120">
      <path d="M60,20 C55,10 40,0 25,0 C5,0 0,20 0,30 C0,60 25,80 60,100 C95,80 120,60 120,30 C120,20 115,0 95,0 C80,0 65,10 60,20 Z" fill="currentColor" />
    </svg>
  </motion.div>
);

const SparkleEffect = ({ top, left, delay }) => (
  <motion.div
    className="absolute w-3 h-3"
    style={{ top: `${top}%`, left: `${left}%` }}
    initial={{ opacity: 0, scale: 0 }}
    animate={{ 
      opacity: [0, 1, 0],
      scale: [0, 1, 0],
      rotate: [0, 180]
    }}
    transition={{
      duration: 2,
      delay: delay,
      repeat: Infinity,
      repeatDelay: 3
    }}
  >
    <svg viewBox="0 0 24 24" className="w-full h-full text-amber-400">
      <path
        fill="currentColor"
        d="M12,2L15.09,8.26L22,9.27L17,14.14L18.18,21.02L12,17.77L5.82,21.02L7,14.14L2,9.27L8.91,8.26L12,2Z"
      />
    </svg>
  </motion.div>
);

const DecorationBorder = () => (
  <div className="absolute inset-0 rounded-xl opacity-10 pointer-events-none">
    <div className="absolute top-0 left-0 w-20 h-20 border-t-2 border-l-2 border-[#ba1a5d] rounded-tl-xl"></div>
    <div className="absolute top-0 right-0 w-20 h-20 border-t-2 border-r-2 border-[#ba1a5d] rounded-tr-xl"></div>
    <div className="absolute bottom-0 left-0 w-20 h-20 border-b-2 border-l-2 border-[#ba1a5d] rounded-bl-xl"></div>
    <div className="absolute bottom-0 right-0 w-20 h-20 border-b-2 border-r-2 border-[#ba1a5d] rounded-br-xl"></div>
  </div>
);

const WishlistPage = () => {
  const [items, setItems] = useState(wishlistItems);
  const [activeFilter, setActiveFilter] = useState('all');
  const [showEmptyMessage, setShowEmptyMessage] = useState(false);
  const [sortBy, setSortBy] = useState('newest');
  const [showConfetti, setShowConfetti] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [isItemDetailOpen, setIsItemDetailOpen] = useState(false);
  const [hoveredColor, setHoveredColor] = useState(null);
  const motionContainerRef = useRef(null);
  const navigate = useNavigate();

  // Enhanced interaction - color hover effect on cards
  const handleColorHover = (color) => {
    setHoveredColor(color);
  };

  // Reset color hover effect
  const handleColorLeave = () => {
    setHoveredColor(null);
  };

  // Filter and sort items
  const filteredItems = items.filter(item => {
    if (activeFilter === 'all') return true;
    if (activeFilter === 'instock') return item.inStock;
    return item.category.toLowerCase() === activeFilter.toLowerCase();
  });

  const sortedItems = [...filteredItems].sort((a, b) => {
    if (sortBy === 'newest') {
      return new Date(b.dateAdded) - new Date(a.dateAdded);
    } else if (sortBy === 'oldest') {
      return new Date(a.dateAdded) - new Date(b.dateAdded);
    } else if (sortBy === 'price-high') {
      return parseInt(b.price.replace(/[^\d]/g, '')) - parseInt(a.price.replace(/[^\d]/g, ''));
    } else if (sortBy === 'price-low') {
      return parseInt(a.price.replace(/[^\d]/g, '')) - parseInt(b.price.replace(/[^\d]/g, ''));
    }
    return 0;
  });

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.3
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { 
        type: "spring",
        stiffness: 50,
        damping: 10
      }
    }
  };

  // Handle opening item detail view
  const openItemDetail = (item) => {
    setSelectedItem(item);
    setIsItemDetailOpen(true);
  };

  // Handle closing item detail view
  const closeItemDetail = useCallback(() => {
    setIsItemDetailOpen(false);
    setTimeout(() => setSelectedItem(null), 300);
  }, []);

  // Handle removing item from wishlist with improved error handling
  const removeFromWishlist = useCallback((id) => {
    try {
      // Log to help with debugging
      console.log(`Removing item with id: ${id}`);
      
      if (!id) {
        console.error("No item ID provided to removeFromWishlist");
        return;
      }
      
      // Create a new array without the item to be removed
      const updatedItems = items.filter(item => item.id !== id);
      
      // Log the updated array
      console.log('Updated items:', updatedItems);
      
      // Update state with the new array
      setItems(updatedItems);
      
      // Show empty message if needed
      if (updatedItems.length === 0) {
        setShowEmptyMessage(true);
      }
      
      // Close detail view if it's the item being removed
      if (selectedItem && selectedItem.id === id) {
        closeItemDetail();
      }
    } catch (error) {
      console.error("Error in removeFromWishlist:", error);
    }
  }, [items, selectedItem, closeItemDetail]);

  // Handle moving to cart with confetti animation
  const moveToCart = useCallback((id) => {
    try {
      // Log to help with debugging
      console.log(`Moving item ${id} to cart`);
      
      // Show confetti animation
      setShowConfetti(true);
      
      // First update the UI to reflect item moving to cart
      // We don't remove it immediately to allow for the animation
      const item = items.find(item => item.id === id);
      if (item) {
        // Clone the item to avoid direct state mutation
        const updatedItem = { ...item, isMovingToCart: true };
        const updatedItems = items.map(i => (i.id === id ? updatedItem : i));
        setItems(updatedItems);
      } else {
        console.error(`Item with id ${id} not found`);
      }
      
      // Use a more reliable approach with setTimeout
      setTimeout(() => {
        try {
          // After animation, remove item from wishlist
          removeFromWishlist(id);
          // Reset animation state
          setShowConfetti(false);
          
          // Navigate to cart page
          navigate('/cart');
        } catch (error) {
          console.error("Error in moveToCart timeout:", error);
          setShowConfetti(false);
        }
      }, 1000);
    } catch (error) {
      console.error("Error in moveToCart:", error);
      setShowConfetti(false);
    }
  }, [items, removeFromWishlist, navigate]);

  return (
    <div className="min-h-screen py-16 px-4 relative overflow-hidden bg-gradient-to-br from-pink-50 via-purple-50 to-indigo-50">
      {/* Background decorations - enhanced */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <ColorfulOrbs count={8} />
        <PaislayPattern top={15} left={8} size={120} rotation={20} />
        <PaislayPattern top={65} left={85} size={150} rotation={-15} />
        <PaislayPattern top={40} left={60} size={80} rotation={45} opacity={0.05} />
      </div>
      
      <WishlistConfetti trigger={showConfetti} />
      
      <div className="container mx-auto max-w-6xl relative z-10">
        {/* Page header with animation */}
        <motion.div 
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl md:text-5xl font-serif text-gray-900 relative inline-block">
            Your Wishlist
            <motion.div 
              initial={{ width: 0 }}
              animate={{ width: '100%' }}
              transition={{ delay: 0.8, duration: 0.6 }}
              className="absolute bottom-0 left-0 h-1 bg-[#ba1a5d]/40"
            />
          </h1>
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="text-gray-600 mt-4 max-w-2xl mx-auto"
          >
            Your curated collection of dream pieces. Each item is specially saved for when you're ready to make them yours.
          </motion.p>
        </motion.div>
        
        {/* Stats Component */}
        <WishlistStats items={items} />
        
        {/* Filters and sorting */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="flex flex-col md:flex-row justify-between items-center mb-8 bg-white/80 backdrop-blur-sm rounded-xl p-5 shadow-sm relative overflow-hidden"
        >
          <WishlistDecorativeBorder />
          
          <div className="flex flex-wrap gap-2 mb-4 md:mb-0">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setActiveFilter('all')}
              className={`px-4 py-2 rounded-full text-sm font-medium ${
                activeFilter === 'all' 
                  ? 'bg-[#ba1a5d] text-white shadow-md' 
                  : 'bg-white text-gray-700 border border-gray-200 hover:border-[#ba1a5d]/50'
              }`}
            >
              All Items
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setActiveFilter('instock')}
              className={`px-4 py-2 rounded-full text-sm font-medium ${
                activeFilter === 'instock' 
                  ? 'bg-[#ba1a5d] text-white shadow-md' 
                  : 'bg-white text-gray-700 border border-gray-200 hover:border-[#ba1a5d]/50'
              }`}
            >
              In Stock
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setActiveFilter('sarees')}
              className={`px-4 py-2 rounded-full text-sm font-medium ${
                activeFilter === 'sarees' 
                  ? 'bg-[#ba1a5d] text-white shadow-md' 
                  : 'bg-white text-gray-700 border border-gray-200 hover:border-[#ba1a5d]/50'
              }`}
            >
              Sarees
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setActiveFilter('lehengas')}
              className={`px-4 py-2 rounded-full text-sm font-medium ${
                activeFilter === 'lehengas' 
                  ? 'bg-[#ba1a5d] text-white shadow-md' 
                  : 'bg-white text-gray-700 border border-gray-200 hover:border-[#ba1a5d]/50'
              }`}
            >
              Lehengas
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setActiveFilter('suits')}
              className={`px-4 py-2 rounded-full text-sm font-medium ${
                activeFilter === 'suits' 
                  ? 'bg-[#ba1a5d] text-white shadow-md' 
                  : 'bg-white text-gray-700 border border-gray-200 hover:border-[#ba1a5d]/50'
              }`}
            >
              Suits
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setActiveFilter('kurtis')}
              className={`px-4 py-2 rounded-full text-sm font-medium ${
                activeFilter === 'kurtis' 
                  ? 'bg-[#ba1a5d] text-white shadow-md' 
                  : 'bg-white text-gray-700 border border-gray-200 hover:border-[#ba1a5d]/50'
              }`}
            >
              Kurtis
            </motion.button>
          </div>
          
          <div className="relative">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="appearance-none bg-white border border-gray-200 rounded-full py-2 pl-4 pr-10 text-sm font-medium text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#ba1a5d]/30 focus:border-[#ba1a5d]/50"
            >
              <option value="newest">Newest First</option>
              <option value="oldest">Oldest First</option>
              <option value="price-high">Price: High to Low</option>
              <option value="price-low">Price: Low to High</option>
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
              <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/>
              </svg>
            </div>
          </div>
        </motion.div>
        
        {/* Items grid with animation */}
        <AnimatePresence mode="popLayout">
          {sortedItems.length > 0 ? (
            <motion.div
              ref={motionContainerRef}
              key="wishlist-items"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8"
            >
              {sortedItems.map((item) => (
                <motion.div 
                  key={item.id}
                  layout
                  variants={itemVariants}
                  exit={{ 
                    opacity: 0, 
                    scale: 0.8,
                    transition: { duration: 0.4 }
                  }}
                  className="bg-white rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 relative group h-full"
                  style={{
                    background: hoveredColor ? `linear-gradient(to bottom, white, ${hoveredColor}15)` : 'white'
                  }}
                  layoutId={`wishlist-item-${item.id}`}
                >
                  {/* Item image container */}
                  <div 
                    className="relative h-72 overflow-hidden cursor-pointer"
                    onClick={(e) => {
                      e.stopPropagation();
                      openItemDetail(item);
                    }}
                  >
                    <img 
                      src={item.image}
                      alt={item.name}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                    
                    {/* Overlay */}
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    
                    {/* Category badge */}
                    <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm text-[#ba1a5d] text-xs px-3 py-1 rounded-full font-medium shadow-sm z-10">
                      {item.category}
                    </div>
                    
                    {/* In-stock badge */}
                    <div className={`absolute top-3 right-3 ${item.inStock ? 'bg-emerald-500' : 'bg-amber-500'} text-white text-xs px-3 py-1 rounded-full font-medium shadow-sm z-10`}>
                      {item.inStock ? 'In Stock' : 'Out of Stock'}
                    </div>
                    
                    {/* Heart button */}
                    <button
                      type="button"
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        console.log('Heart button clicked for item:', item.id);
                        removeFromWishlist(item.id);
                      }}
                      className="absolute top-12 right-3 text-[#ba1a5d] bg-white rounded-full p-2 shadow-md hover:shadow-lg hover:scale-110 active:scale-90 transition-all duration-200 cursor-pointer z-20"
                    >
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"></path>
                      </svg>
                    </button>
                  </div>
                  
                  {/* Item details */}
                  <div className="p-4">
                    <h3 
                      className="text-lg font-serif text-gray-900 mb-1 cursor-pointer hover:text-[#ba1a5d] transition-colors duration-300" 
                      onClick={() => openItemDetail(item)}
                    >
                      {item.name}
                    </h3>
                    <p className="text-[#ba1a5d] font-medium">{item.price}</p>
                    
                    {/* Colors */}
                    <div className="mt-3">
                      <p className="text-xs text-gray-500 mb-1.5">Available Colors:</p>
                      <div className="flex space-x-2">
                        {item.colors.map((color, index) => (
                          <motion.div
                            key={index}
                            whileHover={{ y: -3, scale: 1.2 }}
                            whileTap={{ scale: 0.9 }}
                            onHoverStart={() => handleColorHover(color)}
                            onHoverEnd={handleColorLeave}
                            className="w-6 h-6 rounded-full cursor-pointer shadow-sm relative"
                            style={{ backgroundColor: color }}
                          >
                            {hoveredColor === color && (
                              <motion.div
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                className="absolute -top-1 -right-1 w-3 h-3 bg-white rounded-full border border-gray-200"
                              />
                            )}
                          </motion.div>
                        ))}
                      </div>
                    </div>
                    
                    {/* Date added */}
                    <div className="mt-4 flex items-center text-xs text-gray-500">
                      <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                      </svg>
                      <span>Added on {new Date(item.dateAdded).toLocaleDateString()}</span>
                    </div>
                    
                    {/* Action buttons */}
                    <div className="mt-4 flex flex-col gap-2">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          console.log('Move to cart button clicked for item:', item.id);
                          moveToCart(item.id);
                        }}
                        className="w-full bg-[#ba1a5d] text-white text-sm py-2 rounded-full font-medium shadow-lg hover:bg-[#a0154e] hover:scale-105 active:scale-95 transition-all duration-200 cursor-pointer"
                      >
                        Move to Cart
                      </button>
                      
                      <button
                        type="button"
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          console.log('Remove button clicked for item:', item.id);
                          removeFromWishlist(item.id);
                        }}
                        className="w-full text-gray-700 text-sm py-1.5 rounded-full border border-gray-300 hover:border-[#ba1a5d] hover:text-[#ba1a5d] hover:scale-105 active:scale-95 transition-all duration-200 cursor-pointer"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          ) : (
            <motion.div
              key="empty-wishlist"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5 }}
              className="text-center py-20"
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 100, delay: 0.3 }}
                className="inline-block mb-6 text-[#ba1a5d]"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="w-24 h-24 mx-auto" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12,21.35L10.55,20.03C5.4,15.36 2,12.27 2,8.5C2,5.41 4.42,3 7.5,3C9.24,3 10.91,3.81 12,5.08C13.09,3.81 14.76,3 16.5,3C19.58,3 22,5.41 22,8.5C22,12.27 18.6,15.36 13.45,20.03L12,21.35Z" />
                </svg>
              </motion.div>
              <h2 className="text-2xl font-serif text-gray-800 mb-3">Your wishlist is empty</h2>
              <p className="text-gray-600 mb-8 max-w-md mx-auto">Add items to your wishlist as you explore our collections. We'll save them here for you.</p>
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Link 
                  to="/category/sarees" 
                  className="inline-flex items-center px-6 py-3 bg-[#ba1a5d] text-white rounded-full shadow-md hover:bg-[#a0154e] transition-colors duration-300"
                >
                  <span>Explore Collections</span>
                  <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path>
                  </svg>
                </Link>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
        
        {/* Add Share component */}
        <WishlistShare />
        
        {/* Item detail modal */}
        <AnimatePresence>
          {isItemDetailOpen && selectedItem && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50"
              onClick={closeItemDetail}
            >
              <motion.div
                initial={{ scale: 0.9, y: 20 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.9, y: 20 }}
                transition={{ type: "spring", damping: 25 }}
                className="bg-white rounded-xl overflow-hidden max-w-4xl w-full max-h-[90vh] overflow-y-auto"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="grid grid-cols-1 md:grid-cols-2">
                  <div className="relative h-[60vh] overflow-hidden">
                    <img
                      src={selectedItem.image}
                      alt={selectedItem.name}
                      className="w-full h-full object-cover"
                    />
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={closeItemDetail}
                      className="absolute top-4 right-4 bg-white/80 p-2 rounded-full"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </motion.button>
                  </div>
                  <div className="p-6">
                    <h2 className="text-2xl font-serif text-gray-900 mb-2">{selectedItem.name}</h2>
                    <p className="text-xl text-[#ba1a5d] font-medium mb-4">{selectedItem.price}</p>
                    
                    <div className="mb-6">
                      <h3 className="text-sm text-gray-600 mb-2">Category</h3>
                      <p className="font-medium">{selectedItem.category}</p>
                    </div>
                    
                    <div className="mb-6">
                      <h3 className="text-sm text-gray-600 mb-2">Available Colors</h3>
                      <div className="flex space-x-3">
                        {selectedItem.colors.map((color, index) => (
                          <motion.div
                            key={index}
                            whileHover={{ scale: 1.2 }}
                            whileTap={{ scale: 0.9 }}
                            className="w-8 h-8 rounded-full cursor-pointer shadow-sm"
                            style={{ backgroundColor: color }}
                          />
                        ))}
                      </div>
                    </div>
                    
                    <div className="mb-6">
                      <h3 className="text-sm text-gray-600 mb-2">Availability</h3>
                      <p className={`font-medium ${selectedItem.inStock ? 'text-emerald-600' : 'text-amber-600'}`}>
                        {selectedItem.inStock ? 'In Stock' : 'Out of Stock'}
                      </p>
                    </div>
                    
                    <div className="mb-6">
                      <h3 className="text-sm text-gray-600 mb-2">Added On</h3>
                      <p className="font-medium">{new Date(selectedItem.dateAdded).toLocaleDateString()}</p>
                    </div>
                    
                    <div className="flex space-x-4 mt-8">
                      <ShimmerButton
                        onClick={(e) => {
                          e.stopPropagation();
                          moveToCart(selectedItem.id);
                          closeItemDetail();
                        }}
                        className="flex-1 bg-[#ba1a5d] text-white py-3 rounded-full font-medium shadow-md hover:bg-[#a0154e] hover:shadow-lg hover:scale-[1.03] active:scale-[0.97] transition-all duration-200 cursor-pointer select-none transform"
                      >
                        Move to Cart
                      </ShimmerButton>
                      
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          removeFromWishlist(selectedItem.id);
                          closeItemDetail();
                        }}
                        className="px-4 py-3 border border-gray-300 rounded-full hover:border-[#ba1a5d] hover:text-[#ba1a5d] hover:shadow hover:scale-[1.03] active:scale-[0.97] transition-all duration-200 cursor-pointer select-none transform"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default WishlistPage; 