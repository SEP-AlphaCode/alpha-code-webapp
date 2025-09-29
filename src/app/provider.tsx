"use client"

import { useState } from "react"
import { useEffect } from "react"
import type React from "react"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { ReactQueryDevtools } from "@tanstack/react-query-devtools"
import { ThemeProvider } from "next-themes"
import { Provider as ReduxProvider } from "react-redux"
import { store } from "@/store/store"
import AOS from "aos"
import "aos/dist/aos.css"

export default function Provider({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(() => new QueryClient())

  useEffect(() => {
    AOS.init({
      duration: 700,
      easing: "ease-out-cubic",
      once: true,
      mirror: false,
      offset: 100
    })
    // Ensure AOS recalculates positions after init and on common events
    AOS.refresh()

    let resizeTimer: string | number | NodeJS.Timeout | null | undefined = null
    const handleResize = () => {
      if (resizeTimer) clearTimeout(resizeTimer)
      resizeTimer = setTimeout(() => AOS.refresh(), 150)
    }

    window.addEventListener("load", AOS.refresh)
    window.addEventListener("resize", handleResize)

    return () => {
      window.removeEventListener("load", AOS.refresh)
      window.removeEventListener("resize", handleResize)
      if (resizeTimer) clearTimeout(resizeTimer)
    }
  }, [])

  return (
    <ReduxProvider store={store}>
      <QueryClientProvider client={queryClient}>
        <ThemeProvider attribute="class" enableSystem>
          {children}
        </ThemeProvider>
        <ReactQueryDevtools initialIsOpen={false} />
      </QueryClientProvider>
    </ReduxProvider>
  )
}
