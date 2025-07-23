"use client"

import { useState } from "react"
import {
  ArrowLeft,
  Settings,
  Share2,
  Download,
  MoreHorizontal,
  Calendar,
  Clock,
  Users,
  FileText,
  MessageSquare,
  BarChart3,
  CheckCircle,
  Upload,
  RefreshCw,
  Zap,
  Target,
  TrendingUp,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import { Separator } from "@/components/ui/separator"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

// Import our enhanced components
import EnhancedDocumentUpload from "./enhanced-document-upload"
import EnhancedChatAnalysis from "./enhanced-chat-analysis"
import ProjectInsightsDashboard from "./project-insights-dashboard"
import DocumentManagement from "./document-management"
import BreadcrumbNavigation from "./breadcrumb-navigation"

interface ProjectDetailViewProps {
  projectId: string | null
  onBackToDashboard: () => void
}

export default function ProjectDetailView({ projectId, onBackToDashboard }: ProjectDetailViewProps) {
  const [activeTab, setActiveTab] = useState("overview")

  // Add this after the useState declarations
  const [projectData, setProjectData] = useState(() => {
    // Mock data - in real app, this would fetch based on projectId
    const projects = [
      {
        id: "1",
        name: "Office Equipment RFQ Analysis",
        description:
          "Comprehensive analysis of office furniture and equipment procurement for new headquarters expansion",
        status: "active",
        priority: "high",
        createdDate: "2025-01-15",
        lastUpdated: "2 hours ago",
        owner: {
          name: "Glen Dailva",
          email: "glen@spc3.com",
          avatar: "/placeholder.svg?height=40&width=40",
        },
        collaborators: [
          { name: "Sam Brenz", avatar: "/placeholder.svg?height=32&width=32" },
          { name: "Alice Johnson", avatar: "/placeholder.svg?height=32&width=32" },
        ],
        stats: {
          documents: 8,
          totalSize: "24.5 MB",
          sessions: 3,
          insights: 12,
          queries: 47,
        },
        progress: {
          upload: 100,
          processing: 85,
          analysis: 60,
        },
        tags: ["procurement", "office-equipment", "rfq", "high-priority"],
      },
      {
        id: "2",
        name: "IT Services Contract",
        description: "Selection of managed IT services provider for 3-year contract",
        status: "review",
        priority: "medium",
        createdDate: "2025-01-10",
        lastUpdated: "1 day ago",
        owner: {
          name: "Sam Brenz",
          email: "sam@spc3.com",
          avatar: "/placeholder.svg?height=40&width=40",
        },
        collaborators: [{ name: "Glen Dailva", avatar: "/placeholder.svg?height=32&width=32" }],
        stats: {
          documents: 12,
          totalSize: "31.2 MB",
          sessions: 5,
          insights: 18,
          queries: 63,
        },
        progress: {
          upload: 100,
          processing: 100,
          analysis: 90,
        },
        tags: ["it-services", "contract", "managed-services"],
      },
      {
        id: "3",
        name: "Marketing Agency Selection",
        description: "RFQ for digital marketing and brand strategy services",
        status: "completed",
        priority: "low",
        createdDate: "2025-01-05",
        lastUpdated: "3 days ago",
        owner: {
          name: "Alice Johnson",
          email: "alice@spc3.com",
          avatar: "/placeholder.svg?height=40&width=40",
        },
        collaborators: [],
        stats: {
          documents: 6,
          totalSize: "18.7 MB",
          sessions: 2,
          insights: 8,
          queries: 29,
        },
        progress: {
          upload: 100,
          processing: 100,
          analysis: 100,
        },
        tags: ["marketing", "digital", "brand-strategy"],
      },
    ]

    return projects.find((p) => p.id === projectId) || projects[0]
  })

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800 border-green-200"
      case "review":
        return "bg-yellow-100 text-yellow-800 border-yellow-200"
      case "completed":
        return "bg-blue-100 text-blue-800 border-blue-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "bg-red-100 text-red-800"
      case "medium":
        return "bg-orange-100 text-orange-800"
      case "low":
        return "bg-green-100 text-green-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  return (
    <TooltipProvider>
      <div className="min-h-screen bg-gray-50">
        {/* Enhanced Header */}
        <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
          <div className="px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <Button variant="ghost" size="sm" onClick={onBackToDashboard}>
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back to Projects
                </Button>
                <Separator orientation="vertical" className="h-6" />
                <BreadcrumbNavigation
                  items={[
                    { label: "Dashboard", onClick: onBackToDashboard },
                    { label: "Projects", onClick: onBackToDashboard },
                    { label: projectData.name, isActive: true },
                  ]}
                />
              </div>
              <div className="flex items-center space-x-3">
                <div className="flex items-center space-x-2">
                  <Badge className={getStatusColor(projectData.status)} variant="outline">
                    {projectData.status}
                  </Badge>
                  <Badge className={getPriorityColor(projectData.priority)} variant="outline">
                    {projectData.priority} priority
                  </Badge>
                </div>
                <div className="flex items-center space-x-1">
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button variant="outline" size="sm">
                        <Share2 className="w-4 h-4" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>Share project</TooltipContent>
                  </Tooltip>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button variant="outline" size="sm">
                        <Download className="w-4 h-4" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>Export project data</TooltipContent>
                  </Tooltip>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button variant="outline" size="sm">
                        <Settings className="w-4 h-4" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>Project settings</TooltipContent>
                  </Tooltip>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="outline" size="sm">
                        <MoreHorizontal className="w-4 h-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                      <DropdownMenuItem>Duplicate Project</DropdownMenuItem>
                      <DropdownMenuItem>Archive Project</DropdownMenuItem>
                      <DropdownMenuItem className="text-red-600">Delete Project</DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
            </div>

            {/* Project Meta Information */}
            <div className="mt-4 flex items-center justify-between">
              <div className="flex items-center space-x-6 text-sm text-gray-600">
                <div className="flex items-center space-x-2">
                  <Calendar className="w-4 h-4" />
                  <span>Created {projectData.createdDate}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Clock className="w-4 h-4" />
                  <span>Updated {projectData.lastUpdated}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Users className="w-4 h-4" />
                  <div className="flex items-center space-x-1">
                    <Avatar className="w-6 h-6">
                      <AvatarImage src={projectData.owner.avatar || "/placeholder.svg"} />
                      <AvatarFallback className="text-xs">GD</AvatarFallback>
                    </Avatar>
                    <span>{projectData.owner.name}</span>
                    {projectData.collaborators.length > 0 && (
                      <>
                        <span className="text-gray-400">+</span>
                        <div className="flex -space-x-1">
                          {projectData.collaborators.map((collaborator, index) => (
                            <Avatar key={index} className="w-6 h-6 border-2 border-white">
                              <AvatarImage src={collaborator.avatar || "/placeholder.svg"} />
                              <AvatarFallback className="text-xs">
                                {collaborator.name
                                  .split(" ")
                                  .map((n) => n[0])
                                  .join("")}
                              </AvatarFallback>
                            </Avatar>
                          ))}
                        </div>
                      </>
                    )}
                  </div>
                </div>
              </div>
              <div className="flex items-center space-x-1">
                {projectData.tags.map((tag, index) => (
                  <Badge key={index} variant="secondary" className="text-xs">
                    {tag}
                  </Badge>
                ))}
              </div>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <div className="px-6 py-6">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
            <TabsList className="grid w-full grid-cols-5 lg:w-[600px]">
              <TabsTrigger value="overview" className="flex items-center space-x-2">
                <BarChart3 className="w-4 h-4" />
                <span>Overview</span>
              </TabsTrigger>
              <TabsTrigger value="documents" className="flex items-center space-x-2">
                <FileText className="w-4 h-4" />
                <span>Documents</span>
              </TabsTrigger>
              <TabsTrigger value="upload" className="flex items-center space-x-2">
                <Upload className="w-4 h-4" />
                <span>Upload</span>
              </TabsTrigger>
              <TabsTrigger value="analysis" className="flex items-center space-x-2">
                <MessageSquare className="w-4 h-4" />
                <span>Analysis</span>
              </TabsTrigger>
              <TabsTrigger value="insights" className="flex items-center space-x-2">
                <Zap className="w-4 h-4" />
                <span>Insights</span>
              </TabsTrigger>
            </TabsList>

            {/* Overview Tab */}
            <TabsContent value="overview" className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Project Summary Card */}
                <Card className="lg:col-span-2">
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <Target className="w-5 h-5" />
                      <span>Project Summary</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p className="text-gray-700">{projectData.description}</p>

                    {/* Progress Indicators */}
                    <div className="space-y-3">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-600">Document Upload</span>
                        <span className="font-medium">{projectData.progress.upload}%</span>
                      </div>
                      <Progress value={projectData.progress.upload} className="h-2" />

                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-600">Processing</span>
                        <span className="font-medium">{projectData.progress.processing}%</span>
                      </div>
                      <Progress value={projectData.progress.processing} className="h-2" />

                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-600">Analysis</span>
                        <span className="font-medium">{projectData.progress.analysis}%</span>
                      </div>
                      <Progress value={projectData.progress.analysis} className="h-2" />
                    </div>
                  </CardContent>
                </Card>

                {/* Quick Stats */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <TrendingUp className="w-5 h-5" />
                      <span>Quick Stats</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 gap-4">
                      <div className="text-center p-3 bg-blue-50 rounded-lg">
                        <div className="text-2xl font-bold text-blue-600">{projectData.stats.documents}</div>
                        <div className="text-sm text-blue-700">Documents</div>
                      </div>
                      <div className="text-center p-3 bg-green-50 rounded-lg">
                        <div className="text-2xl font-bold text-green-600">{projectData.stats.insights}</div>
                        <div className="text-sm text-green-700">Insights</div>
                      </div>
                      <div className="text-center p-3 bg-purple-50 rounded-lg">
                        <div className="text-2xl font-bold text-purple-600">{projectData.stats.queries}</div>
                        <div className="text-sm text-purple-700">Queries</div>
                      </div>
                    </div>

                    <Separator />

                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Total Size:</span>
                        <span className="font-medium">{projectData.stats.totalSize}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Sessions:</span>
                        <span className="font-medium">{projectData.stats.sessions}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Recent Activity */}
              <Card>
                <CardHeader>
                  <CardTitle>Recent Activity</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {[
                      {
                        action: "Document processed",
                        file: "vendor_proposal_final.pdf",
                        time: "2 hours ago",
                        status: "success",
                      },
                      { action: "Analysis completed", type: "Cost comparison", time: "3 hours ago", status: "success" },
                      {
                        action: "New document uploaded",
                        file: "technical_specs.docx",
                        time: "5 hours ago",
                        status: "processing",
                      },
                      { action: "Insight generated", type: "Risk assessment", time: "1 day ago", status: "success" },
                    ].map((activity, index) => (
                      <div key={index} className="flex items-center space-x-4 p-3 border border-gray-200 rounded-lg">
                        <div className="flex-shrink-0">
                          {activity.status === "success" ? (
                            <CheckCircle className="w-5 h-5 text-green-500" />
                          ) : (
                            <RefreshCw className="w-5 h-5 text-blue-500 animate-spin" />
                          )}
                        </div>
                        <div className="flex-1">
                          <p className="text-sm font-medium text-gray-900">{activity.action}</p>
                          <p className="text-sm text-gray-600">
                            {activity.file || activity.type} • {activity.time}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Documents Tab */}
            <TabsContent value="documents">
              <DocumentManagement />
            </TabsContent>

            {/* Upload Tab */}
            <TabsContent value="upload">
              <EnhancedDocumentUpload />
            </TabsContent>

            {/* Analysis Tab */}
            <TabsContent value="analysis">
              <EnhancedChatAnalysis />
            </TabsContent>

            {/* Insights Tab */}
            <TabsContent value="insights">
              <ProjectInsightsDashboard />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </TooltipProvider>
  )
}
