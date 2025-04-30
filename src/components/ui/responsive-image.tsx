
import { AspectRatio } from "@/components/ui/aspect-ratio";
import React from "react";
import { cn } from "@/lib/utils";

interface ResponsiveImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  src: string;
  alt: string;
  aspectRatio?: number;
  className?: string;
  sizes?: string;
  fill?: boolean;
}

const ResponsiveImage = ({
  src,
  alt,
  aspectRatio = 16 / 9,
  className,
  sizes = "100vw",
  fill = false,
  ...props
}: ResponsiveImageProps) => {
  // Add width and height if not provided and if not using fill mode
  const imgProps = !fill && !props.width && !props.height
    ? { width: 800, height: Math.round(800 / aspectRatio) }
    : props;

  return (
    <div className={cn("overflow-hidden", fill ? "relative h-full w-full" : "")}>
      {!fill ? (
        <AspectRatio ratio={aspectRatio} className="overflow-hidden">
          <img
            src={src}
            alt={alt}
            className={cn("object-cover w-full h-full", className)}
            sizes={sizes}
            loading="lazy"
            {...imgProps}
          />
        </AspectRatio>
      ) : (
        <img
          src={src}
          alt={alt}
          className={cn("object-cover", fill ? "absolute inset-0 w-full h-full" : "", className)}
          sizes={sizes}
          loading="lazy"
          {...imgProps}
        />
      )}
    </div>
  );
};

export { ResponsiveImage };
