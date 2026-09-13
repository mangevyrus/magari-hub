import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import magarilogo from "../../assets/magarilogo.png";
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
    MessageCircle,
} from "lucide-react";

import api from "../../services/api";
import AdminLayout from "../../layouts/AdminLayout";

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

                const response = await api.get("/vehicles/");

                const data = Array.isArray(response.data)
                    ? response.data
                    : response.data.results || [];

                setVehicles(data);

            } catch (err) {

                console.error("Dashboard loading error:", err);
                setError("Unable to load dashboard data.");

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

        const total = vehicles.length;
        const available = vehicles.filter(vehicle => vehicle.status === "available").length;
        const sold = vehicles.filter(vehicle => vehicle.status === "sold").length;
        const reserved = vehicles.filter(vehicle => vehicle.status === "reserved").length;
        const featured = vehicles.filter(vehicle => vehicle.featured).length;
        const draft = vehicles.filter(vehicle => vehicle.status === "draft").length;
        const totalValue = vehicles.reduce((sum, vehicle) => sum + Number(vehicle.price || 0), 0);

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

    const recentVehicles = useMemo(() => {
        return [...vehicles]
            .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
            .slice(0, 5);
    }, [vehicles]);


    /*
    |--------------------------------------------------------------------------
    | LOGOUT
    |--------------------------------------------------------------------------
    */

    const handleLogout = () => {

        localStorage.removeItem("access_token");
        localStorage.removeItem("refresh_token");
        localStorage.removeItem("admin_token");
        navigate("/admin/login");

    };


    /*
    |--------------------------------------------------------------------------
    | FORMAT PRICE
    |--------------------------------------------------------------------------
    */

    const formatPrice = (price) => {
        return Number(price || 0).toLocaleString();
    };


    return (

        <AdminLayout>


            {/* ====================================================== */}
            {/* MOBILE OVERLAY */}
            {/* ====================================================== */}

            {sidebarOpen && (

                <div
                    className="fixed inset-0 z-40 bg-[#2D1B0E]/40 backdrop-blur-sm lg:hidden"
                    onClick={() => setSidebarOpen(false)}
                />

            )}


            {/* ====================================================== */}
            {/* MAIN AREA */}
            {/* ====================================================== */}

            <div className="lg:pl-72">


                {/* ================================================== */}
                {/* TOP BAR */}
                {/* ================================================== */}

                <header className="sticky top-0 z-30 border-b border-[#8B1A1A]/20 bg-white/95 backdrop-blur">

                    <div className="flex h-20 items-center justify-between px-5 md:px-8">

                        <button
                            onClick={() => setSidebarOpen(true)}
                            className="rounded-xl p-2 text-[#2D1B0E] hover:bg-[#8B1A1A]/5 lg:hidden"
                        >
                            <Menu size={23} />
                        </button>


                        <div className="hidden lg:block">

                            <p className="text-sm text-[#6A5A4A]">
                                Welcome back
                            </p>

                            <h2 className="font-extrabold text-[#2D1B0E]">
                                Admin Dashboard
                            </h2>

                        </div>


                        <div className="flex items-center gap-3">

                            <Link
                                to="/admin/vehicles/new"
                                className="inline-flex items-center gap-2 rounded-xl bg-[#8B1A1A] px-4 py-3 text-sm font-bold text-white shadow-lg shadow-[#8B1A1A]/20 transition hover:bg-[#6B1515] hover:shadow-xl hover:shadow-[#8B1A1A]/30"
                            >
                                <Plus size={17} />
                                <span className="hidden sm:inline">Add Vehicle</span>
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

                        <p className="text-sm font-bold uppercase tracking-[0.2em] text-[#8B1A1A]">
                            Overview
                        </p>

                        <h1 className="mt-2 text-3xl font-extrabold text-[#2D1B0E] md:text-4xl">
                            Dashboard
                        </h1>

                        <p className="mt-2 text-[#6A5A4A]">
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
                            value={loading ? "..." : statistics.total}
                            icon={CarFront}
                            description="All inventory"
                        />


                        <DashboardStat
                            title="Available"
                            value={loading ? "..." : statistics.available}
                            icon={CheckCircle2}
                            description="Ready for sale"
                        />


                        <DashboardStat
                            title="Sold Vehicles"
                            value={loading ? "..." : statistics.sold}
                            icon={CircleDollarSign}
                            description="Completed sales"
                        />


                        <DashboardStat
                            title="Reserved"
                            value={loading ? "..." : statistics.reserved}
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
                            value={loading ? "..." : statistics.featured}
                        />


                        <MiniStat
                            icon={Clock3}
                            title="Draft Listings"
                            value={loading ? "..." : statistics.draft}
                        />


                        <MiniStat
                            icon={TrendingUp}
                            title="Inventory Value"
                            value={loading ? "..." : `TZS ${formatPrice(statistics.totalValue)}`}
                        />

                    </div>


                    {/* ================================================== */}
                    {/* RECENT VEHICLES + INVENTORY STATUS */}
                    {/* ================================================== */}

                    <div className="mt-8 grid gap-6 xl:grid-cols-[1fr_360px]">


                        {/* RECENT VEHICLES */}

                        <section className="overflow-hidden rounded-2xl border border-[#8B1A1A]/20 bg-white shadow-sm">

                            <div className="flex items-center justify-between border-b border-[#8B1A1A]/20 px-5 py-5">

                                <div>

                                    <h2 className="text-lg font-extrabold text-[#2D1B0E]">
                                        Recent Vehicles
                                    </h2>

                                    <p className="mt-1 text-sm text-[#6A5A4A]">
                                        Latest vehicles added
                                        to your inventory.
                                    </p>

                                </div>


                                <Link
                                    to="/admin/vehicles"
                                    className="inline-flex items-center gap-1 text-sm font-bold text-[#8B1A1A] hover:text-[#6B1515]"
                                >

                                    View All

                                    <ArrowRight size={16} />

                                </Link>

                            </div>


                            {loading ? (

                                <div className="space-y-3 p-5">

                                    {[1, 2, 3, 4].map(item => (

                                        <div
                                            key={item}
                                            className="h-20 animate-pulse rounded-xl bg-[#FDF8F5] border border-[#8B1A1A]/10"
                                        />

                                    ))}

                                </div>

                            ) : recentVehicles.length === 0 ? (

                                <div className="px-5 py-16 text-center">

                                    <CarFront size={32} className="mx-auto text-[#8B1A1A]" />

                                    <p className="mt-3 font-bold text-[#2D1B0E]">
                                        No vehicles yet
                                    </p>

                                    <Link
                                        to="/admin/vehicles/new"
                                        className="mt-4 inline-flex rounded-xl bg-[#8B1A1A] px-4 py-2.5 text-sm font-bold text-white shadow-lg shadow-[#8B1A1A]/20 transition hover:bg-[#6B1515]"
                                    >
                                        Add your first vehicle
                                    </Link>

                                </div>

                            ) : (

                                <div>

                                    {recentVehicles.map(vehicle => (

                                        <RecentVehicle key={vehicle.id} vehicle={vehicle} />

                                    ))}

                                </div>

                            )}

                        </section>


                        {/* INVENTORY STATUS */}

                        <section className="rounded-2xl border border-[#8B1A1A]/20 bg-white p-5 shadow-sm">

                            <div>

                                <h2 className="text-lg font-extrabold text-[#2D1B0E]">
                                    Inventory Status
                                </h2>

                                <p className="mt-1 text-sm text-[#6A5A4A]">
                                    Current inventory breakdown.
                                </p>

                            </div>


                            <div className="mt-7 space-y-6">

                                <ProgressRow
                                    label="Available"
                                    value={statistics.available}
                                    total={statistics.total}
                                />


                                <ProgressRow
                                    label="Reserved"
                                    value={statistics.reserved}
                                    total={statistics.total}
                                />


                                <ProgressRow
                                    label="Sold"
                                    value={statistics.sold}
                                    total={statistics.total}
                                />


                                <ProgressRow
                                    label="Draft"
                                    value={statistics.draft}
                                    total={statistics.total}
                                />

                            </div>

                        </section>

                    </div>


                    {/* ================================================== */}
                    {/* QUICK ACTIONS */}
                    {/* ================================================== */}

                    <section className="mt-8">

                        <h2 className="mb-4 text-lg font-extrabold text-[#2D1B0E]">
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

        </AdminLayout>
    );
}


/* ================================================================= */
/* DASHBOARD STAT - DEEP REDISH */
/* ================================================================= */

function DashboardStat({
    title,
    value,
    icon: Icon,
    description,
}) {

    return (

        <div className="rounded-2xl border border-[#8B1A1A]/15 bg-white p-5 shadow-sm transition hover:shadow-md hover:border-[#8B1A1A]/30">

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

                    <Icon size={22} className="text-[#8B1A1A]" />

                </div>

            </div>

        </div>

    );
}


/* ================================================================= */
/* MINI STAT - DEEP REDISH */
/* ================================================================= */

function MiniStat({
    icon: Icon,
    title,
    value,
}) {

    return (

        <div className="flex items-center gap-4 rounded-2xl border border-[#8B1A1A]/15 bg-white p-5 shadow-sm transition hover:shadow-md hover:border-[#8B1A1A]/30">

            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#8B1A1A]/10">

                <Icon size={20} className="text-[#8B1A1A]" />

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


/* ================================================================= */
/* RECENT VEHICLE - DEEP REDISH */
/* ================================================================= */

function RecentVehicle({
    vehicle,
}) {

    const getImage = () => {

        const primary = vehicle.images?.find(image => image.is_primary);
        const image = primary || vehicle.images?.[0];

        if (!image?.image) {
            return null;
        }

        if (image.image.startsWith("http")) {
            return image.image;
        }

        return `http://127.0.0.1:8000${image.image}`;
    };


    const image = getImage();


    return (

        <Link
            to={`/admin/vehicles/${vehicle.id}/edit`}
            className="flex items-center gap-4 border-b border-[#8B1A1A]/10 px-5 py-4 transition last:border-b-0 hover:bg-[#FDF8F5]"
        >

            <div className="h-16 w-20 shrink-0 overflow-hidden rounded-xl bg-[#8B1A1A]/10 border border-[#8B1A1A]/15">

                {image ? (

                    <img
                        src={image}
                        alt={`${vehicle.brand_name} ${vehicle.model}`}
                        className="h-full w-full object-cover"
                    />

                ) : (

                    <div className="flex h-full items-center justify-center">

                        <CarFront size={22} className="text-[#8B1A1A]" />

                    </div>

                )}

            </div>


            <div className="min-w-0 flex-1">

                <p className="text-xs font-bold text-[#8B1A1A]">
                    {vehicle.brand_name}
                </p>

                <h3 className="truncate font-extrabold text-[#2D1B0E]">
                    {vehicle.model}
                </h3>

                <p className="mt-1 text-xs text-[#8A7A6A]">
                    {vehicle.year}
                    {vehicle.variant ? ` • ${vehicle.variant}` : ""}
                </p>

            </div>


            <div className="text-right">

                <p className="font-extrabold text-[#2D1B0E]">
                    TZS {Number(vehicle.price || 0).toLocaleString()}
                </p>

                <p className="mt-1 text-xs capitalize text-[#8A7A6A]">
                    {vehicle.status}
                </p>

            </div>

        </Link>

    );
}


/* ================================================================= */
/* PROGRESS ROW - DEEP REDISH */
/* ================================================================= */

function ProgressRow({
    label,
    value,
    total,
}) {

    const percentage = total > 0 ? Math.round((value / total) * 100) : 0;

    // Get color based on percentage
    const getColor = () => {
        if (percentage > 75) return "bg-emerald-600";
        if (percentage > 50) return "bg-[#8B1A1A]";
        if (percentage > 25) return "bg-[#B22222]";
        return "bg-[#D4833A]";
    };

    return (

        <div>

            <div className="mb-2 flex items-center justify-between">

                <span className="text-sm font-bold text-[#2D1B0E]">
                    {label}
                </span>

                <span className="text-xs font-bold text-[#8A7A6A]">
                    {value} ({percentage}%)
                </span>

            </div>


            <div className="h-2 overflow-hidden rounded-full bg-[#FDF8F5] border border-[#8B1A1A]/10">

                <div
                    className={`h-full rounded-full ${getColor()} transition-all duration-500`}
                    style={{
                        width: `${percentage}%`,
                    }}
                />

            </div>

        </div>

    );
}


/* ================================================================= */
/* QUICK ACTION - DEEP REDISH */
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
            className="group rounded-2xl border border-[#8B1A1A]/15 bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:border-[#8B1A1A]/30 hover:shadow-lg"
        >

            <div className="flex items-center justify-between">

                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#8B1A1A]/10">

                    <Icon size={20} className="text-[#8B1A1A]" />

                </div>


                <ArrowRight
                    size={18}
                    className="text-[#8B1A1A]/30 transition group-hover:translate-x-1 group-hover:text-[#8B1A1A]"
                />

            </div>


            <h3 className="mt-5 font-extrabold text-[#2D1B0E]">
                {title}
            </h3>

            <p className="mt-1 text-sm text-[#6A5A4A]">
                {description}
            </p>

        </Link>

    );
}


export default AdminDashboard;