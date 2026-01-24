import React from "react";
import { Link, useNavigate } from "react-router-dom";

interface HomePageProps {
  user?: string | null;
}

export default function HomePage({ user }: HomePageProps) {
  const navigate = useNavigate();

  const handleLogout = () => {
    // 1. Clear all authentication data
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    // 2. Redirect to landing or login
    navigate("/");
    
    // 3. Optional: Force reload to clear any remaining React state
    window.location.reload();
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      {/* NAVBAR */}
      <nav className="w-full bg-white shadow-sm py-4 px-6 flex justify-between items-center">
        <h1 className="text-2xl font-semibold text-blue-600 cursor-pointer" onClick={() => navigate("/")}>
          OneFixAL
        </h1>

        <div className="flex items-center space-x-4">
          <Link 
            to="/techprofiles" 
            className="text-gray-700 hover:text-blue-600"
          >
            Book a Tech
          </Link>

          <Link 
            to="/myProfile" 
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
          >
            Profile
          </Link>

          {/* Logic: Check if user data exists in storage or props */}
          {user || localStorage.getItem("user") ? (
            <button 
              onClick={handleLogout} 
              className="text-red-500 font-medium hover:bg-red-50 px-3 py-2 rounded-md transition"
            >
              Logout 🚪
            </button>
          ) : (
            <Link 
              to="/login" 
              className="text-blue-600 font-medium hover:underline"
            >
              Login
            </Link>
          )}
        </div>
      </nav>

      {/* BODY CONTENT */}
      <main className="flex-1 flex flex-col justify-center items-center text-center px-4">
        <h2 className="text-4xl font-bold text-gray-800 mb-4">
          Welcome to OneFixAL
        </h2>
        
        <div className="bg-blue-500 text-white p-4 rounded-lg shadow-md mb-6">
          Tailwind Works!
        </div>

        <p className="text-gray-600 max-w-2xl mb-8">
          Fast and easy platform to connect clients with professional technicians.
          Book a technician, manage appointments, and receive instant updates.
        </p>

        {/* If logged in, show 'Go to Dashboard', otherwise 'Get Started' */}
        <Link 
          to={user ? "/dashboard" : "/login"}
          className="bg-blue-600 text-white px-8 py-3 rounded-lg font-bold text-lg hover:bg-blue-700 transition shadow-lg"
        >
          {user ? "View My Dashboard" : "Get Started"}
        </Link>
      </main>

      {/* FOOTER */}
      <footer className="bg-white shadow-inner py-6 text-center text-gray-500">
        © {new Date().getFullYear()} OneFixAL – All rights reserved.
      </footer>
    </div>
  );
}


