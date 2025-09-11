import { Button } from "@/components/ui/button"
import Image from "next/image"
import Link from "next/link"
import { ArrowRight, LogOut, User } from "lucide-react"
import { LanguageSwitcher } from "@/components/language-switcher"
import { useHomepageTranslation } from "@/lib/i18n/hooks/use-translation"
import { useAuth } from "@/hooks/use-auth"
import { clearAuthData, getUserInfoFromToken } from "@/utils/tokenUtils"

interface HeaderProps {
  currentSection: number
  onNavigate: (sectionIndex: number) => void
}

export function Header({ currentSection, onNavigate }: HeaderProps) {
  const { tc, isLoading } = useHomepageTranslation()
  const { isAuthenticated, isLoading: authLoading } = useAuth()

  const handleLogout = () => {
    clearAuthData()
    // Dispatch custom event to update auth state
    window.dispatchEvent(new Event('authStateChange'))
    // Redirect to home page after logout
    window.location.href = '/'
  }

  const getUserInfo = () => {
    const accessToken = sessionStorage.getItem('accessToken')
    if (accessToken) {
      return getUserInfoFromToken(accessToken)
    }
    return null
  }

  if (isLoading || authLoading) {
    return (
      <header className="fixed top-0 left-0 w-full z-50 glass border-b border-gray-200/50 bg-white/80 backdrop-blur-md shadow-lg">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-40 h-10 flex items-center justify-center">
              <Image 
                src="/logo1.png" 
                alt="Alpha Mini Logo" 
                width={160} 
                height={40} 
                priority
                className="header-logo"
                style={{ filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.1))' }}
              />
            </div>
          </div>
          <div className="animate-pulse bg-gray-200 h-8 w-20 rounded"></div>
        </div>
      </header>
    )
  }
  return (
    <header
      className="fixed top-0 left-0 w-full z-50 glass border-b border-gray-200/50 shadow-lg transition-all duration-700 ease-out"
      style={{
        backdropFilter: `blur(${currentSection > 0 ? 24 : 8}px)`,
        backgroundColor: `rgba(255, 255, 255, ${currentSection > 0 ? 0.95 : 0.8})`,
      }}
    >
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-40 h-10 flex items-center justify-center">
            <Image 
              src="/logo1.png" 
              alt="Alpha Mini Logo" 
              width={160} 
              height={40} 
              priority
              className="header-logo"
              style={{ filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.1))' }}
            />
          </div>
        </div>

        <nav className="hidden md:flex items-center gap-8 text-sm font-medium">
          <button
            onClick={() => onNavigate(0)}
            className="text-gray-600 hover:text-blue-500 transition-colors duration-300"
          >
            {tc('navigation.home')}
          </button>
          <button
            onClick={() => onNavigate(1)}
            className="text-gray-600 hover:text-blue-500 transition-colors duration-300"
          >
            {tc('navigation.robot')}
          </button>
          <button
            onClick={() => onNavigate(2)}
            className="text-gray-600 hover:text-blue-500 transition-colors duration-300"
          >
            {tc('navigation.features')}
          </button>
          <button
            onClick={() => onNavigate(3)}
            className="text-gray-600 hover:text-blue-500 transition-colors duration-300"
          >
            {tc('navigation.about')}
          </button>
          <button
            onClick={() => onNavigate(4)}
            className="text-gray-600 hover:text-blue-500 transition-colors duration-300"
          >
            {tc('navigation.contact')}
          </button>
        </nav>

        <div className="flex items-center gap-4">
          <LanguageSwitcher variant="minimal" />
          {isAuthenticated ? (
            <div className="flex items-center gap-3">
              <div className="hidden sm:flex items-center gap-2 text-sm text-gray-600">
                <User className="w-4 h-4" />
                <span>{getUserInfo()?.fullName || getUserInfo()?.username || 'User'}</span>
              </div>
              <Button 
                onClick={handleLogout}
                variant="outline"
                className="flex items-center gap-2 px-4 py-2 rounded-full border-gray-300 hover:border-red-400 hover:text-red-500 transition-all duration-300"
              >
                <LogOut className="w-4 h-4" />
                <span className="hidden sm:inline">{tc('navigation.logout') || 'Logout'}</span>
              </Button>
            </div>
          ) : (
            <Link href="/login">
              <Button className="modern-button bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-full shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300 group">
                {tc('navigation.login')}
                <ArrowRight className="ml-2 w-4 h-4" />
              </Button>
            </Link>
          )}
        </div>
      </div>
    </header>
  )
}
