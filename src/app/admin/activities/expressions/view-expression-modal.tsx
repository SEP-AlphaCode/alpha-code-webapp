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
import { Calendar, FileText, Hash, Settings, Image as ImageIcon } from "lucide-react"
import Image from "next/image"
import { useAdminTranslation } from "@/lib/i18n/hooks/use-translation"

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
  const { t, isLoading } = useAdminTranslation()
  
  if (!expression) return null

  if (isLoading) {
    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="sm:max-w-[600px]">
          <div className="animate-pulse space-y-4">
            <div className="h-6 bg-gray-200 rounded w-1/3"></div>
            <div className="h-4 bg-gray-200 rounded w-2/3"></div>
            <div className="space-y-3">
              <div className="h-4 bg-gray-200 rounded w-full"></div>
              <div className="h-4 bg-gray-200 rounded w-3/4"></div>
              <div className="h-4 bg-gray-200 rounded w-1/2"></div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    )
  }

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
          {t('common.active')}
        </Badge>
      )
    } else {
      return (
        <Badge className="bg-red-100 text-red-800 hover:bg-red-100">
          <span className="w-2 h-2 bg-red-500 rounded-full mr-1"></span>
          {t('common.inactive')}
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
            {t('expressionManagement.viewTitle')}
          </DialogTitle>
          <DialogDescription>
            {t('expressionManagement.viewDescription')}
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* Basic Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-800 border-b pb-2">{t('common.basicInformation')}</h3>
            
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
                <Hash className="h-4 w-4 text-blue-500 mt-1 flex-shrink-0" />
                <div className="flex-1">
                  <label className="text-sm font-medium text-gray-700">{t('expressionManagement.fields.code')}</label>
                  <p className="text-sm text-blue-900 font-mono bg-blue-50 p-2 rounded border">
                    {expression.code}
                  </p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <FileText className="h-4 w-4 text-purple-500 mt-1 flex-shrink-0" />
                <div className="flex-1">
                  <label className="text-sm font-medium text-gray-700">{t('expressionManagement.fields.name')}</label>
                  <p className="text-sm text-gray-900 bg-purple-50 p-2 rounded border">
                    {expression.name}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Configuration */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-800 border-b pb-2">{t('common.configuration')}</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-start gap-3">
                <ImageIcon className="h-4 w-4 text-blue-500 mt-1 flex-shrink-0" />
                <div className="flex-1">
                  <label className="text-sm font-medium text-gray-700">{t('common.image')}</label>
                  <div className="mt-1">
                    {expression.imageUrl ? (
                      <div className="space-y-2">
                        <Image 
                          src={expression.imageUrl} 
                          alt="Expression" 
                          width={96}
                          height={96}
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
                        {t('common.noImageProvided')}
                      </p>
                    )}
                  </div>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <Settings className="h-4 w-4 text-green-500 mt-1 flex-shrink-0" />
                <div className="flex-1">
                  <label className="text-sm font-medium text-gray-700">{t('expressionManagement.fields.status')}</label>
                  <div className="mt-1">
                    {getStatusBadge(expression.status)}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Timestamps */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-800 border-b pb-2">{t('common.timeline')}</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-start gap-3">
                <Calendar className="h-4 w-4 text-blue-500 mt-1 flex-shrink-0" />
                <div className="flex-1">
                  <label className="text-sm font-medium text-gray-700">{t('common.createdDate')}</label>
                  <p className="text-sm text-gray-900 bg-blue-50 p-2 rounded border font-mono">
                    {formatDate(expression.createdDate)}
                  </p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <Calendar className="h-4 w-4 text-orange-500 mt-1 flex-shrink-0" />
                <div className="flex-1">
                  <label className="text-sm font-medium text-gray-700">{t('common.lastUpdated')}</label>
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
            {t('common.close')}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
