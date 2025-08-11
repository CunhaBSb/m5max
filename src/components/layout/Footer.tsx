import { Phone, Mail, MapPin } from "lucide-react";
import { contactInfo } from "@/data/homepage-data";

export const Footer = () => {
  return (
    <footer className="bg-gradient-to-b from-slate-900 to-black text-white py-12 sm:py-16 lg:py-20 border-t border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 sm:gap-10 lg:gap-12">
          {/* Coluna 1: Logo e Sobre */}
          <div className="space-y-6">
            <div className="flex items-center space-x-3 mb-6">
              <img src="/Logo sem Fundo.png" alt="M5 MAX Logo" className="h-12 w-12 hover:scale-110 transition-transform duration-300" />
              <span className="text-xl font-bold bg-gradient-to-r from-orange-400 to-red-400 bg-clip-text text-transparent">M5 MAX</span>
            </div>
            <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
              Transformando eventos em espetáculos inesquecíveis com shows pirotécnicos profissionais há mais de 40 anos.
            </p>
            <div className="flex space-x-4 pt-2">
              <a 
                href={contactInfo.instagram} 
                target="_blank" 
                rel="noopener noreferrer" 
                className="w-10 h-10 rounded-xl bg-gradient-to-br from-orange-500/20 to-red-500/20 flex items-center justify-center hover:from-orange-500/30 hover:to-red-500/30 border border-orange-400/20 hover:border-orange-400/40 transition-all duration-300 hover:scale-110"
              >
                <span className="text-lg">📸</span>
              </a>
              <a 
                href={contactInfo.facebook} 
                target="_blank" 
                rel="noopener noreferrer" 
                className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500/20 to-cyan-500/20 flex items-center justify-center hover:from-blue-500/30 hover:to-cyan-500/30 border border-blue-400/20 hover:border-blue-400/40 transition-all duration-300 hover:scale-110"
              >
                <span className="text-lg">📱</span>
              </a>
              <a 
                href={contactInfo.youtube} 
                target="_blank" 
                rel="noopener noreferrer" 
                className="w-10 h-10 rounded-xl bg-gradient-to-br from-red-500/20 to-pink-500/20 flex items-center justify-center hover:from-red-500/30 hover:to-pink-500/30 border border-red-400/20 hover:border-red-400/40 transition-all duration-300 hover:scale-110"
              >
                <span className="text-lg">📺</span>
              </a>
            </div>
          </div>

          {/* Coluna 2: Links Rápidos */}
          <div className="space-y-6">
            <h3 className="text-lg sm:text-xl font-bold text-white mb-4">Links Rápidos</h3>
            <ul className="space-y-3">
              <li>
                <a href="#sobre" className="flex items-center text-slate-300 hover:text-orange-400 transition-colors duration-300 text-sm sm:text-base group">
                  <div className="w-2 h-2 rounded-full bg-orange-400 mr-3 group-hover:scale-125 transition-transform duration-300"></div>
                  Sobre Nós
                </a>
              </li>
              <li>
                <a href="#kits" className="flex items-center text-slate-300 hover:text-orange-400 transition-colors duration-300 text-sm sm:text-base group">
                  <div className="w-2 h-2 rounded-full bg-orange-400 mr-3 group-hover:scale-125 transition-transform duration-300"></div>
                  Kits Disponíveis
                </a>
              </li>
              <li>
                <a href="#servicos" className="flex items-center text-slate-300 hover:text-orange-400 transition-colors duration-300 text-sm sm:text-base group">
                  <div className="w-2 h-2 rounded-full bg-orange-400 mr-3 group-hover:scale-125 transition-transform duration-300"></div>
                  Nossos Serviços
                </a>
              </li>
              <li>
                <a href="#contato" className="flex items-center text-slate-300 hover:text-orange-400 transition-colors duration-300 text-sm sm:text-base group">
                  <div className="w-2 h-2 rounded-full bg-orange-400 mr-3 group-hover:scale-125 transition-transform duration-300"></div>
                  Contato
                </a>
              </li>
            </ul>
          </div>

          {/* Coluna 3: Contato */}
          <div className="space-y-6">
            <h3 className="text-lg sm:text-xl font-bold text-white mb-4">Contato</h3>
            <div className="space-y-4">
              <div className="flex items-center text-sm sm:text-base group">
                <Phone className="h-5 w-5 text-orange-400 mr-3 group-hover:scale-110 transition-transform duration-300" />
                <span className="text-slate-300">{contactInfo.phone}</span>
              </div>
              <div className="flex items-center text-sm sm:text-base group">
                <Mail className="h-5 w-5 text-orange-400 mr-3 group-hover:scale-110 transition-transform duration-300" />
                <span className="text-slate-300">{contactInfo.email}</span>
              </div>
              <div className="flex items-start text-sm sm:text-base group">
                <MapPin className="h-5 w-5 text-orange-400 mr-3 mt-0.5 flex-shrink-0 group-hover:scale-110 transition-transform duration-300" />
                <span className="text-slate-300">{contactInfo.address}</span>
              </div>
            </div>
          </div>

          {/* Coluna 4: Informações Legais */}
          <div className="space-y-6">
            <h3 className="text-lg sm:text-xl font-bold text-white mb-4">Certificações</h3>
            <div className="space-y-4 text-sm sm:text-base">
              <div className="flex items-center group">
                <div className="w-3 h-3 bg-green-400 rounded-full mr-3 group-hover:scale-125 transition-transform duration-300 shadow-lg shadow-green-400/50"></div>
                <span className="text-slate-300">Licenças em dia</span>
              </div>
              <div className="flex items-center group">
                <div className="w-3 h-3 bg-green-400 rounded-full mr-3 group-hover:scale-125 transition-transform duration-300 shadow-lg shadow-green-400/50"></div>
                <span className="text-slate-300">Seguro total</span>
              </div>
              <div className="flex items-center group">
                <div className="w-3 h-3 bg-green-400 rounded-full mr-3 group-hover:scale-125 transition-transform duration-300 shadow-lg shadow-green-400/50"></div>
                <span className="text-slate-300">Produtos certificados</span>
              </div>
              <div className="flex items-center group">
                <div className="w-3 h-3 bg-green-400 rounded-full mr-3 group-hover:scale-125 transition-transform duration-300 shadow-lg shadow-green-400/50"></div>
                <span className="text-slate-300">Equipe especializada</span>
              </div>
            </div>
          </div>
        </div>

        {/* Linha de separação e direitos autorais */}
        <div className="border-t border-white/20 mt-10 sm:mt-12 lg:mt-16 pt-8 sm:pt-10">
          <div className="flex flex-col sm:flex-row justify-between items-center text-sm text-slate-400 gap-3 sm:gap-0">
            <p className="font-medium">© 2025 M5 MAX Produções. Todos os direitos reservados.</p>
            <p className="text-center sm:text-right">Desenvolvido com <span className="text-red-400">❤️</span> para criar momentos únicos</p>
          </div>
        </div>
      </div>
    </footer>
  );
};