"use client";

import React, { useState, useEffect, memo } from "react";
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
import { Robot } from "@/types/robot";
import { useRobotStore } from "@/hooks/use-robot-store";

interface RobotSelectorProps {
  className?: string;
}

interface DisplayRobot {
  id: string;
  name: string;
  status: "online" | "offline";
  avatar: string;
  battery: number;
  serialNumber: string;
}

export function RobotSelector({ className = "" }: RobotSelectorProps) {
  const [accountId, setAccountId] = useState<string>("");
  const [selectedRobotId, setSelectedRobotId] = useState<string | null>(null);

  const {
    robots: reduxRobots,
    selectedRobotSerial,
    selectRobot,
    addRobot,
  } = useRobotStore();

  // ✅ Lấy accountId từ token
  useEffect(() => {
    if (typeof window !== "undefined") {
      const accessToken = sessionStorage.getItem("accessToken");
      if (accessToken) {
        const userId = getUserIdFromToken(accessToken);
        if (userId) setAccountId(userId);
      }
    }
  }, []);

  // ✅ Gọi API lấy robots
  const { useGetRobotsByAccountId } = useRobot();
  const { data: robotsResponse, isLoading, error } =
    useGetRobotsByAccountId(accountId);
  const robots = robotsResponse?.data || [];

  // ✅ Gọi API lấy robot info (battery, status, etc.)
  const selectedRobot = robots.find((r) => r.id === selectedRobotId);
  const { useGetRobotInfo } = useRobotInfo();
  const { data: robotInfoData } = useGetRobotInfo(
    selectedRobot?.serialNumber || "",
    10,
    {
      enabled:
        !!(selectedRobot?.serialNumber &&
        (selectedRobot?.status === "online" || selectedRobot?.status === "success")),
    }
  );

  // ✅ Đồng bộ robots vào Redux
  useEffect(() => {
    robots.forEach((robot) => {
      addRobot({
        id: robot.id,
        serial: robot.serialNumber,
        name: robot.robotModelName || "Unknown Robot",
        status:
          robot.status === "online" || robot.status === "success"
            ? "online"
            : "offline",
        lastConnected: robot.lastUpdate || new Date().toISOString(),
        isSelected: false,
        battery: robot.battery_level ?? 0,
        robotModelId: robot.robotModelId,
        robotModelName: robot.robotModelName,
        accountId: robot.accountId,
      });
    });
  }, [robots, addRobot]);

  // ✅ Tự động chọn robot đầu tiên
  useEffect(() => {
    if (robots.length > 0 && !selectedRobotSerial) {
      const firstRobot = robots[0];
      selectRobot(firstRobot.serialNumber);
    }
  }, [robots, selectedRobotId, selectedRobotSerial]);

  const handleRobotSelect = (robot: Robot) => {
    selectRobot(robot.serialNumber);
    setSelectedRobotId(robot.id);
  };

  // ✅ Chuẩn hóa dữ liệu hiển thị
  const convertToDisplayRobot = (robot: Robot): DisplayRobot => {
    const isSelectedRobot = robot.serialNumber === selectedRobotSerial;

    let realBattery = robot.battery_level ?? 0;
    let finalStatus: "online" | "offline" = "offline";

    if (isSelectedRobot && robotInfoData?.data) {
      const info = robotInfoData.data;
      if (robotInfoData.status !== "error" && info?.battery_level != null) {
        finalStatus = "online";
        realBattery = parseInt(info.battery_level);
      }
    } else {
      finalStatus =
        robot.status === "online" || robot.status === "success"
          ? "online"
          : "offline";
    }

    return {
      id: robot.id,
      name: robot.robotModelName || "Unknown Robot",
      status: finalStatus,
      avatar:
        finalStatus === "online"
          ? "/img_top_alphamini_connect.webp"
          : "/img_top_alphamini_disconnect.webp",
      battery: realBattery,
      serialNumber: robot.serialNumber,
    };
  };

  const robotList = robots.map(convertToDisplayRobot);
  const currentRobot = robotList.find(
    (robot) => robot.serialNumber === selectedRobotSerial
  );

  // ==========================
  // UI
  // ==========================
  if (isLoading) {
    return (
      <div
        className={`flex items-center px-2 py-1 rounded-xl shadow border border-gray-100 bg-gray-50 min-w-[260px] ${className}`}
      >
        <div className="text-gray-500 text-sm">Đang tải robots...</div>
      </div>
    );
  }

  if (error || !currentRobot) {
    return (
      <div
        className={`flex items-center px-2 py-1 rounded-xl shadow border border-gray-100 bg-gray-50 min-w-[260px] ${className}`}
      >
        <div className="text-gray-500 text-sm">Chưa có robot nào</div>
      </div>
    );
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          className={`flex items-center px-2 py-1 rounded-xl shadow border border-gray-100 bg-blue-50 hover:bg-blue-100 transition-colors focus:outline-none min-w-[260px] ${className}`}
        >
          <div className="flex flex-row flex-1 gap-4">
            <div className="flex items-center gap-2">
              <Image
                src={currentRobot.avatar}
                alt="AlphaMini"
                width={50}
                height={50}
                className="object-cover object-top rounded-lg ml-2"
              />
              <div className="flex flex-col justify-center items-start">
                <span className="font-semibold text-base text-gray-900 leading-tight">
                  {currentRobot.name}
                </span>
                <span className="text-xs text-gray-500 font-mono tracking-wide mt-0.5">
                  {currentRobot.serialNumber}
                </span>
              </div>
            </div>

            <div className="flex flex-col justify-center items-start gap-2 mt-1 px-1 py-0.5">
              {/* Connection status */}
              <span
                className={`flex items-center gap-1 text-xs font-medium rounded px-2 py-1 ${
                  currentRobot.status === "online"
                    ? "text-green-600 bg-green-100"
                    : "text-red-600 bg-red-100"
                }`}
              >
                <div
                  className={`w-2 h-2 rounded-full ${
                    currentRobot.status === "online"
                      ? "bg-green-500"
                      : "bg-red-500"
                  }`}
                ></div>
                {currentRobot.status === "online" ? "Online" : "Offline"}
              </span>

              {/* Battery status */}
              {currentRobot.status === "online" &&
                currentRobot.battery != null && (
                  <span
                    className={`flex items-center gap-1 text-xs font-medium rounded px-2 py-1 ${
                      currentRobot.battery <= 20
                        ? "text-red-600 bg-red-100"
                        : currentRobot.battery <= 50
                        ? "text-yellow-700 bg-yellow-100"
                        : "text-green-600 bg-green-100"
                    }`}
                  >
                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="w-4 h-4"
                    >
                      <rect x="2" y="7" width="18" height="10" rx="2" ry="2" />
                      <rect x="20" y="10" width="2" height="4" rx="1" />
                      <rect
                        x="4"
                        y="9"
                        width={Math.max(
                          1,
                          Math.floor((currentRobot.battery / 100) * 14)
                        )}
                        height="6"
                        rx="1"
                        fill="currentColor"
                      />
                    </svg>
                    {currentRobot.battery}%
                  </span>
                )}
            </div>
          </div>
        </button>
      </DropdownMenuTrigger>

      <DropdownMenuContent
        className="w-80"
        side="bottom"
        align="end"
        sideOffset={8}
        forceMount
      >
        <DropdownMenuLabel className="font-semibold text-base mb-2">
          Select AlphaMini
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          {robotList.map((robot) => (
            <DropdownMenuItem
              key={robot.id}
              onClick={() =>
                handleRobotSelect(robots.find((r) => r.id === robot.id)!)
              }
              className={`flex items-center gap-3 py-2 px-2 rounded-lg ${
                robot.id === currentRobot.id ? "bg-blue-50" : ""
              }`}
            >
              <Avatar className="h-9 w-9 rounded-none overflow-hidden">
                <AvatarImage
                  src={robot.avatar}
                  alt={robot.name}
                  className="object-cover w-full h-full rounded-none"
                />
                <AvatarFallback className="bg-gray-300 text-gray-700 font-medium rounded-none p-0">
                  <Image
                    src={imageFallback}
                    alt={robot.name}
                    width={36}
                    height={36}
                    className="object-cover w-full h-full rounded-none"
                  />
                </AvatarFallback>
              </Avatar>
              <div className="flex flex-col flex-1">
                <div className="flex flex-row items-center gap-2">
                  <span className="font-medium text-gray-900 text-sm">
                    {robot.name}
                  </span>
                  <span
                    className={`text-xs px-2 py-0.5 rounded ${
                      robot.status === "online"
                        ? "bg-green-100 text-green-600"
                        : "bg-red-100 text-red-600"
                    }`}
                  >
                    {robot.status === "online" ? "Online" : "Offline"}
                  </span>
                </div>
                <span className="text-xs text-gray-400 mt-1">
                  {robot.serialNumber}
                </span>
              </div>
              {robot.id === currentRobot.id && (
                <span className="ml-2 text-blue-600 font-bold">✓</span>
              )}
            </DropdownMenuItem>
          ))}
        </DropdownMenuGroup>

        <DropdownMenuSeparator />
        <DropdownMenuItem className="flex items-center gap-2 py-2 px-2 text-blue-600 hover:bg-blue-50 cursor-pointer">
          <span className="text-lg">＋</span>
          <span className="font-medium">Bind New Robots</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export default memo(RobotSelector);
