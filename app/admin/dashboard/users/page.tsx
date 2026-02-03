"use client";

import { useState, useEffect, useRef } from "react";
import {
  Users,
  Sparkles,
  Star,
  Zap,
  Mail,
  Phone,
  Building2,
  Trash2,
  Eye,
  Calendar,
  AlertTriangle,
  CheckCircle,
  Clock,
  Shield,
  UserCheck,
  UserX,
  Award,
  TrendingUp,
  Search,
  Filter,
  Edit,
  Lock,
  Unlock,
} from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface User {
  _id?: string;
  id?: string;
  name: string;
  email: string;
  phone: string;
  role: "user" | "admin";
  isVerified: boolean;
  status: "Active" | "Inactive" | "VIP" | "Blacklisted";
  loyaltyPoints: number;
  totalBookings: number;
  totalSpent: number;
  profileImage?: string;
  address?: {
    city?: string;
    state?: string;
    country?: string;
  };
  lastVisit?: string;
  createdAt?: string;
  updatedAt?: string;
}

export default function AdminUsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterRole, setFilterRole] = useState("all");
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState<string | null>(null);
  const loadToastShownRef = useRef(false);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async (opts: { forceToast?: boolean } = {}) => {
    setLoading(true);
    try {
      const response = await fetch("/api/admin/users", {
        method: "GET",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        cache: "no-store",
        credentials: "include",
      });

      if (!response.ok) {
        if (response.status === 401) {
          window.location.href = "/admin/login";
          return;
        }
        throw new Error("Failed to fetch users");
      }

      const data: User[] = await response.json();
      setUsers(data);

      if (!loadToastShownRef.current || opts.forceToast) {
        loadToastShownRef.current = true;
      }
    } catch (error) {
      console.error("Error fetching users:", error);
    } finally {
      setLoading(false);
    }
  };

  const filteredUsers = users.filter((user: User) => {
    const q = (searchQuery || "").toString().toLowerCase().trim();
    const matchesName = user.name?.toLowerCase()?.includes(q) ?? false;
    const matchesEmail = user.email?.toLowerCase()?.includes(q) ?? false;
    const matchesPhone = user.phone?.toString()?.includes(q) ?? false;
    const matchesSearch = matchesName || matchesEmail || matchesPhone;

    const matchesStatus = filterStatus === "all" || user.status === filterStatus;
    const matchesRole = filterRole === "all" || user.role === filterRole;

    return matchesSearch && matchesStatus && matchesRole;
  });

  const handleDeleteClick = (id: string) => {
    if (!id || id.startsWith('user-')) {
      console.error('Cannot delete user with invalid ID:', id);
      // You might want to show a toast notification here instead of alert
      console.warn('Cannot delete user: Invalid user ID');
      return;
    }
    setUserToDelete(id);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!userToDelete) return;

    try {
      const response = await fetch(`/api/admin/users/${userToDelete}`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `Failed to delete user: ${response.status} ${response.statusText}`);
      }

      const result = await response.json();
      console.log(result.message); // Success message

      setUsers((prev) =>
        prev.filter((u) => (u.id ?? u._id) !== userToDelete)
      );
    } catch (error: any) {
      console.error("Error deleting user:", error);
      // You might want to show a toast notification here
      const errorMessage = error.message || 'Unknown error occurred';
      console.error(`Failed to delete user: ${errorMessage}`);
    } finally {
      setDeleteDialogOpen(false);
      setUserToDelete(null);
    }
  };

  const updateUserStatus = async (id: string, newStatus: "Active" | "Inactive" | "VIP" | "Blacklisted") => {
    try {
      const response = await fetch(`/api/admin/users/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({ status: newStatus }),
      });

      if (response.status === 401) {
        window.location.href = "/admin/login";
        return;
      }

      if (!response.ok) throw new Error("Failed to update");

      const updatedUser = await response.json();

      setUsers((prev) =>
        prev.map((u) => ((u.id ?? u._id) === id ? updatedUser : u))
      );
    } catch (error) {
      console.error("Error updating user:", error);
    }
  };

  const toggleUserRole = async (id: string, currentRole: string) => {
    const newRole = currentRole === "admin" ? "user" : "admin";
    
    try {
      const response = await fetch(`/api/admin/users/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({ role: newRole }),
      });

      if (!response.ok) throw new Error("Failed to update role");

      const updatedUser = await response.json();
      setUsers((prev) =>
        prev.map((u) => ((u.id ?? u._id) === id ? updatedUser : u))
      );
    } catch (error) {
      console.error("Error updating role:", error);
    }
  };

  const getTierBadge = (totalSpent: number) => {
    if (totalSpent >= 100000) return { name: "Platinum", color: "bg-purple-100 text-purple-700" };
    if (totalSpent >= 50000) return { name: "Gold", color: "bg-yellow-100 text-yellow-700" };
    if (totalSpent >= 20000) return { name: "Silver", color: "bg-gray-100 text-gray-700" };
    return { name: "Bronze", color: "bg-orange-100 text-orange-700" };
  };

  const stats = {
    total: users.length,
    active: users.filter(u => u.status === "Active").length,
    vip: users.filter(u => u.status === "VIP").length,
    verified: users.filter(u => u.isVerified).length,
  };

  return (
    <div className="min-h-screen bg-varanasi-cream">
      {/* Fixed Header */}
      <header className="fixed top-0 left-0 lg:left-72 right-0 z-50 bg-white/95 backdrop-blur-xl shadow-xl border-b-4 border-varanasi-gold">
        <div className="px-4 sm:px-6 lg:px-8 py-5">
          <div className="flex items-center justify-between">
            <div className="ml-12 lg:ml-0">
              <h1 className="text-3xl sm:text-4xl font-black text-varanasi-maroon flex items-center">
                User Management
                <Users className="ml-2 text-orange-600" size={28} />
              </h1>
              <p className="text-sm text-varanasi-brown mt-1 font-semibold">
                Manage all registered users 👥
              </p>
            </div>
          </div>
        </div>
      </header>

      {/* Stats Cards */}
      <div className="mt-28 p-4 sm:p-6 lg:p-8">
        {/* Main Content */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl p-4 sm:p-6 border-2 border-varanasi-gold relative overflow-hidden group">
          <div className="absolute top-0 left-0 opacity-5 group-hover:opacity-10 transition-opacity duration-300">
            <Sparkles size={200} className="text-varanasi-gold" />
          </div>

          <div className="relative z-10">
            {/* Header with Actions */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 gap-4">
              <h2 className="text-xl sm:text-2xl font-black text-varanasi-maroon flex items-center">
                <Users className="mr-2 text-orange-600" size={24} />
                All Users
                <Sparkles className="ml-2 text-varanasi-gold" size={20} />
              </h2>

              <button
                onClick={() => fetchUsers({ forceToast: true })}
                className="bg-varanasi-maroon text-varanasi-gold font-bold px-4 sm:px-6 py-2 sm:py-3 rounded-xl shadow-lg hover:scale-105 transition-all duration-300 flex items-center justify-center space-x-2 text-sm sm:text-base border border-varanasi-gold"
              >
                <Zap size={16} className="sm:w-[18px] sm:h-[18px]" />
                <span>Refresh</span>
              </button>
            </div>

            {/* Search and Filters */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-varanasi-gold" size={18} />
                <input
                  type="text"
                  placeholder="Search by name, email, or phone..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 rounded-xl border-2 border-varanasi-gold focus:border-varanasi-maroon focus:outline-none font-semibold text-sm bg-varanasi-cream text-varanasi-maroon"
                />
              </div>

              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border-2 border-varanasi-gold focus:border-varanasi-maroon focus:outline-none font-semibold text-sm bg-varanasi-cream text-varanasi-maroon"
              >
                <option value="all">All Status</option>
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
                <option value="VIP">VIP</option>
                <option value="Blacklisted">Blacklisted</option>
              </select>

              <select
                value={filterRole}
                onChange={(e) => setFilterRole(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border-2 border-varanasi-gold focus:border-varanasi-maroon focus:outline-none font-semibold text-sm bg-varanasi-cream text-varanasi-maroon"
              >
                <option value="all">All Roles</option>
                <option value="user">Users</option>
                <option value="admin">Admins</option>
              </select>
            </div>

            {loading && (
              <div className="text-center py-12">
                <div className="inline-block animate-spin rounded-full h-12 w-12 sm:h-16 sm:w-16 border-4 border-varanasi-gold border-t-transparent"></div>
                <p className="mt-4 text-gray-600 font-bold text-sm sm:text-base">
                  Loading users...
                </p>
              </div>
            )}

            {!loading && filteredUsers.length === 0 && (
              <div className="text-center py-12">
                <div className="w-20 h-20 sm:w-24 sm:h-24 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full flex items-center justify-center text-3xl sm:text-4xl mx-auto mb-4">
                  👤
                </div>
                <p className="text-lg sm:text-xl font-black text-gray-900 mb-2">
                  No Users Found
                </p>
                <p className="text-sm sm:text-base text-gray-600 font-semibold px-4">
                  {searchQuery
                    ? "Try adjusting your search criteria"
                    : "No users registered yet"}
                </p>
              </div>
            )}

            {/* MOBILE VIEW (Cards) */}
            {!loading && filteredUsers.length > 0 && (
              <>
                <div className="block md:hidden space-y-4">
                  {filteredUsers.map((user: User, index: number) => {
                    const uid = user._id || user.id;
                    if (!uid) {
                      console.error('User missing valid ID:', user);
                      return null;
                    }
                    const tier = getTierBadge(user.totalSpent);
                    
                    return (
                      <div
                        key={uid}
                        className="bg-varanasi-cream rounded-xl border-2 border-varanasi-gold overflow-hidden shadow-md hover:shadow-xl transition-all duration-300"
                      >
                        {/* Mobile Card Header */}
                        <div className="bg-varanasi-maroon p-4">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-3">
                              <div className="w-12 h-12 bg-varanasi-gold text-varanasi-maroon rounded-lg flex items-center justify-center font-black shadow-lg text-lg">
                                {user.name?.charAt(0).toUpperCase() || "?"}
                              </div>
                              <div>
                                <h3 className="font-black text-base text-varanasi-maroon flex items-center gap-2">
                                  {user.name}
                                  {user.role === "admin" && (
                                    <Shield className="text-yellow-300" size={14} />
                                  )}
                                </h3>
                                <p className="text-xs text-varanasi-brown">{user.email}</p>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Mobile Card Content */}
                        <div className="p-4 space-y-3">
                          {/* Status and Tier Badges */}
                          <div className="flex flex-wrap gap-2">
                            <span
                              className={`text-xs font-bold px-3 py-1 rounded-full ${
                                user.status === "Active"
                                  ? "bg-green-100 text-green-700"
                                  : user.status === "VIP"
                                  ? "bg-purple-100 text-purple-700"
                                  : user.status === "Blacklisted"
                                  ? "bg-red-100 text-red-700"
                                  : "bg-gray-100 text-gray-700"
                              }`}
                            >
                              {user.status}
                            </span>
                            <span className={`text-xs font-bold px-3 py-1 rounded-full ${tier.color}`}>
                              {tier.name}
                            </span>
                            {user.isVerified && (
                              <span className="text-xs font-bold px-3 py-1 rounded-full bg-blue-100 text-blue-700 flex items-center gap-1">
                                <CheckCircle size={12} /> Verified
                              </span>
                            )}
                          </div>
                          {/* Contact Details */}
                          <div className="space-y-2">
                            <div className="flex items-center space-x-2 text-sm">
                              <Phone size={14} className="text-varanasi-gold flex-shrink-0" />
                              <span className="font-semibold text-varanasi-brown">{user.phone}</span>
                            </div>
                            {user.address?.city && (
                              <div className="flex items-center space-x-2 text-sm">
                                <Building2 size={14} className="text-varanasi-gold flex-shrink-0" />
                                <span className="font-semibold text-varanasi-brown">
                                  {user.address.city}, {user.address.state}
                                </span>
                              </div>
                            )}
                          </div>

                          {/* Actions */}
                          <div className="flex gap-2 pt-2 border-t border-varanasi-gold">
                            <button
                              onClick={() => toggleUserRole(uid, user.role)}
                              className="flex-1 flex items-center justify-center space-x-1 bg-blue-600 hover:bg-blue-700 text-white font-bold px-3 py-2 rounded-lg shadow-md transition-all duration-300"
                              title={user.role === "admin" ? "Demote to User" : "Promote to Admin"}
                            >
                              {user.role === "admin" ? <UserX size={14} /> : <Shield size={14} />}
                              <span className="text-xs">{user.role === "admin" ? "Demote" : "Promote"}</span>
                            </button>
                            <button
                              onClick={() => {
                                const newStatus = user.status === "Blacklisted" ? "Active" : "Blacklisted";
                                updateUserStatus(uid, newStatus);
                              }}
                              className={`flex-1 flex items-center justify-center space-x-1 ${
                                user.status === "Blacklisted"
                                  ? "bg-green-600 hover:bg-green-700"
                                  : "bg-red-600 hover:bg-red-700"
                              } text-white font-bold px-3 py-2 rounded-lg shadow-md transition-all duration-300`}
                            >
                              {user.status === "Blacklisted" ? <Unlock size={14} /> : <Lock size={14} />}
                              <span className="text-xs">{user.status === "Blacklisted" ? "Unlock" : "Block"}</span>
                            </button>
                            <button
                              onClick={() => handleDeleteClick(uid)}
                              className="flex items-center justify-center bg-red-600 hover:bg-red-700 text-white font-bold px-3 py-2 rounded-lg shadow-md transition-all duration-300"
                            >
                              <Trash2 size={14} />
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* TABLET VIEW */}
                <div className="hidden md:block lg:hidden">
                  <div className="grid grid-cols-1 gap-4">
                    {filteredUsers.map((user: User, index: number) => {
                      const uid = user._id || user.id;
                      if (!uid) {
                        console.error('User missing valid ID:', user);
                        return null;
                      }
                      const tier = getTierBadge(user.totalSpent);
                      
                      return (
                        <div
                          key={uid}
                          className="bg-varanasi-cream rounded-xl border-2 border-varanasi-gold p-4 hover:shadow-xl transition-all duration-300"
                        >
                          <div className="flex gap-4">
                            <div className="flex-shrink-0">
                              <div className="w-16 h-16 bg-varanasi-gold text-varanasi-maroon rounded-xl flex items-center justify-center font-black shadow-lg text-2xl">
                                {user.name?.charAt(0).toUpperCase() || "?"}
                              </div>
                            </div>

                            <div className="flex-1 space-y-3">
                              <div className="flex items-start justify-between">
                                <div>
                                  <h3 className="font-black text-lg text-varanasi-maroon flex items-center gap-2">
                                    {user.name}
                                    {user.role === "admin" && (
                                      <Shield className="text-orange-600" size={16} />
                                    )}
                                  </h3>
                                  <p className="text-sm text-varanasi-brown">{user.email}</p>
                                </div>
                              </div>

                              <div className="flex flex-wrap gap-2">
                                <span className={`text-xs font-bold px-2 py-1 rounded-full ${
                                  user.status === "Active" ? "bg-green-100 text-green-700" :
                                  user.status === "VIP" ? "bg-purple-100 text-purple-700" :
                                  user.status === "Blacklisted" ? "bg-red-100 text-red-700" :
                                  "bg-gray-100 text-gray-700"
                                }`}>
                                  {user.status}
                                </span>
                                <span className={`text-xs font-bold px-2 py-1 rounded-full ${tier.color}`}>
                                  {tier.name}
                                </span>
                                {user.isVerified && (
                                  <span className="text-xs font-bold px-2 py-1 rounded-full bg-blue-100 text-blue-700 flex items-center gap-1">
                                    <CheckCircle size={10} /> Verified
                                  </span>
                                )}
                              </div>
                              <div className="flex gap-2">
                                <button
                                  onClick={() => toggleUserRole(uid, user.role)}
                                  className="flex-1 p-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg shadow-md transition-all duration-300 flex items-center justify-center gap-2 text-sm font-bold"
                                >
                                  {user.role === "admin" ? <UserX size={14} /> : <Shield size={14} />}
                                  <span>{user.role === "admin" ? "Demote" : "Promote"}</span>
                                </button>
                                <button
                                  onClick={() => {
                                    const newStatus = user.status === "Blacklisted" ? "Active" : "Blacklisted";
                                    updateUserStatus(uid, newStatus);
                                  }}
                                  className={`flex-1 p-2 ${
                                    user.status === "Blacklisted" ? "bg-green-600 hover:bg-green-700" : "bg-red-600 hover:bg-red-700"
                                  } text-white rounded-lg shadow-md transition-all duration-300 flex items-center justify-center gap-2 text-sm font-bold`}
                                >
                                  {user.status === "Blacklisted" ? <Unlock size={14} /> : <Lock size={14} />}
                                  <span>{user.status === "Blacklisted" ? "Unlock" : "Block"}</span>
                                </button>
                                <button
                                  onClick={() => handleDeleteClick(uid)}
                                  className="p-2 bg-red-600 hover:bg-red-700 text-white rounded-lg shadow-md transition-all duration-300"
                                >
                                  <Trash2 size={16} />
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* DESKTOP TABLE VIEW */}
                <div className="hidden lg:block overflow-x-auto">
                  <table className="w-full border-collapse">
                    <thead>
                      <tr className="bg-gradient-to-r from-orange-100 to-amber-100 border-b-4 border-orange-600">
                        <th className="px-4 py-3 text-left font-black text-gray-900 text-sm">User</th>
                        <th className="px-4 py-3 text-left font-black text-gray-900 text-sm">Email</th>
                        <th className="px-4 py-3 text-left font-black text-gray-900 text-sm"></th>
                        <th className="px-4 py-3 text-left font-black text-gray-900 text-sm">Role</th>
                        <th className="px-4 py-3 text-left font-black text-gray-900 text-sm">Status</th>
                        <th className="px-4 py-3 text-left font-black text-gray-900 text-sm">Tier</th>
                        <th className="px-4 py-3 text-center font-black text-gray-900 text-sm">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredUsers.map((user: User, index: number) => {
                        const uid = user._id || user.id;
                        if (!uid) {
                          console.error('User missing valid ID:', user);
                          return null;
                        }
                        const tier = getTierBadge(user.totalSpent);
                        
                        return (
                          <tr
                            key={uid}
                            className="border-b border-amber-200 hover:bg-gradient-to-r hover:from-amber-50 hover:to-orange-50 transition-all duration-300 group/row"
                          >
                            <td className="px-4 py-3">
                              <div className="flex items-center space-x-3">
                                <div className="w-10 h-10 bg-varanasi-gold text-varanasi-maroon rounded-lg flex items-center justify-center font-black shadow-md group-hover/row:scale-110 transition-transform duration-300">
                                    {user.name?.charAt(0).toUpperCase() || "?"}
                                  </div>
                                  <div>
                                    <span className="font-black text-sm text-varanasi-maroon flex items-center gap-1">
                                      {user.name}
                                      {user.role === "admin" && <Shield className="text-varanasi-gold" size={12} />}
                                    </span>
                                    {user.isVerified && (
                                      <span className="text-xs text-green-600 flex items-center gap-1">
                                        <CheckCircle size={10} /> Verified
                                      </span>
                                    )}
                                  </div>
                              </div>
                            </td>

                            <td className="px-4 py-3">
                              <span className="text-sm text-varanasi-brown font-semibold">{user.email}</span>
                            </td>

                            <td className="px-4 py-3">
                              <span className="text-sm text-varanasi-brown font-semibold whitespace-nowrap">{user.phone}</span>
                            </td>

                            <td className="px-4 py-3">
                              <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold ${
                                user.role === "admin" ? "bg-varanasi-gold text-varanasi-maroon" : "bg-blue-100 text-blue-700"
                              }`}>
                                {user.role.toUpperCase()}
                              </span>
                            </td>

                            <td className="px-4 py-3">
                              <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold whitespace-nowrap ${
                                user.status === "Active" ? "bg-green-100 text-green-700" :
                                user.status === "VIP" ? "bg-purple-100 text-purple-700" :
                                user.status === "Blacklisted" ? "bg-red-100 text-red-700" :
                                "bg-gray-100 text-gray-700"
                              }`}>
                                <div className={`w-2 h-2 rounded-full mr-2 ${
                                  user.status === "Active" ? "bg-green-500" :
                                  user.status === "VIP" ? "bg-purple-500" :
                                  user.status === "Blacklisted" ? "bg-red-500" :
                                  "bg-gray-500"
                                }`}></div>
                                {user.status.toUpperCase()}
                              </span>
                            </td>

                            <td className="px-4 py-3">
                              <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold ${tier.color}`}>
                                <Award size={12} className="mr-1 text-varanasi-gold" />
                                {tier.name}
                              </span>
                            </td>

                            <td className="px-4 py-3">
                              <div className="flex items-center justify-center gap-2">
                                <button
                                  onClick={() => toggleUserRole(uid, user.role)}
                                  className="p-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg shadow-md transform hover:scale-110 transition-all duration-300"
                                  title={user.role === "admin" ? "Demote to User" : "Promote to Admin"}
                                >
                                  {user.role === "admin" ? <UserX size={14} /> : <Shield size={14} />}
                                </button>
                                <button
                                  onClick={() => {
                                    const newStatus = user.status === "Blacklisted" ? "Active" : "Blacklisted";
                                    updateUserStatus(uid, newStatus);
                                  }}
                                  className={`p-2 ${
                                    user.status === "Blacklisted" ? "bg-green-600 hover:bg-green-700" : "bg-red-600 hover:bg-red-700"
                                  } text-white rounded-lg shadow-md transform hover:scale-110 transition-all duration-300`}
                                  title={user.status === "Blacklisted" ? "Unblock User" : "Block User"}
                                >
                                  {user.status === "Blacklisted" ? <Unlock size={14} /> : <Lock size={14} />}
                                </button>
                                <button
                                  onClick={() => handleDeleteClick(uid)}
                                  className="p-2 bg-red-600 hover:bg-red-700 text-white rounded-lg shadow-md transform hover:scale-110 transition-all duration-300"
                                  title="Delete User"
                                >
                                  <Trash2 size={14} />
                                </button>
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent className="bg-white border-2 border-varanasi-gold">
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center text-xl font-black text-gray-900">
              <AlertTriangle className="mr-2 text-red-600" size={24} />
              Delete User?
            </AlertDialogTitle>
            <AlertDialogDescription className="text-gray-600 text-base">
              Are you sure you want to delete this user? This will permanently remove all their data including bookings and reviews. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="bg-gray-100 hover:bg-gray-200 text-gray-900 font-bold px-6 py-2 rounded-lg">
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteConfirm}
              className="bg-red-600 hover:bg-red-700 text-white font-bold px-6 py-2 rounded-lg"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}