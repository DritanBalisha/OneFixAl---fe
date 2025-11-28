import React, { useState } from "react";
import { Link , useNavigate} from "react-router-dom";

export default function Signup() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
    const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch("http://localhost:8000/signup", {
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
    <div>
      <h2>Signup</h2>
      <form onSubmit={handleSubmit}>
        <label>Name:</label><br />
        <input type="text" value={name} onChange={(e) => setName(e.target.value)} required /><br /><br />

        <label>Email:</label><br />
        <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required /><br /><br />

        <label>Phone:</label><br />
        <input type="text" value={phone} onChange={(e) => setPhone(e.target.value)} required /><br /><br />

        <label>Password:</label><br />
        <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required /><br /><br />

        <input type="submit" value="Signup" />
      </form>
      <br />
      <Link to="/login">Already have an account? Login</Link>
    </div>
  );
}
