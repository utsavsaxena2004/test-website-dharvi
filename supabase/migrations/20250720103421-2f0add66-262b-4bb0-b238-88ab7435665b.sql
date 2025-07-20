-- Create storage policies to allow video uploads
CREATE POLICY "Allow video uploads to images bucket" 
ON storage.objects 
FOR INSERT 
WITH CHECK (
  bucket_id = 'images' 
  AND (
    (storage.foldername(name))[1] = 'videos' 
    OR (storage.foldername(name))[1] = 'images'
    OR (storage.foldername(name))[1] = 'products' 
    OR (storage.foldername(name))[1] = 'categories'
  )
);

-- Update existing policy to include videos
DROP POLICY IF EXISTS "Anyone can upload an image" ON storage.objects;
CREATE POLICY "Anyone can upload files" 
ON storage.objects 
FOR INSERT 
WITH CHECK (bucket_id = 'images');

-- Allow public access to videos
DROP POLICY IF EXISTS "Image files are publicly accessible" ON storage.objects;
CREATE POLICY "Files are publicly accessible" 
ON storage.objects 
FOR SELECT 
USING (bucket_id = 'images');