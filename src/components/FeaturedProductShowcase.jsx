import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, ShoppingCart, Zap } from 'lucide-react';
import { Link, useSearchParams } from 'react-router-dom';
import { useWishlist } from '../contexts/WishlistContext';
import { useCart } from '../contexts/CartContext';
import { useToast } from '../hooks/use-toast';
import { supabaseService } from '../services/supabaseService';

// Enhanced SVG Motifs and Patterns
const PatternBorder = ({ className }) => (
  <svg viewBox="0 0 300 20" className={`${className} text-pink`}>
    <pattern id="patternBorder" patternUnits="userSpaceOnUse" width="20" height="20">
      <circle cx="10" cy="10" r="2" fill="currentColor" opacity="0.3" />
    </pattern>
    <rect width="300" height="20" fill="url(#patternBorder)" />
    <rect x="125" y="8" width="50" height="4" fill="currentColor" opacity="0.5" />
  </svg>
);

const PeacockMotif = ({ className }) => (
  <svg viewBox="0 0 100 120" className={`${className} text-pink`}>
    <g opacity="0.15">
      <path d="M50,80 L50,110" stroke="currentColor" strokeWidth="1.2" />
      <path d="M50,80 Q60,65 50,50 Q40,65 50,80" fill="none" stroke="currentColor" strokeWidth="0.8" />
      <path d="M50,80 Q70,70 80,80 Q70,90 50,80" fill="none" stroke="currentColor" strokeWidth="0.8" />
      <path d="M50,80 Q75,60 80,40 Q65,60 50,80" fill="none" stroke="currentColor" strokeWidth="0.8" />
      <path d="M50,80 Q65,40 50,20 Q35,40 50,80" fill="none" stroke="currentColor" strokeWidth="0.8" />
      <path d="M50,80 Q30,70 20,80 Q30,90 50,80" fill="none" stroke="currentColor" strokeWidth="0.8" />
      <path d="M50,80 Q25,60 20,40 Q35,60 50,80" fill="none" stroke="currentColor" strokeWidth="0.8" />
      <circle cx="50" cy="80" r="5" fill="none" stroke="currentColor" strokeWidth="0.8" />
    </g>
  </svg>
);

// New Decorative Elements
const FloatingElement = ({ children, delay = 0, duration = 20, top, left, scale = 1 }) => (
  <motion.div
    className="absolute pointer-events-none"
    style={{ top, left, scale }}
    animate={{
      y: [0, -15, 0, 15, 0],
      x: [0, 10, 0, -10, 0],
      rotate: [0, 3, 0, -3, 0],
    }}
    transition={{
      duration,
      repeat: Infinity,
      repeatType: "loop",
      delay,
      ease: "easeInOut"
    }}
  >
    {children}
  </motion.div>
);

const GlowingOrb = ({ size, top, left, color, delay = 0 }) => (
  <motion.div
    className="absolute rounded-full blur-xl opacity-20 pointer-events-none"
    style={{ 
      width: size, 
      height: size, 
      top, 
      left, 
      background: `radial-gradient(circle at center, ${color}, transparent 70%)` 
    }}
    animate={{
      scale: [1, 1.2, 1],
      opacity: [0.2, 0.3, 0.2],
    }}
    transition={{
      duration: 5,
      repeat: Infinity,
      repeatType: "reverse",
      delay,
    }}
  />
);

const DecorativeDivider = () => (
  <div className="flex items-center justify-center my-8 relative">
    <motion.div 
      className="w-16 h-[1px] bg-pink/30"
      initial={{ width: 0 }}
      whileInView={{ width: 64 }}
      viewport={{ once: true }}
      transition={{ duration: 0.8 }}
    />
    <motion.div 
      className="mx-4"
      initial={{ scale: 0, rotate: -180 }}
      whileInView={{ scale: 1, rotate: 0 }}
      viewport={{ once: true }}
      transition={{ 
        duration: 0.6, 
        delay: 0.3,
        type: "spring",
        stiffness: 200
      }}
    >
      <svg width="20" height="20" viewBox="0 0 20 20" className="text-pink">
        <path d="M10,2 L12,8 L18,10 L12,12 L10,18 L8,12 L2,10 L8,8 Z" fill="currentColor" opacity="0.3" />
      </svg>
    </motion.div>
    <motion.div 
      className="w-16 h-[1px] bg-pink/30"
      initial={{ width: 0 }}
      whileInView={{ width: 64 }}
      viewport={{ once: true }}
      transition={{ duration: 0.8 }}
    />
  </div>
);

const PremiumBadge = () => (
  <motion.div
    className="absolute top-6 right-6 z-30"
    initial={{ opacity: 0, scale: 0.8, rotate: -10 }}
    animate={{ opacity: 1, scale: 1, rotate: 0 }}
    transition={{
      type: "spring",
      stiffness: 300,
      damping: 20,
      delay: 1.2
    }}
  >
    <div className="relative">
      <svg width="120" height="120" viewBox="0 0 120 120" className="absolute -inset-1 text-pink">
        <circle cx="60" cy="60" r="40" fill="white" stroke="currentColor" strokeWidth="1.5" />
        <circle cx="60" cy="60" r="48" fill="none" stroke="currentColor" strokeWidth="0.5" strokeDasharray="3 3" opacity="0.5" />
        <circle cx="60" cy="60" r="54" fill="none" stroke="currentColor" strokeWidth="0.5" strokeDasharray="1 5" opacity="0.3" />
      </svg>
      <div className="relative bg-white rounded-full p-3 shadow-md w-20 h-20 flex flex-col items-center justify-center">
        <motion.div
          animate={{ 
            rotate: 360,
          }}
          transition={{ 
            duration: 20, 
            repeat: Infinity, 
            ease: "linear" 
          }}
          className="absolute inset-0 w-full h-full"
        >
          <svg viewBox="0 0 100 100" className="w-full h-full text-pink">
            <defs>
              <path id="circle-premium" d="M 50, 50 m -42, 0 a 42,42 0 1,1 84,0 a 42,42 0 1,1 -84,0" />
            </defs>
            <text fontSize="6.5" fill="#6f0e06" opacity="0.7">
              <textPath xlinkHref="#circle-premium">
                • PREMIUM • HANDCRAFTED • AUTHENTIC • 
              </textPath>
            </text>
          </svg>
        </motion.div>
        <span className="text-pink text-xs font-semibold uppercase tracking-wide">Premium</span>
        <span className="text-pink text-[0.65rem] mt-0.5">Collection</span>
      </div>
    </div>
  </motion.div>
);

const FeaturedProductShowcase = () => {
  const [allProducts, setAllProducts] = useState([]);
  const [currentProductIndex, setCurrentProductIndex] = useState(0);
  const [selectedColorIndex, setSelectedColorIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [loading, setLoading] = useState(true);
  const [searchParams] = useSearchParams();
  const containerRef = useRef(null);
  const intervalRef = useRef(null);
  const { addToWishlist, isInWishlist } = useWishlist();
  const { addToCart } = useCart();
  const { toast } = useToast();

  // Helper function to truncate text
  const truncateText = (text, maxWords) => {
    if (!text) return '';
    const words = text.split(' ');
    if (words.length <= maxWords) return text;
    return words.slice(0, maxWords).join(' ') + '...';
  };

  const currentProduct = allProducts[currentProductIndex];

  useEffect(() => {
    const loadMasterProducts = async () => {
      try {
        setLoading(true);
        const masterProducts = await supabaseService.getMasterProducts();
        if (masterProducts && masterProducts.length > 0) {
          setAllProducts(masterProducts);
          
          // Check if there's a specific product to show from URL
          const featuredId = searchParams.get('featured');
          if (featuredId) {
            const productIndex = masterProducts.findIndex(p => p.id === featuredId);
            if (productIndex !== -1) {
              setCurrentProductIndex(productIndex);
            }
          }
        }
      } catch (error) {
        console.error('Error loading master products:', error);
      } finally {
        setLoading(false);
      }
    };

    loadMasterProducts();
  }, [searchParams]);

  // Auto-cycle through products every 30 seconds if more than 1 product
  useEffect(() => {
    if (allProducts.length > 1) {
      intervalRef.current = setInterval(() => {
        setCurrentProductIndex((prevIndex) => 
          prevIndex === allProducts.length - 1 ? 0 : prevIndex + 1
        );
        setSelectedColorIndex(0); // Reset color selection when changing products
      }, 30000); // 30 seconds

      return () => {
        if (intervalRef.current) {
          clearInterval(intervalRef.current);
        }
      };
    }
  }, [allProducts.length]);

  // Clear interval when user hovers (pause auto-cycle)
  useEffect(() => {
    if (isHovered && intervalRef.current) {
      clearInterval(intervalRef.current);
    } else if (!isHovered && allProducts.length > 1) {
      intervalRef.current = setInterval(() => {
        setCurrentProductIndex((prevIndex) => 
          prevIndex === allProducts.length - 1 ? 0 : prevIndex + 1
        );
        setSelectedColorIndex(0);
      }, 30000);
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isHovered, allProducts.length]);

  useEffect(() => {
    const handleMouseMove = (e) => {
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        setMousePosition({
          x: ((e.clientX - rect.left) / rect.width) * 100,
          y: ((e.clientY - rect.top) / rect.height) * 100,
        });
      }
    };

    const container = containerRef.current;
    if (container) {
      container.addEventListener('mousemove', handleMouseMove);
      return () => container.removeEventListener('mousemove', handleMouseMove);
    }
  }, []);

  const handleAddToWishlist = async () => {
    if (!currentProduct) return;
    
    try {
      const success = await addToWishlist(currentProduct, 'master_product');
      
      if (success) {
        toast({
          title: "Added to Wishlist",
          description: `${currentProduct.name} has been added to your wishlist.`
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to add item to wishlist.",
        variant: "destructive"
      });
    }
  };

  const handleAddToCart = async () => {
    if (!currentProduct) return;
    
    try {
      const success = await addToCart(currentProduct, 1, null, currentColor, 'master_product');
      
      if (success) {
        toast({
          title: "Added to Cart",
          description: `${currentProduct.name} has been added to your cart.`
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to add item to cart.",
        variant: "destructive"
      });
    }
  };

  const handleQuickBuy = async () => {
    await handleAddToCart();
    // Redirect to cart page after adding
    window.location.href = '/cart';
  };

  const handleDotClick = (index) => {
    setCurrentProductIndex(index);
    setSelectedColorIndex(0);
    // Reset the auto-cycle timer
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      if (allProducts.length > 1) {
        intervalRef.current = setInterval(() => {
          setCurrentProductIndex((prevIndex) => 
            prevIndex === allProducts.length - 1 ? 0 : prevIndex + 1
          );
          setSelectedColorIndex(0);
        }, 30000);
      }
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-rose-50 via-white to-pink-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-rose-200 border-t-rose-600 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading featured products...</p>
        </div>
      </div>
    );
  }

  if (!allProducts.length || !currentProduct) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-rose-50 via-white to-pink-50 flex items-center justify-center">
        <div className="text-center">
          <h3 className="text-xl font-semibold text-gray-900 mb-2">No Featured Products</h3>
          <p className="text-gray-600">Please add master products from the admin panel.</p>
        </div>
      </div>
    );
  }

  const currentImage = currentProduct.image_urls?.[selectedColorIndex] || currentProduct.image_urls?.[0] || '';
  const currentVideo = currentProduct.video_urls?.[selectedColorIndex] || currentProduct.video_urls?.[0] || '';
  const currentColor = currentProduct.colors?.[selectedColorIndex] || currentProduct.colors?.[0] || 'Default';
  
  return (
    <motion.section 
      ref={containerRef}
      className="py-20 relative overflow-hidden"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1 }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Enhanced background elements */}
      <div className="absolute inset-0 bg-gradient-to-b from-white via-rose-50/30 to-white opacity-50"></div>
      
      {/* Add a subtle grain texture overlay */}
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIzMDAiIGhlaWdodD0iMzAwIj48ZmlsdGVyIGlkPSJhIiB4PSIwIiB5PSIwIj48ZmVUdXJidWxlbmNlIGJhc2VGcmVxdWVuY3k9Ii43NSIgc3RpdGNoVGlsZXM9InN0aXRjaCIgdHlwZT0iZnJhY3RhbE5vaXNlIi8+PGZlQ29sb3JNYXRyaXggdHlwZT0ic2F0dXJhdGUiIHZhbHVlcz0iMCIvPjwvZmlsdGVyPjxwYXRoIGQ9Ik0wIDBoMzAwdjMwMEgweiIgZmlsdGVyPSJ1cmwoI2EpIiBvcGFjaXR5PSIuMDUiLz48L3N2Zz4=')] opacity-10" />
      
      <div className="absolute inset-0">
        <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-pink/20 to-transparent"></div>
        <div className="absolute bottom-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-pink/20 to-transparent"></div>
        
        <svg className="absolute inset-0 w-full h-full opacity-[0.02]" xmlns="http://www.w3.org/2000/svg">
          <pattern id="ethnicPattern" x="0" y="0" width="50" height="50" patternUnits="userSpaceOnUse">
            <path d="M25,0 L50,25 L25,50 L0,25 Z" fill="none" stroke="#6f0e06" strokeWidth="0.5"/>
            <circle cx="25" cy="25" r="3" fill="#6f0e06" opacity="0.2"/>
            <circle cx="25" cy="25" r="8" fill="none" stroke="#6f0e06" strokeWidth="0.5"/>
          </pattern>
          <rect x="0" y="0" width="100%" height="100%" fill="url(#ethnicPattern)" />
        </svg>
      </div>
      
      {/* Add radial gradient for spotlight effect */}
      <div className="absolute inset-0 bg-radial-gradient opacity-40" />
      
      <GlowingOrb size="400px" top="10%" left="5%" color="#6f0e06" delay={0} />
      <GlowingOrb size="350px" top="60%" left="80%" color="#6f0e06" delay={2} />
      
      {/* Add the premium badge */}
      <PremiumBadge />
      
      <motion.div className="absolute right-0 top-1/4 -rotate-90 opacity-10">
        <PatternBorder className="w-64 h-6" />
      </motion.div>
      
      <motion.div className="absolute left-0 bottom-1/4 rotate-90 opacity-10">
        <PatternBorder className="w-64 h-6" />
      </motion.div>
      
      <FloatingElement top="20%" left="10%" delay={1} duration={15}>
        <PeacockMotif className="w-32 h-32" />
      </FloatingElement>
      
      <FloatingElement top="70%" left="85%" delay={2} duration={18}>
        <PeacockMotif className="w-32 h-32 transform rotate-180" />
      </FloatingElement>
      
      <div className="container mx-auto px-4 relative z-10">
        <motion.div 
          className="text-center max-w-3xl mx-auto mb-16 relative"
        >
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="absolute -top-10 left-1/2 -translate-x-1/2"
          >
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
              className="w-16 h-16 rounded-full flex items-center justify-center"
            >
              <svg viewBox="0 0 100 100" className="w-full h-full text-pink">
                <defs>
                  <path id="circle" d="M 50, 50 m -37, 0 a 37,37 0 1,1 74,0 a 37,37 0 1,1 -74,0" />
                </defs>
                <text fontSize="9" fill="#6f0e06" opacity="0.7">
                  <textPath xlinkHref="#circle">
                    ✧ MASTERPIECE COLLECTION ✧ LUXURY ETHNIC WEAR ✧
                  </textPath>
                </text>
              </svg>
            </motion.div>
          </motion.div>
          
          <motion.h2 
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ 
              duration: 0.8, 
              delay: 0.2, 
              type: "spring",
              stiffness: 100 
            }}
            className="text-4xl md:text-5xl font-serif text-gray-900 mb-2 relative"
          >
            <span className="relative inline-block">
              The 
              <motion.span 
                className="absolute -top-6 -right-4 text-sm text-pink"
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.8, duration: 0.5 }}
              >
                ✦
              </motion.span>
            </span>{" "}
            <span className="relative z-10 inline-block">
              Masterpiece 
              <motion.span
                className="absolute -z-10 bottom-0 left-0 h-3 bg-pink/10 w-full"
                initial={{ width: 0 }}
                whileInView={{ width: "100%" }}
                viewport={{ once: true }}
                transition={{ delay: 1, duration: 0.6 }}
              />
            </span>{" "}
            Collection
          </motion.h2>
          
          <motion.div 
            className="flex justify-center"
            initial={{ opacity: 0, width: 0 }}
            whileInView={{ opacity: 1, width: "auto" }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <div className="w-24 h-[1px] bg-pink mx-auto mb-4"></div>
          </motion.div>
          
          <motion.p 
            className="text-gray-600 text-lg"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.5 }}
          >
            Discover our signature creation, where tradition meets artistry in perfect harmony
          </motion.p>
        </motion.div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12 items-center">
          <div className="order-2 lg:order-1">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="space-y-6"
            >
              <div>
                <div className="flex items-center mb-2">
                  <motion.span 
                    initial={{ opacity: 0, scale: 0.8 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4 }}
                    className="inline-block px-3 py-1 bg-pink/10 text-pink text-xs rounded-full font-medium"
                  >
                    {currentProduct.tag || 'Signature Collection'}
                  </motion.span>
                </div>
                
                <motion.h3 
                  className="text-3xl font-serif text-gray-900 mb-1"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: 0.3 }}
                >
                  {currentProduct.name}
                </motion.h3>
                
                <motion.p 
                  className="text-lg text-gray-600 italic font-light"
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: 0.4 }}
                >
                  {currentProduct.title}
                </motion.p>
                
                <DecorativeDivider />
                
                <motion.p 
                  className="text-gray-700 mb-6 leading-relaxed break-words"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: 0.5 }}
                >
                  {truncateText(currentProduct.description, 30)}
                </motion.p>
                
                {currentProduct.colors && currentProduct.colors.length > 0 && (
                  <motion.div 
                    className="mb-6"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: 0.6 }}
                  >
                    <h4 className="text-sm uppercase tracking-wider text-gray-500 mb-3">Available Colors</h4>
                    <div className="flex space-x-3">
                      {currentProduct.colors.map((color, index) => (
                        <motion.button
                          key={index}
                          onClick={() => setSelectedColorIndex(index)}
                          className={`relative w-8 h-8 rounded-full p-0.5 bg-gray-200 ${selectedColorIndex === index ? 'ring-2 ring-pink ring-offset-2' : ''}`}
                          aria-label={color}
                          whileHover={{ scale: 1.15 }}
                          whileTap={{ scale: 0.95 }}
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.1 * index, duration: 0.3 }}
                        >
                          <div 
                            className="w-full h-full rounded-full"
                            style={{ backgroundColor: index === 0 ? '#6f0e06' : index === 1 ? '#1a56ba' : index === 2 ? '#0F766E' : '#B45309' }}
                          />
                        </motion.button>
                      ))}
                    </div>
                    <motion.p 
                      className="text-sm mt-2 text-gray-600"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.8, duration: 0.5 }}
                    >
                      Selected: <span className="font-medium">{currentColor}</span>
                    </motion.p>
                  </motion.div>
                )}
                
                {currentProduct.special_points && currentProduct.special_points.length > 0 && (
                  <motion.ul 
                    className="space-y-3 mb-8"
                    variants={{
                      hidden: { opacity: 0 },
                      show: {
                        opacity: 1,
                        transition: {
                          staggerChildren: 0.1,
                          delayChildren: 0.3
                        }
                      }
                    }}
                    initial="hidden"
                    whileInView="show"
                    viewport={{ once: true }}
                  >
                    {currentProduct.special_points.map((feature, index) => {
                      console.log(`Special point ${index + 1}:`, feature);
                      return (
                        <motion.li 
                          key={index}
                          variants={{
                            hidden: { opacity: 0, x: -20 },
                            show: { opacity: 1, x: 0 }
                          }}
                          className="flex items-start space-x-3"
                        >
                          <motion.div 
                            className="mt-1 flex-shrink-0 w-5 h-5 rounded-full bg-pink/10 flex items-center justify-center"
                            initial={{ scale: 0 }}
                            whileInView={{ scale: 1 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.3, delay: 0.1 * index }}
                          >
                            <svg className="w-3 h-3 text-pink" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                            </svg>
                          </motion.div>
                          <span className="text-gray-700 leading-relaxed text-sm">
                            Point #{index + 1}: {feature}
                          </span>
                        </motion.li>
                      );
                    })}
                  </motion.ul>
                )}
                
                <motion.div 
                  className="flex items-end mb-6"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: 0.8 }}
                >
                  <motion.span 
                    className="text-3xl font-bold text-pink"
                    whileHover={{ scale: 1.05 }}
                    transition={{ type: "spring", stiffness: 400 }}
                  >
                    ₹{currentProduct.price}
                  </motion.span>
                </motion.div>
                
                <motion.div 
                  className="flex flex-wrap gap-4"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: 0.9 }}
                >
                  <motion.button
                    onClick={handleAddToCart}
                    whileHover={{ 
                      scale: 1.05, 
                      boxShadow: "0 10px 15px -3px rgba(111, 14, 6, 0.3)" 
                    }}
                    whileTap={{ scale: 0.98 }}
                    className="relative px-8 py-3 bg-pink text-white rounded-md flex items-center justify-center overflow-hidden group"
                  >
                    <motion.span
                      className="absolute inset-0 bg-gradient-to-r from-[#6f0e06] via-pink-600 to-[#6f0e06] opacity-0 group-hover:opacity-100"
                      initial={{ x: "-100%" }}
                      whileHover={{ x: "100%" }}
                      transition={{ duration: 1, repeat: Infinity, repeatType: "loop" }}
                    />
                    <ShoppingCart className="w-5 h-5 mr-2 relative z-10" />
                    <span className="relative z-10">Add to Cart</span>
                  </motion.button>

                  <motion.button
                    onClick={handleQuickBuy}
                    whileHover={{ 
                      scale: 1.05, 
                      boxShadow: "0 10px 15px -3px rgba(111, 14, 6, 0.2)" 
                    }}
                    whileTap={{ scale: 0.98 }}
                    className="relative px-8 py-3 bg-white text-pink border-2 border-pink rounded-md flex items-center justify-center overflow-hidden group hover:bg-pink hover:text-white transition-colors duration-300"
                  >
                    <Zap className="w-5 h-5 mr-2" />
                    <span>Quick Buy</span>
                  </motion.button>

                  <motion.button
                    onClick={handleAddToWishlist}
                    whileHover={{ 
                      scale: 1.1,
                      rotate: 5
                    }}
                    whileTap={{ scale: 0.9 }}
                    className={`p-3 rounded-full border-2 transition-colors duration-300 ${
                      isInWishlist(currentProduct.id, 'master_product')
                        ? 'bg-pink text-white border-pink' 
                        : 'bg-white text-pink border-pink hover:bg-pink hover:text-white'
                    }`}
                  >
                    <Heart className={`w-5 h-5 ${isInWishlist(currentProduct.id, 'master_product') ? 'fill-current' : ''}`} />
                  </motion.button>
                </motion.div>
              </div>
            </motion.div>
          </div>
          
          <div className="order-1 lg:order-2">
            <div className="relative aspect-[3/4] overflow-hidden rounded-lg">
              {/* 3D Card Effect Container */}
              <motion.div
                className="w-full h-full relative rounded-lg shadow-2xl transform-gpu perspective-1000"
                style={{ 
                  transformStyle: "preserve-3d", 
                  transform: "rotateY(10deg) rotateX(5deg)"
                }}
                whileHover={{ 
                  scale: 1.02,
                  rotateY: 0,
                  rotateX: 0
                }}
                transition={{ 
                  type: "spring", 
                  stiffness: 300, 
                  damping: 20 
                }}
              >
                {/* Main product image with transition effects */}
                <AnimatePresence mode="wait">
                  <motion.div
                    key={selectedColorIndex}
                    initial={{ opacity: 0, scale: 1.1 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ duration: 0.5 }}
                    className="absolute inset-0"
                  >
                    <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent z-10" />
                    {currentVideo && (
                      <video 
                        src={currentVideo} 
                        alt={`${currentProduct.name} in ${currentColor}`}
                        className="w-full h-full object-cover"
                        muted
                        loop
                        autoPlay
                      />
                    )}
                    {currentImage && (
                      <img 
                        src={currentImage} 
                        alt={`${currentProduct.name} in ${currentColor}`}
                        className={`w-full h-full object-cover ${currentVideo ? 'absolute inset-0 -z-10' : ''}`}
                      />
                    )}
                    
                    {/* Shimmering overlay effect */}
                    <motion.div 
                      className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/30 to-white/0 z-20"
                      initial={{ x: "-100%" }}
                      animate={{ x: "200%" }}
                      transition={{ 
                        duration: 1.5, 
                        repeat: Infinity, 
                        repeatDelay: 5,
                        ease: "easeInOut"
                      }}
                    />
                  </motion.div>
                </AnimatePresence>
                
                {/* Interactive hover effects */}
                <motion.div 
                  className="absolute inset-0 z-20 opacity-0 hover:opacity-100 transition-opacity duration-300"
                  whileHover={{ opacity: 1 }}
                >
                  <div className="absolute inset-x-0 bottom-0 p-5 bg-gradient-to-t from-black/80 to-transparent">
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      whileHover={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      <p className="text-white font-medium text-lg">{currentProduct.name}</p>
                      <p className="text-white/80 text-sm">{currentColor}</p>
                    </motion.div>
                  </div>
                </motion.div>
                
                {/* Product Highlights with enhanced animations */}
                <motion.div
                  initial={{ opacity: 0, scale: 0.8, y: -20 }}
                  whileInView={{ opacity: 1, scale: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.3, duration: 0.5 }}
                  className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm p-2 rounded-lg shadow-lg z-30"
                >
                  <motion.div
                    animate={{ rotate: [0, 10, 0, -10, 0] }}
                    transition={{ duration: 5, repeat: Infinity, repeatDelay: 2 }}
                  >
                    <svg className="w-6 h-6 text-amber-500" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                    </svg>
                  </motion.div>
                  <span className="text-xs font-medium block mt-1 text-center">Premium</span>
                </motion.div>
                
                {/* Decorative Corner Elements */}
                <div className="absolute top-0 left-0 w-20 h-20 overflow-hidden z-20">
                  <div className="absolute top-0 left-0 w-5 h-full bg-gradient-to-r from-[#6f0e06]/40 to-transparent"></div>
                  <div className="absolute top-0 left-0 h-5 w-full bg-gradient-to-b from-[#6f0e06]/40 to-transparent"></div>
                </div>
                <div className="absolute bottom-0 right-0 w-20 h-20 overflow-hidden z-20">
                  <div className="absolute bottom-0 right-0 w-5 h-full bg-gradient-to-l from-[#6f0e06]/40 to-transparent"></div>
                  <div className="absolute bottom-0 right-0 h-5 w-full bg-gradient-to-t from-[#6f0e06]/40 to-transparent"></div>
                </div>
              </motion.div>
            </div>
            
            {/* Enhanced Thumbnail Navigation */}
            {currentProduct.image_urls && currentProduct.image_urls.length > 1 && (
              <div className="flex justify-center mt-6 space-x-3">
                {currentProduct.image_urls.map((imageUrl, index) => (
                  <motion.button
                    key={index}
                    whileHover={{ y: -4, boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1)" }}
                    whileTap={{ scale: 0.95 }}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ 
                      delay: 0.2 + (index * 0.1), 
                      duration: 0.4,
                      y: { type: "spring", stiffness: 300, damping: 20 }
                    }}
                    onClick={() => setSelectedColorIndex(index)}
                    className={`relative rounded-md overflow-hidden w-16 h-16 ${selectedColorIndex === index ? 'ring-2 ring-[#6f0e06]' : 'ring-1 ring-gray-200'}`}
                  >
                    <img 
                      src={imageUrl} 
                      alt={`View ${index + 1}`} 
                      className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
                    />
                  </motion.button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Dot Indicators for Product Navigation */}
        {allProducts.length > 1 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.4, duration: 0.5 }}
            className="mt-16 flex justify-center space-x-3"
          >
            {allProducts.map((_, index) => (
              <motion.button
                key={index}
                onClick={() => handleDotClick(index)}
                className={`w-3 h-3 rounded-full transition-all duration-300 ${
                  index === currentProductIndex 
                    ? 'bg-[#6f0e06] w-8' 
                    : 'bg-gray-300 hover:bg-gray-400'
                }`}
                whileHover={{ scale: 1.2 }}
                whileTap={{ scale: 0.9 }}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.1 * index, duration: 0.3 }}
              />
            ))}
          </motion.div>
        )}

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.6, duration: 0.5 }}
          className="mt-8 text-center"
        >
          <div className="inline-block relative">
            <motion.div>
              <Link 
                to="/signature-collection"
                className="inline-flex items-center px-8 py-3 border-2 border-[#6f0e06] text-[#6f0e06] hover:bg-[#6f0e06] hover:text-white transition-all duration-300 rounded-md group relative overflow-hidden"
              >
              <motion.div
                className="absolute inset-0 w-full h-full bg-gradient-to-r from-[#6f0e06]/0 via-[#6f0e06]/30 to-[#6f0e06]/0"
                initial={{ x: "-100%" }}
                whileHover={{ x: "100%" }}
                transition={{ duration: 0.6 }}
              />
              <span className="relative z-10">Explore Signature Collection</span>
              <motion.svg 
                className="w-5 h-5 ml-2 relative z-10 transform" 
                whileHover={{ x: 3 }}
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path>
              </motion.svg>
              </Link>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </motion.section>
  );
};

export default FeaturedProductShowcase;