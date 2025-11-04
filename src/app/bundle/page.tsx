// /app/bundles/page.tsx
"use client";

import React, { useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, ShoppingCart, CheckCircle, Package, Zap } from "lucide-react";
// Giả định Hooks và Types của Bundle có sẵn
import { useQuery } from "@tanstack/react-query";
import { getPagedBundles } from "@/features/bundle/api/bundle-api";
import { Bundle } from "@/types/bundle"; 
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Header } from "@/components/home/header";
import { Footer } from "@/components/home/footer";


const formatCurrency = (amount: number): string => {
  if (amount === 0) return "Miễn phí";
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  }).format(amount);
};

export default function BundleCatalogPage() {
  const [page, setPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const router = useRouter();

  // 🔄 Sử dụng Hook và API của Bundle
  const { data, isLoading, isError } = useQuery({
    queryKey: ["paged-bundles", page, searchTerm],
    queryFn: () => getPagedBundles(page, 10, searchTerm), // Giả định API này có sẵn
  });

  const bundles: Bundle[] = (data?.data || []);

  const handleViewDetail = (bundle: Bundle) => {
    // Chuyển hướng đến trang chi tiết Bundle
    router.push(`/bundles/${bundle.id}`);
  };

  return (
    <>
      <Header />
      <div className="space-y-8 p-10 max-w-7xl mx-auto" suppressHydrationWarning>
        {/* Header */}
        <div className="rounded-3xl border bg-gradient-to-br from-white to-indigo-50 p-8">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div>
              <h2 className="text-3xl font-bold tracking-tight">
                Gói Khóa Học (Bundles) Cao Cấp 🚀
              </h2>
              <p className="text-sm text-muted-foreground mt-1">
                Tiết kiệm hơn khi mua các khóa học theo gói chủ đề, đã được chọn lọc.
              </p>
            </div>
            <div className="flex items-center gap-2 text-sm text-indigo-700 bg-indigo-50 border border-indigo-200 px-3 py-2 rounded-md">
              <Package className="w-4 h-4" /> Mỗi Bundle là một giải pháp học tập toàn diện
            </div>
          </div>
        </div>

        {/* Tìm kiếm */}
        <div className="flex items-center space-x-4">
          <div className="relative w-full max-w-lg">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Tìm kiếm Bundle theo tên hoặc chủ đề..."
              className="pl-8 w-full"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        {/* Trạng thái tải */}
        {isLoading && (
          <div className="flex justify-center items-center py-10 text-muted-foreground">
            Đang tải dữ liệu Bundle...
          </div>
        )}

        {isError && (
          <div className="flex justify-center items-center py-10 text-red-500">
            Lỗi khi tải dữ liệu Bundles.
          </div>
        )}

        {/* Grid hiển thị Bundles */}
        {!isLoading && !isError && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {bundles.map((bundle) => {
              // Giả định trường statusText/coverImage có sẵn
              const isAvailable = bundle.statusText === "Available"; 

              return (
                <Card 
                  key={bundle.id} 
                  className={`flex flex-col h-full rounded-2xl hover:shadow-xl transition duration-300 cursor-pointer`}
                  onClick={() => handleViewDetail(bundle)}
                >
                  {/* Ảnh Cover (Làm nổi bật) */}
                  <div className="relative h-40 w-full overflow-hidden rounded-t-2xl">
                    <img 
                      src={bundle.coverImage} // Giả định trường này có sẵn
                      alt={bundle.name} 
                      className="w-full h-full object-cover transition duration-500 hover:scale-105" 
                    />
                    <span className="absolute top-2 right-2 bg-indigo-600 text-white text-xs font-bold px-3 py-1 rounded-full shadow-md">
                        {bundle.statusText || "Mới"}
                    </span>
                  </div>

                  <CardHeader className="pb-3 flex-1">
                    <CardTitle className="text-xl font-bold mt-1 line-clamp-2 text-gray-800">
                        {bundle.name}
                    </CardTitle>
                    <CardDescription className="mt-1 text-base font-bold text-red-600">
                        {formatCurrency(bundle.price)}
                    </CardDescription>
                  </CardHeader>
                  
                  <CardContent className="pt-0">
                    {/* Giữ lại nguy cơ XSS vì mô tả có thể chứa HTML */}
                    <div className="text-sm text-muted-foreground mb-4 line-clamp-3" dangerouslySetInnerHTML={{ __html: bundle.description || "Chưa có mô tả chi tiết." }} />

                    <div className="grid grid-cols-2 gap-2">
                      <Link href={`/bundles/${bundle.id}`} className="inline-block">
                        <Button variant="outline" className="w-full">Chi tiết</Button>
                      </Link>
                      
                      <Button onClick={(e) => { e.stopPropagation(); handleViewDetail(bundle); }} disabled={!isAvailable}>
                        <ShoppingCart className="mr-2 h-4 w-4" /> Mua ngay
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}

        {/* Phân trang đơn giản */}
        {/* ... (Giữ nguyên logic phân trang) */}
      </div>
      <Footer />
    </>
  );
}