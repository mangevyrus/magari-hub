import { useEffect, useMemo, useState } from "react";

import { Link, useNavigate } from "react-router-dom";
import AdminLayout from "../../layouts/AdminLayout";
import {
    CarFront,
    ClipboardList,
    LayoutDashboard,
    Plus,
    List,
    BarChart3,
    MessageCircle,
    Settings,
    Users,
    LogOut,
    Menu,
    X,
    Search,
    Eye,
    RefreshCw,
    ChevronDown,
    PackageCheck,
    Clock3,
    CheckCircle2,
    XCircle,
    Truck,
} from "lucide-react";

import {
    getAdminOrders,
} from "../../services/adminOrderService";


// ============================================================
// ADMIN ORDERS
// ============================================================

function AdminOrders() {

    const navigate = useNavigate();

    // ========================================================
    // STATE
    // ========================================================

    const [orders, setOrders] = useState([]);

    const [loading, setLoading] =
        useState(true);

    const [refreshing, setRefreshing] =
        useState(false);

    const [sidebarOpen, setSidebarOpen] =
        useState(false);

    const [error, setError] =
        useState("");

    const [search, setSearch] =
        useState("");

    const [statusFilter, setStatusFilter] =
        useState("all");


    // ========================================================
    // LOAD ORDERS
    // ========================================================

    const loadOrders = async (
        showRefreshing = false
    ) => {

        try {

            if (showRefreshing) {
                setRefreshing(true);
            } else {
                setLoading(true);
            }

            setError("");

            const data =
                await getAdminOrders();

            setOrders(
                Array.isArray(data)
                    ? data
                    : []
            );

        } catch (err) {

            console.error(
                "Failed to load admin orders:",
                err
            );

            setError(
                err.message ||
                "Unable to load orders."
            );

        } finally {

            setLoading(false);
            setRefreshing(false);
        }
    };


    // ========================================================
    // INITIAL LOAD
    // ========================================================

    useEffect(() => {

        loadOrders();

    }, []);


    // ========================================================
    // LOGOUT
    // ========================================================

    const handleLogout = () => {

        localStorage.removeItem(
            "access_token"
        );

        localStorage.removeItem(
            "refresh_token"
        );

        localStorage.removeItem(
            "admin_token"
        );

        navigate(
            "/admin/login"
        );
    };


    // ========================================================
    // FORMAT PRICE
    // ========================================================

    const formatPrice = (price) => {

        return Number(
            price || 0
        ).toLocaleString();
    };


    // ========================================================
    // FORMAT DATE
    // ========================================================

    const formatDate = (date) => {

        if (!date) {
            return "—";
        }

        try {

            return new Date(
                date
            ).toLocaleDateString(
                "en-GB",
                {
                    day: "2-digit",
                    month: "short",
                    year: "numeric",
                }
            );

        } catch {

            return "—";
        }
    };


    // ========================================================
    // FILTER ORDERS
    // ========================================================

    const filteredOrders =
        useMemo(() => {

            const query =
                search
                    .trim()
                    .toLowerCase();

            return orders.filter(
                (order) => {

                    const matchesSearch =
                        !query ||
                        String(
                            order.order_number || ""
                        )
                            .toLowerCase()
                            .includes(query) ||

                        String(
                            order.customer_username || ""
                        )
                            .toLowerCase()
                            .includes(query) ||

                        String(
                            order.customer_email || ""
                        )
                            .toLowerCase()
                            .includes(query) ||

                        String(
                            order.full_name || ""
                        )
                            .toLowerCase()
                            .includes(query) ||

                        String(
                            order.vehicle_name || ""
                        )
                            .toLowerCase()
                            .includes(query);


                    const matchesStatus =
                        statusFilter === "all" ||
                        order.status ===
                            statusFilter;


                    return (
                        matchesSearch &&
                        matchesStatus
                    );
                }
            );

        }, [
            orders,
            search,
            statusFilter,
        ]);


    // ========================================================
    // STATISTICS
    // ========================================================

    const statistics =
        useMemo(() => {

            const total =
                orders.length;

            const pending =
                orders.filter(
                    (order) =>
                        order.status ===
                        "pending"
                ).length;

            const confirmed =
                orders.filter(
                    (order) =>
                        order.status ===
                        "confirmed"
                ).length;

            const processing =
                orders.filter(
                    (order) =>
                        order.status ===
                        "processing"
                ).length;

            const completed =
                orders.filter(
                    (order) =>
                        order.status ===
                        "completed"
                ).length;

            const cancelled =
                orders.filter(
                    (order) =>
                        order.status ===
                        "cancelled"
                ).length;

            return {
                total,
                pending,
                confirmed,
                processing,
                completed,
                cancelled,
            };

        }, [orders]);


    // ========================================================
    // STATUS OPTIONS
    // ========================================================

    const statusOptions = [
        {
            value: "all",
            label: "All Orders",
        },
        {
            value: "pending",
            label: "Pending",
        },
        {
            value: "confirmed",
            label: "Confirmed",
        },
        {
            value: "processing",
            label: "Processing",
        },
        {
            value: "completed",
            label: "Completed",
        },
        {
            value: "cancelled",
            label: "Cancelled",
        },
    ];


    // ========================================================
    // STATUS BADGE
    // ========================================================

    const getStatusBadge = (
        status
    ) => {

        const normalized =
            String(
                status || ""
            ).toLowerCase();


        if (
            normalized ===
            "completed"
        ) {

            return (
                <span className="inline-flex items-center gap-1.5 rounded-full bg-green-50 px-3 py-1.5 text-xs font-bold capitalize text-green-600">
                    <CheckCircle2
                        size={14}
                    />
                    {status}
                </span>
            );
        }


        if (
            normalized ===
            "cancelled"
        ) {

            return (
                <span className="inline-flex items-center gap-1.5 rounded-full bg-red-50 px-3 py-1.5 text-xs font-bold capitalize text-red-600">
                    <XCircle
                        size={14}
                    />
                    {status}
                </span>
            );
        }


        if (
            normalized ===
            "processing"
        ) {

            return (
                <span className="inline-flex items-center gap-1.5 rounded-full bg-blue-50 px-3 py-1.5 text-xs font-bold capitalize text-blue-600">
                    <PackageCheck
                        size={14}
                    />
                    {status}
                </span>
            );
        }


        if (
            normalized ===
            "confirmed"
        ) {

            return (
                <span className="inline-flex items-center gap-1.5 rounded-full bg-purple-50 px-3 py-1.5 text-xs font-bold capitalize text-purple-600">
                    <CheckCircle2
                        size={14}
                    />
                    {status}
                </span>
            );
        }


        return (
            <span className="inline-flex items-center gap-1.5 rounded-full bg-yellow-50 px-3 py-1.5 text-xs font-bold capitalize text-yellow-600">
                <Clock3
                    size={14}
                />
                {status || "pending"}
            </span>
        );
    };


    // ========================================================
    // FULFILLMENT BADGE
    // ========================================================

    const getFulfillmentBadge = (
        method
    ) => {

        if (
            method === "delivery"
        ) {

            return (
                <span className="inline-flex items-center gap-1.5 text-xs font-bold text-[#8B1A1A]">
                    <Truck
                        size={15}
                    />
                    Delivery
                </span>
            );
        }

        return (
            <span className="inline-flex items-center gap-1.5 text-xs font-bold text-[#6A5A4A]">
                <CarFront
                    size={15}
                />
                Pickup
            </span>
        );
    };


    // ========================================================
    // RENDER
    // ========================================================

    return (

        <AdminLayout>

            {/* ==================================================
                MOBILE OVERLAY - DEEP REDISH
            ================================================== */}

            {sidebarOpen && (

                <div
                    className="fixed inset-0 z-40 bg-[#2D1B0E]/40 backdrop-blur-sm lg:hidden"
                    onClick={() =>
                        setSidebarOpen(false)
                    }
                />

            )}


            {/* ==================================================
                MAIN AREA
            ================================================== */}

            <div className="lg:pl-72">


                {/* ==================================================
                    TOP BAR - DEEP REDISH
                ================================================== */}

                <header className="sticky top-0 z-30 border-b border-[#8B1A1A]/20 bg-white/95 backdrop-blur">

                    <div className="flex h-20 items-center justify-between px-5 md:px-8">

                        <button
                            onClick={() =>
                                setSidebarOpen(true)
                            }
                            className="rounded-xl p-2 text-[#2D1B0E] hover:bg-[#8B1A1A]/5 lg:hidden"
                        >

                            <Menu
                                size={23}
                            />

                        </button>


                        <div className="hidden lg:block">

                            <p className="text-sm text-[#6A5A4A]">
                                Management
                            </p>

                            <h2 className="font-extrabold text-[#2D1B0E]">
                                Customer Orders
                            </h2>

                        </div>


                        <div className="flex items-center gap-3">

                            <button
                                onClick={() =>
                                    loadOrders(true)
                                }
                                disabled={
                                    refreshing
                                }
                                className="inline-flex items-center gap-2 rounded-xl border border-[#8B1A1A]/20 bg-white px-4 py-3 text-sm font-bold text-[#2D1B0E] transition hover:bg-[#FDF8F5] disabled:cursor-not-allowed disabled:opacity-60"
                            >

                                <RefreshCw
                                    size={17}
                                    className={
                                        refreshing
                                            ? "animate-spin"
                                            : ""
                                    }
                                />

                                <span className="hidden sm:inline">
                                    Refresh
                                </span>

                            </button>

                        </div>

                    </div>

                </header>


                {/* ==================================================
                    CONTENT
                ================================================== */}

                <main className="mx-auto max-w-7xl px-5 py-8 md:px-8">


                    {/* PAGE TITLE */}

                    <div className="mb-8">

                        <p className="text-sm font-bold uppercase tracking-[0.2em] text-[#8B1A1A]">
                            Management
                        </p>

                        <h1 className="mt-2 text-3xl font-extrabold text-[#2D1B0E] md:text-4xl">
                            Orders
                        </h1>

                        <p className="mt-2 text-[#6A5A4A]">
                            Manage customer vehicle orders
                            and track their progress.
                        </p>

                    </div>


                    {/* ERROR */}

                    {error && (

                        <div className="mb-6 rounded-xl border border-red-100 bg-red-50 p-4 text-sm font-semibold text-red-600">

                            {error}

                        </div>

                    )}


                    {/* ==================================================
                        STATISTICS - DEEP REDISH
                    ================================================== */}

                    <div className="mb-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">


                        <OrderStatRed
                            title="Total Orders"
                            value={
                                loading
                                    ? "..."
                                    : statistics.total
                            }
                            icon={
                                ClipboardList
                            }
                        />


                        <OrderStatRed
                            title="Pending"
                            value={
                                loading
                                    ? "..."
                                    : statistics.pending
                            }
                            icon={
                                Clock3
                            }
                        />


                        <OrderStatRed
                            title="Processing"
                            value={
                                loading
                                    ? "..."
                                    : statistics.processing
                            }
                            icon={
                                PackageCheck
                            }
                        />


                        <OrderStatRed
                            title="Completed"
                            value={
                                loading
                                    ? "..."
                                    : statistics.completed
                            }
                            icon={
                                CheckCircle2
                            }
                        />

                    </div>


                    {/* ==================================================
                        FILTERS - DEEP REDISH
                    ================================================== */}

                    <div className="mb-6 rounded-2xl border border-[#8B1A1A]/20 bg-white p-4 shadow-sm">

                        <div className="grid gap-4 md:grid-cols-[1fr_220px]">


                            {/* SEARCH */}

                            <div className="relative">

                                <Search
                                    size={19}
                                    className="absolute left-4 top-1/2 -translate-y-1/2 text-[#8A7A6A]"
                                />

                                <input
                                    type="text"
                                    value={search}
                                    onChange={(event) =>
                                        setSearch(
                                            event.target.value
                                        )
                                    }
                                    placeholder="Search order number, customer or vehicle..."
                                    className="w-full rounded-xl border border-[#8B1A1A]/20 bg-[#FDF8F5] py-3.5 pl-11 pr-4 text-sm outline-none transition focus:border-[#8B1A1A] focus:bg-white focus:ring-4 focus:ring-[#8B1A1A]/10"
                                />

                            </div>


                            {/* STATUS */}

                            <div className="relative">

                                <select
                                    value={
                                        statusFilter
                                    }
                                    onChange={(
                                        event
                                    ) =>
                                        setStatusFilter(
                                            event.target.value
                                        )
                                    }
                                    className="w-full appearance-none rounded-xl border border-[#8B1A1A]/20 bg-[#FDF8F5] px-4 py-3.5 pr-10 text-sm font-semibold text-[#2D1B0E] outline-none transition focus:border-[#8B1A1A] focus:bg-white focus:ring-4 focus:ring-[#8B1A1A]/10"
                                >

                                    {statusOptions.map(
                                        (
                                            option
                                        ) => (

                                            <option
                                                key={
                                                    option.value
                                                }
                                                value={
                                                    option.value
                                                }
                                            >
                                                {
                                                    option.label
                                                }
                                            </option>

                                        )
                                    )}

                                </select>


                                <ChevronDown
                                    size={17}
                                    className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-[#8A7A6A]"
                                />

                            </div>

                        </div>

                    </div>


                    {/* ==================================================
                        ORDERS TABLE - DEEP REDISH
                    ================================================== */}

                    <section className="overflow-hidden rounded-2xl border border-[#8B1A1A]/20 bg-white shadow-sm">


                        {/* TABLE HEADER */}

                        <div className="flex items-center justify-between border-b border-[#8B1A1A]/10 px-5 py-5">

                            <div>

                                <h2 className="text-lg font-extrabold text-[#2D1B0E]">
                                    Customer Orders
                                </h2>

                                <p className="mt-1 text-sm text-[#6A5A4A]">

                                    Showing{" "}
                                    <span className="font-bold text-[#8B1A1A]">
                                        {
                                            filteredOrders.length
                                        }
                                    </span>{" "}
                                    of{" "}
                                    <span className="font-bold text-[#8B1A1A]">
                                        {
                                            orders.length
                                        }
                                    </span>{" "}
                                    orders

                                </p>

                            </div>

                        </div>


                        {/* LOADING */}

                        {loading ? (

                            <div className="space-y-3 p-5">

                                {[
                                    1,
                                    2,
                                    3,
                                    4,
                                    5,
                                ].map(
                                    (item) => (

                                        <div
                                            key={
                                                item
                                            }
                                            className="h-20 animate-pulse rounded-xl bg-[#FDF8F5] border border-[#8B1A1A]/10"
                                        />

                                    )
                                )}

                            </div>

                        ) : filteredOrders.length === 0 ? (

                            /* EMPTY */

                            <div className="px-5 py-20 text-center">

                                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-[#8B1A1A]/10">

                                    <ClipboardList
                                        size={30}
                                        className="text-[#8B1A1A]"
                                    />

                                </div>

                                <h3 className="mt-5 text-lg font-extrabold text-[#2D1B0E]">
                                    No orders found
                                </h3>

                                <p className="mt-2 text-sm text-[#6A5A4A]">

                                    {search ||
                                    statusFilter !==
                                        "all"

                                        ? "Try changing your search or filter."

                                        : "There are no customer orders yet."
                                    }

                                </p>

                            </div>

                        ) : (

                            <>

                                {/* DESKTOP TABLE */}

                                <div className="hidden overflow-x-auto lg:block">

                                    <table className="w-full">

                                        <thead>

                                            <tr className="border-b border-[#8B1A1A]/10 bg-[#FDF8F5]">

                                                <th className="px-5 py-4 text-left text-xs font-extrabold uppercase tracking-wider text-[#8A7A6A]">
                                                    Order
                                                </th>

                                                <th className="px-5 py-4 text-left text-xs font-extrabold uppercase tracking-wider text-[#8A7A6A]">
                                                    Customer
                                                </th>

                                                <th className="px-5 py-4 text-left text-xs font-extrabold uppercase tracking-wider text-[#8A7A6A]">
                                                    Vehicle
                                                </th>

                                                <th className="px-5 py-4 text-left text-xs font-extrabold uppercase tracking-wider text-[#8A7A6A]">
                                                    Price
                                                </th>

                                                <th className="px-5 py-4 text-left text-xs font-extrabold uppercase tracking-wider text-[#8A7A6A]">
                                                    Status
                                                </th>

                                                <th className="px-5 py-4 text-left text-xs font-extrabold uppercase tracking-wider text-[#8A7A6A]">
                                                    Fulfillment
                                                </th>

                                                <th className="px-5 py-4 text-left text-xs font-extrabold uppercase tracking-wider text-[#8A7A6A]">
                                                    Date
                                                </th>

                                                <th className="px-5 py-4 text-right text-xs font-extrabold uppercase tracking-wider text-[#8A7A6A]">
                                                    Action
                                                </th>

                                            </tr>

                                        </thead>


                                        <tbody>

                                            {filteredOrders.map(
                                                (
                                                    order
                                                ) => (

                                                    <tr
                                                        key={
                                                            order.id
                                                        }
                                                        className="border-b border-[#8B1A1A]/10 transition last:border-b-0 hover:bg-[#FDF8F5]"
                                                    >

                                                        {/* ORDER */}

                                                        <td className="px-5 py-4">

                                                            <p className="font-extrabold text-[#2D1B0E]">
                                                                {
                                                                    order.order_number ||
                                                                    `#${order.id}`
                                                                }
                                                            </p>

                                                            <p className="mt-1 text-xs text-[#8A7A6A]">
                                                                ID:{" "}
                                                                {
                                                                    order.id
                                                                }
                                                            </p>

                                                        </td>


                                                        {/* CUSTOMER */}

                                                        <td className="px-5 py-4">

                                                            <p className="font-bold text-[#2D1B0E]">
                                                                {
                                                                    order.full_name ||
                                                                    order.customer_username ||
                                                                    "—"
                                                                }
                                                            </p>

                                                            <p className="mt-1 text-xs text-[#8A7A6A]">
                                                                {
                                                                    order.customer_email ||
                                                                    order.email ||
                                                                    "—"
                                                                }
                                                            </p>

                                                        </td>


                                                        {/* VEHICLE */}

                                                        <td className="px-5 py-4">

                                                            <div className="flex items-center gap-3">

                                                                <div className="flex h-10 w-12 shrink-0 items-center justify-center overflow-hidden rounded-lg bg-[#8B1A1A]/10">

                                                                    <CarFront
                                                                        size={
                                                                            20
                                                                        }
                                                                        className="text-[#8B1A1A]"
                                                                    />

                                                                </div>

                                                                <div className="min-w-0">

                                                                    <p className="max-w-[180px] truncate font-bold text-[#2D1B0E]">
                                                                        {
                                                                            order.vehicle_name ||
                                                                            "Vehicle"
                                                                        }
                                                                    </p>

                                                                </div>

                                                            </div>

                                                        </td>


                                                        {/* PRICE */}

                                                        <td className="px-5 py-4">

                                                            <p className="font-extrabold text-[#2D1B0E]">

                                                                $

                                                                {
                                                                    formatPrice(
                                                                        order.price
                                                                    )
                                                                }

                                                            </p>

                                                        </td>


                                                        {/* STATUS */}

                                                        <td className="px-5 py-4">

                                                            {
                                                                getStatusBadge(
                                                                    order.status
                                                                )
                                                            }

                                                        </td>


                                                        {/* FULFILLMENT */}

                                                        <td className="px-5 py-4">

                                                            {
                                                                getFulfillmentBadge(
                                                                    order.fulfillment_method
                                                                )
                                                            }

                                                        </td>


                                                        {/* DATE */}

                                                        <td className="px-5 py-4">

                                                            <p className="text-sm font-semibold text-[#2D1B0E]">
                                                                {
                                                                    formatDate(
                                                                        order.created_at
                                                                    )
                                                                }
                                                            </p>

                                                        </td>


                                                        {/* ACTION */}

                                                        <td className="px-5 py-4 text-right">

                                                            <Link
                                                                to={`/admin/orders/${order.id}`}
                                                                className="inline-flex items-center gap-2 rounded-xl bg-[#8B1A1A] px-4 py-2.5 text-xs font-bold text-white shadow-lg shadow-[#8B1A1A]/20 transition hover:bg-[#6B1515] hover:shadow-xl hover:shadow-[#8B1A1A]/30"
                                                            >

                                                                <Eye
                                                                    size={
                                                                        15
                                                                    }
                                                                />

                                                                View Order

                                                            </Link>

                                                        </td>

                                                    </tr>

                                                )
                                            )}

                                        </tbody>

                                    </table>

                                </div>


                                {/* MOBILE CARDS */}

                                <div className="divide-y divide-[#8B1A1A]/10 lg:hidden">

                                    {filteredOrders.map(
                                        (
                                            order
                                        ) => (

                                            <div
                                                key={
                                                    order.id
                                                }
                                                className="p-5"
                                            >

                                                <div className="flex items-start justify-between gap-4">

                                                    <div>

                                                        <p className="text-xs font-bold uppercase tracking-wider text-[#8B1A1A]">
                                                            Order
                                                        </p>

                                                        <h3 className="mt-1 font-extrabold text-[#2D1B0E]">

                                                            {
                                                                order.order_number ||
                                                                `#${order.id}`
                                                            }

                                                        </h3>

                                                    </div>


                                                    {
                                                        getStatusBadge(
                                                            order.status
                                                        )
                                                    }

                                                </div>


                                                <div className="mt-5 flex items-center gap-3">

                                                    <div className="flex h-12 w-14 items-center justify-center rounded-xl bg-[#8B1A1A]/10">

                                                        <CarFront
                                                            size={
                                                                22
                                                            }
                                                            className="text-[#8B1A1A]"
                                                        />

                                                    </div>


                                                    <div className="min-w-0">

                                                        <p className="truncate font-extrabold text-[#2D1B0E]">

                                                            {
                                                                order.vehicle_name ||
                                                                "Vehicle"
                                                            }

                                                        </p>

                                                        <p className="mt-1 text-sm text-[#6A5A4A]">

                                                            {
                                                                order.full_name ||
                                                                order.customer_username ||
                                                                "Customer"
                                                            }

                                                        </p>

                                                    </div>

                                                </div>


                                                <div className="mt-5 grid grid-cols-2 gap-4">

                                                    <div>

                                                        <p className="text-xs font-semibold text-[#8A7A6A]">
                                                            Price
                                                        </p>

                                                        <p className="mt-1 font-extrabold text-[#2D1B0E]">

                                                            $

                                                            {
                                                                formatPrice(
                                                                    order.price
                                                                )
                                                            }

                                                        </p>

                                                    </div>


                                                    <div>

                                                        <p className="text-xs font-semibold text-[#8A7A6A]">
                                                            Date
                                                        </p>

                                                        <p className="mt-1 font-bold text-[#2D1B0E]">

                                                            {
                                                                formatDate(
                                                                    order.created_at
                                                                )
                                                            }

                                                        </p>

                                                    </div>

                                                </div>


                                                <div className="mt-5 flex items-center justify-between">

                                                    <div>

                                                        {
                                                            getFulfillmentBadge(
                                                                order.fulfillment_method
                                                            )
                                                        }

                                                    </div>


                                                    <Link
                                                        to={`/admin/orders/${order.id}`}
                                                        className="inline-flex items-center gap-2 rounded-xl bg-[#8B1A1A] px-4 py-2.5 text-xs font-bold text-white shadow-lg shadow-[#8B1A1A]/20 transition hover:bg-[#6B1515] hover:shadow-xl hover:shadow-[#8B1A1A]/30"
                                                    >

                                                        <Eye
                                                            size={
                                                                15
                                                            }
                                                        />

                                                        View Order

                                                    </Link>

                                                </div>

                                            </div>

                                        )
                                    )}

                                </div>

                            </>

                        )}

                    </section>

                </main>

            </div>

        </AdminLayout>
    );
}


// ============================================================
// ORDER STAT - DEEP REDISH
// ============================================================

function OrderStatRed({
    title,
    value,
    icon: Icon,
}) {

    return (

        <div className="rounded-2xl border border-[#8B1A1A]/15 bg-white p-5 shadow-sm transition hover:shadow-md hover:border-[#8B1A1A]/30">

            <div className="flex items-center justify-between">

                <div>

                    <p className="text-sm font-semibold text-[#6A5A4A]">
                        {title}
                    </p>

                    <p className="mt-2 text-3xl font-extrabold text-[#2D1B0E]">
                        {value}
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


export default AdminOrders;