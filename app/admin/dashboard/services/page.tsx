"use client";

import React, { useState, useEffect } from "react";
import {
  Briefcase, Sparkles, Zap, Trash2, Calendar, AlertTriangle,
  Plus, Edit, X, Save, Upload, Layers, Settings, Package, CheckCircle
} from "lucide-react";
import { toast } from "sonner";
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
} from "@/components/ui/alert-dialog";

type ServiceType = 'service' | 'software' | 'additional';

interface Service {
  _id?: string;
  id?: string;
  title: string;
  description: string;
  image: string;
  category: string;
  isActive: boolean;
  points?: string[]; // Only for software services
  createdAt?: string;
  updatedAt?: string;
}

const SERVICE_TYPES = [
  { value: 'service', label: 'Main Services', icon: Briefcase },
  { value: 'software', label: 'Software Services', icon: Layers },
  { value: 'additional', label: 'Additional Services', icon: Package }
];

const categories = [
  "Web Development", "Mobile App", "UI/UX Design", "E-commerce",
  "Digital Marketing", "Software Development", "Branding", "SEO",
  "Custom Software", "Other"
];

export default function AdminServicesPage() {
  const [activeTab, setActiveTab] = useState<ServiceType>('service');
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterCategory, setFilterCategory] = useState("all");
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [serviceToDelete, setServiceToDelete] = useState<string | null>(null);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [currentService, setCurrentService] = useState<Partial<Service>>({});
  const [pointInput, setPointInput] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);

  useEffect(() => {
    fetchServices();
  }, [activeTab]);

  const fetchServices = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/services/${activeTab}`);
      if (!res.ok) throw new Error("Failed to fetch services");
      const data: Service[] = await res.json();
      setServices(data);
      toast.success(`Services loaded! 🎯`);
    } catch (err) {
      toast.error("Failed to load services");
    } finally {
      setLoading(false);
    }
  };

  const uploadImage = async (file: File): Promise<string> => {
    const formData = new FormData();
    formData.append("image", file);
    const res = await fetch("/api/admin/upload", { method: "POST", body: formData });
    if (!res.ok) throw new Error("Upload failed");
    const data = await res.json();
    if (!data?.url) throw new Error("Upload did not return a URL");
    return data.url;
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) return toast.error("Image must be <5MB");
    if (!file.type.startsWith("image/")) return toast.error("Invalid image");
    setImageFile(file);
    const reader = new FileReader();
    reader.onloadend = () => setCurrentService({ ...currentService, image: reader.result as string });
    reader.readAsDataURL(file);
  };

  const handleSave = async () => {
    if (!currentService.title || !currentService.description) {
      return toast.error('Fill required fields');
    }

    if (activeTab === 'software' && (!currentService.points || currentService.points.length === 0)) {
      return toast.error('Add at least one point for software service');
    }

    try {
      let imageUrl = currentService.image;

      if (imageFile) {
        toast.info('Uploading image...');
        imageUrl = await uploadImage(imageFile);
      } else if (!imageUrl) {
        return toast.error("Please select an image");
      }

      const id = currentService._id || currentService.id;
      const isEdit = !!id;
      const url = isEdit
        ? `/api/admin/services/${activeTab}/${id}`
        : `/api/admin/services/${activeTab}`;
      const method = isEdit ? 'PUT' : 'POST';

      const payload: any = {
        title: currentService.title.trim(),
        description: currentService.description.trim(),
        image: imageUrl,
        category: currentService.category || 'Other',
        isActive: currentService.isActive ?? true,
      };

      // Add points only for software services
      if (activeTab === 'software') {
        payload.points = currentService.points || [];
      }

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Failed to save');
      }

      setServices((prev) =>
        isEdit
          ? prev.map((s) => (s._id === data.service._id ? data.service : s))
          : [data.service, ...prev]
      );

      toast.success(isEdit ? 'Updated! ✅' : 'Added! 🎉');
      setEditDialogOpen(false);
      setAddDialogOpen(false);
      setImageFile(null);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Failed to save');
    }
  };

  const handleDeleteConfirm = async () => {
    if (!serviceToDelete) return;
    try {
      const res = await fetch(`/api/admin/services/${activeTab}/${serviceToDelete}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed");
      setServices((prev) => prev.filter((s) => (s._id ?? s.id) !== serviceToDelete));
      toast.success("Deleted! 🗑️");
    } catch (err) {
      toast.error("Failed to delete");
    } finally {
      setDeleteDialogOpen(false);
      setServiceToDelete(null);
    }
  };

  const addPoint = () => {
    if (!pointInput.trim()) return;
    setCurrentService({
      ...currentService,
      points: [...(currentService.points || []), pointInput.trim()],
    });
    setPointInput("");
  };

  const removePoint = (point: string) => {
    setCurrentService({
      ...currentService,
      points: (currentService.points || []).filter((p) => p !== point),
    });
  };

  const handleAddClick = () => {
    setCurrentService({
      title: "",
      description: "",
      image: "",
      category: "Other",
      isActive: true,
      ...(activeTab === 'software' && { points: [] })
    });
    setImageFile(null);
    setAddDialogOpen(true);
  };

  const handleEditClick = (service: Service) => {
    setCurrentService(service);
    setImageFile(null);
    setEditDialogOpen(true);
  };

  const filteredServices = services.filter((s) => 
    filterCategory === "all" ? true : s.category === filterCategory
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-amber-100">
      <header className="fixed top-0 left-0 lg:left-72 right-0 z-50 bg-white/95 backdrop-blur-xl shadow-xl border-b-4 border-orange-600">
        <div className="px-4 sm:px-6 lg:px-8 py-5">
          <div className="flex items-center justify-between">
            <div className="ml-12 lg:ml-0">
              <h1 className="text-3xl sm:text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-orange-600 to-orange-800 flex items-center">
                Manage Services
                <Settings className="ml-2 text-orange-600" size={28} />
              </h1>
              <p className="text-sm text-gray-600 mt-1 font-semibold">Manage all service categories 🛠️</p>
            </div>
          </div>
        </div>
      </header>

      <div className="pt-28 p-4 sm:p-6 lg:p-8">
        {/* Service Type Tabs */}
        <div className="mb-6 flex flex-wrap gap-3 sm:mt-28">
          {SERVICE_TYPES.map((type) => {
            const Icon = type.icon;
            return (
              <button
                key={type.value}
                onClick={() => setActiveTab(type.value as ServiceType)}
                className={`flex items-center space-x-2 px-6 py-3 rounded-xl font-bold transition-all duration-300 ${
                  activeTab === type.value
                    ? 'bg-orange-600 text-white shadow-lg scale-105'
                    : 'bg-white text-gray-700 border-2 border-amber-200 hover:border-orange-600'
                }`}
              >
                <Icon size={18} />
                <span>{type.label}</span>
              </button>
            );
          })}
        </div>

        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl p-4 sm:p-6 border-2 border-amber-200 relative overflow-hidden group">
          <div className="absolute top-0 left-0 opacity-5 group-hover:opacity-10 transition-opacity duration-300">
            <Sparkles size={200} className="text-orange-600" />
          </div>

          <div className="relative z-10">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 gap-4">
              <h2 className="text-xl sm:text-2xl font-black text-orange-900 flex items-center">
                {SERVICE_TYPES.find(t => t.value === activeTab)?.label}
                <Sparkles className="ml-2 text-amber-500" size={20} />
              </h2>
              <div className="flex flex-wrap gap-2 sm:gap-3 w-full sm:w-auto">
                <button
                  onClick={handleAddClick}
                  className="flex-1 sm:flex-none bg-gradient-to-r from-green-600 to-green-700 text-white font-bold px-4 sm:px-6 py-2 sm:py-3 rounded-xl shadow-lg hover:scale-105 transition-all duration-300 flex items-center justify-center space-x-2"
                >
                  <Plus size={16} />
                  <span>Add</span>
                </button>
                <button
                  onClick={fetchServices}
                  className="flex-1 sm:flex-none bg-gradient-to-r from-orange-600 to-orange-700 text-white font-bold px-4 sm:px-6 py-2 sm:py-3 rounded-xl shadow-lg hover:scale-105 transition-all duration-300 flex items-center justify-center space-x-2"
                >
                  <Zap size={16} />
                  <span>Refresh</span>
                </button>
              </div>
            </div>

            {/* Category Filter */}
            <div className="mb-6">
              <select
                value={filterCategory}
                onChange={(e) => setFilterCategory(e.target.value)}
                className="w-full sm:w-auto px-4 py-2 border-2 border-amber-200 rounded-lg font-bold text-gray-700 focus:outline-none focus:border-orange-600"
              >
                <option value="all">All Categories</option>
                {categories.map((cat) => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>

            {loading && (
              <div className="text-center py-12">
                <div className="inline-block animate-spin rounded-full h-16 w-16 border-4 border-orange-600 border-t-transparent"></div>
                <p className="mt-4 text-gray-600 font-bold">Loading services...</p>
              </div>
            )}

            {!loading && filteredServices.length === 0 && (
              <div className="text-center py-12">
                <div className="w-24 h-24 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full flex items-center justify-center text-4xl mx-auto mb-4">
                  🛠️
                </div>
                <p className="text-xl font-black text-gray-900 mb-2">No Services Found</p>
                <p className="text-gray-600 font-semibold">Click "Add" to create your first service</p>
              </div>
            )}

            {/* Desktop Table View */}
            {!loading && filteredServices.length > 0 && (
              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="bg-gradient-to-r from-orange-100 to-amber-100 border-b-4 border-orange-600">
                      <th className="px-4 py-3 text-left font-black text-gray-900">Image</th>
                      <th className="px-4 py-3 text-left font-black text-gray-900">Service Details</th>
                      <th className="px-4 py-3 text-left font-black text-gray-900">Category</th>
                      <th className="px-4 py-3 text-left font-black text-gray-900">Status</th>
                      <th className="px-4 py-3 text-left font-black text-gray-900">Date</th>
                      <th className="px-4 py-3 text-center font-black text-gray-900">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredServices.map((service, index) => {
                      const sid = service.id ?? service._id ?? `service-${index}`;
                      return (
                        <tr
                          key={sid}
                          className="border-b border-amber-200 hover:bg-gradient-to-r hover:from-amber-50 hover:to-orange-50 transition-all duration-300"
                        >
                          <td className="px-4 py-3">
                            <div className="relative w-20 h-14 rounded-lg overflow-hidden shadow-md">
                              <img
                                src={service.image}
                                alt={service.title}
                                className="w-full h-full object-cover"
                              />
                            </div>
                          </td>

                          <td className="px-4 py-3">
                            <div className="max-w-xs">
                              <h3 className="font-black text-gray-900 text-sm mb-1">{service.title}</h3>
                              <p className="text-xs text-gray-600 line-clamp-2">{service.description}</p>
                            </div>
                          </td>

                          <td className="px-4 py-3">
                            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-orange-100 text-orange-700">
                              {service.category}
                            </span>
                          </td>

                          <td className="px-4 py-3">
                            <span
                              className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold ${
                                service.isActive
                                  ? "bg-green-100 text-green-700"
                                  : "bg-gray-100 text-gray-700"
                              }`}
                            >
                              <div className={`w-2 h-2 rounded-full mr-2 ${service.isActive ? "bg-green-500" : "bg-gray-500"}`}></div>
                              {service.isActive ? "ACTIVE" : "INACTIVE"}
                            </span>
                          </td>

                          <td className="px-4 py-3">
                            {service.createdAt && (
                              <span className="text-xs text-gray-600 flex items-center">
                                <Calendar size={12} className="mr-1 text-orange-600" />
                                {new Date(service.createdAt).toLocaleDateString()}
                              </span>
                            )}
                          </td>

                          <td className="px-4 py-3">
                            <div className="flex items-center justify-center gap-2">
                              <button
                                onClick={() => handleEditClick(service)}
                                className="p-2 bg-orange-600 hover:bg-orange-700 text-white rounded-lg shadow-md transform hover:scale-110 transition-all duration-300"
                              >
                                <Edit size={14} />
                              </button>
                              <button
                                onClick={() => { setServiceToDelete(sid); setDeleteDialogOpen(true); }}
                                className="p-2 bg-red-600 hover:bg-red-700 text-white rounded-lg shadow-md transform hover:scale-110 transition-all duration-300"
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
      <AlertDialog open={addDialogOpen || editDialogOpen} onOpenChange={(open) => {
        setAddDialogOpen(open);
        setEditDialogOpen(open);
      }}>
        <AlertDialogContent className="bg-white border-2 border-orange-200 max-w-3xl max-h-[90vh] overflow-y-auto">
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center text-2xl font-black text-gray-900">
              {editDialogOpen ? <Edit className="mr-2 text-orange-600" size={24} /> : <Plus className="mr-2 text-green-600" size={24} />}
              {editDialogOpen ? "Edit Service" : "Add New Service"}
            </AlertDialogTitle>
          </AlertDialogHeader>

          <div className="space-y-4 py-4">
            {/* Title */}
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Service Title *</label>
              <input
                type="text"
                value={currentService.title || ""}
                onChange={(e) => setCurrentService({ ...currentService, title: e.target.value })}
                className="w-full px-4 py-2 border-2 border-amber-200 rounded-lg focus:outline-none focus:border-orange-600"
                placeholder="Enter service title"
                maxLength={activeTab === 'service' ? 100 : 150}
              />
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Description *</label>
              <textarea
                value={currentService.description || ""}
                onChange={(e) => setCurrentService({ ...currentService, description: e.target.value })}
                rows={4}
                className="w-full px-4 py-2 border-2 border-amber-200 rounded-lg focus:outline-none focus:border-orange-600"
                placeholder="Enter service description"
                maxLength={1000}
              />
            </div>

            {/* Category */}
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Category *</label>
              <select
                value={currentService.category || "Other"}
                onChange={(e) => setCurrentService({ ...currentService, category: e.target.value })}
                className="w-full px-4 py-2 border-2 border-amber-200 rounded-lg focus:outline-none focus:border-orange-600"
              >
                {categories.map((cat) => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>

            {/* Image Upload */}
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Service Image *</label>
              <div className="flex flex-col gap-3">
                {currentService.image && (
                  <div className="relative w-full h-48 rounded-lg overflow-hidden border-2 border-amber-200">
                    <img src={currentService.image} alt="Preview" className="w-full h-full object-cover" />
                  </div>
                )}
                <label className="flex items-center justify-center px-4 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg cursor-pointer hover:from-blue-700 hover:to-blue-800 transition-all duration-300 font-bold">
                  <Upload size={18} className="mr-2" />
                  {imageFile ? imageFile.name : "Choose Image"}
                  <input type="file" accept="image/*" onChange={handleImageChange} className="hidden" />
                </label>
                <p className="text-xs text-gray-500">Maximum file size: 5MB. Supported formats: JPG, PNG, WebP</p>
              </div>
            </div>

            {/* Points (Software Services Only) */}
            {activeTab === 'software' && (
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Points * (Press Enter to add)</label>
                <div className="flex gap-2 mb-2">
                  <input
                    type="text"
                    value={pointInput}
                    onChange={(e) => setPointInput(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addPoint())}
                    className="flex-1 px-4 py-2 border-2 border-amber-200 rounded-lg focus:outline-none focus:border-orange-600"
                    placeholder="Add point and press Enter"
                  />
                  <button type="button" onClick={addPoint} className="px-4 py-2 bg-green-600 text-white rounded-lg font-bold hover:bg-green-700">
                    <Plus size={18} />
                  </button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {(currentService.points || []).map((point, idx) => (
                    <span key={idx} className="px-3 py-1 bg-orange-100 text-orange-700 rounded-full text-sm font-semibold flex items-center gap-2">
                      {point}
                      <X size={14} className="cursor-pointer" onClick={() => removePoint(point)} />
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Active Status */}
            <div className="flex items-center space-x-3">
              <input
                type="checkbox"
                checked={currentService.isActive ?? true}
                onChange={(e) => setCurrentService({ ...currentService, isActive: e.target.checked })}
                className="w-5 h-5"
              />
              <label className="text-sm font-bold text-gray-700">Mark as Active Service</label>
            </div>
          </div>

          <AlertDialogFooter>
            <AlertDialogCancel
              onClick={() => { setAddDialogOpen(false); setEditDialogOpen(false); }}
              className="bg-gray-100 hover:bg-gray-200 text-gray-900 font-bold px-6 py-2 rounded-lg"
            >
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleSave}
              className="bg-orange-600 hover:bg-orange-700 text-white font-bold px-6 py-2 rounded-lg"
            >
              <Save size={16} className="mr-2" />
              Save Service
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent className="bg-white border-2 border-orange-200">
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center text-xl font-black text-gray-900">
              <AlertTriangle className="mr-2 text-red-600" size={24} />
              Delete Service?
            </AlertDialogTitle>
            <AlertDialogDescription className="text-gray-600">
              Are you sure you want to delete this service? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setDeleteDialogOpen(false)} className="bg-gray-100 hover:bg-gray-200 text-gray-900 font-bold px-6 py-2 rounded-lg">
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteConfirm} className="bg-red-600 hover:bg-red-700 text-white font-bold px-6 py-2 rounded-lg">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}