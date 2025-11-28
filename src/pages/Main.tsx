import { useNavigate } from "react-router-dom";

export default function MainPage() {
    const navigate = useNavigate();

    const goToProfile = () => {
        const role = localStorage.getItem("role")?.toLowerCase();
        if (role === "technician") {
            navigate("/technician-dashboard");
        } else if (role === "client") {
            navigate("/myProfile");
        } else {
            alert("Unknown role! Please update your profile.");
        }
    };


    return (
        <div>
            <h1>Welcome to Dashboard</h1>
            <button onClick={goToProfile}>My Profile</button>
        </div>
    );
}
