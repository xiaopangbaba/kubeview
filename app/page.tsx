import { Dashboard } from "@/components/dashboard"

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      <header className="border-b bg-background">
        <div className="flex h-16 items-center px-4 md:px-6">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-full bg-primary flex items-center justify-center text-primary-foreground font-bold">
              K
            </div>
            <span className="text-xl font-bold">KubeView</span>
          </div>
        </div>
      </header>
      <main className="flex-1 flex">
        <Dashboard />
      </main>
    </div>
  )
}

