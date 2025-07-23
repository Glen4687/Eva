"use client"

import { useState, useRef, useEffect } from "react"
import {
  Send,
  Download,
  Copy,
  ThumbsUp,
  ThumbsDown,
  BarChart3,
  FileText,
  Sparkles,
  MessageSquare,
  Bot,
  User,
  Lightbulb,
  TrendingUp,
  AlertTriangle,
  Clock,
  Maximize2,
  UserCheck,
  Briefcase,
  Shield,
  Target,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Textarea } from "@/components/ui/textarea"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import { Tooltip, TooltipContent, TooltipTrigger, TooltipProvider } from "@/components/ui/tooltip"

interface Message {
  id: string
  type: "user" | "assistant"
  content: string
  timestamp: Date
  attachments?: string[]
  insights?: InsightData[]
  feedback?: "positive" | "negative" | null
}

interface InsightData {
  type: "chart" | "table" | "summary" | "comparison"
  title: string
  data: any
}

const analysisMode = [
  {
    id: "general",
    name: "General Analysis",
    description: "Comprehensive document analysis with key insights",
    icon: MessageSquare,
    color: "blue",
  },
  {
    id: "summary",
    name: "Summary Mode",
    description: "Concise summaries of document content",
    icon: FileText,
    color: "green",
  },
  {
    id: "comparison",
    name: "Comparison Mode",
    description: "Side-by-side comparison of multiple documents",
    icon: BarChart3,
    color: "purple",
  },
  {
    id: "risk",
    name: "Risk Analysis",
    description: "Identify potential risks and mitigation strategies",
    icon: AlertTriangle,
    color: "red",
  },
  {
    id: "persona",
    name: "Persona Mode",
    description: "Analysis from specific stakeholder perspectives",
    icon: UserCheck,
    color: "orange",
  },
]

const procurementPersonas = [
  {
    id: "category-analyst",
    name: "Category Analyst",
    description: "Focus on market analysis, spend data, and category insights",
    icon: BarChart3,
    color: "blue",
    expertise: ["Market Analysis", "Spend Analytics", "Category Strategy"],
    suggestedQuestions: [
      "What is the total addressable market for this category?",
      "Analyze the spend distribution across different suppliers",
      "Compare pricing trends against market benchmarks",
      "Identify cost optimization opportunities in this category",
      "What are the key market drivers affecting pricing?",
      "Evaluate supplier market positioning and competitiveness",
    ],
  },
  {
    id: "category-manager",
    name: "Category Manager",
    description: "Strategic sourcing and supplier relationship management",
    icon: Briefcase,
    color: "green",
    expertise: ["Strategic Sourcing", "Supplier Management", "Contract Negotiation"],
    suggestedQuestions: [
      "Evaluate the strategic fit of each supplier proposal",
      "What are the key negotiation points for contract terms?",
      "Assess supplier relationship management capabilities",
      "Identify opportunities for strategic partnerships",
      "Compare total cost of ownership across proposals",
      "What are the long-term sourcing implications?",
    ],
  },
  {
    id: "procurement-officer",
    name: "Procurement Officer",
    description: "Operational procurement and compliance oversight",
    icon: Shield,
    color: "purple",
    expertise: ["Process Compliance", "Vendor Evaluation", "Risk Assessment"],
    suggestedQuestions: [
      "Verify compliance with procurement policies and regulations",
      "Assess vendor qualification and certification status",
      "Identify potential compliance risks in the proposals",
      "Evaluate adherence to RFQ requirements and specifications",
      "What are the audit trail and documentation requirements?",
      "Review contract terms for legal and regulatory compliance",
    ],
  },
  {
    id: "sourcing-specialist",
    name: "Sourcing Specialist",
    description: "Technical evaluation and supplier qualification",
    icon: Target,
    color: "orange",
    expertise: ["Technical Evaluation", "Supplier Qualification", "RFQ Management"],
    suggestedQuestions: [
      "Evaluate technical specifications and requirements compliance",
      "Compare supplier capabilities against RFQ criteria",
      "Assess implementation timelines and project delivery",
      "What are the technical risks and mitigation strategies?",
      "Analyze supplier references and past performance",
      "Review quality assurance and testing procedures",
    ],
  },
]

// Mode-specific suggested questions
const modeSuggestedQuestions = {
  general: [
    "What are the key highlights from all RFQ documents?",
    "Provide an overview of the procurement requirements",
    "What are the main deliverables outlined in the RFQ?",
    "Summarize the evaluation criteria and scoring methodology",
    "What are the project timelines and key milestones?",
    "Identify the primary stakeholders and their roles",
  ],
  summary: [
    "Create a concise executive summary of the RFQ",
    "Summarize the technical requirements in bullet points",
    "What are the key commercial terms and conditions?",
    "Provide a brief overview of each vendor proposal",
    "Summarize the budget constraints and financial requirements",
    "What are the essential compliance and regulatory requirements?",
  ],
  comparison: [
    "Compare pricing structures across all vendor proposals",
    "Generate a feature comparison matrix for technical capabilities",
    "Compare implementation timelines and project schedules",
    "Analyze the differences in service level agreements",
    "Compare vendor experience and qualifications",
    "What are the key differentiators between proposals?",
  ],
  risk: [
    "Identify potential financial risks in the proposals",
    "What are the technical implementation risks?",
    "Assess vendor-related risks and dependencies",
    "Analyze timeline and delivery risks",
    "What compliance and regulatory risks should be considered?",
    "Identify mitigation strategies for high-priority risks",
  ],
}

export default function EnhancedChatAnalysis() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      type: "assistant",
      content:
        "Hello! I've successfully analyzed your 3 documents and I'm ready to help you with your RFQ analysis. I can provide summaries, comparisons, risk assessments, persona-based insights, and answer specific questions about your documents. What would you like to explore first?",
      timestamp: new Date(Date.now() - 300000),
      insights: [
        {
          type: "summary",
          title: "Document Processing Complete",
          data: { processed: 3, total: 3 },
        },
      ],
    },
  ])
  const [inputValue, setInputValue] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [selectedMode, setSelectedMode] = useState("general")
  const [selectedPersona, setSelectedPersona] = useState<string | null>(null)
  const [expandedInsight, setExpandedInsight] = useState<string | null>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

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
      let responseContent = `Based on my analysis of your documents in ${selectedMode} mode`

      if (selectedMode === "persona" && selectedPersona) {
        const persona = procurementPersonas.find((p) => p.id === selectedPersona)
        responseContent = `From a ${persona?.name}'s perspective, here are the key findings`
      }

      responseContent += ", here are the key insights..."

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: "assistant",
        content: responseContent,
        timestamp: new Date(),
        insights: [
          {
            type: "chart",
            title: selectedMode === "persona" ? "Persona-Specific Analysis" : "Cost Comparison Analysis",
            data: { vendors: 3, savings: "15%" },
          },
          {
            type: "table",
            title: "Feature Comparison Matrix",
            data: { features: 12, matches: 8 },
          },
        ],
      }
      setMessages((prev) => [...prev, assistantMessage])
      setIsLoading(false)
    }, 2000)
  }

  const handleSuggestedQuestion = (question: string) => {
    setInputValue(question)
  }

  const handleFeedback = (messageId: string, feedback: "positive" | "negative") => {
    setMessages((prev) => prev.map((msg) => (msg.id === messageId ? { ...msg, feedback } : msg)))
  }

  const copyMessage = (content: string) => {
    navigator.clipboard.writeText(content)
  }

  const getCurrentModeConfig = () => {
    return analysisMode.find((mode) => mode.id === selectedMode) || analysisMode[0]
  }

  const handleModeChange = (modeId: string) => {
    setSelectedMode(modeId)
    if (modeId !== "persona") {
      setSelectedPersona(null)
    }
  }

  const getSelectedPersona = () => {
    return procurementPersonas.find((p) => p.id === selectedPersona)
  }

  // Get suggested questions based on current mode and persona
  const getSuggestedQuestions = () => {
    if (selectedMode === "persona" && selectedPersona) {
      const persona = procurementPersonas.find((p) => p.id === selectedPersona)
      return persona?.suggestedQuestions || []
    }

    // Return mode-specific questions
    return modeSuggestedQuestions[selectedMode as keyof typeof modeSuggestedQuestions] || modeSuggestedQuestions.general
  }

  // Get the display title for suggested questions section
  const getSuggestedQuestionsTitle = () => {
    if (selectedMode === "persona" && selectedPersona) {
      const persona = procurementPersonas.find((p) => p.id === selectedPersona)
      return `${persona?.name} Questions`
    }

    const modeNames = {
      general: "General Analysis Questions",
      summary: "Summary Questions",
      comparison: "Comparison Questions",
      risk: "Risk Analysis Questions",
    }

    return modeNames[selectedMode as keyof typeof modeNames] || "Suggested Questions"
  }

  return (
    <div className="h-full flex flex-col space-y-6">
      {/* Analysis Mode Selector */}
      <Card>
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Sparkles className="w-5 h-5 text-purple-600" />
              <span>Analysis Mode</span>
            </div>
            <Button size="sm" className="bg-gradient-to-r from-purple-600 to-blue-600">
              <Lightbulb className="w-4 h-4 mr-2" />
              Generate Insights
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {analysisMode.map((mode) => (
              <div
                key={mode.id}
                className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${
                  selectedMode === mode.id
                    ? `border-${mode.color}-500 bg-${mode.color}-50`
                    : "border-gray-200 hover:border-gray-300"
                }`}
                onClick={() => handleModeChange(mode.id)}
              >
                <div className="flex flex-col items-center text-center space-y-2">
                  <div
                    className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                      selectedMode === mode.id ? `bg-${mode.color}-100` : "bg-gray-100"
                    }`}
                  >
                    <mode.icon
                      className={`w-5 h-5 ${selectedMode === mode.id ? `text-${mode.color}-600` : "text-gray-600"}`}
                    />
                  </div>
                  <div>
                    <h3 className="font-medium text-sm text-gray-900">{mode.name}</h3>
                    <p className="text-xs text-gray-600 mt-1">{mode.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Persona Selection */}
          {selectedMode === "persona" && (
            <div className="mt-6 p-4 bg-orange-50 border border-orange-200 rounded-lg">
              <h4 className="font-medium text-orange-900 mb-3">Select Procurement Persona</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
                {procurementPersonas.map((persona) => (
                  <div
                    key={persona.id}
                    className={`p-3 border-2 rounded-lg cursor-pointer transition-all ${
                      selectedPersona === persona.id
                        ? `border-${persona.color}-500 bg-${persona.color}-50`
                        : "border-gray-200 hover:border-gray-300 bg-white"
                    }`}
                    onClick={() => setSelectedPersona(persona.id)}
                  >
                    <div className="flex items-start space-x-3">
                      <div
                        className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${
                          selectedPersona === persona.id ? `bg-${persona.color}-100` : "bg-gray-100"
                        }`}
                      >
                        <persona.icon
                          className={`w-4 h-4 ${
                            selectedPersona === persona.id ? `text-${persona.color}-600` : "text-gray-600"
                          }`}
                        />
                      </div>
                      <div className="min-w-0">
                        <h5 className="font-medium text-sm text-gray-900">{persona.name}</h5>
                        <p className="text-xs text-gray-600 mt-1">{persona.description}</p>
                        <div className="flex flex-wrap gap-1 mt-2">
                          {persona.expertise.slice(0, 2).map((skill, index) => (
                            <Badge key={index} variant="outline" className="text-xs">
                              {skill}
                            </Badge>
                          ))}
                          {persona.expertise.length > 2 && (
                            <Badge variant="outline" className="text-xs">
                              +{persona.expertise.length - 2}
                            </Badge>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Chat Interface - Full Width */}
      <Card className="flex-1 flex flex-col">
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Bot className="w-5 h-5 text-purple-600" />
              <span>AI Analysis Chat</span>
              <Badge variant="secondary">{getCurrentModeConfig().name}</Badge>
              {selectedMode === "persona" && selectedPersona && (
                <Badge variant="outline" className="bg-orange-50 text-orange-700">
                  {getSelectedPersona()?.name}
                </Badge>
              )}
            </div>
            <Button variant="outline" size="sm">
              <Maximize2 className="w-4 h-4" />
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent className="flex-1 flex flex-col space-y-4">
          {/* Messages */}
          <ScrollArea className="flex-1 h-96">
            <div className="space-y-4 pr-4">
              {messages.map((message) => (
                <div key={message.id} className={`flex ${message.type === "user" ? "justify-end" : "justify-start"}`}>
                  <div className={`max-w-4xl ${message.type === "user" ? "order-2" : "order-1"}`}>
                    <div
                      className={`flex items-start space-x-3 ${
                        message.type === "user" ? "flex-row-reverse space-x-reverse" : ""
                      }`}
                    >
                      <Avatar className="w-8 h-8 flex-shrink-0">
                        <AvatarFallback
                          className={
                            message.type === "user"
                              ? "bg-blue-600 text-white"
                              : "bg-gradient-to-r from-purple-600 to-blue-600 text-white"
                          }
                        >
                          {message.type === "user" ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
                        </AvatarFallback>
                      </Avatar>
                      <div
                        className={`rounded-lg p-4 ${
                          message.type === "user"
                            ? "bg-blue-600 text-white"
                            : "bg-white border border-gray-200 shadow-sm"
                        }`}
                      >
                        <p className="text-sm leading-relaxed">{message.content}</p>

                        {message.insights && message.insights.length > 0 && (
                          <div className="mt-4 space-y-3">
                            {message.insights.map((insight, index) => (
                              <div key={index} className="bg-gray-50 rounded-lg p-3">
                                <div className="flex items-center justify-between mb-2">
                                  <h4 className="font-medium text-gray-900 text-sm">{insight.title}</h4>
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() =>
                                      setExpandedInsight(expandedInsight === insight.title ? null : insight.title)
                                    }
                                  >
                                    <Maximize2 className="w-3 h-3" />
                                  </Button>
                                </div>
                                <div className="h-32 bg-white rounded border flex items-center justify-center">
                                  <div className="text-center">
                                    <TrendingUp className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                                    <p className="text-gray-500 text-sm">Interactive {insight.type} visualization</p>
                                    <p className="text-xs text-gray-400 mt-1">
                                      {JSON.stringify(insight.data).slice(0, 50)}...
                                    </p>
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        )}

                        {message.type === "assistant" && (
                          <div className="flex items-center space-x-2 mt-3 pt-3 border-t border-gray-100">
                            <TooltipProvider>
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <Button size="sm" variant="ghost" onClick={() => copyMessage(message.content)}>
                                    <Copy className="w-4 h-4" />
                                  </Button>
                                </TooltipTrigger>
                                <TooltipContent>Copy message</TooltipContent>
                              </Tooltip>
                            </TooltipProvider>
                            <TooltipProvider>
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <Button size="sm" variant="ghost">
                                    <Download className="w-4 h-4" />
                                  </Button>
                                </TooltipTrigger>
                                <TooltipContent>Export analysis</TooltipContent>
                              </Tooltip>
                            </TooltipProvider>
                            <Separator orientation="vertical" className="h-4" />
                            <TooltipProvider>
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <Button
                                    size="sm"
                                    variant="ghost"
                                    onClick={() => handleFeedback(message.id, "positive")}
                                    className={message.feedback === "positive" ? "text-green-600" : ""}
                                  >
                                    <ThumbsUp className="w-4 h-4" />
                                  </Button>
                                </TooltipTrigger>
                                <TooltipContent>Helpful response</TooltipContent>
                              </Tooltip>
                            </TooltipProvider>
                            <TooltipProvider>
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <Button
                                    size="sm"
                                    variant="ghost"
                                    onClick={() => handleFeedback(message.id, "negative")}
                                    className={message.feedback === "negative" ? "text-red-600" : ""}
                                  >
                                    <ThumbsDown className="w-4 h-4" />
                                  </Button>
                                </TooltipTrigger>
                                <TooltipContent>Not helpful</TooltipContent>
                              </Tooltip>
                            </TooltipProvider>
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center space-x-2 mt-1 px-11">
                      <Clock className="w-3 h-3 text-gray-400" />
                      <span className="text-xs text-gray-500">{message.timestamp.toLocaleTimeString()}</span>
                    </div>
                  </div>
                </div>
              ))}

              {isLoading && (
                <div className="flex justify-start">
                  <div className="flex items-start space-x-3">
                    <Avatar className="w-8 h-8">
                      <AvatarFallback className="bg-gradient-to-r from-purple-600 to-blue-600 text-white">
                        <Bot className="w-4 h-4" />
                      </AvatarFallback>
                    </Avatar>
                    <div className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
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
                        <span className="text-sm text-gray-500 ml-2">
                          {selectedMode === "persona" && selectedPersona
                            ? `Analyzing from ${getSelectedPersona()?.name} perspective...`
                            : "Analyzing documents..."}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>
          </ScrollArea>

          {/* Dynamic Suggested Questions */}
          <Card className="bg-gray-50">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm flex items-center space-x-2">
                <Lightbulb className="w-4 h-4 text-yellow-600" />
                <span>{getSuggestedQuestionsTitle()}</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                {getSuggestedQuestions().map((question, index) => (
                  <Button
                    key={index}
                    variant="outline"
                    size="sm"
                    className={`justify-start text-left h-auto p-3 bg-white transition-colors ${
                      selectedMode === "persona" && selectedPersona
                        ? "hover:bg-orange-50 hover:border-orange-200"
                        : selectedMode === "general"
                          ? "hover:bg-blue-50 hover:border-blue-200"
                          : selectedMode === "summary"
                            ? "hover:bg-green-50 hover:border-green-200"
                            : selectedMode === "comparison"
                              ? "hover:bg-purple-50 hover:border-purple-200"
                              : selectedMode === "risk"
                                ? "hover:bg-red-50 hover:border-red-200"
                                : "hover:bg-blue-50 hover:border-blue-200"
                    }`}
                    onClick={() => handleSuggestedQuestion(question)}
                  >
                    <span className="text-sm">{question}</span>
                  </Button>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Input Area */}
          <div className="flex space-x-2">
            <Textarea
              placeholder={
                selectedMode === "persona" && selectedPersona
                  ? `Ask me anything from a ${getSelectedPersona()?.name}'s perspective...`
                  : `Ask me anything about your documents in ${getCurrentModeConfig().name.toLowerCase()}...`
              }
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyPress={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault()
                  handleSendMessage()
                }
              }}
              className="flex-1 min-h-[60px] resize-none"
              rows={2}
            />
            <Button
              onClick={handleSendMessage}
              disabled={!inputValue.trim() || isLoading || (selectedMode === "persona" && !selectedPersona)}
              size="lg"
              className="bg-gradient-to-r from-purple-600 to-blue-600"
            >
              <Send className="w-4 h-4" />
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
