import { Routes, Route, Navigate } from "react-router-dom";

import Login from "../pages/Login";
import Signup from "../pages/Signup";

import Dashboard from "../pages/Dashboard";
import Assets from "../pages/Assets";
import Bookings from "../pages/Bookings";
import Maintenance from "../pages/Maintenance";
import OrganizationSetup from "../pages/OrganizationSetup";

import ProtectedRoute from "../components/ProtectedRoute";
import DashboardLayout from "../layouts/DashboardLayout";


export default function AppRoutes(){

    return (

        <Routes>


            {/* Public Routes */}

            <Route
                path="/login"
                element={<Login />}
            />


            <Route
                path="/signup"
                element={<Signup />}
            />



            {/* Protected ERP Layout */}

            <Route
                element={
                    <ProtectedRoute>
                        <DashboardLayout />
                    </ProtectedRoute>
                }
            >

                <Route
                    path="/dashboard"
                    element={<Dashboard />}
                />


                <Route
                    path="/assets"
                    element={<Assets />}
                />


                <Route
                    path="/bookings"
                    element={<Bookings />}
                />


                <Route
                    path="/maintenance"
                    element={<Maintenance />}
                />


                <Route
                    path="/organization"
                    element={<OrganizationSetup />}
                />

            </Route>



            {/* Fallback */}

            <Route
                path="*"
                element={<Navigate to="/dashboard" />}
            />


        </Routes>

    );

}