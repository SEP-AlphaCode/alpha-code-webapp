// src/components/teacher/robot/action/robot-action-grid.tsx
"use client"

import { useState, Dispatch, SetStateAction, useEffect } from "react"
import { RobotActionTab } from "./robot-action-tab"
import { RobotActionCategory, RobotAction } from "@/types/robot"
import { useRobotActions } from "@/hooks/use-robot-action"
import { useDances } from "@/hooks/use-robot-dance"

export function RobotActionGrid({
  sendCommandToBackend,
  onActionSelect,
}: {
  sendCommandToBackend: (actionCode: string) => Promise<unknown>
  onActionSelect: (action: RobotAction) => void
}) {
  const [selectedTab, setSelectedTab] =
    useState<RobotActionCategory>("action")
  const [currentActionIndex, setCurrentActionIndex] =
    useState<number | null>(null)

  // page state riêng cho từng tab
  const [actionPage, setActionPage] = useState(1)
  const [dancePage, setDancePage] = useState(1)
  const [funnyPage, setFunnyPage] = useState(1)

  // search + debounce
  const [searchTerm, setSearchTerm] = useState("")
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("")
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm)
    }, 500)
    return () => clearTimeout(timer)
  }, [searchTerm])

  const pageSize = 8

  // query actions
  const {
    data: actionData,
    isLoading: actionLoading,
    error: actionError,
  } = useRobotActions(actionPage, pageSize, debouncedSearchTerm)

  const actionActions = actionData?.data ?? []
  const actionTotal = actionData?.total_pages ?? 1

  // query dances
  const {
    data: danceData,
    isLoading: danceLoading,
    error: danceError,
  } = useDances(dancePage, pageSize, debouncedSearchTerm)

  const dances = danceData?.data ?? []
  const danceTotal = danceData?.total_pages ?? 1

  // funny tạm mock
  const funnyActions: RobotAction[] = []
  const funnyTotal = 1
  const funnyLoading = false
  const funnyError = null

  type TabData = {
    actions: RobotAction[]
    totalPages: number
    currentPage: number
    setCurrentPage: Dispatch<SetStateAction<number>>
    loading: boolean
    error: string | null
  }

  let tabData: TabData
  if (selectedTab === "action") {
    tabData = {
      actions: actionActions,
      totalPages: actionTotal,
      currentPage: actionPage,
      setCurrentPage: setActionPage,
      loading: actionLoading,
      error: actionError ? String(actionError) : null,
    }
  } else if (selectedTab === "dance") {
    tabData = {
      actions: dances,
      totalPages: danceTotal,
      currentPage: dancePage,
      setCurrentPage: setDancePage,
      loading: danceLoading,
      error: danceError ? String(danceError) : null,
    }
  } else {
    tabData = {
      actions: funnyActions,
      totalPages: funnyTotal,
      currentPage: funnyPage,
      setCurrentPage: setFunnyPage,
      loading: funnyLoading,
      error: funnyError,
    }
  }

  return (
    <div className="flex flex-col items-center mb-4 w-full">
      {/* Tabs */}
      <div className="flex justify-center space-x-4 mb-6">
        {(["action", "dance", "funny"] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => {
              setSelectedTab(tab)
              setCurrentActionIndex(null) // reset index khi đổi tab
            }}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              selectedTab === tab
                ? "bg-blue-500 text-white"
                : "bg-gray-200 text-gray-700 hover:bg-gray-300"
            }`}
          >
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
          </button>
        ))}
      </div>

      {/* Tab content */}
      <RobotActionTab
        actions={tabData.actions}
        currentActionIndex={currentActionIndex}
        setCurrentActionIndex={setCurrentActionIndex}
        sendCommandToBackend={sendCommandToBackend}
        onActionSelect={onActionSelect}
        pageSize={pageSize}
        currentPage={tabData.currentPage}
        setCurrentPage={tabData.setCurrentPage}
        totalPages={tabData.totalPages}
        loading={tabData.loading}
        error={tabData.error}
      />
    </div>
  )
}
