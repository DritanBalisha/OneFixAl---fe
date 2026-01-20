import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { API_URL } from "../api/config";

// --- CLIENT VIEW: Marketplace + Booking Status ---
const ClientHome = () => {
  const [history] = useState([
    { id: 1, tech: "John Doe", service: "Plumbing", status: "Accepted", date: "2026-01-20" },
    { id: 2, tech: "Jane Smith", service: "Electrical", status: "Pending", date: "2026-01-22" }
  ]);

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Search Section */}
      <div className="bg-blue-600 rounded-2xl p-8 text-white shadow-lg">
        <h1 className="text-3xl font-bold mb-2">Find a Professional</h1>
        <input 
          type="text" 
          placeholder="🔍 What do you need fixed?" 
          className="w-full p-3 rounded-lg text-gray-800 focus:outline-none"
        />
      </div>

      {/* Booking Status & History */}
      <section className="bg-white p-6 rounded-xl border shadow-sm">
        <h2 className="text-xl font-bold mb-4">📅 My Booking Status</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="text-gray-500 border-b text-sm">
                <th className="pb-2">Technician</th>
                <th className="pb-2">Service</th>
                <th className="pb-2">Status</th>
                <th className="pb-2">Date</th>
              </tr>
            </thead>
            <tbody>
              {history.map((item) => (
                <tr key={item.id} className="border-b last:border-0 hover:bg-gray-50">
                  <td className="py-3 font-medium">{item.tech}</td>
                  <td className="py-3 text-gray-600">{item.service}</td>
                  <td className="py-3">
                    <span className={`px-2 py-1 rounded-full text-xs font-bold ${
                      item.status === "Accepted" ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-700"
                    }`}>
                      {item.status}
                    </span>
                  </td>
                  <td className="py-3 text-sm text-gray-500">{item.date}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
};

// --- TECHNICIAN VIEW: Dashboard + Manage Requests ---
const TechHome = () => (
  <div className="space-y-6 animate-fade-in">
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div className="bg-white p-6 rounded-xl border border-blue-100 shadow-sm">
        <h3 className="text-gray-500 text-sm">Earnings</h3>
        <p className="text-2xl font-bold text-green-600">$1,240</p>
      </div>
      <div className="bg-white p-6 rounded-xl border shadow-sm">
        <h3 className="text-gray-500 text-sm">New Requests</h3>
        <p className="text-2xl font-bold text-orange-500">3</p>
      </div>
      <div className="bg-white p-6 rounded-xl border shadow-sm">
        <h3 className="text-gray-500 text-sm">Status</h3>
        <p className="text-lg font-bold text-blue-600">Working 🟢</p>
      </div>
    </div>

    <section className="bg-white border rounded-xl overflow-hidden shadow-sm">
      <div className="p-4 bg-gray-50 border-b font-bold flex justify-between">
        <span>Incoming Requests</span>
        <span className="text-xs text-blue-600 cursor-pointer">View History</span>
      </div>
      <div className="divide-y">
        {[1, 2].map((i) => (
          <div key={i} className="p-4 flex items-center justify-between hover:bg-gray-50">
            <div>
              <p className="font-bold text-gray-800">Maria Garcia</p>
              <p className="text-sm text-gray-500 italic">"Pipe leaking in the kitchen"</p>
            </div>
            <div className="space-x-2">
              <button className="bg-green-600 text-white px-3 py-1 rounded text-sm hover:bg-green-700">Accept</button>
              <button className="bg-gray-200 text-gray-700 px-3 py-1 rounded text-sm hover:bg-gray-300">Decline</button>
            </div>
          </div>
        ))}
      </div>
    </section>
  </div>
);

// --- MAIN PAGE ---
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
      } catch (e) { console.error(e); }
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("user");
    setIsLoggedIn(false);
    setRole(null);
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white border-b sticky top-0 z-50 shadow-sm">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          <div 
            className="font-black text-2xl text-blue-600 tracking-tighter cursor-pointer" 
            onClick={() => navigate("/")}
          >
            ONEFIX
          </div>
          
          <div className="flex items-center gap-6">
            {isLoggedIn ? (
              <>
                <div className="hidden md:flex space-x-6 text-gray-600 font-medium">
                  <button onClick={() => navigate("/books")} className="hover:text-blue-600 flex items-center gap-1 transition">
                    <span>📖</span> {role === "technician" ? "Work History" : "My Books"}
                  </button>
                  <button onClick={() => navigate("/profile")} className="hover:text-blue-600 flex items-center gap-1 transition">
                    <span>👤</span> Profile
                  </button>
                </div>
                <button 
                  onClick={handleLogout}
                  className="text-red-600 font-bold text-sm bg-red-50 px-4 py-2 rounded-lg hover:bg-red-100 transition"
                >
                  Logout 🚪
                </button>
              </>
            ) : (
              <div className="space-x-3">
                <button onClick={() => navigate("/login")} className="text-blue-600 font-bold text-sm px-4 py-2 hover:bg-blue-50 rounded-lg">
                  Login
                </button>
                <button onClick={() => navigate("/signup")} className="bg-blue-600 text-white font-bold text-sm px-4 py-2 rounded-lg hover:bg-blue-700">
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
