
import React, { useState } from 'react';

const ProductGallery = () => {
  const [selectedImage, setSelectedImage] = useState(0);

  const images = [
    'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=600&h=600&fit=crop',
    'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=600&h=600&fit=crop',
    'https://images.unsplash.com/photo-1521223890158-f9f7c3d5d504?w=600&h=600&fit=crop',
    'https://images.unsplash.com/photo-1580657018950-c7f7d6a6d990?w=600&h=600&fit=crop'
  ];

  return (
    <div className="lg:w-1/2">
      {/* Main Image */}
      <div className="mb-4">
        <img
          src={images[selectedImage]}
          alt="Jaqueta de Couro Masculina"
          className="w-full h-96 lg:h-[500px] object-cover rounded-lg shadow-lg"
        />
      </div>

      {/* Thumbnail Images */}
      <div className="flex space-x-2 overflow-x-auto">
        {images.map((image, index) => (
          <button
            key={index}
            onClick={() => setSelectedImage(index)}
            className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-colors ${
              selectedImage === index
                ? 'border-bergstrom-primary'
                : 'border-gray-200 hover:border-gray-300'
            }`}
          >
            <img
              src={image}
              alt={`Produto ${index + 1}`}
              className="w-full h-full object-cover"
            />
          </button>
        ))}
      </div>
    </div>
  );
};

export default ProductGallery;
