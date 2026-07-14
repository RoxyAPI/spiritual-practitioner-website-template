'use client';

import HCaptcha from '@hcaptcha/react-hcaptcha';
import { useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { siteConfig } from '@/config/site.config';

/**
 * Contact form, submitted straight from the browser to Web3Forms.
 *
 * @remarks The access key is publishable by design: it only routes mail to one inbox, which is why it lives in `site.config.ts` and the site needs no backend and no second environment variable. The free plan accepts browser submissions only, so this is a client component and not a Server Action.
 *
 * The captcha is the shared Web3Forms hCaptcha site key, free and zero-config. Enable hCaptcha on the form in the Web3Forms dashboard to have it enforced server side. Setup: `docs/integrations.md`.
 */
const HCAPTCHA_SITEKEY = '50b2fe65-b00b-4b9e-ad62-3ba471098be2';
const PLACEHOLDER_KEY = 'YOUR_WEB3FORMS_ACCESS_KEY';

type Status = { state: 'idle' | 'sending' } | { state: 'sent' | 'failed'; message: string };

export function ContactForm() {
  const [status, setStatus] = useState<Status>({ state: 'idle' });
  const [token, setToken] = useState('');
  const captcha = useRef<HCaptcha>(null);

  const configured = siteConfig.contact.web3formsKey !== PLACEHOLDER_KEY;

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!configured) {
      setStatus({
        state: 'failed',
        message: 'This form is not connected yet. Add a Web3Forms access key in site.config.ts.',
      });
      return;
    }

    const form = event.currentTarget;
    setStatus({ state: 'sending' });

    const response = await fetch('https://api.web3forms.com/submit', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify({
        access_key: siteConfig.contact.web3formsKey,
        subject: `New message from ${siteConfig.siteUrl}`,
        'h-captcha-response': token,
        ...Object.fromEntries(new FormData(form)),
      }),
    }).catch(() => null);

    const result = await response?.json().catch(() => null);

    captcha.current?.resetCaptcha();
    setToken('');

    if (result?.success) {
      form.reset();
      setStatus({ state: 'sent', message: 'Message sent. You will hear back within two days.' });
      return;
    }

    setStatus({
      state: 'failed',
      message:
        result?.message ?? 'The message could not be sent. Please try again, or write by email.',
    });
  }

  return (
    <form onSubmit={onSubmit} className="space-y-6">
      <div className="grid gap-6 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="name">Your name</Label>
          <Input id="name" name="name" autoComplete="name" required />
        </div>
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input id="email" name="email" type="email" autoComplete="email" required />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="message">What would you like to ask?</Label>
        <Textarea id="message" name="message" rows={6} required />
      </div>

      <HCaptcha ref={captcha} sitekey={HCAPTCHA_SITEKEY} onVerify={setToken} />

      <div className="flex flex-wrap items-center gap-4">
        <Button type="submit" size="lg" className="eyebrow" disabled={status.state === 'sending'}>
          {status.state === 'sending' ? 'Sending' : 'Send message'}
        </Button>
        {status.state === 'sent' || status.state === 'failed' ? (
          <p
            role="status"
            className={`text-sm ${status.state === 'sent' ? 'text-muted-foreground' : 'text-destructive'}`}
          >
            {status.message}
          </p>
        ) : null}
      </div>
    </form>
  );
}
