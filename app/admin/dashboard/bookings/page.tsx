"use client";

import { useState, useEffect, useRef } from "react";
import {
  Calendar,
  Sparkles,
  Star,
  Zap,
  Mail,
  Phone,
  Building2,
  Trash2,
  Eye,
  AlertTriangle,
  CheckCircle,
  Clock,
  Users,
  Bed,
  IndianRupee,
  Search,
  Filter,
  CreditCard,
  MapPin,
  User,
  Edit,
  XCircle,
  Check,
  DollarSign,
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

interface Booking {
  _id: string;
  bookingId: string;
  customer: {
    _id: string;
    name: string;
    email: string;
    phone: string;
  };
  room: {
    _id: string;
    roomNumber: string;
    roomType: string;
  };
  checkIn: string;
  checkOut: string;
  guests: {
    adults: number;
    children: number;
    infants: number;
  };
  guestDetails: {
    name: string;
    age?: number;
    idType?: string;
    idNumber?: string;
  }[];
  roomRate: number;
  totalAmount: number;
  taxes: number;
  discount: number;
  paymentStatus: "Pending" | "Partial" | "Paid" | "Refunded" | "Failed";
  paymentMethod?: string;
  bookingStatus: "Confirmed" | "Checked-In" | "Checked-Out" | "Cancelled" | "No-Show";
  specialRequests?: string;
  source: string;
  notes?: string;
  createdAt: string;
  nights?: number;
  totalGuests?: number;
}

export default function AdminBookingsPage() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterPayment, setFilterPayment] = useState("all");
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [bookingToDelete, setBookingToDelete] = useState<string | null>(null);
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const loadToastShownRef = useRef(false);

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async (opts: { forceToast?: boolean } = {}) => {
    setLoading(true);
    try {
      const response = await fetch("/api/admin/bookings", {
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
        throw new Error("Failed to fetch bookings");
      }

      const data: Booking[] = await response.json();
      setBookings(data);

      if (!loadToastShownRef.current || opts.forceToast) {
        loadToastShownRef.current = true;
      }
    } catch (error) {
    } finally {
      setLoading(false);
    }
  };

  const filteredBookings = bookings.filter((booking: Booking) => {
    const q = (searchQuery || "").toString().toLowerCase().trim();
    const matchesBookingId = booking.bookingId?.toLowerCase()?.includes(q) ?? false;
    const matchesCustomerName = booking.customer?.name?.toLowerCase()?.includes(q) ?? false;
    const matchesCustomerEmail = booking.customer?.email?.toLowerCase()?.includes(q) ?? false;
    const matchesRoomNumber = booking.room?.roomNumber?.toString()?.includes(q) ?? false;
    const matchesSearch = matchesBookingId || matchesCustomerName || matchesCustomerEmail || matchesRoomNumber;

    const matchesStatus = filterStatus === "all" || booking.bookingStatus === filterStatus;
    const matchesPayment = filterPayment === "all" || booking.paymentStatus === filterPayment;

    return matchesSearch && matchesStatus && matchesPayment;
  });

  const handleDeleteClick = (id: string) => {
    setBookingToDelete(id);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!bookingToDelete) return;

    try {
      const response = await fetch(`/api/admin/bookings/${bookingToDelete}`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
      });

      if (!response.ok) throw new Error("Failed to delete");

      setBookings((prev) => prev.filter((b) => b._id !== bookingToDelete));
    } catch (error) {
    } finally {
      setDeleteDialogOpen(false);
      setBookingToDelete(null);
    }
  };

  const updateBookingStatus = async (id: string, newStatus: string) => {
    try {
      const response = await fetch(`/api/admin/bookings/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({ bookingStatus: newStatus }),
      });

      if (response.status === 401) {
        window.location.href = "/admin/login";
        return;
      }

      if (!response.ok) throw new Error("Failed to update");

      const updatedBooking = await response.json();
      setBookings((prev) =>
        prev.map((b) => (b._id === id ? updatedBooking : b))
      );
    } catch (error) {
    }
  };

  const updatePaymentStatus = async (id: string, newStatus: string) => {
    try {
      const response = await fetch(`/api/admin/bookings/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({ paymentStatus: newStatus }),
      });

      if (!response.ok) throw new Error("Failed to update");

      const updatedBooking = await response.json();
      setBookings((prev) =>
        prev.map((b) => (b._id === id ? updatedBooking : b))
      );
    } catch (error) {
    }
  };

  const handleViewDetails = (booking: Booking) => {
    setSelectedBooking(booking);
    setViewDialogOpen(true);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Confirmed":
        return "bg-blue-100 text-blue-700";
      case "Checked-In":
        return "bg-green-100 text-green-700";
      case "Checked-Out":
        return "bg-gray-100 text-gray-700";
      case "Cancelled":
        return "bg-red-100 text-red-700";
      case "No-Show":
        return "bg-orange-100 text-orange-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  const getPaymentStatusColor = (status: string) => {
    switch (status) {
      case "Paid":
        return "bg-green-100 text-green-700";
      case "Pending":
        return "bg-yellow-100 text-yellow-700";
      case "Partial":
        return "bg-blue-100 text-blue-700";
      case "Refunded":
        return "bg-purple-100 text-purple-700";
      case "Failed":
        return "bg-red-100 text-red-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  const calculateNights = (checkIn: string, checkOut: string) => {
    const oneDay = 24 * 60 * 60 * 1000;
    const start = new Date(checkIn);
    const end = new Date(checkOut);
    return Math.round((end.getTime() - start.getTime()) / oneDay);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-amber-100">
      {/* Fixed Header */}
      <header className="fixed top-0 left-0 lg:left-72 right-0 z-50 bg-white/95 backdrop-blur-xl shadow-xl border-b-4 border-orange-600">
        <div className="px-4 sm:px-6 lg:px-8 py-5">
          <div className="flex items-center justify-between">
            <div className="ml-12 lg:ml-0">
              <h1 className="text-3xl sm:text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-orange-600 to-orange-800 flex items-center">
                Bookings Management
                <Calendar className="ml-2 text-orange-600" size={28} />
              </h1>
              <p className="text-sm text-gray-600 mt-1 font-semibold">
                Manage all hotel bookings 🏨
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
            {/* Header Section */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 gap-4">
              <h2 className="text-xl sm:text-2xl font-black text-orange-900 flex items-center">
                <Bed className="mr-2 text-orange-600" size={24} />
                All Bookings
                <Sparkles className="ml-2 text-amber-500" size={20} />
              </h2>

              <button
                onClick={() => fetchBookings({ forceToast: true })}
                className="flex-1 sm:flex-none bg-gradient-to-r from-orange-600 to-orange-700 text-white font-bold px-4 sm:px-6 py-2 sm:py-3 rounded-xl shadow-lg hover:scale-105 transition-all duration-300 flex items-center justify-center space-x-2 text-sm sm:text-base"
              >
                <Zap size={16} className="sm:w-[18px] sm:h-[18px]" />
                <span>Refresh</span>
              </button>
            </div>

            {/* Search and Filters */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              {/* Search */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-orange-600" size={18} />
                <input
                  type="text"
                  placeholder="Search bookings..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border-2 border-amber-200 rounded-xl focus:border-orange-600 focus:outline-none font-semibold text-sm"
                />
              </div>

              {/* Booking Status Filter */}
              <div className="relative">
                <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-orange-600" size={18} />
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border-2 border-amber-200 rounded-xl focus:border-orange-600 focus:outline-none font-semibold text-sm appearance-none bg-white"
                >
                  <option value="all">All Statuses</option>
                  <option value="Confirmed">Confirmed</option>
                  <option value="Checked-In">Checked-In</option>
                  <option value="Checked-Out">Checked-Out</option>
                  <option value="Cancelled">Cancelled</option>
                  <option value="No-Show">No-Show</option>
                </select>
              </div>

              {/* Payment Status Filter */}
              <div className="relative">
                <CreditCard className="absolute left-3 top-1/2 transform -translate-y-1/2 text-orange-600" size={18} />
                <select
                  value={filterPayment}
                  onChange={(e) => setFilterPayment(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border-2 border-amber-200 rounded-xl focus:border-orange-600 focus:outline-none font-semibold text-sm appearance-none bg-white"
                >
                  <option value="all">All Payments</option>
                  <option value="Paid">Paid</option>
                  <option value="Pending">Pending</option>
                  <option value="Partial">Partial</option>
                  <option value="Refunded">Refunded</option>
                  <option value="Failed">Failed</option>
                </select>
              </div>
            </div>

            {loading && (
              <div className="text-center py-12">
                <div className="inline-block animate-spin rounded-full h-12 w-12 sm:h-16 sm:w-16 border-4 border-orange-600 border-t-transparent"></div>
                <p className="mt-4 text-gray-600 font-bold text-sm sm:text-base">
                  Loading bookings...
                </p>
              </div>
            )}

            {!loading && filteredBookings.length === 0 && (
              <div className="text-center py-12">
                <div className="w-20 h-20 sm:w-24 sm:h-24 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full flex items-center justify-center text-3xl sm:text-4xl mx-auto mb-4">
                  🏨
                </div>
                <p className="text-lg sm:text-xl font-black text-gray-900 mb-2">
                  No Bookings Found
                </p>
                <p className="text-sm sm:text-base text-gray-600 font-semibold px-4">
                  {searchQuery || filterStatus !== "all" || filterPayment !== "all"
                    ? "Try adjusting your filters"
                    : "No bookings in the database yet"}
                </p>
              </div>
            )}

            {/* RESPONSIVE TABLE VIEW */}
            {!loading && filteredBookings.length > 0 && (
              <>
                {/* MOBILE VIEW (Cards) */}
                <div className="block lg:hidden space-y-4">
                  {filteredBookings.map((booking: Booking) => (
                    <div
                      key={booking._id}
                      className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-xl border-2 border-amber-200 overflow-hidden shadow-md hover:shadow-xl transition-all duration-300"
                    >
                      {/* Card Header */}
                      <div className="bg-gradient-to-r from-orange-600 to-orange-700 p-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-3">
                            <div className="w-10 h-10 bg-white text-orange-600 rounded-lg flex items-center justify-center font-black shadow-lg text-xs">
                              {booking.room?.roomNumber || "N/A"}
                            </div>
                            <div>
                              <h3 className="font-black text-base text-white">
                                {booking.bookingId}
                              </h3>
                              <p className="text-xs text-orange-100">
                                {booking.customer?.name || "N/A"}
                              </p>
                            </div>
                          </div>
                          <div className="flex flex-col gap-1 items-end">
                            <span className={`text-xs font-bold px-2 py-1 rounded-full ${getStatusColor(booking.bookingStatus)}`}>
                              {booking.bookingStatus}
                            </span>
                            <span className={`text-xs font-bold px-2 py-1 rounded-full ${getPaymentStatusColor(booking.paymentStatus)}`}>
                              {booking.paymentStatus}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Card Content */}
                      <div className="p-4 space-y-3">
                        {/* Booking Details */}
                        <div className="grid grid-cols-2 gap-2 text-xs">
                          <div className="flex items-center space-x-2">
                            <Calendar size={12} className="text-orange-600" />
                            <div>
                              <p className="text-gray-500">Check-in</p>
                              <p className="font-bold text-gray-700">
                                {new Date(booking.checkIn).toLocaleDateString()}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Calendar size={12} className="text-orange-600" />
                            <div>
                              <p className="text-gray-500">Check-out</p>
                              <p className="font-bold text-gray-700">
                                {new Date(booking.checkOut).toLocaleDateString()}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Users size={12} className="text-orange-600" />
                            <div>
                              <p className="text-gray-500">Guests</p>
                              <p className="font-bold text-gray-700">
                                {booking.guests.adults + booking.guests.children + booking.guests.infants}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center space-x-2">
                            <IndianRupee size={12} className="text-orange-600" />
                            <div>
                              <p className="text-gray-500">Amount</p>
                              <p className="font-bold text-gray-700">
                                ₹{booking.totalAmount.toLocaleString()}
                              </p>
                            </div>
                          </div>
                        </div>

                        {/* Actions */}
                        <div className="flex gap-2 pt-2 border-t border-amber-200">
                          <button
                            onClick={() => handleViewDetails(booking)}
                            className="flex-1 flex items-center justify-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white font-bold px-3 py-2 rounded-lg shadow-md transition-all duration-300"
                          >
                            <Eye size={14} />
                            <span className="text-xs">View</span>
                          </button>
                          <button
                            onClick={() => updateBookingStatus(booking._id, booking.bookingStatus === "Confirmed" ? "Checked-In" : "Confirmed")}
                            className="flex-1 flex items-center justify-center space-x-2 bg-orange-600 hover:bg-orange-700 text-white font-bold px-3 py-2 rounded-lg shadow-md transition-all duration-300"
                          >
                            <CheckCircle size={14} />
                            <span className="text-xs">Status</span>
                          </button>
                          <button
                            onClick={() => handleDeleteClick(booking._id)}
                            className="flex items-center justify-center bg-red-600 hover:bg-red-700 text-white font-bold px-3 py-2 rounded-lg shadow-md transition-all duration-300"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* DESKTOP TABLE VIEW */}
                <div className="hidden lg:block overflow-x-auto">
                  <table className="w-full border-collapse">
                    <thead>
                      <tr className="bg-gradient-to-r from-orange-100 to-amber-100 border-b-4 border-orange-600">
                        <th className="px-4 py-3 text-left font-black text-gray-900 text-sm">Booking ID</th>
                        <th className="px-4 py-3 text-left font-black text-gray-900 text-sm">Customer</th>
                        <th className="px-4 py-3 text-left font-black text-gray-900 text-sm">Room</th>
                        <th className="px-4 py-3 text-left font-black text-gray-900 text-sm">Check-in</th>
                        <th className="px-4 py-3 text-left font-black text-gray-900 text-sm">Check-out</th>
                        <th className="px-4 py-3 text-left font-black text-gray-900 text-sm">Guests</th>
                        <th className="px-4 py-3 text-left font-black text-gray-900 text-sm">Amount</th>
                        <th className="px-4 py-3 text-left font-black text-gray-900 text-sm">Status</th>
                        <th className="px-4 py-3 text-left font-black text-gray-900 text-sm">Payment</th>
                        <th className="px-4 py-3 text-center font-black text-gray-900 text-sm">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredBookings.map((booking: Booking) => (
                        <tr
                          key={booking._id}
                          className="border-b border-amber-200 hover:bg-gradient-to-r hover:from-amber-50 hover:to-orange-50 transition-all duration-300"
                        >
                          <td className="px-4 py-3">
                            <span className="font-black text-sm text-orange-600">
                              {booking.bookingId}
                            </span>
                          </td>
                          <td className="px-4 py-3">
                            <div>
                              <p className="font-black text-sm text-gray-900">{booking.customer?.name || "N/A"}</p>
                              <p className="text-xs text-gray-600">{booking.customer?.email || "N/A"}</p>
                            </div>
                          </td>
                          <td className="px-4 py-3">
                            <div>
                              <p className="font-bold text-sm text-gray-900">#{booking.room?.roomNumber || "N/A"}</p>
                              <p className="text-xs text-gray-600">{booking.room?.roomType || "N/A"}</p>
                            </div>
                          </td>
                          <td className="px-4 py-3">
                            <span className="text-sm text-gray-700 font-semibold whitespace-nowrap">
                              {new Date(booking.checkIn).toLocaleDateString()}
                            </span>
                          </td>
                          <td className="px-4 py-3">
                            <span className="text-sm text-gray-700 font-semibold whitespace-nowrap">
                              {new Date(booking.checkOut).toLocaleDateString()}
                            </span>
                          </td>
                          <td className="px-4 py-3">
                            <div className="flex items-center space-x-1">
                              <Users size={14} className="text-orange-600" />
                              <span className="text-sm font-bold text-gray-700">
                                {booking.guests.adults + booking.guests.children + booking.guests.infants}
                              </span>
                            </div>
                          </td>
                          <td className="px-4 py-3">
                            <div className="flex items-center space-x-1">
                              <IndianRupee size={14} className="text-green-600" />
                              <span className="text-sm font-bold text-gray-900">
                                {booking.totalAmount.toLocaleString()}
                              </span>
                            </div>
                          </td>
                          <td className="px-4 py-3">
                            <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold ${getStatusColor(booking.bookingStatus)}`}>
                              {booking.bookingStatus}
                            </span>
                          </td>
                          <td className="px-4 py-3">
                            <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold ${getPaymentStatusColor(booking.paymentStatus)}`}>
                              {booking.paymentStatus}
                            </span>
                          </td>
                          <td className="px-4 py-3">
                            <div className="flex items-center justify-center gap-2">
                              <button
                                onClick={() => handleViewDetails(booking)}
                                className="p-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg shadow-md transform hover:scale-110 transition-all duration-300"
                                title="View Details"
                              >
                                <Eye size={14} />
                              </button>
                              <button
                                onClick={() => handleDeleteClick(booking._id)}
                                className="p-2 bg-red-600 hover:bg-red-700 text-white rounded-lg shadow-md transform hover:scale-110 transition-all duration-300"
                                title="Delete"
                              >
                                <Trash2 size={14} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
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
              Delete Booking?
            </AlertDialogTitle>
            <AlertDialogDescription className="text-gray-600 text-base">
              Are you sure you want to delete this booking? This action cannot be undone.
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

      {/* View Details Dialog */}
      <AlertDialog open={viewDialogOpen} onOpenChange={setViewDialogOpen}>
        <AlertDialogContent className="bg-white border-2 border-orange-200 max-w-2xl max-h-[80vh] overflow-y-auto">
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center text-xl font-black text-gray-900">
              <Eye className="mr-2 text-orange-600" size={24} />
              Booking Details
            </AlertDialogTitle>
          </AlertDialogHeader>
          {selectedBooking && (
            <div className="space-y-4">
              {/* Booking Info */}
              <div className="bg-gradient-to-r from-orange-50 to-amber-50 p-4 rounded-lg border-2 border-amber-200">
                <h3 className="font-black text-lg text-orange-900 mb-2">Booking Information</h3>
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div>
                    <p className="text-gray-600">Booking ID</p>
                    <p className="font-bold text-orange-600">{selectedBooking.bookingId}</p>
                  </div>
                  <div>
                    <p className="text-gray-600">Source</p>
                    <p className="font-bold">{selectedBooking.source}</p>
                  </div>
                  <div>
                    <p className="text-gray-600">Created</p>
                    <p className="font-bold">{new Date(selectedBooking.createdAt).toLocaleString()}</p>
                  </div>
                  <div>
                    <p className="text-gray-600">Nights</p>
                    <p className="font-bold">{calculateNights(selectedBooking.checkIn, selectedBooking.checkOut)}</p>
                  </div>
                </div>
              </div>

              {/* Customer Info */}
              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-4 rounded-lg border-2 border-blue-200">
                <h3 className="font-black text-lg text-blue-900 mb-2 flex items-center">
                  <User size={20} className="mr-2" />
                  Customer Details
                </h3>
                <div className="grid grid-cols-1 gap-3 text-sm">
                  <div>
                    <p className="text-gray-600">Name</p>
                    <p className="font-bold text-gray-900">{selectedBooking.customer?.name || "N/A"}</p>
                  </div>
                  <div>
                    <p className="text-gray-600">Email</p>
                    <p className="font-bold text-gray-900">{selectedBooking.customer?.email || "N/A"}</p>
                  </div>
                  <div>
                    <p className="text-gray-600">Phone</p>
                    <p className="font-bold text-gray-900">{selectedBooking.customer?.phone || "N/A"}</p>
                  </div>
                </div>
              </div>

              {/* Room Info */}
              <div className="bg-gradient-to-r from-purple-50 to-pink-50 p-4 rounded-lg border-2 border-purple-200">
                <h3 className="font-black text-lg text-purple-900 mb-2 flex items-center">
                  <Bed size={20} className="mr-2" />
                  Room Details
                </h3>
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div>
                    <p className="text-gray-600">Room Number</p>
                    <p className="font-bold text-gray-900">#{selectedBooking.room?.roomNumber || "N/A"}</p>
                  </div>
                  <div>
                    <p className="text-gray-600">Room Type</p>
                    <p className="font-bold text-gray-900">{selectedBooking.room?.roomType || "N/A"}</p>
                  </div>
                  <div>
                    <p className="text-gray-600">Check-in</p>
                    <p className="font-bold text-gray-900">{new Date(selectedBooking.checkIn).toLocaleDateString()}</p>
                  </div>
                  <div>
                    <p className="text-gray-600">Check-out</p>
                    <p className="font-bold text-gray-900">{new Date(selectedBooking.checkOut).toLocaleDateString()}</p>
                  </div>
                </div>
              </div>

              {/* Guests Info */}
              <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-4 rounded-lg border-2 border-green-200">
                <h3 className="font-black text-lg text-green-900 mb-2 flex items-center">
                  <Users size={20} className="mr-2" />
                  Guest Information
                </h3>
                <div className="grid grid-cols-3 gap-3 text-sm">
                  <div>
                    <p className="text-gray-600">Adults</p>
                    <p className="font-bold text-gray-900">{selectedBooking.guests.adults}</p>
                  </div>
                  <div>
                    <p className="text-gray-600">Children</p>
                    <p className="font-bold text-gray-900">{selectedBooking.guests.children}</p>
                  </div>
                  <div>
                    <p className="text-gray-600">Infants</p>
                    <p className="font-bold text-gray-900">{selectedBooking.guests.infants}</p>
                  </div>
                </div>

                {selectedBooking.guestDetails && selectedBooking.guestDetails.length > 0 && (
                  <div className="mt-3 pt-3 border-t border-green-300">
                    <p className="text-gray-600 font-semibold mb-2">Guest Details:</p>
                    <div className="space-y-2">
                      {selectedBooking.guestDetails.map((guest, index) => (
                        <div key={index} className="bg-white/50 p-2 rounded">
                          <p className="font-bold text-xs">{guest.name}</p>
                          {guest.age && <p className="text-xs text-gray-600">Age: {guest.age}</p>}
                          {guest.idType && <p className="text-xs text-gray-600">{guest.idType}: {guest.idNumber}</p>}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Payment Info */}
              <div className="bg-gradient-to-r from-amber-50 to-yellow-50 p-4 rounded-lg border-2 border-amber-200">
                <h3 className="font-black text-lg text-amber-900 mb-2 flex items-center">
                  <IndianRupee size={20} className="mr-2" />
                  Payment Details
                </h3>
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div>
                    <p className="text-gray-600">Room Rate</p>
                    <p className="font-bold text-gray-900">₹{selectedBooking.roomRate.toLocaleString()}</p>
                  </div>
                  <div>
                    <p className="text-gray-600">Taxes</p>
                    <p className="font-bold text-gray-900">₹{selectedBooking.taxes.toLocaleString()}</p>
                  </div>
                  <div>
                    <p className="text-gray-600">Discount</p>
                    <p className="font-bold text-green-600">-₹{selectedBooking.discount.toLocaleString()}</p>
                  </div>
                  <div>
                    <p className="text-gray-600">Total Amount</p>
                    <p className="font-bold text-lg text-orange-600">₹{selectedBooking.totalAmount.toLocaleString()}</p>
                  </div>
                  <div>
                    <p className="text-gray-600">Payment Status</p>
                    <span className={`inline-flex px-2 py-1 rounded-full text-xs font-bold ${getPaymentStatusColor(selectedBooking.paymentStatus)}`}>
                      {selectedBooking.paymentStatus}
                    </span>
                  </div>
                  {selectedBooking.paymentMethod && (
                    <div>
                      <p className="text-gray-600">Payment Method</p>
                      <p className="font-bold text-gray-900">{selectedBooking.paymentMethod}</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Status & Special Requests */}
              <div className="bg-gradient-to-r from-gray-50 to-slate-50 p-4 rounded-lg border-2 border-gray-200">
                <h3 className="font-black text-lg text-gray-900 mb-2 flex items-center">
                  <CheckCircle size={20} className="mr-2" />
                  Status & Notes
                </h3>
                <div className="space-y-3 text-sm">
                  <div>
                    <p className="text-gray-600">Booking Status</p>
                    <span className={`inline-flex px-3 py-1 rounded-full text-xs font-bold ${getStatusColor(selectedBooking.bookingStatus)}`}>
                      {selectedBooking.bookingStatus}
                    </span>
                  </div>
                  {selectedBooking.specialRequests && (
                    <div>
                      <p className="text-gray-600 font-semibold">Special Requests:</p>
                      <p className="font-medium text-gray-900 bg-white p-2 rounded mt-1">
                        {selectedBooking.specialRequests}
                      </p>
                    </div>
                  )}
                  {selectedBooking.notes && (
                    <div>
                      <p className="text-gray-600 font-semibold">Notes:</p>
                      <p className="font-medium text-gray-900 bg-white p-2 rounded mt-1">
                        {selectedBooking.notes}
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-2 pt-4 border-t-2 border-gray-200">
                <button
                  onClick={() => updateBookingStatus(selectedBooking._id, "Checked-In")}
                  className="flex-1 bg-green-600 hover:bg-green-700 text-white font-bold px-4 py-2 rounded-lg shadow-md transition-all duration-300 flex items-center justify-center gap-2"
                  disabled={selectedBooking.bookingStatus === "Checked-In"}
                >
                  <Check size={16} />
                  Check-In
                </button>
                <button
                  onClick={() => updateBookingStatus(selectedBooking._id, "Checked-Out")}
                  className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-bold px-4 py-2 rounded-lg shadow-md transition-all duration-300 flex items-center justify-center gap-2"
                  disabled={selectedBooking.bookingStatus === "Checked-Out"}
                >
                  <CheckCircle size={16} />
                  Check-Out
                </button>
                <button
                  onClick={() => updateBookingStatus(selectedBooking._id, "Cancelled")}
                  className="flex-1 bg-red-600 hover:bg-red-700 text-white font-bold px-4 py-2 rounded-lg shadow-md transition-all duration-300 flex items-center justify-center gap-2"
                  disabled={selectedBooking.bookingStatus === "Cancelled"}
                >
                  <XCircle size={16} />
                  Cancel
                </button>
              </div>
            </div>
          )}
          <AlertDialogFooter>
            <AlertDialogCancel className="bg-orange-600 hover:bg-orange-700 text-white font-bold px-6 py-2 rounded-lg">
              Close
            </AlertDialogCancel>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}