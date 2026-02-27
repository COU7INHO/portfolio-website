import { useState } from 'react';
import Navigation from '@/components/Navigation';
import Hero from '@/components/Hero';
import AboutMe from '@/components/AboutMe';
import Timeline from '@/components/Timeline';
import Education from '@/components/Education';
import TechStack from '@/components/TechStack';
import ProjectsPreview from '@/components/ProjectsPreview';
import Contact from '@/components/Contact';
import Footer from '@/components/Footer';
import ParticlesBackground from '@/components/ParticlesBackground';
import DevModeTerminal from '@/components/DevModeTerminal';


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
        <Contact />
      </main>
      <Footer />
      
      <DevModeTerminal 
        isOpen={isDevMode} 
        onClose={() => setIsDevMode(false)} 
      />
      
    </div>
  );
};

export default Index;
