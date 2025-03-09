"use client"

import { Badge } from "@/components/ui/badge"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Separator } from "@/components/ui/separator"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/hooks/use-toast"

export default function SettingsPage() {
  const { toast } = useToast()
  const [settings, setSettings] = useState({
    general: {
      refreshInterval: "30",
      theme: "system",
      telemetry: true,
    },
    notifications: {
      enableNotifications: true,
      notificationSound: true,
      criticalAlerts: true,
      warningAlerts: true,
      infoAlerts: false,
    },
    display: {
      compactMode: false,
      showSystemNamespaces: true,
      defaultView: "table",
    },
  })

  const handleGeneralSave = () => {
    toast({
      title: "Settings saved",
      description: "Your general settings have been saved.",
    })
  }

  const handleNotificationSave = () => {
    toast({
      title: "Notification settings saved",
      description: "Your notification preferences have been updated.",
    })
  }

  const handleDisplaySave = () => {
    toast({
      title: "Display settings saved",
      description: "Your display preferences have been updated.",
    })
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Settings</h1>
        <p className="text-muted-foreground">Manage your application preferences and settings.</p>
      </div>

      <Tabs defaultValue="general" className="space-y-4">
        <TabsList>
          <TabsTrigger value="general">General</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
          <TabsTrigger value="display">Display</TabsTrigger>
          <TabsTrigger value="users">Users & Permissions</TabsTrigger>
        </TabsList>

        <TabsContent value="general">
          <Card>
            <CardHeader>
              <CardTitle>General Settings</CardTitle>
              <CardDescription>Configure general application settings.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="refresh-interval">Refresh Interval (seconds)</Label>
                <Input
                  id="refresh-interval"
                  type="number"
                  value={settings.general.refreshInterval}
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      general: {
                        ...settings.general,
                        refreshInterval: e.target.value,
                      },
                    })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="theme">Theme</Label>
                <Select
                  value={settings.general.theme}
                  onValueChange={(value) =>
                    setSettings({
                      ...settings,
                      general: {
                        ...settings.general,
                        theme: value,
                      },
                    })
                  }
                >
                  <SelectTrigger id="theme">
                    <SelectValue placeholder="Select theme" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="light">Light</SelectItem>
                    <SelectItem value="dark">Dark</SelectItem>
                    <SelectItem value="system">System</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex items-center justify-between space-y-0 pt-2">
                <Label htmlFor="telemetry">
                  Usage Telemetry
                  <p className="text-sm font-normal text-muted-foreground">
                    Help improve KubeView by sending anonymous usage data.
                  </p>
                </Label>
                <Switch
                  id="telemetry"
                  checked={settings.general.telemetry}
                  onCheckedChange={(checked) =>
                    setSettings({
                      ...settings,
                      general: {
                        ...settings.general,
                        telemetry: checked,
                      },
                    })
                  }
                />
              </div>
            </CardContent>
            <CardFooter>
              <Button onClick={handleGeneralSave}>Save Changes</Button>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="notifications">
          <Card>
            <CardHeader>
              <CardTitle>Notification Settings</CardTitle>
              <CardDescription>Configure how and when you receive notifications.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between space-y-0">
                <Label htmlFor="enable-notifications">Enable Notifications</Label>
                <Switch
                  id="enable-notifications"
                  checked={settings.notifications.enableNotifications}
                  onCheckedChange={(checked) =>
                    setSettings({
                      ...settings,
                      notifications: {
                        ...settings.notifications,
                        enableNotifications: checked,
                      },
                    })
                  }
                />
              </div>
              <div className="flex items-center justify-between space-y-0">
                <Label htmlFor="notification-sound">Notification Sound</Label>
                <Switch
                  id="notification-sound"
                  checked={settings.notifications.notificationSound}
                  onCheckedChange={(checked) =>
                    setSettings({
                      ...settings,
                      notifications: {
                        ...settings.notifications,
                        notificationSound: checked,
                      },
                    })
                  }
                />
              </div>

              <Separator />
              <h3 className="text-sm font-medium">Alert Types</h3>

              <div className="flex items-center justify-between space-y-0">
                <Label htmlFor="critical-alerts">
                  Critical Alerts
                  <p className="text-sm font-normal text-muted-foreground">
                    Receive notifications for critical alerts.
                  </p>
                </Label>
                <Switch
                  id="critical-alerts"
                  checked={settings.notifications.criticalAlerts}
                  onCheckedChange={(checked) =>
                    setSettings({
                      ...settings,
                      notifications: {
                        ...settings.notifications,
                        criticalAlerts: checked,
                      },
                    })
                  }
                />
              </div>
              <div className="flex items-center justify-between space-y-0">
                <Label htmlFor="warning-alerts">
                  Warning Alerts
                  <p className="text-sm font-normal text-muted-foreground">Receive notifications for warning alerts.</p>
                </Label>
                <Switch
                  id="warning-alerts"
                  checked={settings.notifications.warningAlerts}
                  onCheckedChange={(checked) =>
                    setSettings({
                      ...settings,
                      notifications: {
                        ...settings.notifications,
                        warningAlerts: checked,
                      },
                    })
                  }
                />
              </div>
              <div className="flex items-center justify-between space-y-0">
                <Label htmlFor="info-alerts">
                  Info Alerts
                  <p className="text-sm font-normal text-muted-foreground">
                    Receive notifications for informational alerts.
                  </p>
                </Label>
                <Switch
                  id="info-alerts"
                  checked={settings.notifications.infoAlerts}
                  onCheckedChange={(checked) =>
                    setSettings({
                      ...settings,
                      notifications: {
                        ...settings.notifications,
                        infoAlerts: checked,
                      },
                    })
                  }
                />
              </div>
            </CardContent>
            <CardFooter>
              <Button onClick={handleNotificationSave}>Save Changes</Button>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="display">
          <Card>
            <CardHeader>
              <CardTitle>Display Settings</CardTitle>
              <CardDescription>Customize the appearance and behavior of the interface.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between space-y-0">
                <Label htmlFor="compact-mode">
                  Compact Mode
                  <p className="text-sm font-normal text-muted-foreground">
                    Use a more compact layout to show more information.
                  </p>
                </Label>
                <Switch
                  id="compact-mode"
                  checked={settings.display.compactMode}
                  onCheckedChange={(checked) =>
                    setSettings({
                      ...settings,
                      display: {
                        ...settings.display,
                        compactMode: checked,
                      },
                    })
                  }
                />
              </div>
              <div className="flex items-center justify-between space-y-0">
                <Label htmlFor="show-system-namespaces">
                  Show System Namespaces
                  <p className="text-sm font-normal text-muted-foreground">
                    Display system namespaces in the namespace selector.
                  </p>
                </Label>
                <Switch
                  id="show-system-namespaces"
                  checked={settings.display.showSystemNamespaces}
                  onCheckedChange={(checked) =>
                    setSettings({
                      ...settings,
                      display: {
                        ...settings.display,
                        showSystemNamespaces: checked,
                      },
                    })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="default-view">Default View</Label>
                <Select
                  value={settings.display.defaultView}
                  onValueChange={(value) =>
                    setSettings({
                      ...settings,
                      display: {
                        ...settings.display,
                        defaultView: value,
                      },
                    })
                  }
                >
                  <SelectTrigger id="default-view">
                    <SelectValue placeholder="Select default view" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="table">Table</SelectItem>
                    <SelectItem value="graph">Graph</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
            <CardFooter>
              <Button onClick={handleDisplaySave}>Save Changes</Button>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="users">
          <Card>
            <CardHeader>
              <CardTitle>Users & Permissions</CardTitle>
              <CardDescription>Manage users and their access permissions.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="border rounded-md">
                  <div className="flex items-center justify-between p-4">
                    <div>
                      <p className="font-medium">admin</p>
                      <p className="text-sm text-muted-foreground">Administrator</p>
                    </div>
                    <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                      Admin
                    </Badge>
                  </div>
                  <Separator />
                  <div className="flex items-center justify-between p-4">
                    <div>
                      <p className="font-medium">viewer</p>
                      <p className="text-sm text-muted-foreground">Read-only access</p>
                    </div>
                    <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                      Viewer
                    </Badge>
                  </div>
                </div>

                <p className="text-sm text-muted-foreground">
                  User management is only available in the full version. Contact your administrator to add or modify
                  users.
                </p>
              </div>
            </CardContent>
            <CardFooter>
              <Button variant="outline">Add User</Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

