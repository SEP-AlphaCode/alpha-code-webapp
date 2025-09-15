"use client";

import React, { useState, useEffect } from "react";
import { useI18n } from "@/lib/i18n/provider";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import Image from "next/image";
import {
  Battery,
  WifiOff,
  Power,
  Settings,
  Activity,
  MapPin,
  Zap,
  CheckCircle,
  RefreshCw,
} from "lucide-react";

// Import tĩnh cả hai file ngôn ngữ
import viTranslations from "@/lib/i18n/dictionaries/teacher/teacher.vi.json";
import enTranslations from "@/lib/i18n/dictionaries/teacher/teacher.en.json";

const translations: Record<string, any> = {
  vi: viTranslations,
  en: enTranslations,
};

// Hàm xáo trộn mảng ngẫu nhiên
function shuffleArray(array: string[]) {
  const newArray = [...array];
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
  }
  return newArray;
}

export default function TeacherDashboard() {
  const { locale } = useI18n();
  const t = translations[locale];
  const [selectedRobot, setSelectedRobot] = useState<string | null>(null);
  const [shuffledPrompts, setShuffledPrompts] = useState<string[]>([]);

  useEffect(() => {
    if (t?.things_to_try?.prompts) {
      setShuffledPrompts(shuffleArray(t.things_to_try.prompts));
    }
  }, [locale, t]);

  const handleRefreshPrompts = () => {
    if (t?.things_to_try?.prompts) {
      setShuffledPrompts(shuffleArray(t.things_to_try.prompts));
    }
  };

  const getRowItems = (start: number, count: number) => {
    if (!shuffledPrompts || shuffledPrompts.length === 0) {
      return Array.from({ length: count }, () => "");
    }
    const items: string[] = [];
    for (let i = 0; i < count; i++) {
      items.push(shuffledPrompts[(start + i) % shuffledPrompts.length]);
    }
    return items;
  };

  if (!t) return <div>Loading translations...</div>;

  const robots = [
    {
      id: "Alpha-01",
      name: "Alpha Mini 01",
      status: "online",
      battery: 94,
      location: "Classroom A",
      lastSeen: "2 minutes ago",
      version: "v2.1.3",
      students: 6,
      currentTask: "Teaching Colors",
      uptime: "4h 23m",
      ip: "192.168.1.101",
      temperature: 32,
      image: "/alpha-mini-2.webp",
    },
    {
      id: "Alpha-02",
      name: "Alpha Mini 02",
      status: "online",
      battery: 73,
      location: "Classroom B",
      lastSeen: "1 minute ago",
      version: "v2.1.3",
      students: 4,
      currentTask: "Programming Basics",
      uptime: "3h 45m",
      ip: "192.168.1.102",
      temperature: 29,
      image: "/alpha-mini-2.webp",
    },
    {
      id: "Alpha-03",
      name: "Alpha Mini 03",
      status: "offline",
      battery: 37,
      location: "Charging Station",
      lastSeen: "15 minutes ago",
      version: "v2.1.3",
      students: 0,
      currentTask: "Idle",
      uptime: "0h 0m",
      ip: "192.168.1.103",
      temperature: 25,
      image: "/alpha-mini-2.webp",
    },
    {
      id: "Alpha-04",
      name: "Alpha Mini 04",
      status: "charging",
      battery: 61,
      location: "Classroom D",
      lastSeen: "5 minutes ago",
      version: "v2.1.3",
      students: 0,
      currentTask: "Charging",
      uptime: "0h 0m",
      ip: "192.168.1.104",
      temperature: 28,
      image: "/alpha-mini-2.webp",
    },
  ];

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

  const selectedRobotDetails = robots.find((robot) => robot.id === selectedRobot);

  return (
    <div className="space-y-10 p-8 bg-gradient-to-br from-blue-50 to-white min-h-screen">
      {/* Header */}
      <header className="sticky top-0 z-10 bg-white/80 backdrop-blur border-b border-gray-200 mb-6 py-4 px-6 rounded-xl shadow flex items-center justify-between">
        <h1 className="text-3xl font-bold text-blue-900 tracking-tight">{t.header.title}</h1>
        <span className="text-base text-gray-500 font-medium">Manage and interact with your AlphaMini robots</span>
      </header>

      {/* Robot Selector - horizontal cards */}
      <section>
        <h2 className="text-2xl font-semibold text-blue-800 mb-4">{t.robot_selection.title}</h2>
        <div className="flex gap-6 overflow-x-auto pb-2 hide-scrollbar">
          {robots.map((robot) => (
            <div
              key={robot.id}
              className={`min-w-[320px] bg-white rounded-2xl shadow-lg border border-gray-100 p-5 flex flex-col items-center transition-transform duration-200 hover:scale-105 cursor-pointer ${selectedRobot === robot.id ? "ring-2 ring-blue-400" : ""}`}
              onClick={() => setSelectedRobot(robot.id)}
            >
              <Image src={robot.image} alt={robot.name} width={80} height={80} className="rounded-full object-cover mb-2" />
              <span className="font-bold text-lg text-gray-900 mb-1">{robot.name}</span>
              <span className="text-xs text-gray-400 mb-2">{robot.id}</span>
              <div className="flex items-center gap-2 mb-2">
                {getStatusIcon(robot.status)}
                <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${getStatusColor(robot.status)}`}>{robot.status === 'online' ? t.robot_selection.status_online : (robot.status === 'offline' ? t.robot_selection.status_offline : t.robot_selection.charging)}</span>
              </div>
              <div className="flex items-center gap-2 mb-2">
                <Battery className="h-4 w-4" />
                <span className="font-semibold text-sm">{robot.battery}%</span>
                <div className="w-20 h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div className={`h-2 rounded-full ${getBatteryColor(robot.battery)}`} style={{ width: `${robot.battery}%` }}></div>
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

      {/* Selected Robot Details */}
      {selectedRobotDetails && (
        <section className="mt-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* System Info */}
            <div className="bg-white rounded-xl shadow p-6 border border-gray-100">
              <h4 className="font-semibold text-lg text-blue-700 mb-4">{t.robot_selection.system_info.title}</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between"><span className="text-gray-400">ID:</span><span className="text-gray-900 font-medium">{selectedRobotDetails.id}</span></div>
                <div className="flex justify-between"><span className="text-gray-400">{t.robot_selection.system_info.firmware}:</span><span className="text-gray-900 font-medium">{selectedRobotDetails.version}</span></div>
                <div className="flex justify-between"><span className="text-gray-400">IP:</span><span className="text-gray-900 font-medium">{selectedRobotDetails.ip}</span></div>
                <div className="flex justify-between"><span className="text-gray-400">{t.robot_selection.system_info.temperature}:</span><span className="text-gray-900 font-medium">{selectedRobotDetails.temperature}°C</span></div>
              </div>
            </div>
            {/* Current Status */}
            <div className="bg-white rounded-xl shadow p-6 border border-gray-100">
              <h4 className="font-semibold text-lg text-blue-700 mb-4">{t.robot_selection.current_status.title}</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between"><span className="text-gray-400">{t.robot_selection.current_status.status}:</span><span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${getStatusColor(selectedRobotDetails.status)}`}>{selectedRobotDetails.status === 'online' ? t.robot_selection.status_online : (selectedRobotDetails.status === 'offline' ? t.robot_selection.status_offline : t.robot_selection.charging)}</span></div>
                <div className="flex justify-between"><span className="text-gray-400">{t.robot_selection.current_status.task}:</span><span className="text-gray-900 font-medium">{selectedRobotDetails.currentTask}</span></div>
                <div className="flex justify-between"><span className="text-gray-400">{t.robot_selection.current_status.battery}:</span><span className="text-gray-900 font-medium">{selectedRobotDetails.battery}%</span></div>
                <div className="w-full bg-gray-200 rounded-full h-2 my-2">
                  <div className={`h-2 rounded-full ${getBatteryColor(selectedRobotDetails.battery)}`} style={{ width: `${selectedRobotDetails.battery}%` }}></div>
                </div>
                <div className="flex justify-between"><span className="text-gray-400">{t.robot_selection.current_status.location}:</span><span className="text-gray-900 font-medium">{selectedRobotDetails.location}</span></div>
              </div>
            </div>
            {/* Quick Actions */}
            <div className="bg-white rounded-xl shadow p-6 border border-gray-100 flex flex-col justify-center">
              <h4 className="font-semibold text-lg text-blue-700 mb-4">{t.robot_selection.quick_actions.title}</h4>
              <div className="space-y-3">
                <Button className="w-full text-base py-3" variant="outline"><Power className="h-5 w-5 mr-2" />{t.robot_selection.quick_actions.restart}</Button>
                <Button className="w-full text-base py-3" variant="outline"><Settings className="h-5 w-5 mr-2" />{t.robot_selection.quick_actions.settings}</Button>
                <Button className="w-full text-base py-3" variant="outline"><RefreshCw className="h-5 w-5 mr-2" />{t.robot_selection.quick_actions.update_firmware}</Button>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Programming Section */}
      <section className="mt-10">
        <h2 className="text-2xl font-semibold text-blue-800 mb-4">{t.programming.title}</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <Card className="p-8 text-center cursor-pointer bg-white text-blue-900 shadow-lg hover:scale-105 transition-transform border border-gray-200">
            <CardHeader className="flex items-center justify-center"><div className="text-4xl">✍️</div></CardHeader>
            <CardContent><p className="font-medium text-lg">{t.programming.create_actions}</p></CardContent>
          </Card>
          <Card className="p-8 text-center cursor-pointer bg-gray-100 text-blue-900 shadow-lg hover:scale-105 transition-transform border border-gray-200">
            <CardHeader className="flex items-center justify-center"><div className="text-4xl">📂</div></CardHeader>
            <CardContent><p className="font-medium text-lg">{t.programming.workspace}</p></CardContent>
          </Card>
          <Card className="p-8 text-center cursor-pointer bg-blue-100 text-blue-900 shadow-lg hover:scale-105 transition-transform border border-gray-200">
            <CardHeader className="flex items-center justify-center"><div className="text-4xl">🎨</div></CardHeader>
            <CardContent><p className="font-medium text-lg">{t.programming.my_works}</p></CardContent>
          </Card>
        </div>
      </section>

      {/* Entertainment Section */}
      <section className="mt-10">
        <h2 className="text-2xl font-semibold text-blue-800 mb-4">{t.entertainment.title}</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <Card className="p-8 text-center cursor-pointer bg-red-400 text-white shadow-lg hover:scale-105 transition-transform border border-gray-200">
            <CardHeader className="flex items-center justify-center"><div className="text-4xl">🕺</div></CardHeader>
            <CardContent><p className="font-medium text-lg">{t.entertainment.action}</p></CardContent>
          </Card>
          <Card className="p-8 text-center cursor-pointer bg-blue-400 text-white shadow-lg hover:scale-105 transition-transform border border-gray-200">
            <CardHeader className="flex items-center justify-center"><div className="text-4xl">🖼️</div></CardHeader>
            <CardContent><p className="font-medium text-lg">{t.entertainment.album}</p></CardContent>
          </Card>
          <Card className="p-8 text-center cursor-pointer bg-yellow-400 text-white shadow-lg hover:scale-105 transition-transform border border-gray-200">
            <CardHeader className="flex items-center justify-center"><div className="text-4xl">🤝</div></CardHeader>
            <CardContent><p className="font-medium text-lg">{t.entertainment.friends}</p></CardContent>
          </Card>
        </div>
      </section>

      {/* Things to Try Section */}
      <section className="mt-10">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-semibold text-blue-800">{t.things_to_try.title}</h2>
          <Button variant="ghost" className="text-blue-600 hover:text-blue-800" onClick={handleRefreshPrompts}>
            <RefreshCw className="h-4 w-4 mr-2" />{t.things_to_try.refresh}
          </Button>
        </div>
        <style jsx>{`
          @keyframes marquee {
            0% { transform: translateX(0); }
            100% { transform: translateX(-50%); }
          }
          .marquee-row {
            display: flex;
            animation-name: marquee;
            animation-timing-function: linear;
            animation-iteration-count: infinite;
            animation-duration: 30s;
            animation-direction: normal;
            will-change: transform;
          }
          .marquee-row:hover {
            animation-play-state: paused;
          }
        `}</style>
        <div className="overflow-hidden w-full flex flex-col gap-4">
          {[
            { start: 0, count: 12, duration: "30s", direction: "normal" },
            { start: 6, count: 14, duration: "35s", direction: "reverse" },
            { start: 3, count: 13, duration: "32s", direction: "normal" },
          ].map((row, rowIndex) => {
            const items = getRowItems(row.start, row.count);
            return (
              <div
                key={rowIndex}
                className="marquee-row"
                style={{
                  animationDuration: row.duration,
                  animationDirection: row.direction,
                }}
              >
                {[...items, ...items].map((prompt, i) => (
                  <div key={i} className="flex-shrink-0 p-5 bg-white rounded-xl shadow border border-gray-200 hover:bg-blue-50 transition-colors cursor-pointer text-blue-900 font-medium text-base min-w-[260px] mx-2">
                    {prompt}
                  </div>
                ))}
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
}