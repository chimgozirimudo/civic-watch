import React from "react";
import { Link } from "react-router-dom";
import { HiArrowLeft, HiExclamationTriangle } from "react-icons/hi2";

export default function NotFound() {
  return (
    <main className="min-h-[calc(100vh-5rem)] bg-[#fff8ed] dark:bg-[#111827] px-6 py-20 flex items-center justify-center">
      <div className="max-w-md text-center">
        <div className="mx-auto mb-6 w-16 h-16 rounded-2xl bg-gov-red/10 text-gov-red dark:bg-gov-gold/10 dark:text-gov-gold flex items-center justify-center">
          <HiExclamationTriangle className="w-8 h-8" />
        </div>
        <p className="text-sm font-bold uppercase tracking-[0.2em] text-gov-red dark:text-gov-gold">
          Error 404
        </p>
        <h1 className="mt-3 text-3xl font-serif font-bold text-slate-900 dark:text-white">
          Page not found
        </h1>
        <p className="mt-3 text-sm leading-relaxed text-slate-600 dark:text-slate-400">
          The page you are looking for does not exist or may have moved.
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Link
            to="/"
            className="inline-flex items-center gap-2 rounded-xl bg-gov-red px-5 py-3 text-xs font-semibold text-white transition-colors hover:bg-gov-red-hover dark:bg-gov-gold dark:text-slate-900 dark:hover:bg-gov-gold-hover"
          >
            <HiArrowLeft className="w-4 h-4" />
            Return Home
          </Link>
          <Link
            to="/login"
            className="rounded-xl border border-orange-200 bg-white px-5 py-3 text-xs font-semibold text-slate-700 transition-colors hover:bg-orange-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800"
          >
            Sign In
          </Link>
        </div>
      </div>
    </main>
  );
}
