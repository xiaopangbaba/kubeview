"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { CheckCircle, XCircle, AlertTriangle, Server, Activity } from "lucide-react"
import KubernetesService from "../services/kubernetes"

export default function ClusterHealth() {
  const [health, setHealth] = useState<any>(null)
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchClusterHealth = async () => {
      try {
        setLoading(true)
        const k8sService = KubernetesService.getInstance()
        const healthData = await k8sService.getClusterHealth()
        setHealth(healthData)
        setError(null)
      } catch (err) {
        setError("Failed to fetch cluster health: " + (err.message || "Unknown error"))
        console.error("Error fetching cluster health:", err)
      } finally {
        setLoading(false)
      }
    }

    fetchClusterHealth()
    // Set up polling every 30 seconds
    const intervalId = setInterval(fetchClusterHealth, 30000)

    return () => clearInterval(intervalId)
  }, [])

  if (loading && !health) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Cluster Health</CardTitle>
          <CardDescription>Loading cluster health information...</CardDescription>
        </CardHeader>
        <CardContent>
          <Progress value={undefined} className="w-full" />
        </CardContent>
      </Card>
    )
  }

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertTriangle className="h-4 w-4" />
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    )
  }

  if (!health) {
    return null
  }

  // Calculate overall health percentage
  const calculateHealthPercentage = () => {
    if (!health.nodes || health.nodes.length === 0) return 0

    const readyNodes = health.nodes.filter((node) => node.ready).length
    return Math.round((readyNodes / health.nodes.length) * 100)
  }

  const healthPercentage = calculateHealthPercentage()

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          Cluster Health
          {health.healthy ? (
            <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
              <CheckCircle className="h-3 w-3 mr-1" /> Healthy
            </Badge>
          ) : (
            <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">
              <XCircle className="h-3 w-3 mr-1" /> Issues Detected
            </Badge>
          )}
        </CardTitle>
        <CardDescription>Current status of your Kubernetes cluster</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="mb-6">
          <div className="flex justify-between mb-2">
            <span className="text-sm font-medium">Cluster Health</span>
            <span className="text-sm font-medium">{healthPercentage}%</span>
          </div>
          <Progress value={healthPercentage} className="h-2" />
        </div>

        <Tabs defaultValue="overview">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="nodes">Nodes</TabsTrigger>
            <TabsTrigger value="components">Components</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-4 mt-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card>
                <CardHeader className="p-4">
                  <CardTitle className="text-sm font-medium flex items-center">
                    <Server className="h-4 w-4 mr-2" /> API Server
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-4 pt-0">
                  {health.apiServer ? (
                    <Badge className="bg-green-100 text-green-800 hover:bg-green-100">Healthy</Badge>
                  ) : (
                    <Badge variant="destructive">Unavailable</Badge>
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="p-4">
                  <CardTitle className="text-sm font-medium flex items-center">
                    <Server className="h-4 w-4 mr-2" /> Nodes
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-4 pt-0">
                  <div className="flex items-center gap-2">
                    <Badge className="bg-green-100 text-green-800 hover:bg-green-100">
                      {health.nodes.filter((n) => n.ready).length} Ready
                    </Badge>
                    {health.nodes.some((n) => !n.ready) && (
                      <Badge variant="destructive">{health.nodes.filter((n) => !n.ready).length} Not Ready</Badge>
                    )}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="p-4">
                  <CardTitle className="text-sm font-medium flex items-center">
                    <Activity className="h-4 w-4 mr-2" /> Components
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-4 pt-0">
                  {health.components.length === 0 ? (
                    <Badge variant="outline">No data</Badge>
                  ) : (
                    <div className="flex items-center gap-2">
                      <Badge className="bg-green-100 text-green-800 hover:bg-green-100">
                        {
                          health.components.filter(
                            (c) => c.conditions?.every((cond) => cond.status === "True") || c.ready,
                          ).length
                        }{" "}
                        Healthy
                      </Badge>
                      {health.components.some(
                        (c) => !(c.conditions?.every((cond) => cond.status === "True") || c.ready),
                      ) && (
                        <Badge variant="destructive">
                          {
                            health.components.filter(
                              (c) => !(c.conditions?.every((cond) => cond.status === "True") || c.ready),
                            ).length
                          }{" "}
                          Unhealthy
                        </Badge>
                      )}
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="nodes" className="mt-4">
            <div className="space-y-4">
              {health.nodes.map((node, index) => (
                <Card key={index}>
                  <CardHeader className="p-4">
                    <CardTitle className="text-sm font-medium flex items-center justify-between">
                      <span className="flex items-center">
                        <Server className="h-4 w-4 mr-2" /> {node.name}
                      </span>
                      {node.ready ? (
                        <Badge className="bg-green-100 text-green-800 hover:bg-green-100">Ready</Badge>
                      ) : (
                        <Badge variant="destructive">Not Ready</Badge>
                      )}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-4 pt-0">
                    <div className="space-y-2">
                      {node.conditions.map((condition, i) => (
                        <div key={i} className="flex justify-between text-sm">
                          <span>{condition.type}</span>
                          <span
                            className={
                              condition.status === "True"
                                ? "text-green-600"
                                : condition.status === "False" && condition.type === "Ready"
                                  ? "text-red-600"
                                  : condition.status === "False" &&
                                      ["DiskPressure", "MemoryPressure", "PIDPressure", "NetworkUnavailable"].includes(
                                        condition.type,
                                      )
                                    ? "text-green-600"
                                    : "text-yellow-600"
                            }
                          >
                            {condition.status}
                          </span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="components" className="mt-4">
            <div className="space-y-4">
              {health.components.length === 0 ? (
                <Alert>
                  <AlertTriangle className="h-4 w-4" />
                  <AlertTitle>No component data available</AlertTitle>
                  <AlertDescription>
                    Component status information is not available in this Kubernetes cluster. This may be because
                    component status API is deprecated in Kubernetes 1.32+.
                  </AlertDescription>
                </Alert>
              ) : (
                health.components.map((component, index) => (
                  <Card key={index}>
                    <CardHeader className="p-4">
                      <CardTitle className="text-sm font-medium flex items-center justify-between">
                        <span>{component.name}</span>
                        {component.conditions ? (
                          component.conditions.every((c) => c.status === "True") ? (
                            <Badge className="bg-green-100 text-green-800 hover:bg-green-100">Healthy</Badge>
                          ) : (
                            <Badge variant="destructive">Unhealthy</Badge>
                          )
                        ) : component.ready ? (
                          <Badge className="bg-green-100 text-green-800 hover:bg-green-100">Healthy</Badge>
                        ) : (
                          <Badge variant="destructive">Unhealthy</Badge>
                        )}
                      </CardTitle>
                    </CardHeader>
                    {component.conditions && (
                      <CardContent className="p-4 pt-0">
                        <div className="space-y-2">
                          {component.conditions.map((condition, i) => (
                            <div key={i} className="flex justify-between text-sm">
                              <span>{condition.type}</span>
                              <span className={condition.status === "True" ? "text-green-600" : "text-red-600"}>
                                {condition.status}
                              </span>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    )}
                    {component.status && (
                      <CardContent className="p-4 pt-0">
                        <div className="flex justify-between text-sm">
                          <span>Status</span>
                          <span className={component.status === "Running" ? "text-green-600" : "text-yellow-600"}>
                            {component.status}
                          </span>
                        </div>
                      </CardContent>
                    )}
                  </Card>
                ))
              )}
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}

