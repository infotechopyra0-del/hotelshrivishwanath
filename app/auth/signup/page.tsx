'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Mail, Lock, Eye, EyeOff, UserPlus, ArrowLeft, User } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { toast } from 'sonner'
import { useRouter } from 'next/navigation'
import { signIn} from 'next-auth/react'

const SignupPage = () => {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: ''
  })
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [errors, setErrors] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: ''
  })
  const router = useRouter()


  const validateEmail = (email: string) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return regex.test(email)
  }

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const handleSubmit = async () => {
    setErrors({
      fullName: '',
      email: '',
      password: '',
      confirmPassword: ''
    })

    let hasError = false

    if (!formData.fullName) {
      setErrors(prev => ({ ...prev, fullName: 'Full name is required' }))
      hasError = true
    } else if (formData.fullName.length < 3) {
      setErrors(prev => ({ ...prev, fullName: 'Name must be at least 3 characters' }))
      hasError = true
    }

    if (!formData.email) {
      setErrors(prev => ({ ...prev, email: 'Email is required' }))
      hasError = true
    } else if (!validateEmail(formData.email)) {
      setErrors(prev => ({ ...prev, email: 'Invalid Email Id' }))
      hasError = true
    } else if (!formData.email.toLowerCase().endsWith('@gmail.com')) {
      setErrors(prev => ({ ...prev, email: 'Invalid Email Id' }))
      hasError = true
    }

    // Password Validation
    if (!formData.password) {
      setErrors(prev => ({ ...prev, password: 'Password is required' }))
      hasError = true
    } else if (formData.password.length < 6) {
      setErrors(prev => ({ ...prev, password: 'Password must be at least 6 characters' }))
      hasError = true
    }

    // Confirm Password Validation
    if (!formData.confirmPassword) {
      setErrors(prev => ({ ...prev, confirmPassword: 'Please confirm your password' }))
      hasError = true
    } else if (formData.password !== formData.confirmPassword) {
      setErrors(prev => ({ ...prev, confirmPassword: 'Passwords do not match' }))
      hasError = true
    }

    if (hasError) return

    setIsLoading(true)

    try {
      const response = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          fullName: formData.fullName,
          email: formData.email,
          password: formData.password,
        }),
      })
      const data = await response.json()
      if (response.ok) {
        toast.success('Account created successfully!', {
          description: `Welcome to Shri Vishwanath Hotel, ${formData.fullName}!`,
          duration: 3000,
        })

        // Clear form
        setFormData({
          fullName: '',
          email: '',
          password: '',
          confirmPassword: ''
        })

        // Auto-login user after successful signup
        const loginResult = await signIn('credentials', {
          email: formData.email,
          password: formData.password,
          redirect: false,
        })

        if (loginResult?.ok) {
          // Set cookie with email
          document.cookie = `userEmail=${formData.email}; path=/; max-age=2592000; SameSite=Lax`
          
          // Redirect to home page
          setTimeout(() => {
            router.push('/')
          }, 1000)
        } else {
          // If auto-login fails, redirect to signin
          setTimeout(() => {
            router.push('/auth/signin')
          }, 2000)
        }
      } else {
        toast.error('Signup failed', {
          description: data.message || 'Something went wrong',
          duration: 4000,
        })
      }
    } catch (error) {
      console.error('Signup error:', error)
      toast.error('Something went wrong', {
        description: 'Please try again later',
        duration: 4000,
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSubmit()
    }
  }

  return (
    <div className="h-screen w-screen overflow-hidden bg-gradient-to-br from-amber-50 via-orange-50 to-red-50 flex items-center justify-center relative">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5 pointer-events-none">
        <div className="absolute inset-0" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%238B4513' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }} />
      </div>

      {/* Main Container */}
      <div className="w-full h-full flex flex-col items-center justify-center px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Back to Home Button */}
        <Link 
          href="/" 
          className="absolute top-4 left-4 sm:top-6 sm:left-6 inline-flex items-center gap-2 text-xs sm:text-sm font-medium text-amber-900 hover:text-amber-700 transition-colors"
        >
          <ArrowLeft className="w-3 h-3 sm:w-4 sm:h-4" />
          <span className="hidden sm:inline">Back to Home</span>
        </Link>

        {/* Signup Card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-[90vw] sm:max-w-md bg-white/90 backdrop-blur-lg rounded-xl sm:rounded-2xl shadow-2xl border border-amber-200/50 overflow-hidden"
        >
          {/* Header with Logo */}
          <div className="bg-gradient-to-r from-amber-900 via-red-900 to-amber-900 px-4 py-4 sm:px-6 sm:py-6 text-center">
            <motion.div
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="flex justify-center mb-2 sm:mb-3"
            >
              <div className="relative w-12 h-12 sm:w-16 sm:h-16 rounded-full overflow-hidden border-2 sm:border-4 border-amber-400/30 shadow-lg">
                <Image
                  src="/images/MainLogo.jpg"
                  alt="Hotel Shri Vishwanath Logo"
                  fill
                  className="object-cover"
                />
              </div>
            </motion.div>
            <h1 className="text-lg sm:text-2xl font-serif font-bold text-white mb-1">
              Create Account
            </h1>
            <p className="text-amber-200 text-xs sm:text-sm">
              Join Shri Vishwanath family today
            </p>
          </div>

          {/* Signup Form */}
          <div className="px-4 py-4 sm:px-6 sm:py-5">
            <div className="space-y-3 sm:space-y-3.5">
              {/* Full Name Field */}
              <div>
                <label htmlFor="fullName" className="block text-xs sm:text-sm font-semibold text-amber-900 mb-1 sm:mb-1.5">
                  Full Name
                </label>
                <div className="relative">
                  <div className="absolute left-2.5 sm:left-3 top-1/2 -translate-y-1/2 text-amber-600">
                    <User className="w-4 h-4 sm:w-5 sm:h-5" />
                  </div>
                  <input
                    id="fullName"
                    type="text"
                    value={formData.fullName}
                    onChange={(e) => handleChange('fullName', e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="Enter your full name"
                    className={`w-full pl-9 sm:pl-11 pr-3 sm:pr-4 py-2 sm:py-2.5 text-sm bg-amber-50/50 border-2 rounded-lg text-amber-900 placeholder-amber-400 focus:outline-none focus:ring-2 transition-all ${
                      errors.fullName
                        ? 'border-red-400 focus:border-red-500 focus:ring-red-200'
                        : 'border-amber-200 focus:border-amber-500 focus:ring-amber-200'
                    }`}
                  />
                </div>
                {errors.fullName && (
                  <motion.p
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-1 text-[10px] sm:text-xs text-red-600"
                  >
                    {errors.fullName}
                  </motion.p>
                )}
              </div>

              {/* Email Field */}
              <div>
                <label htmlFor="email" className="block text-xs sm:text-sm font-semibold text-amber-900 mb-1 sm:mb-1.5">
                  Email Address
                </label>
                <div className="relative">
                  <div className="absolute left-2.5 sm:left-3 top-1/2 -translate-y-1/2 text-amber-600">
                    <Mail className="w-4 h-4 sm:w-5 sm:h-5" />
                  </div>
                  <input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleChange('email', e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="Enter your email"
                    className={`w-full pl-9 sm:pl-11 pr-3 sm:pr-4 py-2 sm:py-2.5 text-sm bg-amber-50/50 border-2 rounded-lg text-amber-900 placeholder-amber-400 focus:outline-none focus:ring-2 transition-all ${
                      errors.email
                        ? 'border-red-400 focus:border-red-500 focus:ring-red-200'
                        : 'border-amber-200 focus:border-amber-500 focus:ring-amber-200'
                    }`}
                  />
                </div>
                {errors.email && (
                  <motion.p
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-1 text-[10px] sm:text-xs text-red-600"
                  >
                    {errors.email}
                  </motion.p>
                )}
              </div>

              {/* Password Field */}
              <div>
                <label htmlFor="password" className="block text-xs sm:text-sm font-semibold text-amber-900 mb-1 sm:mb-1.5">
                  Password
                </label>
                <div className="relative">
                  <div className="absolute left-2.5 sm:left-3 top-1/2 -translate-y-1/2 text-amber-600">
                    <Lock className="w-4 h-4 sm:w-5 sm:h-5" />
                  </div>
                  <input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    value={formData.password}
                    onChange={(e) => handleChange('password', e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="Create a password"
                    className={`w-full pl-9 sm:pl-11 pr-10 sm:pr-12 py-2 sm:py-2.5 text-sm bg-amber-50/50 border-2 rounded-lg text-amber-900 placeholder-amber-400 focus:outline-none focus:ring-2 transition-all ${
                      errors.password
                        ? 'border-red-400 focus:border-red-500 focus:ring-red-200'
                        : 'border-amber-200 focus:border-amber-500 focus:ring-amber-200'
                    }`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-2.5 sm:right-3 top-1/2 -translate-y-1/2 text-amber-600 hover:text-amber-800 transition-colors"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4 sm:w-5 sm:h-5" /> : <Eye className="w-4 h-4 sm:w-5 sm:h-5" />}
                  </button>
                </div>
                {errors.password && (
                  <motion.p
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-1 text-[10px] sm:text-xs text-red-600"
                  >
                    {errors.password}
                  </motion.p>
                )}
              </div>

              {/* Confirm Password Field */}
              <div>
                <label htmlFor="confirmPassword" className="block text-xs sm:text-sm font-semibold text-amber-900 mb-1 sm:mb-1.5">
                  Confirm Password
                </label>
                <div className="relative">
                  <div className="absolute left-2.5 sm:left-3 top-1/2 -translate-y-1/2 text-amber-600">
                    <Lock className="w-4 h-4 sm:w-5 sm:h-5" />
                  </div>
                  <input
                    id="confirmPassword"
                    type={showConfirmPassword ? 'text' : 'password'}
                    value={formData.confirmPassword}
                    onChange={(e) => handleChange('confirmPassword', e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="Confirm your password"
                    className={`w-full pl-9 sm:pl-11 pr-10 sm:pr-12 py-2 sm:py-2.5 text-sm bg-amber-50/50 border-2 rounded-lg text-amber-900 placeholder-amber-400 focus:outline-none focus:ring-2 transition-all ${
                      errors.confirmPassword
                        ? 'border-red-400 focus:border-red-500 focus:ring-red-200'
                        : 'border-amber-200 focus:border-amber-500 focus:ring-amber-200'
                    }`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-2.5 sm:right-3 top-1/2 -translate-y-1/2 text-amber-600 hover:text-amber-800 transition-colors"
                  >
                    {showConfirmPassword ? <EyeOff className="w-4 h-4 sm:w-5 sm:h-5" /> : <Eye className="w-4 h-4 sm:w-5 sm:h-5" />}
                  </button>
                </div>
                {errors.confirmPassword && (
                  <motion.p
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-1 text-[10px] sm:text-xs text-red-600"
                  >
                    {errors.confirmPassword}
                  </motion.p>
                )}
              </div>

              {/* Submit Button */}
              <motion.button
                onClick={handleSubmit}
                disabled={isLoading}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full py-2 sm:py-2.5 bg-gradient-to-r from-amber-900 via-red-900 to-amber-900 text-white rounded-lg font-semibold text-sm shadow-lg hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {isLoading ? (
                  <>
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                      className="w-4 h-4 border-2 border-white border-t-transparent rounded-full"
                    />
                    <span>Creating Account...</span>
                  </>
                ) : (
                  <>
                    <UserPlus className="w-4 h-4" />
                    <span>Create Account</span>
                  </>
                )}
              </motion.button>

              {/* OR Divider */}
              <div className="flex items-center justify-center my-3 sm:my-4">
                <div className="flex-1 border-t border-amber-200"></div>
                <span className="mx-3 text-xs text-amber-600 bg-white px-2">OR</span>
                <div className="flex-1 border-t border-amber-200"></div>
              </div>

              {/* Google Signup Button */}
              <motion.button
                onClick={() => signIn('google', { callbackUrl: '/' })}
                disabled={isLoading}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full py-2 sm:py-2.5 bg-white border-2 border-amber-200 text-amber-900 rounded-lg font-semibold text-sm shadow-lg hover:shadow-xl hover:border-amber-300 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                <svg className="w-4 h-4 sm:w-5 sm:h-5" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
                <span>Continue with Google</span>
              </motion.button>
            </div>

            {/* Login Link */}
            <p className="mt-3 sm:mt-4 text-center text-xs sm:text-sm text-amber-800">
              Already have an account?{' '}
              <Link href="/auth/signin" className="font-bold text-amber-900 hover:text-amber-700 transition-colors">
                Sign In
              </Link>
            </p>
          </div>
        </motion.div>

        {/* Footer */}
        <p className="absolute bottom-4 sm:bottom-6 text-center text-[10px] sm:text-xs text-amber-700 px-4">
          Protected by reCAPTCHA and subject to Anthropic's Privacy Policy
        </p>
      </div>
    </div>
  )
}

export default SignupPage