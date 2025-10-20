/*
  # Add tags column to products table

  1. Changes
    - Add `tags` column to `products` table as TEXT type to store comma-separated tags
    - This allows users to add descriptive tags to their products
    
  2. Notes
    - Tags will be stored as comma-separated text (e.g., "casual, verão, conforto")
    - Frontend handles parsing and formatting
*/

-- Add tags column if it doesn't exist
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'products' AND column_name = 'tags'
  ) THEN
    ALTER TABLE products ADD COLUMN tags TEXT;
  END IF;
END $$;
