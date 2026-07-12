# AssetFlow

**Enterprise Asset & Resource Management System** — built for Odoo Hackathon 2026.

AssetFlow helps organizations track, allocate, and maintain physical assets and shared resources through a centralized platform — replacing spreadsheets and paper logs with structured asset lifecycles, resource booking, and maintenance approval workflows.

---

## Tech Stack

**Backend**
- Node.js + Express.js
- SQLite (via `better-sqlite3`)
- JWT authentication (`jsonwebtoken`)
- `bcrypt` for password hashing
- ES Modules (`import`/`export`)

**Frontend**
- React + Vite
- Tailwind CSS
- React Router
- Axios

---

## Setup Instructions

**1. Start the backend** (runs on `http://localhost:5000`)
```bash
cd backend
npm install
node server.js
```

**2. Start the frontend** (runs on `http://localhost:5173`)
```bash
cd frontend
npm install
npm run dev
```

Open `http://localhost:5173` in your browser.

---

## Demo Login

| Role | Email | Password |
|---|---|---|
| Admin | kiyo@gmail.com | 123456 |
| Asset Manager | employee@test.com | 123456 |

New signups always create a plain **Employee** account — there is no role picker at signup. Only an Admin can promote a user to Department Head, Asset Manager, or Admin, via **Organization Setup → Employee Directory**. This is intentional, matching the spec's requirement for realistic, non-self-elevating account creation.

---

## Features

- **Authentication** — JWT-based login/signup, employee-only signup, admin-controlled role promotion
- **Organization Setup** (Admin only) — Department management, Asset Category management, Employee Directory with role promotion
- **Asset Registration & Directory** — Assets with auto-generated tags (`AF-0001`, `AF-0002`, ...), status tracking (Available, Allocated, Under Maintenance, Retired, etc.)
- **Resource Booking** — Time-slot booking with overlap validation (e.g. a 9:00–10:00 booking blocks a 9:30–10:30 request, but allows a 10:00–11:00 request)
- **Maintenance Management** — Raise, approve/reject, and resolve maintenance requests, with asset status automatically updating
- **Dashboard** — KPI cards for Total Assets, Available, Allocated, Under Maintenance, Users, Departments, and Categories, plus a Recent Assets table
- **Activity Log** — Full audit trail of user actions (logins, creates, updates) with timestamps

---

## How to Try It

1. Log in as Admin (`kiyo@gmail.com`)
2. Go to **Organization Setup → Employees** to see role management in action
3. Go to **Assets** to view the registered asset and its auto-generated tag
4. Go to **Bookings**, create a booking, then try creating an overlapping one to see it correctly blocked
5. Go to **Dashboard** to see live KPI counts and **Activity** to see the audit trail

---

## Known Limitations

Built solo under hackathon time constraints — a few things are implemented at the backend level but not fully wired into the UI yet:

- **Allocation conflict-blocking** is implemented and tested at the API level (attempting to allocate an already-allocated asset returns a clear error naming the current holder), but the frontend button to trigger an allocation from the Assets page wasn't completed in time.
- The **Maintenance request form** has a known validation issue that can block submission in some cases.
- **Audit Cycles** and **Reports & Analytics** modules from the full spec were deliberately deprioritized to protect time for the core asset/booking/maintenance workflows.

---

Built for **Odoo Hackathon 2026**.