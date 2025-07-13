import { motion, AnimatePresence } from 'framer-motion';
import { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import ProductQuickView from '../components/ProductQuickView';

// Sample data for Lehengas products
const products = [
  {
    id: 'l1',
    name: 'Royal Bridal Velvet',
    price: '₹ 45,999',
    image: 'https://images.unsplash.com/photo-1601571115502-83ca3095735b?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8TGVoZW5nYXxlbnwwfDB8MHx8fDA%3D',
    colors: ['#B45309', '#92400E', '#78350F', '#451A03'],
    tags: ['bridal', 'velvet', 'premium'],
    badge: 'Bridal',
    discount: '10% Off'
  },
  {
    id: 'l2',
    name: 'Regal Embroidered',
    price: '₹ 38,499',
    image: 'https://images.unsplash.com/photo-1595034460802-288abd1892d2?q=80&w=3270&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    colors: ['#B91C1C', '#7F1D1D', '#991B1B', '#FEF2F2'],
    tags: ['wedding', 'silk', 'premium'],
    badge: 'Premium'
  },
  {
    id: 'l3',
    name: 'Celebration Zari',
    price: '₹ 28,299',
    image: 'https://images.unsplash.com/photo-1596005554384-d293674c91d7?q=80&w=3087&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    colors: ['#FDE68A', '#FCD34D', '#F59E0B', '#D97706'],
    tags: ['festive', 'zari', 'handcrafted'],
    discount: '15% Off'
  },
  {
    id: 'l4',
    name: 'Contemporary Fusion',
    price: '₹ 22,499',
    image: 'https://images.unsplash.com/photo-1631233859285-faeb10ae4c82?q=80&w=3087&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    colors: ['#155E75', '#164E63', '#0E7490', '#0891B2'],
    tags: ['modern', 'reception', 'designer'],
    badge: 'Designer'
  },
  {
    id: 'l5',
    name: 'Heritage Collection',
    price: '₹ 36,899',
    image: 'https://images.unsplash.com/photo-1594387305326-25403e1ce380?q=80&w=3087&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    colors: ['#6D28D9', '#5B21B6', '#4C1D95', '#7C3AED'],
    tags: ['heritage', 'traditional', 'premium'],
    badge: 'Heritage',
    discount: '20% Off'
  },
  {
    id: 'l6',
    name: 'Sangeet Special',
    price: '₹ 32,499',
    image: 'https://images.unsplash.com/photo-1656428851804-1defa9f8a86d?q=80&w=3087&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    colors: ['#047857', '#065F46', '#059669', '#10B981'],
    tags: ['sangeet', 'party', 'designer'],
    badge: 'Limited Edition'
  },
];

// Enhanced decorative SVG Components
const MandalaPattern = ({ className }) => (
  <svg className={className} viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
    <circle cx="100" cy="100" r="80" fill="none" stroke="currentColor" strokeWidth="1" />
    <circle cx="100" cy="100" r="60" fill="none" stroke="currentColor" strokeWidth="1" />
    <circle cx="100" cy="100" r="40" fill="none" stroke="currentColor" strokeWidth="1" />
    <path d="M100,20 L100,180 M20,100 L180,100 M30,30 L170,170 M30,170 L170,30" stroke="currentColor" strokeWidth="0.5" />
    <path d="M100,40 L120,100 L100,160 L80,100 Z" fill="none" stroke="currentColor" strokeWidth="0.5" />
    <path d="M40,100 L100,120 L160,100 L100,80 Z" fill="none" stroke="currentColor" strokeWidth="0.5" />
  </svg>
);

const FloralPattern = ({ className }) => (
  <svg className={className} viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
    <g fill="none" stroke="currentColor" strokeWidth="0.8">
      <path d="M50,20 C60,30 60,40 50,50 C40,40 40,30 50,20" />
      <path d="M50,20 C40,30 40,40 50,50 C60,40 60,30 50,20" />
      <path d="M20,50 C30,60 40,60 50,50 C40,40 30,40 20,50" />
      <path d="M20,50 C30,40 40,40 50,50 C40,60 30,60 20,50" />
      <path d="M50,80 C60,70 60,60 50,50 C40,60 40,70 50,80" />
      <path d="M50,80 C40,70 40,60 50,50 C60,60 60,70 50,80" />
      <path d="M80,50 C70,60 60,60 50,50 C60,40 70,40 80,50" />
      <path d="M80,50 C70,40 60,40 50,50 C60,60 70,60 80,50" />
      <circle cx="50" cy="50" r="5" />
    </g>
  </svg>
);

// New decorative elements
const GoldenBorder = ({ className }) => (
  <svg className={className} viewBox="0 0 200 20" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="goldGradient" x1="0%" y1="0%" x2="100%" y2="0%">
        <stop offset="0%" stopColor="#92400e" stopOpacity="0.3" />
        <stop offset="50%" stopColor="#f59e0b" stopOpacity="0.6" />
        <stop offset="100%" stopColor="#92400e" stopOpacity="0.3" />
      </linearGradient>
    </defs>
    <rect x="0" y="8" width="200" height="4" fill="url(#goldGradient)" rx="2" />
    <circle cx="100" cy="10" r="6" fill="url(#goldGradient)" />
    <circle cx="50" cy="10" r="3" fill="url(#goldGradient)" />
    <circle cx="150" cy="10" r="3" fill="url(#goldGradient)" />
  </svg>
);

const RoyalBorder = ({ className }) => (
  <svg className={className} viewBox="0 0 200 20" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="royalGradient" x1="0%" y1="0%" x2="100%" y2="0%">
        <stop offset="0%" stopColor="#92400e" stopOpacity="0.3" />
        <stop offset="50%" stopColor="#f59e0b" stopOpacity="0.6" />
        <stop offset="100%" stopColor="#92400e" stopOpacity="0.3" />
      </linearGradient>
    </defs>
    <path d="M0,10 C50,0 150,20 200,10" stroke="url(#royalGradient)" strokeWidth="2" fill="none" />
    <circle cx="0" cy="10" r="3" fill="url(#royalGradient)" />
    <circle cx="200" cy="10" r="3" fill="url(#royalGradient)" />
    <circle cx="100" cy="10" r="5" fill="url(#royalGradient)" />
    <circle cx="50" cy="5" r="2" fill="url(#royalGradient)" />
    <circle cx="150" cy="15" r="2" fill="url(#royalGradient)" />
  </svg>
);

const RoyalEmblem = ({ className }) => (
  <svg className={className} viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="emblemGradient" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#92400e" />
        <stop offset="50%" stopColor="#f59e0b" />
        <stop offset="100%" stopColor="#92400e" />
      </linearGradient>
    </defs>
    <circle cx="50" cy="50" r="40" fill="none" stroke="url(#emblemGradient)" strokeWidth="2" />
    <path d="M50,20 L60,40 L82,40 L65,55 L70,75 L50,65 L30,75 L35,55 L18,40 L40,40 Z" fill="none" stroke="url(#emblemGradient)" strokeWidth="1.5" />
    <circle cx="50" cy="50" r="10" fill="none" stroke="url(#emblemGradient)" strokeWidth="1" />
  </svg>
);

const SparkleEffect = ({ className, delay = 0 }) => (
  <motion.div 
    className={className}
    initial={{ opacity: 0, scale: 0 }}
    animate={{ 
      opacity: [0, 1, 0],
      scale: [0, 1, 0],
      rotate: [0, 90]
    }}
    transition={{
      duration: 2,
      delay,
      repeat: Infinity,
      repeatDelay: 4
    }}
  >
    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M12 2L15 9H22L16 14L18 21L12 17L6 21L8 14L2 9H9L12 2Z" fill="currentColor" />
    </svg>
  </motion.div>
);

const SpinningElement = ({ children, duration = 20, reverse = false }) => (
  <motion.div
    animate={{ 
      rotate: reverse ? [0, -360] : [0, 360]
    }}
    transition={{
      duration,
      repeat: Infinity,
      ease: "linear"
    }}
  >
    {children}
  </motion.div>
);

// Enhanced floating element
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

const ProductCard = ({ product, index }) => {
  const [isQuickViewOpen, setIsQuickViewOpen] = useState(false);
  
  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ 
          duration: 0.5, 
          delay: 0.1 * index,
          type: "spring", 
          stiffness: 100 
        }}
        whileHover={{ 
          y: -8,
          boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)"
        }}
        className="bg-white rounded-lg overflow-hidden shadow-md relative group transition-all duration-300"
      >
        {/* Product image container */}
        <div className="relative aspect-[3/4] overflow-hidden">
          <motion.div
            whileHover={{ scale: 1.05 }}
            transition={{ duration: 0.4 }}
            className="w-full h-full"
          >
            <img 
              src={product.image} 
              alt={product.name} 
              className="w-full h-full object-cover"
            />
          </motion.div>
          
          {/* Gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          
          {/* Decorative border that appears on hover */}
          <div className="absolute inset-0 border border-amber-200/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          
          {/* Corner accents */}
          <div className="absolute top-3 left-3 w-6 h-6 border-t border-l border-amber-300/50 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
          <div className="absolute top-3 right-3 w-6 h-6 border-t border-r border-amber-300/50 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
          <div className="absolute bottom-3 left-3 w-6 h-6 border-b border-l border-amber-300/50 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
          <div className="absolute bottom-3 right-3 w-6 h-6 border-b border-r border-amber-300/50 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
          
          {/* Quick action button */}
          <div className="absolute bottom-4 left-0 right-0 flex justify-center opacity-0 transform translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300">
            <motion.button 
              onClick={() => setIsQuickViewOpen(true)}
              whileHover={{ scale: 1.05 }} 
              whileTap={{ scale: 0.95 }}
              className="bg-white text-amber-600 py-2 px-4 rounded-full text-sm font-medium shadow-lg hover:bg-amber-600 hover:text-white transition-colors duration-300 flex items-center space-x-1"
            >
              <span>Quick View</span>
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
            </motion.button>
          </div>
          
          {/* Badges */}
          {product.badge && (
            <div className="absolute top-3 left-3 bg-amber-600 text-white text-xs px-2 py-1 rounded font-medium z-10">
              {product.badge}
            </div>
          )}
          
          {product.discount && (
            <div className="absolute top-3 right-3 bg-red-500 text-white text-xs px-2 py-1 rounded font-medium z-10">
              {product.discount}
            </div>
          )}
        </div>
        
        {/* Product info */}
        <div className="p-4">
          <div className="flex justify-between items-center mb-1">
            <h3 className="text-lg font-serif text-gray-900 group-hover:text-amber-600 transition-colors duration-300">
              {product.name}
            </h3>
            <motion.button
              whileHover={{ scale: 1.2 }}
              whileTap={{ scale: 0.9 }}
              className="text-gray-400 hover:text-amber-600 transition-colors duration-300"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"></path>
              </svg>
            </motion.button>
          </div>
          
          <div className="flex justify-between items-center mt-2">
            <p className="text-amber-600 font-medium">{product.price}</p>
            <div className="flex items-center space-x-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <svg key={star} className="w-4 h-4 text-amber-400" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
                </svg>
              ))}
            </div>
          </div>
          
          {/* Color options */}
          <div className="mt-3">
            <div className="flex space-x-1">
              {product.colors.map((color, i) => (
                <motion.div 
                  key={i} 
                  whileHover={{ scale: 1.2 }}
                  className="w-5 h-5 rounded-full border border-gray-200 cursor-pointer transition-transform duration-200"
                  style={{ backgroundColor: color }}
                />
              ))}
            </div>
          </div>
          
          {/* Subtle divider */}
          <div className="w-full h-px bg-gray-100 my-3"></div>
          
          {/* Add to cart button */}
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="w-full py-2 mt-1 text-sm font-medium text-gray-600 hover:text-amber-600 bg-gray-50 hover:bg-gray-100 rounded transition-colors duration-300 flex items-center justify-center space-x-1"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"></path>
            </svg>
            <span>Add to Cart</span>
          </motion.button>
        </div>
      </motion.div>
      
      {/* Product Quick View Modal */}
      <ProductQuickView 
        product={product} 
        isOpen={isQuickViewOpen} 
        onClose={() => setIsQuickViewOpen(false)} 
      />
    </>
  );
};

const CategoryLehengas = () => {
  const containerRef = useRef(null);
  const [isHovered, setIsHovered] = useState(false);
  const [scrollYProgress, setScrollYProgress] = useState(0);

  useEffect(() => {
    const updateScrollProgress = () => {
      if (containerRef.current) {
        const { scrollTop, scrollHeight, clientHeight } = containerRef.current;
        setScrollYProgress(scrollTop / (scrollHeight - clientHeight));
      }
    };

    containerRef.current.addEventListener('scroll', updateScrollProgress);
    return () => containerRef.current.removeEventListener('scroll', updateScrollProgress);
  }, []);
  
  const backgroundY = scrollYProgress * 300;
  const opacityTitle = scrollYProgress > 0.2 ? 1 : (scrollYProgress > 0.1 ? 1 : 0);
  const titleY = scrollYProgress > 0.2 ? 0 : (scrollYProgress > 0.1 ? -50 : -100);
  const rotateMandala = scrollYProgress * 360;
  
  return (
    <div ref={containerRef} className="min-h-screen bg-amber-50/30 relative overflow-hidden">
      {/* Enhanced background with animated grain */}
      <motion.div 
        className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIzMDAiIGhlaWdodD0iMzAwIj48ZmlsdGVyIGlkPSJhIiB4PSIwIiB5PSIwIj48ZmVUdXJidWxlbmNlIGJhc2VGcmVxdWVuY3k9Ii43NSIgc3RpdGNoVGlsZXM9InN0aXRjaCIgdHlwZT0iZnJhY3RhbE5vaXNlIi8+PGZlQ29sb3JNYXRyaXggdHlwZT0ic2F0dXJhdGUiIHZhbHVlcz0iMCIvPjwvZmlsdGVyPjxwYXRoIGQ9Ik0wIDBoMzAwdjMwMEgweiIgZmlsdGVyPSJ1cmwoI2EpIiBvcGFjaXR5PSIuMDUiLz48L3N2Zz4=')] opacity-20"
        animate={{ 
          backgroundPosition: ['0% 0%', '100% 100%']
        }}
        transition={{ 
          duration: 60, 
          repeat: Infinity, 
          repeatType: 'reverse',
          ease: "linear"
        }}
      />
      
      {/* Enhanced gradient overlays */}
      <motion.div 
        className="absolute top-0 right-0 w-2/3 h-2/3 bg-gradient-to-bl from-amber-200/20 to-transparent rounded-bl-full -z-10"
        animate={{ 
          opacity: [0.1, 0.3, 0.1],
          scale: [1, 1.05, 1]
        }}
        transition={{ 
          duration: 15, 
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />
      
      <motion.div 
        className="absolute bottom-0 left-0 w-2/3 h-2/3 bg-gradient-to-tr from-amber-200/20 to-transparent rounded-tr-full -z-10"
        animate={{ 
          opacity: [0.1, 0.3, 0.1],
          scale: [1, 1.05, 1]
        }}
        transition={{ 
          duration: 15, 
          repeat: Infinity,
          ease: "easeInOut",
          delay: 7.5
        }}
      />
      
      <motion.div style={{ y: backgroundY }} className="absolute inset-0 -z-10 opacity-5">
        <motion.div style={{ rotate: rotateMandala }}>
          <MandalaPattern className="absolute top-20 left-20 text-amber-600 w-40 h-40" />
        </motion.div>
        <motion.div style={{ rotate: rotateMandala }}>
          <MandalaPattern className="absolute bottom-20 right-20 text-amber-600 w-40 h-40 transform scale-x-[-1]" />
        </motion.div>
        <FloralPattern className="absolute top-1/3 right-40 text-amber-600 w-32 h-32 transform rotate-45" />
        <FloralPattern className="absolute bottom-1/3 left-40 text-amber-600 w-32 h-32 transform -rotate-45" />
      </motion.div>
      
      {/* Enhanced floating elements */}
      <FloatingElement top="15%" left="10%" delay={1} duration={25}>
        <motion.div style={{ rotate: rotateMandala }}>
          <div className="text-amber-700/20 w-40 h-40">
            <MandalaPattern className="w-full h-full" />
          </div>
        </motion.div>
      </FloatingElement>
      
      <FloatingElement top="65%" left="80%" delay={2} duration={20}>
        <div className="text-amber-700/20 w-32 h-32 transform rotate-180">
          <FloralPattern className="w-full h-full" />
        </div>
      </FloatingElement>
      
      {/* Add sparkle effects */}
      <SparkleEffect className="absolute top-[10%] left-[20%] text-amber-400 w-6 h-6 opacity-40" delay={1} />
      <SparkleEffect className="absolute top-[15%] right-[25%] text-amber-400 w-4 h-4 opacity-30" delay={2.5} />
      <SparkleEffect className="absolute bottom-[30%] left-[45%] text-amber-400 w-5 h-5 opacity-50" delay={4} />
      <SparkleEffect className="absolute top-[60%] right-[15%] text-amber-400 w-6 h-6 opacity-40" delay={3} />
      <SparkleEffect className="absolute bottom-[20%] left-[10%] text-amber-400 w-3 h-3 opacity-30" delay={2} />
      
      {/* Hero Banner with Royal Theme - Enhanced */}
      <motion.div 
        style={{ opacity: opacityTitle, y: titleY }}
        className="relative w-full h-[60vh] flex items-center justify-center bg-gradient-to-b from-amber-50/80 to-white/40"
      >
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-b from-transparent to-white/80 z-10"></div>
          <motion.img 
            src="https://images.unsplash.com/photo-1601571115502-83ca3095735b?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8TGVoZW5nYXxlbnwwfDB8MHx8fDA%3D"
            alt="Lehengas Collection" 
            className="w-full h-full object-cover object-center opacity-20"
            initial={{ scale: 1.1 }}
            animate={{ 
              scale: [1.05, 1, 1.05],
              filter: ["brightness(1)", "brightness(1.1)", "brightness(1)"]
            }}
            transition={{ 
              duration: 20, 
              repeat: Infinity, 
              ease: "easeInOut" 
            }}
          />
          
          {/* Add a subtle animated golden overlay */}
          <motion.div 
            className="absolute inset-0 bg-gradient-radial from-amber-400/5 to-transparent"
            animate={{ 
              opacity: [0.3, 0.6, 0.3],
              scale: [1, 1.1, 1]
            }}
            transition={{ 
              duration: 8, 
              repeat: Infinity,
              ease: "easeInOut" 
            }}
          />
        </div>
        
        <div className="container mx-auto px-4 text-center relative z-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <div className="inline-flex items-center justify-center mb-6">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ 
                  duration: 0.6, 
                  type: "spring",
                  stiffness: 200,
                  damping: 15
                }}
                className="relative"
              >
                <SpinningElement duration={40}>
                  <RoyalBorder className="text-amber-600 w-80 h-6 absolute -top-10 left-1/2 transform -translate-x-1/2" />
                </SpinningElement>
                
                <motion.div
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <div className="w-16 h-16 rounded-full border-2 border-amber-200 flex items-center justify-center bg-white relative">
                    {/* Add animated gold ring */}
                    <motion.div 
                      className="absolute inset-0 rounded-full border-2 border-amber-400"
                      animate={{ 
                        scale: [1, 1.15, 1],
                        opacity: [0.5, 0.2, 0.5]
                      }}
                      transition={{ 
                        duration: 3, 
                        repeat: Infinity,
                        ease: "easeInOut" 
                      }}
                    />
                    
                    <div className="w-12 h-12 rounded-full flex items-center justify-center bg-gradient-to-br from-amber-400 to-amber-600 text-white">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                      </svg>
                    </div>
                  </div>
                </motion.div>
              </motion.div>
            </div>
            
            <motion.h1 
              className="text-5xl md:text-6xl font-serif text-gray-900 mb-4 relative"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              <motion.span 
                className="relative inline-block"
                whileHover={{ scale: 1.05 }}
                onHoverStart={() => setIsHovered(true)}
                onHoverEnd={() => setIsHovered(false)}
              >
                Royal
                <motion.span
                  className="absolute -z-10 bottom-2 left-0 h-4 bg-amber-200/40 w-full"
                  initial={{ width: 0 }}
                  animate={{ width: "100%" }}
                  transition={{ delay: 1.2, duration: 0.8 }}
                />
                
                {/* Animated decoration around the heading when hovered */}
                <AnimatePresence>
                  {isHovered && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.8 }}
                      transition={{ duration: 0.3 }}
                      className="absolute -top-8 -left-4 -right-4 -bottom-2 pointer-events-none"
                    >
                      <RoyalEmblem className="absolute top-0 left-0 w-12 h-12 opacity-30" />
                      <RoyalEmblem className="absolute top-0 right-0 w-12 h-12 opacity-30" />
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.span> Lehengas
            </motion.h1>
            
            <motion.p 
              className="text-lg text-gray-600 max-w-2xl mx-auto mb-8"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.6 }}
            >
              Adorn yourself in royal heritage with our exquisite lehenga collection, where each piece is crafted to bring out the regal essence within you. Perfect for weddings and special occasions.
            </motion.p>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.8 }}
              className="flex flex-wrap justify-center gap-4"
            >
              <motion.button 
                className="relative px-6 py-3 bg-gradient-to-r from-amber-500 to-amber-600 text-white rounded-md transition-shadow duration-300 flex items-center overflow-hidden group"
                whileHover={{ scale: 1.03, boxShadow: "0 10px 15px -3px rgba(180, 83, 9, 0.2), 0 4px 6px -4px rgba(180, 83, 9, 0.2)" }}
                whileTap={{ scale: 0.97 }}
              >
                {/* Shimmer effect */}
                <motion.div 
                  className="absolute inset-0 w-20 h-full bg-white/20 -skew-x-30 pointer-events-none"
                  animate={{ 
                    x: [-200, 400]
                  }}
                  transition={{ 
                    duration: 1.5, 
                    repeat: Infinity,
                    repeatDelay: 3,
                    ease: "easeInOut" 
                  }}
                />
                
                <span>Explore Collection</span>
                <motion.svg 
                  className="ml-2 w-5 h-5" 
                  fill="none" 
                  viewBox="0 0 24 24" 
                  stroke="currentColor"
                  animate={{ 
                    x: [0, 4, 0]
                  }}
                  transition={{ 
                    duration: 1.5, 
                    repeat: Infinity,
                    repeatDelay: 3,
                    ease: "easeInOut" 
                  }}
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </motion.svg>
              </motion.button>
              
              <motion.button 
                className="px-6 py-3 border border-amber-500 text-amber-600 rounded-md hover:bg-amber-50 transition-colors duration-300 relative overflow-hidden"
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
              >
                <span className="relative z-10">Bridal Specials</span>
                <motion.div 
                  className="absolute bottom-0 left-0 right-0 h-0 bg-amber-100"
                  whileHover={{ height: "100%" }}
                  transition={{ duration: 0.3 }}
                />
              </motion.button>
            </motion.div>
          </motion.div>
        </div>
        
        <motion.div
          animate={{ 
            y: [0, -10, 0]
          }}
          transition={{ 
            duration: 4, 
            repeat: Infinity,
            ease: "easeInOut" 
          }}
        >
          <GoldenBorder className="w-full max-w-3xl h-10 absolute bottom-10 left-1/2 transform -translate-x-1/2" />
        </motion.div>
      </motion.div>
      
      {/* Product Grid with Royal Theme */}
      <div className="container mx-auto px-4 py-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl font-serif text-gray-900 mb-4">Royal Heritage Collection</h2>
          <div className="w-24 h-[1px] bg-amber-500 mx-auto mb-6"></div>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Each lehenga in our collection embodies generations of royal craftsmanship, featuring intricate embroidery and premium fabrics fit for royalty.
          </p>
        </motion.div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {products.map((product, index) => (
            <ProductCard key={product.id} product={product} index={index} />
          ))}
        </div>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mt-16"
        >
          <button className="px-8 py-3 border-2 border-amber-500 text-amber-600 rounded-md hover:bg-amber-50 transition-colors duration-300 group">
            <span>View All Lehengas</span>
            <svg className="ml-2 w-5 h-5 inline-block transition-transform duration-300 group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </button>
        </motion.div>
      </div>
      
      {/* Footer decorative element */}
      <div className="relative py-12 bg-gradient-to-b from-transparent to-amber-50/50">
        <RoyalBorder className="text-amber-500 w-full max-w-3xl h-6 mx-auto" />
        <div className="container mx-auto p-4 text-center">
          <p className="text-sm text-amber-600/70 mt-4">
            Crafting royal experiences since 1995
          </p>
        </div>
      </div>
    </div>
  );
};

export default CategoryLehengas; 