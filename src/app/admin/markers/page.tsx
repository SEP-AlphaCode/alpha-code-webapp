"use client"

import React, { useState } from 'react'
import { MapPin, Plus, Search, Edit, Trash2, Eye, Filter, Grid, List } from 'lucide-react'
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
import { useMarker } from '@/hooks/use-marker'
import { MakerRequest } from '@/types/maker'

interface CreateMarkerModalProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (data: MakerRequest) => void
  isLoading: boolean
}

function CreateMarkerModal({ isOpen, onClose, onSubmit, isLoading }: CreateMarkerModalProps) {
  const [formData, setFormData] = useState<MakerRequest>({
    name: '',
    status: 'pending',
    activityId: ''
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.name || !formData.activityId) {
      alert('Please fill in all required fields')
      return
    }
    onSubmit(formData)
  }

  const handleClose = () => {
    setFormData({
      name: '',
      status: 'pending',
      activityId: ''
    })
    onClose()
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Create New Marker</DialogTitle>
          <DialogDescription>
            Add a new marker to the system. Make sure all required fields are filled.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Marker Name *</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="Enter marker name"
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
              {isLoading ? 'Creating...' : 'Create Marker'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

export default function MarkersPage() {
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')

  const markerHooks = useMarker()
  const { data: markersResponse, isLoading, error } = markerHooks.useGetAllMarkers()
  const createMarkerMutation = markerHooks.useCreateMarker()
  const deleteMarkerMutation = markerHooks.useDeleteMarker()
  const updateStatusMutation = markerHooks.useUpdateMarkerStatus()

  // Extract markers from PagedResult
  const markers = markersResponse?.data || []

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

  const filteredMarkers = markers?.filter(marker => {
    const matchesSearch = marker.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         marker.activityId.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         marker.activityName.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesStatus = statusFilter === 'all' || getStatusText(marker.status) === statusFilter
    
    return matchesSearch && matchesStatus
  }) || []

  const handleCreateMarker = async (data: MakerRequest) => {
    try {
      await createMarkerMutation.mutateAsync(data)
      alert('Marker created successfully!')
      setIsCreateModalOpen(false)
    } catch (_error) {
      alert('Failed to create marker. Please try again.')
    }
  }

  const handleDeleteMarker = async (id: string, name: string) => {
    if (window.confirm(`Are you sure you want to delete marker "${name}"?`)) {
      try {
        await deleteMarkerMutation.mutateAsync(id)
        alert('Marker deleted successfully!')
      } catch (_error) {
        alert('Failed to delete marker. Please try again.')
      }
    }
  }

  const handleStatusChange = async (id: string, newStatus: string) => {
    try {
      await updateStatusMutation.mutateAsync({ id, status: newStatus })
      alert('Marker status updated successfully!')
    } catch (_error) {
      alert('Failed to update marker status. Please try again.')
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
          <MapPin className="mx-auto h-12 w-12 text-red-400" />
          <h3 className="mt-2 text-sm font-semibold text-gray-900">Error loading markers</h3>
          <p className="mt-1 text-sm text-gray-500">
            There was an error loading the markers. Please try again later.
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
            <MapPin className="h-8 w-8 text-purple-600" />
            Marker Management
          </h1>
          <p className="text-muted-foreground mt-2">
            Manage and monitor markers for activities and learning materials
          </p>
        </div>
        <Button onClick={() => setIsCreateModalOpen(true)} className="bg-purple-600 hover:bg-purple-700">
          <Plus className="h-4 w-4 mr-2" />
          Create Marker
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="border-l-4 border-l-purple-500">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Markers</CardTitle>
            <MapPin className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{markers?.length || 0}</div>
            <p className="text-xs text-muted-foreground">
              Markers in system
            </p>
          </CardContent>
        </Card>
        
        <Card className="border-l-4 border-l-green-500">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Markers</CardTitle>
            <div className="h-4 w-4 bg-green-500 rounded-full"></div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {markers?.filter(marker => marker.status === 1).length || 0}
            </div>
            <p className="text-xs text-muted-foreground">
              Ready for use
            </p>
          </CardContent>
        </Card>
        
        <Card className="border-l-4 border-l-yellow-500">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Markers</CardTitle>
            <div className="h-4 w-4 bg-yellow-500 rounded-full"></div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {markers?.filter(marker => marker.status === 0).length || 0}
            </div>
            <p className="text-xs text-muted-foreground">
              Awaiting approval
            </p>
          </CardContent>
        </Card>
        
        <Card className="border-l-4 border-l-red-500">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Inactive Markers</CardTitle>
            <div className="h-4 w-4 bg-red-500 rounded-full"></div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {markers?.filter(marker => marker.status === 2).length || 0}
            </div>
            <p className="text-xs text-muted-foreground">
              Disabled markers
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Search and Filter */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Search & Filter</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Search markers by name, activity..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="flex gap-2">
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-[150px]">
                  <Filter className="h-4 w-4 mr-2" />
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                </SelectContent>
              </Select>
              <div className="flex rounded-md border">
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

      {/* Results */}
      {filteredMarkers.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <MapPin className="h-12 w-12 text-gray-400 mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No markers found</h3>
            <p className="text-gray-500 text-center max-w-sm">
              {searchTerm || statusFilter !== 'all' 
                ? "No markers match your search criteria. Try adjusting your filters."
                : "No markers available. Create your first marker to get started."
              }
            </p>
            {!searchTerm && statusFilter === 'all' && (
              <Button 
                onClick={() => setIsCreateModalOpen(true)} 
                className="mt-4 bg-purple-600 hover:bg-purple-700"
              >
                <Plus className="h-4 w-4 mr-2" />
                Create First Marker
              </Button>
            )}
          </CardContent>
        </Card>
      ) : (
        <div className={viewMode === 'grid' 
          ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" 
          : "space-y-4"
        }>
          {filteredMarkers.map((marker) => (
            <Card key={marker.id} className={`hover:shadow-md transition-shadow ${
              viewMode === 'list' ? 'flex-row' : ''
            }`}>
              <CardHeader className={viewMode === 'list' ? 'pb-2' : ''}>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="text-lg flex items-center gap-2">
                      <MapPin className="h-5 w-5 text-purple-600" />
                      {marker.name}
                    </CardTitle>
                    <p className="text-sm text-muted-foreground mt-1">
                      Activity: {marker.activityName}
                    </p>
                  </div>
                  {getStatusBadge(marker.status)}
                </div>
              </CardHeader>
              <CardContent className={viewMode === 'list' ? 'pt-0' : ''}>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Created:</span>
                    <span>{new Date(marker.createdDate).toLocaleDateString()}</span>
                  </div>
                  {marker.lastEdited && (
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Last Edited:</span>
                      <span>{new Date(marker.lastEdited).toLocaleDateString()}</span>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Activity ID:</span>
                    <span className="font-mono text-xs">{marker.activityId}</span>
                  </div>
                </div>
                
                <div className="flex gap-2 mt-4">
                  <Button variant="outline" size="sm" className="flex-1">
                    <Eye className="h-4 w-4 mr-1" />
                    View
                  </Button>
                  <Button variant="outline" size="sm" className="flex-1">
                    <Edit className="h-4 w-4 mr-1" />
                    Edit
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => handleDeleteMarker(marker.id, marker.name)}
                    className="text-red-600 hover:text-red-700 hover:bg-red-50"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
                
                <div className="mt-2">
                  <Select
                    value={getStatusText(marker.status)}
                    onValueChange={(newStatus) => handleStatusChange(marker.id, newStatus)}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="active">Active</SelectItem>
                      <SelectItem value="inactive">Inactive</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Pagination Info */}
      {markersResponse && (
        <Card>
          <CardContent className="py-4">
            <div className="flex items-center justify-between text-sm text-muted-foreground">
              <div>
                Showing {filteredMarkers.length} of {markersResponse.total_count} markers
              </div>
              <div>
                Page {markersResponse.page} of {markersResponse.total_pages}
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      <CreateMarkerModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSubmit={handleCreateMarker}
        isLoading={createMarkerMutation.isPending}
      />
    </div>
  )
}
