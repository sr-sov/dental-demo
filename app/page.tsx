'use client';

import { useState, useEffect, Fragment } from 'react';

// ── Design tokens (light, orange accent, regular density) ─────────────────
const K = {
  bg: '#F6F1E8',
  bg2: '#EFE7D7',
  surface: '#FFFFFF',
  surface2: '#EFE7D7',
  ink: '#1F2E40',
  inkSoft: '#445567',
  muted: '#7A8593',
  line: '#E5DCC8',
  accent: '#D97757',
  accentSoft: '#F4DDD2',
  accentGlow: 'rgba(217,119,87,0.25)',
  onAccent: '#FFFFFF',
  gold: '#C9A464',
  deep: '#142233',
} as const;

const HF = 'var(--font-serif)';   // headline font
const HW = 500;                    // headline weight
const HLS = '-0.01em';             // headline letter-spacing
const CTA = 'Request an appointment';

// ── Content ───────────────────────────────────────────────────────────────
const TRUST_BADGES = [
  { t: 'Direct insurance billing', s: 'We submit the paperwork. You pay your co-pay only.' },
  { t: 'Alberta Fee Guide', s: 'Standard rates. No surprise invoices, ever.' },
  { t: 'Free on-site parking', s: "And we're a 7-minute walk from the LRT." },
];

const COMFORT = [
  { t: 'Weighted blankets', s: 'Gravity grounded, calm shoulders. Yours to keep on during the visit.' },
  { t: 'Noise-cancelling headphones', s: 'Bring your own playlist, or borrow ours.' },
  { t: 'Ceiling-mounted streaming', s: "Pick a show. We'll work below." },
  { t: 'Mild sedation, on request', s: 'For longer visits or higher anxiety. Talk to us — no judgment.' },
];

const SERVICES = [
  {
    cat: '01',
    title: 'General & Preventive',
    tag: 'For every six months',
    items: ['Checkups & digital X-rays', 'Cleanings & hygiene plans', "Kids' first visits"],
  },
  {
    cat: '02',
    title: 'Restorative & Same-Day',
    tag: 'When something hurts',
    items: ['Tooth-coloured fillings', 'Root canals & pain relief', 'Crowns, bridges, implants'],
  },
  {
    cat: '03',
    title: 'Cosmetic & Aligners',
    tag: "When you're ready",
    items: ['In-office laser whitening', 'Porcelain veneers', 'Invisalign® clear aligners'],
  },
];

const REVIEWS = [
  {
    quote: "First dentist I've had in a decade who didn't make me feel ashamed for waiting. They handed me a blanket before I even sat down.",
    name: 'Megan T.',
    sub: 'Mahogany · New patient, 2025',
  },
  {
    quote: 'My six-year-old asked when his next cleaning was. I almost dropped my coffee. Worth every star.',
    name: 'Daniel R.',
    sub: 'Auburn Bay · Family patient',
  },
  {
    quote: 'Lost a filling on a Sunday night. They had me in by 9am Monday and I was out before lunch. Direct billed Sun Life on the spot.',
    name: 'Priya S.',
    sub: 'Seton · Emergency visit',
  },
  {
    quote: 'They actually explained what each line on the treatment plan was for. Felt like a conversation, not a sales pitch.',
    name: 'Owen K.',
    sub: 'Cranston · Returning patient',
  },
];

const INSURERS = [
  'Alberta Blue Cross', 'Sun Life', 'Manulife', 'Canada Life',
  'Pacific Blue Cross', 'Great-West Life', 'Green Shield', 'Desjardins',
];

const HOURS: [string, string][] = [
  ['Monday',    '8 am – 6 pm'],
  ['Tuesday',   '8 am – 6 pm'],
  ['Wednesday', '8 am – 8 pm'],
  ['Thursday',  '8 am – 8 pm'],
  ['Friday',    '8 am – 4 pm'],
  ['Saturday',  '9 am – 3 pm'],
  ['Sunday',    'Emergency only'],
];

const FAQS = [
  {
    q: "I haven't been to the dentist in years. Will I be lectured?",
    a: "No. We mean it. We start with a no-judgement conversation, take a look at where you're at, and build a plan you're comfortable with — even if that means just the cleaning today, more another time.",
  },
  {
    q: 'How does direct billing work, exactly?',
    a: 'We submit the claim to your insurance during your visit. The provider pays us directly. You only pay your portion (usually 0–20%) on the day. No paperwork on your end.',
  },
  {
    q: 'Do you take new patients right now?',
    a: 'Yes. We hold space for new-patient visits every week and same-day emergency slots every day. Online intake takes about 4 minutes from your phone.',
  },
  {
    q: "My kid has never been to the dentist. What's the visit like?",
    a: "First visits for kids are 30 minutes, mostly play — counting teeth, riding the chair up and down, picking a sticker. No drilling, no sharp tools. We want them excited for the next one.",
  },
];

// ── Hooks ─────────────────────────────────────────────────────────────────
type Viewport = 'mobile' | 'tablet' | 'desktop';

function useViewport(): Viewport {
  const [vp, setVp] = useState<Viewport>('desktop');
  useEffect(() => {
    const get = (): Viewport => {
      const w = window.innerWidth;
      return w < 640 ? 'mobile' : w < 1024 ? 'tablet' : 'desktop';
    };
    setVp(get());
    let raf = 0;
    const on = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => setVp(get()));
    };
    window.addEventListener('resize', on);
    return () => { window.removeEventListener('resize', on); cancelAnimationFrame(raf); };
  }, []);
  return vp;
}

function useScrolled(threshold = 24): boolean {
  const [s, setS] = useState(false);
  useEffect(() => {
    const on = () => setS(window.scrollY > threshold);
    on();
    window.addEventListener('scroll', on, { passive: true });
    return () => window.removeEventListener('scroll', on);
  }, [threshold]);
  return s;
}

// ── Icons ─────────────────────────────────────────────────────────────────
const I = {
  phone: (c = 'currentColor') => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
    </svg>
  ),
  arrow: (c = 'currentColor') => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M5 12h14M13 5l7 7-7 7" />
    </svg>
  ),
  check: (c = 'currentColor') => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20 6 9 17l-5-5" />
    </svg>
  ),
  pin: (c = 'currentColor') => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 22s-7-7.5-7-13a7 7 0 0 1 14 0c0 5.5-7 13-7 13z" />
      <circle cx="12" cy="9" r="2.5" />
    </svg>
  ),
  clock: (c = 'currentColor') => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7v5l3.5 2" />
    </svg>
  ),
  menu: (c = 'currentColor') => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="1.8" strokeLinecap="round">
      <path d="M4 7h16M4 12h16M4 17h16" />
    </svg>
  ),
};

// ── Shared components ─────────────────────────────────────────────────────
function PhotoSlot({
  label,
  ratio = '4/5',
  tone = 'warm',
  round = 12,
}: {
  label: string;
  ratio?: string;
  tone?: 'warm' | 'sage' | 'slate';
  round?: number;
}) {
  const palettes = {
    warm:  { a: '#E5D5BC', b: '#D9C4A4', ink: '#6B5A42' },
    sage:  { a: '#CFD8C6', b: '#B7C2A6', ink: '#566549' },
    slate: { a: '#C9D2DC', b: '#A9B5C3', ink: '#3D4A5C' },
  };
  const p = palettes[tone];
  return (
    <div style={{
      aspectRatio: ratio,
      background: `repeating-linear-gradient(135deg, ${p.a} 0 14px, ${p.b} 14px 28px)`,
      borderRadius: round,
      position: 'relative',
      overflow: 'hidden',
    }}>
      <div style={{
        position: 'absolute', inset: 0,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}>
        <div style={{
          background: 'rgba(255,255,255,0.85)',
          color: p.ink,
          padding: '8px 12px',
          borderRadius: 999,
          fontFamily: 'ui-monospace, "SF Mono", Menlo, monospace',
          fontSize: 11,
          letterSpacing: '0.04em',
          textTransform: 'uppercase',
          whiteSpace: 'nowrap',
        }}>
          ↳ {label}
        </div>
      </div>
    </div>
  );
}

function Stars({ color = '#C9A464', size = 12 }: { color?: string; size?: number }) {
  return (
    <span style={{ display: 'inline-flex', gap: 2 }}>
      {[0, 1, 2, 3, 4].map((i) => (
        <svg key={i} width={size} height={size} viewBox="0 0 24 24" fill={color}>
          <path d="M12 2l2.9 6.9 7.1.6-5.4 4.7 1.7 7-6.3-3.8L5.7 21l1.7-7L2 9.5l7.1-.6L12 2z" />
        </svg>
      ))}
    </span>
  );
}

function POLogo({ color = 'currentColor' }: { color?: string }) {
  return (
    <div style={{
      display: 'inline-flex', alignItems: 'center', gap: 8,
      color, fontFamily: 'var(--font-serif)',
      fontWeight: 500, letterSpacing: '0.005em',
      fontSize: 16, lineHeight: 1,
    }}>
      <svg width="20" height="20" viewBox="0 0 32 32" fill="none">
        <circle cx="16" cy="16" r="15" stroke={color} strokeWidth="1.3" />
        <path d="M16 8 C 11 8, 9 12, 11 17 C 13 21, 16 22, 16 22 C 16 22, 19 21, 21 17 C 23 12, 21 8, 16 8 Z"
              stroke={color} strokeWidth="1.3" fill="none" strokeLinejoin="round" />
        <path d="M16 13 V 21" stroke={color} strokeWidth="1.3" strokeLinecap="round" />
      </svg>
      <span>Prairie Oak</span>
    </div>
  );
}

// ── Header ────────────────────────────────────────────────────────────────
function WCHeader({
  scrolled, onMenu, mobileOpen, vp,
}: {
  scrolled: boolean; onMenu: () => void; mobileOpen: boolean; vp: Viewport;
}) {
  const isMobile = vp === 'mobile';
  return (
    <div
      className="wc-header"
      style={{
        background: scrolled ? 'rgba(246,241,232,0.92)' : 'transparent',
        borderBottom: scrolled ? `1px solid ${K.line}` : '1px solid transparent',
        color: K.ink,
      }}
    >
      <div className="wc-header-inner">
        <a href="#top" className="wc-logo"><POLogo color={K.ink} /></a>
        {!isMobile && (
          <nav className="wc-nav">
            {(['Services', 'Why us', 'About', 'Reviews', 'Visit'] as const).map((l) => (
              <a key={l} href={'#' + l.toLowerCase().replace(/\s+/g, '-')}>{l}</a>
            ))}
          </nav>
        )}
        <div className="wc-header-cta">
          {!isMobile && (
            <a href="tel:+15875550142" className="wc-phone-link">
              {I.phone(K.accent)} (587) 555-0142
            </a>
          )}
          <a
            href="#book"
            className="wc-btn wc-btn-accent"
            style={{ background: K.accent, color: K.onAccent, boxShadow: `0 6px 18px ${K.accentGlow}` }}
          >
            {isMobile ? 'Book' : CTA}
            <span style={{ display: 'inline-flex' }}>{I.arrow(K.onAccent)}</span>
          </a>
          {isMobile && (
            <button className="wc-iconbtn" onClick={onMenu} aria-label="Menu" style={{ color: K.ink }}>
              {mobileOpen
                ? <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"><path d="M6 6l12 12M6 18L18 6"/></svg>
                : I.menu(K.ink)}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

function MobileMenu({ open, onClose }: { open: boolean; onClose: () => void }) {
  return (
    <div
      className="wc-mobile-menu"
      data-open={open ? '1' : '0'}
      style={{ background: K.bg, color: K.ink, borderBottom: `1px solid ${K.line}` }}
    >
      <nav>
        {(['Services', 'Why us', 'About', 'Reviews', 'Visit', 'Insurance'] as const).map((l) => (
          <a
            key={l}
            href={'#' + l.toLowerCase().replace(/\s+/g, '-')}
            onClick={onClose}
            style={{ borderBottom: `1px solid ${K.line}`, color: K.ink }}
          >
            <span>{l}</span>
            <span style={{ color: K.muted }}>{I.arrow(K.muted)}</span>
          </a>
        ))}
        <a href="tel:+15875550142" onClick={onClose} style={{ color: K.accent }}>
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: 10 }}>
            {I.phone(K.accent)} (587) 555-0142
          </span>
        </a>
      </nav>
    </div>
  );
}

// ── Hero ──────────────────────────────────────────────────────────────────
function WCHero({ vp }: { vp: Viewport }) {
  const isDesktop = vp === 'desktop';
  return (
    <section className="wc-hero" id="top" style={{ background: K.bg }}>
      <div className="wc-container wc-hero-inner">
        <div className="wc-hero-text">
          <div className="wc-eyebrow" style={{ color: K.muted }}>
            <span style={{ background: K.muted }} />
            Dental care · South Calgary
          </div>
          <h1 style={{ fontFamily: HF, fontWeight: HW, letterSpacing: HLS, color: K.ink }}>
            A calmer kind of dental visit.
          </h1>
          <p style={{ color: K.inkSoft }}>
            Modern dentistry that treats you like a person, not a procedure. Weighted blankets, direct billing, same-day emergencies.
          </p>
          <div className="wc-hero-ctas">
            <a
              href="#book"
              className="wc-btn wc-btn-accent wc-btn-lg"
              style={{ background: K.accent, color: K.onAccent, boxShadow: `0 10px 30px ${K.accentGlow}` }}
            >
              <span>{CTA}</span>
              {I.arrow(K.onAccent)}
            </a>
            <a
              href="tel:+15875550142"
              className="wc-btn wc-btn-ghost wc-btn-lg"
              style={{ border: `1px solid ${K.line}`, background: K.surface, color: K.ink }}
            >
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: 10 }}>
                {I.phone(K.accent)} (587) 555-0142
              </span>
              <span style={{ fontSize: 12, color: K.muted }}>Same-day</span>
            </a>
          </div>
          <div className="wc-hero-trust" style={{ color: K.inkSoft }}>
            <Stars color={K.gold} size={14} />
            <span><b style={{ color: K.ink }}>4.9</b> · 312 reviews from south Calgary</span>
          </div>
        </div>
        <div className="wc-hero-photo">
          <PhotoSlot
            label={isDesktop ? 'hero · reception nook with fireplace' : 'reception · fireplace'}
            ratio={isDesktop ? '4/5' : '5/4'}
            tone="warm"
            round={isDesktop ? 24 : 20}
          />
        </div>
      </div>
    </section>
  );
}

// ── Trust strip ───────────────────────────────────────────────────────────
function WCTrustStrip() {
  return (
    <section className="wc-trust" style={{ background: K.bg }}>
      <div className="wc-container">
        <div className="wc-trust-grid" style={{ background: K.surface, border: `1px solid ${K.line}` }}>
          {TRUST_BADGES.map((b) => (
            <div key={b.t} className="wc-trust-item" style={{ borderColor: K.line }}>
              <div className="wc-trust-icon" style={{ background: K.accentSoft, color: K.accent }}>
                {I.check(K.accent)}
              </div>
              <div>
                <div className="wc-trust-title" style={{ color: K.ink }}>{b.t}</div>
                <div className="wc-trust-sub" style={{ color: K.muted }}>{b.s}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ── Emergency band ────────────────────────────────────────────────────────
function WCEmergency() {
  return (
    <section className="wc-emerg" style={{ background: K.bg }}>
      <div className="wc-container">
        <div className="wc-emerg-card" style={{ background: K.deep, color: '#fff' }}>
          <div className="wc-emerg-glow" style={{ background: K.accentGlow }} />
          <div className="wc-emerg-content">
            <div className="wc-kicker" style={{ color: K.accent }}>Same-day promise</div>
            <h2 style={{ fontFamily: HF, color: '#fff', fontWeight: HW, letterSpacing: '-0.005em' }}>
              Pain today? We&rsquo;ll see you today.
            </h2>
            <p style={{ color: 'rgba(255,255,255,0.75)' }}>
              We hold emergency slots open every single day. Call before 4pm and we guarantee an appointment before close.
            </p>
            <a
              href="tel:+15875550142"
              className="wc-btn wc-btn-accent"
              style={{ background: K.accent, color: K.onAccent }}
            >
              {I.phone(K.onAccent)} Call (587) 555-0142
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}

// ── Comfort menu ──────────────────────────────────────────────────────────
function WCComfort() {
  return (
    <section className="wc-comfort" id="why" style={{ background: K.bg }}>
      <div className="wc-container">
        <div className="wc-section-head">
          <div className="wc-kicker" style={{ color: K.accent }}>Why patients stay</div>
          <h2 style={{ fontFamily: HF, color: K.ink, fontWeight: HW, letterSpacing: HLS }}>
            Comfort isn&rsquo;t an upgrade. It&rsquo;s the floor.
          </h2>
          <p style={{ color: K.inkSoft }}>Everything below is included on every visit, no questions asked.</p>
        </div>
        <div className="wc-comfort-grid">
          {COMFORT.map((c, i) => (
            <div key={c.t} className="wc-comfort-card" style={{ background: K.surface, border: `1px solid ${K.line}` }}>
              <div className="wc-comfort-num" style={{ color: K.muted }}>0{i + 1}</div>
              <div className="wc-comfort-title" style={{ color: K.ink, fontFamily: HF, fontWeight: HW }}>{c.t}</div>
              <div className="wc-comfort-sub" style={{ color: K.muted }}>{c.s}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ── Services ──────────────────────────────────────────────────────────────
function WCServices() {
  const [expanded, setExpanded] = useState<number | null>(null);
  return (
    <section className="wc-services" id="services" style={{ background: K.bg2 }}>
      <div className="wc-container">
        <div className="wc-section-head">
          <div className="wc-kicker" style={{ color: K.accent }}>Care, three ways</div>
          <h2 style={{ fontFamily: HF, color: K.ink, fontWeight: HW, letterSpacing: HLS }}>
            Whatever brought you in, there&rsquo;s a path.
          </h2>
        </div>
        <div className="wc-services-grid">
          {SERVICES.map((s, i) => {
            const open = expanded === i;
            return (
              <div
                key={s.title}
                className="wc-service-card"
                style={{
                  background: K.surface, border: `1px solid ${K.line}`,
                  boxShadow: open ? '0 14px 36px rgba(0,0,0,0.10)' : 'none',
                }}
              >
                <div className="wc-service-head" onClick={() => setExpanded(open ? null : i)}>
                  <div className="wc-service-row">
                    <span className="wc-service-cat" style={{ color: K.accent }}>{s.cat}</span>
                    <span className="wc-service-tag" style={{ color: K.muted }}>{s.tag}</span>
                  </div>
                  <div className="wc-service-title" style={{ color: K.ink, fontFamily: HF, fontWeight: HW }}>
                    {s.title}
                  </div>
                  <div className="wc-service-toggle" style={{ color: K.ink }}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"
                         style={{ transform: open ? 'rotate(45deg)' : 'rotate(0)', transition: 'transform .25s cubic-bezier(.4,0,.2,1)' }}>
                      <path d="M12 5v14M5 12h14" />
                    </svg>
                  </div>
                </div>
                <div className="wc-service-body" style={{ maxHeight: open ? 360 : 0 }}>
                  <ul style={{ borderTop: `1px solid ${K.line}` }}>
                    {s.items.map((it) => (
                      <li key={it} style={{ color: K.inkSoft }}>
                        <span style={{ background: K.accent }} />
                        {it}
                      </li>
                    ))}
                  </ul>
                  <a href="#book" className="wc-service-cta" style={{ color: K.ink, borderColor: K.ink }}>
                    Learn more {I.arrow(K.ink)}
                  </a>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

// ── About ─────────────────────────────────────────────────────────────────
function WCAbout() {
  return (
    <section className="wc-about" id="about" style={{ background: K.bg }}>
      <div className="wc-container">
        <div className="wc-about-grid">
          <div className="wc-about-photo">
            <PhotoSlot label="dr. sarah · candid · natural light" ratio="4/5" tone="sage" round={20} />
          </div>
          <div className="wc-about-text">
            <div className="wc-kicker" style={{ color: K.accent }}>About Dr. Sarah</div>
            <h2 style={{ fontFamily: HF, color: K.ink, fontWeight: HW, letterSpacing: HLS }}>
              I started this clinic because I wanted to slow things down.
            </h2>
            <p style={{ color: K.inkSoft }}>
              After eight years in high-volume corporate clinics, I opened Prairie Oak so I could spend the time each patient actually needs.
            </p>
            <p style={{ color: K.inkSoft }}>
              We&rsquo;re a small, locally-owned team. We won&rsquo;t hand you a printed treatment plan until we&rsquo;ve walked through every line of it with you.
            </p>
            <div className="wc-about-card" style={{ background: K.surface2 }}>
              <div style={{ fontFamily: 'var(--font-display)', fontWeight: 600, fontSize: 14, color: K.ink }}>
                Dr. Sarah Al-Hussaini
              </div>
              <div style={{ color: K.muted, marginTop: 4, fontSize: 13 }}>
                DDS, University of Alberta · ADAC member
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// ── Reviews ───────────────────────────────────────────────────────────────
function WCReviews() {
  return (
    <section className="wc-reviews" id="reviews" style={{ background: K.bg }}>
      <div className="wc-container">
        <div
          className="wc-section-head"
          style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', flexWrap: 'wrap', gap: 16 }}
        >
          <div>
            <div className="wc-kicker" style={{ color: K.accent }}>What patients say</div>
            <h2 style={{ fontFamily: HF, color: K.ink, margin: 0, fontWeight: HW, letterSpacing: HLS }}>
              312 Google reviews. Here are a few.
            </h2>
          </div>
          <a href="#" className="wc-link" style={{ color: K.ink }}>
            Read all reviews {I.arrow(K.ink)}
          </a>
        </div>
        <div className="wc-reviews-grid">
          {REVIEWS.map((r) => (
            <div key={r.name} className="wc-review-card" style={{ background: K.surface, border: `1px solid ${K.line}` }}>
              <Stars color={K.gold} size={12} />
              <p style={{ fontFamily: HF, color: K.ink, fontWeight: 500, letterSpacing: '-0.005em' }}>
                &ldquo;{r.quote}&rdquo;
              </p>
              <div className="wc-review-meta">
                <div className="wc-review-avatar" style={{ background: K.accentSoft, color: K.accent }}>
                  {r.name.split(' ').map((s) => s[0]).join('')}
                </div>
                <div>
                  <div style={{ fontFamily: 'var(--font-display)', fontWeight: 600, fontSize: 13, color: K.ink }}>{r.name}</div>
                  <div style={{ fontSize: 12, color: K.muted }}>{r.sub}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ── FAQ ───────────────────────────────────────────────────────────────────
function WCFaq() {
  const [open, setOpen] = useState(0);
  return (
    <section className="wc-faq" id="faq" style={{ background: K.bg2 }}>
      <div className="wc-container">
        <div className="wc-faq-grid">
          <div className="wc-faq-head">
            <div className="wc-kicker" style={{ color: K.accent }}>Common questions</div>
            <h2 style={{ fontFamily: HF, color: K.ink, fontWeight: HW, letterSpacing: HLS }}>
              The things people usually ask, up front.
            </h2>
            <p style={{ color: K.inkSoft }}>
              If yours isn&rsquo;t here, our front desk replies to texts within an hour during the day.
            </p>
            <a href="sms:+15875550142" className="wc-link wc-link-strong" style={{ color: K.ink }}>
              Text us a question {I.arrow(K.ink)}
            </a>
          </div>
          <div className="wc-faq-list">
            {FAQS.map((f, i) => {
              const isOpen = open === i;
              return (
                <div
                  key={f.q}
                  style={{
                    borderTop: `1px solid ${K.line}`,
                    borderBottom: i === FAQS.length - 1 ? `1px solid ${K.line}` : 'none',
                  }}
                >
                  <button className="wc-faq-q" onClick={() => setOpen(isOpen ? -1 : i)} style={{ color: K.ink }}>
                    <span style={{ fontFamily: HF, fontWeight: HW }}>{f.q}</span>
                    <span className="wc-faq-toggle" style={{ color: K.muted }}>
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"
                           style={{ transform: isOpen ? 'rotate(45deg)' : 'rotate(0)', transition: 'transform .25s cubic-bezier(.4,0,.2,1)' }}>
                        <path d="M12 5v14M5 12h14" />
                      </svg>
                    </span>
                  </button>
                  <div className="wc-faq-a" style={{ maxHeight: isOpen ? 240 : 0 }}>
                    <p style={{ color: K.inkSoft }}>{f.a}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}

// ── Insurance ─────────────────────────────────────────────────────────────
function WCInsurance() {
  return (
    <section className="wc-insurance" id="insurance" style={{ background: K.bg }}>
      <div className="wc-container">
        <div className="wc-section-head">
          <div className="wc-kicker" style={{ color: K.accent }}>We bill them directly</div>
          <h2 style={{ fontFamily: HF, color: K.ink, fontWeight: HW, letterSpacing: HLS }}>
            Your wallet stays in your bag.
          </h2>
          <p style={{ color: K.inkSoft }}>
            We submit to all major providers. You only pay your co-pay on the day of treatment.
          </p>
        </div>
        <div className="wc-insurer-list">
          {INSURERS.map((n) => (
            <span
              key={n}
              className="wc-insurer-pill"
              style={{ background: K.surface, border: `1px solid ${K.line}`, color: K.inkSoft }}
            >
              {n}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}

// ── Final CTA ─────────────────────────────────────────────────────────────
function WCFinalCta() {
  return (
    <section className="wc-finalcta" id="book" style={{ background: K.deep, color: '#fff' }}>
      <div className="wc-container">
        <div className="wc-finalcta-inner">
          <div className="wc-kicker" style={{ color: K.accent }}>Ready when you are</div>
          <h2 style={{ fontFamily: HF, color: '#fff', fontWeight: HW, letterSpacing: HLS }}>
            Find a time that works for you.
          </h2>
          <p style={{ color: 'rgba(255,255,255,0.7)' }}>
            Most new patients are seen within the same week. Intake takes about 4 minutes.
          </p>
          <div className="wc-finalcta-buttons">
            <a
              href="#"
              className="wc-btn wc-btn-accent wc-btn-lg"
              style={{ background: K.accent, color: K.onAccent, boxShadow: `0 12px 36px ${K.accentGlow}` }}
            >
              {CTA} {I.arrow(K.onAccent)}
            </a>
            <a
              href="tel:+15875550142"
              className="wc-btn wc-btn-ghost wc-btn-lg"
              style={{ border: '1px solid rgba(255,255,255,0.25)', background: 'transparent', color: '#fff' }}
            >
              {I.phone('#fff')} (587) 555-0142
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}

// ── Location ──────────────────────────────────────────────────────────────
function WCLocation() {
  return (
    <section className="wc-locate" id="visit" style={{ background: K.bg }}>
      <div className="wc-container">
        <div className="wc-locate-grid">
          <div>
            <div className="wc-kicker" style={{ color: K.accent }}>Visit us</div>
            <h2 style={{ fontFamily: HF, color: K.ink, fontWeight: HW, letterSpacing: HLS }}>
              South Calgary, by the ridge.
            </h2>
            <div className="wc-locate-info">
              <div className="wc-locate-row">
                <div style={{ color: K.accent }}>{I.pin(K.accent)}</div>
                <div>
                  <div style={{ fontFamily: 'var(--font-display)', fontWeight: 600, fontSize: 15, color: K.ink }}>
                    14025 Macleod Trail SE
                  </div>
                  <div style={{ color: K.muted, fontSize: 13, marginTop: 2 }}>
                    Calgary, AB T2Y 0G6 · Free on-site parking
                  </div>
                </div>
              </div>
              <div className="wc-locate-row">
                <div style={{ color: K.accent }}>{I.clock(K.accent)}</div>
                <div className="wc-hours">
                  {HOURS.map(([d, h]) => (
                    <Fragment key={d}>
                      <div style={{ color: K.inkSoft }}>{d}</div>
                      <div style={{ color: K.muted }}>{h}</div>
                    </Fragment>
                  ))}
                </div>
              </div>
            </div>
          </div>
          <div>
            <PhotoSlot label="map · 14025 Macleod Trail SE" ratio="4/3" tone="sage" round={16} />
          </div>
        </div>
      </div>
    </section>
  );
}

// ── Footer ────────────────────────────────────────────────────────────────
function WCFooter() {
  return (
    <footer className="wc-footer" style={{ background: K.surface2, borderTop: `1px solid ${K.line}` }}>
      <div className="wc-container">
        <div className="wc-footer-grid">
          <div>
            <POLogo color={K.ink} />
            <p style={{ color: K.muted, marginTop: 14, fontSize: 13, lineHeight: 1.6, maxWidth: 320 }}>
              Prairie Oak Dental Studio is a locally-owned practice in south Calgary. We follow the Alberta Dental Fee Guide.
            </p>
          </div>
          <div className="wc-footer-col">
            <div className="wc-footer-h" style={{ color: K.muted }}>Visit</div>
            <a href="#services" style={{ color: K.ink }}>Services</a>
            <a href="#about" style={{ color: K.ink }}>About us</a>
            <a href="#reviews" style={{ color: K.ink }}>Reviews</a>
            <a href="#faq" style={{ color: K.ink }}>FAQ</a>
          </div>
          <div className="wc-footer-col">
            <div className="wc-footer-h" style={{ color: K.muted }}>Contact</div>
            <a href="tel:+15875550142" style={{ color: K.ink }}>(587) 555-0142</a>
            <a href="mailto:hello@prairieoak.ca" style={{ color: K.ink }}>hello@prairieoak.ca</a>
            <a href="#visit" style={{ color: K.ink }}>14025 Macleod Trail SE</a>
          </div>
          <div className="wc-footer-col">
            <div className="wc-footer-h" style={{ color: K.muted }}>Legal</div>
            <a href="#" style={{ color: K.ink }}>Privacy</a>
            <a href="#" style={{ color: K.ink }}>Accessibility</a>
            <a href="#" style={{ color: K.ink }}>Careers</a>
          </div>
        </div>
        <div className="wc-footer-bottom" style={{ borderTop: `1px solid ${K.line}`, color: K.muted }}>
          <span>© 2025 Prairie Oak Dental Studio</span>
          <span>Following the Alberta Dental Fee Guide</span>
        </div>
      </div>
    </footer>
  );
}

// ── Sticky mobile emergency bar ───────────────────────────────────────────
function StickyEmergencyBar({ vp, visible }: { vp: Viewport; visible: boolean }) {
  if (vp !== 'mobile') return null;
  return (
    <div
      className="wc-sticky-bar"
      data-visible={visible ? '1' : '0'}
      style={{ background: K.deep, color: '#fff' }}
    >
      <div className="wc-sticky-bar-inner">
        <a href="tel:+15875550142" className="wc-sticky-bar-link">
          <div className="wc-sticky-bar-icon" style={{ background: K.accent }}>
            {I.phone('#fff')}
          </div>
          <div>
            <div className="wc-sticky-bar-title">Emergency? Call now</div>
            <div className="wc-sticky-bar-sub">Same-day appointment guaranteed</div>
          </div>
        </a>
        <a href="#book" className="wc-btn wc-btn-accent" style={{ background: K.accent, color: K.onAccent }}>
          Book
        </a>
      </div>
    </div>
  );
}

// ── Page ──────────────────────────────────────────────────────────────────
export default function WarmClinical() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [stickyVisible, setStickyVisible] = useState(false);
  const scrolled = useScrolled(40);
  const vp = useViewport();

  useEffect(() => {
    const on = () => setStickyVisible(window.scrollY > window.innerHeight * 0.6);
    on();
    window.addEventListener('scroll', on, { passive: true });
    return () => window.removeEventListener('scroll', on);
  }, []);

  return (
    <div style={{ background: K.bg, color: K.ink }}>
      <WCHeader
        scrolled={scrolled}
        onMenu={() => setMobileOpen((o) => !o)}
        mobileOpen={mobileOpen}
        vp={vp}
      />
      <MobileMenu open={mobileOpen && vp === 'mobile'} onClose={() => setMobileOpen(false)} />
      <main>
        <WCHero vp={vp} />
        <WCTrustStrip />
        <WCEmergency />
        <WCComfort />
        <WCServices />
        <WCAbout />
        <WCReviews />
        <WCFaq />
        <WCInsurance />
        <WCFinalCta />
        <WCLocation />
      </main>
      <WCFooter />
      <StickyEmergencyBar vp={vp} visible={stickyVisible} />
    </div>
  );
}
