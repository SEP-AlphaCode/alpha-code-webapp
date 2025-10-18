"use client"

import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { useRobotStore } from "@/hooks/use-robot-store"

interface RobotPageHeaderProps {
  title: string
  subtitle: string
}

export function RobotPageHeader({ title, subtitle }: RobotPageHeaderProps) {
  const { connectMode, setConnectMode } = useRobotStore()

  const handleToggle = (checked: boolean) => {
    setConnectMode(checked ? "multi" : "single")
  }

  return (
    <header className="sticky top-0 z-10 bg-white/80 backdrop-blur border-b border-gray-200 mb-6 py-4 px-6 rounded-xl shadow flex items-center justify-between">
      <div>
        <h1 className="text-3xl font-bold text-blue-900 tracking-tight">{title}</h1>
        <span className="text-base text-gray-500 font-medium">{subtitle}</span>
      </div>

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
    </header>
  )
}
