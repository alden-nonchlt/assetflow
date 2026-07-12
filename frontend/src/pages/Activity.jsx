import { useEffect, useState } from "react";
import api from "../api/axios";
import LoadingSpinner from "../components/LoadingSpinner";

export default function Activity() {
    const [activities, setActivities] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const loadActivity = async () => {
        try {
            setLoading(true);
            setError("");
            const res = await api.get("/activity");
            setActivities(res.data.data);
        } catch (err) {
            setError(err.response?.data?.message || "Failed to load activity log");
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadActivity();
    }, []);

    if (loading) return <LoadingSpinner text="Loading activity log..." />;

    if (error) {
        return (
            <div>
                <h1 className="text-3xl font-bold text-slate-800 mb-2">Activity Log</h1>
                <p className="text-slate-500 mb-6">Track system activities</p>
                <div className="bg-red-50 border border-red-200 text-red-700 text-sm p-4 rounded-lg">{error}</div>
            </div>
        );
    }

    return (
        <div>
            <h1 className="text-3xl font-bold text-slate-800 mb-1">Activity Log</h1>
            <p className="text-slate-500 mb-6">Track system activities</p>

            <div className="bg-white rounded-xl border border-slate-200 shadow-sm">
                <div className="p-5 border-b border-slate-100">
                    <h2 className="text-lg font-bold text-slate-800">Recent Activity</h2>
                </div>

                {activities.length > 0 ? (
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="border-b border-slate-100 text-left">
                                    <th className="p-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">User</th>
                                    <th className="p-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Email</th>
                                    <th className="p-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Action</th>
                                    <th className="p-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Date</th>
                                </tr>
                            </thead>
                            <tbody>
                                {activities.map((activity) => (
                                    <tr
                                        key={activity.id}
                                        className="border-b border-slate-50 hover:bg-slate-50 transition-colors duration-200"
                                    >
                                        <td className="p-4 text-sm font-medium text-slate-800">
                                            {activity.user_name || "-"}
                                        </td>
                                        <td className="p-4 text-sm text-slate-600">{activity.email || "-"}</td>
                                        <td className="p-4 text-sm text-slate-600">{activity.action_description}</td>
                                        <td className="p-4 text-sm text-slate-500">{activity.created_at}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                ) : (
                    <div className="p-8 text-center text-slate-400 text-sm">
                        No activity recorded yet.
                    </div>
                )}
            </div>
        </div>
    );
}