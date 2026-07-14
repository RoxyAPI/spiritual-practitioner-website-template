# Integrations (booking, contact, payments)

Everything here is a free-tier third-party service wired through `site.config.ts` ([config.md](./config.md)). No backend, no template-side accounts. Caps below were checked July 2026; always confirm on the linked pricing pages before advising a fork.

## Booking (`/book`)

`config.booking.provider` picks the embed; `config.booking.url` is the practitioner public scheduling link. Session prices and payment links stay on the Services page; the booking page only schedules.

### Cal.com (default, `provider: 'calcom'`)

Free individual plan: unlimited event types and bookings, embeds included, Stripe/PayPal booking payments available. A small "Powered by Cal.com" mark shows on free accounts. Pricing: https://cal.com/pricing

Embed via the official `@calcom/embed-react` package inside a `'use client'` component:

```tsx
'use client';
import Cal from '@calcom/embed-react';

export function BookingEmbed({ calLink }: { calLink: string }) {
  return <Cal calLink={calLink} style={{ width: '100%', height: '100%' }} />;
}
```

`calLink` is the `username/event-type` part of the Cal.com URL. Theme and brand color can be set with `getCalApi()` and `cal('ui', { styles: { branding: { brandColor } } })`; keep the brand color in sync with the active palette ([design.md](./design.md)). Docs: https://cal.com/help/embedding/adding-embed

### Calendly (`provider: 'calendly'`)

Embeds are available on all plans, including free (styling the embed colors is paid). Official inline snippet, rendered by a `'use client'` component that injects the widget script once:

```html
<div class="calendly-inline-widget" data-url="https://calendly.com/YOUR_LINK" style="min-width:320px;height:700px;"></div>
<script src="https://assets.calendly.com/assets/external/widget.js" async></script>
```

Docs: https://help.calendly.com/hc/en-us/articles/223147027

### Choosing

| | Cal.com free | Calendly free |
|---|---|---|
| Embed on your site | Yes | Yes |
| Match embed to your brand color | Yes | No (paid) |
| Take payment at booking | Yes (Stripe/PayPal) | Paid plans |
| Pricing | https://cal.com/pricing | https://calendly.com/pricing |

## Contact form (`/contact`) via Web3Forms

- Endpoint: `POST https://api.web3forms.com/submit` with `Accept: application/json`; body includes `access_key` plus the form fields; check `result.success`.
- The access key is **publishable by design** (Web3Forms FAQ: the access key is public, it only routes mail to one inbox). It lives in `site.config.ts`, not env.
- **Submit from the client.** Web3Forms free tier is client-side only; a server route or Server Action submit requires their paid plan. The contact form is a `'use client'` component using `fetch`.
- Spam protection: use the free hCaptcha option (`@hcaptcha/react-hcaptcha`, Web3Forms shared sitekey, token sent as `h-captcha-response`). The old `botcheck` honeypot is deprecated by Web3Forms; do not rely on it.
- Free tier: 250 submissions/month, unlimited forms and domains. Pricing: https://web3forms.com/pricing. Docs: https://docs.web3forms.com

Alternatives if a fork outgrows it (swap the endpoint in one component):

| Provider | Free tier | Pricing |
|---|---|---|
| Web3Forms (default) | 250/mo | https://web3forms.com/pricing |
| Formspree | 50/mo | https://formspree.io/plans |
| Basin | 50/mo, 1 form | https://usebasin.com/pricing |

There is no platform-native form service on Vercel; a form endpoint provider (above) is the zero-backend path.

## Payments

The template never processes money. Each service entry may carry a `paymentLink` (a Stripe Payment Link, PayPal.Me, or similar page the practitioner already owns), shown on the Services page and after booking guidance. Cal.com users can also collect payment inside the booking flow on the free plan.

## Privacy notes (surface these in the README)

- Booking data lives with the booking provider under the practitioner account.
- Contact submissions go to the practitioner inbox via Web3Forms; nothing is stored in the site.
- Free readings send only calculation inputs (birth date, time, place) to the readings API at request time; the site keeps nothing.
