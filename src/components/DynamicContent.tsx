import React from 'react';
import { useProductDetails } from '@/hooks/useProductDetails';
const DynamicContent = () => {
  const {
    content,
    isLoading
  } = useProductDetails();
  if (isLoading) {
    return <div className="container mx-auto px-4 py-8">
        <div className="bg-white rounded-lg shadow-lg p-6 lg:p-8">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-3/4 mb-4"></div>
            <div className="h-6 bg-gray-200 rounded w-1/2 mb-6"></div>
            <div className="h-64 bg-gray-200 rounded mb-6"></div>
            <div className="space-y-3">
              <div className="h-4 bg-gray-200 rounded"></div>
              <div className="h-4 bg-gray-200 rounded w-5/6"></div>
              <div className="h-4 bg-gray-200 rounded w-4/6"></div>
            </div>
          </div>
        </div>
      </div>;
  }
  if (!content || !content.content) {
    return <div className="container mx-auto px-4 py-8">
        <div className="bg-white rounded-lg shadow-lg p-6 lg:p-8 text-center">
          <p className="text-gray-500">Conteúdo não encontrado.</p>
        </div>
      </div>;
  }
  return;
};
export default DynamicContent;