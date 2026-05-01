# 🏥 MediCore — Hospital Management System

> A full-stack web application for managing hospital operations including patient records, doctor management, appointments, and role-based access control.

---

## 📋 Table of Contents

- [About the Project](#about-the-project)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
  - [Running the App](#running-the-app)
- [Environment Variables](#environment-variables)
- [API Overview](#api-overview)
- [Contributing](#contributing)
- [License](#license)
- [Author](#author)

---

## 📌 About the Project

**MediCore** is a comprehensive Hospital Management System built to digitize and streamline hospital workflows. It provides separate portals for Admins, Doctors, and Patients, with secure role-based access to manage appointments, health records, and medical data efficiently.

---

## ✨ Features

- 🔐 **Role-based Authentication** — Separate access for Admin, Doctor, and Patient
- 👨‍⚕️ **Doctor Management** — Add, update, and remove doctor profiles
- 🧑‍🤝‍🧑 **Patient Records** — Create and manage patient health records securely
- 📅 **Appointment Scheduling** — Book, view, and manage appointments
- 📊 **Admin Dashboard** — Full control over hospital operations
- 🔒 **Secure Data Handling** — Protected routes and data privacy
- 📱 **Responsive UI** — Mobile-friendly frontend interface

---

## 🛠 Tech Stack

### Frontend
- **React.js** — Component-based UI library
- **JavaScript (ES6+)**
- **CSS / Bootstrap** — Styling and responsive design

### Backend
- **Node.js** — Runtime environment
- **Express.js** — RESTful API framework
- **JavaScript**

### Database
- **MongoDB** — NoSQL database for storing records

### Tools & Others
- **npm** — Package manager
- **Git & GitHub** — Version control
- **Postman** — API testing

---

## 📁 Project Structure

```
MediCore/
├── backend/               # Server-side code
│   ├── controllers/       # Business logic
│   ├── models/            # Database schemas
│   ├── routes/            # API route definitions
│   ├── middleware/        # Auth & error handling
│   └── server.js          # Entry point
│
├── frontend/              # Client-side code
│   ├── public/            # Static assets
│   ├── src/
│   │   ├── components/    # Reusable UI components
│   │   ├── pages/         # Page-level components
│   │   ├── services/      # API call handlers
│   │   └── App.js         # Root component
│   └── package.json
│
├── .gitignore
├── package-lock.json
└── README.md
```

---

## 🚀 Getting Started

### Prerequisites

Make sure the following are installed on your machine:

- [Node.js](https://nodejs.org/) (v14 or higher)
- [npm](https://www.npmjs.com/)
- [MongoDB](https://www.mongodb.com/) (local or Atlas cloud)
- [Git](https://git-scm.com/)

---

### Installation

1. **Clone the repository**

```bash
git clone https://github.com/RitikaGoyall/MediCore.git
cd MediCore
```

2. **Install backend dependencies**

```bash
cd backend
npm install
```

3. **Install frontend dependencies**

```bash
cd ../frontend
npm install
```

---

### Running the App

**Start the backend server:**

```bash
cd backend
npm start
```

**Start the frontend development server:**

```bash
cd frontend
npm start
```

The frontend will run at `http://localhost:3000` and the backend API at `http://localhost:5000` (or as configured).

---

## 🔐 Environment Variables

Create a `.env` file in the `backend/` directory with the following variables:

```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
```

> ⚠️ Never commit your `.env` file. It is already listed in `.gitignore`.

---

## 📡 API Overview

| Method | Endpoint              | Description                |
|--------|-----------------------|----------------------------|
| POST   | `/api/auth/register`  | Register a new user        |
| POST   | `/api/auth/login`     | Login and get token        |
| GET    | `/api/doctors`        | Get all doctors            |
| POST   | `/api/doctors`        | Add a new doctor (Admin)   |
| GET    | `/api/patients`       | Get all patients           |
| POST   | `/api/appointments`   | Book an appointment        |
| GET    | `/api/appointments`   | View appointments          |
| DELETE | `/api/appointments/:id` | Cancel an appointment   |

> Full API documentation can be tested via Postman.

---

## 🤝 Contributing

Contributions are welcome! To contribute:

1. Fork the repository
2. Create a new branch (`git checkout -b feature/your-feature-name`)
3. Commit your changes (`git commit -m 'Add some feature'`)
4. Push to the branch (`git push origin feature/your-feature-name`)
5. Open a Pull Request

---

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

---

## 👩‍💻 Author

**Ritika Goyal** - 2210992168
**Raghav Bhatia** - 2210992118

---

> ⭐ If you found this project helpful, please give it a star on [GitHub](https://github.com/RitikaGoyall/MediCore)!