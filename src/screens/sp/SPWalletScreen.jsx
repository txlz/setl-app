import GradientHeader from '../../components/GradientHeader.jsx'
import { PLATFORM_FEE_RATE } from '../../data/providers.js'

// Provider payouts (WF-6): the platform holds the customer's money, then
// credits the company minus the platform fee once the job is settled. This
// reads straight from the shared orders, so it agrees with what the customer
// actually paid rather than a separate mock ledger.
export default function SPWalletScreen({ orders = [], onBack }) {
  const settled = orders.filter((o) => o.state === 'paid' || o.state === 'closed')
  const gross = settled.reduce((s, o) => s + (o.total || 0), 0)
  const fee = Math.round(gross * PLATFORM_FEE_RATE)
  const net = gross - fee

  const pending = orders.filter((o) =>
    ['awaiting_payment', 'work_done', 'work_in_progress', 'approved'].includes(o.state),
  )
  const pendingTotal = pending.reduce((s, o) => s + (o.amountDue || 0), 0)

  return (
    <GradientHeader title="Wallet" onBack={onBack} sheetClassName="bg-[#F5F4F7]">
      <div className="font-poppins flex grow flex-col px-4 pb-6">
        <div className="brand-hero mt-3 rounded-[16px] p-5 text-white">
          <p className="text-[12px] text-white/80">Available to withdraw</p>
          <p className="mt-1 text-[28px] font-semibold">AED {net}</p>
          <p className="mt-1 text-[11px] text-white/80">
            From {settled.length} settled {settled.length === 1 ? 'job' : 'jobs'} · platform fee{' '}
            {Math.round(PLATFORM_FEE_RATE * 100)}% ({fee} AED)
          </p>
        </div>

        <div className="mt-3 flex gap-3">
          <div className="grow rounded-[16px] bg-white p-4 shadow-card-sm">
            <p className="text-[11px] text-setl-muted">Gross</p>
            <p className="mt-0.5 text-[15px] font-semibold text-setl-ink">AED {gross}</p>
          </div>
          <div className="grow rounded-[16px] bg-white p-4 shadow-card-sm">
            <p className="text-[11px] text-setl-muted">In progress</p>
            <p className="mt-0.5 text-[15px] font-semibold text-setl-gold">AED {pendingTotal}</p>
          </div>
        </div>

        <p className="mt-5 text-[14px] font-medium text-setl-ink">Payouts</p>
        {settled.length === 0 ? (
          <p className="mt-3 text-center text-[12px] text-setl-muted">NO records found</p>
        ) : (
          settled.map((o) => {
            const jobFee = Math.round((o.total || 0) * PLATFORM_FEE_RATE)
            return (
              <div key={o.id} className="row-card mt-3 flex items-center gap-3 px-3">
                <div className="min-w-0 grow">
                  <p className="truncate text-[14px] font-medium text-setl-ink">{o.service}</p>
                  <p className="text-[11px] text-setl-muted">
                    Order #{o.id} · fee −{jobFee} AED
                  </p>
                </div>
                <span className="text-[14px] font-semibold text-setl-green">
                  +{(o.total || 0) - jobFee}
                </span>
              </div>
            )
          })
        )}

        <div className="grow" />

        <button
          type="button"
          disabled={net <= 0}
          className="brand-hero mt-6 h-[52px] w-full cursor-pointer rounded-[12px] text-[17px] font-medium text-white disabled:opacity-40"
        >
          Withdraw AED {net}
        </button>
      </div>
    </GradientHeader>
  )
}
