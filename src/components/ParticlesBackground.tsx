import { useEffect, useRef } from 'react';

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  baseOpacity: number;
  opacity: number;
  twinkleSpeed: number;
  twinklePhase: number;
  brightness: number;
}

const ParticlesBackground = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particlesRef = useRef<Particle[]>([]);
  const animationRef = useRef<number>();
  const timeRef = useRef<number>(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    const createParticles = () => {
      // Increased density - more stars
      const particleCount = Math.floor((canvas.width * canvas.height) / 12000);
      particlesRef.current = [];

      for (let i = 0; i < particleCount; i++) {
        particlesRef.current.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          // Slightly faster movement
          vx: (Math.random() - 0.5) * 0.5,
          vy: (Math.random() - 0.5) * 0.5,
          size: Math.random() * 2.5 + 0.5,
          baseOpacity: Math.random() * 0.5 + 0.2,
          opacity: 0,
          // Individual twinkle speed for variation
          twinkleSpeed: Math.random() * 0.03 + 0.01,
          twinklePhase: Math.random() * Math.PI * 2,
          // Brightness variation (0.6 to 1.0)
          brightness: Math.random() * 0.4 + 0.6,
        });
      }
    };

    const animate = () => {
      if (!ctx || !canvas) return;

      timeRef.current += 1;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      particlesRef.current.forEach((particle) => {
        particle.x += particle.vx;
        particle.y += particle.vy;

        // Wrap around edges
        if (particle.x < 0) particle.x = canvas.width;
        if (particle.x > canvas.width) particle.x = 0;
        if (particle.y < 0) particle.y = canvas.height;
        if (particle.y > canvas.height) particle.y = 0;

        // Twinkling effect with individual phase and speed
        const twinkle = Math.sin(timeRef.current * particle.twinkleSpeed + particle.twinklePhase);
        particle.opacity = particle.baseOpacity * (0.5 + twinkle * 0.5) * particle.brightness;

        // Draw particle with accent color (cyan) and variable brightness
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
        
        // Slight color variation based on brightness
        const lightness = 53 + (particle.brightness - 0.6) * 20;
        ctx.fillStyle = `hsla(187, 85%, ${lightness}%, ${particle.opacity})`;
        ctx.fill();

        // Add subtle glow for brighter stars
        if (particle.brightness > 0.85 && particle.size > 1.5) {
          ctx.beginPath();
          ctx.arc(particle.x, particle.y, particle.size * 2, 0, Math.PI * 2);
          ctx.fillStyle = `hsla(187, 85%, ${lightness}%, ${particle.opacity * 0.2})`;
          ctx.fill();
        }
      });

      animationRef.current = requestAnimationFrame(animate);
    };

    resizeCanvas();
    createParticles();
    animate();

    const handleResize = () => {
      resizeCanvas();
      createParticles();
    };

    window.addEventListener('resize', handleResize);

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-0"
      style={{ opacity: 0.7 }}
    />
  );
};

export default ParticlesBackground;