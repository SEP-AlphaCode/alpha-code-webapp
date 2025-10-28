"use client";

import { Key } from "lucide-react";
import Link from "next/link";

export default function LicenseCard() {
  return (
    <article className="p-6 border rounded-2xl hover:shadow-lg transition-all bg-gradient-to-br from-white to-sky-50">
      <div className="flex items-start gap-4">
        {/* Icon */}
        <div className="p-3 bg-sky-100 text-sky-700 rounded-xl shadow-inner">
          <Key className="w-6 h-6" />
        </div>

        {/* Content */}
        <div className="flex-1 space-y-3">
          <h3 className="text-2xl font-semibold">License Key Cao Cấp</h3>

          <p className="text-gray-600 leading-relaxed">
            Mua <span className="font-semibold text-sky-700">một lần</span> — dùng{" "}
            <span className="font-semibold text-sky-700">trọn đời</span>. License
            này sẽ mở khóa tất cả tính năng nâng cao không có trong bản miễn phí,
            tối ưu khả năng AI và điều khiển robot của bạn. Phù hợp cho cá nhân
            hoặc doanh nghiệp muốn trải nghiệm đầy đủ sản phẩm AlphaCode.
          </p>

          {/* Actions */}
          <div className="flex items-center gap-3 mt-2">
            <Link
              href="/purchase/license"
              className="inline-block px-4 py-2 bg-sky-600 text-white rounded-md text-sm font-medium hover:bg-sky-700 transition"
            >
              Mua ngay — Trọn đời
            </Link>

            <Link
              href="/docs/license-faq"
              className="text-sm text-gray-600 hover:underline"
            >
              Xem chi tiết & hướng dẫn
            </Link>
          </div>
        </div>
      </div>
    </article>
  );
}
  