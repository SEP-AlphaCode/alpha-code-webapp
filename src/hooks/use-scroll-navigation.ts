import { useEffect, useState, useRef } from "react"

interface ScrollSection {
  id: string
  ref: React.RefObject<HTMLElement | null>
}

export function useScrollNavigation() {
  const [currentSection, setCurrentSection] = useState(0)
  const [isScrolling, setIsScrolling] = useState(false)
  const [isVisible, setIsVisible] = useState(false)

  const sections: ScrollSection[] = [
    { id: "hero", ref: useRef<HTMLElement>(null) },
    { id: "robot", ref: useRef<HTMLElement>(null) },
    { id: "features", ref: useRef<HTMLElement>(null) },
    { id: "about", ref: useRef<HTMLElement>(null) },
    { id: "contact", ref: useRef<HTMLElement>(null) },
  ]

  const scrollToSection = (sectionIndex: number) => {
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
  }

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
  }, [currentSection, isScrolling])

  return {
    currentSection,
    sections,
    isVisible,
    scrollToSection,
  }
}
