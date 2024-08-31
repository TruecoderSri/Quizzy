# Quizzy - Online Quiz Maker

Quizzy is a platform that enables users to create, take, and manage quizzes. Users can sign up, log in, create their own quiz in any domain area and make it available for the world, take part in quizzes, and see their scores. The platform is built with a Node.js backend, a MongoDB database, and a React frontend styled with Tailwind CSS.

## Table of Contents
- [Features](#features)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Running the Application](#running-the-application)
- [API Endpoints](#api-endpoints)


## Features
- User authentication with JWT
- Create quizzes with multiple-choice questions
- Take quizzes and see scores
- User profile with quizzes taken and created

## Prerequisites
- Node.js and npm installed
- MongoDB installed and running

## Installation

1. **Clone the repository:**

   ```bash
   git clone https://github.com/yourusername/quizzy.git
   cd quizzy
2. **Install backend dependencies:**

   ```bash
   cd backend
   npm install
3. **Install frontend dependencies:**

    ```bash
   cd ../frontend
   npm install
4. **Create a .env file in the backend directory:**
   ```bash
   PORT=5000
   MONGO_URI=your_mongo_uri
   JWT_SECRET=your_jwt_secret

## Running the Application

1. **Start the backend server:**
   
  ```bash
  cd backend
  node ./server.js
  ```
2. **Start the frontend development server:**
  ```bash
  cd frontend
  npm start
  ```
3. **Open your browser and go to:**
  ```bash
  http://localhost:5173
  ```
## API Endpoints

### Authentication
- **POST /api/auth/signup** - Sign up a new user
- **POST /api/auth/login** - Log in a user

### Quizzes
- **POST /api/quizzes** - Create a new quiz
- **GET /api/quizzes** - Get all quizzes
- **GET /api/quizzes/:id** - Get a quiz by ID
- **POST /api/quizzes/:id/submit** - Submit a quiz

### Profile
- **GET /api/users/:userId/profile** - Get user profile
