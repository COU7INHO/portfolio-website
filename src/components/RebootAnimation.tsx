import { useEffect, useRef, useState } from 'react';
import { RebootPhase } from '@/hooks/useTerminal';

interface RebootAnimationProps {
  phase: RebootPhase;
  onComplete: () => void;
}

interface Particle {
  x: number;
  y: number;
  targetX: number;
  targetY: number;
  originX: number;
  originY: number;
  size: number;
  speed: number;
  color: string;
  angle: number;
  velocity: number;
}

const RebootAnimation = ({ phase, onComplete }: RebootAnimationProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particlesRef = useRef<Particle[]>([]);
  const animationRef = useRef<number>();
  const [currentPhase, setCurrentPhase] = useState<RebootPhase>(phase);
  const [flashOpacity, setFlashOpacity] = useState(0);

  // Initialize particles
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    
    // Create particles spread across the screen
    const particles: Particle[] = [];
    const colors = [
      'hsl(142, 76%, 36%)', // Primary green
      'hsl(142, 76%, 50%)', // Lighter green
      'hsl(142, 76%, 70%)', // Even lighter
      'hsl(0, 0%, 100%)',   // White
      'hsl(180, 70%, 50%)', // Cyan accent
    ];

    for (let i = 0; i < 300; i++) {
      const angle = Math.random() * Math.PI * 2;
      const distance = Math.random() * Math.max(canvas.width, canvas.height);
      const x = centerX + Math.cos(angle) * distance;
      const y = centerY + Math.sin(angle) * distance;

      particles.push({
        x,
        y,
        originX: x,
        originY: y,
        targetX: centerX,
        targetY: centerY,
        size: Math.random() * 3 + 1,
        speed: Math.random() * 0.02 + 0.01,
        color: colors[Math.floor(Math.random() * colors.length)],
        angle: Math.atan2(y - centerY, x - centerX),
        velocity: 0,
      });
    }

    particlesRef.current = particles;
  }, []);

  // Phase transitions
  useEffect(() => {
    if (phase === 'imploding') {
      setCurrentPhase('imploding');
      
      // After imploding, go to pause
      const timer = setTimeout(() => {
        setCurrentPhase('pause');
        
        // After pause, go to exploding
        setTimeout(() => {
          setFlashOpacity(1);
          setCurrentPhase('exploding');
          
          // Flash fade
          setTimeout(() => setFlashOpacity(0), 100);
          
          // After exploding, complete
          setTimeout(() => {
            setCurrentPhase('done');
            onComplete();
          }, 2000);
        }, 400);
      }, 2000);

      return () => clearTimeout(timer);
    }
  }, [phase, onComplete]);

  // Animation loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;

    const animate = () => {
      ctx.fillStyle = 'rgba(0, 0, 0, 0.15)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      particlesRef.current.forEach((particle) => {
        if (currentPhase === 'imploding') {
          // Move towards center with acceleration
          const dx = centerX - particle.x;
          const dy = centerY - particle.y;
          const distance = Math.sqrt(dx * dx + dy * dy);
          
          if (distance > 5) {
            // Spiral effect
            particle.angle += 0.02;
            const spiralFactor = Math.max(0, 1 - distance / 500);
            
            particle.velocity = Math.min(particle.velocity + 0.3, 15);
            particle.x += (dx / distance) * particle.velocity + Math.cos(particle.angle) * spiralFactor * 3;
            particle.y += (dy / distance) * particle.velocity + Math.sin(particle.angle) * spiralFactor * 3;
          }
        } else if (currentPhase === 'pause') {
          // Particles cluster at center with slight pulsing
          const dx = centerX - particle.x;
          const dy = centerY - particle.y;
          particle.x += dx * 0.1;
          particle.y += dy * 0.1;
        } else if (currentPhase === 'exploding') {
          // Explode outward from center
          const angle = particle.angle + Math.PI; // Reverse direction
          const speed = particle.velocity * 1.5 + 5;
          
          particle.x += Math.cos(angle) * speed;
          particle.y += Math.sin(angle) * speed;
          
          // Add some randomness
          particle.x += (Math.random() - 0.5) * 2;
          particle.y += (Math.random() - 0.5) * 2;
        }

        // Draw particle with glow
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
        ctx.fillStyle = particle.color;
        ctx.fill();

        // Add glow effect
        if (currentPhase === 'pause' || currentPhase === 'exploding') {
          ctx.beginPath();
          ctx.arc(particle.x, particle.y, particle.size * 3, 0, Math.PI * 2);
          const gradient = ctx.createRadialGradient(
            particle.x, particle.y, 0,
            particle.x, particle.y, particle.size * 3
          );
          gradient.addColorStop(0, particle.color.replace(')', ', 0.5)').replace('hsl', 'hsla'));
          gradient.addColorStop(1, 'transparent');
          ctx.fillStyle = gradient;
          ctx.fill();
        }
      });

      // Draw center point during pause
      if (currentPhase === 'pause') {
        const pulseSize = 10 + Math.sin(Date.now() / 50) * 5;
        
        // Outer glow
        const gradient = ctx.createRadialGradient(centerX, centerY, 0, centerX, centerY, pulseSize * 5);
        gradient.addColorStop(0, 'hsla(142, 76%, 60%, 0.8)');
        gradient.addColorStop(0.5, 'hsla(142, 76%, 50%, 0.3)');
        gradient.addColorStop(1, 'transparent');
        ctx.beginPath();
        ctx.arc(centerX, centerY, pulseSize * 5, 0, Math.PI * 2);
        ctx.fillStyle = gradient;
        ctx.fill();

        // Core
        ctx.beginPath();
        ctx.arc(centerX, centerY, pulseSize, 0, Math.PI * 2);
        ctx.fillStyle = 'white';
        ctx.fill();
      }

      animationRef.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [currentPhase]);

  if (phase === 'idle' || phase === 'message') return null;

  return (
    <div className="fixed inset-0 z-[100]">
      {/* Black overlay that fades in during implosion */}
      <div 
        className="absolute inset-0 bg-black transition-opacity duration-1000"
        style={{ 
          opacity: currentPhase === 'imploding' ? 0.8 : 
                   currentPhase === 'pause' ? 1 : 
                   currentPhase === 'exploding' ? Math.max(0, 1 - (Date.now() % 2000) / 2000) : 0 
        }}
      />
      
      {/* Canvas for particle animation */}
      <canvas 
        ref={canvasRef}
        className="absolute inset-0 w-full h-full"
      />
      
      {/* Flash effect on explosion */}
      <div 
        className="absolute inset-0 bg-white pointer-events-none transition-opacity duration-100"
        style={{ opacity: flashOpacity }}
      />
    </div>
  );
};

export default RebootAnimation;
