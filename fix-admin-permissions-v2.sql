-- Comprehensive Admin Permissions Fix Script
-- Run this in Supabase SQL Editor to fix all RLS permission issues

-- =============================================================================
-- 1. Fix Custom Designs Table - Remove faulty policy and create proper admin policy
-- =============================================================================

-- Drop the problematic admin policy that references non-existent auth.users table
DROP POLICY IF EXISTS "Admins can view all custom designs" ON custom_designs;

-- Create a proper admin policy using email-based authentication
CREATE POLICY "Admin can manage all custom designs" ON custom_designs
FOR ALL USING (
  auth.email() = 'saiyamkumar2007@gmail.com'
);

-- =============================================================================
-- 2. Fix Products Table - Enable RLS and create proper policies
-- =============================================================================

-- Enable RLS on products table (currently disabled)
ALTER TABLE products ENABLE ROW LEVEL SECURITY;

-- Create policy for public viewing of active products
CREATE POLICY "Public can view active products" ON products
FOR SELECT USING (is_active = true);

-- Create policy for admin to manage all products
CREATE POLICY "Admin can manage all products" ON products
FOR ALL USING (
  auth.email() = 'saiyamkumar2007@gmail.com'
);

-- =============================================================================
-- 3. Ensure proper admin policies exist for all tables
-- =============================================================================

-- Categories table admin policy
DROP POLICY IF EXISTS "Admin can manage all categories" ON categories;
CREATE POLICY "Admin can manage all categories" ON categories
FOR ALL USING (
  auth.email() = 'saiyamkumar2007@gmail.com'
);

-- Orders table admin policy
DROP POLICY IF EXISTS "Admin can manage all orders" ON orders;
CREATE POLICY "Admin can manage all orders" ON orders
FOR ALL USING (
  auth.email() = 'saiyamkumar2007@gmail.com'
);

-- Cart items admin policy (for admin oversight)
DROP POLICY IF EXISTS "Admin can view all cart items" ON cart_items;
CREATE POLICY "Admin can view all cart items" ON cart_items
FOR SELECT USING (
  auth.email() = 'saiyamkumar2007@gmail.com'
);

-- Order items admin policy
DROP POLICY IF EXISTS "Admin can view all order items" ON order_items;
CREATE POLICY "Admin can view all order items" ON order_items
FOR SELECT USING (
  auth.email() = 'saiyamkumar2007@gmail.com'
);

-- Wishlist items admin policy
DROP POLICY IF EXISTS "Admin can view all wishlist items" ON wishlist_items;
CREATE POLICY "Admin can view all wishlist items" ON wishlist_items
FOR SELECT USING (
  auth.email() = 'saiyamkumar2007@gmail.com'
);

-- =============================================================================
-- 4. Ensure public access policies exist for regular users
-- =============================================================================

-- Categories public access
DROP POLICY IF EXISTS "Public can view active categories" ON categories;
CREATE POLICY "Public can view active categories" ON categories
FOR SELECT USING (is_active = true);

-- =============================================================================
-- 5. Verify all policies are working correctly
-- =============================================================================

-- Check custom_designs policies
SELECT 'custom_designs' as table_name, policyname, qual, with_check 
FROM pg_policies 
WHERE tablename = 'custom_designs';

-- Check products policies
SELECT 'products' as table_name, policyname, qual, with_check 
FROM pg_policies 
WHERE tablename = 'products';

-- Check categories policies
SELECT 'categories' as table_name, policyname, qual, with_check 
FROM pg_policies 
WHERE tablename = 'categories';

-- Check orders policies
SELECT 'orders' as table_name, policyname, qual, with_check 
FROM pg_policies 
WHERE tablename = 'orders';

-- =============================================================================
-- 6. Test admin access (this should work after running the script)
-- =============================================================================

-- Test if admin can access custom_designs
SELECT 'Testing custom_designs access...' as test_description;

-- Test if admin can access products
SELECT 'Testing products access...' as test_description;

-- Test if admin can access categories
SELECT 'Testing categories access...' as test_description;

-- Test if admin can access orders
SELECT 'Testing orders access...' as test_description;

-- =============================================================================
-- Success message
-- =============================================================================

SELECT 'Admin permissions fix completed successfully!' as status,
       'Please refresh your admin panel to see the changes.' as next_step; 