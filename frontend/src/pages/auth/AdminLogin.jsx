import { useState } from "react";
import { Link } from "react-router-dom";
import magarilogo from "../../assets/magarilogo.png";
import {
    LockKeyhole,
    User,
    Eye,
    EyeOff,
    ArrowRight,
    CarFront,
    Shield,
} from "lucide-react";

import { useNavigate } from "react-router-dom";

import { useAuth } from "../../context/AuthContext";


function AdminLogin() {

    const navigate = useNavigate();
    const { login } = useAuth();

    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setLoading(true);

        try {
            await login(username, password);
            navigate("/admin/dashboard");
        } catch (error) {
            setError(error.message || "Login failed.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#0A0A0A]">

            <div className="grid min-h-screen lg:grid-cols-2">

                {/* ==================================================
                    LEFT SIDE - DEEP REDISH LUXURY
                ================================================== */}

                <div className="relative hidden overflow-hidden bg-gradient-to-br from-[#2A0505] via-[#4A0E0E] to-[#6B1A1A] lg:flex">

                    {/* Base gradient */}
                    <div className="absolute inset-0 bg-gradient-to-br from-[#2A0505] via-[#4A0E0E] to-[#6B1A1A]" />
                    
                    {/* Decorative glow elements */}
                    <div className="absolute -right-32 -top-32 h-[500px] w-[500px] rounded-full bg-[#D4A853]/5 blur-3xl" />
                    <div className="absolute -bottom-40 -left-40 h-[400px] w-[400px] rounded-full bg-[#D4A853]/8 blur-3xl" />
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[600px] w-[600px] rounded-full bg-[#D4A853]/3 blur-3xl" />

                    {/* Gold pattern overlay */}
                    <div className="absolute inset-0 opacity-[0.03]" style={{
                        backgroundImage: `radial-gradient(circle at 1px 1px, #D4A853 1px, transparent 0)`,
                        backgroundSize: '40px 40px'
                    }} />

                    <div className="relative z-10 flex flex-col justify-between p-12 xl:p-16">

                        {/* LOGO - Link to Home */}
                        <Link to="/" className="flex items-center gap-4 group">
                            <div className="flex h-16 w-16 items-center justify-center rounded-xl bg-white/5 border-2 border-[#D4A853]/30 p-2 transition-all duration-500 group-hover:border-[#D4A853] group-hover:shadow-2xl group-hover:shadow-[#D4A853]/20 group-hover:scale-105">
                                <img 
                                    src={magarilogo} 
                                    alt="Bingwa Magari Used Logo"
                                    className="h-full w-full object-contain"
                                />
                            </div>
                            <div>
                                <h1 className="text-2xl font-black tracking-tight text-white">
                                    Bingwa<span className="text-[#D4A853]"> Magari Used</span>
                                </h1>
                                <p className="text-xs font-medium tracking-wider text-[#D4A853]/50 uppercase">
                                    Premium Vehicle Marketplace
                                </p>
                            </div>
                        </Link>

                        {/* MESSAGE */}
                        <div className="max-w-lg space-y-6">
                            <div className="flex items-center gap-3">
                                <span className="h-px w-10 bg-[#D4A853]/30" />
                                <p className="text-sm font-bold uppercase tracking-[0.3em] text-[#D4A853]">
                                    Administration Portal
                                </p>
                                <span className="h-px w-10 bg-[#D4A853]/30" />
                            </div>
                            
                            <h2 className="text-5xl font-black leading-tight text-white xl:text-6xl">
                                Manage your
                                <span className="block text-[#D4A853]">
                                    vehicle marketplace.
                                </span>
                            </h2>
                            
                            <p className="max-w-md text-lg leading-8 text-[#D4A853]/60">
                                Manage vehicles, brands, categories,
                                listings and everything that powers
                                Bingwa Magari Used from one powerful dashboard.
                            </p>

                            {/* Trust indicators */}
                            <div className="flex items-center gap-6 pt-4">
                                <div className="flex items-center gap-2 text-[#D4A853]/40">
                                    <Shield size={16} />
                                    <span className="text-xs font-medium">Secure</span>
                                </div>
                                <div className="w-px h-4 bg-[#D4A853]/20" />
                                <div className="flex items-center gap-2 text-[#D4A853]/40">
                                    <span className="text-xs font-medium">Encrypted</span>
                                </div>
                                <div className="w-px h-4 bg-[#D4A853]/20" />
                                <div className="flex items-center gap-2 text-[#D4A853]/40">
                                    <span className="text-xs font-medium">Protected</span>
                                </div>
                            </div>
                        </div>

                        {/* FOOTER */}
                        <p className="text-sm text-[#D4A853]/30">
                            © {new Date().getFullYear()} Bingwa Magari Used.
                            All rights reserved.
                        </p>

                    </div>

                </div>

                {/* ==================================================
                    RIGHT SIDE - LOGIN FORM
                ================================================== */}

                <div className="flex items-center justify-center bg-white px-6 py-12 sm:px-10">

                    <div className="w-full max-w-md">

                        {/* MOBILE LOGO - Link to Home */}
                        <Link to="/" className="mb-10 flex items-center justify-center gap-3 lg:hidden group">
                            <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-gradient-to-br from-[#2A0505] to-[#6B1A1A] border-2 border-[#D4A853]/30 p-1.5 transition-all duration-300 group-hover:border-[#D4A853] group-hover:shadow-lg group-hover:shadow-[#D4A853]/20">
                                <img 
                                    src={magarilogo} 
                                    alt="Bingwa Magari Used Logo"
                                    className="h-full w-full object-contain"
                                />
                            </div>
                            <div className="text-left">
                                <h1 className="text-xl font-black text-[#2D1B0E]">
                                    Bingwa<span className="text-[#8B1A1A]"> Magari Used</span>
                                </h1>
                                <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#8B1A1A]">
                                    Admin Portal
                                </p>
                            </div>
                        </Link>

                        {/* TITLE */}
                        <div className="mb-8">
                            <div className="flex items-center gap-3 mb-3">
                                <span className="h-px w-6 bg-[#8B1A1A]/30" />
                                <p className="text-xs font-bold uppercase tracking-[0.25em] text-[#8B1A1A]">
                                    Admin Portal
                                </p>
                                <span className="h-px w-6 bg-[#8B1A1A]/30" />
                            </div>
                            <h2 className="text-3xl font-black text-[#2D1B0E]">
                                Welcome back
                            </h2>
                            <p className="mt-2 text-[#6A5A4A]">
                                Sign in to manage your marketplace.
                            </p>
                        </div>

                        {/* ERROR */}
                        {error && (
                            <div className="mb-5 flex items-start gap-2 rounded-xl border border-red-200 bg-red-50/80 px-4 py-3 text-sm font-medium text-red-600">
                                <span className="mt-0.5 text-red-400">•</span>
                                {error}
                            </div>
                        )}

                        {/* FORM */}
                        <form onSubmit={handleSubmit} className="space-y-5">

                            {/* USERNAME */}
                            <div>
                                <label className="mb-2 block text-sm font-bold text-[#2D1B0E]">
                                    Username
                                </label>
                                <div className="flex items-center gap-3 rounded-xl border border-[#D4A853]/20 bg-[#FDF8F5] px-4 py-3.5 transition-all duration-300 focus-within:border-[#8B1A1A] focus-within:bg-white focus-within:ring-4 focus-within:ring-[#8B1A1A]/10 hover:border-[#D4A853]/40">
                                    <User size={19} className="text-[#8B1A1A] transition-colors duration-300 group-focus-within:text-[#8B1A1A]" />
                                    <input
                                        type="text"
                                        value={username}
                                        onChange={(e) => setUsername(e.target.value)}
                                        placeholder="Enter username"
                                        required
                                        className="w-full bg-transparent text-sm text-[#2D1B0E] outline-none placeholder:text-[#8A7A6A]"
                                    />
                                </div>
                            </div>

                            {/* PASSWORD */}
                            <div>
                                <label className="mb-2 block text-sm font-bold text-[#2D1B0E]">
                                    Password
                                </label>
                                <div className="flex items-center gap-3 rounded-xl border border-[#D4A853]/20 bg-[#FDF8F5] px-4 py-3.5 transition-all duration-300 focus-within:border-[#8B1A1A] focus-within:bg-white focus-within:ring-4 focus-within:ring-[#8B1A1A]/10 hover:border-[#D4A853]/40">
                                    <LockKeyhole size={19} className="text-[#8B1A1A] transition-colors duration-300" />
                                    <input
                                        type={showPassword ? "text" : "password"}
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        placeholder="Enter password"
                                        required
                                        className="w-full bg-transparent text-sm text-[#2D1B0E] outline-none placeholder:text-[#8A7A6A]"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="text-[#8A7A6A] transition-all duration-300 hover:text-[#8B1A1A] hover:scale-110"
                                    >
                                        {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                    </button>
                                </div>
                            </div>

                            {/* BUTTON */}
                            <button
                                type="submit"
                                disabled={loading}
                                className="group relative flex w-full items-center justify-center gap-2 overflow-hidden rounded-xl bg-gradient-to-r from-[#6B1A1A] via-[#8B1A1A] to-[#4A0E0E] py-4 font-bold text-white shadow-xl shadow-[#8B1A1A]/30 transition-all duration-300 hover:shadow-2xl hover:shadow-[#8B1A1A]/50 hover:scale-[1.02] hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-60"
                            >
                                {/* Shine effect */}
                                <span className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/10 to-transparent transition-transform duration-700 group-hover:translate-x-full" />
                                
                                {loading ? (
                                    <>
                                        <span className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent" />
                                        Signing in...
                                    </>
                                ) : (
                                    <>
                                        <LockKeyhole size={18} />
                                        Sign in to Dashboard
                                        <ArrowRight
                                            size={18}
                                            className="transition-all duration-300 group-hover:translate-x-1"
                                        />
                                    </>
                                )}
                            </button>

                        </form>

                        {/* SECURITY MESSAGE */}
                        <div className="mt-8 flex items-center gap-3 rounded-xl bg-gradient-to-r from-[#FDF8F5] to-[#FEF5F0] border border-[#D4A853]/20 p-4">
                            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[#8B1A1A]/10">
                                <Shield size={17} className="text-[#8B1A1A]" />
                            </div>
                            <p className="text-xs leading-5 text-[#6A5A4A]">
                                This is a secure administration
                                area. Only authorized staff members
                                can access the dashboard.
                            </p>
                        </div>

                        {/* Back to Home Link */}
                        <div className="mt-6 text-center">
                            <Link
                                to="/"
                                className="group inline-flex items-center gap-2 text-sm font-semibold text-[#8B1A1A] transition-all duration-300 hover:text-[#6B1515] hover:gap-3"
                            >
                                <span className="transition-transform duration-300 group-hover:-translate-x-1">←</span>
                                Back to Home
                            </Link>
                        </div>

                        {/* Admin Footer */}
                        <div className="mt-8 pt-6 border-t border-[#D4A853]/10 text-center">
                            <p className="text-[10px] uppercase tracking-[0.2em] text-[#8A7A6A]">
                                Secure Admin Access
                            </p>
                        </div>

                    </div>

                </div>

            </div>

        </div>
    );
}

export default AdminLogin;