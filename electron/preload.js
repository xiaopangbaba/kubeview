const { contextBridge, ipcRenderer } = require("electron")

// Expose protected methods that allow the renderer process to use
// the ipcRenderer without exposing the entire object
contextBridge.exposeInMainWorld("electronAPI", {
  loadKubeconfig: () => ipcRenderer.invoke("load-kubeconfig"),
  getClusters: (kubeconfig) => ipcRenderer.invoke("get-clusters", kubeconfig),
  getNamespaces: (cluster) => ipcRenderer.invoke("get-namespaces", cluster),
  getResources: (cluster, namespace, resourceType) =>
    ipcRenderer.invoke("get-resources", cluster, namespace, resourceType),
  deleteResource: (cluster, namespace, resourceType, name) =>
    ipcRenderer.invoke("delete-resource", cluster, namespace, resourceType, name),
  applyYaml: (cluster, yaml) => ipcRenderer.invoke("apply-yaml", cluster, yaml),
  getResourceLogs: (cluster, namespace, podName, containerName) =>
    ipcRenderer.invoke("get-resource-logs", cluster, namespace, podName, containerName),
  execInPod: (cluster, namespace, podName, containerName, command) =>
    ipcRenderer.invoke("exec-in-pod", cluster, namespace, podName, containerName, command),
})

