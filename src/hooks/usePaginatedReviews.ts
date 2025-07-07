
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
  customer_image?: string;
  review_images?: Array<{
    id: string;
    image_path: string;
  }>;
}

const REVIEWS_PER_PAGE = 6;
const PRODUCT_ID = '00000000-0000-0000-0000-000000000001';

export const usePaginatedReviews = () => {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalReviews, setTotalReviews] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const { toast } = useToast();

  const totalPages = Math.ceil(totalReviews / REVIEWS_PER_PAGE);
  const hasNextPage = currentPage < totalPages;

  const fetchReviews = async (page: number = 1, append: boolean = false) => {
    try {
      if (!append) setIsLoading(true);
      else setIsLoadingMore(true);

      // Buscar total de avaliações aprovadas
      const { count } = await supabase
        .from('reviews')
        .select('*', { count: 'exact', head: true })
        .eq('product_id', PRODUCT_ID)
        .eq('is_approved', true);

      setTotalReviews(count || 0);

      // Buscar avaliações paginadas
      const from = (page - 1) * REVIEWS_PER_PAGE;
      const to = from + REVIEWS_PER_PAGE - 1;

      const { data, error } = await supabase
        .from('reviews')
        .select(`
          *,
          review_images (
            id,
            image_path
          )
        `)
        .eq('product_id', PRODUCT_ID)
        .eq('is_approved', true)
        .order('created_at', { ascending: false })
        .range(from, to);

      if (error) throw error;

      // Adicionar imagens de clientes às primeiras avaliações
      const customerImages = [
        '/lovable-uploads/2ef6f07c-0608-4222-8177-b89c4c9a1cc6.png',
        '/lovable-uploads/79dc90e6-3475-4e78-97ed-f8074bf899cf.png',
        '/lovable-uploads/bc47914d-f515-4283-b82e-dc9c6c7bd1c8.png',
        '/lovable-uploads/7bd9480e-aea5-4552-b31c-00ebec6f3bc3.png',
        '/lovable-uploads/84ae09e7-aebe-43f5-9d09-0fcd6ec80bfc.png',
        '/lovable-uploads/9be149b8-d8a2-4456-9133-a6bc5d10b9b2.png'
      ];

      const reviewsWithImages = (data || []).map((review, index) => ({
        ...review,
        customer_image: page === 1 && index < customerImages.length ? customerImages[index] : undefined
      }));

      if (append) {
        setReviews(prev => [...prev, ...reviewsWithImages]);
      } else {
        setReviews(reviewsWithImages);
      }

    } catch (error) {
      console.error('Erro ao buscar avaliações:', error);
      toast({
        title: "Erro",
        description: "Erro ao carregar avaliações. Tente novamente.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
      setIsLoadingMore(false);
    }
  };

  const loadNextPage = async () => {
    if (hasNextPage && !isLoadingMore) {
      const nextPage = currentPage + 1;
      setCurrentPage(nextPage);
      await fetchReviews(nextPage, true);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, []);

  return {
    reviews,
    currentPage,
    totalPages,
    totalReviews,
    hasNextPage,
    isLoading,
    isLoadingMore,
    loadNextPage,
    refetch: () => fetchReviews()
  };
};
