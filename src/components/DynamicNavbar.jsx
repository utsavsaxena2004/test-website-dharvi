import { useState, useEffect } from 'react';
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline';
import { ShoppingBagIcon, HeartIcon, UserIcon, MagnifyingGlassIcon, ArrowRightOnRectangleIcon, CogIcon } from '@heroicons/react/24/outline';
import logo from '../assets/logo.svg';
import { Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useCart } from '@/contexts/CartContext';
import { useWishlist } from '@/contexts/WishlistContext';
import { supabaseService } from '../services/supabaseService';

const DynamicNavbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user, profile, logout } = useAuth();
  const { cartSummary } = useCart();
  const { wishlistSummary } = useWishlist();

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoading(true);
        const data = await supabaseService.getCategories();
        setCategories(data);
      } catch (error) {
        console.error('Error fetching categories:', error);
        setCategories([]);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  // Static navigation items (non-category items)
  const staticNavigation = [
    { name: 'About Us', href: '/about', hasSubmenu: false },
    { name: 'Contact Us', href: '/contact', hasSubmenu: false },
  ];

  return (
    <div className="bg-white text-black">
      {/* Top bar with logo and icons */}
      <div className="container mx-auto px-4 py-2">
        <div className="flex justify-between items-center">
          {/* Left - Search Icon */}
          <div className="w-1/3 flex justify-start">
            <MagnifyingGlassIcon className="h-5 w-5 cursor-pointer hover:text-pink transition-colors duration-300" />
          </div>
          
          {/* Center - Logo */}
          <div className="w-1/3 flex justify-center">
            <Link to="/" className="flex items-center">
              <img src={logo} alt="Dharika Logo" className="h-24 w-auto object-contain max-h-full scale-150" />
            </Link>
          </div>
          
          {/* Right - User Icons */}
          <div className="w-1/3 flex justify-end gap-6 items-center">
            {user ? (
              <div className="flex items-center gap-4">
                <span className="text-sm text-gray-600 hidden md:block">
                  {profile?.full_name || user.email}
                </span>
                <ArrowRightOnRectangleIcon 
                  className="h-5 w-5 cursor-pointer hover:text-pink transition-colors duration-300" 
                  onClick={logout}
                  title="Logout"
                />
              </div>
            ) : (
              <Link to="/auth">
                <UserIcon className="h-5 w-5 cursor-pointer hover:text-pink transition-colors duration-300" />
              </Link>
            )}
            <Link to="/wishlist" className="relative">
              <HeartIcon className="h-5 w-5 cursor-pointer hover:text-pink transition-colors duration-300" />
              {wishlistSummary.itemCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-pink-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-medium">
                  {wishlistSummary.itemCount > 99 ? '99+' : wishlistSummary.itemCount}
                </span>
              )}
            </Link>
            <Link to="/cart" className="relative">
              <ShoppingBagIcon className="h-5 w-5 cursor-pointer hover:text-pink transition-colors duration-300" />
              {cartSummary.itemCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-[#ba1a5d] text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-medium">
                  {cartSummary.itemCount > 99 ? '99+' : cartSummary.itemCount}
                </span>
              )}
            </Link>
            {user && user.email === 'saiyamkumar2007@gmail.com' && (
              <Link to="/admin">
                <CogIcon className="h-5 w-5 cursor-pointer hover:text-pink transition-colors duration-300" title="Admin Panel" />
              </Link>
            )}
          </div>
        </div>
      </div>

      {/* Navigation bar */}
      <nav className="bg-white shadow-sm border-t border-gray-200">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center h-16">
            {/* Desktop Menu */}
            <div className="hidden md:flex items-center space-x-8">
              {/* Dynamic category navigation */}
              {categories.map((category) => (
                <Link
                  key={category.id}
                  to={`/category/${category.slug}`}
                  className="text-gray-700 hover:text-pink transition-colors duration-300 font-medium"
                >
                  {category.name}
                </Link>
              ))}
              
              {/* Static navigation items */}
              {staticNavigation.map((item) => (
                <Link
                  key={item.name}
                  to={item.href}
                  className="text-gray-700 hover:text-pink transition-colors duration-300 font-medium"
                >
                  {item.name}
                </Link>
              ))}
            </div>

            {/* Mobile menu button */}
            <div className="md:hidden">
              <button
                onClick={() => setIsOpen(!isOpen)}
                className="text-gray-700 hover:text-pink transition-colors duration-300"
              >
                {isOpen ? (
                  <XMarkIcon className="h-6 w-6" />
                ) : (
                  <Bars3Icon className="h-6 w-6" />
                )}
              </button>
            </div>
          </div>

          {/* Mobile Menu */}
          {isOpen && (
            <div className="md:hidden">
              <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
                {/* Dynamic category navigation */}
                {categories.map((category) => (
                  <Link
                    key={category.id}
                    to={`/category/${category.slug}`}
                    className="block px-3 py-2 text-gray-700 hover:text-pink transition-colors duration-300 font-medium"
                    onClick={() => setIsOpen(false)}
                  >
                    {category.name}
                  </Link>
                ))}
                
                {/* Static navigation items */}
                {staticNavigation.map((item) => (
                  <Link
                    key={item.name}
                    to={item.href}
                    className="block px-3 py-2 text-gray-700 hover:text-pink transition-colors duration-300 font-medium"
                    onClick={() => setIsOpen(false)}
                  >
                    {item.name}
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      </nav>
    </div>
  );
};

export default DynamicNavbar; 