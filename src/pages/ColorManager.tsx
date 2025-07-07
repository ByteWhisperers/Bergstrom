
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useThemeColors } from '@/hooks/useThemeColors';
import { ArrowLeft, Save, Palette } from 'lucide-react';

const ColorManager = () => {
  const navigate = useNavigate();
  const { colors, isLoading, updateColor } = useThemeColors();
  const [editedColors, setEditedColors] = useState<Record<string, string>>({});
  const [isSaving, setIsSaving] = useState(false);

  const handleColorChange = (colorKey: string, value: string) => {
    setEditedColors(prev => ({
      ...prev,
      [colorKey]: value
    }));
  };

  const getCurrentColorValue = (colorKey: string, originalValue: string) => {
    return editedColors[colorKey] || originalValue;
  };

  const handleSaveAll = async () => {
    setIsSaving(true);
    try {
      const promises = Object.entries(editedColors).map(([colorKey, colorValue]) =>
        updateColor(colorKey, colorValue)
      );
      
      await Promise.all(promises);
      setEditedColors({});
    } catch (error) {
      console.error('Erro ao salvar cores:', error);
    } finally {
      setIsSaving(false);
    }
  };

  const hasChanges = Object.keys(editedColors).length > 0;

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-lg">Carregando cores...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-4">
            <Button
              onClick={() => navigate('/admin/dashboard')}
              variant="outline"
              size="sm"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Voltar
            </Button>
            <div>
              <h1 className="text-2xl font-bold flex items-center">
                <Palette className="h-6 w-6 mr-2" />
                Gerenciar Cores do Tema
              </h1>
              <p className="text-gray-600 mt-1">
                Personalize as cores do seu site
              </p>
            </div>
          </div>
          
          {hasChanges && (
            <Button 
              onClick={handleSaveAll}
              disabled={isSaving}
              className="bg-green-600 hover:bg-green-700"
            >
              {isSaving ? (
                'Salvando...'
              ) : (
                <>
                  <Save className="h-4 w-4 mr-2" />
                  Salvar Todas
                </>
              )}
            </Button>
          )}
        </div>

        {/* Colors Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {colors.map((color) => {
            const currentValue = getCurrentColorValue(color.color_key, color.color_value);
            
            return (
              <Card key={color.id}>
                <CardHeader>
                  <CardTitle className="text-lg">{color.description}</CardTitle>
                  <div className="text-sm text-gray-500">
                    Chave: {color.color_key}
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Color Preview */}
                  <div className="flex items-center space-x-3">
                    <div
                      className="w-12 h-12 rounded-lg border-2 border-gray-300 shadow-inner"
                      style={{ backgroundColor: currentValue }}
                    />
                    <div className="text-sm font-mono bg-gray-100 px-2 py-1 rounded">
                      {currentValue}
                    </div>
                  </div>

                  {/* Color Input */}
                  <div className="space-y-2">
                    <Label htmlFor={`color-${color.color_key}`}>
                      Cor
                    </Label>
                    <div className="flex space-x-2">
                      <Input
                        id={`color-${color.color_key}`}
                        type="color"
                        value={currentValue}
                        onChange={(e) => handleColorChange(color.color_key, e.target.value)}
                        className="w-16 h-10 p-1 border rounded"
                      />
                      <Input
                        type="text"
                        value={currentValue}
                        onChange={(e) => handleColorChange(color.color_key, e.target.value)}
                        placeholder="#FFFFFF"
                        className="flex-1"
                      />
                    </div>
                  </div>

                  {editedColors[color.color_key] && (
                    <div className="text-xs text-orange-600 font-medium">
                      • Alteração pendente
                    </div>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>

        {colors.length === 0 && (
          <Card>
            <CardContent className="text-center py-8">
              <p className="text-gray-500">Nenhuma cor encontrada.</p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default ColorManager;
