"use client";

import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";

export function RobotActionGrid({
  actions,
  currentPage,
  totalPages,
  prevPage,
  nextPage,
  currentPageActions,
  currentAction,
  setCurrentAction,
  sendCommandToBackend,
}: any) {
  const actionsPerPage = 8;

  return (
    <div className="flex flex-col items-center mb-4">
      <div className="flex items-center justify-between w-full mb-4">
        {/* Left Arrow */}
        <button
          onClick={prevPage}
          className="p-3 bg-white rounded-full shadow-md hover:bg-gray-100 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
          disabled={currentPage === 0}
        >
          <ChevronLeft size={28} />
        </button>

        {/* Circle Grid */}
        <div className="relative w-full overflow-hidden p-4">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentPage}
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              transition={{ duration: 0.4, ease: "easeInOut" }}
              className="grid grid-cols-4 gap-6 mx-15"
            >
              {currentPageActions.map((actionItem: any, index: number) => (
                <div key={actionItem.id} className="flex flex-col items-center">
                  <button
                    onClick={() => {
                      setCurrentAction(currentPage * actionsPerPage + index);
                      sendCommandToBackend();
                    }}
                    className={`w-24 h-24 rounded-full flex items-center justify-center shadow-md transition-all duration-200 hover:scale-110 ${
                      currentAction === currentPage * actionsPerPage + index
                        ? `ring-4 ring-offset-2 ring-blue-400 ${actionItem.bgColor}`
                        : "bg-white hover:bg-gray-100"
                    }`}
                  >
                    <div className="text-2xl">{actionItem.image}</div>
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
          onClick={nextPage}
          className="p-3 bg-white rounded-full shadow-md hover:bg-gray-100 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
          disabled={currentPage === totalPages - 1}
        >
          <ChevronRight size={28} />
        </button>
      </div>
    </div>
  );
}
