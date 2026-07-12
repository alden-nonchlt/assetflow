import { useEffect, useState } from "react";
import api from "../api/axios";
import LoadingSpinner from "../components/LoadingSpinner";
import StatusBadge from "../components/StatusBadge";

const kpiAccents = {
  "Total Assets": "border-l-indigo-500",
  "Available": "border-l-emerald-500",
  "Allocated": "border-l-indigo-500",
  "Under Maintenance": "border-l-amber-500",
  "Users": "border-l-slate-400",
  "Departments": "border-l-slate-400",
  "Categories": "border-l-slate-400",
};

export default function Dashboard() {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const loadDashboard = async () => {
        try {
            setLoading(true);
            setError("");
            const res = await api.get("/admin/dashboard");
            setData(res.data.dashboard);
        } catch (err) {
            setError(err.response?.data?.message || "Failed to load dashboard");
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadDashboard();
    }, []);

    if (loading) return <LoadingSpinner text="Loading dashboard..." />;

    if (error) {
        return (
            <div>
                <div className="flex items-center gap-3 mb-1">
                    <div className="w-1 h-8 bg-indigo-500 rounded-full" />
                    <h1 className="text-2xl font-bold text-[#1e1b4b] tracking-tight">Dashboard</h1>
                </div>
                <p className="text-[#78716c] text-sm ml-4 mb-6">Welcome to AssetFlow ERP Dashboard</p>
                <div className="bg-red-50 border border-red-200 text-red-700 text-sm p-4 rounded-lg">{error}</div>
            </div>
        );
    }

    if (!data) return null;

    const overdueCount = data.overdue?.length || 0;

    const cards = [
        { title: "Total Assets", value: data.products, color: "text-indigo-600" },
        { title: "Available", value: data.available, color: "text-emerald-600" },
        {
            title: "Allocated",
            value: data.allocated,
            color: "text-indigo-600",
            extra: overdueCount > 0 ? (
                <span className="text-xs font-medium text-red-600 ml-2 bg-red-50 px-2 py-0.5 rounded-full">
                    {overdueCount} overdue
                </span>
            ) : null
        },
        { title: "Under Maintenance", value: data.maintenance, color: "text-amber-600" },
        { title: "Users", value: data.users, color: "text-slate-600" },
        { title: "Departments", value: data.departments, color: "text-slate-600" },
        { title: "Categories", value: data.categories, color: "text-slate-600" },
    ];

    return (
        <div>
            <div className="flex items-center gap-3 mb-1">
                <div className="w-1 h-8 bg-indigo-500 rounded-full" />
                <h1 className="text-2xl font-bold text-[#1e1b4b] tracking-tight">Dashboard</h1>
            </div>
            <p className="text-[#78716c] text-sm ml-4 mb-6">Welcome to AssetFlow ERP Dashboard</p>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                {cards.map((card, index) => (
                    <div
                        key={card.title}
                        className={`kpi-card kpi-card-stagger-${index + 1} bg-white p-5 rounded-xl border border-[#e8e4df] shadow-sm hover:shadow-md transition-all duration-150 border-l-4 ${kpiAccents[card.title] || "border-l-slate-300"}`}
                    >
                        <div className="flex items-center justify-between">
                            <h3 className="text-xs font-semibold text-[#78716c] uppercase tracking-wider">
                                {card.title}
                            </h3>
                            {card.extra}
                        </div>
                        <p className={`text-4xl font-bold tracking-tight mt-1 ${card.color}`}>
                            {card.value}
                        </p>
                    </div>
                ))}
            </div>

            {data.overdue && data.overdue.length > 0 && (
                <div className="bg-red-50 border border-red-200 rounded-xl p-5 mb-8">
                    <h2 className="text-lg font-bold text-red-800 mb-3">
                        Overdue Returns ({data.overdue.length})
                    </h2>
                    <div className="space-y-2">
                        {data.overdue.map((item) => (
                            <div
                                key={item.id}
                                className="flex items-center justify-between bg-white rounded-lg p-3 border border-red-100"
                            >
                                <div>
                                    <p className="font-medium text-slate-800 text-sm">{item.asset_name}</p>
                                    <p className="text-xs text-slate-500">{item.asset_tag}</p>
                                </div>
                                <div className="text-right">
                                    <p className="text-sm text-red-600 font-medium">{item.user_name}</p>
                                    <p className="text-xs text-slate-500">Due: {item.expected_return_date}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            <div className="bg-white rounded-xl border border-[#e8e4df] shadow-sm">
                <div className="p-5 border-b border-[#e8e4df]">
                    <h2 className="text-base font-bold text-[#1e1b4b] tracking-tight">Recent Assets</h2>
                </div>

                {data.recentAssets && data.recentAssets.length > 0 ? (
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="border-b border-[#e8e4df] text-left">
                                    <th className="p-4 text-xs font-semibold text-[#78716c] uppercase tracking-wider">Name</th>
                                    <th className="p-4 text-xs font-semibold text-[#78716c] uppercase tracking-wider">Code</th>
                                    <th className="p-4 text-xs font-semibold text-[#78716c] uppercase tracking-wider">Category</th>
                                    <th className="p-4 text-xs font-semibold text-[#78716c] uppercase tracking-wider">Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                {data.recentAssets.map((asset, i) => (
                                    <tr
                                        key={asset.id}
                                        className={`${i % 2 === 0 ? "bg-white" : "bg-[#faf9f7]"} border-b border-[#e8e4df] hover:bg-[#f3f1ee] transition-colors duration-200`}
                                    >
                                        <td className="p-4 text-sm font-medium text-[#1e1b4b]">{asset.name}</td>
                                        <td className="p-4 text-sm font-mono text-amber-600">{asset.asset_tag}</td>
                                        <td className="p-4 text-sm text-[#78716c]">{asset.category || "-"}</td>
                                        <td className="p-4">
                                            <StatusBadge status={asset.status} />
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                ) : (
                    <div className="p-8 text-center text-[#78716c] text-sm">No assets registered yet.</div>
                )}
            </div>
        </div>
    );
}