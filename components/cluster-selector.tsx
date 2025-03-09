"use client"

import { useState, useEffect } from "react"
import { Check, ChevronsUpDown, PlusCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { fetchClusters, addCluster } from "@/lib/kubernetes-api"
import { useToast } from "@/hooks/use-toast"

interface ClusterSelectorProps {
  value: string
  onChange: (value: string) => void
}

export function ClusterSelector({ value, onChange }: ClusterSelectorProps) {
  const [open, setOpen] = useState(false)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [clusters, setClusters] = useState<{ id: string; name: string }[]>([])
  const [newClusterName, setNewClusterName] = useState("")
  const [newClusterConfig, setNewClusterConfig] = useState("")
  const { toast } = useToast()

  useEffect(() => {
    loadClusters()
  }, [])

  const loadClusters = async () => {
    try {
      const clusterList = await fetchClusters()
      setClusters(clusterList)

      // Auto-select first cluster if none selected
      if (clusterList.length > 0 && !value) {
        onChange(clusterList[0].id)
      }
    } catch (error) {
      toast({
        title: "Error loading clusters",
        description: error instanceof Error ? error.message : "Unknown error occurred",
        variant: "destructive",
      })
    }
  }

  const handleAddCluster = async () => {
    if (!newClusterName || !newClusterConfig) {
      toast({
        title: "Invalid input",
        description: "Please provide both name and kubeconfig",
        variant: "destructive",
      })
      return
    }

    try {
      const newCluster = await addCluster(newClusterName, newClusterConfig)
      setClusters([...clusters, newCluster])
      setNewClusterName("")
      setNewClusterConfig("")
      setDialogOpen(false)
      toast({
        title: "Cluster added",
        description: `Cluster "${newClusterName}" has been added successfully`,
      })
    } catch (error) {
      toast({
        title: "Error adding cluster",
        description: error instanceof Error ? error.message : "Unknown error occurred",
        variant: "destructive",
      })
    }
  }

  return (
    <div className="flex items-center space-x-2">
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button variant="outline" role="combobox" aria-expanded={open} className="min-w-[200px] justify-between">
            {value ? clusters.find((cluster) => cluster.id === value)?.name : "Select cluster..."}
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[200px] p-0">
          <Command>
            <CommandInput placeholder="Search clusters..." />
            <CommandList>
              <CommandEmpty>No clusters found.</CommandEmpty>
              <CommandGroup>
                {clusters.map((cluster) => (
                  <CommandItem
                    key={cluster.id}
                    value={cluster.id}
                    onSelect={(currentValue) => {
                      onChange(currentValue)
                      setOpen(false)
                    }}
                  >
                    <Check className={`mr-2 h-4 w-4 ${value === cluster.id ? "opacity-100" : "opacity-0"}`} />
                    {cluster.name}
                  </CommandItem>
                ))}
              </CommandGroup>
              <CommandSeparator />
              <CommandGroup>
                <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                  <DialogTrigger asChild>
                    <CommandItem
                      onSelect={() => {
                        setOpen(false)
                        setDialogOpen(true)
                      }}
                    >
                      <PlusCircle className="mr-2 h-4 w-4" />
                      Add Cluster
                    </CommandItem>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Add New Cluster</DialogTitle>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                      <div className="grid gap-2">
                        <Label htmlFor="name">Cluster Name</Label>
                        <Input
                          id="name"
                          value={newClusterName}
                          onChange={(e) => setNewClusterName(e.target.value)}
                          placeholder="Production Cluster"
                        />
                      </div>
                      <div className="grid gap-2">
                        <Label htmlFor="kubeconfig">Kubeconfig</Label>
                        <textarea
                          id="kubeconfig"
                          value={newClusterConfig}
                          onChange={(e) => setNewClusterConfig(e.target.value)}
                          className="min-h-[150px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                          placeholder="Paste your kubeconfig here..."
                        />
                      </div>
                    </div>
                    <div className="flex justify-end">
                      <Button onClick={handleAddCluster}>Add Cluster</Button>
                    </div>
                  </DialogContent>
                </Dialog>
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    </div>
  )
}

