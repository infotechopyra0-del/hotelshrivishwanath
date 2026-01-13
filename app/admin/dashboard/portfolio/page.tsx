"use client";

import React, { useState, useEffect } from "react";
import {
  FolderOpen,
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
interface Project {
  _id?: string;
  id?: string;
  title: string;
  category: string;
  description: string;
  image: { url: string; public_id: string } | string;
  technologies: string[];
  features: string[];
  clientName?: string;
  projectUrl?: string;
  status: "completed" | "in-progress" | "planning";
  featured: boolean;
  completionDate?: string;
  order: number;
  createdAt?: string;
  updatedAt?: string;
}

const categories = [
  "Web Development",
  "Mobile App",
  "UI/UX Design",
  "E-commerce",
  "Digital Marketing",
  "Software Development",
  "Branding",
  "SEO",
  "Custom Software",
  "Other",
];

export default function AdminPortfolioPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterCategory, setFilterCategory] = useState("all");
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [projectToDelete, setProjectToDelete] = useState<string | null>(null);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [currentProject, setCurrentProject] = useState<Partial<Project>>({
    title: "",
    category: "Web Development",
    description: "",
    image: "",
    technologies: [],
    features: [],
    clientName: "",
    projectUrl: "",
    status: "completed",
    featured: false,
    order: 0,
  });
  const [techInput, setTechInput] = useState("");
  const [featureInput, setFeatureInput] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const loadToastShownRef = React.useRef(false);

  // Fetch projects
  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async (opts: { forceToast?: boolean } = {}) => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/projects", { credentials: 'include', headers: { 'Accept': 'application/json' } });
      if (!res.ok) throw new Error("Failed to fetch projects");
      const data: Project[] = await res.json();
      setProjects(data);
      if (!loadToastShownRef.current || opts.forceToast) {
        toast.success("Projects loaded successfully! 🎨");
        loadToastShownRef.current = true;
      }
    } catch (err) {
      console.error(err);
      toast.error("Failed to load projects");
    } finally {
      setLoading(false);
    }
  };

  const uploadToCloudinary = async (
    file: any
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
      setCurrentProject({ ...currentProject, image: reader.result as string });
    reader.readAsDataURL(file);
  };

  const handleSaveProject = async () => {
    if (
      !currentProject.title ||
      !currentProject.category ||
      !currentProject.description
    )
      return toast.error("Please fill all required fields");
    if (!currentProject.technologies?.length)
      return toast.error("Add at least one technology");
    if (!currentProject.features?.length)
      return toast.error("Add at least one feature");

    try {
      let imageData = currentProject.image;

      if (imageFile) {
        toast.info("Uploading image...");
        imageData = await uploadToCloudinary(imageFile);

        if (!imageData || !imageData.url || !imageData.public_id) {
          return toast.error("Failed to upload image to Cloudinary");
        }
      }

      if (typeof imageData === "string") {
        return toast.error("Please select and upload an image");
      }

      const isEdit = !!(currentProject._id || currentProject.id);
      const url = isEdit
        ? `/api/admin/projects/${currentProject._id ?? currentProject.id}`
        : "/api/admin/projects";
      const method = isEdit ? "PUT" : "POST";

      const payload = {
        ...currentProject,
      };

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.error || data.message || "Failed to save project");
      }

      setProjects((prev) =>
        isEdit
          ? prev.map((p) => (p._id === data.project._id ? data.project : p))
          : [data.project, ...prev]
      );

      toast.success(isEdit ? "Project updated! ✅" : "Project added! 🎉");
      setEditDialogOpen(false);
      setAddDialogOpen(false);
      setImageFile(null);
    } catch (err) {
      console.error(err);
      toast.error(
        err instanceof Error ? err.message : "Failed to save project"
      );
    }
  };

  const handleDeleteConfirm = async () => {
    if (!projectToDelete) return;
    try {
      const res = await fetch(`/api/admin/projects/${projectToDelete}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("Failed to delete project");
      setProjects((prev) => prev.filter((p) => p._id !== projectToDelete));
      toast.success("Project deleted!");
    } catch (err) {
      console.error(err);
      toast.error("Failed to delete project");
    } finally {
      setDeleteDialogOpen(false);
      setProjectToDelete(null);
    }
  };

  const addTechnology = () => {
    if (!techInput.trim()) return;
    setCurrentProject({
      ...currentProject,
      technologies: [...(currentProject.technologies ?? []), techInput.trim()],
    });
    setTechInput("");
  };

  const removeTechnology = (tech: string) =>
    setCurrentProject({
      ...currentProject,
      technologies:
        currentProject.technologies?.filter((t) => t !== tech) ?? [],
    });

  const addFeature = () => {
    if (!featureInput.trim()) return;
    setCurrentProject({
      ...currentProject,
      features: [...(currentProject.features ?? []), featureInput.trim()],
    });
    setFeatureInput("");
  };

  const removeFeature = (feature: string) =>
    setCurrentProject({
      ...currentProject,
      features: currentProject.features?.filter((f) => f !== feature) ?? [],
    });

  const handleDeleteClick = (id: string) => {
    setProjectToDelete(id);
    setDeleteDialogOpen(true);
  };
  const handleEditClick = (project: Project) => {
    setCurrentProject(project);
    setImageFile(null);
    setEditDialogOpen(true);
  };
  const handleAddClick = () => {
    setCurrentProject({
      title: "",
      category: "Web Development",
      description: "",
      image: "",
      technologies: [],
      features: [],
      clientName: "",
      projectUrl: "",
      status: "completed",
      featured: false,
      order: 0,
    });
    setImageFile(null);
    setAddDialogOpen(true);
  };

  const filteredProjects = projects.filter((p) => {
    const q = searchQuery.toLowerCase();
    const matchesSearch =
      p.title?.toLowerCase().includes(q) ||
      p.description?.toLowerCase().includes(q) ||
      p.clientName?.toLowerCase().includes(q);
    return filterCategory === "all"
      ? matchesSearch
      : matchesSearch && p.category === filterCategory;
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-amber-100">
      {/* Fixed Header */}
      <header className="fixed top-0 left-0 lg:left-72 right-0 z-50 bg-white/95 backdrop-blur-xl shadow-xl border-b-4 border-orange-600">
        <div className="px-4 sm:px-6 lg:px-8 py-5">
          <div className="flex items-center justify-between">
            <div className="ml-12 lg:ml-0">
              <h1 className="text-3xl sm:text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-orange-600 to-orange-800 flex items-center">
                Portfolio Projects
                <FolderOpen className="ml-2 text-orange-600" size={28} />
              </h1>
              <p className="text-sm text-gray-600 mt-1 font-semibold">
                Manage all portfolio projects 🎨
              </p>
            </div>
          </div>
        </div>
      </header>

      {/* Page Content */}
      {/* Page Content */}
      <div className="pt-28 p-4 sm:p-6 lg:p-8 relative z-10">
        {/* Projects List */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl p-4 sm:p-6 border-2 border-amber-200 relative overflow-hidden group sm:mt-28">
          <div className="absolute top-0 left-0 opacity-5 group-hover:opacity-10 transition-opacity duration-300">
            <Sparkles size={200} className="text-orange-600" />
          </div>

          <div className="relative z-10">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 gap-4">
              <h2 className="text-xl sm:text-2xl font-black text-orange-900 flex items-center">
                <FolderOpen className="mr-2 text-orange-600" size={24} />
                Portfolio Projects
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
                  onClick={() => fetchProjects({ forceToast: true })}
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
                  Loading projects...
                </p>
              </div>
            )}

            {!loading && filteredProjects.length === 0 && (
              <div className="text-center py-12">
                <div className="w-20 h-20 sm:w-24 sm:h-24 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full flex items-center justify-center text-3xl sm:text-4xl mx-auto mb-4">
                  📁
                </div>
                <p className="text-lg sm:text-xl font-black text-gray-900 mb-2">
                  No Projects Found
                </p>
                <p className="text-sm sm:text-base text-gray-600 font-semibold px-4">
                  {searchQuery
                    ? "Try adjusting your search criteria"
                    : 'Click "Add" to create your first project'}
                </p>
              </div>
            )}

            {/* RESPONSIVE TABLE VIEW */}
            {!loading && filteredProjects.length > 0 && (
              <>
                {/* MOBILE VIEW (Cards) - Hidden on md and up */}
                <div className="block md:hidden space-y-4">
                  {filteredProjects.map((project: Project, index: number) => {
                    const pid = project.id ?? project._id ?? `project-${index}`;
                    return (
                      <div
                        key={pid}
                        className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-xl border-2 border-amber-200 overflow-hidden shadow-md hover:shadow-xl transition-all duration-300"
                      >
                        {/* Mobile Card Header with Image */}
                        <div className="relative h-40 overflow-hidden">
                          <img
                            src={
                              typeof project.image === "string"
                                ? project.image
                                : project.image.url
                            }
                            alt={project.title}
                            className="w-full h-full object-cover"
                          />
                          <div className="absolute top-2 right-2 flex gap-1">
                            {project.featured && (
                              <span className="bg-yellow-500 text-white px-2 py-1 rounded-full text-xs font-bold flex items-center">
                                <Star size={10} className="mr-1" />
                                Featured
                              </span>
                            )}
                          </div>
                        </div>

                        {/* Mobile Card Content */}
                        <div className="p-4 space-y-3">
                          {/* Title and Category */}
                          <div>
                            <h3 className="font-black text-base text-gray-900 mb-2">
                              {project.title}
                            </h3>
                            <div className="flex items-center gap-2 flex-wrap">
                              <span className="text-xs font-bold px-2 py-1 rounded-full bg-orange-100 text-orange-700">
                                {project.category}
                              </span>
                              <span
                                className={`text-xs font-bold px-2 py-1 rounded-full ${
                                  project.status === "completed"
                                    ? "bg-green-100 text-green-700"
                                    : project.status === "in-progress"
                                    ? "bg-blue-100 text-blue-700"
                                    : "bg-gray-100 text-gray-700"
                                }`}
                              >
                                {project.status.replace("-", " ").toUpperCase()}
                              </span>
                            </div>
                          </div>

                          {/* Description */}
                          <p className="text-sm text-gray-600 line-clamp-2">
                            {project.description}
                          </p>

                          {/* Technologies */}
                          <div>
                            <p className="text-xs font-bold text-gray-600 mb-1">
                              Technologies:
                            </p>
                            <div className="flex flex-wrap gap-1">
                              {project.technologies
                                ?.slice(0, 3)
                                .map((tech, i) => (
                                  <span
                                    key={i}
                                    className="text-xs font-semibold px-2 py-1 bg-blue-100 text-blue-700 rounded"
                                  >
                                    {tech}
                                  </span>
                                ))}
                              {project.technologies &&
                                project.technologies.length > 3 && (
                                  <span className="text-xs font-semibold px-2 py-1 bg-gray-100 text-gray-700 rounded">
                                    +{project.technologies.length - 3}
                                  </span>
                                )}
                            </div>
                          </div>

                          {/* Date */}
                          {project.createdAt && (
                            <p className="text-xs text-gray-500 flex items-center">
                              <Calendar
                                size={12}
                                className="mr-1 text-orange-600"
                              />
                              {new Date(project.createdAt).toLocaleDateString()}
                            </p>
                          )}

                          {/* Actions */}
                          <div className="flex gap-2 pt-2 border-t border-amber-200">
                            <button
                              onClick={() => handleEditClick(project)}
                              className="flex-1 flex items-center justify-center space-x-2 bg-orange-600 hover:bg-orange-700 text-white font-bold px-4 py-2 rounded-lg shadow-md transition-all duration-300"
                            >
                              <Edit size={14} />
                              <span className="text-sm">Edit</span>
                            </button>
                            <button
                              onClick={() => handleDeleteClick(pid)}
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
                    {filteredProjects.map((project: Project, index: number) => {
                      const pid =
                        project.id ?? project._id ?? `project-${index}`;
                      return (
                        <div
                          key={pid}
                          className="bg-gradient-to-r from-amber-50 to-orange-50 rounded-xl border-2 border-amber-200 p-4 hover:shadow-xl transition-all duration-300 flex gap-4"
                        >
                          {/* Image */}
                          <div className="relative w-32 h-32 rounded-lg overflow-hidden flex-shrink-0">
                            <img
                              src={
                                typeof project.image === "string"
                                  ? project.image
                                  : project.image.url
                              }
                              alt={project.title}
                              className="w-full h-full object-cover"
                            />
                            {project.featured && (
                              <div className="absolute top-1 right-1">
                                <Star
                                  size={14}
                                  className="text-yellow-500 fill-yellow-500"
                                />
                              </div>
                            )}
                          </div>

                          {/* Content */}
                          <div className="flex-1 space-y-2">
                            <div className="flex items-start justify-between">
                              <div>
                                <h3 className="font-black text-lg text-gray-900">
                                  {project.title}
                                </h3>
                                <div className="flex items-center gap-2 mt-1">
                                  <span className="text-xs font-bold px-2 py-1 rounded-full bg-orange-100 text-orange-700">
                                    {project.category}
                                  </span>
                                  <span
                                    className={`text-xs font-bold px-2 py-1 rounded-full ${
                                      project.status === "completed"
                                        ? "bg-green-100 text-green-700"
                                        : project.status === "in-progress"
                                        ? "bg-blue-100 text-blue-700"
                                        : "bg-gray-100 text-gray-700"
                                    }`}
                                  >
                                    {project.status
                                      .replace("-", " ")
                                      .toUpperCase()}
                                  </span>
                                </div>
                              </div>
                            </div>

                            <p className="text-sm text-gray-600 line-clamp-2">
                              {project.description}
                            </p>

                            <div className="flex flex-wrap gap-1">
                              {project.technologies
                                ?.slice(0, 4)
                                .map((tech, i) => (
                                  <span
                                    key={i}
                                    className="text-xs font-semibold px-2 py-1 bg-blue-100 text-blue-700 rounded"
                                  >
                                    {tech}
                                  </span>
                                ))}
                            </div>

                            <div className="flex items-center justify-between pt-2">
                              {project.createdAt && (
                                <span className="text-xs text-gray-500 flex items-center">
                                  <Calendar size={12} className="mr-1" />
                                  {new Date(
                                    project.createdAt
                                  ).toLocaleDateString()}
                                </span>
                              )}
                              <div className="flex gap-2">
                                <button
                                  onClick={() => handleEditClick(project)}
                                  className="p-2 bg-orange-600 hover:bg-orange-700 text-white rounded-lg shadow-md transition-all duration-300"
                                >
                                  <Edit size={16} />
                                </button>
                                <button
                                  onClick={() => handleDeleteClick(pid)}
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
                          Image
                        </th>
                        <th className="px-4 py-3 text-left font-black text-gray-900 text-sm">
                          Project Details
                        </th>
                        <th className="px-4 py-3 text-left font-black text-gray-900 text-sm">
                          Category
                        </th>
                        <th className="px-4 py-3 text-left font-black text-gray-900 text-sm">
                          Technologies
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
                      {filteredProjects.map(
                        (project: Project, index: number) => {
                          const pid =
                            project.id ?? project._id ?? `project-${index}`;
                          return (
                            <tr
                              key={pid}
                              className="border-b border-amber-200 hover:bg-gradient-to-r hover:from-amber-50 hover:to-orange-50 transition-all duration-300 group/row"
                            >
                              {/* Image */}
                              <td className="px-4 py-3">
                                <div className="relative w-20 h-14 rounded-lg overflow-hidden shadow-md group-hover/row:shadow-xl transition-shadow duration-300">
                                  <img
                                    src={
                                      typeof project.image === "string"
                                        ? project.image
                                        : project.image.url
                                    }
                                    alt={project.title}
                                    className="w-full h-full object-cover group-hover/row:scale-110 transition-transform duration-300"
                                  />
                                  {project.featured && (
                                    <div className="absolute top-0.5 right-0.5">
                                      <Star
                                        size={10}
                                        className="text-yellow-500 fill-yellow-500"
                                      />
                                    </div>
                                  )}
                                </div>
                              </td>

                              {/* Details */}
                              <td className="px-4 py-3">
                                <div className="max-w-xs">
                                  <h3 className="font-black text-gray-900 text-sm mb-1 flex items-center">
                                    {project.title}
                                    {project.featured && (
                                      <span className="ml-2 text-xs bg-yellow-100 text-yellow-700 px-2 py-0.5 rounded-full font-bold">
                                        Featured
                                      </span>
                                    )}
                                  </h3>
                                  <p className="text-xs text-gray-600 line-clamp-2">
                                    {project.description}
                                  </p>
                                </div>
                              </td>

                              {/* Category */}
                              <td className="px-4 py-3">
                                <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-orange-100 text-orange-700 whitespace-nowrap">
                                  {project.category}
                                </span>
                              </td>

                              {/* Technologies */}
                              <td className="px-4 py-3">
                                <div className="flex flex-wrap gap-1 max-w-xs">
                                  {project.technologies
                                    ?.slice(0, 2)
                                    .map((tech, i) => (
                                      <span
                                        key={i}
                                        className="text-xs font-semibold px-2 py-1 bg-blue-100 text-blue-700 rounded"
                                      >
                                        {tech}
                                      </span>
                                    ))}
                                  {project.technologies &&
                                    project.technologies.length > 2 && (
                                      <span className="text-xs font-semibold px-2 py-1 bg-gray-100 text-gray-700 rounded">
                                        +{project.technologies.length - 2}
                                      </span>
                                    )}
                                </div>
                              </td>

                              {/* Status */}
                              <td className="px-4 py-3">
                                <span
                                  className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold whitespace-nowrap ${
                                    project.status === "completed"
                                      ? "bg-green-100 text-green-700"
                                      : project.status === "in-progress"
                                      ? "bg-blue-100 text-blue-700"
                                      : "bg-gray-100 text-gray-700"
                                  }`}
                                >
                                  <div
                                    className={`w-2 h-2 rounded-full mr-2 ${
                                      project.status === "completed"
                                        ? "bg-green-500"
                                        : project.status === "in-progress"
                                        ? "bg-blue-500"
                                        : "bg-gray-500"
                                    }`}
                                  ></div>
                                  {project.status
                                    .replace("-", " ")
                                    .toUpperCase()}
                                </span>
                              </td>

                              {/* Date */}
                              <td className="px-4 py-3">
                                {project.createdAt && (
                                  <span className="text-xs text-gray-600 flex items-center whitespace-nowrap">
                                    <Calendar
                                      size={12}
                                      className="mr-1 text-orange-600"
                                    />
                                    {new Date(
                                      project.createdAt
                                    ).toLocaleDateString("en-US", {
                                      month: "short",
                                      day: "numeric",
                                      year: "numeric",
                                    })}
                                  </span>
                                )}
                              </td>

                              {/* Actions */}
                              <td className="px-4 py-3">
                                <div className="flex items-center justify-center gap-2">
                                  <button
                                    onClick={() => handleEditClick(project)}
                                    className="p-2 bg-orange-600 hover:bg-orange-700 text-white rounded-lg shadow-md transform hover:scale-110 transition-all duration-300"
                                    title="Edit"
                                  >
                                    <Edit size={14} />
                                  </button>
                                  <button
                                    onClick={() => handleDeleteClick(pid)}
                                    className="p-2 bg-red-600 hover:bg-red-700 text-white rounded-lg shadow-md transform hover:scale-110 transition-all duration-300"
                                    title="Delete"
                                  >
                                    <Trash2 size={14} />
                                  </button>
                                </div>
                              </td>
                            </tr>
                          );
                        }
                      )}
                    </tbody>
                  </table>
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Add/Edit Project Dialog */}
      <AlertDialog
        open={addDialogOpen || editDialogOpen}
        onOpenChange={(open) => {
          setAddDialogOpen(open);
          setEditDialogOpen(open);
        }}
      >
        <AlertDialogContent className="bg-white border-2 border-orange-200 max-w-4xl max-h-[90vh] overflow-y-auto">
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center text-2xl font-black text-gray-900">
              {editDialogOpen ? (
                <Edit className="mr-2 text-orange-600" size={24} />
              ) : (
                <Plus className="mr-2 text-green-600" size={24} />
              )}
              {editDialogOpen ? "Edit Project" : "Add New Project"}
            </AlertDialogTitle>
            <AlertDialogDescription className="text-gray-600">
              {editDialogOpen
                ? "Update project details below"
                : "Fill in the project information to add a new portfolio item"}
            </AlertDialogDescription>
          </AlertDialogHeader>

          <div className="space-y-4 py-4">
            {/* Title */}
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">
                Project Title *
              </label>
              <input
                type="text"
                value={currentProject.title}
                onChange={(e) =>
                  setCurrentProject({
                    ...currentProject,
                    title: e.target.value,
                  })
                }
                className="w-full px-4 py-2 border-2 border-amber-200 rounded-lg focus:outline-none focus:border-orange-600"
                placeholder="Enter project title"
              />
            </div>

            {/* Category */}
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">
                Category *
              </label>
              <select
                value={currentProject.category}
                onChange={(e) =>
                  setCurrentProject({
                    ...currentProject,
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

            {/* Description */}
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">
                Description *
              </label>
              <textarea
                value={currentProject.description}
                onChange={(e) =>
                  setCurrentProject({
                    ...currentProject,
                    description: e.target.value,
                  })
                }
                rows={4}
                className="w-full px-4 py-2 border-2 border-amber-200 rounded-lg focus:outline-none focus:border-orange-600"
                placeholder="Enter project description"
              />
            </div>
            {/* Technologies */}
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">
                Technologies * (Press Enter to add)
              </label>
              <div className="flex gap-2 mb-2">
                <input
                  type="text"
                  value={techInput}
                  onChange={(e) => setTechInput(e.target.value)}
                  onKeyPress={(e) =>
                    e.key === "Enter" && (e.preventDefault(), addTechnology())
                  }
                  className="flex-1 px-4 py-2 border-2 border-amber-200 rounded-lg focus:outline-none focus:border-orange-600"
                  placeholder="e.g., React, Node.js"
                />
                <button
                  type="button"
                  onClick={addTechnology}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg font-bold hover:bg-blue-700"
                >
                  Add
                </button>
              </div>
              <div className="flex flex-wrap gap-2">
                {currentProject.technologies?.map((tech, i) => (
                  <span
                    key={i}
                    className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-semibold flex items-center gap-2"
                  >
                    {tech}
                    <X
                      size={14}
                      className="cursor-pointer"
                      onClick={() => removeTechnology(tech)}
                    />
                  </span>
                ))}
              </div>
            </div>

            {/* Features */}
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">
                Features * (Press Enter to add)
              </label>
              <div className="flex gap-2 mb-2">
                <input
                  type="text"
                  value={featureInput}
                  onChange={(e) => setFeatureInput(e.target.value)}
                  onKeyPress={(e) =>
                    e.key === "Enter" && (e.preventDefault(), addFeature())
                  }
                  className="flex-1 px-4 py-2 border-2 border-amber-200 rounded-lg focus:outline-none focus:border-orange-600"
                  placeholder="e.g., Responsive Design"
                />
                <button
                  type="button"
                  onClick={addFeature}
                  className="px-4 py-2 bg-green-600 text-white rounded-lg font-bold hover:bg-green-700"
                >
                  Add
                </button>
              </div>
              <div className="flex flex-wrap gap-2">
                {currentProject.features?.map((feature, i) => (
                  <span
                    key={i}
                    className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-semibold flex items-center gap-2"
                  >
                    {feature}
                    <X
                      size={14}
                      className="cursor-pointer"
                      onClick={() => removeFeature(feature)}
                    />
                  </span>
                ))}
              </div>
            </div>

            {/* Image Upload */}
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">
                Project Image *
              </label>
              <div className="flex flex-col gap-3">
                {currentProject.image && (
                  <div className="relative w-full h-48 rounded-lg overflow-hidden border-2 border-amber-200">
                    <img
                      src={
                        typeof currentProject.image === "string"
                          ? currentProject.image
                          : currentProject.image?.url
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

            {/* Status */}
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">
                Status
              </label>
              <select
                value={currentProject.status}
                onChange={(e) =>
                  setCurrentProject({
                    ...currentProject,
                    status: e.target.value as any,
                  })
                }
                className="w-full px-4 py-2 border-2 border-amber-200 rounded-lg focus:outline-none focus:border-orange-600"
              >
                <option value="completed">Completed</option>
                <option value="in-progress">In Progress</option>
                <option value="planning">Planning</option>
              </select>
            </div>

            {/* Featured */}
            <div className="flex items-center space-x-3">
              <input
                type="checkbox"
                checked={currentProject.featured}
                onChange={(e) =>
                  setCurrentProject({
                    ...currentProject,
                    featured: e.target.checked,
                  })
                }
                className="w-5 h-5"
              />
              <label className="text-sm font-bold text-gray-700">
                Mark as Featured Project
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
              onClick={handleSaveProject}
              className="bg-orange-600 hover:bg-orange-700 text-white font-bold px-6 py-2 rounded-lg"
            >
              <Save size={16} className="mr-2" />
              Save Project
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
              Delete Project?
            </AlertDialogTitle>
            <AlertDialogDescription className="text-gray-600 text-base">
              Are you sure you want to delete this project? This action cannot
              be undone.
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
