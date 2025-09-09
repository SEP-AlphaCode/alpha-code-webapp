import { useEffect, useState, useRef, useCallback, useMemo } from "react"

interface ScrollSection {
  id: string
  ref: React.RefObject<HTMLElement | null>
}

export function useScrollNavigation() {
  const [currentSection, setCurrentSection] = useState(0)
  const [isScrolling, setIsScrolling] = useState(false)
  const [isVisible, setIsVisible] = useState(false)

  // Create refs at the top level
  const heroRef = useRef<HTMLElement>(null)
  const robotRef = useRef<HTMLElement>(null)
  const featuresRef = useRef<HTMLElement>(null)
  const aboutRef = useRef<HTMLElement>(null)
  const contactRef = useRef<HTMLElement>(null)

  const sections: ScrollSection[] = useMemo(() => [
    { id: "hero", ref: heroRef },
    { id: "robot", ref: robotRef },
    { id: "features", ref: featuresRef },
    { id: "about", ref: aboutRef },
    { id: "contact", ref: contactRef },
  ], []) // Refs are stable, no dependencies needed

  const scrollToSection = useCallback((sectionIndex: number) => {
    if (sectionIndex >= 0 && sectionIndex < sections.length) {
      setCurrentSection(sectionIndex)
      const targetSection = sections[sectionIndex].ref.current
      if (targetSection) {
        targetSection.scrollIntoView({
          behavior: "smooth",
          block: "start",
        })
      }
    }
  }, [sections])

  useEffect(() => {
    const handleWheel = (e: WheelEvent) => {
      e.preventDefault()

      if (isScrolling) return

      const direction = e.deltaY > 0 ? 1 : -1
      const nextSection = Math.max(0, Math.min(sections.length - 1, currentSection + direction))

      if (nextSection !== currentSection) {
        setIsScrolling(true)
        scrollToSection(nextSection)
        setTimeout(() => setIsScrolling(false), 1000)
      }
    }

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowDown" || e.key === "PageDown") {
        e.preventDefault()
        const nextSection = Math.min(sections.length - 1, currentSection + 1)
        if (nextSection !== currentSection) {
          scrollToSection(nextSection)
        }
      } else if (e.key === "ArrowUp" || e.key === "PageUp") {
        e.preventDefault()
        const prevSection = Math.max(0, currentSection - 1)
        if (prevSection !== currentSection) {
          scrollToSection(prevSection)
        }
      }
    }

    const handleVisibility = () => setIsVisible(true)

    window.addEventListener("wheel", handleWheel, { passive: false })
    window.addEventListener("keydown", handleKeyDown)
    setTimeout(handleVisibility, 100)

    return () => {
      window.removeEventListener("wheel", handleWheel)
      window.removeEventListener("keydown", handleKeyDown)
    }
  }, [currentSection, isScrolling, scrollToSection, sections.length])

  return {
    currentSection,
    sections,
    isVisible,
    scrollToSection,
  }
}
