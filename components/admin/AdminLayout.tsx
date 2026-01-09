'use client'

import { ReactNode } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { motion } from 'framer-motion'
import { 
  LayoutDashboard, 
  Users, 
  Bed, 
  Calendar, 
  Star, 
  Tag, 
  Gift,
  LogOut,
  Menu,
  X
} from 'lucide-react'
import { signOut } from 'next-auth/react'
import { useState } from 'react'

interface AdminLayoutProps {
  children: ReactNode
}

interface NavItem {
  name: string
  href: string
  icon: any
}

const navItems: NavItem[] = [
  { name: 'Dashboard', href: '/admin/dashboard', icon: LayoutDashboard },
  { name: 'Customers', href: '/admin/dashboard/customers', icon: Users },
  { name: 'Rooms', href: '/admin/dashboard/rooms', icon: Bed },
  { name: 'Orders', href: '/admin/dashboard/orders', icon: Calendar },
  { name: 'Reviews', href: '/admin/dashboard/reviews', icon: Star },
  { name: 'Categories', href: '/admin/dashboard/categories', icon: Tag },
  { name: 'Coupons', href: '/admin/dashboard/coupons', icon: Gift },
]

export default function AdminLayout({ children }: AdminLayoutProps) {
  const pathname = usePathname()
  const [sidebarOpen, setSidebarOpen] = useState(false)

  const handleLogout = async () => {
    await signOut({ callbackUrl: '/' })
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 lg:hidden"
        >
          <div 
            className="absolute inset-0 bg-gray-600 opacity-75"
            onClick={() => setSidebarOpen(false)}
          ></div>
        </motion.div>
      )}

      {/* Sidebar */}
      <motion.div
        initial={false}
        animate={{ x: sidebarOpen ? 0 : -320 }}
        className={`fixed inset-y-0 left-0 z-50 w-80 bg-white shadow-lg transform lg:translate-x-0 lg:static lg:inset-0 transition-transform duration-300 ease-in-out`}
      >
        <div className="flex items-center justify-between h-16 px-6 bg-gradient-to-r from-amber-600 via-orange-600 to-red-700">
          <h1 className="text-xl font-bold text-white">Admin Panel</h1>
          <button
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden text-white hover:text-gray-200"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <nav className="mt-8">
          <div className="px-6 space-y-2">
            {navItems.map((item) => {
              const Icon = item.icon
              const isActive = pathname === item.href
              
              return (
                <Link key={item.href} href={item.href}>
                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className={`flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-colors ${
                      isActive
                        ? 'bg-amber-100 text-amber-900 border-l-4 border-amber-600'
                        : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                    }`}
                  >
                    <Icon className="mr-3 h-5 w-5" />
                    {item.name}
                  </motion.div>
                </Link>
              )
            })}
          </div>

          <div className="mt-8 pt-8 border-t border-gray-200 px-6">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleLogout}
              className="flex items-center w-full px-4 py-3 text-sm font-medium text-red-600 rounded-lg hover:bg-red-50 transition-colors"
            >
              <LogOut className="mr-3 h-5 w-5" />
              Logout
            </motion.button>
          </div>
        </nav>
      </motion.div>

      {/* Main content */}
      <div className="lg:pl-80">
        {/* Top navigation */}
        <div className="sticky top-0 z-10 flex h-16 bg-white shadow">
          <button
            onClick={() => setSidebarOpen(true)}
            className="px-4 text-gray-500 focus:outline-none focus:ring-2 focus:ring-amber-500 lg:hidden"
          >
            <Menu className="w-6 h-6" />
          </button>
          
          <div className="flex flex-1 justify-between px-6 items-center">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">
                Hotel Shri Vishwanath Admin
              </h2>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="text-sm text-gray-600">
                Welcome, Admin
              </div>
              <div className="w-8 h-8 bg-amber-600 rounded-full flex items-center justify-center">
                <span className="text-white text-sm font-semibold">A</span>
              </div>
            </div>
          </div>
        </div>

        {/* Page content */}
        <main className="flex-1 relative overflow-y-auto focus:outline-none">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="py-6"
          >
            {children}
          </motion.div>
        </main>
      </div>
    </div>
  )
}