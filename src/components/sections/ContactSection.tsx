import { Button } from "@/components/ui/button";
import { Phone, MessageCircle, Mail, MapPin } from "lucide-react";
import { motion } from "framer-motion";
import { contactInfo } from "@/data/homepage-data";

interface ContactSectionProps {
  onRequestQuote: () => void;
}

export const ContactSection = ({ onRequestQuote }: ContactSectionProps) => {
  return (
    <section id="contato" className="py-12 sm:py-16 lg:py-20 bg-gradient-to-b from-background via-slate-50/50 to-slate-100 scroll-mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div 
          className="text-center space-y-5 mb-12 lg:mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <h2 className="text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-black text-slate-900 tracking-tight leading-tight">
            Entre em 
            <span className="bg-gradient-to-r from-orange-500 to-red-500 bg-clip-text text-transparent">
              Contato
            </span>
          </h2>
          <p className="text-base sm:text-lg lg:text-xl text-slate-600 max-w-3xl mx-auto leading-relaxed">
            Pronto para criar um evento inesquecível? Entre em contato conosco 
            e vamos transformar sua celebração em um espetáculo único.
          </p>
        </motion.div>
        
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-16">
          {/* Informações de contato */}
          <motion.div 
            className="space-y-6 lg:space-y-8"
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <div className="space-y-6">
              <div className="bg-gradient-to-br from-orange-50 to-amber-50 border border-orange-100 rounded-2xl p-4 sm:p-6 hover:shadow-lg transition-all duration-300">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 sm:w-14 sm:h-14 bg-gradient-to-br from-orange-500 to-red-500 rounded-xl flex items-center justify-center flex-shrink-0 shadow-lg">
                    <Phone className="h-6 w-6 sm:h-7 sm:w-7 text-white" />
                  </div>
                  <div>
                    <div className="font-bold text-slate-800 text-base sm:text-lg">Telefone</div>
                    <div className="text-slate-600 text-sm sm:text-base font-medium">{contactInfo.phone}</div>
                  </div>
                </div>
              </div>
              
              <div className="bg-gradient-to-br from-green-50 to-emerald-50 border border-green-100 rounded-2xl p-4 sm:p-6 hover:shadow-lg transition-all duration-300">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 sm:w-14 sm:h-14 bg-gradient-to-br from-green-500 to-emerald-500 rounded-xl flex items-center justify-center flex-shrink-0 shadow-lg">
                    <MessageCircle className="h-6 w-6 sm:h-7 sm:w-7 text-white" />
                  </div>
                  <div>
                    <div className="font-bold text-slate-800 text-base sm:text-lg">WhatsApp</div>
                    <div className="text-slate-600 text-sm sm:text-base font-medium">{contactInfo.whatsapp}</div>
                  </div>
                </div>
              </div>
              
              <div className="bg-gradient-to-br from-blue-50 to-cyan-50 border border-blue-100 rounded-2xl p-4 sm:p-6 hover:shadow-lg transition-all duration-300">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 sm:w-14 sm:h-14 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center flex-shrink-0 shadow-lg">
                    <Mail className="h-6 w-6 sm:h-7 sm:w-7 text-white" />
                  </div>
                  <div>
                    <div className="font-bold text-slate-800 text-base sm:text-lg">E-mail</div>
                    <div className="text-slate-600 text-sm sm:text-base font-medium">{contactInfo.email}</div>
                  </div>
                </div>
              </div>
              
              <div className="bg-gradient-to-br from-purple-50 to-violet-50 border border-purple-100 rounded-2xl p-4 sm:p-6 hover:shadow-lg transition-all duration-300">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 sm:w-14 sm:h-14 bg-gradient-to-br from-purple-500 to-violet-500 rounded-xl flex items-center justify-center flex-shrink-0 shadow-lg">
                    <MapPin className="h-6 w-6 sm:h-7 sm:w-7 text-white" />
                  </div>
                  <div>
                    <div className="font-bold text-slate-800 text-base sm:text-lg">Endereço</div>
                    <div className="text-slate-600 text-sm sm:text-base font-medium">{contactInfo.address}</div>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="grid sm:grid-cols-2 gap-4 mt-8">
              <Button 
                onClick={onRequestQuote}
                className="w-full bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white shadow-xl hover:shadow-2xl transition-all duration-300 py-4 text-sm sm:text-base font-bold rounded-xl hover:scale-105"
              >
                Solicitar Orçamento
              </Button>
              
              <a 
                href={`https://wa.me/${contactInfo.whatsapp.replace(/\D/g, '')}`} 
                target="_blank" 
                rel="noopener noreferrer"
                className="w-full"
              >
                <Button 
                  variant="outline" 
                  className="w-full border-2 border-green-500 text-green-600 hover:bg-green-50 hover:border-green-600 transition-all duration-300 py-4 text-sm sm:text-base font-bold rounded-xl hover:scale-105"
                >
                  <MessageCircle className="mr-2 h-5 w-5" />
                  WhatsApp
                </Button>
              </a>
            </div>
          </motion.div>
          
          {/* Mapa */}
          <motion.div 
            className="bg-gradient-to-br from-slate-50 via-orange-50/30 to-amber-50/30 rounded-3xl p-6 sm:p-8 lg:p-10 h-80 sm:h-96 flex items-center justify-center border border-orange-100 shadow-xl hover:shadow-2xl transition-all duration-300"
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <a 
              href={contactInfo.mapLink} 
              target="_blank" 
              rel="noopener noreferrer" 
              className="w-full h-full flex flex-col items-center justify-center hover:scale-105 transition-transform group"
            >
              <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br from-orange-500 to-red-500 rounded-2xl flex items-center justify-center mb-4 sm:mb-6 group-hover:scale-110 transition-transform duration-300 shadow-xl">
                <MapPin className="h-8 w-8 sm:h-10 sm:w-10 text-white" />
              </div>
              <h3 className="text-lg sm:text-xl font-bold text-slate-800 mb-2">Nossa Localização</h3>
              <p className="text-slate-600 mb-3 text-sm sm:text-base text-center">Clique para abrir no Google Maps</p>
              <p className="text-xs sm:text-sm text-orange-600 font-mono bg-white/50 px-3 py-1 rounded-full">-16.243569, -47.968870</p>
            </a>
          </motion.div>
        </div>
      </div>
    </section>
  );
};