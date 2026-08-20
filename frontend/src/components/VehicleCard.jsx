import { Link } from "react-router-dom";

import {
    Heart,
    Gauge,
    Fuel,
    Settings2,
    MapPin,
    ArrowUpRight,
} from "lucide-react";


function VehicleCard({ vehicle }) {

    /*
     * Find the image marked as primary.
     * If there is no primary image, use the first available image.
     */

    const primaryImage =
        vehicle.images?.find(
            (image) => image.is_primary
        ) || vehicle.images?.[0];


    /*
     * Django already returns the complete image URL:
     *
     * http://127.0.0.1:8000/media/vehicles/example.jpg
     *
     * Therefore we DON'T add the Django URL again.
     */

    const image = primaryImage?.image ||
        "https://images.unsplash.com/photo-1492144534655-ae79c964c9d7";


    return (

        <article className="group overflow-hidden rounded-2xl border border-blue-100 bg-white shadow-[0_8px_30px_rgba(18,57,91,0.06)] transition duration-300 hover:-translate-y-1 hover:shadow-[0_18px_45px_rgba(18,57,91,0.12)]">


            {/* =========================
                IMAGE
            ========================== */}

            <div className="relative h-60 overflow-hidden bg-blue-50">

                <img
                    src={image}
                    alt={`${vehicle.brand_name} ${vehicle.model}`}
                    className="h-full w-full object-cover transition duration-700 group-hover:scale-105"
                />


                {/* IMAGE OVERLAY */}

                <div className="absolute inset-x-0 top-0 flex items-center justify-between p-4">


                    {/* CONDITION / FEATURED */}

                    {vehicle.featured ? (

                        <span className="rounded-full bg-[#12395B] px-3 py-1.5 text-xs font-bold text-white shadow">
                            FEATURED
                        </span>

                    ) : (

                        <span className="rounded-full bg-white/95 px-3 py-1.5 text-xs font-semibold capitalize text-[#2F80C0] shadow">
                            {vehicle.condition}
                        </span>

                    )}


                    {/* FAVOURITE */}

                    <button
                        type="button"
                        aria-label="Add vehicle to favourites"
                        className="flex h-10 w-10 items-center justify-center rounded-full bg-white/95 text-slate-600 shadow transition hover:bg-[#2F80C0] hover:text-white"
                    >
                        <Heart size={18} />
                    </button>

                </div>

            </div>


            {/* =========================
                CONTENT
            ========================== */}

            <div className="p-5">


                {/* BRAND / MODEL / PRICE */}

                <div className="mb-4 flex items-start justify-between gap-4">


                    {/* VEHICLE NAME */}

                    <div className="min-w-0">

                        <p className="mb-1 text-sm font-semibold text-[#2F80C0]">
                            {vehicle.brand_name}
                        </p>


                        <h3 className="truncate text-xl font-extrabold text-[#12395B]">
                            {vehicle.model}
                        </h3>


                        {vehicle.variant && (

                            <p className="mt-1 truncate text-sm text-slate-400">
                                {vehicle.variant}
                            </p>

                        )}

                    </div>


                    {/* PRICE */}

                    <div className="shrink-0 text-right">

                        <p className="text-lg font-extrabold text-[#12395B]">
                            ${Number(
                                vehicle.price
                            ).toLocaleString()}
                        </p>

                    </div>

                </div>


                {/* =========================
                    VEHICLE SPECS
                ========================== */}

                <div className="grid grid-cols-3 gap-2 rounded-xl bg-[#EAF6FF] p-3">


                    {/* MILEAGE */}

                    <div className="text-center">

                        <Gauge
                            size={16}
                            className="mx-auto mb-1 text-[#2F80C0]"
                        />

                        <p className="text-[11px] text-slate-400">
                            Mileage
                        </p>

                        <p className="mt-0.5 text-xs font-bold text-[#12395B]">
                            {vehicle.mileage
                                ? Number(
                                    vehicle.mileage
                                ).toLocaleString()
                                : "—"
                            }
                        </p>

                    </div>


                    {/* FUEL */}

                    <div className="border-x border-blue-100 text-center">

                        <Fuel
                            size={16}
                            className="mx-auto mb-1 text-[#2F80C0]"
                        />

                        <p className="text-[11px] text-slate-400">
                            Fuel
                        </p>

                        <p className="mt-0.5 text-xs font-bold capitalize text-[#12395B]">
                            {vehicle.fuel_type || "—"}
                        </p>

                    </div>


                    {/* TRANSMISSION */}

                    <div className="text-center">

                        <Settings2
                            size={16}
                            className="mx-auto mb-1 text-[#2F80C0]"
                        />

                        <p className="text-[11px] text-slate-400">
                            Gearbox
                        </p>

                        <p className="mt-0.5 text-xs font-bold capitalize text-[#12395B]">
                            {vehicle.transmission || "—"}
                        </p>

                    </div>

                </div>


                {/* =========================
                    LOCATION
                ========================== */}

                <div className="mt-4 flex items-center gap-1.5 text-sm text-slate-400">

                    <MapPin
                        size={15}
                        className="shrink-0 text-[#2F80C0]"
                    />

                    <span className="truncate">
                        {vehicle.location ||
                            "Location not specified"}
                    </span>

                </div>


                {/* =========================
                    VIEW VEHICLE BUTTON
                ========================== */}

                <Link
                    to={`/vehicles/${vehicle.id}`}
                    className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl bg-[#12395B] py-3.5 font-bold text-white transition hover:bg-[#2F80C0]"
                >

                    View Vehicle

                    <ArrowUpRight
                        size={17}
                        className="transition group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                    />

                </Link>

            </div>

        </article>

    );
}


export default VehicleCard;