import React, { useState } from "react";
import { Link , useNavigate} from "react-router-dom";
import { API_URL } from "../api/config.ts";

export default function Signup() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
    const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('${API_URL}/signup', {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          Name: name,
          Email: email,
          Phone: phone,
          Password: password,
        }),
      });

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.error || "Signup failed");
      }

      const data = await res.json();
      console.log(data);
      alert("Signup successful!");
      navigate("/login");


    } catch (error) {
      console.error(error);
      alert("Error signing up");
    }
  };

  return (
  <div className="min-h-screen flex items-center justify-center bg-gray-100">
    <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
      <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">Signup</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-gray-700 mb-1">Name:</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
          />
        </div>

        <div>
          <label className="block text-gray-700 mb-1">Email:</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
          />
        </div>

        <div>
          <label className="block text-gray-700 mb-1">Phone:</label>
          <input
            type="text"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            required
            className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
          />
        </div>

        <div>
          <label className="block text-gray-700 mb-1">Password:</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
          />
        </div>

        <div>
          <input
            type="submit"
            value="Signup"
            className="w-full bg-green-500 text-white py-2 rounded hover:bg-green-600 cursor-pointer transition-colors"
          />
        </div>
      </form>

      <p className="mt-4 text-center text-gray-600">
        Already have an account?{" "}
        <Link to="/login" className="text-green-500 hover:underline">
          Login
        </Link>
      </p>
    </div>
  </div>
);

}
