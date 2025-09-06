import Image from "next/image"
import { Mail, Phone, MapPin, Github, Heart, Facebook, Instagram } from "lucide-react"
import { forwardRef } from "react"

interface FooterProps {
  currentSection: number
}

export const Footer = forwardRef<HTMLElement, FooterProps>(
  ({ currentSection }, ref) => {
    return (
      <footer
        ref={ref}
        id="contact"
        className="bg-gray-900 text-white py-12 sm:py-16 relative overflow-hidden"
      >
        {/* Background pattern */}
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-[linear-gradient(rgba(59,130,246,0.1)_1px,transparent_1px),linear-gradient(90deg,rgba(59,130,246,0.1)_1px,transparent_1px)] bg-[size:60px_60px]"></div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          {/* Main Footer Content */}
          <div 
            className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8 mb-8 sm:mb-12 transition-all duration-1000 ease-out ${
              currentSection >= 4 ? "opacity-100 translate-y-0" : "opacity-0 translate-y-12"
            }`}
          >
            {/* Brand Section */}
            <div className="sm:col-span-2 lg:col-span-2">
              <div className="flex items-center gap-3 mb-4 sm:mb-6">
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-blue-500 rounded-lg sm:rounded-xl flex items-center justify-center">
                  <Image src="/logo2.png" alt="Alpha Mini Logo" width={24} height={24} className="sm:w-8 sm:h-8 rounded-lg" />
                </div>
                <span className="text-xl sm:text-2xl font-bold">Alpha Code</span>
              </div>
              <p className="text-gray-300 mb-4 sm:mb-6 max-w-md leading-relaxed text-sm sm:text-base">
                Robot AI thông minh, đồng hành cùng bạn trong học tập, làm việc và sáng tạo. 
                Phát triển bởi đội ngũ SEP-AlphaCode với công nghệ tiên tiến nhất.
              </p>
              <div className="flex gap-3 sm:gap-4">
                <a href="#" className="w-8 h-8 sm:w-10 sm:h-10 bg-gray-800 rounded-lg flex items-center justify-center hover:bg-blue-500 transition-colors duration-300">
                  <Github className="w-4 h-4 sm:w-5 sm:h-5" />
                </a>
                <a href="#" className="w-8 h-8 sm:w-10 sm:h-10 bg-gray-800 rounded-lg flex items-center justify-center hover:bg-blue-500 transition-colors duration-300">
                  <Facebook className="w-4 h-4 sm:w-5 sm:h-5" />
                </a>
                <a href="#" className="w-8 h-8 sm:w-10 sm:h-10 bg-gray-800 rounded-lg flex items-center justify-center hover:bg-blue-500 transition-colors duration-300">
                  <Instagram className="w-4 h-4 sm:w-5 sm:h-5" />
                </a>
              </div>
            </div>

            {/* Quick Links */}
            <div>
              <h4 className="text-base sm:text-lg font-semibold mb-3 sm:mb-4">Liên kết nhanh</h4>
              <ul className="space-y-2 sm:space-y-3">
                <li><a href="#" className="text-gray-300 hover:text-blue-400 transition-colors text-sm sm:text-base">Tính năng</a></li>
                <li><a href="#about" className="text-gray-300 hover:text-blue-400 transition-colors text-sm sm:text-base">Giới thiệu</a></li>
                <li><a href="#" className="text-gray-300 hover:text-blue-400 transition-colors text-sm sm:text-base">Hướng dẫn</a></li>
                <li><a href="#" className="text-gray-300 hover:text-blue-400 transition-colors text-sm sm:text-base">Hỗ trợ</a></li>
              </ul>
            </div>

            {/* Contact Info */}
            <div>
              <h4 className="text-base sm:text-lg font-semibold mb-3 sm:mb-4">Liên hệ</h4>
              <ul className="space-y-2 sm:space-y-3">
                <li className="flex items-center gap-2 sm:gap-3">
                  <Mail className="w-3 h-3 sm:w-4 sm:h-4 text-blue-400 flex-shrink-0" />
                  <a href="mailto:alphacodeedu@gmail.com" className="text-gray-300 hover:text-blue-400 transition-colors text-xs sm:text-sm break-all">
                    alphacodeedu@gmail.com
                  </a>
                </li>
                <li className="flex items-center gap-2 sm:gap-3">
                  <Phone className="w-3 h-3 sm:w-4 sm:h-4 text-blue-400 flex-shrink-0" />
                  <span className="text-gray-300 text-xs sm:text-sm">+84 977 300 916</span>
                </li>
                <li className="flex items-start gap-2 sm:gap-3">
                  <MapPin className="w-3 h-3 sm:w-4 sm:h-4 text-blue-400 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-300 text-xs sm:text-sm leading-relaxed">Hồ Chí Minh, Việt Nam</span>
                </li>
              </ul>
            </div>
          </div>

          {/* Bottom Section */}
          <div 
            className={`border-t border-gray-800 pt-8 transition-all duration-1000 ease-out delay-300 ${
              currentSection >= 4 ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
            }`}
          >
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
              {/* Copyright */}
              <div className="flex items-center gap-2 text-gray-400 text-sm">
                <span>© 2025 Alpha Mini. Made with</span>
                <Heart className="w-4 h-4 text-red-500 fill-current" />
                <span>by AlphaCode</span>
              </div>

              {/* Legal Links */}
              <div className="flex gap-6 text-sm">
                <a href="#" className="text-gray-400 hover:text-blue-400 transition-colors">
                  Chính sách bảo mật
                </a>
                <a href="#" className="text-gray-400 hover:text-blue-400 transition-colors">
                  Điều khoản sử dụng
                </a>
                <a href="#" className="text-gray-400 hover:text-blue-400 transition-colors">
                  Cookie Policy
                </a>
              </div>
            </div>
          </div>
        </div>
      </footer>
    )
  }
)

Footer.displayName = "Footer"
