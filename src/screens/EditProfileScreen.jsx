import { useState } from 'react'
import ScreenHeader from '../components/ScreenHeader.jsx'
import GradientButton from '../components/GradientButton.jsx'

// Edit the customer's own details. The phone number is read-only: it is the
// account identity (the OTP login is keyed on it), so changing it is a
// re-verification flow rather than a text field.
export default function EditProfileScreen({ profile, onSave, onBack }) {
  const [name, setName] = useState(profile?.name ?? '')
  const [email, setEmail] = useState(profile?.email ?? '')
  const phone = profile?.phone || '501234567'

  const initial = (name.trim()[0] ?? 'A').toUpperCase()
  const emailOk = email.trim() === '' || /^\S+@\S+\.\S+$/.test(email.trim())
  const canSave = name.trim().length > 1 && emailOk

  return (
    <ScreenHeader title="Edit profile" onBack={onBack}>
      <div className="mt-6 flex flex-col items-center">
        <div className="brand-hero flex h-24 w-24 items-center justify-center rounded-full text-[32px] font-semibold text-white">
          {initial}
        </div>
        <p className="mt-2 text-[11px] text-setl-muted">Your initial is used as your avatar</p>
      </div>

      <label htmlFor="profile-name" className="mt-7 text-[11px] text-setl-muted">
        Full name
      </label>
      <input
        id="profile-name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Your name"
        className="mt-1 w-full border-b border-setl-line pb-2 text-[14px] text-setl-ink outline-none focus:border-setl-violet"
      />

      <label htmlFor="profile-email" className="mt-6 text-[11px] text-setl-muted">
        Email
      </label>
      <input
        id="profile-email"
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="you@example.com"
        className="mt-1 w-full border-b border-setl-line pb-2 text-[14px] text-setl-ink outline-none focus:border-setl-violet"
      />
      {!emailOk && <p className="mt-1 text-[11px] text-setl-red">Enter a valid email address</p>}

      <label htmlFor="profile-phone" className="mt-6 text-[11px] text-setl-muted">
        Mobile number
      </label>
      <div className="mt-1 flex items-center justify-between border-b border-setl-line pb-2">
        <input
          id="profile-phone"
          value={`+971 ${phone}`}
          readOnly
          className="w-full bg-transparent text-[14px] text-setl-muted outline-none"
        />
        <span className="shrink-0 rounded-full bg-green-50 px-2 py-0.5 text-[11px] font-medium text-setl-green">
          Verified
        </span>
      </div>
      <p className="mt-1.5 text-[11px] text-setl-muted">
        Your number is your Setl login — contact support to change it.
      </p>

      <div className="grow" />
      <GradientButton
        className="mt-8"
        disabled={!canSave}
        onClick={() => onSave({ name: name.trim(), email: email.trim(), phone })}
      >
        Save
      </GradientButton>
    </ScreenHeader>
  )
}
