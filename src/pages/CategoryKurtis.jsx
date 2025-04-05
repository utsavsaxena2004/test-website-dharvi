import { useState, useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Link } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import ProductQuickView from '../components/ProductQuickView';

// Sample data for Kurtis products
const products = [
  {
    id: 'k1',
    name: 'Bohemian Print',
    price: '₹ 2,499',
    image: 'https://images.unsplash.com/photo-1619914775389-748e5e136c26?q=80&w=3087&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    colors: ['#fef3c7', '#fcd34d', '#fbbf24', '#f59e0b'],
    tags: ['casual', 'printed', 'summer'],
    badge: 'New Season',
    discount: '15% Off'
  },
  {
    id: 'k2',
    name: 'Floral Embroidered',
    price: '₹ 3,299',
    image: 'https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?q=80&w=3087&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    colors: ['#fee2e2', '#fecaca', '#fca5a5', '#f87171'],
    tags: ['floral', 'embroidery', 'festive'],
    badge: 'Bestseller'
  },
  {
    id: 'k3',
    name: 'Contemporary Fusion',
    price: '₹ 1,999',
    image: 'https://images.unsplash.com/photo-1622122201063-af8d43893d56?q=80&w=3087&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    colors: ['#dcfce7', '#86efac', '#4ade80', '#22c55e'],
    tags: ['office', 'modern', 'comfortable'],
    discount: '10% Off'
  },
  {
    id: 'k4',
    name: 'Ikat Block Print',
    price: '₹ 2,799',
    image: 'https://images.unsplash.com/photo-1600103419005-3155c4067372?q=80&w=3087&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    colors: ['#dbeafe', '#93c5fd', '#60a5fa', '#3b82f6'],
    tags: ['printed', 'handcrafted', 'ethnic'],
    badge: 'Handcrafted'
  },
  {
    id: 'k5',
    name: 'Bandhani Style',
    price: '₹ 2,399',
    image: 'https://images.unsplash.com/photo-1614676367564-32fbf7b1c8af?q=80&w=3087&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    colors: ['#f3e8ff', '#d8b4fe', '#c084fc', '#a855f7'],
    tags: ['traditional', 'tie-dye', 'festive'],
    badge: 'Traditional',
    discount: '20% Off'
  },
  {
    id: 'k6',
    name: 'Casual Cotton',
    price: '₹ 1,799',
    image: 'https://images.unsplash.com/photo-1615397349754-cfa2066a298e?q=80&w=3087&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    colors: ['#ffedd5', '#fed7aa', '#fdba74', '#fb923c'],
    tags: ['daily', 'cotton', 'comfortable'],
    badge: 'Casual'
  },
];

// Enhanced decorative SVG Components
const BrushStroke = ({ className }) => (
  <svg className={className} viewBox="0 0 200 30" xmlns="http://www.w3.org/2000/svg">
    <path d="M10,15 C60,5 140,25 190,15" fill="none" stroke="currentColor" strokeWidth="6" strokeLinecap="round" />
  </svg>
);

const BlockPattern = ({ className }) => (
  <svg className={className} viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
    <g fill="currentColor">
      <rect x="10" y="10" width="10" height="10" opacity="0.2" />
      <rect x="30" y="10" width="10" height="10" opacity="0.4" />
      <rect x="50" y="10" width="10" height="10" opacity="0.6" />
      <rect x="70" y="10" width="10" height="10" opacity="0.8" />
      <rect x="20" y="30" width="10" height="10" opacity="0.3" />
      <rect x="40" y="30" width="10" height="10" opacity="0.5" />
      <rect x="60" y="30" width="10" height="10" opacity="0.7" />
      <rect x="80" y="30" width="10" height="10" opacity="0.9" />
      <rect x="10" y="50" width="10" height="10" opacity="0.5" />
      <rect x="30" y="50" width="10" height="10" opacity="0.7" />
      <rect x="50" y="50" width="10" height="10" opacity="0.9" />
      <rect x="70" y="50" width="10" height="10" opacity="0.3" />
      <rect x="20" y="70" width="10" height="10" opacity="0.6" />
      <rect x="40" y="70" width="10" height="10" opacity="0.8" />
      <rect x="60" y="70" width="10" height="10" opacity="0.2" />
      <rect x="80" y="70" width="10" height="10" opacity="0.4" />
    </g>
  </svg>
);

// New decorative elements
const WavePattern = ({ className }) => (
  <svg className={className} viewBox="0 0 200 60" xmlns="http://www.w3.org/2000/svg">
    <path 
      d="M0,30 C30,10 70,50 100,30 C130,10 170,50 200,30" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2" 
      strokeLinecap="round"
    />
    <path 
      d="M0,30 C30,50 70,10 100,30 C130,50 170,10 200,30" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2" 
      strokeLinecap="round"
      strokeDasharray="2 4"
    />
  </svg>
);

const CircleGrid = ({ className }) => (
  <svg className={className} viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
    <g fill="currentColor">
      <circle cx="20" cy="20" r="4" opacity="0.6" />
      <circle cx="40" cy="20" r="4" opacity="0.4" />
      <circle cx="60" cy="20" r="4" opacity="0.6" />
      <circle cx="80" cy="20" r="4" opacity="0.4" />
      
      <circle cx="20" cy="40" r="4" opacity="0.4" />
      <circle cx="40" cy="40" r="4" opacity="0.8" />
      <circle cx="60" cy="40" r="4" opacity="0.8" />
      <circle cx="80" cy="40" r="4" opacity="0.4" />
      
      <circle cx="20" cy="60" r="4" opacity="0.6" />
      <circle cx="40" cy="60" r="4" opacity="0.8" />
      <circle cx="60" cy="60" r="4" opacity="0.8" />
      <circle cx="80" cy="60" r="4" opacity="0.6" />
      
      <circle cx="20" cy="80" r="4" opacity="0.4" />
      <circle cx="40" cy="80" r="4" opacity="0.6" />
      <circle cx="60" cy="80" r="4" opacity="0.6" />
      <circle cx="80" cy="80" r="4" opacity="0.4" />
    </g>
  </svg>
);

const ModernFrame = ({ className }) => (
  <svg className={className} viewBox="0 0 200 100" xmlns="http://www.w3.org/2000/svg">
    <rect x="0" y="0" width="20" height="20" fill="currentColor" opacity="0.7" />
    <rect x="180" y="0" width="20" height="20" fill="currentColor" opacity="0.7" />
    <rect x="0" y="80" width="20" height="20" fill="currentColor" opacity="0.7" />
    <rect x="180" y="80" width="20" height="20" fill="currentColor" opacity="0.7" />
    <line x1="20" y1="10" x2="180" y2="10" stroke="currentColor" strokeWidth="2" opacity="0.5" />
    <line x1="20" y1="90" x2="180" y2="90" stroke="currentColor" strokeWidth="2" opacity="0.5" />
    <line x1="10" y1="20" x2="10" y2="80" stroke="currentColor" strokeWidth="2" opacity="0.5" />
    <line x1="190" y1="20" x2="190" y2="80" stroke="currentColor" strokeWidth="2" opacity="0.5" />
  </svg>
);

const PulsatingCircle = ({ className, delay = 0 }) => (
  <motion.div
    className={className}
    animate={{
      scale: [1, 1.2, 1],
      opacity: [0.7, 0.2, 0.7]
    }}
    transition={{
      duration: 3,
      delay,
      repeat: Infinity,
      ease: "easeInOut"
    }}
  >
    <div className="rounded-full bg-current w-full h-full"></div>
  </motion.div>
);

// Enhanced floating element
const FloatingElement = ({ children, delay = 0, duration = 20, top, left, scale = 1 }) => (
  <motion.div
    className="absolute pointer-events-none"
    style={{ top, left, scale }}
    animate={{
      y: [0, -12, 0, 12, 0],
      x: [0, 8, 0, -8, 0],
      rotate: [0, 2, 0, -2, 0],
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
          <div className="absolute inset-0 border border-white/30 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          
          {/* Corner accents */}
          <div className="absolute top-3 left-3 w-6 h-6 border-t border-l border-white/50 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
          <div className="absolute top-3 right-3 w-6 h-6 border-t border-r border-white/50 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
          <div className="absolute bottom-3 left-3 w-6 h-6 border-b border-l border-white/50 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
          <div className="absolute bottom-3 right-3 w-6 h-6 border-b border-r border-white/50 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
          
          {/* Quick action button */}
          <div className="absolute bottom-4 left-0 right-0 flex justify-center opacity-0 transform translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300">
            <motion.button 
              onClick={() => setIsQuickViewOpen(true)}
              whileHover={{ scale: 1.05 }} 
              whileTap={{ scale: 0.95 }}
              className="bg-white text-cyan-600 py-2 px-4 rounded-full text-sm font-medium shadow-lg hover:bg-cyan-600 hover:text-white transition-colors duration-300 flex items-center space-x-1"
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
            <div className="absolute top-3 left-3 bg-cyan-600 text-white text-xs px-2 py-1 rounded font-medium z-10">
              {product.badge}
            </div>
          )}
          
          {product.discount && (
            <div className="absolute top-3 right-3 bg-amber-500 text-white text-xs px-2 py-1 rounded font-medium z-10">
              {product.discount}
            </div>
          )}
        </div>
        
        {/* Product info */}
        <div className="p-4">
          <div className="flex justify-between items-center mb-1">
            <h3 className="text-lg font-serif text-gray-900 group-hover:text-cyan-600 transition-colors duration-300">
              {product.name}
            </h3>
            <motion.button
              whileHover={{ scale: 1.2 }}
              whileTap={{ scale: 0.9 }}
              className="text-gray-400 hover:text-cyan-600 transition-colors duration-300"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"></path>
              </svg>
            </motion.button>
          </div>
          
          <div className="flex justify-between items-center mt-2">
            <p className="text-cyan-600 font-medium">{product.price}</p>
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
            className="w-full py-2 mt-1 text-sm font-medium text-gray-600 hover:text-cyan-600 bg-gray-50 hover:bg-gray-100 rounded transition-colors duration-300 flex items-center justify-center space-x-1"
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

const CategoryKurtis = () => {
  const containerRef = useRef(null);
  const [isHovered, setIsHovered] = useState(false);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"]
  });
  
  const backgroundY = useTransform(scrollYProgress, [0, 1], [0, 200]);
  const parallaxFactor = useTransform(scrollYProgress, [0, 1], [1, 1.5]);
  const opacityTitle = useTransform(scrollYProgress, [0, 0.2, 0.3], [1, 1, 0]);
  const titleY = useTransform(scrollYProgress, [0, 0.2, 0.3], [0, -50, -100]);
  const rotateBlock = useTransform(scrollYProgress, [0, 1], [0, 45]);
  
  return (
    <div ref={containerRef} className="min-h-screen bg-cyan-50/30 relative overflow-hidden">
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
        className="absolute top-0 right-0 w-2/3 h-2/3 bg-gradient-to-bl from-cyan-200/20 to-transparent rounded-bl-full -z-10"
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
        className="absolute bottom-0 left-0 w-2/3 h-2/3 bg-gradient-to-tr from-cyan-200/20 to-transparent rounded-tr-full -z-10"
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
      
      {/* Background decorative elements */}
      <motion.div style={{ y: backgroundY }} className="absolute inset-0 -z-10 opacity-5">
        <motion.div style={{ rotate: rotateBlock }}>
          <BlockPattern className="absolute top-20 left-20 text-cyan-600 w-40 h-40" />
        </motion.div>
        <motion.div style={{ rotate: rotateBlock }}>
          <BlockPattern className="absolute bottom-20 right-20 text-cyan-600 w-40 h-40 transform scale-x-[-1]" />
        </motion.div>
      </motion.div>
      
      {/* Enhanced floating elements */}
      <FloatingElement top="10%" left="5%" delay={0} duration={25}>
        <div className="text-cyan-600/20 w-40 h-40">
          <BrushStroke className="w-full h-full" />
        </div>
      </FloatingElement>
      
      <FloatingElement top="70%" left="85%" delay={2} duration={18}>
        <div className="text-cyan-600/20 w-32 h-32 transform rotate-180">
          <CircleGrid className="w-full h-full" />
        </div>
      </FloatingElement>
      
      {/* Add pulsating elements */}
      <PulsatingCircle className="absolute top-[15%] right-[10%] w-12 h-12 text-cyan-400/20" delay={0} />
      <PulsatingCircle className="absolute top-[30%] left-[15%] w-10 h-10 text-cyan-500/20" delay={1} />
      <PulsatingCircle className="absolute bottom-[20%] right-[20%] w-8 h-8 text-cyan-600/20" delay={2} />
      <PulsatingCircle className="absolute bottom-[40%] left-[12%] w-6 h-6 text-cyan-400/20" delay={1.5} />
      
      {/* Hero Banner with Modern Design */}
      <motion.div 
        style={{ opacity: opacityTitle, y: titleY }}
        className="relative w-full h-[60vh] flex items-center justify-center bg-gradient-to-b from-cyan-50/80 to-white/40"
      >
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-b from-transparent to-white/80 z-10"></div>
          <motion.img 
            src="https://images.unsplash.com/photo-1619914775389-748e5e136c26?q=80&w=3087&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
            alt="Kurtis Collection" 
            className="w-full h-full object-cover object-center opacity-20"
            style={{ scale: parallaxFactor }}
            initial={{ scale: 1.1 }}
            animate={{ 
              filter: ["brightness(1)", "brightness(1.1)", "brightness(1)"]
            }}
            transition={{ 
              duration: 20, 
              repeat: Infinity,
              ease: "easeInOut" 
            }}
          />
          
          {/* Add modern grid overlay */}
          <motion.div 
            className="absolute inset-0 opacity-5"
            animate={{ 
              opacity: [0.03, 0.06, 0.03],
              backgroundPosition: ['0% 0%', '100% 100%']
            }}
            transition={{ 
              duration: 30, 
              repeat: Infinity,
              ease: "linear"
            }}
            style={{
              backgroundImage: "linear-gradient(to right, #0891b2 1px, transparent 1px), linear-gradient(to bottom, #0891b2 1px, transparent 1px)",
              backgroundSize: "20px 20px"
            }}
          />
        </div>
        
        <div className="container mx-auto px-4 text-center relative z-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <motion.div 
              className="relative inline-flex items-center justify-center mb-6"
              whileHover={{ scale: 1.05 }}
            >
              <motion.div
                animate={{ 
                  rotate: [0, 360]
                }}
                transition={{
                  duration: 60,
                  repeat: Infinity,
                  ease: "linear"
                }}
                className="absolute -inset-6 opacity-20 pointer-events-none"
              >
                <ModernFrame className="w-full h-full text-cyan-500" />
              </motion.div>
              
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
                <div className="w-20 h-20 rounded-lg border-2 border-cyan-200 flex items-center justify-center bg-white">
                  <div className="w-16 h-16 rounded-md flex items-center justify-center bg-gradient-to-br from-cyan-400 to-cyan-600 text-white">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
                    </svg>
                  </div>
                </div>
              </motion.div>
            </motion.div>
            
            <motion.h1 
              className="text-5xl md:text-6xl font-serif text-gray-900 mb-4 relative"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              <motion.span 
                className="relative inline-block"
                whileHover={{ scale: 1.03 }}
                onHoverStart={() => setIsHovered(true)}
                onHoverEnd={() => setIsHovered(false)}
              >
                Contemporary
                <motion.span
                  className="absolute -z-10 bottom-2 left-0 h-4 bg-cyan-200/40 w-full"
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
                      className="absolute top-1/2 -translate-y-1/2 -left-12 pointer-events-none"
                    >
                      <BrushStroke className="h-10 w-10 text-cyan-400/50" />
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.span> Kurtis
            </motion.h1>
            
            <motion.p 
              className="text-lg text-gray-600 max-w-2xl mx-auto mb-8"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.6 }}
            >
              Elevate your everyday style with our modern kurta collection, blending traditional designs with contemporary cuts and patterns to create versatile pieces for all occasions.
            </motion.p>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.8 }}
              className="flex flex-wrap justify-center gap-4"
            >
              <motion.button 
                className="relative px-8 py-3 bg-gradient-to-r from-cyan-500 to-cyan-600 text-white rounded-md hover:shadow-lg transition duration-300 flex items-center overflow-hidden group"
                whileHover={{ scale: 1.03, boxShadow: "0 10px 15px -3px rgba(8, 145, 178, 0.2), 0 4px 6px -4px rgba(8, 145, 178, 0.2)" }}
                whileTap={{ scale: 0.97 }}
              >
                {/* Ripple effect */}
                <motion.div 
                  className="absolute inset-0 pointer-events-none"
                  whileHover={{
                    background: [
                      "radial-gradient(circle at center, rgba(255,255,255,0.2) 0%, rgba(255,255,255,0) 0%)",
                      "radial-gradient(circle at center, rgba(255,255,255,0.2) 100%, rgba(255,255,255,0) 100%)"
                    ],
                    scale: [0.1, 3],
                    opacity: [1, 0]
                  }}
                  transition={{ duration: 0.8 }}
                />
                
                <span>Browse Collection</span>
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
                className="px-8 py-3 border border-cyan-500 text-cyan-600 rounded-md transition-all duration-300 relative overflow-hidden"
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
              >
                <span className="relative z-10">Daily Wear</span>
                <motion.div 
                  className="absolute bottom-0 left-0 right-0 h-0 bg-cyan-100"
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
          <WavePattern className="w-full max-w-2xl h-12 absolute bottom-10 left-1/2 transform -translate-x-1/2 text-cyan-500/50" />
        </motion.div>
      </motion.div>
      
      {/* Product Grid */}
      <div className="container mx-auto px-4 py-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Trending Styles</h2>
          <div className="w-20 h-1 bg-gradient-to-r from-cyan-400 to-teal-400 mx-auto mb-6 rounded-full"></div>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Discover our curated collection of contemporary kurtis, designed for comfort and crafted with love for the modern woman.
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
          <button className="px-8 py-3 border-2 border-cyan-500 text-cyan-600 rounded-full hover:bg-cyan-50 transition-colors duration-300 group">
            <span>View All Kurtis</span>
            <svg className="ml-2 w-5 h-5 inline-block transition-transform duration-300 group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </button>
        </motion.div>
      </div>
      
      {/* Feature section */}
      <div className="bg-white py-16 relative overflow-hidden">
        <FloatingElement top="10%" left="10%" delay={0.2} duration={25}>
          <div className="w-60 h-60 rounded-full bg-gradient-to-r from-cyan-100/20 to-cyan-200/10 blur-xl"></div>
        </FloatingElement>
        
        <FloatingElement top="60%" left="80%" delay={1.2} duration={20}>
          <div className="w-40 h-40 rounded-full bg-gradient-to-r from-teal-100/20 to-cyan-200/10 blur-xl"></div>
        </FloatingElement>
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="p-6"
            >
              <div className="w-14 h-14 rounded-full bg-gradient-to-r from-cyan-100 to-cyan-200 flex items-center justify-center mx-auto mb-4">
                <svg className="w-6 h-6 text-cyan-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">Customizable</h3>
              <p className="text-gray-600">Options to personalize fit and style for your unique preferences</p>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="p-6"
            >
              <div className="w-14 h-14 rounded-full bg-gradient-to-r from-cyan-100 to-cyan-200 flex items-center justify-center mx-auto mb-4">
                <svg className="w-6 h-6 text-cyan-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">Vibrant Colors</h3>
              <p className="text-gray-600">Bright, contemporary color palettes for every mood and season</p>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="p-6"
            >
              <div className="w-14 h-14 rounded-full bg-gradient-to-r from-cyan-100 to-cyan-200 flex items-center justify-center mx-auto mb-4">
                <svg className="w-6 h-6 text-cyan-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">Breathable Fabric</h3>
              <p className="text-gray-600">Premium cotton and blends for ultimate comfort in any weather</p>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="p-6"
            >
              <div className="w-14 h-14 rounded-full bg-gradient-to-r from-cyan-100 to-cyan-200 flex items-center justify-center mx-auto mb-4">
                <svg className="w-6 h-6 text-cyan-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12zm-7 4h14M5 12a2 2 0 110-4h14a2 2 0 110 4M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7" />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">Versatile Styles</h3>
              <p className="text-gray-600">From office to casual outings, designs for every occasion</p>
            </motion.div>
          </div>
        </div>
      </div>
      
      {/* Simple footer */}
      <div className="py-8 bg-gradient-to-t from-cyan-100/50 to-transparent">
        <div className="container mx-auto p-4 text-center">
          <p className="text-sm text-cyan-600/70">
            Contemporary comfort in every stitch
          </p>
        </div>
      </div>
    </div>
  );
};

export default CategoryKurtis; 