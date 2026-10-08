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

  const services = [
    { icon: "⚡", name: "Electrician", desc: "Wiring, panels, outlets" },
    { icon: "🔧", name: "Plumber", desc: "Pipes, leaks, installations" },
    { icon: "❄️", name: "AC Technician", desc: "Install, repair, service" },
    { icon: "🪵", name: "Carpenter", desc: "Furniture, doors, floors" },
    { icon: "🎨", name: "Painter", desc: "Interior & exterior" },
    { icon: "📱", name: "Electronics", desc: "Phones, TVs, appliances" },
  ];

  const steps = [
    { icon: "🔍", title: "Describe your problem", desc: "Tell us what needs fixing. Browse verified technicians by specialty and choose who fits." },
    { icon: "💬", title: "Get a price", desc: "The technician reviews your request and sets a fair price. Accept or decline — no pressure." },
    { icon: "🔧", title: "Job done", desc: "Your technician arrives at the agreed time. Pay the deposit upfront, the rest when done." },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-white">

      {/* ── NAVBAR: logo left, burger right on mobile; full links on desktop ── */}
      <nav className="sticky top-0 z-50 bg-white border-b border-gray-100">
        <div className="flex items-center justify-between px-4 py-3 sm:px-6 sm:py-4">
          <span className="text-xl sm:text-2xl font-black text-blue-600 tracking-tight">OneFixAL</span>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-6">
            <Link to="/techprofiles" className="text-sm font-medium text-gray-600 hover:text-blue-600 transition">
              Find a Technician
            </Link>
            {isLoggedIn ? (
              <>
                <Link to="/myProfile" className="text-sm font-medium text-gray-600 hover:text-blue-600 transition">My Profile</Link>
                <button onClick={handleLogout} className="text-sm font-medium text-red-500 hover:bg-red-50 px-3 py-1.5 rounded-lg transition">Logout</button>
              </>
            ) : (
              <>
                <Link to="/login" className="text-sm font-medium text-gray-600 hover:text-blue-600 transition">Sign in</Link>
                <Link to="/signup" className="text-sm font-semibold bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition">Get started</Link>
              </>
            )}
          </div>

          {/* Mobile hamburger */}
          <button className="md:hidden p-2" onClick={() => setMenuOpen(p => !p)} aria-label="Toggle menu">
            <div className={`w-5 h-0.5 bg-gray-800 mb-1.5 transition-all duration-200 ${menuOpen ? "rotate-45 translate-y-2" : ""}`} />
            <div className={`w-5 h-0.5 bg-gray-800 mb-1.5 transition-all duration-200 ${menuOpen ? "opacity-0" : ""}`} />
            <div className={`w-5 h-0.5 bg-gray-800 transition-all duration-200 ${menuOpen ? "-rotate-45 -translate-y-2" : ""}`} />
          </button>
        </div>

        {/* Mobile dropdown — full width, each item its own row */}
        {menuOpen && (
          <div className="md:hidden border-t border-gray-100 bg-white px-4 py-3 flex flex-col gap-1">
            <Link to="/techprofiles" onClick={() => setMenuOpen(false)}
              className="block w-full text-left text-sm font-medium text-gray-700 px-3 py-2.5 rounded-lg hover:bg-gray-50 transition">
              Find a Technician
            </Link>
            {isLoggedIn ? (
              <>
                <Link to="/myProfile" onClick={() => setMenuOpen(false)}
                  className="block w-full text-left text-sm font-medium text-gray-700 px-3 py-2.5 rounded-lg hover:bg-gray-50 transition">
                  My Profile
                </Link>
                <button onClick={() => { setMenuOpen(false); handleLogout(); }}
                  className="block w-full text-left text-sm font-medium text-red-500 px-3 py-2.5 rounded-lg hover:bg-red-50 transition">
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link to="/login" onClick={() => setMenuOpen(false)}
                  className="block w-full text-left text-sm font-medium text-gray-700 px-3 py-2.5 rounded-lg hover:bg-gray-50 transition">
                  Sign in
                </Link>
                <Link to="/signup" onClick={() => setMenuOpen(false)}
                  className="block w-full text-center text-sm font-semibold bg-blue-600 text-white px-4 py-2.5 rounded-lg hover:bg-blue-700 transition mt-1">
                  Get started
                </Link>
              </>
            )}
          </div>
        )}
      </nav>

      {/* ── HERO: full-width on mobile, 2-col on desktop ── */}
      <section className="bg-gradient-to-br from-blue-600 to-blue-800 text-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-12 sm:py-16 md:py-24 lg:py-32">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center">

            {/* Text block — stacks first on mobile */}
            <div className="flex flex-col items-start">
              <div className="inline-flex items-center gap-2 bg-white bg-opacity-20 text-blue-100 text-xs font-semibold px-3 py-1.5 rounded-full mb-4">
                <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
                Available in Tirana, Albania
              </div>

              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black leading-tight mb-4 w-full">
                Find a trusted<br />technician,<br />
                <span className="text-blue-200">in minutes.</span>
              </h1>

              <p className="text-blue-100 text-base leading-relaxed mb-6 w-full max-w-md">
                OneFixAL connects you with verified, qualified technicians across Tirana. Book, track, and pay — all in one place.
              </p>

              {/* Trust pills — visible on mobile only, replaces card */}
              <div className="flex flex-wrap gap-2 mb-6 md:hidden w-full">
                {["✅ Verified Techs", "⚡ Fast Booking", "💬 Fair Pricing"].map(pill => (
                  <span key={pill} className="bg-white bg-opacity-20 border border-white border-opacity-30 text-white text-xs font-semibold px-3 py-1.5 rounded-full">
                    {pill}
                  </span>
                ))}
              </div>

              {/* Buttons: each full width on mobile, auto on sm+ */}
              <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
                <Link to="/techprofiles"
                  className="w-full sm:w-auto text-center bg-white text-blue-700 font-bold px-6 py-3 rounded-xl hover:bg-blue-50 transition shadow-sm text-sm">
                  Find a Technician
                </Link>
                <Link to="/signup"
                  className="w-full sm:w-auto text-center border border-white border-opacity-50 text-white font-semibold px-6 py-3 rounded-xl hover:bg-white hover:bg-opacity-10 transition text-sm">
                  Join as Technician
                </Link>
              </div>
            </div>

            {/* Booking card — only on desktop */}
            <div className="hidden md:flex justify-center lg:justify-end">
              <div className="bg-white rounded-2xl shadow-2xl p-5 w-72 text-gray-800">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-xl shrink-0">⚡</div>
                  <div className="min-w-0">
                    <p className="font-semibold text-sm truncate">Ardit Krasniqi</p>
                    <p className="text-xs text-gray-400">Electrician · 8 yrs exp.</p>
                  </div>
                  <span className="ml-auto shrink-0 text-xs bg-green-100 text-green-700 font-semibold px-2 py-0.5 rounded-full">Available</span>
                </div>
                <div className="bg-gray-50 rounded-lg p-3 mb-4 text-xs text-gray-600">
                  <p className="font-medium text-gray-700 mb-1">Problem</p>
                  <p className="italic">Electrical panel making strange sounds and tripping breakers.</p>
                </div>
                <div className="space-y-1.5 text-xs mb-4">
                  <div className="flex justify-between text-gray-500"><span>Job Price</span><span className="font-medium text-gray-700">4,500 LEK</span></div>
                  <div className="flex justify-between text-blue-600"><span>Deposit (10%)</span><span className="font-medium">450 LEK</span></div>
                  <div className="border-t border-gray-100 pt-1 flex justify-between font-semibold text-gray-800"><span>Total</span><span>4,500 LEK</span></div>
                </div>
                <div className="bg-green-500 text-white text-xs font-bold text-center py-2 rounded-lg">✅ Booking Confirmed</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── STATS: 3 columns always, smaller text on mobile ── */}
      <section className="bg-blue-50 border-y border-blue-100 py-5 px-4 sm:px-6">
        <div className="max-w-6xl mx-auto grid grid-cols-3 text-center gap-2">
          {[
            { value: "100+", label: "Verified Technicians" },
            { value: "500+", label: "Jobs Completed" },
            { value: "4.8★", label: "Average Rating" },
          ].map((s, i) => (
            <div key={s.label} className={`py-1 ${i > 0 ? "border-l border-blue-200" : ""}`}>
              <p className="text-lg sm:text-2xl font-black text-blue-600">{s.value}</p>
              <p className="text-xs text-gray-500 mt-0.5 leading-tight">{s.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── HOW IT WORKS: single column on mobile with connecting line ── */}
      <section className="py-12 sm:py-16 md:py-20 px-4 sm:px-6">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-2xl sm:text-3xl font-black text-gray-900 mb-1 text-center">How it works</h2>
          <p className="text-sm text-gray-500 text-center mb-8 sm:mb-12">Book a technician in three simple steps.</p>

          {/* Mobile layout */}
          <div className="flex flex-col md:hidden">
            {steps.map((item, idx) => (
              <div key={item.title} className="flex gap-4">
                <div className="flex flex-col items-center shrink-0">
                  <div className="w-11 h-11 bg-blue-600 text-white rounded-xl flex items-center justify-center text-lg shadow-sm">
                    {item.icon}
                  </div>
                  {idx < steps.length - 1 && (
                    <div className="w-0.5 bg-blue-100 grow my-2" style={{ minHeight: 24 }} />
                  )}
                </div>
                <div className="pb-6 pt-1.5">
                  <h3 className="font-bold text-gray-800 text-sm mb-1">{item.title}</h3>
                  <p className="text-xs text-gray-500 leading-relaxed">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Desktop layout */}
          <div className="hidden md:grid grid-cols-3 gap-10">
            {steps.map(item => (
              <div key={item.title} className="flex flex-col items-start">
                <div className="w-12 h-12 bg-blue-600 text-white rounded-xl flex items-center justify-center text-xl mb-4 shadow-sm">{item.icon}</div>
                <h3 className="font-bold text-gray-800 mb-2">{item.title}</h3>
                <p className="text-sm text-gray-500 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── SERVICES: 2-col grid always, 3-col on desktop ── */}
      <section className="bg-gray-50 py-12 sm:py-16 md:py-20 px-4 sm:px-6">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-2xl sm:text-3xl font-black text-gray-900 mb-1 text-center">What can we fix?</h2>
          <p className="text-sm text-gray-500 text-center mb-8 sm:mb-12">Qualified technicians for every home and business need.</p>

          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 gap-3">
            {services.map(s => (
              <Link key={s.name} to="/techprofiles"
                className="bg-white border border-gray-200 rounded-xl p-4 hover:border-blue-300 hover:shadow-sm transition group">
                <span className="text-2xl mb-2 block">{s.icon}</span>
                <p className="font-semibold text-sm text-gray-800 group-hover:text-blue-600 transition">{s.name}</p>
                <p className="text-xs text-gray-400 mt-0.5 leading-tight">{s.desc}</p>
              </Link>
            ))}
          </div>

          <div className="text-center mt-6 sm:mt-8">
            <Link to="/techprofiles"
              className="inline-block bg-blue-600 text-white font-semibold px-6 py-3 rounded-xl hover:bg-blue-700 transition text-sm">
              Browse all technicians
            </Link>
          </div>
        </div>
      </section>

      {/* ── WHY + TESTIMONIALS: stacked on mobile, 2-col on desktop ── */}
      <section className="py-12 sm:py-16 md:py-20 px-4 sm:px-6">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-16 items-start">

            {/* Why list */}
            <div>
              <h2 className="text-2xl sm:text-3xl font-black text-gray-900 mb-6">Why OneFixAL?</h2>
              <div className="flex flex-col gap-5">
                {[
                  { icon: "✅", title: "Verified & certified", desc: "Every technician is manually verified with certificates and qualifications checked." },
                  { icon: "💬", title: "You see the price first", desc: "The technician sets a fair price after reading your problem. Accept or decline — no hidden fees." },
                  { icon: "🔒", title: "Transparent pricing", desc: "Small deposit upfront to confirm the booking. Pay the rest in cash when the job is done." },
                  { icon: "⚡", title: "Fast booking", desc: "Browse availability and book in under 2 minutes. No phone calls needed." },
                ].map(f => (
                  <div key={f.title} className="flex gap-3">
                    <span className="text-xl shrink-0 mt-0.5">{f.icon}</span>
                    <div>
                      <p className="font-semibold text-sm text-gray-800">{f.title}</p>
                      <p className="text-xs text-gray-500 mt-0.5 leading-relaxed">{f.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Testimonials */}
            <div className="flex flex-col gap-4">
              {[
                { name: "Blerina M.", role: "Client, Tirana", text: "Found an electrician in 10 minutes. He came the next morning and fixed everything. Highly recommend!", rating: 5 },
                { name: "Erjon K.", role: "Plumber, OneFixAL Technician", text: "As a technician, I get new clients every week. The booking system is simple and I'm always paid fairly.", rating: 5 },
              ].map(t => (
                <div key={t.name} className="bg-gray-50 border border-gray-200 rounded-xl p-4 sm:p-5">
                  <div className="flex gap-0.5 mb-2">
                    {Array.from({ length: t.rating }).map((_, i) => <span key={i} className="text-amber-400 text-sm">★</span>)}
                  </div>
                  <p className="text-sm text-gray-700 italic mb-3">"{t.text}"</p>
                  <p className="text-sm font-semibold text-gray-800">{t.name}</p>
                  <p className="text-xs text-gray-400">{t.role}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── CTA BANNER: buttons full-width on mobile ── */}
      <section className="bg-blue-600 text-white py-12 sm:py-16 px-4 sm:px-6">
        <div className="max-w-xl mx-auto text-center">
          <h2 className="text-2xl sm:text-3xl font-black mb-3">Ready to fix something?</h2>
          <p className="text-blue-100 text-sm mb-7">
            Join hundreds of people in Tirana who use OneFixAL to find trusted help fast.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link to="/signup"
              className="w-full sm:w-auto text-center bg-white text-blue-700 font-bold px-6 py-3 rounded-xl hover:bg-blue-50 transition text-sm">
              Create free account
            </Link>
            <Link to="/techprofiles"
              className="w-full sm:w-auto text-center border border-white border-opacity-50 text-white font-semibold px-6 py-3 rounded-xl hover:bg-white hover:bg-opacity-10 transition text-sm">
              Browse technicians
            </Link>
          </div>
        </div>
      </section>

      {/* ── FOOTER: stacked on mobile ── */}
      <footer className="bg-gray-900 text-gray-400 py-8 sm:py-10 px-4 sm:px-6">
        <div className="max-w-6xl mx-auto flex flex-col items-center gap-5 md:flex-row md:justify-between md:items-center">
          <div className="text-center md:text-left">
            <span className="text-white font-black text-xl block">OneFixAL</span>
            <p className="text-xs text-gray-500 mt-1">Connecting Tirana with trusted technicians.</p>
          </div>
          <div className="flex flex-wrap justify-center gap-4 text-sm">
            <Link to="/techprofiles" className="hover:text-white transition">Find a Technician</Link>
            <Link to="/signup" className="hover:text-white transition">Join as Technician</Link>
            <Link to="/login" className="hover:text-white transition">Sign in</Link>
          </div>
          <p className="text-xs text-gray-600 text-center md:text-right">
            © {new Date().getFullYear()} OneFixAL. All rights reserved.
          </p>
        </div>
      </footer>

    </div>
  );
}
