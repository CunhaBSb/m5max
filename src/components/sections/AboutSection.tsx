import { Badge } from "@/components/ui/badge";
import { Shield, Award, Users, Clock } from "lucide-react";
import { motion } from "framer-motion";

export const AboutSection = () => {
  const stats = [
    { icon: Clock, value: "40+", label: "Anos de Experiência" },
    { icon: Users, value: "5000+", label: "Eventos Realizados" },
    { icon: Award, value: "100%", label: "Clientes Satisfeitos" },
    { icon: Shield, value: "100%", label: "Segurança Garantida" }
  ];

  return (
    <section id="sobre" className="py-12 sm:py-16 lg:py-20 bg-gradient-to-b from-slate-50/80 via-background to-background scroll-mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-16 items-center">
          {/* Conteúdo de texto */}
          <motion.div 
            className="space-y-6 lg:space-y-8"
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <div className="space-y-5 text-center lg:text-left">
              <Badge className="bg-gradient-to-r from-orange-100 to-amber-100 text-orange-700 border border-orange-200/60 text-xs sm:text-sm font-semibold px-4 py-2 rounded-full shadow-sm">
                ✨ Há mais de 40 anos no mercado
              </Badge>
              
              <h2 className="text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-black text-slate-900 tracking-tight leading-tight">
                Especialistas em Shows 
                <span className="bg-gradient-to-r from-orange-500 to-red-500 bg-clip-text text-transparent">
                  Pirotécnicos
                </span>
              </h2>
              
              <p className="text-base sm:text-lg lg:text-xl text-slate-600 leading-relaxed max-w-xl mx-auto lg:mx-0">
                Somos uma empresa familiar com décadas de experiência em pirotecnia. 
                Nossa paixão é transformar momentos especiais em memórias inesquecíveis 
                através de shows pirotécnicos únicos e seguros.
              </p>
            </div>
            
            <div className="space-y-6">
              <div className="bg-gradient-to-br from-orange-50 to-amber-50 border border-orange-100 rounded-2xl p-4 sm:p-6 hover:shadow-lg transition-all duration-300">
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 sm:w-14 sm:h-14 bg-gradient-to-br from-orange-500 to-red-500 rounded-xl flex items-center justify-center flex-shrink-0 shadow-lg">
                    <Shield className="h-6 w-6 sm:h-7 sm:w-7 text-white" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg sm:text-xl font-bold text-slate-800 mb-2">Segurança em Primeiro Lugar</h3>
                    <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
                      Todos os nossos produtos são certificados e nossos profissionais são treinados 
                      com as mais altas normas de segurança da indústria pirotécnica.
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="bg-gradient-to-br from-amber-50 to-yellow-50 border border-amber-100 rounded-2xl p-4 sm:p-6 hover:shadow-lg transition-all duration-300">
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 sm:w-14 sm:h-14 bg-gradient-to-br from-amber-500 to-orange-500 rounded-xl flex items-center justify-center flex-shrink-0 shadow-lg">
                    <Award className="h-6 w-6 sm:h-7 sm:w-7 text-white" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg sm:text-xl font-bold text-slate-800 mb-2">Qualidade Premium</h3>
                    <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
                      Trabalhamos apenas com produtos de alta qualidade de fornecedores 
                      reconhecidos mundialmente, garantindo shows espetaculares.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
          
          {/* Estatísticas */}
          <motion.div 
            className="grid grid-cols-2 gap-4 sm:gap-6 mt-8 lg:mt-0"
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                className="bg-gradient-to-br from-white via-slate-50 to-orange-50 backdrop-blur-sm border border-orange-100 rounded-2xl p-4 sm:p-6 lg:p-8 text-center hover:shadow-xl hover:scale-105 transition-all duration-300 group"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <div className="inline-flex items-center justify-center w-12 h-12 sm:w-14 sm:h-14 lg:w-16 lg:h-16 bg-gradient-to-br from-orange-500 to-red-500 rounded-xl mb-3 sm:mb-4 group-hover:scale-110 transition-transform duration-300 shadow-lg">
                  <stat.icon className="h-6 w-6 sm:h-7 sm:w-7 lg:h-8 lg:w-8 text-white" />
                </div>
                <div className="text-2xl sm:text-3xl lg:text-4xl font-black text-slate-800 mb-2 bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">{stat.value}</div>
                <div className="text-xs sm:text-sm lg:text-base text-slate-600 font-semibold tracking-wide">{stat.label}</div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
};