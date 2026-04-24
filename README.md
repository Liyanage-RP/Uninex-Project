# UniNexus

UniNexus is a modern, student-centric MERN stack application designed for university students (specifically tailored for SLIIT). It serves as a unified digital platform connecting students through a variety of academic and social features.

## 🚀 Features

- **🎓 Student Dashboard**: A personalized hub to view recent notifications, active listings, and upcoming events.
- **📚 Resource Hub**: Share, view, and download academic resources like PDF lecture notes and video links. Save resources for quick access later.
- **🛒 Campus Marketplace**: Buy and sell items securely with verified university students.
- **🤝 Communities**: Join active clubs, sports teams, and upcoming campus events.
- **🛡️ Admin Panel**: A dedicated dashboard for administrators to monitor the platform, manage resources, and oversee student accounts.

## 🛠️ Technology Stack

- **Frontend**: React (Vite), React Router, Tailwind CSS (via PostCSS/Vanilla CSS modules), Context API for state management.
- **Backend**: Node.js, Express.js.
- **Database**: MongoDB (via Mongoose).
- **Authentication**: JWT (JSON Web Tokens) with secure bcrypt password hashing.

## ⚙️ Prerequisites

Make sure you have the following installed on your machine:
- [Node.js](https://nodejs.org/) (v16 or higher)
- [npm](https://www.npmjs.com/) or [yarn](https://yarnpkg.com/)
- [MongoDB](https://www.mongodb.com/) (Local instance or MongoDB Atlas cluster)

## 🚀 Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/Liyanage-RP/Uninex-Project.git
cd Uninex-Project
```

### 2. Backend Setup

Open a terminal and navigate to the `backend` directory:

```bash
cd backend
npm install
```

Create a `.env` file in the `backend` directory with the following variables:
```env
NODE_ENV=development
PORT=5000
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
```

Start the backend development server:
```bash
npm run dev
```

### 3. Frontend Setup

Open a new terminal and navigate to the `frontend` directory:

```bash
cd frontend
npm install
```

Start the frontend development server:
```bash
npm run dev
```

### 4. Access the App
Open your browser and navigate to `http://localhost:3000`. 
The frontend development server proxies API requests to `http://localhost:5000`.

## 🔐 Default Credentials

If the database is seeded or passwords are reset, you can use the following default test accounts:

**System Administrator:**
- Email: `admin@my.sliit.lk`
- Password: `password123`

**Test Student:**
- Email: `it23164444@my.sliit.lk`
- Password: `password123`

## 🎨 UI/UX Design
The platform features a modern, premium "dark glassmorphism" design system. It utilizes sleek gradients, responsive layouts, micro-animations, and dynamic visual feedback to provide an engaging user experience.

## 📄 License
This project is for academic and portfolio purposes. All rights reserved.
