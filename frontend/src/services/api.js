const API_URL = "http://127.0.0.1:5000";

/* ======================
   AUTH APIs
====================== */

export async function teacherLogin(email, password) {
  const res = await fetch(`${API_URL}/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password })
  });

  const data = await res.json();
  if (!res.ok) throw new Error(data.error || "Teacher login failed");
  return data;
}

export async function adminLogin(email, password) {
  const res = await fetch(`${API_URL}/admin/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password })
  });

  const data = await res.json();
  if (!res.ok) throw new Error(data.error || "Admin login failed");
  return data;
}

/* ======================
   ADMIN APIs
====================== */

export async function getPendingTeachers(token) {
  const res = await fetch(`${API_URL}/admin/pending-teachers`, {
    headers: { Authorization: `Bearer ${token}` }
  });

  if (!res.ok) throw new Error("Failed to load pending teachers");
  return res.json();
}

export async function updateTeacherStatus(token, teacher_id, status) {
  const res = await fetch(`${API_URL}/admin/update-teacher-status`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ teacher_id, status })
  });

  const data = await res.json();
  if (!res.ok) throw new Error(data.error || "Update failed");
  return data;
}

/* ======================
   TEACHER APIs
====================== */

export async function getStudents(token) {
  const res = await fetch(`${API_URL}/students`, {
    headers: { Authorization: `Bearer ${token}` }
  });

  if (!res.ok) throw new Error("Unauthorized");
  return res.json();
}

export async function getHighRiskStudents(token) {
  const res = await fetch(`${API_URL}/high-risk`, {
    headers: { Authorization: `Bearer ${token}` }
  });

  if (!res.ok) throw new Error("Unauthorized");
  return res.json();
}

export async function addStudent(token, student) {
  const res = await fetch(`${API_URL}/students`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify(student)
  });

  const data = await res.json();
  if (!res.ok) throw new Error(data.error || "Failed to add student");
  return data;
}

export async function updateStudent(token, id, data) {
  const res = await fetch(`${API_URL}/students/${id}`, {
    method: "PUT",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify(data)
  });

  const result = await res.json();
  if (!res.ok) throw new Error(result.error || "Update failed");
  return result;
}

export async function deleteStudent(token, id) {
  const res = await fetch(`${API_URL}/students/${id}`, {
    method: "DELETE",
    headers: { Authorization: `Bearer ${token}` }
  });

  const data = await res.json();
  if (!res.ok) throw new Error(data.error || "Delete failed");
  return data;
}
export async function getStudentById(token, id) {
  const res = await fetch(`${API_URL}/students/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });

  if (!res.ok) throw new Error("Failed to load student");
  return res.json();
}

export async function getStudentLogs(token, id) {
  const res = await fetch(`${API_URL}/students/${id}/logs`, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });

  if (!res.ok) throw new Error("Failed to load logs");
  return res.json();
}
export async function teacherSignup(name, email, password) {
  const res = await fetch("http://127.0.0.1:5000/signup", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ name, email, password })
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.error || "Signup failed");
  }

  return data;
}