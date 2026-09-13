
import { useEffect, useState } from "react";

import { Link } from "react-router-dom";

import {
    ArrowRight,
    CarFront,
    CheckCircle2,
    Clock3,
    Loader2,
    MapPin,
    PackageCheck,
    ShoppingCart,
    XCircle,
} from "lucide-react";

import { useTranslation } from "react-i18next";

import Navbar from "../../components/Navbar";
import { getMyOrders } from "../../services/orderService";
import { isCustomerAuthenticated } from "../../services/customerAuthService";

function Orders() {
    const { t, i18n } = useTranslation();

    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const loadOrders = async () => {
            try {
                setLoading(true);
                setError("");

                if (!isCustomerAuthenticated()) {
                    window.location.href = "/login";
                    return;
                }

                const data = await getMyOrders();

                if (Array.isArray(data)) {
                    setOrders(data);
                } else if (Array.isArray(data?.results)) {
                    setOrders(data.results);
                } else {
                    setOrders([]);
                }
            } catch (err) {
                console.error("Failed to load orders:", err);

                setError(
                    err.message || t("orders.errors.load")
                );
            } finally {
                setLoading(false);
            }
        };

        loadOrders();
    }, [t]);

    // ============================================================
    // FORMAT PRICE
    // ============================================================

    const formatPrice = (price) => {
        return `TZS ${Number(price || 0).toLocaleString("en-TZ", {
            maximumFractionDigits: 0,
        })}`;
    };

    // ============================================================
    // FORMAT DATE
    // ============================================================

    const formatDate = (date) => {
        if (!date) {
            return "—";
        }

        const locale =
            i18n.language === "sw"
                ? "sw-TZ"
                : "en-GB";

        return new Date(date).toLocaleDateString(locale, {
            year: "numeric",
            month: "short",
            day: "numeric",
        });
    };

    // ============================================================
    // STATUS CONFIG
    // ============================================================

    const getStatusConfig = (status) => {
        switch (status) {
            case "pending":
                return {
                    label: t("orders.status.pending"),
                    className:
                        "bg-yellow-50 text-yellow-700 border-yellow-100",
                    icon: Clock3,
                };

            case "confirmed":
                return {
                    label: t("orders.status.confirmed"),
                    className:
                        "bg-blue-50 text-blue-700 border-blue-100",
                    icon: CheckCircle2,
                };

            case "processing":
                return {
                    label: t("orders.status.processing"),
                    className:
                        "bg-purple-50 text-purple-700 border-purple-100",
                    icon: PackageCheck,
                };

            case "completed":
                return {
                    label: t("orders.status.completed"),
                    className:
                        "bg-green-50 text-green-700 border-green-100",
                    icon: CheckCircle2,
                };

            case "cancelled":
                return {
                    label: t("orders.status.cancelled"),
                    className:
                        "bg-red-50 text-red-700 border-red-100",
                    icon: XCircle,
                };

            default:
                return {
                    label:
                        status ||
                        t("orders.status.unknown"),
                    className:
                        "bg-slate-50 text-slate-600 border-slate-100",
                    icon: Clock3,
                };
        }
    };

    // ============================================================
    // LOADING
    // ============================================================

    if (loading) {
        return (
            <div className="min-h-screen bg-[#FDF8F5]">
                <Navbar />

                <div className="flex min-h-[70vh] items-center justify-center">
                    <div className="flex items-center gap-3 text-[#2D1B0E]">
                        <Loader2
                            size={27}
                            className="animate-spin text-[#B22222]"
                        />

                        <span className="font-bold">
                            {t("orders.loading")}
                        </span>
                    </div>
                </div>
            </div>
        );
    }

    // ============================================================
    // PAGE
    // ============================================================

    return (
        <div className="min-h-screen bg-[#FDF8F5]">
            <Navbar />

            {/* HEADER */}
            <div className="border-b border-[#F4A460]/20 bg-white">
                <div className="mx-auto max-w-7xl px-5 py-8 md:px-8">
                    <p className="text-sm font-bold uppercase tracking-[0.2em] text-[#B22222]">
                        {t("orders.eyebrow")}
                    </p>

                    <h1 className="mt-2 text-3xl font-black text-[#2D1B0E] md:text-4xl">
                        {t("orders.title")}
                    </h1>

                    <p className="mt-2 max-w-2xl text-[#6A5A4A]">
                        {t("orders.description")}
                    </p>
                </div>
            </div>

            <main className="mx-auto max-w-7xl px-5 py-10 md:px-8">
                {/* ERROR */}
                {error && (
                    <div className="mb-6 rounded-2xl border border-red-100 bg-red-50 px-5 py-4 text-sm font-semibold text-red-600">
                        {error}
                    </div>
                )}

                {/* EMPTY */}
                {!error && orders.length === 0 && (
                    <div className="rounded-3xl border border-[#F4A460]/20 bg-white px-6 py-20 text-center shadow-sm">
                        <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-3xl border border-[#F4A460]/20 bg-[#B22222]/10">
                            <ShoppingCart
                                size={35}
                                className="text-[#B22222]"
                            />
                        </div>

                        <h2 className="mt-6 text-2xl font-black text-[#2D1B0E]">
                            {t("orders.empty.title")}
                        </h2>

                        <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-[#6A5A4A]">
                            {t("orders.empty.description")}
                        </p>

                        <Link
                            to="/vehicles"
                            className="mt-7 inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-[#B22222] to-[#8B1A1A] px-6 py-3.5 text-sm font-bold text-white shadow-lg shadow-[#B22222]/20 transition hover:shadow-xl hover:shadow-[#B22222]/40"
                        >
                            {t("orders.empty.browseVehicles")}
                            <ArrowRight size={18} />
                        </Link>
                    </div>
                )}

                {/* ORDERS */}
                {orders.length > 0 && (
                    <div className="space-y-5">
                        {orders.map((order) => {
                            const status = getStatusConfig(
                                order.status
                            );

                            const StatusIcon = status.icon;

                            return (
                                <div
                                    key={order.id}
                                    className="overflow-hidden rounded-3xl border border-[#F4A460]/20 bg-white shadow-sm transition hover:shadow-md"
                                >
                                    <div className="p-5 md:p-6">
                                        {/* TOP */}
                                        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                                            <div>
                                                <p className="text-xs font-bold uppercase tracking-wider text-[#8A7A6A]">
                                                    {t(
                                                        "orders.orderNumber"
                                                    )}
                                                </p>

                                                <h2 className="mt-1 text-xl font-black text-[#2D1B0E]">
                                                    {order.order_number}
                                                </h2>
                                            </div>

                                            <div
                                                className={`inline-flex w-fit items-center gap-2 rounded-full border px-3.5 py-2 text-xs font-bold ${status.className}`}
                                            >
                                                <StatusIcon size={15} />
                                                {status.label}
                                            </div>
                                        </div>

                                        {/* CONTENT */}
                                        <div className="mt-6 grid gap-6 lg:grid-cols-[1fr_auto]">
                                            <div className="flex gap-4">
                                                {/* VEHICLE ICON */}
                                                <div className="flex h-20 w-24 shrink-0 items-center justify-center overflow-hidden rounded-2xl border border-[#F4A460]/20 bg-[#B22222]/10">
                                                    <CarFront
                                                        size={32}
                                                        className="text-[#B22222]"
                                                    />
                                                </div>

                                                {/* VEHICLE */}
                                                <div className="min-w-0">
                                                    <p className="text-xs font-bold uppercase tracking-wider text-[#B22222]">
                                                        {t(
                                                            "orders.vehicle"
                                                        )}
                                                    </p>

                                                    <h3 className="mt-1 truncate text-lg font-black text-[#2D1B0E]">
                                                        {order.vehicle_name ||
                                                            t(
                                                                "orders.vehicleFallback"
                                                            )}
                                                    </h3>

                                                    <p className="mt-2 text-lg font-black text-[#B22222]">
                                                        {formatPrice(
                                                            order.price
                                                        )}
                                                    </p>
                                                </div>
                                            </div>

                                            {/* DETAILS */}
                                            <div className="grid gap-3 sm:grid-cols-3 lg:min-w-[420px]">
                                                <div className="rounded-xl border border-[#F4A460]/10 bg-[#FDF8F5] p-3">
                                                    <p className="text-xs text-[#8A7A6A]">
                                                        {t(
                                                            "orders.orderDate"
                                                        )}
                                                    </p>

                                                    <p className="mt-1 text-sm font-bold text-[#2D1B0E]">
                                                        {formatDate(
                                                            order.created_at
                                                        )}
                                                    </p>
                                                </div>

                                                <div className="rounded-xl border border-[#F4A460]/10 bg-[#FDF8F5] p-3">
                                                    <p className="text-xs text-[#8A7A6A]">
                                                        {t(
                                                            "orders.fulfillment"
                                                        )}
                                                    </p>

                                                    <p className="mt-1 text-sm font-bold capitalize text-[#2D1B0E]">
                                                        {order.fulfillment_method ===
                                                        "delivery"
                                                            ? t(
                                                                  "orders.fulfillmentOptions.delivery"
                                                              )
                                                            : t(
                                                                  "orders.fulfillmentOptions.pickup"
                                                              )}
                                                    </p>
                                                </div>

                                                <div className="rounded-xl border border-[#F4A460]/10 bg-[#FDF8F5] p-3">
                                                    <p className="text-xs text-[#8A7A6A]">
                                                        {t(
                                                            "orders.location"
                                                        )}
                                                    </p>

                                                    <p className="mt-1 flex items-center gap-1 truncate text-sm font-bold text-[#2D1B0E]">
                                                        <MapPin
                                                            size={14}
                                                            className="shrink-0 text-[#B22222]"
                                                        />

                                                        {order.location ||
                                                            t(
                                                                "orders.locationNotSpecified"
                                                            )}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>

                                        {/* FOOTER */}
                                        <div className="mt-6 flex flex-col gap-3 border-t border-[#F4A460]/10 pt-5 sm:flex-row sm:items-center sm:justify-between">
                                            <p className="text-sm text-[#6A5A4A]">
                                                {t(
                                                    "orders.nextSteps"
                                                )}
                                            </p>

                                            <Link
                                                to={`/orders/${order.id}`}
                                                className="inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#B22222] to-[#8B1A1A] px-5 py-3 text-sm font-bold text-white shadow-lg shadow-[#B22222]/20 transition hover:shadow-xl hover:shadow-[#B22222]/40"
                                            >
                                                {t(
                                                    "orders.viewOrder"
                                                )}

                                                <ArrowRight size={17} />
                                            </Link>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </main>
        </div>
    );
}

export default Orders;

