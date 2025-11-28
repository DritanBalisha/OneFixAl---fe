import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch("http://localhost:8000/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (res.ok) {
        localStorage.setItem("token", data.token); // save token
        localStorage.setItem("user", JSON.stringify(data.user)); // save user info
        if (data.user && data.user.role) {
          localStorage.setItem("role", data.user.role.toLowerCase()); // normalize casing
        }
        
        alert(`Welcome, ${data.user.name}!`);
        navigate("/myProfile");
      } else {
        alert(data.error || "Login failed");
      }
    } catch (error) {
      console.error(error);
      alert("Error logging in");
    }
  };

  return (
    <div>
      <h2>Login</h2>
      <form onSubmit={handleSubmit}>
        <label>Email:</label><br />
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        /><br /><br />

        <label>Password:</label><br />
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        /><br /><br />

        <input type="submit" value="Login" />
      </form>
      <Link to="/signup">Don't have account ? Login</Link>
    </div>
  );
}
