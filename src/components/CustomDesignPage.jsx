import { motion, AnimatePresence, useScroll, useTransform } from 'framer-motion';
import { useState, useRef, useEffect } from 'react';
import { ArrowLeftIcon, ArrowRightIcon, PaperClipIcon, CheckCircleIcon, SparklesIcon } from '@heroicons/react/24/outline';

// Decorative SVG Elements
const DecorativePattern = () => (
  <svg className="absolute inset-0 w-full h-full z-0 opacity-30" width="100%" height="100%">
    <pattern id="pattern-circles" x="0" y="0" width="40" height="40" patternUnits="userSpaceOnUse" patternTransform="translate(20 20)">
      <circle cx="10" cy="10" r="1" fill="#ba1a5d" opacity="0.3" />
    </pattern>
    <rect width="100%" height="100%" fill="url(#pattern-circles)" />
  </svg>
);

const FloatingOrb = ({ delay, size, top, left, opacity, duration }) => (
  <motion.div
    className={`absolute rounded-full bg-gradient-to-br from-pink/40 to-pink/10 z-0 blur-xl`}
    style={{ width: size, height: size, top, left, opacity }}
    animate={{
      y: [0, -20, 0, 20, 0],
      x: [0, 15, 0, -15, 0],
      scale: [1, 1.1, 1, 0.9, 1],
    }}
    transition={{
      duration,
      repeat: Infinity,
      repeatType: "loop",
      delay,
    }}
  />
);

const CustomDesignPage = () => {
  const [activeStep, setActiveStep] = useState(1);
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [imagePreview, setImagePreview] = useState(null);
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef(null);
  const pageRef = useRef(null);
  
  const { scrollYProgress } = useScroll({
    target: pageRef,
    offset: ["start start", "end start"]
  });
  
  const headerOpacity = useTransform(scrollYProgress, [0, 0.2], [1, 0]);
  const headerY = useTransform(scrollYProgress, [0, 0.2], [0, -50]);
  
  const steps = [
    { id: 1, name: 'Upload Design' },
    { id: 2, name: 'Requirements' },
    { id: 3, name: 'Finish' }
  ];
  
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };
  
  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };
  
  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };
  
  const handleSubmit = (e) => {
    e.preventDefault();
    // In a real application, you would handle the form submission here
    setFormSubmitted(true);
    nextStep();
  };
  
  const nextStep = () => {
    setActiveStep(prev => Math.min(prev + 1, 3));
  };
  
  const prevStep = () => {
    setActiveStep(prev => Math.max(prev - 1, 1));
  };

  // Animation variants
  const fadeIn = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0, transition: { duration: 0.6 } },
    exit: { opacity: 0, y: -20, transition: { duration: 0.3 } }
  };
  
  const staggerContainer = {
    animate: { transition: { staggerChildren: 0.1 } }
  };
  
  const imageHoverAnimation = {
    rest: { scale: 1 },
    hover: { scale: 1.05, transition: { duration: 0.3 } }
  };

  return (
    <motion.div 
      ref={pageRef}
      className="min-h-screen bg-gradient-to-b from-gray-50 via-white to-gray-50 py-16 px-4 sm:px-6 lg:px-8 relative overflow-hidden"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
    >
      {/* Background decorative elements */}
      <DecorativePattern />
      <FloatingOrb delay={0} size="300px" top="5%" left="5%" opacity={0.4} duration={20} />
      <FloatingOrb delay={5} size="400px" top="60%" left="85%" opacity={0.3} duration={25} />
      <FloatingOrb delay={2} size="250px" top="80%" left="15%" opacity={0.2} duration={18} />
      
      <div className="max-w-5xl mx-auto relative z-10">
        {/* Enhanced Page Header */}
        <motion.div 
          className="text-center mb-16"
          style={{ opacity: headerOpacity, y: headerY }}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="inline-flex items-center justify-center mb-6"
          >
            <motion.div 
              className="relative"
              animate={{ rotate: 360 }}
              transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
            >
              <div className="absolute inset-0 rounded-full bg-gradient-to-r from-pink/30 to-purple-400/30 blur-md" />
              <div className="relative bg-white/80 backdrop-blur-sm rounded-full p-3 shadow-md">
                <SparklesIcon className="h-8 w-8 text-pink" />
              </div>
            </motion.div>
          </motion.div>
          
          <motion.h1 
            className="text-4xl md:text-5xl font-bold text-gray-900 mb-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            Design Your Dream <span className="text-pink relative inline-block">
              Ethnic Wear
              <motion.span 
                className="absolute -bottom-1 left-0 h-1 bg-pink/40 rounded-full" 
                initial={{ width: 0 }}
                animate={{ width: "100%" }}
                transition={{ duration: 1, delay: 1 }}
              />
            </span>
          </motion.h1>
          
          <motion.p 
            className="text-lg text-gray-600 max-w-2xl mx-auto"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.5 }}
          >
            Upload your inspiration and let our skilled artisans bring your perfect outfit to life, 
            blending tradition with your personal style.
          </motion.p>
        </motion.div>
        
        {/* Enhanced Steps Progress - Perfect Alignment */}
        <motion.div 
          className="relative mb-16"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.6 }}
        >
          {/* Decorative animated elements */}
          <motion.div 
            className="absolute -top-10 -left-10 w-40 h-40 z-0 opacity-20"
            animate={{ 
              rotate: 360,
              scale: [1, 1.1, 1]
            }}
            transition={{ 
              rotate: { duration: 20, repeat: Infinity, ease: "linear" },
              scale: { duration: 5, repeat: Infinity, repeatType: "reverse" }
            }}
          >
            <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
              <path fill="#FF3366" d="M39.9,-65.8C52.4,-60.5,63.8,-51.2,71.8,-39.2C79.8,-27.1,84.3,-13.6,83.2,-0.7C82.2,12.3,75.4,24.5,67.4,35.3C59.3,46.1,49.9,55.5,38.7,62.8C27.5,70.1,14.3,75.1,0.6,74.2C-13.2,73.2,-26.5,66.3,-37.9,58.2C-49.4,50.1,-59.1,40.8,-65.3,29.5C-71.5,18.1,-74.2,4.6,-73.6,-8.9C-73,-22.5,-69.1,-36.2,-60.8,-45.9C-52.6,-55.6,-40,-61.3,-27.9,-66.6C-15.8,-71.9,-3.9,-77,8.1,-76.3C20.1,-75.7,27.5,-71.1,39.9,-65.8Z" transform="translate(100 100)" />
            </svg>
          </motion.div>
          
          <motion.div 
            className="absolute -bottom-20 -right-20 w-60 h-60 z-0 opacity-10"
            animate={{ 
              rotate: -360,
              scale: [1, 1.2, 1]
            }}
            transition={{ 
              rotate: { duration: 30, repeat: Infinity, ease: "linear" },
              scale: { duration: 8, repeat: Infinity, repeatType: "reverse" }
            }}
          >
            <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
              <path fill="#FF3366" d="M42.8,-75.1C56.9,-68.1,70.8,-59.2,78.1,-46.4C85.3,-33.6,85.9,-16.8,84.2,-1C82.6,14.8,78.6,29.7,71.3,43.2C64,56.8,53.2,69.1,39.8,76.4C26.4,83.8,10.4,86.2,-4.4,83.6C-19.3,81.1,-33.9,73.5,-45.5,63.4C-57.1,53.3,-65.7,40.5,-72.6,26.2C-79.5,11.9,-84.8,-3.9,-82.7,-18.8C-80.5,-33.7,-71,-47.6,-58.7,-55.8C-46.4,-64,-30.2,-66.3,-15.7,-73.4C-1.1,-80.5,12.8,-92.5,26.7,-90C40.6,-87.6,51.3,-70.6,42.8,-75.1Z" transform="translate(100 100)" />
            </svg>
          </motion.div>
          
          {/* Container for progress bar */}
          <div className="max-w-4xl mx-auto px-4 relative">
            <motion.div
              className="absolute -top-16 left-1/2 transform -translate-x-1/2 text-center"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.9, duration: 0.6 }}
            >
              <span className="text-sm font-medium text-gray-500 bg-white px-4 py-1 rounded-full shadow-sm border border-gray-100">
                {activeStep === 1 ? "Let's get started" : activeStep === 2 ? "Almost there" : "Complete!"}
                        </span>
            </motion.div>
            
            {/* Progress track with perfectly aligned steps */}
            <div className="relative pt-5 pb-12">
              {/* Main horizontal line with gradient and shadow */}
              <div className="absolute top-5 left-0 w-full h-1.5 bg-gray-200 rounded-full shadow-inner"></div>
              
              {/* Animated filled progress line with gradient */}
              <motion.div 
                className="absolute top-5 left-0 h-1.5 bg-gradient-to-r from-pink-400 via-pink to-purple-400 rounded-full shadow-sm"
                initial={{ width: 0 }}
                animate={{ width: `${((activeStep - 1) / (steps.length - 1)) * 100}%` }}
                transition={{ duration: 0.8, delay: 0.3, ease: "easeOut" }}
              />
              
              {/* Animated progress indicator */}
              <motion.div
                className="absolute top-5 z-20"
                style={{ 
                  left: `${((activeStep - 1) / (steps.length - 1)) * 100}%`,
                  translateX: '-50%'
                }}
                initial={{ scale: 0 }}
                animate={{ 
                  scale: [0, 1.2, 1],
                  boxShadow: ["0px 0px 0px rgba(255, 51, 102, 0)", "0px 0px 20px rgba(255, 51, 102, 0.5)", "0px 0px 10px rgba(255, 51, 102, 0.3)"]
                }}
                transition={{ duration: 0.8, delay: 0.5 }}
              >
                <div className="w-3 h-3 bg-pink rounded-full"></div>
              </motion.div>
              
              {/* Steps with indicators perfectly positioned over the line */}
              <div className="relative flex justify-between mt-6">
                {steps.map((step, index) => {
                  const isCompleted = activeStep > step.id;
                  const isCurrent = activeStep === step.id;
                  
                  return (
                    <motion.div 
                      key={step.id} 
                      className="flex flex-col items-center cursor-pointer group" 
                      style={{ width: `${100 / steps.length}%` }}
                      onClick={() => setActiveStep(step.id)}
                      whileHover={{ scale: 1.05 }}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.2 + (index * 0.1), duration: 0.5 }}
                    >
                      <div className="flex items-center justify-center relative">
                        {/* Connector lines between steps with animated gradient */}
                        {index > 0 && (
                          <div className="absolute right-1/2 top-1/2 w-full h-0.5 bg-gray-200 -z-10" />
                        )}
                        
                        {/* Animated tooltip on hover */}
                        <motion.div
                          className="absolute -top-12 opacity-0 group-hover:opacity-100 bg-white px-3 py-1.5 rounded-lg shadow-lg text-xs font-medium z-30 pointer-events-none"
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 0, y: 10 }}
                          whileHover={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.2 }}
                        >
                          {isCompleted ? "Completed" : isCurrent ? "In Progress" : "Upcoming"}
                          <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-1/2 rotate-45 w-2 h-2 bg-white"></div>
                        </motion.div>
                        
                        {/* Step circle with enhanced animations */}
                        <motion.div
                          className={`
                            relative z-10 flex h-10 w-10 items-center justify-center rounded-full border-2 
                            ${isCompleted 
                              ? 'bg-gradient-to-br from-pink to-pink-600 border-pink' 
                              : isCurrent 
                                ? 'bg-white border-pink' 
                                : 'bg-white border-gray-300 group-hover:border-pink/50'
                            }
                          `}
                          whileHover={{ 
                            scale: 1.1, 
                            boxShadow: "0 0 15px rgba(255, 51, 102, 0.4)",
                            transition: { duration: 0.2 }
                          }}
                        >
                          {isCompleted ? (
                            <motion.div
                              initial={{ scale: 0, rotate: -90 }}
                              animate={{ scale: 1, rotate: 0 }}
                              transition={{ 
                                type: "spring", 
                                stiffness: 200, 
                                damping: 10,
                                delay: 0.1
                              }}
                            >
                              <CheckCircleIcon className="h-6 w-6 text-white" />
                            </motion.div>
                          ) : (
                            <motion.div
                              className={`flex items-center justify-center ${isCurrent ? 'text-pink' : 'text-gray-400 group-hover:text-gray-600'}`}
                              animate={isCurrent ? { 
                                scale: [1, 1.1, 1],
                              } : {}}
                              transition={{ 
                                duration: 1.5,
                                repeat: isCurrent ? Infinity : 0,
                                repeatType: "reverse"
                              }}
                            >
                              <span className="text-sm font-medium">{step.id}</span>
                            </motion.div>
                          )}
                          
                          {/* Enhanced pulsing animation for current step */}
                          {isCurrent && (
                            <>
                              <motion.div
                                className="absolute inset-0 rounded-full border-2 border-pink"
                                animate={{ 
                                  scale: [1, 1.2, 1],
                                  opacity: [1, 0.5, 1]
                                }}
                                transition={{ 
                                  duration: 2,
                                  repeat: Infinity,
                                  repeatType: "reverse"
                                }}
                              />
                              <motion.div
                                className="absolute inset-0 rounded-full border-2 border-pink"
                                animate={{ 
                                  scale: [1, 1.4, 1],
                                  opacity: [0.8, 0.2, 0.8]
                                }}
                                transition={{ 
                                  duration: 2.5,
                                  delay: 0.2,
                                  repeat: Infinity,
                                  repeatType: "reverse"
                                }}
                              />
                            </>
                          )}
                        </motion.div>
                    </div>
                      
                      {/* Step name with enhanced styling and animations */}
                      <div className="mt-3 text-center px-1">
                        <motion.div 
                          className={`
                            text-sm font-medium relative px-3 py-1 rounded-full
                            ${isCompleted 
                              ? 'text-pink' 
                              : isCurrent 
                                ? 'text-gray-800'
                                : 'text-gray-400 group-hover:text-gray-600'
                            }
                            ${isCurrent ? 'bg-pink/5' : 'group-hover:bg-gray-50'}
                          `}
                          whileHover={{ y: -2 }}
                        >
                          {step.name}
                          {isCompleted && (
                            <motion.div 
                              className="absolute bottom-0 left-0 h-0.5 bg-pink/30 w-full"
                              initial={{ width: 0 }}
                              animate={{ width: "100%" }}
                              transition={{ duration: 0.3, delay: 0.1 }}
                            />
                          )}
                        </motion.div>
                    </div>
                      
                      {/* Step details on hover */}
                      <motion.div
                        className="absolute top-20 opacity-0 group-hover:opacity-100 bg-white p-3 rounded-lg shadow-lg text-xs w-40 z-20 pointer-events-none"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 0, y: 10 }}
                        whileHover={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.2 }}
                      >
                        <p className="font-medium text-gray-800 mb-1">{step.name}</p>
                        <p className="text-gray-500">
                          {step.id === 1 
                            ? "Upload your design inspiration image" 
                            : step.id === 2 
                              ? "Tell us your custom requirements" 
                              : "Review and confirm your request"}
                        </p>
                        {isCompleted && (
                          <p className="text-green-500 mt-1 flex items-center">
                            <CheckCircleIcon className="h-3 w-3 mr-1" /> Completed
                          </p>
                        )}
                      </motion.div>
                    </motion.div>
                  );
                })}
                    </div>
        </div>
        
            {/* Mini help tooltip */}
            <motion.div 
              className="absolute -bottom-6 right-0 text-xs text-gray-400 flex items-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.2 }}
              whileHover={{ scale: 1.05, color: "#FF3366" }}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>Click any step to navigate</span>
            </motion.div>
          </div>
        </motion.div>
        
        {/* Main Content with enhanced container */}
        <motion.div 
          className="bg-white shadow-xl rounded-2xl overflow-hidden border border-gray-100"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.8 }}
        >
          {/* Step 1: Upload Design */}
          {activeStep === 1 && (
            <div className="p-6 sm:p-10">
              <motion.h2 
                className="text-2xl font-bold text-gray-900 mb-6"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5 }}
              >
                Upload Your Design Inspiration
              </motion.h2>
              
              <motion.div 
                className="space-y-8"
                variants={staggerContainer}
                initial="initial"
                animate="animate"
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                  <motion.div
                    variants={fadeIn}
                  >
                    <label className="block text-sm font-medium text-gray-700 mb-3">
                      Share a photo of your desired outfit
                    </label>
                    
                    <div 
                      className={`relative mt-1 flex flex-col justify-center px-6 pt-8 pb-10 border-2 ${dragActive ? 'border-pink bg-pink/5' : 'border-dashed'} rounded-xl h-80 ${imagePreview ? 'border-pink/30 bg-pink/5' : 'border-gray-300 hover:border-pink/30 bg-gray-50/80'} transition-all duration-300`}
                      onClick={() => fileInputRef.current.click()}
                      onDragEnter={handleDrag}
                      onDragLeave={handleDrag}
                      onDragOver={handleDrag}
                      onDrop={handleDrop}
                    >
                      {!imagePreview && (
                        <motion.div
                          className="absolute inset-0 rounded-xl pointer-events-none"
                          animate={{
                            boxShadow: dragActive 
                              ? '0 0 0 3px rgba(255,51,102,0.3)' 
                              : '0 0 0 0 rgba(255,51,102,0)'
                          }}
                          transition={{ duration: 0.3 }}
                        />
                      )}
                      
                      <div className="space-y-2 text-center relative z-10">
                        {imagePreview ? (
                          <motion.div 
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ duration: 0.5 }}
                            className="relative"
                          >
                            <img 
                              src={imagePreview} 
                              alt="Design preview" 
                              className="mx-auto max-h-60 w-auto object-contain rounded-lg shadow-md"
                            />
                            <motion.div 
                              className="absolute bottom-0 left-1/2 transform -translate-x-1/2 -mb-4 bg-pink text-white text-sm px-3 py-1 rounded-full shadow-md"
                              initial={{ opacity: 0, y: 10 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ delay: 0.5 }}
                            >
                              <CheckCircleIcon className="inline-block h-4 w-4 mr-1 -mt-0.5" /> Image uploaded
                            </motion.div>
                            <motion.button
                              type="button"
                              className="absolute top-2 right-2 bg-white rounded-full p-1.5 shadow-md border border-gray-200"
                              onClick={(e) => {
                                e.stopPropagation();
                                setImagePreview(null);
                              }}
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.95 }}
                            >
                              <svg className="h-4 w-4 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                              </svg>
                            </motion.button>
                          </motion.div>
                        ) : (
                          <>
                            <motion.div
                              initial={{ opacity: 0, scale: 0.9 }}
                              animate={{ opacity: 1, scale: 1 }}
                              transition={{ duration: 0.5 }}
                              className="mx-auto flex items-center justify-center h-20 w-20 rounded-full bg-pink/10"
                            >
                              <svg
                                className="h-12 w-12 text-pink/70"
                              stroke="currentColor"
                              fill="none"
                              viewBox="0 0 48 48"
                              aria-hidden="true"
                            >
                              <path
                                d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                                strokeWidth={2}
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              />
                            </svg>
                            </motion.div>
                            
                            <div className="flex flex-col items-center text-center">
                              <motion.p 
                                className="text-gray-700 font-medium"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 0.3 }}
                              >
                                <span className="text-pink">Click to upload</span> or drag and drop
                              </motion.p>
                              
                              <motion.p 
                                className="text-xs text-gray-500 mt-1"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 0.4 }}
                              >
                                PNG, JPG or GIF (max. 10MB)
                              </motion.p>
                              
                              <input
                                type="file"
                                className="sr-only"
                                accept="image/*"
                                ref={fileInputRef}
                                onChange={handleFileChange}
                              />
                              
                              <motion.p 
                                className="mt-4 text-gray-500 text-sm max-w-xs"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 0.5 }}
                              >
                                Upload an image of the ethnic wear design you'd like us to create for you
                              </motion.p>
                            </div>
                          </>
                        )}
                      </div>
                    </div>
                    
                    {/* Image tips */}
                    {!imagePreview && (
                      <motion.div 
                        className="mt-4 text-xs text-gray-500 space-y-1"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.6 }}
                      >
                        <p className="flex items-center">
                          <svg className="h-3 w-3 mr-1 text-pink" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                          </svg>
                          Clear, well-lit photos work best
                        </p>
                        <p className="flex items-center">
                          <svg className="h-3 w-3 mr-1 text-pink" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                          </svg>
                          Include multiple angles if available
                        </p>
                      </motion.div>
                    )}
                  </motion.div>
                  
                  <motion.div
                    variants={fadeIn}
                    className="flex flex-col justify-center"
                  >
                    <motion.h3 
                      className="text-lg font-medium text-gray-900 mb-4"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.3 }}
                    >
                      Why Share Your Inspiration?
                    </motion.h3>
                    
                    <ul className="space-y-4">
                      {[
                        "Our artisans can see exactly what you envision",
                        "We can match the style, color, and pattern as closely as possible",
                        "Get personalized suggestions for fabric and embellishments",
                        "Helps us understand your aesthetic preferences"
                      ].map((item, index) => (
                        <motion.li 
                          key={index}
                          className="flex items-start"
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.4 + (index * 0.1) }}
                          whileHover={{ x: 5 }}
                        >
                          <div className="flex-shrink-0">
                            <div className="flex items-center justify-center h-6 w-6 rounded-full bg-pink/10">
                              <svg className="h-4 w-4 text-pink" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                            </div>
                          </div>
                          <p className="ml-3 text-gray-600">{item}</p>
                        </motion.li>
                      ))}
                    </ul>
                    
                    <motion.p 
                      className="mt-6 text-sm text-gray-500 italic border-l-2 border-pink/20 pl-3"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.8 }}
                    >
                      "The more details you provide, the better we can bring your vision to life."
                    </motion.p>
                  </motion.div>
                </div>
              </motion.div>
              
              <motion.div 
                className="mt-10 flex justify-end"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.9 }}
              >
                <motion.button
                  type="button"
                  onClick={nextStep}
                  disabled={!imagePreview}
                  className={`flex items-center px-8 py-3 border border-transparent text-base font-medium rounded-xl shadow-md ${
                    imagePreview 
                      ? 'bg-gradient-to-r from-pink to-pink/90 text-white hover:shadow-lg' 
                      : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                  } transition-all duration-300`}
                  whileHover={imagePreview ? { scale: 1.03 } : {}}
                  whileTap={imagePreview ? { scale: 0.98 } : {}}
                >
                  Next Step
                  <ArrowRightIcon className="ml-2 h-5 w-5" />
                </motion.button>
              </motion.div>
              </div>
          )}
          
          {/* Step 2: Requirements */}
          {activeStep === 2 && (
            <motion.div 
              className="p-8"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <h2 className="text-xl font-semibold mb-6">Tell Us About Your Requirements</h2>
              
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="occasion" className="block text-sm font-medium text-gray-700 mb-2">
                      Occasion
                    </label>
                    <select
                      id="occasion"
                      name="occasion"
                      className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-pink focus:border-pink rounded-md"
                      defaultValue=""
                    >
                      <option value="" disabled>Select occasion</option>
                      <option>Wedding</option>
                      <option>Festival</option>
                      <option>Corporate Event</option>
                      <option>Casual Wear</option>
                      <option>Formal Event</option>
                      <option>Other</option>
                    </select>
                  </div>
                  
                  <div>
                    <label htmlFor="budget" className="block text-sm font-medium text-gray-700 mb-2">
                      Budget Range (₹)
                    </label>
                    <select
                      id="budget"
                      name="budget"
                      className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-pink focus:border-pink rounded-md"
                      defaultValue=""
                    >
                      <option value="" disabled>Select budget range</option>
                      <option>₹2,000 - ₹5,000</option>
                      <option>₹5,000 - ₹10,000</option>
                      <option>₹10,000 - ₹20,000</option>
                      <option>₹20,000 - ₹50,000</option>
                      <option>Above ₹50,000</option>
                    </select>
                  </div>
                  
                  <div className="md:col-span-2">
                    <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
                      Additional Details
                    </label>
                    <textarea
                      id="description"
                      name="description"
                      rows={4}
                      className="shadow-sm focus:ring-pink focus:border-pink block w-full sm:text-sm border-gray-300 rounded-md"
                      placeholder="Please provide any specific details about your design preferences, modifications, or special requirements..."
                    />
                  </div>
                </div>
                
                <div className="border-t border-gray-200 pt-6">
                  <h3 className="text-lg font-medium text-gray-900 mb-3">Your Information</h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                        Full Name
                      </label>
                      <input
                        type="text"
                        id="name"
                        name="name"
                        className="shadow-sm focus:ring-pink focus:border-pink block w-full sm:text-sm border-gray-300 rounded-md"
                      />
                    </div>
                    
                    <div>
                      <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                        Email Address
                      </label>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        className="shadow-sm focus:ring-pink focus:border-pink block w-full sm:text-sm border-gray-300 rounded-md"
                      />
                    </div>
                    
                    <div>
                      <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
                        Phone Number
                      </label>
                      <input
                        type="tel"
                        id="phone"
                        name="phone"
                        className="shadow-sm focus:ring-pink focus:border-pink block w-full sm:text-sm border-gray-300 rounded-md"
                      />
                    </div>
                  </div>
                </div>
                
                <div className="flex justify-between pt-5">
                  <button
                    type="button"
                    onClick={prevStep}
                    className="flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                  >
                    <ArrowLeftIcon className="mr-2 h-5 w-5" />
                    Back
                  </button>
                  <button
                    type="submit"
                    className="flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm bg-pink text-white hover:bg-pink/90"
                  >
                    Submit Request
                  </button>
                </div>
              </form>
            </motion.div>
          )}
          
          {/* Step 3: Enhanced Confirmation */}
          {activeStep === 3 && (
            <div className="p-6 sm:p-10">
            <motion.div 
                className="text-center max-w-2xl mx-auto"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
                transition={{ duration: 0.6 }}
              >
                <motion.div
                  className="relative mx-auto mb-8"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ 
                    type: "spring",
                    stiffness: 200,
                    damping: 15,
                    delay: 0.2 
                  }}
                >
                  <motion.div 
                    className="absolute inset-0 rounded-full bg-green-500 opacity-20"
                    animate={{ 
                      scale: [1, 1.2, 1],
                      opacity: [0.2, 0.3, 0.2]
                    }}
                    transition={{ 
                      duration: 3,
                      repeat: Infinity,
                      repeatType: "reverse"
                    }}
                  />
                  <div className="relative flex items-center justify-center h-20 w-20 rounded-full bg-gradient-to-br from-green-400 to-green-600 mx-auto shadow-lg">
                    <motion.div
                      initial={{ rotate: 0, scale: 0 }}
                      animate={{ rotate: 360, scale: 1 }}
                      transition={{ duration: 0.7, delay: 0.4 }}
                    >
                      <CheckCircleIcon className="h-12 w-12 text-white" />
                    </motion.div>
              </div>
                </motion.div>
                
                <motion.h2 
                  className="text-3xl font-bold text-gray-900 mb-4"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5, duration: 0.6 }}
                >
                  <span className="text-green-600">Thank You</span> for Your Request!
                </motion.h2>
                
                <motion.p 
                  className="text-gray-600 mb-10"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.6, duration: 0.6 }}
                >
                  Our design team has received your custom outfit request. We'll contact you within 
                  <span className="font-medium"> 24-48 hours </span> 
                  to discuss your design in detail.
                </motion.p>
                
                <motion.div 
                  className="bg-gradient-to-br from-gray-50 to-white p-8 rounded-2xl shadow-sm border border-gray-100 mb-10"
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.7, duration: 0.6 }}
                >
                  <motion.h3 
                    className="text-xl font-medium text-gray-900 mb-6 flex items-center justify-center"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.8 }}
                  >
                    <span className="bg-pink/10 text-pink p-1.5 rounded-lg mr-2">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                      </svg>
                    </span>
                    What Happens Next?
                  </motion.h3>
                  
                  <div className="grid gap-6 md:grid-cols-5">
                    {[
                      { 
                        title: "Design Review", 
                        description: "Our designers review your request and inspiration photo",
                        icon: (
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                          </svg>
                        )
                      },
                      { 
                        title: "Consultation Call", 
                        description: "We'll discuss details, fabric options, and pricing",
                        icon: (
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                          </svg>
                        )
                      },
                      { 
                        title: "Crafting Process", 
                        description: "Our artisans begin creating your custom design",
                        icon: (
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
                          </svg>
                        )
                      },
                      { 
                        title: "Progress Updates", 
                        description: "We'll provide updates throughout the process",
                        icon: (
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                        )
                      },
                      { 
                        title: "Delivery", 
                        description: "Your finished piece delivered to your doorstep",
                        icon: (
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path d="M9 17a2 2 0 11-4 0 2 2 0 014 0zM19 17a2 2 0 11-4 0 2 2 0 014 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10a1 1 0 001 1h1m8-1a1 1 0 01-1 1H9m4-1V8a1 1 0 011-1h2.586a1 1 0 01.707.293l3.414 3.414a1 1 0 01.293.707V16a1 1 0 01-1 1h-1m-6-1a1 1 0 001 1h1M5 17a2 2 0 104 0m-4 0a2 2 0 114 0m6 0a2 2 0 104 0m-4 0a2 2 0 114 0" />
                          </svg>
                        )
                      },
                  ].map((step, index) => (
                      <motion.div
                        key={index}
                        className="flex flex-col items-center text-center"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ 
                          delay: 0.9 + (index * 0.1),
                          duration: 0.5 
                        }}
                      >
                        <motion.div 
                          className="flex items-center justify-center h-12 w-12 rounded-full bg-pink/10 text-pink mb-3"
                          whileHover={{ scale: 1.1, backgroundColor: "rgba(255, 51, 102, 0.2)" }}
                          transition={{ duration: 0.2 }}
                        >
                          {step.icon}
                        </motion.div>
                        <h4 className="font-medium text-gray-900 mb-1">{step.title}</h4>
                        <p className="text-sm text-gray-600">{step.description}</p>
                        
                        {index < 4 && (
                          <div className="hidden md:block absolute right-0 top-1/2 transform -translate-y-1/2 translate-x-1/2">
                            <svg className="h-5 w-5 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                            </svg>
                          </div>
                        )}
                      </motion.div>
                    ))}
              </div>
                </motion.div>
                
                <motion.div
                  className="flex flex-col md:flex-row items-center justify-center gap-6"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 1.4, duration: 0.6 }}
                >
                  <motion.a
                  href="/"
                    className="inline-flex items-center px-8 py-3 border border-transparent text-base font-medium rounded-xl shadow-md bg-pink text-white hover:bg-pink/90 transition-all duration-300"
                    whileHover={{ scale: 1.03, boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)" }}
                    whileTap={{ scale: 0.98 }}
                >
                  Return to Homepage
                  </motion.a>
                  
                  <div className="text-gray-500 text-sm">
                    Have questions? Email us at <a href="mailto:support@dharika.com" className="text-pink hover:underline">support@dharika.com</a>
              </div>
            </motion.div>
              </motion.div>
            </div>
          )}
        </motion.div>
      </div>
    </motion.div>
  );
};

export default CustomDesignPage; 