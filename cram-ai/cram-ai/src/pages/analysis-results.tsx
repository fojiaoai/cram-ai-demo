import { useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Progress } from '@/components/ui/progress'
import { 
  Brain, 
  ArrowLeft, 
  Download, 
  Share2, 
  Copy, 
  Video, 
  FileText, 
  Clock, 
  TrendingUp, 
  MessageSquare, 
  Tag, 
  Lightbulb,
  CheckCircle,
  AlertTriangle,
  BarChart3,
  PieChart,
  Users,
  Calendar,
  Sparkles,
  Eye,
  Star,
  ThumbsUp,
  BookOpen,
  Zap
} from 'lucide-react'

export default function AnalysisResults() {
  const { id } = useParams()
  const [activeTab, setActiveTab] = useState('overview')
  const [copied, setCopied] = useState(false)

  // Mock analysis data
  const analysisData = {
    id: id || '1',
    title: 'AI在医疗健康领域的未来趋势',
    type: 'video',
    source: 'YouTube',
    duration: '12:34',
    processedAt: '2024-01-15 14:30',
    confidence: 94,
    thumbnail: '/placeholder.svg?height=200&width=350',
    
    summary: {
      main: "这个视频深入探讨了人工智能在医疗健康领域的变革潜力，涵盖了诊断成像、药物发现、个性化医疗和患者护理优化等关键领域。讨论强调了AI在医疗系统中采用的机遇和挑战。",
      keyPoints: [
        "AI驱动的诊断工具在医学影像中达到95%+的准确率",
        "AI将药物发现时间从10-15年缩短到3-5年",
        "基于基因和生活方式数据的个性化治疗方案",
        "围绕数据隐私和算法偏见的伦理考量"
      ]
    },
    
    insights: [
      {
        type: 'trend',
        title: '市场增长趋势',
        content: '医疗AI市场预计到2028年将达到1020亿美元',
        confidence: 92,
        impact: 'high'
      },
      {
        type: 'opportunity',
        title: '投资重点领域',
        content: '诊断成像和药物发现获得最高投资关注',
        confidence: 88,
        impact: 'medium'
      },
      {
        type: 'challenge',
        title: '监管障碍',
        content: 'FDA审批流程需要适应基于AI的医疗设备',
        confidence: 85,
        impact: 'high'
      },
      {
        type: 'innovation',
        title: '技术突破',
        content: '深度学习在罕见疾病诊断中显示出巨大潜力',
        confidence: 90,
        impact: 'high'
      }
    ],
    
    topics: [
      { name: '人工智能', relevance: 95, category: 'technology' },
      { name: '医疗技术', relevance: 92, category: 'healthcare' },
      { name: '医学影像', relevance: 88, category: 'application' },
      { name: '药物发现', relevance: 85, category: 'research' },
      { name: '个性化医疗', relevance: 82, category: 'treatment' },
      { name: '数据隐私', relevance: 78, category: 'ethics' },
      { name: '监管合规', relevance: 75, category: 'policy' },
      { name: '投资趋势', relevance: 72, category: 'business' }
    ],
    
    sentiment: {
      overall: 'positive',
      score: 0.72,
      breakdown: {
        positive: 65,
        neutral: 28,
        negative: 7
      },
      emotions: [
        { emotion: '乐观', score: 78 },
        { emotion: '谨慎', score: 65 },
        { emotion: '兴奋', score: 58 },
        { emotion: '担忧', score: 23 }
      ]
    },
    
    actionItems: [
      {
        priority: 'high',
        category: '研究',
        action: '调研当前医疗机构中的AI诊断工具应用情况',
        timeline: '1-2周'
      },
      {
        priority: 'high',
        category: '合规',
        action: '评估AI实施的数据隐私合规性要求',
        timeline: '2-3周'
      },
      {
        priority: 'medium',
        category: '合作',
        action: '考虑与医疗AI初创公司建立合作伙伴关系',
        timeline: '1-2月'
      },
      {
        priority: 'medium',
        category: '培训',
        action: '为AI辅助工作流程开发员工培训计划',
        timeline: '2-3月'
      }
    ],
    
    keyQuotes: [
      {
        text: "AI不是要取代医生，而是要增强医生的能力",
        timestamp: '03:45',
        speaker: '主讲人'
      },
      {
        text: "数据质量决定了AI系统的成功与否",
        timestamp: '08:12',
        speaker: '专家访谈'
      },
      {
        text: "监管框架必须与技术创新保持同步",
        timestamp: '15:23',
        speaker: '政策专家'
      }
    ],
    
    relatedContent: [
      {
        title: 'AI医疗诊断最新进展',
        type: 'article',
        relevance: 95
      },
      {
        title: '医疗数据隐私保护指南',
        type: 'document',
        relevance: 87
      },
      {
        title: 'FDA AI医疗设备审批流程',
        type: 'regulation',
        relevance: 82
      }
    ]
  }

  const handleExport = () => {
    console.log('Exporting analysis results...')
  }

  const handleShare = () => {
    console.log('Sharing analysis results...')
  }

  const handleCopy = () => {
    navigator.clipboard.writeText(window.location.href)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const getInsightIcon = (type: string) => {
    switch (type) {
      case 'trend':
        return <TrendingUp className="h-5 w-5 text-green-600" />
      case 'opportunity':
        return <Lightbulb className="h-5 w-5 text-blue-600" />
      case 'challenge':
        return <AlertTriangle className="h-5 w-5 text-orange-600" />
      case 'innovation':
        return <Sparkles className="h-5 w-5 text-purple-600" />
      default:
        return <BarChart3 className="h-5 w-5 text-gray-600" />
    }
  }

  const getInsightColor = (type: string) => {
    switch (type) {
      case 'trend':
        return 'from-green-50 to-emerald-50 border-green-200'
      case 'opportunity':
        return 'from-blue-50 to-cyan-50 border-blue-200'
      case 'challenge':
        return 'from-orange-50 to-red-50 border-orange-200'
      case 'innovation':
        return 'from-purple-50 to-violet-50 border-purple-200'
      default:
        return 'from-gray-50 to-slate-50 border-gray-200'
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'bg-red-100 text-red-700 border-red-200'
      case 'medium':
        return 'bg-yellow-100 text-yellow-700 border-yellow-200'
      case 'low':
        return 'bg-green-100 text-green-700 border-green-200'
      default:
        return 'bg-gray-100 text-gray-700 border-gray-200'
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50/30">
      {/* Animated Background */}
      <div className="fixed inset-0 -z-10">
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-blue-200/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-purple-200/10 rounded-full blur-3xl animate-pulse delay-1000" />
      </div>

      {/* Header */}
      <header className="bg-white/80 backdrop-blur-xl border-b border-gray-200/50 sticky top-0 z-50 shadow-sm">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Link to="/dashboard" className="flex items-center space-x-2 text-gray-600 hover:text-blue-600 transition-colors duration-300 group">
              <ArrowLeft className="h-5 w-5 group-hover:-translate-x-1 transition-transform duration-300" />
              <span>返回工作台</span>
            </Link>
            
            <div className="h-6 w-px bg-gray-300" />
            
            <div className="flex items-center space-x-2">
              <div className="relative">
                <Brain className="h-6 w-6 text-blue-600" />
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full animate-ping" />
              </div>
              <span className="font-semibold text-gray-900">分析结果</span>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={handleCopy}
              className="hover:bg-blue-50 transition-colors duration-300"
            >
              <Copy className="h-4 w-4 mr-2" />
              {copied ? '已复制!' : '复制链接'}
            </Button>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={handleShare}
              className="hover:bg-green-50 transition-colors duration-300"
            >
              <Share2 className="h-4 w-4 mr-2" />
              分享
            </Button>
            <Button 
              size="sm" 
              onClick={handleExport} 
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg hover:shadow-xl transition-all duration-300"
            >
              <Download className="h-4 w-4 mr-2" />
              导出报告
            </Button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Content Header */}
        <div className="mb-8">
          <Card className="border-0 shadow-xl bg-white/80 backdrop-blur-sm overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-purple-500/5" />
            <CardContent className="p-8 relative">
              <div className="flex items-start justify-between mb-6">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="bg-gradient-to-r from-red-500 to-pink-500 p-2 rounded-lg">
                      <Video className="h-6 w-6 text-white" />
                    </div>
                    <Badge variant="secondary" className="bg-red-100 text-red-700 border-red-200">
                      {analysisData.source}
                    </Badge>
                    <Badge className="bg-green-100 text-green-700 border-green-200">
                      <CheckCircle className="h-3 w-3 mr-1" />
                      分析完成
                    </Badge>
                    <Badge className="bg-blue-100 text-blue-700 border-blue-200">
                      <Star className="h-3 w-3 mr-1" />
                      高质量内容
                    </Badge>
                  </div>
                  
                  <h1 className="text-3xl font-bold text-gray-900 mb-3 leading-tight">
                    {analysisData.title}
                  </h1>
                  
                  <div className="flex items-center gap-6 text-sm text-gray-600 mb-4">
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4" />
                      <span>时长: {analysisData.duration}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4" />
                      <span>处理时间: {analysisData.processedAt}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <TrendingUp className="h-4 w-4" />
                      <span>置信度: {analysisData.confidence}%</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Eye className="h-4 w-4" />
                      <span>{analysisData.insights.length} 个洞察</span>
                    </div>
                  </div>
                  
                  <div className="mb-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-gray-700">AI分析置信度</span>
                      <span className="text-sm font-bold text-blue-600">{analysisData.confidence}%</span>
                    </div>
                    <Progress value={analysisData.confidence} className="h-3" />
                  </div>
                </div>
                
                <div className="ml-8">
                  <div className="relative group">
                    <img 
                      src={analysisData.thumbnail} 
                      alt={analysisData.title}
                      className="w-64 h-36 object-cover rounded-xl shadow-lg group-hover:shadow-2xl transition-shadow duration-300"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    <div className="absolute bottom-3 left-3 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <div className="text-sm font-medium">点击查看原视频</div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Analysis Content */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <div className="bg-white/80 backdrop-blur-sm rounded-xl p-2 shadow-lg border border-gray-200/50">
            <TabsList className="grid w-full grid-cols-6 bg-transparent">
              <TabsTrigger 
                value="overview" 
                className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-purple-500 data-[state=active]:text-white transition-all duration-300"
              >
                概览
              </TabsTrigger>
              <TabsTrigger 
                value="insights" 
                className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-purple-500 data-[state=active]:text-white transition-all duration-300"
              >
                关键洞察
              </TabsTrigger>
              <TabsTrigger 
                value="topics" 
                className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-purple-500 data-[state=active]:text-white transition-all duration-300"
              >
                主题分析
              </TabsTrigger>
              <TabsTrigger 
                value="sentiment" 
                className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-purple-500 data-[state=active]:text-white transition-all duration-300"
              >
                情感分析
              </TabsTrigger>
              <TabsTrigger 
                value="actions" 
                className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-purple-500 data-[state=active]:text-white transition-all duration-300"
              >
                行动建议
              </TabsTrigger>
              <TabsTrigger 
                value="quotes" 
                className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-purple-500 data-[state=active]:text-white transition-all duration-300"
              >
                关键引用
              </TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="overview" className="space-y-6">
            {/* Summary */}
            <Card className="border-0 shadow-xl bg-white/80 backdrop-blur-sm overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-purple-500/5" />
              <CardHeader className="relative">
                <CardTitle className="flex items-center gap-2 text-xl">
                  <div className="bg-gradient-to-r from-blue-500 to-purple-500 p-2 rounded-lg">
                    <BookOpen className="h-5 w-5 text-white" />
                  </div>
                  智能摘要
                  <Badge className="ml-2 bg-gradient-to-r from-blue-100 to-purple-100 text-blue-700 border-0">
                    AI生成
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent className="relative">
                <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-6 rounded-xl border border-blue-200/50 mb-6">
                  <p className="text-gray-700 leading-relaxed text-lg">
                    {analysisData.summary.main}
                  </p>
                </div>
                
                <h4 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <Zap className="h-4 w-4 text-blue-600" />
                  核心要点：
                </h4>
                <div className="grid md:grid-cols-2 gap-4">
                  {analysisData.summary.keyPoints.map((point, index) => (
                    <div key={index} className="flex items-start gap-3 p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg border border-green-200/50">
                      <div className="bg-green-500 text-white rounded-full p-1 flex-shrink-0 mt-0.5">
                        <CheckCircle className="h-3 w-3" />
                      </div>
                      <span className="text-gray-700 leading-relaxed">{point}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Quick Stats */}
            <div className="grid md:grid-cols-4 gap-6">
              <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-cyan-500/5" />
                <CardContent className="p-6 text-center relative">
                  <div className="bg-gradient-to-r from-blue-100 to-cyan-100 p-3 rounded-full w-fit mx-auto mb-3">
                    <Lightbulb className="h-6 w-6 text-blue-600" />
                  </div>
                  <div className="text-2xl font-bold text-gray-900 mb-1">
                    {analysisData.insights.length}
                  </div>
                  <div className="text-sm text-gray-600">关键洞察</div>
                </CardContent>
              </Card>

              <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-green-500/5 to-emerald-500/5" />
                <CardContent className="p-6 text-center relative">
                  <div className="bg-gradient-to-r from-green-100 to-emerald-100 p-3 rounded-full w-fit mx-auto mb-3">
                    <Tag className="h-6 w-6 text-green-600" />
                  </div>
                  <div className="text-2xl font-bold text-gray-900 mb-1">
                    {analysisData.topics.length}
                  </div>
                  <div className="text-sm text-gray-600">识别主题</div>
                </CardContent>
              </Card>

              <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-pink-500/5" />
                <CardContent className="p-6 text-center relative">
                  <div className="bg-gradient-to-r from-purple-100 to-pink-100 p-3 rounded-full w-fit mx-auto mb-3">
                    <ThumbsUp className="h-6 w-6 text-purple-600" />
                  </div>
                  <div className="text-2xl font-bold text-gray-900 mb-1">
                    {Math.round(analysisData.sentiment.score * 100)}%
                  </div>
                  <div className="text-sm text-gray-600">积极情感</div>
                </CardContent>
              </Card>

              <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-orange-500/5 to-red-500/5" />
                <CardContent className="p-6 text-center relative">
                  <div className="bg-gradient-to-r from-orange-100 to-red-100 p-3 rounded-full w-fit mx-auto mb-3">
                    <CheckCircle className="h-6 w-6 text-orange-600" />
                  </div>
                  <div className="text-2xl font-bold text-gray-900 mb-1">
                    {analysisData.actionItems.length}
                  </div>
                  <div className="text-sm text-gray-600">行动建议</div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="insights" className="space-y-6">
            <div className="grid gap-6">
              {analysisData.insights.map((insight, index) => (
                <Card key={index} className="border-0 shadow-xl bg-white/80 backdrop-blur-sm overflow-hidden">
                  <div className={`absolute inset-0 bg-gradient-to-br ${getInsightColor(insight.type)}`} />
                  <CardContent className="p-6 relative">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-3">
                        {getInsightIcon(insight.type)}
                        <h3 className="font-semibold text-gray-900 text-lg">{insight.title}</h3>
                        <Badge variant="outline" className="text-xs">
                          {insight.confidence}% 置信度
                        </Badge>
                      </div>
                      <Badge className={insight.impact === 'high' ? 'bg-red-100 text-red-700' : insight.impact === 'medium' ? 'bg-yellow-100 text-yellow-700' : 'bg-green-100 text-green-700'}>
                        {insight.impact === 'high' ? '高影响' : insight.impact === 'medium' ? '中等影响' : '低影响'}
                      </Badge>
                    </div>
                    <p className="text-gray-700 leading-relaxed text-lg">{insight.content}</p>
                    <div className="mt-4">
                      <Progress value={insight.confidence} className="h-2" />
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="topics" className="space-y-6">
            <Card className="border-0 shadow-xl bg-white/80 backdrop-blur-sm overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 to-purple-500/5" />
              <CardHeader className="relative">
                <CardTitle className="flex items-center gap-2 text-xl">
                  <div className="bg-gradient-to-r from-indigo-500 to-purple-500 p-2 rounded-lg">
                    <Tag className="h-5 w-5 text-white" />
                  </div>
                  主题相关性分析
                </CardTitle>
              </CardHeader>
              <CardContent className="relative">
                <div className="space-y-4">
                  {analysisData.topics.map((topic, index) => (
                    <div key={index} className="flex items-center justify-between p-4 bg-gradient-to-r from-gray-50 to-indigo-50 rounded-lg border border-gray-200/50">
                      <div className="flex items-center gap-3">
                        <div className="w-3 h-3 rounded-full bg-gradient-to-r from-indigo-500 to-purple-500" />
                        <span className="font-medium text-gray-900">{topic.name}</span>
                        <Badge variant="secondary" className="text-xs">
                          {topic.category}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="w-32 bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-gradient-to-r from-indigo-500 to-purple-500 h-2 rounded-full transition-all duration-500" 
                            style={{ width: `${topic.relevance}%` }}
                          />
                        </div>
                        <span className="text-sm text-gray-600 w-12 text-right font-medium">
                          {topic.relevance}%
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="sentiment" className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <Card className="border-0 shadow-xl bg-white/80 backdrop-blur-sm overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-green-500/5 to-emerald-500/5" />
                <CardHeader className="relative">
                  <CardTitle className="flex items-center gap-2">
                    <div className="bg-gradient-to-r from-green-500 to-emerald-500 p-2 rounded-lg">
                      <MessageSquare className="h-5 w-5 text-white" />
                    </div>
                    整体情感倾向
                  </CardTitle>
                </CardHeader>
                <CardContent className="relative">
                  <div className="text-center">
                    <div className="text-5xl font-bold text-green-600 mb-2">
                      {Math.round(analysisData.sentiment.score * 100)}%
                    </div>
                    <div className="text-lg font-medium text-gray-900 capitalize mb-4">
                      积极正面
                    </div>
                    <Progress value={analysisData.sentiment.score * 100} className="w-full h-3" />
                  </div>
                </CardContent>
              </Card>

              <Card className="border-0 shadow-xl bg-white/80 backdrop-blur-sm overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-cyan-500/5" />
                <CardHeader className="relative">
                  <CardTitle className="flex items-center gap-2">
                    <div className="bg-gradient-to-r from-blue-500 to-cyan-500 p-2 rounded-lg">
                      <PieChart className="h-5 w-5 text-white" />
                    </div>
                    情感分布
                  </CardTitle>
                </CardHeader>
                <CardContent className="relative">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-green-600 font-medium flex items-center gap-2">
                        <div className="w-3 h-3 bg-green-500 rounded-full" />
                        积极
                      </span>
                      <span className="font-semibold">{analysisData.sentiment.breakdown.positive}%</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600 font-medium flex items-center gap-2">
                        <div className="w-3 h-3 bg-gray-500 rounded-full" />
                        中性
                      </span>
                      <span className="font-semibold">{analysisData.sentiment.breakdown.neutral}%</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-red-600 font-medium flex items-center gap-2">
                        <div className="w-3 h-3 bg-red-500 rounded-full" />
                        消极
                      </span>
                      <span className="font-semibold">{analysisData.sentiment.breakdown.negative}%</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Emotion Analysis */}
              <Card className="border-0 shadow-xl bg-white/80 backdrop-blur-sm overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-pink-500/5" />
                <CardHeader className="relative">
                  <CardTitle className="flex items-center gap-2">
                    <div className="bg-gradient-to-r from-purple-500 to-pink-500 p-2 rounded-lg">
                      <MessageSquare className="h-5 w-5 text-white" />
                    </div>
                    情绪细分分析
                  </CardTitle>
                </CardHeader>
                <CardContent className="relative">
                  <div className="grid grid-cols-2 gap-4">
                    {analysisData.sentiment.emotions.map((emotion, index) => (
                      <div key={index} className="p-4 bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg border border-purple-200/50">
                        <div className="flex items-center justify-between mb-2">
                          <span className="font-medium text-gray-900">{emotion.emotion}</span>
                          <span className="text-sm font-bold text-purple-600">{emotion.score}%</span>
                        </div>
                        <Progress value={emotion.score} className="h-2" />
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="actions" className="space-y-6">
            <Card className="border-0 shadow-xl bg-white/80 backdrop-blur-sm overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-orange-500/5 to-red-500/5" />
              <CardHeader className="relative">
                <CardTitle className="flex items-center gap-2">
                  <div className="bg-gradient-to-r from-orange-500 to-red-500 p-2 rounded-lg">
                    <Lightbulb className="h-5 w-5 text-white" />
                  </div>
                  推荐行动方案
                  <Badge className="ml-2 bg-gradient-to-r from-orange-100 to-red-100 text-orange-700 border-0">
                    AI建议
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent className="relative">
                <div className="space-y-4">
                  {analysisData.actionItems.map((action, index) => (
                    <div key={index} className="p-6 bg-gradient-to-r from-white to-orange-50/30 rounded-xl border border-orange-200/50 hover:shadow-lg transition-shadow duration-300">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-full flex items-center justify-center text-sm font-bold">
                            {index + 1}
                          </div>
                          <div>
                            <Badge className={getPriorityColor(action.priority)}>
                              {action.priority === 'high' ? '高优先级' : action.priority === 'medium' ? '中优先级' : '低优先级'}
                            </Badge>
                            <Badge variant="secondary" className="ml-2">
                              {action.category}
                            </Badge>
                          </div>
                        </div>
                        <div className="text-sm text-gray-600 bg-gray-100 px-3 py-1 rounded-full">
                          {action.timeline}
                        </div>
                      </div>
                      <p className="text-gray-700 leading-relaxed text-lg">{action.action}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="quotes" className="space-y-6">
            <Card className="border-0 shadow-xl bg-white/80 backdrop-blur-sm overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 to-blue-500/5" />
              <CardHeader className="relative">
                <CardTitle className="flex items-center gap-2">
                  <div className="bg-gradient-to-r from-indigo-500 to-blue-500 p-2 rounded-lg">
                    <MessageSquare className="h-5 w-5 text-white" />
                  </div>
                  关键引用语句
                </CardTitle>
              </CardHeader>
              <CardContent className="relative">
                <div className="space-y-6">
                  {analysisData.keyQuotes.map((quote, index) => (
                    <div key={index} className="p-6 bg-gradient-to-r from-indigo-50 to-blue-50 rounded-xl border border-indigo-200/50">
                      <div className="flex items-start gap-4">
                        <div className="bg-gradient-to-r from-indigo-500 to-blue-500 text-white p-2 rounded-full flex-shrink-0">
                          <MessageSquare className="h-4 w-4" />
                        </div>
                        <div className="flex-1">
                          <blockquote className="text-lg text-gray-800 italic leading-relaxed mb-3">
                            "{quote.text}"
                          </blockquote>
                          <div className="flex items-center justify-between text-sm text-gray-600">
                            <span className="font-medium">{quote.speaker}</span>
                            <div className="flex items-center gap-2">
                              <Clock className="h-3 w-3" />
                              <span>{quote.timestamp}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Related Content */}
            <Card className="border-0 shadow-xl bg-white/80 backdrop-blur-sm overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-green-500/5 to-emerald-500/5" />
              <CardHeader className="relative">
                <CardTitle className="flex items-center gap-2">
                  <div className="bg-gradient-to-r from-green-500 to-emerald-500 p-2 rounded-lg">
                    <BookOpen className="h-5 w-5 text-white" />
                  </div>
                  相关内容推荐
                </CardTitle>
              </CardHeader>
              <CardContent className="relative">
                <div className="grid gap-4">
                  {analysisData.relatedContent.map((content, index) => (
                    <div key={index} className="flex items-center justify-between p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg border border-green-200/50 hover:shadow-md transition-shadow duration-300">
                      <div className="flex items-center gap-3">
                        <div className="bg-gradient-to-r from-green-500 to-emerald-500 p-2 rounded-lg">
                          <FileText className="h-4 w-4 text-white" />
                        </div>
                        <div>
                          <h4 className="font-medium text-gray-900">{content.title}</h4>
                          <Badge variant="secondary" className="text-xs mt-1">
                            {content.type}
                          </Badge>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-gray-600">{content.relevance}% 相关</span>
                        <Button size="sm" variant="outline" className="hover:bg-green-50">
                          查看
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
