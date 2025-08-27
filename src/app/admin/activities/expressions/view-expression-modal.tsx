"use client"

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Expression } from "@/types/expression"
import { Badge } from "@/components/ui/badge"
import { Calendar, FileText, Hash, Settings, Image } from "lucide-react"

interface ViewExpressionModalProps {
  isOpen: boolean
  onClose: () => void
  expression: Expression | null
}

export function ViewExpressionModal({ 
  isOpen, 
  onClose, 
  expression
}: ViewExpressionModalProps) {
  if (!expression) return null

  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString)
      return date.toLocaleString('vi-VN', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
      })
    } catch {
      return dateString
    }
  }

  const getStatusBadge = (status: number) => {
    if (status === 1) {
      return (
        <Badge className="bg-green-100 text-green-800 hover:bg-green-100">
          <span className="w-2 h-2 bg-green-500 rounded-full mr-1"></span>
          Active
        </Badge>
      )
    } else {
      return (
        <Badge className="bg-red-100 text-red-800 hover:bg-red-100">
          <span className="w-2 h-2 bg-red-500 rounded-full mr-1"></span>
          Inactive
        </Badge>
      )
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-blue-700">
            <FileText className="h-5 w-5" />
            Expression Details
          </DialogTitle>
          <DialogDescription>
            View all information about this expression.
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* Basic Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-800 border-b pb-2">Basic Information</h3>
            
            <div className="grid grid-cols-1 gap-4">
              <div className="flex items-start gap-3">
                <Hash className="h-4 w-4 text-gray-500 mt-1 flex-shrink-0" />
                <div className="flex-1">
                  <label className="text-sm font-medium text-gray-700">ID</label>
                  <p className="text-sm text-gray-900 font-mono bg-gray-50 p-2 rounded border break-all">
                    {expression.id}
                  </p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <FileText className="h-4 w-4 text-purple-500 mt-1 flex-shrink-0" />
                <div className="flex-1">
                  <label className="text-sm font-medium text-gray-700">Name</label>
                  <p className="text-sm text-gray-900 bg-purple-50 p-2 rounded border">
                    {expression.name}
                  </p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <FileText className="h-4 w-4 text-yellow-500 mt-1 flex-shrink-0" />
                <div className="flex-1">
                  <label className="text-sm font-medium text-gray-700">Description</label>
                  <p className="text-sm text-gray-900 bg-yellow-50 p-2 rounded border min-h-[40px]">
                    {expression.description || "No description provided"}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Configuration */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-800 border-b pb-2">Configuration</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-start gap-3">
                <Image className="h-4 w-4 text-blue-500 mt-1 flex-shrink-0" />
                <div className="flex-1">
                  <label className="text-sm font-medium text-gray-700">Image</label>
                  <div className="mt-1">
                    {expression.imageUrl ? (
                      <div className="space-y-2">
                        <img 
                          src={expression.imageUrl} 
                          alt="Expression" 
                          className="w-24 h-24 object-cover rounded border"
                          onError={(e) => {
                            e.currentTarget.style.display = 'none';
                          }}
                        />
                        <p className="text-xs text-blue-600 bg-blue-50 p-2 rounded border break-all">
                          {expression.imageUrl}
                        </p>
                      </div>
                    ) : (
                      <p className="text-sm text-gray-400 bg-gray-50 p-2 rounded border">
                        No image provided
                      </p>
                    )}
                  </div>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <Settings className="h-4 w-4 text-green-500 mt-1 flex-shrink-0" />
                <div className="flex-1">
                  <label className="text-sm font-medium text-gray-700">Status</label>
                  <div className="mt-1">
                    {getStatusBadge(expression.status)}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Timestamps */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-800 border-b pb-2">Timeline</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-start gap-3">
                <Calendar className="h-4 w-4 text-blue-500 mt-1 flex-shrink-0" />
                <div className="flex-1">
                  <label className="text-sm font-medium text-gray-700">Created Date</label>
                  <p className="text-sm text-gray-900 bg-blue-50 p-2 rounded border font-mono">
                    {formatDate(expression.createdDate)}
                  </p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <Calendar className="h-4 w-4 text-orange-500 mt-1 flex-shrink-0" />
                <div className="flex-1">
                  <label className="text-sm font-medium text-gray-700">Last Updated</label>
                  <p className="text-sm text-gray-900 bg-orange-50 p-2 rounded border font-mono">
                    {formatDate(expression.lastUpdate)}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-end pt-4 border-t">
          <Button 
            type="button" 
            variant="outline" 
            onClick={onClose}
          >
            Close
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
