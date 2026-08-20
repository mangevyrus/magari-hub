import { useEffect, useState } from "react";

import {
    Search,
    SlidersHorizontal,
    X,
    ChevronDown,
    CarFront,
    RotateCcw,
    Sparkles,
} from "lucide-react";

import Navbar from "../../components/Navbar";
import VehicleCard from "../../components/VehicleCard";

import {
    getVehicles,
    getBrands,
    getCategories,
} from "../../services/vehicleService";


function Vehicles() {

    const [vehicles, setVehicles] = useState([]);

    const [brands, setBrands] = useState([]);

    const [categories, setCategories] = useState([]);

    const [loading, setLoading] = useState(true);

    const [mobileFilters, setMobileFilters] = useState(false);


    const [filters, setFilters] = useState({

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


    /*
    |--------------------------------------------------------------------------
    | LOAD VEHICLES
    |--------------------------------------------------------------------------
    */

    const loadVehicles = async () => {

        try {

            setLoading(true);

            const params = new URLSearchParams();


            Object.entries(filters).forEach(
                ([key, value]) => {

                    if (value) {

                        params.append(
                            key,
                            value
                        );

                    }

                }
            );


            const query = params.toString();


            const data = await getVehicles(
                query
                    ? `?${query}`
                    : ""
            );


            setVehicles(data);


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


    /*
    |--------------------------------------------------------------------------
    | LOAD BRANDS & CATEGORIES
    |--------------------------------------------------------------------------
    */

    useEffect(() => {

        const loadFilters = async () => {

            try {

                const [
                    brandsData,
                    categoriesData,
                ] = await Promise.all([

                    getBrands(),

                    getCategories(),

                ]);


                setBrands(
                    brandsData
                );

                setCategories(
                    categoriesData
                );


            } catch (error) {

                console.error(
                    "Failed to load filters:",
                    error
                );

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

    const updateFilter = (
        name,
        value
    ) => {

        setFilters(
            (previous) => ({

                ...previous,

                [name]: value,

            })
        );

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

    };


    /*
    |--------------------------------------------------------------------------
    | ACTIVE FILTER COUNT
    |--------------------------------------------------------------------------
    */

    const activeFilterCount = Object.entries(
        filters
    ).filter(
        ([key, value]) =>
            key !== "sort" && value
    ).length;


    return (

        <div className="min-h-screen bg-[#F5F9FC]">


            <Navbar />


            {/* =========================================================
                HERO
            ========================================================== */}

            <section className="relative overflow-hidden border-b border-blue-100 bg-[#EAF6FF]">


                {/* DECORATION */}

                <div className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-white/50 blur-3xl" />

                <div className="pointer-events-none absolute -bottom-32 left-1/4 h-72 w-72 rounded-full bg-[#BFE5FF]/50 blur-3xl" />


                <div className="relative mx-auto max-w-7xl px-5 py-14 md:px-8 md:py-20">


                    <div className="max-w-3xl">


                        <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-blue-200 bg-white/80 px-4 py-2 text-sm font-bold text-[#2F80C0]">

                            <Sparkles size={16} />

                            Premium Vehicle Marketplace

                        </div>


                        <h1 className="text-4xl font-black tracking-tight text-[#12395B] md:text-6xl">

                            Find your

                            <span className="text-[#2F80C0]">
                                {" "}perfect vehicle.
                            </span>

                        </h1>


                        <p className="mt-5 max-w-2xl text-base leading-7 text-slate-500 md:text-lg">

                            Explore quality vehicles from trusted
                            sellers. Search, compare and discover
                            your next vehicle with confidence.

                        </p>


                        {/* SEARCH BAR */}

                        <div className="mt-8 max-w-3xl">

                            <div className="flex items-center rounded-2xl border border-blue-100 bg-white p-2 shadow-[0_15px_40px_rgba(18,57,91,0.08)]">


                                <Search
                                    size={22}
                                    className="ml-3 shrink-0 text-[#2F80C0]"
                                />


                                <input
                                    value={filters.search}
                                    onChange={(e) =>
                                        updateFilter(
                                            "search",
                                            e.target.value
                                        )
                                    }
                                    placeholder="Search Toyota, BMW, Land Cruiser..."
                                    className="w-full bg-transparent px-4 py-3 text-sm text-[#12395B] outline-none placeholder:text-slate-400 md:text-base"
                                />


                                {filters.search && (

                                    <button
                                        type="button"
                                        onClick={() =>
                                            updateFilter(
                                                "search",
                                                ""
                                            )
                                        }
                                        className="mr-2 rounded-lg p-2 text-slate-400 transition hover:bg-blue-50 hover:text-[#2F80C0]"
                                    >

                                        <X size={18} />

                                    </button>

                                )}


                                <button
                                    type="button"
                                    className="hidden rounded-xl bg-[#12395B] px-7 py-3.5 font-bold text-white transition hover:bg-[#2F80C0] sm:block"
                                >
                                    Search
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


                {/* MOBILE FILTER BUTTON */}

                <div className="mb-6 flex items-center justify-between lg:hidden">


                    <button
                        type="button"
                        onClick={() =>
                            setMobileFilters(true)
                        }
                        className="flex items-center gap-2 rounded-xl border border-blue-100 bg-white px-4 py-3 font-bold text-[#12395B] shadow-sm"
                    >

                        <SlidersHorizontal
                            size={18}
                        />

                        Filters

                        {activeFilterCount > 0 && (

                            <span className="flex h-6 min-w-6 items-center justify-center rounded-full bg-[#2F80C0] px-1.5 text-xs text-white">

                                {activeFilterCount}

                            </span>

                        )}

                    </button>


                    <p className="text-sm text-slate-500">

                        <span className="font-bold text-[#12395B]">
                            {vehicles.length}
                        </span>{" "}

                        vehicles

                    </p>

                </div>


                <div className="grid gap-8 lg:grid-cols-[270px_1fr]">


                    {/* =================================================
                        FILTER SIDEBAR
                    ================================================== */}

                    <>


                        {/* MOBILE BACKDROP */}

                        {mobileFilters && (

                            <div
                                onClick={() =>
                                    setMobileFilters(false)
                                }
                                className="fixed inset-0 z-50 bg-[#12395B]/40 backdrop-blur-sm lg:hidden"
                            />

                        )}


                        <aside
                            className={`
                                fixed inset-y-0 left-0 z-[60]
                                w-[310px] overflow-y-auto
                                bg-white p-6 shadow-2xl
                                transition-transform duration-300

                                lg:static
                                lg:block
                                lg:w-auto
                                lg:translate-x-0
                                lg:rounded-2xl
                                lg:border
                                lg:border-blue-100
                                lg:shadow-sm

                                ${
                                    mobileFilters
                                        ? "translate-x-0"
                                        : "-translate-x-full"
                                }
                            `}
                        >


                            {/* FILTER HEADER */}

                            <div className="flex items-center justify-between">


                                <div>

                                    <p className="text-xs font-bold uppercase tracking-wider text-[#2F80C0]">
                                        Refine
                                    </p>

                                    <h2 className="mt-1 text-xl font-extrabold text-[#12395B]">
                                        Filters
                                    </h2>

                                </div>


                                <button
                                    type="button"
                                    onClick={() =>
                                        setMobileFilters(false)
                                    }
                                    className="rounded-lg p-2 text-slate-500 hover:bg-blue-50 hover:text-[#12395B] lg:hidden"
                                >

                                    <X size={20} />

                                </button>

                            </div>


                            {/* ACTIVE FILTERS */}

                            {activeFilterCount > 0 && (

                                <div className="mt-4 flex items-center justify-between rounded-xl bg-[#EAF6FF] px-3 py-2.5">

                                    <span className="text-xs font-semibold text-[#2F80C0]">

                                        {activeFilterCount} active filter
                                        {activeFilterCount > 1
                                            ? "s"
                                            : ""
                                        }

                                    </span>


                                    <button
                                        type="button"
                                        onClick={clearFilters}
                                        className="text-xs font-bold text-[#12395B] hover:text-[#2F80C0]"
                                    >

                                        Clear

                                    </button>

                                </div>

                            )}


                            <div className="mt-6 space-y-6">


                                {/* BRAND */}

                                <FilterSelect
                                    label="Brand"
                                    value={filters.brand}
                                    onChange={(value) =>
                                        updateFilter(
                                            "brand",
                                            value
                                        )
                                    }
                                    options={brands.map(
                                        (brand) => ({

                                            value: brand.id,

                                            label: brand.name,

                                        })
                                    )}
                                />


                                {/* CATEGORY */}

                                <FilterSelect
                                    label="Category"
                                    value={filters.category}
                                    onChange={(value) =>
                                        updateFilter(
                                            "category",
                                            value
                                        )
                                    }
                                    options={categories.map(
                                        (category) => ({

                                            value:
                                                category.id,

                                            label:
                                                category.name,

                                        })
                                    )}
                                />


                                {/* FUEL */}

                                <FilterSelect
                                    label="Fuel Type"
                                    value={
                                        filters.fuel_type
                                    }
                                    onChange={(value) =>
                                        updateFilter(
                                            "fuel_type",
                                            value
                                        )
                                    }
                                    options={[

                                        {
                                            value: "petrol",
                                            label: "Petrol",
                                        },

                                        {
                                            value: "diesel",
                                            label: "Diesel",
                                        },

                                        {
                                            value: "hybrid",
                                            label: "Hybrid",
                                        },

                                        {
                                            value: "electric",
                                            label: "Electric",
                                        },

                                    ]}
                                />


                                {/* TRANSMISSION */}

                                <FilterSelect
                                    label="Transmission"
                                    value={
                                        filters.transmission
                                    }
                                    onChange={(value) =>
                                        updateFilter(
                                            "transmission",
                                            value
                                        )
                                    }
                                    options={[

                                        {
                                            value: "automatic",
                                            label: "Automatic",
                                        },

                                        {
                                            value: "manual",
                                            label: "Manual",
                                        },

                                    ]}
                                />


                                {/* CONDITION */}

                                <FilterSelect
                                    label="Condition"
                                    value={
                                        filters.condition
                                    }
                                    onChange={(value) =>
                                        updateFilter(
                                            "condition",
                                            value
                                        )
                                    }
                                    options={[

                                        {
                                            value: "new",
                                            label: "New",
                                        },

                                        {
                                            value: "used",
                                            label: "Used",
                                        },

                                    ]}
                                />


                                {/* PRICE */}

                                <div>

                                    <label className="mb-2 block text-sm font-bold text-[#12395B]">
                                        Price Range
                                    </label>


                                    <div className="grid grid-cols-2 gap-2">

                                        <input
                                            type="number"
                                            min="0"
                                            placeholder="Min"
                                            value={
                                                filters.min_price
                                            }
                                            onChange={(e) =>
                                                updateFilter(
                                                    "min_price",
                                                    e.target.value
                                                )
                                            }
                                            className="w-full rounded-xl border border-blue-100 bg-[#F5F9FC] px-3 py-2.5 text-sm outline-none transition focus:border-[#2F80C0] focus:ring-2 focus:ring-blue-100"
                                        />


                                        <input
                                            type="number"
                                            min="0"
                                            placeholder="Max"
                                            value={
                                                filters.max_price
                                            }
                                            onChange={(e) =>
                                                updateFilter(
                                                    "max_price",
                                                    e.target.value
                                                )
                                            }
                                            className="w-full rounded-xl border border-blue-100 bg-[#F5F9FC] px-3 py-2.5 text-sm outline-none transition focus:border-[#2F80C0] focus:ring-2 focus:ring-blue-100"
                                        />

                                    </div>

                                </div>


                                {/* CLEAR */}

                                <button
                                    type="button"
                                    onClick={clearFilters}
                                    className="flex w-full items-center justify-center gap-2 rounded-xl border border-blue-100 py-3 text-sm font-bold text-[#2F80C0] transition hover:bg-[#EAF6FF]"
                                >

                                    <RotateCcw size={16} />

                                    Clear All Filters

                                </button>

                            </div>

                        </aside>

                    </>


                    {/* =================================================
                        VEHICLES
                    ================================================== */}

                    <section>


                        {/* RESULTS HEADER */}

                        <div className="mb-6 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">


                            <div>

                                <p className="text-sm text-slate-500">

                                    Showing{" "}

                                    <span className="font-bold text-[#12395B]">
                                        {vehicles.length}
                                    </span>{" "}

                                    vehicles

                                </p>


                                {activeFilterCount > 0 && (

                                    <p className="mt-1 text-xs text-[#2F80C0]">

                                        Filters applied

                                    </p>

                                )}

                            </div>


                            {/* SORT */}

                            <div className="relative">


                                <select
                                    value={
                                        filters.sort
                                    }
                                    onChange={(e) =>
                                        updateFilter(
                                            "sort",
                                            e.target.value
                                        )
                                    }
                                    className="appearance-none rounded-xl border border-blue-100 bg-white py-3 pl-4 pr-10 text-sm font-semibold text-[#12395B] shadow-sm outline-none transition focus:border-[#2F80C0]"
                                >

                                    <option value="newest">
                                        Newest
                                    </option>

                                    <option value="price_low">
                                        Price: Low to High
                                    </option>

                                    <option value="price_high">
                                        Price: High to Low
                                    </option>

                                    <option value="oldest">
                                        Oldest
                                    </option>

                                </select>


                                <ChevronDown
                                    size={16}
                                    className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-400"
                                />

                            </div>

                        </div>


                        {/* =================================================
                            LOADING
                        ================================================== */}

                        {loading ? (

                            <div className="grid gap-6 md:grid-cols-2">


                                {[1, 2, 3, 4].map(
                                    (item) => (

                                        <VehicleSkeleton
                                            key={item}
                                        />

                                    )
                                )}

                            </div>


                        ) : vehicles.length === 0 ? (


                            /* =================================================
                                EMPTY
                            ================================================== */

                            <div className="rounded-3xl border border-blue-100 bg-white px-6 py-20 text-center shadow-sm">


                                <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-2xl bg-[#EAF6FF] text-[#2F80C0]">

                                    <CarFront
                                        size={38}
                                    />

                                </div>


                                <h3 className="mt-6 text-2xl font-extrabold text-[#12395B]">

                                    No vehicles found

                                </h3>


                                <p className="mx-auto mt-2 max-w-md text-slate-500">

                                    We couldn't find vehicles matching
                                    your current search and filters.
                                    Try changing your criteria.

                                </p>


                                <button
                                    type="button"
                                    onClick={clearFilters}
                                    className="mt-6 inline-flex items-center gap-2 rounded-xl bg-[#12395B] px-6 py-3 font-bold text-white transition hover:bg-[#2F80C0]"
                                >

                                    <RotateCcw size={17} />

                                    Reset Search

                                </button>

                            </div>


                        ) : (


                            /* =================================================
                                VEHICLE GRID
                            ================================================== */

                            <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-2">

                                {vehicles.map(
                                    (vehicle) => (

                                        <VehicleCard
                                            key={
                                                vehicle.id
                                            }
                                            vehicle={
                                                vehicle
                                            }
                                        />

                                    )
                                )}

                            </div>

                        )}

                    </section>

                </div>

            </main>

        </div>

    );

}


/*
|--------------------------------------------------------------------------
| FILTER SELECT
|--------------------------------------------------------------------------
*/

function FilterSelect({

    label,

    value,

    onChange,

    options,

}) {

    return (

        <div>


            <label className="mb-2 block text-sm font-bold text-[#12395B]">

                {label}

            </label>


            <div className="relative">


                <select
                    value={value}
                    onChange={(e) =>
                        onChange(
                            e.target.value
                        )
                    }
                    className="w-full appearance-none rounded-xl border border-blue-100 bg-[#F5F9FC] px-3 py-3 pr-8 text-sm text-[#12395B] outline-none transition focus:border-[#2F80C0] focus:ring-2 focus:ring-blue-100"
                >

                    <option value="">

                        All {label}

                    </option>


                    {options.map(
                        (option) => (

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


                <ChevronDown
                    size={16}
                    className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-400"
                />

            </div>

        </div>

    );

}


/*
|--------------------------------------------------------------------------
| VEHICLE LOADING SKELETON
|--------------------------------------------------------------------------
*/

function VehicleSkeleton() {

    return (

        <div className="overflow-hidden rounded-2xl border border-blue-100 bg-white shadow-sm">

            <div className="h-60 animate-pulse bg-blue-50" />

            <div className="space-y-4 p-5">


                <div className="flex justify-between">

                    <div className="space-y-2">

                        <div className="h-3 w-20 animate-pulse rounded bg-blue-50" />

                        <div className="h-6 w-32 animate-pulse rounded bg-blue-50" />

                    </div>

                    <div className="h-5 w-24 animate-pulse rounded bg-blue-50" />

                </div>


                <div className="h-20 animate-pulse rounded-xl bg-[#EAF6FF]" />


                <div className="h-4 w-32 animate-pulse rounded bg-blue-50" />


                <div className="h-12 animate-pulse rounded-xl bg-blue-50" />

            </div>

        </div>

    );

}


export default Vehicles;