import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { 
  FunnelIcon, 
  XMarkIcon, 
  AdjustmentsHorizontalIcon,
  SparklesIcon,
  TagIcon,
  CurrencyRupeeIcon,
  ArrowsUpDownIcon,
  ViewColumnsIcon,
  Squares2X2Icon,
  ListBulletIcon,
  MagnifyingGlassIcon,
  HeartIcon,
  ShoppingBagIcon,
  StarIcon,
  EyeIcon
} from '@heroicons/react/24/outline';
import ProductCard from '../components/ProductCard';
import ProductQuickView from '../components/ProductQuickView';
import { supabaseService } from '../services/supabaseService';

// Custom Illustration for Curated Collection
const CuratedIllustration = ({ className }) => (
  <svg viewBox="0 0 800 400" className={className}>
    <defs>
      <radialGradient id="curatedGradient" cx="50%" cy="50%" r="50%">
        <stop offset="0%" stopColor="#6f0e06" stopOpacity="0.8"/>
        <stop offset="40%" stopColor="#e6c392" stopOpacity="0.6"/>
        <stop offset="80%" stopColor="#6f0e06" stopOpacity="0.4"/>
        <stop offset="100%" stopColor="#e6c392" stopOpacity="0.2"/>
      </radialGradient>
      <linearGradient id="starGradient" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#6f0e06" stopOpacity="0.9"/>
        <stop offset="100%" stopColor="#e6c392" stopOpacity="0.7"/>
      </linearGradient>
    </defs>
    
    {/* Central Crown/Star Element */}
    <g transform="translate(400, 200)">
      <circle cx="0" cy="0" r="120" fill="url(#curatedGradient)" opacity="0.3"/>
      
      {/* Crown Shape */}
      <path d="M-60,-40 L-40,-80 L-20,-50 L0,-90 L20,-50 L40,-80 L60,-40 L60,40 L-60,40 Z" 
            fill="url(#starGradient)" opacity="0.7"/>
      <path d="M-50,-30 L-35,-65 L-15,-40 L0,-75 L15,-40 L35,-65 L50,-30 L50,30 L-50,30 Z" 
            fill="none" stroke="#6f0e06" strokeWidth="2" opacity="0.8"/>
      
      {/* Crown Jewels */}
      <circle cx="0" cy="-65" r="6" fill="#e6c392" opacity="0.9"/>
      <circle cx="-35" cy="-55" r="4" fill="#6f0e06" opacity="0.8"/>
      <circle cx="35" cy="-55" r="4" fill="#6f0e06" opacity="0.8"/>
      <circle cx="-15" cy="-30" r="3" fill="#e6c392" opacity="0.7"/>
      <circle cx="15" cy="-30" r="3" fill="#e6c392" opacity="0.7"/>
      
      {/* Central Star */}
      <path d="M0,-15 L5,-5 L15,-5 L8,2 L10,12 L0,7 L-10,12 L-8,2 L-15,-5 L-5,-5 Z" 
            fill="#6f0e06" opacity="0.9"/>
    </g>
    
    {/* Side Decorative Elements */}
    <g transform="translate(150, 150)">
      <path d="M20,0 L25,-10 L30,0 L35,-10 L40,0 L40,20 L20,20 Z" 
            fill="url(#starGradient)" opacity="0.5"/>
      <circle cx="30" cy="-5" r="3" fill="#e6c392" opacity="0.8"/>
      <circle cx="30" cy="10" r="4" fill="#6f0e06" opacity="0.7"/>
    </g>
    
    <g transform="translate(620, 250)">
      <path d="M15,0 L18,-8 L22,0 L26,-8 L30,0 L30,15 L15,15 Z" 
            fill="url(#starGradient)" opacity="0.4"/>
      <circle cx="22.5" cy="-4" r="2" fill="#e6c392" opacity="0.7"/>
      <circle cx="22.5" cy="7.5" r="3" fill="#6f0e06" opacity="0.6"/>
    </g>
    
    {/* Floating Stars */}
    <g transform="translate(250, 80)">
      <path d="M0,-8 L3,-3 L8,-3 L4,0 L5,5 L0,3 L-5,5 L-4,0 L-8,-3 L-3,-3 Z" 
            fill="#6f0e06" opacity="0.6"/>
    </g>
    
    <g transform="translate(550, 120)">
      <path d="M0,-6 L2,-2 L6,-2 L3,0 L4,4 L0,2 L-4,4 L-3,0 L-6,-2 L-2,-2 Z" 
            fill="#e6c392" opacity="0.7"/>
    </g>
    
    <g transform="translate(100, 300)">
      <path d="M0,-5 L2,-1 L5,-1 L2,1 L3,4 L0,2 L-3,4 L-2,1 L-5,-1 L-2,-1 Z" 
            fill="#6f0e06" opacity="0.5"/>
    </g>
    
    <g transform="translate(700, 180)">
      <path d="M0,-7 L2.5,-2 L7,-2 L3.5,0 L4.5,4.5 L0,2.5 L-4.5,4.5 L-3.5,0 L-7,-2 L-2.5,-2 Z" 
            fill="#e6c392" opacity="0.6"/>
    </g>
    
    {/* Decorative Border */}
    <g transform="translate(0, 50)">
      <path d="M0,0 Q100,15 200,0 Q300,15 400,0 Q500,15 600,0 Q700,15 800,0" 
            fill="none" stroke="#6f0e06" strokeWidth="2" opacity="0.3"/>
    </g>
    
    <g transform="translate(0, 350)">
      <path d="M0,0 Q100,-15 200,0 Q300,-15 400,0 Q500,-15 600,0 Q700,-15 800,0" 
            fill="none" stroke="#e6c392" strokeWidth="2" opacity="0.3"/>
    </g>
  </svg>
);

const CuratedCollection = () => {
  const [masterProducts, setMasterProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isQuickViewOpen, setIsQuickViewOpen] = useState(false);
  const [sortBy, setSortBy] = useState('name');
  const [viewMode, setViewMode] = useState('grid');
  const [showFilters, setShowFilters] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [priceRange, setPriceRange] = useState({ min: '', max: '' });
  const [selectedColors, setSelectedColors] = useState([]);
  const navigate = useNavigate();

  // Get design theme
  const designTheme = {
    name: 'Premium Curated',
    colors: {
      primary: '#6f0e06',
      secondary: '#e6c392',
      accent: '#f3e8ff',
      gradient: 'from-rose-50 via-pink-50 to-orange-50'
    }
  };

  useEffect(() => {
    const loadMasterProducts = async () => {
      try {
        setLoading(true);
        const products = await supabaseService.getMasterProducts();
        setMasterProducts(products);
        setFilteredProducts(products);
      } catch (error) {
        console.error('Error loading master products:', error);
      } finally {
        setLoading(false);
      }
    };

    loadMasterProducts();
  }, []);

  // Filter and sort products
  useEffect(() => {
    let filtered = [...masterProducts];

    // Search filter
    if (searchQuery) {
      filtered = filtered.filter(product =>
        product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.description?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Price filter
    if (priceRange.min || priceRange.max) {
      filtered = filtered.filter(product => {
        const price = parseFloat(product.price);
        const min = priceRange.min ? parseFloat(priceRange.min) : 0;
        const max = priceRange.max ? parseFloat(priceRange.max) : Infinity;
        return price >= min && price <= max;
      });
    }

    // Color filter
    if (selectedColors.length > 0) {
      filtered = filtered.filter(product =>
        product.colors?.some(color => selectedColors.includes(color))
      );
    }

    // Sort products
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'price-low':
          return parseFloat(a.price) - parseFloat(b.price);
        case 'price-high':
          return parseFloat(b.price) - parseFloat(a.price);
        case 'name':
        default:
          return a.name.localeCompare(b.name);
      }
    });

    setFilteredProducts(filtered);
  }, [masterProducts, searchQuery, priceRange, selectedColors, sortBy]);

  const handleProductClick = (product) => {
    navigate(`/?featured=${product.id}`);
  };

  const handleQuickView = (product) => {
    setSelectedProduct(product);
    setIsQuickViewOpen(true);
  };

  const clearFilters = () => {
    setSearchQuery('');
    setPriceRange({ min: '', max: '' });
    setSelectedColors([]);
    setSortBy('name');
  };

  // Get unique colors from all products
  const availableColors = [...new Set(masterProducts.flatMap(product => product.colors || []))];

  if (loading) {
    return (
      <div className={`min-h-screen bg-gradient-to-br ${designTheme.colors.gradient} flex items-center justify-center`}>
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-rose-200 border-t-rose-600 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading curated collection...</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen bg-gradient-to-br ${designTheme.colors.gradient}`}>
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        {/* Background Illustration */}
        <div className="absolute inset-0 opacity-20">
          <CuratedIllustration className="w-full h-full object-cover" />
        </div>

        <div className="relative container mx-auto px-4 py-20">
          {/* Breadcrumb */}
          <nav className="mb-8">
            <div className="flex items-center space-x-2 text-sm">
              <Link to="/" className="text-gray-500 hover:text-gray-700 transition-colors">Home</Link>
              <span className="text-gray-400">/</span>
              <span className="text-gray-900 font-medium">Curated Collection</span>
            </div>
          </nav>

          {/* Collection Badge */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="text-center mb-6"
          >
            <span className="inline-flex items-center px-6 py-2 rounded-full text-sm font-medium bg-gradient-to-r from-[#6f0e06] to-[#9a1549] text-white shadow-lg">
              <SparklesIcon className="w-4 h-4 mr-2" />
              CURATED COLLECTION
            </span>
          </motion.div>

          {/* Main Title */}
          <motion.div 
            className="text-center max-w-4xl mx-auto mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <h1 className="text-4xl md:text-6xl font-serif text-gray-900 mb-4">
              Curated Collection
            </h1>
            <p className="text-lg md:text-xl text-gray-600 leading-relaxed">
              Discover our exquisite collection of masterpieces, where traditional
              <br className="hidden md:block" />
              craftsmanship meets contemporary elegance
            </p>
          </motion.div>

          {/* Stats */}
          <motion.div 
            className="grid grid-cols-3 gap-8 max-w-md mx-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <div className="text-center">
              <div className="text-2xl md:text-3xl font-bold text-[#6f0e06]">{masterProducts.length}</div>
              <div className="text-sm text-gray-500 uppercase tracking-wide">PRODUCTS</div>
            </div>
            <div className="text-center">
              <div className="text-2xl md:text-3xl font-bold text-[#6f0e06]">145+</div>
              <div className="text-sm text-gray-500 uppercase tracking-wide">ARTISANS</div>
            </div>
            <div className="text-center">
              <div className="text-2xl md:text-3xl font-bold text-[#6f0e06]">4.8</div>
              <div className="text-sm text-gray-500 uppercase tracking-wide">RATING</div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Products Section */}
      <div className="container mx-auto px-4 py-16">
        {/* Search and Filter Bar */}
        <div className="flex flex-col lg:flex-row gap-4 mb-8">
          {/* Search Bar */}
          <div className="flex-1">
            <div className="relative">
              <MagnifyingGlassIcon className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#6f0e06] focus:border-transparent"
              />
            </div>
          </div>

          {/* Filter and Sort Controls */}
          <div className="flex gap-4">
            <button 
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center gap-2 px-4 py-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <FunnelIcon className="w-5 h-5" />
              Filters
              {(searchQuery || priceRange.min || priceRange.max || selectedColors.length > 0) && (
                <span className="w-2 h-2 bg-[#6f0e06] rounded-full"></span>
              )}
            </button>

            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#6f0e06] focus:border-transparent"
            >
              <option value="name">Sort by Name</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
            </select>

            <div className="flex border border-gray-200 rounded-lg overflow-hidden">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-3 ${viewMode === 'grid' ? 'bg-[#6f0e06] text-white' : 'hover:bg-gray-50'}`}
              >
                <Squares2X2Icon className="w-5 h-5" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-3 ${viewMode === 'list' ? 'bg-[#6f0e06] text-white' : 'hover:bg-gray-50'}`}
              >
                <ListBulletIcon className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>

        {/* Filters Panel */}
        <AnimatePresence>
          {showFilters && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="mb-8 overflow-hidden"
            >
              <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {/* Price Range */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      <CurrencyRupeeIcon className="w-4 h-4 inline mr-1" />
                      Price Range
                    </label>
                    <div className="flex gap-2">
                      <input
                        type="number"
                        placeholder="Min"
                        value={priceRange.min}
                        onChange={(e) => setPriceRange(prev => ({ ...prev, min: e.target.value }))}
                        className="flex-1 px-3 py-2 border border-gray-200 rounded focus:outline-none focus:ring-1 focus:ring-[#6f0e06]"
                      />
                      <input
                        type="number"
                        placeholder="Max"
                        value={priceRange.max}
                        onChange={(e) => setPriceRange(prev => ({ ...prev, max: e.target.value }))}
                        className="flex-1 px-3 py-2 border border-gray-200 rounded focus:outline-none focus:ring-1 focus:ring-[#6f0e06]"
                      />
                    </div>
                  </div>

                  {/* Colors */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      <TagIcon className="w-4 h-4 inline mr-1" />
                      Colors
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {availableColors.map(color => (
                        <button
                          key={color}
                          onClick={() => {
                            setSelectedColors(prev =>
                              prev.includes(color)
                                ? prev.filter(c => c !== color)
                                : [...prev, color]
                            );
                          }}
                          className={`px-3 py-1 text-sm rounded-full border transition-colors ${
                            selectedColors.includes(color)
                              ? 'bg-[#6f0e06] text-white border-[#6f0e06]'
                              : 'border-gray-200 hover:border-gray-300'
                          }`}
                        >
                          {color}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Clear Filters */}
                  <div className="flex items-end">
                    <button
                      onClick={clearFilters}
                      className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
                    >
                      <XMarkIcon className="w-4 h-4" />
                      Clear Filters
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Results Count */}
        <div className="mb-6">
          <p className="text-gray-600">
            Showing {filteredProducts.length} of {masterProducts.length} products
          </p>
        </div>

        {/* Products Grid */}
        {filteredProducts.length === 0 ? (
          <div className="text-center py-20">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gray-100 flex items-center justify-center">
              <SparklesIcon className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No Products Found</h3>
            <p className="text-gray-600">Try adjusting your search or filter criteria.</p>
            <button
              onClick={clearFilters}
              className="mt-4 px-6 py-2 bg-[#6f0e06] text-white rounded-lg hover:bg-[#5a0b05] transition-colors"
            >
              Clear Filters
            </button>
          </div>
        ) : (
          <div className={`grid gap-6 ${
            viewMode === 'grid' 
              ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4' 
              : 'grid-cols-1'
          }`}>
            {filteredProducts.map((product, index) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1, duration: 0.6 }}
              >
                <ProductCard
                  product={{
                    ...product,
                    image_urls: product.image_urls || [],
                    colors: product.colors || [],
                  }}
                  onProductClick={() => handleProductClick(product)}
                  onQuickView={() => handleQuickView(product)}
                  viewMode={viewMode}
                />
              </motion.div>
            ))}
          </div>
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

export default CuratedCollection;