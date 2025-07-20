import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabaseService } from '../services/supabaseService';
import ProductQuickView from './ProductQuickView';
import ProductCard from './ProductCard';

const DynamicProductCollection = ({ 
  categorySlug, 
  title, 
  subtitle, 
  showCount = 4,
  showViewAllButton = true,
  className = ""
}) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isQuickViewOpen, setIsQuickViewOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        let data;
        
        if (categorySlug) {
          // Get category first, then filter products
          const categories = await supabaseService.getCategories();
          const category = categories.find(cat => cat.slug === categorySlug);
          
          if (category) {
            data = await supabaseService.getProducts({ category_id: category.id });
          } else {
            data = [];
          }
        } else {
          // Get all products if no category specified
          data = await supabaseService.getProducts();
        }
        
        setProducts(data.slice(0, showCount));
      } catch (error) {
        console.error('Error fetching products:', error);
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [categorySlug, showCount]);

  const openQuickView = (product) => {
    setSelectedProduct(product);
    setIsQuickViewOpen(true);
  };

  const addToCart = (product, event) => {
    event.stopPropagation();
    console.log('Adding to cart:', product);
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

  if (loading) {
    return (
      <section className={`py-20 bg-gradient-to-br from-gray-50 to-white ${className}`}>
        <div className="container mx-auto px-4">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-300 rounded w-64 mx-auto mb-4"></div>
            <div className="h-4 bg-gray-300 rounded w-96 mx-auto mb-16"></div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-16">
              {Array.from({ length: showCount }).map((_, i) => (
                <div key={i}>
                  <div className="h-80 bg-gray-300 rounded mb-4"></div>
                  <div className="h-4 bg-gray-300 rounded w-3/4 mx-auto mb-2"></div>
                  <div className="h-4 bg-gray-300 rounded w-1/2 mx-auto"></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    );
  }

  if (products.length === 0) {
    return (
      <section className={`py-20 bg-gradient-to-br from-gray-50 to-white ${className}`}>
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-serif text-gray-900 mb-4">{title}</h2>
          <p className="text-gray-600 mb-8">{subtitle}</p>
          <div className="text-gray-500">
            <p>No products available at the moment.</p>
            <p className="text-sm mt-2">Please check back later or explore other categories.</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className={`py-20 bg-gradient-to-br from-gray-50 to-white ${className}`}>
      <div className="container mx-auto px-4">
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl font-serif font-light text-gray-900 mb-4">{title}</h2>
          <div className="w-24 h-[1px] bg-pink mx-auto mb-6"></div>
          <p className="text-gray-600 max-w-2xl mx-auto">{subtitle}</p>
          
          {/* Decorative elements */}
          <div className="flex items-center justify-center mt-4 space-x-1">
            <div className="w-1 h-1 rounded-full bg-pink opacity-70"></div>
            <div className="w-1.5 h-1.5 rounded-full bg-pink opacity-80"></div>
            <div className="w-2 h-2 rounded-full bg-pink opacity-90"></div>
            <div className="w-12 h-0.5 bg-pink"></div>
            <div className="w-2 h-2 rounded-full bg-pink opacity-90"></div>
            <div className="w-1.5 h-1.5 rounded-full bg-pink opacity-80"></div>
            <div className="w-1 h-1 rounded-full bg-pink opacity-70"></div>
          </div>
        </motion.div>

        {/* Product Grid */}
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-16"
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
        {showViewAllButton && categorySlug && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.6 }}
            className="mt-16 text-center"
          >
            <button
              onClick={() => navigate(`/category/${categorySlug}`)}
              className="group inline-flex items-center px-8 py-3 border-2 border-pink text-pink rounded-md hover:bg-pink hover:text-white transition-all duration-300"
            >
              <span>View All Products</span>
              <svg className="ml-2 w-5 h-5 transition-transform duration-300 group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </button>
          </motion.div>
        )}
      </div>

      {/* Quick View Modal */}
      <ProductQuickView
        product={selectedProduct}
        isOpen={isQuickViewOpen}
        onClose={() => setIsQuickViewOpen(false)}
      />
    </section>
  );
};

export default DynamicProductCollection; 