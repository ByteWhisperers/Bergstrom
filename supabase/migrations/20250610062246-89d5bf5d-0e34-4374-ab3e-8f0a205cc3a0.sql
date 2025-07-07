
-- Criar tabela para gerenciar cores do tema
CREATE TABLE public.theme_colors (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  color_key TEXT UNIQUE NOT NULL,
  color_value TEXT NOT NULL,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Inserir cores padrão
INSERT INTO public.theme_colors (color_key, color_value, description) VALUES
('primary', '#3B82F6', 'Cor primária do site'),
('secondary', '#64748B', 'Cor secundária'),
('background', '#F8FAFC', 'Cor de fundo'),
('text_main', '#1E293B', 'Cor do texto principal'),
('text_secondary', '#64748B', 'Cor do texto secundário'),
('accent', '#10B981', 'Cor de destaque');

-- Criar tabela para gerenciar imagens do site
CREATE TABLE public.site_images (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  image_key TEXT UNIQUE NOT NULL,
  image_path TEXT,
  description TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Inserir registros padrão de imagens
INSERT INTO public.site_images (image_key, description) VALUES
('logo_header', 'Logo no cabeçalho do site'),
('hero_banner', 'Banner principal da página inicial'),
('product_main', 'Imagem principal do produto'),
('about_banner', 'Banner da seção sobre');

-- Adicionar coluna is_approved na tabela reviews existente
ALTER TABLE public.reviews 
ADD COLUMN is_approved BOOLEAN DEFAULT false;

-- Criar políticas RLS para theme_colors (acesso público para leitura)
ALTER TABLE public.theme_colors ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view theme colors" ON public.theme_colors
FOR SELECT USING (true);

CREATE POLICY "Only authenticated users can modify theme colors" ON public.theme_colors
FOR ALL USING (auth.role() = 'authenticated');

-- Criar políticas RLS para site_images (acesso público para leitura)
ALTER TABLE public.site_images ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view site images" ON public.site_images
FOR SELECT USING (true);

CREATE POLICY "Only authenticated users can modify site images" ON public.site_images
FOR ALL USING (auth.role() = 'authenticated');

-- Atualizar política de reviews para incluir moderação
DROP POLICY IF EXISTS "Anyone can view reviews" ON public.reviews;

CREATE POLICY "Anyone can view approved reviews" ON public.reviews
FOR SELECT USING (is_approved = true);

CREATE POLICY "Authenticated users can view all reviews" ON public.reviews
FOR SELECT TO authenticated USING (true);

CREATE POLICY "Authenticated users can moderate reviews" ON public.reviews
FOR UPDATE TO authenticated USING (true);

CREATE POLICY "Authenticated users can delete reviews" ON public.reviews
FOR DELETE TO authenticated USING (true);
