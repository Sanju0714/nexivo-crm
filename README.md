# Nexivo CRM — Full Stack Node.js Project

A starter CRM web application built with **Node.js, Express, MongoDB, HTML, CSS and JavaScript**.

## Features
- User registration and login (bcrypt password hashing + JWT)
- Dashboard: customer count, open leads, pipeline value and pending tasks
- Customer CRUD and search
- Lead CRUD, pipeline stages and estimated deal value
- Task/follow-up CRUD with due dates and priority
- Responsive interface and per-user record ownership

## Requirements
- Node.js 18+
- npm
- MongoDB local server or MongoDB Atlas account

## Run locally
1. Extract the ZIP and open the folder in VS Code.
2. Run `npm install`.
3. Copy `.env.example` to `.env`.
4. Set `MONGODB_URI` and a long random `JWT_SECRET` in `.env`.
5. Start MongoDB if using a local database.
6. Run `npm run dev` (or `npm start`).
7. Open `http://localhost:5000` and register an account.

## API overview
- `POST /api/auth/register`, `POST /api/auth/login`
- `GET/POST /api/customers`, `PUT/DELETE /api/customers/:id`
- `GET/POST /api/leads`, `PUT/DELETE /api/leads/:id`
- `GET/POST /api/tasks`, `PUT/DELETE /api/tasks/:id`
- `GET /api/health`

Protected endpoints require `Authorization: Bearer <token>`.

## Folder structure
- `server.js` — Express server, MongoDB models, authentication and REST routes
- `public/index.html` — application pages
- `public/style.css` — responsive styling
- `public/app.js` — frontend interactions and API calls

## Before using in a portfolio
Run and test all flows, customize the interface, add screenshots, and understand each part of the code. Do not commit `.env` or database credentials. This is a learning/portfolio starter, not a security-audited production system; add stronger validation, rate limiting, automated tests, audit logs and deployment hardening before handling real customer data.

## Resume wording (only after you have run, tested and understood it)
**Nexivo CRM — Full Stack Customer Relationship Management System**  
Developed a full-stack CRM using Node.js, Express.js, MongoDB, HTML, CSS and JavaScript. Implemented JWT-based authentication, customer and lead management, CRUD operations, sales pipeline tracking, dashboard metrics, search and follow-up task management.
