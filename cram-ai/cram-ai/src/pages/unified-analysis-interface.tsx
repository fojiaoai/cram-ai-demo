import React, { useState, useCallback, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Progress } from '@/components/ui/progress'
import { Textarea } from '@/components/ui/textarea'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import NavigationBar from '@/components/navigation-bar'
import { useTheme } from '@/components/theme-provider'
import { 
  Upload, 
  Link as LinkIcon, 
  Video, 
  FileText, 
  Music, 
  Image as ImageIcon,
  File,
  Play,
  Pause,
  Volume2,
  VolumeX,
  Maximize,
  Download,
  Share2,
  Bookmark,
  MessageCircle,
  Brain,
  Zap,
  Target,
  TrendingUp,
  Clock,
  Eye,
  ThumbsUp,
  Settings,
  ChevronRight,
  Sparkles,
  Globe,
  Users,
  Star,
  CheckCircle,
  RefreshCw,
  Edit3,
  Save,
  Send,
  Plus,
  Loader2
} from 'lucide-react'

interface FileItem {
  id: string
  name: string
  size: number
  type: string
  progress: number
  status: 'uploading' | 'completed' | 'error'
  preview?: string
}

interface TranscriptItem {
  time: string
  text: string
}

interface AnalysisResult {
  transcript: string
  summary: string
  keyPoints: string[]
  topics: string[]
  actionItems: string[]
  transcriptItems?: TranscriptItem[]
}

export default function UnifiedAnalysisInterface() {
  const { t } = useTranslation()
  const { theme } = useTheme()
  const navigate = useNavigate()
  const [files, setFiles] = useState<FileItem[]>([])
  const [isDragOver, setIsDragOver] = useState(false)
  const [urlInput, setUrlInput] = useState('')
  const [videoInput, setVideoInput] = useState('')
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [analysisResults, setAnalysisResults] = useState<AnalysisResult | null>(null)
  const [activeTab, setActiveTab] = useState('main')
  const [isVideoPlaying, setIsVideoPlaying] = useState(false)
  const [videoProgress, setVideoProgress] = useState(0)
  const [volume, setVolume] = useState(80)
  const [isMuted, setIsMuted] = useState(false)
  const [notes, setNotes] = useState('')
  const [editingNotes, setEditingNotes] = useState(false)
  const [chatMessage, setChatMessage] = useState('')
  const [sidebarExpanded, setSidebarExpanded] = useState(true)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const getFileIcon = (type: string) => {
    if (type.startsWith('video/')) return <Video className="h-5 w-5 text-blue-500" />
    if (type.startsWith('image/')) return <ImageIcon className="h-5 w-5 text-green-500" />
    if (type.startsWith('audio/')) return <Music className="h-5 w-5 text-purple-500" />
    if (type.includes('pdf')) return <FileText className="h-5 w-5 text-red-500" />
    return <File className="h-5 w-5 text-gray-500" />
  }

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(true)
  }, [])

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(false)
  }, [])

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(false)
    const droppedFiles = Array.from(e.dataTransfer.files)
    handleFiles(droppedFiles)
  }, [])

  const handleFileSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const selectedFiles = Array.from(e.target.files)
      handleFiles(selectedFiles)
    }
  }, [])

  const handleFiles = useCallback((fileList: File[]) => {
    const newFiles: FileItem[] = fileList.map(file => ({
      id: Math.random().toString(36).substr(2, 9),
      name: file.name,
      size: file.size,
      type: file.type,
      progress: 0,
      status: 'uploading' as const,
      preview: file.type.startsWith('image/') ? URL.createObjectURL(file) : undefined
    }))

    setFiles(prev => [...prev, ...newFiles])

    // Simulate upload progress
    newFiles.forEach(file => {
      const interval = setInterval(() => {
        setFiles(prev => prev.map(f => {
          if (f.id === file.id) {
            const newProgress = Math.min(f.progress + Math.random() * 30, 100)
            return {
              ...f,
              progress: newProgress,
              status: newProgress === 100 ? 'completed' : 'uploading'
            }
          }
          return f
        }))
      }, 500)

      setTimeout(() => {
        clearInterval(interval)
        setFiles(prev => prev.map(f => 
          f.id === file.id ? { ...f, progress: 100, status: 'completed' } : f
        ))
        // Trigger analysis after upload
        if (fileList.length > 0) {
          handleAnalysis()
        }
      }, 3000)
    })
  }, [])

  const handleAnalysis = useCallback(() => {
    setIsAnalyzing(true)
    
    // Simulate AI analysis
    setTimeout(() => {
      setAnalysisResults({
        transcript: `This is a comprehensive analysis of the uploaded content. The AI has processed the material and extracted key insights, themes, and actionable recommendations.

Key Topics Discussed:
• Artificial Intelligence and Machine Learning trends
• Future of work and automation
• Digital transformation strategies
• Innovation in technology sector

The content demonstrates a positive outlook on technological advancement with practical applications for business growth.`,
        summary: "AI-powered analysis reveals key insights about technology trends and their business applications.",
        keyPoints: [
          "AI adoption is accelerating across industries",
          "Remote work technologies are becoming essential",
          "Data-driven decision making is critical",
          "Digital skills gap needs addressing"
        ],
        topics: ["AI", "Technology", "Business", "Innovation", "Future Work"],
        actionItems: [
          "Invest in AI training programs",
          "Develop remote work policies",
          "Implement data analytics tools",
          "Create digital transformation roadmap"
        ],
        transcriptItems: [
          { time: "00:15", text: "欢迎来到MCP终极指南，今天我们将从原理到实战，带你深入掌握MCP技术" },
          { time: "01:30", text: "首先让我们了解MCP的基本概念和核心架构" },
          { time: "03:45", text: "接下来我们将通过实际案例来演示MCP的应用" },
          { time: "05:20", text: "让我们深入探讨MCP的实现细节和最佳实践" }
        ]
      })
      setIsAnalyzing(false)
    }, 3000)
  }, [])

  const handleUrlAnalysis = useCallback(() => {
    if (!urlInput.trim()) return
    setIsAnalyzing(true)
    
    // Add URL as a "file"
    const urlFile: FileItem = {
      id: Math.random().toString(36).substr(2, 9),
      name: urlInput.split('/').pop() || 'Web Content',
      size: 0,
      type: 'web/url',
      progress: 100,
      status: 'completed'
    }
    
    setFiles(prev => [...prev, urlFile])
    setUrlInput('')
    handleAnalysis()
  }, [urlInput, handleAnalysis])

  const handleVideoAnalysis = useCallback(() => {
    if (!videoInput.trim()) return
    setIsAnalyzing(true)
    
    // Add video URL as a "file"
    const videoFile: FileItem = {
      id: Math.random().toString(36).substr(2, 9),
      name: 'MCP Tutorial Video',
      size: 0,
      type: 'video/url',
      progress: 100,
      status: 'completed'
    }
    
    setFiles(prev => [...prev, videoFile])
    setVideoInput('')
    handleAnalysis()
  }, [videoInput, handleAnalysis])

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 overflow-hidden">
      {/* Animated Background - matching homepage */}
      <div className="fixed inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50/50 via-white to-purple-50/50 dark:from-gray-900/50 dark:via-gray-800 dark:to-purple-900/20" />
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-200/20 dark:bg-blue-500/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-200/20 dark:bg-purple-500/10 rounded-full blur-3xl animate-pulse delay-1000" />
      </div>
      
      <NavigationBar />

      <div className="container mx-auto px-4 py-8 relative z-10">
        {/* <div className="mb-8 text-center">
          <Badge variant="secondary" className="mb-4 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 text-blue-700 dark:text-blue-300 border border-blue-200/50 dark:border-blue-700/50 shadow-sm">
            <Brain className="w-4 h-4 mr-2" />
            {t('landing.locale') === 'zh' ? 'AI驱动的内容分析' : 'AI-Powered Content Analysis'}
          </Badge>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              {t('landing.locale') === 'zh' ? '内容分析' : 'Content Analysis'}
            </span>
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto leading-relaxed">
            {t('landing.locale') === 'zh' 
              ? '上传文件、输入链接或视频URL进行AI智能分析，获取深度洞察和可执行建议'
              : 'Upload files, input links or video URLs for AI-powered analysis and get deep insights with actionable recommendations'}
          </p>
        </div> */}

        {/* Main Layout - Reference Image Layout */}
        <div className="grid lg:grid-cols-4 gap-8 mb-8">
          {/* Left Panel - Content Viewer (3 columns) */}
          <div className="lg:col-span-3">
            {analysisResults ? (
              <Card className="border-0 shadow-2xl hover:shadow-3xl transition-all duration-300 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm overflow-hidden">
                <div className="bg-gradient-to-r from-gray-900 to-gray-800 dark:from-gray-800 dark:to-gray-700 px-6 py-4 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
                    <div className="w-3 h-3 bg-yellow-500 rounded-full animate-pulse delay-100"></div>
                    <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse delay-200"></div>
                    <span className="ml-4 text-white text-sm font-medium">
                      {t('landing.locale') === 'zh' ? 'MCP 教程视频' : 'MCP Tutorial Video'}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button variant="ghost" size="sm" className="text-white hover:bg-white/10">
                      <Maximize className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                
                {/* Video Player Area */}
                <div className="relative bg-black aspect-video">
                  <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-blue-900/20 to-purple-900/20">
                    <div className="text-center text-white">
                      <Video className="h-16 w-16 mx-auto mb-4 opacity-60" />
                      <p className="text-lg font-medium mb-2">
                        {t('landing.locale') === 'zh' ? 'MCP 教程视频' : 'MCP Tutorial Video'}
                      </p>
                      <p className="text-sm opacity-80">
                        {t('landing.locale') === 'zh' ? '15:42 分钟' : '15:42 minutes'}
                      </p>
                    </div>
                  </div>
                  
                  {/* Video Controls */}
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4">
                    <div className="flex items-center gap-4">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setIsVideoPlaying(!isVideoPlaying)}
                        className="text-white hover:bg-white/20"
                      >
                        {isVideoPlaying ? <Pause className="h-5 w-5" /> : <Play className="h-5 w-5" />}
                      </Button>
                      
                      <div className="flex-1">
                        <Progress value={videoProgress} className="h-1" />
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setIsMuted(!isMuted)}
                          className="text-white hover:bg-white/20"
                        >
                          {isMuted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
                        </Button>
                        <span className="text-white text-sm">15:42</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Bottom Tabs */}
                <div className="bg-white dark:bg-gray-800">
                  <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                    <TabsList className="w-full justify-start border-b rounded-none bg-transparent p-0 h-auto">
                      <TabsTrigger value="main" className="px-6 py-3 rounded-none border-b-2 border-transparent data-[state=active]:border-blue-500 data-[state=active]:bg-transparent">
                        Main
                      </TabsTrigger>
                      <TabsTrigger value="chat" className="px-6 py-3 rounded-none border-b-2 border-transparent data-[state=active]:border-blue-500 data-[state=active]:bg-transparent">
                        Chat
                      </TabsTrigger>
                      <TabsTrigger value="flashcards" className="px-6 py-3 rounded-none border-b-2 border-transparent data-[state=active]:border-blue-500 data-[state=active]:bg-transparent">
                        Flashcards
                      </TabsTrigger>
                      <TabsTrigger value="notes" className="px-6 py-3 rounded-none border-b-2 border-transparent data-[state=active]:border-blue-500 data-[state=active]:bg-transparent">
                        Notes
                      </TabsTrigger>
                      <TabsTrigger value="resources" className="px-6 py-3 rounded-none border-b-2 border-transparent data-[state=active]:border-blue-500 data-[state=active]:bg-transparent">
                        Resources
                      </TabsTrigger>
                      <TabsTrigger value="discussion" className="px-6 py-3 rounded-none border-b-2 border-transparent data-[state=active]:border-blue-500 data-[state=active]:bg-transparent">
                        Discussion
                      </TabsTrigger>
                    </TabsList>

                    <TabsContent value="main" className="p-6">
                      <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-700 rounded-lg p-8 text-center">
                        <div className="text-yellow-600 dark:text-yellow-400 font-medium mb-2">Content is being generated</div>
                        <div className="text-yellow-700 dark:text-yellow-300 text-sm">This section's content is currently being processed. Please check back soon.</div>
                      </div>
                    </TabsContent>

                    <TabsContent value="chat" className="p-6 h-96">
                      <div className="h-full flex flex-col">
                        <div className="flex-1 space-y-4 overflow-y-auto mb-4">
                          <div className="flex items-start space-x-3">
                            <Avatar className="w-8 h-8">
                              <AvatarFallback>AI</AvatarFallback>
                            </Avatar>
                            <div className="flex-1 bg-gray-100 dark:bg-gray-700 rounded-lg p-3">
                              <p className="text-sm">Hello! I'm your AI learning assistant. Feel free to ask me any questions about the MCP content.</p>
                            </div>
                          </div>
                        </div>
                        <div className="flex space-x-2">
                          <Input
                            value={chatMessage}
                            onChange={(e) => setChatMessage(e.target.value)}
                            placeholder="Ask a question about this content..."
                            className="flex-1"
                          />
                          <Button>
                            <Send className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </TabsContent>

                    <TabsContent value="flashcards" className="p-6">
                      <div className="text-center py-12">
                        <div className="text-gray-500 dark:text-gray-400 mb-4">Flashcard Decks</div>
                        <div className="text-sm text-gray-400 dark:text-gray-500 mb-6">Select a deck to view its flashcards</div>
                        <div className="max-w-md mx-auto">
                          <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-8 text-center">
                            <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                            <div className="text-gray-600 dark:text-gray-300 font-medium mb-2">No Decks Available</div>
                            <Button className="bg-orange-500 hover:bg-orange-600">
                              <Plus className="h-4 w-4 mr-2" />
                              Add Deck
                            </Button>
                          </div>
                        </div>
                      </div>
                    </TabsContent>

                    <TabsContent value="notes" className="p-6">
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <h3 className="text-lg font-semibold">My Notes</h3>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setEditingNotes(!editingNotes)}
                          >
                            {editingNotes ? <Save className="h-4 w-4 mr-2" /> : <Edit3 className="h-4 w-4 mr-2" />}
                            {editingNotes ? 'Save' : 'Edit'}
                          </Button>
                        </div>
                        {editingNotes ? (
                          <Textarea
                            value={notes}
                            onChange={(e) => setNotes(e.target.value)}
                            placeholder="Take notes about this lesson..."
                            className="min-h-[300px] resize-none"
                          />
                        ) : (
                          <div className="min-h-[300px] p-4 border border-gray-200 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700/50">
                            {notes || "No notes yet. Click Edit to start taking notes."}
                          </div>
                        )}
                      </div>
                    </TabsContent>

                    <TabsContent value="resources" className="p-6">
                      <div className="space-y-4">
                        <h3 className="text-lg font-semibold">Resources</h3>
                        <Card>
                          <CardContent className="p-4">
                            <div className="flex items-center space-x-3">
                              <Video className="h-5 w-5 text-red-500" />
                              <div className="flex-1">
                                <div className="font-medium">MCP终极指南视频</div>
                                <div className="text-sm text-gray-600 dark:text-gray-400">Video • 15:47</div>
                              </div>
                              <Button variant="outline" size="sm">
                                <Download className="h-4 w-4 mr-2" />
                                Download
                              </Button>
                            </div>
                          </CardContent>
                        </Card>
                      </div>
                    </TabsContent>

                    <TabsContent value="discussion" className="p-6">
                      <div className="space-y-6">
                        <Card>
                          <CardContent className="p-4">
                            <div className="flex items-start space-x-3">
                              <Avatar className="w-10 h-10">
                                <AvatarFallback>张</AvatarFallback>
                              </Avatar>
                              <div className="flex-1">
                                <div className="flex items-center space-x-2 mb-2">
                                  <span className="font-medium">张明</span>
                                  <span className="text-sm text-gray-500 dark:text-gray-400">2 hours ago</span>
                                </div>
                                <p className="text-sm mb-3">Great explanation of MCP! The practical examples really help understand the concepts.</p>
                                <div className="flex items-center space-x-4 text-sm text-gray-500 dark:text-gray-400">
                                  <button className="flex items-center space-x-1 hover:text-blue-600">
                                    <ThumbsUp className="h-4 w-4" />
                                    <span>12</span>
                                  </button>
                                  <button className="hover:text-blue-600">Reply</button>
                                </div>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      </div>
                    </TabsContent>
                  </Tabs>
                </div>
              </Card>
            ) : (
              /* Upload Interface */
              <div className="space-y-6">
                {/* Upload Tabs */}
                <Tabs defaultValue="file" className="w-full">
                  <TabsList className="grid w-full grid-cols-3 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border border-gray-200/50 dark:border-gray-700/50">
                    <TabsTrigger value="file" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-purple-500 data-[state=active]:text-white">
                      <Upload className="h-4 w-4 mr-2" />
                      {t('landing.locale') === 'zh' ? '文件上传' : 'File Upload'}
                    </TabsTrigger>
                    <TabsTrigger value="url" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-purple-500 data-[state=active]:text-white">
                      <Globe className="h-4 w-4 mr-2" />
                      {t('landing.locale') === 'zh' ? '网页链接' : 'Web Links'}
                    </TabsTrigger>
                    <TabsTrigger value="video" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-purple-500 data-[state=active]:text-white">
                      <Video className="h-4 w-4 mr-2" />
                      {t('landing.locale') === 'zh' ? '视频链接' : 'Video Links'}
                    </TabsTrigger>
                  </TabsList>

                  <TabsContent value="file">
                    <Card className="border-2 border-dashed border-gray-300 dark:border-gray-600 hover:border-blue-400 dark:hover:border-blue-500 transition-colors bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm">
                      <CardContent className="p-12">
                        <div
                          className={`text-center ${isDragOver ? 'bg-blue-50 dark:bg-blue-900/20 border-blue-300 dark:border-blue-600' : ''} rounded-lg p-8 transition-colors`}
                          onDragOver={handleDragOver}
                          onDragLeave={handleDragLeave}
                          onDrop={handleDrop}
                        >
                          <div className="relative mb-6">
                            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-full blur-xl" />
                            <div className="relative bg-white dark:bg-gray-800 rounded-full p-4 shadow-lg mx-auto w-fit">
                              <Upload className="h-12 w-12 text-blue-500" />
                            </div>
                          </div>
                          <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">
                            {t('landing.locale') === 'zh' ? '拖拽文件到此处' : 'Drag files here'}
                          </h3>
                          <p className="text-gray-600 dark:text-gray-300 mb-6 text-lg">
                            {t('landing.locale') === 'zh' ? '或点击选择文件上传' : 'or click to select files'}
                          </p>
                          <Button 
                            onClick={() => fileInputRef.current?.click()}
                            className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 text-lg px-8 py-6"
                          >
                            <Upload className="mr-2 h-5 w-5" />
                            {t('landing.locale') === 'zh' ? '选择文件' : 'Select Files'}
                          </Button>
                          <input
                            ref={fileInputRef}
                            type="file"
                            multiple
                            className="hidden"
                            onChange={handleFileSelect}
                            accept="*/*"
                          />
                          <p className="text-sm text-gray-500 dark:text-gray-400 mt-4">
                            {t('landing.locale') === 'zh' 
                              ? '支持 PDF、DOCX、PPTX、JPG、PNG、MP4 等格式' 
                              : 'Supports PDF, DOCX, PPTX, JPG, PNG, MP4 and more'}
                          </p>
                        </div>
                      </CardContent>
                    </Card>
                  </TabsContent>

                  <TabsContent value="url">
                    <Card className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-0 shadow-lg">
                      <CardContent className="p-8">
                        <div className="flex items-center space-x-4">
                          <div className="relative">
                            <div className="absolute inset-0 bg-gradient-to-br from-green-500/20 to-blue-500/20 rounded-full blur-xl" />
                            <div className="relative bg-white dark:bg-gray-800 rounded-full p-3 shadow-lg">
                              <Globe className="h-6 w-6 text-green-500" />
                            </div>
                          </div>
                          <div className="flex-1">
                            <Input
                              type="url"
                              placeholder={t('landing.locale') === 'zh' ? '输入网页链接进行分析...' : 'Enter web URL for analysis...'}
                              value={urlInput}
                              onChange={(e) => setUrlInput(e.target.value)}
                              className="text-lg py-6 border-2 border-gray-200 dark:border-gray-600 focus:border-blue-500 dark:focus:border-blue-400 bg-white/80 dark:bg-gray-700/80"
                            />
                          </div>
                          <Button 
                            onClick={handleUrlAnalysis}
                            disabled={!urlInput.trim() || isAnalyzing}
                            className="bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 text-white px-8 py-6 text-lg"
                          >
                            {isAnalyzing ? (
                              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                            ) : (
                              <Zap className="h-5 w-5" />
                            )}
                            {t('landing.locale') === 'zh' ? '分析' : 'Analyze'}
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  </TabsContent>

                  <TabsContent value="video">
                    <Card className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-0 shadow-lg">
                      <CardContent className="p-8">
                        <div className="flex items-center space-x-4">
                          <div className="relative">
                            <div className="absolute inset-0 bg-gradient-to-br from-red-500/20 to-purple-500/20 rounded-full blur-xl" />
                            <div className="relative bg-white dark:bg-gray-800 rounded-full p-3 shadow-lg">
                              <Video className="h-6 w-6 text-red-500" />
                            </div>
                          </div>
                          <div className="flex-1">
                            <Input
                              type="url"
                              placeholder={t('landing.locale') === 'zh' ? '输入视频链接 (YouTube, Bilibili 等)...' : 'Enter video URL (YouTube, Bilibili, etc.)...'}
                              value={videoInput}
                              onChange={(e) => setVideoInput(e.target.value)}
                              className="text-lg py-6 border-2 border-gray-200 dark:border-gray-600 focus:border-red-500 dark:focus:border-red-400 bg-white/80 dark:bg-gray-700/80"
                            />
                          </div>
                          <Button 
                            onClick={handleVideoAnalysis}
                            disabled={!videoInput.trim() || isAnalyzing}
                            className="bg-gradient-to-r from-red-600 to-purple-600 hover:from-red-700 hover:to-purple-700 text-white px-8 py-6 text-lg"
                          >
                            {isAnalyzing ? (
                              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                            ) : (
                              <Play className="h-5 w-5" />
                            )}
                            {t('landing.locale') === 'zh' ? '分析' : 'Analyze'}
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  </TabsContent>
                </Tabs>

                {/* Uploaded Files List */}
                {files.length > 0 && (
                  <Card className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-0 shadow-lg">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2 text-gray-900 dark:text-white">
                        <FileText className="h-5 w-5 text-blue-500" />
                        {t('landing.locale') === 'zh' ? '已上传文件' : 'Uploaded Files'}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {files.map((file) => (
                          <div key={file.id} className="flex items-center space-x-4 p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg border border-gray-200/50 dark:border-gray-600/50">
                            {getFileIcon(file.type)}
                            <div className="flex-1">
                              <div className="flex items-center justify-between mb-2">
                                <span className="font-medium text-gray-900 dark:text-white">{file.name}</span>
                                <Badge variant={file.status === 'completed' ? 'default' : 'secondary'} className="bg-gradient-to-r from-green-100 to-blue-100 dark:from-green-900/20 dark:to-blue-900/20 text-green-700 dark:text-green-300">
                                  {file.status === 'completed' ? 
                                    (t('landing.locale') === 'zh' ? '完成' : 'Complete') : 
                                    (t('landing.locale') === 'zh' ? '上传中' : 'Uploading')
                                  }
                                </Badge>
                              </div>
                              <div className="flex items-center justify-between text-sm text-gray-600 dark:text-gray-300">
                                <span>{formatFileSize(file.size)}</span>
                                <span>{file.progress}%</span>
                              </div>
                              <Progress value={file.progress} className="mt-2" />
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                )}
              </div>
            )}
          </div>

          {/* Right Sidebar - Analysis Tools (1 column) */}
          <div className="lg:col-span-1">
            <Card className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-0 shadow-lg sticky top-24">
              <CardContent className="p-6">
                {analysisResults ? (
                  <div className="space-y-4">
                    {/* Analysis Tools */}
                    <div className="space-y-3">
                      <Button variant="ghost" className="w-full justify-start text-left hover:bg-gray-100 dark:hover:bg-gray-700">
                        <ChevronRight className="h-4 w-4 mr-2" />
                        {t('landing.locale') === 'zh' ? 'Transcript' : 'Transcript'}
                      </Button>
                      <Button variant="ghost" className="w-full justify-start text-left hover:bg-gray-100 dark:hover:bg-gray-700">
                        <ChevronRight className="h-4 w-4 mr-2" />
                        {t('landing.locale') === 'zh' ? 'Edit' : 'Edit'}
                      </Button>
                      <Button variant="ghost" className="w-full justify-start text-left hover:bg-gray-100 dark:hover:bg-gray-700">
                        <Settings className="h-4 w-4 mr-2" />
                        {t('landing.locale') === 'zh' ? 'Regenerate Content' : 'Regenerate Content'}
                      </Button>
                    </div>

                    {/* Share Button */}
                    <Button className="w-full bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white shadow-lg hover:shadow-xl transition-all duration-300">
                      <Share2 className="h-4 w-4 mr-2" />
                      {t('landing.locale') === 'zh' ? 'Share with friends' : 'Share with friends'}
                    </Button>

                    {/* Quick Actions */}
                    <div className="pt-4 border-t border-gray-200 dark:border-gray-600">
                      <h4 className="font-medium text-gray-900 dark:text-white mb-3">
                        {t('landing.locale') === 'zh' ? 'Quick Actions' : 'Quick Actions'}
                      </h4>
                      <div className="space-y-2">
                        <Button variant="outline" size="sm" className="w-full justify-start">
                          <Bookmark className="h-4 w-4 mr-2" />
                          {t('landing.locale') === 'zh' ? 'Bookmark' : 'Bookmark'}
                        </Button>
                        <Button variant="outline" size="sm" className="w-full justify-start">
                          <Download className="h-4 w-4 mr-2" />
                          {t('landing.locale') === 'zh' ? 'Download' : 'Download'}
                        </Button>
                        <Button variant="outline" size="sm" className="w-full justify-start">
                          <Share2 className="h-4 w-4 mr-2" />
                          {t('landing.locale') === 'zh' ? 'Share' : 'Share'}
                        </Button>
                      </div>
                    </div>

                    {/* Transcript Preview */}
                    <div className="pt-4 border-t border-gray-200 dark:border-gray-600">
                      <h4 className="font-medium text-gray-900 dark:text-white mb-3">
                        {t('landing.locale') === 'zh' ? 'Transcript' : 'Transcript'}
                      </h4>
                      <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-3 text-sm text-gray-600 dark:text-gray-300 max-h-40 overflow-y-auto">
                        {analysisResults?.transcriptItems?.map((item, index) => (
                          <div key={index} className="mb-2">
                            <span className="text-blue-600 dark:text-blue-400 font-medium">{item.time}</span>
                            <p className="mt-1">{item.text}</p>
                          </div>
                        )) || (
                          <p className="leading-relaxed">
                            {analysisResults?.transcript || 'Transcript content will appear here after analysis...'}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <div className="relative mb-6">
                      <div className="absolute inset-0 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-full blur-xl" />
                      <div className="relative bg-white dark:bg-gray-800 rounded-full p-4 shadow-lg mx-auto w-fit">
                        <Brain className="h-12 w-12 text-blue-500" />
                      </div>
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
                      {t('landing.locale') === 'zh' ? '开始分析' : 'Start Analysis'}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-300 mb-6">
                      {t('landing.locale') === 'zh' 
                        ? '上传文件或输入链接开始AI分析' 
                        : 'Upload files or enter links to start AI analysis'}
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Loading Overlay */}
        {isAnalyzing && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
            <Card className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm border-0 shadow-2xl">
              <CardContent className="p-8 text-center">
                <div className="relative mb-6">
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-full blur-xl animate-pulse" />
                  <div className="relative bg-white dark:bg-gray-800 rounded-full p-4 shadow-lg mx-auto w-fit">
                    <Brain className="h-12 w-12 text-blue-500 animate-pulse" />
                  </div>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
                  {t('landing.locale') === 'zh' ? 'AI正在分析内容...' : 'AI is analyzing content...'}
                </h3>
                <p className="text-gray-600 dark:text-gray-300 mb-4">
                  {t('landing.locale') === 'zh' ? '请稍候，正在生成分析结果' : 'Please wait, generating analysis results'}
                </p>
                <div className="flex items-center justify-center space-x-2">
                  <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-purple-500 rounded-full animate-bounce delay-100"></div>
                  <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce delay-200"></div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>

      <style>{`
        @keyframes fade-in-up {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .animate-fade-in-up {
          animation: fade-in-up 0.6s ease-out forwards;
        }
      `}</style>
    </div>
  )
}
