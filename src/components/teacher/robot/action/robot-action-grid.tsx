// src/components/teacher/robot/action/robot-action-grid.tsx
"use client";

import { useState } from "react";
import { RobotActionTab } from "./robot-action-tab";
import { RobotActionCategory, RobotAction } from "@/types/robot";

export function RobotActionGrid({
  sendCommandToBackend,
  onActionSelect,
}: {
  sendCommandToBackend: (actionCode: string) => Promise<unknown>;
  onActionSelect: (action: RobotAction) => void;
}) {
  const [selectedTab, setSelectedTab] = useState<RobotActionCategory>("action");
  const [currentActionIndex, setCurrentActionIndex] = useState<number | null>(null);

  const apiUrls = {
    action: "/actions",
    dance: "/dances",
    funny: "/funnies",
  };

  return (
    <div className="flex flex-col items-center mb-4 w-full">
      {/* Tabs */}
      <div className="flex justify-center space-x-4 mb-6">
        {(["action", "dance", "funny"] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => {
              setSelectedTab(tab);
              setCurrentActionIndex(null); // Reset action index khi đổi tab
            }}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              selectedTab === tab
                ? "bg-blue-500 text-white"
                : "bg-gray-200 text-gray-700 hover:bg-gray-300"
            }`}
          >
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
          </button>
        ))}
      </div>

      {/* Tab content */}
      <RobotActionTab
        apiUrl={apiUrls[selectedTab]}
        currentActionIndex={currentActionIndex}
        setCurrentActionIndex={setCurrentActionIndex}
        sendCommandToBackend={sendCommandToBackend}
        onActionSelect={onActionSelect}
      />
    </div>
  );
}