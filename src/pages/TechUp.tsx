// TechDash.tsx
import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { API_URL } from "../api/config.ts";

export default function TechnicianProfileForm() {
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    profession: "",
    bio: "",
    profile_picture: "",
    certificate: "",
    experience: 0,
  });

  const isLoggedIn = !!localStorage.getItem("user");

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/");
    window.location.reload();
  };

  useEffect(() => {
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
      setSaving(true);
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
    } finally {
      setSaving(false);
    }
  };

  const isEditing = !!form.profession;

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
      <main className="flex-1 flex justify-center px-4 py-10">
        <div className="w-full max-w-lg bg-white border border-gray-200 rounded-xl shadow-sm p-8">
          <h2 className="text-2xl font-semibold text-gray-800 mb-1">
            {isEditing ? "Update" : "Complete"} Your Technician Profile
          </h2>
          <p className="text-sm text-gray-500 mb-6">
            {isEditing
              ? "Edit your details below and save your changes."
              : "Fill in your profile to start receiving bookings."}
          </p>

          <form onSubmit={handleSubmit} className="flex flex-col gap-5">
            <div className="flex flex-col gap-1">
              <label className="text-xs font-medium text-gray-500">Profession</label>
              <input
                type="text"
                name="profession"
                placeholder="e.g. Electrician, Plumber"
                value={form.profession}
                onChange={handleChange}
                className="border border-gray-300 px-3 py-2 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-xs font-medium text-gray-500">Bio</label>
              <textarea
                name="bio"
                placeholder="A short description about yourself..."
                value={form.bio}
                onChange={handleChange}
                rows={4}
                className="border border-gray-300 px-3 py-2 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 resize-none"
              />
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-xs font-medium text-gray-500">Profile Picture URL</label>
              <input
                type="text"
                name="profile_picture"
                placeholder="https://..."
                value={form.profile_picture}
                onChange={handleChange}
                className="border border-gray-300 px-3 py-2 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-xs font-medium text-gray-500">Certificate Link</label>
              <input
                type="text"
                name="certificate"
                placeholder="https://..."
                value={form.certificate}
                onChange={handleChange}
                className="border border-gray-300 px-3 py-2 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-xs font-medium text-gray-500">Years of Experience</label>
              <input
                type="number"
                name="experience"
                placeholder="0"
                value={form.experience}
                onChange={handleChange}
                min={0}
                className="border border-gray-300 px-3 py-2 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 w-32"
              />
            </div>

            <div className="flex gap-3 pt-2">
              <button
                type="submit"
                disabled={saving}
                className="bg-blue-600 text-white px-6 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition disabled:opacity-50"
              >
                {saving ? "Saving..." : "Save Profile"}
              </button>
              <button
                type="button"
                onClick={() => navigate("/myProfile")}
                className="text-gray-500 px-4 py-2 rounded-lg text-sm hover:bg-gray-100 transition"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </main>

      {/* FOOTER */}
      <footer className="bg-white shadow-inner py-6 text-center text-gray-500 text-sm">
        © {new Date().getFullYear()} OneFixAL – All rights reserved.
      </footer>
    </div>
  );
}
// // TechDash.tsx
// import React, { useState, useEffect } from "react";
// import { useNavigate } from "react-router-dom";
// import { API_URL } from "../api/config.ts";

// export default function TechnicianProfileForm() {
//   const navigate = useNavigate();
//   const [form, setForm] = useState({
//     profession: "",
//     bio: "",
//     profile_picture: "",
//     certificate: "",
//     experience: 0,
//   });

//   useEffect(() => {
//     // Fetch existing technician profile
//     const fetchProfile = async () => {
//       const token = localStorage.getItem("token");
//       if (!token) return;

//       try {
//         const res = await fetch(`${API_URL}/technician/profile`, {
//           headers: {
//             "Content-Type": "application/json",
//             Authorization: `Bearer ${token}`,
//           },
//         });

//         if (res.ok) {
//           const data = await res.json();
//           setForm({
//             profession: data.profession?.join(", ") || "",
//             bio: data.bio || "",
//             profile_picture: data.profile_picture || "",
//             certificate: data.certificate || "",
//             experience: data.experience || 0,
//           });
//         }
//       } catch (err) {
//         console.error("Error fetching technician profile:", err);
//       }
//     };

//     fetchProfile();
//   }, []);

//   const handleChange = (
//     e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
//   ) => {
//     setForm({ ...form, [e.target.name]: e.target.value });
//   };

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     const token = localStorage.getItem("token");

//     try {
//       const res = await fetch(`${API_URL}/technician/profile`, {
//         method: "PUT",
//         headers: {
//           "Content-Type": "application/json",
//           Authorization: `Bearer ${token}`,
//         },
//         body: JSON.stringify({
//           ...form,
//           profession: form.profession,
//         }),
//       });

//       if (!res.ok) {
//         const errText = await res.text();
//         console.error("Backend error:", errText);
//         throw new Error("Failed to save profile");
//       }


//       await res.json();
//       navigate("/myProfile");
//     } catch (err) {
//       console.error(err);
//     }
//   };

//   return (
//     <form onSubmit={handleSubmit}>
//       <h2>{form.profession ? "Update" : "Complete"} Your Technician Profile</h2>

//       <input
//         type="text"
//         name="profession"
//         placeholder="Profession"
//         value={form.profession}
//         onChange={handleChange}
//       />

//       <textarea
//         name="bio"
//         placeholder="Short bio"
//         value={form.bio}
//         onChange={handleChange}
//       />

//       <input
//         type="text"
//         name="profile_picture"
//         placeholder="Profile picture URL"
//         value={form.profile_picture}
//         onChange={handleChange}
//       />

//       <input
//         type="text"
//         name="certificate"
//         placeholder="Certificate link"
//         value={form.certificate}
//         onChange={handleChange}
//       />

//       <input
//         type="number"
//         name="experience"
//         placeholder="Years of Experience"
//         value={form.experience}
//         onChange={handleChange}
//       />

//       <button type="submit">Save Profile</button>
//     </form>
//   );
// }
