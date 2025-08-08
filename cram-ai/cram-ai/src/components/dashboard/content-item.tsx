import React from 'react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { FileText, Video, Globe, MoreHorizontal } from 'lucide-react';
import { useTranslation } from 'react-i18next';

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

interface ContentItemProps {
  item: ContentItem;
  isDarkMode: boolean;
  onClick?: () => void;
}

export const ContentItemComponent: React.FC<ContentItemProps> = ({ 
  item, 
  isDarkMode, 
  onClick 
}) => {
  const { t } = useTranslation();

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
    <div 
      className={`group p-4 rounded-lg border transition-all duration-300 hover:shadow-md cursor-pointer ${
        isDarkMode ? 'bg-gray-700/30 border-gray-600 hover:bg-gray-700/50' : 'bg-gray-50/50 border-gray-200 hover:bg-white'
      }`}
      onClick={onClick}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          onClick?.();
        }
      }}
      aria-label={`${item.title}, ${item.progress}% complete, ${item.insights} insights`}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4 flex-1 min-w-0">
          <div className={`p-2 rounded-lg ${getTypeColor(item.type)}`}>
            {getTypeIcon(item.type)}
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-sm mb-1 truncate" title={item.title}>
              {item.title}
            </h3>
            <div className="flex items-center space-x-4 text-xs text-gray-500">
              <span>{item.lastAccessed}</span>
              <span>{item.insights} {t('dashboard.recentContent.insights')}</span>
              <span className={getStatusColor(item.status)}>
                {t(`dashboard.recentContent.status.${item.status}`)}
              </span>
            </div>
          </div>
        </div>
        <div className="flex items-center space-x-3 flex-shrink-0">
          <div className="text-right">
            <div className="text-sm font-medium">{item.progress}%</div>
            <div className="text-xs text-gray-500">
              {t('dashboard.recentContent.confidence')}: {item.confidence}%
            </div>
          </div>
          <div className="w-16">
            <Progress value={item.progress} className="h-2" />
          </div>
          <Button 
            variant="ghost" 
            size="sm" 
            className="opacity-0 group-hover:opacity-100 transition-opacity"
            aria-label="More options"
          >
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};