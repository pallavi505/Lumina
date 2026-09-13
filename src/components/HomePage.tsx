import HeroSection from './HeroSection';
import LiveStatsBanner from './LiveStatsBanner';
import FeaturesShowcaseSection from './FeaturesShowcaseSection';
import AnnouncementBoard from './AnnouncementBoard';
import IgotPathwaysSection from './IgotPathwaysSection';
import Footer from './Footer';
import type { CourseItem } from '../types';

interface HomePageProps {
  onNavigateToLogin: () => void;
  onNavigateToDashboard?: () => void;
  onNavigateToExplore?: () => void;
  onSelectCourse?: (course: CourseItem) => void;
}

export default function HomePage({ onNavigateToLogin, onNavigateToDashboard, onNavigateToExplore, onSelectCourse }: HomePageProps) {
  const scrollToSection = (sectionId: string) => {
    const el = document.getElementById(sectionId);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="w-full flex flex-col items-center">
      {/* 1. Hero Section: Directs visitor to Portal Login to access dashboard */}
      <HeroSection 
        onGetStarted={onNavigateToLogin}
        onExplorePathways={() => scrollToSection('platform-features')}
      />

      {/* 2. Live Statistics Banner */}
      <LiveStatsBanner />

      {/* 3. Platform Capabilities & Features Showcase (Mentions & details features before login) */}
      <FeaturesShowcaseSection 
        onNavigateToLogin={onNavigateToLogin}
      />

      {/* 4. Public Announcement Board */}
      <AnnouncementBoard 
        onSelectCourse={onSelectCourse}
        onOpenAuth={onNavigateToLogin}
      />

      {/* 5. iGOT Pathways Section */}
      <IgotPathwaysSection 
        onSelectPathway={() => {
          onNavigateToLogin();
        }}
      />

      {/* 6. Institutional Footer */}
      <Footer 
        onNavigateHome={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        onNavigateLogin={onNavigateToLogin}
      />
    </div>
  );
}

