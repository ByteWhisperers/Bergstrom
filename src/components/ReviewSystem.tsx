import React, { useState, useEffect } from 'react';
import { Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Progress } from '@/components/ui/progress';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import ImageUpload from './ImageUpload';
import ReviewImages from './ReviewImages';

interface Review {
  id: string;
  reviewer_name: string;
  star_rating: number;
  review_title?: string;
  review_comment: string;
  created_at: string;
  review_images?: Array<{
    id: string;
    image_path: string;
  }>;
}

const PRODUCT_ID = '00000000-0000-0000-0000-000000000001';

const ReviewSystem = () => {
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [reviewForm, setReviewForm] = useState({
    name: '',
    title: '',
    comment: ''
  });
  const [selectedImages, setSelectedImages] = useState<File[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [averageRating, setAverageRating] = useState(0);
  const [totalReviews, setTotalReviews] = useState(0);
  const [ratingDistribution, setRatingDistribution] = useState([
    { stars: 5, count: 0, percentage: 0 },
    { stars: 4, count: 0, percentage: 0 },
    { stars: 3, count: 0, percentage: 0 },
    { stars: 2, count: 0, percentage: 0 },
    { stars: 1, count: 0, percentage: 0 }
  ]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    console.log('ReviewSystem inicializado, carregando avaliações...');
    fetchReviews();
  }, []);

  const fetchReviews = async () => {
    try {
      setLoading(true);
      console.log('Buscando avaliações aprovadas...');
      
      const { data: reviewsData, error: reviewsError } = await supabase
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
        .order('created_at', { ascending: false });

      if (reviewsError) {
        console.error('Erro ao buscar avaliações:', reviewsError);
        throw reviewsError;
      }

      console.log('Avaliações aprovadas carregadas:', reviewsData);
      const reviews = reviewsData || [];
      setReviews(reviews);
      
      // Calcular estatísticas
      const total = reviews.length;
      setTotalReviews(total);
      
      if (total > 0) {
        const average = reviews.reduce((sum, review) => sum + review.star_rating, 0) / total;
        setAverageRating(Math.round(average * 10) / 10);
        
        // Calcular distribuição de avaliações
        const distribution = [5, 4, 3, 2, 1].map(stars => {
          const count = reviews.filter(review => review.star_rating === stars).length;
          const percentage = total > 0 ? (count / total) * 100 : 0;
          return { stars, count, percentage };
        });
        setRatingDistribution(distribution);
      } else {
        setAverageRating(0);
        setRatingDistribution([
          { stars: 5, count: 0, percentage: 0 },
          { stars: 4, count: 0, percentage: 0 },
          { stars: 3, count: 0, percentage: 0 },
          { stars: 2, count: 0, percentage: 0 },
          { stars: 1, count: 0, percentage: 0 }
        ]);
      }
    } catch (error) {
      console.error('Erro ao carregar avaliações:', error);
      toast({
        title: "Erro",
        description: "Erro ao carregar avaliações. Tente novamente.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const uploadImages = async (reviewId: string, images: File[]) => {
    const uploadPromises = images.map(async (image, index) => {
      const fileExt = image.name.split('.').pop();
      const fileName = `${reviewId}_${index}_${Date.now()}.${fileExt}`;
      
      const { error: uploadError } = await supabase.storage
        .from('review-images')
        .upload(fileName, image);

      if (uploadError) {
        console.error('Erro ao fazer upload da imagem:', uploadError);
        throw uploadError;
      }

      const { error: dbError } = await supabase
        .from('review_images')
        .insert({
          review_id: reviewId,
          image_path: fileName
        });

      if (dbError) {
        console.error('Erro ao salvar referência da imagem:', dbError);
        throw dbError;
      }

      return fileName;
    });

    return Promise.all(uploadPromises);
  };

  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!rating || !reviewForm.name || !reviewForm.comment) {
      toast({
        title: "Campos obrigatórios",
        description: "Por favor, preencha nome, avaliação e comentário.",
        variant: "destructive",
      });
      return;
    }

    setSubmitting(true);

    try {
      console.log('Enviando nova avaliação...');
      
      const { data, error } = await supabase
        .from('reviews')
        .insert({
          product_id: PRODUCT_ID,
          reviewer_name: reviewForm.name,
          star_rating: rating,
          review_title: reviewForm.title || null,
          review_comment: reviewForm.comment,
          is_approved: false
        })
        .select()
        .single();

      if (error) {
        console.error('Erro ao inserir avaliação:', error);
        throw error;
      }

      console.log('Avaliação inserida com sucesso:', data);

      // Upload das imagens se houver
      if (selectedImages.length > 0) {
        try {
          await uploadImages(data.id, selectedImages);
          console.log('Imagens enviadas com sucesso');
        } catch (imageError) {
          console.error('Erro ao enviar imagens:', imageError);
        }
      }

      toast({
        title: "Avaliação enviada!",
        description: "Sua avaliação foi enviada e está aguardando aprovação.",
      });

      // Reset form
      setReviewForm({ name: '', title: '', comment: '' });
      setRating(0);
      setSelectedImages([]);
      setShowReviewForm(false);
      
      // Recarregar avaliações
      await fetchReviews();
      
    } catch (error) {
      console.error('Erro ao enviar avaliação:', error);
      toast({
        title: "Erro",
        description: "Erro ao enviar avaliação. Tente novamente.",
        variant: "destructive",
      });
    } finally {
      setSubmitting(false);
    }
  };

  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      const now = new Date();
      const diffTime = Math.abs(now.getTime() - date.getTime());
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      
      if (diffDays === 1) return 'ontem';
      if (diffDays < 7) return `${diffDays} dias atrás`;
      if (diffDays < 30) return `${Math.ceil(diffDays / 7)} semanas atrás`;
      return `${Math.ceil(diffDays / 30)} meses atrás`;
    } catch (error) {
      return 'Data inválida';
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8" id="reviews">
        <div className="flex justify-center items-center h-32">
          <div className="text-lg">Carregando avaliações...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8" id="reviews">
      <h2 className="text-3xl font-bold text-blue-600 mb-8">Avaliações dos Clientes</h2>

      {/* Resumo das Avaliações */}
      <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
        <div className="grid md:grid-cols-2 gap-8">
          {/* Avaliação Geral */}
          <div className="text-center">
            <div className="text-5xl font-bold text-blue-600 mb-2">
              {averageRating.toFixed(1)}
            </div>
            <div className="flex justify-center items-center mb-2">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`h-6 w-6 ${
                    i < Math.floor(averageRating) ? 'text-yellow-400 fill-current' : 'text-gray-300'
                  }`}
                />
              ))}
            </div>
            <p className="text-gray-600">
              {totalReviews > 0 ? `Baseado em ${totalReviews} avaliações` : 'Nenhuma avaliação ainda'}
            </p>
            <Button
              onClick={() => setShowReviewForm(true)}
              className="mt-4 bg-blue-600 hover:bg-blue-700"
            >
              Escrever Avaliação
            </Button>
          </div>

          {/* Distribuição de Avaliações */}
          <div className="space-y-2">
            {ratingDistribution.map((item) => (
              <div key={item.stars} className="flex items-center space-x-2">
                <span className="text-sm w-6">{item.stars}</span>
                <Star className="h-4 w-4 text-yellow-400 fill-current" />
                <Progress value={item.percentage} className="flex-1 h-2" />
                <span className="text-sm text-gray-600 w-8">{item.count}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Formulário de Avaliação */}
      {showReviewForm && (
        <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-semibold">Escrever Avaliação</h3>
            <Button 
              variant="ghost" 
              onClick={() => setShowReviewForm(false)} 
              disabled={submitting}
            >
              ✕
            </Button>
          </div>

          <form onSubmit={handleSubmitReview} className="space-y-4">
            <div>
              <Label htmlFor="name">Seu nome *</Label>
              <Input
                id="name"
                value={reviewForm.name}
                onChange={(e) => setReviewForm(prev => ({ ...prev, name: e.target.value }))}
                required
                disabled={submitting}
              />
            </div>

            <div>
              <Label htmlFor="title">Título da Avaliação (Opcional)</Label>
              <Input
                id="title"
                value={reviewForm.title}
                onChange={(e) => setReviewForm(prev => ({ ...prev, title: e.target.value }))}
                placeholder="ex: Excelente qualidade!"
                disabled={submitting}
              />
            </div>

            <div>
              <Label>Sua avaliação *</Label>
              <div className="flex space-x-1 mt-1">
                {[...Array(5)].map((_, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => setRating(i + 1)}
                    onMouseEnter={() => setHoverRating(i + 1)}
                    onMouseLeave={() => setHoverRating(0)}
                    className="focus:outline-none"
                    disabled={submitting}
                  >
                    <Star
                      className={`h-8 w-8 ${
                        i < (hoverRating || rating) ? 'text-yellow-400 fill-current' : 'text-gray-300'
                      }`}
                    />
                  </button>
                ))}
              </div>
            </div>

            {/* Componente de Upload de Imagens */}
            <ImageUpload
              onImagesChange={setSelectedImages}
              maxImages={3}
            />

            <div>
              <Label htmlFor="comment">Comentário *</Label>
              <Textarea
                id="comment"
                placeholder="Conte sobre sua experiência com o produto..."
                value={reviewForm.comment}
                onChange={(e) => setReviewForm(prev => ({ ...prev, comment: e.target.value }))}
                rows={4}
                required
                disabled={submitting}
              />
            </div>

            <Button
              type="submit"
              className="bg-blue-600 hover:bg-blue-700"
              disabled={!rating || !reviewForm.name || !reviewForm.comment || submitting}
            >
              {submitting ? 'Enviando...' : 'Enviar Avaliação'}
            </Button>
          </form>
        </div>
      )}

      {/* Lista de Avaliações */}
      <div className="space-y-6">
        <h3 className="text-xl font-semibold">Avaliações ({totalReviews})</h3>

        {reviews.length === 0 ? (
          <div className="bg-white rounded-lg shadow p-6 text-center">
            <p className="text-gray-600">Ainda não há avaliações para este produto.</p>
            <p className="text-sm text-gray-500 mt-2">Seja o primeiro a avaliar!</p>
          </div>
        ) : (
          reviews.map((review) => (
            <div key={review.id} className="bg-white rounded-lg shadow p-6">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h4 className="font-semibold mb-1">{review.reviewer_name}</h4>
                  <div className="flex items-center space-x-2">
                    <div className="flex">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`h-4 w-4 ${
                            i < review.star_rating ? 'text-yellow-400 fill-current' : 'text-gray-300'
                          }`}
                        />
                      ))}
                    </div>
                    <span className="text-sm text-gray-600">{formatDate(review.created_at)}</span>
                  </div>
                </div>
              </div>

              {review.review_title && (
                <h5 className="font-semibold mb-2">{review.review_title}</h5>
              )}

              <p className="text-gray-700 mb-3">{review.review_comment}</p>

              {/* Exibir imagens da avaliação */}
              <ReviewImages images={review.review_images || []} />
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default ReviewSystem;
