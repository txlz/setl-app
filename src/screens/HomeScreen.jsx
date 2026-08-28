import ScrollRow from '../components/ScrollRow.jsx'
import { CUSTOMER_ME } from '../data/providers.js'
import acImg from '../assets/ac.png'
import sinkImg from '../assets/sink.png'
import electricImg from '../assets/electric.png'
// Service photography lifted from the Figma boards.
import cleaningImg from '../assets/services/cleaning.png'
import pestImg from '../assets/services/pest.png'
import carwashImg from '../assets/services/carwash.png'
import carpolishImg from '../assets/services/carpolish.png'
import carglassImg from '../assets/services/carglass.png'

// The real catalog from the FigJam board — every card opens a working flow.
// `photo` fills the card edge-to-edge (real service photography); `img` is a
// product cut-out that sits on a light tile; `gradient` is the fallback.
const HOME_SERVICES = [
  { name: 'AC cleaning & refilling', img: acImg, target: 'acService' },
  { name: 'House cleaning', photo: cleaningImg, target: 'cleaningService' },
  { name: 'Plumber', img: sinkImg, target: 'plumberProviders' },
  { name: 'Electrician', img: electricImg, target: 'options:electrician' },
  { name: 'Pest control', photo: pestImg, target: 'pestControl' },
  { name: 'Technician', gradient: 'linear-gradient(135deg,#B25B0E,#E8A34C)', target: 'options:technician' },
  { name: 'Network technician', gradient: 'linear-gradient(135deg,#1D8FC4,#6BD0F0)', target: 'options:network' },
  { name: 'Curtains', gradient: 'linear-gradient(135deg,#B23A0E,#E88B4C)', target: 'options:curtains' },
  { name: 'Outdoor furniture', gradient: 'linear-gradient(135deg,#3A7D2C,#8FC46B)', target: 'options:outdoor' },
]

const CAR_SERVICES = [
  { name: 'car wash', photo: carwashImg, target: 'carWash' },
  { name: 'car polish', photo: carpolishImg, target: 'carWash' },
  { name: 'glass & windows', photo: carglassImg, target: 'carWash' },
]

function ServiceCard({ service, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`relative h-[115px] w-[146px] shrink-0 overflow-hidden rounded-[5px] bg-setl-surface-3 text-left ${onClick ? 'cursor-pointer' : 'cursor-default'}`}
      style={service.gradient ? { background: service.gradient } : undefined}
    >
      {service.photo && (
        <img src={service.photo} alt="" className="h-full w-full object-cover" />
      )}
      {service.img && (
        <img src={service.img} alt="" className="h-full w-full object-contain p-3 pb-8" />
      )}
      {/* Label plate: 1.html:1370 — "Rectangle 944", 146x26.9, flat
          rgba(0,0,0,0.11) with a 1.5px backdrop blur and a 5px bottom radius.
          The board uses a frosted bar here, not a gradient scrim.
          Every tile on the board is dark photography, so an 11%-black plate
          carries white text fine. Our product cut-outs (`img`) sit on a pale
          #F3F3F3 tile instead, where that plate leaves white text at ~1.2:1 —
          so those keep the plate's geometry but take dark ink. */}
      <span
        aria-hidden
        className={`pointer-events-none absolute inset-x-0 bottom-0 h-[27px] rounded-b-[5px] backdrop-blur-[1.5px] ${
          service.img ? 'bg-white/55' : 'bg-black/11'
        }`}
      />
      {/* 1.html:1371 — 9px / weight 500 / white, inset 12px from the tile edge. */}
      <span
        className={`absolute inset-x-0 bottom-2 truncate px-3 text-[9px] font-medium ${
          service.img ? 'text-setl-ink' : 'text-white'
        }`}
      >
        {service.name}
      </span>
    </button>
  )
}

export default function HomeScreen({ onOpenService }) {
  return (
    <div className="font-poppins relative flex min-h-screen flex-col bg-setl-surface-2">
      {/* Header block: 375x222, radius 40, the boards' pink -> blue gradient. */}
      <div aria-hidden className="brand-header absolute inset-x-0 top-0 h-[222px] rounded-b-[40px]" />

      {/* Header row — the export puts the menu at x=28/y=63, the pin at x=82,
          the label at x=110 (17px, regular) and the bell at x=324/y=66. */}
      <div className="relative shrink-0" style={{ height: 130 }}>
        <button
          type="button"
          aria-label="Menu"
          className="absolute cursor-pointer"
          style={{ left: 28, top: 63 }}
        >
          <svg width="27" height="25" viewBox="0 0 27 25" fill="none" stroke="#fff" strokeWidth="3" strokeLinecap="round">
            <path d="M1 3h17M1 12.5h17M1 22h17" />
            <path d="M24 3h.01M24 12.5h.01M24 22h.01" />
          </svg>
        </button>

        <button
          type="button"
          className="absolute flex cursor-pointer items-center gap-2 text-[17px] font-normal text-white"
          style={{ left: 82, top: 60 }}
        >
          <svg width="19" height="19" viewBox="0 0 18 22" fill="none" stroke="#E4C9FF" strokeWidth="1.8">
            <path d="M9 1a7 7 0 0 1 7 7c0 5-7 12.5-7 12.5S2 13 2 8a7 7 0 0 1 7-7Z" />
            <circle cx="9" cy="8" r="2.5" />
          </svg>
          {CUSTOMER_ME.area}
          <svg width="11" height="7" viewBox="0 0 12 8" fill="#fff"><path d="M6 8 0 0h12L6 8Z" /></svg>
        </button>

        <button
          type="button"
          aria-label="Notifications"
          className="absolute cursor-pointer"
          style={{ left: 324, top: 66 }}
        >
          <svg width="24" height="24" viewBox="0 0 22 24" fill="none" stroke="#fff" strokeWidth="1.8">
            <path d="M11 3a6 6 0 0 1 6 6c0 5 2 6.5 2 6.5H3S5 14 5 9a6 6 0 0 1 6-6ZM9 19.5a2.2 2.2 0 0 0 4 0" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          <span className="absolute top-0 right-0 h-2.5 w-2.5 rounded-full bg-setl-red" />
        </button>
      </div>

      {/* Content sheet: starts at y=118, radius 48, #F8F8F8 (from the export). */}
      <div className="relative grow rounded-t-[48px] bg-setl-surface-2 px-6 pt-7 pb-28">
        {/* Search */}
        <div className="flex h-[55px] items-center gap-3 rounded-[11px] bg-white px-4 shadow-card-sm">
          <svg width="20" height="20" viewBox="0 0 22 22" fill="none" stroke="#9C9AA5" strokeWidth="2">
            <circle cx="9" cy="9" r="6.5" />
            <path d="m14.5 14.5 5 5" strokeLinecap="round" />
          </svg>
          <input
            type="search"
            placeholder="Smart home installation"
            className="w-full bg-transparent text-[13px] text-setl-ink outline-none placeholder:text-setl-muted-3"
          />
        </div>

        {/* Intent-first entry (decision D): for the "something's broken" user */}
        <button
          type="button"
          onClick={() => onOpenService('wizard')}
          className="brand-cta mt-4 flex w-full cursor-pointer items-center justify-between rounded-[15px] p-4 text-left text-white shadow-[0_4px_14px_rgba(132,66,255,0.30)] active:scale-[0.99]"
        >
          <span>
            <span className="block text-[15px] font-medium">Something broken?</span>
            <span className="mt-0.5 block text-[12px] text-white/85">
              Get it fixed — answer 2 quick questions
            </span>
          </span>
          <svg width="10" height="18" viewBox="0 0 10 18" fill="none">
            <path d="m1 1 8 8-8 8" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" />
          </svg>
        </button>

        {/* Promo banner: 1.html:1343-1345 — 320x111 at left 27, radius 15.
            The board stacks two translucent washes (1344, 1345) over the
            violet fill; they're flattened into the single gradient below.
            Copy sits 10px in / 15px down from the banner's top-left. */}
        <div className="mt-4 h-[111px] rounded-[15px] bg-linear-[240deg,rgba(126,67,255,0.39)_0%,rgba(108,99,255,0.58)_100%] bg-setl-violet px-2.5 pt-[15px] text-white">
          {/* 1.html:1363 — 254px wide, 12px, weight 400. */}
          <p className="w-[254px] text-[12px] leading-snug">
            Earn 10 dirhams for every friend who orders a favor with your code
          </p>
          {/* 1.html:1362 — "view All", 12px, weight 500, 45px below the copy. */}
          <p className="mt-3 text-[12px] font-medium">View all</p>
          {/* 1.html:1346-1360 — a 15x3 white pill then three 3px dots on a 9px pitch. */}
          <div className="mt-2.5 flex items-center justify-center gap-1.5">
            <span className="h-[3px] w-[15px] rounded-full bg-white" />
            <span className="h-[3px] w-[3px] rounded-full bg-white/50" />
            <span className="h-[3px] w-[3px] rounded-full bg-white/50" />
            <span className="h-[3px] w-[3px] rounded-full bg-white/50" />
          </div>
        </div>

        {/* Home services: 1.html:1364-1365 — white, radius 7, shadow
            0 4px 33px rgba(0,0,0,.05) (= .shadow-card), title 16px/500 in
            black, inset 12px from the card edge. */}
        <section className="mt-5 rounded-[7px] bg-white px-3 py-4 shadow-card">
          <h2 className="text-[16px] font-medium text-setl-ink">Home services</h2>
          <ScrollRow className="mt-3">
            {HOME_SERVICES.map((s) => (
              <ServiceCard
                key={s.name}
                service={s}
                onClick={s.target ? () => onOpenService(s.target) : undefined}
              />
            ))}
          </ScrollRow>
        </section>

        {/* Car services: 1.html:1375-1376 — same card treatment as above. */}
        <section className="mt-5 rounded-[7px] bg-white px-3 py-4 shadow-card">
          <h2 className="text-[16px] font-medium text-setl-ink">Car services</h2>
          <ScrollRow className="mt-3">
            {CAR_SERVICES.map((s) => (
              <ServiceCard
                key={s.name}
                service={s}
                onClick={s.target ? () => onOpenService(s.target) : undefined}
              />
            ))}
          </ScrollRow>
        </section>
      </div>
    </div>
  )
}
