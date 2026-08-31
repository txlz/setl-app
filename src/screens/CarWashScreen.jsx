import ScreenHeader from '../components/ScreenHeader.jsx'
import CarBrand from '../components/CarBrand.jsx'
import GradientButton from '../components/GradientButton.jsx'
import { CAR_SIZES, WASH_PACKAGES, WASH_EXTRAS } from '../data/providers.js'
import carwashImg from '../assets/services/carwash.png'
import carpolishImg from '../assets/services/carpolish.png'

// Package artwork, keyed to the package the customer is choosing.
const PKG_IMG = { basic: carwashImg, premium: carpolishImg }

// Car wash builder from the Figma boards: pick the vehicle (which sets the
// size), a wash package priced by that size, then optional extras.
export default function CarWashScreen({ wash, setWash, vehicles = [], onManageVehicles, onSearchProviders, onBack }) {
  const pkg = WASH_PACKAGES.find((p) => p.key === wash.pkg)
  const base = pkg ? pkg.price[wash.size] : 0
  const extrasTotal = WASH_EXTRAS.filter((e) => wash.extras.includes(e.key)).reduce(
    (sum, e) => sum + e.price,
    0,
  )
  const total = base + extrasTotal

  function toggleExtra(key) {
    setWash({
      ...wash,
      extras: wash.extras.includes(key)
        ? wash.extras.filter((k) => k !== key)
        : [...wash.extras, key],
    })
  }

  return (
    <ScreenHeader title="Take care of your car" subtitle="Pick a package for your vehicle" onBack={onBack}>
      <div className="flex grow flex-col pt-1">
        <div className="relative h-28 overflow-hidden rounded-[15px]">
          <img src={carwashImg} alt="" className="h-full w-full object-cover" />
          <span
            aria-hidden
            className="pointer-events-none absolute inset-0 bg-linear-to-t from-black/60 to-transparent"
          />
        </div>

        {/* Saved vehicles — picking one sets the size */}
        <div className="mt-5 mb-2 flex items-center justify-between">
          <p className="text-xs font-semibold text-setl-ink-3">Your vehicle</p>
          {onManageVehicles && (
            <button
              type="button"
              onClick={onManageVehicles}
              className="cursor-pointer text-xs text-setl-purple underline"
            >
              Manage
            </button>
          )}
        </div>
        {vehicles.length === 0 && (
          <button
            type="button"
            onClick={onManageVehicles}
            className="h-12 w-full cursor-pointer rounded-[11px] border border-dashed border-setl-line-3 text-sm text-setl-ink-3"
          >
            + Add a vehicle
          </button>
        )}
        <div className="flex gap-3 overflow-x-auto no-scrollbar">
          {vehicles.map((v) => {
            const on = wash.vehicle === v.id
            return (
              <button
                key={v.id}
                type="button"
                onClick={() => setWash({ ...wash, vehicle: v.id, size: v.size })}
                className={`shadow-card-sm flex-1 cursor-pointer rounded-[11px] border p-3 text-left transition-colors ${
                  on ? 'border-setl-purple bg-white' : 'border-setl-line bg-white'
                }`}
              >
                <CarBrand name={v.name} color={v.color} className="h-6 w-6" />
                <span className="mt-2 block truncate text-sm text-setl-ink">{v.name}</span>
                <span className="block text-xs text-setl-muted">{v.plate}</span>
              </button>
            )
          })}
        </div>

        {/* Size */}
        <p className="mt-5 mb-2 text-xs font-semibold text-setl-ink-3">Size</p>
        <div className="flex gap-2">
          {CAR_SIZES.map((s) => {
            const on = wash.size === s.key
            return (
              <button
                key={s.key}
                type="button"
                onClick={() => setWash({ ...wash, size: s.key })}
                className={`flex-1 cursor-pointer rounded-[11px] border py-2.5 text-center transition-colors ${
                  on
                    ? 'border-setl-purple bg-setl-purple/5 text-setl-navy'
                    : 'border-setl-line bg-white text-setl-ink-3'
                }`}
              >
                <span className="block text-sm">{s.label}</span>
              </button>
            )
          })}
        </div>
        <p className="mt-1.5 text-xs text-setl-muted">
          {CAR_SIZES.find((s) => s.key === wash.size)?.hint}
        </p>

        {/* Packages */}
        <p className="mt-5 mb-2 text-xs font-semibold text-setl-ink-3">Package</p>
        {WASH_PACKAGES.map((p) => {
          const on = wash.pkg === p.key
          return (
            <button
              key={p.key}
              type="button"
              onClick={() => setWash({ ...wash, pkg: p.key })}
              className={`shadow-card-sm mb-3 w-full cursor-pointer rounded-[11px] border p-4 text-left transition-colors ${
                on ? 'border-setl-purple bg-white' : 'border-setl-line bg-white'
              }`}
            >
              <div className="flex items-start gap-3">
                <img
                  src={PKG_IMG[p.key]}
                  alt=""
                  className="h-14 w-14 shrink-0 rounded-[11px] object-cover"
                />
                <div className="min-w-0 grow">
                  <p className="text-[15px] text-setl-ink">{p.label}</p>
                  <p className="mt-0.5 text-xs text-setl-muted">{p.blurb}</p>
                </div>
                <span className="shrink-0 text-[15px] font-semibold text-setl-navy">
                  AED {p.price[wash.size]}
                </span>
              </div>
            </button>
          )
        })}

        {/* Extras */}
        <p className="mt-2 mb-2 text-xs font-semibold text-setl-ink-3">Add extras</p>
        {WASH_EXTRAS.map((e) => {
          const on = wash.extras.includes(e.key)
          return (
            <button
              key={e.key}
              type="button"
              onClick={() => toggleExtra(e.key)}
              className="row-card mb-2 flex w-full cursor-pointer items-center justify-between px-3 py-2.5 text-left"
            >
              <span className="flex items-center gap-3">
                <span
                  aria-hidden
                  className={`flex h-5 w-5 items-center justify-center rounded-md border text-[11px] text-white transition-colors ${
                    on ? 'border-setl-purple bg-setl-purple' : 'border-setl-line-3 bg-white'
                  }`}
                >
                  {on ? '✓' : ''}
                </span>
                {/* 1.html:1602 — row title 14px / weight 500 on the shared
                    336x55 r11 `.row-card` (1.html:1587). */}
                <span className="text-[14px] font-medium text-setl-ink">{e.label}</span>
              </span>
              {/* 1.html:1594 — row meta 11px / weight 400, dim ink. */}
              <span className="text-[11px] font-normal text-setl-ink-3">+ AED {e.price}</span>
            </button>
          )
        })}

        <div className="grow" />

        <div className="shadow-card mt-5 mb-3 flex items-center justify-between rounded-[15px] bg-white px-4 py-3">
          <span className="text-sm text-setl-ink-3">Total</span>
          <span className="text-[15px] font-semibold text-setl-navy">AED {total}</span>
        </div>

        <GradientButton onClick={onSearchProviders} disabled={!pkg}>
          Search for providers
        </GradientButton>
      </div>
    </ScreenHeader>
  )
}
