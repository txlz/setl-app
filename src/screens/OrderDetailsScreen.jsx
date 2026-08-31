import { useState } from 'react'
import GradientHeader from '../components/GradientHeader.jsx'
import GradientButton from '../components/GradientButton.jsx'
import AppointmentCard from '../components/AppointmentCard.jsx'
import ProgressSteps from '../components/ProgressSteps.jsx'
import DateTimeSheet from '../components/DateTimeSheet.jsx'
import PaymentMethods from '../components/PaymentMethods.jsx'
import VoucherField from '../components/VoucherField.jsx'
import { AC_PRICE_PER_UNIT, CUSTOMER_ME, SERVICES } from '../data/providers.js'

// Checkout in three flavors:
//  - inspection:  the standardized fee is prepaid here (payment methods +
//                 voucher stay on this screen)
//  - booking:     direct work — confirm only, AED 0 due now; payment happens
//                 from Orders once the work is done (Phase 1)
//  - maintenance: approved estimate — same 0-due confirm, with the prepaid
//                 inspection fee credited on the projected total
export default function OrderDetailsScreen({ booking, counts, place, onPay, onBack, onReschedule, onChangeProvider }) {
  const [method, setMethod] = useState('wallet')
  const [voucherRate, setVoucherRate] = useState(0)
  const [confirming, setConfirming] = useState(false)
  const [rescheduling, setRescheduling] = useState(false) // date/time sheet open

  const isInspection = booking.variant === 'inspection'
  const isMaintenance = booking.variant === 'maintenance'
  const service = SERVICES[booking.service]

  // What is being paid for depends on the flow:
  //  - inspection booking -> only the standardized inspection fee
  //  - maintenance        -> the products the inspector proposed (accepted by the customer)
  //  - direct options     -> call-out fee + the jobs picked on the options screen
  //  - direct hourly      -> the provider's rate x hours needed
  //  - direct AC          -> the selected AC services
  const items = isInspection
    ? [{ label: 'Inspection visit', qty: 1, price: booking.price }]
    : isMaintenance
      ? booking.products.map((p) => ({ label: p.name, qty: p.qty, price: p.price }))
      : booking.photoQuote
        ? [
            {
              label: 'Service (from your photos)',
              qty: 1,
              price: Math.round((booking.photoQuote[0] + booking.photoQuote[1]) / 2),
            },
          ]
        : booking.options
        ? [
            { label: 'Visit & labor', qty: 1, price: booking.provider.bookingFee },
            ...booking.options.map((o) => ({ label: o.label, qty: 1, price: o.price })),
          ]
        : booking.pestItems
        ? [
            { label: 'Call-out fee', qty: 1, price: booking.provider.bookingFee },
            // Each room carries its own spread, so the price comes from the
            // line item rather than rooms x a flat rate.
            ...booking.pestItems.map((p) => ({
              label: `${p.label} (${p.rooms} ${p.rooms === 1 ? 'room' : 'rooms'}: ${p.levels.join(', ')})`,
              qty: p.rooms,
              price: p.price,
            })),
          ]
        : booking.washItems
        ? booking.washItems.map((w) => ({ label: w.label, qty: 1, price: w.price }))
        : service.pricingModel === 'hourly'
        ? [
            {
              label: `${service.label} hour (${booking.provider.bookingFee} AED/hr)`,
              qty: booking.hours,
              price: booking.hours * booking.provider.bookingFee,
            },
            // specific jobs added on top of the hourly rate
            ...(booking.cleanItems ?? []),
          ]
        : [
            { label: 'Ac refilling', qty: counts.refill, price: counts.refill * AC_PRICE_PER_UNIT },
            { label: 'Ac Cleaning', qty: counts.clean, price: counts.clean * AC_PRICE_PER_UNIT },
          ].filter((it) => it.qty > 0)

  const subtotal = items.reduce((sum, it) => sum + it.price, 0)
  // 10% off accepted maintenance (mockup 11a), 5% off direct bookings (mockup 13)
  const baseRate = isMaintenance ? 0.1 : isInspection ? 0 : 0.05
  const baseDiscount = Math.round(subtotal * baseRate)
  // The prepaid inspection fee comes off the repair total (decision C) —
  // whatever was actually paid, in case a voucher discounted it
  const credit = isMaintenance ? (booking.total ?? booking.price) : 0
  const voucherDiscount = isInspection ? Math.round(subtotal * voucherRate) : 0
  const total = Math.max(0, subtotal - baseDiscount - credit - voucherDiscount)

  return (
    <GradientHeader
      title={isInspection ? 'Check out' : isMaintenance ? 'Confirm repair' : 'Confirm booking'}
      onBack={onBack}
      sheetClassName="bg-[#F5F4F7]"
    >
      <div className="font-poppins flex grow flex-col px-3 pb-6">
      {/* Inspection checkout (mockup 7): timing + location sections */}
      {isInspection && (
        <>
          {service.requiresInspection && (
            <p className="mt-3 flex items-center gap-3 rounded-[5px] bg-white p-3 text-[12px] text-setl-ink-3 shadow-[0_4px_4px_rgba(0,0,0,0.03)]">
              <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-red-500 text-[15px] font-bold text-white">
                !
              </span>
              An inspection visit comes first so you get a clear, itemized quote. The inspection
              fee is credited toward your repair if you proceed.
            </p>
          )}
          {/* Section headings on the board are 14px/500 black (1.html:742 "Timing",
              1.html:733 "Service"); the ones over a details card are #0D0000
              (1.html:805 "Location Details"). Cards are radius 5 with a tight
              0 4px 4px rgba(0,0,0,.03) shadow (1.html:795). */}
          <h2 className="mt-4 text-[14px] font-medium text-black">Timing</h2>
          <div className="mt-1 flex items-center justify-between rounded-[5px] bg-white p-3 shadow-[0_4px_4px_rgba(0,0,0,0.03)]">
            <div>
              {/* Board's date/time rows are 12px — #313131 date (1.html:755), 10px
                  violet time (1.html:756); "change" is underlined violet (1.html:757). */}
              <p className="text-[12px] text-[#313131]">
                {booking.date.day} {booking.date.num}
              </p>
              <p className="text-[12px] text-setl-violet">{booking.time}</p>
            </div>
            <button
              type="button"
              onClick={() => setRescheduling(true)}
              className="cursor-pointer text-[12px] text-setl-violet underline"
            >
              Change
            </button>
          </div>
          <h2 className="mt-4 text-[14px] font-medium text-setl-ink">Location</h2>
          <div className="mt-1 rounded-[5px] bg-white p-3 shadow-[0_4px_4px_rgba(0,0,0,0.03)]">
            {/* Address label 12px/500 (1.html:807); its value 12px/400 #A8A3A3 (1.html:808). */}
            <p className="text-[12px] font-medium text-black/80">
              {place?.nameNumber?.trim() ? place.nameNumber : CUSTOMER_ME.address}
            </p>
            <p className="text-[12px] text-setl-muted-2">{CUSTOMER_ME.area}</p>
            <div className="mt-2 flex gap-3">
              {['Indoor', 'Outdoor', 'Villa'].map((t) => (
                // Chips on the export (1.html:809-814) are 66x27, 0.5px border, no shadow;
                // label 12px/400 — #7E43FF on a violet border when picked, else #A8A3A3.
                <span
                  key={t}
                  className={`flex h-[27px] w-[66px] items-center justify-center rounded-[11px] border-[0.5px] bg-white text-[12px] ${
                    (place?.type ?? 'Indoor') === t
                      ? 'border-setl-violet text-setl-violet'
                      : 'border-setl-line-2 text-setl-muted-2'
                  }`}
                >
                  {t}
                </span>
              ))}
            </div>
          </div>
          <h2 className="mt-4 text-[14px] font-medium text-black">Service</h2>
        </>
      )}

      {/* Provider / appointment card; Change picks a different provider */}
      <div className="mt-5">
        <AppointmentCard
          booking={booking}
          label={isInspection ? service.inspectionLabel : service.maintenanceLabel}
          price={total}
          onChange={isInspection ? onChangeProvider : undefined}
        />
      </div>

      {/* App-only caption (no board counterpart); typed to the board's 10px
          helper size, cf. "Additional Instruction" 10px/500 at 1.html:798. */}
      {isInspection && (
        <p className="mt-1 px-2 text-[10px] text-setl-muted-2">
          After the inspection you approve or decline the repair. The fee is credited toward the
          repair if you proceed — non-refundable otherwise.
        </p>
      )}

      {/* Progress (maintenance flow): approving now, payment comes after the work */}
      {isMaintenance && (
        <div className="mt-6">
          <ProgressSteps current="approve" />
        </div>
      )}

      {/* Payment method + voucher only where money moves now (inspection fee) */}
      {isInspection && (
        <>
          {/* "payment methods" on the board is 14px/500 #0D0000 (1.html:806). */}
          <h2 className="mt-4 text-[14px] font-medium text-setl-ink">Payment method</h2>
          <PaymentMethods method={method} onChange={setMethod} />
          <VoucherField onApplied={(rate) => setVoucherRate(rate)} />
        </>
      )}

      {/* Pay after completion (decision B). App-only notice with no board
          counterpart; radius 5 and 12px/500 to sit in the board's card + type
          ramp (1.html:795, :744). */}
      {!isInspection && (
        <div className="mt-4 rounded-[5px] bg-[#EDE4FD] p-3 text-center text-[12px] font-medium text-setl-violet">
          AED 0 due now — pay when the work is done.
        </div>
      )}

      {/* Order summary */}
      {/* Summary card matches the board's detail cards: radius 5, 0 4px 4px
          rgba(0,0,0,.03) (1.html:795). Its heading is a 14px/500 section title
          (1.html:753 "Discount"); the rows are 12px (1.html:807-808). */}
      <div className="mt-4 rounded-[5px] bg-white p-4 shadow-[0_4px_4px_rgba(0,0,0,0.03)]">
        <h3 className="text-[14px] font-medium text-black">Order Summary</h3>
        {items.map((it) => (
          <div key={it.label} className="mt-1 flex justify-between text-[12px] text-setl-muted-2">
            <span>
              {it.qty}x {it.label}
            </span>
            <span>{it.price} AED</span>
          </div>
        ))}
        <div className="mt-1 flex justify-between text-[12px]">
          <span className="font-medium text-black/80">
            Subtotal <span className="text-setl-muted-2">({items.length} {items.length === 1 ? 'item' : 'items'})</span>
          </span>
          <span className="font-medium text-black/80">{subtotal}.00 AED</span>
        </div>
        {baseDiscount > 0 && (
          <div className="flex items-baseline justify-between gap-2 text-[12px]">
            <span className="font-medium text-black/80">
              Saving &amp; Discounts{' '}
              <span className="text-setl-violet">(Discount applied {baseRate * 100}%)</span>
            </span>
            <span className="shrink-0 whitespace-nowrap text-setl-violet">- {baseDiscount} AED</span>
          </div>
        )}
        {credit > 0 && (
          <div className="flex items-baseline justify-between gap-2 text-[12px]">
            <span className="font-medium text-black/80">
              Inspection fee credit <span className="text-setl-violet">(paid at booking)</span>
            </span>
            <span className="shrink-0 whitespace-nowrap text-setl-violet">- {credit} AED</span>
          </div>
        )}
        {voucherDiscount > 0 && (
          <div className="flex items-baseline justify-between gap-2 text-[12px]">
            <span className="font-medium text-black/80">Voucher</span>
            <span className="shrink-0 whitespace-nowrap text-setl-violet">- {voucherDiscount} AED</span>
          </div>
        )}
        {/* Board's total bar: "Total" 15px/500 black (1.html:890), the amount
            15px/700 #7E43FF (1.html:891). */}
        <div className="mt-2 flex items-center justify-between border-t border-setl-surface-3 pt-2">
          <span className="text-[12px] text-setl-muted-2">
            {isInspection ? '(VAT included)' : 'Due after completion'}
          </span>
          <span className="text-[15px] font-bold text-setl-violet">{total} AED</span>
        </div>
      </div>

      <div className="grow" />

      <GradientButton
        className="mt-6"
        loading={confirming}
        onClick={() => {
          setConfirming(true)
          // Simulated processing; later the payment gateway (inspection) or
          // the booking API (confirm variants)
          setTimeout(
            () => onPay(total, { items, discount: baseDiscount, inspectionCredit: credit }),
            1200,
          )
        }}
      >
        {isInspection ? 'Confirm' : isMaintenance ? 'Confirm repair' : 'Confirm booking'}
      </GradientButton>

      {rescheduling && (
        <DateTimeSheet
          provider={booking.provider}
          title="Inspection time & date"
          onClose={() => setRescheduling(false)}
          onConfirm={({ date, time }) => {
            onReschedule(date, time)
            setRescheduling(false)
          }}
        />
      )}
      </div>
    </GradientHeader>
  )
}
