"use client"

import { useState, useEffect } from "react"
import { ResourceTypes } from "@/components/resource-types"
import { NamespaceSelector } from "@/components/namespace-selector"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { AlertCircle } from "lucide-react"
import KubernetesService from "../services/kubernetes"

export default function RolesPage() {
  const [namespace, setNamespace] = useState("default")
  const [roles, setRoles] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchRoles = async () => {
      try {
        setLoading(true)
        const k8sService = KubernetesService.getInstance()
        const rolesList = await k8sService.getRoles(namespace)
        setRoles(rolesList)
        setError(null)
      } catch (err) {
        console.error("Error fetching roles:", err)
        setError("Failed to fetch roles: " + (err.message || "Unknown error"))
      } finally {
        setLoading(false)
      }
    }

    fetchRoles()
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
        <h1 className="text-2xl font-bold tracking-tight">Roles</h1>
        <p className="text-muted-foreground">Manage RBAC roles in your Kubernetes cluster.</p>
      </div>

      <NamespaceSelector selectedNamespace={namespace} onNamespaceChange={handleNamespaceChange} />

      {loading ? (
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      ) : (
        <ResourceTypes
          resourceType="roles"
          resources={roles}
          title="Roles"
          description="Namespace-scoped permission sets"
        />
      )}
    </div>
  )
}

