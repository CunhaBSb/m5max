import { ReactNode, useState } from "react";
import { Button } from "@/components/ui/button";
import { Home, Package, FileText, Calendar, LogOut, Menu, X } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContextSimple";
import { 
  AceternitySidebar, 
  AceternitySidebarBody, 
  AceternitySidebarLink 
} from "@/components/ui/aceternity-sidebar";
import { AnimatePresence, motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface AdminLayoutProps {
  children: ReactNode;
}

export const AdminLayout = ({ children }: AdminLayoutProps) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { userData, signOut } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleSignOut = async () => {
    await signOut();
    navigate("/admin/login");
  };

  const menuItems = [
    { icon: Home, label: "Dashboard", path: "/admin/dashboard" },
    { icon: Package, label: "Estoque", path: "/admin/estoque" },
    { icon: FileText, label: "Orçamentos", path: "/admin/orcamentos" },
    { icon: Calendar, label: "Eventos", path: "/admin/eventos" },
  ];

  // Função para lidar com o gesto de swipe
  const handleSwipeClose = (event: React.TouchEvent) => {
    const touchStartX = event.touches[0].clientX;
    
    const handleTouchMove = (moveEvent: TouchEvent) => {
      const currentX = moveEvent.touches[0].clientX;
      const diff = currentX - touchStartX;
      
      if (diff < -100) {
        setMobileMenuOpen(false);
        document.removeEventListener('touchmove', handleTouchMove);
      }
    };
    
    document.addEventListener('touchmove', handleTouchMove, { once: true });
  };

  return (
    <div className="min-h-screen h-screen flex flex-col bg-gradient-to-br from-background via-background to-primary/5">
      {/* Header - Visível apenas em desktop */}
      <header className="border-b border-primary/20 bg-card/95 backdrop-blur-sm shadow-sm hidden md:block">
        <div className="flex h-16 items-center px-6 justify-between">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <div className="relative">
                <div className="absolute inset-0 bg-primary/20 rounded-full blur-lg"></div>
                <img src="/Logo.svg" alt="M5 MAX Logo" className="relative h-8 w-8 drop-shadow-lg" />
              </div>
              <div className="text-xl font-bold text-primary">M5 MAX</div>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <span className="text-sm text-muted-foreground">
              Bem-vindo, {userData?.nome || 'Usuário'}
            </span>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleSignOut}
              className="text-red-600 hover:text-red-700 hover:bg-red-50"
            >
              <LogOut className="h-4 w-4 mr-2" />
              Sair
            </Button>
          </div>
        </div>
      </header>

      {/* Header Mobile */}
      <header className="h-12 px-4 flex flex-row md:hidden items-center justify-between bg-card/95 backdrop-blur-sm w-full border-b border-primary/20 shadow-sm sticky top-0 z-10">
        <div className="flex items-center space-x-2">
          <img src="/Logo.svg" alt="M5 MAX Logo" className="h-6 w-6" />
          <div className="text-sm font-bold text-primary">M5 MAX</div>
        </div>
        <div className="flex items-center space-x-3">
          <span className="text-xs text-muted-foreground hidden sm:block">
            {userData?.nome || 'Usuário'}
          </span>
          <button 
            className="p-2 rounded-md hover:bg-muted/80 transition-colors duration-200 active:scale-95"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            <Menu className="text-foreground h-4 w-4" />
          </button>
        </div>
      </header>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ x: '-100%', opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: '-100%', opacity: 0 }}
            transition={{
              duration: 0.25,
              ease: 'easeInOut',
            }}
            className="fixed h-full w-full inset-0 bg-gradient-to-br from-background via-background to-primary/5 p-1 z-[100] flex flex-col md:hidden"
            onTouchStart={handleSwipeClose}
          >
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center space-x-1">
                <img src="/Logo.svg" alt="M5 MAX Logo" className="h-4 w-4" />
                <div className="text-[9px] font-bold text-primary">M5 MAX</div>
              </div>
              <button
                className="p-0.5 rounded-full hover:bg-muted/80 transition-colors duration-200 active:scale-95"
                onClick={() => setMobileMenuOpen(false)}
              >
                <X className="h-3 w-3 text-foreground" />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto">
              <div className="flex flex-col gap-0.5">
                {menuItems.map((item) => (
                  <a
                    key={item.path}
                    href="#"
                    className={cn(
                      'flex items-center gap-1.5 py-1.5 px-1.5 rounded-md hover:bg-muted/50 transition-all duration-200 relative',
                      location.pathname === item.path ? 'bg-primary/10 border-l-1 border-primary text-primary font-medium' : ''
                    )}
                    onClick={(e) => {
                      e.preventDefault();
                      navigate(item.path);
                      setMobileMenuOpen(false);
                    }}
                  >
                    <div className="flex-shrink-0">
                      <item.icon className="h-3 w-3" />
                    </div>
                    <div className="text-[9px] font-medium">
                      {item.label}
                    </div>
                  </a>
                ))}
                
                {/* Informações do usuário e logout no menu mobile */}
                <div className="mt-auto pt-1.5 border-t border-primary/20">
                  <div className="text-[8px] text-muted-foreground mb-0.5 px-1.5">
                    Bem-vindo, {userData?.nome || 'Usuário'}
                  </div>
                  <a
                    href="#"
                    className="flex items-center gap-1.5 py-1.5 px-1.5 rounded-md hover:bg-red-50/10 transition-all duration-200 text-red-500"
                    onClick={(e) => {
                      e.preventDefault();
                      handleSignOut();
                    }}
                  >
                    <div className="flex-shrink-0">
                      <LogOut className="h-3 w-3 text-red-500" />
                    </div>
                    <div className="text-[9px] font-medium">
                      Sair
                    </div>
                  </a>
                </div>
              </div>
            </div>
            <div className="py-0.5 px-1.5 mt-1.5 bg-muted/30 rounded-md text-[7px] text-muted-foreground text-center">
              Deslize para a esquerda para fechar
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="flex h-[calc(100vh-3rem)] md:h-[calc(100vh-4rem)]">
        {/* Sidebar - Apenas para desktop */}
        <div className="hidden md:block">
          <AceternitySidebar>
            <AceternitySidebarBody>
              <div className="flex flex-col gap-2">
                {menuItems.map((item) => (
                  <AceternitySidebarLink
                    key={item.path}
                    link={{
                      label: item.label,
                      href: '#',
                      icon: <item.icon className="h-5 w-5" />
                    }}
                    onClick={(e) => {
                      e.preventDefault()
                      navigate(item.path)
                    }}
                    className={location.pathname === item.path ? "text-primary font-medium" : ""}
                  />
                ))}
                
                {/* Informações do usuário e logout no menu desktop */}
                <div className="mt-auto pt-4 border-t border-primary/20">
                  <AceternitySidebarLink
                    link={{
                      label: "Sair",
                      href: '#',
                      icon: <LogOut className="h-5 w-5 text-red-500" />
                    }}
                    onClick={(e) => {
                      e.preventDefault()
                      handleSignOut()
                    }}
                    className="text-red-500 hover:bg-red-50/10"
                  />
                </div>
              </div>
            </AceternitySidebarBody>
          </AceternitySidebar>
        </div>

        {/* Main Content */}
        <main className="flex-1 p-2 sm:p-3 md:p-6 overflow-y-auto">
          <div className="max-w-7xl mx-auto">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};