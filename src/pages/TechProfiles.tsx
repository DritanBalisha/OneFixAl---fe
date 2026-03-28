import React, { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { API_URL } from "../api/config.ts";

interface TechnicianProfile {
  profession: string;
  bio: string;
  profile_picture: string;
  certificate: string;
  experience: string;
  ratingAvg: number;
  verified: boolean;
}

interface User {
  id: number;
  name: string;
  email: string;
  phone: string;
  role: string;
  TechnicianProfile?: TechnicianProfile;
}

export default function TechProfiles() {
  const [profiles, setProfiles] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();

  const userData = localStorage.getItem("user");
  const currentUser = userData ? JSON.parse(userData) : null;
  const isLoggedIn = !!userData;

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/");
    window.location.reload();
  };

  useEffect(() => {
    const fetchProfiles = async () => {
      try {
        const res = await fetch(`${API_URL}/technicians`);
        if (!res.ok) throw new Error("Failed to fetch technicians");
        const data: User[] = await res.json();
        setProfiles(data);
      } catch (err) {
        console.error("Error fetching profiles:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchProfiles();
  }, []);

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
      <main className="flex-1 px-4 sm:px-6 lg:px-8 py-10 max-w-5xl mx-auto w-full">
        <h2 className="text-3xl font-bold mb-2 text-center text-gray-800">
          Available Technicians
        </h2>
        <p className="text-center text-gray-500 text-sm mb-8">
          Browse professionals and book the right one for your job.
        </p>

        {loading ? (
          <div className="flex justify-center items-center min-h-[300px]">
            <p className="text-gray-500 animate-pulse">Loading technicians...</p>
          </div>
        ) : profiles.length === 0 ? (
          <p className="text-center text-gray-400 py-16">No technicians found.</p>
        ) : (
          <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {profiles.map((tech) => {
              const isMe = currentUser && currentUser.id === tech.id;

              return (
                <li
                  key={tech.id}
                  className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 hover:shadow-md transition-shadow duration-300 flex flex-col justify-between"
                >
                  <div className="flex items-start gap-4">
                    {tech.TechnicianProfile?.profile_picture ? (
                      <img
                        src={tech.TechnicianProfile.profile_picture}
                        alt={tech.name}
                        className="w-16 h-16 object-cover rounded-full flex-shrink-0"
                      />
                    ) : (
                      <div className="w-16 h-16 bg-blue-100 rounded-full flex-shrink-0 flex items-center justify-center text-blue-400 text-xl font-bold">
                        {tech.name.charAt(0).toUpperCase()}
                      </div>
                    )}

                    <div className="flex-1 min-w-0">
                      <p className="text-lg font-semibold text-gray-900 truncate">
                        {tech.name}{" "}
                        {isMe && <span className="text-blue-500 text-sm font-normal">(You)</span>}
                      </p>
                      <p className="text-gray-400 text-xs truncate mb-2">{tech.email}</p>

                      {tech.TechnicianProfile && (
                        <div className="text-gray-600 text-sm space-y-0.5">
                          <p><span className="font-medium text-gray-700">Profession:</span> {tech.TechnicianProfile.profession}</p>
                          <p><span className="font-medium text-gray-700">Experience:</span> {tech.TechnicianProfile.experience} years</p>
                          <p><span className="font-medium text-gray-700">Rating:</span> {tech.TechnicianProfile.ratingAvg} ⭐</p>
                        </div>
                      )}
                    </div>
                  </div>

                  {isMe ? (
                    <button
                      disabled
                      className="mt-5 w-full bg-gray-100 text-gray-400 py-2 rounded-lg cursor-not-allowed text-sm font-medium"
                    >
                      This is you
                    </button>
                  ) : (
                    <button
                      onClick={() => navigate(`/technician/${tech.id}`)}
                      className="mt-5 w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
                    >
                      Book Now
                    </button>
                  )}
                </li>
              );
            })}
          </ul>
        )}
      </main>

      {/* FOOTER */}
      <footer className="bg-white shadow-inner py-6 text-center text-gray-500 text-sm">
        © {new Date().getFullYear()} OneFixAL – All rights reserved.
      </footer>
    </div>
  );
}
