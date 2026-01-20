import { Link } from "react-router-dom";

interface HomePageProps {
  user?: string | null; // or your user type
}

export default function HomePage({ user }: HomePageProps) {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      {/* NAVBAR */}
      <nav className="w-full bg-white shadow-sm py-4 px-6 flex justify-between items-center">
        <h1 className="text-2xl font-semibold text-blue-600">
          OneFixAL
        </h1>

        <div className="flex items-center space-x-4">
          <Link 
            to="/myProfile" 
            className="text-gray-700 hover:text-blue-600"
          >
            Profile
          </Link>

          <Link 
            to="/techprofiles" 
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
          >
            Book a Tech
          </Link>

          {user ? (
            <button 
              onClick={() => {
                localStorage.removeItem("token");
                window.location.reload();
              }} 
              className="text-red-500 font-medium"
            >
              Logout
            </button>
          ) : (
            <Link 
              to="/login" 
              className="text-blue-600 font-medium"
            >
              Login
            </Link>
          )}
        </div>
      </nav>

      {/* BODY CONTENT */}
      <main className="flex-1 flex flex-col justify-center items-center text-center px-4">
        <h2 className="text-4xl font-bold text-gray-800 mb-4">
          Welcome to OneFixAL
        </h2>
        <div className="bg-blue-500 text-white p-4">
  Tailwind Works!
</div>


        <p className="text-gray-600 max-w-2xl mb-8">
          Fast and easy platform to connect clients with professional technicians.
          Book a technician, manage appointments, and receive instant updates.
        </p>

        <Link 
          to="/book"
          className="bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700"
        >
          Get Started
        </Link>
      </main>

      {/* FOOTER */}
      <footer className="bg-white shadow-inner py-4 text-center text-gray-500">
        © {new Date().getFullYear()} OneFixAL – All rights reserved.
      </footer>
    </div>
  );
}

