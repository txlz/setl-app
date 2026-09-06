import { useState } from 'react'
import AdminDashboard from './AdminDashboard.jsx'
import AdminOrders from './AdminOrders.jsx'
import AdminProviders from './AdminProviders.jsx'
import AdminUsers from './AdminUsers.jsx'
import AdminServices from './AdminServices.jsx'
import AdminCatalog from './AdminCatalog.jsx'
import AdminReports from './AdminReports.jsx'
import SetlLogo from '../../components/SetlLogo.jsx'

const NAV = [
  { key: 'dashboard', label: 'Dashboard', icon: 'M3 3h7v7H3zM14 3h7v4h-7zM14 10h7v11h-7zM3 13h7v8H3z' },
  { key: 'orders', label: 'Orders', icon: 'M4 5h16M4 12h16M4 19h10' },
  { key: 'providers', label: 'Providers', icon: 'M4 20a8 8 0 1 1 16 0M12 3a4 4 0 1 1 0 8 4 4 0 0 1 0-8Z' },
  { key: 'users', label: 'Users', icon: 'M3 20a7 7 0 0 1 14 0M10 3a4 4 0 1 1 0 8 4 4 0 0 1 0-8Z' },
  { key: 'catalog', label: 'Home catalogue', icon: 'M4 5h6v6H4zM14 5h6v6h-6zM4 15h6v6H4zM14 15h6v6h-6z' },
  { key: 'services', label: 'Services', icon: 'M4 7h16v10H4zM8 7V5h8v2' },
  { key: 'reports', label: 'Reports', icon: 'M5 20V10M12 20V4M19 20v-7' },
]

// The admin panel is a desktop web surface, not a phone frame — it renders at
// full width while the four mobile apps stay in the 375px shell.
export default function AdminShell({ orders, company, onUpdateOrder, onExit }) {
  const [page, setPage] = useState('dashboard')

  const screens = {
    dashboard: <AdminDashboard orders={orders} onOpenOrders={() => setPage('orders')} />,
    orders: <AdminOrders orders={orders} onUpdateOrder={onUpdateOrder} />,
    providers: <AdminProviders />,
    users: <AdminUsers />,
    catalog: <AdminCatalog />,
    services: <AdminServices company={company} />,
    reports: <AdminReports orders={orders} />,
  }

  return (
    <div className="font-poppins flex min-h-screen bg-setl-surface-2 text-setl-ink">
      <aside className="flex w-[220px] shrink-0 flex-col bg-white shadow-card">
        <div className="flex items-center gap-2 px-6 py-6">
          <SetlLogo className="h-8 w-6" />
          <span className="font-league-spartan text-[22px] font-semibold text-setl-violet">Setl</span>
          <span className="ml-1 rounded-[5px] bg-setl-surface-3 px-2 py-0.5 text-[10px] text-setl-ink-3">admin</span>
        </div>
        <nav className="flex flex-col gap-1 px-3">
          {NAV.map((n) => (
            <button
              key={n.key}
              type="button"
              onClick={() => setPage(n.key)}
              className={`flex cursor-pointer items-center gap-3 rounded-[9px] px-3 py-2.5 text-left text-[13px] transition-colors ${
                page === n.key
                  ? 'bg-setl-violet text-white'
                  : 'text-setl-ink-3 hover:bg-setl-surface-3'
              }`}
            >
              <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <path d={n.icon} />
              </svg>
              {n.label}
            </button>
          ))}
        </nav>
        <div className="grow" />
        <button
          type="button"
          onClick={onExit}
          className="m-3 cursor-pointer rounded-[9px] border border-setl-line-2 px-3 py-2 text-[12px] text-setl-ink-3 hover:bg-setl-surface-3"
        >
          ← Back to the apps
        </button>
      </aside>

      <main className="grow overflow-x-auto px-8 py-7">{screens[page]}</main>
    </div>
  )
}
