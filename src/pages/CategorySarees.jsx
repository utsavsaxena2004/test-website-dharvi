import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import ProductQuickView from '../components/ProductQuickView';

// Sample data for Sarees products
const products = [
  {
    id: 's1',
    name: 'Royal Banarasi Silk',
    price: '₹ 12,999',
    image: 'https://images.unsplash.com/photo-1610189031585-fd499562e6c5?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&q=80',
    colors: ['#6f0e06', '#e63946', '#1d3557', '#f1faee'],
    tags: ['silk', 'wedding', 'premium'],
    badge: 'Premium',
    discount: '10% Off'
  },
  {
    id: 's2',
    name: 'Kanjivaram Heritage',
    price: '₹ 18,499',
    image: 'https://images.unsplash.com/photo-1582903222056-cadd797253d4?q=80&w=3774&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    colors: ['#f4a261', '#e9c46a', '#2a9d8f', '#264653'],
    tags: ['silk', 'bridal', 'premium'],
    badge: 'Bridal Collection'
  },
  {
    id: 's3',
    name: 'Contemporary Linen',
    price: '₹ 4,299',
    image: 'https://images.unsplash.com/photo-1626185482210-19725c123648?q=80&w=3770&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    colors: ['#ccd5ae', '#e9edc9', '#fefae0', '#faedcd'],
    tags: ['linen', 'casual', 'everyday'],
    discount: '20% Off'
  },
  {
    id: 's4',
    name: 'Digital Print Georgette',
    price: '₹ 3,499',
    image: 'https://images.unsplash.com/photo-1610713389533-b2a5d2a6e2fd?q=80&w=3737&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    colors: ['#2b2d42', '#8d99ae', '#edf2f4', '#ef233c'],
    tags: ['georgette', 'party', 'modern'],
    badge: 'New Arrival'
  },
  {
    id: 's5',
    name: 'Embroidered Chiffon',
    price: '₹ 7,899',
    image: 'https://images.unsplash.com/photo-1596619635331-d2f24aa3e0a3?q=80&w=3774&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    colors: ['#003049', '#d62828', '#f77f00', '#fcbf49'],
    tags: ['chiffon', 'festive', 'premium'],
    badge: 'Festive Special',
    discount: '15% Off'
  },
  {
    id: 's6',
    name: 'Traditional Bomkai',
    price: '₹ 9,499',
    image: 'https://images.unsplash.com/photo-1618244920862-69d2adcd1333?q=80&w=3774&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    colors: ['#9c6644', '#7f5539', '#a4ac86', '#656d4a'],
    tags: ['cotton', 'traditional', 'handloom'],
    badge: 'Handcrafted'
  },
];

// Enhanced decorative SVG Components
const DecorativePaisleyPattern = ({ className }) => (
  <svg className={className} viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
    <path 
      d="M50,20 C80,20 80,80 50,80 C20,80 20,60 30,50 C40,40 50,40 50,50 C50,60 40,60 40,50 C40,40 50,30 60,40 C70,50 60,60 50,60 C40,60 30,50 40,40 C50,30 60,40 50,50 Z" 
      fill="currentColor" 
      opacity="0.2"
    />
  </svg>
);

const MangoLeafPattern = ({ className }) => (
  <svg className={className} viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg">
    <path 
      d="M30,10 C40,10 50,20 50,30 C50,40 40,50 30,50 C20,50 10,40 10,30 C10,20 20,10 30,10 Z M30,15 C37,15 45,23 45,30 C45,37 37,45 30,45 C23,45 15,37 15,30 C15,23 23,15 30,15 Z M30,20 C35,20 40,25 40,30 C40,35 35,40 30,40 C25,40 20,35 20,30 C20,25 25,20 30,20 Z" 
      fill="currentColor" 
      opacity="0.15"
    />
  </svg>
);

const BorderDesign = ({ className }) => (
  <svg className={className} viewBox="0 0 300 20" xmlns="http://www.w3.org/2000/svg">
    <rect x="0" y="9" width="300" height="2" fill="currentColor" opacity="0.3" />
    <circle cx="150" cy="10" r="5" fill="currentColor" opacity="0.3" />
    <circle cx="130" cy="10" r="3" fill="currentColor" opacity="0.3" />
    <circle cx="170" cy="10" r="3" fill="currentColor" opacity="0.3" />
    <circle cx="110" cy="10" r="2" fill="currentColor" opacity="0.3" />
    <circle cx="190" cy="10" r="2" fill="currentColor" opacity="0.3" />
  </svg>
);

// New decorative elements
const SareePatternBorder = ({ className }) => (
  <svg className={className} viewBox="0 0 400 60" xmlns="http://www.w3.org/2000/svg">
    <g fill="none" stroke="currentColor" strokeWidth="1">
      <path d="M0,30 C20,10 40,50 60,30 C80,10 100,50 120,30 C140,10 160,50 180,30 C200,10 220,50 240,30 C260,10 280,50 300,30 C320,10 340,50 360,30 C380,10 400,50 420,30" />
      <path d="M0,30 C20,50 40,10 60,30 C80,50 100,10 120,30 C140,50 160,10 180,30 C200,50 220,10 240,30 C260,50 280,10 300,30 C320,50 340,10 360,30 C380,50 400,10 420,30" />
    </g>
    <g fill="currentColor" opacity="0.3">
      <circle cx="60" cy="30" r="3" />
      <circle cx="120" cy="30" r="3" />
      <circle cx="180" cy="30" r="3" />
      <circle cx="240" cy="30" r="3" />
      <circle cx="300" cy="30" r="3" />
      <circle cx="360" cy="30" r="3" />
    </g>
  </svg>
);

const FlowerMotif = ({ className }) => (
  <svg className={className} viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <radialGradient id="flowerGradient" cx="50%" cy="50%" r="50%" fx="50%" fy="50%">
        <stop offset="0%" stopColor="currentColor" stopOpacity="0.6" />
        <stop offset="100%" stopColor="currentColor" stopOpacity="0.1" />
      </radialGradient>
    </defs>
    <g>
      <circle cx="50" cy="50" r="10" fill="url(#flowerGradient)" />
      <path d="M50,10 C55,25 65,35 80,40 C65,45 55,55 50,70 C45,55 35,45 20,40 C35,35 45,25 50,10 Z" fill="url(#flowerGradient)" />
      <path d="M50,10 C60,20 70,20 80,10 C70,30 70,50 80,70 C60,60 40,60 20,70 C30,50 30,30 20,10 C30,20 40,20 50,10 Z" fill="none" stroke="currentColor" strokeOpacity="0.3" strokeWidth="0.5" />
    </g>
  </svg>
);

const VibratingElement = ({ children, magnitude = 2, duration = 4, delay = 0 }) => (
  <motion.div
    animate={{ 
      rotate: [0, magnitude, 0, -magnitude, 0],
      scale: [1, 1.02, 1, 0.98, 1] 
    }}
    transition={{ 
      repeat: Infinity,
      duration,
      delay,
      ease: "easeInOut" 
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
              className="bg-white text-rose-600 py-2 px-4 rounded-full text-sm font-medium shadow-lg hover:bg-rose-600 hover:text-white transition-colors duration-300 flex items-center space-x-1"
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
            <div className="absolute top-3 left-3 bg-pink-600 text-white text-xs px-2 py-1 rounded font-medium z-10">
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
            <h3 className="text-lg font-serif text-gray-900 group-hover:text-pink-600 transition-colors duration-300">
              {product.name}
            </h3>
            <motion.button
              whileHover={{ scale: 1.2 }}
              whileTap={{ scale: 0.9 }}
              className="text-gray-400 hover:text-pink-600 transition-colors duration-300"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"></path>
              </svg>
            </motion.button>
          </div>
          
          <div className="flex justify-between items-center mt-2">
            <p className="text-pink-600 font-medium">{product.price}</p>
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
            className="w-full py-2 mt-1 text-sm font-medium text-gray-600 hover:text-pink-600 bg-gray-50 hover:bg-gray-100 rounded transition-colors duration-300 flex items-center justify-center space-x-1"
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

const CategorySarees = () => {
  const containerRef = useRef(null);
  const [isHovered, setIsHovered] = useState(false);
  
  return (
    <div ref={containerRef} className="min-h-screen bg-rose-50/30 relative overflow-hidden">
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
        className="absolute top-0 right-0 w-2/3 h-2/3 bg-gradient-to-bl from-pink-200/20 to-transparent rounded-bl-full -z-10"
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
        className="absolute bottom-0 left-0 w-2/3 h-2/3 bg-gradient-to-tr from-pink-200/20 to-transparent rounded-tr-full -z-10"
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
      
      <motion.div style={{ y: 0 }} className="absolute inset-0 -z-10 opacity-5">
        <DecorativePaisleyPattern className="absolute top-20 left-20 text-pink-600 w-40 h-40" />
        <DecorativePaisleyPattern className="absolute bottom-20 right-20 text-pink-600 w-40 h-40 transform scale-x-[-1]" />
        <MangoLeafPattern className="absolute top-1/3 right-40 text-pink-600 w-32 h-32 transform rotate-45" />
        <MangoLeafPattern className="absolute bottom-1/3 left-40 text-pink-600 w-32 h-32 transform -rotate-45" />
      </motion.div>
      
      {/* Enhanced floating elements */}
      <FloatingElement top="10%" left="5%" delay={0} duration={25}>
        <div className="text-pink-600/20 w-40 h-40">
          <DecorativePaisleyPattern className="w-full h-full" />
        </div>
      </FloatingElement>
      
      <FloatingElement top="70%" left="85%" delay={2} duration={18}>
        <div className="text-pink-600/20 w-32 h-32 transform rotate-180">
          <MangoLeafPattern className="w-full h-full" />
        </div>
      </FloatingElement>
      
      {/* New animated flower motifs */}
      <FloatingElement top="25%" left="85%" delay={1} duration={22}>
        <motion.div 
          className="text-pink-600/30 w-16 h-16"
          style={{ rotate: 0, scale: 1 }}
        >
          <FlowerMotif className="w-full h-full" />
        </motion.div>
      </FloatingElement>
      
      <FloatingElement top="75%" left="15%" delay={3} duration={20}>
        <motion.div 
          className="text-pink-600/30 w-24 h-24"
          style={{ rotate: 0, scale: 1 }}
        >
          <FlowerMotif className="w-full h-full" />
        </motion.div>
      </FloatingElement>
      
      {/* Hero Banner with enhanced animations */}
      <motion.div 
        style={{ opacity: 1, y: 0 }}
        className="relative w-full h-[60vh] flex items-center justify-center bg-gradient-to-b from-pink-50/80 to-white/40"
      >
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-b from-transparent to-white/80 z-10"></div>
          <motion.img 
            src="https://images.unsplash.com/photo-1610189031585-fd499562e6c5?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&q=80" 
            alt="Sarees Collection" 
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
                <motion.div
                  animate={{ 
                    rotate: [0, 360]
                  }}
                  transition={{
                    duration: 40,
                    repeat: Infinity,
                    ease: "linear"
                  }}
                >
                  <BorderDesign className="text-pink-600 w-80 h-6 absolute -top-10 left-1/2 transform -translate-x-1/2" />
                </motion.div>
                
                <VibratingElement duration={5}>
                  <div className="w-16 h-16 rounded-full border-2 border-pink-200 flex items-center justify-center bg-white">
                    <div className="w-12 h-12 rounded-full flex items-center justify-center bg-gradient-to-br from-pink-400 to-pink-600 text-white">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                      </svg>
                    </div>
                  </div>
                </VibratingElement>
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
                Sarees
                <motion.span
                  className="absolute -z-10 bottom-2 left-0 h-4 bg-pink-200/40 w-full"
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
                      className="absolute -left-6 -right-6 -top-6 -bottom-2 pointer-events-none"
                    >
                      <svg className="w-full h-full" viewBox="0 0 100 50" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M5,25 C15,15 25,15 35,25 C45,35 55,35 65,25 C75,15 85,15 95,25" stroke="#EC4899" strokeOpacity="0.3" strokeWidth="1" />
                        <path d="M5,25 C15,35 25,35 35,25 C45,15 55,15 65,25 C75,35 85,35 95,25" stroke="#EC4899" strokeOpacity="0.3" strokeWidth="1" />
                      </svg>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.span> Collection
            </motion.h1>
            
            <motion.p 
              className="text-lg text-gray-600 max-w-2xl mx-auto mb-8"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.6 }}
            >
              Discover our exquisite range of handcrafted sarees, where tradition meets elegance in every drape. From vibrant silks to subtle cottons, find your perfect style.
            </motion.p>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.8 }}
              className="flex flex-wrap justify-center gap-4"
            >
              <motion.button 
                className="relative px-6 py-3 bg-gradient-to-r from-pink-500 to-pink-600 text-white rounded-md hover:shadow-lg transition-shadow duration-300 flex items-center overflow-hidden group"
                whileHover={{ scale: 1.03 }}
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
                className="px-6 py-3 border border-pink-500 text-pink-600 rounded-md hover:bg-pink-50 transition-colors duration-300 relative overflow-hidden"
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
              >
                <span className="relative z-10">Filter & Sort</span>
                <motion.div 
                  className="absolute bottom-0 left-0 right-0 h-0 bg-pink-100"
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
          <SareePatternBorder className="text-pink-600 w-full max-w-2xl h-6 absolute bottom-10 left-1/2 transform -translate-x-1/2" />
        </motion.div>
      </motion.div>
      
      {/* Product Grid with enhanced animations */}
      <div className="container mx-auto px-4 py-16 relative">
        {/* Add decorative elements behind the grid */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <motion.div
            style={{ 
              rotate: 0, 
              scale: 1.5 
            }}
            className="absolute -top-32 -right-32 text-pink-100 w-64 h-64 opacity-30"
          >
            <FlowerMotif className="w-full h-full" />
          </motion.div>
          
          <motion.div
            style={{ 
              rotate: 0, 
              scale: 1.5 
            }}
            className="absolute -bottom-32 -left-32 text-pink-100 w-64 h-64 opacity-30"
          >
            <FlowerMotif className="w-full h-full" />
          </motion.div>
        </div>
      
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-12"
        >
          <VibratingElement duration={10} magnitude={1}>
            <h2 className="text-3xl font-serif text-gray-900 mb-4">Our Premium Selection</h2>
          </VibratingElement>
          
          <motion.div 
            className="w-24 h-[1px] bg-pink-500 mx-auto mb-6"
            whileInView={{ 
              width: ["0%", "100%", "80%"],
              x: ["-50%", "0%", "-10%"]
            }}
            viewport={{ once: true }}
            transition={{ 
              duration: 1.5,
              ease: "easeOut"
            }}
          />
          
          <motion.p 
            className="text-gray-600 max-w-2xl mx-auto"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.5 }}
          >
            Each saree in our collection represents the pinnacle of craftsmanship and design, carefully curated to bring you the best of traditional and contemporary styles.
          </motion.p>
        </motion.div>
        
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          {products.map((product, index) => (
            <ProductCard key={product.id} product={product} index={index} />
          ))}
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mt-16 relative"
        >
          <SareePatternBorder className="absolute -top-16 left-1/2 transform -translate-x-1/2 text-pink-200 w-full max-w-md opacity-50" />
          
          <motion.button 
            className="px-8 py-3 border-2 border-pink-500 text-pink-600 rounded-md transition-colors duration-300 group relative overflow-hidden"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <span className="relative z-10">View All Sarees</span>
            <motion.svg 
              className="ml-2 w-5 h-5 inline-block relative z-10" 
              fill="none" 
              viewBox="0 0 24 24" 
              stroke="currentColor"
              animate={{ x: [0, 4, 0] }}
              transition={{ 
                duration: 2, 
                repeat: Infinity,
                repeatDelay: 1
              }}
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </motion.svg>
            
            {/* Background fill animation */}
            <motion.div 
              className="absolute inset-0 bg-pink-100 -z-0"
              initial={{ x: "-100%" }}
              whileHover={{ x: 0 }}
              transition={{ duration: 0.3 }}
            />
          </motion.button>
          
          <SareePatternBorder className="absolute -bottom-16 left-1/2 transform -translate-x-1/2 text-pink-200 w-full max-w-md opacity-50 rotate-180" />
        </motion.div>
      </div>
      
      {/* Add a beautiful footer */}
      <div className="py-16 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-t from-pink-50 to-transparent pointer-events-none"></div>
        
        <motion.div 
          className="container mx-auto text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <FlowerMotif className="w-16 h-16 mx-auto text-pink-500 mb-4" />
          <p className="text-pink-600/80 italic">
            "The elegance of a saree is timeless, draping you in heritage and grace."
          </p>
          
          <div className="mt-8 flex justify-center space-x-8">
            <motion.div 
              className="w-2 h-2 rounded-full bg-pink-300"
              animate={{ scale: [1, 1.5, 1] }}
              transition={{ 
                duration: 2, 
                repeat: Infinity,
                repeatDelay: 0.5
              }}
            />
            <motion.div 
              className="w-2 h-2 rounded-full bg-pink-400"
              animate={{ scale: [1, 1.5, 1] }}
              transition={{ 
                duration: 2, 
                repeat: Infinity,
                repeatDelay: 0.5,
                delay: 0.3
              }}
            />
            <motion.div 
              className="w-2 h-2 rounded-full bg-pink-500"
              animate={{ scale: [1, 1.5, 1] }}
              transition={{ 
                duration: 2, 
                repeat: Infinity,
                repeatDelay: 0.5,
                delay: 0.6
              }}
            />
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default CategorySarees; 