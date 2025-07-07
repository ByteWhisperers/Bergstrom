
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface ProductDetailsContent {
  id: string;
  content: string;
  created_at: string;
  updated_at: string;
}

export const useProductDetails = () => {
  const [content, setContent] = useState<ProductDetailsContent | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  const fetchContent = async () => {
    try {
      const { data, error } = await supabase
        .from('product_details')
        .select('*')
        .single();

      if (error) throw error;
      setContent(data);
    } catch (error) {
      console.error('Erro ao buscar detalhes do produto:', error);
      toast({
        title: "Erro",
        description: "Não foi possível carregar os detalhes do produto.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const updateContent = async (htmlContent: string) => {
    if (!content) return false;

    try {
      const { error } = await supabase
        .from('product_details')
        .update({
          content: htmlContent,
          updated_at: new Date().toISOString(),
        })
        .eq('id', content.id);

      if (error) throw error;

      setContent(prev => prev ? { ...prev, content: htmlContent } : null);
      
      toast({
        title: "Sucesso",
        description: "Conteúdo atualizado com sucesso!",
      });
      
      return true;
    } catch (error) {
      console.error('Erro ao atualizar conteúdo:', error);
      toast({
        title: "Erro",
        description: "Não foi possível salvar as alterações.",
        variant: "destructive",
      });
      return false;
    }
  };

  const uploadImage = async (file: File): Promise<string | null> => {
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;
      const filePath = `images/${fileName}`;

      console.log('Fazendo upload da imagem:', filePath);

      const { error: uploadError } = await supabase.storage
        .from('images')
        .upload(filePath, file);

      if (uploadError) {
        console.error('Erro no upload:', uploadError);
        throw uploadError;
      }

      const { data } = supabase.storage
        .from('images')
        .getPublicUrl(filePath);

      console.log('URL da imagem:', data.publicUrl);

      toast({
        title: "Sucesso",
        description: "Imagem enviada com sucesso!",
      });

      return data.publicUrl;
    } catch (error) {
      console.error('Erro no upload da imagem:', error);
      toast({
        title: "Erro",
        description: "Não foi possível fazer upload da imagem.",
        variant: "destructive",
      });
      return null;
    }
  };

  useEffect(() => {
    fetchContent();
  }, []);

  return {
    content,
    isLoading,
    updateContent,
    uploadImage,
    refetch: fetchContent,
  };
};
