import { useEffect, useRef, type ElementType, type ReactNode } from 'react'
import { revealChars } from '../../animations/anime'
import { useMotionPrefs } from '../../hooks/useMotionPrefs'

export interface HeadlineLine {
  text: string
  /** Render this line in the italic serif accent face. */
  accent?: boolean
  className?: string
}

interface Props {
  lines: HeadlineLine[]
  as?: ElementType
  className?: string
  /** Animate on mount (hero) or when scrolled into view. */
  trigger?: 'mount' | 'inview'
  delay?: number
  after?: ReactNode
}

/**
 * Editorial headline split into per-character spans, revealed with Anime.js.
 * Screen readers get the plain sentence via aria-label; the spans are hidden from them.
 */
export function SplitHeadline({ lines, as: Tag = 'h2', className = '', trigger = 'inview', delay = 0, after }: Props) {
  const ref = useRef<HTMLElement>(null)
  const { reduced } = useMotionPrefs()
  const label = lines.map((l) => l.text).join(' ')

  useEffect(() => {
    const el = ref.current
    if (!el || reduced) return
    let anim: ReturnType<typeof revealChars>
    if (trigger === 'mount') {
      anim = revealChars(el, { delay })
      return () => void anim?.revert()
    }
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          anim = revealChars(el, { delay })
          io.disconnect()
        }
      },
      { threshold: 0.3 },
    )
    io.observe(el)
    return () => {
      io.disconnect()
      anim?.revert()
    }
  }, [reduced, trigger, delay])

  return (
    <Tag ref={ref} aria-label={label} className={className}>
      {lines.map((line, li) => (
        <span key={li} aria-hidden className={`block overflow-hidden pb-[0.06em] ${line.className ?? ''}`}>
          <span className={`inline-block ${line.accent ? 'serif-accent' : ''}`}>
            {/* Words never break internally; lines may wrap between words. */}
            {line.text.split(' ').map((word, wi, words) => (
              <span key={wi} className="inline-block whitespace-nowrap">
                {Array.from(word).map((ch, ci) => (
                  <span
                    key={ci}
                    data-char
                    className="inline-block will-change-transform"
                    style={reduced ? undefined : { transform: 'translateY(108%)', opacity: 0 }}
                  >
                    {ch}
                  </span>
                ))}
                {wi < words.length - 1 && ' '}
              </span>
            ))}
          </span>
        </span>
      ))}
      {after}
    </Tag>
  )
}
