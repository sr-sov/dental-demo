import { Section, SectionHeader, Button, TextLink, IconBadge, Card } from '@/components/ui';
import { DisclosureDemo } from './DisclosureDemo';

export const metadata = {
  title: 'Primitives Styleguide',
  robots: { index: false, follow: false },
};

const placeholderIcon = (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10" />
    <path d="M12 16v-4" />
    <path d="M12 8h.01" />
  </svg>
);

export default function Styleguide() {
  return (
    <>
      <SectionHeader as="h1" eyebrow="UI Primitives" className="px-6 pt-14 lg:pt-20 lg:px-8 mx-auto max-w-7xl">
        Shared UI Primitives v2
      </SectionHeader>

      <Section id="section-demo">
        <SectionHeader eyebrow="Section" lede="Three variants × three sizes — the wrapper primitive.">
          Section variants
        </SectionHeader>

        <div className="space-y-2 mt-6 text-xs text-foreground-muted font-mono">
          <p>variant=&quot;default&quot; size=&quot;default&quot; (current)</p>
        </div>
      </Section>

      <Section variant="alt" id="section-alt">
        <SectionHeader eyebrow="Section" as="h3" lede="Uses variant=&quot;alt&quot; — the alternating background.">
          Section alt
        </SectionHeader>
        <div className="space-y-2 mt-6 text-xs text-foreground-muted font-mono">
          <p className="font-semibold">size=&quot;compact&quot;</p>
          <Section size="compact" className="border border-dashed border-line rounded-lg">
            <p className="text-xs">Compact size — py-10 lg:py-16</p>
          </Section>
          <p className="font-semibold mt-4">size=&quot;tight&quot;</p>
          <Section size="tight" className="border border-dashed border-line rounded-lg">
            <p className="text-xs">Tight size — py-8 lg:py-12</p>
          </Section>
        </div>
      </Section>

      <Section variant="emphasis" id="section-emphasis">
        <SectionHeader eyebrow="Section" as="h3" lede="variant=&quot;emphasis&quot; — dark background for CTAs.">
          Section emphasis
        </SectionHeader>
      </Section>

      <Section id="button-demo" variant="alt">
        <SectionHeader eyebrow="Button" lede="Primary, secondary, ghost — sm, md, lg.">
          Button
        </SectionHeader>
        <div className="space-y-6 mt-6">
          <div className="flex flex-wrap gap-3 items-center">
            <Button variant="primary" size="sm">Primary sm</Button>
            <Button variant="primary" size="md">Primary md</Button>
            <Button variant="primary" size="lg">Primary lg</Button>
          </div>
          <div className="flex flex-wrap gap-3 items-center">
            <Button variant="secondary" size="sm">Secondary sm</Button>
            <Button variant="secondary" size="md">Secondary md</Button>
            <Button variant="secondary" size="lg">Secondary lg</Button>
          </div>
          <div className="flex flex-wrap gap-3 items-center">
            <Button variant="ghost" size="sm">Ghost sm</Button>
            <Button variant="ghost" size="md">Ghost md</Button>
            <Button variant="ghost" size="lg">Ghost lg</Button>
          </div>
          <div className="flex flex-wrap gap-3 items-center">
            <Button href="#button-demo">Link button</Button>
            <Button disabled>Disabled</Button>
          </div>
        </div>
      </Section>

      <Section id="textlink-demo">
        <SectionHeader eyebrow="TextLink" lede="Underlined link with arrow animation on hover.">
          TextLink
        </SectionHeader>
        <div className="flex flex-wrap gap-6 mt-6">
          <TextLink href="#textlink-demo">Internal link</TextLink>
          <TextLink href="https://example.com" external>External link</TextLink>
        </div>
      </Section>

      <Section id="iconbadge-demo" variant="alt">
        <SectionHeader eyebrow="IconBadge" lede="Circle with icon — soft, solid, subtle tones.">
          IconBadge
        </SectionHeader>
        <div className="flex flex-wrap gap-4 items-center mt-6">
          <IconBadge size="sm" tone="soft">{placeholderIcon}</IconBadge>
          <IconBadge size="md" tone="soft">{placeholderIcon}</IconBadge>
          <IconBadge size="lg" tone="soft">{placeholderIcon}</IconBadge>
          <IconBadge size="md" tone="solid">{placeholderIcon}</IconBadge>
          <IconBadge size="md" tone="subtle">{placeholderIcon}</IconBadge>
        </div>
      </Section>

      <Section id="card-demo">
        <SectionHeader eyebrow="Card" lede="Default, elevated, inset, emphasis — with interactive mode.">
          Card
        </SectionHeader>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-6">
          <Card variant="default">
            <p className="text-xs font-semibold text-foreground">Default</p>
            <p className="text-xs text-foreground-muted mt-1">Standard card with border + shadow-sm</p>
          </Card>
          <Card variant="elevated">
            <p className="text-xs font-semibold text-foreground">Elevated</p>
            <p className="text-xs text-foreground-muted mt-1">Shadow-xl for prominence</p>
          </Card>
          <Card variant="inset">
            <p className="text-xs font-semibold text-foreground">Inset</p>
            <p className="text-xs text-foreground-muted mt-1">Alt background, blends in</p>
          </Card>
          <Card variant="emphasis">
            <p className="text-xs font-semibold">Emphasis</p>
            <p className="text-xs text-white/75 mt-1">Dark background for CTA bands</p>
          </Card>
        </div>
        <div className="mt-4">
          <Card variant="default" interactive padding="sm">
            <p className="text-xs font-semibold text-foreground">Interactive — hover lifts</p>
            <p className="text-xs text-foreground-muted mt-1">Hover over this card</p>
          </Card>
        </div>
      </Section>

      <Section id="disclosure-demo" variant="alt">
        <SectionHeader eyebrow="Disclosure" lede="Controlled accordion item. Parent owns open state via useState.">
          Disclosure
        </SectionHeader>
        <div className="mt-6">
          <DisclosureDemo />
        </div>
      </Section>
    </>
  );
}
