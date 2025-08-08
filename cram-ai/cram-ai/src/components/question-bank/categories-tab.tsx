import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, Filter } from 'lucide-react';

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

interface CategoriesTabProps {
  isDarkMode: boolean;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  filteredCategories: QuestionCategory[];
  onCategorySelect: (categoryId: string) => void;
  getDifficultyColor: (difficulty: string) => string;
}

export const CategoriesTab: React.FC<CategoriesTabProps> = ({
  isDarkMode,
  searchQuery,
  onSearchChange,
  filteredCategories,
  onCategorySelect,
  getDifficultyColor
}) => {
  return (
    <div className="space-y-6">
      {/* Search and Filter */}
      <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            type="text"
            placeholder="Search categories..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className={`pl-10 ${
              isDarkMode 
                ? 'bg-gray-800/50 border-gray-700 text-white placeholder-gray-400' 
                : 'bg-white/80 border-gray-200 text-gray-900 placeholder-gray-500'
            }`}
          />
        </div>
        <Button variant="outline" className="flex items-center gap-2">
          <Filter className="w-4 h-4" />
          Filter
        </Button>
      </div>

      {/* Categories Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredCategories.map((category, index) => (
          <Card 
            key={category.id}
            className={`border-0 shadow-xl overflow-hidden cursor-pointer transition-all duration-300 hover:shadow-2xl hover:scale-105 animate-fade-in-up ${
              isDarkMode ? 'bg-gray-800/80 backdrop-blur-sm' : 'bg-white/80 backdrop-blur-sm'
            }`}
            style={{ animationDelay: `${index * 100}ms` }}
            onClick={() => onCategorySelect(category.id)}
          >
            <div className={`absolute inset-0 bg-gradient-to-br ${category.color}/10`} />
            <CardHeader className="relative">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className={`p-3 ${category.color} rounded-lg shadow-lg`}>
                    <category.icon className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <CardTitle className="text-lg">{category.name}</CardTitle>
                    <p className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                      {category.description}
                    </p>
                  </div>
                </div>
                <Badge className={`${getDifficultyColor(category.difficulty)} border-0`}>
                  {category.difficulty}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="relative">
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">Progress</span>
                  <span className="text-sm text-blue-600 font-semibold">
                    {Math.round((category.completedCount / category.questionCount) * 100)}%
                  </span>
                </div>
                <Progress 
                  value={(category.completedCount / category.questionCount) * 100} 
                  className="h-2" 
                />
                
                <div className="flex justify-between text-sm text-gray-500">
                  <span>{category.completedCount} completed</span>
                  <span>{category.questionCount} total</span>
                </div>
                
                <div className="flex flex-wrap gap-2">
                  {category.tags.map((tag) => (
                    <Badge 
                      key={tag} 
                      variant="secondary" 
                      className="text-xs bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300"
                    >
                      {tag}
                    </Badge>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};