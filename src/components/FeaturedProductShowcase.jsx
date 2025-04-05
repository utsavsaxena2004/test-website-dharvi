import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence, useScroll, useTransform, useMotionValue } from 'framer-motion';

const featuredProduct = {
  name: "Maharani Signature Saree",
  tagline: "A Timeless Masterpiece",
  description: "Our signature hand-embroidered saree represents the pinnacle of artisanal craftsmanship. Each piece takes over 600 hours to create, with intricate zardozi work featuring real gold thread and embellished with Swarovski crystals.",
  price: "₹ 75,999",
  originalPrice: "₹ 89,999",
  discount: "15% OFF",
  rating: 4.9,
  reviews: 124,
  colors: [
    { id: 1, name: "Royal Crimson", value: "#ba1a5d", image: "https://images.unsplash.com/photo-1610189031585-fd499562e6c5?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&q=80" },
    { id: 2, name: "Sapphire Blue", value: "#1a56ba", image: "https://images.unsplash.com/photo-1583391733956-3750c46fc212?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8YmFuYXJhc2klMjBzYXJlZXxlbnwwfDB8MHx8fDA%3D" },
    { id: 3, name: "Emerald Green", value: "#0F766E", image: "https://images.unsplash.com/photo-1610957183072-9207ea9b4b98?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8YmFuYXJhc2klMjBzYXJlZXxlbnwwfDB8MHx8fDA%3D" },
    { id: 4, name: "Royal Gold", value: "#B45309", image: "https://images.unsplash.com/photo-1621184455862-c163dfb30e0f?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8Z29sZCUyMHNhcmVlfGVufDB8MHwwfHx8MA%3D%3D" },
  ],
  features: [
    "Hand-embroidered with 24k gold thread zardozi work",
    "Adorned with Swarovski crystals and semi-precious stones",
    "Pure mulberry silk with 100% natural dyes",
    "Comes with Certificate of Authenticity",
    "Free worldwide shipping and styling consultation"
  ]
};

// Enhanced SVG Motifs and Patterns
const PatternBorder = ({ className }) => (
  <svg viewBox="0 0 300 20" className={`${className} text-[#ba1a5d]`}>
    <pattern id="patternBorder" patternUnits="userSpaceOnUse" width="20" height="20">
      <circle cx="10" cy="10" r="2" fill="currentColor" opacity="0.3" />
    </pattern>
    <rect width="300" height="20" fill="url(#patternBorder)" />
    <rect x="125" y="8" width="50" height="4" fill="currentColor" opacity="0.5" />
  </svg>
);

const PeacockMotif = ({ className }) => (
  <svg viewBox="0 0 100 120" className={`${className} text-[#ba1a5d]`}>
    <g opacity="0.15">
      <path d="M50,80 L50,110" stroke="currentColor" strokeWidth="1.2" />
      <path d="M50,80 Q60,65 50,50 Q40,65 50,80" fill="none" stroke="currentColor" strokeWidth="0.8" />
      <path d="M50,80 Q70,70 80,80 Q70,90 50,80" fill="none" stroke="currentColor" strokeWidth="0.8" />
      <path d="M50,80 Q75,60 80,40 Q65,60 50,80" fill="none" stroke="currentColor" strokeWidth="0.8" />
      <path d="M50,80 Q65,40 50,20 Q35,40 50,80" fill="none" stroke="currentColor" strokeWidth="0.8" />
      <path d="M50,80 Q30,70 20,80 Q30,90 50,80" fill="none" stroke="currentColor" strokeWidth="0.8" />
      <path d="M50,80 Q25,60 20,40 Q35,60 50,80" fill="none" stroke="currentColor" strokeWidth="0.8" />
      <circle cx="50" cy="80" r="5" fill="none" stroke="currentColor" strokeWidth="0.8" />
    </g>
  </svg>
);

// New Decorative Elements
const FloatingElement = ({ children, delay = 0, duration = 20, top, left, scale = 1 }) => (
  <motion.div
    className="absolute pointer-events-none"
    style={{ top, left, scale }}
    animate={{
      y: [0, -15, 0, 15, 0],
      x: [0, 10, 0, -10, 0],
      rotate: [0, 3, 0, -3, 0],
    }}
    transition={{
      duration,
      repeat: Infinity,
      repeatType: "loop",
      delay,
      ease: "easeInOut"
    }}
  >
    {children}
  </motion.div>
);

const GlowingOrb = ({ size, top, left, color, delay = 0 }) => (
  <motion.div
    className="absolute rounded-full blur-xl opacity-20 pointer-events-none"
    style={{ 
      width: size, 
      height: size, 
      top, 
      left, 
      background: `radial-gradient(circle at center, ${color}, transparent 70%)` 
    }}
    animate={{
      scale: [1, 1.2, 1],
      opacity: [0.2, 0.3, 0.2],
    }}
    transition={{
      duration: 5,
      repeat: Infinity,
      repeatType: "reverse",
      delay,
    }}
  />
);

const DecorativeDivider = () => (
  <div className="flex items-center justify-center my-8 relative">
    <motion.div 
      className="w-16 h-[1px] bg-[#ba1a5d]/30"
      initial={{ width: 0 }}
      whileInView={{ width: 64 }}
      viewport={{ once: true }}
      transition={{ duration: 0.8 }}
    />
    <motion.div 
      className="mx-4"
      initial={{ scale: 0, rotate: -180 }}
      whileInView={{ scale: 1, rotate: 0 }}
      viewport={{ once: true }}
      transition={{ 
        duration: 0.6, 
        delay: 0.3,
        type: "spring",
        stiffness: 200
      }}
    >
      <svg width="20" height="20" viewBox="0 0 20 20" className="text-[#ba1a5d]">
        <path d="M10,2 L12,8 L18,10 L12,12 L10,18 L8,12 L2,10 L8,8 Z" fill="currentColor" opacity="0.3" />
      </svg>
    </motion.div>
    <motion.div 
      className="w-16 h-[1px] bg-[#ba1a5d]/30"
      initial={{ width: 0 }}
      whileInView={{ width: 64 }}
      viewport={{ once: true }}
      transition={{ duration: 0.8 }}
    />
  </div>
);

// Add this new component after the existing ones but before FeaturedProductShowcase
const PremiumBadge = () => (
  <motion.div
    className="absolute top-6 right-6 z-30"
    initial={{ opacity: 0, scale: 0.8, rotate: -10 }}
    animate={{ opacity: 1, scale: 1, rotate: 0 }}
    transition={{
      type: "spring",
      stiffness: 300,
      damping: 20,
      delay: 1.2
    }}
  >
    <div className="relative">
      <svg width="120" height="120" viewBox="0 0 120 120" className="absolute -inset-1 text-[#ba1a5d]">
        <circle cx="60" cy="60" r="40" fill="white" stroke="currentColor" strokeWidth="1.5" />
        <circle cx="60" cy="60" r="48" fill="none" stroke="currentColor" strokeWidth="0.5" strokeDasharray="3 3" opacity="0.5" />
        <circle cx="60" cy="60" r="54" fill="none" stroke="currentColor" strokeWidth="0.5" strokeDasharray="1 5" opacity="0.3" />
      </svg>
      <div className="relative bg-white rounded-full p-3 shadow-md w-20 h-20 flex flex-col items-center justify-center">
        <motion.div
          animate={{ 
            rotate: 360,
          }}
          transition={{ 
            duration: 20, 
            repeat: Infinity, 
            ease: "linear" 
          }}
          className="absolute inset-0 w-full h-full"
        >
          <svg viewBox="0 0 100 100" className="w-full h-full text-[#ba1a5d]">
            <defs>
              <path id="circle-premium" d="M 50, 50 m -42, 0 a 42,42 0 1,1 84,0 a 42,42 0 1,1 -84,0" />
            </defs>
            <text fontSize="6.5" fill="#ba1a5d" opacity="0.7">
              <textPath xlinkHref="#circle-premium">
                • PREMIUM • HANDCRAFTED • AUTHENTIC • 
              </textPath>
            </text>
          </svg>
        </motion.div>
        <span className="text-[#ba1a5d] text-xs font-semibold uppercase tracking-wide">Premium</span>
        <span className="text-[#ba1a5d] text-[0.65rem] mt-0.5">Collection</span>
      </div>
    </div>
  </motion.div>
);

const FeaturedProductShowcase = () => {
  const [selectedColor, setSelectedColor] = useState(featuredProduct.colors[0]);
  const [isHovering, setIsHovering] = useState(false);
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  });
  
  const y = useMotionValue(0);
  const x = useMotionValue(0);
  
  // Parallax effects based on scroll
  const headerY = useTransform(scrollYProgress, [0, 1], [0, -50]);
  const orb1Y = useTransform(scrollYProgress, [0, 1], [0, -100]);
  const orb2Y = useTransform(scrollYProgress, [0, 1], [0, 70]);
  const patternOpacity = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0, 0.7, 0.7, 0]);
  
  // Handle mouse movement for 3D effect
  const handleMouseMove = (e) => {
    const rect = containerRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    
    // Calculate distance from center (normalized between -1 and 1)
    const moveX = (e.clientX - centerX) / (rect.width / 2);
    const moveY = (e.clientY - centerY) / (rect.height / 2);
    
    // Update motion values
    x.set(moveX * 10);
    y.set(moveY * 10);
  };
  
  return (
    <motion.section 
      ref={containerRef}
      className="py-20 relative overflow-hidden"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1 }}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
    >
      {/* Enhanced background elements */}
      <div className="absolute inset-0 bg-gradient-to-b from-white via-rose-50/30 to-white opacity-50"></div>
      
      {/* Add a subtle grain texture overlay */}
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIzMDAiIGhlaWdodD0iMzAwIj48ZmlsdGVyIGlkPSJhIiB4PSIwIiB5PSIwIj48ZmVUdXJidWxlbmNlIGJhc2VGcmVxdWVuY3k9Ii43NSIgc3RpdGNoVGlsZXM9InN0aXRjaCIgdHlwZT0iZnJhY3RhbE5vaXNlIi8+PGZlQ29sb3JNYXRyaXggdHlwZT0ic2F0dXJhdGUiIHZhbHVlcz0iMCIvPjwvZmlsdGVyPjxwYXRoIGQ9Ik0wIDBoMzAwdjMwMEgweiIgZmlsdGVyPSJ1cmwoI2EpIiBvcGFjaXR5PSIuMDUiLz48L3N2Zz4=')] opacity-10" />
      
      <motion.div style={{ opacity: patternOpacity }} className="absolute inset-0">
        <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-[#ba1a5d]/20 to-transparent"></div>
        <div className="absolute bottom-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-[#ba1a5d]/20 to-transparent"></div>
        
        <svg className="absolute inset-0 w-full h-full opacity-[0.02]" xmlns="http://www.w3.org/2000/svg">
          <pattern id="ethnicPattern" x="0" y="0" width="50" height="50" patternUnits="userSpaceOnUse">
            <path d="M25,0 L50,25 L25,50 L0,25 Z" fill="none" stroke="#ba1a5d" strokeWidth="0.5"/>
            <circle cx="25" cy="25" r="3" fill="#ba1a5d" opacity="0.2"/>
            <circle cx="25" cy="25" r="8" fill="none" stroke="#ba1a5d" strokeWidth="0.5"/>
          </pattern>
          <rect x="0" y="0" width="100%" height="100%" fill="url(#ethnicPattern)" />
        </svg>
      </motion.div>
      
      {/* Add radial gradient for spotlight effect */}
      <div className="absolute inset-0 bg-radial-gradient opacity-40" />
      
      <GlowingOrb size="400px" top="10%" left="5%" color="#ba1a5d" delay={0} />
      <GlowingOrb size="350px" top="60%" left="80%" color="#ba1a5d" delay={2} />
      
      {/* Add the premium badge */}
      <PremiumBadge />
      
      <motion.div style={{ y: orb1Y }}>
        <motion.div className="absolute right-0 top-1/4 -rotate-90 opacity-10">
          <PatternBorder className="w-64 h-6" />
        </motion.div>
      </motion.div>
      
      <motion.div style={{ y: orb2Y }}>
        <motion.div className="absolute left-0 bottom-1/4 rotate-90 opacity-10">
          <PatternBorder className="w-64 h-6" />
        </motion.div>
      </motion.div>
      
      <FloatingElement top="20%" left="10%" delay={1} duration={15}>
        <PeacockMotif className="w-32 h-32" />
      </FloatingElement>
      
      <FloatingElement top="70%" left="85%" delay={2} duration={18}>
        <PeacockMotif className="w-32 h-32 transform rotate-180" />
      </FloatingElement>
      
      <div className="container mx-auto px-4 relative z-10">
        <motion.div 
          style={{ y: headerY }}
          className="text-center max-w-3xl mx-auto mb-16 relative"
        >
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="absolute -top-10 left-1/2 -translate-x-1/2"
          >
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
              className="w-16 h-16 rounded-full flex items-center justify-center"
            >
              <svg viewBox="0 0 100 100" className="w-full h-full text-[#ba1a5d]">
                <defs>
                  <path id="circle" d="M 50, 50 m -37, 0 a 37,37 0 1,1 74,0 a 37,37 0 1,1 -74,0" />
                </defs>
                <text fontSize="9" fill="#ba1a5d" opacity="0.7">
                  <textPath xlinkHref="#circle">
                    ✧ MASTERPIECE COLLECTION ✧ LUXURY ETHNIC WEAR ✧
                  </textPath>
                </text>
              </svg>
            </motion.div>
          </motion.div>
          
          <motion.h2 
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ 
              duration: 0.8, 
              delay: 0.2, 
              type: "spring",
              stiffness: 100 
            }}
            className="text-4xl md:text-5xl font-serif text-gray-900 mb-2 relative"
          >
            <span className="relative inline-block">
              The 
              <motion.span 
                className="absolute -top-6 -right-4 text-sm text-[#ba1a5d]"
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.8, duration: 0.5 }}
              >
                ✦
              </motion.span>
            </span>{" "}
            <span className="relative z-10 inline-block">
              Masterpiece 
              <motion.span
                className="absolute -z-10 bottom-0 left-0 h-3 bg-[#ba1a5d]/10 w-full"
                initial={{ width: 0 }}
                whileInView={{ width: "100%" }}
                viewport={{ once: true }}
                transition={{ delay: 1, duration: 0.6 }}
              />
            </span>{" "}
            Collection
          </motion.h2>
          
          <motion.div 
            className="flex justify-center"
            initial={{ opacity: 0, width: 0 }}
            whileInView={{ opacity: 1, width: "auto" }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <div className="w-24 h-[1px] bg-[#ba1a5d] mx-auto mb-4"></div>
          </motion.div>
          
          <motion.p 
            className="text-gray-600 text-lg"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.5 }}
          >
            Discover our signature creation, where tradition meets artistry in perfect harmony
          </motion.p>
        </motion.div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12 items-center">
          <div className="order-2 lg:order-1">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="space-y-6"
            >
              <div>
                <div className="flex items-center mb-2">
                  <motion.span 
                    initial={{ opacity: 0, scale: 0.8 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4 }}
                    className="inline-block px-3 py-1 bg-[#ba1a5d]/10 text-[#ba1a5d] text-xs rounded-full font-medium"
                  >
                    Signature Collection
                  </motion.span>
                  <motion.div 
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4, delay: 0.2 }}
                    className="ml-3"
                  >
                    {[1, 2, 3, 4, 5].map((star, index) => (
                      <motion.span 
                        key={star} 
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 * index, duration: 0.3 }}
                        className="text-amber-400 text-sm inline-block"
                      >
                        ★
                      </motion.span>
                    ))}
                    <span className="text-gray-500 text-xs ml-1">({featuredProduct.reviews} reviews)</span>
                  </motion.div>
                </div>
                
                <motion.h3 
                  className="text-3xl font-serif text-gray-900 mb-1"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: 0.3 }}
                >
                  {featuredProduct.name}
                </motion.h3>
                
                <motion.p 
                  className="text-lg text-gray-600 italic font-light"
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: 0.4 }}
                >
                  {featuredProduct.tagline}
                </motion.p>
                
                <DecorativeDivider />
                
                <motion.p 
                  className="text-gray-700 mb-6"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: 0.5 }}
                >
                  {featuredProduct.description}
                </motion.p>
                
                <motion.div 
                  className="mb-6"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: 0.6 }}
                >
                  <h4 className="text-sm uppercase tracking-wider text-gray-500 mb-3">Available Colors</h4>
                  <div className="flex space-x-3">
                    {featuredProduct.colors.map((color, index) => (
                      <motion.button
                        key={color.id}
                        onClick={() => setSelectedColor(color)}
                        className={`relative w-8 h-8 rounded-full p-0.5`}
                        style={{ backgroundColor: color.value }}
                        aria-label={color.name}
                        whileHover={{ scale: 1.15 }}
                        whileTap={{ scale: 0.95 }}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.1 * index, duration: 0.3 }}
                      >
                        {selectedColor.id === color.id && (
                          <motion.div
                            layoutId="colorRing"
                            className="absolute inset-0 rounded-full ring-2 ring-offset-2 ring-white"
                            transition={{ duration: 0.3, type: "spring", stiffness: 300, damping: 20 }}
                          >
                            <motion.div 
                              className="absolute -inset-1 rounded-full opacity-30"
                              animate={{ 
                                boxShadow: ["0 0 0px rgba(186, 26, 93, 0)", "0 0 10px rgba(186, 26, 93, 0.5)", "0 0 0px rgba(186, 26, 93, 0)"] 
                              }}
                              transition={{ duration: 2, repeat: Infinity }}
                              style={{ backgroundColor: color.value }}
                            />
                          </motion.div>
                        )}
                      </motion.button>
                    ))}
                  </div>
                  <motion.p 
                    className="text-sm mt-2 text-gray-600"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.8, duration: 0.5 }}
                  >
                    Selected: <span className="font-medium">{selectedColor.name}</span>
                  </motion.p>
                </motion.div>
                
                <motion.ul 
                  className="space-y-2 mb-8"
                  variants={{
                    hidden: { opacity: 0 },
                    show: {
                      opacity: 1,
                      transition: {
                        staggerChildren: 0.1,
                        delayChildren: 0.3
                      }
                    }
                  }}
                  initial="hidden"
                  whileInView="show"
                  viewport={{ once: true }}
                >
                  {featuredProduct.features.map((feature, index) => (
                    <motion.li 
                      key={index}
                      variants={{
                        hidden: { opacity: 0, x: -20 },
                        show: { opacity: 1, x: 0 }
                      }}
                      className="flex items-start"
                    >
                      <motion.div 
                        className="mt-0.5 mr-2 flex-shrink-0 w-5 h-5 rounded-full bg-[#ba1a5d]/10 flex items-center justify-center"
                        initial={{ scale: 0 }}
                        whileInView={{ scale: 1 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.3, delay: 0.1 * index }}
                      >
                        <svg className="w-3 h-3 text-[#ba1a5d]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                        </svg>
                      </motion.div>
                      <span className="text-gray-700">{feature}</span>
                    </motion.li>
                  ))}
                </motion.ul>
                
                <motion.div 
                  className="flex items-end mb-6"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: 0.8 }}
                >
                  <motion.span 
                    className="text-3xl font-bold text-[#ba1a5d]"
                    whileHover={{ scale: 1.05 }}
                    transition={{ type: "spring", stiffness: 400 }}
                  >
                    {featuredProduct.price}
                  </motion.span>
                  <span className="ml-2 text-gray-500 line-through">{featuredProduct.originalPrice}</span>
                  <motion.span 
                    className="ml-2 text-xs px-2 py-1 bg-amber-100 text-amber-800 rounded-full font-medium"
                    initial={{ opacity: 0, scale: 0.5, rotate: -5 }}
                    whileInView={{ opacity: 1, scale: 1, rotate: 0 }}
                    viewport={{ once: true }}
                    transition={{ 
                      duration: 0.4, 
                      delay: 1,
                      type: "spring",
                      stiffness: 300
                    }}
                  >
                    {featuredProduct.discount}
                  </motion.span>
                </motion.div>
                
                <motion.div 
                  className="flex flex-wrap gap-4"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: 0.9 }}
                >
                  <motion.button
                    whileHover={{ 
                      scale: 1.05, 
                      boxShadow: "0 10px 15px -3px rgba(186, 26, 93, 0.2)" 
                    }}
                    whileTap={{ scale: 0.98 }}
                    className="relative px-8 py-3 bg-[#ba1a5d] text-white rounded-md flex items-center justify-center overflow-hidden group"
                  >
                    <motion.span
                      className="absolute inset-0 bg-gradient-to-r from-[#ba1a5d] via-pink-600 to-[#ba1a5d] opacity-0 group-hover:opacity-100"
                      initial={{ x: "-100%" }}
                      whileHover={{ x: "100%" }}
                      transition={{ duration: 1, repeat: Infinity, repeatType: "loop" }}
                    />
                    <span className="relative z-10">Add to Cart</span>
                    <svg className="w-5 h-5 ml-2 relative z-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                    </svg>
                  </motion.button>
                  
                  <motion.button
                    whileHover={{ 
                      scale: 1.05, 
                      backgroundColor: "rgba(186, 26, 93, 0.08)" 
                    }}
                    whileTap={{ scale: 0.98 }}
                    className="px-6 py-3 border border-[#ba1a5d] text-[#ba1a5d] rounded-md flex items-center justify-center transition-colors duration-300"
                  >
                    <span>Shop The Look</span>
                    <motion.svg 
                      className="w-5 h-5 ml-2" 
                      viewBox="0 0 24 24" 
                      fill="none" 
                      stroke="currentColor"
                      whileHover={{ scale: 1.2 }}
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                    </motion.svg>
                  </motion.button>
                </motion.div>
              </div>
            </motion.div>
          </div>
          
          <div className="order-1 lg:order-2">
            <div className="relative aspect-[3/4] overflow-hidden rounded-lg">
              {/* 3D Card Effect Container */}
              <motion.div
                className="w-full h-full relative rounded-lg shadow-2xl transform-gpu perspective-1000"
                style={{ 
                  transformStyle: "preserve-3d", 
                  transform: "rotateY(10deg) rotateX(5deg)"
                }}
                whileHover={{ 
                  scale: 1.02,
                  rotateY: 0,
                  rotateX: 0
                }}
                transition={{ 
                  type: "spring", 
                  stiffness: 300, 
                  damping: 20 
                }}
              >
                {/* Main product image with transition effects */}
                <AnimatePresence mode="wait">
                  <motion.div
                    key={selectedColor.id}
                    initial={{ opacity: 0, scale: 1.1 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ duration: 0.5 }}
                    className="absolute inset-0"
                  >
                    <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent z-10" />
                    <img 
                      src={selectedColor.image} 
                      alt={`${featuredProduct.name} in ${selectedColor.name}`} 
                      className="w-full h-full object-cover"
                    />
                    
                    {/* Shimmering overlay effect */}
                    <motion.div 
                      className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/30 to-white/0 z-20"
                      initial={{ x: "-100%" }}
                      animate={{ x: "200%" }}
                      transition={{ 
                        duration: 1.5, 
                        repeat: Infinity, 
                        repeatDelay: 5,
                        ease: "easeInOut"
                      }}
                    />
                  </motion.div>
                </AnimatePresence>
                
                {/* Interactive hover effects */}
                <motion.div 
                  className="absolute inset-0 z-20 opacity-0 hover:opacity-100 transition-opacity duration-300"
                  whileHover={{ opacity: 1 }}
                >
                  <div className="absolute inset-x-0 bottom-0 p-5 bg-gradient-to-t from-black/80 to-transparent">
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      whileHover={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      <p className="text-white font-medium text-lg">{featuredProduct.name}</p>
                      <p className="text-white/80 text-sm">{selectedColor.name}</p>
                    </motion.div>
                  </div>
                </motion.div>
                
                {/* Product Highlights with enhanced animations */}
                <motion.div
                  initial={{ opacity: 0, scale: 0.8, y: -20 }}
                  whileInView={{ opacity: 1, scale: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.3, duration: 0.5 }}
                  className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm p-2 rounded-lg shadow-lg z-30"
                >
                  <motion.div
                    animate={{ rotate: [0, 10, 0, -10, 0] }}
                    transition={{ duration: 5, repeat: Infinity, repeatDelay: 2 }}
                  >
                    <svg className="w-6 h-6 text-amber-500" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                    </svg>
                  </motion.div>
                  <span className="text-xs font-medium block mt-1 text-center">Premium</span>
                </motion.div>
                
                <motion.div 
                  initial={{ opacity: 0, x: 50 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.5, duration: 0.5 }}
                  className="absolute bottom-4 right-4 bg-white/90 backdrop-blur-sm py-1 px-3 rounded-full text-xs font-medium shadow-lg z-30"
                >
                  <motion.span
                    animate={{ 
                      color: ["#ba1a5d", "#f472b6", "#ba1a5d"] 
                    }}
                    transition={{ duration: 3, repeat: Infinity }}
                  >
                    Free Shipping
                  </motion.span>
                </motion.div>
                
                {/* Decorative Corner Elements */}
                <div className="absolute top-0 left-0 w-20 h-20 overflow-hidden z-20">
                  <div className="absolute top-0 left-0 w-5 h-full bg-gradient-to-r from-[#ba1a5d]/40 to-transparent"></div>
                  <div className="absolute top-0 left-0 h-5 w-full bg-gradient-to-b from-[#ba1a5d]/40 to-transparent"></div>
                </div>
                <div className="absolute bottom-0 right-0 w-20 h-20 overflow-hidden z-20">
                  <div className="absolute bottom-0 right-0 w-5 h-full bg-gradient-to-l from-[#ba1a5d]/40 to-transparent"></div>
                  <div className="absolute bottom-0 right-0 h-5 w-full bg-gradient-to-t from-[#ba1a5d]/40 to-transparent"></div>
                </div>
              </motion.div>
            </div>
            
            {/* Enhanced Thumbnail Navigation */}
            <div className="flex justify-center mt-6 space-x-3">
              {featuredProduct.colors.map((color, index) => (
                <motion.button
                  key={color.id}
                  whileHover={{ y: -4, boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1)" }}
                  whileTap={{ scale: 0.95 }}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ 
                    delay: 0.2 + (index * 0.1), 
                    duration: 0.4,
                    y: { type: "spring", stiffness: 300, damping: 20 }
                  }}
                  onClick={() => setSelectedColor(color)}
                  className={`relative rounded-md overflow-hidden w-16 h-16 ${selectedColor.id === color.id ? 'ring-2 ring-[#ba1a5d]' : 'ring-1 ring-gray-200'}`}
                >
                  <motion.div
                    animate={selectedColor.id === color.id ? {
                      boxShadow: ["0 0 0 0px rgba(186, 26, 93, 0.3)", "0 0 0 4px rgba(186, 26, 93, 0)", "0 0 0 0px rgba(186, 26, 93, 0.3)"]
                    } : {}}
                    transition={{ duration: 1.5, repeat: Infinity }}
                    className="absolute inset-0"
                  />
                  <img 
                    src={color.image} 
                    alt={color.name} 
                    className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
                  />
                </motion.button>
              ))}
            </div>
          </div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.6, duration: 0.5 }}
          className="mt-20 text-center"
        >
          <div className="inline-block relative">
            <motion.a 
              href="/collections/signature" 
              className="inline-flex items-center px-8 py-3 border-2 border-[#ba1a5d] text-[#ba1a5d] hover:bg-[#ba1a5d] hover:text-white transition-all duration-300 rounded-md group relative overflow-hidden"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.98 }}
            >
              <motion.div
                className="absolute inset-0 w-full h-full bg-gradient-to-r from-[#ba1a5d]/0 via-[#ba1a5d]/30 to-[#ba1a5d]/0"
                initial={{ x: "-100%" }}
                whileHover={{ x: "100%" }}
                transition={{ duration: 0.6 }}
              />
              <span className="relative z-10">Explore Signature Collection</span>
              <motion.svg 
                className="w-5 h-5 ml-2 relative z-10 transform" 
                whileHover={{ x: 3 }}
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path>
              </motion.svg>
            </motion.a>
            <motion.div
              className="absolute -top-1 -bottom-1 -left-1 -right-1 border border-[#ba1a5d]/30 rounded-md"
              initial={{ scale: 0.8, opacity: 0 }}
              whileHover={{ scale: 1.05, opacity: 1 }}
              transition={{ duration: 0.3 }}
            />
          </div>
        </motion.div>
      </div>
    </motion.section>
  );
};

export default FeaturedProductShowcase;