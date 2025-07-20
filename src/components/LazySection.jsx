import React, { useState, useRef, useEffect } from 'react';

const LazySection = ({ 
  children, 
  fallback = null, 
  threshold = 0.1, 
  rootMargin = '50px',
  triggerOnce = true 
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [hasBeenVisible, setHasBeenVisible] = useState(false);
  const elementRef = useRef();

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          if (triggerOnce && !hasBeenVisible) {
            setHasBeenVisible(true);
          }
        } else if (!triggerOnce) {
          setIsVisible(false);
        }
      },
      {
        threshold,
        rootMargin,
      }
    );

    const currentElement = elementRef.current;
    if (currentElement) {
      observer.observe(currentElement);
    }

    return () => {
      if (currentElement) {
        observer.unobserve(currentElement);
      }
    };
  }, [threshold, rootMargin, triggerOnce, hasBeenVisible]);

  const shouldRender = triggerOnce ? hasBeenVisible || isVisible : isVisible;

  return (
    <div ref={elementRef}>
      {shouldRender ? children : fallback}
    </div>
  );
};

export default LazySection;