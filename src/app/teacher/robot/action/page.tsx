// src/components/teacher/robot/action/robot-action-page.tsx
"use client";

import { use, useEffect, useState } from "react";
import Image from "next/image";
import { RobotActionHeader } from "@/components/teacher/robot/action/robot-action-header";
import { RobotActionDetail } from "@/components/teacher/robot/action/robot-action-detail";
import { RobotActionGrid } from "@/components/teacher/robot/action/robot-action-grid";
import { RobotSelector } from "@/components/teacher/robot-selector";
import { useRobotCommand } from "@/hooks/use-robot-command";
import { useRobotStore } from "@/hooks/use-robot-store";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import type { RobotAction } from "@/types/robot";

export default function RobotActionPage() {
  const [notify, setNotifyState] = useState<{ msg: string; type: "success" | "error" } | null>(null);
  const setNotify = (msg: string, type: "success" | "error") => {
    setNotifyState({ msg, type });
    setTimeout(() => setNotifyState(null), 2500);
  };

  const { sendCommandToBackend } = useRobotCommand(setNotify);

  const [currentAction, setCurrentAction] = useState<RobotAction | null>(null);
  const [direction, setDirection] = useState<number>(0);
  
  // Sử dụng Redux store để lấy robot data
  const { selectedRobot, selectedRobotSerial, initializeMockData } = useRobotStore();

  // Initialize mock data on component mount
  useEffect(() => {
    initializeMockData();
  }, [initializeMockData]);


  // Khai báo lại các hàm chuyển trang
  const handlePrevAction = () => {
    // Logic này sẽ được xử lý trong RobotActionGrid, không cần ở đây
  };
  const handleNextAction = () => {
    // Logic này cũng được xử lý trong RobotActionGrid
  };

  // Hàm gọi lệnh sử dụng robot được chọn từ Redux
  const handleSendCommand = async (actionCode: string) => {
    if (!selectedRobotSerial || !selectedRobot) {
      setNotify("Bạn chưa chọn robot!", "error");
      return Promise.resolve();
    }
    
    if (selectedRobot.status === 'offline') {
      setNotify(`Robot ${selectedRobot.name} đang offline!`, "error");
      return Promise.resolve();
    }
    
    await sendCommandToBackend(actionCode, selectedRobotSerial);
  };

  return (
    <div className="min-h-screen">
      <div className="max-w-6xl mx-auto">
        <RobotActionHeader />
        
        {/* Robot Selector */}
        <div className="mb-6 flex justify-between items-center">
          <RobotSelector className="" />
          {selectedRobot && (
            <div className="text-sm text-gray-600 flex items-center gap-2">
              <span>Robot hiện tại:</span>
              <span className="font-medium">{selectedRobot.name}</span>
              <span className={`px-2 py-1 rounded-full text-xs ${
                selectedRobot.status === 'online' 
                  ? 'bg-green-100 text-green-800' 
                  : selectedRobot.status === 'busy'
                  ? 'bg-yellow-100 text-yellow-800'
                  : 'bg-gray-100 text-gray-800'
              }`}>
                {selectedRobot.status}
              </span>
              {selectedRobot.battery && (
                <span className="text-xs">🔋 {selectedRobot.battery}%</span>
              )}
            </div>
          )}
        </div>

        {/* Nếu có action đang chọn thì show detail */}
        {currentAction ? (
          <div className="relative">
            <button
              onClick={handlePrevAction}
              className="absolute -left-12 top-1/2 -translate-y-1/2 p-3 rounded-full bg-white shadow-lg hover:bg-gray-100 transition z-20"
            >
              <ChevronLeft size={36} className="text-gray-700" />
            </button>
            <button
              onClick={handleNextAction}
              className="absolute -right-12 top-1/2 -translate-y-1/2 p-3 rounded-full bg-white shadow-lg hover:bg-gray-100 transition z-20"
            >
              <ChevronRight size={36} className="text-gray-700" />
            </button>
            <AnimatePresence mode="wait" initial={false} custom={direction}>
              <motion.div
                key={currentAction.id}
                custom={direction}
                initial={{ x: direction > 0 ? 100 : -100, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: direction > 0 ? -100 : 100, opacity: 0 }}
                transition={{ duration: 0.4, ease: "easeInOut" }}
              >
                <RobotActionDetail action={{ ...currentAction, description: currentAction.description ?? undefined }} />
              </motion.div>
            </AnimatePresence>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center min-h-[50vh] text-center">
            <Image
              src="/img_action_default.webp"
              alt="AlphaMini ready"
              width={256}
              height={256}
              className="w-64 h-auto mb-4"
            />
            <h2 className="text-xl md:text-2xl font-semibold text-gray-700">
              Tap an action below to make AlphaMini move!
            </h2>
          </div>

        )}

        {/* Grid hiển thị actions */}
        <RobotActionGrid
          sendCommandToBackend={handleSendCommand}
          onActionSelect={(action) => setCurrentAction(action)}
        />
      </div>

      {notify && (
        <div
          className={`fixed top-6 left-1/2 -translate-x-1/2 z-50 px-6 py-3 rounded-xl shadow-lg text-white font-semibold transition-all duration-300 ${
            notify.type === "success" ? "bg-green-500" : "bg-red-500"
          }`}
        >
          {notify.msg}
        </div>
      )}
    </div>
  );
}