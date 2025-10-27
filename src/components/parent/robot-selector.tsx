"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import imageFallback from "../../../public/img_fallback.png";
import { useRobot } from "@/features/robots/hooks/use-robot";
import { useRobotInfo } from "@/features/robots/hooks/use-robot-info";
import { getUserIdFromToken } from "@/utils/tokenUtils";
import { useRobotStore } from "@/hooks/use-robot-store";
import { RobotModal } from "@/app/admin/robots/robot-modal";
import { Battery, Zap, WifiOff, Wifi } from "lucide-react";

interface RobotSelectorProps {
  className?: string;
}

export function RobotSelector({ className = "" }: RobotSelectorProps) {
  const [accountId, setAccountId] = useState<string>("");
  const [isModalOpen, setIsModalOpen] = useState(false);

  const {
    robots,
    selectedRobotSerial,
    selectRobot,
    addRobot,
    updateRobotStatus,
    updateRobotBattery,
    connectMode,
  } = useRobotStore();

  const isMultiMode =
    connectMode === "multi" ||
    (Array.isArray(selectedRobotSerial) && selectedRobotSerial.length > 1);

  // Lấy accountId từ token
  useEffect(() => {
    // Sửa lỗi tham chiếu window khi server-side rendering
    const token = typeof window !== 'undefined' ? sessionStorage.getItem("accessToken") : null;
    if (token) {
      const userId = getUserIdFromToken(token);
      if (userId) setAccountId(userId);
    }
  }, []);

  // Lấy robots từ API
  const { useGetRobotsByAccountId } = useRobot();
  const { data: robotsResponse, isLoading, error } = useGetRobotsByAccountId(accountId);
  const robotsApi = robotsResponse?.data || [];

  // Add robots vào Redux store
  useEffect(() => {
    robotsApi.forEach((r) => {
      // Đảm bảo pin là string/null khi add vào store
      const batteryLevel = r.battery;
      if (r.accountId === accountId) {

        addRobot({
          id: r.id,
          serial: r.serialNumber,
          name: r.robotModelName || "Unknown Robot",
          status: r.status === 1 ? "online" : "offline",
          battery: batteryLevel,
          robotModelId: r.robotModelId,
          robotModelName: r.robotModelName,
          accountId: r.accountId,
        });
      }
    });
  }, [robotsApi, addRobot, accountId]);

  // Chọn robot đầu tiên nếu chưa chọn
  useEffect(() => {
  if (typeof window !== "undefined") {
    const savedSerial = localStorage.getItem("selectedRobotSerial");
    if (savedSerial && robotsApi.some(r => r.serialNumber === savedSerial)) {
      selectRobot(savedSerial);
    }
  }
}, [robotsApi, selectRobot]);

  // Poll status & battery cho tất cả robot
  const { useGetMultipleRobotInfo } = useRobotInfo();
  const robotInfos = useGetMultipleRobotInfo(
    robots.map((r) => r.serial),
    3, // ✅ ĐIỀU CHỈNH: Giảm Polling Interval xuống 3 giây
    { enabled: robots.length > 0 }
  );

  // Cập nhật Redux store theo poll
  useEffect(() => {
    robotInfos.forEach((info) => {
      const apiData = info.data?.data;
      const apiStatus = info.data?.status;
      const apiMessage = info.data?.message;

      const existing = robots.find((r) => r.serial === info.serial);
      if (!existing) return;

      let newStatus = existing.status;
      let newBattery = existing.battery; // Redux store lưu string/null

      // 1. Logic OFFLINE: Khi API báo lỗi nội bộ hoặc không có dữ liệu
      if (!info.data || apiStatus === "error") {
        let isOffline = false;

        // Kiểm tra message chỉ ra lỗi kết nối
        if (apiMessage && apiMessage.includes("not connected via WebSocket")) {
          isOffline = true;
        } else if (apiData && Object.keys(apiData).length === 0) {
          isOffline = true;
        }

        if (isOffline) {
          newStatus = "offline";
        }
      } else {
        // 2. Logic ONLINE / CHARGING 
        // const data = apiData; // 🛑 Lỗi có thể xảy ra ở đây nếu apiData chưa được chắc chắn tồn tại

        const data = apiData;

        // ✅ THÊM KIỂM TRA RÕ RÀNG
        if (!data) {
          // Nếu info.data tồn tại nhưng data bên trong lại là null/undefined (không mong muốn)
          newStatus = "offline";
        } else {
          // ✅ Lúc này, TypeScript biết 'data' chắc chắn là RobotInfo
          // Cập nhật trạng thái
          newStatus = data.is_charging ? "charging" : "online";

          // Cập nhật pin
          if (data.battery_level != null) {
            newBattery = String(data.battery_level);
          }
        }
      }

      // Cập nhật trạng thái chỉ khi có thay đổi
      if (existing.status !== newStatus) {
        updateRobotStatus(info.serial, newStatus);
      }

      // Cập nhật pin chỉ khi có thay đổi (kích hoạt re-render)
      if (existing.battery !== newBattery && newBattery != null) {
        updateRobotBattery(info.serial, newBattery);
      }
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [robotInfos]);

  const handleRobotSelect = (serial: string) => {
  selectRobot(serial);
  if (typeof window !== "undefined") {
    localStorage.setItem("selectedRobotSerial", serial);
  }
};

  // Render display robot
  const displayRobots = robots
    .filter((r) => r.accountId === accountId)
    .map((r) => ({
      ...r,
      avatar:
        r.status === "online" || r.status === "charging"
          ? "/img_top_alphamini_connect.webp"
          : "/img_top_alphamini_disconnect.webp",
    }));


  const selectedSerials = Array.isArray(selectedRobotSerial)
    ? selectedRobotSerial
    : selectedRobotSerial
      ? [selectedRobotSerial]
      : [];

  const selectedRobots = displayRobots.filter((r) => selectedSerials.includes(r.serial));

  const displayName =
    selectedRobots.length === 0
      ? "Chưa có robot nào"
      : isMultiMode
        ? `${selectedRobots.length} robots được chọn`
        : selectedRobots[0].name;

  const displayAvatar =
    isMultiMode && selectedRobots.length > 1
      ? "/img_action_introduction.png"
      : selectedRobots[0]?.avatar ?? "/img_top_alphamini_disconnect.webp";

  if (isLoading) {
    return (
      <div className={`flex items-center px-2 py-1 rounded-xl shadow border border-gray-100 bg-gray-50 min-w-[260px] ${className}`}>
        <div className="text-gray-500 text-sm">Đang tải robots...</div>
      </div>
    );
  }

  if (error || displayRobots.length === 0) {
    return (
      <div
        className={`flex items-center justify-between px-3 py-2 rounded-xl shadow border border-gray-100 bg-blue-50 hover:bg-blue-100 transition-colors min-w-[260px] ${className}`}
      >
        <div className="flex flex-col justify-center">
          <span className="font-semibold text-gray-900 text-sm">Chưa có robot nào</span>
          <span className="text-xs text-gray-500 mt-0.5">Hãy thêm robot để bắt đầu</span>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="ml-3 px-3 py-1.5 text-sm font-medium rounded-md bg-blue-600 text-white hover:bg-blue-700 transition"
        >
          Thêm mới
        </button>

        <RobotModal open={isModalOpen} onClose={() => setIsModalOpen(false)} />
      </div>
    )
  }

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button
            className={`flex items-center px-3 py-2 rounded-xl shadow border border-gray-100 bg-blue-50 hover:bg-blue-100 transition-colors focus:outline-none min-w-[260px] ${className}`}
          >
            <Image src={displayAvatar} alt="AlphaMini" width={50} height={50} className="object-cover object-top rounded-lg" />
            <div className="flex flex-col justify-center ml-3 leading-tight text-left">
              <span className="font-semibold text-base text-gray-900">{displayName}</span>
              <span className="text-xs text-gray-500 font-mono tracking-wide mt-0.5">
                {isMultiMode ? "Multi mode" : selectedRobots[0]?.serial ?? ""}
              </span>
            </div>
          </button>
        </DropdownMenuTrigger>

        <DropdownMenuContent className="w-80" side="bottom" align="end" sideOffset={8} forceMount>
          <DropdownMenuLabel className="font-semibold text-base mb-2">
            {isMultiMode ? "Chọn nhiều Robot" : "Chọn Robot"}
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuGroup>
            {displayRobots.map((robot) => {
              const isSelected = selectedSerials.includes(robot.serial);
              return (
                <DropdownMenuItem
                  key={robot.id}
                  onClick={() => handleRobotSelect(robot.serial)}
                  className={`flex items-center gap-3 py-2 px-2 rounded-lg cursor-pointer ${isSelected ? "bg-blue-50" : ""}`}
                >
                  <Avatar className="h-9 w-9 rounded-none overflow-hidden">
                    <AvatarImage src={robot.avatar} alt={robot.name} />
                    <AvatarFallback>
                      <Image src={imageFallback} alt={robot.name} width={36} height={36} />
                    </AvatarFallback>
                  </Avatar>

                  <div className="flex flex-col flex-1">
                    <div className="flex flex-row items-center gap-2">
                      <span className="font-medium text-gray-900 text-sm">{robot.name}</span>
                      {robot.status === "online" && <span className="text-xs px-2 py-0.5 rounded bg-green-100 text-green-600 flex items-center gap-1"><Wifi size={12} />Online</span>}
                      {robot.status === "charging" && <span className="text-xs px-2 py-0.5 rounded bg-yellow-100 text-yellow-600 flex items-center gap-1"><Zap size={12} />Charging</span>}
                      {robot.status === "offline" && <span className="text-xs px-2 py-0.5 rounded bg-gray-200 text-gray-600 flex items-center gap-1"><WifiOff size={12} />Offline</span>}
                    </div>
                    <span className="text-xs text-gray-400 mt-1">{robot.serial}</span>
                  </div>

                  {robot.status !== "offline" && robot.battery != null && (
                    <div className="flex items-center gap-1 text-xs text-gray-500">
                      <Battery size={12} />
                      <span>{robot.battery}%</span>
                    </div>
                  )}

                  {isSelected && <span className="ml-2 text-blue-600 font-bold">✓</span>}
                </DropdownMenuItem>
              );
            })}
          </DropdownMenuGroup>

          <DropdownMenuSeparator />
          <DropdownMenuItem className="flex items-center gap-2 py-2 px-2 text-blue-600 hover:bg-blue-50 cursor-pointer" onClick={() => setIsModalOpen(true)}>
            <span className="text-lg">＋</span>
            <span className="font-medium">Thêm Robot mới</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <RobotModal open={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </>
  );
}