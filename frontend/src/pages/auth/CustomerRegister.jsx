
import { useState } from "react";

import { Link, useNavigate } from "react-router-dom";

import {
    UserPlus,
    Eye,
    EyeOff,
    Loader2,
    CheckCircle2,
    AlertCircle,
} from "lucide-react";

import { useTranslation } from "react-i18next";

import { registerCustomer } from "../../services/customerAuthService";

import Navbar from "../../components/Navbar";

function CustomerRegister() {
    const navigate = useNavigate();

    const { t } = useTranslation();

    const [form, setForm] = useState({
        username: "",
        first_name: "",
        last_name: "",
        email: "",
        password: "",
        password_confirm: "",
    });

    const [showPassword, setShowPassword] = useState(false);

    const [showConfirmPassword, setShowConfirmPassword] =
        useState(false);

    const [loading, setLoading] = useState(false);

    const [error, setError] = useState("");

    const [success, setSuccess] = useState("");

    const handleChange = (e) => {
        setForm({
            ...form,
            [e.target.name]: e.target.value,
        });

        setError("");
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        setError("");
        setSuccess("");

        if (form.password !== form.password_confirm) {
            setError(t("register.errors.passwordMismatch"));
            return;
        }

        if (form.password.length < 8) {
            setError(t("register.errors.passwordLength"));
            return;
        }

        try {
            setLoading(true);

            await registerCustomer(form);

            setSuccess(t("register.success"));

            setTimeout(() => {
                navigate("/login");
            }, 1500);
        } catch (err) {
            setError(
                err.message || t("register.errors.failed")
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <Navbar />

            <main className="flex min-h-[calc(100vh-73px)] items-center justify-center bg-[#FDF8F5] px-5 py-10">
                <div className="w-full max-w-2xl">
                    {/* TITLE */}
                    <div className="mb-8 text-center">
                        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl border border-[#F4A460]/20 bg-[#B22222]/10">
                            <UserPlus
                                size={30}
                                className="text-[#B22222]"
                            />
                        </div>

                        <h1 className="mt-5 text-3xl font-extrabold text-[#2D1B0E] md:text-4xl">
                            {t("register.title")}
                        </h1>

                        <p className="mt-2 text-[#6A5A4A]">
                            {t("register.subtitle")}
                        </p>
                    </div>

                    {/* CARD */}
                    <div className="rounded-3xl border border-[#F4A460]/20 bg-white p-6 shadow-[0_20px_60px_rgba(178,34,34,0.08)] md:p-8">
                        {/* ERROR */}
                        {error && (
                            <div className="mb-6 flex items-start gap-3 rounded-xl border border-red-100 bg-red-50 p-4 text-sm font-semibold text-red-600">
                                <AlertCircle
                                    size={19}
                                    className="mt-0.5 shrink-0"
                                />

                                <span>{error}</span>
                            </div>
                        )}

                        {/* SUCCESS */}
                        {success && (
                            <div className="mb-6 flex items-start gap-3 rounded-xl border border-green-100 bg-green-50 p-4 text-sm font-semibold text-green-600">
                                <CheckCircle2
                                    size={19}
                                    className="mt-0.5 shrink-0"
                                />

                                <span>{success}</span>
                            </div>
                        )}

                        <form
                            onSubmit={handleSubmit}
                            className="space-y-5"
                        >
                            {/* NAME */}
                            <div className="grid gap-5 md:grid-cols-2">
                                <InputRed
                                    label={t(
                                        "register.firstName"
                                    )}
                                    name="first_name"
                                    value={form.first_name}
                                    onChange={handleChange}
                                    placeholder={t(
                                        "register.firstNamePlaceholder"
                                    )}
                                    required
                                />

                                <InputRed
                                    label={t(
                                        "register.lastName"
                                    )}
                                    name="last_name"
                                    value={form.last_name}
                                    onChange={handleChange}
                                    placeholder={t(
                                        "register.lastNamePlaceholder"
                                    )}
                                    required
                                />
                            </div>

                            {/* USERNAME */}
                            <InputRed
                                label={t(
                                    "register.username"
                                )}
                                name="username"
                                value={form.username}
                                onChange={handleChange}
                                placeholder={t(
                                    "register.usernamePlaceholder"
                                )}
                                required
                            />

                            {/* EMAIL */}
                            <InputRed
                                label={t(
                                    "register.email"
                                )}
                                name="email"
                                type="email"
                                value={form.email}
                                onChange={handleChange}
                                placeholder={t(
                                    "register.emailPlaceholder"
                                )}
                                required
                            />

                            {/* PASSWORD */}
                            <PasswordInputRed
                                label={t(
                                    "register.password"
                                )}
                                name="password"
                                value={form.password}
                                onChange={handleChange}
                                placeholder={t(
                                    "register.passwordPlaceholder"
                                )}
                                show={showPassword}
                                setShow={setShowPassword}
                                required
                            />

                            {/* CONFIRM PASSWORD */}
                            <PasswordInputRed
                                label={t(
                                    "register.confirmPassword"
                                )}
                                name="password_confirm"
                                value={form.password_confirm}
                                onChange={handleChange}
                                placeholder={t(
                                    "register.confirmPasswordPlaceholder"
                                )}
                                show={showConfirmPassword}
                                setShow={setShowConfirmPassword}
                                required
                            />

                            {/* BUTTON */}
                            <button
                                type="submit"
                                disabled={loading}
                                className="mt-3 flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#B22222] to-[#8B1A1A] py-4 font-extrabold text-white shadow-lg shadow-[#B22222]/30 transition hover:scale-[1.02] hover:shadow-xl hover:shadow-[#B22222]/50 disabled:cursor-not-allowed disabled:opacity-60"
                            >
                                {loading ? (
                                    <>
                                        <Loader2
                                            size={20}
                                            className="animate-spin"
                                        />

                                        {t(
                                            "register.creatingAccount"
                                        )}
                                    </>
                                ) : (
                                    <>
                                        <UserPlus size={19} />

                                        {t(
                                            "register.createAccount"
                                        )}
                                    </>
                                )}
                            </button>
                        </form>

                        {/* LOGIN */}
                        <p className="mt-7 text-center text-sm text-[#6A5A4A]">
                            {t("register.haveAccount")}{" "}

                            <Link
                                to="/login"
                                className="font-extrabold text-[#B22222] hover:text-[#8B1A1A]"
                            >
                                {t("register.login")}
                            </Link>
                        </p>
                    </div>
                </div>
            </main>
        </>
    );
}

/*
|--------------------------------------------------------------------------
| Reusable Input - REDISH
|--------------------------------------------------------------------------
*/

function InputRed({
    label,
    name,
    type = "text",
    value,
    onChange,
    placeholder,
    required,
}) {
    return (
        <div>
            <label className="mb-2 block text-sm font-bold text-[#2D1B0E]">
                {label}
            </label>

            <input
                type={type}
                name={name}
                value={value}
                onChange={onChange}
                placeholder={placeholder}
                required={required}
                className="w-full rounded-xl border border-[#F4A460]/20 bg-[#FDF8F5] px-4 py-3.5 text-sm text-[#2D1B0E] outline-none transition placeholder:text-[#8A7A6A] focus:border-[#B22222] focus:bg-white focus:ring-4 focus:ring-[#B22222]/10"
            />
        </div>
    );
}

/*
|--------------------------------------------------------------------------
| Password Input - REDISH
|--------------------------------------------------------------------------
*/

function PasswordInputRed({
    label,
    name,
    value,
    onChange,
    placeholder,
    show,
    setShow,
    required,
}) {
    return (
        <div>
            <label className="mb-2 block text-sm font-bold text-[#2D1B0E]">
                {label}
            </label>

            <div className="relative">
                <input
                    type={show ? "text" : "password"}
                    name={name}
                    value={value}
                    onChange={onChange}
                    placeholder={placeholder}
                    required={required}
                    className="w-full rounded-xl border border-[#F4A460]/20 bg-[#FDF8F5] px-4 py-3.5 pr-12 text-sm text-[#2D1B0E] outline-none transition placeholder:text-[#8A7A6A] focus:border-[#B22222] focus:bg-white focus:ring-4 focus:ring-[#B22222]/10"
                />

                <button
                    type="button"
                    onClick={() => setShow(!show)}
                    aria-label={
                        show
                            ? "Hide password"
                            : "Show password"
                    }
                    className="absolute right-3 top-1/2 -translate-y-1/2 rounded-lg p-2 text-[#8A7A6A] transition hover:bg-[#B22222]/5 hover:text-[#B22222]"
                >
                    {show ? (
                        <EyeOff size={18} />
                    ) : (
                        <Eye size={18} />
                    )}
                </button>
            </div>
        </div>
    );
}

export default CustomerRegister;

