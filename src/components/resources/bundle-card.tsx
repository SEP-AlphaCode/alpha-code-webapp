"use client";

import { BookOpen } from "lucide-react";

export default function BundleCard() {
  return (
    <article className="p-6 border rounded-lg hover:shadow-lg transition bg-white">
      <div className="flex items-start gap-4">
        <div className="p-3 bg-blue-50 text-blue-600 rounded-lg">
          <BookOpen className="w-6 h-6" />
        </div>
        <div className="flex-1">
          <h3 className="text-2xl font-semibold">Gói học trọn bộ (Course Bundle)</h3>
          <p className="mt-2 text-gray-600">
            Lộ trình học tập đầy đủ được đóng gói theo cấp độ hoặc mục tiêu –
            tiết kiệm hơn so với mua từng khóa riêng lẻ. Phù hợp cho trường học,
            trung tâm hoặc học sinh muốn học chuyên sâu từ A-Z.
          </p>

          <ul className="mt-4 grid gap-2 text-sm text-gray-700">
            <li className="flex items-center gap-3">
              <span className="w-2 h-2 bg-blue-600 rounded-full" /> 
              Gói cấp độ (Beginner → Intermediate → Advanced)
            </li>
            <li className="flex items-center gap-3">
              <span className="w-2 h-2 bg-blue-600 rounded-full" /> 
              Kết hợp lý thuyết, thực hành trên robot & project cuối khóa
            </li>
            <li className="flex items-center gap-3">
              <span className="w-2 h-2 bg-blue-600 rounded-full" /> 
              Giảm giá khi mua theo combo – hỗ trợ tài liệu giảng dạy
            </li>
          </ul>

          <div className="mt-4 flex flex-wrap gap-2">
            <button className="px-4 py-2 bg-blue-600 text-white rounded-md text-sm">
              Xem gói học
            </button>
          </div>
        </div>
      </div>
    </article>
  );
}
