
import { useEffect, useState } from "react";

import { Link, useNavigate } from "react-router-dom";

import {
    User,
    Mail,
    Phone,
    MapPin,
    LogOut,
    CarFront,
    Settings,
    Loader2,
    MessageCircle,
    ShoppingBag,
    Heart,
} from "lucide-react";

import { useTranslation } from "react-i18next";

import Navbar from "../../components/Navbar";

import {
    getCurrentCustomer,
    getCustomerProfile,
    logoutCustomer,
} from "../../services/customerAuthService";

function Account() {
    const navigate = useNavigate();

    const { t, i18n } = useTranslation();

    const [user, setUser] = useState(null);

    const [profile, setProfile] = useState(null);

    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadAccount = async () => {
            try {
                const customer =
                    await getCurrentCustomer();

                if (!customer) {
                    logoutCustomer();
                    navigate("/login");
                    return;
                }

                setUser(customer);

                try {
                    const customerProfile =
                        await getCustomerProfile();

                    setProfile(customerProfile);
                } catch (profileError) {
                    console.log(
                        "Profile not available yet:",
                        profileError
                    );
                }
            } catch (error) {
                console.error(
                    "Failed to load account:",
                    error
                );

                logoutCustomer();

                navigate("/login");
            } finally {
                setLoading(false);
            }
        };

        loadAccount();
    }, [navigate]);

    const handleLogout = () => {
        logoutCustomer();

        navigate("/login");
    };

    const formatMemberSince = (date) => {
        if (!date) {
            return "";
        }

        return new Date(date).toLocaleDateString(
            i18n.language === "sw"
                ? "sw-TZ"
                : "en-GB",
            {
                day: "2-digit",
                month: "short",
                year: "numeric",
            }
        );
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
                        {t("account.loading")}
                    </span>
                </div>
            </div>
        );
    }

    const fullName =
        user &&
        (user.first_name || user.last_name)
            ? `${user.first_name || ""} ${
                  user.last_name || ""
              }`.trim()
            : t("account.personal.notProvided");

    return (
        <div className="min-h-screen bg-[#FDF8F5]">
            <Navbar />

            {/* MAIN */}

            <main className="mx-auto max-w-7xl px-5 py-10 md:px-8">
                {/* WELCOME */}

                <div className="mb-8">
                    <p className="text-sm font-bold uppercase tracking-[0.18em] text-[#B22222]">
                        {t("account.badge")}
                    </p>

                    <h1 className="mt-2 text-3xl font-black text-[#2D1B0E] md:text-4xl">
                        {t("account.welcome")}

                        {user?.first_name
                            ? `, ${user.first_name}`
                            : ""}
                    </h1>

                    <p className="mt-2 text-[#6A5A4A]">
                        {t(
                            "account.description"
                        )}
                    </p>
                </div>

                {/* CONTENT */}

                <div className="grid gap-6 lg:grid-cols-[2fr_1fr]">
                    {/* LEFT COLUMN */}

                    <div className="space-y-6">
                        {/* QUICK ACTIONS */}

                        <div className="rounded-2xl border border-[#F4A460]/20 bg-white p-6 shadow-sm">
                            <h2 className="mb-5 flex items-center gap-2 font-extrabold text-[#2D1B0E]">
                                <Settings
                                    size={18}
                                    className="text-[#B22222]"
                                />

                                {t(
                                    "account.quickActions.title"
                                )}
                            </h2>

                            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                                {/* BROWSE VEHICLES */}

                                <Link
                                    to="/vehicles"
                                    className="group flex items-center gap-3 rounded-xl border border-[#F4A460]/10 bg-[#FDF8F5] p-4 transition hover:bg-[#B22222]/5"
                                >
                                    <div className="flex h-10 w-10 items-center justify-center rounded-lg border border-[#F4A460]/20 bg-white group-hover:border-[#B22222]/30">
                                        <CarFront
                                            size={19}
                                            className="text-[#B22222]"
                                        />
                                    </div>

                                    <div className="flex-1">
                                        <p className="text-sm font-bold text-[#2D1B0E]">
                                            {t(
                                                "account.quickActions.browse.title"
                                            )}
                                        </p>

                                        <p className="text-xs text-[#8A7A6A]">
                                            {t(
                                                "account.quickActions.browse.description"
                                            )}
                                        </p>
                                    </div>

                                    <span className="text-[#B22222]/30">
                                        →
                                    </span>
                                </Link>

                                {/* MY ORDERS */}

                                <Link
                                    to="/orders"
                                    className="group flex items-center gap-3 rounded-xl border border-[#F4A460]/10 bg-[#FDF8F5] p-4 transition hover:bg-[#B22222]/5"
                                >
                                    <div className="flex h-10 w-10 items-center justify-center rounded-lg border border-[#F4A460]/20 bg-white group-hover:border-[#B22222]/30">
                                        <ShoppingBag
                                            size={19}
                                            className="text-[#B22222]"
                                        />
                                    </div>

                                    <div className="flex-1">
                                        <p className="text-sm font-bold text-[#2D1B0E]">
                                            {t(
                                                "account.quickActions.orders.title"
                                            )}
                                        </p>

                                        <p className="text-xs text-[#8A7A6A]">
                                            {t(
                                                "account.quickActions.orders.description"
                                            )}
                                        </p>
                                    </div>

                                    <span className="text-[#B22222]/30">
                                        →
                                    </span>
                                </Link>

                                {/* MY INQUIRIES */}

                                <Link
                                    to="/account/inquiries"
                                    className="group flex items-center gap-3 rounded-xl border border-[#F4A460]/10 bg-[#FDF8F5] p-4 transition hover:bg-[#B22222]/5"
                                >
                                    <div className="flex h-10 w-10 items-center justify-center rounded-lg border border-[#F4A460]/20 bg-white group-hover:border-[#B22222]/30">
                                        <MessageCircle
                                            size={19}
                                            className="text-[#B22222]"
                                        />
                                    </div>

                                    <div className="flex-1">
                                        <p className="text-sm font-bold text-[#2D1B0E]">
                                            {t(
                                                "account.quickActions.inquiries.title"
                                            )}
                                        </p>

                                        <p className="text-xs text-[#8A7A6A]">
                                            {t(
                                                "account.quickActions.inquiries.description"
                                            )}
                                        </p>
                                    </div>

                                    <span className="text-[#B22222]/30">
                                        →
                                    </span>
                                </Link>

                                {/* MY CART */}

                                <Link
                                    to="/cart"
                                    className="group flex items-center gap-3 rounded-xl border border-[#F4A460]/10 bg-[#FDF8F5] p-4 transition hover:bg-[#B22222]/5"
                                >
                                    <div className="flex h-10 w-10 items-center justify-center rounded-lg border border-[#F4A460]/20 bg-white group-hover:border-[#B22222]/30">
                                        <ShoppingBag
                                            size={19}
                                            className="text-[#B22222]"
                                        />
                                    </div>

                                    <div className="flex-1">
                                        <p className="text-sm font-bold text-[#2D1B0E]">
                                            {t(
                                                "account.quickActions.cart.title"
                                            )}
                                        </p>

                                        <p className="text-xs text-[#8A7A6A]">
                                            {t(
                                                "account.quickActions.cart.description"
                                            )}
                                        </p>
                                    </div>

                                    <span className="text-[#B22222]/30">
                                        →
                                    </span>
                                </Link>

                                {/* ACCOUNT SETTINGS */}

                                <Link
                                    to="/account/settings"
                                    className="group flex items-center gap-3 rounded-xl border border-[#F4A460]/10 bg-[#FDF8F5] p-4 transition hover:bg-[#B22222]/5"
                                >
                                    <div className="flex h-10 w-10 items-center justify-center rounded-lg border border-[#F4A460]/20 bg-white group-hover:border-[#B22222]/30">
                                        <Settings
                                            size={19}
                                            className="text-[#B22222]"
                                        />
                                    </div>

                                    <div className="flex-1">
                                        <p className="text-sm font-bold text-[#2D1B0E]">
                                            {t(
                                                "account.quickActions.settings.title"
                                            )}
                                        </p>

                                        <p className="text-xs text-[#8A7A6A]">
                                            {t(
                                                "account.quickActions.settings.description"
                                            )}
                                        </p>
                                    </div>

                                    <span className="text-[#B22222]/30">
                                        →
                                    </span>
                                </Link>

                                {/* FAVOURITES */}

                                <Link
                                    to="/account/favourites"
                                    className="group flex items-center gap-3 rounded-xl border border-[#F4A460]/10 bg-[#FDF8F5] p-4 transition hover:bg-[#B22222]/5"
                                >
                                    <div className="flex h-10 w-10 items-center justify-center rounded-lg border border-[#F4A460]/20 bg-white group-hover:border-[#B22222]/30">
                                        <Heart
                                            size={19}
                                            className="text-[#B22222]"
                                        />
                                    </div>

                                    <div className="flex-1">
                                        <p className="text-sm font-bold text-[#2D1B0E]">
                                            {t(
                                                "account.quickActions.favourites.title"
                                            )}
                                        </p>

                                        <p className="text-xs text-[#8A7A6A]">
                                            {t(
                                                "account.quickActions.favourites.description"
                                            )}
                                        </p>
                                    </div>

                                    <span className="text-[#B22222]/30">
                                        →
                                    </span>
                                </Link>
                            </div>

                            {/* DIVIDER */}

                            <div className="my-4 border-t border-[#F4A460]/10" />

                            {/* LOGOUT */}

                            <button
                                type="button"
                                onClick={handleLogout}
                                className="group flex w-full items-center gap-3 rounded-xl border border-red-100 bg-red-50 p-4 transition hover:bg-red-100"
                            >
                                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-white">
                                    <LogOut
                                        size={19}
                                        className="text-red-500"
                                    />
                                </div>

                                <div className="flex-1 text-left">
                                    <p className="text-sm font-bold text-red-500">
                                        {t(
                                            "account.logout.title"
                                        )}
                                    </p>

                                    <p className="text-xs text-red-400">
                                        {t(
                                            "account.logout.description"
                                        )}
                                    </p>
                                </div>
                            </button>
                        </div>

                        {/* MARKETPLACE CARD */}

                        <div className="rounded-2xl bg-gradient-to-br from-[#4A0E0E] via-[#6B1A1A] to-[#8B1A1A] p-6 text-white shadow-lg shadow-[#B22222]/20">
                            <p className="text-xs font-bold uppercase tracking-[0.15em] text-[#F4A460]">
                                Bingwa Magari Used
                            </p>

                            <h3 className="mt-2 text-xl font-black">
                                {t(
                                    "account.marketplace.title"
                                )}
                            </h3>

                            <p className="mt-2 text-sm leading-6 text-[#F4A460]/70">
                                {t(
                                    "account.marketplace.description"
                                )}
                            </p>

                            <Link
                                to="/vehicles"
                                className="mt-5 inline-flex items-center gap-2 rounded-xl bg-[#F4A460] px-4 py-2.5 text-sm font-bold text-[#2D1B0E] transition hover:bg-[#D4833A]"
                            >
                                {t(
                                    "account.marketplace.button"
                                )}{" "}
                                →
                            </Link>
                        </div>
                    </div>

                    {/* RIGHT COLUMN */}

                    <div className="h-fit rounded-2xl border border-[#F4A460]/20 bg-white p-5 shadow-sm">
                        {/* CARD HEADER */}

                        <div className="mb-4 flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <div className="flex h-9 w-9 items-center justify-center rounded-xl border border-[#F4A460]/20 bg-[#B22222]/10">
                                    <User
                                        size={18}
                                        className="text-[#B22222]"
                                    />
                                </div>

                                <div>
                                    <h2 className="text-sm font-extrabold text-[#2D1B0E]">
                                        {t(
                                            "account.personal.title"
                                        )}
                                    </h2>

                                    <p className="text-[10px] text-[#8A7A6A]">
                                        {t(
                                            "account.personal.subtitle"
                                        )}
                                    </p>
                                </div>
                            </div>

                            <Link
                                to="/account/settings"
                                className="flex items-center gap-1.5 rounded-lg border border-[#F4A460]/20 bg-[#FDF8F5] px-3 py-1.5 text-xs font-bold text-[#B22222] transition hover:bg-[#B22222]/5"
                            >
                                <Settings
                                    size={13}
                                />

                                {t(
                                    "account.personal.edit"
                                )}
                            </Link>
                        </div>

                        {/* USER INFORMATION */}

                        <div className="space-y-3">
                            <CompactInfo
                                icon={
                                    <User
                                        size={15}
                                    />
                                }
                                label={t(
                                    "account.personal.name"
                                )}
                                value={fullName}
                            />

                            <CompactInfo
                                icon={
                                    <Mail
                                        size={15}
                                    />
                                }
                                label={t(
                                    "account.personal.email"
                                )}
                                value={
                                    user?.email ||
                                    t(
                                        "account.personal.notProvided"
                                    )
                                }
                            />

                            <CompactInfo
                                icon={
                                    <Phone
                                        size={15}
                                    />
                                }
                                label={t(
                                    "account.personal.phone"
                                )}
                                value={
                                    profile?.phone ||
                                    t(
                                        "account.personal.notProvided"
                                    )
                                }
                            />

                            <CompactInfo
                                icon={
                                    <MapPin
                                        size={15}
                                    />
                                }
                                label={t(
                                    "account.personal.location"
                                )}
                                value={
                                    profile?.location ||
                                    t(
                                        "account.personal.notProvided"
                                    )
                                }
                            />

                            {/* MEMBER SINCE */}

                            {user?.date_joined && (
                                <div className="mt-2 border-t border-[#F4A460]/10 pt-2">
                                    <p className="text-[10px] text-[#8A7A6A]">
                                        {t(
                                            "account.personal.memberSince"
                                        )}{" "}

                                        <span className="font-semibold text-[#2D1B0E]">
                                            {formatMemberSince(
                                                user.date_joined
                                            )}
                                        </span>
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}

/*
|--------------------------------------------------------------------------
| Information Item - Compact
|--------------------------------------------------------------------------
*/

function CompactInfo({
    icon,
    label,
    value,
}) {
    return (
        <div className="flex items-center gap-3 rounded-lg border border-[#F4A460]/10 bg-[#FDF8F5] p-2.5 transition hover:border-[#B22222]/20">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg border border-[#F4A460]/20 bg-white text-[#B22222]">
                {icon}
            </div>

            <div className="min-w-0 flex-1">
                <p className="text-[10px] font-bold uppercase tracking-wide text-[#8A7A6A]">
                    {label}
                </p>

                <p className="truncate text-sm font-semibold text-[#2D1B0E]">
                    {value}
                </p>
            </div>
        </div>
    );
}

export default Account;

