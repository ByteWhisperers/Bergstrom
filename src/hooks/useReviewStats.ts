
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface ReviewStats {
  totalReviews: number;
  averageRating: number;
  ratingDistribution: Array<{
    stars: number;
    count: number;
    percentage: number;
  }>;
}

const PRODUCT_ID = '00000000-0000-0000-0000-000000000001';

export const useReviewStats = () => {
  const [stats, setStats] = useState<ReviewStats>({
    totalReviews: 0,
    averageRating: 0,
    ratingDistribution: []
  });
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  const fetchReviewStats = async () => {
    try {
      setIsLoading(true);

      // Buscar total de avaliações aprovadas
      const { count: totalCount } = await supabase
        .from('reviews')
        .select('*', { count: 'exact', head: true })
        .eq('product_id', PRODUCT_ID)
        .eq('is_approved', true);

      const totalReviews = totalCount || 0;

      if (totalReviews === 0) {
        setStats({
          totalReviews: 0,
          averageRating: 0,
          ratingDistribution: [5, 4, 3, 2, 1].map(stars => ({
            stars,
            count: 0,
            percentage: 0
          }))
        });
        return;
      }

      // Buscar todas as avaliações para calcular estatísticas
      const { data: allReviews, error } = await supabase
        .from('reviews')
        .select('star_rating')
        .eq('product_id', PRODUCT_ID)
        .eq('is_approved', true);

      if (error) throw error;

      // Calcular média
      const averageRating = allReviews.length > 0 
        ? allReviews.reduce((sum, review) => sum + review.star_rating, 0) / allReviews.length 
        : 0;

      // Calcular distribuição por estrelas
      const ratingDistribution = [5, 4, 3, 2, 1].map(stars => {
        const count = allReviews.filter(review => review.star_rating === stars).length;
        const percentage = totalReviews > 0 ? (count / totalReviews) * 100 : 0;
        return { stars, count, percentage };
      });

      setStats({
        totalReviews,
        averageRating,
        ratingDistribution
      });

    } catch (error) {
      console.error('Erro ao buscar estatísticas das avaliações:', error);
      toast({
        title: "Erro",
        description: "Erro ao carregar estatísticas das avaliações.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchReviewStats();
  }, []);

  return {
    stats,
    isLoading,
    refetch: fetchReviewStats
  };
};
