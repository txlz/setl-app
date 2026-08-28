import { useState } from 'react'
import ScreenHeader from '../components/ScreenHeader.jsx'
import GradientButton from '../components/GradientButton.jsx'
import { CAR_SIZES } from '../data/providers.js'

const COLORS = ['#1D3F8F', '#C43B1D', '#2E9E4F', '#5A5A5A', '#D9B80E', '#7E43FF']

// The customer's saved vehicles (Figma "add vehicle" flow). Car-wash pricing
// keys off the size, so that is part of the vehicle rather than the booking.
export default function VehiclesScreen({ vehicles, onSave, onRemove, onBack }) {
  const [adding, setAdding] = useState(false)
  const [draft, setDraft] = useState({ name: '', plate: '', size: 'middle', color: COLORS[0] })

  const canSave = draft.name.trim() !== '' && draft.plate.trim() !== ''

  function save() {
    if (!canSave) return
    onSave({ ...draft, name: draft.name.trim(), plate: draft.plate.trim() })
    setDraft({ name: '', plate: '', size: 'middle', color: COLORS[0] })
    setAdding(false)
  }

  return (
    <ScreenHeader title="My vehicles" onBack={onBack}>
      <div className="flex grow flex-col pt-1">
        {vehicles.length === 0 && !adding && (
          <p className="shadow-card-sm mt-2 rounded-[15px] bg-white p-5 text-center text-sm text-setl-muted">
            No vehicles yet. Add one to book a car wash faster.
          </p>
        )}

        {vehicles.map((v) => (
          <div
            key={v.id}
            className="row-card mb-3 flex items-center gap-3 px-3 py-2.5"
          >
            <span
              aria-hidden
              className="h-10 w-10 shrink-0 rounded-full"
              style={{ background: v.color }}
            />
            <div className="min-w-0 grow">
              <p className="truncate text-[15px] text-setl-ink">{v.name}</p>
              <p className="text-xs text-setl-muted">
                {v.plate} · {CAR_SIZES.find((s) => s.key === v.size)?.label}
              </p>
            </div>
            <button
              type="button"
              onClick={() => onRemove(v.id)}
              className="shrink-0 cursor-pointer text-xs text-setl-red underline"
            >
              Remove
            </button>
          </div>
        ))}

        {adding ? (
          <div className="shadow-card mt-2 rounded-[15px] bg-white p-4">
            <p className="text-sm font-semibold text-setl-navy">Add a vehicle</p>

            <label className="mt-3 block text-xs text-setl-ink-3" htmlFor="veh-name">
              Make &amp; model
            </label>
            <input
              id="veh-name"
              value={draft.name}
              onChange={(e) => setDraft({ ...draft, name: e.target.value })}
              placeholder="Nissan Patrol"
              className="mt-1 h-11 w-full rounded-[11px] border border-setl-line-3 px-3 text-sm text-setl-ink outline-none placeholder:text-setl-muted-3 focus:border-setl-purple"
            />

            <label className="mt-3 block text-xs text-setl-ink-3" htmlFor="veh-plate">
              Plate number
            </label>
            <input
              id="veh-plate"
              value={draft.plate}
              onChange={(e) => setDraft({ ...draft, plate: e.target.value })}
              placeholder="A 12345"
              className="mt-1 h-11 w-full rounded-[11px] border border-setl-line-3 px-3 text-sm text-setl-ink outline-none placeholder:text-setl-muted-3 focus:border-setl-purple"
            />

            <p className="mt-3 text-xs text-setl-ink-3">Size</p>
            <div className="mt-1 flex gap-2">
              {CAR_SIZES.map((s) => (
                <button
                  key={s.key}
                  type="button"
                  onClick={() => setDraft({ ...draft, size: s.key })}
                  className={`flex-1 cursor-pointer rounded-[11px] border py-2 text-sm transition-colors ${
                    draft.size === s.key
                      ? 'border-setl-purple bg-setl-purple/5 text-setl-navy'
                      : 'border-setl-line text-setl-ink-3'
                  }`}
                >
                  {s.label}
                </button>
              ))}
            </div>

            <p className="mt-3 text-xs text-setl-ink-3">Colour</p>
            <div className="mt-1 flex gap-2">
              {COLORS.map((c) => (
                <button
                  key={c}
                  type="button"
                  aria-label={`colour ${c}`}
                  onClick={() => setDraft({ ...draft, color: c })}
                  className={`h-8 w-8 cursor-pointer rounded-full transition-transform ${
                    draft.color === c ? 'ring-2 ring-setl-purple ring-offset-2' : ''
                  }`}
                  style={{ background: c }}
                />
              ))}
            </div>

            <div className="mt-4 flex gap-2">
              <button
                type="button"
                onClick={() => setAdding(false)}
                className="h-11 flex-1 cursor-pointer rounded-full border border-setl-line text-sm text-setl-ink-3"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={save}
                disabled={!canSave}
                className="brand-cta h-11 flex-1 cursor-pointer rounded-full text-sm font-medium text-white disabled:opacity-40"
              >
                Save vehicle
              </button>
            </div>
          </div>
        ) : (
          <button
            type="button"
            onClick={() => setAdding(true)}
            className="mt-2 h-12 w-full cursor-pointer rounded-[11px] border border-dashed border-setl-line-3 text-sm text-setl-ink-3"
          >
            + Add a vehicle
          </button>
        )}

        <div className="grow" />

        <GradientButton onClick={onBack}>Done</GradientButton>
      </div>
    </ScreenHeader>
  )
}
