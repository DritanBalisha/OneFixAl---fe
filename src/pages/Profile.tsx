import React from "react";
import { useNavigate } from "react-router-dom";

export default function Profile() {
  const navigate = useNavigate();

  const handleRoleSelect = (role: string) => {
    if (role === "client") {
      navigate("/client-dashboard");
    } else if (role === "technician") {
      navigate("/technician-dashboard");
    }
  };

  return (
    <div>
      <h2>Choose Your Role</h2>
      <button onClick={() => handleRoleSelect("client")}>Client</button>
      <button onClick={() => handleRoleSelect("technician")}>Technician</button>
    </div>
  );
}
