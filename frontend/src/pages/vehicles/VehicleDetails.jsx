
import { useEffect, useState } from "react";

import { Link, useParams } from "react-router-dom";

import {
    ArrowLeft,
    ArrowRight,
    Heart,
    Share2,
    MapPin,
    Fuel,
    Gauge,
    Settings2,
    CalendarDays,
    CarFront,
    ShieldCheck,
    Phone,
    MessageCircle,
    ChevronLeft,
    ChevronRight,
    CheckCircle2,
    ShoppingCart,
    Loader2,
} from "lucide-react";

import { useTranslation } from "react-i18next";

import Navbar from "../../components/Navbar";

import { getVehicle } from "../../services/vehicleService";

import { createInquiry } from "../../services/inquiryService";

import { addToCart, isInCart } from "../../services/cartService";

import { isCustomerAuthenticated } from "../../services/customerAuthService";

function VehicleDetails() {
    const { id } = useParams();
    const { t } = useTranslation();

    const [vehicle, setVehicle] = useState(null);
    const [loading, setLoading] = useState(true);
    const [selectedImage, setSelectedImage] = useState(0);
    const [favourite, setFavourite] = useState(false);

    // ============================================================
    // CART STATE
    // ============================================================

    const [inCart, setInCart] = useState(false);
    const [cartLoading, setCartLoading] = useState(false);
    const [cartError, setCartError] = useState("");
    const [cartSuccess, setCartSuccess] = useState("");

    // ============================================================
    // INQUIRY STATE
    // ============================================================

    const [showInquiry, setShowInquiry] = useState(false);

    const [inquirySubject, setInquirySubject] = useState(
        "Vehicle availability"
    );

    const [inquiryMessage, setInquiryMessage] = useState("");

    const [inquiryLoading, setInquiryLoading] = useState(false);
    const [inquirySuccess, setInquirySuccess] = useState("");
    const [inquiryError, setInquiryError] = useState("");

    // ============================================================
    // LOAD VEHICLE
    // ============================================================

    useEffect(() => {
        const loadVehicle = async () => {
            try {
                setLoading(true);

                const data = await getVehicle(id);

                setVehicle(data);
            } catch (error) {
                console.error("Failed to load vehicle:", error);
            } finally {
                setLoading(false);
            }
        };

        loadVehicle();
    }, [id]);

    // ============================================================
    // CHECK IF VEHICLE IS IN CART
    // ============================================================

    useEffect(() => {
        const checkCart = async () => {
            if (!vehicle) {
                return;
            }

            if (!isCustomerAuthenticated()) {
                setInCart(false);
                return;
            }

            try {
                const result = await isInCart(vehicle.id);

                setInCart(Boolean(result));
            } catch (error) {
                console.error("Failed to check cart:", error);

                setInCart(false);
            }
        };

        checkCart();
    }, [vehicle]);

    // ============================================================
    // INQUIRY SUBMIT
    // ============================================================

    const handleInquirySubmit = async (e) => {
        e.preventDefault();

        setInquiryError("");
        setInquirySuccess("");

        if (!inquirySubject.trim()) {
            setInquiryError(
                t("vehicleDetails.inquiry.errors.subjectRequired")
            );

            return;
        }

        if (!inquiryMessage.trim()) {
            setInquiryError(
                t("vehicleDetails.inquiry.errors.messageRequired")
            );

            return;
        }

        try {
            setInquiryLoading(true);

            await createInquiry({
                vehicle: vehicle.id,
                subject: inquirySubject,
                message: inquiryMessage,
            });

            setInquirySuccess(
                t("vehicleDetails.inquiry.success")
            );

            setInquiryMessage("");

            setTimeout(() => {
                setShowInquiry(false);
                setInquirySuccess("");
            }, 2000);
        } catch (error) {
            console.error("Failed to send inquiry:", error);

            setInquiryError(
                error.message ||
                    t("vehicleDetails.inquiry.errors.submit")
            );
        } finally {
            setInquiryLoading(false);
        }
    };

    // ============================================================
    // ADD TO CART
    // ============================================================

    const handleAddToCart = async () => {
        if (!vehicle) {
            return;
        }

        if (!isCustomerAuthenticated()) {
            alert(t("vehicleDetails.cart.loginRequired"));
            return;
        }

        if (vehicle.status !== "available") {
            setCartError(
                t("vehicleDetails.cart.unavailable")
            );

            return;
        }

        try {
            setCartLoading(true);

            setCartError("");
            setCartSuccess("");

            await addToCart(vehicle.id);

            setInCart(true);

            setCartSuccess(
                t("vehicleDetails.cart.added")
            );
        } catch (error) {
            console.error(
                "Failed to add vehicle to cart:",
                error
            );

            setCartError(
                error.message ||
                    t("vehicleDetails.cart.addFailed")
            );
        } finally {
            setCartLoading(false);
        }
    };

    // ============================================================
    // LOADING
    // ============================================================

    if (loading) {
        return (
            <div className="min-h-screen bg-[#FDF8F5]">
                <Navbar />

                <div className="mx-auto max-w-7xl px-5 py-12 md:px-8">
                    <div className="grid animate-pulse gap-8 lg:grid-cols-2">
                        <div className="h-[500px] rounded-3xl border border-[#F4A460]/20 bg-white" />

                        <div className="space-y-5">
                            <div className="h-8 w-32 rounded border border-[#F4A460]/20 bg-white" />

                            <div className="h-12 w-3/4 rounded border border-[#F4A460]/20 bg-white" />

                            <div className="h-20 rounded border border-[#F4A460]/20 bg-white" />

                            <div className="h-40 rounded border border-[#F4A460]/20 bg-white" />
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    // ============================================================
    // VEHICLE NOT FOUND
    // ============================================================

    if (!vehicle) {
        return (
            <div className="min-h-screen bg-[#FDF8F5]">
                <Navbar />

                <div className="mx-auto max-w-7xl px-5 py-20 text-center">
                    <CarFront
                        size={50}
                        className="mx-auto text-[#B22222]"
                    />

                    <h1 className="mt-5 text-3xl font-extrabold text-[#2D1B0E]">
                        {t("vehicleDetails.notFound.title")}
                    </h1>

                    <Link
                        to="/vehicles"
                        className="mt-6 inline-flex rounded-xl bg-gradient-to-r from-[#B22222] to-[#8B1A1A] px-6 py-3 font-bold text-white shadow-lg shadow-[#B22222]/20 transition hover:shadow-xl hover:shadow-[#B22222]/40"
                    >
                        <ArrowLeft size={18} className="mr-2" />

                        {t("vehicleDetails.notFound.back")}
                    </Link>
                </div>
            </div>
        );
    }

    // ============================================================
    // VEHICLE IMAGES
    // ============================================================

    const images = [...(vehicle.images || [])].sort(
        (a, b) =>
            Number(b.is_primary) -
            Number(a.is_primary)
    );

    // ============================================================
    // IMAGE URL
    // ============================================================

    const imageUrl = (image) => {
        const fallback =
            "https://images.unsplash.com/photo-1492144534655-ae79c964c9d7";

        if (!image || !image.image) {
            return fallback;
        }

        if (
            image.image.startsWith("http://") ||
            image.image.startsWith("https://")
        ) {
            return image.image;
        }

        const apiBase =
            import.meta.env.VITE_API_URL ||
            "http://127.0.0.1:8000/api";

        const backendBase = apiBase.replace(/\/api\/?$/, "");

        return `${backendBase}${image.image}`;
    };

    // ============================================================
    // NEXT IMAGE
    // ============================================================

    const nextImage = () => {
        if (images.length === 0) {
            return;
        }

        setSelectedImage(
            (previous) =>
                (previous + 1) % images.length
        );
    };

    // ============================================================
    // PREVIOUS IMAGE
    // ============================================================

    const previousImage = () => {
        if (images.length === 0) {
            return;
        }

        setSelectedImage(
            (previous) =>
                (previous - 1 + images.length) %
                images.length
        );
    };

    // ============================================================
    // FORMAT VEHICLE VALUES
    // ============================================================

    const formatNumber = (value) =>
        Number(value || 0).toLocaleString("en-TZ");

    const formatPrice = (value) =>
        `TZS ${Number(value || 0).toLocaleString(
            "en-TZ",
            {
                maximumFractionDigits: 0,
            }
        )}`;

    // ============================================================
    // TRANSLATE VEHICLE VALUES
    // ============================================================

    const getFuelLabel = (fuel) => {
        const labels = {
            petrol: t(
                "vehicleDetails.values.fuel.petrol"
            ),
            diesel: t(
                "vehicleDetails.values.fuel.diesel"
            ),
            hybrid: t(
                "vehicleDetails.values.fuel.hybrid"
            ),
            electric: t(
                "vehicleDetails.values.fuel.electric"
            ),
        };

        return labels[fuel] || fuel || "—";
    };

    const getTransmissionLabel = (transmission) => {
        const labels = {
            automatic: t(
                "vehicleDetails.values.transmission.automatic"
            ),
            manual: t(
                "vehicleDetails.values.transmission.manual"
            ),
        };

        return (
            labels[transmission] ||
            transmission ||
            "—"
        );
    };

    const getConditionStatus = (status) => {
        const labels = {
            available: t(
                "vehicleDetails.status.available"
            ),
            reserved: t(
                "vehicleDetails.status.reserved"
            ),
            sold: t(
                "vehicleDetails.status.sold"
            ),
            draft: t(
                "vehicleDetails.status.draft"
            ),
            archived: t(
                "vehicleDetails.status.archived"
            ),
        };

        return labels[status] || status || "—";
    };

    // ============================================================
    // RENDER
    // ============================================================

    return (
        <div className="min-h-screen bg-[#FDF8F5]">
            <Navbar />

            {/* ==================================================
                BREADCRUMB
            ================================================== */}

            <div className="border-b border-[#F4A460]/20 bg-white">
                <div className="mx-auto max-w-7xl px-5 py-4 md:px-8">
                    <Link
                        to="/vehicles"
                        className="inline-flex items-center gap-2 text-sm font-semibold text-[#6A5A4A] transition hover:text-[#B22222]"
                    >
                        <ArrowLeft size={17} />

                        {t(
                            "vehicleDetails.breadcrumb"
                        )}
                    </Link>
                </div>
            </div>

            {/* ==================================================
                MAIN
            ================================================== */}

            <main className="mx-auto max-w-7xl px-5 py-10 md:px-8">
                {/* ==================================================
                    TOP SECTION
                ================================================== */}

                <div className="grid gap-10 lg:grid-cols-[1.2fr_0.8fr]">
                    {/* ==================================================
                        IMAGE GALLERY
                    ================================================== */}

                    <section>
                        <div className="relative overflow-hidden rounded-3xl border border-[#F4A460]/20 bg-white shadow-sm">
                            <div className="relative h-[350px] sm:h-[450px] lg:h-[520px]">
                                <img
                                    src={
                                        images.length > 0
                                            ? imageUrl(
                                                  images[
                                                      selectedImage
                                                  ]
                                              )
                                            : imageUrl(null)
                                    }
                                    alt={`${vehicle.brand_name || ""} ${
                                        vehicle.model || ""
                                    }`}
                                    className="h-full w-full object-cover"
                                />

                                {/* IMAGE COUNTER */}

                                {images.length > 0 && (
                                    <div className="absolute bottom-4 left-4 rounded-full bg-[#2D1B0E]/90 px-4 py-2 text-sm font-semibold text-white">
                                        {selectedImage + 1}
                                        {" / "}
                                        {images.length}
                                    </div>
                                )}

                                {/* PREVIOUS */}

                                {images.length > 1 && (
                                    <button
                                        type="button"
                                        onClick={
                                            previousImage
                                        }
                                        aria-label={t(
                                            "vehicleDetails.gallery.previous"
                                        )}
                                        className="absolute left-4 top-1/2 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-white/95 text-[#2D1B0E] shadow-lg transition hover:bg-[#B22222] hover:text-white"
                                    >
                                        <ChevronLeft
                                            size={22}
                                        />
                                    </button>
                                )}

                                {/* NEXT */}

                                {images.length > 1 && (
                                    <button
                                        type="button"
                                        onClick={
                                            nextImage
                                        }
                                        aria-label={t(
                                            "vehicleDetails.gallery.next"
                                        )}
                                        className="absolute right-4 top-1/2 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-white/95 text-[#2D1B0E] shadow-lg transition hover:bg-[#B22222] hover:text-white"
                                    >
                                        <ChevronRight
                                            size={22}
                                        />
                                    </button>
                                )}
                            </div>
                        </div>

                        {/* THUMBNAILS */}

                        {images.length > 1 && (
                            <div className="mt-4 grid grid-cols-4 gap-3 sm:grid-cols-6">
                                {images.map(
                                    (image, index) => (
                                        <button
                                            type="button"
                                            key={image.id}
                                            onClick={() =>
                                                setSelectedImage(
                                                    index
                                                )
                                            }
                                            aria-label={t(
                                                "vehicleDetails.gallery.selectImage",
                                                {
                                                    number:
                                                        index +
                                                        1,
                                                }
                                            )}
                                            className={`h-20 overflow-hidden rounded-xl border-2 transition ${
                                                selectedImage ===
                                                index
                                                    ? "border-[#B22222]"
                                                    : "border-transparent"
                                            }`}
                                        >
                                            <img
                                                src={imageUrl(
                                                    image
                                                )}
                                                alt=""
                                                className="h-full w-full object-cover"
                                            />
                                        </button>
                                    )
                                )}
                            </div>
                        )}
                    </section>

                    {/* ==================================================
                        VEHICLE INFORMATION
                    ================================================== */}

                    <section>
                        <div className="flex items-start justify-between gap-5">
                            <div>
                                <p className="font-bold uppercase tracking-widest text-[#B22222]">
                                    {vehicle.brand_name}
                                </p>

                                <h1 className="mt-2 text-4xl font-extrabold tracking-tight text-[#2D1B0E] md:text-5xl">
                                    {vehicle.model}
                                </h1>

                                {vehicle.variant && (
                                    <p className="mt-2 text-lg text-[#8A7A6A]">
                                        {vehicle.variant}
                                    </p>
                                )}
                            </div>

                            <div className="flex gap-2">
                                <button
                                    type="button"
                                    onClick={() =>
                                        setFavourite(
                                            !favourite
                                        )
                                    }
                                    aria-label={t(
                                        "vehicleDetails.actions.favourite"
                                    )}
                                    className={`flex h-11 w-11 items-center justify-center rounded-xl border transition ${
                                        favourite
                                            ? "border-[#B22222]/30 bg-[#B22222]/10 text-[#B22222]"
                                            : "border-[#F4A460]/20 bg-white text-[#6A5A4A] hover:bg-[#B22222]/5"
                                    }`}
                                >
                                    <Heart
                                        size={20}
                                        fill={
                                            favourite
                                                ? "currentColor"
                                                : "none"
                                        }
                                    />
                                </button>

                                <button
                                    type="button"
                                    aria-label={t(
                                        "vehicleDetails.actions.share"
                                    )}
                                    className="flex h-11 w-11 items-center justify-center rounded-xl border border-[#F4A460]/20 bg-white text-[#6A5A4A] transition hover:bg-[#B22222]/5"
                                >
                                    <Share2 size={20} />
                                </button>
                            </div>
                        </div>

                        {/* PRICE */}

                        <div className="mt-8 rounded-2xl border border-[#F4A460]/20 bg-white p-6 shadow-sm">
                            <p className="text-sm font-semibold text-[#8A7A6A]">
                                {t(
                                    "vehicleDetails.price"
                                )}
                            </p>

                            <p className="mt-1 text-3xl font-extrabold text-[#2D1B0E]">
                                {formatPrice(
                                    vehicle.price
                                )}
                            </p>

                            <div className="mt-4 flex items-center gap-2 text-sm">
                                <CheckCircle2
                                    size={17}
                                    className="text-green-500"
                                />

                                <span className="font-semibold capitalize text-green-600">
                                    {getConditionStatus(
                                        vehicle.status
                                    )}
                                </span>
                            </div>
                        </div>

                        {/* QUICK SPECS */}

                        <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-2 xl:grid-cols-4">
                            <SpecRed
                                icon={
                                    <CalendarDays
                                        size={19}
                                    />
                                }
                                label={t(
                                    "vehicleDetails.specs.year"
                                )}
                                value={
                                    vehicle.year
                                }
                            />

                            <SpecRed
                                icon={
                                    <Gauge size={19} />
                                }
                                label={t(
                                    "vehicleDetails.specs.mileage"
                                )}
                                value={`${formatNumber(
                                    vehicle.mileage
                                )} km`}
                            />

                            <SpecRed
                                icon={
                                    <Fuel size={19} />
                                }
                                label={t(
                                    "vehicleDetails.specs.fuel"
                                )}
                                value={getFuelLabel(
                                    vehicle.fuel_type
                                )}
                            />

                            <SpecRed
                                icon={
                                    <Settings2
                                        size={19}
                                    />
                                }
                                label={t(
                                    "vehicleDetails.specs.gearbox"
                                )}
                                value={getTransmissionLabel(
                                    vehicle.transmission
                                )}
                            />
                        </div>

                        {/* LOCATION */}

                        <div className="mt-4 flex items-center gap-3 rounded-2xl border border-[#F4A460]/20 bg-white p-5">
                            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#B22222]/10 text-[#B22222]">
                                <MapPin size={21} />
                            </div>

                            <div>
                                <p className="text-xs font-semibold uppercase tracking-wider text-[#8A7A6A]">
                                    {t(
                                        "vehicleDetails.location.title"
                                    )}
                                </p>

                                <p className="mt-1 font-bold text-[#2D1B0E]">
                                    {vehicle.location ||
                                        t(
                                            "vehicleDetails.location.notSpecified"
                                        )}
                                </p>
                            </div>
                        </div>

                        {/* CART ERROR */}

                        {cartError && (
                            <div className="mt-4 rounded-xl border border-red-100 bg-red-50 px-4 py-3 text-sm font-semibold text-red-600">
                                {cartError}
                            </div>
                        )}

                        {/* CART SUCCESS */}

                        {cartSuccess && (
                            <div className="mt-4 rounded-xl border border-green-100 bg-green-50 px-4 py-3 text-sm font-semibold text-green-600">
                                {cartSuccess}
                            </div>
                        )}

                        {/* ACTIONS */}

                        <div className="mt-5 grid gap-3 sm:grid-cols-2">
                            {/* INQUIRY */}

                            <button
                                type="button"
                                onClick={() => {
                                    setInquiryError("");
                                    setInquirySuccess("");
                                    setShowInquiry(true);
                                }}
                                className="flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#B22222] to-[#8B1A1A] py-4 font-bold text-white shadow-lg shadow-[#B22222]/20 transition hover:scale-[1.02] hover:shadow-xl hover:shadow-[#B22222]/40"
                            >
                                <Phone size={19} />

                                {t(
                                    "vehicleDetails.actions.inquiry"
                                )}
                            </button>

                            {/* ADD TO CART */}

                            <button
                                type="button"
                                onClick={
                                    handleAddToCart
                                }
                                disabled={
                                    cartLoading ||
                                    inCart ||
                                    vehicle.status !==
                                        "available"
                                }
                                className="flex items-center justify-center gap-2 rounded-xl bg-[#2D1B0E] px-5 py-3.5 text-sm font-bold text-white transition hover:bg-[#B22222] disabled:cursor-not-allowed disabled:bg-[#8A7A6A]"
                            >
                                {cartLoading ? (
                                    <>
                                        <Loader2
                                            size={18}
                                            className="animate-spin"
                                        />

                                        {t(
                                            "vehicleDetails.cart.adding"
                                        )}
                                    </>
                                ) : (
                                    <>
                                        <ShoppingCart
                                            size={18}
                                        />

                                        {inCart
                                            ? t(
                                                  "vehicleDetails.cart.already"
                                              )
                                            : vehicle.status !==
                                              "available"
                                            ? t(
                                                  "vehicleDetails.cart.unavailable"
                                              )
                                            : t(
                                                  "vehicleDetails.cart.add"
                                              )}
                                    </>
                                )}
                            </button>

                            {/* VIEW CART */}

                            <Link
                                to="/cart"
                                className="flex items-center justify-center gap-2 rounded-xl border border-[#F4A460]/20 bg-[#FDF8F5] px-5 py-3.5 text-sm font-bold text-[#B22222] transition hover:bg-[#B22222]/5"
                            >
                                <ShoppingCart
                                    size={18}
                                />

                                {t(
                                    "vehicleDetails.cart.view"
                                )}

                                <ArrowRight
                                    size={18}
                                />
                            </Link>

                            {/* WHATSAPP */}

                            <button
                                type="button"
                                className="flex items-center justify-center gap-2 rounded-xl border border-[#F4A460]/20 bg-[#FDF8F5] py-4 font-bold text-[#2D1B0E] transition hover:bg-[#B22222]/5"
                            >
                                <MessageCircle
                                    size={19}
                                />

                                {t(
                                    "vehicleDetails.actions.whatsapp"
                                )}
                            </button>
                        </div>

                        {/* TRUST */}

                        <div className="mt-5 flex items-center gap-3 rounded-xl border border-[#F4A460]/20 bg-[#FDF8F5] p-4">
                            <ShieldCheck
                                size={23}
                                className="shrink-0 text-[#B22222]"
                            />

                            <p className="text-sm text-[#6A5A4A]">
                                <span className="font-bold text-[#2D1B0E]">
                                    {t(
                                        "vehicleDetails.trust.title"
                                    )}
                                </span>{" "}
                                {t(
                                    "vehicleDetails.trust.description"
                                )}
                            </p>
                        </div>
                    </section>
                </div>

                {/* ==================================================
                    SPECIFICATIONS
                ================================================== */}

                <section className="mt-12 rounded-3xl border border-[#F4A460]/20 bg-white p-6 shadow-sm md:p-8">
                    <div className="flex items-center gap-3">
                        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#B22222]/10 text-[#B22222]">
                            <CarFront size={22} />
                        </div>

                        <div>
                            <p className="text-sm font-semibold text-[#B22222]">
                                {t(
                                    "vehicleDetails.information.label"
                                )}
                            </p>

                            <h2 className="text-2xl font-extrabold text-[#2D1B0E]">
                                {t(
                                    "vehicleDetails.information.title"
                                )}
                            </h2>
                        </div>
                    </div>

                    <div className="mt-8 grid gap-x-10 gap-y-5 sm:grid-cols-2 lg:grid-cols-3">
                        <DetailRed
                            label={t(
                                "vehicleDetails.details.brand"
                            )}
                            value={
                                vehicle.brand_name
                            }
                        />

                        <DetailRed
                            label={t(
                                "vehicleDetails.details.model"
                            )}
                            value={vehicle.model}
                        />

                        <DetailRed
                            label={t(
                                "vehicleDetails.details.variant"
                            )}
                            value={vehicle.variant}
                        />

                        <DetailRed
                            label={t(
                                "vehicleDetails.details.year"
                            )}
                            value={vehicle.year}
                        />

                        <DetailRed
                            label={t(
                                "vehicleDetails.details.mileage"
                            )}
                            value={`${formatNumber(
                                vehicle.mileage
                            )} km`}
                        />

                        <DetailRed
                            label={t(
                                "vehicleDetails.details.fuelType"
                            )}
                            value={getFuelLabel(
                                vehicle.fuel_type
                            )}
                        />

                        <DetailRed
                            label={t(
                                "vehicleDetails.details.transmission"
                            )}
                            value={getTransmissionLabel(
                                vehicle.transmission
                            )}
                        />

                        <DetailRed
                            label={t(
                                "vehicleDetails.details.engine"
                            )}
                            value={
                                vehicle.engine_size
                            }
                        />

                        <DetailRed
                            label={t(
                                "vehicleDetails.details.horsepower"
                            )}
                            value={
                                vehicle.horsepower
                            }
                        />

                        <DetailRed
                            label={t(
                                "vehicleDetails.details.drivetrain"
                            )}
                            value={
                                vehicle.drivetrain
                            }
                        />

                        <DetailRed
                            label={t(
                                "vehicleDetails.details.seats"
                            )}
                            value={vehicle.seats}
                        />

                        <DetailRed
                            label={t(
                                "vehicleDetails.details.doors"
                            )}
                            value={vehicle.doors}
                        />

                        <DetailRed
                            label={t(
                                "vehicleDetails.details.exteriorColor"
                            )}
                            value={
                                vehicle.exterior_color
                            }
                        />

                        <DetailRed
                            label={t(
                                "vehicleDetails.details.interiorColor"
                            )}
                            value={
                                vehicle.interior_color
                            }
                        />
                    </div>
                </section>

                {/* ==================================================
                    DESCRIPTION
                ================================================== */}

                <section className="mt-8 rounded-3xl border border-[#F4A460]/20 bg-white p-6 shadow-sm md:p-8">
                    <h2 className="text-2xl font-extrabold text-[#2D1B0E]">
                        {t(
                            "vehicleDetails.description.title"
                        )}
                    </h2>

                    <p className="mt-5 whitespace-pre-line leading-8 text-[#6A5A4A]">
                        {vehicle.description ||
                            t(
                                "vehicleDetails.description.empty"
                            )}
                    </p>
                </section>
            </main>

            {/* ==================================================
                INQUIRY MODAL
            ================================================== */}

            {showInquiry && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#2D1B0E]/60 px-5 py-8 backdrop-blur-sm">
                    <div className="relative w-full max-w-lg overflow-hidden rounded-3xl bg-white shadow-2xl">
                        {/* HEADER */}

                        <div className="border-b border-[#F4A460]/20 bg-[#FDF8F5] px-6 py-5">
                            <div className="flex items-start justify-between gap-4">
                                <div>
                                    <p className="text-sm font-bold uppercase tracking-wider text-[#B22222]">
                                        {t(
                                            "vehicleDetails.inquiry.contactSeller"
                                        )}
                                    </p>

                                    <h2 className="mt-1 text-2xl font-extrabold text-[#2D1B0E]">
                                        {t(
                                            "vehicleDetails.inquiry.title"
                                        )}
                                    </h2>

                                    <p className="mt-1 text-sm text-[#8A7A6A]">
                                        {t(
                                            "vehicleDetails.inquiry.description"
                                        )}
                                    </p>
                                </div>

                                <button
                                    type="button"
                                    onClick={() => {
                                        setShowInquiry(
                                            false
                                        );
                                        setInquiryError(
                                            ""
                                        );
                                        setInquirySuccess(
                                            ""
                                        );
                                    }}
                                    aria-label={t(
                                        "common.close"
                                    )}
                                    className="flex h-9 w-9 items-center justify-center rounded-xl text-xl font-bold text-[#8A7A6A] transition hover:bg-white hover:text-[#2D1B0E]"
                                >
                                    ×
                                </button>
                            </div>
                        </div>

                        {/* FORM */}

                        <form
                            onSubmit={
                                handleInquirySubmit
                            }
                            className="space-y-5 p-6"
                        >
                            {/* VEHICLE */}

                            <div className="rounded-2xl border border-[#F4A460]/20 bg-[#FDF8F5] p-4">
                                <p className="text-xs font-bold uppercase tracking-wider text-[#B22222]">
                                    {t(
                                        "vehicleDetails.inquiry.vehicle"
                                    )}
                                </p>

                                <p className="mt-1 font-extrabold text-[#2D1B0E]">
                                    {
                                        vehicle.brand_name
                                    }{" "}
                                    {vehicle.model}

                                    {vehicle.year
                                        ? ` (${vehicle.year})`
                                        : ""}
                                </p>
                            </div>

                            {/* ERROR */}

                            {inquiryError && (
                                <div className="rounded-xl border border-red-100 bg-red-50 px-4 py-3 text-sm font-semibold text-red-600">
                                    {inquiryError}
                                </div>
                            )}

                            {/* SUCCESS */}

                            {inquirySuccess && (
                                <div className="rounded-xl border border-green-100 bg-green-50 px-4 py-3 text-sm font-semibold text-green-600">
                                    {inquirySuccess}
                                </div>
                            )}

                            {/* SUBJECT */}

                            <div>
                                <label className="mb-2 block text-sm font-bold text-[#2D1B0E]">
                                    {t(
                                        "vehicleDetails.inquiry.subject"
                                    )}
                                </label>

                                <input
                                    type="text"
                                    value={
                                        inquirySubject
                                    }
                                    onChange={(e) =>
                                        setInquirySubject(
                                            e.target
                                                .value
                                        )
                                    }
                                    placeholder={t(
                                        "vehicleDetails.inquiry.subjectPlaceholder"
                                    )}
                                    className="w-full rounded-xl border border-[#F4A460]/20 bg-[#FDF8F5] px-4 py-3.5 text-sm outline-none transition focus:border-[#B22222] focus:bg-white focus:ring-4 focus:ring-[#B22222]/10"
                                />
                            </div>

                            {/* MESSAGE */}

                            <div>
                                <label className="mb-2 block text-sm font-bold text-[#2D1B0E]">
                                    {t(
                                        "vehicleDetails.inquiry.message"
                                    )}
                                </label>

                                <textarea
                                    rows="5"
                                    value={
                                        inquiryMessage
                                    }
                                    onChange={(e) =>
                                        setInquiryMessage(
                                            e.target
                                                .value
                                        )
                                    }
                                    placeholder={t(
                                        "vehicleDetails.inquiry.messagePlaceholder"
                                    )}
                                    className="w-full resize-none rounded-xl border border-[#F4A460]/20 bg-[#FDF8F5] px-4 py-3.5 text-sm outline-none transition focus:border-[#B22222] focus:bg-white focus:ring-4 focus:ring-[#B22222]/10"
                                />
                            </div>

                            {/* BUTTONS */}

                            <div className="grid gap-3 sm:grid-cols-2">
                                <button
                                    type="button"
                                    onClick={() => {
                                        setShowInquiry(
                                            false
                                        );
                                        setInquiryError(
                                            ""
                                        );
                                        setInquirySuccess(
                                            ""
                                        );
                                    }}
                                    className="rounded-xl border border-[#F4A460]/20 bg-white py-3.5 font-bold text-[#2D1B0E] transition hover:bg-[#FDF8F5]"
                                >
                                    {t(
                                        "common.cancel"
                                    )}
                                </button>

                                <button
                                    type="submit"
                                    disabled={
                                        inquiryLoading
                                    }
                                    className="flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#B22222] to-[#8B1A1A] py-3.5 font-bold text-white shadow-lg shadow-[#B22222]/20 transition hover:shadow-xl hover:shadow-[#B22222]/40 disabled:cursor-not-allowed disabled:opacity-60"
                                >
                                    {inquiryLoading ? (
                                        <>
                                            <span className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent" />

                                            {t(
                                                "vehicleDetails.inquiry.sending"
                                            )}
                                        </>
                                    ) : (
                                        <>
                                            <MessageCircle
                                                size={
                                                    18
                                                }
                                            />

                                            {t(
                                                "vehicleDetails.inquiry.send"
                                            )}
                                        </>
                                    )}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}

// ============================================================
// SPEC RED COMPONENT
// ============================================================

function SpecRed({ icon, label, value }) {
    return (
        <div className="rounded-2xl border border-[#F4A460]/20 bg-white p-4">
            <div className="text-[#B22222]">
                {icon}
            </div>

            <p className="mt-3 text-xs text-[#8A7A6A]">
                {label}
            </p>

            <p className="mt-1 truncate text-sm font-bold capitalize text-[#2D1B0E]">
                {value || "—"}
            </p>
        </div>
    );
}

// ============================================================
// DETAIL RED COMPONENT
// ============================================================

function DetailRed({ label, value }) {
    return (
        <div className="flex items-center justify-between border-b border-[#F4A460]/10 pb-3">
            <span className="text-sm text-[#8A7A6A]">
                {label}
            </span>

            <span className="text-right text-sm font-bold capitalize text-[#2D1B0E]">
                {value || "—"}
            </span>
        </div>
    );
}

export default VehicleDetails;
