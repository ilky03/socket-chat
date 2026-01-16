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
<img width="727" height="726" alt="image" src="https://github.com/user-attachments/assets/d483d4c2-14b0-4543-827f-665f48950c5a" />

* Chat room list
<img width="727" height="740" alt="image" src="https://github.com/user-attachments/assets/f388ac00-40f9-495e-85c0-074e3e8e69d6" />

* Active chat with messages
<img width="727" height="740" alt="image" src="https://github.com/user-attachments/assets/42f11cf3-e408-4366-baf6-628ede82d5de" />

<img width="1460" height="565" alt="image" src="https://github.com/user-attachments/assets/331f56bf-ea68-405f-be09-1e0e466d46e3" />

