import { useState } from 'react'
import ScreenHeader from '../../components/ScreenHeader.jsx'
import GradientButton from '../../components/GradientButton.jsx'

// WF-8's last step: the worker proves the job is done before it can be
// marked complete. Photos are held in memory as object URLs — there is no
// upload target yet, and the prototype should not pretend otherwise.
export default function ProviderCompleteScreen({ order, onComplete, onBack }) {
  const [photos, setPhotos] = useState([])
  const [note, setNote] = useState('')

  function addPhotos(files) {
    const next = [...files].slice(0, 4 - photos.length).map((f) => ({
      id: `${f.name}-${f.size}-${Date.now()}`,
      url: URL.createObjectURL(f),
    }))
    setPhotos((cur) => [...cur, ...next])
  }

  return (
    <ScreenHeader title="Complete the job" subtitle={order?.service} onBack={onBack}>
      <div className="flex grow flex-col pt-1">
        <p className="text-[12px] text-setl-ink-3">
          Add a photo or two of the finished work. The customer sees these with their invoice.
        </p>

        <div className="mt-4 grid grid-cols-2 gap-3">
          {photos.map((p) => (
            <div key={p.id} className="relative h-28 overflow-hidden rounded-[11px] bg-setl-surface-3">
              <img src={p.url} alt="" className="h-full w-full object-cover" />
              <button
                type="button"
                aria-label="Remove photo"
                onClick={() => setPhotos((cur) => cur.filter((x) => x.id !== p.id))}
                className="absolute top-1.5 right-1.5 flex h-6 w-6 cursor-pointer items-center justify-center rounded-full bg-black/55 text-[13px] text-white"
              >
                ×
              </button>
            </div>
          ))}

          {photos.length < 4 && (
            <label className="flex h-28 cursor-pointer flex-col items-center justify-center gap-1 rounded-[11px] border border-dashed border-setl-line-3 bg-white text-setl-muted">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#8d8d8d" strokeWidth="1.7" strokeLinecap="round">
                <path d="M12 6v12M6 12h12" />
              </svg>
              <span className="text-[11px]">Add photo</span>
              <input
                type="file"
                accept="image/*"
                multiple
                className="sr-only"
                onChange={(e) => {
                  addPhotos(e.target.files ?? [])
                  e.target.value = ''
                }}
              />
            </label>
          )}
        </div>

        <label className="mt-5 block text-[14px] font-medium text-setl-ink" htmlFor="cj-note">
          Notes for the customer
        </label>
        <textarea
          id="cj-note"
          rows={3}
          value={note}
          onChange={(e) => setNote(e.target.value)}
          placeholder="What you did, and anything they should know"
          className="mt-2 w-full resize-none rounded-[11px] border-[0.5px] border-setl-line-2 bg-white px-3 py-2.5 text-[13px] text-setl-ink outline-none placeholder:text-setl-muted-3 focus:border-setl-violet"
        />

        <div className="grow" />
        <GradientButton
          disabled={photos.length === 0}
          onClick={() => onComplete(order, { photos: photos.length, note: note.trim() })}
        >
          Mark job complete
        </GradientButton>
        {photos.length === 0 && (
          <p className="mt-2 text-center text-[11px] text-setl-muted">
            At least one photo is needed to close the job
          </p>
        )}
      </div>
    </ScreenHeader>
  )
}
