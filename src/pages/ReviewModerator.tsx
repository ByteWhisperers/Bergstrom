
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { useReviewModeration } from '@/hooks/useReviewModeration';
import { 
  ArrowLeft, 
  MessageSquare, 
  Star, 
  Trash2, 
  Eye,
  Calendar,
  User
} from 'lucide-react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

const ReviewModerator = () => {
  const navigate = useNavigate();
  const { reviews, isLoading, updateReview, deleteReview } = useReviewModeration();
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const handleApprovalChange = async (reviewId: string, isApproved: boolean) => {
    await updateReview(reviewId, { is_approved: isApproved });
  };

  const handleDeleteReview = async (reviewId: string) => {
    setDeletingId(reviewId);
    const success = await deleteReview(reviewId);
    if (success) {
      setDeletingId(null);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const renderStars = (rating: number) => {
    return [...Array(5)].map((_, i) => (
      <Star
        key={i}
        className={`h-4 w-4 ${
          i < rating ? 'text-yellow-400 fill-current' : 'text-gray-300'
        }`}
      />
    ));
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-lg">Carregando avaliações...</div>
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
              <MessageSquare className="h-6 w-6 mr-2" />
              Moderação de Avaliações
            </h1>
            <p className="text-gray-600 mt-1">
              Gerencie todas as avaliações dos clientes
            </p>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center space-x-2">
                <div className="text-2xl font-bold text-blue-600">
                  {reviews.length}
                </div>
                <div className="text-sm text-gray-600">Total de Avaliações</div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center space-x-2">
                <div className="text-2xl font-bold text-green-600">
                  {reviews.filter(r => r.is_approved).length}
                </div>
                <div className="text-sm text-gray-600">Aprovadas</div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center space-x-2">
                <div className="text-2xl font-bold text-orange-600">
                  {reviews.filter(r => !r.is_approved).length}
                </div>
                <div className="text-sm text-gray-600">Pendentes</div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Reviews List */}
        <div className="space-y-4">
          {reviews.map((review) => (
            <Card key={review.id}>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="space-y-2">
                    <div className="flex items-center space-x-3">
                      <div className="flex items-center space-x-1">
                        <User className="h-4 w-4 text-gray-500" />
                        <span className="font-semibold">{review.reviewer_name}</span>
                      </div>
                      <div className="flex">{renderStars(review.star_rating)}</div>
                      <Badge variant={review.is_approved ? "default" : "secondary"}>
                        {review.is_approved ? "Aprovada" : "Pendente"}
                      </Badge>
                    </div>
                    
                    {review.review_title && (
                      <h3 className="font-semibold text-gray-900">
                        {review.review_title}
                      </h3>
                    )}
                    
                    <div className="flex items-center space-x-2 text-sm text-gray-500">
                      <Calendar className="h-4 w-4" />
                      <span>{formatDate(review.created_at)}</span>
                    </div>
                  </div>

                  <div className="flex items-center space-x-4">
                    {/* Approval Switch */}
                    <div className="flex items-center space-x-2">
                      <span className="text-sm text-gray-600">Aprovada</span>
                      <Switch
                        checked={review.is_approved}
                        onCheckedChange={(checked) => 
                          handleApprovalChange(review.id, checked)
                        }
                      />
                    </div>

                    {/* Delete Button */}
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button
                          variant="outline"
                          size="sm"
                          className="text-red-600 hover:text-red-700"
                          disabled={deletingId === review.id}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Excluir Avaliação</AlertDialogTitle>
                          <AlertDialogDescription>
                            Tem certeza que deseja excluir esta avaliação? Esta ação não pode ser desfeita.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancelar</AlertDialogCancel>
                          <AlertDialogAction
                            onClick={() => handleDeleteReview(review.id)}
                            className="bg-red-600 hover:bg-red-700"
                          >
                            Excluir
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </div>
              </CardHeader>
              
              <CardContent>
                <p className="text-gray-700 mb-4">{review.review_comment}</p>
                
                {review.review_images && review.review_images.length > 0 && (
                  <div className="mt-4">
                    <div className="text-sm text-gray-600 mb-2">Imagens da avaliação:</div>
                    <div className="flex space-x-2">
                      {review.review_images.map((img) => (
                        <div key={img.id} className="w-16 h-16 bg-gray-100 rounded border">
                          {/* Placeholder para imagens */}
                          <div className="w-full h-full flex items-center justify-center">
                            <Eye className="h-6 w-6 text-gray-400" />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>

        {reviews.length === 0 && (
          <Card>
            <CardContent className="text-center py-8">
              <MessageSquare className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">Nenhuma avaliação encontrada.</p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default ReviewModerator;
