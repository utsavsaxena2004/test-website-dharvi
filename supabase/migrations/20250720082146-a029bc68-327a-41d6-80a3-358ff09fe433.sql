-- Drop existing foreign key constraints if they exist
ALTER TABLE cart_items DROP CONSTRAINT IF EXISTS cart_items_product_id_fkey;
ALTER TABLE wishlist_items DROP CONSTRAINT IF EXISTS wishlist_items_product_id_fkey;

-- Add new columns to distinguish between product types
ALTER TABLE cart_items ADD COLUMN IF NOT EXISTS product_type text DEFAULT 'product';
ALTER TABLE cart_items ADD COLUMN IF NOT EXISTS master_product_id uuid;

ALTER TABLE wishlist_items ADD COLUMN IF NOT EXISTS product_type text DEFAULT 'product';
ALTER TABLE wishlist_items ADD COLUMN IF NOT EXISTS master_product_id uuid;

-- Add foreign key constraints for master products
ALTER TABLE cart_items ADD CONSTRAINT cart_items_master_product_id_fkey 
  FOREIGN KEY (master_product_id) REFERENCES master_products(id) ON DELETE CASCADE;

ALTER TABLE wishlist_items ADD CONSTRAINT wishlist_items_master_product_id_fkey 
  FOREIGN KEY (master_product_id) REFERENCES master_products(id) ON DELETE CASCADE;

-- Add check constraints to ensure either product_id or master_product_id is set
ALTER TABLE cart_items ADD CONSTRAINT cart_items_product_check 
  CHECK (
    (product_type = 'product' AND product_id IS NOT NULL AND master_product_id IS NULL) OR
    (product_type = 'master_product' AND master_product_id IS NOT NULL AND product_id IS NULL)
  );

ALTER TABLE wishlist_items ADD CONSTRAINT wishlist_items_product_check 
  CHECK (
    (product_type = 'product' AND product_id IS NOT NULL AND master_product_id IS NULL) OR
    (product_type = 'master_product' AND master_product_id IS NOT NULL AND product_id IS NULL)
  );