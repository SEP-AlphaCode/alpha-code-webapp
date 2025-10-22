// src/components/user/robot/action/robot-action-tab.tsx
"use client";

import { Dispatch, SetStateAction } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import type { RobotActionUI } from "@/types/robot-ui"; // 👈 đổi sang RobotActionUI
import { RobotPaginationDots } from "./robot-pagination.dots";

interface RobotActionTabProps {
  actions: RobotActionUI[]; // 👈 đổi type
  currentActionIndex: number | null;
  setCurrentActionIndex: Dispatch<SetStateAction<number | null>>;
  sendCommandToBackend: (actionCode: string) => Promise<unknown>;
  onActionSelect: (action: RobotActionUI) => void; // 👈 đổi type
  pageSize: number;
  currentPage: number;
  setCurrentPage: Dispatch<SetStateAction<number>>;
  totalPages: number;
  loading: boolean;
  error: string | null;
}

export function RobotActionTab({
  actions,
  currentActionIndex,
  setCurrentActionIndex,
  sendCommandToBackend,
  onActionSelect,
  pageSize,
  currentPage,
  setCurrentPage,
  totalPages,
  loading,
  error,
}: RobotActionTabProps) {
  return (
    <div className="flex flex-col items-center w-full">
      {/* trạng thái loading/error */}
      {loading && <p>⏳ Đang tải...</p>}
      {error && <p className="text-red-500">{error}</p>}

      {!loading && !error && (
        <>
          <div className="flex items-center justify-between w-full mb-4">
            {/* Left Arrow */}
            <button
              onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
              className="p-3 bg-white rounded-full shadow-md hover:bg-gray-100 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
              disabled={currentPage === 1}
            >
              <ChevronLeft size={28} />
            </button>

            {/* Grid */}
            <div className="relative w-full overflow-hidden p-4">
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentPage}
                  initial={{ opacity: 0, x: 50 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -50 }}
                  transition={{ duration: 0.4, ease: "easeInOut" }}
                  className="grid grid-cols-4 gap-6"
                >
                  {actions.map((actionItem, index) => (
                    <div
                      key={actionItem.id}
                      className="flex flex-col items-center"
                    >
                      <button
                        onClick={() => {
                          setCurrentActionIndex(
                            (currentPage - 1) * pageSize + index
                          );
                          onActionSelect(actionItem);
                          sendCommandToBackend(actionItem.code);
                        }}
                        className={`w-24 h-24 rounded-full flex items-center justify-center shadow-md transition-all duration-200 hover:scale-110 ${
                          currentActionIndex ===
                          (currentPage - 1) * pageSize + index
                            ? `ring-4 ring-offset-2 ring-blue-400 bg-white`
                            : "bg-white hover:bg-gray-100"
                        }`}
                      >
                        {/* Ưu tiên hiển thị icon -> imageUrl -> fallback */}
                        {actionItem.icon ? (
                          <span className="text-2xl">{actionItem.icon}</span>
                        ) : actionItem.imageUrl ? (
                          <Image
                            src={actionItem.imageUrl}
                            alt={actionItem.name}
                            width={48}
                            height={48}
                            className="w-12 h-12 object-contain"
                            unoptimized
                          />
                        ) : (
                          <span className="text-2xl">🎬</span>
                        )}
                      </button>
                      <span className="text-xs font-medium text-gray-700 mt-2 text-center max-w-30 truncate">
                        {actionItem.name}
                      </span>
                    </div>
                  ))}
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Right Arrow */}
            <button
              onClick={() =>
                setCurrentPage(Math.min(totalPages, currentPage + 1))
              }
              className="p-3 bg-white rounded-full shadow-md hover:bg-gray-100 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
              disabled={currentPage >= totalPages}
            >
              <ChevronRight size={28} />
            </button>
          </div>

          {/* Pagination dots */}
          <RobotPaginationDots
            totalPages={totalPages}
            currentPage={currentPage - 1} // dots index từ 0
            setCurrentPage={(p) => setCurrentPage(p + 1)}
          />
        </>
      )}
    </div>
  );
}
