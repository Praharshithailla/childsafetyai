import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import RoleSelect from "./pages/RoleSelect";
import TeacherLogin from "./pages/TeacherLogin";
import AdminLogin from "./pages/AdminLogin";
import Dashboard from "./pages/Dashboard";
import AdminDashboard from "./pages/AdminDashboard";
import StudentDetail from "./pages/StudentDetail";
import TeacherSignup from "./pages/TeacherSignup";

function App() {
  return (
    <BrowserRouter>
      <Routes>

        {/* 🔹 ROLE SELECTION */}
        <Route path="/" element={<RoleSelect />} />

        {/* 🔹 AUTH ROUTES */}
        <Route path="/teacher/login" element={<TeacherLogin />} />
        <Route path="/teacher/signup" element={<TeacherSignup />} />
        <Route path="/admin/login" element={<AdminLogin />} />

        {/* 🔹 DASHBOARDS */}
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/admin/dashboard" element={<AdminDashboard />} />

        {/* 🔹 STUDENT DETAIL */}
        <Route path="/students/:id" element={<StudentDetail />} />

        {/* 🔹 FALLBACK */}
        <Route path="*" element={<Navigate to="/" replace />} />

      </Routes>
    </BrowserRouter>
  );
}

export default App;