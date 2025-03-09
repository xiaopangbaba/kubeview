"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ResourceTable } from "./resource-table"
import { ResourceGraph } from "./resource-graph"
import { Button } from "@/components/ui/button"
import { Table, BarChart2 } from "lucide-react"

interface ResourceTypesProps {
  resourceType: string
  resources: any[]
  title: string
  description: string
}

export function ResourceTypes({ resourceType, resources, title, description }: ResourceTypesProps) {
  const [view, setView] = useState<"table" | "graph">("table")

  return (
    <Card className="w-full">
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>{title}</CardTitle>
          <CardDescription>{description}</CardDescription>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant={view === "table" ? "default" : "outline"} size="sm" onClick={() => setView("table")}>
            <Table className="h-4 w-4 mr-2" />
            Table
          </Button>
          <Button variant={view === "graph" ? "default" : "outline"} size="sm" onClick={() => setView("graph")}>
            <BarChart2 className="h-4 w-4 mr-2" />
            Graph
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {view === "table" ? (
          <ResourceTable resourceType={resourceType} resources={resources} />
        ) : (
          <ResourceGraph resourceType={resourceType} resources={resources} />
        )}
      </CardContent>
    </Card>
  )
}

