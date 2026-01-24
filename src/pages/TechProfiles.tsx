import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
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
  const navigate = useNavigate();

  // Get current user data to check IDs
  const userData = localStorage.getItem("user");
  const currentUser = userData ? JSON.parse(userData) : null;

  useEffect(() => {
    // ... your fetch logic remains the same ...
  }, []);

  if (loading) return <p className="text-center mt-10">Loading technicians...</p>;

  return (
    <div className="max-w-5xl mx-auto mt-10 px-4 sm:px-6 lg:px-8">
      <h2 className="text-3xl font-bold mb-8 text-center text-gray-800">Available Technicians</h2>
      <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {profiles.map((tech) => {
          // Check if this card belongs to the logged-in user
          const isMe = currentUser && currentUser.id === tech.id;

          return (
            <li key={tech.id} className="bg-white rounded-xl shadow-md p-6 flex flex-col justify-between">
              <div className="flex items-start gap-4">
                {/* Image logic... */}
                <div>
                  <p className="text-xl font-semibold text-gray-900">{tech.name} {isMe && "(You)"}</p>
                  {/* ... other tech info ... */}
                </div>
              </div>

              {/* DYNAMIC BUTTON */}
              {isMe ? (
                <button
                  disabled
                  className="mt-4 w-full bg-gray-200 text-gray-500 py-2 rounded-lg cursor-not-allowed"
                >
                  Your Profile
                </button>
              ) : (
                <button
                  onClick={() => navigate(`/technician/${tech.id}`)}
                  className="mt-4 w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition-colors"
                >
                  Book
                </button>
              )}
            </li>
          );
        })}
      </ul>
    </div>
  );
}
