
import React, { useState, useEffect } from 'react';
import { X, ChevronLeft, ChevronRight, Star } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

interface ReviewImageModalProps {
  isOpen: boolean;
  onClose: () => void;
  images: Array<{
    id: string;
    image_path: string;
    review: {
      id: string;
      reviewer_name: string;
      star_rating: number;
      review_comment: string;
      created_at: string;
      customer_image?: string;
    };
  }>;
  initialImageIndex: number;
}

const ReviewImageModal: React.FC<ReviewImageModalProps> = ({
  isOpen,
  onClose,
  images,
  initialImageIndex
}) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(initialImageIndex);

  useEffect(() => {
    setCurrentImageIndex(initialImageIndex);
  }, [initialImageIndex]);

  useEffect(() => {
    const handleEscapeKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscapeKey);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscapeKey);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  if (!isOpen || images.length === 0) return null;

  const currentImage = images[currentImageIndex];
  const currentReview = currentImage.review;

  const getImageUrl = (path: string) => {
    if (path.startsWith('/lovable-uploads/')) {
      return path;
    }
    const { data } = supabase.storage
      .from('review-images')
      .getPublicUrl(path);
    return data.publicUrl;
  };

  const handlePrevious = () => {
    setCurrentImageIndex((prev) => 
      prev === 0 ? images.length - 1 : prev - 1
    );
  };

  const handleNext = () => {
    setCurrentImageIndex((prev) => 
      prev === images.length - 1 ? 0 : prev + 1
    );
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

  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-80 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg max-w-7xl w-full h-[90vh] flex overflow-hidden">
        {/* Coluna 1: Thumbnails */}
        <div className="w-48 bg-gray-50 border-r border-gray-200 overflow-y-auto">
          <div className="p-4">
            <h3 className="text-sm font-semibold text-gray-700 mb-3">Customer Images</h3>
            <div className="space-y-2">
              {images.map((image, index) => (
                <div
                  key={image.id}
                  className={`cursor-pointer rounded-lg overflow-hidden border-2 transition-all ${
                    index === currentImageIndex
                      ? 'border-blue-500 ring-2 ring-blue-200'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                  onClick={() => setCurrentImageIndex(index)}
                >
                  <img
                    src={getImageUrl(image.image_path)}
                    alt={`Thumbnail ${index + 1}`}
                    className="w-full h-20 object-cover"
                  />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Coluna 2: Imagem Principal */}
        <div className="flex-1 relative bg-gray-100 flex items-center justify-center">
          <button
            onClick={handlePrevious}
            className="absolute left-4 z-10 bg-white bg-opacity-80 hover:bg-opacity-100 rounded-full p-3 shadow-lg transition-all"
            disabled={images.length <= 1}
          >
            <ChevronLeft className="h-6 w-6 text-gray-700" />
          </button>

          <img
            src={getImageUrl(currentImage.image_path)}
            alt="Imagem da avaliação em tela cheia"
            className="max-w-full max-h-full object-contain"
          />

          <button
            onClick={handleNext}
            className="absolute right-4 z-10 bg-white bg-opacity-80 hover:bg-opacity-100 rounded-full p-3 shadow-lg transition-all"
            disabled={images.length <= 1}
          >
            <ChevronRight className="h-6 w-6 text-gray-700" />
          </button>
        </div>

        {/* Coluna 3: Conteúdo da Avaliação */}
        <div className="w-80 bg-white border-l border-gray-200 overflow-y-auto">
          <div className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-800">Avaliação</h3>
              <button
                onClick={onClose}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <X className="h-5 w-5 text-gray-500" />
              </button>
            </div>

            {/* Avaliação com estrelas */}
            <div className="flex items-center mb-3">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`h-4 w-4 ${
                    i < currentReview.star_rating ? 'text-yellow-400 fill-current' : 'text-gray-300'
                  }`}
                />
              ))}
            </div>

            {/* Nome e data */}
            <div className="mb-4">
              <h4 className="font-semibold text-gray-800">{currentReview.reviewer_name}</h4>
              <p className="text-sm text-gray-600">{formatDate(currentReview.created_at)}</p>
            </div>

            {/* Foto do cliente se disponível */}
            {currentReview.customer_image && (
              <div className="mb-4">
                <img
                  src={currentReview.customer_image}
                  alt={`Foto de ${currentReview.reviewer_name}`}
                  className="w-16 h-16 rounded-lg object-cover border-2 border-gray-200"
                />
              </div>
            )}

            {/* Texto da avaliação */}
            <div className="text-gray-700 leading-relaxed">
              <p>{currentReview.review_comment}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReviewImageModal;
