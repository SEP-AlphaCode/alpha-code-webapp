"use client";

import { Download } from "lucide-react";
import Link from "next/link";

export default function ApkCard() {
  return (
    <article className="p-6 border rounded-xl hover:shadow-xl transition bg-white flex items-start gap-4">
      {/* Icon */}
      <div className="p-3 bg-rose-100 text-rose-600 rounded-xl shadow-sm">
        <Download className="w-6 h-6" />
      </div>

      {/* Content */}
      <div className="flex-1 space-y-3">
        <h3 className="text-xl font-bold">Ứng dụng Robot (APK)</h3>
        <p className="text-gray-600 text-sm leading-relaxed">
          Bộ sưu tập ứng dụng độc quyền được thiết kế dành riêng cho robot AlphaCode
          và các thiết bị Android tương thích. Khách hàng có thể tải và cài đặt để
          mở khóa các khả năng điều khiển, tương tác AI và học tập thông minh.
        </p>

        <Link
          href="/resources/apk"
          className="inline-block mt-2 px-4 py-2 bg-rose-600 text-white text-sm font-medium rounded-md hover:bg-rose-700 transition"
        >
          Khám phá danh sách APK →
        </Link>
      </div>
    </article>
  );
}
