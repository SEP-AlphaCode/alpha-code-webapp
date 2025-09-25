"use client";

import React, { useState, useEffect } from "react";
import { useI18n } from "@/lib/i18n/provider";

// Import extracted components
import { RobotPageHeader } from "@/components/teacher/robot/robot-page-header";
import { RobotGrid } from "@/components/teacher/robot/robot-grid";
import { RobotDetails } from "@/components/teacher/robot/robot-details";
import { ProgrammingSection } from "@/components/teacher/robot/programming-section";
import { EntertainmentSection } from "@/components/teacher/robot/entertainment-section";
import { ThingsToTrySection } from "@/components/teacher/robot/things-to-try-section";

// Import tĩnh cả hai file ngôn ngữ
import viTranslations from "@/lib/i18n/dictionaries/teacher/teacher.vi.json";
import enTranslations from "@/lib/i18n/dictionaries/teacher/teacher.en.json";

type TeacherTranslations = typeof viTranslations;
const translations: Record<string, TeacherTranslations> = {
  vi: viTranslations,
  en: enTranslations,
};

// Define Robot type to match component expectations
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

  if (!t) return <div>Loading translations...</div>;

  const robots: Robot[] = [
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

  const selectedRobotDetails = robots.find((robot) => robot.id === selectedRobot);

  return (
    <div className="space-y-10 p-10">
      <RobotPageHeader 
        title={t.header.title}
        subtitle="Manage and interact with your AlphaMini robots"
      />
      
      <RobotGrid 
        robots={robots}
        selectedRobot={selectedRobot}
        onRobotSelect={setSelectedRobot}
        sectionTitle={t.robot_selection.title}
        statusTexts={{
          online: t.robot_selection.status_online,
          offline: t.robot_selection.status_offline,
          charging: t.robot_selection.charging,
        }}
      />

      {selectedRobotDetails && (
        <RobotDetails 
          robot={selectedRobotDetails}
          translations={{
            systemInfo: {
              title: t.robot_selection.system_info.title,
              firmware: t.robot_selection.system_info.firmware,
              temperature: t.robot_selection.system_info.temperature,
            },
            currentStatus: {
              title: t.robot_selection.current_status.title,
              status: t.robot_selection.current_status.status,
              task: t.robot_selection.current_status.task,
              battery: t.robot_selection.current_status.battery,
              location: t.robot_selection.current_status.location,
            },
            quickActions: {
              title: t.robot_selection.quick_actions.title,
              restart: t.robot_selection.quick_actions.restart,
              settings: t.robot_selection.quick_actions.settings,
              updateFirmware: t.robot_selection.quick_actions.update_firmware,
            },
            statusTexts: {
              online: t.robot_selection.status_online,
              offline: t.robot_selection.status_offline,
              charging: t.robot_selection.charging,
            },
          }}
        />
      )}

      <ProgrammingSection 
        title={t.programming.title}
        items={{
          createActions: t.programming.create_actions,
          workspace: t.programming.workspace,
          myWorks: t.programming.my_works,
        }}
      />

      <EntertainmentSection 
        title={t.entertainment.title}
        items={{
          action: t.entertainment.action,
          album: t.entertainment.album,
          friends: t.entertainment.friends,
        }}
      />

      <ThingsToTrySection 
        title={t.things_to_try.title}
        refreshText={t.things_to_try.refresh}
        prompts={shuffledPrompts}
        onRefresh={handleRefreshPrompts}
      />
    </div>
  );
}