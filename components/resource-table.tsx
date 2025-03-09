"use client"

import { useState } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { AlertCircle, CheckCircle2, Clock, MoreHorizontal, Search, Trash2 } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { deleteResource } from "@/lib/kubernetes-api"
import { useToast } from "@/hooks/use-toast"

interface ResourceTableProps {
  resources: any[]
  type: string
  isLoading: boolean
  clusterId: string
  namespace: string
}

export function ResourceTable({ resources, type, isLoading, clusterId, namespace }: ResourceTableProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedResource, setSelectedResource] = useState<any>(null)
  const [detailsOpen, setDetailsOpen] = useState(false)
  const { toast } = useToast()

  const filteredResources = resources.filter((resource) =>
    resource.metadata.name.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const getStatusIcon = (status: string) => {
    switch (status.toLowerCase()) {
      case "running":
      case "ready":
      case "active":
        return <CheckCircle2 className="h-4 w-4 text-green-500" />
      case "pending":
      case "waiting":
        return <Clock className="h-4 w-4 text-yellow-500" />
      case "failed":
      case "error":
        return <AlertCircle className="h-4 w-4 text-red-500" />
      default:
        return <Clock className="h-4 w-4 text-gray-500" />
    }
  }

  const getResourceStatus = (resource: any) => {
    if (type === "pods") {
      return resource.status.phase
    } else if (type === "deployments") {
      return resource.status.readyReplicas === resource.status.replicas ? "Ready" : "Pending"
    } else {
      return "Active"
    }
  }

  const handleDelete = async (resource: any) => {
    try {
      await deleteResource(clusterId, type, resource.metadata.name, namespace)
      toast({
        title: "Resource deleted",
        description: `${type.slice(0, -1)} "${resource.metadata.name}" has been deleted`,
      })
    } catch (error) {
      toast({
        title: "Error deleting resource",
        description: error instanceof Error ? error.message : "Unknown error occurred",
        variant: "destructive",
      })
    }
  }

  const getColumns = () => {
    switch (type) {
      case "pods":
        return ["Name", "Status", "Node", "Age", "IP", "Actions"]
      case "deployments":
        return ["Name", "Status", "Replicas", "Age", "Actions"]
      case "services":
        return ["Name", "Type", "Cluster IP", "External IP", "Ports", "Age", "Actions"]
      case "nodes":
        return ["Name", "Status", "Roles", "Age", "Version", "Internal IP", "Actions"]
      default:
        return ["Name", "Age", "Actions"]
    }
  }

  const renderResourceDetails = (resource: any) => {
    return (
      <pre className="bg-muted p-4 rounded-md overflow-auto max-h-[500px] text-xs">
        {JSON.stringify(resource, null, 2)}
      </pre>
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="relative w-64">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search resources..."
            className="pl-8"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="text-sm text-muted-foreground">
          {filteredResources.length} {type}
        </div>
      </div>

      <div className="border rounded-md">
        <Table>
          <TableHeader>
            <TableRow>
              {getColumns().map((column) => (
                <TableHead key={column}>{column}</TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={getColumns().length} className="h-24 text-center">
                  Loading...
                </TableCell>
              </TableRow>
            ) : filteredResources.length === 0 ? (
              <TableRow>
                <TableCell colSpan={getColumns().length} className="h-24 text-center">
                  No {type} found
                </TableCell>
              </TableRow>
            ) : (
              filteredResources.map((resource) => (
                <TableRow key={resource.metadata.uid}>
                  <TableCell className="font-medium">{resource.metadata.name}</TableCell>
                  {type === "pods" && (
                    <>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          {getStatusIcon(resource.status.phase)}
                          <span>{resource.status.phase}</span>
                        </div>
                      </TableCell>
                      <TableCell>{resource.spec.nodeName}</TableCell>
                      <TableCell>{resource.metadata.creationTimestamp}</TableCell>
                      <TableCell>{resource.status.podIP}</TableCell>
                    </>
                  )}
                  {type === "deployments" && (
                    <>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          {getStatusIcon(getResourceStatus(resource))}
                          <span>{getResourceStatus(resource)}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        {resource.status.readyReplicas || 0}/{resource.status.replicas}
                      </TableCell>
                      <TableCell>{resource.metadata.creationTimestamp}</TableCell>
                    </>
                  )}
                  {/* Similar cells for other resource types */}
                  <TableCell>
                    <Dialog
                      open={detailsOpen && selectedResource?.metadata.uid === resource.metadata.uid}
                      onOpenChange={(open) => !open && setDetailsOpen(false)}
                    >
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuLabel>Actions</DropdownMenuLabel>
                          <DropdownMenuItem
                            onClick={() => {
                              setSelectedResource(resource)
                              setDetailsOpen(true)
                            }}
                          >
                            View Details
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem className="text-red-600" onClick={() => handleDelete(resource)}>
                            <Trash2 className="h-4 w-4 mr-2" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                      <DialogContent className="max-w-3xl">
                        <DialogHeader>
                          <DialogTitle>{resource.metadata.name} Details</DialogTitle>
                        </DialogHeader>
                        {renderResourceDetails(resource)}
                      </DialogContent>
                    </Dialog>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}

