import GradientButton from '../components/GradientButton.jsx'
import { orderAction } from '../data/orders.js'

const STATUS_STYLES = {
  Scheduled: 'bg-blue-50 text-blue-600',
  'On the way': 'bg-[#EDE4FD] text-setl-purple',
  'In progress': 'bg-[#EDE4FD] text-setl-purple',
  'Estimate ready': 'bg-setl-purple text-white',
  'Repair booked': 'bg-blue-50 text-blue-600',
  Done: 'bg-green-50 text-green-600',
  'Awaiting payment': 'bg-orange-50 text-orange-500',
  'Payment failed': 'bg-red-50 text-red-500',
  Completed: 'bg-green-50 text-green-600',
  Rejected: 'bg-red-50 text-red-500',
  // Cancelled / No-show / Disputed fall through to the gray default
}

// Settled orders can be rated. `orderAction` (the state machine's own helper)
// stays untouched — rating isn't a state change, so it's decided here in the
// list: a paid/closed order with no rating yet offers "Rate".
function listAction(order) {
  const action = orderAction(order) // 'pay' | 'track' | null
  if (action) return action
  if (['paid', 'closed'].includes(order.state) && !order.rating) return 'rate'
  return null
}

export default function OrdersScreen({ orders, onOpenOrder, onReportProblem, onBook }) {
  return (
    <div className="font-poppins flex min-h-screen flex-col bg-[#F5F4F7] px-3 pt-5 pb-24">
      <h1 className="text-center text-[17px] font-semibold text-black">My Orders</h1>

      {orders.length === 0 ? (
        <div className="flex grow flex-col items-center justify-center pb-16">
          <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="#C9C7D1" strokeWidth="1.5">
            <path d="M6 2h12v20l-3-2-3 2-3-2-3 2V2Z" strokeLinejoin="round" />
            <path d="M9 7h6M9 11h6" strokeLinecap="round" />
          </svg>
          <p className="mt-4 font-medium text-black">No orders yet</p>
          <p className="mt-1 text-sm text-setl-muted">Book a service and track it here</p>
          <GradientButton className="mt-8 max-w-56" onClick={onBook}>
            Book a service
          </GradientButton>
        </div>
      ) : (
        <div className="mt-5 flex flex-col gap-3">
          {orders.map((order) => {
            const action = listAction(order) // 'pay' | 'track' | 'rate' | null
            const openable = action !== null
            // Money shown: what was paid once settled, what's due (or the
            // expected cost) before that
            const amount =
              order.state === 'paid' || order.state === 'closed'
                ? order.total
                : (order.amountDue ?? order.total)
            return (
              <div key={order.id} className="flex flex-col">
              <button
                type="button"
                onClick={openable ? () => onOpenOrder(order, action) : undefined}
                className={`flex items-center gap-3 rounded-[11px] bg-white p-3 text-left shadow-[0_2px_8px_rgba(0,0,0,0.06)] ${openable ? 'cursor-pointer' : 'cursor-default'}`}
              >
                <div
                  className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full text-sm font-bold text-white"
                  style={{ background: order.provider.color }}
                >
                  {order.provider.name[0].toUpperCase()}
                </div>
                <div className="min-w-0 grow">
                  <p className="truncate font-semibold text-black">{order.provider.name}</p>
                  <p className="text-xs text-setl-muted">
                    {order.service} · {order.date.day} {order.date.num}, {order.time}
                  </p>
                  <span
                    className={`mt-1 inline-block rounded-full px-2 py-0.5 text-[11px] font-medium ${STATUS_STYLES[order.status] ?? 'bg-setl-surface-3 text-setl-ink-3'}`}
                  >
                    {order.status}
                  </span>
                </div>
                <div className="flex shrink-0 flex-col items-end gap-1">
                  <span className="text-sm font-semibold text-black">{amount} AED</span>
                  {action === 'pay' && (
                    <span className="text-[11px] font-medium text-setl-purple">Pay now</span>
                  )}
                  {action === 'rate' && (
                    <span className="text-[11px] font-medium text-setl-violet">Rate</span>
                  )}
                  {order.rating && (
                    <span className="text-[11px] text-setl-gold">
                      {'★★★★★'.slice(0, order.rating.stars)}
                    </span>
                  )}
                  {openable && (
                    <svg width="8" height="14" viewBox="0 0 10 18" fill="none">
                      <path d="m1 1 7 8-7 8" stroke="#9C9AA5" strokeWidth="2" strokeLinecap="round" />
                    </svg>
                  )}
                </div>
              </button>
              {/* WF-9 — anything already under way can be disputed. */}
              {onReportProblem && !['cancelled_by_customer', 'cancelled_by_provider'].includes(order.state) && (
                <button
                  type="button"
                  onClick={() => onReportProblem(order)}
                  className="mt-1 cursor-pointer self-end text-[11px] text-setl-muted underline"
                >
                  Report a problem
                </button>
              )}
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
