"use client";

import { Volume2Icon } from "lucide-react";
import React from "react";
import { RobotActionUI } from "@/types/robot-ui";

interface RobotActionDetailProps {
  action: RobotActionUI;
}

export function RobotActionDetail({ action }: RobotActionDetailProps) {
  return (
    <div className="bg-white rounded-2xl shadow-xl p-6 mb-8 relative">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left - Image/Icon Area */}
        <div className="lg:col-span-1 flex flex-col items-center">
          <div className="rounded-2xl h-64 w-64 flex items-center justify-center bg-gray-50 relative overflow-hidden">
            {action.imageUrl ? (
              <img
                src={action.imageUrl}
                alt={action.name}
                className="object-contain h-full w-full"
              />
            ) : action.icon ? (
              <span className="text-8xl">{action.icon}</span>
            ) : (
              <div className="text-gray-400 text-4xl">?</div>
            )}
          </div>

          {/* About */}
          <div className="mt-4 p-4 bg-gray-50 rounded-xl w-full">
            <h3 className="font-semibold text-gray-700 mb-2">About this action</h3>
            <p className="text-gray-600 text-sm">
              {action.description || "No description available."}
            </p>
            {action.duration && (
              <p className="text-gray-500 text-xs mt-2">
                ⏱ Duration: {Math.round(action.duration / 1000)}s
              </p>
            )}
            <p className="text-gray-500 text-xs">Category: {action.category}</p>
          </div>
        </div>

        {/* Right - Details */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-gradient-to-r from-gray-800 to-gray-900 text-white p-5 rounded-xl shadow-md">
            <div className="text-center font-bold text-2xl">{action.name}</div>
            <div className="text-center text-sm text-gray-300">{action.code}</div>
          </div>

          {/* Available Commands (fake example, bạn nối sau nếu cần) */}
          {action.category === "action" && (
            <div className="space-y-4">
              <h3 className="font-semibold text-gray-700">Available Commands</h3>
              {/* Ví dụ nếu RobotAction có commands thì truyền thêm */}
              {"commands" in action && Array.isArray((action as any).commands) ? (
                (action as any).commands.map((cmd: string, idx: number) => (
                  <div
                    key={idx}
                    className="w-full p-4 text-left rounded-xl font-medium flex items-center bg-gray-100 text-gray-800"
                  >
                    <Volume2Icon size={16} className="mr-2 flex-shrink-0" />
                    <span className="truncate">"{cmd}"</span>
                  </div>
                ))
              ) : (
                <p className="text-sm text-gray-500">No commands available.</p>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
