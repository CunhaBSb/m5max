import { useState, forwardRef } from "react";
import { cn } from "@/lib/utils";
import { transitions } from "@/lib/styles";

interface OptimizedImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  readonly src: string;
  readonly alt: string;
  readonly fallbackSrc?: string;
  readonly placeholder?: React.ReactNode;
  readonly containerClassName?: string;
  readonly priority?: boolean;
  readonly aspectRatio?: "square" | "video" | "portrait" | "auto";
}

const aspectRatioClasses = {
  square: "aspect-square",
  video: "aspect-video", 
  portrait: "aspect-[3/4]",
  auto: ""
} as const;

export const OptimizedImage = forwardRef<HTMLImageElement, OptimizedImageProps>(
  ({ 
    src, 
    alt, 
    fallbackSrc, 
    placeholder,
    containerClassName,
    priority = false,
    aspectRatio = "auto",
    className,
    onLoad,
    onError,
    ...props 
  }, ref) => {
    const [isLoading, setIsLoading] = useState(true);
    const [hasError, setHasError] = useState(false);
    const [currentSrc, setCurrentSrc] = useState(src);

    const handleLoad = (event: React.SyntheticEvent<HTMLImageElement>) => {
      setIsLoading(false);
      setHasError(false);
      onLoad?.(event);
    };

    const handleError = (event: React.SyntheticEvent<HTMLImageElement>) => {
      setHasError(true);
      setIsLoading(false);
      
      if (fallbackSrc && currentSrc !== fallbackSrc) {
        setCurrentSrc(fallbackSrc);
        setIsLoading(true);
        setHasError(false);
        return;
      }
      
      onError?.(event);
    };

    const renderPlaceholder = () => {
      if (placeholder) {
        return placeholder;
      }
      
      return (
        <div className="flex items-center justify-center h-full bg-muted/50 text-muted-foreground">
          <div className="text-center space-y-2">
            <div className="w-8 h-8 mx-auto bg-muted-foreground/20 rounded animate-pulse" />
            <p className="text-xs">Carregando...</p>
          </div>
        </div>
      );
    };

    const renderError = () => (
      <div className="flex items-center justify-center h-full bg-muted/50 text-muted-foreground border-2 border-dashed border-muted-foreground/20">
        <div className="text-center space-y-2">
          <div className="text-2xl">📷</div>
          <p className="text-xs">Imagem não disponível</p>
        </div>
      </div>
    );

    return (
      <div 
        className={cn(
          "relative overflow-hidden",
          aspectRatioClasses[aspectRatio],
          containerClassName
        )}
      >
        {isLoading && renderPlaceholder()}
        
        {hasError && !isLoading && renderError()}
        
        <img
          ref={ref}
          src={currentSrc}
          alt={alt}
          loading={priority ? "eager" : "lazy"}
          onLoad={handleLoad}
          onError={handleError}
          className={cn(
            "w-full h-full object-cover",
            transitions.default,
            isLoading && "opacity-0",
            !isLoading && !hasError && "opacity-100",
            className
          )}
          {...props}
        />
      </div>
    );
  }
);

OptimizedImage.displayName = "OptimizedImage";