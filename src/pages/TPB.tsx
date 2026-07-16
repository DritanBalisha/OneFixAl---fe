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
  const [selectedSlot, setSelectedSlot] = useState<number | null>(null);
  const [booking, setBooking] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
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
    if (!token) { navigate("/login"); return; }

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

        setTechnician(await techRes.json());
        setAvailability(await availRes.json());
      } catch (err) {
        console.error("Error loading technician:", err);
      }
    };

    fetchData();
  }, [id, navigate]);

  const createBooking = async () => {
    setError("");
    setSuccess("");

    const token = localStorage.getItem("token");
    const user = JSON.parse(localStorage.getItem("user") || "{}");

    if (!token || !user?.id) { navigate("/login"); return; }
    if (!description.trim()) { setError("Please describe your problem."); return; }
    if (!jobPrice || jobPrice <= 0) { setError("Please enter the estimated job price."); return; }
    if (!selectedSlot) { setError("Please select an available time slot."); return; }

    setBooking(true);
    try {
      const res = await fetch(`${API_URL}/bookings`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          technician_id:   Number(id),
          availability_id: selectedSlot,
          description:     description,
          status:          "pending",
        }),
      });

      const data = await res.json();
      if (!res.ok) { setError(data.error || "Booking failed"); return; }

      setSuccess("✅ Booking sent! You'll be notified once the technician confirms.");
      setDescription("");
      setJobPrice(0);
      setSelectedSlot(null);

      // Mark slot as booked in UI
      setAvailability((prev) =>
        prev.map((s) => s.id === selectedSlot ? { ...s, is_booked: true } : s)
      );
    } catch (err) {
      setError("Could not connect to server. Try again.");
    } finally {
      setBooking(false);
    }
  };

  const availableSlots = availability.filter((s) => !s.is_booked);

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
            <Link to="/techprofiles" className="text-gray-700 hover:text-blue-600 py-1" onClick={() => setMenuOpen(false)}>Book a Tech</Link>
            <Link to="/myProfile" className="bg-blue-600 text-white px-4 py-2 rounded-lg text-center" onClick={() => setMenuOpen(false)}>Profile</Link>
            {isLoggedIn ? (
              <button onClick={() => { setMenuOpen(false); handleLogout(); }} className="text-red-500 text-left px-3 py-2">Logout 🚪</button>
            ) : (
              <Link to="/login" className="text-blue-600 hover:underline py-1" onClick={() => setMenuOpen(false)}>Login</Link>
            )}
          </div>
        )}
      </nav>

      {/* PAGE CONTENT */}
      <main className="flex-1 flex justify-center px-4 py-10">
        {!technician ? (
          <p className="text-gray-400 mt-8 animate-pulse">Loading technician...</p>
        ) : (
          <div className="w-full max-w-2xl space-y-5">

            {/* Technician card */}
            <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-6">
              <h2 className="text-2xl font-semibold text-gray-800">{technician.name}</h2>
              <p className="text-sm text-gray-400 mt-1">{technician.email}</p>
              <p className="text-sm text-gray-400">{technician.phone}</p>
            </div>

            {/* Booking form */}
            <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-6 space-y-5">
              <h3 className="text-lg font-semibold text-gray-800">Book this Technician</h3>

              {/* Feedback */}
              {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg px-4 py-3">
                  {error}
                </div>
              )}
              {success && (
                <div className="bg-green-50 border border-green-200 text-green-700 text-sm rounded-lg px-4 py-3">
                  {success}
                </div>
              )}

              {/* Description */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Describe your problem
                </label>
                <textarea
                  rows={3}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 resize-none"
                  placeholder="e.g. My sink is blocked and leaking water."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />
              </div>

             
              {/* Time slots */}
              <div>
                <h4 className="text-sm font-medium text-gray-700 mb-2">Select a Time Slot</h4>
                {availableSlots.length > 0 ? (
                  <div className="space-y-2">
                    {availableSlots.map((slot) => (
                      <div
                        key={slot.id}
                        onClick={() => setSelectedSlot(slot.id)}
                        className={`flex justify-between items-center px-4 py-3 rounded-lg border cursor-pointer transition
                          ${selectedSlot === slot.id
                            ? "border-blue-500 bg-blue-50"
                            : "border-gray-200 bg-white hover:border-blue-300"
                          }`}
                      >
                        <span className="text-blue-700 font-medium text-sm w-24">
                          {DAY_NAMES[slot.dayOfWeek]}
                        </span>
                        <span className="text-gray-500 text-sm">
                          {slot.startTime} — {slot.endTime}
                        </span>
                        {selectedSlot === slot.id && (
                          <span className="text-blue-600 text-sm font-semibold">✓ Selected</span>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-400 text-sm text-center py-4">
                    No available slots at the moment.
                  </p>
                )}
              </div>

              {/* Book button */}
              <button
                onClick={createBooking}
                disabled={booking || !selectedSlot}
                className="w-full bg-green-600 hover:bg-green-700 disabled:opacity-50 text-white font-semibold py-2.5 rounded-lg transition"
              >
                {booking ? "Sending booking..." : "Confirm Booking"}
              </button>
            </div>
          </div>
        )}
      </main>

      <footer className="bg-white shadow-inner py-6 text-center text-gray-500 text-sm">
        © {new Date().getFullYear()} OneFixAL – All rights reserved.
      </footer>
    </div>
  );
}
