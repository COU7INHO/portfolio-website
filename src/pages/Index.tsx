import Navigation from '@/components/Navigation';
import Hero from '@/components/Hero';
import Timeline from '@/components/Timeline';
import TechStack from '@/components/TechStack';
import ProjectsPreview from '@/components/ProjectsPreview';
import Footer from '@/components/Footer';

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <main>
        <Hero />
        <Timeline />
        <TechStack />
        <ProjectsPreview />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
