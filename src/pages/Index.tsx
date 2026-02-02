import Navigation from '@/components/Navigation';
import Hero from '@/components/Hero';
import AboutMe from '@/components/AboutMe';
import Timeline from '@/components/Timeline';
import Education from '@/components/Education';
import TechStack from '@/components/TechStack';
import ProjectsPreview from '@/components/ProjectsPreview';
import Footer from '@/components/Footer';
import ParticlesBackground from '@/components/ParticlesBackground';

const Index = () => {
  return (
    <div className="min-h-screen bg-background relative">
      <ParticlesBackground />
      <Navigation />
      <main className="relative z-10">
        <Hero />
        <AboutMe />
        <Timeline />
        <Education />
        <TechStack />
        <ProjectsPreview />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
