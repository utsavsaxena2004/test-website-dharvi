import { motion } from 'framer-motion';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ProductQuickView from './ProductQuickView';

const products = [
  {
    id: 1,
    name: 'Royal Velvet Lehenga',
    price: '₹ 24,999',
    image: 'https://images.unsplash.com/photo-1601571115502-83ca3095735b?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8TGVoZW5nYXxlbnwwfDB8MHx8fDA%3D',
    badge: 'Trending',
    discount: '10% OFF',
    colors: ['#b91c1c', '#fecaca', '#7f1d1d', '#fef2f2'],
    tags: ['velvet', 'royal', 'wedding']
  },
  {
    id: 2,
    name: 'Bridal Embroidered Lehenga',
    price: '₹ 35,999',
    image: 'https://images.unsplash.com/photo-1585166059782-f28143545183?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    badge: 'Premium',
    colors: ['#9d174d', '#fbcfe8', '#500724', '#fdf2f8'],
    tags: ['bridal', 'embroidered', 'wedding']
  },
  {
    id: 3,
    name: 'Designer Party Lehenga',
    price: '₹ 18,499',
    image: 'https://images.unsplash.com/photo-1628744448840-55bdb2497bd4?q=80&w=2080&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    discount: '15% OFF',
    colors: ['#064e3b', '#a7f3d0', '#022c22', '#ecfdf5'],
    tags: ['designer', 'party', 'trendy']
  },
  {
    id: 4,
    name: 'Contemporary Lehenga',
    price: '₹ 16,999',
    image: 'https://images.unsplash.com/photo-1623093949686-6d422a17bd33?q=80&w=1965&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    colors: ['#6d28d9', '#ddd6fe', '#4c1d95', '#f5f3ff'],
    tags: ['contemporary', 'modern', 'casual']
  }
];

// Decorative elements
const MandalaPattern = () => (
  <svg width="120" height="120" viewBox="0 0 120 120" className="absolute opacity-10 text-[#6f0e06]">
    <circle cx="60" cy="60" r="50" fill="none" stroke="currentColor" strokeWidth="0.5" />
    <circle cx="60" cy="60" r="40" fill="none" stroke="currentColor" strokeWidth="0.5" />
    <circle cx="60" cy="60" r="30" fill="none" stroke="currentColor" strokeWidth="0.5" />
    <circle cx="60" cy="60" r="20" fill="none" stroke="currentColor" strokeWidth="0.5" />
    <path d="M60,10 L60,110 M10,60 L110,60 M25,25 L95,95 M25,95 L95,25" stroke="currentColor" strokeWidth="0.5" />
  </svg>
);

const BorderPattern = () => (
  <div className="flex items-center justify-center w-full opacity-40">
    <div className="h-px bg-gradient-to-r from-transparent via-[#6f0e06] to-transparent w-full"></div>
    <div className="flex-shrink-0 mx-4">
      <svg width="60" height="20" viewBox="0 0 60 20" className="text-[#6f0e06]">
        <path d="M0,10 L60,10 M15,5 L30,10 L15,15 M30,5 L45,10 L30,15" stroke="currentColor" fill="none" strokeWidth="0.8" />
      </svg>
    </div>
    <div className="h-px bg-gradient-to-r from-transparent via-[#6f0e06] to-transparent w-full"></div>
  </div>
);

const FlowerPattern = () => (
  <svg width="80" height="80" viewBox="0 0 80 80" className="absolute opacity-15 text-[#6f0e06]">
    <path d="M40,10 Q50,20 40,30 Q30,20 40,10 Z" fill="none" stroke="currentColor" strokeWidth="0.5" />
    <path d="M10,40 Q20,50 30,40 Q20,30 10,40 Z" fill="none" stroke="currentColor" strokeWidth="0.5" />
    <path d="M40,70 Q50,60 40,50 Q30,60 40,70 Z" fill="none" stroke="currentColor" strokeWidth="0.5" />
    <path d="M70,40 Q60,50 50,40 Q60,30 70,40 Z" fill="none" stroke="currentColor" strokeWidth="0.5" />
    <path d="M40,0 Q60,20 40,40 Q20,20 40,0 Z" fill="none" stroke="currentColor" strokeWidth="0.3" />
    <path d="M0,40 Q20,60 40,40 Q20,20 0,40 Z" fill="none" stroke="currentColor" strokeWidth="0.3" />
    <path d="M40,80 Q60,60 40,40 Q20,60 40,80 Z" fill="none" stroke="currentColor" strokeWidth="0.3" />
    <path d="M80,40 Q60,60 40,40 Q60,20 80,40 Z" fill="none" stroke="currentColor" strokeWidth="0.3" />
    <circle cx="40" cy="40" r="5" fill="none" stroke="currentColor" strokeWidth="0.5" />
  </svg>
);

const DecorativeLine = () => (
  <svg width="100" height="10" className="text-[#6f0e06] opacity-30">
    <path d="M0,5 C20,2 40,8 60,5 C80,2 100,8 100,5" stroke="currentColor" fill="none" strokeWidth="0.5" />
  </svg>
);

const LehengaCollection = () => {
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
    <section className="py-16 relative overflow-hidden bg-amber-50/30">
      {/* Decorative background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-10 left-10 opacity-10 animate-pulse-slow">
          <MandalaPattern />
        </div>
        <div className="absolute bottom-10 right-10 opacity-10 animate-pulse-slow">
          <MandalaPattern />
        </div>
        <div className="absolute top-1/3 right-20">
          <FlowerPattern />
        </div>
        <div className="absolute bottom-1/3 left-20">
          <FlowerPattern />
        </div>
      </div>
      
      {/* Border decorations */}
      <div className="absolute top-0 left-0 w-full">
        <BorderPattern />
      </div>
      <div className="absolute bottom-0 left-0 w-full">
        <BorderPattern />
      </div>
      
      {/* Decorative corners */}
      <div className="absolute top-5 right-5 w-20 h-20 border-t border-r border-[#6f0e06]/20 rounded-tr-lg"></div>
      <div className="absolute bottom-5 left-5 w-20 h-20 border-b border-l border-[#6f0e06]/20 rounded-bl-lg"></div>
      
      {/* Main Content */}
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
        className="container mx-auto px-4 relative z-10"
      >
        <div className="flex flex-col md:flex-row justify-between items-center mb-16">
          <div className="order-2 md:order-1 mt-6 md:mt-0">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3, duration: 0.5 }}
              className="flex flex-col items-start"
            >
              <div className="flex items-center space-x-3 mb-2">
                <span className="h-px w-8 bg-[#6f0e06]"></span>
                <span className="text-[#6f0e06] font-medium text-sm uppercase tracking-wide">Royal Heritage</span>
              </div>
              
              <motion.a 
                href="/collections/lehengas" 
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="inline-flex items-center px-6 py-2.5 mt-4 text-sm border border-[#6f0e06] text-[#6f0e06] hover:bg-[#6f0e06] hover:text-white transition-all duration-300 rounded-md group"
              >
                <span>Browse All Lehengas</span>
                <svg className="w-4 h-4 ml-2 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path>
                </svg>
              </motion.a>
            </motion.div>
          </div>
          
          <div className="order-1 md:order-2 text-center md:text-right">
            <motion.h2 
              initial={{ x: 50, opacity: 0 }}
              whileInView={{ x: 0, opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="text-3xl md:text-4xl font-serif text-gray-900 relative inline-block"
            >
              Royal Lehenga Collection
              <motion.div 
                initial={{ width: 0 }}
                whileInView={{ width: '100%' }}
                viewport={{ once: true }}
                transition={{ delay: 0.5, duration: 0.5 }}
                className="absolute bottom-0 right-0 h-[2px] bg-[#6f0e06]"
              />
            </motion.h2>
            <p className="text-gray-600 mt-2 max-w-xl ml-auto">Celebrate your special moments with our handcrafted bridal lehengas</p>
            
            {/* Decorative dots */}
            <div className="flex items-center justify-end space-x-1.5 mt-3">
              <div className="w-1 h-1 rounded-full bg-[#6f0e06] opacity-70"></div>
              <div className="w-1.5 h-1.5 rounded-full bg-[#6f0e06] opacity-80"></div>
              <div className="w-2 h-2 rounded-full bg-[#6f0e06] opacity-90"></div>
              <div className="w-1.5 h-1.5 rounded-full bg-[#6f0e06] opacity-80"></div>
              <div className="w-1 h-1 rounded-full bg-[#6f0e06] opacity-70"></div>
            </div>
          </div>
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
                    className="bg-white text-[#6f0e06] py-2 px-4 rounded-full text-sm font-medium shadow-lg hover:bg-[#6f0e06] hover:text-white transition-colors duration-300 flex items-center space-x-1"
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
                  <div className="absolute top-3 left-3 bg-[#6f0e06] text-white text-xs px-2 py-1 rounded font-medium z-10">
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
                  <h3 className="text-lg font-serif text-gray-900 group-hover:text-[#6f0e06] transition-colors duration-300">
                    {product.name}
                  </h3>
                  <motion.button
                    whileHover={{ scale: 1.2 }}
                    whileTap={{ scale: 0.9 }}
                    className="text-gray-400 hover:text-[#6f0e06] transition-colors duration-300"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"></path>
                    </svg>
                  </motion.button>
                </div>
                
                <div className="flex justify-between items-center mt-2">
                  <p className="text-[#6f0e06] font-medium">{product.price}</p>
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
                  className="w-full py-2 mt-1 text-sm font-medium text-gray-600 hover:text-[#6f0e06] bg-gray-50 hover:bg-gray-100 rounded transition-colors duration-300 flex items-center justify-center space-x-1"
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
              href="/collections/lehengas"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="relative inline-flex items-center px-8 py-3 border border-[#6f0e06] text-[#6f0e06] hover:bg-[#6f0e06] hover:text-white transition-all duration-300 rounded-md group"
            >
              <span className="relative z-10">View Full Collection</span>
              <svg className="w-5 h-5 ml-2 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path>
              </svg>
              
              {/* Button decoration */}
              <div className="absolute -top-1 -bottom-1 -left-1 -right-1 border border-[#6f0e06]/30 rounded-md scale-0 group-hover:scale-100 transition-transform duration-300"></div>
            </motion.a>
            
            {/* Decorative elements around the button */}
            <div className="flex justify-center mt-8 space-x-4">
              <motion.div 
                initial={{ scale: 0 }}
                whileInView={{ scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 1 }}
                className="w-6 h-[1px] bg-[#6f0e06] opacity-40 self-center"
              ></motion.div>
              <motion.div 
                initial={{ scale: 0 }}
                whileInView={{ scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 1.1 }}
                className="w-3 h-3 rounded-full border border-[#6f0e06] opacity-40"
              ></motion.div>
              <motion.div 
                initial={{ scale: 0 }}
                whileInView={{ scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 1.2 }}
                className="w-2 h-2 rounded-full bg-[#6f0e06] opacity-40"
              ></motion.div>
              <motion.div 
                initial={{ scale: 0 }}
                whileInView={{ scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 1.1 }}
                className="w-3 h-3 rounded-full border border-[#6f0e06] opacity-40"
              ></motion.div>
              <motion.div 
                initial={{ scale: 0 }}
                whileInView={{ scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 1 }}
                className="w-6 h-[1px] bg-[#6f0e06] opacity-40 self-center"
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

export default LehengaCollection; 