import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';

const WishlistConfetti = ({ trigger, duration = 3000 }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [particles, setParticles] = useState([]);

  useEffect(() => {
    if (trigger) {
      // Generate confetti particles
      const newParticles = Array.from({ length: 50 }, (_, i) => ({
        id: i,
        x: Math.random() * 100,
        y: -10 - Math.random() * 40,
        size: 5 + Math.random() * 15,
        rotation: Math.random() * 360,
        color: [
          '#6f0e06', // Pink
          '#f472b6', // Lighter pink
          '#fecdd3', // Very light pink
          '#ffe4e6', // Almost white pink
          '#4f46e5', // Indigo
          '#c7d2fe', // Light indigo
          '#eef2ff', // Very light indigo
          '#fcd34d', // Amber
          '#fef3c7', // Light amber
        ][Math.floor(Math.random() * 9)],
        delay: Math.random() * 0.5,
        duration: 1 + Math.random() * 2
      }));
      
      setParticles(newParticles);
      setIsVisible(true);
      
      // Hide confetti after duration
      const timer = setTimeout(() => {
        setIsVisible(false);
      }, duration);
      
      return () => clearTimeout(timer);
    }
  }, [trigger, duration]);

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
      {particles.map((particle) => (
        <motion.div
          key={particle.id}
          initial={{
            x: `${particle.x}vw`,
            y: `${particle.y}vh`,
            scale: 0,
            rotate: 0,
            opacity: 1
          }}
          animate={{
            x: [`${particle.x}vw`, `${particle.x + (Math.random() * 20 - 10)}vw`],
            y: [`${particle.y}vh`, '100vh'],
            scale: [0, 1, 0.8],
            rotate: [0, particle.rotation, particle.rotation * 2],
            opacity: [0, 1, 0]
          }}
          transition={{
            duration: particle.duration,
            delay: particle.delay,
            ease: [0.1, 0.4, 0.7, 0.9]
          }}
          style={{
            position: 'absolute', 
            width: particle.size, 
            height: particle.size,
            backgroundColor: particle.color,
            borderRadius: Math.random() > 0.5 ? '50%' : '2px'
          }}
        />
      ))}
    </div>
  );
};

export default WishlistConfetti; 