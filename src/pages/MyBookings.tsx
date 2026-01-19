import React, { useEffect, useState } from "react";
import { API_URL } from "../api/config.ts";

type Booking = {
  id: number;
  technician_id: number;
  customer_id: number;
  availability_id: number;
  timeslot: string;
  description: string;
  status: string;
  created_at: string;
  technician_name?: string;
  customer_name?: string;
};

export default function MyBookings() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const res = await fetch(`${API_URL}/my-bookings`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (!res.ok) throw new Error("Failed to load bookings");
        const data = await res.json();
        setBookings(data);
      } catch (err) {
        console.error("Error fetching bookings:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchBookings();
  }, []);

  const updateBookingStatus = async (id: number, status: string) => {
    try {
      const res = await fetch(`${API_URL}/bookings/${id}/status`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status }),
      });

      if (!res.ok) throw new Error("Failed to update status");

      const updated = await res.json();

      if (status === "cancelled") {
        setBookings((prev) => prev.filter((b) => b.id !== id));
      } else {
        setBookings((prev) =>
          prev.map((b) => (b.id === id ? updated.booking : b))
        );
      }

      alert(`Booking ${status} ✅`);
    } catch (err) {
      console.error("Status update error:", err);
      alert("Failed to update status ❌");
    }
  };

  if (loading) return <p>Loading bookings...</p>;

  if (bookings.length === 0) return <p>No bookings found.</p>;

  return (
    <div className="max-w-4xl mx-auto mt-8">
      <h2 className="text-2xl font-semibold mb-4">My Bookings</h2>

      {bookings.map((b) => (
        <div
          key={b.id}
          className="border rounded p-4 mb-4 shadow-sm bg-gray-50"
        >
          <p>
            <b>Date:</b> {new Date(b.timeslot).toLocaleString()}
          </p>
          <p className="mt-1">
            <b>Status:</b>{" "}
            <span
              className={`${
                b.status === "confirmed"
                  ? "text-green-600"
                  : b.status === "cancelled"
                  ? "text-red-600"
                  : "text-yellow-600"
              } font-semibold`}
            >
              {b.status}
            </span>
          </p>

          <div className="mt-2">
            {user.role === "client" && (
              <p>
                <b>Technician:</b> {b.technician_name || b.technician_id}
              </p>
            )}
            {user.role === "technician" && (
              <p>
                <b>Client:</b> {b.customer_name || b.customer_id}
              </p>
            )}
          </div>

          {/* 🧾 Problem Description */}
          {b.description && (
            <div className="mt-3 bg-white p-3 rounded border-l-4 border-blue-500">
              <b>Problem:</b>
              <p className="text-gray-700 mt-1 italic">{b.description}</p>
            </div>
          )}

          {/* 🛠 Technician Action Buttons */}
          <div className="mt-4 space-x-2">
            {b.status === "pending" && (
              <>
                {user.role === "technician" && (
                  <button
                    onClick={() => updateBookingStatus(b.id, "confirmed")}
                    className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600"
                  >
                    Accept Job
                  </button>
                )}
                <button
                  onClick={() => updateBookingStatus(b.id, "cancelled")}
                  className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                >
                  Cancel
                </button>
              </>
            )}

            {b.status === "confirmed" && user.role === "technician" && (
              <>
                <button
                  onClick={() => alert("💰 Notify client to proceed with payment")}
                  className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
                >
                  Notify Client for Payment
                </button>
                <button
                  onClick={() => updateBookingStatus(b.id, "cancelled")}
                  className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                >
                  Cancel Job
                </button>
              </>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}

