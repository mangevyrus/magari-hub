import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import {
    ArrowLeft,
    User,
    Mail,
    Phone,
    MapPin,
    CalendarDays,
    Clock,
    ShoppingBag,
    MessageCircle,
    ShieldCheck,
    ShieldOff,
    Trash2,
    Loader2,
    AlertCircle,
    CheckCircle2,
    XCircle,
} from "lucide-react";
import AdminLayout from "../../layouts/AdminLayout";
import api from "../../services/api";

function AdminUserDetails() {
    const { id } = useParams();
    const navigate = useNavigate();

    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [actionLoading, setActionLoading] = useState(false);

    useEffect(() => {
        loadUser();
    }, [id]);

    const loadUser = async () => {
        try {
            setLoading(true);
            setError("");

            const response = await api.get(
                `/auth/admin/customers/${id}/`
            );

            setUser(response.data);
        } catch (err) {
            console.error(
                "User details loading error:",
                err
            );

            setError(
                err.response?.data?.detail ||
                "Unable to load user details."
            );
        } finally {
            setLoading(false);
        }
    };

    const handleStatusChange = async () => {
        if (!user) return;

        const newStatus = !user.is_active;

        const confirmed = window.confirm(
            newStatus
                ? "Activate this customer account?"
                : "Deactivate this customer account?"
        );

        if (!confirmed) return;

        try {
            setActionLoading(true);

            await api.patch(
                `/users/admin/users/${id}/status/`,
                {
                    is_active: newStatus,
                }
            );

            setUser((prev) => ({
                ...prev,
                is_active: newStatus,
            }));
        } catch (err) {
            console.error(
                "Status update error:",
                err
            );

            alert(
                err.response?.data?.detail ||
                "Unable to update account status."
            );
        } finally {
            setActionLoading(false);
        }
    };

    const handleDelete = async () => {
        if (!user) return;

        const confirmed = window.confirm(
            `Are you sure you want to permanently delete ${user.full_name || user.username}? This action cannot be undone.`
        );

        if (!confirmed) return;

        try {
            setActionLoading(true);

            await api.delete(
                `/users/admin/users/${id}/delete/`
            );

            navigate("/admin/users");
        } catch (err) {
            console.error(
                "Delete user error:",
                err
            );

            alert(
                err.response?.data?.detail ||
                "Unable to delete user."
            );
        } finally {
            setActionLoading(false);
        }
    };

    const formatDate = (date) => {
        if (!date) return "Never";

        return new Date(date).toLocaleDateString(
            "en-US",
            {
                year: "numeric",
                month: "long",
                day: "numeric",
            }
        );
    };

    const formatDateTime = (date) => {
        if (!date) return "Never";

        return new Date(date).toLocaleString(
            "en-US",
            {
                year: "numeric",
                month: "short",
                day: "numeric",
                hour: "2-digit",
                minute: "2-digit",
            }
        );
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-[#FDF8F5]">
                <div className="mx-auto max-w-6xl px-5 py-10 md:px-8">
                    <div className="h-8 w-40 animate-pulse rounded-lg bg-white border border-[#8B1A1A]/20" />

                    <div className="mt-8 grid gap-6 lg:grid-cols-3">
                        <div className="h-72 animate-pulse rounded-2xl bg-white border border-[#8B1A1A]/20" />
                        <div className="h-72 animate-pulse rounded-2xl bg-white border border-[#8B1A1A]/20 lg:col-span-2" />
                    </div>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-[#FDF8F5]">
                <div className="mx-auto max-w-6xl px-5 py-10 md:px-8">

                    <Link
                        to="/admin/users"
                        className="inline-flex items-center gap-2 font-bold text-[#8B1A1A] hover:text-[#6B1515]"
                    >
                        <ArrowLeft size={18} />
                        Back to Users
                    </Link>

                    <div className="mt-8 rounded-2xl border border-red-100 bg-white p-8 text-center shadow-sm">
                        <AlertCircle
                            size={40}
                            className="mx-auto text-red-500"
                        />

                        <h2 className="mt-4 text-xl font-extrabold text-[#2D1B0E]">
                            Unable to load user
                        </h2>

                        <p className="mt-2 text-[#6A5A4A]">
                            {error}
                        </p>

                        <button
                            onClick={loadUser}
                            className="mt-6 rounded-xl bg-[#8B1A1A] px-5 py-3 text-sm font-bold text-white shadow-lg shadow-[#8B1A1A]/20 transition hover:bg-[#6B1515] hover:shadow-xl hover:shadow-[#8B1A1A]/30"
                        >
                            Try Again
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    if (!user) {
        return null;
    }

    const profile = user.profile || {};

    return (
        <AdminLayout>

            {/* =====================================================
                TOP BAR - DEEP REDISH
            ====================================================== */}

            <header className="sticky top-0 z-30 border-b border-[#8B1A1A]/20 bg-white/95 backdrop-blur">
                <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-5 md:px-8">

                    <Link
                        to="/admin/users"
                        className="inline-flex items-center gap-2 text-sm font-bold text-[#2D1B0E] transition hover:text-[#8B1A1A]"
                    >
                        <ArrowLeft size={18} />
                        Back to Users
                    </Link>

                    <div className="flex items-center gap-3">

                        <span
                            className={`inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-xs font-bold ${
                                user.is_active
                                    ? "bg-green-50 text-green-600"
                                    : "bg-red-50 text-red-600"
                            }`}
                        >
                            {user.is_active ? (
                                <CheckCircle2 size={14} />
                            ) : (
                                <XCircle size={14} />
                            )}

                            {user.is_active
                                ? "Active"
                                : "Inactive"}
                        </span>

                    </div>
                </div>
            </header>

            {/* =====================================================
                CONTENT
            ====================================================== */}

            <main className="mx-auto max-w-7xl px-5 py-8 md:px-8">

                {/* PAGE HEADER */}

                <div className="mb-8">

                    <p className="text-sm font-bold uppercase tracking-[0.2em] text-[#8B1A1A]">
                        Customer Management
                    </p>

                    <h1 className="mt-2 text-3xl font-extrabold text-[#2D1B0E] md:text-4xl">
                        User Details
                    </h1>

                    <p className="mt-2 text-[#6A5A4A]">
                        View and manage this customer's account.
                    </p>

                </div>

                {/* =================================================
                    PROFILE HEADER - DEEP REDISH
                ================================================== */}

                <section className="overflow-hidden rounded-2xl border border-[#8B1A1A]/20 bg-white shadow-sm">

                    <div className="h-28 bg-gradient-to-r from-[#4A0E0E] to-[#8B1A1A]" />

                    <div className="px-5 pb-6 md:px-8">

                        <div className="-mt-12 flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">

                            <div className="flex items-end gap-4">

                                <div className="flex h-24 w-24 items-center justify-center overflow-hidden rounded-2xl border-4 border-white bg-[#8B1A1A]/10 shadow-lg">

                                    {profile.profile_image ? (
                                        <img
                                            src={profile.profile_image}
                                            alt={user.full_name}
                                            className="h-full w-full object-cover"
                                        />
                                    ) : (
                                        <User
                                            size={42}
                                            className="text-[#8B1A1A]"
                                        />
                                    )}

                                </div>

                                <div className="pb-1">

                                    <h2 className="text-2xl font-extrabold text-[#2D1B0E]">
                                        {user.full_name}
                                    </h2>

                                    <p className="text-sm text-[#8A7A6A]">
                                        @{user.username}
                                    </p>

                                </div>

                            </div>

                            <div className="flex flex-wrap gap-3">

                                <button
                                    onClick={handleStatusChange}
                                    disabled={actionLoading}
                                    className={`inline-flex items-center gap-2 rounded-xl px-4 py-3 text-sm font-bold transition ${
                                        user.is_active
                                            ? "bg-orange-50 text-orange-600 hover:bg-orange-100"
                                            : "bg-green-50 text-green-600 hover:bg-green-100"
                                    }`}
                                >
                                    {actionLoading ? (
                                        <Loader2
                                            size={17}
                                            className="animate-spin"
                                        />
                                    ) : user.is_active ? (
                                        <ShieldOff size={17} />
                                    ) : (
                                        <ShieldCheck size={17} />
                                    )}

                                    {user.is_active
                                        ? "Deactivate"
                                        : "Activate"}
                                </button>

                                <button
                                    onClick={handleDelete}
                                    disabled={actionLoading}
                                    className="inline-flex items-center gap-2 rounded-xl bg-red-50 px-4 py-3 text-sm font-bold text-red-600 transition hover:bg-red-100"
                                >
                                    <Trash2 size={17} />
                                    Delete User
                                </button>

                            </div>

                        </div>

                    </div>

                </section>

                {/* =================================================
                    STATISTICS - DEEP REDISH
                ================================================== */}

                <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">

                    <StatCardRed
                        icon={ShoppingBag}
                        title="Orders"
                        value={user.order_count ?? user.orders_count ?? 0}
                        link={`/admin/users/${user.id}/orders`}
                    />

                    <StatCardRed
                        icon={MessageCircle}
                        title="Inquiries"
                        value={
                            user.inquiry_count ??
                            user.inquiries_count ??
                            0
                        }
                        link={`/admin/users/${user.id}/inquiries`}
                    />

                    <StatCardRed
                        icon={ShieldCheck}
                        title="Account Status"
                        value={
                            user.is_active
                                ? "Active"
                                : "Inactive"
                        }
                    />

                </div>

                {/* =================================================
                    DETAILS - DEEP REDISH
                ================================================== */}

                <div className="mt-6 grid gap-6 lg:grid-cols-2">

                    {/* CUSTOMER INFORMATION */}

                    <section className="rounded-2xl border border-[#8B1A1A]/20 bg-white p-6 shadow-sm">

                        <h2 className="text-lg font-extrabold text-[#2D1B0E]">
                            Customer Information
                        </h2>

                        <p className="mt-1 text-sm text-[#6A5A4A]">
                            Personal and contact information.
                        </p>

                        <div className="mt-6 space-y-5">

                            <InfoRowRed
                                icon={User}
                                label="Full Name"
                                value={user.full_name}
                            />

                            <InfoRowRed
                                icon={Mail}
                                label="Email"
                                value={user.email || "Not provided"}
                            />

                            <InfoRowRed
                                icon={Phone}
                                label="Phone"
                                value={
                                    profile.phone ||
                                    "Not provided"
                                }
                            />

                            <InfoRowRed
                                icon={MapPin}
                                label="Address"
                                value={
                                    profile.address ||
                                    "Not provided"
                                }
                            />

                            <InfoRowRed
                                icon={MapPin}
                                label="City"
                                value={
                                    profile.city ||
                                    "Not provided"
                                }
                            />

                            <InfoRowRed
                                icon={MapPin}
                                label="Country"
                                value={
                                    profile.country ||
                                    "Tanzania"
                                }
                            />

                        </div>

                    </section>

                    {/* ACCOUNT INFORMATION */}

                    <section className="rounded-2xl border border-[#8B1A1A]/20 bg-white p-6 shadow-sm">

                        <h2 className="text-lg font-extrabold text-[#2D1B0E]">
                            Account Information
                        </h2>

                        <p className="mt-1 text-sm text-[#6A5A4A]">
                            Account activity and registration details.
                        </p>

                        <div className="mt-6 space-y-5">

                            <InfoRowRed
                                icon={User}
                                label="Username"
                                value={`@${user.username}`}
                            />

                            <InfoRowRed
                                icon={CalendarDays}
                                label="Joined"
                                value={formatDate(user.date_joined)}
                            />

                            <InfoRowRed
                                icon={Clock}
                                label="Last Login"
                                value={formatDateTime(user.last_login)}
                            />

                            <InfoRowRed
                                icon={
                                    user.is_active
                                        ? CheckCircle2
                                        : XCircle
                                }
                                label="Account Status"
                                value={
                                    user.is_active
                                        ? "Active"
                                        : "Inactive"
                                }
                            />

                        </div>

                    </section>

                </div>

                {/* =================================================
                    QUICK ACTIONS - DEEP REDISH
                ================================================== */}

                <section className="mt-6 rounded-2xl border border-[#8B1A1A]/20 bg-white p-6 shadow-sm">

                    <h2 className="text-lg font-extrabold text-[#2D1B0E]">
                        Customer Activity
                    </h2>

                    <p className="mt-1 text-sm text-[#6A5A4A]">
                        Quickly access this customer's activity.
                    </p>

                    <div className="mt-5 grid gap-4 sm:grid-cols-2">

                        <Link
                            to={`/admin/users/${user.id}/orders`}
                            className="group flex items-center justify-between rounded-xl border border-[#8B1A1A]/20 p-4 transition hover:border-[#8B1A1A] hover:bg-[#FDF8F5]"
                        >
                            <div className="flex items-center gap-4">

                                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#8B1A1A]/10">
                                    <ShoppingBag
                                        size={20}
                                        className="text-[#8B1A1A]"
                                    />
                                </div>

                                <div>
                                    <h3 className="font-extrabold text-[#2D1B0E]">
                                        Customer Orders
                                    </h3>

                                    <p className="text-sm text-[#6A5A4A]">
                                        {user.order_count ??
                                            user.orders_count ??
                                            0}{" "}
                                        orders
                                    </p>
                                </div>

                            </div>

                            <ArrowIconRed />

                        </Link>

                        <Link
                            to={`/admin/users/${user.id}/inquiries`}
                            className="group flex items-center justify-between rounded-xl border border-[#8B1A1A]/20 p-4 transition hover:border-[#8B1A1A] hover:bg-[#FDF8F5]"
                        >
                            <div className="flex items-center gap-4">

                                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#8B1A1A]/10">
                                    <MessageCircle
                                        size={20}
                                        className="text-[#8B1A1A]"
                                    />
                                </div>

                                <div>
                                    <h3 className="font-extrabold text-[#2D1B0E]">
                                        Customer Inquiries
                                    </h3>

                                    <p className="text-sm text-[#6A5A4A]">
                                        {user.inquiry_count ??
                                            user.inquiries_count ??
                                            0}{" "}
                                        inquiries
                                    </p>
                                </div>

                            </div>

                            <ArrowIconRed />

                        </Link>

                    </div>

                </section>

            </main>
        </AdminLayout>
    );
}


/* ================================================================
   STAT CARD - DEEP REDISH
================================================================ */

function StatCardRed({
    icon: Icon,
    title,
    value,
    link,
}) {
    const content = (
        <div className="flex items-center gap-4 rounded-2xl border border-[#8B1A1A]/15 bg-white p-5 shadow-sm transition hover:border-[#8B1A1A]/30 hover:shadow-md">

            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#8B1A1A]/10">
                <Icon
                    size={22}
                    className="text-[#8B1A1A]"
                />
            </div>

            <div>
                <p className="text-sm font-semibold text-[#6A5A4A]">
                    {title}
                </p>

                <p className="mt-1 text-2xl font-extrabold text-[#2D1B0E]">
                    {value}
                </p>
            </div>

        </div>
    );

    return link ? (
        <Link to={link}>
            {content}
        </Link>
    ) : (
        content
    );
}


/* ================================================================
   INFO ROW - DEEP REDISH
================================================================ */

function InfoRowRed({
    icon: Icon,
    label,
    value,
}) {
    return (
        <div className="flex items-start gap-4">

            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#8B1A1A]/10">
                <Icon
                    size={18}
                    className="text-[#8B1A1A]"
                />
            </div>

            <div className="min-w-0">
                <p className="text-xs font-bold uppercase tracking-wide text-[#8A7A6A]">
                    {label}
                </p>

                <p className="mt-1 break-words font-bold text-[#2D1B0E]">
                    {value}
                </p>
            </div>

        </div>
    );
}


/* ================================================================
   ARROW - DEEP REDISH
================================================================ */

function ArrowIconRed() {
    return (
        <div className="text-[#8A7A6A] transition group-hover:translate-x-1 group-hover:text-[#8B1A1A]">
            →
        </div>
    );
}

export default AdminUserDetails;