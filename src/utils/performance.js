// Performance utilities

// Debounce function
export const debounce = (func, delay) => {
  let timeoutId;
  return (...args) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func.apply(null, args), delay);
  };
};

// Throttle function
export const throttle = (func, limit) => {
  let inThrottle;
  return function(...args) {
    if (!inThrottle) {
      func.apply(this, args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  };
};

// Preload critical images
export const preloadImages = (imageUrls) => {
  if (!Array.isArray(imageUrls)) return;
  
  imageUrls.forEach(url => {
    const img = new Image();
    img.src = url;
  });
};

// Lazy load with intersection observer
export const lazyLoad = (selector = '[data-lazy]') => {
  if ('IntersectionObserver' in window) {
    const imageObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const img = entry.target;
          img.src = img.dataset.lazy;
          img.classList.remove('lazy');
          observer.unobserve(img);
        }
      });
    });

    document.querySelectorAll(selector).forEach(img => {
      imageObserver.observe(img);
    });
  }
};

// Optimize images for different screen sizes
export const getOptimizedImageUrl = (baseUrl, width = 800, quality = 80) => {
  if (!baseUrl) return '';
  
  // If it's an Unsplash URL, add optimization parameters
  if (baseUrl.includes('unsplash.com')) {
    const url = new URL(baseUrl);
    url.searchParams.set('w', width);
    url.searchParams.set('q', quality);
    url.searchParams.set('auto', 'format');
    url.searchParams.set('fit', 'crop');
    return url.toString();
  }
  
  return baseUrl;
};

// Bundle analyzer helper
export const measurePerformance = (name, fn) => {
  const start = performance.now();
  const result = fn();
  const end = performance.now();
  console.log(`${name} took ${end - start} milliseconds`);
  return result;
};

// Web Vitals tracking
export const trackWebVitals = () => {
  // Track FCP, LCP, CLS, FID
  if ('web-vital' in window) {
    // This would require web-vitals library
    // import { getCLS, getFID, getFCP, getLCP, getTTFB } from 'web-vitals';
  }
};

// Resource hints
export const addResourceHints = () => {
  const head = document.head;
  
  // DNS prefetch for external domains
  const dnsPrefetches = [
    'https://images.unsplash.com',
    'https://fonts.googleapis.com',
    'https://fonts.gstatic.com'
  ];
  
  dnsPrefetches.forEach(domain => {
    const link = document.createElement('link');
    link.rel = 'dns-prefetch';
    link.href = domain;
    head.appendChild(link);
  });
};

// Service Worker registration
export const registerServiceWorker = () => {
  if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
      navigator.serviceWorker.register('/sw.js')
        .then(registration => {
          console.log('SW registered: ', registration);
        })
        .catch(registrationError => {
          console.log('SW registration failed: ', registrationError);
        });
    });
  }
};