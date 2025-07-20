import { motion } from 'framer-motion';
import React from 'react';

// Enhanced decorative SVG components
export const HeartPattern = ({ style }) => (
  <svg width="120" height="120" viewBox="0 0 120 120" className="absolute text-[#6f0e06] opacity-5" style={style}>
    <path d="M60,20 C55,10 40,0 25,0 C5,0 0,20 0,30 C0,60 25,80 60,100 C95,80 120,60 120,30 C120,20 115,0 95,0 C80,0 65,10 60,20 Z" fill="currentColor" />
  </svg>
);

export const FloatingHeart = ({ delay, scale, x, y }) => (
  <motion.div
    className="absolute text-[#6f0e06] opacity-20"
    initial={{ scale: 0 }}
    animate={{ 
      y: [y, y - 40, y],
      scale: scale,
      opacity: [0.2, 0.3, 0.2]
    }}
    transition={{ 
      duration: 5, 
      repeat: Infinity, 
      delay: delay,
      ease: "easeInOut" 
    }}
    style={{ left: `${x}%`, top: `${y}px` }}
  >
    <svg width="30" height="30" viewBox="0 0 120 120">
      <path d="M60,20 C55,10 40,0 25,0 C5,0 0,20 0,30 C0,60 25,80 60,100 C95,80 120,60 120,30 C120,20 115,0 95,0 C80,0 65,10 60,20 Z" fill="currentColor" />
    </svg>
  </motion.div>
);

export const SparkleEffect = ({ top, left, delay }) => (
  <motion.div
    className="absolute w-3 h-3"
    style={{ top: `${top}%`, left: `${left}%` }}
    initial={{ opacity: 0, scale: 0 }}
    animate={{ 
      opacity: [0, 1, 0],
      scale: [0, 1, 0],
      rotate: [0, 180]
    }}
    transition={{
      duration: 2,
      delay: delay,
      repeat: Infinity,
      repeatDelay: 3
    }}
  >
    <svg viewBox="0 0 24 24" className="w-full h-full text-amber-400">
      <path
        fill="currentColor"
        d="M12,2L15.09,8.26L22,9.27L17,14.14L18.18,21.02L12,17.77L5.82,21.02L7,14.14L2,9.27L8.91,8.26L12,2Z"
      />
    </svg>
  </motion.div>
);

export const DecorationBorder = () => (
  <div className="absolute inset-0 rounded-xl opacity-10 pointer-events-none">
    <div className="absolute top-0 left-0 w-20 h-20 border-t-2 border-l-2 border-[#6f0e06] rounded-tl-xl"></div>
    <div className="absolute top-0 right-0 w-20 h-20 border-t-2 border-r-2 border-[#6f0e06] rounded-tr-xl"></div>
    <div className="absolute bottom-0 left-0 w-20 h-20 border-b-2 border-l-2 border-[#6f0e06] rounded-bl-xl"></div>
    <div className="absolute bottom-0 right-0 w-20 h-20 border-b-2 border-r-2 border-[#6f0e06] rounded-br-xl"></div>
  </div>
);

// New enhanced decorative elements
export const ColorfulOrbs = ({ count = 5 }) => {
  const orbs = Array.from({ length: count }, (_, i) => ({
    id: i,
    size: 80 + Math.random() * 120,
    x: Math.random() * 100,
    y: Math.random() * 100,
    delay: Math.random() * 5,
    duration: 15 + Math.random() * 20,
    color: [
      'rgba(186, 26, 93, 0.08)',
      'rgba(249, 168, 212, 0.08)',
      'rgba(216, 180, 254, 0.08)',
      'rgba(129, 140, 248, 0.08)',
      'rgba(253, 186, 116, 0.08)'
    ][Math.floor(Math.random() * 5)]
  }));

  return (
    <>
      {orbs.map((orb) => (
        <motion.div
          key={orb.id}
          className="absolute rounded-full"
          style={{
            width: orb.size,
            height: orb.size,
            background: orb.color,
            filter: 'blur(40px)',
            left: `${orb.x}%`,
            top: `${orb.y}%`,
            zIndex: 0,
          }}
          initial={{ scale: 0, opacity: 0 }}
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.7, 0.3],
            x: [0, -30, 0, 30, 0],
            y: [0, 30, 0, -30, 0],
          }}
          transition={{
            duration: orb.duration,
            delay: orb.delay,
            repeat: Infinity,
            repeatType: "reverse",
          }}
        />
      ))}
    </>
  );
};

export const PaislayPattern = ({ top, left, size = 100, rotation = 0, opacity = 0.07 }) => (
  <motion.div
    className="absolute"
    style={{
      top: `${top}%`,
      left: `${left}%`,
      width: size,
      height: size,
      opacity,
      rotate: rotation,
    }}
    initial={{ opacity: 0 }}
    animate={{ opacity, rotate: rotation }}
    transition={{ duration: 1 }}
  >
    <svg viewBox="0 0 100 100" className="w-full h-full text-[#6f0e06]">
      <path
        fill="currentColor"
        d="M50,15 C40,15 30,25 25,35 C20,45 20,60 35,70 C45,77 60,75 65,60 C68,50 65,40 55,35 C50,32 45,35 45,40 C45,43 48,45 50,43 C52,41 51,39 49,39 C48,39 47,40 47,41 C47,42 48,42 49,41.5 C50,41 50,42 49,43 C48,44 46,43 46,41 C46,38 48,37 51,38 C55,41 58,48 55,55 C53,65 40,68 32,60 C22,52 25,40 30,33 C35,25 42,18 50,18 C75,18 80,45 75,60 C70,75 55,85 40,80 C25,75 15,60 20,40 C25,20 40,5 60,10 C80,15 90,35 85,55 C80,75 60,85 40,80"
      />
    </svg>
  </motion.div>
);

export const WishlistDecorativeBorder = ({ color = "#6f0e06" }) => (
  <div className="absolute inset-0 pointer-events-none overflow-hidden">
    {/* Top left */}
    <motion.div
      initial={{ opacity: 0, x: -20, y: -20 }}
      animate={{ opacity: 1, x: 0, y: 0 }}
      transition={{ duration: 1, delay: 0.2 }}
      className="absolute top-0 left-0"
    >
      <svg width="80" height="80" viewBox="0 0 80 80" fill="none">
        <path 
          d="M0 16C0 7.16344 7.16344 0 16 0H24V8H16C11.5817 8 8 11.5817 8 16V24H0V16Z" 
          fill={color} 
          fillOpacity="0.2"
        />
      </svg>
    </motion.div>
    
    {/* Top right */}
    <motion.div
      initial={{ opacity: 0, x: 20, y: -20 }}
      animate={{ opacity: 1, x: 0, y: 0 }}
      transition={{ duration: 1, delay: 0.4 }}
      className="absolute top-0 right-0"
    >
      <svg width="80" height="80" viewBox="0 0 80 80" fill="none">
        <path 
          d="M80 16C80 7.16344 72.8366 0 64 0H56V8H64C68.4183 8 72 11.5817 72 16V24H80V16Z" 
          fill={color} 
          fillOpacity="0.2"
        />
      </svg>
    </motion.div>
    
    {/* Bottom left */}
    <motion.div
      initial={{ opacity: 0, x: -20, y: 20 }}
      animate={{ opacity: 1, x: 0, y: 0 }}
      transition={{ duration: 1, delay: 0.6 }}
      className="absolute bottom-0 left-0"
    >
      <svg width="80" height="80" viewBox="0 0 80 80" fill="none">
        <path 
          d="M0 64C0 72.8366 7.16344 80 16 80H24V72H16C11.5817 72 8 68.4183 8 64V56H0V64Z" 
          fill={color} 
          fillOpacity="0.2"
        />
      </svg>
    </motion.div>
    
    {/* Bottom right */}
    <motion.div
      initial={{ opacity: 0, x: 20, y: 20 }}
      animate={{ opacity: 1, x: 0, y: 0 }}
      transition={{ duration: 1, delay: 0.8 }}
      className="absolute bottom-0 right-0"
    >
      <svg width="80" height="80" viewBox="0 0 80 80" fill="none">
        <path 
          d="M80 64C80 72.8366 72.8366 80 64 80H56V72H64C68.4183 72 72 68.4183 72 64V56H80V64Z" 
          fill={color} 
          fillOpacity="0.2"
        />
      </svg>
    </motion.div>
  </div>
);

export const AnimatedCounter = ({ start = 0, end = 100, duration = 1.5 }) => {
  const [count, setCount] = React.useState(start);

  React.useEffect(() => {
    let startTime;
    let animationFrame;

    const animate = (timestamp) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / (duration * 1000), 1);
      const currentCount = Math.floor(progress * (end - start) + start);
      
      setCount(currentCount);

      if (progress < 1) {
        animationFrame = requestAnimationFrame(animate);
      }
    };

    animationFrame = requestAnimationFrame(animate);

    return () => cancelAnimationFrame(animationFrame);
  }, [start, end, duration]);

  return <span>{count}</span>;
};

export const TiltCard = ({ children, intensity = 15 }) => {
  const [tiltValues, setTiltValues] = React.useState({ x: 0, y: 0 });
  const [isHovering, setIsHovering] = React.useState(false);

  const handleMouseMove = (e) => {
    if (!isHovering) return;
    
    const card = e.currentTarget;
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    
    const tiltX = ((y - centerY) / centerY) * intensity;
    const tiltY = ((centerX - x) / centerX) * intensity;
    
    setTiltValues({ x: tiltX, y: tiltY });
  };

  return (
    <motion.div
      onMouseEnter={() => setIsHovering(true)}
      onMouseMove={handleMouseMove}
      onMouseLeave={() => {
        setIsHovering(false);
        setTiltValues({ x: 0, y: 0 });
      }}
      animate={{
        rotateX: tiltValues.x,
        rotateY: tiltValues.y,
        transformPerspective: 1000,
      }}
      transition={{ type: "spring", stiffness: 400, damping: 20 }}
      style={{ transformStyle: "preserve-3d" }}
      className="h-full w-full"
    >
      {children}
    </motion.div>
  );
};

export const ShimmerButton = ({ children, className, ...props }) => {
  return (
    <motion.button
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className={`relative overflow-hidden ${className}`}
      {...props}
    >
      {children}
      <motion.div
        initial={{ x: "-100%", opacity: 0.8 }}
        animate={{ x: "200%" }}
        transition={{ repeat: Infinity, duration: 2, ease: "linear", repeatDelay: 1 }}
        className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/20 to-transparent"
        style={{ transform: "skewX(-15deg)" }}
      />
    </motion.button>
  );
};

export default {
  HeartPattern,
  FloatingHeart,
  SparkleEffect,
  DecorationBorder,
  ColorfulOrbs,
  PaislayPattern,
  WishlistDecorativeBorder,
  AnimatedCounter,
  TiltCard,
  ShimmerButton
}; 