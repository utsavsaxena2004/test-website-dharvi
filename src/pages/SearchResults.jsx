import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FunnelIcon, 
  XMarkIcon, 
  AdjustmentsHorizontalIcon,
  MagnifyingGlassIcon,
  SparklesIcon,
  TagIcon,
  CurrencyRupeeIcon,
  ArrowsUpDownIcon
} from '@heroicons/react/24/outline';
import { supabaseService } from '../services/supabaseService';
import ProductCard from '../components/ProductCard';
import ProductQuickView from '../components/ProductQuickView';

const SearchResults = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isQuickViewOpen, setIsQuickViewOpen] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    sortBy: 'newest',
    minPrice: '',
    maxPrice: '',
    category: ''
  });
  const [categories, setCategories] = useState([]);

  const searchQuery = searchParams.get('q') || '';

  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
    if (searchQuery) {
      searchProducts();
    }
  }, [searchQuery, filters]);

  const fetchCategories = async () => {
    try {
      const data = await supabaseService.getCategories();
      setCategories(data);
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  const searchProducts = async () => {
    try {
      setLoading(true);
      const searchFilters = {
        sortBy: filters.sortBy,
        ...(filters.minPrice && { minPrice: parseFloat(filters.minPrice) }),
        ...(filters.maxPrice && { maxPrice: parseFloat(filters.maxPrice) }),
        ...(filters.category && { category_id: filters.category })
      };

      const data = await supabaseService.searchProducts(searchQuery, searchFilters);
      setProducts(data);
    } catch (error) {
      console.error('Error searching products:', error);
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const openQuickView = (product) => {
    setSelectedProduct(product);
    setIsQuickViewOpen(true);
  };

  const closeQuickView = () => {
    setIsQuickViewOpen(false);
    setSelectedProduct(null);
  };

  const formatPrice = (price) => {
    return `₹${price.toLocaleString('en-IN')}`;
  };

  const clearFilters = () => {
    setFilters({
      sortBy: 'newest',
      minPrice: '',
      maxPrice: '',
      category: ''
    });
  };

  const getActiveFilterCount = () => {
    let count = 0;
    if (filters.minPrice || filters.maxPrice) count++;
    if (filters.category) count++;
    if (filters.sortBy !== 'newest') count++;
    return count;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-amber-50 via-white to-rose-50">
        <div className="container mx-auto px-4 py-24">
          <div className="flex flex-col items-center justify-center space-y-4">
            <div className="relative">
              <div className="animate-spin rounded-full h-16 w-16 border-4 border-amber-200"></div>
              <div className="animate-spin rounded-full h-16 w-16 border-4 border-amber-600 border-t-transparent absolute top-0 left-0"></div>
            </div>
            <p className="text-gray-600 font-medium">Searching for products...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-white to-rose-50">
      <div className="container mx-auto px-4 py-8 lg:py-12">
        {/* Enhanced Header */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8 lg:mb-12"
        >
          <div className="text-center mb-6">
            <div className="flex items-center justify-center mb-4">
              <MagnifyingGlassIcon className="h-8 w-8 text-amber-600 mr-3" />
              <h1 className="text-3xl lg:text-5xl font-serif text-gray-900 bg-gradient-to-r from-amber-600 to-rose-600 bg-clip-text text-transparent">
                Search Results
              </h1>
            </div>
            <div className="max-w-2xl mx-auto">
              {searchQuery ? (
                <p className="text-lg text-gray-600 mb-2">
                  Showing results for <span className="font-semibold text-amber-700 bg-amber-100 px-3 py-1 rounded-full">"{searchQuery}"</span>
                </p>
              ) : (
                <p className="text-lg text-gray-600 mb-2">All products</p>
              )}
              {products.length > 0 && (
                <p className="text-sm text-gray-500 flex items-center justify-center">
                  <SparklesIcon className="h-4 w-4 mr-1" />
                  {products.length} {products.length === 1 ? 'item' : 'items'} found
                </p>
              )}
            </div>
          </div>

          {/* Mobile Filter Toggle */}
          <div className="lg:hidden mb-6">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="w-full flex items-center justify-center px-4 py-3 bg-white rounded-xl shadow-md border border-gray-200 hover:shadow-lg transition-all duration-300"
            >
              <FunnelIcon className="h-5 w-5 text-gray-600 mr-2" />
              <span className="font-medium text-gray-700">
                Filters {getActiveFilterCount() > 0 && `(${getActiveFilterCount()})`}
              </span>
              {getActiveFilterCount() > 0 && (
                <span className="ml-2 bg-amber-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {getActiveFilterCount()}
                </span>
              )}
            </button>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Enhanced Filters Sidebar */}
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className={`lg:col-span-1 ${showFilters ? 'block' : 'hidden lg:block'}`}
          >
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden sticky top-24">
              {/* Filter Header */}
              <div className="bg-gradient-to-r from-amber-500 to-rose-500 p-6 text-white">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <AdjustmentsHorizontalIcon className="h-6 w-6 mr-2" />
                    <h3 className="text-xl font-bold">Filters</h3>
                  </div>
                  <button
                    onClick={() => setShowFilters(false)}
                    className="lg:hidden text-white hover:text-gray-200 transition-colors"
                  >
                    <XMarkIcon className="h-6 w-6" />
                  </button>
                </div>
                {getActiveFilterCount() > 0 && (
                  <p className="text-sm text-amber-100 mt-2">
                    {getActiveFilterCount()} filter{getActiveFilterCount() > 1 ? 's' : ''} active
                  </p>
                )}
              </div>

              <div className="p-6 space-y-8">
                {/* Sort By */}
                <div>
                  <label className="flex items-center text-sm font-bold text-gray-900 mb-3 uppercase tracking-wide">
                    <ArrowsUpDownIcon className="h-4 w-4 mr-2 text-amber-600" />
                    Sort By
                  </label>
                  <select
                    value={filters.sortBy}
                    onChange={(e) => handleFilterChange('sortBy', e.target.value)}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all duration-300 bg-gray-50 hover:bg-white"
                  >
                    <option value="newest">✨ Newest First</option>
                    <option value="oldest">🕐 Oldest First</option>
                    <option value="price_low">💰 Price: Low to High</option>
                    <option value="price_high">💎 Price: High to Low</option>
                    <option value="name">🔤 Name: A to Z</option>
                  </select>
                </div>

                {/* Price Range */}
                <div>
                  <label className="flex items-center text-sm font-bold text-gray-900 mb-3 uppercase tracking-wide">
                    <CurrencyRupeeIcon className="h-4 w-4 mr-2 text-amber-600" />
                    Price Range
                  </label>
                  <div className="space-y-3">
                    <div className="flex space-x-3">
                      <div className="flex-1">
                        <input
                          type="number"
                          placeholder="Min"
                          value={filters.minPrice}
                          onChange={(e) => handleFilterChange('minPrice', e.target.value)}
                          className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all duration-300 bg-gray-50 hover:bg-white"
                        />
                      </div>
                      <div className="flex items-center px-2 text-gray-400">to</div>
                      <div className="flex-1">
                        <input
                          type="number"
                          placeholder="Max"
                          value={filters.maxPrice}
                          onChange={(e) => handleFilterChange('maxPrice', e.target.value)}
                          className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all duration-300 bg-gray-50 hover:bg-white"
                        />
                      </div>
                    </div>
                    {(filters.minPrice || filters.maxPrice) && (
                      <div className="text-sm text-gray-600 bg-amber-50 p-3 rounded-lg">
                        {filters.minPrice && filters.maxPrice 
                          ? `₹${parseInt(filters.minPrice).toLocaleString('en-IN')} - ₹${parseInt(filters.maxPrice).toLocaleString('en-IN')}`
                          : filters.minPrice 
                            ? `Above ₹${parseInt(filters.minPrice).toLocaleString('en-IN')}`
                            : `Below ₹${parseInt(filters.maxPrice).toLocaleString('en-IN')}`
                        }
                      </div>
                    )}
                  </div>
                </div>

                {/* Category Filter */}
                <div>
                  <label className="flex items-center text-sm font-bold text-gray-900 mb-3 uppercase tracking-wide">
                    <TagIcon className="h-4 w-4 mr-2 text-amber-600" />
                    Category
                  </label>
                  <select
                    value={filters.category}
                    onChange={(e) => handleFilterChange('category', e.target.value)}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all duration-300 bg-gray-50 hover:bg-white"
                  >
                    <option value="">All Categories</option>
                    {categories.map((category) => (
                      <option key={category.id} value={category.id}>
                        {category.name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Clear Filters */}
                <button
                  onClick={clearFilters}
                  disabled={getActiveFilterCount() === 0}
                  className={`w-full px-6 py-3 rounded-xl font-medium transition-all duration-300 ${
                    getActiveFilterCount() > 0
                      ? 'bg-gradient-to-r from-rose-500 to-pink-500 text-white hover:from-rose-600 hover:to-pink-600 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5'
                      : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                  }`}
                >
                  Clear All Filters
                </button>
              </div>
            </div>
          </motion.div>

          {/* Products Grid */}
          <div className="lg:col-span-3">
            {products.length === 0 ? (
              <motion.div 
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center py-20"
              >
                <div className="max-w-md mx-auto">
                  <div className="mb-8">
                    <div className="relative inline-block">
                      <div className="w-32 h-32 bg-gradient-to-br from-amber-100 to-rose-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <MagnifyingGlassIcon className="w-16 h-16 text-amber-400" />
                      </div>
                      <div className="absolute -top-2 -right-2 w-8 h-8 bg-rose-400 rounded-full flex items-center justify-center">
                        <XMarkIcon className="w-5 h-5 text-white" />
                      </div>
                    </div>
                  </div>
                  <h3 className="text-3xl font-serif text-gray-900 mb-4">No products found</h3>
                  <p className="text-gray-600 mb-8 leading-relaxed">
                    {searchQuery 
                      ? `We couldn't find any products matching "${searchQuery}". Try adjusting your search terms or filters.`
                      : 'No products available at the moment.'
                    }
                  </p>
                  <div className="space-y-4">
                    {getActiveFilterCount() > 0 && (
                      <button
                        onClick={clearFilters}
                        className="inline-flex items-center px-6 py-3 bg-amber-600 text-white rounded-xl hover:bg-amber-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 mr-4"
                      >
                        <AdjustmentsHorizontalIcon className="h-5 w-5 mr-2" />
                        Clear Filters
                      </button>
                    )}
                    <Link
                      to="/"
                      className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-rose-500 to-pink-500 text-white rounded-xl hover:from-rose-600 hover:to-pink-600 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                    >
                      <SparklesIcon className="h-5 w-5 mr-2" />
                      Browse All Products
                    </Link>
                  </div>
                </div>
              </motion.div>
            ) : (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="space-y-8"
              >
                {/* Results Summary */}
                <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
                  <div className="flex items-center justify-between flex-wrap gap-4">
                    <div className="flex items-center">
                      <div className="w-12 h-12 bg-gradient-to-br from-amber-500 to-rose-500 rounded-xl flex items-center justify-center mr-4">
                        <SparklesIcon className="h-6 w-6 text-white" />
                      </div>
                      <div>
                        <h3 className="text-lg font-bold text-gray-900">
                          {products.length} Product{products.length !== 1 ? 's' : ''} Found
                        </h3>
                        <p className="text-sm text-gray-600">
                          {searchQuery ? `Results for "${searchQuery}"` : 'All products'}
                        </p>
                      </div>
                    </div>
                    {getActiveFilterCount() > 0 && (
                      <div className="flex items-center space-x-2">
                        <span className="text-sm text-gray-600">Active filters:</span>
                        <span className="bg-amber-100 text-amber-800 px-3 py-1 rounded-full text-sm font-medium">
                          {getActiveFilterCount()}
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Products Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
                  <AnimatePresence>
                    {products.map((product, index) => (
                      <motion.div
                        key={product.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ duration: 0.4, delay: index * 0.1 }}
                        whileHover={{ y: -5 }}
                        className="transform transition-all duration-300"
                      >
                        <ProductCard
                          product={product}
                          onQuickView={openQuickView}
                          formatPrice={formatPrice}
                        />
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>
              </motion.div>
            )}
          </div>
        </div>
      </div>

      {/* Enhanced Mobile Filter Overlay */}
      <AnimatePresence>
        {showFilters && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-50"
            onClick={() => setShowFilters(false)}
          />
        )}
      </AnimatePresence>

      {/* Quick View Modal */}
      <AnimatePresence>
        {isQuickViewOpen && selectedProduct && (
          <ProductQuickView
            product={selectedProduct}
            isOpen={isQuickViewOpen}
            onClose={closeQuickView}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default SearchResults; 