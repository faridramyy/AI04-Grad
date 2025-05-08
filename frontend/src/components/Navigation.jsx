// components/Navigation.jsx
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Brain, Menu, X } from "lucide-react";

export default function Navigation() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [loginOpen, setLoginOpen] = useState(false);
  const [signupOpen, setSignupOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      {/* Navigation Bar */}
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled ? "bg-[#0F172A]/80 backdrop-blur-lg shadow-lg" : ""
        }`}
      >
        <div className="container mx-auto py-5 px-4 flex justify-between items-center">
          {/* Logo */}
          <Link className="flex items-center gap-2 z-10" to="/">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-violet-600 to-cyan-500 rounded-full blur-sm"></div>
              <div className="relative bg-[#0F172A] p-2 rounded-full">
                <Brain className="h-6 w-6 text-transparent bg-clip-text bg-gradient-to-r from-violet-600 to-cyan-500" />
              </div>
            </div>
            <h1 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-violet-600 to-cyan-500">
              MindfulAI
            </h1>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-6">
            <Link
              className="text-gray-300 hover:text-white hover:bg-white/10 px-4 py-2 rounded-md"
              to="/how-it-works"
            >
              How It Works
            </Link>
            <Link
              className="text-gray-300 hover:text-white hover:bg-white/10 px-4 py-2 rounded-md"
              to="/about-us"
            >
              About Us
            </Link>
            <button
              onClick={() => setLoginOpen(true)}
              className="border border-gray-700 text-gray-300 hover:text-white hover:bg-white/10 hover:border-gray-600 px-4 py-2 rounded-md"
            >
              Login
            </button>
            <button
              onClick={() => setSignupOpen(true)}
              className="bg-gradient-to-r from-violet-600 to-cyan-500 hover:opacity-90 transition-opacity px-4 py-2 rounded-md"
            >
              Sign Up
            </button>
          </nav>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden z-20 p-2 text-white"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? (
              <X className="h-6 w-6" />
            ) : (
              <Menu className="h-6 w-6" />
            )}
          </button>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div className="fixed inset-0 z-10 bg-[#0F172A]/95 backdrop-blur-lg md:hidden">
            <div className="flex flex-col items-center justify-center h-full gap-8">
              <Link
                to="/how-it-works"
                className="text-xl text-gray-300 hover:text-white hover:bg-white/10 px-6 py-3 rounded-md"
                onClick={() => setMobileMenuOpen(false)}
              >
                How It Works
              </Link>
              <Link
                to="/about-us"
                className="text-xl text-gray-300 hover:text-white hover:bg-white/10 px-6 py-3 rounded-md"
                onClick={() => setMobileMenuOpen(false)}
              >
                About Us
              </Link>
              <button
                className="text-xl border border-gray-700 text-gray-300 hover:text-white hover:bg-white/10 px-6 py-3 rounded-md"
                onClick={() => {
                  setMobileMenuOpen(false);
                  setLoginOpen(true);
                }}
              >
                Login
              </button>
              <button
                className="text-xl bg-gradient-to-r from-violet-600 to-cyan-500 hover:opacity-90 transition-opacity px-6 py-3 rounded-md"
                onClick={() => {
                  setMobileMenuOpen(false);
                  setSignupOpen(true);
                }}
              >
                Sign Up
              </button>
            </div>
          </div>
        )}
      </header>

      {/* Login Modal */}
      {loginOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => setLoginOpen(false)}
          />
          <div className="relative bg-[#131A2B]/80 backdrop-blur-xl border border-gray-800 text-white rounded-xl w-full max-w-md p-6">
            <div className="text-right">
              <button
                onClick={() => setLoginOpen(false)}
                className="text-gray-400 hover:text-white"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="mb-6">
              <h2 className="text-xl text-white font-bold">Welcome Back</h2>
              <p className="text-gray-400">
                Continue your journey to mental wellness
              </p>
            </div>
            <div className="space-y-5">
              <input
                type="email"
                placeholder="Email"
                className="w-full bg-[#1E293B] border border-gray-700 text-white placeholder:text-gray-500 focus:border-violet-500 h-12 px-4 rounded-md"
              />
              <input
                type="password"
                placeholder="Password"
                className="w-full bg-[#1E293B] border border-gray-700 text-white placeholder:text-gray-500 focus:border-violet-500 h-12 px-4 rounded-md"
              />
              <button className="w-full h-12 bg-gradient-to-r from-violet-600 to-cyan-500 hover:opacity-90 transition-opacity rounded-md">
                Login
              </button>
              <p className="text-center text-sm text-gray-400">
                Don&apos;t have an account?{" "}
                <button
                  className="text-violet-400 hover:text-violet-300 transition-colors"
                  onClick={() => {
                    setLoginOpen(false);
                    setSignupOpen(true);
                  }}
                >
                  Sign up
                </button>
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Signup Modal */}
      {signupOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => setSignupOpen(false)}
          />
          <div className="relative bg-[#131A2B]/80 backdrop-blur-xl border border-gray-800 text-white rounded-xl w-full max-w-md p-6">
            <div className="text-right">
              <button
                onClick={() => setSignupOpen(false)}
                className="text-gray-400 hover:text-white"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="mb-6">
              <h2 className="text-xl text-white font-bold">
                Start Your Journey
              </h2>
              <p className="text-gray-400">
                Create your account to begin healing
              </p>
            </div>
            <div className="space-y-5">
              <input
                placeholder="Full Name"
                className="w-full bg-[#1E293B] border border-gray-700 text-white placeholder:text-gray-500 focus:border-violet-500 h-12 px-4 rounded-md"
              />
              <input
                type="email"
                placeholder="Email"
                className="w-full bg-[#1E293B] border border-gray-700 text-white placeholder:text-gray-500 focus:border-violet-500 h-12 px-4 rounded-md"
              />
              <input
                type="password"
                placeholder="Password"
                className="w-full bg-[#1E293B] border border-gray-700 text-white placeholder:text-gray-500 focus:border-violet-500 h-12 px-4 rounded-md"
              />
              <button className="w-full h-12 bg-gradient-to-r from-violet-600 to-cyan-500 hover:opacity-90 transition-opacity rounded-md">
                Create Account
              </button>
              <p className="text-center text-sm text-gray-400">
                Already have an account?{" "}
                <button
                  className="text-violet-400 hover:text-violet-300 transition-colors"
                  onClick={() => {
                    setSignupOpen(false);
                    setLoginOpen(true);
                  }}
                >
                  Login
                </button>
              </p>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
