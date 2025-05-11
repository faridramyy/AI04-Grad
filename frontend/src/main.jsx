// main.jsx or index.jsx
import React, { useEffect, useState } from "react";
import ReactDOM from "react-dom/client";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import Index from "./pages/index";
import HowItWorks from "./pages/HowItWorks";
import AboutUs from "./pages/AboutUs";
import Avatar from "./pages/Avatar";
import Dashboard from "./pages/Dashboard";
import NotFound from "./pages/404";
import { ChatProvider } from "./hooks/useChat";
import "./index.css";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

// ✅ ProtectedRoute Component
const ProtectedRoute = ({ children }) => {
  const [authChecked, setAuthChecked] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await fetch(`${BACKEND_URL}/api/users/verify_token`, {
          method: "GET",
          credentials: "include",
        });
        const data = await res.json();
        if (!data.isAuthenticated) {
          toast.error("Access denied. Please log in.");
        }
        setIsAuthenticated(data.isAuthenticated);
      } catch (error) {
        toast.error("Failed to verify token. Please try again.");
        setIsAuthenticated(false);
      } finally {
        setAuthChecked(true);
      }
    };

    checkAuth();
  }, []);

  if (!authChecked) {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
        }}
      >
        <div className="spinner"></div>
      </div>
    );
  }

  return isAuthenticated ? children : <Navigate to="/" replace />;
};

// ✅ Main render logic
ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <ChatProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/how-it-works" element={<HowItWorks />} />
          <Route path="/about-us" element={<AboutUs />} />
          <Route
            path="/avatar"
            element={
              <ProtectedRoute>
                <Avatar />
              </ProtectedRoute>
            }
          />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Router>
      <ToastContainer position="top-right" autoClose={3000} hideProgressBar/>
    </ChatProvider>
  </React.StrictMode>
);
