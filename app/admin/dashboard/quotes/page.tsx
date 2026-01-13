"use client";

import React, { useState, useEffect, useRef } from "react";
import {
  FileText,
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
  DollarSign,
  Clock,
  Tag,
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

interface Quote {
  _id?: string;
  id?: string;
  name: string;
  email: string;
  phone: string;
  company?: string;
  services: string[];
  budget: string;
  timeline: string;
  description: string;
  additional_info?: string;
  status:
    | "pending"
    | "reviewing"
    | "quoted"
    | "accepted"
    | "rejected"
    | "completed";
  priority: "low" | "medium" | "high" | "urgent";
  adminNotes?: string;
  quotedAmount?: number;
  createdAt?: string;
  updatedAt?: string;
}

export default function AdminQuotesPage() {
  const [quotes, setQuotes] = useState<Quote[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterPriority, setFilterPriority] = useState("all");
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [quoteToDelete, setQuoteToDelete] = useState<string | null>(null);
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [selectedQuote, setSelectedQuote] = useState<Quote | null>(null);
  const loadToastShownRef = useRef(false);

  useEffect(() => {
    fetchQuotes();
  }, []);

  const fetchQuotes = async (opts: { forceToast?: boolean } = {}) => {
    setLoading(true);
    try {
      const response = await fetch("/api/admin/quotes", {
        credentials: "include",
        headers: { Accept: "application/json" },
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch quotes: ${response.status}`);
      }

      const data: Quote[] = await response.json();
      setQuotes(data);

      if (!loadToastShownRef.current || opts.forceToast) {
        toast.success("Quote requests loaded successfully! 💼");
        loadToastShownRef.current = true;
      }
    } catch (error) {
      toast.error("Failed to load quote requests", {
        description: "Please check your database connection.",
      });
    } finally {
      setLoading(false);
    }
  };

  const filteredQuotes = quotes.filter((quote: Quote) => {
    const q = (searchQuery || "").toString().toLowerCase().trim();
    const matchesSearch =
      quote.name?.toLowerCase()?.includes(q) ||
      quote.email?.toLowerCase()?.includes(q) ||
      quote.company?.toLowerCase()?.includes(q) ||
      quote.phone?.toString()?.includes(q);

    const matchesStatus =
      filterStatus === "all" || quote.status === filterStatus;
    const matchesPriority =
      filterPriority === "all" || quote.priority === filterPriority;

    return matchesSearch && matchesStatus && matchesPriority;
  });

  const handleViewClick = (quote: Quote) => {
    setSelectedQuote(quote);
    setViewDialogOpen(true);
  };

  const handleDeleteClick = (id: string) => {
    setQuoteToDelete(id);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!quoteToDelete) return;

    try {
      const response = await fetch(`/api/admin/quotes/${quoteToDelete}`, {
        method: "DELETE",
      });
      if (!response.ok) throw new Error("Failed to delete");

      setQuotes((prev) =>
        prev.filter((q) => (q.id ?? q._id) !== quoteToDelete)
      );
      toast.success("Quote deleted successfully! 🗑️", {
        description: "The quote request has been removed from your database.",
      });
    } catch (error) {
      toast.error("Failed to delete quote", {
        description: "Please try again later.",
      });
    } finally {
      setDeleteDialogOpen(false);
      setQuoteToDelete(null);
    }
  };

  const updateStatus = async (id: string, newStatus: Quote["status"]) => {
    try {
      const response = await fetch(`/api/admin/quotes/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });

      if (!response.ok) throw new Error("Failed to update");

      setQuotes((prev) =>
        prev.map((q) =>
          (q.id ?? q._id) === id ? { ...q, status: newStatus } : q
        )
      );
      toast.success("Status updated! ✅", {
        description: `Quote status changed to ${newStatus}`,
      });
    } catch (error) {
      toast.error("Failed to update status", {
        description: "Please try again later.",
      });
    }
  };

  const updatePriority = async (
    id: string,
    newPriority: Quote["priority"]
  ) => {
    try {
      const response = await fetch(`/api/admin/quotes/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ priority: newPriority }),
      });

      if (!response.ok) throw new Error("Failed to update");

      setQuotes((prev) =>
        prev.map((q) =>
          (q.id ?? q._id) === id ? { ...q, priority: newPriority } : q
        )
      );
      toast.success("Priority updated! 🎯");
    } catch (error) {
      toast.error("Failed to update priority");
    }
  };

  const getStatusColor = (status: Quote["status"]) => {
    const colors = {
      pending: "bg-yellow-100 text-yellow-700",
      reviewing: "bg-blue-100 text-blue-700",
      quoted: "bg-purple-100 text-purple-700",
      accepted: "bg-green-100 text-green-700",
      rejected: "bg-red-100 text-red-700",
      completed: "bg-gray-100 text-gray-700",
    };
    return colors[status] || "bg-gray-100 text-gray-700";
  };

  const getPriorityColor = (priority: Quote["priority"]) => {
    const colors = {
      urgent: "bg-red-500 text-white",
      high: "bg-orange-500 text-white",
      medium: "bg-blue-500 text-white",
      low: "bg-gray-500 text-white",
    };
    return colors[priority] || "bg-gray-500 text-white";
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-amber-100">
      {/* Fixed Header */}
      <header className="fixed top-0 left-0 lg:left-72 right-0 z-50 bg-white/95 backdrop-blur-xl shadow-xl border-b-4 border-orange-600">
        <div className="px-4 sm:px-6 lg:px-8 py-5">
          <div className="flex items-center justify-between">
            <div className="ml-12 lg:ml-0">
              <h1 className="text-3xl sm:text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-orange-600 to-orange-800 flex items-center">
                Quote Requests
                <FileText className="ml-2 text-orange-600" size={28} />
              </h1>
              <p className="text-sm text-gray-600 mt-1 font-semibold">
                Manage all quote requests 💼
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
                <FileText className="mr-2 text-orange-600" size={24} />
                Quote Requests
                <Sparkles className="ml-2 text-amber-500" size={20} />
              </h2>

              <button
                onClick={() => fetchQuotes({ forceToast: true })}
                className="w-full sm:w-auto bg-gradient-to-r from-orange-600 to-orange-700 text-white font-bold px-4 sm:px-6 py-2 sm:py-3 rounded-xl shadow-lg hover:scale-105 transition-all duration-300 flex items-center justify-center space-x-2 text-sm sm:text-base"
              >
                <Zap size={16} className="sm:w-[18px] sm:h-[18px]" />
                <span>Refresh</span>
              </button>
            </div>

            {/* Filters */}
            <div className="mb-6 flex flex-col sm:flex-row gap-3">
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="w-full sm:w-auto px-4 py-2 border-2 border-amber-200 rounded-lg font-bold text-sm sm:text-base text-gray-700 focus:outline-none focus:border-orange-600"
              >
                <option value="all">All Status</option>
                <option value="pending">Pending</option>
                <option value="reviewing">Reviewing</option>
                <option value="quoted">Quoted</option>
                <option value="accepted">Accepted</option>
                <option value="rejected">Rejected</option>
                <option value="completed">Completed</option>
              </select>

              <select
                value={filterPriority}
                onChange={(e) => setFilterPriority(e.target.value)}
                className="w-full sm:w-auto px-4 py-2 border-2 border-amber-200 rounded-lg font-bold text-sm sm:text-base text-gray-700 focus:outline-none focus:border-orange-600"
              >
                <option value="all">All Priority</option>
                <option value="urgent">Urgent</option>
                <option value="high">High</option>
                <option value="medium">Medium</option>
                <option value="low">Low</option>
              </select>
            </div>

            {loading && (
              <div className="text-center py-12">
                <div className="inline-block animate-spin rounded-full h-12 w-12 sm:h-16 sm:w-16 border-4 border-orange-600 border-t-transparent"></div>
                <p className="mt-4 text-gray-600 font-bold text-sm sm:text-base">
                  Loading quote requests...
                </p>
              </div>
            )}

            {!loading && filteredQuotes.length === 0 && (
              <div className="text-center py-12">
                <div className="w-20 h-20 sm:w-24 sm:h-24 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full flex items-center justify-center text-3xl sm:text-4xl mx-auto mb-4">
                  📋
                </div>
                <p className="text-lg sm:text-xl font-black text-gray-900 mb-2">
                  No Quote Requests Found
                </p>
                <p className="text-sm sm:text-base text-gray-600 font-semibold px-4">
                  {searchQuery
                    ? "Try adjusting your search criteria"
                    : "No quote requests in the database yet"}
                </p>
              </div>
            )}

            {/* RESPONSIVE TABLE VIEW */}
            {!loading && filteredQuotes.length > 0 && (
              <>
                {/* MOBILE VIEW (Cards) - Hidden on md and up */}
                <div className="block md:hidden space-y-4">
                  {filteredQuotes.map((quote: Quote, index: number) => {
                    const qid = quote.id ?? quote._id ?? `quote-${index}`;
                    return (
                      <div
                        key={qid}
                        className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-xl border-2 border-amber-200 overflow-hidden shadow-md hover:shadow-xl transition-all duration-300"
                      >
                        {/* Mobile Card Header */}
                        <div className="bg-gradient-to-r from-orange-100 to-amber-100 p-4 border-b-2 border-orange-200">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-3">
                              <div className="w-10 h-10 bg-gradient-to-br from-orange-600 to-orange-800 text-white rounded-lg flex items-center justify-center font-black shadow-md">
                                {quote.name?.charAt(0).toUpperCase() || "?"}
                              </div>
                              <div>
                                <h3 className="font-black text-base text-gray-900">
                                  {quote.name}
                                </h3>
                                {quote.createdAt && (
                                  <span className="text-xs text-gray-500 flex items-center">
                                    <Calendar size={10} className="mr-1" />
                                    {new Date(
                                      quote.createdAt
                                    ).toLocaleDateString()}
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Mobile Card Content */}
                        <div className="p-4 space-y-3">
                          {/* Status & Priority */}
                          <div className="flex items-center gap-2 flex-wrap">
                            <span
                              className={`text-xs font-bold px-2 py-1 rounded-full ${getStatusColor(
                                quote.status
                              )}`}
                            >
                              {quote.status.toUpperCase()}
                            </span>
                            <span
                              className={`text-xs font-bold px-2 py-1 rounded-full ${getPriorityColor(
                                quote.priority
                              )}`}
                            >
                              {quote.priority.toUpperCase()}
                            </span>
                          </div>

                          {/* Contact Info */}
                          <div className="space-y-2">
                            <div className="flex items-center space-x-2 text-sm">
                              <Mail size={14} className="text-orange-600" />
                              <span className="font-semibold text-gray-700 break-all">
                                {quote.email}
                              </span>
                            </div>
                            <div className="flex items-center space-x-2 text-sm">
                              <Phone size={14} className="text-orange-600" />
                              <span className="font-semibold text-gray-700">
                                {quote.phone}
                              </span>
                            </div>
                            {quote.company && (
                              <div className="flex items-center space-x-2 text-sm">
                                <Building2
                                  size={14}
                                  className="text-orange-600"
                                />
                                <span className="font-semibold text-gray-700">
                                  {quote.company}
                                </span>
                              </div>
                            )}
                          </div>

                          {/* Budget & Timeline */}
                          <div className="grid grid-cols-2 gap-2">
                            <div className="bg-white rounded-lg p-2 border border-amber-200">
                              <p className="text-xs text-gray-500 mb-1">
                                Budget
                              </p>
                              <p className="text-sm font-bold text-gray-900">
                                {quote.budget}
                              </p>
                            </div>
                            <div className="bg-white rounded-lg p-2 border border-amber-200">
                              <p className="text-xs text-gray-500 mb-1">
                                Timeline
                              </p>
                              <p className="text-sm font-bold text-gray-900">
                                {quote.timeline}
                              </p>
                            </div>
                          </div>

                          {/* Services */}
                          <div>
                            <p className="text-xs font-bold text-gray-600 mb-2">
                              Services:
                            </p>
                            <div className="flex flex-wrap gap-1">
                              {quote.services?.slice(0, 3).map((service, i) => (
                                <span
                                  key={i}
                                  className="text-xs font-semibold px-2 py-1 bg-blue-100 text-blue-700 rounded"
                                >
                                  {service}
                                </span>
                              ))}
                              {quote.services && quote.services.length > 3 && (
                                <span className="text-xs font-semibold px-2 py-1 bg-gray-100 text-gray-700 rounded">
                                  +{quote.services.length - 3}
                                </span>
                              )}
                            </div>
                          </div>

                          {/* Description */}
                          <div className="bg-white rounded-lg p-3 border border-amber-200">
                            <p className="text-sm text-gray-700 line-clamp-2">
                              {quote.description}
                            </p>
                          </div>

                          {/* Actions */}
                          <div className="flex flex-col gap-2 pt-2 border-t border-amber-200">
                            <button
                              onClick={() => handleViewClick(quote)}
                              className="w-full flex items-center justify-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white font-bold px-4 py-2 rounded-lg shadow-md transition-all duration-300"
                            >
                              <Eye size={14} />
                              <span className="text-sm">View Details</span>
                            </button>

                            <div className="grid grid-cols-2 gap-2">
                              <select
                                value={quote.status}
                                onChange={(e) =>
                                  updateStatus(
                                    qid,
                                    e.target.value as Quote["status"]
                                  )
                                }
                                className="px-3 py-2 border-2 border-amber-200 rounded-lg font-bold text-xs focus:outline-none focus:border-orange-600"
                              >
                                <option value="pending">Pending</option>
                                <option value="reviewing">Reviewing</option>
                                <option value="quoted">Quoted</option>
                                <option value="accepted">Accepted</option>
                                <option value="rejected">Rejected</option>
                                <option value="completed">Completed</option>
                              </select>

                              <select
                                value={quote.priority}
                                onChange={(e) =>
                                  updatePriority(
                                    qid,
                                    e.target.value as Quote["priority"]
                                  )
                                }
                                className="px-3 py-2 border-2 border-amber-200 rounded-lg font-bold text-xs focus:outline-none focus:border-orange-600"
                              >
                                <option value="low">Low</option>
                                <option value="medium">Medium</option>
                                <option value="high">High</option>
                                <option value="urgent">Urgent</option>
                              </select>
                            </div>

                            <button
                              onClick={() => handleDeleteClick(qid)}
                              className="w-full flex items-center justify-center space-x-2 bg-red-600 hover:bg-red-700 text-white font-bold px-4 py-2 rounded-lg shadow-md transition-all duration-300"
                            >
                              <Trash2 size={14} />
                              <span className="text-sm">Delete</span>
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* TABLET VIEW - Hidden on mobile and desktop */}
                <div className="hidden md:block lg:hidden">
                  <div className="grid grid-cols-1 gap-4">
                    {filteredQuotes.map((quote: Quote, index: number) => {
                      const qid = quote.id ?? quote._id ?? `quote-${index}`;
                      return (
                        <div
                          key={qid}
                          className="bg-gradient-to-r from-amber-50 to-orange-50 rounded-xl border-2 border-amber-200 p-4 hover:shadow-xl transition-all duration-300"
                        >
                          <div className="flex gap-4">
                            {/* Avatar */}
                            <div className="flex-shrink-0">
                              <div className="w-16 h-16 bg-gradient-to-br from-orange-600 to-orange-800 text-white rounded-xl flex items-center justify-center font-black shadow-lg text-2xl">
                                {quote.name?.charAt(0).toUpperCase() || "?"}
                              </div>
                            </div>

                            {/* Content */}
                            <div className="flex-1 space-y-3">
                              <div className="flex items-start justify-between">
                                <div>
                                  <h3 className="font-black text-lg text-gray-900">
                                    {quote.name}
                                  </h3>
                                  <div className="flex items-center gap-2 mt-1 flex-wrap">
                                    <span
                                      className={`text-xs font-bold px-2 py-1 rounded-full ${getStatusColor(
                                        quote.status
                                      )}`}
                                    >
                                      {quote.status.toUpperCase()}
                                    </span>
                                    <span
                                      className={`text-xs font-bold px-2 py-1 rounded-full ${getPriorityColor(
                                        quote.priority
                                      )}`}
                                    >
                                      {quote.priority.toUpperCase()}
                                    </span>
                                  </div>
                                </div>
                              </div>

                              <div className="grid grid-cols-2 gap-2 text-sm">
                                <div className="flex items-center space-x-2">
                                  <Mail size={14} className="text-orange-600" />
                                  <span className="font-semibold text-gray-700 truncate">
                                    {quote.email}
                                  </span>
                                </div>
                                <div className="flex items-center space-x-2">
                                  <Phone
                                    size={14}
                                    className="text-orange-600"
                                  />
                                  <span className="font-semibold text-gray-700">
                                    {quote.phone}
                                  </span>
                                </div>
                              </div>

                              <div className="flex flex-wrap gap-1">
                                {quote.services
                                  ?.slice(0, 4)
                                  .map((service, i) => (
                                    <span
                                      key={i}
                                      className="text-xs font-semibold px-2 py-1 bg-blue-100 text-blue-700 rounded"
                                    >
                                      {service}
                                    </span>
                                  ))}
                              </div>

                              <div className="flex items-center justify-between pt-2 border-t border-amber-200">
                                {quote.createdAt && (
                                  <span className="text-xs text-gray-500 flex items-center">
                                    <Calendar size={12} className="mr-1" />
                                    {new Date(
                                      quote.createdAt
                                    ).toLocaleDateString()}
                                  </span>
                                )}
                                <div className="flex gap-2">
                                  <button
                                    onClick={() => handleViewClick(quote)}
                                    className="p-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg shadow-md transition-all duration-300"
                                  >
                                    <Eye size={16} />
                                  </button>
                                  <button
                                    onClick={() => handleDeleteClick(qid)}
                                    className="p-2 bg-red-600 hover:bg-red-700 text-white rounded-lg shadow-md transition-all duration-300"
                                  >
                                    <Trash2 size={16} />
                                  </button>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* DESKTOP TABLE VIEW - Hidden on mobile and tablet */}
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
                          Services
                        </th>
                        <th className="px-4 py-3 text-left font-black text-gray-900 text-sm">
                          Budget
                        </th>
                        <th className="px-4 py-3 text-left font-black text-gray-900 text-sm">
                          Status
                        </th>
                        <th className="px-4 py-3 text-left font-black text-gray-900 text-sm">
                          Priority
                        </th>
                        <th className="px-4 py-3 text-left font-black text-gray-900 text-sm">
                          Date
                        </th>
                        <th className="px-4 py-3 text-center font-black text-gray-900 text-sm">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredQuotes.map((quote: Quote, index: number) => {
                        const qid = quote.id ?? quote._id ?? `quote-${index}`;
                        return (
                          <tr
                            key={qid}
                            className="border-b border-amber-200 hover:bg-gradient-to-r hover:from-amber-50 hover:to-orange-50 transition-all duration-300 group/row"
                          >
                            {/* Client */}
                            <td className="px-4 py-3">
                              <div className="flex items-center space-x-3">
                                <div className="w-10 h-10 bg-gradient-to-br from-orange-600 to-orange-800 text-white rounded-lg flex items-center justify-center font-black shadow-md flex-shrink-0">
                                  {quote.name?.charAt(0).toUpperCase() || "?"}
                                </div>
                                <div className="min-w-0">
                                  <h3 className="font-black text-gray-900 text-sm truncate">
                                    {quote.name}
                                  </h3>
                                  {quote.company && (
                                    <p className="text-xs text-gray-500 truncate">
                                      {quote.company}
                                    </p>
                                  )}
                                </div>
                              </div>
                            </td>

                            {/* Contact */}
                            <td className="px-4 py-3">
                              <div className="space-y-1">
                                <div className="flex items-center text-xs text-gray-600">
                                  <Mail size={12} className="mr-1 flex-shrink-0" />
                                  <span className="truncate max-w-[150px]">
                                    {quote.email}
                                  </span>
                                </div>
                                <div className="flex items-center text-xs text-gray-600">
                                  <Phone size={12} className="mr-1 flex-shrink-0" />
                                  <span>{quote.phone}</span>
                                </div>
                              </div>
                            </td>

                            {/* Services */}
                            {/* Services */}
                            <td className="px-4 py-3">
                              <div className="flex flex-wrap gap-1 max-w-xs">
                                {quote.services?.slice(0, 2).map((service, i) => (
                                  <span
                                    key={i}
                                    className="text-xs font-semibold px-2 py-1 bg-blue-100 text-blue-700 rounded whitespace-nowrap"
                                  >
                                    {service}
                                  </span>
                                ))}
                                {quote.services && quote.services.length > 2 && (
                                  <span className="text-xs font-semibold px-2 py-1 bg-gray-100 text-gray-700 rounded">
                                    +{quote.services.length - 2}
                                  </span>
                                )}
                              </div>
                            </td>

                            {/* Budget */}
                            <td className="px-4 py-3">
                              <div className="flex items-center">
                                <DollarSign size={14} className="text-green-600 mr-1" />
                                <span className="text-sm font-bold text-gray-900 whitespace-nowrap">
                                  {quote.budget}
                                </span>
                              </div>
                              <div className="flex items-center mt-1">
                                <Clock size={12} className="text-blue-600 mr-1" />
                                <span className="text-xs text-gray-600">
                                  {quote.timeline}
                                </span>
                              </div>
                            </td>

                            {/* Status */}
                            <td className="px-4 py-3">
                              <select
                                value={quote.status}
                                onChange={(e) =>
                                  updateStatus(qid, e.target.value as Quote["status"])
                                }
                                className={`text-xs font-bold px-3 py-1 rounded-full border-0 focus:outline-none focus:ring-2 focus:ring-orange-400 cursor-pointer ${getStatusColor(
                                  quote.status
                                )}`}
                              >
                                <option value="pending">Pending</option>
                                <option value="reviewing">Reviewing</option>
                                <option value="quoted">Quoted</option>
                                <option value="accepted">Accepted</option>
                                <option value="rejected">Rejected</option>
                                <option value="completed">Completed</option>
                              </select>
                            </td>

                            {/* Priority */}
                            <td className="px-4 py-3">
                              <select
                                value={quote.priority}
                                onChange={(e) =>
                                  updatePriority(
                                    qid,
                                    e.target.value as Quote["priority"]
                                  )
                                }
                                className={`text-xs font-bold px-3 py-1 rounded-full border-0 focus:outline-none focus:ring-2 focus:ring-orange-400 cursor-pointer ${getPriorityColor(
                                  quote.priority
                                )}`}
                              >
                                <option value="low">Low</option>
                                <option value="medium">Medium</option>
                                <option value="high">High</option>
                                <option value="urgent">Urgent</option>
                              </select>
                            </td>

                            {/* Date */}
                            <td className="px-4 py-3">
                              {quote.createdAt && (
                                <span className="text-xs text-gray-600 flex items-center whitespace-nowrap">
                                  <Calendar
                                    size={12}
                                    className="mr-1 text-orange-600"
                                  />
                                  {new Date(quote.createdAt).toLocaleDateString(
                                    "en-US",
                                    {
                                      month: "short",
                                      day: "numeric",
                                      year: "numeric",
                                    }
                                  )}
                                </span>
                              )}
                            </td>

                            {/* Actions */}
                            <td className="px-4 py-3">
                              <div className="flex items-center justify-center gap-2">
                                <button
                                  onClick={() => handleViewClick(quote)}
                                  className="p-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg shadow-md transform hover:scale-110 transition-all duration-300"
                                  title="View Details"
                                >
                                  <Eye size={14} />
                                </button>
                                <button
                                  onClick={() => handleDeleteClick(qid)}
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

      {/* View Quote Dialog */}
      <AlertDialog open={viewDialogOpen} onOpenChange={setViewDialogOpen}>
        <AlertDialogContent className="bg-white border-2 border-orange-200 max-w-3xl max-h-[90vh] overflow-y-auto">
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center text-2xl font-black text-gray-900">
              <FileText className="mr-2 text-orange-600" size={24} />
              Quote Request Details
            </AlertDialogTitle>
            <AlertDialogDescription className="text-gray-600">
              Complete information about the quote request
            </AlertDialogDescription>
          </AlertDialogHeader>

          {selectedQuote && (
            <div className="space-y-6 py-4">
              <div>
                <h3 className="text-lg font-black text-gray-900 mb-3">
                  Client Information
                </h3>
                <div className="bg-amber-50 rounded-lg p-4 space-y-2">
                  <p>
                    <span className="font-bold">Name:</span> {selectedQuote.name}
                  </p>
                  <p>
                    <span className="font-bold">Email:</span>{" "}
                    {selectedQuote.email}
                  </p>
                  <p>
                    <span className="font-bold">Phone:</span>{" "}
                    {selectedQuote.phone}
                  </p>
                  {selectedQuote.company && (
                    <p>
                      <span className="font-bold">Company:</span>{" "}
                      {selectedQuote.company}
                    </p>
                  )}
                </div>
              </div>

              <div>
                <h3 className="text-lg font-black text-gray-900 mb-3">
                  Project Details
                </h3>
                <div className="bg-amber-50 rounded-lg p-4 space-y-3">
                  <div>
                    <p className="font-bold mb-2">Services Required:</p>
                    <div className="flex flex-wrap gap-2">
                      {selectedQuote.services?.map((service, i) => (
                        <span
                          key={i}
                          className="text-xs font-semibold px-3 py-1 bg-blue-100 text-blue-700 rounded-full"
                        >
                          {service}
                        </span>
                      ))}
                    </div>
                  </div>
                  <p>
                    <span className="font-bold">Budget:</span>{" "}
                    {selectedQuote.budget}
                  </p>
                  <p>
                    <span className="font-bold">Timeline:</span>{" "}
                    {selectedQuote.timeline}
                  </p>
                  <div>
                    <p className="font-bold mb-2">Project Description:</p>
                    <p className="text-gray-700 bg-white p-3 rounded border-2 border-amber-200">
                      {selectedQuote.description}
                    </p>
                  </div>
                  {selectedQuote.additional_info && (
                    <div>
                      <p className="font-bold mb-2">Additional Information:</p>
                      <p className="text-gray-700 bg-white p-3 rounded border-2 border-amber-200">
                        {selectedQuote.additional_info}
                      </p>
                    </div>
                  )}
                </div>
              </div>

              <div>
                <h3 className="text-lg font-black text-gray-900 mb-3">
                  Status & Priority
                </h3>
                <div className="bg-amber-50 rounded-lg p-4 space-y-2">
                  <p>
                    <span className="font-bold">Status:</span>
                    <span
                      className={`ml-2 text-xs font-bold px-3 py-1 rounded-full ${getStatusColor(
                        selectedQuote.status
                      )}`}
                    >
                      {selectedQuote.status.toUpperCase()}
                    </span>
                  </p>
                  <p>
                    <span className="font-bold">Priority:</span>
                    <span
                      className={`ml-2 text-xs font-bold px-3 py-1 rounded-full ${getPriorityColor(
                        selectedQuote.priority
                      )}`}
                    >
                      {selectedQuote.priority.toUpperCase()}
                    </span>
                  </p>
                  {selectedQuote.createdAt && (
                    <p>
                      <span className="font-bold">Submitted:</span>{" "}
                      {new Date(selectedQuote.createdAt).toLocaleString()}
                    </p>
                  )}
                </div>
              </div>
            </div>
          )}

          <AlertDialogFooter>
            <AlertDialogCancel
              onClick={() => setViewDialogOpen(false)}
              className="bg-gray-100 hover:bg-gray-200 text-gray-900 font-bold px-6 py-2 rounded-lg"
            >
              Close
            </AlertDialogCancel>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent className="bg-white border-2 border-orange-200">
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center text-xl font-black text-gray-900">
              <AlertTriangle className="mr-2 text-red-600" size={24} />
              Delete Quote Request?
            </AlertDialogTitle>
            <AlertDialogDescription className="text-gray-600 text-base">
              Are you sure you want to delete this quote request? This action
              cannot be undone.
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