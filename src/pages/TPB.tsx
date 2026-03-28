"use client";
import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { API_URL } from "../api/config.ts";

type Technician = {
  id: number;
  name: string;
  email: string;
  phone: string;
};

type Availability = {
  id: number;
  dayOfWeek: number;
  startTime: string;
  endTime: string;
  is_booked: boolean;
};

const DAY_NAMES = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

export default function TechnicianProfile() {
  const { id } = useParams<{ id: string }>();
  const [technician, setTechnician] = useState<Technician | null>(null);
  const [availability, setAvailability] = useState<Availability[]>([]);
  const [description, setDescription] = useState("");
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();

  const isLoggedIn = !!localStorage.getItem("user");

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/");
    window.location.reload();
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
      return;
    }

    const fetchData = async () => {
      try {
        const [techRes, availRes] = await Promise.all([
          fetch(`${API_URL}/users/${id}`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
          fetch(`${API_URL}/availability/${id}`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
        ]);

        if (!techRes.ok) throw new Error("Failed to fetch technician");
        if (!availRes.ok) throw new Error("Failed to fetch availability");

        const techData = await techRes.json();
        const availData = await availRes.json();

        setTechnician(techData);
        setAvailability(availData);
      } catch (err) {
        console.error("Error loading technician:", err);
      }
    };

    fetchData();
  }, [id, navigate]);

  const createBooking = async (slotId: number) => {
    const token = localStorage.getItem("token");
    const user = JSON.parse(localStorage.getItem("user") || "{}");

    if (!token || !user?.id) {
      navigate("/login");
      return;
    }

    if (!description.trim()) {
      alert("⚠️ Please describe your problem before booking!");
      return;
    }

    try {
      const res = await fetch(`${API_URL}/bookings`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          customer_id: user.id,
          technician_id: Number(id),
          availability_id: slotId,
          description: description,
          booking_fee: 20,
          status: "pending",
        }),
      });

      if (!res.ok) throw new Error(await res.text());

      alert("✅ Booking sent to technician! You'll be notified once they confirm.");
      setDescription("");
    } catch (err) {
      console.error("Booking error:", err);
      alert("❌ Booking failed!");
    }
  };

  const availableSlots = availability.filter((slot) => !slot.is_booked);

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
      <main className="flex-1 flex justify-center px-4 py-10">
        {!technician ? (
          <p className="text-gray-500 mt-8">Loading...</p>
        ) : (
          <div className="w-full max-w-2xl bg-white border border-gray-200 rounded-xl shadow-sm p-6">
            {/* Technician Info */}
            <h2 className="text-2xl font-semibold text-gray-800 mb-1">{technician.name}</h2>
            <p className="text-sm text-gray-500 mb-1">{technician.email}</p>
            <p className="text-sm text-gray-500 mb-6">{technician.phone}</p>

            {/* Problem Description */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Describe your problem
              </label>
              <textarea
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 resize-none"
                rows={4}
                placeholder="Example: My sink is blocked and leaking water."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>

            {/* Available Slots */}
            <h3 className="text-lg font-semibold text-gray-800 mb-3">Available Slots</h3>
            {availableSlots.length > 0 ? (
              <div className="space-y-3">
                {availableSlots.map((slot) => (
                  <div
                    key={slot.id}
                    className="flex justify-between items-center bg-blue-50 border border-blue-100 px-4 py-3 rounded-lg"
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-blue-700 font-medium text-sm w-24">
                        {DAY_NAMES[slot.dayOfWeek]}
                      </span>
                      <span className="text-gray-500 text-sm">
                        {slot.startTime} — {slot.endTime}
                      </span>
                    </div>
                    <button
                      onClick={() => createBooking(slot.id)}
                      className="bg-green-500 text-white px-4 py-1.5 rounded-lg text-sm font-medium hover:bg-green-600 transition"
                    >
                      Book
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-400 text-sm text-center py-6">No available slots at the moment.</p>
            )}
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
