"use client"

import { useState, useMemo } from "react"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select"
import { Trash2, PlusCircle } from "lucide-react"
import { useRobotStore } from "@/hooks/use-robot-store"
import { deleteRobot } from "@/features/robots/api/robot-api"

interface RobotPageHeaderProps {
  title: string
  subtitle: string
  onModelSelect?: (modelName: string) => void
  onAddRobot?: () => void
}

export function RobotPageHeader({ title, subtitle, onModelSelect, onAddRobot }: RobotPageHeaderProps) {
  const { connectMode, setConnectMode, robots, selectedRobotSerial, selectedRobot, removeRobot } = useRobotStore()
  const [selectedModel, setSelectedModel] = useState<string>("")
  const [isDeleting, setIsDeleting] = useState(false)

  const handleToggle = (checked: boolean) => {
    setConnectMode(checked ? "multi" : "single")
  }

  const modelOptions = useMemo(() => {
    const models = robots.map(r => ({ id: r.robotModelId, name: r.robotModelName }))
    return Array.from(new Map(models.map(m => [m.name, m])).values())
  }, [robots])

  const handleModelChange = (value: string) => {
    setSelectedModel(value)
    onModelSelect?.(value)
  }

  const handleDeleteRobot = async () => {
    if (!selectedRobot) return
    const confirmed = confirm(`Bạn muốn xóa robot "${selectedRobot.name}" này không ?`)
    if (!confirmed) return

    setIsDeleting(true)
    try {
      await deleteRobot(selectedRobot.id)
      removeRobot(selectedRobot.id)
    } finally {
      setIsDeleting(false)
    }
  }

  return (
    <header className="sticky top-0 z-10 bg-white/80 backdrop-blur border-b border-gray-200 mb-6 py-4 px-6 rounded-xl shadow flex items-center justify-between">
      <div>
        <h1 className="text-3xl font-bold text-blue-900 tracking-tight">{title}</h1>
        <span className="text-base text-gray-500 font-medium">{subtitle}</span>
      </div>

      <div className="flex items-center space-x-4">
        {/* 🧩 Model dropdown */}
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

        {/* ➕ Add Robot */}
        <Button onClick={onAddRobot} variant="outline" className="gap-2">
          <PlusCircle className="w-4 h-4" />
          Thêm mới Robot
        </Button>

        {/* 🗑 Delete Selected Robot */}
        <Button
          variant="destructive"
          onClick={handleDeleteRobot}
          disabled={!selectedRobot || isDeleting}
          className="gap-2"
        >
          <Trash2 className="w-4 h-4" />
          {isDeleting ? "Đang xóa..." : "Xóa Robot"}
        </Button>

        {/* 🔀 Toggle Single / Multi Mode */}
        <div className="flex items-center space-x-3">
          <Label htmlFor="connect-mode" className="text-sm font-medium text-gray-700 select-none">
            {connectMode === "single" ? "Single Mode" : "Multi Mode"}
          </Label>
          <Switch id="connect-mode" checked={connectMode === "multi"} onCheckedChange={handleToggle} />
        </div>
      </div>
    </header>
  )
}
