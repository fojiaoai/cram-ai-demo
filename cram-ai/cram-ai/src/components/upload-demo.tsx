/*
 * @Descripttion: Upload Demo Component with AI Analysis Integration
 * @version: 1.0.0
 * @Author: Tom Zhou
 * @Date: 2025-07-31 00:48:37
 * @LastEditors: Tom Zhou
 * @LastEditTime: 2025-08-07 16:36:28
 */
import React, { useState, useCallback, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Upload, 
  FileText, 
  Video, 
  Image, 
  Music, 
  Archive, 
  X, 
  Play, 
  Pause, 
  Volume2, 
  Download,
  Share2,
  BookOpen,
  Brain,
  Zap,
  ArrowRight,
  Globe,
  Link,
  FileVideo,
  FileImage,
  FileAudio,
  File
} from 'lucide-react';

interface FileItem {
  id: string;
  name: string;
  size: number;
  type: string;
  progress: number;
  status: 'uploading' | 'completed' | 'error';
  preview?: string;
  analysisData?: any;
}

interface UploadDemoProps {
  onAnalysisComplete?: (data: any) => void;
}

export default function UploadDemo({ onAnalysisComplete }: UploadDemoProps) {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [files, setFiles] = useState<FileItem[]>([]);
  const [isDragOver, setIsDragOver] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [urlInput, setUrlInput] = useState('');
  const [isUrlAnalyzing, setIsUrlAnalyzing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const getFileIcon = (type: string) => {
    if (type.startsWith('video/')) return <FileVideo className="h-8 w-8 text-blue-500" />;
    if (type.startsWith('image/')) return <FileImage className="h-8 w-8 text-green-500" />;
    if (type.startsWith('audio/')) return <FileAudio className="h-8 w-8 text-purple-500" />;
    if (type.includes('pdf')) return <FileText className="h-8 w-8 text-red-500" />;
    return <File className="h-8 w-8 text-gray-500" />;
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    const droppedFiles = Array.from(e.dataTransfer.files);
    handleFiles(droppedFiles);
  }, []);

  const handleFileSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const selectedFiles = Array.from(e.target.files);
      handleFiles(selectedFiles);
    }
  }, []);

  const handleFiles = useCallback((fileList: File[]) => {
    const newFiles: FileItem[] = fileList.map(file => ({
      id: Math.random().toString(36).substr(2, 9),
      name: file.name,
      size: file.size,
      type: file.type,
      progress: 0,
      status: 'uploading' as const,
      preview: file.type.startsWith('image/') ? URL.createObjectURL(file) : undefined
    }));

    setFiles(prev => [...prev, ...newFiles]);

    // Simulate upload progress
    newFiles.forEach(file => {
      const interval = setInterval(() => {
        setFiles(prev => prev.map(f => {
          if (f.id === file.id) {
            const newProgress = Math.min(f.progress + Math.random() * 30, 100);
            return {
              ...f,
              progress: newProgress,
              status: newProgress === 100 ? 'completed' : 'uploading'
            };
          }
          return f;
        }));
      }, 500);

      setTimeout(() => {
        clearInterval(interval);
        setFiles(prev => prev.map(f => 
          f.id === file.id ? { ...f, progress: 100, status: 'completed' } : f
        ));
      }, 3000);
    });
  }, []);

  const handleUrlAnalysis = useCallback(async () => {
    if (!urlInput.trim()) return;
    
    setIsUrlAnalyzing(true);
    
    // Simulate URL analysis
    setTimeout(() => {
      const mockFile: FileItem = {
        id: Math.random().toString(36).substr(2, 9),
        name: urlInput.split('/').pop() || 'Web Content',
        size: 0,
        type: 'web/url',
        progress: 100,
        status: 'completed',
        analysisData: {
          title: 'Web Content Analysis',
          summary: 'Content successfully parsed from URL',
          url: urlInput
        }
      };
      
      setFiles(prev => [...prev, mockFile]);
      setUrlInput('');
      setIsUrlAnalyzing(false);
    }, 2000);
  }, [urlInput]);

  const removeFile = useCallback((id: string) => {
    setFiles(prev => prev.filter(f => f.id !== id));
  }, []);

  const handleDeepAnalysis = useCallback(() => {
    const analysisData = {
      files: files,
      timestamp: new Date().toISOString(),
      analysisType: 'comprehensive',
      source: 'upload-demo'
    };
    
    navigate('/unified-analysis', { 
      state: { analysisData } 
    });
  }, [files, navigate]);

  return (
    <div className="space-y-6">
      {/* File Upload Area */}
      <Card className="border-2 border-dashed border-gray-300 hover:border-blue-400 transition-colors">
        <CardContent className="p-8">
          <div
            className={`text-center ${isDragOver ? 'bg-blue-50 border-blue-300' : ''} rounded-lg p-6 transition-colors`}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
          >
            <Upload className="mx-auto h-12 w-12 text-gray-400 mb-4" />
            <h3 className="text-lg font-semibold mb-2">
              {t('landing.locale') === 'zh' ? '上传文件进行AI分析' : 'Upload Files for AI Analysis'}
            </h3>
            <p className="text-gray-600 mb-4">
              {t('landing.locale') === 'zh' 
                ? '拖拽文件到此处或点击选择文件' 
                : 'Drag and drop files here or click to select'}
            </p>
            <Button 
              onClick={() => fileInputRef.current?.click()}
              className="bg-blue-600 hover:bg-blue-700"
            >
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
          </div>
        </CardContent>
      </Card>

      {/* URL Input */}
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center space-x-4">
            <Globe className="h-6 w-6 text-blue-500" />
            <div className="flex-1">
              <input
                type="url"
                placeholder={t('landing.locale') === 'zh' ? '输入网页链接进行分析...' : 'Enter URL for analysis...'}
                value={urlInput}
                onChange={(e) => setUrlInput(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <Button 
              onClick={handleUrlAnalysis}
              disabled={!urlInput.trim() || isUrlAnalyzing}
              className="bg-green-600 hover:bg-green-700"
            >
              {isUrlAnalyzing ? (
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
              ) : (
                <Link className="h-4 w-4" />
              )}
              {t('landing.locale') === 'zh' ? '分析' : 'Analyze'}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* File List */}
      {files.length > 0 && (
        <Card>
          <CardContent className="p-6">
            <h3 className="text-lg font-semibold mb-4">
              {t('landing.locale') === 'zh' ? '已上传文件' : 'Uploaded Files'}
            </h3>
            <div className="space-y-4">
              {files.map((file) => (
                <div key={file.id} className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg">
                  {getFileIcon(file.type)}
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-medium">{file.name}</span>
                      <div className="flex items-center space-x-2">
                        <Badge variant={file.status === 'completed' ? 'default' : 'secondary'}>
                          {file.status === 'completed' ? 'Complete' : 'Uploading'}
                        </Badge>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => removeFile(file.id)}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                    <div className="flex items-center justify-between text-sm text-gray-600">
                      <span>{formatFileSize(file.size)}</span>
                      <span>{file.progress}%</span>
                    </div>
                    <Progress value={file.progress} className="mt-2" />
                  </div>
                </div>
              ))}
            </div>
            
            {/* AI Deep Analysis Button */}
            <div className="pt-6 border-t mt-6">
              <Button 
                size="lg" 
                onClick={handleDeepAnalysis}
                className="w-full bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white text-lg py-6 shadow-2xl hover:shadow-3xl transition-all duration-300 hover:scale-105"
              >
                <Zap className="mr-2 h-5 w-5" />
                {t('landing.locale') === 'zh' ? 'AI深度分析' : 'AI Deep Analysis'}
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
              <p className="text-sm text-gray-600 mt-2 text-center">
                {t('landing.locale') === 'zh' 
                  ? '进入专业分析界面，获得更深入的AI洞察' 
                  : 'Enter professional analysis interface for deeper AI insights'}
              </p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
