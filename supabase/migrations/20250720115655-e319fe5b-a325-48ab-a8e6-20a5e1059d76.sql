-- First, let's make the product_id column nullable to allow master products to use master_product_id instead
ALTER TABLE cart_items ALTER COLUMN product_id DROP NOT NULL;

-- Update the check constraint to ensure either product_id OR master_product_id is set
ALTER TABLE cart_items DROP CONSTRAINT IF EXISTS cart_items_product_type_check;
ALTER TABLE cart_items 
ADD CONSTRAINT cart_items_product_type_check 
CHECK (
  (product_id IS NOT NULL AND master_product_id IS NULL AND product_type = 'product') OR
  (product_id IS NULL AND master_product_id IS NOT NULL AND product_type = 'master_product')
);