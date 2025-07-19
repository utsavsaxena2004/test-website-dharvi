-- Remove duplicate foreign key constraint
ALTER TABLE products DROP CONSTRAINT IF EXISTS fk_products_category;

-- Keep only the products_category_id_fkey constraint