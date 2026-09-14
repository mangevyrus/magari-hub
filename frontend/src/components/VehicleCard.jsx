
import { Link } from "react-router-dom";

import {
    Heart,
    Gauge,
    Fuel,
    Settings2,
    MapPin,
    ArrowUpRight,
    Star,
    ShieldCheck,
} from "lucide-react";

import { useTranslation } from "react-i18next";

function VehicleCard({ vehicle }) {
    const { t } = useTranslation();

    /*
     * Find the image marked as primary.
     * If there is no primary image, use the first available image.
     */
    const primaryImage =
        vehicle.images?.find((image) => image.is_primary) ||
        vehicle.images?.[0];

    /*
     * Django already returns the complete image URL.
     *
     * Example:
     
     *
     * Therefore we don't add the Django URL again.
     */
    const image =
        primaryImage?.image ||
        "https://images.unsplash.com/photo-1492144534655-ae79c964c9d7";

    /*
     * Format prices in Tanzanian Shillings.
     */
    const formatTZS = (value) =>
        `TZS ${Number(value || 0).toLocaleString("en-TZ", {
            maximumFractionDigits: 0,
        })}`;

    /*
     * Translate vehicle fuel type.
     */
    const getFuelLabel = (fuelType) => {
        if (!fuelType) return "—";

        const normalizedFuel = String(fuelType).toLowerCase();

        const fuelTranslations = {
            petrol: t("vehicleDetails.values.fuel.petrol"),
            gasoline: t("vehicleDetails.values.fuel.petrol"),
            diesel: t("vehicleDetails.values.fuel.diesel"),
            hybrid: t("vehicleDetails.values.fuel.hybrid"),
            electric: t("vehicleDetails.values.fuel.electric"),
        };

        return (
            fuelTranslations[normalizedFuel] ||
            fuelType
        );
    };

    /*
     * Translate vehicle transmission.
     */
    const getTransmissionLabel = (transmission) => {
        if (!transmission) return "—";

        const normalizedTransmission =
            String(transmission).toLowerCase();

        const transmissionTranslations = {
            automatic:
                t(
                    "vehicleDetails.values.transmission.automatic"
                ),
            manual:
                t(
                    "vehicleDetails.values.transmission.manual"
                ),
        };

        return (
            transmissionTranslations[
                normalizedTransmission
            ] || transmission
        );
    };

    /*
     * Translate vehicle condition.
     */
    const getConditionLabel = (condition) => {
        if (!condition) return "";

        const normalizedCondition =
            String(condition).toLowerCase();

        const conditionTranslations = {
            new: t(
                "vehicles.filters.conditionOptions.new"
            ),
            used: t(
                "vehicles.filters.conditionOptions.used"
            ),
        };

        return (
            conditionTranslations[
                normalizedCondition
            ] || condition
        );
    };

    return (
        <article className="group relative overflow-hidden rounded-2xl border border-[#8B1A1A]/20 bg-white shadow-[0_8px_30px_rgba(74,14,14,0.1)] transition-all duration-500 hover:-translate-y-2 hover:border-[#8B1A1A]/40 hover:shadow-[0_20px_60px_rgba(139,26,26,0.2)]">
            {/* Decorative corner accent */}
            <div className="pointer-events-none absolute right-0 top-0 h-20 w-20 rounded-tr-2xl bg-gradient-to-bl from-[#8B1A1A]/5 to-transparent" />

            <div className="pointer-events-none absolute bottom-0 left-0 h-20 w-20 rounded-bl-2xl bg-gradient-to-tr from-[#8B1A1A]/5 to-transparent" />

            {/* =========================
                IMAGE
            ========================== */}
            <div className="relative h-60 overflow-hidden bg-[#FDF8F5]">
                <img
                    src={image}
                    alt={`${vehicle.brand_name || ""} ${
                        vehicle.model || ""
                    }`}
                    className="h-full w-full object-cover transition duration-700 group-hover:scale-110"
                />

                {/* Image overlay gradient */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />

                {/* IMAGE OVERLAY */}
                <div className="absolute inset-x-0 top-0 flex items-center justify-between p-4">
                    {/* CONDITION / FEATURED */}
                    {vehicle.featured ? (
                        <span className="flex items-center gap-1.5 rounded-full bg-gradient-to-r from-[#8B1A1A] to-[#4A0E0E] px-3.5 py-1.5 text-xs font-bold text-white shadow-lg shadow-[#8B1A1A]/40">
                            <Star
                                size={12}
                                className="fill-current"
                            />

                            {t("vehicleCard.featured")}
                        </span>
                    ) : (
                        <span className="rounded-full border border-[#8B1A1A]/10 bg-white/95 px-3.5 py-1.5 text-xs font-semibold capitalize text-[#8B1A1A] shadow-lg shadow-black/5 backdrop-blur-sm">
                            {getConditionLabel(
                                vehicle.condition
                            )}
                        </span>
                    )}

                    {/* FAVOURITE */}
                    <button
                        type="button"
                        aria-label={t(
                            "vehicleCard.favourite"
                        )}
                        className="flex h-10 w-10 items-center justify-center rounded-full bg-white/95 text-[#6A5A4A] shadow-lg shadow-black/10 backdrop-blur-sm transition-all duration-300 hover:scale-110 hover:bg-[#8B1A1A] hover:text-white hover:shadow-xl hover:shadow-[#8B1A1A]/30"
                    >
                        <Heart
                            size={18}
                            className="transition-transform duration-300 group-hover:scale-110"
                        />
                    </button>
                </div>

                {/* Status indicator */}
                {vehicle.status === "available" && (
                    <div className="absolute bottom-4 left-4 flex items-center gap-1.5 rounded-full bg-emerald-500/90 px-2.5 py-1 backdrop-blur-sm">
                        <span className="relative flex h-1.5 w-1.5">
                            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-200 opacity-75" />

                            <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-white" />
                        </span>

                        <span className="text-[10px] font-bold uppercase tracking-wider text-white">
                            {t(
                                "vehicleCard.available"
                            )}
                        </span>
                    </div>
                )}
            </div>

            {/* =========================
                CONTENT
            ========================== */}
            <div className="relative p-5">
                {/* Gold accent line */}
                <div className="absolute left-1/2 top-0 h-0.5 w-12 -translate-x-1/2 bg-gradient-to-r from-transparent via-[#D4A853]/30 to-transparent" />

                {/* BRAND / MODEL / PRICE */}
                <div className="mb-4 flex items-start justify-between gap-4">
                    {/* VEHICLE NAME */}
                    <div className="min-w-0">
                        <p className="mb-1 text-sm font-semibold tracking-wide text-[#8B1A1A]">
                            {vehicle.brand_name}
                        </p>

                        <h3 className="truncate text-xl font-extrabold text-[#2D1B0E]">
                            {vehicle.model}
                        </h3>

                        {vehicle.variant && (
                            <p className="mt-1 truncate text-sm text-[#8A7A6A]">
                                {vehicle.variant}
                            </p>
                        )}
                    </div>

                    {/* PRICE */}
                    <div className="shrink-0 text-right">
                        <p className="text-lg font-extrabold text-[#2D1B0E]">
                            {formatTZS(vehicle.price)}
                        </p>
                    </div>
                </div>

                {/* =========================
                    VEHICLE SPECS
                ========================== */}
                <div className="grid grid-cols-3 gap-2 rounded-xl border border-[#D4A853]/10 bg-gradient-to-br from-[#FDF8F5] to-[#FEF5F0] p-3">
                    {/* MILEAGE */}
                    <div className="group/spec text-center">
                        <Gauge
                            size={16}
                            className="mx-auto mb-1 text-[#8B1A1A] transition-transform duration-300 group-hover/spec:scale-110"
                        />

                        <p className="text-[11px] font-medium text-[#8A7A6A]">
                            {t(
                                "vehicleCard.mileage"
                            )}
                        </p>

                        <p className="mt-0.5 text-xs font-bold text-[#2D1B0E]">
                            {vehicle.mileage
                                ? Number(
                                      vehicle.mileage
                                  ).toLocaleString(
                                      "en-TZ"
                                  )
                                : "—"}
                        </p>
                    </div>

                    {/* FUEL */}
                    <div className="group/spec border-x border-[#D4A853]/20 text-center">
                        <Fuel
                            size={16}
                            className="mx-auto mb-1 text-[#8B1A1A] transition-transform duration-300 group-hover/spec:scale-110"
                        />

                        <p className="text-[11px] font-medium text-[#8A7A6A]">
                            {t(
                                "vehicleCard.fuel"
                            )}
                        </p>

                        <p className="mt-0.5 text-xs font-bold capitalize text-[#2D1B0E]">
                            {getFuelLabel(
                                vehicle.fuel_type
                            )}
                        </p>
                    </div>

                    {/* TRANSMISSION */}
                    <div className="group/spec text-center">
                        <Settings2
                            size={16}
                            className="mx-auto mb-1 text-[#8B1A1A] transition-transform duration-300 group-hover/spec:scale-110"
                        />

                        <p className="text-[11px] font-medium text-[#8A7A6A]">
                            {t(
                                "vehicleCard.gearbox"
                            )}
                        </p>

                        <p className="mt-0.5 text-xs font-bold capitalize text-[#2D1B0E]">
                            {getTransmissionLabel(
                                vehicle.transmission
                            )}
                        </p>
                    </div>
                </div>

                {/* =========================
                    LOCATION
                ========================== */}
                <div className="mt-4 flex items-center gap-1.5 text-sm text-[#8A7A6A]">
                    <MapPin
                        size={15}
                        className="shrink-0 text-[#8B1A1A]"
                    />

                    <span className="truncate font-medium">
                        {vehicle.location ||
                            t(
                                "vehicleCard.locationNotSpecified"
                            )}
                    </span>
                </div>

                {/* =========================
                    VIEW VEHICLE BUTTON
                ========================== */}
                <Link
                    to={`/vehicles/${vehicle.id}`}
                    className="group/btn relative mt-5 flex w-full items-center justify-center gap-2 overflow-hidden rounded-xl bg-gradient-to-r from-[#8B1A1A] to-[#4A0E0E] py-3.5 font-bold text-white shadow-lg shadow-[#8B1A1A]/30 transition-all duration-300 hover:scale-[1.02] hover:shadow-xl hover:shadow-[#8B1A1A]/50"
                >
                    {/* Shine effect */}
                    <span className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/10 to-transparent transition-transform duration-700 group-hover/btn:translate-x-full" />

                    <span className="relative z-10 flex items-center gap-2">
                        {t(
                            "vehicleCard.viewVehicle"
                        )}

                        <ArrowUpRight
                            size={17}
                            className="transition-all duration-300 group-hover/btn:translate-x-1 group-hover/btn:-translate-y-1"
                        />
                    </span>
                </Link>

                {/* Trust badge */}
                <div className="mt-3 flex items-center justify-center gap-1.5">
                    <ShieldCheck
                        size={12}
                        className="text-[#D4A853]"
                    />

                    <span className="text-[10px] font-medium text-[#8A7A6A]">
                        {t(
                            "vehicleCard.trustedSeller"
                        )}
                    </span>
                </div>
            </div>
        </article>
    );
}

export default VehicleCard;

