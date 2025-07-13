import { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { supabaseService } from '../services/supabaseService';
import { useToast } from '../hooks/use-toast';

// Import our new components
import { 
  ColorfulOrbs, 
  PaislayPattern, 
  WishlistDecorativeBorder, 
  TiltCard,
  ShimmerButton
} from '../components/WishlistAnimation';
import WishlistStats from '../components/WishlistStats';
import WishlistShare from '../components/WishlistShare';
import WishlistConfetti from '../components/WishlistConfetti';

const Wishlist = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [wishlistItems, setWishlistItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [removing, setRemoving] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [showConfetti, setShowConfetti] = useState(false);
  const [showStats, setShowStats] = useState(false);
  const [showShare, setShowShare] = useState(false);
  const [isGridView, setIsGridView] = useState(true);
  const [selectedItems, setSelectedItems] = useState([]);
  const containerRef = useRef(null);

  useEffect(() => {
    if (user) {
      fetchWishlistItems();
    } else {
      setLoading(false);
    }
  }, [user]);

  const fetchWishlistItems = async () => {
    try {
      setLoading(true);
      const data = await supabaseService.getWishlist(user.id);
      setWishlistItems(data);
    } catch (error) {
      console.error('Error fetching wishlist:', error);
      toast({
        title: "Error loading wishlist",
        description: error.message,
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const removeFromWishlist = async (productId) => {
    try {
      setRemoving(productId);
      await supabaseService.removeFromWishlist(user.id, productId);
      setWishlistItems(items => items.filter(item => item.product_id !== productId));
      toast({
        title: "Removed from wishlist",
        description: "Item has been removed from your wishlist."
      });
    } catch (error) {
      console.error('Error removing from wishlist:', error);
      toast({
        title: "Error removing item",
        description: error.message,
        variant: "destructive"
      });
    } finally {
      setRemoving(null);
    }
  };

  const addToCart = async (product) => {
    if (!user) {
      navigate('/auth');
        return;
      }
      
    try {
      // In a real implementation, you would add to cart
      console.log('Adding to cart:', product);
      toast({
        title: "Added to cart",
        description: `${product.name} has been added to your cart.`
      });
      navigate('/cart');
    } catch (error) {
      console.error('Error adding to cart:', error);
      toast({
        title: "Error adding to cart",
        description: error.message,
        variant: "destructive"
      });
    }
  };

  const handleBulkRemove = async () => {
    if (selectedItems.length === 0) return;

    try {
      await Promise.all(
        selectedItems.map(productId => 
          supabaseService.removeFromWishlist(user.id, productId)
        )
      );
      
      setWishlistItems(items => 
        items.filter(item => !selectedItems.includes(item.product_id))
      );
      setSelectedItems([]);
      
      toast({
        title: "Items removed",
        description: `${selectedItems.length} items removed from wishlist.`
      });
    } catch (error) {
      console.error('Error removing items:', error);
      toast({
        title: "Error removing items",
        description: error.message,
        variant: "destructive"
      });
    }
  };

  const toggleSelectItem = (productId) => {
    setSelectedItems(prev => 
      prev.includes(productId) 
        ? prev.filter(id => id !== productId)
        : [...prev, productId]
    );
  };

  const selectAllItems = () => {
    setSelectedItems(filteredItems.map(item => item.product_id));
  };

  const deselectAllItems = () => {
    setSelectedItems([]);
  };

  // Filter and search functionality
  const filteredItems = wishlistItems.filter(item => {
    const matchesCategory = selectedCategory === 'all' || 
      item.products?.categories?.slug === selectedCategory;
    const matchesSearch = item.products?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.products?.description?.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  // Get unique categories for filter
  const categories = [...new Set(wishlistItems.map(item => item.products?.categories?.slug).filter(Boolean))];

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-rose-50 via-white to-pink-50 flex items-center justify-center">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center p-8 bg-white rounded-2xl shadow-xl border border-rose-100"
        >
          <div className="w-16 h-16 bg-rose-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-rose-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
            </svg>
          </div>
          <h2 className="text-2xl font-serif text-gray-900 mb-4">Sign in to view your wishlist</h2>
          <p className="text-gray-600 mb-6">Create an account or sign in to save your favorite items.</p>
          <Link to="/auth">
            <button className="bg-[#ba1a5d] hover:bg-[#9a1549] text-white px-6 py-3 rounded-md transition-colors duration-300">
              Sign In
            </button>
          </Link>
        </motion.div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-rose-50 via-white to-pink-50">
        <div className="container mx-auto px-4 py-16">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-300 rounded w-64 mx-auto mb-8"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="bg-white rounded-lg p-6">
                  <div className="h-48 bg-gray-300 rounded mb-4"></div>
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-50 via-white to-pink-50 relative overflow-hidden">
      {/* Background Elements */}
      <ColorfulOrbs />
      <PaislayPattern />
      
      {/* Confetti */}
      {showConfetti && <WishlistConfetti />}
      
      {/* Header */}
      <div className="relative bg-gradient-to-r from-[#ba1a5d] to-[#9a1549] py-16 mb-8">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="absolute inset-0 bg-[url('/patterns/paisley.svg')] opacity-10"></div>
        <div className="relative container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center text-white"
          >
            <h1 className="text-4xl font-serif font-light mb-2">My Wishlist</h1>
            <div className="w-24 h-[1px] bg-white/50 mx-auto mb-4"></div>
            <p className="text-white/90">
              {wishlistItems.length} {wishlistItems.length === 1 ? 'item' : 'items'} saved for later
            </p>
        </motion.div>
        </div>
      </div>
        
      <div className="container mx-auto px-4 pb-16" ref={containerRef}>
        {wishlistItems.length === 0 ? (
            <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-16"
          >
            <div className="w-24 h-24 bg-rose-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg className="w-12 h-12 text-rose-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
            </div>
            <h2 className="text-2xl font-serif text-gray-900 mb-4">Your wishlist is empty</h2>
            <p className="text-gray-600 mb-8">Start adding items you love to your wishlist!</p>
            <Link to="/">
              <button className="bg-[#ba1a5d] hover:bg-[#9a1549] text-white px-8 py-3 rounded-md transition-colors duration-300">
                Start Shopping
              </button>
            </Link>
          </motion.div>
        ) : (
          <>
            {/* Filters and Controls */}
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-8">
              <div className="flex flex-wrap items-center gap-4">
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#ba1a5d] focus:border-transparent"
                >
                  <option value="all">All Categories</option>
                  {categories.map(category => (
                    <option key={category} value={category}>
                      {category.charAt(0).toUpperCase() + category.slice(1)}
                    </option>
                  ))}
                </select>

                <input
                  type="text"
                  placeholder="Search items..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#ba1a5d] focus:border-transparent"
                />
              </div>

              <div className="flex items-center gap-4">
                {selectedItems.length > 0 && (
                  <button
                    onClick={handleBulkRemove}
                    className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors duration-300"
                  >
                    Remove Selected ({selectedItems.length})
                  </button>
                )}
                
                    <button
                  onClick={selectedItems.length === filteredItems.length ? deselectAllItems : selectAllItems}
                  className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors duration-300"
                >
                  {selectedItems.length === filteredItems.length ? 'Deselect All' : 'Select All'}
                    </button>
              </div>
                  </div>
                  
            {/* Items Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredItems.map((item, index) => (
                <TiltCard key={item.id} index={index}>
                  <div className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300">
                    <div className="relative">
                      <img
                        src={item.products?.image_urls?.[0] || '/placeholder-product.jpg'}
                        alt={item.products?.name}
                        className="w-full h-48 object-cover"
                      />
                      
                      {/* Selection checkbox */}
                      <div className="absolute top-3 left-3">
                        <input
                          type="checkbox"
                          checked={selectedItems.includes(item.product_id)}
                          onChange={() => toggleSelectItem(item.product_id)}
                          className="w-4 h-4 text-[#ba1a5d] rounded focus:ring-[#ba1a5d]"
                        />
                    </div>
                    
                      {/* Remove button */}
                      <button
                        onClick={() => removeFromWishlist(item.product_id)}
                        disabled={removing === item.product_id}
                        className="absolute top-3 right-3 w-8 h-8 bg-white/90 hover:bg-white rounded-full flex items-center justify-center transition-colors duration-200 group"
                      >
                        {removing === item.product_id ? (
                          <div className="w-4 h-4 border-2 border-red-500 border-t-transparent rounded-full animate-spin"></div>
                        ) : (
                          <svg className="w-4 h-4 text-gray-600 group-hover:text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        )}
                      </button>
                    </div>

                    <div className="p-4">
                      <h3 className="font-medium text-gray-900 mb-2">{item.products?.name}</h3>
                      <p className="text-sm text-gray-600 mb-2 line-clamp-2">{item.products?.description}</p>
                      <div className="flex items-center justify-between mb-4">
                        <span className="text-lg font-bold text-[#ba1a5d]">
                          ₹{item.products?.price?.toLocaleString('en-IN')}
                        </span>
                        <span className="text-xs text-gray-500">
                          {item.products?.categories?.name}
                        </span>
                      </div>
                      
                      <div className="flex gap-2">
                      <button
                          onClick={() => addToCart(item.products)}
                          className="flex-1 bg-[#ba1a5d] hover:bg-[#9a1549] text-white py-2 px-4 rounded-md transition-colors duration-300"
                        >
                          Add to Cart
                      </button>
                        <Link
                          to={`/product/${item.products?.id}`}
                          className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors duration-300"
                        >
                          View
                        </Link>
                      </div>
                    </div>
                  </div>
                </TiltCard>
              ))}
            </div>

            {filteredItems.length === 0 && (
              <div className="text-center py-16">
                <h3 className="text-xl font-serif text-gray-900 mb-4">No items found</h3>
                <p className="text-gray-600">Try adjusting your filters or search term.</p>
                </div>
            )}
          </>
          )}
      </div>

      {/* Stats Modal */}
      <WishlistStats 
        isOpen={showStats} 
        onClose={() => setShowStats(false)} 
        items={wishlistItems} 
      />

      {/* Share Modal */}
      <WishlistShare 
        isOpen={showShare} 
        onClose={() => setShowShare(false)} 
        items={wishlistItems} 
      />
    </div>
  );
};

export default Wishlist; 