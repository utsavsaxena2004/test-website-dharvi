import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { supabaseService } from '../services/supabaseService';
import { Button } from '@/components/ui/button';
import { 
  Camera,
  Filter,
  Grid,
  List,
  Search,
  Calendar,
  ArrowLeft,
  Eye,
  Heart,
  Share2,
  Download,
  X
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const GalleryPage = () => {
  const navigate = useNavigate();
  const [images, setImages] = useState([]);
  const [filteredImages, setFilteredImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(null);
  const [imageIndex, setImageIndex] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('newest');
  const [viewMode, setViewMode] = useState('masonry');

  useEffect(() => {
    fetchGalleryImages();
  }, []);

  useEffect(() => {
    filterAndSortImages();
  }, [images, searchQuery, sortBy]);

  const fetchGalleryImages = async () => {
    try {
      setLoading(true);
      const galleryImages = await supabaseService.getGalleryImages();
      setImages(galleryImages);
    } catch (error) {
      console.error('Error fetching gallery images:', error);
    } finally {
      setLoading(false);
    }
  };

  const filterAndSortImages = () => {
    let filtered = [...images];

    // Filter by search query
    if (searchQuery) {
      filtered = filtered.filter(image => 
        image.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        image.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        image.tags?.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
      );
    }

    // Sort images
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'newest':
          return new Date(b.created_at) - new Date(a.created_at);
        case 'oldest':
          return new Date(a.created_at) - new Date(b.created_at);
        case 'title':
          return (a.title || '').localeCompare(b.title || '');
        default:
          return 0;
      }
    });

    setFilteredImages(filtered);
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
      ? (imageIndex + 1) % filteredImages.length 
      : (imageIndex - 1 + filteredImages.length) % filteredImages.length;
    
    setImageIndex(newIndex);
    setSelectedImage(filteredImages[newIndex]);
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

  const renderMasonryLayout = () => (
    <div className="columns-1 md:columns-2 lg:columns-3 xl:columns-4 gap-4 space-y-4">
      {filteredImages.map((image, index) => (
        <motion.div
          key={image.id}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: index * 0.05 }}
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
    </div>
  );

  const renderGridLayout = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {filteredImages.map((image, index) => (
        <motion.div
          key={image.id}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: index * 0.05 }}
          className="group cursor-pointer"
          onClick={() => openModal(image, index)}
        >
          <div className="relative overflow-hidden rounded-lg bg-white shadow-md hover:shadow-xl transition-all duration-300 border border-rose-100 aspect-square">
            <img
              src={image.image_url}
              alt={image.title || 'Gallery image'}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              loading="lazy"
            />
            
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
    </div>
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-rose-50 via-white to-pink-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#6f0e06] mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading gallery...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="min-h-screen bg-gradient-to-br from-rose-50 via-white to-pink-50">
        {/* Header */}
        <div className="bg-white shadow-sm border-b border-rose-100">
          <div className="max-w-7xl mx-auto px-6 py-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <Button
                  variant="ghost"
                  onClick={() => navigate('/')}
                  className="text-gray-600 hover:text-[#6f0e06]"
                >
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back to Home
                </Button>
                <div className="h-6 w-px bg-gray-300" />
                <div className="flex items-center">
                  <Camera className="w-8 h-8 text-[#6f0e06] mr-3" />
                  <h1 className="text-3xl font-serif text-gray-900">Gallery</h1>
                </div>
              </div>
              
              <div className="text-sm text-gray-600">
                {filteredImages.length} {filteredImages.length === 1 ? 'Image' : 'Images'}
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-6 py-8">
          {/* Filters and Controls */}
          <div className="mb-8 space-y-4">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              {/* Search */}
              <div className="relative flex-1 max-w-md">
                <Search className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search images..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#6f0e06] focus:border-transparent"
                />
              </div>

              {/* Controls */}
              <div className="flex items-center space-x-4">
                {/* Sort */}
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#6f0e06] focus:border-transparent text-sm"
                >
                  <option value="newest">Newest First</option>
                  <option value="oldest">Oldest First</option>
                  <option value="title">By Title</option>
                </select>

                {/* View Mode */}
                <div className="flex items-center border border-gray-300 rounded-lg overflow-hidden">
                  <button
                    onClick={() => setViewMode('masonry')}
                    className={`p-2 ${viewMode === 'masonry' ? 'bg-[#6f0e06] text-white' : 'text-gray-600 hover:bg-gray-100'}`}
                  >
                    <Grid className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setViewMode('grid')}
                    className={`p-2 ${viewMode === 'grid' ? 'bg-[#6f0e06] text-white' : 'text-gray-600 hover:bg-gray-100'}`}
                  >
                    <List className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Gallery */}
          {filteredImages.length > 0 ? (
            <motion.div
              key={viewMode}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
            >
              {viewMode === 'masonry' ? renderMasonryLayout() : renderGridLayout()}
            </motion.div>
          ) : (
            <div className="text-center py-16">
              <Camera className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-medium text-gray-900 mb-2">
                {searchQuery ? 'No images found' : 'No images yet'}
              </h3>
              <p className="text-gray-600">
                {searchQuery 
                  ? `No images match "${searchQuery}". Try a different search term.`
                  : 'Our gallery is being curated. Check back soon!'
                }
              </p>
              {searchQuery && (
                <Button
                  onClick={() => setSearchQuery('')}
                  variant="outline"
                  className="mt-4"
                >
                  Clear Search
                </Button>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Image Modal */}
      {selectedImage && (
        <div className="fixed inset-0 bg-black/90 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="relative max-w-5xl w-full max-h-[95vh] bg-white rounded-lg overflow-hidden shadow-2xl"
          >
            {/* Close Button */}
            <button
              onClick={closeModal}
              className="absolute top-4 right-4 z-10 bg-black/50 text-white p-2 rounded-full hover:bg-black/70 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Navigation Buttons */}
            {filteredImages.length > 1 && (
              <>
                <button
                  onClick={() => navigateImage('prev')}
                  className="absolute left-4 top-1/2 transform -translate-y-1/2 z-10 bg-black/50 text-white p-2 rounded-full hover:bg-black/70 transition-colors"
                >
                  <ArrowLeft className="w-5 h-5" />
                </button>
                <button
                  onClick={() => navigateImage('next')}
                  className="absolute right-16 top-1/2 transform -translate-y-1/2 z-10 bg-black/50 text-white p-2 rounded-full hover:bg-black/70 transition-colors"
                >
                  <ArrowLeft className="w-5 h-5 rotate-180" />
                </button>
              </>
            )}

            {/* Image */}
            <div className="relative">
              <img
                src={selectedImage.image_url}
                alt={selectedImage.title || 'Gallery image'}
                className="w-full h-auto max-h-[75vh] object-contain"
              />
              
              {/* Image Info Overlay */}
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
                {imageIndex + 1} of {filteredImages.length}
                {selectedImage.created_at && (
                  <span className="ml-2">
                    • {new Date(selectedImage.created_at).toLocaleDateString()}
                  </span>
                )}
              </div>
              
              <div className="flex items-center space-x-2">
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-gray-600 hover:text-[#6f0e06]"
                >
                  <Heart className="w-4 h-4 mr-1" />
                  Like
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-gray-600 hover:text-[#6f0e06]"
                >
                  <Share2 className="w-4 h-4 mr-1" />
                  Share
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-gray-600 hover:text-[#6f0e06]"
                >
                  <Download className="w-4 h-4 mr-1" />
                  Download
                </Button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </>
  );
};

export default GalleryPage;