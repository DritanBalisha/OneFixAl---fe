import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { API_URL } from "../api/config.ts";

const days = [
  { value: 0, label: "Sunday" },
  { value: 1, label: "Monday" },
  { value: 2, label: "Tuesday" },
  { value: 3, label: "Wednesday" },
  { value: 4, label: "Thursday" },
  { value: 5, label: "Friday" },
  { value: 6, label: "Saturday" },
];

type AvailabilitySlot = {
  id?: number;
  dayOfWeek: number;
  startTime: string;
  endTime: string;
};

export default function Availability() {
  const [availability, setAvailability] = useState<AvailabilitySlot[]>([]);
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();

  const isLoggedIn = !!localStorage.getItem("user");

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/");
    window.location.reload();
  };

  useEffect(() => {
    const fetchAvailability = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        navigate("/login");
        return;
      }

      try {
        const res = await fetch(`${API_URL}/availability`, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        if (!res.ok) throw new Error("Failed to load availability");

        const slots = await res.json();
        console.log("Fetched availability:", slots);
        setAvailability(slots);
      } catch (err) {
        console.error("Error fetching availability:", err);
      }
    };

    fetchAvailability();
  }, [navigate]);

  const addAvailability = async (dayOfWeek: number, startTime: string, endTime: string) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        navigate("/login");
        return;
      }

      const res = await fetch(`${API_URL}/availability`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ dayOfWeek, startTime, endTime }),
      });

      if (!res.ok) throw new Error("Failed to add availability");

      const data = await res.json();

      if (Array.isArray(data.availabilities)) {
        setAvailability((prev) => [...prev, ...data.availabilities]);
      } else {
        setAvailability((prev) => [...prev, data]);
      }
    } catch (err) {
      console.error("Error saving availability:", err);
      alert("Error saving availability ❌");
    }
  };

  const handleDelete = async (id?: number) => {
    if (!id) return;
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        navigate("/login");
        return;
      }

      const res = await fetch(`${API_URL}/availability/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) throw new Error("Failed to delete slot");

      setAvailability((prev) => prev.filter((slot) => slot.id !== id));
    } catch (err) {
      console.error("Error deleting slot:", err);
      alert("Error deleting slot ❌");
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
        <div className="w-full max-w-2xl bg-white border border-gray-200 rounded-xl shadow-sm p-6">
          <h2 className="text-2xl font-semibold text-gray-800 mb-1">Weekly Availability</h2>
          <p className="text-sm text-gray-500 mb-6">Add the time slots when you're available each week.</p>

          <AvailabilityForm onAdd={addAvailability} />

          {/* Slot List */}
          <div className="mt-6 space-y-3">
            {availability.length === 0 ? (
              <p className="text-gray-400 text-sm text-center py-6">No availability slots added yet.</p>
            ) : (
              availability.map((slot) => (
                <div
                  key={slot.id || `${slot.dayOfWeek}-${slot.startTime}`}
                  className="flex justify-between items-center bg-blue-50 border border-blue-100 px-4 py-3 rounded-lg"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-blue-700 font-medium text-sm w-24">
                      {days.find((d) => d.value === slot.dayOfWeek)?.label}
                    </span>
                    <span className="text-gray-500 text-sm">
                      {slot.startTime} — {slot.endTime}
                    </span>
                  </div>
                  <button
                    className="text-red-500 text-sm font-medium hover:bg-red-50 px-3 py-1 rounded-md transition"
                    onClick={() => handleDelete(slot.id)}
                  >
                    Remove
                  </button>
                </div>
              ))
            )}
          </div>
        </div>
      </main>

      {/* FOOTER */}
      <footer className="bg-white shadow-inner py-6 text-center text-gray-500 text-sm">
        © {new Date().getFullYear()} OneFixAL – All rights reserved.
      </footer>
    </div>
  );
}

function AvailabilityForm({ onAdd }: { onAdd: (day: number, start: string, end: string) => void }) {
  const [dayOfWeek, setDayOfWeek] = useState<number>(1);
  const [startTime, setStartTime] = useState<string>("");
  const [endTime, setEndTime] = useState<string>("");

  return (
    <div className="flex flex-wrap gap-3 items-end">
      <div className="flex flex-col gap-1">
        <label className="text-xs text-gray-500 font-medium">Day</label>
        <select
          className="border border-gray-300 bg-white px-3 py-2 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
          value={dayOfWeek}
          onChange={(e) => setDayOfWeek(Number(e.target.value))}
        >
          {days.map((d) => (
            <option key={d.value} value={d.value}>
              {d.label}
            </option>
          ))}
        </select>
      </div>

      <div className="flex flex-col gap-1">
        <label className="text-xs text-gray-500 font-medium">Start Time</label>
        <input
          type="time"
          className="border border-gray-300 px-3 py-2 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
          value={startTime}
          onChange={(e) => setStartTime(e.target.value)}
        />
      </div>

      <div className="flex flex-col gap-1">
        <label className="text-xs text-gray-500 font-medium">End Time</label>
        <input
          type="time"
          className="border border-gray-300 px-3 py-2 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
          value={endTime}
          onChange={(e) => setEndTime(e.target.value)}
        />
      </div>

      <button
        className="bg-blue-600 text-white px-5 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition disabled:opacity-50"
        onClick={() => {
          if (startTime && endTime) {
            onAdd(dayOfWeek, startTime, endTime);
            setStartTime("");
            setEndTime("");
          }
        }}
      >
        + Add
      </button>
    </div>
  );
}
// import { useEffect, useState } from "react";
// import { useNavigate } from "react-router-dom";
// import { API_URL } from "../api/config.ts";

// const days = [
//   { value: 0, label: "Sunday" },
//   { value: 1, label: "Monday" },
//   { value: 2, label: "Tuesday" },
//   { value: 3, label: "Wednesday" },
//   { value: 4, label: "Thursday" },
//   { value: 5, label: "Friday" },
//   { value: 6, label: "Saturday" },
// ];

// type AvailabilitySlot = {
//   id?: number;
//   dayOfWeek: number;
//   startTime: string;
//   endTime: string;
// };

// export default function Availability() {
//   const [availability, setAvailability] = useState<AvailabilitySlot[]>([]);
//   const navigate = useNavigate();

//   // Load existing availability from backend
//   useEffect(() => {
//     const fetchAvailability = async () => {
//       const token = localStorage.getItem("token");
//       if (!token) {
//         navigate("/login");
//         return;
//       }

//       try {
//         const res = await fetch(`${API_URL}/availability`, {
//           headers: {
//             "Content-Type": "application/json",
//             Authorization: `Bearer ${token}`,
//           },
//         });

//         if (!res.ok) throw new Error("Failed to load availability");

//         const slots = await res.json();
//         console.log("Fetched availability:", slots);

//         setAvailability(slots);
//       } catch (err) {
//         console.error("Error fetching availability:", err);
//       }
//     };

//     fetchAvailability();
//   }, [navigate]);

//   // Add availability
//   const addAvailability = async (dayOfWeek: number, startTime: string, endTime: string) => {
//     try {
//       const token = localStorage.getItem("token");
//       if (!token) {
//         navigate("/login");
//         return;
//       }

//       const res = await fetch(`${API_URL}/availability`, {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//           Authorization: `Bearer ${token}`,
//         },

//         // body: JSON.stringify([{ dayOfWeek, startTime, endTime }]),
//         body: JSON.stringify({ dayOfWeek, startTime, endTime }),

//         // body: JSON.stringify([{ dayOfWeek, startTime, endTime }]),
//       });

//       if (!res.ok) throw new Error("Failed to add availability");

//       const data = await res.json();


//       if (Array.isArray(data.availabilities)) {
//         setAvailability((prev) => [...prev, ...data.availabilities]);
//       } else {
//         setAvailability((prev) => [...prev, data]);
//       }

//     } catch (err) {
//       console.error("Error saving availability:", err);
//       alert("Error saving availability ❌");
//     }
//   };

//   // Delete availability
//   const handleDelete = async (id?: number) => {
//     if (!id) return;
//     try {
//       const token = localStorage.getItem("token");
//       if (!token) {
//         navigate("/login");
//         return;
//       }

//       const res = await fetch(`${API_URL}/availability/${id}`, {
//         method: "DELETE",
//         headers: { Authorization: `Bearer ${token}` },
//       });

//       if (!res.ok) throw new Error("Failed to delete slot");

//       setAvailability((prev) => prev.filter((slot) => slot.id !== id));
//     } catch (err) {
//       console.error("Error deleting slot:", err);
//       alert("Error deleting slot ❌");
//     }
//   };

//   return (
//     <div className="max-w-2xl mx-auto mt-6 border rounded-lg shadow p-6">
//       <h2 className="text-xl font-semibold mb-4">Set Weekly Availability</h2>

//       <AvailabilityForm onAdd={addAvailability} />

//       <div className="space-y-3 mt-4">
//         {availability.map((slot) => (
//           <div
//             key={slot.id || `${slot.dayOfWeek}-${slot.startTime}`}
//             className="flex justify-between items-center bg-gray-100 p-2 rounded"
//           >
//             <span>
//               {days.find((d) => d.value === slot.dayOfWeek)?.label}:{" "}
//               {slot.startTime} - {slot.endTime}
//             </span>
//             <button
//               className="bg-red-500 text-white px-2 py-1 rounded text-sm"
//               onClick={() => handleDelete(slot.id)}
//             >
//               Delete
//             </button>
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// }

// function AvailabilityForm({ onAdd }: { onAdd: (day: number, start: string, end: string) => void }) {
//   const [dayOfWeek, setDayOfWeek] = useState<number>(1);
//   const [startTime, setStartTime] = useState<string>("");
//   const [endTime, setEndTime] = useState<string>("");

//   return (
//     <div className="flex items-center gap-2">
//       <select
//         className="border p-2 rounded"
//         value={dayOfWeek}
//         onChange={(e) => setDayOfWeek(Number(e.target.value))}
//       >
//         {days.map((d) => (
//           <option key={d.value} value={d.value}>
//             {d.label}
//           </option>
//         ))}
//       </select>

//       <input
//         type="time"
//         className="border p-2 rounded"
//         value={startTime}
//         onChange={(e) => setStartTime(e.target.value)}
//       />
//       <input
//         type="time"
//         className="border p-2 rounded"
//         value={endTime}
//         onChange={(e) => setEndTime(e.target.value)}
//       />

//       <button
//         className="bg-blue-500 text-white px-4 py-2 rounded"
//         onClick={() => {
//           if (startTime && endTime) {
//             onAdd(dayOfWeek, startTime, endTime);
//             setStartTime("");
//             setEndTime("");
//           }
//         }}
//       >
//         Add
//       </button>
//     </div>
//   );
// }


