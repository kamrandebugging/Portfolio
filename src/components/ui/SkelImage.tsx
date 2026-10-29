import { useState, type ImgHTMLAttributes, type SyntheticEvent } from 'react';

type SkelImageProps = ImgHTMLAttributes<HTMLImageElement> & {
  /** classes for the skeleton wrapper — sizing / aspect ratio live here */
  wrapperClassName?: string;
  /** classes for the inner <img> — transforms / hovers live here */
  imgClassName?: string;
};

/**
 * Image with a flat skeleton block behind it until it loads.
 * Perceived-performance pattern: a layout-shaped gray block instead of blank
 * space while the image arrives. No gradient shimmer (banned) — flat token
 * block with a subtle pulse only, disabled under reduced motion.
 */
export default function SkelImage({
  wrapperClassName = '',
  imgClassName = '',
  onLoad,
  ...rest
}: SkelImageProps) {
  const [loaded, setLoaded] = useState(false);

  const handleLoad = (e: SyntheticEvent<HTMLImageElement>) => {
    setLoaded(true);
    onLoad?.(e);
  };

  return (
    <span className={`skel${loaded ? ' skel--done' : ''}${wrapperClassName ? ` ${wrapperClassName}` : ''}`}>
      <img
        {...rest}
        onLoad={handleLoad}
        className={`skel-img${imgClassName ? ` ${imgClassName}` : ''}`}
      />
    </span>
  );
}
