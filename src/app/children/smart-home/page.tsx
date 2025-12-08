"use client"

import React, { useEffect, useState } from 'react'
import { useEsp32 } from '@/features/esp32/hooks'
import { getUserIdFromToken } from '@/utils/tokenUtils'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { Button } from '@/components/ui/button'
import { 
  HomeIcon, 
  Wifi, 
  Lightbulb, 
  ThermometerSun, 
  Fan, 
  Power, 
  Settings,
  RefreshCw, 
  AlertCircle 
} from 'lucide-react'

interface Esp32Device {
  name: string
  type: string
  id?: string
}

export default function ChildrenSmartHomePage() {
  const { useGetAllEsp32s } = useEsp32()
  const [accountId, setAccountId] = useState<string>('')

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const token = sessionStorage.getItem('accessToken')
      if (token) {
        const id = getUserIdFromToken(token)
        if (id) setAccountId(id)
      }
    }
  }, [])

  const { useGetEsp32ByAccountId } = useEsp32()
  const { data: esp, isLoading, isError, error, refetch } = useGetEsp32ByAccountId(accountId)

  // Extract devices from ESP32 metadata
  const devices = React.useMemo((): Esp32Device[] => {
    if (!esp || !esp.metadata) return []
    try {
      if (typeof esp.metadata === 'string') {
        const parsed = JSON.parse(esp.metadata)
        return Array.isArray(parsed?.devices) ? (parsed.devices as Esp32Device[]) : []
      }
      // if metadata is already an object with devices
      const metaObj = esp.metadata as unknown as { devices?: unknown }
      return Array.isArray(metaObj?.devices) ? (metaObj.devices as Esp32Device[]) : []
    } catch (e) {
      return []
    }
  }, [esp])

  // Device type icons
  const getDeviceIcon = (type: string) => {
    const typeUpper = type.toUpperCase()
    if (typeUpper.includes('LED') || typeUpper.includes('LIGHT')) return Lightbulb
    if (typeUpper.includes('FAN')) return Fan
    if (typeUpper.includes('TEMP') || typeUpper.includes('SENSOR')) return ThermometerSun
    return Power
  }

  return (
    <div className="container max-w-7xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="p-3 bg-primary/10 rounded-lg">
          <HomeIcon className="h-6 w-6 text-primary" />
        </div>
        <div>
          <h1 className="text-3xl font-bold">Smart Home</h1>
          <p className="text-sm text-muted-foreground">Các thiết bị Smart Home của bạn</p>
        </div>
      </div>

      {/* Content */}
      {isLoading ? (
        <Card>
          <CardContent className="p-12 flex flex-col items-center justify-center">
            <RefreshCw className="h-8 w-8 animate-spin text-muted-foreground mb-3" />
            <p className="text-sm text-muted-foreground">Đang tải thiết bị...</p>
          </CardContent>
        </Card>
      ) : isError ? (
        <Card>
          <CardContent className="p-12 flex flex-col items-center justify-center">
            <AlertCircle className="h-12 w-12 text-destructive mb-4" />
            <p className="text-lg font-semibold mb-2">Không thể tải thiết bị</p>
            <p className="text-sm text-muted-foreground mb-4">
              {(() => {
                const e = error as unknown
                if (e && typeof e === 'object' && 'message' in e) return String((e as { message?: unknown }).message)
                return 'Đã xảy ra lỗi không xác định'
              })()}
            </p>
            <Button onClick={() => refetch()} variant="outline">
              <RefreshCw className="h-4 w-4 mr-2" />
              Thử lại
            </Button>
          </CardContent>
        </Card>
      ) : !esp ? (
        <Card>
          <CardContent className="p-12 flex flex-col items-center justify-center text-center">
            <Wifi className="h-12 w-12 text-muted-foreground mb-4 opacity-50" />
            <p className="text-lg font-semibold mb-2">Chưa có thiết bị</p>
            <p className="text-sm text-muted-foreground">
              Chưa có thiết bị Smart Home nào được thiết lập
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-6">
          {/* ESP32 Info Card */}
          <Card>
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="p-2 bg-primary/10 rounded-lg">
                  <Wifi className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <CardTitle>{esp.name}</CardTitle>
                  <CardDescription className="flex items-center gap-2 mt-1">
                    <span>MAC: {esp.macAddress}</span>
                    <Separator orientation="vertical" className="h-4" />
                    <Badge variant="outline">v{esp.firmwareVersion}</Badge>
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-2 text-sm">
              <div className="flex items-center gap-2">
                <span className="text-muted-foreground min-w-[80px]">Topic Pub:</span>
                <code className="px-2 py-1 bg-muted rounded text-xs">{esp.topicPub}</code>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-muted-foreground min-w-[80px]">Topic Sub:</span>
                <code className="px-2 py-1 bg-muted rounded text-xs">{esp.topicSub}</code>
              </div>
            </CardContent>
          </Card>

          {/* Devices Card */}
          <Card>
            <CardHeader>
              <CardTitle>Thiết bị thông minh</CardTitle>
              <CardDescription>
                {devices.length === 0 ? 'Chưa có thiết bị nào' : `${devices.length} thiết bị đã kết nối`}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {devices.length === 0 ? (
                <div className="text-center py-12 text-muted-foreground">
                  <Settings className="h-12 w-12 mx-auto mb-3 opacity-50" />
                  <p>Chưa có thiết bị nào được thêm</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {devices.map((device: Esp32Device) => {
                    const DeviceIcon = getDeviceIcon(device.type)
                    return (
                      <Card key={device.name} className="overflow-hidden">
                        <CardContent className="p-4">
                          <div className="flex items-start gap-3">
                            <div className="p-2 bg-primary/10 rounded-lg">
                              <DeviceIcon className="h-5 w-5 text-primary" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <h3 className="font-semibold text-sm truncate">{device.name}</h3>
                              <Badge variant="secondary" className="text-xs mt-1">{device.type}</Badge>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    )
                  })}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}
