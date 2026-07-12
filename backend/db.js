import Database from "better-sqlite3";
import path from "path";

const dbPath = path.join(process.cwd(), "assetflow.db");

const db = new Database(dbPath);

// Enable foreign keys
db.pragma("foreign_keys = ON");

// ================= USERS =================

db.prepare(`
CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    email TEXT NOT NULL UNIQUE,
    password_hash TEXT NOT NULL,

    role TEXT NOT NULL DEFAULT 'employee'
        CHECK(role IN (
            'employee',
            'department_head',
            'asset_manager',
            'admin'
        )),

    department_id INTEGER,

    status TEXT NOT NULL DEFAULT 'active'
        CHECK(status IN (
            'active',
            'inactive'
        )),

    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY(department_id)
        REFERENCES departments(id)
        ON DELETE SET NULL
)
`).run();


// ================= DEPARTMENTS =================

db.prepare(`
CREATE TABLE IF NOT EXISTS departments (
    id INTEGER PRIMARY KEY AUTOINCREMENT,

    name TEXT NOT NULL UNIQUE,

    head_user_id INTEGER,

    parent_department_id INTEGER,

    status TEXT NOT NULL DEFAULT 'active'
        CHECK(status IN (
            'active',
            'inactive'
        )),

    FOREIGN KEY(head_user_id)
        REFERENCES users(id)
        ON DELETE SET NULL,

    FOREIGN KEY(parent_department_id)
        REFERENCES departments(id)
        ON DELETE SET NULL
)
`).run();


// ================= ASSET CATEGORIES =================

db.prepare(`
CREATE TABLE IF NOT EXISTS asset_categories (

    id INTEGER PRIMARY KEY AUTOINCREMENT,

    name TEXT NOT NULL UNIQUE,

    extra_fields_json TEXT

)
`).run();


// ================= ASSETS =================

db.prepare(`
CREATE TABLE IF NOT EXISTS assets (

    id INTEGER PRIMARY KEY AUTOINCREMENT,

    asset_tag TEXT UNIQUE NOT NULL,

    name TEXT NOT NULL,

    category_id INTEGER,

    serial_number TEXT,

    acquisition_date TEXT,

    acquisition_cost REAL,

    condition TEXT,

    location TEXT,

    photo_url TEXT,

    is_bookable INTEGER DEFAULT 0,

    status TEXT DEFAULT 'available'
        CHECK(status IN (
            'available',
            'allocated',
            'reserved',
            'under_maintenance',
            'lost',
            'retired',
            'disposed'
        )),

    FOREIGN KEY(category_id)
        REFERENCES asset_categories(id)
        ON DELETE SET NULL

)
`).run();


// ================= ALLOCATIONS =================

db.prepare(`
CREATE TABLE IF NOT EXISTS allocations (

    id INTEGER PRIMARY KEY AUTOINCREMENT,

    asset_id INTEGER NOT NULL,

    allocated_to_user_id INTEGER,

    department_id INTEGER,

    expected_return_date TEXT,

    status TEXT DEFAULT 'active'
        CHECK(status IN (
            'active',
            'returned'
        )),

    notes TEXT,

    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,

    returned_at DATETIME,

    FOREIGN KEY(asset_id)
        REFERENCES assets(id),

    FOREIGN KEY(allocated_to_user_id)
        REFERENCES users(id),

    FOREIGN KEY(department_id)
        REFERENCES departments(id)

)
`).run();


// ================= TRANSFER REQUESTS =================

db.prepare(`
CREATE TABLE IF NOT EXISTS transfer_requests (

    id INTEGER PRIMARY KEY AUTOINCREMENT,

    asset_id INTEGER NOT NULL,

    requested_by_user_id INTEGER NOT NULL,

    current_holder_user_id INTEGER NOT NULL,

    status TEXT DEFAULT 'requested'
        CHECK(status IN (
            'requested',
            'approved',
            'rejected'
        )),

    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY(asset_id)
        REFERENCES assets(id),

    FOREIGN KEY(requested_by_user_id)
        REFERENCES users(id),

    FOREIGN KEY(current_holder_user_id)
        REFERENCES users(id)

)
`).run();


// ================= BOOKINGS =================

db.prepare(`
CREATE TABLE IF NOT EXISTS bookings (

    id INTEGER PRIMARY KEY AUTOINCREMENT,

    resource_asset_id INTEGER NOT NULL,

    booked_by_user_id INTEGER NOT NULL,

    start_time TEXT NOT NULL,

    end_time TEXT NOT NULL,

    status TEXT DEFAULT 'upcoming'
        CHECK(status IN (
            'upcoming',
            'ongoing',
            'completed',
            'cancelled'
        )),

    FOREIGN KEY(resource_asset_id)
        REFERENCES assets(id),

    FOREIGN KEY(booked_by_user_id)
        REFERENCES users(id)

)
`).run();


// ================= MAINTENANCE =================

db.prepare(`
CREATE TABLE IF NOT EXISTS maintenance_requests (

    id INTEGER PRIMARY KEY AUTOINCREMENT,

    asset_id INTEGER NOT NULL,

    raised_by_user_id INTEGER NOT NULL,

    description TEXT NOT NULL,

    priority TEXT,

    status TEXT DEFAULT 'pending'
        CHECK(status IN (
            'pending',
            'approved',
            'rejected',
            'in_progress',
            'resolved'
        )),

    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,

    resolved_at DATETIME,

    FOREIGN KEY(asset_id)
        REFERENCES assets(id),

    FOREIGN KEY(raised_by_user_id)
        REFERENCES users(id)

)
`).run();


// ================= ACTIVITY LOGS =================

db.prepare(`
CREATE TABLE IF NOT EXISTS activity_logs (

    id INTEGER PRIMARY KEY AUTOINCREMENT,

    user_id INTEGER,

    action_description TEXT NOT NULL,

    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY(user_id)
        REFERENCES users(id)
        ON DELETE SET NULL

)
`).run();

console.log("✅ Database initialized successfully.");

export default db;