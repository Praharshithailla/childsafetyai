import { useEffect, useState } from "react";
import {
  getStudents,
  getHighRiskStudents,
  addStudent,
  updateStudent,
  deleteStudent
} from "../services/api";

import Sidebar from "../components/Sidebar";
import StudentRow from "../components/StudentRow";
import AddStudentModal from "../components/AddStudentModal";
import RiskChart from "../components/RiskChart";
import Lottie from "lottie-react";
import animationData from "../assets/ai-animation.json";

import {
  FaExclamationTriangle,
  FaChartPie,
  FaUserGraduate,
  FaUsers
} from "react-icons/fa";

import "../styles/dashboard.css";

function Dashboard() {

  const [students, setStudents] = useState([]);
  const [filteredStudents, setFilteredStudents] = useState([]);
  const [highRisk, setHighRisk] = useState([]);

  const [showModal, setShowModal] = useState(false);
  const [error, setError] = useState("");

  const [gradeFilter, setGradeFilter] = useState("All");
  const [attentionFilter, setAttentionFilter] = useState("All");

  const [lastDeleted, setLastDeleted] = useState(null);
  const [showUndoToast, setShowUndoToast] = useState(false);

  const [loading, setLoading] = useState(true);

  /* LOAD DATA */
  const loadData = async () => {
    const token = localStorage.getItem("token");

    if (!token) {
      setError("❌ Please login first");
      setLoading(false);
      return;
    }

    try {
      const studentsData = await getStudents(token);
      const highRiskData = await getHighRiskStudents(token);

      setStudents(studentsData);
      setFilteredStudents(studentsData);
      setHighRisk(highRiskData);

    } catch (err) {
      console.error(err);
      setError("❌ Failed to load data");
    }

    setLoading(false);
  };

  useEffect(() => {
    loadData();
  }, []);

  /* ADD */
  const handleAddStudent = async (student) => {
    const token = localStorage.getItem("token");
    await addStudent(token, student);
    setShowModal(false);
    loadData();
  };

  /* UPDATE */
  const handleUpdate = async (id, behavior_score, attention_level) => {
    const token = localStorage.getItem("token");

    try {
      await updateStudent(token, id, {
        behavior_score: Number(behavior_score),
        attention_level
      });

      loadData();

    } catch {
      alert("Update failed");
    }
  };

  /* DELETE */
  const handleDelete = async (id) => {
    const token = localStorage.getItem("token");

    const student = students.find(s => s.id === id);

    setLastDeleted(student);
    setShowUndoToast(true);

    await deleteStudent(token, id);
    loadData();

    setTimeout(() => {
      setShowUndoToast(false);
      setLastDeleted(null);
    }, 4000);
  };

  /* UNDO */
  const handleUndo = async () => {
    if (!lastDeleted) return;

    const token = localStorage.getItem("token");

    await addStudent(token, lastDeleted);

    setShowUndoToast(false);
    setLastDeleted(null);

    loadData();
  };

  /* FILTER */
  const applyFilters = () => {
    let result = students;

    if (gradeFilter !== "All") {
      result = result.filter(s => s.grade === gradeFilter);
    }

    if (attentionFilter !== "All") {
      result = result.filter(s => s.attention_level === attentionFilter);
    }

    setFilteredStudents(result);
  };

  /* COUNTS */
  const highCount = highRisk.length;
  const mediumCount = students.filter(s => s.risk_level === "Medium").length;
  const lowCount = students.filter(s => s.risk_level === "Low").length;

  /* LOADING */
  if (loading) {
    return <h2 style={{ padding: "20px" }}>Loading...</h2>;
  }

  return (
    <div className="layout">

      <Sidebar />

      <div className="main-content">

        {/* HEADER */}
        <div className="dashboard-header">
          <h1>Child Safety AI Dashboard</h1>
          <p className="ai-tag">AI Monitoring System</p>
        </div>

        {error && <p className="error">{error}</p>}

        {/* CARDS */}
        <div className="cards">
          <div className="card high">
            <FaExclamationTriangle />
            <h2>{highCount}</h2>
            <p>High Risk</p>
          </div>

          <div className="card medium">
            <FaChartPie />
            <h2>{mediumCount}</h2>
            <p>Medium Risk</p>
          </div>

          <div className="card low">
            <FaUserGraduate />
            <h2>{lowCount}</h2>
            <p>Low Risk</p>
          </div>

          <div className="card total">
            <FaUsers />
            <h2>{students.length}</h2>
            <p>Total Students</p>
          </div>
        </div>

        {/* AI INSIGHT */}
        <div className="ai-insight">
          {highRisk.length > 0
            ? `${highRisk.length} students show high-risk behavior`
            : "All students are safe"}
        </div>

        {/* 🔥 ANALYTICS SECTION */}
        

<div id="analytics-section" className="analytics">

  {/* LEFT - CHART */}
  <div className="chart-box">
    <h3>Risk Distribution</h3>
    <RiskChart high={highCount} medium={mediumCount} low={lowCount} />
  </div>

  {/* CENTER - ANIMATION 🔥 */}
  <div className="animation-center">
  <Lottie animationData={animationData} loop={true} />
  <p className="ai-text">AI Monitoring Active</p>
</div>



         <div className="alerts-card">
  <h3>⚠ High Risk Alerts</h3>

  <div className="alerts-list">
    {highRisk.map((student, index) => (
      <div key={index} className="alert-item">
        <span className="alert-name">{student.name}</span>
        <span className="alert-class">{student.class}</span>
      </div>
    ))}
  </div>
</div>

        </div>

        {/* FILTERS */}
        <div className="filters">
          <select onChange={e => setGradeFilter(e.target.value)}>
            <option value="All">All Grades</option>
            <option>5th</option>
            <option>6th</option>
            <option>7th</option>
          </select>

          <select onChange={e => setAttentionFilter(e.target.value)}>
            <option value="All">All Attention</option>
            <option>High</option>
            <option>Medium</option>
            <option>Low</option>
          </select>

          <button onClick={applyFilters}>Apply</button>

          <button onClick={() => setShowModal(true)}>
            + Add Student
          </button>
        </div>

        {/* 🔥 STUDENTS SECTION */}
        <div id="students-section">

          <table className="table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Grade</th>
                <th>Behavior</th>
                <th>Attention</th>
                <th>Risk</th>
                <th>Delete</th>
              </tr>
            </thead>

            <tbody>
              {filteredStudents.map(s => (
                <StudentRow
                  key={s.id}
                  s={s}
                  onUpdate={handleUpdate}
                  onDelete={handleDelete}
                />
              ))}
            </tbody>
          </table>

        </div>

        {/* MODAL */}
        {showModal && (
          <AddStudentModal
            onClose={() => setShowModal(false)}
            onAdd={handleAddStudent}
          />
        )}

        {/* UNDO TOAST */}
        {showUndoToast && lastDeleted && (
          <div className="undo-toast">
            <span>Student deleted</span>
            <button onClick={handleUndo}>Undo</button>
          </div>
        )}

      </div>
    </div>
  );
}

export default Dashboard;