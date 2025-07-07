
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ShoppingCart, ArrowLeft, ExternalLink } from 'lucide-react';
import { useSiteData } from '@/contexts/SiteDataContext';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

const Cart = () => {
  const navigate = useNavigate();
  const { colors, links } = useSiteData();

  const handleCheckout = () => {
    const checkoutUrl = links.checkout_button || 'https://sua-plataforma-de-pagamento.com/checkout';
    window.open(checkoutUrl, '_blank');
  };

  const productData = {
    name: 'Jaqueta de Couro Masculina - Jones Carter + Brinde KIT FRIO',
    price: 89.90,
    color: 'Preto',
    size: 'M',
    quantity: 1,
    image: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=300&h=300&fit=crop'
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="container mx-auto px-4 py-8">
        {/* Breadcrumb */}
        <div className="flex items-center space-x-2 mb-6">
          <Button 
            variant="ghost" 
            onClick={() => navigate('/')}
            className="p-0 h-auto hover:bg-transparent"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Voltar ao produto
          </Button>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Carrinho */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <ShoppingCart className="h-5 w-5 mr-2" />
                  Seu Carrinho
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col md:flex-row gap-4 p-4 border rounded-lg">
                  <img
                    src={productData.image}
                    alt={productData.name}
                    className="w-24 h-24 object-cover rounded-lg"
                  />
                  <div className="flex-1">
                    <h3 className="font-semibold mb-2">{productData.name}</h3>
                    <div className="flex flex-wrap gap-2 mb-2">
                      <Badge variant="secondary">Cor: {productData.color}</Badge>
                      <Badge variant="secondary">Tamanho: {productData.size}</Badge>
                      <Badge variant="secondary">Qt: {productData.quantity}</Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-2xl font-bold text-bergstrom-primary">
                        R$ {productData.price.toFixed(2)}
                      </span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Resumo */}
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle>Resumo do Pedido</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between">
                  <span>Subtotal:</span>
                  <span>R$ {productData.price.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Frete:</span>
                  <span className="text-green-600 font-semibold">Grátis</span>
                </div>
                <hr />
                <div className="flex justify-between text-lg font-bold">
                  <span>Total:</span>
                  <span className="text-bergstrom-primary">R$ {productData.price.toFixed(2)}</span>
                </div>

                <div className="space-y-3 pt-4">
                  <Button 
                    onClick={handleCheckout}
                    className="w-full py-3 text-lg font-semibold bg-green-600 hover:bg-green-700 text-white"
                  >
                    <ExternalLink className="h-5 w-5 mr-2" />
                    Finalizar Compra
                  </Button>

                  <div className="text-center">
                    <div className="flex items-center justify-center space-x-2 text-sm text-gray-600">
                      <div className="w-4 h-4 bg-green-500 rounded"></div>
                      <span>Pagamento 100% Seguro</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Informações Adicionais */}
            <Card className="mt-6">
              <CardContent className="pt-6">
                <div className="space-y-3 text-sm">
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 bg-blue-500 rounded"></div>
                    <span>Frete Grátis para todo o Brasil</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 bg-orange-500 rounded"></div>
                    <span>7 dias para troca</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 bg-purple-500 rounded"></div>
                    <span>Qualidade Premium</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Cart;
