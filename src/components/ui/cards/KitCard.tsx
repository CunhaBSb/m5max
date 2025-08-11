import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Rocket, Clock } from "lucide-react";
import type { KitCardProps } from "@/types/homepage";
import { cardStyles, buttonStyles, transitions, shadows } from "@/lib/styles";
import { cn } from "@/lib/utils";

export const KitCard = ({ kit, onRequestQuote }: KitCardProps) => {
  return (
    <Card className={cn(cardStyles.base, cardStyles.hover, "group h-full")}>
      <div className="relative">
        <img 
          src={kit.image} 
          alt={`${kit.name} - Kit pirotécnico com duração de ${kit.duration}`}
          loading="lazy"
          className={cn(cardStyles.image, "h-36 sm:h-40")}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      </div>
      
      <CardContent className={cn(cardStyles.content, "p-2.5 sm:p-3 space-y-2 flex flex-col h-full")}>
        <div className="space-y-1.5 flex-grow">
          <div className="flex items-start justify-between gap-1">
            <h3 className="text-xs sm:text-sm font-bold text-foreground group-hover:text-primary transition-colors leading-tight line-clamp-2">
              {kit.name}
            </h3>
            <div className="flex items-center gap-0.5 text-muted-foreground flex-shrink-0">
              <Clock className="h-2.5 w-2.5 sm:h-3 sm:w-3" />
              <span className="text-xs">{kit.duration}</span>
            </div>
          </div>
          
          <p className="text-muted-foreground text-xs leading-relaxed line-clamp-2">
            {kit.description}
          </p>
        </div>
        
        <div className="space-y-2">
          <div className="flex flex-wrap gap-0.5">
            {kit.features.slice(0, 1).map((feature, index) => (
              <Badge 
                key={index}
                variant="outline" 
                className="text-xs bg-primary/10 text-primary border-primary/30 px-1.5 py-0.5"
              >
                {feature}
              </Badge>
            ))}
            {kit.features.length > 1 && (
              <Badge 
                variant="outline" 
                className="text-xs bg-muted text-muted-foreground border-border px-1.5 py-0.5"
              >
                +{kit.features.length - 1}
              </Badge>
            )}
          </div>
          
          <div className="flex items-center justify-between">
            <div className="text-sm sm:text-base font-bold text-primary">{kit.price}</div>
            <Button 
              onClick={onRequestQuote}
              size="sm"
              className={cn(
                buttonStyles.primary,
                transitions.default,
                "group/btn text-xs px-2 py-1 h-auto"
              )}
              aria-label={`Solicitar orçamento para ${kit.name}`}
            >
              <Rocket className={cn(buttonStyles.icon, "mr-1 h-2.5 w-2.5 group-hover/btn:translate-x-0.5 transition-transform")} />
              Kit
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};