/*
 * @Descripttion: Upload Demo Component with AI Analysis Integration
 * @version: 1.0.0
 * @Author: Tom Zhou
 * @Date: 2025-07-31 00:48:37
 * @LastEditors: Tom Zhou
 * @LastEditTime: 2025-08-09 14:09:48
 */
import React, { useState, useCallback, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  FileText, 
  Video, 
  Image, 
  Music, 
  X, 
  ArrowRight,
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
  url?: string; // for web/url items
}

interface UploadDemoProps {
  onAnalysisComplete?: (data: any) => void;
}

export default function UploadDemo({ onAnalysisComplete }: UploadDemoProps) {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const [files, setFiles] = useState<FileItem[]>([]);
  const [isDragOver, setIsDragOver] = useState(false);
  const [urlInput, setUrlInput] = useState('');
  const [isUrlAnalyzing, setIsUrlAnalyzing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Deep research modal
  const [showPlan, setShowPlan] = useState(false);
  const [planText, setPlanText] = useState('');
  const [planTargetUrl, setPlanTargetUrl] = useState<string | undefined>(undefined);

  const isZH = i18n.language === 'zh';

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

  const openPlanModal = (url?: string) => {
    setPlanTargetUrl(url);
    const zh = `这是我的研究方案：如果需要改动，请在开始研究前告诉我。\n\n- 主题：教师资格证备考经验（时间安排 / 内容规划 / 资料与网课 / 为什么当老师）\n- 目标（由多变少，提炼精华）：\n  1) 用 5–7 条要点总结视频核心信息；\n  2) 产出 6 周可落地的备考计划（每周目标/每日专注块/复盘节点）；\n  3) 列出「高质量资料与网课」清单和选择标准；\n  4) 从动机角度回答“为什么当老师”，给出 3 条价值与成长路径；\n- 输出结构：摘要 → 计划 → 资料清单 → 动机与初心 → 进一步建议（可选）。`;
    const en = `My deep-research plan (editable):\n\n- Topic: Teacher exam prep (time planning / content roadmap / materials & courses / motivation).\n- Goals (distill signal from noise):\n  1) Summarize 5–7 key insights;\n  2) Produce a practical 6-week plan (weekly targets / daily focus blocks / review nodes);\n  3) Curate high‑quality materials & course criteria;\n  4) Address motivation (“why teach”) with 3 values & growth paths;\n- Output: Summary → Plan → Materials → Motivation → Next steps.`;
    setPlanText(isZH ? zh : en);
    setShowPlan(true);
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
            return { ...f, progress: newProgress, status: newProgress === 100 ? 'completed' : 'uploading' };
          }
          return f;
        }));
      }, 500);

      setTimeout(() => {
        clearInterval(interval);
        setFiles(prev => prev.map(f => f.id === file.id ? { ...f, progress: 100, status: 'completed' } : f));
        // Pop deep research modal after "Complete"
        openPlanModal();
      }, 3000);
    });
  }, []);

  // Instead of navigating immediately, create a pseudo file for the URL and simulate progress
  const handleUrlAnalysis = useCallback(async () => {
    if (!urlInput.trim()) return;
    const url = urlInput.trim();
    setIsUrlAnalyzing(true);

    const pseudo: FileItem = {
      id: Math.random().toString(36).substr(2, 9),
      name: url.replace(/https?:\/\//, '').slice(0, 60),
      size: 0,
      type: 'web/url',
      progress: 0,
      status: 'uploading',
      url
    };
    setFiles(prev => [...prev, pseudo]);

    // Simulate quick processing bar for link
    const start = Date.now();
    const timer = setInterval(() => {
      setFiles(prev => prev.map(f => {
        if (f.id === pseudo.id) {
          const elapsed = Date.now() - start;
          const p = Math.min(100, Math.round(elapsed / 15));
          return { ...f, progress: p, status: p >= 100 ? 'completed' : 'uploading' };
        }
        return f;
      }));
    }, 100);

    setTimeout(() => {
      clearInterval(timer);
      setFiles(prev => prev.map(f => f.id === pseudo.id ? { ...f, progress: 100, status: 'completed' } : f));
      setIsUrlAnalyzing(false);
      setUrlInput('');
      // Pop plan modal for link
      openPlanModal(url);
    }, 1600);
  }, [urlInput]);

  const removeFile = useCallback((id: string) => {
    setFiles(prev => prev.filter(f => f.id !== id));
  }, []);

  const handleDeepAnalysis = useCallback(() => {
    const lastUrl = [...files].reverse().find(f => f.type === 'web/url' && f.url)?.url;
    if (lastUrl) {
      navigate(`/unified-analysis?autostart=1&type=video&q=${encodeURIComponent(lastUrl)}`);
      return;
    }
    navigate('/unified-analysis');
  }, [files, navigate]);

  const startFromPlan = () => {
    // 直接沿用统一分析页（演示效果），把 plan 通过 state 传递以便未来扩展
    const lastUrl = planTargetUrl || ([...files].reverse().find(f => f.type === 'web/url' && f.url)?.url);
    if (lastUrl) {
      navigate(`/unified-analysis?autostart=1&type=video&q=${encodeURIComponent(lastUrl)}`, { state: { plan: planText } });
    } else {
      navigate('/unified-analysis', { state: { plan: planText } });
    }
  };

  return (
    <div className="space-y-6 relative">
      {/* URL Input */}
      <Card className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-0 shadow-sm">
        <CardContent className="p-6">
          <div className="flex items-center space-x-4">
            <div className="flex-1">
              <input
                type="url"
                placeholder={t('landing.locale') === 'zh' ? '输入任意网页或音视频链接进行分析...' : 'Enter URL for analysis...'}
                value={urlInput}
                onChange={(e) => setUrlInput(e.target.value)}
                className="w-full px-4 py-2 border border-gray-200 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder:text-gray-400 dark:placeholder:text-gray-400"
              />
            </div>
            <Button onClick={handleUrlAnalysis} disabled={!urlInput.trim() || isUrlAnalyzing} className="bg-green-600 hover:bg-green-700">
              {isUrlAnalyzing ? <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div> : <ArrowRight className="h-4 w-4" />}
              {t('landing.locale') === 'zh' ? '添加至列表' : 'Add to List'}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* File Upload Area */}
      <Card className="border-2 border-dashed border-gray-300 dark:border-gray-600 hover:border-blue-400 dark:hover:border-blue-500 transition-colors bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm">
        <CardContent className="p-8">
          <div
            className={`${isDragOver ? 'bg-blue-50 dark:bg-blue-900/20 border-blue-300 dark:border-blue-600' : ''} rounded-lg p-6 transition-colors text-center`}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
          >
            <h3 className="text-lg font-semibold mb-2 text-gray-900 dark:text-gray-100">
              {t('landing.locale') === 'zh' ? '上传文件进行AI分析' : 'Upload Files for AI Analysis'}
            </h3>
            <p className="text-gray-600 dark:text-gray-300 mb-4">
              {t('landing.locale') === 'zh' ? '拖拽文件到此处或点击选择文件' : 'Drag and drop files here or click to select'}
            </p>
            <Button onClick={() => fileInputRef.current?.click()} className="bg-blue-600 hover:bg-blue-700">
              {t('landing.locale') === 'zh' ? '选择文件' : 'Select Files'}
            </Button>
            <input ref={fileInputRef} type="file" multiple className="hidden" onChange={handleFileSelect} accept="*/*" />
          </div>
        </CardContent>
      </Card>

      {/* File/Link List + Deep Analysis Button */}
      {files.length > 0 && (
        <Card className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-0">
          <CardContent className="p-6">
            <h3 className="text-lg font-semibold mb-4">{t('landing.locale') === 'zh' ? '已上传文件' : 'Uploaded Files'}</h3>
            <div className="space-y-4">
              {files.map((file) => (
                <div key={file.id} className="flex items-center space-x-4 p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg border border-gray-200/60 dark:border-gray-600/60">
                  {getFileIcon(file.type)}
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-medium text-gray-900 dark:text-gray-100">{file.name}</span>
                      <div className="flex items-center space-x-2">
                        <Badge variant={file.status === 'completed' ? 'default' : 'secondary'}>
                          {file.status === 'completed' ? 'Complete' : 'Uploading'}
                        </Badge>
                        <Button size="sm" variant="ghost" onClick={() => removeFile(file.id)}>
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                    <div className="flex items-center justify-between text-sm text-gray-600 dark:text-gray-300">
                      <span>{file.type === 'web/url' ? (file.url || '') : formatFileSize(file.size)}</span>
                      <span>{Math.round(file.progress)}%</span>
                    </div>
                    <Progress value={file.progress} className="mt-2" />
                  </div>
                </div>
              ))}
            </div>
            {/* AI Deep Analysis Button */}
            <div className="pt-6 border-t mt-6">
              <Button size="lg" onClick={handleDeepAnalysis} className="w-full bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white text-lg py-6 shadow-2xl hover:shadow-3xl transition-all duration-300 hover:scale-105">
                {t('landing.locale') === 'zh' ? 'AI深度分析' : 'AI Deep Analysis'}
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
              <p className="text-sm text-gray-600 dark:text-gray-300 mt-2 text-center">
                {t('landing.locale') === 'zh' ? '进入专业分析界面，获得更深入的AI洞察' : 'Enter professional analysis interface for deeper AI insights'}
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Deep Research Plan Modal */}
      {showPlan && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="w-full max-w-2xl rounded-2xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 shadow-2xl overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{isZH ? 'AI 深度分析方案' : 'AI Deep Research Plan'}</h3>
              <Button variant="ghost" size="sm" onClick={() => setShowPlan(false)}>
                <X className="h-4 w-4" />
              </Button>
            </div>
            <div className="px-6 py-4 space-y-3">
              <div className="text-sm text-gray-600 dark:text-gray-300">
                {isZH ? '你可以在开始前修改下面的分析方案；我们将围绕该方案组织分析与输出。' : 'You can tweak the plan below; the analysis will follow this structure.'}
              </div>
              <textarea
                value={planText}
                onChange={(e) => setPlanText(e.target.value)}
                className="w-full h-56 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="px-6 pb-6 pt-2 flex items-center justify-end gap-3">
              <Button variant="outline" onClick={() => setShowPlan(false)}>{isZH ? '稍后再说' : 'Later'}</Button>
              <Button onClick={startFromPlan} className="bg-gradient-to-r from-orange-500 to-red-500 text-white">
                {isZH ? '开始分析' : 'Start Analysis'}
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
