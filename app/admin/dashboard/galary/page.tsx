"use client";

import React, { useState, useEffect } from "react";
import {
  Camera,
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
  Filter,
  Search,
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

interface GalleryImage {
  _id?: string;
  id?: string;
  src: string;
  alt: string;
  category: string;
  featured: boolean;
  order: number;
  publicId?: string;
  createdAt?: string;
  updatedAt?: string;
}

const categories = [
  "Heritage",
  "Spiritual",
  "Architecture",
  "Culture",
  "Streets",
  "Markets",
  "Scenic",
  "Educational",
  "Historical",
  "Other",
];

export default function AdminGalleryPage() {
  const [images, setImages] = useState<GalleryImage[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterCategory, setFilterCategory] = useState("all");
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [imageToDelete, setImageToDelete] = useState<string | null>(null);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [currentImage, setCurrentImage] = useState<Partial<GalleryImage>>({
    src: "",
    alt: "",
    category: "Heritage",
    featured: false,
    order: 0,
  });
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [uploadProgress, setUploadProgress] = useState(false);

  useEffect(() => {
    fetchImages();
  }, []);

  const fetchImages = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/gallery", {
        credentials: "include",
        headers: { Accept: "application/json" },
      });
      if (!res.ok) throw new Error("Failed to fetch images");
      const data: GalleryImage[] = await res.json();
      setImages(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const uploadToCloudinary = async (
    file: File
  ): Promise<{ url: string; public_id: string }> => {
    const formData = new FormData();
    formData.append("image", file);
    const res = await fetch("/api/admin/upload", {
      method: "POST",
      body: formData,
    });
    if (!res.ok) {
      const errorData = await res.json();
      throw new Error(errorData?.error || "Image upload failed");
    }
    const data = await res.json();
    if (!data?.url) throw new Error("Upload did not return a URL");
    return { url: data.url, public_id: data.public_id };
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) {
      alert("Image must be less than 5MB");
      return;
    }
    if (!file.type.startsWith("image/")) {
      alert("Invalid image file");
      return;
    }
    setImageFile(file);
    const reader = new FileReader();
    reader.onloadend = () =>
      setCurrentImage({ ...currentImage, src: reader.result as string });
    reader.readAsDataURL(file);
  };

  const handleSaveImage = async () => {
    if (!currentImage.alt || !currentImage.category) {
      alert("Please fill all required fields");
      return;
    }

    try {
      setUploadProgress(true);
      let imageData = currentImage.src;
      let publicId = currentImage.publicId;

      if (imageFile) {
        const uploadResult = await uploadToCloudinary(imageFile);
        imageData = uploadResult.url;
        publicId = uploadResult.public_id;
      }

      if (!imageData) {
        alert("Please select and upload an image");
        setUploadProgress(false);
        return;
      }

      const isEdit = !!(currentImage._id || currentImage.id);
      const url = isEdit
        ? `/api/admin/gallery/${currentImage._id ?? currentImage.id}`
        : "/api/admin/gallery";
      const method = isEdit ? "PUT" : "POST";

      const payload = {
        ...currentImage,
        src: imageData,
        publicId: publicId,
      };

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.error || data.message || "Failed to save image");
      }

      setImages((prev) =>
        isEdit
          ? prev.map((img) => (img._id === data.image._id ? data.image : img))
          : [data.image, ...prev]
      );

      setEditDialogOpen(false);
      setAddDialogOpen(false);
      setImageFile(null);
      setUploadProgress(false);
    } catch (err) {
      console.error(err);
      alert(err instanceof Error ? err.message : "Failed to save image");
      setUploadProgress(false);
    }
  };

  const handleDeleteConfirm = async () => {
    if (!imageToDelete) return;
    try {
      const res = await fetch(`/api/admin/gallery/${imageToDelete}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("Failed to delete image");
      setImages((prev) => prev.filter((img) => img._id !== imageToDelete));
    } catch (err) {
      console.error(err);
      alert("Failed to delete image");
    } finally {
      setDeleteDialogOpen(false);
      setImageToDelete(null);
    }
  };

  const handleDeleteClick = (id: string) => {
    setImageToDelete(id);
    setDeleteDialogOpen(true);
  };

  const handleEditClick = (image: GalleryImage) => {
    setCurrentImage(image);
    setImageFile(null);
    setEditDialogOpen(true);
  };

  const handleAddClick = () => {
    setCurrentImage({
      src: "",
      alt: "",
      category: "Heritage",
      featured: false,
      order: 0,
    });
    setImageFile(null);
    setAddDialogOpen(true);
  };

  const filteredImages = images.filter((img) => {
    const q = searchQuery.toLowerCase();
    const matchesSearch =
      img.alt?.toLowerCase().includes(q) ||
      img.category?.toLowerCase().includes(q);
    return filterCategory === "all"
      ? matchesSearch
      : matchesSearch && img.category === filterCategory;
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-amber-100">
      <header className="fixed top-0 left-0 lg:left-72 right-0 z-50 bg-white/95 backdrop-blur-xl shadow-xl border-b-4 border-orange-600">
        <div className="px-4 sm:px-6 lg:px-8 py-5">
          <div className="flex items-center justify-between">
            <div className="ml-12 lg:ml-0">
              <h1 className="text-3xl sm:text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-orange-600 to-orange-800 flex items-center">
                Gallery Management
                <Camera className="ml-2 text-orange-600" size={28} />
              </h1>
              <p className="text-sm text-gray-600 mt-1 font-semibold">
                Manage your gallery images 🖼️
              </p>
            </div>
          </div>
        </div>
      </header>

      <div className="pt-28 p-4 sm:p-6 lg:p-8 relative z-10">
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl p-4 sm:p-6 border-2 border-amber-200 relative overflow-hidden group sm:mt-28">
          <div className="absolute top-0 left-0 opacity-5 group-hover:opacity-10 transition-opacity duration-300">
            <Sparkles size={200} className="text-orange-600" />
          </div>

          <div className="relative z-10">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 gap-4">
              <h2 className="text-xl sm:text-2xl font-black text-orange-900 flex items-center">
                <Camera className="mr-2 text-orange-600" size={24} />
                Gallery Images
                <Sparkles className="ml-2 text-amber-500" size={20} />
              </h2>

              <div className="flex flex-wrap gap-2 sm:gap-3 w-full sm:w-auto">
                <button
                  onClick={handleAddClick}
                  className="flex-1 sm:flex-none bg-gradient-to-r from-green-600 to-green-700 text-white font-bold px-4 sm:px-6 py-2 sm:py-3 rounded-xl shadow-lg hover:scale-105 transition-all duration-300 flex items-center justify-center space-x-2 text-sm sm:text-base"
                >
                  <Plus size={16} className="sm:w-[18px] sm:h-[18px]" />
                  <span>Add Image</span>
                </button>

                <button
                  onClick={fetchImages}
                  className="flex-1 sm:flex-none bg-gradient-to-r from-orange-600 to-orange-700 text-white font-bold px-4 sm:px-6 py-2 sm:py-3 rounded-xl shadow-lg hover:scale-105 transition-all duration-300 flex items-center justify-center space-x-2 text-sm sm:text-base"
                >
                  <Zap size={16} className="sm:w-[18px] sm:h-[18px]" />
                  <span>Refresh</span>
                </button>
              </div>
            </div>

            <div className="mb-6 flex flex-col sm:flex-row gap-3">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search by title or category..."
                  className="w-full pl-10 pr-4 py-2 border-2 border-amber-200 rounded-lg font-semibold text-sm sm:text-base text-gray-700 focus:outline-none focus:border-orange-600"
                />
              </div>
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
                  Loading images...
                </p>
              </div>
            )}

            {!loading && filteredImages.length === 0 && (
              <div className="text-center py-12">
                <div className="w-20 h-20 sm:w-24 sm:h-24 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full flex items-center justify-center text-3xl sm:text-4xl mx-auto mb-4">
                  🖼️
                </div>
                <p className="text-lg sm:text-xl font-black text-gray-900 mb-2">
                  No Images Found
                </p>
                <p className="text-sm sm:text-base text-gray-600 font-semibold px-4">
                  {searchQuery
                    ? "Try adjusting your search criteria"
                    : 'Click "Add Image" to upload your first image'}
                </p>
              </div>
            )}

            {!loading && filteredImages.length > 0 && (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
                {filteredImages.map((image: GalleryImage, index: number) => {
                  const imgId = image.id ?? image._id ?? `img-${index}`;
                  return (
                    <div
                      key={imgId}
                      className="bg-gradient-to-br from-white to-amber-50 rounded-xl border-2 border-amber-200 overflow-hidden shadow-md hover:shadow-2xl transition-all duration-300 group"
                    >
                      <div className="relative h-48 sm:h-56 overflow-hidden bg-gray-100">
                        <img
                          src={image.src}
                          alt={image.alt}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                        />
                        {image.featured && (
                          <div className="absolute top-2 right-2">
                            <Star
                              size={20}
                              className="text-yellow-500 fill-yellow-500"
                            />
                          </div>
                        )}
                      </div>

                      <div className="p-4 space-y-3">
                        <div>
                          <h3 className="font-black text-base text-gray-900 mb-1 line-clamp-1">
                            {image.alt}
                          </h3>
                          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-bold bg-orange-100 text-orange-700">
                            {image.category}
                          </span>
                        </div>

                        {image.createdAt && (
                          <p className="text-xs text-gray-500 flex items-center">
                            <Calendar size={12} className="mr-1 text-orange-600" />
                            {new Date(image.createdAt).toLocaleDateString()}
                          </p>
                        )}

                        <div className="flex gap-2 pt-2 border-t border-amber-200">
                          <button
                            onClick={() => handleEditClick(image)}
                            className="flex-1 flex items-center justify-center space-x-2 bg-orange-600 hover:bg-orange-700 text-white font-bold px-3 py-2 rounded-lg shadow-md transition-all duration-300"
                          >
                            <Edit size={14} />
                            <span className="text-sm">Edit</span>
                          </button>
                          <button
                            onClick={() => handleDeleteClick(imgId)}
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
            )}
          </div>
        </div>
      </div>

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
              {editDialogOpen ? "Edit Image" : "Add New Image"}
            </AlertDialogTitle>
            <AlertDialogDescription className="text-gray-600">
              {editDialogOpen
                ? "Update image details below"
                : "Fill in the image information to add to gallery"}
            </AlertDialogDescription>
          </AlertDialogHeader>

          <div className="space-y-4 py-4">
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">
                Image *
              </label>
              <div className="flex flex-col gap-3">
                {currentImage.src && (
                  <div className="relative w-full h-48 rounded-lg overflow-hidden border-2 border-amber-200">
                    <img
                      src={currentImage.src}
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
              <label className="block text-sm font-bold text-gray-700 mb-2">
                Image Title/Alt Text *
              </label>
              <input
                type="text"
                value={currentImage.alt}
                onChange={(e) =>
                  setCurrentImage({ ...currentImage, alt: e.target.value })
                }
                className="w-full px-4 py-2 border-2 border-amber-200 rounded-lg focus:outline-none focus:border-orange-600"
                placeholder="Enter image title"
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">
                Category *
              </label>
              <select
                value={currentImage.category}
                onChange={(e) =>
                  setCurrentImage({ ...currentImage, category: e.target.value })
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
            
            <div className="flex items-center space-x-3">
              <input
                type="checkbox"
                checked={currentImage.featured}
                onChange={(e) =>
                  setCurrentImage({
                    ...currentImage,
                    featured: e.target.checked,
                  })
                }
                className="w-5 h-5"
              />
              <label className="text-sm font-bold text-gray-700">
                Mark as Featured Image
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
              onClick={handleSaveImage}
              disabled={uploadProgress}
              className="bg-orange-600 hover:bg-orange-700 text-white font-bold px-6 py-2 rounded-lg disabled:opacity-50"
            >
              <Save size={16} className="mr-2" />
              {uploadProgress ? "Saving..." : "Save Image"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent className="bg-white border-2 border-orange-200">
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center text-xl font-black text-gray-900">
              <AlertTriangle className="mr-2 text-red-600" size={24} />
              Delete Image?
            </AlertDialogTitle>
            <AlertDialogDescription className="text-gray-600 text-base">
              Are you sure you want to delete this image? This action cannot be
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