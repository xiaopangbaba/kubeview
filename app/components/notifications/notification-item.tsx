"use client"

import { AlertCircle, Info, CheckCircle, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { formatDistanceToNow } from "date-fns"
import { useNotifications } from "@/hooks/use-notifications"
import type { Notification } from "@/types/notifications"

interface NotificationItemProps {
  notification: Notification
}

export function NotificationItem({ notification }: NotificationItemProps) {
  const { markAsRead, removeNotification } = useNotifications()

  const getIcon = () => {
    switch (notification.severity) {
      case "critical":
        return <AlertCircle className="h-5 w-5 text-destructive" />
      case "warning":
        return <AlertCircle className="h-5 w-5 text-yellow-500" />
      case "info":
        return <Info className="h-5 w-5 text-blue-500" />
      case "success":
        return <CheckCircle className="h-5 w-5 text-green-500" />
      default:
        return <Info className="h-5 w-5 text-blue-500" />
    }
  }

  return (
    <div
      className={cn(
        "flex items-start p-4 gap-3 hover:bg-muted/50 transition-colors",
        !notification.read && "bg-muted/30",
      )}
    >
      <div className="flex-shrink-0 mt-0.5">{getIcon()}</div>
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between">
          <p className={cn("text-sm font-medium", !notification.read && "font-semibold")}>{notification.title}</p>
          <div className="flex items-center gap-1 ml-2 flex-shrink-0">
            <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => removeNotification(notification.id)}>
              <X className="h-3 w-3" />
              <span className="sr-only">Dismiss</span>
            </Button>
          </div>
        </div>
        <p className="text-xs text-muted-foreground mt-1">{notification.message}</p>
        <div className="flex items-center justify-between mt-2">
          <span className="text-xs text-muted-foreground">
            {formatDistanceToNow(new Date(notification.timestamp), { addSuffix: true })}
          </span>
          {!notification.read && (
            <Button variant="ghost" size="sm" className="h-6 text-xs" onClick={() => markAsRead(notification.id)}>
              Mark as read
            </Button>
          )}
        </div>
      </div>
    </div>
  )
}

