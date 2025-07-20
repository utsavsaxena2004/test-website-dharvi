-- Create coupons table
CREATE TABLE public.coupons (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  code TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  description TEXT,
  discount_type TEXT NOT NULL CHECK (discount_type IN ('percentage', 'fixed')),
  discount_value NUMERIC NOT NULL CHECK (discount_value > 0),
  minimum_order_amount NUMERIC DEFAULT 0,
  maximum_discount NUMERIC,
  usage_limit INTEGER,
  used_count INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  valid_from TIMESTAMP WITH TIME ZONE DEFAULT now(),
  valid_until TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Add coupon tracking to orders table
ALTER TABLE public.orders 
ADD COLUMN coupon_id UUID,
ADD COLUMN coupon_code TEXT,
ADD COLUMN discount_amount NUMERIC DEFAULT 0;

-- Enable RLS on coupons table
ALTER TABLE public.coupons ENABLE ROW LEVEL SECURITY;

-- Create policies for coupons
CREATE POLICY "Public can view active coupons" 
ON public.coupons 
FOR SELECT 
USING (is_active = true AND (valid_until IS NULL OR valid_until > now()));

CREATE POLICY "Admin can manage all coupons" 
ON public.coupons 
FOR ALL 
USING (auth.email() = 'saiyamkumar2007@gmail.com');

-- Create function to validate and apply coupon
CREATE OR REPLACE FUNCTION public.validate_coupon(
  coupon_code_input TEXT,
  order_amount NUMERIC
)
RETURNS TABLE (
  valid BOOLEAN,
  coupon_id UUID,
  discount_amount NUMERIC,
  message TEXT
) 
LANGUAGE plpgsql
AS $$
DECLARE
  coupon_record RECORD;
  calculated_discount NUMERIC;
BEGIN
  -- Get coupon details
  SELECT * INTO coupon_record
  FROM public.coupons
  WHERE code = coupon_code_input
  AND is_active = true
  AND (valid_until IS NULL OR valid_until > now())
  AND (valid_from IS NULL OR valid_from <= now());

  -- Check if coupon exists
  IF NOT FOUND THEN
    RETURN QUERY SELECT false, NULL::UUID, 0::NUMERIC, 'Invalid or expired coupon code';
    RETURN;
  END IF;

  -- Check minimum order amount
  IF order_amount < coupon_record.minimum_order_amount THEN
    RETURN QUERY SELECT false, NULL::UUID, 0::NUMERIC, 
      FORMAT('Minimum order amount of ₹%s required', coupon_record.minimum_order_amount);
    RETURN;
  END IF;

  -- Check usage limit
  IF coupon_record.usage_limit IS NOT NULL AND coupon_record.used_count >= coupon_record.usage_limit THEN
    RETURN QUERY SELECT false, NULL::UUID, 0::NUMERIC, 'Coupon usage limit reached';
    RETURN;
  END IF;

  -- Calculate discount
  IF coupon_record.discount_type = 'percentage' THEN
    calculated_discount := (order_amount * coupon_record.discount_value) / 100;
    
    -- Apply maximum discount limit if set
    IF coupon_record.maximum_discount IS NOT NULL AND calculated_discount > coupon_record.maximum_discount THEN
      calculated_discount := coupon_record.maximum_discount;
    END IF;
  ELSE
    calculated_discount := coupon_record.discount_value;
  END IF;

  -- Ensure discount doesn't exceed order amount
  IF calculated_discount > order_amount THEN
    calculated_discount := order_amount;
  END IF;

  RETURN QUERY SELECT true, coupon_record.id, calculated_discount, 'Coupon applied successfully';
END;
$$;

-- Create function to update coupon usage
CREATE OR REPLACE FUNCTION public.increment_coupon_usage()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.coupon_id IS NOT NULL THEN
    UPDATE public.coupons 
    SET used_count = used_count + 1,
        updated_at = now()
    WHERE id = NEW.coupon_id;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to update coupon usage when order is created
CREATE TRIGGER update_coupon_usage_trigger
  AFTER INSERT ON public.orders
  FOR EACH ROW
  EXECUTE FUNCTION public.increment_coupon_usage();

-- Create trigger for updating updated_at on coupons
CREATE TRIGGER update_coupons_updated_at
  BEFORE UPDATE ON public.coupons
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();