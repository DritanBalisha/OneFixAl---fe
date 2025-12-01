import { Link } from "react-router-dom";

export default function HomePage() {
  const user = localStorage.getItem("token");

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      {/* NAVBAR */}
      <nav className="w-full bg-white shadow-sm py-4 px-6 flex justify-between items-center">
        <h1 className="text-2xl font-bold text-blue-600 tracking-wide">
          OneFixAL
        </h1>

        {/* MOBILE MENU BUTTON */}
        <div className="md:hidden">
          <button className="text-gray-600 text-xl">☰</button>
        </div>

        {/* DESKTOP LINKS */}
        <div className="hidden md:flex items-center space-x-6">
          <Link
            to="/technicians"
            className="hover:text-blue-600 text-gray-700"
          >
            Technicians
          </Link>

          <Link
            to="/book"
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
          >
            Book a Tech
          </Link>

          {user ? (
            <button
              onClick={() => {
                localStorage.removeItem("token");
                window.location.href = "/";
              }}
              className="text-red-500 hover:text-red-600 font-medium"
            >
              Logout
            </button>
          ) : (
            <Link
              to="/login"
              className="text-blue-600 font-medium hover:text-blue-700"
            >
              Login
            </Link>
          )}
        </div>
      </nav>

      {/* HERO SECTION */}
      <main className="flex-1 flex flex-col items-center justify-center text-center px-6 py-16">

        <h2 className="text-4xl md:text-5xl font-extrabold text-gray-800 leading-tight mb-6">
          Find Skilled Technicians.  
          <br />Fast, Easy & Reliable.
        </h2>

        <p className="text-gray-600 text-lg max-w-2xl mb-10">
          OneFixAL connects you instantly with verified technicians for home  
          repairs, maintenance and services. Book appointments and track your  
          technician in real-time.
        </p>

        <Link
          to="/book"
          className="px-8 py-4 bg-blue-600 text-white rounded-xl text-lg hover:bg-blue-700 shadow-md transition"
        >
          Book a Technician
        </Link>
      </main>

      {/* FEATURES SECTION */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-6 px-6 pb-16">
        
        <div className="bg-white p-6 rounded-xl shadow hover:shadow-md transition text-center">
          <h3 className="text-xl font-semibold mb-2">Fast Booking</h3>
          <p className="text-gray-600">
            Choose a technician and book an appointment in seconds.
          </p>
        </div>

        <div className="bg-white p-6 rounded-xl shadow hover:shadow-md transition text-center">
          <h3 className="text-xl font-semibold mb-2">Verified Experts</h3>
          <p className="text-gray-600">
            All technicians are verified and trusted professionals.
          </p>
        </div>

        <div className="bg-white p-6 rounded-xl shadow hover:shadow-md transition text-center">
          <h3 className="text-xl font-semibold mb-2">Live Notifications</h3>
          <p className="text-gray-600">
            Get instant updates when your technician accepts or cancels.
          </p>
        </div>

      </section>

      {/* FOOTER */}
      <footer className="bg-white py-4 text-center text-gray-500 shadow-inner">
        © {new Date().getFullYear()} OneFixAL — All rights reserved.
      </footer>
    </div>
  );
}
