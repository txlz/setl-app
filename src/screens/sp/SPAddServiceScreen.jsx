import { useState } from 'react'
import GradientHeader from '../../components/GradientHeader.jsx'
import { PROVIDER_SERVICES } from '../../data/providers.js'

// "Add service" — the SP-side form from the boards (5.js:1484-1501):
// Name, price, Discount and description stacked as 311x41 fields (the
// description 311x89), labels 15px rgba(0,0,0,.78), values 12px, and a
// 113x40 "send" button. The board also carries "The price is in hours"
// (5.js:1241), so pricing can be hourly instead of fixed.
const FIELD = 'mt-1 h-[41px] w-full rounded-[7px] bg-setl-surface-3 px-3 text-[12px] text-setl-ink outline-none placeholder:text-black/53 focus:ring-1 focus:ring-setl-violet'
const LABEL = 'mt-4 block text-[15px] text-black/78'

export default function SPAddServiceScreen({ services = [], onAdd, onBack }) {
  const [form, setForm] = useState({
    service: services[0] ?? PROVIDER_SERVICES[0],
    label: '',
    price: '',
    discount: '',
    description: '',
    hourly: false,
    where: 'Indoor',
  })

  const valid = form.label.trim() && Number(form.price) > 0

  function set(patch) {
    setForm((f) => ({ ...f, ...patch }))
  }

  return (
    <GradientHeader title="Add service" onBack={onBack} sheetClassName="bg-[#F5F4F7]">
      <div className="font-poppins flex grow flex-col px-4 pb-6">
        {/* Which of the company's services this job belongs to */}
        <label className={LABEL} htmlFor="svc-parent">
          Service
        </label>
        <select
          id="svc-parent"
          value={form.service}
          onChange={(e) => set({ service: e.target.value })}
          className={FIELD}
        >
          {(services.length ? services : PROVIDER_SERVICES).map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>

        <label className={LABEL} htmlFor="svc-name">
          Name
        </label>
        <input
          id="svc-name"
          value={form.label}
          onChange={(e) => set({ label: e.target.value })}
          placeholder="Premium wash"
          className={FIELD}
        />

        <label className={LABEL} htmlFor="svc-price">
          price
        </label>
        <input
          id="svc-price"
          inputMode="numeric"
          value={form.price}
          onChange={(e) => set({ price: e.target.value.replace(/\D/g, '') })}
          placeholder="12"
          className={FIELD}
        />

        {/* 5.js:1241 — "The price is in hours" */}
        <label className="mt-3 flex cursor-pointer items-center gap-2.5">
          <input
            type="checkbox"
            checked={form.hourly}
            onChange={(e) => set({ hourly: e.target.checked })}
            className="h-4 w-4 accent-setl-violet"
          />
          <span className="text-[13px] text-black/78">The price is in hours</span>
        </label>

        <label className={LABEL} htmlFor="svc-discount">
          Discount
        </label>
        <input
          id="svc-discount"
          inputMode="numeric"
          value={form.discount}
          onChange={(e) => set({ discount: e.target.value.replace(/\D/g, '') })}
          placeholder="0"
          className={FIELD}
        />

        <label className={LABEL} htmlFor="svc-desc">
          description
        </label>
        <textarea
          id="svc-desc"
          rows={3}
          value={form.description}
          onChange={(e) => set({ description: e.target.value })}
          placeholder="What the job includes"
          className="mt-1 h-[89px] w-full resize-none rounded-[7px] bg-setl-surface-3 px-3 py-2 text-[12px] text-setl-ink outline-none placeholder:text-black/53 focus:ring-1 focus:ring-setl-violet"
        />

        {/* Where the work is performed (APPS_AND_WORKFLOW WF-7) */}
        <p className={LABEL}>Where it is performed</p>
        <div className="mt-1 flex gap-3">
          {['Indoor', 'Outdoor', 'Villa'].map((w) => (
            <button
              key={w}
              type="button"
              onClick={() => set({ where: w })}
              className={`flex h-[27px] w-[66px] items-center justify-center rounded-[11px] border-[0.5px] bg-white text-[12px] ${
                form.where === w
                  ? 'border-setl-violet text-setl-violet'
                  : 'border-setl-line-2 text-setl-muted-2'
              }`}
            >
              {w}
            </button>
          ))}
        </div>

        <div className="grow" />

        {/* 5.js:1501 — the board's 113x40 "send" */}
        <button
          type="button"
          disabled={!valid}
          onClick={() =>
            onAdd(form.service, {
              label: form.label.trim(),
              price: Number(form.price),
              discount: Number(form.discount) || 0,
              description: form.description.trim(),
              hourly: form.hourly,
              where: form.where,
            })
          }
          className="brand-hero mx-auto mt-6 h-10 w-[113px] cursor-pointer rounded-[12px] text-[15px] font-medium text-white disabled:opacity-40"
        >
          send
        </button>
        {!valid && (
          <p className="mt-2 text-center text-[11px] text-setl-muted">
            A name and a price are needed to add the service
          </p>
        )}
      </div>
    </GradientHeader>
  )
}
