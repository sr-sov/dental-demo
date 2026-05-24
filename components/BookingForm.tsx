'use client';

import { useState } from 'react';
import CalendlyEmbed from './CalendlyEmbed';

export default function BookingForm() {
  const [step, setStep] = useState<'intake' | 'schedule' | 'success'>('intake');
  const [comforts, setComforts] = useState<string[]>([]);
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    clinicalCategory: 'preventive',
    directBilling: true,
    comfortBlanket: false,
    comfortHeadphones: false,
    comfortScreen: false,
    comfortSedation: false,
    urgentEmergency: false,
  });

  const handleContinueToSchedule = (e: React.FormEvent) => {
    e.preventDefault();

    const list: string[] = [];
    if (formData.comfortBlanket) list.push('Weighted Blanket');
    if (formData.comfortHeadphones) list.push('Noise-Canceling Headphones');
    if (formData.comfortScreen) list.push('Ceiling Streaming Screen');
    if (formData.comfortSedation) list.push('Sedation Options');

    setComforts(list);
    setStep('schedule');
  };

  const serializePrefillAnswers = () => {
    const answers: Record<string, string> = {};
    const selections = [...comforts];
    if (formData.directBilling) {
      selections.unshift('Direct Insurance Billing Requested');
    }
    if (formData.urgentEmergency) {
      selections.unshift('URGENT Same-Day Slot Requested');
    }

    answers.a1 = selections.join(' | ') || 'None';
    return answers;
  };

  return (
    <div className="w-full max-w-2xl mx-auto rounded-3xl bg-white p-6 shadow-xl border border-line md:p-8 transition-all duration-300">
      {step === 'intake' && (
        <form onSubmit={handleContinueToSchedule} className="space-y-5">
          <div>
            <h3 className="font-serif text-2xl font-semibold text-foreground">
              Request an Appointment
            </h3>
            <p className="text-sm text-foreground-muted mt-1 leading-relaxed">
              Customize your complimentary comfort preferences first. Next, you
              will select your exact time slot instantly.
            </p>
          </div>

          {/* Urgency Emergency Flag */}
          <div className="flex items-center gap-3 p-3 bg-accent-soft/50 rounded-xl border border-accent/20">
            <input
              type="checkbox"
              id="urgentEmergency"
              checked={formData.urgentEmergency}
              onChange={(e) =>
                setFormData({ ...formData, urgentEmergency: e.target.checked })
              }
              className="h-4 w-4 rounded border-line text-accent focus:ring-accent"
            />
            <label
              htmlFor="urgentEmergency"
              className="text-xs font-semibold text-foreground cursor-pointer select-none"
            >
              ⚠️ Sudden oral pain? Flag as an urgent emergency same-day request
            </label>
          </div>

          {/* Intake fields */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="flex flex-col gap-1.5">
              <label htmlFor="fullName" className="text-xs font-semibold text-foreground">
                Full Name
              </label>
              <input
                type="text"
                id="fullName"
                required
                value={formData.fullName}
                onChange={(e) =>
                  setFormData({ ...formData, fullName: e.target.value })
                }
                className="rounded-lg border border-line px-3 py-2.5 text-sm text-foreground focus:border-accent focus:ring-accent focus:outline-none bg-surface/10"
                placeholder="Enter your name"
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label htmlFor="phone" className="text-xs font-semibold text-foreground">
                Phone Number
              </label>
              <input
                type="tel"
                id="phone"
                required
                value={formData.phone}
                onChange={(e) =>
                  setFormData({ ...formData, phone: e.target.value })
                }
                className="rounded-lg border border-line px-3 py-2.5 text-sm text-foreground focus:border-accent focus:ring-accent focus:outline-none bg-surface/10"
                placeholder="(587) 555-0100"
              />
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <label htmlFor="email" className="text-xs font-semibold text-foreground">
              Email Address
            </label>
            <input
              type="email"
              id="email"
              required
              value={formData.email}
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
              className="rounded-lg border border-line px-3 py-2.5 text-sm text-foreground focus:border-accent focus:ring-accent focus:outline-none bg-surface/10"
              placeholder="name@company.com"
            />
          </div>

          {/* Care Path */}
          <div className="flex flex-col gap-1.5">
            <label htmlFor="clinicalCategory" className="text-xs font-semibold text-foreground">
              Care Path
            </label>
            <select
              id="clinicalCategory"
              value={formData.clinicalCategory}
              onChange={(e) =>
                setFormData({ ...formData, clinicalCategory: e.target.value })
              }
              className="rounded-lg border border-line px-3 py-2.5 text-sm text-foreground focus:outline-none focus:border-accent focus:ring-accent bg-white"
            >
              <option value="preventive">General & Preventive</option>
              <option value="restorative">Restorative & Emergency</option>
              <option value="cosmetic">Cosmetic Transformations</option>
            </select>
          </div>

          {/* Direct Billing */}
          <div className="flex items-center gap-3">
            <input
              type="checkbox"
              id="directBilling"
              checked={formData.directBilling}
              onChange={(e) =>
                setFormData({ ...formData, directBilling: e.target.checked })
              }
              className="h-4 w-4 rounded border-line text-accent focus:ring-accent"
            />
            <label
              htmlFor="directBilling"
              className="text-xs font-medium text-foreground-muted cursor-pointer select-none"
            >
              Yes, direct bill my Calgary corporate insurance (Blue Cross, Sun
              Life, Manulife, etc.)
            </label>
          </div>

          {/* Comfort Menu selection */}
          <div className="rounded-xl border border-line bg-surface/20 p-4 space-y-3">
            <span className="text-xs font-bold text-foreground uppercase tracking-wider block">
              🌸 Anxiety-Free Comfort Menu (Complimentary)
            </span>
            <div className="grid grid-cols-2 gap-2 text-xs text-foreground-muted">
              <label className="flex items-center gap-2 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={formData.comfortBlanket}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      comfortBlanket: e.target.checked,
                    })
                  }
                  className="rounded border-line text-accent focus:ring-accent"
                />
                Weighted Blanket
              </label>
              <label className="flex items-center gap-2 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={formData.comfortHeadphones}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      comfortHeadphones: e.target.checked,
                    })
                  }
                  className="rounded border-line text-accent focus:ring-accent"
                />
                Noise-Canceling
              </label>
              <label className="flex items-center gap-2 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={formData.comfortScreen}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      comfortScreen: e.target.checked,
                    })
                  }
                  className="rounded border-line text-accent focus:ring-accent"
                />
                Ceiling Screen Stream
              </label>
              <label className="flex items-center gap-2 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={formData.comfortSedation}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      comfortSedation: e.target.checked,
                    })
                  }
                  className="rounded border-line text-accent focus:ring-accent"
                />
                Mild Sedation options
              </label>
            </div>
          </div>

          {/* Continue Button */}
          <div className="pt-2">
            <button
              type="submit"
              className="w-full rounded-xl bg-accent py-3.5 text-sm font-semibold text-white hover:brightness-[1.05] transition active:scale-[0.98] cursor-pointer"
            >
              Choose Your Time Slot ➔
            </button>
          </div>
        </form>
      )}

      {step === 'schedule' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-line">
            <div>
              <span className="text-xs font-semibold text-accent uppercase tracking-wider">
                Step 2 of 2
              </span>
              <h3 className="font-serif text-xl font-semibold text-foreground">
                Instant Scheduling
              </h3>
            </div>
            <button
              onClick={() => setStep('intake')}
              className="text-xs font-semibold text-foreground hover:text-accent transition cursor-pointer"
            >
              ⬅ Back to details
            </button>
          </div>

          <CalendlyEmbed
            url="https://calendly.com/prairie-oak/general-care"
            prefill={{
              name: formData.fullName,
              email: formData.email,
              phone: formData.phone,
              customAnswers: serializePrefillAnswers(),
            }}
            theme="light"
            onBookingComplete={() => setStep('success')}
          />
        </div>
      )}

      {step === 'success' && (
        <div className="text-center py-8 space-y-4">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-accent-soft text-accent text-2xl font-bold">
            ✓
          </div>
          <h3 className="font-serif text-2xl font-semibold text-foreground">
            Appointment Secured!
          </h3>
          <p className="text-sm text-foreground-muted max-w-sm mx-auto leading-relaxed">
            Thank you, <b>{formData.fullName}</b>! Your time slot has been
            successfully scheduled. We have pre-registered your details and
            comfort preferences.
          </p>

          {comforts.length > 0 && (
            <div className="rounded-xl bg-surface/30 p-4 max-w-sm mx-auto text-xs text-foreground-muted space-y-2.5 border border-line">
              <span className="font-bold text-foreground block uppercase tracking-wider text-[10px]">
                🌸 Comfort Options Reserved For Your Visit:
              </span>
              <div className="flex flex-wrap gap-1.5 justify-center">
                {comforts.map((item) => (
                  <span
                    key={item}
                    className="bg-white border border-line px-2.5 py-1 rounded-full font-medium"
                  >
                    🌸 {item}
                  </span>
                ))}
              </div>
            </div>
          )}

          {formData.directBilling && (
            <div className="bg-surface-alt/50 border border-line rounded-xl p-3 max-w-sm mx-auto text-xs font-medium text-foreground-muted">
              💳 Direct Insurance Billing has been flagged. Please bring your
              insurance card to your appointment.
            </div>
          )}

          <div className="pt-4">
            <button
              onClick={() => {
                setFormData({
                  fullName: '',
                  email: '',
                  phone: '',
                  clinicalCategory: 'preventive',
                  directBilling: true,
                  comfortBlanket: false,
                  comfortHeadphones: false,
                  comfortScreen: false,
                  comfortSedation: false,
                  urgentEmergency: false,
                });
                setStep('intake');
              }}
              className="rounded-xl bg-foreground px-6 py-2.5 text-sm font-semibold text-white hover:brightness-[1.1] transition cursor-pointer"
            >
              Book Another Appointment
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
