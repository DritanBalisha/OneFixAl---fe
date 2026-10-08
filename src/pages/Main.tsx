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
        if (parsed.role) navigate("/home");
      } catch {}
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

  return (
    <div className="min-h-screen w-full overflow-x-hidden bg-white text-gray-900">
      {/* NAVBAR */}
      <nav className="sticky top-0 z-50 border-b border-gray-100 bg-white/95 backdrop-blur">
        <div className="mx-auto flex min-h-16 w-full max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <Link
            to="/"
            onClick={closeMenu}
            className="shrink-0 text-xl font-black tracking-tight text-blue-600 sm:text-2xl"
          >
            OneFixAL
          </Link>

          {/* Desktop navigation */}
          <div className="hidden items-center gap-5 md:flex lg:gap-7">
            <Link
              to="/techprofiles"
              className="whitespace-nowrap text-sm font-medium text-gray-600 transition hover:text-blue-600"
            >
              Find a Technician
            </Link>

            {isLoggedIn ? (
              <>
                <Link
                  to="/myProfile"
                  className="whitespace-nowrap text-sm font-medium text-gray-600 transition hover:text-blue-600"
                >
                  My Profile
                </Link>
                <button
                  onClick={handleLogout}
                  className="rounded-lg px-3 py-2 text-sm font-medium text-red-500 transition hover:bg-red-50"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="whitespace-nowrap text-sm font-medium text-gray-600 transition hover:text-blue-600"
                >
                  Sign in
                </Link>
                <Link
                  to="/signup"
                  className="whitespace-nowrap rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-blue-700"
                >
                  Get started
                </Link>
              </>
            )}
          </div>

          {/* Mobile navigation button */}
          <button
            type="button"
            className="flex h-10 w-10 items-center justify-center rounded-lg text-gray-800 transition hover:bg-gray-50 md:hidden"
            onClick={() => setMenuOpen((open) => !open)}
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            aria-expanded={menuOpen}
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

        {/* Mobile navigation */}
        {menuOpen && (
          <div className="border-t border-gray-100 bg-white px-4 py-3 shadow-sm md:hidden">
            <div className="mx-auto flex w-full max-w-7xl flex-col gap-1">
              <Link
                to="/techprofiles"
                onClick={closeMenu}
                className="rounded-lg px-3 py-3 text-sm font-medium text-gray-700 transition hover:bg-gray-50"
              >
                Find a Technician
              </Link>

              {isLoggedIn ? (
                <>
                  <Link
                    to="/myProfile"
                    onClick={closeMenu}
                    className="rounded-lg px-3 py-3 text-sm font-medium text-gray-700 transition hover:bg-gray-50"
                  >
                    My Profile
                  </Link>
                  <button
                    onClick={() => {
                      closeMenu();
                      handleLogout();
                    }}
                    className="w-full rounded-lg px-3 py-3 text-left text-sm font-medium text-red-500 transition hover:bg-red-50"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <Link
                    to="/login"
                    onClick={closeMenu}
                    className="rounded-lg px-3 py-3 text-sm font-medium text-gray-700 transition hover:bg-gray-50"
                  >
                    Sign in
                  </Link>
                  <Link
                    to="/signup"
                    onClick={closeMenu}
                    className="mt-1 rounded-lg bg-blue-600 px-4 py-3 text-center text-sm font-semibold text-white transition hover:bg-blue-700"
                  >
                    Get started
                  </Link>
                </>
              )}
            </div>
          </div>
        )}
      </nav>

      {/* HERO */}
      <section className="bg-gradient-to-br from-blue-600 to-blue-800 text-white">
        <div className="mx-auto w-full max-w-7xl px-4 py-12 sm:px-6 sm:py-16 lg:px-8 lg:py-24 xl:py-28">
          <div className="grid grid-cols-1 items-center gap-10 lg:grid-cols-2 lg:gap-16">
            <div className="min-w-0">
              <div className="mb-4 inline-flex max-w-full items-center gap-2 rounded-full bg-white/20 px-3 py-1.5 text-xs font-semibold text-blue-100">
                <span className="h-1.5 w-1.5 shrink-0 animate-pulse rounded-full bg-green-400" />
                <span>Available in Tirana, Albania</span>
              </div>

              <h1 className="max-w-3xl text-4xl font-black leading-[1.05] tracking-tight sm:text-5xl lg:text-6xl">
                Find a trusted
                <br />
                technician,
                <br />
                <span className="text-blue-200">in minutes.</span>
              </h1>

              <p className="mt-5 max-w-xl text-base leading-7 text-blue-100 sm:text-lg">
                OneFixAL connects you with verified, qualified technicians across
                Tirana. Book, track, and pay — all in one place.
              </p>

              <div className="mt-6 flex flex-wrap gap-2 lg:hidden">
                {["✅ Verified Techs", "⚡ Fast Booking", "💬 Fair Pricing"].map(
                  (pill) => (
                    <span
                      key={pill}
                      className="rounded-full border border-white/30 bg-white/20 px-3 py-1.5 text-xs font-semibold text-white"
                    >
                      {pill}
                    </span>
                  )
                )}
              </div>

              <div className="mt-7 flex w-full flex-col gap-3 sm:w-auto sm:flex-row">
                <Link
                  to="/techprofiles"
                  className="w-full rounded-xl bg-white px-6 py-3.5 text-center text-sm font-bold text-blue-700 shadow-sm transition hover:bg-blue-50 sm:w-auto"
                >
                  Find a Technician
                </Link>
                <Link
                  to="/signup"
                  className="w-full rounded-xl border border-white/50 px-6 py-3.5 text-center text-sm font-semibold text-white transition hover:bg-white/10 sm:w-auto"
                >
                  Join as Technician
                </Link>
              </div>
            </div>

            {/* Booking preview — hidden on smaller screens to prevent crowding */}
            <div className="hidden justify-center lg:flex lg:justify-end">
              <div className="w-full max-w-sm rounded-2xl bg-white p-5 text-gray-800 shadow-2xl xl:max-w-md">
                <div className="mb-4 flex items-center gap-3">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-blue-100 text-xl">
                    ⚡
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-semibold">Ardit Krasniqi</p>
                    <p className="truncate text-xs text-gray-400">
                      Electrician · 8 yrs exp.
                    </p>
                  </div>
                  <span className="shrink-0 rounded-full bg-green-100 px-2 py-0.5 text-xs font-semibold text-green-700">
                    Available
                  </span>
                </div>

                <div className="mb-4 rounded-lg bg-gray-50 p-3 text-xs text-gray-600">
                  <p className="mb-1 font-medium text-gray-700">Problem</p>
                  <p className="italic">
                    Electrical panel making strange sounds and tripping breakers.
                  </p>
                </div>

                <div className="mb-4 space-y-1.5 text-xs">
                  <div className="flex justify-between gap-4 text-gray-500">
                    <span>Job Price</span>
                    <span className="font-medium text-gray-700">4,500 LEK</span>
                  </div>
                  <div className="flex justify-between gap-4 text-blue-600">
                    <span>Deposit (10%)</span>
                    <span className="font-medium">450 LEK</span>
                  </div>
                  <div className="flex justify-between gap-4 border-t border-gray-100 pt-1 font-semibold text-gray-800">
                    <span>Total</span>
                    <span>4,500 LEK</span>
                  </div>
                </div>

                <div className="rounded-lg bg-green-500 py-2 text-center text-xs font-bold text-white">
                  ✅ Booking Confirmed
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* STATS */}
      <section className="border-y border-blue-100 bg-blue-50 px-4 py-5 sm:px-6">
        <div className="mx-auto grid w-full max-w-7xl grid-cols-3 text-center">
          {[
            { value: "100+", label: "Verified Technicians" },
            { value: "500+", label: "Jobs Completed" },
            { value: "4.8★", label: "Average Rating" },
          ].map((s, i) => (
            <div
              key={s.label}
              className={`min-w-0 px-2 py-1 ${
                i > 0 ? "border-l border-blue-200" : ""
              }`}
            >
              <p className="text-xl font-black text-blue-600 sm:text-2xl">
                {s.value}
              </p>
              <p className="mt-0.5 text-[11px] leading-tight text-gray-500 sm:text-xs">
                {s.label}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="px-4 py-14 sm:px-6 sm:py-18 lg:px-8 lg:py-24">
        <div className="mx-auto w-full max-w-7xl">
          <h2 className="text-center text-2xl font-black text-gray-900 sm:text-3xl">
            How it works
          </h2>
          <p className="mx-auto mb-9 mt-1 max-w-xl text-center text-sm text-gray-500 sm:mb-12">
            Book a technician in three simple steps.
          </p>

          {/* Mobile / tablet vertical layout */}
          <div className="mx-auto flex max-w-2xl flex-col lg:hidden">
            {steps.map((item, idx) => (
              <div key={item.title} className="flex gap-4">
                <div className="flex shrink-0 flex-col items-center">
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-600 text-lg text-white shadow-sm sm:h-12 sm:w-12">
                    {item.icon}
                  </div>
                  {idx < steps.length - 1 && (
                    <div className="my-2 w-0.5 flex-1 bg-blue-100" />
                  )}
                </div>
                <div className="pb-7 pt-1.5">
                  <h3 className="mb-1 text-sm font-bold text-gray-800 sm:text-base">
                    {item.title}
                  </h3>
                  <p className="text-xs leading-relaxed text-gray-500 sm:text-sm">
                    {item.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Large desktop layout */}
          <div className="hidden grid-cols-3 gap-8 lg:grid xl:gap-12">
            {steps.map((item) => (
              <div key={item.title} className="min-w-0">
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-blue-600 text-xl text-white shadow-sm">
                  {item.icon}
                </div>
                <h3 className="mb-2 font-bold text-gray-800">{item.title}</h3>
                <p className="text-sm leading-relaxed text-gray-500">
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SERVICES */}
      <section className="bg-gray-50 px-4 py-14 sm:px-6 sm:py-18 lg:px-8 lg:py-24">
        <div className="mx-auto w-full max-w-7xl">
          <h2 className="text-center text-2xl font-black text-gray-900 sm:text-3xl">
            What can we fix?
          </h2>
          <p className="mx-auto mb-9 mt-1 max-w-xl text-center text-sm text-gray-500 sm:mb-12">
            Qualified technicians for every home and business need.
          </p>

          <div className="grid grid-cols-1 gap-3 min-[420px]:grid-cols-2 md:grid-cols-3 md:gap-4">
            {services.map((s) => (
              <Link
                key={s.name}
                to="/techprofiles"
                className="group min-w-0 rounded-xl border border-gray-200 bg-white p-4 transition hover:border-blue-300 hover:shadow-sm sm:p-5"
              >
                <span className="mb-2 block text-2xl">{s.icon}</span>
                <p className="truncate text-sm font-semibold text-gray-800 transition group-hover:text-blue-600">
                  {s.name}
                </p>
                <p className="mt-0.5 text-xs leading-tight text-gray-400">
                  {s.desc}
                </p>
              </Link>
            ))}
          </div>

          <div className="mt-7 text-center sm:mt-8">
            <Link
              to="/techprofiles"
              className="inline-flex w-full max-w-xs items-center justify-center rounded-xl bg-blue-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-blue-700 sm:w-auto"
            >
              Browse all technicians
            </Link>
          </div>
        </div>
      </section>

      {/* WHY + TESTIMONIALS */}
      <section className="px-4 py-14 sm:px-6 sm:py-18 lg:px-8 lg:py-24">
        <div className="mx-auto w-full max-w-7xl">
          <div className="grid grid-cols-1 items-start gap-10 lg:grid-cols-2 lg:gap-16">
            <div className="min-w-0">
              <h2 className="mb-6 text-2xl font-black text-gray-900 sm:text-3xl">
                Why OneFixAL?
              </h2>

              <div className="flex flex-col gap-5">
                {[
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
                ].map((f) => (
                  <div key={f.title} className="flex gap-3">
                    <span className="mt-0.5 shrink-0 text-xl">{f.icon}</span>
                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-gray-800">
                        {f.title}
                      </p>
                      <p className="mt-0.5 text-xs leading-relaxed text-gray-500 sm:text-sm">
                        {f.desc}
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
              ].map((t) => (
                <div
                  key={t.name}
                  className="rounded-xl border border-gray-200 bg-gray-50 p-4 sm:p-5"
                >
                  <div className="mb-2 flex gap-0.5">
                    {Array.from({ length: t.rating }).map((_, i) => (
                      <span key={i} className="text-sm text-amber-400">
                        ★
                      </span>
                    ))}
                  </div>
                  <p className="mb-3 text-sm leading-relaxed text-gray-700 italic">
                    "{t.text}"
                  </p>
                  <p className="text-sm font-semibold text-gray-800">{t.name}</p>
                  <p className="text-xs text-gray-400">{t.role}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-blue-600 px-4 py-14 text-white sm:px-6 sm:py-18 lg:px-8">
        <div className="mx-auto w-full max-w-2xl text-center">
          <h2 className="text-2xl font-black sm:text-3xl">
            Ready to fix something?
          </h2>
          <p className="mx-auto mt-3 max-w-xl text-sm leading-6 text-blue-100 sm:text-base">
            Join hundreds of people in Tirana who use OneFixAL to find trusted
            help fast.
          </p>

          <div className="mt-7 flex w-full flex-col justify-center gap-3 sm:flex-row">
            <Link
              to="/signup"
              className="w-full rounded-xl bg-white px-6 py-3.5 text-center text-sm font-bold text-blue-700 transition hover:bg-blue-50 sm:w-auto"
            >
              Create free account
            </Link>
            <Link
              to="/techprofiles"
              className="w-full rounded-xl border border-white/50 px-6 py-3.5 text-center text-sm font-semibold text-white transition hover:bg-white/10 sm:w-auto"
            >
              Browse technicians
            </Link>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-gray-900 px-4 py-9 text-gray-400 sm:px-6 lg:px-8">
        <div className="mx-auto flex w-full max-w-7xl flex-col items-center gap-6 md:flex-row md:justify-between">
          <div className="text-center md:text-left">
            <span className="block text-xl font-black text-white">OneFixAL</span>
            <p className="mt-1 text-xs text-gray-500">
              Connecting Tirana with trusted technicians.
            </p>
          </div>

          <div className="flex flex-wrap justify-center gap-x-5 gap-y-2 text-sm">
            <Link to="/techprofiles" className="transition hover:text-white">
              Find a Technician
            </Link>
            <Link to="/signup" className="transition hover:text-white">
              Join as Technician
            </Link>
            <Link to="/login" className="transition hover:text-white">
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
