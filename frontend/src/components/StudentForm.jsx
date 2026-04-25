import { useState } from "react";

function StudentForm({ initialData, onSubmit, onCancel }) {
  const [form, setForm] = useState(
    initialData || {
      name: "",
      age: "",
      grade: "",
      behavior_score: "",
      attention_level: "Medium"
    }
  );

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = () => {
    onSubmit(form);
  };

  return (
    <div className="modal">
      <div className="modal-content">
        <h3>{initialData ? "Edit Student" : "Add Student"}</h3>

        {!initialData && (
          <>
            <input name="name" placeholder="Name" onChange={handleChange} />
            <input name="age" placeholder="Age" onChange={handleChange} />
            <input name="grade" placeholder="Grade" onChange={handleChange} />
          </>
        )}

        <input
          name="behavior_score"
          placeholder="Behavior Score"
          onChange={handleChange}
        />

        <select name="attention_level" onChange={handleChange}>
          <option>High</option>
          <option>Medium</option>
          <option>Low</option>
        </select>

        <div className="actions">
          <button onClick={handleSubmit}>Save</button>
          <button onClick={onCancel} className="cancel">Cancel</button>
        </div>
      </div>
    </div>
  );
}

export default StudentForm;