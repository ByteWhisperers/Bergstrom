
import React from 'react';
import Header from '@/components/Header';
import Breadcrumbs from '@/components/Breadcrumbs';
import ProductGallery from '@/components/ProductGallery';
import ProductInfo from '@/components/ProductInfo';
import ProductDetails from '@/components/ProductDetails';
import PaginatedReviewSystem from '@/components/PaginatedReviewSystem';
import DynamicContent from '@/components/DynamicContent';
import Footer from '@/components/Footer';

const Index = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <Breadcrumbs />
      
      {/* Conteúdo Dinâmico da Página */}
      <DynamicContent />

      {/* Main Product Section */}
      <div className="container mx-auto px-4 py-8">
        <div className="bg-white rounded-lg shadow-lg p-6 lg:p-8">
          <div className="flex flex-col lg:flex-row gap-8">
            <ProductGallery />
            <ProductInfo />
          </div>
        </div>
      </div>

      <ProductDetails />
      <PaginatedReviewSystem />
      <Footer />
    </div>
  );
};

export default Index;
