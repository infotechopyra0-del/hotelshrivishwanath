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
  phone: string;
  company?: string;
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
    const matchesCompany = contact.company?.toLowerCase()?.includes(q) ?? false;
    const matchesPhone = contact.phone?.toString()?.includes(q) ?? false;
    const matchesSearch = matchesName || matchesEmail || matchesCompany || matchesPhone;

    if (filterStatus === "all") return matchesSearch;
    return matchesSearch && contact.status === filterStatus;
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
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-amber-100">
      {/* Fixed Header */}
      <header className="fixed top-0 left-0 lg:left-72 right-0 z-50 bg-white/95 backdrop-blur-xl shadow-xl border-b-4 border-orange-600">
        <div className="px-4 sm:px-6 lg:px-8 py-5">
          <div className="flex items-center justify-between">
            <div className="ml-12 lg:ml-0">
              <h1 className="text-3xl sm:text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-orange-600 to-orange-800 flex items-center">
                Contact Messages
                <Users className="ml-2 text-orange-600" size={28} />
              </h1>
              <p className="text-sm text-gray-600 mt-1 font-semibold">
                Manage all customer inquiries 📬
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
                <MessageCircle className="mr-2 text-orange-600" size={24} />
                Contact Messages
                <Sparkles className="ml-2 text-amber-500" size={20} />
              </h2>

              <div className="flex flex-wrap gap-2 sm:gap-3 w-full sm:w-auto">
                <button
                  onClick={() => fetchContacts({ forceToast: true })}
                  className="flex-1 sm:flex-none bg-gradient-to-r from-orange-600 to-orange-700 text-white font-bold px-4 sm:px-6 py-2 sm:py-3 rounded-xl shadow-lg hover:scale-105 transition-all duration-300 flex items-center justify-center space-x-2 text-sm sm:text-base"
                >
                  <Zap size={16} className="sm:w-[18px] sm:h-[18px]" />
                  <span>Refresh</span>
                </button>
              </div>
            </div>

            {loading && (
              <div className="text-center py-12">
                <div className="inline-block animate-spin rounded-full h-12 w-12 sm:h-16 sm:w-16 border-4 border-orange-600 border-t-transparent"></div>
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
                        className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-xl border-2 border-amber-200 overflow-hidden shadow-md hover:shadow-xl transition-all duration-300"
                      >
                        {/* Mobile Card Header */}
                        <div className="bg-gradient-to-r from-orange-600 to-orange-700 p-4">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-3">
                              <div className="w-10 h-10 bg-white text-orange-600 rounded-lg flex items-center justify-center font-black shadow-lg">
                                {contact.name?.charAt(0).toUpperCase() || "?"}
                              </div>
                              <div>
                                <h3 className="font-black text-base text-white">
                                  {contact.name}
                                </h3>
                                {contact.createdAt && (
                                  <p className="text-xs text-orange-100 flex items-center mt-1">
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
                              <Mail size={14} className="text-orange-600 flex-shrink-0" />
                              <span className="font-semibold text-gray-700 break-all">
                                {contact.email}
                              </span>
                            </div>
                            <div className="flex items-center space-x-2 text-sm">
                              <Phone size={14} className="text-orange-600 flex-shrink-0" />
                              <span className="font-semibold text-gray-700">
                                {contact.phone}
                              </span>
                            </div>
                            {contact.company && (
                              <div className="flex items-center space-x-2 text-sm">
                                <Building2 size={14} className="text-orange-600 flex-shrink-0" />
                                <span className="font-semibold text-gray-700">
                                  {contact.company}
                                </span>
                              </div>
                            )}
                          </div>

                          {/* Message */}
                          {contact.message && (
                            <div className="bg-white/80 rounded-lg p-3 border-2 border-amber-200">
                              <p className="text-xs font-medium text-gray-700 line-clamp-3">
                                {contact.message}
                              </p>
                            </div>
                          )}

                          {/* Actions */}
                          <div className="flex gap-2 pt-2 border-t border-amber-200">
                            <button
                              onClick={() =>
                                updateStatus(
                                  cid,
                                  contact.status === "pending" ? "replied" : "pending"
                                )
                              }
                              className="flex-1 flex items-center justify-center space-x-2 bg-orange-600 hover:bg-orange-700 text-white font-bold px-4 py-2 rounded-lg shadow-md transition-all duration-300"
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
                          className="bg-gradient-to-r from-amber-50 to-orange-50 rounded-xl border-2 border-amber-200 p-4 hover:shadow-xl transition-all duration-300"
                        >
                          <div className="flex gap-4">
                            {/* Avatar */}
                            <div className="flex-shrink-0">
                              <div className="w-16 h-16 bg-gradient-to-br from-orange-600 to-orange-800 text-white rounded-xl flex items-center justify-center font-black shadow-lg text-xl">
                                {contact.name?.charAt(0).toUpperCase() || "?"}
                              </div>
                            </div>

                            {/* Content */}
                            <div className="flex-1 space-y-2">
                              <div className="flex items-start justify-between">
                                <div>
                                  <h3 className="font-black text-lg text-gray-900">
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
                                  <Mail size={14} className="text-orange-600" />
                                  <span className="font-semibold text-gray-700 truncate">
                                    {contact.email}
                                  </span>
                                </div>
                                <div className="flex items-center space-x-2">
                                  <Phone size={14} className="text-orange-600" />
                                  <span className="font-semibold text-gray-700">
                                    {contact.phone}
                                  </span>
                                </div>
                                {contact.company && (
                                  <div className="flex items-center space-x-2 col-span-2">
                                    <Building2 size={14} className="text-orange-600" />
                                    <span className="font-semibold text-gray-700">
                                      {contact.company}
                                    </span>
                                  </div>
                                )}
                              </div>

                              {contact.message && (
                                <div className="bg-white/80 rounded-lg p-3 border-2 border-amber-200">
                                  <p className="text-sm text-gray-700 line-clamp-2">
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
                                  className="flex-1 p-2 bg-orange-600 hover:bg-orange-700 text-white rounded-lg shadow-md transition-all duration-300 flex items-center justify-center gap-2 text-sm font-bold"
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
                      <tr className="bg-gradient-to-r from-orange-100 to-amber-100 border-b-4 border-orange-600">
                        <th className="px-4 py-3 text-left font-black text-gray-900 text-sm">
                          Contact
                        </th>
                        <th className="px-4 py-3 text-left font-black text-gray-900 text-sm">
                          Email
                        </th>
                        <th className="px-4 py-3 text-left font-black text-gray-900 text-sm">
                          Phone
                        </th>
                        <th className="px-4 py-3 text-left font-black text-gray-900 text-sm">
                          Company
                        </th>
                        <th className="px-4 py-3 text-left font-black text-gray-900 text-sm">
                          Message
                        </th>
                        <th className="px-4 py-3 text-left font-black text-gray-900 text-sm">
                          Status
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
                      {filteredContacts.map((contact: Contact, index: number) => {
                        const cid = contact.id ?? contact._id ?? `contact-${index}`;
                        return (
                          <tr
                            key={cid}
                            className="border-b border-amber-200 hover:bg-gradient-to-r hover:from-amber-50 hover:to-orange-50 transition-all duration-300 group/row"
                          >
                            {/* Contact */}
                            <td className="px-4 py-3">
                              <div className="flex items-center space-x-3">
                                <div className="w-10 h-10 bg-gradient-to-br from-orange-600 to-orange-800 text-white rounded-lg flex items-center justify-center font-black shadow-md group-hover/row:scale-110 transition-transform duration-300">
                                  {contact.name?.charAt(0).toUpperCase() || "?"}
                                </div>
                                <span className="font-black text-sm text-gray-900 whitespace-nowrap">
                                  {contact.name}
                                </span>
                              </div>
                            </td>

                            {/* Email */}
                            <td className="px-4 py-3">
                              <span className="text-sm text-gray-700 font-semibold">
                                {contact.email}
                              </span>
                            </td>

                            {/* Phone */}
                            <td className="px-4 py-3">
                              <span className="text-sm text-gray-700 font-semibold whitespace-nowrap">
                                {contact.phone}
                              </span>
                            </td>

                            {/* Company */}
                            <td className="px-4 py-3">
                              <span className="text-sm text-gray-700 font-semibold">
                                {contact.company || "-"}
                              </span>
                            </td>

                            {/* Message */}
                            <td className="px-4 py-3">
                              <div className="max-w-xs">
                                <p className="text-xs text-gray-600 line-clamp-2">
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
                                <span className="text-xs text-gray-600 flex items-center whitespace-nowrap">
                                  <Calendar size={12} className="mr-1 text-orange-600" />
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
                                  className="p-2 bg-orange-600 hover:bg-orange-700 text-white rounded-lg shadow-md transform hover:scale-110 transition-all duration-300"
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
        <AlertDialogContent className="bg-white border-2 border-orange-200">
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center text-xl font-black text-gray-900">
              <AlertTriangle className="mr-2 text-red-600" size={24} />
              Delete Contact?
            </AlertDialogTitle>
            <AlertDialogDescription className="text-gray-600 text-base">
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