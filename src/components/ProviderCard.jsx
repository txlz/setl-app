function Heart({ filled }) {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill={filled ? '#8442FF' : 'none'} stroke={filled ? '#8442FF' : '#C2C0C9'} strokeWidth="2">
      <path d="M12 21s-7-4.5-9.5-9A5 5 0 0 1 12 6a5 5 0 0 1 9.5 6c-2.5 4.5-9.5 9-9.5 9Z" strokeLinejoin="round" />
    </svg>
  )
}

// White provider card: logo avatar, name, price in AED, yellow rating badge, Book button.
// When onToggleFavorite is passed (cleaning), a heart lets the customer mark
// this provider as their regular.
export default function ProviderCard({
  provider,
  price,
  priceSuffix = ' AED',
  buttonLabel = 'Book',
  onBook,
  isFavorite,
  onToggleFavorite,
  onOpenProfile,
}) {
  const initials = provider.name
    .split(' ')
    .slice(0, 2)
    .map((w) => w[0])
    .join('')
    .toUpperCase()

  return (
    <div className="flex items-center gap-3 rounded-[11px] bg-white p-3 shadow-card-sm">
      <div
        className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full text-lg font-bold text-white"
        style={{ background: provider.color }}
      >
        {initials}
      </div>
      <div className="min-w-0 grow">
        <button
          type="button"
          onClick={onOpenProfile}
          disabled={!onOpenProfile}
          className={`block max-w-full truncate text-left font-semibold text-black ${onOpenProfile ? 'cursor-pointer' : ''}`}
        >
          {provider.name}
        </button>
        <p className="mt-0.5 text-sm text-black">
          {price}
          {priceSuffix}
        </p>
        {provider.slots && (
          <div className="no-scrollbar mt-1.5 flex gap-1 overflow-x-auto">
            {provider.slots.map((slot, i) => (
              <span
                key={slot}
                className={`shrink-0 rounded-full px-2 py-0.5 text-[11px] font-medium whitespace-nowrap ${
                  i === 0 ? 'bg-setl-purple/12 text-setl-purple' : 'border border-setl-line text-setl-muted'
                }`}
              >
                {slot}
              </span>
            ))}
          </div>
        )}
        <div className="mt-1.5 flex items-center gap-3">
          <button
            type="button"
            onClick={onBook}
            className="cursor-pointer rounded-[12px] bg-linear-[270deg,#366EE9_-95.36%,#F15CFA_212.48%] px-6 py-1.5 text-[13px] text-white active:opacity-90"
          >
            {buttonLabel}
          </button>
          {onOpenProfile && (
            <button
              type="button"
              onClick={onOpenProfile}
              className="cursor-pointer text-sm font-medium text-setl-purple"
            >
              View profile
            </button>
          )}
        </div>
      </div>
      <div className="flex flex-col items-end gap-2 self-start">
        {onToggleFavorite && (
          <button
            type="button"
            onClick={onToggleFavorite}
            aria-label={isFavorite ? 'Remove as regular' : 'Set as my regular'}
            className="cursor-pointer"
          >
            <Heart filled={isFavorite} />
          </button>
        )}
        <span className="rounded-md bg-setl-gold/85 px-2.5 py-1 text-[13px] font-medium text-setl-navy">
          {provider.rating}
        </span>
      </div>
    </div>
  )
}
