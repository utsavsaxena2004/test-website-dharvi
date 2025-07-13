import { motion } from 'framer-motion';
import { useState, useRef, useEffect } from 'react';
import { AnimatePresence } from 'framer-motion';
import ProductQuickView from '../components/ProductQuickView';

// Sample data for Suits products
const products = [
  {
    id: 's1',
    name: 'Midnight Blue Anarkali',
    price: '₹ 12,999',
    image: 'https://images.unsplash.com/photo-1648048374442-84f0d99a5c3a?q=80&w=3087&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    colors: ['#1e3a8a', '#1e40af', '#1d4ed8', '#3b82f6'],
    tags: ['party', 'evening', 'designer'],
    badge: 'Designer',
    discount: '15% Off'
  },
  {
    id: 's2',
    name: 'Emerald Palazzo Set',
    price: '₹ 9,499',
    image: 'https://images.unsplash.com/photo-1614945648572-28f6fcbab44a?q=80&w=3087&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    colors: ['#065f46', '#047857', '#059669', '#10b981'],
    tags: ['casual', 'summer', 'comfortable'],
    badge: 'New Arrival'
  },
  {
    id: 's3',
    name: 'Ruby Red Embroidered',
    price: '₹ 15,299',
    image: 'https://images.unsplash.com/photo-1647891938250-954addeb9c51?q=80&w=3087&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    colors: ['#991b1b', '#b91c1c', '#dc2626', '#ef4444'],
    tags: ['wedding', 'ceremony', 'premium'],
    badge: 'Premium',
    discount: '10% Off'
  },
  {
    id: 's4',
    name: 'Pearl White Pantsuit',
    price: '₹ 13,499',
    image: 'https://images.unsplash.com/photo-1688141585146-d5d9708cf7f9?q=80&w=3069&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    colors: ['#f9fafb', '#f3f4f6', '#e5e7eb', '#d1d5db'],
    tags: ['modern', 'professional', 'western'],
    badge: 'Bestseller'
  },
  {
    id: 's5',
    name: 'Amethyst Kurta Set',
    price: '₹ 8,899',
    image: 'https://images.unsplash.com/photo-1629056828894-a521a161c3ff?q=80&w=3087&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    colors: ['#4c1d95', '#5b21b6', '#6d28d9', '#7c3aed'],
    tags: ['festive', 'traditional', 'embroidered'],
    discount: '20% Off'
  },
  {
    id: 's6',
    name: 'Saffron Sharara',
    price: '₹ 11,499',
    image: 'https://images.unsplash.com/photo-1602412549424-87920dc5adb5?q=80&w=3087&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    colors: ['#92400e', '#b45309', '#d97706', '#f59e0b'],
    tags: ['mehendi', 'celebration', 'trendy'],
    badge: 'Limited Edition'
  },
];

// Enhanced decorative SVG Components
const GeometricPattern = ({ className }) => (
  <svg className={className} viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
    <g stroke="currentColor" strokeWidth="2" fill="none">
      <rect x="40" y="40" width="120" height="120" />
      <rect x="60" y="60" width="80" height="80" />
      <rect x="80" y="80" width="40" height="40" />
      <line x1="40" y1="40" x2="80" y2="80" />
      <line x1="160" y1="40" x2="120" y2="80" />
      <line x1="40" y1="160" x2="80" y2="120" />
      <line x1="160" y1="160" x2="120" y2="120" />
    </g>
  </svg>
);

const DiamondPattern = ({ className }) => (
  <svg className={className} viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
    <g fill="currentColor">
      <path d="M50 15 L70 50 L50 85 L30 50 Z" opacity="0.8" />
      <path d="M50 5 L80 50 L50 95 L20 50 Z" opacity="0.4" />
      <path d="M50 25 L60 50 L50 75 L40 50 Z" opacity="1" />
    </g>
  </svg>
);

const HexagonGrid = ({ className }) => (
  <svg className={className} viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
    <g fill="currentColor">
      {[0, 1, 2].map(row => 
        [0, 1, 2, 3].map(col => {
          const offsetX = row % 2 === 0 ? 0 : 15;
          return (
            <path 
              key={`${row}-${col}`}
              d={`M${15 + col * 30 + offsetX},${15 + row * 25} l5,-10 h10 l5,10 l-5,10 h-10 z`} 
              opacity={0.1 + (row + col) * 0.1}
            />
          );
        })
      )}
    </g>
  </svg>
);

const AbstractLines = ({ className }) => (
  <svg className={className} viewBox="0 0 200 100" xmlns="http://www.w3.org/2000/svg">
    <g stroke="currentColor" strokeWidth="1.5" fill="none">
      <path d="M20,20 Q50,10 80,30 T140,20" />
      <path d="M20,40 Q60,20 100,50 T180,40" />
      <path d="M20,60 Q70,40 120,70 T180,60" />
      <path d="M20,80 Q80,60 140,90 T180,80" />
    </g>
  </svg>
);

const DecorativeLine = () => (
  <svg width="120" height="12" viewBox="0 0 120 12" fill="none" xmlns="http://www.w3.org/2000/svg">
    <line x1="0" y1="6" x2="40" y2="6" stroke="#E2E8F0" strokeWidth="1" />
    <line x1="80" y1="6" x2="120" y2="6" stroke="#E2E8F0" strokeWidth="1" />
    <circle cx="60" cy="6" r="5" fill="none" stroke="#6366F1" strokeWidth="1" />
    <circle cx="60" cy="6" r="2" fill="#6366F1" />
  </svg>
);

// New animated components
const PulsingRing = ({ className, size = 60, delay = 0 }) => (
  <motion.div 
    className={className}
    style={{ width: size, height: size }}
    initial={{ opacity: 0.2 }}
    animate={{
      opacity: [0.2, 0.5, 0.2],
      scale: [1, 1.15, 1],
    }}
    transition={{
      duration: 4,
      delay,
      repeat: Infinity,
      ease: "easeInOut"
    }}
  >
    <div className="rounded-full border-2 border-current w-full h-full"></div>
  </motion.div>
);

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

const ParallaxDiamond = ({ scrollYProgress, intensity = 100, className }) => {
  const y = scrollYProgress * intensity;
  const opacity = scrollYProgress;
  
  return (
    <motion.div 
      style={{ y, opacity }}
      className={className}
    >
      <DiamondPattern className="w-full h-full" />
    </motion.div>
  );
};

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
              className="bg-white text-indigo-600 py-2 px-4 rounded-full text-sm font-medium shadow-lg hover:bg-indigo-600 hover:text-white transition-colors duration-300 flex items-center space-x-1"
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
            <div className="absolute top-3 left-3 bg-indigo-600 text-white text-xs px-2 py-1 rounded font-medium z-10">
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
            <h3 className="text-lg font-serif text-gray-900 group-hover:text-indigo-600 transition-colors duration-300">
              {product.name}
            </h3>
            <motion.button
              whileHover={{ scale: 1.2 }}
              whileTap={{ scale: 0.9 }}
              className="text-gray-400 hover:text-indigo-600 transition-colors duration-300"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"></path>
              </svg>
            </motion.button>
          </div>
          
          <div className="flex justify-between items-center mt-2">
            <p className="text-indigo-600 font-medium">{product.price}</p>
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
            className="w-full py-2 mt-1 text-sm font-medium text-gray-600 hover:text-indigo-600 bg-gray-50 hover:bg-gray-100 rounded transition-colors duration-300 flex items-center justify-center space-x-1"
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

const CategorySuits = () => {
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
  
  const backgroundY = scrollYProgress * 200;
  const parallaxFactor = scrollYProgress * 1.5 + 1;
  const opacityTitle = scrollYProgress * 0.3;
  const titleY = scrollYProgress * -100;
  const rotateGeo = scrollYProgress * 45;
  
  return (
    <div ref={containerRef} className="min-h-screen bg-indigo-50/30 relative overflow-hidden">
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
        className="absolute top-0 right-0 w-2/3 h-2/3 bg-gradient-to-bl from-indigo-200/20 to-transparent rounded-bl-full -z-10"
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
        className="absolute bottom-0 left-0 w-2/3 h-2/3 bg-gradient-to-tr from-indigo-200/20 to-transparent rounded-tr-full -z-10"
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
        <motion.div style={{ rotate: rotateGeo }}>
          <GeometricPattern className="absolute top-20 left-20 text-indigo-600 w-40 h-40" />
        </motion.div>
        <motion.div style={{ rotate: rotateGeo }}>
          <GeometricPattern className="absolute bottom-20 right-20 text-indigo-600 w-40 h-40 transform scale-x-[-1]" />
        </motion.div>
      </motion.div>
      
      {/* Parallax diamonds */}
      <ParallaxDiamond scrollYProgress={scrollYProgress} intensity={-80} className="absolute top-[20%] left-[10%] text-indigo-500/20 w-40 h-40" />
      <ParallaxDiamond scrollYProgress={scrollYProgress} intensity={120} className="absolute bottom-[30%] right-[5%] text-indigo-500/20 w-32 h-32" />
      
      {/* Enhanced floating elements */}
      <FloatingElement top="10%" left="5%" delay={0} duration={25}>
        <div className="text-indigo-600/20 w-40 h-40">
          <AbstractLines className="w-full h-full" />
        </div>
      </FloatingElement>
      
      <FloatingElement top="70%" left="85%" delay={2} duration={18}>
        <div className="text-indigo-600/20 w-32 h-32 transform rotate-90">
          <HexagonGrid className="w-full h-full" />
        </div>
      </FloatingElement>
      
      {/* Add pulsing ring elements */}
      <PulsingRing className="absolute top-[15%] right-[10%] text-indigo-500/30" size={80} delay={0} />
      <PulsingRing className="absolute top-[30%] left-[15%] text-indigo-400/30" size={60} delay={1} />
      <PulsingRing className="absolute bottom-[20%] right-[20%] text-indigo-600/30" size={40} delay={2} />
      <PulsingRing className="absolute bottom-[40%] left-[12%] text-indigo-500/30" size={30} delay={1.5} />
      
      {/* Hero Banner with Modern Design */}
      <motion.div 
        style={{ opacity: opacityTitle, y: titleY }}
        className="relative w-full h-[60vh] flex items-center justify-center bg-gradient-to-b from-indigo-50/80 to-white/40"
      >
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-b from-transparent to-white/80 z-10"></div>
          <motion.img 
            src="https://images.unsplash.com/photo-1578932750294-f5075e85f44a?q=80&w=3087&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
            alt="Suits Collection" 
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
          
          {/* Add geometric overlay */}
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
              backgroundImage: "linear-gradient(to right, #4f46e5 1px, transparent 1px), linear-gradient(to bottom, #4f46e5 1px, transparent 1px)",
              backgroundSize: "30px 30px"
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
                  duration: 40,
                  repeat: Infinity,
                  ease: "linear"
                }}
                className="absolute -inset-6 opacity-20 pointer-events-none"
              >
                <GeometricPattern className="w-full h-full text-indigo-500" />
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
                <div className="w-20 h-20 rounded-none border-2 border-indigo-200 flex items-center justify-center bg-white">
                  <div className="w-16 h-16 rounded-none flex items-center justify-center bg-gradient-to-br from-indigo-400 to-indigo-600 text-white">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
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
                Elegant
                <motion.span
                  className="absolute -z-10 bottom-2 left-0 h-4 bg-indigo-200/40 w-full"
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
                      <DiamondPattern className="h-10 w-10 text-indigo-400/50" />
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.span> Suits
            </motion.h1>
            
            <motion.p 
              className="text-lg text-gray-600 max-w-2xl mx-auto mb-8"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.6 }}
            >
              Discover our exquisite collection of tailored suits, combining precision craftsmanship with contemporary designs for an impeccable fit and timeless style.
            </motion.p>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.8 }}
              className="flex flex-wrap justify-center gap-4"
            >
              <motion.button 
                className="relative px-8 py-3 bg-gradient-to-r from-indigo-500 to-indigo-600 text-white rounded-none hover:shadow-lg transition duration-300 flex items-center overflow-hidden group"
                whileHover={{ scale: 1.03, boxShadow: "0 10px 15px -3px rgba(79, 70, 229, 0.2), 0 4px 6px -4px rgba(79, 70, 229, 0.2)" }}
                whileTap={{ scale: 0.97 }}
              >
                {/* Line animation effect */}
                <motion.div 
                  className="absolute inset-0 pointer-events-none overflow-hidden"
                  whileHover={{}}
                >
                  <motion.div 
                    className="w-full h-0.5 bg-white/40 absolute top-0"
                    initial={{ x: "-100%" }}
                    whileHover={{ x: "100%" }}
                    transition={{ duration: 0.7 }}
                  />
                  <motion.div 
                    className="w-full h-0.5 bg-white/40 absolute bottom-0"
                    initial={{ x: "100%" }}
                    whileHover={{ x: "-100%" }}
                    transition={{ duration: 0.7 }}
                  />
                  <motion.div 
                    className="w-0.5 h-full bg-white/40 absolute left-0"
                    initial={{ y: "100%" }}
                    whileHover={{ y: "-100%" }}
                    transition={{ duration: 0.7 }}
                  />
                  <motion.div 
                    className="w-0.5 h-full bg-white/40 absolute right-0"
                    initial={{ y: "-100%" }}
                    whileHover={{ y: "100%" }}
                    transition={{ duration: 0.7 }}
                  />
                </motion.div>
                
                <span>View Collection</span>
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
                className="px-8 py-3 border border-indigo-500 text-indigo-600 rounded-none transition-all duration-300 relative overflow-hidden"
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
              >
                <span className="relative z-10">Formal Wear</span>
                <motion.div 
                  className="absolute bottom-0 left-0 right-0 h-0 bg-indigo-100"
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
          <DecorativeLine />
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
          <h2 className="text-3xl font-medium text-gray-900 mb-4">Featured Collection</h2>
          <div className="w-16 h-[1px] bg-indigo-500 mx-auto mb-6"></div>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Refined silhouettes that blend tradition with contemporary design, our suits collection offers versatile elegance for every occasion.
          </p>
        </motion.div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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
          <div className="flex justify-center mb-4">
            <DecorativeLine />
          </div>
          <motion.a
            href="/collections/suits"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="relative inline-flex items-center px-8 py-3 border border-indigo-600 text-indigo-600 hover:bg-indigo-600 hover:text-white transition-all duration-300 rounded-md group overflow-hidden"
          >
            <span className="relative z-10">View Full Collection</span>
            <svg className="w-5 h-5 ml-2 relative z-10 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
            
            {/* Button animation */}
            <div className="absolute inset-0 bg-indigo-600 transform -translate-x-full group-hover:translate-x-0 transition-transform duration-300 z-0"></div>
          </motion.a>
          
          {/* Decorative elements around the button */}
          <div className="flex justify-center mt-8 space-x-4">
            <motion.div 
              initial={{ scale: 0 }}
              whileInView={{ scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 1 }}
              className="w-6 h-[1px] bg-indigo-600 opacity-40 self-center"
            ></motion.div>
            <motion.div 
              initial={{ scale: 0 }}
              whileInView={{ scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 1.1 }}
              className="w-3 h-3 rounded-full border border-indigo-600 opacity-40"
            ></motion.div>
            <motion.div 
              initial={{ scale: 0 }}
              whileInView={{ scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 1.2 }}
              className="w-2 h-2 rounded-full bg-indigo-600 opacity-40"
            ></motion.div>
            <motion.div 
              initial={{ scale: 0 }}
              whileInView={{ scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 1.1 }}
              className="w-3 h-3 rounded-full border border-indigo-600 opacity-40"
            ></motion.div>
            <motion.div 
              initial={{ scale: 0 }}
              whileInView={{ scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 1 }}
              className="w-6 h-[1px] bg-indigo-600 opacity-40 self-center"
            ></motion.div>
          </div>
        </motion.div>
      </div>
      
      {/* Feature section */}
      <div className="bg-white py-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="p-6 border border-indigo-100 rounded-lg"
            >
              <div className="w-12 h-12 rounded-full bg-indigo-50 flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-indigo-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">Premium Craftsmanship</h3>
              <p className="text-gray-600">Expertly crafted by skilled artisans with attention to every detail and stitch.</p>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="p-6 border border-indigo-100 rounded-lg"
            >
              <div className="w-12 h-12 rounded-full bg-indigo-50 flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-indigo-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">Exclusive Designs</h3>
              <p className="text-gray-600">Unique designs that combine traditional aesthetics with contemporary sensibilities.</p>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="p-6 border border-indigo-100 rounded-lg"
            >
              <div className="w-12 h-12 rounded-full bg-indigo-50 flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-indigo-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">Quality Fabrics</h3>
              <p className="text-gray-600">Sourced from the finest mills, our fabrics ensure comfort, durability, and elegance.</p>
            </motion.div>
          </div>
        </div>
      </div>
      
      {/* Footer decorative element */}
      <div className="py-8 bg-gradient-to-t from-transparent to-indigo-50/30">
        <div className="container mx-auto p-4 text-center">
          <div className="w-24 h-[1px] bg-indigo-200 mx-auto mb-4"></div>
          <p className="text-sm text-indigo-600/70">
            Elegance in every stitch
          </p>
        </div>
      </div>
    </div>
  );
};

export default CategorySuits; 