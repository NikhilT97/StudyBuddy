# StudyBuddy 
Deployed link - https://study-buddy-nine-phi.vercel.app/

A full-stack web app that generates personalized learning paths, lets you chat with an AI tutor, and tests your knowledge with auto-generated quizzes — all powered by Groq's LLaMA model.

Built this as a learning project to get hands-on with the MERN stack. Ended up being one of the more interesting things I've worked on.

---

## What it does

You type in a topic — say, "Machine Learning" or "System Design" — and the app generates a structured learning path broken into modules. From there you can:

- Chat with an AI tutor that knows your topic and remembers the conversation
- Mark modules as complete and track your progress
- Take a 5-question quiz generated specifically for your topic
- See detailed results with explanations for each answer

There's also an admin panel with basic analytics — total users, popular topics, average quiz scores, etc.

---

## Tech stack

**Backend**
- Node.js + Express.js
- MongoDB + Mongoose
- JWT authentication
- Role-based access control (student / admin)
- Groq API (LLaMA 3.3 70B) for AI features

**Frontend**
- React + Vite
- React Router
- Axios
- react-hot-toast
- Pure CSS with CSS variables (light/dark mode)

---

## Features

- AI learning path generation — structured modules with estimated time
- AI tutor chat — full conversation history passed on every request
- AI quiz generation — MCQs with auto scoring and explanations
- Progress tracking — mark modules done, see % completion
- JWT auth — register, login, protected routes
- Dark mode — persisted to localStorage
- Admin dashboard — users, paths, analytics, popular topics

---

## Getting started

### Prerequisites

- Node.js v18+
- MongoDB (local or Atlas)
- Groq API key — free at [console.groq.com](https://console.groq.com)

### Backend setup

```bash
git clone https://github.com/yourusername/studybuddy-backend.git
cd studybuddy-backend
npm install
```

Create a `.env` file:

```env
PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/StudyBuddy
JWT_SECRET=your_jwt_secret_here
JWT_EXPIRES_IN=7d
GROQ_API_KEY=your_groq_api_key_here
NODE_ENV=development
```

```bash
npm run dev
```

Server runs on `http://localhost:5000`

### Frontend setup

```bash
git clone https://github.com/yourusername/studybuddy-frontend.git
cd studybuddy-frontend
npm install
npm run dev
```

App runs on `http://localhost:5173`

---

## API overview

```
POST   /api/auth/register
POST   /api/auth/login

POST   /api/paths/generate
GET    /api/paths/my-paths
GET    /api/paths/:id
PATCH  /api/paths/:id/progress

POST   /api/chat/:pathId
GET    /api/chat/:pathId/history

POST   /api/quiz/:pathId/generate
POST   /api/quiz/:pathId/submit
GET    /api/quiz/:pathId/result

GET    /api/admin/users
GET    /api/admin/analytics
DELETE /api/admin/users/:userId
```

---

## Project structure

```
studybuddy-backend/
├── config/         # DB connection
├── controllers/    # Route handlers
├── middleware/     # Auth + role middleware
├── models/         # Mongoose schemas
├── routes/         # Express routers
├── services/       # Groq AI integration
└── utils/          # JWT helper

studybuddy-frontend/
├── src/
│   ├── api/        # Axios instance
│   ├── components/ # Navbar, ThemeToggle, route guards
│   ├── context/    # Auth + Theme context
│   └── pages/      # All page components
```

---

## Screenshots

> <img width="1914" height="1026" alt="image" src="https://github.com/user-attachments/assets/1984b314-224c-45fe-a8a6-c51cd56090b3" />
<img width="1920" height="1080" alt="image" src="https://github.com/user-attachments/assets/e2edbb21-73c5-40fc-bba7-3d2b4cdd49f3" />
<img width="1920" height="1080" alt="image" src="https://github.com/user-attachments/assets/a0b558de-beb3-4ed3-a5a1-2c445db15797" />
<img width="1907" height="1028" alt="image" src="https://github.com/user-attachments/assets/20f3d9d0-0c7b-47de-a9d8-1f9063247786" />
<img width="1920" height="1080" alt="image" src="https://github.com/user-attachments/assets/8c74f47c-6ef7-48de-bb74-b34ab0f5f5fe" />



---

## Things I learned building this

- How conversation history works in LLM APIs — you pass the full message array on every request, there's no magic memory on the server side
- Why middleware order matters in Express — auth before role check, always
- `Promise.all()` for parallel DB queries instead of sequential awaits
- The difference between storing roles in JWT vs querying per request (performance vs freshness tradeoff)

---


## License

MIT
