import { useState, useRef } from 'react';
import { Github, Linkedin } from 'lucide-react';
import { Turnstile } from '@marsidev/react-turnstile';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';

const socialLinks = [
  { icon: Github, label: 'GitHub', href: 'https://github.com/COU7INHO' },
  { icon: Linkedin, label: 'LinkedIn', href: 'https://www.linkedin.com/in/tiagocoutinho/?locale=en_US' },
];

type SubmitState = 'idle' | 'submitting' | 'success' | 'error';

const Contact = () => {
  const [hoveredLink, setHoveredLink] = useState<number | null>(null);
  const [submitState, setSubmitState] = useState<SubmitState>('idle');
  const [turnstileToken, setTurnstileToken] = useState<string | null>(null);
  const formRef = useRef<HTMLFormElement>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmitState('submitting');

    const formData = new FormData(e.currentTarget);
    
    if (turnstileToken) {
      formData.append('cf-turnstile-response', turnstileToken);
    }

    try {
      const response = await fetch('https://formspree.io/f/maqbgkjq', {
        method: 'POST',
        body: formData,
        headers: {
          Accept: 'application/json',
        },
      });

      if (response.ok) {
        setSubmitState('success');
        formRef.current?.reset();
        setTurnstileToken(null);
        setTimeout(() => setSubmitState('idle'), 3000);
      } else {
        setSubmitState('error');
        setTimeout(() => setSubmitState('idle'), 3000);
      }
    } catch {
      setSubmitState('error');
      setTimeout(() => setSubmitState('idle'), 3000);
    }
  };

  const getButtonText = () => {
    switch (submitState) {
      case 'submitting':
        return 'Transmitting...';
      case 'success':
        return 'Transmission Sent ✓';
      case 'error':
        return 'Transmission Failed';
      default:
        return 'Send Transmission';
    }
  };

  return (
    <section id="contact" className="py-20 relative">
      <div className="container mx-auto px-6">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-start">
          {/* Left Side - Title and Social Constellation */}
          <div className="space-y-8">
            <div className="space-y-3">
              <h2 className="text-3xl md:text-4xl font-bold text-foreground">
                Send a <span className="text-primary text-glow">Transmission</span>
              </h2>
              <p className="text-muted-foreground text-lg">
                Reach me across the galaxy
              </p>
            </div>

            {/* Social Links Row */}
            <div className="flex items-center gap-4">
              {socialLinks.map((link, idx) => {
                const Icon = link.icon;
                const isHovered = hoveredLink === idx;
                return (
                  <a
                    key={idx}
                    href={link.href}
                    target={link.href.startsWith('mailto:') ? undefined : '_blank'}
                    rel="noopener noreferrer"
                    className="group"
                    onMouseEnter={() => setHoveredLink(idx)}
                    onMouseLeave={() => setHoveredLink(null)}
                    aria-label={link.label}
                  >
                    <div
                      className={`
                        w-12 h-12 rounded-full flex items-center justify-center
                        bg-background/50 border border-border/50
                        transition-all duration-300
                        ${isHovered 
                          ? 'border-primary/80 shadow-[0_0_20px_hsl(var(--primary)/0.5)] scale-110' 
                          : 'hover:border-primary/50'
                        }
                      `}
                    >
                      <Icon 
                        className={`w-5 h-5 transition-all duration-300 ${
                          isHovered ? 'text-primary' : 'text-muted-foreground'
                        }`} 
                      />
                    </div>
                  </a>
                );
              })}
            </div>
          </div>

          {/* Right Side - Contact Form */}
          <div className="w-full">
            <form
              ref={formRef}
              onSubmit={handleSubmit}
              className="space-y-5"
            >
              <div className="space-y-4">
                <Input
                  type="text"
                  name="name"
                  placeholder="Your name"
                  required
                  className="
                    bg-background/30 border-border/50 
                    focus:border-primary focus:shadow-[0_0_15px_hsl(var(--primary)/0.2)]
                    transition-all duration-300
                    placeholder:text-muted-foreground/60
                  "
                />
                <Input
                  type="email"
                  name="email"
                  placeholder="Your email"
                  required
                  className="
                    bg-background/30 border-border/50 
                    focus:border-primary focus:shadow-[0_0_15px_hsl(var(--primary)/0.2)]
                    transition-all duration-300
                    placeholder:text-muted-foreground/60
                  "
                />
                <Textarea
                  name="message"
                  placeholder="Your message..."
                  required
                  rows={5}
                  className="
                    bg-background/30 border-border/50 
                    focus:border-primary focus:shadow-[0_0_15px_hsl(var(--primary)/0.2)]
                    transition-all duration-300
                    placeholder:text-muted-foreground/60
                    resize-none
                  "
                />
              </div>

              <Turnstile
                siteKey="0x4AAAAAACXVZnMb55dYrxut"
                onSuccess={(token) => setTurnstileToken(token)}
                onExpire={() => setTurnstileToken(null)}
                options={{ theme: 'dark' }}
              />

              <Button
                type="submit"
                disabled={submitState === 'submitting' || !turnstileToken}
                className={`
                  w-full relative overflow-hidden
                  bg-primary text-primary-foreground
                  hover:bg-primary/90
                  transition-all duration-300
                  ${submitState === 'success' 
                    ? 'bg-green-600 hover:bg-green-600' 
                    : submitState === 'error' 
                      ? 'bg-destructive hover:bg-destructive' 
                      : 'hover:shadow-[0_0_20px_hsl(var(--primary)/0.4)]'
                  }
                `}
              >
                <span className="relative z-10">{getButtonText()}</span>
                {/* Pulse animation on success */}
                {submitState === 'success' && (
                  <span className="absolute inset-0 animate-ping bg-green-400/30 rounded-md" />
                )}
              </Button>

              {submitState === 'error' && (
                <p className="text-destructive text-sm text-center animate-fade-in">
                  Transmission failed. Try again.
                </p>
              )}
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;
