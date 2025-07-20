import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useParams, Link } from 'react-router-dom';
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
import { supabaseService } from '../services/supabaseService';
import ProductQuickView from '../components/ProductQuickView';
import ProductCard from '../components/ProductCard';
import statePersistence from '../utils/statePersistence';

// Design Templates with Custom Illustrations
const CategoryIllustrations = {
  sarees: {
    name: 'Traditional Paisley',
    colors: {
      primary: '#6f0e06',
      secondary: '#e6c392',
      accent: '#f3e8ff',
      gradient: 'from-rose-50 via-pink-50 to-orange-50'
    },
    illustration: ({ className }) => (
      <svg viewBox="0 0 800 400" className={className}>
        <defs>
          <linearGradient id="paisleyGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#6f0e06" stopOpacity="0.8"/>
            <stop offset="50%" stopColor="#e6c392" stopOpacity="0.6"/>
            <stop offset="100%" stopColor="#6f0e06" stopOpacity="0.4"/>
          </linearGradient>
          <pattern id="paisleyPattern" x="0" y="0" width="100" height="100" patternUnits="userSpaceOnUse">
            <path d="M30,10 Q50,0 60,20 T70,40 Q50,70 30,50 T10,30 Q20,20 30,10" fill="url(#paisleyGradient)" opacity="0.3"/>
          </pattern>
        </defs>
        
        {/* Background Pattern */}
        <rect width="100%" height="100%" fill="url(#paisleyPattern)" opacity="0.1"/>
        
        {/* Main Paisley Elements */}
        <g transform="translate(100, 80)">
          <path d="M60,20 Q120,0 140,60 T160,120 Q100,180 60,140 T20,80 Q40,40 60,20" 
                fill="url(#paisleyGradient)" opacity="0.7"/>
          <path d="M70,30 Q110,15 125,65 T140,115 Q105,155 70,125 T35,75 Q50,45 70,30" 
                fill="none" stroke="#6f0e06" strokeWidth="2" opacity="0.8"/>
          <circle cx="80" cy="70" r="8" fill="#e6c392" opacity="0.9"/>
          <circle cx="100" cy="90" r="5" fill="#6f0e06" opacity="0.7"/>
          <circle cx="120" cy="110" r="6" fill="#e6c392" opacity="0.8"/>
        </g>
        
        {/* Decorative Elements */}
        <g transform="translate(400, 100)">
          <path d="M40,10 Q80,0 100,40 T120,80 Q80,120 40,100 T0,60 Q20,20 40,10" 
                fill="url(#paisleyGradient)" opacity="0.5"/>
          <path d="M50,20 Q70,15 80,35 T90,55 Q75,75 50,65 T25,45 Q35,25 50,20" 
                fill="none" stroke="#6f0e06" strokeWidth="1.5" opacity="0.6"/>
        </g>
        
        {/* Floating Elements */}
        <g transform="translate(600, 150)">
          <circle cx="0" cy="0" r="12" fill="#e6c392" opacity="0.6"/>
          <circle cx="30" cy="-20" r="8" fill="#6f0e06" opacity="0.5"/>
          <circle cx="60" cy="10" r="10" fill="#e6c392" opacity="0.7"/>
          <path d="M-10,0 Q10,-20 30,0 Q10,20 -10,0" fill="none" stroke="#6f0e06" strokeWidth="1" opacity="0.4"/>
        </g>
        
        {/* Traditional Border */}
        <g transform="translate(0, 350)">
          <path d="M0,25 Q100,0 200,25 Q300,50 400,25 Q500,0 600,25 Q700,50 800,25" 
                fill="none" stroke="#6f0e06" strokeWidth="2" opacity="0.3"/>
          <path d="M0,35 Q100,10 200,35 Q300,60 400,35 Q500,10 600,35 Q700,60 800,35" 
                fill="none" stroke="#e6c392" strokeWidth="1" opacity="0.4"/>
        </g>
      </svg>
    )
  },
  
  lehengas: {
    name: 'Royal Mandala',
    colors: {
      primary: '#B45309',
      secondary: '#f59e0b',
      accent: '#fef3c7',
      gradient: 'from-amber-50 via-orange-50 to-yellow-50'
    },
    illustration: ({ className }) => (
      <svg viewBox="0 0 800 400" className={className}>
        <defs>
          <radialGradient id="mandalaGradient" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#B45309" stopOpacity="0.8"/>
            <stop offset="40%" stopColor="#f59e0b" stopOpacity="0.6"/>
            <stop offset="80%" stopColor="#B45309" stopOpacity="0.4"/>
            <stop offset="100%" stopColor="#f59e0b" stopOpacity="0.2"/>
          </radialGradient>
        </defs>
        
        {/* Central Mandala */}
        <g transform="translate(400, 200)">
          <circle cx="0" cy="0" r="120" fill="url(#mandalaGradient)" opacity="0.6"/>
          <circle cx="0" cy="0" r="100" fill="none" stroke="#B45309" strokeWidth="2" opacity="0.7"/>
          <circle cx="0" cy="0" r="80" fill="none" stroke="#f59e0b" strokeWidth="1.5" opacity="0.8"/>
          <circle cx="0" cy="0" r="60" fill="none" stroke="#B45309" strokeWidth="1" opacity="0.6"/>
          <circle cx="0" cy="0" r="40" fill="none" stroke="#f59e0b" strokeWidth="1" opacity="0.7"/>
          <circle cx="0" cy="0" r="20" fill="none" stroke="#B45309" strokeWidth="1.5" opacity="0.8"/>
          
          {/* Mandala Petals */}
          {[...Array(8)].map((_, i) => {
            const angle = (i * 45) * Math.PI / 180;
            const x = Math.cos(angle) * 80;
            const y = Math.sin(angle) * 80;
            return (
              <g key={i} transform={`translate(${x}, ${y}) rotate(${i * 45})`}>
                <path d="M0,-15 Q10,-5 0,15 Q-10,-5 0,-15" fill="#B45309" opacity="0.6"/>
                <path d="M0,-25 Q15,-10 0,25 Q-15,-10 0,-25" fill="none" stroke="#f59e0b" strokeWidth="1" opacity="0.5"/>
              </g>
            );
          })}
          
          {/* Central Flower */}
          <circle cx="0" cy="0" r="8" fill="#B45309" opacity="0.9"/>
          <circle cx="0" cy="0" r="5" fill="#f59e0b" opacity="0.8"/>
        </g>
        
        {/* Side Decorative Elements */}
        <g transform="translate(100, 100)">
          <circle cx="0" cy="0" r="60" fill="url(#mandalaGradient)" opacity="0.4"/>
          <circle cx="0" cy="0" r="45" fill="none" stroke="#B45309" strokeWidth="1" opacity="0.5"/>
          <circle cx="0" cy="0" r="30" fill="none" stroke="#f59e0b" strokeWidth="1" opacity="0.6"/>
          <circle cx="0" cy="0" r="15" fill="none" stroke="#B45309" strokeWidth="1" opacity="0.7"/>
        </g>
        
        <g transform="translate(700, 300)">
          <circle cx="0" cy="0" r="50" fill="url(#mandalaGradient)" opacity="0.3"/>
          <circle cx="0" cy="0" r="35" fill="none" stroke="#B45309" strokeWidth="1" opacity="0.4"/>
          <circle cx="0" cy="0" r="20" fill="none" stroke="#f59e0b" strokeWidth="1" opacity="0.5"/>
        </g>
        
        {/* Decorative Border */}
        <g transform="translate(0, 20)">
          <path d="M50,0 Q100,20 150,0 Q200,20 250,0 Q300,20 350,0 Q400,20 450,0 Q500,20 550,0 Q600,20 650,0 Q700,20 750,0" 
                fill="none" stroke="#B45309" strokeWidth="2" opacity="0.4"/>
        </g>
        
        <g transform="translate(0, 380)">
          <path d="M50,0 Q100,-20 150,0 Q200,-20 250,0 Q300,-20 350,0 Q400,-20 450,0 Q500,-20 550,0 Q600,-20 650,0 Q700,-20 750,0" 
                fill="none" stroke="#f59e0b" strokeWidth="2" opacity="0.4"/>
        </g>
      </svg>
    )
  },
  
  suits: {
    name: 'Contemporary Floral',
    colors: {
      primary: '#1a56ba',
      secondary: '#3b82f6',
      accent: '#dbeafe',
      gradient: 'from-blue-50 via-indigo-50 to-purple-50'
    },
    illustration: ({ className }) => (
      <svg viewBox="0 0 800 400" className={className}>
        <defs>
          <linearGradient id="floralGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#1a56ba" stopOpacity="0.7"/>
            <stop offset="50%" stopColor="#3b82f6" stopOpacity="0.5"/>
            <stop offset="100%" stopColor="#1a56ba" stopOpacity="0.3"/>
          </linearGradient>
        </defs>
        
        {/* Main Floral Elements */}
        <g transform="translate(200, 150)">
          <path d="M50,20 Q70,0 90,20 Q70,40 50,20" fill="url(#floralGradient)" opacity="0.8"/>
          <path d="M20,50 Q40,30 60,50 Q40,70 20,50" fill="url(#floralGradient)" opacity="0.7"/>
          <path d="M50,80 Q70,60 90,80 Q70,100 50,80" fill="url(#floralGradient)" opacity="0.6"/>
          <path d="M80,50 Q100,30 120,50 Q100,70 80,50" fill="url(#floralGradient)" opacity="0.7"/>
          <circle cx="55" cy="55" r="15" fill="#1a56ba" opacity="0.8"/>
          <circle cx="55" cy="55" r="8" fill="#3b82f6" opacity="0.9"/>
          
          {/* Leaves */}
          <path d="M30,30 Q35,20 45,25 Q50,35 45,45 Q35,50 30,40 Q25,35 30,30" 
                fill="#1a56ba" opacity="0.5"/>
          <path d="M75,75 Q80,65 90,70 Q95,80 90,90 Q80,95 75,85 Q70,80 75,75" 
                fill="#3b82f6" opacity="0.6"/>
        </g>
        
        {/* Secondary Floral Group */}
        <g transform="translate(500, 200)">
          <path d="M40,15 Q55,0 70,15 Q55,30 40,15" fill="url(#floralGradient)" opacity="0.6"/>
          <path d="M15,40 Q30,25 45,40 Q30,55 15,40" fill="url(#floralGradient)" opacity="0.5"/>
          <path d="M40,65 Q55,50 70,65 Q55,80 40,65" fill="url(#floralGradient)" opacity="0.6"/>
          <path d="M65,40 Q80,25 95,40 Q80,55 65,40" fill="url(#floralGradient)" opacity="0.5"/>
          <circle cx="42" cy="42" r="12" fill="#1a56ba" opacity="0.7"/>
          <circle cx="42" cy="42" r="6" fill="#3b82f6" opacity="0.8"/>
        </g>
        
        {/* Decorative Stars */}
        <g transform="translate(100, 80)">
          <path d="M25,0 L30,20 L50,25 L30,30 L25,50 L20,30 L0,25 L20,20 Z" 
                fill="#1a56ba" opacity="0.4"/>
          <path d="M25,10 L28,20 L40,25 L28,30 L25,40 L22,30 L10,25 L22,20 Z" 
                fill="#3b82f6" opacity="0.5"/>
        </g>
        
        <g transform="translate(650, 100)">
          <path d="M20,0 L24,16 L40,20 L24,24 L20,40 L16,24 L0,20 L16,16 Z" 
                fill="#1a56ba" opacity="0.3"/>
          <path d="M20,8 L22,16 L32,20 L22,24 L20,32 L18,24 L8,20 L18,16 Z" 
                fill="#3b82f6" opacity="0.4"/>
        </g>
        
        {/* Wave Pattern */}
        <g transform="translate(0, 320)">
          <path d="M0,40 Q100,20 200,40 Q300,60 400,40 Q500,20 600,40 Q700,60 800,40" 
                fill="none" stroke="#1a56ba" strokeWidth="2" opacity="0.4"/>
          <path d="M0,50 Q100,30 200,50 Q300,70 400,50 Q500,30 600,50 Q700,70 800,50" 
                fill="none" stroke="#3b82f6" strokeWidth="1.5" opacity="0.3"/>
        </g>
      </svg>
    )
  },
  
  kurtis: {
    name: 'Elegant Geometric',
    colors: {
      primary: '#0F766E',
      secondary: '#14b8a6',
      accent: '#ccfbf1',
      gradient: 'from-emerald-50 via-teal-50 to-cyan-50'
    },
    illustration: ({ className }) => (
      <svg viewBox="0 0 800 400" className={className}>
        <defs>
          <linearGradient id="geometricGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#0F766E" stopOpacity="0.8"/>
            <stop offset="50%" stopColor="#14b8a6" stopOpacity="0.6"/>
            <stop offset="100%" stopColor="#0F766E" stopOpacity="0.4"/>
          </linearGradient>
        </defs>
        
        {/* Geometric Pattern Grid */}
        <g transform="translate(100, 50)">
          {[...Array(6)].map((_, row) => 
            [...Array(8)].map((_, col) => (
              <g key={`${row}-${col}`} transform={`translate(${col * 80}, ${row * 60})`}>
                <rect x="0" y="0" width="50" height="50" 
                      fill="url(#geometricGradient)" 
                      opacity={0.3 + (row + col) * 0.05}/>
                <rect x="5" y="5" width="40" height="40" 
                      fill="none" 
                      stroke="#0F766E" 
                      strokeWidth="1" 
                      opacity={0.4 + (row + col) * 0.04}/>
                <rect x="15" y="15" width="20" height="20" 
                      fill="#14b8a6" 
                      opacity={0.5 + (row + col) * 0.03}/>
              </g>
            ))
          )}
        </g>
        
        {/* Diamond Elements */}
        <g transform="translate(200, 150)">
          <path d="M50,0 L100,50 L50,100 L0,50 Z" 
                fill="url(#geometricGradient)" opacity="0.6"/>
          <path d="M50,10 L90,50 L50,90 L10,50 Z" 
                fill="none" stroke="#0F766E" strokeWidth="2" opacity="0.7"/>
          <path d="M50,20 L80,50 L50,80 L20,50 Z" 
                fill="none" stroke="#14b8a6" strokeWidth="1.5" opacity="0.8"/>
          <circle cx="50" cy="50" r="8" fill="#0F766E" opacity="0.9"/>
        </g>
        
        <g transform="translate(500, 200)">
          <path d="M40,0 L80,40 L40,80 L0,40 Z" 
                fill="url(#geometricGradient)" opacity="0.5"/>
          <path d="M40,8 L72,40 L40,72 L8,40 Z" 
                fill="none" stroke="#0F766E" strokeWidth="1.5" opacity="0.6"/>
          <path d="M40,16 L64,40 L40,64 L16,40 Z" 
                fill="none" stroke="#14b8a6" strokeWidth="1" opacity="0.7"/>
          <circle cx="40" cy="40" r="6" fill="#14b8a6" opacity="0.8"/>
        </g>
        
        {/* Hexagonal Pattern */}
        <g transform="translate(600, 100)">
          <path d="M30,0 L60,15 L60,45 L30,60 L0,45 L0,15 Z" 
                fill="url(#geometricGradient)" opacity="0.4"/>
          <path d="M30,5 L55,17.5 L55,42.5 L30,55 L5,42.5 L5,17.5 Z" 
                fill="none" stroke="#0F766E" strokeWidth="1.5" opacity="0.5"/>
          <path d="M30,10 L50,20 L50,40 L30,50 L10,40 L10,20 Z" 
                fill="none" stroke="#14b8a6" strokeWidth="1" opacity="0.6"/>
          <circle cx="30" cy="30" r="5" fill="#0F766E" opacity="0.7"/>
        </g>
        
        {/* Border Pattern */}
        <g transform="translate(0, 10)">
          <path d="M0,0 L800,0 L800,20 L0,20 Z" fill="url(#geometricGradient)" opacity="0.2"/>
          <path d="M20,0 L40,20 M60,0 L80,20 M100,0 L120,20 M140,0 L160,20 M180,0 L200,20 M220,0 L240,20 M260,0 L280,20 M300,0 L320,20 M340,0 L360,20 M380,0 L400,20 M420,0 L440,20 M460,0 L480,20 M500,0 L520,20 M540,0 L560,20 M580,0 L600,20 M620,0 L640,20 M660,0 L680,20 M700,0 L720,20 M740,0 L760,20 M780,0 L800,20" 
                stroke="#0F766E" strokeWidth="1" opacity="0.3"/>
        </g>
        
        <g transform="translate(0, 370)">
          <path d="M0,0 L800,0 L800,20 L0,20 Z" fill="url(#geometricGradient)" opacity="0.2"/>
          <path d="M20,20 L40,0 M60,20 L80,0 M100,20 L120,0 M140,20 L160,0 M180,20 L200,0 M220,20 L240,0 M260,20 L280,0 M300,20 L320,0 M340,20 L360,0 M380,20 L400,0 M420,20 L440,0 M460,20 L480,0 M500,20 L520,0 M540,20 L560,0 M580,20 L600,0 M620,20 L640,0 M660,20 L680,0 M700,20 L720,0 M740,20 L760,0 M780,20 L800,0" 
                stroke="#14b8a6" strokeWidth="1" opacity="0.3"/>
        </g>
      </svg>
    )
  },
  
  default: {
    name: 'Traditional Elegance',
    colors: {
      primary: '#6f0e06',
      secondary: '#e6c392',
      accent: '#f3e8ff',
      gradient: 'from-rose-50 via-pink-50 to-purple-50'
    },
    illustration: ({ className }) => (
      <svg viewBox="0 0 800 400" className={className}>
        <defs>
          <radialGradient id="defaultGradient" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#6f0e06" stopOpacity="0.8"/>
            <stop offset="50%" stopColor="#e6c392" stopOpacity="0.6"/>
            <stop offset="100%" stopColor="#6f0e06" stopOpacity="0.4"/>
          </radialGradient>
        </defs>
        
        {/* Central Decorative Element */}
        <g transform="translate(400, 200)">
          <circle cx="0" cy="0" r="100" fill="url(#defaultGradient)" opacity="0.5"/>
          <circle cx="0" cy="0" r="80" fill="none" stroke="#6f0e06" strokeWidth="2" opacity="0.6"/>
          <circle cx="0" cy="0" r="60" fill="none" stroke="#e6c392" strokeWidth="1.5" opacity="0.7"/>
          <circle cx="0" cy="0" r="40" fill="none" stroke="#6f0e06" strokeWidth="1" opacity="0.5"/>
          <circle cx="0" cy="0" r="20" fill="#e6c392" opacity="0.8"/>
          <circle cx="0" cy="0" r="10" fill="#6f0e06" opacity="0.9"/>
        </g>
        
        {/* Side Elements */}
        <g transform="translate(150, 120)">
          <path d="M30,10 Q50,0 60,20 T70,40 Q50,70 30,50 T10,30 Q20,20 30,10" 
                fill="url(#defaultGradient)" opacity="0.6"/>
        </g>
        
        <g transform="translate(600, 250)">
          <path d="M25,8 Q40,0 50,16 T60,32 Q40,56 25,40 T8,24 Q16,16 25,8" 
                fill="url(#defaultGradient)" opacity="0.5"/>
        </g>
        
        {/* Decorative Border */}
        <g transform="translate(0, 50)">
          <path d="M0,0 Q100,20 200,0 Q300,20 400,0 Q500,20 600,0 Q700,20 800,0" 
                fill="none" stroke="#6f0e06" strokeWidth="2" opacity="0.4"/>
        </g>
        
        <g transform="translate(0, 350)">
          <path d="M0,0 Q100,-20 200,0 Q300,-20 400,0 Q500,-20 600,0 Q700,-20 800,0" 
                fill="none" stroke="#e6c392" strokeWidth="2" opacity="0.4"/>
        </g>
      </svg>
    )
  }
};

const DynamicCategoryPage = () => {
  const { categorySlug } = useParams();
  const [category, setCategory] = useState(null);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isQuickViewOpen, setIsQuickViewOpen] = useState(false);
  const [sortBy, setSortBy] = useState('name');
  const [filterBy, setFilterBy] = useState('all');
  const [viewMode, setViewMode] = useState('grid');
  const [showFilters, setShowFilters] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [priceRange, setPriceRange] = useState({ min: '', max: '' });
  const [selectedColors, setSelectedColors] = useState([]);
  const [selectedSizes, setSelectedSizes] = useState([]);
  
  // Load saved sort/filter state for this category
  useEffect(() => {
    if (categorySlug) {
      const savedState = statePersistence.loadSortFilterState(categorySlug);
      if (savedState) {
        setSortBy(savedState.sortBy || 'name');
        setFilterBy(savedState.filterBy || 'all');
        setViewMode(savedState.viewMode || 'grid');
      }
    }
  }, [categorySlug]);

  // Save sort/filter state whenever it changes
  useEffect(() => {
    if (categorySlug) {
      statePersistence.saveSortFilterState(categorySlug, {
        sortBy,
        filterBy,
        viewMode
      });
    }
  }, [categorySlug, sortBy, filterBy, viewMode]);

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

  // Advanced filtering and sorting
  const filteredAndSortedProducts = products
    .filter(product => {
      // Basic filter
      if (filterBy === 'featured' && !product.featured) return false;
      if (filterBy === 'sale' && !product.discount) return false;
      
      // Search filter
      if (searchQuery && !product.name.toLowerCase().includes(searchQuery.toLowerCase())) {
        return false;
      }
      
      // Price range filter
      if (priceRange.min && product.price < parseInt(priceRange.min)) return false;
      if (priceRange.max && product.price > parseInt(priceRange.max)) return false;
      
      // Color filter
      if (selectedColors.length > 0) {
        const hasSelectedColor = product.colors && product.colors.some(color => 
          selectedColors.includes(color)
        );
        if (!hasSelectedColor) return false;
      }
      
      // Size filter
      if (selectedSizes.length > 0) {
        const hasSelectedSize = product.sizes && product.sizes.some(size => 
          selectedSizes.includes(size)
        );
        if (!hasSelectedSize) return false;
      }
      
      return true;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'price-low':
          return a.price - b.price;
        case 'price-high':
          return b.price - a.price;
        case 'newest':
          return new Date(b.created_at || 0) - new Date(a.created_at || 0);
        case 'popularity':
          return (b.rating || 0) - (a.rating || 0);
        case 'name':
        default:
          return a.name.localeCompare(b.name);
      }
    });

  // Get category illustration
  const categoryKey = categorySlug || 'default';
  const illustration = CategoryIllustrations[categoryKey] || CategoryIllustrations.default;

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-[#6f0e06] mx-auto mb-4"></div>
          <p className="text-gray-600 text-lg">Loading category...</p>
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
            className="inline-flex items-center px-6 py-3 border-2 border-[#6f0e06] text-[#6f0e06] rounded-md hover:bg-[#6f0e06] hover:text-white transition-all duration-300"
          >
            Back to Home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white">
      {/* Enhanced Hero Section with Custom Illustration */}
      <motion.div 
        className={`relative h-[500px] bg-gradient-to-br ${illustration.colors.gradient} overflow-hidden`}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
      >
        {/* Animated Background Pattern */}
        <div className="absolute inset-0 opacity-20">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 1.2, ease: "easeOut" }}
          >
            <illustration.illustration className="w-full h-full object-cover" />
          </motion.div>
        </div>
        
        {/* Floating Orbs */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <motion.div
            className="absolute top-20 left-20 w-32 h-32 rounded-full opacity-20"
            style={{ backgroundColor: illustration.colors.primary }}
            animate={{
              y: [0, -20, 0],
              x: [0, 10, 0],
              scale: [1, 1.1, 1]
            }}
            transition={{
              duration: 6,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
          <motion.div
            className="absolute top-40 right-32 w-24 h-24 rounded-full opacity-15"
            style={{ backgroundColor: illustration.colors.secondary }}
            animate={{
              y: [0, 15, 0],
              x: [0, -15, 0],
              scale: [1, 0.9, 1]
            }}
            transition={{
              duration: 8,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 2
            }}
          />
          <motion.div
            className="absolute bottom-32 left-1/3 w-20 h-20 rounded-full opacity-10"
            style={{ backgroundColor: illustration.colors.primary }}
            animate={{
              y: [0, -10, 0],
              x: [0, 20, 0],
              scale: [1, 1.2, 1]
            }}
            transition={{
              duration: 7,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 4
            }}
          />
        </div>
        
        {/* Content */}
        <div className="relative h-full flex items-center justify-center text-center z-10">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="max-w-4xl mx-auto px-4"
          >
            {/* Category Badge */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.5 }}
              className="inline-flex items-center px-4 py-2 rounded-full mb-6"
              style={{ 
                backgroundColor: `${illustration.colors.primary}20`,
                color: illustration.colors.primary,
                border: `1px solid ${illustration.colors.primary}40`
              }}
            >
              <SparklesIcon className="w-4 h-4 mr-2" />
              <span className="text-sm font-medium uppercase tracking-wider">
                {illustration.name} Collection
              </span>
            </motion.div>
            
            {/* Title */}
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
              className="text-6xl md:text-7xl font-serif font-light mb-6"
              style={{ color: illustration.colors.primary }}
            >
              {category.name}
            </motion.h1>
            
            {/* Decorative Line */}
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: '120px' }}
              transition={{ duration: 0.8, delay: 0.8 }}
              className="h-0.5 mx-auto mb-8"
              style={{ backgroundColor: illustration.colors.secondary }}
            />
            
            {/* Description */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 1 }}
              className="text-xl text-gray-700 max-w-2xl mx-auto leading-relaxed"
            >
              {category.description || `Discover our exquisite collection of ${category.name.toLowerCase()}, crafted with traditional techniques and contemporary design sensibilities.`}
            </motion.p>
            
            {/* Stats */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 1.2 }}
              className="flex justify-center items-center space-x-8 mt-8"
            >
              <div className="text-center">
                <div className="text-2xl font-bold" style={{ color: illustration.colors.primary }}>
                  {filteredAndSortedProducts.length}
                </div>
                <div className="text-sm text-gray-600 uppercase tracking-wider">Products</div>
              </div>
              <div className="w-px h-8 bg-gray-300"></div>
              <div className="text-center">
                <div className="text-2xl font-bold" style={{ color: illustration.colors.primary }}>
                  {Math.floor(Math.random() * 50) + 100}+
                </div>
                <div className="text-sm text-gray-600 uppercase tracking-wider">Artisans</div>
              </div>
              <div className="w-px h-8 bg-gray-300"></div>
              <div className="text-center">
                <div className="text-2xl font-bold" style={{ color: illustration.colors.primary }}>
                  4.8
                </div>
                <div className="text-sm text-gray-600 uppercase tracking-wider">Rating</div>
              </div>
            </motion.div>
          </motion.div>
        </div>
        
        {/* Scroll Indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 1.5 }}
          className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
        >
          <motion.div
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            className="w-6 h-10 border-2 border-gray-400 rounded-full flex justify-center"
          >
            <motion.div
              animate={{ y: [0, 12, 0] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
              className="w-1 h-3 bg-gray-400 rounded-full mt-2"
            />
          </motion.div>
        </motion.div>
      </motion.div>

      {/* Breadcrumb */}
      <div className="container mx-auto px-4 py-6">
        <motion.nav
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          className="flex items-center space-x-2 text-sm text-gray-600"
        >
          <Link to="/" className="hover:text-[#6f0e06] transition-colors">Home</Link>
          <span>/</span>
          <Link to="/categories" className="hover:text-[#6f0e06] transition-colors">Categories</Link>
          <span>/</span>
          <span className="text-gray-900 font-medium">{category.name}</span>
        </motion.nav>
      </div>

      {/* Enhanced Filters and Controls */}
      <div className="container mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="bg-white rounded-xl shadow-lg border border-gray-200 p-6 mb-8"
        >
          {/* Top Controls */}
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 mb-6">
            {/* Search */}
            <div className="relative flex-1 max-w-md">
              <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#6f0e06] focus:border-transparent transition-all duration-300"
              />
            </div>
            
            {/* Controls */}
            <div className="flex items-center space-x-4">
              {/* Filter Toggle */}
              <button
                onClick={() => setShowFilters(!showFilters)}
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg border transition-all duration-300 ${
                  showFilters 
                    ? 'bg-[#6f0e06] text-white border-[#6f0e06]' 
                    : 'bg-white text-gray-700 border-gray-300 hover:border-[#6f0e06]'
                }`}
              >
                <FunnelIcon className="w-4 h-4" />
                <span>Filters</span>
              </button>
              
              {/* View Mode */}
              <div className="flex items-center border border-gray-300 rounded-lg overflow-hidden">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 transition-colors duration-300 ${
                    viewMode === 'grid' 
                      ? 'bg-[#6f0e06] text-white' 
                      : 'bg-white text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  <Squares2X2Icon className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2 transition-colors duration-300 ${
                    viewMode === 'list' 
                      ? 'bg-[#6f0e06] text-white' 
                      : 'bg-white text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  <ListBulletIcon className="w-4 h-4" />
                </button>
              </div>
              
              {/* Sort */}
              <select 
                value={sortBy} 
                onChange={(e) => setSortBy(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#6f0e06] focus:border-transparent transition-all duration-300"
              >
                <option value="name">Sort by Name</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="newest">Newest First</option>
                <option value="popularity">Most Popular</option>
              </select>
            </div>
          </div>
          
          {/* Advanced Filters */}
          <AnimatePresence>
            {showFilters && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3 }}
                className="border-t border-gray-200 pt-6"
              >
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  {/* Category Filter */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                    <select 
                      value={filterBy} 
                      onChange={(e) => setFilterBy(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#6f0e06] focus:border-transparent"
                    >
                      <option value="all">All Products</option>
                      <option value="featured">Featured</option>
                      <option value="sale">On Sale</option>
                    </select>
                  </div>
                  
                  {/* Price Range */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Price Range</label>
                    <div className="flex space-x-2">
                      <input
                        type="number"
                        placeholder="Min"
                        value={priceRange.min}
                        onChange={(e) => setPriceRange({...priceRange, min: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#6f0e06] focus:border-transparent"
                      />
                      <input
                        type="number"
                        placeholder="Max"
                        value={priceRange.max}
                        onChange={(e) => setPriceRange({...priceRange, max: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#6f0e06] focus:border-transparent"
                      />
                    </div>
                  </div>
                  
                  {/* Clear Filters */}
                  <div className="flex items-end">
                    <button
                      onClick={() => {
                        setSearchQuery('');
                        setPriceRange({ min: '', max: '' });
                        setSelectedColors([]);
                        setSelectedSizes([]);
                        setFilterBy('all');
                        setSortBy('name');
                      }}
                      className="flex items-center space-x-2 px-4 py-2 text-gray-600 hover:text-[#6f0e06] transition-colors duration-300"
                    >
                      <XMarkIcon className="w-4 h-4" />
                      <span>Clear All</span>
                    </button>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>

      {/* Products Section */}
      <div className="container mx-auto px-4 pb-16">
        {filteredAndSortedProducts.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center py-20"
          >
            <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-gray-100 flex items-center justify-center">
              <MagnifyingGlassIcon className="w-12 h-12 text-gray-400" />
            </div>
            <h3 className="text-2xl font-serif text-gray-900 mb-4">No products found</h3>
            <p className="text-gray-600 mb-8 max-w-md mx-auto">
              {searchQuery || priceRange.min || priceRange.max || filterBy !== 'all'
                ? 'Try adjusting your filters or search terms to find what you\'re looking for.'
                : `No products available in ${category.name} category yet.`
              }
            </p>
            {(searchQuery || priceRange.min || priceRange.max || filterBy !== 'all') && (
              <button
                onClick={() => {
                  setSearchQuery('');
                  setPriceRange({ min: '', max: '' });
                  setSelectedColors([]);
                  setSelectedSizes([]);
                  setFilterBy('all');
                }}
                className="px-6 py-3 bg-[#6f0e06] text-white rounded-lg hover:bg-[#9a1549] transition-colors duration-300"
              >
                Clear All Filters
              </button>
            )}
          </motion.div>
        ) : (
          <>
            {/* Results Header */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="flex justify-between items-center mb-8"
            >
              <div>
                <h2 className="text-2xl font-serif text-gray-900">
                  {filteredAndSortedProducts.length} Product{filteredAndSortedProducts.length !== 1 ? 's' : ''} Found
                </h2>
                <p className="text-gray-600 mt-1">
                  Showing {filteredAndSortedProducts.length} of {products.length} products
                </p>
              </div>
              
              {/* Quick Stats */}
              <div className="hidden md:flex items-center space-x-6 text-sm text-gray-600">
                <div className="flex items-center space-x-1">
                  <StarIcon className="w-4 h-4 text-yellow-400 fill-current" />
                  <span>4.8 avg rating</span>
                </div>
                <div className="flex items-center space-x-1">
                  <HeartIcon className="w-4 h-4 text-red-400" />
                  <span>95% satisfaction</span>
                </div>
              </div>
            </motion.div>
            
            {/* Products Grid */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className={`grid gap-4 sm:gap-6 lg:gap-8 ${
                viewMode === 'grid' 
                  ? 'grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4' 
                  : 'grid-cols-1'
              }`}
            >
              {filteredAndSortedProducts.map((product, index) => (
                <motion.div
                  key={product.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className={viewMode === 'list' ? 'border-b border-gray-200 pb-8' : ''}
                >
                  {viewMode === 'grid' ? (
                    <ProductCard
                      product={product}
                      onQuickView={openQuickView}
                      onAddToCart={addToCart}
                    />
                  ) : (
                    // List view layout
                    <div className="flex flex-col md:flex-row gap-6 p-6 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow duration-300">
                      <div className="md:w-1/3">
                        <img
                          src={product.image_urls?.[0] || 'https://via.placeholder.com/400x500'}
                          alt={product.name}
                          className="w-full h-64 md:h-48 object-cover rounded-lg"
                        />
                      </div>
                      <div className="md:w-2/3 flex flex-col justify-between">
                        <div>
                          <h3 className="text-xl font-serif text-gray-900 mb-2">{product.name}</h3>
                          <p className="text-gray-600 mb-4 line-clamp-3">{product.description}</p>
                          <div className="flex items-center space-x-4 mb-4">
                            <span className="text-2xl font-bold text-[#6f0e06]">
                              ₹{product.price?.toLocaleString()}
                            </span>
                            {product.original_price && (
                              <span className="text-lg text-gray-500 line-through">
                                ₹{product.original_price.toLocaleString()}
                              </span>
                            )}
                          </div>
                        </div>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-2">
                            <button
                              onClick={() => openQuickView(product)}
                              className="flex items-center space-x-1 text-gray-600 hover:text-[#6f0e06] transition-colors duration-300"
                            >
                              <EyeIcon className="w-4 h-4" />
                              <span>Quick View</span>
                            </button>
                          </div>
                          <button
                            onClick={(e) => addToCart(product, e)}
                            className="flex items-center space-x-2 px-4 py-2 bg-[#6f0e06] text-white rounded-lg hover:bg-[#9a1549] transition-colors duration-300"
                          >
                            <ShoppingBagIcon className="w-4 h-4" />
                            <span>Add to Cart</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </motion.div>
              ))}
            </motion.div>
          </>
        )}
      </div>

      {/* Quick View Modal */}
      <AnimatePresence>
        {isQuickViewOpen && selectedProduct && (
          <ProductQuickView
            product={selectedProduct}
            isOpen={isQuickViewOpen}
            onClose={() => setIsQuickViewOpen(false)}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default DynamicCategoryPage; 