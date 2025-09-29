"use client";

import React, { useState, useEffect } from "react";
import { useI18n } from "@/lib/i18n/provider";
import { useRobotStore } from "@/hooks/use-robot-store";

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

// Define Robot type to match component expectations - extending Redux Robot type
interface ExtendedRobot {
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

// Hàm xáo trộn mảng ngẫu nhiên
function shuffleArray(array: string[]) {
  const newArray = [...array];
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
  }
  return newArray;
}

// Function to extend Redux Robot with additional mock data
function extendRobotWithMockData(robot: ReturnType<typeof useRobotStore>['robots'][0], index: number): ExtendedRobot {
  const mockData = [
    {
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
      location: "Classroom C",
      lastSeen: "5 minutes ago",
      version: "v2.1.2",
      students: 2,
      currentTask: "Charging",
      uptime: "1h 12m",
      ip: "192.168.1.103", 
      temperature: 26,
      image: "/alpha-mini-2.webp",
    }
  ];

  const mockInfo = mockData[index] || mockData[0];
  
  return {
    id: robot.id,
    name: robot.name,
    status: robot.status === 'busy' ? 'charging' : robot.status,
    battery: robot.battery || 0, // Use battery from Redux, fallback to 0
    serialNumber: robot.serial,
    ...mockInfo,
  };
}

export default function TeacherDashboard() {
  const { locale } = useI18n();
  const t = translations[locale];
  const { robots, selectedRobotSerial, selectRobot, initializeMockData } = useRobotStore();
  const [shuffledPrompts, setShuffledPrompts] = useState<string[]>([]);

  useEffect(() => {
    // Initialize mock data if no robots exist
    initializeMockData();
  }, [initializeMockData]);

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

  // Convert Redux robots to extended robot format
  const extendedRobots: ExtendedRobot[] = robots.map((robot, index) => 
    extendRobotWithMockData(robot, index)
  );

  const selectedRobotDetails = extendedRobots.find((robot) => robot.serialNumber === selectedRobotSerial) || null;

  return (
    <div className="space-y-10 p-10">
      <RobotPageHeader 
        title={t.header.title}
        subtitle="Manage and interact with your AlphaMini robots"
      />
      
      <RobotGrid 
        robots={extendedRobots}
        selectedRobot={selectedRobotSerial}
        onRobotSelect={(robotSerial) => {
          selectRobot(robotSerial);
          const robot = extendedRobots.find(r => r.serialNumber === robotSerial);
          if (robot) {
            sessionStorage.setItem("selectedRobotSerial", robot.serialNumber);
          }
        }}
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