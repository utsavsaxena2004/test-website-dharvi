import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import ProductCard from '../components/ProductCard';
import { supabaseService } from '../services/supabaseService';

const CuratedCollection = () => {
  const [masterProducts, setMasterProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const loadMasterProducts = async () => {
      try {
        setLoading(true);
        const products = await supabaseService.getMasterProducts();
        setMasterProducts(products);
      } catch (error) {
        console.error('Error loading master products:', error);
      } finally {
        setLoading(false);
      }
    };

    loadMasterProducts();
  }, []);

  const handleProductClick = (product) => {
    // Navigate to home page with the specific product ID
    navigate(`/?featured=${product.id}`);
  };

  const handleQuickView = (product) => {
    // Same as product click for this case
    handleProductClick(product);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-rose-50 via-white to-pink-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-rose-200 border-t-rose-600 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading curated collection...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-50 via-white to-pink-50">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-5">
          <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
            <pattern id="curatedPattern" x="0" y="0" width="50" height="50" patternUnits="userSpaceOnUse">
              <circle cx="25" cy="25" r="2" fill="#6f0e06"/>
              <path d="M25,15 L35,25 L25,35 L15,25 Z" fill="none" stroke="#6f0e06" strokeWidth="0.5"/>
            </pattern>
            <rect x="0" y="0" width="100%" height="100%" fill="url(#curatedPattern)" />
          </svg>
        </div>

        <div className="relative container mx-auto px-4 py-20">
          {/* Breadcrumb */}
          <nav className="mb-8">
            <div className="flex items-center space-x-2 text-sm">
              <span className="text-gray-500">Home</span>
              <span className="text-gray-400">/</span>
              <span className="text-gray-900 font-medium">Curated Collection</span>
            </div>
          </nav>

          {/* Hero Content */}
          <motion.div 
            className="text-center max-w-4xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            {/* Collection Badge */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2, duration: 0.5 }}
              className="inline-block"
            >
              <span className="inline-flex items-center px-6 py-2 rounded-full text-sm font-medium bg-gradient-to-r from-[#6f0e06] to-[#9a1549] text-white shadow-lg">
                ✨ CURATED COLLECTION
              </span>
            </motion.div>

            {/* Main Title */}
            <motion.h1 
              className="text-4xl md:text-6xl font-serif text-gray-900 mt-6 mb-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.6 }}
            >
              Masterpiece
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-[#6f0e06] to-[#9a1549]">
                Collection
              </span>
            </motion.h1>

            {/* Description */}
            <motion.p 
              className="text-lg md:text-xl text-gray-600 mb-8 leading-relaxed"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.6 }}
            >
              Discover our exquisite collection of masterpieces, crafted with traditional
              <br className="hidden md:block" />
              techniques and contemporary design sensibilities.
            </motion.p>

            {/* Stats */}
            <motion.div 
              className="grid grid-cols-3 gap-8 max-w-md mx-auto"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8, duration: 0.6 }}
            >
              <div className="text-center">
                <div className="text-2xl md:text-3xl font-bold text-[#6f0e06]">{masterProducts.length}</div>
                <div className="text-sm text-gray-500 uppercase tracking-wide">PRODUCTS</div>
              </div>
              <div className="text-center">
                <div className="text-2xl md:text-3xl font-bold text-[#6f0e06]">123+</div>
                <div className="text-sm text-gray-500 uppercase tracking-wide">ARTISANS</div>
              </div>
              <div className="text-center">
                <div className="text-2xl md:text-3xl font-bold text-[#6f0e06]">4.8</div>
                <div className="text-sm text-gray-500 uppercase tracking-wide">RATING</div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>

      {/* Products Section */}
      <div className="container mx-auto px-4 py-16">
        {/* Search and Filter Bar */}
        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <div className="flex-1">
            <div className="relative">
              <input
                type="text"
                placeholder="Search products..."
                className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#6f0e06] focus:border-transparent"
              />
              <svg className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
          </div>
          <div className="flex gap-4">
            <button className="flex items-center gap-2 px-4 py-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 4h13M3 8h9m-9 4h6m4 0l4-4m0 0l4 4m-4-4v12" />
              </svg>
              Filters
            </button>
            <button className="flex items-center gap-2 px-4 py-3 bg-[#6f0e06] text-white rounded-lg hover:bg-[#5a0b05] transition-colors">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 10h16M4 14h16M4 18h16" />
              </svg>
              Sort by Name
            </button>
          </div>
        </div>

        {/* Products Grid */}
        {masterProducts.length === 0 ? (
          <div className="text-center py-20">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gray-100 flex items-center justify-center">
              <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2 2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No Products Available</h3>
            <p className="text-gray-600">Check back soon for our latest curated pieces.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {masterProducts.map((product, index) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1, duration: 0.6 }}
              >
                <ProductCard
                  product={{
                    ...product,
                    // Map master product fields to regular product fields
                    image_urls: product.image_urls || [],
                    colors: product.colors || [],
                  }}
                  onProductClick={() => handleProductClick(product)}
                  onQuickView={() => handleQuickView(product)}
                />
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default CuratedCollection;