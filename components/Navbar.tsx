'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import { Menu, X, User, LogOut, Calendar } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { useSession, signOut } from 'next-auth/react'

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false)
  const [showUserMenu, setShowUserMenu] = useState(false)
  const [userData, setUserData] = useState(null)
  const pathname = usePathname()
  const { data: session, status } = useSession()
  const dropdownRef = useRef<HTMLDivElement | null>(null)

  const handleLogout = async () => {
    try {
      await signOut({ callbackUrl: '/' })
      setUserData(null)
      setShowUserMenu(false)
      document.cookie = 'userEmail=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT'
    } catch (error) {
      console.error('Logout error:', error)
    }
  }
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowUserMenu(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  const navLinks = [
    { href: '/', label: 'Home' },
    { href: '/rooms', label: 'Rooms' },
    { href: '/gallery', label: 'Gallery' },
    { href: '/faq', label: 'FAQ' },
    { href: '/contact', label: 'Contact' },
    { href: '/about', label: 'About' },
  ]

  const isActive = (href: string) => pathname === href

  const ProfileDropdown = ({ isMobile = false }) => (
    <div className={`relative ${isMobile ? 'w-full' : ''}`} ref={!isMobile ? dropdownRef : null}>
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setShowUserMenu(!showUserMenu)}
        className={`flex items-center gap-2 ${
          isMobile 
            ? 'w-full justify-center px-3 py-2 bg-varanasi-maroon/10 rounded-lg' 
            : 'px-2 py-2 hover:bg-varanasi-gold/10 rounded-full'
        } transition-colors`}
      >
        <div className="relative w-8 h-8 rounded-full overflow-hidden border-2 border-varanasi-gold/50">
          <Image
            src="/images/userdefault.jpeg"
            alt="Profile"
            fill
            className="object-cover"
          />
        </div>
        {isMobile && (
          <span className="text-sm font-medium text-varanasi-maroon">
            {session?.user?.name || 'Profile'}
          </span>
        )}
      </motion.button>

      <AnimatePresence>
        {showUserMenu && (
          <motion.div
            initial={{ opacity: 0, y: isMobile ? 0 : 10, scale: isMobile ? 1 : 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: isMobile ? 0 : 10, scale: isMobile ? 1 : 0.95 }}
            transition={{ duration: 0.2 }}
            className={`${
              isMobile 
                ? 'mt-2 w-full' 
                : 'fixed right-4 top-[4.5rem] w-44'
            } bg-white rounded-xl shadow-2xl border border-varanasi-gold/20 overflow-hidden z-[9999]`}
          >
            <div className="py-2">
              <Link 
                href="/profile" 
                onClick={() => {
                  setShowUserMenu(false)
                  if (isMobile) setIsOpen(false)
                }}
                className="flex items-center gap-2 px-3 py-2 text-sm text-varanasi-maroon hover:bg-varanasi-gold/10 transition-colors"
              >
                <User className="w-4 h-4" />
                Profile
              </Link>
              <Link 
                href="/booking" 
                onClick={() => {
                  setShowUserMenu(false)
                  if (isMobile) setIsOpen(false)
                }}
                className="flex items-center gap-2 px-3 py-2 text-sm text-varanasi-maroon hover:bg-varanasi-gold/10 transition-colors"
              >
                <Calendar className="w-4 h-4" />
                Booking
              </Link>
              <hr className="my-1 border-varanasi-gold/20" />
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 px-3 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors w-full text-left"
              >
                <LogOut className="w-4 h-4" />
                Logout
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )

  return (
    <nav className="fixed top-0 w-full z-[100] transition-all duration-300">
      <div className="glass-effect">
        <div className="container-custom">
          <div className="flex justify-between items-center py-3 md:py-4 relative">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2 md:gap-3 flex-shrink-0">
              <motion.div
                whileHover={{ scale: 1.05 }}
                className="relative w-10 h-10 md:w-12 md:h-12 rounded-full overflow-hidden border-2 border-varanasi-gold/30 shadow-md"
              >
                <Image
                  src="/images/MainLogo.jpg"
                  alt="Hotel Shri Vishwanath Logo"
                  fill
                  className="object-cover"
                />
              </motion.div>
              <div className="hidden md:block">
                <h1 className="font-serif text-base md:text-lg font-bold text-varanasi-maroon">
                  Shri Vishwanath
                </h1>
                <p className="text-xs text-varanasi-gold">Varanasi's Heritage</p>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center gap-6">
              {navLinks.map((link) => (
                <Link key={link.href} href={link.href}>
                  <motion.div
                    whileHover={{ y: -2 }}
                    className={`text-sm font-medium transition-colors relative group ${
                      isActive(link.href)
                        ? 'text-varanasi-gold glow-gold'
                        : 'text-varanasi-maroon hover:text-varanasi-gold'
                    }`}
                  >
                    {link.label}
                    <motion.div
                      className="absolute bottom-0 left-0 h-0.5 bg-gradient-to-r from-varanasi-gold to-transparent"
                      initial={{ width: 0 }}
                      whileHover={{ width: '100%' }}
                      transition={{ duration: 0.3 }}
                    />
                  </motion.div>
                </Link>
              ))}
            </div>
            
            {/* Desktop Auth Section */}
            <div className="hidden lg:flex items-center gap-4">
              {status === 'authenticated' && session ? (
                <ProfileDropdown />
              ) : (
                <Link href="/auth/signin">
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="px-4 py-2 bg-gradient-to-r from-varanasi-maroon to-varanasi-maroon-dark text-white rounded-full text-sm font-semibold transition-shadow hover:shadow-lg hover:shadow-varanasi-maroon/50"
                  >
                    Book Now
                  </motion.div>
                </Link>
              )}
            </div>

            {/* Mobile Profile Icon & Menu Button */}
            <div className="lg:hidden flex items-center gap-2">
              {status === 'authenticated' && session && (
                <div className="relative" ref={dropdownRef}>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setShowUserMenu(!showUserMenu)}
                    className="p-2 hover:bg-varanasi-gold/10 rounded-full transition-colors"
                  >
                    <div className="relative w-8 h-8 rounded-full overflow-hidden border-2 border-varanasi-gold/50">
                      <Image
                        src="/images/userdefault.jpeg"
                        alt="Profile"
                        fill
                        className="object-cover"
                      />
                    </div>
                  </motion.button>

                  <AnimatePresence>
                    {showUserMenu && (
                      <motion.div
                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                        transition={{ duration: 0.2 }}
                        className="fixed right-2 top-16 w-44 bg-white rounded-xl shadow-2xl border border-varanasi-gold/20 overflow-hidden z-[9999]"
                      >
                        <div className="py-2">
                          <Link 
                            href="/profile" 
                            onClick={() => {
                              setShowUserMenu(false)
                              setIsOpen(false)
                            }}
                            className="flex items-center gap-2 px-3 py-2 text-sm text-varanasi-maroon hover:bg-varanasi-gold/10 transition-colors"
                          >
                            <User className="w-4 h-4" />
                            Profile
                          </Link>
                          <Link 
                            href="/booking" 
                            onClick={() => {
                              setShowUserMenu(false)
                              setIsOpen(false)
                            }}
                            className="flex items-center gap-2 px-3 py-2 text-sm text-varanasi-maroon hover:bg-varanasi-gold/10 transition-colors"
                          >
                            <Calendar className="w-4 h-4" />
                            Booking
                          </Link>
                          <hr className="my-1 border-varanasi-gold/20" />
                          <button
                            onClick={handleLogout}
                            className="flex items-center gap-2 px-3 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors w-full text-left"
                          >
                            <LogOut className="w-4 h-4" />
                            Logout
                          </button>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              )}
              
              <motion.button
                whileTap={{ scale: 0.95 }}
                onClick={() => setIsOpen(!isOpen)}
                className="p-2 hover:bg-varanasi-gold/10 rounded-lg transition-colors flex-shrink-0"
              >
                {isOpen ? (
                  <X className="w-5 h-5 md:w-6 md:h-6 text-varanasi-maroon" />
                ) : (
                  <Menu className="w-5 h-5 md:w-6 md:h-6 text-varanasi-maroon" />
                )}
              </motion.button>
            </div>
          </div>

          {/* Mobile Navigation */}
          <motion.div
            initial={false}
            animate={{ height: isOpen ? 'auto' : 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden lg:hidden"
          >
            <div className="py-3 md:py-4 space-y-2 border-t border-varanasi-gold/20">
              {navLinks.map((link) => (
                <Link key={link.href} href={link.href} onClick={() => setIsOpen(false)}>
                  <motion.div
                    className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                      isActive(link.href)
                        ? 'bg-varanasi-maroon/10 text-varanasi-gold'
                        : 'text-varanasi-maroon hover:bg-varanasi-gold/10'
                    }`}
                  >
                    {link.label}
                  </motion.div>
                </Link>
              ))}

              {/* Mobile Auth Section */}
              {status !== 'authenticated' && (
                <Link href="/auth/signin" onClick={() => setIsOpen(false)}>
                  <motion.div
                    whileTap={{ scale: 0.95 }}
                    className="block w-full px-3 py-2 mt-3 bg-gradient-to-r from-varanasi-maroon to-varanasi-maroon-dark text-white rounded-lg text-sm font-semibold text-center"
                  >
                    Book Now
                  </motion.div>
                </Link>
              )}
            </div>
          </motion.div>
        </div>
      </div>
    </nav>
  )
}

export default Navbar