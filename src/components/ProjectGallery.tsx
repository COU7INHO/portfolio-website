import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { X, ChevronLeft, ChevronRight, ZoomIn } from 'lucide-react';

interface ProjectGalleryProps {
  screenshots: string[];
  isOpen: boolean;
  onClose: () => void;
  initialIndex?: number;
}

export const ProjectGallery = ({ screenshots, isOpen, onClose, initialIndex = 0 }: ProjectGalleryProps) => {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);

  useEffect(() => {
    setCurrentIndex(initialIndex);
  }, [initialIndex]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowLeft') goToPrevious();
      if (e.key === 'ArrowRight') goToNext();
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, currentIndex]);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  const goToPrevious = () => {
    setCurrentIndex((prev) => (prev === 0 ? screenshots.length - 1 : prev - 1));
  };

  const goToNext = () => {
    setCurrentIndex((prev) => (prev === screenshots.length - 1 ? 0 : prev + 1));
  };

  if (!isOpen) return null;

  // Use portal to render at document.body level, ensuring it covers EVERYTHING
  const lightboxContent = (
    <div 
      className="fixed top-0 left-0 right-0 bottom-0 flex flex-col items-center justify-center"
      style={{ zIndex: 9999 }}
      onClick={onClose}
    >
      {/* Dark overlay - covers everything including navbar and page header */}
      <div className="absolute top-0 left-0 right-0 bottom-0 bg-black/95 backdrop-blur-sm" />
      
      {/* Close button */}
      <button
        onClick={onClose}
        className="absolute top-6 right-6 z-10 w-10 h-10 rounded-full bg-background/20 backdrop-blur-sm border border-border/50 flex items-center justify-center text-foreground hover:bg-primary/20 hover:border-primary/50 transition-all"
      >
        <X className="w-5 h-5" />
      </button>

      {/* Image container - centered slightly towards top */}
      <div 
        className="relative z-10 flex items-center justify-center mb-16"
        onClick={(e) => e.stopPropagation()}
      >
        <img
          src={screenshots[currentIndex]}
          alt={`Screenshot ${currentIndex + 1}`}
          className="rounded-lg shadow-2xl"
          style={{
            maxWidth: '90vw',
            maxHeight: '75vh',
            objectFit: 'contain',
          }}
        />

        {screenshots.length > 1 && (
          <>
            {/* Navigation arrows - positioned outside image */}
            <button
              onClick={goToPrevious}
              className="absolute -left-4 md:-left-14 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-background/80 backdrop-blur-sm border border-border flex items-center justify-center text-foreground hover:bg-primary/20 hover:border-primary/50 transition-all"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              onClick={goToNext}
              className="absolute -right-4 md:-right-14 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-background/80 backdrop-blur-sm border border-border flex items-center justify-center text-foreground hover:bg-primary/20 hover:border-primary/50 transition-all"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </>
        )}
      </div>

      {/* Bottom controls */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex flex-col items-center gap-3 z-10">
        {/* Dots indicator */}
        {screenshots.length > 1 && (
          <div className="flex gap-2">
            {screenshots.map((_, idx) => (
              <button
                key={idx}
                onClick={(e) => {
                  e.stopPropagation();
                  setCurrentIndex(idx);
                }}
                className={`w-2.5 h-2.5 rounded-full transition-all ${
                  idx === currentIndex 
                    ? 'bg-primary w-6' 
                    : 'bg-foreground/30 hover:bg-foreground/50'
                }`}
              />
            ))}
          </div>
        )}
        
        {/* Image counter */}
        <div className="text-sm text-muted-foreground">
          {currentIndex + 1} / {screenshots.length}
        </div>
      </div>
    </div>
  );

  return createPortal(lightboxContent, document.body);
};

interface ProjectImagePreviewProps {
  screenshots: string[];
  onOpenGallery: (index: number) => void;
}

export const ProjectImagePreview = ({ screenshots, onOpenGallery }: ProjectImagePreviewProps) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

  const goToPrevious = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentIndex((prev) => (prev === 0 ? screenshots.length - 1 : prev - 1));
  };

  const goToNext = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentIndex((prev) => (prev === screenshots.length - 1 ? 0 : prev + 1));
  };

  if (!screenshots || screenshots.length === 0) {
    return (
      <div 
        className="relative h-48 md:h-64 bg-gradient-to-br from-secondary to-muted flex items-center justify-center cursor-pointer"
        onClick={() => onOpenGallery(0)}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <div className="text-center">
          <div className="w-16 h-16 mx-auto mb-3 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center">
            <ZoomIn className="w-8 h-8 text-primary" />
          </div>
          <span className="text-muted-foreground text-sm">No screenshots available</span>
        </div>
      </div>
    );
  }

  return (
    <div 
      className="relative h-48 md:h-64 bg-gradient-to-br from-secondary to-muted overflow-hidden cursor-pointer"
      onClick={() => onOpenGallery(currentIndex)}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <img
        src={screenshots[currentIndex]}
        alt={`Screenshot ${currentIndex + 1}`}
        className={`w-full h-full object-cover object-top transition-transform duration-300 ${isHovered ? 'scale-105' : ''}`}
      />
      
      {/* Hover overlay with zoom hint - only shows when THIS element is hovered */}
      <div className={`absolute inset-0 transition-all duration-300 flex items-center justify-center ${isHovered ? 'bg-black/40' : 'bg-black/0'}`}>
        <div className={`transition-opacity duration-300 flex items-center gap-2 px-4 py-2 bg-background/80 backdrop-blur-sm rounded-lg border border-border ${isHovered ? 'opacity-100' : 'opacity-0'}`}>
          <ZoomIn className="w-4 h-4 text-primary" />
          <span className="text-sm text-foreground">Click to view gallery</span>
        </div>
      </div>

      {/* Gradient overlay at bottom */}
      <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-card to-transparent pointer-events-none" />

      {screenshots.length > 1 && (
        <>
          {/* Navigation arrows */}
          <button
            onClick={goToPrevious}
            className={`absolute left-3 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-background/80 backdrop-blur-sm border border-border flex items-center justify-center text-foreground hover:bg-primary/20 hover:border-primary/50 transition-all z-10 ${isHovered ? 'opacity-100' : 'opacity-0'}`}
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button
            onClick={goToNext}
            className={`absolute right-3 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-background/80 backdrop-blur-sm border border-border flex items-center justify-center text-foreground hover:bg-primary/20 hover:border-primary/50 transition-all z-10 ${isHovered ? 'opacity-100' : 'opacity-0'}`}
          >
            <ChevronRight className="w-4 h-4" />
          </button>

          {/* Dots indicator */}
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-1.5 z-10">
            {screenshots.map((_, idx) => (
              <button
                key={idx}
                onClick={(e) => {
                  e.stopPropagation();
                  setCurrentIndex(idx);
                }}
                className={`w-2 h-2 rounded-full transition-all ${
                  idx === currentIndex 
                    ? 'bg-primary w-4' 
                    : 'bg-foreground/30 hover:bg-foreground/50'
                }`}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
};
