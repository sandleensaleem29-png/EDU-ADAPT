# EduAdapt – Adaptive Learning & Quiz System

A web-based adaptive learning platform that personalizes quiz difficulty based on student performance using a rule-based sliding window algorithm.

## Features

### Student Features
- Register/Login/Logout with JWT authentication
- Take quizzes with auto-adaptive difficulty
- View score and detailed results after each quiz
- Track performance history with charts
- See strong and weak topic areas
- Get personalized recommendations
- Access curated learning resources
- View profile and change password

### Admin Features
- Admin dashboard with system statistics
- Manage students (view, delete)
- Add/Edit/Delete questions
- Approve/reject AI-generated questions
- Manage topics and learning resources
- View all quiz attempts and student performance

### Adaptive Learning Algorithm
- Uses sliding window of latest 5 responses
- Accuracy >= 80% → increase difficulty
- Accuracy 60-79% → maintain same difficulty
- Accuracy < 60% → decrease difficulty + hints
- Topic-wise performance tracking
- Weak area detection and recommendations

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React.js, Vite, Tailwind CSS, Axios, Recharts |
| Backend | Node.js, Express.js |
| Database | PostgreSQL, Sequelize ORM |
| Auth | JWT, bcrypt |

## Folder Structure

```
EduAdapt/
├── backend/
│   ├── src/
│   │   ├── config/         # Database & app config
│   │   ├── models/         # Sequelize models
│   │   ├── controllers/    # Route handlers
│   │   ├── routes/         # API routes
│   │   ├── middleware/      # Auth middleware
│   │   ├── utils/          # Adaptive algorithm
│   │   └── seeders/        # Sample data
│   ├── migrations/         # DB migrations
│   ├── .env.example        # Environment template
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── components/     # Reusable UI components
│   │   ├── pages/          # Page components
│   │   ├── context/        # React context (auth)
│   │   └── utils/          # API config
│   └── package.json
└── README.md
```

## Installation

### Prerequisites
- Node.js (v16+)
- PostgreSQL (v12+)
- npm or yarn

### 1. Clone the Repository
```bash
git clone <your-repo-url>
cd EduAdapt
```

### 2. Backend Setup
```bash
cd backend
npm install
```

### 3. Environment Variables
Copy `.env.example` to `.env` and update:
```
DB_HOST=localhost
DB_PORT=5432
DB_NAME=eduadapt_db
DB_USER=postgres
DB_PASSWORD=your_password
JWT_SECRET=your_secret_key_min_32_chars
AI_API_KEY=optional_openai_key
```

### 4. Database Setup
```bash
# Create database in PostgreSQL
psql -U postgres -c "CREATE DATABASE eduadapt_db;"

# Run migrations
npm run migrate

# Seed sample data
npm run seed
```

### 5. Frontend Setup
```bash
cd ../frontend
npm install
```

## Running the Application

```bash
# Start Backend (terminal 1)
cd backend
npm run dev

# Start Frontend (terminal 2)
cd frontend
npm run dev
```

Backend runs on: http://localhost:5000
Frontend runs on: http://localhost:5173

## API Endpoints

### Authentication
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | /api/auth/register | Register new student |
| POST | /api/auth/login | Login |
| GET | /api/auth/me | Get current user |
| PUT | /api/auth/profile | Update profile |
| PUT | /api/auth/change-password | Change password |

### Topics
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /api/topics | List all topics |
| GET | /api/topics/:id | Get topic details |
| POST | /api/topics | Create topic (admin) |
| PUT | /api/topics/:id | Update topic (admin) |
| DELETE | /api/topics/:id | Delete topic (admin) |

### Questions
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /api/questions | List questions |
| POST | /api/questions | Create question (admin) |
| PUT | /api/questions/:id | Update question (admin) |
| DELETE | /api/questions/:id | Delete question (admin) |

### Quizzes
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | /api/quizzes/start | Start a quiz |
| POST | /api/quizzes/:id/submit | Submit quiz answers |
| GET | /api/quizzes/history | Get quiz history |
| GET | /api/quizzes/:id | Get quiz details |

### Recommendations
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /api/recommendations | Get personalized recommendations |
| GET | /api/recommendations/performance | Get topic performance |

## Adaptive Algorithm

The system uses a **sliding window** of the student's latest 5 responses:

```
1. Fetch latest 5 responses from completed quizzes
2. Calculate accuracy = (correct / total) * 100
3. Determine next difficulty:
   - Accuracy >= 80% → increase difficulty level
   - Accuracy 60-79% → maintain current level
   - Accuracy < 60% → decrease difficulty level
4. Identify weak topics (accuracy < 60%)
5. Generate recommendations based on weak areas
```

## Demo Accounts

| Role | Email | Password |
|------|-------|----------|
| Admin | admin@eduadapt.com | admin123 |
| Student | ahmed@student.com | student123 |
| Student | sara@student.com | student123 |

## Testing

### Manual Testing Steps

1. **Student Flow:**
   - Register a new account
   - Login
   - Select a topic from dashboard
   - Start and complete a quiz
   - View results and score
   - Check performance page
   - View recommendations

2. **Admin Flow:**
   - Login as admin
   - View dashboard statistics
   - Add/edit/delete topics
   - Add/edit/delete questions
   - View student list
   - View quiz attempts

3. **Adaptive System:**
   - Take same topic quiz multiple times
   - Observe difficulty changes
   - Check weak/strong topic detection

## License

This project is for educational purposes (Final Year Project).
