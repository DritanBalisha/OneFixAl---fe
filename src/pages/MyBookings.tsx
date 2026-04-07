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
  created_at: string;
  technician_name?: string;
  customer_name?: string;
};

export default function MyBookings() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();

  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const token = localStorage.getItem("token");
  const isLoggedIn = !!localStorage.getItem("user");

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
        setBookings(data);
      } catch (err) {
        console.error("Error fetching bookings:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchBookings();
  }, []);

  const updateBookingStatus = async (id: number, status: string) => {
    try {
      const res = await fetch(`${API_URL}/bookings/${id}/status`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status }),
      });

      if (!res.ok) throw new Error("Failed to update status");

      const updated = await res.json();

      if (status === "cancelled") {
        setBookings((prev) => prev.filter((b) => b.id !== id));
      } else {
        setBookings((prev) =>
          prev.map((b) => (b.id === id ? updated.booking : b))
        );
      }

      alert(`Booking ${status} ✅`);
    } catch (err) {
      console.error("Status update error:", err);
      alert("Failed to update status ❌");
    }
  };

  const statusStyle = (status: string) => {
    if (status === "confirmed") return "text-green-600 bg-green-50 border border-green-200";
    if (status === "cancelled") return "text-red-600 bg-red-50 border border-red-200";
    return "text-yellow-600 bg-yellow-50 border border-yellow-200";
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      {/* NAVBAR */}
      <nav className="w-full bg-white shadow-sm py-4 px-6">
        <div className="flex justify-between items-center">
          <h1
            className="text-2xl font-semibold text-blue-600 cursor-pointer"
            onClick={() => navigate("/")}
          >
            OneFixAL
          </h1>

          {/* Desktop Links */}
          <div className="hidden md:flex items-center space-x-4">
            <Link to="/techprofiles" className="text-gray-700 hover:text-blue-600">
              Book a Tech
            </Link>
            <Link
              to="/myProfile"
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
            >
              Profile
            </Link>
            {isLoggedIn ? (
              <button
                onClick={handleLogout}
                className="text-red-500 font-medium hover:bg-red-50 px-3 py-2 rounded-md transition"
              >
                Logout 🚪
              </button>
            ) : (
              <Link to="/login" className="text-blue-600 font-medium hover:underline">
                Login
              </Link>
            )}
          </div>

          {/* Mobile Hamburger */}
          <button
            className="md:hidden flex flex-col justify-center items-center w-9 h-9 space-y-1.5 focus:outline-none"
            onClick={() => setMenuOpen((prev) => !prev)}
            aria-label="Toggle menu"
          >
            <span className={`block h-0.5 w-6 bg-gray-700 transition-transform duration-300 ${menuOpen ? "rotate-45 translate-y-2" : ""}`} />
            <span className={`block h-0.5 w-6 bg-gray-700 transition-opacity duration-300 ${menuOpen ? "opacity-0" : ""}`} />
            <span className={`block h-0.5 w-6 bg-gray-700 transition-transform duration-300 ${menuOpen ? "-rotate-45 -translate-y-2" : ""}`} />
          </button>
        </div>

        {/* Mobile Menu */}
        {menuOpen && (
          <div className="md:hidden mt-4 flex flex-col space-y-3 border-t pt-4">
            <Link
              to="/techprofiles"
              className="text-gray-700 hover:text-blue-600 py-1"
              onClick={() => setMenuOpen(false)}
            >
              Book a Tech
            </Link>
            <Link
              to="/myProfile"
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 text-center"
              onClick={() => setMenuOpen(false)}
            >
              Profile
            </Link>
            {isLoggedIn ? (
              <button
                onClick={() => { setMenuOpen(false); handleLogout(); }}
                className="text-red-500 font-medium hover:bg-red-50 px-3 py-2 rounded-md transition text-left"
              >
                Logout 🚪
              </button>
            ) : (
              <Link
                to="/login"
                className="text-blue-600 font-medium hover:underline py-1"
                onClick={() => setMenuOpen(false)}
              >
                Login
              </Link>
            )}
          </div>
        )}
      </nav>

      {/* PAGE CONTENT */}
      <main className="flex-1 px-4 py-10 max-w-4xl mx-auto w-full">
        <h2 className="text-2xl font-semibold text-gray-800 mb-1">My Bookings</h2>
        <p className="text-sm text-gray-500 mb-6">
          {user.role === "technician"
            ? "Jobs that clients have booked with you."
            : "Your scheduled appointments with technicians."}
        </p>

        {loading ? (
          <p className="text-gray-400 text-center py-16 animate-pulse">Loading bookings...</p>
        ) : bookings.length === 0 ? (
          <p className="text-gray-400 text-center py-16">No bookings found.</p>
        ) : (
          <div className="space-y-4">
            {bookings.map((b) => (
              <div
                key={b.id}
                className="bg-white border border-gray-200 rounded-xl shadow-sm p-5"
              >
                {/* Top row: date + status badge */}
                <div className="flex flex-wrap justify-between items-center gap-2 mb-3">
                  <p className="text-sm text-gray-500">
                    📅 {new Date(b.timeslot).toLocaleString()}
                  </p>
                  <span className={`text-xs font-semibold px-3 py-1 rounded-full capitalize ${statusStyle(b.status)}`}>
                    {b.status}
                  </span>
                </div>

                {/* Person info */}
                <div className="text-sm text-gray-700 mb-3">
                  {user.role === "client" && (
                    <p><span className="font-medium">Technician:</span> {b.technician_name || b.technician_id}</p>
                  )}
                  {user.role === "technician" && (
                    <p><span className="font-medium">Client:</span> {b.customer_name || b.customer_id}</p>
                  )}
                </div>

                {/* Problem description */}
                {b.description && (
                  <div className="bg-blue-50 border-l-4 border-blue-500 rounded-r-lg px-4 py-3 mb-4">
                    <p className="text-xs font-semibold text-blue-600 mb-1">Problem Description</p>
                    <p className="text-gray-700 text-sm italic">{b.description}</p>
                  </div>
                )}

                {/* Action buttons */}
                <div className="flex flex-wrap gap-2 mt-2">
                  {b.status === "pending" && (
                    <>
                      {user.role === "technician" && (
                        <button
                          onClick={() => updateBookingStatus(b.id, "confirmed")}
                          className="bg-green-500 text-white px-4 py-1.5 rounded-lg text-sm font-medium hover:bg-green-600 transition"
                        >
                          Accept Job
                        </button>
                      )}
                      <button
                        onClick={() => updateBookingStatus(b.id, "cancelled")}
                        className="bg-red-500 text-white px-4 py-1.5 rounded-lg text-sm font-medium hover:bg-red-600 transition"
                      >
                        Cancel
                      </button>
                    </>
                  )}

                  {b.status === "confirmed" && user.role === "technician" && (
                    <>
                      <button
                        onClick={() => alert("💰 Notify client to proceed with payment")}
                        className="bg-blue-500 text-white px-4 py-1.5 rounded-lg text-sm font-medium hover:bg-blue-600 transition"
                      >
                        Notify Client for Payment
                      </button>
                      <button
                        onClick={() => updateBookingStatus(b.id, "cancelled")}
                        className="bg-red-500 text-white px-4 py-1.5 rounded-lg text-sm font-medium hover:bg-red-600 transition"
                      >
                        Cancel Job
                      </button>
                    </>
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
