"use client"

import React, { useEffect, useState } from 'react'
import { useEsp32 } from '@/features/esp32/hooks'
import { Esp32Device } from '@/types/esp32'
import { getUserIdFromToken } from '@/utils/tokenUtils'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

export default function ParentSmartHomePage() {
  const { useGetEsp32ByAccountId, useCreateEsp32, useUpdateEsp32, useDeleteEsp32, useAddEsp32Device, useRemoveEsp32Device, useUpdateEsp32Device } = useEsp32()
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

  // Each account has a single ESP32 — use the account lookup
  const { data: esp, isLoading, isError, error, refetch } = useGetEsp32ByAccountId(accountId)

  // Local UI state for create/edit
  const [isEditing, setIsEditing] = useState(false)
  const [form, setForm] = useState({ name: '', macAddress: '', firmwareVersion: 1, topicPub: '', topicSub: '' })

  // Device form
  const [deviceForm, setDeviceForm] = useState({ name: '', type: '' })
  const [editingDeviceIndex, setEditingDeviceIndex] = useState<number | null>(null)

  // Mutations
  const createEspMut = useCreateEsp32()
  const updateEspMut = useUpdateEsp32()
  const deleteEspMut = useDeleteEsp32()
  const addDeviceMut = useAddEsp32Device()
  const removeDeviceMut = useRemoveEsp32Device()
  const updateDeviceMut = useUpdateEsp32Device()

  useEffect(() => {
    if (esp) {
      setForm({
        name: esp.name || '',
        macAddress: esp.macAddress || '',
        firmwareVersion: esp.firmwareVersion || 1,
        topicPub: esp.topicPub || '',
        topicSub: esp.topicSub || '',
      })
    }
  }, [esp])

  // Normalize devices from esp.metadata which may be a JSON string or object
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

  const handleChange = (field: keyof typeof form, value: string | number) => setForm(prev => ({ ...prev, [field]: value }))

  const handleDeviceChange = (field: keyof typeof deviceForm, value: string) => setDeviceForm(prev => ({ ...prev, [field]: value }))

  const handleCreate = async () => {
    try {
      const data = { accountId, name: form.name, macAddress: form.macAddress, firmwareVersion: form.firmwareVersion, topicPub: form.topicPub, topicSub: form.topicSub }
      await createEspMut.mutateAsync(data)
      refetch()
    } catch (e) {
      console.error(e)
    }
  }

  const handleUpdate = async () => {
    if (!esp?.id) return
    try {
      await updateEspMut.mutateAsync({ id: esp.id, data: form })
      setIsEditing(false)
      refetch()
    } catch (e) {
      console.error(e)
    }
  }

  const handleDelete = async () => {
    if (!esp?.id) return
    if (!confirm('Xác nhận xóa ESP32 này?')) return
    try {
      await deleteEspMut.mutateAsync(esp.id)
      refetch()
    } catch (e) {
      console.error(e)
    }
  }

  const handleAddDevice = async () => {
    if (!esp?.id) return
    try {
      await addDeviceMut.mutateAsync({ id: esp.id, name: deviceForm.name, type: deviceForm.type })
      setDeviceForm({ name: '', type: '' })
      refetch()
    } catch (e) {
      console.error(e)
    }
  }

  const handleRemoveDevice = async (name: string) => {
    if (!esp?.id) return
    if (!confirm(`Xác nhận xoá thiết bị ${name}?`)) return
    try {
      await removeDeviceMut.mutateAsync({ id: esp.id, name })
      refetch()
    } catch (e) {
      console.error(e)
    }
  }

  const handleEditDevice = (index: number) => {
    if (devices.length === 0) return
    const d = devices[index]
    if (!d) return
    setDeviceForm({ name: d.name, type: d.type })
    setEditingDeviceIndex(index)
  }

  const handleUpdateDevice = async () => {
    if (!esp?.id || editingDeviceIndex === null) return
    const oldName = devices?.[editingDeviceIndex]?.name
    if (!oldName) return
    try {
      await updateDeviceMut.mutateAsync({ id: esp.id, name: oldName, newType: deviceForm.type })
      setEditingDeviceIndex(null)
      setDeviceForm({ name: '', type: '' })
      refetch()
    } catch (e) {
      console.error(e)
    }
  }

  return (
    <div className="p-4">
      <h1 className="text-2xl font-semibold mb-4">Quản lý Smart Home Kit</h1>
      <p className="text-sm text-muted-foreground mb-6">Quản lý các thiết bị ESP32 và Smart Home Kit của bạn.</p>

      <section>
        {isLoading ? (
          <div className="text-sm text-gray-600">Đang tải thiết bị...</div>
        ) : isError ? (
          <div className="text-sm text-red-600">Lỗi khi tải thiết bị: {(() => {
            const e = error as unknown
            if (e && typeof e === 'object' && 'message' in e) return String((e as { message?: unknown }).message)
            return String(e)
          })() || 'Unknown error'}. <button onClick={() => refetch()} className="underline">Thử lại</button></div>
        ) : !esp ? (
          <div className="max-w-md">
            <h3 className="font-medium mb-2">Tạo ESP32 mới</h3>
            <div className="space-y-2">
              <Input placeholder="Name" value={form.name} onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleChange('name', e.target.value)} />
              <Input placeholder="MAC Address" value={form.macAddress} onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleChange('macAddress', e.target.value)} />
              <Input placeholder="Firmware Version" type="number" value={form.firmwareVersion} onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleChange('firmwareVersion', Number(e.target.value))} />
              <Input placeholder="Topic Pub" value={form.topicPub} onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleChange('topicPub', e.target.value)} />
              <Input placeholder="Topic Sub" value={form.topicSub} onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleChange('topicSub', e.target.value)} />
                <div className="flex gap-2">
                <Button onClick={handleCreate} disabled={createEspMut.isPending}>Tạo</Button>
                <Button variant="ghost" onClick={() => { setForm({ name: '', macAddress: '', firmwareVersion: 1, topicPub: '', topicSub: '' }) }}>Đặt lại</Button>
              </div>
            </div>
          </div>
        ) : (
          <div className="max-w-3xl grid grid-cols-1 gap-6">
            <div className="p-4 border rounded-lg shadow-sm">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-medium">{esp.name}</h3>
                  <p className="text-xs text-gray-500">MAC: {esp.macAddress}</p>
                </div>
                <div className="flex gap-2">
                  <Button onClick={() => setIsEditing(v => !v)}>{isEditing ? 'Huỷ' : 'Chỉnh sửa'}</Button>
                  <Button variant="destructive" onClick={handleDelete} disabled={deleteEspMut.isPending}>Xóa</Button>
                </div>
              </div>

              {isEditing && (
                <div className="mt-4 space-y-2">
                  <Input placeholder="Name" value={form.name} onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleChange('name', e.target.value)} />
                  <Input placeholder="MAC Address" value={form.macAddress} onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleChange('macAddress', e.target.value)} />
                  <Input placeholder="Firmware Version" type="number" value={form.firmwareVersion} onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleChange('firmwareVersion', Number(e.target.value))} />
                  <Input placeholder="Topic Pub" value={form.topicPub} onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleChange('topicPub', e.target.value)} />
                  <Input placeholder="Topic Sub" value={form.topicSub} onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleChange('topicSub', e.target.value)} />
                    <div className="flex gap-2 mt-2">
                    <Button onClick={handleUpdate} disabled={updateEspMut.isPending}>Lưu</Button>
                    <Button variant="ghost" onClick={() => { setIsEditing(false); setForm({ name: esp.name, macAddress: esp.macAddress, firmwareVersion: esp.firmwareVersion, topicPub: esp.topicPub, topicSub: esp.topicSub }) }}>Huỷ</Button>
                  </div>
                </div>
              )}
            </div>

            {/* Devices */}
            <div className="p-4 border rounded-lg shadow-sm">
              <h4 className="font-medium mb-3">Thiết bị ({devices.length || 0})</h4>

              <div className="space-y-2">
                {devices.map((d: Esp32Device, idx: number) => (
                  <div key={d.name} className="flex items-center justify-between p-2 border rounded">
                    <div>
                      <div className="font-medium">{d.name}</div>
                      <div className="text-xs text-gray-500">{d.type}</div>
                    </div>
                    <div className="flex gap-2">
                      <Button size="sm" onClick={() => handleEditDevice(idx)}>Sửa</Button>
                      <Button size="sm" variant="destructive" onClick={() => handleRemoveDevice(d.name)}>Xóa</Button>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-4 border-t pt-4">
                <h5 className="font-medium mb-2">Thêm thiết bị</h5>
                <div className="flex gap-2 items-center">
                  <Input placeholder="Tên thiết bị" value={deviceForm.name} onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleDeviceChange('name', e.target.value)} />
                  <Input placeholder="Loại (ví dụ: LED)" value={deviceForm.type} onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleDeviceChange('type', e.target.value)} />
                  {editingDeviceIndex === null ? (
                    <Button onClick={handleAddDevice} disabled={addDeviceMut.isPending}>Thêm</Button>
                  ) : (
                    <>
                      <Button onClick={handleUpdateDevice} disabled={updateDeviceMut.isPending}>Cập nhật</Button>
                      <Button variant="ghost" onClick={() => { setEditingDeviceIndex(null); setDeviceForm({ name: '', type: '' }) }}>Huỷ</Button>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </section>
    </div>
  )
}