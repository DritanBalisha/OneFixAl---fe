import React, { useState, useEffect } from "react";
import {
  Wrench,
  Zap,
  Droplets,
  Wind,
  ShieldCheck,
  Star,
  MapPin,
  Clock,
  CheckCircle2,
  Lock,
  ChevronRight,
  Menu,
  X,
  Search,
  Calendar,
  User,
  LogOut,
  Phone,
  Mail,
  Home,
  Check,
  Award,
  ArrowRight,
  DollarSign,
  Paintbrush,
  Key,
  Flame
} from "lucide-react";

// Local Neighborhoods in Tirana
const TIRANA_NEIGHBORHOODS = [
  "Blloku",
  "Center (Qendër)",
  "Laprakë",
  "Ali Demi",
  "Kombinat",
  "Kamëz",
  "Don Bosko",
  "Yzberisht",
  "Astir",
  "Fresku"
];

// Service Categories
const SERVICE_CATEGORIES = [
  { id: "plumbing", name: "Plumbing", icon: Droplets, description: "Leak repairs, pipe installations, drain cleaning & water heaters", basePrice: 2500, deposit: 500 },
  { id: "electrical", name: "Electrical", icon: Zap, description: "Wiring, circuit breakers, light fixtures & appliance outlets", basePrice: 3000, deposit: 600 },
  { id: "hvac", name: "HVAC & AC", icon: Wind, description: "AC unit installation, freon refill, cleaning & maintenance", basePrice: 3500, deposit: 700 },
  { id: "appliances", name: "Appliance Repair", icon: Flame, description: "Washing machines, fridges, ovens & dishwasher repairs", basePrice: 2800, deposit: 550 },
  { id: "locksmith", name: "Locksmith & Security", icon: Key, description: "Emergency door unlocking, lock replacements & security upgrade", basePrice: 2200, deposit: 400 },
  { id: "painting", name: "Painting & Drywall", icon: Paintbrush, description: "Wall painting, plaster repair, damp treatment & ceiling work", basePrice: 4000, deposit: 800 }
];

// Featured Verified Technicians in Tirana
const FEATURED_TECHNICIANS = [
  {
    id: "tech-1",
    name: "Arben Hoxha",
    trade: "Electrical & AC Specialist",
    rating: 4.9,
    reviewsCount: 124,
    completedJobs: 180,
    areas: ["Blloku", "Center (Qendër)", "Don Bosko"],
    avatar: "https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&q=80&w=250",
    verified: true,
    basePrice: 3000,
    deposit: 600,
    badge: "Master Certified",
    bio: "Certified electrical engineer with over 8 years experience fixing high and low voltage systems in residential and commercial units across Tirana."
  },
  {
    id: "tech-2",
    name: "Genti Basha",
    trade: "Master Plumber",
    rating: 4.85,
    reviewsCount: 98,
    completedJobs: 142,
    areas: ["Laprakë", "Astir", "Yzberisht"],
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=250",
    verified: true,
    basePrice: 2500,
    deposit: 500,
    badge: "Fast Responder",
    bio: "Emergency plumbing specialist available 24/7. Expert in modern boiler installations, drain unclogging, and bathroom pipe overhauls."
  },
  {
    id: "tech-3",
    name: "Edmond Prifti",
    trade: "HVAC & Appliance Tech",
    rating: 5.0,
    reviewsCount: 86,
    completedJobs: 110,
    areas: ["Center (Qendër)", "Ali Demi", "Fresku"],
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=250",
    verified: true,
    basePrice: 3500,
    deposit: 700,
    badge: "Top Rated 2026",
    bio: "Authorized technician for major AC and appliance brands in Tirana. Guaranteed clean job site and 30-day service warranty."
  },
  {
    id: "tech-4",
    name: "Ilir Meta",
    trade: "Locksmith & Security",
    rating: 4.92,
    reviewsCount: 64,
    completedJobs: 95,
    areas: ["Blloku", "Kombinat", "Kamëz"],
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=250",
    verified: true,
    basePrice: 2200,
    deposit: 400,
    badge: "Emergency Service",
    bio: "Quick arrival anywhere in Tirana within 30 minutes. High-security door lock replacements, safe unlocking, and key duplication."
  }
];

// Local Testimonials
const TESTIMONIALS = [
  {
    id: 1,
    name: "Elira K.",
    location: "Blloku, Tirana",
    service: "AC Repair & Servicing",
    rating: 5,
    text: "My AC broke during the heatwave. Booked Arben through OneFixAL, paid 700 LEK deposit online to secure the appointment, and paid the remaining 2,800 LEK in cash right after he finished. Highly transparent!",
    date: "2 days ago"
  },
  {
    id: 2,
    name: "Dritan M.",
    location: "Don Bosko, Tirana",
    service: "Plumbing Pipe Fix",
    rating: 5,
    text: "Finally a reliable technician app in Tirana! Fixed our kitchen sink leak within 2 hours. Having a certified technician with upfront fixed prices in LEK gives huge peace of mind.",
    date: "1 week ago"
  },
  {
    id: 3,
    name: "Suela T.",
    location: "Center (Qendër)",
    service: "Washing Machine Repair",
    rating: 5,
    text: "Super smooth experience. Paying a small deposit locks in the tech's schedule, and paying the rest in cash makes it very convenient in Albania. 10/10 service!",
    date: "2 weeks ago"
  }
];

export default function App() {
  // State variables
  const [currentUser, setCurrentUser] = useState(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedArea, setSelectedArea] = useState("");
  const [howItWorksTab, setHowItWorksTab] = useState("client"); // 'client' | 'technician'
  
  // Modal Booking State
  const [bookingModalOpen, setBookingModalOpen] = useState(false);
  const [bookingStep, setBookingStep] = useState(1);
  const [bookingData, setBookingData] = useState({
    serviceId: "plumbing",
    serviceName: "Plumbing",
    techId: "",
    techName: "Any Available Certified Tech",
    area: "Center (Qendër)",
    address: "",
    date: "",
    time: "Morning (09:00 - 12:00)",
    notes: "",
    basePrice: 2500,
    deposit: 500
  });

  // Check auth state on load (preserving user logic)
  useEffect(() => {
    const userData = localStorage.getItem("user");
    if (userData) {
      try {
        const parsedUser = JSON.parse(userData);
        setCurrentUser(parsedUser);
      } catch (e) {
        console.error("Error parsing user data from localStorage", e);
      }
    }
  }, []);

  // Handle Logout
  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    setCurrentUser(null);
  };

  // Quick Login Simulation for Demo
  const handleDemoLogin = (role = "client") => {
    const fakeUser = {
      name: role === "client" ? "Blerina L." : "Kreshnik T.",
      email: `${role}@onefixal.al`,
      role: role
    };
    localStorage.setItem("user", JSON.stringify(fakeUser));
    setCurrentUser(fakeUser);
  };

  // Open booking modal pre-configured
  const handleOpenBooking = (tech = null, category = null) => {
    let price = 2500;
    let dep = 500;
    let sName = "General Repair";
    let sId = "plumbing";

    if (category) {
      sName = category.name;
      sId = category.id;
      price = category.basePrice;
      dep = category.deposit;
    } else if (tech) {
      price = tech.basePrice;
      dep = tech.deposit;
      sName = tech.trade;
    }

    setBookingData((prev) => ({
      ...prev,
      serviceId: sId,
      serviceName: sName,
      techId: tech ? tech.id : "",
      techName: tech ? tech.name : "Any Available Certified Tech",
      basePrice: price,
      deposit: dep,
      area: selectedArea || "Center (Qendër)"
    }));
    setBookingStep(1);
    setBookingModalOpen(true);
  };

  const filteredTechnicians = FEATURED_TECHNICIANS.filter((tech) => {
    const matchesCategory =
      selectedCategory === "all" ||
      tech.trade.toLowerCase().includes(selectedCategory.toLowerCase());
    const matchesArea =
      !selectedArea || tech.areas.includes(selectedArea);
    return matchesCategory && matchesArea;
  });

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-800 flex flex-col">
      
      {}
      <nav className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-slate-100 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-20 items-center">
            
            {/* Logo */}
            <a href="#" className="flex items-center space-x-3 group">
              <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center text-white shadow-md shadow-blue-500/20 group-hover:bg-blue-700 transition-colors">
                <Wrench className="w-5 h-5" />
              </div>
              <div className="flex flex-col">
                <span className="text-2xl font-black tracking-tight text-slate-900 leading-none">
                  OneFix<span className="text-blue-600">AL</span>
                </span>
                <span className="text-[10px] uppercase font-bold tracking-widest text-slate-400 mt-1">
                  Tirana Services
                </span>
              </div>
            </a>

            {/* Desktop Navigation Links */}
            <div className="hidden md:flex items-center space-x-8">
              <a href="#services" className="text-sm font-semibold text-slate-600 hover:text-blue-600 transition-colors">
                Services
              </a>
              <a href="#technicians" className="text-sm font-semibold text-slate-600 hover:text-blue-600 transition-colors">
                Verified Techs
              </a>
              <a href="#how-it-works" className="text-sm font-semibold text-slate-600 hover:text-blue-600 transition-colors">
                How It Works
              </a>
              <a href="#coverage" className="text-sm font-semibold text-slate-600 hover:text-blue-600 transition-colors">
                Tirana Coverage
              </a>
            </div>

            {/* Right Action CTA / Auth */}
            <div className="hidden md:flex items-center space-x-4">
              <button
                onClick={() => handleOpenBooking()}
                className="bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm px-5 py-2.5 rounded-xl shadow-md shadow-blue-600/20 transition-all hover:scale-[1.02] active:scale-[0.98]"
              >
                Book a Tech
              </button>

              {currentUser ? (
                <div className="flex items-center space-x-3 pl-3 border-l border-slate-200">
                  <div className="flex items-center space-x-2 bg-slate-100 px-3 py-1.5 rounded-lg">
                    <User className="w-4 h-4 text-blue-600" />
                    <span className="text-sm font-medium text-slate-700">{currentUser.name}</span>
                  </div>
                  <button
                    onClick={handleLogout}
                    title="Logout"
                    className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                  >
                    <LogOut className="w-5 h-5" />
                  </button>
                </div>
              ) : (
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => handleDemoLogin("client")}
                    className="text-sm font-semibold text-slate-700 hover:text-blue-600 px-3 py-2 rounded-lg transition-colors"
                  >
                    Log In
                  </button>
                  <button
                    onClick={() => handleDemoLogin("technician")}
                    className="text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200 px-3 py-2 rounded-lg hover:bg-emerald-100 transition-colors"
                  >
                    Tech Portal
                  </button>
                </div>
              )}
            </div>

            {/* Mobile Hamburger Toggle */}
            <div className="md:hidden flex items-center">
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="p-2 text-slate-600 hover:text-blue-600 rounded-lg"
              >
                {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-white border-b border-slate-200 px-4 pt-2 pb-6 space-y-3">
            <a
              href="#services"
              onClick={() => setMobileMenuOpen(false)}
              className="block py-2 text-slate-700 font-medium hover:text-blue-600"
            >
              Services
            </a>
            <a
              href="#technicians"
              onClick={() => setMobileMenuOpen(false)}
              className="block py-2 text-slate-700 font-medium hover:text-blue-600"
            >
              Verified Technicians
            </a>
            <a
              href="#how-it-works"
              onClick={() => setMobileMenuOpen(false)}
              className="block py-2 text-slate-700 font-medium hover:text-blue-600"
            >
              How It Works
            </a>
            <a
              href="#coverage"
              onClick={() => setMobileMenuOpen(false)}
              className="block py-2 text-slate-700 font-medium hover:text-blue-600"
            >
              Tirana Areas
            </a>

            <div className="pt-4 border-t border-slate-100 space-y-2">
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  handleOpenBooking();
                }}
                className="w-full bg-blue-600 text-white font-semibold py-3 rounded-xl shadow-md text-center"
              >
                Book a Tech Now
              </button>

              {currentUser ? (
                <div className="flex items-center justify-between pt-2">
                  <span className="text-sm font-medium text-slate-600">Logged in as: {currentUser.name}</span>
                  <button
                    onClick={handleLogout}
                    className="text-sm text-red-600 font-medium hover:underline"
                  >
                    Logout
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-2 pt-2">
                  <button
                    onClick={() => {
                      handleDemoLogin("client");
                      setMobileMenuOpen(false);
                    }}
                    className="w-full py-2.5 text-slate-700 border border-slate-200 rounded-lg text-sm font-semibold text-center"
                  >
                    Log In (Client)
                  </button>
                  <button
                    onClick={() => {
                      handleDemoLogin("technician");
                      setMobileMenuOpen(false);
                    }}
                    className="w-full py-2.5 text-emerald-700 bg-emerald-50 border border-emerald-200 rounded-lg text-sm font-semibold text-center"
                  >
                    Tech Login
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
      </nav>

      <main className="flex-1">
        {}
        <section className="relative bg-gradient-to-b from-blue-900 via-slate-900 to-slate-900 text-white py-16 lg:py-24 overflow-hidden">
          {/* Background Decorative Blur Elements */}
          <div className="absolute top-0 right-0 -mr-20 -mt-20 w-96 h-96 rounded-full bg-blue-500/10 blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-96 h-96 rounded-full bg-emerald-500/10 blur-3xl pointer-events-none" />

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
              
              {/* Hero Text */}
              <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
                <div className="inline-flex items-center space-x-2 bg-blue-500/10 border border-blue-400/20 rounded-full px-4 py-1.5 text-blue-300 text-xs sm:text-sm font-medium">
                  <ShieldCheck className="w-4 h-4 text-emerald-400" />
                  <span>Tirana's Verified Tech Marketplace</span>
                </div>

                <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight leading-tight">
                  Certified Home & Business Technicians in <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-emerald-400">Tirana</span>
                </h1>

                <p className="text-slate-300 text-base sm:text-lg max-w-2xl mx-auto lg:mx-0 leading-relaxed">
                  Book top-rated local experts for AC repair, plumbing, electrical & maintenance. Lock your appointment with a small deposit in <strong className="text-white">LEK</strong> and pay the remaining balance in <strong className="text-emerald-400">cash upon job completion</strong>.
                </p>

                {/* Hero Feature Pills */}
                <div className="pt-2 flex flex-wrap justify-center lg:justify-start gap-4 text-xs sm:text-sm font-medium text-slate-300">
                  <div className="flex items-center space-x-2 bg-slate-800/80 backdrop-blur border border-slate-700/60 px-3.5 py-2 rounded-xl">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    <span>Upfront Deposit in LEK</span>
                  </div>
                  <div className="flex items-center space-x-2 bg-slate-800/80 backdrop-blur border border-slate-700/60 px-3.5 py-2 rounded-xl">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    <span>Fixed Price Guarantee</span>
                  </div>
                  <div className="flex items-center space-x-2 bg-slate-800/80 backdrop-blur border border-slate-700/60 px-3.5 py-2 rounded-xl">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    <span>100% Background Checked</span>
                  </div>
                </div>
              </div>

              {/* Interactive Booking Search Card */}
              <div className="lg:col-span-5">
                <div className="bg-white rounded-3xl p-6 sm:p-8 text-slate-900 shadow-2xl shadow-blue-950/50 border border-slate-100">
                  <h3 className="text-xl font-bold text-slate-900 mb-1">Book a Technician Now</h3>
                  <p className="text-slate-500 text-sm mb-6">Select your needed service and location in Tirana</p>

                  <div className="space-y-4">
                    {/* Category Selection */}
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">
                        Service Required
                      </label>
                      <select
                        value={selectedCategory}
                        onChange={(e) => setSelectedCategory(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-slate-800 font-medium focus:ring-2 focus:ring-blue-600 focus:outline-none transition-all"
                      >
                        <option value="all">All Available Services</option>
                        {SERVICE_CATEGORIES.map((cat) => (
                          <option key={cat.id} value={cat.id}>
                            {cat.name} (from {cat.basePrice.toLocaleString()} LEK)
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Area Selection */}
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">
                        Tirana Neighborhood / Area
                      </label>
                      <div className="relative">
                        <MapPin className="w-5 h-5 absolute left-3.5 top-3.5 text-slate-400 pointer-events-none" />
                        <select
                          value={selectedArea}
                          onChange={(e) => setSelectedArea(e.target.value)}
                          className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-11 pr-4 py-3 text-slate-800 font-medium focus:ring-2 focus:ring-blue-600 focus:outline-none transition-all"
                        >
                          <option value="">All Neighborhoods in Tirana</option>
                          {TIRANA_NEIGHBORHOODS.map((area) => (
                            <option key={area} value={area}>
                              {area}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>

                    {/* Price Breakdown Preview */}
                    <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 flex justify-between items-center text-xs sm:text-sm">
                      <div>
                        <span className="text-slate-500 block">Average Fix Price:</span>
                        <span className="font-black text-slate-900 text-base">2,500 - 3,500 LEK</span>
                      </div>
                      <div className="text-right">
                        <span className="text-slate-500 block">Upfront Deposit:</span>
                        <span className="font-bold text-blue-600">500 LEK</span>
                      </div>
                    </div>

                    <button
                      onClick={() => handleOpenBooking()}
                      className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 rounded-xl shadow-lg shadow-blue-600/30 transition-all flex items-center justify-center space-x-2"
                    >
                      <span>Find & Book Technician</span>
                      <ChevronRight className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </section>

        {}
        <section id="services" className="py-20 bg-slate-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-3xl mx-auto mb-14">
              <h2 className="text-xs font-bold text-blue-600 uppercase tracking-widest mb-2">Our Marketplace Services</h2>
              <h3 className="text-3xl sm:text-4xl font-extrabold text-slate-900">Popular Repair & Maintenance Trades</h3>
              <p className="text-slate-600 mt-3 text-base">Choose a category to view upfront prices in LEK and book instant service in Tirana.</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {SERVICE_CATEGORIES.map((cat) => {
                const IconComponent = cat.icon;
                return (
                  <div
                    key={cat.id}
                    onClick={() => {
                      setSelectedCategory(cat.id);
                      handleOpenBooking(null, cat);
                    }}
                    className="group bg-white rounded-2xl p-6 border border-slate-200/80 hover:border-blue-500 shadow-sm hover:shadow-xl transition-all cursor-pointer flex flex-col justify-between"
                  >
                    <div>
                      <div className="w-14 h-14 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-600 mb-6 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                        <IconComponent className="w-7 h-7" />
                      </div>
                      <h4 className="text-xl font-bold text-slate-900 mb-2">{cat.name}</h4>
                      <p className="text-slate-600 text-sm leading-relaxed mb-6">{cat.description}</p>
                    </div>

                    <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                      <div>
                        <span className="text-xs text-slate-400 block font-medium">Starting Price</span>
                        <span className="text-lg font-black text-slate-900">{cat.basePrice.toLocaleString()} LEK</span>
                      </div>
                      <div className="flex items-center text-sm font-bold text-blue-600 group-hover:translate-x-1 transition-transform">
                        <span>Book Fix</span>
                        <ChevronRight className="w-4 h-4 ml-1" />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {}
        <section id="technicians" className="py-20 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col md:flex-row md:items-end justify-between mb-12">
              <div>
                <h2 className="text-xs font-bold text-blue-600 uppercase tracking-widest mb-2">Verified Professionals</h2>
                <h3 className="text-3xl sm:text-4xl font-extrabold text-slate-900">Featured Technicians in Tirana</h3>
              </div>
              <p className="text-slate-500 text-sm mt-2 md:mt-0 max-w-md">
                All technicians are identity-verified, licensed, and rated by home and business owners across Tirana.
              </p>
            </div>

            {/* Filter Pill Selector */}
            <div className="flex flex-wrap gap-2 mb-8">
              <button
                onClick={() => setSelectedCategory("all")}
                className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-colors ${
                  selectedCategory === "all"
                    ? "bg-slate-900 text-white"
                    : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                }`}
              >
                All Techs
              </button>
              {SERVICE_CATEGORIES.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-colors ${
                    selectedCategory === cat.id
                      ? "bg-blue-600 text-white"
                      : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                  }`}
                >
                  {cat.name}
                </button>
              ))}
            </div>

            {/* Technician Cards */}
            {filteredTechnicians.length === 0 ? (
              <div className="text-center py-12 bg-slate-50 rounded-2xl border border-dashed border-slate-300">
                <p className="text-slate-500">No technicians found matching the selected filters.</p>
                <button
                  onClick={() => {
                    setSelectedCategory("all");
                    setSelectedArea("");
                  }}
                  className="mt-3 text-sm text-blue-600 font-bold hover:underline"
                >
                  Clear all filters
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {filteredTechnicians.map((tech) => (
                  <div
                    key={tech.id}
                    className="bg-slate-50 border border-slate-200/80 rounded-2xl p-5 hover:shadow-xl transition-all flex flex-col justify-between"
                  >
                    <div>
                      {/* Avatar & Badge */}
                      <div className="relative mb-4">
                        <img
                          src={tech.avatar}
                          alt={tech.name}
                          className="w-20 h-20 rounded-2xl object-cover border-2 border-white shadow-md mx-auto"
                        />
                        {tech.verified && (
                          <div className="absolute top-0 right-10 bg-emerald-500 text-white p-1 rounded-full shadow" title="Verified Tech">
                            <ShieldCheck className="w-4 h-4" />
                          </div>
                        )}
                      </div>

                      <div className="text-center">
                        <span className="inline-block bg-blue-100 text-blue-800 text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full mb-1">
                          {tech.badge}
                        </span>
                        <h4 className="text-lg font-extrabold text-slate-900">{tech.name}</h4>
                        <p className="text-xs font-medium text-slate-500 mb-2">{tech.trade}</p>

                        {/* Rating & Jobs */}
                        <div className="flex items-center justify-center space-x-1 text-sm font-bold text-slate-800 mb-3">
                          <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
                          <span>{tech.rating}</span>
                          <span className="text-slate-400 text-xs font-normal">({tech.reviewsCount} reviews • {tech.completedJobs} jobs)</span>
                        </div>
                      </div>

                      <p className="text-xs text-slate-600 line-clamp-2 text-center mb-4 italic">
                        "{tech.bio}"
                      </p>

                      {/* Area Tags */}
                      <div className="flex flex-wrap gap-1 justify-center mb-4">
                        {tech.areas.map((a) => (
                          <span key={a} className="text-[10px] bg-slate-200 text-slate-700 px-2 py-0.5 rounded-md">
                            {a}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Price & Booking Trigger */}
                    <div className="pt-4 border-t border-slate-200/80">
                      <div className="flex items-center justify-between mb-3 text-xs">
                        <div>
                          <span className="text-slate-400 block">Job Rate</span>
                          <span className="text-sm font-black text-slate-900">{tech.basePrice.toLocaleString()} LEK</span>
                        </div>
                        <div className="text-right">
                          <span className="text-slate-400 block">Online Deposit</span>
                          <span className="text-sm font-bold text-emerald-600">{tech.deposit.toLocaleString()} LEK</span>
                        </div>
                      </div>

                      <button
                        onClick={() => handleOpenBooking(tech)}
                        className="w-full bg-slate-900 hover:bg-blue-600 text-white font-bold text-xs py-2.5 rounded-xl shadow transition-colors"
                      >
                        Book {tech.name.split(" ")[0]}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>

        {}
        <section id="how-it-works" className="py-20 bg-slate-900 text-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-3xl mx-auto mb-12">
              <h2 className="text-xs font-bold text-blue-400 uppercase tracking-widest mb-2">Transparent Marketplace</h2>
              <h3 className="text-3xl sm:text-4xl font-extrabold text-white">How OneFixAL Works</h3>

              {/* Client vs Technician Switch */}
              <div className="inline-flex bg-slate-800 p-1.5 rounded-2xl border border-slate-700 mt-6">
                <button
                  onClick={() => setHowItWorksTab("client")}
                  className={`px-6 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all ${
                    howItWorksTab === "client"
                      ? "bg-blue-600 text-white shadow-md"
                      : "text-slate-400 hover:text-white"
                  }`}
                >
                  For Clients & Homeowners
                </button>
                <button
                  onClick={() => setHowItWorksTab("technician")}
                  className={`px-6 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all ${
                    howItWorksTab === "technician"
                      ? "bg-blue-600 text-white shadow-md"
                      : "text-slate-400 hover:text-white"
                  }`}
                >
                  For Certified Technicians
                </button>
              </div>
            </div>

            {howItWorksTab === "client" ? (
              <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                <div className="bg-slate-800/60 border border-slate-700/80 p-6 rounded-2xl relative">
                  <div className="w-10 h-10 bg-blue-600 text-white rounded-xl font-black flex items-center justify-center text-lg mb-4">
                    1
                  </div>
                  <h4 className="text-lg font-bold mb-2">Choose Service & Location</h4>
                  <p className="text-sm text-slate-400">Select required repairs and your Tirana neighborhood (Blloku, Laprakë, etc.).</p>
                </div>

                <div className="bg-slate-800/60 border border-slate-700/80 p-6 rounded-2xl relative">
                  <div className="w-10 h-10 bg-blue-600 text-white rounded-xl font-black flex items-center justify-center text-lg mb-4">
                    2
                  </div>
                  <h4 className="text-lg font-bold mb-2">Pay Small Deposit (LEK)</h4>
                  <p className="text-sm text-slate-400">Lock your appointment slot by paying a small upfront deposit online in LEK.</p>
                </div>

                <div className="bg-slate-800/60 border border-slate-700/80 p-6 rounded-2xl relative">
                  <div className="w-10 h-10 bg-blue-600 text-white rounded-xl font-black flex items-center justify-center text-lg mb-4">
                    3
                  </div>
                  <h4 className="text-lg font-bold mb-2">Tech Arrives & Fixes</h4>
                  <p className="text-sm text-slate-400">Your certified technician arrives on time with tools to complete the repair.</p>
                </div>

                <div className="bg-slate-800/60 border border-slate-700/80 p-6 rounded-2xl relative">
                  <div className="w-10 h-10 bg-emerald-500 text-white rounded-xl font-black flex items-center justify-center text-lg mb-4">
                    4
                  </div>
                  <h4 className="text-lg font-bold mb-2">Pay Remaining Cash</h4>
                  <p className="text-sm text-slate-400">Inspect the completed job and pay the remaining balance in cash directly in LEK.</p>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                <div className="bg-slate-800/60 border border-slate-700/80 p-6 rounded-2xl relative">
                  <div className="w-10 h-10 bg-emerald-600 text-white rounded-xl font-black flex items-center justify-center text-lg mb-4">
                    1
                  </div>
                  <h4 className="text-lg font-bold mb-2">Get Verified</h4>
                  <p className="text-sm text-slate-400">Submit your certifications and ID to join Tirana’s trusted technician network.</p>
                </div>

                <div className="bg-slate-800/60 border border-slate-700/80 p-6 rounded-2xl relative">
                  <div className="w-10 h-10 bg-emerald-600 text-white rounded-xl font-black flex items-center justify-center text-lg mb-4">
                    2
                  </div>
                  <h4 className="text-lg font-bold mb-2">Receive Job Requests</h4>
                  <p className="text-sm text-slate-400">Get instant booking notifications for nearby jobs in your chosen Tirana zones.</p>
                </div>

                <div className="bg-slate-800/60 border border-slate-700/80 p-6 rounded-2xl relative">
                  <div className="w-10 h-10 bg-emerald-600 text-white rounded-xl font-black flex items-center justify-center text-lg mb-4">
                    3
                  </div>
                  <h4 className="text-lg font-bold mb-2">Guaranteed Booking</h4>
                  <p className="text-sm text-slate-400">Clients pay an upfront deposit, ensuring serious requests and reduced no-shows.</p>
                </div>

                <div className="bg-slate-800/60 border border-slate-700/80 p-6 rounded-2xl relative">
                  <div className="w-10 h-10 bg-emerald-500 text-white rounded-xl font-black flex items-center justify-center text-lg mb-4">
                    4
                  </div>
                  <h4 className="text-lg font-bold mb-2">Collect Cash Payment</h4>
                  <p className="text-sm text-slate-400">Finish the work and receive the remaining cash payment on site in LEK.</p>
                </div>
              </div>
            )}
          </div>
        </section>

        {}
        <section id="coverage" className="py-20 bg-slate-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
              
              {/* Coverage Banner */}
              <div className="lg:col-span-5 space-y-6">
                <div className="inline-flex items-center space-x-2 bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-xs font-bold">
                  <MapPin className="w-3.5 h-3.5" />
                  <span>Coverage Area</span>
                </div>
                <h3 className="text-3xl sm:text-4xl font-extrabold text-slate-900">Serving All Neighborhoods Across Tirana</h3>
                <p className="text-slate-600 text-sm leading-relaxed">
                  Whether you are located in the vibrant center of Blloku, quiet residential streets of Laprakë, or rapid developments in Astir, OneFixAL dispatchers connect you to certified local experts in minutes.
                </p>

                <div className="grid grid-cols-2 gap-2 pt-2">
                  {TIRANA_NEIGHBORHOODS.map((zone) => (
                    <div key={zone} className="flex items-center space-x-2 text-xs font-semibold text-slate-700 bg-white p-2.5 rounded-xl border border-slate-200">
                      <Check className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                      <span>{zone}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Local Reviews */}
              <div className="lg:col-span-7 space-y-4">
                <h4 className="text-xl font-bold text-slate-900 mb-6">Recent Customer Reviews in Tirana</h4>
                {TESTIMONIALS.map((review) => (
                  <div key={review.id} className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm space-y-3">
                    <div className="flex justify-between items-start">
                      <div>
                        <h5 className="font-extrabold text-slate-900 text-base">{review.name}</h5>
                        <p className="text-xs text-slate-400 font-medium">{review.location} • {review.service}</p>
                      </div>
                      <div className="flex space-x-1">
                        {[...Array(review.rating)].map((_, i) => (
                          <Star key={i} className="w-4 h-4 text-amber-400 fill-amber-400" />
                        ))}
                      </div>
                    </div>
                    <p className="text-slate-600 text-xs sm:text-sm leading-relaxed italic">
                      "{review.text}"
                    </p>
                    <span className="text-[10px] text-slate-400 block font-medium">{review.date}</span>
                  </div>
                ))}
              </div>

            </div>
          </div>
        </section>
      </main>

      {}
      <footer className="bg-slate-950 text-slate-400 text-xs sm:text-sm border-t border-slate-900 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <Wrench className="w-6 h-6 text-blue-500" />
                <span className="text-xl font-black text-white">OneFix<span className="text-blue-500">AL</span></span>
              </div>
              <p className="text-slate-400 text-xs leading-relaxed">
                Tirana’s premier two-sided marketplace for home and business maintenance services. Upfront prices in LEK, deposit guarantee, and cash on completion.
              </p>
            </div>

            <div>
              <h5 className="font-bold text-white mb-3 uppercase tracking-wider text-xs">Popular Trades</h5>
              <ul className="space-y-2 text-slate-400">
                <li><a href="#services" className="hover:text-white">AC Repair Tirana</a></li>
                <li><a href="#services" className="hover:text-white">Emergency Plumbing</a></li>
                <li><a href="#services" className="hover:text-white">Electrical Repairs</a></li>
                <li><a href="#services" className="hover:text-white">Locksmith Services</a></li>
              </ul>
            </div>

            <div>
              <h5 className="font-bold text-white mb-3 uppercase tracking-wider text-xs">Main Areas</h5>
              <ul className="space-y-2 text-slate-400">
                <li><a href="#coverage" className="hover:text-white">Blloku & Qendër</a></li>
                <li><a href="#coverage" className="hover:text-white">Laprakë & Don Bosko</a></li>
                <li><a href="#coverage" className="hover:text-white">Astir & Yzberisht</a></li>
                <li><a href="#coverage" className="hover:text-white">Ali Demi & Fresku</a></li>
              </ul>
            </div>

            <div>
              <h5 className="font-bold text-white mb-3 uppercase tracking-wider text-xs">Contact & Support</h5>
              <div className="space-y-2 text-slate-400">
                <p className="flex items-center space-x-2">
                  <Phone className="w-4 h-4 text-blue-500" />
                  <span>+355 69 000 0000</span>
                </p>
                <p className="flex items-center space-x-2">
                  <Mail className="w-4 h-4 text-blue-500" />
                  <span>support@onefixal.al</span>
                </p>
                <p className="flex items-center space-x-2">
                  <MapPin className="w-4 h-4 text-blue-500" />
                  <span>Tirana, Albania</span>
                </p>
              </div>
            </div>
          </div>

          <div className="pt-8 border-t border-slate-900 flex flex-col sm:flex-row justify-between items-center text-slate-500 text-xs space-y-4 sm:space-y-0">
            <p>© {new Date().getFullYear()} OneFixAL. All rights reserved.</p>
            <div className="flex space-x-6">
              <a href="#" className="hover:text-slate-300">Privacy Policy</a>
              <a href="#" className="hover:text-slate-300">Terms of Service</a>
              <a href="#" className="hover:text-slate-300">Technician Policy</a>
            </div>
          </div>
        </div>
      </footer>

      {}
      {bookingModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-sm">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl relative border border-slate-100 max-h-[90vh] overflow-y-auto">
            {/* Close Button */}
            <button
              onClick={() => setBookingModalOpen(false)}
              className="absolute top-5 right-5 text-slate-400 hover:text-slate-700 p-2 rounded-full hover:bg-slate-100"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Wizard Header */}
            <div className="mb-6">
              <span className="text-xs font-bold text-blue-600 uppercase tracking-wider">
                Step {bookingStep} of 3
              </span>
              <h3 className="text-2xl font-black text-slate-900 mt-1">
                {bookingStep === 1 && "Select Service & Location"}
                {bookingStep === 2 && "Appointment Details"}
                {bookingStep === 3 && "Confirm & Pay Deposit"}
              </h3>
            </div>

            {/* STEP 1 */}
            {bookingStep === 1 && (
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-500 mb-1 uppercase">
                    Assigned Technician
                  </label>
                  <input
                    type="text"
                    disabled
                    value={bookingData.techName}
                    className="w-full bg-slate-100 text-slate-700 font-bold px-4 py-3 rounded-xl border border-slate-200"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-500 mb-1 uppercase">
                    Service Type
                  </label>
                  <select
                    value={bookingData.serviceId}
                    onChange={(e) => {
                      const cat = SERVICE_CATEGORIES.find((c) => c.id === e.target.value);
                      if (cat) {
                        setBookingData((prev) => ({
                          ...prev,
                          serviceId: cat.id,
                          serviceName: cat.name,
                          basePrice: cat.basePrice,
                          deposit: cat.deposit
                        }));
                      }
                    }}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 font-medium text-slate-800"
                  >
                    {SERVICE_CATEGORIES.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-500 mb-1 uppercase">
                    Neighborhood in Tirana
                  </label>
                  <select
                    value={bookingData.area}
                    onChange={(e) => setBookingData((prev) => ({ ...prev, area: e.target.value }))}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 font-medium text-slate-800"
                  >
                    {TIRANA_NEIGHBORHOODS.map((area) => (
                      <option key={area} value={area}>
                        {area}
                      </option>
                    ))}
                  </select>
                </div>

                <button
                  onClick={() => setBookingStep(2)}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3.5 rounded-xl shadow mt-4 transition-all"
                >
                  Continue to Schedule
                </button>
              </div>
            )}

            {/* STEP 2 */}
            {bookingStep === 2 && (
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-500 mb-1 uppercase">
                    Street Address / Building
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Rruga Abdyl Frashëri, Bldg 12, Ap 4"
                    value={bookingData.address}
                    onChange={(e) => setBookingData((prev) => ({ ...prev, address: e.target.value }))}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-slate-800 font-medium focus:ring-2 focus:ring-blue-600 focus:outline-none"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-500 mb-1 uppercase">
                      Preferred Date
                    </label>
                    <input
                      type="date"
                      value={bookingData.date}
                      onChange={(e) => setBookingData((prev) => ({ ...prev, date: e.target.value }))}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-3 text-slate-800 font-medium text-xs sm:text-sm"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-500 mb-1 uppercase">
                      Time Slot
                    </label>
                    <select
                      value={bookingData.time}
                      onChange={(e) => setBookingData((prev) => ({ ...prev, time: e.target.value }))}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-2 py-3 text-slate-800 font-medium text-xs sm:text-sm"
                    >
                      <option value="Morning (09:00 - 12:00)">Morning (09:00 - 12:00)</option>
                      <option value="Afternoon (12:00 - 16:00)">Afternoon (12:00 - 16:00)</option>
                      <option value="Evening (16:00 - 19:00)">Evening (16:00 - 19:00)</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-500 mb-1 uppercase">
                    Describe Issue (Optional)
                  </label>
                  <textarea
                    rows={3}
                    placeholder="Briefly describe what needs fixing..."
                    value={bookingData.notes}
                    onChange={(e) => setBookingData((prev) => ({ ...prev, notes: e.target.value }))}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-slate-800 font-medium text-sm"
                  />
                </div>

                <div className="flex space-x-3 pt-2">
                  <button
                    onClick={() => setBookingStep(1)}
                    className="w-1/3 border border-slate-200 text-slate-600 font-bold py-3.5 rounded-xl hover:bg-slate-50"
                  >
                    Back
                  </button>
                  <button
                    onClick={() => setBookingStep(3)}
                    className="w-2/3 bg-blue-600 hover:bg-blue-700 text-white font-bold py-3.5 rounded-xl shadow"
                  >
                    Review Pricing
                  </button>
                </div>
              </div>
            )}

            {/* STEP 3 */}
            {bookingStep === 3 && (
              <div className="space-y-6">
                <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-slate-500">Service:</span>
                    <span className="font-bold text-slate-900">{bookingData.serviceName}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Technician:</span>
                    <span className="font-bold text-slate-900">{bookingData.techName}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Area:</span>
                    <span className="font-bold text-slate-900">{bookingData.area}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Slot:</span>
                    <span className="font-bold text-slate-900">{bookingData.date || "Today"} ({bookingData.time})</span>
                  </div>
                </div>

                {/* Monetary Breakdown in LEK */}
                <div className="bg-blue-50 border border-blue-200 p-5 rounded-2xl space-y-3">
                  <h4 className="font-bold text-blue-900 text-sm border-b border-blue-200/60 pb-2">
                    Payment Breakdown (LEK)
                  </h4>
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-600">Fixed Repair Cost:</span>
                    <span className="font-extrabold text-slate-900">{bookingData.basePrice.toLocaleString()} LEK</span>
                  </div>
                  <div className="flex justify-between text-sm font-bold text-emerald-700">
                    <span>Upfront Online Deposit (To Lock):</span>
                    <span>{bookingData.deposit.toLocaleString()} LEK</span>
                  </div>
                  <div className="flex justify-between text-sm font-bold text-slate-700 pt-2 border-t border-blue-200/60">
                    <span>Remaining Balance in Cash (On Site):</span>
                    <span>{(bookingData.basePrice - bookingData.deposit).toLocaleString()} LEK</span>
                  </div>
                </div>

                <div className="flex space-x-3">
                  <button
                    onClick={() => setBookingStep(2)}
                    className="w-1/3 border border-slate-200 text-slate-600 font-bold py-3.5 rounded-xl hover:bg-slate-50"
                  >
                    Back
                  </button>
                  <button
                    onClick={() => {
                      alert(`Booking confirmed! Deposit of ${bookingData.deposit} LEK simulated. Check your SMS/Email.`);
                      setBookingModalOpen(false);
                    }}
                    className="w-2/3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3.5 rounded-xl shadow-lg shadow-emerald-600/30 transition-all flex items-center justify-center space-x-2"
                  >
                    <Lock className="w-4 h-4" />
                    <span>Confirm & Pay {bookingData.deposit} LEK</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

    </div>
  );
}
