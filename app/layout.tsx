import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { AppSidebarWrapper } from "@/components/sidebar"
import { Header } from "@/components/header"
import { AuthProvider } from "@/components/auth/auth-provider"
import { NotificationsProvider } from "@/hooks/use-notifications"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "KubeView - Kubernetes Cluster Management",
  description: "Open-source Kubernetes cluster management tool",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
          <AuthProvider>
            <NotificationsProvider>
              <AppSidebarWrapper>
                <Header />
                <main className="pt-4">{children}</main>
              </AppSidebarWrapper>
            </NotificationsProvider>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}



import './globals.css'