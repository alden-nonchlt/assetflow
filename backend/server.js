import express from "express";
import cors from "cors";
import dotenv from "dotenv";

// Load environment variables
dotenv.config();

// Initialize database
import "./db.js";

// Routes
import authRoutes from "./routes/auth.js";

import adminDepartmentRoutes from "./routes/adminDepartments.js";
import adminCategoryRoutes from "./routes/adminCategories.js";
import adminAssetRoutes from "./routes/adminAssets.js";
import adminUserRoutes from "./routes/adminUsers.js";
import adminDashboardRoutes from "./routes/adminDashboard.js";

import assetRoutes from "./routes/assets.js";
import allocationRoutes from "./routes/allocations.js";
import bookingRoutes from "./routes/bookings.js";
import maintenanceRoutes from "./routes/maintenance.js";
import activityRoutes from "./routes/activity.js";

const app = express();

const PORT = process.env.PORT || 5000;

// =============================
// Middleware
// =============================

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Request Logger
app.use((req, res, next) => {
    console.log(
        `${new Date().toLocaleString()} | ${req.method} ${req.originalUrl}`
    );
    next();
});

// =============================
// Health Routes
// =============================

app.get("/", (req, res) => {
    res.json({
        success: true,
        name: "AssetFlow ERP API",
        version: "1.0.0",
        message: "Backend is running 🚀",
    });
});

app.get("/health", (req, res) => {
    res.json({
        success: true,
        status: "healthy",
        uptime: process.uptime(),
        timestamp: new Date().toISOString(),
    });
});

// =============================
// API Routes
// =============================

// Authentication
app.use("/api/auth", authRoutes);

// Admin
app.use("/api/admin/departments", adminDepartmentRoutes);
app.use("/api/admin/categories", adminCategoryRoutes);
app.use("/api/admin/assets", adminAssetRoutes);
app.use("/api/admin/users", adminUserRoutes);
app.use("/api/admin/dashboard", adminDashboardRoutes);

// Assets
app.use("/api/assets", assetRoutes);

// Allocations
app.use("/api/allocations", allocationRoutes);

// Bookings
app.use("/api/bookings", bookingRoutes);

// Maintenance
app.use("/api/maintenance", maintenanceRoutes);

// Activity
app.use("/api/activity", activityRoutes);

// =============================
// 404
// =============================

app.use((req, res) => {
    res.status(404).json({
        success: false,
        message: "Endpoint not found",
    });
});

// =============================
// Error Handler
// =============================

app.use((err, req, res, next) => {
    console.error(err);

    res.status(err.status || 500).json({
        success: false,
        message: err.message || "Internal Server Error",
    });
});

// =============================
// Start Server
// =============================

app.listen(PORT, () => {
    console.log("");
    console.log("======================================");
    console.log("🚀 AssetFlow Backend Started");
    console.log(`🌍 http://localhost:${PORT}`);
    console.log("======================================");
    console.log("");
});