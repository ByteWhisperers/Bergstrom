
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, Link, Save, ExternalLink } from 'lucide-react';
import { useSiteLinks } from '@/hooks/useSiteLinks';
import { useAdminAuth } from '@/hooks/useAdminAuth';

const LinkManager = () => {
  const navigate = useNavigate();
  const { logout } = useAdminAuth();
  const { links, isLoading, updateLink } = useSiteLinks();
  const [editedLinks, setEditedLinks] = useState<Record<string, string>>({});
  const [savingLinks, setSavingLinks] = useState<Record<string, boolean>>({});

  const handleLogout = () => {
    logout();
    navigate('/admin/login');
  };

  const handleLinkChange = (linkKey: string, value: string) => {
    setEditedLinks(prev => ({
      ...prev,
      [linkKey]: value
    }));
  };

  const handleSaveLink = async (linkKey: string) => {
    const newUrl = editedLinks[linkKey];
    if (!newUrl) return;

    setSavingLinks(prev => ({ ...prev, [linkKey]: true }));
    
    const success = await updateLink(linkKey, newUrl);
    
    if (success) {
      setEditedLinks(prev => {
        const { [linkKey]: _, ...rest } = prev;
        return rest;
      });
    }
    
    setSavingLinks(prev => ({ ...prev, [linkKey]: false }));
  };

  const testLink = (url: string) => {
    if (url) {
      window.open(url, '_blank');
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-bergstrom-primary mx-auto mb-4"></div>
          <p className="text-gray-600">Carregando links...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div className="flex items-center space-x-4">
            <Button variant="outline" onClick={() => navigate('/admin/dashboard')}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Voltar
            </Button>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Gerenciar Links</h1>
              <p className="text-gray-600 mt-1">Configure os destinos dos botões e links do site</p>
            </div>
          </div>
          <Button onClick={handleLogout} variant="outline">
            Sair
          </Button>
        </div>

        {/* Links List */}
        <div className="space-y-6">
          {links.map((link) => {
            const currentValue = editedLinks[link.link_key] !== undefined 
              ? editedLinks[link.link_key] 
              : link.link_url;
            const hasChanges = editedLinks[link.link_key] !== undefined;
            const isSaving = savingLinks[link.link_key];

            return (
              <Card key={link.id}>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Link className="h-5 w-5 mr-2" />
                    {link.link_key.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                  </CardTitle>
                  <CardDescription>{link.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor={`link-${link.link_key}`}>URL de Destino</Label>
                      <div className="flex space-x-2 mt-1">
                        <Input
                          id={`link-${link.link_key}`}
                          value={currentValue}
                          onChange={(e) => handleLinkChange(link.link_key, e.target.value)}
                          placeholder="https://exemplo.com"
                          className="flex-1"
                        />
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => testLink(currentValue)}
                          disabled={!currentValue}
                        >
                          <ExternalLink className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>

                    {hasChanges && (
                      <div className="flex justify-end">
                        <Button
                          onClick={() => handleSaveLink(link.link_key)}
                          disabled={isSaving || !currentValue}
                          className="bg-green-600 hover:bg-green-700"
                        >
                          {isSaving ? (
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                          ) : (
                            <Save className="h-4 w-4 mr-2" />
                          )}
                          {isSaving ? 'Salvando...' : 'Salvar Alterações'}
                        </Button>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {links.length === 0 && (
          <Card>
            <CardContent className="text-center py-12">
              <Link className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Nenhum link encontrado
              </h3>
              <p className="text-gray-600">
                Os links do site serão exibidos aqui quando estiverem disponíveis.
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default LinkManager;
