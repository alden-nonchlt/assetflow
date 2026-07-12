import { useEffect, useState } from "react";
import api from "../api/axios";
import LoadingSpinner from "../components/LoadingSpinner";
import StatusBadge from "../components/StatusBadge";

export default function Maintenance() {
    const [requests, setRequests] = useState([]);
    const [assets, setAssets] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [formError, setFormError] = useState("");
    const [form, setForm] = useState({
        asset_id: "",
        description: "",
        priority: "Medium",
    });

    const loadRequests = async () => {
        try {
            const res = await api.get("/maintenance");
            setRequests(res.data.data);
        } catch (err) {
            console.error(err);
        }
    };

    const loadAssets = async () => {
        try {
            setLoading(true);
            setError("");
            const res = await api.get("/assets");
            setAssets(res.data.data);
            await loadRequests();
        } catch (err) {
            setError(err.response?.data?.message || "Failed to load data");
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadAssets();
    }, []);

    const createRequest = async () => {
        setFormError("");
        if (!form.asset_id || !form.description.trim()) {
            setFormError("Asset and description are required.");
            return;
        }
        try {
            await api.post("/maintenance", { ...form });
            setForm({ asset_id: "", description: "", priority: "Medium" });
            loadRequests();
        } catch (err) {
            setFormError(err.response?.data?.message || "Failed to create request");
        }
    };

    const updateStatus = async (id, action) => {
        try {
            await api.put(`/maintenance/${id}/${action}`);
            loadRequests();
        } catch (err) {
            console.error(err);
        }
    };

    if (loading) return <LoadingSpinner text="Loading maintenance requests..." />;

    if (error) {
        return (
            <div>
                <h1 className="text-3xl font-bold text-slate-800 mb-2">Maintenance</h1>
                <p className="text-slate-500 mb-6">Manage asset maintenance requests</p>
                <div className="bg-red-50 border border-red-200 text-red-700 text-sm p-4 rounded-lg">{error}</div>
            </div>
        );
    }

    return (
        <div>
            <h1 className="text-3xl font-bold text-slate-800 mb-1">Maintenance</h1>
            <p className="text-slate-500 mb-6">Manage asset maintenance requests</p>

            <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5 mb-6">
                <h2 className="text-lg font-bold text-slate-800 mb-4">Raise Maintenance Request</h2>

                {formError && (
                    <div className="bg-red-50 border border-red-200 text-red-700 text-sm p-3 rounded-lg mb-4">
                        {formError}
                    </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                    <select
                        className="border border-slate-300 rounded-lg p-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        value={form.asset_id}
                        onChange={(e) => setForm({ ...form, asset_id: e.target.value })}
                    >
                        <option value="">Select Asset</option>
                        {assets.map((asset) => (
                            <option key={asset.id} value={asset.id}>
                                {asset.asset_tag} - {asset.name}
                            </option>
                        ))}
                    </select>

                    <select
                        className="border border-slate-300 rounded-lg p-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        value={form.priority}
                        onChange={(e) => setForm({ ...form, priority: e.target.value })}
                    >
                        <option value="Low">Low</option>
                        <option value="Medium">Medium</option>
                        <option value="High">High</option>
                    </select>

                    <button
                        onClick={createRequest}
                        className="bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium px-5 py-2.5 rounded-lg transition-all duration-150 cursor-pointer hover:scale-105"
                    >
                        Submit Request
                    </button>
                </div>

                <textarea
                    className="border border-slate-300 rounded-lg p-2.5 text-sm w-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Describe the problem..."
                    rows={3}
                    value={form.description}
                    onChange={(e) => setForm({ ...form, description: e.target.value })}
                />
            </div>

            <div className="bg-white rounded-xl border border-slate-200 shadow-sm">
                <div className="p-5 border-b border-slate-100">
                    <h2 className="text-lg font-bold text-slate-800">All Requests</h2>
                </div>

                {requests.length > 0 ? (
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="border-b border-slate-100 text-left">
                                    <th className="p-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Asset</th>
                                    <th className="p-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Raised By</th>
                                    <th className="p-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Priority</th>
                                    <th className="p-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Status</th>
                                    <th className="p-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {requests.map((req) => (
                                    <tr
                                        key={req.id}
                                        className="border-b border-slate-50 hover:bg-slate-50 transition-colors duration-200"
                                    >
                                        <td className="p-4 text-sm font-medium text-slate-800">
                                            {req.asset_tag} - {req.asset_name}
                                        </td>
                                        <td className="p-4 text-sm text-slate-600">{req.raised_by}</td>
                                        <td className="p-4">
                                            <StatusBadge status={req.priority?.toLowerCase()} />
                                        </td>
                                        <td className="p-4">
                                            <StatusBadge status={req.status} />
                                        </td>
                                        <td className="p-4 space-x-2">
                                            {req.status === "pending" && (
                                                <>
                                                    <button
                                                        onClick={() => updateStatus(req.id, "approve")}
                                                        className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-medium px-3 py-1.5 rounded-lg transition-all duration-150 cursor-pointer hover:scale-105"
                                                    >
                                                        Approve
                                                    </button>
                                                    <button
                                                        onClick={() => updateStatus(req.id, "reject")}
                                                        className="bg-red-500 hover:bg-red-600 text-white text-xs font-medium px-3 py-1.5 rounded-lg transition-all duration-150 cursor-pointer hover:scale-105"
                                                    >
                                                        Reject
                                                    </button>
                                                </>
                                            )}
                                            {req.status === "approved" && (
                                                <button
                                                    onClick={() => updateStatus(req.id, "assign")}
                                                    className="bg-purple-600 hover:bg-purple-700 text-white text-xs font-medium px-3 py-1.5 rounded-lg transition-all duration-150 cursor-pointer hover:scale-105"
                                                >
                                                    Assign Tech
                                                </button>
                                            )}
                                            {req.status === "assigned" && (
                                                <button
                                                    onClick={() => updateStatus(req.id, "start")}
                                                    className="bg-cyan-600 hover:bg-cyan-700 text-white text-xs font-medium px-3 py-1.5 rounded-lg transition-all duration-150 cursor-pointer hover:scale-105"
                                                >
                                                    Start Work
                                                </button>
                                            )}
                                            {req.status === "in_progress" && (
                                                <button
                                                    onClick={() => updateStatus(req.id, "resolve")}
                                                    className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-medium px-3 py-1.5 rounded-lg transition-all duration-150 cursor-pointer hover:scale-105"
                                                >
                                                    Resolve
                                                </button>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                ) : (
                    <div className="p-8 text-center text-slate-400 text-sm">
                        No maintenance requests yet. Raise one above.
                    </div>
                )}
            </div>
        </div>
    );
}