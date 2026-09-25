import React, { useEffect, useState } from "react";

interface Props extends React.ImgHTMLAttributes<HTMLImageElement> {
  fallbackSrc?: string;
}

const ProductImage: React.FC<Props> = ({ fallbackSrc = "/hero-model.jpg", src, alt = "Création ASALA", onError, ...props }) => {
  const [imageSrc, setImageSrc] = useState(src);

  // Keep the displayed image in sync when a gallery thumbnail is selected.
  useEffect(() => {
    setImageSrc(src);
  }, [src]);

  return (
    <img
      {...props}
      src={imageSrc}
      alt={alt}
      onError={(event) => {
        if (imageSrc !== fallbackSrc) setImageSrc(fallbackSrc);
        onError?.(event);
      }}
    />
  );
};

export default ProductImage;
