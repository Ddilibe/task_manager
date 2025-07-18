# Task Manager

A fullstack task management application built with React, Vite, Tailwind CSS (frontend), Express, TypeScript, TypeORM, and SQLite (backend). The app allows users to register, log in, and manage their personal tasks with priorities, statuses, and due dates.

---

## Features
- User registration and authentication (JWT-based)
- Create, read, update, and delete tasks
- Task attributes: title, description, status, priority, tag, due date
- Paginated task listing
- Responsive, modern UI with React and Tailwind CSS

---

## Project Structure
```
├── client/   # Frontend (React, Vite, Tailwind)
├── server/   # Backend (Express, TypeORM, SQLite)
├── package.json  # Project-level scripts
└── README.md
```

---

## Database Schema

### User
| Field         | Type    | Attributes         |
|--------------|---------|-------------------|
| id           | uuid    | PK, auto-generated|
| username     | string  | unique, required  |
| firstName    | string  | required          |
| lastName     | string  | required          |
| password     | string  | hashed, required  |
| emailAddress | string  | unique, required  |

### Task
| Field       | Type    | Attributes         |
|-------------|---------|-------------------|
| id          | uuid    | PK, auto-generated|
| title       | string  | required          |
| description | text    | optional          |
| status      | enum    | pending/in_progress/done (default: pending) |
| tag         | string  | optional          |
| dueDate     | date    | required          |
| priority    | enum    | high/medium/low (default: medium) |
| userId      | uuid    | FK to User, required |

---

## API Overview

### Auth
- `POST /api/register` — Register a new user
- `POST /api/login` — Log in and receive JWT

### Tasks (require JWT in `Authorization: Bearer <token>` header)
- `POST /api/task` — Create a new task
- `GET /api/tasks` — List tasks (paginated)
- `GET /api/task/:taskId` — Get a single task
- `PUT /api/task/:taskId` — Update a task
- `DELETE /api/task/:taskId` — Delete a task

---

## Step-by-Step Setup

### Prerequisites
- Node.js (v18+ recommended)
- npm

### 1. Clone the repository
```bash
git clone <your-repo-url>
cd task_manager
```

### 2. Install dependencies
```bash
npm install
cd client && npm install
cd ../server && npm install
```

### 3. Configure environment variables

#### Backend (`server`)
Create a `.env` file in the `server/` directory:
```
PORT=3000
JWT_SECRET=your_jwt_secret_here
```

#### Frontend (`client`)
Create a `.env` file in the `client/` directory:
```
VITE_API_URL=http://localhost:3000
```

### 4. Run the app in development mode
From the project root:
```bash
npm run dev
```
- The backend will run on `http://localhost:3000`
- The frontend will run on `http://localhost:5173` (proxied to backend for `/api`)

---

## What to Build Next
- Add user profile management (edit profile, change password)
- Task filtering, sorting, and search
- Task notifications/reminders
- Due date calendar view
- Multi-user collaboration (shared tasks)
- Unit and integration tests
- Dockerize for production deployment
- CI/CD pipeline

---

## License
MIT 