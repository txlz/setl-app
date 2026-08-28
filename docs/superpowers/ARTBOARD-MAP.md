# Where each screen's artboard actually lives

Hard-won during the customer-app fidelity pass. The `desing_html/` export is
**partial and mislabelled**, so trust this file over layer names.

## Rules that cost us time

- **`data-layer` names lie.** The three `"rooms cleaning"` artboards at
  `1.html:1`, `:42`, `:126` are **pest control** boards ("Add pest control",
  "Cockroach control", "How many infected rooms?"). A stale Figma label.
- **No file is scoped to one app or role.** `3.js` holds the OTP screen next
  to provider dispatch screens; `4.js` mixes customer booking with other work.
- **`4.js` and `5.js` are the Arabic boards.** Geometry and type still apply.
- **`2.jsx` duplicates `1.html`.** Skip it.
- Files run to ~16MB. Always `grep -n` first, then `sed -n 'A,Bp'`. Never read
  one whole — it has killed several agents mid-task.

## Confirmed locations

| Screen | Artboard | Notes |
|---|---|---|
| Login | **none** | Exhaustively searched: no login board exists anywhere. |
| OTP | `3.js:51-63` | Title 20/600, subtitle 12 @60% black, box 342x48 r12 #F9F9F9, underlines 25px, digits 22.5/300. |
| Location | **none standalone** | Only as a section inside the OrderDetails board, `1.html:805-816`. |
| Home | `1.html:1343-1384` | Banner 320x111 r15 @left 27; tile label plate "Rectangle 944" 146x26.9 rgba(0,0,0,.11) blur 1.5 r-b 5; labels 9/500; section cards r7 + `0 4px 33px rgba(0,0,0,.05)`. |
| AC service | **none** | No AC/refill/air-conditioner board in any file. |
| House cleaning | `4.js:838` (frame), labels `4.js:982-987` | 375x812 on #F9F9F9. Content labels **13px/500 #0D0000**; the single 14px is the centred screen title. Numerals `4.js:594` 15/400 #B3B3B3. No gradient anywhere on this board. |
| Pest control |  `1.html:1557-1721` | Row cards 336x55 r11 `0 0 13px rgba(0,0,0,.05)` (`:1587`); row title 14/500 rgba(0,0,0,.95) (`:1602`); meta 11/400 (`:1594`); CTA r12. |
| Car wash | **none** | The builder has no board. Every "Basic wash" hit sits at `left: 381` — off-canvas leftovers. `4.js:1` is a *providers-list* board ("servicies provider"), `5.js:1419` a provider-side "Add Services" form, `1.html:1554` a Home section heading, `1.html:1385` a Home tile. Extras rows inherit the pest row-card spec. |
| Providers list | search `"Most Ordred"` (sic), `"Available Today at 10.00 Am"` | Typo is the artboard's own. |
| Order details | `1.html:805-816` (+ `1.html:1055`, `4.js:1149/1399` — identical copies) | Also `"Booking Details"`, `"Applye"` (sic) in `4.js`. |

## Convention notes settled by review

- Arbitrary pixel classes (`text-[13px]`) are the house style. The editor's
  "can be written as `h-6.75`" lint is deliberately ignored.
- Opacity colours (`text-black/60`) are for **scrims over imagery only**. For
  flat ink use the nearest `--color-setl-*` token.
- The app's dominant CTA gradient is
  `bg-linear-[270deg,#366EE9_-95.36%,#F15CFA_212.48%]` (5 uses). `.brand-cta`
  is a *different* violet→magenta gradient — swapping between them is a visual
  change, not a tokenisation.
- Cite the export line you derived a value from, as `HomeScreen`/`OtpScreen` do.

## Shared-component mismatches (deferred — need one coordinated decision)

These affect many screens at once, so per-screen tasks flag them rather than
changing them. Settle them in a dedicated pass.

- **`ScreenHeader` horizontal inset.** Uses `px-7` (28px); the boards put cards
  at **left 20, width 336** — 14 such cards in `1.html`, and **zero** at left 28.
  Rows on `ScreenHeader` screens therefore measure 319px instead of 336px.
  Changing it touches 6 screens.
- **`ScreenHeader` back button.** Its comment claims "left:28 / top:48", but the
  boards' back arrows sit at **left 16, top 47-48**. The 44px ringed disc it
  draws appears **nowhere in the export** (checked all four files) — an app
  invention, so restyling it is a design decision, not a fidelity fix.
- **`ScreenHeader` title.** Renders `text-[22px]`; board screen titles are
  17px/500 (gradient variant) or 14px/500 centred (e.g. the cleaning board's).
- **`GradientButton`.** `h-[52px]`; the pest board's CTA is 261x43.74 at
  radius 12, while the export's `Primary Normal` component is 311x52 — the
  export disagrees with itself, so this needs a judgement call, not a match.

## Data gaps noticed (not fixed — `providers.js` is out of scope for style tasks)

- `PEST_TYPES` has no `color` field, so pest medallions render grey with an
  emoji. The board gives each a solid fill: `#D142FA` cockroach, `#EB4D4B`
  mice, `#10D830` ant, `#1AAAE9` mosquito, `#FFA800` lizards, `#751AE9` anti.
