import React, { useState, useRef } from 'react';
import { Upload, X, Video as VideoIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { supabaseService } from '../services/supabaseService';
import { useToast } from '../hooks/use-toast';

const VideoUpload = ({ 
  value = [], 
  onChange, 
  multiple = false, 
  className = "",
  label = "Upload Videos",
  maxFiles = 3 
}) => {
  const [uploading, setUploading] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef(null);
  const { toast } = useToast();

  // Normalize value to always be an array
  const videos = Array.isArray(value) ? value : (value ? [value] : []);

  const handleFileUpload = async (files) => {
    if (!files || files.length === 0) return;

    // Check file limits
    const totalFiles = videos.length + files.length;
    if (multiple && totalFiles > maxFiles) {
      toast({
        title: "Too many files",
        description: `Maximum ${maxFiles} videos allowed`,
        variant: "destructive"
      });
      return;
    }

    if (!multiple && files.length > 1) {
      toast({
        title: "Single file only",
        description: "Please select only one video",
        variant: "destructive"
      });
      return;
    }

    setUploading(true);
    
    try {
      const uploadPromises = Array.from(files).map(async (file) => {
        // Validate file type
        if (!file.type.startsWith('video/')) {
          throw new Error(`${file.name} is not a video file`);
        }

        // Validate file size (50MB limit for videos)
        if (file.size > 50 * 1024 * 1024) {
          throw new Error(`${file.name} is too large. Maximum size is 50MB`);
        }

        return await supabaseService.uploadFile(file, 'images', 'videos');
      });

      const uploadedUrls = await Promise.all(uploadPromises);
      
      // Filter out any empty/null URLs
      const validUrls = uploadedUrls.filter(url => url && url.trim());
      
      if (multiple) {
        // For multiple uploads, add to existing array
        const newVideos = [...videos, ...validUrls];
        onChange(newVideos);
      } else {
        // For single upload, replace the value
        const newUrl = validUrls[0] || '';
        onChange(newUrl);
      }

      toast({
        title: "Upload successful",
        description: `${validUrls.length} video(s) uploaded successfully`
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

  const removeVideo = (indexOrUrl) => {
    if (multiple) {
      const newVideos = videos.filter((_, index) => index !== indexOrUrl);
      onChange(newVideos);
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
            ? 'border-[#6f0e06] bg-rose-50'
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
          accept="video/*"
          onChange={(e) => handleFileUpload(e.target.files)}
          className="hidden"
        />
        
        <div className="flex flex-col items-center space-y-2">
          {uploading ? (
            <>
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#6f0e06]"></div>
              <p className="text-gray-600">Uploading...</p>
            </>
          ) : (
            <>
              <VideoIcon className="h-8 w-8 text-gray-400" />
              <div>
                <p className="text-gray-600">{label}</p>
                <p className="text-sm text-gray-500">
                  Click to browse or drag and drop
                </p>
                <p className="text-xs text-gray-400 mt-1">
                  MP4, MOV, AVI up to 50MB {multiple && `(max ${maxFiles} files)`}
                </p>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Video Previews */}
      {videos.length > 0 && (
        <div className={`grid gap-4 ${multiple ? 'grid-cols-1 md:grid-cols-2' : 'grid-cols-1'}`}>
          {videos.filter(vid => vid && vid.trim()).map((videoUrl, index) => (
            <div key={multiple ? index : 'single'} className="relative group">
              <div className="aspect-video rounded-lg overflow-hidden border border-gray-200 bg-gray-100">
                <video
                  src={videoUrl}
                  controls
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    console.error('Video failed to load:', videoUrl, e);
                  }}
                >
                  Your browser does not support the video tag.
                </video>
              </div>
              <Button
                size="sm"
                variant="destructive"
                className="absolute top-2 right-2 h-6 w-6 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                onClick={(e) => {
                  e.stopPropagation();
                  removeVideo(multiple ? index : videoUrl);
                }}
              >
                <X className="h-3 w-3" />
              </Button>
            </div>
          ))}
        </div>
      )}

      {multiple && videos.length > 0 && (
        <p className="text-sm text-gray-500">
          {videos.length} of {maxFiles} videos uploaded
        </p>
      )}
    </div>
  );
};

export default VideoUpload;