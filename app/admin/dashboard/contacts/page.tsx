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
  MessageCircle,
  Trash2,
  Eye,
  Calendar,
  AlertTriangle,
  CheckCircle,
  Clock,
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

interface Contact {
  _id?: string;
  id?: string;
  name: string;
  email: string;
  phone?: string;
  inquiry_type: 'general' | 'booking' | 'event' | 'complaint' | 'feedback';
  message: string;
  status: "pending" | "replied";
  createdAt?: string;
  updatedAt?: string;
}

export default function AdminContactsPage() {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterInquiryType, setFilterInquiryType] = useState("all");
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [contactToDelete, setContactToDelete] = useState<string | null>(null);
  const loadToastShownRef = useRef(false);

  useEffect(() => {
    fetchContacts();
  }, []);

  const fetchContacts = async (opts: { forceToast?: boolean } = {}) => {
    setLoading(true);
    try {
      const response = await fetch("/api/admin/contacts", {
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
        throw new Error("Failed to fetch contacts");
      }

      const data: Contact[] = await response.json();
      setContacts(data);

      if (!loadToastShownRef.current || opts.forceToast) {
        loadToastShownRef.current = true;
      }
    } catch (error) {
      // Error handled
    } finally {
      setLoading(false);
    }
  };

  const filteredContacts = contacts.filter((contact: Contact) => {
    const q = (searchQuery || "").toString().toLowerCase().trim();
    const matchesName = contact.name?.toLowerCase()?.includes(q) ?? false;
    const matchesEmail = contact.email?.toLowerCase()?.includes(q) ?? false;
    const matchesPhone = contact.phone?.toString()?.includes(q) ?? false;
    const matchesInquiryType = contact.inquiry_type?.toLowerCase()?.includes(q) ?? false;
    const matchesSearch = matchesName || matchesEmail || matchesPhone || matchesInquiryType;

    const statusMatches = filterStatus === "all" || contact.status === filterStatus;
    const inquiryMatches = filterInquiryType === "all" || contact.inquiry_type === filterInquiryType;
    
    return matchesSearch && statusMatches && inquiryMatches;
  });

  const handleDeleteClick = (id: string) => {
    setContactToDelete(id);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!contactToDelete) return;

    try {
      const response = await fetch(`/api/admin/contacts/${contactToDelete}`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
      });

      if (!response.ok) throw new Error("Failed to delete");

      setContacts((prev) =>
        prev.filter((c) => (c.id ?? c._id) !== contactToDelete)
      );
    } catch (error) {
      // Error handled
    } finally {
      setDeleteDialogOpen(false);
      setContactToDelete(null);
    }
  };

  const updateStatus = async (id: string, newStatus: "pending" | "replied") => {
    try {
      const response = await fetch(`/api/admin/contacts/${id}`, {
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

      const updatedContact = await response.json();

      setContacts((prev) =>
        prev.map((c) => ((c.id ?? c._id) === id ? updatedContact : c))
      );
    } catch (error) {
      // Error handled
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-yellow-50">
      {/* Fixed Header */}
      <header className="fixed top-0 left-0 lg:left-72 right-0 z-50 bg-white/95 backdrop-blur-xl shadow-xl border-b-4 border-varanasi-gold">
        <div className="px-4 sm:px-6 lg:px-8 py-5">
          <div className="flex items-center justify-between">
            <div className="ml-12 lg:ml-0">
              <h1 className="text-3xl sm:text-4xl font-black text-varanasi-maroon flex items-center">
                Contact Messages
                <Users className="ml-2 text-varanasi-gold" size={28} />
              </h1>
              <p className="text-sm text-varanasi-brown mt-1 font-semibold">
                Manage all customer inquiries 📬
              </p>
            </div>
          </div>
        </div>
      </header>

      {/* Page Content */}
      <div className="pt-28 p-4 sm:p-6 lg:p-8 relative z-10">
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl p-4 sm:p-6 border-2 border-varanasi-gold relative overflow-hidden group sm:mt-28">
          <div className="absolute top-0 left-0 opacity-5 group-hover:opacity-10 transition-opacity duration-300">
            <Sparkles size={200} className="text-varanasi-gold" />
          </div>

          <div className="relative z-10">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 gap-4">
              <h2 className="text-xl sm:text-2xl font-black text-varanasi-maroon flex items-center">
                <MessageCircle className="mr-2 text-varanasi-gold" size={24} />
                Contact Messages
                <Sparkles className="ml-2 text-varanasi-gold" size={20} />
              </h2>

              <div className="flex flex-wrap gap-2 sm:gap-3 w-full sm:w-auto">
                <button
                  onClick={() => fetchContacts({ forceToast: true })}
                  className="flex-1 sm:flex-none bg-varanasi-maroon text-varanasi-gold font-bold px-4 sm:px-6 py-2 sm:py-3 rounded-xl shadow-lg hover:scale-105 transition-all duration-300 flex items-center justify-center space-x-2 text-sm sm:text-base border border-varanasi-gold"
                >
                  <Zap size={16} className="sm:w-[18px] sm:h-[18px]" />
                  <span>Refresh</span>
                </button>
              </div>
            </div>

            {/* Search and Filters */}
            <div className="mb-6 space-y-4">
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex-1">
                  <input
                    type="text"
                    placeholder="Search contacts..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full px-4 py-2 border-2 border-varanasi-gold rounded-lg focus:outline-none focus:ring-2 focus:ring-varanasi-maroon"
                  />
                </div>
                <div className="flex gap-2">
                  <select
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value)}
                    className="px-4 py-2 border-2 border-varanasi-gold rounded-lg focus:outline-none focus:ring-2 focus:ring-varanasi-maroon"
                  >
                    <option value="all">All Status</option>
                    <option value="pending">Pending</option>
                    <option value="replied">Replied</option>
                  </select>
                  <select
                    value={filterInquiryType}
                    onChange={(e) => setFilterInquiryType(e.target.value)}
                    className="px-4 py-2 border-2 border-varanasi-gold rounded-lg focus:outline-none focus:ring-2 focus:ring-varanasi-maroon"
                  >
                    <option value="all">All Types</option>
                    <option value="general">General</option>
                    <option value="booking">Booking</option>
                    <option value="event">Event</option>
                    <option value="complaint">Complaint</option>
                    <option value="feedback">Feedback</option>
                  </select>
                </div>
              </div>
            </div>

            {loading && (
              <div className="text-center py-12">
                <div className="inline-block animate-spin rounded-full h-12 w-12 sm:h-16 sm:w-16 border-4 border-varanasi-gold border-t-transparent"></div>
                <p className="mt-4 text-gray-600 font-bold text-sm sm:text-base">
                  Loading contacts...
                </p>
              </div>
            )}

            {!loading && filteredContacts.length === 0 && (
              <div className="text-center py-12">
                <div className="w-20 h-20 sm:w-24 sm:h-24 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full flex items-center justify-center text-3xl sm:text-4xl mx-auto mb-4">
                  📭
                </div>
                <p className="text-lg sm:text-xl font-black text-gray-900 mb-2">
                  No Contacts Found
                </p>
                <p className="text-sm sm:text-base text-gray-600 font-semibold px-4">
                  {searchQuery
                    ? "Try adjusting your search criteria"
                    : "No contacts in the database yet"}
                </p>
              </div>
            )}

            {/* RESPONSIVE TABLE VIEW */}
            {!loading && filteredContacts.length > 0 && (
              <>
                {/* MOBILE VIEW (Cards) - Hidden on md and up */}
                <div className="block md:hidden space-y-4">
                  {filteredContacts.map((contact: Contact, index: number) => {
                    const cid = contact.id ?? contact._id ?? `contact-${index}`;
                    return (
                      <div
                        key={cid}
                        className="bg-varanasi-cream/50 rounded-xl border-2 border-varanasi-gold overflow-hidden shadow-md hover:shadow-xl transition-all duration-300"
                      >
                        {/* Mobile Card Header */}
                        <div className="bg-gradient-to-r from-varanasi-maroon to-varanasi-maroon-dark p-4">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-3">
                              <div className="w-10 h-10 bg-varanasi-gold text-varanasi-maroon rounded-lg flex items-center justify-center font-black shadow-lg">
                                {contact.name?.charAt(0).toUpperCase() || "?"}
                              </div>
                              <div>
                                <h3 className="font-black text-base text-varanasi-gold">
                                  {contact.name}
                                </h3>
                                {contact.createdAt && (
                                  <p className="text-xs text-varanasi-gold/80 flex items-center mt-1">
                                    <Calendar size={10} className="mr-1" />
                                    {new Date(contact.createdAt).toLocaleDateString()}
                                  </p>
                                )}
                              </div>
                            </div>
                            <span
                              className={`text-xs font-bold px-3 py-1 rounded-full ${
                                contact.status === "replied"
                                  ? "bg-green-100 text-green-700"
                                  : "bg-yellow-100 text-yellow-700"
                              }`}
                            >
                              {contact.status.toUpperCase()}
                            </span>
                          </div>
                        </div>

                        {/* Mobile Card Content */}
                        <div className="p-4 space-y-3">
                          {/* Contact Details */}
                          <div className="space-y-2">
                            <div className="flex items-center space-x-2 text-sm">
                              <Mail size={14} className="text-varanasi-gold flex-shrink-0" />
                              <span className="font-semibold text-varanasi-maroon break-all">
                                {contact.email}
                              </span>
                            </div>
                            {contact.phone && (
                              <div className="flex items-center space-x-2 text-sm">
                                <Phone size={14} className="text-varanasi-gold flex-shrink-0" />
                                <span className="font-semibold text-varanasi-maroon">
                                  {contact.phone}
                                </span>
                              </div>
                            )}
                            <div className="flex items-center space-x-2 text-sm">
                              <MessageCircle size={14} className="text-varanasi-gold flex-shrink-0" />
                              <span className="font-semibold text-varanasi-maroon capitalize">
                                {contact.inquiry_type}
                              </span>
                            </div>
                          </div>

                          {/* Message */}
                          {contact.message && (
                            <div className="bg-white/80 rounded-lg p-3 border-2 border-varanasi-gold/30">
                              <p className="text-xs font-medium text-varanasi-brown line-clamp-3">
                                {contact.message}
                              </p>
                            </div>
                          )}

                          {/* Actions */}
                          <div className="flex gap-2 pt-2 border-t border-varanasi-gold/30">
                            <button
                              onClick={() =>
                                updateStatus(
                                  cid,
                                  contact.status === "pending" ? "replied" : "pending"
                                )
                              }
                              className="flex-1 flex items-center justify-center space-x-2 bg-varanasi-maroon hover:bg-varanasi-maroon-dark text-varanasi-gold font-bold px-4 py-2 rounded-lg shadow-md transition-all duration-300"
                            >
                              {contact.status === "pending" ? (
                                <CheckCircle size={14} />
                              ) : (
                                <Clock size={14} />
                              )}
                              <span className="text-xs">
                                {contact.status === "pending" ? "Replied" : "Pending"}
                              </span>
                            </button>
                            <button
                              onClick={() => handleDeleteClick(cid)}
                              className="flex items-center justify-center bg-red-600 hover:bg-red-700 text-white font-bold px-4 py-2 rounded-lg shadow-md transition-all duration-300"
                            >
                              <Trash2 size={14} />
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
                    {filteredContacts.map((contact: Contact, index: number) => {
                      const cid = contact.id ?? contact._id ?? `contact-${index}`;
                      return (
                        <div
                          key={cid}
                          className="bg-varanasi-cream/50 rounded-xl border-2 border-varanasi-gold p-4 hover:shadow-xl transition-all duration-300"
                        >
                          <div className="flex gap-4">
                            {/* Avatar */}
                            <div className="flex-shrink-0">
                              <div className="w-16 h-16 bg-gradient-to-br from-varanasi-maroon to-varanasi-maroon-dark text-varanasi-gold rounded-xl flex items-center justify-center font-black shadow-lg text-xl">
                                {contact.name?.charAt(0).toUpperCase() || "?"}
                              </div>
                            </div>

                            {/* Content */}
                            <div className="flex-1 space-y-2">
                              <div className="flex items-start justify-between">
                                <div>
                                  <h3 className="font-black text-lg text-varanasi-maroon">
                                    {contact.name}
                                  </h3>
                                  <div className="flex items-center gap-2 mt-1">
                                    <span
                                      className={`text-xs font-bold px-2 py-1 rounded-full ${
                                        contact.status === "replied"
                                          ? "bg-green-100 text-green-700"
                                          : "bg-yellow-100 text-yellow-700"
                                      }`}
                                    >
                                      {contact.status.toUpperCase()}
                                    </span>
                                    {contact.createdAt && (
                                      <span className="text-xs text-gray-500 flex items-center">
                                        <Calendar size={12} className="mr-1" />
                                        {new Date(contact.createdAt).toLocaleDateString()}
                                      </span>
                                    )}
                                  </div>
                                </div>
                              </div>

                              <div className="grid grid-cols-2 gap-2 text-sm">
                                <div className="flex items-center space-x-2">
                                  <Mail size={14} className="text-varanasi-gold" />
                                  <span className="font-semibold text-varanasi-brown truncate">
                                    {contact.email}
                                  </span>
                                </div>
                                {contact.phone && (
                                  <div className="flex items-center space-x-2">
                                    <Phone size={14} className="text-varanasi-gold" />
                                    <span className="font-semibold text-varanasi-brown">
                                      {contact.phone}
                                    </span>
                                  </div>
                                )}
                                <div className="flex items-center space-x-2 col-span-2">
                                  <MessageCircle size={14} className="text-varanasi-gold" />
                                  <span className="font-semibold text-varanasi-brown capitalize">
                                    {contact.inquiry_type} Inquiry
                                  </span>
                                </div>
                              </div>

                              {contact.message && (
                                <div className="bg-white/80 rounded-lg p-3 border-2 border-varanasi-gold/30">
                                  <p className="text-sm text-varanasi-brown line-clamp-2">
                                    {contact.message}
                                  </p>
                                </div>
                              )}

                              <div className="flex gap-2 pt-2">
                                <button
                                  onClick={() =>
                                    updateStatus(
                                      cid,
                                      contact.status === "pending" ? "replied" : "pending"
                                    )
                                  }
                                  className="flex-1 p-2 bg-varanasi-maroon hover:bg-varanasi-maroon-dark text-varanasi-gold rounded-lg shadow-md transition-all duration-300 flex items-center justify-center gap-2 text-sm font-bold"
                                >
                                  {contact.status === "pending" ? (
                                    <CheckCircle size={16} />
                                  ) : (
                                    <Clock size={16} />
                                  )}
                                  <span>
                                    {contact.status === "pending" ? "Replied" : "Pending"}
                                  </span>
                                </button>
                                <button
                                  onClick={() => handleDeleteClick(cid)}
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

                {/* DESKTOP TABLE VIEW - Hidden on mobile and tablet */}
                <div className="hidden lg:block overflow-x-auto">
                  <table className="w-full border-collapse">
                    <thead>
                      <tr className="bg-gradient-to-r from-varanasi-maroon to-varanasi-maroon-dark text-varanasi-gold">
                        <th className="px-4 py-3 text-left font-black text-varanasi-gold text-sm">
                          Contact
                        </th>
                        <th className="px-4 py-3 text-left font-black text-varanasi-gold text-sm">
                          Email
                        </th>
                        <th className="px-4 py-3 text-left font-black text-varanasi-gold text-sm">
                          Phone
                        </th>
                        <th className="px-4 py-3 text-left font-black text-varanasi-gold text-sm">
                          Inquiry Type
                        </th>
                        <th className="px-4 py-3 text-left font-black text-varanasi-gold text-sm">
                          Message
                        </th>
                        <th className="px-4 py-3 text-left font-black text-varanasi-gold text-sm">
                          Status
                        </th>
                        <th className="px-4 py-3 text-left font-black text-varanasi-gold text-sm">
                          Date
                        </th>
                        <th className="px-4 py-3 text-center font-black text-varanasi-gold text-sm">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredContacts.map((contact: Contact, index: number) => {
                        const cid = contact.id ?? contact._id ?? `contact-${index}`;
                        return (
                          <tr
                            key={cid}
                            className="border-b border-varanasi-gold/30 hover:bg-varanasi-cream/50 transition-all duration-300 group/row"
                          >
                            {/* Contact */}
                            <td className="px-4 py-3">
                              <div className="flex items-center space-x-3">
                                <div className="w-10 h-10 bg-gradient-to-br from-varanasi-maroon to-varanasi-maroon-dark text-varanasi-gold rounded-lg flex items-center justify-center font-black shadow-md group-hover/row:scale-110 transition-transform duration-300">
                                  {contact.name?.charAt(0).toUpperCase() || "?"}
                                </div>
                                <span className="font-black text-sm text-varanasi-maroon whitespace-nowrap">
                                  {contact.name}
                                </span>
                              </div>
                            </td>

                            {/* Email */}
                            <td className="px-4 py-3">
                              <span className="text-sm text-varanasi-brown font-semibold">
                                {contact.email}
                              </span>
                            </td>

                            {/* Phone */}
                            <td className="px-4 py-3">
                              <span className="text-sm text-varanasi-brown font-semibold whitespace-nowrap">
                                {contact.phone || "-"}
                              </span>
                            </td>

                            {/* Inquiry Type */}
                            <td className="px-4 py-3">
                              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-bold bg-varanasi-gold/20 text-varanasi-maroon capitalize">
                                {contact.inquiry_type}
                              </span>
                            </td>

                            {/* Message */}
                            <td className="px-4 py-3">
                              <div className="max-w-xs">
                                <p className="text-xs text-varanasi-brown line-clamp-2">
                                  {contact.message}
                                </p>
                              </div>
                            </td>

                            {/* Status */}
                            <td className="px-4 py-3">
                              <span
                                className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold whitespace-nowrap ${
                                  contact.status === "replied"
                                    ? "bg-green-100 text-green-700"
                                    : "bg-yellow-100 text-yellow-700"
                                }`}
                              >
                                <div
                                  className={`w-2 h-2 rounded-full mr-2 ${
                                    contact.status === "replied"
                                      ? "bg-green-500"
                                      : "bg-yellow-500"
                                  }`}
                                ></div>
                                {contact.status.toUpperCase()}
                              </span>
                            </td>

                            {/* Date */}
                            <td className="px-4 py-3">
                              {contact.createdAt && (
                                <span className="text-xs text-varanasi-brown flex items-center whitespace-nowrap">
                                  <Calendar size={12} className="mr-1 text-varanasi-gold" />
                                  {new Date(contact.createdAt).toLocaleDateString(
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
                                  onClick={() =>
                                    updateStatus(
                                      cid,
                                      contact.status === "pending"
                                        ? "replied"
                                        : "pending"
                                    )
                                  }
                                  className="p-2 bg-varanasi-maroon hover:bg-varanasi-maroon-dark text-varanasi-gold rounded-lg shadow-md transform hover:scale-110 transition-all duration-300"
                                  title={
                                    contact.status === "pending"
                                      ? "Mark as Replied"
                                      : "Mark as Pending"
                                  }
                                >
                                  {contact.status === "pending" ? (
                                    <CheckCircle size={14} />
                                  ) : (
                                    <Clock size={14} />
                                  )}
                                </button>
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

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent className="bg-white border-2 border-varanasi-gold">
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center text-xl font-black text-varanasi-maroon">
              <AlertTriangle className="mr-2 text-red-600" size={24} />
              Delete Contact?
            </AlertDialogTitle>
            <AlertDialogDescription className="text-varanasi-brown text-base">
              Are you sure you want to delete this contact? This action cannot be
              undone.
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