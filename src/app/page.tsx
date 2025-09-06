"use client"
import { useRef } from "react"
import { useScrollNavigation } from "@/hooks/use-scroll-navigation"
import { Header } from "@/components/home/header"
import { HeroSection } from "@/components/home/hero_section"
import { RobotSection } from "@/components/home/robot_section"
import { FeaturesSection } from "@/components/home/features_section"
import { AboutSection } from "@/components/home/about_section"
import { Footer } from "@/components/home/footer"

export default function Home() {
  const containerRef = useRef<HTMLDivElement>(null)
  const { currentSection, sections, isVisible, scrollToSection } = useScrollNavigation()

  return (
    <div ref={containerRef} className="min-h-screen bg-white overflow-x-hidden relative scroll-smooth">
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
  )
}
