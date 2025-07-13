-- Clear all existing data for fresh start
TRUNCATE TABLE 
  cart_items,
  custom_designs,
  home_layout_sections,
  inventory,
  order_items,
  orders,
  products,
  categories,
  site_settings,
  wishlist_items
CASCADE;