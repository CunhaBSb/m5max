/**
 * Utilitários de estilos centralizados para a aplicação
 * Contém classes reutilizáveis e padrões de design
 */

import { cn } from "@/lib/utils";

// Gradientes padronizados
export const gradients = {
  primary: "bg-gradient-to-r from-primary to-primary/80",
  primaryBg: "bg-gradient-to-br from-background/95 via-background/90 to-primary/5",
  primaryCard: "bg-gradient-to-br from-card to-primary/5",
  heroOverlay: "bg-gradient-to-tr from-background/95 via-background/90 to-primary/5",
  cardHover: "hover:bg-gradient-to-br hover:from-card hover:to-primary/5",
  success: "bg-gradient-to-r from-green-500 to-green-600",
  warning: "bg-gradient-to-r from-yellow-500 to-yellow-600",
} as const;

// Sombras padronizadas
export const shadows = {
  card: "shadow-sm hover:shadow-md",
  floating: "shadow-lg hover:shadow-xl",
  glow: "shadow-2xl shadow-primary/25",
  dropShadow: "drop-shadow-2xl",
} as const;

// Transições padronizadas
export const transitions = {
  default: "transition-all duration-300",
  fast: "transition-all duration-200",
  slow: "transition-all duration-500",
  hover: "transition-all duration-300 hover:scale-[1.02]",
  bounce: "transition-transform duration-300 hover:scale-110",
} as const;

// Bordas padronizadas
export const borders = {
  card: "border border-border",
  primary: "border border-primary/20",
  muted: "border border-border/50",
  focus: "focus:border-primary focus:ring-2 focus:ring-primary/20",
} as const;

// Backgrounds padronizados
export const backgrounds = {
  card: "bg-card",
  muted: "bg-muted/20",
  primary: "bg-primary/5",
  glass: "bg-background/40 backdrop-blur-md",
  overlay: "bg-black/40",
} as const;

// Estilos para seções
export const sectionStyles = {
  container: "container mx-auto mobile-container",
  padding: "py-12 sm:py-16 lg:py-20",
  title: "text-2xl sm:text-3xl md:text-4xl font-bold text-foreground mb-4",
  subtitle: "text-base sm:text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed",
  header: "text-center space-y-4 mb-16",
} as const;

// Estilos para botões
export const buttonStyles = {
  primary: "bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg hover:shadow-xl",
  secondary: "border-primary/20 text-foreground hover:bg-primary/5 hover:border-primary/40",
  ghost: "hover:bg-primary/10 hover:text-primary",
  icon: "h-4 w-4 sm:h-5 sm:w-5",
} as const;

// Estilos para cards
export const cardStyles = {
  base: cn(
    backgrounds.card,
    borders.card,
    shadows.card,
    transitions.default,
    "rounded-xl overflow-hidden"
  ),
  hover: cn(
    "hover:border-primary/20",
    transitions.hover
  ),
  content: "p-4 sm:p-6 space-y-4",
  image: "w-full h-40 sm:h-48 object-cover group-hover:scale-105 transition-transform duration-500",
} as const;

// Estilos para formulários
export const formStyles = {
  input: cn(
    "bg-background border-border text-foreground",
    borders.focus,
    transitions.fast
  ),
  label: "text-foreground font-medium",
  error: "text-sm text-destructive mt-1",
  required: "text-destructive",
} as const;

// Estilos para animações
export const animations = {
  float: "animate-float",
  pulse: "animate-pulse",
  bounce: "animate-bounce",
  spin: "animate-spin",
  fadeIn: "animate-in fade-in duration-500",
  slideUp: "animate-in slide-in-from-bottom-4 duration-500",
} as const;

// Grid responsivo padronizado
export const grids = {
  auto: "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6",
  services: "grid sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8",
  kits: "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-6",
  stats: "grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6",
} as const;

// Função utilitária para combinar estilos
export const combineStyles = (...styles: (string | undefined | false)[]): string => {
  return cn(...styles.filter(Boolean));
};

// Função para aplicar estilos condicionalmente
export const conditionalStyle = (condition: boolean, trueStyle: string, falseStyle?: string): string => {
  return condition ? trueStyle : falseStyle || "";
};