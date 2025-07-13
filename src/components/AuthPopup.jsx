import { useState, useEffect } from 'react';
import { XMarkIcon } from '@heroicons/react/24/outline';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../contexts/AuthContext';

const floatingElements = [
  { size: 24, delay: 0, rotate: 5, duration: 15 },
  { size: 20, delay: 1, rotate: -5, duration: 18 },
  { size: 16, delay: 2, rotate: 10, duration: 20 },
  { size: 14, delay: 0.5, rotate: -8, duration: 22 },
  { size: 10, delay: 1.5, rotate: 12, duration: 25 },
];

const AuthPopup = ({ isOpen, onClose }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [animationComplete, setAnimationComplete] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const { login, register } = useAuth();

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      // Reset form state when opening
      setError('');
      setSuccess('');
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      if (isLogin) {
        await login({ email, password });
        setSuccess('Login successful! Welcome back!');
        setTimeout(() => {
          onClose();
          // Reset form
          setEmail('');
          setPassword('');
          setName('');
          setSuccess('');
        }, 1500);
      } else {
        await register({ 
          name, 
          email, 
          password 
        });
        setSuccess('Account created successfully! Please check your email for verification.');
        setTimeout(() => {
          setIsLogin(true); // Switch to login mode
          setName('');
          setPassword('');
          setSuccess('');
        }, 2000);
      }
    } catch (err) {
      console.error('Authentication error:', err);
      setError(err.message || err.error || 'An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const toggleAuthMode = () => {
    setAnimationComplete(false);
    setError('');
    setSuccess('');
    setTimeout(() => {
      setIsLogin(!isLogin);
    }, 300);
  };

  // Form field animations - FIXED EASING FUNCTION
  const formFieldVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: (i) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: i * 0.1,
        duration: 0.5,
        ease: "easeOut" // Fixed: replaced cubic-bezier with a valid easing function
      },
    }),
  };

  // Input focus effect
  const [focusedInput, setFocusedInput] = useState(null);

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center overflow-hidden">
          {/* Backdrop with blur effect */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            onClick={onClose}
          />

          {/* Decorative floating elements behind the modal */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            {floatingElements.map((elem, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0 }}
                animate={{ 
                  opacity: [0, 0.7, 0],
                  y: [0, Math.random() * -100 - 50],
                  x: [0, Math.random() * 100 - 50],
                  rotate: [0, elem.rotate]
                }}
                transition={{ 
                  repeat: Infinity, 
                  repeatType: 'mirror',
                  duration: elem.duration, 
                  delay: elem.delay,
                  ease: "easeInOut" // Fixed easing
                }}
                className="absolute"
                style={{
                  width: elem.size,
                  height: elem.size,
                  borderRadius: '50%',
                  background: i % 2 === 0 ? 'rgba(230, 195, 146, 0.3)' : 'rgba(186, 26, 93, 0.3)',
                  top: `${Math.random() * 100}%`,
                  left: `${Math.random() * 100}%`,
                  filter: 'blur(8px)'
                }}
              />
            ))}
          </div>

          {/* Auth modal */}
          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            transition={{ 
              type: "spring", 
              stiffness: 300, 
              damping: 30
            }}
            className="relative bg-white w-full max-w-4xl mx-4 rounded-2xl overflow-hidden shadow-[0_20px_50px_-15px_rgba(0,0,0,0.3)] border border-gray-100"
          >
            {/* Decorative corner accents */}
            <div className="absolute top-0 left-0 w-16 h-16 overflow-hidden">
              <div className="absolute top-0 left-0 w-24 h-24 bg-gradient-to-br from-gold/30 to-pink/30 -translate-x-12 -translate-y-12 rotate-45"></div>
            </div>
            <div className="absolute bottom-0 right-0 w-16 h-16 overflow-hidden">
              <div className="absolute bottom-0 right-0 w-24 h-24 bg-gradient-to-tl from-gold/30 to-pink/30 translate-x-12 translate-y-12 rotate-45"></div>
            </div>
            
            {/* Additional corner accents */}
            <div className="absolute top-0 right-0 w-1/2 h-1 bg-gradient-to-r from-transparent to-pink/30"></div>
            <div className="absolute bottom-0 left-0 w-1/2 h-1 bg-gradient-to-r from-gold/30 to-transparent"></div>

            {/* Close button */}
            <motion.button
              whileHover={{ scale: 1.1, rotate: 90 }}
              onClick={onClose}
              className="absolute top-4 right-4 text-gray-400 hover:text-pink transition-colors z-10 bg-white/80 backdrop-blur-sm rounded-full p-1 shadow-md"
            >
              <XMarkIcon className="h-6 w-6" />
            </motion.button>

            <div className="flex flex-col md:flex-row h-full">
              {/* Left side - Illustration */}
              <div className="w-full md:w-5/12 bg-gradient-to-br from-gold/90 to-pink/90 p-8 py-12 relative overflow-hidden">
                {/* Decorative elements and patterns */}
                <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
                  {/* Decorative circles */}
                  <motion.div 
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 0.15, scale: 1 }}
                    transition={{ duration: 1.5 }}
                    className="absolute top-0 right-0 w-64 h-64 bg-white rounded-full -translate-y-1/2 translate-x-1/3"
                  />
                  <motion.div 
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 0.1, scale: 1 }}
                    transition={{ duration: 1.5, delay: 0.2 }}
                    className="absolute bottom-0 left-0 w-48 h-48 bg-white rounded-full translate-y-1/4 -translate-x-1/4"
                  />
                  
                  {/* Paisley patterns */}
                  <motion.div 
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 0.15, y: 0 }}
                    transition={{ duration: 1, delay: 0.3 }}
                    className="absolute top-10 right-10"
                  >
                    <svg width="100" height="100" viewBox="0 0 100 100" fill="none">
                      <path d="M70,40 C85,30 85,10 70,10 C55,10 55,30 70,40 C85,50 85,70 70,70 C55,70 55,50 70,40 Z" 
                        stroke="white" strokeWidth="0.8" fill="none" />
                      <path d="M70,40 C60,35 50,40 50,50 C50,60 60,65 70,60" 
                        stroke="white" strokeWidth="0.8" fill="none" />
                    </svg>
                  </motion.div>
                  
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 0.15, y: 0 }}
                    transition={{ duration: 1, delay: 0.5 }}
                    className="absolute bottom-10 left-5"
                  >
                    <svg width="80" height="80" viewBox="0 0 80 80" fill="none">
                      <path d="M40,20 C50,15 50,5 40,5 C30,5 30,15 40,20 C50,25 50,35 40,35 C30,35 30,25 40,20 Z" 
                        stroke="white" strokeWidth="0.8" fill="none" />
                      <path d="M40,20 C35,18 30,20 30,25 C30,30 35,32 40,30" 
                        stroke="white" strokeWidth="0.8" fill="none" />
                    </svg>
                  </motion.div>
                  
                  {/* Diagonal pattern */}
                  <div className="absolute inset-0 opacity-10">
                    <div className="h-full w-full" style={{ 
                      backgroundImage: 'repeating-linear-gradient(45deg, transparent, transparent 10px, rgba(255, 255, 255, 0.1) 10px, rgba(255, 255, 255, 0.1) 20px)' 
                    }}></div>
                  </div>
                  
                  {/* Border decorations */}
                  <div className="absolute top-8 left-8 w-20 h-20 border border-white/20 rounded-lg"></div>
                  <div className="absolute bottom-8 right-8 w-16 h-16 border border-white/20 rounded-lg"></div>
                </div>
                
                <div className="h-full flex flex-col justify-center relative z-10">
                  <motion.div 
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ duration: 0.5 }}
                    className="text-white mb-8"
                  >
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: "40%" }}
                      transition={{ delay: 0.1, duration: 0.6 }}
                      className="h-0.5 bg-white/30 mb-6"
                    />
                    
                    <motion.h2 
                      initial={{ y: -20, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      transition={{ delay: 0.2, duration: 0.6 }}
                      className="font-serif text-3xl mb-2 font-medium flex items-center"
                    >
                      <span className="mr-2">{isLogin ? "Welcome Back" : "Join Dharika"}</span>
                      <motion.svg
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        initial={{ rotate: -30, opacity: 0 }}
                        animate={{ rotate: 0, opacity: 1 }}
                        transition={{ delay: 0.4, duration: 0.5 }}
                      >
                        <path d="M12,2C6.477,2 2,6.477 2,12C2,17.523 6.477,22 12,22C17.523,22 22,17.523 22,12C22,6.477 17.523,2 12,2M12,4C16.418,4 20,7.582 20,12C20,16.418 16.418,20 12,20C7.582,20 4,16.418 4,12C4,7.582 7.582,4 12,4M11,16.5L6.5,12L7.91,10.59L11,13.67L16.59,8.09L18,9.5L11,16.5Z" fill="currentColor" />
                      </motion.svg>
                    </motion.h2>
                    <motion.p
                      initial={{ y: -20, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      transition={{ delay: 0.4, duration: 0.6 }}
                      className="text-white/90 text-base"
                    >
                      {isLogin 
                        ? "Discover exclusive offers and track your orders with ease."
                        : "Create an account to enjoy a personalized shopping experience."
                      }
                    </motion.p>
                    
                    <motion.div
                      initial={{ y: -10, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      transition={{ delay: 0.6, duration: 0.5 }}
                      className="flex items-center mt-6 text-white/70 text-sm"
                    >
                      <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                      </svg>
                      <span>{isLogin ? "Access your wishlist" : "Save your favorite designs"}</span>
                    </motion.div>
                    
                    <motion.div
                      initial={{ y: -10, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      transition={{ delay: 0.7, duration: 0.5 }}
                      className="flex items-center mt-2 text-white/70 text-sm"
                    >
                      <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                      </svg>
                      <span>{isLogin ? "Track your orders" : "Exclusive member discounts"}</span>
                    </motion.div>
                    
                    <motion.div
                      initial={{ y: -10, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      transition={{ delay: 0.8, duration: 0.5 }}
                      className="flex items-center mt-2 text-white/70 text-sm"
                    >
                      <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                      </svg>
                      <span>{isLogin ? "Personalized recommendations" : "Priority notifications"}</span>
                    </motion.div>
                  </motion.div>

                  {/* Enhanced saree illustration */}
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.7, duration: 0.8 }}
                    className="relative mt-2 pt-8"
                  >
                    <motion.div 
                      className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-xs"
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.9, duration: 0.5 }}
                    >
                      <div className="text-sm text-white/80 text-center font-serif mb-3">Exclusive Designs</div>
                      <div className="h-0.5 w-16 bg-white/30 rounded mx-auto"></div>
                    </motion.div>
                    
                    <svg viewBox="0 0 100 80" className="w-full h-auto">
                      <defs>
                        <linearGradient id="goldGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                          <stop offset="0%" stopColor="rgba(255, 255, 255, 0.9)" />
                          <stop offset="100%" stopColor="rgba(230, 195, 146, 0.6)" />
                        </linearGradient>
                        <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
                          <feGaussianBlur stdDeviation="2" result="blur" />
                          <feComposite in="SourceGraphic" in2="blur" operator="over" />
                        </filter>
                        <pattern id="dotPattern" x="0" y="0" width="10" height="10" patternUnits="userSpaceOnUse">
                          <circle cx="2" cy="2" r="1" fill="white" opacity="0.3" />
                        </pattern>
                      </defs>
                      <g className="opacity-90">
                        {/* Background patterns */}
                        <rect x="0" y="30" width="100" height="50" fill="url(#dotPattern)" opacity="0.2" />
                      
                        {/* Background element */}
                        <motion.path
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 0.3 }}
                          transition={{ delay: 0.8, duration: 1 }}
                          d="M0,40 Q25,60 50,40 Q75,20 100,40 L100,80 L0,80 Z"
                          fill="rgba(255, 255, 255, 0.1)"
                        />
                        
                        {/* Rangoli-inspired pattern */}
                        <motion.path
                          initial={{ pathLength: 0, opacity: 0 }}
                          animate={{ pathLength: 1, opacity: 0.8 }}
                          transition={{ duration: 1.5, ease: "easeInOut", delay: 1 }}
                          d="M50,15 C55,15 60,20 60,25 C60,30 55,35 50,35 C45,35 40,30 40,25 C40,20 45,15 50,15 Z"
                          fill="none"
                          stroke="url(#goldGradient)"
                          strokeWidth="0.8"
                          filter="url(#glow)"
                        />
                        
                        <motion.path
                          initial={{ pathLength: 0, opacity: 0 }}
                          animate={{ pathLength: 1, opacity: 0.8 }}
                          transition={{ duration: 1.5, ease: "easeInOut", delay: 1.2 }}
                          d="M50,10 C58,10 65,17 65,25 C65,33 58,40 50,40 C42,40 35,33 35,25 C35,17 42,10 50,10 Z"
                          fill="none"
                          stroke="rgba(255, 255, 255, 0.5)"
                          strokeWidth="0.5"
                        />
                        
                        {/* Stylized fabric wave pattern */}
                        <motion.path
                          initial={{ pathLength: 0 }}
                          animate={{ pathLength: 1 }}
                          transition={{ duration: 2, ease: "easeInOut", delay: 1 }}
                          d="M10,50 Q25,30 40,50 Q55,70 70,50 Q85,30 100,50"
                          fill="none"
                          stroke="rgba(255, 255, 255, 0.8)"
                          strokeWidth="1.5"
                          filter="url(#glow)"
                        />
                        <motion.path
                          initial={{ pathLength: 0 }}
                          animate={{ pathLength: 1 }}
                          transition={{ duration: 2, ease: "easeInOut", delay: 1.2 }}
                          d="M10,55 Q25,35 40,55 Q55,75 70,55 Q85,35 100,55"
                          fill="none"
                          stroke="rgba(255, 255, 255, 0.6)"
                          strokeWidth="1.2"
                        />
                        <motion.path
                          initial={{ pathLength: 0 }}
                          animate={{ pathLength: 1 }}
                          transition={{ duration: 2, ease: "easeInOut", delay: 1.4 }}
                          d="M10,60 Q25,40 40,60 Q55,80 70,60 Q85,40 100,60"
                          fill="none"
                          stroke="rgba(255, 255, 255, 0.4)"
                          strokeWidth="1"
                        />
                        
                        {/* Textile-inspired patterns */}
                        <motion.g
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ delay: 1.8, duration: 0.7 }}
                        >
                          <path d="M20,25 L25,20 L30,25 L25,30 Z" 
                                fill="none" stroke="rgba(255, 255, 255, 0.6)" strokeWidth="0.5" />
                          <path d="M70,25 L75,20 L80,25 L75,30 Z" 
                                fill="none" stroke="rgba(255, 255, 255, 0.6)" strokeWidth="0.5" />
                        </motion.g>
                        
                        {/* Traditional Indian pattern elements */}
                        <motion.path
                          initial={{ scale: 0, opacity: 0 }}
                          animate={{ scale: 1, opacity: 1 }}
                          transition={{ delay: 2, duration: 0.7 }}
                          d="M30,20 C32,15 35,15 37,20 C39,15 42,15 44,20 C46,15 49,15 51,20 C49,25 46,28 44,25 C42,28 39,25 37,25 C35,28 32,25 30,20 Z"
                          fill="none"
                          stroke="rgba(255, 255, 255, 0.7)"
                          strokeWidth="0.7"
                        />

                        {/* Decorative elements */}
                        <motion.circle
                          initial={{ scale: 0, opacity: 0 }}
                          animate={{ scale: 1, opacity: 1 }}
                          transition={{ delay: 1.6, duration: 0.5 }}
                          cx="25" cy="40" r="3" fill="rgba(255, 255, 255, 0.9)"
                          filter="url(#glow)"
                        />
                        <motion.circle
                          initial={{ scale: 0, opacity: 0 }}
                          animate={{ scale: 1, opacity: 1 }}
                          transition={{ delay: 1.8, duration: 0.5 }}
                          cx="60" cy="45" r="2" fill="rgba(255, 255, 255, 0.9)"
                        />
                        <motion.circle
                          initial={{ scale: 0, opacity: 0 }}
                          animate={{ scale: 1, opacity: 1 }}
                          transition={{ delay: 2, duration: 0.5 }}
                          cx="85" cy="35" r="2.5" fill="rgba(255, 255, 255, 0.9)"
                          filter="url(#glow)"
                        />
                      </g>
                    </svg>
                    
                    {/* Traditional jewelry-inspired decoration at bottom */}
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 2.2, duration: 0.8 }}
                      className="absolute -bottom-2 left-1/2 -translate-x-1/2"
                    >
                      <svg width="120" height="20" viewBox="0 0 120 20" fill="none">
                        <motion.path
                          initial={{ pathLength: 0 }}
                          animate={{ pathLength: 1 }}
                          transition={{ duration: 1.5, delay: 2.3 }}
                          d="M0,10 H120" stroke="rgba(255,255,255,0.3)" strokeWidth="0.5" />
                        <motion.circle cx="60" cy="10" r="3" fill="rgba(255,255,255,0.8)" 
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          transition={{ duration: 0.5, delay: 2.4 }} 
                        />
                        <motion.circle cx="40" cy="10" r="2" fill="rgba(255,255,255,0.6)" 
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          transition={{ duration: 0.5, delay: 2.5 }} 
                        />
                        <motion.circle cx="80" cy="10" r="2" fill="rgba(255,255,255,0.6)" 
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          transition={{ duration: 0.5, delay: 2.5 }} 
                        />
                        <motion.circle cx="20" cy="10" r="1.5" fill="rgba(255,255,255,0.4)" 
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          transition={{ duration: 0.5, delay: 2.6 }} 
                        />
                        <motion.circle cx="100" cy="10" r="1.5" fill="rgba(255,255,255,0.4)" 
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          transition={{ duration: 0.5, delay: 2.6 }} 
                        />
                      </svg>
                    </motion.div>
                    
                    {/* Additional decorative elements */}
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 1.5, duration: 0.8 }}
                      className="absolute bottom-2 left-0 right-0 flex justify-center"
                    >
                      <div className="text-white/60 text-xs text-center font-serif italic">
                        {isLogin ? "Welcome to your fashion journey" : "Start your fashion journey with us"}
                      </div>
                    </motion.div>
                  </motion.div>
                </div>
              </div>

              {/* Right side - Form */}
              <div className="w-full md:w-7/12 p-8 py-14 md:p-12 bg-gradient-to-br from-white to-gray-50">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={isLogin ? 'login' : 'signup'}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.3 }}
                    onAnimationComplete={() => setAnimationComplete(true)}
                    className="max-w-md mx-auto"
                  >
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5 }}
                      className="flex items-center mb-2"
                    >
                      <div className="h-0.5 w-5 bg-gradient-to-r from-gold to-pink/70 mr-3"></div>
                      <span className="text-sm uppercase tracking-wider text-gray-500 font-medium">Account {isLogin ? "Login" : "Registration"}</span>
                    </motion.div>
                    
                    <h1 className="text-3xl font-serif font-medium text-gray-800 mb-8 relative">
                      {isLogin ? "Login to Your Account" : "Create Your Account"}
                      <motion.div 
                        initial={{ width: 0 }}
                        animate={{ width: '50%' }}
                        transition={{ delay: 0.5, duration: 0.5 }}
                        className="h-0.5 bg-gradient-to-r from-gold to-pink absolute -bottom-2 left-0"
                      />
                    </h1>

                    <form onSubmit={handleSubmit} className="space-y-6">
                      {!isLogin && (
                        <motion.div
                          custom={0}
                          initial="hidden"
                          animate="visible"
                          variants={formFieldVariants}
                          className={`relative ${focusedInput === 'name' ? 'z-10' : ''}`}
                        >
                          <label className="block text-sm font-medium text-gray-700 mb-2" htmlFor="name">
                            Full Name
                          </label>
                          <div className={`relative transition-all duration-300 ${focusedInput === 'name' ? 'scale-[1.02]' : ''}`}>
                            <div className="absolute left-4 top-0 h-full flex items-center text-gray-500 pointer-events-none">
                              <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zm-4 7a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                              </svg>
                            </div>
                            <div className="absolute right-0 top-0 h-full flex items-center pr-3">
                              {name && <div className="w-2 h-2 bg-green-500 rounded-full"></div>}
                            </div>
                            <input
                              id="name"
                              type="text"
                              value={name}
                              onChange={(e) => setName(e.target.value)}
                              onFocus={() => setFocusedInput('name')}
                              onBlur={() => setFocusedInput(null)}
                              className="w-full pl-12 pr-10 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gold/50 focus:border-gold transition-colors"
                              placeholder="Enter your name"
                              required
                            />
                            {focusedInput === 'name' && (
                              <motion.div 
                                layoutId="inputHighlight"
                                className="absolute inset-0 -z-10 rounded-lg bg-gradient-to-r from-gold/20 to-pink/20 blur-sm"
                              />
                            )}
                          </div>
                        </motion.div>
                      )}

                      <motion.div
                        custom={!isLogin ? 1 : 0}
                        initial="hidden"
                        animate="visible"
                        variants={formFieldVariants}
                        className={`relative ${focusedInput === 'email' ? 'z-10' : ''}`}
                      >
                        <label className="block text-sm font-medium text-gray-700 mb-2" htmlFor="email">
                          Email Address
                        </label>
                        <div className={`relative transition-all duration-300 ${focusedInput === 'email' ? 'scale-[1.02]' : ''}`}>
                          <div className="absolute left-4 top-0 h-full flex items-center text-gray-500 pointer-events-none">
                            <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                            </svg>
                          </div>
                          <div className="absolute right-0 top-0 h-full flex items-center pr-3">
                            {email && email.includes('@') && <div className="w-2 h-2 bg-green-500 rounded-full"></div>}
                          </div>
                          <input
                            id="email"
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            onFocus={() => setFocusedInput('email')}
                            onBlur={() => setFocusedInput(null)}
                            className="w-full pl-12 pr-10 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gold/50 focus:border-gold transition-colors"
                            placeholder="your@email.com"
                            required
                          />
                          {focusedInput === 'email' && (
                            <motion.div 
                              layoutId="inputHighlight"
                              className="absolute inset-0 -z-10 rounded-lg bg-gradient-to-r from-gold/20 to-pink/20 blur-sm"
                            />
                          )}
                        </div>
                      </motion.div>

                      <motion.div
                        custom={!isLogin ? 2 : 1}
                        initial="hidden"
                        animate="visible"
                        variants={formFieldVariants}
                        className={`relative ${focusedInput === 'password' ? 'z-10' : ''}`}
                      >
                        <label className="block text-sm font-medium text-gray-700 mb-2" htmlFor="password">
                          Password
                        </label>
                        <div className={`relative transition-all duration-300 ${focusedInput === 'password' ? 'scale-[1.02]' : ''}`}>
                          <div className="absolute left-4 top-0 h-full flex items-center text-gray-500 pointer-events-none">
                            <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                            </svg>
                          </div>
                          <input
                            id="password"
                            type={showPassword ? "text" : "password"}
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            onFocus={() => setFocusedInput('password')}
                            onBlur={() => setFocusedInput(null)}
                            className="w-full pl-12 pr-10 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gold/50 focus:border-gold transition-colors"
                            placeholder={isLogin ? "Enter your password" : "Create a password"}
                            required
                          />
                          <button
                            type="button"
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-pink transition-colors"
                            onClick={() => setShowPassword(!showPassword)}
                          >
                            {showPassword ? 
                              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7A9.97 9.97 0 014.02 8.971m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                              </svg> : 
                              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                              </svg>
                            }
                          </button>
                          {focusedInput === 'password' && (
                            <motion.div 
                              layoutId="inputHighlight"
                              className="absolute inset-0 -z-10 rounded-lg bg-gradient-to-r from-gold/20 to-pink/20 blur-sm"
                            />
                          )}
                        </div>
                      </motion.div>

                      {isLogin && (
                        <motion.div
                          custom={2}
                          initial="hidden"
                          animate="visible"
                          variants={formFieldVariants}
                          className="flex justify-end"
                        >
                          <button 
                            type="button" 
                            className="text-sm text-pink hover:text-pink/80 focus:outline-none transition-colors"
                          >
                            Forgot password?
                          </button>
                        </motion.div>
                      )}

                      <motion.button
                        custom={!isLogin ? 3 : 2}
                        initial="hidden"
                        animate="visible"
                        variants={formFieldVariants}
                        whileHover={{ scale: 1.03, boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)" }}
                        whileTap={{ scale: 0.97 }}
                        type="submit"
                        className="w-full py-3.5 px-4 bg-gradient-to-r from-gold to-pink text-white font-medium text-lg rounded-lg focus:outline-none transition-all duration-300 relative overflow-hidden shadow-md"
                      >
                        <span className="relative z-10">{isLogin ? "Login" : "Sign Up"}</span>
                        <motion.span 
                          className="absolute inset-0 bg-white opacity-0"
                          transition={{ duration: 0.3 }}
                          whileHover={{ opacity: 0.2 }}
                        />
                      </motion.button>
                    </form>

                    <div className="mt-10">
                      <div className="relative">
                        <div className="absolute inset-0 flex items-center">
                          <div className="w-full border-t border-gray-200"></div>
                        </div>
                        <div className="relative flex justify-center text-sm">
                          <span className="px-2 bg-gradient-to-br from-white to-gray-50 text-gray-500">or continue with</span>
                        </div>
                      </div>

                      <div className="mt-8 grid grid-cols-3 gap-3">
                        <motion.button
                          whileHover={{ y: -3, boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1)" }}
                          whileTap={{ y: 0, boxShadow: "0 0 0 0 rgba(0, 0, 0, 0)" }}
                          className="w-full flex justify-center py-3 px-4 border border-gray-300 rounded-lg shadow-sm bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 transition-all relative overflow-hidden group"
                        >
                          <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2ZM12 5C13.66 5 15 6.34 15 8C15 9.66 13.66 11 12 11C10.34 11 9 9.66 9 8C9 6.34 10.34 5 12 5ZM12 19.2C9.5 19.2 7.29 17.92 6 15.98C6.03 13.99 10 12.9 12 12.9C13.99 12.9 17.97 13.99 18 15.98C16.71 17.92 14.5 19.2 12 19.2Z"></path>
                          </svg>
                          <motion.span 
                            className="absolute inset-0 bg-gradient-to-br from-gold/20 to-pink/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                          />
                        </motion.button>
                        <motion.button
                          whileHover={{ y: -3, boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1)" }}
                          whileTap={{ y: 0, boxShadow: "0 0 0 0 rgba(0, 0, 0, 0)" }}
                          className="w-full flex justify-center py-3 px-4 border border-gray-300 rounded-lg shadow-sm bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 transition-all relative overflow-hidden group"
                        >
                          <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M12 2.04C6.5 2.04 2 6.53 2 12.06C2 17.06 5.66 21.21 10.44 21.96V14.96H7.9V12.06H10.44V9.85C10.44 7.34 11.93 5.96 14.22 5.96C15.31 5.96 16.45 6.15 16.45 6.15V8.62H15.19C13.95 8.62 13.56 9.39 13.56 10.18V12.06H16.34L15.89 14.96H13.56V21.96C15.9 21.59 18.04 20.42 19.6 18.72C21.16 17.03 22.02 14.86 22 12.59C22 6.53 17.5 2.04 12 2.04Z"></path>
                          </svg>
                          <motion.span 
                            className="absolute inset-0 bg-gradient-to-br from-gold/20 to-pink/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                          />
                        </motion.button>
                        <motion.button
                          whileHover={{ y: -3, boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1)" }}
                          whileTap={{ y: 0, boxShadow: "0 0 0 0 rgba(0, 0, 0, 0)" }}
                          className="w-full flex justify-center py-3 px-4 border border-gray-300 rounded-lg shadow-sm bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 transition-all relative overflow-hidden group"
                        >
                          <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M21.35,11.1H12.18V13.83H18.69C18.36,17.64 15.19,19.27 12.19,19.27C8.36,19.27 5,16.25 5,12C5,7.9 8.2,4.73 12.2,4.73C15.29,4.73 17.1,6.7 17.1,6.7L19,4.72C19,4.72 16.56,2 12.1,2C6.42,2 2.03,6.8 2.03,12C2.03,17.05 6.16,22 12.25,22C17.6,22 21.5,18.33 21.5,12.91C21.5,11.76 21.35,11.1 21.35,11.1V11.1Z"></path>
                          </svg>
                          <motion.span 
                            className="absolute inset-0 bg-gradient-to-br from-gold/20 to-pink/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                          />
                        </motion.button>
                      </div>
                    </div>

                    <motion.div
                      custom={!isLogin ? 4 : 3}
                      initial="hidden"
                      animate="visible"
                      variants={formFieldVariants}
                      className="mt-10 text-center"
                    >
                      <p className="text-sm text-gray-600">
                        {isLogin ? "Don't have an account?" : "Already have an account?"}
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          type="button"
                          onClick={toggleAuthMode}
                          className="ml-1 font-medium text-pink hover:text-pink/80 focus:outline-none transition-colors"
                        >
                          {isLogin ? "Sign up" : "Login"}
                        </motion.button>
                      </p>
                    </motion.div>
                  </motion.div>
                </AnimatePresence>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default AuthPopup; 