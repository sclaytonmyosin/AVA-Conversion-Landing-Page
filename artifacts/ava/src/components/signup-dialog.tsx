import { useEffect, useRef, useState, type FormEvent } from 'react';
import { useCreateLead } from '@workspace/api-client-react';
import { Dialog, DialogContent, DialogDescription, DialogTitle } from '@/components/ui/dialog';
import { ArrowRight, Check, Loader2, Smartphone, AlertCircle } from 'lucide-react';
import { useCampaign } from '@/lib/campaign';

const BASE = import.meta.env.BASE_URL;
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

function getUtm() {
  const p = new URLSearchParams(window.location.search);
  const clip = (v: string | null) => (v ? v.slice(0, 200) : undefined);
  return {
    source: clip(p.get('utm_source')) ?? (window.location.pathname.includes('getava') ? 'getava' : 'landing'),
    medium: clip(p.get('utm_medium')),
    campaign: clip(p.get('utm_campaign')),
  };
}

export function SignupDialog({ open, onOpenChange }: { open: boolean; onOpenChange: (o: boolean) => void }) {
  const { campaign, offer } = useCampaign();
  const createLead = useCreateLead();
  const [email, setEmail] = useState('');
  const [consent, setConsent] = useState(false);
  const [errors, setErrors] = useState<{ email?: string; consent?: string; form?: string }>({});
  const [downloadUrl, setDownloadUrl] = useState<string | null>(null);
  const emailRef = useRef<HTMLInputElement>(null);
  const downloadRef = useRef<HTMLAnchorElement>(null);
  const isAndroid = typeof navigator !== 'undefined' && /android/i.test(navigator.userAgent);
  const isIOS = typeof navigator !== 'undefined' && /iphone|ipad|ipod/i.test(navigator.userAgent);

  useEffect(() => {
    if (downloadUrl) downloadRef.current?.focus();
  }, [downloadUrl]);

  useEffect(() => {
    if (!open) {
      const t = setTimeout(() => { setErrors({}); createLead.reset(); }, 200);
      return () => clearTimeout(t);
    }
    return undefined;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  async function submit(e: FormEvent) {
    e.preventDefault();
    const next: typeof errors = {};
    const trimmed = email.trim();
    if (!EMAIL_RE.test(trimmed) || trimmed.length > 254) next.email = 'Please enter a valid email address.';
    if (!consent) next.consent = 'Please tick the box to continue.';
    setErrors(next);
    if (next.email) { emailRef.current?.focus(); return; }
    if (next.consent) { document.getElementById('consent')?.focus(); return; }
    try {
      const res = await createLead.mutateAsync({ data: { email: trimmed, consent: true, ...getUtm() } });
      if (res.success && res.downloadUrl) {
        setDownloadUrl(res.downloadUrl);
        setEmail('');
      } else setErrors({ form: 'Something went wrong on our side. Please try again.' });
    } catch {
      setErrors({ form: 'We couldn’t save that just now. Check your connection and try again.' });
    }
  }

  const qr = downloadUrl
    ? `https://api.qrserver.com/v1/create-qr-code/?size=220x220&margin=0&color=3B2FA0&bgcolor=FEFDFB&data=${encodeURIComponent(downloadUrl)}`
    : '';

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className="max-w-[440px] rounded-[28px] border-0 bg-background p-0 overflow-hidden shadow-[0_40px_80px_-20px_hsl(246_55%_25%/0.45)]"
        onOpenAutoFocus={(e) => { if (!downloadUrl) { e.preventDefault(); emailRef.current?.focus(); } }}
        data-testid="dialog-signup"
      >
        <div className="h-1.5 bg-gradient-to-r from-[#5750C1] via-[#3B9E95] to-[#F4A27A]" />
        <div className="flex items-center gap-2 px-7 pt-6 text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground" aria-hidden>
          <span className={downloadUrl ? 'text-muted-foreground' : 'text-primary'}>1 Email</span>
          <span className="h-px w-6 bg-border" />
          <span className={downloadUrl ? 'text-primary' : ''}>2 Download</span>
        </div>
        {!downloadUrl ? (
          <form onSubmit={submit} noValidate className="px-7 pb-7 pt-3">
            {campaign && <p className="mb-2 text-sm font-semibold text-[#1F6B65]">{campaign.welcome}</p>}
            <DialogTitle className="font-display text-3xl font-semibold leading-tight text-[#3B2FA0]">{offer.signupTitle}</DialogTitle>
            <DialogDescription className="mt-2 text-[15px] leading-relaxed text-muted-foreground">
              Tell us where to reach you, then we’ll take you straight to the App Store. {offer.terms}
            </DialogDescription>
            <label htmlFor="email" className="mt-6 block text-sm font-semibold">Email</label>
            <input
              ref={emailRef}
              id="email"
              type="email"
              autoComplete="email"
              inputMode="email"
              maxLength={254}
              value={email}
              onChange={(e) => { setEmail(e.target.value); if (errors.email) setErrors((x) => ({ ...x, email: undefined })); }}
              aria-invalid={!!errors.email}
              aria-describedby={errors.email ? 'email-error' : undefined}
              placeholder="you@example.com"
              className="mt-2 w-full rounded-2xl border-2 border-input bg-white/70 px-4 py-3.5 text-base outline-none transition focus:border-[#5750C1] focus:ring-4 focus:ring-[#5750C1]/15 aria-[invalid=true]:border-destructive"
              data-testid="input-email"
            />
            {errors.email && <p id="email-error" role="alert" className="mt-2 flex items-center gap-1.5 text-sm text-destructive"><AlertCircle className="h-4 w-4" />{errors.email}</p>}
            <div className="mt-5 flex items-start gap-3">
              <input
                id="consent"
                type="checkbox"
                checked={consent}
                onChange={(e) => { setConsent(e.target.checked); if (errors.consent) setErrors((x) => ({ ...x, consent: undefined })); }}
                aria-invalid={!!errors.consent}
                aria-describedby={errors.consent ? 'consent-error' : undefined}
                className="mt-0.5 h-5 w-5 shrink-0 cursor-pointer accent-[#5750C1]"
                data-testid="checkbox-consent"
              />
              <label htmlFor="consent" className="text-sm leading-relaxed text-foreground/80">
                I agree to receive emails from AVA about the product, updates and news. I can unsubscribe anytime. See the{' '}
                <a href="https://hiava.app/privacy_policy.html" target="_blank" rel="noopener noreferrer" className="font-semibold text-[#3B2FA0] underline underline-offset-2" data-testid="link-privacy">Privacy Policy</a>.
              </label>
            </div>
            {errors.consent && <p id="consent-error" role="alert" className="mt-2 flex items-center gap-1.5 text-sm text-destructive"><AlertCircle className="h-4 w-4" />{errors.consent}</p>}
            {errors.form && (
              <div role="alert" className="mt-5 rounded-2xl bg-destructive/10 px-4 py-3 text-sm text-destructive" data-testid="status-error">{errors.form}</div>
            )}
            <button
              type="submit"
              disabled={createLead.isPending}
              className="group mt-6 flex w-full items-center justify-center gap-2 rounded-full bg-[#3B2FA0] px-6 py-4 text-base font-semibold text-[#FEFDFB] transition hover:bg-[#5750C1] disabled:opacity-70"
              data-testid="button-submit-email"
            >
              {createLead.isPending ? <><Loader2 className="h-5 w-5 animate-spin" /> Saving…</> : <>Continue to download <ArrowRight className="h-5 w-5 transition group-hover:translate-x-1" /></>}
            </button>
            <p className="mt-4 flex items-center justify-center gap-1.5 text-xs text-muted-foreground"><Smartphone className="h-3.5 w-3.5" /> iPhone only for now. Not yet available on Android.</p>
          </form>
        ) : (
          <div className="px-7 pb-7 pt-3" data-testid="step-download">
            <DialogTitle className="font-display text-3xl font-semibold leading-tight text-[#3B2FA0]">You’re in. One last step.</DialogTitle>
            <DialogDescription className="mt-2 text-[15px] leading-relaxed text-muted-foreground">
              {offer.downloadInstructions}
            </DialogDescription>
            {campaign && <p className="mt-3 text-sm font-semibold text-[#1F6B65]">For {campaign.influencer}’s community · {offer.freePeriod} free</p>}
            {isAndroid && (
              <div role="note" className="mt-5 rounded-2xl bg-secondary px-4 py-3 text-sm text-secondary-foreground">
                AVA is iPhone only right now, so it won’t install on this Android device. Open this link on an iPhone instead.
              </div>
            )}
            {!isIOS && !isAndroid && (
              <div className="mt-6 flex items-center gap-5 rounded-3xl bg-muted p-4">
                <img src={qr} alt="QR code linking to AVA on the App Store" width={112} height={112} className="h-28 w-28 rounded-xl bg-[#FEFDFB] p-2" data-testid="img-qr" />
                <p className="text-sm leading-relaxed text-foreground/80"><span className="font-semibold text-foreground">On your computer?</span> Point your iPhone camera here to open AVA in the App Store.</p>
              </div>
            )}
            <a
              ref={downloadRef}
              href={downloadUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-6 flex w-full items-center justify-center gap-2 rounded-full bg-[#3B2FA0] px-6 py-4 text-base font-semibold text-[#FEFDFB] transition hover:bg-[#5750C1] focus:outline-none focus-visible:ring-4 focus-visible:ring-[#5750C1]/30"
              data-testid="link-app-store"
            >
              <AppleGlyph /> Download on the App Store
            </a>
            <ul className="mt-5 space-y-2 text-sm text-foreground/75">
              {['Connect Gmail and Google Calendar', 'Forward a school email or snap a screenshot', 'Approve what AVA suggests'].map((t) => (
                <li key={t} className="flex gap-2"><Check className="mt-0.5 h-4 w-4 shrink-0 text-[#2E8A82]" />{t}</li>
              ))}
            </ul>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}

export function AppleGlyph({ className = 'h-5 w-5' }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="currentColor" aria-hidden>
      <path d="M16.37 12.6c-.02-2.2 1.8-3.26 1.88-3.31-1.03-1.5-2.62-1.7-3.18-1.73-1.35-.14-2.64.8-3.33.8-.69 0-1.74-.78-2.87-.76-1.47.02-2.83.86-3.59 2.18-1.53 2.66-.39 6.6 1.1 8.76.73 1.06 1.6 2.24 2.73 2.2 1.1-.04 1.51-.71 2.84-.71 1.32 0 1.7.71 2.86.69 1.18-.02 1.93-1.07 2.65-2.13.84-1.22 1.18-2.41 1.2-2.47-.03-.01-2.3-.88-2.32-3.5zM14.2 6.13c.6-.73 1.01-1.75.9-2.76-.87.04-1.92.58-2.54 1.31-.56.64-1.05 1.68-.92 2.67.97.08 1.96-.49 2.56-1.22z" />
    </svg>
  );
}

export { BASE };
