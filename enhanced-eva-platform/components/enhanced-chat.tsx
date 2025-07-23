"use client"

import { useState } from "react"
import { Send, Download, Copy, ThumbsUp, ThumbsDown, BarChart3, FileText, Sparkles } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"

interface Message {
  id: string
  type: "user" | "assistant"
  content: string
  timestamp: Date
  attachments?: string[]
  insights?: any[]
}

const suggestedQuestions = [
  "Summarize the key points from all documents",
  "Compare the different options presented",
  "What are the main pricing considerations?",
  "Identify potential risks and mitigation strategies",
  "Extract all technical requirements",
  "Generate a comparison matrix",
]

const documents = [
  { name: "RFQ_Specifications.pdf", type: "PDF", size: "2.4 MB", status: "processed" },
  { name: "Vendor_Proposal_A.docx", type: "DOCX", size: "1.8 MB", status: "processed" },
  { name: "Technical_Requirements.xlsx", type: "XLSX", size: "856 KB", status: "processed" },
  { name: "Budget_Analysis.pdf", type: "PDF", size: "1.2 MB", status: "processing" },
]

export default function EnhancedChat() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      type: "assistant",
      content:
        "Hello! I've analyzed your 4 documents and I'm ready to help you with your RFQ analysis. You can ask me anything about the documents or use one of the suggested questions below.",
      timestamp: new Date(),
      insights: [
        { type: "summary", title: "Key Findings", count: 12 },
        { type: "comparison", title: "Vendor Comparison", count: 3 },
        { type: "risks", title: "Risk Assessment", count: 5 },
      ],
    },
  ])
  const [inputValue, setInputValue] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const handleSendMessage = async () => {
    if (!inputValue.trim()) return

    const userMessage: Message = {
      id: Date.now().toString(),
      type: "user",
      content: inputValue,
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMessage])
    setInputValue("")
    setIsLoading(true)

    // Simulate AI response
    setTimeout(() => {
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: "assistant",
        content: "Based on my analysis of your documents, here are the key findings...",
        timestamp: new Date(),
        insights: [
          { type: "chart", title: "Cost Comparison", data: {} },
          { type: "table", title: "Feature Matrix", data: {} },
        ],
      }
      setMessages((prev) => [...prev, assistantMessage])
      setIsLoading(false)
    }, 2000)
  }

  const handleSuggestedQuestion = (question: string) => {
    setInputValue(question)
  }

  return (
    <div className="h-full flex flex-col">
      <Tabs defaultValue="chat" className="flex-1 flex flex-col">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="chat">Chat & Analysis</TabsTrigger>
          <TabsTrigger value="insights">Insights</TabsTrigger>
          <TabsTrigger value="documents">Documents</TabsTrigger>
        </TabsList>

        <TabsContent value="chat" className="flex-1 flex flex-col space-y-4">
          {/* Analysis Mode Selector */}
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <span className="text-sm font-medium">Analysis Mode:</span>
                  <div className="flex space-x-2">
                    <Badge variant="default">General</Badge>
                    <Badge variant="outline">Summary</Badge>
                    <Badge variant="outline">Comparison</Badge>
                    <Badge variant="outline">Risk Analysis</Badge>
                  </div>
                </div>
                <Button size="sm" className="bg-gradient-to-r from-purple-600 to-blue-600">
                  <Sparkles className="w-4 h-4 mr-2" />
                  Generate Insights
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Chat Messages */}
          <div className="flex-1 overflow-y-auto space-y-4 p-4 bg-gray-50 rounded-lg">
            {messages.map((message) => (
              <div key={message.id} className={`flex ${message.type === "user" ? "justify-end" : "justify-start"}`}>
                <div className={`max-w-3xl ${message.type === "user" ? "order-2" : "order-1"}`}>
                  <div
                    className={`flex items-start space-x-3 ${message.type === "user" ? "flex-row-reverse space-x-reverse" : ""}`}
                  >
                    <Avatar className="w-8 h-8">
                      <AvatarFallback
                        className={message.type === "user" ? "bg-blue-600 text-white" : "bg-purple-600 text-white"}
                      >
                        {message.type === "user" ? "U" : "E"}
                      </AvatarFallback>
                    </Avatar>
                    <div
                      className={`rounded-lg p-4 ${
                        message.type === "user" ? "bg-blue-600 text-white" : "bg-white border border-gray-200"
                      }`}
                    >
                      <p className="text-sm">{message.content}</p>

                      {message.insights && (
                        <div className="mt-4 space-y-3">
                          {message.insights.map((insight, index) => (
                            <div key={index} className="bg-gray-50 rounded-lg p-3">
                              <div className="flex items-center justify-between mb-2">
                                <h4 className="font-medium text-gray-900">{insight.title}</h4>
                                <Badge variant="secondary">{insight.count} items</Badge>
                              </div>
                              <div className="h-32 bg-white rounded border flex items-center justify-center">
                                <p className="text-gray-500 text-sm">Interactive {insight.type} visualization</p>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}

                      {message.type === "assistant" && (
                        <div className="flex items-center space-x-2 mt-3 pt-3 border-t border-gray-100">
                          <Button size="sm" variant="ghost">
                            <Copy className="w-4 h-4" />
                          </Button>
                          <Button size="sm" variant="ghost">
                            <Download className="w-4 h-4" />
                          </Button>
                          <Button size="sm" variant="ghost">
                            <ThumbsUp className="w-4 h-4" />
                          </Button>
                          <Button size="sm" variant="ghost">
                            <ThumbsDown className="w-4 h-4" />
                          </Button>
                        </div>
                      )}
                    </div>
                  </div>
                  <p className="text-xs text-gray-500 mt-1 px-11">{message.timestamp.toLocaleTimeString()}</p>
                </div>
              </div>
            ))}

            {isLoading && (
              <div className="flex justify-start">
                <div className="flex items-start space-x-3">
                  <Avatar className="w-8 h-8">
                    <AvatarFallback className="bg-purple-600 text-white">E</AvatarFallback>
                  </Avatar>
                  <div className="bg-white border border-gray-200 rounded-lg p-4">
                    <div className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                      <div
                        className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                        style={{ animationDelay: "0.1s" }}
                      ></div>
                      <div
                        className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                        style={{ animationDelay: "0.2s" }}
                      ></div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Suggested Questions */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm">Suggested Questions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                {suggestedQuestions.map((question, index) => (
                  <Button
                    key={index}
                    variant="outline"
                    size="sm"
                    className="justify-start text-left h-auto p-3 bg-transparent"
                    onClick={() => handleSuggestedQuestion(question)}
                  >
                    {question}
                  </Button>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Input Area */}
          <div className="flex space-x-2">
            <Input
              placeholder="Ask me anything about your documents..."
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
              className="flex-1"
            />
            <Button onClick={handleSendMessage} disabled={!inputValue.trim() || isLoading}>
              <Send className="w-4 h-4" />
            </Button>
          </div>
        </TabsContent>

        <TabsContent value="insights" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <BarChart3 className="w-5 h-5" />
                  <span>Cost Analysis</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-48 bg-gray-100 rounded-lg flex items-center justify-center">
                  <p className="text-gray-500">Interactive cost comparison chart</p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <FileText className="w-5 h-5" />
                  <span>Key Findings</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="p-3 bg-blue-50 rounded-lg">
                    <h4 className="font-medium text-blue-900">Lowest Cost Option</h4>
                    <p className="text-sm text-blue-700">Vendor A offers 15% cost savings</p>
                  </div>
                  <div className="p-3 bg-green-50 rounded-lg">
                    <h4 className="font-medium text-green-900">Best Technical Fit</h4>
                    <p className="text-sm text-green-700">Vendor B meets 95% of requirements</p>
                  </div>
                  <div className="p-3 bg-yellow-50 rounded-lg">
                    <h4 className="font-medium text-yellow-900">Risk Assessment</h4>
                    <p className="text-sm text-yellow-700">3 medium-risk items identified</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="documents" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {documents.map((doc, index) => (
              <Card key={index}>
                <CardContent className="p-4">
                  <div className="flex items-start space-x-3">
                    <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                      <FileText className="w-5 h-5 text-blue-600" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-medium text-sm truncate">{doc.name}</h3>
                      <p className="text-xs text-gray-500">
                        {doc.type} • {doc.size}
                      </p>
                      <Badge variant={doc.status === "processed" ? "default" : "secondary"} className="mt-2">
                        {doc.status}
                      </Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
