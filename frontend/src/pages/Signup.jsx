import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Signup() {
    const { signup } = useAuth();
    const navigate = useNavigate();
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const [fieldErrors, setFieldErrors] = useState({});

    const validate = () => {
        const errors = {};
        if (!name.trim()) errors.name = "Name is required";
        if (!email.trim()) errors.email = "Email is required";
        if (!password || password.length < 6) errors.password = "Password must be at least 6 characters";
        setFieldErrors(errors);
        return Object.keys(errors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setFieldErrors({});
        if (!validate()) return;

        try {
            setLoading(true);
            await signup(name, email, password);
            navigate("/login");
        } catch (err) {
            setError(err.response?.data?.message || "Signup failed");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-slate-100">
            <div className="w-full max-w-md">
                <div className="bg-white p-8 rounded-xl shadow-sm border border-slate-200">
                    <div className="text-center mb-8">
                        <h1 className="text-3xl font-bold text-slate-900">AssetFlow</h1>
                        <p className="text-slate-500 mt-1 text-sm">Create your account</p>
                    </div>

                    {error && (
                        <div className="bg-red-50 border border-red-200 text-red-700 text-sm p-3 rounded-lg mb-6">
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Name</label>
                            <input
                                className={`w-full border ${
                                    fieldErrors.name ? "border-red-400" : "border-slate-300"
                                } rounded-lg p-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-150`}
                                type="text"
                                placeholder="Your full name"
                                value={name}
                                onChange={(e) => {
                                    setName(e.target.value);
                                    if (fieldErrors.name) setFieldErrors((prev) => ({ ...prev, name: "" }));
                                }}
                            />
                            {fieldErrors.name && <p className="text-red-500 text-xs mt-1">{fieldErrors.name}</p>}
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Email</label>
                            <input
                                className={`w-full border ${
                                    fieldErrors.email ? "border-red-400" : "border-slate-300"
                                } rounded-lg p-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-150`}
                                type="email"
                                placeholder="you@company.com"
                                value={email}
                                onChange={(e) => {
                                    setEmail(e.target.value);
                                    if (fieldErrors.email) setFieldErrors((prev) => ({ ...prev, email: "" }));
                                }}
                            />
                            {fieldErrors.email && <p className="text-red-500 text-xs mt-1">{fieldErrors.email}</p>}
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Password</label>
                            <input
                                className={`w-full border ${
                                    fieldErrors.password ? "border-red-400" : "border-slate-300"
                                } rounded-lg p-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-150`}
                                type="password"
                                placeholder="Min 6 characters"
                                value={password}
                                onChange={(e) => {
                                    setPassword(e.target.value);
                                    if (fieldErrors.password) setFieldErrors((prev) => ({ ...prev, password: "" }));
                                }}
                            />
                            {fieldErrors.password && <p className="text-red-500 text-xs mt-1">{fieldErrors.password}</p>}
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium p-2.5 rounded-lg transition-all duration-150 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                        >
                            {loading ? "Creating account..." : "Sign Up"}
                        </button>
                    </form>

                    <p className="text-center text-sm text-slate-500 mt-6">
                        Already have an account?{" "}
                        <a href="/login" className="text-blue-600 hover:underline">Login</a>
                    </p>
                </div>
            </div>
        </div>
    );
}