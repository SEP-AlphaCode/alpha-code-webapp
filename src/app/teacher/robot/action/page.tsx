"use client";

import { useState } from "react";
import { RobotActionHeader } from "@/components/teacher/robot/action/robot-action-header";
import { RobotActionDetail } from "@/components/teacher/robot/action/robot-action-detail";
import { RobotActionGrid } from "@/components/teacher/robot/action/robot-action-grid";
import { RobotPaginationDots } from "@/components/teacher/robot/action/robot-pagination.dots";
import { useRobotCommand } from "@/hooks/use-robot-command";

import { AnimatePresence, motion } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
export default function RobotActionPage() {
  const actions: RobotActionDetail[] = [
    {
      id: "tai-chi",
      name: "Tai Chi",
      description: "Perform graceful tai chi movements",
      image: "🧘‍♂️",
      commands: ["Do a tai chi move", "Do some tai chi moves", "Perform some tai chi moves"],
      color: "from-blue-400 to-cyan-400",
    },
    {
      id: "push-up",
      name: "Push-ups",
      description: "Execute strength training push-ups",
      image: "💪",
      commands: ["Do a push-up", "Show me eight push-ups", "Show me a push-up"],
      color: "from-red-400 to-orange-400",
    },
    {
      id: "kungfu",
      name: "Kung Fu",
      description: "Practice Chinese martial arts",
      image: "🥋",
      commands: ["Show me Kung fu", "Practice kung fu", "Practice Chinese kung fu"],
      color: "from-amber-500 to-yellow-400",
    },
    {
      id: "yoga",
      name: "Yoga",
      description: "Demonstrate yoga poses and stretches",
      image: "🧘‍♀️",
      commands: ["Do a yoga pose", "Show me some yoga", "Practice yoga"],
      color: "from-purple-400 to-pink-400",
    },
    {
      id: "lunge",
      name: "Lunge",
      description: "Perform lower body lunge exercises",
      image: "🏃‍♂️",
      commands: ["Do a lunge", "Show me a lunge", "Perform a lunge"],
      color: "from-green-400 to-emerald-400",
    },
    {
      id: "nod",
      name: "Nod",
      description: "Simple head nodding gesture",
      image: "👤",
      commands: ["Nod your head", "Show me a nod", "Give a nod"],
      color: "from-gray-400 to-slate-400",
    },
    {
      id: "raise-hand",
      name: "Raise Hand",
      description: "Raise hand up in the air",
      image: "✋",
      commands: ["Raise your hand", "Put your hand up", "Hand up"],
      color: "from-indigo-400 to-blue-400",
    },
    {
      id: "lift-foot",
      name: "Lift Foot",
      description: "Lift right foot off the ground",
      image: "👣",
      commands: ["Lift your right foot", "Raise your right foot", "Pick up your right foot"],
      color: "from-teal-400 to-cyan-400",
    },
    {
      id: "lift-left-foot",
      name: "Lift Left Foot",
      description: "Lift left foot off the ground",
      image: "🦶",
      commands: ["Lift your left foot", "Raise your left foot", "Pick up your left foot"],
      color: "from-yellow-400 to-yellow-600",
    },
    {
      id: "bow",
      name: "Bow",
      description: "Bow politely as a greeting",
      image: "🙏",
      commands: ["Bow", "Give a bow", "Make a bow"],
      color: "from-purple-400 to-fuchsia-500",
    },
    {
      id: "sit-down",
      name: "Sit Down",
      description: "Sit down and rest",
      image: "🪑",
      commands: ["Sit down", "Take a seat", "Please sit down"],
      color: "from-orange-400 to-red-400",
    },
  ];

  const [currentAction, setCurrentAction] = useState<number | null>(null);
  const [direction, setDirection] = useState<number>(0); // -1 left, +1 right
  const [notify, setNotifyState] = useState<{ msg: string; type: "success" | "error" } | null>(
    null
  );

  const setNotify = (msg: string, type: "success" | "error") => {
    setNotifyState({ msg, type });
    setTimeout(() => setNotifyState(null), 2500);
  };

  const [currentPage, setCurrentPage] = useState(0);
  const actionsPerPage = 8;
  const totalPages = Math.ceil(actions.length / actionsPerPage);

  const { sendCommandToBackend } = useRobotCommand(setNotify);

  const currentPageActions = actions.slice(
    currentPage * actionsPerPage,
    (currentPage + 1) * actionsPerPage
  );

  const action = currentAction !== null ? actions[currentAction] : null;

  const handlePrevAction = () => {
    setDirection(-1);
    setCurrentAction((prev) => {
      if (prev === null) return 0;
      return (prev - 1 + actions.length) % actions.length;
    });
  };

  const handleNextAction = () => {
    setDirection(1);
    setCurrentAction((prev) => {
      if (prev === null) return 0;
      return (prev + 1) % actions.length;
    });
  };

  return (
    <div className="min-h-screen">
      <div className="max-w-6xl mx-auto">
        <RobotActionHeader />

        {currentAction !== null && action ? (
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
                <RobotActionDetail action={action} />
              </motion.div>
            </AnimatePresence>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center min-h-[50vh] text-center">
            <img
              src="/img_action_default.webp"
              alt="AlphaMini ready"
              className="w-64 h-auto mb-4"
            />
            <h2 className="text-xl md:text-2xl font-semibold text-gray-700">
              Tap an action below to make AlphaMini move!
            </h2>
          </div>
        )}

        <RobotActionGrid
          currentPage={currentPage}
          totalPages={totalPages}
          prevPage={() => setCurrentPage((prev) => (prev - 1 + totalPages) % totalPages)}
          nextPage={() => setCurrentPage((prev) => (prev + 1) % totalPages)}
          currentPageActions={currentPageActions}
          currentAction={currentAction ?? -1}
          setCurrentAction={setCurrentAction}
          sendCommandToBackend={sendCommandToBackend}
        />

        <RobotPaginationDots
          totalPages={totalPages}
          currentPage={currentPage}
          setCurrentPage={setCurrentPage}
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
