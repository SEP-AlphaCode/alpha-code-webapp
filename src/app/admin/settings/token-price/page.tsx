"use client"

import { useState, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { DollarSign, Save, Loader2 } from "lucide-react"
import { toast } from "sonner"
import { TokenPricingConfig } from "@/types/pricing"
import { tokenPricingApi } from "@/services/pricing-api"
import { LoadingGif } from '@/components/ui/loading-gif'

export default function TokenPricingPage() {
  const [config, setConfig] = useState<TokenPricingConfig | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [formData, setFormData] = useState({
    value: '',
    note: ''
  })

  // Load config from DB
  useEffect(() => {
    loadConfig()
  }, [])

  const loadConfig = async () => {
    try {
      setLoading(true)
      const data = await tokenPricingApi.get()
      setConfig(data)
      setFormData({
        value: data.value.toString(),
        note: data.note || ''
      })
    } catch (error) {
      // If no config exists, create default
      setFormData({
        value: '10',
        note: ''
      })
      toast.error('Chưa có cấu hình giá token, vui lòng thiết lập')
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!formData.value) {
      toast.error('Vui lòng nhập giá token')
      return
    }

    const value = parseInt(formData.value)
    if (isNaN(value) || value <= 0) {
      toast.error('Giá token phải là số nguyên dương')
      return
    }

    try {
      setSaving(true)
      const updatedConfig = await tokenPricingApi.update({
        value: value,
        note: formData.note
      })
      
      setConfig(updatedConfig)
      toast.success('Cập nhật giá token thành công')
    } catch (error) {
      toast.error('Có lỗi xảy ra khi cập nhật giá token')
    } finally {
      setSaving(false)
    }
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(amount)
  }

  if (loading) {
    return (
        <div className="flex items-center justify-center min-h-screen">
            <LoadingGif size="lg" />
        </div>
    )
  }

  return (
    <div className="space-y-6 p-5">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Cấu hình giá Token</h1>
        <p className="text-muted-foreground">
          Thiết lập giá trị mỗi token trong hệ thống
        </p>
      </div>

      {/* Current Value Display */}
      {config && (
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <div>
              <CardTitle className="text-sm font-medium">Giá token hiện tại</CardTitle>
              <CardDescription>Giá trị được sử dụng trong toàn hệ thống</CardDescription>
            </div>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(config.value)}</div>
            {config.note && (
              <p className="text-sm text-muted-foreground mt-2">{config.note}</p>
            )}
            <p className="text-xs text-muted-foreground mt-2">
              Cập nhật lần cuối: {new Date(config.updatedAt).toLocaleString('vi-VN')}
            </p>
          </CardContent>
        </Card>
      )}

      {/* Configuration Form */}
      <Card>
        <CardHeader>
          <CardTitle>Cập nhật cấu hình</CardTitle>
          <CardDescription>
            Thay đổi giá token và ghi chú
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid gap-2">
              <Label htmlFor="value">Giá token (VND) *</Label>
              <Input
                id="value"
                type="number"
                min="1"
                value={formData.value}
                onChange={(e) => setFormData(prev => ({...prev, value: e.target.value}))}
                placeholder="VD: 10000"
                required
                disabled={saving}
              />
              <p className="text-sm text-muted-foreground">
                Giá trị này sẽ được áp dụng cho tất cả token trong hệ thống
              </p>
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="note">Ghi chú</Label>
              <Textarea
                id="note"
                value={formData.note}
                onChange={(e) => setFormData(prev => ({...prev, note: e.target.value}))}
                placeholder="Thêm ghi chú về cấu hình giá token..."
                rows={3}
                disabled={saving}
              />
            </div>
            
            <div className="flex justify-end">
              <Button type="submit" disabled={saving}>
                {saving ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Đang lưu...
                  </>
                ) : (
                  <>
                    <Save className="mr-2 h-4 w-4" />
                    Lưu cấu hình
                  </>
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      {/* Information Cards */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Cách tính giá</CardTitle>
          </CardHeader>
          <CardContent className="text-sm">
            <ul className="space-y-2">
              <li>• 1 Token = {formData.value ? formatCurrency(parseInt(formData.value) || 0) : '0 VND'}</li>
              <li>• Giá này áp dụng cho tất cả hoạt động sử dụng token</li>
              <li>• Thay đổi sẽ có hiệu lực ngay lập tức</li>
            </ul>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Lưu ý quan trọng</CardTitle>
          </CardHeader>
          <CardContent className="text-sm">
            <ul className="space-y-2">
              <li>• Kiểm tra kỹ trước khi thay đổi giá</li>
              <li>• Thông báo cho người dùng trước khi điều chỉnh</li>
              <li>• Lưu trữ lịch sử thay đổi để theo dõi</li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}