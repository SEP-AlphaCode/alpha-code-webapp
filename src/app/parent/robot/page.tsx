"use client"

import React, { useState, useEffect, useMemo } from "react"
import { useRobotStore } from "@/hooks/use-robot-store"
import { RobotPageHeader } from "@/components/parent/robot/robot-page-header"
import { RobotGrid } from "@/components/parent/robot/robot-grid"
import { RobotDetails } from "@/components/parent/robot/robot-details"
import { ProgrammingSection } from "@/components/parent/robot/programming-section"
import { EntertainmentSection } from "@/components/parent/robot/entertainment-section"
import { ThingsToTrySection } from "@/components/parent/robot/things-to-try-section"
import { RobotModal } from "@/app/admin/robots/robot-modal"

const thingsToTryPrompts = [
  "Hãy thử cho robot nhảy một điệu nhạc vui nhộn!",
  "Yêu cầu robot kể một câu chuyện cho lớp học.",
  "Hỏi robot về thời tiết hôm nay.",
  "Cho robot chơi trò chơi đoán hình.",
  "Hướng dẫn robot chụp ảnh cùng học sinh.",
  "Thử cho robot hát một bài hát thiếu nhi.",
  "Yêu cầu robot giải thích một khái niệm khoa học đơn giản."
]

function shuffleArray(array: string[]) {
  const newArray = [...array]
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
      ;[newArray[i], newArray[j]] = [newArray[j], newArray[i]]
  }
  return newArray
}

import { useRef } from "react"

export default function UserDashboard() {
  const { robots, selectedRobotSerial, selectRobot, connectMode } = useRobotStore()
  const [selectedModelName, setSelectedModelName] = useState("")
  const [shuffledPrompts, setShuffledPrompts] = useState<string[]>([])
  const [isModalOpen, setIsModalOpen] = useState(false)

  useEffect(() => setShuffledPrompts(shuffleArray(thingsToTryPrompts)), [])

  const filteredRobots = useMemo(() => {
    return selectedModelName
      ? robots.filter(r => r.robotModelName === selectedModelName)
      : robots
  }, [robots, selectedModelName])

  // Reset when switching to single mode
  const hasSetDefaultRobot = useRef(false)

  useEffect(() => {
    if (connectMode === "multi" && !hasSetDefaultRobot.current && filteredRobots.length > 0) {
      const defaultSerial = filteredRobots[0].serial;
      if (defaultSerial !== selectedRobotSerial) { // ✅ tránh rerender loop
        selectRobot(defaultSerial);
        sessionStorage.setItem("selectedRobotSerial", defaultSerial);
      }
      hasSetDefaultRobot.current = true;
    }
  }, [connectMode, filteredRobots, selectedRobotSerial, selectRobot]);


  useEffect(() => {
    if (connectMode === "single") {
      hasSetDefaultRobot.current = false
      setSelectedModelName("")
      // Only clear selection if one exists. Prevents flip-flopping with other components
      // that auto-select the first robot when selection is falsy.
      if (selectedRobotSerial) {
        selectRobot("")
        sessionStorage.removeItem("selectedRobotSerial")
      }
    }
  }, [connectMode, selectRobot, selectedRobotSerial])




  const selectedRobotDetails = useMemo(
    () => filteredRobots.find(r => r.serial === selectedRobotSerial),
    [filteredRobots, selectedRobotSerial]
  )

  const handleModelSelect = (modelName: string) => {
    setSelectedModelName(modelName)
    const filtered = robots.filter(r => r.robotModelName === modelName)
    if (filtered.length > 0) {
      selectRobot(filtered[0].serial)
      sessionStorage.setItem("selectedRobotSerial", filtered[0].serial)
    } else {
      selectRobot("")
      sessionStorage.removeItem("selectedRobotSerial")
    }
  }

  const handleRefreshPrompts = () => setShuffledPrompts(shuffleArray(thingsToTryPrompts))

  return (
    <div className="space-y-10 p-10">
      <RobotPageHeader
        title="Quản lý robot"
        subtitle="Quản lý và tương tác với các robot AlphaMini của bạn"
        onModelSelect={handleModelSelect}
        onAddRobot={() => setIsModalOpen(true)}
      />

      <RobotGrid
        robots={filteredRobots.map(r => ({
          ...r,
          serialNumber: r.serial, // Map 'serial' to 'serialNumber'
        }))}
        sectionTitle="Danh sách robot"
        statusTexts={{ online: "Đang hoạt động", offline: "Ngoại tuyến", charging: "Đang sạc" }}
      />

      {selectedRobotDetails && (
        <RobotDetails
          robot={{
            ...selectedRobotDetails,
            ctrl_version: selectedRobotDetails.ctrlVersion ?? "",
            firmware_version: selectedRobotDetails.firmwareVersion ?? "",
            serialNumber: selectedRobotDetails.serial ?? selectedRobotDetails.serial,
            robotmodel: selectedRobotDetails.robotModelName ?? selectedRobotDetails.robotModelName,
          }}
          translations={{
            systemInfo: { title: "Thông tin hệ thống", firmware: "Phiên bản phần mềm", ctrl: "Phiên bản điều khiển", robotmodel: "Mẫu robot" },
            currentStatus: { title: "Trạng thái hiện tại", status: "Trạng thái", battery: "Pin" },
            quickActions: { title: "Tác vụ nhanh", restart: "Tắt nguồn", settings: "Cài đặt", forceStop: "Dừng hành động" },
            statusTexts: { online: "Đang hoạt động", offline: "Ngoại tuyến", charging: "Đang sạc" }
          }}
        />
      )}

      <ProgrammingSection title="Lập trình" items={{ createActions: "Tạo hành động", workspace: "Không gian lập trình", myWorks: "Công việc của tôi" }} />

      <EntertainmentSection title="Giải trí" items={{ action: "Hành động vui nhộn", album: "Album ảnh", friends: "Bạn bè" }} />

      <ThingsToTrySection title="Những điều nên thử" refreshText="Làm mới đề xuất" prompts={shuffledPrompts} onRefresh={handleRefreshPrompts} />

      <RobotModal open={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </div>
  )
}
