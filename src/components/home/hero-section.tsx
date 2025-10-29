import { Button } from "@/components/ui/button"
import { ArrowRight, Play, ChevronDown, Sparkles, Zap, Star, Bot, Shield, Lightbulb } from "lucide-react"
import { forwardRef, useEffect, useRef, useState } from "react"


interface HeroSectionProps {
  currentSection: number
  isVisible: boolean
}

export const HeroSection = forwardRef<HTMLElement, HeroSectionProps>(
  ({  }, ref) => {
    const videoContainerRef = useRef<HTMLDivElement | null>(null)
    const videoElRef = useRef<HTMLVideoElement | null>(null)
    const [loadVideo, setLoadVideo] = useState(false)

    useEffect(() => {
      // Lazy-load the video only when the hero enters viewport to avoid heavy decoding during scroll
      if (!videoContainerRef.current) return

      const io = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              setLoadVideo(true)
              io.disconnect()
            }
          })
        },
        { threshold: 0.25 }
      )

      io.observe(videoContainerRef.current)

      return () => io.disconnect()
    }, [])

    // Pause video when page is hidden (save CPU) and resume when visible
    useEffect(() => {
      const onVisibility = () => {
        const v = videoElRef.current
        if (!v) return
        if (document.visibilityState === 'hidden') {
          try { v.pause() } catch {};
        } else {
          try { v.play().catch(() => {}) } catch {};
        }
      }
      document.addEventListener('visibilitychange', onVisibility)
      return () => document.removeEventListener('visibilitychange', onVisibility)
    }, [loadVideo])



    return (
      <section ref={ref} className="relative min-h-screen bg-gradient-to-b from-white via-gray-50 to-blue-50 overflow-hidden">
        {/* Clean Background Pattern */}
        <div className="absolute inset-0">
          {/* Grid pattern - made more visible */}
          <div className="absolute inset-0 bg-[linear-gradient(rgba(59,130,246,0.1)_1px,transparent_1px),linear-gradient(90deg,rgba(59,130,246,0.1)_1px,transparent_1px)] bg-[size:60px_60px]"></div>
        </div>

        {/* Main Container */}
        <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-10 md:gap-12 items-center min-h-screen py-12 sm:py-16 md:py-20">

            {/* Left Content */}
            <div data-aos="fade-right" data-aos-delay="100" className="space-y-6 sm:space-y-8">
              {/* Badge */}
              <div className="inline-flex items-center gap-2 px-3 sm:px-4 py-2 bg-blue-100 text-blue-700 rounded-full text-xs sm:text-sm font-semibold border border-blue-200">
                <Bot className="w-3 h-3 sm:w-4 sm:h-4" />
                <span className="hidden sm:inline">Công nghệ giáo dục thông minh</span>
                <span className="sm:hidden">Công nghệ giáo dục</span>
                <Sparkles className="w-3 h-3 sm:w-4 sm:h-4" />
              </div>

              {/* Main Heading */}
              <div className="space-y-3 sm:space-y-4">
                <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight">
                  Lập trình & điều khiển robot giáo dục
                  <span className="block bg-gradient-to-r from-blue-600 to-blue-700 bg-clip-text text-transparent py-1 leading-relaxed">
                    Khám phá Alpha Mini Code
                  </span>
                </h1>
              </div>

              {/* Subtitle */}
              <p className="text-base sm:text-lg md:text-xl text-gray-600 leading-relaxed max-w-lg">
                Nền tảng sáng tạo, an toàn và toàn diện cho giáo dục STEM với robot Alpha Mini.
              </p>

              {/* Features */}
              <div className="flex flex-wrap gap-2 sm:gap-3 md:gap-4">
                <div className="flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-2 bg-white border border-gray-200 rounded-full shadow-sm">
                  <Shield className="w-3 h-3 sm:w-4 sm:h-4 text-blue-600" />
                  <span className="text-xs sm:text-sm font-medium text-gray-700">Bảo mật & an toàn</span>
                </div>
                <div className="flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-2 bg-white border border-gray-200 rounded-full shadow-sm">
                  <Zap className="w-3 h-3 sm:w-4 sm:h-4 text-blue-600" />
                  <span className="text-xs sm:text-sm font-medium text-gray-700">Tương tác thông minh</span>
                </div>
                <div className="flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-2 bg-white border border-gray-200 rounded-full shadow-sm">
                  <Lightbulb className="w-3 h-3 sm:w-4 sm:h-4 text-blue-600" />
                  <span className="text-xs sm:text-sm font-medium text-gray-700">Học tập sáng tạo</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
                <Button 
                  className="bg-blue-600 hover:bg-blue-700 text-white px-6 sm:px-8 py-2.5 sm:py-3 rounded-lg sm:rounded-xl text-sm sm:text-base font-semibold shadow-lg hover:shadow-xl transition-all duration-300 group w-full sm:w-auto"
                >
                  <Star className="mr-2 w-4 h-4 sm:w-5 sm:h-5 group-hover:rotate-12 transition-transform" />
                  Bắt đầu ngay
                  <ArrowRight className="ml-2 w-4 h-4 sm:w-5 sm:h-5 group-hover:translate-x-1 transition-transform" />
                </Button>
                <Button
                  className="border-2 border-gray-300 bg-gray-150 text-gray-700 hover:bg-gray-50 hover:border-gray-400 px-6 sm:px-8 py-2.5 sm:py-3 rounded-lg sm:rounded-xl text-sm sm:text-base font-semibold group transition-all duration-300 w-full sm:w-auto"
                >
                  <Play className="mr-2 w-4 h-4 sm:w-5 sm:h-5 group-hover:scale-110 transition-transform" />
                  <span className="hidden sm:inline">Xem demo</span>
                  <span className="sm:hidden">Demo</span>
                </Button>
              </div>
            </div>

            {/* Right Content - Robot Image/Video */}
            <div data-aos="fade-left" data-aos-delay="300" className="relative mt-8 lg:mt-0">
              <div className="relative">
                {/* Robot Video/Image Container - Clean without overlays */}
                <div ref={videoContainerRef} className="relative z-10 bg-white rounded-2xl sm:rounded-3xl shadow-2xl overflow-hidden border border-gray-200" style={{transform: 'translateZ(0)'}}>
                    <div className="aspect-video">
                      {loadVideo ? (
                        <video
                          ref={videoElRef}
                          className="w-full h-full object-cover"
                          autoPlay
                          loop
                          muted
                          playsInline
                          preload="metadata"
                        >
                          <source src="/alpha-mini-home.mp4" type="video/mp4" />
                        </video>
                      ) : (
                        // Lightweight poster image until video is needed
                        <img src="/alpha-mini-home-poster.jpg" alt="Alpha Mini preview" className="w-full h-full object-cover" />
                      )}
                    </div>
                  </div>

                {/* Simple Alpha Mini info card below video */}
                <div className="mt-6 bg-white rounded-xl p-4 shadow-lg border border-gray-200">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                      <Bot className="w-6 h-6 text-blue-600" />
                    </div>
                    <div>
                      <div className="font-semibold text-gray-900">Alpha Mini</div>
                      <div className="text-sm text-gray-600">Robot giáo dục thông minh cho mọi lứa tuổi</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2">
          <div className="flex flex-col items-center gap-2 animate-bounce">
            <span className="text-gray-500 text-sm">Cuộn xuống để xem thêm</span>
            <ChevronDown className="w-5 h-5 text-gray-500" />
          </div>
        </div>
      </section>
    )
  }
)

HeroSection.displayName = "HeroSection"
