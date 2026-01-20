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
        const user = JSON.parse
