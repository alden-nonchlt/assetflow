# AssetFlow

Enterprise asset & resource management system for tracking company assets, managing bookings, and handling maintenance workflows. Built for Odoo Hackathon 2026.

## Tech Stack

**Backend**
- Express.js
- SQLite
- bcrypt (password hashing)

**Frontend**
- React
- Vite
- Tailwind CSS
- react-router-dom

## Setup

```bash
# Backend
cd backend && npm install && node server.js

# Frontend
cd frontend && npm install && npm run dev
```

## Features

- Role-based auth (signup creates Employee only, Admin promotes via Employee Directory)
- Organization Setup: Departments, Asset Categories, Employee Directory
- Asset registration with auto-generated tags (AF-0001...)
- Resource booking with overlap validation
- Maintenance request workflow
- Dashboard with KPI cards
- Activity log

## Known Limitations

- Allocation conflict-blocking is implemented and tested at the API level but the frontend UI trigger wasn't completed in time
- Maintenance request form has a known validation bug preventing submission

## License

MIT