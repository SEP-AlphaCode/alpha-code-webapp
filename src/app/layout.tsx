import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import Provider from "./provider"
import "react-toastify/dist/ReactToastify.css"
import { PublicEnvScript } from "next-runtime-env"
import { I18nProvider } from "@/lib/i18n/provider"
import { Toaster } from "sonner"

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin", "vietnamese"],
  display: "swap",
})

export const metadata: Metadata = {
  title: "AlphaCode",
  description: "Platform manage robot learning assistant",
  openGraph: {
    title: "AlphaCode",
    description: "Platform manage robot learning assistant",
    url: "https://alpha-code.site",
    siteName: "AlphaCode",
    images: [{ url: "/logo2.png" }],
    locale: "vi_VN",
    type: "website",
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="vi" suppressHydrationWarning>
      <head>
        <PublicEnvScript />
      </head>
      <body className={`${inter.variable} font-sans antialiased`} suppressHydrationWarning>
        <Provider>
          <I18nProvider page="homepage">
            {children}
            <Toaster
              position="top-right" // top-left, top-center, bottom-left...
              richColors
            />
          </I18nProvider>
        </Provider>
      </body>
    </html>
  )
}
