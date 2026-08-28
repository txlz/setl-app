// The tall coloured header from the Figma boards: a 222px block with a 30px
// radius, a centred 17px white title sitting at y=64, and a white content
// sheet that starts at y=100 with a 29px radius — so the sheet overlaps the
// block rather than butting up against it.
//
// Only a few boards use this (the booking/summary screens). Content screens
// use `ScreenHeader`, the plain white variant.
export default function GradientHeader({ title, onBack, children, sheetClassName = 'bg-white' }) {
  return (
    <div className="relative flex min-h-screen flex-col">
      {/* Coloured block — 222 tall, radius 30 */}
      <div className="brand-header absolute inset-x-0 top-0 h-55.5 rounded-b-[40px]" aria-hidden />

      <div className="relative shrink-0" style={{ height: 100 }}>
        {onBack && (
          <button
            type="button"
            onClick={onBack}
            aria-label="Go back"
            className="absolute top-14 left-4 cursor-pointer p-2 text-white active:scale-95"
          >
            <svg width="10" height="18" viewBox="0 0 10 18" fill="none">
              <path d="M9 1 2 9l7 8" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
            </svg>
          </button>
        )}
        {/* Title sits at y=64 in the exports */}
        <h1 className="absolute inset-x-0 top-16 text-center text-[17px] font-medium text-white">
          {title}
        </h1>
      </div>

      {/* White sheet slides over the block from y=100, radius 29 */}
      <div className={`relative flex grow flex-col rounded-t-[29px] pt-6 ${sheetClassName}`}>
        {children}
      </div>
    </div>
  )
}
