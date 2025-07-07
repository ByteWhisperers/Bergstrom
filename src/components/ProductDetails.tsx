import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { useProductDetails } from '@/hooks/useProductDetails';
const ProductDetails = () => {
  const {
    content,
    isLoading
  } = useProductDetails();
  if (isLoading) {
    return <div className="container mx-auto px-4 py-8">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-3/4 mb-4"></div>
          <div className="h-4 bg-gray-200 rounded mb-6"></div>
          <div className="h-64 bg-gray-200 rounded"></div>
        </div>
      </div>;
  }
  return <div className="container mx-auto px-4 py-8">
      <Tabs defaultValue="description" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="description">Descrição</TabsTrigger>
          <TabsTrigger value="specifications">Especificações</TabsTrigger>
          <TabsTrigger value="measurements">Tabela de Medidas</TabsTrigger>
        </TabsList>

        <TabsContent value="description" className="mt-6">
          <div className="space-y-6">
            {/* Conteúdo editável vindo do banco */}
            <div className="prose max-w-none text-gray-700 leading-relaxed" dangerouslySetInnerHTML={{
            __html: content?.content || '<h2>Carregando conteúdo...</h2>'
          }} />

            
          </div>
        </TabsContent>

        <TabsContent value="specifications" className="mt-6">
          <div className="space-y-6">
            <h2 className="text-2xl font-bold bergstrom-primary">Especificações Técnicas</h2>
            
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-lg font-semibold mb-3">Material Externo:</h3>
                <ul className="space-y-2 text-gray-700">
                  <li>• Couro bovino genuíno</li>
                  <li>• Tratamento impermeável</li>
                  <li>• Acabamento acetinado</li>
                  <li>• Resistente a riscos</li>
                </ul>
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-3">Material Interno:</h3>
                <ul className="space-y-2 text-gray-700">
                  <li>• Forro em poliéster</li>
                  <li>• Isolamento térmico</li>
                  <li>• Respirabilidade otimizada</li>
                  <li>• Antibacteriano</li>
                </ul>
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-3">Acessórios:</h3>
                <ul className="space-y-2 text-gray-700">
                  <li>• Zíper YKK importado</li>
                  <li>• Botões metálicos</li>
                  <li>• 4 bolsos externos</li>
                  <li>• 2 bolsos internos</li>
                </ul>
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-3">Kit Frio Incluso:</h3>
                <ul className="space-y-2 text-gray-700">
                  <li>• Gorro de lã</li>
                  <li>• Luvas térmicas</li>
                  <li>• Cachecol</li>
                  <li>• Embalagem premium</li>
                </ul>
              </div>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="measurements" className="mt-6">
          <div className="space-y-6">
            <h2 className="text-2xl font-bold bergstrom-primary">Tabela de Medidas</h2>
            
            <div className="overflow-x-auto">
              <table className="w-full border-collapse border border-gray-300">
                <thead>
                  <tr className="bg-gray-50">
                    <th className="border border-gray-300 px-4 py-2">Tamanho</th>
                    <th className="border border-gray-300 px-4 py-2">Busto (cm)</th>
                    <th className="border border-gray-300 px-4 py-2">Cintura (cm)</th>
                    <th className="border border-gray-300 px-4 py-2">Quadril (cm)</th>
                    <th className="border border-gray-300 px-4 py-2">Mangas (cm)</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="border border-gray-300 px-4 py-2 font-semibold">P</td>
                    <td className="border border-gray-300 px-4 py-2">92-96</td>
                    <td className="border border-gray-300 px-4 py-2">76-80</td>
                    <td className="border border-gray-300 px-4 py-2">88-92</td>
                    <td className="border border-gray-300 px-4 py-2">60</td>
                  </tr>
                  <tr className="bg-gray-50">
                    <td className="border border-gray-300 px-4 py-2 font-semibold">M</td>
                    <td className="border border-gray-300 px-4 py-2">96-100</td>
                    <td className="border border-gray-300 px-4 py-2">80-84</td>
                    <td className="border border-gray-300 px-4 py-2">92-96</td>
                    <td className="border border-gray-300 px-4 py-2">62</td>
                  </tr>
                  <tr>
                    <td className="border border-gray-300 px-4 py-2 font-semibold">G</td>
                    <td className="border border-gray-300 px-4 py-2">100-104</td>
                    <td className="border border-gray-300 px-4 py-2">84-88</td>
                    <td className="border border-gray-300 px-4 py-2">96-100</td>
                    <td className="border border-gray-300 px-4 py-2">64</td>
                  </tr>
                  <tr className="bg-gray-50">
                    <td className="border border-gray-300 px-4 py-2 font-semibold">GG</td>
                    <td className="border border-gray-300 px-4 py-2">104-108</td>
                    <td className="border border-gray-300 px-4 py-2">88-92</td>
                    <td className="border border-gray-300 px-4 py-2">100-104</td>
                    <td className="border border-gray-300 px-4 py-2">66</td>
                  </tr>
                  <tr>
                    <td className="border border-gray-300 px-4 py-2 font-semibold">G3</td>
                    <td className="border border-gray-300 px-4 py-2">108-112</td>
                    <td className="border border-gray-300 px-4 py-2">92-96</td>
                    <td className="border border-gray-300 px-4 py-2">104-108</td>
                    <td className="border border-gray-300 px-4 py-2">68</td>
                  </tr>
                  <tr className="bg-gray-50">
                    <td className="border border-gray-300 px-4 py-2 font-semibold">G4</td>
                    <td className="border border-gray-300 px-4 py-2">112-116</td>
                    <td className="border border-gray-300 px-4 py-2">96-100</td>
                    <td className="border border-gray-300 px-4 py-2">108-112</td>
                    <td className="border border-gray-300 px-4 py-2">70</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div className="bg-blue-50 p-4 rounded-lg">
              <h3 className="font-semibold text-blue-800 mb-2">Como medir:</h3>
              <ul className="text-sm text-blue-700 space-y-1">
                <li>• <strong>Busto:</strong> Meça na parte mais larga do peito</li>
                <li>• <strong>Cintura:</strong> Meça na parte mais estreita do tronco</li>
                <li>• <strong>Quadril:</strong> Meça na parte mais larga do quadril</li>
                <li>• <strong>Mangas:</strong> Do ombro até o punho</li>
              </ul>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>;
};
export default ProductDetails;