import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Service } from "@/types/homepage";
import { renderServiceIcon } from "@/utils/iconRenderer";

interface ServiceCardProps {
  service: Service;
}

export const ServiceCard = ({ service }: ServiceCardProps) => {
  return (
    <Card 
      className="group relative overflow-hidden rounded-2xl border border-slate-200/50 shadow-lg bg-gradient-to-br from-white to-slate-50/50 hover:shadow-xl hover:scale-[1.02] transition-all duration-300 hover:border-orange-200"
      role="region"
      aria-label={`Serviço: ${service.title}`}
    >
      <CardContent className="p-5 sm:p-6 lg:p-7 text-center space-y-4 lg:space-y-5">
        {/* Ícone com background gradiente */}
        <div className="flex justify-center">
          <div className="bg-gradient-to-br from-orange-100 to-orange-50 text-orange-600 rounded-2xl p-4 lg:p-5 w-fit group-hover:scale-110 group-hover:shadow-lg transition-all duration-300 shadow-md">
            {renderServiceIcon(service.icon, "h-8 w-8 lg:h-10 lg:w-10")}
          </div>
        </div>
        
        {/* Tipografia profissional */}
        <div className="space-y-3 lg:space-y-4">
          <h3 className="text-lg lg:text-xl font-bold text-slate-800 group-hover:text-orange-600 transition-colors tracking-tight">
            {service.title}
          </h3>
          <p className="text-sm lg:text-base text-slate-600 leading-relaxed">
            {service.description}
          </p>
        </div>
        
        {/* Tags apenas */}
        <div className="pt-2">
          <div className="flex flex-wrap gap-2 justify-center">
            {service.features.map((feature, index) => (
              <Badge 
                key={index}
                className="text-xs px-3 py-1.5 bg-gradient-to-r from-orange-50 to-amber-50 text-orange-700 border border-orange-200/60 rounded-full hover:bg-gradient-to-r hover:from-orange-100 hover:to-amber-100 transition-all duration-300 font-medium"
              >
                {feature}
              </Badge>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};