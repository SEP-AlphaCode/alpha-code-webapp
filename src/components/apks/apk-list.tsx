"use client";

import { useEffect, useState } from "react";
import { Download } from "lucide-react";
import { usePagedRobotApks, useFilePath } from "@/features/apks/hooks/use-robot-apk";
import { getUserInfoFromToken } from "@/utils/tokenUtils";
import type { RobotApk } from "@/types/robot-apk";
import LoadingState from "../loading-state";
import Image from "next/image";
import Link from "next/link";

export default function ApkList({ page = 1, size = 20, search = "" }: { page?: number; size?: number; search?: string }) {
  const [accountId, setAccountId] = useState<string | null>(null);
  useEffect(() => {
    if (typeof window === "undefined") return;
    const accessToken = sessionStorage.getItem("accessToken");
    if (accessToken) {
      const userInfo = getUserInfoFromToken(accessToken);
      setAccountId(userInfo?.id || null);
    }
  }, []);

  const { data, isLoading, error } = usePagedRobotApks(page, size, search);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <LoadingState />
      </div>
    );
  }

  const list = data?.data ?? [];

  return (
    <div className="grid gap-4">
      {error && (
        <div className="p-3 bg-red-50 text-red-700 border border-red-100 rounded">Lỗi khi tải danh sách APK: {(error as Error).message}</div>
      )}

      {list.length === 0 && !error && (
        <div className="flex flex-col items-center justify-center py-16 bg-white border rounded-lg text-center shadow-sm">
          <Image
            src="/collect.png"
            alt="Chưa có APK nào được phát hành"
            width={200}
            height={200}
            className="mb-6 opacity-90"
            priority={false}
          />
          <div className="text-xl font-semibold text-gray-800">Chưa có APK nào được phát hành</div>
          <div className="text-sm text-gray-500 mt-2 max-w-md">
            Vui lòng quay lại sau khi quản trị viên tải lên phiên bản mới cho robot của bạn.
          </div>
          <div className="mt-6 flex gap-3">
            <Link href="/" className="px-4 py-2 bg-rose-600 text-white rounded-md">Về trang chủ</Link>
            <Link href="/resources" className="px-4 py-2 border rounded-md text-sm">Xem tài nguyên khác</Link>
          </div>
        </div>
      )}

      {list.map((a) => (
        <ApkItem key={a.id} apk={a} accountId={accountId ?? undefined} />
      ))}
    </div>
  );
}

function ApkItem({ apk, accountId }: { apk: RobotApk; accountId?: string }) {
  const { data: filePath, isLoading: fileLoading } = useFilePath(apk.id, accountId);
  const href = filePath ?? `#/download/${apk.id}`;

  return (
    <div className="p-4 border rounded-lg flex items-start gap-4 bg-white">
      <div className="p-3 bg-gray-50 rounded-md">
        <Download className="w-6 h-6 text-rose-600" />
      </div>

      <div className="flex-1">
        <div className="flex items-start justify-between gap-4">
          <div>
            <div className="text-lg font-semibold">{apk.robotModelName || "(Không rõ model)"} — v{apk.version}</div>
            <div className="text-sm text-gray-600 mt-1">{apk.description}</div>
          </div>
          <div className="text-right text-sm text-gray-500">
            <div>{apk.createdDate ? new Date(apk.createdDate).toLocaleDateString() : ""}</div>
          </div>
        </div>

        <div className="mt-3 flex gap-2">
          <a
            href={href}
            className="inline-flex items-center gap-2 px-4 py-2 bg-rose-600 text-white rounded-md"
            download
          >
            {fileLoading ? "Chuẩn bị..." : "Tải xuống"}
          </a>
          <a href={href} className="px-4 py-2 border rounded-md text-sm">Xem tệp</a>
          <button className="px-4 py-2 border rounded-md text-sm">Chi tiết</button>
        </div>
      </div>
    </div>
  );
}
