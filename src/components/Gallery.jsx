import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { supabaseService } from '../services/supabaseService';
import { Button } from '@/components/ui/button';
import { 
  Eye,
  ArrowRight,
  Camera,
  Heart,
  Share2,
  X
} from 'lucide-react';

const Gallery = ({ showAll = false, limit = 8 }) => {
  const navigate = useNavigate();
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(null);
  const [imageIndex, setImageIndex] = useState(0);

  useEffect(() => {
    fetchGalleryImages();
  }, []);

  const fetchGalleryImages = async () => {
    try {
      setLoading(true);
      const galleryImages = await supabaseService.getGalleryImages(showAll ? null : limit);
      setImages(galleryImages);
    } catch (error) {
      console.error('Error fetching gallery images:', error);
    } finally {
      setLoading(false);
    }
  };

  const openModal = (image, index) => {
    setSelectedImage(image);
    setImageIndex(index);
  };

  const closeModal = () => {
    setSelectedImage(null);
    setImageIndex(0);
  };

  const navigateImage = (direction) => {
    const newIndex = direction === 'next' 
      ? (imageIndex + 1) % images.length 
      : (imageIndex - 1 + images.length) % images.length;
    
    setImageIndex(newIndex);
    setSelectedImage(images[newIndex]);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Escape') closeModal();
    if (e.key === 'ArrowRight') navigateImage('next');
    if (e.key === 'ArrowLeft') navigateImage('prev');
  };

  useEffect(() => {
    if (selectedImage) {
      window.addEventListener('keydown', handleKeyPress);
      return () => window.removeEventListener('keydown', handleKeyPress);
    }
  }, [selectedImage, imageIndex]);

  if (loading) {
    return (
      <div className="py-16 bg-gradient-to-br from-rose-50 via-white to-pink-50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#6f0e06] mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading gallery...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <section className="py-16 bg-gradient-to-br from-rose-50 via-white to-pink-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <div className="flex items-center justify-center mb-4">
              <Camera className="w-8 h-8 text-[#6f0e06] mr-3 -mt-10" />
              <h2 className="text-3xl md:text-5xl font-semibold text-gray-900 mb-4 relative">
              From Our, <span className="relative inline-block">
                <span className="text-pink">Camera Roll</span>
                <motion.span 
                  className="absolute bottom-0 left-0 h-1 bg-pink/30 rounded-full w-full"
                  initial={{ width: 0 }}
                  animate={{ width: "100%" }}
                  transition={{ duration: 1, delay: 1 }}
                />
              </span>
            </h2>
            </div>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Tap to spill the tea - every picture has a story
            </p>
          </motion.div>

          {/* Gallery Grid */}
          {images.length > 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              viewport={{ once: true }}
              className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-6 lg:gap-8"
            >
              {images.map((image, index) => (
                <motion.div
                  key={image.id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="break-inside-avoid mb-4 group cursor-pointer"
                  onClick={() => openModal(image, index)}
                >
                  <div className="relative overflow-hidden rounded-lg bg-white shadow-md hover:shadow-xl transition-all duration-300 border border-rose-100">
                    <img
                      src={image.image_url}
                      alt={image.title || 'Gallery image'}
                      className="w-full h-auto object-cover group-hover:scale-105 transition-transform duration-500"
                      loading="lazy"
                    />
                    
                    {/* Overlay */}
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                      <div className="text-white text-center p-4">
                        <Eye className="w-8 h-8 mx-auto mb-2" />
                        <p className="font-medium">View Image</p>
                        {image.title && (
                          <p className="text-sm opacity-90 mt-1">{image.title}</p>
                        )}
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          ) : (
            <div className="text-center py-12">
              <Camera className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-medium text-gray-900 mb-2">No Images Yet</h3>
              <p className="text-gray-600">Our gallery is being curated. Check back soon!</p>
            </div>
          )}

          {/* View More Button */}
          {!showAll && images.length >= limit && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              viewport={{ once: true }}
              className="text-center mt-12"
            >
              <Button
                onClick={() => navigate('/gallery')}
                className="bg-gradient-to-r from-[#6f0e06] to-[#9a1549] hover:from-[#8b1538] hover:to-[#b91c5c] text-white px-8 py-3 rounded-full font-medium text-lg shadow-lg hover:shadow-xl transition-all duration-300 group"
              >
                View Full Gallery
                <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
              </Button>
            </motion.div>
          )}
        </div>
      </section>

      {/* Image Modal */}
      {selectedImage && (
        <div className="fixed inset-0 bg-black/90 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="relative max-w-4xl w-full max-h-[90vh] bg-white rounded-lg overflow-hidden shadow-2xl"
          >
            {/* Close Button */}
            <button
              onClick={closeModal}
              className="absolute top-4 right-4 z-10 bg-black/50 text-white p-2 rounded-full hover:bg-black/70 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Navigation Buttons */}
            {images.length > 1 && (
              <>
                <button
                  onClick={() => navigateImage('prev')}
                  className="absolute left-4 top-1/2 transform -translate-y-1/2 z-10 bg-black/50 text-white p-2 rounded-full hover:bg-black/70 transition-colors"
                >
                  <ArrowRight className="w-5 h-5 rotate-180" />
                </button>
                <button
                  onClick={() => navigateImage('next')}
                  className="absolute right-16 top-1/2 transform -translate-y-1/2 z-10 bg-black/50 text-white p-2 rounded-full hover:bg-black/70 transition-colors"
                >
                  <ArrowRight className="w-5 h-5" />
                </button>
              </>
            )}

            {/* Image */}
            <div className="relative">
              <img
                src={selectedImage.image_url}
                alt={selectedImage.title || 'Gallery image'}
                className="w-full h-auto max-h-[80vh] object-contain"
              />
              
              {/* Image Info */}
              {(selectedImage.title || selectedImage.description) && (
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-6 text-white">
                  {selectedImage.title && (
                    <h3 className="text-xl font-semibold mb-2">{selectedImage.title}</h3>
                  )}
                  {selectedImage.description && (
                    <p className="text-sm opacity-90">{selectedImage.description}</p>
                  )}
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="p-4 bg-gray-50 flex items-center justify-between">
              <div className="text-sm text-gray-600">
                {imageIndex + 1} of {images.length}
              </div>
              
              <div className="flex items-center space-x-2">
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-gray-600 hover:text-[#6f0e06]"
                  onClick={() => {
                    // Add to favorites or show toast
                    console.log('Liked image:', selectedImage.title);
                    // You can implement actual like functionality here
                  }}
                >
                  <Heart className="w-4 h-4 mr-1" />
                  Like
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-gray-600 hover:text-[#6f0e06]"
                  onClick={() => {
                    if (navigator.share) {
                      navigator.share({
                        title: selectedImage.title || 'Gallery Image',
                        text: selectedImage.description || 'Check out this beautiful image from our gallery',
                        url: selectedImage.image_url
                      });
                    } else {
                      // Fallback: copy to clipboard
                      navigator.clipboard.writeText(selectedImage.image_url);
                      console.log('Image URL copied to clipboard');
                    }
                  }}
                >
                  <Share2 className="w-4 h-4 mr-1" />
                  Share
                </Button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </>
  );
};

export default Gallery;