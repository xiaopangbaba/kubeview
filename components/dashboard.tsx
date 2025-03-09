"use client"

import { useState, useEffect } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { ClusterSelector } from "./cluster-selector"
import { NamespaceSelector } from "./namespace-selector"
import { ResourceTable } from "./resource-table"
import { ResourceGraph } from "./resource-graph"
import { fetchClusterResources } from "@/lib/kubernetes-api"
import { useToast } from "@/hooks/use-toast"

export function Dashboard() {
  const [activeCluster, setActiveCluster] = useState<string>("")
  const [activeNamespace, setActiveNamespace] = useState<string>("default")
  const [resources, setResources] = useState<any>({
    pods: [],
    deployments: [],
    services: [],
    nodes: [],
  })
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [viewMode, setViewMode] = useState<"table" | "graph">("table")
  const { toast } = useToast()

  useEffect(() => {
    if (activeCluster) {
      loadResources()
    }
  }, [activeCluster, activeNamespace])

  const loadResources = async () => {
    try {
      setIsLoading(true)
      const data = await fetchClusterResources(activeCluster, activeNamespace)
      setResources(data)
    } catch (error) {
      toast({
        title: "Error loading resources",
        description: error instanceof Error ? error.message : "Unknown error occurred",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between p-4 border-b">
        <div className="flex items-center space-x-4">
          <ClusterSelector value={activeCluster} onChange={setActiveCluster} />
          <NamespaceSelector value={activeNamespace} onChange={setActiveNamespace} clusterId={activeCluster} />
        </div>
        <div className="flex items-center space-x-2">
          <Button variant={viewMode === "table" ? "default" : "outline"} size="sm" onClick={() => setViewMode("table")}>
            Table
          </Button>
          <Button variant={viewMode === "graph" ? "default" : "outline"} size="sm" onClick={() => setViewMode("graph")}>
            Graph
          </Button>
          <Button variant="outline" size="sm" onClick={loadResources} disabled={isLoading}>
            Refresh
          </Button>
        </div>
      </div>

      <Tabs defaultValue="pods" className="flex-1 overflow-hidden">
        <div className="border-b px-4">
          <TabsList>
            <TabsTrigger value="pods">Pods</TabsTrigger>
            <TabsTrigger value="deployments">Deployments</TabsTrigger>
            <TabsTrigger value="services">Services</TabsTrigger>
            <TabsTrigger value="nodes">Nodes</TabsTrigger>
            <TabsTrigger value="configmaps">ConfigMaps</TabsTrigger>
            <TabsTrigger value="secrets">Secrets</TabsTrigger>
            <TabsTrigger value="ingress">Ingress</TabsTrigger>
            <TabsTrigger value="storage">Storage</TabsTrigger>
          </TabsList>
        </div>

        <div className="p-4 flex-1 overflow-auto">
          <TabsContent value="pods" className="h-full">
            {viewMode === "table" ? (
              <ResourceTable
                resources={resources.pods}
                type="pods"
                isLoading={isLoading}
                clusterId={activeCluster}
                namespace={activeNamespace}
              />
            ) : (
              <ResourceGraph resources={resources} type="pods" clusterId={activeCluster} namespace={activeNamespace} />
            )}
          </TabsContent>

          <TabsContent value="deployments" className="h-full">
            {viewMode === "table" ? (
              <ResourceTable
                resources={resources.deployments}
                type="deployments"
                isLoading={isLoading}
                clusterId={activeCluster}
                namespace={activeNamespace}
              />
            ) : (
              <ResourceGraph
                resources={resources}
                type="deployments"
                clusterId={activeCluster}
                namespace={activeNamespace}
              />
            )}
          </TabsContent>

          {/* Similar TabsContent for other resource types */}
        </div>
      </Tabs>
    </div>
  )
}

