import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect, useRef } from 'react';
import { useSiteSettings } from '../hooks/useSiteSettings';
import { Link } from 'react-router-dom';

// Default images
const defaultSlideImages = [
  'https://images.unsplash.com/photo-1618901185975-d59f7091bcfe?q=80&w=1800&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
  'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1800&q=80',
  'https://images.unsplash.com/photo-1517472292914-9570a594783b?w=1800&auto=format&fit=crop&q=80&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mjh8fHNhcmVlfGVufDB8MHwwfHx8MA%3D%3D',
];

const DynamicHero = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const timeoutRef = useRef(null);
  const heroRef = useRef(null);
  const { siteSettings, getHeroContent } = useSiteSettings();
  
  const heroContent = getHeroContent();
  
  // Use hero content images if available, otherwise fall back to default
  const slideImages = heroContent.length > 0 && heroContent.some(item => item.image) 
    ? heroContent.filter(item => item.image).map(item => item.image)
    : defaultSlideImages;
  
  const resetTimeout = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
  };

  useEffect(() => {
    resetTimeout();
    timeoutRef.current = setTimeout(() => {
      setIsTransitioning(true);
      setTimeout(() => {
        setCurrentSlide((prevSlide) => (prevSlide === slideImages.length - 1 ? 0 : prevSlide + 1));
        setIsTransitioning(false);
      }, 300);
    }, 5000);

    return () => {
      resetTimeout();
    };
  }, [currentSlide, slideImages.length]);

  const nextSlide = () => {
    if (isTransitioning) return;
    
    resetTimeout();
    setIsTransitioning(true);
    setCurrentSlide((prevSlide) => (prevSlide === slideImages.length - 1 ? 0 : prevSlide + 1));
    setTimeout(() => {
      setIsTransitioning(false);
    }, 800);
  };

  const prevSlide = () => {
    if (isTransitioning) return;
    
    resetTimeout();
    setIsTransitioning(true);
    setCurrentSlide((prevSlide) => (prevSlide === 0 ? slideImages.length - 1 : prevSlide - 1));
    setTimeout(() => {
      setIsTransitioning(false);
    }, 800);
  };

  const goToSlide = (index) => {
    if (isTransitioning || index === currentSlide) return;
    
    resetTimeout();
    setIsTransitioning(true);
    setCurrentSlide(index);
    setTimeout(() => {
      setIsTransitioning(false);
    }, 800);
  };

  // Get current hero content item
  const currentHeroItem = heroContent[currentSlide] || {};

  return (
    <motion.div 
      ref={heroRef}
      className="relative overflow-hidden h-[50vh] md:h-[80vh]"
    >
      {/* Background Images with smooth transitions */}
      <div className="absolute inset-0 bg-black">
        {/* Preload all images */}
        <div className="hidden">
          {slideImages.map((image, index) => (
            <img key={`preload-${index}`} src={image} alt="Preload" />
          ))}
        </div>
        
        <AnimatePresence mode="wait">
          <motion.div
            key={currentSlide}
            initial={{ opacity: 0, scale: 1.1 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ 
              duration: 0.8,
              ease: [0.25, 0.46, 0.45, 0.94]
            }}
            className="absolute inset-0 w-full h-full"
          >
            {/* Subtle gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-black/40 z-10" />
            
            <motion.img
              src={slideImages[currentSlide]}
              alt={currentHeroItem.title || `Slide ${currentSlide + 1}`}
              className="h-full w-full object-cover"
              initial={{ scale: 1.1 }}
              animate={{ scale: 1 }}
              transition={{ 
                duration: 8,
                ease: "easeOut"
              }}
            />
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Hero Content Overlay */}
      {(currentHeroItem.title || currentHeroItem.subtitle || currentHeroItem.description) && (
        <div className="absolute inset-0 z-20 flex items-center justify-center">
          <div className="text-center text-white px-4 max-w-4xl">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentSlide}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -30 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="space-y-4"
              >
                {currentHeroItem.subtitle && (
                  <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="text-amber-300 text-sm md:text-base uppercase tracking-widest font-light"
                  >
                    {currentHeroItem.subtitle}
                  </motion.p>
                )}
                
                {currentHeroItem.title && (
                  <motion.h1
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                    className="text-4xl md:text-6xl lg:text-7xl font-bold font-serif leading-tight"
                  >
                    {currentHeroItem.title}
                  </motion.h1>
                )}
                
                {currentHeroItem.description && (
                  <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                    className="text-lg md:text-xl text-gray-200 max-w-2xl mx-auto leading-relaxed"
                  >
                    {currentHeroItem.description}
                  </motion.p>
                )}
                
                {(currentHeroItem.primaryCta || currentHeroItem.secondaryCta) && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6 }}
                    className="flex flex-col sm:flex-row gap-4 justify-center items-center mt-8"
                  >
                    {currentHeroItem.primaryCta && (
                      <Link
                        to="/categories"
                        className="bg-[#6f0e06] hover:bg-[#8f1616] text-white px-8 py-3 rounded-full font-medium transition-all duration-300 transform hover:scale-105 shadow-lg"
                      >
                        {currentHeroItem.primaryCta}
                      </Link>
                    )}
                    
                    {currentHeroItem.secondaryCta && (
                      <Link
                        to="/about"
                        className="border-2 border-white/80 hover:bg-white/10 text-white px-8 py-3 rounded-full font-medium transition-all duration-300"
                      >
                        {currentHeroItem.secondaryCta}
                      </Link>
                    )}
                  </motion.div>
                )}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      )}

      {/* Navigation Arrows */}
      <div className="hidden md:block">
        <motion.button
          onClick={prevSlide}
          disabled={isTransitioning}
          className="absolute left-6 top-1/2 -translate-y-1/2 z-30 p-3 rounded-full bg-black/20 backdrop-blur-sm hover:bg-black/40 text-white transition-all duration-300 group disabled:opacity-50 disabled:cursor-not-allowed"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          aria-label="Previous slide"
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
          </svg>
        </motion.button>
        
        <motion.button
          onClick={nextSlide}
          disabled={isTransitioning}
          className="absolute right-6 top-1/2 -translate-y-1/2 z-30 p-3 rounded-full bg-black/20 backdrop-blur-sm hover:bg-black/40 text-white transition-all duration-300 group disabled:opacity-50 disabled:cursor-not-allowed"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          aria-label="Next slide"
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
            <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
          </svg>
        </motion.button>
      </div>

      {/* Carousel Indicators */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-30 flex space-x-3">
        {slideImages.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className="relative group"
            disabled={isTransitioning}
          >
            <motion.span 
              className={`block h-2 w-2 rounded-full transition-all duration-500 ${
                currentSlide === index ? 'bg-white scale-125' : 'bg-white/50 hover:bg-white/80'
              }`}
              whileHover={{ scale: 1.2 }}
              whileTap={{ scale: 0.9 }}
            />
            
            {/* Progress indicator for active slide */}
            {currentSlide === index && (
              <motion.div
                className="absolute -inset-2 rounded-full border border-white/30"
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0, opacity: 0 }}
                transition={{ duration: 0.3 }}
              >
                <motion.div
                  className="absolute inset-0 rounded-full border-t border-white"
                  animate={{ rotate: 360 }}
                  transition={{ 
                    duration: 5,
                    ease: "linear",
                    repeat: Infinity
                  }}
                />
              </motion.div>
            )}
          </button>
        ))}
      </div>

      {/* Mobile swipe indicators */}
      <div className="md:hidden absolute bottom-4 left-1/2 transform -translate-x-1/2 z-30 flex items-center space-x-2 text-white/60 text-sm">
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16l-4-4m0 0l4-4m-4 4h18" />
        </svg>
        <span>Swipe</span>
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
        </svg>
      </div>

      {/* Touch/Swipe support for mobile */}
      <div 
        className="md:hidden absolute inset-0 z-20"
        onTouchStart={(e) => {
          const touchStart = e.touches[0].clientX;
          
          const handleTouchEnd = (e) => {
            const touchEnd = e.changedTouches[0].clientX;
            const diff = touchStart - touchEnd;
            
            if (Math.abs(diff) > 50) { // Minimum swipe distance
              if (diff > 0) {
                nextSlide();
              } else {
                prevSlide();
              }
            }
            
            document.removeEventListener('touchend', handleTouchEnd);
          };
          
          document.addEventListener('touchend', handleTouchEnd);
        }}
      />
    </motion.div>
  );
};

export default DynamicHero;