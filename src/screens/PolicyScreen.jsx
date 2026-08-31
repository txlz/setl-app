import ScreenHeader from '../components/ScreenHeader.jsx'

// The two legal documents reachable from Settings. Kept as data (not JSX) so
// the same layout renders both and a copy change is a one-line edit.
//
// The cancellation refund tiers are the product rule, not placeholder text:
// free cancellation up to 1 hour before the slot, and
// only 20% refunded in the final 30 minutes (the pro is already en route).
const POLICIES = {
  privacy: {
    title: 'Privacy policy',
    updated: 'Last updated 1 August 2026',
    intro:
      'Setl Technologies LLC ("Setl") operates a marketplace connecting customers in the UAE with home and car service providers. This policy explains what we collect, why, and what you control.',
    sections: [
      {
        heading: 'What we collect',
        body: 'Your name, mobile number and service address so a provider can reach you; the bookings you make and their status; payment details, which are held by our payment processor and never stored on Setl servers; and device data such as app version and crash logs.',
      },
      {
        heading: 'Why we use it',
        body: 'To match you with an available provider, to let that provider find your address on the day, to take payment for completed work, to send booking and payment notifications, and to investigate disputes between customers and providers.',
      },
      {
        heading: 'What we share',
        body: 'The provider assigned to your booking sees your first name, your address and your phone number for the duration of the job — nothing else. We share aggregate, non-identifying figures with partners. We do not sell your personal data.',
      },
      {
        heading: 'Photos you send',
        body: 'Photos uploaded for a diagnosis are shown to the providers quoting on that request and are deleted 90 days after the job closes.',
      },
      {
        heading: 'How long we keep it',
        body: 'Booking and invoice records are kept for five years to meet UAE tax and consumer-protection requirements. Account data is deleted within 30 days of you closing your account, except records we are legally required to retain.',
      },
      {
        heading: 'Your rights',
        body: 'You can ask for a copy of your data, correct it, or have your account deleted at any time from Settings, or by writing to privacy@setl.ae. We respond within 30 days.',
      },
      {
        heading: 'Contact',
        body: 'Setl Technologies LLC, Dubai, United Arab Emirates — privacy@setl.ae.',
      },
    ],
  },
  cancellation: {
    title: 'Cancellation policy',
    updated: 'Last updated 1 August 2026',
    intro:
      'Plans change. You can cancel any booking from the Orders tab. What comes back to you depends on how close to the appointment you cancel — because a provider who is already on the way has given up other work for your slot.',
    // Rendered as a small table above the prose so the numbers are unmissable.
    tiers: [
      { when: 'More than 1 hour before', refund: '100%', tone: 'green' },
      { when: 'Within the last 30 minutes', refund: '20%', tone: 'red' },
    ],
    sections: [
      {
        heading: 'Full refund',
        body: 'Cancel more than 1 hour before your appointment starts and you are refunded in full, including any inspection fee already paid. The refund lands back on the card you used, or as Setl credit in your Wallet if you prefer it faster.',
      },
      {
        heading: 'The last 30 minutes',
        body: 'Cancel within the final 30 minutes before the appointment and only 20% is refunded. At this point the provider is normally travelling to you and cannot take another job in that window.',
      },
      {
        heading: 'If the provider cancels',
        body: 'You are refunded 100%, whenever it happens, and we offer you the next available provider for the same service at the same price.',
      },
      {
        heading: 'No-shows',
        body: 'If nobody can give the provider access at the address, the visit is treated as a cancellation inside the last 30 minutes and 20% is refunded. If the provider does not arrive, you pay nothing.',
      },
      {
        heading: 'Rescheduling',
        body: 'Moving a booking is free more than 1 hour before the slot and does not count as a cancellation. Inside that hour a reschedule is treated as a cancellation and re-booking.',
      },
      {
        heading: 'Approved repairs',
        body: 'Once you approve an estimate the parts may already be ordered. Cancelling an approved repair refunds the labour portion under the tiers above; parts already purchased for you are not refundable.',
      },
    ],
  },
}

const TIER_TONES = {
  green: 'bg-green-50 text-setl-green',
  gold: 'bg-orange-50 text-setl-gold',
  red: 'bg-red-50 text-setl-red',
}

export default function PolicyScreen({ kind = 'privacy', onBack }) {
  const policy = POLICIES[kind] ?? POLICIES.privacy

  return (
    <ScreenHeader title={policy.title} subtitle={policy.updated} onBack={onBack}>
      <p className="mt-5 text-[14px] leading-relaxed text-setl-ink-3">{policy.intro}</p>

      {policy.tiers && (
        <div className="mt-5 flex flex-col gap-2.5">
          {policy.tiers.map((t) => (
            <div key={t.when} className="row-card flex items-center justify-between px-3.5 py-3">
              <span className="pr-3 text-[14px] font-medium text-setl-ink">{t.when}</span>
              <span
                className={`shrink-0 rounded-full px-2.5 py-0.5 text-[11px] font-medium ${TIER_TONES[t.tone]}`}
              >
                {t.refund} refunded
              </span>
            </div>
          ))}
        </div>
      )}

      <div className="mt-6 flex flex-col gap-5 pb-6">
        {policy.sections.map((s) => (
          <div key={s.heading}>
            <h2 className="text-[14px] font-medium text-setl-ink">{s.heading}</h2>
            <p className="mt-1.5 text-[14px] leading-relaxed text-setl-ink-3">{s.body}</p>
          </div>
        ))}
      </div>
    </ScreenHeader>
  )
}
