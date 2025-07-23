"use client"

import type React from "react"

import { useState, useCallback } from "react"
import {
  Upload,
  File,
  X,
  CheckCircle,
  AlertCircle,
  Cloud,
  Folder,
  FileText,
  Archive,
  HelpCircle,
  RefreshCw,
  Eye,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { TooltipProvider, Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

interface UploadFile {
  id: string
  name: string
  size: number
  type: string
  progress: number
  status: "uploading" | "processing" | "completed" | "error"
  error?: string
  preview?: string
}

const supportedFormats = [
  { type: "PDF", icon: FileText, description: "Portable Document Format", maxSize: "50MB" },
  { type: "DOCX", icon: FileText, description: "Microsoft Word Document", maxSize: "50MB" },
  { type: "XLSX", icon: FileText, description: "Microsoft Excel Spreadsheet", maxSize: "50MB" },
  { type: "PPTX", icon: FileText, description: "Microsoft PowerPoint", maxSize: "50MB" },
]

export default function EnhancedDocumentUpload() {
  const [files, setFiles] = useState<UploadFile[]>([])
  const [isDragOver, setIsDragOver] = useState(false)
  const [uploadMode, setUploadMode] = useState<"local" | "cloud">("local")

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(true)
  }, [])

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(false)
  }, [])

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(false)

    const droppedFiles = Array.from(e.dataTransfer.files)
    processFiles(droppedFiles)
  }, [])

  const processFiles = (fileList: File[]) => {
    const newFiles: UploadFile[] = fileList.map((file) => ({
      id: Math.random().toString(36).substr(2, 9),
      name: file.name,
      size: file.size,
      type: file.type,
      progress: 0,
      status: "uploading",
    }))

    setFiles((prev) => [...prev, ...newFiles])

    // Simulate upload and processing
    newFiles.forEach((file) => {
      // Upload phase
      const uploadInterval = setInterval(() => {
        setFiles((prev) =>
          prev.map((f) => {
            if (f.id === file.id && f.status === "uploading") {
              const newProgress = Math.min(f.progress + Math.random() * 20, 100)
              return {
                ...f,
                progress: newProgress,
                status: newProgress === 100 ? "processing" : "uploading",
              }
            }
            return f
          }),
        )
      }, 300)

      // Processing phase
      setTimeout(() => {
        clearInterval(uploadInterval)
        const processingInterval = setInterval(() => {
          setFiles((prev) =>
            prev.map((f) => {
              if (f.id === file.id && f.status === "processing") {
                const shouldComplete = Math.random() > 0.7
                return {
                  ...f,
                  status: shouldComplete ? "completed" : "processing",
                }
              }
              return f
            }),
          )
        }, 1000)

        setTimeout(() => clearInterval(processingInterval), 3000)
      }, 2000)
    })
  }

  const removeFile = (id: string) => {
    setFiles((prev) => prev.filter((f) => f.id !== id))
  }

  const retryFile = (id: string) => {
    setFiles((prev) =>
      prev.map((f) => (f.id === id ? { ...f, status: "uploading", progress: 0, error: undefined } : f)),
    )
  }

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes"
    const k = 1024
    const sizes = ["Bytes", "KB", "MB", "GB"]
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return Number.parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i]
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed":
        return <CheckCircle className="w-5 h-5 text-green-500" />
      case "error":
        return <AlertCircle className="w-5 h-5 text-red-500" />
      case "processing":
        return <RefreshCw className="w-5 h-5 text-blue-500 animate-spin" />
      default:
        return <Upload className="w-5 h-5 text-blue-500" />
    }
  }

  const getFileIcon = (fileName: string) => {
    const extension = fileName.split(".").pop()?.toLowerCase()
    switch (extension) {
      case "pdf":
        return <FileText className="w-8 h-8 text-red-500" />
      case "docx":
      case "doc":
        return <FileText className="w-8 h-8 text-blue-500" />
      case "xlsx":
      case "xls":
        return <FileText className="w-8 h-8 text-green-500" />
      case "pptx":
      case "ppt":
        return <FileText className="w-8 h-8 text-orange-500" />
      default:
        return <File className="w-8 h-8 text-gray-500" />
    }
  }

  return (
    <TooltipProvider>
      <div className="space-y-6">
        {/* Upload Methods */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Upload className="w-5 h-5" />
                <span>Document Upload</span>
              </div>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="ghost" size="sm">
                    <HelpCircle className="w-4 h-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent className="max-w-xs">
                  <p>
                    Upload your RFQ documents for AI-powered analysis. Supported formats include PDF, DOCX, XLSX, and
                    PPTX.
                  </p>
                </TooltipContent>
              </Tooltip>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs value={uploadMode} onValueChange={(value) => setUploadMode(value as "local" | "cloud")}>
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="local" className="flex items-center space-x-2">
                  <Folder className="w-4 h-4" />
                  <span>Local Files</span>
                </TabsTrigger>
                <TabsTrigger value="cloud" className="flex items-center space-x-2">
                  <Cloud className="w-4 h-4" />
                  <span>Cloud Storage</span>
                </TabsTrigger>
              </TabsList>

              <TabsContent value="local" className="mt-6">
                <div
                  className={`border-2 border-dashed rounded-xl p-8 text-center transition-all duration-200 ${
                    isDragOver
                      ? "border-blue-500 bg-blue-50 scale-105"
                      : "border-gray-300 hover:border-gray-400 hover:bg-gray-50"
                  }`}
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                >
                  <div className="space-y-4">
                    <div className="w-20 h-20 mx-auto bg-gradient-to-br from-blue-100 to-purple-100 rounded-full flex items-center justify-center">
                      <Upload className={`w-10 h-10 ${isDragOver ? "text-blue-600" : "text-gray-400"}`} />
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold text-gray-900">
                        {isDragOver ? "Drop files here" : "Upload Your Documents"}
                      </h3>
                      <p className="text-gray-600 mt-2">Drag and drop files here, or click to browse your computer</p>
                    </div>
                    <div className="flex justify-center space-x-4">
                      <Button size="lg" className="bg-gradient-to-r from-blue-600 to-purple-600">
                        <Folder className="w-5 h-5 mr-2" />
                        Browse Files
                      </Button>
                      <Button variant="outline" size="lg">
                        <Archive className="w-5 h-5 mr-2" />
                        Upload Folder
                      </Button>
                    </div>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="cloud" className="mt-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {[
                    { name: "Google Drive", icon: "🔵", description: "Import from Google Drive" },
                    { name: "OneDrive", icon: "🔷", description: "Import from Microsoft OneDrive" },
                    { name: "Dropbox", icon: "🔹", description: "Import from Dropbox" },
                  ].map((service, index) => (
                    <Card key={index} className="cursor-pointer hover:shadow-md transition-shadow">
                      <CardContent className="p-6 text-center">
                        <div className="text-4xl mb-3">{service.icon}</div>
                        <h3 className="font-semibold text-gray-900">{service.name}</h3>
                        <p className="text-sm text-gray-600 mt-1">{service.description}</p>
                        <Button variant="outline" size="sm" className="mt-3 bg-transparent">
                          Connect
                        </Button>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        {/* Supported Formats */}
        <Card>
          <CardHeader>
            <CardTitle>Supported File Formats</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {supportedFormats.map((format, index) => (
                <div key={index} className="flex items-center space-x-3 p-3 border border-gray-200 rounded-lg">
                  <format.icon className="w-8 h-8 text-blue-600" />
                  <div>
                    <h4 className="font-medium text-gray-900">{format.type}</h4>
                    <p className="text-xs text-gray-600">{format.description}</p>
                    <p className="text-xs text-gray-500">Max: {format.maxSize}</p>
                  </div>
                </div>
              ))}
            </div>
            <Alert className="mt-4">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                <strong>Upload Guidelines:</strong> Maximum file size is 50MB per file. Batch uploads support up to 20
                files simultaneously. Files are automatically scanned for security and processed using advanced OCR
                technology.
              </AlertDescription>
            </Alert>
          </CardContent>
        </Card>

        {/* File Processing Queue */}
        {files.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>Upload Queue ({files.length} files)</span>
                <div className="flex space-x-2">
                  <Button variant="outline" size="sm" onClick={() => setFiles([])}>
                    Clear All
                  </Button>
                  <Button variant="outline" size="sm">
                    Pause All
                  </Button>
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {files.map((file) => (
                  <div
                    key={file.id}
                    className="flex items-center space-x-4 p-4 border border-gray-200 rounded-lg bg-white"
                  >
                    <div className="flex-shrink-0">{getFileIcon(file.name)}</div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="text-sm font-medium text-gray-900 truncate">{file.name}</h4>
                        <div className="flex items-center space-x-2">
                          {file.status === "completed" && (
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Button variant="ghost" size="sm">
                                  <Eye className="w-4 h-4" />
                                </Button>
                              </TooltipTrigger>
                              <TooltipContent>Preview document</TooltipContent>
                            </Tooltip>
                          )}
                          {file.status === "error" && (
                            <Button variant="ghost" size="sm" onClick={() => retryFile(file.id)}>
                              <RefreshCw className="w-4 h-4" />
                            </Button>
                          )}
                          <Button variant="ghost" size="sm" onClick={() => removeFile(file.id)}>
                            <X className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                      <div className="flex items-center justify-between text-sm text-gray-500 mb-2">
                        <span>{formatFileSize(file.size)}</span>
                        <div className="flex items-center space-x-2">
                          {getStatusIcon(file.status)}
                          <Badge
                            variant={
                              file.status === "completed"
                                ? "default"
                                : file.status === "error"
                                  ? "destructive"
                                  : "secondary"
                            }
                          >
                            {file.status}
                          </Badge>
                        </div>
                      </div>
                      {(file.status === "uploading" || file.status === "processing") && (
                        <div className="space-y-1">
                          <Progress value={file.status === "uploading" ? file.progress : 100} className="h-2" />
                          <p className="text-xs text-gray-500">
                            {file.status === "uploading"
                              ? `Uploading... ${Math.round(file.progress)}%`
                              : "Processing document..."}
                          </p>
                        </div>
                      )}
                      {file.error && (
                        <Alert className="mt-2">
                          <AlertCircle className="h-4 w-4" />
                          <AlertDescription className="text-sm">{file.error}</AlertDescription>
                        </Alert>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </TooltipProvider>
  )
}
