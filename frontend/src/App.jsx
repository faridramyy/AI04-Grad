import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import SignIn from "./pages/SignIn";
import SignUp from "./pages/SignUp";
import Avatar from "./pages/user/Avatar";
import NotFound from "./pages/NotFound";
import Dashboard from "./pages/admin/Dashboard";
import Dashboard2 from "./pages/user/Dashboard";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/sign_in" element={<SignIn />} />
        <Route path="/sign_up" element={<SignUp />} />
        <Route path="/admin" element={<Dashboard/>} />
        <Route path="/user" element={<Dashboard2/>} />
        <Route path="/avatar" element={<Avatar />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
}

export default App;
