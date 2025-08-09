import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Brain, Mail, Lock, User, ArrowLeft } from 'lucide-react'
import { useTranslation } from 'react-i18next'

export default function AuthPage() {
  const [isLoading, setIsLoading] = useState(false)
  const { t, i18n } = useTranslation()

  const isZH = i18n.language === 'zh'

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setTimeout(() => {
      setIsLoading(false)
      window.location.href = '/dashboard'
    }, 2000)
  }

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setTimeout(() => {
      setIsLoading(false)
      window.location.href = '/dashboard'
    }, 2000)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6">
            <ArrowLeft className="h-4 w-4" />
            {isZH ? '返回首页' : 'Back to Home'}
          </Link>
          
          <div className="flex items-center justify-center gap-2 mb-4">
            <Brain className="h-8 w-8 text-blue-600" />
            <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              {isZH ? '佛脚AI' : 'Cram AI'}
            </span>
          </div>
          
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            {isZH ? '欢迎来到佛脚AI' : 'Welcome to Cram AI'}
          </h1>
          <p className="text-gray-600">
            {isZH ? '让AI把你的内容转化为知识与洞察' : 'Transform your content Into Knowledge and Insights with AI'}
          </p>
        </div>

        {/* Auth Forms */}
        <Card className="shadow-xl border-0">
          <CardHeader className="pb-4">
            <Tabs defaultValue="signin" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="signin">{isZH ? '登录' : 'Sign In'}</TabsTrigger>
                <TabsTrigger value="signup">{isZH ? '注册' : 'Sign Up'}</TabsTrigger>
              </TabsList>
              
              <TabsContent value="signin" className="mt-6">
                <CardTitle className="text-xl">{isZH ? '登录到你的账户' : 'Sign in to your account'}</CardTitle>
                <CardDescription>
                  {isZH ? '输入凭据以访问你的工作台' : 'Enter your credentials to access your dashboard'}
                </CardDescription>
              </TabsContent>
              
              <TabsContent value="signup" className="mt-6">
                <CardTitle className="text-xl">{isZH ? '创建你的账户' : 'Create your account'}</CardTitle>
                <CardDescription>
                  {isZH ? '几秒钟即可开始使用佛脚AI' : 'Get started with Cram AI in seconds'}
                </CardDescription>
              </TabsContent>
            </Tabs>
          </CardHeader>
          
          <CardContent>
            <Tabs defaultValue="signin" className="w-full">
              <TabsContent value="signin">
                <form onSubmit={handleSignIn} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="email">{isZH ? '邮箱' : 'Email'}</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <Input
                        id="email"
                        type="email"
                        placeholder={isZH ? '输入你的邮箱' : 'Enter your email'}
                        className="pl-10"
                        required
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="password">{isZH ? '密码' : 'Password'}</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <Input
                        id="password"
                        type="password"
                        placeholder={isZH ? '输入你的密码' : 'Enter your password'}
                        className="pl-10"
                        required
                      />
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <label className="flex items-center space-x-2 text-sm">
                      <input type="checkbox" className="rounded" />
                      <span className="text-gray-600">{isZH ? '记住我' : 'Remember me'}</span>
                    </label>
                    <a href="#" className="text-sm text-blue-600 hover:text-blue-700">
                      {isZH ? '忘记密码？' : 'Forgot password?'}
                    </a>
                  </div>
                  
                  <Button 
                    type="submit" 
                    className="w-full bg-blue-600 hover:bg-blue-700"
                    disabled={isLoading}
                  >
                    {isLoading ? (isZH ? '正在登录...' : 'Signing in...') : (isZH ? '登录' : 'Sign In')}
                  </Button>
                </form>
              </TabsContent>
              
              <TabsContent value="signup">
                <form onSubmit={handleSignUp} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">{isZH ? '姓名' : 'Full Name'}</Label>
                    <div className="relative">
                      <User className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <Input
                        id="name"
                        type="text"
                        placeholder={isZH ? '输入你的姓名' : 'Enter your full name'}
                        className="pl-10"
                        required
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="signup-email">{isZH ? '邮箱' : 'Email'}</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <Input
                        id="signup-email"
                        type="email"
                        placeholder={isZH ? '输入你的邮箱' : 'Enter your email'}
                        className="pl-10"
                        required
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="signup-password">{isZH ? '密码' : 'Password'}</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <Input
                        id="signup-password"
                        type="password"
                        placeholder={isZH ? '创建一个密码' : 'Create a password'}
                        className="pl-10"
                        required
                      />
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2 text-sm">
                    <input type="checkbox" className="rounded" required />
                    <span className="text-gray-600">
                      {isZH ? '我同意' : 'I agree to the'}{' '}
                      <a href="#" className="text-blue-600 hover:text-blue-700">
                        {isZH ? '服务条款' : 'Terms of Service'}
                      </a>{' '}
                      {isZH ? '和' : 'and'}{' '}
                      <a href="#" className="text-blue-600 hover:text-blue-700">
                        {isZH ? '隐私政策' : 'Privacy Policy'}
                      </a>
                    </span>
                  </div>
                  
                  <Button 
                    type="submit" 
                    className="w-full bg-blue-600 hover:bg-blue-700"
                    disabled={isLoading}
                  >
                    {isLoading ? (isZH ? '正在创建...' : 'Creating account...') : (isZH ? '创建账户' : 'Create Account')}
                  </Button>
                </form>
              </TabsContent>
            </Tabs>
            
            {/* Social Login */}
            <div className="mt-6">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-300" />
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-white text-gray-500">{isZH ? '或继续使用' : 'Or continue with'}</span>
                </div>
              </div>
              
              <div className="mt-6 grid grid-cols-2 gap-3">
                <Button variant="outline" className="w-full">Google</Button>
                <Button variant="outline" className="w-full">Twitter</Button>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <p className="text-center text-sm text-gray-600 mt-6">
          {isZH ? '注册即表示你同意我们的服务条款和隐私政策' : 'By signing up, you agree to our Terms of Service and Privacy Policy'}
        </p>
      </div>
    </div>
  )
}