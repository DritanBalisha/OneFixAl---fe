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

  return (
    <div className="min-h-screen flex flex-col bg-white">
      {/* Navbar */}
      <nav className="sticky top-0 z-50 bg-white border-b border-gray-100 py-4 px-4 sm:px-6">
        <div className="max-w-6xl mx-auto flex justify-between items-center">
          <span className="text-2xl font-black text-blue-600 tracking-tight">OneFixAL</span>
          <div className="hidden md:flex items-center gap-6">
            <Link to="/techprofiles" className="text-gray-600 hover:text-blue-600 text-sm font-medium transition">Find a Technician</Link>
            {isLoggedIn ? (
              <>
                <Link to="/myProfile" className="text-gray-600 hover:text-blue-600 text-sm font-medium transition">My Profile</Link>
                <button onClick={handleLogout} className="text-sm text-red-500 font-medium hover:bg-red-50 px-3 py-1.5 rounded-lg transition">Logout</button>
              </>
            ) : (
              <>
                <Link to="/login" className="text-sm text-gray-600 font-medium hover:text-blue-600 transition">Sign in</Link>
                <Link to="/signup" className="bg-blue-600 text-white text-sm font-semibold px-4 py-2 rounded-lg hover:bg-blue-700 transition">Get started</Link>
              </>
            )}
          </div>
          <button className="md:hidden flex flex-col gap-1.5 p-1" onClick={() => setMenuOpen(p => !p)} aria-label="Menu">
            <span className={`block w-5 h-0.5 bg-gray-700 transition-transform duration-200 origin-center ${menuOpen ? "rotate-45 translate-y-2" : ""}`} />
            <span className={`block w-5 h-0.5 bg-gray-700 transition-opacity duration-200 ${menuOpen ? "opacity-0" : ""}`} />
            <span className={`block w-5 h-0.5 bg-gray-700 transition-transform duration-200 origin-center ${menuOpen ? "-rotate-45 -translate-y-2" : ""}`} />
          </button>
        </div>
        {menuOpen && (
          <div className="md:hidden pt-4 pb-2 border-t border-gray-100 mt-4 flex flex-col gap-3 max-w-6xl mx-auto px-4 sm:px-6">
            <Link to="/techprofiles" className="text-gray-700 py-1 text-sm" onClick={() => setMenuOpen(false)}>Find a Technician</Link>
            {isLoggedIn ? (
              <>
                <Link to="/myProfile" className="text-gray-700 py-1 text-sm" onClick={() => setMenuOpen(false)}>My Profile</Link>
                <button onClick={() => { setMenuOpen(false); handleLogout(); }} className="text-red-500 text-sm text-left py-1">Logout</button>
              </>
            ) : (
              <>
                <Link to="/login" className="text-gray-700 py-1 text-sm" onClick={() => setMenuOpen(false)}>Sign in</Link>
                <Link to="/signup" className="bg-blue-600 text-white text-sm font-semibold px-4 py-2 rounded-lg text-center" onClick={() => setMenuOpen(false)}>Get started</Link>
              </>
            )}
          </div>
        )}
      </nav>

      {/* Hero */}
      <section className="bg-gradient-to-br from-blue-600 to-blue-800 text-white px-4 sm:px-6 py-14 md:py-28">
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-12 items-center">
          <div>
            <div className="inline-flex items-center gap-2 bg-blue-500 bg-opacity-40 text-blue-100 text-xs font-semibold px-3 py-1.5 rounded-full mb-6">
              <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse inline-block" />
              Available in Tirana, Albania
            </div>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-black leading-tight mb-5">
              Find a trusted<br />technician,<br />
              <span className="text-blue-200">in minutes.</span>
            </h1>
            <p className="text-blue-100 text-lg leading-relaxed mb-8 max-w-md">
              OneFixAL connects you with verified, qualified technicians across Tirana. Book, track, and pay — all in one place.
            </p>
            {/* Mobile trust pills — shown only on mobile in place of booking card */}
            <div className="flex flex-wrap gap-2 mb-6 md:hidden">
              <span className="inline-flex items-center gap-1.5 bg-blue-500 bg-opacity-40 border border-blue-400 text-blue-100 text-xs font-semibold px-3 py-1.5 rounded-full">✅ Verified</span>
              <span className="inline-flex items-center gap-1.5 bg-blue-500 bg-opacity-40 border border-blue-400 text-blue-100 text-xs font-semibold px-3 py-1.5 rounded-full">⚡ Fast Booking</span>
              <span className="inline-flex items-center gap-1.5 bg-blue-500 bg-opacity-40 border border-blue-400 text-blue-100 text-xs font-semibold px-3 py-1.5 rounded-full">💬 Fair Pricing</span>
            </div>
            <div className="flex flex-wrap gap-3">
              <Link to="/techprofiles" className="w-full sm:w-auto bg-white text-blue-700 font-bold px-6 py-3 rounded-xl hover:bg-blue-50 transition shadow-sm text-center">Find a Technician</Link>
              <Link to="/signup" className="w-full sm:w-auto bg-blue-500 bg-opacity-40 text-white font-semibold px-6 py-3 rounded-xl hover:bg-opacity-60 border border-blue-400 transition text-center">Join as Technician</Link>
            </div>
          </div>
          {/* Booking card mockup — desktop only */}
          <div className="hidden md:flex justify-center">
            <div className="bg-white rounded-2xl shadow-2xl p-5 w-72 text-gray-800">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-xl">⚡</div>
                <div>
                  <p className="font-semibold text-sm">Ardit Krasniqi</p>
                  <p className="text-xs text-gray-400">Electrician · 8 yrs exp.</p>
                </div>
                <span className="ml-auto text-xs bg-green-100 text-green-700 font-semibold px-2 py-0.5 rounded-full">Available</span>
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
      </section>

      {/* Stats bar */}
      <section className="bg-blue-50 border-y border-blue-100 py-6 px-4 sm:px-6">
        <div className="max-w-6xl mx-auto grid grid-cols-3 gap-4 text-center divide-x divide-blue-200">
          {[
            { value: "100+", label: "Verified Technicians" },
            { value: "500+", label: "Jobs Completed" },
            { value: "4.8★", label: "Average Rating" },
          ].map((s) => (
            <div key={s.label}>
              <p className="text-xl sm:text-2xl font-black text-blue-600">{s.value}</p>
              <p className="text-xs text-gray-500 mt-0.5">{s.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* How it works */}
      <section className="py-14 md:py-20 px-4 sm:px-6">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-2xl sm:text-3xl font-black text-gray-900 mb-2 text-center">How it works</h2>
          <p className="text-gray-500 text-center mb-12 text-sm">Book a technician in three simple steps.</p>
          <div className="relative grid md:grid-cols-3 gap-0 md:gap-10">
            {[
              { icon: "🔍", title: "Describe your problem", desc: "Tell us what needs fixing. Browse verified technicians by specialty and choose who fits." },
              { icon: "💬", title: "Get a price", desc: "The technician reviews your request and sets a fair price. Accept or decline — no pressure." },
              { icon: "🔧", title: "Job done", desc: "Your technician arrives at the agreed time. Pay the deposit upfront, the rest when done." },
            ].map((item, idx, arr) => (
              <div key={item.title} className="relative flex md:flex-col items-start gap-4 md:gap-0 pb-8 md:pb-0 last:pb-0">
                {/* Mobile connecting line */}
                {idx < arr.length - 1 && (
                  <div className="md:hidden absolute left-6 top-12 bottom-0 w-0.5 bg-blue-100" aria-hidden="true" />
                )}
                <div className="relative z-10 w-12 h-12 shrink-0 bg-blue-600 text-white rounded-xl flex items-center justify-center text-xl shadow-sm">{item.icon}</div>
                <div className="md:mt-4">
                  <h3 className="font-bold text-gray-800 mb-2">{item.title}</h3>
                  <p className="text-gray-500 text-sm leading-relaxed">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Service categories */}
      <section className="bg-gray-50 py-14 md:py-20 px-4 sm:px-6">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-2xl sm:text-3xl font-black text-gray-900 mb-2 text-center">What can we fix?</h2>
          <p className="text-gray-500 text-center mb-12 text-sm">Qualified technicians across all home and business services.</p>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {services.map((s) => (
              <Link key={s.name} to="/techprofiles" className="bg-white border border-gray-200 rounded-xl p-4 md:p-5 hover:border-blue-300 hover:shadow-sm transition group">
                <span className="text-2xl md:text-3xl mb-3 block">{s.icon}</span>
                <p className="font-semibold text-gray-800 text-sm group-hover:text-blue-600 transition">{s.name}</p>
                <p className="text-xs text-gray-400 mt-0.5">{s.desc}</p>
              </Link>
            ))}
          </div>
          <div className="text-center mt-8">
            <Link to="/techprofiles" className="inline-block bg-blue-600 text-white font-semibold px-6 py-3 rounded-xl hover:bg-blue-700 transition text-sm">Browse all technicians</Link>
          </div>
        </div>
      </section>

      {/* Why OneFixAL */}
      <section className="py-14 md:py-20 px-4 sm:px-6">
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-16 items-start">
          <div>
            <h2 className="text-2xl sm:text-3xl font-black text-gray-900 mb-6">Why OneFixAL?</h2>
            <div className="space-y-5">
              {[
                { icon: "✅", title: "Verified & certified", desc: "Every technician is manually verified with certificates and qualifications checked." },
                { icon: "💬", title: "You see the price first", desc: "The technician sets a fair price after reading your problem. Accept or decline — no hidden fees." },
                { icon: "🔒", title: "Transparent pricing", desc: "Small deposit upfront to confirm the booking. Pay the rest in cash when the job is done." },
                { icon: "⚡", title: "Fast booking", desc: "Browse availability and book in under 2 minutes. No phone calls needed." },
              ].map((f) => (
                <div key={f.title} className="flex gap-4">
                  <span className="text-2xl mt-0.5 shrink-0">{f.icon}</span>
                  <div>
                    <p className="font-semibold text-gray-800 text-sm">{f.title}</p>
                    <p className="text-gray-500 text-sm mt-0.5 leading-relaxed">{f.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="space-y-4">
            {[
              { name: "Blerina M.", role: "Client, Tirana", text: "Found an electrician in 10 minutes. He came the next morning and fixed everything. Highly recommend!", rating: 5 },
              { name: "Erjon K.", role: "Plumber, OneFixAL Technician", text: "As a technician, I get new clients every week. The booking system is simple and I'm always paid fairly.", rating: 5 },
            ].map((t) => (
              <div key={t.name} className="bg-gray-50 border border-gray-200 rounded-xl p-5">
                <div className="flex gap-0.5 mb-3">{Array.from({ length: t.rating }).map((_, i) => <span key={i} className="text-amber-400 text-sm">★</span>)}</div>
                <p className="text-gray-700 text-sm italic mb-4">"{t.text}"</p>
                <div>
                  <p className="font-semibold text-gray-800 text-sm">{t.name}</p>
                  <p className="text-xs text-gray-400">{t.role}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Banner */}
      <section className="bg-blue-600 text-white py-16 px-4 sm:px-6">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-2xl sm:text-3xl font-black mb-3">Ready to fix something?</h2>
          <p className="text-blue-100 mb-8 text-sm">Join hundreds of people in Tirana who use OneFixAL to find trusted help fast.</p>
          <div className="flex flex-col sm:flex-row flex-wrap gap-3 justify-center">
            <Link to="/signup" className="w-full sm:w-auto bg-white text-blue-700 font-bold px-6 py-3 rounded-xl hover:bg-blue-50 transition text-center">Create free account</Link>
            <Link to="/techprofiles" className="w-full sm:w-auto bg-blue-500 bg-opacity-50 border border-blue-400 text-white font-semibold px-6 py-3 rounded-xl hover:bg-opacity-70 transition text-center">Browse technicians</Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-400 py-10 px-4 sm:px-6">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
          <div>
            <span className="text-white font-black text-xl">OneFixAL</span>
            <p className="text-xs text-gray-500 mt-1">Connecting Tirana with trusted technicians.</p>
          </div>
          <div className="flex flex-wrap justify-center gap-4 text-sm">
            <Link to="/techprofiles" className="hover:text-white transition">Find a Technician</Link>
            <Link to="/signup" className="hover:text-white transition">Join as Technician</Link>
            <Link to="/login" className="hover:text-white transition">Sign in</Link>
          </div>
          <p className="text-xs text-gray-600">© {new Date().getFullYear()} OneFixAL. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
