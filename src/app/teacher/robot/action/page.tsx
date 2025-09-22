"use client";

import { useState } from "react";
import Image from "next/image";
import { RobotActionHeader } from "@/components/teacher/robot/action/robot-action-header";
import { RobotActionDetail } from "@/components/teacher/robot/action/robot-action-detail";
import { RobotActionGrid } from "@/components/teacher/robot/action/robot-action-grid";
import { RobotPaginationDots } from "@/components/teacher/robot/action/robot-pagination.dots";
import { useRobotCommand } from "@/hooks/use-robot-command";
import { useRobotActions } from "@/hooks/use-robot-action";
import type { RobotAction } from "@/types/robot";

import { AnimatePresence, motion } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";

export default function RobotActionPage() {
  const [notify, setNotifyState] = useState<{ msg: string; type: "success" | "error" } | null>(null);
  const setNotify = (msg: string, type: "success" | "error") => {
    setNotifyState({ msg, type });
    setTimeout(() => setNotifyState(null), 2500);
  };

  // pagination state
  const [currentPage, setCurrentPage] = useState(1); // backend page bắt đầu từ 1
  const actionsPerPage = 8;

  const { actions, totalPages, loading, error } = useRobotActions(currentPage, actionsPerPage);
  const { sendCommandToBackend } = useRobotCommand(setNotify);

  const [currentActionIndex, setCurrentActionIndex] = useState<number | null>(null);
  const [direction, setDirection] = useState<number>(0);

  const action: RobotAction | null =
    currentActionIndex !== null ? actions[currentActionIndex] : null;

  const handlePrevAction = () => {
    setDirection(-1);
    setCurrentActionIndex((prev) => {
      if (prev === null) return 0;
      return (prev - 1 + actions.length) % actions.length;
    });
  };

  const handleNextAction = () => {
    setDirection(1);
    setCurrentActionIndex((prev) => {
      if (prev === null) return 0;
      return (prev + 1) % actions.length;
    });
  };

  return (
    <div className="min-h-screen">
      <div className="max-w-6xl mx-auto">
        <RobotActionHeader />

        {loading && (
          <div className="flex justify-center items-center min-h-[50vh] text-gray-500">
            Đang tải actions...
          </div>
        )}

        {error && (
          <div className="flex justify-center items-center min-h-[50vh] text-red-500">
            {error}
          </div>
        )}

        {/* Nếu có action đang chọn thì show detail */}
        {!loading && !error && currentActionIndex !== null && action ? (
          <div className="relative">
            {/* Chevron buttons */}
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

            {/* Animated content */}
            <AnimatePresence mode="wait" initial={false} custom={direction}>
              <motion.div
                key={action.id}
                custom={direction}
                initial={{ x: direction > 0 ? 100 : -100, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: direction > 0 ? -100 : 100, opacity: 0 }}
                transition={{ duration: 0.4, ease: "easeInOut" }}
              >
                <RobotActionDetail action={{ ...action, description: action.description ?? undefined }} />
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
        {!loading && !error && (
          <>
            <RobotActionGrid
              actions={actions}
              currentPage={currentPage}
              totalPages={totalPages}
              prevPage={() =>
                setCurrentPage((prev) => (prev - 1 <= 0 ? totalPages : prev - 1))
              }
              nextPage={() =>
                setCurrentPage((prev) => (prev + 1 > totalPages ? 1 : prev + 1))
              }
              currentPageActions={actions}
              currentAction={currentActionIndex ?? -1}
              setCurrentAction={setCurrentActionIndex}
              sendCommandToBackend={sendCommandToBackend}
            />

            <RobotPaginationDots
              totalPages={totalPages}
              currentPage={currentPage - 1} // dot bắt đầu từ 0
              setCurrentPage={(p) => setCurrentPage(p + 1)}
            />
          </>
        )}
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
