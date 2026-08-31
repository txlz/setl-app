// Admin-side dummy data + derivations.
//
// The dashboard deliberately reads the SAME localStorage the three apps write
// (`setl_orders`, `setl_sp_company`), so a booking made in the customer app
// shows up here without any wiring between them. Seed figures below stand in
// for the historical totals a real backend would serve; live orders are added
// on top so the numbers move during a demo.

import { PROVIDERS } from './providers.js'
import { statusLabel } from './orders.js'

// Baseline platform figures (APPS_AND_WORKFLOW.md §3.4 quotes these).
export const SEED_STATS = { users: 50899, orders: 10293, salesAED: 72452 }

export const ADMIN_USERS = [
  { id: 'u1', name: 'Ahmed Alshamsi', phone: '+971 50 123 4567', joined: '2026-02-11', orders: 12, status: 'active' },
  { id: 'u2', name: 'Fatima Al Marri', phone: '+971 55 884 2201', joined: '2026-03-02', orders: 5, status: 'active' },
  { id: 'u3', name: 'John Mathew', phone: '+971 52 771 9930', joined: '2026-04-19', orders: 2, status: 'active' },
  { id: 'u4', name: 'Layla Haddad', phone: '+971 56 220 4415', joined: '2026-05-08', orders: 9, status: 'suspended' },
  { id: 'u5', name: 'Omar Siddiqui', phone: '+971 50 662 7788', joined: '2026-06-23', orders: 1, status: 'active' },
]

// Providers come from the shared catalogue so admin and customer never drift.
export function adminProviders(verified = {}) {
  return PROVIDERS.map((p) => ({
    ...p,
    cr: `CR-${100000 + p.id * 7331}`,
    coverage: `${10 + p.id * 3} km`,
    // Unverified until an admin flips it; persisted by the caller.
    verified: verified[p.id] ?? p.id <= 2,
  }))
}

export const COST_LINES = [
  { label: 'Provider payouts', pct: 62 },
  { label: 'Payment fees', pct: 9 },
  { label: 'Support & ops', pct: 14 },
]

// Monthly income vs costs — the shape the Reports chart draws.
export const MONTHLY = [
  { m: 'Mar', income: 41200, costs: 30100 },
  { m: 'Apr', income: 47600, costs: 33800 },
  { m: 'May', income: 52300, costs: 36400 },
  { m: 'Jun', income: 61800, costs: 41900 },
  { m: 'Jul', income: 68400, costs: 45200 },
  { m: 'Aug', income: 72452, costs: 47100 },
]

// Live figures = seeded history + whatever the apps have actually produced.
export function liveStats(orders) {
  const paid = orders.filter((o) => o.state === 'paid' || o.state === 'closed')
  const takings = paid.reduce((s, o) => s + (o.total || 0), 0)
  return {
    users: SEED_STATS.users,
    orders: SEED_STATS.orders + orders.length,
    salesAED: SEED_STATS.salesAED + takings,
    liveOrders: orders.length,
    liveTakings: takings,
  }
}

// The four buckets the admin Orders screen filters by (§3.4).
export function bucketOf(order) {
  if (['paid', 'closed'].includes(order.state)) return 'Done'
  if (['cancelled_by_customer', 'cancelled_by_provider', 'estimate_declined', 'estimate_expired'].includes(order.state))
    return 'Cancelled'
  if (['scheduled', 'estimate_ready', 'awaiting_payment', 'payment_failed'].includes(order.state)) return 'Pending'
  return 'Active'
}

export const ORDER_BUCKETS = ['Done', 'Active', 'Pending', 'Cancelled']

export function orderRow(order) {
  return {
    id: order.id,
    service: order.service,
    customer: 'Ahmed Alshamsi',
    provider: order.provider?.name ?? '—',
    worker: order.assignedName ?? null,
    when: `${order.date ?? ''} ${order.time ?? ''}`.trim() || '—',
    amount: order.amountDue ?? order.total ?? 0,
    paid: order.total ?? 0,
    state: order.state,
    status: statusLabel(order.state),
    bucket: bucketOf(order),
    history: order.history ?? [],
  }
}
