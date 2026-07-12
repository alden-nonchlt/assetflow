import { useEffect, useState } from "react";
import api from "../api/axios";
import LoadingSpinner from "../components/LoadingSpinner";
import StatusBadge from "../components/StatusBadge";

export default function Bookings() {
    const [bookings, setBookings] = useState([]);
    const [assets, setAssets] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [formError, setFormError] = useState("");
    const [form, setForm] = useState({
        resource_asset_id: "",
        start_time: "",
        end_time: "",
    });

    const loadBookings = async () => {
        try {
            const res = await api.get("/bookings");
            setBookings(res.data.data);
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
            await loadBookings();
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

    const createBooking = async () => {
        setFormError("");
        if (!form.resource_asset_id || !form.start_time || !form.end_time) {
            setFormError("All fields are required.");
            return;
        }
        if (new Date(form.start_time) >= new Date(form.end_time)) {
            setFormError("End time must be after start time.");
            return;
        }
        try {
            await api.post("/bookings", form);
            setForm({ resource_asset_id: "", start_time: "", end_time: "" });
            loadBookings();
        } catch (err) {
            setFormError(err.response?.data?.message || "Booking failed");
        }
    };

    const cancelBooking = async (id) => {
        try {
            await api.put(`/bookings/${id}/cancel`);
            loadBookings();
        } catch (err) {
            console.error(err);
        }
    };

    if (loading) return <LoadingSpinner text="Loading bookings..." />;

    if (error) {
        return (
            <div>
                <h1 className="text-3xl font-bold text-slate-800 mb-2">Bookings</h1>
                <p className="text-slate-500 mb-6">Manage asset bookings</p>
                <div className="bg-red-50 border border-red-200 text-red-700 text-sm p-4 rounded-lg">{error}</div>
            </div>
        );
    }

    return (
        <div>
            <h1 className="text-3xl font-bold text-slate-800 mb-1">Bookings</h1>
            <p className="text-slate-500 mb-6">Manage asset bookings</p>

            <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5 mb-6">
                <h2 className="text-lg font-bold text-slate-800 mb-4">Create Booking</h2>

                {formError && (
                    <div className="bg-red-50 border border-red-200 text-red-700 text-sm p-3 rounded-lg mb-4">
                        {formError}
                    </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                    <select
                        className="border border-slate-300 rounded-lg p-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        value={form.resource_asset_id}
                        onChange={(e) =>
                            setForm({ ...form, resource_asset_id: e.target.value })
                        }
                    >
                        <option value="">Select Asset</option>
                        {assets.map((asset) => (
                            <option key={asset.id} value={asset.id}>
                                {asset.asset_tag} - {asset.name}
                            </option>
                        ))}
                    </select>

                    <input
                        type="datetime-local"
                        className="border border-slate-300 rounded-lg p-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        value={form.start_time}
                        onChange={(e) => setForm({ ...form, start_time: e.target.value })}
                    />

                    <input
                        type="datetime-local"
                        className="border border-slate-300 rounded-lg p-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        value={form.end_time}
                        onChange={(e) => setForm({ ...form, end_time: e.target.value })}
                    />
                </div>

                <button
                    onClick={createBooking}
                    className="bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium px-5 py-2.5 rounded-lg transition-all duration-150 cursor-pointer hover:scale-105"
                >
                    Create Booking
                </button>
            </div>

            <div className="bg-white rounded-xl border border-slate-200 shadow-sm">
                <div className="p-5 border-b border-slate-100">
                    <h2 className="text-lg font-bold text-slate-800">All Bookings</h2>
                </div>

                {bookings.length > 0 ? (
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="border-b border-slate-100 text-left">
                                    <th className="p-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Asset</th>
                                    <th className="p-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Booked By</th>
                                    <th className="p-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Start</th>
                                    <th className="p-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">End</th>
                                    <th className="p-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Status</th>
                                    <th className="p-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {bookings.map((booking) => (
                                    <tr
                                        key={booking.id}
                                        className="border-b border-slate-50 hover:bg-slate-50 transition-colors duration-200"
                                    >
                                        <td className="p-4 text-sm font-medium text-slate-800">
                                            {booking.asset_tag} - {booking.asset_name}
                                        </td>
                                        <td className="p-4 text-sm text-slate-600">{booking.booked_by}</td>
                                        <td className="p-4 text-sm text-slate-600">{booking.start_time}</td>
                                        <td className="p-4 text-sm text-slate-600">{booking.end_time}</td>
                                        <td className="p-4">
                                            <StatusBadge status={booking.status} />
                                        </td>
                                        <td className="p-4">
                                            {booking.status !== "cancelled" && (
                                                <button
                                                    onClick={() => cancelBooking(booking.id)}
                                                    className="bg-red-500 hover:bg-red-600 text-white text-xs font-medium px-3 py-1.5 rounded-lg transition-all duration-150 cursor-pointer hover:scale-105"
                                                >
                                                    Cancel
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
                        No bookings yet. Create one above.
                    </div>
                )}
            </div>
        </div>
    );
}