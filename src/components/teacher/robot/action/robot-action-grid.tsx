"use client"

import { useState } from "react"
import { RobotActionTab } from "./robot-action-tab"
import { useRobotActions } from "@/hooks/use-robot-action"
import { useDances } from "@/hooks/use-robot-dance"
import { useExpression } from "@/features/activities/hooks/use-expression"
import { TabData } from "@/types/tab-data"
import { useSkills } from "@/hooks/use-skills"
// TODO: Implement useExtendedActions hook if not available
// import { useExtendedActions } from "@/hooks/use-extended-actions"

interface RobotActionGridProps {
  sendCommandToBackend: (actionCode: string, type: "action" | "expression" | "skills_helper" | "extended_action") => Promise<unknown>;
  onActionSelect: (action: RobotActionUI) => void;
}
import {
  RobotActionUI,
  mapActionToUI,
  mapDanceToUI,
  mapExpressionToUI,
} from "@/types/robot-ui"   // file chứa mappers

export function RobotActionGrid({
  sendCommandToBackend,
  onActionSelect,
}: RobotActionGridProps) {
  const [selectedTab, setSelectedTab] = useState<"action" | "dance" | "expression" | "skills" | "extended_actions">("action")
  const [currentActionIndex, setCurrentActionIndex] = useState<number | null>(null)

  const [actionPage, setActionPage] = useState(1)
  const [dancePage, setDancePage] = useState(1)
  const [expressionPage, setExpressionPage] = useState(1)
  const [skillsPage, setSkillsPage] = useState(1)
  const [extendedActionsPage, setExtendedActionsPage] = useState(1)
  // --- Extended Actions ---
  // TODO: Replace with real hook when available
  // const { data: extendedActionsData, isLoading: extendedActionsLoading, error: extendedActionsError } =
  //   useExtendedActions(extendedActionsPage, pageSize, "")
  // const extendedActionsTab: TabData<RobotActionUI> = {
  //   actions: (extendedActionsData?.data ?? []).map(mapActionToUI),
  //   totalPages: extendedActionsData?.total_pages ?? 1,
  //   currentPage: extendedActionsPage,
  //   setCurrentPage: setExtendedActionsPage,
  //   loading: extendedActionsLoading,
  //   error: extendedActionsError ? String(extendedActionsError) : null,
  // }
  // Temporary placeholder:
  const extendedActionsTab: TabData<RobotActionUI> = {
    actions: [],
    totalPages: 1,
    currentPage: extendedActionsPage,
    setCurrentPage: setExtendedActionsPage,
    loading: false,
    error: null,
  }

  const pageSize = 8

  // --- Actions ---
  const { data: actionData, isLoading: actionLoading, error: actionError } =
    useRobotActions(actionPage, pageSize, "")
  const actionTab: TabData<RobotActionUI> = {
    actions: (actionData?.data ?? []).map(mapActionToUI),
    totalPages: actionData?.total_pages ?? 1,
    currentPage: actionPage,
    setCurrentPage: setActionPage,
    loading: actionLoading,
    error: actionError ? String(actionError) : null,
  }

  // --- Dances ---
  const { data: danceData, isLoading: danceLoading, error: danceError } =
    useDances(dancePage, pageSize, "")
  const danceTab: TabData<RobotActionUI> = {
    actions: (danceData?.data ?? []).map(mapDanceToUI),
    totalPages: danceData?.total_pages ?? 1,
    currentPage: dancePage,
    setCurrentPage: setDancePage,
    loading: danceLoading,
    error: danceError ? String(danceError) : null,
  }

  // --- Expressions ---
  const { data: expData, isLoading: expLoading, error: expError } =
    useExpression().useGetPagedExpressions(expressionPage, pageSize, "")
  const expressionTab: TabData<RobotActionUI> = {
    actions: (expData?.data ?? []).map(mapExpressionToUI),
    totalPages: expData?.total_pages ?? 1,
    currentPage: expressionPage,
    setCurrentPage: setExpressionPage,
    loading: expLoading,
    error: expError ? String(expError) : null,
// (removed duplicate misplaced interface and function definition)
  }

  // --- Skills ---
  const { data: skillsData, isLoading: skillsLoading, error: skillsError } =
    useSkills(skillsPage, pageSize, "")
  const skillsTab: TabData<RobotActionUI> = {
    actions: (skillsData?.data ?? []).map(mapActionToUI),
    totalPages: skillsData?.total_pages ?? 1,
    currentPage: skillsPage,
    setCurrentPage: setSkillsPage,
    loading: skillsLoading,
    error: skillsError ? String(skillsError) : null,
  }

  // chọn tab
  let tabData: TabData<RobotActionUI>
  let tabType: "action" | "expression" | "skills_helper" | "extended_action"
  if (selectedTab === "action") {
    tabData = actionTab
    tabType = "action"
  } else if (selectedTab === "dance") {
    tabData = danceTab
    tabType = "action"
  } else if (selectedTab === "expression") {
    tabData = expressionTab
    tabType = "expression"
  } else if (selectedTab === "skills") {
    tabData = skillsTab
    tabType = "skills_helper"
  } else {
    tabData = extendedActionsTab
    tabType = "extended_action"
  }

  return (
    <div className="flex flex-col items-center mb-4 w-full">
      {/* Tabs */}
      <div className="flex justify-center space-x-4 mb-6">
        {(["action", "dance", "expression", "skills", "extended_actions"] as const).map((tab) => {
          const label =
            tab === "action"
              ? "Hành động"
              : tab === "dance"
              ? "Nhảy múa"
              : tab === "expression"
              ? "Biểu cảm"
              : tab === "skills"
              ? "Kỹ năng"
              : "Hành động nâng cao"

          return (
            <button
              key={tab}
              onClick={() => {
                setSelectedTab(tab)
                setCurrentActionIndex(null)
              }}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                selectedTab === tab
                  ? "bg-blue-500 text-white"
                  : "bg-gray-200 text-gray-700 hover:bg-gray-300"
              }`}
            >
              {label}
            </button>
          )
        })}
      </div>

      {/* Tab content */}
      <RobotActionTab
        actions={tabData.actions}
        currentActionIndex={currentActionIndex}
        setCurrentActionIndex={setCurrentActionIndex}
        sendCommandToBackend={(code) =>
          sendCommandToBackend(
            code,
            tabType
          )
        }
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
