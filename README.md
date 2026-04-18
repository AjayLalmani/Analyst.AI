# 🤖 Analyst.AI

**Analyst.AI** is an AI-powered CSV data analysis tool that lets you upload a spreadsheet, have a conversation with your data, and instantly generate interactive charts — all through a sleek, modern chat interface.

---

## ✨ Features

- 📁 **CSV Upload** — Drag and drop or browse to upload your CSV files
- 💬 **AI Chat Interface** — Ask questions about your data in natural language
- 📊 **Automatic Chart Generation** — Request bar, line, area, or pie charts and get them rendered instantly
- 🧠 **Powered by OpenRouter** — Uses LLM models via [OpenRouter](https://openrouter.ai) for intelligent data analysis
- 🎨 **Animated UI** — Glassmorphism design with floating path animations and smooth transitions
- 🔔 **Toast Notifications** — Real-time feedback for uploads and errors

---

## 🛠️ Tech Stack

### Frontend
| Technology | Purpose |
|---|---|
| React 19 + Vite | UI framework & build tool |
| Tailwind CSS v4 | Utility-first styling |
| Framer Motion | Animations & transitions |
| Recharts | Interactive chart rendering |
| React Router DOM | Client-side routing |
| Axios | HTTP client |
| Lucide React | Icons |
| React Hot Toast | Toast notifications |

### Backend
| Technology | Purpose |
|---|---|
| Node.js + Express 5 | REST API server |
| Multer | CSV file upload handling |
| csv-parser | Server-side CSV parsing |
| node-fetch | OpenRouter API calls |
| dotenv | Environment variable management |
| CORS | Cross-origin request support |

---

## 📁 Project Structure

```
Analyst.AI/
├── backend/
│   ├── controllers/
│   │   └── chatController.js   # AI chat logic via OpenRouter
│   ├── routes/
│   │   ├── chat.js             # POST /api/analysis
│   │   └── file.js             # POST /api/docs (file upload)
│   ├── uploads/                # Uploaded CSV files (temp storage)
│   ├── index.js                # Express server entry point
│   └── .env                    # Backend environment variables
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Home.jsx        # Landing page
│   │   │   ├── Upload.jsx      # CSV upload & parsing
│   │   │   ├── Chat.jsx        # Chat interface
│   │   │   ├── TestChat.jsx    # Full-featured chat with chart rendering
│   │   │   ├── Chart.jsx       # Chart display component
│   │   │   └── ui/             # Reusable UI primitives
│   │   ├── App.jsx             # Root component & routing
│   │   └── main.jsx            # React entry point
│   ├── .env.example            # Frontend env template
│   └── vite.config.js
│
└── README.md
```

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** v18 or higher
- An **OpenRouter API key** — get one free at [openrouter.ai](https://openrouter.ai)

---

### 1. Clone the Repository

```bash
git clone https://github.com/your-username/Analyst.AI.git
cd Analyst.AI
```

---

### 2. Set Up the Backend

```bash
cd backend
npm install
```

Create a `.env` file in the `backend/` directory:

```env
PORT=3000
OPENROUTER_API_KEY=your_openrouter_api_key_here
```

Start the backend server:

```bash
node index.js
```

The server will run at `http://localhost:3000`.

---

### 3. Set Up the Frontend

```bash
cd frontend
npm install
```

Create a `.env` file in the `frontend/` directory (copy from the example):

```bash
cp .env.example .env
```

Update `frontend/.env` with your backend URL:

```env
VITE_BACKEND_URL=http://localhost:3000
```

Start the development server:

```bash
npm run dev
```

The app will be available at `http://localhost:5173`.

---

## 🌐 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/api/docs/upload` | Upload a CSV file |
| `POST` | `/api/analysis/chat` | Send a prompt with CSV data for AI analysis |

### Chat Request Body
```json
{
  "prompt": "Show me a bar chart of sales by region",
  "csvData": [{ "region": "North", "sales": 4200 }, ...]
}
```

### Chat Response
- **Text analysis** — Bullet-point insights (under 100 words)
- **Chart data** — Prefixed with `CHART_JSON:` followed by a structured JSON object

---

## 📊 Chart Generation

Ask the AI to generate visualizations using natural language:

- *"Show me a bar chart of revenue by month"*
- *"Plot a line graph of user growth over time"*
- *"Create a pie chart of sales by category"*
- *"Draw an area chart of temperature trends"*

Supported chart types: **bar**, **line**, **area**, **pie**

---

## ☁️ Deployment

### Backend (e.g., Render / Railway)
1. Set the `OPENROUTER_API_KEY` environment variable in your hosting dashboard
2. Deploy the `backend/` directory
3. Note your deployed backend URL

### Frontend (Vercel)
1. Set `VITE_BACKEND_URL` to your deployed backend URL in Vercel's environment settings
2. Deploy the `frontend/` directory
3. Set the build command to `npm run build` and output directory to `dist`

---

## 📝 License

This project is licensed under the **ISC License**.

---

## 🙌 Acknowledgements

- [OpenRouter](https://openrouter.ai) for LLM API access
- [Recharts](https://recharts.org) for chart components
- [Framer Motion](https://www.framer.com/motion/) for animations
- [Vercel](https://vercel.com) for deployment inspiration
