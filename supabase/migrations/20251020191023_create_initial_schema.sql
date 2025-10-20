/*
  # Initial Schema for Lojista App

  ## Overview
  Creates the core database structure for the e-commerce merchant application.
  
  ## New Tables
  
  ### 1. `profiles`
  - `id` (uuid, primary key) - References auth.users
  - `email` (text) - User email
  - `full_name` (text) - User's full name
  - `avatar_url` (text, nullable) - Profile picture URL
  - `language` (text) - Preferred language (pt, en, es)
  - `created_at` (timestamptz) - Account creation timestamp
  - `updated_at` (timestamptz) - Last update timestamp

  ### 2. `products`
  - `id` (uuid, primary key) - Product identifier
  - `user_id` (uuid, foreign key) - Owner reference
  - `title` (text) - Product title (AI generated or manual)
  - `description` (text) - Product description
  - `category` (text) - Product category
  - `price` (decimal, nullable) - Product price
  - `status` (text) - active, paused, draft
  - `marketplace` (text, nullable) - ml (Mercado Livre), shopee, etc
  - `marketplace_id` (text, nullable) - External marketplace ID
  - `is_ai_generated` (boolean) - Whether AI helped create this product
  - `created_at` (timestamptz) - Creation timestamp
  - `updated_at` (timestamptz) - Last update timestamp

  ### 3. `product_images`
  - `id` (uuid, primary key) - Image identifier
  - `product_id` (uuid, foreign key) - Product reference
  - `image_url` (text) - Supabase storage URL
  - `order_index` (integer) - Display order (0, 1, 2)
  - `created_at` (timestamptz) - Upload timestamp

  ## Security
  - Enable RLS on all tables
  - Users can only access their own data
  - Authenticated users only

  ## Notes
  - Uses UUID v4 for all IDs
  - Timestamps use timezone-aware format
  - Cascading deletes for related records
*/

-- Create profiles table
CREATE TABLE IF NOT EXISTS profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email text NOT NULL,
  full_name text DEFAULT '',
  avatar_url text,
  language text DEFAULT 'pt' CHECK (language IN ('pt', 'en', 'es')),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create products table
CREATE TABLE IF NOT EXISTS products (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  title text NOT NULL,
  description text DEFAULT '',
  category text DEFAULT '',
  price decimal(10, 2),
  status text DEFAULT 'draft' CHECK (status IN ('active', 'paused', 'draft')),
  marketplace text CHECK (marketplace IN ('ml', 'shopee', 'shein', null)),
  marketplace_id text,
  is_ai_generated boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create product_images table
CREATE TABLE IF NOT EXISTS product_images (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id uuid NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  image_url text NOT NULL,
  order_index integer NOT NULL DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_products_user_id ON products(user_id);
CREATE INDEX IF NOT EXISTS idx_products_status ON products(status);
CREATE INDEX IF NOT EXISTS idx_products_marketplace ON products(marketplace);
CREATE INDEX IF NOT EXISTS idx_product_images_product_id ON product_images(product_id);
CREATE INDEX IF NOT EXISTS idx_product_images_order ON product_images(product_id, order_index);

-- Enable Row Level Security
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_images ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "Users can view own profile"
  ON profiles FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can insert own profile"
  ON profiles FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);

-- Products policies
CREATE POLICY "Users can view own products"
  ON products FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own products"
  ON products FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own products"
  ON products FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own products"
  ON products FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Product images policies
CREATE POLICY "Users can view images of own products"
  ON product_images FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM products
      WHERE products.id = product_images.product_id
      AND products.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can insert images to own products"
  ON product_images FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM products
      WHERE products.id = product_images.product_id
      AND products.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can update images of own products"
  ON product_images FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM products
      WHERE products.id = product_images.product_id
      AND products.user_id = auth.uid()
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM products
      WHERE products.id = product_images.product_id
      AND products.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can delete images of own products"
  ON product_images FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM products
      WHERE products.id = product_images.product_id
      AND products.user_id = auth.uid()
    )
  );

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Triggers for updated_at
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_products_updated_at BEFORE UPDATE ON products
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
