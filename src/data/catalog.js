// The Home-screen catalogue, owned by admin.
//
// Which service cards the customer sees, in what order, and with which
// artwork is an admin decision — not something baked into HomeScreen. This
// module holds that arrangement and persists it to `setl_catalog`, following
// the same localStorage-as-shared-backend pattern the rest of the prototype
// already uses (see data/admin.js): the customer app reads what admin writes,
// with no wiring between them.
//
// `target` is the App.jsx navigation string. It is part of the seed, never
// editable, so re-ordering a card can't break where it goes.

import acImg from '../assets/ac.png'
import sinkImg from '../assets/sink.png'
import electricImg from '../assets/electric.png'
import cleaningImg from '../assets/services/cleaning.png'
import pestImg from '../assets/services/pest.png'
import carwashImg from '../assets/services/carwash.png'
import carpolishImg from '../assets/services/carpolish.png'
import carglassImg from '../assets/services/carglass.png'

// 3D service icons (Service-Icons.zip). Imported so Vite fingerprints them
// and they resolve under the /setl-app/ Pages base.
import icAc from '../assets/icons/AC-and-Cooling.webp'
import icAc2x from '../assets/icons/AC-and-Cooling@2x.webp'
import icCctv from '../assets/icons/CCTV-and-Security.webp'
import icCctv2x from '../assets/icons/CCTV-and-Security@2x.webp'
import icCar from '../assets/icons/Car-Wash.webp'
import icCar2x from '../assets/icons/Car-Wash@2x.webp'
import icClean from '../assets/icons/Cleaning.webp'
import icClean2x from '../assets/icons/Cleaning@2x.webp'
import icDoors from '../assets/icons/Doors-and-Locks.webp'
import icDoors2x from '../assets/icons/Doors-and-Locks@2x.webp'
import icElec from '../assets/icons/Electrical-and-Power.webp'
import icElec2x from '../assets/icons/Electrical-and-Power@2x.webp'
import icGlass from '../assets/icons/Glass-Windows-and-Aluminium.webp'
import icGlass2x from '../assets/icons/Glass-Windows-and-Aluminium@2x.webp'
import icNet from '../assets/icons/Internet-and-Network.webp'
import icNet2x from '../assets/icons/Internet-and-Network@2x.webp'
import icPest from '../assets/icons/Pest-Control.webp'
import icPest2x from '../assets/icons/Pest-Control@2x.webp'
import icPlumb from '../assets/icons/Plumbing-and-Water.webp'
import icPlumb2x from '../assets/icons/Plumbing-and-Water@2x.webp'
import icSmart from '../assets/icons/Smart-Home.webp'
import icSmart2x from '../assets/icons/Smart-Home@2x.webp'

// Every icon an admin can assign, keyed by slug.
export const ICONS = {
  'AC-and-Cooling': { src: icAc, x2: icAc2x, label: 'AC & cooling' },
  'CCTV-and-Security': { src: icCctv, x2: icCctv2x, label: 'CCTV & security' },
  'Car-Wash': { src: icCar, x2: icCar2x, label: 'Car wash' },
  Cleaning: { src: icClean, x2: icClean2x, label: 'Cleaning' },
  'Doors-and-Locks': { src: icDoors, x2: icDoors2x, label: 'Doors & locks' },
  'Electrical-and-Power': { src: icElec, x2: icElec2x, label: 'Electrical & power' },
  'Glass-Windows-and-Aluminium': { src: icGlass, x2: icGlass2x, label: 'Glass & windows' },
  'Internet-and-Network': { src: icNet, x2: icNet2x, label: 'Internet & network' },
  'Pest-Control': { src: icPest, x2: icPest2x, label: 'Pest control' },
  'Plumbing-and-Water': { src: icPlumb, x2: icPlumb2x, label: 'Plumbing & water' },
  'Smart-Home': { src: icSmart, x2: icSmart2x, label: 'Smart home' },
}

export const ICON_SLUGS = Object.keys(ICONS)

// The seed is today's HomeScreen, unchanged in order and targets. `icon` is
// the new 3D artwork; `photo` / `img` are the original Figma assets. Cards
// that used to fall back to a bare CSS gradient now have real artwork.
export const SEED_CATALOG = [
  { id: 'ac', label: 'AC cleaning & refilling', group: 'home', target: 'acService', img: acImg, icon: 'AC-and-Cooling', visible: true, featured: true },
  { id: 'cleaning', label: 'House cleaning', group: 'home', target: 'cleaningService', photo: cleaningImg, icon: 'Cleaning', visible: true, featured: true },
  { id: 'plumber', label: 'Plumber', group: 'home', target: 'plumberProviders', img: sinkImg, icon: 'Plumbing-and-Water', visible: true, featured: true },
  { id: 'electrician', label: 'Electrician', group: 'home', target: 'options:electrician', img: electricImg, icon: 'Electrical-and-Power', visible: true, featured: true },
  { id: 'pest', label: 'Pest control', group: 'home', target: 'pestControl', photo: pestImg, icon: 'Pest-Control', visible: true, featured: true },
  // Technician covers appliance/device work, so the smart-home artwork is the
  // closest honest match. Curtains and outdoor furniture have no matching icon
  // in the pack — they keep their board gradient until artwork exists, rather
  // than wearing a misleading one. Admin can assign any icon later.
  { id: 'technician', label: 'Technician', group: 'home', target: 'options:technician', icon: 'Smart-Home', visible: true, featured: true },
  { id: 'network', label: 'Network technician', group: 'home', target: 'options:network', icon: 'Internet-and-Network', visible: true, featured: true },
  { id: 'curtains', label: 'Curtains', group: 'home', target: 'options:curtains', gradient: 'linear-gradient(135deg,#B23A0E,#E88B4C)', visible: true, featured: true },
  { id: 'outdoor', label: 'Outdoor furniture', group: 'home', target: 'options:outdoor', gradient: 'linear-gradient(135deg,#3A7D2C,#8FC46B)', visible: true, featured: true },
  // Security is a real board category and the artwork exists, so it earns a card.
  { id: 'security', label: 'CCTV & security', group: 'home', target: 'options:technician', icon: 'CCTV-and-Security', visible: true, featured: true },
  { id: 'doors', label: 'Doors & locks', group: 'home', target: 'options:technician', icon: 'Doors-and-Locks', visible: true, featured: true },
  { id: 'carwash', label: 'car wash', group: 'car', target: 'carWash', photo: carwashImg, icon: 'Car-Wash', visible: true, featured: true },
  { id: 'carpolish', label: 'car polish', group: 'car', target: 'carWash', photo: carpolishImg, visible: true, featured: true },
  { id: 'carglass', label: 'glass & windows', group: 'car', target: 'carTint', photo: carglassImg, icon: 'Glass-Windows-and-Aluminium', visible: true, featured: true },
]

const KEY = 'setl_catalog'

// Only these are the admin's to change; label, target and the Figma artwork
// always come from the seed, so editing the seed is never shadowed by stale
// browser state.
const OWNED = ['icon', 'visible', 'featured', 'order']

function readStored() {
  try {
    const raw = localStorage.getItem(KEY)
    return raw ? JSON.parse(raw) : null
  } catch {
    return null
  }
}

// Seed defines what exists; storage defines how it's arranged.
export function loadCatalog() {
  const seeded = SEED_CATALOG.map((c, i) => ({ ...c, order: i }))
  const stored = readStored()
  if (!Array.isArray(stored)) return seeded

  const patches = new Map(stored.map((c) => [c.id, c]))
  return seeded
    .map((c) => {
      const p = patches.get(c.id)
      if (!p) return c
      const merged = { ...c }
      for (const k of OWNED) if (p[k] !== undefined) merged[k] = p[k]
      return merged
    })
    .sort((a, b) => a.order - b.order)
}

export function saveCatalog(cats) {
  try {
    localStorage.setItem(
      KEY,
      JSON.stringify(cats.map((c) => ({ id: c.id, ...Object.fromEntries(OWNED.map((k) => [k, c[k]])) }))),
    )
  } catch {
    // storage unavailable — the arrangement just won't persist
  }
  // Same-tab listeners; `storage` only fires cross-tab.
  window.dispatchEvent(new Event('setl_catalog_change'))
}

export function resetCatalog() {
  try {
    localStorage.removeItem(KEY)
  } catch {
    // ignore
  }
  window.dispatchEvent(new Event('setl_catalog_change'))
}

// What HomeScreen renders: visible + featured, in the admin's order.
export const homeCards = (cats) => cats.filter((c) => c.visible && c.featured && c.group === 'home')
export const carCards = (cats) => cats.filter((c) => c.visible && c.featured && c.group === 'car')

// Move a card within its own group and renumber so `order` stays dense.
export function reorder(cats, id, dir) {
  const target = cats.find((c) => c.id === id)
  if (!target) return cats
  const group = cats.filter((c) => c.group === target.group).sort((a, b) => a.order - b.order)
  const i = group.findIndex((c) => c.id === id)
  const j = i + dir
  if (j < 0 || j >= group.length) return cats
  ;[group[i], group[j]] = [group[j], group[i]]
  const order = new Map(group.map((c, n) => [c.id, n]))
  return cats
    .map((c) => (order.has(c.id) ? { ...c, order: order.get(c.id) } : c))
    .sort((a, b) => a.order - b.order)
}
