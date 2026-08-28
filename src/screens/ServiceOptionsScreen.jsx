import { useState } from 'react'
import ScreenHeader from '../components/ScreenHeader.jsx'
import GradientButton from '../components/GradientButton.jsx'
import { SERVICES } from '../data/providers.js'

// Generic "pick the jobs you need" screen for every catalog service that
// defines `options` in SERVICES (technician, electrician, network, curtains,
// outdoor furniture, car wash). The two-option pattern from the FigJam
// board: know what you need -> pick it here; not sure -> send a pro a photo.
export default function ServiceOptionsScreen({ serviceKey, onSearchProviders, onSendPhoto, onBack }) {
  const service = SERVICES[serviceKey]
  const [picked, setPicked] = useState(() => new Set())

  function toggle(label) {
    const next = new Set(picked)
    if (next.has(label)) next.delete(label)
    else next.add(label)
    setPicked(next)
  }

  const selected = service.options.filter((o) => picked.has(o.label))
  const total = selected.reduce((sum, o) => sum + o.price, 0)

  return (
    <ScreenHeader title={service.label} onBack={onBack}>
      <div className="flex grow flex-col pt-1">
        <h2 className="text-[17px] font-semibold text-black">What do you need done?</h2>

        <div className="mt-4 flex flex-col gap-2.5">
          {service.options.map((o) => (
            <label
              key={o.label}
              className="flex cursor-pointer items-center gap-3 rounded-[11px] border border-setl-line bg-white p-3.5 text-[15px] text-black has-[:checked]:border-setl-purple"
            >
              <input
                type="checkbox"
                checked={picked.has(o.label)}
                onChange={() => toggle(o.label)}
                className="h-5 w-5 accent-setl-purple"
              />
              <span className="grow">{o.label}</span>
              <span className="shrink-0 text-sm font-semibold">{o.price} AED</span>
            </label>
          ))}
        </div>

        <p className="mt-3 text-xs text-setl-muted">
          The provider&apos;s call-out fee is added at checkout. AED 0 due now — pay when the work
          is done.
        </p>

        <div className="grow" />

        {selected.length === 0 && (
          <p className="mb-2 text-center text-xs text-setl-muted">
            Select at least one job to search for providers
          </p>
        )}
        <GradientButton
          disabled={selected.length === 0}
          onClick={() => onSearchProviders(selected)}
        >
          Search for providers{total > 0 ? ` — ${total} AED` : ''}
        </GradientButton>

        {service.inspectionLabel && (
          <button
            type="button"
            onClick={onSendPhoto}
            className="mt-4 w-full cursor-pointer rounded-[11px] border border-setl-purple bg-white py-3 text-center"
          >
            <span className="block text-sm text-[#2790C3]">Not sure what&apos;s wrong?</span>
            <span className="block text-[15px] font-medium text-setl-purple">Send a pro a photo</span>
            <span className="block text-xs text-setl-muted">
              Get a ballpark — no visit needed to start
            </span>
          </button>
        )}
      </div>
    </ScreenHeader>
  )
}
