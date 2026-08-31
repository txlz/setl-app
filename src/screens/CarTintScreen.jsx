import { useState } from 'react'
import ScreenHeader from '../components/ScreenHeader.jsx'
import GradientButton from '../components/GradientButton.jsx'
import CarBrand from '../components/CarBrand.jsx'

// WF-3, the car-tint configurator: tint level, which sides, then the heat
// rejection and warranty that follow from the film chosen. Priced live, since
// the whole point of the screen is watching the number move.
const LEVELS = [
  { key: '60', label: '60%', heat: 82, price: 300 },
  { key: '100', label: '100%', heat: 94, price: 400 },
]

const SIDES = [
  { key: 'front', label: 'Front', price: 90 },
  { key: 'side', label: 'Sides', price: 150 },
  { key: 'back', label: 'Back', price: 100 },
]

export default function CarTintScreen({ vehicles = [], onSearchProviders, onBack }) {
  const [vehicle, setVehicle] = useState(vehicles[0]?.id ?? null)
  const [level, setLevel] = useState('60')
  const [sides, setSides] = useState(['front', 'side', 'back'])

  const chosen = LEVELS.find((l) => l.key === level)
  const sidesTotal = SIDES.filter((s) => sides.includes(s.key)).reduce((t, s) => t + s.price, 0)
  // The film sets the base; the sides chosen scale what it costs to fit.
  const total = sides.length ? Math.round(chosen.price * 0.5 + sidesTotal) : 0

  function toggleSide(key) {
    setSides((cur) => (cur.includes(key) ? cur.filter((k) => k !== key) : [...cur, key]))
  }

  return (
    <ScreenHeader title="Window shading" subtitle="Nano-ceramic film, fitted at your address" onBack={onBack}>
      <div className="flex grow flex-col pt-1">
        {vehicles.length > 0 && (
          <>
            <p className="text-[13px] font-medium text-setl-ink-3">Your vehicle</p>
            <div className="mt-2 flex gap-2">
              {vehicles.map((v) => (
                <button
                  key={v.id}
                  type="button"
                  onClick={() => setVehicle(v.id)}
                  className={`shadow-card-sm flex-1 cursor-pointer rounded-[11px] border bg-white p-3 text-left ${
                    vehicle === v.id ? 'border-setl-violet' : 'border-setl-line'
                  }`}
                >
                  <CarBrand name={v.name} color={v.color} className="h-6 w-6" />
                  <span className="mt-2 block truncate text-[13px] text-setl-ink">{v.name}</span>
                  <span className="block text-[11px] text-setl-muted">{v.plate}</span>
                </button>
              ))}
            </div>
          </>
        )}

        <p className="mt-5 text-[13px] font-medium text-setl-ink-3">Window tint level</p>
        <div className="mt-2 flex gap-2">
          {LEVELS.map((l) => (
            <button
              key={l.key}
              type="button"
              onClick={() => setLevel(l.key)}
              className={`shadow-card-sm flex-1 cursor-pointer rounded-[11px] border bg-white p-3 text-left ${
                level === l.key ? 'border-setl-violet' : 'border-setl-line'
              }`}
            >
              <span className="block text-[17px] font-semibold text-setl-ink">{l.label}</span>
              <span className="block text-[11px] text-setl-muted">{l.heat}% heat rejection</span>
            </button>
          ))}
        </div>

        <p className="mt-5 text-[13px] font-medium text-setl-ink-3">Tinting sides</p>
        <div className="mt-2 flex gap-2">
          {SIDES.map((s) => {
            const on = sides.includes(s.key)
            return (
              <button
                key={s.key}
                type="button"
                onClick={() => toggleSide(s.key)}
                className={`flex-1 cursor-pointer rounded-[11px] border-[0.5px] bg-white py-2.5 text-[12px] ${
                  on ? 'border-setl-violet text-setl-violet' : 'border-setl-line-2 text-setl-muted-2'
                }`}
              >
                {s.label}
              </button>
            )
          })}
        </div>

        <div className="mt-5 rounded-[11px] bg-setl-surface-3 p-4">
          <div className="flex items-center justify-between">
            <span className="text-[12px] text-setl-ink-3">Heat rejection</span>
            <span className="text-[13px] font-medium text-setl-ink">{chosen.heat}%</span>
          </div>
          <div className="mt-2 h-1.5 rounded-full bg-white">
            <div className="h-full rounded-full bg-setl-violet" style={{ width: `${chosen.heat}%` }} />
          </div>
          <p className="mt-3 text-[11px] text-setl-muted">
            Nano-ceramic film with a lifetime warranty against bubbling and fading.
          </p>
        </div>

        <div className="grow" />

        <div className="mb-3 flex items-center justify-between rounded-[11px] bg-white px-4 py-3 shadow-card-sm">
          <span className="text-[12px] text-setl-ink-3">
            {sides.length ? `${chosen.label} film · ${sides.length} ${sides.length === 1 ? 'side' : 'sides'}` : 'Pick at least one side'}
          </span>
          <span className="text-[15px] font-semibold text-setl-violet">AED {total}</span>
        </div>

        <GradientButton disabled={!sides.length} onClick={() => onSearchProviders({ level, sides, total })}>
          Search for providers
        </GradientButton>
      </div>
    </ScreenHeader>
  )
}
