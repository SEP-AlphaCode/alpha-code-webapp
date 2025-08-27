"use client"

import React, { useState } from 'react'
import { QrCode, Plus, Search, Edit, Trash2, Eye, Download, Filter, Grid, List } from 'lucide-react'
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
  DialogTrigger,
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
import { useQRCode } from '@/hooks/use-qr-code'
import { QRCodeRequest } from '@/types/qrcode'
import Image from 'next/image'

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
    status: 'pending',
    activityId: ''
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.name || !formData.qrCode || !formData.activityId) {
      alert('Please fill in all required fields')
      return
    }
    onSubmit(formData)
  }

  const handleClose = () => {
    setFormData({
      name: '',
      qrCode: '',
      status: 'pending',
      activityId: ''
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
            <Label htmlFor="status">Status</Label>
            <Select
              value={formData.status}
              onValueChange={(value: 'active' | 'inactive' | 'pending') => 
                setFormData({ ...formData, status: value })
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="inactive">Inactive</SelectItem>
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

  const qrCodeHooks = useQRCode()
  const { data: qrCodes, isLoading, error } = qrCodeHooks.useGetAllQRCodes()
  const createQRCodeMutation = qrCodeHooks.useCreateQRCode()
  const deleteQRCodeMutation = qrCodeHooks.useDeleteQRCode()
  const updateStatusMutation = qrCodeHooks.useUpdateQRCodeStatus()

  const getStatusBadge = (status: number) => {
    switch (status) {
      case 0:
        return <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">Pending</Badge>
      case 1:
        return <Badge variant="default" className="bg-green-100 text-green-800">Active</Badge>
      case 2:
        return <Badge variant="destructive" className="bg-red-100 text-red-800">Inactive</Badge>
      default:
        return <Badge variant="secondary">Unknown</Badge>
    }
  }

  const getStatusText = (status: number) => {
    switch (status) {
      case 0: return 'pending'
      case 1: return 'active'
      case 2: return 'inactive'
      default: return 'pending'
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
    } catch (error) {
      alert('Failed to create QR code card. Please try again.')
    }
  }

  const handleDeleteQRCode = async (id: string, name: string) => {
    if (window.confirm(`Are you sure you want to delete QR code card "${name}"?`)) {
      try {
        await deleteQRCodeMutation.mutateAsync(id)
        alert('QR Code card deleted successfully!')
      } catch (error) {
        alert('Failed to delete QR code card. Please try again.')
      }
    }
  }

  const handleStatusChange = async (id: string, newStatus: string) => {
    try {
      await updateStatusMutation.mutateAsync({ id, status: newStatus })
      alert('QR Code card status updated successfully!')
    } catch (error) {
      alert('Failed to update QR code card status. Please try again.')
    }
  }

  const handleDownloadQR = (qrCode: any) => {
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

  if (isLoading) {
    return (
      <div className="container mx-auto p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 rounded w-1/4"></div>
          <div className="h-32 bg-gray-200 rounded"></div>
          <div className="h-64 bg-gray-200 rounded"></div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="container mx-auto p-6">
        <div className="text-center py-8">
          <QrCode className="mx-auto h-12 w-12 text-red-400" />
          <h3 className="mt-2 text-sm font-semibold text-gray-900">Error loading QR codes</h3>
          <p className="mt-1 text-sm text-gray-500">
            There was an error loading the QR code cards. Please try again later.
          </p>
        </div>
      </div>
    )
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
        <Button onClick={() => setIsCreateModalOpen(true)} className="bg-blue-600 hover:bg-blue-700">
          <Plus className="h-4 w-4 mr-2" />
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
            <CardTitle className="text-sm font-medium">Active Cards</CardTitle>
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

        <Card className="border-l-4 border-l-yellow-500">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Cards</CardTitle>
            <div className="h-4 w-4 bg-yellow-500 rounded-full"></div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {qrCodes?.filter(qr => qr.status === 0).length || 0}
            </div>
            <p className="text-xs text-muted-foreground">
              Awaiting approval
            </p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-red-500">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Inactive Cards</CardTitle>
            <div className="h-4 w-4 bg-red-500 rounded-full"></div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {qrCodes?.filter(qr => qr.status === 2).length || 0}
            </div>
            <p className="text-xs text-muted-foreground">
              Disabled or archived
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
                  <SelectItem value="active">Active Cards</SelectItem>
                  <SelectItem value="pending">Pending Cards</SelectItem>
                  <SelectItem value="inactive">Inactive Cards</SelectItem>
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
              {filteredQRCodes.map((qrCode) => (
                <div key={qrCode.id} className="group relative">
                  {/* QR Code Card - Simple Design như hình mẫu */}
                  <div className="bg-white border-4 border-black rounded-lg p-8 aspect-[3/4] flex flex-col items-center justify-center hover:shadow-lg transition-shadow">
                    {/* QR Code Name - Căn giữa */}
                    <div className="text-center w-full mb-2 mt-6">
                      <h3 className="text-xl font-bold text-black mb-1 leading-tight">
                        {qrCode.name}
                      </h3>
                      <p className="text-lg font-medium text-black leading-tight">
                        {qrCode.activityName || qrCode.activityId}
                      </p>
                    </div>

                    {/* QR Code - To hơn và căn giữa */}
                    <div className="flex-1 flex items-center justify-center w-full">
                      {qrCode.imageUrl ? (
                        <Image 
                          src={qrCode.imageUrl} 
                          alt={`QR Code for ${qrCode.name}`}
                          width={160}
                          height={160}
                          className="max-w-[160px] max-h-[160px] object-contain"
                        />
                      ) : (
                        <div className="w-[160px] h-[160px] border-2 border-gray-300 flex items-center justify-center">
                          <QrCode className="h-24 w-24 text-gray-400" />
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Actions Overlay - Chỉ hiện khi hover */}
                  <div className="absolute inset-0 bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity duration-200 rounded-lg flex items-center justify-center">
                    <div className="flex items-center gap-2">
                      {/* Status Badge */}
                      <div className="absolute top-2 right-2">
                        {getStatusBadge(qrCode.status)}
                      </div>

                      {/* Action Buttons */}
                      <div className="flex flex-col gap-2">
                        {qrCode.imageUrl && (
                          <Button
                            variant="secondary"
                            size="sm"
                            onClick={() => handleDownloadQR(qrCode)}
                            title="Download QR code image"
                            className="bg-white text-black hover:bg-gray-100"
                          >
                            <Download className="h-4 w-4 mr-1" />
                            Download
                          </Button>
                        )}
                        
                        <Select
                          value={getStatusText(qrCode.status)}
                          onValueChange={(value: string) => handleStatusChange(qrCode.id, value)}
                        >
                          <SelectTrigger className="bg-white text-black">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="active">Active</SelectItem>
                            <SelectItem value="pending">Pending</SelectItem>
                            <SelectItem value="inactive">Inactive</SelectItem>
                          </SelectContent>
                        </Select>
                        
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => handleDeleteQRCode(qrCode.id, qrCode.name)}
                          disabled={deleteQRCodeMutation.isPending}
                          title="Delete QR code card"
                        >
                          <Trash2 className="h-4 w-4 mr-1" />
                          Delete
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            // List View - Compact Layout
            <div className="space-y-3">
              {filteredQRCodes.map((qrCode) => (
                <Card key={qrCode.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-4">
                    <div className="flex items-center gap-4">
                      {/* QR Code Thumbnail */}
                      <div className="w-16 h-16 bg-white border border-gray-300 rounded-lg p-2 flex items-center justify-center flex-shrink-0">
                        {qrCode.imageUrl ? (
                          <Image 
                            src={qrCode.imageUrl} 
                            alt={`QR Code for ${qrCode.name}`}
                            width={48}
                            height={48}
                            className="max-w-full max-h-full object-contain"
                          />
                        ) : (
                          <QrCode className="h-8 w-8 text-gray-400" />
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
                            <SelectItem value="active">Active</SelectItem>
                            <SelectItem value="pending">Pending</SelectItem>
                            <SelectItem value="inactive">Inactive</SelectItem>
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
