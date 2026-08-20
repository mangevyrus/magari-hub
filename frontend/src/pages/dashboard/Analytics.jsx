import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import AdminLayout from "../../layouts/AdminLayout";
import {
    ArrowLeft,
    BarChart3,
    CarFront,
    CircleDollarSign,
    CheckCircle2,
    Star,
    TrendingUp,
    Fuel,
} from "lucide-react";

import api from "../../services/api";


function Analytics() {

    const [vehicles, setVehicles] = useState([]);

    const [loading, setLoading] = useState(true);

    const [error, setError] = useState("");


    useEffect(() => {

        const loadVehicles = async () => {

            try {

                setLoading(true);

                const response =
                    await api.get("/vehicles/");

                const data =
                    Array.isArray(response.data)
                        ? response.data
                        : response.data.results || [];

                setVehicles(data);

            } catch (err) {

                console.error(err);

                setError(
                    "Failed to load analytics data."
                );

            } finally {

                setLoading(false);

            }

        };

        loadVehicles();

    }, []);


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

        const inventoryValue =
            vehicles.reduce(
                (total, vehicle) =>
                    total +
                    Number(vehicle.price || 0),
                0
            );

        return {
            total,
            available,
            sold,
            reserved,
            featured,
            inventoryValue,
        };

    }, [vehicles]);


    const brands = useMemo(() => {

        const counts = {};

        vehicles.forEach(vehicle => {

            const brand =
                vehicle.brand_name ||
                "Unknown";

            counts[brand] =
                (counts[brand] || 0) + 1;

        });

        return Object.entries(counts)
            .sort((a, b) => b[1] - a[1])
            .slice(0, 6);

    }, [vehicles]);


    const fuelTypes = useMemo(() => {

        const counts = {};

        vehicles.forEach(vehicle => {

            const fuel =
                vehicle.fuel_type ||
                "Unknown";

            counts[fuel] =
                (counts[fuel] || 0) + 1;

        });

        return Object.entries(counts)
            .sort((a, b) => b[1] - a[1]);

    }, [vehicles]);


    const formatPrice = (price) => {

        return Number(
            price || 0
        ).toLocaleString();

    };


    return (

        <AdminLayout>


            {/* HEADER */}

            <header className="border-b border-blue-100 bg-white">

                <div className="mx-auto max-w-7xl px-5 py-6 md:px-8">

                    <Link
                        to="/admin/dashboard"
                        className="mb-5 inline-flex items-center gap-2 text-sm font-bold text-[#2F80C0] hover:text-[#12395B]"
                    >

                        <ArrowLeft size={17} />

                        Back to Dashboard

                    </Link>


                    <div className="flex items-center gap-4">

                        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#EAF6FF]">

                            <BarChart3
                                size={27}
                                className="text-[#2F80C0]"
                            />

                        </div>


                        <div>

                            <p className="text-sm font-bold uppercase tracking-[0.2em] text-[#2F80C0]">
                                MagariHub Admin
                            </p>

                            <h1 className="mt-1 text-3xl font-extrabold text-[#12395B]">
                                Analytics
                            </h1>

                        </div>

                    </div>

                    <p className="mt-4 max-w-2xl text-slate-500">
                        Monitor your vehicle inventory,
                        pricing and dealership performance.
                    </p>

                </div>

            </header>


            {/* MAIN */}

            <main className="mx-auto max-w-7xl px-5 py-8 md:px-8">


                {error && (

                    <div className="mb-6 rounded-xl border border-red-100 bg-red-50 p-4 text-sm font-bold text-red-600">
                        {error}
                    </div>

                )}


                {/* STATISTICS */}

                <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">


                    <AnalyticsCard
                        title="Total Vehicles"
                        value={
                            loading
                                ? "..."
                                : statistics.total
                        }
                        icon={CarFront}
                    />


                    <AnalyticsCard
                        title="Available"
                        value={
                            loading
                                ? "..."
                                : statistics.available
                        }
                        icon={CheckCircle2}
                    />


                    <AnalyticsCard
                        title="Sold"
                        value={
                            loading
                                ? "..."
                                : statistics.sold
                        }
                        icon={CircleDollarSign}
                    />


                    <AnalyticsCard
                        title="Featured"
                        value={
                            loading
                                ? "..."
                                : statistics.featured
                        }
                        icon={Star}
                    />

                </div>


                {/* INVENTORY VALUE */}

                <div className="mt-6 rounded-2xl border border-blue-100 bg-white p-6 shadow-sm">

                    <div className="flex items-center gap-4">

                        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#EAF6FF]">

                            <TrendingUp
                                size={23}
                                className="text-[#2F80C0]"
                            />

                        </div>


                        <div>

                            <p className="text-sm font-semibold text-slate-400">
                                Total Inventory Value
                            </p>

                            <p className="mt-1 text-3xl font-extrabold text-[#12395B]">

                                {loading
                                    ? "..."
                                    : `$${formatPrice(
                                        statistics.inventoryValue
                                    )}`}

                            </p>

                        </div>

                    </div>

                </div>


                {/* CHARTS / BREAKDOWN */}

                <div className="mt-6 grid gap-6 lg:grid-cols-2">


                    {/* BRANDS */}

                    <section className="rounded-2xl border border-blue-100 bg-white p-6 shadow-sm">

                        <div className="flex items-center gap-3">

                            <CarFront
                                size={21}
                                className="text-[#2F80C0]"
                            />

                            <div>

                                <h2 className="font-extrabold text-[#12395B]">
                                    Vehicles by Brand
                                </h2>

                                <p className="text-sm text-slate-400">
                                    Top brands in inventory
                                </p>

                            </div>

                        </div>


                        <div className="mt-6 space-y-5">

                            {brands.length === 0 ? (

                                <p className="text-sm text-slate-400">
                                    No vehicle data available.
                                </p>

                            ) : (

                                brands.map(
                                    ([brand, count]) => {

                                        const percentage =
                                            statistics.total > 0
                                                ? Math.round(
                                                    (count /
                                                        statistics.total) *
                                                    100
                                                )
                                                : 0;

                                        return (

                                            <div
                                                key={brand}
                                            >

                                                <div className="mb-2 flex justify-between">

                                                    <span className="text-sm font-bold text-[#12395B]">
                                                        {brand}
                                                    </span>

                                                    <span className="text-xs font-bold text-slate-400">
                                                        {count} vehicles
                                                    </span>

                                                </div>


                                                <div className="h-2 overflow-hidden rounded-full bg-[#EAF6FF]">

                                                    <div
                                                        className="h-full rounded-full bg-[#2F80C0]"
                                                        style={{
                                                            width:
                                                                `${percentage}%`,
                                                        }}
                                                    />

                                                </div>

                                            </div>

                                        );

                                    }
                                )

                            )}

                        </div>

                    </section>


                    {/* FUEL */}

                    <section className="rounded-2xl border border-blue-100 bg-white p-6 shadow-sm">

                        <div className="flex items-center gap-3">

                            <Fuel
                                size={21}
                                className="text-[#2F80C0]"
                            />

                            <div>

                                <h2 className="font-extrabold text-[#12395B]">
                                    Fuel Distribution
                                </h2>

                                <p className="text-sm text-slate-400">
                                    Vehicles by fuel type
                                </p>

                            </div>

                        </div>


                        <div className="mt-6 space-y-5">

                            {fuelTypes.length === 0 ? (

                                <p className="text-sm text-slate-400">
                                    No fuel data available.
                                </p>

                            ) : (

                                fuelTypes.map(
                                    ([fuel, count]) => {

                                        const percentage =
                                            statistics.total > 0
                                                ? Math.round(
                                                    (count /
                                                        statistics.total) *
                                                    100
                                                )
                                                : 0;

                                        return (

                                            <div
                                                key={fuel}
                                            >

                                                <div className="mb-2 flex justify-between">

                                                    <span className="text-sm font-bold capitalize text-[#12395B]">
                                                        {fuel}
                                                    </span>

                                                    <span className="text-xs font-bold text-slate-400">
                                                        {count} vehicles
                                                    </span>

                                                </div>


                                                <div className="h-2 overflow-hidden rounded-full bg-[#EAF6FF]">

                                                    <div
                                                        className="h-full rounded-full bg-[#12395B]"
                                                        style={{
                                                            width:
                                                                `${percentage}%`,
                                                        }}
                                                    />

                                                </div>

                                            </div>

                                        );

                                    }
                                )

                            )}

                        </div>

                    </section>

                </div>


                {/* STATUS */}

                <section className="mt-6 rounded-2xl border border-blue-100 bg-white p-6 shadow-sm">

                    <h2 className="text-lg font-extrabold text-[#12395B]">
                        Inventory Status
                    </h2>

                    <div className="mt-5 grid gap-4 sm:grid-cols-3">

                        <StatusCard
                            label="Available"
                            value={statistics.available}
                        />

                        <StatusCard
                            label="Reserved"
                            value={statistics.reserved}
                        />

                        <StatusCard
                            label="Sold"
                            value={statistics.sold}
                        />

                    </div>

                </section>

            </main>

        </AdminLayout>
    );
}


function AnalyticsCard({
    title,
    value,
    icon: Icon,
}) {

    return (

        <div className="rounded-2xl border border-blue-100 bg-white p-5 shadow-sm">

            <div className="flex items-center justify-between">

                <div>

                    <p className="text-sm font-semibold text-slate-400">
                        {title}
                    </p>

                    <p className="mt-2 text-3xl font-extrabold text-[#12395B]">
                        {value}
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


function StatusCard({
    label,
    value,
}) {

    return (

        <div className="rounded-xl bg-[#F5F9FC] p-5">

            <p className="text-sm font-semibold text-slate-400">
                {label}
            </p>

            <p className="mt-2 text-2xl font-extrabold text-[#12395B]">
                {value}
            </p>

        </div>

    );
}


export default Analytics;