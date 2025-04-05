import { motion, AnimatePresence, useScroll, useTransform } from 'framer-motion';
import { useEffect, useState, useRef } from 'react';

// Enhanced high-quality images
const slideImages = [
  'https://images.unsplash.com/photo-1618901185975-d59f7091bcfe?q=80&w=1800&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
  'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1800&q=80',
  'https://images.unsplash.com/photo-1517472292914-9570a594783b?w=1800&auto=format&fit=crop&q=80&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mjh8fHNhcmVlfGVufDB8MHwwfHx8MA%3D%3D',
];

// Enhanced text content with additional call-to-action buttons
const textContent = [
  {
    supheading: "Royal Heritage Collection",
    heading: "Timeless Tradition",
    subheading: "Elegance woven into every thread",
    description: "Discover our exquisite collection of handcrafted ethnic wear, where centuries of tradition meet contemporary designs.",
    primaryCta: "Explore Collection",
    secondaryCta: "View Lookbook"
  },
  {
    supheading: "Designer Series",
    heading: "Contemporary Luxury",
    subheading: "Where heritage meets modern design",
    description: "Indulge in the finest craftsmanship with our signature pieces, meticulously created for the modern connoisseur.",
    primaryCta: "Shop Now",
    secondaryCta: "Behind The Scenes"
  },
  {
    supheading: "Artisan Masterpiece",
    heading: "Crafted Excellence",
    subheading: "The artistry of traditional wear",
    description: "Each piece tells a story of dedication and skill, celebrating the rich cultural heritage of Indian craftsmanship.",
    primaryCta: "Browse Collection",
    secondaryCta: "Our Artisans"
  }
];

// Decorative SVG patterns
const PatternBorder = ({ className }) => (
  <svg viewBox="0 0 300 20" className={`${className} text-[#ba1a5d]`}>
    <pattern id="heroPatternBorder" patternUnits="userSpaceOnUse" width="20" height="20">
      <circle cx="10" cy="10" r="2" fill="currentColor" opacity="0.3" />
    </pattern>
    <rect width="300" height="20" fill="url(#heroPatternBorder)" />
    <rect x="125" y="8" width="50" height="4" fill="currentColor" opacity="0.5" />
  </svg>
);

const FloralCorner = ({ className, rotation = 0 }) => (
  <svg viewBox="0 0 100 100" className={`${className} text-[#ba1a5d]`} style={{ transform: `rotate(${rotation}deg)` }}>
    <g opacity="0.15">
      <path d="M10,10 C30,15 70,5 90,30" stroke="currentColor" strokeWidth="1" fill="none" />
      <path d="M20,20 C40,15 60,40 80,20" stroke="currentColor" strokeWidth="1" fill="none" />
      <circle cx="90" cy="30" r="3" fill="currentColor" />
      <circle cx="80" cy="20" r="2" fill="currentColor" />
      <circle cx="20" cy="15" r="3" fill="currentColor" />
      <path d="M5,50 C15,40 10,20 30,10" stroke="currentColor" strokeWidth="1" fill="none" />
      <circle cx="5" cy="50" r="2" fill="currentColor" />
    </g>
  </svg>
);

// Elegant decorative elements
const ElegantRibbon = ({ className }) => (
  <svg viewBox="0 0 400 20" className={`${className} text-[#ba1a5d]`}>
    <path 
      d="M0,10 C100,0 150,20 200,10 C250,0 300,20 400,10" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="0.5" 
      strokeDasharray="1 3"
    />
    <path 
      d="M0,10 C100,20 150,0 200,10 C250,20 300,0 400,10" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="0.5" 
      strokeDasharray="1 3"
    />
  </svg>
);

const EnhancedHero = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const timeoutRef = useRef(null);
  const heroRef = useRef(null);
  
  // Enhanced parallax scroll effect with framer-motion
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"]
  });
  
  const backgroundY = useTransform(scrollYProgress, [0, 1], [0, 200]);
  const contentY = useTransform(scrollYProgress, [0, 1], [0, 100]);
  const opacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);
  
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
        setTimeout(() => {
          setIsTransitioning(false);
        }, 800);
      }, 100);
    }, 6000);

    return () => {
      resetTimeout();
    };
  }, [currentSlide]);

  const nextSlide = () => {
    if (isTransitioning) return;
    
    resetTimeout();
    setIsTransitioning(true);
    
    setCurrentSlide((prevSlide) => (prevSlide === slideImages.length - 1 ? 0 : prevSlide + 1));
    
    setTimeout(() => {
      setIsTransitioning(false);
    }, 1200);
  };

  const prevSlide = () => {
    if (isTransitioning) return;
    
    resetTimeout();
    setIsTransitioning(true);
    
    setCurrentSlide((prevSlide) => (prevSlide === 0 ? slideImages.length - 1 : prevSlide - 1));
    
    setTimeout(() => {
      setIsTransitioning(false);
    }, 1200);
  };

  return (
    <motion.div 
      ref={heroRef}
      className="relative overflow-hidden h-screen"
    >
      {/* Parallax Background Images with elegant animations */}
      <motion.div 
        className="absolute inset-0 bg-black"
        style={{ y: backgroundY }}
      >
        {/* Preload all images to prevent flickering */}
        <div className="hidden">
          {slideImages.map((image, index) => (
            <img key={`preload-${index}`} src={image} alt="Preload" />
          ))}
        </div>
        
        {slideImages.map((image, index) => (
          <motion.div
            key={index}
            initial={false}
            animate={{ 
              opacity: index === currentSlide ? 1 : 0,
              scale: index === currentSlide ? 1 : 1.1,
              zIndex: index === currentSlide ? 1 : 0
            }}
            transition={{ 
              opacity: { duration: 1.2, ease: "easeInOut" },
              scale: { duration: 1.5, ease: "easeInOut" },
              zIndex: { delay: index === currentSlide ? 0 : 0.8 }
            }}
            className="absolute inset-0 w-full h-full"
          >
            {/* Enhanced gradient overlay with elegant animation */}
            <motion.div 
              className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/50 to-black/40 z-10"
              animate={{ 
                opacity: [0.7, 0.85, 0.7]
              }}
              transition={{ duration: 8, repeat: Infinity, repeatType: "reverse" }}
            />
            
            <motion.img
              src={image}
              alt={`Slide ${index + 1}`}
              className="h-full w-full object-cover"
              style={{ opacity: index === currentSlide ? 1 : 0 }}
              animate={{ 
                scale: index === currentSlide ? [1, 1.05, 1] : 1,
              }}
              transition={{ 
                scale: { duration: 20, repeat: Infinity, repeatType: "reverse" },
                opacity: { duration: 0.8 }
              }}
            />
          </motion.div>
        ))}
      </motion.div>

      {/* Enhanced Decorative Elements */}
      <div className="absolute inset-0 z-10 overflow-hidden pointer-events-none">
        {/* Animated golden ratio spiral */}
        <motion.div 
          className="absolute -top-[20%] -right-[20%] w-[70%] h-[70%] opacity-10"
          animate={{ rotate: 360 }}
          transition={{ duration: 120, repeat: Infinity, ease: "linear" }}
        >
          <svg viewBox="0 0 100 100" className="w-full h-full text-[#ba1a5d]">
            <path 
              d="M50,2 
              C75,2 98,25 98,50 
              C98,75 75,98 50,98 
              C25,98 2,75 2,50 
              C2,25 25,2 50,2 
              Z" 
              fill="none" 
              stroke="currentColor" 
              strokeWidth="0.2"
            />
            <path 
              d="M50,10 
              C70,10 90,30 90,50 
              C90,70 70,90 50,90 
              C30,90 10,70 10,50 
              C10,30 30,10 50,10 
              Z" 
              fill="none" 
              stroke="currentColor" 
              strokeWidth="0.2"
            />
            <path 
              d="M50,20 
              C65,20 80,35 80,50 
              C80,65 65,80 50,80 
              C35,80 20,65 20,50 
              C20,35 35,20 50,20 
              Z" 
              fill="none" 
              stroke="currentColor"
              strokeWidth="0.2" 
            />
            <path 
              d="M50,30 
              C60,30 70,40 70,50 
              C70,60 60,70 50,70 
              C40,70 30,60 30,50 
              C30,40 40,30 50,30 
              Z" 
              fill="none" 
              stroke="currentColor" 
              strokeWidth="0.2"
            />
          </svg>
        </motion.div>
        
        {/* Top left elegant corner */}
        <motion.div
          className="absolute top-0 left-0"
          animate={{ opacity: [0.4, 0.7, 0.4] }}
          transition={{ duration: 4, repeat: Infinity }}
        >
          <FloralCorner className="w-64 h-64" rotation={0} />
        </motion.div>
        
        {/* Bottom right elegant corner */}
        <motion.div
          className="absolute bottom-0 right-0"
          animate={{ opacity: [0.4, 0.7, 0.4] }}
          transition={{ duration: 4, repeat: Infinity, delay: 2 }}
        >
          <FloralCorner className="w-64 h-64" rotation={180} />
        </motion.div>
        
        {/* Floating particles effect */}
        <motion.div 
          className="absolute inset-0 bg-[url('/particles.svg')] bg-repeat opacity-10"
          animate={{ 
            y: [0, -10, 0],
            x: [0, 5, 0]
          }}
          transition={{ duration: 20, repeat: Infinity, repeatType: "reverse" }}
        />
        
        {/* Elegant ribbon decorations */}
        <motion.div
          className="absolute top-28 left-1/2 -translate-x-1/2 w-[95%] max-w-7xl"
          animate={{ opacity: [0.3, 0.5, 0.3] }}
          transition={{ duration: 5, repeat: Infinity }}
        >
          <ElegantRibbon className="w-full h-6" />
        </motion.div>
        
        <motion.div
          className="absolute bottom-28 left-1/2 -translate-x-1/2 w-[95%] max-w-7xl"
          animate={{ opacity: [0.3, 0.5, 0.3] }}
          transition={{ duration: 5, repeat: Infinity, delay: 2.5 }}
        >
          <ElegantRibbon className="w-full h-6 transform rotate-180" />
        </motion.div>
        
        {/* Side decorative elements */}
        <motion.div 
          className="absolute left-8 top-1/2 -translate-y-1/2 hidden lg:block"
          animate={{ opacity: [0.3, 0.7, 0.3] }}
          transition={{ duration: 6, repeat: Infinity, repeatDelay: 1 }}
        >
          <div className="w-[1px] h-[30vh] bg-gradient-to-b from-transparent via-[#ba1a5d]/30 to-transparent"></div>
        </motion.div>
        
        <motion.div 
          className="absolute right-8 top-1/2 -translate-y-1/2 hidden lg:block"
          animate={{ opacity: [0.3, 0.7, 0.3] }}
          transition={{ duration: 6, repeat: Infinity, repeatDelay: 1, delay: 3 }}
        >
          <div className="w-[1px] h-[30vh] bg-gradient-to-b from-transparent via-[#ba1a5d]/30 to-transparent"></div>
        </motion.div>
      </div>

      {/* Enhanced Carousel Indicators */}
      <div className="absolute bottom-12 left-1/2 transform -translate-x-1/2 z-30 flex space-x-4">
        {slideImages.map((_, index) => (
          <button
            key={index}
            onClick={() => {
              if (!isTransitioning) {
                setIsTransitioning(true);
                
                // Immediate slide change for better responsiveness
                setCurrentSlide(index);
                
                // Allow transition to complete before enabling new transitions
                setTimeout(() => {
                  setIsTransitioning(false);
                }, 1200);
              }
            }}
            className="relative group"
            disabled={isTransitioning}
          >
            <span className={`block h-0.5 w-8 md:w-10 rounded-full transition-all duration-500 ${
              currentSlide === index ? 'bg-[#ba1a5d] w-12 md:w-16' : 'bg-white/50 group-hover:bg-white/80'
            }`} />
            
            {currentSlide === index && (
              <motion.span 
                className="absolute -bottom-[2px] left-0 h-0.5 w-1 bg-[#ba1a5d] rounded-full"
                animate={{ left: ["0%", "100%"] }}
                transition={{ 
                  duration: 6, 
                  ease: "linear",
                  repeat: Infinity,
                  repeatType: "loop"
                }}
              />
            )}
            
            <motion.span
              className="absolute -top-8 left-1/2 -translate-x-1/2 text-xs font-medium text-white opacity-0 whitespace-nowrap"
              animate={{ opacity: currentSlide === index ? 0.7 : 0 }}
              transition={{ duration: 0.3 }}
            >
              {["Royal", "Designer", "Artisan"][index]}
            </motion.span>
          </button>
        ))}
      </div>

      {/* Enhanced Navigation Arrows */}
      <div className="hidden md:block">
        <motion.button
          onClick={prevSlide}
          disabled={isTransitioning}
          className="absolute left-6 top-1/2 -translate-y-1/2 z-30 p-3 rounded-full bg-black/20 backdrop-blur-sm hover:bg-[#ba1a5d]/70 text-white transition-all duration-300 group disabled:opacity-50 disabled:cursor-not-allowed"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          aria-label="Previous slide"
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6 group-hover:scale-110 transition-transform">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
          </svg>
          <span className="absolute left-full ml-2 top-1/2 -translate-y-1/2 text-sm text-white whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity">
            {textContent[(currentSlide === 0 ? slideImages.length - 1 : currentSlide - 1)].heading}
          </span>
        </motion.button>
        
        <motion.button
          onClick={nextSlide}
          disabled={isTransitioning}
          className="absolute right-6 top-1/2 -translate-y-1/2 z-30 p-3 rounded-full bg-black/20 backdrop-blur-sm hover:bg-[#ba1a5d]/70 text-white transition-all duration-300 group disabled:opacity-50 disabled:cursor-not-allowed"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          aria-label="Next slide"
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6 group-hover:scale-110 transition-transform">
            <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
          </svg>
          <span className="absolute right-full mr-2 top-1/2 -translate-y-1/2 text-sm text-white whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity">
            {textContent[(currentSlide === slideImages.length - 1 ? 0 : currentSlide + 1)].heading}
          </span>
        </motion.button>
      </div>

      {/* Enhanced Content with Layered Animations */}
      <motion.div 
        className="absolute inset-0 z-20 flex items-center justify-center"
        style={{ opacity, y: contentY }}
      >
        <div className="max-w-6xl mx-auto px-4 text-center text-white">
          <AnimatePresence mode="sync">
            <motion.div
              key={currentSlide}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5 }}
              className="space-y-6"
            >
              {/* Elegant content reveal */}
              <motion.div 
                className="space-y-6"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 1 }}
              >
                <motion.span
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.2 }}
                  className="inline-block py-1 px-4 border border-[#ba1a5d]/30 text-[#ba1a5d] rounded-full text-sm font-medium backdrop-blur-sm bg-white/10"
                >
                  {textContent[currentSlide].supheading}
                </motion.span>
                
                <motion.h1
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.4 }}
                  className="text-5xl sm:text-6xl md:text-7xl xl:text-8xl font-serif font-light tracking-wide mt-4 text-white drop-shadow-lg"
                >
                  {textContent[currentSlide].heading.split('').map((letter, index) => (
                    <motion.span
                      key={index}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ 
                        duration: 0.3, 
                        delay: 0.5 + (index * 0.05),
                        ease: "easeOut"
                      }}
                      className="inline-block"
                    >
                      {letter === " " ? "\u00A0" : letter}
                    </motion.span>
                  ))}
                </motion.h1>
                
                {/* Elegant divider with animation */}
                <motion.div className="flex items-center justify-center my-6">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: 60 }}
                    transition={{ duration: 0.8, delay: 0.8 }}
                    className="h-[1px] bg-[#ba1a5d]/70"
                  />
                  <motion.div
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ duration: 0.5, delay: 1.2 }}
                    className="mx-3"
                  >
                    <svg width="10" height="10" viewBox="0 0 10 10" className="text-[#ba1a5d]">
                      <rect width="10" height="10" fill="currentColor" opacity="0.4" transform="rotate(45 5 5)" />
                    </svg>
                  </motion.div>
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: 60 }}
                    transition={{ duration: 0.8, delay: 0.8 }}
                    className="h-[1px] bg-[#ba1a5d]/70"
                  />
                </motion.div>
                
                <motion.p
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 1 }}
                  className="text-xl md:text-2xl max-w-3xl mx-auto font-light text-white/90"
                >
                  {textContent[currentSlide].subheading}
                </motion.p>
                
                <motion.p
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 1.2 }}
                  className="text-base md:text-lg max-w-2xl mx-auto font-light text-white/80 hidden md:block"
                >
                  {textContent[currentSlide].description}
                </motion.p>
              </motion.div>
              
              {/* Enhanced Call to Action Buttons */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 1.4 }}
                className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6 mt-10"
              >
                <motion.a
                  href="/collections"
                  whileHover={{ scale: 1.05, backgroundColor: '#ba1a5d', color: 'white' }}
                  whileTap={{ scale: 0.98 }}
                  transition={{ duration: 0.2 }}
                  className="px-8 py-3 border-2 border-[#ba1a5d] text-[#ba1a5d] hover:bg-[#ba1a5d] hover:text-white rounded-md transition-all duration-300 font-medium relative overflow-hidden group z-10"
                >
                  <span className="relative z-10">{textContent[currentSlide].primaryCta}</span>
                  <motion.span 
                    className="absolute inset-0 bg-[#ba1a5d] transform origin-left -z-10"
                    initial={{ scaleX: 0 }}
                    whileHover={{ scaleX: 1 }}
                    transition={{ duration: 0.3 }}
                  />
                </motion.a>
                
                <motion.a
                  href="/lookbook"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.98 }}
                  transition={{ duration: 0.2 }}
                  className="px-8 py-3 bg-transparent text-white border-2 border-white/30 hover:border-white/70 rounded-md transition-all duration-300 flex items-center backdrop-blur-sm"
                >
                  <span>{textContent[currentSlide].secondaryCta}</span>
                  <motion.svg 
                    xmlns="http://www.w3.org/2000/svg" 
                    fill="none" 
                    viewBox="0 0 24 24" 
                    strokeWidth={2} 
                    stroke="currentColor" 
                    className="w-4 h-4 ml-2"
                    animate={{ x: [0, 4, 0] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                  </motion.svg>
                </motion.a>
              </motion.div>
              
              {/* Elegant scroll indicator */}
              <motion.div 
                className="absolute bottom-20 left-1/2 transform -translate-x-1/2 cursor-pointer hidden md:block"
                initial={{ opacity: 0 }}
                animate={{ opacity: [0, 1, 0] }}
                transition={{ duration: 2, repeat: Infinity, delay: 2 }}
                onClick={() => {
                  window.scrollTo({
                    top: window.innerHeight,
                    behavior: 'smooth'
                  });
                }}
              >
                <p className="text-white/80 text-sm font-light mb-2">Scroll to Explore</p>
                <motion.div
                  animate={{ y: [0, 6, 0] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                  className="flex justify-center"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 text-white/80">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
                  </svg>
                </motion.div>
              </motion.div>
            </motion.div>
          </AnimatePresence>
        </div>
      </motion.div>

      {/* Enhanced Background Gradient Overlays */}
      <div className="absolute top-0 left-0 w-full h-52 bg-gradient-to-b from-black/70 to-transparent z-10 pointer-events-none"></div>
      <div className="absolute bottom-0 left-0 w-full h-52 bg-gradient-to-t from-black/70 to-transparent z-10 pointer-events-none"></div>
      <div className="absolute left-0 top-0 w-52 h-full bg-gradient-to-r from-black/50 to-transparent z-10 pointer-events-none"></div>
      <div className="absolute right-0 top-0 w-52 h-full bg-gradient-to-l from-black/50 to-transparent z-10 pointer-events-none"></div>
    </motion.div>
  );
};

export default EnhancedHero; 