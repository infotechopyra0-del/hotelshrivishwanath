"use client";
import React, { useState, useEffect } from "react";
import { toast } from "sonner";
import {
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
  Upload,
  Hotel,
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
  src: { url: string; public_id: string } | string;
  alt: string;
  category: string;
  order: number;
  featured: boolean;
  createdAt?: string;
  updatedAt?: string;
}

const categories = [
  "Hotel Rooms",
  "Suites",
  "Deluxe Rooms",
  "Premium Rooms",
  "Standard Rooms",
  "Other",
];

export default function AdminRoomsPage() {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterCategory, setFilterCategory] = useState("all");
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [roomToDelete, setRoomToDelete] = useState<string | null>(null);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [currentRoom, setCurrentRoom] = useState<Partial<Room>>({
    src: "",
    alt: "",
    category: "Hotel Rooms",
    order: 0,
    featured: false,
  });
  const [imageFile, setImageFile] = useState<File | null>(null);
  const loadToastShownRef = React.useRef(false);

  useEffect(() => {
    fetchRooms();
  }, []);

  const fetchRooms = async (opts: { forceToast?: boolean } = {}) => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/rooms", {
        credentials: "include",
        headers: { Accept: "application/json" },
      });
      if (!res.ok) throw new Error("Failed to fetch rooms");
      const data: Room[] = await res.json();
      setRooms(data);
      if (!loadToastShownRef.current || opts.forceToast) {
        toast.success("Rooms loaded successfully! 🏨");
        loadToastShownRef.current = true;
      }
    } catch (err) {
      console.error(err);
      toast.error("Failed to load rooms");
    } finally {
      setLoading(false);
    }
  };

  const uploadToCloudinary = async (
    file: File
  ): Promise<{ url: string; public_id: string }> => {
    const formData = new FormData();
    formData.append("image", file);
    try {
      const res = await fetch("/api/admin/upload", {
        method: "POST",
        body: formData,
      });
      if (!res.ok) {
        let msg = "Image upload failed";
        try {
          const j = await res.json();
          if (j?.error) msg = j.error;
        } catch {}
        throw new Error(msg);
      }
      const data = await res.json();
      if (!data?.url) throw new Error("Upload did not return a URL");
      return { url: data.url, public_id: data.public_id };
    } catch (err) {
      console.error("Cloudinary upload error:", err);
      throw err;
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) return toast.error("Image must be <5MB");
    if (!file.type.startsWith("image/"))
      return toast.error("Invalid image file");
    setImageFile(file);
    const reader = new FileReader();
    reader.onloadend = () =>
      setCurrentRoom({ ...currentRoom, src: reader.result as string });
    reader.readAsDataURL(file);
  };

  const handleSaveRoom = async () => {
    if (!currentRoom.alt || !currentRoom.category)
      return toast.error("Please fill all required fields");

    try {
      let imageData = currentRoom.src;

      if (imageFile) {
        toast.loading("Uploading image...");
        imageData = await uploadToCloudinary(imageFile);

        if (!imageData || typeof imageData === "string" || !imageData.url || !imageData.public_id) {
          return toast.error("Failed to upload image to Cloudinary");
        }
      }

      if (typeof imageData === "string") {
        return toast.error("Please select and upload an image");
      }

      const isEdit = !!(currentRoom._id || currentRoom.id);
      const url = isEdit
        ? `/api/admin/rooms/${currentRoom._id ?? currentRoom.id}`
        : "/api/admin/rooms";
      const method = isEdit ? "PUT" : "POST";

      const payload = {
        ...currentRoom,
        src: imageData,
      };

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.error || data.message || "Failed to save room");
      }

      setRooms((prev) =>
        isEdit
          ? prev.map((r) => (r._id === data.room._id ? data.room : r))
          : [data.room, ...prev]
      );

      toast.success(isEdit ? "Room updated! ✅" : "Room added! 🎉");
      setEditDialogOpen(false);
      setAddDialogOpen(false);
      setImageFile(null);
    } catch (err) {
      console.error(err);
      toast.error(err instanceof Error ? err.message : "Failed to save room");
    }
  };

  const handleDeleteConfirm = async () => {
    if (!roomToDelete) return;
    try {
      const res = await fetch(`/api/admin/rooms/${roomToDelete}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("Failed to delete room");
      setRooms((prev) => prev.filter((r) => r._id !== roomToDelete));
      toast.success("Room deleted!");
    } catch (err) {
      console.error(err);
      toast.error("Failed to delete room");
    } finally {
      setDeleteDialogOpen(false);
      setRoomToDelete(null);
    }
  };

  const handleDeleteClick = (id: string) => {
    setRoomToDelete(id);
    setDeleteDialogOpen(true);
  };

  const handleEditClick = (room: Room) => {
    setCurrentRoom(room);
    setImageFile(null);
    setEditDialogOpen(true);
  };

  const handleAddClick = () => {
    setCurrentRoom({
      src: "",
      alt: "",
      category: "Hotel Rooms",
      order: 0,
      featured: false,
    });
    setImageFile(null);
    setAddDialogOpen(true);
  };

  const filteredRooms = rooms.filter((r) =>
    filterCategory === "all" ? true : r.category === filterCategory
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-amber-100">
      {/* Fixed Header */}
      <header className="fixed top-0 left-0 lg:left-72 right-0 z-50 bg-white/95 backdrop-blur-xl shadow-xl border-b-4 border-orange-600">
        <div className="px-4 sm:px-6 lg:px-8 py-5">
          <div className="flex items-center justify-between">
            <div className="ml-12 lg:ml-0">
              <h1 className="text-3xl sm:text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-orange-600 to-orange-800 flex items-center">
                Room Gallery
                <Hotel className="ml-2 text-orange-600" size={28} />
              </h1>
              <p className="text-sm text-gray-600 mt-1 font-semibold">
                Manage hotel room images 🏨
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
                <Hotel className="mr-2 text-orange-600" size={24} />
                Room Gallery
                <Sparkles className="ml-2 text-amber-500" size={20} />
              </h2>

              <div className="flex flex-wrap gap-2 sm:gap-3 w-full sm:w-auto">
                <button
                  onClick={handleAddClick}
                  className="flex-1 sm:flex-none bg-gradient-to-r from-green-600 to-green-700 text-white font-bold px-4 sm:px-6 py-2 sm:py-3 rounded-xl shadow-lg hover:scale-105 transition-all duration-300 flex items-center justify-center space-x-2 text-sm sm:text-base"
                >
                  <Plus size={16} className="sm:w-[18px] sm:h-[18px]" />
                  <span>Add</span>
                </button>

                <button
                  onClick={() => fetchRooms({ forceToast: true })}
                  className="flex-1 sm:flex-none bg-gradient-to-r from-orange-600 to-orange-700 text-white font-bold px-4 sm:px-6 py-2 sm:py-3 rounded-xl shadow-lg hover:scale-105 transition-all duration-300 flex items-center justify-center space-x-2 text-sm sm:text-base"
                >
                  <Zap size={16} className="sm:w-[18px] sm:h-[18px]" />
                  <span>Refresh</span>
                </button>
              </div>
            </div>

            {/* Filters */}
            <div className="mb-6">
              <select
                value={filterCategory}
                onChange={(e) => setFilterCategory(e.target.value)}
                className="w-full sm:w-auto px-4 py-2 border-2 border-amber-200 rounded-lg font-bold text-sm sm:text-base text-gray-700 focus:outline-none focus:border-orange-600"
              >
                <option value="all">All Categories</option>
                {categories.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>

            {loading && (
              <div className="text-center py-12">
                <div className="inline-block animate-spin rounded-full h-12 w-12 sm:h-16 sm:w-16 border-4 border-orange-600 border-t-transparent"></div>
                <p className="mt-4 text-gray-600 font-bold text-sm sm:text-base">
                  Loading rooms...
                </p>
              </div>
            )}

            {!loading && filteredRooms.length === 0 && (
              <div className="text-center py-12">
                <div className="w-20 h-20 sm:w-24 sm:h-24 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full flex items-center justify-center text-3xl sm:text-4xl mx-auto mb-4">
                  🏨
                </div>
                <p className="text-lg sm:text-xl font-black text-gray-900 mb-2">
                  No Rooms Found
                </p>
                <p className="text-sm sm:text-base text-gray-600 font-semibold px-4">
                  Click "Add" to create your first room image
                </p>
              </div>
            )}

            {/* RESPONSIVE GRID VIEW */}
            {!loading && filteredRooms.length > 0 && (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
                {filteredRooms.map((room: Room, index: number) => {
                  const rid = room.id ?? room._id ?? `room-${index}`;
                  return (
                    <div
                      key={rid}
                      className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-xl border-2 border-amber-200 overflow-hidden shadow-md hover:shadow-2xl transition-all duration-300 group/card"
                    >
                      {/* Image */}
                      <div className="relative h-48 sm:h-56 overflow-hidden">
                        <img
                          src={
                            typeof room.src === "string"
                              ? room.src
                              : room.src.url
                          }
                          alt={room.alt}
                          className="w-full h-full object-cover group-hover/card:scale-110 transition-transform duration-500"
                        />
                        <div className="absolute top-2 right-2 flex gap-1">
                          {room.featured && (
                            <span className="bg-yellow-500 text-white px-2 py-1 rounded-full text-xs font-bold flex items-center shadow-lg">
                              <Star size={10} className="mr-1" />
                              Featured
                            </span>
                          )}
                        </div>
                        
                        {/* Overlay on hover */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover/card:opacity-100 transition-opacity duration-300 flex items-end p-4">
                          <p className="text-white text-sm font-bold line-clamp-2">
                            {room.alt}
                          </p>
                        </div>
                      </div>

                      {/* Content */}
                      <div className="p-4 space-y-3">
                        {/* Category */}
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold px-3 py-1 rounded-full bg-orange-100 text-orange-700">
                            {room.category}
                          </span>
                          <span className="text-xs text-gray-500 font-semibold">
                            Order: {room.order}
                          </span>
                        </div>

                        {/* Alt Text */}
                        <p className="text-sm text-gray-700 font-semibold line-clamp-2 min-h-[2.5rem]">
                          {room.alt}
                        </p>

                        {/* Date */}
                        {room.createdAt && (
                          <p className="text-xs text-gray-500 flex items-center">
                            <Calendar
                              size={12}
                              className="mr-1 text-orange-600"
                            />
                            {new Date(room.createdAt).toLocaleDateString()}
                          </p>
                        )}

                        {/* Actions */}
                        <div className="flex gap-2 pt-2 border-t border-amber-200">
                          <button
                            onClick={() => handleEditClick(room)}
                            className="flex-1 flex items-center justify-center space-x-2 bg-orange-600 hover:bg-orange-700 text-white font-bold px-4 py-2 rounded-lg shadow-md transform hover:scale-105 transition-all duration-300"
                          >
                            <Edit size={14} />
                            <span className="text-sm">Edit</span>
                          </button>
                          <button
                            onClick={() => handleDeleteClick(rid)}
                            className="flex items-center justify-center bg-red-600 hover:bg-red-700 text-white font-bold px-4 py-2 rounded-lg shadow-md transform hover:scale-105 transition-all duration-300"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Add/Edit Room Dialog */}
      <AlertDialog
        open={addDialogOpen || editDialogOpen}
        onOpenChange={(open) => {
          setAddDialogOpen(open);
          setEditDialogOpen(open);
        }}
      >
        <AlertDialogContent className="bg-white border-2 border-orange-200 max-w-2xl max-h-[90vh] overflow-y-auto">
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center text-2xl font-black text-gray-900">
              {editDialogOpen ? (
                <Edit className="mr-2 text-orange-600" size={24} />
              ) : (
                <Plus className="mr-2 text-green-600" size={24} />
              )}
              {editDialogOpen ? "Edit Room" : "Add New Room"}
            </AlertDialogTitle>
            <AlertDialogDescription className="text-gray-600">
              {editDialogOpen
                ? "Update room details below"
                : "Fill in the room information to add a new gallery item"}
            </AlertDialogDescription>
          </AlertDialogHeader>

          <div className="space-y-4 py-4">
            {/* Alt Text */}
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">
                Image Description (Alt Text) *
              </label>
              <input
                type="text"
                value={currentRoom.alt}
                onChange={(e) =>
                  setCurrentRoom({
                    ...currentRoom,
                    alt: e.target.value,
                  })
                }
                className="w-full px-4 py-2 border-2 border-amber-200 rounded-lg focus:outline-none focus:border-orange-600"
                placeholder="e.g., Elegant Hotel Room 1"
              />
            </div>

            {/* Category */}
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">
                Category *
              </label>
              <select
                value={currentRoom.category}
                onChange={(e) =>
                  setCurrentRoom({
                    ...currentRoom,
                    category: e.target.value,
                  })
                }
                className="w-full px-4 py-2 border-2 border-amber-200 rounded-lg focus:outline-none focus:border-orange-600"
              >
                {categories.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>
            
            {/* Image Upload */}
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">
                Room Image *
              </label>
              <div className="flex flex-col gap-3">
                {currentRoom.src && (
                  <div className="relative w-full h-48 rounded-lg overflow-hidden border-2 border-amber-200">
                    <img
                      src={
                        typeof currentRoom.src === "string"
                          ? currentRoom.src
                          : currentRoom.src?.url
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

            {/* Featured */}
            <div className="flex items-center space-x-3">
              <input
                type="checkbox"
                checked={currentRoom.featured}
                onChange={(e) =>
                  setCurrentRoom({
                    ...currentRoom,
                    featured: e.target.checked,
                  })
                }
                className="w-5 h-5"
              />
              <label className="text-sm font-bold text-gray-700">
                Mark as Featured Room
              </label>
            </div>
          </div>

          <AlertDialogFooter>
            <AlertDialogCancel
              onClick={() => {
                setAddDialogOpen(false);
                setEditDialogOpen(false);
              }}
              className="bg-gray-100 hover:bg-gray-200 text-gray-900 font-bold px-6 py-2 rounded-lg"
            >
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleSaveRoom}
              className="bg-orange-600 hover:bg-orange-700 text-white font-bold px-6 py-2 rounded-lg"
            >
              <Save size={16} className="mr-2" />
              Save Room
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
              Delete Room?
            </AlertDialogTitle>
            <AlertDialogDescription className="text-gray-600 text-base">
              Are you sure you want to delete this room image? This action
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