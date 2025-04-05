import { motion } from 'framer-motion';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ProductQuickView from './ProductQuickView';

const products = [
  {
    id: 1,
    name: 'Pastel Anarkali Suit',
    price: '₹ 9,999',
    image: 'https://images.unsplash.com/photo-1560706834-c8b400a49f3b?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    badge: 'New Arrival',
    discount: '10% OFF',
    colors: ['#4f46e5', '#c7d2fe', '#312e81', '#eef2ff'],
    tags: ['anarkali', 'pastel', 'festive']
  },
  {
    id: 2,
    name: 'Designer Palazzo Suit',
    price: '₹ 12,499',
    image: 'https://images.unsplash.com/photo-1583392522784-3c78841d8a0d?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    badge: 'Bestseller',
    colors: ['#1e40af', '#bfdbfe', '#172554', '#eff6ff'],
    tags: ['palazzo', 'designer', 'casual']
  },
  {
    id: 3,
    name: 'Embroidered Sharara Suit',
    price: '₹ 15,999',
    image: 'https://images.unsplash.com/photo-1617059063772-34532796cdb5?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    discount: '15% OFF',
    colors: ['#7e22ce', '#e9d5ff', '#581c87', '#faf5ff'],
    tags: ['sharara', 'embroidered', 'wedding']
  },
  {
    id: 4,
    name: 'Straight Cut Suit',
    price: '₹ 8,499',
    image: 'https://images.unsplash.com/photo-1620656798579-1984d9e87df7?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    colors: ['#0369a1', '#bae6fd', '#082f49', '#f0f9ff'],
    tags: ['straight cut', 'office', 'casual']
  }
];

// Decorative SVG elements
const FlowerPattern = () => (
  <svg width="60" height="60" viewBox="0 0 60 60" className="text-[#ba1a5d] opacity-10">
    <g>
      <path d="M30,10 Q40,20 30,30 Q20,20 30,10" fill="currentColor" />
      <path d="M10,30 Q20,40 30,30 Q20,20 10,30" fill="currentColor" />
      <path d="M30,50 Q40,40 30,30 Q20,40 30,50" fill="currentColor" />
      <path d="M50,30 Q40,40 30,30 Q40,20 50,30" fill="currentColor" />
      <circle cx="30" cy="30" r="5" fill="currentColor" />
    </g>
  </svg>
);

const WavePattern = ({ className }) => (
  <svg viewBox="0 0 200 20" className={`${className} text-[#ba1a5d] opacity-15`}>
    <path d="M0,10 Q40,0 80,10 Q120,20 160,10 Q200,0 240,10" fill="none" stroke="currentColor" strokeWidth="0.5" />
    <path d="M0,10 Q40,20 80,10 Q120,0 160,10 Q200,20 240,10" fill="none" stroke="currentColor" strokeWidth="0.5" />
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

const CornerPattern = () => (
  <svg width="40" height="40" viewBox="0 0 40 40" className="text-[#ba1a5d] opacity-20">
    <path d="M0,0 Q20,0 20,20 Q20,40 40,40" fill="none" stroke="currentColor" strokeWidth="0.8" />
    <path d="M5,0 Q25,0 25,25 Q25,40 40,35" fill="none" stroke="currentColor" strokeWidth="0.8" />
    <path d="M10,0 Q30,5 30,30 Q30,35 35,35" fill="none" stroke="currentColor" strokeWidth="0.8" />
  </svg>
);

const StarPattern = () => (
  <svg width="70" height="70" viewBox="0 0 70 70" className="text-[#ba1a5d] opacity-15">
    <path d="M35,0 L40,30 L70,35 L40,40 L35,70 L30,40 L0,35 L30,30 Z" fill="none" stroke="currentColor" strokeWidth="0.5" />
    <path d="M35,10 L38,30 L60,35 L38,40 L35,60 L32,40 L10,35 L32,30 Z" fill="none" stroke="currentColor" strokeWidth="0.5" />
    <path d="M35,20 L36,30 L50,35 L36,40 L35,50 L34,40 L20,35 L34,30 Z" fill="none" stroke="currentColor" strokeWidth="0.5" />
    <circle cx="35" cy="35" r="3" fill="currentColor" />
  </svg>
);

const DecorativeLine = () => (
  <svg width="100" height="10" className="text-[#ba1a5d] opacity-30">
    <path d="M0,5 C20,2 40,8 60,5 C80,2 100,8 100,5" stroke="currentColor" fill="none" strokeWidth="0.5" />
  </svg>
);

const SuitCollection = () => {
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
    <section className="py-16 relative overflow-hidden bg-blue-50/30">
      {/* Decorative background elements */}
      <div className="absolute inset-0 overflow-hidden opacity-10">
        <div className="absolute top-10 left-10 animate-float">
          <FlowerPattern />
        </div>
        <div className="absolute bottom-10 right-10 animate-float">
          <FlowerPattern />
        </div>
        <div className="absolute top-1/3 right-20">
          <StarPattern />
        </div>
        <div className="absolute bottom-1/3 left-20 transform rotate-45">
          <StarPattern />
        </div>
      </div>
      
      {/* Border decorations */}
      <div className="absolute top-0 left-0 w-full">
        <BorderPattern />
      </div>
      
      <div className="absolute left-0 top-1/3 w-full opacity-10">
        <WavePattern className="w-full h-10" />
      </div>
      <div className="absolute left-0 bottom-1/3 w-full transform rotate-180 opacity-10">
        <WavePattern className="w-full h-10" />
      </div>
      
      {/* Decorative corners */}
      <div className="absolute top-5 left-5 transform -rotate-90">
        <CornerPattern />
      </div>
      <div className="absolute bottom-5 right-5 transform rotate-90">
        <CornerPattern />
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
        className="container mx-auto px-4 relative z-10"
      >
        <div className="flex flex-col md:flex-row justify-between items-center mb-16">
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
                <span className="text-[#ba1a5d] font-medium text-sm uppercase tracking-wide">Modern Grace</span>
              </div>
            </motion.div>
            
            <motion.h2
              initial={{ x: -50, opacity: 0 }}
              whileInView={{ x: 0, opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="text-3xl md:text-4xl font-serif text-gray-900 relative inline-block"
            >
              Elegant Suit Collection
              <motion.div
                initial={{ width: 0 }}
                whileInView={{ width: '100%' }}
                viewport={{ once: true }}
                transition={{ delay: 0.5, duration: 0.5 }}
                className="absolute bottom-0 left-0 h-[2px] bg-[#ba1a5d]"
              />
            </motion.h2>
            
            <p className="text-gray-600 mt-2 max-w-xl">
              Contemporary designs that blend tradition with modern aesthetics
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
              href="/collections/suits" 
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="inline-flex items-center px-6 py-2.5 text-sm border border-[#ba1a5d] text-[#ba1a5d] hover:bg-[#ba1a5d] hover:text-white transition-all duration-300 rounded-md group"
            >
              <span>Browse All Suits</span>
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
              href="/collections/suits"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="relative inline-flex items-center px-8 py-3 border border-[#ba1a5d] text-[#ba1a5d] hover:bg-[#ba1a5d] hover:text-white transition-all duration-300 rounded-md group overflow-hidden"
            >
              <span className="relative z-10">View Full Collection</span>
              <svg className="w-5 h-5 ml-2 relative z-10 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path>
              </svg>
              
              {/* Button animation */}
              <div className="absolute inset-0 bg-[#ba1a5d] transform -translate-x-full group-hover:translate-x-0 transition-transform duration-300 z-0"></div>
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

export default SuitCollection; 