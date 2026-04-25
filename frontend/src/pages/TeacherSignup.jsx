import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { teacherSignup } from "../services/api";

function TeacherSignup() {

  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [msg, setMsg] = useState("");
  const [error, setError] = useState("");

  const handleSignup = async () => {
    try {
      const data = await teacherSignup(name, email, password);

      setMsg(data.message);
      setError("");

      setTimeout(() => {
        navigate("/teacher/login");
      }, 2000);

    } catch (err) {
      setError(err.message);
      setMsg("");
    }
  };

  return (
    <div style={{
      height: "100vh",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      background: "linear-gradient(135deg,#6366f1,#ec4899)"
    }}>

      <div style={{
        background: "white",
        padding: "30px",
        borderRadius: "12px",
        width: "320px",
        textAlign: "center"
      }}>

        <h2>Teacher Signup</h2>

        {msg && <p style={{ color: "green" }}>{msg}</p>}
        {error && <p style={{ color: "red" }}>{error}</p>}

        <input
          placeholder="Name"
          onChange={(e)=>setName(e.target.value)}
          style={{ width: "100%", marginBottom: "10px" }}
        />

        <input
          placeholder="Email"
          onChange={(e)=>setEmail(e.target.value)}
          style={{ width: "100%", marginBottom: "10px" }}
        />

        <input
          type="password"
          placeholder="Password"
          onChange={(e)=>setPassword(e.target.value)}
          style={{ width: "100%", marginBottom: "10px" }}
        />

        <button onClick={handleSignup} style={{
          width: "100%",
          padding: "10px",
          background: "#6366f1",
          color: "white",
          border: "none"
        }}>
          Submit Request
        </button>

      </div>

    </div>
  );
}

export default TeacherSignup;