
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface Review {
  id: string;
  reviewer_name: string;
  star_rating: number;
  review_title?: string;
  review_comment: string;
  is_approved: boolean;
  created_at: string;
  product_id: string;
  review_images?: Array<{
    id: string;
    image_path: string;
  }>;
}

export const useReviewModeration = () => {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  const fetchAllReviews = async () => {
    try {
      const { data, error } = await supabase
        .from('reviews')
        .select(`
          *,
          review_images (
            id,
            image_path
          )
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setReviews(data || []);
    } catch (error) {
      console.error('Erro ao buscar avaliações:', error);
      toast({
        title: "Erro",
        description: "Não foi possível carregar as avaliações.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const updateReview = async (reviewId: string, updates: Partial<Review>) => {
    try {
      const { error } = await supabase
        .from('reviews')
        .update(updates)
        .eq('id', reviewId);

      if (error) throw error;

      setReviews(prev =>
        prev.map(review =>
          review.id === reviewId
            ? { ...review, ...updates }
            : review
        )
      );

      toast({
        title: "Sucesso",
        description: "Avaliação atualizada com sucesso!",
      });

      return true;
    } catch (error) {
      console.error('Erro ao atualizar avaliação:', error);
      toast({
        title: "Erro",
        description: "Não foi possível atualizar a avaliação.",
        variant: "destructive",
      });
      return false;
    }
  };

  const deleteReview = async (reviewId: string) => {
    try {
      const { error } = await supabase
        .from('reviews')
        .delete()
        .eq('id', reviewId);

      if (error) throw error;

      setReviews(prev => prev.filter(review => review.id !== reviewId));

      toast({
        title: "Sucesso",
        description: "Avaliação excluída com sucesso!",
      });

      return true;
    } catch (error) {
      console.error('Erro ao excluir avaliação:', error);
      toast({
        title: "Erro",
        description: "Não foi possível excluir a avaliação.",
        variant: "destructive",
      });
      return false;
    }
  };

  useEffect(() => {
    fetchAllReviews();
  }, []);

  return {
    reviews,
    isLoading,
    updateReview,
    deleteReview,
    refetch: fetchAllReviews,
  };
};
