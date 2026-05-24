'use client';

import { useState, useTransition } from 'react';

export default function BookingForm() {
  const [isPending, startTransition] = useTransition();
  const [success, setSuccess] = useState(false);
  const [comforts, setComforts] = useState<string[]>([]);
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    clinicalCategory: 'preventive',
    preferredTime: 'morning',
    directBilling: true,
    comfortBlanket: false,
    comfortHeadphones: false,
    comfortScreen: false,
    comfortSedation: false,
    urgentEmergency: false,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    startTransition(async () => {
      // Mock Server Action Submit Delay
      await new Promise((res) => setTimeout(res, 800));
      
      const list: string[] = [];
      if (formData.comfortBlanket) list.push('Weighted Blanket');
      if (formData.comfortHeadphones) list.push('Noise-Canceling Headphones');
      if (formData.comfortScreen) list.push('Ceiling Streaming Screen');
      if (formData.comfortSedation) list.push('Sedation Options');
      
      setComforts(list);
      setSuccess(true);
    });
  };

  return (
    <div className="w-full max-w-2xl mx-auto rounded-3xl bg-white p-6 shadow-xl border border-wc-line md:p-8">
      {!success ? (
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <h3 className="font-serif text-2xl font-semibold text-wc-ink">
              Request an Appointment
            </h3>
            <p className="text-sm text-wc-ink-soft mt-1 leading-relaxed">
              Take a moment to customize your comfort choices. We’ll review and contact you to confirm.
            </p>
          </div>

          {/* Urgency Emergency Flag */}
          <div className="flex items-center gap-3 p-3 bg-wc-accent-soft/50 rounded-xl border border-wc-accent/20">
            <input 
              type="checkbox" 
              id="urgentEmergency"
              checked={formData.urgentEmergency}
              onChange={(e) => setFormData({ ...formData, urgentEmergency: e.target.checked })}
              className="h-4 w-4 rounded border-wc-line text-wc-accent focus:ring-wc-accent"
            />
            <label htmlFor="urgentEmergency" className="text-xs font-semibold text-wc-ink cursor-pointer select-none">
              ⚠️ Sudden oral pain? Flag as an urgent emergency same-day request
            </label>
          </div>

          {/* Intake fields */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="flex flex-col gap-1.5">
              <label htmlFor="fullName" className="text-xs font-semibold text-wc-ink">Full Name</label>
              <input
                type="text"
                id="fullName"
                required
                value={formData.fullName}
                onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                className="rounded-lg border border-wc-line px-3 py-2.5 text-sm text-wc-ink focus:border-wc-accent focus:ring-wc-accent focus:outline-none bg-wc-bg/10"
                placeholder="Enter your name"
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label htmlFor="phone" className="text-xs font-semibold text-wc-ink">Phone Number</label>
              <input
                type="tel"
                id="phone"
                required
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="rounded-lg border border-wc-line px-3 py-2.5 text-sm text-wc-ink focus:border-wc-accent focus:ring-wc-accent focus:outline-none bg-wc-bg/10"
                placeholder="(587) 555-0100"
              />
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <label htmlFor="email" className="text-xs font-semibold text-wc-ink">Email Address</label>
            <input
              type="email"
              id="email"
              required
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="rounded-lg border border-wc-line px-3 py-2.5 text-sm text-wc-ink focus:border-wc-accent focus:ring-wc-accent focus:outline-none bg-wc-bg/10"
              placeholder="name@company.com"
            />
          </div>

          {/* Preferred Slot & Care */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="flex flex-col gap-1.5">
              <label htmlFor="clinicalCategory" className="text-xs font-semibold text-wc-ink">Care Path</label>
              <select
                id="clinicalCategory"
                value={formData.clinicalCategory}
                onChange={(e) => setFormData({ ...formData, clinicalCategory: e.target.value })}
                className="rounded-lg border border-wc-line px-3 py-2.5 text-sm text-wc-ink focus:outline-none focus:border-wc-accent focus:ring-wc-accent bg-white"
              >
                <option value="preventive">General & Preventive</option>
                <option value="restorative">Restorative & Emergency</option>
                <option value="cosmetic">Cosmetic Transformations</option>
              </select>
            </div>
            <div className="flex flex-col gap-1.5">
              <label htmlFor="preferredTime" className="text-xs font-semibold text-wc-ink">Best Time</label>
              <select
                id="preferredTime"
                value={formData.preferredTime}
                onChange={(e) => setFormData({ ...formData, preferredTime: e.target.value })}
                className="rounded-lg border border-wc-line px-3 py-2.5 text-sm text-wc-ink focus:outline-none focus:border-wc-accent focus:ring-wc-accent bg-white"
              >
                <option value="morning">Morning (8 AM - 12 PM)</option>
                <option value="afternoon">Afternoon (12 PM - 4 PM)</option>
                <option value="evening">Evening (4 PM - 8 PM)</option>
              </select>
            </div>
          </div>

          {/* Direct Billing */}
          <div className="flex items-center gap-3">
            <input 
              type="checkbox" 
              id="directBilling"
              checked={formData.directBilling}
              onChange={(e) => setFormData({ ...formData, directBilling: e.target.checked })}
              className="h-4 w-4 rounded border-wc-line text-wc-accent focus:ring-wc-accent"
            />
            <label htmlFor="directBilling" className="text-xs font-medium text-wc-ink-soft cursor-pointer select-none">
              Yes, direct bill my Calgary corporate insurance (Blue Cross, Sun Life, Manulife, etc.)
            </label>
          </div>

          {/* Comfort Menu selection */}
          <div className="rounded-xl border border-wc-line bg-wc-bg/20 p-4 space-y-3">
            <span className="text-xs font-bold text-wc-ink uppercase tracking-wider block">
              🌸 Anxiety-Free Comfort Menu (Complimentary)
            </span>
            <div className="grid grid-cols-2 gap-2 text-xs text-wc-ink-soft">
              <label className="flex items-center gap-2 cursor-pointer select-none">
                <input 
                  type="checkbox"
                  checked={formData.comfortBlanket}
                  onChange={(e) => setFormData({ ...formData, comfortBlanket: e.target.checked })}
                  className="rounded border-wc-line text-wc-accent focus:ring-wc-accent" 
                />
                Weighted Blanket
              </label>
              <label className="flex items-center gap-2 cursor-pointer select-none">
                <input 
                  type="checkbox"
                  checked={formData.comfortHeadphones}
                  onChange={(e) => setFormData({ ...formData, comfortHeadphones: e.target.checked })}
                  className="rounded border-wc-line text-wc-accent focus:ring-wc-accent" 
                />
                Noise-Canceling
              </label>
              <label className="flex items-center gap-2 cursor-pointer select-none">
                <input 
                  type="checkbox"
                  checked={formData.comfortScreen}
                  onChange={(e) => setFormData({ ...formData, comfortScreen: e.target.checked })}
                  className="rounded border-wc-line text-wc-accent focus:ring-wc-accent" 
                />
                Ceiling Screen Stream
              </label>
              <label className="flex items-center gap-2 cursor-pointer select-none">
                <input 
                  type="checkbox"
                  checked={formData.comfortSedation}
                  onChange={(e) => setFormData({ ...formData, comfortSedation: e.target.checked })}
                  className="rounded border-wc-line text-wc-accent focus:ring-wc-accent" 
                />
                Mild Sedation options
              </label>
            </div>
          </div>

          {/* Submit Button */}
          <div className="pt-2">
            <button
              type="submit"
              disabled={isPending}
              className="w-full rounded-xl bg-wc-accent py-3.5 text-sm font-semibold text-white hover:brightness-[1.05] transition disabled:opacity-50 active:scale-[0.98] cursor-pointer"
            >
              {isPending ? 'Sending request…' : 'Submit request'}
            </button>
          </div>
        </form>
      ) : (
        <div className="text-center py-8 space-y-4">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-wc-accent-soft text-wc-accent text-2xl font-bold">
            ✓
          </div>
          <h3 className="font-serif text-2xl font-semibold text-wc-ink">
            Intake Request Submitted
          </h3>
          <p className="text-sm text-wc-ink-soft max-w-sm mx-auto leading-relaxed">
            Thank you, <b>{formData.fullName}</b>! We received your booking request. Our Calgary team will call or text you shortly to finalize your slot.
          </p>

          {comforts.length > 0 && (
            <div className="rounded-xl bg-wc-bg/30 p-3 max-w-sm mx-auto text-xs text-wc-ink-soft space-y-1.5 border border-wc-line">
              <span className="font-bold text-wc-ink block uppercase tracking-wider text-[10px]">
                We’ve Reserved Your Comfort Items
              </span>
              <div className="flex flex-wrap gap-1.5 justify-center mt-1">
                {comforts.map((item) => (
                  <span key={item} className="bg-white border border-wc-line px-2 py-0.5 rounded-full font-medium">
                    🌸 {item}
                  </span>
                ))}
              </div>
            </div>
          )}

          {formData.urgentEmergency && (
            <div className="bg-wc-accent-soft border border-wc-accent/25 rounded-xl p-3 max-w-sm mx-auto text-xs font-semibold text-wc-accent">
              ⚠️ Same-day emergency prioritisation active. We are preparing our next open treatment room slot for you.
            </div>
          )}

          <div className="pt-4">
            <button
              onClick={() => setSuccess(false)}
              className="rounded-xl bg-wc-ink px-6 py-2.5 text-sm font-semibold text-white hover:brightness-[1.1] transition cursor-pointer"
            >
              Reset Form
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
