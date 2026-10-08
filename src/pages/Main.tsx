import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

export default function MainPage() {
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const isLoggedIn = !!localStorage.getItem("user");

  useEffect(() => {
    const userData = localStorage.getItem("user");

    if (userData) {
      try {
        const parsed = JSON.parse(userData);

        if (parsed.role) {
          navigate("/home");
        }
      } catch {
        // Ignore invalid auth data and keep the public landing page visible.
      }
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem("role");
    window.location.reload();
  };

  const closeMenu = () => setMenuOpen(false);

  const services = [
    { icon: "⚡", name: "Electrician", desc: "Wiring, panels, outlets" },
    { icon: "🔧", name: "Plumber", desc: "Pipes, leaks, installations" },
    { icon: "❄️", name: "AC Technician", desc: "Install, repair, service" },
    { icon: "🪵", name: "Carpenter", desc: "Furniture, doors, floors" },
    { icon: "🎨", name: "Painter", desc: "Interior & exterior" },
    { icon: "📱", name: "Electronics", desc: "Phones, TVs, appliances" },
  ];

  const steps = [
    {
      icon: "🔍",
      title: "Describe your problem",
      desc: "Tell us what needs fixing. Browse verified technicians by specialty and choose who fits.",
    },
    {
      icon: "💬",
      title: "Get a price",
      desc: "The technician reviews your request and sets a fair price. Accept or decline — no pressure.",
    },
    {
      icon: "🔧",
      title: "Job done",
      desc: "Your technician arrives at the agreed time. Pay the deposit upfront, the rest when done.",
    },
  ];

  const trustPoints = [
    {
      icon: "✅",
      title: "Verified & certified",
      desc: "Every technician is manually verified with certificates and qualifications checked.",
    },
    {
      icon: "💬",
      title: "You see the price first",
      desc: "The technician sets a fair price after reading your problem. Accept or decline — no hidden fees.",
    },
    {
      icon: "🔒",
      title: "Transparent pricing",
      desc: "Small deposit upfront to confirm the booking. Pay the rest in cash when the job is done.",
    },
    {
      icon: "⚡",
      title: "Fast booking",
      desc: "Browse availability and book in under 2 minutes. No phone calls needed.",
    },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-white text-gray-900 overflow-x-hidden">
      {/* Sticky navbar */}
      <nav className="sticky top-0 z-50 bg-white border-b border-gray-100 py-4 px-4 sm:px-6">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <Link
            to="/"
            onClick={closeMenu}
            className="text-2xl font-black tracking-tight text-blue-600 shrink-0"
          >
            OneFixAL
          </Link>

          {/* Desktop navigation */}
          <div className="hidden md:flex items-center gap-6">
            <Link
              to="/techprofiles"
              className="text-gray-600 hover:text-blue-600 text-sm font-medium transition"
            >
              Find a Technician
            </Link>

            {isLoggedIn ? (
              <>
                <Link
                  to="/myProfile"
                  className="text-gray-600 hover:text-blue-600 text-sm font-medium transition"
                >
                  My Profile
                </Link>
                <button
                  type="button"
                  onClick={handleLogout}
                  className="text-red-500 hover:text-red-600 text-sm font-medium transition px-2 py-2 rounded-lg"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="text-gray-600 hover:text-blue-600 text-sm font-medium transition"
                >
                  Sign in
                </Link>
                <Link
                  to="/signup"
                  className="bg-blue-600 text-white text-sm font-semibold px-4 py-2 rounded-lg hover:bg-blue-700 transition"
                >
                  Get started
                </Link>
              </>
            )}
          </div>

          {/* Mobile hamburger */}
          <button
            type="button"
            className="flex h-10 w-10 items-center justify-center rounded-lg text-gray-800 transition hover:bg-gray-50 md:hidden"
            onClick={() => setMenuOpen((open) => !open)}
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            aria-expanded={menuOpen}
            aria-controls="mobile-menu"
          >
            <span className="relative block h-5 w-5">
              <span
                className={`absolute left-0 top-1 block h-0.5 w-5 bg-current transition-all duration-200 ${
                  menuOpen ? "translate-y-2 rotate-45" : ""
                }`}
              />
              <span
                className={`absolute left-0 top-2.5 block h-0.5 w-5 bg-current transition-all duration-200 ${
                  menuOpen ? "opacity-0" : ""
                }`}
              />
              <span
                className={`absolute left-0 top-4 block h-0.5 w-5 bg-current transition-all duration-200 ${
                  menuOpen ? "-translate-y-2 -rotate-45" : ""
                }`}
              />
            </span>
          </button>
        </div>

        {/* Mobile menu — three primary actions */}
        {menuOpen && (
          <div
            id="mobile-menu"
            className="mt-4 border-t border-gray-100 pt-4 md:hidden"
          >
            <div className="max-w-6xl mx-auto flex flex-col gap-3">
              <Link
                to="/techprofiles"
                onClick={closeMenu}
                className="rounded-xl px-4 py-3 text-sm font-medium text-gray-700 transition hover:bg-gray-50"
              >
                Find a Technician
              </Link>

              {isLoggedIn ? (
                <>
                  <Link
                    to="/myProfile"
                    onClick={closeMenu}
                    className="rounded-xl px-4 py-3 text-sm font-medium text-gray-700 transition hover:bg-gray-50"
                  >
                    My Profile
                  </Link>
                  <button
                    type="button"
                    onClick={() => {
                      closeMenu();
                      handleLogout();
                    }}
                    className="w-full rounded-xl px-4 py-3 text-left text-sm font-medium text-red-500 transition hover:bg-red-50"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <Link
                    to="/login"
                    onClick={closeMenu}
                    className="rounded-xl px-4 py-3 text-sm font-medium text-gray-700 transition hover:bg-gray-50"
                  >
                    Sign in
                  </Link>
                  <Link
                    to="/signup"
                    onClick={closeMenu}
                    className="rounded-xl bg-blue-600 px-4 py-3 text-center text-sm font-semibold text-white transition hover:bg-blue-700"
                  >
                    Get started
                  </Link>
                </>
              )}
            </div>
          </div>
        )}
      </nav>

      <main className="flex-1">
        {/* Hero */}
        <section className="bg-gradient-to-br from-blue-600 to-blue-800 text-white px-4 sm:px-6 py-14 md:py-28">
          <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-12 items-center">
            <div className="min-w-0">
              <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-white bg-opacity-20 border border-blue-400 px-3 py-1.5 text-xs font-semibold text-blue-100">
                <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-green-400" />
                <span>Available in Tirana, Albania</span>
              </div>

              <h1 className="text-3xl sm:text-4xl md:text-5xl font-black leading-tight">
                Find a trusted technician, in minutes.
              </h1>

              <p className="mt-5 max-w-xl text-sm sm:text-base leading-relaxed text-blue-100">
                OneFixAL connects you with verified, qualified technicians across Tirana.
                Book, track, and pay — all in one place.
              </p>

              {/* Mobile trust pills */}
              <div className="flex flex-wrap gap-2 mb-6 mt-5 md:hidden">
                <span className="inline-flex items-center gap-1.5 bg-blue-500 bg-opacity-40 border border-blue-400 text-blue-100 text-xs font-semibold px-3 py-1.5 rounded-full">
                  ✅ Verified
                </span>
                <span className="inline-flex items-center gap-1.5 bg-blue-500 bg-opacity-40 border border-blue-400 text-blue-100 text-xs font-semibold px-3 py-1.5 rounded-full">
                  ⚡ Fast Booking
                </span>
                <span className="inline-flex items-center gap-1.5 bg-blue-500 bg-opacity-40 border border-blue-400 text-blue-100 text-xs font-semibold px-3 py-1.5 rounded-full">
                  💬 Fair Pricing
                </span>
              </div>

              <div className="mt-6 flex flex-col sm:flex-row gap-3">
                <Link
                  to="/techprofiles"
                  className="w-full sm:w-auto text-center bg-white text-blue-700 font-bold px-6 py-3 rounded-xl hover:bg-blue-50 transition shadow-sm"
                >
                  Find a Technician
                </Link>
                <Link
                  to="/signup"
                  className="w-full sm:w-auto text-center bg-blue-500 bg-opacity-40 text-white font-semibold px-6 py-3 rounded-xl hover:bg-blue-500 hover:bg-opacity-60 border border-blue-400 transition"
                >
                  Join as Technician
                </Link>
              </div>
            </div>

            {/* Booking preview — desktop/tablet only */}
            <div className="hidden md:flex justify-center md:justify-end">
              <div className="w-full max-w-sm rounded-2xl bg-white p-5 text-gray-800 shadow-2xl">
                <div className="mb-4 flex items-center gap-3">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-blue-100 text-xl">
                    ⚡
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-semibold truncate">Ardit Krasniqi</p>
                    <p className="text-xs text-gray-500">Electrician</p>
                    <p className="text-xs text-gray-400">8 years of experience</p>
                  </div>
                  <span className="shrink-0 rounded-full bg-green-100 px-2 py-0.5 text-xs font-semibold text-green-700">
                    Available
                  </span>
                </div>

                <div className="mb-4 rounded-xl bg-gray-50 p-3 text-xs text-gray-600">
                  <p className="mb-1 font-semibold text-gray-700">Problem</p>
                  <p className="italic">
                    Electrical panel making strange sounds and tripping breakers.
                  </p>
                </div>

                <div className="mb-4 space-y-2 text-xs">
                  <div className="flex justify-between gap-4 text-gray-500">
                    <span>Job Price</span>
                    <span className="font-medium text-gray-700">4,500 LEK</span>
                  </div>
                  <div className="flex justify-between gap-4 text-blue-600">
                    <span>Deposit (10%)</span>
                    <span className="font-medium">450 LEK</span>
                  </div>
                  <div className="flex justify-between gap-4 border-t border-gray-100 pt-2 font-semibold text-gray-800">
                    <span>Total</span>
                    <span>4,500 LEK</span>
                  </div>
                </div>

                <div className="rounded-xl bg-green-500 py-2 text-center text-xs font-bold text-white">
                  ✅ Booking Confirmed
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Stats */}
        <section className="border-y border-blue-100 bg-blue-50 px-4 sm:px-6 py-5">
          <div className="max-w-6xl mx-auto grid grid-cols-3 divide-x divide-blue-200 text-center">
            {[
              { value: "100+", label: "Verified Technicians" },
              { value: "500+", label: "Jobs Completed" },
              { value: "4.8★", label: "Average Rating" },
            ].map((stat) => (
              <div key={stat.label} className="min-w-0 px-2 py-1">
                <p className="text-xl sm:text-2xl font-black text-blue-600">
                  {stat.value}
                </p>
                <p className="mt-0.5 text-xs leading-tight text-gray-500">
                  {stat.label}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* How it works */}
        <section className="py-14 md:py-20 px-4 sm:px-6 bg-white">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-2xl sm:text-3xl font-black text-gray-900 mb-2 text-center">
              How it works
            </h2>
            <p className="text-gray-500 text-center mb-12 text-sm">
              Book a technician in three simple steps.
            </p>

            {/* More than 2 components: horizontal swipe on mobile, 3 columns on desktop */}
            <div className="flex gap-4 overflow-x-auto scroll-smooth pb-2 snap-x snap-mandatory md:grid md:grid-cols-3 md:gap-10 md:overflow-visible md:pb-0 md:snap-none">
              {steps.map((step) => (
                <div
                  key={step.title}
                  className="w-[82vw] max-w-[320px] shrink-0 snap-start md:w-auto md:max-w-none md:shrink"
                >
                  <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-blue-600 text-xl text-white shadow-sm">
                    {step.icon}
                  </div>
                  <h3 className="mb-2 font-bold text-gray-800">{step.title}</h3>
                  <p className="text-sm leading-relaxed text-gray-500">
                    {step.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Services */}
        <section className="bg-gray-50 py-14 md:py-20 px-4 sm:px-6">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-2xl sm:text-3xl font-black text-gray-900 mb-2 text-center">
              What can we fix?
            </h2>
            <p className="text-gray-500 text-center mb-12 text-sm">
              Qualified technicians for every home and business need.
            </p>

            {/* More than 2 components: horizontal swipe on mobile, 3 columns on desktop */}
            <div className="flex gap-3 overflow-x-auto scroll-smooth pb-2 snap-x snap-mandatory md:grid md:grid-cols-3 md:gap-4 md:overflow-visible md:pb-0 md:snap-none">
              {services.map((service) => (
                <Link
                  key={service.name}
                  to="/techprofiles"
                  className="group w-[78vw] max-w-[300px] shrink-0 snap-start bg-white border border-gray-200 rounded-xl shadow-sm p-4 md:w-auto md:max-w-none md:shrink md:p-5 hover:border-blue-300 hover:shadow-sm transition"
                >
                  <span className="mb-2 block text-2xl md:text-3xl">
                    {service.icon}
                  </span>
                  <p className="text-sm font-semibold text-gray-800 transition group-hover:text-blue-600">
                    {service.name}
                  </p>
                  <p className="mt-0.5 text-xs leading-tight text-gray-400">
                    {service.desc}
                  </p>
                </Link>
              ))}
            </div>

            <div className="mt-8 text-center">
              <Link
                to="/techprofiles"
                className="w-full sm:w-auto inline-flex items-center justify-center bg-blue-600 text-white font-semibold px-6 py-3 rounded-xl hover:bg-blue-700 transition"
              >
                Browse all technicians
              </Link>
            </div>
          </div>
        </section>

        {/* Why + testimonials */}
        <section className="py-14 md:py-20 px-4 sm:px-6 bg-white">
          <div className="max-w-6xl mx-auto">
            <div className="grid md:grid-cols-2 gap-16 items-start">
              <div className="min-w-0">
                <h2 className="text-2xl sm:text-3xl font-black text-gray-900 mb-6">
                  Why OneFixAL?
                </h2>

                <div className="flex flex-col gap-5">
                  {trustPoints.map((point) => (
                    <div key={point.title} className="flex gap-3">
                      <span className="mt-0.5 shrink-0 text-xl">{point.icon}</span>
                      <div className="min-w-0">
                        <p className="text-sm font-semibold text-gray-800">
                          {point.title}
                        </p>
                        <p className="mt-0.5 text-sm leading-relaxed text-gray-500">
                          {point.desc}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex min-w-0 flex-col gap-4">
                {[
                  {
                    name: "Blerina M.",
                    role: "Client, Tirana",
                    text: "Found an electrician in 10 minutes. He came the next morning and fixed everything. Highly recommend!",
                    rating: 5,
                  },
                  {
                    name: "Erjon K.",
                    role: "Plumber, OneFixAL Technician",
                    text: "As a technician, I get new clients every week. The booking system is simple and I'm always paid fairly.",
                    rating: 5,
                  },
                ].map((testimonial) => (
                  <div
                    key={testimonial.name}
                    className="bg-white border border-gray-200 rounded-xl shadow-sm p-5"
                  >
                    <div className="mb-2 flex gap-0.5">
                      {Array.from({ length: testimonial.rating }).map((_, i) => (
                        <span key={i} className="text-sm text-amber-400">
                          ★
                        </span>
                      ))}
                    </div>
                    <p className="mb-3 text-sm leading-relaxed text-gray-700 italic">
                      "{testimonial.text}"
                    </p>
                    <p className="text-sm font-semibold text-gray-800">
                      {testimonial.name}
                    </p>
                    <p className="text-xs text-gray-400">{testimonial.role}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="bg-blue-600 text-white py-14 md:py-20 px-4 sm:px-6">
          <div className="max-w-6xl mx-auto text-center">
            <h2 className="text-2xl sm:text-3xl font-black">
              Ready to fix something?
            </h2>
            <p className="mx-auto mt-3 max-w-xl text-sm leading-relaxed text-blue-100 sm:text-base">
              Join hundreds of people in Tirana who use OneFixAL to find trusted help fast.
            </p>

            <div className="mt-7 flex flex-col sm:flex-row justify-center gap-3">
              <Link
                to="/signup"
                className="w-full sm:w-auto text-center bg-white text-blue-700 font-bold px-6 py-3 rounded-xl hover:bg-blue-50 transition shadow-sm"
              >
                Create free account
              </Link>
              <Link
                to="/techprofiles"
                className="w-full sm:w-auto text-center bg-blue-500 bg-opacity-40 text-white font-semibold px-6 py-3 rounded-xl hover:bg-blue-500 hover:bg-opacity-60 border border-blue-400 transition"
              >
                Browse technicians
              </Link>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-400 py-10 px-4 sm:px-6">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="text-center md:text-left">
            <span className="block text-xl font-black text-white">OneFixAL</span>
            <p className="mt-1 text-xs text-gray-500">
              Connecting Tirana with trusted technicians.
            </p>
          </div>

          <div className="flex flex-wrap justify-center gap-4 text-sm">
            <Link to="/techprofiles" className="hover:text-white transition">
              Find a Technician
            </Link>
            <Link to="/signup" className="hover:text-white transition">
              Join as Technician
            </Link>
            <Link to="/login" className="hover:text-white transition">
              Sign in
            </Link>
          </div>

          <p className="text-center text-xs text-gray-600 md:text-right">
            © {new Date().getFullYear()} OneFixAL. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
