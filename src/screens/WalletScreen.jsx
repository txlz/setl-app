import ScreenHeader from '../components/ScreenHeader.jsx'
import { TOP_UP_AMOUNTS, walletBalance } from '../data/wallet.js'

// Setl Wallet. The balance card is the one place a customer sees their credit,
// so it carries the brand CTA gradient; everything under it is the plain row
// idiom (14px title / 11px meta) used by the rest of the app.
//
// The balance is derived from the ledger, never stored — see data/wallet.js.
function TransactionIcon({ kind }) {
  if (kind === 'spend')
    return (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#626262" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M7 17 17 7M9 7h8v8" />
      </svg>
    )
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#25B43D" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M17 7 7 17M15 17H7V9" />
    </svg>
  )
}

export default function WalletScreen({ transactions = [], onTopUp, onBack }) {
  const balance = walletBalance(transactions)
  // Newest first — the ledger is stored oldest-first so top-ups append.
  const rows = [...transactions].reverse()

  return (
    <ScreenHeader title="Wallet" subtitle="Your Setl credit and activity" onBack={onBack}>
      <div className="brand-hero mt-5 rounded-[16px] px-5 py-5 text-white shadow-card">
        <p className="text-[11px] text-white/80">Available balance</p>
        <p className="mt-1 text-[32px] leading-none font-semibold">
          {balance} <span className="text-[16px] font-medium">AED</span>
        </p>
        <p className="mt-3 text-[11px] text-white/80">
          Credit is used automatically on your next invoice.
        </p>
      </div>

      <p className="mt-6 mb-2 text-[14px] font-medium text-setl-ink">Top up</p>
      <div className="flex gap-2.5">
        {TOP_UP_AMOUNTS.map((amount) => (
          <button
            key={amount}
            type="button"
            onClick={() => onTopUp(amount)}
            className="row-card flex flex-1 cursor-pointer flex-col items-center justify-center gap-0.5 py-2.5 transition-transform active:scale-[0.97]"
          >
            <span className="text-[15px] font-semibold text-setl-violet">{amount}</span>
            <span className="text-[11px] text-setl-muted">AED</span>
          </button>
        ))}
      </div>

      <p className="mt-6 mb-2 text-[14px] font-medium text-setl-ink">Transactions</p>

      {rows.length === 0 ? (
        <div className="flex grow flex-col items-center justify-center pb-16">
          <svg width="56" height="56" viewBox="0 0 24 24" fill="none" stroke="#D1D1D1" strokeWidth="1.4">
            <rect x="2.5" y="6" width="19" height="13" rx="3" />
            <path d="M2.5 10.5h19" strokeLinecap="round" />
            <circle cx="17" cy="15" r="1.4" />
          </svg>
          <p className="mt-4 text-[14px] font-medium text-setl-ink">NO records found</p>
          <p className="mt-1 text-[11px] text-setl-muted">Top up to see your activity here</p>
        </div>
      ) : (
        <div className="flex flex-col gap-2.5 pb-4">
          {rows.map((t) => (
            <div key={t.id} className="row-card flex items-center gap-3 px-3.5 py-3">
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-setl-surface-3">
                <TransactionIcon kind={t.kind} />
              </span>
              <div className="min-w-0 grow">
                <p className="truncate text-[14px] font-medium text-setl-ink">{t.label}</p>
                <p className="truncate text-[11px] text-setl-muted">
                  {t.detail} · {t.date}
                </p>
              </div>
              <span
                className={`shrink-0 text-[14px] font-medium ${t.amount < 0 ? 'text-setl-ink-3' : 'text-setl-green'}`}
              >
                {t.amount < 0 ? '−' : '+'}
                {Math.abs(t.amount)} AED
              </span>
            </div>
          ))}
        </div>
      )}
    </ScreenHeader>
  )
}
