import { useState } from 'react'
import ScreenHeader from '../components/ScreenHeader.jsx'
import GradientButton from '../components/GradientButton.jsx'

// WF-9 — raising a problem on an order. The customer files it, the provider
// sees it on their side, and admin can step in; the report is recorded on the
// order's history so every app reads the same account of what happened.
const REASONS = [
  'The provider did not arrive',
  'The work is unfinished or poor quality',
  'I was charged the wrong amount',
  'Something was damaged',
  'The provider behaved unprofessionally',
  'Something else',
]

export default function ProblemScreen({ order, onSubmit, onBack }) {
  const [reason, setReason] = useState(null)
  const [note, setNote] = useState('')

  return (
    <ScreenHeader title="Report a problem" subtitle={order ? order.service : undefined} onBack={onBack}>
      <div className="flex grow flex-col pt-1">
        <p className="text-[12px] text-setl-ink-3">
          Tell us what went wrong. Setl reviews every report and can refund or re-book the job.
        </p>

        <p className="mt-5 text-[14px] font-medium text-setl-ink">What happened?</p>
        <div className="mt-2">
          {REASONS.map((r) => {
            const on = reason === r
            return (
              <button
                key={r}
                type="button"
                onClick={() => setReason(r)}
                className={`mb-2 flex w-full cursor-pointer items-center gap-3 rounded-[11px] border-[0.5px] bg-white px-3 py-3 text-left transition-colors ${
                  on ? 'border-setl-violet' : 'border-setl-line-2'
                }`}
              >
                <span
                  aria-hidden
                  className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-[1.5px]"
                  style={{
                    borderColor: on ? '#7E43FF' : 'rgba(0,0,0,0.34)',
                    background: on ? '#7E43FF' : 'transparent',
                  }}
                >
                  {on && <span className="block h-[7px] w-[7px] rounded-full bg-white" />}
                </span>
                <span className={`text-[13px] ${on ? 'text-setl-violet' : 'text-setl-ink'}`}>{r}</span>
              </button>
            )
          })}
        </div>

        <label className="mt-3 block text-[14px] font-medium text-setl-ink" htmlFor="pb-note">
          Anything else we should know?
        </label>
        <textarea
          id="pb-note"
          rows={4}
          value={note}
          onChange={(e) => setNote(e.target.value)}
          placeholder="Optional — the more detail, the faster we can settle it"
          className="mt-2 w-full resize-none rounded-[11px] border-[0.5px] border-setl-line-2 bg-white px-3 py-2.5 text-[13px] text-setl-ink outline-none placeholder:text-setl-muted-3 focus:border-setl-violet"
        />

        <div className="grow" />
        <GradientButton disabled={!reason} onClick={() => onSubmit(reason, note.trim())}>
          Submit report
        </GradientButton>
        {!reason && (
          <p className="mt-2 text-center text-[11px] text-setl-muted">
            Pick what happened to submit
          </p>
        )}
      </div>
    </ScreenHeader>
  )
}
