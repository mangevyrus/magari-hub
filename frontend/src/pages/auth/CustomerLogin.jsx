import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Mail, Lock, Eye, EyeOff, LogIn } from "lucide-react";

const API_URL = "http://127.0.0.1:8000/api";

function CustomerLogin() {
    const navigate = useNavigate();

    const [form, setForm] = useState({
        username: "",
        password: "",
    });

    const [showPassword, setShowPassword] = useState(false);

    const [loading, setLoading] = useState(false);

    const [error, setError] = useState("");

    const handleChange = (e) => {
        setForm({
            ...form,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        setError("");

        if (!form.username || !form.password) {
            setError("Please enter your username and password.");
            return;
        }

        try {
            setLoading(true);

            const response = await fetch(
                `${API_URL}/auth/token/`,
                {
                    method: "POST",

                    headers: {
                        "Content-Type": "application/json",
                    },

                    body: JSON.stringify({
                        username: form.username,
                        password: form.password,
                    }),
                }
            );

            const data = await response.json();

            if (!response.ok) {
                throw new Error(
                    data.detail ||
                    "Invalid username or password."
                );
            }

            /*
             * Store JWT tokens
             */

            localStorage.setItem(
                "access_token",
                data.access
            );

            localStorage.setItem(
                "refresh_token",
                data.refresh
            );

            /*
             * Mark this session as a customer session.
             *
             * This helps us keep customer and admin
             * navigation separate.
             */

            localStorage.setItem(
                "user_type",
                "customer"
            );

            /*
             * Go to customer dashboard
             */

            navigate("/account");

        } catch (err) {

            console.error(
                "Customer login failed:",
                err
            );

            setError(
                err.message ||
                "Login failed. Please try again."
            );

        } finally {

            setLoading(false);

        }
    };

    return (
        <div className="min-h-screen bg-[#F5F9FC]">

            {/* HEADER */}

            <header className="border-b border-blue-100 bg-white">

                <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-5 md:px-8">

                    <Link
                        to="/"
                        className="text-2xl font-extrabold text-[#12395B]"
                    >
                        Magari<span className="text-[#2F80C0]">
                            Hub
                        </span>
                    </Link>

                    <Link
                        to="/"
                        className="text-sm font-semibold text-slate-500 transition hover:text-[#2F80C0]"
                    >
                        Back to Home
                    </Link>

                </div>

            </header>


            {/* LOGIN */}

            <main className="flex min-h-[calc(100vh-81px)] items-center justify-center px-5 py-12">

                <div className="w-full max-w-md">

                    {/* TITLE */}

                    <div className="mb-8 text-center">

                        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-[#EAF6FF]">

                            <LogIn
                                size={28}
                                className="text-[#2F80C0]"
                            />

                        </div>

                        <h1 className="mt-5 text-3xl font-extrabold text-[#12395B]">
                            Welcome back
                        </h1>

                        <p className="mt-2 text-sm text-slate-500">
                            Sign in to your MagariHub account
                        </p>

                    </div>


                    {/* CARD */}

                    <div className="rounded-2xl border border-blue-100 bg-white p-6 shadow-sm md:p-8">

                        {/* ERROR */}

                        {error && (

                            <div className="mb-5 rounded-xl border border-red-100 bg-red-50 px-4 py-3 text-sm font-semibold text-red-600">
                                {error}
                            </div>

                        )}


                        <form
                            onSubmit={handleSubmit}
                            className="space-y-5"
                        >

                            {/* USERNAME */}

                            <div>

                                <label className="mb-2 block text-sm font-bold text-[#12395B]">
                                    Username
                                </label>

                                <div className="relative">

                                    <LogIn
                                        size={18}
                                        className="absolute left-4 top-1/2 -translate-y-1/2 text-[#2F80C0]"
                                    />

                                    <input
                                        type="text"
                                        name="username"
                                        value={form.username}
                                        onChange={handleChange}
                                        placeholder="Enter your username"
                                        autoComplete="username"
                                        className="w-full rounded-xl border border-blue-100 bg-[#F5F9FC] py-3.5 pl-11 pr-4 text-sm outline-none transition focus:border-[#2F80C0] focus:ring-4 focus:ring-blue-100"
                                    />

                                </div>

                            </div>


                            {/* PASSWORD */}

                            <div>

                                <div className="mb-2 flex items-center justify-between">

                                    <label className="block text-sm font-bold text-[#12395B]">
                                        Password
                                    </label>

                                </div>

                                <div className="relative">

                                    <Lock
                                        size={18}
                                        className="absolute left-4 top-1/2 -translate-y-1/2 text-[#2F80C0]"
                                    />

                                    <input
                                        type={
                                            showPassword
                                                ? "text"
                                                : "password"
                                        }
                                        name="password"
                                        value={form.password}
                                        onChange={handleChange}
                                        placeholder="Enter your password"
                                        autoComplete="current-password"
                                        className="w-full rounded-xl border border-blue-100 bg-[#F5F9FC] py-3.5 pl-11 pr-12 text-sm outline-none transition focus:border-[#2F80C0] focus:ring-4 focus:ring-blue-100"
                                    />

                                    <button
                                        type="button"
                                        onClick={() =>
                                            setShowPassword(
                                                !showPassword
                                            )
                                        }
                                        className="absolute right-3 top-1/2 -translate-y-1/2 rounded-lg p-2 text-slate-400 transition hover:bg-blue-50 hover:text-[#2F80C0]"
                                    >

                                        {showPassword ? (
                                            <EyeOff size={18} />
                                        ) : (
                                            <Eye size={18} />
                                        )}

                                    </button>

                                </div>

                            </div>


                            {/* SUBMIT */}

                            <button
                                type="submit"
                                disabled={loading}
                                className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#12395B] py-3.5 font-bold text-white shadow-lg shadow-blue-900/10 transition hover:bg-[#2F80C0] disabled:cursor-not-allowed disabled:opacity-60"
                            >

                                {loading ? (
                                    <>
                                        <span className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent" />

                                        Signing in...
                                    </>
                                ) : (
                                    <>
                                        <LogIn size={18} />

                                        Sign In
                                    </>
                                )}

                            </button>

                        </form>


                        {/* REGISTER */}

                        <div className="mt-6 border-t border-blue-50 pt-6 text-center">

                            <p className="text-sm text-slate-500">

                                Don't have an account?

                                {" "}

                                <Link
                                    to="/register"
                                    className="font-bold text-[#2F80C0] hover:underline"
                                >
                                    Create one
                                </Link>

                            </p>

                        </div>

                    </div>


                    {/* ADMIN LOGIN */}

                    <div className="mt-6 text-center">

                        <p className="text-xs text-slate-400">
                            Are you an administrator?
                        </p>

                        <Link
                            to="/admin/login"
                            className="mt-1 inline-block text-sm font-bold text-[#12395B] hover:text-[#2F80C0]"
                        >
                            Admin Login
                        </Link>

                    </div>

                </div>

            </main>

        </div>
    );
}

export default CustomerLogin;