import ClusterHealth from "@/components/cluster-health"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default function HealthPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Cluster Health</h1>
        <p className="text-muted-foreground">Monitor the health and status of your Kubernetes cluster.</p>
      </div>

      <ClusterHealth />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Kubernetes Version</CardTitle>
            <CardDescription>Current version information</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="font-medium">Server Version:</span>
                <span>v1.32.0</span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium">Client Version:</span>
                <span>v1.32.0</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Resource Usage</CardTitle>
            <CardDescription>Cluster resource utilization</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-4">
              Resource metrics require metrics-server to be installed in your cluster.
            </p>
            <div className="flex justify-center items-center h-24">
              <span className="text-muted-foreground">Resource metrics not available</span>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

