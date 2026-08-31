import { useState } from 'react'

// First-run intro: three slides between the brand splash and login. Shown once
// per device (App persists `setl_onboarded`), so returning customers go
// splash -> login as before. Swipe (touch drag) or tap Next; Skip jumps to the
// end of the deck rather than straight out, so the last slide's "Get started"
// stays the single way in.
const SLIDES = [
  {
    key: 'book',
    title: 'Home & car services,\nbooked in a minute',
    body: 'AC, cleaning, plumbing, pest control and car wash — pick a service, pick a slot, done.',
    art: 'calendar',
  },
  {
    key: 'pros',
    title: 'Vetted pros,\nreal prices',
    body: 'Compare rated providers with their fees up front. No surprise charges when they arrive.',
    art: 'shield',
  },
  {
    key: 'track',
    title: 'Track the job,\npay after',
    body: 'Watch your pro come to you, approve any estimate, and settle the invoice once the work is done.',
    art: 'pin',
  },
]

function SlideArt({ art }) {
  const common = { width: 96, height: 96, viewBox: '0 0 24 24', fill: 'none', stroke: '#7E43FF', strokeWidth: 1.3 }
  if (art === 'calendar')
    return (
      <svg {...common}>
        <rect x="3" y="5" width="18" height="16" rx="3" />
        <path d="M3 10h18M8 3v4M16 3v4" strokeLinecap="round" />
        <path d="m9 15 2 2 4-4" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    )
  if (art === 'shield')
    return (
      <svg {...common}>
        <path d="M12 3l7 3v6c0 4.4-3 8-7 9-4-1-7-4.6-7-9V6l7-3Z" strokeLinejoin="round" />
        <path d="m9 12 2 2 4-4" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    )
  return (
    <svg {...common}>
      <path d="M12 21s7-5.7 7-11a7 7 0 1 0-14 0c0 5.3 7 11 7 11Z" strokeLinejoin="round" />
      <circle cx="12" cy="10" r="2.6" />
    </svg>
  )
}

export default function OnboardingScreen({ onDone }) {
  const [index, setIndex] = useState(0)
  const [dragStart, setDragStart] = useState(null)
  const slide = SLIDES[index]
  const last = index === SLIDES.length - 1

  function go(next) {
    setIndex(Math.min(SLIDES.length - 1, Math.max(0, next)))
  }

  // Lightweight swipe: a 40px horizontal drag moves one slide.
  function onTouchStart(e) {
    setDragStart(e.touches[0].clientX)
  }
  function onTouchEnd(e) {
    if (dragStart === null) return
    const dx = e.changedTouches[0].clientX - dragStart
    setDragStart(null)
    if (dx < -40) go(index + 1)
    else if (dx > 40) go(index - 1)
  }

  return (
    <div
      className="font-poppins flex min-h-screen flex-col bg-white px-7 pt-12 pb-8"
      onTouchStart={onTouchStart}
      onTouchEnd={onTouchEnd}
    >
      <div className="flex h-11 items-center justify-end">
        {!last && (
          <button
            type="button"
            onClick={() => go(SLIDES.length - 1)}
            className="cursor-pointer text-[14px] font-medium text-setl-muted active:opacity-70"
          >
            Skip
          </button>
        )}
      </div>

      <div key={slide.key} className="screen-enter flex grow flex-col items-center justify-center text-center">
        <div className="flex h-[190px] w-[190px] items-center justify-center rounded-full bg-[#F4EEFF]">
          <SlideArt art={slide.art} />
        </div>
        <h1 className="mt-10 text-[24px] leading-tight font-semibold whitespace-pre-line text-setl-navy">
          {slide.title}
        </h1>
        <p className="mt-3 max-w-[290px] text-[14px] leading-relaxed text-setl-ink-3">{slide.body}</p>
      </div>

      <div className="mb-7 flex items-center justify-center gap-2">
        {SLIDES.map((s, i) => (
          <button
            key={s.key}
            type="button"
            aria-label={`Go to slide ${i + 1}`}
            onClick={() => go(i)}
            className={`h-2 cursor-pointer rounded-full transition-all ${
              i === index ? 'w-6 bg-setl-violet' : 'w-2 bg-setl-line-2'
            }`}
          />
        ))}
      </div>

      <button
        type="button"
        onClick={last ? onDone : () => go(index + 1)}
        className="brand-hero inline-flex h-[52px] w-full cursor-pointer items-center justify-center rounded-[12px] text-[17px] font-medium text-white transition-transform duration-100 active:scale-[0.98] active:opacity-90"
      >
        {last ? 'Get started' : 'Next'}
      </button>
    </div>
  )
}
