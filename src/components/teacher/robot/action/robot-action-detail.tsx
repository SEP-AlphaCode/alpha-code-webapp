"use client";

import { Volume2Icon } from "lucide-react";
import React from "react";

export interface RobotActionDetail {
  id: string;
  name: string;
  description?: string;
  image?: React.ReactNode;
  color?: string;
  commands: string[];
  bgColor?: string; // thêm luôn cho đồng bộ grid
}

interface RobotActionDetailProps {
  action: RobotActionDetail;
}

export function RobotActionDetail({ action }: RobotActionDetailProps) {
  return (
    <div className="bg-white rounded-2xl shadow-xl p-6 mb-8 relative">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Left - Image Area */}
        <div className="lg:col-span-1 flex flex-col items-center">
          <div
            className={`rounded-2xl h-64 w-64 flex items-center justify-center bg-gradient-to-br ${action.color} relative overflow-hidden`}
          >
            <div className="text-8xl z-10">{action.image}</div>
            <div className="absolute inset-0 bg-white/10"></div>
          </div>
          <div className="mt-4 p-4 bg-gray-50 rounded-xl w-full">
            <h3 className="font-semibold text-gray-700 mb-2">About this action</h3>
            <p className="text-gray-600 text-sm">{action.description}</p>
          </div>
        </div>

        {/* Right - Controls */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-gradient-to-r from-gray-800 to-gray-900 text-white p-5 rounded-xl shadow-md">
            <div className="text-center font-bold text-2xl">{action.name}</div>
          </div>

          <div className="space-y-4">
            <h3 className="font-semibold text-gray-700">Available Commands</h3>
            {action.commands.map((command, index) => (
              <div
                key={index}
                className="w-full p-4 text-left rounded-xl font-medium flex items-center bg-gray-100 text-gray-800"
              >
                <Volume2Icon size={16} className="mr-2 flex-shrink-0" />
                <span className="truncate">&quot;{command}&quot;</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
