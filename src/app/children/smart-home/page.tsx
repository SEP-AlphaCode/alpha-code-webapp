"use client"

import React, { useEffect, useState } from 'react'
import { useEsp32 } from '@/features/esp32/hooks'
import { getUserIdFromToken } from '@/utils/tokenUtils'

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

  return (
    <div className="p-4">
      <h1 className="text-2xl font-semibold mb-4">Smart Home Kit</h1>
      <p className="text-sm text-muted-foreground mb-6">Các thiết bị Smart Home dành cho trẻ.</p>

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
          <div className="text-sm text-gray-600">Không có thiết bị nào được tìm thấy.</div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <div key={esp.id} className="p-4 border rounded-lg shadow-sm">
              <h3 className="font-medium">{esp.name}</h3>
              <p className="text-xs text-gray-500">MAC: {esp.macAddress}</p>
              <p className="text-xs text-gray-500">Firmware: {esp.firmwareVersion}</p>
              <p className="text-sm mt-2">Topic Pub: {esp.topicPub}</p>
              <p className="text-sm">Topic Sub: {esp.topicSub}</p>
            </div>
          </div>
        )}
      </section>
    </div>
  )
}
