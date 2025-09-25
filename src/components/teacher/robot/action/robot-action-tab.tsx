// src/components/teacher/robot/action/robot-action-tab.tsx
"use client";

import { useEffect, useState, Dispatch, SetStateAction } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import type { RobotAction } from "@/types/robot";
import { springHttp } from "@/utils/http";
import { RobotPaginationDots } from "./robot-pagination.dots";

interface RobotActionTabProps {
  apiUrl: string;
  currentActionIndex: number | null;
  setCurrentActionIndex: Dispatch<SetStateAction<number | null>>;
  sendCommandToBackend: (actionCode: string) => Promise<unknown>;
  onActionSelect: (action: RobotAction) => void;
}

export function RobotActionTab({
  apiUrl,
  currentActionIndex,
  setCurrentActionIndex,
  sendCommandToBackend,
  onActionSelect,
}: RobotActionTabProps) {
  const [actions, setActions] = useState<RobotAction[]>([]);
  const [currentPage, setCurrentPage] = useState(0);
  const actionsPerPage = 8;

  useEffect(() => {
    springHttp.get(apiUrl).then((res) => {
      setActions(res.data.data);
      setCurrentPage(0);
    });
  }, [apiUrl]);

  const pagedActions = actions.slice(
    currentPage * actionsPerPage,
    (currentPage + 1) * actionsPerPage
  );
  const pageCount = Math.ceil(actions.length / actionsPerPage);

  return (
    <div className="flex flex-col items-center w-full">
      <div className="flex items-center justify-between w-full mb-4">
        {/* Left Arrow */}
        <button
          onClick={() => setCurrentPage((p) => Math.max(0, p - 1))}
          className="p-3 bg-white rounded-full shadow-md hover:bg-gray-100 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
          disabled={currentPage === 0}
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
              {pagedActions.map((actionItem, index) => (
                <div key={actionItem.id} className="flex flex-col items-center">
                  <button
                    onClick={() => {
                      setCurrentActionIndex(currentPage * actionsPerPage + index);
                      onActionSelect(actionItem);
                      sendCommandToBackend(actionItem.code);
                    }}
                    className={`w-24 h-24 rounded-full flex items-center justify-center shadow-md transition-all duration-200 hover:scale-110 ${
                      currentActionIndex === currentPage * actionsPerPage + index
                        ? `ring-4 ring-offset-2 ring-blue-400 bg-white`
                        : "bg-white hover:bg-gray-100"
                    }`}
                  >
                    {actionItem.imageUrl ? (
                      <img
                        src={actionItem.imageUrl}
                        alt={actionItem.name}
                        className="w-12 h-12 object-contain"
                      />
                    ) : (
                      <span className="text-2xl">🎬</span>
                    )}
                  </button>
                  <span className="text-xs font-medium text-gray-700 mt-2 text-center max-w-16 truncate">
                    {actionItem.name}
                  </span>
                </div>
              ))}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Right Arrow */}
        <button
          onClick={() => setCurrentPage((p) => Math.min(pageCount - 1, p + 1))}
          className="p-3 bg-white rounded-full shadow-md hover:bg-gray-100 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
          disabled={currentPage >= pageCount - 1}
        >
          <ChevronRight size={28} />
        </button>
      </div>

      <RobotPaginationDots
        totalPages={pageCount}
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
      />
    </div>
  );
}