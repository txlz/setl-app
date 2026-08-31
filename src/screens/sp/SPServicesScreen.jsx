import { useEffect, useState } from 'react'
import GradientHeader from '../../components/GradientHeader.jsx'
import { defaultTasksFor } from '../../data/providers.js'

const GRADS = {
  'Network Technician': 'linear-gradient(135deg,#C9A54B,#7A5E1E)',
  'Smart Home Installation': 'linear-gradient(135deg,#8AA8C8,#4A6785)',
  Plumber: 'linear-gradient(135deg,#4A7FB5,#1E3D5C)',
  'Car Cleaning': 'linear-gradient(135deg,#4B5A68,#1D242B)',
  'Pest Control': 'linear-gradient(135deg,#B5533C,#6E2A1B)',
  Electrician: 'linear-gradient(135deg,#B58A3C,#5C4415)',
}

// The services the company offers and the price of each real job it does.
// Pricing is per trade (the actual jobs), not abstract difficulty tiers: the
// SP tweaks the seeded defaults, adds/removes jobs, and it saves as they go.
export default function SPServicesScreen({ company, onUpdatePricing, onAddService, onOpenProducts, onBack }) {
  const services = company.services ?? []
  const pricing = company.servicePricing ?? {}
  const [adding, setAdding] = useState({}) // { [service]: { label, price } }

  // Seed any offered service that doesn't have a price list yet (e.g. a
  // company saved before per-service pricing existed).
  useEffect(() => {
    services.forEach((s) => {
      if (!pricing[s]) onUpdatePricing(s, defaultTasksFor(s))
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  function setPrice(service, i, value) {
    const tasks = (pricing[service] ?? defaultTasksFor(service)).map((t, j) =>
      j === i ? { ...t, price: value.replace(/\D/g, '') } : t,
    )
    onUpdatePricing(service, tasks)
  }

  function removeTask(service, i) {
    onUpdatePricing(service, (pricing[service] ?? []).filter((_, j) => j !== i))
  }

  function addTask(service) {
    const draft = adding[service]
    if (!draft?.label?.trim() || !draft?.price) return
    onUpdatePricing(service, [
      ...(pricing[service] ?? []),
      { label: draft.label.trim(), price: draft.price },
    ])
    setAdding((a) => ({ ...a, [service]: { label: '', price: '' } }))
  }

  return (
    <GradientHeader title="Services & pricing" onBack={onBack} sheetClassName="bg-[#F5F4F7]">
      <div className="font-poppins flex grow flex-col px-4 pb-24">
        {/* Catalogue actions (WF-7): a full add-service form and the
            recommended products a job may need. */}
        {(onAddService || onOpenProducts) && (
          <div className="mt-3 flex gap-2">
            {onAddService && (
              <button
                type="button"
                onClick={onAddService}
                className="brand-hero grow cursor-pointer rounded-[11px] py-2.5 text-[13px] font-medium text-white"
              >
                + Add service
              </button>
            )}
            {onOpenProducts && (
              <button
                type="button"
                onClick={onOpenProducts}
                className="grow cursor-pointer rounded-[11px] border-[0.5px] border-setl-violet bg-white py-2.5 text-[13px] font-medium text-setl-violet"
              >
                Products
              </button>
            )}
          </div>
        )}

        {services.length === 0 && (
          <p className="mt-2 rounded-[15px] bg-white p-5 text-center text-sm text-setl-muted shadow-[0_2px_8px_rgba(0,0,0,0.06)]">
            No services yet.
          </p>
        )}

        {services.map((service) => {
          const tasks = pricing[service] ?? defaultTasksFor(service)
          const draft = adding[service] ?? { label: '', price: '' }
          return (
            <section key={service} className="mt-3">
              <div className="relative h-24 overflow-hidden rounded-[15px]" style={{ background: GRADS[service] ?? 'linear-gradient(135deg,#8442FF,#C05CF7)' }}>
                <span className="absolute inset-x-0 bottom-0 bg-black/40 px-3 py-2 text-sm font-medium text-white">{service}</span>
              </div>

              <p className="mt-3 mb-1.5 px-1 text-xs font-semibold text-setl-ink-3">Job prices</p>
              {/* Service card on the SP "Services" tab board is white at radius 20
                  (5.js:268, 324x95) — not the app's generic 15. */}
              <div className="rounded-[20px] bg-white p-2 shadow-[0_2px_8px_rgba(0,0,0,0.06)]">
                {tasks.map((t, i) => (
                  <div key={`${t.label}-${i}`} className="flex items-center gap-2 border-b border-gray-50 px-2 py-2 last:border-0">
                    {/* Row title 12/500 #0D0000 (5.js:300 "rooms cleaning") */}
                    <span className="grow text-[12px] font-medium text-setl-ink">{t.label}</span>
                    {/* Board's field fill: rgba(217,217,217,.28) at radius 5
                        (5.js:1497). Price reads 12px/700 (5.js:270 "63.4 SA"). */}
                    <div className="flex items-center gap-1 rounded-[5px] bg-[rgba(217,217,217,0.28)] px-2 py-1">
                      <input
                        value={t.price}
                        onChange={(e) => setPrice(service, i, e.target.value)}
                        inputMode="numeric"
                        aria-label={`Price for ${t.label}`}
                        className="w-14 bg-transparent text-right text-[12px] font-bold text-black outline-none"
                      />
                      <span className="text-[11px] text-setl-muted">AED</span>
                    </div>
                    {/* Row action chip: 24x24 r2 on #D9D9D9 @23% with #FF4343 ink
                        (5.js:271-277 — the delete chip on the services board). */}
                    <button
                      type="button"
                      onClick={() => removeTask(service, i)}
                      aria-label={`Remove ${t.label}`}
                      className="flex h-6 w-6 shrink-0 cursor-pointer items-center justify-center rounded-[2px] bg-[rgba(217,217,217,0.23)] text-setl-red active:bg-[rgba(217,217,217,0.4)]"
                    >
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M6 6l12 12M18 6 6 18" /></svg>
                    </button>
                  </div>
                ))}

                {/* Add a custom job. Same field spec as the "Add Services" form
                    board: rgba(217,217,217,.28) at radius 5 (5.js:1497), with the
                    board's 12px/500 field ink (5.js:408 "12$"). */}
                <div className="mt-1 flex items-center gap-2 rounded-[5px] bg-[rgba(217,217,217,0.28)] px-2 py-2">
                  <input
                    value={draft.label}
                    onChange={(e) => setAdding((a) => ({ ...a, [service]: { ...draft, label: e.target.value } }))}
                    placeholder="Add a job"
                    className="grow bg-transparent text-[12px] font-medium text-black outline-none placeholder:text-setl-muted"
                  />
                  <input
                    value={draft.price}
                    onChange={(e) => setAdding((a) => ({ ...a, [service]: { ...draft, price: e.target.value.replace(/\D/g, '') } }))}
                    inputMode="numeric"
                    placeholder="AED"
                    className="w-14 bg-transparent text-right text-[12px] font-medium text-black outline-none placeholder:text-setl-muted"
                  />
                  {/* The board's send/confirm fill is #7E43FF (5.js:424) */}
                  <button
                    type="button"
                    onClick={() => addTask(service)}
                    disabled={!draft.label?.trim() || !draft.price}
                    aria-label="Add job"
                    className="flex h-6 w-6 shrink-0 cursor-pointer items-center justify-center rounded-[2px] bg-setl-violet text-white active:opacity-90 disabled:opacity-40"
                  >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round"><path d="M12 5v14M5 12h14" /></svg>
                  </button>
                </div>
              </div>
            </section>
          )
        })}
      </div>
    </GradientHeader>
  )
}
