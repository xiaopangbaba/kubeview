"use client"

import { useState, useEffect } from "react"
import { Bell } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Badge } from "@/components/ui/badge"
import { NotificationItem } from "./notification-item"
import { useNotifications } from "@/hooks/use-notifications"

export function NotificationsPopover() {
  const { notifications, markAllAsRead } = useNotifications()
  const [open, setOpen] = useState(false)
  const [mounted, setMounted] = useState(false)

  // Avoid hydration mismatch
  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return null
  }

  const unreadCount = notifications.filter((n) => !n.read).length
  const alerts = notifications.filter((n) => n.type === "alert")
  const updates = notifications.filter((n) => n.type === "update")

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-5 w-5" />
          {unreadCount > 0 && (
            <Badge
              variant="destructive"
              className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs"
            >
              {unreadCount}
            </Badge>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80 p-0" align="end">
        <div className="flex items-center justify-between p-4 border-b">
          <h4 className="font-medium">Notifications</h4>
          {unreadCount > 0 && (
            <Button
              variant="ghost"
              size="sm"
              className="text-xs h-8"
              onClick={() => {
                markAllAsRead()
                setOpen(false)
              }}
            >
              Mark all as read
            </Button>
          )}
        </div>
        <Tabs defaultValue="all">
          <TabsList className="w-full grid grid-cols-3">
            <TabsTrigger value="all">
              All
              {unreadCount > 0 && (
                <Badge variant="secondary" className="ml-1">
                  {unreadCount}
                </Badge>
              )}
            </TabsTrigger>
            <TabsTrigger value="alerts">
              Alerts
              {alerts.filter((n) => !n.read).length > 0 && (
                <Badge variant="secondary" className="ml-1">
                  {alerts.filter((n) => !n.read).length}
                </Badge>
              )}
            </TabsTrigger>
            <TabsTrigger value="updates">
              Updates
              {updates.filter((n) => !n.read).length > 0 && (
                <Badge variant="secondary" className="ml-1">
                  {updates.filter((n) => !n.read).length}
                </Badge>
              )}
            </TabsTrigger>
          </TabsList>
          <TabsContent value="all" className="p-0">
            <ScrollArea className="h-[300px]">
              {notifications.length === 0 ? (
                <div className="flex items-center justify-center h-[300px] text-sm text-muted-foreground">
                  No notifications
                </div>
              ) : (
                <div className="divide-y">
                  {notifications.map((notification) => (
                    <NotificationItem key={notification.id} notification={notification} />
                  ))}
                </div>
              )}
            </ScrollArea>
          </TabsContent>
          <TabsContent value="alerts" className="p-0">
            <ScrollArea className="h-[300px]">
              {alerts.length === 0 ? (
                <div className="flex items-center justify-center h-[300px] text-sm text-muted-foreground">
                  No alerts
                </div>
              ) : (
                <div className="divide-y">
                  {alerts.map((notification) => (
                    <NotificationItem key={notification.id} notification={notification} />
                  ))}
                </div>
              )}
            </ScrollArea>
          </TabsContent>
          <TabsContent value="updates" className="p-0">
            <ScrollArea className="h-[300px]">
              {updates.length === 0 ? (
                <div className="flex items-center justify-center h-[300px] text-sm text-muted-foreground">
                  No updates
                </div>
              ) : (
                <div className="divide-y">
                  {updates.map((notification) => (
                    <NotificationItem key={notification.id} notification={notification} />
                  ))}
                </div>
              )}
            </ScrollArea>
          </TabsContent>
        </Tabs>
      </PopoverContent>
    </Popover>
  )
}

