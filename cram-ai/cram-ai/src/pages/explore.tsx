import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Search, 
  Filter, 
  Star, 
  Users, 
  Clock, 
  BookOpen, 
  TrendingUp,
  Award,
  Play,
  Heart,
  Share2
} from 'lucide-react';
import { useTranslation } from 'react-i18next';
import NavigationBar from '@/components/navigation-bar';

interface Course {
  id: number;
  title: string;
  instructor: string;
  rating: number;
  students: number;
  duration: string;
  price: number;
  originalPrice?: number;
  thumbnail: string;
  category: string;
  level: 'beginner' | 'intermediate' | 'advanced';
  tags: string[];
  description: string;
  isBestseller?: boolean;
  isNew?: boolean;
}

export default function Explore() {
  const { t } = useTranslation();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  const categories = [
    { id: 'all', name: 'All Courses', count: 1250 },
    { id: 'web-dev', name: 'Web Development', count: 320 },
    { id: 'data-science', name: 'Data Science', count: 180 },
    { id: 'design', name: 'Design', count: 150 },
    { id: 'business', name: 'Business', count: 200 },
    { id: 'marketing', name: 'Marketing', count: 120 },
    { id: 'photography', name: 'Photography', count: 80 },
    { id: 'music', name: 'Music', count: 90 }
  ];

  const courses: Course[] = [
    {
      id: 1,
      title: "Complete Web Development Bootcamp",
      instructor: "Angela Yu",
      rating: 4.7,
      students: 45000,
      duration: "65h",
      price: 89.99,
      originalPrice: 199.99,
      thumbnail: "/placeholder.svg?height=200&width=300",
      category: "Web Development",
      level: "beginner",
      tags: ["HTML", "CSS", "JavaScript", "React"],
      description: "Learn web development from scratch with hands-on projects",
      isBestseller: true
    },
    {
      id: 2,
      title: "Machine Learning A-Z",
      instructor: "Kirill Eremenko",
      rating: 4.5,
      students: 32000,
      duration: "44h",
      price: 79.99,
      originalPrice: 149.99,
      thumbnail: "/placeholder.svg?height=200&width=300",
      category: "Data Science",
      level: "intermediate",
      tags: ["Python", "Machine Learning", "AI"],
      description: "Master machine learning algorithms with Python"
    },
    {
      id: 3,
      title: "UI/UX Design Masterclass",
      instructor: "Daniel Schifano",
      rating: 4.8,
      students: 28000,
      duration: "32h",
      price: 69.99,
      thumbnail: "/placeholder.svg?height=200&width=300",
      category: "Design",
      level: "beginner",
      tags: ["Figma", "Adobe XD", "Prototyping"],
      description: "Create stunning user interfaces and experiences",
      isNew: true
    },
    {
      id: 4,
      title: "Digital Marketing Strategy",
      instructor: "Neil Patel",
      rating: 4.6,
      students: 19000,
      duration: "28h",
      price: 59.99,
      originalPrice: 129.99,
      thumbnail: "/placeholder.svg?height=200&width=300",
      category: "Marketing",
      level: "intermediate",
      tags: ["SEO", "Social Media", "Analytics"],
      description: "Build effective digital marketing campaigns"
    },
    {
      id: 5,
      title: "Photography Fundamentals",
      instructor: "Mango Street",
      rating: 4.4,
      students: 15000,
      duration: "18h",
      price: 49.99,
      thumbnail: "/placeholder.svg?height=200&width=300",
      category: "Photography",
      level: "beginner",
      tags: ["DSLR", "Composition", "Editing"],
      description: "Master the art of photography from basics to advanced"
    },
    {
      id: 6,
      title: "Business Strategy Essentials",
      instructor: "Harvard Business School",
      rating: 4.9,
      students: 8500,
      duration: "25h",
      price: 149.99,
      thumbnail: "/placeholder.svg?height=200&width=300",
      category: "Business",
      level: "advanced",
      tags: ["Strategy", "Leadership", "Management"],
      description: "Learn strategic thinking and business planning",
      isBestseller: true
    }
  ];

  const getLevelColor = (level: string) => {
    switch (level) {
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
            {t('nav.explore')}
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Discover new skills and advance your career with our curated courses
          </p>
        </div>

        {/* Search and Filters */}
        <div className="mb-8 space-y-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search courses, instructors, or topics..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <Button variant="outline" className="flex items-center gap-2">
              <Filter className="h-4 w-4" />
              Filters
            </Button>
          </div>

          {/* Category Tabs */}
          <Tabs value={selectedCategory} onValueChange={setSelectedCategory}>
            <TabsList className="grid w-full grid-cols-4 lg:grid-cols-8">
              {categories.map((category) => (
                <TabsTrigger key={category.id} value={category.id} className="text-xs">
                  {category.name}
                </TabsTrigger>
              ))}
            </TabsList>
          </Tabs>
        </div>

        {/* Featured Section */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            Featured Courses
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {courses.slice(0, 3).map((course) => (
              <Card key={course.id} className="overflow-hidden hover:shadow-lg transition-shadow group">
                <div className="relative aspect-video bg-gray-200 dark:bg-gray-700">
                  <img
                    src={course.thumbnail}
                    alt={course.title}
                    className="w-full h-full object-cover"
                  />
                  {course.isBestseller && (
                    <Badge className="absolute top-2 left-2 bg-orange-500 text-white">
                      <Award className="h-3 w-3 mr-1" />
                      Bestseller
                    </Badge>
                  )}
                  {course.isNew && (
                    <Badge className="absolute top-2 left-2 bg-green-500 text-white">
                      New
                    </Badge>
                  )}
                  <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <Button size="sm" className="bg-white text-black hover:bg-gray-100">
                      <Play className="h-4 w-4 mr-2" />
                      Preview
                    </Button>
                  </div>
                </div>
                
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between gap-2">
                    <CardTitle className="text-lg font-semibold line-clamp-2">
                      {course.title}
                    </CardTitle>
                    <div className="flex gap-1">
                      <Button variant="ghost" size="sm" className="p-1">
                        <Heart className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm" className="p-1">
                        <Share2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    by {course.instructor}
                  </p>
                </CardHeader>

                <CardContent className="space-y-4">
                  <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
                    {course.description}
                  </p>

                  {/* Course Info */}
                  <div className="flex items-center justify-between text-sm text-gray-600 dark:text-gray-400">
                    <div className="flex items-center gap-1">
                      <Star className="h-4 w-4 fill-current text-yellow-400" />
                      <span>{course.rating}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Users className="h-4 w-4" />
                      <span>{course.students.toLocaleString()}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="h-4 w-4" />
                      <span>{course.duration}</span>
                    </div>
                  </div>

                  {/* Tags */}
                  <div className="flex flex-wrap gap-1">
                    {course.tags.slice(0, 3).map((tag) => (
                      <Badge key={tag} variant="secondary" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                    <Badge className={getLevelColor(course.level)}>
                      {course.level}
                    </Badge>
                  </div>

                  {/* Price and Action */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-lg font-bold text-gray-900 dark:text-white">
                        ${course.price}
                      </span>
                      {course.originalPrice && (
                        <span className="text-sm text-gray-500 line-through">
                          ${course.originalPrice}
                        </span>
                      )}
                    </div>
                    <Button size="sm">
                      Enroll Now
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* All Courses */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
              All Courses
            </h2>
            <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
              <span>Showing {courses.length} courses</span>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {courses.map((course) => (
              <Card key={course.id} className="overflow-hidden hover:shadow-lg transition-shadow group">
                <div className="relative aspect-video bg-gray-200 dark:bg-gray-700">
                  <img
                    src={course.thumbnail}
                    alt={course.title}
                    className="w-full h-full object-cover"
                  />
                  {course.isBestseller && (
                    <Badge className="absolute top-2 left-2 bg-orange-500 text-white">
                      <Award className="h-3 w-3 mr-1" />
                      Bestseller
                    </Badge>
                  )}
                  {course.isNew && (
                    <Badge className="absolute top-2 left-2 bg-green-500 text-white">
                      New
                    </Badge>
                  )}
                  <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <Button size="sm" className="bg-white text-black hover:bg-gray-100">
                      <Play className="h-4 w-4 mr-2" />
                      Preview
                    </Button>
                  </div>
                </div>
                
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg font-semibold line-clamp-2">
                    {course.title}
                  </CardTitle>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    by {course.instructor}
                  </p>
                </CardHeader>

                <CardContent className="space-y-4">
                  <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
                    {course.description}
                  </p>

                  {/* Course Info */}
                  <div className="flex items-center justify-between text-sm text-gray-600 dark:text-gray-400">
                    <div className="flex items-center gap-1">
                      <Star className="h-4 w-4 fill-current text-yellow-400" />
                      <span>{course.rating}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Users className="h-4 w-4" />
                      <span>{course.students.toLocaleString()}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="h-4 w-4" />
                      <span>{course.duration}</span>
                    </div>
                  </div>

                  {/* Tags */}
                  <div className="flex flex-wrap gap-1">
                    {course.tags.slice(0, 3).map((tag) => (
                      <Badge key={tag} variant="secondary" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                    <Badge className={getLevelColor(course.level)}>
                      {course.level}
                    </Badge>
                  </div>

                  {/* Price and Action */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-lg font-bold text-gray-900 dark:text-white">
                        ${course.price}
                      </span>
                      {course.originalPrice && (
                        <span className="text-sm text-gray-500 line-through">
                          ${course.originalPrice}
                        </span>
                      )}
                    </div>
                    <Button size="sm">
                      Enroll Now
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}