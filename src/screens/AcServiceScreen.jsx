import ScreenHeader from '../components/ScreenHeader.jsx'
import GradientButton from '../components/GradientButton.jsx'

const MAX_UNITS = 10

function Counter({ value, onChange }) {
  return (
    <div className="flex items-center gap-1.5">
      <button
        type="button"
        aria-label="decrease"
        onClick={() => onChange(Math.max(0, value - 1))}
        className="h-10 w-10 cursor-pointer rounded-md bg-setl-surface-3 text-lg text-setl-ink-3 transition-transform duration-100 active:scale-95"
      >
        −
      </button>
      <span className="flex h-10 w-10 items-center justify-center rounded-md border border-setl-purple text-[15px] text-black">
        {value}
      </span>
      <button
        type="button"
        aria-label="increase"
        onClick={() => onChange(Math.min(MAX_UNITS, value + 1))}
        className="h-10 w-10 cursor-pointer rounded-md bg-setl-surface-3 text-lg text-setl-ink-3 transition-transform duration-100 active:scale-95"
      >
        +
      </button>
    </div>
  )
}

export default function AcServiceScreen({ counts, setCounts, onSearchProviders, onSendPhoto, onBack }) {
  const nothingSelected = counts.refill + counts.clean === 0
  return (
    <ScreenHeader title="AC cleaning & refilling" subtitle="Tell us how many units need work" onBack={onBack}>
      <div className="flex grow flex-col pt-1">

        <div className="mt-4 flex items-center justify-between rounded-lg border border-setl-line bg-white p-4">
          <p className="text-[15px] text-black">How many AC&apos;s need refilling</p>
          <Counter value={counts.refill} onChange={(v) => setCounts({ ...counts, refill: v })} />
        </div>

        <div className="mt-4 flex items-center justify-between rounded-lg border border-setl-line bg-white p-4">
          <p className="text-[15px] text-black">How many AC&apos;s need cleaning</p>
          <Counter value={counts.clean} onChange={(v) => setCounts({ ...counts, clean: v })} />
        </div>

        <div className="grow" />

        {nothingSelected && (
          <p className="mb-2 text-center text-xs text-setl-muted">
            Select at least one AC service to search for providers
          </p>
        )}
        <GradientButton onClick={onSearchProviders} disabled={nothingSelected}>
          Search for providers
        </GradientButton>

        <button
          type="button"
          onClick={onSendPhoto}
          className="mt-4 w-full cursor-pointer rounded-xl border border-setl-purple bg-white py-3 text-center"
        >
          <span className="block text-sm text-[#2790C3]">Not sure what&apos;s wrong?</span>
          <span className="block text-lg font-medium text-setl-purple">Send a pro a photo</span>
          <span className="block text-xs text-setl-muted">Get a ballpark — no visit needed to start</span>
        </button>
      </div>
    </ScreenHeader>
  )
}
