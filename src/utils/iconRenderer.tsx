import { 
  Sparkles, 
  Heart, 
  Music, 
  Building, 
  MessageCircle, 
  ClipboardList, 
  Zap 
} from "lucide-react";
import { IconName } from "@/types/homepage";

export const renderServiceIcon = (iconName: IconName, className: string = "h-12 w-12"): JSX.Element => {
  const iconMap: Record<IconName, JSX.Element> = {
    'Sparkles': <Sparkles className={className} />,
    'Heart': <Heart className={className} />,
    'Music': <Music className={className} />,
    'Building': <Building className={className} />,
    'MessageSquare': <MessageCircle className={className} />,
    'ClipboardList': <ClipboardList className={className} />,
    'Zap': <Zap className={className} />
  };
  
  return iconMap[iconName] || <Sparkles className={className} />;
};