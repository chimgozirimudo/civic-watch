import React, { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import {
  HiBuildingOffice2,
  HiSquares2X2,
  HiPlusCircle,
  HiShieldCheck,
  HiArrowRightOnRectangle,
  HiArrowLeftOnRectangle,
  HiUser,
  HiBars3,
  HiXMark,
  HiChevronRight,
  HiMoon,
  HiSun,
  HiCog6Tooth,
} from "react-icons/hi2";
import { useTheme } from "./ThemeProvider";

export default function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const user = JSON.parse(localStorage.getItem("user"));
  const { theme, toggleTheme } = useTheme();

  const handleLogout = () => {
    localStorage.removeItem("user");
    navigate("/login");
  };

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="sticky top-0 z-40 bg-white/95 dark:bg-slate-950/95 backdrop-blur-md border-b border-slate-200/80 dark:border-slate-800 shadow-sm">
      {/* Official Government Banner */}
      <div className="bg-slate-900 text-slate-300 py-1.5 px-6 text-[11px] font-medium flex items-center justify-center gap-2 border-b border-slate-800">
        <HiShieldCheck className="w-3.5 h-3.5 text-gov-gold" />
        <span>An official website of the Local Government Authority</span>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-3.5 flex justify-between items-center">
        {/* Brand Logo */}
        <Link to="/" className="flex items-center gap-3 group">
          <div className="w-12 h-12 flex items-center justify-center rounded-xl bg-gov-red/10 ring-1 ring-gov-red/20 group-hover:scale-105 transition-transform">
            <img
              src="/logo.png"
              alt="Official Seal"
              className="w-full h-full object-contain"
            />
          </div>
          <div className="flex flex-col">
            <span className="text-xl font-bold font-serif text-gov-red dark:text-gov-gold tracking-tight leading-none flex items-center gap-1.5">
              CivicWatch
              <span className="text-[10px] font-sans uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-gov-red/10 text-gov-red dark:bg-gov-gold/10 dark:text-gov-gold border border-gov-gold/40">
                Official
              </span>
            </span>
            <span className="text-[11px] text-slate-500 dark:text-slate-400 font-medium leading-none mt-1">
              Community Issue Reporter
            </span>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center space-x-6 text-sm font-semibold">
          <Link
            to="/"
            className={`px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1.5 ${
              isActive("/")
                ? "bg-gov-red/10 text-gov-red font-bold dark:bg-gov-gold/10 dark:text-gov-gold"
                : "text-slate-600 dark:text-slate-300 hover:text-gov-red dark:hover:text-gov-gold hover:bg-slate-50 dark:hover:bg-slate-800"
            }`}
          >
            Home
          </Link>

          {user && user.role !== "admin" && (
            <>
              <Link
                to="/dashboard"
                className={`px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1.5 ${
                  isActive("/dashboard")
                    ? "bg-gov-red/10 text-gov-red font-bold dark:bg-gov-gold/10 dark:text-gov-gold"
                    : "text-slate-600 dark:text-slate-300 hover:text-gov-red dark:hover:text-gov-gold hover:bg-slate-50 dark:hover:bg-slate-800"
                }`}
              >
                <HiSquares2X2 className="w-4 h-4" />
                Dashboard
              </Link>
              <Link
                to="/report"
                className={`px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1.5 ${
                  isActive("/report")
                    ? "bg-gov-red/10 text-gov-red font-bold dark:bg-gov-gold/10 dark:text-gov-gold"
                    : "text-slate-600 dark:text-slate-300 hover:text-gov-red dark:hover:text-gov-gold hover:bg-slate-50 dark:hover:bg-slate-800"
                }`}
              >
                <HiPlusCircle className="w-4 h-4" />
                Report Issue
              </Link>
            </>
          )}

          {user && user.role === "admin" && (
            <Link
              to="/admin"
              className={`px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1.5 ${
                isActive("/admin")
                  ? "bg-purple-100 text-purple-700 font-bold"
                  : "text-purple-700 hover:bg-purple-50"
              }`}
            >
              <HiShieldCheck className="w-4 h-4" />
              Admin Portal
            </Link>
          )}
        </div>

        {/* User Auth & Settings Section */}
        <div className="hidden md:flex items-center gap-4">
          <button
            onClick={toggleTheme}
            className="p-2 rounded-xl text-slate-500 hover:text-blue-600 hover:bg-slate-100 dark:text-slate-400 dark:hover:text-blue-400 dark:hover:bg-slate-800 transition-colors"
            title="Toggle Theme"
          >
            {theme === "light" ? (
              <HiMoon className="w-5 h-5" />
            ) : (
              <HiSun className="w-5 h-5" />
            )}
          </button>

          {user ? (
            <div className="flex items-center gap-3 pl-4 border-l border-slate-200 dark:border-slate-700">
              <div className="flex items-center gap-2 bg-slate-100/80 dark:bg-slate-800/80 px-3 py-1.5 rounded-xl border border-slate-200/80 dark:border-slate-700/80 text-xs font-semibold text-slate-700 dark:text-slate-300">
                <div className="w-6 h-6 rounded-full bg-blue-600 dark:bg-blue-500 text-white flex items-center justify-center text-[10px] font-bold uppercase">
                  {user.name ? user.name.charAt(0) : "U"}
                </div>
                <span>{user.name || "User"}</span>
                <span
                  className={`text-[10px] uppercase tracking-wider px-1.5 py-0.5 rounded font-bold ${
                    user.role === "admin"
                      ? "bg-purple-100 text-purple-700 dark:bg-purple-900/40 dark:text-purple-300"
                      : "bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300"
                  }`}
                >
                  {user.role}
                </span>
              </div>

              <Link
                to="/settings"
                className="p-2 rounded-xl text-slate-500 hover:text-blue-600 hover:bg-blue-50 dark:text-slate-400 dark:hover:text-blue-400 dark:hover:bg-slate-800 transition-colors"
                title="Settings"
              >
                <HiCog6Tooth className="w-5 h-5" />
              </Link>

              <button
                onClick={handleLogout}
                className="p-2 rounded-xl text-slate-500 hover:text-red-600 hover:bg-red-50 dark:text-slate-400 dark:hover:text-red-400 dark:hover:bg-red-900/30 transition-colors"
                title="Logout"
              >
                <HiArrowRightOnRectangle className="w-5 h-5" />
              </button>
            </div>
          ) : (
            <Link
              to="/login"
              className="inline-flex items-center gap-2 text-xs font-semibold px-4 py-2.5 rounded-xl bg-gov-red text-white hover:bg-gov-red-hover transition-all shadow-sm hover:shadow-md shadow-gov-red/20 dark:bg-gov-gold dark:text-slate-900 dark:hover:bg-gov-gold-hover"
            >
              <HiArrowLeftOnRectangle className="w-4 h-4" />
              Sign In
            </Link>
          )}
        </div>

        {/* Mobile Hamburger Button */}
        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="md:hidden p-2 rounded-lg text-slate-700 hover:bg-slate-100 transition-colors"
          aria-label="Toggle Navigation"
        >
          {isMobileMenuOpen ? (
            <HiXMark className="w-6 h-6" />
          ) : (
            <HiBars3 className="w-6 h-6" />
          )}
        </button>
      </div>

      {/* Mobile Menu Dropdown */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-white border-b border-slate-200 p-6 flex flex-col space-y-3 animate-in fade-in slide-in-from-top-2">
          <Link
            to="/"
            onClick={() => setIsMobileMenuOpen(false)}
            className="text-slate-700 font-semibold py-2 px-3 rounded-lg hover:bg-slate-100 flex items-center justify-between"
          >
            <span>Home</span>
            <HiChevronRight className="w-4 h-4 text-slate-400" />
          </Link>

          {user && user.role !== "admin" && (
            <>
              <Link
                to="/dashboard"
                onClick={() => setIsMobileMenuOpen(false)}
                className="text-slate-700 font-semibold py-2 px-3 rounded-lg hover:bg-slate-100 flex items-center justify-between"
              >
                <span>Dashboard</span>
                <HiChevronRight className="w-4 h-4 text-slate-400" />
              </Link>
              <Link
                to="/report"
                onClick={() => setIsMobileMenuOpen(false)}
                className="text-slate-700 font-semibold py-2 px-3 rounded-lg hover:bg-slate-100 flex items-center justify-between"
              >
                <span>Report Issue</span>
                <HiChevronRight className="w-4 h-4 text-slate-400" />
              </Link>
            </>
          )}

          {user && user.role === "admin" && (
            <Link
              to="/admin"
              onClick={() => setIsMobileMenuOpen(false)}
              className="text-purple-700 font-semibold py-2 px-3 rounded-lg bg-purple-50 flex items-center justify-between"
            >
              <span>Admin Portal</span>
              <HiChevronRight className="w-4 h-4 text-purple-400" />
            </Link>
          )}

          <div className="pt-3 border-t border-slate-100 flex flex-col gap-2">
            {user ? (
              <button
                onClick={() => {
                  setIsMobileMenuOpen(false);
                  handleLogout();
                }}
                className="w-full text-center py-2.5 rounded-xl bg-red-50 text-red-600 font-semibold text-xs flex items-center justify-center gap-2"
              >
                <HiArrowRightOnRectangle className="w-4 h-4" />
                Sign Out ({user.name})
              </button>
            ) : (
              <Link
                to="/login"
                onClick={() => setIsMobileMenuOpen(false)}
                className="w-full text-center py-2.5 rounded-xl bg-blue-600 text-white font-semibold text-xs flex items-center justify-center gap-2"
              >
                <HiArrowLeftOnRectangle className="w-4 h-4" />
                Sign In
              </Link>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
