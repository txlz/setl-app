# Customer app: pixel-fidelity pass against the Figma export

## Context

`cloned/` is a working React + Vite + Tailwind demo of the Setl/Washx
services marketplace (customer, provider/worker, and Service Provider
company roles), driven entirely by local component state + localStorage —
no backend, no admin panel. `desing_html/` holds the raw Figma export
(`1.html` / `2.jsx`, ~16MB each, plus `3.js`/`4.js`/`5.js`) — a flat,
duplicated dump of every artboard iteration, not a clean per-screen source.

**The four export files (`1.html`, `3.js`, `4.js`, `5.js`; `2.jsx` is a
duplicate of `1.html`) are NOT split by app or role** — each one mixes
customer, provider, and admin-adjacent artboards. Confirmed by spot check:
`1.html` has no login/OTP artboards at all (those are in `3.js`, alongside
provider dispatch screens like "Employee" and "Google Address"); `4.js` has
booking/checkout screens mixed with others. So "search `1.html`" is not
sufficient — matching must search **all four files**.

An earlier pass already started nudging some screens toward the Figma
sizing (uncommitted diff across 41 files, including a few provider/SP
screens — mostly `text-lg` → `text-[15px]` and radius tweaks). That work
is now committed as a checkpoint (`e319e41`) so this spec starts from a
clean baseline; the provider/SP files it touched are not otherwise in
scope here.

`APPS_AND_WORKFLOW.md` §7 ("Code structure") describes an older layout
(`registry.jsx`, `src/apps/customer/screens.jsx`, a gallery-tab shell) that
no longer matches this repo — the real layout is `src/screens/*.jsx` per
screen plus a single state-machine `App.jsx`. Only §4 (the WF-1…WF-10
workflow descriptions) is used as a reference here; §7 should be ignored.

The admin panel and cross-app backend "connection" mentioned in the
original request do not exist in this codebase and are explicitly **out of
scope** — confirmed with the user. This spec covers **visual fidelity and
flow-order correctness for the customer app only**; provider/worker/SP
screens are a follow-up round.

## Goal

Bring every customer-facing screen's visual details (color, spacing, type
scale, corner radii, layout proportions) in line with the corresponding
Figma artboard(s) in `desing_html/` (across all four export files), without
discarding the current
app's clean, semantic, data-driven component structure. Also verify the
customer screen sequence matches the intended flow (`APPS_AND_WORKFLOW.md`
§4, WF-1/2/3/4/5) and `App.jsx`'s routing, fixing any ordering/transition
mismatches found along the way.

## Non-goals

- Provider, Worker, or Service Provider (SP) app screens — separate round.
- Admin panel — not built yet, not part of this pass.
- Backend integration, real payments, real auth, real maps.
- Restructuring component architecture or state management.
- Literal transcription of Figma's raw div/layer markup — the current
  component structure (e.g. `CLEANING_GROUPS`-driven cleaning screen) is
  kept; only visual values are corrected to match.

## Approach

**Matching method, per screen:**
1. Identify the screen's corresponding artboard(s) by grepping for its
   visible text/labels (`data-layer="..."` or literal strings) across
   **all four** `desing_html/` export files (`1.html`, `3.js`, `4.js`,
   `5.js` — skip `2.jsx`, a duplicate of `1.html`), since no single file
   is scoped to one app/role and none has clean per-screen boundaries or
   avoids near-duplicate iterations. When multiple near-duplicate
   iterations match, prefer the one with the most complete/polished layer
   names and content (fewer placeholder-looking labels, fuller set of
   expected fields) over earlier, sparser duplicates.
2. Compare the current `cloned/src/screens/*.jsx` implementation against
   that artboard for: colors (vs. `theme.css`/Tailwind config tokens),
   spacing/padding, font sizes/weights, corner radii, icon usage, and
   overall layout proportions.
3. Adjust Tailwind classes / inline styles to match, keeping existing
   props, data flow, and component boundaries intact.
4. Where the Figma export and the current app structurally diverge (e.g.
   data-driven lists vs. Figma's flat repeated layers), keep the current
   structure — only the visual values change.

**Flow/sequence check:** cross-reference `App.jsx`'s `screens` map and
navigation callbacks against `APPS_AND_WORKFLOW.md` WF-1 (onboarding),
WF-2 (simple car booking), WF-3 (car tint — not yet built, skip),
WF-4 (inspection flow), WF-5 (multi-item checkout) for the customer app,
and fix any screen-order or transition bugs found (e.g. a back button
returning to the wrong screen, a step missing from a booking flow).

**Verification per screen:** run the dev server (`npm run dev`), visually
check the screen at 375px mobile width against the matched Figma artboard,
and confirm no console errors / broken interactions.

## Screens in scope (customer app, ~20)

Onboarding: `CustomerLogin`, `OtpScreen`, `LocationScreen`.
Discover & book: `HomeScreen`, `AcServiceScreen`, `CleaningServiceScreen`,
`PestControlScreen`, `CarWashScreen`, `VehiclesScreen`, `WizardScreen`,
`PhotoTriageScreen`, `CleanerProfileScreen`, `ProvidersScreen`,
`ServiceOptionsScreen`.
Checkout & tracking: `OrderDetailsScreen`, `OrderTrackingScreen`,
`InvoiceScreen`, `RejectReasonScreen`, `SuccessScreen`.
Manage: `OrdersScreen`, `ProfileScreen`.

Shared components touched as needed: `ScreenHeader`, `GradientButton`,
`DateTimeSheet`, `ProviderCard`, `TabBar`, `VoucherField`, and others in
`src/components/`.

## Work order

Role-by-role, customer first (per user decision). Within the customer app,
proceed in the WF-1 → WF-5 journey order so each flow can be sanity-checked
end-to-end as it's finished, rather than alphabetically:
1. Onboarding (Login, OTP, Location)
2. Home
3. Simple booking screens (AC, Cleaning, Pest, Car wash + Vehicles)
4. Inspection/wizard path (Wizard, Photo triage, Service options, Providers,
   Cleaner profile)
5. Checkout & tracking (Order details, Tracking, Invoice, Reject reason,
   Success)
6. Manage (Orders, Profile)

## Commit strategy

Small, logical commits — roughly one per screen or tightly related group
(e.g. a screen + the shared component it uniquely depends on) — rather
than one large commit at the end. This keeps each change reviewable and
bisectable if a visual regression shows up later.

## Out of scope follow-ups (not this spec)

- Provider / Worker / SP screen visual pass.
- Admin panel design and build.
- Wiring the four apps to a shared backend.
