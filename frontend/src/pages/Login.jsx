import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { 
  HiBuildingOffice2, 
  HiEnvelope, 
  HiLockClosed, 
  HiUser, 
  HiShieldCheck, 
  HiArrowRight, 
  HiEye, 
  HiEyeSlash, 
  HiSparkles,
  HiCheckCircle,
  HiExclamationTriangle
} from "react-icons/hi2";
import { FaSpinner } from "react-icons/fa6";

export default function Login() {
  const [isRegistering, setIsRegistering] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("citizen");
  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const navigate = useNavigate();

  const handleDemoFill = (type) => {
    setMessage("");
    setErrorMsg("");
    if (type === "citizen") {
      setIsRegistering(false);
      setEmail("citizen@civicwatch.org");
      setPassword("citizen123");
    } else {
      setIsRegistering(false);
      setEmail("admin@civicwatch.org");
      setPassword("admin123");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setErrorMsg("");
    setSubmitting(true);

    const endpoint = isRegistering
      ? "http://localhost:5000/register"
      : "http://localhost:5000/login";
    const payload = isRegistering
      ? { name, email, password, role }
      : { email, password };

    try {
      const response = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (response.ok) {
        if (isRegistering) {
          setMessage("Registration successful! You can now log in below.");
          setIsRegistering(false);
        } else {
          // Store user session in localStorage
          localStorage.setItem("user", JSON.stringify(data.user));

          // Route according to user role
          if (data.user.role === "admin") {
            navigate("/admin");
          } else {
            navigate("/dashboard");
          }
        }
      } else {
        setErrorMsg(data.error || "Authentication failed. Check credentials.");
      }
    } catch (err) {
      console.error("Auth error:", err);
      setErrorMsg("Failed to connect to backend server.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans flex items-center justify-center p-6">
      
      <div className="max-w-md w-full">
        
        {/* Brand Header */}
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-3 group mb-3">
            <div className="w-12 h-12 rounded-2xl bg-blue-600 text-white flex items-center justify-center shadow-lg shadow-blue-500/25 group-hover:scale-105 transition-transform">
              <HiBuildingOffice2 className="w-6 h-6" />
            </div>
          </Link>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
            {isRegistering ? "Create Your CivicWatch Account" : "Welcome Back to CivicWatch"}
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            {isRegistering
              ? "Join your community to report infrastructure issues and track progress"
              : "Sign in to access your citizen dashboard or admin management portal"}
          </p>
        </div>

        {/* Auth Card */}
        <div className="bg-white p-8 rounded-3xl shadow-xl shadow-slate-200/50 border border-slate-200">
          
          {/* Sign In / Register Tab Switcher */}
          <div className="grid grid-cols-2 p-1 bg-slate-100 rounded-2xl mb-6 text-xs font-semibold">
            <button
              type="button"
              onClick={() => { setIsRegistering(false); setMessage(""); setErrorMsg(""); }}
              className={`py-2 rounded-xl transition-all ${
                !isRegistering ? "bg-white text-slate-900 shadow-xs" : "text-slate-500 hover:text-slate-900"
              }`}
            >
              Sign In
            </button>
            <button
              type="button"
              onClick={() => { setIsRegistering(true); setMessage(""); setErrorMsg(""); }}
              className={`py-2 rounded-xl transition-all ${
                isRegistering ? "bg-white text-slate-900 shadow-xs" : "text-slate-500 hover:text-slate-900"
              }`}
            >
              Create Account
            </button>
          </div>

          {/* Quick Demo Fill Buttons */}
          <div className="mb-6 bg-blue-50/70 p-3 rounded-2xl border border-blue-100">
            <span className="text-[10px] font-bold text-blue-700 uppercase tracking-wider mb-1.5 flex items-center gap-1">
              <HiSparkles className="w-3 h-3 text-blue-600" />
              <span>Fast Testing Shortcuts</span>
            </span>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => handleDemoFill("citizen")}
                className="flex-1 py-1.5 px-2 bg-white hover:bg-blue-600 hover:text-white text-slate-700 text-[11px] font-semibold rounded-xl border border-slate-200 transition-colors shadow-2xs"
              >
                Demo Citizen
              </button>
              <button
                type="button"
                onClick={() => handleDemoFill("admin")}
                className="flex-1 py-1.5 px-2 bg-white hover:bg-purple-600 hover:text-white text-slate-700 text-[11px] font-semibold rounded-xl border border-slate-200 transition-colors shadow-2xs"
              >
                Demo Admin
              </button>
            </div>
          </div>

          {/* Success Banner */}
          {message && (
            <div className="mb-5 p-3.5 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-xs font-semibold flex items-center gap-2 animate-in fade-in">
              <HiCheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>{message}</span>
            </div>
          )}

          {/* Error Banner */}
          {errorMsg && (
            <div className="mb-5 p-3.5 bg-rose-50 border border-rose-200 text-rose-800 rounded-xl text-xs font-semibold flex items-center gap-2 animate-in fade-in">
              <HiExclamationTriangle className="w-4 h-4 text-rose-600 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            
            {/* Name Field (if registering) */}
            {isRegistering && (
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Full Name</label>
                <div className="relative">
                  <HiUser className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Chimgozirim Okeke"
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-800 focus:outline-none focus:border-blue-500 focus:bg-white transition-all"
                    required
                  />
                </div>
              </div>
            )}

            {/* Email Field */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Email Address</label>
              <div className="relative">
                <HiEnvelope className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="user@example.com"
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-800 focus:outline-none focus:border-blue-500 focus:bg-white transition-all"
                  required
                />
              </div>
            </div>

            {/* Password Field */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Password</label>
              <div className="relative">
                <HiLockClosed className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-10 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-800 focus:outline-none focus:border-blue-500 focus:bg-white transition-all"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                >
                  {showPassword ? <HiEyeSlash className="w-4 h-4" /> : <HiEye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Account Role Selector (if registering) */}
            {isRegistering && (
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Account Role</label>
                <div className="relative">
                  <HiShieldCheck className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <select
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-800 focus:outline-none focus:border-blue-500 focus:bg-white transition-all appearance-none"
                  >
                    <option value="citizen">Citizen (Report & Track Issues)</option>
                    <option value="admin">Administrator (Manage City Reports)</option>
                  </select>
                </div>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={submitting}
              className="w-full py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs shadow-lg shadow-blue-500/25 transition-all flex items-center justify-center gap-2 disabled:opacity-75"
            >
              {submitting ? (
                <>
                  <FaSpinner className="w-4 h-4 animate-spin" />
                  <span>Processing...</span>
                </>
              ) : (
                <>
                  <span>{isRegistering ? "Create Account" : "Sign In to CivicWatch"}</span>
                  <HiArrowRight className="w-4 h-4" />
                </>
              )}
            </button>

          </form>

        </div>

        {/* Footer Link */}
        <p className="text-center text-xs text-slate-500 mt-6">
          Need assistance? <Link to="/" className="text-blue-600 hover:underline font-medium">Return to Home Page</Link>
        </p>

      </div>

    </div>
  );
}