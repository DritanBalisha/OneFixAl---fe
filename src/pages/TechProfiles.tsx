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

  // Get current user data safely
  const userData = localStorage.getItem("user");
  const currentUser = userData ? JSON.parse(userData) : null;

  useEffect(() => {
    const fetchProfiles = async () => {
      try {
        // Use your API_URL constant here
        const res = await fetch(`${API_URL}/technicians`);
        if (!res.ok) {
          throw new Error("Failed to fetch technicians");
        }
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

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <p className="text-xl text-gray-600 animate-pulse">Loading technicians...</p>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto mt-10 px-4 sm:px-6 lg:px-8">
      <h2 className="text-3xl font-bold mb-8 text-center text-gray-800">
        Available Technicians
      </h2>

      {profiles.length === 0 ? (
        <p className="text-center text-gray-500">No technicians found.</p>
      ) : (
        <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {profiles.map((tech) => {
            const isMe = currentUser && currentUser.id === tech.id;

            return (
              <li
                key={tech.id}
                className="bg-white rounded-xl shadow-md p-6 hover:shadow-xl transition-shadow duration-300 flex flex-col justify-between"
              >
                <div className="flex items-start gap-4">
                  {tech.TechnicianProfile?.profile_picture ? (
                    <img
                      src={tech.TechnicianProfile.profile_picture}
                      alt={tech.name}
                      className="w-20 h-20 object-cover rounded-full flex-shrink-0"
                    />
                  ) : (
                    <div className="w-20 h-20 bg-gray-200 rounded-full flex-shrink-0 flex items-center justify-center text-gray-500">
                      No Image
                    </div>
                  )}

                  <div className="flex-1 min-w-0">
                    <p className="text-xl font-semibold text-gray-900 truncate">
                      {tech.name} {isMe && <span className="text-blue-500 text-sm">(You)</span>}
                    </p>
                    <p className="text-gray-600 text-sm truncate">{tech.email}</p>

                    {tech.TechnicianProfile && (
                      <div className="mt-2 text-gray-700 text-sm space-y-1">
                        <p><span className="font-semibold">Profession:</span> {tech.TechnicianProfile.profession}</p>
                        <p><span className="font-semibold">Exp:</span> {tech.TechnicianProfile.experience} years</p>
                        <p><span className="font-semibold">Rating:</span> {tech.TechnicianProfile.ratingAvg} ⭐</p>
                      </div>
                    )}
                  </div>
                </div>

                {isMe ? (
                  <button
                    disabled
                    className="mt-4 w-full bg-gray-100 text-gray-400 py-2 rounded-lg cursor-not-allowed font-medium"
                  >
                    Manage My Profile
                  </button>
                ) : (
                  <button
                    onClick={() => navigate(`/technician/${tech.id}`)}
                    className="mt-4 w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors font-medium"
                  >
                    Book Now
                  </button>
                )}
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
