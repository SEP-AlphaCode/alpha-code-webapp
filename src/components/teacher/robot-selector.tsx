"use client";

import React, { useEffect } from "react";
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
import { useRobotStore } from "@/hooks/use-robot-store";
import { Robot as ReduxRobot } from "@/store/robotSlice";

interface RobotSelectorProps {
  className?: string;
}

export function RobotSelector({ className = "" }: RobotSelectorProps) {
  const { 
    robots, 
    selectedRobot, 
    selectRobot, 
    initializeMockData 
  } = useRobotStore();

  // Initialize mock data on component mount
  useEffect(() => {
    initializeMockData();
  }, [initializeMockData]);

  // Convert Redux robot to display format
  const convertToDisplayRobot = (robot: ReduxRobot) => ({
    id: robot.serial,
    name: robot.name,
    status: robot.status,
    avatar: robot.status === "online" ? "/img_top_alphamini_connect.webp" : "/img_top_alphamini_disconnect.webp",
    battery: Math.floor(Math.random() * 100) + 1 // Mock battery since it's not in Redux state
  });

  const currentRobot = selectedRobot ? convertToDisplayRobot(selectedRobot) : null;
  const robotList = robots.map(convertToDisplayRobot);

  if (!currentRobot) {
    return (
      <div className={`flex items-center px-2 py-1 rounded-xl shadow border border-gray-100 bg-gray-50 min-w-[260px] ${className}`}>
        <div className="text-gray-500 text-sm">Chưa chọn robot</div>
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
                <span className="text-xs text-gray-500 font-mono tracking-wide mt-0.5">{currentRobot.id}</span>
              </div>
              
            </div>
            <div className="flex flex-col justify-center items-start gap-2 mt-1 px-1 py-0.5">
              {/* Battery status with true battery icon, always colored bg */}
              {(() => {
                const battery = currentRobot.battery ?? 40;
                let batteryBg = "bg-green-100";
                let batteryText = "text-green-600";
                if (battery <= 20) { batteryBg = "bg-red-100"; batteryText = "text-red-600"; }
                else if (battery <= 50) { batteryBg = "bg-yellow-100"; batteryText = "text-yellow-700"; }
                return (
                  <span className={`flex items-center gap-1 text-xs font-medium rounded ${batteryText} ${batteryBg}`}> 
                    {/* Battery icon */}
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
                      <rect x="2" y="7" width="18" height="10" rx="2" ry="2" />
                      <rect x="20" y="10" width="2" height="4" rx="1" />
                      <rect x="4" y="9" width={Math.max(1, Math.floor((battery/100)*14))} height="6" rx="1" fill="currentColor" />
                    </svg>
                    {battery}%
                  </span>
                );
              })()}
              {/* SIM card icon, always gray bg */}
              <span className="flex items-center gap-1 text-xs font-medium rounded text-gray-600 bg-gray-100">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
                  <rect x="4" y="4" width="16" height="16" rx="3" />
                  <rect x="8" y="12" width="8" height="4" rx="1" />
                </svg>
                No SIM card
              </span>
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
              onClick={() => selectRobot(robot.id)}
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
                  <span className={`text-xs px-2 py-0.5 rounded ${robot.status === 'online' ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'}`}>
                    {robot.status === 'online' ? 'Online' : 'Offline'}
                  </span>
                </div>
                <span className="text-xs text-gray-400 mt-1">{robot.id}</span>
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