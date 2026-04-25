import { useNavigate } from "react-router-dom";
import { FaUserShield, FaChalkboardTeacher } from "react-icons/fa";
import Lottie from "lottie-react";

import loginAnimation from "../assets/login.json";
import "./RoleSelect.css";

function RoleSelect() {
  const navigate = useNavigate();

  return (
    <div className="role-container">

      <div className="role-wrapper">

        {/* 🔥 LEFT - ANIMATION */}
        <div className="role-animation">
          <Lottie animationData={loginAnimation} loop={true} />
        </div>

        {/* 🔥 RIGHT - CONTENT */}
        <div className="glass-card">

          <h1 className="title">Welcome to Child Safety AI</h1>
          <p className="subtitle">Select your role to continue</p>

          <div className="role-buttons">

            <div
              className="role-card admin"
              onClick={() => navigate("/admin/login")}
            >
              <FaUserShield className="role-icon" />
              <h3>Admin</h3>
              <p>Manage system & approvals</p>
            </div>

            <div
              className="role-card teacher"
              onClick={() => navigate("/teacher/login")}
            >
              <FaChalkboardTeacher className="role-icon" />
              <h3>Teacher</h3>
              <p>Monitor students & insights</p>
            </div>

          </div>

        </div>

      </div>

    </div>
  );
}

export default RoleSelect;