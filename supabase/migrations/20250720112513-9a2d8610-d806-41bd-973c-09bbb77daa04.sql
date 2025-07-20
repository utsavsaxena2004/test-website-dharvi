-- Fix foreign key constraint violations by cleaning up NULL product_id values

-- First, delete order_items with NULL product_id (these are invalid records)
DELETE FROM order_items WHERE product_id IS NULL;

-- Delete cart_items with NULL product_id (these are invalid records)
DELETE FROM cart_items WHERE product_id IS NULL;

-- Update the product_id column to NOT NULL to prevent future issues
ALTER TABLE order_items ALTER COLUMN product_id SET NOT NULL;
ALTER TABLE cart_items ALTER COLUMN product_id SET NOT NULL;