import { MONTHLY, COST_LINES, liveStats } from '../../data/admin.js'

export default function AdminReports({ orders }) {
  const s = liveStats(orders)
  const last = MONTHLY[MONTHLY.length - 1]
  const margin = Math.round(((last.income - last.costs) / last.income) * 100)

  return (
    <div>
      <h1 className="text-[20px] font-semibold">Reports</h1>
      <p className="mt-0.5 text-[12px] text-setl-muted">Revenue, platform fees and cost structure.</p>

      <div className="mt-5 flex gap-4">
        <div className="grow rounded-[16px] bg-white p-5 shadow-card">
          <p className="text-[12px] text-setl-muted">Revenue (Aug)</p>
          <p className="mt-1 text-[26px] font-semibold text-setl-violet">{last.income.toLocaleString()} AED</p>
        </div>
        <div className="grow rounded-[16px] bg-white p-5 shadow-card">
          <p className="text-[12px] text-setl-muted">Costs (Aug)</p>
          <p className="mt-1 text-[26px] font-semibold text-setl-gold">{last.costs.toLocaleString()} AED</p>
        </div>
        <div className="grow rounded-[16px] bg-white p-5 shadow-card">
          <p className="text-[12px] text-setl-muted">Margin</p>
          <p className="mt-1 text-[26px] font-semibold text-setl-green">{margin}%</p>
        </div>
      </div>

      <div className="mt-5 flex gap-4">
        <section className="grow rounded-[16px] bg-white p-5 shadow-card">
          <h2 className="text-[14px] font-medium">Monthly breakdown</h2>
          <table className="mt-3 w-full text-left text-[12px]">
            <thead className="text-[11px] text-setl-muted">
              <tr><th className="py-1.5">Month</th><th className="text-right">Income</th><th className="text-right">Costs</th><th className="text-right">Net</th></tr>
            </thead>
            <tbody>
              {MONTHLY.map((m) => (
                <tr key={m.m} className="border-t border-setl-line">
                  <td className="py-2">{m.m}</td>
                  <td className="text-right">{m.income.toLocaleString()}</td>
                  <td className="text-right text-setl-muted">{m.costs.toLocaleString()}</td>
                  <td className="text-right font-medium text-setl-green">{(m.income - m.costs).toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>

        <section className="w-[300px] shrink-0 rounded-[16px] bg-white p-5 shadow-card">
          <h2 className="text-[14px] font-medium">Where costs go</h2>
          <div className="mt-3 flex flex-col gap-2.5">
            {COST_LINES.map((c) => (
              <div key={c.label}>
                <div className="flex justify-between text-[11px]">
                  <span className="text-setl-ink-3">{c.label}</span>
                  <span className="text-setl-muted">{c.pct}%</span>
                </div>
                <div className="mt-1 h-1.5 rounded-full bg-setl-surface-3">
                  <div className="h-full rounded-full bg-setl-gold" style={{ width: `${c.pct}%` }} />
                </div>
              </div>
            ))}
          </div>
          <p className="mt-4 text-[11px] text-setl-muted-2">
            This session added {s.liveTakings} AED across {s.liveOrders} order{s.liveOrders === 1 ? '' : 's'}.
          </p>
        </section>
      </div>
    </div>
  )
}
