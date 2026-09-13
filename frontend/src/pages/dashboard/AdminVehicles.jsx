import { useEffect, useMemo, useState } from "react";
import AdminLayout from "../../layouts/AdminLayout";
import {
    Search,
    Plus,
    Pencil,
    Trash2,
    Star,
    CarFront,
    CheckCircle2,
    CircleDollarSign,
    X,
    RefreshCw,
    Eye,
} from "lucide-react";

import {
    getVehicles,
    deleteVehicle,
    updateVehicle,
} from "../../services/vehicleService";

import { Link } from "react-router-dom";


function AdminVehicles() {

    const [vehicles, setVehicles] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [search, setSearch] = useState("");
    const [status, setStatus] = useState("");
    const [condition, setCondition] = useState("");
    const [featured, setFeatured] = useState("");
    const [deleteTarget, setDeleteTarget] = useState(null);
    const [deleting, setDeleting] = useState(false);
    const [updatingFeatured, setUpdatingFeatured] = useState(null);


    // =========================================================
    // LOAD VEHICLES
    // =========================================================

    const loadVehicles = async () => {

        try {

            setLoading(true);
            setError("");

            const params = new URLSearchParams();

            if (search) {
                params.append("search", search);
            }

            if (status) {
                params.append("status", status);
            }

            if (condition) {
                params.append("condition", condition);
            }

            if (featured) {
                params.append("featured", featured);
            }

            const query = params.toString() ? `?${params.toString()}` : "";

            const data = await getVehicles(query);

            setVehicles(
                Array.isArray(data) ? data : data.results || []
            );

        } catch (err) {

            console.error("Failed to load vehicles:", err);
            setError(
                err.response?.data?.detail ||
                err.message ||
                "Failed to load vehicles."
            );

        } finally {

            setLoading(false);

        }

    };


    // =========================================================
    // FILTER LOAD
    // =========================================================

    useEffect(() => {

        loadVehicles();

    }, [status, condition, featured]);


    // =========================================================
    // SEARCH DEBOUNCE
    // =========================================================

    useEffect(() => {

        const timer = setTimeout(() => {
            loadVehicles();
        }, 400);

        return () => clearTimeout(timer);

    }, [search]);


    // =========================================================
    // STATISTICS
    // =========================================================

    const statistics = useMemo(() => {

        return {
            total: vehicles.length,
            available: vehicles.filter(vehicle => vehicle.status === "available").length,
            sold: vehicles.filter(vehicle => vehicle.status === "sold").length,
            featured: vehicles.filter(vehicle => vehicle.featured).length,
        };

    }, [vehicles]);


    // =========================================================
    // DELETE VEHICLE
    // =========================================================

    const handleDelete = async () => {

        if (!deleteTarget) {
            return;
        }

        try {

            setDeleting(true);
            await deleteVehicle(deleteTarget.id);
            setVehicles(previous => previous.filter(vehicle => vehicle.id !== deleteTarget.id));
            setDeleteTarget(null);

        } catch (err) {

            console.error(err);
            alert(
                err.response?.data?.detail ||
                err.message ||
                "Failed to delete vehicle."
            );

        } finally {

            setDeleting(false);

        }

    };


    // =========================================================
    // TOGGLE FEATURED
    // =========================================================

    const handleFeatured = async (vehicle) => {

        try {

            setUpdatingFeatured(vehicle.id);

            const updated = await updateVehicle(vehicle.id, {
                featured: !vehicle.featured
            });

            setVehicles(previous =>
                previous.map(item =>
                    item.id === vehicle.id
                        ? { ...item, featured: updated.featured }
                        : item
                )
            );

        } catch (err) {

            console.error(err);
            alert(
                err.response?.data?.detail ||
                err.message ||
                "Failed to update vehicle."
            );

        } finally {

            setUpdatingFeatured(null);

        }

    };


    // =========================================================
    // FORMAT PRICE
    // =========================================================

    const formatPrice = (price) => {

        return Number(price || 0).toLocaleString();

    };


    // =========================================================
    // PRIMARY IMAGE
    // =========================================================

    const getPrimaryImage = (vehicle) => {

        const primary = vehicle.images?.find(image => image.is_primary);
        const first = primary || vehicle.images?.[0];

        if (!first?.image) {
            return null;
        }

        if (first.image.startsWith("http")) {
            return first.image;
        }

        return `http://127.0.0.1:8000${first.image}`;

    };


    return (

        <AdminLayout>


            <header className="border-b border-[#8B1A1A]/20 bg-white">

                <div className="mx-auto max-w-7xl px-5 py-6 md:px-8">

                    <div className="flex flex-col justify-between gap-5 md:flex-row md:items-center">

                        <div>

                            <p className="text-sm font-bold uppercase tracking-[0.2em] text-[#8B1A1A]">
                                Bingwa Magari Admin
                            </p>

                            <h1 className="mt-1 text-3xl font-extrabold text-[#2D1B0E]">
                                Vehicle Inventory
                            </h1>

                            <p className="mt-1 text-sm text-[#6A5A4A]">
                                Manage your dealership inventory.
                            </p>

                        </div>


                        <Link
                            to="/admin/vehicles/new"
                            className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#8B1A1A] px-5 py-3.5 font-bold text-white shadow-lg shadow-[#8B1A1A]/20 transition hover:bg-[#6B1515] hover:shadow-xl hover:shadow-[#8B1A1A]/30"
                        >

                            <Plus size={19} />

                            Add New Vehicle

                        </Link>

                    </div>

                </div>

            </header>



            <main className="mx-auto max-w-7xl px-5 py-8 md:px-8">



                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">

                    <StatCardRed
                        title="Total Vehicles"
                        value={statistics.total}
                        icon={CarFront}
                    />

                    <StatCardRed
                        title="Available"
                        value={statistics.available}
                        icon={CheckCircle2}
                    />

                    <StatCardRed
                        title="Sold"
                        value={statistics.sold}
                        icon={CircleDollarSign}
                    />

                    <StatCardRed
                        title="Featured"
                        value={statistics.featured}
                        icon={Star}
                    />

                </div>



                <div className="mt-8 rounded-2xl border border-[#8B1A1A]/20 bg-white p-5 shadow-sm">

                    <div className="flex flex-col gap-4 lg:flex-row">


                        {/* SEARCH */}

                        <div className="relative flex-1">

                            <Search
                                size={18}
                                className="absolute left-4 top-1/2 -translate-y-1/2 text-[#8B1A1A]"
                            />

                            <input
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                placeholder="Search by brand, model or variant..."
                                className="w-full rounded-xl border border-[#8B1A1A]/20 bg-[#FDF8F5] py-3.5 pl-11 pr-4 text-sm outline-none transition focus:border-[#8B1A1A] focus:ring-4 focus:ring-[#8B1A1A]/10"
                            />

                        </div>


                        {/* STATUS */}

                        <select
                            value={status}
                            onChange={(e) => setStatus(e.target.value)}
                            className="rounded-xl border border-[#8B1A1A]/20 bg-[#FDF8F5] px-4 py-3.5 text-sm font-semibold text-[#2D1B0E] outline-none focus:border-[#8B1A1A]"
                        >

                            <option value="">All Status</option>
                            <option value="available">Available</option>
                            <option value="reserved">Reserved</option>
                            <option value="sold">Sold</option>
                            <option value="draft">Draft</option>
                            <option value="archived">Archived</option>

                        </select>


                        {/* CONDITION */}

                        <select
                            value={condition}
                            onChange={(e) => setCondition(e.target.value)}
                            className="rounded-xl border border-[#8B1A1A]/20 bg-[#FDF8F5] px-4 py-3.5 text-sm font-semibold text-[#2D1B0E] outline-none focus:border-[#8B1A1A]"
                        >

                            <option value="">All Conditions</option>
                            <option value="new">New</option>
                            <option value="used">Used</option>
                            <option value="certified">Certified</option>

                        </select>


                        {/* FEATURED */}

                        <select
                            value={featured}
                            onChange={(e) => setFeatured(e.target.value)}
                            className="rounded-xl border border-[#8B1A1A]/20 bg-[#FDF8F5] px-4 py-3.5 text-sm font-semibold text-[#2D1B0E] outline-none focus:border-[#8B1A1A]"
                        >

                            <option value="">All Vehicles</option>
                            <option value="true">Featured Only</option>

                        </select>


                        {/* REFRESH */}

                        <button
                            onClick={loadVehicles}
                            className="flex items-center justify-center rounded-xl border border-[#8B1A1A]/20 px-4 py-3.5 text-[#2D1B0E] transition hover:bg-[#FDF8F5]"
                            title="Refresh"
                        >

                            <RefreshCw size={18} />

                        </button>

                    </div>

                </div>



                {error && (

                    <div className="mt-6 rounded-xl border border-red-100 bg-red-50 p-4 text-sm font-semibold text-red-600">

                        {error}

                    </div>

                )}


             
                <div className="mt-6 overflow-hidden rounded-2xl border border-[#8B1A1A]/20 bg-white shadow-sm">


                    {/* TABLE HEADER */}

                    <div className="hidden grid-cols-[90px_1fr_150px_130px_130px_130px] gap-4 border-b border-[#8B1A1A]/10 bg-[#FDF8F5] px-5 py-4 text-xs font-extrabold uppercase tracking-wider text-[#8A7A6A] lg:grid">

                        <span>Photo</span>
                        <span>Vehicle</span>
                        <span>Price</span>
                        <span>Status</span>
                        <span>Featured</span>
                        <span>Action</span>

                    </div>


                    {/* LOADING */}

                    {loading && (

                        <div className="space-y-3 p-5">

                            {[1, 2, 3, 4].map(item => (

                                <div
                                    key={item}
                                    className="h-24 animate-pulse rounded-xl bg-[#FDF8F5] border border-[#8B1A1A]/10"
                                />

                            ))}

                        </div>

                    )}


                    {/* EMPTY */}

                    {!loading && vehicles.length === 0 && (

                        <div className="px-5 py-20 text-center">

                            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-[#8B1A1A]/10">

                                <CarFront size={28} className="text-[#8B1A1A]" />

                            </div>

                            <h3 className="mt-5 text-xl font-extrabold text-[#2D1B0E]">
                                No vehicles found
                            </h3>

                            <p className="mt-2 text-sm text-[#6A5A4A]">
                                Try changing your filters or add a new vehicle.
                            </p>

                        </div>

                    )}


                    {/* VEHICLES */}

                    {!loading && vehicles.map(vehicle => {

                        const image = getPrimaryImage(vehicle);

                        return (

                            <div
                                key={vehicle.id}
                                className="grid gap-4 border-b border-[#8B1A1A]/10 px-5 py-5 transition hover:bg-[#FDF8F5] lg:grid-cols-[90px_1fr_150px_130px_130px_130px] lg:items-center"
                            >

                                {/* IMAGE */}

                                <div className="h-20 w-24 overflow-hidden rounded-xl bg-[#8B1A1A]/10">

                                    {image ? (

                                        <img
                                            src={image}
                                            alt={`${vehicle.brand_name} ${vehicle.model}`}
                                            className="h-full w-full object-cover"
                                        />

                                    ) : (

                                        <div className="flex h-full items-center justify-center">

                                            <CarFront size={25} className="text-[#8B1A1A]" />

                                        </div>

                                    )}

                                </div>


                                {/* VEHICLE */}

                                <div>

                                    <div className="flex items-center gap-2">

                                        <p className="text-sm font-bold text-[#8B1A1A]">
                                            {vehicle.brand_name}
                                        </p>

                                        {vehicle.featured && (

                                            <Star
                                                size={14}
                                                className="fill-current text-[#8B1A1A]"
                                            />

                                        )}

                                    </div>

                                    <h3 className="mt-1 text-lg font-extrabold text-[#2D1B0E]">
                                        {vehicle.model}
                                    </h3>

                                    <p className="mt-1 text-xs text-[#8A7A6A]">
                                        {vehicle.variant && `${vehicle.variant} • `}
                                        {vehicle.year}
                                    </p>

                                </div>


                                {/* PRICE */}

                                <div>

                                    <p className="font-extrabold text-[#2D1B0E]">
                                        TZS {formatPrice(vehicle.price)}
                                    </p>

                                    <p className="mt-1 text-xs text-[#8A7A6A]">
                                        {vehicle.location || "No location"}
                                    </p>

                                </div>


                                {/* STATUS */}

                                <div>

                                    <StatusBadgeRed status={vehicle.status} />

                                </div>


                                {/* FEATURED */}

                                <div>

                                    <button
                                        disabled={updatingFeatured === vehicle.id}
                                        onClick={() => handleFeatured(vehicle)}
                                        className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-bold transition disabled:cursor-not-allowed disabled:opacity-50 ${
                                            vehicle.featured
                                                ? "bg-[#8B1A1A]/10 text-[#8B1A1A]"
                                                : "bg-[#FDF8F5] text-[#8A7A6A] hover:bg-[#8B1A1A]/5 hover:text-[#8B1A1A]"
                                        }`}
                                    >

                                        <Star
                                            size={13}
                                            className={vehicle.featured ? "fill-current" : ""}
                                        />

                                        {updatingFeatured === vehicle.id
                                            ? "Updating..."
                                            : vehicle.featured
                                                ? "Featured"
                                                : "Feature"}

                                    </button>

                                </div>


                                {/* ACTIONS */}

                                <div className="flex gap-2">

                                    {/* VIEW */}

                                    <Link
                                        to={`/vehicles/${vehicle.id}`}
                                        className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#FDF8F5] border border-[#8B1A1A]/20 text-[#6A5A4A] transition hover:bg-[#8B1A1A] hover:text-white hover:border-[#8B1A1A]"
                                        title="View"
                                    >

                                        <Eye size={16} />

                                    </Link>


                                    {/* EDIT */}

                                    <Link
                                        to={`/admin/vehicles/${vehicle.id}/edit`}
                                        className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#8B1A1A]/10 text-[#8B1A1A] transition hover:bg-[#8B1A1A] hover:text-white"
                                        title="Edit"
                                    >

                                        <Pencil size={16} />

                                    </Link>


                                    {/* DELETE */}

                                    <button
                                        onClick={() => setDeleteTarget(vehicle)}
                                        className="flex h-9 w-9 items-center justify-center rounded-lg bg-red-50 text-red-500 transition hover:bg-red-500 hover:text-white"
                                        title="Delete"
                                    >

                                        <Trash2 size={16} />

                                    </button>

                                </div>

                            </div>

                        );

                    })}

                </div>

            </main>



            {deleteTarget && (

                <div className="fixed inset-0 z-[100] flex items-center justify-center bg-[#2D1B0E]/40 p-5 backdrop-blur-sm">

                    <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl border border-[#8B1A1A]/20">

                        <div className="flex items-start justify-between">

                            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-red-50">

                                <Trash2 size={22} className="text-red-500" />

                            </div>

                            <button
                                onClick={() => setDeleteTarget(null)}
                                className="rounded-lg p-2 text-[#8A7A6A] hover:bg-[#FDF8F5]"
                            >

                                <X size={20} />

                            </button>

                        </div>


                        <h2 className="mt-5 text-xl font-extrabold text-[#2D1B0E]">
                            Delete this vehicle?
                        </h2>

                        <p className="mt-2 text-sm leading-6 text-[#6A5A4A]">

                            You are about to permanently
                            delete{" "}

                            <strong className="text-[#2D1B0E]">

                                {deleteTarget.brand_name}{" "}
                                {deleteTarget.model}

                            </strong>

                            . This action cannot be undone.

                        </p>


                        <div className="mt-6 flex gap-3">

                            <button
                                onClick={() => setDeleteTarget(null)}
                                className="flex-1 rounded-xl border border-[#8B1A1A]/20 py-3 font-bold text-[#2D1B0E] transition hover:bg-[#FDF8F5]"
                            >
                                Cancel
                            </button>

                            <button
                                onClick={handleDelete}
                                disabled={deleting}
                                className="flex-1 rounded-xl bg-red-500 py-3 font-bold text-white transition hover:bg-red-600 disabled:opacity-50"
                            >

                                {deleting ? "Deleting..." : "Delete Vehicle"}

                            </button>

                        </div>

                    </div>

                </div>

            )}

        </AdminLayout>

    );

}


// ============================================================
// STAT CARD - DEEP REDISH
// ============================================================

function StatCardRed({
    title,
    value,
    icon: Icon,
}) {

    return (

        <div className="rounded-2xl border border-[#8B1A1A]/15 bg-white p-5 shadow-sm transition hover:border-[#8B1A1A]/30 hover:shadow-md">

            <div className="flex items-center justify-between">

                <div>

                    <p className="text-sm font-semibold text-[#6A5A4A]">
                        {title}
                    </p>

                    <p className="mt-2 text-3xl font-extrabold text-[#2D1B0E]">
                        {value}
                    </p>

                </div>

                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#8B1A1A]/10">

                    <Icon size={23} className="text-[#8B1A1A]" />

                </div>

            </div>

        </div>

    );

}


// ============================================================
// STATUS BADGE - DEEP REDISH
// ============================================================

function StatusBadgeRed({
    status,
}) {

    const styles = {
        available: "bg-green-50 text-green-600",
        reserved: "bg-amber-50 text-amber-600",
        sold: "bg-red-50 text-red-500",
        draft: "bg-[#FDF8F5] text-[#8A7A6A] border border-[#8B1A1A]/10",
        archived: "bg-[#FDF8F5] text-[#8A7A6A] border border-[#8B1A1A]/10",
    };

    return (

        <span
            className={`inline-flex rounded-full px-3 py-1.5 text-xs font-bold capitalize ${
                styles[status] || "bg-[#FDF8F5] text-[#8A7A6A] border border-[#8B1A1A]/10"
            }`}
        >

            {status || "Unknown"}

        </span>

    );

}


export default AdminVehicles;