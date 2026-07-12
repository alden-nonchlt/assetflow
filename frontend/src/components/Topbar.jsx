import { useAuth } from "../context/AuthContext";
import StatusBadge from "./StatusBadge";

export default function Topbar() {
    const { user, logout } = useAuth();

    return (
        <header className="h-16 bg-white border-b border-[#e8e4df] flex items-center justify-between px-6">
            <h2 className="text-lg font-semibold text-[#1e1b4b] tracking-tight">
                Dashboard
            </h2>

            <div className="flex items-center gap-4">
                <div className="text-right">
                    <p className="font-medium text-[#1e1b4b] text-sm">
                        {user?.name}
                    </p>
                    <StatusBadge status={user?.role} />
                </div>

                <button
                    onClick={logout}
                    className="bg-red-500 hover:bg-red-600 text-white text-sm font-medium px-4 py-2 rounded-lg transition-all duration-150 cursor-pointer"
                >
                    Logout
                </button>
            </div>
        </header>
    );
}