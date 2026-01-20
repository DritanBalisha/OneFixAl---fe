import React, { useState, useEffect } from "react";
// This import is the fix for your "ReferenceError"
import { useNavigate } from "react-router-dom";
import { API_URL } from "../api/config";

// --- Sub-Components ---

const ClientHome = () => (
  <div className="space-y-8 animate-fade-in">
    <div className="bg-blue-600 rounded-2xl p-8 text-white shadow-lg">
      <h1 className="text-3xl font-bold mb-4">What do you need fixed?</h1>
      <div className="relative">
        <span className="absolute left-3 top-3 text-gray-400">🔍</span>
        <input 
          type="text" 
          placeholder="Search for plumbers, electricians, or developers..." 
          className="w-full p-3 pl-10 rounded-lg text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
      </div>
    </div>

    <section>
      <h2 className="text-xl font-bold mb-4">Categories</h2>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { name: "Plumbing", icon: "💧", color: "bg-blue-100 text-blue-600" },
          { name: "Electrical", icon: "⚡", color: "bg-yellow-100 text-yellow-600" },
          { name: "IT Support", icon: "💻", color: "bg-purple-100 text-purple-600" },
          { name: "Maintenance", icon: "🛠️", color: "bg-green-100 text-green-600" },
        ].map((cat) => (
          <div key={cat.name} className={`${cat.color} p-6 rounded-xl flex flex-col items-center cursor-pointer hover:scale-105 transition-transform`}>
            <span className="text-2xl mb-2">{cat.icon}</span>
            <span className="font-semibold">{cat.name}</span>
          </div>
        ))}
      </div>
    </section>

    <section>
      <h2 className="text-xl font-bold mb-4">Top Rated Technicians</h2>
      <div className="grid md:grid-cols-3 gap-6">
        {[1, 2, 3].map((id) => (
          <div key={id} className="bg-white border rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow">
            <div className="h-32 bg-gray-200 flex items-center justify-center text-gray-400 italic">📷 Photo</div>
            <div className="p-4">
              <h3 className="font-bold">John Technician #{id}</h3>
              <p className="text-sm text-gray-500">Expert Professional • 5.0 ⭐</p>
              <div className="mt-4 flex justify-between items-center">
                <span className="font-bold text-blue-600">$45/hr</span>
                <button className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-blue-700">Book Now</button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  </div>
);

const TechHome = () => (
  <div className="space-y-6 animate-fade-in">
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div className="bg-white p-6 rounded-xl border shadow-sm">
        <h3 className="text-gray-500 text-sm">Monthly Earnings</h3>
        <p className="text-2xl font-bold text-green-600">$2,450.00</p>
      </div>
      <div className="bg-white p-6 rounded-xl border shadow-sm">
        <h3 className="text-gray-500 text-sm">Active Bookings</h3>
        <p className="text-2xl font-bold">12</p>
      </div>
      <div className="bg-white p-6 rounded-xl border shadow-sm flex items-center justify-between">
        <div>
          <h3 className="text-gray-500 text-sm">Work Status</h3>
          <p className="text-lg font-bold text-blue-600">Available 🟢</p>
        </div>
      </div>
    </div>
    <section className="bg-white border rounded-xl">
      <div className="p-4 border-b font-bold">Today's Schedule</div>
      <div className="p-4 space-y-4">
        <p className="text-gray-400 text-sm italic">No bookings for today.</p>
      </div>
    </section>
  </div>
);

// --- Main Page Component ---

export default function Main() {
  const navigate = useNavigate();
  const [role, setRole] = useState<string | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);

  useEffect(() => {
    const userData = localStorage.getItem("user");
    if (userData) {
      try {
        const user = JSON.parse(userData);
        if (user.token) {
          setIsLoggedIn(true);
          setRole(user.role);
        }
      } catch (e) {
        console.error("Auth error:", e);
      }
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("user");
    setIsLoggedIn(false);
    setRole(null);
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white border-b sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          <div 
            className="font-black text-2xl text-blue-600 tracking-tighter cursor-pointer" 
            onClick={() => navigate("/")}
          >
            OneFixAL
          </div>
          
          <div className="hidden md:flex space-x-8 text-gray-600 font-medium">
            {isLoggedIn && (
              <>
                <button onClick={() => navigate("/books")} className="flex items-center gap-1 hover:text-blue-600 transition">
                  <span>📖</span> {role === "technician" ? "My Jobs" : "My Books"}
                </button>
                <button onClick={() => navigate("/profile")} className="flex items-center gap-1 hover:text-blue-600 transition">
                  <span>👤</span> Profile
                </button>
              </>
            )}
          </div>

          <div className="flex items-center gap-4">
            {isLoggedIn ? (
              <button 
                onClick={handleLogout}
                className="text-red-500 font-semibold text-sm hover:bg-red-50 px-3 py-2 rounded-lg"
              >
                <span>🚪</span> Logout
              </button>
            ) : (
              <div className="space-x-2">
                <button 
                  onClick={() => navigate("/login")}
                  className="text-blue-600 font-semibold text-sm px-4 py-2 hover:bg-blue-50 rounded-lg"
                >
                  Login
                </button>
                <button 
                  onClick={() => navigate("/signup")}
                  className="bg-blue-600 text-white font-semibold text-sm px-4 py-2 rounded-lg hover:bg-blue-700"
                >
                  Sign Up
                </button>
              </div>
            )}
          </div>
        </div>
      </nav>

      <div className="max-w-6xl mx-auto p-4 md:p-8">
        {role === "technician" ? <TechHome /> : <ClientHome />}
      </div>
    </div>
  );
}

