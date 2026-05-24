import Navbar from '@/components/Navbar';
import Hero from '@/components/Hero';
import TrustStrip from '@/components/TrustStrip';
import Emergency from '@/components/Emergency';
import Comfort from '@/components/Comfort';
import Services from '@/components/Services';
import About from '@/components/About';
import Reviews from '@/components/Reviews';
import FaqSection from '@/components/FaqSection';
import Insurance from '@/components/Insurance';
import FinalCta from '@/components/FinalCta';
import Location from '@/components/Location';
import Footer from '@/components/Footer';
import StickyEmergencyBar from '@/components/StickyEmergencyBar';

const CTA_TEXT = 'Request an appointment';

export default function WarmClinical() {
  return (
    <div className="min-h-screen bg-wc-bg text-wc-ink font-body selection:bg-wc-accent-soft selection:text-wc-accent">
      <Navbar ctaText={CTA_TEXT} />
      
      <main>
        <Hero ctaText={CTA_TEXT} />
        <TrustStrip />
        <Emergency />
        <Comfort />
        <Services />
        <About />
        <Reviews />
        <FaqSection />
        <Insurance />
        <FinalCta />
        <Location />
      </main>

      <Footer />
      <StickyEmergencyBar />
    </div>
  );
}
