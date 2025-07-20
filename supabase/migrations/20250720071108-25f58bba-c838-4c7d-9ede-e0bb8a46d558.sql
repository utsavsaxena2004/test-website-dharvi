-- Create master_products table for featured showcase products
CREATE TABLE public.master_products (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  tag TEXT,
  price NUMERIC NOT NULL,
  colors TEXT[] DEFAULT '{}',
  special_points TEXT[] DEFAULT '{}',
  image_urls TEXT[] DEFAULT '{}',
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT timezone('utc', now()),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT timezone('utc', now())
);

-- Enable RLS
ALTER TABLE public.master_products ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Public can view active master products" 
ON public.master_products 
FOR SELECT 
USING (is_active = true);

CREATE POLICY "Admin can manage all master products" 
ON public.master_products 
FOR ALL 
USING (auth.email() = 'saiyamkumar2007@gmail.com');

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_master_products_updated_at
BEFORE UPDATE ON public.master_products
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();