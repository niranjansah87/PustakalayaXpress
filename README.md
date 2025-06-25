# PustakalayaXpress

PustakalayaXpress is a full-stack web application for managing a personal book collection. It features user authentication, book CRUD operations, and a modern React frontend styled with Tailwind CSS.

---

## Table of Contents

- [PustakalayaXpress](#pustakalayaxpress)
  - [Table of Contents](#table-of-contents)
  - [Features](#features)
  - [Tech Stack](#tech-stack)
  - [Project Structure](#project-structure)
  - [Backend Setup](#backend-setup)
  - [Frontend Setup](#frontend-setup)
  - [Environment Variables](#environment-variables)
  - [Usage](#usage)
  - [API Endpoints](#api-endpoints)
    - [Auth](#auth)
    - [Books](#books)
  - [License](#license)

---

## Features

- User registration and login with JWT authentication
- Secure password hashing
- Add, edit, delete, and list books per user
- Responsive UI with React and Tailwind CSS
- Protected routes for authenticated users
- Token refresh and logout functionality

---

## Tech Stack

- **Frontend:** React, TypeScript, Vite, Tailwind CSS, Axios, React Router
- **Backend:** Django, Django REST Framework, PyJWT, MySQL
- **Authentication:** JWT (JSON Web Tokens)
- **Other:** ESLint, PostCSS

---

## Project Structure

```
.
├── backend/
│   ├── manage.py
│   ├── requirements.txt
│   ├── books/
│   ├── pustakalayaexpress/
│   └── users/
├── frontend/
│   ├── src/
│   ├── public/
│   ├── package.json
│   ├── tailwind.config.js
│   └── ...
├── README.md
└── ...
```

- **backend/**: Django REST API for authentication and book management
- **frontend/**: React app for user interface

---

## Backend Setup

1. **Install dependencies:**
   ```sh
   cd backend
   pip install -r requirements.txt
   ```

2. **Configure MySQL database:**
   - Update `backend/pustakalayaexpress/settings.py` with your MySQL credentials.

3. **Apply migrations:**
   ```sh
   python manage.py makemigrations
   python manage.py migrate
   ```

4. **Run the backend server:**
   ```sh
   python manage.py runserver
   ```

---

## Frontend Setup

1. **Install dependencies:**
   ```sh
   cd frontend
   npm install
   ```

2. **Configure environment variables:**
   - Create a `.env` file in `frontend/`:
     ```
     VITE_API_BASE_URL=http://localhost:8000
     ```

3. **Run the frontend dev server:**
   ```sh
   npm run dev
   ```

   The app will be available at [http://localhost:5173](http://localhost:5173).

---

## Environment Variables

- **Backend:** Configure database and secret key in `backend/pustakalayaexpress/settings.py`.
- **Frontend:** Set `VITE_API_BASE_URL` in `frontend/.env` to point to your backend server.

---

## Usage

1. Register a new user or log in with existing credentials.
2. Add, edit, or delete books in your collection.
3. Only authenticated users can access book management routes.
4. Logout to end your session.

---

## API Endpoints

### Auth

- `POST /api/auth/register/` — Register a new user
- `POST /api/auth/login/` — Login and receive JWT tokens
- `POST /api/auth/refresh/` — Refresh access token

### Books

- `GET /api/books/users/<user_id>/` — List books for a user
- `POST /api/books/` — Create a new book
- `GET /api/books/<id>/` — Get book details
- `PUT /api/books/<id>/update/` — Update a book
- `DELETE /api/books/<id>/delete/` — Delete a book

---

## License

MIT License. See [LICENSE](LICENSE) for details