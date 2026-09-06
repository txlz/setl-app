import { useState } from 'react'
import { ICONS, ICON_SLUGS, homeCards, carCards } from '../../data/catalog.js'
import { useCatalog } from '../../data/useCatalog.js'

// Admin owns the customer Home screen. Everything here writes to the shared
// `setl_catalog` store, so the phone updates the moment a toggle flips — the
// preview on the right is the same data the customer app renders.

function Toggle({ on, onClick, label }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={on}
      aria-label={label}
      onClick={onClick}
      className={`relative h-[20px] w-[34px] shrink-0 cursor-pointer rounded-full transition-colors ${
        on ? 'bg-setl-violet' : 'bg-setl-line-2'
      }`}
    >
      <span
        className={`absolute top-[2px] h-4 w-4 rounded-full bg-white shadow-sm transition-all ${
          on ? 'left-[16px]' : 'left-[2px]'
        }`}
      />
    </button>
  )
}

// The tile exactly as HomeScreen draws it, at preview scale.
function PreviewCard({ c }) {
  const icon = c.icon ? ICONS[c.icon] : null
  const light = !c.photo && !c.gradient
  return (
    <div
      className="relative h-[74px] w-[94px] shrink-0 overflow-hidden rounded-[5px] bg-setl-surface-3"
      style={c.gradient ? { background: c.gradient } : undefined}
    >
      {c.photo && <img src={c.photo} alt="" className="h-full w-full object-cover" />}
      {!c.photo && icon && (
        <span className="flex h-full w-full items-center justify-center bg-linear-to-b from-[#F6F1FF] to-[#EDE4FF] pb-4">
          <img src={icon.src} alt="" className="h-9 w-9 object-contain" />
        </span>
      )}
      {!c.photo && !icon && c.img && <img src={c.img} alt="" className="h-full w-full object-contain p-2 pb-5" />}
      <span className={`pointer-events-none absolute inset-x-0 bottom-0 h-[17px] ${light ? 'bg-white/55' : 'bg-black/11'}`} />
      <span className={`absolute inset-x-0 bottom-1 truncate px-1.5 text-[7px] font-medium ${light ? 'text-setl-ink' : 'text-white'}`}>
        {c.label}
      </span>
    </div>
  )
}

function IconPicker({ value, onPick, onClose }) {
  return (
    <div className="absolute top-full right-0 z-20 mt-1 w-[260px] rounded-[10px] border border-setl-line bg-white p-2 shadow-lg">
      <div className="grid grid-cols-4 gap-1.5">
        <button
          type="button"
          onClick={() => { onPick(null); onClose() }}
          className={`flex h-[52px] cursor-pointer flex-col items-center justify-center rounded-[7px] border text-[9px] ${
            !value ? 'border-setl-violet bg-setl-violet/8' : 'border-setl-line hover:bg-setl-surface-3'
          }`}
        >
          None
        </button>
        {ICON_SLUGS.map((slug) => (
          <button
            key={slug}
            type="button"
            title={ICONS[slug].label}
            onClick={() => { onPick(slug); onClose() }}
            className={`flex h-[52px] cursor-pointer items-center justify-center rounded-[7px] border ${
              value === slug ? 'border-setl-violet bg-setl-violet/8' : 'border-setl-line hover:bg-setl-surface-3'
            }`}
          >
            <img src={ICONS[slug].src} alt={ICONS[slug].label} className="h-8 w-8 object-contain" />
          </button>
        ))}
      </div>
    </div>
  )
}

function Row({ c, first, last, onToggle, onMove, onIcon }) {
  const [picking, setPicking] = useState(false)
  const icon = c.icon ? ICONS[c.icon] : null

  return (
    <tr className="border-t border-setl-line">
      <td className="py-2">
        <div className="flex items-center gap-2.5">
          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-[7px] bg-setl-surface-3">
            {icon
              ? <img src={icon.src} alt="" className="h-7 w-7 object-contain" />
              : c.photo
                ? <img src={c.photo} alt="" className="h-full w-full rounded-[7px] object-cover" />
                : <span className="h-5 w-5 rounded-[4px]" style={{ background: c.gradient || '#E6E6E6' }} />}
          </span>
          <span className="font-medium">{c.label}</span>
        </div>
      </td>
      <td className="text-setl-muted-2">{c.group === 'home' ? 'Home' : 'Car'}</td>
      <td>
        <div className="relative inline-block">
          <button
            type="button"
            onClick={() => setPicking((p) => !p)}
            className="cursor-pointer rounded-[6px] border border-setl-line px-2 py-1 text-[11px] text-setl-ink-3 hover:bg-setl-surface-3"
          >
            {icon ? icon.label : 'No icon'} ▾
          </button>
          {picking && (
            <IconPicker value={c.icon} onPick={(s) => onIcon(c.id, s)} onClose={() => setPicking(false)} />
          )}
        </div>
      </td>
      <td><Toggle on={c.visible} onClick={() => onToggle(c.id, 'visible')} label={`${c.label} visible`} /></td>
      <td><Toggle on={c.featured} onClick={() => onToggle(c.id, 'featured')} label={`${c.label} on home`} /></td>
      <td>
        <div className="flex gap-1">
          <button
            type="button"
            disabled={first}
            onClick={() => onMove(c.id, -1)}
            className="h-6 w-6 cursor-pointer rounded-[5px] border border-setl-line text-[11px] disabled:cursor-default disabled:opacity-30 hover:enabled:bg-setl-surface-3"
            aria-label={`Move ${c.label} up`}
          >↑</button>
          <button
            type="button"
            disabled={last}
            onClick={() => onMove(c.id, 1)}
            className="h-6 w-6 cursor-pointer rounded-[5px] border border-setl-line text-[11px] disabled:cursor-default disabled:opacity-30 hover:enabled:bg-setl-surface-3"
            aria-label={`Move ${c.label} down`}
          >↓</button>
        </div>
      </td>
    </tr>
  )
}

export default function AdminCatalog() {
  const { cats, toggle, setIcon, move, reset } = useCatalog()
  const home = cats.filter((c) => c.group === 'home')
  const car = cats.filter((c) => c.group === 'car')
  const onHome = homeCards(cats)
  const onCar = carCards(cats)

  const groups = [['Home services', home], ['Car services', car]]

  return (
    <div>
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-[20px] font-semibold">Home page catalogue</h1>
          <p className="mt-0.5 text-[12px] text-setl-muted">
            {cats.length} categories · {onHome.length + onCar.length} shown on the customer home screen ·
            {' '}{cats.filter((c) => c.icon).length} with artwork
          </p>
        </div>
        <button
          type="button"
          onClick={reset}
          className="cursor-pointer rounded-[8px] border border-setl-line-2 px-3 py-1.5 text-[12px] text-setl-ink-3 hover:bg-setl-surface-3"
        >
          Reset to defaults
        </button>
      </div>

      <div className="mt-5 flex items-start gap-5">
        <section className="grow rounded-[16px] bg-white p-5 shadow-card">
          {groups.map(([title, rows]) => (
            <div key={title} className="mb-5 last:mb-0">
              <h2 className="text-[13px] font-medium">{title}</h2>
              <table className="mt-1.5 w-full text-left text-[12px]">
                <thead className="text-[11px] text-setl-muted">
                  <tr>
                    <th className="py-1.5">Category</th>
                    <th>Section</th>
                    <th>Icon</th>
                    <th>Visible</th>
                    <th>On home</th>
                    <th>Order</th>
                  </tr>
                </thead>
                <tbody>
                  {rows.map((c, i) => (
                    <Row
                      key={c.id}
                      c={c}
                      first={i === 0}
                      last={i === rows.length - 1}
                      onToggle={toggle}
                      onMove={move}
                      onIcon={setIcon}
                    />
                  ))}
                </tbody>
              </table>
            </div>
          ))}
        </section>

        {/* The customer's view of whatever the table currently says. */}
        <aside className="w-[260px] shrink-0 rounded-[16px] bg-white p-4 shadow-card">
          <h2 className="text-[13px] font-medium">Customer home preview</h2>
          <p className="mt-0.5 text-[11px] text-setl-muted">Live — reflects the toggles on the left.</p>

          <div className="mt-3 overflow-hidden rounded-[12px] bg-setl-surface-2 p-3">
            <p className="text-[11px] font-medium">Home services</p>
            <div className="mt-1.5 flex flex-wrap gap-1.5">
              {onHome.length ? onHome.map((c) => <PreviewCard key={c.id} c={c} />)
                : <span className="py-3 text-[10px] text-setl-muted">Nothing shown</span>}
            </div>

            <p className="mt-3 text-[11px] font-medium">Car services</p>
            <div className="mt-1.5 flex flex-wrap gap-1.5">
              {onCar.length ? onCar.map((c) => <PreviewCard key={c.id} c={c} />)
                : <span className="py-3 text-[10px] text-setl-muted">Nothing shown</span>}
            </div>
          </div>
        </aside>
      </div>
    </div>
  )
}
