import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useTheme } from "../components/ThemeProvider";
import {
  HiBuildingOffice2,
  HiExclamationTriangle,
  HiShieldCheck,
  HiMapPin,
  HiCheckCircle,
  HiClock,
  HiArrowRight,
  HiSparkles,
  HiUsers,
  HiDocumentText,
  HiChevronRight,
  HiBars3,
  HiXMark,
  HiPlusCircle,
  HiMagnifyingGlass,
  HiLockClosed,
  HiArrowPath,
  HiSignal,
  HiMoon,
  HiSun,
} from "react-icons/hi2";
import {
  FaRoad,
  FaLightbulb,
  FaTrashCan,
  FaDroplet,
  FaTree,
  FaClipboardList,
  FaHourglassHalf,
  FaWrench,
  FaCircleCheck,
  FaChartLine,
} from "react-icons/fa6";

export default function Landing() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [reports, setReports] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();
  const { theme, toggleTheme } = useTheme();

  const fetchRecentReports = async () => {
    try {
      const response = await fetch("http://localhost:5000/reports");
      const data = await response.json();
      if (response.ok && data.reports) {
        const sortedReports = [...data.reports].sort((a, b) => b.id - a.id);
        setReports(sortedReports.slice(0, 3));
      }
    } catch (err) {
      console.error("Error fetching reports:", err);
    }
  };

  useEffect(() => {
    fetchRecentReports();
  }, []);

  const handleReportClick = () => {
    const user = localStorage.getItem("user");
    if (user) {
      navigate("/report");
    } else {
      navigate("/login");
    }
  };

  const handleDashboardAccess = (destination = "/dashboard") => {
    const user = localStorage.getItem("user");
    if (user) {
      navigate(destination);
    } else {
      navigate("/login", { state: { from: destination } });
    }
  };

  const getStatusBadgeColor = (status) => {
    switch (status) {
      case "Resolved":
        return "bg-emerald-100 text-emerald-800 border border-emerald-200";
      case "In Progress":
        return "bg-blue-100 text-blue-800 border border-blue-200";
      default:
        return "bg-amber-100 text-amber-800 border border-amber-200";
    }
  };

  const getPriorityBadgeColor = (priority) => {
    switch (priority) {
      case "Urgent":
        return "bg-rose-100 text-rose-800 border border-rose-200";
      case "High":
        return "bg-orange-100 text-orange-800 border border-orange-200";
      case "Low":
        return "bg-slate-100 text-slate-700 border border-slate-200";
      default:
        return "bg-indigo-100 text-indigo-800 border border-indigo-200";
    }
  };

  const categories = [
    {
      name: "Roads & Potholes",
      icon: FaRoad,
      color: "text-amber-500 bg-amber-50",
      desc: "Damaged asphalt, missing signs & street hazards",
      count: "120+ Fixed",
    },
    {
      name: "Street Lighting",
      icon: FaLightbulb,
      color: "text-yellow-500 bg-yellow-50",
      desc: "Outages, flickering lights & electrical faults",
      count: "85+ Repaired",
    },
    {
      name: "Sanitation & Waste",
      icon: FaTrashCan,
      color: "text-emerald-500 bg-emerald-50",
      desc: "Illegal dumping, uncollected trash & overflow",
      count: "210+ Cleaned",
    },
    {
      name: "Water & Sewage",
      icon: FaDroplet,
      color: "text-blue-500 bg-blue-50",
      desc: "Pipe leaks, drainage blockage & water quality",
      count: "95+ Resolved",
    },
    {
      name: "Parks & Public Spaces",
      icon: FaTree,
      color: "text-green-500 bg-green-50",
      desc: "Damaged benches, playground equipment & maintenance",
      count: "60+ Maintained",
    },
  ];

  const navItems = [
    "Overview",
    "Features",
    "How It Works",
    "Reports",
    "Impact",
  ];

  const stats = [
    {
      label: "Reports Resolved",
      value: "2,400+",
      icon: HiCheckCircle,
      color: "text-emerald-500",
    },
    {
      label: "Response Rate",
      value: "98%",
      icon: HiArrowPath,
      color: "text-blue-500",
    },
    {
      label: "Active Citizens",
      value: "15,000+",
      icon: HiUsers,
      color: "text-indigo-500",
    },
    {
      label: "Avg Resolution Time",
      value: "< 48 Hours",
      icon: HiClock,
      color: "text-amber-500",
    },
  ];

  return (
    <div className="landing-page bg-[#fff8ed] dark:bg-[#111827] min-h-screen font-sans text-slate-800 dark:text-slate-100 selection:bg-gov-red selection:text-white">
      {/* Official Government Banner */}
      <div className="bg-slate-900 text-slate-300 py-1.5 px-6 text-[11px] font-medium flex items-center justify-center gap-2 border-b border-slate-800">
        <HiShieldCheck className="w-3.5 h-3.5 text-blue-400" />
        <span>An official website of the Local Government Authority</span>
      </div>

      {/* Navigation Header */}
      <header className="sticky top-0 z-40 bg-white/95 dark:bg-slate-950/95 backdrop-blur-md border-b border-orange-200/80 dark:border-slate-800">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
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

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center space-x-8">
            {navItems.map((item) => (
              <a
                key={item}
                href={`#${item.toLowerCase().replace(/\s+/g, "-")}`}
                className="text-slate-600 hover:text-blue-600 font-medium text-sm transition-colors relative py-1 group"
              >
                {item}
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-blue-600 transition-all duration-300 group-hover:w-full"></span>
              </a>
            ))}
          </nav>

          {/* Action Buttons */}
          <div className="flex items-center gap-3">
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
            <button
              onClick={handleReportClick}
              className="hidden sm:inline-flex items-center gap-2 text-xs font-semibold px-4 py-2.5 rounded-lg bg-gov-red text-white hover:bg-gov-red-hover transition-colors"
            >
              <HiPlusCircle className="w-4 h-4" />
              Report Issue
            </button>
            <Link
              to="/login"
              className="inline-flex items-center gap-1.5 text-xs font-semibold px-4 py-2.5 rounded-lg border border-slate-300 text-slate-700 bg-white hover:bg-slate-50 transition-colors"
            >
              Sign In
            </Link>

            {/* Mobile Hamburger */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden p-2 rounded-lg text-slate-700 hover:bg-slate-100 transition-colors"
              aria-label="Toggle menu"
            >
              {isMobileMenuOpen ? (
                <HiXMark className="w-6 h-6" />
              ) : (
                <HiBars3 className="w-6 h-6" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Dropdown */}
        {isMobileMenuOpen && (
          <div className="md:hidden bg-white border-b border-slate-200 p-6 flex flex-col space-y-3 animate-in fade-in slide-in-from-top-2">
            {navItems.map((item) => (
              <a
                key={item}
                href={`#${item.toLowerCase().replace(/\s+/g, "-")}`}
                onClick={() => setIsMobileMenuOpen(false)}
                className="text-slate-700 font-medium py-2 px-3 rounded-lg hover:bg-slate-100 flex items-center justify-between"
              >
                <span>{item}</span>
                <HiChevronRight className="w-4 h-4 text-slate-400" />
              </a>
            ))}
            <div className="pt-3 border-t border-slate-100 flex flex-col gap-2">
              <button
                onClick={() => {
                  setIsMobileMenuOpen(false);
                  handleReportClick();
                }}
                className="w-full text-center py-2.5 rounded-lg bg-blue-600 text-white font-semibold text-xs"
              >
                Report an Issue
              </button>
            </div>
          </div>
        )}
      </header>

      {/* Hero Section */}
      <section
        id="overview"
        className="relative pt-12 pb-20 md:pt-20 md:pb-28 overflow-hidden bg-[#fff8ed] dark:bg-[#111827]"
      >
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="text-center max-w-3xl mx-auto flex flex-col items-center">
            {/* Pill Tag */}
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-orange-100/80 border border-orange-200/80 text-gov-red text-xs font-semibold mb-6">
              <HiSparkles className="w-4 h-4 text-blue-600" />
              <span>Civic Action Platform</span>
            </div>

            {/* Headline */}
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-slate-900 dark:text-white tracking-tight leading-[1.15]">
              Report Civic Issues.{" "}
              <span className="text-gov-red dark:text-gov-gold">
                Transform Communities.
              </span>
            </h1>

            {/* Subtitle */}
            <p className="text-base sm:text-lg md:text-xl text-slate-600 mt-6 font-normal leading-relaxed max-w-2xl">
              CivicWatch connects citizens directly with municipal response
              teams to quickly report potholes, broken streetlights, water
              leaks, and public hazards—ensuring faster resolution and
              transparent tracking.
            </p>

            {/* CTA Buttons */}
            <div className="mt-8 flex flex-col sm:flex-row items-center gap-4 w-full justify-center sm:w-auto">
              <button
                onClick={handleReportClick}
                className="w-full sm:w-auto px-7 py-3.5 rounded-xl bg-gov-red hover:bg-gov-red-hover text-white font-semibold transition-colors flex items-center justify-center gap-2"
              >
                <HiExclamationTriangle className="w-5 h-5" />
                <span>Report an Issue Now</span>
              </button>

              <button
                onClick={() => handleDashboardAccess("/dashboard")}
                className="w-full sm:w-auto px-7 py-3.5 rounded-xl bg-white dark:bg-slate-900 hover:bg-orange-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 font-semibold border border-orange-200 dark:border-slate-700 transition-colors flex items-center justify-center gap-2"
              >
                <HiMagnifyingGlass className="w-4 h-4 text-slate-500" />
                <span>View Community Reports</span>
              </button>
            </div>

            {/* Quick Search / Interactive Bar */}
            <div className="mt-10 w-full max-w-xl bg-white dark:bg-slate-900 p-2 sm:p-3 rounded-2xl border border-orange-200 dark:border-slate-700 flex items-center gap-2">
              <div className="flex-1 flex items-center gap-2 px-3">
                <HiMapPin className="w-5 h-5 text-blue-600 shrink-0" />
                <input
                  type="text"
                  placeholder="Enter location or issue keyword (e.g. Main St, Pothole)"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-transparent text-sm text-slate-800 focus:outline-none placeholder-slate-400 font-medium"
                />
              </div>
              <button
                onClick={() =>
                  handleDashboardAccess(
                    `/dashboard?search=${encodeURIComponent(searchQuery)}`,
                  )
                }
                className="px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold transition-colors flex items-center gap-1.5 shrink-0"
              >
                <span>Search</span>
                <HiArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Key Metrics Stats Grid */}
          <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
            {stats.map((stat, idx) => {
              const IconComp = stat.icon;
              return (
                <div
                  key={idx}
                  className="bg-white/70 dark:bg-slate-900/70 p-5 rounded-2xl border border-orange-200/80 dark:border-slate-700 flex flex-col items-center text-center"
                >
                  <IconComp className={`w-6 h-6 mb-2 ${stat.color}`} />
                  <span className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                    {stat.value}
                  </span>
                  <span className="text-xs font-medium text-slate-500 mt-1">
                    {stat.label}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Categories & Common Issues */}
      <section className="py-16 px-6 max-w-7xl mx-auto">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="text-xs font-bold text-blue-600 uppercase tracking-widest bg-blue-50 px-3 py-1 rounded-full border border-blue-100">
            Issue Categories
          </span>
          <h2 className="text-3xl font-bold text-slate-900 mt-3 tracking-tight">
            What Issues Can You Report?
          </h2>
          <p className="text-slate-600 mt-2 text-sm">
            Select a category to report broken infrastructure or view localized
            community progress.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
          {categories.map((cat, idx) => {
            const IconComp = cat.icon;
            return (
              <div
                key={idx}
                className="bg-white/70 dark:bg-slate-900/70 p-6 rounded-2xl border border-orange-200/80 dark:border-slate-700 hover:border-gov-red transition-colors flex flex-col justify-between group"
              >
                <div>
                  <div
                    className={`w-12 h-12 rounded-xl ${cat.color} flex items-center justify-center text-xl mb-4 group-hover:scale-110 transition-transform`}
                  >
                    <IconComp />
                  </div>
                  <h3 className="font-bold text-slate-900 text-base mb-1">
                    {cat.name}
                  </h3>
                  <p className="text-xs text-slate-500 leading-relaxed mb-4">
                    {cat.desc}
                  </p>
                </div>
                <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                  <span className="text-[11px] font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md">
                    {cat.count}
                  </span>
                  <button
                    onClick={handleReportClick}
                    className="text-xs font-semibold text-blue-600 hover:text-blue-700 flex items-center gap-1"
                  >
                    Report &rarr;
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* How It Works */}
      <section
        id="how-it-works"
        className="py-16 bg-white/50 dark:bg-slate-900/50 border-y border-orange-200/80 dark:border-slate-800"
      >
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <span className="text-xs font-bold text-blue-600 uppercase tracking-widest bg-blue-50 px-3 py-1 rounded-full border border-blue-100">
              Simple 3-Step Process
            </span>
            <h2 className="text-3xl font-bold text-slate-900 mt-3 tracking-tight">
              How CivicWatch Works
            </h2>
            <p className="text-slate-600 mt-2 text-sm">
              Empowering citizens to report issues in under 60 seconds with
              total status transparency.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
            {/* Step 1 */}
            <div className="bg-slate-50 p-8 rounded-2xl border border-slate-200 relative flex flex-col items-center text-center">
              <div className="w-12 h-12 rounded-full bg-gov-red text-white font-bold text-lg flex items-center justify-center mb-5">
                1
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">
                Snap & Detail
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Notice a broken streetlight or hazardous pothole? Take a photo,
                enter the location, and add a brief description.
              </p>
            </div>

            {/* Step 2 */}
            <div className="bg-slate-50 p-8 rounded-2xl border border-slate-200 relative flex flex-col items-center text-center">
              <div className="w-12 h-12 rounded-full bg-gov-red text-white font-bold text-lg flex items-center justify-center mb-5">
                2
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">
                Direct Dispatch
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Your report is automatically logged and routed to municipal
                authority admins for immediate verification and triage.
              </p>
            </div>

            {/* Step 3 */}
            <div className="bg-slate-50 p-8 rounded-2xl border border-slate-200 relative flex flex-col items-center text-center">
              <div className="w-12 h-12 rounded-full bg-gov-red text-white font-bold text-lg flex items-center justify-center mb-5">
                3
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">
                Track & Resolve
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Follow real-time status updates (Pending → In Progress →
                Resolved) right on your citizen dashboard.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Live Recent Reports */}
      <section id="reports" className="py-16 px-6 max-w-7xl mx-auto">
        <div className="bg-white/70 dark:bg-slate-900/70 rounded-3xl p-8 md:p-10 border border-orange-200/80 dark:border-slate-700">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
            <div>
              <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">
                Real-Time Activity
              </span>
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 mt-1">
                Recent Community Reports
              </h2>
            </div>
            <Link
              to="/dashboard"
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-blue-600 hover:text-blue-700 bg-blue-50 hover:bg-blue-100 px-4 py-2 rounded-xl transition-colors"
            >
              <span>View Full Operations Dashboard</span>
              <HiChevronRight className="w-4 h-4" />
            </Link>
          </div>

          {reports.length === 0 ? (
            <div className="text-center py-12 bg-slate-50 rounded-2xl border border-dashed border-slate-300">
              <HiBuildingOffice2 className="w-10 h-10 text-slate-400 mx-auto mb-3" />
              <p className="text-slate-600 font-medium text-sm">
                No community reports submitted yet.
              </p>
              <button
                onClick={handleReportClick}
                className="mt-4 px-5 py-2.5 rounded-xl bg-gov-red text-white text-xs font-semibold hover:bg-gov-red-hover transition-colors"
              >
                Submit First Report
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {reports.map((report) => (
                <div
                  key={report.id}
                  className="border border-orange-200 dark:border-slate-700 rounded-2xl p-5 flex flex-col justify-between hover:border-gov-red transition-colors duration-200 bg-white/70 dark:bg-slate-900/70 group"
                >
                  <div>
                    <div className="flex items-center justify-between mb-3 gap-2">
                      <h3 className="font-bold text-base text-slate-900 truncate">
                        {report.title}
                      </h3>
                      <span
                        className={`px-2.5 py-1 text-[11px] font-bold rounded-full whitespace-nowrap ${getStatusBadgeColor(report.status)}`}
                      >
                        {report.status || "Pending"}
                      </span>
                    </div>

                    <p className="text-xs text-slate-500 mb-3 flex items-center gap-1.5">
                      <HiMapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span className="truncate">{report.location}</span>
                    </p>

                    <div className="flex flex-wrap items-center gap-2 mb-3">
                      <span
                        className={`inline-flex items-center gap-1.5 px-2.5 py-1 text-[11px] font-bold rounded-full ${getPriorityBadgeColor(report.priority)}`}
                      >
                        <HiSignal className="w-3 h-3" />
                        {report.priority || "Medium"}
                      </span>
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 text-[11px] font-bold rounded-full border border-slate-200 bg-slate-50 text-slate-700">
                        <HiUsers className="w-3 h-3" />
                        {report.support_count || 0} supported
                      </span>
                    </div>

                    <p className="text-slate-600 text-xs mb-4 line-clamp-3 leading-relaxed">
                      {report.description}
                    </p>
                  </div>

                  {report.image && (
                    <div className="mt-auto pt-3 border-t border-slate-100">
                      <img
                        src={report.image}
                        alt={report.title}
                        className="w-full h-36 object-cover rounded-xl border border-slate-200"
                        onError={(e) => {
                          e.target.style.display = "none";
                        }}
                      />
                    </div>
                  )}

                  <Link
                    to={`/reports/${report.id}`}
                    className="mt-4 inline-flex items-center justify-center px-4 py-2.5 rounded-xl bg-slate-900 text-white text-xs font-semibold hover:bg-blue-600 transition-colors"
                  >
                    View Details
                  </Link>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Impact & Trust Banner */}
      <section id="impact" className="py-16 px-6 max-w-7xl mx-auto">
        <div className="bg-slate-900 text-white rounded-3xl p-8 sm:p-12 relative overflow-hidden">
          <div className="relative z-10 max-w-2xl">
            <span className="text-xs font-bold uppercase tracking-widest text-blue-400 bg-blue-900/60 px-3 py-1 rounded-full border border-blue-700/50">
              Municipal Transparency
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold mt-4 tracking-tight">
              Building Safer & Cleaner Neighborhoods Together
            </h2>
            <p className="text-slate-300 mt-4 text-sm leading-relaxed">
              CivicWatch bridges the communication gap between everyday citizens
              and municipal maintenance departments. Every report filed helps
              prioritize city budgets and improve public infrastructure.
            </p>
            <div className="mt-8 flex flex-wrap gap-4">
              <button
                onClick={handleReportClick}
                className="px-6 py-3 rounded-xl bg-gov-gold hover:bg-gov-gold-hover text-slate-900 font-semibold text-xs transition-colors"
              >
                File a Civic Report
              </button>
              <Link
                to="/register"
                className="px-6 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-xs border border-slate-700 transition-colors"
              >
                Create Citizen Account
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 text-slate-400 py-12 px-6 border-t border-slate-800 mt-12">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gov-red/10 ring-1 ring-gov-gold/30 flex items-center justify-center">
              <img
                src="/logo.png"
                alt="CivicWatch logo"
                className="w-full h-full object-contain"
              />
            </div>
            <span className="text-xl font-bold text-gov-gold tracking-tight">
              CivicWatch
            </span>
          </div>
          <p className="text-xs text-slate-400 text-center md:text-left">
            &copy; 2026 CivicWatch Public Community System. All rights reserved.
          </p>
          <div className="flex items-center gap-6 text-xs font-medium text-slate-400">
            <button
              type="button"
              onClick={() => handleDashboardAccess("/dashboard")}
              className="hover:text-white transition-colors"
            >
              Dashboard
            </button>
            <button
              type="button"
              onClick={handleReportClick}
              className="hover:text-white transition-colors"
            >
              Report Issue
            </button>
            <Link to="/login" className="hover:text-white transition-colors">
              Sign In
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
