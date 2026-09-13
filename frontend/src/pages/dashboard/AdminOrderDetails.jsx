import { useEffect, useState } from "react";
import AdminLayout from "../../layouts/AdminLayout";
import {
    Link,
    useNavigate,
    useParams,
} from "react-router-dom";

import {
    ArrowLeft,
    CarFront,
    CheckCircle2,
    Clock3,
    ClipboardList,
    Mail,
    MapPin,
    Phone,
    User,
    Truck,
    PackageCheck,
    XCircle,
    Save,
    Loader2,
    RefreshCw,
} from "lucide-react";

import {
    getAdminOrder,
    updateAdminOrder,
} from "../../services/adminOrderService";


// ============================================================
// ADMIN ORDER DETAILS
// ============================================================

function AdminOrderDetails() {

    const {
        id,
    } = useParams();

    const navigate =
        useNavigate();


    // ========================================================
    // STATE
    // ========================================================

    const [order, setOrder] =
        useState(null);

    const [loading, setLoading] =
        useState(true);

    const [saving, setSaving] =
        useState(false);

    const [error, setError] =
        useState("");

    const [success, setSuccess] =
        useState("");

    const [status, setStatus] =
        useState("");


    // ========================================================
    // STATUS OPTIONS
    // ========================================================

    const statusOptions = [
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
    // LOAD ORDER
    // ========================================================

    const loadOrder = async () => {

        try {

            setLoading(true);
            setError("");
            setSuccess("");

            const data =
                await getAdminOrder(id);

            setOrder(data);

            setStatus(
                data.status || "pending"
            );

        } catch (err) {

            console.error(
                "Failed to load admin order:",
                err
            );

            setError(
                err.message ||
                "Unable to load this order."
            );

        } finally {

            setLoading(false);
        }
    };


    // ========================================================
    // INITIAL LOAD
    // ========================================================

    useEffect(() => {

        loadOrder();

    }, [id]);


    // ========================================================
    // UPDATE STATUS
    // ========================================================

    const handleStatusUpdate =
        async () => {

            if (!order) {
                return;
            }

            if (
                status === order.status
            ) {

                setSuccess(
                    "No changes were made."
                );

                return;
            }


            try {

                setSaving(true);
                setError("");
                setSuccess("");

                const updated =
                    await updateAdminOrder(
                        order.id,
                        {
                            status,
                        }
                    );

                setOrder(updated);

                setStatus(
                    updated.status
                );

                setSuccess(
                    "Order status updated successfully."
                );

            } catch (err) {

                console.error(
                    "Failed to update order:",
                    err
                );

                setError(
                    err.message ||
                    "Failed to update order status."
                );

            } finally {

                setSaving(false);
            }
        };


    // ========================================================
    // FORMAT PRICE
    // ========================================================

    const formatPrice =
        (price) => {

            return Number(
                price || 0
            ).toLocaleString();
        };


    // ========================================================
    // FORMAT DATE
    // ========================================================

    const formatDate =
        (date) => {

            if (!date) {
                return "—";
            }

            try {

                return new Date(
                    date
                ).toLocaleString(
                    "en-GB",
                    {
                        day: "2-digit",
                        month: "short",
                        year: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                    }
                );

            } catch {

                return "—";
            }
        };


    // ========================================================
    // STATUS BADGE
    // ========================================================

    const getStatusBadge =
        (currentStatus) => {

            const normalized =
                String(
                    currentStatus || ""
                ).toLowerCase();


            if (
                normalized ===
                "completed"
            ) {

                return (
                    <span className="inline-flex items-center gap-2 rounded-full bg-green-50 px-4 py-2 text-sm font-bold capitalize text-green-600">

                        <CheckCircle2
                            size={17}
                        />

                        {currentStatus}

                    </span>
                );
            }


            if (
                normalized ===
                "cancelled"
            ) {

                return (
                    <span className="inline-flex items-center gap-2 rounded-full bg-red-50 px-4 py-2 text-sm font-bold capitalize text-red-600">

                        <XCircle
                            size={17}
                        />

                        {currentStatus}

                    </span>
                );
            }


            if (
                normalized ===
                "processing"
            ) {

                return (
                    <span className="inline-flex items-center gap-2 rounded-full bg-blue-50 px-4 py-2 text-sm font-bold capitalize text-blue-600">

                        <PackageCheck
                            size={17}
                        />

                        {currentStatus}

                    </span>
                );
            }


            if (
                normalized ===
                "confirmed"
            ) {

                return (
                    <span className="inline-flex items-center gap-2 rounded-full bg-purple-50 px-4 py-2 text-sm font-bold capitalize text-purple-600">

                        <CheckCircle2
                            size={17}
                        />

                        {currentStatus}

                    </span>
                );
            }


            return (
                <span className="inline-flex items-center gap-2 rounded-full bg-yellow-50 px-4 py-2 text-sm font-bold capitalize text-yellow-600">

                    <Clock3
                        size={17}
                    />

                    {currentStatus || "pending"}

                </span>
            );
        };


    // ========================================================
    // LOADING
    // ========================================================

    if (loading) {

        return (

            <div className="min-h-screen bg-[#FDF8F5]">

                <div className="flex min-h-screen items-center justify-center">

                    <div className="flex items-center gap-3 text-[#2D1B0E]">

                        <Loader2
                            size={27}
                            className="animate-spin text-[#8B1A1A]"
                        />

                        <span className="font-bold">
                            Loading order...
                        </span>

                    </div>

                </div>

            </div>
        );
    }


    // ========================================================
    // ERROR / NOT FOUND
    // ========================================================

    if (!order) {

        return (

            <div className="min-h-screen bg-[#FDF8F5]">

                <main className="mx-auto max-w-3xl px-5 py-16 md:px-8">

                    <div className="rounded-3xl border border-red-100 bg-white px-6 py-16 text-center shadow-sm">

                        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-red-50">

                            <ClipboardList
                                size={30}
                                className="text-red-500"
                            />

                        </div>

                        <h1 className="mt-5 text-2xl font-black text-[#2D1B0E]">
                            Order not found
                        </h1>

                        <p className="mt-2 text-sm text-[#6A5A4A]">
                            {error ||
                                "The requested order could not be found."}
                        </p>

                        <Link
                            to="/admin/orders"
                            className="mt-6 inline-flex items-center gap-2 rounded-xl bg-[#8B1A1A] px-5 py-3 text-sm font-bold text-white shadow-lg shadow-[#8B1A1A]/20 transition hover:bg-[#6B1515] hover:shadow-xl hover:shadow-[#8B1A1A]/30"
                        >

                            <ArrowLeft
                                size={17}
                            />

                            Back to Orders

                        </Link>

                    </div>

                </main>

            </div>
        );
    }


    // ========================================================
    // PAGE
    // ========================================================

    return (

        <AdminLayout
            title={`Order #${order.id} Details`}
        >

            {/* ==================================================
                TOP BAR - DEEP REDISH
            ================================================== */}

            <header className="sticky top-0 z-30 border-b border-[#8B1A1A]/20 bg-white/95 backdrop-blur">

                <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-5 md:px-8">

                    <Link
                        to="/admin/orders"
                        className="inline-flex items-center gap-2 text-sm font-bold text-[#6A5A4A] transition hover:text-[#8B1A1A]"
                    >

                        <ArrowLeft
                            size={18}
                        />

                        Back to Orders

                    </Link>


                    <button
                        type="button"
                        onClick={loadOrder}
                        disabled={loading}
                        className="inline-flex items-center gap-2 rounded-xl border border-[#8B1A1A]/20 bg-white px-4 py-2.5 text-sm font-bold text-[#2D1B0E] transition hover:bg-[#FDF8F5] disabled:opacity-60"
                    >

                        <RefreshCw
                            size={16}
                            className={
                                loading
                                    ? "animate-spin"
                                    : ""
                            }
                        />

                        <span className="hidden sm:inline">
                            Refresh
                        </span>

                    </button>

                </div>

            </header>


            {/* ==================================================
                MAIN
            ================================================== */}

            <main className="mx-auto max-w-7xl px-5 py-8 md:px-8">


                {/* ==================================================
                    HEADER
                ================================================== */}

                <div className="mb-8">

                    <p className="text-sm font-bold uppercase tracking-[0.2em] text-[#8B1A1A]">
                        Order Management
                    </p>

                    <div className="mt-2 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">

                        <div>

                            <h1 className="text-3xl font-black text-[#2D1B0E] md:text-4xl">

                                {order.order_number ||
                                    `Order #${order.id}`}

                            </h1>

                            <p className="mt-2 text-sm text-[#6A5A4A]">

                                Created{" "}
                                {formatDate(
                                    order.created_at
                                )}

                            </p>

                        </div>


                        <div>

                            {getStatusBadge(
                                order.status
                            )}

                        </div>

                    </div>

                </div>


                {/* ==================================================
                    ALERTS
                ================================================== */}

                {error && (

                    <div className="mb-6 rounded-xl border border-red-100 bg-red-50 px-4 py-3 text-sm font-semibold text-red-600">

                        {error}

                    </div>

                )}


                {success && (

                    <div className="mb-6 flex items-center gap-2 rounded-xl border border-green-100 bg-green-50 px-4 py-3 text-sm font-semibold text-green-600">

                        <CheckCircle2
                            size={18}
                        />

                        {success}

                    </div>

                )}


                {/* ==================================================
                    STATUS CONTROL - DEEP REDISH
                ================================================== */}

                <section className="mb-6 rounded-3xl border border-[#8B1A1A]/20 bg-white p-6 shadow-sm md:p-8">

                    <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">

                        <div>

                            <p className="text-xs font-extrabold uppercase tracking-wider text-[#8B1A1A]">
                                Order Status
                            </p>

                            <h2 className="mt-1 text-xl font-black text-[#2D1B0E]">
                                Update order progress
                            </h2>

                            <p className="mt-1 text-sm text-[#6A5A4A]">
                                Change the order status as it
                                moves through your sales process.
                            </p>

                        </div>


                        <div className="flex w-full flex-col gap-3 sm:flex-row lg:w-auto">

                            <div className="relative">

                                <select
                                    value={status}
                                    onChange={(
                                        event
                                    ) =>
                                        setStatus(
                                            event.target.value
                                        )
                                    }
                                    className="w-full min-w-[210px] appearance-none rounded-xl border border-[#8B1A1A]/20 bg-[#FDF8F5] px-4 py-3.5 pr-10 text-sm font-bold capitalize text-[#2D1B0E] outline-none transition focus:border-[#8B1A1A] focus:bg-white focus:ring-4 focus:ring-[#8B1A1A]/10"
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

                                <Clock3
                                    size={16}
                                    className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-[#8A7A6A]"
                                />

                            </div>


                            <button
                                type="button"
                                onClick={
                                    handleStatusUpdate
                                }
                                disabled={
                                    saving ||
                                    status ===
                                        order.status
                                }
                                className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#8B1A1A] px-5 py-3.5 text-sm font-black text-white shadow-lg shadow-[#8B1A1A]/20 transition hover:bg-[#6B1515] hover:shadow-xl hover:shadow-[#8B1A1A]/30 disabled:cursor-not-allowed disabled:opacity-50"
                            >

                                {saving ? (

                                    <>
                                        <Loader2
                                            size={17}
                                            className="animate-spin"
                                        />

                                        Saving...

                                    </>

                                ) : (

                                    <>
                                        <Save
                                            size={17}
                                        />

                                        Save Status

                                    </>

                                )}

                            </button>

                        </div>

                    </div>

                </section>


                {/* ==================================================
                    MAIN GRID
                ================================================== */}

                <div className="grid gap-6 lg:grid-cols-[1fr_380px]">


                    {/* ==================================================
                        LEFT
                    ================================================== */}

                    <div className="space-y-6">


                        {/* CUSTOMER - DEEP REDISH */}

                        <section className="rounded-3xl border border-[#8B1A1A]/20 bg-white p-6 shadow-sm md:p-8">

                            <div className="flex items-center gap-3 border-b border-[#8B1A1A]/10 pb-5">

                                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#8B1A1A]/10">

                                    <User
                                        size={21}
                                        className="text-[#8B1A1A]"
                                    />

                                </div>

                                <div>

                                    <h2 className="text-lg font-black text-[#2D1B0E]">
                                        Customer Information
                                    </h2>

                                    <p className="text-sm text-[#6A5A4A]">
                                        Customer details for this order
                                    </p>

                                </div>

                            </div>


                            <div className="mt-6 grid gap-5 sm:grid-cols-2">

                                <InfoItemRed
                                    icon={User}
                                    label="Full Name"
                                    value={
                                        order.full_name ||
                                        order.customer_username ||
                                        "—"
                                    }
                                />


                                <InfoItemRed
                                    icon={Mail}
                                    label="Email"
                                    value={
                                        order.customer_email ||
                                        order.email ||
                                        "—"
                                    }
                                />


                                <InfoItemRed
                                    icon={Phone}
                                    label="Phone"
                                    value={
                                        order.phone ||
                                        "—"
                                    }
                                />


                                <InfoItemRed
                                    icon={MapPin}
                                    label="Location"
                                    value={
                                        order.location ||
                                        "—"
                                    }
                                />

                            </div>

                        </section>


                        {/* VEHICLE - DEEP REDISH */}

                        <section className="rounded-3xl border border-[#8B1A1A]/20 bg-white p-6 shadow-sm md:p-8">

                            <div className="flex items-center gap-3 border-b border-[#8B1A1A]/10 pb-5">

                                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#8B1A1A]/10">

                                    <CarFront
                                        size={21}
                                        className="text-[#8B1A1A]"
                                    />

                                </div>

                                <div>

                                    <h2 className="text-lg font-black text-[#2D1B0E]">
                                        Vehicle Information
                                    </h2>

                                    <p className="text-sm text-[#6A5A4A]">
                                        Vehicle associated with this order
                                    </p>

                                </div>

                            </div>


                            <div className="mt-6 rounded-2xl border border-[#8B1A1A]/10 bg-[#FDF8F5] p-5">

                                <div className="flex flex-col gap-5 sm:flex-row sm:items-center">

                                    <div className="flex h-20 w-24 shrink-0 items-center justify-center rounded-2xl bg-[#8B1A1A]/10">

                                        <CarFront
                                            size={35}
                                            className="text-[#8B1A1A]"
                                        />

                                    </div>


                                    <div className="min-w-0 flex-1">

                                        <p className="text-xs font-bold uppercase tracking-wider text-[#8B1A1A]">
                                            Vehicle
                                        </p>

                                        <h3 className="mt-1 text-xl font-black text-[#2D1B0E]">

                                            {
                                                order.vehicle_name ||
                                                "Vehicle"
                                            }

                                        </h3>

                                        <p className="mt-2 text-sm text-[#6A5A4A]">

                                            Vehicle ID:{" "}
                                            {
                                                order.vehicle
                                            }

                                        </p>

                                    </div>


                                    <div className="sm:text-right">

                                        <p className="text-xs font-bold uppercase tracking-wider text-[#8A7A6A]">
                                            Order Price
                                        </p>

                                        <p className="mt-1 text-2xl font-black text-[#8B1A1A]">

                                            $
                                            {
                                                formatPrice(
                                                    order.price
                                                )
                                            }

                                        </p>

                                    </div>

                                </div>

                            </div>

                        </section>


                        {/* NOTES - DEEP REDISH */}

                        <section className="rounded-3xl border border-[#8B1A1A]/20 bg-white p-6 shadow-sm md:p-8">

                            <div className="flex items-center gap-3 border-b border-[#8B1A1A]/10 pb-5">

                                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#8B1A1A]/10">

                                    <ClipboardList
                                        size={21}
                                        className="text-[#8B1A1A]"
                                    />

                                </div>

                                <div>

                                    <h2 className="text-lg font-black text-[#2D1B0E]">
                                        Customer Notes
                                    </h2>

                                    <p className="text-sm text-[#6A5A4A]">
                                        Additional information provided by the customer
                                    </p>

                                </div>

                            </div>


                            <div className="mt-6 rounded-2xl bg-[#FDF8F5] border border-[#8B1A1A]/10 p-5">

                                <p className="whitespace-pre-wrap text-sm leading-7 text-[#6A5A4A]">

                                    {
                                        order.notes?.trim()
                                            ? order.notes
                                            : "No additional notes were provided."
                                    }

                                </p>

                            </div>

                        </section>

                    </div>


                    {/* ==================================================
                        RIGHT - DEEP REDISH
                    ================================================== */}

                    <aside className="h-fit space-y-6">


                        {/* ORDER SUMMARY */}

                        <section className="rounded-3xl border border-[#8B1A1A]/20 bg-white p-6 shadow-sm">

                            <h2 className="text-lg font-black text-[#2D1B0E]">
                                Order Summary
                            </h2>


                            <div className="mt-6 space-y-5">

                                <SummaryRowRed
                                    label="Order Number"
                                    value={
                                        order.order_number ||
                                        `#${order.id}`
                                    }
                                />


                                <SummaryRowRed
                                    label="Order Date"
                                    value={
                                        formatDate(
                                            order.created_at
                                        )
                                    }
                                />


                                <SummaryRowRed
                                    label="Last Updated"
                                    value={
                                        formatDate(
                                            order.updated_at
                                        )
                                    }
                                />


                                <div className="border-t border-[#8B1A1A]/20 pt-5">

                                    <div className="flex items-center justify-between">

                                        <span className="font-black text-[#2D1B0E]">
                                            Total
                                        </span>

                                        <span className="text-2xl font-black text-[#8B1A1A]">

                                            $
                                            {
                                                formatPrice(
                                                    order.price
                                                )
                                            }

                                        </span>

                                    </div>

                                </div>

                            </div>

                        </section>


                        {/* FULFILLMENT */}

                        <section className="rounded-3xl border border-[#8B1A1A]/20 bg-white p-6 shadow-sm">

                            <div className="flex items-center gap-3">

                                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#8B1A1A]/10">

                                    {order.fulfillment_method ===
                                    "delivery" ? (

                                        <Truck
                                            size={21}
                                            className="text-[#8B1A1A]"
                                        />

                                    ) : (

                                        <CarFront
                                            size={21}
                                            className="text-[#8B1A1A]"
                                        />

                                    )}

                                </div>

                                <div>

                                    <p className="text-xs font-bold uppercase tracking-wider text-[#8B1A1A]">
                                        Fulfillment
                                    </p>

                                    <h2 className="text-lg font-black capitalize text-[#2D1B0E]">

                                        {
                                            order.fulfillment_method ||
                                            "Pickup"
                                        }

                                    </h2>

                                </div>

                            </div>


                            <div className="mt-5 rounded-2xl bg-[#FDF8F5] border border-[#8B1A1A]/10 p-4">

                                <p className="text-xs font-bold uppercase tracking-wider text-[#8A7A6A]">
                                    Location
                                </p>

                                <p className="mt-2 flex items-start gap-2 text-sm font-semibold leading-6 text-[#2D1B0E]">

                                    <MapPin
                                        size={17}
                                        className="mt-1 shrink-0 text-[#8B1A1A]"
                                    />

                                    {
                                        order.location ||
                                        "No location provided."
                                    }

                                </p>

                            </div>

                        </section>


                        {/* CUSTOMER CONTACT */}

                        <section className="rounded-3xl border border-[#8B1A1A]/20 bg-white p-6 shadow-sm">

                            <h2 className="text-lg font-black text-[#2D1B0E]">
                                Contact Customer
                            </h2>

                            <div className="mt-5 space-y-3">

                                {order.phone && (

                                    <a
                                        href={`tel:${order.phone}`}
                                        className="flex items-center gap-3 rounded-xl border border-[#8B1A1A]/20 p-3 text-sm font-bold text-[#2D1B0E] transition hover:bg-[#FDF8F5]"
                                    >

                                        <Phone
                                            size={18}
                                            className="text-[#8B1A1A]"
                                        />

                                        {order.phone}

                                    </a>

                                )}


                                {(order.email ||
                                    order.customer_email) && (

                                    <a
                                        href={`mailto:${
                                            order.email ||
                                            order.customer_email
                                        }`}
                                        className="flex items-center gap-3 rounded-xl border border-[#8B1A1A]/20 p-3 text-sm font-bold text-[#2D1B0E] transition hover:bg-[#FDF8F5]"
                                    >

                                        <Mail
                                            size={18}
                                            className="text-[#8B1A1A]"
                                        />

                                        <span className="truncate">
                                            {
                                                order.email ||
                                                order.customer_email
                                            }
                                        </span>

                                    </a>

                                )}

                            </div>

                        </section>


                        {/* BACK */}

                        <Link
                            to="/admin/orders"
                            className="flex w-full items-center justify-center gap-2 rounded-xl border border-[#8B1A1A]/20 bg-white px-5 py-3.5 text-sm font-bold text-[#2D1B0E] transition hover:bg-[#FDF8F5]"
                        >

                            <ArrowLeft
                                size={17}
                            />

                            Back to All Orders

                        </Link>

                    </aside>

                </div>

            </main>

        </AdminLayout>
    );
}


// ============================================================
// INFO ITEM - DEEP REDISH
// ============================================================

function InfoItemRed({
    icon: Icon,
    label,
    value,
}) {

    return (

        <div>

            <p className="text-xs font-bold uppercase tracking-wider text-[#8A7A6A]">
                {label}
            </p>

            <div className="mt-2 flex items-start gap-2">

                <Icon
                    size={17}
                    className="mt-0.5 shrink-0 text-[#8B1A1A]"
                />

                <p className="break-words text-sm font-bold text-[#2D1B0E]">
                    {value}
                </p>

            </div>

        </div>
    );
}


// ============================================================
// SUMMARY ROW - DEEP REDISH
// ============================================================

function SummaryRowRed({
    label,
    value,
}) {

    return (

        <div className="flex items-start justify-between gap-4">

            <span className="text-sm text-[#8A7A6A]">
                {label}
            </span>

            <span className="text-right text-sm font-bold text-[#2D1B0E]">
                {value}
            </span>

        </div>
    );
}


export default AdminOrderDetails;