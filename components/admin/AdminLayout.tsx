"use client"
import React, { useState } from 'react';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, Code, FolderKanban, MessageSquareQuote, Users, Briefcase, Menu, X, LogOut, Sparkles, Star, Zap } from 'lucide-react';
import Link from 'next/link';

interface MenuItem {
  id: string;
  label: string;
  icon: any;
  href: string;
}

export default function AdminSidebar() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const pathname = usePathname();

  const menuItems: MenuItem[] = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, href: '/admin/dashboard' },
    { id: 'users', label: 'Users', icon: Users, href: '/admin/dashboard/users' },
    { id: 'bookings', label: 'Bookings', icon: Briefcase, href: '/admin/dashboard/bookings' },
    { id: 'galary', label: 'Galary', icon: Star, href: '/admin/dashboard/galary' },
    { id: 'rooms', label: 'Rooms', icon: FolderKanban, href: '/admin/dashboard/rooms' },
    { id: 'faq', label: 'FAQ', icon: MessageSquareQuote, href: '/admin/dashboard/faq' },
    { id: 'partnersplatforms', label: 'Partners Platforms', icon: Code, href: '/admin/dashboard/partnersplatforms' },
    { id: 'contacts', label: 'Contacts', icon: Sparkles, href: '/admin/dashboard/contacts' },
  ];

  const handleLogout = async () => {
    try {
      const response = await fetch('/api/admin/logout', {
        method: 'POST',
      });

      if (response.ok) {
        window.location.href = '/';
      }
    } catch (error) {
      window.location.href = '/';
    }
  };

  return (
    <>
      {/* Mobile Menu Button - FIXED POSITION, ALWAYS VISIBLE */}
      <button
        onClick={() => setSidebarOpen(!sidebarOpen)}
        className="lg:hidden fixed top-5 left-4 z-[60] bg-varanasi-maroon text-varanasi-gold p-2.5 rounded-lg shadow-2xl hover:scale-110 transition-transform duration-300 border border-varanasi-gold"
        aria-label="Toggle menu"
      >
        {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
      </button>

      {/* Sidebar Overlay for Mobile */}
      {sidebarOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-varanasi-maroon bg-opacity-40 z-40 backdrop-blur-sm"
          onClick={() => setSidebarOpen(false)}
        ></div>
      )}

      {/* Sidebar - HIGHER Z-INDEX THAN MENU BUTTON */}
      <aside
        className={`fixed top-0 left-0 h-full w-72 bg-varanasi-cream shadow-2xl transform transition-transform duration-300 z-50 border-r-4 border-varanasi-gold ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        } lg:translate-x-0`}
      >
        <div className="h-full flex flex-col relative overflow-hidden">
          {/* Decorative Elements */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-varanasi-gold opacity-10 rounded-full blur-3xl"></div>
          
          {/* Logo/Header */}
          <div className="p-6 border-b-2 border-varanasi-gold bg-varanasi-maroon relative overflow-hidden">
            <div className="absolute top-0 right-0">
              <Sparkles className="text-varanasi-gold opacity-20" size={60} />
            </div>
            <Link href="/admin/dashboard" className="flex items-center space-x-3 relative z-10" onClick={() => setSidebarOpen(false)}>
              <div>
                <h2 className="text-varanasi-gold font-black text-xl flex items-center">
                  HotelShriVishwanath
                  <Star className="ml-1 text-varanasi-gold" size={16} />
                </h2>
                <p className="text-varanasi-gold/80 text-xs font-bold tracking-wide">Admin Portal</p>
              </div>
            </Link>
          </div>

          {/* Navigation */}
          <nav className="flex-1 overflow-y-auto p-4 relative">
            <ul className="space-y-2">
              {menuItems.map((item) => {
                const Icon = item.icon;
                const isActive = pathname === item.href;
                return (
                  <li key={item.id}>
                    <Link
                      href={item.href}
                      onClick={() => setSidebarOpen(false)}
                      className={`group w-full flex items-center justify-between px-4 py-3.5 rounded-xl font-bold transition-all duration-300 border ${
                        isActive
                          ? 'bg-varanasi-maroon text-varanasi-gold border-varanasi-gold shadow-xl transform scale-105'
                          : 'text-varanasi-brown border-transparent hover:bg-varanasi-gold/10 hover:text-varanasi-maroon hover:border-varanasi-gold hover:scale-105'
                      }`}
                    >
                      <div className="flex items-center space-x-3">
                        <Icon size={20} />
                        <span>{item.label}</span>
                      </div>
                      {isActive && <Zap size={16} className="animate-pulse text-varanasi-gold" />}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>

          {/* Bottom Actions */}
          <div className="p-4 border-t-2 border-varanasi-gold space-y-2 bg-varanasi-maroon/5">
            <button
              onClick={handleLogout}
              className="w-full flex items-center space-x-3 px-4 py-3 rounded-xl font-bold text-varanasi-maroon hover:bg-varanasi-gold/20 hover:scale-105 transition-all duration-300 shadow-sm border border-varanasi-maroon/20"
            >
              <LogOut size={20} />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </aside>

      {/* Spacer for desktop - pushes content to the right */}
      <div className="hidden lg:block w-72"></div>
    </>
  );
}