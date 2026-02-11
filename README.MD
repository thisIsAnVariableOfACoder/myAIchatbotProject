# 🚀 Career Advisor Chatbot  
### AI Young Guru 2026 – Team LLMagik  

An AI-powered career advisory chatbot that helps users explore career paths, discover job information, and receive personalized recommendations using LLM technology.

---

## 🌟 Overview

**Career Advisor Chatbot** is a prototype intelligent system designed to:

- 🔎 Support career exploration  
- 💼 Suggest relevant job roles based on user input  
- 📚 Provide a searchable job catalog (1000+ roles from O*NET)  
- 🤖 Deliver LLM-powered conversational guidance  

---

## 🧰 Tech Stack

| Layer      | Technology |
|------------|------------|
| Backend    | Node.js |
| Frontend   | Web Application |
| Database   | SQLite |
| AI Engine  | GPT-OSS 120B |
| Matching   | Rule-based Engine (Prototype) |

---

## 📁 Project Structure

```bash
career-advisor-chatbot/
├── backend/      # API server, database, AI integration
└── frontend/     # Web client application
```

---

## 🛠 Installation & Setup

### 1️⃣ Backend Setup

```bash
cd backend
npm install
npm run setup-db
npm run dev
```

### 2️⃣ Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

---

## 🌐 Production Mode (Single URL Deployment)

Serve frontend directly from backend:

```bash
cd backend
npm run build      # Run once to build frontend
npm run start
```

Or run everything with a single command from root:

```bash
npm run serve
```

Access the application at:

```
http://localhost:3001
```

---

## 🔌 API Endpoints

### Local Development

```
http://localhost:3001
```

### Deployed Backend API

```
https://api-myaichatbotproject.onrender.com
```

---

## 🗄 Database

### Main Database

- Uses **SQLite**
- Automatically initializes on first run
- Custom database path configurable via `DB_PATH` environment variable

### Database Commands

| Command | Description |
|---------|------------|
| `npm run setup-db` | Initialize database (skips if already exists) |
| `npm run reset-db` | Delete and recreate database |
| Auto-init | Server initializes DB automatically if empty |

---

## 📚 Career Catalog (Job Explorer)

The job catalog is stored in a separate SQLite database.

### 📥 Import 1000+ Jobs from O*NET

```bash
npm --prefix backend run import-jobs
```

### 🔄 Reset & Re-import Jobs

```bash
npm --prefix backend run reset-jobs
```

---

## 📖 Data Source

- **O*NET Database (Text Version)**  
  https://www.onetcenter.org/dl_files/database/db_30_1_text.zip  

- **O*NET License Information**  
  https://www.onetcenter.org/license_db.html  

---

## 🤖 LLM Integration

- **Model:** GPT-OSS 120B  
- **Provider Playground:**  
  https://console.groq.com/playground?model=openai/gpt-oss-120b  

Used for conversational intelligence, contextual understanding, and personalized career guidance.

---

## ⚙️ Architecture Notes

- 🪶 SQLite for lightweight local deployment  
- 🧠 Rule-based matching engine (optimized for rapid prototyping)  
- 🤖 LLM integration for advanced conversational support  
- 🔮 Designed for future ML-based recommendation system expansion  

---

## 👥 Team LLMagik

- **Phạm Khôi Nguyên**  
  https://github.com/thisIsAnVariableOfACoder  

- **Đinh Quang Minh**  
  https://github.com/minhhdinh192  

- **Vũ Minh Hoàng**  
  https://github.com/GetInHod  
