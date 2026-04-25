import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { FaArrowLeft, FaUser } from "react-icons/fa";
import { getStudentById, getStudentLogs } from "../services/api";
import {
  LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer
} from "recharts";

import "../styles/studentdetail.css";

function StudentDetails() {

  const { id } = useParams();
  const navigate = useNavigate();

  const [student, setStudent] = useState(null);
  const [logs, setLogs] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem("token");

    const load = async () => {
      const s = await getStudentById(token, id);
      const l = await getStudentLogs(token, id);

      // 🔥 ONLY LAST 5 LOGS
      const lastFive = l.slice(-5);

      setStudent(s);
      setLogs(lastFive);
    };

    load();
  }, [id]);

  if (!student) return <h2>Loading...</h2>;

  return (
    <div className="details-container">

      {/* 🔥 PREMIUM BACK BUTTON */}
      <div className="back-wrapper">
        <button
          className="back-button"
          onClick={() => navigate("/dashboard")}
        >
          <FaArrowLeft /> Back to Dashboard
        </button>
      </div>

      {/* PROFILE */}
      <div className="profile-card">

        <div className="profile-left">
          <FaUser size={40} />
          <div>
            <h2>{student.name}</h2>
            <p>Grade: {student.grade}</p>
          </div>
        </div>

        <div className={`risk-tag ${student.risk_level.toLowerCase()}`}>
          {student.risk_level} Risk
        </div>

      </div>

      {/* STATS */}
      <div className="stats-grid">
        <div className="stat-card">
          <h4>Behavior Score</h4>
          <p>{student.behavior_score}</p>
        </div>

        <div className="stat-card">
          <h4>Attention</h4>
          <p>{student.attention_level}</p>
        </div>

        <div className="stat-card">
          <h4>Risk Probability</h4>
          <p>{student.risk_probability}%</p>
        </div>
      </div>

      {/* PROGRESS */}
      <div className="progress-bar">
        <div
          className="progress-fill"
          style={{ width: `${student.risk_probability}%` }}
        ></div>
      </div>

      {/* AI INSIGHT */}
      <div className="insight-card">
        <h3>🧠 AI Insight</h3>
        <p>
          Pattern shows <b>{student.risk_level}</b> risk behavior recently.
        </p>
      </div>

      {/* 🔥 CHART (LAST 5 LOGS) */}
      <div className="chart-card">
        <h3>Behavior Trend (Last 5 Records)</h3>

        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={logs}>
            <XAxis dataKey="created_at" />
            <YAxis />
            <Tooltip />
            <Line
              type="monotone"
              dataKey="behavior_score"
              stroke="#3b82f6"
              strokeWidth={3}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* 🔥 LOG TABLE */}
      <div className="logs-card">
        <h3>Recent Activity (Last 5 Logs)</h3>

        <table className="logs-table">
          <thead>
            <tr>
              <th>Date</th>
              <th>Behavior</th>
              <th>Attention</th>
            </tr>
          </thead>

          <tbody>
            {logs.map((log, index) => (
              <tr key={index}>
                <td>{log.created_at}</td>
                <td>{log.behavior_score}</td>
                <td>{log.attention_level}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

    </div>
  );
}

export default StudentDetails;