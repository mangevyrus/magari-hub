import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import {
    CarFront,
    CheckCircle2,
    CircleDollarSign,
    Clock3,
    Plus,
    ArrowRight,
    TrendingUp,
    Star,
    Users,
    Settings,
    LogOut,
    Menu,
    X,
    LayoutDashboard,
    List,
    BarChart3,
} from "lucide-react";

import api from "../../services/api";


function AdminDashboard() {

    const navigate = useNavigate();

    const [vehicles, setVehicles] = useState([]);

    const [loading, setLoading] = useState(true);

    const [sidebarOpen, setSidebarOpen] = useState(false);

    const [error, setError] = useState("");


    /*
    |--------------------------------------------------------------------------
    | LOAD VEHICLES
    |--------------------------------------------------------------------------
    */

    useEffect(() => {

        const loadDashboard = async () => {

            try {

                setLoading(true);

                setError("");

                const response =
                    await api.get("/vehicles/");

                const data =
                    Array.isArray(response.data)
                        ? response.data
                        : response.data.results || [];

                setVehicles(data);

            } catch (err) {

                console.error(
                    "Dashboard loading error:",
                    err
                );

                setError(
                    "Unable to load dashboard data."
                );

            } finally {

                setLoading(false);

            }

        };

        loadDashboard();

    }, []);


    /*
    |--------------------------------------------------------------------------
    | STATISTICS
    |--------------------------------------------------------------------------
    */

    const statistics = useMemo(() => {

        const total =
            vehicles.length;

        const available =
            vehicles.filter(
                vehicle =>
                    vehicle.status === "available"
            ).length;

        const sold =
            vehicles.filter(
                vehicle =>
                    vehicle.status === "sold"
            ).length;

        const reserved =
            vehicles.filter(
                vehicle =>
                    vehicle.status === "reserved"
            ).length;

        const featured =
            vehicles.filter(
                vehicle =>
                    vehicle.featured
            ).length;

        const draft =
            vehicles.filter(
                vehicle =>
                    vehicle.status === "draft"
            ).length;

        const totalValue =
            vehicles.reduce(
                (sum, vehicle) =>
                    sum + Number(
                        vehicle.price || 0
                    ),
                0
            );

        return {
            total,
            available,
            sold,
            reserved,
            featured,
            draft,
            totalValue,
        };

    }, [vehicles]);


    /*
    |--------------------------------------------------------------------------
    | RECENT VEHICLES
    |--------------------------------------------------------------------------
    */

    const recentVehicles =
        useMemo(() => {

            return [...vehicles]
                .sort(
                    (a, b) =>
                        new Date(b.created_at) -
                        new Date(a.created_at)
                )
                .slice(0, 5);

        }, [vehicles]);


    /*
    |--------------------------------------------------------------------------
    | LOGOUT
    |--------------------------------------------------------------------------
    */

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


    /*
    |--------------------------------------------------------------------------
    | FORMAT PRICE
    |--------------------------------------------------------------------------
    */

    const formatPrice = (price) => {

        return Number(
            price || 0
        ).toLocaleString();

    };


    return (

        <div className="min-h-screen bg-[#F5F9FC]">


            {/* ====================================================== */}
            {/* MOBILE OVERLAY */}
            {/* ====================================================== */}

            {sidebarOpen && (

                <div
                    className="fixed inset-0 z-40 bg-[#12395B]/40 backdrop-blur-sm lg:hidden"
                    onClick={() =>
                        setSidebarOpen(false)
                    }
                />

            )}


            {/* ====================================================== */}
            {/* SIDEBAR */}
            {/* ====================================================== */}

            <aside
                className={`
                    fixed inset-y-0 left-0 z-50
                    w-72
                    border-r border-blue-100
                    bg-white
                    shadow-xl
                    transition-transform duration-300

                    lg:translate-x-0

                    ${
                        sidebarOpen
                            ? "translate-x-0"
                            : "-translate-x-full"
                    }
                `}
            >

                {/* LOGO */}

                <div className="flex h-20 items-center justify-between border-b border-blue-100 px-6">

                    <Link
                        to="/admin/dashboard"
                        className="flex items-center gap-3"
                    >

                        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#12395B]">

                            <CarFront
                                size={24}
                                className="text-white"
                            />

                        </div>

                        <div>

                            <h1 className="text-lg font-extrabold text-[#12395B]">
                                MagariHub
                            </h1>

                            <p className="text-xs font-semibold text-[#2F80C0]">
                                ADMIN PANEL
                            </p>

                        </div>

                    </Link>


                    <button
                        onClick={() =>
                            setSidebarOpen(false)
                        }
                        className="rounded-lg p-2 text-slate-400 hover:bg-blue-50 lg:hidden"
                    >

                        <X size={20} />

                    </button>

                </div>


                {/* NAVIGATION */}

                <nav className="p-4">

                    <p className="mb-3 px-3 text-[11px] font-extrabold uppercase tracking-widest text-slate-400">
                        Main Menu
                    </p>


                    <SidebarLink
                        to="/admin/dashboard"
                        icon={LayoutDashboard}
                        label="Dashboard"
                        active
                    />


                    <SidebarLink
                        to="/admin/vehicles"
                        icon={CarFront}
                        label="Vehicles"
                    />


                    <SidebarLink
                        to="/admin/vehicles/new"
                        icon={Plus}
                        label="Add Vehicle"
                    />


                    <SidebarLink
                        to="/admin/brands"
                        icon={List}
                        label="Brands"
                    />


                    <SidebarLink
                        to="/admin/categories"
                        icon={List}
                        label="Categories"
                    />


                    <div className="my-6 border-t border-blue-100" />


                    <p className="mb-3 px-3 text-[11px] font-extrabold uppercase tracking-widest text-slate-400">
                        Management
                    </p>


                    <SidebarLink
                        to="/admin/users"
                        icon={Users}
                        label="Users"
                    />


                    <SidebarLink
                        to="/admin/analytics"
                        icon={BarChart3}
                        label="Analytics"
                    />


                    <SidebarLink
                        to="/admin/settings"
                        icon={Settings}
                        label="Settings"
                    />

                </nav>


                {/* LOGOUT */}

                <div className="absolute bottom-0 left-0 right-0 border-t border-blue-100 p-4">

                    <button
                        onClick={handleLogout}
                        className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-bold text-red-500 transition hover:bg-red-50"
                    >

                        <LogOut size={18} />

                        Logout

                    </button>

                </div>

            </aside>


            {/* ====================================================== */}
            {/* MAIN AREA */}
            {/* ====================================================== */}

            <div className="lg:pl-72">


                {/* ================================================== */}
                {/* TOP BAR */}
                {/* ================================================== */}

                <header className="sticky top-0 z-30 border-b border-blue-100 bg-white/95 backdrop-blur">

                    <div className="flex h-20 items-center justify-between px-5 md:px-8">

                        <button
                            onClick={() =>
                                setSidebarOpen(true)
                            }
                            className="rounded-xl p-2 text-[#12395B] hover:bg-blue-50 lg:hidden"
                        >

                            <Menu size={23} />

                        </button>


                        <div className="hidden lg:block">

                            <p className="text-sm text-slate-400">
                                Welcome back
                            </p>

                            <h2 className="font-extrabold text-[#12395B]">
                                Admin Dashboard
                            </h2>

                        </div>


                        <div className="flex items-center gap-3">

                            <Link
                                to="/admin/vehicles/new"
                                className="inline-flex items-center gap-2 rounded-xl bg-[#12395B] px-4 py-3 text-sm font-bold text-white shadow-lg shadow-blue-900/10 transition hover:bg-[#2F80C0]"
                            >

                                <Plus size={17} />

                                <span className="hidden sm:inline">
                                    Add Vehicle
                                </span>

                            </Link>

                        </div>

                    </div>

                </header>


                {/* ================================================== */}
                {/* CONTENT */}
                {/* ================================================== */}

                <main className="mx-auto max-w-7xl px-5 py-8 md:px-8">


                    {/* PAGE TITLE */}

                    <div className="mb-8">

                        <p className="text-sm font-bold uppercase tracking-[0.2em] text-[#2F80C0]">
                            Overview
                        </p>

                        <h1 className="mt-2 text-3xl font-extrabold text-[#12395B] md:text-4xl">
                            Dashboard
                        </h1>

                        <p className="mt-2 text-slate-500">
                            Monitor your vehicle inventory
                            and dealership activity.
                        </p>

                    </div>


                    {/* ERROR */}

                    {error && (

                        <div className="mb-6 rounded-xl border border-red-100 bg-red-50 p-4 text-sm font-semibold text-red-600">
                            {error}
                        </div>

                    )}


                    {/* ================================================== */}
                    {/* STAT CARDS */}
                    {/* ================================================== */}

                    <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">


                        <DashboardStat
                            title="Total Vehicles"
                            value={
                                loading
                                    ? "..."
                                    : statistics.total
                            }
                            icon={CarFront}
                            description="All inventory"
                        />


                        <DashboardStat
                            title="Available"
                            value={
                                loading
                                    ? "..."
                                    : statistics.available
                            }
                            icon={CheckCircle2}
                            description="Ready for sale"
                        />


                        <DashboardStat
                            title="Sold Vehicles"
                            value={
                                loading
                                    ? "..."
                                    : statistics.sold
                            }
                            icon={CircleDollarSign}
                            description="Completed sales"
                        />


                        <DashboardStat
                            title="Reserved"
                            value={
                                loading
                                    ? "..."
                                    : statistics.reserved
                            }
                            icon={Clock3}
                            description="Currently reserved"
                        />

                    </div>


                    {/* ================================================== */}
                    {/* SECONDARY STATS */}
                    {/* ================================================== */}

                    <div className="mt-5 grid gap-5 md:grid-cols-3">


                        <MiniStat
                            icon={Star}
                            title="Featured Vehicles"
                            value={
                                loading
                                    ? "..."
                                    : statistics.featured
                            }
                        />


                        <MiniStat
                            icon={Clock3}
                            title="Draft Listings"
                            value={
                                loading
                                    ? "..."
                                    : statistics.draft
                            }
                        />


                        <MiniStat
                            icon={TrendingUp}
                            title="Inventory Value"
                            value={
                                loading
                                    ? "..."
                                    : `$${formatPrice(
                                        statistics.totalValue
                                    )}`
                            }
                        />

                    </div>


                    {/* ================================================== */}
                    {/* RECENT VEHICLES + INVENTORY STATUS */}
                    {/* ================================================== */}

                    <div className="mt-8 grid gap-6 xl:grid-cols-[1fr_360px]">


                        {/* RECENT VEHICLES */}

                        <section className="overflow-hidden rounded-2xl border border-blue-100 bg-white shadow-sm">

                            <div className="flex items-center justify-between border-b border-blue-100 px-5 py-5">

                                <div>

                                    <h2 className="text-lg font-extrabold text-[#12395B]">
                                        Recent Vehicles
                                    </h2>

                                    <p className="mt-1 text-sm text-slate-400">
                                        Latest vehicles added
                                        to your inventory.
                                    </p>

                                </div>


                                <Link
                                    to="/admin/vehicles"
                                    className="inline-flex items-center gap-1 text-sm font-bold text-[#2F80C0] hover:text-[#12395B]"
                                >

                                    View All

                                    <ArrowRight
                                        size={16}
                                    />

                                </Link>

                            </div>


                            {loading ? (

                                <div className="space-y-3 p-5">

                                    {[1, 2, 3, 4].map(
                                        item => (

                                            <div
                                                key={item}
                                                className="h-20 animate-pulse rounded-xl bg-[#F5F9FC]"
                                            />

                                        )
                                    )}

                                </div>

                            ) : recentVehicles.length === 0 ? (

                                <div className="px-5 py-16 text-center">

                                    <CarFront
                                        size={32}
                                        className="mx-auto text-[#2F80C0]"
                                    />

                                    <p className="mt-3 font-bold text-[#12395B]">
                                        No vehicles yet
                                    </p>

                                    <Link
                                        to="/admin/vehicles/new"
                                        className="mt-4 inline-flex rounded-xl bg-[#12395B] px-4 py-2.5 text-sm font-bold text-white"
                                    >
                                        Add your first vehicle
                                    </Link>

                                </div>

                            ) : (

                                <div>

                                    {recentVehicles.map(
                                        vehicle => (

                                            <RecentVehicle
                                                key={
                                                    vehicle.id
                                                }
                                                vehicle={
                                                    vehicle
                                                }
                                            />

                                        )
                                    )}

                                </div>

                            )}

                        </section>


                        {/* INVENTORY STATUS */}

                        <section className="rounded-2xl border border-blue-100 bg-white p-5 shadow-sm">

                            <div>

                                <h2 className="text-lg font-extrabold text-[#12395B]">
                                    Inventory Status
                                </h2>

                                <p className="mt-1 text-sm text-slate-400">
                                    Current inventory breakdown.
                                </p>

                            </div>


                            <div className="mt-7 space-y-6">

                                <ProgressRow
                                    label="Available"
                                    value={
                                        statistics.available
                                    }
                                    total={
                                        statistics.total
                                    }
                                />


                                <ProgressRow
                                    label="Reserved"
                                    value={
                                        statistics.reserved
                                    }
                                    total={
                                        statistics.total
                                    }
                                />


                                <ProgressRow
                                    label="Sold"
                                    value={
                                        statistics.sold
                                    }
                                    total={
                                        statistics.total
                                    }
                                />


                                <ProgressRow
                                    label="Draft"
                                    value={
                                        statistics.draft
                                    }
                                    total={
                                        statistics.total
                                    }
                                />

                            </div>

                        </section>

                    </div>


                    {/* ================================================== */}
                    {/* QUICK ACTIONS */}
                    {/* ================================================== */}

                    <section className="mt-8">

                        <h2 className="mb-4 text-lg font-extrabold text-[#12395B]">
                            Quick Actions
                        </h2>


                        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">


                            <QuickAction
                                to="/admin/vehicles/new"
                                icon={Plus}
                                title="Add Vehicle"
                                description="Create a new listing"
                            />


                            <QuickAction
                                to="/admin/vehicles"
                                icon={CarFront}
                                title="Manage Vehicles"
                                description="View your inventory"
                            />


                            <QuickAction
                                to="/admin/analytics"
                                icon={BarChart3}
                                title="View Analytics"
                                description="Review performance"
                            />


                            <QuickAction
                                to="/admin/settings"
                                icon={Settings}
                                title="Settings"
                                description="Manage your account"
                            />

                        </div>

                    </section>

                </main>

            </div>

        </div>
    );
}


/* ================================================================= */
/* SIDEBAR LINK */
/* ================================================================= */

function SidebarLink({
    to,
    icon: Icon,
    label,
    active = false,
}) {

    return (

        <Link
            to={to}
            className={`
                mb-1 flex items-center gap-3
                rounded-xl px-4 py-3
                text-sm font-bold
                transition

                ${
                    active
                        ? "bg-[#EAF6FF] text-[#2F80C0]"
                        : "text-slate-500 hover:bg-[#F5F9FC] hover:text-[#12395B]"
                }
            `}
        >

            <Icon size={18} />

            {label}

        </Link>

    );
}


/* ================================================================= */
/* DASHBOARD STAT */
/* ================================================================= */

function DashboardStat({
    title,
    value,
    icon: Icon,
    description,
}) {

    return (

        <div className="rounded-2xl border border-blue-100 bg-white p-5 shadow-sm">

            <div className="flex items-start justify-between">

                <div>

                    <p className="text-sm font-semibold text-slate-400">
                        {title}
                    </p>

                    <p className="mt-2 text-3xl font-extrabold text-[#12395B]">
                        {value}
                    </p>

                    <p className="mt-2 text-xs text-slate-400">
                        {description}
                    </p>

                </div>


                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#EAF6FF]">

                    <Icon
                        size={22}
                        className="text-[#2F80C0]"
                    />

                </div>

            </div>

        </div>

    );
}


/* ================================================================= */
/* MINI STAT */
/* ================================================================= */

function MiniStat({
    icon: Icon,
    title,
    value,
}) {

    return (

        <div className="flex items-center gap-4 rounded-2xl border border-blue-100 bg-white p-5 shadow-sm">

            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#EAF6FF]">

                <Icon
                    size={20}
                    className="text-[#2F80C0]"
                />

            </div>


            <div>

                <p className="text-sm font-semibold text-slate-400">
                    {title}
                </p>

                <p className="mt-1 text-2xl font-extrabold text-[#12395B]">
                    {value}
                </p>

            </div>

        </div>

    );
}


/* ================================================================= */
/* RECENT VEHICLE */
/* ================================================================= */

function RecentVehicle({
    vehicle,
}) {

    const getImage = () => {

        const primary =
            vehicle.images?.find(
                image =>
                    image.is_primary
            );

        const image =
            primary ||
            vehicle.images?.[0];

        if (!image?.image) {
            return null;
        }

        if (
            image.image.startsWith("http")
        ) {
            return image.image;
        }

        return `http://127.0.0.1:8000${image.image}`;
    };


    const image =
        getImage();


    return (

        <Link
            to={`/admin/vehicles/${vehicle.id}/edit`}
            className="flex items-center gap-4 border-b border-blue-50 px-5 py-4 transition last:border-b-0 hover:bg-[#F8FCFF]"
        >

            <div className="h-16 w-20 shrink-0 overflow-hidden rounded-xl bg-[#EAF6FF]">

                {image ? (

                    <img
                        src={image}
                        alt={`${vehicle.brand_name} ${vehicle.model}`}
                        className="h-full w-full object-cover"
                    />

                ) : (

                    <div className="flex h-full items-center justify-center">

                        <CarFront
                            size={22}
                            className="text-[#2F80C0]"
                        />

                    </div>

                )}

            </div>


            <div className="min-w-0 flex-1">

                <p className="text-xs font-bold text-[#2F80C0]">
                    {vehicle.brand_name}
                </p>

                <h3 className="truncate font-extrabold text-[#12395B]">
                    {vehicle.model}
                </h3>

                <p className="mt-1 text-xs text-slate-400">
                    {vehicle.year}
                    {vehicle.variant
                        ? ` • ${vehicle.variant}`
                        : ""}
                </p>

            </div>


            <div className="text-right">

                <p className="font-extrabold text-[#12395B]">
                    $
                    {Number(
                        vehicle.price || 0
                    ).toLocaleString()}
                </p>

                <p className="mt-1 text-xs capitalize text-slate-400">
                    {vehicle.status}
                </p>

            </div>

        </Link>

    );
}


/* ================================================================= */
/* PROGRESS ROW */
/* ================================================================= */

function ProgressRow({
    label,
    value,
    total,
}) {

    const percentage =
        total > 0
            ? Math.round(
                (value / total) * 100
            )
            : 0;


    return (

        <div>

            <div className="mb-2 flex items-center justify-between">

                <span className="text-sm font-bold text-[#12395B]">
                    {label}
                </span>

                <span className="text-xs font-bold text-slate-400">
                    {value} ({percentage}%)
                </span>

            </div>


            <div className="h-2 overflow-hidden rounded-full bg-[#EAF6FF]">

                <div
                    className="h-full rounded-full bg-[#2F80C0] transition-all duration-500"
                    style={{
                        width: `${percentage}%`,
                    }}
                />

            </div>

        </div>

    );
}


/* ================================================================= */
/* QUICK ACTION */
/* ================================================================= */

function QuickAction({
    to,
    icon: Icon,
    title,
    description,
}) {

    return (

        <Link
            to={to}
            className="group rounded-2xl border border-blue-100 bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:border-blue-200 hover:shadow-lg"
        >

            <div className="flex items-center justify-between">

                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#EAF6FF]">

                    <Icon
                        size={20}
                        className="text-[#2F80C0]"
                    />

                </div>


                <ArrowRight
                    size={18}
                    className="text-slate-300 transition group-hover:translate-x-1 group-hover:text-[#2F80C0]"
                />

            </div>


            <h3 className="mt-5 font-extrabold text-[#12395B]">
                {title}
            </h3>

            <p className="mt-1 text-sm text-slate-400">
                {description}
            </p>

        </Link>

    );
}


export default AdminDashboard;