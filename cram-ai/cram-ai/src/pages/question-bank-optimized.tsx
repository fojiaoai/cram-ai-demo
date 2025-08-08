import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ErrorBoundary } from '@/components/ui/error-boundary';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { useOnlineStatus } from '@/hooks/use-online-status';
import { LanguageSwitcher } from '@/components/language-switcher';

// Import modular components
import { QuickActions } from '@/components/question-bank/quick-actions';
import { PersonalStats } from '@/components/question-bank/personal-stats';
import { CategoriesTab } from '@/components/question-bank/categories-tab';

import { 
  Brain, 
  GraduationCap, 
  Briefcase,
  CheckCircle,
  BarChart3,
  BookOpen,
  Target,
  Home,
  User,
  Bell,
  Sun,
  Moon,
  Award,
  Activity,
  Trophy,
  Zap,
  Search,
  AlertCircle,
  Flame
} from 'lucide-react';

interface QuestionBankStats {
  totalQuestions: number;
  completedTests: number;
  averageScore: number;
  studyHours: number;
  streak: number;
  rank: number;
  totalUsers: number;
}

interface CoreFeature {
  id: string;
  title: string;
  description: string;
  icon: React.ElementType;
  color: string;
  enabled: boolean;
  badge?: string;
}

interface QuestionCategory {
  id: string;
  name: string;
  description: string;
  questionCount: number;
  completedCount: number;
  difficulty: 'easy' | 'medium' | 'hard';
  icon: React.ElementType;
  color: string;
  tags: string[];
}

const QuestionBankOptimized: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const isOnline = useOnlineStatus();
  
  // State management
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
  const [activeTab, setActiveTab] = useState('overview');
  const [isLoading, setIsLoading] = useState(false);
  const [isDataLoading, setIsDataLoading] = useState(true);
  const [notifications, setNotifications] = useState(2);

  // Simulate data loading
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsDataLoading(false);
    }, 1200);
    return () => clearTimeout(timer);
  }, []);

  // Persist theme and user type
  useEffect(() => {
    localStorage.setItem('theme', isDarkMode ? 'dark' : 'light');
    document.documentElement.classList.toggle('dark', isDarkMode);
  }, [isDarkMode]);

  useEffect(() => {
    localStorage.setItem('userType', userType);
  }, [userType]);

  // Mock data
  const stats = useMemo<QuestionBankStats>(() => ({
    totalQuestions: 15000,
    completedTests: 186,
    averageScore: 87,
    studyHours: 32,
    streak: 12,
    rank: 156,
    totalUsers: 50000
  }), []);

  const studentFeatures = useMemo<CoreFeature[]>(() => [
    {
      id: 'civil-service',
      title: 'Civil Service Exam',
      description: 'Comprehensive preparation for government positions',
      icon: GraduationCap,
      color: 'text-blue-600',
      enabled: true,
      badge: 'HOT'
    },
    {
      id: 'knowledge-test',
      title: 'Knowledge Assessment',
      description: 'Test your understanding across various subjects',
      icon: BookOpen,
      color: 'text-green-600',
      enabled: true
    },
    {
      id: 'smart-analysis',
      title: 'AI-Powered Analysis',
      description: 'Get personalized insights and recommendations',
      icon: Brain,
      color: 'text-purple-600',
      enabled: true,
      badge: 'AI'
    },
    {
      id: 'progress-tracking',
      title: 'Progress Tracking',
      description: 'Monitor your learning journey and achievements',
      icon: Target,
      color: 'text-orange-600',
      enabled: true
    }
  ], []);

  const professionalFeatures = useMemo<CoreFeature[]>(() => [
    {
      id: 'certification',
      title: 'Professional Certification',
      description: 'Industry-recognized certification programs',
      icon: Award,
      color: 'text-blue-600',
      enabled: true
    },
    {
      id: 'industry-knowledge',
      title: 'Industry Knowledge',
      description: 'Stay updated with latest industry trends',
      icon: Briefcase,
      color: 'text-green-600',
      enabled: true
    },
    {
      id: 'skill-assessment',
      title: 'Skill Assessment',
      description: 'Evaluate and improve your professional skills',
      icon: Target,
      color: 'text-purple-600',
      enabled: true,
      badge: 'PRO'
    },
    {
      id: 'learning-suggestions',
      title: 'Learning Suggestions',
      description: 'AI-driven personalized learning paths',
      icon: Zap,
      color: 'text-orange-600',
      enabled: true,
      badge: 'AI'
    }
  ], []);

  const questionCategories = useMemo<QuestionCategory[]>(() => [
    {
      id: 'civil-service',
      name: '公务员考试',
      description: '国考、省考、事业单位',
      questionCount: 5000,
      completedCount: 1200,
      difficulty: 'medium',
      icon: GraduationCap,
      color: 'bg-blue-500',
      tags: ['行测', '申论', '面试']
    },
    {
      id: 'professional-cert',
      name: '职业资格',
      description: '各类职业资格认证',
      questionCount: 3500,
      completedCount: 800,
      difficulty: 'hard',
      icon: Award,
      color: 'bg-purple-500',
      tags: ['会计', '法律', '医学']
    },
    {
      id: 'academic',
      name: '学科知识',
      description: '各学科专业知识',
      questionCount: 4200,
      completedCount: 950,
      difficulty: 'easy',
      icon: BookOpen,
      color: 'bg-green-500',
      tags: ['数学', '英语', '计算机']
    },
    {
      id: 'skill-test',
      name: '技能测评',
      description: '综合能力评估',
      questionCount: 2300,
      completedCount: 600,
      difficulty: 'medium',
      icon: Target,
      color: 'bg-orange-500',
      tags: ['逻辑', '推理', '创新']
    }
  ], []);

  const currentFeatures = userType === 'student' ? studentFeatures : professionalFeatures;

  // Event handlers
  const handleStartTest = useCallback(() => {
    setIsLoading(true);
    setTimeout(() => {
      navigate('/exam-interface');
      setIsLoading(false);
    }, 1000);
  }, [navigate]);

  const handleViewStats = useCallback(() => {
    console.log('View detailed statistics');
  }, []);

  const handleViewRules = useCallback(() => {
    console.log('View exam rules');
  }, []);

  const handleThemeToggle = useCallback(() => {
    setIsDarkMode(prev => !prev);
  }, []);

  const handleUserTypeChange = useCallback((type: 'student' | 'professional') => {
    setUserType(type);
  }, []);

  const handleCategorySelect = useCallback((categoryId: string) => {
    setActiveTab('categories');
  }, []);

  const handleNotificationClick = useCallback(() => {
    setNotifications(0);
  }, []);

  // Filtered categories
  const filteredCategories = useMemo(() => {
    if (!searchQuery.trim()) return questionCategories;
    return questionCategories.filter(category =>
      category.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      category.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      category.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
    );
  }, [questionCategories, searchQuery]);

  const getDifficultyColor = useCallback((difficulty: string) => {
    switch (difficulty) {
      case 'easy': return 'text-green-600 bg-green-100 dark:bg-green-900/30';
      case 'medium': return 'text-orange-600 bg-orange-100 dark:bg-orange-900/30';
      case 'hard': return 'text-red-600 bg-red-100 dark:bg-red-900/30';
      default: return 'text-gray-600 bg-gray-100 dark:bg-gray-900/30';
    }
  }, []);

  if (isDataLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" text="Loading question bank..." />
      </div>
    );
  }

  return (
    <ErrorBoundary>
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
        </div>

        {/* Header */}
        <header className={`sticky top-0 z-50 border-b backdrop-blur-xl transition-all duration-300 ${
          isDarkMode 
            ? 'bg-gray-800/80 border-gray-700/50' 
            : 'bg-white/80 border-gray-200/50'
        }`}>
          <div className="container mx-auto px-4 h-16 flex items-center justify-between">
            <div className="flex items-center space-x-6">
              <div className="flex items-center space-x-2 cursor-pointer" onClick={() => navigate('/')}>
                <Brain className="h-8 w-8 text-blue-600" />
                <span className="text-xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-blue-600 bg-clip-text text-transparent">
                  CramAI
                </span>
                <Badge className="ml-2 bg-gradient-to-r from-blue-100 to-purple-100 text-blue-700 border-0">
                  智能题库
                </Badge>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <div className={`hidden md:flex items-center rounded-lg p-1 ${
                isDarkMode ? 'bg-gray-700/50' : 'bg-gray-100/80'
              }`}>
                <Button
                  variant={userType === 'student' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => handleUserTypeChange('student')}
                  className="flex items-center gap-2"
                >
                  <GraduationCap className="w-4 h-4" />
                  Student
                </Button>
                <Button
                  variant={userType === 'professional' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => handleUserTypeChange('professional')}
                  className="flex items-center gap-2"
                >
                  <Briefcase className="w-4 h-4" />
                  Professional
                </Button>
              </div>
              
              <LanguageSwitcher />
              
              <Button variant="ghost" size="sm" onClick={handleThemeToggle}>
                {isDarkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
              </Button>
              
              <Button variant="ghost" size="sm" className="relative" onClick={handleNotificationClick}>
                <Bell className="h-5 w-5" />
                {notifications > 0 && (
                  <div className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                    {notifications}
                  </div>
                )}
              </Button>
            </div>
          </div>
        </header>

        <div className="container mx-auto px-4 py-8">
          {/* Hero Section */}
          <div className="text-center mb-12 animate-fade-in-up">
            <div className="flex items-center justify-center gap-4 mb-6">
              <div className="relative">
                <div className="p-4 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full shadow-2xl">
                  <Brain className="w-12 h-12 text-white" />
                </div>
              </div>
              <div>
                <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-blue-600 bg-clip-text text-transparent mb-2">
                  Question Bank
                </h1>
                <p className={`text-lg md:text-xl ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                  Comprehensive test preparation platform
                </p>
                {!isOnline && (
                  <div className="mt-3 inline-flex items-center gap-2 px-3 py-1 bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-300 rounded-full text-sm">
                    <AlertCircle className="w-4 h-4" />
                    Offline Mode
                  </div>
                )}
              </div>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-2xl mx-auto">
              <div className={`p-4 rounded-xl ${isDarkMode ? 'bg-gray-800/50' : 'bg-white/80'} backdrop-blur-sm shadow-lg`}>
                <div className="text-2xl font-bold text-blue-600">{stats.totalQuestions.toLocaleString()}+</div>
                <div className="text-sm text-gray-500">Total Questions</div>
              </div>
              <div className={`p-4 rounded-xl ${isDarkMode ? 'bg-gray-800/50' : 'bg-white/80'} backdrop-blur-sm shadow-lg`}>
                <div className="text-2xl font-bold text-green-600">{stats.completedTests}</div>
                <div className="text-sm text-gray-500">Completed Tests</div>
              </div>
              <div className={`p-4 rounded-xl ${isDarkMode ? 'bg-gray-800/50' : 'bg-white/80'} backdrop-blur-sm shadow-lg`}>
                <div className="text-2xl font-bold text-orange-600">{stats.averageScore}%</div>
                <div className="text-sm text-gray-500">Average Score</div>
              </div>
              <div className={`p-4 rounded-xl ${isDarkMode ? 'bg-gray-800/50' : 'bg-white/80'} backdrop-blur-sm shadow-lg`}>
                <div className="flex items-center justify-center gap-1 text-2xl font-bold text-red-500">
                  <Flame className="w-6 h-6" />
                  {stats.streak}
                </div>
                <div className="text-sm text-gray-500">Day Streak</div>
              </div>
            </div>
          </div>

          {/* Main Content Tabs */}
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-8">
            <TabsList className={`grid w-full grid-cols-4 max-w-2xl mx-auto ${
              isDarkMode ? 'bg-gray-800/50' : 'bg-white/80'
            } backdrop-blur-sm`}>
              <TabsTrigger value="overview" className="flex items-center gap-2">
                <BarChart3 className="h-4 w-4" />
                Overview
              </TabsTrigger>
              <TabsTrigger value="categories" className="flex items-center gap-2">
                <BookOpen className="h-4 w-4" />
                Categories
              </TabsTrigger>
              <TabsTrigger value="activities" className="flex items-center gap-2">
                <Activity className="h-4 w-4" />
                Activities
              </TabsTrigger>
              <TabsTrigger value="achievements" className="flex items-center gap-2">
                <Trophy className="h-4 w-4" />
                Achievements
              </TabsTrigger>
            </TabsList>

            {/* Overview Tab */}
            <TabsContent value="overview" className="space-y-8">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left Column - Features */}
                <div className="lg:col-span-2 space-y-8">
                  {/* User Type Features */}
                  <Card className={`border-0 shadow-xl overflow-hidden ${
                    isDarkMode ? 'bg-gray-800/80 backdrop-blur-sm' : 'bg-white/80 backdrop-blur-sm'
                  }`}>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-3">
                        {userType === 'student' ? (
                          <>
                            <GraduationCap className="w-6 h-6 text-blue-600" />
                            Student Mode
                          </>
                        ) : (
                          <>
                            <Briefcase className="w-6 h-6 text-purple-600" />
                            Professional Mode
                          </>
                        )}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {currentFeatures.map((feature) => (
                          <div key={feature.id} className={`p-4 rounded-lg border ${
                            isDarkMode ? 'border-gray-700' : 'border-gray-200'
                          }`}>
                            <div className="flex items-center gap-3 mb-3">
                              <feature.icon className={`w-5 h-5 ${feature.color}`} />
                              <h3 className="font-semibold">{feature.title}</h3>
                              {feature.badge && (
                                <Badge className="text-xs">{feature.badge}</Badge>
                              )}
                            </div>
                            <p className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                              {feature.description}
                            </p>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>

                  {/* Quick Actions */}
                  <QuickActions
                    isDarkMode={isDarkMode}
                    isLoading={isLoading}
                    onStartTest={handleStartTest}
                    onViewStats={handleViewStats}
                    onViewRules={handleViewRules}
                  />
                </div>

                {/* Right Column - Personal Stats */}
                <PersonalStats isDarkMode={isDarkMode} stats={stats} />
              </div>
            </TabsContent>

            {/* Categories Tab */}
            <TabsContent value="categories">
              <CategoriesTab
                isDarkMode={isDarkMode}
                searchQuery={searchQuery}
                onSearchChange={setSearchQuery}
                filteredCategories={filteredCategories}
                onCategorySelect={handleCategorySelect}
                getDifficultyColor={getDifficultyColor}
              />
            </TabsContent>

            {/* Activities Tab */}
            <TabsContent value="activities" className="space-y-6">
              <Card className={`border-0 shadow-xl ${
                isDarkMode ? 'bg-gray-800/80 backdrop-blur-sm' : 'bg-white/80 backdrop-blur-sm'
              }`}>
                <CardHeader>
                  <CardTitle>Recent Activities</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-center text-gray-500 py-8">Activities feature coming soon...</p>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Achievements Tab */}
            <TabsContent value="achievements" className="space-y-6">
              <Card className={`border-0 shadow-xl ${
                isDarkMode ? 'bg-gray-800/80 backdrop-blur-sm' : 'bg-white/80 backdrop-blur-sm'
              }`}>
                <CardHeader>
                  <CardTitle>Achievements</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-center text-gray-500 py-8">Achievements feature coming soon...</p>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>

        {/* Loading Overlay */}
        {isLoading && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center">
            <div className={`p-8 rounded-2xl shadow-2xl ${
              isDarkMode ? 'bg-gray-800' : 'bg-white'
            }`}>
              <LoadingSpinner size="lg" text="Preparing your test..." />
            </div>
          </div>
        )}
      </div>
    </ErrorBoundary>
  );
};

export default QuestionBankOptimized;