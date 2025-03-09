"use client"

import { useState, useEffect } from "react"
import { ResourceTypes } from "@/components/resource-types"
import { NamespaceSelector } from "@/components/namespace-selector"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { AlertCircle } from "lucide-react"
import KubernetesService from "../services/kubernetes"

export default function AutoscalersPage() {
  const [namespace, setNamespace] = useState("default")
  const [autoscalers, setAutoscalers] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchAutoscalers = async () => {
      try {
        setLoading(true)
        const k8sService = KubernetesService.getInstance()
        const hpas = await k8sService.getHorizontalPodAutoscalers(namespace)
        setAutoscalers(hpas)
        setError(null)
      } catch (err) {
        console.error("Error fetching autoscalers:", err)
        setError("Failed to fetch autoscalers: " + (err.message || "Unknown error"))
      } finally {
        setLoading(false)
      }
    }

    fetchAutoscalers()
  }, [namespace])

  const handleNamespaceChange = (newNamespace: string) => {
    setNamespace(newNamespace)
  }

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Horizontal Pod Autoscalers</h1>
        <p className="text-muted-foreground">Manage autoscaling for your workloads.</p>
      </div>

      <NamespaceSelector selectedNamespace={namespace} onNamespaceChange={handleNamespaceChange} />

      {loading ? (
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      ) : (
        <ResourceTypes
          resourceType="horizontalpodautoscalers"
          resources={autoscalers}
          title="Horizontal Pod Autoscalers"
          description="Automatically scale workloads based on metrics"
        />
      )}
    </div>
  )
}

