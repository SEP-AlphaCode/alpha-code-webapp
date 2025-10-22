"use client";

import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Power, StopCircleIcon } from "lucide-react";
import { useRobotStatus } from "@/hooks/use-robot-status";
import { useRobotStore } from "@/hooks/use-robot-store"; // 👈 thêm dòng này

interface Robot {
  id: string;
  name: string;
  status: "online" | "offline" | "charging" | "busy";
  battery: number | null;
  lastSeen: string;
  version: string;
  ctrl_version: string;
  firmware_version: string;
  students: number;
  currentTask: string;
  uptime: string;
  ip: string;
  image: string;
  serialNumber: string;
  robotmodel: string | undefined;
}

interface RobotDetailsProps {
  robot: Robot;
  translations: {
    systemInfo: {
      title: string;
      firmware: string;
      ctrl: string;
      temperature: string;
      robotmodel: string;
    };
    currentStatus: {
      title: string;
      status: string;
      task: string;
      battery: string;
    };
    quickActions: {
      title: string;
      restart: string;
      settings: string;
      forceStop: string;
    };
    statusTexts: {
      online: string;
      offline: string;
      charging: string;
    };
  };
}

export function RobotDetails({ robot, translations }: RobotDetailsProps) {
  const { connectMode } = useRobotStore(); // 👈 lấy từ store
  const isMultiMode = connectMode === "multi"; // ✅ kiểm tra

  const { status: liveStatus, loading, error } = useRobotStatus(robot.serialNumber, 5000);
  const [displayRobot, setDisplayRobot] = useState(robot);

  useEffect(() => {
    if (liveStatus) {
      setDisplayRobot((prev) => ({
        ...prev,
        version: liveStatus.firmware_version || prev.version,
        battery: liveStatus.battery_level ?? prev.battery,
        status: liveStatus.is_charging ? "charging" : prev.status,
      }));
    }
  }, [liveStatus]);

  const getStatusColor = (status: string) => {
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
        return translations.statusTexts.online;
      case "offline":
        return translations.statusTexts.offline;
      case "charging":
        return translations.statusTexts.charging;
      default:
        return status;
    }
  };

  // ⚡ Nếu đang ở multi-mode → không hiển thị chi tiết
  if (isMultiMode) {
    return null;
  }

  return (
    <section className="mt-8">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* System Info */}
        <div className="bg-white rounded-xl shadow p-6 border border-gray-100">
          <h4 className="font-semibold text-lg text-blue-700 mb-4">
            {translations.systemInfo.title}
          </h4>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-400">ID:</span>
              <span className="text-gray-900 font-medium">{displayRobot.id}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">{translations.systemInfo.firmware}:</span>
              <span className="text-gray-900 font-medium">
                {displayRobot.firmware_version}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">{translations.systemInfo.ctrl}:</span>
              <span className="text-gray-900 font-medium">
                {displayRobot.ctrl_version}
              </span>
            </div>
          </div>
        </div>

        {/* Current Status */}
        <div className="bg-white rounded-xl shadow p-6 border border-gray-100">
          <h4 className="font-semibold text-lg text-blue-700 mb-4">
            {translations.currentStatus.title}
          </h4>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-400">{translations.currentStatus.status}:</span>
              <span
                className={`px-2 py-0.5 rounded-full text-xs font-semibold ${getStatusColor(
                  displayRobot.status
                )}`}
              >
                {getStatusText(displayRobot.status)}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">{translations.systemInfo.robotmodel}:</span>
              <span className="text-gray-900 font-medium">{displayRobot.robotmodel}</span>
            </div>

            {/* ⚡ Ẩn phần pin nếu offline */}
            {displayRobot.status !== "offline" && (
              <>
                <div className="flex justify-between">
                  <span className="text-gray-400">
                    {translations.currentStatus.battery}:
                  </span>
                  <span className="text-gray-900 font-medium">
                    {loading ? "..." : `${displayRobot.battery}%`}
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2 my-2">
                  <div
                    className={`h-2 rounded-full ${getBatteryColor(
                      displayRobot.battery ?? 0
                    )}`}
                    style={{ width: `${displayRobot.battery}%` }}
                  ></div>
                </div>
              </>
            )}
          </div>
          {error && <p className="text-red-500 text-xs mt-2">⚠️ {error}</p>}
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-xl shadow p-6 border border-gray-100 flex flex-col justify-center">
          <h4 className="font-semibold text-lg text-blue-700 mb-4">
            {translations.quickActions.title}
          </h4>
          <div className="space-y-3">
            <Button className="w-full text-base py-3" variant="outline">
              <Power className="h-5 w-5 mr-2" />
              {translations.quickActions.restart}
            </Button>
            <Button className="w-full text-base py-3" variant="outline">
              <StopCircleIcon className="h-5 w-5 mr-2" />
              {translations.quickActions.forceStop}
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
