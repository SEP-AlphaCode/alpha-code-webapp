import Image from "next/image"
import { Star, Zap, Shield, Sparkles, ChevronDown } from "lucide-react"
import { forwardRef } from "react"
import { useHomepageTranslation } from "@/lib/i18n/hooks/use-translation"

interface RobotSectionProps {
  currentSection: number
}

export const RobotSection = forwardRef<HTMLElement, RobotSectionProps>(
  ({ currentSection }, ref) => {
    const { t, isLoading } = useHomepageTranslation()

    if (isLoading) {
      return (
        <section ref={ref} className="py-12 sm:py-16 md:py-20 lg:py-24 bg-white relative overflow-hidden min-h-screen flex items-center">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-8 sm:mb-10 md:mb-12">
              <div className="animate-pulse bg-gray-200 h-12 w-3/4 mx-auto rounded mb-4"></div>
              <div className="animate-pulse bg-gray-200 h-4 w-1/2 mx-auto rounded"></div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              {[1, 2, 3].map((i) => (
                <div key={i} className="animate-pulse bg-gray-200 h-64 rounded-xl"></div>
              ))}
            </div>
          </div>
        </section>
      )
    }
    return (
      <section
        ref={ref}
        className="py-12 sm:py-16 md:py-20 lg:py-24 bg-white relative overflow-hidden min-h-screen flex items-center"
      >
        {/* Background pattern */}
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-[linear-gradient(rgba(59,130,246,0.1)_1px,transparent_1px),linear-gradient(90deg,rgba(59,130,246,0.1)_1px,transparent_1px)] bg-[size:60px_60px]"></div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Section Header */}
          <div 
            className={`text-center mb-8 sm:mb-10 md:mb-12 transition-all duration-1000 ease-out ${
              currentSection >= 1 ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
            }`}
          >
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-3 leading-tight">
              {t('robot.title')}
              <span className="block bg-gradient-to-r from-blue-600 to-blue-700 bg-clip-text text-transparent py-1 leading-relaxed">
                {t('robot.titleHighlight')}
              </span>
            </h2>
            <p className="text-base sm:text-lg md:text-xl text-gray-600 max-w-2xl mx-auto px-4">
              {t('robot.subtitle')}
            </p>
          </div>

          {/* Robot Gallery - Compact Layout */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 items-center mb-8 sm:mb-10 md:mb-12">
            {/* Left Robot Image - Blue theme */}
            <div 
              className={`transition-all duration-1000 ease-out delay-200 ${
                currentSection >= 1 ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-20"
              }`}
            >
              <div className="group relative">
                <div className="relative overflow-hidden rounded-xl sm:rounded-2xl bg-gradient-to-br from-blue-100 to-blue-200 hover:from-blue-200 hover:to-blue-300 p-4 sm:p-6 shadow-lg hover:shadow-xl transition-all duration-500 transform hover:scale-105">
                  <div className="aspect-square w-full">
                    <Image
                      src="/alpha-mini-2.webp"
                      alt="Alpha Mini - Side View"
                      width={250}
                      height={250}
                      className="w-full h-full object-cover rounded-lg sm:rounded-xl"
                    />
                  </div>
                  {/* Feature badge */}
                  <div className="absolute top-2 sm:top-3 left-2 sm:left-3 bg-white/90 backdrop-blur-sm rounded-md sm:rounded-lg px-1.5 sm:px-2 py-1 shadow-md">
                    <div className="flex items-center gap-1">
                      <Shield className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-blue-600" />
                      <span className="text-xs font-medium text-gray-700 hidden sm:inline">{t('robot.badges.security')}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Center Robot Image (Main) - Purple theme */}
            <div 
              className={`transition-all duration-1000 ease-out delay-400 ${
                currentSection >= 1 ? "opacity-100 translate-y-0" : "opacity-0 translate-y-20"
              }`}
            >
              <div className="group relative">
                <div className="relative overflow-hidden rounded-xl sm:rounded-2xl bg-gradient-to-br from-purple-100 to-purple-200 hover:from-purple-200 hover:to-purple-300 p-4 sm:p-6 md:p-8 shadow-xl hover:shadow-2xl transition-all duration-500 transform hover:scale-105">
                  <div className="aspect-square w-full">
                    <Image
                      src="/alpha-smile.jpg"
                      alt="Alpha Mini Robot - Main"
                      width={300}
                      height={300}
                      className="w-full h-full object-cover rounded-lg sm:rounded-xl"
                    />
                  </div>
                  {/* Main feature */}
                  <div className="absolute bottom-2 sm:bottom-4 left-2 sm:left-4 right-2 sm:right-4">
                    <div className="bg-white/95 backdrop-blur-sm rounded-md sm:rounded-lg p-2 sm:p-3 shadow-md border border-gray-200">
                      <div className="flex items-center gap-1.5 sm:gap-2">
                        <div className="w-6 h-6 sm:w-8 sm:h-8 bg-purple-100 rounded-full flex items-center justify-center">
                          <Sparkles className="w-3 h-3 sm:w-4 sm:h-4 text-purple-600" />
                        </div>
                        <div>
                          <div className="font-semibold text-gray-900 text-xs sm:text-sm">Alpha Mini</div>
                          <div className="text-xs text-gray-600 hidden sm:block">{t('robot.badges.main')}</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                {/* Premium star badge - moves with hover */}
                <div className="absolute -top-3 -right-3 w-10 h-10 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full flex items-center justify-center shadow-lg z-10 transition-all duration-500 group-hover:scale-110 group-hover:rotate-12 group-hover:shadow-xl animate-pulse">
                  <Star className="w-5 h-5 text-white fill-current" />
                </div>
              </div>
            </div>

            {/* Right Robot Image - Green theme */}
            <div 
              className={`transition-all duration-1000 ease-out delay-600 ${
                currentSection >= 1 ? "opacity-100 translate-x-0" : "opacity-0 translate-x-20"
              }`}
            >
              <div className="group relative">
                <div className="relative overflow-hidden rounded-xl sm:rounded-2xl bg-gradient-to-br from-green-100 to-green-200 hover:from-green-200 hover:to-green-300 p-4 sm:p-6 shadow-lg hover:shadow-xl transition-all duration-500 transform hover:scale-105">
                  <div className="aspect-square w-full">
                    <Image
                      src="/alpha-hi.webp"
                      alt="Alpha Mini - Action View"
                      width={1000}
                      height={1000}
                      className="w-full h-full object-cover rounded-lg sm:rounded-xl"
                    />
                  </div>
                  {/* Feature badge */}
                  <div className="absolute top-2 sm:top-3 right-2 sm:right-3 bg-white/90 backdrop-blur-sm rounded-md sm:rounded-lg px-1.5 sm:px-2 py-1 shadow-md">
                    <div className="flex items-center gap-1">
                      <Zap className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-green-600" />
                      <span className="text-xs font-medium text-gray-700 hidden sm:inline">{t('robot.badges.interaction')}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Robot Features Grid - Compact */}
          <div 
            className={`grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6 transition-all duration-1000 ease-out delay-800 ${
              currentSection >= 1 ? "opacity-100 translate-y-0" : "opacity-0 translate-y-20"
            }`}
          >
            <div className="text-center group">
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-blue-100 rounded-lg sm:rounded-xl flex items-center justify-center mx-auto mb-2 sm:mb-3 group-hover:bg-blue-200 transition-colors duration-300">
                <Shield className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600" />
              </div>
              <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-1 sm:mb-2">{t('robot.features.security.title')}</h3>
              <p className="text-gray-600 text-xs sm:text-sm px-2">{t('robot.features.security.description')}</p>
            </div>
            <div className="text-center group">
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-purple-100 rounded-lg sm:rounded-xl flex items-center justify-center mx-auto mb-2 sm:mb-3 group-hover:bg-purple-200 transition-colors duration-300">
                <Sparkles className="w-5 h-5 sm:w-6 sm:h-6 text-purple-600" />
              </div>
              <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-1 sm:mb-2">{t('robot.features.ai.title')}</h3>
              <p className="text-gray-600 text-xs sm:text-sm px-2">{t('robot.features.ai.description')}</p>
            </div>
            <div className="text-center group sm:col-span-2 md:col-span-1">
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-green-100 rounded-lg sm:rounded-xl flex items-center justify-center mx-auto mb-2 sm:mb-3 group-hover:bg-green-200 transition-colors duration-300">
                <Zap className="w-5 h-5 sm:w-6 sm:h-6 text-green-600" />
              </div>
              <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-1 sm:mb-2">{t('robot.features.interaction.title')}</h3>
              <p className="text-gray-600 text-xs sm:text-sm px-2">{t('robot.features.interaction.description')}</p>
            </div>
          </div>
        </div>
      </section>
    )
  }
)

RobotSection.displayName = "RobotSection"
