"use client";

import { Puzzle } from "lucide-react";

export default function AddonCard() {
  return (
    <article className="p-6 border rounded-lg hover:shadow-lg transition bg-white">
      <div className="flex items-start gap-4">
        <div className="p-3 bg-emerald-50 text-emerald-600 rounded-lg">
          <Puzzle className="w-6 h-6" />
        </div>
        <div className="flex-1">
          <h3 className="text-2xl font-semibold">Add-ons nâng cao</h3>
          <p className="mt-2 text-gray-600">
            Mở rộng khả năng của robot với các gói tính năng đặc biệt như AI dạy học,
            nhận diện cảm xúc, phản hồi cảm xúc người dùng, nhảy theo nhạc hoặc phân tích hành vi học sinh.
          </p>

          <ul className="mt-4 grid gap-2 text-sm text-gray-700">
            <li className="flex items-center gap-3"><span className="w-2 h-2 bg-emerald-600 rounded-full" /> Addon dạy từ vựng AI</li>
            <li className="flex items-center gap-3"><span className="w-2 h-2 bg-emerald-600 rounded-full" /> Nhận diện cảm xúc học sinh</li>
            <li className="flex items-center gap-3"><span className="w-2 h-2 bg-emerald-600 rounded-full" /> Điểm danh bằng khuôn mặt</li>
          </ul>

          <div className="mt-4 flex gap-2">
            <button className="px-4 py-2 bg-emerald-600 text-white rounded-md text-sm">Khám phá Addon</button>
          </div>
        </div>
      </div>
    </article>
  );
}
