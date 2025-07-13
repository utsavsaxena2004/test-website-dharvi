import { motion, useAnimation } from 'framer-motion';
import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLongRightIcon, SparklesIcon } from '@heroicons/react/24/outline';

const CustomDesignShowcase = () => {
  const [isHovered, setIsHovered] = useState(false);
  const constraintsRef = useRef(null);
  const sectionRef = useRef(null);
  const controls = useAnimation();
  
  useEffect(() => {
    const reveal = async () => {
      await controls.start('visible');
    };
    reveal();
  }, [controls]);

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.3,
      }
    }
  };
  
  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { type: "spring", stiffness: 100 }
    }
  };
  
  const floatingCircleVariants = {
    hidden: { scale: 0, opacity: 0 },
    visible: { 
      scale: 1, 
      opacity: 1,
      transition: { duration: 0.8, ease: "easeOut" }
    }
  };
  
  const featureItemVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: (i) => ({
      opacity: 1,
      x: 0,
      transition: { 
        delay: 0.2 + (i * 0.1),
        duration: 0.6,
        ease: "easeOut"
      }
    })
  };
  
  const textRevealVariants = {
    hidden: { y: 100, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.8, ease: "easeOut" }
    }
  };

  return (
    <motion.section 
      ref={sectionRef}
      style={{ opacity: 1, scale: 1 }}
      className="py-20 bg-gradient-to-b from-white to-gray-50 overflow-hidden relative"
    >
      {/* Background decorative elements */}
      <motion.div 
        className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.5 }}
      >
        <motion.div 
          className="absolute top-20 left-[5%] w-64 h-64 rounded-full bg-pink/5 blur-3xl"
          animate={{ 
            scale: [1, 1.2, 1],
            x: [0, 10, 0],
            y: [0, -15, 0],
          }}
          transition={{ 
            duration: 15,
            repeat: Infinity,
            repeatType: "reverse"
          }}
        />
        <motion.div 
          className="absolute bottom-40 right-[10%] w-80 h-80 rounded-full bg-blue-400/5 blur-3xl"
          animate={{ 
            scale: [1, 1.3, 1],
            x: [0, -20, 0],
            y: [0, 20, 0],
          }}
          transition={{ 
            duration: 18,
            repeat: Infinity,
            repeatType: "reverse",
            delay: 2
          }}
        />
        <motion.div 
          className="absolute top-[40%] right-[30%] w-40 h-40 rounded-full bg-purple-300/10 blur-2xl"
          animate={{ 
            scale: [1, 1.5, 1],
            opacity: [0.5, 0.8, 0.5]
          }}
          transition={{ 
            duration: 12,
            repeat: Infinity,
            repeatType: "reverse",
            delay: 1
          }}
        />
        
        {/* Decorative patterns */}
        <svg className="absolute top-10 right-10 text-pink/10 w-24 h-24" viewBox="0 0 100 100" fill="currentColor">
          <defs>
            <pattern id="pattern-circles" x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse">
              <circle cx="10" cy="10" r="2" />
            </pattern>
          </defs>
          <motion.rect 
            width="100" 
            height="100" 
            fill="url(#pattern-circles)"
            animate={{ rotate: 360 }}
            transition={{ duration: 120, repeat: Infinity, ease: "linear" }}
          />
        </svg>
        
        <svg className="absolute bottom-10 left-10 text-pink/10 w-32 h-32" viewBox="0 0 100 100" fill="currentColor">
          <defs>
            <pattern id="pattern-diamonds" x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse">
              <path d="M10,4 L16,10 L10,16 L4,10 Z" />
            </pattern>
          </defs>
          <motion.rect 
            width="100" 
            height="100" 
            fill="url(#pattern-diamonds)"
            animate={{ rotate: -360 }}
            transition={{ duration: 180, repeat: Infinity, ease: "linear" }}
          />
        </svg>
      </motion.div>

      <div className="container mx-auto px-4 relative z-10">
        <motion.div 
          className="max-w-7xl mx-auto"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={containerVariants}
        >
          {/* Heading */}
          <motion.div 
            className="text-center mb-16 relative"
            variants={itemVariants}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="absolute -top-10 left-1/2 transform -translate-x-1/2"
            >
              <SparklesIcon className="h-10 w-10 text-pink/40" />
            </motion.div>
            
            <h2 className="text-3xl md:text-5xl font-semibold text-gray-900 mb-4 relative">
              Your Dream Outfit, <span className="relative inline-block">
                <span className="text-pink">Brought to Life</span>
                <motion.span 
                  className="absolute bottom-0 left-0 h-1 bg-pink/30 rounded-full w-full"
                  initial={{ width: 0 }}
                  animate={{ width: "100%" }}
                  transition={{ duration: 1, delay: 1 }}
                />
              </span>
            </h2>
            <motion.p 
              className="text-gray-600 max-w-2xl mx-auto text-lg"
              variants={textRevealVariants}
            >
              From imagination to reality - our master artisans craft your perfect ethnic wear based on your inspiration.
            </motion.p>
          </motion.div>

          {/* Main content area */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            {/* Left side - Interactive Illustration */}
            <motion.div 
              className="relative h-[600px]"
              variants={itemVariants}
              ref={constraintsRef}
            >
              <div className="absolute inset-0 flex items-center justify-center">
                {/* Main circle */}
                <motion.div
                  className="w-72 h-72 rounded-full bg-gradient-to-br from-pink/20 to-pink/5 flex items-center justify-center border border-pink/20 relative"
                  animate={{ 
                    scale: [1, 1.05, 1], 
                    rotate: [0, 5, 0],
                    boxShadow: [
                      "0 0 0 rgba(255, 51, 102, 0.1)",
                      "0 0 30px rgba(255, 51, 102, 0.2)",
                      "0 0 0 rgba(255, 51, 102, 0.1)"
                    ]
                  }}
                  transition={{ duration: 8, repeat: Infinity, repeatType: "reverse" }}
                >
                  {/* Rotating circles around main circle */}
                  <motion.div
                    className="absolute inset-0 rounded-full"
                    style={{ border: '1px dashed rgba(255, 51, 102, 0.3)' }}
                    animate={{ rotate: 360 }}
                    transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
                  >
                    <motion.div
                      className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-6 h-6 rounded-full bg-pink/20"
                      whileHover={{ scale: 1.5, backgroundColor: 'rgba(255, 51, 102, 0.4)' }}
                      transition={{ duration: 0.3 }}
                    />
                    <motion.div
                      className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 w-6 h-6 rounded-full bg-pink/20"
                      whileHover={{ scale: 1.5, backgroundColor: 'rgba(255, 51, 102, 0.4)' }}
                      transition={{ duration: 0.3 }}
                    />
                    <motion.div
                      className="absolute top-1/2 left-0 -translate-x-1/2 -translate-y-1/2 w-6 h-6 rounded-full bg-pink/20"
                      whileHover={{ scale: 1.5, backgroundColor: 'rgba(255, 51, 102, 0.4)' }}
                      transition={{ duration: 0.3 }}
                    />
                    <motion.div
                      className="absolute top-1/2 right-0 translate-x-1/2 -translate-y-1/2 w-6 h-6 rounded-full bg-pink/20"
                      whileHover={{ scale: 1.5, backgroundColor: 'rgba(255, 51, 102, 0.4)' }}
                      transition={{ duration: 0.3 }}
                    />
                  </motion.div>
                  
                  {/* Central illustration */}
                  <div className="relative w-56 h-56 rounded-full bg-white shadow-lg overflow-hidden group">
                    <img 
                      src="https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&q=80" 
                      alt="Elegant ethnic design" 
                      className="object-cover w-full h-full transition-transform duration-500 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                    <motion.div 
                      className="absolute inset-0 flex items-center justify-center"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.5, duration: 0.8 }}
                    >
                      <div className="text-white text-center px-4">
                        <motion.p 
                          className="font-medium text-xl md:text-2xl"
                          animate={{ 
                            textShadow: [
                              "0 0 0px rgba(255, 255, 255, 0.5)",
                              "0 0 10px rgba(255, 255, 255, 0.8)",
                              "0 0 0px rgba(255, 255, 255, 0.5)"
                            ]
                          }}
                          transition={{ duration: 3, repeat: Infinity }}
                        >
                          Your Vision
                        </motion.p>
                        <motion.p 
                          className="text-sm md:text-base opacity-80"
                          animate={{ 
                            y: [0, -3, 0],
                          }}
                          transition={{ duration: 2, repeat: Infinity, repeatType: "reverse" }}
                        >
                          Transformed
                        </motion.p>
                      </div>
                    </motion.div>
                  </div>
                </motion.div>

                {/* Floating elements with enhanced animations */}
                <motion.div
                  className="absolute w-24 h-24 rounded-full overflow-hidden shadow-lg"
                  style={{ left: '10%', top: '15%' }}
                  drag
                  dragConstraints={constraintsRef}
                  whileHover={{ scale: 1.1, boxShadow: "0 0 20px rgba(255, 51, 102, 0.3)" }}
                  whileTap={{ scale: 0.95 }}
                  animate={{ 
                    y: [0, -15, 0],
                    rotate: [0, 5, 0],
                    boxShadow: [
                      "0 4px 6px rgba(0, 0, 0, 0.1)",
                      "0 10px 15px rgba(255, 51, 102, 0.2)",
                      "0 4px 6px rgba(0, 0, 0, 0.1)"
                    ]
                  }}
                  transition={{ 
                    duration: 4, 
                    repeat: Infinity, 
                    repeatType: "reverse",
                    delay: 0.2
                  }}
                >
                  <img 
                    src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQq9KecbwW2M6DQssVwUmx-ohl0MDPRfliQ2g&s" 
                    alt="Design inspiration" 
                    className="w-full h-full object-cover"
                  />
                  <motion.div 
                    className="absolute inset-0 bg-pink/10 opacity-0 hover:opacity-100 transition-opacity duration-300 flex items-center justify-center"
                  >
                    <p className="text-white text-xs font-medium text-center">Design<br/>Inspiration</p>
                  </motion.div>
                </motion.div>

                <motion.div
                  className="absolute w-20 h-20 rounded-full overflow-hidden shadow-lg"
                  style={{ right: '15%', top: '25%' }}
                  drag
                  dragConstraints={constraintsRef}
                  whileHover={{ scale: 1.1, boxShadow: "0 0 20px rgba(255, 51, 102, 0.3)" }}
                  whileTap={{ scale: 0.95 }}
                  animate={{ 
                    y: [0, -10, 0],
                    rotate: [0, -5, 0],
                    boxShadow: [
                      "0 4px 6px rgba(0, 0, 0, 0.1)",
                      "0 10px 15px rgba(255, 51, 102, 0.2)",
                      "0 4px 6px rgba(0, 0, 0, 0.1)"
                    ]
                  }}
                  transition={{ 
                    duration: 5, 
                    repeat: Infinity, 
                    repeatType: "reverse",
                    delay: 0.7
                  }}
                >
                  <img 
                    src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTMbaZIX878wOsODMKTTfmbUpsQwU8RH0wkYw&s" 
                    alt="Fabric detail" 
                    className="w-full h-full object-cover"
                  />
                  <motion.div 
                    className="absolute inset-0 bg-pink/10 opacity-0 hover:opacity-100 transition-opacity duration-300 flex items-center justify-center"
                  >
                    <p className="text-white text-xs font-medium">Fabric</p>
                  </motion.div>
                </motion.div>

                <motion.div
                  className="absolute w-32 h-32 rounded-full overflow-hidden shadow-lg"
                  style={{ right: '20%', bottom: '15%' }}
                  drag
                  dragConstraints={constraintsRef}
                  whileHover={{ scale: 1.1, boxShadow: "0 0 20px rgba(255, 51, 102, 0.3)" }}
                  whileTap={{ scale: 0.95 }}
                  animate={{ 
                    y: [0, 15, 0],
                    rotate: [0, 8, 0],
                    boxShadow: [
                      "0 4px 6px rgba(0, 0, 0, 0.1)",
                      "0 10px 15px rgba(255, 51, 102, 0.2)",
                      "0 4px 6px rgba(0, 0, 0, 0.1)"
                    ]
                  }}
                  transition={{ 
                    duration: 6, 
                    repeat: Infinity, 
                    repeatType: "reverse",
                    delay: 0.5
                  }}
                >
                  <img 
                    src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRV0s5-SDhilyVRdDn-p6v0C5_K039Q_grnKw&s" 
                    alt="Custom attire" 
                    className="w-full h-full object-cover"
                  />
                  <motion.div 
                    className="absolute inset-0 bg-pink/10 opacity-0 hover:opacity-100 transition-opacity duration-300 flex items-center justify-center"
                  >
                    <p className="text-white text-xs font-medium">Custom<br/>Attire</p>
                  </motion.div>
                </motion.div>

                <motion.div
                  className="absolute w-28 h-28 rounded-full overflow-hidden shadow-lg"
                  style={{ left: '15%', bottom: '20%' }}
                  drag
                  dragConstraints={constraintsRef}
                  whileHover={{ scale: 1.1, boxShadow: "0 0 20px rgba(255, 51, 102, 0.3)" }}
                  whileTap={{ scale: 0.95 }}
                  animate={{ 
                    y: [0, 10, 0],
                    rotate: [0, -5, 0],
                    boxShadow: [
                      "0 4px 6px rgba(0, 0, 0, 0.1)",
                      "0 10px 15px rgba(255, 51, 102, 0.2)",
                      "0 4px 6px rgba(0, 0, 0, 0.1)"
                    ]
                  }}
                  transition={{ 
                    duration: 5.5, 
                    repeat: Infinity, 
                    repeatType: "reverse",
                    delay: 1
                  }}
                >
                  <img 
                    src="https://curiositysavestheplanet.com/wp-content/uploads/2021/05/Traditional-Clothing-and-Textile-Practices-from-India.png" 
                    alt="Tailoring process" 
                    className="w-full h-full object-cover"
                  />
                  <motion.div 
                    className="absolute inset-0 bg-pink/10 opacity-0 hover:opacity-100 transition-opacity duration-300 flex items-center justify-center"
                  >
                    <p className="text-white text-xs font-medium">Tailoring<br/>Process</p>
                  </motion.div>
                </motion.div>
              </div>
            </motion.div>

            {/* Right side - Text content with enhanced animations */}
            <motion.div
              variants={itemVariants}
              className="lg:pl-8"
            >
              <div className="mb-6">
                <motion.div 
                  className="inline-block px-4 py-1 bg-gradient-to-r from-pink/10 to-pink/20 text-pink text-sm font-medium rounded-full mb-3 border border-pink/10"
                  initial={{ x: -10, opacity: 0 }}
                  whileInView={{ x: 0, opacity: 1 }}
                  transition={{ delay: 0.3 }}
                  whileHover={{ 
                    scale: 1.05,
                    boxShadow: "0 0 20px rgba(255, 51, 102, 0.2)"
                  }}
                >
                  <motion.span
                    animate={{
                      opacity: [1, 0.7, 1]
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      repeatType: "reverse"
                    }}
                  >
                    ✨ Exclusive Service
                  </motion.span>
                </motion.div>
                
                <motion.h3 
                  className="text-2xl md:text-3xl font-medium text-gray-900 mb-4"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.4 }}
                >
                  From Photo to Fabric, We Create Your Vision
                </motion.h3>
                
                <motion.p 
                  className="text-gray-600 mb-6"
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  transition={{ duration: 0.5, delay: 0.5 }}
                >
                  Simply upload a photo of your dream outfit, and our master craftsmen and local artisans will bring it to life with precision and care. We preserve traditional techniques while adapting to your modern aesthetic.
                </motion.p>
                
                <div className="space-y-4 mb-8">
                  {[
                    { title: "Support Local Artisans", description: "Your custom orders help sustain traditional crafts and provide livelihoods to skilled artisans" },
                    { title: "Personalized Adjustments", description: "Perfect fit guaranteed with detailed measurements and personalized consultations" },
                    { title: "Quality Materials", description: "Handpicked fabrics and materials that meet our high standards of excellence" }
                  ].map((item, index) => (
                    <motion.div 
                      key={index}
                      className="flex items-start"
                      variants={featureItemVariants}
                      custom={index}
                      whileHover={{ x: 5 }}
                      transition={{ duration: 0.2 }}
                    >
                      <div className="flex-shrink-0 mt-1">
                        <motion.div 
                          className="w-4 h-4 rounded-full bg-pink/20 flex items-center justify-center"
                          whileHover={{ scale: 1.5, backgroundColor: "rgba(255, 51, 102, 0.3)" }}
                          transition={{ duration: 0.3 }}
                        >
                          <motion.div 
                            className="w-2 h-2 rounded-full bg-pink"
                            animate={{ 
                              scale: [1, 1.5, 1],
                            }}
                            transition={{ 
                              duration: 2,
                              repeat: Infinity,
                              repeatType: "reverse",
                              delay: index * 0.3
                            }}
                          />
                        </motion.div>
                      </div>
                      <div className="ml-3">
                        <h4 className="text-gray-900 font-medium">{item.title}</h4>
                        <p className="text-gray-600 text-sm">{item.description}</p>
                      </div>
                    </motion.div>
                  ))}
                </div>
                
                <Link 
                  to="/custom-design"
                  className="group inline-flex items-center"
                  onMouseEnter={() => setIsHovered(true)}
                  onMouseLeave={() => setIsHovered(false)}
                >
                  <motion.div 
                    className="relative overflow-hidden"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <div className="bg-pink text-white px-6 py-3 rounded-full font-medium inline-flex items-center group-hover:pr-12 transition-all duration-300 relative z-10">
                      Create Your Design
                      <motion.div 
                        className="absolute right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                        animate={isHovered ? { x: [20, 0] } : {}}
                        transition={{ duration: 0.3 }}
                      >
                        <ArrowLongRightIcon className="h-5 w-5 ml-2" />
                      </motion.div>
                    </div>
                    
                    {/* Button background animation */}
                    <motion.div 
                      className="absolute inset-0 rounded-full bg-gradient-to-r from-pink/80 to-pink opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                      animate={isHovered ? { 
                        background: [
                          "linear-gradient(to right, rgba(255, 51, 102, 0.8), rgba(255, 51, 102, 1))",
                          "linear-gradient(to right, rgba(255, 51, 102, 1), rgba(255, 51, 102, 0.8))",
                          "linear-gradient(to right, rgba(255, 51, 102, 0.8), rgba(255, 51, 102, 1))"
                        ]
                      } : {}}
                      transition={{ duration: 2, repeat: isHovered ? Infinity : 0 }}
                    />
                  </motion.div>
                </Link>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </motion.section>
  );
};

export default CustomDesignShowcase; 