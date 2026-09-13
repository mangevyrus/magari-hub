
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
    CalendarDays,
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

                const response = await api.get("/vehicles/");

                const data = Array.isArray(response.data)
                    ? response.data
                    : response.data.results || [];

                setVehicles(data);
            } catch (err) {
                console.error(err);
                setError("Failed to load analytics data.");
            } finally {
                setLoading(false);
            }
        };

        loadVehicles();
    }, []);

    // ============================================================
    // STATISTICS
    // ============================================================

    const statistics = useMemo(() => {
        const total = vehicles.length;

        const available = vehicles.filter(
            (vehicle) => vehicle.status === "available"
        ).length;

        const sold = vehicles.filter(
            (vehicle) => vehicle.status === "sold"
        ).length;

        const reserved = vehicles.filter(
            (vehicle) => vehicle.status === "reserved"
        ).length;

        const featured = vehicles.filter(
            (vehicle) => vehicle.featured
        ).length;

        const inventoryValue = vehicles.reduce(
            (total, vehicle) =>
                total + Number(vehicle.price || 0),
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

    // ============================================================
    // VEHICLES BY BRAND
    // ============================================================

    const brands = useMemo(() => {
        const counts = {};

        vehicles.forEach((vehicle) => {
            const brand = vehicle.brand_name || "Unknown";

            counts[brand] = (counts[brand] || 0) + 1;
        });

        return Object.entries(counts)
            .sort((a, b) => b[1] - a[1])
            .slice(0, 6);
    }, [vehicles]);

    // ============================================================
    // FUEL TYPES
    // ============================================================

    const fuelTypes = useMemo(() => {
        const counts = {};

        vehicles.forEach((vehicle) => {
            const fuel = vehicle.fuel_type || "Unknown";

            counts[fuel] = (counts[fuel] || 0) + 1;
        });

        return Object.entries(counts)
            .sort((a, b) => b[1] - a[1]);
    }, [vehicles]);

    // ============================================================
    // DYNAMIC 7-DAY VEHICLE GRAPH
    // ============================================================

    const inventoryTrend = useMemo(() => {
        const days = [];

        for (let i = 6; i >= 0; i--) {
            const date = new Date();

            date.setHours(0, 0, 0, 0);
            date.setDate(date.getDate() - i);

            days.push(date);
        }

        return days.map((date) => {
            const year = date.getFullYear();
            const month = date.getMonth();
            const day = date.getDate();

            const count = vehicles.filter((vehicle) => {
                if (!vehicle.created_at) return false;

                const vehicleDate = new Date(vehicle.created_at);

                return (
                    vehicleDate.getFullYear() === year &&
                    vehicleDate.getMonth() === month &&
                    vehicleDate.getDate() === day
                );
            }).length;

            return {
                date,
                count,
                label: date.toLocaleDateString("en-TZ", {
                    weekday: "short",
                }),
            };
        });
    }, [vehicles]);

    // ============================================================
    // GRAPH VALUES
    // ============================================================

    const graph = useMemo(() => {
        const width = 800;
        const height = 280;

        const paddingLeft = 55;
        const paddingRight = 25;
        const paddingTop = 25;
        const paddingBottom = 45;

        const graphWidth =
            width - paddingLeft - paddingRight;

        const graphHeight =
            height - paddingTop - paddingBottom;

        const maxValue = Math.max(
            ...inventoryTrend.map((item) => item.count),
            1
        );

        const points = inventoryTrend.map((item, index) => {
            const x =
                paddingLeft +
                (index /
                    Math.max(inventoryTrend.length - 1, 1)) *
                    graphWidth;

            const y =
                paddingTop +
                graphHeight -
                (item.count / maxValue) * graphHeight;

            return {
                ...item,
                x,
                y,
            };
        });

        const linePath = points
            .map((point, index) =>
                index === 0
                    ? `M ${point.x} ${point.y}`
                    : `L ${point.x} ${point.y}`
            )
            .join(" ");

        const areaPath = `
            ${linePath}
            L ${points[points.length - 1]?.x || paddingLeft}
              ${paddingTop + graphHeight}
            L ${points[0]?.x || paddingLeft}
              ${paddingTop + graphHeight}
            Z
        `;

        return {
            width,
            height,
            paddingLeft,
            paddingRight,
            paddingTop,
            paddingBottom,
            graphWidth,
            graphHeight,
            maxValue,
            points,
            linePath,
            areaPath,
        };
    }, [inventoryTrend]);

    // ============================================================
    // PRICE FORMATTER
    // ============================================================

    const formatPrice = (price) => {
        return `TZS ${Number(price || 0).toLocaleString("en-TZ", {
            maximumFractionDigits: 0,
        })}`;
    };

    return (
        <AdminLayout>
            {/* HEADER */}
            <header className="border-b border-[#8B1A1A]/20 bg-white">
                <div className="mx-auto max-w-7xl px-5 py-6 md:px-8">

                    <Link
                        to="/admin/dashboard"
                        className="mb-5 inline-flex items-center gap-2 text-sm font-bold text-[#8B1A1A] transition hover:text-[#6B1515]"
                    >
                        <ArrowLeft size={17} />
                        Back to Dashboard
                    </Link>

                    <div className="flex items-center gap-4">

                        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#8B1A1A]/10">
                            <BarChart3
                                size={27}
                                className="text-[#8B1A1A]"
                            />
                        </div>

                        <div>
                            <p className="text-sm font-bold uppercase tracking-[0.2em] text-[#8B1A1A]">
                                Bingwa Magari Used
                            </p>

                            <h1 className="mt-1 text-3xl font-extrabold text-[#2D1B0E]">
                                Analytics
                            </h1>
                        </div>
                    </div>

                    <p className="mt-4 max-w-2xl text-[#6A5A4A]">
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

                    <AnalyticsCardRed
                        title="Total Vehicles"
                        value={loading ? "..." : statistics.total}
                        icon={CarFront}
                    />

                    <AnalyticsCardRed
                        title="Available"
                        value={loading ? "..." : statistics.available}
                        icon={CheckCircle2}
                    />

                    <AnalyticsCardRed
                        title="Sold"
                        value={loading ? "..." : statistics.sold}
                        icon={CircleDollarSign}
                    />

                    <AnalyticsCardRed
                        title="Featured"
                        value={loading ? "..." : statistics.featured}
                        icon={Star}
                    />

                </div>

                {/* INVENTORY VALUE */}
                <div className="mt-6 rounded-2xl border border-[#8B1A1A]/20 bg-white p-6 shadow-sm">

                    <div className="flex items-center gap-4">

                        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#8B1A1A]/10">
                            <TrendingUp
                                size={23}
                                className="text-[#8B1A1A]"
                            />
                        </div>

                        <div>
                            <p className="text-sm font-semibold text-[#6A5A4A]">
                                Total Inventory Value
                            </p>

                            <p className="mt-1 text-3xl font-extrabold text-[#2D1B0E]">
                                {loading
                                    ? "..."
                                    : formatPrice(
                                          statistics.inventoryValue
                                      )}
                            </p>
                        </div>

                    </div>
                </div>

                {/* ========================================================
                    DYNAMIC INVENTORY GRAPH
                ========================================================= */}

                <section className="mt-6 rounded-2xl border border-[#8B1A1A]/20 bg-white p-6 shadow-sm">

                    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

                        <div className="flex items-center gap-3">

                            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#8B1A1A]/10">
                                <TrendingUp
                                    size={21}
                                    className="text-[#8B1A1A]"
                                />
                            </div>

                            <div>
                                <h2 className="font-extrabold text-[#2D1B0E]">
                                    Inventory Activity
                                </h2>

                                <p className="text-sm text-[#6A5A4A]">
                                    Vehicles added during the last 7 days
                                </p>
                            </div>

                        </div>

                        <div className="flex items-center gap-2 rounded-lg bg-[#FDF8F5] px-3 py-2 text-xs font-bold text-[#6A5A4A]">
                            <CalendarDays size={15} />
                            Last 7 days
                        </div>

                    </div>

                    {loading ? (
                        <div className="mt-8 flex h-[280px] items-center justify-center">
                            <div className="text-sm font-semibold text-[#8A7A6A]">
                                Loading graph...
                            </div>
                        </div>
                    ) : (
                        <div className="mt-6 w-full overflow-x-auto">

                            <svg
                                viewBox={`0 0 ${graph.width} ${graph.height}`}
                                className="h-[280px] min-w-[700px] w-full"
                                preserveAspectRatio="none"
                            >

                                {/* GRID LINES */}

                                {[0, 1, 2, 3, 4].map((line) => {
                                    const y =
                                        graph.paddingTop +
                                        (line / 4) *
                                            graph.graphHeight;

                                    const value = Math.round(
                                        graph.maxValue -
                                            (line / 4) *
                                                graph.maxValue
                                    );

                                    return (
                                        <g key={line}>

                                            <line
                                                x1={graph.paddingLeft}
                                                x2={
                                                    graph.width -
                                                    graph.paddingRight
                                                }
                                                y1={y}
                                                y2={y}
                                                stroke="#EADFD8"
                                                strokeWidth="1"
                                                strokeDasharray="4 6"
                                            />

                                            <text
                                                x={
                                                    graph.paddingLeft -
                                                    12
                                                }
                                                y={y + 4}
                                                textAnchor="end"
                                                className="fill-[#8A7A6A] text-[11px]"
                                            >
                                                {value}
                                            </text>

                                        </g>
                                    );
                                })}

                                {/* AREA */}

                                <path
                                    d={graph.areaPath}
                                    fill="#8B1A1A"
                                    fillOpacity="0.08"
                                />

                                {/* LINE */}

                                <path
                                    d={graph.linePath}
                                    fill="none"
                                    stroke="#8B1A1A"
                                    strokeWidth="4"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                />

                                {/* POINTS */}

                                {graph.points.map((point) => (
                                    <g key={point.label + point.x}>

                                        <circle
                                            cx={point.x}
                                            cy={point.y}
                                            r="7"
                                            fill="white"
                                            stroke="#8B1A1A"
                                            strokeWidth="3"
                                        />

                                        <text
                                            x={point.x}
                                            y={point.y - 14}
                                            textAnchor="middle"
                                            className="fill-[#2D1B0E] text-[11px] font-bold"
                                        >
                                            {point.count}
                                        </text>

                                        <text
                                            x={point.x}
                                            y={
                                                graph.height -
                                                15
                                            }
                                            textAnchor="middle"
                                            className="fill-[#8A7A6A] text-[11px] font-semibold"
                                        >
                                            {point.label}
                                        </text>

                                    </g>
                                ))}

                            </svg>
                        </div>
                    )}

                    <div className="mt-4 flex items-center gap-2 text-xs font-semibold text-[#8A7A6A]">
                        <span className="h-2.5 w-2.5 rounded-full bg-[#8B1A1A]" />
                        Vehicles added
                    </div>

                </section>

                {/* CHARTS / BREAKDOWN */}
                <div className="mt-6 grid gap-6 lg:grid-cols-2">

                    {/* BRANDS */}
                    <section className="rounded-2xl border border-[#8B1A1A]/20 bg-white p-6 shadow-sm">

                        <div className="flex items-center gap-3">

                            <CarFront
                                size={21}
                                className="text-[#8B1A1A]"
                            />

                            <div>
                                <h2 className="font-extrabold text-[#2D1B0E]">
                                    Vehicles by Brand
                                </h2>

                                <p className="text-sm text-[#6A5A4A]">
                                    Top brands in inventory
                                </p>
                            </div>

                        </div>

                        <div className="mt-6 space-y-5">

                            {brands.length === 0 ? (
                                <p className="text-sm text-[#6A5A4A]">
                                    No vehicle data available.
                                </p>
                            ) : (
                                brands.map(([brand, count]) => {

                                    const percentage =
                                        statistics.total > 0
                                            ? Math.round(
                                                  (count /
                                                      statistics.total) *
                                                      100
                                              )
                                            : 0;

                                    return (
                                        <div key={brand}>

                                            <div className="mb-2 flex justify-between">

                                                <span className="text-sm font-bold text-[#2D1B0E]">
                                                    {brand}
                                                </span>

                                                <span className="text-xs font-bold text-[#8A7A6A]">
                                                    {count} vehicles
                                                </span>

                                            </div>

                                            <div className="h-2 overflow-hidden rounded-full border border-[#8B1A1A]/10 bg-[#FDF8F5]">

                                                <div
                                                    className="h-full rounded-full bg-[#8B1A1A] transition-all duration-700"
                                                    style={{
                                                        width: `${percentage}%`,
                                                    }}
                                                />

                                            </div>

                                        </div>
                                    );
                                })
                            )}

                        </div>
                    </section>

                    {/* FUEL */}
                    <section className="rounded-2xl border border-[#8B1A1A]/20 bg-white p-6 shadow-sm">

                        <div className="flex items-center gap-3">

                            <Fuel
                                size={21}
                                className="text-[#8B1A1A]"
                            />

                            <div>
                                <h2 className="font-extrabold text-[#2D1B0E]">
                                    Fuel Distribution
                                </h2>

                                <p className="text-sm text-[#6A5A4A]">
                                    Vehicles by fuel type
                                </p>
                            </div>

                        </div>

                        <div className="mt-6 space-y-5">

                            {fuelTypes.length === 0 ? (
                                <p className="text-sm text-[#6A5A4A]">
                                    No fuel data available.
                                </p>
                            ) : (
                                fuelTypes.map(([fuel, count]) => {

                                    const percentage =
                                        statistics.total > 0
                                            ? Math.round(
                                                  (count /
                                                      statistics.total) *
                                                      100
                                              )
                                            : 0;

                                    return (
                                        <div key={fuel}>

                                            <div className="mb-2 flex justify-between">

                                                <span className="text-sm font-bold capitalize text-[#2D1B0E]">
                                                    {fuel}
                                                </span>

                                                <span className="text-xs font-bold text-[#8A7A6A]">
                                                    {count} vehicles
                                                </span>

                                            </div>

                                            <div className="h-2 overflow-hidden rounded-full border border-[#8B1A1A]/10 bg-[#FDF8F5]">

                                                <div
                                                    className="h-full rounded-full bg-[#8B1A1A] transition-all duration-700"
                                                    style={{
                                                        width: `${percentage}%`,
                                                    }}
                                                />

                                            </div>

                                        </div>
                                    );
                                })
                            )}

                        </div>
                    </section>

                </div>

                {/* STATUS */}
                <section className="mt-6 rounded-2xl border border-[#8B1A1A]/20 bg-white p-6 shadow-sm">

                    <h2 className="text-lg font-extrabold text-[#2D1B0E]">
                        Inventory Status
                    </h2>

                    <div className="mt-5 grid gap-4 sm:grid-cols-3">

                        <StatusCardRed
                            label="Available"
                            value={statistics.available}
                        />

                        <StatusCardRed
                            label="Reserved"
                            value={statistics.reserved}
                        />

                        <StatusCardRed
                            label="Sold"
                            value={statistics.sold}
                        />

                    </div>

                </section>

            </main>
        </AdminLayout>
    );
}

// ============================================================
// ANALYTICS CARD
// ============================================================

function AnalyticsCardRed({
    title,
    value,
    icon: Icon,
}) {
    return (
        <div className="rounded-2xl border border-[#8B1A1A]/15 bg-white p-5 shadow-sm transition hover:border-[#8B1A1A]/30 hover:shadow-md">

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

// ============================================================
// STATUS CARD
// ============================================================

function StatusCardRed({
    label,
    value,
}) {
    return (
        <div className="rounded-xl border border-[#8B1A1A]/10 bg-[#FDF8F5] p-5">

            <p className="text-sm font-semibold text-[#6A5A4A]">
                {label}
            </p>

            <p className="mt-2 text-2xl font-extrabold text-[#2D1B0E]">
                {value}
            </p>

        </div>
    );
}

export default Analytics;
