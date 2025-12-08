-- Create categories table
CREATE TABLE IF NOT EXISTS categories (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create products table
CREATE TABLE IF NOT EXISTS products (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  price NUMERIC(10, 2) NOT NULL CHECK (price >= 0),
  description TEXT,
  image TEXT,
  category_id UUID REFERENCES categories(id) ON DELETE SET NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_products_category_id ON products(category_id);
CREATE INDEX IF NOT EXISTS idx_products_created_at ON products(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_categories_created_at ON categories(created_at DESC);

-- Enable Row Level Security
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;

-- Create policies for public read access
CREATE POLICY "Allow public read access on categories"
  ON categories FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Allow public read access on products"
  ON products FOR SELECT
  TO public
  USING (true);

-- Insert sample categories
INSERT INTO categories (name) VALUES
  ('Electronics'),
  ('Clothing'),
  ('Books'),
  ('Home & Garden'),
  ('Sports & Outdoors')
ON CONFLICT (name) DO NOTHING;

-- Insert sample products
INSERT INTO products (name, price, description, image, category_id) VALUES
  ('Wireless Headphones', 79.99, 'High-quality wireless headphones with noise cancellation', 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500', (SELECT id FROM categories WHERE name = 'Electronics')),
  ('Smart Watch', 199.99, 'Feature-rich smartwatch with fitness tracking', 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500', (SELECT id FROM categories WHERE name = 'Electronics')),
  ('Laptop Stand', 49.99, 'Ergonomic aluminum laptop stand', 'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=500', (SELECT id FROM categories WHERE name = 'Electronics')),
  ('Cotton T-Shirt', 24.99, 'Comfortable 100% cotton t-shirt', 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=500', (SELECT id FROM categories WHERE name = 'Clothing')),
  ('Denim Jeans', 59.99, 'Classic blue denim jeans', 'https://images.unsplash.com/photo-1542272604-787c3835535d?w=500', (SELECT id FROM categories WHERE name = 'Clothing')),
  ('Running Shoes', 89.99, 'Lightweight running shoes with cushioning', 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500', (SELECT id FROM categories WHERE name = 'Clothing')),
  ('JavaScript Guide', 34.99, 'Complete guide to modern JavaScript', 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=500', (SELECT id FROM categories WHERE name = 'Books')),
  ('Cooking Essentials', 29.99, 'Essential recipes for home cooking', 'https://images.unsplash.com/photo-1512820790803-83ca734da794?w=500', (SELECT id FROM categories WHERE name = 'Books')),
  ('Plant Pot Set', 39.99, 'Set of 3 ceramic plant pots', 'https://images.unsplash.com/photo-1485955900006-10f4d324d411?w=500', (SELECT id FROM categories WHERE name = 'Home & Garden')),
  ('LED Desk Lamp', 44.99, 'Adjustable LED desk lamp with USB charging', 'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=500', (SELECT id FROM categories WHERE name = 'Home & Garden')),
  ('Yoga Mat', 34.99, 'Non-slip yoga mat with carrying strap', 'https://images.unsplash.com/photo-1601925260368-ae2f83cf8b7f?w=500', (SELECT id FROM categories WHERE name = 'Sports & Outdoors')),
  ('Water Bottle', 19.99, 'Insulated stainless steel water bottle', 'https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=500', (SELECT id FROM categories WHERE name = 'Sports & Outdoors'))
ON CONFLICT DO NOTHING;
