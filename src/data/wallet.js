// Setl Wallet — dummy data until the payments backend lands.
//
// The wallet holds AED credit the customer tops up (or gets back as a refund
// when a booking is cancelled inside the free window). Amounts are signed:
// positive = money in (top-up, refund, promo), negative = money spent on a job.
// Balance is DERIVED from the ledger (walletBalance) so the two can never drift
// apart when the demo adds a transaction.

export const TOP_UP_AMOUNTS = [50, 100, 200]

export const STARTING_TRANSACTIONS = [
  {
    id: 'w1',
    label: 'Top-up',
    detail: 'Visa •••• 4291',
    amount: 200,
    date: '18 Aug 2026',
    kind: 'topup',
  },
  {
    id: 'w2',
    label: 'AC cleaning & refilling',
    detail: 'Breezcool · Order #1',
    amount: -156,
    date: '19 Aug 2026',
    kind: 'spend',
  },
  {
    id: 'w3',
    label: 'Refund — cancelled booking',
    detail: 'Cancelled 3 hours before the slot',
    amount: 76,
    date: '22 Aug 2026',
    kind: 'refund',
  },
  {
    id: 'w4',
    label: 'House cleaning (2 hours)',
    detail: 'Maria S. · Order #2',
    amount: -90,
    date: '25 Aug 2026',
    kind: 'spend',
  },
  {
    id: 'w5',
    label: 'Top-up',
    detail: 'Apple Pay',
    amount: 100,
    date: '28 Aug 2026',
    kind: 'topup',
  },
]

// The wallet balance is always the sum of the ledger — never stored separately.
export function walletBalance(transactions) {
  return transactions.reduce((sum, t) => sum + t.amount, 0)
}

// Today, the way the ledger prints its dates ("31 Aug 2026").
export function walletToday() {
  const d = new Date()
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
  return `${d.getDate()} ${months[d.getMonth()]} ${d.getFullYear()}`
}

// A new top-up ledger entry. Ids are time-based so a demo session can add
// several without colliding with the seeded w1..w5.
export function topUpTransaction(amount) {
  return {
    id: `w-${Date.now()}`,
    label: 'Top-up',
    detail: 'Visa •••• 4291',
    amount,
    date: walletToday(),
    kind: 'topup',
  }
}
