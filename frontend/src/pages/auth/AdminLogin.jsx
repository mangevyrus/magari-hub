import { useState } from "react";

import {
    LockKeyhole,
    User,
    Eye,
    EyeOff,
    ArrowRight,
    CarFront,
} from "lucide-react";

import { useNavigate } from "react-router-dom";

import { useAuth } from "../../context/AuthContext";


function AdminLogin() {

    const navigate = useNavigate();

    const { login } = useAuth();


    const [username, setUsername] =
        useState("");

    const [password, setPassword] =
        useState("");

    const [showPassword, setShowPassword] =
        useState(false);

    const [loading, setLoading] =
        useState(false);

    const [error, setError] =
        useState("");

const handleSubmit = async (e) => {

    e.preventDefault();

    setError("");

    setLoading(true);

    try {

        await login(
            username,
            password
        );

        navigate(
            "/admin/dashboard"
        );

    } catch (error) {

        setError(
            error.message ||
            "Login failed."
        );

    } finally {

        setLoading(false);

    }

};
    return (

        <div className="min-h-screen bg-[#EAF6FF]">

            <div className="grid min-h-screen lg:grid-cols-2">


                {/* LEFT SIDE */}

                <div className="relative hidden overflow-hidden bg-[#12395B] lg:flex">

                    <div className="absolute inset-0 bg-gradient-to-br from-[#12395B] via-[#174B70] to-[#2F80C0]" />

                    <div className="relative z-10 flex flex-col justify-between p-12 xl:p-16">


                        {/* LOGO */}

                        <div className="flex items-center gap-3">

                            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white">

                                <CarFront
                                    size={27}
                                    className="text-[#12395B]"
                                />

                            </div>

                            <div>

                                <h1 className="text-2xl font-black tracking-tight text-white">
                                    Magari<span className="text-[#A9DCFF]">Hub</span>
                                </h1>

                                <p className="text-xs font-medium text-blue-100">
                                    Vehicle Marketplace
                                </p>

                            </div>

                        </div>


                        {/* MESSAGE */}

                        <div className="max-w-lg">

                            <p className="mb-4 text-sm font-bold uppercase tracking-[0.25em] text-[#A9DCFF]">
                                Administration Portal
                            </p>

                            <h2 className="text-5xl font-black leading-tight text-white xl:text-6xl">
                                Manage your
                                <span className="block text-[#A9DCFF]">
                                    vehicle marketplace.
                                </span>
                            </h2>

                            <p className="mt-6 max-w-md text-lg leading-8 text-blue-100">
                                Manage vehicles, brands, categories,
                                listings and everything that powers
                                MagariHub from one powerful dashboard.
                            </p>

                        </div>


                        {/* FOOTER */}

                        <p className="text-sm text-blue-200">
                            © {new Date().getFullYear()} MagariHub.
                            All rights reserved.
                        </p>

                    </div>

                </div>


                {/* RIGHT SIDE */}

                <div className="flex items-center justify-center bg-white px-6 py-12 sm:px-10">

                    <div className="w-full max-w-md">


                        {/* MOBILE LOGO */}

                        <div className="mb-10 flex items-center justify-center gap-3 lg:hidden">

                            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#12395B]">

                                <CarFront
                                    size={24}
                                    className="text-white"
                                />

                            </div>

                            <h1 className="text-2xl font-black text-[#12395B]">

                                Magari
                                <span className="text-[#2F80C0]">
                                    Hub
                                </span>

                            </h1>

                        </div>


                        {/* TITLE */}

                        <div className="mb-8">

                            <p className="mb-2 text-sm font-bold uppercase tracking-[0.18em] text-[#2F80C0]">
                                Admin Portal
                            </p>

                            <h2 className="text-3xl font-black text-[#12395B]">
                                Welcome back
                            </h2>

                            <p className="mt-2 text-slate-500">
                                Sign in to manage your marketplace.
                            </p>

                        </div>


                        {/* ERROR */}

                        {error && (

                            <div className="mb-5 rounded-xl border border-red-100 bg-red-50 px-4 py-3 text-sm font-medium text-red-600">

                                {error}

                            </div>

                        )}


                        {/* FORM */}

                        <form
                            onSubmit={handleSubmit}
                            className="space-y-5"
                        >


                            {/* USERNAME */}

                            <div>

                                <label className="mb-2 block text-sm font-bold text-[#12395B]">
                                    Username
                                </label>

                                <div className="flex items-center gap-3 rounded-xl border border-blue-100 bg-[#F5F9FC] px-4 py-3.5 transition focus-within:border-[#2F80C0] focus-within:bg-white focus-within:ring-4 focus-within:ring-blue-50">

                                    <User
                                        size={19}
                                        className="text-[#2F80C0]"
                                    />

                                    <input
                                        type="text"
                                        value={username}
                                        onChange={(e) =>
                                            setUsername(
                                                e.target.value
                                            )
                                        }
                                        placeholder="Enter username"
                                        required
                                        className="w-full bg-transparent text-sm text-[#12395B] outline-none placeholder:text-slate-400"
                                    />

                                </div>

                            </div>


                            {/* PASSWORD */}

                            <div>

                                <label className="mb-2 block text-sm font-bold text-[#12395B]">
                                    Password
                                </label>

                                <div className="flex items-center gap-3 rounded-xl border border-blue-100 bg-[#F5F9FC] px-4 py-3.5 transition focus-within:border-[#2F80C0] focus-within:bg-white focus-within:ring-4 focus-within:ring-blue-50">

                                    <LockKeyhole
                                        size={19}
                                        className="text-[#2F80C0]"
                                    />

                                    <input
                                        type={
                                            showPassword
                                                ? "text"
                                                : "password"
                                        }
                                        value={password}
                                        onChange={(e) =>
                                            setPassword(
                                                e.target.value
                                            )
                                        }
                                        placeholder="Enter password"
                                        required
                                        className="w-full bg-transparent text-sm text-[#12395B] outline-none placeholder:text-slate-400"
                                    />

                                    <button
                                        type="button"
                                        onClick={() =>
                                            setShowPassword(
                                                !showPassword
                                            )
                                        }
                                        className="text-slate-400 transition hover:text-[#2F80C0]"
                                    >

                                        {showPassword ? (
                                            <EyeOff size={18} />
                                        ) : (
                                            <Eye size={18} />
                                        )}

                                    </button>

                                </div>

                            </div>


                            {/* BUTTON */}

                            <button
                                type="submit"
                                disabled={loading}
                                className="group flex w-full items-center justify-center gap-2 rounded-xl bg-[#12395B] py-4 font-bold text-white shadow-lg shadow-blue-900/10 transition hover:bg-[#2F80C0] disabled:cursor-not-allowed disabled:opacity-60"
                            >

                                {loading
                                    ? "Signing in..."
                                    : "Sign in to Dashboard"
                                }

                                {!loading && (

                                    <ArrowRight
                                        size={18}
                                        className="transition duration-300 group-hover:translate-x-1"
                                    />

                                )}

                            </button>

                        </form>


                        {/* SECURITY MESSAGE */}

                        <div className="mt-8 flex items-center gap-3 rounded-xl bg-[#EAF6FF] p-4">

                            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-white">

                                <LockKeyhole
                                    size={17}
                                    className="text-[#2F80C0]"
                                />

                            </div>

                            <p className="text-xs leading-5 text-slate-500">
                                This is a secure administration
                                area. Only authorized staff members
                                can access the dashboard.
                            </p>

                        </div>

                    </div>

                </div>

            </div>

        </div>
    );
}

export default AdminLogin;