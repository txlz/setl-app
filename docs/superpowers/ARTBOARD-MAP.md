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
| Providers list | **`1.html:363`** (frame `عرض الموفرين`, title "servicies provider" `:643`) | Single-column list; card 333 wide at left 21, r9 (`:499`); card pitch 219px (`:500`/`:557`); name 15/400; availability 11px; chip r3 on `rgba(217,217,217,.56)`. NOT `1.html:1386+`, which is a denser 2-up grid. Typo "Most Ordred" is the board's own. |
| Order details | **`1.html:684-894`** (English "Review Summary" — the only complete iteration; it alone has the Total block `:889-891` and CTA `:892`). Arabic twins: `1.html:1001/:1048`, `4.js:1095/:1142/:1345/:1392` | Detail cards r5 + `0 4px 4px rgba(0,0,0,.03)` (`:795`); headings 14/500 `#0D0000`; body ramp 12px; total 15/700 violet (`:891`); voucher Apply 11px white (`:751`). Title "Booking Details" 17/500 white (`4.js:492`). |
| Worker job flow | `3.js:515-1113` | Four frames. `:515-584` "order detailes" -> `ProviderOrderScreen` (heading 15/500 `:553`; rows label 12/500 rgba(0,0,0,.80) `:558`, value 12/400 `#A8A3A3` `:559`; cards r20 `:543`; Maps 9/500 violet underline `:547`). `:585-632` frame 32 -> `ProviderNavigateScreen` (title 16/700 `:624`; KM/min strip 337x47 r5 `rgba(126,67,255,.07)` `:614` with 14/500 `#7E43FF` `:622`/`:623`; map chip 124x33 `0 2px 5px rgba(0,0,0,.20)` `:619-621`; CTA 236x46 r12 `:612`). `:633-636` frame 38 -> `WaitingApprovalScreen` (64px League Spartan 600 white `:634`). `:637-1113` frames 40-43 -> `ProviderJobScreen`; **frame 42 (`:847-994`) is the most complete** (only one with the Pricing/Quantity stepper card `:964-993`). Title 20/500 `#202020` `:669`; duration pill 42x20 r10 `#FFA800`@57% under 55% layer opacity `:892` with 9/500 `#583B8E` `:675`; name+price 12/400 `#8D8D8D` `:713`/`:714`; action bar 36px, Report `#D9D9D9`+`#8D8D8D` `:755`/`:768`, Dial `#366EE9`@48%+`#366EE9` `:760`/`:769`, Done `#019F74`@47% `:765`/`:770`; product tile 156x172 r24 `#F1F1F1` `:963` with `#E2E0E1` caption plate `:742` and 11/400 names `:819`; "+" badge 35px `#9869FE` `:785`. |

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

## Settled decisions

- **Indoor/Outdoor/Villa chips (SETTLED, task 15).** `LocationScreen` and
  `OrderDetailsScreen` now spell these identically: `h-[27px] w-[66px]`,
  `text-[12px]`, `border-[0.5px]`, selected `border-setl-violet
  text-setl-violet`, unselected `border-setl-line-2 text-setl-muted-2`, and
  `rounded-[11px]` — deliberately **not** the board's `borderRadius: 2`
  (`1.html:809`), because 11px is documented house geometry and the two screens
  must agree. Not extracted into a shared component (that's a refactor); a
  future component pass could hoist them.
- **Order-details board iteration.** Use `1.html:684-894`, the English "Review
  Summary" frame — it is the only complete one (Total block `:889-891` + CTA
  `:892`). `1.html:1001`/`:1048` and the `4.js` copies are the Arabic
  "تاكيد الطلب" variant.

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
  (The order-details board agrees with 311x52 r12, `1.html:892`.)
- **`VoucherField`.** Shared by `OrderDetailsScreen` and `InvoiceScreen`, so
  task 15 left it alone. The board's voucher row (`1.html:743-752`) is much
  tighter than the app's: card 343x57 r**5** `0 4px 4px rgba(0,0,0,.03)`, an
  81x25 r2 `rgba(234.3,234.3,234.3,.61)` input with a 12px/400 `#C2C2C2`
  placeholder, and a 45x25 r2 `#7E43FF` Apply button with an **11px/500 white**
  label (`:751`, the board's "Applye" typo — app copy keeps "Apply"). The app
  renders r11, a 15px violet outline button and a full-width input.
- **`PaymentMethods`.** Rows on the board are 13px/500 `#202020` with a 32px
  `#FFF7F7` medallion (`1.html:825-827`) and an 18px violet check
  (`1.html:818-821`); the label is 13px/500 `#202020` (`1.html:824`). The app
  uses 16px black labels and a native radio. Shared with `InvoiceScreen`.
- **`AppointmentCard`.** Shared with order tracking. The board's equivalent
  detail rows are 12px — label 12px/500, value 12px/400 `#A8A3A3`
  (`1.html:807-808`) — against the app's `text-sm`/`font-semibold` mix.

## Data gaps noticed (not fixed — `providers.js` is out of scope for style tasks)

- `PEST_TYPES` has no `color` field, so pest medallions render grey with an
  emoji. The board gives each a solid fill: `#D142FA` cockroach, `#EB4D4B`
  mice, `#10D830` ant, `#1AAAE9` mosquito, `#FFA800` lizards, `#751AE9` anti.

## Settled cross-screen decisions

- **CTA gradient.** The export contains exactly ONE blue→pink gradient:
  `linear-gradient(275deg, #366EE9 0%, #F15CFA 100%)`, 15 uses — it is
  `.brand-hero` in `index.css`. The app previously stretched the stops to
  `-95.36%/212.48%`, which never reached the board's blue (right edge rendered
  `rgb(114,104,238)` vs the board's `rgb(64,109,234)`). All six call sites now
  use `.brand-hero`. Do not reintroduce the stretched variant.
- **Indoor/Outdoor/Villa chips** render identically on `LocationScreen` and
  `OrderDetailsScreen`: `h-[27px] w-[66px] rounded-[11px] border-[0.5px]
  text-[12px]`, selected `border-setl-violet text-setl-violet`, unselected
  `border-setl-line-2 text-setl-muted-2`. They keep `rounded-[11px]` over the
  board's `borderRadius: 2` so the two screens agree with house geometry.
  A future component pass could hoist them; two reviewers endorsed not
  refactoring mid-fidelity-pass.
- **Steppers** use one idiom: `h-9 w-9 rounded-[9px] bg-setl-surface-3`, value
  box `border-setl-violet text-[15px]`. `#7E43FF` (`setl-violet`) is the purple
  the boards actually use — prefer it over `setl-purple #8442ff` for new work.

## Settled decisions (task: worker job screens)

- **Worker-screen board iterations.** `ProviderJobScreen` follows **frame 42**
  (`3.js:847-994`) — frames 40/41/43 are the same screen but only 42 draws the
  custom Pricing/Quantity card the app implements. "No products Needed" (17px
  Inter/500, `3.js:817`) comes from frame 41.
- **Board typo kept out of app copy.** The board writes "Waiting for Costumer
  approvel" (`3.js:634`) and "No products Needed"; the app keeps correct English
  ("Waiting for customer approval", "No products needed"). Visual styling matched,
  copy not.
- **Worker stepper deliberately differs from the customer stepper idiom.**
  The settled house stepper is `h-9 w-9 rounded-[9px] bg-setl-surface-3`, but the
  worker board draws the +/- as **24px white circles with a 1px `#DADADA` stroke**
  (`3.js:967-978`) and an 11px/500 value (`:966`). `ProviderJobScreen` follows its
  own board; the customer screens are untouched. If a future pass unifies steppers,
  this is the one intentional exception.

## Shared-component mismatches (worker flow — deferred)

- **`brand-splash` gradient angle.** `WaitingApprovalScreen`'s board (`3.js:633`)
  specifies `linear-gradient(230deg, #8442FF 0%, #F15CFA 100%)`; `index.css`
  `.brand-splash` uses **200deg**. Left alone — `.brand-splash` is shared with the
  splash/success screens, so changing the angle is a cross-screen decision.
  (`#8442FF` here is one of the few genuine board uses of that hex.)
- **`ProviderJobScreen`'s Report/Dial bar is missing the board's third segment.**
  The board's action strip is 3-up — Report / Dial / **Done** (`3.js:765`, `:770`,
  `#019F74` @47%). In the app "Done" is the primary CTA at the bottom of the screen
  instead, so only two segments render. A structural difference, not restyled.
- **`FakeMap` inset.** The board's map is full-bleed 375x471 at top 96
  (`3.js:617`) with a square overlay chip; the app renders it inset with a 15px
  radius inside the sheet. Kept — `FakeMap` is shared and the inset is house
  geometry.

## App-only worker features with no board counterpart (kept, not deleted)

- `ProviderOrderScreen`: the "What the customer reported" symptom chips, the
  accept/decline pair, and the per-state `continueLabel` CTA.
- `ProviderJobScreen`: the report bottom sheet (3 reasons), the running Estimate
  cart with per-line steppers and total, and the non-inspection "Mark as done" path.
- `WaitingApprovalScreen`: the approved / declined result states (the board only
  draws the waiting state).
