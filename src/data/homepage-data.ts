/**
 * Dados centralizados para a Homepage
 * Contém informações de contato, kits, serviços e etapas do processo
 */

import type { ContactInfo, Kit, Service, Step } from "@/types/homepage";

// Informações de contato padronizadas
export const contactInfo: ContactInfo = {
  phone: "(61) 8273-5575",
  whatsapp: "(61) 8273-5575",
  phoneRaw: "5561982735575", // Formato para links de WhatsApp
  email: "fogosm5.max@gmail.com",
  address: "Luziânia, GO",
  mapLink: "https://maps.app.goo.gl/akjdi753DKvjMgkWA",
  instagram: "https://instagram.com/m5maxproducoes",
  facebook: "https://facebook.com/m5maxproducoes",
  youtube: "https://youtube.com/m5maxproducoes"
} as const;

// Kits disponíveis
export const kits: readonly Kit[] = [
  {
    id: "1",
    name: "Kit Chá Revelação",
    price: "R$ 750",
    duration: "2 min",
    image: "/chá revelação.jpg.webp",
    description: "Perfeito para revelar o sexo do bebê",
    features: ["Efeito colorido", "Seguro", "Fácil uso"]
  },
  {
    id: "2",
    name: "Kit Réveillon",
    price: "R$ 8.500",
    duration: "6 min",
    image: "/1.png",
    description: "Celebre a virada do ano com estilo",
    features: ["Show completo", "Múltiplas cores", "Grande duração"]
  },
  {
    id: "3",
    name: "Kit Casamento",
    price: "R$ 5.000",
    duration: "4 min",
    image: "/show pirotecnico.jpg",
    description: "Torne seu casamento inesquecível",
    features: ["Romântico", "Personalizável", "Profissional"]
  },
  {
    id: "4",
    name: "Kit Confraternização",
    price: "R$ 2.000",
    duration: "2 min",
    image: "/Confraternização.png",
    description: "Para festas corporativas e eventos",
    features: ["Corporativo", "Versátil", "Impactante"]
  }
] as const;

// Serviços oferecidos
export const services: readonly Service[] = [
  {
    id: "1",
    icon: "Sparkles" as const,
    title: "Shows Pirotécnicos",
    description: "Espetáculos profissionais com equipe especializada para grandes eventos",
    features: ["Equipe especializada", "Equipamentos profissionais", "Segurança total"]
  },
  {
    id: "2",
    icon: "Heart" as const,
    title: "Artigos Pirotécnicos",
    description: "Venda de kits especiais para suas celebrações particulares",
    features: ["Kits personalizados", "Produtos certificados", "Entrega rápida"]
  },
  {
    id: "3",
    icon: "Building" as const,
    title: "Consultoria Técnica",
    description: "Orientação especializada para planejamento de shows pirotécnicos",
    features: ["Consultoria especializada", "Planejamento detalhado", "Suporte completo"]
  }
] as const;

// Etapas do processo
export const steps: readonly Step[] = [
  { 
    number: 1,
    title: "Solicitação", 
    description: "Entre em contato conosco via WhatsApp ou formulário para solicitar seu orçamento" 
  },
  { 
    number: 2,
    title: "Orçamento", 
    description: "Receba sua proposta personalizada em até 24 horas com todos os detalhes" 
  },
  { 
    number: 3,
    title: "Planejamento", 
    description: "Definimos todos os detalhes técnicos e logísticos do seu evento" 
  },
  { 
    number: 4,
    title: "Realização", 
    description: "Desfrute do espetáculo pirotécnico no seu evento especial" 
  }
] as const;