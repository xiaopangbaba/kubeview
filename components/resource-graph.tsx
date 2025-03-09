"use client"

import { useEffect, useRef } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ZoomIn, ZoomOut, RefreshCw } from "lucide-react"

interface ResourceGraphProps {
  resources: any
  type: string
  clusterId: string
  namespace: string
}

export function ResourceGraph({ resources, type, clusterId, namespace }: ResourceGraphProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const zoomLevel = useRef<number>(1)

  useEffect(() => {
    if (resources && Object.keys(resources).length > 0) {
      renderGraph()
    }
  }, [resources, type])

  const renderGraph = () => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // Reset canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height)

    // Set canvas dimensions to match container
    if (containerRef.current) {
      canvas.width = containerRef.current.clientWidth
      canvas.height = containerRef.current.clientHeight
    }

    // Apply zoom
    ctx.save()
    ctx.scale(zoomLevel.current, zoomLevel.current)

    // Draw nodes
    const nodes: any[] = []
    const connections: any[] = []

    // This is a simplified visualization - in a real app, you'd use a proper graph library
    // like D3.js, vis.js, or react-flow

    if (type === "pods") {
      // Draw pods
      resources.pods.forEach((pod: any, index: number) => {
        const x = 100 + (index % 5) * 150
        const y = 100 + Math.floor(index / 5) * 150

        nodes.push({
          id: pod.metadata.uid,
          x,
          y,
          type: "pod",
          name: pod.metadata.name,
          status: pod.status.phase,
        })

        // Connect pods to their services
        resources.services.forEach((service: any) => {
          if (service.spec.selector) {
            const matchesSelector = Object.entries(service.spec.selector).every(
              ([key, value]) => pod.metadata.labels?.[key] === value,
            )

            if (matchesSelector) {
              connections.push({
                from: pod.metadata.uid,
                to: service.metadata.uid,
                type: "service-pod",
              })
            }
          }
        })

        // Connect pods to their nodes
        if (pod.spec.nodeName) {
          const node = resources.nodes.find((n: any) => n.metadata.name === pod.spec.nodeName)
          if (node) {
            connections.push({
              from: pod.metadata.uid,
              to: node.metadata.uid,
              type: "pod-node",
            })
          }
        }
      })

      // Draw services
      resources.services.forEach((service: any, index: number) => {
        const x = 500 + (index % 3) * 180
        const y = 150 + Math.floor(index / 3) * 180

        nodes.push({
          id: service.metadata.uid,
          x,
          y,
          type: "service",
          name: service.metadata.name,
        })
      })

      // Draw nodes
      resources.nodes.forEach((node: any, index: number) => {
        const x = 300 + (index % 2) * 300
        const y = 400 + Math.floor(index / 2) * 150

        nodes.push({
          id: node.metadata.uid,
          x,
          y,
          type: "node",
          name: node.metadata.name,
        })
      })
    } else if (type === "deployments") {
      // Draw deployments and their pods
      resources.deployments.forEach((deployment: any, index: number) => {
        const x = 300 + (index % 3) * 200
        const y = 150 + Math.floor(index / 3) * 200

        nodes.push({
          id: deployment.metadata.uid,
          x,
          y,
          type: "deployment",
          name: deployment.metadata.name,
        })

        // Find pods managed by this deployment
        const deploymentSelector = deployment.spec.selector.matchLabels
        if (deploymentSelector) {
          resources.pods.forEach((pod: any) => {
            const matchesSelector = Object.entries(deploymentSelector).every(
              ([key, value]) => pod.metadata.labels?.[key] === value,
            )

            if (matchesSelector) {
              // Position pods around their deployment
              const angle = Math.random() * Math.PI * 2
              const distance = 80
              const podX = x + Math.cos(angle) * distance
              const podY = y + Math.sin(angle) * distance

              nodes.push({
                id: pod.metadata.uid,
                x: podX,
                y: podY,
                type: "pod",
                name: pod.metadata.name,
                status: pod.status.phase,
              })

              connections.push({
                from: deployment.metadata.uid,
                to: pod.metadata.uid,
                type: "deployment-pod",
              })
            }
          })
        }
      })
    }

    // Draw connections first (so they appear behind nodes)
    connections.forEach((conn) => {
      const fromNode = nodes.find((n) => n.id === conn.from)
      const toNode = nodes.find((n) => n.id === conn.to)

      if (fromNode && toNode) {
        ctx.beginPath()
        ctx.moveTo(fromNode.x, fromNode.y)
        ctx.lineTo(toNode.x, toNode.y)
        ctx.strokeStyle = "#888"
        ctx.lineWidth = 1
        ctx.stroke()
      }
    })

    // Draw nodes
    nodes.forEach((node) => {
      ctx.beginPath()

      // Different shapes/colors for different resource types
      if (node.type === "pod") {
        ctx.fillStyle = node.status === "Running" ? '#4ade80' : \
        node.status === "  {
        ctx.fillStyle =
          node.status === "Running"
            ? "#4ade80"
            : node.status === "Pending"
              ? "#facc15"
              : node.status === "Failed"
                ? "#f87171"
                : "#94a3b8"
        ctx.arc(node.x, node.y, 20, 0, Math.PI * 2)
      } else if (node.type === "service") {
        ctx.fillStyle = "#60a5fa"
        ctx.rect(node.x - 25, node.y - 15, 50, 30)
      } else if (node.type === "deployment") {
        ctx.fillStyle = "#a78bfa"
        ctx.rect(node.x - 30, node.y - 20, 60, 40)
      } else if (node.type === "node") {
        ctx.fillStyle = "#f97316"
        ctx.rect(node.x - 35, node.y - 25, 70, 50)
      }

      ctx.fill()

      // Draw node name
      ctx.fillStyle = "#fff"
      ctx.font = "10px Arial"
      ctx.textAlign = "center"
      ctx.fillText(node.name, node.x, node.y)
    })

    ctx.restore()
  }

  const handleZoomIn = () => {
    zoomLevel.current += 0.1
    renderGraph()
  }

  const handleZoomOut = () => {
    if (zoomLevel.current > 0.5) {
      zoomLevel.current -= 0.1
      renderGraph()
    }
  }

  const handleRefresh = () => {
    renderGraph()
  }

  return (
    <Card className="h-full">
      <CardContent className="p-0 h-full relative">
        <div className="absolute top-4 right-4 flex space-x-2 z-10">
          <Button variant="outline" size="icon" onClick={handleZoomIn}>
            <ZoomIn className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="icon" onClick={handleZoomOut}>
            <ZoomOut className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="icon" onClick={handleRefresh}>
            <RefreshCw className="h-4 w-4" />
          </Button>
        </div>
        <div ref={containerRef} className="h-full w-full overflow-auto">
          <canvas ref={canvasRef} className="min-w-full min-h-full" />
        </div>
      </CardContent>
    </Card>
  )
}

