// Real manufacturer marks, bundled from simple-icons at build time rather than
// fetched at runtime — a logo CDN would be a live dependency that can fail
// after publishing, and most are blocked in sandboxed/CSP contexts anyway.
import toyota from '../assets/brands/toyota.svg'
import nissan from '../assets/brands/nissan.svg'
import bmw from '../assets/brands/bmw.svg'
import mercedes from '../assets/brands/mercedes.svg'
import honda from '../assets/brands/honda.svg'
import hyundai from '../assets/brands/hyundai.svg'
import kia from '../assets/brands/kia.svg'
import ford from '../assets/brands/ford.svg'
import chevrolet from '../assets/brands/chevrolet.svg'
import audi from '../assets/brands/audi.svg'
import volkswagen from '../assets/brands/volkswagen.svg'
import mitsubishi from '../assets/brands/mitsubishi.svg'
import mazda from '../assets/brands/mazda.svg'
import porsche from '../assets/brands/porsche.svg'
import jeep from '../assets/brands/jeep.svg'

const MARKS = {
  toyota, nissan, bmw, mercedes, 'mercedes-benz': mercedes, honda, hyundai,
  kia, ford, chevrolet, audi, volkswagen, vw: volkswagen, mitsubishi, mazda,
  porsche, jeep,
}

// The brand is the first word of the vehicle name ("Nissan Patrol" -> nissan).
export function brandOf(name = '') {
  return name.trim().split(/\s+/)[0]?.toLowerCase() ?? ''
}

export function hasBrandMark(name) {
  return Boolean(MARKS[brandOf(name)])
}

// Falls back to the vehicle's initial when we have no mark for that make, so a
// car the user types by hand still renders something deliberate.
export default function CarBrand({ name, color = '#0D0000', className = 'h-5 w-5' }) {
  const src = MARKS[brandOf(name)]
  if (!src) {
    return (
      <span className={`${className} flex items-center justify-center text-[11px] font-bold`} style={{ color }}>
        {(name || '?').trim()[0]?.toUpperCase()}
      </span>
    )
  }
  // Rendered as a plain <img>. A CSS mask would let the mark take the vehicle's
  // colour, but React drops the mask-image declaration (the two spellings
  // overwrite each other, and a custom property set in a style object is
  // stripped), so the logo silently vanished. The marks read fine in their own
  // ink, and an <img> cannot fail this way.
  return <img src={src} alt="" aria-hidden className={`${className} object-contain`} />
}
