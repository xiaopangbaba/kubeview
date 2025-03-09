export interface Notification {
  id: string
  title: string
  message: string
  type: "alert" | "update"
  severity: "info" | "success" | "warning" | "critical"
  timestamp: string
  read: boolean
}

