import React, { useState, useRef } from 'react';
import { Upload, X, Image as ImageIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { supabaseService } from '../services/supabaseService';
import { useToast } from '../hooks/use-toast';

const ImageUpload = ({ 
  value = [], 
  onChange, 
  multiple = false, 
  className = "",
  label = "Upload Images",
  maxFiles = 5 
}) => {
  const [uploading, setUploading] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef(null);
  const { toast } = useToast();

  // Normalize value to always be an array
  const images = Array.isArray(value) ? value : (value ? [value] : []);
  
  // Debug logging
  console.log('ImageUpload - Render - value:', value);
  console.log('ImageUpload - Render - images:', images);
  console.log('ImageUpload - Render - images.length:', images.length);
  console.log('ImageUpload - Render - images content:', images.map((img, i) => `${i}: ${img}`));

  const handleFileUpload = async (files) => {
    if (!files || files.length === 0) return;

    // Check file limits
    const totalFiles = images.length + files.length;
    if (multiple && totalFiles > maxFiles) {
      toast({
        title: "Too many files",
        description: `Maximum ${maxFiles} files allowed`,
        variant: "destructive"
      });
      return;
    }

    if (!multiple && files.length > 1) {
      toast({
        title: "Single file only",
        description: "Please select only one file",
        variant: "destructive"
      });
      return;
    }

    setUploading(true);
    
    try {
      const uploadPromises = Array.from(files).map(async (file) => {
        // Validate file type
        if (!file.type.startsWith('image/')) {
          throw new Error(`${file.name} is not an image file`);
        }

        // Validate file size (5MB limit)
        if (file.size > 5 * 1024 * 1024) {
          throw new Error(`${file.name} is too large. Maximum size is 5MB`);
        }

        return await supabaseService.uploadFile(file, 'images', multiple ? 'products' : 'categories');
      });

      const uploadedUrls = await Promise.all(uploadPromises);
      console.log('ImageUpload - uploadedUrls from storage:', uploadedUrls);
      
      if (multiple) {
        // For multiple uploads, add to existing array
        const newImages = [...images, ...uploadedUrls];
        console.log('ImageUpload - current images:', images);
        console.log('ImageUpload - new images array:', newImages);
        console.log('ImageUpload - calling onChange with newImages:', newImages);
        onChange(newImages);
      } else {
        // For single upload, replace the value
        console.log('ImageUpload - calling onChange with single URL:', uploadedUrls[0]);
        onChange(uploadedUrls[0]);
      }

      toast({
        title: "Upload successful",
        description: `${uploadedUrls.length} image(s) uploaded successfully`
      });

    } catch (error) {
      console.error('Upload error:', error);
      toast({
        title: "Upload failed",
        description: error.message,
        variant: "destructive"
      });
    } finally {
      setUploading(false);
      // Reset file input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    const files = e.dataTransfer.files;
    handleFileUpload(files);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
  };

  const removeImage = (indexOrUrl) => {
    if (multiple) {
      const newImages = images.filter((_, index) => index !== indexOrUrl);
      onChange(newImages);
    } else {
      onChange('');
    }
  };

  const openFileDialog = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Upload Area */}
      <div
        className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
          dragActive
            ? 'border-[#ba1a5d] bg-rose-50'
            : 'border-gray-300 hover:border-gray-400'
        } ${uploading ? 'opacity-50 pointer-events-none' : ''}`}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onClick={openFileDialog}
      >
        <input
          ref={fileInputRef}
          type="file"
          multiple={multiple}
          accept="image/*"
          onChange={(e) => handleFileUpload(e.target.files)}
          className="hidden"
        />
        
        <div className="flex flex-col items-center space-y-2">
          {uploading ? (
            <>
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#ba1a5d]"></div>
              <p className="text-gray-600">Uploading...</p>
            </>
          ) : (
            <>
              <Upload className="h-8 w-8 text-gray-400" />
              <div>
                <p className="text-gray-600">{label}</p>
                <p className="text-sm text-gray-500">
                  Click to browse or drag and drop
                </p>
                <p className="text-xs text-gray-400 mt-1">
                  PNG, JPG, GIF up to 5MB {multiple && `(max ${maxFiles} files)`}
                </p>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Debug section */}
      <div className="text-xs text-red-500 bg-red-50 p-2 rounded">
        Debug ImageUpload: 
        <br />Images length: {images.length}
        <br />Images: {JSON.stringify(images)}
        <br />Value: {JSON.stringify(value)}
      </div>

      {/* Image Previews */}
      {images.length > 0 && (
        <div className={`grid gap-4 ${multiple ? 'grid-cols-2 md:grid-cols-3' : 'grid-cols-1'}`}>
          {images.filter(img => img && img.trim()).map((imageUrl, index) => {
            console.log('ImageUpload - Rendering image:', index, imageUrl);
            return (
              <div key={multiple ? index : 'single'} className="relative group">
                <div className="aspect-square rounded-lg overflow-hidden border border-gray-200">
                  <img
                    src={imageUrl}
                    alt={`Upload ${index + 1}`}
                    className="w-full h-full object-cover"
                    onLoad={() => console.log('ImageUpload - Image loaded successfully:', imageUrl)}
                    onError={(e) => {
                      console.error('ImageUpload - Image failed to load:', imageUrl, e);
                    }}
                  />
                </div>
                <Button
                  size="sm"
                  variant="destructive"
                  className="absolute top-2 right-2 h-6 w-6 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                  onClick={(e) => {
                    e.stopPropagation();
                    removeImage(multiple ? index : imageUrl);
                  }}
                >
                  <X className="h-3 w-3" />
                </Button>
              </div>
            );
          })}
        </div>
      )}

      {multiple && images.length > 0 && (
        <p className="text-sm text-gray-500">
          {images.length} of {maxFiles} images uploaded
        </p>
      )}
    </div>
  );
};

export default ImageUpload;