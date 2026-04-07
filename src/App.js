import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Signup from "./pages/Singup.tsx";
import Login from "./pages/Login.tsx";
import Profile from "./pages/Profile.tsx"
// import ClientDashboard from "./pages/ClientDashboard.tsx"
import TPB from "./pages/TPB.tsx"
import Home from "./pages/Home.tsx"
import MyProfile from "./pages/MyProfile.tsx"
import TechProfiles from "./pages/TechProfiles.tsx";
import MainPage from "./pages/Main.tsx";
import Avalability from "./pages/Availability.tsx";
import MyBookings from "./pages/MyBookings.tsx";
import NotificationBell from "./pages/NotificationBell.tsx";
import NotificationSocket from "./pages/NotificationSocket.tsx";
import TPU from "./pages/TechUp.tsx"
import Payment from "./pages/Payment.tsx"

function App() {
  return (
    <Router>
      <NotificationSocket />
      <Routes>
        <Route path="/" element={<MainPage />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/availability" element={<Avalability />} />
        <Route path="/home" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/myBookings" element={<MyBookings />} />
        <Route path="/technician/:id" element={<TPB />} />
        <Route path="/myProfile" element={<MyProfile />} />
        <Route path="/profileupdatetech" element={<TPU />} />
        <Route path="/techprofiles" element={<TechProfiles />} />
        <Route path="/notifyBell" element={<NotificationBell />} />
        <Route path="/payment" element={<Payment />} />

      </Routes>
    </Router>
  );
}


export default App;


