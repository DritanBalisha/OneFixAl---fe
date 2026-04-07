import React, { useState } from "react";
import { useNavigate, Link, useLocation } from "react-router-dom";

export default function PaymentPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);
  const [paying, setPaying] = useState(false);
  const [paid, setPaid] = useState(false);

  const isLoggedIn = !!localStorage.getItem("user");

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/");
    window.location.reload();
  };

  // Accept booking details passed via router state, or fall back to defaults
  const booking = location.state || {};
  const technicianName = booking.technicianName || "Your Technician";
  const timeslot = booking.timeslot
    ? new Date(booking.timeslot).toLocaleString()
    : "Confirmed Appointment";
  const description = booking.description || "No description provided.";
  const fee = booking.fee ?? 20;

  const handlePay = async () => {
    setPaying(true);
    // Simulate payment processing delay
    await new Promise((r) => setTimeout(r, 1800));
    setPaying(false);
    setPaid(true);
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
              <h2 className="text-2xl font-semibold text-gray-800 mb-2">Payment Successful!</h2>
              <p className="text-gray-500 text-sm mb-6">
                Your booking with <span className="font-medium text-gray-700">{technicianName}</span> is now fully confirmed. You'll receive a notification shortly.
              </p>
              <button
                onClick={() => navigate("/my-bookings")}
                className="w-full bg-blue-600 text-white py-2.5 rounded-lg text-sm font-medium hover:bg-blue-700 transition"
              >
                View My Bookings
              </button>
            </div>
          ) : (
            /* ── PAYMENT FORM ── */
            <>
              <h2 className="text-2xl font-semibold text-gray-800 mb-1">Complete Payment</h2>
              <p className="text-sm text-gray-500 mb-6">
                Your technician confirmed the booking. Pay the booking fee to finalize.
              </p>

              {/* Booking Summary */}
              <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-5 mb-5">
                <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-3">Booking Summary</h3>

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
                    <span className="font-medium text-right text-gray-700 italic">{description}</span>
                  </div>
                </div>

                <div className="border-t border-gray-100 mt-4 pt-4 flex justify-between items-center">
                  <span className="text-sm font-semibold text-gray-700">Booking Fee</span>
                  <span className="text-xl font-bold text-gray-900">${fee}.00</span>
                </div>
              </div>

              {/* Payment method placeholder */}
              <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-5 mb-5">
                <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-3">Payment Method</h3>
                <div className="flex items-center gap-3 border border-blue-200 bg-blue-50 rounded-lg px-4 py-3">
                  <div className="w-8 h-5 bg-blue-600 rounded-sm flex items-center justify-center">
                    <span className="text-white text-xs font-bold">💳</span>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-800">Card ending in 4242</p>
                    <p className="text-xs text-gray-400">Expires 12/27</p>
                  </div>
                  <span className="ml-auto text-xs text-blue-600 font-medium">Change</span>
                </div>
              </div>

              {/* Pay button */}
              <button
                onClick={handlePay}
                disabled={paying}
                className="w-full bg-green-600 text-white py-3 rounded-xl text-sm font-semibold hover:bg-green-700 transition disabled:opacity-60 flex items-center justify-center gap-2 shadow-sm"
              >
                {paying ? (
                  <>
                    <svg className="animate-spin w-4 h-4 text-white" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                    </svg>
                    Processing...
                  </>
                ) : (
                  `Pay $${fee}.00`
                )}
              </button>

              <p className="text-center text-xs text-gray-400 mt-3">
                🔒 Payments are secure and encrypted
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
