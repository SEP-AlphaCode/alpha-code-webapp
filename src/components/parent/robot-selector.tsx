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
import { Battery, Zap, WifiOff } from "lucide-react";

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
    const token = sessionStorage.getItem("accessToken");
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
      addRobot({
        id: r.id,
        serial: r.serialNumber,
        name: r.robotModelName || "Unknown Robot",
        status: r.status === "online" ? "online" : "offline",
        battery: r.battery_level ?? null,
        robotModelId: r.robotModelId,
        robotModelName: r.robotModelName,
        accountId: r.accountId,
      });
    });
  }, [robotsApi, addRobot]);

  // Chọn robot đầu tiên nếu chưa chọn
  useEffect(() => {
    if (robotsApi.length > 0 && !selectedRobotSerial) {
      selectRobot(robotsApi[0].serialNumber);
    }
  }, [robotsApi, selectedRobotSerial, selectRobot]);

  // Poll status & battery cho tất cả robot
  const { useGetMultipleRobotInfo } = useRobotInfo();
  const robotInfos = useGetMultipleRobotInfo(
    robots.map((r) => r.serial),
    10,
    { enabled: robots.length > 0 }
  );

  // Cập nhật Redux store theo poll
  useEffect(() => {
  robotInfos.forEach((info) => {
    const existing = robots.find((r) => r.serial === info.serial);
    if (!existing) return;

    // Nếu robot offline hoặc error
    if (!info.data?.data || info.data.status === "error") {
      if (existing.status !== "offline") {
        updateRobotStatus(info.serial, "offline");
      }
      return;
    }

    // Robot online / charging
    const data = info.data.data;
    const newStatus = data.is_charging ? "charging" : "online";
    if (existing.status !== newStatus) {
      updateRobotStatus(info.serial, newStatus);
    }

    if (data.battery_level != null && existing.battery !== data.battery_level) {
      updateRobotBattery(info.serial, data.battery_level);
    }
  });
  // eslint-disable-next-line react-hooks/exhaustive-deps
}, [robotInfos]);

  const handleRobotSelect = (serial: string) => selectRobot(serial);

  // Render display robot
  const displayRobots = robots.map((r) => {
    const status = r.status;
    const avatar =
      status === "online" || status === "charging"
        ? "/img_top_alphamini_connect.webp"
        : "/img_top_alphamini_disconnect.webp";

    return {
      ...r,
      avatar,
    };
  });

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
      <div className={`flex items-center px-2 py-1 rounded-xl shadow border border-gray-100 bg-gray-50 min-w-[260px] ${className}`}>
        <div className="text-gray-500 text-sm">Chưa có robot nào</div>
      </div>
    );
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
                      {robot.status === "online" && <span className="text-xs px-2 py-0.5 rounded bg-green-100 text-green-600">Online</span>}
                      {robot.status === "charging" && <span className="text-xs px-2 py-0.5 rounded bg-yellow-100 text-yellow-600 flex items-center gap-1"><Zap size={12}/>Charging</span>}
                      {robot.status === "offline" && <span className="text-xs px-2 py-0.5 rounded bg-gray-200 text-gray-600 flex items-center gap-1"><WifiOff size={12}/>Offline</span>}
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
