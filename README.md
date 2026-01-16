# Socket Chat Application (Real-time)

This project is a real-time chat application built with **Socket.IO**, featuring chat rooms, live messaging, and typing indicators.  
Users can create rooms, join existing rooms, and communicate instantly with other users.

---

## 📌 Features

- Real-time messaging using WebSockets
- Chat rooms (create & join)
- Multiple users per room
- Typing indicator (e.g. *“Yurii is typing…”*)
- Simple authentication (login with username)
- In-memory storage (no external database)

---

## 🧱 Tech Stack

### Backend
- **TypeScript**
- **Express.js**
- **Socket.IO**

### Frontend
- **TypeScript**
- **React**
- **Tailwind CSS**
- **Vite**

---

## 📁 Project Structure

```txt
root/
├─ server/        # Backend (Express + Socket.IO)
├─ client/        # Frontend (React + Vite)
└─ README.md
````
---

## 🚀 Getting Started

### 1️⃣ Clone the repository

```bash
git clone <repository-url>
cd <project-folder>
```

---

### 2️⃣ Start the backend server

```bash
cd server
npm install
npm run dev
```

The server will start on:

```
http://localhost:3000
```

---

### 3️⃣ Start the frontend application

```bash
cd client
npm install
npm run dev
```

The frontend will start on:

```
http://localhost:5173
```

---

## 🧪 How to Use the App

1. Open the frontend app in your browser (Vite localhost URL)
2. Log in by entering a username
3. Create a new chat room **or** join an existing one
4. Start sending messages in real time
5. See typing indicators when other users are typing

> Example typing indicator:
> **“Yurii is typing…”**

---

## 📸 Screenshots

> Screenshots of:

* Login screen
* Chat room list
* Active chat with messages
* Typing indicator

*(Add screenshots here)*
