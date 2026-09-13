import AdminLayout from "../../layouts/AdminLayout";

import {
    useEffect,
    useMemo,
    useState,
} from "react";

import {
    Search,
    Users,
    UserCheck,
    UserX,
    Package,
    MessageCircle,
    Eye,
    Trash2,
    RefreshCw,
    UserCircle,
    Mail,
    Phone,
    MapPin,
    CalendarDays,
    X,
} from "lucide-react";

import { Link } from "react-router-dom";

import { BACKEND_URL } from "../../config";

import api from "../../services/api";


function AdminUsers() {

    // ========================================================
    // STATE
    // ========================================================

    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [search, setSearch] = useState("");
    const [statusFilter, setStatusFilter] = useState("all");
    const [actionLoading, setActionLoading] = useState(null);
    const [deleteUser, setDeleteUser] = useState(null);


    // ========================================================
    // LOAD CUSTOMERS
    // ========================================================

    const loadUsers = async () => {

        try {

            setLoading(true);
            setError("");

            const params = {};

            if (search.trim()) {
                params.search = search.trim();
            }

            if (statusFilter !== "all") {
                params.status = statusFilter;
            }

            const response = await api.get(
                "/auth/admin/customers/",
                {
                    params,
                }
            );

            const data = Array.isArray(response.data)
                ? response.data
                : response.data.results || [];

            setUsers(data);

        } catch (err) {

            console.error(
                "Admin customers loading error:",
                err
            );

            console.error(
                "Response:",
                err.response?.data
            );

            setError(
                err.response?.data?.detail ||
                "Unable to load customers."
            );

        } finally {

            setLoading(false);

        }
    };


    // ========================================================
    // INITIAL LOAD + SEARCH
    // ========================================================

    useEffect(() => {

        const timer = setTimeout(() => {
            loadUsers();
        }, 350);

        return () => clearTimeout(timer);

    }, [search, statusFilter]);


    // ========================================================
    // STATISTICS
    // ========================================================

    const statistics = useMemo(() => {

        const total = users.length;
        const active = users.filter((user) => user.is_active).length;
        const inactive = users.filter((user) => !user.is_active).length;
        const orders = users.reduce(
            (sum, user) => sum + Number(user.order_count || 0),
            0
        );
        const inquiries = users.reduce(
            (sum, user) => sum + Number(user.inquiry_count || 0),
            0
        );

        return {
            total,
            active,
            inactive,
            orders,
            inquiries,
        };

    }, [users]);


    // ========================================================
    // TOGGLE CUSTOMER STATUS
    // ========================================================

    const handleToggleStatus = async (user) => {

        try {

            setActionLoading(`status-${user.id}`);

            const newStatus = !user.is_active;

            await api.patch(
                `/auth/admin/customers/${user.id}/status/`,
                {
                    is_active: newStatus,
                }
            );

            setUsers((currentUsers) =>
                currentUsers.map((item) =>
                    item.id === user.id
                        ? { ...item, is_active: newStatus }
                        : item
                )
            );

        } catch (err) {

            console.error("Status update error:", err);
            setError(
                err.response?.data?.detail ||
                "Unable to update customer status."
            );

        } finally {

            setActionLoading(null);

        }
    };


    // ========================================================
    // DELETE CUSTOMER
    // ========================================================

    const handleDelete = async () => {

        if (!deleteUser) return;

        try {

            setActionLoading(`delete-${deleteUser.id}`);

            await api.delete(
                `/auth/admin/customers/${deleteUser.id}/delete/`
            );

            setUsers((currentUsers) =>
                currentUsers.filter(
                    (user) => user.id !== deleteUser.id
                )
            );

            setDeleteUser(null);

        } catch (err) {

            console.error("Delete customer error:", err);
            setError(
                err.response?.data?.detail ||
                "Unable to delete customer."
            );

        } finally {

            setActionLoading(null);

        }
    };


    // ========================================================
    // FORMAT DATE
    // ========================================================

    const formatDate = (date) => {

        if (!date) {
            return "—";
        }

        return new Date(date).toLocaleDateString(
            "en-GB",
            {
                day: "2-digit",
                month: "short",
                year: "numeric",
            }
        );
    };


    // ========================================================
    // PROFILE IMAGE
    // ========================================================

    const getProfileImage = (user) => {

        const image = user.profile?.profile_image;

        if (!image) {
            return null;
        }

        if (image.startsWith("http://") || image.startsWith("https://")) {
            return image;
        }

        return `${BACKEND_URL}${image}`;
    };


    // ========================================================
    // CLEAR SEARCH
    // ========================================================

    const clearSearch = () => {
        setSearch("");
    };


    // ========================================================
    // RENDER
    // ========================================================

    return (

        <AdminLayout>

           

            <header className="border-b border-[#8B1A1A]/20 bg-white">

                <div className="mx-auto max-w-7xl px-5 py-6 md:px-8">

                    <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">

                        <div>

                            <p className="text-sm font-bold uppercase tracking-[0.2em] text-[#8B1A1A]">
                                Management
                            </p>

                            <h1 className="mt-2 text-3xl font-extrabold text-[#2D1B0E] md:text-4xl">
                                Customers
                            </h1>

                            <p className="mt-2 text-[#6A5A4A]">
                                Manage customer accounts,
                                activity and access.
                            </p>

                        </div>


                        <button
                            onClick={loadUsers}
                            disabled={loading}
                            className="inline-flex w-fit items-center gap-2 rounded-xl border border-[#8B1A1A]/20 bg-white px-4 py-3 text-sm font-bold text-[#2D1B0E] shadow-sm transition hover:border-[#8B1A1A]/30 hover:bg-[#FDF8F5] disabled:opacity-50"
                        >

                            <RefreshCw
                                size={17}
                                className={loading ? "animate-spin" : ""}
                            />

                            Refresh

                        </button>

                    </div>

                </div>

            </header>



            <main className="mx-auto max-w-7xl px-5 py-8 md:px-8">

                {error && (

                    <div className="mb-6 flex items-start justify-between rounded-xl border border-red-100 bg-red-50 px-4 py-4 text-sm font-semibold text-red-600">

                        <span>
                            {error}
                        </span>

                        <button
                            onClick={() => setError("")}
                            className="ml-4 rounded-lg p-1 hover:bg-red-100"
                        >

                            <X size={17} />

                        </button>

                    </div>

                )}


                <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">

                    <StatCardRed
                        title="Total Customers"
                        value={loading ? "..." : statistics.total}
                        icon={Users}
                        description="Registered customers"
                    />

                    <StatCardRed
                        title="Active"
                        value={loading ? "..." : statistics.active}
                        icon={UserCheck}
                        description="Active accounts"
                    />

                    <StatCardRed
                        title="Inactive"
                        value={loading ? "..." : statistics.inactive}
                        icon={UserX}
                        description="Deactivated accounts"
                    />

                    <StatCardRed
                        title="Total Orders"
                        value={loading ? "..." : statistics.orders}
                        icon={Package}
                        description="Customer orders"
                    />

                </div>


               

                <div className="mt-5 grid gap-5 md:grid-cols-2">

                    <MiniStatRed
                        icon={MessageCircle}
                        title="Customer Inquiries"
                        value={loading ? "..." : statistics.inquiries}
                    />

                    <MiniStatRed
                        icon={UserCircle}
                        title="Customer Accounts"
                        value={loading ? "..." : statistics.total}
                    />

                </div>


                <section className="mt-8 rounded-2xl border border-[#8B1A1A]/20 bg-white p-5 shadow-sm">

                    <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">

                        <div className="relative w-full lg:max-w-xl">

                            <Search
                                size={19}
                                className="absolute left-4 top-1/2 -translate-y-1/2 text-[#8A7A6A]"
                            />

                            <input
                                type="text"
                                value={search}
                                onChange={(event) =>
                                    setSearch(event.target.value)
                                }
                                placeholder="Search by name, username, email or phone..."
                                className="w-full rounded-xl border border-[#8B1A1A]/20 bg-[#FDF8F5] py-3.5 pl-11 pr-11 text-sm font-medium text-[#2D1B0E] outline-none transition placeholder:text-[#8A7A6A] focus:border-[#8B1A1A] focus:ring-4 focus:ring-[#8B1A1A]/10"
                            />

                            {search && (

                                <button
                                    onClick={clearSearch}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 rounded-lg p-1.5 text-[#8A7A6A] hover:bg-[#8B1A1A]/5 hover:text-[#2D1B0E]"
                                >

                                    <X size={17} />

                                </button>

                            )}

                        </div>


                        <div className="flex rounded-xl border border-[#8B1A1A]/20 bg-[#FDF8F5] p-1">

                            <FilterButtonRed
                                active={statusFilter === "all"}
                                onClick={() => setStatusFilter("all")}
                                label="All"
                            />

                            <FilterButtonRed
                                active={statusFilter === "active"}
                                onClick={() => setStatusFilter("active")}
                                label="Active"
                            />

                            <FilterButtonRed
                                active={statusFilter === "inactive"}
                                onClick={() => setStatusFilter("inactive")}
                                label="Inactive"
                            />

                        </div>

                    </div>

                </section>



                <section className="mt-6 overflow-hidden rounded-2xl border border-[#8B1A1A]/20 bg-white shadow-sm">

                    <div className="flex flex-col gap-2 border-b border-[#8B1A1A]/10 px-5 py-5 md:flex-row md:items-center md:justify-between">

                        <div>

                            <h2 className="text-lg font-extrabold text-[#2D1B0E]">
                                Customer Accounts
                            </h2>

                            <p className="mt-1 text-sm text-[#6A5A4A]">
                                {loading
                                    ? "Loading customers..."
                                    : `${users.length} customer${users.length === 1 ? "" : "s"} found`
                                }
                            </p>

                        </div>

                    </div>



                    {loading ? (

                        <div className="divide-y divide-[#8B1A1A]/10">

                            {[1, 2, 3, 4, 5].map((item) => (

                                <div
                                    key={item}
                                    className="flex items-center gap-4 px-5 py-5"
                                >

                                    <div className="h-12 w-12 animate-pulse rounded-full bg-[#8B1A1A]/10" />

                                    <div className="flex-1">

                                        <div className="h-4 w-40 animate-pulse rounded bg-[#8B1A1A]/10" />

                                        <div className="mt-2 h-3 w-56 animate-pulse rounded bg-[#FDF8F5]" />

                                    </div>

                                </div>

                            ))}

                        </div>

                    ) : users.length === 0 ? (

                        <div className="px-5 py-20 text-center">

                            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-[#8B1A1A]/10">

                                <Users
                                    size={30}
                                    className="text-[#8B1A1A]"
                                />

                            </div>

                            <h3 className="mt-5 text-lg font-extrabold text-[#2D1B0E]">
                                No customers found
                            </h3>

                            <p className="mx-auto mt-2 max-w-md text-sm text-[#6A5A4A]">
                                Try changing your search
                                or filter to find
                                customer accounts.
                            </p>

                        </div>

                    ) : (

                        <div className="overflow-x-auto">

                            <table className="w-full min-w-[1050px]">

                                <thead>

                                    <tr className="border-b border-[#8B1A1A]/10 bg-[#FDF8F5]">

                                        <TableHeaderRed>
                                            Customer
                                        </TableHeaderRed>

                                        <TableHeaderRed>
                                            Contact
                                        </TableHeaderRed>

                                        <TableHeaderRed>
                                            Location
                                        </TableHeaderRed>

                                        <TableHeaderRed center>
                                            Activity
                                        </TableHeaderRed>

                                        <TableHeaderRed>
                                            Joined
                                        </TableHeaderRed>

                                        <TableHeaderRed>
                                            Status
                                        </TableHeaderRed>

                                        <TableHeaderRed right>
                                            Actions
                                        </TableHeaderRed>

                                    </tr>

                                </thead>


                                <tbody className="divide-y divide-[#8B1A1A]/10">

                                    {users.map((user) => (

                                        <UserRowRed
                                            key={user.id}
                                            user={user}
                                            image={getProfileImage(user)}
                                            formatDate={formatDate}
                                            actionLoading={actionLoading}
                                            onToggleStatus={handleToggleStatus}
                                            onDelete={setDeleteUser}
                                        />

                                    ))}

                                </tbody>

                            </table>

                        </div>

                    )}

                </section>

            </main>


            {deleteUser && (

                <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#2D1B0E]/40 px-5 backdrop-blur-sm">

                    <div className="w-full max-w-md rounded-2xl border border-[#8B1A1A]/20 bg-white p-6 shadow-2xl">

                        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-red-50">

                            <Trash2
                                size={22}
                                className="text-red-500"
                            />

                        </div>

                        <h2 className="mt-5 text-xl font-extrabold text-[#2D1B0E]">
                            Delete Customer?
                        </h2>

                        <p className="mt-2 text-sm leading-6 text-[#6A5A4A]">

                            You are about to permanently
                            delete{" "}

                            <span className="font-bold text-[#2D1B0E]">

                                {deleteUser.full_name ||
                                    deleteUser.username}

                            </span>

                            . This action cannot be undone.

                        </p>

                        <div className="mt-6 flex gap-3">

                            <button
                                onClick={() => setDeleteUser(null)}
                                className="flex-1 rounded-xl border border-[#8B1A1A]/20 px-4 py-3 text-sm font-bold text-[#2D1B0E] transition hover:bg-[#FDF8F5]"
                            >
                                Cancel
                            </button>

                            <button
                                onClick={handleDelete}
                                disabled={actionLoading === `delete-${deleteUser.id}`}
                                className="flex-1 rounded-xl bg-red-500 px-4 py-3 text-sm font-bold text-white transition hover:bg-red-600 disabled:opacity-50"
                            >

                                {actionLoading === `delete-${deleteUser.id}`
                                    ? "Deleting..."
                                    : "Delete Customer"}

                            </button>

                        </div>

                    </div>

                </div>

            )}

        </AdminLayout>
    );
}


// ============================================================
// TABLE HEADER - DEEP REDISH
// ============================================================

function TableHeaderRed({
    children,
    center,
    right,
}) {

    return (

        <th
            className={`px-5 py-4 text-[11px] font-extrabold uppercase tracking-wider text-[#8A7A6A] ${
                center
                    ? "text-center"
                    : right
                    ? "text-right"
                    : "text-left"
            }`}
        >
            {children}
        </th>

    );
}


// ============================================================
// STAT CARD - DEEP REDISH
// ============================================================

function StatCardRed({
    title,
    value,
    icon: Icon,
    description,
}) {

    return (

        <div className="rounded-2xl border border-[#8B1A1A]/15 bg-white p-5 shadow-sm transition duration-300 hover:-translate-y-1 hover:border-[#8B1A1A]/30 hover:shadow-md">

            <div className="flex items-start justify-between">

                <div>

                    <p className="text-sm font-semibold text-[#6A5A4A]">
                        {title}
                    </p>

                    <p className="mt-2 text-3xl font-extrabold text-[#2D1B0E]">
                        {value}
                    </p>

                    <p className="mt-2 text-xs text-[#8A7A6A]">
                        {description}
                    </p>

                </div>

                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#8B1A1A]/10">

                    <Icon
                        size={22}
                        className="text-[#8B1A1A]"
                    />

                </div>

            </div>

        </div>

    );
}


// ============================================================
// MINI STAT - DEEP REDISH
// ============================================================

function MiniStatRed({
    icon: Icon,
    title,
    value,
}) {

    return (

        <div className="flex items-center gap-4 rounded-2xl border border-[#8B1A1A]/15 bg-white p-5 shadow-sm">

            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#8B1A1A]/10">

                <Icon
                    size={20}
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
}


// ============================================================
// FILTER BUTTON - DEEP REDISH
// ============================================================

function FilterButtonRed({
    active,
    onClick,
    label,
}) {

    return (

        <button
            onClick={onClick}
            className={`
                rounded-lg px-4 py-2 text-sm font-bold transition
                ${
                    active
                        ? "bg-[#8B1A1A] text-white shadow-sm"
                        : "text-[#6A5A4A] hover:bg-white hover:text-[#2D1B0E]"
                }
            `}
        >
            {label}
        </button>

    );
}


// ============================================================
// USER ROW - DEEP REDISH
// ============================================================

function UserRowRed({
    user,
    image,
    formatDate,
    actionLoading,
    onToggleStatus,
    onDelete,
}) {

    return (

        <tr className="transition hover:bg-[#FDF8F5]">

            {/* CUSTOMER */}

            <td className="px-5 py-4">

                <div className="flex items-center gap-3">

                    <div className="h-12 w-12 shrink-0 overflow-hidden rounded-full bg-[#8B1A1A]/10">

                        {image ? (

                            <img
                                src={image}
                                alt={user.full_name || user.username}
                                className="h-full w-full object-cover"
                                onError={(event) => {
                                    event.currentTarget.style.display = "none";
                                }}
                            />

                        ) : (

                            <div className="flex h-full w-full items-center justify-center">

                                <UserCircle
                                    size={26}
                                    className="text-[#8B1A1A]"
                                />

                            </div>

                        )}

                    </div>


                    <div className="min-w-0">

                        <p className="truncate font-extrabold text-[#2D1B0E]">

                            {user.full_name || user.username}

                        </p>

                        <p className="mt-0.5 text-xs text-[#8A7A6A]">

                            @{user.username}

                        </p>

                    </div>

                </div>

            </td>


            {/* CONTACT */}

            <td className="px-5 py-4">

                <div className="space-y-1.5">

                    <div className="flex items-center gap-2 text-xs text-[#6A5A4A]">

                        <Mail
                            size={14}
                            className="text-[#8B1A1A]"
                        />

                        <span className="max-w-[190px] truncate">

                            {user.email || "No email"}

                        </span>

                    </div>


                    <div className="flex items-center gap-2 text-xs text-[#8A7A6A]">

                        <Phone size={13} />

                        {user.profile?.phone || "No phone"}

                    </div>

                </div>

            </td>


            {/* LOCATION */}

            <td className="px-5 py-4">

                <div className="flex items-center gap-2 text-sm text-[#6A5A4A]">

                    <MapPin
                        size={15}
                        className="text-[#8B1A1A]"
                    />

                    <span>

                        {user.profile?.city ||
                            user.profile?.country ||
                            "Not provided"}

                    </span>

                </div>

            </td>


            {/* ACTIVITY */}

            <td className="px-5 py-4">

                <div className="flex justify-center gap-2">

                    <div className="rounded-xl bg-[#8B1A1A]/10 px-3 py-2 text-center">

                        <p className="text-sm font-extrabold text-[#2D1B0E]">
                            {user.order_count || 0}
                        </p>

                        <p className="text-[10px] font-bold uppercase text-[#8B1A1A]">
                            Orders
                        </p>

                    </div>


                    <div className="rounded-xl bg-[#FDF8F5] border border-[#8B1A1A]/10 px-3 py-2 text-center">

                        <p className="text-sm font-extrabold text-[#2D1B0E]">
                            {user.inquiry_count || 0}
                        </p>

                        <p className="text-[10px] font-bold uppercase text-[#8A7A6A]">
                            Inquiries
                        </p>

                    </div>

                </div>

            </td>


            {/* JOINED */}

            <td className="px-5 py-4">

                <div className="flex items-center gap-2 text-sm font-medium text-[#6A5A4A]">

                    <CalendarDays
                        size={15}
                        className="text-[#8B1A1A]"
                    />

                    {formatDate(user.date_joined)}

                </div>

            </td>


            {/* STATUS */}

            <td className="px-5 py-4">

                <button
                    onClick={() => onToggleStatus(user)}
                    disabled={actionLoading === `status-${user.id}`}
                    className={`
                        inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-xs font-extrabold transition
                        ${
                            user.is_active
                                ? "bg-emerald-50 text-emerald-600 hover:bg-emerald-100"
                                : "bg-red-50 text-red-500 hover:bg-red-100"
                        }
                    `}
                >

                    <span
                        className={`
                            h-2 w-2 rounded-full
                            ${user.is_active ? "bg-emerald-500" : "bg-red-500"}
                        `}
                    />

                    {actionLoading === `status-${user.id}`
                        ? "Updating..."
                        : user.is_active
                        ? "Active"
                        : "Inactive"}

                </button>

            </td>


            {/* ACTIONS */}

            <td className="px-5 py-4">

                <div className="flex items-center justify-end gap-2">

                    <Link
                        to={`/admin/users/${user.id}`}
                        className="inline-flex items-center gap-2 rounded-xl bg-[#8B1A1A]/10 px-3 py-2 text-xs font-extrabold text-[#8B1A1A] transition hover:bg-[#8B1A1A]/20"
                    >

                        <Eye size={15} />

                        View

                    </Link>


                    <button
                        onClick={() => onDelete(user)}
                        className="rounded-xl p-2 text-[#8A7A6A] transition hover:bg-red-50 hover:text-red-500"
                        title="Delete customer"
                    >

                        <Trash2 size={17} />

                    </button>

                </div>

            </td>

        </tr>

    );
}


export default AdminUsers;