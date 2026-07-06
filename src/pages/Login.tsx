import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { API_URL } from "../api/config.ts";

type Step = "login" | "forgot" | "verify";

export default function Login() {
  const navigate = useNavigate();

  // ── shared state ─────────────────────────────────────────────
  const [step, setStep] = useState<Step>("login");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // ── login fields ─────────────────────────────────────────────
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // ── forgot / verify fields ───────────────────────────────────
  const [forgotEmail, setForgotEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  // ── helpers ──────────────────────────────────────────────────
  const clearMessages = () => { setError(""); setSuccess(""); };

  // ── handlers ─────────────────────────────────────────────────
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    clearMessages();
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (res.ok) {
        localStorage.setItem("token", data.token);
        localStorage.setItem("user", JSON.stringify(data.user));
        if (data.user?.role) {
          localStorage.setItem("role", data.user.role.toLowerCase());
        }
        navigate("/myProfile");
      } else {
        setError(data.error || "Invalid email or password");
      }
    } catch {
      setError("Could not connect to server, please try again");
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    clearMessages();
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/auth/forgot-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: forgotEmail }),
      });
      const data = await res.json();
      if (res.ok) {
        setSuccess("Code sent! Check your email.");
        setStep("verify");
      } else {
        setError(data.error || "Something went wrong");
      }
    } catch {
      setError("Could not connect to server, please try again");
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    clearMessages();
    if (newPassword !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }
    if (newPassword.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/auth/verify-otp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: forgotEmail,
          otp,
          new_password: newPassword,
        }),
      });
      const data = await res.json();
      if (res.ok) {
        setSuccess("Password reset! You can now log in.");
        setStep("login");
        setForgotEmail("");
        setOtp("");
        setNewPassword("");
        setConfirmPassword("");
      } else {
        setError(data.error || "Invalid or expired code");
      }
    } catch {
      setError("Could not connect to server, please try again");
    } finally {
      setLoading(false);
    }
  };

  // ── shared UI pieces ─────────────────────────────────────────
  const inputClass =
    "w-full border border-gray-200 rounded-lg px-4 py-2.5 text-gray-800 " +
    "focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent " +
    "placeholder-gray-400 transition";

  const btnClass =
    "w-full bg-blue-600 hover:bg-blue-700 disabled:opacity-60 " +
    "text-white font-semibold py-2.5 rounded-lg transition-colors cursor-pointer";

  // ── render ───────────────────────────────────────────────────
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="bg-white rounded-2xl shadow-lg w-full max-w-md p-8">

        {/* Logo / Brand */}
        <div className="text-center mb-8">
          <span className="text-3xl font-black tracking-tight text-blue-600">
            OneFixAL
          </span>
          <p className="text-gray-400 text-sm mt-1">
            {step === "login" && "Sign in to your account"}
            {step === "forgot" && "Reset your password"}
            {step === "verify" && "Enter the code we sent you"}
          </p>
        </div>

        {/* Feedback messages */}
        {error && (
          <div className="mb-4 bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg px-4 py-3">
            {error}
          </div>
        )}
        {success && (
          <div className="mb-4 bg-green-50 border border-green-200 text-green-700 text-sm rounded-lg px-4 py-3">
            {success}
          </div>
        )}

        {/* ── STEP: LOGIN ── */}
        {step === "login" && (
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                required
                className={inputClass}
              />
            </div>

            <div>
              <div className="flex justify-between items-center mb-1">
                <label className="block text-sm font-medium text-gray-700">
                  Password
                </label>
                <button
                  type="button"
                  onClick={() => { clearMessages(); setStep("forgot"); }}
                  className="text-sm text-blue-500 hover:underline"
                >
                  Forgot password?
                </button>
              </div>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                className={inputClass}
              />
            </div>

            <button type="submit" disabled={loading} className={btnClass}>
              {loading ? "Signing in..." : "Sign in"}
            </button>

            <p className="text-center text-sm text-gray-500 pt-2">
              Don't have an account?{" "}
              <Link to="/signup" className="text-blue-500 hover:underline font-medium">
                Sign up
              </Link>
            </p>
          </form>
        )}

        {/* ── STEP: FORGOT PASSWORD ── */}
        {step === "forgot" && (
          <form onSubmit={handleForgotPassword} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Your email address
              </label>
              <input
                type="email"
                value={forgotEmail}
                onChange={(e) => setForgotEmail(e.target.value)}
                placeholder="you@example.com"
                required
                className={inputClass}
              />
            </div>

            <button type="submit" disabled={loading} className={btnClass}>
              {loading ? "Sending code..." : "Send reset code"}
            </button>

            <button
              type="button"
              onClick={() => { clearMessages(); setStep("login"); }}
              className="w-full text-sm text-gray-500 hover:text-gray-700 pt-1"
            >
              ← Back to login
            </button>
          </form>
        )}

        {/* ── STEP: VERIFY OTP + NEW PASSWORD ── */}
        {step === "verify" && (
          <form onSubmit={handleVerifyOTP} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                6-digit code
              </label>
              <input
                type="text"
                value={otp}
                onChange={(e) => setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))}
                placeholder="123456"
                maxLength={6}
                required
                className={inputClass + " tracking-widest text-center text-xl font-mono"}
              />
              <p className="text-xs text-gray-400 mt-1">
                Sent to {forgotEmail} · expires in 10 min
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                New password
              </label>
              <input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="At least 6 characters"
                required
                className={inputClass}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Confirm new password
              </label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Repeat password"
                required
                className={inputClass}
              />
            </div>

            <button type="submit" disabled={loading} className={btnClass}>
              {loading ? "Resetting..." : "Reset password"}
            </button>

            <button
              type="button"
              onClick={() => { clearMessages(); setStep("forgot"); }}
              className="w-full text-sm text-gray-500 hover:text-gray-700 pt-1"
            >
              ← Resend code
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
