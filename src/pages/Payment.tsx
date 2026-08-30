import React, { useState } from "react";
import { useNavigate, Link, useLocation } from "react-router-dom";

export default function PaymentPage() {
  const navigate  = useNavigate();
  const location  = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);
  const [paid, setPaid]         = useState(false);

  const isLoggedIn = !!localStorage.getItem("user");

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/");
    window.location.reload();
  };

  // ✅ Read real booking data passed from MyBookings
  const booking       = location.state || {};
  const technicianName = booking.technicianName || "Your Technician";
  const description   = booking.description    || "No description provided.";
  const timeslot      = booking.timeslot
    ? new Date(booking.timeslot).toLocaleString()
    : "Confirmed Appointment";
  const jobPrice    = booking.jobPrice    || 0;
  const bookingFee  = booking.bookingFee  || 0;
  const platformFee = booking.platformFee || 0;
  const totalAmount = booking.totalAmount || 0;
  const remaining   = totalAmount - bookingFee;

  // Guard — if no booking data, redirect
  if (!booking.bookingId) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <p className="text-gray-500 mb-4">No booking data found.</p>
          <button
            onClick={() => navigate("/myBookings")}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
          >
            Go to My Bookings
          </button>
        </div>
      </div>
    );
  }

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
          <button
            className="md:hidden flex flex-col justify-center items-center w-9 h-9 space-y-1.5"
            onClick={() => setMenuOpen(p => !p)}
          >
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
      <main className="flex-1 flex justify-center items-start px-4 py-10">
        <div className="w-full max-w-md">

          {paid ? (
            /* ── SUCCESS STATE ── */
            <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-8 text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-green-500" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h2 className="text-2xl font-semibold text-gray-800 mb-2">Booking Confirmed!</h2>
              <p className="text-gray-500 text-sm mb-2">
                Your booking with <span className="font-medium text-gray-700">{technicianName}</span> is confirmed.
              </p>
              <p className="text-gray-400 text-xs mb-6">
                Pay the remaining <span className="font-semibold text-gray-600">{remaining.toLocaleString()} LEK</span> directly to the technician after the job is done.
              </p>
              <button
                onClick={() => navigate("/myBookings")}
                className="w-full bg-blue-600 text-white py-2.5 rounded-lg text-sm font-medium hover:bg-blue-700 transition"
              >
                📋 View My Bookings
              </button>
            </div>

          ) : (
            /* ── PAYMENT FORM ── */
            <>
              <h2 className="text-2xl font-semibold text-gray-800 mb-1">Complete Payment</h2>
              <p className="text-sm text-gray-500 mb-6">
                Pay your deposit to confirm the booking with <span className="font-medium">{technicianName}</span>.
              </p>

              {/* Booking Summary */}
              <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-5 mb-4">
                <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-3">
                  Booking Summary
                </h3>
                <div className="space-y-2 text-sm text-gray-700">
                  <div className="flex justify-between">
                    <span className="text-gray-500">Technician</span>
                    <span className="font-medium">{technicianName}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Appointment</span>
                    <span className="font-medium">{timeslot}</span>
                  </div>
                  <div className="flex justify-between items-start gap-4">
                    <span className="text-gray-500 shrink-0">Problem</span>
                    <span className="font-medium text-right italic text-gray-700">{description}</span>
                  </div>
                </div>
              </div>

              {/* Fee Breakdown */}
              <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-5 mb-4">
                <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-3">
                  Fee Breakdown
                </h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between text-gray-600">
                    <span>Job Price</span>
                    <span>{jobPrice.toLocaleString()} LEK</span>
                  </div>
                  <div className="flex justify-between text-gray-400 text-xs">
                    <span>Platform Fee (2%)</span>
                    <span>{platformFee.toLocaleString()} LEK</span>
                  </div>
                  <div className="border-t border-gray-100 pt-2 mt-1 flex justify-between text-gray-600">
                    <span>Remaining after job</span>
                    <span>{remaining.toLocaleString()} LEK</span>
                  </div>
                  <div className="border-t border-gray-200 pt-2 mt-1 flex justify-between font-bold text-gray-800 text-base">
                    <span>Deposit Due Now</span>
                    <span className="text-blue-600">{bookingFee.toLocaleString()} LEK</span>
                  </div>
                </div>
              </div>

              {/* Payment method — placeholder until gateway added */}
              <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-5 mb-5">
                <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-3">
                  Payment Method
                </h3>
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg px-4 py-3 text-sm text-yellow-800">
                  <p className="font-semibold mb-1">💵 Cash Payment</p>
                  <p className="text-xs text-yellow-700">
                    Pay <span className="font-bold">{bookingFee.toLocaleString()} LEK</span> in cash to the technician when they arrive. Online payments coming soon.
                  </p>
                </div>
              </div>

              {/* Confirm button */}
              <button
                onClick={() => setPaid(true)}
                className="w-full bg-green-600 text-white py-3 rounded-xl text-sm font-semibold hover:bg-green-700 transition shadow-sm"
              >
                ✅ I Understand — Confirm Booking
              </button>

              <p className="text-center text-xs text-gray-400 mt-3">
                Pay {bookingFee.toLocaleString()} LEK cash on arrival · {remaining.toLocaleString()} LEK after job done
              </p>
            </>
          )}

        </div>
      </main>

      {/* FOOTER */}
      <footer className="bg-white shadow-inner py-6 text-center text-gray-500 text-sm">
        © {new Date().getFullYear()} OneFixAL – All rights reserved.
      </footer>
    </div>
  );
}
