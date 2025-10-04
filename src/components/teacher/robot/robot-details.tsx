import React from "react";
import { Button } from "@/components/ui/button";
import { Power, Settings, RefreshCw } from "lucide-react";

interface Robot {
  id: string;
  name: string;
  status: "online" | "offline" | "charging";
  battery: number;
  location: string;
  lastSeen: string;
  version: string;
  students: number;
  currentTask: string;
  uptime: string;
  ip: string;
  temperature: number;
  image: string;
  serialNumber: string;
}

interface RobotDetailsProps {
  robot: Robot;
  translations: {
    systemInfo: {
      title: string;
      firmware: string;
      temperature: string;
    };
    currentStatus: {
      title: string;
      status: string;
      task: string;
      battery: string;
      location: string;
    };
    quickActions: {
      title: string;
      restart: string;
      settings: string;
      updateFirmware: string;
    };
    statusTexts: {
      online: string;
      offline: string;
      charging: string;
    };
  };
}

export function RobotDetails({ robot, translations }: RobotDetailsProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case "online":
        return "bg-green-100 text-green-800";
      case "offline":
        return "bg-gray-100 text-gray-800";
      case "charging":
        return "bg-yellow-100 text-yellow-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getBatteryColor = (battery: number) => {
    if (battery > 60) return "bg-green-500";
    if (battery > 30) return "bg-yellow-500";
    return "bg-red-500";
  };

  const getStatusText = (status: Robot["status"]) => {
    switch (status) {
      case "online":
        return translations.statusTexts.online;
      case "offline":
        return translations.statusTexts.offline;
      case "charging":
        return translations.statusTexts.charging;
      default:
        return status;
    }
  };

  return (
    <section className="mt-8">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* System Info */}
        <div className="bg-white rounded-xl shadow p-6 border border-gray-100">
          <h4 className="font-semibold text-lg text-blue-700 mb-4">
            {translations.systemInfo.title}
          </h4>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-400">ID:</span>
              <span className="text-gray-900 font-medium">{robot.id}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">{translations.systemInfo.firmware}:</span>
              <span className="text-gray-900 font-medium">{robot.version}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">IP:</span>
              <span className="text-gray-900 font-medium">{robot.ip}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">{translations.systemInfo.temperature}:</span>
              <span className="text-gray-900 font-medium">{robot.temperature}°C</span>
            </div>
          </div>
        </div>

        {/* Current Status */}
        <div className="bg-white rounded-xl shadow p-6 border border-gray-100">
          <h4 className="font-semibold text-lg text-blue-700 mb-4">
            {translations.currentStatus.title}
          </h4>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-400">{translations.currentStatus.status}:</span>
              <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${getStatusColor(robot.status)}`}>
                {getStatusText(robot.status)}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">{translations.currentStatus.task}:</span>
              <span className="text-gray-900 font-medium">{robot.currentTask}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">{translations.currentStatus.battery}:</span>
              <span className="text-gray-900 font-medium">{robot.battery}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2 my-2">
              <div
                className={`h-2 rounded-full ${getBatteryColor(robot.battery)}`}
                style={{ width: `${robot.battery}%` }}
              ></div>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">{translations.currentStatus.location}:</span>
              <span className="text-gray-900 font-medium">{robot.location}</span>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-xl shadow p-6 border border-gray-100 flex flex-col justify-center">
          <h4 className="font-semibold text-lg text-blue-700 mb-4">
            {translations.quickActions.title}
          </h4>
          <div className="space-y-3">
            <Button className="w-full text-base py-3" variant="outline">
              <Power className="h-5 w-5 mr-2" />
              {translations.quickActions.restart}
            </Button>
            <Button className="w-full text-base py-3" variant="outline">
              <Settings className="h-5 w-5 mr-2" />
              {translations.quickActions.settings}
            </Button>
            <Button className="w-full text-base py-3" variant="outline">
              <RefreshCw className="h-5 w-5 mr-2" />
              {translations.quickActions.updateFirmware}
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}