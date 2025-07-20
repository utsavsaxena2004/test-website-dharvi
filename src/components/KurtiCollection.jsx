import { motion } from 'framer-motion';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ProductQuickView from './ProductQuickView';
import ProductCard from './ProductCard';

const products = [
  {
    id: 1,
    name: 'Printed Cotton Kurti',
    price: 2499,
    image_urls: ['https://images.unsplash.com/photo-1614093302619-2bb5d6b33aac?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'],
    badge: 'Bestseller',
    discount: '20% OFF',
    colors: ['#059669', '#a7f3d0', '#065f46', '#ecfdf5'],
    sizes: ['S', 'M', 'L', 'XL'],
    tags: ['cotton', 'printed', 'casual']
  },
  {
    id: 2,
    name: 'Embroidered Straight Kurti',
    price: 3299,
    image_urls: ['https://images.unsplash.com/photo-1582738411706-bfc8e691d1c2?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'],
    badge: 'New Arrival',
    colors: ['#0891b2', '#a5f3fc', '#155e75', '#ecfeff'],
    sizes: ['S', 'M', 'L', 'XL'],
    tags: ['embroidered', 'straight', 'festive']
  },
  {
    id: 3,
    name: 'Designer A-Line Kurti',
    price: 2999,
    image_urls: ['https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=1920&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'],
    discount: '15% OFF',
    colors: ['#0ea5e9', '#bae6fd', '#0369a1', '#f0f9ff'],
    sizes: ['S', 'M', 'L', 'XL'],
    tags: ['a-line', 'designer', 'party']
  },
  {
    id: 4,
    name: 'Casual Daily Kurti',
    price: 1999,
    image_urls: ['https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'],
    colors: ['#14b8a6', '#99f6e4', '#115e59', '#f0fdfa'],
    sizes: ['S', 'M', 'L', 'XL'],
    tags: ['casual', 'daily', 'comfortable']
  }
];

// Decorative elements
const decorativeElement = () => (
  <div className="flex items-center justify-center space-x-3 mb-4">
    <div className="w-8 h-8 rounded-full border-2 border-[#6f0e06] flex items-center justify-center">
      <div className="w-3 h-3 bg-[#6f0e06] rounded-full"></div>
    </div>
    <div className="w-12 h-px bg-[#6f0e06]"></div>
    <div className="w-4 h-4 border-2 border-[#6f0e06] transform rotate-45"></div>
    <div className="w-12 h-px bg-[#6f0e06]"></div>
    <div className="w-8 h-8 rounded-full border-2 border-[#6f0e06] flex items-center justify-center">
      <div className="w-3 h-3 bg-[#6f0e06] rounded-full"></div>
    </div>
  </div>
);

const GeometricPattern = () => (
  <svg viewBox="0 0 100 100" className="w-32 h-32 text-emerald-600 opacity-10">
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

const DiamondPattern = () => (
  <svg viewBox="0 0 60 60" className="w-24 h-24 text-emerald-600 opacity-10">
    <path d="M30,0 L60,30 L30,60 L0,30 Z" fill="none" stroke="currentColor" strokeWidth="0.8" />
    <path d="M30,10 L50,30 L30,50 L10,30 Z" fill="none" stroke="currentColor" strokeWidth="0.8" />
    <path d="M30,20 L40,30 L30,40 L20,30 Z" fill="none" stroke="currentColor" strokeWidth="0.8" />
    <circle cx="30" cy="30" r="3" fill="currentColor" />
  </svg>
);

const borderPattern = (
  <div className="flex items-center justify-center w-full">
    <div className="h-px bg-[#6f0e06]/30 w-full"></div>
    <div className="px-4">
      <svg width="60" height="20" viewBox="0 0 60 20" className="text-[#6f0e06] opacity-30">
        <path d="M0,10 L60,10 M15,5 L30,10 L15,15 M30,5 L45,10 L30,15" stroke="currentColor" fill="none" strokeWidth="0.8" />
      </svg>
    </div>
    <div className="h-px bg-[#6f0e06]/30 w-full"></div>
  </div>
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
    <section className="py-16 bg-gradient-to-br from-emerald-50 via-white to-teal-50 relative overflow-hidden">
      {/* Background Decorative Elements */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-10 left-10">
          <GeometricPattern />
        </div>
        <div className="absolute bottom-10 right-10">
          <GeometricPattern />
        </div>
        <div className="absolute top-1/2 left-5 transform -translate-y-1/2">
          <DiamondPattern />
        </div>
        <div className="absolute top-1/4 right-5">
          <DiamondPattern />
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        {/* Header Section */}
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
                <span className="h-px w-8 bg-[#6f0e06]"></span>
                <span className="text-[#6f0e06] font-medium text-sm uppercase tracking-wide">Contemporary Style</span>
              </div>
            </motion.div>
            
            <motion.h2 
              initial={{ x: -50, opacity: 0 }}
              whileInView={{ x: 0, opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="text-3xl md:text-4xl font-serif text-gray-900 relative inline-block"
            >
              Elegant Kurti Collection
              <motion.div 
                initial={{ width: 0 }}
                whileInView={{ width: '100%' }}
                viewport={{ once: true }}
                transition={{ delay: 0.5, duration: 0.5 }}
                className="absolute bottom-0 left-0 h-[2px] bg-[#6f0e06]"
              />
            </motion.h2>
            
            <p className="text-gray-600 mt-2 max-w-xl">
              Discover comfort meets style in our curated kurti collection, perfect for every occasion
            </p>
            
            {/* Decorative dots */}
            <div className="flex items-center space-x-1 mt-4">
              <div className="w-1 h-1 rounded-full bg-[#6f0e06] opacity-70"></div>
              <div className="w-1.5 h-1.5 rounded-full bg-[#6f0e06] opacity-80"></div>
              <div className="w-2 h-2 rounded-full bg-[#6f0e06] opacity-90"></div>
              <div className="w-12 h-0.5 bg-[#6f0e06]"></div>
              <div className="w-2 h-2 rounded-full bg-[#6f0e06] opacity-90"></div>
              <div className="w-1.5 h-1.5 rounded-full bg-[#6f0e06] opacity-80"></div>
              <div className="w-1 h-1 rounded-full bg-[#6f0e06] opacity-70"></div>
            </div>
          </div>
          
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="mt-6 md:mt-0"
          >
            <div className="flex items-center space-x-4">
              <button className="p-3 rounded-full bg-white shadow-lg hover:shadow-xl transition-shadow duration-300">
                <svg className="w-6 h-6 text-[#6f0e06]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"></path>
                </svg>
              </button>
              <button className="p-3 rounded-full bg-white shadow-lg hover:shadow-xl transition-shadow duration-300">
                <svg className="w-6 h-6 text-[#6f0e06]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z"></path>
                </svg>
              </button>
            </div>
          </motion.div>
        </div>
        
        {/* Border Pattern */}
        <div className="mb-8">
          {borderPattern}
        </div>

        {/* Products Grid */}
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12"
        >
          {products.map((product, index) => (
            <motion.div
              key={product.id}
              variants={itemVariants}
            >
              <ProductCard
                product={product}
                onQuickView={openQuickView}
                onAddToCart={addToCart}
              />
            </motion.div>
          ))}
        </motion.div>

        {/* View All Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center"
        >
          <div className="flex justify-center mb-4">
            {decorativeElement()}
          </div>
          <motion.a 
            href="/collections/kurtis" 
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="inline-flex items-center px-8 py-3 border border-[#6f0e06] text-[#6f0e06] hover:bg-[#6f0e06] hover:text-white transition-all duration-300 rounded-md group"
          >
            <span>View Full Collection</span>
            <svg className="w-5 h-5 ml-2 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path>
            </svg>
          </motion.a>
        </motion.div>
      </div>
      
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