
import { useEffect, useState } from "react";

import { Link, useParams } from "react-router-dom";

import {
    ArrowLeft,
    CarFront,
    CheckCircle2,
    Clock3,
    Loader2,
    Mail,
    MapPin,
    PackageCheck,
    Phone,
    User,
    XCircle,
} from "lucide-react";

import { useTranslation } from "react-i18next";

import Navbar from "../../components/Navbar";

import { getOrder } from "../../services/orderService";

import { isCustomerAuthenticated } from "../../services/customerAuthService";

function OrderDetails() {
    const { id } = useParams();

    const { t, i18n } = useTranslation();

    const [order, setOrder] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    // ============================================================
    // LOAD ORDER
    // ============================================================

    useEffect(() => {
        const loadOrder = async () => {
            try {
                setLoading(true);
                setError("");

                if (!isCustomerAuthenticated()) {
                    window.location.href = "/login";
                    return;
                }

                const data = await getOrder(id);

                setOrder(data);
            } catch (err) {
                console.error(
                    "Failed to load order:",
                    err
                );

                setError(
                    err.message ||
                        t("orderDetails.errors.load")
                );
            } finally {
                setLoading(false);
            }
        };

        loadOrder();
    }, [id, t]);

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

        return new Date(date).toLocaleString(locale, {
            year: "numeric",
            month: "long",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit",
        });
    };

    // ============================================================
    // STATUS
    // ============================================================

    const getStatusConfig = (status) => {
        switch (status) {
            case "pending":
                return {
                    label: t(
                        "orderDetails.status.pending"
                    ),
                    className:
                        "bg-yellow-50 text-yellow-700 border-yellow-100",
                    icon: Clock3,
                };

            case "confirmed":
                return {
                    label: t(
                        "orderDetails.status.confirmed"
                    ),
                    className:
                        "bg-blue-50 text-blue-700 border-blue-100",
                    icon: CheckCircle2,
                };

            case "processing":
                return {
                    label: t(
                        "orderDetails.status.processing"
                    ),
                    className:
                        "bg-purple-50 text-purple-700 border-purple-100",
                    icon: PackageCheck,
                };

            case "completed":
                return {
                    label: t(
                        "orderDetails.status.completed"
                    ),
                    className:
                        "bg-green-50 text-green-700 border-green-100",
                    icon: CheckCircle2,
                };

            case "cancelled":
                return {
                    label: t(
                        "orderDetails.status.cancelled"
                    ),
                    className:
                        "bg-red-50 text-red-700 border-red-100",
                    icon: XCircle,
                };

            default:
                return {
                    label:
                        status ||
                        t(
                            "orderDetails.status.unknown"
                        ),
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
                            {t(
                                "orderDetails.loading"
                            )}
                        </span>
                    </div>
                </div>
            </div>
        );
    }

    // ============================================================
    // ERROR
    // ============================================================

    if (error || !order) {
        return (
            <div className="min-h-screen bg-[#FDF8F5]">
                <Navbar />

                <main className="mx-auto max-w-3xl px-5 py-16 md:px-8">
                    <div className="rounded-3xl border border-red-100 bg-white px-6 py-20 text-center shadow-sm">
                        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-red-50">
                            <XCircle
                                size={32}
                                className="text-red-500"
                            />
                        </div>

                        <h1 className="mt-5 text-2xl font-black text-[#2D1B0E]">
                            {t(
                                "orderDetails.notFound.title"
                            )}
                        </h1>

                        <p className="mt-2 text-sm text-[#6A5A4A]">
                            {error ||
                                t(
                                    "orderDetails.notFound.description"
                                )}
                        </p>

                        <Link
                            to="/orders"
                            className="mt-6 inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-[#B22222] to-[#8B1A1A] px-5 py-3 text-sm font-bold text-white shadow-lg shadow-[#B22222]/20 transition hover:shadow-xl hover:shadow-[#B22222]/40"
                        >
                            <ArrowLeft size={17} />

                            {t(
                                "orderDetails.backToOrders"
                            )}
                        </Link>
                    </div>
                </main>
            </div>
        );
    }

    const status = getStatusConfig(order.status);

    const StatusIcon = status.icon;

    const fulfillmentMethod =
        order.fulfillment_method === "delivery"
            ? t(
                  "orderDetails.fulfillmentOptions.delivery"
              )
            : t(
                  "orderDetails.fulfillmentOptions.pickup"
              );

    return (
        <div className="min-h-screen bg-[#FDF8F5]">
            <Navbar />

            {/* HEADER */}
            <div className="border-b border-[#F4A460]/20 bg-white">
                <div className="mx-auto max-w-7xl px-5 py-5 md:px-8">
                    <Link
                        to="/orders"
                        className="inline-flex items-center gap-2 text-sm font-bold text-[#6A5A4A] transition hover:text-[#B22222]"
                    >
                        <ArrowLeft size={17} />

                        {t(
                            "orderDetails.backToOrders"
                        )}
                    </Link>
                </div>
            </div>

            <main className="mx-auto max-w-7xl px-5 py-10 md:px-8">
                {/* TITLE */}
                <div className="mb-8 flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
                    <div>
                        <p className="text-sm font-bold uppercase tracking-[0.2em] text-[#B22222]">
                            {t(
                                "orderDetails.eyebrow"
                            )}
                        </p>

                        <h1 className="mt-2 text-3xl font-black text-[#2D1B0E] md:text-4xl">
                            {order.order_number}
                        </h1>

                        <p className="mt-2 text-sm text-[#8A7A6A]">
                            {t(
                                "orderDetails.placedOn"
                            )}{" "}
                            {formatDate(
                                order.created_at
                            )}
                        </p>
                    </div>

                    <div
                        className={`inline-flex w-fit items-center gap-2 rounded-full border px-4 py-2.5 text-sm font-bold ${status.className}`}
                    >
                        <StatusIcon size={17} />

                        {status.label}
                    </div>
                </div>

                <div className="grid gap-6 lg:grid-cols-[1fr_380px]">
                    {/* LEFT */}
                    <div className="space-y-6">
                        {/* VEHICLE */}
                        <section className="rounded-3xl border border-[#F4A460]/20 bg-white p-6 shadow-sm md:p-8">
                            <div className="flex items-center gap-3">
                                <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-[#F4A460]/20 bg-[#B22222]/10">
                                    <CarFront
                                        size={22}
                                        className="text-[#B22222]"
                                    />
                                </div>

                                <div>
                                    <p className="text-xs font-bold uppercase tracking-wider text-[#B22222]">
                                        {t(
                                            "orderDetails.vehicle"
                                        )}
                                    </p>

                                    <h2 className="text-xl font-black text-[#2D1B0E]">
                                        {order.vehicle_name ||
                                            t(
                                                "orderDetails.vehicleFallback"
                                            )}
                                    </h2>
                                </div>
                            </div>

                            <div className="mt-7 rounded-2xl border border-[#F4A460]/20 bg-[#FDF8F5] p-6">
                                <p className="text-sm text-[#6A5A4A]">
                                    {t(
                                        "orderDetails.vehiclePrice"
                                    )}
                                </p>

                                <p className="mt-1 text-3xl font-black text-[#2D1B0E]">
                                    {formatPrice(
                                        order.price
                                    )}
                                </p>
                            </div>
                        </section>

                        {/* CUSTOMER INFORMATION */}
                        <section className="rounded-3xl border border-[#F4A460]/20 bg-white p-6 shadow-sm md:p-8">
                            <h2 className="text-xl font-black text-[#2D1B0E]">
                                {t(
                                    "orderDetails.customerInformation"
                                )}
                            </h2>

                            <div className="mt-6 grid gap-4 sm:grid-cols-2">
                                <InfoItemRed
                                    icon={
                                        <User size={18} />
                                    }
                                    label={t(
                                        "orderDetails.fields.fullName"
                                    )}
                                    value={
                                        order.full_name
                                    }
                                />

                                <InfoItemRed
                                    icon={
                                        <Phone size={18} />
                                    }
                                    label={t(
                                        "orderDetails.fields.phone"
                                    )}
                                    value={
                                        order.phone
                                    }
                                />

                                <InfoItemRed
                                    icon={
                                        <Mail size={18} />
                                    }
                                    label={t(
                                        "orderDetails.fields.email"
                                    )}
                                    value={
                                        order.email
                                    }
                                />

                                <InfoItemRed
                                    icon={
                                        <MapPin
                                            size={18}
                                        />
                                    }
                                    label={t(
                                        "orderDetails.fields.location"
                                    )}
                                    value={
                                        order.location ||
                                        t(
                                            "orderDetails.locationNotSpecified"
                                        )
                                    }
                                />
                            </div>
                        </section>

                        {/* NOTES */}
                        {order.notes && (
                            <section className="rounded-3xl border border-[#F4A460]/20 bg-white p-6 shadow-sm md:p-8">
                                <h2 className="text-xl font-black text-[#2D1B0E]">
                                    {t(
                                        "orderDetails.additionalNotes"
                                    )}
                                </h2>

                                <p className="mt-4 whitespace-pre-line leading-7 text-[#6A5A4A]">
                                    {order.notes}
                                </p>
                            </section>
                        )}
                    </div>

                    {/* RIGHT */}
                    <aside className="h-fit space-y-6">
                        {/* ORDER SUMMARY */}
                        <section className="rounded-3xl border border-[#F4A460]/20 bg-white p-6 shadow-sm">
                            <h2 className="text-xl font-black text-[#2D1B0E]">
                                {t(
                                    "orderDetails.orderSummary"
                                )}
                            </h2>

                            <div className="mt-6 space-y-4">
                                <SummaryRowRed
                                    label={t(
                                        "orderDetails.summary.orderNumber"
                                    )}
                                    value={
                                        order.order_number
                                    }
                                />

                                <SummaryRowRed
                                    label={t(
                                        "orderDetails.summary.vehicle"
                                    )}
                                    value={
                                        order.vehicle_name ||
                                        t(
                                            "orderDetails.vehicleFallback"
                                        )
                                    }
                                />

                                <SummaryRowRed
                                    label={t(
                                        "orderDetails.summary.fulfillment"
                                    )}
                                    value={
                                        fulfillmentMethod
                                    }
                                />

                                <SummaryRowRed
                                    label={t(
                                        "orderDetails.summary.created"
                                    )}
                                    value={formatDate(
                                        order.created_at
                                    )}
                                />

                                <SummaryRowRed
                                    label={t(
                                        "orderDetails.summary.lastUpdated"
                                    )}
                                    value={formatDate(
                                        order.updated_at
                                    )}
                                />
                            </div>

                            <div className="mt-6 border-t border-[#F4A460]/20 pt-5">
                                <div className="flex items-center justify-between">
                                    <span className="font-black text-[#2D1B0E]">
                                        {t(
                                            "orderDetails.total"
                                        )}
                                    </span>

                                    <span className="text-2xl font-black text-[#B22222]">
                                        {formatPrice(
                                            order.price
                                        )}
                                    </span>
                                </div>
                            </div>
                        </section>

                        {/* FULFILLMENT */}
                        <section className="rounded-3xl border border-[#F4A460]/20 bg-[#FDF8F5] p-6">
                            <p className="text-xs font-bold uppercase tracking-wider text-[#B22222]">
                                {t(
                                    "orderDetails.fulfillment"
                                )}
                            </p>

                            <h3 className="mt-2 text-xl font-black capitalize text-[#2D1B0E]">
                                {fulfillmentMethod}
                            </h3>

                            <p className="mt-3 text-sm leading-6 text-[#6A5A4A]">
                                {order.fulfillment_method ===
                                "delivery"
                                    ? t(
                                          "orderDetails.fulfillmentDescriptions.delivery"
                                      )
                                    : t(
                                          "orderDetails.fulfillmentDescriptions.pickup"
                                      )}
                            </p>

                            {order.location && (
                                <div className="mt-4 flex items-start gap-2 text-sm font-semibold text-[#2D1B0E]">
                                    <MapPin
                                        size={18}
                                        className="mt-0.5 shrink-0 text-[#B22222]"
                                    />

                                    <span>
                                        {order.location}
                                    </span>
                                </div>
                            )}
                        </section>

                        {/* STATUS */}
                        <section className="rounded-3xl border border-[#F4A460]/20 bg-white p-6 shadow-sm">
                            <div className="flex items-center gap-3">
                                <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-[#F4A460]/20 bg-[#B22222]/10">
                                    <StatusIcon
                                        size={20}
                                        className="text-[#B22222]"
                                    />
                                </div>

                                <div>
                                    <p className="text-xs font-bold uppercase tracking-wider text-[#8A7A6A]">
                                        {t(
                                            "orderDetails.currentStatus"
                                        )}
                                    </p>

                                    <p className="mt-1 font-black capitalize text-[#2D1B0E]">
                                        {status.label}
                                    </p>
                                </div>
                            </div>

                            <p className="mt-4 text-sm leading-6 text-[#6A5A4A]">
                                {t(
                                    "orderDetails.statusDescription"
                                )}
                            </p>
                        </section>
                    </aside>
                </div>
            </main>
        </div>
    );
}

// ============================================================
// INFO ITEM
// ============================================================

function InfoItemRed({
    icon,
    label,
    value,
}) {
    return (
        <div className="rounded-2xl border border-[#F4A460]/10 bg-[#FDF8F5] p-4 transition hover:border-[#B22222]/20 hover:bg-white">
            <div className="flex items-center gap-2 text-[#B22222]">
                {icon}

                <span className="text-xs font-bold uppercase tracking-wider text-[#8A7A6A]">
                    {label}
                </span>
            </div>

            <p className="mt-2 break-words text-sm font-bold text-[#2D1B0E]">
                {value || "—"}
            </p>
        </div>
    );
}

// ============================================================
// SUMMARY ROW
// ============================================================

function SummaryRowRed({
    label,
    value,
    capitalize = false,
}) {
    return (
        <div className="flex items-start justify-between gap-4 border-b border-[#F4A460]/10 pb-3">
            <span className="text-sm text-[#8A7A6A]">
                {label}
            </span>

            <span
                className={`max-w-[60%] text-right text-sm font-bold text-[#2D1B0E] ${
                    capitalize ? "capitalize" : ""
                }`}
            >
                {value || "—"}
            </span>
        </div>
    );
}

export default OrderDetails;
