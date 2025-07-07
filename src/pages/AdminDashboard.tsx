
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useAdminAuth } from '@/hooks/useAdminAuth';
import { 
  Palette, 
  Images, 
  MessageSquare, 
  FileText, 
  LogOut,
  Settings,
  Link
} from 'lucide-react';

const AdminDashboard = () => {
  const { logout } = useAdminAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/admin/login');
  };

  const menuItems = [
    {
      title: 'Editar Conteúdo',
      description: 'Gerenciar o conteúdo dos detalhes do produto',
      icon: FileText,
      path: '/admin/painel',
      color: 'bg-blue-500 hover:bg-blue-600'
    },
    {
      title: 'Gerenciar Cores',
      description: 'Personalizar as cores do tema do site',
      icon: Palette,
      path: '/admin/colors',
      color: 'bg-purple-500 hover:bg-purple-600'
    },
    {
      title: 'Gerenciar Imagens',
      description: 'Upload e gerenciamento de imagens do site',
      icon: Images,
      path: '/admin/images',
      color: 'bg-green-500 hover:bg-green-600'
    },
    {
      title: 'Moderar Avaliações',
      description: 'Aprovar, editar e excluir avaliações de clientes',
      icon: MessageSquare,
      path: '/admin/reviews',
      color: 'bg-orange-500 hover:bg-orange-600'
    },
    {
      title: 'Gerenciar Links',
      description: 'Configurar destinos dos botões e links do site',
      icon: Link,
      path: '/admin/links',
      color: 'bg-indigo-500 hover:bg-indigo-600'
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Painel Administrativo</h1>
            <p className="text-gray-600 mt-2">Gerencie todos os aspectos do seu site</p>
          </div>
          <Button onClick={handleLogout} variant="outline">
            <LogOut className="h-4 w-4 mr-2" />
            Sair
          </Button>
        </div>

        {/* Menu Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {menuItems.map((item) => {
            const IconComponent = item.icon;
            return (
              <Card key={item.path} className="cursor-pointer hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-center space-x-4">
                    <div className={`p-3 rounded-lg text-white ${item.color}`}>
                      <IconComponent className="h-6 w-6" />
                    </div>
                    <div>
                      <CardTitle className="text-xl">{item.title}</CardTitle>
                      <CardDescription className="mt-1">
                        {item.description}
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <Button 
                    onClick={() => navigate(item.path)}
                    className={`w-full ${item.color} text-white`}
                  >
                    <Settings className="h-4 w-4 mr-2" />
                    Acessar
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
