"use client"

import { ResourceUsageChart } from "@/components/monitoring/resource-usage-chart"
import { NodeResources } from "@/components/monitoring/node-resources"
import { AlertRules } from "@/components/monitoring/alert-rules"

export default function MonitoringPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Resource Monitoring</h1>
        <p className="text-muted-foreground">
          Monitor resource usage and configure alerts for your Kubernetes cluster.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6">
        <ResourceUsageChart />
        <NodeResources />
        <AlertRules />
      </div>
    </div>
  )
}

