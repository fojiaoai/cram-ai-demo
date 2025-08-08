import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { 
  Globe, 
  Loader2, 
  CheckCircle, 
  AlertCircle,
  FileText,
  Link as LinkIcon,
  Tag,
  BarChart2,
  Download,
  ExternalLink
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'

interface WebParserProps {
  webUrl: string
  onAnalysisComplete: (data: WebAnalysisResult) => void
}

export interface WebAnalysisResult {
  title: string
  url: string
  favicon: string
  content: string
  summary: string
  mainPoints: string[]
  keywords: string[]
  links: {
    url: string
    title: string
    type: 'internal' | 'external'
  }[]
  readability: 'easy' | 'medium' | 'difficult'
  wordCount: number
  imageCount: number
}

export default function WebParser({ webUrl, onAnalysisComplete }: WebParserProps) {
  const { t } = useTranslation()
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [progress, setProgress] = useState(0)
  const [currentStage, setCurrentStage] = useState('')
  const [activeResultTab, setActiveResultTab] = useState('summary')
  const [analysisResult, setAnalysisResult] = useState<WebAnalysisResult | null>(null)
  const [error, setError] = useState('')

  const simulateWebAnalysis = () => {
    setIsAnalyzing(true)
    setProgress(0)
    setError('')
    
    const stages = [
      t('webParser.stages.fetching'),
      t('webParser.stages.extracting'),
      t('webParser.stages.parsing'),
      t('webParser.stages.analyzing'),
      t('webParser.stages.summarizing'),
      t('webParser.stages.complete')
    ]
    
    let currentStageIndex = 0
    setCurrentStage(stages[currentStageIndex])
    
    const interval = setInterval(() => {
      setProgress((prev) => {
        const increment = Math.random() * 15
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
    
    // Simulate completion after 5-7 seconds
    setTimeout(() => {
      clearInterval(interval)
      setProgress(100)
      setCurrentStage(stages[stages.length - 1])
      
      // Generate mock analysis result
      const mockResult: WebAnalysisResult = {
        title: webUrl.includes('example.com') 
          ? 'Understanding AI-Powered Content Analysis' 
          : 'AI驱动的内容分析技术解析',
        url: webUrl,
        favicon: 'https://www.google.com/favicon.ico',
        content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam euismod, nisl eget aliquam ultricies, nunc nisl aliquet nunc, quis aliquam nisl nunc quis nisl. Nullam euismod, nisl eget aliquam ultricies, nunc nisl aliquet nunc, quis aliquam nisl nunc quis nisl.',
        summary: t('webParser.locale') === 'zh' 
          ? '这篇文章深入探讨了AI驱动的内容分析技术如何彻底改变企业处理和理解大量数据的方式。作者详细介绍了自然语言处理、机器学习和深度学习技术如何协同工作，从非结构化文本中提取有价值的洞察。文章还讨论了这些技术在不同行业的实际应用案例，以及它们如何帮助企业做出更明智的决策。' 
          : 'This article explores how AI-powered content analysis is revolutionizing the way businesses process and understand large volumes of data. The author details how natural language processing, machine learning, and deep learning technologies work together to extract valuable insights from unstructured text. The article also discusses practical applications of these technologies across different industries and how they help businesses make more informed decisions.',
        mainPoints: t('webParser.locale') === 'zh' 
          ? [
              'AI内容分析技术可以处理和理解大量非结构化数据',
              '自然语言处理是AI内容分析的核心技术之一',
              '机器学习算法可以从文本中识别模式和趋势',
              '企业可以利用这些技术做出更明智的决策',
              '不同行业都有AI内容分析的实际应用案例'
            ] 
          : [
              'AI content analysis can process and understand large volumes of unstructured data',
              'Natural language processing is a core technology in AI content analysis',
              'Machine learning algorithms can identify patterns and trends in text',
              'Businesses can use these technologies to make more informed decisions',
              'There are practical applications of AI content analysis across different industries'
            ],
        keywords: t('webParser.locale') === 'zh' 
          ? ['人工智能', '内容分析', '自然语言处理', '机器学习', '数据洞察', '决策支持'] 
          : ['artificial intelligence', 'content analysis', 'natural language processing', 'machine learning', 'data insights', 'decision support'],
        links: [
          {
            url: 'https://example.com/ai-basics',
            title: t('webParser.locale') === 'zh' ? 'AI基础知识' : 'AI Basics',
            type: 'internal'
          },
          {
            url: 'https://example.com/nlp-guide',
            title: t('webParser.locale') === 'zh' ? 'NLP指南' : 'NLP Guide',
            type: 'internal'
          },
          {
            url: 'https://openai.com',
            title: 'OpenAI',
            type: 'external'
          },
          {
            url: 'https://example.com/case-studies',
            title: t('webParser.locale') === 'zh' ? '案例研究' : 'Case Studies',
            type: 'internal'
          }
        ],
        readability: 'medium',
        wordCount: 1250,
        imageCount: 4
      }
      
      setAnalysisResult(mockResult)
      onAnalysisComplete(mockResult)
      
      setTimeout(() => {
        setIsAnalyzing(false)
      }, 1000)
    }, 6000)
  }

  const handleRetry = () => {
    simulateWebAnalysis()
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
                {t('webParser.analyzing')}
              </h3>
              <p className="text-gray-600 mb-4">
                {currentStage}
              </p>
              
              <Progress value={progress} className="w-full max-w-md mb-4" />
              
              <div className="text-sm text-gray-500">
                {t('webParser.timeEstimate')}
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
                {t('webParser.error.title')}
              </h3>
              <p className="text-gray-600 mb-6">
                {error}
              </p>
              
              <Button onClick={handleRetry} variant="outline" className="border-2 border-red-200 hover:bg-red-50">
                {t('webParser.error.retry')}
              </Button>
            </div>
          </CardContent>
        </Card>
      ) : analysisResult ? (
        <Card className="border-0 shadow-xl overflow-hidden">
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-4">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded overflow-hidden bg-white flex items-center justify-center flex-shrink-0">
                {analysisResult.favicon ? (
                  <img 
                    src={analysisResult.favicon} 
                    alt="Site favicon"
                    className="w-6 h-6 object-contain"
                  />
                ) : (
                  <Globe className="h-6 w-6 text-blue-600" />
                )}
              </div>
              <div className="flex-1 text-white">
                <h3 className="font-semibold text-lg line-clamp-1">{analysisResult.title}</h3>
                <div className="flex items-center gap-2 text-sm text-white/80">
                  <LinkIcon className="h-3.5 w-3.5" />
                  <span className="truncate">{analysisResult.url}</span>
                </div>
              </div>
            </div>
          </div>
          
          <Tabs value={activeResultTab} onValueChange={setActiveResultTab} className="w-full">
            <TabsList className="grid w-full grid-cols-4 bg-gray-100">
              <TabsTrigger value="summary">
                {t('webParser.tabs.summary')}
              </TabsTrigger>
              <TabsTrigger value="content">
                {t('webParser.tabs.content')}
              </TabsTrigger>
              <TabsTrigger value="links">
                {t('webParser.tabs.links')}
              </TabsTrigger>
              <TabsTrigger value="insights">
                {t('webParser.tabs.insights')}
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="summary" className="p-6">
              <h4 className="font-medium text-lg mb-3 text-gray-900">
                {t('webParser.summary.title')}
              </h4>
              <p className="text-gray-700 mb-6 leading-relaxed">
                {analysisResult.summary}
              </p>
              
              <h4 className="font-medium text-lg mb-3 text-gray-900">
                {t('webParser.summary.keyPoints')}
              </h4>
              <ul className="space-y-2">
                {analysisResult.mainPoints.map((point, index) => (
                  <li key={index} className="flex items-start gap-2">
                    <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-700">{point}</span>
                  </li>
                ))}
              </ul>
              
              <div className="mt-6">
                <h4 className="font-medium text-lg mb-3 text-gray-900">
                  {t('webParser.summary.keywords')}
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
            
            <TabsContent value="content" className="p-6">
              <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 max-h-80 overflow-y-auto">
                <p className="text-gray-700 whitespace-pre-line">
                  {analysisResult.content}
                </p>
              </div>
              <div className="mt-4 flex justify-end">
                <Button variant="outline" size="sm">
                  <Download className="h-4 w-4 mr-2" />
                  {t('webParser.content.download')}
                </Button>
              </div>
            </TabsContent>
            
            <TabsContent value="links" className="p-6">
              <div className="grid gap-4">
                <div>
                  <h4 className="font-medium text-lg mb-3 text-gray-900">
                    {t('webParser.links.internal')}
                  </h4>
                  <div className="space-y-2">
                    {analysisResult.links
                      .filter(link => link.type === 'internal')
                      .map((link, index) => (
                        <div 
                          key={index}
                          className="flex items-center gap-2 p-2 rounded-lg border border-gray-200 hover:bg-gray-50"
                        >
                          <LinkIcon className="h-4 w-4 text-blue-600" />
                          <span className="text-blue-600 font-medium">{link.title}</span>
                          <span className="text-gray-500 text-sm truncate flex-1">{link.url}</span>
                          <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                            <ExternalLink className="h-4 w-4" />
                          </Button>
                        </div>
                      ))}
                  </div>
                </div>
                
                <div>
                  <h4 className="font-medium text-lg mb-3 text-gray-900">
                    {t('webParser.links.external')}
                  </h4>
                  <div className="space-y-2">
                    {analysisResult.links
                      .filter(link => link.type === 'external')
                      .map((link, index) => (
                        <div 
                          key={index}
                          className="flex items-center gap-2 p-2 rounded-lg border border-gray-200 hover:bg-gray-50"
                        >
                          <Globe className="h-4 w-4 text-purple-600" />
                          <span className="text-purple-600 font-medium">{link.title}</span>
                          <span className="text-gray-500 text-sm truncate flex-1">{link.url}</span>
                          <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                            <ExternalLink className="h-4 w-4" />
                          </Button>
                        </div>
                      ))}
                  </div>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="insights" className="p-6">
              <div className="grid grid-cols-2 gap-6">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base font-medium">
                      {t('webParser.insights.readability')}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center gap-2">
                      <div className={`w-3 h-3 rounded-full ${
                        analysisResult.readability === 'easy' ? 'bg-green-500' :
                        analysisResult.readability === 'difficult' ? 'bg-red-500' : 'bg-yellow-500'
                      }`} />
                      <span className="capitalize">{analysisResult.readability}</span>
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base font-medium">
                      {t('webParser.insights.stats')}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-gray-600">{t('webParser.insights.wordCount')}</span>
                        <span className="font-medium">{analysisResult.wordCount}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-gray-600">{t('webParser.insights.imageCount')}</span>
                        <span className="font-medium">{analysisResult.imageCount}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </Card>
      ) : (
        <Card className="border border-blue-200 shadow-lg bg-white">
          <CardContent className="pt-6">
            <div className="flex flex-col items-center text-center">
              <div className="w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center mb-4">
                <Globe className="h-8 w-8 text-blue-600" />
              </div>
              
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                {t('webParser.start.title')}
              </h3>
              <p className="text-gray-600 mb-6 max-w-md">
                {t('webParser.start.description')}
              </p>
              
              <Button 
                onClick={simulateWebAnalysis}
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white"
              >
                {t('webParser.start.button')}
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}