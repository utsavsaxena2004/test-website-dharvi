import { motion } from 'framer-motion';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ProductQuickView from './ProductQuickView';

const products = [
  {
    id: 1,
    name: 'Printed Cotton Kurti',
    price: '₹ 2,499',
    image: 'https://images.unsplash.com/photo-1614093302619-2bb5d6b33aac?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    badge: 'Bestseller',
    discount: '20% OFF',
    colors: ['#059669', '#a7f3d0', '#065f46', '#ecfdf5'],
    tags: ['cotton', 'printed', 'casual']
  },
  {
    id: 2,
    name: 'Embroidered Straight Kurti',
    price: '₹ 3,299',
    image: 'https://images.unsplash.com/photo-1582738411706-bfc8e691d1c2?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    badge: 'New Arrival',
    colors: ['#0891b2', '#a5f3fc', '#155e75', '#ecfeff'],
    tags: ['embroidered', 'straight', 'festive']
  },
  {
    id: 3,
    name: 'Designer A-Line Kurti',
    price: '₹ 2,999',
    image: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=1920&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    discount: '15% OFF',
    colors: ['#0ea5e9', '#bae6fd', '#0369a1', '#f0f9ff'],
    tags: ['a-line', 'designer', 'party']
  },
  {
    id: 4,
    name: 'Casual Daily Kurti',
    price: '₹ 1,999',
    image: 'https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    colors: ['#14b8a6', '#99f6e4', '#115e59', '#f0fdfa'],
    tags: ['casual', 'daily', 'comfortable']
  }
];

// Decorative elements
const GeometricPattern = ({ className }) => (
  <svg viewBox="0 0 100 100" className={`${className} text-[#ba1a5d] opacity-10`}>
    <rect x="0" y="0" width="30" height="30" stroke="currentColor" fill="none" strokeWidth="0.8" />
    <rect x="35" y="0" width="30" height="30" stroke="currentColor" fill="none" strokeWidth="0.8" />
    <rect x="70" y="0" width="30" height="30" stroke="currentColor" fill="none" strokeWidth="0.8" />
    <rect x="0" y="35" width="30" height="30" stroke="currentColor" fill="none" strokeWidth="0.8" />
    <rect x="35" y="35" width="30" height="30" stroke="currentColor" fill="none" strokeWidth="0.8" />
    <rect x="70" y="35" width="30" height="30" stroke="currentColor" fill="none" strokeWidth="0.8" />
    <rect x="0" y="70" width="30" height="30" stroke="currentColor" fill="none" strokeWidth="0.8" />
    <rect x="35" y="70" width="30" height="30" stroke="currentColor" fill="none" strokeWidth="0.8" />
    <rect x="70" y="70" width="30" height="30" stroke="currentColor" fill="none" strokeWidth="0.8" />
  </svg>
);

const DiamondPattern = ({ className }) => (
  <svg viewBox="0 0 60 60" className={`${className} text-[#ba1a5d] opacity-10`}>
    <path d="M30,0 L60,30 L30,60 L0,30 Z" fill="none" stroke="currentColor" strokeWidth="0.8" />
    <path d="M30,10 L50,30 L30,50 L10,30 Z" fill="none" stroke="currentColor" strokeWidth="0.8" />
    <path d="M30,20 L40,30 L30,40 L20,30 Z" fill="none" stroke="currentColor" strokeWidth="0.8" />
    <circle cx="30" cy="30" r="3" fill="currentColor" />
  </svg>
);

const BorderPattern = () => (
  <div className="flex items-center justify-center w-full opacity-40">
    <div className="h-px bg-gradient-to-r from-transparent via-[#ba1a5d] to-transparent w-full"></div>
    <div className="flex-shrink-0 mx-4">
      <svg width="60" height="20" viewBox="0 0 60 20" className="text-[#ba1a5d]">
        <path d="M0,10 L60,10 M15,5 L30,10 L15,15 M30,5 L45,10 L30,15" stroke="currentColor" fill="none" strokeWidth="0.8" />
      </svg>
    </div>
    <div className="h-px bg-gradient-to-r from-transparent via-[#ba1a5d] to-transparent w-full"></div>
  </div>
);

const DecorativeFrames = () => (
  <svg width="80" height="80" viewBox="0 0 80 80" className="text-[#ba1a5d] opacity-15">
    <rect x="5" y="5" width="70" height="70" stroke="currentColor" fill="none" strokeWidth="0.5" />
    <rect x="15" y="15" width="50" height="50" stroke="currentColor" fill="none" strokeWidth="0.5" />
    <rect x="25" y="25" width="30" height="30" stroke="currentColor" fill="none" strokeWidth="0.5" />
    <circle cx="40" cy="40" r="5" fill="none" stroke="currentColor" strokeWidth="0.5" />
  </svg>
);

const DecorativeLine = () => (
  <svg width="100" height="10" className="text-[#ba1a5d] opacity-30">
    <path d="M0,5 C20,2 40,8 60,5 C80,2 100,8 100,5" stroke="currentColor" fill="none" strokeWidth="0.5" />
  </svg>
);

const KurtiCollection = () => {
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isQuickViewOpen, setIsQuickViewOpen] = useState(false);
  const navigate = useNavigate();
  
  const openQuickView = (product) => {
    setSelectedProduct(product);
    setIsQuickViewOpen(true);
  };

  // Function to add product to cart and navigate to cart page
  const addToCart = (product, event) => {
    event.stopPropagation(); // Prevent opening quick view
    
    // In a real app, you would dispatch to your cart state management
    // For example: dispatch(addToCart(product))
    console.log('Adding to cart:', product);
    
    // Navigate to cart page
    navigate('/cart');
  };

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
    hidden: { y: 30, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { 
        type: "spring",
        stiffness: 100,
        damping: 12
      }
    }
  };
  
  return (
    <section className="py-16 relative overflow-hidden bg-emerald-50/30">
      {/* Decorative background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 left-20 opacity-20 animate-float">
          <GeometricPattern className="w-40 h-40" />
        </div>
        <div className="absolute bottom-20 right-20 opacity-20 animate-float">
          <GeometricPattern className="w-40 h-40" />
        </div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 opacity-10 animate-spin-slow">
          <DiamondPattern className="w-80 h-80" />
        </div>
        <div className="absolute top-1/4 right-1/4 opacity-15">
          <DecorativeFrames />
        </div>
        <div className="absolute bottom-1/4 left-1/4 opacity-15">
          <DecorativeFrames />
        </div>
      </div>
      
      {/* Border decorations */}
      <div className="absolute top-0 left-0 w-full">
        <BorderPattern />
      </div>

      {/* Decorative corners */}
      <div className="absolute top-5 left-5 w-20 h-20 border-t border-l border-[#ba1a5d]/20 rounded-tl-lg"></div>
      <div className="absolute bottom-5 right-5 w-20 h-20 border-b border-r border-[#ba1a5d]/20 rounded-br-lg"></div>
      
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
        className="container mx-auto px-4 relative z-10"
      >
        <div className="text-center mb-16">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="mb-3"
          >
            <div className="flex items-center justify-center space-x-3 mb-2">
              <span className="h-px w-8 bg-[#ba1a5d]"></span>
              <span className="text-[#ba1a5d] font-medium text-sm uppercase tracking-wide">Effortless Chic</span>
              <span className="h-px w-8 bg-[#ba1a5d]"></span>
            </div>
          </motion.div>
          
          <motion.h2
            initial={{ opacity: 0, y: -20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-3xl md:text-4xl font-serif text-gray-900 inline-block relative"
          >
            Contemporary Kurti Collection
            <motion.div
              initial={{ width: 0 }}
              whileInView={{ width: '100%' }}
              viewport={{ once: true }}
              transition={{ delay: 0.5, duration: 0.5 }}
              className="absolute bottom-0 left-0 h-[2px] bg-[#ba1a5d]"
            />
          </motion.h2>
          
          <p className="text-gray-600 mt-2 max-w-2xl mx-auto">
            Everyday elegance for the modern woman, blending comfort with style
          </p>
          
          {/* Decorative dots */}
          <div className="flex items-center justify-center space-x-1.5 mt-3">
            <div className="w-1 h-1 rounded-full bg-[#ba1a5d] opacity-70"></div>
            <div className="w-1.5 h-1.5 rounded-full bg-[#ba1a5d] opacity-80"></div>
            <div className="w-2 h-2 rounded-full bg-[#ba1a5d] opacity-90"></div>
            <div className="w-1.5 h-1.5 rounded-full bg-[#ba1a5d] opacity-80"></div>
            <div className="w-1 h-1 rounded-full bg-[#ba1a5d] opacity-70"></div>
          </div>
          
          <motion.a 
            href="/collections/kurtis" 
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="inline-flex items-center px-6 py-2.5 mt-6 text-sm border border-[#ba1a5d] text-[#ba1a5d] hover:bg-[#ba1a5d] hover:text-white transition-all duration-300 rounded-md group"
          >
            <span>Browse All Kurtis</span>
            <svg className="w-4 h-4 ml-2 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path>
            </svg>
          </motion.a>
        </div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible" 
          viewport={{ once: true }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8"
        >
          {products.map((product, index) => (
            <motion.div
              key={product.id}
              variants={itemVariants}
              whileHover={{ y: -10 }}
              className="group relative overflow-hidden bg-white rounded-lg shadow-sm hover:shadow-xl transition-all duration-300"
            >
              {/* Product image and overlay */}
              <div className="relative h-80 overflow-hidden">
                <motion.div
                  whileHover={{ scale: 1.1 }}
                  transition={{ duration: 0.6 }}
                  className="h-full"
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
                
                {/* Quick action button with onClick handler */}
                <div className="absolute bottom-4 left-0 right-0 flex justify-center opacity-0 transform translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300">
                  <motion.button 
                    onClick={() => openQuickView(product)}
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
                
                {/* Badges */}
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
              </div>
              
              {/* Product info */}
              <div className="p-4">
                <div className="flex justify-between items-center mb-1">
                  <h3 className="text-lg font-serif text-gray-900 group-hover:text-[#ba1a5d] transition-colors duration-300">
                    {product.name}
                  </h3>
                  <motion.button
                    whileHover={{ scale: 1.2 }}
                    whileTap={{ scale: 0.9 }}
                    className="text-gray-400 hover:text-[#ba1a5d] transition-colors duration-300"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"></path>
                    </svg>
                  </motion.button>
                </div>
                
                <div className="flex justify-between items-center mt-2">
                  <p className="text-[#ba1a5d] font-medium">{product.price}</p>
                  <div className="flex items-center space-x-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <svg key={star} className="w-4 h-4 text-amber-400" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
                      </svg>
                    ))}
                  </div>
                </div>
                
                {/* Subtle divider */}
                <div className="w-full h-px bg-gray-100 my-3"></div>
                
                {/* Add to cart button */}
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={(e) => addToCart(product, e)}
                  className="w-full py-2 mt-1 text-sm font-medium text-gray-600 hover:text-[#ba1a5d] bg-gray-50 hover:bg-gray-100 rounded transition-colors duration-300 flex items-center justify-center space-x-1"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"></path>
                  </svg>
                  <span>Add to Cart</span>
                </motion.button>
              </div>
            </motion.div>
          ))}
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4, duration: 0.5 }}
          className="flex justify-center mt-16"
        >
          <motion.div className="text-center">
            <div className="flex justify-center mb-4">
              <DecorativeLine />
            </div>
            <motion.a
              href="/collections/kurtis"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="relative inline-flex items-center px-8 py-3 border border-[#ba1a5d] text-[#ba1a5d] hover:bg-[#ba1a5d] hover:text-white transition-all duration-300 rounded-md group"
            >
              <span>View Full Collection</span>
              <svg className="w-5 h-5 ml-2 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path>
              </svg>
              
              {/* Animated circles on hover */}
              <div className="absolute -top-1 -left-1 w-3 h-3 rounded-full bg-[#ba1a5d]/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <div className="absolute -bottom-1 -right-1 w-3 h-3 rounded-full bg-[#ba1a5d]/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </motion.a>
            
            {/* Decorative elements around the button */}
            <div className="flex justify-center mt-8 space-x-4">
              <motion.div 
                initial={{ scale: 0 }}
                whileInView={{ scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 1 }}
                className="w-6 h-[1px] bg-[#ba1a5d] opacity-40 self-center"
              ></motion.div>
              <motion.div 
                initial={{ scale: 0 }}
                whileInView={{ scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 1.1 }}
                className="w-3 h-3 rounded-full border border-[#ba1a5d] opacity-40"
              ></motion.div>
              <motion.div 
                initial={{ scale: 0 }}
                whileInView={{ scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 1.2 }}
                className="w-2 h-2 rounded-full bg-[#ba1a5d] opacity-40"
              ></motion.div>
              <motion.div 
                initial={{ scale: 0 }}
                whileInView={{ scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 1.1 }}
                className="w-3 h-3 rounded-full border border-[#ba1a5d] opacity-40"
              ></motion.div>
              <motion.div 
                initial={{ scale: 0 }}
                whileInView={{ scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 1 }}
                className="w-6 h-[1px] bg-[#ba1a5d] opacity-40 self-center"
              ></motion.div>
            </div>
          </motion.div>
        </motion.div>
      </motion.div>
      
      {/* Product Quick View Modal */}
      <ProductQuickView 
        product={selectedProduct} 
        isOpen={isQuickViewOpen} 
        onClose={() => setIsQuickViewOpen(false)} 
      />
    </section>
  );
};

export default KurtiCollection; 