import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import {
  HiExclamationTriangle,
  HiMapPin,
  HiDocumentText,
  HiPhoto,
  HiPaperAirplane,
  HiArrowLeft,
  HiCheckCircle,
  HiXMark,
} from "react-icons/hi2";
import {
  FaRoad,
  FaLightbulb,
  FaTrashCan,
  FaDroplet,
  FaTree,
  FaSpinner,
} from "react-icons/fa6";
import { supabase } from "../supabaseClient";

export default function ReportIssue() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [location, setLocation] = useState("");
  const [showMapPin, setShowMapPin] = useState(false);
  const [latitude, setLatitude] = useState("");
  const [longitude, setLongitude] = useState("");
  const [image, setImage] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const navigate = useNavigate();

  const presets = [
    {
      label: "Broken Pothole",
      icon: FaRoad,
      title: "Damaged Pothole on Road",
      color: "text-amber-600 bg-amber-50",
    },
    {
      label: "Streetlight Fault",
      icon: FaLightbulb,
      title: "Faulty / Out Streetlight",
      color: "text-yellow-600 bg-yellow-50",
    },
    {
      label: "Uncollected Waste",
      icon: FaTrashCan,
      title: "Illegal Waste & Trash Overflow",
      color: "text-emerald-600 bg-emerald-50",
    },
    {
      label: "Water Leakage",
      icon: FaDroplet,
      title: "Burst Pipe & Water Leakage",
      color: "text-blue-600 bg-blue-50",
    },
    {
      label: "Public Park Issue",
      icon: FaTree,
      title: "Damaged Park Equipment",
      color: "text-green-600 bg-green-50",
    },
  ];

  const handlePresetSelect = (presetTitle) => {
    setTitle(presetTitle);
  };

  const hasMapPin = latitude !== "" && longitude !== "";

  const handleUseCurrentLocation = () => {
    setErrorMsg("");

    if (!navigator.geolocation) {
      setErrorMsg("Your browser does not support current location access.");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLatitude(position.coords.latitude.toFixed(6));
        setLongitude(position.coords.longitude.toFixed(6));
        setShowMapPin(true);
      },
      () => {
        setErrorMsg(
          "Unable to get your current location. You can enter coordinates manually."
        );
      }
    );
  };

  const handleRemoveMapPin = () => {
    setLatitude("");
    setLongitude("");
    setShowMapPin(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setErrorMsg("");
    setSubmitting(true);

    try {
      // Insert directly into Supabase database table "reports" matching your actual columns
      const { error: insertError } = await supabase.from("reports").insert([
        {
          title,
          description,
          location,
          image: image || "EMPTY",
          latitude: hasMapPin ? String(latitude) : null,
          longitude: hasMapPin ? String(longitude) : null,
          status: "Pending",
        },
      ]);

      if (insertError) throw insertError;

      setMessage("Report submitted successfully! Directing to dashboard...");
      setTitle("");
      setDescription("");
      setLocation("");
      setLatitude("");
      setLongitude("");
      setShowMapPin(false);
      setImage("");
      
      setTimeout(() => {
        navigate("/dashboard");
      }, 1500);

    } catch (err) {
      console.error("Error submitting report:", err);
      setErrorMsg(err.message || "Failed to submit report. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans py-12 px-6">
      <div className="max-w-2xl mx-auto">
        {/* Back Link */}
        <Link
          to="/dashboard"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-blue-600 mb-6 transition-colors"
        >
          <HiArrowLeft className="w-4 h-4" />
          <span>Back to Dashboard</span>
        </Link>

        <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-200">
          {/* Header */}
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 rounded-2xl bg-blue-50 border border-blue-100 text-blue-600 flex items-center justify-center shrink-0">
              <HiExclamationTriangle className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
                Submit a Civic Issue Report
              </h1>
              <p className="text-xs text-slate-500 mt-1">
                Provide details to notify municipal authorities and dispatch
                maintenance teams.
              </p>
            </div>
          </div>

          {/* Quick Presets */}
          <div className="mb-6">
            <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-2">
              Quick Issue Templates
            </label>
            <div className="flex flex-wrap gap-2">
              {presets.map((preset, idx) => {
                const IconComp = preset.icon;
                return (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => handlePresetSelect(preset.title)}
                    className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-blue-50 hover:text-blue-600 text-slate-700 text-xs font-semibold border border-slate-200 transition-colors flex items-center gap-1.5"
                  >
                    <IconComp
                      className={`w-3.5 h-3.5 ${preset.color.split(" ")[0]}`}
                    />
                    <span>{preset.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Success Banner */}
          {message && (
            <div className="mb-6 p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-2xl text-xs font-semibold flex items-center gap-2 animate-in fade-in">
              <HiCheckCircle className="w-5 h-5 text-emerald-600 shrink-0" />
              <span>{message}</span>
            </div>
          )}

          {/* Error Banner */}
          {errorMsg && (
            <div className="mb-6 p-4 bg-rose-50 border border-rose-200 text-rose-800 rounded-2xl text-xs font-semibold flex items-center gap-2 animate-in fade-in">
              <HiExclamationTriangle className="w-5 h-5 text-rose-600 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Title */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                Issue Title <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <HiExclamationTriangle className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g., Broken streetlight on Azikiwe Road"
                  className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-800 focus:outline-none focus:border-blue-500 focus:bg-white transition-all"
                  required
                />
              </div>
            </div>

            {/* Location */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                Specific Location <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <HiMapPin className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="e.g., Corner of 5th Ave & Market St, City Center"
                  className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-800 focus:outline-none focus:border-blue-500 focus:bg-white transition-all"
                  required
                />
              </div>
            </div>

            {/* Optional Map Pin */}
            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700">
                    Map Location{" "}
                    <span className="text-slate-400 font-normal">
                      (Optional)
                    </span>
                  </label>
                  <p className="text-[11px] text-slate-500 mt-1">
                    Add an exact pin if you know the spot. The street name above
                    is still enough.
                  </p>
                </div>
                {!showMapPin ? (
                  <button
                    type="button"
                    onClick={() => setShowMapPin(true)}
                    className="px-4 py-2 rounded-xl bg-white hover:bg-blue-50 text-blue-700 text-xs font-bold border border-blue-200 transition-colors flex items-center justify-center gap-1.5"
                  >
                    <HiMapPin className="w-4 h-4" />
                    Add Map Pin
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={handleRemoveMapPin}
                    className="px-4 py-2 rounded-xl bg-white hover:bg-rose-50 text-rose-700 text-xs font-bold border border-rose-200 transition-colors flex items-center justify-center gap-1.5"
                  >
                    <HiXMark className="w-4 h-4" />
                    Remove Pin
                  </button>
                )}
              </div>

              {showMapPin && (
                <div className="mt-4 space-y-3">
                  <button
                    type="button"
                    onClick={handleUseCurrentLocation}
                    className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-blue-600 text-white text-xs font-bold transition-colors flex items-center justify-center gap-1.5"
                  >
                    <HiMapPin className="w-4 h-4" />
                    Use My Current Location
                  </button>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] font-bold text-slate-500 mb-1.5">
                        Latitude
                      </label>
                      <input
                        type="number"
                        step="any"
                        min="-90"
                        max="90"
                        value={latitude}
                        onChange={(e) => setLatitude(e.target.value)}
                        placeholder="e.g., 6.524379"
                        className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl text-xs font-medium text-slate-800 focus:outline-none focus:border-blue-500 transition-all"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold text-slate-500 mb-1.5">
                        Longitude
                      </label>
                      <input
                        type="number"
                        step="any"
                        min="-180"
                        max="180"
                        value={longitude}
                        onChange={(e) => setLongitude(e.target.value)}
                        placeholder="e.g., 3.379206"
                        className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl text-xs font-medium text-slate-800 focus:outline-none focus:border-blue-500 transition-all"
                      />
                    </div>
                  </div>

                  {hasMapPin && (
                    <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white">
                      <iframe
                        title="Selected map location"
                        src={`https://www.openstreetmap.org/export/embed.html?bbox=${Number(longitude) - 0.01}%2C${Number(latitude) - 0.01}%2C${Number(longitude) + 0.01}%2C${Number(latitude) + 0.01}&layer=mapnik&marker=${latitude}%2C${longitude}`}
                        className="w-full h-56 border-0"
                      />
                      <p className="px-3 py-2 text-[11px] font-semibold text-slate-500">
                        Selected pin: {latitude}, {longitude}
                      </p>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Description */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                Issue Description <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <HiDocumentText className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Describe the severity, hazard details, or landmark references to assist repair teams..."
                  rows="4"
                  className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-800 focus:outline-none focus:border-blue-500 focus:bg-white transition-all"
                  required
                />
              </div>
            </div>

            {/* Image URL */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                Image Link / Photo URL{" "}
                <span className="text-slate-400 font-normal">(Optional)</span>
              </label>
              <div className="relative">
                <HiPhoto className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="url"
                  value={image}
                  onChange={(e) => setImage(e.target.value)}
                  placeholder="https://images.unsplash.com/... or image URL"
                  className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-800 focus:outline-none focus:border-blue-500 focus:bg-white transition-all"
                />
              </div>
            </div>

            {/* Live Image Preview */}
            {image && (
              <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200">
                <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-2">
                  Image Preview
                </span>
                <img
                  src={image}
                  alt="Live Attachment Preview"
                  className="w-full h-44 object-cover rounded-xl border border-slate-200"
                  onError={(e) => {
                    e.target.style.display = "none";
                  }}
                />
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={submitting}
              className="w-full py-3.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs shadow-lg shadow-blue-500/25 transition-all flex items-center justify-center gap-2 disabled:opacity-75"
            >
              {submitting ? (
                <>
                  <FaSpinner className="w-4 h-4 animate-spin" />
                  <span>Submitting Report...</span>
                </>
              ) : (
                <>
                  <HiPaperAirplane className="w-4 h-4" />
                  <span>Submit Official Report</span>
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
