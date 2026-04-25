-- ======================
-- STUDENTS
-- ======================

SELECT * FROM students;

SELECT name, behavior_score, attention_level, risk_level FROM students;


-- ======================
-- TEACHERS TABLE
-- ======================

SELECT name, email, role, status FROM teachers;

-- Activate main teacher
UPDATE teachers
SET status = 'active'
WHERE email = 'teacher@school.com';


-- ======================
-- ADD PASSWORD COLUMN (RUN ONLY ONCE)
-- ======================

ALTER TABLE teachers ADD COLUMN password TEXT;


-- ======================
-- SET PASSWORDS (MANUAL)
-- ======================

UPDATE teachers SET password = 'teacher123' WHERE email = 'teacher@school.com';
UPDATE teachers SET password = 'math123' WHERE email = 'math@school.com';
UPDATE teachers SET password = 'english123' WHERE email = 'english@school.com';
UPDATE teachers SET password = 'physics123' WHERE email = 'physics@school.com';
UPDATE teachers SET password = 'chem123' WHERE email = 'chemistry@school.com';
UPDATE teachers SET password = 'bio123' WHERE email = 'biology@school.com';
UPDATE teachers SET password = 'science123' WHERE email = 'science@school.com';
UPDATE teachers SET password = 'social123' WHERE email = 'social@school.com';
UPDATE teachers SET password = 'history123' WHERE email = 'history@school.com';
UPDATE teachers SET password = 'geo123' WHERE email = 'geo@school.com';

SELECT name, email, password FROM teachers;


-- ======================
-- TEACHER MASTER (SAFE INSERTS)
-- ======================



INSERT INTO teacher_master (name, email, employee_id)
SELECT 'Social Teacher', 'social@school.com', 'TCH004'
WHERE NOT EXISTS (
  SELECT 1 FROM teacher_master WHERE email='social@school.com'
);

INSERT INTO teacher_master (name, email, employee_id)
SELECT 'Math Teacher', 'math@school.com', 'TCH005'
WHERE NOT EXISTS (
  SELECT 1 FROM teacher_master WHERE email='math@school.com'
);

INSERT INTO teacher_master (name, email, employee_id)
SELECT 'English Teacher', 'english@school.com', 'TCH006'
WHERE NOT EXISTS (
  SELECT 1 FROM teacher_master WHERE email='english@school.com'
);

INSERT INTO teacher_master (name, email, employee_id)
SELECT 'Physics Teacher', 'physics@school.com', 'TCH007'
WHERE NOT EXISTS (
  SELECT 1 FROM teacher_master WHERE email='physics@school.com'
);

INSERT INTO teacher_master (name, email, employee_id)
SELECT 'Chemistry Teacher', 'chemistry@school.com', 'TCH008'
WHERE NOT EXISTS (
  SELECT 1 FROM teacher_master WHERE email='chemistry@school.com'
);

INSERT INTO teacher_master (name, email, employee_id)
SELECT 'Biology Teacher', 'biology@school.com', 'TCH009'
WHERE NOT EXISTS (
  SELECT 1 FROM teacher_master WHERE email='biology@school.com'
);

INSERT INTO teacher_master (name, email, employee_id)
SELECT 'History Teacher', 'history@school.com', 'TCH010'
WHERE NOT EXISTS (
  SELECT 1 FROM teacher_master WHERE email='history@school.com'
);

INSERT INTO teacher_master (name, email, employee_id)
SELECT 'Geography Teacher', 'geo@school.com', 'TCH011'
WHERE NOT EXISTS (
  SELECT 1 FROM teacher_master WHERE email='geo@school.com'
);

SELECT * FROM teacher_master;


-- ======================
-- CLEANUP (OPTIONAL SAFE DELETE)
-- ======================

DELETE FROM teachers WHERE email='sociale@school.com';
DELETE FROM teacher_master WHERE email='sociale@school.com';


-- ======================
-- BEHAVIOR LOGS
-- ======================

CREATE TABLE IF NOT EXISTS behavior_logs (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    student_id INTEGER,
    behavior_score INTEGER,
    attention_level TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY(student_id) REFERENCES students(id)
);

SELECT * FROM behavior_logs;


-- ======================
-- STUDENT ALTER
-- ======================

-- RUN ONLY ONCE
ALTER TABLE students ADD COLUMN risk_probability INTEGER DEFAULT 0;


-- ======================
-- PARENTS TABLE
-- ======================

CREATE TABLE IF NOT EXISTS parents (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    student_id INTEGER,
    parent_email TEXT
);

INSERT INTO parents (student_id, parent_email)
SELECT 5, 'praharshithailla@gmail.com'
WHERE NOT EXISTS (
  SELECT 1 FROM parents WHERE parent_email='praharshithailla@gmail.com'
);

SELECT * FROM parents;