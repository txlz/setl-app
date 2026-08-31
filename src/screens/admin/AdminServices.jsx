import { SERVICES } from '../../data/providers.js'

// The service catalogue every app draws from. Admin sees which flow each
// service uses (inspection-first vs direct) and how it is priced.
export default function AdminServices({ company }) {
  const rows = Object.entries(SERVICES)
  const spServices = company?.services ?? []

  return (
    <div>
      <h1 className="text-[20px] font-semibold">Services</h1>
      <p className="mt-0.5 text-[12px] text-setl-muted">
        {rows.length} services in the catalogue · the demo company offers {spServices.length}.
      </p>

      <section className="mt-5 rounded-[16px] bg-white p-5 shadow-card">
        <table className="w-full text-left text-[12px]">
          <thead className="text-[11px] text-setl-muted">
            <tr><th className="py-1.5">Service</th><th>Flow</th><th>Pricing</th><th>Inspection fee</th><th>Offered by demo SP</th></tr>
          </thead>
          <tbody>
            {rows.map(([key, s]) => (
              <tr key={key} className="border-t border-setl-line">
                <td className="py-2.5 font-medium">{s.label ?? key}</td>
                <td>
                  <span className={`rounded-[4px] px-2 py-0.5 text-[10px] ${s.requiresInspection ? 'bg-setl-violet/12 text-setl-violet' : 'bg-setl-blue/12 text-setl-blue'}`}>
                    {s.requiresInspection ? 'Inspection first' : 'Direct booking'}
                  </span>
                </td>
                <td className="text-setl-ink-3">{s.pricingModel === 'hourly' ? 'Per hour' : s.pricingModel === 'estimate' ? 'Estimate' : 'Fixed'}</td>
                <td className="text-setl-ink-3">{s.standardInspectionFee ? `${s.standardInspectionFee} AED` : '—'}</td>
                <td className="text-setl-muted-2">{spServices.includes(s.label ?? key) ? 'Yes' : '—'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </div>
  )
}
