import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaUserGraduate, FaEnvelope, FaLock, FaEye, FaEyeSlash } from "react-icons/fa";
import Lottie from "lottie-react";

import educationAnimation from "../assets/Education.json";
import "../styles/auth.css";

function TeacherLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");

  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      setError("");

      const res = await fetch("http://127.0.0.1:5000/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password })
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Login failed");
        return;
      }

      localStorage.setItem("token", data.token);
      localStorage.setItem("role", "teacher");

      navigate("/dashboard");

    } catch (err) {
      setError("Backend not reachable");
    }
  };

  return (
    <div className="auth-container">

      <div className="auth-wrapper">

        {/* 🔥 LEFT - EDUCATION ANIMATION */}
        <div className="left-animation">
          <Lottie animationData={educationAnimation} loop={true} />
        </div>

        {/* 🔥 RIGHT - LOGIN CARD */}
        <div className="auth-card">

          <FaUserGraduate className="auth-icon" />

          <h2>Teacher Portal</h2>
          <p className="sub-text">Child Safety AI System</p>

          {error && <p className="error">{error}</p>}

          {/* EMAIL */}
          <div className="input-group">
            <FaEnvelope />
            <input
              type="text"
              placeholder="Email Address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          {/* PASSWORD */}
          <div className="input-group">
            <FaLock />
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <span
              className="eye-icon"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </span>
          </div>

          <button className="login-btn" onClick={handleLogin}>
            Login
          </button>

          {/* SIGNUP */}
          <p className="signup-text">
            New teacher?
            <span onClick={() => navigate("/teacher/signup")}>
              Request Access
            </span>
          </p>

        </div>

      </div>

    </div>
  );
}

export default TeacherLogin;