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
  ctrl_version?: string;
  firmware_version?: string;

}

export function RobotSelector({ className = "" }: RobotSelectorProps) {
  const [accountId, setAccountId] = useState<string>("");
  const [selectedRobotId, setSelectedRobotId] = useState<string | null>(null);

  const {
    robots: reduxRobots,
    selectedRobotSerial,
    selectRobot,
    addRobot,
    connectMode, // ✅ new: lấy mode từ store
  } = useRobotStore();

  const isMultiMode =
    connectMode === "multi" ||
    (Array.isArray(selectedRobotSerial) && selectedRobotSerial.length > 1);

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
  const selectedSerial =
    Array.isArray(selectedRobotSerial) && selectedRobotSerial.length > 0
      ? selectedRobotSerial[0]
      : selectedRobotSerial;
  const selectedRobot = robots.find((r) => r.serialNumber === selectedSerial);

  const { useGetRobotInfo } = useRobotInfo();
  const { data: robotInfoData } = useGetRobotInfo( Array.isArray(selectedRobotSerial)
    ? selectedRobotSerial[0] ?? ""
    : selectedRobotSerial ?? "",
  10, {
    enabled:
      !!(
        selectedSerial &&
        (selectedRobot?.status === "online" ||
          selectedRobot?.status === "success")
      ),
  });

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

  // ✅ Tự động chọn robot đầu tiên nếu chưa có
  useEffect(() => {
    if (robots.length > 0 && !selectedRobotSerial) {
      const firstRobot = robots[0];
      selectRobot(firstRobot.serialNumber);
    }
  }, [robots, selectedRobotSerial]);

  // ✅ Click chọn robot (toggle nếu multi)
  const handleRobotSelect = (serialNumber: string) => {
    if (isMultiMode) {
      selectRobot(serialNumber); // toggle trong Redux
    } else {
      selectRobot(serialNumber);
      setSelectedRobotId(serialNumber);
    }
  };

  // ✅ Chuẩn hóa dữ liệu hiển thị
  const convertToDisplayRobot = (robot: Robot): DisplayRobot => {
    const isSelected = Array.isArray(selectedRobotSerial)
      ? selectedRobotSerial.includes(robot.serialNumber)
      : robot.serialNumber === selectedRobotSerial;

    let realBattery = robot.battery_level ?? 0;
    let finalStatus: "online" | "offline" = "offline";

    if (isSelected && robotInfoData?.data) {
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

  const selectedRobots = robotList.filter((r) =>
    Array.isArray(selectedRobotSerial)
      ? selectedRobotSerial.includes(r.serialNumber)
      : r.serialNumber === selectedRobotSerial
  );

  const displayName =
    selectedRobots.length === 0
      ? "Chưa có robot nào"
      : isMultiMode
      ? `${selectedRobots.length} robots được chọn`
      : selectedRobots[0].name;

  const displayAvatar =
    isMultiMode && selectedRobots.length > 1
      ? "/img_top_alphamini_multi.webp"
      : selectedRobots[0]?.avatar ?? "/img_top_alphamini_disconnect.webp";

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

  if (error || robotList.length === 0) {
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
          <Image
            src={displayAvatar}
            alt="AlphaMini"
            width={50}
            height={50}
            className="object-cover object-top rounded-lg ml-2"
          />
          <div className="flex flex-col justify-center items-start ml-3">
            <span className="font-semibold text-base text-gray-900 leading-tight">
              {displayName}
            </span>
            {isMultiMode ? (
              <span className="text-xs text-gray-500 font-mono tracking-wide mt-0.5">
                Multi mode
              </span>
            ) : (
              <span className="text-xs text-gray-500 font-mono tracking-wide mt-0.5">
                {selectedRobots[0]?.serialNumber ?? ""}
              </span>
            )}
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
          {isMultiMode ? "Select Multiple Robots" : "Select AlphaMini"}
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          {robotList.map((robot) => {
            const isSelected = Array.isArray(selectedRobotSerial)
              ? selectedRobotSerial.includes(robot.serialNumber)
              : robot.serialNumber === selectedRobotSerial;

            return (
              <DropdownMenuItem
                key={robot.id}
                onClick={() => handleRobotSelect(robot.serialNumber)}
                className={`flex items-center gap-3 py-2 px-2 rounded-lg cursor-pointer ${
                  isSelected ? "bg-blue-50" : ""
                }`}
              >
                <Avatar className="h-9 w-9 rounded-none overflow-hidden">
                  <AvatarImage src={robot.avatar} alt={robot.name} />
                  <AvatarFallback>
                    <Image src={imageFallback} alt={robot.name} width={36} height={36} />
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
                      {robot.status}
                    </span>
                  </div>
                  <span className="text-xs text-gray-400 mt-1">
                    {robot.serialNumber}
                  </span>
                </div>
                {isSelected && (
                  <span className="ml-2 text-blue-600 font-bold">✓</span>
                )}
              </DropdownMenuItem>
            );
          })}
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
