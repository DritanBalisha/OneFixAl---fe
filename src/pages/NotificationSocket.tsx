import { useEffect, useState } from "react";
import { API_URL } from "../api/config.ts";

export default function NotificationSocket() {
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user") || "{}");
    if (!user?.id) return;

// 1. Convert protocol and remove potential double slashes
const socketUrl = API_URL.replace(/^http/, "ws").replace(/\/$/, "");

// 2. Create the WebSocket with a single set of backticks
const ws = new WebSocket(`${socketUrl}/ws?user_id=${user.id}`);

    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      if (data.type === "notification") {
        setMessage(data.message);
      }
    };

    ws.onclose = () => console.log("🔌 WebSocket disconnected");
    ws.onerror = (e) => console.error("WebSocket error:", e);

    return () => ws.close();
  }, []);

  if (!message) return null;

  return (
    <div
      className="fixed bottom-6 right-6 bg-yellow-100 border border-yellow-400 rounded-lg p-4 shadow-lg cursor-pointer animate-bounce"
      onClick={() => {
        setMessage(null);
        window.location.href = "/payment"; // redirect client to payment
      }}
    >
      <p className="text-lg">🔔 {message}</p>
      <p className="text-sm text-gray-600">Click to proceed with payment</p>
    </div>
  );
}



