import { useState } from 'react'
import { ORDER_BUCKETS, orderRow } from '../../data/admin.js'
import { statusLabel, canTransition } from '../../data/orders.js'

// Every order in the platform, filtered by the four buckets from the design
// doc. Rows come from the same store the customer/worker apps write, so this
// is a live view rather than a mock table.
export default function AdminOrders({ orders, onUpdateOrder }) {
  const [bucket, setBucket] = useState('All')
  const [openId, setOpenId] = useState(null)

  const rows = orders.map(orderRow)
  const shown = bucket === 'All' ? rows : rows.filter((r) => r.bucket === bucket)
  const open = rows.find((r) => r.id === openId) ?? null

  return (
    <div>
      <h1 className="text-[20px] font-semibold">Orders</h1>

      <div className="mt-4 flex gap-2">
        {['All', ...ORDER_BUCKETS].map((b) => {
          const n = b === 'All' ? rows.length : rows.filter((r) => r.bucket === b).length
          return (
            <button
              key={b}
              type="button"
              onClick={() => setBucket(b)}
              className={`cursor-pointer rounded-[9px] px-3 py-1.5 text-[12px] transition-colors ${
                bucket === b ? 'bg-setl-violet text-white' : 'bg-white text-setl-ink-3 shadow-card-sm'
              }`}
            >
              {b} <span className="opacity-60">{n}</span>
            </button>
          )
        })}
      </div>

      <div className="mt-4 flex gap-4">
        <section className="grow rounded-[16px] bg-white p-5 shadow-card">
          {shown.length === 0 ? (
            <p className="text-[12px] text-setl-muted">
              Nothing in this bucket yet. Book an order in the customer app to populate it.
            </p>
          ) : (
            <table className="w-full text-left text-[12px]">
              <thead className="text-[11px] text-setl-muted">
                <tr><th className="py-1.5">#</th><th>Service</th><th>Customer</th><th>Provider</th><th>When</th><th>Status</th><th className="text-right">Amount</th></tr>
              </thead>
              <tbody>
                {shown.map((r) => (
                  <tr
                    key={r.id}
                    onClick={() => setOpenId(r.id)}
                    className={`cursor-pointer border-t border-setl-line hover:bg-setl-surface-2 ${openId === r.id ? 'bg-setl-surface-2' : ''}`}
                  >
                    <td className="py-2 text-setl-muted">{r.id}</td>
                    <td className="font-medium">{r.service}</td>
                    <td className="text-setl-ink-3">{r.customer}</td>
                    <td className="text-setl-ink-3">{r.provider}</td>
                    <td className="text-setl-muted-2">{r.when}</td>
                    <td><span className="rounded-[4px] bg-setl-surface-3 px-2 py-0.5 text-[10px]">{r.status}</span></td>
                    <td className="text-right">{r.amount} AED</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </section>

        {open && (
          <aside className="w-[300px] shrink-0 rounded-[16px] bg-white p-5 shadow-card">
            <div className="flex items-start justify-between">
              <h2 className="text-[14px] font-medium">Order #{open.id}</h2>
              <button type="button" onClick={() => setOpenId(null)} className="cursor-pointer text-[16px] text-setl-muted">×</button>
            </div>

            <dl className="mt-3 flex flex-col gap-2 text-[12px]">
              {[
                ['Service', open.service],
                ['Customer', open.customer],
                ['Provider', open.provider],
                ['Worker', open.worker ?? 'Unassigned'],
                ['Scheduled', open.when],
                ['Paid so far', `${open.paid} AED`],
                ['Amount due', `${open.amount} AED`],
              ].map(([k, v]) => (
                <div key={k} className="flex justify-between gap-3">
                  <dt className="text-setl-muted">{k}</dt>
                  <dd className="text-right font-medium">{v}</dd>
                </div>
              ))}
            </dl>

            <h3 className="mt-4 text-[12px] font-medium">Timeline</h3>
            <ol className="mt-2 flex flex-col gap-1.5">
              {open.history.map((h, i) => (
                <li key={i} className="flex gap-2 text-[11px]">
                  <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-setl-violet" />
                  <span className="text-setl-ink-3">{statusLabel(h.state)}</span>
                  {h.meta?.by && (
                    <span className="rounded-[3px] bg-setl-violet/12 px-1.5 text-[10px] text-setl-violet">
                      by {h.meta.by}
                    </span>
                  )}
                  <span className="ml-auto text-setl-muted-2">
                    {new Date(h.at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </li>
              ))}
            </ol>

            {/* Ask the state machine rather than keeping a second list in
                sync with it — transition() throws on a move TRANSITIONS
                forbids, and a job already under way is one of those. */}
            {canTransition(open, 'cancelled_by_provider') && (
              <button
                type="button"
                onClick={() => { onUpdateOrder(open.id, 'cancelled_by_provider', 'Cancelled by admin'); setOpenId(null) }}
                className="mt-4 w-full cursor-pointer rounded-[9px] border border-setl-red px-3 py-2 text-[12px] text-setl-red hover:bg-setl-red/5"
              >
                Cancel this order
              </button>
            )}
          </aside>
        )}
      </div>
    </div>
  )
}
