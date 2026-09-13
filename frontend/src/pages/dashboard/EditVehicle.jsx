import { useEffect, useState } from "react";
import AdminLayout from "../../layouts/AdminLayout";
import {
    ArrowLeft,
    Save,
    Upload,
    Trash2,
    Star,
    ImagePlus,
    X,
    Loader2,
    CheckCircle2,
} from "lucide-react";

import { Link, useNavigate, useParams } from "react-router-dom";

import {
    getVehicle,
    getBrands,
    getCategories,
    updateVehicle,
    uploadVehicleImages,
    setPrimaryImage,
    deleteVehicleImage,
} from "../../services/vehicleService";


function EditVehicle() {

    const { id } = useParams();
    const navigate = useNavigate();


    // =========================================================
    // VEHICLE
    // =========================================================

    const [vehicle, setVehicle] = useState(null);
    const [brands, setBrands] = useState([]);
    const [categories, setCategories] = useState([]);


    // =========================================================
    // FORM
    // =========================================================

    const [form, setForm] = useState({
        brand: "",
        category: "",
        model: "",
        variant: "",
        year: "",
        price: "",
        mileage: "",
        condition: "used",
        status: "available",
        fuel_type: "",
        transmission: "",
        engine_size: "",
        horsepower: "",
        drivetrain: "",
        seats: 5,
        doors: 4,
        exterior_color: "",
        interior_color: "",
        location: "",
        featured: false,
        description: "",
    });


    // =========================================================
    // STATES
    // =========================================================

    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [deletingImage, setDeletingImage] = useState(null);
    const [settingPrimary, setSettingPrimary] = useState(null);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");


    // =========================================================
    // NEW IMAGES
    // =========================================================

    const [newImages, setNewImages] = useState([]);


    // =========================================================
    // LOAD VEHICLE
    // =========================================================

    useEffect(() => {

        const loadData = async () => {

            try {

                setLoading(true);
                setError("");

                const [
                    vehicleData,
                    brandsData,
                    categoriesData,
                ] = await Promise.all([
                    getVehicle(id),
                    getBrands(),
                    getCategories(),
                ]);

                setVehicle(vehicleData);
                setBrands(brandsData);
                setCategories(categoriesData);

                setForm({
                    brand: vehicleData.brand || "",
                    category: vehicleData.category || "",
                    model: vehicleData.model || "",
                    variant: vehicleData.variant || "",
                    year: vehicleData.year || "",
                    price: vehicleData.price || "",
                    mileage: vehicleData.mileage || "",
                    condition: vehicleData.condition || "used",
                    status: vehicleData.status || "available",
                    fuel_type: vehicleData.fuel_type || "",
                    transmission: vehicleData.transmission || "",
                    engine_size: vehicleData.engine_size || "",
                    horsepower: vehicleData.horsepower || "",
                    drivetrain: vehicleData.drivetrain || "",
                    seats: vehicleData.seats || 5,
                    doors: vehicleData.doors || 4,
                    exterior_color: vehicleData.exterior_color || "",
                    interior_color: vehicleData.interior_color || "",
                    location: vehicleData.location || "",
                    featured: vehicleData.featured || false,
                    description: vehicleData.description || "",
                });

            } catch (err) {

                console.error(err);
                setError(
                    err.response?.data?.detail ||
                    err.message ||
                    "Failed to load vehicle."
                );

            } finally {

                setLoading(false);

            }

        };

        loadData();

    }, [id]);


    // =========================================================
    // HANDLE INPUT
    // =========================================================

    const handleChange = (event) => {

        const { name, value, type, checked } = event.target;

        setForm(previous => ({
            ...previous,
            [name]: type === "checkbox" ? checked : value,
        }));

    };


    // =========================================================
    // SAVE VEHICLE
    // =========================================================

    const handleSubmit = async (event) => {

        event.preventDefault();

        try {

            setSaving(true);
            setError("");
            setSuccess("");

            const data = {
                ...form,
                year: Number(form.year),
                price: Number(form.price),
                mileage: Number(form.mileage),
                horsepower: form.horsepower ? Number(form.horsepower) : null,
                seats: Number(form.seats),
                doors: Number(form.doors),
            };

            const updated = await updateVehicle(id, data);

            setVehicle(previous => ({
                ...previous,
                ...updated,
            }));

            setSuccess("Vehicle updated successfully.");

            window.scrollTo({
                top: 0,
                behavior: "smooth",
            });

        } catch (err) {

            console.error(err);
            setError(
                err.response?.data ||
                err.message ||
                "Failed to update vehicle."
            );

        } finally {

            setSaving(false);

        }

    };


    // =========================================================
    // SELECT NEW IMAGES
    // =========================================================

    const handleImageSelect = (event) => {

        const files = Array.from(event.target.files);

        if (!files.length) {
            return;
        }

        const images = files.map(file => ({
            file,
            preview: URL.createObjectURL(file),
        }));

        setNewImages(previous => [...previous, ...images]);

        event.target.value = "";

    };


    // =========================================================
    // REMOVE NEW IMAGE
    // =========================================================

    const removeNewImage = (index) => {

        setNewImages(previous => previous.filter((_, i) => i !== index));

    };


    // =========================================================
    // UPLOAD NEW IMAGES
    // =========================================================

    const handleUploadImages = async () => {

        if (!newImages.length) {
            return;
        }

        try {

            setUploading(true);
            setError("");
            setSuccess("");

            const files = newImages.map(image => image.file);

            await uploadVehicleImages(id, files);

            const refreshed = await getVehicle(id);

            setVehicle(refreshed);
            setNewImages([]);
            setSuccess("Images uploaded successfully.");

        } catch (err) {

            console.error(err);
            setError(
                err.response?.data ||
                err.message ||
                "Failed to upload images."
            );

        } finally {

            setUploading(false);

        }

    };


    // =========================================================
    // SET PRIMARY IMAGE
    // =========================================================

    const handleSetPrimary = async (imageId) => {

        try {

            setSettingPrimary(imageId);
            setError("");
            setSuccess("");

            await setPrimaryImage(id, imageId);

            const refreshed = await getVehicle(id);

            setVehicle(refreshed);
            setSuccess("Primary image updated.");

        } catch (err) {

            console.error(err);
            setError(
                err.response?.data ||
                err.message ||
                "Failed to set primary image."
            );

        } finally {

            setSettingPrimary(null);

        }

    };


    // =========================================================
    // DELETE IMAGE
    // =========================================================

    const handleDeleteImage = async (imageId) => {

        const confirmed = window.confirm(
            "Are you sure you want to delete this image?"
        );

        if (!confirmed) {
            return;
        }

        try {

            setDeletingImage(imageId);
            setError("");
            setSuccess("");

            await deleteVehicleImage(id, imageId);

            const refreshed = await getVehicle(id);

            setVehicle(refreshed);
            setSuccess("Image deleted successfully.");

        } catch (err) {

            console.error(err);
            setError(
                err.response?.data ||
                err.message ||
                "Failed to delete image."
            );

        } finally {

            setDeletingImage(null);

        }

    };


    // =========================================================
    // IMAGE URL
    // =========================================================

    const getImageUrl = (image) => {

        if (!image?.image) {
            return "";
        }

        if (image.image.startsWith("http")) {
            return image.image;
        }

        return `http://127.0.0.1:8000${image.image}`;

    };


    // =========================================================
    // LOADING
    // =========================================================

    if (loading) {

        return (

            <div className="flex min-h-screen items-center justify-center bg-[#FDF8F5]">

                <div className="flex items-center gap-3 text-[#2D1B0E]">

                    <Loader2
                        size={25}
                        className="animate-spin text-[#8B1A1A]"
                    />

                    <span className="font-bold">
                        Loading vehicle...
                    </span>

                </div>

            </div>

        );

    }


    // =========================================================
    // ERROR WITHOUT VEHICLE
    // =========================================================

    if (!vehicle) {

        return (

            <div className="flex min-h-screen items-center justify-center bg-[#FDF8F5] p-5">

                <div className="rounded-2xl border border-red-100 bg-white p-8 text-center shadow-sm">

                    <h2 className="text-xl font-extrabold text-[#2D1B0E]">
                        Vehicle not found
                    </h2>

                    <p className="mt-2 text-sm text-red-500">
                        {error}
                    </p>

                    <Link
                        to="/admin/vehicles"
                        className="mt-6 inline-flex rounded-xl bg-[#8B1A1A] px-5 py-3 font-bold text-white shadow-lg shadow-[#8B1A1A]/20 transition hover:bg-[#6B1515]"
                    >
                        Back to Vehicles
                    </Link>

                </div>

            </div>

        );

    }


    return (

        <AdminLayout>

           
            <header className="border-b border-[#8B1A1A]/20 bg-white">

                <div className="mx-auto max-w-7xl px-5 py-6 md:px-8">

                    <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">

                        <div>

                            <Link
                                to="/admin/vehicles"
                                className="mb-3 inline-flex items-center gap-2 text-sm font-bold text-[#8B1A1A] hover:text-[#6B1515]"
                            >

                                <ArrowLeft
                                    size={17}
                                />

                                Back to Inventory

                            </Link>


                            <p className="text-sm font-bold uppercase tracking-[0.2em] text-[#8B1A1A]">
                                Bingwa Magari Admin
                            </p>

                            <h1 className="mt-1 text-3xl font-extrabold text-[#2D1B0E]">
                                Edit Vehicle
                            </h1>

                            <p className="mt-1 text-sm text-[#6A5A4A]">

                                {vehicle.brand_name}{" "}
                                {vehicle.model}

                            </p>

                        </div>

                    </div>

                </div>

            </header>


          
            <main className="mx-auto max-w-7xl px-5 py-8 md:px-8">


               
                {success && (

                    <div className="mb-6 flex items-center gap-3 rounded-xl border border-green-100 bg-green-50 p-4 text-sm font-semibold text-green-600">

                        <CheckCircle2
                            size={20}
                        />

                        {success}

                        <button
                            onClick={() => setSuccess("")}
                            className="ml-auto"
                        >

                            <X size={17} />

                        </button>

                    </div>

                )}


                {error && (

                    <div className="mb-6 rounded-xl border border-red-100 bg-red-50 p-4 text-sm font-semibold text-red-600">

                        {typeof error === "object"
                            ? JSON.stringify(error)
                            : error}

                    </div>

                )}


                <form onSubmit={handleSubmit}>



                    <section className="rounded-2xl border border-[#8B1A1A]/20 bg-white p-6 shadow-sm">

                        <SectionTitleRed
                            title="Vehicle Information"
                            description="Basic information about the vehicle."
                        />


                        <div className="mt-6 grid gap-5 md:grid-cols-2">


                            <FormSelectRed
                                label="Brand"
                                name="brand"
                                value={form.brand}
                                onChange={handleChange}
                                options={brands}
                                required
                            />


                            <FormSelectRed
                                label="Category"
                                name="category"
                                value={form.category}
                                onChange={handleChange}
                                options={categories}
                                required
                            />


                            <FormInputRed
                                label="Model"
                                name="model"
                                value={form.model}
                                onChange={handleChange}
                                required
                            />


                            <FormInputRed
                                label="Variant"
                                name="variant"
                                value={form.variant}
                                onChange={handleChange}
                            />


                            <FormInputRed
                                label="Year"
                                name="year"
                                type="number"
                                value={form.year}
                                onChange={handleChange}
                                required
                            />


                            <FormInputRed
                                label="Price"
                                name="price"
                                type="number"
                                value={form.price}
                                onChange={handleChange}
                                required
                            />


                            <FormInputRed
                                label="Mileage"
                                name="mileage"
                                type="number"
                                value={form.mileage}
                                onChange={handleChange}
                            />


                            <FormInputRed
                                label="Location"
                                name="location"
                                value={form.location}
                                onChange={handleChange}
                            />

                        </div>

                    </section>


                    

                    <section className="mt-6 rounded-2xl border border-[#8B1A1A]/20 bg-white p-6 shadow-sm">

                        <SectionTitleRed
                            title="Mechanical Details"
                            description="Engine, fuel and transmission information."
                        />


                        <div className="mt-6 grid gap-5 md:grid-cols-2 lg:grid-cols-3">


                            <FormSelectRed
                                label="Condition"
                                name="condition"
                                value={form.condition}
                                onChange={handleChange}
                                options={[
                                    { id: "new", name: "New" },
                                    { id: "used", name: "Used" },
                                    { id: "certified", name: "Certified Pre-Owned" },
                                ]}
                            />


                            <FormSelectRed
                                label="Status"
                                name="status"
                                value={form.status}
                                onChange={handleChange}
                                options={[
                                    { id: "available", name: "Available" },
                                    { id: "reserved", name: "Reserved" },
                                    { id: "sold", name: "Sold" },
                                    { id: "draft", name: "Draft" },
                                    { id: "archived", name: "Archived" },
                                ]}
                            />


                            <FormSelectRed
                                label="Fuel Type"
                                name="fuel_type"
                                value={form.fuel_type}
                                onChange={handleChange}
                                options={[
                                    { id: "petrol", name: "Petrol" },
                                    { id: "diesel", name: "Diesel" },
                                    { id: "hybrid", name: "Hybrid" },
                                    { id: "electric", name: "Electric" },
                                ]}
                            />


                            <FormSelectRed
                                label="Transmission"
                                name="transmission"
                                value={form.transmission}
                                onChange={handleChange}
                                options={[
                                    { id: "automatic", name: "Automatic" },
                                    { id: "manual", name: "Manual" },
                                    { id: "cvt", name: "CVT" },
                                ]}
                            />


                            <FormInputRed
                                label="Engine Size"
                                name="engine_size"
                                value={form.engine_size}
                                onChange={handleChange}
                                placeholder="e.g. 3.5L"
                            />


                            <FormInputRed
                                label="Horsepower"
                                name="horsepower"
                                type="number"
                                value={form.horsepower}
                                onChange={handleChange}
                            />


                            <FormInputRed
                                label="Drivetrain"
                                name="drivetrain"
                                value={form.drivetrain}
                                onChange={handleChange}
                                placeholder="e.g. 4WD"
                            />


                            <FormInputRed
                                label="Seats"
                                name="seats"
                                type="number"
                                value={form.seats}
                                onChange={handleChange}
                            />


                            <FormInputRed
                                label="Doors"
                                name="doors"
                                type="number"
                                value={form.doors}
                                onChange={handleChange}
                            />

                        </div>

                    </section>


                    
                    <section className="mt-6 rounded-2xl border border-[#8B1A1A]/20 bg-white p-6 shadow-sm">

                        <SectionTitleRed
                            title="Appearance"
                            description="Exterior and interior colors."
                        />


                        <div className="mt-6 grid gap-5 md:grid-cols-2">

                            <FormInputRed
                                label="Exterior Color"
                                name="exterior_color"
                                value={form.exterior_color}
                                onChange={handleChange}
                            />


                            <FormInputRed
                                label="Interior Color"
                                name="interior_color"
                                value={form.interior_color}
                                onChange={handleChange}
                            />

                        </div>

                    </section>


                   

                    <section className="mt-6 rounded-2xl border border-[#8B1A1A]/20 bg-white p-6 shadow-sm">

                        <SectionTitleRed
                            title="Description"
                            description="Give customers more information about this vehicle."
                        />


                        <textarea
                            name="description"
                            value={form.description}
                            onChange={handleChange}
                            rows={7}
                            className="mt-6 w-full rounded-xl border border-[#8B1A1A]/20 bg-[#FDF8F5] px-4 py-3 text-sm outline-none transition focus:border-[#8B1A1A] focus:ring-4 focus:ring-[#8B1A1A]/10"
                            placeholder="Describe the vehicle..."
                            required
                        />

                    </section>


                   

                    <section className="mt-6 rounded-2xl border border-[#8B1A1A]/20 bg-white p-6 shadow-sm">

                        <label className="flex cursor-pointer items-center justify-between gap-5">

                            <div>

                                <p className="font-extrabold text-[#2D1B0E]">
                                    Featured Vehicle
                                </p>

                                <p className="mt-1 text-sm text-[#6A5A4A]">
                                    Display this vehicle prominently on the homepage.
                                </p>

                            </div>


                            <input
                                type="checkbox"
                                name="featured"
                                checked={form.featured}
                                onChange={handleChange}
                                className="h-5 w-5 accent-[#8B1A1A]"
                            />

                        </label>

                    </section>



                    <section className="mt-6 rounded-2xl border border-[#8B1A1A]/20 bg-white p-6 shadow-sm">

                        <SectionTitleRed
                            title="Vehicle Images"
                            description="Manage existing vehicle images."
                        />


                        {vehicle.images?.length ? (

                            <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">

                                {vehicle.images.map(image => (

                                    <div
                                        key={image.id}
                                        className="group relative overflow-hidden rounded-2xl border border-[#8B1A1A]/20 bg-[#FDF8F5]"
                                    >

                                        <div className="aspect-[4/3]">

                                            <img
                                                src={getImageUrl(image)}
                                                alt="Vehicle"
                                                className="h-full w-full object-cover"
                                            />

                                        </div>


                                        {image.is_primary && (

                                            <div className="absolute left-3 top-3 flex items-center gap-1 rounded-full bg-[#8B1A1A] px-3 py-1.5 text-xs font-bold text-white">

                                                <Star
                                                    size={13}
                                                    className="fill-current"
                                                />

                                                Primary

                                            </div>

                                        )}


                                        <div className="absolute inset-x-0 bottom-0 flex gap-2 bg-gradient-to-t from-black/70 to-transparent p-3 pt-10">

                                            {!image.is_primary && (

                                                <button
                                                    type="button"
                                                    disabled={settingPrimary === image.id}
                                                    onClick={() => handleSetPrimary(image.id)}
                                                    className="flex flex-1 items-center justify-center gap-1.5 rounded-lg bg-white px-3 py-2 text-xs font-bold text-[#2D1B0E] transition hover:bg-[#FDF8F5] disabled:opacity-50"
                                                >

                                                    {settingPrimary === image.id ? (

                                                        <Loader2
                                                            size={14}
                                                            className="animate-spin"
                                                        />

                                                    ) : (

                                                        <Star size={14} />

                                                    )}

                                                    Primary

                                                </button>

                                            )}


                                            <button
                                                type="button"
                                                disabled={deletingImage === image.id}
                                                onClick={() => handleDeleteImage(image.id)}
                                                className="flex h-9 w-9 items-center justify-center rounded-lg bg-red-500 text-white transition hover:bg-red-600 disabled:opacity-50"
                                            >

                                                {deletingImage === image.id ? (

                                                    <Loader2
                                                        size={15}
                                                        className="animate-spin"
                                                    />

                                                ) : (

                                                    <Trash2 size={15} />

                                                )}

                                            </button>

                                        </div>

                                    </div>

                                ))}

                            </div>

                        ) : (

                            <div className="mt-6 rounded-xl border border-dashed border-[#8B1A1A]/20 bg-[#FDF8F5] py-12 text-center">

                                <ImagePlus
                                    size={35}
                                    className="mx-auto text-[#8B1A1A]"
                                />

                                <p className="mt-3 font-bold text-[#2D1B0E]">
                                    No images uploaded
                                </p>

                                <p className="mt-1 text-sm text-[#6A5A4A]">
                                    Upload images below.
                                </p>

                            </div>

                        )}

                    </section>



                    <section className="mt-6 rounded-2xl border border-[#8B1A1A]/20 bg-white p-6 shadow-sm">

                        <SectionTitleRed
                            title="Add More Images"
                            description="Upload additional photos of the vehicle."
                        />


                        <label className="mt-6 flex cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed border-[#8B1A1A]/20 bg-[#FDF8F5] px-5 py-12 text-center transition hover:border-[#8B1A1A] hover:bg-[#FDF8F5]/80">

                            <Upload
                                size={35}
                                className="text-[#8B1A1A]"
                            />

                            <p className="mt-4 font-extrabold text-[#2D1B0E]">
                                Click to select images
                            </p>

                            <p className="mt-1 text-sm text-[#6A5A4A]">
                                JPG, PNG or WEBP
                            </p>


                            <input
                                type="file"
                                accept="image/*"
                                multiple
                                onChange={handleImageSelect}
                                className="hidden"
                            />

                        </label>


                        {/* PREVIEWS */}

                        {newImages.length > 0 && (

                            <>

                                <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">

                                    {newImages.map((image, index) => (

                                        <div
                                            key={index}
                                            className="relative overflow-hidden rounded-xl border border-[#8B1A1A]/20"
                                        >

                                            <img
                                                src={image.preview}
                                                alt="Preview"
                                                className="aspect-[4/3] w-full object-cover"
                                            />


                                            <button
                                                type="button"
                                                onClick={() => removeNewImage(index)}
                                                className="absolute right-2 top-2 flex h-8 w-8 items-center justify-center rounded-full bg-red-500 text-white shadow-lg hover:bg-red-600"
                                            >

                                                <X size={15} />

                                            </button>

                                        </div>

                                    ))}

                                </div>


                                <button
                                    type="button"
                                    onClick={handleUploadImages}
                                    disabled={uploading}
                                    className="mt-5 inline-flex items-center gap-2 rounded-xl bg-[#8B1A1A] px-5 py-3 font-bold text-white shadow-lg shadow-[#8B1A1A]/20 transition hover:bg-[#6B1515] hover:shadow-xl hover:shadow-[#8B1A1A]/30 disabled:cursor-not-allowed disabled:opacity-50"
                                >

                                    {uploading ? (

                                        <Loader2
                                            size={18}
                                            className="animate-spin"
                                        />

                                    ) : (

                                        <Upload size={18} />

                                    )}

                                    {uploading
                                        ? "Uploading..."
                                        : `Upload ${newImages.length} Image${newImages.length === 1 ? "" : "s"}`}

                                </button>

                            </>

                        )}

                    </section>


                  

                    <div className="mt-8 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">

                        <Link
                            to="/admin/vehicles"
                            className="inline-flex items-center justify-center rounded-xl border border-[#8B1A1A]/20 bg-white px-6 py-3.5 font-bold text-[#2D1B0E] transition hover:bg-[#FDF8F5]"
                        >
                            Cancel
                        </Link>


                        <button
                            type="submit"
                            disabled={saving}
                            className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#8B1A1A] px-7 py-3.5 font-bold text-white shadow-lg shadow-[#8B1A1A]/20 transition hover:bg-[#6B1515] hover:shadow-xl hover:shadow-[#8B1A1A]/30 disabled:cursor-not-allowed disabled:opacity-50"
                        >

                            {saving ? (

                                <Loader2
                                    size={19}
                                    className="animate-spin"
                                />

                            ) : (

                                <Save size={19} />

                            )}

                            {saving ? "Saving..." : "Save Changes"}

                        </button>

                    </div>


                </form>

            </main>

        </AdminLayout>

    );

}


// ============================================================
// SECTION TITLE - DEEP REDISH
// ============================================================

function SectionTitleRed({
    title,
    description,
}) {

    return (

        <div>

            <h2 className="text-xl font-extrabold text-[#2D1B0E]">
                {title}
            </h2>

            <p className="mt-1 text-sm text-[#6A5A4A]">
                {description}
            </p>

        </div>

    );

}


// ============================================================
// INPUT - DEEP REDISH
// ============================================================

function FormInputRed({
    label,
    name,
    type = "text",
    value,
    onChange,
    placeholder,
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


            <input
                name={name}
                type={type}
                value={value}
                onChange={onChange}
                placeholder={placeholder}
                required={required}
                className="w-full rounded-xl border border-[#8B1A1A]/20 bg-[#FDF8F5] px-4 py-3 text-sm outline-none transition focus:border-[#8B1A1A] focus:ring-4 focus:ring-[#8B1A1A]/10"
            />

        </div>

    );

}


// ============================================================
// SELECT - DEEP REDISH
// ============================================================

function FormSelectRed({
    label,
    name,
    value,
    onChange,
    options,
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
                className="w-full rounded-xl border border-[#8B1A1A]/20 bg-[#FDF8F5] px-4 py-3 text-sm outline-none transition focus:border-[#8B1A1A] focus:ring-4 focus:ring-[#8B1A1A]/10"
            >

                <option value="">
                    Select {label}
                </option>

                {options.map(option => (

                    <option key={option.id} value={option.id}>
                        {option.name}
                    </option>

                ))}

            </select>

        </div>

    );

}


export default EditVehicle;