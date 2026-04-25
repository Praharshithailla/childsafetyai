# 🚨 Child Safety AI Monitoring System

## 📌 Overview
The Child Safety AI Monitoring System is a web-based dashboard designed to monitor student behaviour and identify potential risk patterns. It provides educators with insights through interactive analytics and enables proactive intervention.

## 🚀 Features
- Student Behaviour Monitoring Dashboard  
- Risk Level Identification based on predefined metrics  
- Attention-Level Tracking and Analytics  
- Interactive Data Visualization (Charts & Graphs)  
- Automated Parent Alert System for flagged events  
- Role-Based Access Control using JWT (Teacher / Admin)

## 🛠️ Tech Stack
- Frontend: React  
- Backend: Flask (Python)  
- Authentication: JWT (JSON Web Tokens)  
- Database: (Mention yours – MongoDB / SQLite)  

## 🧠 System Design
The system follows a modular and data-driven architecture:

- The frontend communicates with the Flask backend via REST APIs to manage student data and behavioural logs.

- Each student action is recorded as a behaviour log containing:
  - Behaviour Score (0–10)
  - Attention Level (High / Low)

- For risk evaluation, the system considers the **last 3 behaviour logs** to capture recent trends.

- A risk probability score is calculated using a weighted formula:

  Behavior Component = (Average Score / 10) × 100  
  Attention Component = (Low Attention Ratio) × 30  

  Final Probability = (Behavior Component × 0.7) + Attention Component  

- The probability is capped at 100 and classified into:
  - High Risk (≥ 70)
  - Medium Risk (40–69)
  - Low Risk (< 40)

- When risk exceeds the threshold, alerts can be triggered for parents/administrators.

- All results are visualized in dashboards for real-time monitoring and decision-making. 

## 🎥 Demo
(https://drive.google.com/file/d/10BdQcgUjpBO3B16ra7NYNJHNPw5-spCb/view?usp=sharing)

## ⚙️ Setup Instructions

### 🔹 Backend Setup
```bash
cd backend
pip install -r requirements.txt
python app.py
## 📌 Note
Deployment is currently in progress. Please refer to the demo video for full functionality.