import { motion } from "framer-motion";
import { ServiceCard } from "@/components/ui/cards/ServiceCard";
import { services } from "@/data/homepage-data";

export const ServicesSection = () => {
  return (
    <section id="servicos" className="py-12 sm:py-16 lg:py-20 bg-gradient-to-b from-slate-50/50 via-background to-slate-50/30 scroll-mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div 
          className="text-center space-y-5 mb-12 lg:mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <h2 className="text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-black text-slate-900 tracking-tight leading-tight">
            Nossos 
            <span className="bg-gradient-to-r from-orange-500 to-red-500 bg-clip-text text-transparent">
              Serviços
            </span>
          </h2>
          <p className="text-base sm:text-lg lg:text-xl text-slate-600 max-w-3xl mx-auto leading-relaxed">
            Soluções completas em pirotecnia para todos os tipos de eventos. 
            Cada serviço é personalizado para criar momentos únicos e inesquecíveis.
          </p>
        </motion.div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {services.map((service, index) => (
            <motion.div
              key={service.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="h-full"
            >
              <ServiceCard 
                service={service}
              />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};