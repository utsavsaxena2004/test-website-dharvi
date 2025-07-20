-- Remove the existing foreign key constraint on product_id
ALTER TABLE cart_items DROP CONSTRAINT IF EXISTS cart_items_product_id_fkey;

-- Add new foreign key constraints that allow for both regular products and master products
ALTER TABLE cart_items 
ADD CONSTRAINT cart_items_product_id_fkey 
FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE,
ADD CONSTRAINT cart_items_master_product_id_fkey 
FOREIGN KEY (master_product_id) REFERENCES master_products(id) ON DELETE CASCADE;

-- Add a check constraint to ensure either product_id OR master_product_id is set, but not both
ALTER TABLE cart_items 
ADD CONSTRAINT cart_items_product_type_check 
CHECK (
  (product_id IS NOT NULL AND master_product_id IS NULL AND product_type = 'product') OR
  (product_id IS NULL AND master_product_id IS NOT NULL AND product_type = 'master_product')
);