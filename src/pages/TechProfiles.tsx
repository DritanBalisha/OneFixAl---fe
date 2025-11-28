"use client";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

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

  useEffect(() => {
    const fetchProfiles = async () => {
      try {
        const res = await fetch("http://localhost:8000/technicians");
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

  if (loading) return <p>Loading technicians...</p>;

  return (
    <div className="max-w-3xl mx-auto mt-8">
      <h2 className="text-2xl font-semibold mb-4">Available Technicians</h2>
      <ul className="space-y-4">
        {profiles.map((tech) => (
          <li
            key={tech.id}
            className="border rounded-lg p-4 shadow hover:shadow-lg transition bg-white"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-lg font-bold">{tech.name}</p>
                <p>{tech.email}</p>
                <p>{tech.phone}</p>

                {tech.TechnicianProfile && (
                  <div className="mt-2">
                    <p><b>Profession:</b> {tech.TechnicianProfile.profession}</p>
                    <p><b>Experience:</b> {tech.TechnicianProfile.experience} years</p>
                    <p><b>Rating:</b> {tech.TechnicianProfile.ratingAvg} ⭐</p>
                    <p><b>Bio:</b> {tech.TechnicianProfile.bio}</p>
                  </div>
                )}
              </div>

              <div className="flex flex-col gap-2">
                {tech.TechnicianProfile?.profile_picture && (
                  <img
                    src={tech.TechnicianProfile.profile_picture}
                    alt="Profile"
                    className="w-24 h-24 object-cover rounded-md"
                  />
                )}

                <button
                  onClick={() => navigate(`/technician/${tech.id}`)}
                  className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                >
                  Book
                </button>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
