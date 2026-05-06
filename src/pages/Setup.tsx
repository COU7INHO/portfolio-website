import { useEffect, useRef } from 'react';
import { ExternalLink } from 'lucide-react';
import Navigation from '@/components/Navigation';
import BackButton from '@/components/BackButton';
import Footer from '@/components/Footer';
import ParticlesBackground from '@/components/ParticlesBackground';
import { useScrollToTop } from '@/hooks/useScrollToTop';

import macbookImg from '@/assets/setup/macbook-pro-m5.png';
import monitorImg from '@/assets/setup/aoc-cu34g2x.png';
import keyboardImg from '@/assets/setup/mx-keys.webp';
import mouseImg from '@/assets/setup/mx-master-3.webp';
import dockImg from '@/assets/setup/hp-thunderbolt-dock-g4.png';
import webcamImg from '@/assets/setup/anker-c200.webp';
import piImg from '@/assets/setup/raspberry-pi-5.webp';
import airpodsImg from '@/assets/setup/airpods-pro-2.png';

interface SetupItem {
  name: string;
  brand: string;
  category: string;
  image: string;
  description: string;
  specs: string[];
  productUrl: string;
  imageScale?: number;
}

const setupItems: SetupItem[] = [
  {
    name: 'MacBook Pro 14" M5',
    brand: 'Apple',
    category: 'Laptop',
    image: macbookImg,
    description: 'My daily driver for everything from full stack development to running local AI models. The M5 chip handles almost everything I throw at it without breaking a sweat, except when I try to run the largest LLMs.',
    specs: ['Apple M5', '24 GB unified memory', '14" Liquid Retina XDR', 'Space Black'],
    productUrl: 'https://www.apple.com/shop/buy-mac/macbook-pro/14-inch-m5',
    imageScale: 1.6,
  },
  {
    name: 'CU34G2X/BK 34"',
    brand: 'AOC',
    category: 'Monitor',
    image: monitorImg,
    description: 'Curved ultrawide that makes side by side coding and reference docs feel natural. Perfect for keeping multiple VS Code windows open at once without ever feeling cramped.',
    specs: ['34" curved VA panel', '3440 x 1440 UWQHD', '144 Hz, 1 ms', '1500R curvature'],
    productUrl: 'https://saas.aoc.com/product/CU34G2XP',
    imageScale: 1.15,
  },
  {
    name: 'MX Keys',
    brand: 'Logitech',
    category: 'Keyboard',
    image: keyboardImg,
    description: 'Quiet, precise, and switches between three devices with a single key press. The keys are gentle on the wrists during long coding sessions.',
    specs: ['Wireless (Bluetooth + Unifying)', 'Backlit keys', 'Multi-device pairing', 'USB-C charging'],
    productUrl: 'https://www.logitech.com/en-eu/shop/p/mx-keys-s.920-011586',
    imageScale: 1.2,
  },
  {
    name: 'MX Master 3',
    brand: 'Logitech',
    category: 'Mouse',
    image: mouseImg,
    description: 'The MagSpeed scroll wheel alone justifies the price. Flick it and skim through a file with thousands of lines in seconds. Customisable side buttons handle my most used shortcuts.',
    specs: ['MagSpeed electromagnetic scroll', '4000 DPI sensor', 'Multi-device pairing', 'USB-C charging'],
    productUrl: 'https://www.logitech.com/en-us/shop/p/mx-master-3s',
    imageScale: 0.86,
  },
  {
    name: 'Thunderbolt Dock 120W G4',
    brand: 'HP',
    category: 'Docking station',
    image: dockImg,
    description: 'One cable to my MacBook and everything just works: monitor, keyboard, mouse, ethernet, charging. Keeps the desk clean and the workflow uninterrupted.',
    specs: ['Thunderbolt 4', '120 W power delivery', 'Up to 4 displays', 'Gigabit ethernet'],
    productUrl: 'https://www.hp.com/us-en/shop/pdp/hp-thunderbolt-dock-120w-g4',
    imageScale: 0.8,
  },
  {
    name: 'PowerConf C200',
    brand: 'Anker',
    category: 'Webcam',
    image: webcamImg,
    description: 'Sharp 2K image with surprisingly good performance in low light. The privacy cover is a small thing but I appreciate the peace of mind.',
    specs: ['2K resolution', 'AI noise cancellation', 'Adjustable field of view', 'Privacy cover'],
    productUrl: 'https://us.ankerwork.com/products/a3369',
    imageScale: 0.8,
  },
  {
    name: 'AirPods Pro 2',
    brand: 'Apple',
    category: 'Earbuds',
    image: airpodsImg,
    description: 'Active noise cancellation that lets me focus on whether I am at home, in a café, or on a plane. Seamless handoff between the MacBook and the iPhone makes them feel invisible.',
    specs: ['Active noise cancellation', 'Adaptive audio', 'Spatial audio', 'USB-C charging case'],
    productUrl: 'https://support.apple.com/en-us/111851',
    imageScale: 0.86,
  },
  {
    name: 'Raspberry Pi 5',
    brand: 'Raspberry Pi',
    category: 'Home server',
    image: piImg,
    description: 'My always on home lab, quietly running 24/7. Hosts a few personal websites along with AI and ML side projects without breaking a sweat. Small, silent, and surprisingly capable.',
    specs: ['ARM Cortex-A76 quad-core', '8 GB LPDDR4X RAM', 'Dual 4K HDMI', 'PCIe 2.0 expansion'],
    productUrl: 'https://www.raspberrypi.com/products/raspberry-pi-5/',
    imageScale: 0.85,
  },
];

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
