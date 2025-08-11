import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { OptimizedImage } from "@/components/ui/OptimizedImage";
import { MessageCircle, Rocket, ShieldCheck, MapPin, Award } from "lucide-react";
import { motion } from "framer-motion";
import type { HeroSectionProps } from "@/types/homepage";
import { contactInfo } from "@/data/homepage-data";

export const HeroSection = ({ onRequestQuote }: HeroSectionProps) => {
  return (
    <section
      className="relative overflow-hidden min-h-[92vh] flex items-center pt-24 pb-10 lg:pt-28 lg:pb-12"
      aria-label="Seção principal - M5 MAX Produções"
      role="banner"
    >
      {/* Background com imagem e overlay para legibilidade */}
      <div className="absolute inset-0" aria-hidden="true">
        <OptimizedImage
          src="/1.png"
          alt="Show pirotécnico profissional da M5 MAX Produções"
          priority
          containerClassName="absolute inset-0"
          className="w-full h-full object-cover"
          fallbackSrc="/placeholder-hero.jpg"
        />
        <div className="absolute inset-0 bg-gradient-to-tr from-black/85 via-black/70 to-black/30" />
        <div className="absolute inset-0 pointer-events-none mix-blend-overlay [background:radial-gradient(100%_100%_at_0%_0%,rgba(255,255,255,0.06)_0%,rgba(255,255,255,0)_60%)]" />
      </div>

      {/* Conteúdo */}
      <div className="container relative z-10 px-4 sm:px-6 lg:px-10">
        <div className="grid gap-10 lg:grid-cols-12 items-center">
          {/* Coluna de texto */}
          <div className="lg:col-span-7 text-white">
            <div className="mb-4">
              <Badge className="bg-primary/20 text-primary-foreground border border-primary/40 px-3 py-1 rounded-full backdrop-blur-sm">
                M5 MAX Produções • Pirotecnia Profissional
              </Badge>
            </div>

            <motion.h1
              className="font-black tracking-tight leading-tight"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <span className="block text-4xl sm:text-5xl lg:text-6xl">Pirotecnia para Eventos</span>
              <span className="block text-4xl sm:text-5xl lg:text-6xl bg-gradient-to-r from-amber-300 via-orange-400 to-red-500 bg-clip-text text-transparent">de Alto Padrão</span>
            </motion.h1>

            <motion.p
              className="mt-4 text-base sm:text-lg text-white/90 max-w-2xl"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
            >
              Há mais de quatro décadas criando espetáculos memoráveis com segurança, precisão e estética.
              Projetos sob medida para casamentos, corporativos e grandes celebrações — com execução
              certificada e cobertura em todo o Brasil.
            </motion.p>

            <motion.div
              className="mt-6 flex flex-col sm:flex-row gap-3 sm:items-center"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <Button
                onClick={onRequestQuote}
                className="min-h-[44px] px-6 font-semibold bg-primary text-primary-foreground hover:bg-primary/90"
              >
                <Rocket className="mr-2 h-4 w-4" />
                Solicitar Proposta
              </Button>

              <a href={`https://wa.me/${contactInfo.phoneRaw}`} target="_blank" rel="noopener noreferrer">
                <Button
                  variant="outline"
                  className="min-h-[44px] px-6 border-white/30 text-white hover:bg-white/10"
                >
                  <MessageCircle className="mr-2 h-4 w-4" />
                  Falar com Especialista
                </Button>
              </a>
            </motion.div>

            {/* Selo de confiança */}
            <motion.ul
              className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-3 max-w-2xl text-sm text-white/90"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              <li className="flex items-center gap-2">
                <ShieldCheck className="h-4 w-4 text-emerald-400" />
                Equipe certificada e protocolos de segurança
              </li>
              <li className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-sky-400" />
                Operação nacional e logística própria
              </li>
              <li className="flex items-center gap-2">
                <Award className="h-4 w-4 text-amber-400" />
                40+ anos de experiência comprovada
              </li>
            </motion.ul>
          </div>

          {/* Coluna visual */}
          <div className="lg:col-span-5">
            <motion.div
              className="relative rounded-xl border border-white/10 bg-white/5 backdrop-blur-sm p-4 sm:p-6 text-white shadow-2xl"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.15 }}
            >
              <div className="flex items-center gap-3 mb-3">
                <img src="/Logo.svg" alt="M5 MAX Produções" className="h-10 w-10" />
                <div>
                  <p className="text-xs uppercase tracking-wider text-white/70">Assinatura M5 MAX</p>
                  <p className="font-semibold leading-tight">Excelência em cada espetáculo</p>
                </div>
              </div>
              <div className="grid grid-cols-3 divide-x divide-white/10 rounded-lg overflow-hidden border border-white/10">
                <div className="bg-white/5 p-4 text-center">
                  <p className="text-2xl font-extrabold text-white">+40</p>
                  <p className="text-xs text-white/70">anos</p>
                </div>
                <div className="bg-white/5 p-4 text-center">
                  <p className="text-2xl font-extrabold text-white">100%</p>
                  <p className="text-xs text-white/70">segurança</p>
                </div>
                <div className="bg-white/5 p-4 text-center">
                  <p className="text-2xl font-extrabold text-white">Brasil</p>
                  <p className="text-xs text-white/70">cobertura</p>
                </div>
              </div>
              <p className="mt-3 text-sm text-white/80">
                Projetos personalizados, alinhados ao conceito do evento e às normas vigentes.
              </p>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
};
