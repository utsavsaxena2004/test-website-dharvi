import { useState, useEffect } from 'react';
import {
  Bars3Icon,
  XMarkIcon,
  ShoppingBagIcon,
  HeartIcon,
  UserIcon,
  MagnifyingGlassIcon,
  ArrowRightOnRectangleIcon,
  CogIcon,
  ChevronDownIcon,
} from '@heroicons/react/24/outline';
import { Link, useNavigate } from 'react-router-dom';
import logo from '../assets/logo.png';
import mainLogo from '../assets/mainLogo.png';
import logoBg from '../assets/logoBG.png';
import { useAuth } from '@/contexts/AuthContext';
import { useCart } from '@/contexts/CartContext';
import { useWishlist } from '@/contexts/WishlistContext';
import { supabaseService } from '../services/supabaseService';
import { useSiteSettings } from '../hooks/useSiteSettings';

const DynamicNavbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openDropdown, setOpenDropdown] = useState(null); // Track open dropdown
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showUserDropdown, setShowUserDropdown] = useState(false);
  const [dropdownTimeout, setDropdownTimeout] = useState(null);
  const { user, profile, logout } = useAuth();
  const { cartSummary } = useCart();
  const { wishlistSummary } = useWishlist();
  const { siteSettings } = useSiteSettings();
  const navigate = useNavigate();

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

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (isSearchOpen && !event.target.closest('.search-container')) {
        setIsSearchOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isSearchOpen]);

  const staticNavigation = [
    { name: 'About Us', href: '/about' },
    { name: 'Contact Us', href: '/contact' },
  ];

  const toggleMobileMenu = () => setIsOpen((prev) => !prev);

  const handleDropdownToggle = (index) => {
    setOpenDropdown((prev) => (prev === index ? null : index));
  };

  const handleSearchToggle = () => {
    setIsSearchOpen((prev) => !prev);
    if (!isSearchOpen) {
      // Focus on search input when opened
      setTimeout(() => {
        const searchInput = document.getElementById('search-input');
        if (searchInput) searchInput.focus();
      }, 100);
    }
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      // Navigate to search results page
      navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
      setIsSearchOpen(false);
      setSearchQuery('');
      setIsOpen(false); // Close mobile menu if open
    }
  };

  const handleSearchInputChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleUserDropdownEnter = () => {
    if (dropdownTimeout) {
      clearTimeout(dropdownTimeout);
      setDropdownTimeout(null);
    }
    setShowUserDropdown(true);
  };

  const handleUserDropdownLeave = () => {
    const timeout = setTimeout(() => {
      setShowUserDropdown(false);
    }, 200);
    setDropdownTimeout(timeout);
  };

  const toggleUserDropdown = () => {
    setShowUserDropdown(!showUserDropdown);
  };

  return (
    <header className="bg-gradient-to-r from-amber-50 via-white to-amber-50 text-gray-800 shadow-lg top-0 z-50">
      {/* Top Bar */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
        {/* Left - Search */}
        <div className="w-1/3 md:flex items-center hidden">
          <div className="relative search-container">
            {!isSearchOpen ? (
              <div className="relative group">
                <MagnifyingGlassIcon
                  className="h-6 w-6 cursor-pointer text-gray-600 group-hover:text-amber-600 transition duration-300 ease-in-out"
                  title="Search"
                  aria-label="Search"
                  onClick={handleSearchToggle}
                />
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-amber-600 group-hover:w-full transition-all duration-300"></span>
              </div>
            ) : (
              <form onSubmit={handleSearchSubmit} className="flex items-center">
                <div className="relative">
                  <input
                    id="search-input"
                    type="text"
                    value={searchQuery}
                    onChange={handleSearchInputChange}
                    placeholder="Search products..."
                    className="w-64 px-4 py-2 pl-10 pr-4 text-sm border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all duration-300"
                  />
                  <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                </div>
                <button
                  type="button"
                  onClick={handleSearchToggle}
                  className="ml-2 p-1 text-gray-400 hover:text-gray-600 transition duration-300"
                  title="Close search"
                >
                  <XMarkIcon className="h-5 w-5" />
                </button>
              </form>
            )}
          </div>
        </div>

        {/* Center - Logo */}
        <div className=" flex justify-center relative">
          <Link to="/" aria-label="Home" className="relative">
            <div className="absolute inset-0 flex items-center justify-center">
              <img
                src={logoBg}
                alt="Logo Background"
                className="h-96 w-96 object-contain "
                style={{ animation: 'spin 15s linear infinite' }}
              />
            </div>
            <img
              src={siteSettings?.site_logo || mainLogo}
              alt={`${siteSettings?.site_name || 'Dharika'} Logo`}
              className="md:h-28 h-16 scale-95 transition-transform duration-300 hover:scale-90 relative z-10"
            />
          </Link>
        </div>
        {/* Right - Icons */}
        <div className="w-1/3 flex justify-end items-center gap-6">
          {user ? (
            <div className="flex items-center gap-4">
              <div 
                className="relative"
                onMouseEnter={handleUserDropdownEnter}
                onMouseLeave={handleUserDropdownLeave}
              >
                <div
                  className="flex items-center gap-1 cursor-pointer group"
                  onClick={toggleUserDropdown}
                >
                  <span className="text-sm font-medium text-gray-700 hidden lg:block truncate max-w-[150px] group-hover:text-amber-600 transition duration-300">
                    {profile?.full_name || user.email}
                  </span>
                  <ChevronDownIcon className={`h-4 w-4 text-gray-600 group-hover:text-amber-600 transition-all duration-300 ${showUserDropdown ? 'rotate-180' : ''}`} />
                </div>
                
                {/* User Dropdown */}
                {showUserDropdown && (
                  <div 
                    className="absolute top-full right-0 mt-1 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50"
                    onMouseEnter={handleUserDropdownEnter}
                    onMouseLeave={handleUserDropdownLeave}
                  >
                    <Link
                      to="/orders"
                      className="flex items-center px-4 py-3 text-sm text-gray-700 hover:bg-gray-100 transition duration-200"
                      onClick={() => setShowUserDropdown(false)}
                    >
                      📦 My Orders
                    </Link>
                    <div className="border-t border-gray-100 mx-2"></div>
                    <button
                      onClick={() => {
                        setShowUserDropdown(false);
                        logout();
                      }}
                      className="flex items-center w-full text-left px-4 py-3 text-sm text-gray-700 hover:bg-gray-100 transition duration-200"
                    >
                      🚪 Logout
                    </button>
                  </div>
                )}
              </div>
              <button
                className="relative group lg:hidden"
                onClick={logout}
                title="Logout"
                aria-label="Logout"
              >
                <ArrowRightOnRectangleIcon
                  className="h-6 w-6 text-gray-600 group-hover:text-amber-600 transition duration-300"
                />
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-amber-600 group-hover:w-full transition-all duration-300"></span>
              </button>
            </div>
          ) : (
            <Link to="/auth" title="Login / Register" aria-label="Login" className="relative group">
              <UserIcon className="h-6 w-6 text-gray-600 group-hover:text-amber-600 transition duration-300" />
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-amber-600 group-hover:w-full transition-all duration-300"></span>
            </Link>
          )}

          {/* Wishlist Icon */}
          <Link to="/wishlist" className="relative group" title="Wishlist" aria-label="Wishlist">
            <HeartIcon className="h-6 w-6 text-gray-600 group-hover:text-amber-600 transition duration-300" />
            {wishlistSummary.itemCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-amber-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-semibold shadow-sm">
                {wishlistSummary.itemCount > 99 ? '99+' : wishlistSummary.itemCount}
              </span>
            )}
            <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-amber-600 group-hover:w-full transition-all duration-300"></span>
          </Link>

          {/* Cart Icon */}
          <Link to="/cart" className="relative group" title="Cart" aria-label="Cart">
            <ShoppingBagIcon className="h-6 w-6 text-gray-600 group-hover:text-amber-600 transition duration-300" />
            {cartSummary.itemCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-amber-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-semibold shadow-sm">
                {cartSummary.itemCount > 99 ? '99+' : cartSummary.itemCount}
              </span>
            )}
            <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-amber-600 group-hover:w-full transition-all duration-300"></span>
          </Link>

          {/* Admin Icon */}
          {user?.email === 'saiyamkumar2007@gmail.com' && (
            <Link to="/admin" title="Admin Panel" aria-label="Admin" className="relative group">
              <CogIcon className="h-6 w-6 text-gray-600 group-hover:text-amber-600 transition duration-300" />
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-amber-600 group-hover:w-full transition-all duration-300"></span>
            </Link>
          )}
        </div>
      </div>

      
    </header>
  );
};

export default DynamicNavbar;