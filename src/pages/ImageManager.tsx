
import React, { useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { useSiteImages } from '@/hooks/useSiteImages';
import { ArrowLeft, Upload, Image as ImageIcon } from 'lucide-react';

const ImageManager = () => {
  const navigate = useNavigate();
  const { images, isLoading, uploadImage, getImageUrl } = useSiteImages();
  const fileInputRefs = useRef<Record<string, HTMLInputElement | null>>({});

  const handleFileSelect = async (imageKey: string, file: File | null) => {
    if (file) {
      await uploadImage(imageKey, file);
      // Reset input
      if (fileInputRefs.current[imageKey]) {
        fileInputRefs.current[imageKey]!.value = '';
      }
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-lg">Carregando imagens...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center space-x-4 mb-8">
          <Button
            onClick={() => navigate('/admin/dashboard')}
            variant="outline"
            size="sm"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Voltar
          </Button>
          <div>
            <h1 className="text-2xl font-bold flex items-center">
              <ImageIcon className="h-6 w-6 mr-2" />
              Gerenciar Imagens do Site
            </h1>
            <p className="text-gray-600 mt-1">
              Faça upload e gerencie as imagens do seu site
            </p>
          </div>
        </div>

        {/* Images Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {images.map((image) => {
            const imageUrl = getImageUrl(image.image_path);
            
            return (
              <Card key={image.id}>
                <CardHeader>
                  <CardTitle className="text-lg">{image.description}</CardTitle>
                  <div className="text-sm text-gray-500">
                    Chave: {image.image_key}
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Image Preview */}
                  <div className="aspect-video bg-gray-100 rounded-lg flex items-center justify-center overflow-hidden">
                    {imageUrl ? (
                      <img
                        src={imageUrl}
                        alt={image.description}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.currentTarget.src = '/placeholder.svg';
                        }}
                      />
                    ) : (
                      <div className="text-center text-gray-400">
                        <ImageIcon className="h-12 w-12 mx-auto mb-2" />
                        <p className="text-sm">Nenhuma imagem</p>
                      </div>
                    )}
                  </div>

                  {/* Upload Controls */}
                  <div className="space-y-3">
                    <Input
                      ref={(el) => fileInputRefs.current[image.image_key] = el}
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleFileSelect(image.image_key, e.target.files?.[0] || null)}
                      className="hidden"
                      id={`file-${image.image_key}`}
                    />
                    
                    <Button
                      onClick={() => fileInputRefs.current[image.image_key]?.click()}
                      variant="outline"
                      className="w-full"
                    >
                      <Upload className="h-4 w-4 mr-2" />
                      {imageUrl ? 'Alterar Imagem' : 'Fazer Upload'}
                    </Button>

                    {imageUrl && (
                      <div className="text-xs text-gray-500 text-center">
                        Última atualização: {new Date(image.updated_at).toLocaleDateString('pt-BR')}
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {images.length === 0 && (
          <Card>
            <CardContent className="text-center py-8">
              <p className="text-gray-500">Nenhuma imagem encontrada.</p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default ImageManager;
