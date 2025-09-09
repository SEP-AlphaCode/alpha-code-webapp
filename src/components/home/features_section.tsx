import { Card, CardContent } from "@/components/ui/card"
import { Zap, Brain, Heart, Sparkles, ChevronDown } from "lucide-react"
import { forwardRef } from "react"
import { useHomepageTranslation } from "@/lib/i18n/hooks/use-translation"

interface FeaturesSectionProps {
  currentSection: number
}

export const FeaturesSection = forwardRef<HTMLElement, FeaturesSectionProps>(
  ({ currentSection }, ref) => {
    const { t, isLoading } = useHomepageTranslation()

    if (isLoading) {
      return (
        <section ref={ref} className="py-12 sm:py-16 md:py-20 lg:py-24 bg-gray-50 relative overflow-hidden min-h-screen flex items-center">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-8 sm:mb-10 md:mb-12">
              <div className="animate-pulse bg-gray-200 h-8 w-48 mx-auto rounded mb-4"></div>
              <div className="animate-pulse bg-gray-200 h-12 w-3/4 mx-auto rounded mb-4"></div>
              <div className="animate-pulse bg-gray-200 h-4 w-1/2 mx-auto rounded"></div>
            </div>
          </div>
        </section>
      )
    }

    const features = [
      {
        icon: Brain,
        title: t('features.list.ai.title'),
        description: t('features.list.ai.description'),
        color: "blue",
        bgColor: "bg-blue-100",
        iconColor: "text-blue-600",
        hoverColor: "hover:bg-blue-200"
      },
      {
        icon: Zap,
        title: t('features.list.speed.title'),
        description: t('features.list.speed.description'),
        color: "purple",
        bgColor: "bg-purple-100",
        iconColor: "text-purple-600",
        hoverColor: "hover:bg-purple-200"
      },
      {
        icon: Heart,
        title: t('features.list.interface.title'),
        description: t('features.list.interface.description'),
        color: "green",
        bgColor: "bg-green-100",
        iconColor: "text-green-600",
        hoverColor: "hover:bg-green-200"
      },
    ]

    return (
      <section
        ref={ref}
        id="features"
        className="py-12 sm:py-16 md:py-20 lg:py-24 bg-gradient-to-b from-white via-gray-50 to-blue-50 relative overflow-hidden min-h-screen flex items-center"
      >
        {/* Background pattern */}
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-[linear-gradient(rgba(59,130,246,0.1)_1px,transparent_1px),linear-gradient(90deg,rgba(59,130,246,0.1)_1px,transparent_1px)] bg-[size:60px_60px]"></div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          {/* Section Header */}
          <div
            className={`text-center mb-8 sm:mb-12 md:mb-16 transition-all duration-1000 ease-out ${currentSection >= 2 ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
              }`}
          >
            <div className="inline-flex items-center gap-2 px-3 sm:px-4 py-2 bg-blue-100 text-blue-700 rounded-full text-xs sm:text-sm font-semibold mb-4 sm:mb-6">
              <Sparkles className="w-3 h-3 sm:w-4 sm:h-4" />
              {t('features.badge')}
            </div>
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-3 sm:mb-4 leading-tight">
              {t('features.title')}
              <span className="block bg-gradient-to-r from-blue-600 to-blue-700 bg-clip-text text-transparent py-1 leading-relaxed">
                {t('features.titleHighlight')}
              </span>
            </h2>
            <p className="text-base sm:text-lg md:text-xl text-gray-600 max-w-3xl mx-auto px-4">
              {t('features.subtitle')}
            </p>
          </div>

          {/* Features Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 md:gap-8">
            {features.map((feature, index) => (
              <div
                key={index}
                className={`group transition-all duration-1000 ease-out ${currentSection >= 2 ? "opacity-100 translate-y-0" : "opacity-0 translate-y-20"
                  }`}
                style={{
                  transitionDelay: currentSection >= 2 ? `${index * 200}ms` : "0ms",
                }}
              >
                <Card className="bg-white border border-gray-200 rounded-2xl sm:rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:scale-105 hover:-translate-y-2 overflow-hidden h-full">
                  <CardContent className="p-4 sm:p-6 md:p-8 text-center h-full flex flex-col">
                    {/* Icon */}
                    <div className={`w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 mx-auto mb-4 sm:mb-6 rounded-xl sm:rounded-2xl ${feature.bgColor} ${feature.hoverColor} flex items-center justify-center transition-all duration-300 group-hover:scale-110 shrink-0`}>
                      <feature.icon className={`w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 ${feature.iconColor}`} />
                    </div>

                    {/* Title */}
                    <h3 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-900 mb-2 sm:mb-3 md:mb-4 group-hover:text-blue-600 transition-colors duration-300">
                      {feature.title}
                    </h3>

                    {/* Description */}
                    <p className="text-sm sm:text-base text-gray-600 leading-relaxed flex-grow">
                      {feature.description}
                    </p>

                    {/* Hover effect overlay */}
                    <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl sm:rounded-3xl"></div>
                  </CardContent>
                </Card>
              </div>
            ))}
          </div>
        </div>
        {/* Scroll Indicator */}
        <div className="absolute bottom-4 sm:bottom-6 md:bottom-8 left-1/2 transform -translate-x-1/2">
          <div className="flex flex-col items-center gap-1 sm:gap-2 animate-bounce">
            <span className="text-gray-500 text-xs sm:text-sm hidden sm:block">{t('features.scrollIndicator')}</span>
            <ChevronDown className="w-4 h-4 sm:w-5 sm:h-5 text-gray-500" />
          </div>
        </div>
      </section>
    )
  }
)

FeaturesSection.displayName = "FeaturesSection"
