import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContextSimple';
import { Loader2 } from 'lucide-react';

interface PrivateRouteProps {
  children: React.ReactNode;
  allowedRoles?: ('admin')[];
}

export const PrivateRoute = ({ children, allowedRoles = ['admin'] }: PrivateRouteProps) => {
  const { user, userData, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading) {
      if (!user) {
        navigate('/admin/login');
        return;
      }

      if (userData && !allowedRoles.includes(userData.role)) {
        // Usuário não tem permissão para esta rota
        navigate('/admin/dashboard');
        return;
      }
    }
  }, [user, userData, loading, navigate, allowedRoles]);

  // Mostrar loading enquanto verifica autenticação ou carrega dados do usuário
  if (loading || (user && !userData)) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex flex-col items-center space-y-4">
          <Loader2 className="h-8 w-8 animate-spin" />
          <p className="text-muted-foreground">
            {loading ? 'Verificando autenticação...' : 'Carregando dados do usuário...'}
          </p>
        </div>
      </div>
    );
  }

  // Se não tem usuário, não renderiza nada (useEffect vai redirecionar)
  if (!user) {
    return null;
  }

  // Se userData não existir (usuário não autorizado), não renderizar
  if (!userData) {
    return null;
  }

  // Verificar se o usuário tem permissão para esta rota
  if (!allowedRoles.includes(userData.role)) {
    return null;
  }
  
  return <>{children}</>;
};