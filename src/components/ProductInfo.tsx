import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ShoppingCart, Star, Shield, Truck, Award } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
const ProductInfo = () => {
  const [quantity, setQuantity] = useState(1);
  const {
    toast
  } = useToast();
  const handleButtonClick = () => {
    toast({
      title: "Produto adicionado!",
      description: `${quantity} jaqueta(s) de couro preta adicionada(s) ao carrinho.`
    });

    // Redirecionar para o link específico
    setTimeout(() => {
      window.location.href = 'https://bergstrom-product-showcase.lovable.app/carrinho';
    }, 500);
  };
  return <div className="flex-1 space-y-6">
      {/* Product Title */}
      <div>
        <Badge variant="secondary" className="mb-2">
          🔥 Mais Vendida
        </Badge>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Jaqueta de Couro Premium Bergström
        </h1>
        <div className="flex items-center space-x-2 mb-4">
          <div className="flex">
            {[...Array(5)].map((_, i) => <Star key={i} className="h-5 w-5 text-yellow-400 fill-current" />)}
          </div>
          <span className="text-gray-600">(4.9 estrelas - 120+ avaliações)</span>
        </div>
      </div>

      {/* Price */}
      <div className="space-y-2">
        <div className="flex items-baseline space-x-3">
          <span className="text-4xl font-bold text-blue-600">R$ 89,90</span>
          <span className="text-xl text-gray-500 line-through">R$ 159,90</span>
          <Badge variant="destructive">44% OFF</Badge>
        </div>
        <p className="text-sm text-gray-600">
          Em até 12x de R$ 7,49 sem juros no cartão
        </p>
      </div>

      {/* Color Selection - Only Black */}
      <div className="space-y-3">
        <h3 className="text-lg font-semibold">Cor: Preta</h3>
        <div className="flex space-x-3">
          <div className="relative">
            <div className="w-12 h-12 rounded-full bg-black border-4 border-blue-500 cursor-pointer flex items-center justify-center">
              <div className="w-8 h-8 rounded-full bg-black"></div>
            </div>
            
          </div>
        </div>
      </div>

      {/* Quantity */}
      <div className="space-y-3">
        <h3 className="text-lg font-semibold">Quantidade</h3>
        <div className="flex items-center space-x-3">
          <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="w-10 h-10 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-50">
            -
          </button>
          <span className="text-xl font-semibold px-4">{quantity}</span>
          <button onClick={() => setQuantity(quantity + 1)} className="w-10 h-10 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-50">
            +
          </button>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="space-y-3">
        {/* Botão Primário - Comprar Agora (Verde e Principal) */}
        <Button onClick={handleButtonClick} className="w-full bg-green-600 hover:bg-green-700 text-white py-4 text-lg font-bold shadow-lg" size="lg">
          💳 Comprar Agora - R$ {(89.90 * quantity).toFixed(2)}
        </Button>
        
        {/* Botão Secundário - Adicionar ao Carrinho */}
        <Button onClick={handleButtonClick} variant="outline" className="w-full py-3 text-base border-2 border-gray-400 text-gray-700 hover:bg-gray-50 bg-transparent">
          <ShoppingCart className="h-5 w-5 mr-2" />
          Adicionar ao Carrinho
        </Button>
      </div>

      {/* Features */}
      <div className="grid grid-cols-2 gap-4 pt-6 border-t">
        <div className="flex items-center space-x-2">
          <Shield className="h-5 w-5 text-green-600" />
          <span className="text-sm">Couro Genuíno</span>
        </div>
        <div className="flex items-center space-x-2">
          <Truck className="h-5 w-5 text-blue-600" />
          <span className="text-sm">Frete Grátis</span>
        </div>
        <div className="flex items-center space-x-2">
          <Award className="h-5 w-5 text-yellow-600" />
          <span className="text-sm">Kit Frio Incluso</span>
        </div>
        <div className="flex items-center space-x-2">
          <Shield className="h-5 w-5 text-purple-600" />
          <span className="text-sm">7 Dias de Garantia</span>
        </div>
      </div>

      {/* Urgency */}
      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
        <div className="flex items-center space-x-2 text-red-700">
          <span className="font-semibold">⚡ Oferta por tempo limitado!</span>
        </div>
        <p className="text-sm text-red-600 mt-1">
          Apenas 23 unidades restantes em estoque. Não perca!
        </p>
      </div>
    </div>;
};
export default ProductInfo;