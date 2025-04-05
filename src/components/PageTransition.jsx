import { motion, AnimatePresence } from 'framer-motion';
import { useLocation } from 'react-router-dom';
import { useEffect } from 'react';

/**
 * A wrapper component that provides smooth page transitions
 * Can be used to wrap route content for consistent animations across the site
 */
const PageTransition = ({ children, transitionType = "fade" }) => {
  const location = useLocation();
  
  useEffect(() => {
    // Scroll to top on page change
    window.scrollTo(0, 0);
  }, [location.pathname]);
  
  // Different transition animations
  const transitions = {
    fade: {
      initial: { opacity: 0 },
      animate: { opacity: 1 },
      exit: { opacity: 0 },
      transition: { duration: 0.5 }
    },
    slide: {
      initial: { x: '100%' },
      animate: { x: 0 },
      exit: { x: '-100%' },
      transition: { type: 'spring', stiffness: 300, damping: 30 }
    },
    scale: {
      initial: { opacity: 0, scale: 0.9 },
      animate: { opacity: 1, scale: 1 },
      exit: { opacity: 0, scale: 1.1 },
      transition: { duration: 0.5 }
    },
    flip: {
      initial: { opacity: 0, rotateY: 90 },
      animate: { opacity: 1, rotateY: 0 },
      exit: { opacity: 0, rotateY: -90 },
      transition: { duration: 0.5 }
    },
    slideUp: {
      initial: { y: 50, opacity: 0 },
      animate: { y: 0, opacity: 1 },
      exit: { y: -50, opacity: 0 },
      transition: { duration: 0.4 }
    }
  };
  
  // Get transition properties based on type
  const transitionProps = transitions[transitionType] || transitions.fade;
  
  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={location.pathname}
        initial={transitionProps.initial}
        animate={transitionProps.animate}
        exit={transitionProps.exit}
        transition={transitionProps.transition}
        className="w-full"
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
};

export default PageTransition; 