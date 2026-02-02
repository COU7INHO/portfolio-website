import { useState } from 'react';
import Navigation from '@/components/Navigation';
import Hero from '@/components/Hero';
import AboutMe from '@/components/AboutMe';
import Timeline from '@/components/Timeline';
import Education from '@/components/Education';
import TechStack from '@/components/TechStack';
import ProjectsPreview from '@/components/ProjectsPreview';
import Footer from '@/components/Footer';
import ParticlesBackground from '@/components/ParticlesBackground';
import DevModeTerminal from '@/components/DevModeTerminal';
import FloatingDevModeButton from '@/components/FloatingDevModeButton';

const Index = () => {
  const [isDevMode, setIsDevMode] = useState(false);

  return (
    <div className="min-h-screen bg-background relative">
      <ParticlesBackground />
      <Navigation />
      <main className="relative z-10">
        <Hero onDevModeClick={() => setIsDevMode(true)} />
        <AboutMe />
        <Timeline />
        <Education />
        <TechStack />
        <ProjectsPreview />
      </main>
      <Footer />
      
      <DevModeTerminal 
        isOpen={isDevMode} 
        onClose={() => setIsDevMode(false)} 
      />
      
      <FloatingDevModeButton 
        onClick={() => setIsDevMode(true)} 
        isTerminalOpen={isDevMode}
      />
    </div>
  );
};

export default Index;
