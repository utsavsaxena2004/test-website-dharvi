import { useState, useEffect, useRef } from 'react';
import { ArrowLeftIcon, ArrowRightIcon } from '@heroicons/react/24/outline';
import { supabaseService } from '../services/supabaseService';

const DynamicPromoStrip = () => {
  const [promos, setPromos] = useState([]);
  const [currentPromoIndex, setCurrentPromoIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const intervalRef = useRef(null);

  useEffect(() => {
    const fetchPromos = async () => {
      try {
        setLoading(true);
        const settings = await supabaseService.getSettings();
        
        // Check if settings has promotional content
        if (settings && settings.promotional_messages) {
          const messages = Array.isArray(settings.promotional_messages) 
            ? settings.promotional_messages 
            : JSON.parse(settings.promotional_messages || '[]');
          
          if (messages.length > 0) {
            setPromos(messages);
          } else {
            // Fallback to default promos if no custom ones
            setPromos([
              { id: 1, text: "🎁 Welcome to our store! Explore our latest collection" },
              { id: 2, text: "🚚 Free shipping on all orders above ₹2999" },
              { id: 3, text: "⚡ New arrivals every week - Stay updated!" },
              { id: 4, text: "💫 Quality guaranteed - 100% authentic products" },
            ]);
          }
        } else {
          // Default promos if no settings found
          setPromos([
            { id: 1, text: "🎁 Welcome to our store! Explore our latest collection" },
            { id: 2, text: "🚚 Free shipping on all orders above ₹2999" },
            { id: 3, text: "⚡ New arrivals every week - Stay updated!" },
            { id: 4, text: "💫 Quality guaranteed - 100% authentic products" },
          ]);
        }
      } catch (error) {
        console.error('Error fetching promotional messages:', error);
        // Fallback to default promos on error
        setPromos([
          { id: 1, text: "🎁 Welcome to our store! Explore our latest collection" },
          { id: 2, text: "🚚 Free shipping on all orders above ₹2999" },
          { id: 3, text: "⚡ New arrivals every week - Stay updated!" },
          { id: 4, text: "💫 Quality guaranteed - 100% authentic products" },
        ]);
      } finally {
        setLoading(false);
      }
    };

    fetchPromos();
  }, []);

  const nextPromo = () => {
    setCurrentPromoIndex((prevIndex) => 
      prevIndex === promos.length - 1 ? 0 : prevIndex + 1
    );
  };

  const prevPromo = () => {
    setCurrentPromoIndex((prevIndex) => 
      prevIndex === 0 ? promos.length - 1 : prevIndex - 1
    );
  };

  useEffect(() => {
    if (promos.length > 1) {
      intervalRef.current = setInterval(() => {
        nextPromo();
      }, 4000);

      return () => {
        if (intervalRef.current) {
          clearInterval(intervalRef.current);
        }
      };
    }
  }, [promos.length]);

  if (loading) {
    return (
      <div className="bg-gradient-to-r from-pink to-pink text-white py-2">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-center">
            <div className="animate-pulse">
              <div className="h-4 bg-white/20 rounded w-64"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (promos.length === 0) {
    return null; // Don't render anything if no promos
  }

  return (
    <div className="bg-gradient-to-r from-pink to-pink text-white py-2 relative overflow-hidden">
      {/* Background pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0 bg-[url('/patterns/dots.svg')] opacity-30"></div>
      </div>
      
      <div className="container mx-auto px-4 relative">
        <div className="flex items-center justify-center">
          {/* Previous button */}
          {promos.length > 1 && (
            <button
              onClick={prevPromo}
              className="p-1 hover:bg-white/20 rounded-full transition-colors duration-200 mr-4"
              aria-label="Previous promotion"
            >
              <ArrowLeftIcon className="h-4 w-4" />
            </button>
          )}
          
          {/* Promotion text */}
          <div className="flex-1 text-center">
            <p className="text-sm font-medium animate-fade-in">
              {promos[currentPromoIndex]?.text}
            </p>
          </div>
          
          {/* Next button */}
          {promos.length > 1 && (
            <button
              onClick={nextPromo}
              className="p-1 hover:bg-white/20 rounded-full transition-colors duration-200 ml-4"
              aria-label="Next promotion"
            >
              <ArrowRightIcon className="h-4 w-4" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default DynamicPromoStrip; 