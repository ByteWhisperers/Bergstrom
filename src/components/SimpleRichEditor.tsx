
import React, { useRef, useEffect, useState } from 'react';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Bold, 
  Italic, 
  Underline, 
  List, 
  ListOrdered, 
  Image as ImageIcon,
  Type,
  Heading1,
  Heading2,
  Heading3,
  Upload,
  AlignLeft,
  AlignCenter,
  AlignRight,
  AlignJustify
} from 'lucide-react';
import { useFileImport } from '@/hooks/useFileImport';
import ImageAlignmentMenu from './ImageAlignmentMenu';

interface SimpleRichEditorProps {
  value: string;
  onChange: (value: string) => void;
  onImageUpload: (file: File) => Promise<string | null>;
}

const SimpleRichEditor: React.FC<SimpleRichEditorProps> = ({ 
  value, 
  onChange, 
  onImageUpload 
}) => {
  const editorRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const importFileInputRef = useRef<HTMLInputElement>(null);
  const { importFile, isProcessing } = useFileImport();

  // Estados para o menu de alinhamento de imagens
  const [selectedImage, setSelectedImage] = useState<HTMLImageElement | null>(null);
  const [menuPosition, setMenuPosition] = useState({ x: 0, y: 0 });
  const [showImageMenu, setShowImageMenu] = useState(false);

  useEffect(() => {
    if (editorRef.current && editorRef.current.innerHTML !== value) {
      editorRef.current.innerHTML = value || '';
      
      // Aplicar alinhamento centralizado a todas as imagens existentes como padrão
      const images = editorRef.current.querySelectorAll('img');
      images.forEach(img => {
        if (!img.classList.contains('align-left') && 
            !img.classList.contains('align-center') && 
            !img.classList.contains('align-right')) {
          img.classList.add('align-center');
        }
      });
    }
  }, [value]);

  // Listener para mudanças no editor disparadas pelo menu de imagem
  useEffect(() => {
    const handleEditorContentChanged = () => {
      if (editorRef.current) {
        onChange(editorRef.current.innerHTML);
      }
    };

    document.addEventListener('editorContentChanged', handleEditorContentChanged);
    
    return () => {
      document.removeEventListener('editorContentChanged', handleEditorContentChanged);
    };
  }, [onChange]);

  // Listener para cliques em imagens
  useEffect(() => {
    const handleImageClick = (e: Event) => {
      const target = e.target as HTMLElement;
      
      if (target.tagName === 'IMG' && editorRef.current?.contains(target)) {
        e.preventDefault();
        e.stopPropagation();
        
        const img = target as HTMLImageElement;
        const rect = img.getBoundingClientRect();
        
        setSelectedImage(img);
        setMenuPosition({
          x: rect.left + rect.width / 2,
          y: rect.top
        });
        setShowImageMenu(true);
      } else {
        // Fechar menu se clicar fora
        setShowImageMenu(false);
        setSelectedImage(null);
      }
    };

    document.addEventListener('click', handleImageClick);
    
    return () => {
      document.removeEventListener('click', handleImageClick);
    };
  }, []);

  const handleInput = () => {
    if (editorRef.current) {
      onChange(editorRef.current.innerHTML);
    }
  };

  const formatText = (command: string, value?: string) => {
    document.execCommand(command, false, value);
    editorRef.current?.focus();
    handleInput();
  };

  const formatBlock = (tag: string) => {
    editorRef.current?.focus();
    
    if (['h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'p'].includes(tag.toLowerCase())) {
      document.execCommand('formatBlock', false, tag);
    } else {
      document.execCommand(tag, false);
    }
    
    handleInput();
  };

  const handleAlignment = (alignment: string) => {
    editorRef.current?.focus();
    
    switch (alignment) {
      case 'left':
        document.execCommand('justifyLeft', false);
        break;
      case 'center':
        document.execCommand('justifyCenter', false);
        break;
      case 'right':
        document.execCommand('justifyRight', false);
        break;
      case 'justify':
        document.execCommand('justifyFull', false);
        break;
    }
    
    handleInput();
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && onImageUpload) {
      const imageUrl = await onImageUpload(file);
      if (imageUrl) {
        formatText('insertImage', imageUrl);
        
        // Aguardar um momento para a imagem ser inserida e então aplicar alinhamento centralizado
        setTimeout(() => {
          if (editorRef.current) {
            const newImages = editorRef.current.querySelectorAll('img:not(.align-left):not(.align-center):not(.align-right)');
            newImages.forEach(img => {
              img.classList.add('align-center');
            });
            handleInput();
          }
        }, 100);
      }
    }
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleFileImport = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const fileExtension = file.name.split('.').pop()?.toLowerCase();
    if (!['docx', 'pdf'].includes(fileExtension || '')) {
      alert('Por favor, selecione um arquivo .docx ou .pdf');
      return;
    }

    try {
      const htmlContent = await importFile(file);
      
      if (editorRef.current) {
        const currentContent = editorRef.current.innerHTML;
        const newContent = currentContent ? `${currentContent}<br/>${htmlContent}` : htmlContent;
        
        editorRef.current.innerHTML = newContent;
        
        // Aplicar alinhamento centralizado a todas as novas imagens
        const images = editorRef.current.querySelectorAll('img:not(.align-left):not(.align-center):not(.align-right)');
        images.forEach(img => {
          img.classList.add('align-center');
        });
        
        onChange(newContent);
      }
    } catch (error) {
      console.error('Erro ao importar arquivo:', error);
    }

    if (importFileInputRef.current) {
      importFileInputRef.current.value = '';
    }
  };

  const handleCloseImageMenu = () => {
    setShowImageMenu(false);
    setSelectedImage(null);
  };

  return (
    <div className="space-y-2">
      <Label>Editor de Conteúdo</Label>
      
      {/* Toolbar */}
      <div className="flex flex-wrap gap-1 p-2 border rounded-md bg-gray-50">
        {/* Heading Buttons */}
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => formatBlock('h1')}
          className="px-2 py-1"
          title="Título 1"
        >
          <Heading1 className="h-4 w-4" />
        </Button>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => formatBlock('h2')}
          className="px-2 py-1"
          title="Título 2"
        >
          <Heading2 className="h-4 w-4" />
        </Button>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => formatBlock('h3')}
          className="px-2 py-1"
          title="Título 3"
        >
          <Heading3 className="h-4 w-4" />
        </Button>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => formatBlock('p')}
          className="px-2 py-1"
          title="Parágrafo"
        >
          <Type className="h-4 w-4" />
        </Button>
        
        <div className="w-px h-6 bg-gray-300 mx-1"></div>
        
        {/* Text Formatting */}
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => formatText('bold')}
          className="px-2 py-1"
          title="Negrito"
        >
          <Bold className="h-4 w-4" />
        </Button>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => formatText('italic')}
          className="px-2 py-1"
          title="Itálico"
        >
          <Italic className="h-4 w-4" />
        </Button>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => formatText('underline')}
          className="px-2 py-1"
          title="Sublinhado"
        >
          <Underline className="h-4 w-4" />
        </Button>
        
        <div className="w-px h-6 bg-gray-300 mx-1"></div>
        
        {/* Alignment Buttons */}
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => handleAlignment('left')}
          className="px-2 py-1"
          title="Alinhar à esquerda"
        >
          <AlignLeft className="h-4 w-4" />
        </Button>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => handleAlignment('center')}
          className="px-2 py-1"
          title="Centralizar"
        >
          <AlignCenter className="h-4 w-4" />
        </Button>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => handleAlignment('right')}
          className="px-2 py-1"
          title="Alinhar à direita"
        >
          <AlignRight className="h-4 w-4" />
        </Button>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => handleAlignment('justify')}
          className="px-2 py-1"
          title="Justificar"
        >
          <AlignJustify className="h-4 w-4" />
        </Button>
        
        <div className="w-px h-6 bg-gray-300 mx-1"></div>
        
        {/* Lists */}
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => formatText('insertUnorderedList')}
          className="px-2 py-1"
          title="Lista com marcadores"
        >
          <List className="h-4 w-4" />
        </Button>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => formatText('insertOrderedList')}
          className="px-2 py-1"
          title="Lista numerada"
        >
          <ListOrdered className="h-4 w-4" />
        </Button>
        
        <div className="w-px h-6 bg-gray-300 mx-1"></div>
        
        {/* Image Upload */}
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => fileInputRef.current?.click()}
          className="px-2 py-1"
          title="Inserir imagem"
        >
          <ImageIcon className="h-4 w-4" />
        </Button>
        
        {/* File Import */}
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => importFileInputRef.current?.click()}
          className="px-2 py-1"
          title="Importar de Arquivo (.docx, .pdf)"
          disabled={isProcessing}
        >
          <Upload className="h-4 w-4" />
          {isProcessing && <span className="ml-1 text-xs">...</span>}
        </Button>
        
        <Input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleImageUpload}
          className="hidden"
        />
        
        <Input
          ref={importFileInputRef}
          type="file"
          accept=".docx,.pdf"
          onChange={handleFileImport}
          className="hidden"
        />
      </div>

      {/* Editor */}
      <div
        ref={editorRef}
        contentEditable
        onInput={handleInput}
        className="min-h-[300px] p-4 border rounded-md focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 prose max-w-none"
        style={{ wordBreak: 'break-word' }}
      />

      {/* Menu de alinhamento de imagens */}
      {showImageMenu && (
        <ImageAlignmentMenu
          image={selectedImage}
          position={menuPosition}
          onClose={handleCloseImageMenu}
        />
      )}
    </div>
  );
};

export default SimpleRichEditor;
