
import {
    useEffect,
    useState,
} from "react";

import {
    Link,
    useNavigate,
} from "react-router-dom";

import {
    ArrowLeft,
    ArrowRight,
    CarFront,
    ShoppingCart,
    Trash2,
    Loader2,
} from "lucide-react";

import { useTranslation } from "react-i18next";

import {
    getCart,
    removeFromCart,
} from "../../services/cartService";

import {
    isCustomerAuthenticated,
} from "../../services/customerAuthService";

import Navbar from "../../components/Navbar";

function Cart() {
    const navigate = useNavigate();

    const { t } = useTranslation();

    const [cart, setCart] = useState(null);

    const [loading, setLoading] =
        useState(true);

    const [error, setError] =
        useState("");

    const [removingId, setRemovingId] =
        useState(null);

    const API_URL =
        import.meta.env.VITE_API_URL ||
        "http://127.0.0.1:8000/api";

    // ========================================================
    // LOAD CUSTOMER CART
    // ========================================================

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
                "Failed to load cart:",
                err
            );

            setError(
                err.message ||
                    t("cart.errors.loadFailed")
            );
        } finally {
            setLoading(false);
        }
    };

    // ========================================================
    // INITIAL LOAD
    // ========================================================

    useEffect(() => {
        loadCart();
    }, []);

    // ========================================================
    // REMOVE VEHICLE
    // ========================================================

    const handleRemove = async (
        vehicleId
    ) => {
        try {
            setRemovingId(vehicleId);
            setError("");

            await removeFromCart(vehicleId);

            await loadCart();
        } catch (err) {
            console.error(
                "Failed to remove cart item:",
                err
            );

            setError(
                err.message ||
                    t(
                        "cart.errors.removeFailed"
                    )
            );
        } finally {
            setRemovingId(null);
        }
    };

    // ========================================================
    // IMAGE URL
    // ========================================================

    const getImageUrl = (image) => {
        if (!image) {
            return null;
        }

        if (image.startsWith("http")) {
            return image;
        }

        const backendBase =
            API_URL.replace(
                /\/api\/?$/,
                ""
            );

        return `${backendBase}${image}`;
    };

    // ========================================================
    // FORMAT PRICE
    // ========================================================

    const formatPrice = (price) => {
        return `TZS ${Number(
            price || 0
        ).toLocaleString("en-TZ", {
            maximumFractionDigits: 0,
        })}`;
    };

    // ========================================================
    // LOADING
    // ========================================================

    if (loading) {
        return (
            <div className="flex min-h-screen items-center justify-center bg-[#FDF8F5]">
                <div className="flex items-center gap-3 text-[#2D1B0E]">
                    <Loader2
                        size={25}
                        className="animate-spin text-[#B22222]"
                    />

                    <span className="font-semibold">
                        {t(
                            "cart.loading"
                        )}
                    </span>
                </div>
            </div>
        );
    }

    // ========================================================
    // SAFE CART VALUES
    // ========================================================

    const items = cart?.items || [];

    const itemCount =
        cart?.item_count ??
        items.length;

    const total = cart?.total || 0;

    return (
        <div className="min-h-screen bg-[#FDF8F5]">
            <Navbar />

            {/* ==================================================
                MAIN
            ================================================== */}

            <main className="mx-auto max-w-7xl px-5 py-10 md:px-8">
                {/* TITLE */}

                <div className="mb-8">
                    <p className="text-sm font-bold uppercase tracking-[0.2em] text-[#B22222]">
                        {t(
                            "cart.badge"
                        )}
                    </p>

                    <h1 className="mt-2 text-3xl font-black text-[#2D1B0E] md:text-4xl">
                        {t(
                            "cart.title"
                        )}
                    </h1>

                    <p className="mt-2 text-[#6A5A4A]">
                        {t(
                            "cart.description"
                        )}
                    </p>
                </div>

                {/* ==================================================
                    ERROR
                ================================================== */}

                {error && (
                    <div className="mb-6 rounded-xl border border-red-100 bg-red-50 px-4 py-3 text-sm font-semibold text-red-600">
                        {error}
                    </div>
                )}

                {/* ==================================================
                    EMPTY CART
                ================================================== */}

                {items.length === 0 ? (
                    <div className="rounded-2xl border border-[#F4A460]/20 bg-white px-6 py-20 text-center shadow-sm">
                        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl border border-[#F4A460]/20 bg-[#B22222]/10">
                            <ShoppingCart
                                size={30}
                                className="text-[#B22222]"
                            />
                        </div>

                        <h2 className="mt-5 text-xl font-extrabold text-[#2D1B0E]">
                            {t(
                                "cart.empty.title"
                            )}
                        </h2>

                        <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-[#6A5A4A]">
                            {t(
                                "cart.empty.description"
                            )}
                        </p>

                        <Link
                            to="/vehicles"
                            className="mt-6 inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-[#B22222] to-[#8B1A1A] px-5 py-3 text-sm font-bold text-white shadow-lg shadow-[#B22222]/20 transition hover:shadow-xl hover:shadow-[#B22222]/40"
                        >
                            {t(
                                "cart.empty.browse"
                            )}

                            <ArrowRight
                                size={17}
                            />
                        </Link>
                    </div>
                ) : (
                    <div className="grid gap-6 lg:grid-cols-[1fr_360px]">
                        {/* ==================================================
                            CART ITEMS
                        ================================================== */}

                        <section className="overflow-hidden rounded-2xl border border-[#F4A460]/20 bg-white shadow-sm">
                            {/* HEADER */}

                            <div className="border-b border-[#F4A460]/20 px-5 py-5">
                                <h2 className="text-lg font-extrabold text-[#2D1B0E]">
                                    {t(
                                        "cart.selectedVehicles"
                                    )}
                                </h2>

                                <p className="mt-1 text-sm text-[#8A7A6A]">
                                    {t(
                                        "cart.vehicleCount",
                                        {
                                            count: itemCount,
                                        }
                                    )}
                                </p>
                            </div>

                            {/* ITEMS */}

                            <div>
                                {items.map(
                                    (item) => {
                                        const image =
                                            getImageUrl(
                                                item.image
                                            );

                                        const vehicle =
                                            item.vehicle_data ||
                                            {};

                                        return (
                                            <div
                                                key={
                                                    item.id
                                                }
                                                className="flex flex-col gap-4 border-b border-[#F4A460]/10 p-5 transition last:border-b-0 hover:bg-[#FDF8F5] sm:flex-row sm:items-center"
                                            >
                                                {/* IMAGE */}

                                                <div className="h-32 w-full shrink-0 overflow-hidden rounded-xl border border-[#F4A460]/20 bg-[#B22222]/10 sm:h-24 sm:w-32">
                                                    {image ? (
                                                        <img
                                                            src={
                                                                image
                                                            }
                                                            alt={
                                                                item.vehicle_name ||
                                                                t(
                                                                    "cart.vehicle"
                                                                )
                                                            }
                                                            className="h-full w-full object-cover"
                                                        />
                                                    ) : (
                                                        <div className="flex h-full items-center justify-center">
                                                            <CarFront
                                                                size={
                                                                    28
                                                                }
                                                                className="text-[#B22222]"
                                                            />
                                                        </div>
                                                    )}
                                                </div>

                                                {/* INFO */}

                                                <div className="min-w-0 flex-1">
                                                    <p className="text-xs font-bold uppercase tracking-wide text-[#B22222]">
                                                        {item.brand_name ||
                                                            t(
                                                                "cart.vehicle"
                                                            )}
                                                    </p>

                                                    <h3 className="mt-1 truncate text-lg font-extrabold text-[#2D1B0E]">
                                                        {item.vehicle_name ||
                                                            vehicle.model ||
                                                            t(
                                                                "cart.vehicle"
                                                            )}
                                                    </h3>

                                                    {vehicle.year && (
                                                        <p className="mt-1 text-sm text-[#8A7A6A]">
                                                            {
                                                                vehicle.year
                                                            }
                                                        </p>
                                                    )}

                                                    <p className="mt-3 text-lg font-black text-[#B22222]">
                                                        {formatPrice(
                                                            item.price
                                                        )}
                                                    </p>

                                                    {/* STATUS */}

                                                    <p
                                                        className={`mt-1 text-xs font-bold ${
                                                            item.status ===
                                                            "available"
                                                                ? "text-emerald-600"
                                                                : "text-red-500"
                                                        }`}
                                                    >
                                                        {item.status ===
                                                        "available"
                                                            ? `✓ ${t(
                                                                  "cart.available"
                                                              )}`
                                                            : `✗ ${t(
                                                                  "cart.unavailable"
                                                              )}`}
                                                    </p>
                                                </div>

                                                {/* REMOVE */}

                                                <button
                                                    type="button"
                                                    disabled={
                                                        removingId ===
                                                        item.vehicle
                                                    }
                                                    onClick={() =>
                                                        handleRemove(
                                                            item.vehicle
                                                        )
                                                    }
                                                    className="flex items-center justify-center gap-2 rounded-xl bg-red-50 px-4 py-2.5 text-sm font-bold text-red-500 transition hover:bg-red-100 disabled:cursor-not-allowed disabled:opacity-50 sm:self-start"
                                                >
                                                    {removingId ===
                                                    item.vehicle ? (
                                                        <Loader2
                                                            size={
                                                                17
                                                            }
                                                            className="animate-spin"
                                                        />
                                                    ) : (
                                                        <Trash2
                                                            size={
                                                                17
                                                            }
                                                        />
                                                    )}

                                                    {removingId ===
                                                    item.vehicle
                                                        ? t(
                                                              "cart.removing"
                                                          )
                                                        : t(
                                                              "cart.remove"
                                                          )}
                                                </button>
                                            </div>
                                        );
                                    }
                                )}
                            </div>

                            {/* CONTINUE SHOPPING */}

                            <div className="border-t border-[#F4A460]/20 px-5 py-5">
                                <Link
                                    to="/vehicles"
                                    className="inline-flex items-center gap-2 text-sm font-bold text-[#B22222] transition hover:text-[#8B1A1A]"
                                >
                                    <ArrowLeft
                                        size={16}
                                    />

                                    {t(
                                        "cart.continueShopping"
                                    )}
                                </Link>
                            </div>
                        </section>

                        {/* ==================================================
                            SUMMARY
                        ================================================== */}

                        <aside className="h-fit rounded-2xl border border-[#F4A460]/20 bg-white p-6 shadow-sm">
                            <h2 className="text-lg font-extrabold text-[#2D1B0E]">
                                {t(
                                    "cart.summary.title"
                                )}
                            </h2>

                            <div className="mt-6 space-y-4">
                                <div className="flex items-center justify-between text-sm">
                                    <span className="text-[#6A5A4A]">
                                        {t(
                                            "cart.summary.vehicles"
                                        )}
                                    </span>

                                    <span className="font-bold text-[#2D1B0E]">
                                        {itemCount}
                                    </span>
                                </div>

                                <div className="flex items-center justify-between text-sm">
                                    <span className="text-[#6A5A4A]">
                                        {t(
                                            "cart.summary.subtotal"
                                        )}
                                    </span>

                                    <span className="font-bold text-[#2D1B0E]">
                                        {formatPrice(
                                            total
                                        )}
                                    </span>
                                </div>

                                <div className="border-t border-[#F4A460]/20 pt-4">
                                    <div className="flex items-center justify-between">
                                        <span className="font-extrabold text-[#2D1B0E]">
                                            {t(
                                                "cart.summary.total"
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

                            {/* CHECKOUT */}

                            <button
                                type="button"
                                onClick={() =>
                                    navigate(
                                        "/checkout"
                                    )
                                }
                                className="mt-7 flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#B22222] to-[#8B1A1A] px-5 py-3.5 text-sm font-bold text-white shadow-lg shadow-[#B22222]/20 transition hover:shadow-xl hover:shadow-[#B22222]/40"
                            >
                                {t(
                                    "cart.proceedCheckout"
                                )}

                                <ArrowRight
                                    size={18}
                                />
                            </button>

                            <p className="mt-4 text-center text-xs leading-5 text-[#6A5A4A]">
                                {t(
                                    "cart.verificationNotice"
                                )}
                            </p>
                        </aside>
                    </div>
                )}
            </main>
        </div>
    );
}

export default Cart;

