import { useState } from 'react'
import ScreenHeader from '../components/ScreenHeader.jsx'
import GradientButton from '../components/GradientButton.jsx'

// Rate a finished job. Reached from a completed order in the Orders tab. The
// quick tags are the three things UAE customers actually comment on (timing,
// conduct, price), so most ratings need no typing at all.
const TAGS = ['On time', 'Professional', 'Great value']

const SCORE_WORDS = ['', 'Poor', 'Not great', 'Okay', 'Good', 'Excellent']

function Star({ filled, onClick, index }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={`${index} star${index > 1 ? 's' : ''}`}
      aria-pressed={filled}
      className="cursor-pointer px-1 transition-transform active:scale-90"
    >
      <svg width="36" height="36" viewBox="0 0 24 24" fill={filled ? '#FFA800' : 'none'} stroke={filled ? '#FFA800' : '#D1D1D1'} strokeWidth="1.5" strokeLinejoin="round">
        <path d="m12 3 2.7 5.6 6.1.9-4.4 4.3 1 6.1-5.4-2.9-5.4 2.9 1-6.1L3.2 9.5l6.1-.9L12 3Z" />
      </svg>
    </button>
  )
}

export default function RatingScreen({ order, onSubmit, onBack }) {
  const [stars, setStars] = useState(0)
  const [tags, setTags] = useState([])
  const [note, setNote] = useState('')

  function toggleTag(tag) {
    setTags((t) => (t.includes(tag) ? t.filter((x) => x !== tag) : [...t, tag]))
  }

  const provider = order?.provider

  return (
    <ScreenHeader title="Rate your service" onBack={onBack}>
      {provider && (
        <div className="row-card mt-5 flex items-center gap-3 px-3.5 py-3">
          <div
            className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full text-[14px] font-semibold text-white"
            style={{ background: provider.color }}
          >
            {provider.name[0].toUpperCase()}
          </div>
          <div className="min-w-0">
            <p className="truncate text-[14px] font-medium text-setl-ink">{provider.name}</p>
            <p className="truncate text-[11px] text-setl-muted">
              {order.service} · {order.date?.day} {order.date?.num}
            </p>
          </div>
        </div>
      )}

      <p className="mt-8 text-center text-[14px] font-medium text-setl-ink">
        How did it go?
      </p>
      <div className="mt-3 flex items-center justify-center">
        {[1, 2, 3, 4, 5].map((n) => (
          <Star key={n} index={n} filled={n <= stars} onClick={() => setStars(n)} />
        ))}
      </div>
      <p className="mt-2 h-4 text-center text-[11px] text-setl-muted">{SCORE_WORDS[stars]}</p>

      <p className="mt-7 mb-2 text-[14px] font-medium text-setl-ink">What stood out?</p>
      <div className="flex flex-wrap gap-2">
        {TAGS.map((tag) => {
          const on = tags.includes(tag)
          return (
            <button
              key={tag}
              type="button"
              aria-pressed={on}
              onClick={() => toggleTag(tag)}
              className={`cursor-pointer rounded-full border px-3.5 py-1.5 text-[11px] font-medium transition-colors ${
                on
                  ? 'border-setl-violet bg-[#F4EEFF] text-setl-violet'
                  : 'border-setl-line-2 bg-white text-setl-ink-3'
              }`}
            >
              {tag}
            </button>
          )
        })}
      </div>

      <p className="mt-7 mb-2 text-[14px] font-medium text-setl-ink">
        Add a note <span className="font-normal text-setl-muted">(optional)</span>
      </p>
      <textarea
        value={note}
        onChange={(e) => setNote(e.target.value)}
        rows={3}
        maxLength={280}
        aria-label="Rating note"
        placeholder="Anything the next customer should know?"
        className="w-full resize-none rounded-[11px] border border-setl-line-2 p-3 text-[14px] text-setl-ink outline-none focus:border-setl-violet"
      />

      <div className="grow" />
      <GradientButton
        className="mt-6"
        disabled={stars === 0}
        onClick={() => onSubmit({ stars, tags, note: note.trim() })}
      >
        Submit rating
      </GradientButton>
      <button
        type="button"
        onClick={onBack}
        className="mt-3 cursor-pointer text-center text-[11px] text-setl-muted active:opacity-70"
      >
        Not now
      </button>
    </ScreenHeader>
  )
}
