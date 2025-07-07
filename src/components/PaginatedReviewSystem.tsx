import React, { useState, useEffect } from 'react';
import { Star, ChevronDown, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { usePaginatedReviews } from '@/hooks/usePaginatedReviews';
import { useReviewStats } from '@/hooks/useReviewStats';
import ImageUpload from './ImageUpload';
import ReviewImages from './ReviewImages';
import ReviewImageModal from './ReviewImageModal';
import { insertAllReviews } from '@/utils/insertReviewsToDatabase';

const PRODUCT_ID = '00000000-0000-0000-0000-000000000001';

const PaginatedReviewSystem = () => {
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [reviewForm, setReviewForm] = useState({
    name: '',
    title: '',
    comment: ''
  });
  const [selectedImages, setSelectedImages] = useState<File[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const [reviewsInserted, setReviewsInserted] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalImages, setModalImages] = useState<Array<{
    id: string;
    image_path: string;
    review: any;
  }>>([]);
  const [initialImageIndex, setInitialImageIndex] = useState(0);
  const { toast } = useToast();

  const {
    reviews,
    currentPage,
    totalPages,
    totalReviews,
    hasNextPage,
    isLoading,
    isLoadingMore,
    loadNextPage,
    refetch
  } = usePaginatedReviews();

  const {
    stats,
    isLoading: isLoadingStats,
    refetch: refetchStats
  } = useReviewStats();

  // Inserir avaliações automaticamente se ainda não foram inseridas
  useEffect(() => {
    const checkAndInsertReviews = async () => {
      if (totalReviews < 120 && !reviewsInserted) {
        console.log('Inserindo avaliações faltantes...');
        const success = await insertAllReviews();
        if (success) {
          setReviewsInserted(true);
          // Recarregar avaliações após inserção
          setTimeout(() => {
            refetch();
            refetchStats();
          }, 1000);
        }
      }
    };

    if (!isLoading && totalReviews > 0) {
      checkAndInsertReviews();
    }
  }, [totalReviews, isLoading, reviewsInserted, refetch, refetchStats]);

  // Calcular estatísticas
  const averageRating = reviews.length > 0 
    ? reviews.reduce((sum, review) => sum + review.star_rating, 0) / reviews.length 
    : 0;

  const ratingDistribution = [5, 4, 3, 2, 1].map(stars => {
    const count = reviews.filter(review => review.star_rating === stars).length;
    const percentage = totalReviews > 0 ? (count / totalReviews) * 100 : 0;
    return { stars, count, percentage };
  });

  // Função para preparar todas as imagens para o modal
  const prepareModalImages = () => {
    const allImages: Array<{
      id: string;
      image_path: string;
      review: any;
    }> = [];

    reviews.forEach(review => {
      // Adicionar imagens de avaliação se existirem
      if (review.review_images && review.review_images.length > 0) {
        review.review_images.forEach(image => {
          allImages.push({
            id: image.id,
            image_path: image.image_path,
            review: review
          });
        });
      }
      
      // Adicionar imagem do cliente se existir
      if (review.customer_image) {
        allImages.push({
          id: `customer-${review.id}`,
          image_path: review.customer_image,
          review: review
        });
      }
    });

    return allImages;
  };

  // Função para abrir o modal com uma imagem específica
  const handleImageClick = (reviewId: string, imageIndex: number = 0, isCustomerImage: boolean = false) => {
    const allImages = prepareModalImages();
    let targetIndex = 0;

    if (isCustomerImage) {
      targetIndex = allImages.findIndex(img => 
        img.id === `customer-${reviewId}`
      );
    } else {
      const review = reviews.find(r => r.id === reviewId);
      if (review && review.review_images) {
        targetIndex = allImages.findIndex(img => 
          img.review.id === reviewId && 
          img.image_path === review.review_images[imageIndex].image_path
        );
      }
    }

    setModalImages(allImages);
    setInitialImageIndex(Math.max(0, targetIndex));
    setModalOpen(true);
  };

  const uploadImages = async (reviewId: string, images: File[]) => {
    const uploadPromises = images.map(async (image, index) => {
      const fileExt = image.name.split('.').pop();
      const fileName = `${reviewId}_${index}_${Date.now()}.${fileExt}`;
      
      const { error: uploadError } = await supabase.storage
        .from('review-images')
        .upload(fileName, image);

      if (uploadError) throw uploadError;

      const { error: dbError } = await supabase
        .from('review_images')
        .insert({
          review_id: reviewId,
          image_path: fileName
        });

      if (dbError) throw dbError;
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

      if (error) throw error;

      if (selectedImages.length > 0) {
        try {
          await uploadImages(data.id, selectedImages);
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

  if (isLoading || isLoadingStats) {
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
              {stats.averageRating.toFixed(1)}
            </div>
            <div className="flex justify-center items-center mb-2">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`h-6 w-6 ${
                    i < Math.floor(stats.averageRating) ? 'text-yellow-400 fill-current' : 'text-gray-300'
                  }`}
                />
              ))}
            </div>
            <p className="text-gray-600">
              {stats.totalReviews > 0 ? `Baseado em ${stats.totalReviews} avaliações` : 'Nenhuma avaliação ainda'}
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
            {stats.ratingDistribution.map((item) => (
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

      {/* Lista de Avaliações Paginada */}
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h3 className="text-xl font-semibold">Avaliações ({totalReviews})</h3>
          {totalPages > 1 && (
            <span className="text-sm text-gray-500">
              Página {currentPage} de {totalPages}
            </span>
          )}
        </div>

        {reviews.length === 0 ? (
          <div className="bg-white rounded-lg shadow p-6 text-center">
            <p className="text-gray-600">Ainda não há avaliações para este produto.</p>
            <p className="text-sm text-gray-500 mt-2">Seja o primeiro a avaliar!</p>
          </div>
        ) : (
          <>
            {reviews.map((review) => (
              <div key={review.id} className="bg-white rounded-lg shadow p-6">
                {/* Cabeçalho da Avaliação */}
                <div className="flex justify-between items-start mb-4">
                  <div className="flex items-start space-x-4">
                    <div className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center flex-shrink-0">
                      <User className="h-6 w-6 text-gray-500" />
                    </div>

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

                  {review.customer_image && (
                    <Badge variant="secondary" className="text-xs">
                      Cliente Verificado
                    </Badge>
                  )}
                </div>

                {/* Título da Avaliação */}
                {review.review_title && (
                  <h5 className="font-semibold mb-2 text-lg">{review.review_title}</h5>
                )}

                {/* Comentário da Avaliação */}
                <p className="text-gray-700 mb-4 leading-relaxed">{review.review_comment}</p>

                {/* Imagem do Cliente */}
                {review.customer_image && (
                  <div className="mt-4 mb-3">
                    <img
                      src={review.customer_image}
                      alt={`Foto de ${review.reviewer_name}`}
                      className="w-20 h-20 rounded-lg object-cover border-2 border-gray-200 shadow-sm cursor-pointer hover:opacity-80 transition-opacity"
                      onClick={() => handleImageClick(review.id, 0, true)}
                    />
                  </div>
                )}

                {/* Imagens da Avaliação */}
                <ReviewImages 
                  images={review.review_images || []} 
                  onImageClick={(imageIndex) => handleImageClick(review.id, imageIndex, false)}
                />
              </div>
            ))}

            {/* Botão Carregar Mais */}
            {hasNextPage && (
              <div className="text-center">
                <Button
                  onClick={loadNextPage}
                  disabled={isLoadingMore}
                  variant="outline"
                  className="px-8 py-3"
                >
                  {isLoadingMore ? (
                    'Carregando...'
                  ) : (
                    <>
                      <ChevronDown className="h-4 w-4 mr-2" />
                      Ver mais avaliações ({totalReviews - reviews.length} restantes)
                    </>
                  )}
                </Button>
              </div>
            )}
          </>
        )}
      </div>

      {/* Modal de Imagem */}
      <ReviewImageModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        images={modalImages}
        initialImageIndex={initialImageIndex}
      />
    </div>
  );
};

export default PaginatedReviewSystem;
