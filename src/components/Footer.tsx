import React from 'react';
import { Phone, Mail, MessageCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
const Footer = () => {
  const paymentMethods = ['cartão', 'pix'];
  return <footer className="bg-bergstrom-accent text-white">
      {/* Main Footer */}
      <div className="container mx-auto px-4 py-12">
        <div className="grid md:grid-cols-4 gap-8">
          {/* Company Info */}
          <div>
            <h3 className="text-2xl font-bold mb-4">BERGSTRÖM</h3>
            <p className="text-gray-300 mb-4">
              Moda masculina de qualidade premium com estilo e sofisticação.
            </p>
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <Phone className="h-4 w-4" />
                <span className="text-sm">(21) 96973-9732</span>
              </div>
              <div className="flex items-center space-x-2">
                <Mail className="h-4 w-4" />
                <span className="text-sm">contato@bergstrom.com.br</span>
              </div>
            </div>
          </div>

          {/* Customer Service */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Central de Atendimento</h4>
            <div className="space-y-3">
              <p className="text-sm text-gray-300">
                Segunda a Sexta: 8h às 18h<br />
                Sábado: 8h às 14h
              </p>
              <Button className="bg-green-600 hover:bg-green-700 text-white" size="sm">
                <MessageCircle className="h-4 w-4 mr-2" />
                Atendimento via Whatsapp
              </Button>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Links Úteis</h4>
            <ul className="space-y-2">
              <li><a href="#" className="text-gray-300 hover:text-white transition-colors">Pesquisar</a></li>
              <li><a href="#" className="text-gray-300 hover:text-white transition-colors">Política de Privacidade</a></li>
              <li><a href="#" className="text-gray-300 hover:text-white transition-colors">Termos de Uso</a></li>
              <li><a href="#" className="text-gray-300 hover:text-white transition-colors">Trocas e Devoluções</a></li>
              <li><a href="#" className="text-gray-300 hover:text-white transition-colors">Rastreamento</a></li>
            </ul>
          </div>

          {/* Social Media */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Redes Sociais</h4>
            <div className="flex space-x-4 mb-4">
              <a href="#" className="w-8 h-8 bg-blue-600 rounded flex items-center justify-center hover:bg-blue-700 transition-colors">
                <span className="text-xs font-bold">f</span>
              </a>
              <a href="#" className="w-8 h-8 bg-pink-600 rounded flex items-center justify-center hover:bg-pink-700 transition-colors">
                <span className="text-xs font-bold">ig</span>
              </a>
            </div>
            
            {/* Payment Methods */}
            <div>
              
              
            </div>
          </div>
        </div>
      </div>

      {/* Security Badges */}
      <div className="border-t border-gray-600">
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-wrap justify-center items-center space-x-6">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-green-500 rounded flex items-center justify-center">
                <span className="text-xs font-bold">✓</span>
              </div>
              <span className="text-sm">Google Site Seguro</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-blue-500 rounded flex items-center justify-center">
                <span className="text-xs font-bold">RA</span>
              </div>
              <span className="text-sm">Reclame AQUI</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-orange-500 rounded flex items-center justify-center">
                <span className="text-xs font-bold">SE</span>
              </div>
              <span className="text-sm">SEGURO E-commerce</span>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Footer */}
      <div className="border-t border-gray-600">
        <div className="container mx-auto px-4 py-4">
          <div className="flex flex-col md:flex-row justify-between items-center text-sm text-gray-300">
            <p>© 2023 BERGSTRÖM | Todos os direitos reservados</p>
            <div className="mt-2 md:mt-0">
              <p>CNPJ: 12.345.678/0001-90</p>
              <p>Rua da Moda, 123 - São Paulo, SP - CEP: 01234-567</p>
            </div>
          </div>
        </div>
      </div>
    </footer>;
};
export default Footer;