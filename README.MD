# Career Advisor Chatbot  
**AI Young Guru 2026 – Team LLMagik**

An AI-powered career advisory chatbot that helps users explore career paths, discover job information, and receive personalized recommendations.

---

## 🚀 Overview

Career Advisor Chatbot is a prototype system designed to:

- Provide career exploration support  
- Suggest relevant job roles  
- Serve a searchable job catalog (1000+ roles from O*NET)  
- Demonstrate LLM-powered conversational guidance  

### Tech Stack

- **Node.js** (Backend)
- **Frontend Web App**
- **SQLite** (Database)
- **Rule-based matching engine** (Prototype)
- **LLM Integration – GPT-OSS 120B**

---

## 📦 Project Structure

```bash
career-advisor-chatbot/
├── backend/
└── frontend/
```

---

## 🛠 Installation & Setup

### 1️⃣ Backend

```bash
cd backend
npm install
npm run setup-db
npm run dev
```

### 2️⃣ Frontend

```bash
cd frontend
npm install
npm run dev
```

---

## 🌐 Production Mode (Single URL Deployment)

Serve frontend from backend:

```bash
cd backend
npm run build      # Run once
npm run start
```

Or run everything with one command:

```bash
npm run serve
```

Access the application at:

```
http://localhost:3001
```

---

## 🔌 API

**Base URL**
***Local***
```
http://localhost:3001
```
***Backend API***
```
https://api-myaichatbotproject.onrender.com
```

---

## 🗄 Database

### Main Database

- Uses **SQLite**
- Automatically initializes on first run
- Custom path configurable via `DB_PATH` environment variable

### Database Commands

| Command | Description |
|---------|------------|
| `npm run setup-db` | Initialize database (skips if exists) |
| `npm run reset-db` | Delete and recreate database |
| Auto-init | Server initializes DB if empty |

---

## 📚 Career Catalog (Job Explorer)

The job catalog uses a separate SQLite database.

### Import 1000+ Jobs from O*NET

```bash
npm --prefix backend run import-jobs
```

### Reset & Re-import

```bash
npm --prefix backend run reset-jobs
```

---

## 📖 Data Source

- **O*NET Database (Text Version)**  
  https://www.onetcenter.org/dl_files/database/db_30_1_text.zip  

- **O*NET License**  
  https://www.onetcenter.org/license_db.html  

---

## 🤖 LLM Integration

**Model Used:** GPT-OSS 120B  
https://console.groq.com/playground?model=openai/gpt-oss-120b

---

## ⚙️ Architecture Notes

- SQLite for lightweight local deployment  
- Rule-based scenario engine (optimized for rapid prototyping)  
- LLM for conversational intelligence  
- Designed for future ML-based matching extension  

---

## 👥 Team LLMagik

- **Phạm Khôi Nguyên**  
  https://github.com/thisIsAnVariableOfACoder  

- **Đinh Quang Minh**  
  https://github.com/minhhdinh192  

- **Vũ Minh Hoàng**  
  https://github.com/GetInHod  
