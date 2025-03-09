"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Chart,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartAreaSeries,
  ChartArea,
  ChartAxisOptions,
  ChartAxis,
  ChartLine,
  ChartLineSeries,
} from "@/components/ui/chart"
import { generateResourceData } from "@/lib/demo-data"

interface ResourceData {
  timestamp: string
  cpu: number
  memory: number
  pods: number
}

export function ResourceUsageChart() {
  const [timeRange, setTimeRange] = useState("1h")
  const [data, setData] = useState<ResourceData[]>([])
  const [selectedNode, setSelectedNode] = useState("all")

  useEffect(() => {
    // In a real app, this would fetch data from an API
    // For demo purposes, we'll generate random data
    setData(generateResourceData(timeRange))

    // Set up polling for real-time updates
    const intervalId = setInterval(() => {
      setData(generateResourceData(timeRange))
    }, 30000)

    return () => clearInterval(intervalId)
  }, [timeRange])

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
  }

  const formatCPU = (value: number) => {
    return `${value.toFixed(1)}%`
  }

  const formatMemory = (value: number) => {
    return `${value.toFixed(1)}%`
  }

  const formatPods = (value: number) => {
    return Math.round(value).toString()
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Resource Usage</CardTitle>
          <CardDescription>Monitor CPU, memory, and pod usage over time</CardDescription>
        </div>
        <div className="flex items-center space-x-2">
          <Select value={selectedNode} onValueChange={setSelectedNode}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select node" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Nodes</SelectItem>
              <SelectItem value="worker-1">worker-1</SelectItem>
              <SelectItem value="worker-2">worker-2</SelectItem>
              <SelectItem value="worker-3">worker-3</SelectItem>
            </SelectContent>
          </Select>
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="w-[100px]">
              <SelectValue placeholder="Time range" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="1h">1 hour</SelectItem>
              <SelectItem value="6h">6 hours</SelectItem>
              <SelectItem value="24h">24 hours</SelectItem>
              <SelectItem value="7d">7 days</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="cpu">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="cpu">CPU</TabsTrigger>
            <TabsTrigger value="memory">Memory</TabsTrigger>
            <TabsTrigger value="pods">Pods</TabsTrigger>
          </TabsList>

          <TabsContent value="cpu" className="space-y-4">
            <div className="h-[300px]">
              <ChartContainer>
                <Chart>
                  <ChartAxisOptions
                    x={{
                      type: "time",
                      tickFormat: formatDate,
                    }}
                    y={{
                      tickFormat: formatCPU,
                    }}
                  />
                  <ChartAreaSeries data={data} xKey="timestamp" yKey="cpu" colorKey="cpu">
                    {({ areas }) => (
                      <>
                        <ChartAxis position="bottom" />
                        <ChartAxis position="left" />
                        {areas.map(({ curve, area }, index) => (
                          <g key={index}>
                            <ChartArea fill="url(#cpu-gradient)" opacity={0.5} path={area} />
                            <ChartLine stroke="hsl(var(--primary))" strokeWidth={2} path={curve} />
                          </g>
                        ))}
                        <defs>
                          <linearGradient id="cpu-gradient" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor="hsl(var(--primary))" stopOpacity={0.5} />
                            <stop offset="100%" stopColor="hsl(var(--primary))" stopOpacity={0} />
                          </linearGradient>
                        </defs>
                      </>
                    )}
                  </ChartAreaSeries>
                  <ChartTooltip>
                    {({ point }) => {
                      if (!point) return null
                      return (
                        <ChartTooltipContent>
                          <div className="flex flex-col gap-2">
                            <div className="flex items-center gap-2">
                              <div className="h-2 w-2 rounded-full bg-primary" />
                              <span className="font-medium">CPU Usage</span>
                            </div>
                            <div className="flex gap-4">
                              <div className="flex flex-col">
                                <span className="text-sm text-muted-foreground">Time</span>
                                <span>{formatDate(point.data.timestamp as string)}</span>
                              </div>
                              <div className="flex flex-col">
                                <span className="text-sm text-muted-foreground">Value</span>
                                <span>{formatCPU(point.data.cpu as number)}</span>
                              </div>
                            </div>
                          </div>
                        </ChartTooltipContent>
                      )
                    }}
                  </ChartTooltip>
                </Chart>
              </ChartContainer>
            </div>
          </TabsContent>

          <TabsContent value="memory" className="space-y-4">
            <div className="h-[300px]">
              <ChartContainer>
                <Chart>
                  <ChartAxisOptions
                    x={{
                      type: "time",
                      tickFormat: formatDate,
                    }}
                    y={{
                      tickFormat: formatMemory,
                    }}
                  />
                  <ChartAreaSeries data={data} xKey="timestamp" yKey="memory" colorKey="memory">
                    {({ areas }) => (
                      <>
                        <ChartAxis position="bottom" />
                        <ChartAxis position="left" />
                        {areas.map(({ curve, area }, index) => (
                          <g key={index}>
                            <ChartArea fill="url(#memory-gradient)" opacity={0.5} path={area} />
                            <ChartLine stroke="hsl(var(--primary))" strokeWidth={2} path={curve} />
                          </g>
                        ))}
                        <defs>
                          <linearGradient id="memory-gradient" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor="hsl(var(--primary))" stopOpacity={0.5} />
                            <stop offset="100%" stopColor="hsl(var(--primary))" stopOpacity={0} />
                          </linearGradient>
                        </defs>
                      </>
                    )}
                  </ChartAreaSeries>
                  <ChartTooltip>
                    {({ point }) => {
                      if (!point) return null
                      return (
                        <ChartTooltipContent>
                          <div className="flex flex-col gap-2">
                            <div className="flex items-center gap-2">
                              <div className="h-2 w-2 rounded-full bg-primary" />
                              <span className="font-medium">Memory Usage</span>
                            </div>
                            <div className="flex gap-4">
                              <div className="flex flex-col">
                                <span className="text-sm text-muted-foreground">Time</span>
                                <span>{formatDate(point.data.timestamp as string)}</span>
                              </div>
                              <div className="flex flex-col">
                                <span className="text-sm text-muted-foreground">Value</span>
                                <span>{formatMemory(point.data.memory as number)}</span>
                              </div>
                            </div>
                          </div>
                        </ChartTooltipContent>
                      )
                    }}
                  </ChartTooltip>
                </Chart>
              </ChartContainer>
            </div>
          </TabsContent>

          <TabsContent value="pods" className="space-y-4">
            <div className="h-[300px]">
              <ChartContainer>
                <Chart>
                  <ChartAxisOptions
                    x={{
                      type: "time",
                      tickFormat: formatDate,
                    }}
                    y={{
                      tickFormat: formatPods,
                    }}
                  />
                  <ChartLineSeries data={data} xKey="timestamp" yKey="pods" colorKey="pods">
                    {({ lines }) => (
                      <>
                        <ChartAxis position="bottom" />
                        <ChartAxis position="left" />
                        {lines.map(({ curve }, index) => (
                          <ChartLine key={index} stroke="hsl(var(--primary))" strokeWidth={2} path={curve} />
                        ))}
                      </>
                    )}
                  </ChartLineSeries>
                  <ChartTooltip>
                    {({ point }) => {
                      if (!point) return null
                      return (
                        <ChartTooltipContent>
                          <div className="flex flex-col gap-2">
                            <div className="flex items-center gap-2">
                              <div className="h-2 w-2 rounded-full bg-primary" />
                              <span className="font-medium">Pod Count</span>
                            </div>
                            <div className="flex gap-4">
                              <div className="flex flex-col">
                                <span className="text-sm text-muted-foreground">Time</span>
                                <span>{formatDate(point.data.timestamp as string)}</span>
                              </div>
                              <div className="flex flex-col">
                                <span className="text-sm text-muted-foreground">Value</span>
                                <span>{formatPods(point.data.pods as number)}</span>
                              </div>
                            </div>
                          </div>
                        </ChartTooltipContent>
                      )
                    }}
                  </ChartTooltip>
                </Chart>
              </ChartContainer>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}

