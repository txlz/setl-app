import { useState } from 'react'
import { adminProviders } from '../../data/admin.js'

const KEY = 'setl_admin_verified'

function load() {
  try { return JSON.parse(localStorage.getItem(KEY) || '{}') } catch { return {} }
}

// Verify or suspend a provider company. The decision persists so a demo can
// show it sticking across a reload.
export default function AdminProviders() {
  const [verified, setVerified] = useState(load)
  const rows = adminProviders(verified)

  function toggle(id, next) {
    const map = { ...verified, [id]: next }
    setVerified(map)
    try { localStorage.setItem(KEY, JSON.stringify(map)) } catch { /* private mode */ }
  }

  return (
    <div>
      <h1 className="text-[20px] font-semibold">Providers</h1>
      <p className="mt-0.5 text-[12px] text-setl-muted">
        {rows.filter((r) => r.verified).length} of {rows.length} companies verified.
      </p>

      <section className="mt-5 rounded-[16px] bg-white p-5 shadow-card">
        <table className="w-full text-left text-[12px]">
          <thead className="text-[11px] text-setl-muted">
            <tr><th className="py-1.5">Company</th><th>CR number</th><th>Coverage</th><th>Rating</th><th>Status</th><th className="text-right">Action</th></tr>
          </thead>
          <tbody>
            {rows.map((p) => (
              <tr key={p.id} className="border-t border-setl-line">
                <td className="py-2.5">
                  <span className="flex items-center gap-2">
                    <span className="flex h-7 w-7 items-center justify-center rounded-full text-[11px] font-bold text-white" style={{ background: p.color }}>
                      {p.name[0]}
                    </span>
                    <span className="font-medium">{p.name}</span>
                  </span>
                </td>
                <td className="text-setl-ink-3">{p.cr}</td>
                <td className="text-setl-ink-3">{p.coverage}</td>
                <td className="text-setl-ink-3">★ {p.rating}</td>
                <td>
                  <span className={`rounded-[4px] px-2 py-0.5 text-[10px] ${p.verified ? 'bg-setl-green/12 text-setl-green' : 'bg-setl-gold/15 text-setl-gold'}`}>
                    {p.verified ? 'Verified' : 'Pending'}
                  </span>
                </td>
                <td className="text-right">
                  <button
                    type="button"
                    onClick={() => toggle(p.id, !p.verified)}
                    className={`cursor-pointer rounded-[7px] px-3 py-1 text-[11px] ${
                      p.verified ? 'border border-setl-line-2 text-setl-ink-3' : 'bg-setl-violet text-white'
                    }`}
                  >
                    {p.verified ? 'Revoke' : 'Verify'}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </div>
  )
}
