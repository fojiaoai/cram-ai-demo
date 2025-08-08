import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { LanguageSwitcher } from '@/components/language-switcher';
import { ExamHeader } from '@/components/exam/exam-header';
import { DataDashboard } from '@/components/exam/data-dashboard';
import { QuestionDisplay } from '@/components/exam/question-display';
import { 
  Brain, 
  Clock, 
  CheckCircle, 
  AlertCircle, 
  BookOpen, 
  Target, 
  Award, 
  TrendingUp,
  ArrowLeft,
  ArrowRight,
  Play,
  Pause,
  RotateCcw,
  Flag,
  Eye,
  EyeOff,
  Settings,
  Home,
  FileText,
  BarChart3,
  Users,
  Calendar,
  Timer,
  Zap,
  Star,
  ChevronLeft,
  ChevronRight,
  Save,
  Send,
  RefreshCw,
  HelpCircle,
  Lightbulb,
  PieChart,
  Activity,
  Sun,
  Moon,
  User,
  Menu,
  X
} from 'lucide-react';

interface Question {
  id: number;
  type: 'single' | 'multiple' | 'essay' | 'true-false';
  question: string;
  options?: string[];
  correctAnswer?: string | string[];
  userAnswer?: string | string[];
  points: number;
  difficulty: 'easy' | 'medium' | 'hard';
  category: string;
  explanation?: string;
  timeSpent?: number;
  flagged?: boolean;
}

interface ExamSession {
  id: string;
  title: string;
  description: string;
  duration: number; // in minutes
  totalQuestions: number;
  passingScore: number;
  questions: Question[];
  startTime?: Date;
  endTime?: Date;
  status: 'not-started' | 'in-progress' | 'completed' | 'paused';
  currentQuestionIndex: number;
  timeRemaining: number; // in seconds
  score?: number;
  answers: Record<number, string | string[]>;
  flaggedQuestions: number[];
}

export default function ExamInterface() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  
  // Theme state
  const [isDarkMode, setIsDarkMode] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('theme') === 'dark';
    }
    return false;
  });

  // Mobile menu state
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Exam state
  const [currentExam, setCurrentExam] = useState<ExamSession | null>(null);
  const [examMode, setExamMode] = useState<'practice' | 'timed' | 'review'>('practice');
  const [showResults, setShowResults] = useState(false);
  const [showExplanations, setShowExplanations] = useState(false);
  const [autoSubmit, setAutoSubmit] = useState(true);

  // Mock dashboard data
  const mockDashboardData = useMemo(() => ({
    todayQuestions: 57,
    accuracyRate: 60.15,
    averageTime: 35,
    totalTime: 120,
    questionTypes: [
      { type: '考公', count: 15, color: '#8B5CF6' },
      { type: '判断', count: 10, color: '#06B6D4' },
      { type: '选择', count: 25, color: '#10B981' },
      { type: '数量', count: 50, color: '#F59E0B' }
    ],
    subjectDistribution: [
      { subject: '言语', count: 30, color: '#06B6D4' },
      { subject: '判断', count: 20, color: '#3B82F6' },
      { subject: '资料', count: 15, color: '#F59E0B' },
      { subject: '数量', count: 18, color: '#10B981' }
    ],
    accuracyByType: [
      { type: '选择', accuracy: 45 },
      { type: '判断', accuracy: 35 },
      { type: '简答', accuracy: 32 },
      { type: '其他', accuracy: -10 }
    ]
  }), []);

  // Mock exam data
  const mockExam: ExamSession = useMemo(() => ({
    id: 'exam-001',
    title: 'Default Test 1',
    description: 'Civil Service Exam',
    duration: 120,
    totalQuestions: 10,
    passingScore: 70,
    currentQuestionIndex: 0,
    timeRemaining: 7200, // 2 hours in seconds
    status: 'not-started',
    answers: {},
    flaggedQuestions: [],
    questions: [
      {
        id: 1,
        type: 'single',
        question: '经济发展：我国2025年我国提出了推动数字经济与实体经济深度融合的新举措，其主要目的不包括下一项？',
        options: ['A.提高产业生产效率', 'B.基础就业岗位', 'C.增强产业竞争力', 'D.推动产业升级'],
        correctAnswer: 'B.基础就业岗位',
        points: 5,
        difficulty: 'medium',
        category: '经济常识',
        explanation: '数字经济与实体经济融合的主要目的是提高效率、增强竞争力和推动升级，而不是基础就业岗位。'
      },
      {
        id: 2,
        type: 'multiple',
        question: '以下哪些是线性变换的性质？（多选）',
        options: [
          '保持向量加法',
          '保持标量乘法',
          '保持向量长度',
          '保持向量夹角'
        ],
        correctAnswer: ['保持向量加法', '保持标量乘法'],
        points: 8,
        difficulty: 'hard',
        category: '线性代数',
        explanation: '线性变换的基本性质是保持向量加法和标量乘法，但不一定保持长度和夹角'
      },
      {
        id: 3,
        type: 'true-false',
        question: '连续函数一定可导。',
        correctAnswer: 'false',
        points: 3,
        difficulty: 'easy',
        category: '微积分',
        explanation: '连续函数不一定可导，例如 f(x) = |x| 在 x = 0 处连续但不可导'
      },
      {
        id: 4,
        type: 'essay',
        question: '请解释极限的定义，并举例说明如何计算一个简单函数的极限。',
        points: 15,
        difficulty: 'hard',
        category: '微积分',
        explanation: '极限是描述函数在某点附近行为的数学概念，需要理解ε-δ定义'
      },
      {
        id: 5,
        type: 'single',
        question: '矩阵 A = [[1,2],[3,4]] 的行列式值是多少？',
        options: ['-2', '2', '10', '-10'],
        correctAnswer: '-2',
        points: 4,
        difficulty: 'easy',
        category: '线性代数',
        explanation: 'det(A) = 1×4 - 2×3 = 4 - 6 = -2'
      }
    ]
  }), []);

  // Initialize exam
  useEffect(() => {
    setCurrentExam(mockExam);
  }, [mockExam]);

  // Theme persistence
  useEffect(() => {
    localStorage.setItem('theme', isDarkMode ? 'dark' : 'light');
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  // Timer effect
  useEffect(() => {
    if (!currentExam || currentExam.status !== 'in-progress' || examMode !== 'timed') return;

    const timer = setInterval(() => {
      setCurrentExam(prev => {
        if (!prev || prev.timeRemaining <= 0) return prev;
        
        const newTimeRemaining = prev.timeRemaining - 1;
        
        if (newTimeRemaining <= 0 && autoSubmit) {
          // Auto submit when time runs out
          handleSubmitExam();
          return { ...prev, timeRemaining: 0, status: 'completed' };
        }
        
        return { ...prev, timeRemaining: newTimeRemaining };
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [currentExam?.status, examMode, autoSubmit]);

  // Handlers
  const handleStartExam = useCallback(() => {
    if (!currentExam) return;
    
    setCurrentExam(prev => ({
      ...prev!,
      status: 'in-progress',
      startTime: new Date(),
      currentQuestionIndex: 0
    }));
  }, [currentExam]);

  const handlePauseExam = useCallback(() => {
    if (!currentExam) return;
    
    setCurrentExam(prev => ({
      ...prev!,
      status: prev!.status === 'in-progress' ? 'paused' : 'in-progress'
    }));
  }, [currentExam]);

  const handleAnswerChange = useCallback((questionId: number, answer: string | string[]) => {
    if (!currentExam) return;
    
    setCurrentExam(prev => ({
      ...prev!,
      answers: {
        ...prev!.answers,
        [questionId]: answer
      }
    }));
  }, [currentExam]);

  const handleFlagQuestion = useCallback((questionId: number) => {
    if (!currentExam) return;
    
    setCurrentExam(prev => {
      const flagged = prev!.flaggedQuestions.includes(questionId);
      return {
        ...prev!,
        flaggedQuestions: flagged 
          ? prev!.flaggedQuestions.filter(id => id !== questionId)
          : [...prev!.flaggedQuestions, questionId]
      };
    });
  }, [currentExam]);

  const handleNavigateQuestion = useCallback((direction: 'prev' | 'next' | number) => {
    if (!currentExam) return;
    
    setCurrentExam(prev => {
      let newIndex: number;
      
      if (typeof direction === 'number') {
        newIndex = direction;
      } else if (direction === 'prev') {
        newIndex = Math.max(0, prev!.currentQuestionIndex - 1);
      } else {
        newIndex = Math.min(prev!.questions.length - 1, prev!.currentQuestionIndex + 1);
      }
      
      return {
        ...prev!,
        currentQuestionIndex: newIndex
      };
    });
  }, [currentExam]);

  const handleSubmitExam = useCallback(() => {
    if (!currentExam) return;
    
    // Calculate score
    let totalScore = 0;
    let maxScore = 0;
    
    currentExam.questions.forEach(question => {
      maxScore += question.points;
      const userAnswer = currentExam.answers[question.id];
      
      if (userAnswer && question.correctAnswer) {
        if (question.type === 'multiple') {
          const correct = Array.isArray(question.correctAnswer) ? question.correctAnswer : [question.correctAnswer];
          const user = Array.isArray(userAnswer) ? userAnswer : [userAnswer];
          
          if (correct.length === user.length && correct.every(ans => user.includes(ans))) {
            totalScore += question.points;
          }
        } else if (userAnswer === question.correctAnswer) {
          totalScore += question.points;
        }
      }
    });
    
    const finalScore = Math.round((totalScore / maxScore) * 100);
    
    setCurrentExam(prev => ({
      ...prev!,
      status: 'completed',
      endTime: new Date(),
      score: finalScore
    }));
    
    setShowResults(true);
  }, [currentExam]);

  const handleRestartExam = useCallback(() => {
    setCurrentExam(prev => ({
      ...prev!,
      status: 'not-started',
      currentQuestionIndex: 0,
      timeRemaining: prev!.duration * 60,
      answers: {},
      flaggedQuestions: [],
      startTime: undefined,
      endTime: undefined,
      score: undefined
    }));
    setShowResults(false);
  }, []);

  const formatTime = useCallback((seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    
    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
    return `${minutes}:${secs.toString().padStart(2, '0')}`;
  }, []);

  const currentQuestion = currentExam?.questions[currentExam.currentQuestionIndex];
  const progress = currentExam ? ((currentExam.currentQuestionIndex + 1) / currentExam.questions.length) * 100 : 0;
  const answeredCount = currentExam ? Object.keys(currentExam.answers).length : 0;

  if (!currentExam) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4" />
          <p className="text-gray-600">加载考试中...</p>
        </div>
      </div>
    );
  }

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
      </div>

      {/* Header */}
      <header className={`sticky top-0 z-50 border-b backdrop-blur-xl transition-all duration-300 ${
        isDarkMode 
          ? 'bg-gray-800/80 border-gray-700/50' 
          : 'bg-white/80 border-gray-200/50'
      }`}>
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          {/* Logo and Navigation */}
          <div className="flex items-center space-x-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate('/dashboard')}
              className="flex items-center gap-2 hover:bg-blue-50 dark:hover:bg-gray-700"
            >
              <Home className="h-4 w-4" />
              <span className="hidden sm:inline">返回首页</span>
            </Button>
            
            <div className="flex items-center space-x-2">
              <div className="relative">
                <Brain className="h-8 w-8 text-blue-600" />
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full animate-ping" />
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-blue-600 bg-clip-text text-transparent">
                侃侃AI - 智能学习平台
              </span>
            </div>
          </div>

          {/* Exam Status and Controls */}
          <div className="flex items-center space-x-4">
            {currentExam.status === 'in-progress' && examMode === 'timed' && (
              <div className={`flex items-center space-x-2 px-3 py-1 rounded-lg ${
                currentExam.timeRemaining < 300 
                  ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300' 
                  : 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300'
              }`}>
                <Timer className="h-4 w-4" />
                <span className="font-mono font-semibold">
                  {formatTime(currentExam.timeRemaining)}
                </span>
              </div>
            )}

            <LanguageSwitcher />
            
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => setIsDarkMode(!isDarkMode)}
              className="hover:bg-blue-50 dark:hover:bg-gray-700"
            >
              {isDarkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            </Button>

            {/* Mobile Menu Button */}
            <Button
              variant="ghost"
              size="sm"
              className="md:hidden"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className={`md:hidden border-t transition-all duration-300 ${
            isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
          }`}>
            <div className="p-4 space-y-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate('/dashboard')}
                className="w-full justify-start"
              >
                <Home className="h-4 w-4 mr-2" />
                返回首页
              </Button>
            </div>
          </div>
        )}
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Exam Not Started */}
        {currentExam.status === 'not-started' && !showResults && (
          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
              {/* Left Panel - Exam Setup */}
              <div className="lg:col-span-1">
                <Card className={`border-0 shadow-xl ${
                  isDarkMode ? 'bg-gray-800/80 backdrop-blur-sm' : 'bg-white/80 backdrop-blur-sm'
                }`}>
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                      <FileText className="h-5 w-5 text-blue-600" />
                      Exam Paper
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {/* File Upload */}
                    <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-6 text-center">
                      <div className="flex flex-col items-center gap-2">
                        <FileText className="h-8 w-8 text-gray-400" />
                        <Button variant="outline" className="text-blue-600">
                          + Select Exam File
                        </Button>
                        <p className="text-sm text-gray-500">PDF, Word format, max 50MB</p>
                      </div>
                    </div>

                    {/* Study Material */}
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <BookOpen className="h-4 w-4 text-green-600" />
                        <span className="text-sm font-medium">Study Material</span>
                      </div>
                    </div>

                    {/* Exam Settings */}
                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold">Exam Settings</h3>
                      
                      {/* Question Name */}
                      <div className="space-y-2">
                        <Label htmlFor="question-name">Question Name</Label>
                        <Input 
                          id="question-name"
                          value="Default Question 1"
                          readOnly
                        />
                      </div>

                      {/* Category and Language */}
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label>Category</Label>
                          <select className="w-full p-2 border rounded-md bg-background">
                            <option>Civil Service Exam</option>
                          </select>
                        </div>
                        <div className="space-y-2">
                          <Label>Language</Label>
                          <select className="w-full p-2 border rounded-md bg-background">
                            <option>Simplified Chinese</option>
                          </select>
                        </div>
                      </div>

                      {/* Question Type */}
                      <div className="space-y-3">
                        <Label>Question Type</Label>
                        <div className="grid grid-cols-2 gap-3">
                          <div className="flex items-center space-x-2">
                            <Checkbox 
                              id="single"
                              checked={true}
                              onCheckedChange={(checked) => {
                                // Handle single choice
                              }}
                            />
                            <Label htmlFor="single">Single</Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Checkbox 
                              id="multiple"
                              checked={true}
                              onCheckedChange={(checked) => {
                                // Handle multiple choice
                              }}
                            />
                            <Label htmlFor="multiple">Multiple</Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Checkbox 
                              id="true-false"
                              onCheckedChange={(checked) => {
                                // Handle true/false
                              }}
                            />
                            <Label htmlFor="true-false">True/False</Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Checkbox 
                              id="essay"
                              onCheckedChange={(checked) => {
                                // Handle essay
                              }}
                            />
                            <Label htmlFor="essay">Essay</Label>
                            <Badge className="bg-orange-100 text-orange-700 text-xs">VIP</Badge>
                          </div>
                        </div>
                      </div>

                      {/* Difficulty and Mode */}
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label>Question Difficulty</Label>
                          <select className="w-full p-2 border rounded-md bg-background">
                            <option>Easy</option>
                            <option>Medium</option>
                            <option>Hard</option>
                          </select>
                        </div>
                        <div className="space-y-2">
                          <Label>Question Mode</Label>
                          <select className="w-full p-2 border rounded-md bg-background">
                            <option>Practice</option>
                            <option>Timed</option>
                            <option>Review</option>
                          </select>
                        </div>
                      </div>

                      {/* Time Mode */}
                      <div className="space-y-3">
                        <Label>Time Mode</Label>
                        <div className="space-y-2">
                          <div className="flex items-center space-x-2">
                            <input type="radio" id="countdown" name="timeMode" defaultChecked />
                            <Label htmlFor="countdown">Countdown</Label>
                            <Input type="number" value="5" className="w-16 h-8" />
                            <span className="text-sm">Minutes</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <input type="radio" id="off" name="timeMode" />
                            <Label htmlFor="off">Off</Label>
                          </div>
                        </div>
                      </div>

                      {/* Question Count */}
                      <div className="space-y-2">
                        <Label>Question Count</Label>
                        <select className="w-full p-2 border rounded-md bg-background">
                          <option>20 Questions</option>
                        </select>
                      </div>

                      {/* Generate Button */}
                      <Button 
                        onClick={handleStartExam}
                        className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white"
                      >
                        <Zap className="h-4 w-4 mr-2" />
                        Generate Questions
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Right Panel - Question Display */}
              <div className="lg:col-span-3">
                <Card className={`border-0 shadow-xl ${
                  isDarkMode ? 'bg-gray-800/80 backdrop-blur-sm' : 'bg-white/80 backdrop-blur-sm'
                }`}>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <Badge variant="secondary" className="text-blue-600">
                          Default Test 1
                        </Badge>
                        <Badge variant="outline">Civil Service Exam</Badge>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant="outline">Practice Mode</Badge>
                        <Badge className="bg-blue-100 text-blue-700">3:25</Badge>
                      </div>
                    </div>
                    <div className="flex items-center justify-between mt-4">
                      <span className="text-sm text-gray-600">Completed 0/15</span>
                    </div>
                  </CardHeader>
                  <CardContent>
                    {/* Question Tabs */}
                    <Tabs defaultValue="single" className="mb-6">
                      <TabsList className="grid w-full grid-cols-4">
                        <TabsTrigger value="single">Single Choice</TabsTrigger>
                        <TabsTrigger value="multiple">Multiple Choice</TabsTrigger>
                        <TabsTrigger value="practice">Practice Mode</TabsTrigger>
                        <TabsTrigger value="questions">10Questions</TabsTrigger>
                      </TabsList>
                    </Tabs>

                    {/* Sample Question */}
                    <div className="space-y-6">
                      <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
                        <div className="flex items-center gap-2 mb-3">
                          <Badge className="bg-blue-100 text-blue-700">Question 1: Single Choice</Badge>
                        </div>
                        <h3 className="text-lg font-semibold mb-4">
                          经济发展：我国2025年我国提出了推动数字经济与实体经济深度融合的新举措，其主要目的不包括下一项？
                        </h3>
                        
                        <div className="space-y-3">
                          {['A. 提高产业生产效率', 'B. 基础就业岗位', 'C. 增强产业竞争力', 'D. 推动产业升级'].map((option, index) => (
                            <div key={index} className="flex items-center space-x-3 p-3 rounded-lg hover:bg-white dark:hover:bg-gray-800 transition-colors cursor-pointer">
                              <div className="w-6 h-6 rounded-full border-2 border-gray-300"></div>
                              <span>{option}</span>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Action Buttons */}
                      <div className="flex items-center justify-between">
                        <div className="flex gap-2">
                          <Button variant="outline" size="sm">
                            <Flag className="h-4 w-4" />
                          </Button>
                          <Button variant="outline" size="sm">
                            <Save className="h-4 w-4" />
                          </Button>
                          <Button variant="outline" size="sm">
                            <RefreshCw className="h-4 w-4" />
                          </Button>
                        </div>
                        
                        <Button className="bg-blue-600 hover:bg-blue-700 text-white">
                          View Answer Analysis
                        </Button>
                      </div>

                      {/* Navigation */}
                      <div className="flex items-center justify-between pt-4 border-t">
                        <Button variant="outline" disabled>
                          <ChevronLeft className="h-4 w-4 mr-2" />
                          Previous Question
                        </Button>
                        <Button>
                          Next Question
                          <ChevronRight className="h-4 w-4 ml-2" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        )}

        {/* Exam In Progress - New Layout with Data Dashboard */}
        {(currentExam.status === 'in-progress' || currentExam.status === 'paused') && !showResults && currentQuestion && (
          <div className="max-w-7xl mx-auto">
            {/* Enhanced Exam Header */}
            <ExamHeader
              examTitle={currentExam.title}
              examType={currentExam.description}
              currentQuestion={currentExam.currentQuestionIndex + 1}
              totalQuestions={currentExam.totalQuestions}
              timeRemaining={formatTime(currentExam.timeRemaining)}
              completedQuestions={answeredCount}
              onBack={() => navigate('/dashboard')}
              onSettings={() => {}}
            />

            <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
              {/* Main Question Area */}
              <div className="xl:col-span-3">
                <QuestionDisplay
                  question={currentQuestion}
                  currentIndex={currentExam.currentQuestionIndex}
                  totalQuestions={currentExam.totalQuestions}
                  userAnswer={currentExam.answers[currentQuestion.id]}
                  isFlagged={currentExam.flaggedQuestions.includes(currentQuestion.id)}
                  showExplanation={showExplanations && examMode === 'practice'}
                  onAnswerChange={(answer) => handleAnswerChange(currentQuestion.id, answer)}
                  onFlag={() => handleFlagQuestion(currentQuestion.id)}
                  onPrevious={() => handleNavigateQuestion('prev')}
                  onNext={() => handleNavigateQuestion('next')}
                  onSave={() => console.log('Save answer')}
                  canGoPrevious={currentExam.currentQuestionIndex > 0}
                  canGoNext={currentExam.currentQuestionIndex < currentExam.questions.length - 1}
                />

                {/* Submit Button */}
                <div className="mt-6">
                  <Card className="border-0 shadow-xl bg-white/80 backdrop-blur-sm dark:bg-gray-800/80">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div className="text-sm text-gray-600 dark:text-gray-300">
                          Progress: {answeredCount}/{currentExam.totalQuestions} questions answered
                        </div>
                        <Button 
                          onClick={handleSubmitExam}
                          className="bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600 text-white"
                        >
                          <Send className="h-4 w-4 mr-2" />
                          Submit Exam
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>

              {/* Data Dashboard Sidebar */}
              <div className="xl:col-span-1">
                <div className="sticky top-24 space-y-4">
                  {/* Answer Sheet */}
                  <Card className="border-0 shadow-xl bg-white/80 backdrop-blur-sm dark:bg-gray-800/80">
                    <CardHeader>
                      <CardTitle className="text-lg flex items-center gap-2">
                        <Target className="h-5 w-5 text-blue-600" />
                        Answer Sheet
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      {/* Progress Summary */}
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span>Answered</span>
                          <span className="font-semibold">{answeredCount}/{currentExam.totalQuestions}</span>
                        </div>
                        <Progress value={(answeredCount / currentExam.totalQuestions) * 100} />
                      </div>
                      
                      {/* Question Grid */}
                      <div className="grid grid-cols-5 gap-2">
                        {currentExam.questions.map((_, index) => {
                          const isAnswered = currentExam.answers[currentExam.questions[index].id];
                          const isCurrent = index === currentExam.currentQuestionIndex;
                          const isFlagged = currentExam.flaggedQuestions.includes(currentExam.questions[index].id);
                          
                          return (
                            <Button
                              key={index}
                              variant="outline"
                              size="sm"
                              onClick={() => handleNavigateQuestion(index)}
                              className={`relative h-10 w-10 p-0 text-xs ${
                                isCurrent 
                                  ? 'bg-blue-500 text-white border-blue-500' 
                                  : isAnswered
                                  ? 'bg-green-100 text-green-700 border-green-300 dark:bg-green-900/30 dark:text-green-300'
                                  : 'hover:bg-gray-100 dark:hover:bg-gray-700'
                              }`}
                            >
                              {index + 1}
                              {isFlagged && (
                                <div className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full" />
                              )}
                            </Button>
                          );
                        })}
                      </div>
                      
                      {/* Legend */}
                      <div className="space-y-2 text-xs">
                        <div className="flex items-center gap-2">
                          <div className="w-4 h-4 bg-blue-500 rounded"></div>
                          <span>Current</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="w-4 h-4 bg-green-100 border border-green-300 rounded dark:bg-green-900/30"></div>
                          <span>Answered</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="w-4 h-4 border border-gray-300 rounded relative">
                            <div className="absolute -top-0.5 -right-0.5 w-1.5 h-1.5 bg-red-500 rounded-full"></div>
                          </div>
                          <span>Flagged</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Data Dashboard */}
                  <DataDashboard {...mockDashboardData} />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Results View */}
        {showResults && currentExam.status === 'completed' && (
          <div className="max-w-4xl mx-auto">
            <Card className={`border-0 shadow-2xl ${
              isDarkMode ? 'bg-gray-800/80 backdrop-blur-sm' : 'bg-white/80 backdrop-blur-sm'
            }`}>
              <CardHeader className="text-center pb-8">
                <div className="mx-auto mb-4 p-4 bg-gradient-to-r from-green-500 to-blue-500 rounded-full w-20 h-20 flex items-center justify-center">
                  <Award className="h-10 w-10 text-white" />
                </div>
                <CardTitle className="text-3xl mb-2">Exam Completed!</CardTitle>
                <p className={`text-lg ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                  Congratulations on completing the exam
                </p>
              </CardHeader>
              
              <CardContent className="space-y-8">
                {/* Score Display */}
                <div className="text-center">
                  <div className="text-6xl font-bold text-transparent bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text mb-4">
                    {currentExam.score}%
                  </div>
                  <div className={`text-xl ${
                    currentExam.score! >= currentExam.passingScore ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {currentExam.score! >= currentExam.passingScore ? 'Passed!' : 'Keep trying!'}
                  </div>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="text-center">
                    <div className={`p-4 rounded-lg ${isDarkMode ? 'bg-gray-700/50' : 'bg-blue-50'}`}>
                      <CheckCircle className="h-8 w-8 text-green-600 mx-auto mb-2" />
                      <div className="text-2xl font-bold">{answeredCount}</div>
                      <div className="text-sm text-gray-500">Answered</div>
                    </div>
                  </div>
                  <div className="text-center">
                    <div className={`p-4 rounded-lg ${isDarkMode ? 'bg-gray-700/50' : 'bg-green-50'}`}>
                      <Clock className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                      <div className="text-2xl font-bold">
                        {currentExam.endTime && currentExam.startTime 
                          ? Math.round((currentExam.endTime.getTime() - currentExam.startTime.getTime()) / 60000)
                          : 0
                        }
                      </div>
                      <div className="text-sm text-gray-500">Minutes</div>
                    </div>
                  </div>
                  <div className="text-center">
                    <div className={`p-4 rounded-lg ${isDarkMode ? 'bg-gray-700/50' : 'bg-purple-50'}`}>
                      <Flag className="h-8 w-8 text-purple-600 mx-auto mb-2" />
                      <div className="text-2xl font-bold">{currentExam.flaggedQuestions.length}</div>
                      <div className="text-sm text-gray-500">Flagged</div>
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Button 
                    onClick={handleRestartExam}
                    className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white px-8 py-3"
                  >
                    <RotateCcw className="h-5 w-5 mr-2" />
                    Retake Exam
                  </Button>
                  <Button 
                    variant="outline"
                    onClick={() => navigate('/dashboard')}
                    className="px-8 py-3"
                  >
                    <Home className="h-5 w-5 mr-2" />
                    Back to Home
                  </Button>
                  <Button 
                    variant="outline"
                    onClick={() => {
                      setShowResults(false);
                      setCurrentExam(prev => ({ ...prev!, status: 'completed' }));
                    }}
                    className="px-8 py-3"
                  >
                    <Eye className="h-5 w-5 mr-2" />
                    Review Answers
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}
