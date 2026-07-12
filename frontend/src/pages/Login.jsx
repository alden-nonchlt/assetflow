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


    const handleSubmit = async (e) => {

        e.preventDefault();

        try {

            setLoading(true);
            setError("");

            await login(email, password);

            navigate("/dashboard");

        } catch (err) {

            setError(
                err.response?.data?.message ||
                "Login failed"
            );

        } finally {

            setLoading(false);

        }

    };


    return (

        <div className="min-h-screen flex items-center justify-center bg-slate-100">

            <div className="w-full max-w-md bg-white p-8 rounded-xl shadow">

                <h1 className="text-3xl font-bold text-slate-800 mb-2">
                    AssetFlow ERP
                </h1>

                <p className="text-slate-500 mb-6">
                    Login to your account
                </p>


                {error && (
                    <div className="bg-red-100 text-red-600 p-3 rounded mb-4">
                        {error}
                    </div>
                )}


                <form onSubmit={handleSubmit}>

                    <input
                        className="w-full border p-3 rounded mb-4"
                        type="email"
                        placeholder="Email"
                        value={email}
                        onChange={(e)=>setEmail(e.target.value)}
                    />


                    <input
                        className="w-full border p-3 rounded mb-4"
                        type="password"
                        placeholder="Password"
                        value={password}
                        onChange={(e)=>setPassword(e.target.value)}
                    />


                    <button
                        className="w-full bg-blue-600 text-white p-3 rounded hover:bg-blue-700"
                        disabled={loading}
                    >

                        {loading ? "Logging in..." : "Login"}

                    </button>

                </form>


            </div>

        </div>

    );

}