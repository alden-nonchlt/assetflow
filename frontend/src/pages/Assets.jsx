import { useEffect, useState } from "react";
import api from "../api/axios";
import LoadingSpinner from "../components/LoadingSpinner";
import StatusBadge from "../components/StatusBadge";

export default function Assets() {
    const [assets, setAssets] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const loadAssets = async () => {
        try {
            setLoading(true);
            setError("");
            const res = await api.get("/assets");
            setAssets(res.data.data);
        } catch (err) {
            setError(err.response?.data?.message || "Failed to load assets");
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadAssets();
    }, []);

    if (loading) return <LoadingSpinner text="Loading assets..." />;

    if (error) {
        return (
            <div>
                <h1 className="text-3xl font-bold text-slate-800 mb-2">Assets</h1>
                <p className="text-slate-500 mb-6">Manage all registered assets</p>
                <div className="bg-red-50 border border-red-200 text-red-700 text-sm p-4 rounded-lg">{error}</div>
            </div>
        );
    }

    return (
        <div>
            <h1 className="text-3xl font-bold text-slate-800 mb-1">Assets</h1>
            <p className="text-slate-500 mb-6">Manage all registered assets</p>

            <div className="bg-white rounded-xl border border-slate-200 shadow-sm">
                <div className="p-5 border-b border-slate-100">
                    <h2 className="text-lg font-bold text-slate-800">All Assets</h2>
                </div>

                {assets.length > 0 ? (
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="border-b border-slate-100 text-left">
                                    <th className="p-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Tag</th>
                                    <th className="p-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Name</th>
                                    <th className="p-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Category</th>
                                    <th className="p-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Serial #</th>
                                    <th className="p-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                {assets.map((asset) => (
                                    <tr
                                        key={asset.id}
                                        className="border-b border-slate-50 hover:bg-slate-50 transition-colors duration-100"
                                    >
                                        <td className="p-4 text-sm font-mono text-blue-600">{asset.asset_tag}</td>
                                        <td className="p-4 text-sm font-medium text-slate-800">{asset.name}</td>
                                        <td className="p-4 text-sm text-slate-600">{asset.category_name || "-"}</td>
                                        <td className="p-4 text-sm text-slate-500">{asset.serial_number || "-"}</td>
                                        <td className="p-4">
                                            <StatusBadge status={asset.status} />
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                ) : (
                    <div className="p-8 text-center text-slate-400 text-sm">
                        No assets registered yet. Register an asset to get started.
                    </div>
                )}
            </div>
        </div>
    );
}