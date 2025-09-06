import { Button } from "@/components/ui/button"
import Image from "next/image"
import { ArrowRight } from "lucide-react"

interface HeaderProps {
  currentSection: number
  onNavigate: (sectionIndex: number) => void
}

export function Header({ currentSection, onNavigate }: HeaderProps) {
  return (
    <header
      className="fixed top-0 left-0 w-full z-50 glass border-b border-gray-200/50 transition-all duration-700 ease-out"
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
              width={150} 
              height={150} 
              className="object-contain"
              style={{ filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.1))' }}
            />
          </div>
        </div>

        <nav className="hidden md:flex items-center gap-8 text-sm font-medium">
          <button
            onClick={() => onNavigate(2)}
            className="text-gray-600 hover:text-blue-500 transition-colors duration-300"
          >
            Tính năng
          </button>
          <button
            onClick={() => onNavigate(3)}
            className="text-gray-600 hover:text-blue-500 transition-colors duration-300"
          >
            Giới thiệu
          </button>
          <button
            onClick={() => onNavigate(4)}
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
  )
}
