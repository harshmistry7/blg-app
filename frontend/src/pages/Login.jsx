import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { setLoggedIn } from "../utils/auth";

export default function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPw, setShowPw] = useState(false);
    const [remember, setRemember] = useState(false);
    const [error, setError] = useState("");
    const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!email || !password) {
        setError("Please fill in all details.");
        return;
    }

    try {
        const res = await fetch("http://localhost:3000/api/auth/login", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            credentials: "include", // 🔥 VERY IMPORTANT (for cookies)
            body: JSON.stringify({ email, password }),
        });

        const data = await res.json();

        if (!res.ok) {
            throw new Error(data.message);
        }

        setLoggedIn(true);

        navigate("/");

    } catch (err) {
        setLoggedIn(false);
        setError(err.message);
    }
};


    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center px-2">
            <div className="bg-white border border-gray-300 rounded-2xl shadow-lg p-8 w-full max-w-sm">

                <div className="text-center mb-6">
                    <div className="flex flex-row gap-2 justify-center items-center">
                           <div className="w-7 h-7 bg-blue-600 rounded-md flex items-center justify-center">
                        <svg width="14" height="14" viewBox="0 0 20 20" fill="white">
                            <path d="M3 4h14v2H3V4zm0 4h10v2H3V8zm0 4h12v2H3v-2z" />
                        </svg>
                    </div>
                    <h1 className="text-xl font-bold text-gray-800 ">Inkwell</h1>

                    </div>
                  
                    <p className="text-[15px] text-gray-500 mt-2">Welcome back to our Blog Platform</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">

                    <div>
                        <label className="block text-sm font-medium text-gray-600 mb-1">
                            Email
                        </label>
                        <input
                            type="email"
                            placeholder="you@example.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm
                         focus:outline-none focus:ring-1 focus:ring-blue-500"
                        />
                    </div>

                    <div>
                        <div className="flex justify-between mb-1">
                            <label className="text-sm font-medium text-gray-600 mb-2">Password</label>
                            <a href="/forgot-password" className="text-[13px] text-blue-600 hover:underline">
                                Forgot Password?
                            </a>
                        </div>
                        <div className="relative">
                            <input
                                type={showPw ? "text" : "password"}
                                placeholder="••••••••"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full border border-gray-300 rounded-lg px-3 py-2 pr-10 text-sm
                           focus:outline-none focus:ring-1 focus:ring-blue-500"
                            />
                            <button
                                type="button"
                                onClick={() => setShowPw(!showPw)}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 text-[14px] hover:text-gray-600"
                            >
                                {showPw ? "Show" : "Hide"}
                            </button>
                        </div>
                    </div>

                    <label className="flex items-center gap-2 cursor-pointer">
                        <input
                            type="checkbox"
                            checked={remember}
                            onChange={(e) => setRemember(e.target.checked)}
                            className="accent-blue-600"
                        />
                        <span className="text-sm text-gray-500">Remember me</span>
                    </label>

                    {error && (
                        <p className="text-sm text-red-500 font-semibold text-center">{error}</p>
                    )}

                    <button
                        type="submit"
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium
                       text-sm rounded-lg py-2.5 transition disabled:opacity-60"
                    >
                        Sign in
                    </button>
                </form>

            </div>
        </div>
    );
}