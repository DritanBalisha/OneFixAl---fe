"use client";
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

type Technician = {
  id: number;
  name: string;
  email: string;
  phone: string;
};

type Availability = {
  id: number;
  dayOfWeek: number;
  startTime: string;
  endTime: string;
  is_booked: boolean;
};

export default function TechnicianProfile() {
  const { id } = useParams<{ id: string }>();
  const [technician, setTechnician] = useState<Technician | null>(null);
  const [availability, setAvailability] = useState<Availability[]>([]);
  const [description, setDescription] = useState(""); // 🧾 new field for problem description
  const navigate = useNavigate();

  // Load technician details + availability
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
      return;
    }

    const fetchData = async () => {
      try {
        const [techRes, availRes] = await Promise.all([
          fetch(`http://localhost:8000/users/${id}`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
          fetch(`http://localhost:8000/availability/${id}`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
        ]);

        if (!techRes.ok) throw new Error("Failed to fetch technician");
        if (!availRes.ok) throw new Error("Failed to fetch availability");

        const techData = await techRes.json();
        const availData = await availRes.json();

        setTechnician(techData);
        setAvailability(availData);
      } catch (err) {
        console.error("Error loading technician:", err);
      }
    };

    fetchData();
  }, [id, navigate]);

  // 🧾 Booking with description
  const createBooking = async (slotId: number) => {
    const token = localStorage.getItem("token");
    const user = JSON.parse(localStorage.getItem("user") || "{}");

    if (!token || !user?.id) {
      navigate("/login");
      return;
    }

    if (!description.trim()) {
      alert("⚠️ Please describe your problem before booking!");
      return;
    }

    try {
      const res = await fetch("http://localhost:8000/bookings", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          customer_id: user.id,
          technician_id: Number(id),
          availability_id: slotId,
          description: description,
          booking_fee: 20,
          status: "pending",
        }),
      });

      if (!res.ok) throw new Error(await res.text());

      alert("✅ Booking sent to technician! You’ll be notified once they confirm.");
      setDescription(""); // clear after booking
    } catch (err) {
      console.error("Booking error:", err);
      alert("❌ Booking failed!");
    }
  };

  if (!technician) return <p>Loading...</p>;

  return (
    <div className="max-w-2xl mx-auto mt-8 p-6 border rounded-lg shadow">
      <h2 className="text-2xl font-semibold mb-2">{technician.name}</h2>
      <p>Email: {technician.email}</p>
      <p>Phone: {technician.phone}</p>

      <h3 className="text-xl mt-6 mb-2 font-medium">Describe your problem</h3>
      <textarea
        className="w-full border rounded p-2 mb-4"
        placeholder="Example: My sink is blocked and leaking water."
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      />

      <h3 className="text-xl mt-6 mb-2 font-medium">Available Slots</h3>
      {availability.length > 0 ? (
        <div className="space-y-2">
          {availability
            .filter((slot) => !slot.is_booked)
            .map((slot) => (
              <div
                key={slot.id}
                className="flex justify-between items-center bg-gray-100 p-2 rounded"
              >
                <span>
                  Day {slot.dayOfWeek}: {slot.startTime} - {slot.endTime}
                </span>
                <button
                  onClick={() => createBooking(slot.id)}
                  className="bg-green-500 text-white px-3 py-1 rounded"
                >
                  Book
                </button>
              </div>
            ))}
        </div>
      ) : (
        <p>No available slots.</p>
      )}

    </div>
  );
}
