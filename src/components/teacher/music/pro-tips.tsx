"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Sparkles } from "lucide-react"

export default function ProTips() {
  return (
    <Card className="mt-8 border-0 bg-white/70 backdrop-blur-sm shadow-lg hover:shadow-xl transition-all duration-300">
      <CardContent className="p-8">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 bg-gradient-to-r from-amber-400 to-orange-500 rounded-lg">
            <Sparkles className="w-5 h-5 text-white" />
          </div>
          <h3 className="text-xl font-bold text-gray-800">💡 Mẹo Hữu Ích</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <ul className="space-y-3 text-sm text-gray-600">
            <li className="flex items-start gap-2">
              <div className="w-1.5 h-1.5 bg-gray-500 rounded-full mt-2 flex-shrink-0"></div>
              <span>Kéo thả file trực tiếp vào vùng tải lên để truy cập nhanh</span>
            </li>
            <li className="flex items-start gap-2">
              <div className="w-1.5 h-1.5 bg-gray-500 rounded-full mt-2 flex-shrink-0"></div>
              <span>Hỗ trợ định dạng: MP3, WAV, M4A, FLAC và các định dạng âm thanh phổ biến khác</span>
            </li>
          </ul>
          <ul className="space-y-3 text-sm text-gray-600">
            <li className="flex items-start gap-2">
              <div className="w-1.5 h-1.5 bg-gray-500 rounded-full mt-2 flex-shrink-0"></div>
              <span>File được xử lý an toàn trong trình duyệt để bảo vệ hoàn toàn quyền riêng tư</span>
            </li>
            <li className="flex items-start gap-2">
              <div className="w-1.5 h-1.5 bg-gray-500 rounded-full mt-2 flex-shrink-0"></div>
              <span>Sử dụng khoảng thời gian để tạo vũ đạo tập trung cho phần nhạc cụ thể</span>
            </li>
          </ul>
        </div>
      </CardContent>
    </Card>
  )
}