"use client"

import React, { useState } from 'react'
import { QrCode, Plus, Search, Trash2, Download, Filter, Grid, List, Eye, EyeOff } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Label } from '@/components/ui/label'
import { useQRCode } from '@/features/activities/hooks/use-qr-code'
import { QRCode, QRCodeRequest } from '@/types/qrcode'
import Image from 'next/image'
import LoadingState from '@/components/loading-state'
import ErrorState from '@/components/error-state'

interface CreateQRCodeModalProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (data: QRCodeRequest) => void
  isLoading: boolean
}

function CreateQRCodeModal({ isOpen, onClose, onSubmit, isLoading }: CreateQRCodeModalProps) {
  const [formData, setFormData] = useState<QRCodeRequest>({
    name: '',
    qrCode: '',
    status: 1, // 1 for enabled
    activityId: '',
    accountId: '',
    color: 'yellow'
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.name || !formData.qrCode || !formData.activityId || !formData.accountId || !formData.color) {
      alert('Please fill in all required fields')
      return
    }
    onSubmit(formData)
  }

  const handleClose = () => {
    setFormData({
      name: '',
      qrCode: '',
      status: 1,
      activityId: '',
      accountId: '',
      color: 'yellow'
    })
    onClose()
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Create New QR Code Card</DialogTitle>
          <DialogDescription>
            Add a new QR code card to the system. Make sure all required fields are filled.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Card Name *</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="Enter QR code card name"
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="qrCode">QR Code Content *</Label>
            <Input
              id="qrCode"
              value={formData.qrCode}
              onChange={(e) => setFormData({ ...formData, qrCode: e.target.value })}
              placeholder="Enter QR code content/URL"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="activityId">Activity ID *</Label>
            <Input
              id="activityId"
              value={formData.activityId}
              onChange={(e) => setFormData({ ...formData, activityId: e.target.value })}
              placeholder="Enter activity ID"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="accountId">Account ID *</Label>
            <Input
              id="accountId"
              value={formData.accountId}
              onChange={(e) => setFormData({ ...formData, accountId: e.target.value })}
              placeholder="Enter account ID"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="color">Card Color</Label>
            <Select
              value={formData.color}
              onValueChange={(value: string) => 
                setFormData({ ...formData, color: value })
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Select card color" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="red">🔴 Red</SelectItem>
                <SelectItem value="blue">🔵 Blue</SelectItem>
                <SelectItem value="green">🟢 Green</SelectItem>
                <SelectItem value="yellow">🟡 Yellow</SelectItem>
                <SelectItem value="purple">🟣 Purple</SelectItem>
                <SelectItem value="pink">🩷 Pink</SelectItem>
                <SelectItem value="orange">🟠 Orange</SelectItem>
                <SelectItem value="teal">🟢 Teal</SelectItem>
                <SelectItem value="cyan">🔵 Cyan</SelectItem>
                <SelectItem value="gray">⚫ Gray</SelectItem>
                <SelectItem value="black">⚫ Black</SelectItem>
                <SelectItem value="white">⚪ White</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="status">Status</Label>
            <Select
              value={formData.status.toString()}
              onValueChange={(value: string) => 
                setFormData({ ...formData, status: parseInt(value) })
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1">Enabled</SelectItem>
                <SelectItem value="0">Disabled</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={handleClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? 'Creating...' : 'Create QR Code Card'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

export default function QRCodesPage() {
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [hoveredCardId, setHoveredCardId] = useState<string | null>(null)

  const qrCodeHooks = useQRCode()
  // Keep full query object to enable retry (refetch)
  const qrCodesQuery = qrCodeHooks.useGetAllQRCodes()
  const { data: qrCodesResponse, isLoading, error, refetch, isFetching } = qrCodesQuery
  const createQRCodeMutation = qrCodeHooks.useCreateQRCode()
  const deleteQRCodeMutation = qrCodeHooks.useDeleteQRCode()
  const updateStatusMutation = qrCodeHooks.useUpdateQRCodeStatus()

  // Extract QR codes from PagedResult
  const qrCodes = qrCodesResponse?.data || []

  const getStatusBadge = (status: number) => {
    switch (status) {
      case 1:
        return <Badge variant="default" className="bg-green-100 text-green-800">Enabled</Badge>
      case 0:
        return <Badge variant="destructive" className="bg-red-100 text-red-800">Disabled</Badge>
      default:
        return <Badge variant="secondary">Unknown</Badge>
    }
  }

  const getStatusText = (status: number) => {
    switch (status) {
      case 0: return 'disabled'
      case 1: return 'enabled'
      default: return 'disabled'
    }
  }

  const getColorClass = (color: string) => {
    switch (color?.toLowerCase()) {
      case 'red':
        return 'bg-red-500 border-red-600'
      case 'blue':
        return 'bg-blue-500 border-blue-600'
      case 'green':
        return 'bg-green-500 border-green-600'
      case 'yellow':
        return 'bg-yellow-400 border-yellow-500'
      case 'purple':
        return 'bg-purple-500 border-purple-600'
      case 'pink':
        return 'bg-pink-500 border-pink-600'
      case 'orange':
        return 'bg-orange-500 border-orange-600'
      case 'teal':
        return 'bg-teal-500 border-teal-600'
      case 'cyan':
        return 'bg-cyan-500 border-cyan-600'
      case 'gray':
      case 'grey':
        return 'bg-gray-500 border-gray-600'
      case 'black':
        return 'bg-gray-800 border-gray-900'
      case 'white':
        return 'bg-white border-gray-300'
      default:
        return 'bg-white border-black' // Default fallback
    }
  }

  const filteredQRCodes = qrCodes?.filter(qrCode => {
    const matchesSearch = qrCode.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         qrCode.qrCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         qrCode.activityId.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesStatus = statusFilter === 'all' || getStatusText(qrCode.status) === statusFilter
    
    return matchesSearch && matchesStatus
  }) || []

  const handleCreateQRCode = async (data: QRCodeRequest) => {
    try {
      await createQRCodeMutation.mutateAsync(data)
      alert('QR Code card created successfully!')
      setIsCreateModalOpen(false)
    } catch {
      alert('Failed to create QR code card. Please try again.')
    }
  }

  const handleDeleteQRCode = async (id: string, name: string) => {
    if (window.confirm(`Are you sure you want to delete QR code card "${name}"?`)) {
      try {
        await deleteQRCodeMutation.mutateAsync(id)
        alert('QR Code card deleted successfully!')
      } catch {
        alert('Failed to delete QR code card. Please try again.')
      }
    }
  }

  const handleStatusChange = async (id: string, newStatus: string) => {
    try {
      await updateStatusMutation.mutateAsync({ id, status: newStatus })
      alert('QR Code card status updated successfully!')
    } catch {
      alert('Failed to update QR code card status. Please try again.')
    }
  }

  const handleDownloadQR = (qrCode: QRCode) => {
    if (qrCode.imageUrl) {
      const link = document.createElement('a')
      link.href = qrCode.imageUrl
      link.download = `qr-card-${qrCode.name}.png`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
    } else {
      alert('QR code image not available for download')
    }
  }

  // Loading and error states
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <LoadingState />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <ErrorState
          error={error}
          onRetry={() => refetch()}
          className={isFetching ? 'opacity-70 pointer-events-none' : ''}
        />
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
            <QrCode className="h-8 w-8 text-blue-600" />
            QR Code Card Management
          </h1>
          <p className="text-muted-foreground mt-2">
            Manage and monitor QR code cards for activities and learning materials
          </p>
        </div>
        <Button onClick={() => setIsCreateModalOpen(true)} className="bg-blue-600 hover:bg-blue-700 text-white">
          <Plus className="h-4 w-4 mr-2 stroke-white stroke-3" />
          Create QR Code Card
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="border-l-4 border-l-blue-500">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Cards</CardTitle>
            <QrCode className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{qrCodes?.length || 0}</div>
            <p className="text-xs text-muted-foreground">
              QR code cards in system
            </p>
          </CardContent>
        </Card>
        
        <Card className="border-l-4 border-l-green-500">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Enabled Cards</CardTitle>
            <div className="h-4 w-4 bg-green-500 rounded-full"></div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {qrCodes?.filter(qr => qr.status === 1).length || 0}
            </div>
            <p className="text-xs text-muted-foreground">
              Ready for use
            </p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-red-500">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Disabled Cards</CardTitle>
            <div className="h-4 w-4 bg-red-500 rounded-full"></div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {qrCodes?.filter(qr => qr.status === 0).length || 0}
            </div>
            <p className="text-xs text-muted-foreground">
              Not active
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Filters & Search
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Search QR code cards by name, content, or activity..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="flex gap-2">
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-[200px]">
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="enabled">Enabled Cards</SelectItem>
                  <SelectItem value="disabled">Disabled Cards</SelectItem>
                </SelectContent>
              </Select>
              <div className="flex border rounded-md">
                <Button
                  variant={viewMode === 'grid' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setViewMode('grid')}
                  className="rounded-r-none"
                >
                  <Grid className="h-4 w-4" />
                </Button>
                <Button
                  variant={viewMode === 'list' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setViewMode('list')}
                  className="rounded-l-none"
                >
                  <List className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* QR Codes Display */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg">
              QR Code Cards ({filteredQRCodes.length} {filteredQRCodes.length === 1 ? 'card' : 'cards'})
            </CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          {filteredQRCodes.length === 0 ? (
            <div className="text-center py-12">
              {/* Preview của QR Card Design */}
              <div className="mb-8 max-w-xs mx-auto">
                <div className="bg-white border-4 border-gray-300 border-dashed rounded-lg p-8 aspect-[3/4] flex flex-col items-center justify-center">
                  <div className="text-center w-full mb-2 mt-6">
                    <h3 className="text-xl font-bold text-gray-400 mb-1 leading-tight">
                      QR Code Name
                    </h3>
                    <p className="text-lg font-medium text-gray-400 leading-tight">
                      Activity Name
                    </p>
                  </div>
                  <div className="flex-1 flex items-center justify-center w-full">
                    <QrCode className="h-24 w-24 text-gray-300" />
                  </div>
                </div>
              </div>
              
              <h3 className="mt-4 text-lg font-semibold text-gray-900">No QR code cards found</h3>
              <p className="mt-2 text-sm text-gray-500 max-w-sm mx-auto">
                {searchTerm || statusFilter !== 'all' 
                  ? 'Try adjusting your search or filter criteria to find the QR code cards you\'re looking for.'
                  : 'Get started by creating your first QR code card for educational activities.'
                }
              </p>
              {!searchTerm && statusFilter === 'all' && (
                <Button 
                  onClick={() => setIsCreateModalOpen(true)} 
                  className="mt-4 bg-blue-600 hover:bg-blue-700"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Create Your First QR Code Card
                </Button>
              )}
            </div>
          ) : viewMode === 'grid' ? (
            // Grid View - Simple QR Card Layout (như hình mẫu)
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredQRCodes.map((qrCode) => {
                const isHovered = hoveredCardId === qrCode.id;
                
                return (
                  <div 
                    key={qrCode.id} 
                    className={`relative group transition-all duration-300 ${isHovered ? 'scale-105' : ''}`}
                    onMouseEnter={() => setHoveredCardId(qrCode.id)}
                    onMouseLeave={() => setHoveredCardId(null)}
                  >
                    {/* QR Code Card - Simple Design với màu background theo color */}
                    <div className={`relative border-4 rounded-2xl p-8 aspect-[3/4] flex flex-col items-center justify-center shadow-lg hover:shadow-2xl transition-all duration-300 ${getColorClass(qrCode.color)}`}>
                      
                      {/* Status Badge - Top Right */}
                      <div className="absolute top-4 right-4">
                        {getStatusBadge(qrCode.status)}
                      </div>

                      {/* QR Code Name - Căn giữa */}
                      <div className="text-center w-full mb-2 mt-6">
                        <h3 className={`text-xl font-bold mb-1 leading-tight ${qrCode.color?.toLowerCase() === 'white' || qrCode.color?.toLowerCase() === 'yellow' ? 'text-black' : 'text-white'}`}>
                          {qrCode.name}
                        </h3>
                        <p className={`text-lg font-medium leading-tight opacity-80 ${qrCode.color?.toLowerCase() === 'white' || qrCode.color?.toLowerCase() === 'yellow' ? 'text-black' : 'text-white'}`}>
                          {qrCode.activityName || qrCode.activityId}
                        </p>
                      </div>

                      {/* QR Code - To hơn và căn giữa */}
                      <div className="flex-1 flex items-center justify-center w-full">
                        {qrCode.imageUrl ? (
                          <div className="bg-white/20 p-3 rounded-xl backdrop-blur-sm">
                            <div className="bg-white p-2 rounded-lg">
                              <Image 
                                src={qrCode.imageUrl} 
                                alt={`QR Code for ${qrCode.name}`}
                                width={120}
                                height={120}
                                className="max-w-[120px] max-h-[120px] object-contain"
                              />
                            </div>
                          </div>
                        ) : (
                          <div className="w-[140px] h-[140px] bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm">
                            <QrCode className="h-20 w-20 text-white" />
                          </div>
                        )}
                      </div>

                      {/* Card Footer Info */}
                      <div className="absolute bottom-4 left-6 right-6">
                        <div className="flex items-center justify-between text-xs opacity-75">
                          {/* Color */}
                          <div className="flex items-center space-x-1">
                            <div 
                              className="w-3 h-3 rounded-full border border-white/50"
                              style={{ backgroundColor: qrCode.color?.toLowerCase() || '#6b7280' }}
                            />
                            <span className={`capitalize ${qrCode.color?.toLowerCase() === 'white' || qrCode.color?.toLowerCase() === 'yellow' ? 'text-black' : 'text-white'}`}>
                              {qrCode.color || 'N/A'}
                            </span>
                          </div>
                          
                          {/* QR Code */}
                          <div className={`text-right ${qrCode.color?.toLowerCase() === 'white' || qrCode.color?.toLowerCase() === 'yellow' ? 'text-black' : 'text-white'}`}>
                            <p className="truncate max-w-24 font-mono">{qrCode.qrCode}</p>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Quick Action Buttons (visible on hover) */}
                    <div className={`absolute inset-x-4 -bottom-4 flex space-x-2 transition-all duration-300 ${isHovered ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'}`}>
                      {qrCode.imageUrl && (
                        <Button
                          size="sm"
                          variant="secondary"
                          className="flex-1 bg-white hover:bg-gray-50 text-gray-700 shadow-lg"
                          onClick={() => handleDownloadQR(qrCode)}
                          title="Download QR code image"
                        >
                          <Download className="h-4 w-4 mr-1" />
                          Download
                        </Button>
                      )}
                      
                      <Button
                        size="sm"
                        variant="secondary"
                        className="flex-1 bg-white hover:bg-gray-50 text-gray-700 shadow-lg"
                        onClick={() => {
                          const newStatus = qrCode.status === 1 ? 'disabled' : 'enabled';
                          handleStatusChange(qrCode.id, newStatus);
                        }}
                      >
                        {qrCode.status === 1 ? (
                          <>
                            <EyeOff className="h-4 w-4 mr-1" />
                            Disable
                          </>
                        ) : (
                          <>
                            <Eye className="h-4 w-4 mr-1" />
                            Enable
                          </>
                        )}
                      </Button>
                      
                      <Button
                        size="sm"
                        variant="destructive"
                        className="bg-red-500 hover:bg-red-600 text-white shadow-lg"
                        onClick={() => handleDeleteQRCode(qrCode.id, qrCode.name)}
                        disabled={deleteQRCodeMutation.isPending}
                        title="Delete QR code card"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            // List View - Compact Layout
            <div className="space-y-3">
              {filteredQRCodes.map((qrCode) => (
                <Card key={qrCode.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-4">
                    <div className="flex items-center gap-4">
                      {/* QR Code Thumbnail */}
                      <div className={`w-16 h-16 border border-gray-300 rounded-lg p-2 flex items-center justify-center flex-shrink-0 ${getColorClass(qrCode.color)}`}>
                        {qrCode.imageUrl ? (
                          <div className="bg-white rounded-sm p-1">
                            <Image 
                              src={qrCode.imageUrl} 
                              alt={`QR Code for ${qrCode.name}`}
                              width={48}
                              height={48}
                              className="max-w-full max-h-full object-contain"
                            />
                          </div>
                        ) : (
                          <QrCode className="h-8 w-8 text-white" />
                        )}
                      </div>

                      {/* Card Info */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-medium text-gray-900 truncate">{qrCode.name}</h3>
                          {getStatusBadge(qrCode.status)}
                        </div>
                        <p className="text-sm text-gray-600 font-mono truncate" title={qrCode.qrCode}>
                          {qrCode.qrCode}
                        </p>
                        <p className="text-xs text-gray-500 truncate">
                          Activity: {qrCode.activityId}
                        </p>
                        <p className="text-xs text-gray-500">
                          Created: {new Date(qrCode.createdDate).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric'
                          })}
                        </p>
                      </div>

                      {/* Actions */}
                      <div className="flex items-center gap-2 flex-shrink-0">
                        {qrCode.imageUrl && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleDownloadQR(qrCode)}
                            title="Download QR code image"
                          >
                            <Download className="h-4 w-4" />
                          </Button>
                        )}
                        <Select
                          value={getStatusText(qrCode.status)}
                          onValueChange={(value: string) => handleStatusChange(qrCode.id, value)}
                        >
                          <SelectTrigger className="w-24">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="enabled">Enabled</SelectItem>
                            <SelectItem value="disabled">Disabled</SelectItem>
                          </SelectContent>
                        </Select>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDeleteQRCode(qrCode.id, qrCode.name)}
                          disabled={deleteQRCodeMutation.isPending}
                          className="text-red-600 hover:text-red-700 hover:bg-red-50"
                          title="Delete QR code card"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Create QR Code Modal */}
      <CreateQRCodeModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSubmit={handleCreateQRCode}
        isLoading={createQRCodeMutation.isPending}
      />
    </div>
  )
}
