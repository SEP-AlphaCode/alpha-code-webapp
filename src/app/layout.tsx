import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Provider from "./provider";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css'; // import the CSS for the Toastify component
import { PublicEnvScript } from 'next-runtime-env';
import alphaminilogoo from '@/public/logo2.png';



const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "AlphaCode",
  description: "Platform manage robot learning assistant",
  openGraph: {
    title: "AlphaCode",
    description: "Platform manage robot learning assistant",
    url: "https://alpha-code.site",
    siteName: "AlphaCode",
    images: [{ url: alphaminilogoo.src }],
    locale: "vi_VN",
    type: "website",
  },
};


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <PublicEnvScript />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        suppressHydrationWarning
      >
        <Provider>{children}
          <ToastContainer />
        </Provider>
      </body>
    </html>
  );
}
