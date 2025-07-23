"use client"

import { useState } from "react"
import {
  TrendingUp,
  TrendingDown,
  DollarSign,
  Clock,
  AlertTriangle,
  CheckCircle,
  BarChart3,
  PieChart,
  Target,
  Zap,
  Download,
  RefreshCw,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

const insights = {
  summary: {
    totalSavings: "$45,000",
    savingsPercentage: 15,
    bestOption: "Vendor A",
    riskLevel: "Medium",
    recommendedAction: "Proceed with Vendor A with risk mitigation",
  },
  costAnalysis: [
    { vendor: "Vendor A", cost: 285000, savings: 15, risk: "Low" },
    { vendor: "Vendor B", cost: 320000, savings: 5, risk: "Medium" },
    { vendor: "Vendor C", cost: 335000, savings: 0, risk: "High" },
  ],
  riskAssessment: [
    { category: "Financial", level: "Low", impact: "Medium", mitigation: "Budget contingency" },
    { category: "Technical", level: "Medium", impact: "High", mitigation: "Technical review" },
    { category: "Timeline", level: "High", impact: "Medium", mitigation: "Phased implementation" },
    { category: "Compliance", level: "Low", impact: "High", mitigation: "Regular audits" },
  ],
  keyFindings: [
    {
      title: "Cost Optimization Opportunity",
      description: "Vendor A offers 15% cost savings while maintaining quality standards",
      impact: "High",
    },
    {
      title: "Technical Compatibility",
      description: "All vendors meet 90%+ of technical requirements",
      impact: "Medium",
    },
    {
      title: "Implementation Timeline",
      description: "Vendor B offers fastest implementation (6 weeks vs 8-10 weeks)",
      impact: "Medium",
    },
    {
      title: "Support Coverage",
      description: "Vendor C provides 24/7 support vs business hours only",
      impact: "Low",
    },
  ],
}

export default function ProjectInsightsDashboard() {
  const [selectedTimeframe, setSelectedTimeframe] = useState("current")

  const getRiskColor = (level: string) => {
    switch (level.toLowerCase()) {
      case "low":
        return "text-green-600 bg-green-100"
      case "medium":
        return "text-yellow-600 bg-yellow-100"
      case "high":
        return "text-red-600 bg-red-100"
      default:
        return "text-gray-600 bg-gray-100"
    }
  }

  const getImpactColor = (impact: string) => {
    switch (impact.toLowerCase()) {
      case "high":
        return "text-red-600 bg-red-100"
      case "medium":
        return "text-yellow-600 bg-yellow-100"
      case "low":
        return "text-green-600 bg-green-100"
      default:
        return "text-gray-600 bg-gray-100"
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center space-x-2">
              <Zap className="w-5 h-5 text-purple-600" />
              <span>AI-Generated Insights</span>
            </CardTitle>
            <div className="flex items-center space-x-2">
              <Button variant="outline" size="sm">
                <RefreshCw className="w-4 h-4 mr-2" />
                Refresh
              </Button>
              <Button variant="outline" size="sm">
                <Download className="w-4 h-4 mr-2" />
                Export
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <DollarSign className="w-8 h-8 text-green-600 mx-auto mb-2" />
              <div className="text-2xl font-bold text-green-600">{insights.summary.totalSavings}</div>
              <div className="text-sm text-green-700">Potential Savings</div>
              <div className="text-xs text-green-600 mt-1">{insights.summary.savingsPercentage}% reduction</div>
            </div>
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <Target className="w-8 h-8 text-blue-600 mx-auto mb-2" />
              <div className="text-lg font-bold text-blue-600">{insights.summary.bestOption}</div>
              <div className="text-sm text-blue-700">Recommended Vendor</div>
              <div className="text-xs text-blue-600 mt-1">Best overall value</div>
            </div>
            <div className="text-center p-4 bg-yellow-50 rounded-lg">
              <AlertTriangle className="w-8 h-8 text-yellow-600 mx-auto mb-2" />
              <div className="text-lg font-bold text-yellow-600">{insights.summary.riskLevel}</div>
              <div className="text-sm text-yellow-700">Risk Level</div>
              <div className="text-xs text-yellow-600 mt-1">Manageable risks</div>
            </div>
            <div className="text-center p-4 bg-purple-50 rounded-lg">
              <CheckCircle className="w-8 h-8 text-purple-600 mx-auto mb-2" />
              <div className="text-lg font-bold text-purple-600">Complete</div>
              <div className="text-sm text-purple-700">Analysis Status</div>
              <div className="text-xs text-purple-600 mt-1">Ready for review</div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="cost">Cost Analysis</TabsTrigger>
          <TabsTrigger value="risk">Risk Assessment</TabsTrigger>
          <TabsTrigger value="recommendations">Recommendations</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          {/* Key Findings */}
          <Card>
            <CardHeader>
              <CardTitle>Key Findings</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {insights.keyFindings.map((finding, index) => (
                  <div key={index} className="p-4 border border-gray-200 rounded-lg">
                    <div className="flex items-start justify-between mb-2">
                      <h3 className="font-semibold text-gray-900">{finding.title}</h3>
                      <Badge className={getImpactColor(finding.impact)} variant="secondary">
                        {finding.impact} Impact
                      </Badge>
                    </div>
                    <p className="text-gray-700 text-sm">{finding.description}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Quick Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm">Processing Summary</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Documents Analyzed:</span>
                    <span className="font-medium">8</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Insights Generated:</span>
                    <span className="font-medium">24</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Processing Time:</span>
                    <span className="font-medium">4.2 min</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Status:</span>
                    <span className="font-medium text-green-600">Complete</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm">Vendor Comparison</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-32 bg-gray-100 rounded-lg flex items-center justify-center">
                  <div className="text-center">
                    <BarChart3 className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                    <p className="text-gray-500 text-sm">Cost comparison chart</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm">Risk Distribution</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-32 bg-gray-100 rounded-lg flex items-center justify-center">
                  <div className="text-center">
                    <PieChart className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                    <p className="text-gray-500 text-sm">Risk assessment chart</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="cost" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Cost Analysis Breakdown</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {insights.costAnalysis.map((vendor, index) => (
                  <div key={index} className="p-4 border border-gray-200 rounded-lg">
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="font-semibold text-gray-900">{vendor.vendor}</h3>
                      <div className="flex items-center space-x-2">
                        <Badge className={getRiskColor(vendor.risk)} variant="secondary">
                          {vendor.risk} Risk
                        </Badge>
                        {vendor.savings > 0 && (
                          <Badge className="bg-green-100 text-green-800" variant="secondary">
                            {vendor.savings}% savings
                          </Badge>
                        )}
                      </div>
                    </div>
                    <div className="grid grid-cols-3 gap-4 text-sm">
                      <div>
                        <span className="text-gray-600">Total Cost:</span>
                        <div className="font-semibold">${vendor.cost.toLocaleString()}</div>
                      </div>
                      <div>
                        <span className="text-gray-600">Savings:</span>
                        <div className={`font-semibold ${vendor.savings > 0 ? "text-green-600" : "text-gray-900"}`}>
                          {vendor.savings > 0 ? `$${(335000 - vendor.cost).toLocaleString()}` : "$0"}
                        </div>
                      </div>
                      <div>
                        <span className="text-gray-600">Risk Level:</span>
                        <div className="font-semibold">{vendor.risk}</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="risk" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Risk Assessment Matrix</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {insights.riskAssessment.map((risk, index) => (
                  <div key={index} className="p-4 border border-gray-200 rounded-lg">
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="font-semibold text-gray-900">{risk.category}</h3>
                      <div className="flex items-center space-x-2">
                        <Badge className={getRiskColor(risk.level)} variant="secondary">
                          {risk.level} Risk
                        </Badge>
                        <Badge className={getImpactColor(risk.impact)} variant="secondary">
                          {risk.impact} Impact
                        </Badge>
                      </div>
                    </div>
                    <div className="text-sm">
                      <span className="text-gray-600">Mitigation Strategy:</span>
                      <div className="font-medium mt-1">{risk.mitigation}</div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="recommendations" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>AI Recommendations</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                  <div className="flex items-start space-x-3">
                    <CheckCircle className="w-6 h-6 text-blue-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <h3 className="font-semibold text-blue-900 mb-2">Primary Recommendation</h3>
                      <p className="text-blue-800 mb-3">{insights.summary.recommendedAction}</p>
                      <div className="space-y-2 text-sm">
                        <div className="flex items-center space-x-2">
                          <TrendingUp className="w-4 h-4 text-green-600" />
                          <span>15% cost savings potential</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Clock className="w-4 h-4 text-blue-600" />
                          <span>8-week implementation timeline</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <AlertTriangle className="w-4 h-4 text-yellow-600" />
                          <span>Medium risk level - manageable with proper mitigation</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 border border-gray-200 rounded-lg">
                    <h4 className="font-semibold text-gray-900 mb-2">Next Steps</h4>
                    <ul className="space-y-2 text-sm text-gray-700">
                      <li className="flex items-center space-x-2">
                        <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                        <span>Schedule vendor presentation with Vendor A</span>
                      </li>
                      <li className="flex items-center space-x-2">
                        <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                        <span>Conduct technical feasibility review</span>
                      </li>
                      <li className="flex items-center space-x-2">
                        <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                        <span>Develop risk mitigation plan</span>
                      </li>
                      <li className="flex items-center space-x-2">
                        <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                        <span>Prepare contract negotiations</span>
                      </li>
                    </ul>
                  </div>

                  <div className="p-4 border border-gray-200 rounded-lg">
                    <h4 className="font-semibold text-gray-900 mb-2">Key Considerations</h4>
                    <ul className="space-y-2 text-sm text-gray-700">
                      <li className="flex items-center space-x-2">
                        <AlertTriangle className="w-4 h-4 text-yellow-600" />
                        <span>Timeline constraints may require phased approach</span>
                      </li>
                      <li className="flex items-center space-x-2">
                        <DollarSign className="w-4 h-4 text-green-600" />
                        <span>Budget allocation for contingency planning</span>
                      </li>
                      <li className="flex items-center space-x-2">
                        <CheckCircle className="w-4 h-4 text-blue-600" />
                        <span>Compliance requirements fully satisfied</span>
                      </li>
                      <li className="flex items-center space-x-2">
                        <TrendingDown className="w-4 h-4 text-red-600" />
                        <span>Monitor market conditions for pricing changes</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
