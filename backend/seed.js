import bcrypt from "bcrypt";
import db from "./db.js";

console.log("🌱 Seeding database...\n");

// Clear existing data
db.exec("DELETE FROM activity_logs");
db.exec("DELETE FROM maintenance_requests");
db.exec("DELETE FROM bookings");
db.exec("DELETE FROM transfer_requests");
db.exec("DELETE FROM allocations");
db.exec("DELETE FROM assets");
db.exec("DELETE FROM asset_categories");
db.exec("DELETE FROM departments");
db.exec("DELETE FROM users");

// Reset auto-increment
db.exec("DELETE FROM sqlite_sequence");

// ============================================================
// USERS
// ============================================================
const hash = (pw) => bcrypt.hashSync(pw, 10);

const insertUser = db.prepare(`
    INSERT INTO users (name, email, password_hash, role, department_id, status)
    VALUES (?, ?, ?, ?, ?, 'active')
`);

insertUser.run("Admin User", "admin@assetflow.com", hash("admin123"), "admin", null);

// Will assign department heads after departments are created
const employeePlaceholders = [
    { name: "Alice Chen", email: "alice@assetflow.com", role: "employee" },
    { name: "Bob Martinez", email: "bob@assetflow.com", role: "employee" },
    { name: "Carol Smith", email: "carol@assetflow.com", role: "employee" },
    { name: "David Lee", email: "david@assetflow.com", role: "asset_manager" },
];

for (const e of employeePlaceholders) {
    insertUser.run(e.name, e.email, hash("123456"), e.role, null);
}

console.log("✅ Users created");

// ============================================================
// DEPARTMENTS
// ============================================================
const insertDept = db.prepare(`
    INSERT INTO departments (name, head_user_id, status)
    VALUES (?, ?, 'active')
`);

insertDept.run("Information Technology", null);
insertDept.run("Operations", null);
insertDept.run("Human Resources", null);

// Assign department heads (users 2, 3, 4)
db.prepare("UPDATE departments SET head_user_id = ? WHERE id = ?").run(2, 1); // Alice -> IT
db.prepare("UPDATE departments SET head_user_id = ? WHERE id = ?").run(3, 2); // Bob -> Ops
db.prepare("UPDATE departments SET head_user_id = ? WHERE id = ?").run(4, 3); // Carol -> HR
// Promote them to department_head
db.prepare("UPDATE users SET role = 'department_head' WHERE id IN (2, 3, 4)").run();

console.log("✅ Departments created (IT, Operations, HR)");

// ============================================================
// ASSET CATEGORIES
// ============================================================
const insertCategory = db.prepare(`
    INSERT INTO asset_categories (name, extra_fields_json)
    VALUES (?, ?)
`);

insertCategory.run("Electronics", null);
insertCategory.run("Furniture", null);
insertCategory.run("Vehicles", null);
insertCategory.run("Office Equipment", null);

console.log("✅ Asset categories created (Electronics, Furniture, Vehicles, Office Equipment)");

// ============================================================
// ASSETS
// ============================================================
const insertAsset = db.prepare(`
    INSERT INTO assets (asset_tag, name, category_id, serial_number, acquisition_date, acquisition_cost, condition, location, is_bookable, status)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
`);

const assets = [
    // IT Department assets (category 1 = Electronics)
    ["AF-0001", "Dell Latitude 5540 Laptop", 1, "SN-DELL-001", "2025-01-15", 1450.00, "Good", "HQ - Floor 2", 0, "available"],
    ["AF-0002", "MacBook Pro 16-inch", 1, "SN-APPLE-002", "2025-02-01", 2499.00, "Excellent", "HQ - Floor 3", 0, "allocated"],
    ["AF-0003", "ThinkPad X1 Carbon", 1, "SN-LENOVO-003", "2025-03-10", 1850.00, "Good", "HQ - Floor 2", 0, "allocated"],
    ["AF-0004", "Dell UltraSharp 27 Monitor", 1, "SN-DELL-004", "2025-01-20", 420.00, "Excellent", "HQ - Floor 2", 0, "available"],
    ["AF-0005", "Cisco IP Phone 8800", 1, "SN-CISCO-005", "2024-11-05", 280.00, "Fair", "HQ - Floor 1", 0, "available"],
    ["AF-0006", "HP LaserJet Pro Printer", 1, "SN-HP-006", "2024-10-01", 520.00, "Good", "HQ - Floor 1", 0, "under_maintenance"],

    // Furniture (category 2)
    ["AF-0007", "Herman Miller Aeron Chair", 2, "SN-HM-007", "2025-01-10", 1295.00, "Excellent", "HQ - Floor 2", 0, "allocated"],
    ["AF-0008", "Standing Desk - 60 inch", 2, "SN-SD-008", "2025-02-15", 899.00, "Good", "HQ - Floor 3", 0, "available"],
    ["AF-0009", "Meeting Room Conference Table", 2, null, "2024-12-01", 2400.00, "Good", "HQ - Floor 1", 0, "available"],
    ["AF-0010", "Office Bookshelf - 6ft", 2, null, "2024-09-20", 350.00, "Fair", "HQ - Floor 2", 0, "available"],

    // Vehicles (category 3)
    ["AF-0011", "Toyota Camry 2025", 3, "JT4RN91P9N5000001", "2025-03-01", 28500.00, "Excellent", "Parking Garage", 1, "available"],
    ["AF-0012", "Ford Transit Cargo Van", 3, "FT8VX92P2M6000002", "2024-08-15", 35500.00, "Good", "Parking Garage", 1, "allocated"],

    // Office Equipment (category 4)
    ["AF-0013", "NEC NP-PA803U Projector", 4, "SN-NEC-013", "2025-01-05", 3800.00, "Excellent", "HQ - Conf Room A", 1, "available"],
    ["AF-0014", "Shure Wireless Microphone System", 4, "SN-SHURE-014", "2024-11-20", 1200.00, "Good", "HQ - Conf Room B", 1, "retired"],
    ["AF-0015", "Canon EOS R5 Camera Kit", 4, "SN-CANON-015", "2025-02-10", 3899.00, "Excellent", "HQ - Media Room", 0, "available"],
    ["AF-0016", "LG 86\" 4K Display", 4, "SN-LG-016", "2024-12-10", 2999.00, "Good", "HQ - Lobby", 0, "available"],
    ["AF-0017", "Server Rack UPS System", 1, "SN-APC-017", "2024-06-01", 4500.00, "Good", "Server Room", 0, "available"],
];

for (const a of assets) {
    insertAsset.run(...a);
}

console.log("✅ 17 assets created");

// ============================================================
// ALLOCATIONS
// ============================================================
const insertAlloc = db.prepare(`
    INSERT INTO allocations (asset_id, allocated_to_user_id, department_id, expected_return_date, status, notes)
    VALUES (?, ?, ?, ?, 'active', ?)
`);

// Allocate AF-0002 (MacBook) to Alice (IT head, user 2)
insertAlloc.run(2, 2, 1, "2026-08-01", "");

// Allocate AF-0003 (ThinkPad) to Bob (Ops head, user 3)
insertAlloc.run(3, 3, 2, "2026-07-15", "");

// Allocate AF-0007 (Aeron Chair) to Carol (HR head, user 4)
insertAlloc.run(7, 4, 3, "2026-09-01", "");

// Allocate AF-0012 (Transit Van) to David (asset_manager, user 5)
insertAlloc.run(12, 5, 2, "2026-12-31", "Company pool vehicle");

// OVERDUE allocation: AF-0001 allocated to Alice with past return date
insertAlloc.run(1, 2, 1, "2026-04-01", "Overdue - needs return");

// Update asset statuses
db.prepare("UPDATE assets SET status = 'allocated' WHERE id IN (1, 2, 3, 7, 12)").run();

console.log("✅ 5 allocations created (1 overdue)");

// ============================================================
// BOOKINGS
// ============================================================
const insertBooking = db.prepare(`
    INSERT INTO bookings (resource_asset_id, booked_by_user_id, start_time, end_time, status)
    VALUES (?, ?, ?, ?, ?)
`);

// Book AF-0011 (Toyota Camry) - upcoming
insertBooking.run(11, 2, "2026-07-20 09:00:00", "2026-07-20 17:00:00", "upcoming");

// Book AF-0011 again - overlap test
insertBooking.run(11, 3, "2026-07-22 10:00:00", "2026-07-22 15:00:00", "upcoming");

// Book AF-0013 (Projector) - completed
insertBooking.run(13, 4, "2026-06-01 13:00:00", "2026-06-01 16:00:00", "completed");

// Book AF-0011 - ongoing (today)
const today = new Date();
const startTime = new Date(today.getFullYear(), today.getMonth(), today.getDate(), 8, 0, 0);
const endTime = new Date(today.getFullYear(), today.getMonth(), today.getDate(), 12, 0, 0);
const fmt = (d) => d.toISOString().slice(0, 19).replace("T", " ");
insertBooking.run(11, 5, fmt(startTime), fmt(endTime), "ongoing");

// Book AF-0011 - cancelled
insertBooking.run(11, 2, "2026-06-15 09:00:00", "2026-06-15 14:00:00", "cancelled");

console.log("✅ 5 bookings created");

// ============================================================
// MAINTENANCE REQUESTS
// ============================================================
const insertMaint = db.prepare(`
    INSERT INTO maintenance_requests (asset_id, raised_by_user_id, description, priority, status)
    VALUES (?, ?, ?, ?, ?)
`);

// Pending - AF-0005 printer issue
insertMaint.run(5, 2, "Paper jam on every print job. Needs immediate inspection.", "Medium", "pending");

// Approved - AF-0014 retired cam (still in system)
insertMaint.run(14, 4, "Camera flash stopped working and lens has fungus.", "Low", "approved");

// Resolved - AF-0006 was under maintenance
insertMaint.run(6, 3, "Printer not connecting to network after power outage.", "High", "resolved");
db.prepare("UPDATE assets SET status = 'available' WHERE id = 6").run();

// Pending high priority
insertMaint.run(17, 2, "UPS battery warning light is on. Backup runtime is down to 3 minutes.", "High", "pending");

// Rejected
insertMaint.run(10, 3, "Bookshelf has a scratch on the side panel.", "Low", "rejected");

console.log("✅ 5 maintenance requests created");

// ============================================================
// ACTIVITY LOG
// ============================================================
const insertActivity = db.prepare(`
    INSERT INTO activity_logs (user_id, action_description)
    VALUES (?, ?)
`);

const activities = [
    [1, "Database seeded with initial data."],
    [1, "Administrator account created."],
    [2, "Logged in."],
    [3, "Logged in."],
    [2, "Asset AF-0001 (Dell Latitude) allocated."],
    [3, "Asset AF-0003 (ThinkPad) allocated."],
    [4, "Asset AF-0007 (Aeron Chair) allocated."],
    [2, "Booked Toyota Camry for July 20."],
    [3, "Booked Toyota Camry for July 22."],
    [5, "Maintenance raised for projector."],
];

for (const a of activities) {
    insertActivity.run(...a);
}

console.log("✅ 10 activity log entries created");

// ============================================================
// SUMMARY
// ============================================================
console.log("\n============================================");
console.log("🌱 SEED COMPLETE");
console.log("============================================");
console.log("");
console.log("Login Credentials:");
console.log("  Admin:                admin@assetflow.com / admin123");
console.log("  IT Dept Head (Alice): alice@assetflow.com / 123456");
console.log("  Ops Dept Head (Bob):  bob@assetflow.com / 123456");
console.log("  HR Dept Head (Carol): carol@assetflow.com / 123456");
console.log("  Asset Mgr (David):    david@assetflow.com / 123456");
console.log("");
console.log("Key demo data:");
console.log("  - 1 overdue allocation (Dell Latitude to Alice, due April 1)");
console.log("  - 1 active maintenance request (printer jam)");
console.log("  - 1 approved maintenance request (camera lens)");
console.log("  - 1 ongoing booking (Toyota Camry, today)");
console.log("  - Overlapping booking test data present");
console.log("============================================\n");