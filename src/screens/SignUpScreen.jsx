import { useState } from 'react'
import SetlLogo from '../components/SetlLogo.jsx'
import UAEFlag from '../components/UAEFlag.jsx'

// Sign up (WF-1's alternative entry). The export has no signup artboard, so
// this mirrors CustomerLogin's header, field and CTA exactly rather than
// inventing a second look for the same moment.
export default function SignUpScreen({ onContinue, onHaveAccount }) {
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [error, setError] = useState('')
  const [sending, setSending] = useState(false)

  function handleSubmit(e) {
    e.preventDefault()
    if (!name.trim()) {
      setError('Please enter your name')
      return
    }
    if (!/^5\d{8}$/.test(phone)) {
      setError('Please enter a valid UAE mobile number (9 digits, starts with 5)')
      return
    }
    setError('')
    setSending(true)
    setTimeout(() => onContinue({ name: name.trim(), phone }), 700)
  }

  return (
    <div className="font-poppins relative min-h-screen w-full bg-white">
      <header className="relative">
        <svg viewBox="0 0 375 191" className="block w-full" preserveAspectRatio="none">
          <defs>
            <linearGradient id="setlBrandUp" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0" stopColor="#AB4FEC" />
              <stop offset="1" stopColor="#6E5CEA" />
            </linearGradient>
          </defs>
          <path d="M0 0H375V113L187.5 191L0 113V0Z" fill="url(#setlBrandUp)" />
        </svg>
        <div className="absolute inset-x-0 top-[38%] flex items-center justify-center gap-2">
          <SetlLogo className="h-[85px] w-[60px]" />
          <span className="font-league-spartan pt-3 text-[40px] leading-none font-semibold text-white">
            Setl
          </span>
        </div>
      </header>

      <h1 className="mt-4 text-center text-[17px] font-semibold tracking-[0.025em] text-black">
        Create your account
      </h1>

      <form onSubmit={handleSubmit} className="mt-10 px-4">
        <label htmlFor="su-name" className="text-xs tracking-[0.0417em] text-black">
          Full name
        </label>
        <input
          id="su-name"
          value={name}
          onChange={(e) => {
            setName(e.target.value)
            setError('')
          }}
          placeholder="Ahmed Alshamsi"
          className="font-inter mt-2 h-12 w-full rounded-[11px] border-[0.5px] border-[#2790C3] bg-white px-3 text-[14px] text-black outline-none placeholder:text-[#817777]/70"
        />

        <label htmlFor="su-phone" className="mt-4 block text-xs tracking-[0.0417em] text-black">
          Enter mobile number
        </label>
        <div className="mt-2 flex h-12 items-center gap-2 rounded-[11px] border-[0.5px] border-[#2790C3] bg-white px-2">
          <span className="flex shrink-0 items-center gap-1">
            <UAEFlag className="h-[22px] w-8" />
            <svg width="9" height="7" viewBox="0 0 9 7" className="fill-black">
              <path d="M4.5 7 0 0h9L4.5 7Z" />
            </svg>
          </span>
          <div className="h-8 w-px shrink-0 bg-black/20" />
          <input
            id="su-phone"
            type="tel"
            inputMode="numeric"
            placeholder="50*******"
            value={phone}
            onChange={(e) => {
              setPhone(e.target.value.replace(/\D/g, ''))
              setError('')
            }}
            maxLength={9}
            className="font-inter w-full bg-transparent text-[14px] text-black outline-none placeholder:text-[#817777]/70"
          />
        </div>
        {error && <p className="mt-2 text-xs text-red-500">{error}</p>}

        <button
          type="submit"
          disabled={sending}
          className="brand-hero font-inter mt-10 inline-flex h-[52px] w-full cursor-pointer items-center justify-center rounded-[11px] text-[17px] font-medium text-white active:scale-[0.98]"
        >
          {sending ? 'Creating…' : 'Create account'}
        </button>

        <button
          type="button"
          onClick={onHaveAccount}
          className="mx-auto mt-6 block cursor-pointer py-2 text-sm text-setl-violet underline underline-offset-2"
        >
          I already have an account
        </button>
      </form>
    </div>
  )
}
