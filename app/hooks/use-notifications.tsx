"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import type { Notification } from "@/types/notifications"

interface NotificationsContextType {
  notifications: Notification[]
  addNotification: (notification: Omit<Notification, "id" | "timestamp" | "read">) => void
  markAsRead: (id: string) => void
  markAllAsRead: () => void
  removeNotification: (id: string) => void
}

const NotificationsContext = createContext<NotificationsContextType | undefined>(undefined)

// Sample initial notifications for demo purposes
const initialNotifications: Notification[] = [
  {
    id: "1",
    title: "High CPU Usage",
    message: "Node worker-1 is experiencing high CPU usage (92%)",
    type: "alert",
    severity: "critical",
    timestamp: new Date(Date.now() - 1000 * 60 * 5).toISOString(), // 5 minutes ago
    read: false,
  },
  {
    id: "2",
    title: "Pod Restart",
    message: "Pod frontend-app-7d8f9b7c5-2x4z9 has restarted 3 times in the last hour",
    type: "alert",
    severity: "warning",
    timestamp: new Date(Date.now() - 1000 * 60 * 15).toISOString(), // 15 minutes ago
    read: false,
  },
  {
    id: "3",
    title: "Deployment Complete",
    message: "Deployment backend-api has been successfully updated to version v1.2.3",
    type: "update",
    severity: "success",
    timestamp: new Date(Date.now() - 1000 * 60 * 30).toISOString(), // 30 minutes ago
    read: true,
  },
  {
    id: "4",
    title: "New Node Added",
    message: "Node worker-3 has joined the cluster",
    type: "update",
    severity: "info",
    timestamp: new Date(Date.now() - 1000 * 60 * 60).toISOString(), // 1 hour ago
    read: true,
  },
]

export function NotificationsProvider({ children }: { children: ReactNode }) {
  const [notifications, setNotifications] = useState<Notification[]>([])

  // Load notifications from localStorage on mount
  useEffect(() => {
    const storedNotifications = localStorage.getItem("kubeview-notifications")
    if (storedNotifications) {
      try {
        setNotifications(JSON.parse(storedNotifications))
      } catch (error) {
        console.error("Error parsing stored notifications:", error)
        setNotifications(initialNotifications)
      }
    } else {
      setNotifications(initialNotifications)
    }
  }, [])

  // Save notifications to localStorage when they change
  useEffect(() => {
    if (notifications.length > 0) {
      localStorage.setItem("kubeview-notifications", JSON.stringify(notifications))
    }
  }, [notifications])

  const addNotification = (notification: Omit<Notification, "id" | "timestamp" | "read">) => {
    const newNotification: Notification = {
      ...notification,
      id: Date.now().toString(),
      timestamp: new Date().toISOString(),
      read: false,
    }

    setNotifications((prev) => [newNotification, ...prev])
  }

  const markAsRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((notification) => (notification.id === id ? { ...notification, read: true } : notification)),
    )
  }

  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((notification) => ({ ...notification, read: true })))
  }

  const removeNotification = (id: string) => {
    setNotifications((prev) => prev.filter((notification) => notification.id !== id))
  }

  return (
    <NotificationsContext.Provider
      value={{
        notifications,
        addNotification,
        markAsRead,
        markAllAsRead,
        removeNotification,
      }}
    >
      {children}
    </NotificationsContext.Provider>
  )
}

export function useNotifications() {
  const context = useContext(NotificationsContext)
  if (context === undefined) {
    throw new Error("useNotifications must be used within a NotificationsProvider")
  }
  return context
}

