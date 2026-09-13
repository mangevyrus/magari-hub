
import {
    Search,
    SlidersHorizontal,
    X,
    ChevronDown,
    CarFront,
    RotateCcw,
    Sparkles,
    Filter,
} from "lucide-react";

import Navbar from "../../components/Navbar";
import VehicleCard from "../../components/VehicleCard";

import {
    getVehicles,
    getBrands,
    getCategories,
} from "../../services/vehicleService";

import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { useTranslation } from "react-i18next";

function Vehicles() {
    const { t } = useTranslation();

    const [searchParams] = useSearchParams();

    const brandFromUrl = searchParams.get("brand") || "";

    const [vehicles, setVehicles] = useState([]);
    const [brands, setBrands] = useState([]);
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showFilters, setShowFilters] = useState(false);

    const [filters, setFilters] = useState({
        search: "",
        brand: brandFromUrl,
        category: "",
        fuel_type: "",
        transmission: "",
        condition: "",
        min_price: "",
        max_price: "",
        sort: "newest",
    });

    /*
    |--------------------------------------------------------------------------
    | LOAD VEHICLES
    |--------------------------------------------------------------------------
    */

    const loadVehicles = async () => {
        try {
            setLoading(true);

            const params = new URLSearchParams();

            Object.entries(filters).forEach(([key, value]) => {
                if (value) {
                    params.append(key, value);
                }
            });

            const query = params.toString();

            const data = await getVehicles(query ? `?${query}` : "");

            setVehicles(data);
        } catch (error) {
            console.error("Failed to load vehicles:", error);
            setVehicles([]);
        } finally {
            setLoading(false);
        }
    };

    /*
    |--------------------------------------------------------------------------
    | LOAD BRANDS & CATEGORIES
    |--------------------------------------------------------------------------
    */

    useEffect(() => {
        const loadFilters = async () => {
            try {
                const [brandsData, categoriesData] = await Promise.all([
                    getBrands(),
                    getCategories(),
                ]);

                setBrands(brandsData);
                setCategories(categoriesData);
            } catch (error) {
                console.error("Failed to load filters:", error);
            }
        };

        loadFilters();
    }, []);

    /*
    |--------------------------------------------------------------------------
    | LOAD VEHICLES WHEN FILTERS CHANGE
    |--------------------------------------------------------------------------
    */

    useEffect(() => {
        const timer = setTimeout(() => {
            loadVehicles();
        }, 350);

        return () => {
            clearTimeout(timer);
        };
    }, [filters]);

    /*
    |--------------------------------------------------------------------------
    | UPDATE FILTER
    |--------------------------------------------------------------------------
    */

    const updateFilter = (name, value) => {
        setFilters((previous) => ({
            ...previous,
            [name]: value,
        }));
    };

    /*
    |--------------------------------------------------------------------------
    | CLEAR FILTERS
    |--------------------------------------------------------------------------
    */

    const clearFilters = () => {
        setFilters({
            search: "",
            brand: "",
            category: "",
            fuel_type: "",
            transmission: "",
            condition: "",
            min_price: "",
            max_price: "",
            sort: "newest",
        });

        setShowFilters(false);
    };

    /*
    |--------------------------------------------------------------------------
    | ACTIVE FILTER COUNT
    |--------------------------------------------------------------------------
    */

    const activeFilterCount = Object.entries(filters).filter(
        ([key, value]) => key !== "sort" && value
    ).length;

    /*
    |--------------------------------------------------------------------------
    | TRANSLATED FILTER VALUES
    |--------------------------------------------------------------------------
    */

    const getFuelLabel = (fuel) => {
        const labels = {
            petrol: t("vehicles.filters.fuelOptions.petrol"),
            diesel: t("vehicles.filters.fuelOptions.diesel"),
            hybrid: t("vehicles.filters.fuelOptions.hybrid"),
            electric: t("vehicles.filters.fuelOptions.electric"),
        };

        return labels[fuel] || fuel;
    };

    const getTransmissionLabel = (transmission) => {
        const labels = {
            automatic: t("vehicles.filters.transmissionOptions.automatic"),
            manual: t("vehicles.filters.transmissionOptions.manual"),
        };

        return labels[transmission] || transmission;
    };

    const getConditionLabel = (condition) => {
        const labels = {
            new: t("vehicles.filters.conditionOptions.new"),
            used: t("vehicles.filters.conditionOptions.used"),
        };

        return labels[condition] || condition;
    };

    return (
        <div className="min-h-screen bg-[#FDF8F5]">
            <Navbar />

            {/* =========================================================
                HERO
            ========================================================== */}

            <section className="relative overflow-hidden border-b border-[#F4A460]/20 bg-gradient-to-r from-[#FDF8F5] via-[#FEF0E8] to-[#FDF8F5]">
                {/* DECORATION */}

                <div className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-[#B22222]/5 blur-3xl" />

                <div className="pointer-events-none absolute -bottom-32 left-1/4 h-72 w-72 rounded-full bg-[#F4A460]/10 blur-3xl" />

                <div className="relative mx-auto max-w-7xl px-5 py-14 md:px-8 md:py-20">
                    <div className="max-w-3xl">
                        <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-[#F4A460]/30 bg-white/80 px-4 py-2 text-sm font-bold text-[#B22222]">
                            <Sparkles size={16} />

                            {t("vehicles.hero.badge")}
                        </div>

                        <h1 className="text-4xl font-black tracking-tight text-[#2D1B0E] md:text-6xl">
                            {t("vehicles.hero.title")}{" "}
                            <span className="text-[#B22222]">
                                {t("vehicles.hero.titleHighlight")}
                            </span>
                        </h1>

                        <p className="mt-5 max-w-2xl text-base leading-7 text-[#6A5A4A] md:text-lg">
                            {t("vehicles.hero.description")}
                        </p>

                        {/* SEARCH BAR */}

                        <div className="mt-8 max-w-3xl">
                            <div className="flex items-center rounded-2xl border border-[#F4A460]/20 bg-white p-2 shadow-[0_15px_40px_rgba(74,14,14,0.08)]">
                                <Search
                                    size={22}
                                    className="ml-3 shrink-0 text-[#B22222]"
                                />

                                <input
                                    value={filters.search}
                                    onChange={(e) =>
                                        updateFilter(
                                            "search",
                                            e.target.value
                                        )
                                    }
                                    placeholder={t(
                                        "vehicles.hero.searchPlaceholder"
                                    )}
                                    className="w-full bg-transparent px-4 py-3 text-sm text-[#2D1B0E] outline-none placeholder:text-[#8A7A6A] md:text-base"
                                />

                                {filters.search && (
                                    <button
                                        type="button"
                                        onClick={() =>
                                            updateFilter("search", "")
                                        }
                                        className="mr-2 rounded-lg p-2 text-[#8A7A6A] transition hover:bg-[#B22222]/5 hover:text-[#B22222]"
                                        aria-label={t("common.clear")}
                                    >
                                        <X size={18} />
                                    </button>
                                )}

                                <button
                                    type="button"
                                    className="hidden rounded-xl bg-gradient-to-r from-[#B22222] to-[#8B1A1A] px-7 py-3.5 font-bold text-white shadow-lg shadow-[#B22222]/20 transition hover:scale-[1.02] hover:shadow-xl hover:shadow-[#B22222]/40 sm:block"
                                >
                                    {t("common.search")}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* =========================================================
                MAIN
            ========================================================== */}

            <main className="mx-auto max-w-7xl px-5 py-10 md:px-8">
                {/* =========================================================
                    FILTERS - TOP BAR
                ========================================================== */}

                <div className="mb-6">
                    {/* FILTER TOGGLE BAR */}

                    <div className="flex flex-wrap items-center justify-between gap-4">
                        <div className="flex items-center gap-3">
                            <button
                                onClick={() =>
                                    setShowFilters(!showFilters)
                                }
                                className="flex items-center gap-2 rounded-xl border border-[#F4A460]/20 bg-white px-4 py-3 font-bold text-[#2D1B0E] shadow-sm transition hover:bg-[#FDF8F5]"
                            >
                                <Filter
                                    size={18}
                                    className="text-[#B22222]"
                                />

                                {t("vehicles.filters.button")}

                                {activeFilterCount > 0 && (
                                    <span className="flex h-6 min-w-6 items-center justify-center rounded-full bg-[#B22222] px-1.5 text-xs text-white">
                                        {activeFilterCount}
                                    </span>
                                )}
                            </button>

                            {activeFilterCount > 0 && (
                                <button
                                    onClick={clearFilters}
                                    className="text-sm font-medium text-[#B22222] hover:text-[#6B1515]"
                                >
                                    {t("common.clearAll")}
                                </button>
                            )}
                        </div>

                        <div className="flex items-center gap-3">
                            <p className="text-sm text-[#6A5A4A]">
                                <span className="font-bold text-[#2D1B0E]">
                                    {vehicles.length}
                                </span>{" "}
                                {t("vehicles.results.vehicleCount")}
                            </p>

                            {/* SORT */}

                            <div className="relative">
                                <select
                                    value={filters.sort}
                                    onChange={(e) =>
                                        updateFilter(
                                            "sort",
                                            e.target.value
                                        )
                                    }
                                    className="appearance-none rounded-xl border border-[#F4A460]/20 bg-white py-2.5 pl-4 pr-9 text-sm font-semibold text-[#2D1B0E] shadow-sm outline-none transition focus:border-[#B22222]"
                                >
                                    <option value="newest">
                                        {t(
                                            "vehicles.filters.sortOptions.newest"
                                        )}
                                    </option>

                                    <option value="price_low">
                                        {t(
                                            "vehicles.filters.sortOptions.priceLow"
                                        )}
                                    </option>

                                    <option value="price_high">
                                        {t(
                                            "vehicles.filters.sortOptions.priceHigh"
                                        )}
                                    </option>

                                    <option value="oldest">
                                        {t(
                                            "vehicles.filters.sortOptions.oldest"
                                        )}
                                    </option>
                                </select>

                                <ChevronDown
                                    size={16}
                                    className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-[#8A7A6A]"
                                />
                            </div>
                        </div>
                    </div>

                    {/* EXPANDED FILTERS */}

                    {showFilters && (
                        <div className="mt-4 rounded-2xl border border-[#F4A460]/20 bg-white p-5 shadow-sm">
                            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                                {/* BRAND */}

                                <div>
                                    <label className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-[#8A7A6A]">
                                        {t("vehicles.filters.brand")}
                                    </label>

                                    <select
                                        value={filters.brand}
                                        onChange={(e) =>
                                            updateFilter(
                                                "brand",
                                                e.target.value
                                            )
                                        }
                                        className="w-full rounded-xl border border-[#F4A460]/20 bg-[#FDF8F5] px-3 py-2.5 text-sm text-[#2D1B0E] outline-none transition focus:border-[#B22222] focus:ring-2 focus:ring-[#B22222]/10"
                                    >
                                        <option value="">
                                            {t(
                                                "vehicles.filters.allBrands"
                                            )}
                                        </option>

                                        {brands.map((brand) => (
                                            <option
                                                key={brand.id}
                                                value={brand.id}
                                            >
                                                {brand.name}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                {/* CATEGORY */}

                                <div>
                                    <label className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-[#8A7A6A]">
                                        {t("vehicles.filters.category")}
                                    </label>

                                    <select
                                        value={filters.category}
                                        onChange={(e) =>
                                            updateFilter(
                                                "category",
                                                e.target.value
                                            )
                                        }
                                        className="w-full rounded-xl border border-[#F4A460]/20 bg-[#FDF8F5] px-3 py-2.5 text-sm text-[#2D1B0E] outline-none transition focus:border-[#B22222] focus:ring-2 focus:ring-[#B22222]/10"
                                    >
                                        <option value="">
                                            {t(
                                                "vehicles.filters.allCategories"
                                            )}
                                        </option>

                                        {categories.map((category) => (
                                            <option
                                                key={category.id}
                                                value={category.id}
                                            >
                                                {category.name}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                {/* FUEL TYPE */}

                                <div>
                                    <label className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-[#8A7A6A]">
                                        {t("vehicles.filters.fuelType")}
                                    </label>

                                    <select
                                        value={filters.fuel_type}
                                        onChange={(e) =>
                                            updateFilter(
                                                "fuel_type",
                                                e.target.value
                                            )
                                        }
                                        className="w-full rounded-xl border border-[#F4A460]/20 bg-[#FDF8F5] px-3 py-2.5 text-sm text-[#2D1B0E] outline-none transition focus:border-[#B22222] focus:ring-2 focus:ring-[#B22222]/10"
                                    >
                                        <option value="">
                                            {t(
                                                "vehicles.filters.allFuels"
                                            )}
                                        </option>

                                        <option value="petrol">
                                            {t(
                                                "vehicles.filters.fuelOptions.petrol"
                                            )}
                                        </option>

                                        <option value="diesel">
                                            {t(
                                                "vehicles.filters.fuelOptions.diesel"
                                            )}
                                        </option>

                                        <option value="hybrid">
                                            {t(
                                                "vehicles.filters.fuelOptions.hybrid"
                                            )}
                                        </option>

                                        <option value="electric">
                                            {t(
                                                "vehicles.filters.fuelOptions.electric"
                                            )}
                                        </option>
                                    </select>
                                </div>

                                {/* TRANSMISSION */}

                                <div>
                                    <label className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-[#8A7A6A]">
                                        {t(
                                            "vehicles.filters.transmission"
                                        )}
                                    </label>

                                    <select
                                        value={filters.transmission}
                                        onChange={(e) =>
                                            updateFilter(
                                                "transmission",
                                                e.target.value
                                            )
                                        }
                                        className="w-full rounded-xl border border-[#F4A460]/20 bg-[#FDF8F5] px-3 py-2.5 text-sm text-[#2D1B0E] outline-none transition focus:border-[#B22222] focus:ring-2 focus:ring-[#B22222]/10"
                                    >
                                        <option value="">
                                            {t(
                                                "vehicles.filters.all"
                                            )}
                                        </option>

                                        <option value="automatic">
                                            {t(
                                                "vehicles.filters.transmissionOptions.automatic"
                                            )}
                                        </option>

                                        <option value="manual">
                                            {t(
                                                "vehicles.filters.transmissionOptions.manual"
                                            )}
                                        </option>
                                    </select>
                                </div>

                                {/* CONDITION */}

                                <div>
                                    <label className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-[#8A7A6A]">
                                        {t(
                                            "vehicles.filters.condition"
                                        )}
                                    </label>

                                    <select
                                        value={filters.condition}
                                        onChange={(e) =>
                                            updateFilter(
                                                "condition",
                                                e.target.value
                                            )
                                        }
                                        className="w-full rounded-xl border border-[#F4A460]/20 bg-[#FDF8F5] px-3 py-2.5 text-sm text-[#2D1B0E] outline-none transition focus:border-[#B22222] focus:ring-2 focus:ring-[#B22222]/10"
                                    >
                                        <option value="">
                                            {t(
                                                "vehicles.filters.all"
                                            )}
                                        </option>

                                        <option value="new">
                                            {t(
                                                "vehicles.filters.conditionOptions.new"
                                            )}
                                        </option>

                                        <option value="used">
                                            {t(
                                                "vehicles.filters.conditionOptions.used"
                                            )}
                                        </option>
                                    </select>
                                </div>

                                {/* MIN PRICE */}

                                <div>
                                    <label className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-[#8A7A6A]">
                                        {t(
                                            "vehicles.filters.minPrice"
                                        )}
                                    </label>

                                    <input
                                        type="number"
                                        min="0"
                                        placeholder={t(
                                            "vehicles.filters.minPricePlaceholder"
                                        )}
                                        value={filters.min_price}
                                        onChange={(e) =>
                                            updateFilter(
                                                "min_price",
                                                e.target.value
                                            )
                                        }
                                        className="w-full rounded-xl border border-[#F4A460]/20 bg-[#FDF8F5] px-3 py-2.5 text-sm outline-none transition focus:border-[#B22222] focus:ring-2 focus:ring-[#B22222]/10"
                                    />
                                </div>

                                {/* MAX PRICE */}

                                <div>
                                    <label className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-[#8A7A6A]">
                                        {t(
                                            "vehicles.filters.maxPrice"
                                        )}
                                    </label>

                                    <input
                                        type="number"
                                        min="0"
                                        placeholder={t(
                                            "vehicles.filters.maxPricePlaceholder"
                                        )}
                                        value={filters.max_price}
                                        onChange={(e) =>
                                            updateFilter(
                                                "max_price",
                                                e.target.value
                                            )
                                        }
                                        className="w-full rounded-xl border border-[#F4A460]/20 bg-[#FDF8F5] px-3 py-2.5 text-sm outline-none transition focus:border-[#B22222] focus:ring-2 focus:ring-[#B22222]/10"
                                    />
                                </div>
                            </div>

                            {/* FILTER ACTION BUTTONS */}

                            <div className="mt-5 flex flex-wrap gap-3 border-t border-[#F4A460]/10 pt-5">
                                <button
                                    onClick={() =>
                                        setShowFilters(false)
                                    }
                                    className="rounded-xl bg-[#B22222] px-6 py-2.5 text-sm font-bold text-white transition hover:bg-[#8B1A1A]"
                                >
                                    {t(
                                        "vehicles.filters.apply"
                                    )}
                                </button>

                                <button
                                    onClick={clearFilters}
                                    className="rounded-xl border border-[#F4A460]/20 px-6 py-2.5 text-sm font-bold text-[#6A5A4A] transition hover:bg-[#FDF8F5]"
                                >
                                    {t(
                                        "vehicles.filters.reset"
                                    )}
                                </button>
                            </div>
                        </div>
                    )}

                    {/* ACTIVE FILTER TAGS */}

                    {activeFilterCount > 0 && (
                        <div className="mt-3 flex flex-wrap items-center gap-2">
                            {filters.brand &&
                                brands.find(
                                    (b) =>
                                        b.id ===
                                        parseInt(filters.brand)
                                ) && (
                                    <span className="inline-flex items-center gap-1 rounded-full bg-[#B22222]/10 px-3 py-1.5 text-xs font-semibold text-[#B22222]">
                                        {t("vehicles.activeFilters.brand")}:{" "}
                                        {
                                            brands.find(
                                                (b) =>
                                                    b.id ===
                                                    parseInt(
                                                        filters.brand
                                                    )
                                            )?.name
                                        }

                                        <button
                                            onClick={() =>
                                                updateFilter(
                                                    "brand",
                                                    ""
                                                )
                                            }
                                            className="ml-1 hover:text-[#6B1515]"
                                            aria-label={t(
                                                "common.remove"
                                            )}
                                        >
                                            <X size={12} />
                                        </button>
                                    </span>
                                )}

                            {filters.category &&
                                categories.find(
                                    (c) =>
                                        c.id ===
                                        parseInt(filters.category)
                                ) && (
                                    <span className="inline-flex items-center gap-1 rounded-full bg-[#B22222]/10 px-3 py-1.5 text-xs font-semibold text-[#B22222]">
                                        {t(
                                            "vehicles.activeFilters.category"
                                        )}
                                        :{" "}
                                        {
                                            categories.find(
                                                (c) =>
                                                    c.id ===
                                                    parseInt(
                                                        filters.category
                                                    )
                                            )?.name
                                        }

                                        <button
                                            onClick={() =>
                                                updateFilter(
                                                    "category",
                                                    ""
                                                )
                                            }
                                            className="ml-1 hover:text-[#6B1515]"
                                            aria-label={t(
                                                "common.remove"
                                            )}
                                        >
                                            <X size={12} />
                                        </button>
                                    </span>
                                )}

                            {filters.fuel_type && (
                                <span className="inline-flex items-center gap-1 rounded-full bg-[#B22222]/10 px-3 py-1.5 text-xs font-semibold text-[#B22222]">
                                    {t(
                                        "vehicles.activeFilters.fuel"
                                    )}
                                    :{" "}
                                    {getFuelLabel(filters.fuel_type)}

                                    <button
                                        onClick={() =>
                                            updateFilter(
                                                "fuel_type",
                                                ""
                                            )
                                        }
                                        className="ml-1 hover:text-[#6B1515]"
                                        aria-label={t(
                                            "common.remove"
                                        )}
                                    >
                                        <X size={12} />
                                    </button>
                                </span>
                            )}

                            {filters.condition && (
                                <span className="inline-flex items-center gap-1 rounded-full bg-[#B22222]/10 px-3 py-1.5 text-xs font-semibold text-[#B22222]">
                                    {t(
                                        "vehicles.activeFilters.condition"
                                    )}
                                    :{" "}
                                    {getConditionLabel(
                                        filters.condition
                                    )}

                                    <button
                                        onClick={() =>
                                            updateFilter(
                                                "condition",
                                                ""
                                            )
                                        }
                                        className="ml-1 hover:text-[#6B1515]"
                                        aria-label={t(
                                            "common.remove"
                                        )}
                                    >
                                        <X size={12} />
                                    </button>
                                </span>
                            )}

                            {filters.min_price && (
                                <span className="inline-flex items-center gap-1 rounded-full bg-[#B22222]/10 px-3 py-1.5 text-xs font-semibold text-[#B22222]">
                                    {t(
                                        "vehicles.activeFilters.min"
                                    )}
                                    : TZS{" "}
                                    {Number(
                                        filters.min_price
                                    ).toLocaleString("en-TZ")}

                                    <button
                                        onClick={() =>
                                            updateFilter(
                                                "min_price",
                                                ""
                                            )
                                        }
                                        className="ml-1 hover:text-[#6B1515]"
                                        aria-label={t(
                                            "common.remove"
                                        )}
                                    >
                                        <X size={12} />
                                    </button>
                                </span>
                            )}

                            {filters.max_price && (
                                <span className="inline-flex items-center gap-1 rounded-full bg-[#B22222]/10 px-3 py-1.5 text-xs font-semibold text-[#B22222]">
                                    {t(
                                        "vehicles.activeFilters.max"
                                    )}
                                    : TZS{" "}
                                    {Number(
                                        filters.max_price
                                    ).toLocaleString("en-TZ")}

                                    <button
                                        onClick={() =>
                                            updateFilter(
                                                "max_price",
                                                ""
                                            )
                                        }
                                        className="ml-1 hover:text-[#6B1515]"
                                        aria-label={t(
                                            "common.remove"
                                        )}
                                    >
                                        <X size={12} />
                                    </button>
                                </span>
                            )}

                            {filters.transmission && (
                                <span className="inline-flex items-center gap-1 rounded-full bg-[#B22222]/10 px-3 py-1.5 text-xs font-semibold text-[#B22222]">
                                    {t(
                                        "vehicles.activeFilters.transmission"
                                    )}
                                    :{" "}
                                    {getTransmissionLabel(
                                        filters.transmission
                                    )}

                                    <button
                                        onClick={() =>
                                            updateFilter(
                                                "transmission",
                                                ""
                                            )
                                        }
                                        className="ml-1 hover:text-[#6B1515]"
                                        aria-label={t(
                                            "common.remove"
                                        )}
                                    >
                                        <X size={12} />
                                    </button>
                                </span>
                            )}

                            {activeFilterCount > 1 && (
                                <button
                                    onClick={clearFilters}
                                    className="text-xs font-semibold text-[#B22222] hover:text-[#6B1515]"
                                >
                                    {t("common.clearAll")}
                                </button>
                            )}
                        </div>
                    )}
                </div>

                {/* =================================================
                    VEHICLE GRID
                ================================================== */}

                {loading ? (
                    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                        {[1, 2, 3, 4, 5, 6].map((item) => (
                            <VehicleSkeletonRed key={item} />
                        ))}
                    </div>
                ) : vehicles.length === 0 ? (
                    <div className="rounded-3xl border border-[#F4A460]/20 bg-white px-6 py-20 text-center shadow-sm">
                        <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-2xl border border-[#F4A460]/20 bg-[#FDF8F5] text-[#B22222]">
                            <CarFront size={38} />
                        </div>

                        <h3 className="mt-6 text-2xl font-extrabold text-[#2D1B0E]">
                            {t("vehicles.empty.title")}
                        </h3>

                        <p className="mx-auto mt-2 max-w-md text-[#6A5A4A]">
                            {t("vehicles.empty.description")}
                        </p>

                        <button
                            type="button"
                            onClick={clearFilters}
                            className="mt-6 inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-[#B22222] to-[#8B1A1A] px-6 py-3 font-bold text-white shadow-lg shadow-[#B22222]/20 transition hover:shadow-xl hover:shadow-[#B22222]/40"
                        >
                            <RotateCcw size={17} />

                            {t("vehicles.empty.reset")}
                        </button>
                    </div>
                ) : (
                    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                        {vehicles.map((vehicle) => (
                            <VehicleCard
                                key={vehicle.id}
                                vehicle={vehicle}
                            />
                        ))}
                    </div>
                )}
            </main>
        </div>
    );
}

/*
|--------------------------------------------------------------------------
| VEHICLE LOADING SKELETON
|--------------------------------------------------------------------------
*/

function VehicleSkeletonRed() {
    return (
        <div className="overflow-hidden rounded-2xl border border-[#F4A460]/20 bg-white shadow-sm">
            <div className="h-60 animate-pulse bg-[#FDF8F5]" />

            <div className="space-y-4 p-5">
                <div className="flex justify-between">
                    <div className="space-y-2">
                        <div className="h-3 w-20 animate-pulse rounded bg-[#FDF8F5]" />
                        <div className="h-6 w-32 animate-pulse rounded bg-[#FDF8F5]" />
                    </div>

                    <div className="h-5 w-24 animate-pulse rounded bg-[#FDF8F5]" />
                </div>

                <div className="h-20 animate-pulse rounded-xl border border-[#F4A460]/10 bg-[#FDF8F5]" />

                <div className="h-4 w-32 animate-pulse rounded bg-[#FDF8F5]" />

                <div className="h-12 animate-pulse rounded-xl bg-[#FDF8F5]" />
            </div>
        </div>
    );
}

export default Vehicles;

