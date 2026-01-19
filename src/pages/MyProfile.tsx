// MyProfile.tsx
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { API_URL } from "../api/config.ts";

export default function MyProfile() {
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const navigate = useNavigate();

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

  // Function to update the user's role
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

      // 🚀 Auto-redirect after choosing technician
      if (role === "technician") {
        navigate("/technician-dashboard");
      } else if (role === "client") {
        navigate("/myProfile");
      }

    } catch (err) {
      console.error("Error updating role:", err);
      alert("Failed to update role ❌");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <p>Loading profile...</p>;
  if (!profile) return <p>No profile found</p>;

  return (
    <div className="max-w-md mx-auto mt-8 p-6 border rounded-lg shadow">
      <h2 className="text-2xl font-semibold mb-4">My Profile</h2>

      <p><b>Name:</b> {profile.name || "N/A"}</p>
      <p><b>Email:</b> {profile.email || "N/A"}</p>
      <p><b>Phone:</b> {profile.phone || "N/A"}</p>
      <p><b>Role:</b> {profile.role || "Not set"}</p>

      {/* If user has no role, show buttons to select one */}
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

      {profile.role === "technician" && profile.technicianProfile && (
        <div className="mt-6">
          <h3 className="text-lg font-semibold mb-2">Technician Details</h3>
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
          <button
            className="bg-yellow-500 text-white mt-4 px-4 py-2 rounded"
            onClick={() => navigate("/technician-dashboard")}
          >
            Update Profile
          </button>
        </div>
      )}
    </div>
  );
}

