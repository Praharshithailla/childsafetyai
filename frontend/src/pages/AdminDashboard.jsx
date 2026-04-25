import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  getPendingTeachers,
  updateTeacherStatus
} from "../services/api";

function AdminDashboard() {

  const navigate = useNavigate();

  const [teachers, setTeachers] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [tab, setTab] = useState("pending");
  const [search, setSearch] = useState("");
  const [toast, setToast] = useState("");

  // 🔹 Load teachers
  const loadTeachers = async () => {
    try {
      const token = localStorage.getItem("token");
      const data = await getPendingTeachers(token);

      setTeachers(data);
      setFiltered(data);

    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    const role = localStorage.getItem("role");

    if (!token || role !== "admin") {
      navigate("/admin/login");
      return;
    }

    loadTeachers();
  }, [navigate]);

  // 🔹 Accept / Reject
  const handleAction = async (id, status) => {
    try {
      const token = localStorage.getItem("token");

      await updateTeacherStatus(token, id, status);

      // ✅ Remove instantly (no reload)
      const updated = teachers.filter(t => t.id !== id);
      setTeachers(updated);
      setFiltered(updated);

      // ✅ Toast
      setToast(
        status === "approved"
          ? "✅ Approved successfully"
          : "❌ Rejected successfully"
      );

      setTimeout(() => setToast(""), 3000);

    } catch (err) {
      alert("Action failed");
    }
  };

  // 🔹 Search
  const handleSearch = (value) => {
    setSearch(value);

    const result = teachers.filter(t =>
      t.name.toLowerCase().includes(value.toLowerCase()) ||
      t.email.toLowerCase().includes(value.toLowerCase())
    );

    setFiltered(result);
  };

  return (
    <div style={{ padding: "30px" }}>

      <h1>Admin Dashboard</h1>

      {/* ✅ TOAST */}
      {toast && (
        <div style={{
          background: "#4ade80",
          padding: "10px",
          marginBottom: "15px",
          borderRadius: "6px",
          color: "white"
        }}>
          {toast}
        </div>
      )}

      {/* ✅ TABS */}
      <div style={{ marginBottom: "20px" }}>
        <button
          onClick={() => setTab("pending")}
          style={{
            marginRight: "10px",
            background: tab === "pending" ? "#4f46e5" : "#ccc",
            color: "white",
            border: "none",
            padding: "8px 16px"
          }}
        >
          Pending
        </button>

        <button
          onClick={() => setTab("approved")}
          style={{
            background: tab === "approved" ? "#4f46e5" : "#ccc",
            color: "white",
            border: "none",
            padding: "8px 16px"
          }}
        >
          Approved
        </button>
      </div>

      {/* ✅ SEARCH */}
      <input
        placeholder="Search teacher..."
        value={search}
        onChange={(e) => handleSearch(e.target.value)}
        style={{
          padding: "8px",
          width: "300px",
          marginBottom: "20px"
        }}
      />

      {/* ✅ TABLE */}
      <table style={{ width: "100%" }}>
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            {tab === "pending" && <th>Actions</th>}
          </tr>
        </thead>

        <tbody>

          {filtered.length === 0 && (
            <tr>
              <td colSpan="3">No data</td>
            </tr>
          )}

          {filtered.map(t => (

            <tr key={t.id}>

              <td>{t.name}</td>
              <td>{t.email}</td>

              {tab === "pending" && (
                <td>

                  <button
                    onClick={() => handleAction(t.id, "approved")}
                    style={{
                      marginRight: "10px",
                      background: "green",
                      color: "white",
                      border: "none",
                      padding: "6px 12px"
                    }}
                  >
                    Accept
                  </button>

                  <button
                    onClick={() => handleAction(t.id, "rejected")}
                    style={{
                      background: "red",
                      color: "white",
                      border: "none",
                      padding: "6px 12px"
                    }}
                  >
                    Reject
                  </button>

                </td>
              )}

            </tr>

          ))}

        </tbody>
      </table>

    </div>
  );
}

export default AdminDashboard;