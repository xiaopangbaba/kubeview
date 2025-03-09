"use client"

import { useState, useEffect } from "react"
import { ResourceTypes } from "@/components/resource-types"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { AlertCircle } from "lucide-react"
import KubernetesService from "../services/kubernetes"

export default function StorageClassesPage() {
  const [storageClasses, setStorageClasses] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchStorageClasses = async () => {
      try {
        setLoading(true)
        const k8sService = KubernetesService.getInstance()
        const classes = await k8sService.getStorageClasses()
        setStorageClasses(classes)
        setError(null)
      } catch (err) {
        console.error("Error fetching storage classes:", err)
        setError("Failed to fetch storage classes: " + (err.message || "Unknown error"))
      } finally {
        setLoading(false)
      }
    }

    fetchStorageClasses()
  }, [])

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
        <h1 className="text-2xl font-bold tracking-tight">Storage Classes</h1>
        <p className="text-muted-foreground">Manage storage classes in your Kubernetes cluster.</p>
      </div>

      {loading ? (
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      ) : (
        <ResourceTypes
          resourceType="storageclasses"
          resources={storageClasses}
          title="Storage Classes"
          description="Storage provisioners and configurations"
        />
      )}
    </div>
  )
}

