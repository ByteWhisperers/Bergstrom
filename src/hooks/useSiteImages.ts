
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface SiteImage {
  id: string;
  image_key: string;
  image_path: string | null;
  description: string;
  created_at: string;
  updated_at: string;
}

export const useSiteImages = () => {
  const [images, setImages] = useState<SiteImage[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  const fetchImages = async () => {
    try {
      const { data, error } = await supabase
        .from('site_images')
        .select('*')
        .order('image_key');

      if (error) throw error;
      setImages(data || []);
    } catch (error) {
      console.error('Erro ao buscar imagens:', error);
      toast({
        title: "Erro",
        description: "Não foi possível carregar as imagens do site.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const uploadImage = async (imageKey: string, file: File): Promise<string | null> => {
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `site/${imageKey}_${Date.now()}.${fileExt}`;

      // Upload para o storage
      const { error: uploadError } = await supabase.storage
        .from('images')
        .upload(fileName, file);

      if (uploadError) throw uploadError;

      // Obter URL pública
      const { data } = supabase.storage
        .from('images')
        .getPublicUrl(fileName);

      // Atualizar registro no banco
      const { error: updateError } = await supabase
        .from('site_images')
        .update({
          image_path: fileName,
          updated_at: new Date().toISOString(),
        })
        .eq('image_key', imageKey);

      if (updateError) throw updateError;

      // Atualizar estado local
      setImages(prev =>
        prev.map(img =>
          img.image_key === imageKey
            ? { ...img, image_path: fileName }
            : img
        )
      );

      toast({
        title: "Sucesso",
        description: "Imagem atualizada com sucesso!",
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

  const getImageUrl = (imagePath: string | null): string | null => {
    if (!imagePath) return null;
    
    const { data } = supabase.storage
      .from('images')
      .getPublicUrl(imagePath);
    
    return data.publicUrl;
  };

  useEffect(() => {
    fetchImages();
  }, []);

  return {
    images,
    isLoading,
    uploadImage,
    getImageUrl,
    refetch: fetchImages,
  };
};
