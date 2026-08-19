import React from "react";
import { useTheme } from "../components/ThemeProvider";
import { HiMoon, HiSun, HiBell, HiShieldCheck } from "react-icons/hi2";

export default function Settings() {
  const { theme, toggleTheme } = useTheme();

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 pt-20 pb-12 px-4 sm:px-6 lg:px-8 transition-colors">
      <div className="max-w-3xl mx-auto space-y-8">
        <div>
          <h1 className="text-3xl font-serif font-bold text-slate-900 dark:text-white">Settings</h1>
          <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">Manage your account preferences and application settings.</p>
        </div>

        <div className="bg-white dark:bg-slate-800 shadow rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-700">
          <ul className="divide-y divide-slate-200 dark:divide-slate-700">
            {/* Theme Preference */}
            <li className="p-6 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-blue-50 dark:bg-slate-700/50 rounded-xl text-blue-600 dark:text-blue-400">
                  {theme === "light" ? <HiSun className="w-6 h-6" /> : <HiMoon className="w-6 h-6" />}
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-slate-900 dark:text-white">Appearance</h3>
                  <p className="text-sm text-slate-500 dark:text-slate-400">Toggle between light and dark themes.</p>
                </div>
              </div>
              <button
                onClick={toggleTheme}
                className="px-4 py-2 text-sm font-semibold rounded-lg bg-slate-100 text-slate-700 hover:bg-slate-200 dark:bg-slate-700 dark:text-white dark:hover:bg-slate-600 transition-colors"
              >
                Switch to {theme === "light" ? "Dark" : "Light"}
              </button>
            </li>

            {/* Notifications */}
            <li className="p-6 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-blue-50 dark:bg-slate-700/50 rounded-xl text-blue-600 dark:text-blue-400">
                  <HiBell className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-slate-900 dark:text-white">Notifications</h3>
                  <p className="text-sm text-slate-500 dark:text-slate-400">Manage email and push notifications.</p>
                </div>
              </div>
              <button className="px-4 py-2 text-sm font-semibold rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition-colors">
                Configure
              </button>
            </li>

            {/* Security */}
            <li className="p-6 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-blue-50 dark:bg-slate-700/50 rounded-xl text-blue-600 dark:text-blue-400">
                  <HiShieldCheck className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-slate-900 dark:text-white">Security</h3>
                  <p className="text-sm text-slate-500 dark:text-slate-400">Update your password and 2FA settings.</p>
                </div>
              </div>
              <button className="px-4 py-2 text-sm font-semibold rounded-lg bg-slate-100 text-slate-700 hover:bg-slate-200 dark:bg-slate-700 dark:text-white dark:hover:bg-slate-600 transition-colors">
                Manage
              </button>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
