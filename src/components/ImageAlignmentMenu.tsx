
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { AlignLeft, AlignCenter, AlignRight } from 'lucide-react';

interface ImageAlignmentMenuProps {
  image: HTMLImageElement | null;
  position: { x: number; y: number };
  onClose: () => void;
}

const ImageAlignmentMenu: React.FC<ImageAlignmentMenuProps> = ({ 
  image, 
  position, 
  onClose 
}) => {
  const [currentAlignment, setCurrentAlignment] = useState<string>('');

  useEffect(() => {
    if (image) {
      console.log('🖼️ Imagem selecionada:', image);
      console.log('📋 Classes da imagem:', image.className);
      
      // Detectar alinhamento atual da imagem
      if (image.classList.contains('align-left')) {
        setCurrentAlignment('left');
        console.log('📍 Alinhamento detectado: ESQUERDA');
      } else if (image.classList.contains('align-center')) {
        setCurrentAlignment('center');
        console.log('📍 Alinhamento detectado: CENTRO');
      } else if (image.classList.contains('align-right')) {
        setCurrentAlignment('right');
        console.log('📍 Alinhamento detectado: DIREITA');
      } else {
        setCurrentAlignment('center'); // padrão
        console.log('📍 Alinhamento padrão aplicado: CENTRO');
      }
    }
  }, [image]);

  const applyAlignment = (alignment: string) => {
    if (!image) return;

    console.log('🎯 Aplicando alinhamento:', alignment);
    console.log('📋 Classes antes:', image.className);

    // Remover classes de alinhamento existentes
    image.classList.remove('align-left', 'align-center', 'align-right');
    
    // Aplicar nova classe de alinhamento
    switch (alignment) {
      case 'left':
        image.classList.add('align-left');
        console.log('⬅️ Classe aplicada: align-left');
        break;
      case 'center':
        image.classList.add('align-center');
        console.log('↔️ Classe aplicada: align-center');
        break;
      case 'right':
        image.classList.add('align-right');
        console.log('➡️ Classe aplicada: align-right');
        break;
    }

    console.log('📋 Classes depois:', image.className);
    console.log('🎨 Estilo computado:', window.getComputedStyle(image).marginLeft, window.getComputedStyle(image).marginRight);

    setCurrentAlignment(alignment);
    
    // Disparar evento para atualizar o conteúdo do editor
    const editorEvent = new CustomEvent('editorContentChanged');
    document.dispatchEvent(editorEvent);
    
    console.log('✅ Evento de mudança disparado');
    
    onClose();
  };

  if (!image) return null;

  return (
    <div 
      className="fixed z-50 bg-white border border-gray-300 rounded-md shadow-lg p-2 flex gap-1"
      style={{ 
        left: position.x, 
        top: position.y - 50,
        transform: 'translateX(-50%)'
      }}
    >
      <Button
        type="button"
        variant={currentAlignment === 'left' ? 'default' : 'outline'}
        size="sm"
        onClick={() => applyAlignment('left')}
        className="p-2"
        title="Alinhar à esquerda"
      >
        <AlignLeft className="h-4 w-4" />
      </Button>
      
      <Button
        type="button"
        variant={currentAlignment === 'center' ? 'default' : 'outline'}
        size="sm"
        onClick={() => applyAlignment('center')}
        className="p-2"
        title="Centralizar"
      >
        <AlignCenter className="h-4 w-4" />
      </Button>
      
      <Button
        type="button"
        variant={currentAlignment === 'right' ? 'default' : 'outline'}
        size="sm"
        onClick={() => applyAlignment('right')}
        className="p-2"
        title="Alinhar à direita"
      >
        <AlignRight className="h-4 w-4" />
      </Button>
    </div>
  );
};

export default ImageAlignmentMenu;
