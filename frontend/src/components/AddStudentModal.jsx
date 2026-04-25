import { useState } from "react";

function AddStudentModal({ onClose, onAdd }) {

  const [name, setName] = useState("");
  const [grade, setGrade] = useState("5th");
  const [behavior, setBehavior] = useState(5);
  const [attention, setAttention] = useState("High");

  const handleSubmit = () => {
    onAdd({
      name,
      grade,
      behavior_score: behavior,
      attention_level: attention
    });
  };

  return (
   
  <div className="modal-overlay" onClick={onClose}>
    
    <div 
      className="modal-card" 
      onClick={(e) => e.stopPropagation()}
    >
        <h2>Add Student</h2>

        <input
          placeholder="Student Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <select value={grade} onChange={(e) => setGrade(e.target.value)}>
          <option>5th</option>
          <option>6th</option>
          <option>7th</option>
        </select>

        <input
          type="number"
          min="1"
          max="10"
          value={behavior}
          onChange={(e) => setBehavior(e.target.value)}
        />

        <select value={attention} onChange={(e) => setAttention(e.target.value)}>
          <option>High</option>
          <option>Medium</option>
          <option>Low</option>
        </select>

        <div className="modal-actions">
          <button className="cancel-btn" onClick={onClose}>
            Cancel
          </button>

          <button className="add-btn" onClick={handleSubmit}>
            Add Student
          </button>
        </div>

      </div>
    </div>
  );
}

export default AddStudentModal;