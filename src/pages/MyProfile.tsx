// MyProfile.tsx
import React, { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { API_URL } from "../api/config.ts";

export default function MyProfile() {
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();

  const isLoggedIn = profile || localStorage.getItem("user");

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/");
    window.location.reload();
  };

  useEffect(() => {
    const fetchProfile = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        navigate("/login");
        return;
      }

      try {
        const res = await fetch(`${API_URL}/me`, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        if (res.ok) {
          const updatedUser = await res.json();
          setProfile(updatedUser);
          localStorage.setItem("user", JSON.stringify(updatedUser));
        } else {
          console.error("Failed to fetch profile");
        }
      } catch (err) {
        console.error("Error fetching profile:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [navigate]);

  const handleSetRole = async (role: string) => {
    const token = localStorage.getItem("token");
    if (!token) return;

    try {
      setSaving(true);
      const res = await fetch(`${API_URL}/set-role`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ role }),
      });

      if (!res.ok) throw new Error("Failed to update role");

      const updatedUser = await res.json();
      setProfile(updatedUser);
      localStorage.setItem("user", JSON.stringify(updatedUser));

      if (role === "technician" || role === "client") {
        navigate("/myProfile");
      }
    } catch (err) {
      console.error("Error updating role:", err);
      alert("Failed to update role ❌");
    } finally {
      setSaving(false);
    }
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
              to="/"
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
            >
              Home
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
      <main className="flex-1 flex justify-center px-4 py-8">
        {loading ? (
          <p className="text-gray-500 mt-8">Loading profile...</p>
        ) : !profile ? (
          <p className="text-gray-500 mt-8">No profile found</p>
        ) : (
          <div className="w-full max-w-md p-6 border rounded-lg shadow bg-white">
            <h2 className="text-2xl font-semibold mb-4">My Profile</h2>

            <p><b>Name:</b> {profile.name || "N/A"}</p>
            <p><b>Email:</b> {profile.email || "N/A"}</p>
            <p><b>Phone:</b> {profile.phone || "N/A"}</p>
            <p><b>Role:</b> {profile.role || "Not set"}</p>

            {/* Role selection */}
            {!profile.role && (
              <div className="mt-4">
                <p className="mb-2 font-medium">Select your role:</p>
                <div className="flex gap-4">
                  <button
                    onClick={() => handleSetRole("client")}
                    disabled={saving}
                    className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 disabled:opacity-50"
                  >
                    Client
                  </button>
                  <button
                    onClick={() => handleSetRole("technician")}
                    disabled={saving}
                    className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 disabled:opacity-50"
                  >
                    Technician
                  </button>
                </div>
              </div>
            )}

            {/* Technician section — always shown when role is technician */}
            {profile.role === "technician" && (
              <div className="mt-6">
                <h3 className="text-lg font-semibold mb-2">Technician Details</h3>

                {profile.technicianProfile ? (
                  <>
                    {profile.technicianProfile.profession && (
                      <p><b>Profession:</b> {profile.technicianProfile.profession}</p>
                    )}
                    {profile.technicianProfile.bio && (
                      <p><b>Bio:</b> {profile.technicianProfile.bio}</p>
                    )}
                    {profile.technicianProfile.profile_picture && (
                      <img
                        src={profile.technicianProfile.profile_picture}
                        alt="Profile"
                        className="w-32 rounded mt-2"
                      />
                    )}
                    {profile.technicianProfile.certificate && (
                      <p className="mt-1">
                        <b>Certificate:</b>{" "}
                        <a
                          href={profile.technicianProfile.certificate}
                          target="_blank"
                          rel="noreferrer"
                          className="text-blue-600 underline"
                        >
                          View
                        </a>
                      </p>
                    )}
                    {profile.technicianProfile.experience && (
                      <p><b>Experience:</b> {profile.technicianProfile.experience} years</p>
                    )}
                  </>
                ) : (
                  <p className="text-sm text-gray-400 mb-2">
                    No details yet. Complete your profile to start receiving bookings.
                  </p>
                )}

                {/* Always visible for any technician */}
                {/* Action buttons */}
<div className="mt-4 flex flex-col gap-3">
  <button
    className="bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-600 transition"
    onClick={() => navigate("/profileupdatetech")}
  >
    {profile.technicianProfile ? "✏️ Update Profile" : "✏️ Complete Profile"}
  </button>

  {profile.technicianProfile && (
    <button
      className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition"
      onClick={() => navigate("/availability")}
    >
      🗓️ Manage Availability
    </button>
  )}

  {profile.technicianProfile && (
    <button
      className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
      onClick={() => navigate("/myBookings")}
    >
      📋 My Bookings
    </button>
  )}
</div>
              </div>
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
