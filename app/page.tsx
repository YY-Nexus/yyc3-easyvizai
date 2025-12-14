"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Code2,
  Palette,
  Bug,
  Database,
  Sparkles,
  Download,
  Settings,
  Zap,
  Brain,
  Layers,
  GitBranch,
  Upload,
  Eye,
  Copy,
  CheckCircle,
  AlertCircle,
  Cpu,
  Monitor,
  Smartphone,
  Wifi,
  WifiOff,
} from "lucide-react"

import { useCodeGeneration, useSystemMetrics, useTemplates, useAuth } from "@/hooks/use-api"

export default function YYCEasyVizAI() {
  const [prompt, setPrompt] = useState("")
  const [techStack, setTechStack] = useState("react")
  const [vizType, setVizType] = useState("2d")
  const [isPreviewMode, setIsPreviewMode] = useState(false)

  const { isAuthenticated, user } = useAuth()
  const { isGenerating, generatedCode, qualityAnalysis, generateCode, optimizeCode, setGeneratedCode } =
    useCodeGeneration()
  const { realTimeMetrics, loading: metricsLoading } = useSystemMetrics()
  const { templates, loading: templatesLoading } = useTemplates()

  const handleGenerateCode = async () => {
    if (!prompt.trim()) return

    const response = await generateCode({
      prompt,
      tech_stack: techStack as "react" | "vue" | "svelte",
      viz_type: vizType as "2d" | "3d" | "dashboard",
    })

    if (!response.success) {
      console.error("代码生成失败:", response.message)
    }
  }

  const handleCopyCode = () => {
    navigator.clipboard.writeText(generatedCode)
  }

  const togglePreview = () => {
    setIsPreviewMode(!isPreviewMode)
  }

  const handleOptimizeCode = async (type: "performance" | "accessibility" | "brand") => {
    await optimizeCode(type)
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center relative">
                <Sparkles className="w-6 h-6 text-primary-foreground" />
                <div className="absolute inset-0 bg-primary rounded-lg animate-pulse opacity-20"></div>
              </div>
              <div>
                <h1 className="text-xl font-bold text-foreground">YYC³ EasyVizAI</h1>
                <p className="text-sm text-muted-foreground">万象归元于云枢，深栈智启新纪元</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Badge variant="secondary" className="bg-green-100 text-green-800 border-green-200">
                {metricsLoading ? <WifiOff className="w-3 h-3 mr-1" /> : <Wifi className="w-3 h-3 mr-1" />}
                API {metricsLoading ? "连接中" : "已连接"}
              </Badge>
              <Badge variant="secondary" className="bg-primary/10 text-primary border-primary/20">
                <Brain className="w-3 h-3 mr-1" />
                GLM4.5 驱动
              </Badge>
              {isAuthenticated && user && (
                <Badge variant="outline" className="text-xs">
                  {user.username}
                </Badge>
              )}
              <Button variant="outline" size="sm">
                <Settings className="w-4 h-4 mr-2" />
                设置
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* 左侧：增强的AI代码生成 */}
          <div className="lg:col-span-2 space-y-6">
            <Card className="border-primary/20 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center text-primary">
                  <Code2 className="w-5 h-5 mr-2" />
                  AI 代码生成引擎
                  <Badge variant="outline" className="ml-2 text-xs">
                    GLM4.5
                  </Badge>
                </CardTitle>
                <CardDescription>用自然语言描述你的可视化需求，AI将生成带YYC³品牌风格的可运行代码</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-foreground">技术栈</label>
                    <Select value={techStack} onValueChange={setTechStack}>
                      <SelectTrigger className="border-primary/20 focus:border-primary">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="react">React + TypeScript</SelectItem>
                        <SelectItem value="vue">Vue 3 + Composition API</SelectItem>
                        <SelectItem value="svelte">Svelte (即将支持)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-foreground">可视化类型</label>
                    <Select value={vizType} onValueChange={setVizType}>
                      <SelectTrigger className="border-primary/20 focus:border-primary">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="2d">2D 图表 (ECharts)</SelectItem>
                        <SelectItem value="3d">3D 可视化 (Three.js)</SelectItem>
                        <SelectItem value="dashboard">数据大屏</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">描述你的可视化需求</label>
                  <Textarea
                    placeholder="例如：生成一个季度销售数据柱状图，使用YYC³品牌蓝色主题，支持响应式布局和动画效果..."
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    className="min-h-[100px] resize-none border-primary/20 focus:border-primary"
                  />
                </div>
                <div className="flex items-center space-x-2">
                  <Button
                    onClick={handleGenerateCode}
                    disabled={!prompt.trim() || isGenerating}
                    className="bg-primary hover:bg-primary/90"
                  >
                    {isGenerating ? (
                      <>
                        <Zap className="w-4 h-4 mr-2 animate-spin" />
                        AI生成中...
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-4 h-4 mr-2" />
                        生成代码
                      </>
                    )}
                  </Button>
                  <Button variant="outline" size="sm" onClick={togglePreview} disabled={!generatedCode}>
                    <Eye className="w-4 h-4 mr-2" />
                    {isPreviewMode ? "代码视图" : "预览效果"}
                  </Button>
                  <Button variant="outline" size="sm" onClick={handleCopyCode} disabled={!generatedCode}>
                    <Copy className="w-4 h-4 mr-2" />
                    复制代码
                  </Button>
                  <Button variant="outline" size="sm" disabled={!generatedCode}>
                    <Download className="w-4 h-4 mr-2" />
                    导出项目
                  </Button>
                </div>
              </CardContent>
            </Card>

            {generatedCode && (
              <Card className="border-accent/20">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center text-accent">
                      <GitBranch className="w-5 h-5 mr-2" />
                      生成的代码
                      <Badge variant="secondary" className="ml-2 text-xs">
                        {techStack.toUpperCase()} +{" "}
                        {vizType === "2d" ? "ECharts" : vizType === "3d" ? "Three.js" : "DataV"}
                      </Badge>
                    </CardTitle>
                    <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                      <div className="flex items-center">
                        <Cpu className="w-4 h-4 mr-1" />
                        {realTimeMetrics.cpu.toFixed(1)}%
                      </div>
                      <div className="flex items-center">
                        <Monitor className="w-4 h-4 mr-1" />
                        {realTimeMetrics.memory.toFixed(1)}MB
                      </div>
                      <div className="flex items-center">
                        <Zap className="w-4 h-4 mr-1" />
                        60fps
                      </div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  {!isPreviewMode ? (
                    <div className="bg-muted rounded-lg p-4 overflow-x-auto">
                      <pre className="text-sm text-muted-foreground">
                        <code>{generatedCode}</code>
                      </pre>
                    </div>
                  ) : (
                    <div className="bg-gradient-to-br from-blue-50 to-white rounded-lg p-6 min-h-[300px] flex items-center justify-center border border-primary/10">
                      <div className="text-center">
                        <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                          <Eye className="w-8 h-8 text-primary" />
                        </div>
                        <h3 className="text-lg font-semibold text-primary mb-2">可视化预览</h3>
                        <p className="text-sm text-muted-foreground">代码将在此处实时渲染预览效果</p>
                      </div>
                    </div>
                  )}

                  {qualityAnalysis && (
                    <div className="mt-4 space-y-2">
                      <div className="flex items-center justify-between">
                        <h4 className="text-sm font-medium text-foreground">代码质量检测</h4>
                        <div className="flex space-x-2">
                          <Button size="sm" variant="outline" onClick={() => handleOptimizeCode("performance")}>
                            性能优化
                          </Button>
                          <Button size="sm" variant="outline" onClick={() => handleOptimizeCode("brand")}>
                            品牌合规
                          </Button>
                        </div>
                      </div>
                      <div className="space-y-1">
                        <div className="flex items-center text-sm">
                          <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                          <span className="text-green-700">
                            品牌合规率: {qualityAnalysis.brand_compliant ? "100%" : "需要优化"}
                          </span>
                        </div>
                        <div className="flex items-center text-sm">
                          <CheckCircle className="w-4 h-4 text-blue-500 mr-2" />
                          <span className="text-blue-700">性能评分: {qualityAnalysis.performance_score}/100</span>
                        </div>
                        <div className="flex items-center text-sm">
                          <CheckCircle className="w-4 h-4 text-purple-500 mr-2" />
                          <span className="text-purple-700">可访问性: {qualityAnalysis.accessibility_score}/100</span>
                        </div>
                        {qualityAnalysis.issues?.map((issue, index) => (
                          <div key={index} className="flex items-center text-sm">
                            {issue.type === "warning" && <AlertCircle className="w-4 h-4 text-yellow-500 mr-2" />}
                            <span className="text-yellow-700">{issue.message}</span>
                            {issue.line && (
                              <Badge variant="outline" className="ml-2 text-xs">
                                行 {issue.line}
                              </Badge>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}

            {/* 功能模块标签页 */}
            <Tabs defaultValue="lowcode" className="w-full">
              <TabsList className="grid w-full grid-cols-4 bg-muted/50">
                <TabsTrigger
                  value="lowcode"
                  className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
                >
                  <Palette className="w-4 h-4 mr-2" />
                  低代码开发
                </TabsTrigger>
                <TabsTrigger
                  value="debug"
                  className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
                >
                  <Bug className="w-4 h-4 mr-2" />
                  调试工具
                </TabsTrigger>
                <TabsTrigger
                  value="assets"
                  className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
                >
                  <Database className="w-4 h-4 mr-2" />
                  资产库
                </TabsTrigger>
                <TabsTrigger
                  value="deploy"
                  className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
                >
                  <Layers className="w-4 h-4 mr-2" />
                  部署
                </TabsTrigger>
              </TabsList>

              <TabsContent value="lowcode" className="mt-6">
                <Card>
                  <CardHeader>
                    <CardTitle>可视化组件拖拽面板</CardTitle>
                    <CardDescription>拖拽组件到画布，AI自动生成代码并处理组件联动</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      {[
                        { name: "ECharts柱状图", icon: "📊", tech: "React/Vue" },
                        { name: "Three.js 3D模型", icon: "🎲", tech: "WebGL" },
                        { name: "数据大屏布局", icon: "📺", tech: "Grid" },
                        { name: "地图组件", icon: "🗺️", tech: "Leaflet" },
                        { name: "数值卡片", icon: "📋", tech: "CSS3" },
                        { name: "折线图", icon: "📈", tech: "D3.js" },
                        { name: "饼图", icon: "🥧", tech: "Chart.js" },
                        { name: "仪表盘", icon: "⏱️", tech: "Canvas" },
                      ].map((component, index) => (
                        <Card
                          key={index}
                          className="cursor-pointer hover:shadow-md transition-all duration-200 border-primary/10 hover:border-primary/30 hover:scale-105"
                        >
                          <CardContent className="p-4 text-center">
                            <div className="text-2xl mb-2">{component.icon}</div>
                            <p className="text-sm font-medium mb-1">{component.name}</p>
                            <Badge variant="secondary" className="text-xs">
                              {component.tech}
                            </Badge>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="debug" className="mt-6">
                <Card>
                  <CardHeader>
                    <CardTitle>代码可视化调试</CardTitle>
                    <CardDescription>AI将代码逻辑转化为可视化流程图，实时定位问题</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="bg-muted/50 rounded-lg p-4">
                          <h4 className="font-medium mb-3 flex items-center">
                            <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                            实时检测
                          </h4>
                          <div className="space-y-2">
                            <div className="flex items-center text-sm">
                              <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                              ECharts容器尺寸检查 ✓
                            </div>
                            <div className="flex items-center text-sm">
                              <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                              Three.js WebGL兼容性 ✓
                            </div>
                            <div className="flex items-center text-sm">
                              <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                              YYC³品牌色应用 ✓
                            </div>
                            <div className="flex items-center text-sm">
                              <div className="w-2 h-2 bg-yellow-500 rounded-full mr-2"></div>
                              响应式布局优化 ⚠️
                            </div>
                          </div>
                        </div>
                        <div className="bg-muted/50 rounded-lg p-4">
                          <h4 className="font-medium mb-3 flex items-center">
                            <Cpu className="w-4 h-4 text-blue-500 mr-2" />
                            性能分析
                          </h4>
                          <div className="space-y-2">
                            <div className="flex items-center justify-between text-sm">
                              <span>渲染时间</span>
                              <Badge variant={realTimeMetrics.cpu < 100 ? "default" : "destructive"}>
                                {realTimeMetrics.cpu.toFixed(1)}ms
                              </Badge>
                            </div>
                            <div className="flex items-center justify-between text-sm">
                              <span>内存占用</span>
                              <Badge variant={realTimeMetrics.memory < 50 ? "default" : "destructive"}>
                                {realTimeMetrics.memory.toFixed(1)}MB
                              </Badge>
                            </div>
                            <div className="flex items-center justify-between text-sm">
                              <span>帧率</span>
                              <Badge variant={realTimeMetrics.cpu > 30 ? "default" : "destructive"}>
                                {realTimeMetrics.cpu.toFixed(0)}fps
                              </Badge>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="flex space-x-2">
                        <Button variant="outline" size="sm">
                          <Upload className="w-4 h-4 mr-2" />
                          上传代码调试
                        </Button>
                        <Button variant="outline" size="sm">
                          <Eye className="w-4 h-4 mr-2" />
                          生成流程图
                        </Button>
                        <Button variant="outline" size="sm">
                          <Zap className="w-4 h-4 mr-2" />
                          性能优化
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="assets" className="mt-6">
                <Card>
                  <CardHeader>
                    <CardTitle>可视化代码资产库</CardTitle>
                    <CardDescription>存储和复用可视化代码模板，AI智能推荐</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {[
                        { name: "电商销售大屏模板", tech: "React+ECharts", uses: 156, category: "商业" },
                        { name: "智慧工厂3D模板", tech: "Three.js+WebGL", uses: 89, category: "工业" },
                        { name: "教育数据大屏", tech: "Vue+DataV", uses: 234, category: "教育" },
                        { name: "金融风控仪表盘", tech: "React+D3", uses: 67, category: "金融" },
                        { name: "医疗数据可视化", tech: "React+ECharts", uses: 123, category: "医疗" },
                        { name: "智慧城市3D地图", tech: "Three.js+Cesium", uses: 98, category: "政务" },
                      ].map((template, index) => (
                        <Card
                          key={index}
                          className="border-primary/10 hover:border-primary/30 cursor-pointer transition-all duration-200 hover:shadow-md"
                        >
                          <CardContent className="p-4">
                            <div className="flex items-start justify-between mb-2">
                              <h4 className="font-medium">{template.name}</h4>
                              <Badge variant="outline" className="text-xs">
                                {template.category}
                              </Badge>
                            </div>
                            <p className="text-sm text-muted-foreground mb-3">{template.tech}</p>
                            <div className="flex items-center justify-between">
                              <Badge variant="secondary" className="text-xs">
                                使用 {template.uses} 次
                              </Badge>
                              <div className="flex space-x-1">
                                <Button size="sm" variant="outline">
                                  预览
                                </Button>
                                <Button size="sm" variant="default">
                                  导入
                                </Button>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="deploy" className="mt-6">
                <Card>
                  <CardHeader>
                    <CardTitle>一键部署</CardTitle>
                    <CardDescription>导出完整项目包，支持Docker部署和云服务器一键上线</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <Button variant="outline" className="h-20 flex-col bg-transparent hover:bg-primary/5">
                          <Download className="w-6 h-6 mb-2" />
                          导出项目包
                          <span className="text-xs text-muted-foreground">ZIP格式</span>
                        </Button>
                        <Button variant="outline" className="h-20 flex-col bg-transparent hover:bg-primary/5">
                          <Layers className="w-6 h-6 mb-2" />
                          Docker部署
                          <span className="text-xs text-muted-foreground">容器化</span>
                        </Button>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="bg-muted/50 rounded-lg p-4">
                          <h4 className="font-medium mb-2 flex items-center">
                            <Smartphone className="w-4 h-4 mr-2" />
                            项目配置
                          </h4>
                          <div className="space-y-2">
                            <div className="flex items-center justify-between text-sm">
                              <span>技术栈</span>
                              <Badge variant="secondary">{techStack.toUpperCase()} + TypeScript</Badge>
                            </div>
                            <div className="flex items-center justify-between text-sm">
                              <span>构建工具</span>
                              <Badge variant="secondary">Vite</Badge>
                            </div>
                            <div className="flex items-center justify-between text-sm">
                              <span>容器化</span>
                              <Badge variant="secondary">Docker Ready</Badge>
                            </div>
                            <div className="flex items-center justify-between text-sm">
                              <span>品牌主题</span>
                              <Badge variant="secondary" style={{ backgroundColor: "#2E86C1", color: "white" }}>
                                YYC³
                              </Badge>
                            </div>
                          </div>
                        </div>

                        <div className="bg-muted/50 rounded-lg p-4">
                          <h4 className="font-medium mb-2 flex items-center">
                            <Monitor className="w-4 h-4 mr-2" />
                            部署选项
                          </h4>
                          <div className="space-y-2">
                            <Button variant="ghost" size="sm" className="w-full justify-start">
                              <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                              Vercel 部署
                            </Button>
                            <Button variant="ghost" size="sm" className="w-full justify-start">
                              <span className="w-2 h-2 bg-blue-500 rounded-full mr-2"></span>
                              阿里云 ECS
                            </Button>
                            <Button variant="ghost" size="sm" className="w-full justify-start">
                              <span className="w-2 h-2 bg-orange-500 rounded-full mr-2"></span>
                              腾讯云服务器
                            </Button>
                            <Button variant="ghost" size="sm" className="w-full justify-start">
                              <span className="w-2 h-2 bg-purple-500 rounded-full mr-2"></span>
                              自定义服务器
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>

          {/* 右侧：快速操作和状态 */}
          <div className="space-y-6">
            <Card className="border-accent/20">
              <CardHeader>
                <CardTitle className="text-accent">快速开始</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button className="w-full justify-start bg-primary hover:bg-primary/90">
                  <Sparkles className="w-4 h-4 mr-2" />
                  新建可视化项目
                </Button>
                <Button variant="outline" className="w-full justify-start bg-transparent">
                  <Database className="w-4 h-4 mr-2" />
                  浏览模板库
                </Button>
                <Button variant="outline" className="w-full justify-start bg-transparent">
                  <GitBranch className="w-4 h-4 mr-2" />
                  导入现有代码
                </Button>
                <Button variant="outline" className="w-full justify-start bg-transparent">
                  <Upload className="w-4 h-4 mr-2" />
                  上传设计稿
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>系统状态</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm">AI引擎状态</span>
                  <Badge className="bg-green-100 text-green-800 border-green-200">GLM4.5 运行中</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">API连接</span>
                  <Badge
                    className={
                      metricsLoading
                        ? "bg-yellow-100 text-yellow-800 border-yellow-200"
                        : "bg-green-100 text-green-800 border-green-200"
                    }
                  >
                    {metricsLoading ? "连接中" : "已连接"}
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">模板库</span>
                  <Badge variant="secondary">{templatesLoading ? "加载中..." : `${templates.length} 个`}</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">CPU使用率</span>
                  <Badge variant="secondary">{realTimeMetrics.cpu.toFixed(1)}%</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">内存使用</span>
                  <Badge variant="secondary">{realTimeMetrics.memory.toFixed(1)}MB</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">品牌合规率</span>
                  <Badge className="bg-blue-100 text-blue-800 border-blue-200">
                    {qualityAnalysis?.brand_compliant ? "100%" : "98.5%"}
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">代码质量</span>
                  <Badge className="bg-green-100 text-green-800 border-green-200">
                    {qualityAnalysis ? `${qualityAnalysis.performance_score}/100` : "优秀"}
                  </Badge>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>最近项目</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {[
                  { name: "销售数据大屏", time: "2小时前", status: "已部署", tech: "React+ECharts" },
                  { name: "3D产品展示", time: "1天前", status: "开发中", tech: "Three.js" },
                  { name: "用户行为分析", time: "3天前", status: "已完成", tech: "Vue+D3" },
                  { name: "智慧工厂监控", time: "5天前", status: "已部署", tech: "React+WebGL" },
                ].map((project, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-3 rounded-lg hover:bg-muted/50 cursor-pointer transition-colors"
                  >
                    <div className="flex-1">
                      <p className="text-sm font-medium">{project.name}</p>
                      <div className="flex items-center space-x-2 mt-1">
                        <p className="text-xs text-muted-foreground">{project.time}</p>
                        <Badge variant="outline" className="text-xs">
                          {project.tech}
                        </Badge>
                      </div>
                    </div>
                    <Badge
                      variant="outline"
                      className={`text-xs ${
                        project.status === "已部署"
                          ? "bg-green-50 text-green-700 border-green-200"
                          : project.status === "开发中"
                            ? "bg-yellow-50 text-yellow-700 border-yellow-200"
                            : "bg-blue-50 text-blue-700 border-blue-200"
                      }`}
                    >
                      {project.status}
                    </Badge>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
