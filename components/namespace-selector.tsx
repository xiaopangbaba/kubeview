"use client"

import { useState, useEffect } from "react"
import { Check, ChevronsUpDown } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { fetchNamespaces } from "@/lib/kubernetes-api"
import { useToast } from "@/hooks/use-toast"

interface NamespaceSelectorProps {
  value: string
  onChange: (value: string) => void
  clusterId: string
}

export function NamespaceSelector({ value, onChange, clusterId }: NamespaceSelectorProps) {
  const [open, setOpen] = useState(false)
  const [namespaces, setNamespaces] = useState<string[]>([])
  const { toast } = useToast()

  useEffect(() => {
    if (clusterId) {
      loadNamespaces()
    }
  }, [clusterId])

  const loadNamespaces = async () => {
    try {
      const namespaceList = await fetchNamespaces(clusterId)
      setNamespaces(namespaceList)
    } catch (error) {
      toast({
        title: "Error loading namespaces",
        description: error instanceof Error ? error.message : "Unknown error occurred",
        variant: "destructive",
      })
    }
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="min-w-[150px] justify-between"
          disabled={!clusterId}
        >
          {value || "default"}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0">
        <Command>
          <CommandInput placeholder="Search namespaces..." />
          <CommandList>
            <CommandEmpty>No namespaces found.</CommandEmpty>
            <CommandGroup>
              {namespaces.map((namespace) => (
                <CommandItem
                  key={namespace}
                  value={namespace}
                  onSelect={(currentValue) => {
                    onChange(currentValue)
                    setOpen(false)
                  }}
                >
                  <Check className={`mr-2 h-4 w-4 ${value === namespace ? "opacity-100" : "opacity-0"}`} />
                  {namespace}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}

