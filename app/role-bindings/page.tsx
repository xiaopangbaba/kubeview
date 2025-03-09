"use client"

import { useState, useEffect } from "react"
import { ResourceTypes } from "@/components/resource-types"
import { NamespaceSelector } from "@/components/namespace-selector"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { AlertCircle } from "lucide-react"
import KubernetesService from "../services/kubernetes"

export default function RoleBindingsPage() {
  const [namespace, setNamespace] = useState("default")
  const [roleBindings, setRoleBindings] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchRoleBindings = async () => {
      try {
        setLoading(true)
        const k8sService = KubernetesService.getInstance()
        const bindings = await k8sService.getRoleBindings(namespace)
        setRoleBindings(bindings)
        setError(null)
      } catch (err) {
        console.error("Error fetching role bindings:", err)
        setError("Failed to fetch role bindings: " + (err.message || "Unknown error"))
      } finally {
        setLoading(false)
      }
    }

    fetchRoleBindings()
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
        <h1 className="text-2xl font-bold tracking-tight">Role Bindings</h1>
        <p className="text-muted-foreground">Manage RBAC role bindings in your Kubernetes cluster.</p>
      </div>

      <NamespaceSelector selectedNamespace={namespace} onNamespaceChange={handleNamespaceChange} />

      {loading ? (
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      ) : (
        <ResourceTypes
          resourceType="rolebindings"
          resources={roleBindings}
          title="Role Bindings"
          description="Bindings between roles and subjects"
        />
      )}
    </div>
  )
}

