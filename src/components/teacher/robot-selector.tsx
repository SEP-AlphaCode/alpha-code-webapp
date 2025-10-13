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

// Interface cho robot hiển thị
interface DisplayRobot {
  id: string;
  name: string;
  status: 'online' | 'offline';
  avatar: string;
  battery: number;
  serialNumber: string;
}

export function RobotSelector({ className = "" }: RobotSelectorProps) {
  const [accountId, setAccountId] = useState<string>("");
  const [selectedRobotId, setSelectedRobotId] = useState<string | null>(null);

  // Lấy Redux store để sync data
  const { selectRobot: selectRobotInRedux, addRobot } = useRobotStore();

  // Lấy account ID từ token
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const accessToken = sessionStorage.getItem('accessToken');
      if (accessToken) {
        const userId = getUserIdFromToken(accessToken);
        if (userId) {
          setAccountId(userId);
        }
      }
    }
  }, []);

  // Sử dụng hook API để lấy robots
  const { useGetRobotsByAccountId } = useRobot();
  const { data: robotsResponse, isLoading, error } = useGetRobotsByAccountId(accountId);

  const robots = robotsResponse?.data || [];

  // Lấy thông tin chi tiết của robot được chọn
  const selectedRobot = robots.find(r => r.id === selectedRobotId);
  const { useGetRobotInfo } = useRobotInfo();
  const { data: robotInfoData } = useGetRobotInfo(
    selectedRobot?.serialNumber || "",
    10,
    // Chỉ fetch khi robot online và có serial
    { enabled: !!(selectedRobot?.serialNumber && selectedRobot?.status === 1) }
  );

  // Sync robots to Redux store
  useEffect(() => {
    robots.forEach(robot => {
      addRobot({
        id: robot.id,
        serial: robot.serialNumber,
        name: robot.robotModelName || 'Unknown Robot',
        status: robot.status === 1 ? 'online' : 'offline',
        lastConnected: robot.lastUpdate || new Date().toISOString(),
        isSelected: false,
        battery: Math.floor(Math.random() * 100),
        robotModelId: robot.robotModelId,
        robotModelName: robot.robotModelName,
        accountId: robot.accountId
      });
    });
  }, [robots, addRobot]);

  // Auto-select first robot if none selected
  useEffect(() => {
    if (robots.length > 0 && !selectedRobotId) {
      const firstRobot = robots[0];
      setSelectedRobotId(firstRobot.id);
      selectRobotInRedux(firstRobot.serialNumber);
    }
  }, [robots, selectedRobotId, selectRobotInRedux]);

  const handleRobotSelect = (robot: Robot) => {
    setSelectedRobotId(robot.id);
    selectRobotInRedux(robot.serialNumber);
  };

  // Convert API robot to display format
  const convertToDisplayRobot = (robot: Robot): DisplayRobot => {
    // Nếu là robot được chọn và có thông tin từ API, dùng battery thật
    const isSelectedRobot = robot.id === selectedRobotId;
    const realBattery = isSelectedRobot && robotInfoData?.data?.battery_level 
      ? parseInt(robotInfoData.data.battery_level) 
      : 0; // Không hiển thị battery nếu không có data

    return {
      id: robot.id,
      name: robot.robotModelName || 'Unknown Robot',
      status: robot.status === 1 ? 'online' : 'offline',
      avatar: robot.status === 1 ? "/img_top_alphamini_connect.webp" : "/img_top_alphamini_disconnect.webp",
      battery: realBattery,
      serialNumber: robot.serialNumber
    };
  };

  const robotList = robots.map(convertToDisplayRobot);
  const currentRobot = robotList.find(robot => robot.id === selectedRobotId);

  if (isLoading) {
    return (
      <div className={`flex items-center px-2 py-1 rounded-xl shadow border border-gray-100 bg-gray-50 min-w-[260px] ${className}`}>
        <div className="text-gray-500 text-sm">Đang tải robots...</div>
      </div>
    );
  }

  if (error || !currentRobot) {
    return (
      <div className={`flex items-center px-2 py-1 rounded-xl shadow border border-gray-100 bg-gray-50 min-w-[260px] ${className}`}>
        <div className="text-gray-500 text-sm">Chưa có robot nào</div>
      </div>
    );
  }
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className={`flex items-center px-2 py-1 rounded-xl shadow border border-gray-100 bg-blue-50 hover:bg-blue-100 transition-colors focus:outline-none min-w-[260px] ${className}`}>
          <div className="flex flex-row flex-1 gap-4">
            <div className="flex items-center gap-2">
              <Image 
                src={currentRobot.status === "online" ? "/img_top_alphamini_connect.webp" : "/img_top_alphamini_disconnect.webp"} 
                alt="AlphaMini" 
                width={50} 
                height={50} 
                className="object-cover object-top rounded-lg ml-2" 
              />
              <div className="flex flex-col justify-center items-start">
                <span className="font-semibold text-base text-gray-900 leading-tight">{currentRobot.name}</span>
                <span className="text-xs text-gray-500 font-mono tracking-wide mt-0.5">{currentRobot.serialNumber}</span>
              </div>
              
            </div>
            <div className="flex flex-col justify-center items-start gap-2 mt-1 px-1 py-0.5">
              {/* Connection status */}
              <span className={`flex items-center gap-1 text-xs font-medium rounded px-2 py-1 ${
                currentRobot.status === "online" 
                  ? "text-green-600 bg-green-100" 
                  : "text-red-600 bg-red-100"
              }`}>
                <div className={`w-2 h-2 rounded-full ${
                  currentRobot.status === "online" ? "bg-green-500" : "bg-red-500"
                }`}></div>
                {currentRobot.status === "online" ? "Online" : "Offline"}
              </span>
              
              {/* Battery status - chỉ hiển thị khi robot online và có thông tin battery */}
              {currentRobot.status === "online" && currentRobot.battery > 0 && (() => {
                const battery = currentRobot.battery;
                let batteryBg = "bg-green-100";
                let batteryText = "text-green-600";
                if (battery <= 20) { batteryBg = "bg-red-100"; batteryText = "text-red-600"; }
                else if (battery <= 50) { batteryBg = "bg-yellow-100"; batteryText = "text-yellow-700"; }
                return (
                  <span className={`flex items-center gap-1 text-xs font-medium rounded px-2 py-1 ${batteryText} ${batteryBg}`}> 
                    {/* Battery icon */}
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
                      <rect x="2" y="7" width="18" height="10" rx="2" ry="2" />
                      <rect x="20" y="10" width="2" height="4" rx="1" />
                      <rect x="4" y="9" width={Math.max(1, Math.floor((battery/100)*14))} height="6" rx="1" fill="currentColor" />
                    </svg>
                    {battery}%
                    {robotInfoData?.data?.is_charging && (
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-3 h-3 text-yellow-500">
                        <polygon points="13,2 3,14 12,14 11,22 21,10 12,10 13,2" />
                      </svg>
                    )}
                  </span>
                );
              })()}
            </div>
          </div>
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-80" side="bottom" align="end" sideOffset={8} forceMount>
        <DropdownMenuLabel className="font-semibold text-base mb-2">Select AlphaMini</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          {robotList.map((robot) => (
            <DropdownMenuItem
              key={robot.id}
              onClick={() => handleRobotSelect(robots.find(r => r.id === robot.id)!)}
              className={`flex items-center gap-3 py-2 px-2 rounded-lg ${robot.id === currentRobot.id ? 'bg-blue-50' : ''}`}
            >
              <Avatar className="h-9 w-9 rounded-none overflow-hidden">
                <AvatarImage src={robot.avatar} alt={robot.name} className="object-cover w-full h-full rounded-none" />
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
                  <span className="font-medium text-gray-900 text-sm">{robot.name}</span>
                  <span className={`text-xs px-2 py-0.5 rounded ${
                    robot.status === 'online' ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'
                  }`}>
                    {robot.status === 'online' ? 'Online' : 'Offline'}
                  </span>
                </div>
                <span className="text-xs text-gray-400 mt-1">{robot.serialNumber}</span>
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

// Memoize component để tránh re-render không cần thiết
export default memo(RobotSelector);