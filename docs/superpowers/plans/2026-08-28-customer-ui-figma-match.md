# Customer App Figma Fidelity Pass — Implementation Plan

> **For agentic workers:** REQUIRED: Use superpowers:subagent-driven-development (if subagents available) or superpowers:executing-plans to implement this plan. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Bring every customer-facing screen in `cloned/src/screens/` visually
in line with its corresponding Figma artboard(s) in `desing_html/`, and
correct any customer flow/sequence bugs, without changing the app's
component architecture or state management.

**Architecture:** No new files, no new components unless an existing shared
component structurally cannot express a needed visual (rare — prefer
extending/adjusting existing components in `src/components/`). Work
proceeds screen-by-screen using a repeatable "match task" template: find
the artboard → diff visual values → edit → verify → commit. Screens are
grouped into 6 batches in customer-journey order (per the approved spec).

**Tech Stack:** React 18 + Vite + Tailwind CSS v4 (no test framework — this
repo has no Jest/Vitest). Verification is manual/visual: `npm run dev` +
browser check at 375px width, confirming no console errors and matching the
referenced artboard.

**Spec:** `docs/superpowers/specs/2026-08-28-customer-ui-figma-match-design.md`

---

## Before you start

Read the spec at the path above in full. Key facts it establishes that this
plan assumes as background:
- The four `desing_html/` export files (`1.html`, `3.js`, `4.js`, `5.js`;
  skip `2.jsx`, a duplicate of `1.html`) are **not** split by app/role —
  search all four when hunting for an artboard.
- `desing_html/` files are huge (up to ~16MB). **Never `cat`/`Read` them
  whole.** Always `grep` for specific text first, then read only the
  matched line(s) or a narrow surrounding range.
- Design tokens already live in `cloned/src/index.css` (`@theme` block —
  colors like `--color-setl-purple`, `--color-setl-navy`; shared classes
  `.row-card`, `.shadow-card`, `.brand-header`, `.brand-cta`, etc.). Prefer
  reusing an existing token/class over inventing a new hex value or
  duplicating a shadow — check `index.css` before hardcoding.
- Admin panel and backend wiring are out of scope. Provider/Worker/SP
  screens are out of scope (separate future round).
- The checkpoint commit `e319e41` already applied some `text-lg` →
  `text-[15px]` and radius fixes across several screens — verify current
  values before assuming a screen is unmatched.

---

## The repeatable "match task" template

Every task in Batches 1–6 below follows these 6 steps. Each task in this
plan states the screen file and a *starting point* for the artboard search
(a distinctive text string seen in the current code, e.g. a heading or
button label) — the exact matching artboard(s) and their precise values are
found live during the task, not pre-computed in this plan.

- [ ] **Step 1: Read the current screen component**

Read the full file at the given path. Note every literal size/color/radius
value (Tailwind arbitrary values like `text-[17px]`, `rounded-[11px]`,
hex colors, `left`/`top` inline styles) and every text label.

- [ ] **Step 2: Find the matching artboard(s)**

For each distinctive text label from Step 1, run (from the `Setl/` root,
one level above `cloned/`):

```bash
grep -n 'data-layer="<label text>"' desing_html/1.html desing_html/3.js desing_html/4.js desing_html/5.js
```

If no match, try a shorter substring of the label (labels can have
whitespace/quote differences), or search without `data-layer=` for the
literal visible text. If genuinely no artboard exists for this screen
(possible — the export is a partial dump), note that in the commit message
and skip to Step 6 with no changes, or make only clearly-justified
consistency fixes (e.g. matching an established token from `index.css`).

When multiple near-duplicate artboards match, prefer the more complete one
(fuller set of fields, less placeholder-looking text) per the spec's
tiebreak rule.

- [ ] **Step 3: Read the matched artboard lines**

Use `grep -n -A5 -B5` (or just the matched line — these are usually
single-line elements) around each matched `data-layer` to see its inline
`style={{...}}` object: `fontSize`, `fontWeight`, `left`/`top`, `color`,
`background`, `borderRadius`, `width`/`height`. Do not read surrounding
unrelated lines beyond what's needed — these files are huge.

- [ ] **Step 4: Diff and list concrete changes**

Before editing, write down (in your own scratch notes, not committed) a
short list: "current X → artboard says Y" for each mismatched value. Only
change values that are genuinely different — do not touch values that
already match, and do not refactor unrelated code.

- [ ] **Step 5: Apply the edits**

Edit the screen file (and, only if truly shared/needed, a component in
`src/components/`). Prefer:
- Tailwind arbitrary-value classes (`text-[15px]`, `rounded-[11px]`) to
  match exact Figma pixel values, consistent with existing code style in
  this repo.
- Existing `index.css` tokens/classes over new hardcoded hex values.
- Keeping all existing props, callbacks, and data flow untouched — this is
  a visual-only pass.

- [ ] **Step 6: Verify**

Run the dev server if not already running:

```bash
npm run dev
```

Open `http://localhost:5173` in a browser at a 375px-wide viewport,
navigate to the screen (see "Screen entry points" below for how to reach
each one from the login flow), and confirm:
- No console errors/warnings introduced.
- The screen visually matches the artboard values fixed in Step 5.
- Existing interactions (buttons, inputs, back navigation) still work.

If a headless browser check is preferable to manual navigation, use the
`browser-automation` skill to load the dev server URL and confirm no
console errors — pass the specific screen's likely URL/state if the app
supports deep-linking (it currently does not; `App.jsx` drives screens by
in-memory state only, so navigate via UI clicks from `/`).

- [ ] **Step 7: Commit**

```bash
git add src/screens/<ScreenFile>.jsx src/components/<IfTouched>.jsx
git commit -m "style: match <ScreenName> to the Figma export"
```

One commit per screen (or per tightly-coupled screen+component pair), per
the spec's commit strategy.

---

## Screen entry points (for manual verification)

The app has no router — reach each screen by clicking through from the
splash screen. Quick paths from a fresh `npm run dev` load:

- **Login / OTP / Location**: automatic on first load (splash → login →
  enter any 9-digit number starting with 5 → Continue → any 4-digit OTP →
  auto-verifies → Location → Confirm).
- **Home**: reached automatically after Location is confirmed.
- **AC / Cleaning / Pest / Car wash**: tap the matching card on Home.
- **Vehicles**: from Car wash screen, "Manage vehicles".
- **Wizard**: tap "Something broken?" on Home.
- **Photo triage**: from Wizard, choose a service then "Not sure" at the
  service-knowledge question (for services without forced inspection).
- **Service options**: tap Electrician/Technician/Network/Curtains/Outdoor
  furniture on Home.
- **Providers**: "Search for providers" from most service screens, or via
  Wizard/inspection paths.
- **Cleaner profile**: from Providers (cleaning) or Cleaning screen's
  favorite-cleaner card, if a favorite is set (requires booking once
  first — otherwise skip and verify structurally only).
- **Order details**: "Confirm" a provider from the Providers screen.
- **Success / Tracking / Orders / Invoice / Reject reason**: complete a
  booking from Order details, then use the Orders tab.
- **Profile**: bottom tab bar.

---

## Batch 1: Onboarding (Login, OTP, Location)

### Task 1: CustomerLogin

**Files:**
- Modify: `src/screens/CustomerLogin.jsx`
- Reference component: `src/components/SetlLogo.jsx`, `src/components/UAEFlag.jsx`

- [ ] Apply the match-task template (Steps 1–7) above.
  - Search starting points: `"Welcome Back"`, `"Enter mobile number"`,
    `"Continue"`.
  - Known from earlier research: no `data-layer` match for `"Welcome
    Back"` was found in `1.html` directly during spec research — re-run
    the search across all four files per Step 2 before concluding there's
    no artboard; if truly absent, verify the current header
    gradient/geometry against `index.css`'s `.brand-header`/`.brand-cta`
    tokens for internal consistency instead, and note "no artboard found"
    in the commit message.

### Task 2: OtpScreen

**Files:**
- Modify: `src/screens/OtpScreen.jsx`
- Reference component: `src/components/GradientButton.jsx`

- [ ] Apply the match-task template.
  - Search starting points: `"Enter your OTP"`, `"Enter OTP sent to your
    phone number"`, `"Resend OTP"`, `"Didn't receive OTP?"`.
  - Confirmed present in `desing_html/3.js` (verified during plan
    research, ~line 52-55): artboard has `"Enter your OTP"` at
    `fontSize: 20, fontWeight: 600`; current code
    (`OtpScreen.jsx:73`) has `text-[17px] font-semibold` — this is a real
    mismatch, fix to `text-[20px]`. Artboard subtitle `"Enter OTP sent to
    your phone number"` is `fontSize: 12, color: rgba(0,0,0,0.60)`;
    current code (`OtpScreen.jsx:74`) has `text-sm text-[#6B6B6B]` — check
    exact px equivalence (`text-sm` = 14px, artboard wants 12px) and fix
    to `text-[12px] text-black/60`. Re-verify these exact values live in
    Step 3 (grep the same lines) since this note was written from a
    single earlier grep and the artboard may have more fields (OTP box
    count/spacing, resend link position) worth checking too.

### Task 3: LocationScreen

**Files:**
- Modify: `src/screens/LocationScreen.jsx`
- Reference component: `src/components/FakeMap.jsx`, `src/components/GradientButton.jsx`

- [ ] Apply the match-task template.
  - Search starting points: `"Location Details"`, `"Search Location"`,
    `"Indoor"`, `"Outdoor"`, `"Villa"`, `"Maps"`, `"Satellite"`.
  - `"Location Details"` and `"Maps"` were seen in the `1.html` layer-name
    sample gathered during spec research — confirm exact styling (font
    size/weight, card radius/background for the address pill) against
    that artboard in Step 3.

---

## Batch 2: Home

### Task 4: HomeScreen

**Files:**
- Modify: `src/screens/HomeScreen.jsx`
- Reference component: `src/components/ScrollRow.jsx`

- [ ] Apply the match-task template.
  - This screen already carries Figma-derived comments and exact
    `left`/`top` coordinates (e.g. "Header block: 375x222, radius 40",
    menu at x=28/y=63) — treat these as prior work, not a blank slate.
    Search starting points to re-verify: `"Home Services"` / `"Home
    services"`, `"Car services"`, `"Something broken?"` (unlikely to be
    in the export — it's product copy added later, skip searching for
    it), promo banner text.
  - Focus verification on: content-sheet radius/background match, service
    card size (`115x146` per current code) and label font size (`12px`),
    search bar height/radius, and whether the "Something broken?" CTA
    styling (not in Figma — an added feature per `PLAN.md`) still reads
    as visually consistent with the rest of the screen even though it has
    no artboard counterpart.

---

## Batch 3: Simple booking screens (AC, Cleaning, Pest, Car wash + Vehicles)

### Task 5: AcServiceScreen

**Files:**
- Modify: `src/screens/AcServiceScreen.jsx`

- [ ] Apply the match-task template.
  - Search starting points: distinctive counter/label text currently in
    the file (read the file first per Step 1 to get exact strings — e.g.
    refill/clean counter labels).

### Task 6: CleaningServiceScreen

**Files:**
- Modify: `src/screens/CleaningServiceScreen.jsx`

- [ ] Apply the match-task template.
  - Search starting points: `"How many hours"`/hours-picker copy, `"Add
    specific jobs"` (likely app-added, not in Figma — verify), cleaning
    group labels from `CLEANING_GROUPS` in `src/data/providers.js`.
  - This screen received checkpoint-commit tweaks already (`text-[15px]`
    sizes) — verify those land on the correct value rather than assuming
    they're final.

### Task 7: PestControlScreen

**Files:**
- Modify: `src/screens/PestControlScreen.jsx`

- [ ] Apply the match-task template.
  - Search starting points: `"How many infected rooms?"`, `"Cockroach
    control"`, `"Ant control"`/`"Anti control"`, `"Mosquito control"`,
    `"Mice control"` — all confirmed present in `1.html` per spec
    research. Also check the room-size chips (`"wide"`, `"middle"`,
    `"small"`) and the `"Confirm"` button styling.

### Task 8: CarWashScreen

**Files:**
- Modify: `src/screens/CarWashScreen.jsx`

- [ ] Apply the match-task template.
  - Search starting points: `"Basic wash"` (confirmed present in `1.html`
    per spec research), package/extras labels currently in the file.

### Task 9: VehiclesScreen

**Files:**
- Modify: `src/screens/VehiclesScreen.jsx`

- [ ] Apply the match-task template.
  - Search starting points: read the file first for exact copy (likely
    "My vehicles", add-vehicle form labels), then grep across all four
    export files — this screen may not have a direct artboard (not
    called out in the earlier layer-name samples); if absent, note it and
    do a token-consistency check only.

---

## Batch 4: Inspection/wizard path

### Task 10: WizardScreen

**Files:**
- Modify: `src/screens/WizardScreen.jsx`

- [ ] Apply the match-task template.
  - Search starting points: read the file for the problem-area /
    symptom-picker copy and "Do you already know the service you need?"
    (this exact question is a `PLAN.md` canonical string — likely
    app-authored, not from Figma; if no artboard match, verify against
    the wizard's own internal consistency and any partially-related
    Figma symptom-picker screens instead).

### Task 11: PhotoTriageScreen

**Files:**
- Modify: `src/screens/PhotoTriageScreen.jsx`

- [ ] Apply the match-task template.
  - Search starting points: read file first for exact copy.

### Task 12: ServiceOptionsScreen

**Files:**
- Modify: `src/screens/ServiceOptionsScreen.jsx`

- [ ] Apply the match-task template.
  - Search starting points: read file first for exact copy (job/option
    checkbox labels).

### Task 13: ProvidersScreen

**Files:**
- Modify: `src/screens/ProvidersScreen.jsx`
- Reference component: `src/components/ProviderCard.jsx`, `src/components/DateTimeSheet.jsx`

- [ ] Apply the match-task template.
  - Search starting points: `"Most Ordred"` (note: this is the artboard's
    actual spelling/typo, confirmed present in `1.html` layer sample —
    decide deliberately whether to match the typo or keep correct English
    "Most Ordered"; default to keeping correct spelling in app copy but
    matching the visual styling/layout around it, and note this decision
    in the commit message), `"Available Today at 10.00 Am"` (confirmed in
    `4.js` sample), rating/review display.
  - `ProviderCard.jsx` and `DateTimeSheet.jsx` were touched by the
    checkpoint commit — verify their current values against the artboard
    rather than assuming they're done.

### Task 14: CleanerProfileScreen

**Files:**
- Modify: `src/screens/CleanerProfileScreen.jsx`

- [ ] Apply the match-task template.
  - Search starting points: read file first for exact copy.

---

## Batch 5: Checkout & tracking

### Task 15: OrderDetailsScreen

**Files:**
- Modify: `src/screens/OrderDetailsScreen.jsx`

- [ ] Apply the match-task template.
  - Search starting points: `"Booking Details"` (confirmed in `4.js`
    sample), `"Discount"`, `"Discount application"`, `"Applye"` (artboard
    typo for "Apply" — match styling, keep correct spelling in code, note
    the decision), `"Address"`, `"Additional Instruction"`.
  - This file already has an `api`/network-adjacent grep hit noted during
    initial exploration — re-check it's not actually calling a real API
    (should still be simulated per `PLAN.md`'s "current simulations"
    list); if it's a real fetch call, flag it in the commit message as
    out-of-scope-but-noticed rather than changing behavior.
  - **CARRIED OVER FROM TASK 3 — resolve the chip drift here.** Task 3
    restyled the Indoor/Outdoor/Villa chips on `LocationScreen.jsx:53-55`
    to the artboard at `desing_html/1.html:809-814`
    (`setl-violet` / `setl-line-2` / `setl-muted-2`, `text-[12px]`, fixed
    `h-[27px] w-[66px]`, `border-[0.5px]`, no shadow). The SAME chips at
    `OrderDetailsScreen.jsx:132-133` still use the old styling
    (`setl-purple` / `setl-line` / `setl-muted`, `text-sm`,
    content-sized) — `setl-purple #8442ff` and `setl-violet #7e43ff` are
    visibly different purples on the same control. When measuring this
    screen's artboard:
    - If this screen's artboard agrees with `1.html:809-814`, make the two
      consistent, then extract a shared `<PlaceTypeChips>` component
      (props: `value`, `onChange`, and an `interactive` flag) and hoist
      the `PLACE_TYPES` array (currently duplicated — exported from
      `LocationScreen.jsx:5`, re-inlined in `OrderDetailsScreen.jsx`) into
      shared data. Extraction is explicitly IN SCOPE for this task only,
      as the deferred follow-up from Task 3.
    - If the two artboards genuinely differ, leave them separate and add a
      cross-reference comment in both files explaining why they diverge.
  - Also consider documenting the `setl-purple` vs `setl-violet`
    distinction in the `@theme` block of `src/index.css` — two
    near-identical purples with no note on which is canonical is the most
    likely source of future drift.

### Task 16: OrderTrackingScreen

**Files:**
- Modify: `src/screens/OrderTrackingScreen.jsx`

- [ ] Apply the match-task template.
  - Search starting points: read file first for exact copy (tracking
    status labels, estimate/products display).

### Task 17: InvoiceScreen

**Files:**
- Modify: `src/screens/InvoiceScreen.jsx`
- Reference component: `src/components/VoucherField.jsx`

- [ ] Apply the match-task template.
  - Search starting points: `"Discount"`, `"Order Summary"`/subtotal-VAT-
    total labels, voucher-code copy.

### Task 18: RejectReasonScreen

**Files:**
- Modify: `src/screens/RejectReasonScreen.jsx`

- [ ] Apply the match-task template.
  - Search starting points: read file first for exact copy (reason list).

### Task 19: SuccessScreen

**Files:**
- Modify: `src/screens/SuccessScreen.jsx`

- [ ] Apply the match-task template.
  - Search starting points: `"You're all Setled!"` (per
    `APPS_AND_WORKFLOW.md`'s description of this screen — verify exact
    copy in the current file first, then search the export).
  - Check `.pop-enter`/`.draw-check` animation classes in `index.css`
    stay wired correctly if any markup changes.

---

## Batch 6: Manage (Orders, Profile)

### Task 20: OrdersScreen

**Files:**
- Modify: `src/screens/OrdersScreen.jsx`

- [ ] Apply the match-task template.
  - Search starting points: status labels ("In progress" / "Scheduled" /
    "Completed" / "Cancelled" / "Awaiting payment" per
    `APPS_AND_WORKFLOW.md` and `PLAN.md`'s order state model).

### Task 21: ProfileScreen

**Files:**
- Modify: `src/screens/ProfileScreen.jsx`

- [ ] Apply the match-task template.
  - Search starting points: read file first for exact copy (settings rows,
    account info labels).

---

## Flow/sequence check (do this after all 21 screen tasks, or interleaved per batch — see note)

### Task 22: Cross-check customer flow against APPS_AND_WORKFLOW.md and PLAN.md

**Files:**
- Read: `src/App.jsx` (the `screens` map and every `onBack`/`onContinue`/
  navigation callback for customer-mode screens)
- Reference: `../APPS_AND_WORKFLOW.md` §4 (WF-1, WF-2, WF-4, WF-5 — WF-3
  car-tint is unbuilt, skip), `PLAN.md`'s "User journeys" section (this is
  the more current source — `PLAN.md` supersedes older docs per its own
  header)

- [ ] **Step 1:** Re-read `App.jsx`'s `screens` map (already read once
      during spec research — re-read for freshness since screen files may
      have changed during Tasks 1–21) and trace every customer-mode
      (`mode === 'customer'`) screen transition.

- [ ] **Step 2:** For each of these flows, walk `App.jsx` and confirm the
      transitions match:
      - WF-1 onboarding: `splash → login → otp → location → home`. Verify
        `onVerify` in the `otp` screen entry routes to `'location'` for
        customer mode (`App.jsx` around the `otp:` key).
      - WF-2 simple booking (e.g. car wash): `home → carWash → providers
        → orderDetails → success → (auto) tracking/orders`. Verify
        `onBack` chains return to the correct prior screen at each step
        (the spec's example failure mode: "a back button returning to the
        wrong screen").
      - WF-4 inspection flow: `home → wizard → (knows service? bookService
        : requiresInspection? providers(inspection) : photoTriage) →
        orderDetails → success → tracking → (estimate ready) →
        orderDetails(maintenance) → success`. Verify `bookService`,
        `openTriage`, and `openProviders` in `App.jsx` route correctly for
        each of the wizard's branches.
      - WF-5 multi-item checkout (AC/pest/cleaning with line items):
        verify `pestItems()`/`cleanItems()`/`washItems()` line items reach
        `OrderDetailsScreen` and display correctly (visual check from
        Batch 5, not new logic).

- [ ] **Step 3:** If any mismatch is found (wrong back-target, missing
      transition, dead-end screen), fix it as a small targeted change in
      `App.jsx` only — do not restructure the state machine. Write a
      regression note in the commit message describing the exact
      before/after transition.

- [ ] **Step 4:** Manually walk each of the four flows in the running app
      (`npm run dev`) end-to-end to confirm the fix, or use
      `browser-automation` to script the click-through and check for
      console errors at each step.

- [ ] **Step 5: Commit**

```bash
git add src/App.jsx
git commit -m "fix: correct customer flow transition(s) against WF-1/2/4/5"
```

If no mismatches are found, skip the commit and note "no flow issues
found" when reporting this task complete.

---

## Completion

After Task 22, the customer app (21 screens) should visually match the
Figma export wherever an artboard exists, use existing design tokens
consistently where none exists, and its navigation should match the
documented WF-1/2/4/5 journeys. Provider/Worker/SP screens, the admin
panel, and backend wiring remain explicitly out of scope (see spec's
"Out of scope follow-ups").
