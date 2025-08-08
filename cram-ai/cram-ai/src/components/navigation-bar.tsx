import React from 'react'
import { Link, useLocation } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { Button } from '@/components/ui/button'
import { 
  Brain,
  Settings,
  Search,
  Sun,
  Moon,
  Globe
} from 'lucide-react'
import { useTheme } from '@/components/theme-provider'

interface NavigationBarProps {
  className?: string
}

export default function NavigationBar({ className = '' }: NavigationBarProps) {
  const { t, i18n } = useTranslation()
  const location = useLocation()
  const { theme, setTheme } = useTheme()

  const toggleLanguage = () => {
    const newLang = i18n.language === 'zh' ? 'en' : 'zh'
    i18n.changeLanguage(newLang)
  }

  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark')
  }

  const navigationItems = [
    { key: 'home', path: '/dashboard', label: t('nav.home', 'Home') },
    { key: 'courses', path: '/ai-analysis', label: t('nav.myCourses', 'My Courses') },
    { key: 'exam', path: '/exam-interface', label: t('nav.exam', 'Exam') },
    { key: 'explore', path: '/question-bank', label: t('nav.explore', 'Explore') },
    { key: 'community', path: '/community', label: t('nav.community', 'Community') },
    { key: 'creators', path: '/creators', label: t('nav.creators', 'Creators') }
  ]

  const isActive = (path: string) => {
    return location.pathname === path || 
           (path === '/dashboard' && location.pathname === '/') ||
           (path === '/ai-analysis' && location.pathname === '/unified-analysis')
  }

  return (
    <header className={`bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 sticky top-0 z-50 ${className}`}>
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center space-x-4">
            <Link to="/dashboard" className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-r from-orange-500 to-red-500 rounded-lg flex items-center justify-center">
                <Brain className="h-5 w-5 text-white" />
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">
                CramAI
              </span>
            </Link>
          </div>

          {/* Navigation Links */}
          <nav className="hidden md:flex items-center space-x-1">
            {navigationItems.map((item) => (
              <Link
                key={item.key}
                to={item.path}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                  isActive(item.path)
                    ? 'bg-gradient-to-r from-orange-500 to-red-500 text-white shadow-lg'
                    : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
                }`}
              >
                {item.label}
              </Link>
            ))}
          </nav>

          {/* Right side actions */}
          <div className="flex items-center space-x-3">
            {/* Search */}
            <div className="relative hidden lg:block">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder={t('nav.searchPlaceholder', '搜索内容、词条或分析...')}
                className="pl-10 pr-4 py-2 w-64 text-sm border border-gray-200 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
              />
            </div>

            {/* Language Toggle */}
            <Button 
              variant="ghost" 
              size="sm"
              onClick={toggleLanguage}
              className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100"
            >
              <Globe className="h-4 w-4 mr-1" />
              {i18n.language === 'zh' ? 'EN' : '中'}
            </Button>

            {/* Theme Toggle */}
            <Button 
              variant="ghost" 
              size="sm"
              onClick={toggleTheme}
              className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100"
            >
              {theme === 'dark' ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            </Button>

            {/* Premium Upgrade */}
            <Button 
              variant="outline" 
              size="sm"
              className="border-orange-200 text-orange-600 hover:bg-orange-50 dark:border-orange-800 dark:text-orange-400 dark:hover:bg-orange-950"
            >
              {t('nav.upgradePremium', 'Upgrade to Premium')}
            </Button>

            {/* Settings */}
            <Button variant="ghost" size="sm">
              <Settings className="h-4 w-4" />
            </Button>

            {/* User Avatar */}
            <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full"></div>
          </div>
        </div>
      </div>
    </header>
  )
}