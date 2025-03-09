"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Plus, Trash2, Save, AlertTriangle, AlertCircle, Bell } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface AlertRule {
  id: string
  name: string
  description: string
  resource: "cpu" | "memory" | "pods" | "disk" | "network"
  threshold: number
  severity: "info" | "warning" | "critical"
  enabled: boolean
}

export function AlertRules() {
  const [alertRules, setAlertRules] = useState<AlertRule[]>([
    {
      id: "1",
      name: "High CPU Usage",
      description: "Alert when CPU usage exceeds 70%",
      resource: "cpu",
      threshold: 70,
      severity: "warning",
      enabled: true,
    },
    {
      id: "2",
      name: "Critical CPU Usage",
      description: "Alert when CPU usage exceeds 85%",
      resource: "cpu",
      threshold: 85,
      severity: "critical",
      enabled: true,
    },
    {
      id: "3",
      name: "High Memory Usage",
      description: "Alert when memory usage exceeds 75%",
      resource: "memory",
      threshold: 75,
      severity: "warning",
      enabled: true,
    },
    {
      id: "4",
      name: "Critical Memory Usage",
      description: "Alert when memory usage exceeds 90%",
      resource: "memory",
      threshold: 90,
      severity: "critical",
      enabled: true,
    },
    {
      id: "5",
      name: "High Pod Count",
      description: "Alert when pod count exceeds 80% of capacity",
      resource: "pods",
      threshold: 80,
      severity: "warning",
      enabled: true,
    },
  ])

  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [newRule, setNewRule] = useState<Omit<AlertRule, "id">>({
    name: "",
    description: "",
    resource: "cpu",
    threshold: 70,
    severity: "warning",
    enabled: true,
  })

  const handleAddRule = () => {
    const rule: AlertRule = {
      ...newRule,
      id: Date.now().toString(),
    }

    setAlertRules([...alertRules, rule])
    setIsDialogOpen(false)
    setNewRule({
      name: "",
      description: "",
      resource: "cpu",
      threshold: 70,
      severity: "warning",
      enabled: true,
    })
  }

  const handleDeleteRule = (id: string) => {
    setAlertRules(alertRules.filter((rule) => rule.id !== id))
  }

  const handleToggleRule = (id: string) => {
    setAlertRules(alertRules.map((rule) => (rule.id === id ? { ...rule, enabled: !rule.enabled } : rule)))
  }

  const getSeverityBadge = (severity: string) => {
    switch (severity) {
      case "critical":
        return (
          <Badge variant="destructive" className="flex items-center gap-1">
            <AlertCircle className="h-3 w-3" /> Critical
          </Badge>
        )
      case "warning":
        return (
          <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200 flex items-center gap-1">
            <AlertTriangle className="h-3 w-3" /> Warning
          </Badge>
        )
      case "info":
        return (
          <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200 flex items-center gap-1">
            <Bell className="h-3 w-3" /> Info
          </Badge>
        )
      default:
        return <Badge>{severity}</Badge>
    }
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Alert Rules</CardTitle>
          <CardDescription>Configure alerts for resource usage thresholds</CardDescription>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button size="sm">
              <Plus className="h-4 w-4 mr-2" />
              Add Rule
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add Alert Rule</DialogTitle>
              <DialogDescription>Create a new alert rule for resource monitoring.</DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="name">Rule Name</Label>
                <Input
                  id="name"
                  placeholder="High CPU Usage"
                  value={newRule.name}
                  onChange={(e) => setNewRule({ ...newRule, name: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Input
                  id="description"
                  placeholder="Alert when CPU usage exceeds threshold"
                  value={newRule.description}
                  onChange={(e) => setNewRule({ ...newRule, description: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="resource">Resource</Label>
                <Select
                  value={newRule.resource}
                  onValueChange={(value: any) => setNewRule({ ...newRule, resource: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select resource" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="cpu">CPU</SelectItem>
                    <SelectItem value="memory">Memory</SelectItem>
                    <SelectItem value="pods">Pods</SelectItem>
                    <SelectItem value="disk">Disk</SelectItem>
                    <SelectItem value="network">Network</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="threshold">Threshold ({newRule.threshold}%)</Label>
                <Slider
                  id="threshold"
                  min={0}
                  max={100}
                  step={1}
                  value={[newRule.threshold]}
                  onValueChange={(value) => setNewRule({ ...newRule, threshold: value[0] })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="severity">Severity</Label>
                <Select
                  value={newRule.severity}
                  onValueChange={(value: any) => setNewRule({ ...newRule, severity: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select severity" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="info">Info</SelectItem>
                    <SelectItem value="warning">Warning</SelectItem>
                    <SelectItem value="critical">Critical</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleAddRule}>
                <Save className="h-4 w-4 mr-2" />
                Save Rule
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Resource</TableHead>
              <TableHead>Threshold</TableHead>
              <TableHead>Severity</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {alertRules.map((rule) => (
              <TableRow key={rule.id}>
                <TableCell className="font-medium">
                  <div>
                    {rule.name}
                    <p className="text-xs text-muted-foreground">{rule.description}</p>
                  </div>
                </TableCell>
                <TableCell className="capitalize">{rule.resource}</TableCell>
                <TableCell>{rule.threshold}%</TableCell>
                <TableCell>{getSeverityBadge(rule.severity)}</TableCell>
                <TableCell>
                  <Badge
                    variant={rule.enabled ? "default" : "outline"}
                    className={rule.enabled ? "bg-green-100 text-green-800 hover:bg-green-100" : ""}
                  >
                    {rule.enabled ? "Enabled" : "Disabled"}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Button variant="ghost" size="icon" onClick={() => handleToggleRule(rule.id)}>
                      {rule.enabled ? (
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="16"
                          height="16"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          className="lucide lucide-toggle-right"
                        >
                          <rect width="20" height="12" x="2" y="6" rx="6" />
                          <circle cx="16" cy="12" r="2" />
                        </svg>
                      ) : (
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="16"
                          height="16"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          className="lucide lucide-toggle-left"
                        >
                          <rect width="20" height="12" x="2" y="6" rx="6" />
                          <circle cx="8" cy="12" r="2" />
                        </svg>
                      )}
                      <span className="sr-only">{rule.enabled ? "Disable" : "Enable"} rule</span>
                    </Button>
                    <Button variant="ghost" size="icon" onClick={() => handleDeleteRule(rule.id)}>
                      <Trash2 className="h-4 w-4" />
                      <span className="sr-only">Delete rule</span>
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}

