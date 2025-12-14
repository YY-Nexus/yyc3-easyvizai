"use client"

// YYC³ EasyVizAI API Hooks
import { useState, useEffect, useCallback } from "react"
import { apiFactory, type ApiResponse } from "@/lib/api-factory"

export function useApi<T>(apiCall: () => Promise<ApiResponse<T>>, dependencies: any[] = []) {
  const [data, setData] = useState<T | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const execute = useCallback(async () => {
    setLoading(true)
    setError(null)

    try {
      const response = await apiCall()
      if (response.success) {
        setData(response.data || null)
      } else {
        setError(response.message || "请求失败")
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "未知错误")
    } finally {
      setLoading(false)
    }
  }, dependencies)

  useEffect(() => {
    execute()
  }, [execute])

  return { data, loading, error, refetch: execute }
}

export function useAuth() {
  const [user, setUser] = useState(null)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    checkAuthStatus()
  }, [])

  const checkAuthStatus = async () => {
    try {
      const response = await apiFactory.getCurrentUser()
      if (response.success) {
        setUser(response.data)
        setIsAuthenticated(true)
      }
    } catch (error) {
      console.error("认证检查失败:", error)
    } finally {
      setLoading(false)
    }
  }

  const login = async (username: string, password: string) => {
    const response = await apiFactory.login(username, password)
    if (response.success) {
      setUser(response.data?.user || null)
      setIsAuthenticated(true)
    }
    return response
  }

  const logout = async () => {
    await apiFactory.logout()
    setUser(null)
    setIsAuthenticated(false)
  }

  return {
    user,
    isAuthenticated,
    loading,
    login,
    logout,
    refetch: checkAuthStatus,
  }
}

export function useCodeGeneration() {
  const [isGenerating, setIsGenerating] = useState(false)
  const [generatedCode, setGeneratedCode] = useState("")
  const [qualityAnalysis, setQualityAnalysis] = useState(null)

  const generateCode = async (params: {
    prompt: string
    tech_stack: "react" | "vue" | "svelte"
    viz_type: "2d" | "3d" | "dashboard"
  }) => {
    setIsGenerating(true)
    try {
      const response = await apiFactory.generateCode({
        ...params,
        brand_theme: true,
      })

      if (response.success && response.data) {
        setGeneratedCode(response.data.code)

        // 自动分析代码质量
        const qualityResponse = await apiFactory.analyzeCodeQuality(response.data.code)
        if (qualityResponse.success) {
          setQualityAnalysis(qualityResponse.data)
        }
      }

      return response
    } finally {
      setIsGenerating(false)
    }
  }

  const optimizeCode = async (optimizationType: "performance" | "accessibility" | "brand") => {
    if (!generatedCode) return null

    const response = await apiFactory.optimizeCode(generatedCode, optimizationType)
    if (response.success && response.data) {
      setGeneratedCode(response.data.optimized_code)
    }
    return response
  }

  return {
    isGenerating,
    generatedCode,
    qualityAnalysis,
    generateCode,
    optimizeCode,
    setGeneratedCode,
  }
}

export function useSystemMetrics() {
  const {
    data: metrics,
    loading,
    error,
    refetch,
  } = useApi(
    () =>
      apiFactory.getSystemMetrics({
        start_time: new Date(Date.now() - 3600000).toISOString(), // 最近1小时
        end_time: new Date().toISOString(),
      }),
    [],
  )

  const [realTimeMetrics, setRealTimeMetrics] = useState({
    cpu: 0,
    memory: 0,
    disk: 0,
    network: 0,
  })

  useEffect(() => {
    // 模拟实时指标更新
    const interval = setInterval(() => {
      setRealTimeMetrics({
        cpu: Math.random() * 100,
        memory: Math.random() * 100,
        disk: Math.random() * 100,
        network: Math.random() * 1000,
      })
    }, 5000)

    return () => clearInterval(interval)
  }, [])

  return {
    metrics,
    realTimeMetrics,
    loading,
    error,
    refetch,
  }
}

export function useTemplates(filters?: {
  category?: string
  tech_stack?: string
  viz_type?: string
}) {
  const { data, loading, error, refetch } = useApi(() => apiFactory.getCodeTemplates(filters), [filters])

  const saveTemplate = async (template: any) => {
    const response = await apiFactory.saveTemplate(template)
    if (response.success) {
      refetch() // 刷新模板列表
    }
    return response
  }

  return {
    templates: data?.templates || [],
    total: data?.total || 0,
    loading,
    error,
    refetch,
    saveTemplate,
  }
}
