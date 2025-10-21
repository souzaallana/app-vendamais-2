/*
  # Adicionar suporte para processamento de IA e múltiplas fotos

  1. Novas Tabelas
    - `product_photos` - Armazena múltiplas fotos de produtos
      - `id` (uuid, primary key)
      - `product_id` (uuid, foreign key)
      - `photo_url` (text)
      - `photo_type` (text) - frente, verso, detalhe, outros
      - `is_original` (boolean) - se é foto original ou gerada por IA
      - `order` (integer) - ordem de exibição
      - `created_at` (timestamptz)
    
    - `ai_processing_logs` - Log de todas as chamadas de API de IA
      - `id` (uuid, primary key)
      - `user_id` (uuid, foreign key)
      - `product_id` (uuid, foreign key, nullable)
      - `api_provider` (text) - nano_banana, replicate, etc
      - `operation_type` (text) - remove_background, generate_mannequin, extract_data
      - `input_data` (jsonb) - dados de entrada
      - `output_data` (jsonb) - resposta da API
      - `cost` (decimal) - custo da operação
      - `duration_ms` (integer) - tempo de processamento
      - `status` (text) - success, error
      - `error_message` (text)
      - `created_at` (timestamptz)

  2. Alterações
    - Adicionar campos em `products` para dados gerados por IA
      - `ai_generated_title` (text)
      - `ai_generated_description` (text)
      - `ai_suggested_category` (text)
      - `ai_suggested_colors` (text[])
      - `ai_suggested_material` (text)
      - `used_ai_processing` (boolean)
      - `mannequin_description` (text)

  3. Segurança
    - Enable RLS em todas as tabelas
    - Políticas para usuários autenticados
*/

-- Criar tabela de fotos de produtos
CREATE TABLE IF NOT EXISTS product_photos (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id uuid REFERENCES products(id) ON DELETE CASCADE,
  photo_url text NOT NULL,
  photo_type text NOT NULL CHECK (photo_type IN ('frente', 'verso', 'detalhe', 'outros')),
  is_original boolean DEFAULT true,
  "order" integer DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

-- Criar tabela de logs de processamento IA
CREATE TABLE IF NOT EXISTS ai_processing_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  product_id uuid REFERENCES products(id) ON DELETE SET NULL,
  api_provider text NOT NULL,
  operation_type text NOT NULL,
  input_data jsonb DEFAULT '{}'::jsonb,
  output_data jsonb DEFAULT '{}'::jsonb,
  cost decimal(10, 4) DEFAULT 0,
  duration_ms integer DEFAULT 0,
  status text NOT NULL CHECK (status IN ('success', 'error', 'pending')),
  error_message text,
  created_at timestamptz DEFAULT now()
);

-- Adicionar campos de IA na tabela products
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'products' AND column_name = 'ai_generated_title'
  ) THEN
    ALTER TABLE products 
      ADD COLUMN ai_generated_title text,
      ADD COLUMN ai_generated_description text,
      ADD COLUMN ai_suggested_category text,
      ADD COLUMN ai_suggested_colors text[],
      ADD COLUMN ai_suggested_material text,
      ADD COLUMN used_ai_processing boolean DEFAULT false,
      ADD COLUMN mannequin_description text;
  END IF;
END $$;

-- Enable RLS
ALTER TABLE product_photos ENABLE ROW LEVEL SECURITY;
ALTER TABLE ai_processing_logs ENABLE ROW LEVEL SECURITY;

-- Políticas para product_photos
CREATE POLICY "Usuários podem ver fotos de seus produtos"
  ON product_photos FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM products
      WHERE products.id = product_photos.product_id
      AND products.user_id = auth.uid()
    )
  );

CREATE POLICY "Usuários podem inserir fotos em seus produtos"
  ON product_photos FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM products
      WHERE products.id = product_photos.product_id
      AND products.user_id = auth.uid()
    )
  );

CREATE POLICY "Usuários podem deletar fotos de seus produtos"
  ON product_photos FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM products
      WHERE products.id = product_photos.product_id
      AND products.user_id = auth.uid()
    )
  );

-- Políticas para ai_processing_logs
CREATE POLICY "Usuários podem ver seus próprios logs"
  ON ai_processing_logs FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Usuários podem inserir seus próprios logs"
  ON ai_processing_logs FOR INSERT
  TO authenticated
  WITH CHECK (user_id = auth.uid());

-- Criar índices para performance
CREATE INDEX IF NOT EXISTS idx_product_photos_product_id ON product_photos(product_id);
CREATE INDEX IF NOT EXISTS idx_product_photos_type ON product_photos(photo_type);
CREATE INDEX IF NOT EXISTS idx_ai_logs_user_id ON ai_processing_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_ai_logs_product_id ON ai_processing_logs(product_id);
CREATE INDEX IF NOT EXISTS idx_ai_logs_created_at ON ai_processing_logs(created_at DESC);
