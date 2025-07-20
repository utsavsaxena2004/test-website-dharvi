import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { supabaseService } from '../../services/supabaseService';
import { supabase } from '../../integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { 
  Plus,
  Upload,
  Eye,
  Edit,
  Trash2,
  Image as ImageIcon,
  Save,
  X,
  Camera,
  Tag,
  Calendar,
  ToggleLeft,
  ToggleRight
} from 'lucide-react';

const GalleryManagement = () => {
  const { toast } = useToast();
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingImage, setEditingImage] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [previewImage, setPreviewImage] = useState(null);
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [uploadProgress, setUploadProgress] = useState({});
  const [dragActive, setDragActive] = useState(false);
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    image_url: '',
    tags: '',
    is_active: true
  });

  useEffect(() => {
    fetchGalleryImages();
  }, []);

  const fetchGalleryImages = async () => {
    try {
      setLoading(true);
      const galleryImages = await supabaseService.getAllGalleryImages();
      setImages(galleryImages);
    } catch (error) {
      console.error('Error fetching gallery images:', error);
      toast({
        title: "Error",
        description: "Failed to load gallery images",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const files = Array.from(e.dataTransfer.files).filter(file => file.type.startsWith('image/'));
      setSelectedFiles(files);
      setShowForm(true);
    }
  };

  const handleFileSelect = (e) => {
    const files = Array.from(e.target.files).filter(file => file.type.startsWith('image/'));
    setSelectedFiles(files);
    if (files.length > 0) {
      setShowForm(true);
    }
  };

  const uploadSingleImage = async (file, index) => {
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random()}-${Date.now()}.${fileExt}`;
      const filePath = `gallery/${fileName}`;

      // Update progress
      setUploadProgress(prev => ({
        ...prev,
        [index]: { status: 'uploading', progress: 0 }
      }));

      const { data, error } = await supabase.storage
        .from('images')
        .upload(filePath, file);

      if (error) throw error;

      const { data: { publicUrl } } = supabase.storage
        .from('images')
        .getPublicUrl(filePath);

      // Update progress
      setUploadProgress(prev => ({
        ...prev,
        [index]: { status: 'processing', progress: 50 }
      }));

      return publicUrl;
    } catch (error) {
      setUploadProgress(prev => ({
        ...prev,
        [index]: { status: 'error', progress: 0 }
      }));
      throw error;
    }
  };

  const handleBulkUpload = async (e) => {
    e.preventDefault();
    
    if (!formData.title.trim()) {
      toast({
        title: "Error",
        description: "Title is required for bulk upload",
        variant: "destructive"
      });
      return;
    }

    if (selectedFiles.length === 0) {
      toast({
        title: "Error", 
        description: "Please select at least one image",
        variant: "destructive"
      });
      return;
    }

    try {
      setUploading(true);
      const uploadPromises = selectedFiles.map((file, index) => uploadSingleImage(file, index));
      
      const imageUrls = await Promise.all(uploadPromises);
      
      // Create gallery entries for all images
      const imageData = {
        title: formData.title,
        description: formData.description,
        tags: formData.tags ? formData.tags.split(',').map(tag => tag.trim()).filter(Boolean) : [],
        is_active: formData.is_active
      };

      const createPromises = imageUrls.map((imageUrl, index) => {
        setUploadProgress(prev => ({
          ...prev,
          [index]: { status: 'saving', progress: 75 }
        }));
        
        return supabaseService.createGalleryImage({
          ...imageData,
          image_url: imageUrl,
          title: selectedFiles.length > 1 ? `${formData.title} ${index + 1}` : formData.title
        });
      });

      await Promise.all(createPromises);

      // Mark all as complete
      selectedFiles.forEach((_, index) => {
        setUploadProgress(prev => ({
          ...prev,
          [index]: { status: 'complete', progress: 100 }
        }));
      });

      toast({
        title: "Success",
        description: `${selectedFiles.length} image(s) uploaded successfully`
      });

      // Reset form
      setFormData({
        title: '',
        description: '',
        image_url: '',
        tags: '',
        is_active: true
      });
      setSelectedFiles([]);
      setUploadProgress({});
      setShowForm(false);
      fetchGalleryImages();
    } catch (error) {
      console.error('Error in bulk upload:', error);
      toast({
        title: "Error",
        description: "Failed to upload some images",
        variant: "destructive"
      });
    } finally {
      setUploading(false);
    }
  };

  const handleSingleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    try {
      setUploading(true);
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random()}-${Date.now()}.${fileExt}`;
      const filePath = `gallery/${fileName}`;

      const { data, error } = await supabase.storage
        .from('images')
        .upload(filePath, file);

      if (error) throw error;

      const { data: { publicUrl } } = supabase.storage
        .from('images')
        .getPublicUrl(filePath);

      setFormData(prev => ({
        ...prev,
        image_url: publicUrl
      }));

      toast({
        title: "Success",
        description: "Image uploaded successfully"
      });
    } catch (error) {
      console.error('Error uploading image:', error);
      toast({
        title: "Error",
        description: "Failed to upload image",
        variant: "destructive"
      });
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Handle bulk upload if multiple files selected
    if (selectedFiles.length > 0) {
      return handleBulkUpload(e);
    }
    
    if (!formData.title.trim() || !formData.image_url.trim()) {
      toast({
        title: "Error",
        description: "Title and image are required",
        variant: "destructive"
      });
      return;
    }

    try {
      const imageData = {
        ...formData,
        tags: formData.tags ? formData.tags.split(',').map(tag => tag.trim()).filter(Boolean) : []
      };

      if (editingImage) {
        await supabaseService.updateGalleryImage(editingImage.id, imageData);
        toast({
          title: "Success",
          description: "Gallery image updated successfully"
        });
      } else {
        await supabaseService.createGalleryImage(imageData);
        toast({
          title: "Success",
          description: "Gallery image created successfully"
        });
      }

      setFormData({
        title: '',
        description: '',
        image_url: '',
        tags: '',
        is_active: true
      });
      setShowForm(false);
      setEditingImage(null);
      fetchGalleryImages();
    } catch (error) {
      console.error('Error saving gallery image:', error);
      toast({
        title: "Error",
        description: "Failed to save gallery image",
        variant: "destructive"
      });
    }
  };

  const handleEdit = (image) => {
    setEditingImage(image);
    setFormData({
      title: image.title || '',
      description: image.description || '',
      image_url: image.image_url || '',
      tags: image.tags ? image.tags.join(', ') : '',
      is_active: image.is_active
    });
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this image?')) {
      return;
    }

    try {
      await supabaseService.deleteGalleryImage(id);
      toast({
        title: "Success",
        description: "Gallery image deleted successfully"
      });
      fetchGalleryImages();
    } catch (error) {
      console.error('Error deleting gallery image:', error);
      toast({
        title: "Error",
        description: "Failed to delete gallery image",
        variant: "destructive"
      });
    }
  };

  const toggleImageStatus = async (image) => {
    try {
      await supabaseService.updateGalleryImage(image.id, {
        is_active: !image.is_active
      });
      toast({
        title: "Success",
        description: `Image ${!image.is_active ? 'activated' : 'deactivated'} successfully`
      });
      fetchGalleryImages();
    } catch (error) {
      console.error('Error toggling image status:', error);
      toast({
        title: "Error",
        description: "Failed to update image status",
        variant: "destructive"
      });
    }
  };

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      image_url: '',
      tags: '',
      is_active: true
    });
    setSelectedFiles([]);
    setUploadProgress({});
    setShowForm(false);
    setEditingImage(null);
  };

  return (
    <div 
      className="space-y-6"
      onDragEnter={handleDrag}
      onDragLeave={handleDrag}
      onDragOver={handleDrag}
      onDrop={handleDrop}
    >
      {/* Drag and Drop Overlay */}
      {dragActive && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center">
          <div className="bg-white rounded-lg p-8 text-center border-2 border-dashed border-[#6f0e06] max-w-md mx-4">
            <Upload className="w-16 h-16 text-[#6f0e06] mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Drop Images Here</h3>
            <p className="text-gray-600">Release to upload multiple images at once</p>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="flex justify-between items-center">
        <div className="flex items-center space-x-3">
          <Camera className="w-6 h-6 text-[#6f0e06]" />
          <h2 className="text-2xl font-bold text-gray-900">Gallery Management</h2>
        </div>
        <div className="flex space-x-3">
          <input
            type="file"
            multiple
            accept="image/*"
            onChange={handleFileSelect}
            className="hidden"
            id="bulk-upload"
          />
          <label
            htmlFor="bulk-upload"
            className="inline-flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg cursor-pointer transition-colors"
          >
            <Upload className="w-4 h-4 mr-2" />
            Bulk Upload
          </label>
          <Button
            onClick={() => setShowForm(true)}
            className="bg-[#6f0e06] hover:bg-[#9a1549] text-white"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Single Image
          </Button>
        </div>
      </div>

      {/* Drag and Drop Zone */}
      {!showForm && (
        <div 
          className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
            dragActive 
              ? 'border-[#6f0e06] bg-rose-50' 
              : 'border-gray-300 hover:border-[#6f0e06] hover:bg-rose-50'
          }`}
        >
          <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            Drag and drop images here, or click to select
          </h3>
          <p className="text-gray-600 mb-4">
            Support for multiple images upload with shared title and tags
          </p>
          <input
            type="file"
            multiple
            accept="image/*"
            onChange={handleFileSelect}
            className="hidden"
            id="drag-drop-upload"
          />
          <label
            htmlFor="drag-drop-upload"
            className="inline-flex items-center px-6 py-3 bg-[#6f0e06] hover:bg-[#9a1549] text-white rounded-lg cursor-pointer transition-colors"
          >
            <ImageIcon className="w-5 h-5 mr-2" />
            Choose Images
          </label>
        </div>
      )}

      {/* Add/Edit Form */}
      {showForm && (
        <Card className="border-rose-200">
          <CardHeader>
            <CardTitle className="flex items-center">
              <ImageIcon className="w-5 h-5 mr-2" />
              {editingImage ? 'Edit Image' : selectedFiles.length > 0 ? `Upload ${selectedFiles.length} Images` : 'Add New Image'}
            </CardTitle>
            <CardDescription>
              {editingImage 
                ? 'Update the gallery image details' 
                : selectedFiles.length > 0 
                  ? `Upload ${selectedFiles.length} images with shared title and tags`
                  : 'Add a new image to the gallery'
              }
            </CardDescription>
          </CardHeader>
          <CardContent>
            {/* Selected Files Preview */}
            {selectedFiles.length > 0 && (
              <div className="mb-6">
                <h4 className="font-medium text-gray-900 mb-3">Selected Images ({selectedFiles.length})</h4>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-h-48 overflow-y-auto">
                  {selectedFiles.map((file, index) => (
                    <div key={index} className="relative">
                      <img
                        src={URL.createObjectURL(file)}
                        alt={`Preview ${index + 1}`}
                        className="w-full h-20 object-cover rounded-lg border border-gray-200"
                      />
                      <div className="absolute inset-0 bg-black/50 rounded-lg flex items-center justify-center text-white text-xs">
                        {uploadProgress[index] ? (
                          <div className="text-center">
                            <div className="text-xs font-medium">
                              {uploadProgress[index].status === 'uploading' && 'Uploading...'}
                              {uploadProgress[index].status === 'processing' && 'Processing...'}
                              {uploadProgress[index].status === 'saving' && 'Saving...'}
                              {uploadProgress[index].status === 'complete' && '✓ Complete'}
                              {uploadProgress[index].status === 'error' && '✗ Error'}
                            </div>
                            {uploadProgress[index].progress > 0 && (
                              <div className="w-full bg-gray-700 rounded-full h-1 mt-1">
                                <div 
                                  className="bg-white h-1 rounded-full transition-all duration-300"
                                  style={{ width: `${uploadProgress[index].progress}%` }}
                                ></div>
                              </div>
                            )}
                          </div>
                        ) : (
                          <span className="font-medium">{index + 1}</span>
                        )}
                      </div>
                      <button
                        type="button"
                        onClick={() => {
                          const newFiles = selectedFiles.filter((_, i) => i !== index);
                          setSelectedFiles(newFiles);
                          if (newFiles.length === 0) {
                            setShowForm(false);
                          }
                        }}
                        className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs hover:bg-red-600"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Title * {selectedFiles.length > 1 && <span className="text-xs text-gray-500">(will be numbered for multiple images)</span>}
                  </label>
                  <Input
                    name="title"
                    value={formData.title}
                    onChange={handleInputChange}
                    placeholder="Enter image title"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Tags (comma separated)
                  </label>
                  <Input
                    name="tags"
                    value={formData.tags}
                    onChange={handleInputChange}
                    placeholder="fashion, traditional, ethnic"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description
                </label>
                <Textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  placeholder="Enter image description"
                  rows={3}
                />
              </div>

              {/* Single Image Upload (only show if no files selected and not editing) */}
              {selectedFiles.length === 0 && !editingImage && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Single Image Upload *
                  </label>
                  <div className="space-y-2">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleSingleImageUpload}
                      className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-medium file:bg-rose-50 file:text-[#6f0e06] hover:file:bg-rose-100"
                    />
                    {uploading && (
                      <p className="text-sm text-gray-600">Uploading image...</p>
                    )}
                    {formData.image_url && (
                      <div className="mt-2">
                        <img
                          src={formData.image_url}
                          alt="Preview"
                          className="w-32 h-32 object-cover rounded-lg border border-gray-200"
                        />
                      </div>
                    )}
                  </div>
                </div>
              )}

              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  name="is_active"
                  checked={formData.is_active}
                  onChange={handleInputChange}
                  className="rounded border-gray-300 text-[#6f0e06] focus:ring-[#6f0e06]"
                />
                <label className="text-sm font-medium text-gray-700">
                  Active (visible in gallery)
                </label>
              </div>

              <div className="flex space-x-3">
                <Button
                  type="submit"
                  disabled={uploading || (selectedFiles.length === 0 && !formData.image_url && !editingImage)}
                  className="bg-[#6f0e06] hover:bg-[#9a1549] text-white"
                >
                  <Save className="w-4 h-4 mr-2" />
                  {uploading 
                    ? 'Uploading...' 
                    : editingImage 
                      ? 'Update Image' 
                      : selectedFiles.length > 0 
                        ? `Upload ${selectedFiles.length} Images`
                        : 'Add Image'
                  }
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={resetForm}
                >
                  <X className="w-4 h-4 mr-2" />
                  Cancel
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {/* Images List */}
      <Card className="border-rose-200">
        <CardHeader>
          <CardTitle>Gallery Images ({images.length})</CardTitle>
          <CardDescription>
            Manage your gallery images and their visibility
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#6f0e06] mx-auto"></div>
              <p className="mt-2 text-gray-600">Loading images...</p>
            </div>
          ) : images.length === 0 ? (
            <div className="text-center py-8">
              <ImageIcon className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No images yet</h3>
              <p className="text-gray-600 mb-4">Start building your gallery by adding some images.</p>
              <Button
                onClick={() => setShowForm(true)}
                className="bg-[#6f0e06] hover:bg-[#9a1549] text-white"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add First Image
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {images.map((image) => (
                <motion.div
                  key={image.id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="bg-white border border-gray-200 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow"
                >
                  <div className="relative">
                    <img
                      src={image.image_url}
                      alt={image.title || 'Gallery image'}
                      className="w-full h-48 object-cover"
                    />
                    <div className="absolute top-2 right-2">
                      <Button
                        onClick={() => toggleImageStatus(image)}
                        size="sm"
                        variant="ghost"
                        className={`${
                          image.is_active 
                            ? 'bg-green-100 text-green-700 hover:bg-green-200' 
                            : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
                        }`}
                      >
                        {image.is_active ? (
                          <ToggleRight className="w-4 h-4" />
                        ) : (
                          <ToggleLeft className="w-4 h-4" />
                        )}
                      </Button>
                    </div>
                  </div>
                  
                  <div className="p-4">
                    <div className="mb-3">
                      <h3 className="font-semibold text-gray-900 mb-1">
                        {image.title || 'Untitled'}
                      </h3>
                      {image.description && (
                        <p className="text-sm text-gray-600 mb-2 line-clamp-2">
                          {image.description}
                        </p>
                      )}
                      {image.tags && image.tags.length > 0 && (
                        <div className="flex flex-wrap gap-1 mb-2">
                          {image.tags.slice(0, 3).map((tag, index) => (
                            <span
                              key={index}
                              className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-rose-100 text-rose-800"
                            >
                              <Tag className="w-3 h-3 mr-1" />
                              {tag}
                            </span>
                          ))}
                          {image.tags.length > 3 && (
                            <span className="text-xs text-gray-500">
                              +{image.tags.length - 3} more
                            </span>
                          )}
                        </div>
                      )}
                      <div className="flex items-center text-xs text-gray-500">
                        <Calendar className="w-3 h-3 mr-1" />
                        {new Date(image.created_at).toLocaleDateString()}
                      </div>
                    </div>
                    
                    <div className="flex justify-between items-center">
                      <div className="flex space-x-2">
                        <Button
                          onClick={() => setPreviewImage(image)}
                          size="sm"
                          variant="ghost"
                          className="text-gray-600 hover:text-[#6f0e06]"
                        >
                          <Eye className="w-4 h-4" />
                        </Button>
                        <Button
                          onClick={() => handleEdit(image)}
                          size="sm"
                          variant="ghost"
                          className="text-gray-600 hover:text-[#6f0e06]"
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button
                          onClick={() => handleDelete(image.id)}
                          size="sm"
                          variant="ghost"
                          className="text-gray-600 hover:text-red-600"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                      
                      <div className={`px-2 py-1 rounded-full text-xs font-medium ${
                        image.is_active 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-gray-100 text-gray-600'
                      }`}>
                        {image.is_active ? 'Active' : 'Inactive'}
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Preview Modal */}
      {previewImage && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="relative max-w-4xl w-full max-h-[90vh] bg-white rounded-lg overflow-hidden">
            <button
              onClick={() => setPreviewImage(null)}
              className="absolute top-4 right-4 z-10 bg-black/50 text-white p-2 rounded-full hover:bg-black/70"
            >
              <X className="w-5 h-5" />
            </button>
            
            <img
              src={previewImage.image_url}
              alt={previewImage.title || 'Preview'}
              className="w-full h-auto max-h-[80vh] object-contain"
            />
            
            <div className="p-4 bg-gray-50">
              <h3 className="font-semibold text-gray-900">{previewImage.title}</h3>
              {previewImage.description && (
                <p className="text-sm text-gray-600 mt-1">{previewImage.description}</p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default GalleryManagement;