// The board's payment methods (1.html:806-880): "my wallet", "Tamara" and
// "visa or mada" — labels 13px/500 #202020 on ~38px rows, with a round
// checkbox at the left and the method's mark before the label. The app used
// to invent Apple/Cash/Card pay, which is not what the design offers.
const PAYMENT_METHODS = [
  { id: 'wallet', label: 'my wallet' },
  { id: 'tamara', label: 'Tamara' },
  { id: 'card', label: 'visa or mada' },
]

// Component 30/31/32 on the board: a filled violet tick when selected, a
// hollow ring when not.
function Checkbox({ on }) {
  return (
    <span
      aria-hidden
      className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-[1.5px] transition-colors"
      style={{ borderColor: on ? '#7E43FF' : 'rgba(0,0,0,0.34)', background: on ? '#7E43FF' : 'transparent' }}
    >
      {on && (
        <svg width="11" height="9" viewBox="0 0 11 9" fill="none">
          <path d="M1 4.5 4 7.5 10 1.5" stroke="#fff" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      )}
    </span>
  )
}

function PayMark({ id }) {
  if (id === 'wallet')
    return (
      <svg width="34" height="24" viewBox="0 0 34 24" fill="none" stroke="#7E43FF" strokeWidth="1.6">
        <rect x="1" y="4" width="32" height="16" rx="3" />
        <path d="M24 12h6" strokeLinecap="round" strokeWidth="3" />
      </svg>
    )
  if (id === 'tamara')
    // Tamara's wordmark is a licensed asset we don't ship, so the row carries
    // a neutral brand chip rather than a look-alike.
    return (
      <span className="flex h-6 w-[34px] items-center justify-center rounded-[4px] bg-[#3CB39E] text-[9px] font-bold text-white">
        tamara
      </span>
    )
  // "visa or mada" — the board draws the Mastercard circles here.
  return (
    <span className="flex h-6 w-[34px] items-center justify-center">
      <svg width="30" height="19" viewBox="0 0 30 19" fill="none">
        <circle cx="11" cy="9.5" r="9" fill="#EB001B" />
        <circle cx="19" cy="9.5" r="9" fill="#F79E1B" fillOpacity="0.85" />
      </svg>
    </span>
  )
}

// Radio list of payment methods (shared by the inspection checkout and the
// final invoice).
export default function PaymentMethods({ method, onChange }) {
  return (
    <div className="mt-2 rounded-[11px] bg-white p-2 shadow-[0_2px_8px_rgba(0,0,0,0.06)]">
      {PAYMENT_METHODS.map((m) => (
        <label
          key={m.id}
          className="flex h-[38px] cursor-pointer items-center gap-3 rounded-[11px] px-3"
        >
          <input
            type="radio"
            name="payment"
            checked={method === m.id}
            onChange={() => onChange(m.id)}
            className="sr-only"
          />
          <Checkbox on={method === m.id} />
          <PayMark id={m.id} />
          {/* 1.html:824/860/872 — 13px/500 #202020 */}
          <span className="text-[13px] font-medium text-setl-ink-2">{m.label}</span>
        </label>
      ))}
    </div>
  )
}
