-- Create gallery_images table
CREATE TABLE public.gallery_images (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT,
  description TEXT,
  image_url TEXT NOT NULL,
  tags TEXT[] DEFAULT '{}',
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT timezone('utc'::text, now()),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT timezone('utc'::text, now())
);

-- Enable Row Level Security
ALTER TABLE public.gallery_images ENABLE ROW LEVEL SECURITY;

-- Create policies for gallery images
CREATE POLICY "Public can view active gallery images" 
ON public.gallery_images 
FOR SELECT 
USING (is_active = true);

CREATE POLICY "Admin can manage all gallery images" 
ON public.gallery_images 
FOR ALL 
USING (auth.email() = 'saiyamkumar2007@gmail.com');

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_gallery_images_updated_at
BEFORE UPDATE ON public.gallery_images
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();