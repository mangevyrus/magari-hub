
import { useState } from "react";

import { Link, useNavigate } from "react-router-dom";

import {
    Lock,
    Eye,
    EyeOff,
    ArrowLeft,
    Save,
    Loader2,
    CheckCircle2,
    AlertCircle,
} from "lucide-react";

import { useTranslation } from "react-i18next";

import Navbar from "../../components/Navbar";

import {
    changeCustomerPassword,
    logoutCustomer,
} from "../../services/customerAuthService";

function ChangePassword() {
    const navigate = useNavigate();
    const { t } = useTranslation();

    const [form, setForm] = useState({
        current_password: "",
        new_password: "",
        confirm_password: "",
    });

    const [showCurrent, setShowCurrent] = useState(false);
    const [showNew, setShowNew] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);

    const [saving, setSaving] = useState(false);
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");

    const handleChange = (e) => {
        const { name, value } = e.target;

        setForm((previous) => ({
            ...previous,
            [name]: value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        setMessage("");
        setError("");

        if (
            !form.current_password ||
            !form.new_password ||
            !form.confirm_password
        ) {
            setError(
                t(
                    "changePassword.validation.allFields"
                )
            );
            return;
        }

        if (form.new_password.length < 8) {
            setError(
                t(
                    "changePassword.validation.minLength"
                )
            );
            return;
        }

        if (
            form.new_password !==
            form.confirm_password
        ) {
            setError(
                t(
                    "changePassword.validation.noMatch"
                )
            );
            return;
        }

        if (
            form.current_password ===
            form.new_password
        ) {
            setError(
                t(
                    "changePassword.validation.different"
                )
            );
            return;
        }

        setSaving(true);

        try {
            await changeCustomerPassword(
                form.current_password,
                form.new_password,
                form.confirm_password
            );

            setMessage(
                t("changePassword.messages.success")
            );

            setForm({
                current_password: "",
                new_password: "",
                confirm_password: "",
            });

            /*
             * Give the user a moment to see the success
             * message, then log them out because the
             * password has changed.
             */
            setTimeout(() => {
                logoutCustomer();
                navigate("/login");
            }, 1800);
        } catch (err) {
            console.error(
                "Password change failed:",
                err
            );

            setError(
                err.message ||
                    t("changePassword.messages.error")
            );
        } finally {
            setSaving(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#FDF8F5]">
            <Navbar />

            <main className="mx-auto max-w-3xl px-5 py-10 md:px-8">
                {/* BACK */}
                <Link
                    to="/account/settings"
                    className="mb-6 inline-flex items-center gap-2 text-sm font-bold text-[#B22222] transition hover:text-[#8B1A1A]"
                >
                    <ArrowLeft size={17} />

                    {t(
                        "changePassword.backToSettings"
                    )}
                </Link>

                {/* HEADER */}
                <div className="mb-8">
                    <p className="text-sm font-bold uppercase tracking-[0.18em] text-[#B22222]">
                        {t(
                            "changePassword.header.eyebrow"
                        )}
                    </p>

                    <h1 className="mt-2 text-3xl font-black text-[#2D1B0E] md:text-4xl">
                        {t(
                            "changePassword.header.title"
                        )}
                    </h1>

                    <p className="mt-2 text-[#6A5A4A]">
                        {t(
                            "changePassword.header.description"
                        )}
                    </p>
                </div>

                {/* SUCCESS */}
                {message && (
                    <div className="mb-6 flex items-center gap-3 rounded-2xl border border-green-100 bg-green-50 p-4 text-green-700">
                        <CheckCircle2 size={20} />

                        <p className="font-semibold">
                            {message}
                        </p>
                    </div>
                )}

                {/* ERROR */}
                {error && (
                    <div className="mb-6 flex items-start gap-3 rounded-2xl border border-red-100 bg-red-50 p-4 text-red-700">
                        <AlertCircle
                            size={20}
                            className="mt-0.5 shrink-0"
                        />

                        <div>
                            <p className="font-bold">
                                {t(
                                    "changePassword.messages.errorTitle"
                                )}
                            </p>

                            <p className="mt-1 text-sm">
                                {error}
                            </p>
                        </div>
                    </div>
                )}

                {/* FORM */}
                <form
                    onSubmit={handleSubmit}
                    className="rounded-2xl border border-[#F4A460]/20 bg-white p-6 shadow-sm md:p-8"
                >
                    <div className="mb-8 flex items-center gap-3">
                        <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-[#F4A460]/20 bg-[#B22222]/10">
                            <Lock
                                size={22}
                                className="text-[#B22222]"
                            />
                        </div>

                        <div>
                            <h2 className="font-extrabold text-[#2D1B0E]">
                                {t(
                                    "changePassword.security.title"
                                )}
                            </h2>

                            <p className="text-xs text-[#8A7A6A]">
                                {t(
                                    "changePassword.security.description"
                                )}
                            </p>
                        </div>
                    </div>

                    <div className="space-y-5">
                        <PasswordField
                            label={t(
                                "changePassword.fields.current.label"
                            )}
                            name="current_password"
                            value={
                                form.current_password
                            }
                            onChange={handleChange}
                            show={showCurrent}
                            setShow={setShowCurrent}
                        />

                        <PasswordField
                            label={t(
                                "changePassword.fields.new.label"
                            )}
                            name="new_password"
                            value={form.new_password}
                            onChange={handleChange}
                            show={showNew}
                            setShow={setShowNew}
                        />

                        <PasswordField
                            label={t(
                                "changePassword.fields.confirm.label"
                            )}
                            name="confirm_password"
                            value={
                                form.confirm_password
                            }
                            onChange={handleChange}
                            show={showConfirm}
                            setShow={setShowConfirm}
                        />
                    </div>

                    {/* PASSWORD REQUIREMENTS */}
                    <div className="mt-6 rounded-xl border border-[#F4A460]/10 bg-[#FDF8F5] p-4">
                        <p className="text-sm font-bold text-[#2D1B0E]">
                            {t(
                                "changePassword.requirements.title"
                            )}
                        </p>

                        <ul className="mt-2 space-y-1 text-xs text-[#6A5A4A]">
                            <li>
                                •{" "}
                                {t(
                                    "changePassword.requirements.minLength"
                                )}
                            </li>

                            <li>
                                •{" "}
                                {t(
                                    "changePassword.requirements.different"
                                )}
                            </li>

                            <li>
                                •{" "}
                                {t(
                                    "changePassword.requirements.avoidGuessing"
                                )}
                            </li>
                        </ul>
                    </div>

                    {/* BUTTONS */}
                    <div className="mt-7 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
                        <Link
                            to="/account/settings"
                            className="inline-flex items-center justify-center rounded-xl border border-[#F4A460]/20 bg-white px-6 py-3.5 text-sm font-bold text-[#6A5A4A] transition hover:bg-[#FDF8F5]"
                        >
                            {t(
                                "changePassword.actions.cancel"
                            )}
                        </Link>

                        <button
                            type="submit"
                            disabled={saving}
                            className="inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#8B1A1A] to-[#4A0E0E] px-6 py-3.5 font-bold text-white shadow-lg shadow-[#8B1A1A]/25 transition hover:scale-[1.02] disabled:cursor-not-allowed disabled:opacity-60"
                        >
                            {saving ? (
                                <>
                                    <Loader2
                                        size={18}
                                        className="animate-spin"
                                    />

                                    {t(
                                        "changePassword.actions.changing"
                                    )}
                                </>
                            ) : (
                                <>
                                    <Save size={18} />

                                    {t(
                                        "changePassword.actions.change"
                                    )}
                                </>
                            )}
                        </button>
                    </div>
                </form>
            </main>
        </div>
    );
}

function PasswordField({
    label,
    name,
    value,
    onChange,
    show,
    setShow,
}) {
    const { t } = useTranslation();

    return (
        <div>
            <label className="mb-2 block text-sm font-bold text-[#2D1B0E]">
                {label}
            </label>

            <div className="relative">
                <Lock
                    size={17}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-[#B22222]"
                />

                <input
                    type={show ? "text" : "password"}
                    name={name}
                    value={value}
                    onChange={onChange}
                    autoComplete={
                        name === "current_password"
                            ? "current-password"
                            : "new-password"
                    }
                    className="w-full rounded-xl border border-[#F4A460]/20 bg-[#FDF8F5] py-3 pl-11 pr-12 text-sm font-medium text-[#2D1B0E] outline-none transition focus:border-[#B22222] focus:ring-4 focus:ring-[#B22222]/10"
                />

                <button
                    type="button"
                    onClick={() => setShow(!show)}
                    aria-label={
                        show
                            ? t(
                                  "changePassword.actions.hidePassword"
                              )
                            : t(
                                  "changePassword.actions.showPassword"
                              )
                    }
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-[#8A7A6A] transition hover:text-[#B22222]"
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

export default ChangePassword;

