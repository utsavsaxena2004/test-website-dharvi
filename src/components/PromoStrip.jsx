import { useState, useEffect, useRef } from 'react';
import { ArrowLeftIcon, ArrowRightIcon } from '@heroicons/react/24/outline';

const promos = [
  { id: 1, text: "🎁 Use code FIRST20 for 20% off your first order" },
  { id: 2, text: "🚚 Free shipping on all orders above ₹2999" },
  { id: 3, text: "⚡ Flash Sale: 30% off on all Sarees until midnight" },
  { id: 4, text: "💫 Buy 2 Kurtis, get 1 free - Limited time offer" },
];

const PromoStrip = () => {
  const [currentPromoIndex, setCurrentPromoIndex] = useState(0);
  const intervalRef = useRef(null);

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
    intervalRef.current = setInterval(() => {
      nextPromo();
    }, 4000);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  return (
    <div className="bg-[#da1a5d] text-white py-2 relative z-10">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between">
          <button 
            onClick={prevPromo}
            className="hidden sm:block p-1 rounded-full hover:bg-white/20 transition-colors"
            aria-label="Previous promotion"
          >
            <ArrowLeftIcon className="h-4 w-4" />
          </button>
          
          <div className="flex-1 text-center overflow-hidden">
            <div className="relative h-6">
              {promos.map((promo, index) => (
                <div
                  key={promo.id}
                  className={`absolute inset-0 w-full transition-all duration-500 transform ${
                    index === currentPromoIndex 
                      ? 'translate-y-0 opacity-100' 
                      : 'translate-y-8 opacity-0'
                  }`}
                >
                  <p className="text-sm font-medium">{promo.text}</p>
                </div>
              ))}
            </div>
          </div>
          
          <button 
            onClick={nextPromo}
            className="hidden sm:block p-1 rounded-full hover:bg-white/20 transition-colors"
            aria-label="Next promotion"
          >
            <ArrowRightIcon className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default PromoStrip; 