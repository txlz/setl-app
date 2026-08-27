import GradientHeader from '../components/GradientHeader.jsx'
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
        className="h-9 w-9 cursor-pointer rounded-md bg-setl-surface-3 text-lg text-setl-ink-3 transition-transform duration-100 active:scale-95"
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
        className="h-9 w-9 cursor-pointer rounded-md bg-setl-surface-3 text-lg text-setl-ink-3 transition-transform duration-100 active:scale-95"
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
    <GradientHeader title="Pest control" onBack={onBack} sheetClassName="bg-setl-surface">
      <div className="font-poppins flex grow flex-col px-4 pt-5 pb-6">
        {/* Hero photo, as on the Figma board */}
        <div className="relative h-28 overflow-hidden rounded-2xl">
          <img src={pestImg} alt="" className="h-full w-full object-cover" />
          <span
            aria-hidden
            className="pointer-events-none absolute inset-0 bg-linear-to-t from-black/60 to-transparent"
          />
          <span className="absolute bottom-3 left-4 text-lg font-medium text-white">
            Pest control
          </span>
        </div>

        <h2 className="mt-4 text-2xl font-semibold text-setl-navy">Add pest control</h2>
        <p className="mt-1 text-xs text-setl-muted">
          How many infected rooms for each pest?
        </p>

        {PEST_TYPES.map((pest) => (
          <div
            key={pest.key}
            className="shadow-card-sm mt-3 flex items-center justify-between rounded-lg border border-setl-line bg-white p-4"
          >
            <div className="flex min-w-0 items-center gap-2.5">
              <span
                aria-hidden
                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-setl-surface-3 text-base"
              >
                {pest.icon}
              </span>
              <div className="min-w-0">
                <p className="text-sm leading-tight text-setl-ink">{pest.label}</p>
                <p className="text-xs text-setl-muted">AED {pest.pricePerRoom} / room</p>
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
          <div className="shadow-card mt-5 flex items-center justify-between rounded-2xl bg-white px-4 py-3">
            <span className="text-sm text-setl-ink-3">
              {rooms} {rooms === 1 ? 'room' : 'rooms'}
            </span>
            <span className="text-lg font-semibold text-setl-navy">AED {total}</span>
          </div>
        )}

        {nothingSelected && (
          <p className="mb-2 text-center text-xs text-setl-muted">
            Add at least one room to search for providers
          </p>
        )}
        <div className={nothingSelected ? '' : 'mt-3'}>
          <GradientButton onClick={onSearchProviders} disabled={nothingSelected}>
            Search for providers
          </GradientButton>
        </div>
      </div>
    </GradientHeader>
  )
}
