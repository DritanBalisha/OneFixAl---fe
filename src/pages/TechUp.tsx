// TechDash.tsx
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { API_URL } from "../api/config.ts";

export default function TechnicianProfileForm() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    profession: "",
    bio: "",
    profile_picture: "",
    certificate: "",
    experience: 0,
  });

  useEffect(() => {
    // Fetch existing technician profile
    const fetchProfile = async () => {
      const token = localStorage.getItem("token");
      if (!token) return;

      try {
        const res = await fetch(`${API_URL}/technician/profile`, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        if (res.ok) {
          const data = await res.json();
          setForm({
            profession: data.profession?.join(", ") || "",
            bio: data.bio || "",
            profile_picture: data.profile_picture || "",
            certificate: data.certificate || "",
            experience: data.experience || 0,
          });
        }
      } catch (err) {
        console.error("Error fetching technician profile:", err);
      }
    };

    fetchProfile();
  }, []);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const token = localStorage.getItem("token");

    try {
      const res = await fetch(`${API_URL}/technician/profile`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          ...form,
          profession: form.profession,
        }),
      });

      if (!res.ok) {
        const errText = await res.text();
        console.error("Backend error:", errText);
        throw new Error("Failed to save profile");
      }


      await res.json();
      navigate("/myProfile");
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>{form.profession ? "Update" : "Complete"} Your Technician Profile</h2>

      <input
        type="text"
        name="profession"
        placeholder="Profession"
        value={form.profession}
        onChange={handleChange}
      />

      <textarea
        name="bio"
        placeholder="Short bio"
        value={form.bio}
        onChange={handleChange}
      />

      <input
        type="text"
        name="profile_picture"
        placeholder="Profile picture URL"
        value={form.profile_picture}
        onChange={handleChange}
      />

      <input
        type="text"
        name="certificate"
        placeholder="Certificate link"
        value={form.certificate}
        onChange={handleChange}
      />

      <input
        type="number"
        name="experience"
        placeholder="Years of Experience"
        value={form.experience}
        onChange={handleChange}
      />

      <button type="submit">Save Profile</button>
    </form>
  );
}

