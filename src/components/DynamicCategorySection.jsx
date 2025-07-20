import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabaseService } from '../services/supabaseService';
import ProductQuickView from './ProductQuickView';
import ProductCard from './ProductCard';

// Design Templates - Each with unique styling and decorative elements
const DesignTemplates = {
  // Elegant Geometric Design (inspired by KurtiCollection)
  elegant: {
    name: 'Elegant Geometric',
    bgGradient: 'from-emerald-50 via-white to-teal-50',
    accentColor: 'emerald',
    decorativeElements: {
      GeometricPattern: ({ className }) => (
        <svg viewBox="0 0 100 100" className={`${className} text-emerald-600 opacity-10`}>
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
      ),
      DiamondPattern: ({ className }) => (
        <svg viewBox="0 0 60 60" className={`${className} text-emerald-600 opacity-10`}>
          <path d="M30,0 L60,30 L30,60 L0,30 Z" fill="none" stroke="currentColor" strokeWidth="0.8" />
          <path d="M30,10 L50,30 L30,50 L10,30 Z" fill="none" stroke="currentColor" strokeWidth="0.8" />
          <path d="M30,20 L40,30 L30,40 L20,30 Z" fill="none" stroke="currentColor" strokeWidth="0.8" />
          <circle cx="30" cy="30" r="3" fill="currentColor" />
        </svg>
      ),
      BorderPattern: () => (
        <div className="flex items-center justify-center w-full opacity-40">
          <div className="h-px bg-gradient-to-r from-transparent via-emerald-600 to-transparent w-full"></div>
          <div className="flex-shrink-0 mx-4">
            <svg width="60" height="20" viewBox="0 0 60 20" className="text-emerald-600">
              <path d="M0,10 L60,10 M15,5 L30,10 L15,15 M30,5 L45,10 L30,15" stroke="currentColor" fill="none" strokeWidth="0.8" />
            </svg>
          </div>
          <div className="h-px bg-gradient-to-r from-transparent via-emerald-600 to-transparent w-full"></div>
        </div>
      )
    }
  },

  // Royal Mandala Design (inspired by LehengaCollection)
  royal: {
    name: 'Royal Mandala',
    bgGradient: 'from-purple-50 via-white to-pink-50',
    accentColor: 'purple',
    decorativeElements: {
      MandalaPattern: ({ className }) => (
        <svg width="120" height="120" viewBox="0 0 120 120" className={`${className} opacity-10 text-purple-600`}>
          <circle cx="60" cy="60" r="50" fill="none" stroke="currentColor" strokeWidth="0.5" />
          <circle cx="60" cy="60" r="40" fill="none" stroke="currentColor" strokeWidth="0.5" />
          <circle cx="60" cy="60" r="30" fill="none" stroke="currentColor" strokeWidth="0.5" />
          <circle cx="60" cy="60" r="20" fill="none" stroke="currentColor" strokeWidth="0.5" />
          <path d="M60,10 L60,110 M10,60 L110,60 M25,25 L95,95 M25,95 L95,25" stroke="currentColor" strokeWidth="0.5" />
        </svg>
      ),
      FlowerPattern: ({ className }) => (
        <svg width="80" height="80" viewBox="0 0 80 80" className={`${className} opacity-15 text-purple-600`}>
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
      ),
      BorderPattern: () => (
        <div className="flex items-center justify-center w-full opacity-40">
          <div className="h-px bg-gradient-to-r from-transparent via-purple-600 to-transparent w-full"></div>
          <div className="flex-shrink-0 mx-4">
            <svg width="60" height="20" viewBox="0 0 60 20" className="text-purple-600">
              <path d="M0,10 L60,10 M15,5 L30,10 L15,15 M30,5 L45,10 L30,15" stroke="currentColor" fill="none" strokeWidth="0.8" />
            </svg>
          </div>
          <div className="h-px bg-gradient-to-r from-transparent via-purple-600 to-transparent w-full"></div>
        </div>
      )
    }
  },

  // Traditional Paisley Design (inspired by SareeCollection)
  traditional: {
    name: 'Traditional Paisley',
    bgGradient: 'from-rose-50 via-white to-orange-50',
    accentColor: 'rose',
    decorativeElements: {
      PaisleyPattern: ({ className }) => (
        <svg width="120" height="120" viewBox="0 0 120 120" className={`${className} text-rose-600 opacity-10`}>
          <path d="M60,20 Q80,5 90,20 Q100,40 80,60 Q60,80 40,70 Q20,60 30,40 Q40,20 60,20" fill="none" stroke="currentColor" strokeWidth="0.8" />
          <path d="M40,40 Q50,30 60,40 Q70,50 60,60 Q50,70 40,60 Q30,50 40,40" fill="none" stroke="currentColor" strokeWidth="0.8" />
          <path d="M90,90 Q100,80 95,70 Q85,60 75,70 Q65,80 75,90 Q85,100 90,90" fill="none" stroke="currentColor" strokeWidth="0.8" />
          <circle cx="60" cy="60" r="40" fill="none" stroke="currentColor" strokeWidth="0.5" strokeDasharray="1,3" />
        </svg>
      ),
      LotusPattern: ({ className }) => (
        <svg width="100" height="100" viewBox="0 0 100 100" className={`${className} text-rose-600 opacity-15`}>
          <path d="M50,10 Q60,30 50,50 Q40,30 50,10" fill="none" stroke="currentColor" strokeWidth="0.8" />
          <path d="M50,10 Q70,30 50,50 Q30,30 50,10" fill="none" stroke="currentColor" strokeWidth="0.5" />
          <path d="M10,50 Q30,60 50,50 Q30,40 10,50" fill="none" stroke="currentColor" strokeWidth="0.8" />
          <path d="M10,50 Q30,70 50,50 Q30,30 10,50" fill="none" stroke="currentColor" strokeWidth="0.5" />
          <path d="M50,90 Q60,70 50,50 Q40,70 50,90" fill="none" stroke="currentColor" strokeWidth="0.8" />
          <path d="M50,90 Q70,70 50,50 Q30,70 50,90" fill="none" stroke="currentColor" strokeWidth="0.5" />
          <path d="M90,50 Q70,60 50,50 Q70,40 90,50" fill="none" stroke="currentColor" strokeWidth="0.8" />
          <path d="M90,50 Q70,70 50,50 Q70,30 90,50" fill="none" stroke="currentColor" strokeWidth="0.5" />
        </svg>
      ),
      BorderPattern: () => (
        <div className="flex items-center justify-center w-full">
          <div className="h-px bg-rose-600/30 w-full"></div>
          <div className="px-4">
            <svg width="60" height="20" viewBox="0 0 60 20" className="text-rose-600 opacity-30">
              <path d="M0,10 L60,10 M15,5 L30,10 L15,15 M30,5 L45,10 L30,15" stroke="currentColor" fill="none" strokeWidth="0.8" />
            </svg>
          </div>
          <div className="h-px bg-rose-600/30 w-full"></div>
        </div>
      )
    }
  },

  // Contemporary Floral Design (inspired by SuitCollection)
  contemporary: {
    name: 'Contemporary Floral',
    bgGradient: 'from-blue-50 via-white to-indigo-50',
    accentColor: 'blue',
    decorativeElements: {
      FloralPattern: ({ className }) => (
        <svg width="60" height="60" viewBox="0 0 60 60" className={`${className} text-blue-600 opacity-10`}>
          <g>
            <path d="M30,10 Q40,20 30,30 Q20,20 30,10" fill="currentColor" />
            <path d="M10,30 Q20,40 30,30 Q20,20 10,30" fill="currentColor" />
            <path d="M30,50 Q40,40 30,30 Q20,40 30,50" fill="currentColor" />
            <path d="M50,30 Q40,40 30,30 Q40,20 50,30" fill="currentColor" />
            <circle cx="30" cy="30" r="5" fill="currentColor" />
          </g>
        </svg>
      ),
      WavePattern: ({ className }) => (
        <svg viewBox="0 0 200 20" className={`${className} text-blue-600 opacity-15`}>
          <path d="M0,10 Q40,0 80,10 Q120,20 160,10 Q200,0 240,10" fill="none" stroke="currentColor" strokeWidth="0.5" />
          <path d="M0,10 Q40,20 80,10 Q120,0 160,10 Q200,20 240,10" fill="none" stroke="currentColor" strokeWidth="0.5" />
        </svg>
      ),
      StarPattern: ({ className }) => (
        <svg width="70" height="70" viewBox="0 0 70 70" className={`${className} text-blue-600 opacity-15`}>
          <path d="M35,0 L40,30 L70,35 L40,40 L35,70 L30,40 L0,35 L30,30 Z" fill="none" stroke="currentColor" strokeWidth="0.5" />
          <path d="M35,10 L38,30 L60,35 L38,40 L35,60 L32,40 L10,35 L32,30 Z" fill="none" stroke="currentColor" strokeWidth="0.5" />
          <path d="M35,20 L36,30 L50,35 L36,40 L35,50 L34,40 L20,35 L34,30 Z" fill="none" stroke="currentColor" strokeWidth="0.5" />
          <circle cx="35" cy="35" r="3" fill="currentColor" />
        </svg>
      ),
      BorderPattern: () => (
        <div className="flex items-center justify-center w-full opacity-40">
          <div className="h-px bg-gradient-to-r from-transparent via-blue-600 to-transparent w-full"></div>
          <div className="flex-shrink-0 mx-4">
            <svg width="60" height="20" viewBox="0 0 60 20" className="text-blue-600">
              <path d="M0,10 L60,10 M15,5 L30,10 L15,15 M30,5 L45,10 L30,15" stroke="currentColor" fill="none" strokeWidth="0.8" />
            </svg>
          </div>
          <div className="h-px bg-gradient-to-r from-transparent via-blue-600 to-transparent w-full"></div>
        </div>
      )
    }
  }
};

// Color schemes for different accent colors
const ColorSchemes = {
  emerald: {
    primary: 'emerald-600',
    secondary: 'emerald-100',
    accent: 'emerald-500',
    text: 'emerald-900',
    bg: 'emerald-50',
    hover: 'emerald-700'
  },
  purple: {
    primary: 'purple-600',
    secondary: 'purple-100',
    accent: 'purple-500',
    text: 'purple-900',
    bg: 'purple-50',
    hover: 'purple-700'
  },
  rose: {
    primary: 'rose-600',
    secondary: 'rose-100',
    accent: 'rose-500',
    text: 'rose-900',
    bg: 'rose-50',
    hover: 'rose-700'
  },
  blue: {
    primary: 'blue-600',
    secondary: 'blue-100',
    accent: 'blue-500',
    text: 'blue-900',
    bg: 'blue-50',
    hover: 'blue-700'
  }
};

const DynamicCategorySection = ({ category, limit = 4 }) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isQuickViewOpen, setIsQuickViewOpen] = useState(false);
  const navigate = useNavigate();

  // Get design template (default to elegant if not specified)
  const designType = category?.design_template || 'elegant';
  const template = DesignTemplates[designType] || DesignTemplates.elegant;
  const colors = ColorSchemes[template.accentColor];

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const allProducts = await supabaseService.getProducts({ 
          category_id: category.id 
        });
        setProducts(allProducts.slice(0, limit));
      } catch (error) {
        console.error('Error fetching products:', error);
      } finally {
        setLoading(false);
      }
    };

    if (category?.id) {
      fetchProducts();
    }
  }, [category, limit]);

  const openQuickView = (product) => {
    setSelectedProduct(product);
    setIsQuickViewOpen(true);
  };

  const addToCart = (product, event) => {
    event.stopPropagation();
    console.log('Adding to cart:', product);
    // Add cart logic here
  };

  const viewAllProducts = () => {
    navigate(`/category/${category.slug}`);
  };

  if (loading) {
    return (
      <div className="py-16 text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink mx-auto"></div>
        <p className="mt-4 text-gray-600">Loading products...</p>
      </div>
    );
  }

  if (!products.length) {
    return null;
  }

  // Get decorative elements from template
  const { GeometricPattern, DiamondPattern, MandalaPattern, FlowerPattern, PaisleyPattern, LotusPattern, FloralPattern, WavePattern, StarPattern, BorderPattern } = template.decorativeElements;

  return (
    <section className={`py-16 bg-gradient-to-br ${template.bgGradient} relative overflow-hidden`}>
      {/* Background Decorative Elements */}
      <div className="absolute inset-0 pointer-events-none">
        {GeometricPattern && (
          <>
            <div className="absolute top-10 left-10">
              <GeometricPattern className="w-32 h-32" />
            </div>
            <div className="absolute bottom-10 right-10">
              <GeometricPattern className="w-24 h-24" />
            </div>
          </>
        )}
        {DiamondPattern && (
          <>
            <div className="absolute top-1/2 left-5 transform -translate-y-1/2">
              <DiamondPattern className="w-16 h-16" />
            </div>
            <div className="absolute top-1/4 right-5">
              <DiamondPattern className="w-20 h-20" />
            </div>
          </>
        )}
        {MandalaPattern && (
          <>
            <div className="absolute top-20 left-20">
              <MandalaPattern className="w-32 h-32" />
            </div>
            <div className="absolute bottom-20 right-20">
              <MandalaPattern className="w-28 h-28" />
            </div>
          </>
        )}
        {FlowerPattern && (
          <>
            <div className="absolute top-16 right-16">
              <FlowerPattern className="w-24 h-24" />
            </div>
            <div className="absolute bottom-16 left-16">
              <FlowerPattern className="w-20 h-20" />
            </div>
          </>
        )}
        {PaisleyPattern && (
          <>
            <div className="absolute top-12 left-12">
              <PaisleyPattern className="w-36 h-36" />
            </div>
            <div className="absolute bottom-12 right-12">
              <PaisleyPattern className="w-32 h-32" />
            </div>
          </>
        )}
        {LotusPattern && (
          <>
            <div className="absolute top-1/3 left-8">
              <LotusPattern className="w-28 h-28" />
            </div>
            <div className="absolute bottom-1/3 right-8">
              <LotusPattern className="w-24 h-24" />
            </div>
          </>
        )}
        {FloralPattern && (
          <>
            <div className="absolute top-8 left-8">
              <FloralPattern className="w-20 h-20" />
            </div>
            <div className="absolute bottom-8 right-8">
              <FloralPattern className="w-16 h-16" />
            </div>
          </>
        )}
        {WavePattern && (
          <>
            <div className="absolute top-0 left-0 w-full">
              <WavePattern className="w-full h-8" />
            </div>
            <div className="absolute bottom-0 left-0 w-full">
              <WavePattern className="w-full h-8" />
            </div>
          </>
        )}
        {StarPattern && (
          <>
            <div className="absolute top-24 right-24">
              <StarPattern className="w-28 h-28" />
            </div>
            <div className="absolute bottom-24 left-24">
              <StarPattern className="w-24 h-24" />
            </div>
          </>
        )}
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        {/* Header Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <div className="mb-4">
            <span className={`text-${colors.primary} text-sm font-medium tracking-widest uppercase`}>
              Premium Collection
            </span>
          </div>
          <h2 className={`text-4xl md:text-5xl font-serif text-${colors.text} mb-4`}>
            {category.name}
          </h2>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto mb-8">
            {category.description || `Discover our exquisite collection of ${category.name.toLowerCase()}, where tradition meets contemporary elegance`}
          </p>
          
          {BorderPattern && (
            <div className="mb-8">
              <BorderPattern />
            </div>
          )}
        </motion.div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          {products.map((product, index) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <ProductCard
                product={product}
                onQuickView={openQuickView}
                onAddToCart={addToCart}
              />
            </motion.div>
          ))}
        </div>

        {/* View All Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center"
        >
          <button
            onClick={viewAllProducts}
            className={`inline-flex items-center px-8 py-4 bg-white border-2 border-${colors.primary} text-${colors.primary} font-semibold rounded-full hover:bg-${colors.primary} hover:text-white transition-all duration-300 shadow-lg hover:shadow-xl`}
          >
            View All {category.name}
            <svg className="ml-2 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </button>
        </motion.div>
      </div>

      {/* Quick View Modal */}
      {isQuickViewOpen && selectedProduct && (
        <ProductQuickView
          product={selectedProduct}
          isOpen={isQuickViewOpen}
          onClose={() => setIsQuickViewOpen(false)}
        />
      )}
    </section>
  );
};

export default DynamicCategorySection; 