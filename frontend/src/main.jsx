import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Index from "./pages/index";     
import Avatar from "./pages/Avatar";     
import Dashboard from "./pages/Dashboard";
import { ChatProvider } from "./hooks/useChat";
import "./index.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <ChatProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/avatar" element={<Avatar />} />
          <Route path="/dashboard" element={<Dashboard />} />
        </Routes>
      </Router>
    </ChatProvider>
  </React.StrictMode>
);
