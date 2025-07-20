-- Add stock_quantity column to master_products table
ALTER TABLE master_products ADD COLUMN stock_quantity integer DEFAULT 0;