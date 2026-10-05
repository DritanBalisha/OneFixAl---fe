import React, { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { 
  Wrench, 
  Zap, 
  Droplet, 
  ShieldCheck, 
  Clock, 
  Award, 
  UserPlus, 
  Search, 
  CalendarCheck, 
  ChevronRight,
  LogOut,
  User
} from "lucide-react"; // Ensure lucide-react is installed, or replace with icons of your choice

interface HomePageProps {
  user?: string | null;
}

const CATEGORIES = [
  { id: "plumbing", name: "Plumbing", description: "Pipes, leaks, drainage & installations", icon: Droplet },
  { id: "electrical", name: "Electrical", description: "Wiring, outlets, panels & lighting", icon: Zap },
  { id: "hvac", name: "AC & Heating", description: "AC repair, cleaning, and heating systems", icon: Wrench },
  { id: "appliances", name: "Home Appliances", description: "Washing machines, fridges & ovens", icon: ShieldCheck },
];

export default function HomePage({ user }: HomePageProps) {
  const navigate = useNavigate();

  useEffect(() => {
    const userData = localStorage.getItem("user");
    if (userData) {
      try {
        const parsedUser = JSON.parse(userData);
        if (parsedUser.role === "technician") {
          navigate("/tech-dashboard");
        } else if (parsedUser.role === "client") {
          navigate("/client-dashboard");
        }
      } catch (e) {
        console.error("Error parsing user for redirect", e);
      }
    }
  }, [navigate]);

  const handleLogout = () => { // Ensure lucev
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    window.location.reload();
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50 text-gray-800 antialiased">
      {/* NAVBAR */}
      <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-gray-100 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex justify-between items-center">
          <Link to="/" className="flex items-center space-x-2">
            <div className="bg-blue-600 text-white p-2 rounded-xl">
              <Wrench className="w-5 h-5" />
            </div>
            <span className="text-xl font-bold tracking-tight text-gray-900">
              OneFix<span className="text-blue-600">AL</span>
            </span>
          </Link>

          <nav className="hidden md:flex items-center space-x-8">
            <a href="#services" className="text-sm font-medium text-gray-600 hover:text-blue-600 transition">
              Services
            </a>
            <a href="#how-it-works" className="text-sm font-medium text-gray-600 hover:text-blue-600 transition">
              How it Works
            </a>
            <Link to="/technicians" className="text-sm font-medium text-gray-600 hover:text-blue-600 transition">
              Browse Technicians
            </Link>
          </nav>

          <div className="flex items-center space-x-3">
            {localStorage.getItem("user") ? (
              <button
                onClick={handleLogout}
                className="inline-flex items-center space-x-2 text-sm font-medium text-red-600 hover:text-red-700 bg-red-50 hover:bg-red-100 px-4 py-2 rounded-lg transition"
              >
                <LogOut className="w-4 h-4" />
                <span>Logout</span>
              </button>
            ) : (
              <>
                <Link
                  to="/login"
                  className="text-sm font-medium text-gray-700 hover:text-blue-600 px-3 py-2 rounded-lg transition"
                >
                  Sign In
                </Link>
                <Link
                  to="/register"
                  className="inline-flex items-center text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg transition shadow-sm"
                >
                  Get Started
                </Link>
              </>
            )}
          </div>
        </div>
      </header>

      {/* HERO SECTION */}
      <section className="relative overflow-hidden bg-gradient-to-b from-blue-50/50 via-white to-gray-50 pt-16 pb-20 lg:pt-24 lg:pb-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-blue-100 text-blue-700 mb-6">
            <ShieldCheck className="w-4 h-4" /> Verified Local Professionals in Albania
          </span>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-gray-900 tracking-tight max-w-4xl mx-auto leading-tight">
            Reliable Home Repairs & Services <span className="text-blue-600">at Your Doorstep</span>
          </h1>
          <p className="mt-6 text-lg sm:text-xl text-gray-600 max-w-2xl mx-auto">
            Connect with verified plumbers, electricians, HVAC experts, and technicians across Albania in just a few clicks.
          </p>

          {/* CTA Buttons */}
          <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link
              to="/techprofiles"
              className="w-full sm:w-auto inline-flex items-center justify-center space-x-2 bg-blue-600 text-white font-semibold px-8 py-3.5 rounded-xl hover:bg-blue-700 transition shadow-lg shadow-blue-500/25"
            >
              <span>Book a Technician</span>
              <ChevronRight className="w-5 h-5" />
            </Link>
            <Link
              to="/register?role=technician"
              className="w-full sm:w-auto inline-flex items-center justify-center space-x-2 bg-white border border-gray-200 text-gray-700 font-semibold px-8 py-3.5 rounded-xl hover:bg-gray-50 transition"
            >
              <UserPlus className="w-5 h-5 text-gray-500" />
              <span>Become a Service Provider</span>
            </Link>
          </div>

          {/* Trust Indicators */}
          <div className="mt-12 grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-3xl mx-auto pt-8 border-t border-gray-200/60">
            <div className="flex items-center justify-center space-x-3 text-gray-600">
              <ShieldCheck className="w-5 h-5 text-blue-600" />
              <span className="text-sm font-medium">100% Vetted Techs</span>
            </div>
            <div className="flex items-center justify-center space-x-3 text-gray-600">
              <Clock className="w-5 h-5 text-blue-600" />
              <span className="text-sm font-medium">Fast Emergency Response</span>
            </div>
            <div className="flex items-center justify-center space-x-3 text-gray-600">
              <Award className="w-5 h-5 text-blue-600" />
              <span className="text-sm font-medium">Transparent Pricing</span>
            </div>
          </div>
        </div>
      </section>

      {/* CATEGORIES SECTION */}
      <section id="services" className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-xl mx-auto mb-12">
            <h2 className="text-3xl font-bold text-gray-900">Popular Services</h2>
            <p className="text-gray-600 mt-2">Find experts for any home issue or maintenance need.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {CATEGORIES.map((cat) => {
              const Icon = cat.icon;
              return (
                <Link
                  key={cat.id}
                  to={`/techprofiles?category=${cat.id}`}
                  className="group bg-gray-50 hover:bg-blue-50/50 border border-gray-100 hover:border-blue-200 rounded-2xl p-6 transition duration-200 flex flex-col justify-between"
                >
                  <div>
                    <div className="w-12 h-12 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center mb-4 group-hover:scale-110 transition duration-200">
                      <Icon className="w-6 h-6" />
                    </div>
                    <h3 className="text-lg font-bold text-gray-900 group-hover:text-blue-600 transition">
                      {cat.name}
                    </h3>
                    <p className="text-sm text-gray-500 mt-2">{cat.description}</p>
                  </div>
                  <div className="mt-6 flex items-center text-xs font-semibold text-blue-600 group-hover:translate-x-1 transition">
                    <span>Find Pros</span>
                    <ChevronRight className="w-4 h-4 ml-1" />
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section id="how-it-works" className="py-16 bg-gray-50 border-t border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-xl mx-auto mb-12">
            <h2 className="text-3xl font-bold text-gray-900">How OneFixAL Works</h2>
            <p className="text-gray-600 mt-2">Get your issue fixed in 3 easy steps.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 text-center relative">
              <div className="w-12 h-12 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold text-lg mx-auto mb-4">
                1
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">Search Service</h3>
              <p className="text-gray-600 text-sm">Select the type of repair or service you need and specify your location.</p>
            </div>

            <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 text-center relative">
              <div className="w-12 h-12 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold text-lg mx-auto mb-4">
                2
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">Choose a Professional</h3>
              <p className="text-gray-600 text-sm">Compare profiles, reviews, ratings, and rates from vetted technicians.</p>
            </div>

            <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 text-center relative">
              <div className="w-12 h-12 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold text-lg mx-auto mb-4">
                3
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">Book & Get It Fixed</h3>
              <p className="text-gray-600 text-sm">Schedule a time that works best for you and receive instant updates.</p>
            </div>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-white mt-auto border-t border-gray-100 py-12 text-sm text-gray-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center space-x-2">
            <div className="bg-blue-600 text-white p-1.5 rounded-lg">
              <Wrench className="w-4 h-4" />
            </div>
            <span className="font-bold text-gray-900">OneFixAL</span>
          </div>
          <div className="flex space-x-6 text-gray-600">
            <Link to="/technicians" className="hover:text-blue-600">Technicians</Link>
            <Link to="/login" className="hover:text-blue-600">Login</Link>
            <Link to="/register" className="hover:text-blue-600">Sign Up</Link>
          </div>
          <p>© {new Date().getFullYear()} OneFixAL. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
