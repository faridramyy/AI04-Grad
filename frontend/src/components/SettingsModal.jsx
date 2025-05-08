"use client";

import { useState } from "react";

export default function SettingsModal({ onClose }) {
  const [activeTab, setActiveTab] = useState("account");
  const [notifications, setNotifications] = useState({
    email: true,
    sms: false,
    browser: true,
    sessionReminders: true,
    newFeatures: true,
  });
  const [theme, setTheme] = useState("dark");
  const [fontSize, setFontSize] = useState("medium");
  const [language, setLanguage] = useState("english");

  const handleNotificationChange = (setting) => {
    setNotifications({
      ...notifications,
      [setting]: !notifications[setting],
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="bg-gray-900/90 backdrop-blur-lg rounded-xl shadow-2xl w-full max-w-md border border-white/10 overflow-hidden">
        <div className="flex justify-between items-center p-4 border-b border-gray-700">
          <h2 className="text-xl font-bold text-white">Settings</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-gray-700">
          <button
            className={`px-4 py-2 text-sm font-medium ${
              activeTab === "account"
                ? "text-cyan-400 border-b-2 border-cyan-400"
                : "text-gray-300 hover:text-white"
            }`}
            onClick={() => setActiveTab("account")}
          >
            Account
          </button>
          <button
            className={`px-4 py-2 text-sm font-medium ${
              activeTab === "notifications"
                ? "text-cyan-400 border-b-2 border-cyan-400"
                : "text-gray-300 hover:text-white"
            }`}
            onClick={() => setActiveTab("notifications")}
          >
            Notifications
          </button>
          <button
            className={`px-4 py-2 text-sm font-medium ${
              activeTab === "appearance"
                ? "text-cyan-400 border-b-2 border-cyan-400"
                : "text-gray-300 hover:text-white"
            }`}
            onClick={() => setActiveTab("appearance")}
          >
            Appearance
          </button>
        </div>

        <div className="p-4">
          {activeTab === "account" && (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  Email
                </label>
                <input
                  type="email"
                  className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
                  defaultValue="user@example.com"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  Password
                </label>
                <button className="px-4 py-2 bg-gray-800 hover:bg-gray-700 text-white rounded-md text-sm">
                  Change Password
                </button>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  Language
                </label>
                <select
                  value={language}
                  onChange={(e) => setLanguage(e.target.value)}
                  className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
                >
                  <option value="english">English</option>
                  <option value="spanish">Spanish</option>
                  <option value="french">French</option>
                  <option value="german">German</option>
                  <option value="japanese">Japanese</option>
                </select>
              </div>
            </div>
          )}

          {activeTab === "notifications" && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-gray-300">Email Notifications</span>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={notifications.email}
                    onChange={() => handleNotificationChange("email")}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-gradient-to-r peer-checked:from-violet-600 peer-checked:to-cyan-500"></div>
                </label>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-300">SMS Notifications</span>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={notifications.sms}
                    onChange={() => handleNotificationChange("sms")}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-gradient-to-r peer-checked:from-violet-600 peer-checked:to-cyan-500"></div>
                </label>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-300">Browser Notifications</span>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={notifications.browser}
                    onChange={() => handleNotificationChange("browser")}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-gradient-to-r peer-checked:from-violet-600 peer-checked:to-cyan-500"></div>
                </label>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-300">Session Reminders</span>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={notifications.sessionReminders}
                    onChange={() =>
                      handleNotificationChange("sessionReminders")
                    }
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-gradient-to-r peer-checked:from-violet-600 peer-checked:to-cyan-500"></div>
                </label>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-300">New Features & Updates</span>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={notifications.newFeatures}
                    onChange={() => handleNotificationChange("newFeatures")}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-gradient-to-r peer-checked:from-violet-600 peer-checked:to-cyan-500"></div>
                </label>
              </div>
            </div>
          )}

          {activeTab === "appearance" && (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Theme
                </label>
                <div className="flex space-x-2">
                  <button
                    onClick={() => setTheme("dark")}
                    className={`px-4 py-2 rounded-md text-sm ${
                      theme === "dark"
                        ? "bg-gradient-to-r from-violet-600 to-cyan-500 text-white"
                        : "bg-gray-800 text-gray-300 hover:bg-gray-700"
                    }`}
                  >
                    Dark
                  </button>
                  <button
                    onClick={() => setTheme("light")}
                    className={`px-4 py-2 rounded-md text-sm ${
                      theme === "light"
                        ? "bg-gradient-to-r from-violet-600 to-cyan-500 text-white"
                        : "bg-gray-800 text-gray-300 hover:bg-gray-700"
                    }`}
                  >
                    Light
                  </button>
                  <button
                    onClick={() => setTheme("system")}
                    className={`px-4 py-2 rounded-md text-sm ${
                      theme === "system"
                        ? "bg-gradient-to-r from-violet-600 to-cyan-500 text-white"
                        : "bg-gray-800 text-gray-300 hover:bg-gray-700"
                    }`}
                  >
                    System
                  </button>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Font Size
                </label>
                <div className="flex space-x-2">
                  <button
                    onClick={() => setFontSize("small")}
                    className={`px-4 py-2 rounded-md text-sm ${
                      fontSize === "small"
                        ? "bg-gradient-to-r from-violet-600 to-cyan-500 text-white"
                        : "bg-gray-800 text-gray-300 hover:bg-gray-700"
                    }`}
                  >
                    Small
                  </button>
                  <button
                    onClick={() => setFontSize("medium")}
                    className={`px-4 py-2 rounded-md text-sm ${
                      fontSize === "medium"
                        ? "bg-gradient-to-r from-violet-600 to-cyan-500 text-white"
                        : "bg-gray-800 text-gray-300 hover:bg-gray-700"
                    }`}
                  >
                    Medium
                  </button>
                  <button
                    onClick={() => setFontSize("large")}
                    className={`px-4 py-2 rounded-md text-sm ${
                      fontSize === "large"
                        ? "bg-gradient-to-r from-violet-600 to-cyan-500 text-white"
                        : "bg-gray-800 text-gray-300 hover:bg-gray-700"
                    }`}
                  >
                    Large
                  </button>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Animation
                </label>
                <div className="flex items-center justify-between">
                  <span className="text-gray-300">Enable animations</span>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      defaultChecked={true}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-gradient-to-r peer-checked:from-violet-600 peer-checked:to-cyan-500"></div>
                  </label>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="p-4 border-t border-gray-700 flex justify-end space-x-2">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-800 hover:bg-gray-700 text-white rounded-md text-sm"
          >
            Cancel
          </button>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gradient-to-r from-violet-600 to-cyan-500 hover:from-violet-700 hover:to-cyan-600 text-white rounded-md text-sm"
          >
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
}
