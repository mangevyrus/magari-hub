
import { useState } from "react";

import { Link, useNavigate } from "react-router-dom";

import {
    Lock,
    Eye,
    EyeOff,
    LogIn,
    User,
    Loader2,
} from "lucide-react";

import { useTranslation } from "react-i18next";

import Navbar from "../../components/Navbar";

import api from "../../services/api";

function CustomerLogin() {
    const navigate = useNavigate();

    const { t } = useTranslation();

    const [form, setForm] = useState({
        username: "",
        password: "",
    });

    const [showPassword, setShowPassword] =
        useState(false);

    const [loading, setLoading] = useState(false);

    const [error, setError] = useState("");

    // ============================================================
    // FORM CHANGE
    // ============================================================

    const handleChange = (e) => {
        setForm({
            ...form,
            [e.target.name]: e.target.value,
        });

        setError("");
    };

    // ============================================================
    // LOGIN
    // ============================================================

    const handleSubmit = async (e) => {
        e.preventDefault();

        setError("");

        if (!form.username || !form.password) {
            setError(
                t("login.errors.required")
            );

            return;
        }

        try {
            setLoading(true);

            const response = await api.post(
                "/auth/token/",
                {
                    username: form.username,
                    password: form.password,
                }
            );

            const data = response.data;

            localStorage.setItem(
                "customer_access_token",
                data.access
            );

            localStorage.setItem(
                "customer_refresh_token",
                data.refresh
            );

            localStorage.setItem(
                "user_type",
                "customer"
            );

            navigate("/account");
        } catch (err) {
            console.error(
                "Customer login failed:",
                err
            );

            const message =
                err.response?.data?.detail ||
                err.message ||
                t("login.errors.failed");

            setError(message);
        } finally {
            setLoading(false);
        }
    };

    // ============================================================
    // RENDER
    // ============================================================

    return (
        <>
            <Navbar />

            <main className="flex min-h-[calc(100vh-81px)] items-center justify-center bg-[#FDF8F5] px-5 py-12">
                <div className="w-full max-w-md">
                    {/* TITLE */}

                    <div className="mb-8 text-center">
                        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl border border-[#F4A460]/20 bg-[#B22222]/10">
                            <LogIn
                                size={28}
                                className="text-[#B22222]"
                            />
                        </div>

                        <h1 className="mt-5 text-3xl font-extrabold text-[#2D1B0E]">
                            {t("login.title")}
                        </h1>

                        <p className="mt-2 text-sm text-[#6A5A4A]">
                            {t(
                                "login.subtitle"
                            )}
                        </p>
                    </div>

                    {/* CARD */}

                    <div className="rounded-2xl border border-[#F4A460]/20 bg-white p-6 shadow-xl shadow-[#B22222]/5 md:p-8">
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
                                <label className="mb-2 block text-sm font-bold text-[#2D1B0E]">
                                    {t(
                                        "login.username"
                                    )}
                                </label>

                                <div className="relative">
                                    <User
                                        size={18}
                                        className="absolute left-4 top-1/2 -translate-y-1/2 text-[#B22222]"
                                    />

                                    <input
                                        type="text"
                                        name="username"
                                        value={
                                            form.username
                                        }
                                        onChange={
                                            handleChange
                                        }
                                        placeholder={t(
                                            "login.usernamePlaceholder"
                                        )}
                                        autoComplete="username"
                                        required
                                        className="w-full rounded-xl border border-[#F4A460]/20 bg-[#FDF8F5] py-3.5 pl-11 pr-4 text-sm text-[#2D1B0E] outline-none transition focus:border-[#B22222] focus:bg-white focus:ring-4 focus:ring-[#B22222]/10"
                                    />
                                </div>
                            </div>

                            {/* PASSWORD */}

                            <div>
                                <div className="mb-2 flex items-center justify-between">
                                    <label className="block text-sm font-bold text-[#2D1B0E]">
                                        {t(
                                            "login.password"
                                        )}
                                    </label>

                                    <Link
                                        to="/forgot-password"
                                        className="text-sm font-semibold text-[#B22222] hover:text-[#8B1A1A]"
                                    >
                                        {t(
                                            "login.forgotPassword"
                                        )}
                                    </Link>
                                </div>

                                <div className="relative">
                                    <Lock
                                        size={18}
                                        className="absolute left-4 top-1/2 -translate-y-1/2 text-[#B22222]"
                                    />

                                    <input
                                        type={
                                            showPassword
                                                ? "text"
                                                : "password"
                                        }
                                        name="password"
                                        value={
                                            form.password
                                        }
                                        onChange={
                                            handleChange
                                        }
                                        placeholder={t(
                                            "login.passwordPlaceholder"
                                        )}
                                        autoComplete="current-password"
                                        required
                                        className="w-full rounded-xl border border-[#F4A460]/20 bg-[#FDF8F5] py-3.5 pl-11 pr-12 text-sm text-[#2D1B0E] outline-none transition focus:border-[#B22222] focus:bg-white focus:ring-4 focus:ring-[#B22222]/10"
                                    />

                                    <button
                                        type="button"
                                        onClick={() =>
                                            setShowPassword(
                                                !showPassword
                                            )
                                        }
                                        aria-label={
                                            showPassword
                                                ? t(
                                                      "login.hidePassword"
                                                  )
                                                : t(
                                                      "login.showPassword"
                                                  )
                                        }
                                        className="absolute right-3 top-1/2 -translate-y-1/2 rounded-lg p-2 text-[#8A7A6A] transition hover:bg-[#B22222]/5 hover:text-[#B22222]"
                                    >
                                        {showPassword ? (
                                            <EyeOff
                                                size={18}
                                            />
                                        ) : (
                                            <Eye
                                                size={18}
                                            />
                                        )}
                                    </button>
                                </div>
                            </div>

                            {/* SUBMIT */}

                            <button
                                type="submit"
                                disabled={loading}
                                className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#B22222] to-[#8B1A1A] py-3.5 font-bold text-white shadow-lg shadow-[#B22222]/30 transition hover:scale-[1.02] hover:shadow-xl hover:shadow-[#B22222]/50 disabled:cursor-not-allowed disabled:opacity-60"
                            >
                                {loading ? (
                                    <>
                                        <Loader2
                                            size={19}
                                            className="animate-spin"
                                        />

                                        {t(
                                            "login.signingIn"
                                        )}
                                    </>
                                ) : (
                                    <>
                                        <LogIn
                                            size={18}
                                        />

                                        {t(
                                            "login.signIn"
                                        )}
                                    </>
                                )}
                            </button>
                        </form>

                        {/* REGISTER */}

                        <div className="mt-6 border-t border-[#F4A460]/10 pt-6 text-center">
                            <p className="text-sm text-[#6A5A4A]">
                                {t(
                                    "login.noAccount"
                                )}{" "}

                                <Link
                                    to="/register"
                                    className="font-bold text-[#B22222] hover:text-[#8B1A1A] hover:underline"
                                >
                                    {t(
                                        "login.createOne"
                                    )}
                                </Link>
                            </p>
                        </div>
                    </div>

                    {/* ADMIN LOGIN */}

                    <div className="mt-6 text-center">
                        <p className="text-xs text-[#8A7A6A]">
                            {t(
                                "login.adminQuestion"
                            )}
                        </p>

                        <Link
                            to="/admin/login"
                            className="mt-1 inline-block text-sm font-bold text-[#B22222] transition hover:text-[#8B1A1A]"
                        >
                            {t(
                                "login.adminLogin"
                            )}{" "}
                            →
                        </Link>
                    </div>
                </div>
            </main>
        </>
    );
}

export default CustomerLogin;
