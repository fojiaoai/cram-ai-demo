import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { 
  PlayCircle, 
  Loader2, 
  CheckCircle, 
  AlertCircle,
  Clock,
  MessageSquare,
  Tag,
  BarChart2
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

interface VideoParserProps {
  videoUrl: string
  onAnalysisComplete: (data: VideoAnalysisResult) => void
}

export interface VideoAnalysisResult {
  title: string
  duration: string
  thumbnailUrl: string
  transcript: string
  summary: string
  keyTopics: string[]
  sentiment: 'positive' | 'neutral' | 'negative'
  keywords: string[]
}

export default function VideoParser({ videoUrl, onAnalysisComplete }: VideoParserProps) {
  const { t } = useTranslation()
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [progress, setProgress] = useState(0)
  const [currentStage, setCurrentStage] = useState('')
  const [activeResultTab, setActiveResultTab] = useState('summary')
  const [analysisResult, setAnalysisResult] = useState<VideoAnalysisResult | null>(null)
  const [error, setError] = useState('')

  const simulateVideoAnalysis = () => {
    setIsAnalyzing(true)
    setProgress(0)
    setError('')
    
    const stages = [
      t('videoParser.stages.fetching'),
      t('videoParser.stages.extracting'),
      t('videoParser.stages.transcribing'),
      t('videoParser.stages.analyzing'),
      t('videoParser.stages.summarizing'),
      t('videoParser.stages.complete')
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
    
    // Simulate completion after 6-8 seconds
    setTimeout(() => {
      clearInterval(interval)
      setProgress(100)
      setCurrentStage(stages[stages.length - 1])
      
      // Generate mock analysis result
      const mockResult: VideoAnalysisResult = {
        title: videoUrl.includes('youtube') 
          ? 'How AI is Transforming Content Analysis' 
          : 'AI技术如何改变内容分析',
        duration: '12:34',
        thumbnailUrl: 'https://images.unsplash.com/photo-1591267990532-e5bdb1b0ceb8?w=640&q=80',
        transcript: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam euismod, nisl eget aliquam ultricies, nunc nisl aliquet nunc, quis aliquam nisl nunc quis nisl. Nullam euismod, nisl eget aliquam ultricies, nunc nisl aliquet nunc, quis aliquam nisl nunc quis nisl.',
        summary: t('videoParser.locale') === 'zh' 
          ? '这个视频详细介绍了AI如何彻底改变内容分析领域。主讲人探讨了机器学习算法如何能够从大量非结构化数据中提取关键见解，并展示了几个实际应用案例。视频强调了自动化内容分析如何帮助企业节省时间、提高效率并发现传统方法可能错过的模式。' 
          : 'This video provides a detailed overview of how AI is revolutionizing the field of content analysis. The presenter discusses how machine learning algorithms can extract key insights from large volumes of unstructured data and demonstrates several practical use cases. The video emphasizes how automated content analysis helps businesses save time, improve efficiency, and discover patterns that traditional methods might miss.',
        keyTopics: t('videoParser.locale') === 'zh' 
          ? ['人工智能基础', '机器学习模型', '自然语言处理', '内容分析工具', '商业应用'] 
          : ['AI Fundamentals', 'Machine Learning Models', 'Natural Language Processing', 'Content Analysis Tools', 'Business Applications'],
        sentiment: 'positive',
        keywords: t('videoParser.locale') === 'zh' 
          ? ['人工智能', '内容分析', '机器学习', '自动化', '效率', '数据洞察'] 
          : ['artificial intelligence', 'content analysis', 'machine learning', 'automation', 'efficiency', 'data insights']
      }
      
      setAnalysisResult(mockResult)
      onAnalysisComplete(mockResult)
      
      setTimeout(() => {
        setIsAnalyzing(false)
      }, 1000)
    }, 7000)
  }

  const handleRetry = () => {
    simulateVideoAnalysis()
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
                {t('videoParser.analyzing')}
              </h3>
              <p className="text-gray-600 mb-4">
                {currentStage}
              </p>
              
              <Progress value={progress} className="w-full max-w-md mb-4" />
              
              <div className="text-sm text-gray-500">
                {t('videoParser.timeEstimate')}
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
                {t('videoParser.error.title')}
              </h3>
              <p className="text-gray-600 mb-6">
                {error}
              </p>
              
              <Button onClick={handleRetry} variant="outline" className="border-2 border-red-200 hover:bg-red-50">
                {t('videoParser.error.retry')}
              </Button>
            </div>
          </CardContent>
        </Card>
      ) : analysisResult ? (
        <Card className="border-0 shadow-xl overflow-hidden">
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-4">
            <div className="flex items-center gap-4">
              <div className="w-24 h-16 rounded overflow-hidden bg-black/20 flex-shrink-0">
                <img 
                  src={analysisResult.thumbnailUrl} 
                  alt={analysisResult.title}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="flex-1 text-white">
                <h3 className="font-semibold text-lg line-clamp-1">{analysisResult.title}</h3>
                <div className="flex items-center gap-3 text-sm text-white/80">
                  <div className="flex items-center gap-1">
                    <Clock className="h-3.5 w-3.5" />
                    <span>{analysisResult.duration}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <MessageSquare className="h-3.5 w-3.5" />
                    <span>{t('videoParser.locale') === 'zh' ? '已转录' : 'Transcribed'}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <Tabs value={activeResultTab} onValueChange={setActiveResultTab} className="w-full">
            <TabsList className="grid w-full grid-cols-4 bg-gray-100">
              <TabsTrigger value="summary">
                {t('videoParser.tabs.summary')}
              </TabsTrigger>
              <TabsTrigger value="transcript">
                {t('videoParser.tabs.transcript')}
              </TabsTrigger>
              <TabsTrigger value="topics">
                {t('videoParser.tabs.topics')}
              </TabsTrigger>
              <TabsTrigger value="insights">
                {t('videoParser.tabs.insights')}
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="summary" className="p-6">
              <h4 className="font-medium text-lg mb-3 text-gray-900">
                {t('videoParser.summary.title')}
              </h4>
              <p className="text-gray-700 mb-6 leading-relaxed">
                {analysisResult.summary}
              </p>
              
              <h4 className="font-medium text-lg mb-3 text-gray-900">
                {t('videoParser.summary.keyPoints')}
              </h4>
              <ul className="space-y-2">
                {analysisResult.keyTopics.map((topic, index) => (
                  <li key={index} className="flex items-start gap-2">
                    <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-700">{topic}</span>
                  </li>
                ))}
              </ul>
            </TabsContent>
            
            <TabsContent value="transcript" className="p-6">
              <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 max-h-80 overflow-y-auto">
                <p className="text-gray-700 whitespace-pre-line">
                  {analysisResult.transcript}
                </p>
              </div>
              <div className="mt-4 flex justify-end">
                <Button variant="outline" size="sm">
                  {t('videoParser.transcript.download')}
                </Button>
              </div>
            </TabsContent>
            
            <TabsContent value="topics" className="p-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h4 className="font-medium text-lg mb-3 text-gray-900">
                    {t('videoParser.topics.mainTopics')}
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {analysisResult.keyTopics.map((topic, index) => (
                      <div 
                        key={index}
                        className="bg-blue-100 text-blue-800 px-3 py-1.5 rounded-full text-sm font-medium flex items-center gap-1"
                      >
                        <Tag className="h-3.5 w-3.5" />
                        {topic}
                      </div>
                    ))}
                  </div>
                </div>
                <div>
                  <h4 className="font-medium text-lg mb-3 text-gray-900">
                    {t('videoParser.topics.keywords')}
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {analysisResult.keywords.map((keyword, index) => (
                      <div 
                        key={index}
                        className="bg-purple-100 text-purple-800 px-3 py-1.5 rounded-full text-sm"
                      >
                        {keyword}
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
                      {t('videoParser.insights.sentiment')}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center gap-2">
                      <div className={`w-3 h-3 rounded-full ${
                        analysisResult.sentiment === 'positive' ? 'bg-green-500' :
                        analysisResult.sentiment === 'negative' ? 'bg-red-500' : 'bg-yellow-500'
                      }`} />
                      <span className="capitalize">{analysisResult.sentiment}</span>
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base font-medium">
                      {t('videoParser.insights.engagement')}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center gap-2">
                      <BarChart2 className="h-5 w-5 text-blue-600" />
                      <span>{t('videoParser.insights.high')}</span>
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
                <PlayCircle className="h-8 w-8 text-blue-600" />
              </div>
              
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                {t('videoParser.start.title')}
              </h3>
              <p className="text-gray-600 mb-6 max-w-md">
                {t('videoParser.start.description')}
              </p>
              
              <Button 
                onClick={simulateVideoAnalysis}
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white"
              >
                {t('videoParser.start.button')}
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}