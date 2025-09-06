import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import Provider from "./provider"
import { ToastContainer } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"
import { PublicEnvScript } from "next-runtime-env"

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
          {children}
          <ToastContainer />
        </Provider>
      </body>
    </html>
  )
}
