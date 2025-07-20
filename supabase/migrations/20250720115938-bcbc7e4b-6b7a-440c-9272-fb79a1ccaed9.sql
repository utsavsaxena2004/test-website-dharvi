-- First, make the product_id column nullable to allow master products to use master_product_id instead
ALTER TABLE order_items ALTER COLUMN product_id DROP NOT NULL;

-- Add master_product_id column if it doesn't exist
ALTER TABLE order_items ADD COLUMN IF NOT EXISTS master_product_id UUID;
ALTER TABLE order_items ADD COLUMN IF NOT EXISTS product_type TEXT DEFAULT 'product';

-- Add foreign key constraint for master_product_id
ALTER TABLE order_items 
ADD CONSTRAINT IF NOT EXISTS order_items_master_product_id_fkey 
FOREIGN KEY (master_product_id) REFERENCES master_products(id) ON DELETE CASCADE;

-- Add a check constraint to ensure either product_id OR master_product_id is set
ALTER TABLE order_items DROP CONSTRAINT IF EXISTS order_items_product_type_check;
ALTER TABLE order_items 
ADD CONSTRAINT order_items_product_type_check 
CHECK (
  (product_id IS NOT NULL AND master_product_id IS NULL AND product_type = 'product') OR
  (product_id IS NULL AND master_product_id IS NOT NULL AND product_type = 'master_product')
);