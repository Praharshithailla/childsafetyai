import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { adminLogin } from "../services/api";
import { FaUserShield, FaEnvelope, FaLock, FaEye, FaEyeSlash } from "react-icons/fa";
import Lottie from "lottie-react";

import robotAnimation from "../assets/animation.json";
import "../styles/auth.css";

function AdminLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");

  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      const data = await adminLogin(email, password);
      localStorage.setItem("token", data.token);
      localStorage.setItem("role", "admin");
      navigate("/admin/dashboard");
    } catch (e) {
      setError(e.message);
    }
  };

  return (
    <div className="auth-container">

      <div className="auth-wrapper">

        {/* LEFT - ANIMATION */}
        <div className="left-animation">
          <Lottie animationData={robotAnimation} loop={true} />
        </div>

        {/* RIGHT - LOGIN */}
        <div className="auth-card">

          <FaUserShield className="auth-icon" />

          <h2>Admin Portal</h2>
          <p className="sub-text">Child Safety AI System</p>

          {error && <p className="error">{error}</p>}

          {/* EMAIL */}
          <div className="input-group">
            <FaEnvelope />
            <input
              placeholder="Email"
              value={email}
              onChange={e => setEmail(e.target.value)}
            />
          </div>

          {/* PASSWORD */}
          <div className="input-group">
            <FaLock />
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              value={password}
              onChange={e => setPassword(e.target.value)}
            />
            <span
              className="eye-icon"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </span>
          </div>

          <button onClick={handleLogin} className="login-btn">
            Login
          </button>

        </div>

      </div>

    </div>
  );
}

export default AdminLogin;