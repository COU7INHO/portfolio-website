import macbookImg from '@/assets/setup/macbook-pro-m5.png';
import monitorImg from '@/assets/setup/aoc-cu34g2x.png';
import keyboardImg from '@/assets/setup/mx-keys.webp';
import mouseImg from '@/assets/setup/mx-master-3.webp';
import dockImg from '@/assets/setup/hp-thunderbolt-dock-g4.png';
import webcamImg from '@/assets/setup/anker-c200.webp';
import piImg from '@/assets/setup/raspberry-pi-5.webp';
import lenovoImg from '@/assets/setup/thinkcentre-m920q.png';
import jabraImg from '@/assets/setup/jabra_evolve3_85.png';

// Shared by the Setup page and the dev mode terminal (setup/ directory).
// `slug` names the terminal file (<slug>.json).
export interface SetupItem {
  slug: string;
  name: string;
  brand: string;
  category: string;
  image: string;
  description: string;
  specs: string[];
  productUrl: string;
  imageScale?: number;
}

export const setupItems: SetupItem[] = [
  {
    slug: 'MacBookPro14_M5',
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
    slug: 'AOC_CU34G2X',
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
    slug: 'Logitech_MXKeys',
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
    slug: 'Logitech_MXMaster3',
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
    slug: 'HP_ThunderboltDock120W_G4',
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
    slug: 'Anker_PowerConfC200',
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
    slug: 'Jabra_Evolve3_85',
    name: 'Evolve3 85',
    brand: 'Jabra',
    category: 'Headset',
    image: jabraImg,
    description: 'Over-ear comfort with active noise cancellation that keeps me focused through long calls and deep work. The boom mic makes me sound clear on every meeting, and the all-day battery means I never think about charging.',
    specs: ['Active noise cancellation', 'Boom microphone', 'Bluetooth multipoint', 'All-day battery'],
    productUrl: 'https://www.jabra.com/business/office-headsets/jabra-evolve/jabra-evolve3-85',
    imageScale: 0.86,
  },
  {
    slug: 'RaspberryPi5',
    name: 'Raspberry Pi 5',
    brand: 'Raspberry Pi',
    category: 'Home server',
    image: piImg,
    description: 'My always on home lab, quietly running 24/7. Hosts a few personal websites along with AI and ML side projects without breaking a sweat. Small, silent, and surprisingly capable.',
    specs: ['ARM Cortex-A76 quad-core', '8 GB LPDDR4X RAM', 'Dual 4K HDMI', 'PCIe 2.0 expansion'],
    productUrl: 'https://www.raspberrypi.com/products/raspberry-pi-5/',
    imageScale: 0.85,
  },
  {
    slug: 'Lenovo_ThinkCentreM920q',
    name: 'ThinkCentre M920q',
    brand: 'Lenovo',
    category: 'Mini PC',
    image: lenovoImg,
    description: 'Compact 1-litre powerhouse running Proxmox as my virtualization playground. Hosts the VMs and containers behind my personal projects, packing far more punch than its tiny footprint suggests.',
    specs: ['Intel Core i5-9500T', '16 GB DDR4 RAM', '1L Tiny form factor', 'Runs Proxmox VE'],
    productUrl: 'https://www.lenovo.com/pt/pt/p/desktops/thinkcentre/m-series-tiny/thinkcentre-m920q/11tc1mtm92q',
    imageScale: 0.94,
  },
];
