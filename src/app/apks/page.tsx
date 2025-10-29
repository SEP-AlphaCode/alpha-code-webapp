"use client";

import ApkList from "@/components/apks/apk-list";
import { Footer } from "@/components/home/footer";
import { Header } from "@/components/home/header";

export default function ApksPage() {
  return (
    <>
      <Header />
      <div className="max-w-5xl mx-auto px-6 py-12">
        <header className="mb-6">
          <h1 className="text-3xl font-bold">Tải xuống APK cho Robot</h1>
          <p className="mt-2 text-gray-600">Danh sách APK được phát hành cho từng model robot. Chọn phiên bản phù hợp với model của bạn và tải xuống.</p>
        </header>

        <main className="py-6">
          <ApkList />
        </main>
      </div>
      <Footer />
    </>

  );
}
