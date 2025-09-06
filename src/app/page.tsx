"use client"
import { useEffect, useState, useRef } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Image from "next/image"
import { ArrowRight, Zap, Brain, Heart, Star, Play, ChevronDown } from "lucide-react"

export default function Home() {
  const [currentSection, setCurrentSection] = useState(0)
  const [isScrolling, setIsScrolling] = useState(false)
  const [isVisible, setIsVisible] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)

  const sections = [
    { id: "hero", ref: useRef<HTMLElement>(null) },
    { id: "robot", ref: useRef<HTMLElement>(null) },
    { id: "features", ref: useRef<HTMLElement>(null) },
    { id: "about", ref: useRef<HTMLElement>(null) },
    { id: "contact", ref: useRef<HTMLElement>(null) },
  ]

  useEffect(() => {
    const handleWheel = (e: WheelEvent) => {
      e.preventDefault()

      if (isScrolling) return

      const direction = e.deltaY > 0 ? 1 : -1
      const nextSection = Math.max(0, Math.min(sections.length - 1, currentSection + direction))

      if (nextSection !== currentSection) {
        setIsScrolling(true)
        setCurrentSection(nextSection)

        const targetSection = sections[nextSection].ref.current
        if (targetSection) {
          targetSection.scrollIntoView({
            behavior: "smooth",
            block: "start",
          })
        }

        // Reset scrolling state after animation
        setTimeout(() => setIsScrolling(false), 1000)
      }
    }

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowDown" || e.key === "PageDown") {
        e.preventDefault()
        const nextSection = Math.min(sections.length - 1, currentSection + 1)
        if (nextSection !== currentSection) {
          setCurrentSection(nextSection)
          sections[nextSection].ref.current?.scrollIntoView({ behavior: "smooth", block: "start" })
        }
      } else if (e.key === "ArrowUp" || e.key === "PageUp") {
        e.preventDefault()
        const prevSection = Math.max(0, currentSection - 1)
        if (prevSection !== currentSection) {
          setCurrentSection(prevSection)
          sections[prevSection].ref.current?.scrollIntoView({ behavior: "smooth", block: "start" })
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
  }, [currentSection, isScrolling]) // Removed sections from dependencies

  return (
    <div ref={containerRef} className="min-h-screen bg-white overflow-x-hidden relative scroll-smooth">
      <header
        className="fixed top-0 left-0 w-full z-50 glass border-b border-gray-200/50 transition-all duration-700 ease-out"
        style={{
          backdropFilter: `blur(${currentSection > 0 ? 24 : 8}px)`,
          backgroundColor: `rgba(255, 255, 255, ${currentSection > 0 ? 0.95 : 0.8})`,
        }}
      >
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Image src="/logo2.png" alt="Alpha Mini Logo" width={48} height={48} className="rounded-xl shadow-lg" />
            <span className="text-2xl font-black text-gray-800">Alpha Mini</span>
          </div>

          <nav className="hidden md:flex items-center gap-8 text-sm font-medium">
            <button
              onClick={() => {
                setCurrentSection(2)
                sections[2].ref.current?.scrollIntoView({ behavior: "smooth" })
              }}
              className="text-gray-600 hover:text-blue-500 transition-colors duration-300"
            >
              Tính năng
            </button>
            <button
              onClick={() => {
                setCurrentSection(3)
                sections[3].ref.current?.scrollIntoView({ behavior: "smooth" })
              }}
              className="text-gray-600 hover:text-blue-500 transition-colors duration-300"
            >
              Giới thiệu
            </button>
            <button
              onClick={() => {
                setCurrentSection(4)
                sections[4].ref.current?.scrollIntoView({ behavior: "smooth" })
              }}
              className="text-gray-600 hover:text-blue-500 transition-colors duration-300"
            >
              Liên hệ
            </button>
          </nav>

          <Button className="modern-button bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-full shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300 group">
            Bắt đầu
            <ArrowRight className="ml-2 w-4 h-4" />
          </Button>
        </div>
      </header>

      <section ref={sections[0].ref} className="relative min-h-screen flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0">
          <video
            className="w-full h-full object-cover transition-all duration-1000 ease-out"
            autoPlay
            loop
            muted
            playsInline
            style={{
              transform: `scale(${currentSection === 0 ? 1 : 1.1})`,
              filter: `brightness(${currentSection === 0 ? 0.8 : 0.4})`,
            }}
          >
            <source src="/alpha-mini-home.mp4" type="video/mp4" />
          </video>
          <div
            className="absolute inset-0 bg-gradient-to-br from-white/70 via-white/50 to-blue-500/10 transition-opacity duration-1000"
            style={{ opacity: currentSection === 0 ? 0.5 : 0.8 }}
          ></div>
        </div>

        <div
          className={`relative z-20 text-center max-w-5xl mx-auto px-6 transition-all duration-1000 ease-out ${
            isVisible && currentSection === 0 ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
          }`}
        >
          <div className="mb-6">
            <span className="inline-block px-4 py-2 bg-blue-500 text-white rounded-full text-sm font-medium border border-blue-400/30 backdrop-blur-sm shadow-lg">
              🚀 Công nghệ AI tiên tiến nhất
            </span>
          </div>

          <h1 className="text-6xl md:text-8xl font-black text-balance mb-8 leading-tight text-gray-800">
            Khám phá{" "}
            <span className="bg-gradient-to-r from-blue-500 to-blue-600 bg-clip-text text-transparent">
              Robot Alpha Mini
            </span>
          </h1>

          <p className="text-xl md:text-2xl text-gray-600 mb-12 max-w-3xl mx-auto text-balance font-medium">
            Trợ lý AI nhỏ gọn, thông minh, hỗ trợ mọi công việc và học tập của bạn với công nghệ tiên tiến nhất.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16">
            <Button className="modern-button bg-blue-500 hover:bg-blue-600 text-white px-8 py-4 rounded-full text-lg font-bold shadow-xl hover:shadow-2xl hover:scale-105 transition-all duration-300 group">
              Dùng thử miễn phí
              <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Button>
            <Button
              variant="outline"
              className="modern-button border-2 border-blue-400/30 text-gray-800 hover:bg-blue-50 px-8 py-4 rounded-full text-lg font-bold backdrop-blur-sm group bg-white/80"
            >
              <Play className="mr-2 w-5 h-5 group-hover:scale-110 transition-transform" />
              Xem demo
            </Button>
          </div>

          <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
            <ChevronDown className="w-6 h-6 text-gray-500" />
          </div>
        </div>
      </section>

      <section
        ref={sections[1].ref}
        className="py-24 bg-gray-50 relative overflow-hidden min-h-screen flex items-center"
      >
        <div className="max-w-4xl mx-auto px-6 text-center">
          <div
            className={`transition-all duration-1200 ease-out ${
              currentSection >= 1 ? "opacity-100 translate-y-0" : "opacity-0 translate-y-20"
            }`}
          >
            <div className="relative inline-block">
              <Image
                src="/alpha-mini-2.webp"
                alt="Alpha Mini Robot"
                width={400}
                height={400}
                className="rounded-3xl shadow-2xl border border-gray-200 animate-float"
              />
              <div className="absolute -top-4 -right-4 w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center animate-pulse">
                <Star className="w-4 h-4 text-white fill-current" />
              </div>
            </div>
          </div>
        </div>
      </section>

      <section
        ref={sections[2].ref}
        id="features"
        className="py-32 bg-white relative overflow-hidden min-h-screen flex items-center"
      >
        <div className="max-w-7xl mx-auto px-6">
          <div
            className={`text-center mb-20 transition-all duration-1000 ease-out ${
              currentSection >= 2 ? "opacity-100 translate-y-0" : "opacity-0 translate-y-16"
            }`}
          >
            <h2 className="text-5xl md:text-6xl font-black text-gray-800 mb-6 text-balance">
              Tính năng{" "}
              <span className="bg-gradient-to-r from-blue-500 to-blue-600 bg-clip-text text-transparent">nổi bật</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto text-balance">
              Khám phá những khả năng đặc biệt của Alpha Mini
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: Zap,
                title: "Xử lý siêu tốc",
                description:
                  "Phản hồi nhanh chóng, tiết kiệm thời gian, tối ưu hiệu suất công việc với công nghệ AI tiên tiến.",
                gradient: "from-yellow-400 to-orange-500",
              },
              {
                icon: Brain,
                title: "AI thông minh",
                description: "Hiểu ngữ cảnh, ý định, trả lời chính xác và hỗ trợ đa dạng lĩnh vực một cách thông minh.",
                gradient: "from-blue-400 to-blue-600",
              },
              {
                icon: Heart,
                title: "Giao diện thân thiện",
                description:
                  "Thiết kế tối giản, dễ sử dụng, phù hợp mọi đối tượng người dùng với trải nghiệm tuyệt vời.",
                gradient: "from-pink-400 to-red-500",
              },
            ].map((feature, index) => (
              <Card
                key={index}
                className={`group bg-white border-gray-200 hover:border-blue-300 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-700 hover:scale-105 hover:-translate-y-2 ${
                  currentSection >= 2 ? "opacity-100 translate-y-0" : "opacity-0 translate-y-12"
                }`}
                style={{
                  transitionDelay: currentSection >= 2 ? `${index * 150}ms` : "0ms",
                }}
              >
                <CardContent className="p-8 text-center">
                  <div
                    className={`w-16 h-16 mx-auto mb-6 rounded-2xl bg-gradient-to-br ${feature.gradient} flex items-center justify-center shadow-lg group-hover:shadow-xl group-hover:scale-110 transition-all duration-300`}
                  >
                    <feature.icon className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-2xl font-black text-gray-800 mb-4 group-hover:text-blue-500 transition-colors">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600 leading-relaxed text-balance">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section
        ref={sections[3].ref}
        id="about"
        className="py-32 bg-gray-50 relative overflow-hidden min-h-screen flex items-center"
      >
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div
              className={`transition-all duration-1000 ease-out ${
                currentSection >= 3 ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-16"
              }`}
            >
              <h2 className="text-5xl md:text-6xl font-black text-gray-800 mb-8 text-balance">
                Giới thiệu về{" "}
                <span className="bg-gradient-to-r from-blue-500 to-blue-600 bg-clip-text text-transparent">
                  Alpha Mini
                </span>
              </h2>
              <p className="text-lg text-gray-600 mb-8 leading-relaxed">
                Alpha Mini là robot AI nhỏ gọn, được phát triển bởi đội ngũ SEP-AlphaCode, tích hợp công nghệ trí tuệ
                nhân tạo hiện đại, giúp bạn giải quyết công việc, học tập và sáng tạo hiệu quả hơn.
              </p>

              <div className="space-y-4 mb-10">
                {[
                  "Trả lời câu hỏi, hỗ trợ học tập, giải quyết vấn đề nhanh chóng",
                  "Phân tích dữ liệu, hỗ trợ viết nội dung, sáng tạo ý tưởng",
                  "Kết nối dễ dàng với các thiết bị thông minh khác",
                ].map((item, index) => (
                  <div
                    key={index}
                    className={`flex items-start gap-3 transition-all duration-700 ease-out ${
                      currentSection >= 3 ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-8"
                    }`}
                    style={{
                      transitionDelay: currentSection >= 3 ? `${300 + index * 100}ms` : "0ms",
                    }}
                  >
                    <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      <div className="w-2 h-2 bg-white rounded-full"></div>
                    </div>
                    <p className="text-gray-800 font-medium">{item}</p>
                  </div>
                ))}
              </div>

              <Button className="modern-button bg-blue-500 hover:bg-blue-600 text-white px-8 py-4 rounded-full text-lg font-bold shadow-xl hover:shadow-2xl hover:scale-105 transition-all duration-300 group">
                Khám phá thêm
                <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Button>
            </div>

            <div
              className={`flex justify-center transition-all duration-1000 ease-out ${
                currentSection >= 3 ? "opacity-100 translate-x-0" : "opacity-0 translate-x-16"
              }`}
            >
              <div className="relative">
                <div className="w-80 h-80 bg-gradient-to-br from-blue-100 to-gray-100 rounded-3xl shadow-2xl flex items-center justify-center backdrop-blur-sm border border-blue-200 animate-float">
                  <Image src="/logo1.png" alt="Alpha Mini Code Logo" width={200} height={200} className="opacity-90" />
                </div>
                <div className="absolute -top-6 -right-6 w-12 h-12 bg-blue-500 rounded-2xl flex items-center justify-center shadow-lg animate-pulse">
                  <Zap className="w-6 h-6 text-white" />
                </div>
                <div
                  className="absolute -bottom-6 -left-6 w-12 h-12 bg-gray-600 rounded-2xl flex items-center justify-center shadow-lg animate-pulse"
                  style={{ animationDelay: "1s" }}
                >
                  <Brain className="w-6 h-6 text-white" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <footer
        ref={sections[4].ref}
        id="contact"
        className="bg-gray-800 text-white py-16 relative overflow-hidden min-h-screen flex items-center"
      >
        <div className="max-w-7xl mx-auto px-6 w-full">
          <div
            className={`text-center mb-12 transition-all duration-1000 ease-out ${
              currentSection >= 4 ? "opacity-100 translate-y-0" : "opacity-0 translate-y-12"
            }`}
          >
            <div className="flex items-center justify-center gap-3 mb-6">
              <Image src="/logo2.png" alt="Alpha Mini Logo" width={48} height={48} className="rounded-xl shadow-lg" />
              <span className="text-3xl font-black">Alpha Mini</span>
            </div>
            <p className="text-gray-300 text-lg mb-8 max-w-2xl mx-auto">
              © 2025 Alpha Mini. Phát triển bởi SEP-AlphaCode.
              <br />
              Mọi thông tin liên hệ:{" "}
              <a
                href="mailto:support@alphamini.vn"
                className="text-blue-400 hover:text-blue-300 transition-colors underline"
              >
                support@alphamini.vn
              </a>
            </p>

            <div className="flex flex-wrap justify-center gap-8 text-sm">
              <a href="#" className="text-gray-300 hover:text-blue-400 transition-colors">
                Chính sách bảo mật
              </a>
              <a href="#" className="text-gray-300 hover:text-blue-400 transition-colors">
                Điều khoản sử dụng
              </a>
              <a href="#" className="text-gray-300 hover:text-blue-400 transition-colors">
                Liên hệ
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
