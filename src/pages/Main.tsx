import React, { useEffect, useState } from "react";

export default function MainPage() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // Check login state mock/local storage safely
  useEffect(() => {
    try {
      const userData = localStorage.getItem("user");
      if (userData) {
        setIsLoggedIn(true);
      }
    } catch (e) {
      console.log("LocalStorage check skipped");
    }
  }, []);

  const handleLogout = () => {
    try {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      localStorage.removeItem("role");
    } catch (e) {}
    setIsLoggedIn(false);
    setMenuOpen(false);
  };

  const services = [
    { icon: "⚡", name: "Electrician", desc: "Wiring, panels & outlets" },
    { icon: "🔧", name: "Plumber", desc: "Pipes, leaks & drains" },
    { icon: "❄️", name: "AC Tech", desc: "Install & maintenance" },
    { icon: "🪵", name: "Carpenter", desc: "Furniture & woodwork" },
    { icon: "🎨", name: "Painter", desc: "Interior & exterior" },
    { icon: "📱", name: "Electronics", desc: "Appliances & TVs" },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-white text-gray-900 font-sans antialiased overflow-x-hidden selection:bg-blue-500 selection:text-white">
      {}
      {/* ── STICKY TOP NAVBAR ────────────────────────────────────────────── */}
      <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-gray-100 shadow-xs">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          
          {/* Logo */}
          <a href="#" className="flex items-center gap-1.5 focus:outline-none">
            <span className="text-2xl font-black text-blue-600 tracking-tight">OneFix<span className="text-gray-900">AL</span></span>
          </a>

          {/* Desktop Links (Hidden on iPhone XS / Mobile) */}
          <nav className="hidden md:flex items-center gap-7">
            <a href="#services" className="text-sm font-medium text-gray-600 hover:text-blue-600 transition-colors">
              Services
            </a>
            <a href="#how-it-works" className="text-sm font-medium text-gray-600 hover:text-blue-600 transition-colors">
              How it Works
            </a>
            <a href="#technicians" className="text-sm font-medium text-gray-600 hover:text-blue-600 transition-colors">
              Find a Technician
            </a>
            {isLoggedIn ? (
              <div className="flex items-center gap-4">
                <a href="#profile" className="text-sm font-semibold text-gray-700 hover:text-blue-600">
                  My Profile
                </a>
                <button
                  onClick={handleLogout}
                  className="text-xs font-semibold text-red-600 hover:bg-red-50 px-3 py-2 rounded-lg transition"
                >
                  Logout
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <a href="#login" className="text-sm font-semibold text-gray-700 hover:text-blue-600 px-3 py-2">
                  Sign in
                </a>
                <a
                  href="#signup"
                  className="text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-xl transition shadow-sm active:scale-95"
                >
                  Get started
                </a>
              </div>
            )}
          </nav>

          {/* Mobile 3-Bar Hamburger Button (Visible on iPhone XS and mobile) */}
          <button
            type="button"
            className="md:hidden flex flex-col justify-center items-center w-10 h-10 rounded-xl bg-gray-50 active:bg-gray-200 border border-gray-200 text-gray-800 focus:outline-none transition-colors"
            onClick={() => setMenuOpen((prev) => !prev)}
            aria-label="Toggle navigation menu"
            aria-expanded={menuOpen}
          >
            {/* 3 Horizontal Bars Icon */}
            <div className="w-5 flex flex-col items-center justify-between h-3.5 relative">
              <span
                className={`block w-5 h-0.5 bg-gray-800 rounded-full transition-all duration-300 ease-in-out ${
                  menuOpen ? "rotate-45 translate-y-[6px]" : ""
                }`}
              />
              <span
                className={`block w-5 h-0.5 bg-gray-800 rounded-full transition-all duration-200 ease-in-out ${
                  menuOpen ? "opacity-0 scale-x-0" : "opacity-100"
                }`}
              />
              <span
                className={`block w-5 h-0.5 bg-gray-800 rounded-full transition-all duration-300 ease-in-out ${
                  menuOpen ? "-rotate-45 -translate-y-[6px]" : ""
                }`}
              />
            </div>
          </button>
        </div>

        {/* Mobile Animated Dropdown Navigation */}
        {menuOpen && (
          <div className="md:hidden bg-white border-b border-gray-200 px-4 pt-3 pb-6 shadow-xl animate-fadeIn">
            <div className="flex flex-col gap-1">
              <a
                href="#technicians"
                onClick={() => setMenuOpen(false)}
                className="flex items-center justify-between text-gray-800 font-semibold text-base py-3 px-3.5 rounded-xl hover:bg-blue-50 hover:text-blue-600 active:bg-blue-100 transition"
              >
                <span>Find a Technician</span>
                <span className="text-gray-400">→</span>
              </a>
              <a
                href="#services"
                onClick={() => setMenuOpen(false)}
                className="flex items-center justify-between text-gray-700 font-medium text-base py-3 px-3.5 rounded-xl hover:bg-blue-50 hover:text-blue-600 active:bg-blue-100 transition"
              >
                <span>Services Category</span>
                <span className="text-gray-400">→</span>
              </a>
              <a
                href="#how-it-works"
                onClick={() => setMenuOpen(false)}
                className="flex items-center justify-between text-gray-700 font-medium text-base py-3 px-3.5 rounded-xl hover:bg-blue-50 hover:text-blue-600 active:bg-blue-100 transition"
              >
                <span>How it Works</span>
                <span className="text-gray-400">→</span>
              </a>

              <hr className="my-2 border-gray-100" />

              {isLoggedIn ? (
                <>
                  <a
                    href="#profile"
                    onClick={() => setMenuOpen(false)}
                    className="flex items-center justify-between text-gray-800 font-semibold text-base py-3 px-3.5 rounded-xl hover:bg-blue-50 active:bg-blue-100 transition"
                  >
                    <span>My Account Profile</span>
                    <span className="text-blue-600 font-bold">👤</span>
                  </a>
                  <button
                    onClick={handleLogout}
                    className="w-full text-left text-red-600 font-semibold text-base py-3 px-3.5 rounded-xl hover:bg-red-50 active:bg-red-100 transition"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <div className="flex flex-col gap-2 pt-1">
                  <a
                    href="#login"
                    onClick={() => setMenuOpen(false)}
                    className="w-full text-center text-gray-800 font-semibold py-3 rounded-xl border border-gray-200 active:bg-gray-100 transition text-sm"
                  >
                    Sign In
                  </a>
                  <a
                    href="#signup"
                    onClick={() => setMenuOpen(false)}
                    className="w-full text-center text-white bg-blue-600 font-semibold py-3 rounded-xl shadow-md active:bg-blue-700 transition text-sm"
                  >
                    Get Started Free
                  </a>
                </div>
              )}
            </div>
          </div>
        )}
      </header>

      {}
      {/* ── HERO SECTION ──────────────────────────────────────────────── */}
      <section className="bg-gradient-to-b from-blue-600 via-blue-700 to-blue-800 text-white px-4 sm:px-6 pt-8 pb-12 sm:py-20 relative overflow-hidden">
        {/* Subtle decorative mesh background effect */}
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:16px_16px] pointer-events-none" />

        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-8 items-center relative z-10">
          
          {/* Hero Main Content */}
          <div className="text-left">
            <div className="inline-flex items-center gap-2 bg-blue-500/30 backdrop-blur-md border border-blue-300/30 text-blue-100 text-xs font-semibold px-3 py-1.5 rounded-full mb-4">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse shrink-0" />
              <span>Available in Tirana, Albania</span>
            </div>

            <h1 className="text-3xl xs:text-4xl sm:text-5xl font-black tracking-tight leading-[1.15] mb-3">
              Find a trusted <br className="hidden xs:block" />
              <span className="text-blue-200">technician</span>, fast.
            </h1>

            <p className="text-blue-100 text-sm sm:text-base leading-relaxed mb-6 max-w-md">
              Connect with verified local experts in Tirana. Book electricians, plumbers, & repairs in seconds with upfront pricing.
            </p>

            {/* Mobile Call to Action Buttons */}
            <div className="flex flex-col xs:flex-row gap-2.5">
              <a
                href="#technicians"
                className="w-full xs:w-auto bg-white text-blue-700 font-bold text-center px-6 py-3.5 rounded-xl shadow-lg active:scale-98 hover:bg-blue-50 transition text-sm flex items-center justify-center gap-2"
              >
                <span>Find a Technician</span>
                <span>→</span>
              </a>
              <a
                href="#signup"
                className="w-full xs:w-auto bg-blue-500/30 border border-blue-300/30 text-white font-semibold text-center px-6 py-3.5 rounded-xl active:bg-blue-500/50 hover:bg-blue-500/40 transition text-sm"
              >
                Join as Professional
              </a>
            </div>
          </div>

          {/* iPhone XS Responsive Mockup Card */}
          <div className="mt-2 md:mt-0 flex justify-center">
            <div className="w-full max-w-[345px] xs:max-w-sm bg-white rounded-2xl shadow-2xl p-4 text-gray-800 border border-blue-100">
              <div className="flex items-center justify-between pb-3 mb-3 border-b border-gray-100">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-lg shrink-0">
                    ⚡
                  </div>
                  <div className="truncate">
                    <p className="font-bold text-sm text-gray-900 truncate">Ardit Krasniqi</p>
                    <p className="text-[11px] text-gray-500 truncate">Licensed Electrician · 8y exp</p>
                  </div>
                </div>
                <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded-full shrink-0">
                  Verified
                </span>
              </div>

              {/* Service Details Snippet */}
              <div className="bg-gray-50 rounded-xl p-3 mb-3 border border-gray-100">
                <p className="text-[11px] font-semibold text-gray-500 uppercase tracking-wider mb-1">Issue Overview</p>
                <p className="text-xs text-gray-700 italic">"Short circuit repair & circuit breaker panel check"</p>
              </div>

              {/* Pricing breakdown */}
              <div className="space-y-1.5 text-xs mb-3.5">
                <div className="flex justify-between text-gray-600">
                  <span>Job Estimate</span>
                  <span className="font-semibold text-gray-800">4,500 LEK</span>
                </div>
                <div className="flex justify-between text-blue-600 font-medium">
                  <span>Deposit (10%)</span>
                  <span>450 LEK</span>
                </div>
              </div>

              <a
                href="#book"
                className="block w-full bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-bold text-center py-2.5 rounded-xl shadow-sm transition text-xs"
              >
                Book Appointment
              </a>
            </div>
          </div>

        </div>
      </section>

      {}
      {/* ── STATS BAR ─────────────────────────────────────────── */}
      <section className="bg-blue-50/80 border-y border-blue-100 py-4 px-4">
        <div className="max-w-6xl mx-auto grid grid-cols-3 gap-2 text-center">
          <div className="p-1">
            <p className="text-lg xs:text-xl sm:text-2xl font-black text-blue-600">100+</p>
            <p className="text-[10px] xs:text-xs text-gray-600 font-medium">Verified Techs</p>
          </div>
          <div className="p-1 border-x border-blue-200/60">
            <p className="text-lg xs:text-xl sm:text-2xl font-black text-blue-600">500+</p>
            <p className="text-[10px] xs:text-xs text-gray-600 font-medium">Jobs Fixed</p>
          </div>
          <div className="p-1">
            <p className="text-lg xs:text-xl sm:text-2xl font-black text-blue-600">4.9★</p>
            <p className="text-[10px] xs:text-xs text-gray-600 font-medium">Client Rating</p>
          </div>
        </div>
      </section>

      {}
      {/* ── SERVICES GRID ────────────────────────────────────── */}
      <section id="services" className="py-10 sm:py-16 px-4 sm:px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-8">
            <h2 className="text-2xl sm:text-3xl font-black text-gray-900 tracking-tight">Our Services</h2>
            <p className="text-xs sm:text-sm text-gray-500 mt-1">Select a category to find specialized professionals</p>
          </div>

          {/* 2-column grid on mobile / iPhone XS */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
            {services.map((s) => (
              <a
                key={s.name}
                href="#technicians"
                className="bg-gray-50 hover:bg-blue-50 border border-gray-200/80 hover:border-blue-300 rounded-2xl p-3.5 flex flex-col justify-between transition-all duration-200 active:scale-95 group"
              >
                <div>
                  <div className="w-10 h-10 rounded-xl bg-white shadow-xs flex items-center justify-center text-xl mb-2.5 group-hover:scale-110 transition-transform">
                    {s.icon}
                  </div>
                  <h3 className="font-bold text-gray-900 text-xs sm:text-sm group-hover:text-blue-600 transition">
                    {s.name}
                  </h3>
                  <p className="text-[11px] text-gray-500 mt-1 leading-snug line-clamp-2">
                    {s.desc}
                  </p>
                </div>
              </a>
            ))}
          </div>
        </div>
      </section>

      {}
      {/* ── HOW IT WORKS ──────────────────────────────────────── */}
      <section id="how-it-works" className="py-10 sm:py-16 bg-gray-50/70 border-y border-gray-100 px-4 sm:px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-8">
            <span className="text-[11px] font-bold tracking-wider text-blue-600 uppercase">Simple Process</span>
            <h2 className="text-2xl sm:text-3xl font-black text-gray-900 mt-1">How OneFixAL Works</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
            {[
              {
                step: "01",
                title: "Describe your issue",
                desc: "Choose the service you need and share details about your repair.",
              },
              {
                step: "02",
                title: "Compare & Select",
                desc: "Review technician profiles, customer ratings, and transparent quotes.",
              },
              {
                step: "03",
                title: "Get it Fixed",
                desc: "Your chosen pro arrives on time. Inspect the result and pay safely.",
              },
            ].map((step) => (
              <div key={step.step} className="bg-white p-4 sm:p-6 rounded-2xl border border-gray-200/80 shadow-xs flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-blue-600 text-white font-black text-sm flex items-center justify-center shrink-0">
                  {step.step}
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 text-sm sm:text-base mb-1">{step.title}</h3>
                  <p className="text-xs sm:text-sm text-gray-500 leading-relaxed">{step.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {}
      {/* ── BOTTOM CTA ────────────────────────────────────────── */}
      <section className="bg-blue-600 text-white py-10 px-4 text-center">
        <div className="max-w-xl mx-auto">
          <h2 className="text-2xl font-black mb-2">Need a Repair Today?</h2>
          <p className="text-blue-100 text-xs sm:text-sm mb-6">
            Book certified Albanian technicians with zero hassle.
          </p>
          <a
            href="#technicians"
            className="inline-block w-full xs:w-auto bg-white text-blue-700 font-bold px-8 py-3.5 rounded-xl shadow-lg active:bg-blue-50 transition text-sm"
          >
            Find a Professional Now
          </a>
        </div>
      </section>

      {/* ── FOOTER ────────────────────────────────────────────── */}
      <footer className="bg-gray-900 text-gray-400 py-8 px-4 text-xs">
        <div className="max-w-6xl mx-auto flex flex-col items-center gap-4 text-center">
          <span className="text-white font-black text-xl tracking-tight">OneFix<span className="text-blue-500">AL</span></span>
          <p className="text-gray-500 max-w-xs">Connecting households and businesses in Tirana with verified technicians.</p>
          <div className="flex flex-wrap justify-center gap-4 text-gray-300 font-medium">
            <a href="#services" className="hover:text-white">Services</a>
            <a href="#technicians" className="hover:text-white">Technicians</a>
            <a href="#login" className="hover:text-white">Sign In</a>
            <a href="#signup" className="hover:text-white">Register</a>
          </div>
          <p className="text-gray-600 text-[11px] pt-2">© {new Date().getFullYear()} OneFixAL. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
