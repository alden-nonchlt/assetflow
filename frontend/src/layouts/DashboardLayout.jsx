import { Outlet } from "react-router-dom";

import Sidebar from "../components/Sidebar";
import Topbar from "../components/Topbar";

export default function DashboardLayout() {
    return (
        <div className="min-h-screen flex bg-[#f8f7f4]">
            <Sidebar />
            <div className="flex-1 flex flex-col">
                <Topbar />
                <main className="p-6 flex-1">
                    <Outlet />
                </main>
            </div>
        </div>
    );
}