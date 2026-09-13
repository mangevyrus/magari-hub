
// src/pages/BrandVehicles.jsx

import { useEffect, useState } from "react";

import { useParams, Link } from "react-router-dom";

import { ArrowLeft, CarFront } from "lucide-react";

import { useTranslation } from "react-i18next";

import Navbar from "../components/Navbar";
import VehicleCard from "../components/VehicleCard";

import { getVehiclesByBrand } from "../services/vehicleService";

const BrandVehicles = () => {
    const { brandId } = useParams();

    const { t } = useTranslation();

    const [brand, setBrand] = useState(null);
    const [vehicles, setVehicles] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchBrandVehicles = async () => {
            try {
                setLoading(true);
                setError("");

                const data =
                    await getVehiclesByBrand(brandId);

                setBrand(data.brand);
                setVehicles(data.vehicles || []);
            } catch (err) {
                console.error(
                    "Failed to load brand vehicles:",
                    err
                );

                setError(
                    t(
                        "brandVehicles.errors.loadFailed"
                    )
                );
            } finally {
                setLoading(false);
            }
        };

        fetchBrandVehicles();
    }, [brandId, t]);

    // ============================================================
    // LOADING
    // ============================================================

    if (loading) {
        return (
            <div className="min-h-screen bg-[#FDF8F5]">
                <Navbar />

                <div className="flex min-h-[70vh] items-center justify-center px-5">
                    <div className="text-center">
                        <div className="mx-auto h-12 w-12 animate-spin rounded-full border-4 border-[#F4A460]/20 border-b-[#8B1A1A]" />

                        <p className="mt-4 text-[#6A5A4A]">
                            {t(
                                "brandVehicles.loading"
                            )}
                        </p>
                    </div>
                </div>
            </div>
        );
    }

    // ============================================================
    // ERROR / BRAND NOT FOUND
    // ============================================================

    if (error || !brand) {
        return (
            <div className="min-h-screen bg-[#FDF8F5]">
                <Navbar />

                <div className="mx-auto max-w-7xl px-5 py-20 text-center">
                    <CarFront
                        size={50}
                        className="mx-auto text-[#8B1A1A]"
                    />

                    <h2 className="mt-4 text-2xl font-extrabold text-[#2D1B0E]">
                        {error ||
                            t(
                                "brandVehicles.errors.notFound"
                            )}
                    </h2>

                    <Link
                        to="/vehicles"
                        className="mt-6 inline-flex items-center gap-2 rounded-xl bg-[#8B1A1A] px-6 py-3 font-bold text-white transition hover:bg-[#6B1515]"
                    >
                        <ArrowLeft size={18} />

                        {t(
                            "brandVehicles.backToVehicles"
                        )}
                    </Link>
                </div>
            </div>
        );
    }

    // ============================================================
    // RENDER
    // ============================================================

    return (
        <div className="min-h-screen bg-[#FDF8F5]">
            <Navbar />

            {/* ==================================================
                BRAND HEADER
            ================================================== */}

            <div className="border-b border-[#8B1A1A]/20 bg-white">
                <div className="mx-auto max-w-7xl px-5 py-8 md:px-8">
                    <Link
                        to="/vehicles"
                        className="inline-flex items-center gap-2 text-sm font-bold text-[#8B1A1A] transition hover:text-[#6B1515]"
                    >
                        <ArrowLeft size={17} />

                        {t(
                            "brandVehicles.backToVehicles"
                        )}
                    </Link>

                    <div className="mt-4 flex items-center gap-4">
                        {brand.logo && (
                            <div className="flex h-16 w-16 items-center justify-center rounded-xl border border-[#D4A853]/20 bg-[#FDF8F5] p-2">
                                <img
                                    src={brand.logo}
                                    alt={brand.name}
                                    className="max-h-full max-w-full object-contain"
                                />
                            </div>
                        )}

                        <div>
                            <h1 className="text-3xl font-extrabold text-[#2D1B0E]">
                                {brand.name}
                            </h1>

                            <p className="text-[#6A5A4A]">
                                {t(
                                    "brandVehicles.vehicleCount",
                                    {
                                        count: vehicles.length,
                                    }
                                )}
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* ==================================================
                VEHICLE GRID
            ================================================== */}

            <main className="mx-auto max-w-7xl px-5 py-10 md:px-8">
                {vehicles.length === 0 ? (
                    <div className="py-20 text-center">
                        <CarFront
                            size={40}
                            className="mx-auto text-[#8B1A1A]"
                        />

                        <h3 className="mt-4 text-xl font-bold text-[#2D1B0E]">
                            {t(
                                "brandVehicles.empty.title"
                            )}
                        </h3>

                        <p className="mt-2 text-[#6A5A4A]">
                            {t(
                                "brandVehicles.empty.description",
                                {
                                    brand: brand.name,
                                }
                            )}
                        </p>

                        <Link
                            to="/vehicles"
                            className="mt-6 inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-[#B22222] to-[#8B1A1A] px-6 py-3 font-bold text-white shadow-lg shadow-[#B22222]/20 transition hover:shadow-xl hover:shadow-[#B22222]/30"
                        >
                            <ArrowLeft size={18} />

                            {t(
                                "brandVehicles.browseAll"
                            )}
                        </Link>
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
};

export default BrandVehicles;
