import { useState, useRef, useEffect } from "react";
import SettingsModal from "./SettingsModal";
import { Link } from "react-router-dom";
const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

export default function ProfilePic() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const menuRef = useRef(null);
  const buttonRef = useRef(null);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const openSettings = () => {
    setIsSettingsOpen(true);
    setIsMenuOpen(false); // Close menu when opening settings
  };

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        menuRef.current &&
        !menuRef.current.contains(event.target) &&
        !buttonRef.current.contains(event.target)
      ) {
        setIsMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="fixed top-4 right-4 z-50">
      <button
        ref={buttonRef}
        onClick={toggleMenu}
        className="bg-gradient-to-r from-violet-600 to-cyan-500 hover:opacity-90 transition-opacity text-white p-4 rounded-full shadow-lg"
        aria-label="Profile menu"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 448 512"
          className="w-5 h-5"
          fill="white"
        >
          <path d="M304 128a80 80 0 1 0 -160 0 80 80 0 1 0 160 0zM96 128a128 128 0 1 1 256 0A128 128 0 1 1 96 128zM49.3 464l349.5 0c-8.9-63.3-63.3-112-129-112l-91.4 0c-65.7 0-120.1 48.7-129 112zM0 482.3C0 383.8 79.8 304 178.3 304l91.4 0C368.2 304 448 383.8 448 482.3c0 16.4-13.3 29.7-29.7 29.7L29.7 512C13.3 512 0 498.7 0 482.3z" />
        </svg>
      </button>

      {isMenuOpen && (
        <div
          ref={menuRef}
          className="absolute right-0 mt-2 w-48 bg-gray-900/80 backdrop-blur-lg rounded-md shadow-lg py-1 z-50 border border-white/10"
        >
          <Link
            to="/dashboard"
            className="flex items-center w-full text-left px-4 py-2 text-sm text-gray-100 hover:bg-gray-800/50"
          >
            <svg
              className="w-4 h-4 mr-2"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              viewBox="0 0 24 24"
            >
              <path d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-4 0h4" />
            </svg>
            Dashboard
          </Link>

          <button
            className="flex items-center w-full text-left px-4 py-2 text-sm text-gray-100 hover:bg-gray-800/50"
            onClick={openSettings}
          >
            <svg
              className="w-4 h-4 mr-2"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              viewBox="0 0 24 24"
            >
              <path d="M12 8v4l3 3M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Settings
          </button>

          <div className="border-t border-gray-700 my-1"></div>

          <button
            className="flex items-center w-full text-left px-4 py-2 text-sm text-red-400 hover:bg-gray-800/50"
            onClick={async () => {
              await fetch(`${BACKEND_URL}/api/users/logout`, {
                method: "POST",
                credentials: "include", // Important to send cookies
              });
              window.location.href = "/";
            }}
          >
            <svg
              className="w-4 h-4 mr-2 text-red-400"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              viewBox="0 0 24 24"
            >
              <path d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a2 2 0 11-4 0v-1m0-8v-1a2 2 0 114 0v1" />
            </svg>
            Log out
          </button>
        </div>
      )}

      {isSettingsOpen && (
        <SettingsModal onClose={() => setIsSettingsOpen(false)} />
      )}
    </div>
  );
}
