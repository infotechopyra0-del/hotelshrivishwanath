"use client";

import React, { useState, useEffect } from "react";
// import { z } from "zod";
import { toast } from "sonner";
import {
  Hotel,
  Sparkles,
  Zap,
  Trash2,
  Calendar,
  AlertTriangle,
  Plus,
  Edit,
  Save,
  Upload,
  Users,
  DollarSign,
  Bed,
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

interface Room {
  _id?: string;
  id?: string;
  image: { url: string; public_id: string } | string;
  title: string;
  description: string;
  category: string;
  price: number;
  bedType: string;
  maxOccupancy: number;
  amenities: string[];
  status: "ACTIVE" | "INACTIVE" | "MAINTENANCE";
  isAvailable: boolean;
  featured: boolean;
  order: number;
  createdAt?: string;
  updatedAt?: string;
}

const categories = [
  "Standard Rooms",
  "Deluxe Rooms",
  "Premium Rooms",
  "Suites",
  "Family Rooms",
  "Honeymoon Suite",
  "Other",
];

const bedTypes = ["Single", "Double", "Queen", "King", "Twin"];
const statusOptions = ["ACTIVE", "INACTIVE", "MAINTENANCE"];

const commonAmenities = [
  "Free WiFi",
  "AC",
  "TV",
  "Private Bathroom",
  "Room Service",
  "Mini Bar",
  "Work Desk",
  "Wardrobe",
  "Safe",
  "Balcony",
  "Geyser",
  "Premium Toiletries",
];

export default function AdminRoomsManagement() {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterCategory, setFilterCategory] = useState("all");
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [roomToDelete, setRoomToDelete] = useState<string | null>(null);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [currentRoom, setCurrentRoom] = useState<Partial<Room>>({
    image: "",
    title: "",
    description: "",
    category: "Standard Rooms",
    price: 2000,
    bedType: "Double",
    maxOccupancy: 2,
    amenities: [],
    status: "ACTIVE",
    isAvailable: true,
    featured: false,
    order: 0,
  });
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [uploadProgress, setUploadProgress] = useState(false);

  useEffect(() => {
    fetchRooms();
  }, []);

  const fetchRooms = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/rooms", {
        credentials: "include",
        headers: { Accept: "application/json" },
      });
      if (!res.ok) throw new Error("Failed to fetch rooms");
      const data: Room[] = await res.json();
      setRooms(data);
      toast.success("Rooms loaded successfully! 🏨");
    } catch (err) {
      toast.error("Failed to load rooms");
    } finally {
      setLoading(false);
    }
  };

  const uploadToCloudinary = async (
    file: File
  ): Promise<{ url: string; public_id: string }> => {
    const formData = new FormData();
    formData.append("file", file);
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 120000);

    try {
      const res = await fetch("/api/admin/upload", {
        method: "POST",
        body: formData,
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(
          errorData?.error || `Upload failed with status: ${res.status}`
        );
      }

      const data = await res.json();
      if (!data?.url) throw new Error("Upload did not return a URL");
      return { url: data.url, public_id: data.public_id };
    } catch (error: any) {
      clearTimeout(timeoutId);
      if (error.name === "AbortError") {
        throw new Error("Upload timeout - please try with a smaller image");
      }
      throw error;
    }
  };

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image must be less than 5MB");
      return;
    }
    if (!file.type.startsWith("image/")) {
      toast.error("Invalid image file");
      return;
    }
    setUploadProgress(true);
    try {
      const uploadResult = await uploadToCloudinary(file);
      setCurrentRoom((prev) => ({
        ...prev,
        image: uploadResult,
      }));
      setImageFile(file);
      toast.success("Image uploaded successfully!");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Image upload failed");
      setImageFile(null);
    } finally {
      setUploadProgress(false);
    }
  };

  const handleSaveRoom = async () => {
    // Manual validation only
    if (!currentRoom.image || (typeof currentRoom.image === "string" && currentRoom.image.trim() === "")) {
      toast.error("Room image is required.");
      return;
    }
    if (!currentRoom.title || currentRoom.title.trim().length < 2) {
      toast.error("Room title is required and must be at least 2 characters.");
      return;
    }
    if (!currentRoom.description || currentRoom.description.trim().length < 10) {
      toast.error("Description is required and must be at least 10 characters.");
      return;
    }
    if (!currentRoom.category || currentRoom.category.trim().length < 2) {
      toast.error("Category is required.");
      return;
    }
    const priceNum = Number(currentRoom.price);
    if (isNaN(priceNum) || priceNum < 1) {
      toast.error("Price must be a number greater than 0.");
      return;
    }
    const maxOccNum = Number(currentRoom.maxOccupancy);
    if (isNaN(maxOccNum) || maxOccNum < 1) {
      toast.error("Max occupancy must be at least 1.");
      return;
    }

    setUploadProgress(true);
    try {
      const isEdit = !!(currentRoom._id || currentRoom.id);
      const url = isEdit
        ? `/api/admin/rooms/${currentRoom._id ?? currentRoom.id}`
        : "/api/admin/rooms";
      const method = isEdit ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(currentRoom),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.error || data.message || "Failed to save room");
      }

      toast.success(
        isEdit ? "Room updated successfully! ✅" : "Room added successfully! 🎉"
      );
      setEditDialogOpen(false);
      setAddDialogOpen(false);
      await fetchRooms();
    } catch (err: any) {
      toast.error(err.message || "Failed to save room");
    } finally {
      setUploadProgress(false);
    }
  };

  const handleDeleteClick = (roomId: string) => {
    setRoomToDelete(roomId);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!roomToDelete) return;

    try {
      const res = await fetch(`/api/admin/rooms/${roomToDelete}`, {
        method: "DELETE",
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.error || "Failed to delete room");
      }

      toast.success("Room deleted successfully!");
      setDeleteDialogOpen(false);
      setRoomToDelete(null);
      await fetchRooms();
    } catch (err: any) {
      toast.error(err.message || "Failed to delete room");
    }
  };

  const handleEditClick = (room: Room) => {
    setCurrentRoom({
      ...room,
      _id: room._id || room.id,
    });
    setImageFile(null);
    setEditDialogOpen(true);
  };

  const handleAddClick = () => {
    setCurrentRoom({
      image: "",
      title: "",
      description: "",
      category: "Standard Rooms",
      price: 2000,
      bedType: "Double",
      maxOccupancy: 2,
      amenities: [],
      status: "ACTIVE",
      isAvailable: true,
      featured: false,
      order: 0,
    });
    setImageFile(null);
    setAddDialogOpen(true);
  };

  const toggleAmenity = (amenity: string) => {
    setCurrentRoom((prev) => {
      const amenities = prev.amenities || [];
      if (amenities.includes(amenity)) {
        return { ...prev, amenities: amenities.filter((a) => a !== amenity) };
      } else {
        return { ...prev, amenities: [...amenities, amenity] };
      }
    });
  };

  const filteredRooms = rooms.filter((room) =>
    filterCategory === "all" ? true : room.category === filterCategory
  );

  return (
    <div className="min-h-screen bg-varanasi-cream">
      {/* Fixed Header */}
      <header className="fixed top-0 left-0 lg:left-72 right-0 z-50 bg-white/95 backdrop-blur-xl shadow-xl border-b-4 border-varanasi-gold">
        <div className="px-4 sm:px-6 lg:px-8 py-5">
          <div className="flex items-center justify-between">
            <div className="ml-12 lg:ml-0">
              <h1 className="text-3xl sm:text-4xl font-black text-varanasi-maroon flex items-center gap-2">
                Manage Rooms <Hotel className="text-varanasi-gold" size={32} />
              </h1>
              <p className="text-sm text-varanasi-brown mt-1 font-semibold">
                Manage all room categories 🏨
              </p>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="pt-32 px-4 sm:px-6 lg:px-8 pb-8">
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl p-6 border-2 border-varanasi-gold relative overflow-hidden group">
          <div className="absolute top-0 left-0 opacity-5 group-hover:opacity-10 transition-opacity duration-300">
            <Sparkles size={200} className="text-varanasi-gold" />
          </div>

          <div className="relative z-10">
            {/* Title and Actions */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 gap-4">
              <h2 className="text-2xl font-black text-varanasi-maroon flex items-center gap-2">
                <Hotel size={24} className="text-varanasi-gold" />
                Room Management
                <Sparkles size={20} className="text-varanasi-gold" />
              </h2>

              <div className="flex gap-3">
                <button
                  onClick={handleAddClick}
                  className="bg-varanasi-maroon hover:bg-varanasi-maroon-dark text-varanasi-gold font-bold px-6 py-3 rounded-xl shadow-lg hover:scale-105 transition-all duration-300 flex items-center gap-2 border border-varanasi-gold"
                >
                  <Plus size={18} />
                  Add
                </button>

                <button
                  onClick={fetchRooms}
                  className="bg-varanasi-maroon hover:bg-varanasi-maroon-dark text-varanasi-gold font-bold px-6 py-3 rounded-xl shadow-lg hover:scale-105 transition-all duration-300 flex items-center gap-2 border border-varanasi-gold"
                >
                  <Zap size={18} />
                  Refresh
                </button>
              </div>
          </div>

            {/* Filter */}
            <div className="mb-6">
              <select
                value={filterCategory}
                onChange={(e) => setFilterCategory(e.target.value)}
                className="px-4 py-3 border-2 border-varanasi-gold rounded-xl font-bold text-varanasi-maroon focus:outline-none focus:border-varanasi-maroon bg-varanasi-cream"
              >
              <option value="all">All Categories</option>
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

            {/* Loading State */}
            {loading && (
              <div className="text-center py-12">
                <div className="inline-block animate-spin rounded-full h-16 w-16 border-4 border-varanasi-gold border-t-transparent"></div>
                <p className="mt-4 text-varanasi-brown font-bold">Loading rooms...</p>
              </div>
            )}

          {/* Empty State */}
          {!loading && filteredRooms.length === 0 && (
            <div className="text-center py-12">
              <div className="w-24 h-24 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full flex items-center justify-center text-4xl mx-auto mb-4">
                🏨
              </div>
              <p className="text-xl font-black text-gray-900 mb-2">
                No Rooms Found
              </p>
              <p className="text-gray-600 font-semibold">
                Click "Add" to create your first room
              </p>
            </div>
          )}

            {/* Table */}
            {!loading && filteredRooms.length > 0 && (
              <div className="overflow-x-auto">
                <table className="w-full bg-white rounded-xl overflow-hidden shadow-lg border-2 border-varanasi-gold">
                  <thead>
                    <tr className="bg-gradient-to-r from-varanasi-maroon to-varanasi-maroon-dark text-varanasi-gold">
                      <th className="px-4 py-4 text-left font-black text-sm">
                        Image
                      </th>
                    <th className="px-4 py-4 text-left font-black text-sm">
                      Room Details
                    </th>
                    <th className="px-4 py-4 text-left font-black text-sm">
                      Category
                    </th>
                    <th className="px-4 py-4 text-center font-black text-sm">
                      Status
                    </th>
                    <th className="px-4 py-4 text-left font-black text-sm">
                      Date
                    </th>
                    <th className="px-4 py-4 text-center font-black text-sm">
                      Actions
                    </th>
                  </tr>
                </thead>
                  <tbody className="divide-y divide-varanasi-gold/30">
                    {filteredRooms.map((room: Room, index: number) => {
                      const roomId = room.id ?? room._id ?? `room-${index}`;
                      const imageUrl =
                        typeof room.image === "string"
                          ? room.image
                          : room.image.url;

                      return (
                        <tr
                          key={roomId}
                          className="hover:bg-varanasi-cream/50 transition-colors duration-200"
                        >
                          {/* Image */}
                          <td className="px-4 py-4">
                            <div className="w-20 h-20 rounded-xl overflow-hidden border-2 border-varanasi-gold shadow-sm">
                              <img
                              src={imageUrl}
                              alt={room.title}
                              className="w-full h-full object-cover hover:scale-110 transition-transform duration-300"
                            />
                          </div>
                        </td>

                          {/* Room Details */}
                          <td className="px-4 py-4">
                            <div className="max-w-xs">
                              <p className="font-bold text-sm text-varanasi-maroon mb-1">
                                {room.title}
                              </p>
                              <p className="text-xs text-varanasi-brown line-clamp-2">
                                {room.description}
                              </p>
                              <div className="flex items-center gap-3 mt-2 text-xs text-varanasi-brown">
                                <span className="flex items-center gap-1">
                                  <DollarSign size={12} className="text-varanasi-gold" />₹{room.price}
                                </span>
                                <span className="flex items-center gap-1">
                                  <Users size={12} className="text-varanasi-gold" />
                                  {room.maxOccupancy}
                                </span>
                                <span className="flex items-center gap-1">
                                  <Bed size={12} className="text-varanasi-gold" />
                                  {room.bedType}
                                </span>
                              </div>
                            </div>
                          </td>

                          {/* Category */}
                          <td className="px-4 py-4">
                            <span className="inline-block bg-varanasi-gold/20 text-varanasi-maroon px-3 py-1 rounded-full text-xs font-bold">
                              {room.category}
                            </span>
                          </td>

                        {/* Status */}
                        <td className="px-4 py-4 text-center">
                          <span
                            className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold ${
                              room.status === "ACTIVE"
                                ? "bg-green-100 text-green-800"
                                : room.status === "INACTIVE"
                                ? "bg-red-100 text-red-800"
                                : "bg-yellow-100 text-yellow-800"
                            }`}
                          >
                            {room.status === "ACTIVE" && (
                              <Eye size={12} className="mr-1" />
                            )}
                            {room.status === "INACTIVE" && (
                              <EyeOff size={12} className="mr-1" />
                            )}
                            {room.status}
                          </span>
                        </td>

                          {/* Date */}
                          <td className="px-4 py-4">
                            {room.createdAt && (
                              <div className="flex items-center text-xs text-varanasi-brown">
                                <Calendar size={12} className="mr-1 text-varanasi-gold" />
                                {new Date(room.createdAt).toLocaleDateString()}
                              </div>
                            )}
                          </td>

                          {/* Actions */}
                          <td className="px-4 py-4">
                            <div className="flex items-center justify-center gap-2">
                              <button
                                onClick={() => handleEditClick(room)}
                                className="bg-varanasi-maroon hover:bg-varanasi-maroon-dark text-varanasi-gold p-2 rounded-lg shadow-md transition-all duration-300"
                                title="Edit"
                              >
                                <Edit size={16} />
                              </button>
                              <button
                                onClick={() => handleDeleteClick(roomId)}
                                className="bg-red-600 hover:bg-red-700 text-white p-2 rounded-lg shadow-md transition-all duration-300"
                                title="Delete"
                              >
                                <Trash2 size={16} />
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
            setUploadProgress(false);
            setImageFile(null);
          }
        }}
      >
        <AlertDialogContent className="bg-white border-2 border-varanasi-gold max-w-4xl max-h-[90vh] overflow-y-auto">
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center text-2xl font-black text-varanasi-maroon gap-2">
              {editDialogOpen ? (
                <Edit className="text-varanasi-gold" size={24} />
              ) : (
                <Plus className="text-varanasi-gold" size={24} />
              )}
              {editDialogOpen ? "Edit Room" : "Add New Room"}
            </AlertDialogTitle>
            <AlertDialogDescription className="text-varanasi-brown">
              {editDialogOpen
                ? "Update room details below"
                : "Fill in the room information"}
            </AlertDialogDescription>
          </AlertDialogHeader>

          <div className="space-y-4 py-4">
            {/* Image Upload */}
            <div>
              <label className="block text-sm font-bold text-varanasi-maroon mb-2">
                Room Image *
              </label>
              <div className="flex flex-col gap-3">
                {currentRoom.image && (
                  <div className="relative w-full h-48 rounded-lg overflow-hidden border-2 border-varanasi-gold">
                    <img
                      src={
                        typeof currentRoom.image === "string"
                          ? currentRoom.image
                          : currentRoom.image?.url
                      }
                      alt="Preview"
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
                <label className="flex items-center justify-center px-4 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg cursor-pointer hover:from-blue-700 hover:to-blue-800 transition-all duration-300 font-bold">
                  <Upload size={18} className="mr-2" />
                  {imageFile ? imageFile.name : "Choose Image"}
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="hidden"
                  />
                </label>
                <p className="text-xs text-gray-500">
                  Maximum file size: 5MB. Supported formats: JPG, PNG, WebP
                </p>
              </div>
            </div>

            <div>
              <label className="block text-sm font-bold text-varanasi-maroon mb-2">
                Room Title *
              </label>
              <input
                type="text"
                value={currentRoom.title || ""}
                onChange={(e) =>
                  setCurrentRoom({ ...currentRoom, title: e.target.value })
                }
                placeholder="e.g., Deluxe Room with City View"
                className="w-full px-4 py-3 border-2 border-varanasi-gold rounded-lg focus:outline-none focus:border-varanasi-maroon bg-varanasi-cream"
              />
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-bold text-varanasi-maroon mb-2">
                Description *
              </label>
              <textarea
                value={currentRoom.description || ""}
                onChange={(e) =>
                  setCurrentRoom({
                    ...currentRoom,
                    description: e.target.value,
                  })
                }
                placeholder="Describe the room..."
                rows={3}
                className="w-full px-4 py-3 border-2 border-varanasi-gold rounded-lg focus:outline-none focus:border-varanasi-maroon bg-varanasi-cream resize-none"
              />
            </div>

            {/* Category, Price */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-bold text-varanasi-maroon mb-2">
                  Category *
                </label>
                <select
                  value={currentRoom.category || "Standard Rooms"}
                  onChange={(e) =>
                    setCurrentRoom({ ...currentRoom, category: e.target.value })
                  }
                  className="w-full px-4 py-3 border-2 border-varanasi-gold rounded-lg focus:outline-none focus:border-varanasi-maroon bg-varanasi-cream"
                >
                  {categories.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-bold text-varanasi-maroon mb-2">
                  Price (₹) *
                </label>
                <input
                  type="number"
                  value={currentRoom.price || 0}
                  onChange={(e) =>
                    setCurrentRoom({
                      ...currentRoom,
                      price: parseInt(e.target.value) || 0,
                    })
                  }
                  className="w-full px-4 py-3 border-2 border-varanasi-gold rounded-lg focus:outline-none focus:border-varanasi-maroon bg-varanasi-cream"
                />
              </div>
            </div>

            {/* Bed Type, Max Occupancy */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-bold text-varanasi-maroon mb-2">
                  Bed Type
                </label>
                <select
                  value={currentRoom.bedType || "Double"}
                  onChange={(e) =>
                    setCurrentRoom({ ...currentRoom, bedType: e.target.value })
                  }
                  className="w-full px-4 py-3 border-2 border-varanasi-gold rounded-lg focus:outline-none focus:border-varanasi-maroon bg-varanasi-cream"
                >
                  {bedTypes.map((type) => (
                    <option key={type} value={type}>
                      {type}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-bold text-varanasi-maroon mb-2">
                  Max Occupancy
                </label>
                <input
                  type="number"
                  value={currentRoom.maxOccupancy || 2}
                  onChange={(e) =>
                    setCurrentRoom({
                      ...currentRoom,
                      maxOccupancy: parseInt(e.target.value) || 2,
                    })
                  }
                  className="w-full px-4 py-3 border-2 border-varanasi-gold rounded-lg focus:outline-none focus:border-varanasi-maroon bg-varanasi-cream"
                />
              </div>
            </div>

            {/* Status */}
            <div className="grid grid-cols-1 md:grid-cols-1 gap-4">
              <div>
                <label className="block text-sm font-bold text-varanasi-maroon mb-2">
                  Status
                </label>
                <select
                  value={currentRoom.status || "ACTIVE"}
                  onChange={(e) =>
                    setCurrentRoom({
                      ...currentRoom,
                      status: e.target.value as "ACTIVE" | "INACTIVE" | "MAINTENANCE",
                    })
                  }
                  className="w-full px-4 py-3 border-2 border-varanasi-gold rounded-lg focus:outline-none focus:border-varanasi-maroon bg-varanasi-cream"
                >
                  {statusOptions.map((status) => (
                    <option key={status} value={status}>
                      {status}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Amenities */}
            <div>
              <label className="block text-sm font-bold text-varanasi-maroon mb-2">
                Amenities
              </label>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                {commonAmenities.map((amenity) => (
                  <label
                    key={amenity}
                    className="flex items-center space-x-2 cursor-pointer"
                  >
                    <input
                      type="checkbox"
                      checked={currentRoom.amenities?.includes(amenity)}
                      onChange={() => toggleAmenity(amenity)}
                      className="w-4 h-4 accent-varanasi-gold"
                    />
                    <span className="text-sm text-varanasi-brown">{amenity}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Featured, Available */}
            <div className="flex gap-6">
              <label className="flex items-center space-x-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={currentRoom.featured}
                  onChange={(e) =>
                    setCurrentRoom({
                      ...currentRoom,
                      featured: e.target.checked,
                    })
                  }
                  className="w-5 h-5 accent-varanasi-gold"
                />
                <span className="text-sm font-bold text-varanasi-maroon">
                  Mark as Featured
                </span>
              </label>

              <label className="flex items-center space-x-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={currentRoom.isAvailable}
                  onChange={(e) =>
                    setCurrentRoom({
                      ...currentRoom,
                      isAvailable: e.target.checked,
                    })
                  }
                  className="w-5 h-5 accent-varanasi-gold"
                />
                <span className="text-sm font-bold text-varanasi-maroon">
                  Available for Booking
                </span>
              </label>
            </div>
          </div>

          <AlertDialogFooter>
            <AlertDialogCancel
              onClick={() => {
                setEditDialogOpen(false);
                setAddDialogOpen(false);
                setUploadProgress(false);
                setImageFile(null);
              }}
              className="bg-gray-100 hover:bg-gray-200 text-gray-900 font-bold px-6 py-2 rounded-lg"
            >
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleSaveRoom}
              disabled={uploadProgress}
              className="bg-varanasi-maroon hover:bg-varanasi-maroon-dark text-varanasi-gold font-bold px-6 py-2 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed border border-varanasi-gold"
            >
              <Save size={16} className="mr-2" />
              {uploadProgress ? "Saving..." : "Save Room"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent className="bg-white border-2 border-varanasi-gold">
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center text-xl font-black text-varanasi-maroon gap-2">
              <AlertTriangle className="text-red-600" size={24} />
              Delete Room?
            </AlertDialogTitle>
            <AlertDialogDescription className="text-varanasi-brown text-base">
              Are you sure you want to delete this room? This action cannot be
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