import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";

import {
    ArrowLeft,
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
} from "lucide-react";

import Navbar from "../../components/Navbar";
import { getVehicle } from "../../services/vehicleService";


function VehicleDetails() {

    const { id } = useParams();

    const [vehicle, setVehicle] = useState(null);

    const [loading, setLoading] = useState(true);

    const [selectedImage, setSelectedImage] = useState(0);

    const [favourite, setFavourite] = useState(false);


    useEffect(() => {

        const loadVehicle = async () => {

            try {

                const data = await getVehicle(id);

                setVehicle(data);

            } catch (error) {

                console.error(
                    "Failed to load vehicle:",
                    error
                );

            } finally {

                setLoading(false);

            }

        };

        loadVehicle();

    }, [id]);


    if (loading) {

        return (

            <div className="min-h-screen bg-[#F5F9FC]">

                <Navbar />

                <div className="mx-auto max-w-7xl px-5 py-12 md:px-8">

                    <div className="grid animate-pulse gap-8 lg:grid-cols-2">

                        <div className="h-[500px] rounded-3xl bg-white" />

                        <div className="space-y-5">

                            <div className="h-8 w-32 rounded bg-white" />

                            <div className="h-12 w-3/4 rounded bg-white" />

                            <div className="h-20 rounded bg-white" />

                            <div className="h-40 rounded bg-white" />

                        </div>

                    </div>

                </div>

            </div>

        );

    }


    if (!vehicle) {

        return (

            <div className="min-h-screen bg-[#F5F9FC]">

                <Navbar />

                <div className="mx-auto max-w-7xl px-5 py-20 text-center">

                    <CarFront
                        size={50}
                        className="mx-auto text-[#2F80C0]"
                    />

                    <h1 className="mt-5 text-3xl font-extrabold text-[#12395B]">
                        Vehicle not found
                    </h1>

                    <Link
                        to="/vehicles"
                        className="mt-6 inline-flex rounded-xl bg-[#12395B] px-6 py-3 font-bold text-white"
                    >
                        Back to Vehicles
                    </Link>

                </div>

            </div>

        );

    }


   const images = [...(vehicle.images || [])].sort(
    (a, b) =>
        Number(b.is_primary) -
        Number(a.is_primary)
);


    const imageUrl = (image) => {

        if (!image) {
            return "https://images.unsplash.com/photo-1492144534655-ae79c964c9d7";
        }

        return image.image;

    };


    const nextImage = () => {

        if (images.length === 0) return;

        setSelectedImage(
            (previous) =>
                (previous + 1) % images.length
        );

    };


    const previousImage = () => {

        if (images.length === 0) return;

        setSelectedImage(
            (previous) =>
                (previous - 1 + images.length) %
                images.length
        );

    };


    return (

        <div className="min-h-screen bg-[#F5F9FC]">

            <Navbar />


            {/* BREADCRUMB */}

            <div className="border-b border-blue-100 bg-white">

                <div className="mx-auto max-w-7xl px-5 py-4 md:px-8">

                    <Link
                        to="/vehicles"
                        className="inline-flex items-center gap-2 text-sm font-semibold text-slate-500 transition hover:text-[#2F80C0]"
                    >
                        <ArrowLeft size={17} />

                        Back to vehicles
                    </Link>

                </div>

            </div>


            <main className="mx-auto max-w-7xl px-5 py-10 md:px-8">


                {/* TOP SECTION */}

                <div className="grid gap-10 lg:grid-cols-[1.2fr_0.8fr]">


                    {/* IMAGE GALLERY */}

                    <section>

                        <div className="relative overflow-hidden rounded-3xl border border-blue-100 bg-white shadow-sm">

                            <div className="relative h-[350px] sm:h-[450px] lg:h-[520px]">

                                <img
                                    src={
                                        images.length > 0
                                            ? imageUrl(
                                                images[selectedImage]
                                            )
                                            : imageUrl(null)
                                    }
                                    alt={`${vehicle.brand_name} ${vehicle.model}`}
                                    className="h-full w-full object-cover"
                                />


                                {/* IMAGE COUNTER */}

                                {images.length > 0 && (

                                    <div className="absolute bottom-4 left-4 rounded-full bg-[#12395B]/90 px-4 py-2 text-sm font-semibold text-white">

                                        {selectedImage + 1}
                                        {" / "}
                                        {images.length}

                                    </div>

                                )}


                                {/* PREVIOUS */}

                                {images.length > 1 && (

                                    <button
                                        onClick={previousImage}
                                        className="absolute left-4 top-1/2 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-white/95 text-[#12395B] shadow-lg transition hover:bg-[#2F80C0] hover:text-white"
                                    >
                                        <ChevronLeft size={22} />
                                    </button>

                                )}


                                {/* NEXT */}

                                {images.length > 1 && (

                                    <button
                                        onClick={nextImage}
                                        className="absolute right-4 top-1/2 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-white/95 text-[#12395B] shadow-lg transition hover:bg-[#2F80C0] hover:text-white"
                                    >
                                        <ChevronRight size={22} />
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
                                            key={image.id}
                                            onClick={() =>
                                                setSelectedImage(index)
                                            }
                                            className={`
                                                h-20 overflow-hidden rounded-xl border-2 transition
                                                ${selectedImage === index
                                                    ? "border-[#2F80C0]"
                                                    : "border-transparent"
                                                }
                                            `}
                                        >

                                            <img
                                                src={imageUrl(image)}
                                                alt=""
                                                className="h-full w-full object-cover"
                                            />

                                        </button>

                                    )
                                )}

                            </div>

                        )}

                    </section>


                    {/* VEHICLE INFORMATION */}

                    <section>

                        <div className="flex items-start justify-between gap-5">

                            <div>

                                <p className="font-bold uppercase tracking-widest text-[#2F80C0]">
                                    {vehicle.brand_name}
                                </p>

                                <h1 className="mt-2 text-4xl font-extrabold tracking-tight text-[#12395B] md:text-5xl">
                                    {vehicle.model}
                                </h1>

                                {vehicle.variant && (

                                    <p className="mt-2 text-lg text-slate-400">
                                        {vehicle.variant}
                                    </p>

                                )}

                            </div>


                            <div className="flex gap-2">

                                <button
                                    onClick={() =>
                                        setFavourite(!favourite)
                                    }
                                    className={`flex h-11 w-11 items-center justify-center rounded-xl border transition
                                    ${
                                        favourite
                                            ? "border-red-200 bg-red-50 text-red-500"
                                            : "border-blue-100 bg-white text-slate-500 hover:bg-blue-50"
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


                                <button className="flex h-11 w-11 items-center justify-center rounded-xl border border-blue-100 bg-white text-slate-500 transition hover:bg-blue-50">
                                    <Share2 size={20} />
                                </button>

                            </div>

                        </div>


                        {/* PRICE */}

                        <div className="mt-8 rounded-2xl border border-blue-100 bg-white p-6 shadow-sm">

                            <p className="text-sm font-semibold text-slate-400">
                                Asking Price
                            </p>

                            <p className="mt-1 text-3xl font-extrabold text-[#12395B]">
                                ${Number(
                                    vehicle.price
                                ).toLocaleString()}
                            </p>

                            <div className="mt-4 flex items-center gap-2 text-sm">

                                <CheckCircle2
                                    size={17}
                                    className="text-green-500"
                                />

                                <span className="font-semibold text-green-600">
                                    {vehicle.status}
                                </span>

                            </div>

                        </div>


                        {/* QUICK SPECS */}

                        <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-2 xl:grid-cols-4">

                            <Spec
                                icon={<CalendarDays size={19} />}
                                label="Year"
                                value={vehicle.year}
                            />

                            <Spec
                                icon={<Gauge size={19} />}
                                label="Mileage"
                                value={`${Number(
                                    vehicle.mileage
                                ).toLocaleString()} km`}
                            />

                            <Spec
                                icon={<Fuel size={19} />}
                                label="Fuel"
                                value={vehicle.fuel_type}
                            />

                            <Spec
                                icon={<Settings2 size={19} />}
                                label="Gearbox"
                                value={vehicle.transmission}
                            />

                        </div>


                        {/* LOCATION */}

                        <div className="mt-4 flex items-center gap-3 rounded-2xl border border-blue-100 bg-white p-5">

                            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#EAF6FF] text-[#2F80C0]">

                                <MapPin size={21} />

                            </div>

                            <div>

                                <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                                    Location
                                </p>

                                <p className="mt-1 font-bold text-[#12395B]">
                                    {vehicle.location || "Not specified"}
                                </p>

                            </div>

                        </div>


                        {/* ACTIONS */}

                        <div className="mt-5 grid gap-3 sm:grid-cols-2">

                            <button className="flex items-center justify-center gap-2 rounded-xl bg-[#12395B] py-4 font-bold text-white transition hover:bg-[#2F80C0]">

                                <Phone size={19} />

                                Contact Seller

                            </button>


                            <button className="flex items-center justify-center gap-2 rounded-xl bg-[#EAF6FF] py-4 font-bold text-[#12395B] transition hover:bg-blue-100">

                                <MessageCircle size={19} />

                                WhatsApp

                            </button>

                        </div>


                        {/* TRUST */}

                        <div className="mt-5 flex items-center gap-3 rounded-xl bg-[#EAF6FF] p-4">

                            <ShieldCheck
                                size={23}
                                className="shrink-0 text-[#2F80C0]"
                            />

                            <p className="text-sm text-slate-600">

                                <span className="font-bold text-[#12395B]">
                                    Buy with confidence.
                                </span>{" "}

                                Vehicle information is provided by
                                the seller through our platform.

                            </p>

                        </div>

                    </section>

                </div>


                {/* SPECIFICATIONS */}

                <section className="mt-12 rounded-3xl border border-blue-100 bg-white p-6 shadow-sm md:p-8">

                    <div className="flex items-center gap-3">

                        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#EAF6FF] text-[#2F80C0]">

                            <CarFront size={22} />

                        </div>

                        <div>

                            <p className="text-sm font-semibold text-[#2F80C0]">
                                Vehicle Information
                            </p>

                            <h2 className="text-2xl font-extrabold text-[#12395B]">
                                Specifications
                            </h2>

                        </div>

                    </div>


                    <div className="mt-8 grid gap-x-10 gap-y-5 sm:grid-cols-2 lg:grid-cols-3">

                        <Detail
                            label="Brand"
                            value={vehicle.brand_name}
                        />

                        <Detail
                            label="Model"
                            value={vehicle.model}
                        />

                        <Detail
                            label="Variant"
                            value={vehicle.variant}
                        />

                        <Detail
                            label="Year"
                            value={vehicle.year}
                        />

                        <Detail
                            label="Mileage"
                            value={`${Number(
                                vehicle.mileage
                            ).toLocaleString()} km`}
                        />

                        <Detail
                            label="Fuel Type"
                            value={vehicle.fuel_type}
                        />

                        <Detail
                            label="Transmission"
                            value={vehicle.transmission}
                        />

                        <Detail
                            label="Engine"
                            value={vehicle.engine_size}
                        />

                        <Detail
                            label="Horsepower"
                            value={vehicle.horsepower}
                        />

                        <Detail
                            label="Drivetrain"
                            value={vehicle.drivetrain}
                        />

                        <Detail
                            label="Seats"
                            value={vehicle.seats}
                        />

                        <Detail
                            label="Doors"
                            value={vehicle.doors}
                        />

                        <Detail
                            label="Exterior Color"
                            value={vehicle.exterior_color}
                        />

                        <Detail
                            label="Interior Color"
                            value={vehicle.interior_color}
                        />

                    </div>

                </section>


                {/* DESCRIPTION */}

                <section className="mt-8 rounded-3xl border border-blue-100 bg-white p-6 shadow-sm md:p-8">

                    <h2 className="text-2xl font-extrabold text-[#12395B]">
                        Description
                    </h2>

                    <p className="mt-5 whitespace-pre-line leading-8 text-slate-600">
                        {vehicle.description ||
                            "No description has been provided for this vehicle."}
                    </p>

                </section>

            </main>

        </div>
    );
}


function Spec({
    icon,
    label,
    value,
}) {

    return (

        <div className="rounded-2xl border border-blue-100 bg-white p-4">

            <div className="text-[#2F80C0]">
                {icon}
            </div>

            <p className="mt-3 text-xs text-slate-400">
                {label}
            </p>

            <p className="mt-1 truncate text-sm font-bold capitalize text-[#12395B]">
                {value || "—"}
            </p>

        </div>

    );
}


function Detail({
    label,
    value,
}) {

    return (

        <div className="flex items-center justify-between border-b border-blue-50 pb-3">

            <span className="text-sm text-slate-400">
                {label}
            </span>

            <span className="text-right text-sm font-bold capitalize text-[#12395B]">
                {value || "—"}
            </span>

        </div>

    );

}


export default VehicleDetails;