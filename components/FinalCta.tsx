import BookingForm from './BookingForm';
import { PhoneLink } from '@/components/ui';

export default function FinalCta() {
  return (
    <section className="bg-surface-emphasis py-14 lg:py-20" id="book" role="region" aria-label="Book an appointment">
      <div className="mx-auto max-w-7xl px-6 lg:px-8 grid grid-cols-1 gap-10 lg:grid-cols-12 lg:items-center">
        {/* Headline Content */}
        <div className="lg:col-span-5 space-y-5 text-left">
          <span className="font-display text-xs font-semibold tracking-wider text-accent uppercase block">
            Ready when you are
          </span>
          <h2 className="font-serif text-4xl font-medium tracking-tight text-white md:text-5xl leading-[1.05]">
            Find a time that works for you.
          </h2>
          <p className="text-sm leading-relaxed text-white/70 max-w-sm">
            Most new patients in Calgary are seen within the same week. Online intake request takes about 4 minutes.
          </p>
          <div className="pt-2">
            <PhoneLink
              number="+15875550142"
              display="Call (587) 555-0142"
              className="inline-flex items-center gap-2 rounded-xl border border-white/20 bg-transparent px-5 py-3 text-sm font-semibold text-white hover:bg-white/10 transition"
            />
          </div>
        </div>

        {/* Inline Intake Form */}
        <div className="lg:col-span-7">
          <BookingForm />
        </div>
      </div>
    </section>
  );
}
