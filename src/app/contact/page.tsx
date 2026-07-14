import type { Metadata } from 'next';
import { ContactForm } from '@/components/contact-form';
import { PageHeader } from '@/components/page-header';
import { siteConfig } from '@/config/site.config';

export const metadata: Metadata = {
  title: 'Contact',
  description: `Write to ${siteConfig.name} about a reading, a booking, or a question you are not sure fits a session. Every message gets a reply.`,
  alternates: { canonical: '/contact' },
};

export default function ContactPage() {
  return (
    <div className="divide-y divide-border/60">
      <PageHeader
        eyebrow="Contact"
        title="Tell me what you are sitting with"
        lead="If you are not sure which session fits, describe the situation in a few lines. I will tell you which one to book, or whether a reading is the wrong tool for it."
      />

      <section className="grid gap-12 py-16 sm:py-24 md:grid-cols-[1.5fr_1fr] md:gap-16">
        <ContactForm />

        <aside className="space-y-8 text-sm text-muted-foreground">
          {siteConfig.email ? (
            <div>
              <p className="eyebrow text-foreground">Email</p>
              <a href={`mailto:${siteConfig.email}`} className="mt-3 block underline underline-offset-4">
                {siteConfig.email}
              </a>
            </div>
          ) : null}

          {siteConfig.location ? (
            <div>
              <p className="eyebrow text-foreground">Based in</p>
              <p className="mt-3">{siteConfig.location}</p>
              <p className="mt-1">Sessions run on video, wherever you are.</p>
            </div>
          ) : null}

          {siteConfig.socials.length > 0 ? (
            <div>
              <p className="eyebrow text-foreground">Elsewhere</p>
              <ul className="mt-3 space-y-2">
                {siteConfig.socials.map((social) => (
                  <li key={social.href}>
                    <a
                      href={social.href}
                      rel="me noopener noreferrer"
                      target="_blank"
                      className="underline underline-offset-4"
                    >
                      {social.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ) : null}

          <p className="border-t border-border pt-8">
            Messages go straight to the inbox above. Nothing you write here is stored on the site.
          </p>
        </aside>
      </section>
    </div>
  );
}
