import { useState, useEffect } from 'react';
import { XMarkIcon } from '@heroicons/react/24/outline';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';

const floatingElements = [
  { size: 24, delay: 0, rotate: 5, duration: 15 },
  { size: 20, delay: 1, rotate: -5, duration: 18 },
  { size: 16, delay: 2, rotate: 10, duration: 20 },
  { size: 14, delay: 0.5, rotate: -8, duration: 22 },
  { size: 10, delay: 1.5, rotate: 12, duration: 25 },
];

const AuthPopup = ({ isOpen, onClose, onSuccess }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    fullName: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const { user } = useAuth();

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      // Reset form state when opening
      setError('');
      setSuccess('');
      setFormData({ email: '', password: '', fullName: '' });
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  // Close popup if user gets authenticated
  useEffect(() => {
    if (user && isOpen) {
      setSuccess('Login successful!');
      setTimeout(() => {
        onClose();
        if (onSuccess) onSuccess();
      }, 1000);
    }
  }, [user, isOpen, onClose, onSuccess]);

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      if (isLogin) {
        const { error } = await supabase.auth.signInWithPassword({
          email: formData.email,
          password: formData.password
        });
        if (error) throw error;
        
        setSuccess('Login successful!');
      } else {
        const { error } = await supabase.auth.signUp({
          email: formData.email,
          password: formData.password,
          options: {
            data: {
              full_name: formData.fullName
            }
          }
        });
        if (error) throw error;
        
        setSuccess('Account created! Please check your email for verification.');
        setTimeout(() => {
          setIsLogin(true);
          setFormData({ email: formData.email, password: '', fullName: '' });
          setSuccess('');
        }, 2000);
      }
    } catch (err) {
      console.error('Authentication error:', err);
      setError(err.message || 'An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const toggleAuthMode = () => {
    setError('');
    setSuccess('');
      setIsLogin(!isLogin);
    setFormData({ email: '', password: '', fullName: '' });
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
            onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          className="relative bg-white rounded-2xl shadow-2xl max-w-xs sm:max-w-sm md:max-w-md w-full max-h-[90vh] overflow-auto mx-4"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Floating background elements */}
          <div className="absolute inset-0 overflow-hidden rounded-2xl">
            {floatingElements.map((element, index) => (
              <motion.div
                key={index}
                className="absolute w-4 h-4 bg-gradient-to-r from-pink to-amber-500 rounded-full opacity-10"
                style={{
                  width: element.size,
                  height: element.size,
                  top: `${Math.random() * 100}%`,
                  left: `${Math.random() * 100}%`,
                }}
                animate={{
                  y: [-20, 20, -20],
                  x: [-10, 10, -10],
                  rotate: [0, element.rotate, 0],
                }}
                transition={{
                  duration: element.duration,
                  repeat: Infinity,
                  delay: element.delay,
                }}
              />
            ))}
          </div>

            {/* Close button */}
          <button
              onClick={onClose}
            className="absolute top-4 right-4 z-10 p-2 text-gray-500 hover:text-gray-700 transition-colors"
            >
            <XMarkIcon className="w-6 h-6" />
          </button>

          <div className="p-4 sm:p-6 md:p-8 relative z-10">
                  <motion.div 
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.1 }}
              className="text-center mb-8"
            >
              <h2 className="text-2xl sm:text-3xl font-serif text-gray-900 mb-2">
                {isLogin ? 'Welcome Back' : 'Join Us'}
              </h2>
              <p className="text-sm sm:text-base text-gray-600">
                {isLogin ? 'Sign in to your account' : 'Create your account to continue'}
              </p>
                  </motion.div>
                  
            {/* Success/Error Messages */}
            <AnimatePresence>
              {error && (
                    <motion.div 
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm"
                    >
                  {error}
                    </motion.div>
              )}
              {success && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="mb-4 p-3 bg-green-50 border border-green-200 text-green-700 rounded-lg text-sm"
                    >
                  {success}
                    </motion.div>
              )}
            </AnimatePresence>

                    <form onSubmit={handleSubmit} className="space-y-6">
                      {!isLogin && (
                        <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.3 }}
                        >
                  <label htmlFor="fullName" className="block text-sm font-medium text-gray-700 mb-2">
                            Full Name
                          </label>
                            <input
                              type="text"
                    id="fullName"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink/20 focus:border-pink transition-colors"
                    placeholder="Enter your full name"
                    required={!isLogin}
                  />
                        </motion.div>
                      )}

              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                          Email Address
                        </label>
                          <input
                  type="email"
                            id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink/20 focus:border-pink transition-colors"
                  placeholder="Enter your email"
                            required
                          />
                        </div>

              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                          Password
                        </label>
                <div className="relative">
                          <input
                    type={showPassword ? 'text' : 'password'}
                            id="password"
                    name="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink/20 focus:border-pink transition-colors pr-12"
                    placeholder="Enter your password"
                            required
                          />
                          <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                          >
                    {showPassword ? (
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21" />
                      </svg>
                    ) : (
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                              </svg>
                    )}
                          </button>
                </div>
                        </div>

                      <motion.button
                        type="submit"
                disabled={loading}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full py-3 bg-gradient-to-r from-pink to-pink/80 text-white font-medium rounded-lg hover:from-pink/90 hover:to-pink/70 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                {loading ? 'Please wait...' : (isLogin ? 'Sign In' : 'Create Account')}
                      </motion.button>
                    </form>

            <div className="mt-6 text-center">
              <button
                          type="button"
                          onClick={toggleAuthMode}
                className="text-pink hover:text-pink/80 font-medium transition-colors"
                        >
                {isLogin ? "Don't have an account? Sign up" : "Already have an account? Sign in"}
              </button>
            </div>
          </div>
        </motion.div>
          </motion.div>
    </AnimatePresence>
  );
};

export default AuthPopup; 