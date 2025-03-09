"use client"

import { createContext, useContext, useEffect, useState, type ReactNode } from "react"
import { useRouter, usePathname } from "next/navigation"

interface User {
  username: string
  role: string
}

interface AuthContextType {
  user: User | null
  isLoading: boolean
  login: (username: string, password: string) => Promise<void>
  logout: () => void
  hasPermission: (permission: string) => boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    // Check if user is logged in
    const checkAuth = () => {
      const authData = localStorage.getItem("kubeview-auth")

      if (!authData) {
        setUser(null)
        setIsLoading(false)

        // Redirect to login if not on login page
        if (pathname !== "/login") {
          router.push("/login")
        }
        return
      }

      try {
        const { user, expiresAt } = JSON.parse(authData)

        // Check if token is expired
        if (expiresAt && expiresAt < Date.now()) {
          localStorage.removeItem("kubeview-auth")
          setUser(null)
          setIsLoading(false)

          if (pathname !== "/login") {
            router.push("/login")
          }
          return
        }

        setUser(user)
        setIsLoading(false)
      } catch (error) {
        console.error("Error parsing auth data:", error)
        localStorage.removeItem("kubeview-auth")
        setUser(null)
        setIsLoading(false)

        if (pathname !== "/login") {
          router.push("/login")
        }
      }
    }

    checkAuth()
  }, [pathname, router])

  const login = async (username: string, password: string) => {
    setIsLoading(true)

    // In a real app, this would be an API call
    if (username === "admin" && password === "password") {
      const userData = {
        username,
        role: "admin",
      }

      localStorage.setItem(
        "kubeview-auth",
        JSON.stringify({
          user: userData,
          token: "demo-token-" + Math.random().toString(36).substring(2),
          expiresAt: Date.now() + 24 * 60 * 60 * 1000, // 24 hours
        }),
      )

      setUser(userData)
      setIsLoading(false)
      router.push("/")
    } else {
      throw new Error("Invalid credentials")
    }
  }

  const logout = () => {
    localStorage.removeItem("kubeview-auth")
    setUser(null)
    router.push("/login")
  }

  // Simple permission check based on user role
  const hasPermission = (permission: string) => {
    if (!user) return false

    // Admin has all permissions
    if (user.role === "admin") return true

    // For demo purposes, we'll use a simple permission model
    // In a real app, this would be more sophisticated
    const rolePermissions: Record<string, string[]> = {
      viewer: ["view"],
      editor: ["view", "edit"],
      admin: ["view", "edit", "delete", "admin"],
    }

    return rolePermissions[user.role]?.includes(permission) || false
  }

  return (
    <AuthContext.Provider value={{ user, isLoading, login, logout, hasPermission }}>{children}</AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}

