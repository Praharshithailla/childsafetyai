import { FaTrash, FaUser } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

function StudentRow({ s, onUpdate, onDelete }) {

  const navigate = useNavigate();

  const getRiskClass = (risk) => {
    if (risk === "High") return "risk-badge high";
    if (risk === "Medium") return "risk-badge medium";
    return "risk-badge low";
  };

  return (
    <tr>
      <td
        className="student-name"
        onClick={() => navigate(`/students/${s.id}`)}
      >
        <FaUser />
        {s.name}
      </td>

      <td>{s.grade}</td>

      <td>
        <input
          type="number"
          min="1"
          max="10"
          defaultValue={s.behavior_score}
          onBlur={(e) =>
            onUpdate(s.id, e.target.value, s.attention_level)
          }
        />
      </td>

      <td>
        <select
          defaultValue={s.attention_level}
          onChange={(e) =>
            onUpdate(s.id, s.behavior_score, e.target.value)
          }
        >
          <option>High</option>
          <option>Medium</option>
          <option>Low</option>
        </select>
      </td>

      <td>
        <span className={getRiskClass(s.risk_level)}>
          {s.risk_level}
        </span>
      </td>

      <td>
        <button
          className="delete-btn"
          onClick={() => onDelete(s.id)}
        >
          <FaTrash />
        </button>
      </td>
    </tr>
  );
}

export default StudentRow;