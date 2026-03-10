# Silent Distress Reporting System (SDRS)

A simplified prototype of the **Silent Distress Reporting System** built for the Software Engineering Lab project.

## Features

- **Authentication** – Register and log in securely (bcrypt + JWT)
- **Dashboard** – Overview of contacts and quick actions
- **Trusted Contact Management** – Full CRUD: Add, View, Edit, Delete emergency contacts

## Tech Stack

| Layer    | Technology                     |
|----------|-------------------------------|
| Frontend | HTML5, CSS3, Vanilla JS        |
| Backend  | Node.js + Express              |
| Database | SQLite (via `better-sqlite3`)  |
| Auth     | JWT + bcrypt                   |

## Project Structure

```
SDRS/
├── backend/
│   ├── controllers/
│   │   ├── authController.js
│   │   └── contactsController.js
│   ├── middleware/
│   │   └── auth.js
│   ├── models/
│   │   ├── db.js
│   │   ├── User.js
│   │   └── TrustedContact.js
│   ├── routes/
│   │   ├── auth.js
│   │   └── contacts.js
│   ├── server.js
│   └── package.json
├── database/
│   └── schema.sql
├── frontend/
│   ├── login.html
│   ├── register.html
│   ├── dashboard.html
│   ├── contacts.html
│   ├── add-contact.html
│   ├── edit-contact.html
│   ├── styles.css
│   └── script.js
└── README.md
```

## Running the Project

### Prerequisites

- [Node.js](https://nodejs.org/) v18 or later

### Installation

```bash
cd backend
npm install
```

### Start the Server

```bash
npm start
```

The server starts at **http://localhost:3000**.

Open your browser and navigate to **http://localhost:3000/login.html**.

### Environment Variables (optional)

| Variable     | Default                                  | Description                  |
|-------------|------------------------------------------|------------------------------|
| `PORT`      | `3000`                                   | Server port                  |
| `JWT_SECRET`| `sdrs_jwt_secret_key_change_in_production` | JWT signing secret (change in production!) |

## API Endpoints

### Auth

| Method | Endpoint              | Description        |
|--------|-----------------------|--------------------|
| POST   | `/api/auth/register`  | Register new user  |
| POST   | `/api/auth/login`     | Login user         |
| GET    | `/api/auth/logout`    | Logout (stateless) |
| GET    | `/api/me`             | Get current user   |

### Trusted Contacts (requires Bearer token)

| Method | Endpoint               | Description           |
|--------|------------------------|-----------------------|
| GET    | `/api/contacts`        | List all contacts     |
| GET    | `/api/contacts/:id`    | Get single contact    |
| POST   | `/api/contacts`        | Create contact        |
| PUT    | `/api/contacts/:id`    | Update contact        |
| DELETE | `/api/contacts/:id`    | Delete contact        |

## Security

- Passwords hashed with **bcrypt** (12 rounds)
- API protected with **JWT Bearer tokens**
- Input validation on both client and server
- SQL injection prevented via parameterized queries (better-sqlite3)
- CORS enabled
