
import { useEffect, useState } from "react";

import { Link, useNavigate } from "react-router-dom";

import {
    User,
    Mail,
    Phone,
    MapPin,
    Save,
    ArrowLeft,
    Loader2,
    CheckCircle2,
    AlertCircle,
    Lock,
} from "lucide-react";

import { useTranslation } from "react-i18next";

import Navbar from "../../components/Navbar";

import {
    getCurrentCustomer,
    getCustomerProfile,
    updateCustomerProfile,
    updateCustomerAccount,
    logoutCustomer,
} from "../../services/customerAuthService";

function AccountSettings() {
    const navigate = useNavigate();
    const { t } = useTranslation();

    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    const [message, setMessage] = useState("");
    const [error, setError] = useState("");

    const [account, setAccount] = useState({
        first_name: "",
        last_name: "",
        username: "",
        email: "",
    });

    const [profile, setProfile] = useState({
        phone: "",
        location: "",
    });

    useEffect(() => {
        const loadSettings = async () => {
            try {
                const customer = await getCurrentCustomer();

                if (!customer) {
                    logoutCustomer();
                    navigate("/login");
                    return;
                }

                setAccount({
                    first_name: customer.first_name || "",
                    last_name: customer.last_name || "",
                    username: customer.username || "",
                    email: customer.email || "",
                });

                try {
                    const customerProfile =
                        await getCustomerProfile();

                    setProfile({
                        phone: customerProfile.phone || "",
                        location: customerProfile.location || "",
                    });
                } catch (profileError) {
                    console.log(
                        "Profile could not be loaded:",
                        profileError
                    );
                }
            } catch (err) {
                console.error(
                    "Failed to load account settings:",
                    err
                );

                logoutCustomer();
                navigate("/login");
            } finally {
                setLoading(false);
            }
        };

        loadSettings();
    }, [navigate]);

    const handleAccountChange = (e) => {
        const { name, value } = e.target;

        setAccount((previous) => ({
            ...previous,
            [name]: value,
        }));
    };

    const handleProfileChange = (e) => {
        const { name, value } = e.target;

        setProfile((previous) => ({
            ...previous,
            [name]: value,
        }));
    };

    const handleSave = async (e) => {
        e.preventDefault();

        setMessage("");
        setError("");
        setSaving(true);

        try {
            /*
             * Update Django User account information.
             */
            await updateCustomerAccount({
                first_name: account.first_name,
                last_name: account.last_name,
                username: account.username,
                email: account.email,
            });

            /*
             * Update customer profile information.
             *
             * FormData is used because updateCustomerProfile()
             * already expects profileData directly as the request body.
             */
            const profileData = new FormData();

            profileData.append("phone", profile.phone);
            profileData.append("location", profile.location);

            await updateCustomerProfile(profileData);

            setMessage(
                t("accountSettings.messages.success")
            );

            /*
             * Refresh account information after saving.
             */
            const updatedCustomer =
                await getCurrentCustomer();

            if (updatedCustomer) {
                setAccount({
                    first_name:
                        updatedCustomer.first_name || "",
                    last_name:
                        updatedCustomer.last_name || "",
                    username:
                        updatedCustomer.username || "",
                    email:
                        updatedCustomer.email || "",
                });
            }
        } catch (err) {
            console.error(
                "Failed to update account:",
                err
            );

            setError(
                err.message ||
                    t("accountSettings.messages.error")
            );
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <div className="flex min-h-screen items-center justify-center bg-[#FDF8F5]">
                <div className="flex items-center gap-3 text-[#2D1B0E]">
                    <Loader2
                        size={25}
                        className="animate-spin text-[#B22222]"
                    />

                    <span className="font-semibold">
                        {t("accountSettings.loading")}
                    </span>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#FDF8F5]">
            <Navbar />

            <main className="mx-auto max-w-5xl px-5 py-10 md:px-8">
                {/* BACK */}
                <Link
                    to="/account"
                    className="mb-6 inline-flex items-center gap-2 text-sm font-bold text-[#B22222] transition hover:text-[#8B1A1A]"
                >
                    <ArrowLeft size={17} />

                    {t("accountSettings.backToAccount")}
                </Link>

                {/* HEADER */}
                <div className="mb-8">
                    <p className="text-sm font-bold uppercase tracking-[0.18em] text-[#B22222]">
                        {t("accountSettings.header.eyebrow")}
                    </p>

                    <h1 className="mt-2 text-3xl font-black text-[#2D1B0E] md:text-4xl">
                        {t("accountSettings.header.title")}
                    </h1>

                    <p className="mt-2 text-[#6A5A4A]">
                        {t("accountSettings.header.description")}
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
                                    "accountSettings.messages.errorTitle"
                                )}
                            </p>

                            <p className="mt-1 text-sm">
                                {error}
                            </p>
                        </div>
                    </div>
                )}

                <form
                    onSubmit={handleSave}
                    className="space-y-6"
                >
                    {/* ACCOUNT INFORMATION */}
                    <section className="rounded-2xl border border-[#F4A460]/20 bg-white p-6 shadow-sm md:p-8">
                        <div className="mb-7 flex items-center gap-3">
                            <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-[#F4A460]/20 bg-[#B22222]/10">
                                <User
                                    size={21}
                                    className="text-[#B22222]"
                                />
                            </div>

                            <div>
                                <h2 className="font-extrabold text-[#2D1B0E]">
                                    {t(
                                        "accountSettings.account.title"
                                    )}
                                </h2>

                                <p className="text-xs text-[#8A7A6A]">
                                    {t(
                                        "accountSettings.account.description"
                                    )}
                                </p>
                            </div>
                        </div>

                        <div className="grid gap-5 md:grid-cols-2">
                            <InputField
                                label={t(
                                    "accountSettings.fields.firstName.label"
                                )}
                                name="first_name"
                                value={account.first_name}
                                onChange={handleAccountChange}
                                placeholder={t(
                                    "accountSettings.fields.firstName.placeholder"
                                )}
                                icon={<User size={17} />}
                            />

                            <InputField
                                label={t(
                                    "accountSettings.fields.lastName.label"
                                )}
                                name="last_name"
                                value={account.last_name}
                                onChange={handleAccountChange}
                                placeholder={t(
                                    "accountSettings.fields.lastName.placeholder"
                                )}
                                icon={<User size={17} />}
                            />

                            <InputField
                                label={t(
                                    "accountSettings.fields.username.label"
                                )}
                                name="username"
                                value={account.username}
                                onChange={handleAccountChange}
                                placeholder={t(
                                    "accountSettings.fields.username.placeholder"
                                )}
                                icon={<User size={17} />}
                            />

                            <InputField
                                label={t(
                                    "accountSettings.fields.email.label"
                                )}
                                name="email"
                                type="email"
                                value={account.email}
                                onChange={handleAccountChange}
                                placeholder={t(
                                    "accountSettings.fields.email.placeholder"
                                )}
                                icon={<Mail size={17} />}
                            />
                        </div>
                    </section>

                    {/* CONTACT INFORMATION */}
                    <section className="rounded-2xl border border-[#F4A460]/20 bg-white p-6 shadow-sm md:p-8">
                        <div className="mb-7 flex items-center gap-3">
                            <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-[#F4A460]/20 bg-[#B22222]/10">
                                <Phone
                                    size={21}
                                    className="text-[#B22222]"
                                />
                            </div>

                            <div>
                                <h2 className="font-extrabold text-[#2D1B0E]">
                                    {t(
                                        "accountSettings.contact.title"
                                    )}
                                </h2>

                                <p className="text-xs text-[#8A7A6A]">
                                    {t(
                                        "accountSettings.contact.description"
                                    )}
                                </p>
                            </div>
                        </div>

                        <div className="grid gap-5 md:grid-cols-2">
                            <InputField
                                label={t(
                                    "accountSettings.fields.phone.label"
                                )}
                                name="phone"
                                value={profile.phone}
                                onChange={handleProfileChange}
                                placeholder={t(
                                    "accountSettings.fields.phone.placeholder"
                                )}
                                icon={<Phone size={17} />}
                            />

                            <InputField
                                label={t(
                                    "accountSettings.fields.location.label"
                                )}
                                name="location"
                                value={profile.location}
                                onChange={handleProfileChange}
                                placeholder={t(
                                    "accountSettings.fields.location.placeholder"
                                )}
                                icon={<MapPin size={17} />}
                            />
                        </div>
                    </section>

                    {/* PASSWORD */}
                    <section className="rounded-2xl border border-[#F4A460]/20 bg-white p-6 shadow-sm md:p-8">
                        <div className="flex items-center justify-between gap-4">
                            <div className="flex items-center gap-3">
                                <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-[#F4A460]/20 bg-[#B22222]/10">
                                    <Lock
                                        size={21}
                                        className="text-[#B22222]"
                                    />
                                </div>

                                <div>
                                    <h2 className="font-extrabold text-[#2D1B0E]">
                                        {t(
                                            "accountSettings.security.title"
                                        )}
                                    </h2>

                                    <p className="text-xs text-[#8A7A6A]">
                                        {t(
                                            "accountSettings.security.description"
                                        )}
                                    </p>
                                </div>
                            </div>

                            <Link
                                to="/account/change-password"
                                className="rounded-xl border border-[#B22222]/20 bg-[#FDF8F5] px-4 py-2 text-sm font-bold text-[#B22222] transition hover:bg-[#B22222]/5"
                            >
                                {t(
                                    "accountSettings.security.changePassword"
                                )}
                            </Link>
                        </div>
                    </section>

                    {/* SAVE */}
                    <div className="flex justify-end">
                        <button
                            type="submit"
                            disabled={saving}
                            className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-[#8B1A1A] to-[#4A0E0E] px-7 py-3.5 font-bold text-white shadow-lg shadow-[#8B1A1A]/25 transition hover:scale-[1.02] hover:shadow-xl disabled:cursor-not-allowed disabled:opacity-60"
                        >
                            {saving ? (
                                <>
                                    <Loader2
                                        size={18}
                                        className="animate-spin"
                                    />

                                    {t(
                                        "accountSettings.actions.saving"
                                    )}
                                </>
                            ) : (
                                <>
                                    <Save size={18} />

                                    {t(
                                        "accountSettings.actions.save"
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

function InputField({
    label,
    name,
    type = "text",
    value,
    onChange,
    placeholder,
    icon,
}) {
    return (
        <div>
            <label className="mb-2 flex items-center gap-2 text-sm font-bold text-[#2D1B0E]">
                <span className="text-[#B22222]">
                    {icon}
                </span>

                {label}
            </label>

            <input
                type={type}
                name={name}
                value={value}
                onChange={onChange}
                placeholder={placeholder}
                className="w-full rounded-xl border border-[#F4A460]/20 bg-[#FDF8F5] px-4 py-3 text-sm font-medium text-[#2D1B0E] outline-none transition placeholder:text-[#A89586] focus:border-[#B22222] focus:ring-4 focus:ring-[#B22222]/10"
            />
        </div>
    );
}

export default AccountSettings;

