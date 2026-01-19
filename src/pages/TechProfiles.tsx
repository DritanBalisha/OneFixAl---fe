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

  useEffect(() => {
    const fetchProfiles = async () => {
      try {
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

  if (loading) return <p>Loading technicians...</p>;

 return (
  <div className="max-w-5xl mx-auto mt-10 px-4 sm:px-6 lg:px-8">
    <h2 className="text-3xl font-bold mb-8 text-center text-gray-800">
      Available Technicians
    </h2>

    <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {profiles.map((tech) => (
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

            <div>
              <p className="text-xl font-semibold text-gray-900">{tech.name}</p>
              <p className="text-gray-600 text-sm">{tech.email}</p>
              <p className="text-gray-600 text-sm">{tech.phone}</p>

              {tech.TechnicianProfile && (
                <div className="mt-2 text-gray-700 text-sm space-y-1">
                  <p>
                    <span className="font-semibold">Profession:</span>{" "}
                    {tech.TechnicianProfile.profession}
                  </p>
                  <p>
                    <span className="font-semibold">Experience:</span>{" "}
                    {tech.TechnicianProfile.experience} years
                  </p>
                  <p>
                    <span className="font-semibold">Rating:</span>{" "}
                    {tech.TechnicianProfile.ratingAvg} ⭐
                  </p>
                  <p>
                    <span className="font-semibold">Bio:</span>{" "}
                    {tech.TechnicianProfile.bio}
                  </p>
                </div>
              )}
            </div>
          </div>

          <button
            onClick={() => navigate(`/technician/${tech.id}`)}
            className="mt-4 w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition-colors"
          >
            Book
          </button>
        </li>
      ))}
    </ul>
  </div>
);

}

