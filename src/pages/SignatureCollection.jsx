import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Heart, ShoppingCart, Zap } from 'lucide-react';
import { useWishlist } from '../contexts/WishlistContext';
import { useCart } from '../contexts/CartContext';
import { useToast } from '../hooks/use-toast';
import { supabaseService } from '../services/supabaseService';

const SignatureCollection = () => {
  const [masterProducts, setMasterProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const { addToWishlist, isInWishlist } = useWishlist();
  const { addToCart } = useCart();
  const { toast } = useToast();

  // Helper function to truncate text
  const truncateText = (text, maxWords) => {
    if (!text) return '';
    const words = text.split(' ');
    if (words.length <= maxWords) return text;
    return words.slice(0, maxWords).join(' ') + '...';
  };

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

  const handleAddToWishlist = async (product) => {
    try {
      const success = await addToWishlist(product);
      if (success) {
        toast({
          title: "Added to Wishlist",
          description: `${product.name} has been added to your wishlist.`
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to add item to wishlist.",
        variant: "destructive"
      });
    }
  };

  const handleAddToCart = async (product) => {
    try {
      const success = await addToCart(product, 1);
      if (success) {
        toast({
          title: "Added to Cart",
          description: `${product.name} has been added to your cart.`
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to add item to cart.",
        variant: "destructive"
      });
    }
  };

  const handleQuickBuy = async (product) => {
    await handleAddToCart(product);
    window.location.href = '/cart';
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-rose-50 via-white to-pink-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-rose-200 border-t-rose-600 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading signature collection...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-50 via-white to-pink-50">
      <div className="container mx-auto px-4 py-20">
        <motion.div 
          className="text-center mb-16"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <h1 className="text-4xl md:text-5xl font-serif text-gray-900 mb-4">
            Signature Collection
          </h1>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            Discover our exclusive masterpieces, where traditional craftsmanship meets contemporary elegance
          </p>
        </motion.div>

        {masterProducts.length === 0 ? (
          <div className="text-center py-20">
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No Products Available</h3>
            <p className="text-gray-600">Check back soon for our latest signature pieces.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {masterProducts.map((product, index) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1, duration: 0.6 }}
                className="bg-white rounded-lg shadow-lg overflow-hidden group hover:shadow-xl transition-all duration-300"
              >
                <div className="relative aspect-[3/4] overflow-hidden">
                  <img 
                    src={product.image_urls?.[0] || ''} 
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  {product.tag && (
                    <div className="absolute top-4 left-4 bg-[#6f0e06] text-white px-3 py-1 rounded-full text-xs font-medium">
                      {product.tag}
                    </div>
                  )}
                  <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-300 flex items-center justify-center gap-2">
                    <motion.button
                      onClick={() => handleAddToCart(product)}
                      className="bg-white text-[#6f0e06] p-3 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-all duration-300 hover:bg-[#6f0e06] hover:text-white"
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                    >
                      <ShoppingCart className="w-5 h-5" />
                    </motion.button>
                    <motion.button
                      onClick={() => handleQuickBuy(product)}
                      className="bg-white text-[#6f0e06] p-3 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-all duration-300 hover:bg-[#6f0e06] hover:text-white"
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                    >
                      <Zap className="w-5 h-5" />
                    </motion.button>
                    <motion.button
                      onClick={() => handleAddToWishlist(product)}
                      className={`p-3 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-all duration-300 ${
                        isInWishlist(product.id) 
                          ? 'bg-[#6f0e06] text-white' 
                          : 'bg-white text-[#6f0e06] hover:bg-[#6f0e06] hover:text-white'
                      }`}
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                    >
                      <Heart className={`w-5 h-5 ${isInWishlist(product.id) ? 'fill-current' : ''}`} />
                    </motion.button>
                  </div>
                </div>
                
                <div className="p-6">
                  <h3 className="text-xl font-serif text-gray-900 mb-2">{product.name}</h3>
                  <p className="text-gray-600 text-sm mb-3 line-clamp-2 break-words leading-relaxed">{truncateText(product.description, 15)}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-2xl font-bold text-[#6f0e06]">₹{product.price}</span>
                    {product.colors?.length > 0 && (
                      <span className="text-sm text-gray-500">{product.colors.length} colors</span>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default SignatureCollection;