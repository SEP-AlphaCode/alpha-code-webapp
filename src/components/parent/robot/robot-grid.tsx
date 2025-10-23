"use client";

import React from "react";
import Image from "next/image";
import {
  Battery,
  CheckCircle,
  WifiOff,
  Zap,
  Activity,
  CheckSquare,
  Square,
} from "lucide-react";
import { useRobotStore } from "@/hooks/use-robot-store";

interface Robot {
  id: string;
  name: string;
  status: "online" | "offline" | "charging" | "busy";
  battery: number | null;
  lastSeen: string;
  version: string;
  students: number;
  currentTask: string;
  uptime: string;
  ip: string;
  temperature: number;
  image: string;
  serialNumber: string;
  robotModelName?: string;
}

interface RobotGridProps {
  robots: Robot[];
  selectedRobot: string | string[] | null;
  onRobotSelect: (robotSerial: string) => void;
  sectionTitle: string;
  statusTexts: {
    online: string;
    offline: string;
    charging: string;
  };
}

export function RobotGrid({
  robots,
  selectedRobot,
  onRobotSelect,
  sectionTitle,
  statusTexts,
}: RobotGridProps) {
  const { connectMode } = useRobotStore();
  const isMultiMode = connectMode === "multi";

  const getStatusIcon = (status: Robot["status"]) => {
    switch (status) {
      case "online":
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case "offline":
        return <WifiOff className="h-4 w-4 text-gray-500" />;
      case "charging":
        return <Zap className="h-4 w-4 text-yellow-500" />;
      default:
        return <Activity className="h-4 w-4 text-gray-400" />;
    }
  };

  const getStatusColor = (status: Robot["status"]) => {
    switch (status) {
      case "online":
        return "bg-green-100 text-green-800";
      case "offline":
        return "bg-gray-100 text-gray-800";
      case "charging":
        return "bg-yellow-100 text-yellow-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getBatteryColor = (battery: number) => {
    if (battery > 60) return "bg-green-500";
    if (battery > 30) return "bg-yellow-500";
    return "bg-red-500";
  };

  const getStatusText = (status: Robot["status"]) => {
    switch (status) {
      case "online":
        return statusTexts.online;
      case "offline":
        return statusTexts.offline;
      case "charging":
        return statusTexts.charging;
      default:
        return status;
    }
  };

  const isRobotSelected = (serial: string) => {
    if (Array.isArray(selectedRobot)) return selectedRobot.includes(serial);
    return selectedRobot === serial;
  };

  return (
    <section>
      {/* 🔵 Section Title */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-semibold text-blue-800">{sectionTitle}</h2>

        {/* ✅ Hiển thị chế độ connect */}
        <span
          className={`text-sm px-3 py-1 rounded-full ${
            isMultiMode
              ? "bg-purple-100 text-purple-700"
              : "bg-blue-100 text-blue-700"
          }`}
        >
          {isMultiMode ? "Multi Mode" : "Single Mode"}
        </span>
      </div>

      {/* 🟦 Robot Cards */}
      <div className="flex gap-6 overflow-x-auto p-5 hide-scrollbar">
        {robots.map((robot) => {
          // ✅ Chuẩn hóa status hiển thị
          const displayStatus: Robot["status"] =
            robot.status === "charging"
              ? "charging"
              : robot.status === "online"
              ? "online"
              : "offline";

          const selected = isRobotSelected(robot.serialNumber);

          return (
            <div
              key={robot.id}
              className={`relative min-w-[320px] bg-white rounded-2xl shadow-lg border border-gray-100 p-5 flex flex-col items-center transition-transform duration-200 hover:scale-105 cursor-pointer ${
                selected ? "ring-2 ring-blue-400" : ""
              }`}
              onClick={() => onRobotSelect(robot.serialNumber)}
            >
              {/* 🟣 Multi-Select Checkbox */}
              {isMultiMode && (
                <div className="absolute top-3 right-3 z-10 p-1 bg-white rounded-md shadow-md">
                  {selected ? (
                    <CheckSquare className="h-6 w-6 text-blue-500" />
                  ) : (
                    <Square className="h-6 w-6 text-gray-300" />
                  )}
                </div>
              )}

              {/* 🖼️ Avatar */}
              <Image
                src={robot.image}
                alt={robot.name}
                width={80}
                height={80}
                className="rounded-full object-cover mb-2"
              />

              {/* 📛 Name + Serial */}
              <span className="font-bold text-lg text-gray-900 mb-1">
                {robot.name}
              </span>
              <span className="text-xs text-gray-400 mb-2">
                {robot.serialNumber}
              </span>

              {/* 🟢 Status */}
              <div className="flex items-center gap-2 mb-2">
                {getStatusIcon(displayStatus)}
                <span
                  className={`px-2 py-0.5 rounded-full text-xs font-semibold ${getStatusColor(
                    displayStatus
                  )}`}
                >
                  {getStatusText(displayStatus)}
                </span>
              </div>

              {/* 🔋 Battery (ẩn khi offline) */}
              {displayStatus !== "offline" && (
                <div className="flex items-center gap-2 mb-2">
                  <Battery className="h-4 w-4" />
                  <span className="font-semibold text-sm">
                    {robot.battery ?? 0}%
                  </span>
                  <div className="w-20 h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div
                      className={`h-2 rounded-full ${getBatteryColor(
                        robot.battery ?? 0
                      )}`}
                      style={{ width: `${robot.battery ?? 0}%` }}
                    ></div>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
}
