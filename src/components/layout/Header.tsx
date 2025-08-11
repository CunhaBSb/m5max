import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Menu, Rocket, Building, Sparkles, ClipboardList, Phone } from "lucide-react";

interface HeaderProps {
  onRequestQuote: () => void;
}

export const Header = ({ onRequestQuote }: HeaderProps) => {
  return (
    <header className="fixed top-0 w-full bg-black/30 backdrop-blur-xl z-50 border-b border-white/10 shadow-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-14 lg:h-16">
        {/* Mobile Layout */}
        <div className="flex items-center justify-between h-full md:hidden">
          {/* Menu Mobile */}
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="text-white hover:bg-white/10">
                <Menu className="h-6 w-6" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="bg-background border-r border-border p-0">
              <div className="flex flex-col h-full">
                {/* Header do menu */}
                <div className="bg-primary/5 p-6 border-b border-border">
                  <div className="text-center">
                    <img src="/Logo.svg" alt="M5 MAX Logo" className="h-16 w-16 mx-auto mb-3" />
                    <h3 className="font-bold text-lg text-foreground">M5 MAX</h3>
                    <p className="text-sm text-muted-foreground">Produções</p>
                  </div>
                </div>

                {/* Links do menu */}
                <div className="flex-1 p-6">
                  <nav className="space-y-1">
                    <a href="#sobre" className="flex items-center px-4 py-3 text-foreground hover:bg-primary/10 hover:text-primary rounded-lg transition-colors group">
                      <Building className="h-5 w-5 text-primary mr-3 group-hover:scale-110 transition-transform" />
                      <span className="font-medium">Sobre Nós</span>
                    </a>
                    <a href="#kits" className="flex items-center px-4 py-3 text-foreground hover:bg-primary/10 hover:text-primary rounded-lg transition-colors group">
                      <Sparkles className="h-5 w-5 text-primary mr-3 group-hover:scale-110 transition-transform" />
                      <span className="font-medium">Kits Pirotécnicos</span>
                    </a>
                    <a href="#servicos" className="flex items-center px-4 py-3 text-foreground hover:bg-primary/10 hover:text-primary rounded-lg transition-colors group">
                      <ClipboardList className="h-5 w-5 text-primary mr-3 group-hover:scale-110 transition-transform" />
                      <span className="font-medium">Nossos Serviços</span>
                    </a>
                    <a href="#contato" className="flex items-center px-4 py-3 text-foreground hover:bg-primary/10 hover:text-primary rounded-lg transition-colors group">
                      <Phone className="h-5 w-5 text-primary mr-3 group-hover:scale-110 transition-transform" />
                      <span className="font-medium">Contato</span>
                    </a>
                  </nav>
                </div>

                {/* Footer do menu */}
                <div className="p-6 border-t border-border bg-muted/30">
                  <Button 
                    onClick={() => {
                      onRequestQuote();
                      document.querySelector('[data-state="open"]')?.dispatchEvent(
                        new KeyboardEvent('keydown', { key: 'Escape' })
                      );
                    }}
                    className="bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg w-full transition-all duration-300 py-3 font-semibold"
                  >
                    <Rocket className="mr-2 h-4 w-4" />
                    Solicitar Orçamento
                  </Button>
                  <p className="text-xs text-muted-foreground text-center mt-3">
                    Shows pirotécnicos profissionais
                  </p>
                </div>
              </div>
            </SheetContent>
          </Sheet>
          
          {/* Mobile: Logo centralizada */}
          <div className="flex-1 flex justify-center">
            <img src="/Logo.svg" alt="M5 MAX Logo" className="h-8 w-8 hover:scale-105 transition-transform duration-300" />
          </div>

          {/* Mobile: Espaço vazio para balanceamento */}
          <div className="w-10"></div>
        </div>

        {/* Desktop Layout - Grid 3 colunas com centralização real */}
        <div className="hidden md:grid grid-cols-3 items-center h-full">
          {/* Coluna 1: Logo (largura mínima fixa) */}
          <div className="flex items-center justify-start min-w-[120px]">
            <img src="/Logo.svg" alt="M5 MAX Logo" className="h-9 lg:h-10 w-auto hover:scale-105 transition-transform duration-300" />
          </div>
          
          {/* Coluna 2: Menu centralizado */}
          <div className="flex justify-center">
            <nav className="flex items-center space-x-6 lg:space-x-8">
              <a href="#sobre" className="text-white/90 text-sm lg:text-base font-medium hover:text-primary hover:text-shadow-glow transition-all duration-300">Sobre</a>
              <a href="#kits" className="text-white/90 text-sm lg:text-base font-medium hover:text-primary hover:text-shadow-glow transition-all duration-300">Kits</a>
              <a href="#servicos" className="text-white/90 text-sm lg:text-base font-medium hover:text-primary hover:text-shadow-glow transition-all duration-300">Serviços</a>
              <a href="#contato" className="text-white/90 text-sm lg:text-base font-medium hover:text-primary hover:text-shadow-glow transition-all duration-300">Contato</a>
            </nav>
          </div>

          {/* Coluna 3: Botão (largura mínima fixa) */}
          <div className="flex justify-end min-w-[120px]">
            <Button 
              onClick={onRequestQuote}
              className="bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg hover:shadow-xl transition-all duration-300 font-semibold px-4 lg:px-5 py-2 text-sm lg:text-base rounded-lg hover:scale-105"
            >
              <Rocket className="mr-2 h-3 w-3 lg:h-4 lg:w-4" />
              Orçamento
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
};