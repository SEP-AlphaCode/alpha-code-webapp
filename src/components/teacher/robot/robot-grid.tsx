import React from "react";
import Image from "next/image";
import { Battery, MapPin, CheckCircle, WifiOff, Zap, Activity } from "lucide-react";

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
}

interface RobotGridProps {
  robots: Robot[];
  selectedRobot: string | null;
  onRobotSelect: (robotId: string) => void;
  sectionTitle: string;
  statusTexts: {
    online: string;
    offline: string;
    charging: string;
  };
}

export function RobotGrid({
  robots,
  selectedRobot,
  onRobotSelect,
  sectionTitle,
  statusTexts,
}: RobotGridProps) {
  const getStatusIcon = (status: string) => {
    switch (status) {
      case "online":
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case "offline":
        return <WifiOff className="h-4 w-4 text-gray-500" />;
      case "charging":
        return <Zap className="h-4 w-4 text-yellow-500" />;
      default:
        return <Activity className="h-4 w-4" />;
    }
  };

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
        return statusTexts.online;
      case "offline":
        return statusTexts.offline;
      case "charging":
        return statusTexts.charging;
      default:
        return status;
    }
  };

  return (
    <section>
      <h2 className="text-2xl font-semibold text-blue-800 mb-4">{sectionTitle}</h2>
      <div className="flex gap-6 overflow-x-auto p-5 hide-scrollbar">
        {robots.map((robot) => (
          <div
            key={robot.id}
            className={`min-w-[320px] bg-white rounded-2xl shadow-lg border border-gray-100 p-5 flex flex-col items-center transition-transform duration-200 hover:scale-105 cursor-pointer ${
              selectedRobot === robot.id ? "ring-2 ring-blue-400" : ""
            }`}
            onClick={() => onRobotSelect(robot.id)}
          >
            <Image
              src={robot.image}
              alt={robot.name}
              width={80}
              height={80}
              className="rounded-full object-cover mb-2"
            />
            <span className="font-bold text-lg text-gray-900 mb-1">{robot.name}</span>
            <span className="text-xs text-gray-400 mb-2">{robot.id}</span>
            <div className="flex items-center gap-2 mb-2">
              {getStatusIcon(robot.status)}
              <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${getStatusColor(robot.status)}`}>
                {getStatusText(robot.status)}
              </span>
            </div>
            <div className="flex items-center gap-2 mb-2">
              <Battery className="h-4 w-4" />
              <span className="font-semibold text-sm">{robot.battery}%</span>
              <div className="w-20 h-2 bg-gray-200 rounded-full overflow-hidden">
                <div
                  className={`h-2 rounded-full ${getBatteryColor(robot.battery)}`}
                  style={{ width: `${robot.battery}%` }}
                ></div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <MapPin className="h-4 w-4 text-blue-400" />
              <span className="text-sm text-gray-600">{robot.location}</span>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}