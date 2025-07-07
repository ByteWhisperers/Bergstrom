
import React from 'react';
import { Image } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

interface ReviewImagesProps {
  images: Array<{
    id: string;
    image_path: string;
  }>;
  onImageClick?: (imageIndex: number) => void;
}

const ReviewImages: React.FC<ReviewImagesProps> = ({ images, onImageClick }) => {
  if (!images || images.length === 0) {
    return null;
  }

  const getImageUrl = (path: string) => {
    if (path.startsWith('/lovable-uploads/')) {
      return path;
    }
    const { data } = supabase.storage
      .from('review-images')
      .getPublicUrl(path);
    return data.publicUrl;
  };

  return (
    <div className="mt-3">
      <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
        {images.map((image, index) => (
          <div key={image.id} className="relative group">
            <img
              src={getImageUrl(image.image_path)}
              alt="Imagem da avaliação"
              className="w-full h-20 object-cover rounded-md border cursor-pointer hover:opacity-80 transition-opacity"
              onClick={() => onImageClick?.(index)}
            />
            <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all rounded-md flex items-center justify-center">
              <Image className="h-4 w-4 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ReviewImages;
