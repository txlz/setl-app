import { useState } from 'react'
import ScreenHeader from '../components/ScreenHeader.jsx'
import GradientButton from '../components/GradientButton.jsx'
import { PEST_TYPES, SPREAD_LEVELS, pestTaskPrice } from '../data/providers.js'

const MAX_ROOMS = 9

// The board's flow (desing_html/pest.html):
//   a list of pests, each row carrying an "Add" chip and a task count
//     -> tap Add: "How many infected rooms?"   (room stepper)
//     -> then "extent of spread room N?"       (wide / middle / small slider)
//     -> "Applye" writes that pest's tasks back to the row
//   the row then reads "N tasks" instead of "NO TASK".
//
// Severity is asked PER ROOM, not once per pest, which is why a pest's tasks
// are stored as an array of levels with one entry per room.
function SpreadSlider({ value, onChange }) {
  // The board draws wide on the left and small on the right.
  const stops = [...SPREAD_LEVELS].reverse()
  const pos = Math.max(0, stops.findIndex((l) => l.key === value))

  return (
    <div className="mt-3">
      <div className="relative h-[17px]">
        <div className="absolute top-[8px] h-px w-full bg-black/34" />
        <div
          className="absolute top-[7px] h-[3px] rounded-full bg-setl-violet transition-all"
          style={{ width: `${(pos / (stops.length - 1)) * 100}%` }}
        />
        {stops.map((l, i) => {
          const on = l.key === value
          return (
            <button
              key={l.key}
              type="button"
              aria-label={l.label}
              aria-pressed={on}
              onClick={() => onChange(l.key)}
              className="absolute top-0 -ml-[8px] flex h-[17px] w-[17px] cursor-pointer items-center justify-center rounded-full border-2 bg-white transition-colors"
              style={{
                left: `${(i / (stops.length - 1)) * 100}%`,
                borderColor: on ? '#7E43FF' : 'rgba(0,0,0,0.34)',
              }}
            >
              {on && <span className="block h-[7px] w-[7px] rounded-full bg-setl-violet" />}
            </button>
          )
        })}
      </div>
      <div className="mt-1.5 flex justify-between text-[12px] font-medium text-black">
        {stops.map((l) => (
          <span key={l.key}>{l.label}</span>
        ))}
      </div>
    </div>
  )
}

// "Add pest control" — the sheet the board opens from a row's Add chip.
function AddPestSheet({ pest, initial, onApply, onClose }) {
  const [levels, setLevels] = useState(initial.length ? initial : ['middle'])
  const rooms = levels.length

  function setRoomCount(n) {
    const next = Math.min(MAX_ROOMS, Math.max(1, n))
    setLevels((cur) => {
      const copy = cur.slice(0, next)
      while (copy.length < next) copy.push('middle')
      return copy
    })
  }

  const total = levels.reduce((s, lv) => s + pestTaskPrice(pest, lv), 0)

  return (
    <div
      className="fade-enter absolute inset-0 z-40 flex items-end"
      style={{ background: 'rgba(23,5,5,0.31)', backdropFilter: 'blur(1.5px)' }}
    >
      <button type="button" aria-label="Close" onClick={onClose} className="absolute inset-0 cursor-default" />
      <div className="sheet-enter relative max-h-[86%] w-full overflow-y-auto rounded-t-[16px] bg-white p-5">
        <div className="flex items-center gap-2.5">
          <span
            aria-hidden
            className="flex h-[35px] w-[35px] shrink-0 items-center justify-center rounded-full text-[15px]"
            style={{ background: pest.color }}
          >
            {pest.icon}
          </span>
          <p className="text-[14px] font-medium text-setl-ink">{pest.label}</p>
        </div>

        {/* pest.html:37 — 14px/500 rgba(0,0,0,.66) */}
        <p className="mt-4 text-[14px] font-medium text-black/66">How many infected rooms?</p>
        <div className="mt-2 flex items-center gap-2">
          <button
            type="button"
            aria-label="fewer rooms"
            onClick={() => setRoomCount(rooms - 1)}
            className="h-9 w-9 cursor-pointer rounded-[9px] bg-setl-surface-3 text-[15px] text-setl-ink-3 active:scale-95"
          >
            &minus;
          </button>
          {/* pest.html — the grey pill: 112x32 r4, value 11px, label 12px */}
          <span className="flex h-8 w-[112px] items-center justify-center gap-1.5 rounded-[4px] bg-[rgba(231,228,228,0.48)]">
            <span className="text-[11px] font-medium text-black">{rooms}</span>
            <span className="text-[12px] text-black/39">{rooms === 1 ? 'room' : 'rooms'}</span>
          </span>
          <button
            type="button"
            aria-label="more rooms"
            onClick={() => setRoomCount(rooms + 1)}
            className="h-9 w-9 cursor-pointer rounded-[9px] bg-setl-surface-3 text-[15px] text-setl-ink-3 active:scale-95"
          >
            +
          </button>
        </div>

        {/* One slider per room — the board asks each room's spread in turn */}
        {levels.map((lv, i) => (
          <div key={i} className="mt-5">
            <p className="text-[14px] font-medium text-black/66">extent of spread room {i + 1}?</p>
            <SpreadSlider
              value={lv}
              onChange={(next) => setLevels((cur) => cur.map((x, j) => (j === i ? next : x)))}
            />
          </div>
        ))}

        <div className="mt-6 flex items-center justify-between">
          <span className="text-[14px] text-setl-ink-3">
            {rooms} {rooms === 1 ? 'task' : 'tasks'} &middot; AED {total}
          </span>
          {/* The board labels this "Applye"; we keep correct English. */}
          <button
            type="button"
            onClick={() => onApply(levels)}
            className="brand-hero h-10 w-[127px] cursor-pointer rounded-[12px] text-[17px] font-medium text-white active:opacity-90"
          >
            Apply
          </button>
        </div>
      </div>
    </div>
  )
}

export default function PestControlScreen({ pests, setPests, onSearchProviders, onBack }) {
  const [editing, setEditing] = useState(null)

  const configured = PEST_TYPES.filter((p) => (pests[p.key] ?? []).length > 0)
  const totalTasks = configured.reduce((s, p) => s + pests[p.key].length, 0)
  const total = configured.reduce(
    (s, p) => s + pests[p.key].reduce((t, lv) => t + pestTaskPrice(p, lv), 0),
    0,
  )

  return (
    <ScreenHeader title="Pest control" subtitle="Add the pests you need treated" onBack={onBack}>
      <div className="flex grow flex-col pt-1">
        {PEST_TYPES.map((pest) => {
          const rooms = pests[pest.key] ?? []
          return (
            <div key={pest.key} className="row-card mb-5 flex items-center gap-[15px] px-3">
              {/* Ellipse 165 — a 35px disc in the pest's own colour */}
              <span
                aria-hidden
                className="flex h-[35px] w-[35px] shrink-0 items-center justify-center rounded-full text-[15px]"
                style={{ background: pest.color }}
              >
                {pest.icon}
              </span>
              <p className="grow text-[14px] font-medium text-setl-ink">{pest.label}</p>
              <span className="text-[11px] text-black/43">
                {rooms.length ? `${rooms.length} ${rooms.length === 1 ? 'task' : 'tasks'}` : 'NO TASK'}
              </span>
              <button
                type="button"
                aria-label={`Add ${pest.label}`}
                onClick={() => setEditing(pest)}
                className="cursor-pointer text-[22px] font-medium text-setl-violet"
              >
                +
              </button>
            </div>
          )
        })}

        <div className="grow" />

        {totalTasks > 0 && (
          <div className="mb-3 flex items-center justify-between rounded-[11px] bg-setl-surface-3 px-4 py-3">
            <span className="text-[12px] text-setl-ink-3">
              {totalTasks} {totalTasks === 1 ? 'task' : 'tasks'} across {configured.length}{' '}
              {configured.length === 1 ? 'pest' : 'pests'}
            </span>
            <span className="text-[15px] font-semibold text-setl-violet">AED {total}</span>
          </div>
        )}

        <GradientButton onClick={onSearchProviders} disabled={totalTasks === 0}>
          Search for providers
        </GradientButton>
        {totalTasks === 0 && (
          <p className="mt-2 text-center text-[11px] text-setl-muted">
            Add at least one pest to search for providers
          </p>
        )}
      </div>

      {editing && (
        <AddPestSheet
          pest={editing}
          initial={pests[editing.key] ?? []}
          onClose={() => setEditing(null)}
          onApply={(levels) => {
            setPests({ ...pests, [editing.key]: levels })
            setEditing(null)
          }}
        />
      )}
    </ScreenHeader>
  )
}
