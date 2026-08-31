import { ADMIN_USERS } from '../../data/admin.js'

export default function AdminUsers() {
  return (
    <div>
      <h1 className="text-[20px] font-semibold">Users</h1>
      <p className="mt-0.5 text-[12px] text-setl-muted">{ADMIN_USERS.length} of 50,899 shown (sample).</p>

      <section className="mt-5 rounded-[16px] bg-white p-5 shadow-card">
        <table className="w-full text-left text-[12px]">
          <thead className="text-[11px] text-setl-muted">
            <tr><th className="py-1.5">Name</th><th>Phone</th><th>Joined</th><th>Orders</th><th>Status</th></tr>
          </thead>
          <tbody>
            {ADMIN_USERS.map((u) => (
              <tr key={u.id} className="border-t border-setl-line">
                <td className="py-2.5 font-medium">{u.name}</td>
                <td className="text-setl-ink-3">{u.phone}</td>
                <td className="text-setl-muted-2">{u.joined}</td>
                <td className="text-setl-ink-3">{u.orders}</td>
                <td>
                  <span className={`rounded-[4px] px-2 py-0.5 text-[10px] ${u.status === 'active' ? 'bg-setl-green/12 text-setl-green' : 'bg-setl-red/10 text-setl-red'}`}>
                    {u.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </div>
  )
}
