import React, { useEffect, useState } from "react";
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import {
  HiArrowLeft,
  HiArrowPath,
  HiCalendarDays,
  HiChatBubbleLeftRight,
  HiCheckCircle,
  HiClock,
  HiDocumentText,
  HiExclamationTriangle,
  HiMapPin,
  HiPaperAirplane,
  HiSignal,
  HiUserCircle,
  HiUsers,
} from "react-icons/hi2";

const API_URL = "http://localhost:5000";

const readJsonResponse = async (response) => {
  const text = await response.text();

  try {
    return text ? JSON.parse(text) : {};
  } catch {
    throw new Error(
      "The backend did not return valid data. Please restart the backend server and try again.",
    );
  }
};

export default function ReportDetail() {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const [report, setReport] = useState(null);
  const [timeline, setTimeline] = useState([]);
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [commentText, setCommentText] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [supporting, setSupporting] = useState(false);
  const returnPath = location.state?.from || "/dashboard";
  const returnLabel = returnPath === "/" ? "Back to Home" : "Back to Dashboard";

  const fetchReport = async () => {
    try {
      setError("");
      const response = await fetch(`${API_URL}/reports/${id}`);
      const data = await readJsonResponse(response);

      if (!response.ok) {
        throw new Error(data.error || "Unable to load this report.");
      }

      setReport(data.report);
      setTimeline(data.timeline || []);
      setComments(data.comments || []);
    } catch (err) {
      setError(err.message || "Failed to connect to the backend.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReport();
  }, [id]);

  const handleSubmitComment = async (event) => {
    event.preventDefault();

    if (!commentText.trim()) {
      return;
    }

    try {
      setSubmitting(true);
      const savedUser = localStorage.getItem("user");
      const user = savedUser ? JSON.parse(savedUser) : null;
      const response = await fetch(`${API_URL}/reports/${id}/comments`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          author: user?.name || "Citizen",
          message: commentText,
        }),
      });
      const data = await readJsonResponse(response);

      if (!response.ok) {
        throw new Error(data.error || "Unable to add comment.");
      }

      setCommentText("");
      await fetchReport();
    } catch (err) {
      setError(err.message || "Unable to add comment.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleSupportReport = async () => {
    try {
      setSupporting(true);
      setError("");
      const response = await fetch(`${API_URL}/reports/${id}/support`, {
        method: "POST",
      });
      const data = await readJsonResponse(response);

      if (!response.ok) {
        throw new Error(data.error || "Unable to support this report.");
      }

      setReport((currentReport) => ({
        ...currentReport,
        support_count: data.support_count,
      }));
    } catch (err) {
      setError(err.message || "Unable to support this report.");
    } finally {
      setSupporting(false);
    }
  };

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

  const getStatusIcon = (status) => {
    switch (status) {
      case "Resolved":
        return <HiCheckCircle className="w-4 h-4 text-emerald-600" />;
      case "In Progress":
        return <HiArrowPath className="w-4 h-4 text-blue-600" />;
      default:
        return <HiClock className="w-4 h-4 text-amber-600" />;
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

  const formatDate = (dateValue) => {
    if (!dateValue) {
      return "Not available";
    }

    return new Date(dateValue).toLocaleString([], {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const hasMapPin =
    report?.latitude !== null &&
    report?.latitude !== undefined &&
    report?.longitude !== null &&
    report?.longitude !== undefined;

  const getMapEmbedUrl = (latitude, longitude) => {
    const lat = Number(latitude);
    const lng = Number(longitude);
    return `https://www.openstreetmap.org/export/embed.html?bbox=${lng - 0.01}%2C${lat - 0.01}%2C${lng + 0.01}%2C${lat + 0.01}&layer=mapnik&marker=${lat}%2C${lng}`;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 px-6 py-16 text-center">
        <HiArrowPath className="w-9 h-9 text-blue-600 animate-spin mx-auto mb-3" />
        <p className="text-sm font-semibold text-slate-600">
          Loading report details...
        </p>
      </div>
    );
  }

  if (error && !report) {
    return (
      <div className="min-h-screen bg-slate-50 px-6 py-16">
        <div className="max-w-xl mx-auto text-center bg-white border border-slate-200 rounded-2xl p-8 shadow-sm">
          <HiExclamationTriangle className="w-10 h-10 text-amber-500 mx-auto mb-3" />
          <h1 className="text-xl font-extrabold text-slate-900">
            Report unavailable
          </h1>
          <p className="text-sm text-slate-500 mt-2">{error}</p>
          <Link
            to="/dashboard"
            className="mt-6 inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-blue-600 text-white text-xs font-semibold hover:bg-blue-700 transition-colors"
          >
            <HiArrowLeft className="w-4 h-4" />
            Back to Dashboard
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 pb-16">
      <div className="bg-slate-900 text-white border-b border-slate-800 py-8 px-6">
        <div className="max-w-6xl mx-auto">
          <button
            type="button"
            onClick={() => navigate(returnPath)}
            className="inline-flex items-center gap-2 text-xs font-semibold text-slate-300 hover:text-white transition-colors mb-5"
          >
            <HiArrowLeft className="w-4 h-4" />
            {returnLabel}
          </button>
          <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-5">
            <div>
              <p className="text-xs font-bold text-blue-400 mb-2">
                Report #{report.id}
              </p>
              <h1 className="text-3xl font-extrabold tracking-tight">
                {report.title}
              </h1>
              <p className="text-sm text-slate-400 mt-2 max-w-2xl">
                {report.description}
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <span
                className={`inline-flex items-center gap-2 px-4 py-2 text-xs font-bold rounded-full border bg-white ${getStatusBadgeColor(report.status)}`}
              >
                {getStatusIcon(report.status)}
                {report.status || "Pending"}
              </span>
              <span
                className={`inline-flex items-center gap-2 px-4 py-2 text-xs font-bold rounded-full border bg-white ${getPriorityBadgeColor(report.priority)}`}
              >
                <HiSignal className="w-4 h-4" />
                {report.priority || "Medium"} Priority
              </span>
            </div>
          </div>
        </div>
      </div>

      <main className="max-w-6xl mx-auto px-6 -mt-5 grid grid-cols-1 lg:grid-cols-[1.2fr_0.8fr] gap-6">
        <section className="space-y-6">
          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm">
              <div className="flex items-center gap-3 p-4 rounded-xl bg-slate-50 border border-slate-200">
                <HiMapPin className="w-5 h-5 text-blue-600 shrink-0" />
                <div>
                  <p className="text-xs font-semibold text-slate-500">
                    Location
                  </p>
                  <p className="font-bold text-slate-900">{report.location}</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-4 rounded-xl bg-slate-50 border border-slate-200">
                <HiCalendarDays className="w-5 h-5 text-blue-600 shrink-0" />
                <div>
                  <p className="text-xs font-semibold text-slate-500">
                    Submitted
                  </p>
                  <p className="font-bold text-slate-900">
                    {formatDate(report.created_at)}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-4 rounded-xl bg-slate-50 border border-slate-200">
                <HiUsers className="w-5 h-5 text-blue-600 shrink-0" />
                <div>
                  <p className="text-xs font-semibold text-slate-500">
                    Citizen Support
                  </p>
                  <p className="font-bold text-slate-900">
                    {report.support_count || 0} supporters
                  </p>
                </div>
              </div>
            </div>

            {report.status === "Resolved" ? (
              <div className="mt-5 inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-50 text-emerald-800 text-xs font-bold border border-emerald-200">
                <HiCheckCircle className="w-4 h-4" />
                Resolved with {report.support_count || 0} citizen supporters
              </div>
            ) : (
              <button
                onClick={handleSupportReport}
                disabled={supporting}
                className="mt-5 inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-slate-900 text-white text-xs font-semibold hover:bg-blue-600 disabled:opacity-50 transition-colors"
              >
                <HiUsers className="w-4 h-4" />
                {supporting ? "Adding Support..." : "Support This Issue"}
              </button>
            )}

            {report.image ? (
              <img
                src={report.image}
                alt={report.title}
                className="mt-6 w-full max-h-[460px] object-cover rounded-2xl border border-slate-200"
                onError={(event) => {
                  event.currentTarget.style.display = "none";
                }}
              />
            ) : (
              <div className="mt-6 rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-8 text-center">
                <HiDocumentText className="w-10 h-10 text-slate-400 mx-auto mb-3" />
                <p className="text-sm font-semibold text-slate-600">
                  No image was attached to this report.
                </p>
              </div>
            )}

            {hasMapPin && (
              <div className="mt-6 overflow-hidden rounded-2xl border border-slate-200 bg-slate-50">
                <div className="px-4 py-3 border-b border-slate-200 flex items-center justify-between gap-3">
                  <p className="text-sm font-bold text-slate-900 flex items-center gap-2">
                    <HiMapPin className="w-4 h-4 text-blue-600" />
                    Map Pin
                  </p>
                  <a
                    href={`https://www.openstreetmap.org/?mlat=${report.latitude}&mlon=${report.longitude}#map=17/${report.latitude}/${report.longitude}`}
                    target="_blank"
                    rel="noreferrer"
                    className="text-xs font-bold text-blue-600 hover:text-blue-800"
                  >
                    Open Map
                  </a>
                </div>
                <iframe
                  title="Report map location"
                  src={getMapEmbedUrl(report.latitude, report.longitude)}
                  className="w-full h-72 border-0"
                />
              </div>
            )}
          </div>

          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
            <div className="flex items-center justify-between gap-4 mb-5">
              <h2 className="text-lg font-extrabold text-slate-900 flex items-center gap-2">
                <HiChatBubbleLeftRight className="w-5 h-5 text-blue-600" />
                Comments
              </h2>
              <span className="text-xs font-bold text-slate-500 bg-slate-100 border border-slate-200 px-2.5 py-1 rounded-full">
                {comments.length}
              </span>
            </div>

            <form
              onSubmit={handleSubmitComment}
              className="flex flex-col gap-3 mb-6"
            >
              <textarea
                value={commentText}
                onChange={(event) => setCommentText(event.target.value)}
                placeholder="Add an update or question..."
                className="min-h-28 resize-none rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-800 focus:outline-none focus:border-blue-500"
              />
              <button
                type="submit"
                disabled={submitting || !commentText.trim()}
                className="self-start inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-blue-600 text-white text-xs font-semibold hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <HiPaperAirplane className="w-4 h-4" />
                {submitting ? "Posting..." : "Post Comment"}
              </button>
            </form>

            {error && (
              <p className="mb-4 text-xs font-semibold text-rose-700 bg-rose-50 border border-rose-200 rounded-xl px-3 py-2">
                {error}
              </p>
            )}

            <div className="space-y-3">
              {comments.length === 0 ? (
                <p className="text-sm text-slate-500 bg-slate-50 border border-dashed border-slate-300 rounded-xl p-4">
                  No comments yet.
                </p>
              ) : (
                comments.map((comment) => (
                  <div
                    key={comment.id}
                    className="rounded-xl border border-slate-200 p-4"
                  >
                    <div className="flex items-center justify-between gap-3 mb-2">
                      <p className="text-sm font-bold text-slate-900 flex items-center gap-2">
                        <HiUserCircle className="w-5 h-5 text-slate-400" />
                        {comment.author}
                      </p>
                      <span className="text-[11px] font-medium text-slate-400">
                        {formatDate(comment.created_at)}
                      </span>
                    </div>
                    <p className="text-sm text-slate-600 leading-relaxed">
                      {comment.message}
                    </p>
                  </div>
                ))
              )}
            </div>
          </div>
        </section>

        <aside className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm self-start">
          <h2 className="text-lg font-extrabold text-slate-900 mb-5">
            Status Timeline
          </h2>
          <div className="space-y-4">
            {timeline.map((event, index) => (
              <div key={`${event.id}-${index}`} className="relative pl-8">
                <span className="absolute left-0 top-1.5 w-3 h-3 rounded-full bg-blue-600 ring-4 ring-blue-100" />
                {index < timeline.length - 1 && (
                  <span className="absolute left-[5px] top-5 bottom-[-18px] w-px bg-slate-200" />
                )}
                <p className="text-sm font-bold text-slate-900">
                  {event.message}
                </p>
                <p className="text-xs text-slate-500 mt-1">
                  {formatDate(event.created_at)}
                </p>
              </div>
            ))}
          </div>
        </aside>
      </main>
    </div>
  );
}
