// File: app/error/page.jsx (hoặc page.tsx)

"use client";

import React from 'react';

export default function ErrorPage() {
  return (
    <div className="relative min-h-screen flex items-center justify-center">
  <video
    className="absolute top-0 left-0 w-full h-full object-cover z-0"
    autoPlay
    loop
    muted
    playsInline
  >
    <source src="/public/your-video.mp4" type="video/mp4" />
  </video>
  {/* Overlay nếu cần */}
  <div className="absolute inset-0 bg-black/20 z-10"></div>
  {/* Text content */}
  <div className="relative z-20 text-center text-white">
    <h1 className="text-4xl font-bold mb-4">Oops! Something went wrong</h1>
    <p className="text-lg mb-8">Trang bạn truy cập không tồn tại hoặc đã xảy ra lỗi hệ thống.</p>
    {/* ...nút hoặc nội dung khác... */}
  </div>
</div>
  );
}