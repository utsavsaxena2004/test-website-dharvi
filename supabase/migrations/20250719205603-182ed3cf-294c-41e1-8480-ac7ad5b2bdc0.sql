-- Create storage policies for images bucket to allow file uploads

-- Policy to allow anyone to upload to images bucket
CREATE POLICY "Allow public uploads to images bucket" 
ON storage.objects 
FOR INSERT 
WITH CHECK (bucket_id = 'images');

-- Policy to allow anyone to view images in the bucket (since it's public)
CREATE POLICY "Allow public access to images bucket" 
ON storage.objects 
FOR SELECT 
USING (bucket_id = 'images');

-- Policy to allow deletion of files in images bucket (for admins or file owners)
CREATE POLICY "Allow public deletion from images bucket" 
ON storage.objects 
FOR DELETE 
USING (bucket_id = 'images');