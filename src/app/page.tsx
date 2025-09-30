"use client"
import { useRef } from "react"
import { useScrollNavigation } from "@/hooks/use-scroll-navigation"
import { Header } from "@/components/home/header"
import { HeroSection } from "@/components/home/hero-section"
import { RobotSection } from "@/components/home/robot-section"
import { FeaturesSection } from "@/components/home/features-section"
import { AboutSection } from "@/components/home/about-section"
import { Footer } from "@/components/home/footer"
import { I18nLoadingBoundary } from "@/components/i18n-loading-boundary"

export default function Home() {
  const containerRef = useRef<HTMLDivElement>(null)
  const { currentSection, sections, isVisible, scrollToSection } = useScrollNavigation()

  return (
    <I18nLoadingBoundary>
      <div ref={containerRef} className="min-h-screen bg-white overflow-x-hidden relative scroll-auto">
        <Header currentSection={currentSection} onNavigate={scrollToSection} />
        
        <HeroSection 
          ref={sections[0].ref} 
          currentSection={currentSection} 
          isVisible={isVisible} 
        />
        
        <RobotSection 
          ref={sections[1].ref} 
          currentSection={currentSection} 
        />
        
        <FeaturesSection 
        ref={sections[2].ref} 
        currentSection={currentSection} 
        />
        
        <AboutSection 
          ref={sections[3].ref} 
          currentSection={currentSection} 
        />
        
        <Footer 
          ref={sections[4].ref} 
          currentSection={currentSection} 
        />
      </div>
    </I18nLoadingBoundary>
  )
}
