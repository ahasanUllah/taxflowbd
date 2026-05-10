import type { Metadata } from "next"
import { Hind_Siliguri } from "next/font/google"
import "./globals.css"

const hindSiliguri = Hind_Siliguri({
  subsets: ["bengali"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-bangla",
  display: "swap",
})

export const metadata: Metadata = {
  title: "TaxFlowBD",
  description: "বাংলাদেশের জন্য এআই-চালিত আয়কর ফাইলিং প্ল্যাটফর্ম",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="bn" className={`${hindSiliguri.variable} h-full`}>
      <body
        className={`${hindSiliguri.className} min-h-full flex flex-col antialiased`}
      >
        {children}
      </body>
    </html>
  )
}
