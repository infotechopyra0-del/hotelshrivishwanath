"use client";

import React, { useState, useEffect } from "react";
import { toast } from "sonner";
import {
  MessageSquareQuote,
  Sparkles,
  Star,
  Zap,
  Trash2,
  Calendar,
  AlertTriangle,
  Plus,
  Edit,
  X,
  Save,
  Search,
  Eye,
  EyeOff,
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

interface FAQ {
  _id?: string;
  id?: string;
  question: string;
  answer: string;
  isActive: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export default function AdminFAQPage() {
  const [faqs, setFaqs] = useState<FAQ[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [faqToDelete, setFaqToDelete] = useState<string | null>(null);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [currentFAQ, setCurrentFAQ] = useState<Partial<FAQ>>({
    question: "",
    answer: "",
    isActive: true,
  });
  const [saveProgress, setSaveProgress] = useState(false);

  useEffect(() => {
    fetchFAQs();
  }, []);

  const fetchFAQs = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/faq", {
        credentials: "include",
        headers: { Accept: "application/json" },
      });
      if (!res.ok) throw new Error("Failed to fetch FAQs");
      const data: FAQ[] = await res.json();
      setFaqs(data);
    } catch (err) {
      console.error(err);
      toast.error("Failed to load FAQs");
    } finally {
      setLoading(false);
    }
  };

  const handleEditClick = (faq: FAQ) => {
    setCurrentFAQ({
      _id: faq._id || faq.id,
      question: faq.question,
      answer: faq.answer,
      isActive: faq.isActive,
    });
    setEditDialogOpen(true);
  };

  const handleAddClick = () => {
    setCurrentFAQ({
      question: "",
      answer: "",
      isActive: true,
    });
    setAddDialogOpen(true);
  };

  const handleSaveFAQ = async () => {
    if (!currentFAQ.question?.trim() || !currentFAQ.answer?.trim()) {
      toast.error("Please fill all required fields");
      return;
    }
    setSaveProgress(true);

    try {
      const isEdit = !!(currentFAQ._id || currentFAQ.id);
      const url = isEdit
        ? `/api/admin/faq/${currentFAQ._id ?? currentFAQ.id}`
        : "/api/admin/faq";
      const method = isEdit ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(currentFAQ),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.error || data.message || "Failed to save FAQ");
      }

      toast.success(isEdit ? "FAQ updated successfully!" : "FAQ created successfully!");
      setEditDialogOpen(false);
      setAddDialogOpen(false);
      await fetchFAQs();
    } catch (err: any) {
      toast.error(err.message || "Failed to save FAQ");
    } finally {
      setSaveProgress(false);
    }
  };

  const handleDeleteClick = (faqId: string) => {
    setFaqToDelete(faqId);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!faqToDelete) return;

    try {
      const res = await fetch(`/api/admin/faq/${faqToDelete}`, {
        method: "DELETE",
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.error || "Failed to delete FAQ");
      }

      toast.success("FAQ deleted successfully!");
      setDeleteDialogOpen(false);
      setFaqToDelete(null);
      await fetchFAQs();
    } catch (err: any) {
      toast.error(err.message || "Failed to delete FAQ");
    }
  };

  const filteredFAQs = faqs.filter((faq) => {
    const matchesSearch = 
      faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      faq.answer.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = 
      filterStatus === "all" || 
      (filterStatus === "active" && faq.isActive) ||
      (filterStatus === "inactive" && !faq.isActive);
    
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="min-h-screen bg-varanasi-cream">
      {/* Fixed Header */}
      <header className="fixed top-0 left-0 lg:left-72 right-0 z-50 bg-white/95 backdrop-blur-xl shadow-xl border-b-4 border-varanasi-gold">
        <div className="px-4 sm:px-6 lg:px-8 py-5">
          <div className="flex items-center justify-between">
            <div className="ml-12 lg:ml-0">
              <h1 className="text-3xl sm:text-4xl font-black text-varanasi-maroon flex items-center">
                FAQ Management
                <MessageSquareQuote className="ml-2 text-varanasi-gold" size={28} />
              </h1>
              <p className="text-sm text-varanasi-brown mt-1 font-semibold">
                Manage your frequently asked questions 💬
              </p>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="mt-28 p-4 sm:p-6 lg:p-8">
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl p-4 sm:p-6 border-2 border-varanasi-gold relative overflow-hidden group">
          <div className="absolute top-0 left-0 opacity-5 group-hover:opacity-10 transition-opacity duration-300">
            <Sparkles size={200} className="text-varanasi-gold" />
          </div>

          <div className="relative z-10">
            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 gap-4">
              <h2 className="text-xl sm:text-2xl font-black text-varanasi-maroon flex items-center">
                <MessageSquareQuote className="mr-2 text-varanasi-gold" size={24} />
                FAQ List
                <Sparkles className="ml-2 text-varanasi-gold" size={20} />
              </h2>

              <div className="flex flex-wrap gap-2 sm:gap-3 w-full sm:w-auto">
                <button
                  onClick={handleAddClick}
                  className="flex-1 sm:flex-none bg-varanasi-maroon text-varanasi-gold font-bold px-4 sm:px-6 py-2 sm:py-3 rounded-xl shadow-lg hover:scale-105 transition-all duration-300 flex items-center justify-center space-x-2 text-sm sm:text-base border border-varanasi-gold"
                >
                  <Plus size={16} className="sm:w-[18px] sm:h-[18px]" />
                  <span>Add FAQ</span>
                </button>

                <button
                  onClick={fetchFAQs}
                  className="flex-1 sm:flex-none bg-varanasi-maroon text-varanasi-gold font-bold px-4 sm:px-6 py-2 sm:py-3 rounded-xl shadow-lg hover:scale-105 transition-all duration-300 flex items-center justify-center space-x-2 text-sm sm:text-base border border-varanasi-gold"
                >
                  <Zap size={16} className="sm:w-[18px] sm:h-[18px]" />
                  <span>Refresh</span>
                </button>
              </div>
            </div>

            {/* Filters */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-varanasi-gold" size={18} />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search questions or answers..."
                  className="w-full pl-10 pr-4 py-3 rounded-xl border-2 border-varanasi-gold focus:border-varanasi-maroon focus:outline-none font-semibold text-sm bg-varanasi-cream text-varanasi-maroon"
                />
              </div>
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border-2 border-varanasi-gold focus:border-varanasi-maroon focus:outline-none font-semibold text-sm bg-varanasi-cream text-varanasi-maroon"
              >
                <option value="all">All Status</option>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>

            {/* Loading State */}
            {loading && (
              <div className="text-center py-12">
                <div className="inline-block animate-spin rounded-full h-12 w-12 sm:h-16 sm:w-16 border-4 border-varanasi-gold border-t-transparent"></div>
                <p className="mt-4 text-gray-600 font-bold text-sm sm:text-base">
                  Loading FAQs...
                </p>
              </div>
            )}

            {/* Empty State */}
            {!loading && filteredFAQs.length === 0 && (
              <div className="text-center py-12">
                <div className="w-20 h-20 sm:w-24 sm:h-24 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full flex items-center justify-center text-3xl sm:text-4xl mx-auto mb-4">
                  ❓
                </div>
                <p className="text-lg sm:text-xl font-black text-gray-900 mb-2">
                  No FAQs Found
                </p>
                <p className="text-sm sm:text-base text-gray-600 font-semibold px-4">
                  {searchQuery
                    ? "Try adjusting your search criteria"
                    : 'Click "Add FAQ" to create your first FAQ'}
                </p>
              </div>
            )}

            {/* Table */}
            {!loading && filteredFAQs.length > 0 && (
              <div className="overflow-x-auto">
                <table className="w-full bg-white rounded-xl border-2 border-varanasi-gold overflow-hidden shadow-lg">
                  <thead>
                    <tr className="bg-gradient-to-r from-varanasi-maroon to-varanasi-maroon-dark text-varanasi-gold">
                      <th className="px-4 py-4 text-left font-black text-sm">Question</th>
                      <th className="px-4 py-4 text-center font-black text-sm">Status</th>
                      <th className="px-4 py-4 text-left font-black text-sm">Created</th>
                      <th className="px-4 py-4 text-center font-black text-sm">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-varanasi-gold/30">
                    {filteredFAQs.map((faq: FAQ, index: number) => {
                      const faqId = faq.id ?? faq._id ?? `faq-${index}`;
                      return (
                        <tr 
                          key={faqId} 
                          className="hover:bg-varanasi-cream/50 transition-colors duration-200"
                        >
                          <td className="px-4 py-4">
                            <div className="max-w-sm">
                              <p className="font-bold text-sm text-varanasi-maroon truncate" title={faq.question}>
                                {faq.question}
                              </p>
                              <p className="text-xs text-gray-500 mt-1 line-clamp-2" title={faq.answer}>
                                {faq.answer.length > 100 ? faq.answer.substring(0, 100) + '...' : faq.answer}
                              </p>
                            </div>
                          </td>
                          <td className="px-4 py-4 text-center">
                            <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-bold ${
                              faq.isActive 
                                ? 'bg-green-100 text-green-800' 
                                : 'bg-red-100 text-red-800'
                            }`}>
                              {faq.isActive ? (
                                <><Eye size={12} className="mr-1" /> Active</>
                              ) : (
                                <><EyeOff size={12} className="mr-1" /> Inactive</>
                              )}
                            </span>
                          </td>
                          <td className="px-4 py-4">
                            {faq.createdAt && (
                              <div className="text-xs text-varanasi-brown flex items-center">
                                <Calendar size={12} className="mr-1 text-varanasi-gold" />
                                {new Date(faq.createdAt).toLocaleDateString()}
                              </div>
                            )}
                          </td>
                          <td className="px-4 py-4">
                            <div className="flex items-center justify-center gap-2">
                              <button
                                onClick={() => handleEditClick(faq)}
                                className="flex items-center justify-center bg-varanasi-maroon hover:bg-varanasi-maroon-dark text-varanasi-gold font-bold px-3 py-2 rounded-lg shadow-md transition-all duration-300"
                                title="Edit FAQ"
                              >
                                <Edit size={14} />
                              </button>
                              <button
                                onClick={() => handleDeleteClick(faqId)}
                                className="flex items-center justify-center bg-red-600 hover:bg-red-700 text-white font-bold px-3 py-2 rounded-lg shadow-md transition-all duration-300"
                                title="Delete FAQ"
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
            )}
          </div>
        </div>
      </div>

      {/* Add/Edit Dialog */}
      <AlertDialog
        open={editDialogOpen || addDialogOpen}
        onOpenChange={(open) => {
          if (!open) {
            setEditDialogOpen(false);
            setAddDialogOpen(false);
            setSaveProgress(false);
            setCurrentFAQ({
              question: "",
              answer: "",
              isActive: true,
            });
          }
        }}
      >
        <AlertDialogContent className="bg-white border-2 border-varanasi-gold max-w-2xl max-h-[90vh] overflow-y-auto">
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center text-2xl font-black text-varanasi-maroon">
              {editDialogOpen ? (
                <Edit className="mr-2 text-varanasi-gold" size={24} />
              ) : (
                <Plus className="mr-2 text-varanasi-gold" size={24} />
              )}
              {editDialogOpen ? "Edit FAQ" : "Add New FAQ"}
            </AlertDialogTitle>
            <AlertDialogDescription className="text-varanasi-brown">
              {editDialogOpen
                ? "Update the FAQ information below"
                : "Fill in the details to create a new FAQ"}
            </AlertDialogDescription>
          </AlertDialogHeader>

          <div className="space-y-4 py-4">
            <div>
              <label className="block text-sm font-bold text-varanasi-maroon mb-2">
                Question *
              </label>
              <input
                type="text"
                value={currentFAQ.question || ""}
                onChange={(e) =>
                  setCurrentFAQ({ ...currentFAQ, question: e.target.value })
                }
                placeholder="Enter the question"
                className="w-full px-4 py-3 rounded-xl border-2 border-varanasi-gold focus:border-varanasi-maroon focus:outline-none font-semibold text-sm bg-varanasi-cream text-varanasi-maroon"
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-varanasi-maroon mb-2">
                Answer *
              </label>
              <textarea
                value={currentFAQ.answer || ""}
                onChange={(e) =>
                  setCurrentFAQ({ ...currentFAQ, answer: e.target.value })
                }
                placeholder="Enter the answer"
                rows={4}
                className="w-full px-4 py-3 rounded-xl border-2 border-varanasi-gold focus:border-varanasi-maroon focus:outline-none font-semibold text-sm bg-varanasi-cream text-varanasi-maroon resize-none"
              />
            </div>

            <div className="flex items-center space-x-3">
              <input
                type="checkbox"
                checked={currentFAQ.isActive !== false}
                onChange={(e) =>
                  setCurrentFAQ({
                    ...currentFAQ,
                    isActive: e.target.checked,
                  })
                }
                className="w-5 h-5 accent-varanasi-gold"
              />
              <label className="text-sm font-bold text-varanasi-maroon">
                Mark as Active
              </label>
            </div>
          </div>

          <AlertDialogFooter>
            <AlertDialogCancel
              onClick={() => {
                setEditDialogOpen(false);
                setAddDialogOpen(false);
                setSaveProgress(false);
                setCurrentFAQ({
                  question: "",
                  answer: "",
                  isActive: true,
                });
              }}
              className="bg-gray-100 hover:bg-gray-200 text-gray-900 font-bold px-6 py-2 rounded-lg"
            >
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleSaveFAQ}
              disabled={saveProgress}
              className="bg-varanasi-maroon hover:bg-varanasi-maroon-dark text-varanasi-gold font-bold px-6 py-2 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Save size={16} className="mr-2" />
              {saveProgress ? "Saving..." : "Save FAQ"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Delete Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent className="bg-white border-2 border-varanasi-gold">
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center text-xl font-black text-varanasi-maroon">
              <AlertTriangle className="mr-2 text-red-600" size={24} />
              Delete FAQ?
            </AlertDialogTitle>
            <AlertDialogDescription className="text-varanasi-brown text-base">
              Are you sure you want to delete this FAQ? This action cannot be
              undone.
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