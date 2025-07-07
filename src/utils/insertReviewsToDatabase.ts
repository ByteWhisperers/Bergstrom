
import { supabase } from '@/integrations/supabase/client';
import { getAllReviews } from '@/data/reviewsData';

const PRODUCT_ID = '00000000-0000-0000-0000-000000000001';

export const insertAllReviews = async () => {
  try {
    console.log('Inserindo 120 avaliações no banco de dados...');
    
    const allReviews = getAllReviews();
    
    // Inserir avaliações em lotes para evitar timeout
    const batchSize = 20;
    const batches = [];
    
    for (let i = 0; i < allReviews.length; i += batchSize) {
      batches.push(allReviews.slice(i, i + batchSize));
    }
    
    for (const batch of batches) {
      const reviewsToInsert = batch.map(review => ({
        product_id: PRODUCT_ID,
        reviewer_name: review.reviewer_name,
        star_rating: review.star_rating,
        review_title: review.review_title || null,
        review_comment: review.review_comment,
        is_approved: true // Todas aprovadas
      }));
      
      const { error } = await supabase
        .from('reviews')
        .insert(reviewsToInsert);
        
      if (error) {
        console.error('Erro ao inserir lote:', error);
        throw error;
      }
      
      console.log(`Lote de ${batch.length} avaliações inserido com sucesso`);
    }
    
    console.log('Todas as 120 avaliações foram inseridas com sucesso!');
    return true;
  } catch (error) {
    console.error('Erro ao inserir avaliações:', error);
    return false;
  }
};
