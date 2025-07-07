
import React, { useState } from 'react';
import { Search, ShoppingCart, Menu, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

const Header = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const categories = ['Início', 'Catálogo', 'Super Promoções', 'Acessórios', 'Blazer', 'Botas de Inverno', 'Camiseta', 'Casaco', 'Jaquetas', 'Sueters e Malhas', 'Ternos', 'Streetwear'];

  return (
    <header className="bg-white shadow-lg sticky top-0 z-50">
      {/* Top Header */}
      <div className="bg-bergstrom-accent text-white py-2">
        <div className="container mx-auto px-4 text-center text-sm">Qualidade e tradição em cada peça</div>
      </div>

      {/* Main Header */}
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center">
            <h1 className="text-3xl font-bold bergstrom-primary">BERGSTRÖM</h1>
          </div>

          {/* Search Bar - Desktop */}
          <div className="hidden md:flex flex-1 max-w-xl mx-8">
            <div className="relative w-full flex items-center">
              <Input 
                type="text" 
                placeholder="O que você está buscando?" 
                className="w-full pl-4 pr-12 border-2 border-gray-200 rounded-lg focus:border-bergstrom-primary py-[12px] px-[18px]" 
              />
              <Button className="absolute right-2 bg-bergstrom-primary hover:bg-bergstrom-primary/90 p-2 flex items-center justify-center" size="sm">
                <Search className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Cart and Mobile Menu */}
          <div className="flex items-center space-x-4">
            <Button variant="ghost" className="relative">
              <ShoppingCart className="h-6 w-6" />
              <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                0
              </span>
            </Button>

            {/* Mobile Menu Button */}
            <Button variant="ghost" className="md:hidden" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
              {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </Button>
          </div>
        </div>

        {/* Search Bar - Mobile */}
        <div className="md:hidden mt-4">
          <div className="relative w-full flex items-center">
            <Input 
              type="text" 
              placeholder="O que você está buscando?" 
              className="w-full pl-4 pr-12 py-3 border-2 border-gray-200 rounded-lg focus:border-bergstrom-primary" 
            />
            <Button className="absolute right-2 bg-bergstrom-primary hover:bg-bergstrom-primary/90 p-2 flex items-center justify-center" size="sm">
              <Search className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Navigation Menu */}
      <nav className={`${isMobileMenuOpen ? 'block' : 'hidden'} md:block bg-gray-50 border-t`}>
        <div className="container mx-auto px-4">
          <ul className="flex flex-col md:flex-row md:justify-center md:space-x-8 py-4">
            {categories.map((category, index) => (
              <li key={index} className="py-2 md:py-0">
                <a href="#" className="text-gray-700 hover:text-bergstrom-primary transition-colors duration-200 font-medium">
                  {category}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </nav>
    </header>
  );
};

export default Header;
