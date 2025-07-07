
import { useState } from 'react';
import mammoth from 'mammoth';
import * as pdfjsLib from 'pdfjs-dist';
import { useToast } from '@/hooks/use-toast';

// Configurar o worker do PDF.js
pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;

export const useFileImport = () => {
  const [isProcessing, setIsProcessing] = useState(false);
  const { toast } = useToast();

  const processDocxFile = async (file: File): Promise<string> => {
    try {
      const arrayBuffer = await file.arrayBuffer();
      const result = await mammoth.convertToHtml({ arrayBuffer });
      
      if (result.messages && result.messages.length > 0) {
        console.warn('Mammoth conversion warnings:', result.messages);
      }
      
      return result.value;
    } catch (error) {
      console.error('Erro ao processar arquivo .docx:', error);
      throw new Error('Falha ao processar o arquivo .docx');
    }
  };

  const processPdfFile = async (file: File): Promise<string> => {
    try {
      const arrayBuffer = await file.arrayBuffer();
      const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
      
      let fullText = '';
      
      for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
        const page = await pdf.getPage(pageNum);
        const textContent = await page.getTextContent();
        
        let pageText = '';
        textContent.items.forEach((item: any) => {
          if (item.str) {
            pageText += item.str + ' ';
          }
        });
        
        if (pageText.trim()) {
          fullText += `<p>${pageText.trim()}</p>\n`;
        }
      }
      
      return fullText || '<p>Não foi possível extrair texto do PDF.</p>';
    } catch (error) {
      console.error('Erro ao processar arquivo PDF:', error);
      throw new Error('Falha ao processar o arquivo PDF');
    }
  };

  const importFile = async (file: File): Promise<string> => {
    setIsProcessing(true);
    
    try {
      const fileExtension = file.name.split('.').pop()?.toLowerCase();
      let htmlContent = '';
      
      if (fileExtension === 'docx') {
        htmlContent = await processDocxFile(file);
        toast({
          title: "Sucesso",
          description: "Arquivo .docx importado com sucesso!",
        });
      } else if (fileExtension === 'pdf') {
        htmlContent = await processPdfFile(file);
        toast({
          title: "Sucesso", 
          description: "Arquivo PDF importado com sucesso!",
        });
      } else {
        throw new Error('Formato de arquivo não suportado. Use .docx ou .pdf');
      }
      
      return htmlContent;
    } catch (error: any) {
      toast({
        title: "Erro",
        description: error.message || "Falha ao importar o arquivo.",
        variant: "destructive",
      });
      throw error;
    } finally {
      setIsProcessing(false);
    }
  };

  return {
    importFile,
    isProcessing
  };
};
