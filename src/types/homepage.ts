export type IconName = 'Sparkles' | 'Heart' | 'Music' | 'Building' | 'MessageSquare' | 'ClipboardList' | 'Zap';

export interface Kit {
  readonly id: string;
  readonly name: string;
  readonly description: string;
  readonly image: string;
  readonly price: string;
  readonly duration: string;
  readonly features: readonly string[];
}

export interface Service {
  readonly id: string;
  readonly icon: IconName;
  readonly title: string;
  readonly description: string;
  readonly features: readonly string[];
}

export interface Step {
  readonly number: number;
  readonly title: string;
  readonly description: string;
}

export interface ContactInfo {
  readonly whatsapp: string;
  readonly phone: string;
  readonly phoneRaw: string;
  readonly email: string;
  readonly address: string;
  readonly mapLink: string;
  readonly instagram: string;
  readonly facebook: string;
  readonly youtube: string;
}

// Props interfaces para componentes
export interface SectionProps {
  readonly id?: string;
  readonly className?: string;
  readonly children?: React.ReactNode;
}

export interface WithRequestQuote {
  readonly onRequestQuote: () => void;
}

export interface KitCardProps extends WithRequestQuote {
  readonly kit: Kit;
}

export interface ServiceCardProps extends WithRequestQuote {
  readonly service: Service;
}

export interface HeaderProps extends WithRequestQuote {
  readonly className?: string;
}

export interface HeroSectionProps extends WithRequestQuote {
  readonly className?: string;
}

export interface KitsSectionProps extends WithRequestQuote {
  readonly className?: string;
}

export interface ServicesSectionProps extends WithRequestQuote {
  readonly className?: string;
}

export interface ContactSectionProps extends WithRequestQuote {
  readonly className?: string;
}

// Tipos para animações
export interface AnimationConfig {
  readonly initial: Record<string, string | number | boolean>;
  readonly animate: Record<string, string | number | boolean>;
  readonly transition: Record<string, string | number | boolean>;
  readonly viewport?: Record<string, string | number | boolean>;
}

// Tipos para responsividade
export type BreakpointSize = 'sm' | 'md' | 'lg' | 'xl' | '2xl';

export interface ResponsiveConfig<T> {
  readonly default: T;
  readonly sm?: T;
  readonly md?: T;
  readonly lg?: T;
  readonly xl?: T;
  readonly '2xl'?: T;
}