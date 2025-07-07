
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface PageContent {
  id: string;
  title: string;
  subtitle: string | null;
  description: string | null;
  main_image_path: string | null;
}

export const usePageContent = () => {
  const [content, setContent] = useState<PageContent | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  const fetchContent = async () => {
    try {
      const { data, error } = await supabase
        .from('page_content')
        .select('*')
        .single();

      if (error) throw error;
      setContent(data);
    } catch (error) {
      console.error('Erro ao buscar conteúdo:', error);
      toast({
        title: "Erro",
        description: "Não foi possível carregar o conteúdo da página.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const updateContent = async (updatedContent: Partial<PageContent>) => {
    if (!content) return false;

    try {
      const { error } = await supabase
        .from('page_content')
        .update({
          ...updatedContent,
          updated_at: new Date().toISOString(),
        })
        .eq('id', content.id);

      if (error) throw error;

      setContent(prev => prev ? { ...prev, ...updatedContent } : null);
      
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
      const fileName = `main-image-${Date.now()}.${fileExt}`;
      const filePath = fileName;

      const { error: uploadError } = await supabase.storage
        .from('product-images')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data } = supabase.storage
        .from('product-images')
        .getPublicUrl(filePath);

      return data.publicUrl;
    } catch (error) {
      console.error('Erro ao fazer upload da imagem:', error);
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
