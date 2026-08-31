import ScreenHeader from '../components/ScreenHeader.jsx'

// App settings: the preferences that live on the device (notifications,
// language, currency) plus the two policy documents customers ask for before
// they book. Settings are lifted into App so they survive a screen change and
// can later be persisted alongside the other localStorage keys.

const LANGUAGES = [
  { key: 'en', label: 'English' },
  { key: 'ar', label: 'العربية' },
]

const CURRENCIES = [
  { key: 'AED', label: 'AED' },
  { key: 'USD', label: 'USD' },
]

function Toggle({ on, onClick, label }) {
  return (
    <button
      type="button"
      onClick={onClick}
      role="switch"
      aria-checked={on}
      aria-label={label}
      className={`relative h-7 w-12 shrink-0 cursor-pointer rounded-full transition-colors ${on ? 'bg-setl-violet' : 'bg-setl-line-3'}`}
    >
      <span
        className={`absolute top-0.5 h-6 w-6 rounded-full bg-white shadow transition-transform ${on ? 'translate-x-5' : 'translate-x-0.5'}`}
      />
    </button>
  )
}

// A two-option segmented control — the pattern used for language + currency.
function Segmented({ options, value, onChange, label }) {
  return (
    <div role="radiogroup" aria-label={label} className="flex gap-1.5 rounded-[11px] bg-setl-surface-3 p-1">
      {options.map((o) => (
        <button
          key={o.key}
          type="button"
          role="radio"
          aria-checked={value === o.key}
          onClick={() => onChange(o.key)}
          className={`cursor-pointer rounded-[8px] px-3 py-1 text-[11px] font-medium transition-colors ${
            value === o.key ? 'bg-white text-setl-violet shadow-card-sm' : 'text-setl-muted'
          }`}
        >
          {o.label}
        </button>
      ))}
    </div>
  )
}

function Chevron() {
  return (
    <svg width="7" height="12" viewBox="0 0 10 18" fill="none">
      <path d="m1 1 7 8-7 8" stroke="#C9C7D1" strokeWidth="2" strokeLinecap="round" />
    </svg>
  )
}

export default function SettingsScreen({ settings, onChange, onOpenPolicy, onBack }) {
  const { notifications = true, language = 'en', currency = 'AED' } = settings ?? {}

  return (
    <ScreenHeader title="Settings" onBack={onBack}>
      <p className="mt-5 mb-2 text-[11px] font-medium tracking-wide text-setl-muted uppercase">
        Preferences
      </p>

      <div className="flex flex-col gap-2.5">
        <div className="row-card flex items-center justify-between px-3.5 py-2.5">
          <div className="pr-3">
            <p className="text-[14px] font-medium text-setl-ink">Notifications</p>
            <p className="text-[11px] text-setl-muted">
              {notifications ? 'Booking and payment alerts are on' : 'You will not get booking alerts'}
            </p>
          </div>
          <Toggle
            on={notifications}
            onClick={() => onChange({ notifications: !notifications })}
            label="Notifications"
          />
        </div>

        <div className="row-card flex items-center justify-between px-3.5 py-2.5">
          <p className="text-[14px] font-medium text-setl-ink">Language</p>
          <Segmented
            options={LANGUAGES}
            value={language}
            onChange={(key) => onChange({ language: key })}
            label="Language"
          />
        </div>

        <div className="row-card flex items-center justify-between px-3.5 py-2.5">
          <div>
            <p className="text-[14px] font-medium text-setl-ink">Currency</p>
            <p className="text-[11px] text-setl-muted">Prices are shown in this currency</p>
          </div>
          <Segmented
            options={CURRENCIES}
            value={currency}
            onChange={(key) => onChange({ currency: key })}
            label="Currency"
          />
        </div>
      </div>

      <p className="mt-6 mb-2 text-[11px] font-medium tracking-wide text-setl-muted uppercase">
        Legal
      </p>

      <div className="flex flex-col gap-2.5">
        <button
          type="button"
          onClick={() => onOpenPolicy('privacy')}
          className="row-card flex cursor-pointer items-center justify-between px-3.5 py-3.5 text-left"
        >
          <span className="text-[14px] font-medium text-setl-ink">Privacy policy</span>
          <Chevron />
        </button>
        <button
          type="button"
          onClick={() => onOpenPolicy('cancellation')}
          className="row-card flex cursor-pointer items-center justify-between px-3.5 py-3.5 text-left"
        >
          <span className="text-[14px] font-medium text-setl-ink">Cancellation policy</span>
          <Chevron />
        </button>
      </div>

      <div className="grow" />
      <p className="mt-8 text-center text-[11px] text-setl-line-3">Setl v0.1.0</p>
    </ScreenHeader>
  )
}
