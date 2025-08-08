import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { 
  Sparkles, 
  Loader2, 
  CheckCircle, 
  AlertCircle,
  Brain,
  BarChart2,
  FileText,
  MessageSquare,
  Download,
  Share2,
  Copy,
  Globe
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'

export interface AIAnalysisProps {
  contentType: 'file' | 'video' | 'web'
  contentId: string
  contentTitle: string
  contentSource: string
  onAnalysisComplete?: (result: AIAnalysisResult) => void
}

export interface AIAnalysisResult {
  summary: string
  keyInsights: string[]
  topics: {
    name: string
    confidence: number
  }[]
  entities: {
    name: string
    type: string
    mentions: number
  }[]
  sentiment: {
    overall: 'positive' | 'neutral' | 'negative'
    score: number
    breakdown: {
      positive: number
      neutral: number
      negative: number
    }
  }
  readability: {
    score: number
    level: 'easy' | 'medium' | 'difficult'
    averageSentenceLength: number
    complexWordPercentage: number
  }
  keywords: string[]
  questions: string[]
  recommendations: string[]
}

export default function AIAnalysis({
  contentType,
  contentId,
  contentTitle,
  contentSource,
  onAnalysisComplete
}: AIAnalysisProps) {
  const { t } = useTranslation()
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [progress, setProgress] = useState(0)
  const [currentStage, setCurrentStage] = useState('')
  const [activeResultTab, setActiveResultTab] = useState('summary')
  const [analysisResult, setAnalysisResult] = useState<AIAnalysisResult | null>(null)
  const [error, setError] = useState('')

  const simulateAIAnalysis = () => {
    setIsAnalyzing(true)
    setProgress(0)
    setError('')
    
    const stages = [
      t('aiAnalysis.stages.preparing'),
      t('aiAnalysis.stages.processing'),
      t('aiAnalysis.stages.analyzing'),
      t('aiAnalysis.stages.extracting'),
      t('aiAnalysis.stages.generating'),
      t('aiAnalysis.stages.complete')
    ]
    
    let currentStageIndex = 0
    setCurrentStage(stages[currentStageIndex])
    
    const interval = setInterval(() => {
      setProgress((prev) => {
        const increment = Math.random() * 12
        const newProgress = Math.min(prev + increment, 95)
        
        // Update stage based on progress
        const stageThreshold = 95 / (stages.length - 1)
        const newStageIndex = Math.min(
          Math.floor(newProgress / stageThreshold),
          stages.length - 1
        )
        
        if (newStageIndex > currentStageIndex) {
          currentStageIndex = newStageIndex
          setCurrentStage(stages[currentStageIndex])
        }
        
        return newProgress
      })
    }, 800)
    
    // Simulate completion after 8-10 seconds
    setTimeout(() => {
      clearInterval(interval)
      setProgress(100)
      setCurrentStage(stages[stages.length - 1])
      
      // Generate mock analysis result
      const mockResult: AIAnalysisResult = {
        summary: t('aiAnalysis.locale') === 'zh' 
          ? '这份内容深入探讨了人工智能在内容分析领域的应用，重点关注自然语言处理和机器学习技术如何从大量非结构化数据中提取有价值的洞察。文章讨论了当前AI内容分析工具的优势和局限性，并提供了几个实际应用案例，展示了这些技术如何帮助企业提高效率、降低成本并做出更明智的决策。作者还探讨了未来发展趋势，包括多模态分析和实时处理能力的进步。' 
          : 'This content explores the application of artificial intelligence in content analysis, focusing on how natural language processing and machine learning technologies extract valuable insights from large volumes of unstructured data. The article discusses the advantages and limitations of current AI content analysis tools and provides several practical use cases demonstrating how these technologies help businesses improve efficiency, reduce costs, and make more informed decisions. The author also explores future trends, including advances in multimodal analysis and real-time processing capabilities.',
        keyInsights: t('aiAnalysis.locale') === 'zh' 
          ? [
              'AI内容分析工具可以处理和理解大量非结构化数据，节省人工分析时间',
              '自然语言处理技术能够识别文本中的情感、主题和关键实体',
              '机器学习算法通过识别模式和趋势提供预测性洞察',
              '多模态分析将成为未来发展方向，能够同时处理文本、图像和音频数据',
              '实时处理能力的提升将使即时内容分析成为可能'
            ] 
          : [
              'AI content analysis tools can process and understand large volumes of unstructured data, saving manual analysis time',
              'Natural language processing technologies can identify sentiment, topics, and key entities in text',
              'Machine learning algorithms provide predictive insights by identifying patterns and trends',
              'Multimodal analysis will be a future direction, capable of processing text, image, and audio data simultaneously',
              'Improvements in real-time processing capabilities will make instant content analysis possible'
            ],
        topics: [
          {
            name: t('aiAnalysis.locale') === 'zh' ? '人工智能技术' : 'Artificial Intelligence Technology',
            confidence: 0.92
          },
          {
            name: t('aiAnalysis.locale') === 'zh' ? '内容分析方法' : 'Content Analysis Methods',
            confidence: 0.87
          },
          {
            name: t('aiAnalysis.locale') === 'zh' ? '自然语言处理' : 'Natural Language Processing',
            confidence: 0.85
          },
          {
            name: t('aiAnalysis.locale') === 'zh' ? '商业应用案例' : 'Business Use Cases',
            confidence: 0.78
          },
          {
            name: t('aiAnalysis.locale') === 'zh' ? '未来技术趋势' : 'Future Technology Trends',
            confidence: 0.72
          }
        ],
        entities: [
          {
            name: t('aiAnalysis.locale') === 'zh' ? '人工智能' : 'Artificial Intelligence',
            type: t('aiAnalysis.locale') === 'zh' ? '技术' : 'Technology',
            mentions: 24
          },
          {
            name: t('aiAnalysis.locale') === 'zh' ? '自然语言处理' : 'Natural Language Processing',
            type: t('aiAnalysis.locale') === 'zh' ? '技术' : 'Technology',
            mentions: 18
          },
          {
            name: t('aiAnalysis.locale') === 'zh' ? '机器学习' : 'Machine Learning',
            type: t('aiAnalysis.locale') === 'zh' ? '技术' : 'Technology',
            mentions: 15
          },
          {
            name: 'OpenAI',
            type: t('aiAnalysis.locale') === 'zh' ? '组织' : 'Organization',
            mentions: 7
          },
          {
            name: 'GPT-4',
            type: t('aiAnalysis.locale') === 'zh' ? '产品' : 'Product',
            mentions: 5
          }
        ],
        sentiment: {
          overall: 'positive',
          score: 0.68,
          breakdown: {
            positive: 0.72,
            neutral: 0.23,
            negative: 0.05
          }
        },
        readability: {
          score: 65,
          level: 'medium',
          averageSentenceLength: 18.5,
          complexWordPercentage: 22.3
        },
        keywords: t('aiAnalysis.locale') === 'zh' 
          ? ['人工智能', '内容分析', '自然语言处理', '机器学习', '数据洞察', '效率', '决策支持', '多模态分析', '实时处理'] 
          : ['artificial intelligence', 'content analysis', 'natural language processing', 'machine learning', 'data insights', 'efficiency', 'decision support', 'multimodal analysis', 'real-time processing'],
        questions: t('aiAnalysis.locale') === 'zh' 
          ? [
              '如何选择适合特定业务需求的AI内容分析工具？',
              '实施AI内容分析解决方案的主要挑战是什么？',
              '如何评估AI内容分析的准确性和可靠性？',
              '小型企业如何利用AI内容分析技术？',
              '多模态分析将如何改变内容分析领域？'
            ] 
          : [
              'How to choose AI content analysis tools suitable for specific business needs?',
              'What are the main challenges in implementing AI content analysis solutions?',
              'How to evaluate the accuracy and reliability of AI content analysis?',
              'How can small businesses leverage AI content analysis technologies?',
              'How will multimodal analysis change the field of content analysis?'
            ],
        recommendations: t('aiAnalysis.locale') === 'zh' 
          ? [
              '考虑实施混合分析方法，结合AI自动化和人工专家审查',
              '投资于专门针对您行业的AI内容分析工具',
              '建立明确的内容分析目标和KPI以衡量成功',
              '开始小规模试点项目，然后再扩大实施范围',
              '持续监控和优化AI模型以提高准确性'
            ] 
          : [
              'Consider implementing a hybrid analysis approach, combining AI automation with human expert review',
              'Invest in AI content analysis tools specifically tailored to your industry',
              'Establish clear content analysis goals and KPIs to measure success',
              'Start with small pilot projects before scaling implementation',
              'Continuously monitor and optimize AI models to improve accuracy'
            ]
      }
      
      setAnalysisResult(mockResult)
      if (onAnalysisComplete) {
        onAnalysisComplete(mockResult)
      }
      
      setTimeout(() => {
        setIsAnalyzing(false)
      }, 1000)
    }, 9000)
  }

  const handleRetry = () => {
    simulateAIAnalysis()
  }

  const getContentTypeIcon = () => {
    switch (contentType) {
      case 'file':
        return <FileText className="h-5 w-5" />
      case 'video':
        return <MessageSquare className="h-5 w-5" />
      case 'web':
        return <Globe className="h-5 w-5" />
      default:
        return <FileText className="h-5 w-5" />
    }
  }

  return (
    <div className="w-full">
      {isAnalyzing ? (
        <Card className="border border-blue-200 shadow-lg bg-gradient-to-r from-blue-50 to-purple-50">
          <CardContent className="pt-6">
            <div className="flex flex-col items-center text-center">
              <div className="relative w-16 h-16 mb-4">
                <div className="absolute inset-0 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 opacity-20 animate-ping" />
                <div className="absolute inset-0 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 opacity-30 animate-pulse" />
                <div className="relative flex items-center justify-center w-full h-full rounded-full bg-white shadow-md">
                  <Loader2 className="h-8 w-8 text-blue-600 animate-spin" />
                </div>
              </div>
              
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                {t('aiAnalysis.analyzing')}
              </h3>
              <p className="text-gray-600 mb-4">
                {currentStage}
              </p>
              
              <Progress value={progress} className="w-full max-w-md mb-4" />
              
              <div className="text-sm text-gray-500">
                {t('aiAnalysis.timeEstimate')}
              </div>
            </div>
          </CardContent>
        </Card>
      ) : error ? (
        <Card className="border border-red-200 shadow-lg">
          <CardContent className="pt-6">
            <div className="flex flex-col items-center text-center">
              <div className="w-16 h-16 rounded-full bg-red-100 flex items-center justify-center mb-4">
                <AlertCircle className="h-8 w-8 text-red-600" />
              </div>
              
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                {t('aiAnalysis.error.title')}
              </h3>
              <p className="text-gray-600 mb-6">
                {error}
              </p>
              
              <Button onClick={handleRetry} variant="outline" className="border-2 border-red-200 hover:bg-red-50">
                {t('aiAnalysis.error.retry')}
              </Button>
            </div>
          </CardContent>
        </Card>
      ) : analysisResult ? (
        <Card className="border-0 shadow-xl overflow-hidden">
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-4">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded overflow-hidden bg-white flex items-center justify-center flex-shrink-0">
                <Brain className="h-6 w-6 text-blue-600" />
              </div>
              <div className="flex-1 text-white">
                <div className="flex items-center gap-2">
                  <h3 className="font-semibold text-lg line-clamp-1">{t('aiAnalysis.results.title')}</h3>
                  <Badge variant="secondary" className="bg-white/20 text-white">
                    {t(`aiAnalysis.contentType.${contentType}`)}
                  </Badge>
                </div>
                <div className="flex items-center gap-2 text-sm text-white/80">
                  {getContentTypeIcon()}
                  <span className="truncate">{contentTitle}</span>
                </div>
              </div>
              <div className="flex gap-2">
                <Button variant="ghost" size="icon" className="h-8 w-8 text-white hover:bg-white/20">
                  <Download className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="icon" className="h-8 w-8 text-white hover:bg-white/20">
                  <Share2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
          
          <Tabs value={activeResultTab} onValueChange={setActiveResultTab} className="w-full">
            <TabsList className="grid w-full grid-cols-5 bg-gray-100">
              <TabsTrigger value="summary">
                {t('aiAnalysis.tabs.summary')}
              </TabsTrigger>
              <TabsTrigger value="insights">
                {t('aiAnalysis.tabs.insights')}
              </TabsTrigger>
              <TabsTrigger value="topics">
                {t('aiAnalysis.tabs.topics')}
              </TabsTrigger>
              <TabsTrigger value="sentiment">
                {t('aiAnalysis.tabs.sentiment')}
              </TabsTrigger>
              <TabsTrigger value="recommendations">
                {t('aiAnalysis.tabs.recommendations')}
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="summary" className="p-6">
              <h4 className="font-medium text-lg mb-3 text-gray-900">
                {t('aiAnalysis.summary.title')}
              </h4>
              <p className="text-gray-700 mb-6 leading-relaxed">
                {analysisResult.summary}
              </p>
              
              <h4 className="font-medium text-lg mb-3 text-gray-900">
                {t('aiAnalysis.summary.keyInsights')}
              </h4>
              <ul className="space-y-2">
                {analysisResult.keyInsights.map((insight, index) => (
                  <li key={index} className="flex items-start gap-2">
                    <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-700">{insight}</span>
                  </li>
                ))}
              </ul>
              
              <div className="mt-6">
                <h4 className="font-medium text-lg mb-3 text-gray-900">
                  {t('aiAnalysis.summary.keywords')}
                </h4>
                <div className="flex flex-wrap gap-2">
                  {analysisResult.keywords.map((keyword, index) => (
                    <Badge key={index} variant="secondary" className="bg-blue-100 text-blue-800 hover:bg-blue-200">
                      {keyword}
                    </Badge>
                  ))}
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="insights" className="p-6">
              <div className="grid gap-6">
                <div>
                  <h4 className="font-medium text-lg mb-3 text-gray-900">
                    {t('aiAnalysis.insights.questions')}
                  </h4>
                  <ul className="space-y-3">
                    {analysisResult.questions.map((question, index) => (
                      <li key={index} className="bg-gray-50 p-3 rounded-lg border border-gray-200">
                        <div className="flex items-start gap-2">
                          <span className="bg-blue-100 text-blue-800 rounded-full w-6 h-6 flex items-center justify-center flex-shrink-0 mt-0.5">
                            {index + 1}
                          </span>
                          <span className="text-gray-700">{question}</span>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
                
                <div>
                  <h4 className="font-medium text-lg mb-3 text-gray-900">
                    {t('aiAnalysis.insights.entities')}
                  </h4>
                  <div className="overflow-x-auto">
                    <table className="w-full border-collapse">
                      <thead>
                        <tr className="bg-gray-50">
                          <th className="text-left p-2 border border-gray-200">{t('aiAnalysis.insights.entityName')}</th>
                          <th className="text-left p-2 border border-gray-200">{t('aiAnalysis.insights.entityType')}</th>
                          <th className="text-left p-2 border border-gray-200">{t('aiAnalysis.insights.mentions')}</th>
                        </tr>
                      </thead>
                      <tbody>
                        {analysisResult.entities.map((entity, index) => (
                          <tr key={index} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                            <td className="p-2 border border-gray-200 font-medium">{entity.name}</td>
                            <td className="p-2 border border-gray-200">{entity.type}</td>
                            <td className="p-2 border border-gray-200">{entity.mentions}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="topics" className="p-6">
              <div className="grid gap-6">
                <div>
                  <h4 className="font-medium text-lg mb-3 text-gray-900">
                    {t('aiAnalysis.topics.mainTopics')}
                  </h4>
                  <div className="space-y-4">
                    {analysisResult.topics.map((topic, index) => (
                      <div key={index} className="bg-white p-3 rounded-lg border border-gray-200">
                        <div className="flex items-center justify-between mb-2">
                          <span className="font-medium">{topic.name}</span>
                          <span className="text-sm text-gray-500">
                            {t('aiAnalysis.topics.confidence')}: {Math.round(topic.confidence * 100)}%
                          </span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2.5">
                          <div 
                            className="bg-blue-600 h-2.5 rounded-full" 
                            style={{ width: `${topic.confidence * 100}%` }}
                          ></div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div>
                  <h4 className="font-medium text-lg mb-3 text-gray-900">
                    {t('aiAnalysis.topics.readability')}
                  </h4>
                  <div className="bg-white p-4 rounded-lg border border-gray-200">
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <div className="text-sm text-gray-500 mb-1">{t('aiAnalysis.topics.readabilityScore')}</div>
                        <div className="text-2xl font-bold">{analysisResult.readability.score}/100</div>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className={`w-3 h-3 rounded-full ${
                          analysisResult.readability.level === 'easy' ? 'bg-green-500' :
                          analysisResult.readability.level === 'difficult' ? 'bg-red-500' : 'bg-yellow-500'
                        }`} />
                        <span className="capitalize">{analysisResult.readability.level}</span>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <div className="text-gray-500 mb-1">{t('aiAnalysis.topics.avgSentenceLength')}</div>
                        <div className="font-medium">{analysisResult.readability.averageSentenceLength} {t('aiAnalysis.topics.words')}</div>
                      </div>
                      <div>
                        <div className="text-gray-500 mb-1">{t('aiAnalysis.topics.complexWords')}</div>
                        <div className="font-medium">{analysisResult.readability.complexWordPercentage}%</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="sentiment" className="p-6">
              <div className="grid gap-6">
                <div>
                  <h4 className="font-medium text-lg mb-3 text-gray-900">
                    {t('aiAnalysis.sentiment.overall')}
                  </h4>
                  <div className="bg-white p-4 rounded-lg border border-gray-200 flex items-center justify-between">
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <div className={`w-3 h-3 rounded-full ${
                          analysisResult.sentiment.overall === 'positive' ? 'bg-green-500' :
                          analysisResult.sentiment.overall === 'negative' ? 'bg-red-500' : 'bg-yellow-500'
                        }`} />
                        <span className="font-medium capitalize">{analysisResult.sentiment.overall}</span>
                      </div>
                      <div className="text-sm text-gray-500">
                        {t('aiAnalysis.sentiment.score')}: {Math.round(analysisResult.sentiment.score * 100)}%
                      </div>
                    </div>
                    <div className="w-16 h-16 rounded-full border-4 border-blue-500 flex items-center justify-center">
                      <span className="text-xl font-bold">{Math.round(analysisResult.sentiment.score * 100)}</span>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h4 className="font-medium text-lg mb-3 text-gray-900">
                    {t('aiAnalysis.sentiment.breakdown')}
                  </h4>
                  <div className="bg-white p-4 rounded-lg border border-gray-200">
                    <div className="space-y-4">
                      <div>
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-green-700">{t('aiAnalysis.sentiment.positive')}</span>
                          <span>{Math.round(analysisResult.sentiment.breakdown.positive * 100)}%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2.5">
                          <div 
                            className="bg-green-500 h-2.5 rounded-full" 
                            style={{ width: `${analysisResult.sentiment.breakdown.positive * 100}%` }}
                          ></div>
                        </div>
                      </div>
                      
                      <div>
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-yellow-700">{t('aiAnalysis.sentiment.neutral')}</span>
                          <span>{Math.round(analysisResult.sentiment.breakdown.neutral * 100)}%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2.5">
                          <div 
                            className="bg-yellow-500 h-2.5 rounded-full" 
                            style={{ width: `${analysisResult.sentiment.breakdown.neutral * 100}%` }}
                          ></div>
                        </div>
                      </div>
                      
                      <div>
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-red-700">{t('aiAnalysis.sentiment.negative')}</span>
                          <span>{Math.round(analysisResult.sentiment.breakdown.negative * 100)}%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2.5">
                          <div 
                            className="bg-red-500 h-2.5 rounded-full" 
                            style={{ width: `${analysisResult.sentiment.breakdown.negative * 100}%` }}
                          ></div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="recommendations" className="p-6">
              <h4 className="font-medium text-lg mb-3 text-gray-900">
                {t('aiAnalysis.recommendations.title')}
              </h4>
              <div className="space-y-4">
                {analysisResult.recommendations.map((recommendation, index) => (
                  <div key={index} className="bg-white p-4 rounded-lg border border-gray-200 hover:border-blue-300 hover:bg-blue-50/30 transition-colors duration-200">
                    <div className="flex items-start gap-3">
                      <div className="bg-blue-100 text-blue-800 rounded-full w-6 h-6 flex items-center justify-center flex-shrink-0 mt-0.5">
                        {index + 1}
                      </div>
                      <div>
                        <p className="text-gray-700">{recommendation}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="mt-6 flex justify-end gap-3">
                <Button variant="outline" size="sm" className="flex items-center gap-2">
                  <Copy className="h-4 w-4" />
                  {t('aiAnalysis.recommendations.copyAll')}
                </Button>
                <Button variant="outline" size="sm" className="flex items-center gap-2">
                  <Download className="h-4 w-4" />
                  {t('aiAnalysis.recommendations.download')}
                </Button>
              </div>
            </TabsContent>
          </Tabs>
        </Card>
      ) : (
        <Card className="border border-blue-200 shadow-lg bg-white">
          <CardContent className="pt-6">
            <div className="flex flex-col items-center text-center">
              <div className="w-16 h-16 rounded-full bg-gradient-to-r from-blue-100 to-purple-100 flex items-center justify-center mb-4 shadow-inner">
                <Brain className="h-8 w-8 text-blue-600" />
              </div>
              
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                {t('aiAnalysis.start.title')}
              </h3>
              <p className="text-gray-600 mb-6 max-w-md">
                {t('aiAnalysis.start.description')}
              </p>
              
              <Button 
                onClick={simulateAIAnalysis}
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white"
              >
                <Sparkles className="h-5 w-5 mr-2" />
                {t('aiAnalysis.start.button')}
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
