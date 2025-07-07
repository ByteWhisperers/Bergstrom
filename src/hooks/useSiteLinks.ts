
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface SiteLink {
  id: string;
  link_key: string;
  link_url: string;
  description: string;
  created_at: string;
  updated_at: string;
}

export const useSiteLinks = () => {
  const [links, setLinks] = useState<SiteLink[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  const fetchLinks = async () => {
    try {
      const { data, error } = await supabase
        .from('site_links')
        .select('*')
        .order('link_key');

      if (error) throw error;
      setLinks(data || []);
    } catch (error) {
      console.error('Erro ao buscar links:', error);
      toast({
        title: "Erro",
        description: "Não foi possível carregar os links do site.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const updateLink = async (linkKey: string, linkUrl: string) => {
    try {
      const { error } = await supabase
        .from('site_links')
        .update({ 
          link_url: linkUrl,
          updated_at: new Date().toISOString()
        })
        .eq('link_key', linkKey);

      if (error) throw error;

      setLinks(prev => 
        prev.map(link => 
          link.link_key === linkKey 
            ? { ...link, link_url: linkUrl }
            : link
        )
      );

      toast({
        title: "Sucesso",
        description: "Link atualizado com sucesso!",
      });

      return true;
    } catch (error) {
      console.error('Erro ao atualizar link:', error);
      toast({
        title: "Erro",
        description: "Não foi possível atualizar o link.",
        variant: "destructive",
      });
      return false;
    }
  };

  const getLinksAsObject = () => {
    return links.reduce((acc, link) => {
      acc[link.link_key] = link.link_url;
      return acc;
    }, {} as Record<string, string>);
  };

  useEffect(() => {
    fetchLinks();
  }, []);

  return {
    links,
    isLoading,
    updateLink,
    getLinksAsObject,
    refetch: fetchLinks,
  };
};
