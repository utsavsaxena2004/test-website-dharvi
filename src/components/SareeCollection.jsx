import { motion } from 'framer-motion';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ProductQuickView from './ProductQuickView';

const products = [
  {
    id: 1,
    name: 'Banarasi Silk Saree',
    price: '₹ 12,499',
    image: 'https://images.unsplash.com/photo-1610189031585-fd499562e6c5?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&q=80',
    badge: 'New',
    discount: '15% OFF',
    colors: ['#b91c1c', '#fecaca', '#7f1d1d', '#fef2f2'],
    tags: ['banarasi', 'silk', 'wedding']
  },
  {
    id: 2,
    name: 'Kanjivaram Silk Saree',
    price: '₹ 15,999',
    image: 'https://images.unsplash.com/photo-1659293554631-d7a38642c5e3?q=80&w=2972&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    badge: 'Best Seller',
    colors: ['#2563eb', '#bfdbfe', '#1e3a8a', '#eff6ff'],
    tags: ['kanjivaram', 'silk', 'festive']
  },
  {
    id: 3,
    name: 'Chanderi Saree',
    price: '₹ 8,999',
    image: 'https://images.unsplash.com/photo-1604503970771-3a4b7f4b7ee3?q=80&w=2942&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    discount: '20% OFF',
    colors: ['#65a30d', '#d9f99d', '#3f6212', '#f7fee7'],
    tags: ['chanderi', 'casual', 'lightweight']
  },
  {
    id: 4,
    name: 'Pure Georgette Saree',
    price: '₹ 10,499',
    image: 'https://images.unsplash.com/photo-1621135802920-133df287f89c?q=80&w=2970&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    colors: ['#9333ea', '#e9d5ff', '#581c87', '#faf5ff'],
    tags: ['georgette', 'party', 'elegant']
  }
];

// Decorative elements
const decorativeElement = () => (
  <svg width="100" height="20" className="text-[#ba1a5d] opacity-30">
    <path d="M0,10 C20,0 40,20 60,10 C80,0 100,20 100,10" stroke="currentColor" fill="none" strokeWidth="0.5" />
    <path d="M0,10 C20,20 40,0 60,10 C80,20 100,0 100,10" stroke="currentColor" fill="none" strokeWidth="0.5" />
  </svg>
);

const paisleyPattern = (
  <svg width="120" height="120" viewBox="0 0 120 120" className="text-[#ba1a5d] opacity-10">
    <path d="M60,20 Q80,5 90,20 Q100,40 80,60 Q60,80 40,70 Q20,60 30,40 Q40,20 60,20" fill="none" stroke="currentColor" strokeWidth="0.8" />
    <path d="M40,40 Q50,30 60,40 Q70,50 60,60 Q50,70 40,60 Q30,50 40,40" fill="none" stroke="currentColor" strokeWidth="0.8" />
    <path d="M90,90 Q100,80 95,70 Q85,60 75,70 Q65,80 75,90 Q85,100 90,90" fill="none" stroke="currentColor" strokeWidth="0.8" />
    <circle cx="60" cy="60" r="40" fill="none" stroke="currentColor" strokeWidth="0.5" strokeDasharray="1,3" />
  </svg>
);

const lotusPattern = (
  <svg width="100" height="100" viewBox="0 0 100 100" className="text-[#ba1a5d] opacity-15">
    <path d="M50,10 Q60,30 50,50 Q40,30 50,10" fill="none" stroke="currentColor" strokeWidth="0.8" />
    <path d="M50,10 Q70,30 50,50 Q30,30 50,10" fill="none" stroke="currentColor" strokeWidth="0.5" />
    <path d="M10,50 Q30,60 50,50 Q30,40 10,50" fill="none" stroke="currentColor" strokeWidth="0.8" />
    <path d="M10,50 Q30,70 50,50 Q30,30 10,50" fill="none" stroke="currentColor" strokeWidth="0.5" />
    <path d="M50,90 Q60,70 50,50 Q40,70 50,90" fill="none" stroke="currentColor" strokeWidth="0.8" />
    <path d="M50,90 Q70,70 50,50 Q30,70 50,90" fill="none" stroke="currentColor" strokeWidth="0.5" />
    <path d="M90,50 Q70,60 50,50 Q70,40 90,50" fill="none" stroke="currentColor" strokeWidth="0.8" />
    <path d="M90,50 Q70,70 50,50 Q70,30 90,50" fill="none" stroke="currentColor" strokeWidth="0.5" />
  </svg>
);

const borderPattern = (
  <div className="flex items-center justify-center w-full">
    <div className="h-px bg-[#ba1a5d]/30 w-full"></div>
    <div className="px-4">
      <svg width="60" height="20" viewBox="0 0 60 20" className="text-[#ba1a5d] opacity-30">
        <path d="M0,10 L60,10 M15,5 L30,10 L15,15 M30,5 L45,10 L30,15" stroke="currentColor" fill="none" strokeWidth="0.8" />
      </svg>
    </div>
    <div className="h-px bg-[#ba1a5d]/30 w-full"></div>
  </div>
);

const SareeCollection = () => {
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
    console.log('Navigating to cart page...');
    
    // Navigate to cart page
    navigate('/cart');
    
    // Additional debugging
    setTimeout(() => {
      console.log('Current location after navigation:', window.location.pathname);
    }, 100);
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
    <section className="py-16 relative overflow-hidden bg-rose-50/30">
      {/* Decorative background elements */}
      <div className="absolute inset-0 overflow-hidden opacity-5">
        <div className="absolute top-0 left-0 w-40 h-40 transform rotate-45">{paisleyPattern}</div>
        <div className="absolute bottom-0 right-0 w-40 h-40 transform -rotate-45">{paisleyPattern}</div>
        <div className="absolute top-1/3 right-10">{lotusPattern}</div>
        <div className="absolute bottom-1/3 left-10">{lotusPattern}</div>
      </div>
      
      {/* Border decorations */}
      <div className="absolute top-0 left-0 w-full">{borderPattern}</div>
      
      {/* Additional decorative elements */}
      <div className="absolute top-10 right-10 rotate-45 opacity-20">{decorativeElement()}</div>
      <div className="absolute bottom-10 left-10 -rotate-45 opacity-20">{decorativeElement()}</div>
      
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
        <div className="flex flex-col md:flex-row justify-between items-center mb-12">
          <div>
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="mb-3"
            >
              <div className="flex items-center space-x-3 mb-2">
                <span className="h-px w-8 bg-[#ba1a5d]"></span>
                <span className="text-[#ba1a5d] font-medium text-sm uppercase tracking-wide">Traditional Elegance</span>
              </div>
            </motion.div>
            
            <motion.h2 
              initial={{ x: -50, opacity: 0 }}
              whileInView={{ x: 0, opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="text-3xl md:text-4xl font-serif text-gray-900 relative inline-block"
            >
              Exquisite Saree Collection
              <motion.div 
                initial={{ width: 0 }}
                whileInView={{ width: '100%' }}
                viewport={{ once: true }}
                transition={{ delay: 0.5, duration: 0.5 }}
                className="absolute bottom-0 left-0 h-[2px] bg-[#ba1a5d]"
              />
            </motion.h2>
            
            <p className="text-gray-600 mt-2 max-w-xl">
              Timeless craftsmanship meets contemporary elegance in our curated saree collection
            </p>
            
            {/* Decorative dots */}
            <div className="flex items-center space-x-1.5 mt-3">
              <div className="w-1 h-1 rounded-full bg-[#ba1a5d] opacity-70"></div>
              <div className="w-1.5 h-1.5 rounded-full bg-[#ba1a5d] opacity-80"></div>
              <div className="w-2 h-2 rounded-full bg-[#ba1a5d] opacity-90"></div>
              <div className="w-1.5 h-1.5 rounded-full bg-[#ba1a5d] opacity-80"></div>
              <div className="w-1 h-1 rounded-full bg-[#ba1a5d] opacity-70"></div>
            </div>
          </div>
          
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3, duration: 0.5 }}
            className="mt-6 md:mt-0"
          >
            <motion.a 
              href="/collections/sarees" 
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="inline-flex items-center px-6 py-2.5 text-sm border border-[#ba1a5d] text-[#ba1a5d] hover:bg-[#ba1a5d] hover:text-white transition-all duration-300 rounded-md group"
            >
              <span>Browse All Sarees</span>
              <svg className="w-4 h-4 ml-2 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path>
              </svg>
            </motion.a>
          </motion.div>
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
                <div 
                  className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                ></div>
                
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
              {decorativeElement()}
            </div>
            <motion.a 
              href="/collections/sarees" 
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="inline-flex items-center px-8 py-3 border border-[#ba1a5d] text-[#ba1a5d] hover:bg-[#ba1a5d] hover:text-white transition-all duration-300 rounded-md group"
            >
              <span>View Full Collection</span>
              <svg className="w-5 h-5 ml-2 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path>
              </svg>
            </motion.a>
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

export default SareeCollection; 