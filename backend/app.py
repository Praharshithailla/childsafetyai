from flask import Flask, jsonify, request
import sqlite3
from flask_cors import CORS
import hashlib
import jwt
import datetime
from functools import wraps
import smtplib
from email.mime.text import MIMEText

app = Flask(__name__)
CORS(app)

SECRET_KEY = "child_safety_secret_key"

# =========================
# DATABASE
# =========================
def get_db():
    conn = sqlite3.connect("database/data.db")
    conn.row_factory = sqlite3.Row
    return conn

# =========================
# JWT PROTECTOR
# =========================
def token_required(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        token = None
        auth = request.headers.get("Authorization")

        if auth and auth.startswith("Bearer "):
            token = auth.split(" ")[1]

        if not token:
            return jsonify({"error": "Token missing"}), 401

        try:
            data = jwt.decode(token, SECRET_KEY, algorithms=["HS256"])
            request.user_id = data["user_id"]
            request.role = data["role"]
        except:
            return jsonify({"error": "Invalid token"}), 401

        return f(*args, **kwargs)
    return decorated

# =========================
# EMAIL FUNCTION
# =========================
def send_parent_email(to_email, student_name, probability):
    sender_email = "your_email@gmail.com"
    app_password = "your_app_password"

    msg = MIMEText(f"{student_name} is at HIGH risk ({probability}%)")
    msg["Subject"] = "🚨 Alert"
    msg["From"] = sender_email
    msg["To"] = to_email

    try:
        server = smtplib.SMTP("smtp.gmail.com", 587)
        server.starttls()
        server.login(sender_email, app_password)
        server.send_message(msg)
        server.quit()
        return True
    except:
        return False

# =========================
# RISK CALCULATION
# =========================
def calculate_probability(logs):
    scores = [log["behavior_score"] for log in logs]
    avg_score = sum(scores) / len(scores)

    low_count = sum(1 for log in logs if log["attention_level"] == "Low")
    low_ratio = low_count / len(logs)

    behavior_component = (avg_score / 10) * 100
    attention_component = low_ratio * 30

    probability = int(min(100, behavior_component * 0.7 + attention_component))

    if probability >= 70:
        risk = "High"
    elif probability >= 40:
        risk = "Medium"
    else:
        risk = "Low"

    return risk, probability

# =========================
# SIGNUP (PENDING)
# =========================
@app.route("/signup", methods=["POST"])
def signup():
    data = request.json

    name = data.get("name")
    email = data.get("email")
    password = data.get("password")

    conn = get_db()
    cur = conn.cursor()

    cur.execute("SELECT * FROM teacher_master WHERE email=?", (email,))
    if not cur.fetchone():
        return jsonify({"error": "Not authorized teacher"}), 403

    cur.execute("SELECT * FROM teachers WHERE email=?", (email,))
    if cur.fetchone():
        return jsonify({"error": "Already registered"}), 400

    password_hash = hashlib.sha256(password.encode()).hexdigest()

    cur.execute("""
        INSERT INTO teachers (name, email, password_hash, role, status)
        VALUES (?, ?, ?, 'teacher', 'pending')
    """, (name, email, password_hash))

    conn.commit()
    conn.close()

    return jsonify({"message": "Signup request sent"})

# =========================
# TEACHER LOGIN
# =========================
@app.route("/login", methods=["POST"])
def teacher_login():
    data = request.json

    email = data.get("email")
    password = data.get("password")

    password_hash = hashlib.sha256(password.encode()).hexdigest()

    conn = get_db()
    cur = conn.cursor()

    cur.execute("""
        SELECT id, role, status
        FROM teachers
        WHERE email=? AND password_hash=?
    """, (email, password_hash))

    user = cur.fetchone()
    conn.close()

    if not user:
        return jsonify({"error": "Invalid credentials"}), 401

    if user["status"] != "active":
        return jsonify({"error": "Wait for admin approval"}), 403

    token = jwt.encode({
        "user_id": user["id"],
        "role": "teacher",
        "exp": datetime.datetime.utcnow() + datetime.timedelta(hours=2)
    }, SECRET_KEY, algorithm="HS256")

    return jsonify({"token": token})

# =========================
# ADMIN LOGIN
# =========================
@app.route("/admin/login", methods=["POST"])
def admin_login():
    data = request.json

    email = data.get("email")
    password = data.get("password")

    password_hash = hashlib.sha256(password.encode()).hexdigest()

    conn = get_db()
    cur = conn.cursor()

    cur.execute("""
        SELECT id FROM teachers
        WHERE email=? AND password_hash=? AND role='admin'
    """, (email, password_hash))

    admin = cur.fetchone()
    conn.close()

    if not admin:
        return jsonify({"error": "Invalid admin"}), 401

    token = jwt.encode({
        "user_id": admin["id"],
        "role": "admin",
        "exp": datetime.datetime.utcnow() + datetime.timedelta(hours=2)
    }, SECRET_KEY, algorithm="HS256")

    return jsonify({"token": token})

# =========================
# ADMIN APIs
# =========================
@app.route("/admin/pending-teachers", methods=["GET"])
@token_required
def get_pending_teachers():
    if request.role != "admin":
        return jsonify({"error": "Admin only"}), 403

    conn = get_db()
    cur = conn.cursor()

    cur.execute("SELECT id, name, email FROM teachers WHERE status='pending'")
    rows = cur.fetchall()

    conn.close()

    return jsonify([dict(r) for r in rows])

@app.route("/admin/update-teacher-status", methods=["POST"])
@token_required
def update_teacher_status():
    if request.role != "admin":
        return jsonify({"error": "Admin only"}), 403

    data = request.json
    teacher_id = data.get("teacher_id")
    status = data.get("status")

    new_status = "active" if status == "approved" else "rejected"

    conn = get_db()
    cur = conn.cursor()

    cur.execute("UPDATE teachers SET status=? WHERE id=?", (new_status, teacher_id))

    conn.commit()
    conn.close()

    return jsonify({"message": "Updated"})

# =========================
# STUDENTS APIs
# =========================
@app.route("/students", methods=["POST"])
@token_required
def add_student():
    if request.role != "teacher":
        return jsonify({"error": "Teacher only"}), 403

    data = request.json

    name = data.get("name")
    grade = data.get("grade")
    behavior_score = int(data.get("behavior_score"))
    attention_level = data.get("attention_level")

    behavior_component = (behavior_score / 10) * 100
    attention_component = 30 if attention_level == "Low" else 0

    probability = int(min(100, behavior_component * 0.7 + attention_component))

    risk = "High" if probability >= 70 else "Medium" if probability >= 40 else "Low"

    conn = get_db()
    cur = conn.cursor()

    cur.execute("""
        INSERT INTO students
        (name, grade, behavior_score, attention_level, risk_level, risk_probability)
        VALUES (?, ?, ?, ?, ?, ?)
    """, (name, grade, behavior_score, attention_level, risk, probability))

    student_id = cur.lastrowid

    cur.execute("""
        INSERT INTO behavior_logs (student_id, behavior_score, attention_level)
        VALUES (?, ?, ?)
    """, (student_id, behavior_score, attention_level))

    conn.commit()
    conn.close()

    return jsonify({"message": "Student added"})

@app.route("/students", methods=["GET"])
@token_required
def get_students():
    conn = get_db()
    cur = conn.cursor()

    cur.execute("SELECT * FROM students")
    rows = cur.fetchall()

    conn.close()

    return jsonify([dict(r) for r in rows])

# 🔥 THIS WAS MISSING (IMPORTANT)
@app.route("/students/<int:student_id>", methods=["GET"])
@token_required
def get_single_student(student_id):
    conn = get_db()
    cur = conn.cursor()

    cur.execute("SELECT * FROM students WHERE id=?", (student_id,))
    student = cur.fetchone()

    conn.close()

    if not student:
        return jsonify({"error": "Not found"}), 404

    return jsonify(dict(student))

# 🔥 THIS WAS MISSING (IMPORTANT)
@app.route("/students/<int:student_id>/logs", methods=["GET"])
@token_required
def get_student_logs(student_id):
    conn = get_db()
    cur = conn.cursor()

    cur.execute("""
        SELECT behavior_score, attention_level, created_at
        FROM behavior_logs
        WHERE student_id=?
        ORDER BY created_at ASC
    """, (student_id,))

    logs = cur.fetchall()
    conn.close()

    return jsonify([dict(l) for l in logs])

@app.route("/students/<int:student_id>", methods=["PUT"])
@token_required
def update_student(student_id):

    data = request.json
    behavior_score = int(data.get("behavior_score"))
    attention_level = data.get("attention_level")

    conn = get_db()
    cur = conn.cursor()

    cur.execute("""
        INSERT INTO behavior_logs (student_id, behavior_score, attention_level)
        VALUES (?, ?, ?)
    """, (student_id, behavior_score, attention_level))

    cur.execute("""
        SELECT behavior_score, attention_level
        FROM behavior_logs
        WHERE student_id=?
        ORDER BY created_at DESC
        LIMIT 3
    """, (student_id,))

    logs = cur.fetchall()

    risk, probability = calculate_probability(logs)

    cur.execute("""
        UPDATE students
        SET behavior_score=?, attention_level=?, risk_level=?, risk_probability=?
        WHERE id=?
    """, (behavior_score, attention_level, risk, probability, student_id))

    conn.commit()
    conn.close()

    return jsonify({"message": "Updated"})

@app.route("/students/<int:student_id>", methods=["DELETE"])
@token_required
def delete_student(student_id):
    conn = get_db()
    cur = conn.cursor()

    cur.execute("DELETE FROM students WHERE id=?", (student_id,))

    conn.commit()
    conn.close()

    return jsonify({"message": "Deleted"})
@app.route("/high-risk", methods=["GET"])
@token_required
def get_high_risk_students():
    conn = get_db()
    cur = conn.cursor()

    cur.execute("SELECT * FROM students WHERE risk_level='High'")
    rows = cur.fetchall()

    conn.close()

    return jsonify([dict(r) for r in rows])

# =========================
# RUN
# =========================
import os

if __name__ == "__main__":
    port = int(os.environ.get("PORT", 5000))
    app.run(host="0.0.0.0", port=port)