import type { Metadata } from "next"
import { Noto_Sans_Bengali, Inter, Roboto } from "next/font/google"
import "./globals.css"
import { SpeedInsights } from '@vercel/speed-insights/next';
import { cn } from "@/lib/utils";
import { TooltipProvider } from "@/components/ui/tooltip";

const robotoHeading = Roboto({subsets:['latin'],variable:'--font-heading'});

const inter = Inter({subsets:['latin'],variable:'--font-sans'});

const notoSansBengali = Noto_Sans_Bengali({
  subsets: ["bengali", "latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-bangla",
  display: "swap",
})

export const metadata: Metadata = {
  title: "TaxFlowBD",
  description: "বাংলাদেশের জন্য এআই-চালিত আয়কর ফাইলিং প্ল্যাটফর্ম",
  icons: {
    icon: "/favicon.svg",
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="bn" className={cn("h-full", notoSansBengali.variable, "font-sans", inter.variable, robotoHeading.variable)}>
      <body
        className={`${notoSansBengali.className} min-h-full flex flex-col antialiased`}
      >
        <TooltipProvider>
          {children}
        </TooltipProvider>
        <SpeedInsights />
      </body>
    </html>
  )
}
