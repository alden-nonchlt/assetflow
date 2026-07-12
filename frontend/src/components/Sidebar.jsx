import { NavLink } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Sidebar() {
    const { user } = useAuth();

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
        <aside className="w-64 min-h-screen bg-gradient-to-b from-[#1e1b4b] to-[#151238] text-white flex flex-col">
            <div className="p-6 border-b border-white/10">
                <h1 className="text-2xl font-bold tracking-tight">
                    AssetFlow
                </h1>
                <p className="text-xs text-white/40 mt-1">Enterprise Asset Management</p>
            </div>

            <nav className="flex-1 p-4 space-y-1">
                {links.map((link) => (
                    <NavLink
                        key={link.path}
                        to={link.path}
                        className={({ isActive }) =>
                            `flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition-all duration-150 ${
                                isActive
                                    ? "bg-white/10 text-white border-l-[3px] border-amber-500 pl-[13px]"
                                    : "text-white/50 hover:bg-white/5 hover:text-white/80 pl-4"
                            }`
                        }
                    >
                        {link.name}
                    </NavLink>
                ))}
            </nav>

            <div className="p-4 border-t border-white/10">
                <p className="text-xs text-white/30">v1.0.0</p>
            </div>
        </aside>
    );
}