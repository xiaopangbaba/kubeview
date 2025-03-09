"use server"
import { k8s } from "@kubernetes/client-node"

// Store for kubeconfigs (in a real app, this would be in a database)
const clusters: { id: string; name: string; config: string }[] = []

// Initialize Kubernetes client
const getKubeConfig = (clusterId: string) => {
  const cluster = clusters.find((c) => c.id === clusterId)
  if (!cluster) {
    throw new Error(`Cluster with ID ${clusterId} not found`)
  }

  const kc = new k8s.KubeConfig()
  kc.loadFromString(cluster.config)
  return kc
}

export async function fetchClusters() {
  // In a real app, this would fetch from a database
  return clusters.map((c) => ({ id: c.id, name: c.name }))
}

export async function addCluster(name: string, config: string) {
  try {
    // Validate the kubeconfig
    const kc = new k8s.KubeConfig()
    kc.loadFromString(config)

    // Generate a unique ID
    const id = `cluster-${Date.now()}`

    // Add to our in-memory store
    const newCluster = { id, name, config }
    clusters.push(newCluster)

    return { id, name }
  } catch (error) {
    console.error("Error adding cluster:", error)
    throw new Error("Invalid kubeconfig")
  }
}

export async function fetchNamespaces(clusterId: string) {
  try {
    const kc = getKubeConfig(clusterId)
    const k8sApi = kc.makeApiClient(k8s.CoreV1Api)

    const response = await k8sApi.listNamespace()
    return response.body.items.map((ns) => ns.metadata?.name || "")
  } catch (error) {
    console.error("Error fetching namespaces:", error)
    throw new Error("Failed to fetch namespaces")
  }
}

export async function fetchClusterResources(clusterId: string, namespace: string) {
  try {
    const kc = getKubeConfig(clusterId)
    const coreV1Api = kc.makeApiClient(k8s.CoreV1Api)
    const appsV1Api = kc.makeApiClient(k8s.AppsV1Api)

    // Fetch pods
    const podsResponse = await coreV1Api.listNamespacedPod(namespace)

    // Fetch deployments
    const deploymentsResponse = await appsV1Api.listNamespacedDeployment(namespace)

    // Fetch services
    const servicesResponse = await coreV1Api.listNamespacedService(namespace)

    // Fetch nodes (cluster-wide resource)
    const nodesResponse = await coreV1Api.listNode()

    return {
      pods: podsResponse.body.items,
      deployments: deploymentsResponse.body.items,
      services: servicesResponse.body.items,
      nodes: nodesResponse.body.items,
    }
  } catch (error) {
    console.error("Error fetching resources:", error)
    throw new Error("Failed to fetch cluster resources")
  }
}

export async function deleteResource(clusterId: string, resourceType: string, name: string, namespace: string) {
  try {
    const kc = getKubeConfig(clusterId)

    switch (resourceType) {
      case "pods": {
        const api = kc.makeApiClient(k8s.CoreV1Api)
        await api.deleteNamespacedPod(name, namespace)
        break
      }
      case "deployments": {
        const api = kc.makeApiClient(k8s.AppsV1Api)
        await api.deleteNamespacedDeployment(name, namespace)
        break
      }
      case "services": {
        const api = kc.makeApiClient(k8s.CoreV1Api)
        await api.deleteNamespacedService(name, namespace)
        break
      }
      // Add other resource types as needed
      default:
        throw new Error(`Unsupported resource type: ${resourceType}`)
    }

    return { success: true }
  } catch (error) {
    console.error(`Error deleting ${resourceType}:`, error)
    throw new Error(`Failed to delete ${resourceType}`)
  }
}

