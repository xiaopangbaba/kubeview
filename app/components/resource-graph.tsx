"use client"

import { useEffect, useRef, useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { AlertCircle } from "lucide-react"
import * as d3 from "d3"

interface ResourceGraphProps {
  resourceType: string
  resources: any[]
}

interface Node {
  id: string
  name: string
  type: string
  status?: string
}

interface Link {
  source: string
  target: string
  type: string
}

export function ResourceGraph({ resourceType, resources }: ResourceGraphProps) {
  const svgRef = useRef<SVGSVGElement>(null)
  const [error, setError] = useState<string | null>(null)
  const [nodes, setNodes] = useState<Node[]>([])
  const [links, setLinks] = useState<Link[]>([])

  useEffect(() => {
    try {
      if (!resources || resources.length === 0) {
        setNodes([])
        setLinks([])
        return
      }

      const graphNodes: Node[] = []
      const graphLinks: Link[] = []

      // Process resources based on type
      resources.forEach((resource) => {
        const resourceId = resource.metadata?.uid || `${resource.metadata?.name}-${Math.random()}`
        const resourceName = resource.metadata?.name || "unknown"
        const resourceStatus = resource.status?.phase || resource.status?.conditions?.[0]?.status || "unknown"

        // Add the main resource node
        graphNodes.push({
          id: resourceId,
          name: resourceName,
          type: resourceType,
          status: resourceStatus,
        })

        // Process related resources
        if (resourceType === "pods") {
          // Add node for each container
          if (resource.spec?.containers) {
            resource.spec.containers.forEach((container: any) => {
              const containerId = `${resourceId}-container-${container.name}`
              graphNodes.push({
                id: containerId,
                name: container.name,
                type: "container",
              })
              graphLinks.push({
                source: resourceId,
                target: containerId,
                type: "contains",
              })
            })
          }

          // Add node for ownerReferences
          if (resource.metadata?.ownerReferences) {
            resource.metadata.ownerReferences.forEach((owner: any) => {
              const ownerId = owner.uid || `${owner.name}-${owner.kind}`

              // Check if owner node already exists
              if (!graphNodes.some((node) => node.id === ownerId)) {
                graphNodes.push({
                  id: ownerId,
                  name: owner.name,
                  type: owner.kind.toLowerCase(),
                })
              }

              graphLinks.push({
                source: ownerId,
                target: resourceId,
                type: "owns",
              })
            })
          }
        } else if (resourceType === "deployments") {
          // Add node for ReplicaSets
          const rsId = `${resourceId}-rs`
          graphNodes.push({
            id: rsId,
            name: `${resourceName}-rs`,
            type: "replicaset",
          })
          graphLinks.push({
            source: resourceId,
            target: rsId,
            type: "manages",
          })

          // Add placeholder pods
          const replicas = resource.spec?.replicas || 1
          for (let i = 0; i < replicas; i++) {
            const podId = `${rsId}-pod-${i}`
            graphNodes.push({
              id: podId,
              name: `${resourceName}-pod-${i}`,
              type: "pod",
            })
            graphLinks.push({
              source: rsId,
              target: podId,
              type: "manages",
            })
          }
        } else if (resourceType === "services") {
          // Add placeholder for endpoints
          if (resource.spec?.selector) {
            const selectorLabels = resource.spec.selector
            const endpointId = `${resourceId}-endpoint`
            graphNodes.push({
              id: endpointId,
              name: `${resourceName}-endpoints`,
              type: "endpoint",
            })
            graphLinks.push({
              source: resourceId,
              target: endpointId,
              type: "exposes",
            })

            // Add placeholder pods that match the selector
            for (let i = 0; i < 3; i++) {
              const podId = `${endpointId}-pod-${i}`
              graphNodes.push({
                id: podId,
                name: `pod-${i}`,
                type: "pod",
              })
              graphLinks.push({
                source: endpointId,
                target: podId,
                type: "selects",
              })
            }
          }
        }
      })

      setNodes(graphNodes)
      setLinks(graphLinks)
      setError(null)
    } catch (err) {
      console.error("Error processing graph data:", err)
      setError("Failed to process graph data: " + (err.message || "Unknown error"))
    }
  }, [resourceType, resources])

  useEffect(() => {
    if (!svgRef.current || nodes.length === 0) return

    try {
      // Clear previous graph
      d3.select(svgRef.current).selectAll("*").remove()

      const width = svgRef.current.clientWidth
      const height = 500

      // Create SVG
      const svg = d3
        .select(svgRef.current)
        .attr("width", width)
        .attr("height", height)
        .attr("viewBox", [0, 0, width, height])

      // Define node colors based on type
      const nodeColors: { [key: string]: string } = {
        pod: "#3b82f6", // blue-500
        deployment: "#8b5cf6", // violet-500
        service: "#10b981", // emerald-500
        ingress: "#f59e0b", // amber-500
        configmap: "#6366f1", // indigo-500
        secret: "#ef4444", // red-500
        container: "#6b7280", // gray-500
        replicaset: "#8b5cf6", // violet-500
        endpoint: "#10b981", // emerald-500
        persistentvolume: "#0ea5e9", // sky-500
        persistentvolumeclaim: "#0ea5e9", // sky-500
        storageclass: "#0ea5e9", // sky-500
        role: "#f97316", // orange-500
        rolebinding: "#f97316", // orange-500
        horizontalpodautoscaler: "#ec4899", // pink-500
        default: "#6b7280", // gray-500
      }

      // Define node status colors
      const statusColors: { [key: string]: string } = {
        Running: "#10b981", // emerald-500
        Pending: "#f59e0b", // amber-500
        Failed: "#ef4444", // red-500
        Succeeded: "#10b981", // emerald-500
        Unknown: "#6b7280", // gray-500
        True: "#10b981", // emerald-500
        False: "#ef4444", // red-500
        default: "#6b7280", // gray-500
      }

      // Create simulation
      const simulation = d3
        .forceSimulation(nodes as d3.SimulationNodeDatum[])
        .force(
          "link",
          d3
            .forceLink(links)
            .id((d: any) => d.id)
            .distance(100),
        )
        .force("charge", d3.forceManyBody().strength(-300))
        .force("center", d3.forceCenter(width / 2, height / 2))
        .force("collision", d3.forceCollide().radius(50))

      // Create container for zoom
      const container = svg.append("g")

      // Add zoom behavior
      const zoom = d3
        .zoom()
        .scaleExtent([0.1, 4])
        .on("zoom", (event) => {
          container.attr("transform", event.transform)
        })

      svg.call(zoom as any)

      // Create links
      const link = container
        .append("g")
        .selectAll("line")
        .data(links)
        .enter()
        .append("line")
        .attr("stroke", "#999")
        .attr("stroke-opacity", 0.6)
        .attr("stroke-width", 1.5)
        .attr("stroke-dasharray", (d) => (d.type === "owns" || d.type === "manages" ? "5,5" : "0"))

      // Create nodes
      const node = container
        .append("g")
        .selectAll(".node")
        .data(nodes)
        .enter()
        .append("g")
        .attr("class", "node")
        .call(d3.drag().on("start", dragstarted).on("drag", dragged).on("end", dragended) as any)

      // Add circles for nodes
      node
        .append("circle")
        .attr("r", 20)
        .attr("fill", (d: any) => {
          const color = nodeColors[d.type] || nodeColors.default
          return color
        })
        .attr("stroke", (d: any) => {
          if (d.status) {
            return statusColors[d.status] || statusColors.default
          }
          return "none"
        })
        .attr("stroke-width", (d: any) => (d.status ? 3 : 0))

      // Add icons or text for nodes
      node
        .append("text")
        .attr("text-anchor", "middle")
        .attr("dy", ".35em")
        .attr("fill", "white")
        .text((d: any) => d.type.charAt(0).toUpperCase())

      // Add labels
      node
        .append("text")
        .attr("dy", 35)
        .attr("text-anchor", "middle")
        .attr("class", "node-label")
        .text((d: any) => {
          // Truncate long names
          return d.name.length > 20 ? d.name.substring(0, 17) + "..." : d.name
        })
        .attr("fill", "#374151") // gray-700
        .style("font-size", "12px")

      // Add tooltips
      node.append("title").text((d: any) => `${d.name} (${d.type})${d.status ? `\nStatus: ${d.status}` : ""}`)

      // Update positions on simulation tick
      simulation.on("tick", () => {
        link
          .attr("x1", (d: any) => d.source.x)
          .attr("y1", (d: any) => d.source.y)
          .attr("x2", (d: any) => d.target.x)
          .attr("y2", (d: any) => d.target.y)

        node.attr("transform", (d: any) => `translate(${d.x},${d.y})`)
      })

      // Drag functions
      function dragstarted(event: any, d: any) {
        if (!event.active) simulation.alphaTarget(0.3).restart()
        d.fx = d.x
        d.fy = d.y
      }

      function dragged(event: any, d: any) {
        d.fx = event.x
        d.fy = event.y
      }

      function dragended(event: any, d: any) {
        if (!event.active) simulation.alphaTarget(0)
        d.fx = null
        d.fy = null
      }

      // Add legend
      const legend = svg.append("g").attr("transform", "translate(20, 20)")

      const legendTypes = Object.keys(nodeColors).filter((type) => nodes.some((node) => node.type === type))

      legendTypes.forEach((type, i) => {
        const legendRow = legend.append("g").attr("transform", `translate(0, ${i * 20})`)

        legendRow.append("circle").attr("r", 6).attr("fill", nodeColors[type])

        legendRow
          .append("text")
          .attr("x", 15)
          .attr("y", 4)
          .text(type.charAt(0).toUpperCase() + type.slice(1))
          .style("font-size", "12px")
          .attr("fill", "#374151") // gray-700
      })

      // Add instructions
      svg
        .append("text")
        .attr("x", width - 20)
        .attr("y", height - 20)
        .attr("text-anchor", "end")
        .text("Drag to move nodes, scroll to zoom")
        .style("font-size", "12px")
        .attr("fill", "#6b7280") // gray-500
    } catch (err) {
      console.error("Error rendering graph:", err)
      setError("Failed to render graph: " + (err.message || "Unknown error"))
    }
  }, [nodes, links])

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    )
  }

  if (nodes.length === 0) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center h-64">
          <p className="text-muted-foreground">No resources to display</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="w-full overflow-hidden">
      <svg ref={svgRef} className="w-full" style={{ minHeight: "500px" }}></svg>
    </div>
  )
}

