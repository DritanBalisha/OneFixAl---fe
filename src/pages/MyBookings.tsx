import React, { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { API_URL } from "../api/config.ts";

type Booking = {
  id: number;
  technician_id: number;
  customer_id: number;
  availability_id: number;
  timeslot: string;
  description: string;
  status: string;
  payment_status: string;
  job_price: number;
  booking_fee: number;
  platform_fee: number;
  total_amount: number;
  created_at: string;
  technician?: { id: number; name: string; email: string; phone: string };
  customer?:   { id: number; name: string; email: string; phone: string };
};

export default function MyBookings() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading]   = useState(true);
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();

  const user       = JSON.parse(localStorage.getItem("user") || "{}");
  const token      = localStorage.getItem("token");
  const isLoggedIn = !!token;
  const isTech     = user.role === "technician";

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/");
    window.location.reload();
  };

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const res = await fetch(`${API_URL}/my-bookings`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) throw new Error("Failed to load bookings");
        const data = await res.json();
        // ✅ Sort newest first
        const sorted = [...data].sort(
          (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
        );
        setBookings(sorted);
      } catch (err) {
        console.error("Error fetching bookings:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchBookings();
  }, []);

  const updateStatus = async (id: number, status: string) => {
    try {
      const res = await fetch(`${API_URL}/bookings/${id}/status`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status }),
      });
      if (!res.ok) throw new Error("Failed to update");
      const data = await res.json();
      if (status === "cancelled") {
        setBookings((prev) => prev.filter((b) => b.id !== id));
      } else {
        setBookings((prev) => prev.map((b) => b.id === id ? data.booking : b));
      }
    } catch (err) {
      alert("Failed to update booking ❌");
    }
  };

  // ✅ Delete completed/cancelled bookings from view
  const deleteBooking = async (id: number) => {
    if (!window.confirm("Remove this booking from your list?")) return;
    try {
      const res = await fetch(`${API_URL}/bookings/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("Failed to delete");
      setBookings((prev) => prev.filter((b) => b.id !== id));
    } catch (err) {
      alert("Failed to delete booking ❌");
    }
  };

  const statusStyle = (status: string) => {
    if (status === "confirmed")   return "text-green-700 bg-green-50 border-green-200";
    if (status === "cancelled")   return "text-red-700 bg-red-50 border-red-200";
    if (status === "completed")   return "text-blue-700 bg-blue-50 border-blue-200";
    if (status === "in_progress") return "text-purple-700 bg-purple-50 border-purple-200";
    if (status === "price_set")   return "text-orange-700 bg-orange-50 border-orange-200";
    return "text-yellow-700 bg-yellow-50 border-yellow-200";
  };

  const paymentStyle = (status: string) => {
    if (status === "fully_paid")   return "text-green-600";
    if (status === "deposit_paid") return "text-blue-600";
    return "text-red-500";
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">

      {/* NAVBAR */}
      <nav className="w-full bg-white shadow-sm py-4 px-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-semibold text-blue-600 cursor-pointer" onClick={() => navigate("/")}>
            OneFixAL
          </h1>
          <div className="hidden md:flex items-center space-x-4">
            <Link to="/techprofiles" className="text-gray-700 hover:text-blue-600">Book a Tech</Link>
            <Link to="/myProfile" className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">Profile</Link>
            {isLoggedIn ? (
              <button onClick={handleLogout} className="text-red-500 font-medium hover:bg-red-50 px-3 py-2 rounded-md transition">
                Logout 🚪
              </button>
            ) : (
              <Link to="/login" className="text-blue-600 font-medium hover:underline">Login</Link>
            )}
          </div>
          <button className="md:hidden flex flex-col justify-center items-center w-9 h-9 space-y-1.5" onClick={() => setMenuOpen(p => !p)}>
            <span className={`block h-0.5 w-6 bg-gray-700 transition-transform duration-300 ${menuOpen ? "rotate-45 translate-y-2" : ""}`} />
            <span className={`block h-0.5 w-6 bg-gray-700 transition-opacity duration-300 ${menuOpen ? "opacity-0" : ""}`} />
            <span className={`block h-0.5 w-6 bg-gray-700 transition-transform duration-300 ${menuOpen ? "-rotate-45 -translate-y-2" : ""}`} />
          </button>
        </div>
        {menuOpen && (
          <div className="md:hidden mt-4 flex flex-col space-y-3 border-t pt-4">
            <Link to="/techprofiles" className="text-gray-700 py-1" onClick={() => setMenuOpen(false)}>Book a Tech</Link>
            <Link to="/myProfile" className="bg-blue-600 text-white px-4 py-2 rounded-lg text-center" onClick={() => setMenuOpen(false)}>Profile</Link>
            {isLoggedIn ? (
              <button onClick={() => { setMenuOpen(false); handleLogout(); }} className="text-red-500 text-left px-3 py-2">Logout 🚪</button>
            ) : (
              <Link to="/login" className="text-blue-600 py-1" onClick={() => setMenuOpen(false)}>Login</Link>
            )}
          </div>
        )}
      </nav>

      {/* PAGE CONTENT */}
      <main className="flex-1 px-4 py-10 max-w-4xl mx-auto w-full">
        <h2 className="text-2xl font-semibold text-gray-800 mb-1">My Bookings</h2>
        <p className="text-sm text-gray-500 mb-6">
          {isTech ? "Jobs clients have booked with you." : "Your appointments with technicians."}
        </p>

        {loading ? (
          <p className="text-gray-400 text-center py-16 animate-pulse">Loading bookings...</p>
        ) : bookings.length === 0 ? (
          <p className="text-gray-400 text-center py-16">No bookings yet.</p>
        ) : (
          <div className="space-y-4">
            {bookings.map((b) => (
              <div key={b.id} className="bg-white border border-gray-200 rounded-xl shadow-sm p-5">

                {/* Status + payment + delete */}
                <div className="flex flex-wrap justify-between items-center gap-2 mb-4">
                  <div className="flex items-center gap-2">
                    <span className={`text-xs font-semibold px-3 py-1 rounded-full capitalize border ${statusStyle(b.status)}`}>
                      {b.status.replace("_", " ")}
                    </span>
                    <span className={`text-xs font-medium ${paymentStyle(b.payment_status)}`}>
                      💳 {b.payment_status?.replace("_", " ") || "unpaid"}
                    </span>
                  </div>

                  {/* ✅ Delete button — only on completed or cancelled */}
                  {["completed", "cancelled"].includes(b.status) && (
                    <button
                      onClick={() => deleteBooking(b.id)}
                      className="text-xs text-gray-400 hover:text-red-500 transition"
                      title="Remove from list"
                    >
                      🗑️ Remove
                    </button>
                  )}
                </div>

                {/* Date */}
                {b.created_at && (
                  <p className="text-xs text-gray-400 mb-3">
                    📅 Booked on {new Date(b.created_at).toLocaleDateString("en-GB", {
                      day: "numeric", month: "short", year: "numeric"
                    })}
                  </p>
                )}

                {/* Person info */}
                <div className="text-sm text-gray-700 mb-3 space-y-0.5">
                  {!isTech && b.technician && (
                    <>
                      <p><span className="font-medium">Technician:</span> {b.technician.name}</p>
                      <p><span className="font-medium">Phone:</span> {b.technician.phone}</p>
                    </>
                  )}
                  {isTech && b.customer && (
                    <>
                      <p><span className="font-medium">Client:</span> {b.customer.name}</p>
                      <p><span className="font-medium">Phone:</span> {b.customer.phone}</p>
                    </>
                  )}
                </div>

                {/* Description */}
                {b.description && (
                  <div className="bg-blue-50 border-l-4 border-blue-500 rounded-r-lg px-4 py-3 mb-4">
                    <p className="text-xs font-semibold text-blue-600 mb-1">Problem</p>
                    <p className="text-gray-700 text-sm">{b.description}</p>
                  </div>
                )}

                {/* Fee breakdown */}
                {b.job_price > 0 && (
                  <div className="bg-gray-50 border border-gray-200 rounded-lg p-3 mb-4 text-sm space-y-1">
                    <div className="flex justify-between text-gray-600">
                      <span>Job Price</span>
                      <span>{b.job_price?.toLocaleString()} LEK</span>
                    </div>
                    <div className="flex justify-between text-blue-600">
                      <span>Booking Deposit (10%)</span>
                      <span>{b.booking_fee?.toLocaleString()} LEK</span>
                    </div>
                    <div className="flex justify-between text-gray-400 text-xs">
                      <span>Platform Fee (2%)</span>
                      <span>{b.platform_fee?.toLocaleString()} LEK</span>
                    </div>
                    <div className="border-t border-gray-200 pt-1 mt-1 flex justify-between font-semibold text-gray-800">
                      <span>Total</span>
                      <span>{b.total_amount?.toLocaleString()} LEK</span>
                    </div>
                  </div>
                )}

                {/* Action buttons */}
                <div className="flex flex-wrap gap-2">

                  {/* TECHNICIAN — pending: set price */}
                  {b.status === "pending" && isTech && (
                    <SetPriceForm
                      bookingId={b.id}
                      token={token!}
                      onPriceSet={(updated) =>
                        setBookings(prev => prev.map(x => x.id === b.id ? updated : x))
                      }
                    />
                  )}

                  {/* CLIENT — price set: accept or decline */}
                  {b.status === "price_set" && !isTech && (
                    <div className="w-full space-y-2">
                      <div className="bg-yellow-50 border border-yellow-200 rounded-lg px-4 py-3 text-sm">
                        <p className="font-semibold text-yellow-800 mb-1">
                          ⚠️ Technician set a price — review and decide
                        </p>
                        <p className="text-gray-600">
                          Job: <span className="font-medium">{b.job_price?.toLocaleString()} LEK</span>
                        </p>
                        <p className="text-gray-600">
                          Deposit due: <span className="font-medium text-blue-600">{b.booking_fee?.toLocaleString()} LEK</span>
                        </p>
                        <p className="text-gray-400 text-xs">
                          Platform fee: {b.platform_fee?.toLocaleString()} LEK
                        </p>
                      </div>
                      <div className="flex gap-2">
                       <button
  onClick={async () => {
    const res = await fetch(`${API_URL}/bookings/${b.id}/accept-price`, {
      method: "POST",
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await res.json();
if (res.ok) {
  setBookings(prev => prev.map(x => x.id === b.id ? data.booking : x));
  // ✅ navigate to payment page with booking data
  navigate("/payment", {
    state: {
      bookingId:     data.booking.id,
      technicianName: b.technician?.name || "Technician",
      description:   data.booking.description,
      timeslot:      data.booking.timeslot,
      jobPrice:      data.booking.job_price,
      bookingFee:    data.booking.booking_fee,
      platformFee:   data.booking.platform_fee,
      totalAmount:   data.booking.total_amount,
    }
  });
} else {
  alert(data.error || "Failed to accept ❌");
}
  }}
  className="bg-green-500 text-white px-4 py-1.5 rounded-lg text-sm font-medium hover:bg-green-600 transition"
>
  ✅ Accept Price
</button>
                        <button
                          onClick={() => updateStatus(b.id, "cancelled")}
                          className="bg-red-500 text-white px-4 py-1.5 rounded-lg text-sm font-medium hover:bg-red-600 transition"
                        >
                          ❌ Decline
                        </button>
                      </div>
                    </div>
                  )}

                  {/* ✅ CLIENT — confirmed: payment instructions */}
                  {b.status === "confirmed" && !isTech && (
                    <div className="w-full bg-green-50 border border-green-200 rounded-lg px-4 py-3 text-sm">
                      <p className="font-semibold text-green-800 mb-1">✅ Job Confirmed!</p>
                      <p className="text-gray-600">
                        Please pay the deposit of{" "}
                        <span className="font-semibold text-blue-600">
                          {b.booking_fee?.toLocaleString()} LEK
                        </span>{" "}
                        to the technician when they arrive.
                      </p>
                      <p className="text-gray-400 text-xs mt-1">
                        Remaining {((b.total_amount || 0) - (b.booking_fee || 0)).toLocaleString()} LEK due after job completion.
                      </p>
                    </div>
                  )}

                  {/* TECHNICIAN — confirmed: mark in progress */}
                  {b.status === "confirmed" && isTech && (
                    <button
                      onClick={() => updateStatus(b.id, "in_progress")}
                      className="bg-purple-500 text-white px-4 py-1.5 rounded-lg text-sm font-medium hover:bg-purple-600 transition"
                    >
                      🔧 Mark In Progress
                    </button>
                  )}

                  {/* TECHNICIAN — in progress: mark completed */}
                  {b.status === "in_progress" && isTech && (
                    <button
                      onClick={() => updateStatus(b.id, "completed")}
                      className="bg-blue-500 text-white px-4 py-1.5 rounded-lg text-sm font-medium hover:bg-blue-600 transition"
                    >
                      🏁 Mark Completed
                    </button>
                  )}

                  {/* Cancel — both sides, pending or price_set only */}
                  {["pending", "price_set"].includes(b.status) && (
                    <button
                      onClick={() => updateStatus(b.id, "cancelled")}
                      className="bg-red-500 text-white px-4 py-1.5 rounded-lg text-sm font-medium hover:bg-red-600 transition"
                    >
                      ❌ Cancel
                    </button>
                  )}

                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      {/* FOOTER */}
      <footer className="bg-white shadow-inner py-6 text-center text-gray-500 text-sm">
        © {new Date().getFullYear()} OneFixAL – All rights reserved.
      </footer>

    </div>
  );
}

// ── SetPriceForm ─────────────────────────────────────────────────
function SetPriceForm({ bookingId, token, onPriceSet }: {
  bookingId: number;
  token: string;
  onPriceSet: (updated: any) => void;
}) {
  const [price, setPrice]   = useState("");
  const [saving, setSaving] = useState(false);

  const handleSet = async () => {
    if (!price || Number(price) <= 0) return;
    setSaving(true);
    try {
      const res = await fetch(`${API_URL}/bookings/${bookingId}/set-price`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ job_price: Number(price) }),
      });
      const data = await res.json();
      if (res.ok) onPriceSet(data.booking);
      else alert(data.error || "Failed to set price ❌");
    } catch (err) {
      alert("Failed to set price ❌");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="flex items-center gap-2 w-full">
      <input
        type="number"
        min={1}
        placeholder="Set price in LEK"
        value={price}
        onChange={(e) => setPrice(e.target.value)}
        className="border border-gray-300 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 w-40"
      />
      <button
        onClick={handleSet}
        disabled={saving}
        className="bg-green-500 text-white px-4 py-1.5 rounded-lg text-sm font-medium hover:bg-green-600 disabled:opacity-50 transition"
      >
        {saving ? "Saving..." : "✅ Set Price"}
      </button>
    </div>
  );
}
