import React, { useState, useEffect, useMemo, useCallback, Suspense } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { LanguageSwitcher } from '@/components/language-switcher';
import { StatsCard } from '@/components/dashboard/stats-card';
import { QuickActionCard } from '@/components/dashboard/quick-action-card';
import { ContentItemComponent } from '@/components/dashboard/content-item';
import { DashboardSkeleton, InsightCardSkeleton, StatsCardSkeleton, QuickActionSkeleton, ContentItemSkeleton } from '@/components/dashboard/dashboard-skeleton';
import { ErrorBoundary } from '@/components/ui/error-boundary';
import { useOnlineStatus } from '@/hooks/use-online-status';
import { LoadingSpinner } from '@/components/ui/loading-spinner';

// Lazy load heavy components
const UploadDemo = React.lazy(() => import('@/components/upload-demo'));

import { 
  Brain, 
  Upload, 
  Video, 
  Globe, 
  FileText, 
  Search,
  Bell,
  Sun,
  Moon,
  User,
  TrendingUp,
  BookOpen,
  Target,
  Clock,
  BarChart3,
  PieChart,
  Activity,
  Sparkles,
  Plus,
  Filter,
  ArrowRight,
  TrendingDown,
  GraduationCap,
  Briefcase,
  Menu,
  X,
  Lightbulb,
  Award
} from 'lucide-react';

interface StatItem {
  label: string;
  value: string;
  change: string;
  icon: React.ComponentType<any>;
  color: string;
  trend: 'up' | 'down';
}

interface ContentItem {
  id: number;
  title: string;
  type: 'document' | 'video' | 'web';
  progress: number;
  insights: number;
  lastAccessed: string;
  confidence: number;
  status: 'completed' | 'in-progress' | 'pending';
}

interface InsightItem {
  type: string;
  title: string;
  description: string;
  icon: React.ComponentType<any>;
  color: string;
  priority: 'high' | 'medium' | 'low';
}

export default function Dashboard() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [isDarkMode, setIsDarkMode] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('theme') === 'dark';
    }
    return false;
  });
  const [userType, setUserType] = useState<'student' | 'professional'>(() => {
    if (typeof window !== 'undefined') {
      return (localStorage.getItem('userType') as 'student' | 'professional') || 'student';
    }
    return 'student';
  });
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [notifications, setNotifications] = useState(3);

  // Persist theme and user type
  useEffect(() => {
    localStorage.setItem('theme', isDarkMode ? 'dark' : 'light');
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  useEffect(() => {
    localStorage.setItem('userType', userType);
  }, [userType]);

  // Mock data with improved structure
  const studentData = useMemo(() => ({
    stats: [
      { 
        label: t('dashboard.stats.learningHours'), 
        value: '24', 
        change: '+3', 
        icon: Clock, 
        color: 'text-blue-600',
        trend: 'up' as const
      },
      { 
        label: t('dashboard.stats.completedCourses'), 
        value: '8', 
        change: '+2', 
        icon: BookOpen, 
        color: 'text-green-600',
        trend: 'up' as const
      },
      { 
        label: t('dashboard.stats.currentStreak'), 
        value: '12', 
        change: '+1', 
        icon: Target, 
        color: 'text-orange-600',
        trend: 'up' as const
      },
      { 
        label: t('dashboard.stats.aiInsights'), 
        value: '156', 
        change: '+24', 
        icon: Brain, 
        color: 'text-purple-600',
        trend: 'up' as const
      }
    ] as StatItem[],
    recentContent: [
      {
        id: 1,
        title: '高等数学微积分基础',
        type: 'document' as const,
        progress: 85,
        insights: 12,
        lastAccessed: '2小时前',
        confidence: 94,
        status: 'in-progress' as const
      },
      {
        id: 2,
        title: '英语四级听力训练',
        type: 'video' as const,
        progress: 60,
        insights: 8,
        lastAccessed: '1天前',
        confidence: 87,
        status: 'in-progress' as const
      },
      {
        id: 3,
        title: '计算机网络原理',
        type: 'web' as const,
        progress: 100,
        insights: 15,
        lastAccessed: '2天前',
        confidence: 91,
        status: 'completed' as const
      }
    ] as ContentItem[],
    insights: [
      {
        type: 'recommendation',
        title: t('dashboard.insights.student.recommendation'),
        description: t('dashboard.insights.student.recommendationDesc'),
        icon: Lightbulb,
        color: 'bg-blue-50 border-blue-200 text-blue-800 dark:bg-blue-900/20 dark:border-blue-800 dark:text-blue-300',
        priority: 'high' as const
      },
      {
        type: 'progress',
        title: t('dashboard.insights.student.progress'),
        description: t('dashboard.insights.student.progressDesc'),
        icon: TrendingUp,
        color: 'bg-green-50 border-green-200 text-green-800 dark:bg-green-900/20 dark:border-green-800 dark:text-green-300',
        priority: 'medium' as const
      },
      {
        type: 'reminder',
        title: t('dashboard.insights.student.reminder'),
        description: t('dashboard.insights.student.reminderDesc'),
        icon: Bell,
        color: 'bg-orange-50 border-orange-200 text-orange-800 dark:bg-orange-900/20 dark:border-orange-800 dark:text-orange-300',
        priority: 'high' as const
      }
    ] as InsightItem[]
  }), [t]);

  const professionalData = useMemo(() => ({
    stats: [
      { 
        label: t('dashboard.stats.analysisHours'), 
        value: '42', 
        change: '+8', 
        icon: BarChart3, 
        color: 'text-blue-600',
        trend: 'up' as const
      },
      { 
        label: t('dashboard.stats.completedProjects'), 
        value: '15', 
        change: '+3', 
        icon: Briefcase, 
        color: 'text-green-600',
        trend: 'up' as const
      },
      { 
        label: t('dashboard.stats.currentStreak'), 
        value: '28', 
        change: '+2', 
        icon: Target, 
        color: 'text-orange-600',
        trend: 'up' as const
      },
      { 
        label: t('dashboard.stats.aiInsights'), 
        value: '324', 
        change: '+45', 
        icon: Brain, 
        color: 'text-purple-600',
        trend: 'up' as const
      }
    ] as StatItem[],
    recentContent: [
      {
        id: 1,
        title: '2024年AI行业发展报告',
        type: 'document' as const,
        progress: 100,
        insights: 28,
        lastAccessed: '1小时前',
        confidence: 96,
        status: 'completed' as const
      },
      {
        id: 2,
        title: 'TechCrunch AI创业分析',
        type: 'video' as const,
        progress: 75,
        insights: 18,
        lastAccessed: '3小时前',
        confidence: 89,
        status: 'in-progress' as const
      },
      {
        id: 3,
        title: '机器学习最新研究论文',
        type: 'web' as const,
        progress: 90,
        insights: 22,
        lastAccessed: '1天前',
        confidence: 93,
        status: 'in-progress' as const
      }
    ] as ContentItem[],
    insights: [
      {
        type: 'trend',
        title: t('dashboard.insights.professional.trend'),
        description: t('dashboard.insights.professional.trendDesc'),
        icon: TrendingUp,
        color: 'bg-blue-50 border-blue-200 text-blue-800 dark:bg-blue-900/20 dark:border-blue-800 dark:text-blue-300',
        priority: 'high' as const
      },
      {
        type: 'skill',
        title: t('dashboard.insights.professional.skill'),
        description: t('dashboard.insights.professional.skillDesc'),
        icon: Award,
        color: 'bg-green-50 border-green-200 text-green-800 dark:bg-green-900/20 dark:border-green-800 dark:text-green-300',
        priority: 'medium' as const
      },
      {
        type: 'opportunity',
        title: t('dashboard.insights.professional.opportunity'),
        description: t('dashboard.insights.professional.opportunityDesc'),
        icon: Sparkles,
        color: 'bg-purple-50 border-purple-200 text-purple-800 dark:bg-purple-900/20 dark:border-purple-800 dark:text-purple-300',
        priority: 'high' as const
      }
    ] as InsightItem[]
  }), [t]);

  const currentData = userType === 'student' ? studentData : professionalData;

  const quickActions = useMemo(() => [
    {
      title: t('dashboard.quickActions.uploadFile'),
      description: t('dashboard.quickActions.uploadFileDesc'),
      icon: Upload,
      color: 'from-blue-500 to-cyan-500',
      action: () => {
        setIsLoading(true);
        // Simulate navigation delay
        setTimeout(() => {
          setIsLoading(false);
          // In a real app, this would trigger file upload
          console.log('Upload file action');
        }, 1000);
      }
    },
    {
      title: t('dashboard.quickActions.analyzeVideo'),
      description: t('dashboard.quickActions.analyzeVideoDesc'),
      icon: Video,
      color: 'from-red-500 to-pink-500',
      action: () => {
        setIsLoading(true);
        setTimeout(() => {
          setIsLoading(false);
          console.log('Analyze video action');
        }, 1000);
      }
    },
    {
      title: t('dashboard.quickActions.webContent'),
      description: t('dashboard.quickActions.webContentDesc'),
      icon: Globe,
      color: 'from-green-500 to-emerald-500',
      action: () => {
        setIsLoading(true);
        setTimeout(() => {
          setIsLoading(false);
          console.log('Web content action');
        }, 1000);
      }
    },
    {
      title: t('dashboard.quickActions.aiAnalysis'),
      description: t('dashboard.quickActions.aiAnalysisDesc'),
      icon: Brain,
      color: 'from-purple-500 to-violet-500',
      action: () => {
        setIsLoading(true);
        setTimeout(() => {
          setIsLoading(false);
          navigate('/question-bank');
        }, 1000);
      }
    }
  ], [t, navigate]);

  // Filtered content based on search
  const filteredContent = useMemo(() => {
    if (!searchQuery) return currentData.recentContent;
    return currentData.recentContent.filter(item =>
      item.title.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [currentData.recentContent, searchQuery]);

  const handleThemeToggle = useCallback(() => {
    setIsDarkMode(prev => !prev);
  }, []);

  const handleUserTypeChange = useCallback((type: 'student' | 'professional') => {
    setUserType(type);
    setMobileMenuOpen(false);
  }, []);

  const handleNotificationClick = useCallback(() => {
    setNotifications(0);
    // In a real app, this would open notifications panel
    console.log('Notifications clicked');
  }, []);

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'document': return <FileText className="h-4 w-4" />;
      case 'video': return <Video className="h-4 w-4" />;
      case 'web': return <Globe className="h-4 w-4" />;
      default: return <FileText className="h-4 w-4" />;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'document': return 'bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400';
      case 'video': return 'bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400';
      case 'web': return 'bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400';
      default: return 'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'text-green-600';
      case 'in-progress': return 'text-blue-600';
      case 'pending': return 'text-orange-600';
      default: return 'text-gray-600';
    }
  };

  return (
    <div className={`min-h-screen transition-all duration-300 ${
      isDarkMode 
        ? 'bg-gray-900 text-white' 
        : 'bg-gradient-to-br from-gray-50 via-blue-50/30 to-purple-50/20 text-gray-900'
    }`}>
      {/* Animated Background */}
      <div className="fixed inset-0 -z-10 overflow-hidden">
        <div className={`absolute top-0 right-1/4 w-96 h-96 rounded-full blur-3xl animate-pulse transition-colors duration-1000 ${
          isDarkMode ? 'bg-blue-500/10' : 'bg-blue-200/30'
        }`} />
        <div className={`absolute bottom-0 left-1/4 w-96 h-96 rounded-full blur-3xl animate-pulse delay-1000 transition-colors duration-1000 ${
          isDarkMode ? 'bg-purple-500/10' : 'bg-purple-200/30'
        }`} />
        <div className={`absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 rounded-full blur-3xl animate-pulse delay-500 transition-colors duration-1000 ${
          isDarkMode ? 'bg-cyan-500/5' : 'bg-cyan-200/20'
        }`} />
      </div>

      {/* Header */}
      <header className={`sticky top-0 z-50 border-b backdrop-blur-xl transition-all duration-300 ${
        isDarkMode 
          ? 'bg-gray-800/80 border-gray-700/50' 
          : 'bg-white/80 border-gray-200/50'
      }`}>
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <div className="relative">
                <Brain className="h-8 w-8 text-blue-600 transition-transform duration-300 hover:scale-110" />
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full animate-ping" />
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-blue-600 bg-clip-text text-transparent">
                {t('common.appName')}
              </span>
              <Badge className="ml-2 bg-gradient-to-r from-blue-100 to-purple-100 text-blue-700 border-0 dark:from-blue-900/30 dark:to-purple-900/30 dark:text-blue-300">
                佛脚AI
              </Badge>
            </div>
          </div>

          {/* Navigation Menu */}
          <nav className="hidden lg:flex items-center space-x-8">
            <Button
              variant="ghost"
              className="text-base font-medium hover:text-blue-600 transition-colors duration-200"
              onClick={() => navigate('/dashboard')}
            >
              Home
            </Button>
            <Button
              variant="ghost"
              className="text-base font-medium hover:text-blue-600 transition-colors duration-200"
              onClick={() => navigate('/my-courses')}
            >
              My Courses
            </Button>
            <Button
              variant="ghost"
              className="text-base font-medium hover:text-blue-600 transition-colors duration-200"
              onClick={() => navigate('/exam-interface')}
            >
              Exam
            </Button>
            <Button
              variant="ghost"
              className="text-base font-medium hover:text-blue-600 transition-colors duration-200"
              onClick={() => navigate('/explore')}
            >
              Explore
            </Button>
            <Button
              variant="ghost"
              className="text-base font-medium hover:text-blue-600 transition-colors duration-200"
              onClick={() => navigate('/community')}
            >
              Community
            </Button>
            <Button
              variant="ghost"
              className="text-base font-medium hover:text-blue-600 transition-colors duration-200"
              onClick={() => navigate('/creators')}
            >
              Creators
            </Button>
          </nav>

          {/* Search and Actions */}
          <div className="flex items-center space-x-4">
            {/* Search - Desktop */}
            <div className="relative hidden md:block">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                type="text"
                placeholder={t('dashboard.searchPlaceholder')}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className={`pl-10 w-64 h-10 transition-all duration-300 focus:w-72 ${
                  isDarkMode 
                    ? 'bg-gray-700/50 border-gray-600 text-white placeholder-gray-400' 
                    : 'bg-white/80 border-gray-200 text-gray-900 placeholder-gray-500'
                }`}
                aria-label="Search content"
              />
            </div>
            
            <LanguageSwitcher />
            
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={handleThemeToggle}
              className="hover:bg-blue-50 dark:hover:bg-gray-700 transition-all duration-200 hover:scale-110"
              aria-label={isDarkMode ? 'Switch to light mode' : 'Switch to dark mode'}
            >
              {isDarkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            </Button>
            
            <Button 
              variant="ghost" 
              size="sm" 
              className="relative hover:bg-blue-50 dark:hover:bg-gray-700 transition-all duration-200 hover:scale-110"
              onClick={handleNotificationClick}
              aria-label={`${notifications} notifications`}
            >
              <Bell className="h-5 w-5" />
              {notifications > 0 && (
                <div className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center animate-pulse">
                  {notifications}
                </div>
              )}
            </Button>
            
            <Button 
              variant="ghost" 
              size="sm" 
              className="hover:bg-blue-50 dark:hover:bg-gray-700 transition-all duration-200 hover:scale-110"
              aria-label="User profile"
            >
              <User className="h-5 w-5" />
            </Button>

            {/* Mobile Menu Button */}
            <Button
              variant="ghost"
              size="sm"
              className="md:hidden"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Toggle mobile menu"
            >
              {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className={`lg:hidden border-t transition-all duration-300 ${
            isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
          }`}>
            <div className="p-4 space-y-4">
              {/* Mobile Search */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  type="text"
                  placeholder={t('dashboard.searchPlaceholder')}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 w-full"
                />
              </div>

              {/* Mobile Navigation */}
              <div className="space-y-2">
                <Button
                  variant="ghost"
                  className="w-full justify-start text-base font-medium"
                  onClick={() => {
                    navigate('/dashboard');
                    setMobileMenuOpen(false);
                  }}
                >
                  Home
                </Button>
                <Button
                  variant="ghost"
                  className="w-full justify-start text-base font-medium"
                  onClick={() => {
                    navigate('/my-courses');
                    setMobileMenuOpen(false);
                  }}
                >
                  My Courses
                </Button>
                <Button
                  variant="ghost"
                  className="w-full justify-start text-base font-medium"
                  onClick={() => {
                    navigate('/exam-interface');
                    setMobileMenuOpen(false);
                  }}
                >
                  Exam
                </Button>
                <Button
                  variant="ghost"
                  className="w-full justify-start text-base font-medium"
                  onClick={() => {
                    navigate('/explore');
                    setMobileMenuOpen(false);
                  }}
                >
                  Explore
                </Button>
                <Button
                  variant="ghost"
                  className="w-full justify-start text-base font-medium"
                  onClick={() => {
                    navigate('/community');
                    setMobileMenuOpen(false);
                  }}
                >
                  Community
                </Button>
                <Button
                  variant="ghost"
                  className="w-full justify-start text-base font-medium"
                  onClick={() => {
                    navigate('/creators');
                    setMobileMenuOpen(false);
                  }}
                >
                  Creators
                </Button>
              </div>

              {/* Mobile User Type Switcher */}
              <div className="flex space-x-2 pt-4 border-t border-gray-200 dark:border-gray-700">
                <Button
                  variant={userType === 'student' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => handleUserTypeChange('student')}
                  className="flex-1 flex items-center gap-2"
                >
                  <GraduationCap className="w-4 h-4" />
                  {t('dashboard.userType.student')}
                </Button>
                <Button
                  variant={userType === 'professional' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => handleUserTypeChange('professional')}
                  className="flex-1 flex items-center gap-2"
                >
                  <Briefcase className="w-4 h-4" />
                  {t('dashboard.userType.professional')}
                </Button>
              </div>
            </div>
          </div>
        )}
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Welcome Section */}
        <div className="mb-8 animate-fade-in-up">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold mb-2 flex items-center gap-3">
                {t('dashboard.welcome')} 
                <span className="text-2xl animate-wave">👋</span>
              </h1>
              <p className={`text-lg ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                {t(`dashboard.welcomeMessage.${userType}`)}
              </p>
            </div>
            <div className="text-center md:text-right">
              <div className={`text-sm mb-1 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                {userType === 'student' ? '今日学习' : '今日分析'}
              </div>
              <div className="text-3xl font-bold text-transparent bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text">
                {userType === 'student' ? '3.2h' : '5.8h'}
              </div>
              <div className="text-xs text-green-600 flex items-center justify-center md:justify-end gap-1 mt-1">
                <TrendingUp className="h-3 w-3" />
                +15% vs 昨天
              </div>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {currentData.stats.map((stat, index) => (
            <Card 
              key={index} 
              className={`group border-0 shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 overflow-hidden cursor-pointer animate-fade-in-up ${
                isDarkMode ? 'bg-gray-800/80 backdrop-blur-sm' : 'bg-white/80 backdrop-blur-sm'
              }`}
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-purple-500/5 group-hover:from-blue-500/10 group-hover:to-purple-500/10 transition-all duration-500" />
              <CardContent className="p-6 relative">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <p className={`text-sm font-medium mb-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                      {stat.label}
                    </p>
                    <p className="text-3xl font-bold mb-1 group-hover:scale-105 transition-transform duration-300">
                      {stat.value}
                    </p>
                    <p className={`text-xs flex items-center gap-1 ${
                      stat.trend === 'up' ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {stat.trend === 'up' ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
                      {stat.change} {t('dashboard.stats.thisMonth')}
                    </p>
                  </div>
                  <div className={`p-3 rounded-full transition-all duration-300 group-hover:scale-110 group-hover:rotate-12 ${
                    isDarkMode ? 'bg-gray-700/50' : 'bg-gradient-to-br from-blue-100 to-purple-100'
                  }`}>
                    <stat.icon className={`h-8 w-8 ${stat.color}`} />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Quick Actions */}
        <Card className={`mb-8 border-0 shadow-xl overflow-hidden animate-fade-in-up ${
          isDarkMode ? 'bg-gray-800/80 backdrop-blur-sm' : 'bg-white/80 backdrop-blur-sm'
        }`}>
          <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-purple-500/5" />
          <CardHeader className="relative">
            <CardTitle className="flex items-center gap-2 text-xl">
              <div className="bg-gradient-to-r from-blue-500 to-purple-500 p-2 rounded-lg shadow-lg">
                <Plus className="h-5 w-5 text-white" />
              </div>
              {t('dashboard.quickActions.title')}
              <Badge className="ml-2 bg-gradient-to-r from-blue-100 to-purple-100 text-blue-700 border-0 dark:from-blue-900/30 dark:to-purple-900/30 dark:text-blue-300">
                AI
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className="relative">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
              {quickActions.map((action, index) => (
                <Card 
                  key={index} 
                  className={`group cursor-pointer border-0 shadow-md hover:shadow-lg transition-all duration-300 hover:-translate-y-1 ${
                    isDarkMode ? 'bg-gray-700/50' : 'bg-white'
                  }`}
                  onClick={action.action}
                >
                  <CardContent className="p-4">
                    <div className="flex flex-col items-center text-center space-y-3">
                      <div className={`p-3 rounded-xl bg-gradient-to-r ${action.color} shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                        <action.icon className="h-6 w-6 text-white" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-sm mb-1">{action.title}</h3>
                        <p className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                          {action.description}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Upload Demo Component */}
            <div className="mt-6">
              <UploadDemo />
            </div>
          </CardContent>
        </Card>

        {/* Main Content Tabs */}
        <Tabs defaultValue="content" className="space-y-6">
          <TabsList className={`grid w-full grid-cols-3 ${
            isDarkMode ? 'bg-gray-800/50' : 'bg-white/80'
          }`}>
            <TabsTrigger value="content" className="flex items-center gap-2">
              <FileText className="h-4 w-4" />
              {t('dashboard.tabs.recentContent')}
            </TabsTrigger>
            <TabsTrigger value="insights" className="flex items-center gap-2">
              <Brain className="h-4 w-4" />
              {t('dashboard.tabs.aiInsights')}
            </TabsTrigger>
            <TabsTrigger value="analytics" className="flex items-center gap-2">
              <BarChart3 className="h-4 w-4" />
              {t('dashboard.tabs.analytics')}
            </TabsTrigger>
          </TabsList>

          {/* Recent Content Tab */}
          <TabsContent value="content" className="space-y-6">
            <Card className={`border-0 shadow-xl ${
              isDarkMode ? 'bg-gray-800/80 backdrop-blur-sm' : 'bg-white/80 backdrop-blur-sm'
            }`}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    <Clock className="h-5 w-5 text-blue-600" />
                    {t('dashboard.recentContent.title')}
                  </CardTitle>
                  <Button variant="outline" size="sm" className="flex items-center gap-2">
                    <Filter className="h-4 w-4" />
                    {t('common.filter')}
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {filteredContent.map((item) => (
                    <div 
                      key={item.id} 
                      className={`group p-4 rounded-lg border transition-all duration-300 hover:shadow-md cursor-pointer ${
                        isDarkMode ? 'bg-gray-700/30 border-gray-600 hover:bg-gray-700/50' : 'bg-gray-50/50 border-gray-200 hover:bg-white'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4 flex-1">
                          <div className={`p-2 rounded-lg ${getTypeColor(item.type)}`}>
                            {getTypeIcon(item.type)}
                          </div>
                          <div className="flex-1 min-w-0">
                            <h3 className="font-semibold text-sm mb-1 truncate">{item.title}</h3>
                            <div className="flex items-center space-x-4 text-xs text-gray-500">
                              <span>{item.lastAccessed}</span>
                              <span>{item.insights} {t('dashboard.recentContent.insights')}</span>
                              <span className={getStatusColor(item.status)}>
                                {t(`dashboard.recentContent.status.${item.status}`)}
                              </span>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center space-x-3">
                          <div className="text-right">
                            <div className="text-sm font-medium">{item.progress}%</div>
                            <div className="text-xs text-gray-500">
                              {t('dashboard.recentContent.confidence')}: {item.confidence}%
                            </div>
                          </div>
                          <div className="w-16">
                            <Progress value={item.progress} className="h-2" />
                          </div>
                          <Button variant="ghost" size="sm" className="opacity-0 group-hover:opacity-100 transition-opacity">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* AI Insights Tab */}
          <TabsContent value="insights" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {currentData.insights.map((insight, index) => (
                <Card 
                  key={index} 
                  className={`border-0 shadow-lg hover:shadow-xl transition-all duration-300 ${insight.color} ${
                    isDarkMode ? 'backdrop-blur-sm' : 'backdrop-blur-sm'
                  }`}
                >
                  <CardContent className="p-6">
                    <div className="flex items-start space-x-4">
                      <div className="p-2 rounded-lg bg-white/20">
                        <insight.icon className="h-6 w-6" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-2">
                          <h3 className="font-semibold">{insight.title}</h3>
                          <Badge variant="outline" className="text-xs">
                            {t(`dashboard.insights.priority.${insight.priority}`)}
                          </Badge>
                        </div>
                        <p className="text-sm opacity-90 mb-3">{insight.description}</p>
                        <Button size="sm" variant="outline" className="bg-white/10 border-white/20 hover:bg-white/20">
                          {t('dashboard.insights.viewDetails')}
                          <ArrowRight className="h-3 w-3 ml-1" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Analytics Tab */}
          <TabsContent value="analytics" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className={`border-0 shadow-xl ${
                isDarkMode ? 'bg-gray-800/80 backdrop-blur-sm' : 'bg-white/80 backdrop-blur-sm'
              }`}>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <PieChart className="h-5 w-5 text-blue-600" />
                    {t('dashboard.analytics.contentDistribution')}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {[
                      { type: 'document', count: 45, color: 'bg-blue-500' },
                      { type: 'video', count: 32, color: 'bg-red-500' },
                      { type: 'web', count: 28, color: 'bg-green-500' }
                    ].map((item) => (
                      <div key={item.type} className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <div className={`w-3 h-3 rounded-full ${item.color}`} />
                          <span className="text-sm font-medium capitalize">{item.type}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <span className="text-sm text-gray-500">{item.count}</span>
                          <div className="w-20 h-2 bg-gray-200 rounded-full overflow-hidden">
                            <div 
                              className={`h-full ${item.color}`} 
                              style={{ width: `${(item.count / 105) * 100}%` }}
                            />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card className={`border-0 shadow-xl ${
                isDarkMode ? 'bg-gray-800/80 backdrop-blur-sm' : 'bg-white/80 backdrop-blur-sm'
              }`}>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Activity className="h-5 w-5 text-green-600" />
                    {t('dashboard.analytics.weeklyActivity')}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day, index) => {
                      const activity = [85, 92, 78, 95, 88, 45, 32][index];
                      return (
                        <div key={day} className="flex items-center justify-between">
                          <span className="text-sm font-medium w-8">{day}</span>
                          <div className="flex-1 mx-3">
                            <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                              <div 
                                className="h-full bg-gradient-to-r from-green-400 to-blue-500 transition-all duration-500"
                                style={{ width: `${activity}%` }}
                              />
                            </div>
                          </div>
                          <span className="text-sm text-gray-500 w-8 text-right">{activity}%</span>
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>

      {/* Loading Overlay */}
      {isLoading && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center">
          <div className={`p-6 rounded-xl shadow-2xl ${
            isDarkMode ? 'bg-gray-800' : 'bg-white'
          }`}>
            <div className="flex items-center space-x-3">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600" />
              <span className="text-sm font-medium">{t('common.loading')}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
