# LearnTech — E-Learning Platform (MERN Stack)

LearnTech is a role-based e-learning platform built on the MERN stack (MongoDB, Express, React, Node.js). It supports three distinct roles — **Admin**, **Teacher**, and **Student** — each with their own dashboard, permissions, and workflows, along with course subscriptions, video-based learning, quizzes, auto-issued certificates, and real-time chat.

---

## Demo Credentials

Use these accounts to explore each role after seeding/creating them in your database.

| Role    | Email               | Password      |
|---------|---------------------|---------------|
| Admin   | admin@gmail.com     | admin1234     |
| Teacher | teacher@gmail.com   | teacher1234   |
| Student | user@gmail.com      | user1234      |

> ⚠️ These are demo/development credentials only. Do not use them in a production deployment — create real accounts with strong passwords before going live.

---

## Roles & Permissions

### 🛡️ Admin
- Create, edit, and delete courses
- Create and manage users (students/teachers), edit or delete accounts
- View platform-wide statistics: total students, teachers, courses, and videos
- View category and enrollment breakdowns via charts (bar/pie)
- Full visibility across all courses and quizzes

### 🎓 Teacher
- Create and manage their own courses
- Upload videos to their courses
- Create and edit MCQ quizzes per course
- View per-course statistics: enrolled students, total videos, total students
- Dashboard shows enrollment breakdown by course

### 👩‍🎓 Student (User)
- Browse and subscribe to available courses
- Watch course videos (locked until subscribed)
- Track progress per course (videos watched / total videos)
- Take the course quiz once all videos are completed
- Automatically earn a certificate when scoring **75% or higher**
- Chat with other users (admins, teachers, students) in real time

---

## Core Features

### Course & Video Management
- Admins and teachers can create courses, each with a title, description, category, price, and thumbnail
- Videos are uploaded per course and linked via a `videos` array on the course document

### Subscription & Progress Tracking
- Students subscribe to a course, which adds the course to their enrolled list
- Video-watch progress is tracked server-side (not localStorage), so progress persists across devices and sessions
- Course pages show real-time progress: videos watched, percentage complete, and lock/unlock status for the quiz

### Quiz & Auto-Certification
- Teachers create multiple-choice quizzes per course
- Quiz access is gated behind 100% video completion
- Quizzes are auto-scored on submission
- Students scoring **75% or above** automatically receive a digital certificate with their name, course title, score, and a unique certificate ID

### Dashboards
- **Admin Dashboard** — total students, teachers, courses, videos; courses-created-per-month chart; courses-by-category breakdown
- **Teacher Dashboard** — total courses, videos, and students; enrollment-by-course chart
- **Student Dashboard** — progress ledger for enrolled courses, featured courses carousel, full course catalog

### Real-Time Chat
- Built with Socket.io
- All roles (admin, teacher, student) can chat together
- Messages display the sender's name and role
- Message history persists in MongoDB and loads on chat open

---

## Tech Stack

**Frontend**
- React
- Redux (state management)
- Chakra UI (component library)
- React Router
- Chart.js / react-chartjs-2 (dashboard charts)
- react-slick (carousels)
- Socket.io-client (real-time chat)

**Backend**
- Node.js + Express
- MongoDB + Mongoose
- Socket.io (real-time messaging)
- JSON Web Tokens (JWT) for authentication
- bcrypt (password hashing)

---

## Project Structure

```
LEARNTECH/
├── backend/
│   ├── middlewares/
│   │   └── users.middleware.js
│   ├── models/
│   │   ├── blacklist.js
│   │   ├── courses.model.js
│   │   ├── Group.js
│   │   ├── Message.js
│   │   ├── users.models.js
│   │   ├── video.model.js
│   │   ├── progress.model.js
│   │   ├── quiz.model.js
│   │   └── certificate.model.js
│   ├── routes/
│   │   ├── chatRoutes.js
│   │   ├── courses.route.js
│   │   ├── users.routes.js
│   │   ├── videos.route.js
│   │   ├── progress.route.js
│   │   ├── stats.route.js
│   │   └── quiz.route.js
│   ├── db.js
│   └── index.js
│
└── frontend/
    └── src/
        ├── components/
        │   ├── Adminitems/       # Admin pages (dashboard, courses, users, videos, statistics)
        │   ├── TeacherComponents/ # Teacher pages (dashboard, courses, videos, quiz builder)
        │   ├── UserComponents/    # Student-facing components (course cards, progress, chat, quiz)
        │   └── singlePageComps/   # Course detail page components
        ├── Pages/
        │   ├── LandingPageComponents/
        │   ├── Payment/
        │   ├── UserDashboard.jsx
        │   └── ProfilePage.jsx
        ├── Redux/
        │   ├── AdminReducer/
        │   ├── TeacherReducer/
        │   ├── UserReducer/
        │   └── ProductReducer/
        ├── routes/
        │   ├── AllRoute.jsx
        │   ├── AdminRoute.jsx
        │   ├── TeacherRoute.jsx
        │   └── PrivateRoutes.jsx
        └── utils/


## Getting Started

### Prerequisites
- Node.js (v16+)
- MongoDB (local or Atlas)
- npm

### Backend Setup
```bash
cd backend
npm install
```

Create a `.env` file in `backend/` with:
```
PORT=5000
MONGO_URI=<your-mongodb-connection-string>
```

Start the backend:
```bash
node index.js
```

### Frontend Setup
```bash
cd frontend
npm install
npm start
```

The frontend runs on `http://localhost:3000` and the backend on `http://localhost:5000` by default.

---

## Key API Routes

| Method | Endpoint                          | Description                              | Access          |
|--------|------------------------------------|-------------------------------------------|-----------------|
| POST   | `/users/register`                 | Register a new user                        | Public          |
| POST   | `/users/login`                    | Log in                                     | Public          |
| GET    | `/courses/all`                    | List all courses                           | Public          |
| POST   | `/courses/add`                    | Create a course                            | Admin/Teacher   |
| POST   | `/videos/add/:courseId`           | Add a video to a course                    | Admin/Teacher   |
| POST   | `/users/addCourse/:courseId`      | Subscribe to a course                      | Authenticated   |
| GET    | `/progress/summary`               | Get progress across all enrolled courses   | Authenticated   |
| POST   | `/progress/markWatched`           | Mark a video as watched                    | Authenticated   |
| POST   | `/quiz/add/:courseId`             | Create/update a course quiz                | Admin/Teacher   |
| GET    | `/quiz/:courseId`                 | Fetch quiz (gated by course completion)    | Authenticated   |
| POST   | `/quiz/submit/:courseId`          | Submit quiz answers, auto-issue certificate| Authenticated   |
| GET    | `/stats/admin`                    | Platform-wide statistics                   | Admin           |
| GET    | `/stats/teacher`                  | Teacher's course/student statistics        | Teacher         |

---

## Certificate Rules

- A student must complete **100% of a course's videos** to unlock the quiz
- The quiz is auto-scored on submission
- A certificate is automatically generated and stored when the score is **≥ 75%**
- Certificates include the student's name, course title, score, percentage, issue date, and a unique certificate ID

---

## License

This project was built for educational purposes as part of a MERN stack learning platform.
