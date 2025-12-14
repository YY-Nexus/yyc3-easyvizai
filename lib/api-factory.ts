// API 响应基础类型
interface ApiResponse<T = any> {
  success: boolean
  data?: T
  message?: string
  code?: number
  timestamp: string
}

// 认证相关类型
interface AuthTokens {
  access_token: string
  refresh_token: string
  expires_in: number
}

interface UserProfile {
  user_id: string
  username: string
  email: string
  avatar_url?: string
  roles: string[]
  permissions: string[]
}

// 应用管理类型
interface Application {
  app_id: string
  app_name: string
  display_name: string
  category: string
  version: string
  status: "not_installed" | "installed" | "enabled" | "disabled"
  config: Record<string, any>
}

// 可视化代码模板类型
interface CodeTemplate {
  template_id: string
  name: string
  description: string
  tech_stack: string
  viz_type: "2d" | "3d" | "dashboard"
  code_content: string
  brand_compliant: boolean
  usage_count: number
  created_at: string
}

// 系统监控指标类型
interface SystemMetrics {
  metric_type: "cpu" | "memory" | "disk" | "network"
  metric_value: number
  unit: string
  timestamp: string
  host_id?: string
}

class YYCApiFactory {
  private baseUrl: string
  private accessToken: string | null = null
  private refreshToken: string | null = null

  constructor(baseUrl = "/api") {
    this.baseUrl = baseUrl
    this.loadTokensFromStorage()
  }

  private loadTokensFromStorage() {
    if (typeof window !== "undefined") {
      this.accessToken = localStorage.getItem("yyc_access_token")
      this.refreshToken = localStorage.getItem("yyc_refresh_token")
    }
  }

  private saveTokensToStorage(tokens: AuthTokens) {
    if (typeof window !== "undefined") {
      localStorage.setItem("yyc_access_token", tokens.access_token)
      localStorage.setItem("yyc_refresh_token", tokens.refresh_token)
      this.accessToken = tokens.access_token
      this.refreshToken = tokens.refresh_token
    }
  }

  private clearTokensFromStorage() {
    if (typeof window !== "undefined") {
      localStorage.removeItem("yyc_access_token")
      localStorage.removeItem("yyc_refresh_token")
      this.accessToken = null
      this.refreshToken = null
    }
  }

  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<ApiResponse<T>> {
    const url = `${this.baseUrl}${endpoint}`

    const headers: HeadersInit = {
      "Content-Type": "application/json",
      ...options.headers,
    }

    // 添加认证头
    if (this.accessToken) {
      headers["Authorization"] = `Bearer ${this.accessToken}`
    }

    try {
      const response = await fetch(url, {
        ...options,
        headers,
      })

      // 处理401未授权错误，尝试刷新令牌
      if (response.status === 401 && this.refreshToken) {
        const refreshed = await this.refreshAccessToken()
        if (refreshed) {
          // 重新发送原始请求
          headers["Authorization"] = `Bearer ${this.accessToken}`
          const retryResponse = await fetch(url, { ...options, headers })
          return await retryResponse.json()
        }
      }

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || `HTTP ${response.status}`)
      }

      return {
        success: true,
        data: data.data || data,
        message: data.message,
        code: response.status,
        timestamp: new Date().toISOString(),
      }
    } catch (error) {
      console.error(`API请求失败 [${endpoint}]:`, error)
      return {
        success: false,
        message: error instanceof Error ? error.message : "未知错误",
        code: 500,
        timestamp: new Date().toISOString(),
      }
    }
  }

  // ==================== 认证服务 ====================

  async login(username: string, password: string): Promise<ApiResponse<AuthTokens & { user: UserProfile }>> {
    const response = await this.request<AuthTokens & { user: UserProfile }>("/auth/login", {
      method: "POST",
      body: JSON.stringify({ username, password }),
    })

    if (response.success && response.data) {
      this.saveTokensToStorage(response.data)
    }

    return response
  }

  async logout(): Promise<ApiResponse> {
    const response = await this.request("/auth/logout", { method: "POST" })
    this.clearTokensFromStorage()
    return response
  }

  async refreshAccessToken(): Promise<boolean> {
    if (!this.refreshToken) return false

    try {
      const response = await fetch(`${this.baseUrl}/auth/refresh`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ refresh_token: this.refreshToken }),
      })

      if (response.ok) {
        const data = await response.json()
        this.saveTokensToStorage(data)
        return true
      }
    } catch (error) {
      console.error("刷新令牌失败:", error)
    }

    this.clearTokensFromStorage()
    return false
  }

  async getCurrentUser(): Promise<ApiResponse<UserProfile>> {
    return this.request<UserProfile>("/auth/me")
  }

  // ==================== 应用管理服务 ====================

  async getApplications(category?: string): Promise<ApiResponse<Application[]>> {
    const params = category ? `?category=${category}` : ""
    return this.request<Application[]>(`/apps${params}`)
  }

  async installApplication(appId: string): Promise<ApiResponse> {
    return this.request(`/apps/${appId}/install`, { method: "POST" })
  }

  async uninstallApplication(appId: string): Promise<ApiResponse> {
    return this.request(`/apps/${appId}/uninstall`, { method: "POST" })
  }

  async startApplication(appId: string): Promise<ApiResponse> {
    return this.request(`/apps/${appId}/start`, { method: "POST" })
  }

  async stopApplication(appId: string): Promise<ApiResponse> {
    return this.request(`/apps/${appId}/stop`, { method: "POST" })
  }

  async updateApplicationConfig(appId: string, config: Record<string, any>): Promise<ApiResponse> {
    return this.request(`/apps/${appId}/config`, {
      method: "PUT",
      body: JSON.stringify({ config }),
    })
  }

  // ==================== AI代码生成服务 ====================

  async generateCode(params: {
    prompt: string
    tech_stack: "react" | "vue" | "svelte"
    viz_type: "2d" | "3d" | "dashboard"
    brand_theme?: boolean
  }): Promise<ApiResponse<{ code: string; template_id: string; quality_score: number }>> {
    return this.request("/ai/generate-code", {
      method: "POST",
      body: JSON.stringify(params),
    })
  }

  async analyzeCodeQuality(code: string): Promise<
    ApiResponse<{
      brand_compliant: boolean
      performance_score: number
      accessibility_score: number
      issues: Array<{ type: string; message: string; line?: number }>
    }>
  > {
    return this.request("/ai/analyze-code", {
      method: "POST",
      body: JSON.stringify({ code }),
    })
  }

  async optimizeCode(
    code: string,
    optimization_type: "performance" | "accessibility" | "brand",
  ): Promise<ApiResponse<{ optimized_code: string; improvements: string[] }>> {
    return this.request("/ai/optimize-code", {
      method: "POST",
      body: JSON.stringify({ code, optimization_type }),
    })
  }

  // ==================== 代码模板库服务 ====================

  async getCodeTemplates(params?: {
    category?: string
    tech_stack?: string
    viz_type?: string
    page?: number
    limit?: number
  }): Promise<ApiResponse<{ templates: CodeTemplate[]; total: number; page: number }>> {
    const searchParams = new URLSearchParams()
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined) searchParams.append(key, value.toString())
      })
    }

    const query = searchParams.toString()
    return this.request<{ templates: CodeTemplate[]; total: number; page: number }>(
      `/templates${query ? `?${query}` : ""}`,
    )
  }

  async getTemplateById(templateId: string): Promise<ApiResponse<CodeTemplate>> {
    return this.request<CodeTemplate>(`/templates/${templateId}`)
  }

  async saveTemplate(
    template: Omit<CodeTemplate, "template_id" | "created_at" | "usage_count">,
  ): Promise<ApiResponse<{ template_id: string }>> {
    return this.request("/templates", {
      method: "POST",
      body: JSON.stringify(template),
    })
  }

  async updateTemplate(templateId: string, updates: Partial<CodeTemplate>): Promise<ApiResponse> {
    return this.request(`/templates/${templateId}`, {
      method: "PUT",
      body: JSON.stringify(updates),
    })
  }

  async deleteTemplate(templateId: string): Promise<ApiResponse> {
    return this.request(`/templates/${templateId}`, { method: "DELETE" })
  }

  // ==================== 系统监控服务 ====================

  async getSystemMetrics(params?: {
    metric_type?: string
    start_time?: string
    end_time?: string
    host_id?: string
  }): Promise<ApiResponse<SystemMetrics[]>> {
    const searchParams = new URLSearchParams()
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined) searchParams.append(key, value)
      })
    }

    const query = searchParams.toString()
    return this.request<SystemMetrics[]>(`/monitoring/metrics${query ? `?${query}` : ""}`)
  }

  async getApplicationMetrics(appId: string): Promise<
    ApiResponse<{
      cpu_usage: number
      memory_usage: number
      network_io: number
      request_count: number
      error_rate: number
    }>
  > {
    return this.request(`/monitoring/apps/${appId}/metrics`)
  }

  async createAlertRule(rule: {
    rule_name: string
    metric_type: string
    condition: string
    severity: "info" | "warning" | "critical"
    notification_channels: string[]
  }): Promise<ApiResponse<{ rule_id: string }>> {
    return this.request("/monitoring/alerts/rules", {
      method: "POST",
      body: JSON.stringify(rule),
    })
  }

  // ==================== 文件存储服务 ====================

  async uploadFile(
    file: File,
    path?: string,
  ): Promise<ApiResponse<{ file_id: string; file_path: string; file_url: string }>> {
    const formData = new FormData()
    formData.append("file", file)
    if (path) formData.append("path", path)

    return this.request("/storage/upload", {
      method: "POST",
      body: formData,
      headers: {}, // 让浏览器自动设置Content-Type
    })
  }

  async getFiles(params?: {
    parent_id?: string
    file_type?: string
    page?: number
    limit?: number
  }): Promise<
    ApiResponse<{
      files: Array<{
        file_id: string
        file_name: string
        file_path: string
        file_size: number
        file_type: string
        is_directory: boolean
        created_at: string
      }>
      total: number
    }>
  > {
    const searchParams = new URLSearchParams()
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined) searchParams.append(key, value.toString())
      })
    }

    const query = searchParams.toString()
    return this.request(`/storage/files${query ? `?${query}` : ""}`)
  }

  async deleteFile(fileId: string): Promise<ApiResponse> {
    return this.request(`/storage/files/${fileId}`, { method: "DELETE" })
  }

  // ==================== 容器管理服务 ====================

  async getContainers(): Promise<
    ApiResponse<
      Array<{
        container_id: string
        container_name: string
        image_name: string
        status: string
        created_at: string
        ports: Record<string, any>
      }>
    >
  > {
    return this.request("/containers")
  }

  async createContainer(config: {
    container_name: string
    image_name: string
    image_tag?: string
    ports?: Record<string, any>
    environment?: Record<string, string>
    volumes?: Record<string, any>
  }): Promise<ApiResponse<{ container_id: string }>> {
    return this.request("/containers", {
      method: "POST",
      body: JSON.stringify(config),
    })
  }

  async startContainer(containerId: string): Promise<ApiResponse> {
    return this.request(`/containers/${containerId}/start`, { method: "POST" })
  }

  async stopContainer(containerId: string): Promise<ApiResponse> {
    return this.request(`/containers/${containerId}/stop`, { method: "POST" })
  }

  async getContainerLogs(
    containerId: string,
    params?: {
      lines?: number
      since?: string
    },
  ): Promise<
    ApiResponse<
      Array<{
        timestamp: string
        log_level: string
        log_message: string
      }>
    >
  > {
    const searchParams = new URLSearchParams()
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined) searchParams.append(key, value.toString())
      })
    }

    const query = searchParams.toString()
    return this.request(`/containers/${containerId}/logs${query ? `?${query}` : ""}`)
  }

  // ==================== 系统配置服务 ====================

  async getSystemConfig(): Promise<ApiResponse<Record<string, any>>> {
    return this.request("/config/system")
  }

  async updateSystemConfig(config: Record<string, any>): Promise<ApiResponse> {
    return this.request("/config/system", {
      method: "PUT",
      body: JSON.stringify(config),
    })
  }

  async getUserConfig(): Promise<ApiResponse<Record<string, any>>> {
    return this.request("/config/user")
  }

  async updateUserConfig(config: Record<string, any>): Promise<ApiResponse> {
    return this.request("/config/user", {
      method: "PUT",
      body: JSON.stringify(config),
    })
  }
}

export const apiFactory = new YYCApiFactory()
export type { ApiResponse, AuthTokens, UserProfile, Application, CodeTemplate, SystemMetrics }
export default YYCApiFactory
