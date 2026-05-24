import Link from 'next/link';
import type { ReactNode } from 'react';
import {
  FloatingBackground,
  InkCard,
  Icon,
  HandDrawnUnderline,
  MarginDoodle,
  IllustrationCup,
  IllustrationLeaves,
  IllustrationPlant,
} from '@/src/components/ui';
import FeatureMoodPicker from './_components/FeatureMoodPicker';
import HeroText from './_components/HeroText';
import HeroVisual from './_components/HeroVisual';
import FinalCTA from './_components/FinalCTA';
import GetsToKnowYou from './_components/GetsToKnowYou';
import HowItWorks from './_components/HowItWorks';
import HumanQuote from './_components/HumanQuote';
import JournalMoment from './_components/JournalMoment';
import LandingFooter from './_components/LandingFooter';
import LandingNav from './_components/LandingNav';

// ─── Belief card ──────────────────────────────────────────────────────────────

interface BeliefCardProps {
  illo: ReactNode;
  title: string;
  body: string;
  tilt?: number;
}

function BeliefCard({ illo, title, body, tilt = 0 }: BeliefCardProps) {
  return (
    <InkCard hand handIntensity={2.2} tilt={tilt} hoverable style={{ padding: 26, minHeight: 220 }}>
      <div style={{ marginBottom: 14 }}>{illo}</div>
      <h3 className="serif" style={{ fontSize: 22, fontWeight: 500, marginBottom: 8, lineHeight: 1.2 }}>
        {title}
      </h3>
      <p style={{ color: 'var(--ink-soft)', fontSize: 15, lineHeight: 1.55 }}>{body}</p>
    </InkCard>
  );
}

// ─── Feature row ──────────────────────────────────────────────────────────────

interface FeatureRowProps {
  eyebrow: string;
  title: string;
  body: string;
  visual: ReactNode;
  reverse?: boolean;
  tilt?: number;
}

function FeatureRow({ eyebrow, title, body, visual, reverse = false, tilt = 0 }: FeatureRowProps) {
  return (
    <div style={{
      display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 48, alignItems: 'center',
      padding: '40px 0',
      direction: reverse ? 'rtl' : 'ltr',
    }}>
      <div style={{ direction: 'ltr' }}>
        <div className="eyebrow" style={{ marginBottom: 10 }}>{eyebrow}</div>
        <h2 className="serif" style={{ fontSize: 34, fontWeight: 500, lineHeight: 1.12, marginBottom: 14, letterSpacing: '-0.01em' }}>
          {title}
        </h2>
        <p style={{ color: 'var(--ink-soft)', fontSize: 16, lineHeight: 1.6, maxWidth: 460 }}>{body}</p>
      </div>
      <div style={{ direction: 'ltr', position: 'relative' }}>
        <div style={{ transform: `rotate(${tilt}deg)`, transition: 'transform 360ms cubic-bezier(.34,1.3,.64,1)' }}>
          {visual}
        </div>
      </div>
    </div>
  );
}

// ─── Never item ───────────────────────────────────────────────────────────────

function Never({ text }: { text: string }) {
  return (
    <li style={{ display: 'flex', alignItems: 'flex-start', gap: 12 }}>
      <svg
        width="20" height="20" viewBox="0 0 24 24"
        fill="none" stroke="var(--accent)" strokeWidth={1.7} strokeLinecap="round"
        style={{ flex: '0 0 auto', marginTop: 2 }}
      >
        <circle cx="12" cy="12" r="9" />
        <path d="M6 17 18 7" />
      </svg>
      <span style={{ fontSize: 16, color: 'var(--ink)' }}>{text}</span>
    </li>
  );
}


// ─── Feature journal ──────────────────────────────────────────────────────────

function FeatureJournal() {
  return (
    <InkCard hand handIntensity={2.2} className="paper-bg" style={{ padding: '28px 32px 28px 56px', position: 'relative', minHeight: 220 }}>
      <div style={{ position: 'absolute', left: 36, top: 0, bottom: 0, width: 1, background: 'color-mix(in oklab, var(--accent) 35%, transparent)', opacity: 0.45 }} />
      <div style={{ position: 'absolute', left: 14, top: 30, color: 'var(--accent)', opacity: 0.7 }}>
        <MarginDoodle kind="star" />
      </div>
      <div style={{ position: 'absolute', left: 14, bottom: 28, color: 'var(--accent)', opacity: 0.7 }}>
        <MarginDoodle kind="heart" />
      </div>
      <div className="hand" style={{ fontSize: 22, color: 'var(--ink)', lineHeight: 1.4, transform: 'rotate(-0.6deg)' }}>
        Friday, May 23
      </div>
      <div className="hand" style={{ fontSize: 21, color: 'var(--ink)', lineHeight: 1.5, marginTop: 12 }}>
        Sat outside with coffee for fifteen minutes before opening anything. The morning felt like it was holding still on purpose. I think I needed that.
      </div>
    </InkCard>
  );
}

// ─── Feature wellness ─────────────────────────────────────────────────────────

function FeatureWellness() {
  return (
    <InkCard hand handIntensity={2.2} style={{ padding: 28, position: 'relative', minHeight: 220 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 18 }}>
        <div style={{ flex: '0 0 auto' }}>
          <svg width="120" height="120" viewBox="0 0 120 120">
            <circle cx="60" cy="60" r="44" fill="none" stroke="var(--ink-border)" strokeWidth="20" />
            <path d="M 60 16 A 44 44 0 0 1 96 80" stroke="var(--accent)" strokeWidth="20" fill="none" strokeLinecap="round" opacity="0.7" />
            <text x="60" y="58" textAnchor="middle" fontFamily="Fraunces" fontStyle="italic" fontSize="16" fill="var(--ink)">luteal</text>
            <text x="60" y="74" textAnchor="middle" fontFamily="DM Sans" fontSize="9" fill="var(--ink-muted)" letterSpacing="2">phase</text>
          </svg>
        </div>
        <div>
          <div className="eyebrow" style={{ marginBottom: 6 }}>Days 17 – 28</div>
          <div className="serif" style={{ fontSize: 22, fontWeight: 500, marginBottom: 4 }}>Tending</div>
          <p style={{ fontSize: 14, color: 'var(--ink-soft)', lineHeight: 1.5, maxWidth: 220 }}>
            Inward, careful, sometimes prickly. Shorter to-do lists are kindness here.
          </p>
        </div>
      </div>
    </InkCard>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function Page() {
  return (
    <div style={{ position: 'relative', minHeight: '100vh', background: 'var(--bg)', color: 'var(--ink)' }}>
      <LandingNav />
      <FloatingBackground density="minimal" />

      {/* ─── Hero ──────────────────────────────────────────── */}
      <section style={{ padding: '40px 40px 80px', maxWidth: 1180, margin: '0 auto', position: 'relative' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1.1fr 1fr', gap: 56, alignItems: 'center' }}>
          <div>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, marginBottom: 20 }}>
              <span style={{
                display: 'inline-block', width: 8, height: 8,
                background: 'var(--accent)', borderRadius: '60% 50% 55% 65%',
              }} />
              <span className="eyebrow">A quiet companion</span>
            </div>

            <HeroText />

            <div style={{ display: 'flex', gap: 12, alignItems: 'center', flexWrap: 'wrap' }}>
              <Link href="/app" className="ink-btn ink-btn--primary">
                Begin a quiet practice
                <Icon.ChevronRight size={14} />
              </Link>
              <Link href="/app" className="ink-btn ink-btn--ghost">
                See the app
              </Link>
              <span className="hand" style={{ fontSize: 17, color: 'var(--ink-muted)', marginLeft: 6 }}>
                free · no streaks · no shame
              </span>
            </div>
          </div>

          <HeroVisual />
        </div>
      </section>

      <HowItWorks />

      <GetsToKnowYou />

      <JournalMoment />

      <HumanQuote />

      {/* ─── Belief strip ──────────────────────────────────── */}
      <section style={{ padding: '0 40px 72px', maxWidth: 1080, margin: '0 auto' }}>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 14, marginBottom: 22 }}>
          <h2 className="serif italic" style={{ fontSize: 30, fontWeight: 400 }}>
            What Solace believes
          </h2>
          <HandDrawnUnderline width={120} />
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 20 }}>
          <BeliefCard
            tilt={-0.9}
            illo={<IllustrationCup size={56} />}
            title="Soft is not slow"
            body="Rest is not the opposite of progress. A few minutes of honesty with yourself counts."
          />
          <BeliefCard
            tilt={0.7}
            illo={<IllustrationLeaves size={56} />}
            title="Patterns, not pressure"
            body="We surface gentle observations — sleep, mood, sunlight — never numbers to chase."
          />
          <BeliefCard
            tilt={-0.5}
            illo={<IllustrationPlant size={56} />}
            title="Yours alone"
            body="Your journal is encrypted on your device. We literally cannot read it, and we don't want to."
          />
        </div>
      </section>

      {/* ─── Feature walk-through ──────────────────────────── */}
      <section style={{ padding: '0 40px 72px', maxWidth: 1180, margin: '0 auto' }}>
        <FeatureRow
          eyebrow="Daily check-in"
          title="A tiny moment, once a day, if you want to."
          body="Six faces. A few sticky-note symptoms. Three sliders for water, sleep, sunlight. Done in under a minute — or skipped without guilt."
          visual={<FeatureMoodPicker />}
          tilt={-0.6}
        />
        <FeatureRow
          eyebrow="Your journal"
          title="A notebook that feels like one."
          body="Cream paper, faint rules, margin doodles. Edits leave a soft ink scribble. Deletes tear like a page. Encrypted end-to-end."
          visual={<FeatureJournal />}
          reverse
          tilt={0.5}
        />
        <FeatureRow
          eyebrow="Your rhythm"
          title="A friend who's done this before."
          body="Plain-language guidance through the menstrual, follicular, ovulatory, and luteal phases. Foods, energy, kindness — no clinical diagrams."
          visual={<FeatureWellness />}
          tilt={-0.4}
        />
      </section>

      {/* ─── Quote ─────────────────────────────────────────── */}
      <section style={{ padding: '0 40px 72px', maxWidth: 880, margin: '0 auto', textAlign: 'center' }}>
        <InkCard hand handIntensity={2.4} style={{ padding: '48px 56px', background: 'color-mix(in oklab, var(--accent-wash) 60%, var(--surface))' }}>
          <div style={{ fontSize: 48, lineHeight: 0.6, color: 'var(--accent)', marginBottom: 8 }} className="serif italic">&quot;</div>
          <p className="serif italic" style={{ fontSize: 26, lineHeight: 1.35, fontWeight: 400, color: 'var(--ink)', marginBottom: 18 }}>
            For the first time, a wellness app that doesn&apos;t feel like a coach
            shouting from across the room.
          </p>
          <div className="hand" style={{ fontSize: 20, color: 'var(--ink-muted)' }}>
            — early reader, somewhere quiet
          </div>
        </InkCard>
      </section>

      {/* ─── Privacy ───────────────────────────────────────── */}
      <section style={{ padding: '0 40px 72px', maxWidth: 1080, margin: '0 auto' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.2fr', gap: 36, alignItems: 'center' }}>
          <InkCard hand handIntensity={2.2} variant="paper" style={{ padding: 36 }}>
            <Icon.Lock size={22} />
            <div className="eyebrow" style={{ marginTop: 12, marginBottom: 6 }}>A small promise</div>
            <h3 className="serif" style={{ fontSize: 26, fontWeight: 500, lineHeight: 1.15, marginBottom: 12 }}>
              Your words are yours.
            </h3>
            <p style={{ color: 'var(--ink-soft)', fontSize: 15, lineHeight: 1.6 }}>
              Journal entries are encrypted on your device. Patterns surface
              locally. There&apos;s no growth team poking at your sleep data, no
              dashboard for someone else to share, no AI summarizing your
              feelings back at you.
            </p>
          </InkCard>
          <div>
            <h3 className="serif italic" style={{ fontSize: 32, fontWeight: 400, marginBottom: 18, lineHeight: 1.15 }}>
              The things we will never do.
            </h3>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 14 }}>
              <Never text="Sell or share your data with advertisers." />
              <Never text="Send streak-shaming notifications." />
              <Never text="Make your wellbeing about productivity." />
              <Never text="Make you feel bad for skipping a day." />
            </ul>
          </div>
        </div>
      </section>

      <FinalCTA />

      <LandingFooter />
    </div>
  );
}
