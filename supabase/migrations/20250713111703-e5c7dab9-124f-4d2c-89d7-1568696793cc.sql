
-- Add foreign key constraint between products and categories
ALTER TABLE products 
ADD CONSTRAINT products_category_id_fkey 
FOREIGN KEY (category_id) 
REFERENCES categories(id);

-- Also add foreign key constraints for other tables that are missing them
ALTER TABLE cart_items 
ADD CONSTRAINT cart_items_product_id_fkey 
FOREIGN KEY (product_id) 
REFERENCES products(id);

ALTER TABLE wishlist_items 
ADD CONSTRAINT wishlist_items_product_id_fkey 
FOREIGN KEY (product_id) 
REFERENCES products(id);

ALTER TABLE inventory 
ADD CONSTRAINT inventory_product_id_fkey 
FOREIGN KEY (product_id) 
REFERENCES products(id);

ALTER TABLE order_items 
ADD CONSTRAINT order_items_product_id_fkey 
FOREIGN KEY (product_id) 
REFERENCES products(id);

ALTER TABLE order_items 
ADD CONSTRAINT order_items_order_id_fkey 
FOREIGN KEY (order_id) 
REFERENCES orders(id);
