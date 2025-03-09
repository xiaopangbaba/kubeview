// Generate random resource usage data for demo purposes
export function generateResourceData(timeRange: string) {
  const now = new Date()
  const data = []

  let points = 0
  let interval = 0

  switch (timeRange) {
    case "1h":
      points = 60
      interval = 60 * 1000 // 1 minute
      break
    case "6h":
      points = 72
      interval = 5 * 60 * 1000 // 5 minutes
      break
    case "24h":
      points = 96
      interval = 15 * 60 * 1000 // 15 minutes
      break
    case "7d":
      points = 168
      interval = 60 * 60 * 1000 // 1 hour
      break
    default:
      points = 60
      interval = 60 * 1000 // 1 minute
  }

  // Base values with some randomness
  const cpuBase = 40 + Math.random() * 20
  const memoryBase = 50 + Math.random() * 20
  const podsBase = 20 + Math.random() * 10

  // Generate data points
  for (let i = points - 1; i >= 0; i--) {
    const timestamp = new Date(now.getTime() - i * interval)

    // Add some randomness and trends
    const cpuNoise = Math.sin(i / 10) * 10 + (Math.random() * 5 - 2.5)
    const memoryNoise = Math.cos(i / 15) * 8 + (Math.random() * 4 - 2)
    const podsNoise = Math.random() * 2 - 1

    // Ensure values stay within reasonable ranges
    const cpu = Math.max(5, Math.min(95, cpuBase + cpuNoise))
    const memory = Math.max(10, Math.min(90, memoryBase + memoryNoise))
    const pods = Math.max(5, Math.min(50, podsBase + podsNoise))

    data.push({
      timestamp: timestamp.toISOString(),
      cpu,
      memory,
      pods,
    })
  }

  return data
}

// Generate alert thresholds for demo purposes
export function generateAlertThresholds() {
  return {
    cpu: {
      warning: 70,
      critical: 85,
    },
    memory: {
      warning: 75,
      critical: 90,
    },
    pods: {
      warning: 80, // percentage of pod limit
      critical: 95,
    },
  }
}

// Generate node data for demo purposes
export function generateNodeData() {
  return [
    {
      name: "worker-1",
      status: "Ready",
      cpu: {
        capacity: "4",
        used: 2.7,
        percentage: 67.5,
      },
      memory: {
        capacity: "16Gi",
        used: "10.2Gi",
        percentage: 63.75,
      },
      pods: {
        capacity: 110,
        used: 76,
        percentage: 69.1,
      },
      age: "45d",
    },
    {
      name: "worker-2",
      status: "Ready",
      cpu: {
        capacity: "8",
        used: 5.4,
        percentage: 67.5,
      },
      memory: {
        capacity: "32Gi",
        used: "24.8Gi",
        percentage: 77.5,
      },
      pods: {
        capacity: 110,
        used: 92,
        percentage: 83.6,
      },
      age: "45d",
    },
    {
      name: "worker-3",
      status: "Ready",
      cpu: {
        capacity: "8",
        used: 3.2,
        percentage: 40,
      },
      memory: {
        capacity: "32Gi",
        used: "18.6Gi",
        percentage: 58.1,
      },
      pods: {
        capacity: 110,
        used: 54,
        percentage: 49.1,
      },
      age: "15d",
    },
  ]
}

