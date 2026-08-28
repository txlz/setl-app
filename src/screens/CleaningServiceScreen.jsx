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
        {/* No artboard counterpart (app-only retention card) — uses house card
            geometry: 1.html:1587 white card (336x55, radius 11, 0 0 13px rgba(0,0,0,.05)). */}
        {favorite && (
          <div className="mb-5 rounded-[16px] bg-white p-4 shadow-card-sm">
            <p className="text-[11px] font-medium text-setl-violet">Your regular cleaner</p>
            <div className="mt-2 flex items-center gap-3">
              <button
                type="button"
                onClick={() => onOpenProfile?.(favorite)}
                className="flex min-w-0 grow cursor-pointer items-center gap-3 text-left"
              >
                <div
                  className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full text-[15px] font-bold text-white"
                  style={{ background: favorite.color }}
                >
                  {favorite.name[0].toUpperCase()}
                </div>
                <div className="min-w-0 grow">
                  {/* 1.html:1602 — row title 14px/500 rgba(0,0,0,.95); :1594 meta 11px/400 */}
                  <p className="truncate text-[14px] font-medium text-setl-ink">{favorite.name}</p>
                  <p className="text-[11px] text-setl-muted">
                    ★ {favorite.rating} · {favorite.bookingFee} AED/hr · View profile
                  </p>
                </div>
              </button>
              <button
                type="button"
                onClick={onClearFavorite}
                className="shrink-0 cursor-pointer text-[11px] text-setl-muted underline"
              >
                Remove
              </button>
            </div>
            {/* 1.html:1583 — in-card CTA is radius 12, ~44px tall, label 14px/500 white */}
            <button
              type="button"
              onClick={() => setRebooking(true)}
              className="mt-3 h-11 w-full cursor-pointer rounded-[12px] brand-hero text-sm font-medium text-white active:opacity-90"
            >
              Book {favorite.name.split(' ')[0]} again · {hours} {hours === 1 ? 'hr' : 'hrs'}
            </button>
          </div>
        )}

        {/* 1.html:1343 — hero banner is 321.73x111 at radius 15 */}
        <div className="relative h-[111px] overflow-hidden rounded-[15px]">
          <img src={cleaningImg} alt="" className="h-full w-full object-cover" />
          <span
            aria-hidden
            className="pointer-events-none absolute inset-0 bg-linear-to-t from-black/60 to-transparent"
          />
        </div>

        {/* 4.js:982 — "how many hours do you need your professional to stay ?"
            13px/500 #0D0000 on the cleaning board (4.js:838). Its one 14px is the
            centred screen title, not this in-content label. */}
        <div className="mt-4 flex items-center justify-between rounded-[11px] border border-setl-line bg-white p-4">
          <p className="text-[13px] font-medium text-setl-ink">Hours of cleaning</p>
          <div className="flex items-center gap-1.5">
            {/* 5.js:81 — #F3F3F3 plate, radius 9; 4.js:594 — numerals 15px/400 */}
            <button
              type="button"
              aria-label="decrease"
              onClick={() => setHours(Math.max(MIN_HOURS, hours - 1))}
              className="h-10 w-10 cursor-pointer rounded-[9px] bg-setl-surface-3 text-[15px] text-setl-ink-3 transition-transform duration-100 active:scale-95"
            >
              −
            </button>
            <span className="flex h-10 w-10 items-center justify-center rounded-[9px] border border-setl-violet text-[15px] text-setl-ink">
              {hours}
            </span>
            <button
              type="button"
              aria-label="increase"
              onClick={() => setHours(Math.min(MAX_HOURS, hours + 1))}
              className="h-10 w-10 cursor-pointer rounded-[9px] bg-setl-surface-3 text-[15px] text-setl-ink-3 transition-transform duration-100 active:scale-95"
            >
              +
            </button>
          </div>
        </div>

        {/* 5.js:269 — descriptive copy is 11px/400 on the boards */}
        <p className="mt-3 text-[11px] leading-[15.4px] text-setl-muted">
          Most 1-bedroom homes take 2–3 hours; villas usually need 4+. You pay the provider&apos;s
          hourly rate × hours, after the work is done.
        </p>

        {/* Specific jobs on top of the hourly rate (from the Figma boards) */}
        {setExtras && (
          <section className="mt-6">
            {/* 1.html:1555 "best home cleaning shops" — section heads are 15px/500 black */}
            <h3 className="text-[15px] font-medium text-setl-ink">Add specific jobs</h3>
            <p className="mt-0.5 text-[11px] text-setl-muted">
              Optional — added to the hourly rate at checkout.
            </p>

            {CLEANING_GROUPS.map((group) => (
              <div key={group.key} className="mt-4">
                {/* 4.js:982 — the cleaning board runs 13px/500 for its content labels. */}
                <p className="mb-2 text-[13px] font-medium text-setl-ink-3">{group.title}</p>
                {group.items.map((item) => {
                  const qty = extras[item.key] ?? 0
                  return (
                    <div
                      key={item.key}
                      className="row-card mb-2 flex items-center justify-between gap-2 px-3 py-2.5"
                    >
                      {/* 1.html:1602 — row title 14px/500 rgba(0,0,0,.95); :1594 meta 11px/400 */}
                      <div className="min-w-0 pr-2">
                        <p className="text-[14px] leading-tight font-medium text-setl-ink">
                          {item.label}
                        </p>
                        <p className="text-[11px] text-setl-muted">
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
                          className="h-9 w-9 cursor-pointer rounded-[9px] bg-setl-surface-3 text-[15px] text-setl-ink-3 active:scale-95"
                        >
                          −
                        </button>
                        <span className="flex h-9 w-9 items-center justify-center rounded-[9px] border border-setl-violet text-[15px] text-setl-ink">
                          {qty}
                        </span>
                        <button
                          type="button"
                          aria-label={`increase ${item.label}`}
                          onClick={() => setExtras({ ...extras, [item.key]: Math.min(20, qty + 1) })}
                          className="h-9 w-9 cursor-pointer rounded-[9px] bg-setl-surface-3 text-[15px] text-setl-ink-3 active:scale-95"
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
