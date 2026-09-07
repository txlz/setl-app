import { useState } from 'react'
import { ADMIN_USERS } from '../../data/admin.js'

const KEY = 'setl_admin_suspended'

function load() {
  try { return JSON.parse(localStorage.getItem(KEY) || '{}') } catch { return {} }
}

// Suspend or restore a customer account. Persisted the same way provider
// verification is, so the decision survives a reload during a demo.
export default function AdminUsers() {
  const [suspended, setSuspended] = useState(load)

  // An admin decision wins; otherwise fall back to the seeded status.
  const status = (u) => {
    const flag = suspended[u.id] ?? u.status === 'suspended'
    return flag ? 'suspended' : 'active'
  }

  function toggle(u) {
    const map = { ...suspended, [u.id]: status(u) === 'active' }
    setSuspended(map)
    try { localStorage.setItem(KEY, JSON.stringify(map)) } catch { /* private mode */ }
  }

  const active = ADMIN_USERS.filter((u) => status(u) === 'active').length

  return (
    <div>
      <h1 className="text-[20px] font-semibold">Users</h1>
      <p className="mt-0.5 text-[12px] text-setl-muted">
        {ADMIN_USERS.length} of 50,899 shown (sample) · {active} active
      </p>

      <section className="mt-5 rounded-[16px] bg-white p-5 shadow-card">
        <table className="w-full text-left text-[12px]">
          <thead className="text-[11px] text-setl-muted">
            <tr><th className="py-1.5">Name</th><th>Phone</th><th>Joined</th><th>Orders</th><th>Status</th><th /></tr>
          </thead>
          <tbody>
            {ADMIN_USERS.map((u) => {
              const s = status(u)
              return (
                <tr key={u.id} className="border-t border-setl-line">
                  <td className="py-2.5 font-medium">{u.name}</td>
                  <td className="text-setl-ink-3">{u.phone}</td>
                  <td className="text-setl-muted-2">{u.joined}</td>
                  <td className="text-setl-ink-3">{u.orders}</td>
                  <td>
                    <span className={`rounded-[4px] px-2 py-0.5 text-[10px] ${s === 'active' ? 'bg-setl-green/12 text-setl-green' : 'bg-setl-red/10 text-setl-red'}`}>
                      {s}
                    </span>
                  </td>
                  <td className="text-right">
                    <button
                      type="button"
                      onClick={() => toggle(u)}
                      className={`cursor-pointer rounded-[6px] border px-2.5 py-1 text-[11px] ${
                        s === 'active'
                          ? 'border-setl-red text-setl-red hover:bg-setl-red/5'
                          : 'border-setl-green text-setl-green hover:bg-setl-green/5'
                      }`}
                    >
                      {s === 'active' ? 'Suspend' : 'Restore'}
                    </button>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </section>
    </div>
  )
}
