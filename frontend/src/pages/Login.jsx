import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Login() {
    const { login } = useAuth();
    const navigate = useNavigate();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const [fieldErrors, setFieldErrors] = useState({});

    const validate = () => {
        const errors = {};
        if (!email.trim()) errors.email = "Email is required";
        if (!password) errors.password = "Password is required";
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
            await login(email, password);
            navigate("/dashboard");
        } catch (err) {
            setError(err.response?.data?.message || "Login failed");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex">
            {/* LEFT: Login Form */}
            <div className="flex-1 flex items-center justify-center bg-[#f8f7f4] p-8">
                <div className="w-full max-w-sm">
                    <div className="bg-white p-10 rounded-2xl shadow-md border border-[#e8e4df]">
                        <div className="flex items-center gap-3 mb-2">
                            <div className="w-1 h-10 bg-indigo-500 rounded-full" />
                            <h1 className="text-2xl font-bold text-[#1e1b4b] tracking-tight">Sign in</h1>
                        </div>
                        <p className="text-[#78716c] text-sm mb-8 ml-4">Enter your credentials to continue</p>

                        {error && (
                            <div className="bg-red-50 border border-red-200 text-red-700 text-sm p-3 rounded-lg mb-6">
                                {error}
                            </div>
                        )}

                        <form onSubmit={handleSubmit} className="space-y-5">
                            <div>
                                <label className="block text-sm font-medium text-[#1e1b4b] mb-1.5">
                                    Email
                                </label>
                                <input
                                    className={`w-full border ${
                                        fieldErrors.email ? "border-red-400" : "border-[#e8e4df]"
                                    } rounded-xl p-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-150 bg-white`}
                                    type="email"
                                    placeholder="you@company.com"
                                    value={email}
                                    onChange={(e) => {
                                        setEmail(e.target.value);
                                        if (fieldErrors.email) setFieldErrors((prev) => ({ ...prev, email: "" }));
                                    }}
                                />
                                {fieldErrors.email && (
                                    <p className="text-red-500 text-xs mt-1">{fieldErrors.email}</p>
                                )}
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-[#1e1b4b] mb-1.5">
                                    Password
                                </label>
                                <input
                                    className={`w-full border ${
                                        fieldErrors.password ? "border-red-400" : "border-[#e8e4df]"
                                    } rounded-xl p-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-150 bg-white`}
                                    type="password"
                                    placeholder="Enter your password"
                                    value={password}
                                    onChange={(e) => {
                                        setPassword(e.target.value);
                                        if (fieldErrors.password) setFieldErrors((prev) => ({ ...prev, password: "" }));
                                    }}
                                />
                                {fieldErrors.password && (
                                    <p className="text-red-500 text-xs mt-1">{fieldErrors.password}</p>
                                )}
                            </div>

                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-medium p-3.5 rounded-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer hover:shadow-lg hover:scale-[1.02] active:scale-[0.98]"
                            >
                                {loading ? "Signing in..." : "Sign In"}
                            </button>
                        </form>
                    </div>
                </div>
            </div>

            {/* RIGHT: Brand Panel */}
            <div className="hidden lg:flex flex-1 bg-gradient-to-br from-[#1e1b4b] via-[#1a1745] to-[#151238] items-center justify-center relative overflow-hidden">
                {/* Subtle background glow */}
                <div className="absolute inset-0">
                    <div className="absolute top-1/4 -left-1/4 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl" />
                    <div className="absolute bottom-1/4 -right-1/4 w-96 h-96 bg-amber-500/5 rounded-full blur-3xl" />
                    {/* Subtle grid pattern */}
                    <div className="absolute inset-0 opacity-[0.03]" style={{
                        backgroundImage: `radial-gradient(circle at 1px 1px, white 1px, transparent 0)`,
                        backgroundSize: '40px 40px'
                    }} />
                </div>

                <div className="relative z-10 text-center px-12">
                    <div className="mb-6">
                        <h2 className="text-5xl font-bold text-white tracking-tight">AssetFlow</h2>
                    </div>
                    <p className="text-2xl font-light text-white/70 leading-relaxed max-w-md mx-auto">
                        Track every asset.<br />
                        Approve every request.<br />
                        <span className="text-white font-medium">Miss nothing.</span>
                    </p>
                    <div className="mt-12 flex items-center justify-center gap-3 text-white/30 text-sm">
                        <div className="w-8 h-px bg-white/20" />
                        <span>Enterprise Asset Management</span>
                        <div className="w-8 h-px bg-white/20" />
                    </div>
                </div>
            </div>
        </div>
    );
}