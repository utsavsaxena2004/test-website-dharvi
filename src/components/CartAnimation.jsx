import { motion, AnimatePresence } from 'framer-motion';
import React, { useState, useEffect } from 'react';

// Animated shopping bag icon that pulses
export const ShoppingBagIcon = ({ className = "", size = 24 }) => {
  return (
    <motion.div
      initial={{ scale: 1 }}
      animate={{ 
        scale: [1, 1.1, 1],
      }}
      transition={{ 
        duration: 2,
        repeat: Infinity,
        repeatType: "reverse"
      }}
      className={className}
    >
      <svg 
        width={size} 
        height={size} 
        viewBox="0 0 24 24" 
        fill="none" 
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full"
      >
        <path 
          d="M16 11V7C16 4.79086 14.2091 3 12 3C9.79086 3 8 4.79086 8 7V11M5 9H19L20 21H4L5 9Z" 
          stroke="currentColor" 
          strokeWidth="2" 
          strokeLinecap="round" 
          strokeLinejoin="round"
        />
      </svg>
    </motion.div>
  );
};

// Floating shopping bags animation
export const FloatingBags = ({ count = 5 }) => {
  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden">
      {[...Array(count)].map((_, i) => (
        <FloatingBag 
          key={i}
          delay={i * 3}
          size={Math.random() * 20 + 10}
          x={Math.random() * 100}
          y={Math.random() * 100}
        />
      ))}
    </div>
  );
};

const FloatingBag = ({ delay, size, x, y }) => (
  <motion.div
    className="absolute text-indigo-500 opacity-10"
    initial={{ scale: 0 }}
    animate={{ 
      y: [y, y - 40, y],
      x: [x, x + 10, x],
      scale: size / 30,
      opacity: [0.05, 0.1, 0.05]
    }}
    transition={{ 
      duration: 10, 
      repeat: Infinity, 
      delay: delay,
      ease: "easeInOut" 
    }}
    style={{ left: `${x}%`, top: `${y}%` }}
  >
    <svg width="30" height="30" viewBox="0 0 24 24" fill="currentColor">
      <path d="M16 11V7C16 4.79086 14.2091 3 12 3C9.79086 3 8 4.79086 8 7V11M5 9H19L20 21H4L5 9Z" />
    </svg>
  </motion.div>
);

// Colorful orbs that float in the background
export const ColorfulOrbs = ({ count = 6 }) => {
  const colors = ['#c7d2fe', '#ddd6fe', '#fae8ff', '#fed7e2'];
  
  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden">
      {[...Array(count)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full"
          style={{
            background: `radial-gradient(circle, ${colors[i % colors.length]}30, ${colors[i % colors.length]}10)`,
            width: `${Math.random() * 300 + 100}px`,
            height: `${Math.random() * 300 + 100}px`,
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
          }}
          animate={{
            x: [0, Math.random() * 40 - 20, 0],
            y: [0, Math.random() * 40 - 20, 0],
            scale: [1, Math.random() * 0.2 + 0.9, 1],
          }}
          transition={{
            duration: Math.random() * 10 + 15,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      ))}
    </div>
  );
};

// Decorative pattern
export const FlowerPattern = ({ top, left, size = 100, rotation = 0, opacity = 0.1 }) => (
  <div
    className="absolute pointer-events-none"
    style={{
      top: `${top}%`,
      left: `${left}%`,
      width: `${size}px`,
      height: `${size}px`,
      opacity: opacity,
      transform: `rotate(${rotation}deg)`,
    }}
  >
    <svg viewBox="0 0 100 100" className="w-full h-full text-indigo-500">
      <path
        fill="currentColor"
        d="M50,0 C60,30 70,40 100,50 C70,60 60,70 50,100 C40,70 30,60 0,50 C30,40 40,30 50,0 Z"
      />
    </svg>
  </div>
);

// Decorative border for cards
export const DecorativeBorder = () => (
  <div className="absolute inset-0 rounded-xl pointer-events-none">
    <div className="absolute top-0 left-0 w-20 h-20 border-t-2 border-l-2 border-indigo-400 rounded-tl-xl"></div>
    <div className="absolute top-0 right-0 w-20 h-20 border-t-2 border-r-2 border-indigo-400 rounded-tr-xl"></div>
    <div className="absolute bottom-0 left-0 w-20 h-20 border-b-2 border-l-2 border-indigo-400 rounded-bl-xl"></div>
    <div className="absolute bottom-0 right-0 w-20 h-20 border-b-2 border-r-2 border-indigo-400 rounded-br-xl"></div>
  </div>
);

// Checkout success animation
export const CheckoutSuccessAnimation = ({ isVisible, onComplete }) => {
  useEffect(() => {
    if (isVisible) {
      const timer = setTimeout(() => {
        if (onComplete) onComplete();
      }, 4000);
      
      return () => clearTimeout(timer);
    }
  }, [isVisible, onComplete]);
  
  return (
    <AnimatedCheckmark isVisible={isVisible} />
  );
};

const AnimatedCheckmark = ({ isVisible }) => {
  return (
    <motion.div
      initial={{ scale: 0, opacity: 0 }}
      animate={isVisible ? { scale: 1, opacity: 1 } : { scale: 0, opacity: 0 }}
      transition={{ duration: 0.5, type: 'spring' }}
      className="flex flex-col items-center justify-center"
    >
      <motion.div
        className="w-24 h-24 rounded-full bg-green-100 flex items-center justify-center"
      >
        <motion.svg
          width="60"
          height="60"
          viewBox="0 0 24 24"
          className="text-green-600"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <motion.path
            fill="none"
            stroke="currentColor"
            strokeWidth="3"
            d="M5 13l4 4L19 7"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          />
        </motion.svg>
      </motion.div>
      <motion.p
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.8 }}
        className="text-xl font-medium text-green-800 mt-4"
      >
        Order Placed Successfully!
      </motion.p>
    </motion.div>
  );
};

// Shimmer effect button
export const ShimmerButton = ({ children, onClick, className }) => {
  const [isTapped, setIsTapped] = useState(false);
  
  return (
    <motion.button
      onClick={(e) => {
        setIsTapped(true);
        setTimeout(() => setIsTapped(false), 300);
        if (onClick) onClick(e);
      }}
      className={`relative overflow-hidden ${className}`}
      whileHover={{ scale: 1.03 }}
      whileTap={{ scale: 0.97 }}
    >
      {children}
      <motion.div
        className="absolute inset-0 bg-white opacity-20"
        initial={{ x: '-100%' }}
        animate={isTapped ? { x: '100%' } : { x: '-100%' }}
        transition={isTapped ? { duration: 0.3, ease: 'easeOut' } : { duration: 0 }}
      />
    </motion.button>
  );
};

// Quantity control with bounce animation
export const QuantityControl = ({ quantity, onIncrease, onDecrease }) => {
  return (
    <div className="flex items-center border border-gray-200 rounded-full overflow-hidden">
      <motion.button
        whileHover={{ backgroundColor: 'rgba(79, 70, 229, 0.1)' }}
        whileTap={{ scale: 0.9 }}
        className="w-8 h-8 flex items-center justify-center text-indigo-500"
        onClick={onDecrease}
        aria-label="Decrease quantity"
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M5 12h14" />
        </svg>
      </motion.button>
      
      <motion.div
        key={quantity}
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="w-8 h-8 flex items-center justify-center font-medium"
      >
        {quantity}
      </motion.div>
      
      <motion.button
        whileHover={{ backgroundColor: 'rgba(79, 70, 229, 0.1)' }}
        whileTap={{ scale: 0.9 }}
        className="w-8 h-8 flex items-center justify-center text-indigo-500"
        onClick={onIncrease}
        aria-label="Increase quantity"
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M12 5v14M5 12h14" />
        </svg>
      </motion.button>
    </div>
  );
};

// Tilt Card effect
export const TiltCard = ({ children, intensity = 10 }) => {
  const [rotateX, setRotateX] = useState(0);
  const [rotateY, setRotateY] = useState(0);

  const handleMouseMove = (e) => {
    const card = e.currentTarget;
    const box = card.getBoundingClientRect();
    const x = e.clientX - box.left;
    const y = e.clientY - box.top;
    
    const centerX = box.width / 2;
    const centerY = box.height / 2;
    
    const rotateX = ((y - centerY) / centerY) * -intensity;
    const rotateY = ((x - centerX) / centerX) * intensity;
    
    setRotateX(rotateX);
    setRotateY(rotateY);
  };
  
  const handleMouseLeave = () => {
    setRotateX(0);
    setRotateY(0);
  };

  return (
    <motion.div
      className="w-full h-full"
      style={{
        transformStyle: "preserve-3d",
        perspective: "1000px",
      }}
      animate={{
        rotateX: rotateX,
        rotateY: rotateY,
      }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      {children}
    </motion.div>
  );
};

// Processing spinner
export const ProcessingSpinner = () => {
  return (
    <motion.div
      className="w-8 h-8 border-4 border-indigo-100 border-t-indigo-500 rounded-full"
      animate={{ rotate: 360 }}
      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
    />
  );
}; 