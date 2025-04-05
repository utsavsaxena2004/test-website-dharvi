import { motion } from 'framer-motion';
import { useState, useRef } from 'react';
import logo from '../assets/logo.svg';

const Footer = () => {
  const [email, setEmail] = useState('');
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [isHovered, setIsHovered] = useState(null);
  const newsletterRef = useRef(null);
  
  const footerLinks = {
    shop: [
      { name: 'Sarees', href: '/collections/sarees' },
      { name: 'Lehengas', href: '/collections/lehengas' },
      { name: 'Kurtis', href: '/collections/kurtis' },
      { name: 'Suits', href: '/collections/suits' },
      { name: 'Custom Designs', href: '/custom-design' },
    ],
    company: [
      { name: 'About Us', href: '/about' },
      { name: 'Contact', href: '/contact' },
      { name: 'Careers', href: '/careers' },
      { name: 'Press', href: '/press' },
    ],
    support: [
      { name: 'FAQ', href: '/faq' },
      { name: 'Shipping', href: '/shipping' },
      { name: 'Returns', href: '/returns' },
      { name: 'Size Guide', href: '/size-guide' },
    ],
  };

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (email && newsletterRef.current) {
      setIsSubscribed(true);
      setEmail('');
      
      // Animate the newsletter form
      newsletterRef.current.classList.add('animate-pulse');
      setTimeout(() => {
        if (newsletterRef.current) {
          newsletterRef.current.classList.remove('animate-pulse');
        }
        setTimeout(() => setIsSubscribed(false), 3000);
      }, 800);
    }
  };

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { 
        type: "spring",
        stiffness: 100,
      },
    },
  };

  const linkVariants = {
    hover: { 
      scale: 1.05, 
      color: "#ff3366",
      x: 5,
      transition: { 
        type: "spring", 
        stiffness: 400, 
        damping: 10 
      } 
    }
  };

  return (
    <footer className="relative bg-gradient-to-b from-white via-gray-50 to-white text-gray-800 border-t border-gray-200 overflow-hidden">
      {/* Decorative elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.img 
          src="/patterns/mandala.svg" 
          alt="" 
          className="absolute -right-24 -top-24 w-96 h-96 opacity-30" 
          animate={{ 
            rotate: 360,
            opacity: [0.2, 0.3, 0.2]
          }}
          transition={{ 
            rotate: { duration: 120, ease: "linear", repeat: Infinity },
            opacity: { duration: 8, repeat: Infinity, repeatType: "reverse" }
          }}
        />
        <motion.img 
          src="/patterns/paisley.svg" 
          alt="" 
          className="absolute -left-32 bottom-20 w-64 h-64 opacity-20" 
          animate={{ 
            y: [0, 15, 0],
            scale: [1, 1.05, 1],
            opacity: [0.2, 0.25, 0.2]
          }}
          transition={{ 
            duration: 10, 
            repeat: Infinity,
            repeatType: "reverse"
          }}
        />
        <motion.img 
          src="/patterns/floral.svg" 
          alt="" 
          className="absolute right-1/4 bottom-0 w-48 h-48 opacity-15" 
          animate={{ 
            y: [0, -10, 0],
            opacity: [0.10, 0.15, 0.10]
          }}
          transition={{ 
            duration: 7, 
            repeat: Infinity,
            repeatType: "reverse",
            delay: 1
          }}
        />
        <motion.img 
          src="/patterns/geometric.svg" 
          alt="" 
          className="absolute left-1/4 top-12 w-40 h-40 opacity-10" 
          animate={{ 
            rotate: -360,
            scale: [1, 1.1, 1],
            opacity: [0.05, 0.1, 0.05]
          }}
          transition={{ 
            rotate: { duration: 90, ease: "linear", repeat: Infinity },
            scale: { duration: 15, repeat: Infinity, repeatType: "reverse" },
            opacity: { duration: 8, repeat: Infinity, repeatType: "reverse", delay: 2 }
          }}
        />
      </div>
      
      {/* Main footer content */}
      <div className="container mx-auto px-4 py-16 relative z-10">
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-12 gap-12"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
        >
          {/* Brand section */}
          <motion.div 
            className="md:col-span-4"
            variants={itemVariants}
          >
            <motion.div 
              className="mb-6"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <a href="/" className="inline-block">
                <img 
                  src={logo} 
                  alt="Dharika Logo" 
                  className="h-24 w-auto object-contain max-h-full" 
                />
              </a>
            </motion.div>
            
            <p className="text-gray-600 text-lg mb-8 max-w-md">
              Discover the perfect blend of tradition and contemporary style with our exclusive collection of ethnic wear, supporting local artisans and tailors.
            </p>

            {/* Social icons */}
            <div className="flex space-x-4 mb-8">
              {[
                { name: 'Facebook', icon: 'M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z' },
                { name: 'Instagram', icon: 'M12.315 2c2.43 0 2.784.013 3.808.09 1.064.077 1.791.232 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.233.636.388 1.363.465 2.427.077 1.067.09 1.407.09 4.123v.08c0 2.643-.012 2.987-.09 4.043-.077 1.064-.232 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.233-1.363.388-2.427.465-1.067.077-1.407.09-4.123.09h-.08c-2.643 0-2.987-.012-4.043-.09-1.064-.077-1.791-.232-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.233-.636-.388-1.363-.465-2.427-.077-1.024-.087-1.379-.087-4.808v-.08c0-2.43.013-2.784.09-3.808.077-1.064.232-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.233 1.363-.388 2.427-.465C8.901 2.013 9.256 2 11.685 2h.08zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z' },
                { name: 'Twitter', icon: 'M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84' },
                { name: 'Pinterest', icon: 'M12 0C5.373 0 0 5.372 0 12c0 5.084 3.163 9.426 7.627 11.174-.105-.949-.2-2.405.042-3.441.218-.937 1.407-5.965 1.407-5.965s-.359-.719-.359-1.782c0-1.668.967-2.914 2.171-2.914 1.023 0 1.518.769 1.518 1.69 0 1.029-.655 2.568-.994 3.995-.283 1.194.599 2.169 1.777 2.169 2.133 0 3.772-2.249 3.772-5.495 0-2.873-2.064-4.882-5.012-4.882-3.414 0-5.418 2.561-5.418 5.207 0 1.031.397 2.138.893 2.738a.36.36 0 0 1 .083.345l-.333 1.36c-.053.22-.174.267-.402.161-1.499-.698-2.436-2.889-2.436-4.649 0-3.785 2.75-7.262 7.929-7.262 4.163 0 7.398 2.967 7.398 6.931 0 4.136-2.607 7.464-6.227 7.464-1.216 0-2.359-.631-2.75-1.378l-.748 2.853c-.271 1.043-1.002 2.35-1.492 3.146C9.57 23.812 10.763 24 12 24c6.627 0 12-5.373 12-12 0-6.628-5.373-12-12-12z' }
              ].map((social, index) => (
                <motion.a 
                  key={social.name}
                  href="#"
                  className="flex items-center justify-center w-10 h-10 rounded-full bg-gray-100 text-gray-600 hover:text-pink hover:bg-pink/10 transition-all duration-300"
                  whileHover={{ 
                    scale: 1.15, 
                    rotate: 5,
                    boxShadow: "0 4px 10px rgba(0,0,0,0.1)" 
                  }}
                  whileTap={{ scale: 0.95 }}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.1 * index }}
                >
                  <span className="sr-only">{social.name}</span>
                  <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d={social.icon} />
                  </svg>
                </motion.a>
              ))}
            </div>
          </motion.div>
          
          {/* Links sections */}
          <motion.div className="md:col-span-5 grid grid-cols-1 sm:grid-cols-3 gap-8" variants={itemVariants}>
            {Object.entries(footerLinks).map(([category, links]) => (
              <div key={category}>
                <h4 className="text-lg font-semibold mb-5 capitalize relative inline-block">
                  {category}
                  <motion.span
                    className="absolute -bottom-1 left-0 h-0.5 bg-pink rounded"
                    initial={{ width: 0 }}
                    whileInView={{ width: '100%' }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.3, duration: 0.5 }}
                  />
                </h4>
                <ul className="space-y-3">
                  {links.map((link, index) => (
                    <motion.li 
                      key={link.name}
                      initial={{ opacity: 0, x: -10 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: 0.1 * index }}
                    >
                      <motion.a
                        href={link.href}
                        className="text-gray-600 inline-block relative"
                        variants={linkVariants}
                        whileHover="hover"
                        onMouseEnter={() => setIsHovered(`${category}-${index}`)}
                        onMouseLeave={() => setIsHovered(null)}
                      >
                        <span>{link.name}</span>
                        {isHovered === `${category}-${index}` && (
                          <motion.span
                            className="absolute -bottom-1 left-0 h-0.5 bg-pink"
                            initial={{ width: 0 }}
                            animate={{ width: '100%' }}
                            transition={{ duration: 0.2 }}
                          />
                        )}
                      </motion.a>
                    </motion.li>
                  ))}
                </ul>
              </div>
            ))}
          </motion.div>
          
          {/* Newsletter section */}
          <motion.div 
            className="md:col-span-3"
            variants={itemVariants}
            ref={newsletterRef}
          >
            <h4 className="text-lg font-semibold mb-5 relative inline-block">
              Join Our Newsletter
              <motion.span
                className="absolute -bottom-1 left-0 h-0.5 bg-pink rounded"
                initial={{ width: 0 }}
                whileInView={{ width: '100%' }}
                viewport={{ once: true }}
                transition={{ delay: 0.3, duration: 0.5 }}
              />
            </h4>
            <p className="text-gray-600 mb-5">
              Subscribe to receive updates about new designs, exclusive offers, and ethnic fashion inspiration.
            </p>
            
            <form onSubmit={handleSubscribe} className="relative">
              <div className="flex flex-col space-y-2">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Your email address"
                  className="w-full px-4 py-3 rounded-md border border-gray-300 focus:ring-pink focus:border-pink bg-white/80"
                  required
                />
                <motion.button
                  type="submit"
                  className="w-full bg-pink text-white font-medium px-6 py-3 rounded-md shadow-sm"
                  whileHover={{ backgroundColor: "#d11f63", boxShadow: "0 4px 12px rgba(255, 51, 102, 0.25)" }}
                  whileTap={{ scale: 0.97 }}
                >
                  Subscribe
                </motion.button>
              </div>
              
              {isSubscribed && (
                <motion.div 
                  className="absolute -bottom-8 left-0 w-full text-green-600 text-sm font-medium"
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  Thank you for subscribing! 
                </motion.div>
              )}
            </form>
            
            <motion.div
              className="mt-8 p-4 bg-pink/5 border border-pink/10 rounded-lg"
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.5 }}
            >
              <h5 className="font-medium text-gray-900 mb-2 flex items-center">
                <svg className="w-5 h-5 mr-2 text-pink" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                Subscriber Benefits
              </h5>
              <ul className="text-sm text-gray-600 space-y-1">
                <li className="flex items-start">
                  <svg className="w-4 h-4 text-pink mt-0.5 mr-1" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  Early access to new collections
                </li>
                <li className="flex items-start">
                  <svg className="w-4 h-4 text-pink mt-0.5 mr-1" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  Exclusive discount codes
                </li>
                <li className="flex items-start">
                  <svg className="w-4 h-4 text-pink mt-0.5 mr-1" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  Style tips and inspiration
                </li>
              </ul>
            </motion.div>
          </motion.div>
        </motion.div>

        {/* Bottom section */}
        <div className="mt-16 pt-8 border-t border-gray-200">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex flex-col items-center md:items-start mb-4 md:mb-0">
              <p className="text-gray-600 text-sm">
                © {new Date().getFullYear()} Dharika. All rights reserved.
              </p>
              <div className="mt-2 flex flex-wrap justify-center md:justify-start space-x-4">
                <a href="#" className="text-xs text-gray-500 hover:text-pink transition-colors duration-300">Privacy Policy</a>
                <a href="#" className="text-xs text-gray-500 hover:text-pink transition-colors duration-300">Terms of Service</a>
                <a href="#" className="text-xs text-gray-500 hover:text-pink transition-colors duration-300">Sitemap</a>
              </div>
            </div>
            
            <motion.p 
              className="text-xs text-gray-500 max-w-md text-center md:text-right"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.5 }}
            >
              Supporting local artisans and craftspeople across India, bringing traditional craftsmanship to modern wardrobes.
            </motion.p>
          </div>
        </div>
        
        {/* Back to top button */}
        {/* <motion.div
          className="fixed bottom-8 right-8 z-50"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false }}
        >
          <motion.button
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="bg-pink text-white p-3 rounded-full shadow-lg hover:bg-pink/90 focus:outline-none"
            whileHover={{ 
              scale: 1.1, 
              boxShadow: '0 10px 25px rgba(0, 0, 0, 0.1)',
              y: -3
            }}
            whileTap={{ scale: 0.9 }}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 11l7-7 7 7M5 19l7-7 7 7" />
            </svg>
          </motion.button>
        </motion.div> */}
      </div>
    </footer>
  );
};

export default Footer; 