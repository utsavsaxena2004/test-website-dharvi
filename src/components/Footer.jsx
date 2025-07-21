import { motion } from 'framer-motion';
import { useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import { useSiteSettings } from '../hooks/useSiteSettings';
import SupportModal from './SupportModal';
import { 
  MapPinIcon, 
  PhoneIcon, 
  EnvelopeIcon, 
  HeartIcon,
  ShieldCheckIcon,
  TruckIcon,
  CreditCardIcon,
  SparklesIcon,
  GiftIcon
} from '@heroicons/react/24/outline';
import mainLogo from '../assets/mainLogo.png';
import logoBg from '../assets/logoBG.png';

const Footer = () => {
  const [email, setEmail] = useState('');
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [isHovered, setIsHovered] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalType, setModalType] = useState('');
  const newsletterRef = useRef(null);
  const { siteSettings, getFooterContent } = useSiteSettings();
  
  const footerContent = getFooterContent();

  const footerLinks = {
    shop: [
      { name: 'Custom Designs', href: '/custom-design' },
    ],
    // company: [
    //   { name: 'About Us', href: '/about' },
    //   { name: 'Our Story', href: '/story' },
    //   { name: 'Artisan Network', href: '/artisans' },
    //   { name: 'Careers', href: '/careers' },
    //   { name: 'Press', href: '/press' },
    // ],
    support: [
      { name: 'Contact Us', href: '/contact' },
      { name: 'Size Guide', href: '/size-guide' },
      { name: 'Shipping Info', href: '#', modalType: 'shipping' },
      { name: 'Returns & Exchanges', href: '#', modalType: 'returns' },
      { name: 'Care Instructions', href: '#', modalType: 'care' },
    ],
    legal: [
      { name: 'Privacy Policy', href: '#', modalType: 'privacy' },
      { name: 'Terms of Service', href: '#', modalType: 'terms' },
      { name: 'Refund Policy', href: '/refund' },
      { name: 'Sitemap', href: '/sitemap' },
    ],
  };

  const features = [
    {
      icon: TruckIcon,
      title: 'Free Shipping',
      description: `On orders above ₹${siteSettings?.free_shipping_threshold || 2999}`,
      color: 'text-emerald-600'
    },
    {
      icon: ShieldCheckIcon,
      title: 'Authentic Products',
      description: 'Handcrafted by skilled artisans',
      color: 'text-blue-600'
    },
    {
      icon: CreditCardIcon,
      title: 'Secure Payment',
      description: 'SSL encrypted checkout',
      color: 'text-purple-600'
    },
    {
      icon: GiftIcon,
      title: 'Gift Wrapping',
      description: 'Complimentary on all orders',
      color: 'text-rose-600'
    }
  ];

  const socialLinks = [
    ...(siteSettings?.social_instagram ? [{
      name: 'Instagram',
      href: siteSettings.social_instagram,
      icon: 'M12.315 2c2.43 0 2.784.013 3.808.09 1.064.077 1.791.232 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.233.636.388 1.363.465 2.427.077 1.067.09 1.407.09 4.123v.08c0 2.643-.012 2.987-.09 4.043-.077 1.064-.232 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.233-1.363.388-2.427.465-1.067.077-1.407.09-4.123.09h-.08c-2.643 0-2.987-.012-4.043-.09-1.064-.077-1.791-.232-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.233-.636-.388-1.363-.465-2.427-.077-1.024-.087-1.379-.087-4.808v-.08c0-2.43.013-2.784.09-3.808.077-1.064.232-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.233 1.363-.388 2.427-.465C8.901 2.013 9.256 2 11.685 2h.08zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z',
      color: 'hover:text-pink-600'
    }] : []),
    ...(siteSettings?.social_facebook ? [{
      name: 'Facebook',
      href: siteSettings.social_facebook,
      icon: 'M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z',
      color: 'hover:text-blue-600'
    }] : []),
    ...(siteSettings?.social_whatsapp ? [{
      name: 'WhatsApp',
      href: siteSettings.social_whatsapp,
      icon: 'M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.488',
      color: 'hover:text-green-600'
    }] : [])
  ];

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (email && newsletterRef.current) {
      setIsSubscribed(true);
      setEmail('');
      newsletterRef.current.classList.add('animate-pulse');
      setTimeout(() => {
        if (newsletterRef.current) {
          newsletterRef.current.classList.remove('animate-pulse');
        }
        setTimeout(() => setIsSubscribed(false), 3000);
      }, 800);
    }
  };

  const handleLinkClick = (e, link) => {
    if (link.modalType) {
      e.preventDefault();
      setModalType(link.modalType);
      setModalOpen(true);
    }
  };

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
        type: 'spring', 
        stiffness: 100, 
        damping: 15,
      },
    },
  };

  // Traditional Indian decorative elements
  const DecorativePattern = () => (
    <svg className="absolute inset-0 w-full h-full opacity-5 pointer-events-none" viewBox="0 0 400 400">
      <defs>
        <pattern id="paisley-pattern" x="0" y="0" width="80" height="80" patternUnits="userSpaceOnUse">
          <path d="M20,10 Q30,5 40,10 Q50,20 45,30 Q40,40 30,35 Q20,30 15,20 Q10,15 20,10 Z" fill="currentColor" opacity="0.3"/>
          <circle cx="25" cy="20" r="2" fill="currentColor" opacity="0.4"/>
          <path d="M60,50 Q70,45 75,55 Q80,65 70,70 Q60,75 55,65 Q50,55 60,50 Z" fill="currentColor" opacity="0.3"/>
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill="url(#paisley-pattern)" className="text-[#6f0e06]"/>
    </svg>
  );

  return (
    <>
      <SupportModal 
        isOpen={modalOpen} 
        onClose={() => setModalOpen(false)} 
        modalType={modalType} 
      />
      <footer className="relative bg-gradient-to-b from-rose-50 via-white to-amber-50 text-gray-800 border-t border-gray-200/50 overflow-hidden">
      {/* Decorative background elements */}
      <DecorativePattern />
      
      {/* Floating gradient orbs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          className="absolute -top-20 -right-20 w-80 h-80 bg-gradient-to-br from-[#6f0e06]/10 to-amber-200/10 rounded-full blur-3xl"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.5, 0.3],
            x: [0, 20, 0],
            y: [0, -10, 0]
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        <motion.div
          className="absolute -bottom-20 -left-20 w-96 h-96 bg-gradient-to-tr from-emerald-200/10 to-blue-200/10 rounded-full blur-3xl"
          animate={{
            scale: [1.2, 1, 1.2],
            opacity: [0.4, 0.2, 0.4],
            x: [0, -15, 0],
            y: [0, 15, 0]
          }}
          transition={{
            duration: 25,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
      </div>

      {/* Features Section */}
      {/* <div className="relative z-10 border-b border-gray-200/50 py-12">
        <div className="container mx-auto px-4">
          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                variants={itemVariants}
                className="flex items-center space-x-4 group"
              >
                <motion.div
                  className={`flex-shrink-0 w-12 h-12 rounded-full bg-white shadow-md flex items-center justify-center ${feature.color} group-hover:scale-110 transition-transform duration-300`}
                  whileHover={{ rotate: 360 }}
                  transition={{ duration: 0.5 }}
                >
                  <feature.icon className="w-6 h-6" />
                </motion.div>
                <div>
                  <h4 className="font-semibold text-gray-900">{feature.title}</h4>
                  <p className="text-sm text-gray-600">{feature.description}</p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div> */}

      {/* Main footer content */}
      <div className="container mx-auto px-4 py-16 relative z-10">
        <motion.div
          className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          {/* Brand section */}
          <motion.div
            className="lg:col-span-6 flex flex-col items-center lg:items-start"
            variants={itemVariants}
          >
            <motion.div
              className="mb-6"
              whileHover={{ scale: 1.02 }}
              transition={{ type: 'spring', stiffness: 300, damping: 20 }}
            >
              <Link to="/" className="relative inline-block">
                <div className="absolute inset-0 flex items-center justify-center">
                  <img
                    src={logoBg}
                    alt="Logo Background"
                    className="h-32 w-32 object-contain opacity-80"
                    style={{ animation: 'spin 20s linear infinite' }}
                  />
                </div>
                <img
                  src={mainLogo}
                  alt="Dharika Logo"
                  className="h-24 w-auto object-contain relative z-10 transition-transform duration-300 hover:scale-105"
                />
              </Link>
            </motion.div>
            
            <p className="text-gray-600 text-center lg:text-left mb-6 max-w-md leading-relaxed">
              {siteSettings?.site_description || footerContent?.description || 'Celebrating the artistry of Indian craftsmanship. Each piece in our collection tells a story of tradition, elegance, and timeless beauty, handcrafted by skilled artisans across India.'}
            </p>

            {/* Contact Information */}
            <div className="space-y-3 mb-6 text-center lg:text-left">
              {(siteSettings?.address || footerContent?.address) && (
                <div className="flex items-center justify-center lg:justify-start space-x-3">
                  <MapPinIcon className="w-5 h-5 text-[#6f0e06] flex-shrink-0" />
                  <span className="text-sm text-gray-600">{siteSettings?.address || footerContent?.address}</span>
                </div>
              )}
              {(siteSettings?.contact_phone) && (
                <div className="flex items-center justify-center lg:justify-start space-x-3">
                  <PhoneIcon className="w-5 h-5 text-[#6f0e06] flex-shrink-0" />
                  <span className="text-sm text-gray-600">{siteSettings?.contact_phone}</span>
                </div>
              )}
              {(siteSettings?.contact_email || footerContent?.email) && (
                <div className="flex items-center justify-center lg:justify-start space-x-3">
                  <EnvelopeIcon className="w-5 h-5 text-[#6f0e06] flex-shrink-0" />
                  <span className="text-sm text-gray-600">{siteSettings?.contact_email || footerContent?.email}</span>
                </div>
              )}
            </div>

            {/* Social Media */}
            <div className="flex space-x-4 justify-center lg:justify-start">
              {socialLinks.map((social, index) => (
                <motion.a
                  key={social.name}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`w-10 h-10 rounded-full bg-white shadow-md flex items-center justify-center text-gray-600 ${social.color} transition-all duration-300 hover:shadow-lg`}
                  whileHover={{ 
                    scale: 1.1, 
                    y: -2,
                    boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1)"
                  }}
                  whileTap={{ scale: 0.95 }}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{
                    delay: 0.1 * index,
                    type: 'spring',
                    stiffness: 300,
                    damping: 20,
                  }}
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
          <motion.div
            className="lg:col-span-6 grid grid-cols-2 md:grid-cols-4 gap-6 lg:gap-8"
            variants={itemVariants}
          >
            {Object.entries(footerLinks).map(([category, links]) => (
              <div key={category} className="space-y-4">
                <h4 className="text-lg font-semibold text-gray-900 uppercase tracking-wide relative">
                  {category}
                  <motion.span
                    className="absolute -bottom-1 left-0 h-0.5 bg-gradient-to-r from-[#6f0e06] to-amber-500 rounded-full"
                    initial={{ width: 0 }}
                    whileInView={{ width: '60%' }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.3, duration: 0.5 }}
                  />
                </h4>
                <ul className="space-y-2">
                  {links.map((link, index) => (
                    <motion.li
                      key={link.name}
                      initial={{ opacity: 0, x: -10 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: 0.1 * index }}
                    >
                      <Link
                        to={link.href}
                        onClick={(e) => handleLinkClick(e, link)}
                        className="text-gray-600 hover:text-[#6f0e06] transition-colors duration-300 text-sm relative group"
                        onMouseEnter={() => setIsHovered(`${category}-${index}`)}
                        onMouseLeave={() => setIsHovered(null)}
                      >
                        <span className="relative z-10">{link.name}</span>
                        {isHovered === `${category}-${index}` && (
                          <motion.span
                            className="absolute -bottom-1 left-0 h-0.5 bg-[#6f0e06] rounded-full"
                            initial={{ width: 0 }}
                            animate={{ width: '100%' }}
                            transition={{ duration: 0.3 }}
                          />
                        )}
                      </Link>
                    </motion.li>
                  ))}
                </ul>
              </div>
            ))}
          </motion.div>


        </motion.div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-gray-200/50 bg-gradient-to-r from-white/80 to-amber-50/80 backdrop-blur-sm relative z-10">
        <div className="container mx-auto px-4 py-6">
          <motion.div
            className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
          >
            <div className="flex flex-col md:flex-row items-center space-y-2 md:space-y-0 md:space-x-6">
              <p className="text-sm text-gray-600">
                © {new Date().getFullYear()} {siteSettings?.site_name || footerContent?.company || 'Dharika'}. All rights reserved.
              </p>
              <div className="flex space-x-4">
                {['Privacy Policy', 'Terms of Service', 'Cookies'].map((link, index) => (
                  <motion.a
                    key={link}
                    href="#"
                    className="text-xs text-gray-500 hover:text-[#6f0e06] transition-colors duration-300 relative group"
                    whileHover={{ scale: 1.05 }}
                    onMouseEnter={() => setIsHovered(`bottom-${index}`)}
                    onMouseLeave={() => setIsHovered(null)}
                  >
                    {link}
                    {isHovered === `bottom-${index}` && (
                      <motion.span
                        className="absolute -bottom-1 left-0 h-0.5 bg-[#6f0e06] rounded-full"
                        initial={{ width: 0 }}
                        animate={{ width: '100%' }}
                        transition={{ duration: 0.2 }}
                      />
                    )}
                  </motion.a>
                ))}
              </div>
            </div>
            
            <motion.div
              className="flex items-center space-x-2 text-sm text-gray-600"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.5 }}
            >
              <span>Made with</span>
              <motion.div
                animate={{ 
                  scale: [1, 1.2, 1],
                  rotate: [0, 5, -5, 0]
                }}
                transition={{ 
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              >
                <HeartIcon className="w-4 h-4 text-[#6f0e06] fill-current" />
              </motion.div>
              <span>by</span>
              <a href="https://devitup.in" target="_blank" rel="noopener noreferrer" className="hover:text-[#6f0e06] font-bold transition-colors duration-300">DevItUp</a>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </footer>
    </>
  );
};

export default Footer; 