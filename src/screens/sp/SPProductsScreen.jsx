import { useState } from 'react'
import GradientHeader from '../../components/GradientHeader.jsx'

// "Add recommended products" (WF-7). Providers list the physical items a job
// may need — the worker brings them, and they appear on the customer's
// estimate with a market price for transparency.
export default function SPProductsScreen({ products = [], onAdd, onRemove, onBack }) {
  const [draft, setDraft] = useState({ name: '', price: '', market: '' })
  const valid = draft.name.trim() && Number(draft.price) > 0

  return (
    <GradientHeader title="Recommended products" onBack={onBack} sheetClassName="bg-[#F5F4F7]">
      <div className="font-poppins flex grow flex-col px-4 pb-6">
        <p className="mt-3 text-[12px] text-setl-ink-3">
          Items a customer may need for a job. The market price is shown next to yours so the
          quote reads as fair.
        </p>

        {products.length === 0 && (
          <p className="mt-6 text-center text-[12px] text-setl-muted">No products yet.</p>
        )}

        {products.map((p) => (
          <div key={p.id} className="row-card mt-3 flex items-center gap-3 px-3">
            <span
              aria-hidden
              className="flex h-[35px] w-[35px] shrink-0 items-center justify-center rounded-full bg-setl-surface-3 text-[15px]"
            >
              📦
            </span>
            <div className="min-w-0 grow">
              <p className="truncate text-[14px] font-medium text-setl-ink">{p.name}</p>
              <p className="text-[11px] text-setl-muted">
                AED {p.price}
                {p.market ? ` · market ${p.market}` : ''}
              </p>
            </div>
            <button
              type="button"
              onClick={() => onRemove(p.id)}
              aria-label={`Remove ${p.name}`}
              className="cursor-pointer rounded-[2px] bg-[rgba(217,217,217,0.23)] px-2 py-1 text-[11px] text-setl-red"
            >
              Remove
            </button>
          </div>
        ))}

        <div className="mt-6 rounded-[16px] bg-white p-4 shadow-card-sm">
          <p className="text-[14px] font-medium text-setl-ink">Add a product</p>

          <label className="mt-3 block text-[12px] text-black/78" htmlFor="prod-name">
            Name
          </label>
          <input
            id="prod-name"
            value={draft.name}
            onChange={(e) => setDraft({ ...draft, name: e.target.value })}
            placeholder="Kitchen faucet"
            className="mt-1 h-[41px] w-full rounded-[7px] bg-setl-surface-3 px-3 text-[12px] text-setl-ink outline-none placeholder:text-black/53"
          />

          <div className="mt-3 flex gap-3">
            <div className="grow">
              <label className="block text-[12px] text-black/78" htmlFor="prod-price">
                Your price
              </label>
              <input
                id="prod-price"
                inputMode="numeric"
                value={draft.price}
                onChange={(e) => setDraft({ ...draft, price: e.target.value.replace(/\D/g, '') })}
                placeholder="50"
                className="mt-1 h-[41px] w-full rounded-[7px] bg-setl-surface-3 px-3 text-[12px] text-setl-ink outline-none placeholder:text-black/53"
              />
            </div>
            <div className="grow">
              <label className="block text-[12px] text-black/78" htmlFor="prod-market">
                Market price
              </label>
              <input
                id="prod-market"
                inputMode="numeric"
                value={draft.market}
                onChange={(e) => setDraft({ ...draft, market: e.target.value.replace(/\D/g, '') })}
                placeholder="60"
                className="mt-1 h-[41px] w-full rounded-[7px] bg-setl-surface-3 px-3 text-[12px] text-setl-ink outline-none placeholder:text-black/53"
              />
            </div>
          </div>

          <button
            type="button"
            disabled={!valid}
            onClick={() => {
              onAdd({
                id: `p${Date.now()}`,
                name: draft.name.trim(),
                price: Number(draft.price),
                market: Number(draft.market) || null,
              })
              setDraft({ name: '', price: '', market: '' })
            }}
            className="brand-hero mt-4 h-10 w-full cursor-pointer rounded-[12px] text-[15px] font-medium text-white disabled:opacity-40"
          >
            Add product
          </button>
        </div>
      </div>
    </GradientHeader>
  )
}
