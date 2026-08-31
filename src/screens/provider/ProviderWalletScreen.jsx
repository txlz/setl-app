import ScreenHeader from '../../components/ScreenHeader.jsx'

// The worker's earnings (WF-8's tail). A worker is paid by their company, not
// by the platform, so this shows what each completed job earned them rather
// than a withdrawable balance — the company settles it.
const WORKER_SHARE = 0.6

export default function ProviderWalletScreen({ orders = [], employee, onBack }) {
  const done = orders.filter((o) => ['work_done', 'awaiting_payment', 'paid', 'closed'].includes(o.state))
  const earned = done.reduce((s, o) => s + Math.round((o.amountDue || o.total || 0) * WORKER_SHARE), 0)

  return (
    <ScreenHeader title="Earnings" subtitle={employee?.name} onBack={onBack}>
      <div className="flex grow flex-col pt-1">
        <div className="brand-hero rounded-[16px] p-5 text-white">
          <p className="text-[12px] text-white/80">Earned this month</p>
          <p className="mt-1 text-[28px] font-semibold">AED {earned}</p>
          <p className="mt-1 text-[11px] text-white/80">
            {done.length} completed {done.length === 1 ? 'job' : 'jobs'} · paid out by your company
          </p>
        </div>

        <p className="mt-5 text-[14px] font-medium text-setl-ink">Completed jobs</p>
        {done.length === 0 ? (
          <p className="mt-3 text-center text-[12px] text-setl-muted">NO records found</p>
        ) : (
          done.map((o) => (
            <div key={o.id} className="row-card mt-3 flex items-center gap-3 px-3">
              <div className="min-w-0 grow">
                <p className="truncate text-[14px] font-medium text-setl-ink">{o.service}</p>
                <p className="text-[11px] text-setl-muted">
                  Order #{o.id} · {o.date?.day ?? ''} {o.time ?? ''}
                </p>
              </div>
              <span className="text-[14px] font-semibold text-setl-green">
                +{Math.round((o.amountDue || o.total || 0) * WORKER_SHARE)}
              </span>
            </div>
          ))
        )}
      </div>
    </ScreenHeader>
  )
}
