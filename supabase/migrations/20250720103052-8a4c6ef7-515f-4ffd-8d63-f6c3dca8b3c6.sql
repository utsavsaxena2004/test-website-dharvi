-- Add video_urls column to master_products table
ALTER TABLE public.master_products 
ADD COLUMN video_urls TEXT[] DEFAULT '{}';

-- Add comment to describe the video_urls column
COMMENT ON COLUMN public.master_products.video_urls IS 'Array of video URLs for the master product';