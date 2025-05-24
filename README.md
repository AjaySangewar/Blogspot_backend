# Blogspot - Full Stack Blogging Platform

A modern blogging platform built with React, Node.js, Express, and MySQL.

## Features

- User authentication (signup, login, logout)
- Create, read, update, and delete blog posts
- Rich text editing with CKEditor
- Search functionality
- Responsive design for all devices
- User dashboard for managing posts

## Tech Stack

### Frontend
- React
- React Router
- Tailwind CSS
- CKEditor 5
- Framer Motion for animations
- Axios for API requests
- Lucide React for icons

### Backend
- Node.js
- Express
- MySQL
- JWT for authentication
- Bcrypt for password hashing

## Setup Instructions

### Prerequisites
- Node.js (v14+)
- MySQL database

### Installation

1. Clone the repository:
```
git clone https://github.com/yourusername/blogspot.git
cd blogspot
```

2. Install dependencies:
```
npm run install-all
```

3. Set up the database:
   - Create a MySQL database named `blogspot`
   - Configure the database connection in `backend/.env` (you can copy from `.env.example`)

4. Configure environment variables:
   - Create `.env` files in both frontend and backend directories (copy from `.env.example` files)

5. Start the development servers:
```
npm start
```

This will start both the frontend and backend servers concurrently.

## Project Structure

```
├── frontend/             # React frontend
│   ├── public/           # Public assets
│   ├── src/              # Source files
│   │   ├── components/   # Reusable components
│   │   ├── context/      # React context for state management
│   │   ├── pages/        # Page components
│   │   ├── config/       # Configuration files
│   │   ├── App.jsx       # Main App component
│   │   └── main.jsx      # Entry point
│   └── index.html        # HTML template
│
├── backend/              # Express backend
│   ├── database/         # Database setup
│   ├── middleware/       # Express middleware
│   ├── routes/           # API routes
│   └── server.js         # Entry point
│
└── package.json          # Project configuration
```

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login a user

### Posts
- `GET /api/posts` - Get all posts
- `GET /api/posts/:id` - Get a post by ID
- `GET /api/posts/user` - Get posts by logged in user
- `POST /api/posts` - Create a post
- `PUT /api/posts/:id` - Update a post
- `DELETE /api/posts/:id` - Delete a post

## License

This project is licensed under the MIT License.
