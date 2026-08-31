import { liveStats, MONTHLY, bucketOf, orderRow } from '../../data/admin.js'

function Stat({ label, value, sub, accent }) {
  return (
    <div className="grow rounded-[16px] bg-white p-5 shadow-card">
      <p className="text-[12px] text-setl-muted">{label}</p>
      <p className="mt-1 text-[26px] font-semibold" style={{ color: accent }}>{value}</p>
      {sub && <p className="mt-1 text-[11px] text-setl-muted-2">{sub}</p>}
    </div>
  )
}

// Income vs costs, drawn as plain SVG so the panel pulls in no chart library.
function IncomeChart() {
  const w = 560, h = 190, pad = 28
  const max = Math.max(...MONTHLY.map((m) => m.income)) * 1.1
  const x = (i) => pad + (i * (w - pad * 2)) / (MONTHLY.length - 1)
  const y = (v) => h - pad - (v / max) * (h - pad * 2)
  const line = (key) => MONTHLY.map((m, i) => `${i ? 'L' : 'M'}${x(i)},${y(m[key])}`).join(' ')

  return (
    <svg viewBox={`0 0 ${w} ${h}`} className="w-full">
      {[0.25, 0.5, 0.75, 1].map((f) => (
        <line key={f} x1={pad} x2={w - pad} y1={y(max * f)} y2={y(max * f)} stroke="#EBEBEB" strokeWidth="1" />
      ))}
      <path d={line('income')} fill="none" stroke="#7E43FF" strokeWidth="2.5" strokeLinecap="round" />
      <path d={line('costs')} fill="none" stroke="#FFA800" strokeWidth="2.5" strokeLinecap="round" />
      {MONTHLY.map((m, i) => (
        <text key={m.m} x={x(i)} y={h - 8} textAnchor="middle" fontSize="10" fill="#8D8D8D">{m.m}</text>
      ))}
    </svg>
  )
}

export default function AdminDashboard({ orders, onOpenOrders }) {
  const s = liveStats(orders)
  const rows = orders.map(orderRow).slice(-6).reverse()

  return (
    <div>
      <h1 className="text-[20px] font-semibold">Dashboard</h1>
      <p className="mt-0.5 text-[12px] text-setl-muted">
        Platform totals include {s.liveOrders} order{s.liveOrders === 1 ? '' : 's'} placed in this session.
      </p>

      <div className="mt-5 flex gap-4">
        <Stat label="Total users" value={s.users.toLocaleString()} accent="#7E43FF" />
        <Stat label="Total orders" value={s.orders.toLocaleString()} sub={`+${s.liveOrders} live`} accent="#366EE9" />
        <Stat label="Total sales" value={`${s.salesAED.toLocaleString()} AED`} sub={`+${s.liveTakings} AED live`} accent="#25B43D" />
      </div>

      <div className="mt-5 flex gap-4">
        <section className="grow rounded-[16px] bg-white p-5 shadow-card">
          <h2 className="text-[14px] font-medium">Income vs Costs</h2>
          <div className="mt-1 flex gap-4 text-[11px]">
            <span className="flex items-center gap-1.5"><i className="h-2 w-2 rounded-full bg-setl-violet" />Income</span>
            <span className="flex items-center gap-1.5"><i className="h-2 w-2 rounded-full bg-setl-gold" />Costs</span>
          </div>
          <IncomeChart />
        </section>

        <section className="w-[300px] shrink-0 rounded-[16px] bg-white p-5 shadow-card">
          <h2 className="text-[14px] font-medium">Order mix</h2>
          <div className="mt-3 flex flex-col gap-2">
            {['Done', 'Active', 'Pending', 'Cancelled'].map((b) => {
              const n = orders.filter((o) => bucketOf(o) === b).length
              const pct = orders.length ? Math.round((n / orders.length) * 100) : 0
              return (
                <div key={b}>
                  <div className="flex justify-between text-[11px]">
                    <span className="text-setl-ink-3">{b}</span>
                    <span className="text-setl-muted">{n}</span>
                  </div>
                  <div className="mt-1 h-1.5 rounded-full bg-setl-surface-3">
                    <div className="h-full rounded-full bg-setl-violet" style={{ width: `${pct}%` }} />
                  </div>
                </div>
              )
            })}
          </div>
        </section>
      </div>

      <section className="mt-5 rounded-[16px] bg-white p-5 shadow-card">
        <div className="flex items-center justify-between">
          <h2 className="text-[14px] font-medium">Recent Operations</h2>
          <button type="button" onClick={onOpenOrders} className="cursor-pointer text-[11px] text-setl-violet underline">
            View all orders
          </button>
        </div>
        {rows.length === 0 ? (
          <p className="mt-4 text-[12px] text-setl-muted">
            No live orders yet — book one in the customer app and it appears here.
          </p>
        ) : (
          <table className="mt-3 w-full text-left text-[12px]">
            <thead className="text-[11px] text-setl-muted">
              <tr><th className="py-1.5">#</th><th>Service</th><th>Provider</th><th>Worker</th><th>Status</th><th className="text-right">Amount</th></tr>
            </thead>
            <tbody>
              {rows.map((r) => (
                <tr key={r.id} className="border-t border-setl-line">
                  <td className="py-2 text-setl-muted">{r.id}</td>
                  <td className="font-medium">{r.service}</td>
                  <td className="text-setl-ink-3">{r.provider}</td>
                  <td className="text-setl-ink-3">{r.worker ?? '—'}</td>
                  <td><span className="rounded-[4px] bg-setl-surface-3 px-2 py-0.5 text-[10px]">{r.status}</span></td>
                  <td className="text-right">{r.amount} AED</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </section>
    </div>
  )
}
