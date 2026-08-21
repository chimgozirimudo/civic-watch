import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { supabase } from "../supabaseClient"; // 👈 Make sure this path points to your supabaseClient file
import { 
  HiShieldCheck, 
  HiMagnifyingGlass, 
  HiArrowPath, 
  HiXMark, 
  HiMapPin,
  HiSignal,
  HiUsers
} from "react-icons/hi2";
import { 
  FaClipboardList, 
  FaHourglassHalf, 
  FaWrench, 
  FaCircleCheck, 
  FaTrashCan 
} from "react-icons/fa6";

export default function AdminDashboard() {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("All");
  const [selectedImage, setSelectedImage] = useState(null);
  const [statusMessage, setStatusMessage] = useState("");

  const fetchReports = async () => {
    setLoading(true);
    try {
      // Query directly from Supabase 'reports' table
      const { data, error } = await supabase
        .from('reports')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      if (data) {
        setReports(data);
      }
    } catch (err) {
      console.error("Error fetching reports from Supabase:", err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReports();
  }, []);

  const handleStatusChange = async (id, newStatus) => {
    try {
      const { error } = await supabase
        .from('reports')
        .update({ status: newStatus })
        .eq('id', id);

      if (error) throw error;

      setStatusMessage(`Report #${id} status updated to ${newStatus}`);
      setTimeout(() => setStatusMessage(""), 3000);
      fetchReports();
    } catch (err) {
      console.error("Error updating status:", err.message);
    }
  };

  const handlePriorityChange = async (id, newPriority) => {
    try {
      const { error } = await supabase
        .from('reports')
        .update({ priority: newPriority })
        .eq('id', id);

      if (error) throw error;

      setStatusMessage(`Report #${id} priority updated to ${newPriority}`);
      setTimeout(() => setStatusMessage(""), 3000);
      fetchReports();
    } catch (err) {
      console.error("Error updating priority:", err.message);
    }
  };

  const handleDeleteReport = async (id) => {
    if (!window.confirm(`Are you sure you want to delete Report #${id}?`)) return;

    try {
      const { error } = await supabase
        .from('reports')
        .delete()
        .eq('id', id);

      if (error) throw error;

      setStatusMessage(`Report #${id} deleted successfully.`);
      setTimeout(() => setStatusMessage(""), 3000);
      fetchReports();
    } catch (err) {
      console.error("Error deleting report:", err.message);
    }
  };

  // Metrics
  const totalReports = reports.length;
  const pendingCount = reports.filter((r) => r.status === "Pending").length;
  const inProgressCount = reports.filter((r) => r.status === "In Progress").length;
  const resolvedCount = reports.filter((r) => r.status === "Resolved").length;

  const getStatusBadgeColor = (status) => {
    switch (status) {
      case "Resolved":
        return "bg-emerald-100 text-emerald-800 border-emerald-200";
      case "In Progress":
        return "bg-blue-100 text-blue-800 border-blue-200";
      default:
        return "bg-amber-100 text-amber-800 border-amber-200";
    }
  };

  const getPriorityBadgeColor = (priority) => {
    switch (priority) {
      case "Urgent":
        return "bg-rose-100 text-rose-800 border-rose-200";
      case "High":
        return "bg-orange-100 text-orange-800 border-orange-200";
      case "Low":
        return "bg-slate-100 text-slate-700 border-slate-200";
      default:
        return "bg-indigo-100 text-indigo-800 border-indigo-200";
    }
  };

  const filteredReports = reports.filter((report) => {
    const matchesStatus = selectedStatus === "All" || report.status === selectedStatus;
    const matchesSearch =
      searchQuery === "" ||
      report.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      report.location?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      report.description?.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-slate-50 font-sans pb-16">

      {/* Header Banner */}
      <div className="bg-purple-950 text-white border-b border-purple-900 py-10 px-6">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div>
            <div className="inline-flex items-center gap-2 text-xs font-bold text-purple-300 bg-purple-900/60 px-3 py-1 rounded-full border border-purple-700/50 mb-3">
              <HiShieldCheck className="w-3.5 h-3.5 text-purple-400" />
              <span>Municipal Operations Management</span>
            </div>
            <h1 className="text-3xl font-extrabold text-white tracking-tight">Admin Control Center</h1>
            <p className="text-purple-200/80 text-sm mt-1 max-w-xl">
              Verify submitted issues, assign response teams, update statuses, and oversee city infrastructure maintenance.
            </p>
          </div>

          <button
            onClick={fetchReports}
            className="px-4 py-2.5 rounded-xl bg-purple-900/80 hover:bg-purple-800 text-white text-xs font-semibold border border-purple-700 transition-all flex items-center gap-2 shrink-0"
          >
            <HiArrowPath className={`w-3.5 h-3.5 ${loading ? "animate-spin" : ""}`} />
            <span>Sync Live Reports</span>
          </button>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 -mt-6">

        {/* Status Toast Alert */}
        {statusMessage && (
          <div className="mb-6 p-4 bg-purple-100 border border-purple-200 text-purple-900 rounded-2xl text-xs font-semibold flex items-center justify-between shadow-sm">
            <span className="flex items-center gap-2">
              <HiShieldCheck className="w-4 h-4 text-purple-600" />
              {statusMessage}
            </span>
            <button onClick={() => setStatusMessage("")} className="text-purple-700 hover:text-purple-900">
              <HiXMark className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Overview Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
            <div>
              <p className="text-xs font-medium text-slate-500">Total System Reports</p>
              <h3 className="text-2xl font-extrabold text-slate-900 mt-1">{totalReports}</h3>
            </div>
            <div className="w-10 h-10 rounded-xl bg-slate-100 text-slate-700 flex items-center justify-center font-bold text-lg">
              <FaClipboardList />
            </div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
            <div>
              <p className="text-xs font-medium text-slate-500">Pending Triage</p>
              <h3 className="text-2xl font-extrabold text-amber-600 mt-1">{pendingCount}</h3>
            </div>
            <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center font-bold text-lg">
              <FaHourglassHalf />
            </div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
            <div>
              <p className="text-xs font-medium text-slate-500">In Progress</p>
              <h3 className="text-2xl font-extrabold text-blue-600 mt-1">{inProgressCount}</h3>
            </div>
            <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold text-lg">
              <FaWrench />
            </div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
            <div>
              <p className="text-xs font-medium text-slate-500">Resolved</p>
              <h3 className="text-2xl font-extrabold text-emerald-600 mt-1">{resolvedCount}</h3>
            </div>
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold text-lg">
              <FaCircleCheck />
            </div>
          </div>
        </div>

        {/* Filter Controls Bar */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm mb-6 flex flex-col md:flex-row items-center justify-between gap-4">

          {/* Tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto w-full md:w-auto pb-1 md:pb-0">
            {["All", "Pending", "In Progress", "Resolved"].map((tab) => (
              <button
                key={tab}
                onClick={() => setSelectedStatus(tab)}
                className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all whitespace-nowrap ${
                  selectedStatus === tab
                    ? "bg-purple-950 text-white shadow-sm"
                    : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          {/* Search */}
          <div className="relative w-full md:w-72">
            <HiMagnifyingGlass className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search reports or locations..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-800 focus:outline-none focus:border-purple-500"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
              >
                <HiXMark className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

        </div>

        {/* Admin Management Section */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-100">
            <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <span>Manage City Issues</span>
              <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-purple-50 text-purple-700 border border-purple-200">
                {filteredReports.length} {filteredReports.length === 1 ? "report" : "reports"}
              </span>
            </h2>
          </div>

          {loading ? (
            <div className="text-center py-16">
              <HiArrowPath className="w-8 h-8 text-purple-600 animate-spin mx-auto mb-3" />
              <p className="text-slate-500 text-sm font-medium">Fetching system reports...</p>
            </div>
          ) : filteredReports.length === 0 ? (
            <div className="text-center py-16 bg-slate-50 rounded-2xl border border-dashed border-slate-300">
              <HiShieldCheck className="w-10 h-10 text-slate-400 mx-auto mb-3" />
              <p className="text-slate-700 font-semibold text-base">No matching reports found</p>
              <p className="text-slate-500 text-xs mt-1">Check search query or status filter.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredReports.map((report) => (
                <div
                  key={report.id}
                  className="border border-slate-200 rounded-2xl p-5 hover:border-purple-300 transition-all bg-white flex flex-col md:flex-row justify-between items-start md:items-center gap-6"
                >
                  <div className="flex-1">
                    <div className="flex flex-wrap items-center gap-2 mb-2">
                      <span className="text-xs font-bold text-slate-400">#{report.id}</span>
                      <h3 className="font-bold text-base text-slate-900">{report.title}</h3>
                      <span className={`px-2.5 py-0.5 text-xs font-bold rounded-full border ${getStatusBadgeColor(report.status)}`}>
                        {report.status}
                      </span>
                      <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 text-xs font-bold rounded-full border ${getPriorityBadgeColor(report.priority)}`}>
                        <HiSignal className="w-3 h-3" />
                        {report.priority || "Medium"}
                      </span>
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 text-xs font-bold rounded-full border border-slate-200 bg-slate-50 text-slate-700">
                        <HiUsers className="w-3 h-3" />
                        {report.support_count || 0}
                      </span>
                    </div>

                    <p className="text-xs text-slate-500 mb-2 flex items-center gap-1.5 font-medium">
                      <HiMapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span>{report.location}</span>
                    </p>

                    <p className="text-slate-600 text-xs mb-3 leading-relaxed">
                      {report.description}
                    </p>

                    {report.image && (
                      <div className="mt-2 inline-block">
                        <img
                          src={report.image}
                          alt={report.title}
                          className="w-32 h-20 object-cover rounded-xl border border-slate-200 cursor-pointer"
                          onClick={() => setSelectedImage(report.image)}
                          onError={(e) => { e.target.style.display = "none"; }}
                        />
                      </div>
                    )}
                  </div>

                  {/* Actions Bar */}
                  <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 w-full md:w-auto pt-3 md:pt-0 border-t md:border-t-0 border-slate-100">
                    <div className="flex items-center gap-2 bg-slate-50 p-2 rounded-xl border border-slate-200 w-full sm:w-auto">
                      <label className="text-xs font-bold text-slate-600 shrink-0">Status:</label>
                      <select
                        value={report.status}
                        onChange={(e) => handleStatusChange(report.id, e.target.value)}
                        className="text-xs font-semibold border border-slate-300 rounded-lg p-1.5 bg-white text-slate-800 focus:ring-purple-500 focus:border-purple-500 shadow-2xs w-full sm:w-auto"
                      >
                        <option value="Pending">Pending</option>
                        <option value="In Progress">In Progress</option>
                        <option value="Resolved">Resolved</option>
                      </select>
                    </div>

                    <div className="flex items-center gap-2 bg-slate-50 p-2 rounded-xl border border-slate-200 w-full sm:w-auto">
                      <label className="text-xs font-bold text-slate-600 shrink-0">Priority:</label>
                      <select
                        value={report.priority || "Medium"}
                        onChange={(e) => handlePriorityChange(report.id, e.target.value)}
                        className="text-xs font-semibold border border-slate-300 rounded-lg p-1.5 bg-white text-slate-800 focus:ring-purple-500 focus:border-purple-500 shadow-2xs w-full sm:w-auto"
                      >
                        <option value="Low">Low</option>
                        <option value="Medium">Medium</option>
                        <option value="High">High</option>
                        <option value="Urgent">Urgent</option>
                      </select>
                    </div>

                    <Link
                      to={`/reports/${report.id}`}
                      className="px-4 py-2.5 rounded-xl bg-slate-900 text-white text-xs font-semibold hover:bg-purple-700 transition-colors w-full sm:w-auto text-center"
                    >
                      View Details
                    </Link>

                    <button
                      onClick={() => handleDeleteReport(report.id)}
                      className="p-2.5 rounded-xl text-rose-600 hover:bg-rose-50 border border-transparent hover:border-rose-200 transition-colors"
                      title="Delete Report"
                    >
                      <FaTrashCan className="w-4 h-4" />
                    </button>
                  </div>

                </div>
              ))}
            </div>
          )}

        </div>

      </div>

      {/* Image Modal */}
      {selectedImage && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="relative max-w-3xl w-full bg-slate-900 p-2 rounded-2xl overflow-hidden shadow-2xl border border-slate-700">
            <button
              onClick={() => setSelectedImage(null)}
              className="absolute top-4 right-4 z-10 p-2 rounded-full bg-slate-800/80 text-white hover:bg-slate-700 transition-colors"
            >
              <HiXMark className="w-5 h-5" />
            </button>
            <img
              src={selectedImage}
              alt="Report Attachment Preview"
              className="w-full max-h-[80vh] object-contain rounded-xl"
            />
          </div>
        </div>
      )}

    </div>
  );
}