import { useEffect, useState } from "react";

export default function NotificationBell() {
  const [notifications, setNotifications] = useState<any[]>([]);
  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchNotifications = async () => {
      if (!token) return;
      const res = await fetch("http://localhost:8000/notifications", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) return;
      const data = await res.json();
      setNotifications(data);
    };

    fetchNotifications();
    const interval = setInterval(fetchNotifications, 5000); // 🔁 check every 5s
    return () => clearInterval(interval);
  }, [token]);

  const markAsSeen = async (id: number) => {
    await fetch(`http://localhost:8000/notifications/${id}/seen`, {
      method: "PUT",
      headers: { Authorization: `Bearer ${token}` },
    });
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  };

  if (notifications.length === 0) return null;

  const latest = notifications[0];
  return (
    <div
      onClick={() => {
        markAsSeen(latest.id);
        window.location.href = "/payment"; // 🔁 redirect to payment page
      }}
      className="fixed bottom-6 right-6 bg-yellow-100 border border-yellow-400 rounded-lg p-4 shadow-lg cursor-pointer animate-bounce"
    >
      <p className="text-lg">🔔 You have a new update</p>
      <p className="text-sm text-gray-600">{latest.message}</p>
    </div>
  );
}
