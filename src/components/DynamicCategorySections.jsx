import { useState, useEffect } from 'react';
import { supabaseService } from '../services/supabaseService';
import DynamicCategorySection from './DynamicCategorySection';

const DynamicCategorySections = ({ showCount = 6 }) => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoading(true);
        const data = await supabaseService.getCategories();
        setCategories(data);
      } catch (error) {
        console.error('Error fetching categories:', error);
        setCategories([]);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  if (loading) {
    return (
      <div className="space-y-20">
        {Array.from({ length: 4 }).map((_, index) => (
          <div key={index} className="py-20 bg-gray-50">
            <div className="container mx-auto px-4">
              <div className="animate-pulse">
                <div className="h-12 bg-gray-300 rounded w-64 mx-auto mb-4"></div>
                <div className="h-4 bg-gray-300 rounded w-96 mx-auto mb-16"></div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {Array.from({ length: showCount }).map((_, i) => (
                    <div key={i}>
                      <div className="h-80 bg-gray-300 rounded mb-4"></div>
                      <div className="h-4 bg-gray-300 rounded w-3/4 mx-auto mb-2"></div>
                      <div className="h-4 bg-gray-300 rounded w-1/2 mx-auto"></div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (categories.length === 0) {
    return (
      <div className="py-20 text-center">
        <h2 className="text-2xl font-serif text-gray-900 mb-4">No Categories Available</h2>
        <p className="text-gray-600">Categories will appear here once they are added.</p>
      </div>
    );
  }

  return (
    <div className="space-y-0">
      {categories.map((category, index) => (
        <DynamicCategorySection 
          key={category.id} 
          category={category} 
          showCount={showCount}
        />
      ))}
    </div>
  );
};

export default DynamicCategorySections; 