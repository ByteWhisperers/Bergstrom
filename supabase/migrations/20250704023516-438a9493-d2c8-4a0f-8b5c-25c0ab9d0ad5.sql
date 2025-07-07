
-- Criar tabela para gerenciar links do site
CREATE TABLE public.site_links (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  link_key TEXT UNIQUE NOT NULL,
  link_url TEXT NOT NULL,
  description TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Inserir links padrão
INSERT INTO public.site_links (link_key, link_url, description) VALUES
('checkout_button', 'https://sua-plataforma-de-pagamento.com/checkout', 'Botão "Ir para o Checkout" da página do carrinho'),
('whatsapp_contact', 'https://wa.me/5511999999999', 'Link para contato no WhatsApp'),
('instagram_profile', 'https://instagram.com/seuusuario', 'Link para perfil no Instagram'),
('facebook_page', 'https://facebook.com/suapagina', 'Link para página no Facebook'),
('support_email', 'mailto:suporte@seusite.com', 'E-mail de suporte');

-- Criar políticas RLS para site_links (acesso público para leitura)
ALTER TABLE public.site_links ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view site links" ON public.site_links
FOR SELECT USING (true);

CREATE POLICY "Only authenticated users can modify site links" ON public.site_links
FOR ALL USING (auth.role() = 'authenticated');

-- Adicionar cores específicas para botões
INSERT INTO public.theme_colors (color_key, color_value, description) VALUES
('buy_now_button_background', '#10B981', 'Cor de fundo do botão "Comprar Agora"'),
('buy_now_button_text', '#FFFFFF', 'Cor do texto do botão "Comprar Agora"'),
('checkout_button_background', '#3B82F6', 'Cor de fundo do botão "Ir para Checkout"'),
('checkout_button_text', '#FFFFFF', 'Cor do texto do botão "Ir para Checkout"')
ON CONFLICT (color_key) DO UPDATE SET
  color_value = EXCLUDED.color_value,
  description = EXCLUDED.description,
  updated_at = now();
