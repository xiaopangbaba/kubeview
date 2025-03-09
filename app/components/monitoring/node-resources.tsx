"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { generateNodeData, generateAlertThresholds } from "@/lib/demo-data"
import { useNotifications } from "@/hooks/use-notifications"

interface NodeData {
  name: string
  status: string
  cpu: {
    capacity: string
    used: number
    percentage: number
  }
  memory: {
    capacity: string
    used: string
    percentage: number
  }
  pods: {
    capacity: number
    used: number
    percentage: number
  }
  age: string
}

export function NodeResources() {
  const [nodes, setNodes] = useState<NodeData[]>([])
  const [thresholds, setThresholds] = useState<any>({})
  const { addNotification } = useNotifications()

  useEffect(() => {
    // In a real app, this would fetch data from an API
    // For demo purposes, we'll use generated data
    const nodeData = generateNodeData()
    setNodes(nodeData)
    setThresholds(generateAlertThresholds())

    // Set up polling for real-time updates
    const intervalId = setInterval(() => {
      const updatedNodes = generateNodeData()

      // Check for threshold violations and create alerts
      updatedNodes.forEach((node) => {
        const prevNode = nodeData.find((n) => n.name === node.name)

        // CPU alerts
        if (
          node.cpu.percentage >= thresholds.cpu.critical &&
          (!prevNode || prevNode.cpu.percentage < thresholds.cpu.critical)
        ) {
          addNotification({
            title: "Critical CPU Usage",
            message: `Node ${node.name} CPU usage is at ${node.cpu.percentage.toFixed(1)}%`,
            type: "alert",
            severity: "critical",
          })
        } else if (
          node.cpu.percentage >= thresholds.cpu.warning &&
          (!prevNode || prevNode.cpu.percentage < thresholds.cpu.warning)
        ) {
          addNotification({
            title: "High CPU Usage",
            message: `Node ${node.name} CPU usage is at ${node.cpu.percentage.toFixed(1)}%`,
            type: "alert",
            severity: "warning",
          })
        }

        // Memory alerts
        if (
          node.memory.percentage >= thresholds.memory.critical &&
          (!prevNode || prevNode.memory.percentage < thresholds.memory.critical)
        ) {
          addNotification({
            title: "Critical Memory Usage",
            message: `Node ${node.name} memory usage is at ${node.memory.percentage.toFixed(1)}%`,
            type: "alert",
            severity: "critical",
          })
        } else if (
          node.memory.percentage >= thresholds.memory.warning &&
          (!prevNode || prevNode.memory.percentage < thresholds.memory.warning)
        ) {
          addNotification({
            title: "High Memory Usage",
            message: `Node ${node.name} memory usage is at ${node.memory.percentage.toFixed(1)}%`,
            type: "alert",
            severity: "warning",
          })
        }

        // Pod count alerts
        if (
          node.pods.percentage >= thresholds.pods.critical &&
          (!prevNode || prevNode.pods.percentage < thresholds.pods.critical)
        ) {
          addNotification({
            title: "Critical Pod Count",
            message: `Node ${node.name} is running ${node.pods.used}/${node.pods.capacity} pods (${node.pods.percentage.toFixed(1)}%)`,
            type: "alert",
            severity: "critical",
          })
        } else if (
          node.pods.percentage >= thresholds.pods.warning &&
          (!prevNode || prevNode.pods.percentage < thresholds.pods.warning)
        ) {
          addNotification({
            title: "High Pod Count",
            message: `Node ${node.name} is running ${node.pods.used}/${node.pods.capacity} pods (${node.pods.percentage.toFixed(1)}%)`,
            type: "alert",
            severity: "warning",
          })
        }
      })

      setNodes(updatedNodes)
    }, 60000) // Update every minute

    return () => clearInterval(intervalId)
  }, [addNotification])

  const getResourceColor = (percentage: number, resource: "cpu" | "memory" | "pods") => {
    if (percentage >= thresholds[resource]?.critical) {
      return "bg-destructive"
    } else if (percentage >= thresholds[resource]?.warning) {
      return "bg-yellow-500"
    } else {
      return "bg-primary"
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Node Resources</CardTitle>
        <CardDescription>Resource usage across cluster nodes</CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Node</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>CPU</TableHead>
              <TableHead>Memory</TableHead>
              <TableHead>Pods</TableHead>
              <TableHead>Age</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {nodes.map((node) => (
              <TableRow key={node.name}>
                <TableCell className="font-medium">{node.name}</TableCell>
                <TableCell>
                  <Badge
                    variant={node.status === "Ready" ? "outline" : "destructive"}
                    className={node.status === "Ready" ? "bg-green-50 text-green-700 border-green-200" : ""}
                  >
                    {node.status}
                  </Badge>
                </TableCell>
                <TableCell>
                  <div className="space-y-1">
                    <div className="flex justify-between text-xs">
                      <span>
                        {node.cpu.used} / {node.cpu.capacity}
                      </span>
                      <span>{node.cpu.percentage.toFixed(1)}%</span>
                    </div>
                    <Progress
                      value={node.cpu.percentage}
                      className={`h-2 ${getResourceColor(node.cpu.percentage, "cpu")}`}
                    />
                  </div>
                </TableCell>
                <TableCell>
                  <div className="space-y-1">
                    <div className="flex justify-between text-xs">
                      <span>
                        {node.memory.used} / {node.memory.capacity}
                      </span>
                      <span>{node.memory.percentage.toFixed(1)}%</span>
                    </div>
                    <Progress
                      value={node.memory.percentage}
                      className={`h-2 ${getResourceColor(node.memory.percentage, "memory")}`}
                    />
                  </div>
                </TableCell>
                <TableCell>
                  <div className="space-y-1">
                    <div className="flex justify-between text-xs">
                      <span>
                        {node.pods.used} / {node.pods.capacity}
                      </span>
                      <span>{node.pods.percentage.toFixed(1)}%</span>
                    </div>
                    <Progress
                      value={node.pods.percentage}
                      className={`h-2 ${getResourceColor(node.pods.percentage, "pods")}`}
                    />
                  </div>
                </TableCell>
                <TableCell>{node.age}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}

