"use client";

import React, { useState } from "react";
import {
  Shield,
  IndianRupee,
  Lock,
  Mail,
  ArrowRight,
  ShieldAlert,
  CheckCircle2,
  Building2,
  User,
  Phone,
  MapPin,
  Sparkles,
} from "lucide-react";

export default function LoginPage() {
  const [mode, setMode] = useState<"LOGIN" | "REGISTER">("LOGIN");
  const [role, setRole] = useState<"ADMIN" | "INSTITUTION">("ADMIN");

  // Login Form Fields
  const [email, setEmail] = useState("admin@finmatrix.gov.in");
  const [password, setPassword] = useState("Admin@1234");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  // Registration Form Fields
  const [regForm, setRegForm] = useState({
    name: "",
    aicteId: "",
    state: "",
    city: "",
    region: "Northern",
    type: "Engineering",
    nodalOfficer: "",
    email: "",
    phone: "",
    password: "",
  });

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isLoading) return;
    setIsLoading(true);
    setError(null);
    setSuccessMsg(null);

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim(), password }),
      });

      const data = await res.json();

      if (!res.ok || !data.ok) {
        throw new Error(data.error?.message || "Invalid email or password");
      }

      const userRole = data.data.user.role;
      const targetUrl =
        userRole === "ADMIN" || userRole === "SENIOR_ADMIN"
          ? "/admin"
          : "/portal";

      window.location.href = targetUrl;
    } catch (err: any) {
      setError(err.message || "Authentication failed. Please verify credentials.");
      setIsLoading(false);
    }
  };

  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isLoading) return;
    setIsLoading(true);
    setError(null);
    setSuccessMsg(null);

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(regForm),
      });

      const data = await res.json();

      if (!res.ok || !data.ok) {
        throw new Error(data.error || "Registration failed");
      }

      setSuccessMsg("College institution registered successfully! Redirecting to portal...");
      setTimeout(() => {
        window.location.href = "/portal";
      }, 1000);
    } catch (err: any) {
      setError(err.message || "Failed to register institution. Please try again.");
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen lg:h-screen w-full flex flex-col lg:flex-row bg-[#F8FAFC] lg:overflow-hidden">
      {/* LEFT COLUMN: Premium Sunset-Wave Hero Banner */}
      <div className="lg:w-[46%] xl:w-[44%] bg-[#006675] relative flex flex-col justify-between p-6 sm:p-10 lg:p-12 text-white overflow-hidden select-none">
        {/* Harmonious Palette Gradients */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#006675] via-[#005562] to-[#0F2A30] z-0" />

        {/* Dynamic Curved Wave Bands */}
        <svg
          className="absolute -right-24 -bottom-24 w-[600px] h-[600px] pointer-events-none opacity-25 mix-blend-screen"
          viewBox="0 0 500 500"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M50 250C150 150 280 350 450 200V500H50V250Z" fill="#EB5A11" />
          <path d="M0 320C120 220 260 400 500 280V500H0V320Z" fill="#FF9D2D" />
          <path d="M0 380C140 310 240 450 500 360V500H0V380Z" fill="#4DC2C2" />
        </svg>

        {/* Top Brand Header */}
        <div className="relative z-10 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="relative flex items-center justify-center w-11 h-11 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 shadow-lg shadow-black/10">
              <Shield className="w-6 h-6 text-white stroke-[2.2]" />
              <IndianRupee className="absolute w-3.5 h-3.5 text-[#FF9D2D] stroke-[2.5]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-display text-2xl font-bold tracking-tight text-white leading-none">
                  FinMatrix
                </span>
                <span className="px-2 py-0.5 rounded-full bg-[#FF9D2D] text-[#0F2A30] text-[10px] font-extrabold uppercase tracking-widest shadow-xs">
                  AICTE
                </span>
              </div>
              <p className="text-[11px] text-white/70 font-medium mt-0.5">
                Centralized Security Deposit &amp; FDR Clearinghouse
              </p>
            </div>
          </div>
        </div>

        {/* Center Narrative & Value Props */}
        <div className="relative z-10 my-auto py-6 sm:py-8 space-y-6 max-w-lg">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 border border-white/15 text-xs text-white/90">
            <span className="w-2 h-2 rounded-full bg-[#FF9D2D] animate-pulse" />
            <span>Ministry of Education · Technical Education Regulatory Bureau</span>
          </div>

          <h1 className="text-3xl sm:text-4xl xl:text-5xl font-bold font-display leading-[1.15] text-white">
            Secure, Verified &amp; Automated Financial Deposit Governance
          </h1>

          <p className="text-sm sm:text-base text-white/80 font-normal leading-relaxed">
            Eliminate fragmented spreadsheets and ensure 100% compliance across institutions nationwide with real-time deposit tracking, bank cross-checks, automated expiry watchdogs, and an immutable audit trail.
          </p>

          <div className="grid grid-cols-2 gap-3 pt-2">
            <div className="p-3.5 rounded-2xl bg-white/10 border border-white/10 backdrop-blur-xs">
              <div className="flex items-center gap-2 text-white font-bold text-xs">
                <CheckCircle2 className="w-4 h-4 text-[#4DC2C2]" />
                <span>Dual-Source Verification</span>
              </div>
              <p className="text-[11px] text-white/70 mt-1 leading-normal">
                Cross-examination of institutional claims against Core Banking records.
              </p>
            </div>
            <div className="p-3.5 rounded-2xl bg-white/10 border border-white/10 backdrop-blur-xs">
              <div className="flex items-center gap-2 text-white font-bold text-xs">
                <CheckCircle2 className="w-4 h-4 text-[#FF9D2D]" />
                <span>HMAC Audit Proof</span>
              </div>
              <p className="text-[11px] text-white/70 mt-1 leading-normal">
                Non-repudiation with cryptographically chained state mutation logs.
              </p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="relative z-10 pt-4 border-t border-white/15 flex items-center justify-between text-xs text-white/60">
          <span>&copy; {new Date().getFullYear()} FinMatrix Clearinghouse</span>
          <span className="font-mono text-[11px]">ISO 27001 Security Standard</span>
        </div>
      </div>

      {/* RIGHT COLUMN: Real Working Login / Registration Panel */}
      <div className="lg:w-[54%] xl:w-[56%] flex flex-col justify-center p-6 sm:p-10 lg:p-14 overflow-y-auto max-h-screen">
        <div className="w-full max-w-md mx-auto space-y-6">
          {/* Form Header */}
          <div className="space-y-1">
            <h2 className="text-2xl sm:text-3xl font-bold font-heading text-[#0F2A30] tracking-tight">
              {mode === "LOGIN" ? "Sign In to Portal" : "Register Technical Institution"}
            </h2>
            <p className="text-xs sm:text-sm text-[#5B7480]">
              {mode === "LOGIN"
                ? "Enter your official credentials to access your centralized financial dashboard."
                : "Submit institutional credentials to establish your institution deposit account."}
            </p>
          </div>

          {/* Mode Switcher Tabs */}
          <div className="flex rounded-xl bg-slate-100 p-1 border border-slate-200">
            <button
              type="button"
              onClick={() => {
                setMode("LOGIN");
                setError(null);
                setSuccessMsg(null);
              }}
              className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${
                mode === "LOGIN"
                  ? "bg-white text-[#006675] shadow-xs"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              Portal Sign In
            </button>
            <button
              type="button"
              onClick={() => {
                setMode("REGISTER");
                setError(null);
                setSuccessMsg(null);
              }}
              className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${
                mode === "REGISTER"
                  ? "bg-white text-[#006675] shadow-xs"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              Register College
            </button>
          </div>

          {/* Alert Messages */}
          {error && (
            <div className="p-3.5 rounded-xl bg-[#FDE3D6] border border-[#EB5A11]/30 text-[#B2400A] text-xs font-semibold flex items-center gap-2.5">
              <ShieldAlert className="w-4 h-4 text-[#EB5A11] shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {successMsg && (
            <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold flex items-center gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>{successMsg}</span>
            </div>
          )}

          {/* MODE 1: LOGIN FORM */}
          {mode === "LOGIN" && (
            <form onSubmit={handleLoginSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-[#0F2A30] mb-1.5">
                  Official Email Address
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <Mail className="w-4 h-4" />
                  </div>
                  <input
                    id="login-email-input"
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-10 pr-3.5 py-2.5 text-sm bg-white border border-slate-300 rounded-xl focus:border-[#00959C] focus:ring-2 focus:ring-[#00959C]/20 transition-all focus:outline-hidden text-[#0F2A30]"
                    placeholder="admin@finmatrix.gov.in"
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="block text-xs font-bold text-[#0F2A30]">
                    Password
                  </label>
                  <span className="text-[11px] text-[#5B7480]">
                    Protected with AES &amp; bcrypt
                  </span>
                </div>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <Lock className="w-4 h-4" />
                  </div>
                  <input
                    id="login-password-input"
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-10 pr-3.5 py-2.5 text-sm bg-white border border-slate-300 rounded-xl focus:border-[#00959C] focus:ring-2 focus:ring-[#00959C]/20 transition-all focus:outline-hidden text-[#0F2A30]"
                    placeholder="••••••••••••"
                  />
                </div>
              </div>

              {/* Submit Button */}
              <button
                id="login-submit-btn"
                type="submit"
                disabled={isLoading}
                className="w-full py-3 px-4 rounded-xl text-sm font-bold bg-[#EB5A11] hover:bg-[#D44E0C] text-white transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2 group disabled:opacity-75 focus:outline-hidden focus:ring-2 focus:ring-[#FF9D2D]"
              >
                {isLoading ? (
                  <>
                    <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    <span>Verifying Credentials...</span>
                  </>
                ) : (
                  <>
                    <span>Sign In to FinMatrix</span>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </>
                )}
              </button>

              {/* Quick Preset Buttons for Instant Testing */}
              <div className="pt-3 border-t border-slate-200">
                <span className="text-[11px] font-semibold text-[#5B7480] uppercase tracking-wider block mb-2">
                  Quick Access Accounts:
                </span>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      setEmail("admin@finmatrix.gov.in");
                      setPassword("Admin@1234");
                      setError(null);
                    }}
                    className="p-2.5 rounded-xl border border-slate-200 hover:border-[#00959C] bg-white hover:bg-slate-50 text-left transition-all"
                  >
                    <span className="text-xs font-bold text-[#006675] block leading-tight">
                      AICTE Central Admin
                    </span>
                    <span className="text-[10px] text-slate-500 font-mono">
                      admin@finmatrix.gov.in
                    </span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setEmail("nodal@dtu.ac.in");
                      setPassword("College@1234");
                      setError(null);
                    }}
                    className="p-2.5 rounded-xl border border-slate-200 hover:border-[#00959C] bg-white hover:bg-slate-50 text-left transition-all"
                  >
                    <span className="text-xs font-bold text-[#EB5A11] block leading-tight">
                      DTU College Portal
                    </span>
                    <span className="text-[10px] text-slate-500 font-mono">
                      nodal@dtu.ac.in
                    </span>
                  </button>
                </div>
              </div>
            </form>
          )}

          {/* MODE 2: COLLEGE REGISTRATION FORM */}
          {mode === "REGISTER" && (
            <form onSubmit={handleRegisterSubmit} className="space-y-3.5">
              <div>
                <label className="block text-xs font-bold text-[#0F2A30] mb-1">
                  Institution / University Name *
                </label>
                <input
                  type="text"
                  required
                  value={regForm.name}
                  onChange={(e) => setRegForm({ ...regForm, name: e.target.value })}
                  placeholder="e.g. Indian Institute of Technology Bombay"
                  className="w-full px-3 py-2 text-xs sm:text-sm bg-white border border-slate-300 rounded-xl focus:border-[#00959C] focus:ring-1 focus:ring-[#00959C] text-[#0F2A30]"
                />
              </div>

              <div className="grid grid-cols-2 gap-2.5">
                <div>
                  <label className="block text-xs font-bold text-[#0F2A30] mb-1">
                    AICTE Permanent ID *
                  </label>
                  <input
                    type="text"
                    required
                    value={regForm.aicteId}
                    onChange={(e) => setRegForm({ ...regForm, aicteId: e.target.value })}
                    placeholder="e.g. 1-12345678"
                    className="w-full px-3 py-2 text-xs sm:text-sm bg-white border border-slate-300 rounded-xl focus:border-[#00959C] focus:ring-1 focus:ring-[#00959C] text-[#0F2A30] font-mono"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-[#0F2A30] mb-1">
                    Discipline / Category
                  </label>
                  <select
                    value={regForm.type}
                    onChange={(e) => setRegForm({ ...regForm, type: e.target.value })}
                    className="w-full px-3 py-2 text-xs sm:text-sm bg-white border border-slate-300 rounded-xl focus:border-[#00959C] text-[#0F2A30]"
                  >
                    <option value="Engineering">Engineering</option>
                    <option value="Management">Management</option>
                    <option value="Pharmacy">Pharmacy</option>
                    <option value="Polytechnic">Polytechnic</option>
                    <option value="Architecture">Architecture</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2.5">
                <div>
                  <label className="block text-xs font-bold text-[#0F2A30] mb-1">
                    City *
                  </label>
                  <input
                    type="text"
                    required
                    value={regForm.city}
                    onChange={(e) => setRegForm({ ...regForm, city: e.target.value })}
                    placeholder="e.g. Mumbai"
                    className="w-full px-3 py-2 text-xs sm:text-sm bg-white border border-slate-300 rounded-xl focus:border-[#00959C] text-[#0F2A30]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-[#0F2A30] mb-1">
                    State *
                  </label>
                  <input
                    type="text"
                    required
                    value={regForm.state}
                    onChange={(e) => setRegForm({ ...regForm, state: e.target.value })}
                    placeholder="e.g. Maharashtra"
                    className="w-full px-3 py-2 text-xs sm:text-sm bg-white border border-slate-300 rounded-xl focus:border-[#00959C] text-[#0F2A30]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2.5">
                <div>
                  <label className="block text-xs font-bold text-[#0F2A30] mb-1">
                    Nodal Officer Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={regForm.nodalOfficer}
                    onChange={(e) => setRegForm({ ...regForm, nodalOfficer: e.target.value })}
                    placeholder="e.g. Prof. R. Sharma"
                    className="w-full px-3 py-2 text-xs sm:text-sm bg-white border border-slate-300 rounded-xl focus:border-[#00959C] text-[#0F2A30]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-[#0F2A30] mb-1">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    value={regForm.phone}
                    onChange={(e) => setRegForm({ ...regForm, phone: e.target.value })}
                    placeholder="+91 9876543210"
                    className="w-full px-3 py-2 text-xs sm:text-sm bg-white border border-slate-300 rounded-xl focus:border-[#00959C] text-[#0F2A30]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#0F2A30] mb-1">
                  Nodal Officer Official Email *
                </label>
                <input
                  type="email"
                  required
                  value={regForm.email}
                  onChange={(e) => setRegForm({ ...regForm, email: e.target.value })}
                  placeholder="nodal.officer@college.edu.in"
                  className="w-full px-3 py-2 text-xs sm:text-sm bg-white border border-slate-300 rounded-xl focus:border-[#00959C] text-[#0F2A30]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#0F2A30] mb-1">
                  Account Password *
                </label>
                <input
                  type="password"
                  required
                  minLength={6}
                  value={regForm.password}
                  onChange={(e) => setRegForm({ ...regForm, password: e.target.value })}
                  placeholder="Minimum 6 characters"
                  className="w-full px-3 py-2 text-xs sm:text-sm bg-white border border-slate-300 rounded-xl focus:border-[#00959C] text-[#0F2A30]"
                />
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3 px-4 rounded-xl text-sm font-bold bg-[#006675] hover:bg-[#005562] text-white transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2 disabled:opacity-75"
              >
                {isLoading ? (
                  <>
                    <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    <span>Registering Institution...</span>
                  </>
                ) : (
                  <>
                    <span>Register &amp; Access Deposit Portal</span>
                    <Building2 className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
