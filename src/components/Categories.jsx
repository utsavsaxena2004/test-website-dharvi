import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { supabaseService } from '../services/supabaseService';

// Updated color map to match design template colors
const colorMap = {
  'Sarees': { color: '#6f0e06', lightColor: 'bg-rose-50/80' }, // Traditional Paisley template
  'Lehengas': { color: '#B45309', lightColor: 'bg-amber-50/80' }, // Royal Mandala template (amber)
  'Suits': { color: '#1a56ba', lightColor: 'bg-blue-50/80' }, // Contemporary Floral template
  'Kurtis': { color: '#0F766E', lightColor: 'bg-emerald-50/80' }, // Elegant Geometric template
  'default': { color: '#6f0e06', lightColor: 'bg-rose-50/80' }
};

// Design template color schemes (matching DynamicCategorySection)
const designTemplateColors = {
  'traditional': { color: '#6f0e06', lightColor: 'bg-rose-50/80' }, // Rose theme
  'royal': { color: '#B45309', lightColor: 'bg-amber-50/80' }, // Amber theme (matches Lehengas)
  'contemporary': { color: '#1a56ba', lightColor: 'bg-blue-50/80' }, // Blue theme
  'elegant': { color: '#0F766E', lightColor: 'bg-emerald-50/80' }, // Emerald theme
  'default': { color: '#6f0e06', lightColor: 'bg-rose-50/80' }
};

// Create SVG patterns for background elements
const patterns = {
  paisley: (
    <svg width="80" height="80" viewBox="0 0 80 80" className="opacity-10">
      <path d="M30,10 Q50,0 60,20 T70,40 Q50,70 30,50 T10,30 Q20,20 30,10" fill="currentColor" />
    </svg>
  ),
  mandala: (
    <svg width="120" height="120" viewBox="0 0 120 120" className="opacity-10">
      <circle cx="60" cy="60" r="50" fill="none" stroke="currentColor" strokeWidth="1" />
      <circle cx="60" cy="60" r="40" fill="none" stroke="currentColor" strokeWidth="1" />
      <circle cx="60" cy="60" r="30" fill="none" stroke="currentColor" strokeWidth="1" />
      <circle cx="60" cy="60" r="20" fill="none" stroke="currentColor" strokeWidth="1" />
      <path d="M60,10 L60,110 M10,60 L110,60 M25,25 L95,95 M25,95 L95,25" stroke="currentColor" strokeWidth="0.5" />
    </svg>
  )
};

const decorativeElements = {
  corner: (
    <svg width="80" height="80" viewBox="0 0 80 80" className="opacity-20 absolute text-pink">
      <path d="M0,0 Q40,0 40,40 Q40,80 80,80" fill="none" stroke="currentColor" strokeWidth="1" />
      <path d="M10,0 Q45,5 45,45 Q45,75 75,75" fill="none" stroke="currentColor" strokeWidth="1" />
      <path d="M20,0 Q50,10 50,50 Q50,70 70,70" fill="none" stroke="currentColor" strokeWidth="1" />
    </svg>
  ),
  flower: (
    <svg width="50" height="50" viewBox="0 0 50 50" className="opacity-20 absolute text-pink">
      <path d="M25,10 Q35,20 25,30 Q15,20 25,10" fill="currentColor" />
      <path d="M10,25 Q20,35 30,25 Q20,15 10,25" fill="currentColor" />
      <path d="M25,40 Q35,30 25,20 Q15,30 25,40" fill="currentColor" />
      <path d="M40,25 Q30,35 20,25 Q30,15 40,25" fill="currentColor" />
      <circle cx="25" cy="25" r="5" fill="currentColor" />
    </svg>
  ),
  lotus: (
    <svg width="70" height="70" viewBox="0 0 70 70" className="opacity-15 absolute text-pink">
      <path d="M35,10 Q45,15 50,25 Q55,35 50,45 Q45,55 35,60 Q25,55 20,45 Q15,35 20,25 Q25,15 35,10" fill="none" stroke="currentColor" strokeWidth="0.8" />
      <path d="M35,15 Q43,19 47,27 Q51,35 47,43 Q43,51 35,55 Q27,51 23,43 Q19,35 23,27 Q27,19 35,15" fill="none" stroke="currentColor" strokeWidth="0.8" />
      <path d="M35,20 Q41,23 44,29 Q47,35 44,41 Q41,47 35,50 Q29,47 26,41 Q23,35 26,29 Q29,23 35,20" fill="none" stroke="currentColor" strokeWidth="0.8" />
      <circle cx="35" cy="35" r="5" fill="none" stroke="currentColor" strokeWidth="0.8" />
    </svg>
  ),
  rangoli: (
    <svg width="100" height="100" viewBox="0 0 100 100" className="opacity-15 absolute text-pink">
      <circle cx="50" cy="50" r="40" fill="none" stroke="currentColor" strokeWidth="0.5" />
      <path d="M50,10 L50,90 M10,50 L90,50" stroke="currentColor" strokeWidth="0.5" />
      <path d="M22,22 L78,78 M22,78 L78,22" stroke="currentColor" strokeWidth="0.5" />
      <path d="M50,10 Q65,25 50,40 Q35,25 50,10" fill="none" stroke="currentColor" strokeWidth="0.8" />
      <path d="M50,90 Q65,75 50,60 Q35,75 50,90" fill="none" stroke="currentColor" strokeWidth="0.8" />
      <path d="M10,50 Q25,65 40,50 Q25,35 10,50" fill="none" stroke="currentColor" strokeWidth="0.8" />
      <path d="M90,50 Q75,65 60,50 Q75,35 90,50" fill="none" stroke="currentColor" strokeWidth="0.8" />
    </svg>
  ),
  peacock: (
    <svg width="80" height="120" viewBox="0 0 80 120" className="opacity-20 absolute text-pink">
      <path d="M40,80 Q50,65 40,50 Q30,65 40,80" fill="none" stroke="currentColor" strokeWidth="0.8" />
      <path d="M40,80 Q60,70 70,80 Q60,90 40,80" fill="none" stroke="currentColor" strokeWidth="0.8" />
      <path d="M40,80 Q65,60 70,40 Q55,60 40,80" fill="none" stroke="currentColor" strokeWidth="0.8" />
      <path d="M40,80 Q55,40 40,20 Q25,40 40,80" fill="none" stroke="currentColor" strokeWidth="0.8" />
      <path d="M40,80 Q20,65 10,80 Q20,90 40,80" fill="none" stroke="currentColor" strokeWidth="0.8" />
      <path d="M40,80 Q15,60 10,40 Q25,60 40,80" fill="none" stroke="currentColor" strokeWidth="0.8" />
      <path d="M40,80 L40,110" stroke="currentColor" strokeWidth="1.2" />
      <circle cx="40" cy="80" r="5" fill="none" stroke="currentColor" strokeWidth="0.8" />
    </svg>
  ),
  borderDesign: (
    <div className="absolute inset-x-0 h-8 opacity-20">
      <div className="h-full w-full flex items-center justify-center">
        <div className="w-full h-[1px] bg-pink"></div>
        <div className="flex-shrink-0 mx-4">
          <svg width="120" height="8" viewBox="0 0 120 8" className="text-pink">
            <path d="M0,4 H120 M20,1 L30,4 L20,7 M40,1 L50,4 L40,7 M60,1 L70,4 L60,7 M80,1 L90,4 L80,7 M100,1 L110,4 L100,7" stroke="currentColor" strokeWidth="0.5" fill="none" />
          </svg>
        </div>
        <div className="w-full h-[1px] bg-pink"></div>
      </div>
    </div>
  )
};

const Categories = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoading(true);
        const data = await supabaseService.getCategories();
        setCategories(data);
      } catch (error) {
        console.error('Error fetching categories:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.3
      }
    }
  };

  const itemVariants = {
    hidden: { y: 50, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { 
        type: "spring",
        stiffness: 100,
        damping: 12
      }
    }
  };

  if (loading) {
    return (
      <section className="py-20">
        <div className="container mx-auto px-4 text-center">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-300 rounded w-64 mx-auto mb-4"></div>
            <div className="h-4 bg-gray-300 rounded w-96 mx-auto mb-8"></div>
            <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-8">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="h-80 bg-gray-300 rounded-lg"></div>
              ))}
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-20 overflow-hidden relative">
      {/* Decorative elements */}
      <div className="absolute top-0 left-0 transform -translate-x-1/2 -translate-y-1/2 rotate-180">
        {decorativeElements.corner}
      </div>
      <div className="absolute bottom-0 right-0 transform translate-x-1/2 translate-y-1/2">
        {decorativeElements.corner}
      </div>
      <div className="absolute top-1/4 right-10 transform rotate-45">
        {decorativeElements.flower}
      </div>
      <div className="absolute bottom-1/4 left-10 transform -rotate-45">
        {decorativeElements.flower}
      </div>
      
      {/* New decorative elements */}
      <div className="absolute top-1/2 left-0 transform -translate-x-1/4">
        {decorativeElements.lotus}
      </div>
      <div className="absolute top-0 right-1/4 transform -translate-y-1/4">
        {decorativeElements.rangoli}
      </div>
      <div className="absolute bottom-0 left-1/3 transform translate-y-1/4">
        {decorativeElements.peacock}
      </div>
      <div className="absolute bottom-0 inset-x-0">
        {decorativeElements.borderDesign}
      </div>
      <div className="absolute top-0 inset-x-0 transform rotate-180">
        {decorativeElements.borderDesign}
      </div>
      
      {/* Background patterns */}
      <div className="absolute inset-0 z-0 opacity-5">
        <div className="absolute top-0 left-0 w-40 h-40">
          {patterns.paisley}
        </div>
        <div className="absolute bottom-0 right-0 w-40 h-40">
          {patterns.paisley}
        </div>
        <div className="absolute top-1/2 right-1/4 w-40 h-40 transform -translate-y-1/2">
          {patterns.mandala}
        </div>
        <div className="absolute top-1/2 left-1/4 w-40 h-40 transform -translate-y-1/2">
          {patterns.mandala}
        </div>
      </div>
    
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
        className="container mx-auto px-4 text-center mb-16 relative z-10"
      >
        <h2 className="text-4xl font-serif font-light text-gray-900 mb-4">Explore Our Collections</h2>
        <div className="w-24 h-[1px] bg-pink mx-auto mb-6"></div>
        <p className="text-gray-600 max-w-2xl mx-auto">Discover the perfect blend of traditional craftsmanship and contemporary design across our curated categories</p>
        
        {/* Decorative title underline with dots */}
        <div className="flex items-center justify-center mt-4 space-x-1">
          <div className="w-1 h-1 rounded-full bg-pink opacity-70"></div>
          <div className="w-1.5 h-1.5 rounded-full bg-pink opacity-80"></div>
          <div className="w-2 h-2 rounded-full bg-pink opacity-90"></div>
          <div className="w-12 h-0.5 bg-pink"></div>
          <div className="w-2 h-2 rounded-full bg-pink opacity-90"></div>
          <div className="w-1.5 h-1.5 rounded-full bg-pink opacity-80"></div>
          <div className="w-1 h-1 rounded-full bg-pink opacity-70"></div>
        </div>
      </motion.div>

      <div className="container mx-auto px-4 relative z-10">
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-8"
        >
          {categories.map((category, index) => {
            // Use design template colors if available, otherwise fall back to name-based colors
            const categoryColors = category.design_template 
              ? (designTemplateColors[category.design_template] || designTemplateColors.default)
              : (colorMap[category.name] || colorMap.default);
            
            return (
            <motion.div
              key={category.id}
              variants={itemVariants}
              whileHover={{ 
                y: -10,
                boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)"
              }}
              className="group relative overflow-hidden rounded-lg shadow-md"
            >
              {/* Card Background with soft gradient overlay */}
              <div className={`absolute inset-0 ${categoryColors.lightColor} transition-all duration-500`}></div>
              
              {/* Decorative Border */}
              <div className="absolute inset-0 border border-white/30 rounded-lg z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              
              {/* Corner Accents */}
              <div className="absolute top-2 left-2 w-6 h-6 border-t border-l rounded-tl-sm border-white/50 opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-10"></div>
              <div className="absolute top-2 right-2 w-6 h-6 border-t border-r rounded-tr-sm border-white/50 opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-10"></div>
              <div className="absolute bottom-2 left-2 w-6 h-6 border-b border-l rounded-bl-sm border-white/50 opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-10"></div>
              <div className="absolute bottom-2 right-2 w-6 h-6 border-b border-r rounded-br-sm border-white/50 opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-10"></div>
              
              {/* Pattern Background */}
              <div className="absolute inset-0 opacity-10 overflow-hidden">
                <div className="absolute inset-0 transform rotate-45 group-hover:rotate-[60deg] transition-transform duration-1000">
                  {patterns.paisley}
                </div>
                <div className="absolute inset-0 group-hover:scale-110 transition-transform duration-1000">
                  {patterns.mandala}
                </div>
              </div>
              
              <div className="relative aspect-[3/4] z-10">
                {/* Image */}
                <div className="absolute inset-0 rounded-lg overflow-hidden">
                  <img
                    src={category.image_url || 'https://images.unsplash.com/photo-1659293554631-d7a38642c5e3?q=80&w=2972&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'}
                    alt={category.name}
                    className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  {/* Image Overlay - Gradient */}
                  <div 
                    className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent opacity-80 group-hover:opacity-90 transition-opacity duration-300"
                    style={{ 
                      background: `linear-gradient(to top, ${categoryColors.color}CC, ${categoryColors.color}44, transparent)` 
                    }}
                  ></div>
                </div>
                
                {/* Content */}
                <div className="absolute inset-0 flex flex-col justify-end p-6 text-white">
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 + index * 0.1 }}
                    className="transform group-hover:translate-y-[-10px] transition-transform duration-300"
                  >
                    <div className="mb-2 flex items-center">
                      {/* Small decorative line */}
                      <div className="w-10 h-[1px] bg-white/70 mr-3"></div>
                      <span className="text-sm uppercase tracking-wider font-bold text-white/90">Collection</span>
                    </div>
                    
                    <h3 className="text-2xl font-bold text-white mb-2 relative" style={{ textShadow: '0 2px 8px rgba(0,0,0,0.25), 0 1px 0 #fff2' }}>
                      {category.name}
                      <div className="absolute bottom-[-6px] left-0 w-0 h-[1px] bg-white group-hover:w-1/3 transition-all duration-300 delay-100"></div>
                    </h3>
                    
                    <p className="text-white/80 text-sm font-bold mb-6 hidden md:flex">{category.description || `Explore our ${category.name} collection`}</p>
                    
                    <motion.div
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <Link 
                        to={`/category/${category.slug || category.name.toLowerCase()}`} 
                        className="inline-flex font-bold items-center space-x-2 text-white border-b border-white/40 pb-1 group-hover:border-white transition-colors duration-300 text-sm"
                      >
                        <span>Explore Collection</span>
                        <svg className="w-4 h-4 transform group-hover:translate-x-1 transition-transform duration-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                        </svg>
                      </Link>
                    </motion.div>
                  </motion.div>
                </div>
              </div>
            </motion.div>
          )})}
          
        </motion.div>
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5, delay: 0.6 }}
        className="mt-16 text-center relative z-10"
      >
        
        {/* Decorative elements around the button */}
        <div className="flex justify-center mt-8 space-x-4">
          <motion.div 
            initial={{ scale: 0 }}
            whileInView={{ scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 1 }}
            className="w-6 h-[1px] bg-pink opacity-40 self-center"
          ></motion.div>
          <motion.div 
            initial={{ scale: 0 }}
            whileInView={{ scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 1.1 }}
            className="w-3 h-3 rounded-full border border-pink opacity-40"
          ></motion.div>
          <motion.div 
            initial={{ scale: 0 }}
            whileInView={{ scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 1.2 }}
            className="w-2 h-2 rounded-full bg-pink opacity-40"
          ></motion.div>
          <motion.div 
            initial={{ scale: 0 }}
            whileInView={{ scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 1.1 }}
            className="w-3 h-3 rounded-full border border-pink opacity-40"
          ></motion.div>
          <motion.div 
            initial={{ scale: 0 }}
            whileInView={{ scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 1 }}
            className="w-6 h-[1px] bg-pink opacity-40 self-center"
          ></motion.div>
        </div>
      </motion.div>
    </section>
  );
};

export default Categories; 