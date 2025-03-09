"use client"

import { UserNav } from "@/components/user-nav"
import { ClusterSelector } from "@/components/cluster-selector"
import { Button } from "@/components/ui/button"
import { Moon, Sun } from "lucide-react"
import { useTheme } from "next-themes"
import { useEffect, useState } from "react"
import { NotificationsPopover } from "./notifications/notifications-popover"

export function Header() {
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  // Avoid hydration mismatch
  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return null
  }

  return (
    <header className="border-b">
      <div className="flex h-16 items-center px-4">
        <div className="flex-1 flex items-center space-x-4">
          <ClusterSelector />
        </div>
        <div className="flex items-center space-x-4">
          <NotificationsPopover />
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            aria-label="Toggle theme"
          >
            {theme === "dark" ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
          </Button>
          <UserNav />
        </div>
      </div>
    </header>
  )
}

