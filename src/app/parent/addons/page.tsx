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
import { Badge } from "@/components/ui/badge";
import { Search, ShoppingCart, CheckCircle, Zap } from "lucide-react";
import { useAddon } from "@/features/plan/hooks/use-addon";
import { Addon } from "@/types/addon";

const formatCurrency = (amount: number): string => {
  if (amount === 0) return "Miễn phí";
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  }).format(amount);
};

const subscribedAddons: string[] = ["52735256-ac03-45c6-95e1-baa8acf64440"];

export default function AddonsStore() {
  const [page, setPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");

  // 🧠 Gọi API qua hook React Query
  const { useGetPagedAddons } = useAddon();
  const { data, isLoading, isError } = useGetPagedAddons(page, 10, searchTerm);

  // Dữ liệu trả về từ API
  const addons: Addon[] = data?.data || [];

  return (
    <div className="space-y-8 p-10" suppressHydrationWarning>
      {/* Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">
          Thư viện Addons cho Robot 🤖
        </h2>
        <p className="text-sm text-muted-foreground mt-1 md:mt-0">
          Nâng cấp Alpha Mini với các tính năng mới và bài học chuyên sâu.
        </p>
      </div>

      {/* Tìm kiếm */}
      <div className="flex items-center space-x-4">
        <div className="relative w-full max-w-lg">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Tìm kiếm Addon theo tên hoặc danh mục..."
            className="pl-8 w-full"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* Trạng thái tải */}
      {isLoading && (
        <div className="flex justify-center items-center py-10 text-muted-foreground">
          Đang tải dữ liệu...
        </div>
      )}

      {isError && (
        <div className="flex justify-center items-center py-10 text-red-500">
          Lỗi khi tải dữ liệu Addons.
        </div>
      )}

      {/* Grid hiển thị Addons */}
      {!isLoading && !isError && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {addons.map((addon) => {
            const isSubscribed = subscribedAddons.includes(addon.id);

            return (
              <Card
                key={addon.id}
                className={`flex flex-col h-full ${
                  isSubscribed ? "border-2 border-green-500 shadow-lg" : ""
                }`}
              >
                <CardHeader className="flex-row items-center justify-between pb-3">
                  <div>
                    <CardTitle className="text-xl font-semibold">
                      {addon.name}
                    </CardTitle>
                    <CardDescription className="mt-1">
                      <Badge variant="secondary" className="mr-2">
                        {addon.categoryText}
                      </Badge>
                    </CardDescription>
                  </div>
                  <Zap className="h-8 w-8 text-primary/70" />
                </CardHeader>
                <CardContent className="flex-1 pt-2">
                  <p
                    className="text-sm text-muted-foreground mb-4 h-12 overflow-hidden"
                    dangerouslySetInnerHTML={{ __html: addon.description }}
                  />
                  <div className="text-2xl font-bold mb-4">
                    {formatCurrency(addon.price)}
                  </div>

                  {isSubscribed ? (
                    <Button
                      disabled
                      className="w-full bg-green-500 hover:bg-green-500/90 text-white"
                    >
                      <CheckCircle className="mr-2 h-4 w-4" />
                      Đã đăng ký
                    </Button>
                  ) : (
                    <Button className="w-full">
                      <ShoppingCart className="mr-2 h-4 w-4" />
                      {addon.price === 0
                        ? "Kích hoạt ngay"
                        : `Đăng ký (${formatCurrency(addon.price)})`}
                    </Button>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      {/* Phân trang đơn giản */}
      {!isLoading && data?.total_pages && data.total_pages > 1 && (
        <div className="flex justify-center items-center space-x-2 pt-6">
          <Button
            variant="outline"
            disabled={page <= 1}
            onClick={() => setPage((p) => p - 1)}
          >
            Trang trước
          </Button>
          <span className="text-sm text-muted-foreground">
            Trang {page} / {data?.total_pages}
          </span>
          <Button
            variant="outline"
            disabled={!data?.has_next}
            onClick={() => setPage((p) => p + 1)}
          >
            Trang sau
          </Button>
        </div>
      )}

      <div className="flex items-center justify-center text-sm text-muted-foreground pt-4">
        <p>Tổng cộng {data?.total_count || 0} Addon</p>
      </div>
    </div>
  );
}
