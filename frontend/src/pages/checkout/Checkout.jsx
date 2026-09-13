
import { useEffect, useState } from "react";

import { Link, useNavigate } from "react-router-dom";

import {
    ArrowLeft,
    ArrowRight,
    CarFront,
    CheckCircle2,
    Loader2,
    MapPin,
    Phone,
    Mail,
    User,
    ShoppingCart,
} from "lucide-react";

import { useTranslation } from "react-i18next";

import Navbar from "../../components/Navbar";

import {
    getCart,
    clearCart,
} from "../../services/cartService";

import {
    createOrder,
} from "../../services/orderService";

import {
    isCustomerAuthenticated,
} from "../../services/customerAuthService";

function Checkout() {
    const navigate = useNavigate();
    const { t } = useTranslation();

    // ============================================================
    // STATE
    // ============================================================

    const [cart, setCart] = useState(null);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState(false);
    const [createdOrders, setCreatedOrders] = useState([]);

    // ============================================================
    // FORM
    // ============================================================

    const [form, setForm] = useState({
        full_name: "",
        phone: "",
        email: "",
        location: "",
        fulfillment_method: "pickup",
        notes: "",
    });

    // ============================================================
    // HANDLE INPUT
    // ============================================================

    const handleChange = (event) => {
        const { name, value } = event.target;

        setForm((previous) => ({
            ...previous,
            [name]: value,
        }));
    };

    // ============================================================
    // LOAD CART
    // ============================================================

    const loadCart = async () => {
        try {
            setLoading(true);
            setError("");

            if (!isCustomerAuthenticated()) {
                navigate("/login");
                return;
            }

            const data = await getCart();
            setCart(data);
        } catch (err) {
            console.error(
                "Failed to load checkout:",
                err
            );

            setError(
                err.message ||
                    t("checkout.errors.loadCart")
            );
        } finally {
            setLoading(false);
        }
    };

    // ============================================================
    // INITIAL LOAD
    // ============================================================

    useEffect(() => {
        loadCart();
    }, []);

    // ============================================================
    // FORMAT PRICE
    // ============================================================

    const formatPrice = (price) => {
        return `TZS ${Number(price || 0).toLocaleString(
            "en-TZ",
            {
                maximumFractionDigits: 0,
            }
        )}`;
    };

    // ============================================================
    // GET TRANSLATED ORDER STATUS
    // ============================================================

    const getOrderStatusLabel = (status) => {
        const normalizedStatus =
            String(status || "").toLowerCase();

        const statusKey = {
            pending:
                "checkout.orderStatus.pending",
            confirmed:
                "checkout.orderStatus.confirmed",
            processing:
                "checkout.orderStatus.processing",
            completed:
                "checkout.orderStatus.completed",
            cancelled:
                "checkout.orderStatus.cancelled",
        }[normalizedStatus];

        return statusKey
            ? t(statusKey)
            : status || t("checkout.orderStatus.pending");
    };

    // ============================================================
    // SUBMIT CHECKOUT
    // ============================================================

    const handleCheckout = async (event) => {
        event.preventDefault();

        setError("");

        // --------------------------------------------------------
        // VALIDATE CART
        // --------------------------------------------------------

        const items = cart?.items || [];

        if (items.length === 0) {
            setError(
                t("checkout.validation.emptyCart")
            );
            return;
        }

        // --------------------------------------------------------
        // VALIDATE CUSTOMER INFORMATION
        // --------------------------------------------------------

        if (!form.full_name.trim()) {
            setError(
                t("checkout.validation.fullName")
            );
            return;
        }

        if (!form.phone.trim()) {
            setError(
                t("checkout.validation.phone")
            );
            return;
        }

        if (!form.email.trim()) {
            setError(
                t("checkout.validation.email")
            );
            return;
        }

        // --------------------------------------------------------
        // DELIVERY LOCATION
        // --------------------------------------------------------

        if (
            form.fulfillment_method ===
                "delivery" &&
            !form.location.trim()
        ) {
            setError(
                t("checkout.validation.deliveryLocation")
            );
            return;
        }

        try {
            setSubmitting(true);

            const orders = [];

            // ----------------------------------------------------
            // CREATE ORDER FOR EACH VEHICLE
            // ----------------------------------------------------

            for (const item of items) {
                if (item.status !== "available") {
                    throw new Error(
                        t("checkout.errors.vehicleUnavailable", {
                            vehicle:
                                item.vehicle_name ||
                                t(
                                    "checkout.vehicleFallback"
                                ),
                        })
                    );
                }

                const orderData = {
                    vehicle: item.vehicle,

                    full_name:
                        form.full_name.trim(),

                    phone: form.phone.trim(),

                    email: form.email.trim(),

                    location:
                        form.location.trim(),

                    fulfillment_method:
                        form.fulfillment_method,

                    notes: form.notes.trim(),
                };

                const order =
                    await createOrder(orderData);

                orders.push(order);
            }

            // ----------------------------------------------------
            // CLEAR CART
            // ----------------------------------------------------

            await clearCart();

            // ----------------------------------------------------
            // SAVE CREATED ORDERS
            // ----------------------------------------------------

            setCreatedOrders(orders);

            setSuccess(true);

            setCart({
                items: [],
                item_count: 0,
                total: 0,
            });
        } catch (err) {
            console.error(
                "Checkout failed:",
                err
            );

            setError(
                err.message ||
                    t("checkout.errors.checkoutFailed")
            );
        } finally {
            setSubmitting(false);
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
                            size={26}
                            className="animate-spin text-[#B22222]"
                        />

                        <span className="font-bold">
                            {t("checkout.loading")}
                        </span>
                    </div>
                </div>
            </div>
        );
    }

    // ============================================================
    // SUCCESS
    // ============================================================

    if (success) {
        return (
            <div className="min-h-screen bg-[#FDF8F5]">
                <Navbar />

                <main className="mx-auto max-w-3xl px-5 py-16 md:px-8">
                    <div className="rounded-3xl border border-[#F4A460]/20 bg-white p-8 text-center shadow-sm md:p-12">
                        <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-green-50">
                            <CheckCircle2
                                size={42}
                                className="text-green-500"
                            />
                        </div>

                        <p className="mt-6 text-sm font-bold uppercase tracking-[0.2em] text-[#B22222]">
                            {t(
                                "checkout.success.eyebrow"
                            )}
                        </p>

                        <h1 className="mt-2 text-3xl font-black text-[#2D1B0E]">
                            {t(
                                "checkout.success.title"
                            )}
                        </h1>

                        <p className="mx-auto mt-4 max-w-xl leading-7 text-[#6A5A4A]">
                            {t(
                                "checkout.success.description"
                            )}
                        </p>

                        {/* CREATED ORDERS */}
                        {createdOrders.length > 0 && (
                            <div className="mt-8 space-y-3 text-left">
                                {createdOrders.map(
                                    (order) => (
                                        <div
                                            key={order.id}
                                            className="rounded-2xl border border-[#F4A460]/20 bg-[#FDF8F5] p-4"
                                        >
                                            <div className="flex items-center justify-between gap-4">
                                                <div>
                                                    <p className="text-xs font-bold uppercase tracking-wider text-[#8A7A6A]">
                                                        {t(
                                                            "checkout.success.orderNumber"
                                                        )}
                                                    </p>

                                                    <p className="mt-1 font-black text-[#2D1B0E]">
                                                        {
                                                            order.order_number
                                                        }
                                                    </p>
                                                </div>

                                                <span className="rounded-full bg-yellow-50 px-3 py-1 text-xs font-bold capitalize text-yellow-600">
                                                    {getOrderStatusLabel(
                                                        order.status
                                                    )}
                                                </span>
                                            </div>
                                        </div>
                                    )
                                )}
                            </div>
                        )}

                        <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
                            <Link
                                to="/orders"
                                className="inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#B22222] to-[#8B1A1A] px-6 py-3.5 text-sm font-bold text-white shadow-lg shadow-[#B22222]/20 transition hover:shadow-xl hover:shadow-[#B22222]/40"
                            >
                                {t(
                                    "checkout.success.viewOrders"
                                )}

                                <ArrowRight size={18} />
                            </Link>

                            <Link
                                to="/vehicles"
                                className="inline-flex items-center justify-center gap-2 rounded-xl border border-[#F4A460]/20 bg-white px-6 py-3.5 text-sm font-bold text-[#2D1B0E] transition hover:bg-[#FDF8F5]"
                            >
                                {t(
                                    "checkout.success.browseVehicles"
                                )}
                            </Link>
                        </div>
                    </div>
                </main>
            </div>
        );
    }

    // ============================================================
    // CART DATA
    // ============================================================

    const items = cart?.items || [];

    const itemCount =
        cart?.item_count ?? items.length;

    const total = cart?.total || 0;

    // ============================================================
    // EMPTY CART
    // ============================================================

    if (items.length === 0) {
        return (
            <div className="min-h-screen bg-[#FDF8F5]">
                <Navbar />

                <main className="mx-auto max-w-3xl px-5 py-16 md:px-8">
                    <div className="rounded-3xl border border-[#F4A460]/20 bg-white px-6 py-20 text-center shadow-sm">
                        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl border border-[#F4A460]/20 bg-[#B22222]/10">
                            <ShoppingCart
                                size={30}
                                className="text-[#B22222]"
                            />
                        </div>

                        <h1 className="mt-5 text-2xl font-black text-[#2D1B0E]">
                            {t(
                                "checkout.empty.title"
                            )}
                        </h1>

                        <p className="mt-2 text-sm text-[#6A5A4A]">
                            {t(
                                "checkout.empty.description"
                            )}
                        </p>

                        <Link
                            to="/vehicles"
                            className="mt-6 inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-[#B22222] to-[#8B1A1A] px-5 py-3 text-sm font-bold text-white shadow-lg shadow-[#B22222]/20 transition hover:shadow-xl hover:shadow-[#B22222]/40"
                        >
                            {t(
                                "checkout.empty.browseVehicles"
                            )}

                            <ArrowRight size={17} />
                        </Link>
                    </div>
                </main>
            </div>
        );
    }

    // ============================================================
    // CHECKOUT PAGE
    // ============================================================

    return (
        <div className="min-h-screen bg-[#FDF8F5]">
            <Navbar />

            {/* HEADER */}
            <div className="border-b border-[#F4A460]/20 bg-white">
                <div className="mx-auto max-w-7xl px-5 py-4 md:px-8">
                    <Link
                        to="/cart"
                        className="inline-flex items-center gap-2 text-sm font-bold text-[#6A5A4A] transition hover:text-[#B22222]"
                    >
                        <ArrowLeft size={17} />

                        {t(
                            "checkout.backToCart"
                        )}
                    </Link>
                </div>
            </div>

            <main className="mx-auto max-w-7xl px-5 py-10 md:px-8">
                {/* TITLE */}
                <div className="mb-8">
                    <p className="text-sm font-bold uppercase tracking-[0.2em] text-[#B22222]">
                        {t(
                            "checkout.header.eyebrow"
                        )}
                    </p>

                    <h1 className="mt-2 text-3xl font-black text-[#2D1B0E] md:text-4xl">
                        {t(
                            "checkout.header.title"
                        )}
                    </h1>

                    <p className="mt-2 text-[#6A5A4A]">
                        {t(
                            "checkout.header.description"
                        )}
                    </p>
                </div>

                {/* ERROR */}
                {error && (
                    <div className="mb-6 rounded-xl border border-red-100 bg-red-50 px-4 py-3 text-sm font-semibold text-red-600">
                        {error}
                    </div>
                )}

                <div className="grid gap-6 lg:grid-cols-[1fr_380px]">
                    {/* ==================================================
                        CHECKOUT FORM
                    ================================================== */}
                    <form
                        onSubmit={handleCheckout}
                        className="rounded-3xl border border-[#F4A460]/20 bg-white p-6 shadow-sm md:p-8"
                    >
                        <h2 className="text-xl font-black text-[#2D1B0E]">
                            {t(
                                "checkout.customer.title"
                            )}
                        </h2>

                        <p className="mt-1 text-sm text-[#8A7A6A]">
                            {t(
                                "checkout.customer.description"
                            )}
                        </p>

                        {/* FULL NAME */}
                        <div className="mt-7">
                            <label className="mb-2 block text-sm font-bold text-[#2D1B0E]">
                                {t(
                                    "checkout.fields.fullName.label"
                                )}
                            </label>

                            <div className="relative">
                                <User
                                    size={18}
                                    className="absolute left-4 top-1/2 -translate-y-1/2 text-[#8A7A6A]"
                                />

                                <input
                                    type="text"
                                    name="full_name"
                                    value={
                                        form.full_name
                                    }
                                    onChange={
                                        handleChange
                                    }
                                    placeholder={t(
                                        "checkout.fields.fullName.placeholder"
                                    )}
                                    className="w-full rounded-xl border border-[#F4A460]/20 bg-[#FDF8F5] py-3.5 pl-11 pr-4 text-sm outline-none transition focus:border-[#B22222] focus:bg-white focus:ring-4 focus:ring-[#B22222]/10"
                                />
                            </div>
                        </div>

                        {/* PHONE */}
                        <div className="mt-5">
                            <label className="mb-2 block text-sm font-bold text-[#2D1B0E]">
                                {t(
                                    "checkout.fields.phone.label"
                                )}
                            </label>

                            <div className="relative">
                                <Phone
                                    size={18}
                                    className="absolute left-4 top-1/2 -translate-y-1/2 text-[#8A7A6A]"
                                />

                                <input
                                    type="tel"
                                    name="phone"
                                    value={form.phone}
                                    onChange={
                                        handleChange
                                    }
                                    placeholder={t(
                                        "checkout.fields.phone.placeholder"
                                    )}
                                    className="w-full rounded-xl border border-[#F4A460]/20 bg-[#FDF8F5] py-3.5 pl-11 pr-4 text-sm outline-none transition focus:border-[#B22222] focus:bg-white focus:ring-4 focus:ring-[#B22222]/10"
                                />
                            </div>
                        </div>

                        {/* EMAIL */}
                        <div className="mt-5">
                            <label className="mb-2 block text-sm font-bold text-[#2D1B0E]">
                                {t(
                                    "checkout.fields.email.label"
                                )}
                            </label>

                            <div className="relative">
                                <Mail
                                    size={18}
                                    className="absolute left-4 top-1/2 -translate-y-1/2 text-[#8A7A6A]"
                                />

                                <input
                                    type="email"
                                    name="email"
                                    value={form.email}
                                    onChange={
                                        handleChange
                                    }
                                    placeholder={t(
                                        "checkout.fields.email.placeholder"
                                    )}
                                    className="w-full rounded-xl border border-[#F4A460]/20 bg-[#FDF8F5] py-3.5 pl-11 pr-4 text-sm outline-none transition focus:border-[#B22222] focus:bg-white focus:ring-4 focus:ring-[#B22222]/10"
                                />
                            </div>
                        </div>

                        {/* FULFILLMENT */}
                        <div className="mt-7">
                            <label className="mb-3 block text-sm font-bold text-[#2D1B0E]">
                                {t(
                                    "checkout.fulfillment.title"
                                )}
                            </label>

                            <div className="grid gap-3 sm:grid-cols-2">
                                <label
                                    className={`cursor-pointer rounded-2xl border p-4 transition ${
                                        form.fulfillment_method ===
                                        "pickup"
                                            ? "border-[#B22222] bg-[#B22222]/10"
                                            : "border-[#F4A460]/20 bg-white hover:bg-[#FDF8F5]"
                                    }`}
                                >
                                    <input
                                        type="radio"
                                        name="fulfillment_method"
                                        value="pickup"
                                        checked={
                                            form.fulfillment_method ===
                                            "pickup"
                                        }
                                        onChange={
                                            handleChange
                                        }
                                        className="sr-only"
                                    />

                                    <div className="font-black text-[#2D1B0E]">
                                        {t(
                                            "checkout.fulfillment.pickup.title"
                                        )}
                                    </div>

                                    <p className="mt-1 text-xs text-[#8A7A6A]">
                                        {t(
                                            "checkout.fulfillment.pickup.description"
                                        )}
                                    </p>
                                </label>

                                <label
                                    className={`cursor-pointer rounded-2xl border p-4 transition ${
                                        form.fulfillment_method ===
                                        "delivery"
                                            ? "border-[#B22222] bg-[#B22222]/10"
                                            : "border-[#F4A460]/20 bg-white hover:bg-[#FDF8F5]"
                                    }`}
                                >
                                    <input
                                        type="radio"
                                        name="fulfillment_method"
                                        value="delivery"
                                        checked={
                                            form.fulfillment_method ===
                                            "delivery"
                                        }
                                        onChange={
                                            handleChange
                                        }
                                        className="sr-only"
                                    />

                                    <div className="font-black text-[#2D1B0E]">
                                        {t(
                                            "checkout.fulfillment.delivery.title"
                                        )}
                                    </div>

                                    <p className="mt-1 text-xs text-[#8A7A6A]">
                                        {t(
                                            "checkout.fulfillment.delivery.description"
                                        )}
                                    </p>
                                </label>
                            </div>
                        </div>

                        {/* LOCATION */}
                        <div className="mt-5">
                            <label className="mb-2 block text-sm font-bold text-[#2D1B0E]">
                                {form.fulfillment_method ===
                                "delivery"
                                    ? t(
                                          "checkout.fields.location.deliveryLabel"
                                      )
                                    : t(
                                          "checkout.fields.location.label"
                                      )}
                            </label>

                            <div className="relative">
                                <MapPin
                                    size={18}
                                    className="absolute left-4 top-4 text-[#8A7A6A]"
                                />

                                <input
                                    type="text"
                                    name="location"
                                    value={
                                        form.location
                                    }
                                    onChange={
                                        handleChange
                                    }
                                    placeholder={t(
                                        "checkout.fields.location.placeholder"
                                    )}
                                    className="w-full rounded-xl border border-[#F4A460]/20 bg-[#FDF8F5] py-3.5 pl-11 pr-4 text-sm outline-none transition focus:border-[#B22222] focus:bg-white focus:ring-4 focus:ring-[#B22222]/10"
                                />
                            </div>
                        </div>

                        {/* NOTES */}
                        <div className="mt-5">
                            <label className="mb-2 block text-sm font-bold text-[#2D1B0E]">
                                {t(
                                    "checkout.fields.notes.label"
                                )}

                                <span className="ml-1 font-normal text-[#8A7A6A]">
                                    {t(
                                        "checkout.fields.notes.optional"
                                    )}
                                </span>
                            </label>

                            <textarea
                                name="notes"
                                value={form.notes}
                                onChange={
                                    handleChange
                                }
                                rows="5"
                                placeholder={t(
                                    "checkout.fields.notes.placeholder"
                                )}
                                className="w-full resize-none rounded-xl border border-[#F4A460]/20 bg-[#FDF8F5] px-4 py-3.5 text-sm outline-none transition focus:border-[#B22222] focus:bg-white focus:ring-4 focus:ring-[#B22222]/10"
                            />
                        </div>

                        {/* SUBMIT */}
                        <button
                            type="submit"
                            disabled={submitting}
                            className="mt-7 flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#B22222] to-[#8B1A1A] py-4 text-sm font-black text-white shadow-lg shadow-[#B22222]/20 transition hover:shadow-xl hover:shadow-[#B22222]/40 disabled:cursor-not-allowed disabled:opacity-60"
                        >
                            {submitting ? (
                                <>
                                    <Loader2
                                        size={19}
                                        className="animate-spin"
                                    />

                                    {t(
                                        "checkout.actions.processing"
                                    )}
                                </>
                            ) : (
                                <>
                                    {t(
                                        "checkout.actions.confirm"
                                    )}

                                    <ArrowRight
                                        size={19}
                                    />
                                </>
                            )}
                        </button>
                    </form>

                    {/* ==================================================
                        ORDER SUMMARY
                    ================================================== */}
                    <aside className="h-fit rounded-3xl border border-[#F4A460]/20 bg-white p-6 shadow-sm">
                        <div className="flex items-center gap-3">
                            <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-[#F4A460]/20 bg-[#B22222]/10">
                                <ShoppingCart
                                    size={21}
                                    className="text-[#B22222]"
                                />
                            </div>

                            <div>
                                <p className="text-xs font-bold uppercase tracking-wider text-[#B22222]">
                                    {t(
                                        "checkout.summary.eyebrow"
                                    )}
                                </p>

                                <h2 className="text-lg font-black text-[#2D1B0E]">
                                    {t(
                                        "checkout.summary.title"
                                    )}
                                </h2>
                            </div>
                        </div>

                        {/* ITEMS */}
                        <div className="mt-6 space-y-4">
                            {items.map((item) => (
                                <div
                                    key={item.id}
                                    className="flex gap-3 border-b border-[#F4A460]/10 pb-4"
                                >
                                    <div className="flex h-16 w-20 shrink-0 items-center justify-center overflow-hidden rounded-xl border border-[#F4A460]/20 bg-[#B22222]/10">
                                        {item.image ? (
                                            <img
                                                src={
                                                    item.image
                                                }
                                                alt={
                                                    item.vehicle_name ||
                                                    t(
                                                        "checkout.vehicleFallback"
                                                    )
                                                }
                                                className="h-full w-full object-cover"
                                            />
                                        ) : (
                                            <CarFront
                                                size={25}
                                                className="text-[#B22222]"
                                            />
                                        )}
                                    </div>

                                    <div className="min-w-0 flex-1">
                                        <p className="text-xs font-bold text-[#B22222]">
                                            {
                                                item.brand_name
                                            }
                                        </p>

                                        <p className="truncate text-sm font-black text-[#2D1B0E]">
                                            {
                                                item.vehicle_name
                                            }
                                        </p>

                                        <p className="mt-1 text-sm font-bold text-[#B22222]">
                                            {formatPrice(
                                                item.price
                                            )}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* TOTAL */}
                        <div className="mt-6 space-y-3">
                            <div className="flex items-center justify-between text-sm">
                                <span className="text-[#6A5A4A]">
                                    {t(
                                        "checkout.summary.vehicles"
                                    )}
                                </span>

                                <span className="font-bold text-[#2D1B0E]">
                                    {itemCount}
                                </span>
                            </div>

                            <div className="border-t border-[#F4A460]/20 pt-4">
                                <div className="flex items-center justify-between">
                                    <span className="font-black text-[#2D1B0E]">
                                        {t(
                                            "checkout.summary.total"
                                        )}
                                    </span>

                                    <span className="text-2xl font-black text-[#B22222]">
                                        {formatPrice(
                                            total
                                        )}
                                    </span>
                                </div>
                            </div>
                        </div>

                        <div className="mt-5 rounded-xl border border-[#F4A460]/20 bg-[#FDF8F5] p-4">
                            <p className="text-xs leading-5 text-[#6A5A4A]">
                                <span className="font-black text-[#2D1B0E]">
                                    {t(
                                        "checkout.summary.important"
                                    )}
                                </span>{" "}
                                {t(
                                    "checkout.summary.importantDescription"
                                )}
                            </p>
                        </div>

                        <Link
                            to="/cart"
                            className="mt-5 flex items-center justify-center gap-2 text-sm font-bold text-[#B22222] hover:text-[#8B1A1A]"
                        >
                            <ArrowLeft size={16} />

                            {t(
                                "checkout.summary.editCart"
                            )}
                        </Link>
                    </aside>
                </div>
            </main>
        </div>
    );
}

export default Checkout;

