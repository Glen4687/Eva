"use client"

import { useState } from "react"
import EnhancedDashboard from "./components/enhanced-dashboard"
import ProjectDetailView from "./components/project-detail-view"

export default function EnhancedEvaPlatform() {
  const [currentView, setCurrentView] = useState<"dashboard" | "project">("dashboard")
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(null)

  const handleProjectSelect = (projectId: string) => {
    setSelectedProjectId(projectId)
    setCurrentView("project")
  }

  const handleBackToDashboard = () => {
    setCurrentView("dashboard")
    setSelectedProjectId(null)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {currentView === "dashboard" ? (
        <EnhancedDashboard onProjectSelect={handleProjectSelect} />
      ) : (
        <ProjectDetailView projectId={selectedProjectId} onBackToDashboard={handleBackToDashboard} />
      )}
    </div>
  )
}
