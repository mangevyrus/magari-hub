
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
    ArrowRight,
    Search,
    ShieldCheck,
    CarFront,
    BadgeCheck,
    Headphones,
    Sparkles,
    ChevronRight,
    Star,
    Award,
    TrendingUp,
    Users,
    Phone,
    Clock,
    Quote,
} from "lucide-react";
import { useTranslation } from "react-i18next";

import VehicleCard from "../../components/VehicleCard";
import Navbar from "../../components/Navbar";

import {
    getVehicles,
    getBrands,
} from "../../services/vehicleService";

import heroImage from "../../assets/hero-car.webp";

// ============================================================
// COUNTRY DOMAIN CONFIGURATION
// ============================================================

const COUNTRY_TOP_LEVEL_DOMAIN = {
    asterdio: "asterdio.xyz",
    bj: "bj",
    ci: "ci",
    coke: "co.ke",
    coza: "co.za",
    ma: "ma",
    rw: "rw",
    sn: "sn",
    tg: "tg",
    tz: "tz",
    ug: "ug",
};

// ============================================================
// GET TOP LEVEL DOMAIN
// ============================================================

function getTopLevelDomain() {
    const hostname = window.location.hostname;

    const topLevelDomainArr = hostname.split("bingwamagari.");

    let topLevelDomain = "";

    if (topLevelDomainArr.includes("localhost")) {
        topLevelDomain = topLevelDomainArr[0];
    } else {
        topLevelDomain =
            topLevelDomainArr[topLevelDomainArr.length - 1];
    }

    return topLevelDomain;
}

const topLevelDomain = getTopLevelDomain();

// ============================================================
// SITE TITLE
// ============================================================

const getSiteTitle = (language) => {
    const titles = {
        sw: {
            [COUNTRY_TOP_LEVEL_DOMAIN.bj]:
                "BINGWA MAGARI USED.bj - Magari Yaliyotumika Yaliyothibitishwa Benin | Nunua na Uza Magari",

            [COUNTRY_TOP_LEVEL_DOMAIN.ci]:
                "BINGWA MAGARI USED.ci - Magari Yaliyotumika Yaliyothibitishwa Abidjan | Nunua na Uza Magari",

            [COUNTRY_TOP_LEVEL_DOMAIN.coke]:
                "BINGWA MAGARI USED.co.ke - Magari Yaliyotumika Yaliyothibitishwa Kenya | Nunua na Uza Magari",

            [COUNTRY_TOP_LEVEL_DOMAIN.coza]:
                "BINGWA MAGARI USED.co.za - Magari Yaliyotumika Yaliyothibitishwa Afrika Kusini | Nunua na Uza Magari",

            [COUNTRY_TOP_LEVEL_DOMAIN.ma]:
                "BINGWA MAGARI USED.ma - Magari Yaliyotumika Yaliyothibitishwa Morocco | Nunua na Uza Magari",

            [COUNTRY_TOP_LEVEL_DOMAIN.rw]:
                "BINGWA MAGARI USED.rw - Magari Yaliyotumika Yaliyothibitishwa Kigali, Rwanda | Nunua na Uza",

            [COUNTRY_TOP_LEVEL_DOMAIN.sn]:
                "Magari Yaliyotumika Yaliyothibitishwa Dakar, Senegal | BINGWA MAGARI USED.sn | Nunua na Uza",

            [COUNTRY_TOP_LEVEL_DOMAIN.tg]:
                "BINGWA MAGARI USED.tg - Magari Yaliyotumika Yaliyothibitishwa Togo | Nunua na Uza Magari",

            [COUNTRY_TOP_LEVEL_DOMAIN.tz]:
                "BINGWA MAGARI USED.tz - Magari Yaliyotumika Yaliyothibitishwa Tanzania | Nunua na Uza Magari",

            [COUNTRY_TOP_LEVEL_DOMAIN.ug]:
                "BINGWA MAGARI USED.ug - Magari Yaliyotumika Yaliyothibitishwa Uganda | Nunua na Uza Magari",
        },

        en: {
            [COUNTRY_TOP_LEVEL_DOMAIN.bj]:
                "BINGWA MAGARI USED.bj - Certified Used Cars in Benin | Buy & Sell Cars",

            [COUNTRY_TOP_LEVEL_DOMAIN.ci]:
                "BINGWA MAGARI USED.ci - Certified Used Cars in Abidjan, Côte d'Ivoire | Buy & Sell Cars Locally",

            [COUNTRY_TOP_LEVEL_DOMAIN.coke]:
                "BINGWA MAGARI USED.co.ke - Certified Used Cars in Kenya | Buy & Sell Cars",

            [COUNTRY_TOP_LEVEL_DOMAIN.coza]:
                "BINGWA MAGARI USED.co.za - Certified Used Cars in South Africa | Buy & Sell Cars Locally",

            [COUNTRY_TOP_LEVEL_DOMAIN.ma]:
                "BINGWA MAGARI USED.ma - Certified Used Cars in Morocco | Buy & Sell Cars",

            [COUNTRY_TOP_LEVEL_DOMAIN.rw]:
                "BINGWA MAGARI USED.rw - Certified Used Cars in Kigali, Rwanda | Buy & Sell Locally",

            [COUNTRY_TOP_LEVEL_DOMAIN.sn]:
                "Certified Used Cars in Dakar, Senegal | BINGWA MAGARI USED.sn | Buy & Sell Locally",

            [COUNTRY_TOP_LEVEL_DOMAIN.tg]:
                "BINGWA MAGARI USED.tg - Certified Used Cars in Togo | Buy & Sell Cars",

            [COUNTRY_TOP_LEVEL_DOMAIN.tz]:
                "BINGWA MAGARI USED.tz - Certified Used Cars in Tanzania | Buy & Sell Cars",

            [COUNTRY_TOP_LEVEL_DOMAIN.ug]:
                "BINGWA MAGARI USED.ug - Certified Used Cars in Uganda | Buy & Sell Cars",
        },
    };

    return (
        titles[language]?.[topLevelDomain] ||
        (language === "sw"
            ? "BINGWA MAGARI USED - Nunua magari yaliyotumika yaliyothibitishwa"
            : "BINGWA MAGARI USED - Buy certified used cars")
    );
};

// ============================================================
// SITE DESCRIPTION
// ============================================================

const getSiteDescription = (language) => {
    const descriptions = {
        sw: {
            [COUNTRY_TOP_LEVEL_DOMAIN.bj]:
                "Unatafuta gari lililotumika lililothibitishwa Benin? BINGWA MAGARI USED.bj ni soko lako la ndani la kununua na kuuza magari bora yaliyotumika.",

            [COUNTRY_TOP_LEVEL_DOMAIN.ci]:
                "Unatafuta gari lililotumika lililothibitishwa Abidjan, Côte d'Ivoire? BINGWA MAGARI USED.ci ni soko lako la ndani la kununua na kuuza magari bora.",

            [COUNTRY_TOP_LEVEL_DOMAIN.coke]:
                "Unatafuta gari lililotumika lililothibitishwa Kenya? BINGWA MAGARI USED.co.ke ni soko lako la kununua na kuuza magari bora yaliyotumika.",

            [COUNTRY_TOP_LEVEL_DOMAIN.coza]:
                "BINGWA MAGARI USED.co.za ni soko lako la kununua na kuuza magari bora yaliyotumika Afrika Kusini.",

            [COUNTRY_TOP_LEVEL_DOMAIN.ma]:
                "Jukwaa lako bora Morocco la kununua na kuuza magari yaliyotumika yaliyothibitishwa.",

            [COUNTRY_TOP_LEVEL_DOMAIN.rw]:
                "Soko lako la ndani Kigali la kununua na kuuza magari yaliyotumika yaliyothibitishwa.",

            [COUNTRY_TOP_LEVEL_DOMAIN.sn]:
                "Unatafuta gari lililotumika lililothibitishwa Dakar, Senegal? BINGWA MAGARI USED.sn ni jukwaa lako la ndani la kununua na kuuza magari bora.",

            [COUNTRY_TOP_LEVEL_DOMAIN.tg]:
                "Unatafuta gari lililotumika lililothibitishwa Togo? BINGWA MAGARI USED.tg ni soko lako la kununua na kuuza magari bora.",

            [COUNTRY_TOP_LEVEL_DOMAIN.tz]:
                "Unatafuta gari lililotumika lililothibitishwa Tanzania? BINGWA MAGARI USED.tz ni soko lako la kuaminika la kununua na kuuza magari bora yaliyotumika.",

            [COUNTRY_TOP_LEVEL_DOMAIN.ug]:
                "Unatafuta gari lililotumika lililothibitishwa Uganda? BINGWA MAGARI USED.ug ni soko lako la kununua na kuuza magari bora.",
        },

        en: {
            [COUNTRY_TOP_LEVEL_DOMAIN.bj]:
                "Looking for a certified used car in Benin? BINGWA MAGARI USED.bj is your go-to local marketplace for buying and selling quality used cars.",

            [COUNTRY_TOP_LEVEL_DOMAIN.ci]:
                "Looking for a certified used car in Abidjan, Côte d'Ivoire? BINGWA MAGARI USED.ci is your go-to local marketplace for buying and selling quality used cars.",

            [COUNTRY_TOP_LEVEL_DOMAIN.coke]:
                "Looking for a certified used car in Kenya? BINGWA MAGARI USED.co.ke is your go-to local marketplace for buying and selling quality used cars.",

            [COUNTRY_TOP_LEVEL_DOMAIN.coza]:
                "Looking for a certified used car in South Africa? BINGWA MAGARI USED.co.za is your go-to local marketplace for buying and selling quality used cars.",

            [COUNTRY_TOP_LEVEL_DOMAIN.ma]:
                "Your trusted marketplace in Morocco for buying and selling certified used cars.",

            [COUNTRY_TOP_LEVEL_DOMAIN.rw]:
                "Your local marketplace in Kigali for buying and selling certified used cars.",

            [COUNTRY_TOP_LEVEL_DOMAIN.sn]:
                "Looking for a certified used car in Dakar, Senegal? BINGWA MAGARI USED.sn is your local platform for buying and selling quality used cars.",

            [COUNTRY_TOP_LEVEL_DOMAIN.tg]:
                "Looking for a certified used car in Togo? BINGWA MAGARI USED.tg is your go-to marketplace for buying and selling quality used cars.",

            [COUNTRY_TOP_LEVEL_DOMAIN.tz]:
                "Looking for a certified used car in Tanzania? BINGWA MAGARI USED.tz is your trusted marketplace for buying and selling quality used cars.",

            [COUNTRY_TOP_LEVEL_DOMAIN.ug]:
                "Looking for a certified used car in Uganda? BINGWA MAGARI USED.ug is your go-to marketplace for buying and selling quality used cars.",
        },
    };

    return (
        descriptions[language]?.[topLevelDomain] ||
        (language === "sw"
            ? "Nunua na uza magari yaliyotumika yaliyothibitishwa kwa usalama na kwa bei nzuri."
            : "Buy and sell certified used cars safely and at great prices.")
    );
};

// ============================================================
// MAIN HOME COMPONENT
// ============================================================

function Home() {
    const navigate = useNavigate();
    const { t, i18n } = useTranslation();

    const [vehicles, setVehicles] = useState([]);
    const [loading, setLoading] = useState(true);

    const [brands, setBrands] = useState([]);
    const [brandsLoading, setBrandsLoading] = useState(true);

    const [searchTerm, setSearchTerm] = useState("");

    // ========================================================
    // BRAND FILTER STATE
    // ========================================================

    const [selectedBrand, setSelectedBrand] = useState(null);
    const [brandVehicles, setBrandVehicles] = useState([]);
    const [brandLoading, setBrandLoading] = useState(false);
    const [brandError, setBrandError] = useState("");

    // ========================================================
    // LOAD BRANDS
    // ========================================================

    useEffect(() => {
        const loadBrands = async () => {
            try {
                setBrandsLoading(true);

                const data = await getBrands();

                setBrands(
                    Array.isArray(data)
                        ? data
                        : data?.results || []
                );
            } catch (error) {
                console.error(
                    "Failed to load brands:",
                    error
                );

                setBrands([]);
            } finally {
                setBrandsLoading(false);
            }
        };

        loadBrands();
    }, []);

    // ========================================================
    // LOAD VEHICLES
    // ========================================================

    useEffect(() => {
        const loadVehicles = async () => {
            try {
                setLoading(true);

                const data = await getVehicles();

                setVehicles(
                    Array.isArray(data)
                        ? data
                        : data?.results || []
                );
            } catch (error) {
                console.error(
                    "Failed to load vehicles:",
                    error
                );

                setVehicles([]);
            } finally {
                setLoading(false);
            }
        };

        loadVehicles();
    }, []);

    // ========================================================
    // PAGE SEO
    // ========================================================

    useEffect(() => {
        const language =
            i18n.language === "en" ? "en" : "sw";

        document.title = getSiteTitle(language);

        const metaDescription =
            document.querySelector(
                'meta[name="description"]'
            );

        if (metaDescription) {
            metaDescription.setAttribute(
                "content",
                getSiteDescription(language)
            );
        }
    }, [i18n.language]);

    // ========================================================
    // BRAND CLICK
    // ========================================================

    const handleBrandClick = async (brand) => {
        setSelectedBrand(brand);
        setBrandVehicles([]);
        setBrandError("");
        setBrandLoading(true);

        try {
            const data = await getVehicles(
                `?brand=${encodeURIComponent(brand.id)}`
            );

            const availableVehicles = Array.isArray(data)
                ? data
                : data?.results || [];

            if (availableVehicles.length === 0) {
                setBrandError(
                    t("home.brandNotAvailable", {
                        brand: brand.name,
                    })
                );

                return;
            }

            setBrandVehicles(availableVehicles);

            setTimeout(() => {
                document
                    .getElementById(
                        "selected-brand-vehicles"
                    )
                    ?.scrollIntoView({
                        behavior: "smooth",
                        block: "start",
                    });
            }, 100);
        } catch (error) {
            console.error(
                `Failed to load ${brand.name} vehicles:`,
                error
            );

            if (error.response?.status === 404) {
                setBrandError(
                    t("home.brandNotAvailable", {
                        brand: brand.name,
                    })
                );
            } else {
                setBrandError(
                    t("home.brandLoadError", {
                        brand: brand.name,
                    })
                );
            }
        } finally {
            setBrandLoading(false);
        }
    };

    // ========================================================
    // CLEAR BRAND FILTER
    // ========================================================

    const clearBrandFilter = () => {
        setSelectedBrand(null);
        setBrandVehicles([]);
        setBrandError("");
        setBrandLoading(false);
    };

    // ========================================================
    // SEARCH
    // ========================================================

    const handleSearch = (e) => {
        e.preventDefault();

        const query = searchTerm.trim();

        if (query) {
            navigate(
                `/vehicles?search=${encodeURIComponent(query)}`
            );
        } else {
            navigate("/vehicles");
        }
    };

    return (
        <div className="min-h-screen bg-[#FDF8F5] font-sans text-[#2D1B0E] antialiased">

            <Navbar />

            {/* =========================================================
                HERO
            ========================================================= */}

            <section className="relative h-[90vh] min-h-[600px] w-full overflow-hidden">

                <div className="absolute inset-0 h-full w-full">

                    <img
                        src={heroImage}
                        alt="Bingwa Magari Used - Premium Cars"
                        className="h-full w-full object-cover object-center"
                    />

                    <div className="absolute inset-0 bg-gradient-to-r from-[#000000]/55 via-[#450808]/50 to-black/20" />

                    <div className="absolute inset-0 bg-gradient-to-t from-[#4A0E0E]/70 via-transparent to-transparent" />

                    <div className="absolute right-0 top-0 h-full w-1/2 bg-gradient-to-l from-[#B22222]/20 via-transparent to-transparent" />
                </div>

                <div className="relative z-10 flex h-full w-full items-center">

                    <div className="mx-auto w-full max-w-7xl px-5 md:px-8">

                        <div className="max-w-3xl">

                            <div className="mb-6 flex items-center gap-3 text-sm font-medium text-[#F4A460]/80">

                                <Phone
                                    size={16}
                                    className="text-[#F4A460]"
                                />

                                <span>
                                    {t("home.callUs")}
                                </span>
                            </div>

                            <div className="mb-4">

                                <h1 className="text-5xl font-bold leading-[1.05] tracking-tight text-white md:text-6xl lg:text-7xl">

                                    <span className="text-[#F4A460]">
                                        BINGWA WA
                                    </span>

                                    <span className="text-white">
                                        {" "}MAGARI USED
                                    </span>

                                </h1>
                            </div>

                            <p className="mb-6 text-3xl font-bold leading-tight text-white md:text-4xl lg:text-5xl">

                                {t("home.heroTitle")}

                                <br />

                                <span className="text-[#F4A460]">
                                    {t("home.heroHighlight")}
                                </span>
                            </p>

                            <div className="max-w-2xl rounded-2xl border border-[#F4A460]/20 bg-white/95 p-4 shadow-2xl shadow-[#4A0E0E]/30 backdrop-blur-sm">

                                <div className="flex flex-col gap-3 sm:flex-row">

                                    <div className="flex flex-1 items-center gap-3 rounded-xl border border-[#F4A460]/10 bg-[#FDF8F5]/80 px-4 py-3">

                                        <Search
                                            size={20}
                                            className="text-[#B22222]"
                                        />

                                        <input
                                            type="text"
                                            value={searchTerm}
                                            onChange={(e) =>
                                                setSearchTerm(
                                                    e.target.value
                                                )
                                            }
                                            placeholder={t(
                                                "home.searchPlaceholder"
                                            )}
                                            className="w-full bg-transparent py-2 text-sm font-medium text-[#2D1B0E] outline-none placeholder:text-[#8A7A6A]"
                                        />
                                    </div>

                                    <button
                                        type="button"
                                        onClick={handleSearch}
                                        className="flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#B22222] to-[#8B1A1A] px-8 py-3.5 font-bold text-white shadow-lg shadow-[#B22222]/30 transition-all hover:scale-[1.02] hover:shadow-xl hover:shadow-[#B22222]/50"
                                    >
                                        {t("home.searchButton")}

                                        <ArrowRight size={18} />
                                    </button>
                                </div>
                            </div>

                            <div className="mt-4 flex items-center gap-4">
                                <span className="text-sm font-medium text-white/70" />
                            </div>
                        </div>
                    </div>
                </div>

                <div className="absolute bottom-8 right-8 z-10 hidden rounded-2xl border border-[#F4A460]/20 bg-white/95 px-5 py-3 shadow-xl backdrop-blur-sm md:block">

                    <div className="flex items-center gap-3">

                        <div className="flex -space-x-2">
                            <div className="h-8 w-8 rounded-full border-2 border-white bg-[#B22222] shadow" />
                            <div className="h-8 w-8 rounded-full border-2 border-white bg-[#F4A460] shadow" />
                            <div className="h-8 w-8 rounded-full border-2 border-white bg-[#8B1A1A] shadow" />
                        </div>

                        <div>
                            <p className="text-sm font-bold text-[#2D1B0E]">
                                1,200+
                            </p>

                            <p className="text-xs text-[#8A7A6A]">
                                {t("home.activeUsers")}
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* =========================================================
                TRUST BAR
            ========================================================= */}

            <section className="border-y border-[#F4A460]/20 bg-white/80 backdrop-blur-sm">

                <div className="mx-auto max-w-7xl px-5 md:px-8">

                    <div className="grid grid-cols-1 divide-y divide-[#F4A460]/20 py-6 md:grid-cols-3 md:divide-x md:divide-y-0">

                        <TrustBarRed
                            icon={ShieldCheck}
                            label={t("home.trust.verifiedSellers")}
                            sub={t("home.trust.authentic")}
                        />

                        <TrustBarRed
                            icon={CarFront}
                            label={t("home.trust.qualityChecked")}
                            sub={t("home.trust.inspected")}
                        />

                        <TrustBarRed
                            icon={Headphones}
                            label={t("home.trust.expertSupport")}
                            sub={t("home.trust.support24")}
                        />
                    </div>
                </div>
            </section>

            {/* =========================================================
                FEATURED VEHICLES
            ========================================================= */}

            <section className="mx-auto max-w-7xl px-5 py-20 md:px-8 lg:py-28">

                <div className="mb-12 flex flex-col justify-between gap-6 md:flex-row md:items-end">

                    <div>

                        <div className="flex items-center gap-3 text-sm font-bold uppercase tracking-[0.2em] text-[#B22222]">

                            <span className="h-px w-8 bg-[#B22222]" />

                            {t("home.featuredListings")}
                        </div>

                        <h2 className="mt-3 text-3xl font-bold tracking-tight text-[#2D1B0E] md:text-4xl">

                            {t("home.handpicked")}{" "}

                            <span className="text-[#B22222]">
                                {t("home.vehicles")}
                            </span>
                        </h2>

                        <p className="mt-2 max-w-xl text-[#6A5A4A]">
                            {t("home.featuredDescription")}
                        </p>
                    </div>

                    <Link
                        to="/vehicles"
                        className="group flex items-center gap-2 font-semibold text-[#B22222] transition hover:text-[#8B1A1A]"
                    >
                        {t("home.viewAll")}

                        <ChevronRight
                            size={18}
                            className="transition group-hover:translate-x-1"
                        />
                    </Link>
                </div>

                {loading ? (
                    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                        {[1, 2, 3, 4, 5, 6].map((i) => (
                            <div
                                key={i}
                                className="h-[380px] animate-pulse rounded-2xl border border-[#F4A460]/20 bg-white shadow-sm"
                            />
                        ))}
                    </div>
                ) : vehicles.length === 0 ? (
                    <div className="rounded-3xl border border-[#F4A460]/20 bg-white px-6 py-24 text-center shadow-sm">

                        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-[#B22222]/10 text-[#B22222]">
                            <CarFront size={30} />
                        </div>

                        <h3 className="mt-6 text-2xl font-bold text-[#2D1B0E]">
                            {t("home.noVehicles")}
                        </h3>

                        <p className="mx-auto mt-3 max-w-md text-[#6A5A4A]">
                            {t("home.newListingsSoon")}
                        </p>
                    </div>
                ) : (
                    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">

                        {vehicles.slice(0, 6).map(
                            (vehicle, index) => (
                                <div
                                    key={vehicle.id}
                                    className="group overflow-hidden rounded-2xl border border-[#F4A460]/20 bg-white transition-all hover:-translate-y-2 hover:border-[#B22222] hover:shadow-xl hover:shadow-[#B22222]/15"
                                    style={{
                                        animationDelay: `${index * 100}ms`,
                                    }}
                                >
                                    <VehicleCard
                                        vehicle={vehicle}
                                    />
                                </div>
                            )
                        )}
                    </div>
                )}
            </section>

            {/* =========================================================
                POPULAR BRANDS
            ========================================================= */}

            <section className="border-b border-[#F4A460]/20 bg-white py-16 md:py-20">

                <div className="mx-auto max-w-7xl px-5 md:px-8">

                    <div className="mb-10 flex flex-col justify-between gap-5 sm:flex-row sm:items-end">

                        <div>

                            <div className="flex items-center gap-3 text-sm font-bold uppercase tracking-[0.2em] text-[#B22222]">

                                <span className="h-px w-8 bg-[#B22222]" />

                                {t("home.popularBrands")}
                            </div>

                            <h2 className="mt-3 text-3xl font-bold tracking-tight text-[#2D1B0E] md:text-4xl">

                                {t("home.browseBy")}{" "}

                                <span className="text-[#B22222]">
                                    {t("home.brand")}
                                </span>
                            </h2>

                            <p className="mt-2 max-w-xl text-[#6A5A4A]">
                                {t("home.brandDescription")}
                            </p>
                        </div>

                        <Link
                            to="/vehicles"
                            className="group inline-flex items-center gap-2 font-semibold text-[#B22222] transition hover:text-[#8B1A1A]"
                        >
                            {t("home.viewAllVehicles")}

                            <ChevronRight
                                size={18}
                                className="transition-transform duration-300 group-hover:translate-x-1"
                            />
                        </Link>
                    </div>

                    {brandsLoading ? (
                        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">

                            {[1, 2, 3, 4, 5, 6].map(
                                (item) => (
                                    <div
                                        key={item}
                                        className="h-[135px] animate-pulse rounded-2xl border border-[#F4A460]/20 bg-[#FDF8F5]"
                                    />
                                )
                            )}
                        </div>
                    ) : brands.length === 0 ? (
                        <div className="rounded-2xl border border-[#F4A460]/20 bg-[#FDF8F5] px-6 py-12 text-center">

                            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-[#B22222]/10">
                                <CarFront
                                    size={22}
                                    className="text-[#B22222]"
                                />
                            </div>

                            <p className="mt-4 text-sm font-medium text-[#8A7A6A]">
                                {t("home.noBrands")}
                            </p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">

                            {brands.map((brand) => (
                                <button
                                    key={brand.id}
                                    type="button"
                                    onClick={() =>
                                        handleBrandClick(brand)
                                    }
                                    disabled={brandLoading}
                                    className="group flex min-h-[135px] w-full flex-col items-center justify-center rounded-2xl border border-[#F4A460]/20 bg-white px-4 py-5 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-[#B22222]/40 hover:shadow-lg hover:shadow-[#B22222]/10 disabled:cursor-wait disabled:opacity-60"
                                >
                                    <div className="flex h-16 w-16 items-center justify-center rounded-xl bg-[#FDF8F5] p-2 transition-all duration-300 group-hover:bg-[#FFF4EC]">

                                        {brand.logo ? (
                                            <img
                                                src={brand.logo}
                                                alt={`${brand.name} logo`}
                                                className="h-12 w-12 object-contain transition-transform duration-300 group-hover:scale-105"
                                                loading="lazy"
                                            />
                                        ) : (
                                            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#B22222]/10 text-lg font-bold uppercase text-[#B22222]">
                                                {brand.name?.charAt(0)}
                                            </div>
                                        )}
                                    </div>

                                    <p className="mt-3 text-center text-sm font-bold text-[#2D1B0E] transition-colors duration-300 group-hover:text-[#B22222]">
                                        {brand.name}
                                    </p>
                                </button>
                            ))}
                        </div>
                    )}
                </div>
            </section>

            {/* =========================================================
                SELECTED BRAND VEHICLES
            ========================================================= */}

            {selectedBrand && (
                <section
                    id="selected-brand-vehicles"
                    className="mx-auto max-w-7xl px-5 py-16 md:px-8"
                >
                    <div className="mb-10 flex items-end justify-between gap-4">

                        <div>

                            <div className="flex items-center gap-3 text-sm font-bold uppercase tracking-[0.2em] text-[#B22222]">

                                <span className="h-px w-8 bg-[#B22222]" />

                                {selectedBrand.name}
                            </div>

                            <h2 className="mt-3 text-3xl font-bold text-[#2D1B0E]">

                                {t("home.available")}{" "}

                                <span className="text-[#B22222]">
                                    {selectedBrand.name}
                                </span>{" "}

                                {t("home.brandVehicles")}
                            </h2>
                        </div>

                        <button
                            type="button"
                            onClick={clearBrandFilter}
                            className="text-sm font-semibold text-[#B22222] hover:text-[#8B1A1A]"
                        >
                            {t("home.clear")}
                        </button>
                    </div>

                    {brandLoading ? (
                        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">

                            {[1, 2, 3].map((item) => (
                                <div
                                    key={item}
                                    className="h-[380px] animate-pulse rounded-2xl border border-[#F4A460]/20 bg-white"
                                />
                            ))}
                        </div>
                    ) : brandError ? (
                        <div className="rounded-3xl border border-[#F4A460]/20 bg-white px-6 py-20 text-center shadow-sm">

                            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-[#B22222]/10 text-[#B22222]">
                                <CarFront size={30} />
                            </div>

                            <h3 className="mt-6 text-2xl font-bold text-[#2D1B0E]">
                                {t("home.brandNotAvailableTitle")}
                            </h3>

                            <p className="mx-auto mt-3 max-w-md text-[#6A5A4A]">
                                {brandError}
                            </p>

                            <button
                                type="button"
                                onClick={clearBrandFilter}
                                className="mt-6 rounded-xl bg-gradient-to-r from-[#B22222] to-[#8B1A1A] px-6 py-3 font-bold text-white transition hover:scale-105"
                            >
                                {t("home.browseAllVehicles")}
                            </button>
                        </div>
                    ) : brandVehicles.length > 0 ? (
                        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">

                            {brandVehicles.map((vehicle) => (
                                <div
                                    key={vehicle.id}
                                    className="group overflow-hidden rounded-2xl border border-[#F4A460]/20 bg-white transition-all hover:-translate-y-2 hover:border-[#B22222] hover:shadow-xl hover:shadow-[#B22222]/15"
                                >
                                    <VehicleCard
                                        vehicle={vehicle}
                                    />
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="rounded-3xl border border-[#F4A460]/20 bg-white px-6 py-20 text-center shadow-sm">

                            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-[#B22222]/10 text-[#B22222]">
                                <CarFront size={30} />
                            </div>

                            <h3 className="mt-6 text-2xl font-bold text-[#2D1B0E]">
                                {t("home.noVehiclesAvailable")}
                            </h3>

                            <p className="mx-auto mt-3 max-w-md text-[#6A5A4A]">
                                {t("home.noBrandVehicles", {
                                    brand: selectedBrand.name,
                                })}
                            </p>
                        </div>
                    )}
                </section>
            )}

            {/* =========================================================
                WHY CHOOSE US
            ========================================================= */}

            <section className="border-y border-[#F4A460]/20 bg-white/80 py-20 backdrop-blur-sm lg:py-28">

                <div className="mx-auto max-w-7xl px-5 md:px-8">

                    <div className="mx-auto mb-16 max-w-3xl text-center">

                        <div className="flex items-center justify-center gap-3 text-sm font-bold uppercase tracking-[0.2em] text-[#B22222]">

                            <span className="h-px w-8 bg-[#B22222]" />

                            {t("home.whyChooseUs")}

                            <span className="h-px w-8 bg-[#B22222]" />
                        </div>

                        <h2 className="mt-4 text-3xl font-bold text-[#2D1B0E] md:text-4xl">

                            {t("home.trusted")}{" "}

                            <span className="text-[#B22222]">
                                {t("home.carMarketplace")}
                            </span>
                        </h2>

                        <p className="mt-4 text-[#6A5A4A]">
                            {t("home.trustedDescription")}
                        </p>
                    </div>

                    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">

                        <FeatureCardRed
                            icon={ShieldCheck}
                            title={t("home.features.verified.title")}
                            description={t(
                                "home.features.verified.description"
                            )}
                            color="red"
                        />

                        <FeatureCardRed
                            icon={TrendingUp}
                            title={t("home.features.prices.title")}
                            description={t(
                                "home.features.prices.description"
                            )}
                            color="gold"
                        />

                        <FeatureCardRed
                            icon={Users}
                            title={t("home.features.community.title")}
                            description={t(
                                "home.features.community.description"
                            )}
                            color="red"
                        />

                        <FeatureCardRed
                            icon={Clock}
                            title={t("home.features.process.title")}
                            description={t(
                                "home.features.process.description"
                            )}
                            color="gold"
                        />

                        <FeatureCardRed
                            icon={BadgeCheck}
                            title={t("home.features.guarantee.title")}
                            description={t(
                                "home.features.guarantee.description"
                            )}
                            color="red"
                        />

                        <FeatureCardRed
                            icon={Headphones}
                            title={t("home.features.support.title")}
                            description={t(
                                "home.features.support.description"
                            )}
                            color="gold"
                        />
                    </div>
                </div>
            </section>

            {/* =========================================================
                STATS
            ========================================================= */}

            <section className="py-20 lg:py-28">

                <div className="mx-auto max-w-7xl px-5 md:px-8">

                    <div className="grid grid-cols-2 gap-6 lg:grid-cols-4">

                        <StatCardRed
                            icon={Users}
                            value="5,000+"
                            label={t("home.stats.customers")}
                            color="red"
                        />

                        <StatCardRed
                            icon={CarFront}
                            value="200+"
                            label={t("home.stats.vehicles")}
                            color="gold"
                        />

                        <StatCardRed
                            icon={Star}
                            value="4.9/5"
                            label={t("home.stats.rating")}
                            color="red"
                        />

                        <StatCardRed
                            icon={Award}
                            value="100%"
                            label={t("home.stats.quality")}
                            color="gold"
                        />
                    </div>
                </div>
            </section>

            {/* =========================================================
                TESTIMONIALS
            ========================================================= */}

            <section className="border-y border-[#F4A460]/20 bg-white/80 py-20 backdrop-blur-sm lg:py-28">

                <div className="mx-auto max-w-7xl px-5 md:px-8">

                    <div className="mx-auto mb-16 max-w-3xl text-center">

                        <div className="flex items-center justify-center gap-3 text-sm font-bold uppercase tracking-[0.2em] text-[#B22222]">

                            <span className="h-px w-8 bg-[#B22222]" />

                            {t("home.testimonials")}

                            <span className="h-px w-8 bg-[#B22222]" />
                        </div>

                        <h2 className="mt-4 text-3xl font-bold text-[#2D1B0E] md:text-4xl">

                            {t("home.whatCustomers")}{" "}

                            <span className="text-[#B22222]">
                                {t("home.say")}
                            </span>
                        </h2>
                    </div>

                    <div className="grid gap-6 md:grid-cols-3">

                        <TestimonialCardRed
                            quote={t("home.testimonialsData.john.quote")}
                            author="John Mange."
                            role={t("home.testimonialsData.john.role")}
                            rating={5}
                        />


                        <TestimonialCardRed
                            quote={t("home.testimonialsData.michael.quote")}
                            author="Francis Bahati."
                            role={t("home.testimonialsData.michael.role")}
                            rating={5}
                        />
                    </div>
                </div>
            </section>

            {/* =========================================================
                CTA
            ========================================================= */}

            <section className="px-5 py-20 md:px-8 lg:py-28">

                <div className="relative mx-auto max-w-7xl overflow-hidden rounded-3xl border border-[#F4A460]/30 bg-gradient-to-br from-[#4A0E0E] via-[#6B1A1A] to-[#2D0A0A] px-8 py-16 shadow-2xl shadow-[#4A0E0E]/30 md:px-14">

                    <div className="absolute -right-20 -top-20 h-80 w-80 animate-pulse rounded-full bg-[#F4A460]/10 blur-3xl" />

                    <div className="absolute -bottom-20 left-1/3 h-80 w-80 animate-pulse rounded-full bg-[#B22222]/20 blur-3xl [animation-duration:4s]" />

                    <div className="relative flex flex-col items-start justify-between gap-8 md:flex-row md:items-center">

                        <div>

                            <div className="mb-2 flex items-center gap-2 text-sm font-semibold text-[#F4A460]">

                                <Sparkles
                                    size={16}
                                    className="animate-pulse"
                                />

                                {t("home.cta.ready")}
                            </div>

                            <h2 className="max-w-2xl text-3xl font-bold tracking-tight text-white md:text-4xl">

                                {t("home.cta.start")}{" "}

                                <span className="text-[#F4A460]">
                                    {t("home.cta.journey")}
                                </span>
                            </h2>

                            <p className="mt-2 max-w-xl text-white/60">
                                {t("home.cta.description")}
                            </p>
                        </div>

                        <Link
                            to="/vehicles"
                            className="group flex shrink-0 items-center gap-2 rounded-xl bg-gradient-to-r from-[#B22222] to-[#8B1A1A] px-8 py-4 font-bold text-white shadow-xl shadow-[#B22222]/30 transition-all hover:-translate-y-1 hover:shadow-2xl hover:shadow-[#B22222]/50"
                        >
                            {t("home.cta.explore")}

                            <ArrowRight
                                size={19}
                                className="transition group-hover:translate-x-1"
                            />
                        </Link>
                    </div>
                </div>
            </section>

            {/* =========================================================
                HELLOPETER WIDGET
            ========================================================= */}

            <section className="mx-auto max-w-7xl px-5 py-10 md:px-8">
                <div id="hp-widget-vertical_feed"></div>
            </section>

         
            {/* =========================================================
                HELLOPETER WIDGET SCRIPT
            ========================================================= */}

            <script
                dangerouslySetInnerHTML={{
                    __html: `
                        (function () {
                            var script = document.createElement("script");
                            script.type = "text/javascript";
                            script.async = true;
                            script.id = "hp-widget-code";

                            script.setAttribute(
                                "data-api",
                                "https://api-v6.hellopeter.com/api"
                            );

                            script.setAttribute(
                                "data-appUrl",
                                "https://business.hellopeter.com"
                            );

                            script.setAttribute(
                                "data-search",
                                "bingwamagari"
                            );

                            script.setAttribute(
                                "data-params",
                                JSON.stringify({
                                    "minReviewsRequired": {
                                        "ratings": [4, 5]
                                    },
                                    "widget_background_color": "original",
                                    "dimension": "940",
                                    "font_color": "#58595b",
                                    "logo_color": "logo_b2c.svg",
                                    "five_star_rating_color": "#00bf87",
                                    "average_star_rating_color": "#00bf87",
                                    "four_star_rating_color": "#30c8a7",
                                    "widget_header": "metrics",
                                    "display_industry_ranking": true,
                                    "isMobile": false,
                                    "previewBackground": "#ffffff",
                                    "is_logo_disable": true,
                                    "previewIframeHeight": "365px",
                                    "previewIframeWidth": "300px",
                                    "num_of_reviews": 10,
                                    "reviewers_name_as_anonymous": false,
                                    "google_metrix": true,
                                    "google_reviews": true,
                                    "facebook_metrix": false,
                                    "facebook_reviews": false,
                                    "showTagLine": false,
                                    "aboutLink": "https://intercom.help/hellopeter/en/articles/4410339-carousel-widget"
                                })
                            );

                            script.setAttribute(
                                "data-appFront",
                                "https://www.hellopeter.com"
                            );

                            script.src =
                                "https://business.hellopeter.com/static/js/carousel.js?v=KR03MvhWxk";

                            document.body.appendChild(script);
                        })();
                    `,
                }}
            />

            <style>
                {`
                    @keyframes float {
                        0%, 100% {
                            transform: translateY(0);
                        }

                        50% {
                            transform: translateY(-10px);
                        }
                    }

                    .animate-float {
                        animation: float 6s ease-in-out infinite;
                    }
                `}
            </style>
        </div>
    );
}

// ============================================================
// TRUST BAR
// ============================================================

function TrustBarRed({
    icon: Icon,
    label,
    sub,
}) {
    return (
        <div className="flex items-center justify-center gap-4 rounded-xl px-4 py-4 transition hover:bg-[#B22222]/5">

            <Icon
                size={24}
                className="text-[#B22222]"
            />

            <div>

                <p className="text-sm font-semibold text-[#2D1B0E]">
                    {label}
                </p>

                <p className="text-xs text-[#8A7A6A]">
                    {sub}
                </p>
            </div>
        </div>
    );
}

// ============================================================
// FEATURE CARD
// ============================================================

function FeatureCardRed({
    icon: Icon,
    title,
    description,
    color,
}) {
    const isRed = color === "red";

    const bgColor = isRed
        ? "bg-[#B22222]/10 border-[#B22222]/20 hover:border-[#B22222]"
        : "bg-[#F4A460]/10 border-[#F4A460]/20 hover:border-[#F4A460]";

    const iconColor = isRed
        ? "text-[#B22222]"
        : "text-[#D4833A]";

    const iconBg = isRed
        ? "bg-[#B22222]/20"
        : "bg-[#F4A460]/20";

    return (
        <div
            className={`${bgColor} border rounded-2xl p-6 backdrop-blur-sm transition-all hover:-translate-y-1 hover:shadow-xl`}
        >
            <div
                className={`mb-4 flex h-12 w-12 items-center justify-center rounded-xl ${iconBg}`}
            >
                <Icon
                    size={24}
                    className={iconColor}
                />
            </div>

            <h3 className="font-bold text-[#2D1B0E]">
                {title}
            </h3>

            <p className="mt-2 text-sm text-[#6A5A4A]">
                {description}
            </p>
        </div>
    );
}

// ============================================================
// STAT CARD
// ============================================================

function StatCardRed({
    icon: Icon,
    value,
    label,
    color,
}) {
    const isRed = color === "red";

    const bgColor = isRed
        ? "bg-[#B22222]/10 border-[#B22222]/20"
        : "bg-[#F4A460]/10 border-[#F4A460]/20";

    const iconColor = isRed
        ? "text-[#B22222]"
        : "text-[#D4833A]";

    const iconBg = isRed
        ? "bg-[#B22222]/20"
        : "bg-[#F4A460]/20";

    return (
        <div
            className={`${bgColor} border rounded-2xl p-6 text-center backdrop-blur-sm transition-all hover:-translate-y-1 hover:shadow-xl`}
        >
            <div
                className={`mx-auto flex h-12 w-12 items-center justify-center rounded-xl ${iconBg}`}
            >
                <Icon
                    size={24}
                    className={iconColor}
                />
            </div>

            <p className="mt-4 text-2xl font-bold text-[#2D1B0E]">
                {value}
            </p>

            <p className="text-sm text-[#6A5A4A]">
                {label}
            </p>
        </div>
    );
}

// ============================================================
// TESTIMONIAL CARD
// ============================================================

function TestimonialCardRed({
    quote,
    author,
    role,
    rating,
}) {
    return (
        <div className="rounded-2xl border border-[#F4A460]/20 bg-white p-6 transition-all hover:-translate-y-1 hover:border-[#B22222] hover:shadow-xl">

            <Quote
                size={32}
                className="mb-4 text-[#B22222]/30"
            />

            <p className="leading-relaxed text-[#4A3A2A]">
                "{quote}"
            </p>

            <div className="mt-4 flex items-center justify-between">

                <div>

                    <p className="font-semibold text-[#2D1B0E]">
                        {author}
                    </p>

                    <p className="text-sm text-[#8A7A6A]">
                        {role}
                    </p>
                </div>

                <div className="flex text-[#F4A460]">

                    {[...Array(rating)].map((_, i) => (
                        <Star
                            key={i}
                            size={16}
                            fill="currentColor"
                        />
                    ))}
                </div>
            </div>
        </div>
    );
}

export default Home;

