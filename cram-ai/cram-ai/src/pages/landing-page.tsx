import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { 
  Brain, 
  Upload, 
  Link as LinkIcon, 
  Video, 
  FileText, 
  Zap, 
  Shield, 
  Users,
  ArrowRight,
  Play,
  CheckCircle,
  Sparkles,
  TrendingUp,
  Globe,
  Star
} from 'lucide-react'
import UploadDemo from '@/components/upload-demo'
import { LanguageSwitcher } from '@/components/language-switcher'

export default function LandingPage() {
  const { t } = useTranslation()
  const [isVideoPlaying, setIsVideoPlaying] = useState(false)
  const [animatedNumbers, setAnimatedNumbers] = useState({ users: 0, content: 0, insights: 0 })

  // Animated counter effect
  useEffect(() => {
    const targets = { users: 10000, content: 50000, insights: 250000 }
    const duration = 2000
    const steps = 60
    const stepTime = duration / steps

    let currentStep = 0
    const timer = setInterval(() => {
      currentStep++
      const progress = currentStep / steps
      
      setAnimatedNumbers({
        users: Math.floor(targets.users * progress),
        content: Math.floor(targets.content * progress),
        insights: Math.floor(targets.insights * progress)
      })

      if (currentStep >= steps) {
        clearInterval(timer)
        setAnimatedNumbers(targets)
      }
    }, stepTime)

    return () => clearInterval(timer)
  }, [])

  const features = [
    {
      icon: <Video className="h-8 w-8 text-blue-600" />,
      titleKey: "landing.features.multiSource.title",
      descriptionKey: "landing.features.multiSource.description",
      gradient: "from-blue-500 to-cyan-500"
    },
    {
      icon: <LinkIcon className="h-8 w-8 text-purple-600" />,
      titleKey: "landing.features.aiAnalysis.title",
      descriptionKey: "landing.features.aiAnalysis.description",
      gradient: "from-purple-500 to-pink-500"
    },
    {
      icon: <FileText className="h-8 w-8 text-green-600" />,
      titleKey: "landing.features.dashboard.title",
      descriptionKey: "landing.features.dashboard.description",
      gradient: "from-green-500 to-emerald-500"
    },
    {
      icon: <Zap className="h-8 w-8 text-orange-600" />,
      titleKey: "landing.features.realTime.title",
      descriptionKey: "landing.features.realTime.description",
      gradient: "from-orange-500 to-red-500"
    },
    {
      icon: <Shield className="h-8 w-8 text-indigo-600" />,
      titleKey: "landing.features.secure.title",
      descriptionKey: "landing.features.secure.description",
      gradient: "from-indigo-500 to-blue-500"
    },
    {
      icon: <Users className="h-8 w-8 text-teal-600" />,
      titleKey: "landing.features.export.title",
      descriptionKey: "landing.features.export.description",
      gradient: "from-teal-500 to-cyan-500"
    }
  ]

  const benefits = [
    t('landing.benefits.saveTime'),
    t('landing.benefits.extractInsights'),
    t('landing.benefits.supportFormats'),
    t('landing.benefits.aiAnalysis'),
    t('landing.benefits.exportShare')
  ]

  const testimonials = [
    {
      name: t('landing.locale') === 'zh' ? "张明" : "Zhang Ming",
      role: t('landing.locale') === 'zh' ? "产品经理" : "Product Manager",
      company: t('landing.locale') === 'zh' ? "字节跳动" : "ByteDance",
      content: t('landing.locale') === 'zh' 
        ? "Cram AI帮我们快速分析竞品视频和行业报告，效率提升了10倍！" 
        : "Cram AI helps us quickly analyze competitor videos and industry reports, improving efficiency by 10x!",
      avatar: "/avatars/avatar1.svg"
    },
    {
      name: t('landing.locale') === 'zh' ? "李华" : "Li Hua",
      role: t('landing.locale') === 'zh' ? "研究员" : "Researcher",
      company: t('landing.locale') === 'zh' ? "清华大学" : "Tsinghua University",
      content: t('landing.locale') === 'zh'
        ? "论文分析和文献综述变得如此简单，AI提取的关键点非常准确。"
        : "Paper analysis and literature reviews have become so simple, with AI extracting key points very accurately.",
      avatar: "/avatars/avatar2.svg"
    },
    {
      name: t('landing.locale') === 'zh' ? "王芳" : "Wang Fang",
      role: t('landing.locale') === 'zh' ? "内容运营" : "Content Operations",
      company: t('landing.locale') === 'zh' ? "腾讯" : "Tencent",
      content: t('landing.locale') === 'zh'
        ? "从视频到文档，一站式内容分析，让我们的内容策略更加精准。"
        : "From videos to documents, one-stop content analysis makes our content strategy more precise.",
      avatar: "/avatars/avatar3.svg"
    }
  ]

  return (
    <div className="min-h-screen bg-white overflow-hidden">
      {/* Animated Background */}
      <div className="fixed inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50/50 via-white to-purple-50/50" />
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-200/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-200/20 rounded-full blur-3xl animate-pulse delay-1000" />
      </div>

      {/* Header Navigation */}
      <header className="sticky top-0 z-50 w-full border-b bg-white/80 backdrop-blur-xl supports-[backdrop-filter]:bg-white/60">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <div className="flex items-center space-x-2">
            <div className="relative">
              <Brain className="h-8 w-8 text-blue-600" />
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full animate-ping" />
            </div>
            <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-blue-600 bg-clip-text text-transparent animate-gradient">
              Cram AI
            </span>
            <Badge variant="secondary" className="ml-2 bg-gradient-to-r from-blue-100 to-purple-100 text-blue-700 border-0">
              佛脚AI
            </Badge>
          </div>
          
          <nav className="hidden md:flex items-center space-x-8">
            <a href="#features" className="text-gray-600 hover:text-blue-600 transition-all duration-300 hover:scale-105">{t('landing.features.title')}</a>
            <a href="#pricing" className="text-gray-600 hover:text-blue-600 transition-all duration-300 hover:scale-105">{t('landing.pricing.title')}</a>
            <a href="#about" className="text-gray-600 hover:text-blue-600 transition-all duration-300 hover:scale-105">About</a>
          </nav>

          <div className="flex items-center space-x-4">
            <LanguageSwitcher />
            <Link to="/auth">
              <Button variant="ghost" className="text-gray-600 hover:text-gray-900 hover:bg-gray-100/80 transition-all duration-300">
                {t('nav.login')}
              </Button>
            </Link>
            <Link to="/auth">
              <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
                {t('landing.hero.cta')}
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 px-4 relative">
        <div className="container mx-auto max-w-6xl text-center">
          <div className="animate-fade-in-up">
              <Badge variant="secondary" className="mb-6 bg-gradient-to-r from-blue-50 to-purple-50 text-blue-700 border border-blue-200/50 shadow-sm">
                <Sparkles className="w-4 h-4 mr-2" />
                🚀 {t('landing.locale') === 'zh' ? 'AI驱动的内容分析平台' : 'AI-Powered Content Analysis Platform'}
              </Badge>
            
            <h1 className="text-5xl md:text-7xl font-bold text-gray-900 mb-6 leading-tight">
              <span className="inline-block animate-fade-in-up delay-100">{t('landing.hero.title')}</span>
              <br />
              <span className="inline-block animate-fade-in-up delay-200 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">{t('landing.hero.titleHighlight')}</span>
            </h1>
            
            <p className="text-xl text-gray-600 mb-12 max-w-3xl mx-auto leading-relaxed animate-fade-in-up delay-300">
              {t('landing.hero.subtitle')}
            </p>
          </div>

          {/* Upload Demo Component */}
          <div className="mb-16 animate-fade-in-up delay-400">
            <UploadDemo />
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12 animate-fade-in-up delay-500">
            <Button 
              variant="outline" 
              size="lg" 
              className="text-lg px-8 py-6 border-2 hover:bg-gray-50 transition-all duration-300 hover:scale-105"
              onClick={() => setIsVideoPlaying(true)}
            >
              <Play className="mr-2 h-5 w-5" />
              {t('landing.hero.demo')}
            </Button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-8 max-w-2xl mx-auto mb-12 animate-fade-in-up delay-600">
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600 mb-1">
                {animatedNumbers.users.toLocaleString()}+
              </div>
              <div className="text-sm text-gray-600">{t('landing.stats.users')}</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-purple-600 mb-1">
                {animatedNumbers.content.toLocaleString()}+
              </div>
              <div className="text-sm text-gray-600">{t('landing.stats.content')}</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-green-600 mb-1">
                {animatedNumbers.insights.toLocaleString()}+
              </div>
              <div className="text-sm text-gray-600">{t('landing.stats.insights')}</div>
            </div>
          </div>

          <div className="flex flex-wrap justify-center items-center gap-8 text-sm text-gray-500 animate-fade-in-up delay-700">
            {benefits.map((benefit, index) => (
              <div key={index} className="flex items-center gap-2 hover:text-blue-600 transition-colors duration-300">
                <CheckCircle className="h-4 w-4 text-green-500" />
                {benefit}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 px-4 bg-gradient-to-br from-gray-50 to-blue-50/30">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <Badge variant="secondary" className="mb-4 bg-blue-100 text-blue-700">
              <Star className="w-4 h-4 mr-2" />
              {t('landing.features.title')}
            </Badge>
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              {t('landing.features.subtitle')}
            </h2>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="group border-0 shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 bg-white/80 backdrop-blur-sm overflow-hidden">
                <div className={`absolute inset-0 bg-gradient-to-br ${feature.gradient} opacity-0 group-hover:opacity-5 transition-opacity duration-500`} />
                <CardContent className="p-8 relative">
                  <div className="mb-6 relative">
                    <div className={`absolute inset-0 bg-gradient-to-br ${feature.gradient} rounded-full blur-xl opacity-20 group-hover:opacity-40 transition-opacity duration-500`} />
                    <div className="relative bg-white rounded-full p-3 shadow-lg group-hover:shadow-xl transition-shadow duration-300">
                      {feature.icon}
                    </div>
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-3 group-hover:text-blue-600 transition-colors duration-300">
                    {t(feature.titleKey)}
                  </h3>
                  <p className="text-gray-600 leading-relaxed">
                    {t(feature.descriptionKey)}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <Badge variant="secondary" className="mb-4 bg-purple-100 text-purple-700">
              <Users className="w-4 h-4 mr-2" />
              {t('landing.testimonials.title')}
            </Badge>
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              {t('landing.locale') === 'zh' ? '看看用户怎么说' : 'What Our Users Say'}
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              {t('landing.testimonials.subtitle')}
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <Card key={index} className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 bg-white/80 backdrop-blur-sm">
                <CardContent className="p-6">
                  <div className="flex items-center mb-4">
                    <img 
                      src={testimonial.avatar} 
                      alt={testimonial.name}
                      className="w-12 h-12 rounded-full mr-4"
                    />
                    <div>
                      <h4 className="font-semibold text-gray-900">{testimonial.name}</h4>
                      <p className="text-sm text-gray-600">{testimonial.role} · {testimonial.company}</p>
                    </div>
                  </div>
                  <p className="text-gray-700 italic">"{testimonial.content}"</p>
                  <div className="flex mt-4">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 text-yellow-400 fill-current" />
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Demo Preview Section */}
      <section className="py-20 px-4 bg-gradient-to-br from-blue-50 to-purple-50">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <Badge variant="secondary" className="mb-4 bg-green-100 text-green-700">
              <TrendingUp className="w-4 h-4 mr-2" />
              {t('landing.demo.title')}
            </Badge>
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              {t('landing.demo.subtitle')}
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              {t('landing.demo.description')}
            </p>
          </div>

          <div className="bg-gradient-to-br from-blue-100/50 to-purple-100/50 rounded-3xl p-8 md:p-12 shadow-2xl">
            <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">
              <div className="bg-gradient-to-r from-gray-900 to-gray-800 px-6 py-4 flex items-center gap-2">
                <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
                <div className="w-3 h-3 bg-yellow-500 rounded-full animate-pulse delay-100"></div>
                <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse delay-200"></div>
                <span className="ml-4 text-gray-300 text-sm font-medium">
                {t('landing.locale') === 'zh' ? 'Cram AI 分析面板' : 'Cram AI Analysis Panel'}
              </span>
              </div>
              
              <div className="p-8">
                <div className="grid md:grid-cols-2 gap-8">
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                      <Video className="w-5 h-5 text-blue-600" />
                      📹 {t('landing.locale') === 'zh' ? '视频分析结果' : 'Video Analysis Results'}
                    </h3>
                    <div className="space-y-3">
                      <div className="bg-gradient-to-r from-blue-50 to-blue-100 p-4 rounded-xl border border-blue-200">
                        <h4 className="font-medium text-blue-900 mb-1">
                          {t('landing.locale') === 'zh' ? '核心主题' : 'Core Topics'}
                        </h4>
                        <p className="text-blue-700 text-sm">
                          {t('landing.locale') === 'zh' 
                            ? '人工智能、机器学习、未来工作趋势' 
                            : 'Artificial Intelligence, Machine Learning, Future Work Trends'}
                        </p>
                      </div>
                      <div className="bg-gradient-to-r from-green-50 to-green-100 p-4 rounded-xl border border-green-200">
                        <h4 className="font-medium text-green-900 mb-1">
                          {t('landing.locale') === 'zh' ? '智能摘要' : 'Smart Summary'}
                        </h4>
                        <p className="text-green-700 text-sm">
                          {t('landing.locale') === 'zh'
                            ? '15分钟AI趋势概览及其对行业的影响分析...'
                            : '15-minute overview of AI trends and their impact on the industry...'}
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                      <FileText className="w-5 h-5 text-purple-600" />
                      📄 {t('landing.locale') === 'zh' ? '文档洞察' : 'Document Insights'}
                    </h3>
                    <div className="space-y-3">
                      <div className="bg-gradient-to-r from-purple-50 to-purple-100 p-4 rounded-xl border border-purple-200">
                        <h4 className="font-medium text-purple-900 mb-1">
                          {t('landing.locale') === 'zh' ? '行动建议' : 'Action Recommendations'}
                        </h4>
                        <p className="text-purple-700 text-sm">
                          {t('landing.locale') === 'zh'
                            ? '识别出3个关键建议和执行方案'
                            : 'Identified 3 key recommendations and implementation plans'}
                        </p>
                      </div>
                      <div className="bg-gradient-to-r from-orange-50 to-orange-100 p-4 rounded-xl border border-orange-200">
                        <h4 className="font-medium text-orange-900 mb-1">
                          {t('landing.locale') === 'zh' ? '情感分析' : 'Sentiment Analysis'}
                        </h4>
                        <p className="text-orange-700 text-sm">
                          {t('landing.locale') === 'zh'
                            ? '积极态度 (87% 置信度)'
                            : 'Positive attitude (87% confidence)'}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 bg-gradient-to-r from-blue-600 via-purple-600 to-blue-600 relative overflow-hidden">
        <div className="absolute inset-0 bg-black/10" />
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-white/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-white/10 rounded-full blur-3xl" />
        
        <div className="container mx-auto max-w-4xl text-center relative z-10">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            {t('landing.cta.title')}
          </h2>
          <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto leading-relaxed">
            {t('landing.cta.subtitle')}
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-8">
            <Link to="/auth">
              <Button size="lg" className="bg-white text-blue-600 hover:bg-gray-100 text-lg px-8 py-6 shadow-2xl hover:shadow-3xl transition-all duration-300 hover:scale-105">
                <Sparkles className="mr-2 h-5 w-5" />
                {t('landing.cta.button')}
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </div>
          
          <p className="text-blue-200 text-sm">
            {t('landing.cta.noCreditCard')}
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <Brain className="h-6 w-6 text-blue-400" />
                <span className="text-xl font-bold">Cram AI</span>
              </div>
              <p className="text-gray-400 text-sm">
                {t('landing.hero.subtitle')}
              </p>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">{t('landing.features.title')}</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><a href="#features" className="hover:text-white transition-colors">{t('landing.features.title')}</a></li>
                <li><a href="#pricing" className="hover:text-white transition-colors">{t('landing.pricing.title')}</a></li>
                <li><a href="#" className="hover:text-white transition-colors">API</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Company</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">About</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Contact</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Careers</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Support</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">Help Center</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Privacy Policy</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Terms of Service</a></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-800 pt-8 flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-400 text-sm">
              &copy; 2024 Cram AI. All rights reserved.
            </p>
            <div className="flex space-x-6 mt-4 md:mt-0">
              <LanguageSwitcher />
            </div>
          </div>
        </div>
      </footer>

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
        
        @keyframes gradient {
          0%, 100% {
            background-size: 200% 200%;
            background-position: left center;
          }
          50% {
            background-size: 200% 200%;
            background-position: right center;
          }
        }
        
        .animate-fade-in-up {
          animation: fade-in-up 0.6s ease-out forwards;
        }
        
        .animate-gradient {
          animation: gradient 3s ease infinite;
        }
        
        .delay-100 { animation-delay: 0.1s; }
        .delay-200 { animation-delay: 0.2s; }
        .delay-300 { animation-delay: 0.3s; }
        .delay-400 { animation-delay: 0.4s; }
        .delay-500 { animation-delay: 0.5s; }
        .delay-600 { animation-delay: 0.6s; }
        .delay-700 { animation-delay: 0.7s; }
      `}</style>
    </div>
  )
}