import { useState } from 'react'
import ScreenHeader from '../components/ScreenHeader.jsx'
import GradientButton from '../components/GradientButton.jsx'
import DateTimeSheet from '../components/DateTimeSheet.jsx'
import { CLEANING_GROUPS } from '../data/providers.js'
import cleaningImg from '../assets/services/cleaning-wide.png'

const MIN_HOURS = 1
const MAX_HOURS = 8

// Hours-needed picker for hourly services (Phase 2, category 1).
// Providers charge per hour; the total is rate x hours at checkout.
// If the customer has set a regular cleaner, she shows up top for one-tap
// rebooking (the retention loop — "book your regular").
export default function CleaningServiceScreen({
  hours,
  setHours,
  extras = {},
  setExtras,
  favorite,
  onRebook,
  onClearFavorite,
  onOpenProfile,
  onSearchProviders,
  onBack,
}) {
  const [rebooking, setRebooking] = useState(false) // date sheet for the regular

  return (
    <ScreenHeader title="House cleaning" subtitle="How many hours do you need?" onBack={onBack}>
      <div className="flex grow flex-col pt-1">
        {/* Your regular cleaner (retention loop) */}
        {favorite && (
          <div className="mb-5 rounded-2xl bg-white p-4 shadow-[0_2px_8px_rgba(0,0,0,0.08)]">
            <p className="text-xs font-medium text-setl-purple">Your regular cleaner</p>
            <div className="mt-2 flex items-center gap-3">
              <button
                type="button"
                onClick={() => onOpenProfile?.(favorite)}
                className="flex min-w-0 grow cursor-pointer items-center gap-3 text-left"
              >
                <div
                  className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full text-lg font-bold text-white"
                  style={{ background: favorite.color }}
                >
                  {favorite.name[0].toUpperCase()}
                </div>
                <div className="min-w-0 grow">
                  <p className="truncate font-semibold text-black">{favorite.name}</p>
                  <p className="text-xs text-setl-muted">
                    ★ {favorite.rating} · {favorite.bookingFee} AED/hr · View profile
                  </p>
                </div>
              </button>
              <button
                type="button"
                onClick={onClearFavorite}
                className="shrink-0 cursor-pointer text-xs text-setl-muted underline"
              >
                Remove
              </button>
            </div>
            <button
              type="button"
              onClick={() => setRebooking(true)}
              className="mt-3 h-11 w-full cursor-pointer rounded-full bg-linear-[270deg,#366EE9_-95.36%,#F15CFA_212.48%] text-sm font-medium text-white active:opacity-90"
            >
              Book {favorite.name.split(' ')[0]} again · {hours} {hours === 1 ? 'hr' : 'hrs'}
            </button>
          </div>
        )}

        <div className="relative h-24 overflow-hidden rounded-2xl">
          <img src={cleaningImg} alt="" className="h-full w-full object-cover" />
          <span
            aria-hidden
            className="pointer-events-none absolute inset-0 bg-linear-to-t from-black/60 to-transparent"
          />
        </div>

        <div className="mt-4 flex items-center justify-between rounded-lg border border-setl-line bg-white p-4">
          <p className="text-[15px] text-black">Hours of cleaning</p>
          <div className="flex items-center gap-1.5">
            <button
              type="button"
              aria-label="decrease"
              onClick={() => setHours(Math.max(MIN_HOURS, hours - 1))}
              className="h-10 w-10 cursor-pointer rounded-md bg-setl-surface-3 text-lg text-setl-ink-3 transition-transform duration-100 active:scale-95"
            >
              −
            </button>
            <span className="flex h-10 w-10 items-center justify-center rounded-md border border-setl-purple text-[15px] text-black">
              {hours}
            </span>
            <button
              type="button"
              aria-label="increase"
              onClick={() => setHours(Math.min(MAX_HOURS, hours + 1))}
              className="h-10 w-10 cursor-pointer rounded-md bg-setl-surface-3 text-lg text-setl-ink-3 transition-transform duration-100 active:scale-95"
            >
              +
            </button>
          </div>
        </div>

        <p className="mt-3 text-xs text-setl-muted">
          Most 1-bedroom homes take 2–3 hours; villas usually need 4+. You pay the provider&apos;s
          hourly rate × hours, after the work is done.
        </p>

        {/* Specific jobs on top of the hourly rate (from the Figma boards) */}
        {setExtras && (
          <section className="mt-6">
            <h3 className="text-lg font-semibold text-setl-navy">Add specific jobs</h3>
            <p className="mt-0.5 text-xs text-setl-muted">
              Optional — added to the hourly rate at checkout.
            </p>

            {CLEANING_GROUPS.map((group) => (
              <div key={group.key} className="mt-4">
                <p className="mb-2 text-xs font-semibold text-setl-ink-3">{group.title}</p>
                {group.items.map((item) => {
                  const qty = extras[item.key] ?? 0
                  return (
                    <div
                      key={item.key}
                      className="row-card mb-2 flex items-center justify-between gap-2 px-3 py-2.5"
                    >
                      <div className="min-w-0 pr-2">
                        <p className="text-sm leading-tight text-setl-ink">{item.label}</p>
                        <p className="text-xs text-setl-muted">
                          AED {item.price} / {item.unit}
                        </p>
                      </div>
                      <div className="flex shrink-0 items-center gap-1">
                        <button
                          type="button"
                          aria-label={`decrease ${item.label}`}
                          onClick={() =>
                            setExtras({ ...extras, [item.key]: Math.max(0, qty - 1) })
                          }
                          className="h-9 w-9 cursor-pointer rounded-md bg-setl-surface-3 text-lg text-setl-ink-3 active:scale-95"
                        >
                          −
                        </button>
                        <span className="flex h-9 w-9 items-center justify-center rounded-md border border-setl-purple text-sm text-setl-ink">
                          {qty}
                        </span>
                        <button
                          type="button"
                          aria-label={`increase ${item.label}`}
                          onClick={() => setExtras({ ...extras, [item.key]: Math.min(20, qty + 1) })}
                          className="h-9 w-9 cursor-pointer rounded-md bg-setl-surface-3 text-lg text-setl-ink-3 active:scale-95"
                        >
                          +
                        </button>
                      </div>
                    </div>
                  )
                })}
              </div>
            ))}
          </section>
        )}

        <div className="grow" />

        <GradientButton onClick={onSearchProviders}>
          {favorite ? 'See other cleaners' : 'Search for providers'}
        </GradientButton>
      </div>

      {rebooking && favorite && (
        <DateTimeSheet
          provider={favorite}
          title="Pick a time"
          onClose={() => setRebooking(false)}
          onConfirm={({ date, time }) => {
            onRebook(favorite, date, time)
            setRebooking(false)
          }}
        />
      )}
    </ScreenHeader>
  )
}
