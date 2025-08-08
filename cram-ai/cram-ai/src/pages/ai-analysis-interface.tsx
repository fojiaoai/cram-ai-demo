/*
 * @Descripttion: AI Analysis Interface - Miyagi Labs Style Learning Platform
 * @version: 2.0.0
 * @Author: Tom Zhou
 * @Date: 2025-08-06 15:00:00
 * @LastEditors: Tom Zhou
 * @LastEditTime: 2025-08-06 15:39:19
 */
import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Textarea } from '@/components/ui/textarea';
import {
  Brain,
  Home,
  BookOpen,
  PenTool,
  Users,
  Star,
  Settings,
  Share2,
  Download,
  Play,
  Pause,
  Volume2,
  VolumeX,
  SkipBack,
  SkipForward,
  Maximize,
  MessageCircle,
  FileText,
  Bookmark,
  Clock,
  Target,
  TrendingUp,
  ChevronRight,
  ChevronDown,
  Edit3,
  Save,
  RefreshCw,
  Zap,
  Globe,
  Video,
  FileImage,
  FileAudio,
  File,
  ArrowLeft,
  Search,
  Filter,
  MoreHorizontal,
  ThumbsUp,
  ThumbsDown,
  Reply,
  Send
} from 'lucide-react';

interface AnalysisData {
  files?: any[];
  timestamp?: string;
  analysisType?: string;
  source?: string;
}

interface FilePreview {
  id: string;
  name: string;
  type: string;
  size: number;
  url?: string;
  thumbnail?: string;
  duration?: string;
}

export default function AIAnalysisInterface() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  const videoRef = useRef<HTMLVideoElement>(null);
  
  const [analysisData, setAnalysisData] = useState<AnalysisData>({});
  const [activeTab, setActiveTab] = useState('main');
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [sidebarExpanded, setSidebarExpanded] = useState(true);
  const [transcriptExpanded, setTranscriptExpanded] = useState(true);
  const [editingNotes, setEditingNotes] = useState(false);
  const [notes, setNotes] = useState('');
  const [chatMessage, setChatMessage] = useState('');
  const [progress, setProgress] = useState(65);

  // Mock data for demonstration
  const [filePreview] = useState<FilePreview>({
    id: '1',
    name: 'A2A协议深度解析 (第1部分：双Agent同步调用场景)',
    type: 'video/mp4',
    size: 125000000,
    duration: '15:32',
    thumbnail: '/placeholder.svg?height=400&width=600'
  });

  const [transcript] = useState([
    { time: '00:15', text: 'Welcome to A2A protocol deep analysis. Today we will explore dual-agent synchronous invocation scenarios.' },
    { time: '01:30', text: 'The A2A protocol enables seamless communication between multiple AI agents in real-time.' },
    { time: '03:45', text: 'Key benefits include reduced latency, improved coordination, and enhanced system reliability.' },
    { time: '05:20', text: 'Let\'s examine the technical implementation details and best practices.' }
  ]);

  const [flashcards] = useState([
    { id: 1, front: 'What is A2A Protocol?', back: 'Agent-to-Agent communication protocol for AI systems', mastered: false },
    { id: 2, front: 'Key Benefits of A2A', back: 'Reduced latency, improved coordination, enhanced reliability', mastered: true },
    { id: 3, front: 'Synchronous vs Asynchronous', back: 'Synchronous provides real-time communication, asynchronous allows delayed processing', mastered: false }
  ]);

  const [discussions] = useState([
    {
      id: 1,
      user: 'Alex Chen',
      avatar: '/avatars/avatar1.svg',
      time: '2 hours ago',
      content: 'Great explanation of the A2A protocol! The dual-agent scenario really clarifies the concept.',
      likes: 12,
      replies: 3
    },
    {
      id: 2,
      user: 'Sarah Kim',
      avatar: '/avatars/avatar2.svg',
      time: '1 hour ago',
      content: 'Could you elaborate more on the error handling mechanisms in synchronous calls?',
      likes: 8,
      replies: 1
    }
  ]);

  useEffect(() => {
    if (location.state?.analysisData) {
      setAnalysisData(location.state.analysisData);
    }
  }, [location.state]);

  const handlePlayPause = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const getFileIcon = (type: string) => {
    if (type.startsWith('video/')) return <Video className="h-5 w-5 text-red-500" />;
    if (type.startsWith('image/')) return <FileImage className="h-5 w-5 text-green-500" />;
    if (type.startsWith('audio/')) return <FileAudio className="h-5 w-5 text-purple-500" />;
    return <File className="h-5 w-5 text-gray-500" />;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-red-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      {/* Top Navigation - Miyagi Labs Style */}
      <nav className="sticky top-0 z-50 bg-white/95 dark:bg-gray-900/95 backdrop-blur-lg border-b border-gray-200 dark:border-gray-700 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-gradient-to-r from-orange-500 to-red-500 rounded-lg flex items-center justify-center">
                  <Brain className="h-5 w-5 text-white" />
                </div>
                <span className="text-xl font-bold bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">
                  CramAI
                </span>
              </div>
            </div>

            {/* Navigation Links - Miyagi Style */}
            <div className="hidden md:flex items-center space-x-1">
              <button 
                onClick={() => navigate('/dashboard')}
                className="px-4 py-2 rounded-lg text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-all duration-200"
              >
                Home
              </button>
              <button 
                className="px-4 py-2 rounded-lg text-sm font-medium bg-gradient-to-r from-orange-500 to-red-500 text-white shadow-lg"
              >
                My Courses
              </button>
              <button 
                onClick={() => navigate('/exam-interface')}
                className="px-4 py-2 rounded-lg text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-all duration-200"
              >
                Exam
              </button>
              <button className="px-4 py-2 rounded-lg text-sm font-medium text-gray-400 dark:text-gray-500 cursor-not-allowed">
                Explore
              </button>
              <button className="px-4 py-2 rounded-lg text-sm font-medium text-gray-400 dark:text-gray-500 cursor-not-allowed">
                Community
              </button>
              <button className="px-4 py-2 rounded-lg text-sm font-medium text-gray-400 dark:text-gray-500 cursor-not-allowed">
                Creators
              </button>
            </div>

            {/* Right side actions */}
            <div className="flex items-center space-x-3">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="搜索内容、词条或分析..."
                  className="pl-10 pr-4 py-2 w-64 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                />
              </div>
              <Button 
                variant="outline" 
                size="sm"
                className="border-orange-200 text-orange-600 hover:bg-orange-50"
              >
                Upgrade to Premium
              </Button>
              <Button variant="ghost" size="sm">
                <Settings className="h-4 w-4" />
              </Button>
              <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full"></div>
            </div>
          </div>
        </div>
      </nav>

      {/* Interface Titles */}
      <div className="container mx-auto px-4 py-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          {/* Primary Title */}
          <div className="relative overflow-hidden rounded-2xl p-6 bg-gradient-to-br from-blue-50/80 to-purple-50/80 border border-blue-200/50 backdrop-blur-xl shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-1">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 via-purple-500/10 to-blue-500/10" />
            <div className="relative flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div>
                  <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-blue-600 bg-clip-text text-transparent">
                    {t('landing.locale') === 'zh' ? 'AI 深度分析平台' : 'AI Deep Analysis Platform'}
                  </h1>
                  <p className="text-sm text-gray-600">
                    {t('landing.locale') === 'zh' ? '智能内容解析与洞察生成' : 'Intelligent Content Analysis & Insight Generation'}
                  </p>
                </div>
              </div>
              <Badge className="bg-gradient-to-r from-orange-500 to-red-500 text-white border-0 shadow-lg">
                {t('landing.locale') === 'zh' ? '专业版' : 'Pro'}
              </Badge>
            </div>
          </div>

          {/* Secondary Title */}
          <div className="relative overflow-hidden rounded-2xl p-6 bg-gradient-to-br from-orange-50/80 to-red-50/80 border border-orange-200/50 backdrop-blur-xl shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-1">
            <div className="absolute inset-0 bg-gradient-to-br from-orange-500/10 via-red-500/10 to-orange-500/10" />
            <div className="relative flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div>
                  <h2 className="text-2xl font-bold bg-gradient-to-r from-orange-500 via-red-500 to-orange-500 bg-clip-text text-transparent">
                    {t('landing.locale') === 'zh' ? '实时学习助手' : 'Real-time Learning Assistant'}
                  </h2>
                  <p className="text-sm text-gray-600">
                    {t('landing.locale') === 'zh' ? '个性化内容推荐与互动学习' : 'Personalized Content & Interactive Learning'}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Layout */}
      <div className="flex h-[calc(100vh-8rem)]">
        {/* Main Content Area */}
        <div className={`flex-1 flex flex-col transition-all duration-300 ${sidebarExpanded ? 'mr-80' : 'mr-12'}`}>
          {/* Video Player Section */}
          <div className="bg-black relative">
            <div className="aspect-video relative">
              {/* Video Thumbnail/Player */}
              <div className="w-full h-full bg-gradient-to-br from-red-400 via-orange-400 to-yellow-400 flex items-center justify-center relative overflow-hidden">
                <div className="absolute inset-0 bg-black/20"></div>
                <div className="text-center z-10">
                  <div className="text-white text-6xl font-bold mb-4">#1</div>
                  <div className="text-white text-4xl font-bold mb-2">A2A</div>
                  <div className="text-white text-2xl font-bold mb-4">深度解析</div>
                  <div className="text-white text-lg mb-8">第1部分：双Agent同步调用场景</div>
                  <Button 
                    size="lg"
                    onClick={handlePlayPause}
                    className="bg-red-600 hover:bg-red-700 text-white rounded-full w-16 h-16"
                  >
                    <Play className="h-8 w-8 ml-1" />
                  </Button>
                </div>
                
                {/* Decorative Elements */}
                <div className="absolute top-10 right-10 w-20 h-20 bg-orange-300 rounded-full opacity-60"></div>
                <div className="absolute bottom-20 left-20 w-16 h-16 bg-red-300 rounded-full opacity-40"></div>
                <div className="absolute top-1/2 right-1/4 w-12 h-12 bg-yellow-300 rounded-full opacity-50"></div>
              </div>

              {/* Video Controls */}
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4">
                <div className="flex items-center space-x-4 text-white">
                  <Button variant="ghost" size="sm" onClick={handlePlayPause}>
                    {isPlaying ? <Pause className="h-5 w-5" /> : <Play className="h-5 w-5" />}
                  </Button>
                  <Button variant="ghost" size="sm">
                    <SkipBack className="h-5 w-5" />
                  </Button>
                  <Button variant="ghost" size="sm">
                    <SkipForward className="h-5 w-5" />
                  </Button>
                  <Button variant="ghost" size="sm" onClick={handleMute}>
                    {isMuted ? <VolumeX className="h-5 w-5" /> : <Volume2 className="h-5 w-5" />}
                  </Button>
                  <div className="flex-1 flex items-center space-x-2">
                    <span className="text-sm">{formatTime(currentTime)}</span>
                    <div className="flex-1 bg-white/20 rounded-full h-1">
                      <div className="bg-red-500 h-1 rounded-full" style={{ width: '35%' }}></div>
                    </div>
                    <span className="text-sm">{filePreview.duration}</span>
                  </div>
                  <Button variant="ghost" size="sm">
                    <Maximize className="h-5 w-5" />
                  </Button>
                </div>
              </div>

              {/* Top Right Actions */}
              <div className="absolute top-4 right-4 flex space-x-2">
                <Button size="sm" className="bg-orange-500 hover:bg-orange-600 text-white">
                  Share with friends
                </Button>
              </div>
            </div>
          </div>

          {/* Content Tabs */}
          <div className="flex-1 bg-white dark:bg-gray-900">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="h-full">
              <TabsList className="w-full justify-start border-b rounded-none bg-transparent p-0">
                <TabsTrigger value="main" className="px-6 py-3 rounded-none border-b-2 border-transparent data-[state=active]:border-orange-500">
                  Main
                </TabsTrigger>
                <TabsTrigger value="chat" className="px-6 py-3 rounded-none border-b-2 border-transparent data-[state=active]:border-orange-500">
                  Chat
                </TabsTrigger>
                <TabsTrigger value="flashcards" className="px-6 py-3 rounded-none border-b-2 border-transparent data-[state=active]:border-orange-500">
                  Flashcards
                </TabsTrigger>
                <TabsTrigger value="notes" className="px-6 py-3 rounded-none border-b-2 border-transparent data-[state=active]:border-orange-500">
                  Notes
                </TabsTrigger>
                <TabsTrigger value="resources" className="px-6 py-3 rounded-none border-b-2 border-transparent data-[state=active]:border-orange-500">
                  Resources
                </TabsTrigger>
                <TabsTrigger value="discussion" className="px-6 py-3 rounded-none border-b-2 border-transparent data-[state=active]:border-orange-500">
                  Discussion
                </TabsTrigger>
              </TabsList>

              <TabsContent value="main" className="p-6 h-full">
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-8 text-center">
                  <div className="text-yellow-600 font-medium mb-2">Content is being generated</div>
                  <div className="text-yellow-700 text-sm">This section's content is currently being processed. Please check back soon.</div>
                  <div className="mt-4">
                    <div className="inline-flex items-center space-x-2 text-yellow-600">
                      <RefreshCw className="h-4 w-4 animate-spin" />
                      <span className="text-sm">Processing...</span>
                    </div>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="chat" className="p-6 h-full">
                <div className="h-full flex flex-col">
                  <div className="flex-1 space-y-4 overflow-y-auto mb-4">
                    <div className="flex items-start space-x-3">
                      <Avatar className="w-8 h-8">
                        <AvatarImage src="/avatars/ai-assistant.svg" />
                        <AvatarFallback>AI</AvatarFallback>
                      </Avatar>
                      <div className="flex-1 bg-gray-100 rounded-lg p-3">
                        <p className="text-sm">Hello! I'm your AI learning assistant. Feel free to ask me any questions about the A2A protocol or this lesson content.</p>
                      </div>
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <input
                      type="text"
                      value={chatMessage}
                      onChange={(e) => setChatMessage(e.target.value)}
                      placeholder="Ask a question about this content..."
                      className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    />
                    <Button className="bg-orange-500 hover:bg-orange-600">
                      <Send className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="flashcards" className="p-6 h-full">
                <div className="grid gap-4">
                  {flashcards.map((card) => (
                    <Card key={card.id} className="cursor-pointer hover:shadow-md transition-shadow">
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between mb-2">
                          <Badge variant={card.mastered ? "default" : "secondary"}>
                            {card.mastered ? "Mastered" : "Learning"}
                          </Badge>
                        </div>
                        <div className="font-medium mb-2">{card.front}</div>
                        <div className="text-sm text-gray-600">{card.back}</div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="notes" className="p-6 h-full">
                <div className="h-full">
                  <div className="flex items-center justify-between mb-4">
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
                      className="h-96 resize-none"
                    />
                  ) : (
                    <div className="h-96 p-4 border border-gray-200 rounded-lg bg-gray-50">
                      {notes || "No notes yet. Click Edit to start taking notes."}
                    </div>
                  )}
                </div>
              </TabsContent>

              <TabsContent value="resources" className="p-6 h-full">
                <div className="space-y-4">
                  <Card>
                    <CardContent className="p-4">
                      <div className="flex items-center space-x-3">
                        {getFileIcon(filePreview.type)}
                        <div className="flex-1">
                          <div className="font-medium">{filePreview.name}</div>
                          <div className="text-sm text-gray-600">Video • {filePreview.duration}</div>
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

              <TabsContent value="discussion" className="p-6 h-full">
                <div className="space-y-6">
                  {discussions.map((discussion) => (
                    <Card key={discussion.id}>
                      <CardContent className="p-4">
                        <div className="flex items-start space-x-3">
                          <Avatar className="w-10 h-10">
                            <AvatarImage src={discussion.avatar} />
                            <AvatarFallback>{discussion.user[0]}</AvatarFallback>
                          </Avatar>
                          <div className="flex-1">
                            <div className="flex items-center space-x-2 mb-2">
                              <span className="font-medium">{discussion.user}</span>
                              <span className="text-sm text-gray-500">{discussion.time}</span>
                            </div>
                            <p className="text-sm mb-3">{discussion.content}</p>
                            <div className="flex items-center space-x-4 text-sm text-gray-500">
                              <button className="flex items-center space-x-1 hover:text-blue-600">
                                <ThumbsUp className="h-4 w-4" />
                                <span>{discussion.likes}</span>
                              </button>
                              <button className="flex items-center space-x-1 hover:text-blue-600">
                                <Reply className="h-4 w-4" />
                                <span>Reply</span>
                              </button>
                              <span>{discussion.replies} replies</span>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>
            </Tabs>
          </div>

          {/* Bottom Navigation */}
          <div className="bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700 p-4">
            <div className="flex items-center justify-between">
              <Button variant="outline" onClick={() => navigate('/dashboard')}>
                <ArrowLeft className="h-4 w-4 mr-2" />
                Previous
              </Button>
              <div className="text-sm text-gray-600">1 of 1</div>
              <Button className="bg-orange-500 hover:bg-orange-600">
                Next
                <ChevronRight className="h-4 w-4 ml-2" />
              </Button>
            </div>
          </div>
        </div>

        {/* Right Sidebar */}
        <div className={`fixed right-0 top-16 h-[calc(100vh-4rem)] bg-white dark:bg-gray-900 border-l border-gray-200 dark:border-gray-700 transition-all duration-300 ${
          sidebarExpanded ? 'w-80' : 'w-12'
        }`}>
          {/* Sidebar Toggle */}
          <button
            onClick={() => setSidebarExpanded(!sidebarExpanded)}
            className="absolute -left-3 top-4 w-6 h-6 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-full flex items-center justify-center hover:bg-gray-50 dark:hover:bg-gray-800"
          >
            {sidebarExpanded ? <ChevronRight className="h-4 w-4" /> : <ChevronDown className="h-4 w-4 rotate-90" />}
          </button>

          {sidebarExpanded && (
            <div className="p-4 h-full overflow-y-auto">
              {/* Transcript Section */}
              <div className="mb-6">
                <button
                  onClick={() => setTranscriptExpanded(!transcriptExpanded)}
                  className="flex items-center justify-between w-full text-left font-medium mb-3"
                >
                  <span>Transcript</span>
                  {transcriptExpanded ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
                </button>
                {transcriptExpanded && (
                  <div className="space-y-3">
                    {transcript.map((item, index) => (
                      <div key={index} className="text-sm">
                        <div className="text-orange-600 font-medium">{item.time}</div>
                        <div className="text-gray-700 dark:text-gray-300">{item.text}</div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Edit Section */}
              <div className="mb-6">
                <div className="font-medium mb-3">Edit</div>
                <div className="space-y-2">
                  <Button variant="outline" size="sm" className="w-full justify-start">
                    <Edit3 className="h-4 w-4 mr-2" />
                    Edit Content
                  </Button>
                  <Button variant="outline" size="sm" className="w-full justify-start">
                    <Bookmark className="h-4 w-4 mr-2" />
                    Add Bookmark
                  </Button>
                </div>
              </div>

              {/* Progress Section */}
              <div className="mb-6">
                <div className="font-medium mb-3">Progress</div>
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-sm">
                    <span>Completion</span>
                    <span>{progress}%</span>
                  </div>
                  <Progress value={progress} className="h-2" />
                  <div className="flex items-center space-x-2 text-sm text-gray-600">
                    <Clock className="h-4 w-4" />
                    <span>5 min remaining</span>
                  </div>
                </div>
              </div>

              {/* Quick Actions */}
              <div>
                <div className="font-medium mb-3">Quick Actions</div>
                <div className="space-y-2">
                  <Button variant="outline" size="sm" className="w-full justify-start">
                    <Share2 className="h-4 w-4 mr-2" />
                    Share
                  </Button>
                  <Button variant="outline" size="sm" className="w-full justify-start">
                    <Download className="h-4 w-4 mr-2" />
                    Download
                  </Button>
                  <Button variant="outline" size="sm" className="w-full justify-start">
                    <Target className="h-4 w-4 mr-2" />
                    Set Goal
                  </Button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}