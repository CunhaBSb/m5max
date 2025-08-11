import { cn } from "@/lib/utils";

interface SectionSeparatorProps {
  className?: string;
  variant?: "gradient" | "wave" | "dots" | "line" | "diamond" | "nightsky" | "professional";
}

export const SectionSeparator = ({ 
  className, 
  variant = "gradient" 
}: SectionSeparatorProps) => {
  if (variant === "gradient") {
    return (
      <div className={cn("relative h-16 w-full overflow-hidden flex items-center justify-center", className)}>
        <div className="container mx-auto px-4">
          <div className="relative flex items-center justify-center">
            <div className="w-24 sm:w-32 md:w-48 h-px bg-gradient-to-r from-transparent via-primary to-transparent"></div>
            <div className="absolute w-2 h-2 bg-primary rounded-full"></div>
          </div>
        </div>
      </div>
    );
  }

  if (variant === "wave") {
    return (
      <div className={cn("relative h-12 w-full overflow-hidden flex items-center justify-center", className)}>
        <div className="container mx-auto px-4">
          <svg
            className="w-full max-w-xs sm:max-w-sm md:max-w-md h-8"
            viewBox="0 0 300 30"
            preserveAspectRatio="none"
          >
            <path
              d="M0,15 Q75,5 150,15 T300,15"
              stroke="currentColor"
              strokeWidth="1"
              fill="none"
              className="text-primary/60"
            />
          </svg>
        </div>
      </div>
    );
  }

  if (variant === "dots") {
    return (
      <div className={cn("relative h-12 w-full flex items-center justify-center", className)}>
        <div className="flex space-x-2">
          <div className="w-1.5 h-1.5 bg-primary/40 rounded-full animate-pulse"></div>
          <div className="w-2 h-2 bg-primary/60 rounded-full animate-pulse delay-75"></div>
          <div className="w-2.5 h-2.5 bg-primary rounded-full animate-pulse delay-150"></div>
          <div className="w-2 h-2 bg-primary/60 rounded-full animate-pulse delay-75"></div>
          <div className="w-1.5 h-1.5 bg-primary/40 rounded-full animate-pulse"></div>
        </div>
      </div>
    );
  }

  if (variant === "diamond") {
    return (
      <div className={cn("relative h-12 w-full flex items-center justify-center", className)}>
        <div className="relative">
          <div className="w-24 sm:w-32 md:w-40 h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-2 h-2 bg-primary rotate-45"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-0.5 h-0.5 bg-background rotate-45"></div>
        </div>
      </div>
    );
  }

  if (variant === "nightsky") {
    return (
      <div className={cn("relative h-20 w-full overflow-hidden", className)}>
        {/* Gradiente de transição do escuro para claro */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-black/10 to-transparent"></div>
        
        {/* Efeito de "fogos" no separador */}
        <div className="absolute top-0 left-0 w-full h-full">
          <div className="absolute top-4 left-1/4 w-1 h-1 bg-orange-400 rounded-full animate-pulse"></div>
          <div className="absolute top-6 right-1/3 w-0.5 h-0.5 bg-yellow-300 rounded-full animate-pulse delay-300"></div>
          <div className="absolute top-8 left-1/2 w-0.5 h-0.5 bg-orange-300 rounded-full animate-pulse delay-700"></div>
          <div className="absolute top-5 right-1/4 w-0.5 h-0.5 bg-red-400 rounded-full animate-pulse delay-500"></div>
        </div>
        
        {/* Linha central decorativa */}
        <div className="absolute bottom-0 left-0 w-full flex items-center justify-center">
          <div className="w-32 sm:w-48 md:w-64 h-px bg-gradient-to-r from-transparent via-orange-400/60 to-transparent"></div>
          <div className="absolute w-1.5 h-1.5 bg-orange-400 rounded-full animate-pulse"></div>
        </div>
      </div>
    );
  }

  if (variant === "professional") {
    return (
      <div className={cn("relative h-16 sm:h-20 lg:h-32 w-full overflow-hidden", className)}>
        {/* Gradiente principal de transição */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-slate-100/50 to-background"></div>
        
        {/* Camadas de profundidade */}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-primary/5 to-primary/10"></div>
        
        {/* Efeitos de luz superiores (saindo do dark) */}
        <div className="absolute top-0 left-0 w-full h-4 sm:h-6 lg:h-8">
          <div className="absolute top-1 sm:top-2 left-1/5 w-1 sm:w-1.5 lg:w-2 h-1 sm:h-1.5 lg:h-2 bg-orange-300/60 rounded-full blur-sm animate-pulse"></div>
          <div className="absolute top-2 sm:top-3 lg:top-4 right-1/4 w-1 sm:w-1.5 h-1 sm:h-1.5 bg-yellow-400/50 rounded-full blur-sm animate-pulse delay-300"></div>
          <div className="absolute top-0.5 sm:top-1 left-2/3 w-0.5 sm:w-1 h-0.5 sm:h-1 bg-orange-400/70 rounded-full blur-sm animate-pulse delay-700"></div>
        </div>
        
        {/* Linha decorativa central */}
        <div className="absolute top-1/2 left-0 w-full transform -translate-y-1/2 flex items-center justify-center">
          <div className="relative flex items-center">
            {/* Linha principal */}
            <div className="w-32 sm:w-48 md:w-64 lg:w-96 h-px bg-gradient-to-r from-transparent via-primary/40 to-transparent"></div>
            
            {/* Elemento central decorativo */}
            <div className="absolute left-1/2 transform -translate-x-1/2 flex items-center justify-center">
              <div className="w-6 h-6 lg:w-8 lg:h-8 bg-background border-2 border-primary/30 rounded-full shadow-lg flex items-center justify-center">
                <div className="w-2 h-2 lg:w-3 lg:h-3 bg-gradient-to-br from-orange-400 to-primary rounded-full animate-pulse"></div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Elementos decorativos inferiores (entrando no light) */}
        <div className="absolute bottom-2 sm:bottom-3 lg:bottom-4 left-0 w-full">
          <div className="absolute bottom-1 sm:bottom-2 right-1/5 w-0.5 sm:w-1 h-0.5 sm:h-1 bg-primary/30 rounded-full"></div>
          <div className="absolute bottom-2 sm:bottom-3 lg:bottom-4 left-1/3 w-0.5 h-0.5 bg-primary/40 rounded-full"></div>
          <div className="absolute bottom-0.5 sm:bottom-1 right-2/3 w-0.5 h-0.5 bg-primary/50 rounded-full"></div>
        </div>
        
        {/* Sombra suave na transição */}
        <div className="absolute bottom-0 left-0 w-full h-2 sm:h-3 lg:h-4 bg-gradient-to-b from-transparent to-background/30"></div>
      </div>
    );
  }

  // Default line variant
  return (
    <div className={cn("relative h-12 w-full flex items-center justify-center", className)}>
      <div className="w-20 sm:w-24 md:w-32 h-px bg-gradient-to-r from-transparent via-primary to-transparent"></div>
    </div>
  );
};