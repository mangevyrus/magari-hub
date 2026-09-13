import AdminLayout from "../../layouts/AdminLayout";
import { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
    ArrowLeft,
    Car,
    ImagePlus,
    X,
    Star,
    Upload,
    CheckCircle2,
    AlertCircle,
    Loader2,
    MapPin,
    Gauge,
    Fuel,
    Settings2,
    Palette,
    FileText,
} from "lucide-react";

import Navbar from "../../components/Navbar";

import {
    getBrands,
    getCategories,
    createVehicle,
    uploadVehicleImages,
    setPrimaryImage,
} from "../../services/vehicleService";


function AddVehicle() {

    const navigate = useNavigate();

    const fileInputRef = useRef(null);

    const [brands, setBrands] = useState([]);
    const [categories, setCategories] = useState([]);

    const [loadingData, setLoadingData] = useState(true);

    const [saving, setSaving] = useState(false);

    const [uploading, setUploading] = useState(false);

    const [error, setError] = useState("");

    const [success, setSuccess] = useState("");

    const [images, setImages] = useState([]);

    const [form, setForm] = useState({

        brand: "",
        category: "",

        model: "",
        variant: "",

        year: new Date().getFullYear(),

        price: "",
        mileage: "",

        condition: "used",
        status: "available",

        fuel_type: "petrol",
        transmission: "automatic",

        engine_size: "",
        horsepower: "",
        drivetrain: "",

        seats: 5,
        doors: 4,

        exterior_color: "",
        interior_color: "",

        location: "",

        description: "",

        featured: false,
    });


    // =====================================================
    // LOAD BRANDS + CATEGORIES
    // =====================================================

    useEffect(() => {

        const loadData = async () => {

            try {

                setLoadingData(true);

                const [
                    brandsData,
                    categoriesData,
                ] = await Promise.all([
                    getBrands(),
                    getCategories(),
                ]);

                setBrands(brandsData);
                setCategories(categoriesData);

            } catch (err) {

                console.error(err);

                setError(
                    "Unable to load brands and categories."
                );

            } finally {

                setLoadingData(false);

            }

        };

        loadData();

    }, []);


    // =====================================================
    // FORM CHANGE
    // =====================================================

    const handleChange = (e) => {

        const {
            name,
            value,
            type,
            checked,
        } = e.target;

        setForm((previous) => ({
            ...previous,
            [name]:
                type === "checkbox"
                    ? checked
                    : value,
        }));

    };


    // =====================================================
    // IMAGE SELECTION
    // =====================================================

    const handleImageSelect = (e) => {

        const selectedFiles = Array.from(
            e.target.files || []
        );

        if (!selectedFiles.length) {
            return;
        }

        const newImages = selectedFiles.map(
            (file, index) => ({

                id:
                    `${file.name}-${file.size}-${Date.now()}-${index}`,

                file,

                preview:
                    URL.createObjectURL(file),

                isPrimary:
                    images.length === 0 &&
                    index === 0,

            })
        );

        setImages((previous) => [
            ...previous,
            ...newImages,
        ]);

        e.target.value = "";

    };


    // =====================================================
    // REMOVE IMAGE
    // =====================================================

    const removeImage = (id) => {

        setImages((previous) => {

            const imageToRemove =
                previous.find(
                    (image) => image.id === id
                );

            if (imageToRemove) {

                URL.revokeObjectURL(
                    imageToRemove.preview
                );

            }

            const remaining =
                previous.filter(
                    (image) => image.id !== id
                );

            // If primary image was removed,
            // make first remaining image primary.

            if (
                imageToRemove?.isPrimary &&
                remaining.length > 0
            ) {

                remaining[0] = {
                    ...remaining[0],
                    isPrimary: true,
                };

            }

            return remaining;

        });

    };


    // =====================================================
    // SET PRIMARY IMAGE
    // =====================================================

    const makePrimary = (id) => {

        setImages((previous) =>
            previous.map((image) => ({
                ...image,
                isPrimary:
                    image.id === id,
            }))
        );

    };


    // =====================================================
    // SUBMIT
    // =====================================================

    const handleSubmit = async (e) => {

        e.preventDefault();

        setError("");
        setSuccess("");

        // -----------------------------------------------
        // VALIDATION
        // -----------------------------------------------

        if (!form.brand) {

            setError(
                "Please select a vehicle brand."
            );

            return;
        }

        if (!form.category) {

            setError(
                "Please select a vehicle category."
            );

            return;
        }

        if (!form.model.trim()) {

            setError(
                "Please enter the vehicle model."
            );

            return;
        }

        if (!form.price) {

            setError(
                "Please enter the vehicle price."
            );

            return;
        }

        if (!form.description.trim()) {

            setError(
                "Please enter a vehicle description."
            );

            return;
        }

        if (images.length === 0) {

            setError(
                "Please upload at least one vehicle image."
            );

            return;
        }

        try {

            setSaving(true);

            // -------------------------------------------
            // PREPARE VEHICLE DATA
            // -------------------------------------------

            const vehicleData = {

                brand: Number(form.brand),

                category: Number(form.category),

                model:
                    form.model.trim(),

                variant:
                    form.variant.trim(),

                year:
                    Number(form.year),

                price:
                    form.price,

                mileage:
                    Number(form.mileage || 0),

                condition:
                    form.condition,

                status:
                    form.status,

                fuel_type:
                    form.fuel_type,

                transmission:
                    form.transmission,

                engine_size:
                    form.engine_size.trim(),

                horsepower:
                    form.horsepower
                        ? Number(form.horsepower)
                        : null,

                drivetrain:
                    form.drivetrain.trim(),

                seats:
                    Number(form.seats || 5),

                doors:
                    Number(form.doors || 4),

                exterior_color:
                    form.exterior_color.trim(),

                interior_color:
                    form.interior_color.trim(),

                description:
                    form.description.trim(),

                location:
                    form.location.trim(),

                featured:
                    form.featured,

            };


            // -------------------------------------------
            // CREATE VEHICLE
            // -------------------------------------------

            const vehicle =
                await createVehicle(
                    vehicleData
                );


            // -------------------------------------------
            // UPLOAD IMAGES
            // -------------------------------------------

            setUploading(true);

            const files = images.map(
                (image) => image.file
            );

            const uploadedImages =
                await uploadVehicleImages(
                    vehicle.id,
                    files
                );


            // -------------------------------------------
            // SET PRIMARY IMAGE
            // -------------------------------------------

            const primaryLocalImage =
                images.find(
                    (image) =>
                        image.isPrimary
                );

            if (
                primaryLocalImage &&
                uploadedImages?.length
            ) {

                const primaryIndex =
                    images.findIndex(
                        (image) =>
                            image.id ===
                            primaryLocalImage.id
                    );

                const primaryUploadedImage =
                    uploadedImages[
                        primaryIndex
                    ];

                if (
                    primaryUploadedImage
                ) {

                    await setPrimaryImage(
                        vehicle.id,
                        primaryUploadedImage.id
                    );

                }

            }


            setSuccess(
                "Vehicle added successfully!"
            );


            // -------------------------------------------
            // CLEAN PREVIEWS
            // -------------------------------------------

            images.forEach((image) => {

                URL.revokeObjectURL(
                    image.preview
                );

            });


            setTimeout(() => {

                navigate(
                    `/vehicles/${vehicle.id}`
                );

            }, 1200);

        } catch (err) {

            console.error(
                "Failed to create vehicle:",
                err
            );

            const message =
                err?.response?.data?.detail ||
                err?.response?.data?.message ||
                "Unable to create vehicle. Please check your information and try again.";

            setError(message);

        } finally {

            setSaving(false);
            setUploading(false);

        }

    };


    // =====================================================
    // LOADING
    // =====================================================

    if (loadingData) {

        return (

            <div className="min-h-screen bg-[#FDF8F5]">

                <Navbar />

                <div className="flex min-h-[70vh] items-center justify-center">

                    <div className="text-center">

                        <Loader2
                            size={40}
                            className="mx-auto animate-spin text-[#8B1A1A]"
                        />

                        <p className="mt-4 font-semibold text-[#2D1B0E]">
                            Loading vehicle form...
                        </p>

                    </div>

                </div>

            </div>

        );

    }


    return (

        <AdminLayout>

            <Navbar />


            {/* =================================================
                PAGE HEADER - REDISH
            ================================================= */}

            <section className="border-b border-[#8B1A1A]/20 bg-[#FDF8F5]">

                <div className="mx-auto max-w-7xl px-5 py-8 md:px-8">

                    <Link
                        to="/dashboard"
                        className="mb-5 inline-flex items-center gap-2 text-sm font-bold text-[#8B1A1A] transition hover:text-[#6B1515]"
                    >

                        <ArrowLeft size={17} />

                        Back to Dashboard

                    </Link>


                    <div className="flex flex-col justify-between gap-5 md:flex-row md:items-end">

                        <div>

                            <p className="text-sm font-bold uppercase tracking-[0.2em] text-[#8B1A1A]">
                                Vehicle Management
                            </p>

                            <h1 className="mt-2 text-3xl font-extrabold text-[#2D1B0E] md:text-4xl">
                                Add New Vehicle
                            </h1>

                            <p className="mt-2 max-w-2xl text-[#6A5A4A]">
                                Create a professional vehicle listing
                                with complete specifications and high-quality images.
                            </p>

                        </div>


                        <div className="hidden h-14 w-14 items-center justify-center rounded-2xl bg-[#8B1A1A] text-white shadow-lg shadow-[#8B1A1A]/20 md:flex">

                            <Car size={28} />

                        </div>

                    </div>

                </div>

            </section>


            {/* =================================================
                MAIN
            ================================================= */}

            <main className="mx-auto max-w-7xl px-5 py-8 md:px-8">


                {/* =================================================
                    NOTIFICATIONS
                ================================================= */}

                {error && (

                    <div className="mb-6 flex items-start gap-3 rounded-2xl border border-red-100 bg-red-50 p-4 text-red-700">

                        <AlertCircle
                            size={20}
                            className="mt-0.5 shrink-0"
                        />

                        <div>

                            <p className="font-bold">
                                Something went wrong
                            </p>

                            <p className="mt-1 text-sm">
                                {error}
                            </p>

                        </div>

                        <button
                            onClick={() => setError("")}
                            className="ml-auto rounded-lg p-1 hover:bg-red-100"
                        >

                            <X size={18} />

                        </button>

                    </div>

                )}


                {success && (

                    <div className="mb-6 flex items-center gap-3 rounded-2xl border border-green-100 bg-green-50 p-4 text-green-700">

                        <CheckCircle2 size={21} />

                        <p className="font-bold">
                            {success}
                        </p>

                    </div>

                )}


                <form
                    onSubmit={handleSubmit}
                    className="space-y-7"
                >


                    {/* =================================================
                        BASIC INFORMATION
                    ================================================= */}

                    <FormSectionRed
                        icon={<Car size={20} />}
                        title="Basic Information"
                        description="Tell customers what vehicle you are listing."
                    >

                        <div className="grid gap-5 md:grid-cols-2">

                            <SelectFieldRed
                                label="Brand"
                                name="brand"
                                value={form.brand}
                                onChange={handleChange}
                                required
                                options={brands.map(
                                    (brand) => ({
                                        value: brand.id,
                                        label: brand.name,
                                    })
                                )}
                                placeholder="Select brand"
                            />


                            <SelectFieldRed
                                label="Category"
                                name="category"
                                value={form.category}
                                onChange={handleChange}
                                required
                                options={categories.map(
                                    (category) => ({
                                        value: category.id,
                                        label: category.name,
                                    })
                                )}
                                placeholder="Select category"
                            />


                            <InputFieldRed
                                label="Model"
                                name="model"
                                value={form.model}
                                onChange={handleChange}
                                placeholder="e.g. Land Cruiser"
                                required
                            />


                            <InputFieldRed
                                label="Variant"
                                name="variant"
                                value={form.variant}
                                onChange={handleChange}
                                placeholder="e.g. VX V8"
                            />


                            <InputFieldRed
                                label="Year"
                                name="year"
                                type="number"
                                value={form.year}
                                onChange={handleChange}
                                min="1900"
                                max="2100"
                                required
                            />

                        </div>

                    </FormSectionRed>


                    {/* =================================================
                        PRICING
                    ================================================= */}

                    <FormSectionRed
                        icon={<Gauge size={20} />}
                        title="Pricing & Inventory"
                        description="Set the price, mileage and availability."
                    >

                        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-4">

                            <InputFieldRed
                                label="Price"
                                name="price"
                                type="number"
                                value={form.price}
                                onChange={handleChange}
                                placeholder="125000000"
                                min="0"
                                required
                            />


                            <InputFieldRed
                                label="Mileage"
                                name="mileage"
                                type="number"
                                value={form.mileage}
                                onChange={handleChange}
                                placeholder="75000"
                                min="0"
                            />


                            <SelectFieldRed
                                label="Condition"
                                name="condition"
                                value={form.condition}
                                onChange={handleChange}
                                options={[
                                    {
                                        value: "new",
                                        label: "New",
                                    },
                                    {
                                        value: "used",
                                        label: "Used",
                                    },
                                    {
                                        value: "certified",
                                        label: "Certified Pre-Owned",
                                    },
                                ]}
                            />


                            <SelectFieldRed
                                label="Status"
                                name="status"
                                value={form.status}
                                onChange={handleChange}
                                options={[
                                    {
                                        value: "available",
                                        label: "Available",
                                    },
                                    {
                                        value: "reserved",
                                        label: "Reserved",
                                    },
                                    {
                                        value: "sold",
                                        label: "Sold",
                                    },
                                    {
                                        value: "draft",
                                        label: "Draft",
                                    },
                                    {
                                        value: "archived",
                                        label: "Archived",
                                    },
                                ]}
                            />

                        </div>


                        <label className="mt-5 flex cursor-pointer items-center gap-3 rounded-xl border border-[#8B1A1A]/20 bg-[#FDF8F5] p-4 hover:bg-[#FDF8F5]/80 transition">

                            <input
                                type="checkbox"
                                name="featured"
                                checked={form.featured}
                                onChange={handleChange}
                                className="h-5 w-5 rounded border-[#8B1A1A]/30 text-[#8B1A1A] focus:ring-[#8B1A1A]/30"
                            />

                            <div>

                                <p className="font-bold text-[#2D1B0E]">
                                    Feature this vehicle
                                </p>

                                <p className="text-sm text-[#6A5A4A]">
                                    Featured vehicles appear prominently on the website.
                                </p>

                            </div>

                            <Star
                                size={20}
                                className="ml-auto text-[#8B1A1A]"
                            />

                        </label>

                    </FormSectionRed>


                    {/* =================================================
                        TECHNICAL SPECIFICATIONS
                    ================================================= */}

                    <FormSectionRed
                        icon={<Settings2 size={20} />}
                        title="Technical Specifications"
                        description="Provide detailed mechanical information."
                    >

                        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">

                            <SelectFieldRed
                                label="Fuel Type"
                                name="fuel_type"
                                value={form.fuel_type}
                                onChange={handleChange}
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


                            <SelectFieldRed
                                label="Transmission"
                                name="transmission"
                                value={form.transmission}
                                onChange={handleChange}
                                options={[
                                    {
                                        value: "automatic",
                                        label: "Automatic",
                                    },
                                    {
                                        value: "manual",
                                        label: "Manual",
                                    },
                                    {
                                        value: "cvt",
                                        label: "CVT",
                                    },
                                ]}
                            />


                            <InputFieldRed
                                label="Engine Size"
                                name="engine_size"
                                value={form.engine_size}
                                onChange={handleChange}
                                placeholder="e.g. 4.5L V8"
                            />


                            <InputFieldRed
                                label="Horsepower"
                                name="horsepower"
                                type="number"
                                value={form.horsepower}
                                onChange={handleChange}
                                placeholder="e.g. 286"
                            />


                            <InputFieldRed
                                label="Drivetrain"
                                name="drivetrain"
                                value={form.drivetrain}
                                onChange={handleChange}
                                placeholder="e.g. 4WD"
                            />


                            <InputFieldRed
                                label="Seats"
                                name="seats"
                                type="number"
                                value={form.seats}
                                onChange={handleChange}
                                min="1"
                            />


                            <InputFieldRed
                                label="Doors"
                                name="doors"
                                type="number"
                                value={form.doors}
                                onChange={handleChange}
                                min="1"
                            />

                        </div>

                    </FormSectionRed>


                    {/* =================================================
                        APPEARANCE & LOCATION
                    ================================================= */}

                    <FormSectionRed
                        icon={<Palette size={20} />}
                        title="Appearance & Location"
                        description="Add colors and the vehicle's location."
                    >

                        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">

                            <InputFieldRed
                                label="Exterior Color"
                                name="exterior_color"
                                value={form.exterior_color}
                                onChange={handleChange}
                                placeholder="e.g. Pearl White"
                            />


                            <InputFieldRed
                                label="Interior Color"
                                name="interior_color"
                                value={form.interior_color}
                                onChange={handleChange}
                                placeholder="e.g. Black"
                            />


                            <InputFieldRed
                                label="Location"
                                name="location"
                                value={form.location}
                                onChange={handleChange}
                                placeholder="e.g. Dar es Salaam"
                                icon={<MapPin size={17} />}
                            />

                        </div>

                    </FormSectionRed>


                    {/* =================================================
                        DESCRIPTION
                    ================================================= */}

                    <FormSectionRed
                        icon={<FileText size={20} />}
                        title="Vehicle Description"
                        description="Write a detailed description that customers can read."
                    >

                        <textarea
                            name="description"
                            value={form.description}
                            onChange={handleChange}
                            rows={7}
                            placeholder="Describe the vehicle, its condition, features, service history and anything else customers should know..."
                            className="w-full resize-y rounded-xl border border-[#8B1A1A]/20 bg-[#FDF8F5] px-4 py-3.5 text-sm text-[#2D1B0E] outline-none transition placeholder:text-[#8A7A6A] focus:border-[#8B1A1A] focus:bg-white focus:ring-2 focus:ring-[#8B1A1A]/10"
                        />

                        <p className="mt-2 text-xs text-[#8A7A6A]">
                            {form.description.length} characters
                        </p>

                    </FormSectionRed>


                    {/* =================================================
                        IMAGES
                    ================================================= */}

                    <FormSectionRed
                        icon={<ImagePlus size={20} />}
                        title="Vehicle Photos"
                        description="Upload multiple high-quality images. Select one as the primary image."
                    >

                        <input
                            ref={fileInputRef}
                            type="file"
                            accept="image/*"
                            multiple
                            onChange={handleImageSelect}
                            className="hidden"
                        />


                        {/* UPLOAD BOX */}

                        <button
                            type="button"
                            onClick={() =>
                                fileInputRef.current?.click()
                            }
                            className="group flex w-full flex-col items-center justify-center rounded-2xl border-2 border-dashed border-[#8B1A1A]/20 bg-[#FDF8F5] px-6 py-12 text-center transition hover:border-[#8B1A1A] hover:bg-[#FDF8F5]/80"
                        >

                            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-white border border-[#8B1A1A]/20 text-[#8B1A1A] shadow-sm transition group-hover:scale-105 group-hover:shadow-md">

                                <Upload size={28} />

                            </div>

                            <p className="mt-4 text-lg font-extrabold text-[#2D1B0E]">
                                Click to upload vehicle photos
                            </p>

                            <p className="mt-1 text-sm text-[#6A5A4A]">
                                PNG, JPG or WEBP · Multiple images supported
                            </p>

                        </button>


                        {/* IMAGE PREVIEWS */}

                        {images.length > 0 && (

                            <div className="mt-6">

                                <div className="mb-4 flex items-center justify-between">

                                    <div>

                                        <h3 className="font-extrabold text-[#2D1B0E]">
                                            Selected Photos
                                        </h3>

                                        <p className="text-sm text-[#6A5A4A]">
                                            {images.length} image
                                            {images.length !== 1
                                                ? "s"
                                                : ""} selected
                                        </p>

                                    </div>

                                </div>


                                <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">

                                    {images.map(
                                        (image) => (

                                            <div
                                                key={image.id}
                                                className={`group relative overflow-hidden rounded-2xl border-2 bg-white ${
                                                    image.isPrimary
                                                        ? "border-[#8B1A1A]"
                                                        : "border-[#8B1A1A]/20"
                                                }`}
                                            >

                                                <div className="aspect-[4/3]">

                                                    <img
                                                        src={image.preview}
                                                        alt="Vehicle preview"
                                                        className="h-full w-full object-cover"
                                                    />

                                                </div>


                                                {/* PRIMARY */}

                                                {image.isPrimary && (

                                                    <div className="absolute left-2 top-2 flex items-center gap-1 rounded-full bg-[#8B1A1A] px-2.5 py-1 text-[10px] font-bold text-white shadow">

                                                        <Star
                                                            size={11}
                                                            fill="currentColor"
                                                        />

                                                        PRIMARY

                                                    </div>

                                                )}


                                                {/* REMOVE */}

                                                <button
                                                    type="button"
                                                    onClick={() =>
                                                        removeImage(
                                                            image.id
                                                        )
                                                    }
                                                    className="absolute right-2 top-2 flex h-8 w-8 items-center justify-center rounded-full bg-white/95 text-red-500 shadow transition hover:bg-red-500 hover:text-white"
                                                >

                                                    <X size={16} />

                                                </button>


                                                {/* MAKE PRIMARY */}

                                                {!image.isPrimary && (

                                                    <button
                                                        type="button"
                                                        onClick={() =>
                                                            makePrimary(
                                                                image.id
                                                            )
                                                        }
                                                        className="absolute bottom-2 left-2 rounded-lg bg-white/95 px-2.5 py-1.5 text-[11px] font-bold text-[#2D1B0E] opacity-0 shadow transition group-hover:opacity-100 hover:bg-[#8B1A1A] hover:text-white"
                                                    >

                                                        <span className="flex items-center gap-1">

                                                            <Star size={12} />

                                                            Make Primary

                                                        </span>

                                                    </button>

                                                )}

                                            </div>

                                        )
                                    )}

                                </div>

                            </div>

                        )}

                    </FormSectionRed>


                    {/* =================================================
                        ACTIONS
                    ================================================= */}

                    <div className="sticky bottom-0 z-20 -mx-5 border-t border-[#8B1A1A]/20 bg-white/95 px-5 py-4 backdrop-blur md:-mx-8 md:px-8">

                        <div className="mx-auto flex max-w-7xl flex-col-reverse gap-3 sm:flex-row sm:justify-end">

                            <Link
                                to="/dashboard"
                                className="flex items-center justify-center rounded-xl border border-[#8B1A1A]/20 px-6 py-3.5 font-bold text-[#2D1B0E] transition hover:bg-[#FDF8F5]"
                            >
                                Cancel
                            </Link>


                            <button
                                type="submit"
                                disabled={
                                    saving ||
                                    uploading
                                }
                                className="flex items-center justify-center gap-2 rounded-xl bg-[#8B1A1A] px-7 py-3.5 font-bold text-white shadow-lg shadow-[#8B1A1A]/20 transition hover:bg-[#6B1515] hover:shadow-xl hover:shadow-[#8B1A1A]/30 disabled:cursor-not-allowed disabled:opacity-60"
                            >

                                {saving || uploading ? (

                                    <>
                                        <Loader2
                                            size={18}
                                            className="animate-spin"
                                        />

                                        {uploading
                                            ? "Uploading photos..."
                                            : "Creating vehicle..."
                                        }

                                    </>

                                ) : (

                                    <>
                                        <CheckCircle2 size={18} />

                                        Save Vehicle
                                    </>

                                )}

                            </button>

                        </div>

                    </div>

                </form>

            </main>

        </AdminLayout>

    );
}


// =========================================================
// FORM SECTION - REDISH
// =========================================================

function FormSectionRed({
    icon,
    title,
    description,
    children,
}) {

    return (

        <section className="overflow-hidden rounded-2xl border border-[#8B1A1A]/20 bg-white shadow-[0_8px_30px_rgba(139,26,26,0.06)]">

            <div className="border-b border-[#8B1A1A]/10 px-5 py-5 md:px-7">

                <div className="flex items-start gap-3">

                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#8B1A1A]/10 text-[#8B1A1A]">

                        {icon}

                    </div>

                    <div>

                        <h2 className="text-lg font-extrabold text-[#2D1B0E]">
                            {title}
                        </h2>

                        <p className="mt-1 text-sm text-[#6A5A4A]">
                            {description}
                        </p>

                    </div>

                </div>

            </div>


            <div className="p-5 md:p-7">

                {children}

            </div>

        </section>

    );

}



// INPUT - REDISH

function InputFieldRed({
    label,
    name,
    type = "text",
    value,
    onChange,
    placeholder,
    required = false,
    min,
    max,
    icon,
}) {

    return (

        <div>

            <label className="mb-2 block text-sm font-bold text-[#2D1B0E]">

                {label}

                {required && (
                    <span className="ml-1 text-red-500">
                        *
                    </span>
                )}

            </label>


            <div className="relative">

                {icon && (

                    <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[#8B1A1A]">

                        {icon}

                    </span>

                )}


                <input
                    type={type}
                    name={name}
                    value={value}
                    onChange={onChange}
                    placeholder={placeholder}
                    required={required}
                    min={min}
                    max={max}
                    className={`w-full rounded-xl border border-[#8B1A1A]/20 bg-[#FDF8F5] px-4 py-3.5 text-sm text-[#2D1B0E] outline-none transition placeholder:text-[#8A7A6A] focus:border-[#8B1A1A] focus:bg-white focus:ring-2 focus:ring-[#8B1A1A]/10 ${
                        icon ? "pl-10" : ""
                    }`}
                />

            </div>

        </div>

    );

}


// =========================================================
// SELECT - REDISH
// =========================================================

function SelectFieldRed({
    label,
    name,
    value,
    onChange,
    options,
    placeholder = "Select",
    required = false,
}) {

    return (

        <div>

            <label className="mb-2 block text-sm font-bold text-[#2D1B0E]">

                {label}

                {required && (
                    <span className="ml-1 text-red-500">
                        *
                    </span>
                )}

            </label>


            <select
                name={name}
                value={value}
                onChange={onChange}
                required={required}
                className="w-full rounded-xl border border-[#8B1A1A]/20 bg-[#FDF8F5] px-4 py-3.5 text-sm text-[#2D1B0E] outline-none transition focus:border-[#8B1A1A] focus:bg-white focus:ring-2 focus:ring-[#8B1A1A]/10"
            >

                <option value="">
                    {placeholder}
                </option>

                {options.map((option) => (

                    <option
                        key={option.value}
                        value={option.value}
                    >
                        {option.label}
                    </option>

                ))}

            </select>

        </div>

    );

}


export default AddVehicle;