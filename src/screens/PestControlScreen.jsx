import ScreenHeader from '../components/ScreenHeader.jsx'
import GradientButton from '../components/GradientButton.jsx'
import { PEST_TYPES } from '../data/providers.js'
import pestImg from '../assets/services/pest.png'

const MAX_ROOMS = 10

// Room counter, one per pest type. Selecting a pest = giving it >= 1 room,
// which is what drives the price (pricePerRoom x rooms).
function Counter({ value, onChange }) {
  return (
    <div className="flex shrink-0 items-center gap-1">
      <button
        type="button"
        aria-label="decrease"
        onClick={() => onChange(Math.max(0, value - 1))}
        className="h-9 w-9 cursor-pointer rounded-md bg-setl-surface-3 text-[15px] text-setl-ink-3 transition-transform duration-100 active:scale-95"
      >
        −
      </button>
      <span className="flex h-9 w-9 items-center justify-center rounded-md border border-setl-purple text-sm text-setl-ink">
        {value}
      </span>
      <button
        type="button"
        aria-label="increase"
        onClick={() => onChange(Math.min(MAX_ROOMS, value + 1))}
        className="h-9 w-9 cursor-pointer rounded-md bg-setl-surface-3 text-[15px] text-setl-ink-3 transition-transform duration-100 active:scale-95"
      >
        +
      </button>
    </div>
  )
}

export default function PestControlScreen({ pests, setPests, onSearchProviders, onBack }) {
  const total = PEST_TYPES.reduce((sum, p) => sum + (pests[p.key] ?? 0) * p.pricePerRoom, 0)
  const rooms = PEST_TYPES.reduce((sum, p) => sum + (pests[p.key] ?? 0), 0)
  const nothingSelected = rooms === 0

  return (
    <ScreenHeader title="Add pest control" subtitle="How many infected rooms for each pest?" onBack={onBack}>
      <div className="flex grow flex-col pt-1">
        {/* Hero photo — an app addition; the 1.html:1557 list board carries no
            photo. Radius follows the board's banner scale. */}
        <div className="relative h-28 overflow-hidden rounded-[15px]">
          <img src={pestImg} alt="" className="h-full w-full object-cover" />
          <span
            aria-hidden
            className="pointer-events-none absolute inset-0 bg-linear-to-t from-black/60 to-transparent"
          />
        </div>

        {PEST_TYPES.map((pest) => (
          // 1.html:1587 — row card 336x55, radius 11, shadow 0 0 13px
          // rgba(0,0,0,.05) (the .row-card utility). Rows pitch 75px on a 55px
          // card (:1587 top 150 -> :1601 top 225), i.e. a 20px gap. The icon disc
          // sits at left 32 on a 20px-inset card, so the row pads 12px.
          <div
            key={pest.key}
            className="row-card mt-5 flex items-center justify-between gap-2 px-3 py-2.5"
          >
            {/* 1.html:1588 — title left 82, disc left 32 + 35 wide, so a 15px gap. */}
            <div className="flex min-w-0 grow items-center gap-[15px]">
              {/* 1.html:1589-1591 — "Ellipse 165", a 35px circle (r 17.5), not a
                  rounded square. Per-pest fills (#D142FA / #EB4D4B / #10D830 …)
                  have no counterpart in PEST_TYPES, so the neutral surface stays. */}
              <span
                aria-hidden
                className="flex h-[35px] w-[35px] shrink-0 items-center justify-center rounded-full bg-setl-surface-3 text-[14px]"
              >
                {pest.icon}
              </span>
              <div className="min-w-0">
                {/* 1.html:1602 — "Mice control", 14px / weight 500 / rgba(0,0,0,.95). */}
                <p className="text-[14px] leading-tight font-medium whitespace-nowrap text-setl-ink">
                  {pest.label}
                </p>
                {/* 1.html:1594 — "2 tasks" meta, 11px / weight 400, dim ink. */}
                <p className="text-[11px] font-normal text-setl-muted">
                  AED {pest.pricePerRoom} / room
                </p>
              </div>
            </div>
            <Counter
              value={pests[pest.key] ?? 0}
              onChange={(v) => setPests({ ...pests, [pest.key]: v })}
            />
          </div>
        ))}

        <div className="grow" />

        {!nothingSelected && (
          /* Running total — an app addition (no board counterpart). Card radius
             follows the exports' 16px card scale; 1.html:167 "Rectangle 25295". */
          <div className="shadow-card mt-5 flex items-center justify-between rounded-[16px] bg-white px-4 py-3">
            {/* 1.html:210 — "rooms" caption, 12px / weight 400, dim ink. */}
            <span className="text-[12px] font-normal text-setl-ink-3">
              {rooms} {rooms === 1 ? 'room' : 'rooms'}
            </span>
            <span className="text-[15px] font-semibold text-setl-navy">AED {total}</span>
          </div>
        )}

        {nothingSelected && (
          <p className="mb-2 text-center text-[11px] text-setl-muted">
            Add at least one room to search for providers
          </p>
        )}
        <div className={nothingSelected ? '' : 'mt-3'}>
          <GradientButton onClick={onSearchProviders} disabled={nothingSelected}>
            Search for providers
          </GradientButton>
        </div>
      </div>
    </ScreenHeader>
  )
}
