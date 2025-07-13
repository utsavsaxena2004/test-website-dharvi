import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useScroll, useTransform } from 'framer-motion';
import { useParams, Link } from 'react-router-dom';
import { supabaseService } from '../services/supabaseService';
import ProductQuickView from '../components/ProductQuickView';

const DynamicCategoryPage = () => {
  const { categorySlug } = useParams();
  const [category, setCategory] = useState(null);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isQuickViewOpen, setIsQuickViewOpen] = useState(false);
  const [sortBy, setSortBy] = useState('name');
  const [filterBy, setFilterBy] = useState('all');
  const heroRef = useRef(null);
  
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"]
  });
  
  const y = useTransform(scrollYProgress, [0, 1], ["0%", "50%"]);
  const opacity = useTransform(scrollYProgress, [0, 1], [1, 0]);

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

  const ProductCard = ({ product, index }) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className="group cursor-pointer"
      onClick={() => openQuickView(product)}
    >
      <div className="relative overflow-hidden rounded-lg bg-white shadow-lg hover:shadow-xl transition-all duration-300">
        <div className="relative h-80 overflow-hidden">
          <img
            src={product.image_urls?.[0] || '/placeholder-product.jpg'}
            alt={product.name}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
          />
          
          {/* Badges */}
          <div className="absolute top-3 left-3 flex flex-col gap-2">
            {product.featured && (
              <span className="bg-[#ba1a5d] text-white px-2 py-1 rounded-full text-xs font-medium">
                Featured
              </span>
            )}
            {product.discount && (
              <span className="bg-red-500 text-white px-2 py-1 rounded-full text-xs font-medium">
                Sale
              </span>
            )}
          </div>

          {/* Overlay */}
          <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-300"></div>
          
          {/* Quick actions */}
          <div className="absolute bottom-4 left-4 right-4 transform translate-y-full group-hover:translate-y-0 transition-transform duration-300">
            <button
              onClick={(e) => addToCart(product, e)}
              className="w-full bg-white text-gray-900 py-2 px-4 rounded-md font-medium hover:bg-gray-100 transition-colors duration-200"
            >
              Add to Cart
            </button>
          </div>
        </div>

        {/* Product Info */}
        <div className="p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-2 group-hover:text-[#ba1a5d] transition-colors duration-200">
            {product.name}
          </h3>
          <p className="text-gray-600 text-sm mb-3 line-clamp-2">
            {product.description}
          </p>
          <div className="flex items-center justify-between">
            <span className="text-xl font-bold text-[#ba1a5d]">
              ₹{product.price?.toLocaleString('en-IN')}
            </span>
            {product.colors && product.colors.length > 0 && (
              <div className="flex space-x-1">
                {product.colors.slice(0, 3).map((color, colorIndex) => (
                  <div
                    key={colorIndex}
                    className="w-4 h-4 rounded-full border border-gray-300"
                    style={{ backgroundColor: color }}
                  ></div>
                ))}
                {product.colors.length > 3 && (
                  <span className="text-xs text-gray-500 ml-1">
                    +{product.colors.length - 3}
                  </span>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white">
      {/* Hero Section */}
      <motion.div 
        ref={heroRef}
        className="relative h-96 bg-gradient-to-r from-[#ba1a5d] to-[#9a1549] overflow-hidden"
        style={{ y, opacity }}
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
      <div className="container mx-auto px-4 mb-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 p-6 bg-white rounded-lg shadow-sm">
          <div className="flex items-center gap-4">
            <span className="text-gray-700 font-medium">Filter:</span>
            <select
              value={filterBy}
              onChange={(e) => setFilterBy(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#ba1a5d] focus:border-transparent"
            >
              <option value="all">All Products</option>
              <option value="featured">Featured</option>
              <option value="sale">On Sale</option>
            </select>
          </div>
          
          <div className="flex items-center gap-4">
            <span className="text-gray-700 font-medium">Sort by:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#ba1a5d] focus:border-transparent"
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
                <ProductCard key={product.id} product={product} index={index} />
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