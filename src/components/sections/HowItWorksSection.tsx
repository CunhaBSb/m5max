import { steps } from "@/data/homepage-data";
import { motion } from "framer-motion";

export const HowItWorksSection = () => {
  return (
    <section className="py-12 sm:py-16 lg:py-20 bg-gradient-to-b from-background via-slate-50/30 to-slate-100/50 scroll-mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div 
          className="text-center space-y-5 mb-12 lg:mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <h2 className="text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-black text-slate-900 tracking-tight leading-tight">
            Como 
            <span className="bg-gradient-to-r from-orange-500 to-red-500 bg-clip-text text-transparent">
              Funciona
            </span>
          </h2>
          <p className="text-base sm:text-lg lg:text-xl text-slate-600 max-w-3xl mx-auto leading-relaxed">
            Processo simples e transparente para realizar seu evento dos sonhos. 
            Do primeiro contato até o show, cuidamos de cada detalhe.
          </p>
        </motion.div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
          {steps.map((step, index) => (
            <motion.div
              key={step.number}
              className="relative text-center group"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
            >
              {/* Linha conectora */}
              {index < steps.length - 1 && (
                <div className="hidden lg:block absolute top-10 left-full w-full h-1 bg-gradient-to-r from-orange-300 via-orange-200 to-transparent -translate-x-6 z-0 rounded-full" />
              )}
              
              <div className="relative z-10 bg-white rounded-3xl p-6 lg:p-8 shadow-xl border border-orange-100 hover:shadow-2xl hover:scale-105 transition-all duration-300 space-y-4 lg:space-y-5">
                <div className="inline-flex items-center justify-center w-16 h-16 sm:w-18 sm:h-18 bg-gradient-to-br from-orange-500 to-red-500 text-white rounded-2xl text-xl sm:text-2xl font-black group-hover:scale-110 transition-transform duration-300 shadow-xl">
                  {step.number}
                </div>
                
                <h3 className="text-lg sm:text-xl font-bold text-slate-800">
                  {step.title}
                </h3>
                
                <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
                  {step.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};