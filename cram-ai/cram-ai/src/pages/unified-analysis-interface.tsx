import React, { useState, useCallback, useRef, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
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
  const location = useLocation()
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
  const [chatHistory, setChatHistory] = useState<{ role: 'ai' | 'user'; zh: string; en: string }[]>([])
  const [sidebarExpanded, setSidebarExpanded] = useState(true)
  const [directMode, setDirectMode] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const isZH = t('landing.locale') === 'zh'
  // Demo video paths: place your mp4 under public/videos/teacher-exam-demo.mp4 for local play
  const LOCAL_DEMO = '/videos/teacher-exam-demo.mp4'
  const REMOTE_DEMO = 'https://www.bilibili.com/video/BV1iL4y1e7VX/?share_source=copy_web'
  const [videoSrc, setVideoSrc] = useState<string>(LOCAL_DEMO)
  const mdZh = `# 教师资格证备考经验\n\n## 时间安排\n- 6 周滚动计划（学习/复盘/整卷）\n- 每日 2 小时专注块（番茄钟）\n- 每周 1 套整卷 + 错题复盘\n\n## 内容规划\n- 教育学：原理/制度/课堂管理\n- 心理学：认知/发展/测评\n- 综合素养：写作/材料分析/职业理念\n- 学科知识：核心概念与题型\n\n## 资料与网课\n- 权威教材 + 真题\n- 质量优先的网课（系统课/刷题课）\n- 建立错题本与知识卡片\n\n## 动机与初心（为什么当老师）\n- 教育意义与个人成长\n- 稳定职业与社会影响\n- 教学技能与终身学习\n\n## 刷题与错题本\n- 题目标签化：知识点/题型/易错\n- 二刷/三刷节奏：间隔重复\n- 用错题驱动复习路径`
  const mdEn = `# Teacher Exam Prep\n\n## Time Planning\n- 6-week rolling plan (study/review/mocks)\n- Daily 2h focus blocks (pomodoros)\n- One full mock weekly + error review\n\n## Content Roadmap\n- Pedagogy: principles/policy/classroom\n- Psychology: cognition/development/assessment\n- General Literacy: writing/materials/professionalism\n- Subject Knowledge: core concepts & question types\n\n## Materials & Courses\n- Authoritative books + past papers\n- Quality-first online courses (system + drills)\n- Error log & knowledge cards\n\n## Motivation\n- Social impact & personal growth\n- Stable career & meaning\n- Teaching skills & lifelong learning\n\n## Practice & Error Log\n- Tag questions: concept/type/error\n- Spaced re-drills (2nd/3rd rounds)\n- Use errors to drive review plan`
  const hasStartedRef = useRef(false)

  // When navigated with ?autostart=1&q=... or navigation state, auto-start analysis and skip upload UI
  useEffect(() => {
    const params = new URLSearchParams(location.search)
    const auto = params.get('autostart') === '1' || params.get('direct') === '1' || (location.state as any)?.autostart
    const q = params.get('q') || params.get('url') || (location.state as any)?.q || (location.state as any)?.url
    const type = (params.get('type') || (location.state as any)?.type || 'url') as 'url' | 'video'

    if (auto && !analysisResults) {
      setDirectMode(true)
      if (q) {
        const pseudo: FileItem = {
          id: Math.random().toString(36).substr(2, 9),
          name: q.split('/').pop() || (type === 'video' ? 'Video Content' : 'Web Content'),
          size: 0,
          type: type === 'video' ? 'video/url' : 'web/url',
          progress: 100,
          status: 'completed'
        }
        setFiles(prev => [...prev, pseudo])
        if (type === 'video') setVideoSrc(/^https?:/.test(q) ? q : LOCAL_DEMO)
      }
      // Prevent duplicate start
      if (!hasStartedRef.current) {
        hasStartedRef.current = true
        handleAnalysis()
      }
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.key])

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
        // If a local video was uploaded, create a blob URL to play it
        if ((file as any).type && (file as any).type.startsWith('video/')) {
          const blobUrl = URL.createObjectURL(file as any)
          setVideoSrc(blobUrl)
        }
      }, 3000)
    })
  }, [])

  const handleAnalysis = useCallback(() => {
    setIsAnalyzing(true)
    
    // Simulate AI analysis
    setTimeout(() => {
      setAnalysisResults({
        transcript: (isZH
          ? '本视频分享教师资格证备考经验：时间安排、内容规划、资料与网课推荐，以及为什么要当老师等话题。'
          : 'This video shares teacher certification prep tips: time planning, content roadmap, study materials and online courses, and motivations for becoming a teacher.'),
        summary: (isZH
          ? '围绕教师资格证备考的核心：合理时间表、清晰内容规划、优质资料与网课、备考心态与从教动机。'
          : 'Core of teacher-exam prep: a realistic schedule, clear content plan, quality materials and courses, plus mindset and motivations.'),
        keyPoints: (isZH
          ? [
              '建立「周学习-周复盘-周整卷」循环',
              '分模块推进（教育学/心理学/综合素养/学科知识）',
              '资料+网课双轮驱动，保质而非追量',
              '动机澄清：选择从教的意义与长期成长'
            ]
          : [
              'Weekly loop: learn → review → full mock',
              'Module-by-module (pedagogy/psychology/general/subject)',
              'Materials + online courses; quality over quantity',
              'Clarify motivation: meaning and long-term growth'
            ]),
        topics: (isZH
          ? ['时间安排', '内容规划', '资料/网课', '动机与初心', '刷题与错题本']
          : ['Time Planning', 'Content Roadmap', 'Materials/Courses', 'Motivation', 'Practice & Error Log']),
        actionItems: (isZH
          ? ['制定 6 周滚动计划', '每日 2 小时专注块（按模块）', '每周 1 套真题整卷', '每晚 15 分钟错题复盘']
          : ['Create a 6‑week rolling plan', 'Daily 2h focus blocks per module', '1 full mock weekly', '15‑min nightly error review']),
        transcriptItems: [
          { time: '00:15', text: isZH ? '为什么要当老师：职业意义与成长路径' : 'Why be a teacher: meaning and growth path' },
          { time: '01:30', text: isZH ? '时间安排：番茄钟与周计划' : 'Time planning: pomodoros and weekly plan' },
          { time: '03:45', text: isZH ? '内容规划：教育学/心理学/综合素养/学科知识' : 'Roadmap: pedagogy/psychology/general/subject' },
          { time: '05:20', text: isZH ? '资料与网课：质量优先的选择建议' : 'Materials & courses: quality-first picks' }
        ]
      })
      setIsAnalyzing(false)
 
      // Seed demo chat after analysis completes (bilingual entries)
      setChatHistory([
        { role: 'ai', zh: '你好！我可以解答教师资格证备考相关问题。', en: 'Hi! I can help with teacher-exam preparation questions.' },
        { role: 'user', zh: '这段视频的核心主题是什么？', en: 'What are the core topics of this video?' },
        { role: 'ai', zh: '时间安排、内容规划、资料与网课选择，以及为什么当老师。', en: 'Time planning, content roadmap, materials/courses, and why to become a teacher.' },
        { role: 'user', zh: '能给一个 6 周时间安排范例吗？', en: 'Can you give a 6‑week schedule example?' },
        { role: 'ai', zh: '第1‑2周打基础；第3‑4周专项强化；第5周整卷与错题；第6周回顾与心态调整。', en: 'Weeks 1‑2 fundamentals; 3‑4 focused modules; 5 full mocks & errors; 6 review and mindset.' }
      ])
    }, 3000)
  }, [])

  // Fallback: open /unified-analysis directly → auto-start demo analysis
  useEffect(() => {
    if (!hasStartedRef.current && !analysisResults) {
      hasStartedRef.current = true
      setDirectMode(true)
      setVideoSrc(LOCAL_DEMO)
      handleAnalysis()
    }
  }, [analysisResults, handleAnalysis])

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
    setVideoSrc(/^https?:/.test(videoInput) ? videoInput : LOCAL_DEMO)
  }, [videoInput, handleAnalysis])

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 overflow-hidden">
      {/* Animated Background - matching CramAI homepage */}
      <div className="fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-gray-50 via-blue-50/30 to-purple-50/20 dark:from-gray-900 dark:via-gray-800 dark:to-purple-900/20" />
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-blue-200/30 dark:bg-blue-500/10 rounded-full blur-3xl animate-pulse transition-colors duration-1000" />
        <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-purple-200/30 dark:bg-purple-500/10 rounded-full blur-3xl animate-pulse delay-1000 transition-colors duration-1000" />
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-cyan-200/20 dark:bg-cyan-500/5 rounded-full blur-3xl animate-pulse delay-500 transition-colors duration-1000" />
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
                      {isZH ? '教师资格证备考经验' : 'Teacher Exam Prep Demo'}
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
                  {(/\.(mp4|webm|mov|m4v)(\?|$)/i.test(videoSrc)) ? (
                    <video
                      className="absolute inset-0 w-full h-full object-contain bg-black"
                      controls
                      preload="metadata"
                      src={videoSrc}
                      onError={() => setVideoSrc(REMOTE_DEMO)}
                    />
                  ) : (
                    <iframe
                      className="absolute inset-0 w-full h-full bg-black"
                      src={videoSrc}
                      title="remote demo video"
                      allow="accelerometer; autoplay; encrypted-media; picture-in-picture"
                      allowFullScreen
                    />
                  )}
                  
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
                        {isZH ? '主界面' : 'Main'}
                      </TabsTrigger>
                      <TabsTrigger value="transcript" className="px-6 py-3 rounded-none border-b-2 border-transparent data-[state=active]:border-blue-500 data-[state=active]:bg-transparent">
                        {isZH ? '转录' : 'Transcript'}
                      </TabsTrigger>
                      <TabsTrigger value="mindmap" className="px-6 py-3 rounded-none border-b-2 border-transparent data-[state=active]:border-blue-500 data-[state=active]:bg-transparent">
                        {isZH ? '思维导图' : 'Mindmap'}
                      </TabsTrigger>
                      <TabsTrigger value="flashcards" className="px-6 py-3 rounded-none border-b-2 border-transparent data-[state=active]:border-blue-500 data-[state=active]:bg-transparent">
                        {isZH ? '闪卡' : 'Flashcards'}
                      </TabsTrigger>
                      <TabsTrigger value="notes" className="px-6 py-3 rounded-none border-b-2 border-transparent data-[state=active]:border-blue-500 data-[state=active]:bg-transparent">
                        {isZH ? '笔记' : 'Notes'}
                      </TabsTrigger>
                      <TabsTrigger value="resources" className="px-6 py-3 rounded-none border-b-2 border-transparent data-[state=active]:border-blue-500 data-[state=active]:bg-transparent">
                        {isZH ? '资源' : 'Resources'}
                      </TabsTrigger>
                      <TabsTrigger value="discussion" className="px-6 py-3 rounded-none border-b-2 border-transparent data-[state=active]:border-blue-500 data-[state=active]:bg-transparent">
                        {isZH ? '讨论' : 'Discussion'}
                      </TabsTrigger>
                    </TabsList>

                    <TabsContent value="main" className="p-6">
                      {analysisResults ? (
                        <div className="space-y-6">
                          <div className="rounded-lg p-6 bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 border border-blue-200/50 dark:border-blue-700/30">
                            <h3 className="text-lg font-semibold mb-2 text-gray-900 dark:text-white">{isZH ? '摘要' : 'Summary'}</h3>
                            <p className="text-gray-700 dark:text-gray-300 leading-relaxed">{analysisResults.summary}</p>
                          </div>
                          <div className="rounded-lg p-6 bg-white dark:bg-gray-700/40 border border-gray-200 dark:border-gray-600">
                            <h4 className="font-semibold mb-3 text-gray-900 dark:text-white">{isZH ? '关键要点' : 'Key Points'}</h4>
                            <ul className="list-disc pl-6 space-y-1 text-gray-700 dark:text-gray-300">
                              {(analysisResults.keyPoints || []).map((pt, i) => (<li key={i}>{pt}</li>))}
                            </ul>
                          </div>
                        </div>
                      ) : (
                        <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-700 rounded-lg p-8 text-center">
                          <div className="text-yellow-600 dark:text-yellow-400 font-medium mb-2">{isZH ? '内容生成中' : 'Content is being generated'}</div>
                          <div className="text-yellow-700 dark:text-yellow-300 text-sm">{isZH ? '此部分正在处理，请稍后查看。' : "This section's content is currently being processed. Please check back soon."}</div>
                        </div>
                      )}
                    </TabsContent>

                    <TabsContent value="transcript" className="p-6 h-96">
                      <div className="h-full overflow-y-auto space-y-3">
                        {(analysisResults?.transcriptItems || []).map((item, idx) => (
                          <div key={idx} className="border-b border-gray-200/60 dark:border-gray-700/60 pb-2">
                            <span className="text-blue-600 dark:text-blue-400 font-medium mr-2">{item.time}</span>
                            <span className="text-gray-800 dark:text-gray-200">{item.text}</span>
                          </div>
                        ))}
                        {!analysisResults?.transcriptItems?.length && (
                          <p className="text-gray-600 dark:text-gray-300">{isZH ? '分析后将显示完整转录文本。' : 'Full transcript will appear here after analysis.'}</p>
                        )}
                      </div>
                    </TabsContent>

                    <TabsContent value="mindmap" className="p-6">
                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
                        {/* Left: Markdown-like text (using <pre> for formatting) */}
                        <div className="rounded-xl border border-gray-200 dark:border-gray-700 bg-white/90 dark:bg-gray-800/80 p-4 overflow-auto max-h-[540px]">
                          <h3 className="text-lg font-semibold mb-2 text-gray-900 dark:text-white">
                            {isZH ? '思维导图（Markdown）' : 'Mindmap (Markdown)'}
                          </h3>
                          <pre className="whitespace-pre-wrap text-sm leading-6 text-gray-800 dark:text-gray-200">{isZH ? mdZh : mdEn}</pre>
                        </div>

                        {/* Right: SVG mindmap demo */}
                        <div className="rounded-xl border border-gray-200 dark:border-gray-700 bg-white/90 dark:bg-gray-800/80 p-4 overflow-auto">
                          <h3 className="text-lg font-semibold mb-2 text-gray-900 dark:text-white">{isZH ? '思维导图（SVG 演示）' : 'Mindmap (SVG Demo)'}</h3>
                          <div className="w-full h-[540px]">
                            <svg viewBox="0 0 1200 700" className="w-full h-full">
                              {/* Root */}
                              <circle cx="150" cy="350" r="10" fill="#0ea5e9" />
                              <text x="170" y="355" fontSize="18" fill="#0f172a">{isZH ? '教师资格证备考经验' : 'Teacher Exam Prep'}</text>

                              {/* Branch function */}
                              {(() => {
                                const rootX = 150, rootY = 350
                                const branches = [
                                  { labelZh: '时间安排', labelEn: 'Time Planning', x: 400, y: 180, color: '#f59e0b' },
                                  { labelZh: '内容规划', labelEn: 'Content Roadmap', x: 600, y: 260, color: '#a855f7' },
                                  { labelZh: '资料/网课', labelEn: 'Materials/Courses', x: 900, y: 180, color: '#06b6d4' },
                                  { labelZh: '动机与初心', labelEn: 'Motivation', x: 400, y: 520, color: '#10b981' },
                                  { labelZh: '刷题与错题本', labelEn: 'Practice & Errors', x: 700, y: 480, color: '#ef4444' }
                                ]
                                const leaves: Record<string, { zh: string; en: string }[]> = {
                                  '时间安排': [
                                    { zh: '6 周滚动计划', en: '6‑week rolling plan' },
                                    { zh: '每日 2 小时专注块', en: 'Daily 2h focus blocks' },
                                    { zh: '每周整卷 + 复盘', en: 'Weekly mock + review' }
                                  ],
                                  '内容规划': [
                                    { zh: '教育学', en: 'Pedagogy' },
                                    { zh: '心理学', en: 'Psychology' },
                                    { zh: '综合素养', en: 'General literacy' },
                                    { zh: '学科知识', en: 'Subject knowledge' }
                                  ],
                                  '资料/网课': [
                                    { zh: '权威教材', en: 'Books' },
                                    { zh: '系统课/刷题课', en: 'System/Drill courses' },
                                    { zh: '错题卡片', en: 'Error cards' }
                                  ],
                                  '动机与初心': [
                                    { zh: '教育意义', en: 'Meaning' },
                                    { zh: '稳定成长', en: 'Growth' },
                                    { zh: '终身学习', en: 'Lifelong learning' }
                                  ],
                                  '刷题与错题本': [
                                    { zh: '标签化管理', en: 'Tagging' },
                                    { zh: '间隔重复', en: 'Spaced repetition' },
                                    { zh: '错题驱动复习', en: 'Error-driven review' }
                                  ]
                                }
                                return (
                                  <g>
                                    {branches.map((b, i) => (
                                      <g key={i}>
                                        <path d={`M ${rootX} ${rootY} C ${rootX+80} ${rootY-80}, ${b.x-120} ${b.y-40}, ${b.x} ${b.y}`} stroke={b.color} fill="none" strokeWidth="3" />
                                        <circle cx={b.x} cy={b.y} r="8" fill={b.color} />
                                        <text x={b.x+14} y={b.y+5} fontSize="16" fill="#0f172a">{isZH ? b.labelZh : b.labelEn}</text>
                                        {/* Leaves */}
                                        {(leaves[b.labelZh] || []).map((lv, j) => {
                                          const lx = b.x + 160
                                          const ly = b.y + j*40 - 40
                                          return (
                                            <g key={j}>
                                              <path d={`M ${b.x+120} ${b.y} C ${b.x+130} ${b.y}, ${lx-40} ${ly}, ${lx} ${ly}`} stroke={b.color} fill="none" strokeWidth="2" />
                                              <text x={lx+8} y={ly+5} fontSize="14" fill="#334155">{isZH ? lv.zh : lv.en}</text>
                                            </g>
                                          )
                                        })}
                                      </g>
                                    ))}
                                  </g>
                                )
                              })()}
                            </svg>
                          </div>
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
              directMode ? (
                // Skip upload UI when in direct mode; just show a placeholder area while analyzing
                <Card className="border-0 shadow-xl bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm">
                  <CardContent className="p-16 text-center">
                    <div className="flex items-center justify-center gap-3 text-gray-600 dark:text-gray-300">
                      <Loader2 className="h-5 w-5 animate-spin" />
                      <span>{t('landing.locale') === 'zh' ? '正在准备分析界面...' : 'Preparing analysis view...'}</span>
                    </div>
                  </CardContent>
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
                                placeholder={t('landing.locale') === 'zh' ? '输入任意网页或音视频链接进行分析...' : 'Enter web URL for analysis...'}
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
              )
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
                        {isZH ? '转录' : 'Transcript'}
                      </Button>
                      <Button variant="ghost" className="w-full justify-start text-left hover:bg-gray-100 dark:hover:bg-gray-700">
                        <ChevronRight className="h-4 w-4 mr-2" />
                        {isZH ? '编辑' : 'Edit'}
                      </Button>
                      <Button variant="ghost" className="w-full justify-start text-left hover:bg-gray-100 dark:hover:bg-gray-700">
                        <Settings className="h-4 w-4 mr-2" />
                        {isZH ? '重新生成内容' : 'Regenerate Content'}
                      </Button>
                    </div>

                    {/* Share Button */}
                    <Button className="w-full bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white shadow-lg hover:shadow-xl transition-all duration-300">
                      <Share2 className="h-4 w-4 mr-2" />
                      {isZH ? '分享给朋友' : 'Share with friends'}
                    </Button>

                    {/* Quick Actions */}
                    <div className="pt-4 border-t border-gray-200 dark:border-gray-600">
                      <h4 className="font-medium text-gray-900 dark:text-white mb-3">
                        {isZH ? '快捷操作' : 'Quick Actions'}
                      </h4>
                      <div className="space-y-2">
                        <Button variant="outline" size="sm" className="w-full justify-start">
                          <Bookmark className="h-4 w-4 mr-2" />
                          {isZH ? '收藏' : 'Bookmark'}
                        </Button>
                        <Button variant="outline" size="sm" className="w-full justify-start">
                          <Download className="h-4 w-4 mr-2" />
                          {isZH ? '下载' : 'Download'}
                        </Button>
                        <Button variant="outline" size="sm" className="w-full justify-start">
                          <Share2 className="h-4 w-4 mr-2" />
                          {isZH ? '分享' : 'Share'}
                        </Button>
                      </div>
                    </div>

                    {/* Sidebar Chat */}
                    <div className="pt-4 border-t border-gray-200 dark:border-gray-600">
                      <h4 className="font-medium text-gray-900 dark:text-white mb-3">{isZH ? '对话' : 'Chat'}</h4>
                      <div className="space-y-3">
                        <div className="bg-gray-50 dark:bg-gray-700/40 rounded-md p-3 max-h-80 min-h-[220px] overflow-y-auto border border-gray-200/60 dark:border-gray-600/60">
                          <div className="space-y-2">
                            {chatHistory.map((m, i) => (
                              <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                                {m.role === 'ai' && (
                                  <Avatar className="w-7 h-7 mr-2"><AvatarFallback>AI</AvatarFallback></Avatar>
                                )}
                                <div className={`px-3 py-2 rounded-lg text-sm ${m.role === 'ai' ? 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200' : 'bg-blue-600 text-white'}`}>
                                  {isZH ? m.zh : m.en}
                                </div>
                              </div>
                            ))}
                            {!chatHistory.length && (
                              <div className="text-sm text-gray-500 dark:text-gray-300">{isZH ? '开始提问以展开对话。' : 'Start asking to begin the conversation.'}</div>
                            )}
                          </div>
                        </div>
                        <div className="flex space-x-2">
                          <Input value={chatMessage} onChange={(e) => setChatMessage(e.target.value)} placeholder={isZH ? '就视频内容提问...' : 'Ask about this video...'} className="flex-1" />
                          <Button size="sm" onClick={() => {
                            const text = chatMessage.trim()
                            if (!text) return
                            setChatHistory(prev => [...prev, { role: 'user', zh: text, en: text }, { role: 'ai', zh: '收到！我会结合摘要与要点进行回答。', en: 'Got it! I will answer based on the summary and key points.' }])
                            setChatMessage('')
                          }}>
                            <Send className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  directMode ? (
                    <div className="text-center py-12">
                      <div className="relative mb-6">
                        <div className="absolute inset-0 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-full blur-xl animate-pulse" />
                        <div className="relative bg-white dark:bg-gray-800 rounded-full p-4 shadow-lg mx-auto w-fit">
                          <Brain className="h-12 w-12 text-blue-500" />
                        </div>
                      </div>
                      <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
                        {t('landing.locale') === 'zh' ? 'AI正在分析中' : 'AI is analyzing...'}
                      </h3>
                      <p className="text-gray-600 dark:text-gray-300">
                        {t('landing.locale') === 'zh' ? '即将进入分析界面' : 'Switching to analysis view shortly'}
                      </p>
                    </div>
                  ) : (
                    // Original "Start Analysis" panel
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
                  )
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
