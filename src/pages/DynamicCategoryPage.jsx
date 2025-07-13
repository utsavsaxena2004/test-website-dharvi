import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useParams, Link } from 'react-router-dom';
import { supabaseService } from '../services/supabaseService';
import ProductQuickView from '../components/ProductQuickView';
import ProductCard from '../components/ProductCard';
import statePersistence from '../utils/statePersistence';

const DynamicCategoryPage = () => {
  const { categorySlug } = useParams();
  const [category, setCategory] = useState(null);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isQuickViewOpen, setIsQuickViewOpen] = useState(false);
  const [sortBy, setSortBy] = useState('name');
  const [filterBy, setFilterBy] = useState('all');
  
  // Load saved sort/filter state for this category
  useEffect(() => {
    if (categorySlug) {
      const savedState = statePersistence.loadSortFilterState(categorySlug);
      if (savedState) {
        setSortBy(savedState.sortBy || 'name');
        setFilterBy(savedState.filterBy || 'all');
      }
    }
  }, [categorySlug]);

  // Save sort/filter state whenever it changes
  useEffect(() => {
    if (categorySlug) {
      statePersistence.saveSortFilterState(categorySlug, {
        sortBy,
        filterBy
      });
    }
  }, [categorySlug, sortBy, filterBy]);

  useEffect(() => {
    const fetchCategoryAndProducts = async () => {
      try {
        setLoading(true);
        
        // Get categories first
        const categories = await supabaseService.getCategories();
        const currentCategory = categories.find(cat => cat.slug === categorySlug);
        
        if (currentCategory) {
          setCategory(currentCategory);
          
          // Get products for this category
          const productsData = await supabaseService.getProducts({ 
            category_id: currentCategory.id 
          });
          setProducts(productsData);
        } else {
          // Category not found
          setCategory(null);
          setProducts([]);
        }
      } catch (error) {
        console.error('Error fetching category and products:', error);
        setCategory(null);
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };

    if (categorySlug) {
      fetchCategoryAndProducts();
    }
  }, [categorySlug]);

  const openQuickView = (product) => {
    setSelectedProduct(product);
    setIsQuickViewOpen(true);
  };

  const addToCart = (product, event) => {
    event.stopPropagation();
    console.log('Adding to cart:', product);
    // In a real app, you would dispatch to your cart state management
  };

  // Sort and filter products
  const filteredAndSortedProducts = products
    .filter(product => {
      if (filterBy === 'all') return true;
      if (filterBy === 'featured') return product.featured;
      if (filterBy === 'sale') return product.discount;
      return true;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'price-low':
          return a.price - b.price;
        case 'price-high':
          return b.price - a.price;
        case 'name':
          return a.name.localeCompare(b.name);
        case 'newest':
          return new Date(b.created_at) - new Date(a.created_at);
        default:
          return 0;
      }
    });

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white">
        <div className="animate-pulse">
          <div className="h-96 bg-gray-300"></div>
          <div className="container mx-auto px-4 py-16">
            <div className="h-8 bg-gray-300 rounded w-64 mx-auto mb-8"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i}>
                  <div className="h-80 bg-gray-300 rounded mb-4"></div>
                  <div className="h-4 bg-gray-300 rounded w-3/4 mb-2"></div>
                  <div className="h-4 bg-gray-300 rounded w-1/2"></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!category) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-serif text-gray-900 mb-4">Category Not Found</h1>
          <p className="text-gray-600 mb-8">The category you're looking for doesn't exist.</p>
          <Link 
            to="/"
            className="inline-flex items-center px-6 py-3 border-2 border-[#ba1a5d] text-[#ba1a5d] rounded-md hover:bg-[#ba1a5d] hover:text-white transition-all duration-300"
          >
            Back to Home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white">
      {/* Hero Section */}
      <motion.div 
        className="relative h-96 bg-gradient-to-r from-[#ba1a5d] to-[#9a1549] overflow-hidden"
      >
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="absolute inset-0 bg-[url('/patterns/paisley.svg')] opacity-10"></div>
        
        {/* Category image background if available */}
        {category.image_url && (
          <div className="absolute inset-0">
            <img
              src={category.image_url}
              alt={category.name}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-black/40"></div>
          </div>
        )}
        
        <div className="relative h-full flex items-center justify-center text-white">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center"
          >
            <h1 className="text-5xl font-serif font-light mb-4">{category.name}</h1>
            <div className="w-24 h-[1px] bg-white/50 mx-auto mb-6"></div>
            <p className="text-xl text-white/90 max-w-2xl mx-auto">
              {category.description || `Discover our exquisite collection of ${category.name.toLowerCase()}`}
            </p>
          </motion.div>
        </div>
      </motion.div>

      {/* Breadcrumb */}
      <div className="container mx-auto px-4 py-6">
        <nav className="text-sm text-gray-600">
          <Link to="/" className="hover:text-[#ba1a5d] transition-colors">Home</Link>
          <span className="mx-2">/</span>
          <span className="text-gray-900">{category.name}</span>
        </nav>
      </div>

      {/* Filters and Sort */}
      <div className="container mx-auto px-4 py-6 border-b border-gray-200">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-4">
            <label className="text-sm font-medium text-gray-700">Filter by:</label>
            <select 
              value={filterBy}
              onChange={(e) => setFilterBy(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#ba1a5d]"
            >
              <option value="all">All Products</option>
              <option value="featured">Featured</option>
              <option value="sale">On Sale</option>
            </select>
          </div>
          
          <div className="flex items-center gap-4">
            <label className="text-sm font-medium text-gray-700">Sort by:</label>
            <select 
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#ba1a5d]"
            >
              <option value="name">Name</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
              <option value="newest">Newest First</option>
            </select>
          </div>
        </div>
      </div>

      {/* Products Grid */}
      <div className="container mx-auto px-4 pb-16">
        {filteredAndSortedProducts.length === 0 ? (
          <div className="text-center py-16">
            <h3 className="text-2xl font-serif text-gray-900 mb-4">No products found</h3>
            <p className="text-gray-600 mb-8">
              {filterBy === 'all' 
                ? `No products available in ${category.name} category yet.`
                : `No products match your current filter.`
              }
            </p>
            {filterBy !== 'all' && (
              <button
                onClick={() => setFilterBy('all')}
                className="px-6 py-3 bg-[#ba1a5d] text-white rounded-md hover:bg-[#9a1549] transition-colors duration-300"
              >
                Show All Products
              </button>
            )}
          </div>
        ) : (
          <>
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-2xl font-serif text-gray-900">
                {filteredAndSortedProducts.length} Product{filteredAndSortedProducts.length !== 1 ? 's' : ''} Found
              </h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredAndSortedProducts.map((product, index) => (
                <motion.div
                  key={product.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
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
          </>
        )}
      </div>

      {/* Quick View Modal */}
      <ProductQuickView
        product={selectedProduct}
        isOpen={isQuickViewOpen}
        onClose={() => setIsQuickViewOpen(false)}
      />
    </div>
  );
};

export default DynamicCategoryPage; 