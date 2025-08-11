import { motion } from "framer-motion";
import { KitCard } from "@/components/ui/cards/KitCard";
import { kits } from "@/data/homepage-data";

interface KitsSectionProps {
  onRequestQuote: () => void;
}

export const KitsSection = ({ onRequestQuote }: KitsSectionProps) => {
  return (
    <section id="kits" className="py-12 sm:py-16 lg:py-20 bg-gradient-to-b from-background via-slate-50/50 to-slate-100/30 scroll-mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div 
          className="text-center space-y-5 mb-12 lg:mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <h2 className="text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-black text-slate-900 tracking-tight leading-tight">
            Kits 
            <span className="bg-gradient-to-r from-orange-500 to-red-500 bg-clip-text text-transparent">
              Pirotécnicos
            </span>
          </h2>
          <p className="text-base sm:text-lg lg:text-xl text-slate-600 max-w-3xl mx-auto leading-relaxed">
            Seleção cuidadosa dos melhores produtos para diferentes ocasiões. 
            Cada kit é montado com produtos de qualidade premium e testados.
          </p>
        </motion.div>

        {/* Apresentação do equipamento */}
        <motion.div 
          className="mb-10 sm:mb-14 lg:mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          viewport={{ once: true }}
        >
          <div className="bg-gradient-to-br from-white via-orange-50/30 to-amber-50/30 rounded-3xl p-6 sm:p-8 lg:p-10 shadow-xl border border-orange-100 hover:shadow-2xl transition-all duration-300">
            <div className="grid lg:grid-cols-3 gap-6 sm:gap-8 lg:gap-10 items-center">
              <div className="lg:col-span-2 space-y-5 lg:space-y-6">
                <h3 className="text-xl sm:text-2xl lg:text-3xl font-bold text-slate-800 text-center lg:text-left">
                  Kits para Uso Próprio - 
                  <span className="bg-gradient-to-r from-orange-500 to-red-500 bg-clip-text text-transparent">
                    Sistema Completo
                  </span>
                </h3>
                <div className="grid sm:grid-cols-2 gap-4 sm:gap-6">
                  <div className="bg-white/70 rounded-2xl p-4 border border-orange-100 hover:shadow-md transition-all duration-300">
                    <div className="flex items-start gap-3">
                      <div className="w-3 h-3 bg-gradient-to-br from-orange-500 to-red-500 rounded-full mt-1 flex-shrink-0"></div>
                      <div>
                        <strong className="text-orange-700 text-sm sm:text-base block mb-1">Artefatos Pirotécnicos</strong>
                        <p className="text-slate-600 text-xs sm:text-sm">Morteiros e tubos certificados com diferentes efeitos.</p>
                      </div>
                    </div>
                  </div>
                  <div className="bg-white/70 rounded-2xl p-4 border border-orange-100 hover:shadow-md transition-all duration-300">
                    <div className="flex items-start gap-3">
                      <div className="w-3 h-3 bg-gradient-to-br from-orange-500 to-red-500 rounded-full mt-1 flex-shrink-0"></div>
                      <div>
                        <strong className="text-orange-700 text-sm sm:text-base block mb-1">Detonador Remoto</strong>
                        <p className="text-slate-600 text-xs sm:text-sm">Sistema de ignição à distância seguro e fácil.</p>
                      </div>
                    </div>
                  </div>
                  <div className="bg-white/70 rounded-2xl p-4 border border-orange-100 hover:shadow-md transition-all duration-300">
                    <div className="flex items-start gap-3">
                      <div className="w-3 h-3 bg-gradient-to-br from-orange-500 to-red-500 rounded-full mt-1 flex-shrink-0"></div>
                      <div>
                        <strong className="text-orange-700 text-sm sm:text-base block mb-1">Manual Completo</strong>
                        <p className="text-slate-600 text-xs sm:text-sm">Instruções detalhadas de montagem e segurança.</p>
                      </div>
                    </div>
                  </div>
                  <div className="bg-white/70 rounded-2xl p-4 border border-orange-100 hover:shadow-md transition-all duration-300">
                    <div className="flex items-start gap-3">
                      <div className="w-3 h-3 bg-gradient-to-br from-orange-500 to-red-500 rounded-full mt-1 flex-shrink-0"></div>
                      <div>
                        <strong className="text-orange-700 text-sm sm:text-base block mb-1">Suporte Técnico</strong>
                        <p className="text-slate-600 text-xs sm:text-sm">Orientação por WhatsApp durante o uso.</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="relative lg:order-last">
                <div className="absolute inset-0 bg-gradient-to-br from-orange-200/30 to-amber-200/30 rounded-2xl blur-2xl"></div>
                <img 
                  src="/kits.png" 
                  alt="Kit completo para uso próprio - Artefatos + Detonador + Manual" 
                  className="relative z-10 w-full h-auto rounded-2xl shadow-xl hover:scale-105 transition-transform duration-300"
                />
              </div>
            </div>
          </div>
        </motion.div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
          {kits.map((kit, index) => (
            <motion.div
              key={kit.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="h-full"
            >
              <KitCard 
                kit={kit}
                onRequestQuote={onRequestQuote}
              />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};