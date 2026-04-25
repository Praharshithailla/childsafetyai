import sqlite3
import csv
import hashlib

DB_PATH = "data.db"
CSV_PATH = "../../data/dummy_student_data.csv"

conn = sqlite3.connect(DB_PATH)
cursor = conn.cursor()

# =============================
# CLEAN START
# =============================
cursor.execute("DROP TABLE IF EXISTS students")
cursor.execute("DROP TABLE IF EXISTS teachers")
cursor.execute("DROP TABLE IF EXISTS teacher_master")

# =============================
# STUDENTS TABLE
# =============================
cursor.execute("""
CREATE TABLE students (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT,
    age INTEGER,
    grade TEXT,
    behavior_score INTEGER,
    attention_level TEXT,
    risk_level TEXT
)
""")

# =============================
# LOAD STUDENT DATA FROM CSV
# =============================
with open(CSV_PATH, newline='', encoding="utf-8") as csvfile:
    reader = csv.DictReader(csvfile)
    for row in reader:
        cursor.execute("""
            INSERT INTO students
            (name, age, grade, behavior_score, attention_level, risk_level)
            VALUES (?, ?, ?, ?, ?, ?)
        """, (
            row["name"],
            int(row["age"]),
            row["grade"],
            int(row["behavior_score"]),
            row["attention_level"],
            row["risk_level"]
        ))

# =============================
# TEACHERS TABLE
# (App users – signup requests + approved)
# =============================
cursor.execute("""
CREATE TABLE teachers (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT,
    email TEXT UNIQUE,
    password_hash TEXT,
    role TEXT,
    status TEXT
)
""")

# =============================
# TEACHER MASTER TABLE
# (Official school records – HR list)
# =============================
cursor.execute("""
CREATE TABLE teacher_master (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT,
    email TEXT UNIQUE,
    employee_id TEXT
)
""")

# =============================
# INSERT OFFICIAL TEACHERS
# (Hybrid verification base)
# =============================
cursor.execute("""
INSERT INTO teacher_master (name, email, employee_id)
VALUES (?, ?, ?)
""", (
    "Class Teacher",
    "teacher@school.com",
    "TCH001"
))

cursor.execute("""
INSERT INTO teacher_master (name, email, employee_id)
VALUES (?, ?, ?)
""", (
    "Math Teacher",
    "math@school.com",
    "TCH002"
))

# =============================
# PASSWORD HASH FUNCTION
# =============================
def hash_password(password):
    return hashlib.sha256(password.encode()).hexdigest()

# =============================
# DEFAULT ADMIN USER
# =============================
cursor.execute("""
INSERT INTO teachers
(name, email, password_hash, role, status)
VALUES (?, ?, ?, ?, ?)
""", (
    "School Admin",
    "admin@school.com",
    hash_password("admin123"),
    "admin",
    "active"
))

# =============================
# COMMIT & CLOSE
# =============================
conn.commit()
conn.close()

print("Database initialized with students, teacher master, and admin user.")
