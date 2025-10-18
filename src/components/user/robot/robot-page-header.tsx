"use client"

import { useState, useMemo } from "react"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select"
import { useRobotStore } from "@/hooks/use-robot-store"

interface RobotPageHeaderProps {
  title: string
  subtitle: string
  onModelSelect?: (modelName: string) => void // 👈 giờ truyền tên model
}

export function RobotPageHeader({ title, subtitle, onModelSelect }: RobotPageHeaderProps) {
  const { connectMode, setConnectMode, robots } = useRobotStore()
  const [selectedModel, setSelectedModel] = useState<string>("")

  const handleToggle = (checked: boolean) => {
    setConnectMode(checked ? "multi" : "single")
  }

  // 🔍 Lấy danh sách model duy nhất
  const modelOptions = useMemo(() => {
    const models = robots.map(r => ({
      id: r.robotModelId,
      name: r.robotModelName
    }))
    return Array.from(new Map(models.map(m => [m.name, m])).values()) // dùng name làm key
  }, [robots])

  const handleModelChange = (value: string) => {
    setSelectedModel(value)
    onModelSelect?.(value) // 👈 gửi tên model
  }

  return (
    <header className="sticky top-0 z-10 bg-white/80 backdrop-blur border-b border-gray-200 mb-6 py-4 px-6 rounded-xl shadow flex items-center justify-between">
      <div>
        <h1 className="text-3xl font-bold text-blue-900 tracking-tight">{title}</h1>
        <span className="text-base text-gray-500 font-medium">{subtitle}</span>
      </div>

      <div className="flex items-center space-x-4">
        {/* 🧩 Dropdown chọn model khi Multi Mode */}
        {connectMode === "multi" && (
          <Select value={selectedModel} onValueChange={handleModelChange}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select Model" />
            </SelectTrigger>
            <SelectContent>
              {modelOptions.map(model => (
                <SelectItem key={model.name ?? "unknown"} value={model.name ?? ""}>
                  {model.name ?? "Unknown Model"}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}

        {/* 🔀 Toggle Single / Multi Mode */}
        <div className="flex items-center space-x-3">
          <Label
            htmlFor="connect-mode"
            className="text-sm font-medium text-gray-700 select-none"
          >
            {connectMode === "single" ? "Single Mode" : "Multi Mode"}
          </Label>
          <Switch
            id="connect-mode"
            checked={connectMode === "multi"}
            onCheckedChange={handleToggle}
          />
        </div>
      </div>
    </header>
  )
}
