"use client";

import React, { useState, useEffect, useRef } from "react";
import {
  Calendar,
  Sparkles,
  Star,
  Zap,
  Mail,
  Phone,
  Building2,
  Trash2,
  Clock,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Briefcase,
  Filter,
} from "lucide-react";
import { toast } from "sonner";
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

interface Consultation {
  _id?: string;
  id?: string;
  name: string;
  email: string;
  phone: string;
  company?: string;
  preferredDate: string;
  preferredTime: string;
  projectType: string;
  message: string;
  status: "pending" | "scheduled" | "completed" | "cancelled";
  priority: "low" | "medium" | "high" | "urgent";
  adminNotes?: string;
  scheduledDate?: string;
  meetingLink?: string;
  createdAt?: string;
  updatedAt?: string;
}

export default function AdminConsultationsPage() {
  const [consultations, setConsultations] = useState<Consultation[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterPriority, setFilterPriority] = useState("all");
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [consultationToDelete, setConsultationToDelete] = useState<string | null>(null);
  const loadToastShownRef = useRef(false);

  useEffect(() => {
    fetchConsultations();
  }, []);

  const fetchConsultations = async (opts: { forceToast?: boolean } = {}) => {
    setLoading(true);
    try {
      const response = await fetch("/api/admin/consultations", {
        credentials: "include",
        headers: { Accept: "application/json" },
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || "Failed to fetch consultations");
      }

      const data: Consultation[] = await response.json();
      setConsultations(data);

      if (!loadToastShownRef.current || opts.forceToast) {
        toast.success("Consultations loaded successfully! 📅");
        loadToastShownRef.current = true;
      }
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Please check your database connection.";
      toast.error("Failed to load consultations", { description: message });
    } finally {
      setLoading(false);
    }
  };

  const filteredConsultations = consultations.filter((consultation) => {
    const q = searchQuery.toLowerCase().trim();

    const matchesSearch =
      consultation.name?.toLowerCase().includes(q) ||
      consultation.email?.toLowerCase().includes(q) ||
      consultation.company?.toLowerCase().includes(q) ||
      consultation.phone?.includes(q) ||
      consultation.projectType?.toLowerCase().includes(q);

    const matchesStatus =
      filterStatus === "all" || consultation.status === filterStatus;
    const matchesPriority =
      filterPriority === "all" || consultation.priority === filterPriority;

    return matchesSearch && matchesStatus && matchesPriority;
  });

  const handleDeleteClick = (id: string) => {
    setConsultationToDelete(id);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!consultationToDelete) return;

    try {
      const response = await fetch(
        `/api/admin/consultations/${consultationToDelete}`,
        { method: "DELETE" }
      );

      if (response.status === 401) {
        window.location.href = "/admin/login";
        return;
      }

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || "Failed to delete consultation");
      }

      setConsultations((prev) =>
        prev.filter((c) => (c.id ?? c._id) !== consultationToDelete)
      );

      toast.success("Consultation deleted successfully! 🗑️", {
        description: "The consultation has been removed from your database.",
      });
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Please try again later.";
      toast.error("Failed to delete consultation", { description: message });
    } finally {
      setDeleteDialogOpen(false);
      setConsultationToDelete(null);
    }
  };

  const updateStatus = async (
    id: string,
    newStatus: "pending" | "scheduled" | "completed" | "cancelled"
  ) => {
    try {
      const response = await fetch(`/api/admin/consultations/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || "Failed to update status");
      }

      setConsultations((prev) =>
        prev.map((c) => ((c.id ?? c._id) === id ? { ...c, status: newStatus } : c))
      );

      const statusMessages = {
        scheduled: {
          title: "Marked as scheduled!",
          description: "Consultation has been scheduled.",
        },
        completed: {
          title: "Marked as completed!",
          description: "Consultation has been completed.",
        },
        cancelled: {
          title: "Marked as cancelled!",
          description: "Consultation has been cancelled.",
        },
        pending: {
          title: "Marked as pending!",
          description: "Consultation is pending.",
        },
      };

      const msg = statusMessages[newStatus];
      toast.success(msg.title, { description: msg.description });
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Please try again later.";
      toast.error("Failed to update status", { description: message });
    }
  };

  const getStatusConfig = (status: string) => {
    const configs = {
      pending: {
        icon: AlertCircle,
        color: "bg-yellow-100 text-yellow-700",
        text: "PENDING",
      },
      scheduled: {
        icon: Calendar,
        color: "bg-blue-100 text-blue-700",
        text: "SCHEDULED",
      },
      completed: {
        icon: CheckCircle2,
        color: "bg-green-100 text-green-700",
        text: "COMPLETED",
      },
      cancelled: {
        icon: XCircle,
        color: "bg-red-100 text-red-700",
        text: "CANCELLED",
      },
    };
    return configs[status as keyof typeof configs] || configs.pending;
  };

  const getPriorityBadge = (priority: string) => {
    const configs = {
      low: "bg-gray-100 text-gray-700",
      medium: "bg-blue-100 text-blue-700",
      high: "bg-orange-100 text-orange-700",
      urgent: "bg-red-100 text-red-700",
    };
    return configs[priority as keyof typeof configs] || configs.medium;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-amber-100">
      {/* Fixed Header */}
      <header className="fixed top-0 left-0 lg:left-72 right-0 z-50 bg-white/95 backdrop-blur-xl shadow-xl border-b-4 border-orange-600">
        <div className="px-4 sm:px-6 lg:px-8 py-5">
          <div className="flex items-center justify-between">
            <div className="ml-12 lg:ml-0">
              <h1 className="text-3xl sm:text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-orange-600 to-orange-800 flex items-center">
                Consultations
                <Calendar className="ml-2 text-orange-600" size={28} />
              </h1>
              <p className="text-sm text-gray-600 mt-1 font-semibold">
                Manage consultation requests 📅
              </p>
            </div>
          </div>
        </div>
      </header>

      {/* Page Content */}
      <div className="pt-28 p-4 sm:p-6 lg:p-8 relative z-10">
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl p-4 sm:p-6 border-2 border-amber-200 relative overflow-hidden group sm:mt-28">
          <div className="absolute top-0 left-0 opacity-5 group-hover:opacity-10 transition-opacity duration-300">
            <Sparkles size={200} className="text-orange-600" />
          </div>

          <div className="relative z-10">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 gap-4">
              <h2 className="text-xl sm:text-2xl font-black text-orange-900 flex items-center">
                <Calendar className="mr-2 text-orange-600" size={24} />
                Consultation Requests
                <Sparkles className="ml-2 text-amber-500" size={20} />
              </h2>

              <button
                onClick={() => fetchConsultations({ forceToast: true })}
                className="w-full sm:w-auto bg-gradient-to-r from-orange-600 to-orange-700 text-white font-bold px-4 sm:px-6 py-2 sm:py-3 rounded-xl shadow-lg hover:scale-105 transition-all duration-300 flex items-center justify-center space-x-2 text-sm sm:text-base"
              >
                <Zap size={16} className="sm:w-[18px] sm:h-[18px]" />
                <span>Refresh</span>
              </button>
            </div>

            {loading && (
              <div className="text-center py-12">
                <div className="inline-block animate-spin rounded-full h-12 w-12 sm:h-16 sm:w-16 border-4 border-orange-600 border-t-transparent"></div>
                <p className="mt-4 text-gray-600 font-bold text-sm sm:text-base">
                  Loading consultations...
                </p>
              </div>
            )}

            {!loading && filteredConsultations.length === 0 && (
              <div className="text-center py-12">
                <div className="w-20 h-20 sm:w-24 sm:h-24 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full flex items-center justify-center text-3xl sm:text-4xl mx-auto mb-4">
                  📅
                </div>
                <p className="text-lg sm:text-xl font-black text-gray-900 mb-2">
                  No Consultations Found
                </p>
                <p className="text-sm sm:text-base text-gray-600 font-semibold px-4">
                  {searchQuery
                    ? "Try adjusting your search criteria"
                    : "No consultation requests yet"}
                </p>
              </div>
            )}

            {/* RESPONSIVE TABLE VIEW */}
            {!loading && filteredConsultations.length > 0 && (
              <>
                {/* MOBILE VIEW (Cards) - Hidden on md and up */}
                <div className="block md:hidden space-y-4">
                  {filteredConsultations.map((consultation, index) => {
                    const cid = consultation.id ?? consultation._id ?? `consultation-${index}`;
                    const statusConfig = getStatusConfig(consultation.status);
                    const StatusIcon = statusConfig.icon;

                    return (
                      <div
                        key={cid}
                        className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-xl border-2 border-amber-200 overflow-hidden shadow-md hover:shadow-xl transition-all duration-300"
                      >
                        <div className="p-4 space-y-3">
                          {/* Header */}
                          <div className="flex items-start justify-between">
                            <div className="flex items-center space-x-3">
                              <div className="w-10 h-10 bg-gradient-to-br from-orange-600 to-orange-800 text-white rounded-lg flex items-center justify-center font-black shadow-md">
                                {consultation.name?.charAt(0).toUpperCase() || "?"}
                              </div>
                              <div>
                                <h3 className="font-black text-base text-gray-900">
                                  {consultation.name}
                                </h3>
                                <div className="flex items-center gap-2 mt-1 flex-wrap">
                                  <span
                                    className={`text-xs font-bold px-2 py-1 rounded-full flex items-center ${statusConfig.color}`}
                                  >
                                    <StatusIcon size={10} className="mr-1" />
                                    {statusConfig.text}
                                  </span>
                                  <span
                                    className={`text-xs font-bold px-2 py-1 rounded-full ${getPriorityBadge(
                                      consultation.priority
                                    )}`}
                                  >
                                    {consultation.priority.toUpperCase()}
                                  </span>
                                </div>
                              </div>
                            </div>
                          </div>

                          {/* Contact Info */}
                          <div className="space-y-2 text-sm">
                            <div className="flex items-center space-x-2">
                              <Mail size={14} className="text-orange-600 flex-shrink-0" />
                              <span className="font-semibold text-gray-700 break-all">
                                {consultation.email}
                              </span>
                            </div>
                            <div className="flex items-center space-x-2">
                              <Phone size={14} className="text-orange-600 flex-shrink-0" />
                              <span className="font-semibold text-gray-700">
                                {consultation.phone}
                              </span>
                            </div>
                            {consultation.company && (
                              <div className="flex items-center space-x-2">
                                <Building2 size={14} className="text-orange-600 flex-shrink-0" />
                                <span className="font-semibold text-gray-700">
                                  {consultation.company}
                                </span>
                              </div>
                            )}
                            <div className="flex items-center space-x-2">
                              <Briefcase size={14} className="text-orange-600 flex-shrink-0" />
                              <span className="font-semibold text-gray-700">
                                {consultation.projectType}
                              </span>
                            </div>
                          </div>

                          {/* Preferred Date/Time */}
                          <div className="flex items-center gap-4 text-sm">
                            <div className="flex items-center space-x-2">
                              <Calendar size={14} className="text-purple-600" />
                              <span className="font-semibold text-gray-700">
                                {new Date(consultation.preferredDate).toLocaleDateString()}
                              </span>
                            </div>
                            <div className="flex items-center space-x-2">
                              <Clock size={14} className="text-purple-600" />
                              <span className="font-semibold text-gray-700">
                                {consultation.preferredTime}
                              </span>
                            </div>
                          </div>

                          {/* Message */}
                          {consultation.message && (
                            <div className="bg-white/80 rounded-lg p-3 border border-amber-200">
                              <p className="text-sm text-gray-700 line-clamp-3">
                                {consultation.message}
                              </p>
                            </div>
                          )}

                          {/* Actions */}
                          <div className="flex gap-2 pt-2 border-t border-amber-200">
                            <select
                              value={consultation.status}
                              onChange={(e) =>
                                updateStatus(cid, e.target.value as any)
                              }
                              className="flex-1 px-3 py-2 border-2 border-orange-600 rounded-lg font-bold text-xs bg-white"
                            >
                              <option value="pending">Pending</option>
                              <option value="scheduled">Scheduled</option>
                              <option value="completed">Completed</option>
                              <option value="cancelled">Cancelled</option>
                            </select>
                            <button
                              onClick={() => handleDeleteClick(cid)}
                              className="p-2 bg-red-600 hover:bg-red-700 text-white rounded-lg shadow-md transition-all duration-300"
                            >
                              <Trash2 size={16} />
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* TABLET VIEW*/}
                <div className="hidden md:block lg:hidden">
                  <div className="space-y-4">
                    {filteredConsultations.map((consultation, index) => {
                      const cid = consultation.id ?? consultation._id ?? `consultation-${index}`;
                      const statusConfig = getStatusConfig(consultation.status);
                      const StatusIcon = statusConfig.icon;

                      return (
                        <div
                          key={cid}
                          className="bg-gradient-to-r from-amber-50 to-orange-50 rounded-xl border-2 border-amber-200 p-4 hover:shadow-xl transition-all duration-300"
                        >
                          <div className="flex items-start justify-between mb-3">
                            <div className="flex items-center space-x-3 flex-1">
                              <div className="w-12 h-12 bg-gradient-to-br from-orange-600 to-orange-800 text-white rounded-xl flex items-center justify-center font-black shadow-md">
                                {consultation.name?.charAt(0).toUpperCase() || "?"}
                              </div>
                              <div className="flex-1">
                                <h3 className="font-black text-lg text-gray-900">
                                  {consultation.name}
                                </h3>
                                <div className="flex items-center gap-2 mt-1 flex-wrap">
                                  <span
                                    className={`text-xs font-bold px-3 py-1 rounded-full flex items-center ${statusConfig.color}`}
                                  >
                                    <StatusIcon size={12} className="mr-1" />
                                    {statusConfig.text}
                                  </span>
                                  <span
                                    className={`text-xs font-bold px-3 py-1 rounded-full ${getPriorityBadge(
                                      consultation.priority
                                    )}`}
                                  >
                                    {consultation.priority.toUpperCase()}
                                  </span>
                                </div>
                              </div>
                            </div>
                          </div>

                          <div className="grid grid-cols-2 gap-3 mb-3 text-sm">
                            <div className="flex items-center space-x-2">
                              <Mail size={16} className="text-orange-600" />
                              <span className="font-semibold text-gray-700 break-all">
                                {consultation.email}
                              </span>
                            </div>
                            <div className="flex items-center space-x-2">
                              <Phone size={16} className="text-orange-600" />
                              <span className="font-semibold text-gray-700">
                                {consultation.phone}
                              </span>
                            </div>
                            {consultation.company && (
                              <div className="flex items-center space-x-2">
                                <Building2 size={16} className="text-orange-600" />
                                <span className="font-semibold text-gray-700">
                                  {consultation.company}
                                </span>
                              </div>
                            )}
                            <div className="flex items-center space-x-2">
                              <Briefcase size={16} className="text-orange-600" />
                              <span className="font-semibold text-gray-700">
                                {consultation.projectType}
                              </span>
                            </div>
                          </div>

                          {consultation.message && (
                            <div className="bg-white/80 rounded-lg p-3 border border-amber-200 mb-3">
                              <p className="text-sm text-gray-700 line-clamp-2">
                                {consultation.message}
                              </p>
                            </div>
                          )}

                          <div className="flex items-center justify-between pt-3 border-t border-amber-200">
                            <div className="flex items-center gap-3 text-sm">
                              <div className="flex items-center space-x-2">
                                <Calendar size={14} className="text-purple-600" />
                                <span className="font-semibold text-gray-700">
                                  {new Date(consultation.preferredDate).toLocaleDateString()}
                                </span>
                              </div>
                              <div className="flex items-center space-x-2">
                                <Clock size={14} className="text-purple-600" />
                                <span className="font-semibold text-gray-700">
                                  {consultation.preferredTime}
                                </span>
                              </div>
                            </div>
                            <div className="flex gap-2">
                              <select
                                value={consultation.status}
                                onChange={(e) =>
                                  updateStatus(cid, e.target.value as any)
                                }
                                className="px-3 py-2 border-2 border-orange-600 rounded-lg font-bold text-sm bg-white"
                              >
                                <option value="pending">Pending</option>
                                <option value="scheduled">Scheduled</option>
                                <option value="completed">Completed</option>
                                <option value="cancelled">Cancelled</option>
                              </select>
                              <button
                                onClick={() => handleDeleteClick(cid)}
                                className="p-2 bg-red-600 hover:bg-red-700 text-white rounded-lg shadow-md transition-all duration-300"
                              >
                                <Trash2 size={18} />
                              </button>
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
                        <th className="px-4 py-3 text-left font-black text-gray-900 text-sm">
                          Client
                        </th>
                        <th className="px-4 py-3 text-left font-black text-gray-900 text-sm">
                          Contact
                        </th>
                        <th className="px-4 py-3 text-left font-black text-gray-900 text-sm">
                          Project Type
                        </th>
                        <th className="px-4 py-3 text-left font-black text-gray-900 text-sm">
                          Preferred Date/Time
                        </th>
                        <th className="px-4 py-3 text-left font-black text-gray-900 text-sm">
                          Status
                        </th>
                        <th className="px-4 py-3 text-left font-black text-gray-900 text-sm">
                          Priority
                        </th>
                        <th className="px-4 py-3 text-center font-black text-gray-900 text-sm">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredConsultations.map((consultation, index) => {
                        const cid = consultation.id ?? consultation._id ?? `consultation-${index}`;
                        const statusConfig = getStatusConfig(consultation.status);
                        const StatusIcon = statusConfig.icon;

                        return (
                          <tr
                            key={cid}
                            className="border-b border-amber-200 hover:bg-gradient-to-r hover:from-amber-50 hover:to-orange-50 transition-all duration-300 group/row"
                          >
                            {/* Client */}
                            <td className="px-4 py-3">
                              <div className="flex items-center space-x-3">
                                <div className="w-10 h-10 bg-gradient-to-br from-orange-600 to-orange-800 text-white rounded-lg flex items-center justify-center font-black shadow-md group-hover/row:rotate-12 transition-transform duration-300">
                                  {consultation.name?.charAt(0).toUpperCase() || "?"}
                                </div>
                                <div>
                                  <h3 className="font-black text-sm text-gray-900">
                                    {consultation.name}
                                  </h3>
                                  {consultation.company && (
                                    <p className="text-xs text-gray-600 flex items-center">
                                      <Building2 size={10} className="mr-1" />
                                      {consultation.company}
                                    </p>
                                  )}
                                </div>
                              </div>
                            </td>

                            {/* Contact */}
                            <td className="px-4 py-3">
                              <div className="space-y-1">
                                <p className="text-xs text-gray-700 flex items-center">
                                  <Mail size={10} className="mr-1 text-orange-600" />
                                  {consultation.email}
                                </p>
                                <p className="text-xs text-gray-700 flex items-center">
                                  <Phone size={10} className="mr-1 text-orange-600" />
                                  {consultation.phone}
                                </p>
                              </div>
                            </td>

                            {/* Project Type */}
                            <td className="px-4 py-3">
                              <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-blue-100 text-blue-700">
                                <Briefcase size={10} className="mr-1" />
                                {consultation.projectType}
                              </span>
                            </td>

                            {/* Preferred Date/Time */}
                            <td className="px-4 py-3">
                              <div className="space-y-1">
                                <p className="text-xs text-gray-700 flex items-center">
                                  <Calendar size={10} className="mr-1 text-purple-600" />
                                  {new Date(consultation.preferredDate).toLocaleDateString()}
                                </p>
                                <p className="text-xs text-gray-700 flex items-center">
                                  <Clock size={10} className="mr-1 text-purple-600" />
                                  {consultation.preferredTime}
                                </p>
                              </div>
                            </td>

                            {/* Status */}
                            <td className="px-4 py-3">
                              <select
                                value={consultation.status}
                                onChange={(e) =>
                                  updateStatus(cid, e.target.value as any)
                                }
                                className={`px-3 py-1 rounded-full text-xs font-bold border-2 border-transparent focus:border-orange-600 focus:outline-none cursor-pointer ${statusConfig.color}`}
                              >
                                <option value="pending">Pending</option>
                                <option value="scheduled">Scheduled</option>
                                <option value="completed">Completed</option>
                                <option value="cancelled">Cancelled</option>
                              </select>
                            </td>

                            {/* Priority */}
                            <td className="px-4 py-3">
                              <span
                                className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold whitespace-nowrap ${getPriorityBadge(
                                  consultation.priority
                                )}`}
                              >
                                {consultation.priority.toUpperCase()}
                              </span>
                            </td>

                            {/* Actions */}
                            <td className="px-4 py-3">
                              <div className="flex items-center justify-center gap-2">
                                <button
                                  onClick={() => handleDeleteClick(cid)}
                                  className="p-2 bg-red-600 hover:bg-red-700 text-white rounded-lg shadow-md transform hover:scale-110 transition-all duration-300"
                                  title="Delete"
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

      {/* Delete Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent className="bg-white border-2 border-orange-200">
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center text-xl font-black text-gray-900">
              <AlertTriangle className="mr-2 text-red-600" size={24} />
              Delete Consultation?
            </AlertDialogTitle>
            <AlertDialogDescription className="text-gray-600 text-base">
              Are you sure you want to delete this consultation request? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel
              onClick={() => setDeleteDialogOpen(false)}
              className="bg-gray-100 hover:bg-gray-200 text-gray-900 font-bold px-6 py-2 rounded-lg"
            >
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