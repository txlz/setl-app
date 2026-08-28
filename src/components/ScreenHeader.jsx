// The plain screen header used by most boards in the Figma exports: a white
// screen with a ringed circular back button at left:28 / top:48 (a 44px
// #F8F8F8 disc with a 38px white disc inset) and the title below it.
//
// Use this for content screens. `GradientHeader` is the other variant — the
// tall coloured block — and only a handful of boards use it.
export default function ScreenHeader({ title, subtitle, onBack, right, children }) {
  return (
    <div className="font-poppins flex min-h-screen flex-col bg-white">
      <div className="relative shrink-0 px-7 pt-12">
        <div className="flex items-start gap-3">
          {onBack && (
            <button
              type="button"
              onClick={onBack}
              aria-label="Go back"
              className="relative h-11 w-11 shrink-0 cursor-pointer rounded-full bg-setl-surface-2 active:scale-95"
            >
              {/* 38px white disc inset in the 44px grey disc */}
              <span
                aria-hidden
                className="absolute inset-[3px] flex items-center justify-center rounded-full bg-white"
              >
                <svg width="8" height="14" viewBox="0 0 8 14" fill="none">
                  <path
                    d="M7 1 1 7l6 6"
                    stroke="#061737"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </span>
            </button>
          )}
          {right && <div className="ml-auto">{right}</div>}
        </div>

        {title && (
          <h1 className="mt-5 text-[22px] leading-tight font-semibold text-setl-navy">{title}</h1>
        )}
        {subtitle && <p className="mt-1 text-xs text-setl-muted">{subtitle}</p>}
      </div>

      <div className="flex grow flex-col px-7 pb-6">{children}</div>
    </div>
  )
}
