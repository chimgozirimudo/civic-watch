import React, { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { supabase } from '../supabaseClient'; // 👈 Make sure this path points to your supabaseClient file
import { 
  HiPlusCircle, 
  HiMapPin, 
  HiCheckCircle, 
  HiClock, 
  HiExclamationTriangle, 
  HiMagnifyingGlass, 
  HiSquares2X2, 
  HiXMark, 
  HiArrowsPointingOut,
  HiCalendarDays,
  HiArrowPath,
  HiSignal,
  HiUsers
} from 'react-icons/hi2';
import { 
  FaClipboardList, 
  FaHourglassHalf, 
  FaWrench, 
  FaCircleCheck 
} from 'react-icons/fa6';

export default function Dashboard() {
  const [reports, setReports] = useState([]);
  const [searchParams] = useSearchParams();
  const [searchQuery, setSearchQuery] = useState(searchParams.get('search') || '');
  const [selectedStatus, setSelectedStatus] = useState('All');
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(null);
  const [selectedMapReportId, setSelectedMapReportId] = useState(null);

  const fetchReports = async () => {
    try {
      setLoading(true);
      // Fetch directly from your Supabase 'reports' table
      const { data, error } = await supabase
        .from('reports')
        .select('*')
        .order('created_at', { ascending: false }); // Sort newest first

      if (error) {
        throw error;
      }

      if (data) {
        setReports(data);
      }
    } catch (err) {
      console.error('Error fetching reports from Supabase:', err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReports();
  }, []);

  const getStatusBadgeColor = (status) => {
    switch (status) {
      case 'Resolved':
        return 'bg-emerald-100 text-emerald-800 border-emerald-200';
      case 'In Progress':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      default:
        return 'bg-amber-100 text-amber-800 border-amber-200';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'Resolved':
        return <HiCheckCircle className="w-3.5 h-3.5 text-emerald-600" />;
      case 'In Progress':
        return <HiArrowPath className="w-3.5 h-3.5 text-blue-600 animate-spin" />;
      default:
        return <HiClock className="w-3.5 h-3.5 text-amber-600" />;
    }
  };

  const getPriorityBadgeColor = (priority) => {
    switch (priority) {
      case 'Urgent':
        return 'bg-rose-100 text-rose-800 border-rose-200';
      case 'High':
        return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'Low':
        return 'bg-slate-100 text-slate-700 border-slate-200';
      default:
        return 'bg-indigo-100 text-indigo-800 border-indigo-200';
    }
  };

  // Filtered reports calculation
  const filteredReports = reports.filter((report) => {
    const matchesStatus = selectedStatus === 'All' || report.status === selectedStatus;
    const matchesSearch = searchQuery === '' || 
      report.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      report.location?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      report.description?.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  // Metrics
  const totalCount = reports.length;
  const pendingCount = reports.filter((r) => r.status === 'Pending').length;
  const inProgressCount = reports.filter((r) => r.status === 'In Progress').length;
  const resolvedCount = reports.filter((r) => r.status === 'Resolved').length;
  const pinnedReports = reports.filter((report) => report.latitude !== null && report.latitude !== undefined && report.longitude !== null && report.longitude !== undefined);
  const selectedMapReport = pinnedReports.find((report) => report.id === selectedMapReportId) || pinnedReports[0];

  const getMapEmbedUrl = (latitude, longitude) => {
    const lat = Number(latitude);
    const lng = Number(longitude);
    return `https://www.openstreetmap.org/export/embed.html?bbox=${lng - 0.03}%2C${lat - 0.03}%2C${lng + 0.03}%2C${lat + 0.03}&layer=mapnik&marker=${lat}%2C${lng}`;
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 font-sans pb-16 transition-colors">
      
      {/* Header Banner */}
      <div className="bg-[#0f172a] dark:bg-black text-white border-b-4 border-gov-gold py-12 px-6">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div>
            <div className="inline-flex items-center gap-2 text-xs font-semibold text-amber-500 bg-amber-900/30 px-3 py-1 rounded-sm border border-amber-700/50 mb-4 uppercase tracking-widest">
              <HiSquares2X2 className="w-3.5 h-3.5" />
              <span>Official Citizen Portal</span>
            </div>
            <h1 className="text-4xl font-serif font-bold text-white tracking-tight">Citizen Dashboard</h1>
            <p className="text-slate-300 text-sm mt-2 max-w-xl">
              Track active community issues, monitor status updates, and transparently view municipal responses.
            </p>
          </div>

          <Link
            to="/report"
            className="px-6 py-3 rounded-sm bg-gov-gold hover:bg-[#996b09] text-white font-bold text-xs uppercase tracking-wider shadow-lg transition-all flex items-center gap-2 shrink-0"
          >
            <HiPlusCircle className="w-4 h-4" />
            <span>Report New Issue</span>
          </Link>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 -mt-6">
        
        {/* Metric Overview Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white dark:bg-slate-800 p-5 rounded-lg border border-slate-200 dark:border-slate-700 shadow-sm flex items-center justify-between">
            <div>
              <p className="text-xs font-medium text-slate-500 dark:text-slate-400">Total Reports</p>
              <h3 className="text-2xl font-serif font-bold text-slate-900 dark:text-white mt-1">{totalCount}</h3>
            </div>
            <div className="w-10 h-10 rounded-sm bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 flex items-center justify-center font-bold text-lg">
              <FaClipboardList />
            </div>
          </div>

          <div className="bg-white dark:bg-slate-800 p-5 rounded-lg border border-slate-200 dark:border-slate-700 shadow-sm flex items-center justify-between">
            <div>
              <p className="text-xs font-medium text-slate-500 dark:text-slate-400">Pending</p>
              <h3 className="text-2xl font-serif font-bold text-amber-600 dark:text-amber-500 mt-1">{pendingCount}</h3>
            </div>
            <div className="w-10 h-10 rounded-sm bg-amber-50 dark:bg-amber-900/30 text-amber-600 dark:text-amber-500 flex items-center justify-center font-bold text-lg">
              <FaHourglassHalf />
            </div>
          </div>

          <div className="bg-white dark:bg-slate-800 p-5 rounded-lg border border-slate-200 dark:border-slate-700 shadow-sm flex items-center justify-between">
            <div>
              <p className="text-xs font-medium text-slate-500 dark:text-slate-400">In Progress</p>
              <h3 className="text-2xl font-serif font-bold text-blue-600 dark:text-blue-500 mt-1">{inProgressCount}</h3>
            </div>
            <div className="w-10 h-10 rounded-sm bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-500 flex items-center justify-center font-bold text-lg">
              <FaWrench />
            </div>
          </div>

          <div className="bg-white dark:bg-slate-800 p-5 rounded-lg border border-slate-200 dark:border-slate-700 shadow-sm flex items-center justify-between">
            <div>
              <p className="text-xs font-medium text-slate-500 dark:text-slate-400">Resolved</p>
              <h3 className="text-2xl font-serif font-bold text-emerald-600 dark:text-emerald-500 mt-1">{resolvedCount}</h3>
            </div>
            <div className="w-10 h-10 rounded-sm bg-emerald-50 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-500 flex items-center justify-center font-bold text-lg">
              <FaCircleCheck />
            </div>
          </div>
        </div>

        {/* Filter Controls Bar */}
        <div className="bg-white dark:bg-slate-800 p-4 rounded-lg border border-slate-200 dark:border-slate-700 shadow-sm mb-6 flex flex-col md:flex-row items-center justify-between gap-4">
          
          {/* Status Tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto w-full md:w-auto pb-1 md:pb-0">
            {['All', 'Pending', 'In Progress', 'Resolved'].map((tab) => (
              <button
                key={tab}
                onClick={() => setSelectedStatus(tab)}
                className={`px-4 py-2 rounded-sm text-xs font-semibold transition-all whitespace-nowrap uppercase tracking-wider ${
                  selectedStatus === tab
                    ? 'bg-[#1e293b] text-white shadow-sm dark:bg-slate-700'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-slate-900 dark:text-slate-400 dark:hover:bg-slate-700'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          {/* Search Box */}
          <div className="relative w-full md:w-72">
            <HiMagnifyingGlass className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Filter by title, location..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-sm text-xs font-medium text-slate-800 dark:text-slate-200 focus:outline-none focus:border-gov-gold dark:focus:border-gov-gold"
            />
            {searchQuery && (
              <button 
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"
              >
                <HiXMark className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

        </div>

        {/* Map Overview */}
        {pinnedReports.length > 0 && (
          <div className="bg-white dark:bg-slate-800 rounded-xl p-6 sm:p-8 border border-slate-200 dark:border-slate-700 shadow-sm mb-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-5">
              <div>
                <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <HiMapPin className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                  Report Map
                </h2>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                  Showing {pinnedReports.length} reports with exact map pins.
                </p>
              </div>
              {selectedMapReport && (
                <Link
                  to={`/reports/${selectedMapReport.id}`}
                  className="px-4 py-2.5 rounded-sm bg-[#1e293b] dark:bg-slate-700 text-white text-xs font-semibold hover:bg-blue-600 dark:hover:bg-blue-500 transition-colors text-center"
                >
                  Open Selected Report
                </Link>
              )}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-[0.7fr_1.3fr] gap-5">
              <div className="space-y-2 max-h-80 overflow-y-auto pr-1">
                {pinnedReports.map((report) => (
                  <button
                    key={report.id}
                    type="button"
                    onClick={() => setSelectedMapReportId(report.id)}
                    className={`w-full text-left p-4 rounded-lg border transition-colors ${
                      selectedMapReport?.id === report.id
                        ? 'border-blue-300 bg-blue-50 dark:border-blue-800 dark:bg-blue-900/30'
                        : 'border-slate-200 bg-slate-50 hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-800/50 dark:hover:bg-slate-700'
                    }`}
                  >
                    <p className="text-sm font-bold text-slate-900 dark:text-white truncate">{report.title}</p>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 truncate">{report.location}</p>
                    <p className="text-[11px] font-semibold text-slate-400 dark:text-slate-500 mt-2">
                      {report.latitude}, {report.longitude}
                    </p>
                  </button>
                ))}
              </div>

              {selectedMapReport && (
                <div className="overflow-hidden rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-100 dark:bg-slate-900 min-h-80">
                  <iframe
                    title="Selected report map"
                    src={getMapEmbedUrl(selectedMapReport.latitude, selectedMapReport.longitude)}
                    className="w-full h-80 border-0"
                  />
                </div>
              )}
            </div>
          </div>
        )}

        {/* Reports Feed Grid */}
        <div className="bg-white dark:bg-slate-800 rounded-xl p-6 sm:p-8 border border-slate-200 dark:border-slate-700 shadow-sm">
          
          <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-100 dark:border-slate-700">
            <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <span>Community Issue Reports</span>
              <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-600">
                {filteredReports.length} {filteredReports.length === 1 ? 'item' : 'items'}
              </span>
            </h2>
          </div>

          {loading ? (
            <div className="text-center py-16">
              <HiArrowPath className="w-8 h-8 text-blue-600 dark:text-blue-500 animate-spin mx-auto mb-3" />
              <p className="text-slate-500 dark:text-slate-400 text-sm font-medium">Loading community reports...</p>
            </div>
          ) : filteredReports.length === 0 ? (
            <div className="text-center py-16 bg-slate-50 dark:bg-slate-900/50 rounded-lg border border-dashed border-slate-300 dark:border-slate-700">
              <HiExclamationTriangle className="w-10 h-10 text-slate-400 dark:text-slate-500 mx-auto mb-3" />
              <p className="text-slate-700 dark:text-slate-300 font-semibold text-base">No reports found</p>
              <p className="text-slate-500 dark:text-slate-400 text-xs mt-1 max-w-sm mx-auto">
                {searchQuery || selectedStatus !== 'All' 
                  ? 'Try adjusting your search keywords or status filter.'
                  : 'Be the first citizen to file an issue report in your area.'}
              </p>
              <Link
                to="/report"
                className="mt-5 inline-flex items-center gap-2 px-5 py-2.5 rounded-sm bg-blue-600 text-white text-xs font-semibold hover:bg-blue-700 transition-colors shadow-sm"
              >
                <HiPlusCircle className="w-4 h-4" />
                Submit New Report
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredReports.map((report) => (
                <div
                  key={report.id}
                  className="border border-slate-200 dark:border-slate-700 rounded-lg p-5 flex flex-col justify-between hover:border-blue-400 dark:hover:border-blue-500 hover:shadow-md transition-all duration-200 bg-white dark:bg-slate-800 group"
                >
                  <div>
                    {/* Status Badge */}
                    <div className="flex items-center justify-between mb-3 gap-2">
                      <span className={`inline-flex items-center gap-1.5 px-3 py-1 text-xs font-bold rounded-full border ${getStatusBadgeColor(report.status)}`}>
                        {getStatusIcon(report.status)}
                        <span>{report.status || 'Pending'}</span>
                      </span>

                      {report.created_at && (
                        <span className="text-[11px] text-slate-400 font-medium flex items-center gap-1">
                          <HiCalendarDays className="w-3 h-3" />
                          {new Date(report.created_at).toLocaleDateString()}
                        </span>
                      )}
                    </div>

                    <div className="flex flex-wrap items-center gap-2 mb-3">
                      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 text-[11px] font-bold rounded-full border ${getPriorityBadgeColor(report.priority)}`}>
                        <HiSignal className="w-3 h-3" />
                        {report.priority || 'Medium'}
                      </span>
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 text-[11px] font-bold rounded-full border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-700 text-slate-700 dark:text-slate-300">
                        <HiUsers className="w-3 h-3" />
                        {report.support_count || 0} supported
                      </span>
                    </div>

                    {/* Title */}
                    <h3 className="font-bold text-base text-slate-900 dark:text-white mb-2 leading-snug group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                      {report.title}
                    </h3>

                    {/* Location */}
                    <p className="text-xs text-slate-500 dark:text-slate-400 mb-3 flex items-center gap-1.5 font-medium">
                      <HiMapPin className="w-3.5 h-3.5 text-slate-400 dark:text-slate-500 shrink-0" />
                      <span className="truncate">{report.location}</span>
                    </p>

                    {/* Description */}
                    <p className="text-slate-600 dark:text-slate-400 text-xs mb-4 line-clamp-3 leading-relaxed">
                      {report.description}
                    </p>
                  </div>

                  {/* Image Attachment Thumbnail */}
                  {report.image && (
                    <div className="mt-auto pt-3 border-t border-slate-100 dark:border-slate-700 relative group/img">
                      <img
                        src={report.image}
                        alt={report.title}
                        className="w-full h-40 object-cover rounded-lg border border-slate-200 dark:border-slate-700 cursor-pointer"
                        onClick={() => setSelectedImage(report.image)}
                        onError={(e) => { e.target.style.display = 'none'; }}
                      />
                      <button
                        onClick={() => setSelectedImage(report.image)}
                        className="absolute bottom-2 right-2 p-1.5 rounded-lg bg-black/60 text-white backdrop-blur-sm opacity-0 group-hover/img:opacity-100 transition-opacity"
                        title="Enlarge Image"
                      >
                        <HiArrowsPointingOut className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  )}

                  <Link
                    to={`/reports/${report.id}`}
                    className="mt-4 inline-flex items-center justify-center px-4 py-2.5 rounded-sm bg-[#1e293b] dark:bg-slate-700 text-white text-xs font-semibold hover:bg-blue-600 dark:hover:bg-blue-500 transition-colors"
                  >
                    View Details
                  </Link>
                </div>
              ))}
            </div>
          )}

        </div>

      </div>

      {/* Image Preview Modal */}
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
              alt="Enlarged Report Preview"
              className="w-full max-h-[80vh] object-contain rounded-xl"
            />
          </div>
        </div>
      )}

    </div>
  );
}