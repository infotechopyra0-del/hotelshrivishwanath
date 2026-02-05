"use client";

import React, { useState, useEffect, useRef } from "react";
import {
  TrendingUp,
  Sparkles,
  Zap,
  Users,
  BookOpen,
  Image as ImageIcon,
  Hotel,
  HelpCircle,
  MessageSquare,
  Calendar,
  RefreshCw,
  Activity,
  DollarSign,
} from "lucide-react";
import { toast } from "sonner";

interface DashboardStats {
  totalUsers: number;
  totalBookings: number;
  totalGalleryImages: number;
  totalRooms: number;
  totalFAQs: number;
  totalContacts: number;
  pendingBookings?: number;
  activeRooms?: number;
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<DashboardStats>({
    totalUsers: 0,
    totalBookings: 0,
    totalGalleryImages: 0,
    totalRooms: 0,
    totalFAQs: 0,
    totalContacts: 0,
    pendingBookings: 0,
    activeRooms: 0,
  });
  const [loading, setLoading] = useState(true);
  const loadToastShownRef = useRef(false);

  useEffect(() => {
    fetchDashboardStats();
  }, []);

  const fetchDashboardStats = async (opts: { forceToast?: boolean } = {}) => {
    setLoading(true);
    try {
      const response = await fetch("/api/admin/dashboard/stats", {
        credentials: "include",
        headers: { Accept: "application/json" },
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || "Failed to fetch dashboard stats");
      }

      const data: DashboardStats = await response.json();
      setStats(data);

      if (!loadToastShownRef.current || opts.forceToast) {
        toast.success("Dashboard loaded successfully! 🏨");
        loadToastShownRef.current = true;
      }
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Please check your connection.";
      toast.error("Failed to load dashboard", { description: message });
    } finally {
      setLoading(false);
    }
  };

  const statsConfig = [
    {
      label: "Total Users",
      value: stats.totalUsers,
      icon: Users,
      color: "from-blue-500 to-blue-700",
      bgColor: "from-blue-50 to-blue-100",
      borderColor: "border-blue-200",
      hoverBorder: "hover:border-blue-500",
      description: "Registered users",
      trend: "+12%",
    },
    {
      label: "Total Bookings",
      value: stats.totalBookings,
      icon: BookOpen,
      color: "from-green-500 to-green-700",
      bgColor: "from-green-50 to-green-100",
      borderColor: "border-green-200",
      hoverBorder: "hover:border-green-500",
      description: "All time bookings",
      trend: "+8%",
    },
    {
      label: "Gallery Images",
      value: stats.totalGalleryImages,
      icon: ImageIcon,
      color: "from-purple-500 to-purple-700",
      bgColor: "from-purple-50 to-purple-100",
      borderColor: "border-purple-200",
      hoverBorder: "hover:border-purple-500",
      description: "Total images",
      trend: "+5%",
    },
    {
      label: "Total Rooms",
      value: stats.totalRooms,
      icon: Hotel,
      color: "from-orange-500 to-orange-700",
      bgColor: "from-orange-50 to-orange-100",
      borderColor: "border-orange-200",
      hoverBorder: "hover:border-orange-500",
      description: "Available rooms",
      trend: "+3%",
    },
    {
      label: "Total FAQs",
      value: stats.totalFAQs,
      icon: HelpCircle,
      color: "from-pink-500 to-pink-700",
      bgColor: "from-pink-50 to-pink-100",
      borderColor: "border-pink-200",
      hoverBorder: "hover:border-pink-500",
      description: "FAQ entries",
      trend: "+15%",
    },
    {
      label: "Total Contacts",
      value: stats.totalContacts,
      icon: MessageSquare,
      color: "from-teal-500 to-teal-700",
      bgColor: "from-teal-50 to-teal-100",
      borderColor: "border-teal-200",
      hoverBorder: "hover:border-teal-500",
      description: "Contact messages",
      trend: "+20%",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-amber-50">
      {/* Fixed Header */}
      <header className="fixed top-0 left-0 lg:left-72 right-0 z-50 bg-white/95 backdrop-blur-xl shadow-xl border-b-4 border-varanasi-gold">
        <div className="px-4 sm:px-6 lg:px-8 py-5">
          <div className="flex items-center justify-between">
            <div className="ml-12 lg:ml-0">
              <h1 className="text-3xl sm:text-4xl font-black text-varanasi-maroon flex items-center gap-2">
                Dashboard
                <Sparkles className="text-varanasi-gold" size={28} />
              </h1>
              <p className="text-sm text-varanasi-brown mt-1 font-semibold">
                Welcome back, Admin! 👋
              </p>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="pt-32 px-4 sm:px-6 lg:px-8 pb-8">
        {/* Stats Section */}
        <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-2xl p-4 sm:p-6 lg:p-8 border-2 border-varanasi-gold/30 relative overflow-hidden group">
          <div className="absolute top-0 right-0 opacity-5 group-hover:opacity-10 transition-opacity duration-300">
            <Sparkles size={300} className="text-varanasi-gold" />
          </div>

          <div className="relative z-10">
            {/* Header */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8 gap-4">
              <div>
                <h2 className="text-2xl sm:text-3xl font-black text-varanasi-maroon flex items-center gap-2">
                  <Activity className="text-varanasi-gold" size={28} />
                  Dashboard Overview
                </h2>
                <p className="text-sm text-varanasi-brown mt-1">
                  Real-time statistics and insights
                </p>
              </div>

              <button
                onClick={() => fetchDashboardStats({ forceToast: true })}
                disabled={loading}
                className="w-full sm:w-auto bg-gradient-to-r from-varanasi-gold to-varanasi-gold-dark text-varanasi-maroon font-bold px-6 py-3 rounded-xl shadow-lg hover:scale-105 transition-all duration-300 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <RefreshCw
                  size={18}
                  className={loading ? "animate-spin" : ""}
                />
                <span>Refresh</span>
              </button>
            </div>

            {/* Loading State */}
            {loading && (
              <div className="text-center py-20">
                <div className="inline-block animate-spin rounded-full h-16 w-16 border-4 border-varanasi-gold border-t-transparent"></div>
                <p className="mt-4 text-varanasi-brown font-bold text-lg">
                  Loading dashboard...
                </p>
              </div>
            )}

            {/* Stats Cards Grid */}
            {!loading && (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                {statsConfig.map((stat, index) => {
                  const Icon = stat.icon;
                  return (
                    <div
                      key={index}
                      className={`group/card bg-gradient-to-br ${stat.bgColor} rounded-2xl border-2 ${stat.borderColor} ${stat.hoverBorder} overflow-hidden shadow-lg hover:shadow-2xl transform hover:-translate-y-2 transition-all duration-300 cursor-pointer`}
                    >
                      <div className="p-6">
                        {/* Icon and Trend */}
                        <div className="flex items-start justify-between mb-4">
                          <div
                            className={`w-14 h-14 bg-gradient-to-br ${stat.color} rounded-xl flex items-center justify-center shadow-lg group-hover/card:rotate-12 group-hover/card:scale-110 transition-all duration-300`}
                          >
                            <Icon size={28} className="text-white" />
                          </div>
                          <div className="flex items-center gap-1 bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-bold">
                            <TrendingUp size={12} />
                            <span>{stat.trend}</span>
                          </div>
                        </div>

                        {/* Value */}
                        <div className="mb-2">
                          <h3 className="text-4xl sm:text-5xl font-black text-gray-900 mb-1 group-hover/card:scale-110 transition-transform duration-300 origin-left">
                            {stat.value.toLocaleString()}
                          </h3>
                          <p className="text-sm font-bold text-gray-600">
                            {stat.description}
                          </p>
                        </div>

                        {/* Label */}
                        <div className="flex items-center justify-between pt-4 border-t-2 border-white/50">
                          <p className="text-base font-black text-gray-900">
                            {stat.label}
                          </p>
                          <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                        </div>
                      </div>

                      {/* Hover Effect Bar */}
                      <div
                        className={`h-1.5 bg-gradient-to-r ${stat.color} transform scale-x-0 group-hover/card:scale-x-100 transition-transform duration-300 origin-left`}
                      ></div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Quick Stats Summary */}
        {!loading && (
          <div className="mt-6 grid grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-gradient-to-br from-varanasi-gold/10 to-varanasi-gold/5 border-2 border-varanasi-gold/30 rounded-xl p-4 hover:shadow-lg transition-all duration-300">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-green-700 rounded-lg flex items-center justify-center">
                  <Activity size={24} className="text-white" />
                </div>
                <div>
                  <p className="text-2xl font-black text-varanasi-maroon">
                    {stats.activeRooms || 0}
                  </p>
                  <p className="text-xs font-semibold text-varanasi-brown">
                    Active Rooms
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-orange-100/50 to-orange-50/50 border-2 border-orange-200 rounded-xl p-4 hover:shadow-lg transition-all duration-300">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-orange-700 rounded-lg flex items-center justify-center">
                  <Calendar size={24} className="text-white" />
                </div>
                <div>
                  <p className="text-2xl font-black text-varanasi-maroon">
                    {stats.pendingBookings || 0}
                  </p>
                  <p className="text-xs font-semibold text-varanasi-brown">
                    Pending Bookings
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-blue-100/50 to-blue-50/50 border-2 border-blue-200 rounded-xl p-4 hover:shadow-lg transition-all duration-300">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-700 rounded-lg flex items-center justify-center">
                  <DollarSign size={24} className="text-white" />
                </div>
                <div>
                  <p className="text-2xl font-black text-varanasi-maroon">
                    ₹{((stats.totalBookings || 0) * 2500).toLocaleString()}
                  </p>
                  <p className="text-xs font-semibold text-varanasi-brown">
                    Total Revenue
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-purple-100/50 to-purple-50/50 border-2 border-purple-200 rounded-xl p-4 hover:shadow-lg transition-all duration-300">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-purple-700 rounded-lg flex items-center justify-center">
                  <TrendingUp size={24} className="text-white" />
                </div>
                <div>
                  <p className="text-2xl font-black text-varanasi-maroon">
                    +{Math.round((stats.totalBookings || 0) * 0.12)}
                  </p>
                  <p className="text-xs font-semibold text-varanasi-brown">
                    This Month
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Quick Actions */}
        <div className="mt-6 bg-white/80 backdrop-blur-sm rounded-3xl shadow-2xl p-6 border-2 border-varanasi-gold/30 relative overflow-hidden group">
          <div className="absolute bottom-0 right-0 opacity-5 group-hover:opacity-10 transition-opacity duration-300">
            <Zap size={150} className="text-varanasi-gold" />
          </div>

          <div className="relative z-10">
            <h2 className="text-2xl font-black text-varanasi-maroon mb-6 flex items-center gap-2">
              <Zap className="text-varanasi-gold" size={24} />
              Quick Actions
            </h2>

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
              {[
                {
                  label: "Users",
                  icon: Users,
                  color: "from-blue-500 to-blue-700",
                  href: "/admin/dashboard/users",
                },
                {
                  label: "Bookings",
                  icon: BookOpen,
                  color: "from-green-500 to-green-700",
                  href: "/admin/dashboard/bookings",
                },
                {
                  label: "Gallery",
                  icon: ImageIcon,
                  color: "from-purple-500 to-purple-700",
                  href: "/admin/dashboard/gallery",
                },
                {
                  label: "Rooms",
                  icon: Hotel,
                  color: "from-orange-500 to-orange-700",
                  href: "/admin/dashboard/rooms",
                },
                {
                  label: "FAQs",
                  icon: HelpCircle,
                  color: "from-pink-500 to-pink-700",
                  href: "/admin/dashboard/faq",
                },
                {
                  label: "Contacts",
                  icon: MessageSquare,
                  color: "from-teal-500 to-teal-700",
                  href: "/admin/dashboard/contacts",
                },
              ].map((action, index) => {
                const Icon = action.icon;
                return (
                  <a
                    key={index}
                    href={action.href}
                    className="group/btn bg-gradient-to-br from-varanasi-cream to-white hover:from-varanasi-gold/20 hover:to-varanasi-gold/10 rounded-xl p-5 border-2 border-varanasi-gold/20 hover:border-varanasi-gold transform hover:scale-105 hover:shadow-xl transition-all duration-300"
                  >
                    <div
                      className={`w-12 h-12 bg-gradient-to-br ${action.color} rounded-xl flex items-center justify-center shadow-lg mx-auto mb-3 group-hover/btn:rotate-12 group-hover/btn:scale-110 transition-all duration-300`}
                    >
                      <Icon size={24} className="text-white" />
                    </div>
                    <p className="text-sm font-black text-varanasi-maroon text-center">
                      {action.label}
                    </p>
                  </a>
                );
              })}
            </div>
          </div>
        </div>

        {/* Performance Indicators */}
        {!loading && (
          <div className="mt-6 bg-gradient-to-br from-varanasi-maroon/5 to-varanasi-gold/5 rounded-3xl p-6 border-2 border-varanasi-gold/30">
            <h3 className="text-xl font-black text-varanasi-maroon mb-4 flex items-center gap-2">
              <Activity className="text-varanasi-gold" size={20} />
              Performance Indicators
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="text-center p-4 bg-white rounded-xl border border-varanasi-gold/20">
                <p className="text-3xl font-black text-green-600 mb-1">
                  {Math.round((stats.totalBookings / Math.max(stats.totalRooms, 1)) * 100)}%
                </p>
                <p className="text-xs font-semibold text-gray-600">Occupancy Rate</p>
              </div>
              <div className="text-center p-4 bg-white rounded-xl border border-varanasi-gold/20">
                <p className="text-3xl font-black text-blue-600 mb-1">
                  {Math.round((stats.totalUsers / 10) * 100) / 100}
                </p>
                <p className="text-xs font-semibold text-gray-600">Avg. Daily Users</p>
              </div>
              <div className="text-center p-4 bg-white rounded-xl border border-varanasi-gold/20">
                <p className="text-3xl font-black text-purple-600 mb-1">
                  {Math.round((stats.totalContacts / Math.max(stats.totalUsers, 1)) * 100)}%
                </p>
                <p className="text-xs font-semibold text-gray-600">Response Rate</p>
              </div>
              <div className="text-center p-4 bg-white rounded-xl border border-varanasi-gold/20">
                <p className="text-3xl font-black text-orange-600 mb-1">
                  4.8★
                </p>
                <p className="text-xs font-semibold text-gray-600">Avg. Rating</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}