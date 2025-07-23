"use client"

import type React from "react"

import { useState, useCallback } from "react"
import { Upload, type File, X, CheckCircle, AlertCircle, Cloud, Folder } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"

interface UploadFile {
  id: string
  name: string
  size: number
  type: string
  progress: number
  status: "uploading" | "completed" | "error"
  error?: string
}

export default function EnhancedUpload() {
  const [files, setFiles] = useState<UploadFile[]>([])
  const [isDragOver, setIsDragOver] = useState(false)

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

    // Simulate upload progress
    newFiles.forEach((file) => {
      const interval = setInterval(() => {
        setFiles((prev) =>
          prev.map((f) => {
            if (f.id === file.id) {
              const newProgress = Math.min(f.progress + Math.random() * 30, 100)
              return {
                ...f,
                progress: newProgress,
                status: newProgress === 100 ? "completed" : "uploading",
              }
            }
            return f
          }),
        )
      }, 500)

      setTimeout(() => clearInterval(interval), 5000)
    })
  }

  const removeFile = (id: string) => {
    setFiles((prev) => prev.filter((f) => f.id !== id))
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
      default:
        return <Upload className="w-5 h-5 text-blue-500 animate-pulse" />
    }
  }

  return (
    <div className="space-y-6">
      {/* Upload Area */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Upload className="w-5 h-5" />
            <span>Document Upload</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div
            className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
              isDragOver ? "border-blue-500 bg-blue-50" : "border-gray-300 hover:border-gray-400"
            }`}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
          >
            <div className="space-y-4">
              <div className="w-16 h-16 mx-auto bg-gray-100 rounded-full flex items-center justify-center">
                <Upload className="w-8 h-8 text-gray-400" />
              </div>
              <div>
                <h3 className="text-lg font-medium text-gray-900">Upload Documents</h3>
                <p className="text-gray-600">Drag and drop files here, or click to browse</p>
              </div>
              <div className="flex justify-center space-x-4">
                <Button>
                  <Folder className="w-4 h-4 mr-2" />
                  Browse Files
                </Button>
                <Button variant="outline">
                  <Cloud className="w-4 h-4 mr-2" />
                  From Cloud
                </Button>
              </div>
              <div className="text-sm text-gray-500">
                <p>Supported formats: PDF, DOCX, XLSX, PPTX</p>
                <p>Maximum file size: 50MB per file</p>
                <p>Maximum batch size: 20 files</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* File Processing Status */}
      {files.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Processing Status</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {files.map((file) => (
                <div key={file.id} className="flex items-center space-x-4 p-4 border border-gray-200 rounded-lg">
                  <div className="flex-shrink-0">{getStatusIcon(file.status)}</div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-2">
                      <p className="text-sm font-medium text-gray-900 truncate">{file.name}</p>
                      <Button variant="ghost" size="sm" onClick={() => removeFile(file.id)} className="flex-shrink-0">
                        <X className="w-4 h-4" />
                      </Button>
                    </div>
                    <div className="flex items-center justify-between text-sm text-gray-500 mb-2">
                      <span>{formatFileSize(file.size)}</span>
                      <Badge variant={file.status === "completed" ? "default" : "secondary"}>{file.status}</Badge>
                    </div>
                    {file.status === "uploading" && <Progress value={file.progress} className="h-2" />}
                    {file.error && (
                      <Alert className="mt-2">
                        <AlertCircle className="h-4 w-4" />
                        <AlertDescription>{file.error}</AlertDescription>
                      </Alert>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Processing Options */}
      <Card>
        <CardHeader>
          <CardTitle>Processing Options</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 border border-gray-200 rounded-lg">
              <h3 className="font-medium mb-2">OCR Enhancement</h3>
              <p className="text-sm text-gray-600">Advanced text extraction from scanned documents</p>
            </div>
            <div className="p-4 border border-gray-200 rounded-lg">
              <h3 className="font-medium mb-2">Auto Classification</h3>
              <p className="text-sm text-gray-600">Automatically categorize document types</p>
            </div>
            <div className="p-4 border border-gray-200 rounded-lg">
              <h3 className="font-medium mb-2">Data Extraction</h3>
              <p className="text-sm text-gray-600">Extract key information and structured data</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
