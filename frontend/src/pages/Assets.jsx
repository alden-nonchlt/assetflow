import { useEffect, useState } from "react";
import api from "../api/axios";
import LoadingSpinner from "../components/LoadingSpinner";
import StatusBadge from "../components/StatusBadge";

export default function Assets() {
    const [assets, setAssets] = useState([]);
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [allocateModal, setAllocateModal] = useState({
        open: false,
        asset: null,
        userId: "",
        submitting: false,
        error: ""
    });

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

    const loadUsers = async () => {
        try {
            const res = await api.get("/admin/users");
            setUsers(res.data.data);
        } catch (err) {
            console.error(err);
        }
    };

    useEffect(() => {
        loadAssets();
        loadUsers();
    }, []);

    const openAllocateModal = (asset) => {
        setAllocateModal({
            open: true,
            asset,
            userId: "",
            submitting: false,
            error: ""
        });
    };

    const closeAllocateModal = () => {
        setAllocateModal({
            open: false,
            asset: null,
            userId: "",
            submitting: false,
            error: ""
        });
    };

    const handleAllocate = async () => {
        if (!allocateModal.userId) {
            setAllocateModal(prev => ({ ...prev, error: "Please select a user." }));
            return;
        }

        setAllocateModal(prev => ({ ...prev, submitting: true, error: "" }));

        try {
            await api.post("/allocations", {
                asset_id: allocateModal.asset.id,
                allocated_to_user_id: allocateModal.userId
            });

            closeAllocateModal();
            loadAssets();
        } catch (err) {
            setAllocateModal(prev => ({
                ...prev,
                error: err.response?.data?.message || "Allocation failed"
            }));
        } finally {
            setAllocateModal(prev => ({ ...prev, submitting: false }));
        }
    };

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
                                    <th className="p-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {assets.map((asset) => (
                                    <tr
                                        key={asset.id}
                                        className="border-b border-slate-50 hover:bg-slate-50 transition-colors duration-200"
                                    >
                                        <td className="p-4 text-sm font-mono text-blue-600">{asset.asset_tag}</td>
                                        <td className="p-4 text-sm font-medium text-slate-800">{asset.name}</td>
                                        <td className="p-4 text-sm text-slate-600">{asset.category_name || "-"}</td>
                                        <td className="p-4 text-sm text-slate-500">{asset.serial_number || "-"}</td>
                                        <td className="p-4">
                                            <StatusBadge status={asset.status} />
                                        </td>
                                        <td className="p-4">
                                            {asset.status === "available" && (
                                                <button
                                                    onClick={() => openAllocateModal(asset)}
                                                    className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-medium px-3 py-1.5 rounded-lg transition-all duration-150 cursor-pointer hover:scale-105"
                                                >
                                                    Allocate
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
                        No assets registered yet. Register an asset to get started.
                    </div>
                )}
            </div>

            {/* Allocate Modal */}
            {allocateModal.open && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-xl shadow-lg max-w-md w-full p-6">
                        <h3 className="text-lg font-bold text-slate-800 mb-4">
                            Allocate Asset: {allocateModal.asset?.asset_tag}
                        </h3>

                        {allocateModal.error && (
                            <div className="bg-red-50 border border-red-200 text-red-700 text-sm p-3 rounded-lg mb-4">
                                {allocateModal.error}
                            </div>
                        )}

                        <div className="mb-4">
                            <label className="block text-sm font-medium text-slate-700 mb-2">
                                Select User
                            </label>
                            <select
                                className="w-full border border-slate-300 rounded-lg p-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                value={allocateModal.userId}
                                onChange={(e) => setAllocateModal(prev => ({ ...prev, userId: e.target.value }))}
                                disabled={allocateModal.submitting}
                            >
                                <option value="">Select a user...</option>
                                {users.map((user) => (
                                    <option key={user.id} value={user.id}>
                                        {user.name} ({user.email})
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className="flex gap-3 justify-end">
                            <button
                                onClick={closeAllocateModal}
                                disabled={allocateModal.submitting}
                                className="px-4 py-2 text-sm font-medium text-slate-600 hover:text-slate-800 transition-colors cursor-pointer disabled:opacity-50"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleAllocate}
                                disabled={allocateModal.submitting}
                                className="bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium px-5 py-2.5 rounded-lg transition-all duration-150 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed hover:scale-105"
                            >
                                {allocateModal.submitting ? "Allocating..." : "Allocate"}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}