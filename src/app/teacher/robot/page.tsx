"use client";

import React, { useState, useEffect } from "react";

import { useRobotStore } from "@/hooks/use-robot-store";

// Import extracted components
import { RobotPageHeader } from "@/components/teacher/robot/robot-page-header";
import { RobotGrid } from "@/components/teacher/robot/robot-grid";
import { RobotDetails } from "@/components/teacher/robot/robot-details";
import { ProgrammingSection } from "@/components/teacher/robot/programming-section";
import { EntertainmentSection } from "@/components/teacher/robot/entertainment-section";
import { ThingsToTrySection } from "@/components/teacher/robot/things-to-try-section";

// Import tĩnh cả hai file ngôn ngữ

// Hardcoded Vietnamese prompts for "Things to Try"
const thingsToTryPrompts = [
  "Hãy thử cho robot nhảy một điệu nhạc vui nhộn!",
  "Yêu cầu robot kể một câu chuyện cho lớp học.",
  "Hỏi robot về thời tiết hôm nay.",
  "Cho robot chơi trò chơi đoán hình.",
  "Hướng dẫn robot chụp ảnh cùng học sinh.",
  "Thử cho robot hát một bài hát thiếu nhi.",
  "Yêu cầu robot giải thích một khái niệm khoa học đơn giản."
];

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
  const { robots, selectedRobotSerial, selectRobot, initializeMockData } = useRobotStore();
  const [shuffledPrompts, setShuffledPrompts] = useState<string[]>([]);

  useEffect(() => {
    // Initialize mock data if no robots exist
    initializeMockData();
  }, [initializeMockData]);

  useEffect(() => {
    setShuffledPrompts(shuffleArray(thingsToTryPrompts));
  }, []);

  const handleRefreshPrompts = () => {
    setShuffledPrompts(shuffleArray(thingsToTryPrompts));
  };

  // Convert Redux robots to extended robot format
  const extendedRobots: ExtendedRobot[] = robots.map((robot, index) => 
    extendRobotWithMockData(robot, index)
  );

  const selectedRobotDetails = extendedRobots.find((robot) => robot.serialNumber === selectedRobotSerial) || null;

  return (
    <div className="space-y-10 p-10">
      <RobotPageHeader 
        title="Quản lý robot"
        subtitle="Quản lý và tương tác với các robot AlphaMini của bạn"
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
        sectionTitle="Danh sách robot"
        statusTexts={{
          online: "Đang hoạt động",
          offline: "Ngoại tuyến",
          charging: "Đang sạc",
        }}
      />

      {selectedRobotDetails && (
        <RobotDetails 
          robot={selectedRobotDetails}
          translations={{
            systemInfo: {
              title: "Thông tin hệ thống",
              firmware: "Phiên bản phần mềm",
              temperature: "Nhiệt độ",
            },
            currentStatus: {
              title: "Trạng thái hiện tại",
              status: "Trạng thái",
              task: "Nhiệm vụ",
              battery: "Pin",
              location: "Vị trí",
            },
            quickActions: {
              title: "Tác vụ nhanh",
              restart: "Khởi động lại",
              settings: "Cài đặt",
              updateFirmware: "Cập nhật phần mềm",
            },
            statusTexts: {
              online: "Đang hoạt động",
              offline: "Ngoại tuyến",
              charging: "Đang sạc",
            },
          }}
        />
      )}

      <ProgrammingSection 
        title="Lập trình"
        items={{
          createActions: "Tạo hành động",
          workspace: "Không gian lập trình",
          myWorks: "Công việc của tôi",
        }}
      />

      <EntertainmentSection 
        title="Giải trí"
        items={{
          action: "Hành động vui nhộn",
          album: "Album ảnh",
          friends: "Bạn bè",
        }}
      />

      <ThingsToTrySection 
        title="Những điều nên thử"
        refreshText="Làm mới đề xuất"
        prompts={shuffledPrompts}
        onRefresh={handleRefreshPrompts}
      />
    </div>
  );
}