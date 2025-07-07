
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface ThemeColor {
  id: string;
  color_key: string;
  color_value: string;
  description: string;
  created_at: string;
  updated_at: string;
}

export const useThemeColors = () => {
  const [colors, setColors] = useState<ThemeColor[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  const fetchColors = async () => {
    try {
      const { data, error } = await supabase
        .from('theme_colors')
        .select('*')
        .order('color_key');

      if (error) throw error;
      setColors(data || []);
    } catch (error) {
      console.error('Erro ao buscar cores:', error);
      toast({
        title: "Erro",
        description: "Não foi possível carregar as cores do tema.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const updateColor = async (colorKey: string, colorValue: string) => {
    try {
      const { error } = await supabase
        .from('theme_colors')
        .update({ 
          color_value: colorValue,
          updated_at: new Date().toISOString()
        })
        .eq('color_key', colorKey);

      if (error) throw error;

      setColors(prev => 
        prev.map(color => 
          color.color_key === colorKey 
            ? { ...color, color_value: colorValue }
            : color
        )
      );

      toast({
        title: "Sucesso",
        description: "Cor atualizada com sucesso!",
      });

      return true;
    } catch (error) {
      console.error('Erro ao atualizar cor:', error);
      toast({
        title: "Erro",
        description: "Não foi possível atualizar a cor.",
        variant: "destructive",
      });
      return false;
    }
  };

  useEffect(() => {
    fetchColors();
  }, []);

  return {
    colors,
    isLoading,
    updateColor,
    refetch: fetchColors,
  };
};
