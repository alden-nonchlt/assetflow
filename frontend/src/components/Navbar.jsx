import { NavLink } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import StatusBadge from "./StatusBadge";

export default function Navbar() {
    const { user, logout } = useAuth();

    const links = [
        { name: "Dashboard", path: "/dashboard" },
        { name: "Assets", path: "/assets" },
        { name: "Bookings", path: "/bookings" },
        { name: "Maintenance", path: "/maintenance" },
        { name: "Activity", path: "/activity" },
    ];

    if (user?.role === "admin") {
        links.push({ name: "Organization Setup", path: "/organization" });
    }

    return (
        <nav className="bg-white border-b border-[#e8e4df] h-16 flex items-center justify-between px-6">
            <div className="flex items-center gap-8">
                <h1 className="text-xl font-bold text-[#1e1b4b] tracking-tight">
                    AssetFlow
                </h1>
                <div className="flex items-center gap-1">
                    {links.map((link) => (
                        <NavLink
                            key={link.path}
                            to={link.path}
                            className={({ isActive }) =>
                                `px-4 py-2 text-sm font-medium transition-all duration-200 ${
                                    isActive
                                        ? "text-[#1e1b4b] border-b-2 border-amber-500"
                                        : "text-[#78716c] hover:text-[#1e1b4b]"
                                }`
                            }
                        >
                            {link.name}
                        </NavLink>
                    ))}
                </div>
            </div>

            <div className="flex items-center gap-4">
                <div className="text-right">
                    <p className="font-medium text-[#1e1b4b] text-sm">
                        {user?.name}
                    </p>
                    <StatusBadge status={user?.role} />
                </div>

                <button
                    onClick={logout}
                    className="bg-red-500 hover:bg-red-600 text-white text-sm font-medium px-4 py-2 rounded-lg transition-all duration-150 cursor-pointer hover:scale-105"
                >
                    Logout
                </button>
            </div>
        </nav>
    );
}