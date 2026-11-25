import { forwardRef, type CSSProperties } from 'react'
import { IMAGE_META, type ImageKey } from '../../data/images.generated'

export interface PictureProps {
  image: ImageKey
  alt: string
  /** The `sizes` attribute — be honest here, it decides which file downloads. */
  sizes?: string
  priority?: boolean
  className?: string
  imgClassName?: string
  imgStyle?: CSSProperties
  style?: CSSProperties
  /** Skip the blurred placeholder (e.g. for tiny thumbnails). */
  noPlaceholder?: boolean
}

const srcset = (key: ImageKey, ext: 'avif' | 'webp') =>
  IMAGE_META[key].widths.map((w) => `/img/${key}-${w}.${ext} ${w}w`).join(', ')

/**
 * Responsive AVIF → WebP picture with intrinsic size (no layout shift)
 * and a 24px blurred placeholder painted behind the image while it loads.
 */
export const Picture = forwardRef<HTMLImageElement, PictureProps>(function Picture(
  { image, alt, sizes = '100vw', priority, className, imgClassName, imgStyle, style, noPlaceholder },
  ref,
) {
  const meta = IMAGE_META[image]
  const widths = meta.widths
  const fallbackW = widths[Math.min(1, widths.length - 1)]
  return (
    <picture className={className} style={style}>
      <source type="image/avif" srcSet={srcset(image, 'avif')} sizes={sizes} />
      <source type="image/webp" srcSet={srcset(image, 'webp')} sizes={sizes} />
      <img
        ref={ref}
        src={`/img/${image}-${fallbackW}.webp`}
        alt={alt}
        width={fallbackW}
        height={Math.round(fallbackW / meta.aspect)}
        loading={priority ? 'eager' : 'lazy'}
        decoding={priority ? 'sync' : 'async'}
        fetchPriority={priority ? 'high' : 'auto'}
        draggable={false}
        className={imgClassName}
        style={{
          ...(noPlaceholder ? null : { backgroundImage: `url(${meta.lqip})`, backgroundSize: 'cover', backgroundPosition: 'center' }),
          ...imgStyle,
        }}
      />
    </picture>
  )
})
