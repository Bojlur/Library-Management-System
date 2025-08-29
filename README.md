###Library Management System (LMS):

A RESTful Library Management System built with Express, TypeScript, and MongoDB (Mongoose).
Supports book management, borrowing system, and aggregation queries.

###Features

Manage books (CRUD)
Borrow/return system with due dates
Automatic stock & availability sync
Aggregation for borrowed books summary
Filtering, sorting, and pagination on book list
Centralized error handling
###Tech Stack

Backend: Node.js, Express.js
Language: TypeScript
Database: MongoDB (Mongoose)
Validation: Mongoose validators & middleware

###Installation

# Clone repo
git clone <your-repo-url>
cd library-management

# Install dependencies
npm install

# Copy environment file
cp .env.example .env

# Start dev server
npm run dev
