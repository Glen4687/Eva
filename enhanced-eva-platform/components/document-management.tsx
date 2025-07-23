"use client"

import { useState } from "react"
import {
  FileText,
  Eye,
  Download,
  Trash2,
  MoreHorizontal,
  Search,
  Filter,
  SortAsc,
  Grid,
  List,
  HardDrive,
  CheckCircle,
  AlertCircle,
  Clock,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Progress } from "@/components/ui/progress"

const documents = [
  {
    id: "doc1",
    name: "RFQ_Specifications_Final.pdf",
    type: "PDF",
    size: "2.4 MB",
    uploadDate: "2025-01-20",
    status: "processed",
    pages: 24,
    processingTime: "2.3s",
    thumbnail: "/placeholder.svg?height=120&width=80",
    summary:
      "Comprehensive RFQ document outlining technical specifications, budget constraints, and project timeline for office equipment procurement. Includes detailed requirements for furniture, IT equipment, and installation services.",
  },
  {
    id: "doc2",
    name: "Vendor_Proposal_CompanyA.docx",
    type: "DOCX",
    size: "1.8 MB",
    uploadDate: "2025-01-20",
    status: "processed",
    pages: 18,
    processingTime: "1.8s",
    thumbnail: "/placeholder.svg?height=120&width=80",
    summary:
      "Detailed vendor proposal from Company A featuring competitive pricing structure, comprehensive implementation plan, and 24/7 support services. Includes warranty terms and maintenance agreements.",
  },
  {
    id: "doc3",
    name: "Technical_Requirements_Matrix.xlsx",
    type: "XLSX",
    size: "856 KB",
    uploadDate: "2025-01-19",
    status: "processed",
    pages: 12,
    processingTime: "1.2s",
    thumbnail: "/placeholder.svg?height=120&width=80",
    summary:
      "Structured matrix of technical specifications and compliance standards. Contains detailed testing criteria, performance benchmarks, and regulatory requirements for all equipment categories.",
  },
  {
    id: "doc4",
    name: "Budget_Analysis_Q1.pdf",
    type: "PDF",
    size: "1.2 MB",
    uploadDate: "2025-01-19",
    status: "processing",
    pages: 8,
    processingTime: "0s",
    thumbnail: "/placeholder.svg?height=120&width=80",
    summary: "",
  },
  {
    id: "doc5",
    name: "Vendor_Proposal_CompanyB.docx",
    type: "DOCX",
    size: "2.1 MB",
    uploadDate: "2025-01-18",
    status: "error",
    pages: 0,
    processingTime: "0s",
    thumbnail: "/placeholder.svg?height=120&width=80",
    error: "Unsupported document format detected",
    summary: "",
  },
]

export default function DocumentManagement() {
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
  const [searchQuery, setSearchQuery] = useState("")
  const [sortBy, setSortBy] = useState("uploadDate")
  const [filterStatus, setFilterStatus] = useState("all")

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "processed":
        return <CheckCircle className="w-4 h-4 text-green-500" />
      case "processing":
        return <Clock className="w-4 h-4 text-blue-500" />
      case "error":
        return <AlertCircle className="w-4 h-4 text-red-500" />
      default:
        return <FileText className="w-4 h-4 text-gray-500" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "processed":
        return "bg-green-100 text-green-800"
      case "processing":
        return "bg-blue-100 text-blue-800"
      case "error":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getFileIcon = (type: string) => {
    switch (type) {
      case "PDF":
        return <FileText className="w-6 h-6 text-red-500" />
      case "DOCX":
        return <FileText className="w-6 h-6 text-blue-500" />
      case "XLSX":
        return <FileText className="w-6 h-6 text-green-500" />
      default:
        return <FileText className="w-6 h-6 text-gray-500" />
    }
  }

  const formatFileSize = (size: string) => size

  const filteredDocuments = documents.filter((doc) => {
    const matchesSearch = doc.name.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesFilter = filterStatus === "all" || doc.status === filterStatus
    return matchesSearch && matchesFilter
  })

  return (
    <div className="space-y-6">
      {/* Header Controls */}
      <Card>
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center space-x-2">
              <HardDrive className="w-5 h-5" />
              <span>Document Library ({documents.length})</span>
            </CardTitle>
            <div className="flex items-center space-x-2">
              <Button
                variant={viewMode === "grid" ? "default" : "outline"}
                size="sm"
                onClick={() => setViewMode("grid")}
              >
                <Grid className="w-4 h-4" />
              </Button>
              <Button
                variant={viewMode === "list" ? "default" : "outline"}
                size="sm"
                onClick={() => setViewMode("list")}
              >
                <List className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Search documents..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="flex space-x-2">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm">
                    <Filter className="w-4 h-4 mr-2" />
                    Filter
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuItem onClick={() => setFilterStatus("all")}>All Documents</DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setFilterStatus("processed")}>Processed</DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setFilterStatus("processing")}>Processing</DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setFilterStatus("error")}>Error</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm">
                    <SortAsc className="w-4 h-4 mr-2" />
                    Sort
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuItem onClick={() => setSortBy("name")}>Name</DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setSortBy("uploadDate")}>Upload Date</DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setSortBy("size")}>File Size</DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setSortBy("status")}>Status</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Document Grid/List View */}
      {viewMode === "grid" ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredDocuments.map((doc) => (
            <Card key={doc.id} className="hover:shadow-lg transition-shadow">
              <CardContent className="p-4">
                <div className="space-y-4">
                  {/* Document Thumbnail */}
                  <div className="relative">
                    <div className="w-full h-32 bg-gray-100 rounded-lg flex items-center justify-center">
                      <img
                        src={doc.thumbnail || "/placeholder.svg"}
                        alt={doc.name}
                        className="w-16 h-20 object-cover rounded"
                      />
                    </div>
                    <div className="absolute top-2 right-2">{getStatusIcon(doc.status)}</div>
                    <div className="absolute bottom-2 left-2">{getFileIcon(doc.type)}</div>
                  </div>

                  {/* Document Info */}
                  <div className="space-y-2">
                    <h3 className="font-medium text-sm text-gray-900 truncate" title={doc.name}>
                      {doc.name}
                    </h3>
                    <div className="flex items-center justify-between text-xs text-gray-500">
                      <span>{formatFileSize(doc.size)}</span>
                      <span>{doc.pages} pages</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Badge className={getStatusColor(doc.status)} variant="secondary">
                        {doc.status}
                      </Badge>
                    </div>
                  </div>

                  {/* Processing Progress */}
                  {doc.status === "processing" && (
                    <div className="space-y-1">
                      <Progress value={65} className="h-1" />
                      <p className="text-xs text-gray-500">Processing...</p>
                    </div>
                  )}

                  {/* Error Message */}
                  {doc.status === "error" && doc.error && (
                    <div className="p-2 bg-red-50 rounded text-xs text-red-700">{doc.error}</div>
                  )}

                  {/* Document Summary */}
                  {doc.summary && (
                    <div className="space-y-1">
                      <p className="text-xs font-medium text-gray-700">Summary:</p>
                      <p className="text-xs text-gray-600 line-clamp-3">{doc.summary}</p>
                    </div>
                  )}

                  {/* Actions */}
                  <div className="flex items-center justify-between pt-2 border-t border-gray-100">
                    <div className="flex space-x-1">
                      <Button variant="ghost" size="sm" disabled={doc.status !== "processed"}>
                        <Eye className="w-4 h-4" />
                      </Button>
                      <Button variant="ghost" size="sm" disabled={doc.status !== "processed"}>
                        <Download className="w-4 h-4" />
                      </Button>
                    </div>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm">
                          <MoreHorizontal className="w-4 h-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent>
                        <DropdownMenuItem>Rename</DropdownMenuItem>
                        <DropdownMenuItem>Reprocess</DropdownMenuItem>
                        <DropdownMenuItem className="text-red-600">
                          <Trash2 className="w-4 h-4 mr-2" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <Card>
          <CardContent className="p-0">
            <div className="divide-y divide-gray-200">
              {filteredDocuments.map((doc) => (
                <div key={doc.id} className="p-4 hover:bg-gray-50 transition-colors">
                  <div className="flex items-start space-x-4">
                    <div className="flex-shrink-0">{getFileIcon(doc.type)}</div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <h3 className="text-sm font-medium text-gray-900 truncate">{doc.name}</h3>
                        <div className="flex items-center space-x-2">
                          {getStatusIcon(doc.status)}
                          <Badge className={getStatusColor(doc.status)} variant="secondary">
                            {doc.status}
                          </Badge>
                        </div>
                      </div>
                      <div className="mt-1 flex items-center space-x-4 text-sm text-gray-500">
                        <span>{formatFileSize(doc.size)}</span>
                        <span>{doc.pages} pages</span>
                        <span>Uploaded {doc.uploadDate}</span>
                        {doc.processingTime !== "0s" && <span>Processed in {doc.processingTime}</span>}
                      </div>
                      {doc.summary && (
                        <div className="mt-2">
                          <p className="text-sm text-gray-700 line-clamp-2">{doc.summary}</p>
                        </div>
                      )}
                      {doc.status === "processing" && (
                        <div className="mt-2">
                          <Progress value={65} className="h-1" />
                        </div>
                      )}
                      {doc.status === "error" && doc.error && (
                        <div className="mt-2 p-2 bg-red-50 rounded text-xs text-red-700">{doc.error}</div>
                      )}
                    </div>
                    <div className="flex items-center space-x-2">
                      <Button variant="ghost" size="sm" disabled={doc.status !== "processed"}>
                        <Eye className="w-4 h-4" />
                      </Button>
                      <Button variant="ghost" size="sm" disabled={doc.status !== "processed"}>
                        <Download className="w-4 h-4" />
                      </Button>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm">
                            <MoreHorizontal className="w-4 h-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent>
                          <DropdownMenuItem>Rename</DropdownMenuItem>
                          <DropdownMenuItem>Reprocess</DropdownMenuItem>
                          <DropdownMenuItem className="text-red-600">
                            <Trash2 className="w-4 h-4 mr-2" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Document Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-blue-600">
              {documents.filter((d) => d.status === "processed").length}
            </div>
            <div className="text-sm text-gray-600">Processed</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-orange-600">
              {documents.filter((d) => d.status === "processing").length}
            </div>
            <div className="text-sm text-gray-600">Processing</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-red-600">
              {documents.filter((d) => d.status === "error").length}
            </div>
            <div className="text-sm text-gray-600">Errors</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-green-600">
              {Math.round(
                documents.filter((d) => d.pages > 0).reduce((acc, d) => acc + d.pages, 0) /
                  documents.filter((d) => d.pages > 0).length || 0,
              )}
            </div>
            <div className="text-sm text-gray-600">Avg Pages</div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
