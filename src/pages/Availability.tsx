import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
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
  const navigate = useNavigate();

  // Load existing availability from backend
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

  // Add availability
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

        // body: JSON.stringify([{ dayOfWeek, startTime, endTime }]),
        body: JSON.stringify({ dayOfWeek, startTime, endTime }),

        // body: JSON.stringify([{ dayOfWeek, startTime, endTime }]),
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

  // Delete availability
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
    <div className="max-w-2xl mx-auto mt-6 border rounded-lg shadow p-6">
      <h2 className="text-xl font-semibold mb-4">Set Weekly Availability</h2>

      <AvailabilityForm onAdd={addAvailability} />

      <div className="space-y-3 mt-4">
        {availability.map((slot) => (
          <div
            key={slot.id || `${slot.dayOfWeek}-${slot.startTime}`}
            className="flex justify-between items-center bg-gray-100 p-2 rounded"
          >
            <span>
              {days.find((d) => d.value === slot.dayOfWeek)?.label}:{" "}
              {slot.startTime} - {slot.endTime}
            </span>
            <button
              className="bg-red-500 text-white px-2 py-1 rounded text-sm"
              onClick={() => handleDelete(slot.id)}
            >
              Delete
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

function AvailabilityForm({ onAdd }: { onAdd: (day: number, start: string, end: string) => void }) {
  const [dayOfWeek, setDayOfWeek] = useState<number>(1);
  const [startTime, setStartTime] = useState<string>("");
  const [endTime, setEndTime] = useState<string>("");

  return (
    <div className="flex items-center gap-2">
      <select
        className="border p-2 rounded"
        value={dayOfWeek}
        onChange={(e) => setDayOfWeek(Number(e.target.value))}
      >
        {days.map((d) => (
          <option key={d.value} value={d.value}>
            {d.label}
          </option>
        ))}
      </select>

      <input
        type="time"
        className="border p-2 rounded"
        value={startTime}
        onChange={(e) => setStartTime(e.target.value)}
      />
      <input
        type="time"
        className="border p-2 rounded"
        value={endTime}
        onChange={(e) => setEndTime(e.target.value)}
      />

      <button
        className="bg-blue-500 text-white px-4 py-2 rounded"
        onClick={() => {
          if (startTime && endTime) {
            onAdd(dayOfWeek, startTime, endTime);
            setStartTime("");
            setEndTime("");
          }
        }}
      >
        Add
      </button>
    </div>
  );
}


