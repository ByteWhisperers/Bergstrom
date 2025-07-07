
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useAdminAuth } from '@/hooks/useAdminAuth';
import { useProductDetails } from '@/hooks/useProductDetails';
import SimpleRichEditor from '@/components/SimpleRichEditor';
import SimpleRichEditorStyles from '@/components/SimpleRichEditorStyles';
import { LogOut, Save, Eye } from 'lucide-react';

const AdminPanel = () => {
  const { isAuthenticated, isLoading: authLoading, logout } = useAdminAuth();
  const { content, isLoading: contentLoading, updateContent, uploadImage } = useProductDetails();
  const navigate = useNavigate();

  const [editorContent, setEditorContent] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [isPreviewMode, setIsPreviewMode] = useState(false);

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      navigate('/admin/login');
    }
  }, [isAuthenticated, authLoading, navigate]);

  useEffect(() => {
    if (content) {
      setEditorContent(content.content || '');
    }
  }, [content]);

  const handleLogout = () => {
    logout();
    navigate('/admin/login');
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await updateContent(editorContent);
    } catch (error) {
      console.error('Erro ao salvar:', error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleImageUpload = async (file: File): Promise<string | null> => {
    return await uploadImage(file);
  };

  if (authLoading || contentLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-lg">Carregando...</div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  return (
    <>
      <SimpleRichEditorStyles />
      <div className="min-h-screen bg-gray-50 p-4">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold">Editor de Conteúdo do Produto</h1>
            <div className="flex gap-2">
              <Button 
                onClick={() => setIsPreviewMode(!isPreviewMode)} 
                variant="outline"
              >
                <Eye className="h-4 w-4 mr-2" />
                {isPreviewMode ? 'Editar' : 'Visualizar'}
              </Button>
              <Button onClick={handleLogout} variant="outline">
                <LogOut className="h-4 w-4 mr-2" />
                Sair
              </Button>
            </div>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>
                {isPreviewMode ? 'Visualização do Conteúdo' : 'Editar Seção de Detalhes do Produto'}
              </CardTitle>
            </CardHeader>
            <CardContent>
              {isPreviewMode ? (
                <div 
                  className="prose max-w-none p-4 border rounded-md bg-white min-h-[300px]"
                  dangerouslySetInnerHTML={{ __html: editorContent }}
                />
              ) : (
                <div className="space-y-6">
                  <SimpleRichEditor
                    value={editorContent}
                    onChange={setEditorContent}
                    onImageUpload={handleImageUpload}
                  />
                  
                  <div className="pt-4">
                    <Button 
                      onClick={handleSave} 
                      disabled={isSaving} 
                      className="w-full"
                    >
                      {isSaving ? (
                        'Salvando...'
                      ) : (
                        <>
                          <Save className="h-4 w-4 mr-2" />
                          Salvar Conteúdo
                        </>
                      )}
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
};

export default AdminPanel;
