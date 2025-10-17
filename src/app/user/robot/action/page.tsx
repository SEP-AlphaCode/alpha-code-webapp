// src/components/user/robot/action/robot-action-page.tsx
"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { RobotActionHeader } from "@/components/user/robot/action/robot-action-header";
import { RobotActionDetail } from "@/components/user/robot/action/robot-action-detail";
import { RobotActionGrid } from "@/components/user/robot/action/robot-action-grid";
import { RobotSelector } from "@/components/user/robot-selector";
import { useRobotCommand } from "@/hooks/use-robot-command";
import { useRobotStore } from "@/hooks/use-robot-store";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import type { RobotAction } from "@/types/robot";
import type { RobotActionUI } from "@/types/robot-ui"; // nếu bạn có UI type

export default function RobotActionPage() {
  const [notify, setNotifyState] = useState<{ msg: string; type: "success" | "error" } | null>(null);
  const setNotify = (msg: string, type: "success" | "error") => {
    setNotifyState({ msg, type });
    setTimeout(() => setNotifyState(null), 2500);
  };

  const { sendCommandToBackend } = useRobotCommand(setNotify);

  // 👇 Cho phép state nhận cả RobotAction lẫn RobotActionUI
  const [currentAction, setCurrentAction] = useState<RobotAction | RobotActionUI | null>(null);
  const direction = 0;

  const { selectedRobot, selectedRobotSerial, initializeMockData } = useRobotStore();

  useEffect(() => {
    initializeMockData();
  }, [initializeMockData]);

  const handlePrevAction = () => {
    // Logic for previous action (not implemented)
  };
  const handleNextAction = () => {
    // Logic for next action (not implemented)
  };

  const handleSendCommand = async (
    actionCode: string,
    type: "action" | "expression" | "skill_helper" | "extended_action" = "action"
  ) => {
    if (!selectedRobotSerial || !selectedRobot) {
      setNotify("Bạn chưa chọn robot!", "error");
      return Promise.resolve();
    }
    if (selectedRobot.status === "offline") {
      setNotify(`Robot ${selectedRobot.name} đang offline!`, "error");
      return Promise.resolve();
    }

    // ✅ TRUYỀN TYPE XUỐNG BACKEND CHÍNH XÁC
    await sendCommandToBackend(actionCode, selectedRobotSerial, type);
  };

  return (
    <div className="min-h-screen">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 pb-20">
        <RobotActionHeader />

        {/* Nếu có action đang chọn thì show detail */}
        {currentAction ? (
          <div className="relative">
           
            <AnimatePresence mode="wait" initial={false} custom={direction}>
              <motion.div
                key={currentAction.id}
                custom={direction}
                initial={{ x: direction > 0 ? 100 : -100, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: direction > 0 ? -100 : 100, opacity: 0 }}
                transition={{ duration: 0.4, ease: "easeInOut" }}
              >
                <RobotActionDetail
                  action={{
                    id: currentAction.id,
                    name: currentAction.name,
                    description: currentAction.description ?? "",
                    code: currentAction.code,
                    duration: currentAction.duration,
                    category: (currentAction as RobotActionUI).category ?? "action",

                    // Ưu tiên ảnh nếu có, fallback sang icon
                    imageUrl: (currentAction as RobotActionUI).imageUrl ?? null,
                    icon: (currentAction as RobotActionUI).icon ?? null,

                    status: (currentAction as RobotActionUI).status,
                    statusText: (currentAction as RobotActionUI).statusText ?? "",

                    createdDate: currentAction.createdDate,
                    lastUpdate: currentAction.lastUpdate,
                  }}
                />
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
              Bấm vào một hành động bên dưới để khiến AlphaMini di chuyển!
            </h2>
          </div>
        )}

        {/* Grid hiển thị actions */}
        <RobotActionGrid
          sendCommandToBackend={(actionCode, type) =>
          handleSendCommand(actionCode, type)
        }
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
