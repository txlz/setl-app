// Rows that open one of the customer's own screens. `id` is the key App maps
// to a screen; rows without a handler stay inert (the demo has no addresses /
// payments / help screens yet, so they keep their placeholder behaviour).
const MENU = [
  { id: 'editProfile', label: 'Edit profile' },
  { id: 'wallet', label: 'Wallet' },
  { id: 'addresses', label: 'My addresses' },
  { id: 'payments', label: 'Payment methods' },
  { id: 'settings', label: 'Settings' },
  { id: 'help', label: 'Help & support' },
]

export default function ProfileScreen({
  phone,
  profile,
  walletBalance,
  onOpen,
  onSwitchMode,
  onOpenAdmin,
  onLogout,
}) {
  const name = profile?.name || 'Ahmed Alshamsi'
  const initial = (name.trim()[0] ?? 'A').toUpperCase()
  // Wallet shows its balance inline, the way Language used to show its value.
  const values = { wallet: walletBalance == null ? undefined : `${walletBalance} AED` }
  const OPENS = ['editProfile', 'wallet', 'settings']

  return (
    <div className="font-poppins flex min-h-screen flex-col bg-[#F5F4F7] pb-24">
      <div className="brand-header px-4 pt-8 pb-10 text-center text-white">
        <div className="flex flex-col items-center gap-2">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-white/25 text-[17px] font-semibold">
            {initial}
          </div>
          <div>
            <p className="text-[15px] font-semibold">{name}</p>
            <p className="text-sm text-white/85">+971 {phone || profile?.phone || '501234567'}</p>
            {profile?.email && <p className="text-xs text-white/70">{profile.email}</p>}
          </div>
        </div>
      </div>

      <div className="-mt-5 mx-3 rounded-[15px] bg-white p-2 shadow-[0_2px_8px_rgba(0,0,0,0.06)]">
        {MENU.map((item, i) => (
          <button
            key={item.id}
            type="button"
            onClick={OPENS.includes(item.id) && onOpen ? () => onOpen(item.id) : undefined}
            className={`flex w-full cursor-pointer items-center justify-between px-4 py-3.5 text-left ${
              i < MENU.length - 1 ? 'border-b border-setl-surface-3' : ''
            }`}
          >
            <span className="text-[15px] text-black">{item.label}</span>
            <span className="flex items-center gap-2">
              {values[item.id] && <span className="text-sm text-setl-muted">{values[item.id]}</span>}
              <svg width="7" height="12" viewBox="0 0 10 18" fill="none">
                <path d="m1 1 7 8-7 8" stroke="#C9C7D1" strokeWidth="2" strokeLinecap="round" />
              </svg>
            </span>
          </button>
        ))}
      </div>

      {onSwitchMode && (
        <button
          type="button"
          onClick={onSwitchMode}
          className="mx-3 mt-4 flex cursor-pointer items-center justify-between rounded-[15px] bg-white px-4 py-3.5 text-left shadow-[0_2px_8px_rgba(0,0,0,0.06)]"
        >
          <span className="text-[15px] font-medium text-setl-purple">Switch to service provider app</span>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#8442FF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M8 3 4 7l4 4M4 7h13M16 21l4-4-4-4M20 17H7" />
          </svg>
        </button>
      )}

      {onOpenAdmin && (
        <button
          type="button"
          onClick={onOpenAdmin}
          className="mx-3 mt-3 flex cursor-pointer items-center justify-between rounded-[15px] bg-white px-4 py-3.5 text-left shadow-[0_2px_8px_rgba(0,0,0,0.06)]"
        >
          <span className="text-[15px] font-medium text-setl-violet">Open the admin dashboard</span>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#7E43FF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M3 3h7v7H3zM14 3h7v4h-7zM14 10h7v11h-7zM3 13h7v8H3z" />
          </svg>
        </button>
      )}

      <button
        type="button"
        onClick={onLogout}
        className="mx-3 mt-3 cursor-pointer rounded-[15px] bg-white px-4 py-3.5 text-left text-[15px] text-red-500 shadow-[0_2px_8px_rgba(0,0,0,0.06)]"
      >
        Log out
      </button>

      <p className="mt-6 text-center text-xs text-setl-line-3">Setl v0.1.0</p>
    </div>
  )
}
