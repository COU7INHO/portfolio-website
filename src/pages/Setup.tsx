import { useEffect, useRef } from 'react';
import { ExternalLink } from 'lucide-react';
import Navigation from '@/components/Navigation';
import BackButton from '@/components/BackButton';
import Footer from '@/components/Footer';
import ParticlesBackground from '@/components/ParticlesBackground';
import { useScrollToTop } from '@/hooks/useScrollToTop';

import { setupItems } from '@/data/setup';

const Setup = () => {
  const pageRef = useRef<HTMLDivElement>(null);
  useScrollToTop();

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('animate-fade-up');
          }
        });
      },
      { threshold: 0.1 }
    );

    const elements = pageRef.current?.querySelectorAll('.reveal');
    elements?.forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, []);

  return (
    <div className="min-h-screen bg-background relative" ref={pageRef}>
      <ParticlesBackground />
      <Navigation />
      <BackButton />

      <main className="relative z-10 pt-28 pb-16">
        <div className="container mx-auto px-6">
          <div className="reveal opacity-0 text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-3">
              My Setup
            </h1>
            <p className="text-muted-foreground max-w-lg mx-auto">
              The hardware I use every day for development, side projects, and everything in between
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {setupItems.map((item, index) => (
              <div
                key={item.name}
                className="reveal opacity-0 group"
                style={{ animationDelay: `${index * 0.05}s` }}
              >
                <div className="h-full overflow-hidden rounded-2xl border border-border bg-card card-hover flex flex-col">
                  <div className="relative aspect-square flex items-center justify-center overflow-hidden border-b border-border">
                    <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,hsl(var(--secondary)/0.5),transparent_70%)]" />
                    <img
                      src={item.image}
                      alt={`${item.brand} ${item.name}`}
                      className="relative w-full h-full object-contain p-8 transition-transform duration-500 group-hover:[transform:scale(var(--hover-scale))]"
                      style={
                        {
                          transform: `scale(${item.imageScale ?? 1})`,
                          '--hover-scale': (item.imageScale ?? 1) * 1.05,
                        } as React.CSSProperties
                      }
                      loading="lazy"
                    />
                    <span className="absolute top-3 right-3 px-2.5 py-1 text-[10px] font-medium uppercase tracking-wide rounded-full bg-background/90 text-muted-foreground border border-border backdrop-blur-sm">
                      {item.category}
                    </span>
                  </div>

                  <div className="p-5 flex-1 flex flex-col">
                    <p className="text-xs font-medium text-primary uppercase tracking-wide mb-1">
                      {item.brand}
                    </p>
                    <a
                      href={item.productUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 mb-3 group/link"
                    >
                      <h2 className="text-lg font-semibold text-foreground group-hover:text-primary group-hover/link:text-primary transition-colors">
                        {item.name}
                      </h2>
                      <ExternalLink className="w-3.5 h-3.5 text-muted-foreground group-hover/link:text-primary transition-colors" />
                    </a>
                    <p className="text-sm text-secondary-foreground leading-relaxed mb-4 flex-1">
                      {item.description}
                    </p>
                    <ul className="space-y-1.5 pt-3 border-t border-border">
                      {item.specs.map((spec) => (
                        <li
                          key={spec}
                          className="flex items-start gap-2 text-xs text-muted-foreground"
                        >
                          <span className="w-1 h-1 bg-primary rounded-full mt-1.5 shrink-0" />
                          {spec}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Setup;
