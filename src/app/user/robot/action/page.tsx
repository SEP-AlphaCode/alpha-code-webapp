// src/components/user/robot/action/robot-action-page.tsx
"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import Image from "next/image";
import { RobotActionHeader } from "@/components/user/robot/action/robot-action-header";
import { RobotActionDetail } from "@/components/user/robot/action/robot-action-detail";
import { RobotActionGrid } from "@/components/user/robot/action/robot-action-grid";
import { RobotSelector } from "@/components/user/robot-selector";
import { useRobotCommand } from "@/hooks/use-robot-command";
import { useRobotStore } from "@/hooks/use-robot-store";
import { AnimatePresence, motion } from "framer-motion";
import type { RobotAction } from "@/types/robot";
import type { RobotActionUI } from "@/types/robot-ui";

export default function RobotActionPage() {
  // notify state + timeout ref for cleanup
  const [notify, setNotifyState] = useState<{ msg: string; type: "success" | "error" } | null>(null);
  const notifyTimeoutRef = useRef<number | null>(null);
  const [sending, setSending] = useState(false);

  const setNotify = useCallback((msg: string, type: "success" | "error") => {
    setNotifyState({ msg, type });
    // clear previous timeout if any
    if (notifyTimeoutRef.current) {
      window.clearTimeout(notifyTimeoutRef.current);
    }
    notifyTimeoutRef.current = window.setTimeout(() => {
      setNotifyState(null);
      notifyTimeoutRef.current = null;
    }, 2500);
  }, []);

  // cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (notifyTimeoutRef.current) {
        window.clearTimeout(notifyTimeoutRef.current);
      }
    };
  }, []);

  const { sendCommandToBackend } = useRobotCommand(setNotify);

  // 👇 Cho phép state nhận cả RobotAction lẫn RobotActionUI
  const [currentAction, setCurrentAction] = useState<RobotAction | RobotActionUI | null>(null);
  const direction = 0;

  const { selectedRobot, selectedRobotSerial, initializeMockData, robots, connectMode } = useRobotStore();

  // CALL initializeMockData only once on mount.
  // If your linter complains about missing deps, it's safe here because we explicitly want run-once.
  useEffect(() => {
    // Guard: if initializeMockData might be undefined, check it
    try {
      if (typeof initializeMockData === "function") {
        initializeMockData();
      }
    } catch (err) {
      // optional: log so you can inspect errors during init
      // console.error("initializeMockData error", err);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // memoized handlers to avoid re-creating functions every render
  const handlePrevAction = useCallback(() => {
    // TODO: implement prev logic
  }, []);

  const handleNextAction = useCallback(() => {
    // TODO: implement next logic
  }, []);

  const handleSendCommand = useCallback(
    async (
      actionCode: string,
      type: "action" | "expression" | "skill_helper" | "extended_action" | "process-text" = "action"
    ) => {
      // prepare targets: either array (multi) or single
      const targets: string[] = Array.isArray(selectedRobotSerial)
        ? selectedRobotSerial
        : selectedRobotSerial
        ? [selectedRobotSerial]
        : [];

      if (targets.length === 0) {
        setNotify("Bạn chưa chọn robot!", "error");
        return;
      }

      // Find offline targets and fail early for them (don't attempt send)
      const offlineTargets = targets
        .map((s) => robots.find((r) => r.serial === s))
        .filter((r) => r && r.status === "offline") as typeof robots;

      if (offlineTargets.length > 0) {
        setNotify(
          `Một số robot đang offline: ${offlineTargets.map((r) => r?.name || r?.serial).join(", ")}`,
          "error"
        );
        // Option: remove offline ones from targets and continue with online ones
        // If you prefer to stop entirely, return here. We'll remove offline and continue.
      }

      const onlineTargets = targets.filter(
        (s) => !offlineTargets.some((r) => r?.serial === s)
      );

      if (onlineTargets.length === 0) {
        // nothing to send to
        return;
      }

      setSending(true);
      try {
        // Send requests in parallel and collect results
        const promises = onlineTargets.map((serial) =>
          sendCommandToBackend(actionCode, serial, type)
            .then(() => ({ serial, status: "fulfilled" as const }))
            .catch((err) => ({ serial, status: "rejected" as const, error: err }))
        );

        // Wait for all to settle
        const results = await Promise.all(promises);

        // Analyze results
        const succeeded = results.filter((r) => r.status === "fulfilled");
        const failed = results.filter((r) => r.status === "rejected");

        // Notify with summary
        if (failed.length === 0) {
          setNotify(`✅ Đã gửi hành động cho ${succeeded.length} robot.`, "success");
        } else if (succeeded.length === 0) {
          setNotify(`❌ Gửi thất bại cho tất cả ${failed.length} robot.`, "error");
        } else {
          setNotify(
            `✅ ${succeeded.length} thành công, ❌ ${failed.length} thất bại.`,
            "success"
          );
        }

        // Optional: console log details for debugging
        if (failed.length > 0) {
          console.warn("Some robot sends failed:", failed);
        }
      } catch (err) {
        console.error("Unexpected error sending commands:", err);
        setNotify("❌ Gửi lệnh thất bại! Lỗi hệ thống.", "error");
      } finally {
        setSending(false);
      }
    },
    [selectedRobotSerial, selectedRobot, sendCommandToBackend, setNotify, robots]
  );

  const onActionSelect = useCallback((action: RobotAction | RobotActionUI) => {
    setCurrentAction(action);
  }, []);

  return (
    <div className="min-h-screen">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 pb-20">
        <RobotActionHeader />

        {currentAction ? (
          <div className="relative">
            <AnimatePresence mode="wait" initial={false} custom={direction}>
              <motion.div
                key={(currentAction as any).id}
                custom={direction}
                initial={{ x: direction > 0 ? 100 : -100, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: direction > 0 ? -100 : 100, opacity: 0 }}
                transition={{ duration: 0.4, ease: "easeInOut" }}
              >
                <RobotActionDetail
                  action={{
                    id: (currentAction as any).id,
                    name: (currentAction as any).name,
                    description: (currentAction as any).description ?? "",
                    code: (currentAction as any).code,
                    duration: (currentAction as any).duration,
                    category: (currentAction as RobotActionUI).category ?? "action",
                    imageUrl: (currentAction as RobotActionUI).imageUrl ?? null,
                    icon: (currentAction as RobotActionUI).icon ?? null,
                    status: (currentAction as RobotActionUI).status,
                    statusText: (currentAction as RobotActionUI).statusText ?? "",
                    createdDate: (currentAction as any).createdDate,
                    lastUpdate: (currentAction as any).lastUpdate,
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

        <RobotActionGrid
          sendCommandToBackend={(actionCode, type) => handleSendCommand(actionCode, type)}
          onActionSelect={onActionSelect}
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
