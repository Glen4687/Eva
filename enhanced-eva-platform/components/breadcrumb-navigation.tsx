"use client"

import { ChevronRight, Home } from "lucide-react"
import { Button } from "@/components/ui/button"

interface BreadcrumbNavigationProps {
  items: Array<{
    label: string
    onClick?: () => void
    isActive?: boolean
  }>
}

export default function BreadcrumbNavigation({ items }: BreadcrumbNavigationProps) {
  return (
    <nav className="flex items-center space-x-2 text-sm text-gray-600">
      <Button variant="ghost" size="sm" className="p-1 h-auto">
        <Home className="w-4 h-4" />
      </Button>
      {items.map((item, index) => (
        <div key={index} className="flex items-center space-x-2">
          <ChevronRight className="w-4 h-4 text-gray-400" />
          {item.onClick ? (
            <Button
              variant="ghost"
              size="sm"
              onClick={item.onClick}
              className={`p-1 h-auto ${item.isActive ? "text-blue-600 font-medium" : "text-gray-600 hover:text-gray-900"}`}
            >
              {item.label}
            </Button>
          ) : (
            <span className={item.isActive ? "text-blue-600 font-medium" : "text-gray-600"}>{item.label}</span>
          )}
        </div>
      ))}
    </nav>
  )
}
