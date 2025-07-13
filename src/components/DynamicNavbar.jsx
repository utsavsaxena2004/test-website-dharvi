import { useState, useEffect } from 'react';
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline';
import { ShoppingBagIcon, HeartIcon, UserIcon, MagnifyingGlassIcon, ArrowRightOnRectangleIcon, CogIcon } from '@heroicons/react/24/outline';
import logo from '../assets/logo.svg';
import { Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { supabaseService } from '../services/supabaseService';

const DynamicNavbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user, profile, logout } = useAuth();

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
            <Link to="/wishlist">
              <HeartIcon className="h-5 w-5 cursor-pointer hover:text-pink transition-colors duration-300" />
            </Link>
            <Link to="/cart">
              <ShoppingBagIcon className="h-5 w-5 cursor-pointer hover:text-pink transition-colors duration-300" />
            </Link>
            {user && user.email === 'saiyamkumar2007@gmail.com' && (
              <Link to="/admin">
                <CogIcon className="h-5 w-5 cursor-pointer hover:text-pink transition-colors duration-300" title="Admin Panel" />
              </Link>
            )}
          </div>
        </div>
      </div>
      
      {/* Main navigation */}
      <div className="border-t border-gray-200">
        <div className="container mx-auto">
          {/* Desktop Navigation */}
          <div className="hidden md:block">
            <ul className="flex justify-center space-x-8">
              {/* Dynamic Category Navigation */}
              {loading ? (
                // Loading skeleton
                Array.from({ length: 4 }).map((_, index) => (
                  <li key={index} className="py-3">
                    <div className="h-4 bg-gray-200 rounded w-16 animate-pulse"></div>
                  </li>
                ))
              ) : (
                categories.map((category) => (
                  <li key={category.id} className="relative group">
                    <Link
                      to={`/category/${category.slug}`}
                      className="inline-block py-3 text-sm text-black hover:text-pink transition-colors duration-300 whitespace-nowrap"
                    >
                      {category.name}
                    </Link>
                  </li>
                ))
              )}
              
              {/* Static Navigation Items */}
              {staticNavigation.map((item) => (
                <li key={item.name} className="relative group">
                  <Link
                    to={item.href}
                    className="inline-block py-3 text-sm text-black hover:text-pink transition-colors duration-300 whitespace-nowrap"
                  >
                    <span className="flex items-center">
                      {item.name}
                      {item.hasSubmenu && (
                        <svg className="ml-1 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                      )}
                    </span>
                  </Link>
                </li>
              ))}
              
              {/* Wishlist Link */}
              <li className="group relative px-3 py-2">
                <Link to="/wishlist" className="text-gray-800 hover:text-[#ba1a5d] transition-colors duration-300 flex items-center">
                  <span>Wishlist</span>
                  <svg className="w-4 h-4 ml-1 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"></path>
                  </svg>
                </Link>
              </li>
            </ul>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex justify-between items-center py-3">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-black hover:text-pink focus:outline-none"
            >
              {isOpen ? (
                <XMarkIcon className="block h-6 w-6" />
              ) : (
                <Bars3Icon className="block h-6 w-6" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="md:hidden bg-white shadow-lg">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
              {/* Dynamic Category Navigation - Mobile */}
              {loading ? (
                // Loading skeleton for mobile
                Array.from({ length: 4 }).map((_, index) => (
                  <div key={index} className="px-3 py-2">
                    <div className="h-4 bg-gray-200 rounded w-20 animate-pulse"></div>
                  </div>
                ))
              ) : (
                categories.map((category) => (
                  <Link
                    key={category.id}
                    to={`/category/${category.slug}`}
                    className="text-black hover:text-pink block px-3 py-2 rounded-md text-base font-medium"
                    onClick={() => setIsOpen(false)}
                  >
                    {category.name}
                  </Link>
                ))
              )}
              
              {/* Static Navigation Items - Mobile */}
              {staticNavigation.map((item) => (
                <Link
                  key={item.name}
                  to={item.href}
                  className="text-black hover:text-pink block px-3 py-2 rounded-md text-base font-medium"
                  onClick={() => setIsOpen(false)}
                >
                  {item.name}
                </Link>
              ))}
              
              {/* Wishlist Link - Mobile */}
              <Link
                to="/wishlist"
                className="text-black hover:text-pink block px-3 py-2 rounded-md text-base font-medium"
                onClick={() => setIsOpen(false)}
              >
                Wishlist
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DynamicNavbar; 