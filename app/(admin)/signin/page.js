"use client";
import { signIn, useSession } from "next-auth/react";
import { useState } from "react";

export default function SignInPage() {
    const { data: session } = useSession();
    const [userid, setUserid] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (userid.trim() === "" || password.trim() === "") {
            alert("Please fill in all fields.");
            return;
        }

        setLoading(true);
        const result = await signIn("credentials", {
            redirect: false,
            userid,
            password,
        });

        setLoading(false);

        if (result.error) {
            alert("Invalid UserID or Password!");
        } else {
            window.location.href = "/admindashboard";
        }
    };

    if (session) {
        window.location.href = "/admindashboard";
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-gray-100 via-white to-gray-200 px-4">
            <div className="w-full max-w-md bg-white shadow-xl rounded-2xl p-8 border border-gray-100">
                <h2 className="text-2xl font-semibold text-center text-gray-800 mb-6">
                    Admin Sign In
                </h2>

                <form onSubmit={handleSubmit} className="flex flex-col gap-5">
                    <div>
                        <label className="block text-sm font-medium text-gray-600 mb-1">
                            User ID
                        </label>
                        <input
                            id="userField"
                            type="text"
                            placeholder="Enter your User ID"
                            value={userid}
                            onChange={(e) => setUserid(e.target.value)}
                            className="w-full border border-gray-300 focus:ring-2 text-indigo-500 focus:ring-blue-400 rounded-md px-3 py-2 outline-none transition-all"
                            onKeyDown={(e) => {

                                if (e.key === 'Enter' || e.key === 'ArrowDown') {
                                    e.preventDefault()
                                    document.getElementById('passwordField')?.focus()
                                }
                            }}
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-600 mb-1">
                            Password
                        </label>
                        <input
                            id="passwordField"
                            type="password"
                            placeholder="Enter your password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full border border-gray-300 text-indigo-500 focus:ring-2 focus:ring-blue-400 rounded-md px-3 py-2 outline-none transition-all"
                            onKeyDown={(e) => { e.key === 'ArrowUp' && document.getElementById('userField')?.focus() }}
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className={`mt-3 w-full flex justify-center items-center bg-blue-600 hover:bg-blue-700 text-white font-medium py-2.5 rounded-md shadow-sm transition-all ${loading ? "opacity-70 cursor-not-allowed" : ""
                            }`}
                    >
                        {loading ? "Signing In..." : "Sign In"}
                    </button>
                </form>

                <p className="text-center text-xs text-gray-500 mt-6">
                    © {new Date().getFullYear()} Admin Portal. All rights reserved.
                </p>
            </div>
        </div>
    );
}
