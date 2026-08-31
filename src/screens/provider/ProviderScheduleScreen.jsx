import ScreenHeader from '../../components/ScreenHeader.jsx'
import { statusLabel } from '../../data/orders.js'

// The worker's day (WF-8, "Schedule"). Jobs are laid out on an hour rail so
// the shape of the day reads at a glance — this is the same order list the
// rest of the app uses, grouped by the slot the customer booked.
const HOURS = ['8am', '10am', '12pm', '2pm', '4pm', '6pm', '8pm']

function slotHour(time = '') {
  const m = time.match(/(\d{1,2})(?::(\d{2}))?\s*(am|pm)/i)
  if (!m) return null
  let h = Number(m[1]) % 12
  if (/pm/i.test(m[3])) h += 12
  return h
}

export default function ProviderScheduleScreen({ orders = [], onOpenOrder, onBack }) {
  const today = orders.filter((o) => !['paid', 'closed'].includes(o.state))

  return (
    <ScreenHeader title="Your day" subtitle={`${today.length} scheduled`} onBack={onBack}>
      <div className="flex grow flex-col pt-1">
        {today.length === 0 && (
          <p className="mt-8 text-center text-[12px] text-setl-muted">
            Nothing booked. New requests appear here once the company assigns them.
          </p>
        )}

        {HOURS.map((label, i) => {
          const from = 8 + i * 2
          const inSlot = today.filter((o) => {
            const h = slotHour(o.time)
            return h !== null && h >= from && h < from + 2
          })
          return (
            <div key={label} className="flex gap-3">
              <span className="w-[42px] shrink-0 pt-2 text-right text-[11px] text-setl-muted">
                {label}
              </span>
              <div className="grow border-l border-setl-line pb-2 pl-3">
                {inSlot.length === 0 ? (
                  <div className="h-8" />
                ) : (
                  inSlot.map((o) => (
                    <button
                      key={o.id}
                      type="button"
                      onClick={() => onOpenOrder?.(o)}
                      className="row-card mb-2 flex w-full cursor-pointer items-center gap-3 px-3 py-2 text-left"
                    >
                      <span
                        aria-hidden
                        className="h-8 w-1 shrink-0 rounded-full"
                        style={{ background: o.provider?.color ?? '#7E43FF' }}
                      />
                      <span className="min-w-0 grow">
                        <span className="block truncate text-[14px] font-medium text-setl-ink">
                          {o.service}
                        </span>
                        <span className="block text-[11px] text-setl-muted">
                          {o.time} · {statusLabel(o.state)}
                        </span>
                      </span>
                    </button>
                  ))
                )}
              </div>
            </div>
          )
        })}
      </div>
    </ScreenHeader>
  )
}
