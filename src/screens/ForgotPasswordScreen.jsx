import { useState } from 'react'
import ScreenHeader from '../components/ScreenHeader.jsx'
import GradientButton from '../components/GradientButton.jsx'
import UAEFlag from '../components/UAEFlag.jsx'

// Recovery (WF-1): the number goes in, an OTP goes out, and the caller routes
// into the same OTP screen the rest of the app uses — there is no separate
// password to reset, since sign-in is OTP-based throughout.
export default function ForgotPasswordScreen({ onSendCode, onBack }) {
  const [phone, setPhone] = useState('')
  const [error, setError] = useState('')
  const [sending, setSending] = useState(false)

  function submit() {
    if (!/^5\d{8}$/.test(phone)) {
      setError('Please enter a valid UAE mobile number (9 digits, starts with 5)')
      return
    }
    setError('')
    setSending(true)
    setTimeout(() => onSendCode(phone), 700)
  }

  return (
    <ScreenHeader title="Recover your account" subtitle="We will text you a code" onBack={onBack}>
      <div className="flex grow flex-col pt-2">
        <label htmlFor="fp-phone" className="text-xs tracking-[0.0417em] text-black">
          Enter mobile number
        </label>
        <div className="mt-2 flex h-12 items-center gap-2 rounded-[11px] border-[0.5px] border-[#2790C3] bg-white px-2">
          <span className="flex shrink-0 items-center gap-1">
            <UAEFlag className="h-[22px] w-8" />
          </span>
          <div className="h-8 w-px shrink-0 bg-black/20" />
          <input
            id="fp-phone"
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

        <p className="mt-4 text-[11px] text-setl-muted">
          The code arrives by SMS and expires after 10 minutes.
        </p>

        <div className="grow" />
        <GradientButton loading={sending} onClick={submit}>
          Send code
        </GradientButton>
      </div>
    </ScreenHeader>
  )
}
