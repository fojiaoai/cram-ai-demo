import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { BookOpen, Clock, Users, Star, Play, Calendar } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import NavigationBar from '@/components/navigation-bar';

interface Course {
  id: number;
  title: string;
  instructor: string;
  progress: number;
  totalLessons: number;
  completedLessons: number;
  duration: string;
  rating: number;
  students: number;
  thumbnail: string;
  category: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  lastAccessed: string;
}

export default function MyCourses() {
  const { t } = useTranslation();

  const courses: Course[] = [
    {
      id: 1,
      title: "Advanced React Development",
      instructor: "Sarah Johnson",
      progress: 75,
      totalLessons: 24,
      completedLessons: 18,
      duration: "8h 30m",
      rating: 4.8,
      students: 1250,
      thumbnail: "/placeholder.svg?height=200&width=300",
      category: "Web Development",
      difficulty: "advanced",
      lastAccessed: "2 days ago"
    },
    {
      id: 2,
      title: "UI/UX Design Fundamentals",
      instructor: "Mike Chen",
      progress: 45,
      totalLessons: 16,
      completedLessons: 7,
      duration: "6h 15m",
      rating: 4.6,
      students: 890,
      thumbnail: "/placeholder.svg?height=200&width=300",
      category: "Design",
      difficulty: "beginner",
      lastAccessed: "1 week ago"
    },
    {
      id: 3,
      title: "Data Science with Python",
      instructor: "Dr. Emily Wang",
      progress: 90,
      totalLessons: 32,
      completedLessons: 29,
      duration: "12h 45m",
      rating: 4.9,
      students: 2100,
      thumbnail: "/placeholder.svg?height=200&width=300",
      category: "Data Science",
      difficulty: "intermediate",
      lastAccessed: "Yesterday"
    }
  ];

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner': return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300';
      case 'intermediate': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-300';
      case 'advanced': return 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-300';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-300';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <NavigationBar />
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            {t('nav.myCourses')}
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Continue your learning journey with your enrolled courses
          </p>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-blue-100 dark:bg-blue-900/20 rounded-lg">
                  <BookOpen className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    {courses.length}
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Enrolled Courses
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-green-100 dark:bg-green-900/20 rounded-lg">
                  <Play className="h-6 w-6 text-green-600 dark:text-green-400" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    {courses.reduce((acc, course) => acc + course.completedLessons, 0)}
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Lessons Completed
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-purple-100 dark:bg-purple-900/20 rounded-lg">
                  <Clock className="h-6 w-6 text-purple-600 dark:text-purple-400" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    27h
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Total Learning Time
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-orange-100 dark:bg-orange-900/20 rounded-lg">
                  <Star className="h-6 w-6 text-orange-600 dark:text-orange-400" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    4.8
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Average Rating
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Course Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {courses.map((course) => (
            <Card key={course.id} className="overflow-hidden hover:shadow-lg transition-shadow">
              <div className="aspect-video bg-gray-200 dark:bg-gray-700">
                <img
                  src={course.thumbnail}
                  alt={course.title}
                  className="w-full h-full object-cover"
                />
              </div>
              
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between gap-2">
                  <CardTitle className="text-lg font-semibold line-clamp-2">
                    {course.title}
                  </CardTitle>
                  <Badge className={getDifficultyColor(course.difficulty)}>
                    {course.difficulty}
                  </Badge>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  by {course.instructor}
                </p>
              </CardHeader>

              <CardContent className="space-y-4">
                {/* Progress */}
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600 dark:text-gray-400">Progress</span>
                    <span className="font-medium">{course.progress}%</span>
                  </div>
                  <Progress value={course.progress} className="h-2" />
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {course.completedLessons} of {course.totalLessons} lessons completed
                  </p>
                </div>

                {/* Course Info */}
                <div className="flex items-center justify-between text-sm text-gray-600 dark:text-gray-400">
                  <div className="flex items-center gap-1">
                    <Clock className="h-4 w-4" />
                    <span>{course.duration}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Users className="h-4 w-4" />
                    <span>{course.students}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Star className="h-4 w-4 fill-current text-yellow-400" />
                    <span>{course.rating}</span>
                  </div>
                </div>

                {/* Last Accessed */}
                <div className="flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400">
                  <Calendar className="h-3 w-3" />
                  <span>Last accessed {course.lastAccessed}</span>
                </div>

                {/* Action Button */}
                <Button className="w-full" size="sm">
                  <Play className="h-4 w-4 mr-2" />
                  Continue Learning
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}